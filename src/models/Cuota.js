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
      monto = new BigNumber(0),
      timestampVencimiento,
      timestampDesbloqueo,
      status = Cuota.PENDIENTE.toStore()
    } = data;
    // ID utilizado solamente del lado cliente
    this._clientId = clientId;
    this._numero = numero;
    this._monto = new BigNumber(monto);
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
      monto: this._monto,
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
      monto: this._monto,
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
      case 2: return Cuota.REITEGRADA;
    }
  }

  static get PENDIENTE() {
    return StatusUtils.build(0, 'Pendiente', false);
  }

  static get PAGADA() {
    return StatusUtils.build(1, 'Pagada', false);
  }

  static get REITEGRADA() {
    return StatusUtils.build(2, 'Reintegrada', false);
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

  get monto() {
    return this._monto;
  }

  set monto(value) {
    this._monto = value;
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