import { createSlice } from '@reduxjs/toolkit'
import DAC from '../../models/DAC'
import { selectCascadeDonationsByCampaign, selectCascadeFiatAmountTargetByCampaign } from './campaignsSlice'
import BigNumber from 'bignumber.js'

export const DACsSlice = createSlice({
  name: 'dacs',
  initialState: [], //Array de DACS
  reducers: {
    fetchDacs: (state, action) => {
      //Las dacs se obtienen a traves del epic
    },
    fetchDac: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    resetDacs: (state, action) => {
      // Se resguardan las DACs Pendientes.
      var pendings = state.filter(d => d.status.name === DAC.PENDING.name);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        let dacStore = action.payload[i].toStore();
        state.push(dacStore);
      }
      pendings.forEach(d => state.push(d));
    },
    saveDac: (state, action) => {
      const dac = action.payload;
      dac.status = DAC.PENDING;
      const dacStore = action.payload.toStore();
      const index = state.findIndex(dac => dac.clientId === dacStore.clientId);
      
      if (index != -1) {
        state[index] = dacStore;
      } else {
        state.push(dacStore);
      }
    },
    updateDacByClientId: (state, action) => {
      let dacStore = action.payload.toStore();
      let index = state.findIndex(d => d.clientId === dacStore.clientId);
      if (index != -1) {
        state[index] = dacStore;
      }
    },
    deleteDacByClientId: (state, action) => {
      let dacStore = action.payload.toStore();
      let index = state.findIndex(d => d.clientId === dacStore.clientId);
      if (index != -1) {
        state.splice(index, 1);
      }
    },
    updateDac: (state, action) => {
      let dacStore = action.payload.toStore();
      let index = state.findIndex(d => d.id === dacStore.id);
      if (index != -1) {
        state[index] = dacStore;
      }
    }
  },
});

export const { saveDac, updateDacByClientId, fetchDacs, fetchDac } = DACsSlice.actions;

export const selectDacs = state => {
  return state.dacs.map(function (dacStore) {
    return new DAC(dacStore);
  });
}
export const selectDac = (state, id) => {
  let dacStore = state.dacs.find(d => d.id === id);
  if (dacStore) {
    return new DAC(dacStore);
  }
  return undefined;
}
export const selectCascadeDonationsByDac = (state, id) => {
  let donationIds = [];
  let dacStore = state.dacs.find(d => d.id === id);
  if (dacStore) {
    donationIds = donationIds.concat(dacStore.budgetDonationIds);
    dacStore.campaignIds.forEach(cId => {
      donationIds = donationIds.concat(selectCascadeDonationsByCampaign(state, cId));
    });
  }
  return donationIds;
}
export const selectCascadeFiatAmountTargetByDac = (state, id) => {
  let fiatAmountTarget = new BigNumber(0);
  let dacStore = state.dacs.find(c => c.id === id);
  if (dacStore) {
    dacStore.campaignIds.forEach(cId => {
      fiatAmountTarget = BigNumber.sum(fiatAmountTarget, selectCascadeFiatAmountTargetByCampaign(state, cId));
    });
  }
  return fiatAmountTarget;
}

export default DACsSlice.reducer;