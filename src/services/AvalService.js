import Aval from 'models/Aval';
import { Observable } from 'rxjs'
import { feathersClient } from '../lib/feathersClient';
import avaldaoContractApi from '../lib/blockchain/AvaldaoContractApi';

class AvalService {

    constructor() {

    }

    /**
     * Obtiene todos los Avales desde Feathers.
     */
    getAvales() {
        return new Observable(async subscriber => {
            feathersClient.service('avales')
                .find()
                .then(response => {
                    let avales = [];
                    for (let i = 0; i < response.total; i++) {
                        let avalData = response.data[i];
                        let aval = this.feathersAvalToAval(avalData);
                        avales.push(aval);
                    }
                    subscriber.next(avales);
                }).catch(error => {
                    console.error("[AvalService] Error obteniendo avales.", error);
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
                    //let aval = this.feathersAvalToAval(avalData);
                    //aval.clientId = clientId;
                    console.log('[AvalService] Aval completado en Feathers.', aval);
                    avaldaoContractApi.saveAval(aval).subscribe(aval => {
                        aval.clientId = clientId;
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
            id: parseInt(avalData.id),
            feathersId: avalData._id,
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