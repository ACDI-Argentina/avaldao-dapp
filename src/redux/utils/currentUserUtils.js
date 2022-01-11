import { store } from '../store';
import {
  initCurrentUser,
  setAuthenticated,
  clearCurrentUser,
  updateCurrentUserBalance,
  selectCurrentUser
} from '../reducers/currentUserSlice';

/**
 * Clase utilitaria para el manejo del usuario actual a través de Redux.
 */
class CurrentUserUtils {

  /**
   * Obtiene el usuario actual.
   */
  getCurrentUser() {
    return selectCurrentUser(store.getState());
  }

  /**
   * Inicializa el usuario actual.
   * 
   * @param accountAddress dirección de la cuenta.
   */
  initCurrentUser(accountAddress) {
    const action = initCurrentUser(accountAddress);
    store.dispatch(action);
  }

  setAuthenticated(isAuthenticated) {
    store.dispatch(setAuthenticated(isAuthenticated));
  };

  /**
   * Limpia el usuario actual.
   */
  clearCurrentUser() {
    const action = clearCurrentUser();
    store.dispatch(action);
  }
  /**
   * Actualiza el balance del usuario actual.
   * @param balance balance nativo de la cuenta.
   * @param tokenBalances balance de los tokens de la cuenta.
   */
  updateCurrentUserBalance(balance, tokenBalances) {
    const action = updateCurrentUserBalance({
      balance: balance,
      tokenBalances: tokenBalances
    });
    store.dispatch(action);
  }
}

export default new CurrentUserUtils();