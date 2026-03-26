"use client";

import { useState, useEffect, useMemo } from "react";
import { libri } from "../../data/libri";
import { useRouter } from "next/navigation";

type Libro = {
  id: number;
  titolo: string;
  autore: string;
  isbn: string | number;
  img: string;
};

type User = {
  id?: number; 
  role: "user" | "admin";
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

export default function Biblioteca() {
  const [search, setSearch] = useState("");
  const [libriTotali, setLibriTotali] = useState<Libro[]>([]);
  const [role, setRole] = useState<User["role"] | null>(null);

  const router = useRouter();

  useEffect(() => {
    const creati = getFromStorage<Libro[]>("libriCreati", []);
    setLibriTotali([...libri, ...creati]);

    const user = getFromStorage<User | null>("user", null);
    if (user) {
      setRole(user.role);
    } else {
      router.push("/");
    }
  }, [router]);

  const prenota = (libro: Libro) => {
    const salvati = getFromStorage<Libro[]>("prenotati", []);
    const giaPrenotato = salvati.some((l) => l?.id === libro.id);

    if (giaPrenotato) {
      alert("Hai già prenotato questo libro");
      return;
    }

    setToStorage("prenotati", [...salvati, libro]);
    alert("Libro prenotato");
  };

  const eliminaLibro = (id: number) => {
    const creati = getFromStorage<Libro[]>("libriCreati", []);
    const aggiornati = creati.filter((libro) => libro.id !== id);

    setToStorage("libriCreati", aggiornati);
    setLibriTotali([...libri, ...aggiornati]);
  };

  const libriFiltrati = useMemo(() => {
    const query = search.toLowerCase();

    return libriTotali.filter(
      (libro) =>
        libro.titolo?.toLowerCase().includes(query) ||
        libro.autore?.toLowerCase().includes(query) ||
        String(libro.isbn).toLowerCase().includes(query)
    );
  }, [search, libriTotali]);

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "20px" }}>La Collezione</h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "30px",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* SINISTRA */}
        <input
          type="text"
          placeholder="Cerca"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "400px",
          }}
        />

        {/* DESTRA */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          
          {/* ADMIN */}
          {role === "admin" && (
            <>
              <button
                onClick={() => router.push("/crea-libro")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#b8860b",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Crea Libro
              </button>

              <button
                onClick={() => router.push("/cerca/utenti")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#b8860b",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                cerca utenti
              </button>
            </>
          )}

          {/* USER */}
          {role === "user" && (
            <span
              onClick={() => {
                const text = prompt("Scrivi un messaggio per l'admin:");
                if (!text) return;

                const currentUser = JSON.parse(localStorage.getItem("user") || "null");

                const messages = JSON.parse(localStorage.getItem("messages") || "[]");
                messages.push({
                  from: "user",
                  text,
                  userId: currentUser?.id, 
                  date: new Date().toISOString(),
                });

                localStorage.setItem("messages", JSON.stringify(messages));
                alert("Messaggio inviato all'admin!");
              }}
              style={{
                cursor: "pointer",
                fontSize: "22px",
              }}
            >
              ✉
            </span>
          )}

        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {libriFiltrati.map((libro) => (
          <div
            key={libro.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <img
              src={libro.img}
              alt={libro.titolo}
              style={{
                width: "100%",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => router.push(`/libro/${libro.id}`)}
            />

            <h3 style={{ marginTop: "10px" }}>{libro.titolo}</h3>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {(role === "user" || role === "admin") && (
                <>
                  <button onClick={() => prenota(libro)}>Prenota</button>

                  <button onClick={() => router.push(`/acquista?id=${libro.id}`)}>
                    Acquista
                  </button>
                </>
              )}

              {role === "admin" && (
                <>
                  <button onClick={() => router.push(`/modifica/${libro.id}`)}>
                    Modifica
                  </button>

                  <button onClick={() => eliminaLibro(libro.id)}>Elimina</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}