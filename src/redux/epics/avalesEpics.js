import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators'
import avaldaoContractApi from '../../lib/blockchain/AvaldaoContractApi';

/**
 * Epic que reacciona a la acción de obtención de avales locales,
 * busca las avales en el smart contract y envía la acción de
 * resetear los avales locales.
 * 
 * @param action$ de Redux.
 */
export const fetchAvalesEpic = action$ => action$.pipe(
  ofType('avales/fetchAvales'),
  mergeMap(action => avaldaoContractApi.getAvales()),
  map(avales => ({
    type: 'avales/resetAvales',
    payload: avales
  }))
)

export const fetchAvalEpic = action$ => action$.pipe(
  ofType('avales/fetchAval'),
  mergeMap(action => avaldaoContractApi.getAval(action.payload)),
  map(aval => ({
    type: 'avales/updateAval',
    payload: aval
  }))
)

/**
 * Epic que reacciona a la acción de almacenamiento de Aval local,
 * almacena el Aval en el smart contract y envía la acción de
 * actualizar el aval local.
 * 
 * @param action$ de Redux.
 */
export const saveAvalEpic = action$ => action$.pipe(
  ofType('avales/saveAval'),
  mergeMap(action => avaldaoContractApi.saveAval(action.payload)),
  map(aval => ({
    type: 'avales/updateAvalByClientId',
    payload: aval
  })),
  catchError(error => of({
    type: 'avales/deleteAvalByClientId',
    payload: error.aval
  }))
)