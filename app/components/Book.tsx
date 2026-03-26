import { useRouter } from "next/navigation";

type BookProps = {
  id: number;
  titolo: string;
  autore: string;
  isbn: string;
  genere: string;
  fraseFamosa: string;
  img: string;
  prenota: () => void;
  acquista: () => void;
  isAdmin?: boolean;
  modifica?: () => void;
  elimina?: () => void;
};

export default function Book({ 
  id, titolo, autore, isbn, genere, fraseFamosa, img, prenota, acquista, isAdmin, modifica, elimina 
}: BookProps) {
  const router = useRouter();

  return (
    <div className="card animate-fade-in-up flex flex-col h-full group">
      
      {/* Immagine (Cliccabile per aprire il dettaglio del libro) */}
      <div 
        className="relative overflow-hidden shrink-0 h-[240px] sm:h-[280px] bg-[var(--color-surface-hover)] cursor-pointer"
        onClick={() => router.push(`/libro/${id}`)}
      >
        {img ? (
          <img src={img} alt={titolo} className="w-full h-full object-cover transition-transform duration-500 sm:group-hover:scale-105" />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] p-6 text-center">
            <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <span className="text-sm font-medium">No Cover</span>
          </div>
        )}
      </div>

      {/* Contenuto Testuale */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        
        {/* Titolo (Cliccabile) */}
        <h3 
          className="text-[17px] font-semibold tracking-tight mb-1 text-[var(--color-text-primary)] line-clamp-1 cursor-pointer hover:text-[var(--color-accent-base)] transition-colors" 
          title={titolo}
          onClick={() => router.push(`/libro/${id}`)}
        >
          {titolo}
        </h3>
        
        {/* Autore (Cliccabile per aprire la scheda dell'autore) */}
        <p 
          className="text-[var(--color-text-secondary)] mb-3 text-[14px] font-medium cursor-pointer hover:text-[var(--color-accent-base)] hover:underline w-fit transition-colors"
          onClick={(e) => {
            e.stopPropagation(); // Evita che il click si propaghi ad altri elementi
            router.push(`/autore/${encodeURIComponent(autore)}`);
          }}
          title={`Scopri di più su ${autore}`}
        >
          {autore}
        </p>
        
        {/* Badge (Senza scrollbar) */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="badge bg-[var(--color-surface-elev)] text-[var(--color-text-muted)] border border-[var(--color-border)]">ISBN: {isbn}</span>
          <span className="badge bg-[var(--color-surface-elev)] text-[var(--color-text-muted)] border border-[var(--color-border)]">{genere}</span>
        </div>
        
        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-3 mt-auto italic">"{fraseFamosa}"</p>
      </div>

      {/* Bottoni di Azione */}
      <div className="flex flex-col p-4 sm:p-5 pt-0 gap-2 mt-auto">
        <div className="flex flex-row gap-2">
          <button className="btn-ghost btn-sm flex-1 py-3 sm:py-2" onClick={prenota}>Prenota</button>
          <button className="btn-sm flex-1 py-3 sm:py-2" onClick={acquista}>Acquista</button>
        </div>
        
        {/* Bottoni Admin (Visibili solo se l'utente è admin) */}
        {isAdmin && modifica && elimina && (
          <div className="flex flex-row gap-2 pt-3 mt-1 border-t border-[var(--color-border)]">
            <button className="btn-ghost btn-sm flex-1 py-3 sm:py-2" onClick={modifica}>Modifica</button>
            <button className="bg-red-500/10 text-red-500 hover:bg-red-500/20 btn-sm flex-1 py-3 sm:py-2 border-none" onClick={elimina}>Elimina</button>
          </div>
        )}
      </div>
    </div>
  );
}