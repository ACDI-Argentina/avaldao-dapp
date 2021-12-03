import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import avaldaoContractApi from '../../lib/blockchain/AvaldaoContractApi';

export const fetchFondoGarantiaEpic = action$ => action$.pipe(
  ofType('fondoGarantia/fetchFondoGarantia'),
  mergeMap(action => avaldaoContractApi.getFondoGarantia()),
  map(tokenBalances => ({
    type: 'fondoGarantia/mergeFondoGarantia',
    payload: tokenBalances
  }))
)