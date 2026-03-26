"use client";

import { useParams, useRouter } from "next/navigation";
import { autori } from "@/data/autori";

export default function AutorePage() {
  const params = useParams();
  const router = useRouter();
  const nome = decodeURIComponent(params.nome as string);

  const autoriCreati = JSON.parse(localStorage.getItem("autoriCreati") || "[]");
  const tuttiAutori = [...autori, ...autoriCreati];

  const autore = tuttiAutori.find(a => a.nome === nome);

  if (!autore) {
    return (
      <div className="page-wrapper animate-fade-in text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Autore non trovato</h2>
        <button onClick={() => router.push("/biblioteca")}>Torna alla biblioteca</button>
      </div>
    );
  }

  return (
    <div className="page-wrapper max-w-3xl animate-fade-in">
      <button onClick={() => router.back()} className="btn-ghost rounded-full p-2 w-10 h-10 mb-8">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
        {autore.img ? (
          <img
            src={autore.img}
            alt={autore.nome}
            className="w-48 h-48 rounded-full object-cover shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-4 border-[var(--color-surface)]"
          />
        ) : (
          <div className="w-48 h-48 rounded-full bg-[var(--color-surface-elev)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)]">
            Nessuna foto
          </div>
        )}

        <div className="flex-1 text-center md:text-left py-4">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4">{autore.nome}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="badge bg-[var(--color-surface-elev)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">Età: {autore.eta}</span>
            <span className="badge bg-[var(--color-surface-elev)] text-[var(--color-text-secondary)] border border-[var(--color-border)] capitalize">{autore.stato}</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-8 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Biografia</h3>
        <p className="text-[16px] text-[var(--color-text-secondary)] leading-relaxed">
          {autore.bio}
        </p>
      </div>
    </div>
  );
}