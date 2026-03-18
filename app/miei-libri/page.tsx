"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [role, setRole] = useState<"user" | "admin" | null>(null);

  // USER
  const [libri, setLibri] = useState<any[]>([]);
  const [restituiti, setRestituiti] = useState<any[]>([]);

  // ADMIN
  const [adminLastBook, setAdminLastBook] = useState<any | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      router.push("/");
      return;
    }

    setRole(user.role);

    // ===== USER =====
    if (user.role === "user") {
      const data = localStorage.getItem("prenotati");

      if (data) {
        const parsed = JSON.parse(data);

        const puliti = parsed
          .filter((l: any) => l !== null)
          .map((l: any) => ({
            ...l,
            dataPresa: l.dataPresa || new Date().toISOString(),
          }));

        setLibri(puliti);
      }
    }

    // ===== ADMIN =====
    if (user.role === "admin") {
      const creati = JSON.parse(
        localStorage.getItem("libriCreati") || "[]"
      );

      if (creati.length > 0) {
        setAdminLastBook(creati[creati.length - 1]);
      }
    }
  }, [router]);

  if (!role) return null;

  // ===== AZIONI =====
  const restituisci = (id: number) => {
    const libroRestituito = libri.find((l) => l.id === id);
    const nuovi = libri.filter((l) => l.id !== id);

    setLibri(nuovi);
    localStorage.setItem("prenotati", JSON.stringify(nuovi));

    if (libroRestituito) {
      const conData = {
        ...libroRestituito,
        dataRestituzione: new Date().toISOString(),
      };

      setRestituiti([...restituiti, conData]);
    }
  };

  const acquista = () => {
    router.push("/acquista");
  };

  return (
    <div className="page-wrapper animate-fade-in">

      {/* ================= USER ================= */}
      {role === "user" && (
        <>
          <div className="flex gap-4 items-center mb-8">
            <button
              className="btn-ghost btn-sm p-2 w-9 h-9 flex items-center justify-center rounded-lg"
              onClick={() => router.push("/biblioteca")}
            >
              ←
            </button>

            <div>
              <h1 className="text-[2rem] mb-1 font-serif">
                I Miei Prestiti
              </h1>
              <p className="text-gray-500">
                Gestisci i libri attualmente in tuo possesso.
              </p>
            </div>
          </div>

          <h2 className="text-[1.4rem] mb-6 border-b pb-3 font-serif">
            In Lettura ({libri.length})
          </h2>

          {libri.length === 0 ? (
            <div className="p-10 text-center italic border rounded-xl bg-gray-50">
              Non hai nessun libro in prestito al momento.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {libri.map((libro) => (
                <div
                  key={libro.id}
                  className="flex bg-white border rounded-xl overflow-hidden shadow-sm"
                >
                  {/* IMG */}
                  <div className="w-[100px] shrink-0 border-r bg-gray-100">
                    {libro.img ? (
                      <img
                        src={libro.img}
                        alt={libro.titolo}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                       
                      </div>
                    )}
                  </div>

                  {/* CONTENUTO */}
                  <div className="flex flex-col flex-1 p-5">

                    <span className="text-[0.7rem] px-2 py-1 rounded-md bg-[#f3e8d7] text-[#9f805a] mb-3 inline-block w-fit">
                      Attivo
                    </span>

                    <h3 className="font-serif text-[1.05rem] mb-1 leading-snug">
                      {libro.titolo}
                    </h3>

                    <div className="text-sm text-gray-600 mb-2">
                      {libro.autore}
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Dal{" "}
                      {new Date(libro.dataPresa).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        className="border py-2 px-2 text-[0.75rem] rounded-md hover:bg-gray-100"
                        onClick={() => restituisci(libro.id)}
                      >
                        Restituisci
                      </button>

                      <button
                        className="bg-[#9f805a] text-white py-2 px-2 text-[0.75rem] rounded-md hover:opacity-90"
                        onClick={acquista}
                      >
                        Acquista
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RESTITUITI */}
          {restituiti.length > 0 && (
            <div className="mt-16">

              <h2 className="text-[1.4rem] mb-6 border-b pb-3 font-serif">
                Cronologia Restituzioni
              </h2>

              <div className="flex flex-col gap-3">
                {restituiti.map((libro) => (
                  <div
                    key={libro.id}
                    className="bg-gray-50 border p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-serif">
                        {libro.titolo}
                      </h3>

                      <div className="text-sm text-gray-500">
                        Restituito il{" "}
                        {new Date(
                          libro.dataRestituzione
                        ).toLocaleDateString()}
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
        </>
      )}

      {/* ================= ADMIN ================= */}
      {role === "admin" && adminLastBook && (
        <>
          <h1 className="text-[2rem] mb-8 font-serif">
            Ultima Modifica
          </h1>

          <div className="max-w-[400px] bg-white border rounded-xl overflow-hidden shadow-sm">

            {adminLastBook.img && (
              <img
                src={adminLastBook.img}
                alt={adminLastBook.titolo}
                className="w-full h-[220px] object-cover"
              />
            )}

            <div className="p-5">

              <span className="text-[0.7rem] px-2 py-1 rounded-md bg-[#f3e8d7] text-[#9f805a] mb-3 inline-block">
                Ultimo aggiornamento
              </span>

              <h3 className="font-serif mb-4 text-[1.1rem]">
                {adminLastBook.titolo}
              </h3>

              <div className="flex gap-2">
                <button
                  className="border py-2 px-3 text-sm rounded-md hover:bg-gray-100"
                  onClick={() =>
                    router.push(`/modifica/${adminLastBook.id}`)
                  }
                >
                  Modifica
                </button>

                <button
                  className="bg-[#9f805a] text-white py-2 px-3 text-sm rounded-md hover:opacity-90"
                  onClick={() =>
                    router.push(`/elimina/${adminLastBook.id}`)
                  }
                >
                  Elimina
                </button>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
}