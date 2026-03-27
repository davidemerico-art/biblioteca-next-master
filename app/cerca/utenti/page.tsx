"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/UserService";
import { MessageService } from "@/services/MessageService";
import { AuthService } from "@/services/AuthService";
import { User, Message } from "@/types";

export default function Utenti() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      alert("Accesso negato: Solo admin.");
      router.push("/");
      return;
    }
    setRole(currentUser.role);
    
    setUsers(UserService.getAllUsers());
    setMessages(MessageService.getMessages());
  }, [router]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.nome.toLowerCase().includes(q) ||
        (u.cognome && u.cognome.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q)
    );
  }, [search, users]);

  const sendMessage = (userId: number | undefined) => {
    if (!userId) return;
    const text = prompt("Scrivi il messaggio per l'utente:");
    if (!text) return;

    MessageService.sendMessage({
      toUserId: userId,
      from: "admin",
      text,
      date: new Date().toISOString(),
    });

    setMessages(MessageService.getMessages());
    alert("Messaggio inviato con successo!");
  };

  const readMessages = (userId: number | undefined) => {
    if (!userId) return;
    const userMessages = MessageService.getMessagesFromUser(userId);

    if (userMessages.length === 0) {
      alert("Nessun messaggio da questo utente");
      return;
    }

    const testo = userMessages.map((m) => ` ✉ ${m.text}`).join("\n");
    alert(testo);
  };

  const hasMessages = (userId: number | undefined) => {
    if (!userId) return false;
    return MessageService.hasUnreadFromUser(userId);
  };

  if (role !== "admin") return null;

  return (
    <div className="page-wrapper max-w-5xl animate-fade-in">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button onClick={() => router.back()} className="btn-ghost rounded-full p-2 w-10 h-10 shrink-0 border-none">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Gestione Utenti</h1>
          <p className="text-sm sm:text-[15px] text-[var(--color-text-secondary)] font-medium">Cerca e comunica con gli iscritti</p>
        </div>
      </div>

      <div className="mb-6 sm:mb-8 relative max-w-md w-full">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input type="text" placeholder="Cerca utente per nome o email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-12 rounded-full" />
      </div>

      {/* Vista Desktop (Tabella) */}
      <div className="hidden md:block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] overflow-hidden shadow-sm">
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
              <tr><td colSpan={4} className="px-6 py-10 text-center text-[var(--color-text-muted)]">Nessun utente trovato</td></tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">{u.nome}</td>
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">{u.cognome || "—"}</td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">{u.email}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => sendMessage(u.id)} className="p-2 w-10 h-10 rounded-full bg-[var(--color-accent-dim)] text-[var(--color-accent-base)] hover:bg-[var(--color-accent-base)] hover:text-white" title="Invia messaggio">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                      </button>
                      <button onClick={() => readMessages(u.id)} className="relative p-2 w-10 h-10 rounded-full btn-ghost" title="Leggi messaggi">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        {hasMessages(u.id) && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[var(--color-surface)] rounded-full"></span>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile (Card List) */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredUsers.length === 0 ? (
          <div className="py-10 text-center text-[var(--color-text-muted)]">Nessun utente trovato</div>
        ) : (
          filteredUsers.map((u) => (
            <div key={u.id} className="bg-[var(--color-surface)] p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="font-semibold text-lg text-[var(--color-text-primary)] tracking-tight">{u.nome} {u.cognome}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{u.email}</p>
                <div className="inline-block mt-2 badge bg-[var(--color-surface-elev)] text-[var(--color-text-muted)] border border-[var(--color-border)]">{u.role}</div>
              </div>
              <div className="flex gap-2 mt-2 pt-4 border-t border-[var(--color-border)]">
                <button onClick={() => sendMessage(u.id)} className="flex-1 py-3 text-sm bg-[var(--color-accent-dim)] text-[var(--color-accent-base)] hover:bg-[var(--color-accent-base)] hover:text-white">
                  Scrivi
                </button>
                <button onClick={() => readMessages(u.id)} className="flex-1 py-3 text-sm btn-ghost relative border-none bg-[var(--color-surface-hover)]">
                  Leggi
                  {hasMessages(u.id) && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}