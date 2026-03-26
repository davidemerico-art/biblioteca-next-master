export class StorageService {
  /**
   * Recupera un dato dallo storage.
   */
  static get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  /**
   * Salva un dato nello storage.
   */
  static set<T>(key: string, value: T): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  /**
   * Rimuove un dato dallo storage.
   */
  static remove(key: string): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }
}