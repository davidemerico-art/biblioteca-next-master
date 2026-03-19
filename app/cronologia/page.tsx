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

  /* ================= INIT ================= */
  useEffect(() => {
    const user = getStorage<User | null>("user", null);

    if (!user) {
      router.push("/");
      return;
    }

    // PRESTITI
    const prenotati = getStorage<Libro[]>("prenotati", []);
    setPrestiti(prenotati.filter(Boolean));

    // RESTITUITI
    const restituitiStorage = getStorage<Libro[]>("restituiti", []);
    setRestituiti(restituitiStorage.filter(Boolean));

    // ACQUISTI
    const acquistiStorage = getStorage<Libro[]>("acquisti", []);
    setAcquisti(acquistiStorage.filter(Boolean));
  }, [router]);

  /* ================= UI ================= */

  return (
    <div className="page-wrapper animate-fade-in">

      {/* HEADER */}
      <div className="flex gap-4 items-center mb-8">
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

      {/* ================= PRESTITI ================= */}
      <h2 className="text-[1.4rem] mb-4 border-b pb-2 font-serif">
        Prestiti Attivi ({prestiti.length})
      </h2>

      {prestiti.length === 0 ? (
        <div className="mb-10 text-gray-500 italic">
          Nessun prestito attivo
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-10">
          {prestiti.map((libro) => (
            <div
              key={libro.id}
              className="bg-white border p-4 rounded-lg flex justify-between"
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
        Restituzioni ({restituiti.length})
      </h2>

      {restituiti.length === 0 ? (
        <div className="mb-10 text-gray-500 italic">
          Nessuna restituzione
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-10">
          {restituiti.map((libro) => (
            <div
              key={libro.id}
              className="bg-gray-50 border p-4 rounded-lg flex justify-between"
            >
              <div>
                <h3 className="font-serif">{libro.titolo}</h3>
                <div className="text-sm text-gray-500">
                  Restituito il{" "}
                  {libro.dataRestituzione
                    ? new Date(
                        libro.dataRestituzione
                      ).toLocaleDateString()
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
        Acquisti ({acquisti.length})
      </h2>

      {acquisti.length === 0 ? (
        <div className="text-gray-500 italic">
          Nessun acquisto effettuato
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {acquisti.map((libro) => (
            <div
              key={libro.id}
              className="bg-white border p-4 rounded-lg flex justify-between"
            >
              <div>
                <h3 className="font-serif">{libro.titolo}</h3>
                <div className="text-sm text-gray-500">
                  Acquistato il{" "}
                  {libro.dataAcquisto
                    ? new Date(
                        libro.dataAcquisto
                      ).toLocaleDateString()
                    : "-"}
                </div>
              </div>

              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md">
                Completato
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}