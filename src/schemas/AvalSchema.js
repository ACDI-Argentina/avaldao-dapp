import * as Yup from 'yup';
import Web3Utils from 'lib/blockchain/Web3Utils';

const avalSchema = Yup.object({
  proyecto: Yup.string().trim().required('required'),
  objetivo: Yup.string().trim().max(500).required('required'),
  adquisicion: Yup.string().trim().max(100).required('required'),
  beneficiarios: Yup.string().trim().max(100).required('required'),
  montoFiat: Yup.number().required('required').positive('montoError').typeError('montoError'),
  cuotasCantidad: Yup.number().required('required').positive('cuotaError').integer('cuotaError').typeError('cuotaError'),
  
  avaldaoAddress: Yup.string().test(
    "test-address",
    "errorInvalidAddress",
    function (value) {
      if (!value)
        return false;
      return Web3Utils.isValidAddress(value?.toUpperCase()); //TODO: Comprobar el checksum
    }).required('required'),
  
    comercianteAddress: Yup.string().test(
    "test-address",
    "errorInvalidAddress",
    function (value) {
      if (!value)
        return false;
      return Web3Utils.isValidAddress(value?.toUpperCase()); //TODO: Comprobar el checksum
    }).required('required'),
  
    avaladoAddress: Yup.string().test(
    "test-address",
    "errorInvalidAddress",
    function (value) {
      if (!value)
        return false;
      return Web3Utils.isValidAddress(value?.toUpperCase()); //TODO: Comprobar el checksum
    }).required('required')
});

export default avalSchema;