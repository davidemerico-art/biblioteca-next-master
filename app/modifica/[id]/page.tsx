"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ModificaLibro() {
  const { id } = useParams();
  const router = useRouter();

  const [titolo, setTitolo] = useState("");
  const [autore, setAutore] = useState("");
  const [isbn, setISBN] = useState("");
  const [genere, setGenere] = useState("");
  const [frase, setFrase] = useState("");
  const [img, setImg] = useState("");

  // Dettagli autore
  const [bio, setBio] = useState("");
  const [eta, setEta] = useState<number | "">("");
  const [stato, setStato] = useState("vivente");
  const [imgAutore, setImgAutore] = useState("");

  // Protezione admin e caricamento dati
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.role !== "admin") {
      alert("Accesso negato: solo admin");
      router.push("/biblioteca");
      return;
    }

    const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");
    const libro = creati.find((l: any) => l.id == id);
    if (libro) {
      setTitolo(libro.titolo);
      setAutore(libro.autore);
      setISBN(libro.isbn);
      setGenere(libro.genere || "");
      setFrase(libro.fraseFamosa);
      setImg(libro.img);
    }

    const autoriCreati = JSON.parse(localStorage.getItem("autoriCreati") || "[]");
    const autoreEsistente = autoriCreati.find((a: any) => a.nome === libro?.autore);
    if (autoreEsistente) {
      setBio(autoreEsistente.bio || "");
      setEta(autoreEsistente.eta || "");
      setImgAutore(autoreEsistente.img || "");
    }
  }, [id, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImg(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageUploadAutore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImgAutore(reader.result as string);
    reader.readAsDataURL(file);
  };

  const salva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titolo || !autore || !isbn||!genere ||!frase) {
      alert("Titolo, Autore, ISBN, Genere e Frase Famosa sono obbligatori");
      return;
    }

    // Salva libro
    const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");
    const aggiornati = creati.map((libro: any) =>
      libro.id == id ? { ...libro, titolo, autore, isbn, genere, fraseFamosa: frase, img } : libro
    );
    localStorage.setItem("libriCreati", JSON.stringify(aggiornati));

    // Salva autore
    const autoriCreati = JSON.parse(localStorage.getItem("autoriCreati") || "[]");
    const indiceAutore = autoriCreati.findIndex((a: any) => a.nome === autore);
    const nuovoAutore = { nome: autore, eta, bio, img: imgAutore };
    if (indiceAutore >= 0) autoriCreati[indiceAutore] = nuovoAutore;
    else autoriCreati.push(nuovoAutore);
    localStorage.setItem("autoriCreati", JSON.stringify(autoriCreati));

    alert("Libro e autore aggiornati con successo!");
    router.push("/biblioteca");
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* BACK */}
      <button className="btn-ghost btn-sm mb-6" onClick={() => router.push("/biblioteca")}>
        ← Torna alla biblioteca
      </button>

      <div className="flex gap-10 items-start flex-wrap">

        {/* ================= ANTEPRIMA CARD ================= */}
        <div className="w-[260px] shrink-0 mx-auto sm:mx-0">
          <label className="block mb-4">Anteprima Card</label>
          <div className="card w-full pointer-events-none group">
            <div className="relative h-[300px]">
              {img ? (
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="h-full bg-[var(--color-surface-elev)] flex flex-col items-center justify-center text-[var(--color-text-muted)] gap-3 p-5 text-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  Nessuna immagine
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none"></div>
            </div>

            <div className="p-5 flex flex-col pt-2 bg-[var(--color-surface)]">
              <h3 className="whitespace-normal text-lg mb-1 text-[var(--color-text-primary)] font-serif">{titolo || "Titolo del libro"}</h3>
              <p className="text-[var(--color-text-secondary)] font-medium text-[0.95rem] mb-3">{autore || "Nome Autore"}</p>
              <div className="text-[0.75rem] uppercase tracking-wider text-[var(--color-text-muted)] mb-4">ISBN: {isbn || "---"}</div>
                <div className="text-[0.75rem] uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Genere: {genere || "---"}</div>
              <p className={`text-[0.9rem] italic text-[var(--color-text-secondary)] border-l-2 border-[var(--color-accent-base)] pl-3 mt-auto leading-relaxed transition-opacity ${frase ? 'opacity-100' : 'opacity-50'}`}>
                "{frase || "Questa è una citazione dal libro..."}"
              </p>
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="form-card flex-1 min-w-[300px] md:min-w-[400px]">
          <h1 className="text-3xl mb-2 font-serif">Modifica Volume</h1>
          <p className="mb-8 text-[var(--color-text-secondary)]">
            Aggiorna i dettagli del libro selezionato.
          </p>

          <form onSubmit={salva}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="form-group">
                <label>Titolo *</label>
                <input required value={titolo} onChange={(e) => setTitolo(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Autore *</label>
                <input required value={autore} onChange={(e) => setAutore(e.target.value)} />
              </div>
            </div>

            <div className="form-group mb-5">
              <label>ISBN *</label>
              <input required value={isbn} onChange={(e) => setISBN(e.target.value)} />
            </div>

            <div className="form-group mb-5">
              <label>Carica Immagine Copertina</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
<div className="form-group mb-5">
              <label>Genere *</label>
              <input required value={genere} onChange={(e) => setGenere(e.target.value)} />
            </div>
            <div className="form-group mb-5">
              <label>Citazione o Frase Famosa</label>
              <textarea rows={3} value={frase} onChange={(e) => setFrase(e.target.value)} />
            </div>
            
            <hr className="my-6 border-t border-[var(--color-border)]" />
            <h2 className="text-xl mb-4 font-serif">Dettagli Autore</h2>
            <div className="form-group mb-5">
              <label>Biografia Autore</label>
              <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div className="form-group mb-5">
              <label>Età Autore</label>
              <input type="number" value={eta} onChange={(e) => setEta(Number(e.target.value))} />
            </div>
            <div className="form-group mb-5">
              <label>Stato Autore</label>
              <select value={stato} onChange={(e) => setStato(e.target.value)}>
                <option value="vivente">Vivente</option>
                <option value="deceduto">Deceduto</option>
              </select>
            </div>
            <div className="form-group mb-5">
              <label>Immagine Autore</label>
              <input type="file" accept="image/*" onChange={handleImageUploadAutore} />
            </div>

            <div className="flex justify-end">
              <button type="submit">Salva Modifiche</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}