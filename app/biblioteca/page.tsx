"use client";

import { useState, useEffect } from "react";
import { libri } from "../../data/libri";
import { useRouter } from "next/navigation";

export default function Biblioteca() {

  const [search, setSearch] = useState("");
  const [libriTotali, setLibriTotali] = useState<any[]>([]);
  const [role, setRole] = useState<"user" | "admin" | null>(null);

  const router = useRouter();

  useEffect(() => {
    const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");
    setLibriTotali([...libri, ...creati]);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      setRole(user.role);
    } else {
      router.push("/");
    }
  }, []);

  function prenota(libro: any) {
    const salvati = JSON.parse(localStorage.getItem("prenotati") || "[]");

    if (salvati.find((l: any) => l && l.id === libro.id)) {
      alert("Hai già prenotato questo libro");
      return;
    }

    localStorage.setItem("prenotati", JSON.stringify([...salvati, libro]));
    alert("Libro prenotato");
  }

  function eliminaLibro(id: number) {
    const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");
    const aggiornati = creati.filter((libro: any) => libro.id !== id);

    localStorage.setItem("libriCreati", JSON.stringify(aggiornati));
    setLibriTotali([...libri, ...aggiornati]);
  }

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

      {/* SEARCH + BUTTON */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "30px",
          gap: "10px",
          flexWrap: "wrap"
        }}
      >

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

        {/* 👑 SOLO ADMIN */}
        {role === "admin" && (
          <button
            onClick={() => router.push("/crea-libro")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#b8860b",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            Crea Libro
          </button>
        )}

      </div>

      {/* GRID */}
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

            <h3 style={{ marginTop: "10px" }}>
              {libro.titolo}
            </h3>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                justifyContent: "center"
              }}
            >

              {/*  USER */}
              {role === "user" && (
                <>
                  <button
                    onClick={() => prenota(libro)}
                    style={{ padding: "8px 12px", cursor: "pointer" }}
                  >
                    Prenota
                  </button>

                  <button
                    onClick={() => router.push("/acquista")}
                    style={{ padding: "8px 12px", cursor: "pointer" }}
                  >
                    Acquista
                  </button>
                </>
              )}

              {/* ADMIN */}
              {role === "admin" && (
                <>
                  <button
                    onClick={() => router.push(`/modifica/${libro.id}`)}
                    style={{ padding: "8px 12px", cursor: "pointer" }}
                  >
                    Modifica
                  </button>

                  <button
                    onClick={() => eliminaLibro(libro.id)}
                    style={{ padding: "8px 12px", cursor: "pointer" }}
                  >
                    Elimina
                  </button>
                </>
              )}

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}