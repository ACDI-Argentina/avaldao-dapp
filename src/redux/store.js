import { applyMiddleware, compose, combineReducers, createStore } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import loggerMiddleware from './middlewares/logger'
import currentUserReducer from './reducers/currentUserSlice.js'
import usersReducer from './reducers/usersSlice';
import dacsReducer from './reducers/dacsSlice.js'
import campaignsReducer from './reducers/campaignsSlice.js'
import avalesReducer from './reducers/avalesSlice.js'
import fondoGarantiaReducer from './reducers/fondoGarantiaSlice.js'
import milestonesReducer from './reducers/milestonesSlice.js'
import activitiesReducer from './reducers/activitiesSlice.js'
import donationsReducer from './reducers/donationsSlice.js'
import messagesReducer from './reducers/messagesSlice.js'
import transactionsReducer from './reducers/transactionsSlice.js'
import exchangeRatesReducer from './reducers/exchangeRatesSlice'

import { registerCurrentUserEpic, 
  setCurrentUserEpic, 
  loadCurrentUserEpic } from './epics/currentUserEpics';
import { fetchDacsEpic, 
  fetchDacEpic, 
  saveDacEpic } from './epics/dacsEpics';
import {
  fetchMilestonesEpic,
  fetchMilestoneEpic,
  saveMilestoneEpic,
  milestoneCompleteEpic,
  milestoneReviewEpic,
  milestoneWithdrawEpic
} from './epics/milestonesEpics'
import { fetchActivitiesByIdsEpic } from './epics/activitiesEpics'
import { fetchCampaignsEpic, 
  fetchCampaignEpic, 
  saveCampaignEpic } from './epics/campaignsEpics'
import { fetchAvalesOnChainEpic, 
  fetchAvalesOffChainEpic, 
  fetchAvalByIdEpic, 
  completarAvalEpic, 
  firmarAvalEpic, 
  desbloquearAvalEpic } from './epics/avalesEpics'
import { fetchUsersEpic, 
  fetchUserByAddressEpic } from './epics/usersEpics';
import { fetchDonationsEpic, 
  fetchDonationsByIdsEpic, 
  addDonationEpic, 
  transferDonationsEpic } from './epics/donationsEpics'
import { fetchExchangeRatesEpic } from './epics/exchangeRatesEpics'
import { fetchFondoGarantiaEpic } from './epics/fondoGarantiaEpics'

const rootEpic = combineEpics(
  loadCurrentUserEpic,
  registerCurrentUserEpic,
  setCurrentUserEpic,
  fetchDacsEpic,
  fetchDacEpic,
  saveDacEpic,
  fetchCampaignsEpic,
  fetchAvalByIdEpic,
  saveCampaignEpic,
  fetchAvalesOnChainEpic,
  fetchAvalesOffChainEpic,
  fetchCampaignEpic,
  completarAvalEpic,
  firmarAvalEpic,
  desbloquearAvalEpic,
  fetchMilestonesEpic,
  fetchMilestoneEpic,
  saveMilestoneEpic,
  milestoneCompleteEpic,
  milestoneReviewEpic,
  milestoneWithdrawEpic,
  fetchActivitiesByIdsEpic,
  fetchDonationsEpic,
  fetchDonationsByIdsEpic,
  addDonationEpic,
  transferDonationsEpic,
  fetchUsersEpic,
  fetchUserByAddressEpic,
  fetchExchangeRatesEpic,
  fetchFondoGarantiaEpic
);

const epicMiddleware = createEpicMiddleware();

const middlewares = [loggerMiddleware, epicMiddleware]
const middlewareEnhancer = applyMiddleware(...middlewares)

const enhancers = [middlewareEnhancer]
const composedEnhancers = compose(...enhancers)

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  messages: messagesReducer,
  transactions: transactionsReducer,
  dacs: dacsReducer,
  campaigns: campaignsReducer,
  avales: avalesReducer,
  fondoGarantia: fondoGarantiaReducer,
  milestones: milestonesReducer,
  activities: activitiesReducer,
  donations: donationsReducer,
  users: usersReducer,
  exchangeRates: exchangeRatesReducer
});

export const store = createStore(rootReducer, undefined, composedEnhancers)

epicMiddleware.run(rootEpic);

console.log('Redux store configurado.');