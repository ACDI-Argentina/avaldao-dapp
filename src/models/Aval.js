import StatusUtils from '../utils/StatusUtils';
import { nanoid } from '@reduxjs/toolkit'
import Web3Utils from 'lib/blockchain/Web3Utils';
import BigNumber from 'bignumber.js';
import Cuota from './Cuota';

/**
 * Modelo de Aval.
 */
class Aval {

  constructor(data = {}) {
    const {
      id,
      clientId = nanoid(),
      address,
      infoCid = '',
      proyecto = '',
      proposito = '',
      causa = '',
      adquisicion = '',
      beneficiarios = '',
      monto = new BigNumber(0),
      cuotasCantidad = 1,
      cuotas = [],
      solicitanteAddress,
      comercianteAddress,
      avaladoAddress,
      avaldaoAddress,
      avaldaoSignature,
      solicitanteSignature,
      comercianteSignature,
      avaladoSignature,
      status = Aval.ACEPTADO.toStore()
    } = data;
    this._id = id;
    // ID utilizado solamente del lado cliente
    this._clientId = clientId;
    this._address = address;
    this._infoCid = infoCid;
    this._proyecto = proyecto;
    this._proposito = proposito;
    this._causa = causa;
    this._adquisicion = adquisicion;
    this._beneficiarios = beneficiarios;
    this._monto = new BigNumber(monto);
    this._cuotasCantidad = cuotasCantidad;
    this._cuotas = [];
    cuotas.forEach(cuota => {
      this._cuotas.push(new Cuota(cuota));
    });
    this._solicitanteAddress = solicitanteAddress;
    this._comercianteAddress = comercianteAddress;
    this._avaladoAddress = avaladoAddress;
    this._avaldaoAddress = avaldaoAddress;
    this._solicitanteSignature = solicitanteSignature;
    this._comercianteSignature = comercianteSignature;
    this._avaladoSignature = avaladoSignature;
    this._avaldaoSignature = avaldaoSignature;
    this._status = StatusUtils.build(status.id, status.name, status.isLocal);
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
      monto: this._monto,
      cuotasCantidad: this._cuotasCantidad
    };
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    const cuotas = [];
    this._cuotas.forEach(cuota => {
      cuotas.push(cuota.toStore());
    });
    return {
      id: this._id,
      clientId: this._clientId,
      address: this._address,
      infoCid: this._infoCid,
      proyecto: this._proyecto,
      proposito: this._proposito,
      causa: this._causa,
      adquisicion: this._adquisicion,
      beneficiarios: this._beneficiarios,
      monto: this._monto,
      cuotasCantidad: this._cuotasCantidad,
      cuotas: cuotas,
      avaldaoAddress: this._avaldaoAddress,
      solicitanteAddress: this._solicitanteAddress,
      comercianteAddress: this._comercianteAddress,
      avaladoAddress: this._avaladoAddress,
      avaldaoSignature: this._avaldaoSignature,
      solicitanteSignature: this._solicitanteSignature,
      comercianteSignature: this._comercianteSignature,
      avaladoSignature: this._avaladoSignature,
      status: this._status.toStore()
    };
  }

  /**
   * Realiza el mapping de los estados del aval en el
   * smart contract con los estados en la dapp.
   * 
   * @param status del aval en el smart contract.
   * @returns estado del aval en la dapp.
   */
  static mapAvalStatus(status) {
    switch (status) {
      case 0: return Aval.SOLICITADO;
      case 1: return Aval.RECHAZADO;
      case 2: return Aval.ACEPTADO;
      case 3: return Aval.COMPLETADO;
      case 4: return Aval.VIGENTE;
      case 5: return Aval.FINALIZADO;
    }
  }

  static get SOLICITADO() {
    return StatusUtils.build(0, 'Solicitado', false);
  }

  static get RECHAZADO() {
    return StatusUtils.build(1, 'Rechazado', false);
  }

  static get ACEPTADO() {
    return StatusUtils.build(2, 'Aceptado', false);
  }

  static get COMPLETANDO() {
    return StatusUtils.build(undefined, 'Completando', true);
  }

  static get COMPLETADO() {
    return StatusUtils.build(3, 'Completado', false);
  }

  static get VIGENTE() {
    return StatusUtils.build(4, 'Vigente', false);
  }

  static get FINALIZADO() {
    return StatusUtils.build(5, 'Finalizado', false);
  }

  /**
   * Determina si el Aval puede ser completado o no.
   * @param user usuario que completa el aval.
   */
  allowCompletar(user) {
    if (this.status.name !== Aval.ACEPTADO.name) {
      // Solo un aval Aceptado puede ser firmado.
      return false;
    }
    if (!user.registered) {
      // El usuario no está autenticado.
      // TODO Reemplazar por 'authenticated' una vez resuelto el issue
      // https://github.com/ACDI-Argentina/avaldao/issues/21
      return false;
    }
    if (Web3Utils.addressEquals(user.address, this.solicitanteAddress)) {
      // Solo el Solicitante puede completar el aval
      return true;
    }
    return false;
  }

  /**
   * Determina si los fondos del Aval pueden ser desbloqueados o no.
   * @param user usuario que desbloquea los fondos del aval.
   */
  allowDesbloquear(user) {
    if (this.status.name !== Aval.VIGENTE.name) {
      // Solo un aval Vigente puede ser desbloqueado.
      return false;
    }
    if (!user.registered) {
      // El usuario no está autenticado.
      // TODO Reemplazar por 'authenticated' una vez resuelto el issue
      // https://github.com/ACDI-Argentina/avaldao/issues/21
      return false;
    }
    if (Web3Utils.addressEquals(user.address, this.solicitanteAddress)) {
      // Solo el Solicitante puede desbloquear fondos el aval
      return true;
    }
    return false;
  }

  /**
   * Determina si el Aval puede ser firmado o no por el usuario con el address especificado.
   * @param user usuario firmante.
   */
  allowFirmar(user) {
    if (this.status.name !== Aval.COMPLETADO.name) {
      // Solo un aval Completado puede ser firmado.
      return false;
    }
    if (!user.registered) {
      // El usuario no está autenticado.
      // TODO Reemplazar por 'authenticated' una vez resuelto el issue
      // https://github.com/ACDI-Argentina/avaldao/issues/21
      return false;
    }
    if (Web3Utils.addressEquals(user.address, this.solicitanteAddress)) {
      // El firmante es el Solicitante.
      return this.solicitanteSignature == undefined;
    }
    if (Web3Utils.addressEquals(user.address, this.comercianteAddress)) {
      // El firmante es el Comerciante.
      return this.comercianteSignature == undefined;
    }
    if (Web3Utils.addressEquals(user.address, this.avaladoAddress)) {
      // El firmante es el Avalado.
      return this.avaladoSignature == undefined;
    }
    if (Web3Utils.addressEquals(user.address, this.avaldaoAddress)) {
      // El firmante es Avaldao.
      // Avaldao solo puede firmar una vez que el Solictante, Comerciante y Avalado hayan firmado.
      // En este punto el aval está Completo. 
      // Puede darse la situación donde Avaldao ya haya firmado y falta ejecutar la firma en la blockchain,
      // por lo que no se consulta por la firma de Avaldao.
      return this.solicitanteSignature != undefined &&
        this.comercianteSignature != undefined &&
        this.avaladoSignature != undefined;
    }
    return false;
  }

  /**
   * Determina si el usuario es Avalado del Aval.
   * @param user usuario a determinar si es Avaldao.
   */
  isAvaldao(user) {
    if (Web3Utils.addressEquals(user.address, this.avaldaoAddress)) {
      return true;
    }
    return false;
  }

  /**
   * Actualiza la firma del usuario firmante
   * @param signerAddress dirección del usuario firmante.
   * @param signature firma del usuario.
   */
  updateSignature(signerAddress, signature) {
    if (Web3Utils.addressEquals(signerAddress, this.avaldaoAddress)) {
      // Firma del usuario Avaldao
      this.avaldaoSignature = signature;
    } else if (Web3Utils.addressEquals(signerAddress, this.solicitanteAddress)) {
      // Firma del usuario Solictante
      this.solicitanteSignature = signature;
    } else if (Web3Utils.addressEquals(signerAddress, this.comercianteAddress)) {
      // Firma del usuario Comerciante
      this.comercianteSignature = signature;
    } else if (Web3Utils.addressEquals(signerAddress, this.avaladoAddress)) {
      // Firma del usuario Avalado
      this.avaladoSignature = signature;
    }
  }

  /**
   * Determina si están las firmas de todos los usuarios.
   */
  areSignaturesComplete() {
    return this.avaldaoSignature !== undefined &&
      this.solicitanteSignature !== undefined &&
      this.comercianteSignature !== undefined &&
      this.avaladoSignature !== undefined;
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

  get address() {
    return this._address;
  }

  set address(value) {
    this._address = value;
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

  get cuotasCantidad() {
    return this._cuotasCantidad;
  }

  set cuotasCantidad(value) {
    this._cuotasCantidad = value;
  }

  get cuotas() {
    return this._cuotas;
  }

  set cuotas(value) {
    this._cuotas = value;
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

  get avaldaoSignature() {
    return this._avaldaoSignature;
  }

  set avaldaoSignature(value) {
    this._avaldaoSignature = value;
  }

  get solicitanteSignature() {
    return this._solicitanteSignature;
  }

  set solicitanteSignature(value) {
    this._solicitanteSignature = value;
  }

  get comercianteSignature() {
    return this._comercianteSignature;
  }

  set comercianteSignature(value) {
    this._comercianteSignature = value;
  }

  get avaladoSignature() {
    return this._avaladoSignature;
  }

  set avaladoSignature(value) {
    this._avaladoSignature = value;
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