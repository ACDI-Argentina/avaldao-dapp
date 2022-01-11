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
      label
    } = data;

    if (data) {
      this._value = value;
      this._hash = hash;
      this._label = label;
    }
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      value: this._value,
      hash: this._hash,
      label: this._label
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
}

export default Role;

export const AVALDAO_ROLE = "AVALDAO_ROLE";
export const SOLICITANTE_ROLE = "SOLICITANTE_ROLE";
export const COMERCIANTE_ROLE = "COMERCIANTE_ROLE";
export const AVALADO_ROLE = "AVALADO_ROLE";