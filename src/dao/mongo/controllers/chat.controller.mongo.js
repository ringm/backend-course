import { messageModel } from "../models/chat.model.js";

export class ChatController {
  constructor() {
    this.model = messageModel;
  }

  async getMessages() {
    try {
      const result = await this.model.find();
      return result;
    } catch (error) {
      throw new Error("Couldn't retrieve messages.");
    }
  }

  async createMessage(message) {
    try {
      const result = await this.model.create(message);
      return result;
    } catch (error) {
      throw new Error("Couldn't create message.");
    }
  }
}
