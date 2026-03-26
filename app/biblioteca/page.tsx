"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookService } from "@/services/BookService";
import { AuthService } from "@/services/AuthService";
import { Libro, Role } from "@/types";
import { StorageService } from "@/services/StorageService";

export default function Biblioteca() {
  const [search, setSearch] = useState("");
  const [libriTotali, setLibriTotali] = useState<Libro[]>([]);
  const [role, setRole] = useState<Role | null>(null);

  const router = useRouter();

  useEffect(() => {
    // SOLID: Delegation al Service
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
    BookService.deleteBook(id);
    // Aggiorna lo stato locale per riflettere la UI
    setLibriTotali(BookService.getAllBooks());
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
      <h1 className="text-4xl font-bold tracking-tight mb-8">La Collezione</h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="w-full max-w-md relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Cerca libro, autore o ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 rounded-full bg-[var(--color-surface-hover)] border-transparent focus:bg-[var(--color-surface)]"
          />
        </div>

        <div className="flex gap-3 items-center">
          {role === "admin" && (
            <>
              <button onClick={() => router.push("/crea-libro")}>Crea Libro</button>
              <button className="btn-ghost" onClick={() => router.push("/cerca/utenti")}>Cerca Utenti</button>
            </>
          )}

          {role === "user" && (
            <button
              className="btn-ghost px-4 rounded-full"
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
              Contatta Admin
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {libriFiltrati.map((libro) => (
          <div key={libro.id} className="card flex flex-col h-full group">
            <div className="relative h-[280px] w-full overflow-hidden bg-[var(--color-surface-hover)]">
              {libro.img ? (
                <img
                  src={libro.img}
                  alt={libro.titolo}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                  onClick={() => router.push(`/libro/${libro.id}`)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[var(--color-text-muted)] cursor-pointer" onClick={() => router.push(`/libro/${libro.id}`)}>
                  Nessuna Immagine
                </div>
              )}
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)] mb-1 leading-tight line-clamp-2 cursor-pointer hover:text-[var(--color-accent-base)] transition-colors" onClick={() => router.push(`/libro/${libro.id}`)}>
                {libro.titolo}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-4">{libro.autore}</p>

              <div className="mt-auto grid grid-cols-2 gap-2">
                {(role === "user" || role === "admin") && (
                  <>
                    <button className="btn-ghost btn-sm w-full py-2" onClick={() => prenota(libro)}>Prenota</button>
                    <button className="btn-sm w-full py-2" onClick={() => router.push(`/acquista?id=${libro.id}`)}>Acquista</button>
                  </>
                )}

                {role === "admin" && (
                  <>
                    <button className="btn-ghost btn-sm w-full py-2 col-span-1 mt-2" onClick={() => router.push(`/modifica/${libro.id}`)}>Modifica</button>
                    <button className="bg-red-500/10 text-red-500 hover:bg-red-500/20 btn-sm w-full py-2 col-span-1 mt-2 border-none" onClick={() => eliminaLibro(libro.id)}>Elimina</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {libriFiltrati.length === 0 && (
          <div className="col-span-full py-12 text-center text-[var(--color-text-muted)]">
            Nessun libro trovato con questi criteri di ricerca.
          </div>
        )}
      </div>
    </div>
  );
}