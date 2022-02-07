import Model from './Model';

/**
 * Modelo de Rol.
 * 
 */
class Role extends Model {

  constructor(data = {}) {
    super(data);
    const {
      value,
      hash,
      label,
      app
    } = data;

    if (data) {
      this._value = value;
      this._hash = hash;
      this._label = label;
      this._app = app;
    }
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      value: this._value,
      hash: this._hash,
      label: this._label,
      app: this._app
    }
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get hash() {
    return this._hash;
  }

  set hash(value) {
    this._hash = value;
  }

  get label() {
    return this._label;
  }

  set label(value) {
    this._label = value;
  }

  get app() {
    return this._app;
  }

  set app(value) {
    this._app = value;
  }
}

export default Role;