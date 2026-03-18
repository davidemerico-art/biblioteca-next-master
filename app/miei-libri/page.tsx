"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MieiLibriPage() {
  const [libri, setLibri] = useState<any[]>([]);
  const [adminLastBook, setAdminLastBook] = useState<any | null>(null);
  const [role, setRole] = useState<"user" | "admin" | null>(null);

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      router.push("/");
      return;
    }

    setRole(user.role);

    //  USER
    if (user.role === "user") {
      const data = localStorage.getItem("prenotati");

      if (data) {
        setLibri(JSON.parse(data));
      }
    }

    //  ADMIN → ultimo libro creato
    if (user.role === "admin") {
      const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");

      if (creati.length > 0) {
        setAdminLastBook(creati[creati.length - 1]);
      }
    }
  }, [router]);

  if (!role) return null;

  return (
    <div style={{ padding: "40px" }}>

      <h1 style={{ marginBottom: "30px" }}>
        {role === "user" ? "I Miei Libri" : "Ultima Modifica"}
      </h1>

      {/*  USER VIEW */}
      {role === "user" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px"
          }}
        >
          {libri.map((libro) => (
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
                style={{ width: "100%", borderRadius: "8px" }}
              />

              <h3 style={{ marginTop: "10px" }}>
                {libro.titolo}
              </h3>

              {/*  USER può acquistare */}
              <button
                onClick={() => router.push("/acquista")}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  cursor: "pointer"
                }}
              >
                Acquista
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 👑 ADMIN VIEW */}
      {role === "admin" && adminLastBook && (
        <div
          style={{
            maxWidth: "400px",
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          {adminLastBook.img && (
            <img
              src={adminLastBook.img}
              alt={adminLastBook.titolo}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          )}

          <h3 style={{ marginTop: "10px" }}>
            {adminLastBook.titolo}
          </h3>

          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button
              onClick={() => router.push(`/modifica/${adminLastBook.id}`)}
            >
              Modifica
            </button>

            <button
              onClick={() => router.push(`/elimina/${adminLastBook.id}`)}
            >
              Elimina
            </button>
          </div>
        </div>
      )}

    </div>
  );
}