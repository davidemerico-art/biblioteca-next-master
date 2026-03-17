"use client";

import { useState, useEffect } from "react";

export default function Recensioni() {

  const [recensioni, setRecensioni] = useState<any[]>([]);
  const [utente, setUtente] = useState("");
  const [titolo, setTitolo] = useState("");
  const [testo, setTesto] = useState("");
  const [stelle, setStelle] = useState(5);

  // Carica recensioni da localStorage
  useEffect(() => {
    const data = localStorage.getItem("recensioni");
    if (data) {
      setRecensioni(JSON.parse(data));
    }
  }, []);

  // Salva nel localStorage
  const salvaRecensioni = (nuoveRecensioni:any[]) => {
    setRecensioni(nuoveRecensioni);
    localStorage.setItem("recensioni", JSON.stringify(nuoveRecensioni));
  };

  const inviaRecensione = (e:any) => {
    e.preventDefault();

    if (!utente || !titolo || !testo) {
      alert("Compila tutti i campi");
      return;
    }

    const nuovaRecensione = {
      id: Date.now(),
      user: utente,
      titolo,
      testo,
      stelle
    };

    const nuoveRecensioni = [...recensioni, nuovaRecensione];

    salvaRecensioni(nuoveRecensioni);

    setTitolo("");
    setTesto("");
    setStelle(5);
  };

  const eliminaRecensione = (id:number) => {
    const filtrate = recensioni.filter(r => r.id !== id);
    salvaRecensioni(filtrate);
  };

  const modificaRecensione = (id:number) => {
    const nuovaLista = recensioni.map(r => {
      if (r.id === id) {
        const nuovoTitolo = prompt("Nuovo titolo", r.titolo);
        const nuovoTesto = prompt("Nuovo testo", r.testo);
        const nuoveStelle = prompt("Nuove stelle (1-5)", r.stelle);

        return {
          ...r,
          titolo: nuovoTitolo || r.titolo,
          testo: nuovoTesto || r.testo,
          stelle: parseInt(nuoveStelle || r.stelle)
        };
      }
      return r;
    });

    salvaRecensioni(nuovaLista);
  };

  return (
    <div style={{ padding: "40px" }}>

      <h2>Recensioni</h2>

      {recensioni.length === 0 && <p>Nessuna recensione ancora.</p>}

      {recensioni.map(r => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px"
          }}
        >

          <h4>{r.titolo}</h4>

          <p>
            <strong>{r.user}</strong> — {r.stelle} ⭐
          </p>

          <p>{r.testo}</p>

          <button onClick={() => eliminaRecensione(r.id)}>
            Elimina
          </button>

          <button
            style={{ marginLeft: "10px" }}
            onClick={() => modificaRecensione(r.id)}
          >
            Modifica
          </button>

        </div>
      ))}

      <hr style={{ margin: "30px 0" }} />

      <h3>Scrivi una recensione</h3>

      <form onSubmit={inviaRecensione}>

        <input
          type="text"
          placeholder="titolo recensione"
          value={utente}
          onChange={(e) => setUtente(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="Titolo recensione"
          value={titolo}
          onChange={(e) => setTitolo(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />

        <textarea
          placeholder="Scrivi la tua recensione"
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
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


