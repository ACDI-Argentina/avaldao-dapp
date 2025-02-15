import { createSelector, createSlice } from '@reduxjs/toolkit'
import { TokenBalance } from '@acdi/efem-dapp'
import BigNumber from 'bignumber.js';

export const fondoGarantiaSlice = createSlice({
  name: 'fondoGarantia',
  initialState: [

  ],
  reducers: {
    fetchFondoGarantia: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    resetFondoGarantia: (state, action) => {
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        let tokenBalanceStore = action.payload[i].toStore();
        state.push(tokenBalanceStore);
      }
    },
    mergeFondoGarantia: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        let tokenBalanceStore = action.payload[i].toStore();
        let index = state.findIndex(tb => tb.address === tokenBalanceStore.address);
        if (index !== -1) {
          state[index] = tokenBalanceStore;
        } else {
          state.push(tokenBalanceStore);
        }
      }
    }
  },
});

export const {
  fetchFondoGarantia,
  resetFondoGarantia,
  mergeFondoGarantia } = fondoGarantiaSlice.actions;

/* export const selectTokenBalances = state => {
  return state.fondoGarantia.map(function (tokenBalanceStore) {
    return new TokenBalance(tokenBalanceStore);
  });
}
 */

export const selectTokenBalances = createSelector(
  (state) => state.fondoGarantia,
  (fondoGarantia) => fondoGarantia.map((tokenBalanceStore) => new TokenBalance(tokenBalanceStore))
);

/**
 * Obtiene el total de balance en moneda fiat de todos los tokens.
 * 
 */
export const selectFondoGarantiaBalanceFiat = state => {
  let fondoGarantiaBalanceFiat = new BigNumber(0);
  state.fondoGarantia.forEach(tokenBalanceStore => {
    fondoGarantiaBalanceFiat = fondoGarantiaBalanceFiat.plus(tokenBalanceStore.amountFiat);
  });
  return fondoGarantiaBalanceFiat;
}

export default fondoGarantiaSlice.reducer;