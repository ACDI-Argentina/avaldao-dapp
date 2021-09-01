import { createSlice } from '@reduxjs/toolkit'
import Aval from 'models/Aval';

export const avalesSlice = createSlice({
  name: 'avales',
  initialState: [

  ],
  reducers: {
    fetchAvalesOnChain: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    fetchAvalesOffChain: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    fetchAval: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    resetAvales: (state, action) => {
      // Se resguardan las Avales Pendientes.
      //var pendings = state.filter(c => c.status.name === Aval.PENDING.name);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        let avalStore = action.payload[i].toStore();
        state.push(avalStore);
      }
      //pendings.forEach(c => state.push(c));
    },
    mergeAvales: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        let avalStore = action.payload[i].toStore();
        let index = state.findIndex(a => a.feathersId === avalStore.feathersId);
        if (index != -1) {
          state[index] = avalStore;
        } else {
          state.push(avalStore);
        }
      }
    },
    completarAval: (state, action) => {
      let aval = action.payload;
      aval.status = Aval.COMPLETANDO;
      const avalStore = aval.toStore();
      let index = state.findIndex(a => a.clientId === avalStore.clientId);
      if (index != -1) {
        state[index] = avalStore;
      }
    },
    firmarAval: (state, action) => {

    },
    updateAvalByClientId: (state, action) => {
      let avalStore = action.payload.toStore();
      let index = state.findIndex(a => a.clientId === avalStore.clientId);
      if (index != -1) {
        state[index] = avalStore;
      }
    },
    deleteAvalByClientId: (state, action) => {
      let avalStore = action.payload.toStore();
      let index = state.findIndex(a => a.clientId === avalStore.clientId);
      if (index != -1) {
        state.splice(index, 1);
      }
    },
    fetchAvalByBlockchainId: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    updateAvalByBlockchainId: (state, action) => {
      let avalStore = action.payload.toStore();
      let index = state.findIndex(a => a.blockchainId === avalStore.blockchainId);
      if (index != -1) {
        state[index] = avalStore;
      } else {
        state.push(avalStore);
      }
    },
  },
});

export const {
  fetchAvalesOnChain,
  fetchAvalesOffChain,
  fetchAval,
  resetAvales,
  completarAval,
  firmarAval,
  updateAvalByClientId,
  fetchAvalByBlockchainId,
  updateAvalByBlockchainId } = avalesSlice.actions;

export const selectAvales = state => {
  return state.avales.map(function (avalStore) {
    return new Aval(avalStore);
  });
}
export const selectAvalByClientId = (state, clientId) => {
  let avalStore = state.avales.find(a => a.clientId === clientId);
  if (avalStore) {
    return new Aval(avalStore);
  }
  return undefined;
}

export default avalesSlice.reducer;