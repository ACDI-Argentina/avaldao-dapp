import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import UserService from '../../services/UserService';

const userService = new UserService();

/**
 * Epic que reacciona a la acción de obtención de una usuario local por su address,
 * busca el usuario en el servicio y envía la acción de
 * merge en los usuarios locales.
 * 
 * @param action$ de Redux.
 */
export const fetchUserByAddressEpic = action$ => action$.pipe(
  ofType('users/fetchUserByAddress'),
  mergeMap(action => userService.loadUserByAddress(action.payload)),
  map(user => ({
    type: 'users/mergeUser',
    payload: user
  }))
)

export const fetchUsersEpic = action$ => action$.pipe(
  ofType('users/fetchUsers'),
  mergeMap(action => userService.loadUsersWithRoles()),
  map(users => ({
    type: 'users/mergeUsers',
    payload: users
  }))
)
