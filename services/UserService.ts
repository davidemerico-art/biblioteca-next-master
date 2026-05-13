import { User } from "../types";
import { StorageService } from "./StorageService";
import { ApiService } from "./ApiService";

export class UserService {
  static getAllUsers(): User[] {
    const users = StorageService.get<User[]>("utenti", []);
    if (ApiService.hasBackend()) {
      this.fetchAllUsers().catch((error) => {
        console.error("UserService fetchAllUsers backend error:", error);
      });
    }
    return users;
  }

  static async fetchAllUsers(): Promise<User[]> {
    const users = await ApiService.get<User[]>("/users");
    StorageService.set("utenti", users);
    return users;
  }

  static saveUser(user: User): User {
    const users = this.getAllUsers();
    
    const existingIndex = users.findIndex((u) => u.email === user.email);

    let savedUser: User;

    if (existingIndex >= 0) {

      savedUser = { ...users[existingIndex], ...user };
      users[existingIndex] = savedUser;
    } else {

      savedUser = { ...user, id: Date.now() };
      users.push(savedUser);
    }

    StorageService.set("utenti", users);
    return savedUser;
  }
}