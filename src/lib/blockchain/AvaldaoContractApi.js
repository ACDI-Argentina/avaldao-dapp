import { Observable } from 'rxjs'
import BigNumber from 'bignumber.js';
import config from '../../configuration';
import Web3Utils from './Web3Utils'
import web3Manager from './Web3Manager'
import CrowdfundingUtils from './CrowdfundingUtils'
import TransactionTracker from './TransactionTracker'
import Aval from 'models/Aval'

/**
 * API encargada de la interacción con el Avaldao Smart Contract.
 */
class AvaldaoContractApi {

    constructor() {
        this.crowdfunding = undefined;
        this.networkPromise = undefined;
        web3Manager.getWeb3().subscribe(web3 => {
            this.web3 = web3;
            this.updateContracts();
            this.crowdfundingUtils = new CrowdfundingUtils(web3, config.crowdfundingAddress);
        });
        this.transactionTracker = new TransactionTracker();
    }

    async canPerformRole(address, role) {
        try {
            const hashedRole = Web3Utils.toKeccak256(role);
            const response = await this.crowdfunding.methods.canPerform(address, hashedRole, []).call();
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
                let campaign = await this.getAvalById(id);
                subscriber.next(campaign);
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
        /*const campaingOnChain = await this.crowdfunding.methods.getCampaign(campaignId).call();
        // Se obtiene la información de la Campaign desde IPFS.
        const { id, infoCid, dacIds, milestoneIds, donationIds, budgetDonationIds, users, status } = campaingOnChain;
        // Se obtiene la información de la Campaign desde IPFS.
        const campaignOnIpfs = await campaignIpfsConnector.download(infoCid);
        const { title, description, imageCid, beneficiaries, categories, url } = campaignOnIpfs;

        return new Campaign({
            id: parseInt(id),
            title: title,
            description: description,
            imageCid: imageCid,
            url: url,
            dacIds: dacIds.map(e => parseInt(e)),
            milestoneIds: milestoneIds.map(e => parseInt(e)),
            donationIds: donationIds.map(e => parseInt(e)),
            budgetDonationIds: budgetDonationIds.map(e => parseInt(e)),
            managerAddress: users[0],
            reviewerAddress: users[1],
            beneficiaries: beneficiaries,
            categories: categories,
            status: this.mapCampaignStatus(parseInt(status))
        });*/

        return new Aval({
        });
    }

    /**
     * Almacena un Aval en el Smart Contarct.
     * 
     * @param aval a almacenar.
     */
    saveAval(aval) {

        return new Observable(async subscriber => {

            subscriber.next(aval);

            /*let thisApi = this;

            const dacId = 1; //preguntar a Mauri que vamos a hacer con esto, esto existe?
            const campaignId = campaign.id || 0; //zero is for new campaigns;
            const isNew = campaignId === 0;

            // Se almacena en IPFS toda la información de la Campaign.
            let infoCid = await campaignIpfsConnector.upload(campaign);
            campaign.infoCid = infoCid;

            const clientId = campaign.clientId;

            const method = this.crowdfunding.methods.saveCampaign(
                campaign.infoCid,
                dacId,
                campaign.reviewerAddress,
                campaignId);

            const gasEstimated = await method.estimateGas({
                from: campaign.managerAddress,
            });
            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: new BigNumber(gasEstimated),
                gasPrice: gasPrice,
                createdTitle: {
                    key: isNew ? 'transactionCreatedTitleCreateCampaign' : 'transactionCreatedTitleUpdateCampaign',
                    args: {
                        campaignTitle: campaign.title
                    }
                },
                createdSubtitle: {
                    key: isNew ? 'transactionCreatedSubtitleCreateCampaign' : 'transactionCreatedSubtitleUpdateCampaign'
                },
                pendingTitle: {
                    key: isNew ? 'transactionPendingTitleCreateCampaign' : 'transactionPendingTitleUpdateCampaign',
                    args: {
                        campaignTitle: campaign.title
                    }
                },
                confirmedTitle: {
                    key: isNew ? 'transactionConfirmedTitleCreateCampaign' : 'transactionConfirmedTitleUpdateCampaign',
                    args: {
                        campaignTitle: campaign.title
                    }
                },
                confirmedDescription: {
                    key: isNew ? 'transactionConfirmedDescriptionCreateCampaign' : 'transactionConfirmedDescriptionUpdateCampaign'
                },
                failuredTitle: {
                    key: isNew ? 'transactionFailuredTitleCreateCampaign' : 'transactionFailuredTitleUpdateCampaign',
                    args: {
                        campaignTitle: campaign.title
                    }
                },
                failuredDescription: {
                    key: isNew ? 'transactionFailuredDescriptionCreateCampaign' : 'transactionFailuredDescriptionUpdateCampaign'
                }
            });

            const promiEvent = method.send({
                from: campaign.managerAddress,
            });

            promiEvent
                .once('transactionHash', (hash) => { // La transacción ha sido creada.

                    transaction.submit(hash);
                    transactionUtils.updateTransaction(transaction);

                    campaign.txHash = hash;
                    subscriber.next(campaign);
                })
                .once('confirmation', (confNumber, receipt) => {

                    transaction.confirme();
                    transactionUtils.updateTransaction(transaction);

                    // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                    // TODO Aquí debería gregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                    const idFromEvent = parseInt(receipt.events['SaveCampaign'].returnValues.id);

                    thisApi.getCampaignById(idFromEvent).then(campaign => {
                        campaign.clientId = clientId;
                        subscriber.next(campaign);
                    });
                })
                .on('error', function (error) {

                    transaction.fail();
                    transactionUtils.updateTransaction(transaction);

                    error.campaign = campaign;
                    console.error(`Error procesando transacción de almacenamiento de campaign.`, error);
                    subscriber.error(error);
                });*/
        });
    }




    async getGasPrice() {
        const gasPrice = await this.web3.eth.getGasPrice();
        return new BigNumber(gasPrice);
    }

    updateContracts() {
        /*console.log('[Crowdfunding Contract API] Se actualizan contratos.');
        const { crowdfundingAddress, exchangeRateProviderAddress } = config;
        this.crowdfunding = new this.web3.eth.Contract(CrowdfundingAbi, crowdfundingAddress);
        this.exchangeRateProvider = new this.web3.eth.Contract(ExchangeRateProviderAbi, exchangeRateProviderAddress);*/
    }
}

export default new AvaldaoContractApi();