import { feathersUsersClient } from '../lib/feathersUsersClient'
import { Observable } from 'rxjs'
import web3Manager from 'lib/blockchain/Web3Manager'
import Web3Utils from 'lib/blockchain/Web3Utils'

/**
 * Servicio encargado de proveer la autenticación del usuario.
 */
class AuthService {

  constructor() {
    web3Manager.getWeb3().subscribe(web3 => {
      this.web3 = web3;
    });
    web3Manager.getAccountAddress().subscribe(async accountAddress => {
      if (accountAddress === null) {
        await this.logout();
      }
    });
  }

  /**
   * Autentica al usuario actual.
   */
  login(currentUser) {

    return new Observable(async subscriber => {

      if (currentUser.registered) {

        // Solamente se autentica un usuario que tiene la cuenta registrada en el sistema.

        const accessToken = await feathersUsersClient.passport.getJWT();

        if (accessToken) {

          const payload = await feathersUsersClient.passport.verifyJWT(accessToken);

          if (Web3Utils.addressEquals(currentUser.address, payload.userId)) {

            try {
              await feathersUsersClient.authenticate();
              console.log(`[Auth Service] Autenticación con JWT almacenado.`);
              currentUser.authenticated = true;
            } catch (error) {
              console.error(`[Auth Service] Error autenticando con JWT almacenado.`, error);
              currentUser.authenticated = false;
            }

            subscriber.next(currentUser);
            return;

          } else {

            console.log(`[Auth Service] JWT almacenado de otro usuario. Se fuerza logout.`);
            await this.logout();
          }
        }

        const authData = {
          strategy: 'web3',
          address: currentUser.address
        };

        try {

          await feathersUsersClient.authenticate(authData);
          currentUser.authenticated = true;

        } catch (response) {

          // normal flow will issue a 401 with a challenge message we need to sign and send to
          // verify our identity
          if (response.code === 401 && response.data.startsWith('Challenge =')) {

            try {
              const msg = response.data.replace('Challenge =', '').trim();
              const signature = await this.web3.eth.personal.sign(msg, currentUser.address);
              authData.signature = signature;
              await feathersUsersClient.authenticate(authData);
              currentUser.authenticated = true;

            } catch (error) {
              console.error(`[Auth Service] Error autenticando con mensaje firmado.`, error);
              currentUser.authenticated = false;
            }
          }
        }

        subscriber.next(currentUser);
        return;

      } else {

        // El usuario no tiene cuenta, por lo que no se autentica.
        subscriber.next(currentUser);
        subscriber.complete();
      }
    });
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  async logout() {
    await feathersUsersClient.logout();
  }
}

export default new AuthService();