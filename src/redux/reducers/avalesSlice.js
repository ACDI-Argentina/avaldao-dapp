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
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        let avalStore = action.payload[i].toStore();
        state.push(avalStore);
      }
    },
    mergeAvales: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        let avalStore = action.payload[i].toStore();
        let index = state.findIndex(a => a.id === avalStore.id);
        if (index != -1) {
          state[index] = avalStore;
        } else {
          state.push(avalStore);
        }
      }
    },
    solicitarAval: (state, action) => {
      const aval = action.payload;
      aval.status = Aval.SOLICITANDO;
      const avalStore = aval.toStore();
      state.push(avalStore);
      return state;
    },
    completarAval: (state, action) => {
      let aval = action.payload;
      aval.status = Aval.COMPLETANDO;
      const avalStore = aval.toStore();
      let index = state.findIndex(a => a.id === avalStore.id);
      if (index != -1) {
        state[index] = avalStore;
      }
    },
    firmarAval: (state, action) => {

    },
    desbloquearAval: (state, action) => {

    },
    reclamarAval: (state, action) => {

    },
    reintegrarAval: (state, action) => {

    },
    fetchAvalById: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    updateAvalById: (state, action) => {
      let avalStore = action.payload.toStore();
      let index = state.findIndex(a => a.id === avalStore.id);
      if (index != -1) {
        state[index] = avalStore;
      } else {
        state.push(avalStore);
      }
    },

    updateAvalByClientId: (state, action) => {
      const avalStore = action.payload.toStore();
      console.log("updateAvalByClientId!", avalStore);
      const index = state.findIndex(a => a.clientId === avalStore.clientId);
      if (index != -1) {
        state[index] = avalStore;
      } else {
        state.push(avalStore);
      }
    },

    solicitarAvalError: (state,action) => {
      const error = action?.payload;
      const avalError = error?.aval;
      
      const idx = state.findIndex(a => a.clientId === avalError.clientId);
      if(idx> -1){
        state[idx].status = Aval.ERROR;
      }

      return state;
    }
  },
});

export const {
  fetchAvalesOnChain,
  fetchAvalesOffChain,
  fetchAval,
  resetAvales,
  solicitarAval,
  completarAval,
  firmarAval,
  desbloquearAval,
  reclamarAval,
  reintegrarAval,
  fetchAvalById,
  updateAvalById } = avalesSlice.actions;

export const selectRawAvales = state => state.avales;

export const selectAvales = state => {
  return state.avales.map(function (avalStore) {
    return new Aval(avalStore);
  });
}
export const selectAvalByClientId = (state, clientId) => {
  const avalStore = state.avales.find(a => a.clientId === clientId);
  if (avalStore) {
    return new Aval(avalStore);
  }
}

export const selectAvalById = (state, id) => {
  let avalStore = state.avales.find(a => a.id === id);
  if (avalStore) {
    return new Aval(avalStore);
  }
  return undefined;
}
export const selectAllAvales = state => {
  return state.avales;
}

export default avalesSlice.reducer;