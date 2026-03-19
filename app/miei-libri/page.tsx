"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
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

/* ================= STORAGE UTILS ================= */
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

/* ================= PAGE ================= */
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

    const nuoviAcquisti = [...acquisti, nuovoAcquisto];
    setStorage("acquisti", nuoviAcquisti);

    router.push("/acquista");
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="flex gap-4 items-center mb-8">
        <button
          onClick={() => router.push("/biblioteca")}
          className="btn-ghost btn-sm p-2 w-9 h-9 rounded-lg"
        >
          ←
        </button>

        <div>
          <h1 className="text-[2rem] font-serif">
            {role === "admin" ? "Dashboard Admin" : "I Miei Prestiti"}
          </h1>

          <p className="text-gray-500">
            {role === "admin"
              ? "Gestisci libri e controlla i prestiti"
              : "Gestisci i tuoi libri"}
          </p>
        </div>
      </div>

      <h2 className="text-[1.4rem] mb-6 border-b pb-3 font-serif">
        Libri in Prestito ({prestiti.length})
      </h2>

      {prestiti.length === 0 ? (
        <div className="p-10 text-center italic border rounded-xl bg-gray-50">
          Nessun libro attualmente in prestito.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {prestiti.map((libro) => (
            <div
              key={libro.id}
              className="flex bg-white border rounded-xl overflow-hidden shadow-sm"
            >
              <div className="w-[100px] border-r bg-gray-100">
                {libro.img ? (
                  <img
                    src={libro.img}
                    alt={libro.titolo}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    —
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 p-5">
                <span className="text-[0.7rem] px-2 py-1 rounded-md bg-[#f3e8d7] text-[#9f805a] mb-3 w-fit">
                  Attivo
                </span>

                <h3 className="font-serif">{libro.titolo}</h3>
                <div className="text-sm text-gray-600">{libro.autore}</div>

                <div className="text-xs text-gray-500 mb-4">
                  Dal{" "}
                  {libro.dataPresa
                    ? new Date(libro.dataPresa).toLocaleDateString()
                    : "-"}
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => restituisci(libro.id)}
                    className="border py-2 px-2 text-xs rounded-md hover:bg-gray-100"
                  >
                    Restituisci
                  </button>

                  <button
                    onClick={() => acquista(libro)}
                    className="bg-[#9f805a] text-white py-2 px-2 text-xs rounded-md"
                  >
                    Acquista
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {restituiti.length > 0 && (
        <div className="mt-16">
          <h2 className="text-[1.4rem] mb-6 border-b pb-3 font-serif">
            Cronologia Restituzioni
          </h2>

          <div className="flex flex-col gap-3">
            {restituiti.map((libro) => (
              <div
                key={libro.id}
                className="bg-[#9f805a] border p-4 rounded-lg flex justify-between"
              >
                <div>
                  <h3 className="font-serif">{libro.titolo}</h3>
                  <div className="text-sm text-gray-700">
                    Restituito il{" "}
                    {libro.dataRestituzione
                      ? new Date(libro.dataRestituzione).toLocaleDateString()
                      : "-"}
                  </div>
                  <div className="text-xs text-gray-100">
                    Azione fatta da: {libro.utenteRole}
                  </div>
                </div>

                <span className="text-[0.7rem] px-2 py-1 rounded-md bg-[#f3e8d7] text-[#9f805a]">
                  Archiviato
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {role === "admin" && ultimoLibroAdmin && (
        <div className="mt-16">
          <h2 className="text-[1.4rem] mb-6 font-serif">Gestione Libri</h2>

          <div className="max-w-[400px] border rounded-xl p-4 bg-white shadow-sm">
            {ultimoLibroAdmin.img && (
              <img
                src={ultimoLibroAdmin.img}
                alt={ultimoLibroAdmin.titolo}
                className="w-full h-[200px] object-cover rounded-md mb-4"
              />
            )}

            <h3 className="font-serif mb-4">{ultimoLibroAdmin.titolo}</h3>

            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/modifica/${ultimoLibroAdmin.id}`)}
                className="border px-3 py-1 rounded-md"
              >
                Modifica
              </button>

              <button
                onClick={() => router.push(`/elimina/${ultimoLibroAdmin.id}`)}
                className="bg-[#9f805a] text-white px-3 py-1 rounded-md"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}