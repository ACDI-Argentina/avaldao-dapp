import StatusUtils from '../utils/StatusUtils';
import { nanoid } from '@reduxjs/toolkit'

/**
 * Modelo de Aval.
 */
class Aval {

  constructor(data = {}) {
    const {
      id,
      clientId = nanoid(),
      infoCid = '',
      proyecto = '',
      proposito = '',
      causa = '',
      adquisicion = '',
      beneficiarios = '',
      monto = '',
      avaldaoAddress = '',
      solicitanteAddress = '',
      comercianteAddress = '',
      avaladoAddress = '',
      status = Aval.ACEPTADO
    } = data;
    this._id = id;
    // ID utilizado solamente del lado cliente
    this._clientId = clientId;
    this._infoCid = infoCid;
    this._proyecto = proyecto;
    this._proposito = proposito;
    this._causa = causa;
    this._adquisicion = adquisicion;
    this._beneficiarios = beneficiarios;
    this._monto = monto;
    this._avaldaoAddress = avaldaoAddress;
    this._solicitanteAddress = solicitanteAddress;
    this._comercianteAddress = comercianteAddress;
    this._avaladoAddress = avaladoAddress;
    this._status = status;
  }

  /**
   * Obtiene un objeto plano para envíar a IPFS.
   */
  toIpfs() {
    return {
      id: this._id,
      proyecto: this._proyecto,
      proposito: this._proposito,
      causa: this._causa,
      adquisicion: this._adquisicion,
      beneficiarios: this._beneficiarios,
      monto: this._monto
    };
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      id: this._id,
      clientId: this._clientId,
      infoCid: this._infoCid,
      proyecto: this._proyecto,
      proposito: this._proposito,
      causa: this._causa,
      adquisicion: this._adquisicion,
      beneficiarios: this._beneficiarios,
      monto: this._monto,
      avaldaoAddress: this._avaldaoAddress,
      solicitanteAddress: this._solicitanteAddress,
      comercianteAddress: this._comercianteAddress,
      avaladoAddress: this._avaladoAddress,
      status: this._status.toStore()
    };
  }

  static get SOLICITADO() {
    return StatusUtils.build('Solicitado', false);
  }

  static get RECHAZADO() {
    return StatusUtils.build('Rechazado', false);
  }

  static get ACEPTADO() {
    return StatusUtils.build('Aceptado', false);
  }

  static get COMPLETANDO() {
    return StatusUtils.build('Completando', true);
  }

  static get COMPLETADO() {
    return StatusUtils.build('Completado', false);
  }

  static get VIGENTE() {
    return StatusUtils.build('Vigente', false);
  }

  static get FINALIZADO() {
    return StatusUtils.build('Finalizado', false);
  }

  /**
   * Determina si el Aval puede ser completado o no.
   */
  allowCompletar() {
    return this.status.name === Aval.ACEPTADO.name;
  }

  /**
   * Determina si el Aval puede ser firmado o no.
   */
   allowFirmar() {
    return this.status.name === Aval.COMPLETADO.name;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this._clientId = value;
  }

  get infoCid() {
    return this._infoCid;
  }

  set infoCid(value) {
    this._infoCid = value;
  }

  get proyecto() {
    return this._proyecto;
  }

  set proyecto(value) {
    this._proyecto = value;
  }

  get proposito() {
    return this._proposito;
  }

  set proposito(value) {
    this._proposito = value;
  }

  get causa() {
    return this._causa;
  }

  set causa(value) {
    this._causa = value;
  }

  get adquisicion() {
    return this._adquisicion;
  }

  set adquisicion(value) {
    this._adquisicion = value;
  }

  get beneficiarios() {
    return this._beneficiarios;
  }

  set beneficiarios(value) {
    this._beneficiarios = value;
  }

  get monto() {
    return this._monto;
  }

  set monto(value) {
    this._monto = value;
  }

  get avaldaoAddress() {
    return this._avaldaoAddress;
  }

  set avaldaoAddress(value) {
    this._avaldaoAddress = value;
  }

  get solicitanteAddress() {
    return this._solicitanteAddress;
  }

  set solicitanteAddress(value) {
    this._solicitanteAddress = value;
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

  get txHash() {
    return this._txHash;
  }

  set txHash(value) {
    this._txHash = value;
  }
}

export default Aval;