"use client";

import { Suspense } from "react"; // 1. Aggiunto questo
import { useRouter, useSearchParams } from "next/navigation";
import { BookService } from "@/services/BookService";
import { AuthService } from "@/services/AuthService";

// Spostiamo la logica in un sottocomponente
function AcquistaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = AuthService.getCurrentUser();
    if (!user) {
      router.push("/");
      return;
    }

    const idParam = searchParams.get("id");
    const id = Number(idParam);

    if (!idParam || isNaN(id)) {
      alert("Libro non valido");
      return;
    }

    const libroTrovato = BookService.getBookById(id);
    if (!libroTrovato) {
      alert("Libro non trovato");
      return;
    }

    const success = BookService.acquista(libroTrovato, user.role);

    if (!success) {
      alert("Hai già acquistato questo libro");
      router.push("/miei-libri");
      return;
    }

    alert("Pagamento elaborato con successo tramite Apple Pay!");
    router.push("/miei-libri");
  };

  return (
    <div className="page-wrapper flex flex-col items-center justify-center min-h-[80vh] animate-fade-in px-4">
      <div className="form-card max-w-[500px] w-full text-center p-6 sm:p-10">
        <div className="w-16 h-16 bg-[var(--color-text-primary)] text-[var(--color-bg-base)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
          <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-4H7v-2h2V8c0-1.1.9-2 2-2h3v2h-3v2h3v2h-3v4z"/></svg>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-[var(--color-text-primary)]">
          Checkout Sicuro
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[var(--color-text-secondary)] mb-8 px-2">
          Completa l'acquisto del volume autorizzando il pagamento dal tuo dispositivo.
        </p>

        <form onSubmit={handleSubmit} className="animate-fade-in-up w-full">
          <button type="submit" className="w-full py-4 text-[16px] sm:text-[17px] bg-[var(--color-text-primary)] hover:bg-[var(--color-text-muted)] text-[var(--color-bg-base)] rounded-full">
            Acquista con Apple Pay
          </button>
          <button type="button" onClick={() => router.back()} className="btn-ghost w-full py-4 text-[16px] sm:text-[17px] mt-3">
            Annulla
          </button>
        </form>
      </div>
    </div>
  );
}


export default function AcquistaPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Caricamento checkout...</div>}>
      <AcquistaContent />
    </Suspense>
  );
}