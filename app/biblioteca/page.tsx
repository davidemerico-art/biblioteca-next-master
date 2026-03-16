"use client";

import { useState, useEffect } from "react";
import { libri } from "../../data/libri";
import Book from "../components/Book";
import { useRouter } from "next/navigation";

export default function Biblioteca() {
  const [prenotati, setPrenotati] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [libriTotali, setLibriTotali] = useState<any[]>([]);

  const router = useRouter();

  function acquista(libro: any) {
    router.push("/acquista");
  }

  function prenota(libro: any) {
    const salvati = JSON.parse(localStorage.getItem("prenotati") || "[]");

    if (salvati.find((l: any) => l && l.id === libro.id)) {
      alert("Hai già prenotato questo libro");
      return;
    }

    const nuovi = [...salvati, libro];
    localStorage.setItem("prenotati", JSON.stringify(nuovi));
    alert("Libro prenotato");
    return;
  }

  const libriFiltrati = libriTotali.filter(libro =>
    libro.titolo?.toLowerCase().includes(search.toLowerCase()) ||
    String(libro.isbn).toLowerCase().includes(search.toLowerCase()) ||
    libro.autore?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");
    setLibriTotali([...libri, ...creati]);
  }, []);

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="flex justify-between items-end mb-8 flex-wrap gap-5">
        <div>
          <h1 className="mb-2 text-3xl font-serif">La Collezione</h1>
          <p className="text-[var(--color-text-secondary)]">Esplora l'intero catalogo di tomi classici e novità.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn-ghost" onClick={() => router.push("/miei-libri")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
            I miei libri
          </button>
          <button onClick={() => router.push("/crea-libro")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Crea libro
          </button>
        </div>
      </div>

      <div className="relative mb-10 max-w-2xl w-full group">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-accent-base)]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input
          type="text"
          placeholder="Cerca per titolo, autore o ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-14 text-base w-full bg-[var(--color-surface-elev)] border-[var(--color-border)] rounded-xl outline-none text-[var(--color-text-primary)] focus:border-[var(--color-accent-base)] focus:ring-1 focus:ring-[var(--color-accent-base)] transition-all"
        />
      </div>

      {libriFiltrati.length === 0 ? (
        <div className="text-center py-16 px-5 bg-[var(--color-surface)] shadow-sm rounded-xl border border-dashed border-[var(--color-border)]">
          <svg className="mx-auto mb-4 opacity-50 text-[var(--color-text-muted)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>
          <h3 className="mb-2 text-xl font-medium text-[var(--color-text-primary)]">Nessun manoscritto trovato</h3>
          <p className="text-[var(--color-text-secondary)]">La tua ricerca non ha prodotto risultati negli archivi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 gap-y-10 items-stretch">
          {libriFiltrati.map((libro, idx) => (
            <div key={libro.id} style={{ animationDelay: `${idx * 0.05}s` }} className="h-full">
              <Book 
                {...libro} 
                prenota={() => prenota(libro)} 
                acquista={() => acquista(libro)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}