import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators'
import avalService from 'services/AvalService';
import avaldaoContractApi from '../../lib/blockchain/AvaldaoContractApi';

/**
 * Epic que reacciona a la acción de obtención de avales locales,
 * busca las avales en el smart contract y envía la acción de
 * resetear los avales locales.
 * 
 * @param action$ de Redux.
 */
export const fetchAvalesOnChainEpic = action$ => action$.pipe(
  ofType('avales/fetchAvalesOnChain'),
  mergeMap(action => avalService.getAvalesOnChain()),
  map(avales => ({
    type: 'avales/mergeAvales',
    payload: avales
  }))
)

export const fetchAvalesOffChainEpic = action$ => action$.pipe(
  ofType('avales/fetchAvalesOffChain'),
  mergeMap(action => avalService.getAvalesOffChain()),
  map(avales => ({
    type: 'avales/mergeAvales',
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

export const completarAvalEpic = action$ => action$.pipe(
  ofType('avales/completarAval'),
  mergeMap(action => avalService.completarAval(action.payload)),
  map(aval => ({
    type: 'avales/updateAvalByClientId',
    payload: aval
  })),
  catchError(error => of({
    type: 'avales/deleteAvalByClientId',
    payload: error.aval
  }))
)

export const firmarAvalEpic = action$ => action$.pipe(
  ofType('avales/firmarAval'),
  mergeMap(action => avalService.firmarAval(
    action.payload.aval,
    action.payload.signerAddress
  )),
  map(aval => ({
    type: 'avales/updateAvalByClientId',
    payload: aval
  })),
  catchError(error => of({
    type: 'avales/deleteAvalByClientId',
    payload: error.aval
  }))
)