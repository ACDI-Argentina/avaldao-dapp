import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import crowdfundingContractApi from '../../lib/blockchain/CrowdfundingContractApi';

/**
 * Epic que reacciona a la acción de obtención de activities locales por sus IDs,
 * busca las activities en el smart contract y envía la acción de
 * merge en las activities locales.
 * 
 * @param action$ de Redux.
 */
export const fetchActivitiesByIdsEpic = action$ => action$.pipe(
  ofType('activities/fetchActivitiesByIds'),
  mergeMap(action => crowdfundingContractApi.getActivitiesByIds(action.payload)),
  map(activities => ({
    type: 'activities/mergeActivities',
    payload: activities
  }))
)