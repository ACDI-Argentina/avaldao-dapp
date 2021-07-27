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
      // ////////////////////////////////////////////////////////
      // La siguiente información es provista cuando el aval es solicitado.
      // Issue #10: CU: Solicitar aval
      // En esta esta aún no está implementado el CU.
      proyecto = 'Instalación de cisternas para productores del Gran Chaco',
      proposito = 'Impulsar el desarrollo de los productores de la zona.',
      causa = 'Los productores no tiene acceso al crédito y necesitan un aval.',
      adquisicion = '10 cisternas',
      beneficiarios = '20 productores',
      monto = '10.000 USD',
      // ////////////////////////////////////////////////////////
      avaldaoAddress = '',
      solicitanteAddress = '',
      comercianteAddress = '',
      avaladoAddress = '',
      status = Aval.SOLICITADO
    } = data;
    this._id = id;
    // ID utilizado solamente del lado cliente
    this._clientId = clientId;
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
    return StatusUtils.build('Solicitado', true);
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