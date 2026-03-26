"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { libri } from "../../data/libri";

type Role = "user" | "admin";

type Libro = {
  id: number;
  titolo: string;
  autore: string;
  isbn?: string | number;
  img?: string;
  dataAcquisto?: string;
  utenteRole?: Role;
};

type User = {
  role: Role;
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setToStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function AcquistaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = getFromStorage<User | null>("user", null);
    if (!user) {
      router.push("/");
      return;
    }

    const idParam = searchParams.get("id");
    const id = Number(idParam);

    if (!idParam || isNaN(id)) {
      alert("Libro non valido");
      return;
    }

    const libroTrovato = libri.find((libro) => libro.id === id);
    if (!libroTrovato) {
      alert("Libro non trovato");
      return;
    }

    const acquistiSalvati = getFromStorage<Libro[]>("acquisti", []);
    const giaAcquistato = acquistiSalvati.some((libro) => libro.id === id);

    if (giaAcquistato) {
      alert("Hai già acquistato questo libro");
      router.push("/miei-libri");
      return;
    }

    const nuovoAcquisto: Libro = {
      ...libroTrovato,
      dataAcquisto: new Date().toISOString(),
      utenteRole: user.role,
    };

    setToStorage("acquisti", [...acquistiSalvati, nuovoAcquisto]);
    alert("Pagamento elaborato con successo tramite Apple Pay!");
    router.push("/miei-libri");
  };

  return (
    <div className="page-wrapper flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
      <div className="form-card max-w-[500px] w-full text-center">
        <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
          {/* Semplice icona Apple Pay finta */}
          <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-4H7v-2h2V8c0-1.1.9-2 2-2h3v2h-3v2h3v2h-3v4z"/></svg>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-[var(--color-text-primary)]">
          Checkout
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          Completa l'acquisto del volume in modo sicuro.
        </p>

        <form onSubmit={handleSubmit} className="animate-fade-in-up">
          <button type="submit" className="w-full py-4 text-[17px] bg-black hover:bg-gray-800 text-white rounded-full">
            Acquista con Apple Pay
          </button>
          <button type="button" onClick={() => router.back()} className="btn-ghost w-full py-4 text-[17px] mt-3">
            Annulla
          </button>
        </form>
      </div>
    </div>
  );
}