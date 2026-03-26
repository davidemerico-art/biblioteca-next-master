"use client";

import { useState, useEffect } from "react";
import { ReviewService } from "@/services/ReviewService";
import { Recensione } from "@/types";

export default function Recensioni() {
  const [recensioni, setRecensioni] = useState<Recensione[]>([]);
  const [utente, setUtente] = useState("");
  const [titolo, setTitolo] = useState("");
  const [testo, setTesto] = useState("");
  const [stelle, setStelle] = useState(5);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    // SOLID: recupero dati dal Service
    setRecensioni(ReviewService.getGlobalReviews());
  }, []);

  const inviaRecensione = (e: React.FormEvent) => {
    e.preventDefault();

    if (!utente || !titolo || !testo) {
      alert("Compila tutti i campi");
      return;
    }

    ReviewService.addGlobalReview({
      user: utente,
      titolo,
      testo,
      stelle
    });

    // Aggiorna lo stato locale
    setRecensioni(ReviewService.getGlobalReviews());

    setTitolo("");
    setTesto("");
    setStelle(5);
    setHover(0);
  };

  const eliminaRecensione = (id: number) => {
    if(confirm("Sei sicuro di voler eliminare questa recensione?")) {
      ReviewService.deleteGlobalReview(id);
      setRecensioni(ReviewService.getGlobalReviews());
    }
  };

  const modificaRecensione = (id: number) => {
    const r = recensioni.find((rec) => rec.id === id);
    if (!r) return;

    const nuovoTitolo = prompt("Nuovo titolo", r.titolo);
    const nuovoTesto = prompt("Nuovo testo", r.testo);
    const nuoveStelle = prompt("Nuove stelle (1-5)", r.stelle.toString());

    if (nuovoTitolo && nuovoTesto && nuoveStelle) {
      ReviewService.updateGlobalReview({
        ...r,
        titolo: nuovoTitolo,
        testo: nuovoTesto,
        stelle: parseInt(nuoveStelle)
      });
      setRecensioni(ReviewService.getGlobalReviews());
    }
  };

  return (
    <div className="page-wrapper max-w-6xl animate-fade-in">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">Recensioni Generali</h1>
        <p className="text-sm sm:text-[15px] text-[var(--color-text-secondary)] font-medium">Scopri cosa pensa la community di BiblioSphere</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* Lista Recensioni */}
        <div className="flex-1 w-full space-y-4">
          {recensioni.length === 0 && (
            <div className="p-8 sm:p-10 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-[var(--color-text-secondary)]">
              Nessuna recensione ancora. Sii il primo!
            </div>
          )}

          {recensioni.map((r) => (
            <div key={r.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 sm:p-6 rounded-[24px] shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-[17px] font-semibold tracking-tight text-[var(--color-text-primary)]">{r.titolo}</h4>
                  <p className="text-[14px] text-[var(--color-text-secondary)] font-medium">{r.user}</p>
                </div>
                <div className="flex gap-0.5 text-[var(--color-accent-base)] text-sm tracking-widest mt-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span key={num}>{num <= r.stelle ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>

              <p className="text-[15px] text-[var(--color-text-primary)] leading-relaxed mt-2 mb-6">
                {r.testo}
              </p>

              <div className="flex gap-2 mt-auto">
                <button className="btn-ghost btn-sm text-red-500 hover:bg-red-500/10 border-transparent hover:border-transparent py-2" onClick={() => eliminaRecensione(r.id)}>
                  Elimina
                </button>
                <button className="btn-ghost btn-sm py-2" onClick={() => modificaRecensione(r.id)}>
                  Modifica
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Recensione - Ordine invertito su mobile in modo da mostrare prima i commenti e poi il form per scriverne uno, ma sticky su desktop */}
        <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-24 order-last lg:order-none">
          <div className="bg-[var(--color-surface-elev)] border border-[var(--color-border)] rounded-[24px] p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-semibold tracking-tight mb-6 text-[var(--color-text-primary)]">Scrivi una recensione</h3>
            
            <form onSubmit={inviaRecensione} className="space-y-5">
              <div>
                <label>Il tuo Nome</label>
                <input type="text" placeholder="Nome e Cognome" value={utente} onChange={(e) => setUtente(e.target.value)} required />
              </div>

              <div>
                <label>Titolo Recensione</label>
                <input type="text" placeholder="Riassumi il tuo pensiero" value={titolo} onChange={(e) => setTitolo(e.target.value)} required />
              </div>

              <div>
                <label>Testo Completo</label>
                <textarea placeholder="Scrivi la tua recensione..." value={testo} onChange={(e) => setTesto(e.target.value)} required rows={4} />
              </div>

              <div>
                <label>Valutazione Globale</label>
                {/* Touch-target optimization: usa button con padding negativo per un'area tattile generosa ma estetica vicina */}
                <div className="flex gap-2 text-3xl cursor-pointer text-[var(--color-border-accent)] justify-center mt-2">
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

              <button type="submit" className="w-full mt-6 py-4 text-[16px]">
                Pubblica Recensione
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}