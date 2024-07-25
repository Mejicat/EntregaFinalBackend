import mongoose from "mongoose"

const messageCollection = "messages"

const messageSchema = mongoose.Schema({
    user: {          // Correo del usuario
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const messageModel = mongoose.model(messageCollection, messageSchema)

export default messageModel