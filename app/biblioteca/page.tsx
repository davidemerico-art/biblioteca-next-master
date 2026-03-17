"use client";

import { useState, useEffect } from "react";
import { libri } from "../../data/libri";
import { useRouter } from "next/navigation";
import Book from "../components/Book";

export default function Biblioteca() {

  const [search, setSearch] = useState("");
  const [libriTotali, setLibriTotali] = useState<any[]>([]);
  const router = useRouter();

  // Carica libri (default + creati)
  useEffect(() => {
    const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");
    setLibriTotali([...libri, ...creati]);
  }, []);

  // Prenota libro
  function prenota(libro: any) {
    const salvati = JSON.parse(localStorage.getItem("prenotati") || "[]");

    if (salvati.find((l: any) => l && l.id === libro.id)) {
      alert("Hai già prenotato questo libro");
      return;
    }

    const nuovi = [...salvati, libro];
    localStorage.setItem("prenotati", JSON.stringify(nuovi));
    alert("Libro prenotato");
  }

  // Acquista libro
  function acquista(libro: any) {
    router.push("/acquista");
  }

  // Filtro ricerca
  const libriFiltrati = libriTotali.filter(libro =>
    libro.titolo?.toLowerCase().includes(search.toLowerCase()) ||
    String(libro.isbn).toLowerCase().includes(search.toLowerCase()) ||
    libro.autore?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "40px" }}>

      <h1 style={{ marginBottom: "20px" }}>
        La Collezione
      </h1>

     {/* CONTENITORE SEARCH + BUTTON */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
    gap: "10px",
    flexWrap: "wrap" // utile per mobile
  }}
>
  {/* BARRA DI RICERCA */}
  <input
    type="text"
    placeholder="Cerca per titolo, autore o ISBN..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding: "10px",
      width: "100%",
      maxWidth: "400px"
    }}
  />

   {/* BOTTONE */}
<button
  onClick={() => router.push("/crea-libro")}
  style={{
    padding: "10px 20px",
    backgroundColor: " b8860b;", 
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    whiteSpace: "nowrap"
  }}
>
  Crea Libro
</button>
</div>

      {/* GRID LIBRI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px"
        }}
      >
        {libriFiltrati.map((libro) => (
          <div
            key={libro.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "10px",
              textAlign: "center"
            }}
          >

            {/* COPERTINA CLICCABILE */}
            <img
              src={libro.img}
              alt={libro.titolo}
              style={{
                width: "100%",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() => router.push(`/libro/${libro.id}`)}
            />

            {/* SOLO TITOLO */}
            <h3 style={{ marginTop: "10px" }}>
              {libro.titolo}
            </h3>

            {/* BOTTONI */}
<div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    justifyContent: "center"
  }}
>
  <button
    onClick={() => prenota(libro)}
    style={{
      padding: "8px 12px",
      cursor: "pointer"
    }}
  >
    Prenota
  </button>

  <button
    onClick={() => acquista(libro)}
    style={{
      padding: "8px 12px",
      cursor: "pointer"
    }}
  >
    Acquista
  </button>
</div>

          </div>
        ))}
        
      </div>

    </div>
  );
}