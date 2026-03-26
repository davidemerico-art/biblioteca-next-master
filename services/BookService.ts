import { Libro } from "../types";
import { StorageService } from "./StorageService";
import { libri as defaultLibri } from "../data/libri";

export class BookService {
  static getAllBooks(): Libro[] {
    const creati = StorageService.get<Libro[]>("libriCreati", []);
    return [...defaultLibri, ...creati];
  }

  static getBookById(id: number): Libro | undefined {
    return this.getAllBooks().find((l) => l.id === id);
  }

  static deleteBook(id: number): void {
    const creati = StorageService.get<Libro[]>("libriCreati", []);
    const aggiornati = creati.filter((l) => l.id !== id);
    StorageService.set("libriCreati", aggiornati);
  }

  // --- PRESTITI ---
  static getPrestiti(): Libro[] {
    return StorageService.get<Libro[]>("prenotati", []).filter(Boolean);
  }

  static prenota(libro: Libro): boolean {
    const salvati = this.getPrestiti();
    const isGiaPrenotato = salvati.some((l) => l.id === libro.id);
    
    if (isGiaPrenotato) return false;

    StorageService.set("prenotati", [...salvati, libro]);
    return true;
  }

  static restituisci(id: number, utenteRole: "user" | "admin" | undefined): void {
    const prestiti = this.getPrestiti();
    const libro = prestiti.find((l) => l.id === id);
    if (!libro) return;

    // Rimuovi dai prestiti
    const aggiornati = prestiti.filter((l) => l.id !== id);
    StorageService.set("prenotati", aggiornati);

    // Aggiungi alla cronologia restituiti
    const restituiti = StorageService.get<Libro[]>("restituiti", []);
    StorageService.set("restituiti", [
      ...restituiti,
      { ...libro, dataRestituzione: new Date().toISOString(), utenteRole },
    ]);
  }

  // --- ACQUISTI ---
  static getAcquisti(): Libro[] {
    return StorageService.get<Libro[]>("acquisti", []).filter(Boolean);
  }

  static acquista(libro: Libro, utenteRole: "user" | "admin" | undefined): boolean {
    const acquisti = this.getAcquisti();
    if (acquisti.some((l) => l.id === libro.id)) return false;

    StorageService.set("acquisti", [
      ...acquisti,
      { ...libro, dataAcquisto: new Date().toISOString(), utenteRole },
    ]);
    return true;
  }
}