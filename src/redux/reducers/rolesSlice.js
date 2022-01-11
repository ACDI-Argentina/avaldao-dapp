import { createSlice } from '@reduxjs/toolkit';
import Web3Utils from '../../lib/blockchain/Web3Utils';
import Role from 'models/Role';
import {
    SOLICITANTE_ROLE,
    AVALDAO_ROLE,
    COMERCIANTE_ROLE,
    AVALADO_ROLE
} from 'models/Role';

export const rolesSlice = createSlice({
    name: 'roles',
    initialState: [
        {
            value: AVALDAO_ROLE,
            hash: Web3Utils.toKeccak256(AVALDAO_ROLE),
            label: 'Avaldao'
        },
        {
            value: SOLICITANTE_ROLE,
            hash: Web3Utils.toKeccak256(SOLICITANTE_ROLE),
            label: 'Solicitante'
        },
        {
            value: COMERCIANTE_ROLE,
            hash: Web3Utils.toKeccak256(COMERCIANTE_ROLE),
            label: 'Comerciante'
        },
        {
            value: AVALADO_ROLE,
            hash: Web3Utils.toKeccak256(AVALADO_ROLE),
            label: 'Avalado'
        }
    ],
    reducers: {

    }
});

export const selectRoles = state => {
    return state.roles.map(function (roleStore) {
        return new Role(roleStore);
    });
}

export default rolesSlice.reducer;
