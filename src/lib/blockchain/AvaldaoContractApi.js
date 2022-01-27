import { Observable } from 'rxjs'
import BigNumber from 'bignumber.js';
import config from '../../configuration';
import Web3Utils from './Web3Utils'
import web3Manager from './Web3Manager'
import Aval from 'models/Aval'
import avalIpfsConnector from '../../ipfs/AvalIpfsConnector'
import transactionStoreUtils from '../../redux/utils/transactionStoreUtils'
import { AvaldaoAbi, AvalAbi, FondoGarantiaVaultAbi, ExchangeRateProviderAbi } from '@acdi/avaldao-contract';
import avalStoreUtils from 'redux/utils/avalStoreUtils';
import { utils } from 'web3';
import Cuota from 'models/Cuota';
import TokenBalance from 'models/TokenBalance';
import Reclamo from 'models/Reclamo';
import currentUserUtils from 'redux/utils/currentUserUtils';
import roleUtils from 'redux/utils/roleUtils';
import ExchangeRate from '../../models/ExchangeRate';

/**
 * API encargada de la interacción con el Avaldao Smart Contract.
 */
class AvaldaoContractApi {

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
                const canPerform = await this.avaldao.methods.canPerform(user.address, role.hash, []).call();
                if (canPerform === true) {
                    userRoles.push(role);
                }
            }
        } catch (err) {
            console.error(`Error obteniendo roles del usuario ${user.address}.`, err);
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

            const method = this.avaldao.methods.setUserRoles(
                user.address,
                rolesToAdd.map(r => r.hash),
                rolesToRemove.map(r => r.hash));

            const gasEstimated = await this.estimateGas(method, currentUser.address);
            const gasPrice = await this.getGasPrice();

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

    /**
     * Obtiene todos los token balances que conforman el fondo de garantía.
     */
    getFondoGarantia() {
        return new Observable(async subscriber => {
            try {
                let tokenBalances = [];
                let tokens = await this.fondoGarantiaVault.methods.getTokens().call();
                for (let i = 0; i < tokens.length; i++) {
                    let { token,
                        amount,
                        rate,
                        amountFiat } = await this.fondoGarantiaVault.methods.getTokenBalance(tokens[i]).call();
                    tokenBalances.push(new TokenBalance({
                        address: token,
                        amount: amount,
                        rate: rate,
                        amountFiat: amountFiat
                    }));
                }
                subscriber.next(tokenBalances);
            } catch (error) {
                console.log('[Avaldao Contract API] Error obteniendo Fondo de Garantía.', error);
                //subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene todos los Avales desde el Smart Contract.
     */
    getAvales() {
        return new Observable(async subscriber => {
            try {
                let ids = await this.avaldao.methods.getAvalIds().call(); //Devuelve un array de un solo elemento, 614ba578844de200126b50d0
                let avales = [];
                for (let i = 0; i < ids.length; i++) {
                    try {
                        let aval = await this.getAvalById(ids[i]);
                        avales.push(aval);

                    } catch (err) {
                        console.log(err);
                    }
                }
                subscriber.next(avales);
            } catch (error) {
                console.log('[Avaldao Contract API] Error obteniendo Avales.', error);
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene el Aval desde el Smart Contract.
     */
    getAval(id) {
        return new Observable(async subscriber => {
            try {
                let aval = await this.getAvalById(id);
                subscriber.next(aval);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene el Aval a partir del ID especificado.
     * 
     * @param id del Aval a obtener.
     * @returns Aval cuyo Id coincide con el especificado.
     */
    async getAvalById(id) {

        // Se obtiene la información del aval desde la Blockchain.
        const avalAddress = await this.avaldao.methods.getAvalAddress(id).call();
        const avalContract = new this.web3.eth.Contract(AvalAbi, avalAddress);
        const avalOnChain = {
            id: id,
            infoCid: await avalContract.methods.infoCid().call(),
            avaldao: await avalContract.methods.avaldao().call(),
            solicitante: await avalContract.methods.solicitante().call(),
            comerciante: await avalContract.methods.comerciante().call(),
            avalado: await avalContract.methods.avalado().call(),
            montoFiat: await avalContract.methods.montoFiat().call(),
            cuotasCantidad: await avalContract.methods.cuotasCantidad().call(),
            cuotas: [],
            reclamos: [],
            status: await avalContract.methods.status().call()
        };

        for (let cuotaNumero = 1; cuotaNumero <= Number(avalOnChain.cuotasCantidad); cuotaNumero++) {
            const cuotaOnChain = await avalContract.methods.getCuotaByNumero(cuotaNumero).call();
            const cuota = {
                numero: parseInt(cuotaOnChain.numero),
                montoFiat: parseInt(cuotaOnChain.montoFiat),
                timestampVencimiento: parseInt(cuotaOnChain.timestampVencimiento),
                timestampDesbloqueo: parseInt(cuotaOnChain.timestampDesbloqueo),
                status: Cuota.mapCuotaStatus(parseInt(cuotaOnChain.status))
            };
            avalOnChain.cuotas.push(cuota);
        }


        const reclamosCantidad = await avalContract.methods.getReclamosLength().call();
        for (let i = 0; i < reclamosCantidad; i++) {
            const reclamoOnChain = await avalContract.methods.reclamos(i).call();
            const reclamo = {
                numero: reclamoOnChain.numero,
                timestampCreacion: reclamoOnChain.timestampCreacion,
                status: Reclamo.mapReclamoStatus(parseInt(reclamoOnChain.status))
            };
            avalOnChain.reclamos.push(reclamo);
        }

        // Se obtiene la información del aval desde IPFS.
        const avalOffChain = await avalIpfsConnector.download(avalOnChain.infoCid);

        return new Aval({
            id: id,
            address: avalAddress,
            infoCid: avalOnChain.infoCid,
            proyecto: avalOffChain.proyecto,
            proposito: avalOffChain.proposito,
            causa: avalOffChain.causa,
            adquisicion: avalOffChain.adquisicion,
            beneficiarios: avalOffChain.beneficiarios,
            montoFiat: avalOnChain.montoFiat,
            cuotasCantidad: avalOnChain.cuotasCantidad,
            cuotas: avalOnChain.cuotas,
            reclamos: avalOnChain.reclamos,
            solicitanteAddress: avalOnChain.solicitante,
            comercianteAddress: avalOnChain.comerciante,
            avaladoAddress: avalOnChain.avalado,
            avaldaoAddress: avalOnChain.avaldao,
            status: Aval.mapAvalStatus(parseInt(avalOnChain.status))
        });
    }

    /**
     * Almacena el aval en la blockchain.
     *  
     * @param aval a almacenar.
     */
    saveAval(aval) {

        return new Observable(async subscriber => {

            const currentUser = currentUserUtils.getCurrentUser();

            try {
                // Se almacena en IPFS toda la información del Aval.
                let infoCid = await avalIpfsConnector.upload(aval);
                aval.infoCid = infoCid;
            } catch (e) {
                console.error('[AvaldaoContractApi] Error subiendo aval a IPFS.', e);
                subscriber.error(e);
                return;
            }

            const users = [
                aval.avaldaoAddress,
                aval.solicitanteAddress,
                aval.comercianteAddress,
                aval.avaladoAddress
            ];

            // Tiemstamp actual medido en segundos.
            //const timestampCurrent = Math.round(Date.now() / 1000);
            // Simulación de cuotas vencidas.
            const timestampCurrent = Math.round(Date.now() / 1000) - 100 * 24 * 60 * 60;
            // Tiempo entre vencimientos de cuota medido en segundos.
            // 30 días.
            const vencimientoRange = 30 * 24 * 60 * 60;
            // Tiempo de desbloqueo de fondos desde la fecha de venicmiento de una cuota medido en segundos.
            // 10 días.
            const desbloqueoRange = 10 * 24 * 60 * 60;
            const timestampCuotas = [];
            for (let cuotaNumero = 1; cuotaNumero <= aval.cuotasCantidad; cuotaNumero++) {
                const timestampVencimiento = timestampCurrent + (cuotaNumero * vencimientoRange);
                const timestampDesbloqueo = timestampVencimiento + desbloqueoRange;
                timestampCuotas.push(utils.numberToHex(timestampVencimiento));
                timestampCuotas.push(utils.numberToHex(timestampDesbloqueo));
            }

            const method = this.avaldao.methods.saveAval(
                aval.id,
                aval.infoCid,
                users,
                aval.montoFiat,
                timestampCuotas);

            const gasEstimated = await this.estimateGas(method, currentUser.address);
            const gasPrice = await this.getGasPrice();

            let transaction = transactionStoreUtils.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleSaveAval'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleSaveAval'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleSaveAval'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleSaveAval'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionSaveAval'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleSaveAval'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionSaveAval'
                }
            });

            const promiEvent = method.send({
                from: currentUser.address,
            });

            promiEvent.once('transactionHash', (hash) => { // La transacción ha sido creada.

                transaction.submit(hash);
                transactionStoreUtils.updateTransaction(transaction);

                aval.txHash = hash;
                subscriber.next(aval);

            }).once('confirmation', (confNumber, receipt) => {

                transaction.confirme();
                transactionStoreUtils.updateTransaction(transaction);

                // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                // TODO Aquí debería agregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                const avalIdEvent = receipt.events['SaveAval'].returnValues.id;

                // Se instruye al store para obtener el aval actualizado.
                avalStoreUtils.fetchAvalById(avalIdEvent);

            }).on('error', function (error) {

                transaction.fail();
                transactionStoreUtils.updateTransaction(transaction);

                error.aval = aval;
                console.error(`Error procesando transacción para almacenar aval.`, error);
                subscriber.error(error);
            });
        });
    }

    /**
     * Firma un aval fuera de la blockchian.
     * 
     * https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v4
     * https://medium.com/metamask/eip712-is-coming-what-to-expect-and-how-to-use-it-bb92fd1a7a26
     * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
     * 
     * @param aval a firmar
     */
    signAvalOffChain(aval) {

        return new Observable(async subscriber => {

            const currentUser = currentUserUtils.getCurrentUser();

            const typedData = {
                types: {
                    EIP712Domain: [
                        { name: 'name', type: 'string' },
                        { name: 'version', type: 'string' },
                        { name: 'chainId', type: 'uint256' },
                        { name: 'verifyingContract', type: 'address' }
                    ],
                    AvalSignable: [
                        { name: 'aval', type: 'address' },
                        { name: 'infoCid', type: 'string' },
                        { name: 'avaldao', type: 'address' },
                        { name: 'solicitante', type: 'address' },
                        { name: 'comerciante', type: 'address' },
                        { name: 'avalado', type: 'address' }
                    ]
                },
                primaryType: 'AvalSignable',
                domain: {
                    name: 'Avaldao',
                    version: config.version,
                    chainId: config.network.requiredId,
                    verifyingContract: config.avaldaoContractAddress
                },
                message: {
                    aval: aval.address,
                    infoCid: aval.infoCid,
                    avaldao: aval.avaldaoAddress,
                    solicitante: aval.solicitanteAddress,
                    comerciante: aval.comercianteAddress,
                    avalado: aval.avaladoAddress
                }
            };

            const data = JSON.stringify(typedData);

            this.web3.currentProvider.request(
                {
                    method: "eth_signTypedData_v4",
                    params: [currentUser.address, data],
                    from: currentUser.address
                }).then(async result => {
                    console.log('[AvaldaoContractApi] Firma de aval off chain.', result);
                    aval.updateSignature(currentUser.address, result);
                    subscriber.next(aval);
                }).catch(error => {
                    console.error('[AvaldaoContractApi] Error firmando aval off chain.', error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Firma un aval en la blockchain.
     * 
     * https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v4
     * https://medium.com/metamask/eip712-is-coming-what-to-expect-and-how-to-use-it-bb92fd1a7a26
     * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
     * 
     * @param aval a firmar
     */
    signAvalOnChain(aval) {

        return new Observable(async subscriber => {

            const currentUser = currentUserUtils.getCurrentUser();

            const avaldaoSignatureR = "0x" + aval.avaldaoSignature.substring(2).substring(0, 64);
            const avaldaoSignatureS = "0x" + aval.avaldaoSignature.substring(2).substring(64, 128);
            const avaldaoSignatureV = parseInt(aval.avaldaoSignature.substring(2).substring(128, 130), 16);

            const solicitanteSignatureR = "0x" + aval.solicitanteSignature.substring(2).substring(0, 64);
            const solicitanteSignatureS = "0x" + aval.solicitanteSignature.substring(2).substring(64, 128);
            const solicitanteSignatureV = parseInt(aval.solicitanteSignature.substring(2).substring(128, 130), 16);

            const comercianteSignatureR = "0x" + aval.comercianteSignature.substring(2).substring(0, 64);
            const comercianteSignatureS = "0x" + aval.comercianteSignature.substring(2).substring(64, 128);
            const comercianteSignatureV = parseInt(aval.comercianteSignature.substring(2).substring(128, 130), 16);

            const avaladoSignatureR = "0x" + aval.avaladoSignature.substring(2).substring(0, 64);
            const avaladoSignatureS = "0x" + aval.avaladoSignature.substring(2).substring(64, 128);
            const avaladoSignatureV = parseInt(aval.avaladoSignature.substring(2).substring(128, 130), 16);

            const signatureV = [avaldaoSignatureV, solicitanteSignatureV, comercianteSignatureV, avaladoSignatureV];
            const signatureR = [avaldaoSignatureR, solicitanteSignatureR, comercianteSignatureR, avaladoSignatureR];
            const signatureS = [avaldaoSignatureS, solicitanteSignatureS, comercianteSignatureS, avaladoSignatureS];

            const avalContract = new this.web3.eth.Contract(AvalAbi, aval.address);

            const method = avalContract.methods.sign(
                signatureV,
                signatureR,
                signatureS);

            const gasEstimated = await this.estimateGas(method, currentUser.address);
            const gasPrice = await this.getGasPrice();

            let transaction = transactionStoreUtils.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleSignAval'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleSignAval'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleSignAval'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleSignAval'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionSignAval'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleSignAval'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionSignAval'
                }
            });

            const promiEvent = method.send({
                from: currentUser.address
            });

            promiEvent.once('transactionHash', (hash) => { // La transacción ha sido creada.

                transaction.submit(hash);
                transactionStoreUtils.updateTransaction(transaction);

                aval.txHash = hash;
                subscriber.next(aval);

            }).once('confirmation', (confNumber, receipt) => {

                transaction.confirme();
                transactionStoreUtils.updateTransaction(transaction);

                // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                // TODO Aquí debería agregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                //const avalIdEvent = receipt.events['Signed'].returnValues.id;

                // Se instruye al store para obtener el aval actualizado.
                avalStoreUtils.fetchAvalById(aval.id);

            }).on('error', function (error) {

                transaction.fail();
                transactionStoreUtils.updateTransaction(transaction);

                error.aval = aval;
                console.error('[AvaldaoContractApi] Error firmando aval on chain.', error);
                subscriber.error(error);
            });
        });
    }

    /**
     * Desbloquea los fondos de un aval.
     * 
     * @param aval a desbloquear
     */
    desbloquearAval(aval) {

        return new Observable(async subscriber => {

            const currentUser = currentUserUtils.getCurrentUser();

            const avalContract = new this.web3.eth.Contract(AvalAbi, aval.address);

            const method = avalContract.methods.unlockFundManual();

            const gasEstimated = await this.estimateGas(method, currentUser.address);
            const gasPrice = await this.getGasPrice();

            let transaction = transactionStoreUtils.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleDesbloquearAval'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleDesbloquearAval'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleDesbloquearAval'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleDesbloquearAval'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionDesbloquearAval'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleDesbloquearAval'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionDesbloquearAval'
                }
            });

            const promiEvent = method.send({
                from: currentUser.address
            });

            promiEvent.once('transactionHash', (hash) => { // La transacción ha sido creada.

                transaction.submit(hash);
                transactionStoreUtils.updateTransaction(transaction);

                aval.txHash = hash;
                subscriber.next(aval);

            }).once('confirmation', (confNumber, receipt) => {

                transaction.confirme();
                transactionStoreUtils.updateTransaction(transaction);

                // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                // TODO Aquí debería agregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                //const numeroCuota = receipt.events['AvalCuotaUnlock'].returnValues.numeroCuota;

                // Se instruye al store para obtener el aval actualizado.
                avalStoreUtils.fetchAvalById(aval.id);

            }).on('error', function (error) {

                transaction.fail();
                transactionStoreUtils.updateTransaction(transaction);

                error.aval = aval;
                console.error(`Error procesando transacción para desbloquear fondos de aval.`, error);
                subscriber.error(error);
            });
        });
    }

    /**
     * Reclama los fondos de un aval.
     * 
     * @param aval a reclamar
     */
    reclamarAval(aval) {

        return new Observable(async subscriber => {

            const currentUser = currentUserUtils.getCurrentUser();

            const avalContract = new this.web3.eth.Contract(AvalAbi, aval.address);

            const method = avalContract.methods.openReclamo();

            const gasEstimated = await this.estimateGas(method, currentUser.address);
            const gasPrice = await this.getGasPrice();

            let transaction = transactionStoreUtils.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleReclamarAval'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleReclamarAval'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleReclamarAval'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleReclamarAval'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionReclamarAval'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleReclamarAval'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionReclamarAval'
                }
            });

            const promiEvent = method.send({
                from: currentUser.address
            });

            promiEvent.once('transactionHash', (hash) => { // La transacción ha sido creada.

                transaction.submit(hash);
                transactionStoreUtils.updateTransaction(transaction);

                aval.txHash = hash;
                subscriber.next(aval);

            }).once('confirmation', (confNumber, receipt) => {

                transaction.confirme();
                transactionStoreUtils.updateTransaction(transaction);

                // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                // TODO Aquí debería agregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                //const numeroCuota = receipt.events['AvalCuotaUnlock'].returnValues.numeroCuota;

                // Se instruye al store para obtener el aval actualizado.
                avalStoreUtils.fetchAvalById(aval.id);

            }).on('error', function (error) {

                transaction.fail();
                transactionStoreUtils.updateTransaction(transaction);

                error.aval = aval;
                console.error(`Error procesando transacción para reclamar fondos de aval.`, error);
                subscriber.error(error);
            });
        });
    }

    /**
     * Reintegra los fondos de un aval al comerciante.
     * 
     * @param aval a reintegrar
     */
    reintegrarAval(aval) {

        return new Observable(async subscriber => {

            const currentUser = currentUserUtils.getCurrentUser();

            const avalContract = new this.web3.eth.Contract(AvalAbi, aval.address);

            const method = avalContract.methods.reintegrar();

            const gasEstimated = await this.estimateGas(method, currentUser.address);
            const gasPrice = await this.getGasPrice();

            let transaction = transactionStoreUtils.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleReintegrarAval'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleReintegrarAval'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleReintegrarAval'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleReintegrarAval'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionReintegrarAval'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleReintegrarAval'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionReintegrarAval'
                }
            });

            const promiEvent = method.send({
                from: currentUser.address
            });

            promiEvent.once('transactionHash', (hash) => { // La transacción ha sido creada.

                transaction.submit(hash);
                transactionStoreUtils.updateTransaction(transaction);

                aval.txHash = hash;
                subscriber.next(aval);

            }).once('confirmation', (confNumber, receipt) => {

                transaction.confirme();
                transactionStoreUtils.updateTransaction(transaction);

                // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                // TODO Aquí debería agregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                //const numeroCuota = receipt.events['AvalCuotaUnlock'].returnValues.numeroCuota;

                // Se instruye al store para obtener el aval actualizado.
                avalStoreUtils.fetchAvalById(aval.id);

            }).on('error', function (error) {

                transaction.fail();
                transactionStoreUtils.updateTransaction(transaction);

                error.aval = aval;
                console.error(`Error procesando transacción para reintegrar fondos de aval.`, error);
                subscriber.error(error);
            });
        });
    }

    /**
     * Obtiene todas los tipos de cambios de token.
     */
    getExchangeRates() {
        return new Observable(async subscriber => {
            try {
                const rate = await this.exchangeRateProvider.methods.getExchangeRate(config.nativeToken.address).call();
                // TODO Obtener otros Exchage Rates desde el smart contract.
                let exchangeRates = [];
                // RBTC
                let exchangeRate = new ExchangeRate({
                    tokenAddress: config.nativeToken.address,
                    rate: new BigNumber(rate),
                    date: Date.now()
                });
                exchangeRates.push(exchangeRate);
                subscriber.next(exchangeRates);
            } catch (error) {
                console.error(error);
                subscriber.error(error);
            }
        });
    }

    async estimateGas(method, from) {
        const estimateGas = await method.estimateGas({ from: from });
        return new BigNumber(estimateGas);
    }

    async getGasPrice() {
        const gasPrice = await this.web3.eth.getGasPrice();
        return new BigNumber(gasPrice);
    }

    async getExchangeRateByToken(tokenAddress) {
        return await this.exchangeRateProvider.methods.getExchangeRate(tokenAddress).call();
    }

    updateContracts() {
        const { avaldaoContractAddress, fondoGarantiaVaultContractAddress, exchangeRateProviderContractAddress } = config;
        console.log('[Avaldao Contract API] Se actualizan contratos.', avaldaoContractAddress, fondoGarantiaVaultContractAddress, exchangeRateProviderContractAddress);
        this.avaldao = new this.web3.eth.Contract(AvaldaoAbi, avaldaoContractAddress);
        this.fondoGarantiaVault = new this.web3.eth.Contract(FondoGarantiaVaultAbi, fondoGarantiaVaultContractAddress);
        this.exchangeRateProvider = new this.web3.eth.Contract(ExchangeRateProviderAbi, exchangeRateProviderContractAddress);
    }
}

export default new AvaldaoContractApi();