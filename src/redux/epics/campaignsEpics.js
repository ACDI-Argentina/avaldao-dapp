import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators'
import crowdfundingContractApi from '../../lib/blockchain/CrowdfundingContractApi';

/**
 * Epic que reacciona a la acción de obtención de campaigns locales,
 * busca las campaigns en el smart contract y envía la acción de
 * resetear las campaigns locales.
 * 
 * @param action$ de Redux.
 */
export const fetchCampaignsEpic = action$ => action$.pipe(
  ofType('campaigns/fetchCampaigns'),
  mergeMap(action => crowdfundingContractApi.getCampaigns()),
  map(campaigns => ({
    type: 'campaigns/resetCampaigns',
    payload: campaigns
  }))
)

export const fetchCampaignEpic = action$ => action$.pipe(
  ofType('campaigns/fetchCampaign'),
  mergeMap(action => crowdfundingContractApi.getCampaign(action.payload)),
  map(campaign => ({
    type: 'campaigns/updateCampaign',
    payload: campaign
  }))
)

/**
 * Epic que reacciona a la acción de almacenamiento de campaign local,
 * almacena la campaign en el smart contract y envía la acción de
 * actualizar la campaign local.
 * 
 * @param action$ de Redux.
 */
export const saveCampaignEpic = action$ => action$.pipe(
  ofType('campaigns/saveCampaign'),
  mergeMap(action => crowdfundingContractApi.saveCampaign(action.payload)),
  map(campaign => ({
    type: 'campaigns/updateCampaignByClientId',
    payload: campaign
  })),
  catchError(error => of({
    type: 'campaigns/deleteCampaignByClientId',
    payload: error.campaign
  }))
)