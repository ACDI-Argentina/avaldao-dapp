import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators'
import crowdfundingContractApi from '../../lib/blockchain/CrowdfundingContractApi';

/**
 * Epic que reacciona a la acción de obtención de donaciones locales,
 * busca las donaciones en el smart contract y envía la acción de
 * resetear las donaciones locales.
 * 
 * @param action$ de Redux.
 */
export const fetchDonationsEpic = action$ => action$.pipe(
  ofType('donations/fetchDonations'),
  mergeMap(action => crowdfundingContractApi.getDonations()),
  map(donations => ({
    type: 'donations/resetDonations',
    payload: donations
  }))
)

/**
 * Epic que reacciona a la acción de obtención de donaciones locales por sus IDs,
 * busca las donaciones en el smart contract y envía la acción de
 * merge en las donaciones locales.
 * 
 * @param action$ de Redux.
 */
export const fetchDonationsByIdsEpic = action$ => action$.pipe(
  ofType('donations/fetchDonationsByIds'),
  mergeMap(action => crowdfundingContractApi.getDonationsByIds(action.payload)),
  map(donations => ({
    type: 'donations/mergeDonations',
    payload: donations
  }))
)

/**
 * Epic que reacciona a la acción de almacenamiento de donación local,
 * almacena la donación en el smart contract y envía la acción de
 * actualizar la donación local.
 * 
 * @param action$ de Redux.
 */
export const addDonationEpic = action$ => action$.pipe(
  ofType('donations/addDonation'),
  mergeMap(action => crowdfundingContractApi.saveDonation(action.payload)),
  map(donation => ({
    type: 'donations/updateDonationByClientId',
    payload: donation
  })),
  catchError(error => of({
    type: 'donations/deleteDonationByClientId',
    payload: error.donation
  }))
)

/**
 * Epic que reacciona a la acción de transferencia de donaciones.
 * 
 * @param action$ de Redux.
 */
export const transferDonationsEpic = action$ => action$.pipe(
  ofType('donations/transferDonations'),
  mergeMap(action => crowdfundingContractApi.transferDonations(
    action.payload.userAddress,
    action.payload.entityIdFrom,
    action.payload.entityIdTo,
    action.payload.donationIds)),
  map(donationIds => ({
    type: 'donations/fetchDonationsByIds',
    payload: donationIds
  })),
  catchError(error => of({
    type: 'donations/pendiente',
    payload: error
  }))
)