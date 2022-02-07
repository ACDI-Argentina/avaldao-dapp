import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import fondoGarantiaContractApi from '../../lib/blockchain/FondoGarantiaContractApi';

export const fetchFondoGarantiaEpic = action$ => action$.pipe(
  ofType('fondoGarantia/fetchFondoGarantia'),
  mergeMap(action => fondoGarantiaContractApi.getFondoGarantia()),
  map(tokenBalances => ({
    type: 'fondoGarantia/mergeFondoGarantia',
    payload: tokenBalances
  }))
)