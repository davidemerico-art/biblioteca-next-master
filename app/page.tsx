"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const user = { nome, email, role };
    localStorage.setItem("user", JSON.stringify(user));

    router.push("/biblioteca");
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-base)]">
      
      {/* Left Column - Image (Nascosta su mobile, visibile su schermi grandi) */}
      <div 
        className="hidden lg:flex flex-1 relative bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-end p-12 w-full">
          <div className="glass p-8 rounded-3xl max-w-lg text-[var(--color-text-primary)]">
            <h2 className="text-3xl font-semibold mb-4 tracking-tight">L'inizio di un nuovo capitolo.</h2>
            <p className="text-[17px] text-[var(--color-text-secondary)] leading-relaxed font-medium">
              "Una stanza senza libri è come un corpo senz'anima." <br /> — Cicerone
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 relative">
        <Link 
          href="/" 
          className="absolute top-8 right-8 text-[var(--color-accent-base)] text-sm font-medium hover:underline"
        >
          Torna alla Home
        </Link>

        <div className="w-full max-w-md animate-fade-in-up">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-center text-[var(--color-text-primary)]">Accedi</h1>
          <p className="text-center text-[var(--color-text-secondary)] mb-10">Inserisci i tuoi dati per entrare in BiblioSphere.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label>Nome</label>
              <input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                placeholder="Il tuo nome"
                required 
              />
            </div>

            <div>
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="La tua email"
                required 
              />
            </div>

            <div>
              <label>Tipo accesso</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "user" | "admin")}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="w-full py-3.5 mt-4 text-[17px]">
              Entra
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}