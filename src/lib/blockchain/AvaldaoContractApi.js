import { Observable } from 'rxjs'
import BigNumber from 'bignumber.js';
import config from '../../configuration';
import Web3Utils from './Web3Utils'
import web3Manager from './Web3Manager'
import Aval from 'models/Aval'
import avalIpfsConnector from '../../ipfs/AvalIpfsConnector'
import transactionUtils from '../../redux/utils/transactionUtils'
import { AvaldaoAbi, ExchangeRateProviderAbi } from '@acdi/avaldao-contract';
import { version } from 'react-dom';

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
            subscriber.next([]);
            /*try {
                let ids = await this.crowdfunding.methods.getCampaignIds().call();
                let campaigns = [];
                for (let i = 0; i < ids.length; i++) {
                    let campaign = await this.getCampaignById(ids[i]);
                    campaigns.push(campaign);
                }
                subscriber.next(campaigns);
            } catch (error) {
                console.log('Error obtiendo Campaigns', error);
                subscriber.error(error);
            }*/
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
        const { proyecto,
            proposito,
            causa,
            adquisicion,
            beneficiarios,
            monto } = avalOffChain;

        return new Aval({
            id: parseInt(id),
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
            status: this.mapAvalStatus(parseInt(status))
        });
    }

    /**
     * Almacena un Aval en el Smart Contract.
     * 
     * @param aval a almacenar.
     */
    saveAval(aval) {

        return new Observable(async subscriber => {

            let thisApi = this;

            const avalId = aval.id || 0; // 0 si es una aval nuevo.
            const isNew = avalId === 0;

            // Se almacena en IPFS toda la información del Aval.
            let infoCid = await avalIpfsConnector.upload(aval);
            aval.infoCid = infoCid;

            const clientId = aval.clientId;

            const method = this.avaldao.methods.saveAval(
                avalId,
                aval.infoCid,
                aval.avaldaoAddress,
                aval.comercianteAddress,
                aval.avaladoAddress);

            const gasEstimated = await this.estimateGas(method, aval.solicitanteAddress);
            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: gasEstimated,
                gasPrice: gasPrice,
                createdTitle: {
                    key: isNew ? 'transactionCreatedTitleCreateAval' : 'transactionCreatedTitleUpdateAval'
                },
                createdSubtitle: {
                    key: isNew ? 'transactionCreatedSubtitleCreateAval' : 'transactionCreatedSubtitleUpdateAval'
                },
                pendingTitle: {
                    key: isNew ? 'transactionPendingTitleCreateAval' : 'transactionPendingTitleUpdateAval'
                },
                confirmedTitle: {
                    key: isNew ? 'transactionConfirmedTitleCreateAval' : 'transactionConfirmedTitleUpdateAval'
                },
                confirmedDescription: {
                    key: isNew ? 'transactionConfirmedDescriptionCreateAval' : 'transactionConfirmedDescriptionUpdateAval'
                },
                failuredTitle: {
                    key: isNew ? 'transactionFailuredTitleCreateAval' : 'transactionFailuredTitleUpdateAval'
                },
                failuredDescription: {
                    key: isNew ? 'transactionFailuredDescriptionCreateAval' : 'transactionFailuredDescriptionUpdateAval'
                }
            });

            const promiEvent = method.send({
                from: aval.solicitanteAddress,
            });

            promiEvent.once('transactionHash', (hash) => { // La transacción ha sido creada.

                transaction.submit(hash);
                transactionUtils.updateTransaction(transaction);

                aval.txHash = hash;
                subscriber.next(aval);

            }).once('confirmation', (confNumber, receipt) => {

                transaction.confirme();
                transactionUtils.updateTransaction(transaction);

                // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                // TODO Aquí debería agregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                const idFromEvent = parseInt(receipt.events['SaveAval'].returnValues.id);

                thisApi.getAvalById(idFromEvent).then(aval => {
                    aval.clientId = clientId;
                    subscriber.next(aval);
                });

            }).on('error', function (error) {

                transaction.fail();
                transactionUtils.updateTransaction(transaction);

                error.aval = aval;
                console.error(`Error procesando transacción de almacenamiento de aval.`, error);
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

    /**
     * Realiza el mapping de los estados del aval en el
     * smart contract con los estados en la dapp.
     * 
     * @param status del aval en el smart contract.
     * @returns estado del aval en la dapp.
     */
    mapAvalStatus(status) {
        switch (status) {
            case 0: return Aval.SOLICITADO;
            case 1: return Aval.RECHAZADO;
            case 2: return Aval.ACEPTADO;
            case 3: return Aval.COMPLETADO;
            case 4: return Aval.VIGENTE;
            case 5: return Aval.FINALIZADO;
        }
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



    /**
     * https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v4
     * https://medium.com/metamask/eip712-is-coming-what-to-expect-and-how-to-use-it-bb92fd1a7a26
     * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
     * 
     * @param {*} signer 
     * @param {*} aval 
     */
    sign(signer, aval) {

        return new Observable(async subscriber => {

            let thisApi = this;
            const clientId = aval.clientId;
            let isNew = true;

            const typedData = {
                types: {
                    EIP712Domain: [
                        { name: 'name', type: 'string' },
                        { name: 'version', type: 'string' },
                        { name: 'chainId', type: 'uint256' },
                        { name: 'verifyingContract', type: 'address' }
                    ],
                    AvalSignable: [
                        { name: 'id', type: 'uint256' },
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
                    version: '1',
                    chainId: 33,
                    verifyingContract: '0x05A55E87d40572ea0F9e9D37079FB9cA11bdCc67'
                },
                message: {
                    id: aval.id,
                    infoCid: aval.infoCid,
                    avaldao: '0xee4b388fb98420811C9e04AE8378330C05A2735a',
                    solicitante: '0xee4b388fb98420811C9e04AE8378330C05A2735a',
                    comerciante: '0xee4b388fb98420811C9e04AE8378330C05A2735a',
                    avalado: '0xee4b388fb98420811C9e04AE8378330C05A2735a'
                }
            };

            const data = JSON.stringify(typedData);

            this.web3.currentProvider.request(
                {
                    method: "eth_signTypedData_v4",
                    params: [signer, data],
                    from: signer
                }).then(async result => {

                    console.log('Result', result);
                    const signature = result.substring(2);
                    console.log('Signature', signature);
                    const r = "0x" + signature.substring(0, 64);
                    const s = "0x" + signature.substring(64, 128);
                    const v = parseInt(signature.substring(128, 130), 16);
                    // The signature is now comprised of r, s, and v.

                    console.log('Signature R', r);
                    console.log('Signature S', s);
                    console.log('Signature V', v);

                    //

                    const signV = [v, v, v, v];
                    const signR = [r, r, r, r];
                    const signS = [s, s, s, s];
                    const method = this.avaldao.methods.signAval(
                        aval.id,
                        signV,
                        signR,
                        signS);

                    const gasEstimated = await this.estimateGas(method, aval.solicitanteAddress);
                    const gasPrice = await this.getGasPrice();
                    
                    let transaction = transactionUtils.addTransaction({
                        gasEstimated: gasEstimated,
                        gasPrice: gasPrice,
                        createdTitle: {
                            key: isNew ? 'transactionCreatedTitleCreateAval' : 'transactionCreatedTitleUpdateAval'
                        },
                        createdSubtitle: {
                            key: isNew ? 'transactionCreatedSubtitleCreateAval' : 'transactionCreatedSubtitleUpdateAval'
                        },
                        pendingTitle: {
                            key: isNew ? 'transactionPendingTitleCreateAval' : 'transactionPendingTitleUpdateAval'
                        },
                        confirmedTitle: {
                            key: isNew ? 'transactionConfirmedTitleCreateAval' : 'transactionConfirmedTitleUpdateAval'
                        },
                        confirmedDescription: {
                            key: isNew ? 'transactionConfirmedDescriptionCreateAval' : 'transactionConfirmedDescriptionUpdateAval'
                        },
                        failuredTitle: {
                            key: isNew ? 'transactionFailuredTitleCreateAval' : 'transactionFailuredTitleUpdateAval'
                        },
                        failuredDescription: {
                            key: isNew ? 'transactionFailuredDescriptionCreateAval' : 'transactionFailuredDescriptionUpdateAval'
                        }
                    });

                    const promiEvent = method.send({
                        from: signer
                    });

                    promiEvent.once('transactionHash', (hash) => { // La transacción ha sido creada.

                        transaction.submit(hash);
                        transactionUtils.updateTransaction(transaction);

                        aval.txHash = hash;
                        subscriber.next(aval);

                    }).once('confirmation', (confNumber, receipt) => {

                        transaction.confirme();
                        transactionUtils.updateTransaction(transaction);

                        // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                        // TODO Aquí debería agregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                        const idFromEvent = parseInt(receipt.events['SignAval'].returnValues.id);

                        thisApi.getAvalById(idFromEvent).then(aval => {
                            aval.clientId = clientId;
                            subscriber.next(aval);
                        });

                    }).on('error', function (error) {

                        transaction.fail();
                        transactionUtils.updateTransaction(transaction);

                        error.aval = aval;
                        console.error(`Error procesando transacción de firmado de aval.`, error);
                        subscriber.error(error);
                    });

                }).catch(error => {
                    console.error(error);
                });
        });
    }
}

export default new AvaldaoContractApi();