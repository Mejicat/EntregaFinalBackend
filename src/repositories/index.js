import Products from "../dao/factory.js";
import ProductRepository from "./productRepository.js";
import CartRepository from "./cartRepository.js";
import UserRepository from "./userRepository.js";
import TicketRepository from "./ticketRepository.js";

const initializeRepositories = async () => {
    const dao = await Products();
    return {
        productRepository: new ProductRepository(dao.productDAO),
        cartRepository: new CartRepository(dao.cartDAO),
        userRepository: new UserRepository(dao.userDAO),
        ticketRepository: new TicketRepository(dao.ticketDAO)
    };
};

const repositories = await initializeRepositories();

export const { productRepository, cartRepository, userRepository, ticketRepository } = repositories;
