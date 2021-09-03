/**
 * Representa el estado de una instancia de modelo.
 */
class Status {

  constructor({
    id,
    name = '',
    isLocal = false,
  } = {}) {
    this._id = id;
    this._name = name;
    // Especifica si el estado es local de la Dapp.
    this._isLocal = isLocal;
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      id: this._id,
      name: this._name,
      isLocal: this._isLocal
    }
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
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