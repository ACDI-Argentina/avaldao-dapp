import { toast } from 'react-toastify';
import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { map, mergeMap, catchError, exhaustMap, tap } from 'rxjs/operators'
import avalService from 'services/AvalService';

export const fetchAvalesOnChainEpic = action$ => action$.pipe(
  ofType('avales/fetchAvalesOnChain'),
  exhaustMap(action => {
    console.log('Fetch Avales On Chain Action:', action);
    return avalService.getAvalesOnChain().pipe(
      map(avales => ({
        type: 'avales/mergeAvales',
        payload: avales
      })),
      catchError(error => {
        console.error('Error fetching avales on-chain:', error);
        return of({
          type: "avales/fetchAvalesOnChainError",
          payload: error,
          error: true
        });
      })
    );
  })
);
export const fetchAvalByIdEpic = action$ => action$.pipe(
  ofType('avales/fetchAvalById'),
  mergeMap(action => avalService.getAvalById(action.payload)),
  map(avales => ({
    type: 'avales/updateAvalById',
    payload: avales
  }))
)

export const fetchAvalesOffChainEpic = action$ => action$.pipe(
  ofType('avales/fetchAvalesOffChain'),
  exhaustMap(action => {
    console.log('Fetch Avales Off Chain Action:', action);
    return avalService.getAvalesOffChain().pipe(
      map(avales => ({
        type: 'avales/mergeAvales',
        payload: avales
      })),
      catchError(error => {
        console.error('Error fetching avales off-chain:', error);
        return of({
          type: "avales/fetchAvalesOffChainError",
          payload: error,
          error: true
        });
      })
    );
  })
);

export const solicitarAvalEpic = action$ => action$.pipe(
  ofType('avales/solicitarAval'),
  mergeMap(action => avalService.solicitarAval(action.payload)),
  map(aval => ({
    type: 'avales/updateAvalByClientId',
    payload: aval
  })),
  catchError(error => of({
    type: "avales/rollbackAvalStatus",
    payload: error
  }))
)

export const actualizarAvalEpic = action$ => action$.pipe(
  ofType('avales/actualizarAval'),
  mergeMap(action => avalService.actualizarAval(action.payload)),
  map(aval => ({
    type: 'avales/updateAvalByClientId',
    payload: aval
  })),
  catchError(error => of({
    type: "avales/rollbackAvalStatus",
    payload: error
  }))
)

export const aceptarAvalEpic = action$ => action$.pipe(
  ofType('avales/aceptarAval'),
  mergeMap(action => avalService.aceptarAval(action.payload)),
  map(aval => ({
    type: 'avales/updateAvalById',
    payload: aval
  })),
  catchError(error => of({
    type: "avales/rollbackAvalStatus",
    payload: error
  }))
)

export const rechazarAvalEpic = action$ => action$.pipe(
  ofType('avales/rechazarAval'),
  mergeMap(action => avalService.rechazarAval(action.payload)),
  map(aval => ({
    type: 'avales/updateAvalById',
    payload: aval
  })),
  catchError(error => of({
    type: "avales/rollbackAvalStatus",
    payload: error
  }))
)

export const firmarAvalEpic = action$ => action$.pipe(
  ofType('avales/firmarAval'),
  mergeMap(action => 
    avalService.firmarAval(action.payload.aval).pipe(
      tap(() => {
        toast.success('Aval has been successfully signed!');
      }),
      catchError(error => {
        toast.error(`Error signing aval: ${error.message || 'Unknown error'}`);
        return of({ type: 'avales/firmarAvalFailed', error }); 
      })
    )
  ),
  map(aval => ({
    type: 'avales/updateAvalById',
    payload: aval
  }))
);

export const desbloquearAvalEpic = action$ => action$.pipe(
  ofType('avales/desbloquearAval'),
  mergeMap(action => avalService.desbloquearAval(
    action.payload.aval
  )),
  map(aval => ({
    type: 'avales/updateAvalById',
    payload: aval
  }))
)

export const reclamarAvalEpic = action$ => action$.pipe(
  ofType('avales/reclamarAval'),
  mergeMap(action => avalService.reclamarAval(
    action.payload.aval
  )),
  map(aval => ({
    type: 'avales/updateAvalById',
    payload: aval
  }))
)

export const ejecutarGarantiaEpic = action$ => action$.pipe(
  ofType('avales/ejecutarGarantia'),
  mergeMap(action => avalService.ejecutarGarantia(
    action.payload.aval
  )),
  map(aval => ({
    type: 'avales/updateAvalById',
    payload: aval
  }))
)