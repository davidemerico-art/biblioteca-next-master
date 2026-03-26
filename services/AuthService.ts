import { User } from "../types";
import { StorageService } from "./StorageService";

export class AuthService {
  static login(user: User): void {
    StorageService.set("user", user);
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