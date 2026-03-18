"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ModificaLibro() {

  const { id } = useParams();
  const router = useRouter();

  const [titolo, setTitolo] = useState("");
  const [autore, setAutore] = useState("");
  const [isbn, setISBN] = useState("");
  const [img, setImg] = useState("");

  useEffect(() => {
    const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");
    const libro = creati.find((l: any) => l.id == id);

    if (libro) {
      setTitolo(libro.titolo);
      setAutore(libro.autore);
      setISBN(libro.isbn);
      setImg(libro.img);
    }
  }, [id]);

  function salva(e: React.FormEvent) {
    e.preventDefault();

    const creati = JSON.parse(localStorage.getItem("libriCreati") || "[]");

    const aggiornati = creati.map((libro: any) =>
      libro.id == id
        ? { ...libro, titolo, autore, isbn, img }
        : libro
    );

    localStorage.setItem("libriCreati", JSON.stringify(aggiornati));

    alert("Libro modificato!");
    router.push("/biblioteca");
  }

  return (
    <form onSubmit={salva} style={{ padding: "40px" }}>
      <h1>Modifica Libro</h1>

      <input value={titolo} onChange={(e) => setTitolo(e.target.value)} />
      <input value={autore} onChange={(e) => setAutore(e.target.value)} />
      <input value={isbn} onChange={(e) => setISBN(e.target.value)} />
      <input value={img} onChange={(e) => setImg(e.target.value)} />

      <button type="submit">Salva</button>
    </form>
  );
}