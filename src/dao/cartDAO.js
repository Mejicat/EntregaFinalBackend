// src/dao/cartDAO.js
class CartDAO {
    constructor() {
      this.carts = new Map(); // Usamos un Map para simular la base de datos
    }
  
    async addCart() {
      const cartId = `${Math.random().toString(36).substr(2, 9)}`;
      this.carts.set(cartId, { _id: cartId, products: [] });
      return { _id: cartId };
    }
  
    async addProduct(cartId, productId) {
      const cart = this.carts.get(cartId);
      if (!cart) throw new Error(`Carrito no encontrado: ${cartId}`);
  
      const productIndex = cart.products.findIndex(p => p.product === productId);
      if (productIndex >= 0) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      this.carts.set(cartId, cart);
      return cart;
    }
  
    async getProductsFromCart(cartId) {
      const cart = this.carts.get(cartId);
      if (!cart) throw new Error(`Carrito no encontrado: ${cartId}`);
      return cart.products;
    }
  
    async updateProductQuantity(cartId, productId, quantity) {
      const cart = this.carts.get(cartId);
      if (!cart) throw new Error(`Carrito no encontrado: ${cartId}`);
  
      const productIndex = cart.products.findIndex(p => p.product === productId);
      if (productIndex >= 0) {
        cart.products[productIndex].quantity = quantity;
        this.carts.set(cartId, cart);
        return cart.products[productIndex];
      } else {
        throw new Error('Producto no encontrado en el carrito');
      }
    }
  
    async deleteAllProducts(cartId) {
      const cart = this.carts.get(cartId);
      if (!cart) throw new Error(`Carrito no encontrado: ${cartId}`);
  
      cart.products = [];
      this.carts.set(cartId, cart);
      return cart;
    }
  
    async deleteCart(cartId) {
      const deleted = this.carts.delete(cartId);
      if (!deleted) throw new Error(`Carrito no encontrado: ${cartId}`);
      return { deletedCount: 1 };
    }
  }
  
  export default CartDAO;
  
