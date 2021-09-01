import { store } from '../store';
import { fetchAvalByBlockchainId } from '../reducers/avalesSlice';

/**
 * Clase utilitaria para el manejo de avales a través de Redux.
 */
class AvalStoreUtils {

  constructor() { }

  /**
   * Obtiene un aval desde el store de Redux.
   * 
   * @param blockchainId id del aval en la blockchain
   */
  fetchAvalByBlockchainId(blockchainId) {

    store.dispatch(fetchAvalByBlockchainId(blockchainId));
  }
}

export default new AvalStoreUtils();