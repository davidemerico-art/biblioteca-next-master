"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { libri } from "../../../data/libri";

export default function BookDetail() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [libro, setLibro] = useState<any>(null);
  const [recensioni, setRecensioni] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [testo, setTesto] = useState("");
  const [stelle, setStelle] = useState(5);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");
    const tutti = [...libri, ...creati];
    const trovato = tutti.find((l) => l.id === id);
    setLibro(trovato || null);

    const data = localStorage.getItem(`recensioni_${id}`);
    if (data) {
      setRecensioni(JSON.parse(data));
    }
  }, [id]);

  const salvaRecensione = (e: any) => {
    e.preventDefault();

    const nuova = {
      id: Date.now(),
      user: nome,
      testo,
      stelle,
    };

    const nuove = [...recensioni, nuova];
    setRecensioni(nuove);
    localStorage.setItem(`recensioni_${id}`, JSON.stringify(nuove));

    setNome("");
    setTesto("");
    setStelle(5);
    setHover(0);
  };

  if (!libro) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Libro non trovato</h2>
        <button onClick={() => router.push("/biblioteca")}>
          Torna alla biblioteca
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>

      <button onClick={() => router.push("/biblioteca")}>
        ← Torna indietro
      </button>

      <br /><br />

      {libro.img && (
        <div style={{ height: "500px", display: "flex", justifyContent: "center" }}>
          <img
            src={libro.img}
            alt={libro.titolo}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      <h1>{libro.titolo}</h1>

      {/*  AUTORE CLICCABILE */}
      <h3
        onClick={() => router.push(`/autore/${encodeURIComponent(libro.autore)}`)}
        style={{
          cursor: "pointer",
          color: "#6b4f2b",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        {libro.autore}
      </h3>

      <p>ISBN: {libro.isbn}</p>
      <p>Genere: {libro.genere}</p>
      <blockquote style={{ borderLeft: "4px solid #ccc", paddingLeft: "16px", fontStyle: "italic" }}>
        "{libro.fraseFamosa}"
      </blockquote>

      <hr style={{ margin: "40px 0" }} />

      <h2>Recensioni</h2>

      {recensioni.length === 0 && <p>Nessuna recensione ancora.</p>}

      {recensioni.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <strong>{r.user}</strong>

          <div style={{ color: "#f5b301", fontSize: "18px" }}>
            {[1, 2, 3, 4, 5].map((numero) => (
              <span key={numero}>
                {numero <= r.stelle ? "★" : "☆"}
              </span>
            ))}
          </div>

          <p>{r.testo}</p>
        </div>
      ))}

      <hr style={{ margin: "30px 0" }} />

      <h3>Scrivi una recensione</h3>

      <form onSubmit={salvaRecensione}>

        <input
          type="text"
          placeholder="Il tuo nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Scrivi la recensione"
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          required
          style={{ width: "100%" }}
        />

        <br /><br />

        {/* STELLE CLICCABILI */}
        <div
          style={{
            display: "flex",
            gap: "5px",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          {[1, 2, 3, 4, 5].map((numero) => (
            <span
              key={numero}
              onClick={() => setStelle(numero)}
              onMouseEnter={() => setHover(numero)}
              onMouseLeave={() => setHover(0)}
              style={{
                color: numero <= (hover || stelle) ? "#f5b301" : "#ccc",
                transition: "0.2s",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <br />

        <button type="submit">
          Invia recensione
        </button>

      </form>
    </div>
  );
}