import { createSlice } from '@reduxjs/toolkit'
import Aval from 'models/Aval';

export const avalesSlice = createSlice({
  name: 'avales',
  initialState: [],
  reducers: {
    fetchAvales: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    fetchAval: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    resetAvales: (state, action) => {
      // Se resguardan las Avals Pendientes.
      //var pendings = state.filter(c => c.status.name === Aval.PENDING.name);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        let avalStore = action.payload[i].toStore();
        state.push(avalStore);
      }
      //pendings.forEach(c => state.push(c));
    },
    saveAval: (state, action) => {
      const aval = action.payload;
      aval.status = Aval.SOLICITADO;
      const avalStore = aval.toStore();
      const index = state.findIndex(a => a.clientId === avalStore.clientId);
      if (index != -1) {
        state[index] = avalStore;
      } else {
        state.push(avalStore);
      }
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
    updateAval: (state, action) => {
      let avalStore = action.payload.toStore();
      let index = state.findIndex(a => a.id === avalStore.id);
      if (index != -1) {
        state[index] = avalStore;
      }
    },
  },
});

export const { fetchAvals,
  fetchAval,
  resetAvals,
  saveAval,
  updateAvalByClientId } = avalesSlice.actions;

export const selectAvales = state => {
  return state.avales.map(function (avalStore) {
    return new Aval(avalStore);
  });
}
export const selectAval = (state, id) => {
  let avalStore = state.avales.find(a => a.id === id);
  if (avalStore) {
    return new Aval(avalStore);
  }
  return undefined;
}
export const selectAvalesByIds = (state, ids) => {
  return state.avales.filter(a => ids.includes(a.id)).map(function (avalStore) {
    return new Aval(avalStore);
  });
}

export default avalesSlice.reducer;