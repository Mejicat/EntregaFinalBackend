import { ticketRepository, cartRepository, productRepository, userRepository } from "../repositories/index.js";
import TicketDTO from "../dao/dto/ticketDTO.js";

class TicketService {
  async getTickets() {
    try {
      const tickets = await ticketRepository.getTickets();
      if (!tickets) {
        throw new Error("No se encontraron tickets");
      }
      return tickets.map((ticket) => new TicketDTO(ticket));
    } catch (error) {
      throw error;
    }
  }

  async getAllTickets() {
    try {
      const tickets = await ticketRepository.getTickets();
      if (!tickets) {
        throw new Error("No se encontraron tickets");
      }
      return tickets.map((ticket) => new TicketDTO(ticket));
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketRepository.getTicketById(ticketId);
      if (!ticket) {
        throw new Error("Ticket no encontrado");
      }
      return new TicketDTO(ticket);
    } catch (error) {
      throw error;
    }
  }

  async getTicketsByUserId(userId) {
    try {
      const tickets = await ticketRepository.getTicketsByUserId(userId);
      if (!tickets) {
        throw new Error("No se encontraron tickets");
      }
      return tickets.map(ticket => new TicketDTO(ticket));
    } catch (error) {
      throw error;
    }
  }

  async createTicket(userId, cartId) {
    try {
      const user = await userRepository.getUserById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const cart = await cartRepository.getCart(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      let totalAmount = 0;
      const productsForTicket = [];
      const remainingProducts = [];

      for (const cartItem of cart.products) {
        const product = await productRepository.getProductById(cartItem.product._id);
        if (!product) {
          throw new Error(`Producto con ID ${cartItem.product._id} no encontrado`);
        }

        if (cartItem.quantity <= product.stock) {
          totalAmount += cartItem.quantity * product.price;
          productsForTicket.push({ product: cartItem.product._id, quantity: cartItem.quantity });
          await productRepository.updateProduct(product._id, { stock: product.stock - cartItem.quantity });
        } else {
          totalAmount += product.stock * product.price;
          productsForTicket.push({ product: cartItem.product._id, quantity: product.stock });
          remainingProducts.push({ product: cartItem.product._id, quantity: cartItem.quantity - product.stock });
          await productRepository.updateProduct(product._id, { stock: 0 });
        }
      }

      const newTicket = await ticketRepository.createTicket(user.email, totalAmount, productsForTicket);

      if (remainingProducts.length > 0) {
        await cartRepository.updateCart(cartId, remainingProducts);
      } else {
        await cartRepository.clearCart(cartId);
      }

      return new TicketDTO(newTicket);
    } catch (error) {
      throw error;
    }
  }
}

export default new TicketService();
