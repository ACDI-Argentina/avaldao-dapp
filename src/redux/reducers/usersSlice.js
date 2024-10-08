import { createSlice } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { User } from '@acdi/efem-dapp';
import { web3Utils } from 'commons';

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [], // List of User instances with roles
        loading: false, // Indicates loading state
    },
    reducers: {
        fetchUserByAddress: (state, action) => {
            // Solo se obtiene el estado actual.
            state.loading = true; 
        },
        /**
         * Almacena el user al estado global.
         */
        saveUser: (state, action) => {
            let userStore = action.payload.toStore();
            let index = state.users.findIndex(u => u.address === userStore.address);
            if (index !== -1) {
                // El usuario ya existe localmente,
                // por lo que se realiza un merge de sus datos con los actuales.
                state.users[index] = merge(state.users[index], userStore);
            } else {
                // El usuario es nuevo localmente
                state.users.push(userStore);
            }
            
        },
        /**
         * Actualiza el user al estado global.
         */
        mergeUser: (state, action) => {
            let userStore = action.payload.toStore();
            let index = state.users.findIndex(u => u.address === userStore.address);
            if (index !== -1) {
                // El usuario ya existe localmente,
                // por lo que se realiza un merge de sus datos con los actuales.
                state.users[index] = merge(state.users[index], userStore);
            } else {
                // El usuario es nuevo localmente
                state.users.push(userStore);
            }
           
        },
        fetchUsers: (state, action) => {
            state.loading = true; 
        },
        mergeUsers: (state, action) => { //this is triggered when all users are fetched?
            for (let i = 0; i < action.payload.length; i++) {
                let userStore = action.payload[i].toStore();
                let index = state.users.findIndex(u => u.address === userStore.address);
                if (index !== -1) {
                    // El usuario ya existe localmente,
                    // por lo que se realiza un merge de sus datos con los actuales.
                    state.users[index] = merge(state.users[index], userStore);
                } else {
                    // El usuario es nuevo localmente
                    state.users.push(userStore);
                }
                state.loading = false; 
            }
        },
        fetchUsersFailed: (state,action) => {
            console.log("Handle fetching users failed from slice");
            state.loading = false;
        }
    },
});

/**
 * Realiza el merge del estado de un usuario con uno nuevo.
 * 
 * Si los datos nuevos están definidos, se priorizan por sobre el estado actual.
 * 
 */
function merge(stateUser, newUser) {
    let address = stateUser.address;
    let name = newUser.name !== '' ? newUser.name : stateUser.name;
    let email = newUser.email !== '' ? newUser.email : stateUser.email;
    let url = newUser.url !== '' ? newUser.url : stateUser.url;
    let avatar = newUser.avatar !== '' ? newUser.avatar : stateUser.avatar;
    let infoCid = newUser.infoCid !== '' ? newUser.infoCid : stateUser.infoCid;
    let avatarCid = newUser.avatarCid !== '' ? newUser.avatarCid : stateUser.avatarCid;
    let roles = newUser.roles.length !== 0 ? newUser.roles : stateUser.roles;
    let balance = newUser.balance !== new BigNumber(0) ? newUser.balance : stateUser.balance;
    let registered = newUser.registered === true ? newUser.registered : stateUser.registered;
    return {
        address,
        name,
        email,
        url,
        infoCid,
        avatarCid,
        avatar,
        roles,
        balance,
        registered
    };
}

export const {
    saveUser,
    fetchUserByAddress,
    fetchUsers,
    fetchUsersFailed
 } = usersSlice.actions;

export const selectUsers = state => {
    return state.users.users.map(userStore => new User(userStore));
}
export const selectUserByAddress = (state, address) => {
    let userStore = state.users.users.find(u => web3Utils.addressEquals(u.address, address));
    if (userStore) {
        return new User(userStore);
    }
    return undefined;
}
export const selectUsersByRoles = (state, roles) => {
    return state.users.users.map(userStore => new User(userStore)).filter(user => user.hasAnyRoles(roles));
}
export const selectLoading = state => state.users.loading;

export default usersSlice.reducer;
