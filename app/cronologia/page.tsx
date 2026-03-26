"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/AuthService";
import { BookService } from "@/services/BookService";
import { Libro } from "@/types";

export default function CronologiaPage() {
  const router = useRouter();

  const [prestiti, setPrestiti] = useState<Libro[]>([]);
  const [restituiti, setRestituiti] = useState<Libro[]>([]);
  const [acquisti, setAcquisti] = useState<Libro[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      router.push("/");
      return;
    }

    setPrestiti(BookService.getPrestiti());
    setRestituiti(JSON.parse(localStorage.getItem("restituiti") || "[]"));
    setAcquisti(BookService.getAcquisti());
  }, [router]);

  const matchLibro = (libro: Libro) => {
    const query = search.toLowerCase();
    return (
      libro.titolo.toLowerCase().includes(query) ||
      libro.autore.toLowerCase().includes(query) ||
      (libro.isbn && libro.isbn.toString().toLowerCase().includes(query))||
      (libro.dataAcquisto && libro.dataAcquisto.toString().toLowerCase().includes(query) )||
      libro.dataRestituzione?.toLocaleLowerCase().includes(query)||
      libro.dataPresa?.toLocaleLowerCase().includes(query)
  )};

  const prestitiFiltrati = prestiti.filter(matchLibro);
  const restituitiFiltrati = restituiti.filter(matchLibro);
  const acquistiFiltrati = acquisti.filter(matchLibro);

  return (
    <div className="page-wrapper animate-fade-in max-w-4xl">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button onClick={() => router.push("/biblioteca")} className="btn-ghost rounded-full p-2 w-10 h-10 shrink-0">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Cronologia Attività</h1>
          <p className="text-sm sm:text-[15px] text-[var(--color-text-secondary)] font-medium">Tutte le tue azioni sui libri</p>
        </div>
      </div>

      <div className="mb-8 sm:mb-10 relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input
          type="text"
          placeholder="Cerca nella cronologia..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 bg-[var(--color-surface)] shadow-sm rounded-2xl w-full"
        />
      </div>

      <div className="space-y-10 sm:space-y-12">
        <section>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight mb-4 text-[var(--color-text-primary)]">Prestiti Attivi ({prestitiFiltrati.length})</h2>
          <div className="flex flex-col gap-3">
            {prestitiFiltrati.length === 0 ? (
              <p className="text-[var(--color-text-muted)] text-[14px] sm:text-[15px] px-2">Nessun prestito attivo trovato.</p>
            ) : (
              prestitiFiltrati.map((libro) => (
                <div key={libro.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-sm gap-3 sm:gap-0">
                  <div>
                    <h3 className="font-semibold text-[16px] tracking-tight">{libro.titolo}</h3>
                    <div className="text-[13px] text-[var(--color-text-secondary)]">{libro.autore}</div>
                  </div>
                  <span className="badge bg-[var(--color-accent-dim)] text-[var(--color-accent-base)] self-start sm:self-auto">Attivo</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight mb-4 text-[var(--color-text-primary)]">Restituzioni ({restituitiFiltrati.length})</h2>
          <div className="flex flex-col gap-3">
            {restituitiFiltrati.length === 0 ? (
              <p className="text-[var(--color-text-muted)] text-[14px] sm:text-[15px] px-2">Nessuna restituzione trovata.</p>
            ) : (
              restituitiFiltrati.map((libro) => (
                <div key={libro.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-sm gap-3 sm:gap-0">
                  <div>
                    <h3 className="font-semibold text-[16px] tracking-tight">{libro.titolo}</h3>
                    <div className="text-[13px] text-[var(--color-text-secondary)]">Restituito il {libro.dataRestituzione ? new Date(libro.dataRestituzione).toLocaleDateString() : "-"}</div>
                  </div>
                  <span className="badge bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] self-start sm:self-auto">Archiviato</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight mb-4 text-[var(--color-text-primary)]">Acquisti ({acquistiFiltrati.length})</h2>
          <div className="flex flex-col gap-3">
            {acquistiFiltrati.length === 0 ? (
              <p className="text-[var(--color-text-muted)] text-[14px] sm:text-[15px] px-2">Nessun acquisto trovato.</p>
            ) : (
              acquistiFiltrati.map((libro) => (
                <div key={libro.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-sm gap-3 sm:gap-0">
                  <div>
                    <h3 className="font-semibold text-[16px] tracking-tight">{libro.titolo}</h3>
                    <div className="text-[13px] text-[var(--color-text-secondary)]">Acquistato il {libro.dataAcquisto ? new Date(libro.dataAcquisto).toLocaleDateString() : "-"}</div>
                  </div>
                  <span className="badge bg-[rgba(90,159,110,0.15)] text-[#5a9f6e] self-start sm:self-auto">Completato</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}