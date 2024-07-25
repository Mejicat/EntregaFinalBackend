import ProductDAO from "./dao/productDAO.js"
import MessageDAO from "./dao/messageDAO.js"

export default (io) => {
    io.on("connection", (socket) => {

        socket.on("createProduct", async (data) => {
            try {
                await ProductDAO.createProduct(data);
                const products = await ProductDAO.getAllProducts();
                socket.emit("publishProducts", products);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("deleteProduct", async (data) => {
            try {
                const result = await ProductDAO.deleteProduct(data.pid);
                socket.emit("publishProducts", result);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("createMessage", async (data) => {
            try {
                // Utiliza los métodos de MessageDAO directamente
                await MessageDAO.createMessage(data.user, data.message)
                const messages = await MessageDAO.getAllMessages()
                io.emit("publishMessages", messages)
            } catch (error) {
                socket.emit("statusError", error.message)
            }
        })

        // Mensaje de usuario escribiendo
        socket.on('typing', (data) => {
            socket.broadcast.emit("typing", data)
        })
    });
};

