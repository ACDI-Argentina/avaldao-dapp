import { createSlice } from '@reduxjs/toolkit'
import Aval from 'models/Aval';

export const avalesSlice = createSlice({
  name: 'avales',
  initialState: {
    avales: [],
    isLoading: false,
  },
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
      state.avales.splice(0, state.avales.length);
      for (let i = 0; i < action.payload.length; i++) {
        let avalStore = action.payload[i].toStore();
        state.avales.push(avalStore);
      }
    },
    mergeAvales: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        const incomingAval = action.payload[i].toStore();
        const index = state.avales.findIndex(a => a.id === incomingAval.id);
        if (index !== -1) {
          const actual = state.avales[index];
          state.avales[index] = mergeAval(incomingAval, actual);
        } else {
          state.avales.push(incomingAval);
        }
      }
    },
    solicitarAval: (state, action) => {
      const aval = action.payload;
      aval.statusPrev = aval.status;
      aval.status = Aval.SOLICITANDO;
      const avalStore = aval.toStore();
      state.avales.push(avalStore);
      return state;
    },

    actualizarAval: (state, action) => {
      const aval = action.payload;
      aval.statusPrev = aval.status;
      aval.status = Aval.ACTUALIZANDO;
      const avalStore = aval.toStore();
      const index = state.avales.findIndex(a => a.id === avalStore.id);
      if (index >= 0) {
        state.avales[index] = avalStore;
      }
      return state;
    },
    aceptarAval: (state, action) => {
      let aval = action.payload;
      aval.statusPrev = aval.status;
      aval.status = Aval.ACTUALIZANDO;
      const avalStore = aval.toStore();
      let index = state.avales.findIndex(a => a.id === avalStore.id);
      if (index !== -1) {
        state.avales[index] = avalStore;
      }
    },
    rechazarAval: (state, action) => {
      let aval = action.payload;
      aval.statusPrev = aval.status;
      aval.status = Aval.ACTUALIZANDO;
      const avalStore = aval.toStore();
      let index = state.avales.findIndex(a => a.id === avalStore.id);
      if (index !== -1) {
        state.avales[index] = avalStore;
      }
    },
    firmarAval: (state, action) => {
      const aval = action.payload.aval;

    },
    desbloquearAval: (state, action) => {

    },
    reclamarAval: (state, action) => {

    },
    ejecutarGarantia: (state, action) => {

    },
    fetchAvalById: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    updateAvalById: (state, action) => {
      const incoming = action.payload.toStore();
      let index = state.avales.findIndex(a => a.id === incoming.id);
      if (index !== -1) {
        const actual = state.avales[index];
        state.avales[index] = mergeAval(incoming, actual);
      } else {
        state.avales.push(incoming);
      }
    },
    updateAvalByClientId: (state, action) => {
      const avalStore = action.payload.toStore();
      const index = state.avales.findIndex(a => a.clientId === avalStore.clientId);
      if (index !== -1) {
        state.avales[index] = avalStore;
      } else {
        state.avales.push(avalStore);
      }
    },
    rollbackAvalStatus: (state, action) => {
      const avalStore = action.payload.aval.toStore();
      // Se busca por clientId porque no siempre el aval está identificado
      // por un id del backend. Por ejemplo en la solicitud.
      const index = state.avales.findIndex(a => a.clientId === avalStore.clientId);
      if (index !== -1) {
        if (state.avales[index].statusPrev != null) {
          // Se asigna el status anterior y se anula
          // para no volver a hacer un rollback.
          state.avales[index].status = state.avales[index].statusPrev;
          state.avales[index].statusPrev = null;
        }
      }
      return state;
    },
    fetchAvalesOnChainError: (state, action) => {
      //const error = action?.payload;
      return state;
    }
  },
});

function mergeAval(incoming, actual){
  const createdAt = actual.createdAt;
  const fechaInicio = actual.fechaInicio;
  const duracionCuotaSeconds = actual.duracionCuotaSeconds;
  const desbloqueoSeconds = actual.desbloqueoSeconds;
  
  if (incoming.createdAt === undefined) {
    incoming.createdAt = createdAt;
  }
  if(incoming.fechaInicio.trim() === ''){
    incoming.fechaInicio = fechaInicio;
  }

  if(incoming.duracionCuotaSeconds !== ''){
    incoming.duracionCuotaSeconds = duracionCuotaSeconds;
  }

  if(incoming.desbloqueoSeconds !== ''){
    incoming.desbloqueoSeconds = desbloqueoSeconds;
  }

  return incoming;
}

export const {
  fetchAvalesOnChain,
  fetchAvalesOffChain,
  fetchAval,
  resetAvales,
  solicitarAval,
  actualizarAval,
  aceptarAval,
  rechazarAval,
  firmarAval,
  desbloquearAval,
  reclamarAval,
  ejecutarGarantia,
  fetchAvalById,
  updateAvalById,
  rollbackAvalStatus } = avalesSlice.actions;

export const selectAvales = state => {
  return state.avales.avales.map(function (avalStore) {
    return new Aval(avalStore);
  });
}

export const selectUserAvales = (state, user) => {
  return state.avales.avales
    .map(function (avalStore) {
      return new Aval(avalStore);
    }).filter(aval => aval.isParticipant(user));
}

export const selectAvalesWithTask = (state, user) => {
  return state.avales.avales
    .map(function (avalStore) {
      return new Aval(avalStore);
    }).filter(aval => aval.getTaskCode(user) !== null);
}

export const selectAvalesVigentes = (state) => {
  return state.avales.avales
    .map(function (avalStore) {
      return new Aval(avalStore);
    }).filter(aval => aval.isVigente() === true);
}

export const selectAvalesFinalizados = (state) => {
  return state.avales.avales
    .map(function (avalStore) {
      return new Aval(avalStore);
    }).filter(aval => aval.isFinalizado() === true);
}

export const selectAvalByClientId = (state, clientId) => {
  const avalStore = state.avales.avales.find(a => a.clientId === clientId);
  if (avalStore) {
    return new Aval(avalStore);
  }
}

export const selectAvalById = (state, id) => {
  let avalStore = state.avales.avales.find(a => a.id === id);
  if (avalStore) {
    return new Aval(avalStore);
  }
  return undefined;
}
export const selectAllAvales = state => {
  return state.avales.avales;
}

export default avalesSlice.reducer;