import { Router } from "express";

import jwtAuth from "../middlewares/jwtAuth.js";
import MessageService from "../services/messageService.js";

const router = Router()

router.get("/", jwtAuth, async (req, res) => {
  try {
    const messages = await MessageService.getMessages();
    res.render("chat", { messages });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

export default router;