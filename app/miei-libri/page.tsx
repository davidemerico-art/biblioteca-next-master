"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "user" | "admin";

type Libro = {
  id: number;
  titolo: string;
  autore: string;
  img?: string;
  dataPresa?: string;
  dataRestituzione?: string;
  dataAcquisto?: string;
  utenteRole?: Role;
};

type User = {
  role: Role;
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Page() {
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [prestiti, setPrestiti] = useState<Libro[]>([]);
  const [restituiti, setRestituiti] = useState<Libro[]>([]);
  const [ultimoLibroAdmin, setUltimoLibroAdmin] = useState<Libro | null>(null);

  useEffect(() => {
    const user = getStorage<User | null>("user", null);
    if (!user) {
      router.push("/");
      return;
    }
    setRole(user.role);

    const prenotati = getStorage<Libro[]>("prenotati", []);
    const restituitiStorage = getStorage<Libro[]>("restituiti", []);

    setPrestiti(prenotati.filter(Boolean));
    setRestituiti(restituitiStorage.filter(Boolean));

    if (user.role === "admin") {
      const creati = getStorage<Libro[]>("libriCreati", []);
      if (creati.length > 0) {
        setUltimoLibroAdmin(creati[creati.length - 1]);
      }
    }
  }, [router]);

  if (!role) return null;

  const restituisci = (id: number) => {
    const user = getStorage<User | null>("user", null);
    const libro = prestiti.find((l) => l.id === id);
    const aggiornati = prestiti.filter((l) => l.id !== id);

    setPrestiti(aggiornati);
    setStorage("prenotati", aggiornati);

    if (libro) {
      const nuoviRestituiti = [
        ...restituiti,
        {
          ...libro,
          dataRestituzione: new Date().toISOString(),
          utenteRole: user?.role,
        },
      ];
      setRestituiti(nuoviRestituiti);
      setStorage("restituiti", nuoviRestituiti);
    }
  };

  const acquista = (libro: Libro) => {
    const user = getStorage<User | null>("user", null);
    const acquisti = getStorage<Libro[]>("acquisti", []);

    const nuovoAcquisto = {
      ...libro,
      dataAcquisto: new Date().toISOString(),
      utenteRole: user?.role,
    };

    setStorage("acquisti", [...acquisti, nuovoAcquisto]);
    router.push("/acquista");
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => router.push("/biblioteca")} className="btn-ghost rounded-full p-2 w-10 h-10">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {role === "admin" ? "Dashboard Admin" : "I Miei Prestiti"}
          </h1>
          <p className="text-[15px] text-[var(--color-text-secondary)] font-medium">
            {role === "admin" ? "Gestisci libri e controlla i prestiti" : "Gestisci i tuoi libri attualmente in lettura"}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold tracking-tight mb-6 text-[var(--color-text-primary)]">
        Libri in Prestito <span className="text-[var(--color-text-muted)] font-normal text-lg">({prestiti.length})</span>
      </h2>

      {prestiti.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-[var(--color-text-secondary)]">
          Nessun libro attualmente in prestito.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prestiti.map((libro) => (
            <div key={libro.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm flex h-[160px] transition-transform hover:-translate-y-1 hover:shadow-md">
              <div className="w-[110px] shrink-0 bg-[var(--color-surface-hover)] border-r border-[var(--color-border)]">
                {libro.img ? (
                  <img src={libro.img} alt={libro.titolo} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-[var(--color-text-muted)] text-xs font-medium">Nessuna Immagine</div>
                )}
              </div>
              <div className="flex flex-col flex-1 p-4">
                <span className="badge bg-[var(--color-accent-dim)] text-[var(--color-accent-base)] mb-2 self-start">Attivo</span>
                <h3 className="font-semibold text-[16px] tracking-tight line-clamp-1">{libro.titolo}</h3>
                <div className="text-[13px] text-[var(--color-text-secondary)] font-medium">{libro.autore}</div>
                <div className="text-[12px] text-[var(--color-text-muted)] mt-1">
                  Dal {libro.dataPresa ? new Date(libro.dataPresa).toLocaleDateString() : "-"}
                </div>
                <div className="flex gap-2 mt-auto">
                  <button onClick={() => restituisci(libro.id)} className="btn-ghost btn-sm flex-1">Restituisci</button>
                  <button onClick={() => acquista(libro)} className="btn-sm flex-1">Acquista</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {restituiti.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight mb-6 text-[var(--color-text-primary)]">Cronologia Restituzioni</h2>
          <div className="flex flex-col gap-3">
            {restituiti.map((libro) => (
              <div key={libro.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-semibold text-[16px] tracking-tight text-[var(--color-text-primary)]">{libro.titolo}</h3>
                  <div className="text-[13px] text-[var(--color-text-secondary)] mt-1">
                    Restituito il {libro.dataRestituzione ? new Date(libro.dataRestituzione).toLocaleDateString() : "-"}
                  </div>
                </div>
                <span className="badge bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">Archiviato</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}