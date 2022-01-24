import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators'
import avaldaoContractApi from '../../lib/blockchain/AvaldaoContractApi';

export const fetchExchangeRatesEpic = action$ => action$.pipe(
  ofType('exchangeRates/fetchExchangeRates'),
  mergeMap(action => avaldaoContractApi.getExchangeRates()),
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