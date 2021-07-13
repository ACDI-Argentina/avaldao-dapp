import { createSelector } from 'reselect'
import { selectDac } from '../reducers/dacsSlice';
import { selectCampaign } from '../reducers/campaignsSlice';
import { selectMilestone } from '../reducers/milestonesSlice';

const makeEntitySelect = () => {
  return createSelector(
    [selectDac, selectCampaign, selectMilestone],
    (dac, campaign, milestone) => {
      if (dac) {
        return dac;
      }
      if (campaign) {
        return campaign;
      }
      if (milestone) {
        return milestone;
      }
      return undefined;
    }
  )
}

export default makeEntitySelect;