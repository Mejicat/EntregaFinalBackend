import messageModel from './models/messageModel.js'

class MessageDAO {
    static instance = null;

    constructor() {
        if (!MessageDAO.instance) {
            MessageDAO.instance = this;
        }
        return MessageDAO.instance;
    }

    static getInstance() {
        if (!MessageDAO.instance) {
            MessageDAO.instance = new MessageDAO();
        }
        return MessageDAO.instance;
    }
    
    async createMessage(data) {
        const  {user, message} = data;
        if (!user || !message) {
            throw new Error ("Error al consultar mensajes")
        }

        try { 
            await messageModel.create({ user, message: messageContent }) //crea el doc. en la DB
            return await getAllMessages ()
        } catch (error) {
            console.error(error.message)
            throw new Error('Error al crear el mensaje')
        }
    }

    async getAllMessages() { //obtiene todos los mensajes
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los mensajes");
        }
    }
}

export default MessageDAO;