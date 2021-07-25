/**
 * Representa el estado de una instancia de modelo.
 */
class Status {

  constructor({
    name = '',
    isLocal = false,
  } = {}) {
    this._name = name;
    // Especifica si el estado es local de la Dapp.
    this._isLocal = isLocal;
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      name: this._name,
      isLocal: this._isLocal
    }
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get isLocal() {
    return this._isLocal;
  }

  set isLocal(value) {
    this._isLocal = value;
  }
}

export default Status;
