import { Observable } from 'rxjs'
import config from '../../configuration'
import web3Manager from './Web3Manager'
import transactionStoreUtils from '../../redux/utils/transactionStoreUtils'
import { AdminAbi } from '@acdi/avaldao-contract'
import currentUserUtils from 'redux/utils/currentUserUtils'
import roleUtils from 'redux/utils/roleUtils'
import utilsContractApi from './UtilsContractApi'

/**
 * API encargada de la interacción con el Admin Smart Contract.
 */
class AdminContractApi {

    constructor() {
        web3Manager.getWeb3().subscribe(web3 => {
            this.web3 = web3;
            this.updateContracts();
        });
    }

    /**
     * Obtiene los roles de un usuario.
     * 
     * @param user usuario del cual se obtienen los roles.
     */
    async getUserRoles(user) {
        const userRoles = [];
        try {
            const roles = roleUtils.getRoles();
            for (const role of roles) {
                const hasUserRole = await this.admin.methods.hasUserRole(
                    user.address,
                    role.app,
                    role.hash).call();
                if (hasUserRole === true) {
                    userRoles.push(role);
                }
            }
        } catch (err) {
            console.error(`[Admin Contract API] Error obteniendo roles del usuario ${user.address}.`, err);
        }
        return userRoles;
    }

    /**
     * Establece los roles del usuario.
     *  
     * @param user sobre el cual se establecen los roles.
     */
    setUserRoles(user, rolesToAdd, rolesToRemove) {

        return new Observable(async subscriber => {

            const currentUser = currentUserUtils.getCurrentUser();

            console.log('setUserRoles',user.address,
            rolesToAdd.map(r => r.hash),
            rolesToAdd.map(r => r.app),
            rolesToRemove.map(r => r.hash),
            rolesToRemove.map(r => r.app));

            const method = this.admin.methods.setUserRoles(
                user.address,
                rolesToAdd.map(r => r.hash),
                rolesToAdd.map(r => r.app),
                rolesToRemove.map(r => r.hash),
                rolesToRemove.map(r => r.app));

            const gasEstimated = await utilsContractApi.estimateGas(method, currentUser.address);
            const gasPrice = await utilsContractApi.getGasPrice();

            let transaction = transactionStoreUtils.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleSetUserRoles'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleSetUserRoles'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleSetUserRoles'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleSetUserRoles'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionSetUserRoles'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleSetUserRoles'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionSetUserRoles'
                }
            });

            const promiEvent = method.send({
                from: currentUser.address
            });

            promiEvent.once('transactionHash', (hash) => { // La transacción ha sido creada.

                transaction.submit(hash);
                transactionStoreUtils.updateTransaction(transaction);

                subscriber.next(user);

            }).once('confirmation', (confNumber, receipt) => {

                transaction.confirme();
                transactionStoreUtils.updateTransaction(transaction);

                // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                // TODO Aquí debería agregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                //const avalIdEvent = receipt.events['SaveAval'].returnValues.id;

                // Se instruye al store para obtener el aval actualizado.
                //avalStoreUtils.fetchAvalById(avalIdEvent);

                subscriber.next(user);

            }).on('error', function (error) {

                transaction.fail();
                transactionStoreUtils.updateTransaction(transaction);

                error.user = user;
                console.error(`Error procesando transacción para configurar roles de usuario.`, error);
                subscriber.error(error);
            });
        });
    }

    updateContracts() {
        const { adminContractAddress } = config;
        this.admin = new this.web3.eth.Contract(AdminAbi, adminContractAddress);
    }
}

export default new AdminContractApi();