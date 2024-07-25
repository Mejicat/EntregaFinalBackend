// src/repositories/cartRepository.js
class CartRepository {
    constructor(cartDAO) {
      this.cartDAO = cartDAO;
    }
  
    async addCart() {
      return await this.cartDAO.addCart();
    }
  
    async getProductsFromCart(cartId) {
      const products = await this.cartDAO.getProductsFromCart(cartId);
      if (!products) {
        throw new Error(`Productos no encontrados en el carrito ${cartId}`);
      }
      return products;
    }
  
    async addProduct(cartId, productId) {
      const result = await this.cartDAO.addProduct(cartId, productId);
      if (!result) {
        throw new Error('No se pudo agregar el producto al carrito');
      }
      return result;
    }
  
    async updateProductQuantity(cartId, productId, quantity) {
      const updatedProduct = await this.cartDAO.updateProductQuantity(cartId, productId, quantity);
      if (!updatedProduct) {
        throw new Error('No se pudo actualizar la cantidad del producto en el carrito');
      }
      return updatedProduct;
    }
  
    async deleteAllProducts(cartId) {
      const result = await this.cartDAO.deleteAllProducts(cartId);
      if (!result) {
        throw new Error(`No se pudo limpiar el carrito ${cartId}`);
      }
      return result;
    }
  
    async deleteCart(cartId) {
      const result = await this.cartDAO.deleteCart(cartId);
      if (!result) {
        throw new Error(`No se pudo eliminar el carrito ${cartId}`);
      }
      return { deletedCount: 1 };
    }
  }
  
  export default CartRepository;
  