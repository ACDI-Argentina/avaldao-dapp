import Status from '../models/Status';

/**
 * Clase utilitaria para el manejo de estados.
 */
class StatusUtils {

  /**
   * Construye un objeto de estado.
   *
   * @param name nombre del estado
   * @param isLocal indica si el estado es local de la Dapp.
   * @returns objeto status
   */
  static build(name, isLocal = false) {
    return new Status({ name, isLocal });
  }
}

export default StatusUtils;
