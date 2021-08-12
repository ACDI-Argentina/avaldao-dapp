import Aval from 'models/Aval';
import { Observable } from 'rxjs'
import { feathersClient } from '../lib/feathersClient';

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
                        let aval = new Aval({
                            id: parseInt(avalData.id),
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
                            status: Aval.mapAvalStatus(parseInt(avalData.status))
                        });
                        avales.push(aval);
                    }
                    subscriber.next(avales);
                }).catch(error => {
                    console.error("[AvalService] Error obteniendo avales.", error);
                    subscriber.next([]);
                });
        });
    }
}

export default new AvalService();