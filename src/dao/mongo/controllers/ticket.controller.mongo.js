import { ticketModel } from "../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

export class TicketController {
  constructor() {
    this.model = ticketModel;
  }

  async create(email, amount) {
    const ticket = {
      purchase_datetime: new Date(),
      code: uuidv4(),
      amount: amount,
      purchaser: email,
    };
    try {
      const res = await this.model.create(ticket);
      return res;
    } catch (e) {
      console.log(e.message);
    }
  }
}
