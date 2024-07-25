import ticketModel from './models/ticketModel.js'

class TicketDAO {
  static instance = null;

  constructor() {
      if (!TicketDAO.instance) {
        TicketDAO.instance = this;
      }
      return TicketDAO.instance;
  }

  static getInstance() {
      if (!TicketDAO.instance) {
        TicketDAO.instance = new TicketDAO();
      }
      return TicketDAO.instance;
  }

  async getTickets() {
    try {
      const tickets = await ticketModel.find().populate('purchaser').populate('products.product').lean()
      return tickets
    } catch (error) {
      throw error
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketModel.findById(ticketId)
      return ticket
    } catch (error) {
      throw error
    }
  }

  async getTicketsByUserId(userId) {
    try {
      const tickets = await ticketModel.find({ userId: userId })
      return tickets
    } catch (error) {
      throw error
    }
  }

  async createTicket(ticket) {
    try {
      const newTicket = await ticketModel.create(ticket)
      return newTicket
    } catch (error) {
      throw error
    }
  }
}

export default TicketDAO;

