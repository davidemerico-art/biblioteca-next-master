"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

type AppUser = {
  id: number;
  nome: string;
  cognome: string;
  email: string;
};

type Message = {
  toUserId?: number;
  from: "admin" | "user";
  text: string;
  date: string;
  userId?: number; 
};

export default function Utenti() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("utenti") || "[]");
    setUsers(savedUsers);

    const savedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    setMessages(savedMessages);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) setRole(user.role);
    else router.push("/");
  }, [router]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.nome.toLowerCase().includes(q) ||
        u.cognome.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [search, users]);

  const sendMessage = (userId: number) => {
    const text = prompt("Scrivi il messaggio per l'utente:");
    if (!text) return;

    const newMessages = [...messages];
    newMessages.push({
      toUserId: userId,
      from: "admin",
      text,
      date: new Date().toISOString(),
    });

    localStorage.setItem("messages", JSON.stringify(newMessages));
    setMessages(newMessages);

    alert("Messaggio inviato!");
  };

  // mostra messaggi ricevuti dall'utente
  const readMessages = (userId: number) => {
    const userMessages = messages.filter(
      (m) => m.from === "user" && m.userId === userId
    );

    if (userMessages.length === 0) {
      alert("Nessun messaggio da questo utente");
      return;
    }

    const testo = userMessages
      .map((m) => ` ✉ ${m.text}`)
      .join("\n");

    alert(testo);
  };

  //  controlla se ci sono messaggi non letti
  const hasMessages = (userId: number) => {
    return messages.some((m) => m.from === "user" && m.userId === userId);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Gestione Utenti</h1>

      <input
        type="text"
        placeholder="Cerca per nome, cognome o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{backgroundColor: "#c0c0c0"}}> 
            <th style={{ border: "1px solid #b8860b", padding: "10px" }}>Nome</th>
            <th style={{ border: "1px solid #b8860b", padding: "10px" }}>Cognome</th>
            <th style={{ border: "1px solid #b8860b", padding: "10px" }}>Email</th>
            <th style={{ border: "1px solid #b8860b", padding: "10px" }}>Azioni</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td style={{ border: "1px solid #b8860b", padding: "10px" }}>{u.nome}</td>
              <td style={{ border: "1px solid #b8860b", padding: "10px" }}>{u.cognome}</td>
              <td style={{ border: "1px solid #b8860b", padding: "10px" }}>{u.email}</td>

              <td style={{ border: "1px solid #b8860b", padding: "10px", textAlign: "center" }}>
                {role === "admin" && (
                  <>
                    {/* INVIA */}
                    <button
                      onClick={() => sendMessage(u.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#b8860b",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      ✉
                    </button>

                    {/* LEGGI */}
                    <button
                      onClick={() => readMessages(u.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#444",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                       ✉
                      {hasMessages(u.id) && (
                        <span
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            width: "10px",
                            height: "10px",
                            backgroundColor: "red",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "10px" }}>
                Nessun utente trovato
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}