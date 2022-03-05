import Aval from 'models/Aval';
import { Observable } from 'rxjs'
import { feathersClient } from '../lib/feathersClient';
import avaldaoContractApi from '../lib/blockchain/AvaldaoContractApi';
import BigNumber from 'bignumber.js';
import messageUtils from '../redux/utils/messageUtils'
import i18n from "i18n/i18n";

class AvalService {

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
            try {
                const response = await feathersClient.service('avales').find({ query: {/*blockchainId: undefined*/ } })
                let avales = [];
                for (let i = 0; i < response.data.length; i++) { //TODO: Add pagination
                    let avalData = response.data[i];
                    let aval = this.offChainAvalToAval(avalData);
                    avales.push(aval);
                }
                subscriber.next(avales);
            } catch (error) {
                console.error("[AvalService] Error obteniendo avales off chain.", error);
                subscriber.error(error);

            }
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
            if (/*aval.blockchainId !== avalData.blockchainId ||*/
                aval.status.id !== avalData.status) {

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
                }).then(avalData => {
                    console.log('[AvalService] Aval sincronizado off chain.', aval);
                    subscriber.next(aval);
                }).catch(error => {
                    console.error("[AvalService] Error sincronizando aval off chain.", error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Solicita un aval.
     */
    solicitarAval(aval) {
        return new Observable(async subscriber => {
            const clientId = aval.clientId;
            try {
                const avalData = await feathersClient.service('avales').create({
                    ...aval.toFeathers(),
                    status: Aval.SOLICITADO.id,
                });
                let avalSolicitado = this.offChainAvalToAval(avalData);
                avalSolicitado.clientId = clientId;
                console.log('[AvalService] Aval solicitado en Feathers.', avalSolicitado);
                subscriber.next(avalSolicitado);
            } catch (error) {
                console.error("[AvalService] Error solicitando aval off chain.", error);
                subscriber.error({
                    aval: aval,
                    error: error
                });
                
                let cause = error?.message || "";
                if(["Unauthorized", "Forbidden"].includes(error.name)){
                    cause = i18n.t("avalSolicitadoErrorNoAutorizado");
                }
                
                messageUtils.addMessageError({
                    text: [i18n.t('avalSolicitadoError'), cause].join("\n"),
                    error: error
                });
            }
        });
    }

     /**
     * Actualiza un aval.
     */
        actualizarAval(aval) {

        return new Observable(async subscriber => {
            const clientId = aval.clientId;
            try {
                const avalData = await feathersClient.service('avales').update(aval.id, {
                    ...aval.toFeathers(),
                    status: Aval.SOLICITADO.id,
                });

                const avalActualizado = this.offChainAvalToAval(avalData);
                avalActualizado.clientId = clientId;
                console.log('[AvalService] Aval actualizado en Feathers.', avalActualizado);
                subscriber.next(avalActualizado);
            } catch (error) {
                console.error("[AvalService] Error actualizando aval off chain.", error);
                subscriber.error({
                    aval: aval,
                    error: error
                });
                
                let cause = error?.message || "";
                if(["Unauthorized", "Forbidden"].includes(error.name)){
                    cause = i18n.t("avalActualizadoErrorNoAutorizado");
                }
                
                messageUtils.addMessageError({
                    text: [i18n.t('avalActualizadoError'), cause].join("\n"),
                    error: error
                });
            }
        });
    }
    
    

    /**
     * Acepta un aval, almacenándolo on chain.
     */
    aceptarAval(aval) {
        return new Observable(async subscriber => {
            const clientId = aval.clientId;
            avaldaoContractApi.saveAval(aval).subscribe(
                aval => {
                    aval.clientId = clientId;
                    this.syncOffChainAvalWithOnChainData(aval).subscribe();
                    subscriber.next(aval);
                },
                error => {
                    console.error("[AvalService] Error aceptando aval on chain.", error);
                    subscriber.error({
                        aval: aval,
                        error: error
                    });
                });
        });
    }

    /**
     * Rechaza un aval, colocándolo en estado rechazado off chain.
     */
    rechazarAval(aval) {
        return new Observable(async subscriber => {
            try {
                const response = await feathersClient.service('avales').patch(aval.id, { status: Aval.RECHAZADO.id });
                subscriber.next(this.offChainAvalToAval(response));
            } catch (error) {
                console.error("[AvalService] Error rechando aval off chain.", error);
                subscriber.error({
                    aval: aval,
                    error: error
                });
            }
        });
    }

    /**
     * Firma un aval.
     * 
     * @param aval a firmar
     */
    firmarAval(aval) {

        return new Observable(async subscriber => {

            avaldaoContractApi.signAvalOffChain(aval).subscribe(aval => {

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

                        if (aval.areSignaturesComplete() === true) {
                            // Todos los usuarios han firmado el aval.
                            avaldaoContractApi.signAvalOnChain(aval).subscribe(
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

    /**
     * Desbloquea los fondos de un aval.
     * 
     * @param aval a desbloquear
     */
    desbloquearAval(aval) {

        return new Observable(async subscriber => {

            avaldaoContractApi.desbloquearAval(aval).subscribe(aval => {

                console.log('[AvalService] Se desbloquearon los fondos del aval.', aval);
                subscriber.next(aval);
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

            avaldaoContractApi.reclamarAval(aval).subscribe(aval => {

                console.log('[AvalService] Se reclamaron los fondos del aval.', aval);
                subscriber.next(aval);
            });
        });
    }

    /**
     * Reintegra los fondos de un aval al comerciante.
     * 
     * @param aval a reintegrar al comerciante
     */
    reintegrarAval(aval) {

        return new Observable(async subscriber => {

            avaldaoContractApi.reintegrarAval(aval).subscribe(aval => {

                console.log('[AvalService] Se reintegraron los fondos del aval.', aval);
                subscriber.next(aval);
            });
        });
    }

    offChainAvalToAval(avalData) {
        return new Aval({
            id: avalData._id,
            infoCid: avalData.infoCid,
            proyecto: avalData.proyecto,
            objetivo: avalData.objetivo,
            adquisicion: avalData.adquisicion,
            beneficiarios: avalData.beneficiarios,
            montoFiat: new BigNumber(avalData.montoFiat),
            cuotasCantidad: avalData.cuotasCantidad,
            avaldaoAddress: avalData.avaldaoAddress,
            solicitanteAddress: avalData.solicitanteAddress,
            comercianteAddress: avalData.comercianteAddress,
            avaladoAddress: avalData.avaladoAddress,
            avaldaoSignature: avalData.avaldaoSignature,
            solicitanteSignature: avalData.solicitanteSignature,
            comercianteSignature: avalData.comercianteSignature,
            avaladoSignature: avalData.avaladoSignature,
            status: Aval.mapAvalStatus(parseInt(avalData.status)),
            createdAt: avalData.createdAt,
            updatedAt: avalData.updatedAt,
        });
    }
}

export default new AvalService();