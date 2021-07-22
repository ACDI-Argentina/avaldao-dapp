import Entity from './Entity';
import StatusUtils from '../utils/StatusUtils';

/**
 * Modelo de Aval.
 */
class Aval extends Entity {

  constructor(data = {}) {
    super(data);
    const {
      avaldaoAddress = '',
      comercianteAddress = '',
      avaladoAddress = '',
      status = Aval.SOLICITADO
    } = data;
    this._avaldaoAddress = avaldaoAddress;
    this._comercianteAddress = comercianteAddress;
    this._avaladoAddress = avaladoAddress;
    this._status = status;
  }

  /**
   * Obtiene un objeto plano para envíar a IPFS.
   */
  toIpfs() {
    let entityIpfs = super.toIpfs();
    return Object.assign(entityIpfs, {
      avaldaoAddress: this._avaldaoAddress,
      comercianteAddress: this._comercianteAddress,
      avaladoAddress: this._avaldadoAddress
    });
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    let entityStore = super.toStore();
    return Object.assign(entityStore, {
      avaldaoAddress: this._avaldaoAddress,
      comercianteAddress: this._comercianteAddress,
      avaladoAddress: this._avaladoAddress,
      status: this._status.toStore()
    });
  }

  static get SOLICITADO() {
    return StatusUtils.build('Solicitado', true);
  }

  get avaldaoAddress() {
    return this._avaldaoAddress;
  }

  set avaldaoAddress(value) {
    this._avaldaoAddress = value;
  }

  get comercianteAddress() {
    return this._comercianteAddress;
  }

  set comercianteAddress(value) {
    this._comercianteAddress = value;
  }

  get avaladoAddress() {
    return this._avaladoAddress;
  }

  set avaladoAddress(value) {
    this._avaladoAddress = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
  }
}

export default Aval;