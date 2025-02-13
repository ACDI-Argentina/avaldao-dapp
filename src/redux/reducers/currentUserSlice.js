import { createSelector, createSlice } from '@reduxjs/toolkit';
import { User } from '@acdi/efem-dapp';

/**
 * Estado inicial del usuario.
 */
const currentUserInitialState = {
  status: User.UNREGISTERED.toStore(),
  authenticated: false,
  roles: []
}

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: currentUserInitialState,
  reducers: {
    loadCurrentUser: (state, action) => {
      state.address = action.payload;
      return state;
    },
    loadCurrentUserError: (state, action) => {
      console.error("Load current user error");
    },
    setAuthenticated:(state,action) => { 
      const isAuthenticated = action.payload;
      state.authenticated = isAuthenticated;
    },
 
    updateCurrentUserBalance: (state, action) => {
      console.log("updateCurrentUserBalance");
      const { balance, tokenBalances } = action.payload;
      state.balance = balance;
      state.tokenBalances = tokenBalances;
      return state;
    },
    setCurrentUser: (state, action) => {
      let currentUserStore = action.payload.toStore();
      state.address = currentUserStore.address;
      state.infoCid = currentUserStore.infoCid;
      state.authenticated = currentUserStore.authenticated;
      state.avatar = currentUserStore.avatar;
      state.avatarCid = currentUserStore.avatarCid;
      state.email = currentUserStore.email;
      state.name = currentUserStore.name;
      state.roles = currentUserStore.roles;
      state.registered = currentUserStore.registered;
      state.url = currentUserStore.url;
      state.status = User.REGISTERED;
      return state;
    },
    registerCurrentUser: (state, action) => {
      const user = action.payload;
      action.payload.status = User.REGISTERING;
      if(!user.address){
        return state;
      }
      return action.payload.toStore();
    },
    registerError:  (state, action) => {
      console.log(`handle errors of register new user. Inform to component of error`);
    },
    clearCurrentUser: (state, action) => {
      const initial = {};
      initial.status = User.UNREGISTERED.toStore();
      initial.authenticated = false;
      initial.roles = [];
      return initial;
    }
  },
});

export const { 
  registerCurrentUser, 
  setAuthenticated,
  loadCurrentUser, 
  updateCurrentUserBalance, 
  setCurrentUser, 
  clearCurrentUser 
} = currentUserSlice.actions;

//export const selectCurrentUser = state => new User(state.currentUser); //This returns a new instance on every select
export const selectCurrentUserRaw = (state) => state.currentUser;

export const selectCurrentUser = createSelector(
  selectCurrentUserRaw,
  (currentUser) => new User(currentUser)
);
 

export const selectRoles = state => state.currentUser.roles;

export default currentUserSlice.reducer;