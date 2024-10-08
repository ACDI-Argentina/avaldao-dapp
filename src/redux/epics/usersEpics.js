import { ofType } from 'redux-observable';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators'
import { userService } from 'commons';
import { of } from 'rxjs';

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
  exhaustMap(action => {
    console.log('Fetch Users Action:', action);
    return userService.loadUsers().pipe(
      map(users => {
        console.log('Loaded Users:', users);
        return {
          type: 'users/mergeUsers',
          payload: users
        };
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        return of({
          type: 'users/fetchUsersFailed',
          payload: error,
          error: true
        });
      })
    );
  })
);