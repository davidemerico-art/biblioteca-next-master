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
        <p className="mb-8 text-[var(--color-text-secondary)]">
          Completa il tuo acquisto selezionando un metodo di pagamento sicuro.
        </p>

        {/* barra stati 1 - 2 */}
        <div className="flex items-center mb-10 w-full px-4">
          <div className="w-8 h-8 rounded-full bg-[var(--color-accent-base)] text-[#0f0e0d] flex items-center justify-center font-bold relative z-10 shadow-md">1</div>
          <div className={`flex-1 h-0.5 transition-colors duration-300 ${metodo ? 'bg-[var(--color-accent-base)]' : 'bg-[var(--color-border)]'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 relative z-10 ${metodo ? 'bg-[var(--color-accent-base)] text-[#0f0e0d] shadow-md border-transparent' : 'bg-[var(--color-surface-elev)] text-[var(--color-text-muted)] border border-[var(--color-border)]'}`}>2</div>
        </div>

        <div className="mb-8">
          <label>Metodo di pagamento</label>
          <select
            value={metodo}
            onChange={(e) => setMetodo(e.target.value)}
            className="mt-2"
          >
            <option value="">-- Seleziona una modalità --</option>
            <option value="carta">Carta di Credito / Debito</option>
            <option value="bonifico">Bonifico Bancario</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="animate-fade-in-up">

          {/* transazione con carta */}
          {metodo === "carta" && (
            <div className="bg-[var(--color-surface-elev)] p-6 rounded-xl border border-[var(--color-border)] mb-8">
              <h2 className="text-xl mb-5 flex items-center gap-2 font-serif text-[var(--color-text-primary)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-base)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                Dettagli Carta
              </h2>

              <div className="mb-5">
                <label>Titolare della carta</label>
                <input type="text" placeholder="Nome Scritto Sulla Carta" required />
              </div>

              <div className="mb-5">
                <label>Numero della carta</label>
                <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} required className="tracking-[2px] font-mono text-lg" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Scadenza</label>
                  <input type="text" placeholder="MM/AA" maxLength={5} required />
                </div>
                <div>
                  <label>CVV</label>
                  <input type="password" maxLength={3} placeholder="•••" required className="font-mono text-xl tracking-[4px]" />
                </div>
              </div>
            </div>
          )}

          {/* sepa / bonifico */}
          {metodo === "bonifico" && (
            <div className="bg-[var(--color-surface-elev)] p-6 rounded-xl border border-[var(--color-border)] mb-8">
              <h2 className="text-xl mb-5 flex items-center gap-2 font-serif text-[var(--color-text-primary)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-base)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                Disposizioni Bonifico
              </h2>

              <div className="mb-5">
                <label>Intestatario del conto</label>
                <input type="text" required placeholder="Nome Cognome / Ragione Sociale" />
              </div>

              <div className="mb-5">
                <label>IBAN dell'ordinante</label>
                <input type="text" required placeholder="IT00 X000 0000 0000" className="tracking-[1px] font-mono uppercase" />
              </div>

              <div>
                <label>Tipo di bonifico</label>
                <select required className="mt-1">
                  <option value="">-- Seleziona velocità --</option>
                  <option value="ordinario">Ordinario (2-3 gg lavorativi)</option>
                  <option value="istantaneo">Istantaneo (immediato)</option>
                </select>
              </div>
            </div>
          )}

          {metodo && (
            <div className="flex justify-end">
              <button type="submit" className="px-7 py-3.5 text-[1.05rem]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Paga in Sicurezza
              </button>
            </div>
          )}

        </form>
      </div>

    </div>
  );
}