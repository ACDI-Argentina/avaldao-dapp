import { Observable } from 'rxjs'
import BigNumber from 'bignumber.js';
import config from '../../configuration';
import Web3Utils from './Web3Utils'
import web3Manager from './Web3Manager'
import Aval from 'models/Aval'
import avalIpfsConnector from '../../ipfs/AvalIpfsConnector'
import transactionStoreUtils from '../../redux/utils/transactionStoreUtils'
import { AvaldaoAbi, AvalAbi, ExchangeRateProviderAbi } from '@acdi/avaldao-contract';
import avalStoreUtils from 'redux/utils/avalStoreUtils';
import { utils } from 'web3';
import Cuota from 'models/Cuota';

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

    async canPerformRole(address, role) {
        try {
            const hashedRole = Web3Utils.toKeccak256(role);
            const response = await this.avaldao.methods.canPerform(address, hashedRole, []).call();
            return response;
        } catch (err) {
            console.log("Fail to invoke canPerform on smart contract.", err);
            return false;
        }
    }

    /**
     * Obtiene todos los Avales desde el Smart Contract.
     */
    getAvales() {
        return new Observable(async subscriber => {
            try {
                let ids = await this.avaldao.methods.getAvalIds().call();
                let avales = [];
                for (let i = 0; i < ids.length; i++) {
                    let aval = await this.getAvalById(ids[i]);
                    avales.push(aval);
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
        const aval = new this.web3.eth.Contract(AvalAbi, avalAddress);
        const avalOnChain = {
            id: id,
            infoCid: await aval.methods.infoCid().call(),
            avaldao: await aval.methods.avaldao().call(),
            solicitante: await aval.methods.solicitante().call(),
            comerciante: await aval.methods.comerciante().call(),
            avalado: await aval.methods.avalado().call(),
            montoFiat: await aval.methods.montoFiat().call(),
            cuotasCantidad: await aval.methods.cuotasCantidad().call(),
            cuotas: [],
            status: await aval.methods.status().call()
        };
        for (let cuotaNumero = 1; cuotaNumero <= avalOnChain.cuotasCantidad; cuotaNumero++) {
            const cuotaOnChain = await aval.methods.getCuotaByNumero(cuotaNumero).call();
            const cuota = {
                numero: parseInt(cuotaOnChain.numero),
                monto: parseInt(cuotaOnChain.montoFiat),
                timestampVencimiento: parseInt(cuotaOnChain.timestampVencimiento),
                timestampDesbloqueo: parseInt(cuotaOnChain.timestampDesbloqueo),
                status: Cuota.mapCuotaStatus(parseInt(cuotaOnChain.status))
            };
            avalOnChain.cuotas.push(cuota);
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
            monto: avalOnChain.montoFiat,
            cuotasCantidad: avalOnChain.cuotasCantidad,
            cuotas: avalOnChain.cuotas,
            solicitanteAddress: avalOnChain.solicitante,
            comercianteAddress: avalOnChain.comerciante,
            avaladoAddress: avalOnChain.avalado,
            avaldaoAddress: avalOnChain.avaldao,
            status: Aval.mapAvalStatus(parseInt(avalOnChain.status))
        });
    }

    /**
     * Obtiene el monto disponible en moneda FIAT del fondo de garantía.
     * 
     * @returns monto disponible de garantía. 
     */
    async getAvailableFundFiat() {
        let availableFundFiat = 0;
        try {
            availableFundFiat = await this.avaldao.methods.getAvailableFundFiat().call();
        } catch (err) {
            console.error("[AvaldaoContractApi] Fallo al consultar fondos de garantía.", err);
        }
        return new BigNumber(availableFundFiat);
    }

    /**
     * Completa el aval, almacenándolo en la blockchain.
     *  
     * @param aval a completar y almacenar.
     */
    completarAval(aval) {

        return new Observable(async subscriber => {

            try {
                // Se almacena en IPFS toda la información del Aval.
                let infoCid = await avalIpfsConnector.upload(aval);
                aval.infoCid = infoCid;
            } catch (e) {
                console.error('[AvaldaoContractApi] Error subiendo aval a IPFS.', e);
                subscriber.error(e);
                return;
            }

            const users = [aval.solicitanteAddress,
            aval.comercianteAddress,
            aval.avaladoAddress,
            aval.avaldaoAddress];

            // Cuota 1: Vencimiento Thursday, July 1, 2021 12:00:00 AM / Desbloqueo Saturday, July 10, 2021 12:00:00 AM
            const cuota1 = {
                numero: 1,
                montoFiat: 1000,
                timestampVencimiento: 1625097600,
                timestampDesbloqueo: 1625875200
            };

            // Cuota 2: Vencimiento Sunday, August 1, 2021 12:00:00 AM / Desbloqueo Tuesday, August 10, 2021 12:00:00 AM
            const cuota2 = {
                numero: 2,
                montoFiat: 1000,
                timestampVencimiento: 1627776000,
                timestampDesbloqueo: 1628553600
            };

            // Cuota 3: Wednesday, September 1, 2021 12:00:00 AM / Desbloqueo Friday, September 10, 2021 12:00:00 AM
            const cuota3 = {
                numero: 3,
                montoFiat: 1000,
                timestampVencimiento: 1630454400,
                timestampDesbloqueo: 1631232000
            };

            // Cuota 4: Vencimiento Friday, October 1, 2021 12:00:00 AM / Desbloqueo Sunday, October 10, 2021 12:00:00 AM
            const cuota4 = {
                numero: 4,
                montoFiat: 1000,
                timestampVencimiento: 1633046400,
                timestampDesbloqueo: 1633824000
            };

            // Cuota 5: Vencimiento Monday, November 1, 2021 12:00:00 AM / Desbloqueo Wednesday, November 10, 2021 12:00:00 AM
            const cuota5 = {
                numero: 5,
                montoFiat: 1000,
                timestampVencimiento: 1635724800,
                timestampDesbloqueo: 1636502400
            };

            // Cuota 6: Vencimiento Wednesday, December 1, 2021 12:00:00 AM / Desbloqueo Friday, December 10, 2021 12:00:00 AM
            const cuota6 = {
                numero: 6,
                montoFiat: 1000,
                timestampVencimiento: 1638316800,
                timestampDesbloqueo: 1639094400
            };

            const cuotas = [cuota1, cuota2, cuota3, cuota4, cuota5, cuota6];

            const timestampCuotas = [];
            for (let i = 0; i < cuotas.length; i++) {
                const cuota = cuotas[i];
                timestampCuotas.push(utils.numberToHex(cuota.timestampVencimiento));
                timestampCuotas.push(utils.numberToHex(cuota.timestampDesbloqueo));
            }

            const method = this.avaldao.methods.saveAval(
                aval.id,
                aval.infoCid,
                users,
                aval.monto,
                timestampCuotas);

            const gasEstimated = await this.estimateGas(method, aval.solicitanteAddress);
            const gasPrice = await this.getGasPrice();

            let transaction = transactionStoreUtils.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleCompletarAval'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleCompletarAval'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleCompletarAval'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleCompletarAval'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionCompletarAval'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleCompletarAval'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionCompletarAval'
                }
            });

            const promiEvent = method.send({
                from: aval.solicitanteAddress,
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
                console.error(`Error procesando transacción para completar aval.`, error);
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
     * @param signerAddress dirección del usuario firmante
     */
    signAvalOffChain(aval, signerAddress) {

        return new Observable(async subscriber => {

            const typedData = {
                types: {
                    EIP712Domain: [
                        { name: 'name', type: 'string' },
                        { name: 'version', type: 'string' },
                        { name: 'chainId', type: 'uint256' },
                        { name: 'verifyingContract', type: 'address' }
                    ],
                    AvalSignable: [
                        { name: 'id', type: 'string' },
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
                    id: aval.id,
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
                    params: [signerAddress, data],
                    from: signerAddress
                }).then(async result => {
                    console.log('[AvaldaoContractApi] Firma de aval off chain.', result);
                    aval.updateSignature(signerAddress, result);
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
     * @param signerAddress dirección del usuario firmante
     */
    signAvalOnChain(aval, signerAddress) {

        return new Observable(async subscriber => {

            const solicitanteSignatureR = "0x" + aval.solicitanteSignature.substring(2).substring(0, 64);
            const solicitanteSignatureS = "0x" + aval.solicitanteSignature.substring(2).substring(64, 128);
            const solicitanteSignatureV = parseInt(aval.solicitanteSignature.substring(2).substring(128, 130), 16);

            const comercianteSignatureR = "0x" + aval.comercianteSignature.substring(2).substring(0, 64);
            const comercianteSignatureS = "0x" + aval.comercianteSignature.substring(2).substring(64, 128);
            const comercianteSignatureV = parseInt(aval.comercianteSignature.substring(2).substring(128, 130), 16);

            const avaladoSignatureR = "0x" + aval.avaladoSignature.substring(2).substring(0, 64);
            const avaladoSignatureS = "0x" + aval.avaladoSignature.substring(2).substring(64, 128);
            const avaladoSignatureV = parseInt(aval.avaladoSignature.substring(2).substring(128, 130), 16);

            const avaldaoSignatureR = "0x" + aval.avaldaoSignature.substring(2).substring(0, 64);
            const avaldaoSignatureS = "0x" + aval.avaldaoSignature.substring(2).substring(64, 128);
            const avaldaoSignatureV = parseInt(aval.avaldaoSignature.substring(2).substring(128, 130), 16);

            const signatureV = [solicitanteSignatureV, comercianteSignatureV, avaladoSignatureV, avaldaoSignatureV];
            const signatureR = [solicitanteSignatureR, comercianteSignatureR, avaladoSignatureR, avaldaoSignatureR];
            const signatureS = [solicitanteSignatureS, comercianteSignatureS, avaladoSignatureS, avaldaoSignatureS];

            const method = this.avaldao.methods.signAval(
                aval.id,
                signatureV,
                signatureR,
                signatureS);

            const gasEstimated = await this.estimateGas(method, signerAddress);
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
                from: signerAddress
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
                const avalIdEvent = receipt.events['SignAval'].returnValues.id;

                // Se instruye al store para obtener el aval actualizado.
                avalStoreUtils.fetchAvalById(avalIdEvent);

            }).on('error', function (error) {

                transaction.fail();
                transactionStoreUtils.updateTransaction(transaction);

                error.aval = aval;
                console.error('[AvaldaoContractApi] Error firmando aval on chain.', error);
                subscriber.error(error);
            });
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
        const { avaldaoContractAddress, exchangeRateProviderContractAddress } = config;
        console.log('[Avaldao Contract API] Se actualizan contratos.', avaldaoContractAddress, exchangeRateProviderContractAddress);
        this.avaldao = new this.web3.eth.Contract(AvaldaoAbi, avaldaoContractAddress);
        this.exchangeRateProvider = new this.web3.eth.Contract(ExchangeRateProviderAbi, exchangeRateProviderContractAddress);
    }
}

export default new AvaldaoContractApi();