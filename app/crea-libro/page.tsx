"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreaLibro() {
  const [titolo, setTitolo] = useState("");
  const [autore, setAutore] = useState("");
  const [isbn, setISBN] = useState("");
  const [frase, setFrase] = useState("");
  const [img, setImg] = useState("");

  const router = useRouter();

  // 🔒 PROTEZIONE ADMIN
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || user.role !== "admin") {
      alert("Accesso negato: solo admin");
      router.push("/biblioteca");
    }
  }, [router]);

  const crea = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titolo || !autore || !isbn) {
      alert("Titolo, Autore e ISBN sono obbligatori");
      return;
    }

    const salvati = JSON.parse(localStorage.getItem("libriCreati") || "[]");

    const nuovoLibro = {
      id: Date.now(),
      titolo,
      autore,
      isbn,
      fraseFamosa: frase,
      img
    };

    const nuovi = [...salvati, nuovoLibro];
    localStorage.setItem("libriCreati", JSON.stringify(nuovi));

    alert("Volume archiviato con successo!");
    router.push("/biblioteca");
  };

  return (
    <div className="page-wrapper animate-fade-in">
      
      {/* Bottone indietro */}
      <button
        className="btn-ghost btn-sm mb-6"
        onClick={() => router.push("/biblioteca")}
      >
        ← Torna alla biblioteca
      </button>

      <div className="flex gap-10 items-start flex-wrap">

        {/* ================= FORM ================= */}
        <div className="form-card flex-1 min-w-[300px] md:min-w-[400px]">
          
          <h1 className="text-3xl mb-2 font-serif">
            Nuovo Volume
          </h1>

          <p className="mb-8 text-[var(--color-text-secondary)]">
            Aggiungi un nuovo libro agli archivi.
          </p>

          <form onSubmit={crea}>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

              <div className="form-group">
                <label>Titolo *</label>
                <input
                  required
                  value={titolo}
                  onChange={(e) => setTitolo(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Autore *</label>
                <input
                  required
                  value={autore}
                  onChange={(e) => setAutore(e.target.value)}
                />
              </div>

            </div>

            <div className="form-group mb-5">
              <label>ISBN *</label>
              <input
                required
                value={isbn}
                onChange={(e) => setISBN(e.target.value)}
              />
            </div>

            <div className="form-group mb-5">
              <label>Link Immagine Copertina</label>
              <input
                type="url"
                value={img}
                onChange={(e) => setImg(e.target.value)}
              />
            </div>

            <div className="form-group mb-5">
              <label>Citazione o Frase Famosa</label>
              <textarea
                rows={3}
                value={frase}
                onChange={(e) => setFrase(e.target.value)}
              />
            </div>

            <hr className="my-6 border-t border-[var(--color-border)]" />

            <div className="flex justify-end">
              <button type="submit">
                Archivia Volume
              </button>
            </div>

          </form>
        </div>

        {/* ================= ANTEPRIMA ================= */}
        <div className="w-[260px] shrink-0 mx-auto sm:mx-0">
          
          <label className="block mb-4">
            Anteprima Card
          </label>

          <div className="card w-full pointer-events-none group">

            <div className="relative h-[300px]">

              {img ? (
                <img
                  src={img}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full bg-[var(--color-surface-elev)] flex flex-col items-center justify-center text-[var(--color-text-muted)] gap-3 p-5 text-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Nessuna immagine
                </div>
              )}

              {/* Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none" />

            </div>

            <div className="p-5 bg-[var(--color-surface)]">
              <h3 className="text-lg font-serif">
                {titolo || "Titolo del libro"}
              </h3>

              <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                {autore || "Nome Autore"}
              </p>

              <div className="text-xs uppercase text-[var(--color-text-muted)] mb-3">
                ISBN: {isbn || "---"}
              </div>

              <p className={`text-sm italic border-l-2 border-[var(--color-accent-base)] pl-3 transition-opacity ${
                frase ? "opacity-100" : "opacity-50"
              }`}>
                "{frase || "Questa è una citazione dal libro..."}"
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}