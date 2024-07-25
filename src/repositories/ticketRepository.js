import TicketDto from "../dao/dto/ticketDTO.js";

class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getTickets() {
        try {
          return await ticketModel.find();
        } catch (error) {
          throw error;
        }
      }
    
    async createTicket(email, amount, products) {
        try {
            const ticket = await this.dao.createTicket({
                purchaser: email,
                amount: amount,
                products: products,
                purchaseDateTime: new Date()
            });
            return new TicketDto(ticket);
        } catch (error) {
            throw new Error(`Could not create Ticket: ${error.message}`);
        }
    }
}

export default TicketRepository;
