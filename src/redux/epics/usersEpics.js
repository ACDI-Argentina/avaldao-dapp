import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import { userService } from 'commons';

export const fetchUserByAddressEpic = action$ => action$.pipe(
  ofType('users/fetchUserByAddress'),
  mergeMap(action => userService.loadUserByAddress(action.payload)),
  map(user => ({
    type: 'users/mergeUser',
    payload: user
  }))
)

export const saveUserEpic = (action$) => action$.pipe(
  ofType('users/saveUser'),
  mergeMap(
    action => userService.saveUser(
      action.payload
    ).pipe(
      map(user => ({
        type: 'users/mergeUser',
        payload: user
      }))
    )
  )
)

export const fetchUsersEpic = action$ => action$.pipe(
  ofType('users/fetchUsers'),
  mergeMap(action => {
    console.log('Fetch Users Action:', action);
    return userService.loadUsers();
  }),
  map(users => {
    console.log('Loaded Users:', users);
    return {
      type: 'users/mergeUsers',
      payload: users
    };
  })
);