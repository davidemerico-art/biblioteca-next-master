"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type Libro = {
  id: number;
  titolo: string;
  autore: string;
  img?: string;
  dataPresa?: string;
  dataRestituzione?: string;
  dataAcquisto?: string;
  isbn?: string;
};

type User = {
  role: "user" | "admin";
};

/* ================= STORAGE ================= */
function getStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

/* ================= PAGE ================= */
export default function CronologiaPage() {
  const router = useRouter();

  const [prestiti, setPrestiti] = useState<Libro[]>([]);
  const [restituiti, setRestituiti] = useState<Libro[]>([]);
  const [acquisti, setAcquisti] = useState<Libro[]>([]);
  const [search, setSearch] = useState("");

  /* ================= INIT ================= */
  useEffect(() => {
    const user = getStorage<User | null>("user", null);

    if (!user) {
      router.push("/");
      return;
    }

    const prenotati = getStorage<Libro[]>("prenotati", []);
    setPrestiti(prenotati.filter(Boolean));

    const restituitiStorage = getStorage<Libro[]>("restituiti", []);
    setRestituiti(restituitiStorage.filter(Boolean));

    const acquistiStorage = getStorage<Libro[]>("acquisti", []);
    setAcquisti(acquistiStorage.filter(Boolean));
  }, [router]);

  /* ================= FILTRO ================= */
  const matchLibro = (libro: Libro) => {
    const query = search.toLowerCase();
    return (
      libro.titolo.toLowerCase().includes(query) 
      || libro.autore.toLowerCase().includes(query)
      || (libro.isbn && libro.isbn.toString().toLowerCase().includes(query))
      
    );
  };

  const prestitiFiltrati = prestiti.filter(matchLibro);
  const restituitiFiltrati = restituiti.filter(matchLibro);
  const acquistiFiltrati = acquisti.filter(matchLibro);

  /* ================= UI ================= */
  return (
    <div className="page-wrapper animate-fade-in">

      {/* HEADER */}
      <div className="flex gap-4 items-center mb-6">
        <button
          onClick={() => router.push("/biblioteca")}
          className="btn-ghost btn-sm p-2 w-9 h-9 rounded-lg"
        >
          ←
        </button>

        <div>
          <h1 className="text-[2rem] font-serif">
            Cronologia Attività
          </h1>
          <p className="text-gray-500">
            Tutte le tue azioni sui libri
          </p>
        </div>
      </div>

      {/*  BARRA DI RICERCA */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Cerca "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[var(--color-accent-base)]"
        />
      </div>

      {/* ================= PRESTITI ================= */}
      <h2 className="text-[1.4rem] mb-4 border-b pb-2 font-serif">
        Prestiti Attivi ({prestitiFiltrati.length})
      </h2>

      {prestitiFiltrati.length === 0 ? (
        <div className="mb-10 text-gray-500 italic">
          Nessun prestito attivo
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-10">
          {prestitiFiltrati.map((libro) => (
            <div
              key={libro.id}
              className="bg-[#9f805a] border p-4 rounded-lg flex justify-between"
            >
              <div>
                <h3 className="font-serif">{libro.titolo}</h3>
                <div className="text-sm text-gray-500">
                  {libro.autore}
                </div>
              </div>

              <span className="text-xs px-2 py-1 bg-[#f3e8d7] text-[#9f805a] rounded-md">
                Attivo
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ================= RESTITUITI ================= */}
      <h2 className="text-[1.4rem] mb-4 border-b pb-2 font-serif">
        Restituzioni ({restituitiFiltrati.length})
      </h2>

      {restituitiFiltrati.length === 0 ? (
        <div className="mb-10 text-gray-500 italic">
          Nessuna restituzione
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-10">
          {restituitiFiltrati.map((libro) => (
            <div
              key={libro.id}
              className="bg-[#9f805a] border p-4 rounded-lg flex justify-between"
            >
              <div>
                <h3 className="font-serif">{libro.titolo}</h3>
                <div className="text-sm text-gray-500">
                  Restituito il{" "}
                  {libro.dataRestituzione
                    ? new Date(libro.dataRestituzione).toLocaleDateString()
                    : "-"}
                </div>
              </div>

              <span className="text-xs px-2 py-1 bg-[#f3e8d7] text-[#9f805a] rounded-md">
                Archiviato
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ================= ACQUISTI ================= */}
      <h2 className="text-[1.4rem] mb-4 border-b pb-2 font-serif">
        Acquisti ({acquistiFiltrati.length})
      </h2>

      {acquistiFiltrati.length === 0 ? (
        <div className="text-gray-500 italic">
          Nessun acquisto effettuato
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {acquistiFiltrati.map((libro) => (
            <div
              key={libro.id}
              className="bg-[#9f805a] border p-4 rounded-lg flex justify-between"
            >
              <div>
                <h3 className="font-serif">{libro.titolo}</h3>
                <div className="text-sm text-gray-500">
                  Acquistato il{" "}
                  {libro.dataAcquisto
                    ? new Date(libro.dataAcquisto).toLocaleDateString()
                    : "-"}
                </div>
              </div>

              <span className="text-xs px-2 py-1 bg-[#f3e8d7] text-[#9f805a] rounded-md">
                Completato
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}  