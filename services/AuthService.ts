import { User } from "../types";
import { StorageService } from "./StorageService";
import { UserService } from "./UserService";
import { ApiService } from "./ApiService";

export class AuthService {
  static login(user: User): void {
    const registeredUser = UserService.saveUser(user);
    StorageService.set("user", registeredUser);

    if (ApiService.hasBackend()) {
      ApiService.post<User>("/auth/login", user)
        .then((remoteUser) => {
          const mergedUser = { ...registeredUser, ...remoteUser };
          StorageService.set("user", mergedUser);
          UserService.saveUser(mergedUser);
        })
        .catch((error) => {
          console.error("AuthService login backend error:", error);
        });
    }
  }

  static logout(): void {
    if (ApiService.hasBackend()) {
      ApiService.post<void>("/auth/logout", {}).catch((error) => {
        console.error("AuthService logout backend error:", error);
      });
    }

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