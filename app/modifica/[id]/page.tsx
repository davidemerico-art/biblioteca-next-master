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

  const [bio, setBio] = useState("");
  const [eta, setEta] = useState<number | "">("");
  const [stato, setStato] = useState("vivente");
  const [imgAutore, setImgAutore] = useState("");

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
      setImg(libro.img || "");
    }

    const autoriCreati = JSON.parse(localStorage.getItem("autoriCreati") || "[]");
    const autoreEsistente = autoriCreati.find((a: any) => a.nome === libro?.autore);
    if (autoreEsistente) {
      setBio(autoreEsistente.bio || "");
      setEta(autoreEsistente.eta || "");
      setStato(autoreEsistente.stato || "vivente");
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
    if (!titolo || !autore || !isbn || !genere || !frase) {
      alert("Titolo, Autore, ISBN, Genere e Frase Famosa sono obbligatori");
      return;
    }

    const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");
    const aggiornati = creati.map((libro: any) =>
      libro.id == id ? { ...libro, titolo, autore, isbn, genere, fraseFamosa: frase, img } : libro
    );
    localStorage.setItem("libriCreati", JSON.stringify(aggiornati));

    const autoriCreati = JSON.parse(localStorage.getItem("autoriCreati") || "[]");
    const indiceAutore = autoriCreati.findIndex((a: any) => a.nome === autore);
    const nuovoAutore = { nome: autore, eta, bio, img: imgAutore, stato };
    if (indiceAutore >= 0) autoriCreati[indiceAutore] = nuovoAutore;
    else autoriCreati.push(nuovoAutore);
    localStorage.setItem("autoriCreati", JSON.stringify(autoriCreati));

    alert("Libro e autore aggiornati con successo!");
    router.push("/biblioteca");
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-6xl">
      <button className="btn-ghost rounded-full p-2 w-10 h-10 mb-8" onClick={() => router.push("/biblioteca")}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
      </button>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* Anteprima Card */}
        <div className="w-full sm:w-[280px] shrink-0 mx-auto md:mx-0 sticky top-24">
          <label className="text-center md:text-left mb-3">Anteprima Card</label>
          <div className="card w-full pointer-events-none group opacity-90">
            <div className="relative h-[320px] bg-[var(--color-surface-hover)]">
              {img ? (
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] gap-3 p-5 text-center">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <span className="text-sm font-medium">Nessuna Immagine</span>
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col pt-3 bg-[var(--color-surface)]">
              <h3 className="text-[17px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-1 line-clamp-2">{titolo || "Titolo del libro"}</h3>
              <p className="text-[14px] text-[var(--color-text-secondary)] font-medium mb-3">{autore || "Nome Autore"}</p>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">ISBN: {isbn || "---"}</div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Genere: {genere || "---"}</div>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">"{frase || "Citazione..."}"</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="form-card flex-1 w-full p-8 md:p-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-[var(--color-text-primary)]">Modifica Volume</h1>
          <p className="mb-8 text-[var(--color-text-secondary)] text-[15px]">Aggiorna i dettagli del libro e dell'autore selezionato.</p>

          <form onSubmit={salva} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label>Titolo *</label>
                <input required value={titolo} onChange={(e) => setTitolo(e.target.value)} />
              </div>
              <div>
                <label>Autore *</label>
                <input required value={autore} onChange={(e) => setAutore(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label>ISBN *</label>
                <input required value={isbn} onChange={(e) => setISBN(e.target.value)} />
              </div>
              <div>
                <label>Genere *</label>
                <input required value={genere} onChange={(e) => setGenere(e.target.value)} />
              </div>
            </div>

            <div>
              <label>Carica Immagine Copertina</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-surface-hover)] file:text-[var(--color-text-primary)] hover:file:bg-[var(--color-border)] cursor-pointer" />
            </div>

            <div>
              <label>Citazione o Frase Famosa</label>
              <textarea rows={3} value={frase} onChange={(e) => setFrase(e.target.value)} />
            </div>

            <div className="py-2">
              <hr className="my-0" />
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">Dettagli Autore</h2>
            
            <div>
              <label>Biografia Autore</label>
              <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label>Età Autore</label>
                <input type="number" value={eta} onChange={(e) => setEta(Number(e.target.value))} />
              </div>
              <div>
                <label>Stato Autore</label>
                <select value={stato} onChange={(e) => setStato(e.target.value)}>
                  <option value="vivente">Vivente</option>
                  <option value="deceduto">Deceduto</option>
                </select>
              </div>
            </div>

            <div>
              <label>Immagine Autore</label>
              <input type="file" accept="image/*" onChange={handleImageUploadAutore} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-surface-hover)] file:text-[var(--color-text-primary)] hover:file:bg-[var(--color-border)] cursor-pointer" />
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="w-full sm:w-auto px-8">Salva Modifiche</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}