import Entity from './Entity';

/**
 * The DApp Category model
 */
class Category extends Entity {

  constructor(data = {}) {
    super(data);
  }

  /**
   * Obtiene un objeto plano de la categoría para envíar a IPFS.
   */
  toIpfs() {
    return super.toIpfs();
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return super.toStore();
  }

  static get type() {
    return 'category';
  }

}

export default Category;