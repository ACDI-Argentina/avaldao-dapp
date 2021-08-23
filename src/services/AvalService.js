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
                    for (let i = 0; i < avales.length; i++) {
                        let aval = avales[i];
                        try {
                            let avalData = await feathersClient.service('avales').get(
                                aval.feathersId,
                                {
                                    query: {
                                        $select: [
                                            'blockchainId',
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
                            if (aval.blockchainId != avalData.blockchainId ||
                                aval.status.id != avalData.status) {

                                this.syncAval(aval).subscribe();
                            }

                        } catch (error) {
                            console.error("[AvalService] Error obteniendo aval off chain.", aval, error);
                            subscriber.error(error);
                            return;
                        }
                    }
                    subscriber.next(avales);
                },
                error => {
                    console.error("[AvalService] Error obteniendo avales on chain.", error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Obtiene todos los Avales Off Chain.
     */
    getAvalesOffChain() {
        return new Observable(async subscriber => {
            feathersClient.service('avales')
                .find({
                    query: {
                        blockchainId: undefined
                    }
                })
                .then(response => {
                    let avales = [];
                    for (let i = 0; i < response.total; i++) {
                        let avalData = response.data[i];
                        let aval = this.feathersAvalToAval(avalData);
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
     * Completa un aval.
     * 
     * @param aval a completar
     * @returns observable 
     */
    completarAval(aval) {

        const clientId = aval.clientId;

        return new Observable(async subscriber => {

            feathersClient.service('avales').patch(
                aval.feathersId,
                {
                    comercianteAddress: aval.comercianteAddress,
                    avaladoAddress: aval.avaladoAddress
                }).
                then(avalData => {
                    console.log('[AvalService] Aval completado en Feathers.', aval);
                    avaldaoContractApi.saveAval(aval).subscribe(
                        aval => {
                            aval.clientId = clientId;
                            if (aval.blockchainId) {
                                this.syncAval(aval).subscribe();
                            }
                            subscriber.next(aval);
                        }, error => {
                            console.error("[AvalService] Error completando aval en Blockchain.", error);
                            subscriber.error(error);
                        });
                }).catch(error => {
                    console.error("[AvalService] Error completando aval en Feathers.", error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Sincroniza el Aval de la Blockchain en Feathers.
     * 
     * @param aval a sincronizar en Feathers.
     * @returns observable 
     */
    syncAval(aval) {

        return new Observable(async subscriber => {

            feathersClient.service('avales').patch(
                aval.feathersId,
                {
                    blockchainId: aval.blockchainId,
                    status: aval.status.id
                }).
                then(avalData => {
                    console.log('[AvalService] Aval sincronizado en Feathers.', aval);
                    subscriber.next(aval);
                }).catch(error => {
                    console.error("[AvalService] Error sincronizando aval en Feathers.", error);
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
                    aval.feathersId,
                    {
                        solicitanteSignature: aval.solicitanteSignature,
                        comercianteSignature: aval.comercianteSignature,
                        avaladoSignature: aval.avaladoSignature,
                        avaldaoSignature: aval.avaldaoSignature
                    }).
                    then(avalData => {
                        console.log('[AvalService] Se almacenaron las firmas en Feathers.', aval);
                        subscriber.next(aval);
                    }).catch(error => {
                        console.error("[AvalService] Error almacenando las firmas en Feathers.", error);
                        subscriber.error(error);
                    });
            });
        });
    }

    feathersAvalToAval(avalData) {
        return new Aval({
            feathersId: avalData._id,
            blockchainId: parseInt(avalData.blockchainId),
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