import Model from './Model';
import { cleanIpfsPath } from '../lib/helpers';
import BigNumber from 'bignumber.js';
import {
  CREATE_DAC_ROLE,
  CREATE_CAMPAIGN_ROLE,
  CREATE_MILESTONE_ROLE,
  CAMPAIGN_REVIEWER_ROLE,
  MILESTONE_REVIEWER_ROLE,
  RECIPIENT_ROLE
} from '../constants/Role';
import StatusUtils from '../utils/StatusUtils';
import Status from './Status';
import ipfsService from '../ipfs/IpfsService';

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