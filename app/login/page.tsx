"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [adminCode, setAdminCode] = useState("");

  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !email) {
      alert("Completare tutti i campi.");
      return;
    }

    // controllo admin
    if (role === "admin") {
      if (adminCode !== "@admin9021") {
        alert("Codice admin non valido");
        return;
      }
    }

    const user = { nome, email, role };
    localStorage.setItem("user", JSON.stringify(user));

    router.push("/biblioteca");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>

      {/*  COLONNA SINISTRA - IMMAGINE */}
      <div
        style={{
          flex: 1,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRight: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-end",
          padding: "60px",
        }}
      >
        <div
          className="glass"
          style={{
            padding: "32px",
            borderRadius: "var(--radius-lg)",
            maxWidth: "500px",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "16px" }}>
            L'inizio di un nuovo capitolo.
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--text-primary)",
              opacity: 0.9,
            }}
          >
            "Una stanza senza libri è come un corpo senz'anima." <br /> — Cicerone
          </p>
        </div>
      </div>

      {/*  COLONNA DESTRA - FORM */}
      <div
        style={{
          flex: "0 0 500px",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          position: "relative",
        }}
      >
        <Link
          href="/"
          style={{
            position: "absolute",
            top: "40px",
            right: "60px",
          }}
        >
          Torna alla Home
        </Link>

        <h1>Accedi</h1>

        <form onSubmit={handleSubmit}>
          
          {/* tipo accesso */}
          <div style={{ marginBottom: "20px" }}>
            <label>Tipo accesso</label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "user" | "admin")
              }
              style={{ padding: "10px", width: "100%" }}
            >
              <option value="user">Utente</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* campo admin */}
          {role === "admin" && (
            <div>
              <label>Admin Code</label>
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
              />
            </div>
          )}

          <button type="submit" style={{ marginTop: "20px" }}>
            Entra
          </button>
        </form>
      </div>
    </div>
  );
}