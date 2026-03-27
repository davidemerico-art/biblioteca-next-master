import { User } from "../types";
import { StorageService } from "./StorageService";

export class UserService {
  static getAllUsers(): User[] {
    return StorageService.get<User[]>("utenti", []);
  }

  static saveUser(user: User): User {
    const users = this.getAllUsers();
    
    const existingIndex = users.findIndex(u => u.email === user.email);

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