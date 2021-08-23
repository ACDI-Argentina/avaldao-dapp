import ipfsService from './IpfsService';

/**
 * Conector encargado de subir y descargar contenido de Usuarios con IPFS.
 * 
 */
class UserIpfsConnector {

  /**
   * Realiza el upload del usuario a IPFS.
   * 
   * @param user a subir a IPFS
   * @return CID del usuario en IPFS
   */
  async upload(user) {
    // Se almacena en IPFS toda la información del usuario.
    let infoCid = await ipfsService.upload(user.toIpfs());
    return infoCid;
  }

  /**
   * Descarga la información almacenada del usuario en IPFS.
   * 
   * @param infoCid CID del usuario
   * @return información del usuario en IPFS.
   */
  async download(infoCid) {
    return await ipfsService.downloadJson(infoCid);
  }
}

export default new UserIpfsConnector();