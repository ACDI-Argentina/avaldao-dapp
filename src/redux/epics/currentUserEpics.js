import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators'
import { userService, authService } from 'commons';
import { of } from 'rxjs';

/**
 * Epic que reacciona a la acción de obtención del usuario actual local,
 * busca el usuario actual con el servicio y envía la acción de
 * resetear el usuario actual.
 * 
 * @param action$ de Redux.
 */
export const loadCurrentUserEpic = (action$, state$) => action$.pipe(
  ofType('currentUser/loadCurrentUser'),
  mergeMap(action =>
    userService.loadUserByAddress(action.payload).pipe(
      mergeMap(currentUser => authService.login(currentUser)),
      map(currentUser => ({
        type: 'currentUser/setCurrentUser',
        payload: currentUser
      })),
      catchError((error) =>
        of({
          type: 'currentUser/loadCurrentUserError',
          payload: `Login failed: ${error.message || 'Unknown error'}`,
          error: true
        })
      )
    )
  ),
  catchError(error => of({
    type: 'currentUser/loadCurrentUserError',
    payload: error.message || 'An error occurred while loading user',
    error: true
  }))
)

export const registerCurrentUserEpic = (action$, state$) => action$.pipe(
  ofType('currentUser/registerCurrentUser'),
  mergeMap(action =>
    userService.saveCurrentUser(action.payload).pipe(
      mergeMap(currentUser => authService.login(currentUser)),
      map(currentUser => ({
        type: 'currentUser/setCurrentUser',
        payload: currentUser
      }))
    )
  ),
  catchError(error => of({
    type: 'currentUser/registerError',
    payload: error.message || 'An error occurred while saving user',
    error: true
  }))
)

export const setCurrentUserEpic = (action$) => action$.pipe(
  ofType('currentUser/setCurrentUser'),
  map(action => ({
    type: 'users/mergeUser',
    payload: action.payload
  }))
)