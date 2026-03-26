"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/AuthService";
import { AuthorService } from "@/services/AuthorService";
import { StorageService } from "@/services/StorageService";

export default function CreaLibro() {
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

  const router = useRouter();

  useEffect(() => {
    if (!AuthService.isAdmin()) {
      alert("Accesso negato: solo admin");
      router.push("/biblioteca");
    }
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: Function) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const crea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titolo || !autore || !isbn || !genere || !frase) {
      alert("Titolo, Autore, ISBN, Genere e Frase Famosa sono obbligatori");
      return;
    }

    // SOLID: Deleghiamo il salvataggio dell'autore al Service
    AuthorService.saveAuthor({ nome: autore, eta, bio, img: imgAutore, stato });
    
    // Salvataggio del libro
    const nuovoLibro = { id: Date.now(), titolo, autore, isbn, genere, fraseFamosa: frase, img };
    const salvatiLibri = StorageService.get<any[]>("libriCreati", []);
    StorageService.set("libriCreati", [...salvatiLibri, nuovoLibro]);

    alert("Volume archiviato con successo!");
    router.push("/biblioteca");
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-6xl">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button onClick={() => router.back()} className="btn-ghost rounded-full p-2 w-10 h-10 shrink-0 border-none">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Nuovo Volume</h1>
          <p className="text-sm sm:text-[15px] text-[var(--color-text-secondary)] font-medium">Aggiungi un libro e il suo autore agli archivi</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Anteprima Card - Nascosta su schermi molto piccoli per non ingombrare la tastiera, visibile da 'sm' in su */}
        <div className="hidden sm:block w-full lg:w-[280px] shrink-0 mx-auto lg:mx-0 lg:sticky lg:top-24">
          <label className="text-center lg:text-left mb-3">Anteprima Card</label>
          <div className="card w-full pointer-events-none group opacity-90 mx-auto">
            <div className="relative h-[280px] sm:h-[320px] bg-[var(--color-surface-hover)]">
              {img ? (
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] gap-3 p-5 text-center">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <span className="text-sm font-medium">Nessuna Copertina</span>
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col pt-4 bg-[var(--color-surface)]">
              <h3 className="text-[17px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-1 line-clamp-2">{titolo || "Titolo del libro"}</h3>
              <p className="text-[14px] text-[var(--color-text-secondary)] font-medium mb-3">{autore || "Nome Autore"}</p>
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                <span className="badge bg-[var(--color-surface-elev)] text-[var(--color-text-muted)] shrink-0 border border-[var(--color-border)]">ISBN: {isbn || "---"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form di Inserimento */}
        <div className="form-card flex-1 w-full p-6 sm:p-10">
          <form onSubmit={crea} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label>Titolo *</label>
                <input required value={titolo} onChange={(e) => setTitolo(e.target.value)} placeholder="Inserisci il titolo" />
              </div>
              <div>
                <label>Autore *</label>
                <input required value={autore} onChange={(e) => setAutore(e.target.value)} placeholder="Nome autore" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label>ISBN *</label>
                <input required value={isbn} onChange={(e) => setISBN(e.target.value)} placeholder="Codice ISBN" />
              </div>
              <div>
                <label>Genere *</label>
                <input required value={genere} onChange={(e) => setGenere(e.target.value)} placeholder="Es. Romanzo, Fantasy..." />
              </div>
            </div>

            <div>
              <label>Carica Immagine Copertina</label>
              {/* Custom file input in stile Apple */}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImg)} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-surface-hover)] file:text-[var(--color-text-primary)] hover:file:bg-[var(--color-border)] cursor-pointer" />
            </div>

            <div>
              <label>Citazione o Frase Famosa</label>
              <textarea rows={3} value={frase} onChange={(e) => setFrase(e.target.value)} placeholder="Una frase iconica del libro..." />
            </div>

            <hr className="my-8" />

            <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">Dettagli Autore</h2>
            
            <div>
              <label>Biografia Autore</label>
              <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Breve biografia..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label>Età Autore</label>
                <input type="number" value={eta} onChange={(e) => setEta(Number(e.target.value))} placeholder="Anni" />
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
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImgAutore)} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-surface-hover)] file:text-[var(--color-text-primary)] hover:file:bg-[var(--color-border)] cursor-pointer" />
            </div>

            <div className="pt-6">
              <button type="submit" className="w-full py-4 text-[16px]">Archivia Volume</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}