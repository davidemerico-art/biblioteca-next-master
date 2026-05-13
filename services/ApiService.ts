export class ApiService {
  static getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "";
  }

  static hasBackend(): boolean {
    return !!this.getBaseUrl();
  }

  static async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    if (!this.hasBackend()) {
      throw new Error("Backend non configurato: imposta NEXT_PUBLIC_API_URL");
    }

    const url = `${this.getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`API ${response.status}: ${body || response.statusText}`);
    }

    if (response.status === 204) {
      return null as unknown as T;
    }

    return response.json();
  }

  static get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  static post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  static put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  static delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }
}
