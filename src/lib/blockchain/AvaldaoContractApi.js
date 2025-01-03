import { Observable } from 'rxjs'
import config from '../../configuration'
import { web3Manager } from 'commons'
import Aval from 'models/Aval'
import avalIpfsConnector from '../../ipfs/AvalIpfsConnector'
import transactionStoreUtils from '../../redux/utils/transactionStoreUtils'
import { AvaldaoAbi, AvalAbi } from '@acdi/avaldao-contract'
import avalStoreUtils from 'redux/utils/avalStoreUtils'
import { utils } from 'web3'
import Cuota from 'models/Cuota'
import Reclamo from 'models/Reclamo'
import currentUserUtils from 'redux/utils/currentUserUtils'
import utilsContractApi from './UtilsContractApi'
import web3 from 'web3';
import BigNumber from 'bignumber.js'

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

    // Some transactions were rejected due to incorrect gas estimations. 
    // This led to a loss of fees in those cases, sometimes as much as 20 USD. 
    // To mitigate this, we add a 20% buffer to the gas estimation.
    _fixEstimatedGas(gasEstimatedByProvider/* BigNumber */) {
        const factor = 1.2;
        const fixedEstimatedGas = gasEstimatedByProvider.multipliedBy(factor).integerValue(BigNumber.ROUND_FLOOR);

        console.log(`gasEstimatedByProvider: ${gasEstimatedByProvider}`);
        console.log(`gasEstimated: ${fixedEstimatedGas}`);

        return fixedEstimatedGas;
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
            objetivo: avalOffChain.objetivo,
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
     * Se despliega un contrato especifico para gestionar las cuotas del aval
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
            ].map(addr => web3.utils.toChecksumAddress(addr));

            const timestampCuotas = aval.getCuotasTimestamp().map(ts_seconds => utils.numberToHex(ts_seconds));

            const method = this.avaldao.methods.saveAval(
                aval.id,
                aval.infoCid,
                users,
                aval.montoFiat.toString(),
                timestampCuotas
            );

            // Some transactions were rejected due to incorrect gas estimations. 
            // This led to a loss of fees in those cases, sometimes as much as 20 USD. 
            // To mitigate this, we add a 20% buffer to the gas estimation.
            const gasEstimatedByProvider = await utilsContractApi.estimateGas(method, currentUser.address);
            const gasEstimated = this._fixEstimatedGas(gasEstimatedByProvider);
            const gasPrice = await utilsContractApi.getGasPrice();

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
                gasLimit: gasEstimated
            });

            promiEvent.once('transactionHash', (hash) => { // La transacción ha sido creada.

                transaction.submit(hash);
                transactionStoreUtils.updateTransaction(transaction);

                aval.txHash = hash;
                subscriber.next(aval);

            }).once('confirmation', (confNumber, receipt) => {

                console.log("Transaction confirmed, receipt", receipt);

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

            // Some transactions were rejected due to incorrect gas estimations. 
            // This led to a loss of fees in those cases, sometimes as much as 20 USD. 
            // To mitigate this, we add a 20% buffer to the gas estimation.
            const gasEstimatedByProvider = await utilsContractApi.estimateGas(method, currentUser.address);
            const gasEstimated = this._fixEstimatedGas(gasEstimatedByProvider);

            const gasPrice = await utilsContractApi.getGasPrice();

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
                from: currentUser.address,
                gasLimit: gasEstimated
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

            // Some transactions were rejected due to incorrect gas estimations. 
            // This led to a loss of fees in those cases, sometimes as much as 20 USD. 
            // To mitigate this, we add a 20% buffer to the gas estimation.
            const gasEstimatedByProvider = await utilsContractApi.estimateGas(method, currentUser.address);
            const gasEstimated = this._fixEstimatedGas(gasEstimatedByProvider);

            const gasPrice = await utilsContractApi.getGasPrice();

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
                from: currentUser.address,
                gasLimit: gasEstimated
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

            // Some transactions were rejected due to incorrect gas estimations. 
            // This led to a loss of fees in those cases, sometimes as much as 20 USD. 
            // To mitigate this, we add a 20% buffer to the gas estimation.
            const gasEstimatedByProvider = await utilsContractApi.estimateGas(method, currentUser.address);
            const gasEstimated = this._fixEstimatedGas(gasEstimatedByProvider);

            const gasPrice = await utilsContractApi.getGasPrice();

            let transaction = transactionStoreUtils.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleReclamarGarantia'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleReclamarGarantia'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleReclamarGarantia'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleReclamarGarantia'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionReclamarGarantia'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleReclamarGarantia'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionReclamarGarantia'
                }
            });

            const promiEvent = method.send({
                from: currentUser.address,
                gasLimit: gasEstimated
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
     * Ejecuta la garantía de un aval.
     * 
     * @param aval a para el cual se ejecuta la garantía
     */
    ejecutarGarantia(aval) {

        return new Observable(async subscriber => {

            const currentUser = currentUserUtils.getCurrentUser();

            //TODO: La siguiente linea es un patch ya que en el abi presente en @acdi/avaldao-contract, no se encuenta
            //el metodo, quizas falte desplegar una nueva version del modulo ya que en el repo en github si está presente
            const abi = [
                {
                    "constant": false,
                    "inputs": [],
                    "name": "ejecutarGarantia",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
            ];

            const avalContract = new this.web3.eth.Contract(abi, aval.address);
            console.log(`Aval address: ${aval.address} `)

            const method = avalContract.methods.ejecutarGarantia();

            // Some transactions were rejected due to incorrect gas estimations. 
            // This led to a loss of fees in those cases, sometimes as much as 20 USD. 
            // To mitigate this, we add a 20% buffer to the gas estimation.
            const gasEstimatedByProvider = await utilsContractApi.estimateGas(method, currentUser.address);
            const gasEstimated = this._fixEstimatedGas(gasEstimatedByProvider);

            const gasPrice = await utilsContractApi.getGasPrice();

            let transaction = transactionStoreUtils.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleEjecutarGarantia'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleEjecutarGarantia'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleEjecutarGarantia'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleEjecutarGarantia'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionEjecutarGarantia'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleEjecutarGarantia'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionEjecutarGarantia'
                }
            });

            const promiEvent = method.send({
                from: currentUser.address,
                gasLimit: gasEstimated
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
                console.error(`Error procesando transacción para ejecutar garantía de aval.`, error);
                subscriber.error(error);
            });
        });
    }

    updateContracts() {
        const { avaldaoContractAddress } = config;
        this.avaldao = new this.web3.eth.Contract(AvaldaoAbi, avaldaoContractAddress);
    }
}

export default new AvaldaoContractApi();