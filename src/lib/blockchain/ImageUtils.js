import BigNumber from 'bignumber.js';
import { utils } from 'web3';
import config from '../../configuration';

class ImageUtils {

  /**
   * Convierte una image desde una URL a su contenido en Base64.
   * 
   * @param {*} url 
   * @param {*} callback 
   */
  static toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
}

export default ImageUtils;
