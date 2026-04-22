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
    return this.getMessages()
      .filter(m => 
        (m.from === "user" && m.userId === userId) || 
        (m.from === "admin" && m.toUserId === userId)
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  static getUsersWithMessages(): number[] {
    const messages = this.getMessages();
    const userIds = messages
      .map(m => m.userId || m.toUserId)
      .filter(id => id !== undefined) as number[];
    return Array.from(new Set(userIds));
  }
}