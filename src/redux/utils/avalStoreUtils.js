import { store } from '../store';
import { fetchAvalById } from '../reducers/avalesSlice';

/**
 * Clase utilitaria para el manejo de avales a través de Redux.
 */
class AvalStoreUtils {

  constructor() { }

  /**
   * Obtiene un aval desde el store de Redux.
   * 
   * @param id id del aval
   */
  fetchAvalById(id) {

    store.dispatch(fetchAvalById(id));
  }
}

export default new AvalStoreUtils();