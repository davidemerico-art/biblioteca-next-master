"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/AuthService";
import { BookService } from "@/services/BookService";
import { Libro, Role } from "@/types";

export default function MieiLibriPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [prestiti, setPrestiti] = useState<Libro[]>([]);
  const [restituiti, setRestituiti] = useState<Libro[]>([]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      router.push("/");
      return;
    }
    setRole(user.role);
    
    setPrestiti(BookService.getPrestiti());
    setRestituiti(JSON.parse(localStorage.getItem("restituiti") || "[]"));
  }, [router]);

  if (!role) return null;

  const restituisci = (id: number) => {
    BookService.restituisci(id, role);
    setPrestiti(BookService.getPrestiti());
    setRestituiti(JSON.parse(localStorage.getItem("restituiti") || "[]"));
  };

  const acquista = (libro: Libro) => {
    BookService.acquista(libro, role);
    router.push("/acquista?id=" + libro.id);
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
        <button onClick={() => router.push("/biblioteca")} className="btn-ghost rounded-full p-2 w-10 h-10 shrink-0">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">I Miei Prestiti</h1>
          <p className="text-sm sm:text-[15px] text-[var(--color-text-secondary)] font-medium">Gestisci i tuoi libri attualmente in lettura</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold tracking-tight mb-6 text-[var(--color-text-primary)]">
        Libri in Prestito <span className="text-[var(--color-text-muted)] font-normal text-lg">({prestiti.length})</span>
      </h2>

      {prestiti.length === 0 ? (
        <div className="p-8 sm:p-10 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-[var(--color-text-secondary)]">
          Nessun libro attualmente in prestito.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prestiti.map((libro) => (
            <div key={libro.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row sm:h-[160px] transition-transform">
              <div className="w-full sm:w-[110px] h-[180px] sm:h-full shrink-0 bg-[var(--color-surface-hover)] border-b sm:border-b-0 sm:border-r border-[var(--color-border)]">
                {libro.img ? (
                  <img src={libro.img} alt={libro.titolo} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-[var(--color-text-muted)] text-xs font-medium">Nessuna Immagine</div>
                )}
              </div>
              <div className="flex flex-col flex-1 p-4 sm:p-5">
                <span className="badge bg-[var(--color-accent-dim)] text-[var(--color-accent-base)] mb-2 self-start">Attivo</span>
                <h3 className="font-semibold text-[16px] tracking-tight line-clamp-1">{libro.titolo}</h3>
                <div className="text-[13px] text-[var(--color-text-secondary)] font-medium">{libro.autore}</div>
                <div className="text-[12px] text-[var(--color-text-muted)] mt-1 mb-4 sm:mb-0">
                  Dal {libro.dataPresa ? new Date(libro.dataPresa).toLocaleDateString() : "-"}
                </div>
                <div className="flex gap-2 mt-auto">
                  <button onClick={() => restituisci(libro.id)} className="btn-ghost btn-sm flex-1 py-3 sm:py-2">Restituisci</button>
                  <button onClick={() => acquista(libro)} className="btn-sm flex-1 py-3 sm:py-2">Acquista</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {restituiti.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <h2 className="text-xl font-semibold tracking-tight mb-6 text-[var(--color-text-primary)]">Cronologia Restituzioni</h2>
          <div className="flex flex-col gap-3">
            {restituiti.map((libro) => (
              <div key={libro.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center shadow-sm gap-3 sm:gap-0">
                <div>
                  <h3 className="font-semibold text-[16px] tracking-tight text-[var(--color-text-primary)]">{libro.titolo}</h3>
                  <div className="text-[13px] text-[var(--color-text-secondary)] mt-1">
                    Restituito il {libro.dataRestituzione ? new Date(libro.dataRestituzione).toLocaleDateString() : "-"}
                  </div>
                </div>
                <span className="badge bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] self-start sm:self-auto">Archiviato</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}