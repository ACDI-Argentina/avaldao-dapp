import StatusUtils from '../utils/StatusUtils';
import { nanoid } from '@reduxjs/toolkit'

/**
 * Modelo de Reclamo de Aval.
 */
class Reclamo {

  constructor(data = {}) {
    const {
      clientId = nanoid(),
      numero,
      timestampCreacion,
      status = Reclamo.VIGENTE.toStore()
    } = data;
    // ID utilizado solamente del lado cliente
    this._clientId = clientId;
    this._numero = numero;
    this._timestampCreacion = timestampCreacion;
    this._status = StatusUtils.build(status.id, status.name, status.isLocal);
  }

  /**
   * Obtiene un objeto plano para envíar a IPFS.
   */
  toIpfs() {
    return {
      numero: this._numero,
      timestampVencimiento: this._timestampCreacion,
    };
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      clientId: this._clientId,
      numero: this._numero,
      timestampCreacion: this._timestampCreacion,
      status: this._status.toStore()
    };
  }

  /**
   * Realiza el mapping de los estados de la Reclamo en el
   * smart contract con los estados en la dapp.
   * 
   * @param status de la Reclamo en el smart contract.
   * @returns estado de la Reclamo en la dapp.
   */
  static mapReclamoStatus(status) {
    switch (status) {
      case 0: return Reclamo.VIGENTE;
      case 1: return Reclamo.CERRADO;
      default: return null;
    }
  }

  static get VIGENTE() {
    return StatusUtils.build(0, 'Vigente', false);
  }

  static get CERRADO() {
    return StatusUtils.build(1, 'Cerrado', false);
  }

  isVigente() {
    return this.status.name === Reclamo.VIGENTE.name;
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this._clientId = value;
  }

  get numero() {
    return this._numero;
  }

  set numero(value) {
    this._numero = value;
  }

  get timestampCreacion() {
    return this._timestampCreacion;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
  }
}

export default Reclamo;