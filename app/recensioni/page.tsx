"use client";

import { useState, useEffect } from "react";

export default function Recensioni() {
  const [recensioni, setRecensioni] = useState<any[]>([]);
  const [utente, setUtente] = useState("");
  const [titolo, setTitolo] = useState("");
  const [testo, setTesto] = useState("");
  const [stelle, setStelle] = useState(5);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("recensioni");
    if (data) {
      setRecensioni(JSON.parse(data));
    }
  }, []);

  const salvaRecensioni = (nuoveRecensioni: any[]) => {
    setRecensioni(nuoveRecensioni);
    localStorage.setItem("recensioni", JSON.stringify(nuoveRecensioni));
  };

  const inviaRecensione = (e: any) => {
    e.preventDefault();

    if (!utente || !titolo || !testo) {
      alert("Compila tutti i campi");
      return;
    }

    const nuovaRecensione = {
      id: Date.now(),
      user: utente,
      titolo,
      testo,
      stelle
    };

    const nuoveRecensioni = [...recensioni, nuovaRecensione];
    salvaRecensioni(nuoveRecensioni);

    setTitolo("");
    setTesto("");
    setStelle(5);
    setHover(0);
  };

  const eliminaRecensione = (id: number) => {
    const filtrate = recensioni.filter(r => r.id !== id);
    salvaRecensioni(filtrate);
  };

  const modificaRecensione = (id: number) => {
    const nuovaLista = recensioni.map(r => {
      if (r.id === id) {
        const nuovoTitolo = prompt("Nuovo titolo", r.titolo);
        const nuovoTesto = prompt("Nuovo testo", r.testo);
        const nuoveStelle = prompt("Nuove stelle (1-5)", r.stelle);

        return {
          ...r,
          titolo: nuovoTitolo || r.titolo,
          testo: nuovoTesto || r.testo,
          stelle: parseInt(nuoveStelle || r.stelle)
        };
      }
      return r;
    });

    salvaRecensioni(nuovaLista);
  };

  return (
    <div className="page-wrapper max-w-5xl animate-fade-in">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">Recensioni Generali</h1>
        <p className="text-[15px] text-[var(--color-text-secondary)] font-medium">Cosa pensa la community della piattaforma</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Lista Recensioni */}
        <div className="flex-1 w-full space-y-4">
          {recensioni.length === 0 && (
            <div className="p-10 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-[var(--color-text-secondary)]">
              Nessuna recensione ancora.
            </div>
          )}

          {recensioni.map(r => (
            <div key={r.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-[24px] shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">{r.titolo}</h4>
                  <p className="text-[14px] text-[var(--color-text-secondary)] font-medium">{r.user}</p>
                </div>
                <div className="flex gap-1 text-[var(--color-accent-base)] text-sm">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span key={num}>{num <= r.stelle ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>

              <p className="text-[15px] text-[var(--color-text-primary)] leading-relaxed mt-4 mb-6">
                {r.testo}
              </p>

              <div className="flex gap-2">
                <button className="btn-ghost btn-sm text-red-500 hover:bg-red-500/10 border-transparent hover:border-transparent" onClick={() => eliminaRecensione(r.id)}>
                  Elimina
                </button>
                <button className="btn-ghost btn-sm" onClick={() => modificaRecensione(r.id)}>
                  Modifica
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Recensione */}
        <div className="w-full lg:w-[400px] shrink-0 sticky top-24">
          <div className="bg-[var(--color-surface-elev)] border border-[var(--color-border)] rounded-[24px] p-8 shadow-sm">
            <h3 className="text-xl font-semibold tracking-tight mb-6">Scrivi una recensione</h3>
            
            <form onSubmit={inviaRecensione} className="space-y-5">
              <div>
                <label>Il tuo Nome</label>
                <input type="text" placeholder="Nome e Cognome" value={utente} onChange={(e) => setUtente(e.target.value)} required />
              </div>

              <div>
                <label>Titolo</label>
                <input type="text" placeholder="Riassumi il tuo pensiero" value={titolo} onChange={(e) => setTitolo(e.target.value)} required />
              </div>

              <div>
                <label>Testo</label>
                <textarea placeholder="Scrivi la tua recensione completa..." value={testo} onChange={(e) => setTesto(e.target.value)} required rows={4} />
              </div>

              <div>
                <label>Valutazione</label>
                <div className="flex gap-2 text-2xl cursor-pointer text-[var(--color-border-accent)]">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span 
                      key={num} 
                      onClick={() => setStelle(num)} 
                      onMouseEnter={() => setHover(num)} 
                      onMouseLeave={() => setHover(0)}
                      className="transition-colors duration-200"
                      style={{ color: num <= (hover || stelle) ? "var(--color-accent-base)" : "inherit" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full mt-4 py-3.5 text-[15px]">
                Pubblica Recensione
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}