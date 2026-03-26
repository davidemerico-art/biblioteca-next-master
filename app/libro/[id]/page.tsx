"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { libri } from "../../../data/libri";

export default function BookDetail() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [libro, setLibro] = useState<any>(null);
  const [recensioni, setRecensioni] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [testo, setTesto] = useState("");
  const [stelle, setStelle] = useState(5);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");
    const tutti = [...libri, ...creati];
    const trovato = tutti.find((l) => l.id === id);
    setLibro(trovato || null);

    const data = localStorage.getItem(`recensioni_${id}`);
    if (data) setRecensioni(JSON.parse(data));
  }, [id]);

  const salvaRecensione = (e: any) => {
    e.preventDefault();
    const nuova = { id: Date.now(), user: nome, testo, stelle };
    const nuove = [...recensioni, nuova];
    
    setRecensioni(nuove);
    localStorage.setItem(`recensioni_${id}`, JSON.stringify(nuove));

    setNome("");
    setTesto("");
    setStelle(5);
    setHover(0);
  };

  if (!libro) {
    return (
      <div className="page-wrapper animate-fade-in text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Libro non trovato</h2>
        <button onClick={() => router.push("/biblioteca")}>Torna alla biblioteca</button>
      </div>
    );
  }

  return (
    <div className="page-wrapper max-w-4xl animate-fade-in">
      <button onClick={() => router.back()} className="btn-ghost rounded-full p-2 w-10 h-10 mb-6 sm:mb-8">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
      </button>

      <div className="flex flex-col md:flex-row gap-6 sm:gap-10">
        <div className="w-full md:w-1/3 shrink-0 mx-auto max-w-[280px] md:max-w-none">
          <div className="bg-[var(--color-surface-hover)] rounded-[24px] overflow-hidden shadow-sm border border-[var(--color-border)] aspect-[2/3] flex items-center justify-center">
            {libro.img ? (
              <img src={libro.img} alt={libro.titolo} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[var(--color-text-muted)] font-medium text-sm">Nessuna Immagine</span>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 py-2 sm:py-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2 text-center md:text-left">{libro.titolo}</h1>
          <h3 
            onClick={() => router.push(`/autore/${encodeURIComponent(libro.autore)}`)}
            className="text-lg sm:text-xl text-[var(--color-accent-base)] font-medium mb-6 cursor-pointer hover:underline inline-block w-fit mx-auto md:mx-0"
          >
            {libro.autore}
          </h3>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
            <span className="badge bg-[var(--color-surface-elev)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">ISBN: {libro.isbn}</span>
            <span className="badge bg-[var(--color-surface-elev)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">{libro.genere}</span>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-sm mt-2 sm:mt-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Citazione Famosa</h4>
            <blockquote className="text-[15px] sm:text-[17px] italic text-[var(--color-text-primary)] leading-relaxed">
              "{libro.fraseFamosa}"
            </blockquote>
          </div>
        </div>
      </div>

      <hr className="my-8 sm:my-10" />

      <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
        <div className="flex-1 order-2 lg:order-1">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Recensioni</h2>
          {recensioni.length === 0 && <p className="text-[var(--color-text-muted)]">Nessuna recensione ancora.</p>}
          
          <div className="space-y-4">
            {recensioni.map((r) => (
              <div key={r.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <strong className="text-[15px] text-[var(--color-text-primary)]">{r.user}</strong>
                  <div className="flex text-[var(--color-accent-base)] text-sm tracking-widest">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <span key={num}>{num <= r.stelle ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
                <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">{r.testo}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[400px] shrink-0 order-1 lg:order-2">
          <div className="bg-[var(--color-surface-elev)] border border-[var(--color-border)] rounded-[24px] p-6 sm:p-8 shadow-sm lg:sticky lg:top-24">
            <h3 className="text-xl font-semibold tracking-tight mb-6">Scrivi una recensione</h3>
            <form onSubmit={salvaRecensione} className="space-y-5">
              <div>
                <label>Il tuo nome</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Nome e Cognome" />
              </div>
              
              <div>
                <label>Recensione</label>
                <textarea value={testo} onChange={(e) => setTesto(e.target.value)} required placeholder="Cosa ne pensi?" rows={4} />
              </div>

              <div>
                <label>Valutazione</label>
                {/* Ottimizzazione Touch: gap-2 e p-2 per allargare l'area di interazione */}
                <div className="flex gap-2 text-3xl cursor-pointer text-[var(--color-border-accent)] justify-center sm:justify-start mt-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button 
                      key={num} 
                      type="button"
                      onClick={() => setStelle(num)} 
                      onMouseEnter={() => setHover(num)} 
                      onMouseLeave={() => setHover(0)}
                      className="p-2 -m-2 bg-transparent hover:bg-transparent border-none transition-colors duration-200 touch-manipulation"
                      style={{ color: num <= (hover || stelle) ? "var(--color-accent-base)" : "inherit" }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full mt-4 py-4 text-[16px]">Invia recensione</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}