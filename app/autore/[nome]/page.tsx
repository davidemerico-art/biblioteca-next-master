"use client";

import { useParams, useRouter } from "next/navigation";
import { autori } from "@/data/autori";
export default function AutorePage() {
  const params = useParams();
  const router = useRouter();
  const nome = decodeURIComponent(params.nome as string);
 

  // ✅ Unisce autori hardcoded + creati
  const autoriCreati = JSON.parse(localStorage.getItem("autoriCreati") || "[]");
  const tuttiAutori = [...autori, ...autoriCreati];

  const autore = tuttiAutori.find(a => a.nome === nome);

  if (!autore) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Autore non trovato</h2>
        <button onClick={() => router.push("/biblioteca")}>Torna indietro</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <button onClick={() => router.push("/biblioteca")}>← Torna indietro</button>
      <br /><br />

      {autore.img && (
        <img
          src={autore.img}
          alt={autore.nome}
          style={{ width: "200px", borderRadius: "10px", marginBottom: "20px" }}
        />
      )}

      <h1>{autore.nome}</h1>
      <p><strong>Età:</strong> {autore.eta}</p>
      <p><strong>Stato:</strong> {autore.stato}</p>
      <hr style={{ margin: "20px 0" }} />
      <p>{autore.bio}</p>
    </div>
  );
}