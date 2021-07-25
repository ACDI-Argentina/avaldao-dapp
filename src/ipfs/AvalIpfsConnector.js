import ipfsService from './IpfsService';

/**
 * Conector encargado de subir y descargar contenido de Avales con IPFS.
 * 
 */
class AvalIpfsConnector {

  /**
   * Realiza el upload del aval a IPFS.
   * 
   * @param aval a subir a IPFS
   * @return CID del aval en IPFS
   */
  async upload(aval) {
    // Se almacena en IPFS toda la información del aval.
    let infoCid = await ipfsService.upload(aval.toIpfs());
    return infoCid;
  }

  /**
   * Descarga la información almacenada del aval en IPFS.
   * 
   * @param infoCid CID del aval
   * @return información del aval en IPFS.
   */
  async download(infoCid) {
    return await ipfsService.downloadJson(infoCid);
  }
}

export default new AvalIpfsConnector();