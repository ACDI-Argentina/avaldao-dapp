import Model from './Model';

/**
 * Representa el estado de una instancia de modelo.
 */
class Status extends Model {

  constructor({
    name = '',
    isLocal = false,
  } = {}) {
    super();
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
    this.checkType(value, ['string'], 'name');
    this._name = value;
  }

  get isLocal() {
    return this._isLocal;
  }

  set isLocal(value) {
    this.checkType(value, ['undefined', 'boolean'], 'isLocal');
    this._isLocal = value;
  }
}

export default Status;
