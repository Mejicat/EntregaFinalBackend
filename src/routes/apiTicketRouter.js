import { Router } from "express";

import jwtAuth from "../middlewares/jwtAuth.js";
import isAdmin from "../middlewares/isAdmin.js";
import TicketService from "../services/ticketService.js";

const router = Router();

router.get('/', jwtAuth, isAdmin, async (req, res, next) => {
  try {
    const tickets = await TicketService.getAllTickets();
    res.status(200).send({ status: 'success', message: 'tickets encontrados', tickets });
  } catch (error) {
    next(error);
  }
});

export default router;

