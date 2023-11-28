import { ticketModel } from "../models/ticket.model";

export class TicketController {
  constructur() {
    this.model = ticketModel;
  }

  async create(cart, userId) {
    const ticket = {
      purchase_datetime: new Date(),
      amount: cart.totalPrice,
      purchaser: userId,
    };
    try {
      const res = await this.model.create(ticket);
      return res;
    } catch (e) {
      console.log(e.message);
    }
  }
}
