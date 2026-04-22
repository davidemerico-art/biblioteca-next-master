"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/AuthService";
import { MessageService } from "@/services/MessageService";
import { UserService } from "@/services/UserService";
import { User, Message } from "@/types";

function MessaggiContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersWithMessages, setUsersWithMessages] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setCurrentUser(user);
    setLoading(false);

    if (user.role === "admin") {
      const users = UserService.getAllUsers();
      setAllUsers(users);
      
      const ids = MessageService.getUsersWithMessages();
      const messagedUsers = users.filter(u => ids.includes(u.id as number));
      setUsersWithMessages(messagedUsers);

      // Check for userId in query params
      const queryUserId = searchParams.get("userId");
      if (queryUserId) {
        const id = parseInt(queryUserId);
        const targetUser = users.find(u => u.id === id);
        if (targetUser) {
          setSelectedUser(targetUser);
          const chat = MessageService.getMessagesFromUser(id);
          setMessages(chat);
        }
      }
    } else {
      loadMessages(user.id as number);
    }
  }, [router, searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = (userId: number) => {
    const chat = MessageService.getMessagesFromUser(userId);
    setMessages(chat);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    loadMessages(user.id as number);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const targetUserId = currentUser.role === "admin" ? selectedUser?.id : currentUser.id;
    if (!targetUserId && currentUser.role === "admin") return;

    const msg: Message = {
      from: currentUser.role === "admin" ? "admin" : "user",
      text: newMessage,
      date: new Date().toISOString(),
      userId: currentUser.role === "user" ? currentUser.id : undefined,
      toUserId: currentUser.role === "admin" ? targetUserId : undefined,
    };

    MessageService.sendMessage(msg);
    setNewMessage("");
    loadMessages(targetUserId as number);

    // Update users list for admin if it's a new conversation
    if (currentUser.role === "admin" && selectedUser) {
        const ids = MessageService.getUsersWithMessages();
        const messagedUsers = allUsers.filter(u => ids.includes(u.id as number));
        setUsersWithMessages(messagedUsers);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Caricamento...</div>;

  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="page-wrapper min-h-[calc(100vh-80px)] flex flex-col sm:flex-row gap-6">
      
      {/* Sidebar for Admin */}
      {isAdmin && (
        <div className="w-full sm:w-80 flex flex-col gap-4">
          <h2 className="text-2xl font-serif font-bold mb-2">Conversazioni</h2>
          <div className="glass rounded-[24px] p-4 flex-1 overflow-y-auto max-h-[400px] sm:max-h-none shadow-sm">
            {usersWithMessages.length === 0 ? (
              <p className="text-[var(--color-text-secondary)] text-sm text-center py-8">Nessun messaggio ricevuto.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {usersWithMessages.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`text-left p-4 rounded-xl transition-all ${
                      selectedUser?.id === u.id 
                        ? "bg-[var(--color-accent-base)] text-white shadow-md scale-[1.02]" 
                        : "bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    <div className="font-semibold">{u.nome} {u.cognome}</div>
                    <div className={`text-xs ${selectedUser?.id === u.id ? "text-white/80" : "text-[var(--color-text-secondary)]"}`}>
                      {u.email}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass rounded-[24px] overflow-hidden shadow-sm border border-[var(--color-border)]/50">
        
        {/* Chat Header */}
        <div className="p-5 border-b border-[var(--color-border)]/50 bg-[var(--color-surface)]/50 backdrop-blur-md flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold">
              {isAdmin 
                ? (selectedUser ? `Chat con ${selectedUser.nome}` : "Seleziona una conversazione") 
                : "Supporto Assistenza"}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              {isAdmin && !selectedUser ? "Scegli un utente dalla lista a sinistra" : "Risposta in genere entro 24 ore"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--color-accent-dim)] flex items-center justify-center text-[var(--color-accent-base)]">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[400px] flex flex-col gap-4 bg-[var(--color-bg-base)]/30">
          {(isAdmin && !selectedUser) ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
               <div className="w-16 h-16 rounded-3xl bg-[var(--color-surface)] flex items-center justify-center mb-4 shadow-sm">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent-base)]"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
               </div>
               <p className="max-w-[200px]">Seleziona un utente per visualizzare la cronologia dei messaggi</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-[var(--color-text-secondary)] text-sm italic">
              Nessun messaggio in questa conversazione. Inizia tu!
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwnMessage = (isAdmin && msg.from === "admin") || (!isAdmin && msg.from === "user");
              return (
                <div 
                  key={index} 
                  className={`flex flex-col max-w-[80%] ${isOwnMessage ? "self-end items-end" : "self-start items-start"} animate-fade-in-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`px-5 py-3 rounded-2xl text-[15px] shadow-sm ${
                    isOwnMessage 
                      ? "bg-[var(--color-accent-base)] text-white rounded-tr-none" 
                      : "bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)]/50 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)] mt-1.5 font-medium px-1">
                    {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[var(--color-surface)]/80 backdrop-blur-md border-t border-[var(--color-border)]/50 flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              className="resize-none !py-3.5 pr-12 min-h-[52px] max-h-32 transition-all duration-300 focus:min-h-[80px]"
              placeholder={isAdmin && !selectedUser ? "Seleziona un utente..." : "Scrivi un messaggio..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isAdmin && !selectedUser}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e as any);
                }
              }}
            />
          </div>
          <button 
            type="submit" 
            className="w-12 h-12 !px-0 flex items-center justify-center shadow-lg active:scale-90"
            disabled={!newMessage.trim() || (isAdmin && !selectedUser)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MessaggiPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Caricamento...</div>}>
      <MessaggiContent />
    </Suspense>
  );
}
