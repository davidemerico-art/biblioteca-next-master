"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcquistaPage() {
  const [metodo, setMetodo] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pagamento elaborato con successo! Grazie per il tuo acquisto.");
    router.push("/miei-libri");
  };

  return (
    <div className="page-wrapper animate-fade-in flex flex-col items-center justify-start min-h-[80vh]">
      
      <div className="form-card max-w-[600px] w-full">
        <button 
          type="button" 
          className="btn-ghost btn-sm mb-6 px-2 py-1.5" 
          onClick={() => router.back()} 
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Indietro
        </button>

        <h1 className="text-3xl mb-2 font-serif text-[var(--color-text-primary)]">Checkout</h1>
        

        

        <form onSubmit={handleSubmit} className="animate-fade-in-up">

         
         
            <div className="flex justify-end">
              <button type="submit" className="px-7 py-3.5 text-[1.05rem]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Paga in Sicurezza
              </button>
            </div>
         

        </form>
      </div>

    </div>
  );
}