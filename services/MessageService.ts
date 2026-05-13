import { Message } from "../types";
import { StorageService } from "./StorageService";

export class MessageService {
  static getMessages(): Message[] {
    const messages = StorageService.get<Message[]>("messages", []);
    let needsUpdate = false;
    
    const messagesWithIds = messages.map((m, index) => {
      if (!m.id) {
        needsUpdate = true;
        return {
          ...m,
          id: `msg-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`
        };
      }
      return m;
    });

    if (needsUpdate) {
      StorageService.set("messages", messagesWithIds);
    }
    
    return messagesWithIds;
  }

  static sendMessage(message: Message): void {
    const messages = this.getMessages();
    const msgWithId = {
      ...message,
      id: message.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    StorageService.set("messages", [...messages, msgWithId]);
  }

  static deleteMessage(messageId: string): void {
    const messages = this.getMessages();
    StorageService.set("messages", messages.filter(m => m.id !== messageId));
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