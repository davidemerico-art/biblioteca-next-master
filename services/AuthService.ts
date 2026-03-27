import { User } from "../types";
import { StorageService } from "./StorageService";
import { UserService } from "./UserService";

export class AuthService {
  static login(user: User): void {

    const registeredUser = UserService.saveUser(user);
    
    StorageService.set("user", registeredUser);
  }

  static logout(): void {
    StorageService.remove("user");
  }

  static getCurrentUser(): User | null {
    return StorageService.get<User | null>("user", null);
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static isAdmin(): boolean {
    return this.getCurrentUser()?.role === "admin";
  }
}