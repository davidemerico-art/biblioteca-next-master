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
  const [utente, setUtente] = useState("");
  const [testo, setTesto] = useState("");
  const [stelle, setStelle] = useState(5);

  
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

    if (!utente || !testo) return;

    const nuova = {
      id: Date.now(),
      user: utente,
      testo,
      stelle
    };

    const nuove = [...recensioni, nuova];
    setRecensioni(nuove);

    localStorage.setItem(`recensioni_${id}`, JSON.stringify(nuove));

    setUtente("");
    setTesto("");
    setStelle(5);
  };

  
  if (!libro) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Libro non trovato</h2>
        <button onClick={() => router.push("/biblioteca")}>
          ← Torna alla biblioteca
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>

      <button onClick={() => router.push("/biblioteca")}>
        ← Torna alla biblioteca
      </button>

      {/* COPERTINA INTERA */}
      {libro.img && (
        <div
          style={{
            height: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px"
          }}
        >
          <img
            src={libro.img}
            alt={libro.titolo}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain"
            }}
          />
        </div>
      )}

      <h1>{libro.titolo}</h1>
      <h3>{libro.autore}</h3>
      <p><strong>ISBN:</strong> {libro.isbn}</p>

      {libro.fraseFamosa && (
        <blockquote style={{ fontStyle: "italic", marginTop: "20px" }}>
          "{libro.fraseFamosa}"
        </blockquote>
      )}

      <hr style={{ margin: "40px 0" }} />

      {/* RECENSIONI */}
      <h2>Recensioni</h2>

      {recensioni.length === 0 && (
        <p>Nessuna recensione ancora.</p>
      )}

      {recensioni.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <strong>{r.user}</strong> — {r.stelle} ⭐
          <p>{r.testo}</p>
        </div>
      ))}

      <hr style={{ margin: "30px 0" }} />

      {/* FORM RECENSIONE */}
      <h3>Scrivi una recensione</h3>

      <form onSubmit={salvaRecensione}>

        <input
          type="text"
          placeholder="Il tuo nome"
          value={utente}
          onChange={(e) => setUtente(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />

        <textarea
          placeholder="Scrivi la recensione"
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="number"
          min="1"
          max="5"
          value={stelle}
          onChange={(e) => setStelle(Number(e.target.value))}
        />

        <br /><br />

        <button type="submit">
          Invia recensione
        </button>

      </form>

    </div>
  );
}