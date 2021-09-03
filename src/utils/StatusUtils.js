import Status from '../models/Status';

/**
 * Clase utilitaria para el manejo de estados.
 */
class StatusUtils {

  /**
   * Construye un objeto de estado.
   *
   * @param id id del estado
   * @param name nombre del estado
   * @param isLocal indica si el estado es local de la Dapp.
   * @returns objeto status
   */
  static build(id, name, isLocal = false) {
    return new Status({ id, name, isLocal });
  }
}

export default StatusUtils;
