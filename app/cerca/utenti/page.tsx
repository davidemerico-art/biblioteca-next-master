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

  const readMessages = (userId: number) => {
    const userMessages = messages.filter((m) => m.from === "user" && m.userId === userId);

    if (userMessages.length === 0) {
      alert("Nessun messaggio da questo utente");
      return;
    }

    const testo = userMessages.map((m) => ` ✉ ${m.text}`).join("\n");
    alert(testo);
  };

  const hasMessages = (userId: number) => {
    return messages.some((m) => m.from === "user" && m.userId === userId);
  };

  return (
    <div className="page-wrapper max-w-5xl animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="btn-ghost rounded-full p-2 w-10 h-10">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Gestione Utenti</h1>
          <p className="text-[15px] text-[var(--color-text-secondary)] font-medium">Cerca e comunica con gli iscritti</p>
        </div>
      </div>

      <div className="mb-8 relative max-w-md">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input
          type="text"
          placeholder="Cerca per nome, cognome o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 rounded-full"
        />
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Nome</th>
                <th className="px-6 py-4 font-semibold">Cognome</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold text-center">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-[var(--color-text-muted)]">Nessun utente trovato</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">{u.nome}</td>
                    <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">{u.cognome}</td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">{u.email}</td>
                    <td className="px-6 py-4 text-center">
                      {role === "admin" && (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => sendMessage(u.id)} className="p-2 w-9 h-9 rounded-full bg-[var(--color-accent-dim)] text-[var(--color-accent-base)] hover:bg-[var(--color-accent-base)] hover:text-white transition-colors" title="Invia messaggio">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                          </button>
                          
                          <button onClick={() => readMessages(u.id)} className="relative p-2 w-9 h-9 rounded-full btn-ghost" title="Leggi messaggi">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            {hasMessages(u.id) && (
                              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[var(--color-surface)] rounded-full"></span>
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}