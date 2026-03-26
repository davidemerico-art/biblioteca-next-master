"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookService } from "@/services/BookService";
import { AuthService } from "@/services/AuthService";
import { Libro, Role } from "@/types";
import { StorageService } from "@/services/StorageService";
import Book from "../components/Book";

export default function Biblioteca() {
  const [search, setSearch] = useState("");
  const [libriTotali, setLibriTotali] = useState<Libro[]>([]);
  const [role, setRole] = useState<Role | null>(null);

  const router = useRouter();

  useEffect(() => {
    setLibriTotali(BookService.getAllBooks());

    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setRole(currentUser.role);
    } else {
      router.push("/");
    }
  }, [router]);

  const prenota = (libro: Libro) => {
    const success = BookService.prenota(libro);
    if (!success) {
      alert("Hai già prenotato questo libro");
    } else {
      alert("Libro prenotato con successo!");
    }
  };

  const eliminaLibro = (id: number) => {
    if(confirm("Sei sicuro di voler eliminare questo libro?")) {
      BookService.deleteBook(id);
      setLibriTotali(BookService.getAllBooks());
    }
  };

  const libriFiltrati = useMemo(() => {
    const query = search.toLowerCase();
    return libriTotali.filter(
      (libro) =>
        libro.titolo?.toLowerCase().includes(query) ||
        libro.autore?.toLowerCase().includes(query) ||
        String(libro.isbn).toLowerCase().includes(query)
    );
  }, [search, libriTotali]);

  return (
    <div className="page-wrapper animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 sm:mb-8 text-[var(--color-text-primary)]">La Collezione</h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div className="w-full max-w-md relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Cerca libro, autore o ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 rounded-full bg-[var(--color-surface-hover)] border-transparent focus:bg-[var(--color-surface)] w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {role === "admin" && (
            <>
              <button className="w-full sm:w-auto py-3 sm:py-2" onClick={() => router.push("/crea-libro")}>Crea Libro</button>
              <button className="btn-ghost w-full sm:w-auto py-3 sm:py-2" onClick={() => router.push("/cerca/utenti")}>Cerca Utenti</button>
            </>
          )}

          {role === "user" && (
            <button
              className="btn-ghost w-full sm:w-auto py-3 sm:py-2 rounded-full"
              onClick={() => {
                const text = prompt("Scrivi un messaggio per l'admin:");
                if (!text) return;
                
                const messages = StorageService.get<any[]>("messages", []);
                messages.push({
                  from: "user",
                  text,
                  userId: AuthService.getCurrentUser()?.id, 
                  date: new Date().toISOString(),
                });

                StorageService.set("messages", messages);
                alert("Messaggio inviato all'admin!");
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Contatta Admin
            </button>
          )}
        </div>
      </div>

      {/* GRID LIBRI FIXATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
        {libriFiltrati.map((libro) => (
          <div key={libro.id} className="h-full">
            <Book 
              id={libro.id}
              titolo={libro.titolo}
              autore={libro.autore}
              isbn={String(libro.isbn)}
              genere={libro.genere || "N/A"}
              fraseFamosa={libro.fraseFamosa || ""}
              img={libro.img || ""}
              prenota={() => prenota(libro)}
              acquista={() => router.push(`/acquista?id=${libro.id}`)}
              isAdmin={role === "admin"}
              modifica={() => router.push(`/modifica/${libro.id}`)}
              elimina={() => eliminaLibro(libro.id)}
            />
          </div>
        ))}
        {libriFiltrati.length === 0 && (
          <div className="col-span-full py-16 text-center text-[var(--color-text-muted)]">
            Nessun libro trovato con questi criteri di ricerca.
          </div>
        )}
      </div>
    </div>
  );
}