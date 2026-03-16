"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MieiLibri() {
  const [libri, setLibri] = useState<any[]>([]);
  const [restituiti, setRestituiti] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("prenotati");
    if (data) {
      const parsed = JSON.parse(data);
      const puliti = parsed
        .filter((l: any) => l !== null)
        .map((l: any) => ({
          ...l,
          dataPresa: l.dataPresa || new Date().toISOString()
        }));
      setLibri(puliti);
    }
  }, []);

  const restituisci = (id: number) => {
    const libroRestituito = libri.find(libro => libro.id === id);
    const nuovi = libri.filter(libro => libro.id !== id);
    
    setLibri(nuovi);

    if (libroRestituito) {
      const conData = {
        ...libroRestituito,
        dataRestituzione: new Date().toISOString()
      };
      setRestituiti([...restituiti, conData]);
    }
    localStorage.setItem("prenotati", JSON.stringify(nuovi));
  };

  const acquista = (libro: any) => {
    router.push("/acquista");
  };

  return (
    <div className="page-wrapper animate-fade-in">
      
      <div className="flex gap-4 items-center mb-8">
        <button className="btn-ghost btn-sm p-2 w-9 h-9 shrink-0 flex items-center justify-center rounded-lg" onClick={() => router.push("/biblioteca")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div>
          <h1 className="text-[2rem] mb-1 font-serif text-[var(--color-text-primary)]">I Miei Prestiti</h1>
          <p className="text-[var(--color-text-secondary)]">Gestisci i manoscritti attualmente in tuo possesso.</p>
        </div>
      </div>

      <h2 className="text-[1.4rem] mb-6 text-[var(--color-accent-base)] border-b border-[var(--color-border)] pb-3 font-serif">In Lettura ({libri.length})</h2>
      
      {libri.length === 0 ? (
        <div className="p-10 px-5 text-[var(--color-text-muted)] italic bg-[var(--color-surface)] rounded-xl border border-dashed border-[var(--color-border)] text-center">
          Non hai nessun libro in prestito al momento.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {libri.map((libro, idx) => (
            <div key={libro.id} className="card animate-fade-in-up flex w-full" style={{ animationDelay: `${idx * 0.1}s` }}>
              
              {/* copertina img */}
              <div className="w-[120px] shrink-0 border-r border-[var(--color-border)]">
                {libro.img ? (
                   <img src={libro.img} alt={libro.titolo} className="h-full w-full object-cover block" />
                ) : (
                  <div className="h-full w-full bg-[var(--color-surface-elev)] flex items-center justify-center">
                     <svg className="text-[var(--color-text-muted)]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </div>
                )}
              </div>

              {/* corpo e dettagli testi */}
              <div className="flex flex-col flex-1 p-5 min-w-0">
                <div className="mb-5">
                  <span className="badge badge-accent mb-3">Attivo</span>
                  <h3 className="text-[1.1rem] mb-1 font-serif text-[var(--color-text-primary)] whitespace-normal break-words">{libro.titolo}</h3>
                  <div className="mb-3 text-[var(--color-text-secondary)] font-medium">{libro.autore}</div>
                  <div className="text-[0.75rem] text-[var(--color-text-muted)]">
                    Dal: {new Date(libro.dataPresa).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  <button className="btn-ghost py-2 px-1 text-[0.8rem] min-w-[80px] flex-1 basis-min-content" onClick={() => restituisci(libro.id)}>
                    Restituisci
                  </button>
                  <button className="py-2 px-1 text-[0.8rem] min-w-[80px] flex-1 basis-min-content" onClick={() => acquista(libro)}>
                    Acquista
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {restituiti.length > 0 && (
        <div className="animate-fade-in mt-16" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-[1.4rem] mb-6 text-[#9f805a] border-b border-[var(--color-border)] pb-3 font-serif">Cronologia Restituzioni</h2>
          
          <div className="flex flex-col gap-3">
            {restituiti.map(libro => (
              <div key={libro.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 px-5 rounded-lg flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
                <div>
                  <h3 className="text-[1.05rem] mb-1 font-serif text-[var(--color-text-primary)]">{libro.titolo}</h3>
                  <div className="text-[0.85rem] text-[var(--color-text-secondary)] flex items-center flex-wrap gap-1">
                    <span className="text-[var(--color-text-muted)]">Preso il {new Date(libro.dataPresa).toLocaleDateString()}</span>
                    <span className="mx-1 text-[var(--color-border-accent)] hidden sm:inline">|</span>
                    <span className="text-[#9f805a]">Restituito il {new Date(libro.dataRestituzione).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                   <span className="badge badge-success shrink-0 text-[#9f805a]">Archiviato</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}