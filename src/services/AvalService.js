import Aval from 'models/Aval';
import { Observable } from 'rxjs'
import { feathersClient } from '../lib/feathersClient';
import avaldaoContractApi from '../lib/blockchain/AvaldaoContractApi';

class AvalService {

    constructor() {

    }

    /**
     * Obtiene todos los Avales on chain.
     */
    getAvalesOnChain() {
        return new Observable(async subscriber => {
            avaldaoContractApi.getAvales().subscribe(
                async avales => {
                    try {
                        for (let i = 0; i < avales.length; i++) {
                            await this.syncLocalAvalWithOffChainData(avales[i]);
                        }
                        subscriber.next(avales);
                    } catch (error) {
                        console.error("[AvalService] Error sincronizando avales locales con datos off chain.", error);
                        subscriber.error(error);
                    }
                },
                error => {
                    console.error("[AvalService] Error obteniendo avales on chain.", error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Obtiene todos los Avales Off Chain.
     * 
     * TODO diferenciar de aquellos que aún no están en la blockchain.
     */
    getAvalesOffChain() {
        return new Observable(async subscriber => {
            feathersClient.service('avales')
                .find({
                    query: {
                        /*blockchainId: undefined*/
                    }
                })
                .then(response => {
                    let avales = [];
                    for (let i = 0; i < response.total; i++) {
                        let avalData = response.data[i];
                        let aval = this.offChainAvalToAval(avalData);
                        avales.push(aval);
                    }
                    subscriber.next(avales);
                }).catch(error => {
                    console.error("[AvalService] Error obteniendo avales off chain.", error);
                    subscriber.next([]);
                });
        });
    }

    /**
     * Obtiene un aval a partir de su Id.
     * @param id id del aval
     */
    getAvalById(id) {
        return new Observable(async subscriber => {
            avaldaoContractApi.getAval(id).subscribe(
                async aval => {
                    await this.syncLocalAvalWithOffChainData(aval);
                    subscriber.next(aval);
                },
                error => {
                    console.log('[AvalService] Error obteniendo aval on chain.', error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Sincroniza el aval local con los datos off chain.
     * 
     * @param aval aval local.
     */
    async syncLocalAvalWithOffChainData(aval) {

        try {

            let avalData = await feathersClient.service('avales').get(
                aval.id,
                {
                    query: {
                        $select: [
                            /*'blockchainId',*/
                            'status',
                            'avaldaoSignature',
                            'solicitanteSignature',
                            'comercianteSignature',
                            'avaladoSignature'
                        ]
                    }
                });

            // Se obtienen las firmas desde Feathers
            aval.avaldaoSignature = avalData.avaldaoSignature;
            aval.solicitanteSignature = avalData.solicitanteSignature;
            aval.comercianteSignature = avalData.comercianteSignature;
            aval.avaladoSignature = avalData.avaladoSignature;

            // Para mantener la consistencia de los datos,
            // se sincronizan los datos en este punto si se requiere.
            if (/*aval.blockchainId != avalData.blockchainId ||*/
                aval.status.id != avalData.status) {

                this.syncOffChainAvalWithOnChainData(aval).subscribe();
            }

        } catch (e) {
            console.error('[AvalService] Error sincronizando aval local con datos off chain.', e);
            throw e;
        }
    }

    /**
     * Sincroniza el Aval de la Blockchain en Feathers.
     * 
     * @param aval a sincronizar en Feathers.
     * @returns observable 
     */
    syncOffChainAvalWithOnChainData(aval) {

        return new Observable(async subscriber => {

            feathersClient.service('avales').patch(
                aval.id,
                {
                    /*blockchainId: aval.blockchainId,*/
                    status: aval.status.id
                }).
                then(avalData => {
                    console.log('[AvalService] Aval sincronizado off chain.', aval);
                    subscriber.next(aval);
                }).catch(error => {
                    console.error("[AvalService] Error sincronizando aval off chain.", error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Completa un aval.
     * 
     * @param aval a completar
     * @returns observable 
     */
    completarAval(aval) {

        const clientId = aval.clientId;

        return new Observable(async subscriber => {

            feathersClient.service('avales').patch(
                aval.id,
                {
                    comercianteAddress: aval.comercianteAddress,
                    avaladoAddress: aval.avaladoAddress
                }).then(avalData => {
                    console.log('[AvalService] Aval completado en Feathers.', aval);
                    avaldaoContractApi.completarAval(aval).subscribe(
                        aval => {
                            aval.clientId = clientId;
                            //if (aval.blockchainId) {
                            this.syncOffChainAvalWithOnChainData(aval).subscribe();
                            //}
                            subscriber.next(aval);
                        },
                        error => {
                            console.error("[AvalService] Error completando aval on chain.", error);
                            subscriber.error(error);
                        });
                }).catch(error => {
                    console.error("[AvalService] Error completando aval off chain.", error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Firma un aval.
     * 
     * @param aval a firmar
     * @param signer dirección del usuario firmante
     * @returns observable 
     */
    firmarAval(aval, signerAddress) {

        return new Observable(async subscriber => {

            avaldaoContractApi.signAvalOffChain(aval, signerAddress).subscribe(aval => {

                feathersClient.service('avales').patch(
                    aval.id,
                    {
                        solicitanteSignature: aval.solicitanteSignature,
                        comercianteSignature: aval.comercianteSignature,
                        avaladoSignature: aval.avaladoSignature,
                        avaldaoSignature: aval.avaldaoSignature
                    }).then(avalData => {

                        console.log('[AvalService] Se almacenaron las firmas off chain.', aval);
                        subscriber.next(aval);

                        if (aval.isSignaturesComplete() === true) {
                            // Todos los usuarios han firmado el aval.
                            avaldaoContractApi.signAvalOnChain(aval, signerAddress).subscribe(
                                aval => {
                                    subscriber.next(aval);
                                },
                                error => {
                                    console.error('[AvaldaoContractApi] Error firmando aval on chain.', error);
                                    subscriber.error(error);
                                });
                        } else {
                            // Faltan firmas para concretar la firma on chain.
                        }

                    }).catch(error => {
                        console.error("[AvalService] Error almacenando las firmas off chain.", error);
                        subscriber.error(error);
                    });
            });
        });
    }

    offChainAvalToAval(avalData) {
        return new Aval({
            id: avalData._id,
            infoCid: avalData.infoCid,
            proyecto: avalData.proyecto,
            proposito: avalData.proposito,
            causa: avalData.causa,
            adquisicion: avalData.adquisicion,
            beneficiarios: avalData.beneficiarios,
            monto: avalData.monto,
            avaldaoAddress: avalData.avaldaoAddress,
            solicitanteAddress: avalData.solicitanteAddress,
            comercianteAddress: avalData.comercianteAddress,
            avaladoAddress: avalData.avaladoAddress,
            avaldaoSignature: avalData.avaldaoSignature,
            solicitanteSignature: avalData.solicitanteSignature,
            comercianteSignature: avalData.comercianteSignature,
            avaladoSignature: avalData.avaladoSignature,
            status: Aval.mapAvalStatus(parseInt(avalData.status))
        });
    }
}

export default new AvalService();