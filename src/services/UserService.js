import { feathersClient } from '../lib/feathersClient';
import ErrorPopup from '../components/ErrorPopup';
import ipfsService from '../ipfs/IpfsService';
import crowdfundingContractApi from '../lib/blockchain/CrowdfundingContractApi';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import User from '../models/User';
import { ALL_ROLES } from '../constants/Role';
import messageUtils from '../redux/utils/messageUtils'
import userIpfsConnector from '../ipfs/UserIpfsConnector'

class UserService {

  /**
   * Carga el usuario actual con los siguientes datos.
   * - Address según wallet
   * - Balance según wallet
   * - Datos identificatorios
   * - Roles. 
   * 
   * @param currentUser usuario actual
   */
  loadCurrentUser(currentUser) {

    return new Observable(async subscriber => {

      let address = currentUser.address;

      if (address) {

        try {

          const userData = await feathersClient.service('/users').get(address);
          // Se obtiene la información del usuario desde IPFS.
          const userIpfs = await userIpfsConnector.download(userData.infoCid);

          currentUser.registered = true;
          currentUser.name = userData.name;
          currentUser.email = userData.email;
          currentUser.url = userData.url;
          currentUser.infoCid = userData.infoCid;
          currentUser.avatarCid = userIpfs.avatarCid;
          currentUser.avatar = userIpfs.avatar;
          subscriber.next(currentUser);

          // Se cargan los roles del usuario desde el smart constract
          getRoles(address).then(roles => {
            currentUser.roles = roles;
            subscriber.next(currentUser);
          });

          authenticateFeathers(currentUser).then(authenticated => {
            currentUser.authenticated = authenticated;
            subscriber.next(currentUser);
          });

        } catch (error) {
          console.error('Error obteniendo datos del usuario desde Feathers.', error);
          if (error.code === 404) {
            currentUser.registered = false;
            currentUser.name = undefined;
            currentUser.email = undefined;
            currentUser.url = undefined;
            currentUser.infoCid = undefined;
            currentUser.avatarCid = undefined;
            currentUser.avatar = undefined;
            subscriber.next(currentUser);
            return;
          }
        }
      }
    });
  }

  /**
   * Carga el usuario coincidente con la address.
   * 
   * @param address del usuario.
   */
  loadUserByAddress(address) {

    return new Observable(async subscriber => {

      try {

        const userData = await feathersClient.service('/users').get(address);
        const userIpfs = await userIpfsConnector.download(userData.infoCid);

        const user = new User({
          address: address,
          name: userData.name,
          email: userData.email,
          avatarCid: userIpfs.avatarCid,
          url: userData.url,
          registered: true
        });

        subscriber.next(user);

      } catch (e) {

        if (e.name === 'NotFound') {

          // El usuario no está registrado.
          const user = new User({
            address: address
          });
          subscriber.next(user);

        } else {
          console.error(`Error obteniendo usuario por address ${address}.`, e);
          subscriber.error(e);
        }
      }
    });
  }

  /**
   * Carga los usuarios con sus roles.
   * 
   * TODO Esto deberíamos obtimizarlo porque se están cargadno todos los usuarios
   * al mismo tiempo y cuando crezca la cantidad habrá problemas de performance.
   */
  loadUsersWithRoles() {
    return new Observable(async subscriber => {
      const usersByGroups = [];
      const { data: users } = await feathersClient.service("users").find();
      for (const user of users) {
        const roles = await getRoles(user.address);
        usersByGroups.push(new User({ ...user, roles }));
      }
      subscriber.next(usersByGroups);
    })
  }

  /**
   * Almacena el usuario.
   * 
   * @param user usuario a guardar.
   */
  save(user) {

    return new Observable(async subscriber => {

      try {

        // Se almacena en IPFS toda la información del Usuario.
        let infoCid = await userIpfsConnector.upload(user);
        user.infoCid = infoCid;

        if (user.registered === false) {
          // Nuevo usuario
          await feathersClient.service('users').create(user.toFeathers());
          user.registered = true;
          messageUtils.addMessageSuccess({
            title: 'Bienvenido!',
            text: `Su perfil ha sido registrado`
          });
        } else {
          // Actualización de usuario
          await feathersClient.service('users').update(user.address, user.toFeathers());
          messageUtils.addMessageSuccess({
            text: `Su perfil ha sido actualizado`
          });
        }
        
        subscriber.next(user);

      } catch (error) {
        console.error('[User Service] Error almacenando usuario.', error);
        subscriber.error(error);
        messageUtils.addMessageError({
          text: `Se produjo un error registrando su perfil.`,
          error: error
        });
      }
    });
  }
}

async function authenticateFeathers(user) {
  let authenticated = false;
  if (user) {
    const token = await feathersClient.passport.getJWT();

    if (token) {
      const { userId } = await feathersClient.passport.verifyJWT(token);

      if (user.address === userId) {
        await feathersClient.authenticate(); // authenticate the socket connection
        authenticated = true;
      } else {
        await feathersClient.logout();
      }
    }
  }
  return authenticated;
}

async function getRoles(address) {
  const userRoles = [];
  try {
    for (const rol of ALL_ROLES) {
      const canPerform = await crowdfundingContractApi.canPerformRole(address, rol);
      if (canPerform) userRoles.push(rol);
    }
  } catch (err) {
    console.error(`Error obteniendo roles del usuario ${address}.`, err);
  }
  return userRoles;
}

const pause = (ms = 3000) => {
  return new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), ms)
  });
}

export default UserService;