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

      try {

        let address = currentUser.address;

        if (address) {

          feathersClient.service('/users').get(address).then(data => {
            const { name, email, avatar, url } = data;
            currentUser.registered = true;
            currentUser.name = name;
            currentUser.email = email;
            currentUser.avatar = avatar;
            currentUser.url = url;
            subscriber.next(currentUser);
          }).catch(err => {
            console.log('Error obteniendo datos del usuario desde Feathers:', err.message);
            if (err.code === 404) {
              currentUser.registered = false;
              currentUser.name = undefined;
              currentUser.email = undefined;
              currentUser.avatar = undefined;
              currentUser.url = undefined;
              subscriber.next(currentUser);
              return;
            }
          });

          // Se cargan los roles del usuario desde el smart constract
          getRoles(address).then(roles => {
            currentUser.roles = roles;
            subscriber.next(currentUser);
          });

          authenticateFeathers(currentUser).then(authenticated => {
            currentUser.authenticated = authenticated;
            subscriber.next(currentUser);
          });
        }
      } catch (err) {
        console.error('Error obteniendo datos del usuario.', err);
        subscriber.error(err);
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
          avatar: userIpfs.avatar,
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
        } else {
          // Actualización de usuario
          await feathersClient.service('users').update(user.address, user.toFeathers());
        }

        user.registered = true;
        subscriber.next(user);
        messageUtils.addMessageSuccess({
          title: 'Felicitaciones!',
          text: `Su perfil ha sido registrado`
        });

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

  async _updateAvatar(user) {
    if (user._newAvatar) {
      const avatarUrl = await ipfsService.upload(user._newAvatar);
      user.avatar = ipfsService.resolveUrl(avatarUrl);
      delete user._newAvatar;
    }
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