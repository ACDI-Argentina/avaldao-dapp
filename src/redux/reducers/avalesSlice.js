import { createSlice } from '@reduxjs/toolkit'
import Aval from 'models/Aval';

export const avalesSlice = createSlice({
  name: 'avales',
  // ////////////////////////////////////////////////////////
  // La siguiente información es provista cuando el aval es solicitado.
  // Issue #10: CU: Solicitar aval
  // En esta esta aún no está implementado el CU.
  initialState: [
    /*
    {
      clientId: 1,
      proyecto: '1. Instalación de cisternas para productores del Gran Chaco',
      proposito: 'Impulsar el desarrollo de los productores de la zona.',
      causa: 'Los productores no tiene acceso al crédito y necesitan un aval.',
      adquisicion: '10 cisternas',
      beneficiarios: '20 productores',
      monto: '10.000 USD',
      status: {
        name: 'Aceptado',
        isLocal: false
      }
    },
    {
      clientId: 2,
      proyecto: '2. Instalación de cisternas para productores del Gran Chaco',
      proposito: 'Impulsar el desarrollo de los productores de la zona.',
      causa: 'Los productores no tiene acceso al crédito y necesitan un aval.',
      adquisicion: '10 cisternas',
      beneficiarios: '20 productores',
      monto: '10.000 USD',
      status: {
        name: 'Completado',
        isLocal: false
      }
    },
    {
      clientId: 3,
      proyecto: '3. Instalación de cisternas para productores del Gran Chaco',
      proposito: 'Impulsar el desarrollo de los productores de la zona.',
      causa: 'Los productores no tiene acceso al crédito y necesitan un aval.',
      adquisicion: '10 cisternas',
      beneficiarios: '20 productores',
      monto: '10.000 USD',
      status: {
        name: 'Aceptado',
        isLocal: false
      }
    }
    */
  ],
  reducers: {
    fetchAvales: (state, action) => {
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
    updateAval: (state, action) => {
      let avalStore = action.payload.toStore();
      let index = state.findIndex(a => a.id === avalStore.id);
      if (index != -1) {
        state[index] = avalStore;
      }
    },
  },
});

export const { fetchAvales,
  fetchAval,
  resetAvales,
  completarAval,
  firmarAval,
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
export const selectAvalByClientId = (state, clientId) => {
  let avalStore = state.avales.find(a => a.clientId === clientId);
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