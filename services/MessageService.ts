import { Message } from "../types";
import { StorageService } from "./StorageService";

export class MessageService {
  static getMessages(): Message[] {
    return StorageService.get<Message[]>("messages", []);
  }

  static sendMessage(message: Message): void {
    const messages = this.getMessages();
    StorageService.set("messages", [...messages, message]);
  }

  static hasUnreadFromUser(userId: number): boolean {
    return this.getMessages().some(m => m.from === "user" && m.userId === userId);
  }

  static getMessagesFromUser(userId: number): Message[] {
    return this.getMessages().filter(m => m.from === "user" && m.userId === userId);
  }
}