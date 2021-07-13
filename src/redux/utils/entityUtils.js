import { store } from '../store';
import { selectDac, fetchDac } from '../reducers/dacsSlice';
import { selectCampaign, fetchCampaign } from '../reducers/campaignsSlice';
import { selectMilestone, fetchMilestone } from '../reducers/milestonesSlice';

class EntityUtils {

  constructor() { }

  refreshEntity(entityId) {
    
    let state = store.getState();
    
    let dac = selectDac(state, entityId);
    if (dac) {
      // El entity es una Dac, por lo que se refresca desde el reducer de Dacs.
      store.dispatch(fetchDac(entityId));
      return;
    }

    let campaign = selectCampaign(state, entityId);
    if (campaign) {
      // El entity es una Campaign, por lo que se refresca desde el reducer de Campaigns.
      store.dispatch(fetchCampaign(entityId));
      return;
    }
    
    let milestone = selectMilestone(state, entityId);
    if (milestone) {
      // El entity es una MIlestone, por lo que se refresca desde el reducer de Milestone.
      store.dispatch(fetchMilestone(entityId));
      return;
    }
  }
}

export default new EntityUtils();