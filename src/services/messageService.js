import MessageDTO from "../dao/dto/messageDTO.js"
import MessageDAO from "../dao/messageDAO.js"

class MessageService {
    async getMessages() {
        try {
          const messages = await MessageDAO.getMessages()
          if (!messages) {
            throw new Error("No messages found")
          }
          return messages.map((message) => new MessageDTO(message))
        } catch (error) {
          throw error;
        }
      }
    
      async addMessage(messageData) {
        try {
          const message = await MessageDAO.addMessage(messageData)
          if (!message) {
            throw new Error("Error adding message")
          }
          return new MessageDTO(message)
        } catch (error) {
          throw error
        }
      }
    
      async deleteMessage(id) {
        try {
          const message = await MessageDAO.deleteMessage(id)
          if (!message) {
            throw new Error("Message not found")
          }
          return new MessageDTO(message)
        } catch (error) {
          throw error
        }
      }
    }
    
  
  export default new MessageService()