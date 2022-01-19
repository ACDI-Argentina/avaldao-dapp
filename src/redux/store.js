import { applyMiddleware, compose, combineReducers, createStore } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import loggerMiddleware from './middlewares/logger'
import currentUserReducer from './reducers/currentUserSlice.js'
import usersReducer from './reducers/usersSlice'
import rolesReducer from './reducers/rolesSlice'
import avalesReducer from './reducers/avalesSlice.js'
import fondoGarantiaReducer from './reducers/fondoGarantiaSlice.js'
import messagesReducer from './reducers/messagesSlice.js'
import transactionsReducer from './reducers/transactionsSlice.js'
import exchangeRatesReducer from './reducers/exchangeRatesSlice'

import {
  registerCurrentUserEpic,
  setCurrentUserEpic,
  loadCurrentUserEpic
} from './epics/currentUserEpics';
import {
  fetchAvalesOnChainEpic,
  fetchAvalesOffChainEpic,
  fetchAvalByIdEpic,
  solicitarAvalEpic,
  aceptarAvalEpic,
  rechazarAvalEpic,
  completarAvalEpic,
  firmarAvalEpic,
  desbloquearAvalEpic,
  reclamarAvalEpic,
  reintegrarAvalEpic
} from './epics/avalesEpics'
import {
  fetchUsersEpic,
  fetchUserByAddressEpic,
  saveUserEpic
} from './epics/usersEpics';
import { fetchExchangeRatesEpic } from './epics/exchangeRatesEpics'
import { fetchFondoGarantiaEpic } from './epics/fondoGarantiaEpics'

const rootEpic = combineEpics(
  loadCurrentUserEpic,
  registerCurrentUserEpic,
  setCurrentUserEpic,
  fetchAvalByIdEpic,
  fetchAvalesOnChainEpic,
  fetchAvalesOffChainEpic,
  solicitarAvalEpic,
  aceptarAvalEpic,
  rechazarAvalEpic,
  completarAvalEpic,
  firmarAvalEpic,
  desbloquearAvalEpic,
  reclamarAvalEpic,
  reintegrarAvalEpic,
  saveUserEpic,
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
  avales: avalesReducer,
  fondoGarantia: fondoGarantiaReducer,
  users: usersReducer,
  roles: rolesReducer,
  exchangeRates: exchangeRatesReducer
});

export const store = createStore(rootReducer, undefined, composedEnhancers)

epicMiddleware.run(rootEpic);

console.log('Redux store configurado.');