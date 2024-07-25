import { cartRepository } from "../repositories/index.js" ;
import CartDTO from "../dao/dto/cartDTO.js";

class CartService {
    async addCart(userId) {
      const cart = await cartRepository.getCartWithUserId(userId);
      if (cart) {
          return new CartDTO(cart);
      }
      const newCart = await cartRepository.addCart(userId);
      if (!newCart) {
          throw new Error('Error creating cart');
      }
      return new CartDTO(newCart);
  }
    
      async getCart(userId) {
        try {
          const cart = await cartRepository.getCart(userId)
          return new CartDTO(cart)
        } catch (error) {
          throw error
        }
      }
    
      async getCartWithUserId(userId) {
        try {
          const cart = await cartRepository.getCartWithUserId(userId)
          return new CartDTO(cart)
        } catch (error) {
          throw error
        }
      }
    
      async getAllCarts() {
        try {
          const carts = await cartRepository.getAllCarts()
          if (!carts) {
            throw new Error('No carts found')
          }
          return carts.map((cart) => new CartDTO(cart))
        } catch (error) {
          throw error
        }
      }
    
      async updateProductQuantity(cartId, productId, quantity) {
        try {
          const cart = await cartRepository.updateProductQuantity(cartId, productId, quantity)
          if (!cart) {
            throw new Error('Error updating product quantity')
          }
          return new CartDTO(cart)
        } catch (error) {
          throw error
        }
      }
    
      async addProductToCart(cartId, productId, quantity) {
        try {
          const cart = await cartRepository.addProductToCart(cartId, productId, quantity)
          if (!cart) {
            throw new Error('Error adding product to cart')
          }
          return new CartDTO(cart)
        } catch (error) {
          throw error
        }
      }
    
      async deleteProductFromCart(cartId, productId) {
        try {
          const cart = cartRepository.deleteProductFromCart(cartId, productId)
          if (!cart) {
            throw new Error('Error deleting product from cart')
          }
          return new CartDTO(cart);
        } catch (error) {
          throw error
        }
      }
      
      async deleteAllProductsFromCart(cartId) {
        try {
          const cart = cartRepository.deleteAllProductsFromCart(cartId)
          if (!cart) {
            throw new Error('Error deleting products from cart')
          }
          return new CartDTO(cart);
        } catch (error) {
          throw error
        }
      }
      
      async deleteCart(id) {
        try {
          const cart = await cartRepository.deleteCart(id)
          if (!cart) {
            throw new Error('Error deleting cart')
          }
          return new CartDTO(cart)
        } catch (error) {
          throw error
        }
      }
    }
    
  export default new CartService()