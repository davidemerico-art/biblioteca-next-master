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
};

export default function Book({
  titolo,
  autore,
  isbn,
  genere,
  fraseFamosa,
  img,
  prenota,
  acquista
}: BookProps) {
  return (
    <div className="card animate-fade-in-up flex flex-col h-full group">
      <div className="relative overflow-hidden shrink-0 h-[280px]">
        {img ? (
          <img 
            src={img} 
            alt={titolo} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full bg-[var(--color-surface-elev)] flex flex-col items-center justify-center text-[var(--color-text-muted)] p-6 text-center">
            <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <span className="text-sm font-medium">Copertina non disponibile</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none"></div>
      </div>

      <div className="flex flex-col flex-1 p-5 pt-2">
        <h3 className="text-lg mb-1 text-[var(--color-text-primary)] whitespace-nowrap overflow-hidden text-ellipsis" title={titolo}>
          {titolo}
        </h3>
        <p className="text-[var(--color-text-secondary)] mb-3 text-[0.95rem] font-medium">{autore}</p>
        <div className="text-[0.75rem] uppercase tracking-wider text-[var(--color-text-muted)] mb-4">ISBN: {isbn}</div>
        <div className="text-[0.75rem] uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Genere: {genere}</div>
        <div className="text-[0.75rem] uppercase tracking-wider text-[var(--color-text-muted)] mb-4"> frase famosa: {fraseFamosa} </div>
        <p className="text-[0.9rem] italic text-[var(--color-text-secondary)] border-l-2 border-[var(--color-accent-base)] pl-3 mt-auto leading-relaxed">
          "{fraseFamosa}"
        </p>
      </div>

      <div className="flex p-5 pt-0 gap-3 mt-auto">
        <button className="btn-ghost flex-1 py-2 px-3 text-[0.85rem]" onClick={prenota}>
          Prenota
        </button>
        <button className="flex-1 py-2 px-3 text-[0.85rem]" onClick={acquista}>
          Acquista
        </button>
      </div>
    </div>
  );
}