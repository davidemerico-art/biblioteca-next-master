import { Recensione } from "../types";
import { StorageService } from "./StorageService";

export class ReviewService {
  static getGlobalReviews(): Recensione[] {
    return StorageService.get<Recensione[]>("recensioni", []);
  }

  static getBookReviews(bookId: number): Recensione[] {
    return StorageService.get<Recensione[]>(`recensioni_${bookId}`, []);
  }

  static addGlobalReview(recensione: Omit<Recensione, "id">): void {
    const current = this.getGlobalReviews();
    StorageService.set("recensioni", [...current, { ...recensione, id: Date.now() }]);
  }

  static addBookReview(bookId: number, recensione: Omit<Recensione, "id">): void {
    const current = this.getBookReviews(bookId);
    StorageService.set(`recensioni_${bookId}`, [...current, { ...recensione, id: Date.now() }]);
  }

  static deleteGlobalReview(id: number): void {
    const current = this.getGlobalReviews();
    StorageService.set("recensioni", current.filter(r => r.id !== id));
  }

  static updateGlobalReview(updatedReview: Recensione): void {
    const current = this.getGlobalReviews();
    const updatedList = current.map(r => r.id === updatedReview.id ? updatedReview : r);
    StorageService.set("recensioni", updatedList);
  }
}