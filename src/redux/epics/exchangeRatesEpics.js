import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators'
import fondoGarantiaContractApi from '../../lib/blockchain/FondoGarantiaContractApi';

export const fetchExchangeRatesEpic = action$ => action$.pipe(
  ofType('exchangeRates/fetchExchangeRates'),
  mergeMap(action => fondoGarantiaContractApi.getExchangeRates()),
  map(exchangeRates => ({
    type: 'exchangeRates/resetExchangeRates',
    payload: exchangeRates
  })),
  catchError(error => of({
    type: "exchangeRates/handleError",
    payload: error,
    error: true
  }))
)