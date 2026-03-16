"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !email) {
      alert("Completare tutti i campi.");
      return;
    }

    const user = { nome, email };
    localStorage.setItem("user", JSON.stringify(user));

    router.push("/biblioteca");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      
      {/* colonna sinistra - immagine */}
      <div style={{
        flex: 1,
        backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRight: "1px solid var(--border)",
        display: "flex",
        alignItems: "flex-end",
        padding: "60px"
      }}>
        <div className="glass" style={{ padding: "32px", borderRadius: "var(--radius-lg)", maxWidth: "500px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "16px" }}>L'inizio di un nuovo capitolo.</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--text-primary)", opacity: 0.9 }}>
            "Una stanza senza libri è come un corpo senz'anima." <br/> — Cicerone
          </p>
        </div>
      </div>

      {/* colonna destra - form */}
      <div style={{
        flex: "0 0 500px",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px",
        position: "relative"
      }}>
        
        <Link href="/" style={{ position: "absolute", top: "40px", right: "60px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Torna alla Home
        </Link>

        <div style={{ marginBottom: "40px" }}>
          <div style={{
            background: "var(--accent)",
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0f0e0d",
            fontWeight: "bold",
            fontSize: "1.6rem",
            marginBottom: "24px"
          }}>
            B
          </div>
          <h1 style={{ fontSize: "2.4rem", marginBottom: "8px" }}>Accedi</h1>
          <p style={{ color: "var(--text-secondary)" }}>Bentornato su BiblioSphere.</p>
        </div>

        <form onSubmit={handleSubmit} className="animate-fade-in-up">
          
          <div className="form-group">
            <label>Nome Utente</label>
            <input
              required
              type="text"
              placeholder="Es. Mario Rossi"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{ padding: "14px", fontSize: "1.05rem" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "40px" }}>
            <label>Indirizzo Email</label>
            <input
              required
              type="email"
              placeholder="mario@esempio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "14px", fontSize: "1.05rem" }}
            />
          </div>

          <button type="submit" style={{ width: "100%", padding: "16px", fontSize: "1.1rem" }}>
            Entra in Biblioteca
          </button>
          
        </form>
        
        <div style={{ marginTop: "40px", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Problemi di accesso? <a href="#" style={{ color: "var(--accent)", textDecoration: "underline" }}>Recupera account</a>
        </div>

      </div>
    </div>
  );
}