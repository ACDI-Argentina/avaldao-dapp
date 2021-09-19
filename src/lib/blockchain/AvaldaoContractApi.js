import { Observable } from 'rxjs'
import BigNumber from 'bignumber.js';
import config from '../../configuration';
import Web3Utils from './Web3Utils'
import web3Manager from './Web3Manager'
import Aval from 'models/Aval'
import avalIpfsConnector from '../../ipfs/AvalIpfsConnector'
import transactionStoreUtils from '../../redux/utils/transactionStoreUtils'
import { AvaldaoAbi, ExchangeRateProviderAbi } from '@acdi/avaldao-contract';
import feathers from '@feathersjs/feathers';
import avalStoreUtils from 'redux/utils/avalStoreUtils';

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
        const avalOnChain = await this.avaldao.methods.getAval(id).call();
        // Se obtiene la información del aval desde la Blockchain.
        const { infoCid,
            avaldao,
            solicitante,
            comerciante,
            avalado,
            status } = avalOnChain;
        // Se obtiene la información del aval desde IPFS.
        const avalOffChain = await avalIpfsConnector.download(infoCid);
        const {
            proyecto,
            proposito,
            causa,
            adquisicion,
            beneficiarios,
            monto } = avalOffChain;

        return new Aval({
            id: id,
            infoCid: infoCid,
            proyecto: proyecto,
            proposito: proposito,
            causa: causa,
            adquisicion: adquisicion,
            beneficiarios: beneficiarios,
            monto: monto,
            avaldaoAddress: avaldao,
            solicitanteAddress: solicitante,
            comercianteAddress: comerciante,
            avaladoAddress: avalado,
            status: Aval.mapAvalStatus(parseInt(status))
        });
    }

    /**
     * Obtiene el monto disponible en moneda FIAT del fondo de garantía.
     * 
     * @returns monto disponible de garantía. 
     */
    async getAvailableFiatFund() {
        let availableFiatFund = 0;
        try {
            availableFiatFund = await this.avaldao.methods.getAvailableFiatFund().call();
        } catch (err) {
            console.error("[AvaldaoContractApi] Fallo al consultar fondos de garantía.", err);
        }
        return new BigNumber(availableFiatFund);
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

            const method = this.avaldao.methods.saveAval(
                aval.id,
                aval.infoCid,
                aval.avaldaoAddress,
                aval.comercianteAddress,
                aval.avaladoAddress,
                aval.monto,
                aval.cuotasCantidad);

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