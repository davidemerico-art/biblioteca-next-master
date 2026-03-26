import { Autore } from "../types";
import { StorageService } from "./StorageService";
import { autori as defaultAutori } from "../data/autori";

export class AuthorService {
  static getAllAuthors(): Autore[] {
    const creati = StorageService.get<Autore[]>("autoriCreati", []);
    // Diciamo esplicitamente a TypeScript di trattare l'array di default come Autore[]
    return [...(defaultAutori as Autore[]), ...creati];
  }

  static getAuthorByName(nome: string): Autore | undefined {
    return this.getAllAuthors().find((a) => a.nome === nome);
  }

  static saveAuthor(autore: Autore): void {
    const creati = StorageService.get<Autore[]>("autoriCreati", []);
    const index = creati.findIndex((a) => a.nome === autore.nome);
    if (index >= 0) {
      creati[index] = autore;
    } else {
      creati.push(autore);
    }
    StorageService.set("autoriCreati", creati);
  }
}