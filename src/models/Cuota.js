import StatusUtils from '../utils/StatusUtils';
import { nanoid } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js';

/**
 * Modelo de Cuota de Aval.
 */
class Cuota {

  constructor(data = {}) {
    const {
      clientId = nanoid(),
      numero,
      montoFiat = new BigNumber(0),
      timestampVencimiento,
      timestampDesbloqueo,
      status = Cuota.PENDIENTE.toStore()
    } = data;
    // ID utilizado solamente del lado cliente
    this._clientId = clientId;
    this._numero = numero;
    this._montoFiat = new BigNumber(montoFiat);
    this._timestampVencimiento = timestampVencimiento;
    this._timestampDesbloqueo = timestampDesbloqueo;
    this._status = StatusUtils.build(status.id, status.name, status.isLocal);;
  }

  /**
   * Obtiene un objeto plano para envíar a IPFS.
   */
  toIpfs() {
    return {
      numero: this._numero,
      montoFiat: this._montoFiat,
      timestampVencimiento: this._timestampVencimiento,
      timestampDesbloqueo: this._timestampDesbloqueo
    };
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      clientId: this._clientId,
      numero: this._numero,
      montoFiat: this._montoFiat,
      timestampVencimiento: this._timestampVencimiento,
      timestampDesbloqueo: this._timestampDesbloqueo,
      status: this._status.toStore()
    };
  }

  /**
   * Realiza el mapping de los estados de la cuota en el
   * smart contract con los estados en la dapp.
   * 
   * @param status de la cuota en el smart contract.
   * @returns estado de la cuota en la dapp.
   */
  static mapCuotaStatus(status) {
    switch (status) {
      case 0: return Cuota.PENDIENTE;
      case 1: return Cuota.PAGADA;
      case 2: return Cuota.REINTEGRADA;
      default: return null;
    }
  }

  static get PENDIENTE() {
    return StatusUtils.build(0, 'Pendiente', false);
  }

  static get PAGADA() {
    return StatusUtils.build(1, 'Pagada', false);
  }

  static get REINTEGRADA() {
    return StatusUtils.build(2, 'Reintegrada', false);
  }

  isPendiente() {
    return this.status.name === Cuota.PENDIENTE.name;
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

  get montoFiat() {
    return this._montoFiat;
  }

  set montoFiat(value) {
    this._montoFiat = value;
  }

  get timestampVencimiento() {
    return this._timestampVencimiento;
  }

  set timestampVencimiento(value) {
    this._timestampVencimiento = value;
  }

  get timestampDesbloqueo() {
    return this._timestampDesbloqueo;
  }

  set timestampDesbloqueo(value) {
    this._timestampDesbloqueo = value;
  }


  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
  }
}

export default Cuota;