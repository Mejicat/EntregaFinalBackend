//Este archivo de Factory NO está preparado aún para soportar distintos tipos de persistencia.

import connectToMongo from "./connection.js";
import ProductDAO from "./productDAO.js";
import CartDAO from "./cartDAO.js";
import UserDAO from "./userDAO.js";
import TicketDAO from "./ticketDAO.js";

const Products = async () => {
    const mongoConnection = await connectToMongo();

    // Esperar a que la conexión esté lista
    if (mongoConnection.readyState !== 1) {
        await new Promise((resolve) => mongoConnection.once('open', resolve));
    }

    return {
        productDAO: new ProductDAO(),
        cartDAO: new CartDAO(),
        userDAO: new UserDAO(),
        ticketDAO: new TicketDAO()
    };
};

export default Products;


