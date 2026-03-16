"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{ nome: string; email: string } | null>(null);
  const [isLight, setIsLight] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (document.documentElement.classList.contains("light-theme")) {
      setIsLight(true);
    }
  }, [pathname]); // refresh dopo navigazione

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
      setIsLight(false);
    } else {
      document.documentElement.classList.add("light-theme");
      localStorage.setItem("theme", "light");
      setIsLight(true);
    }
  };

  if (pathname === "/login") return null; // nascondi intera navbar nella auth page

  return (
    <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border-accent)] px-6 py-4 sticky top-0 z-50 shadow-[var(--shadow-accent)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-[var(--color-accent-base)] w-9 h-9 rounded-lg flex items-center justify-center text-[#0f0e0d] font-bold text-lg">
            B
          </div>
          <span className="font-serif text-[1.4rem] font-semibold text-[var(--color-text-primary)]">
            Biblio<span className="text-[var(--color-accent-base)]">Sphere</span>
          </span>
        </Link>

        {/* voci di navigazione e user */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/biblioteca" className={`${pathname === "/biblioteca" ? "text-[var(--color-accent-base)] font-semibold" : "text-[var(--color-text-secondary)] font-normal"}`}>
                Biblioteca
              </Link>
              <Link href="/miei-libri" className={`${pathname === "/miei-libri" ? "text-[var(--color-accent-base)] font-semibold" : "text-[var(--color-text-secondary)] font-normal"}`}>
                I Miei Libri
              </Link>
              
              <div className="w-px h-6 bg-[var(--color-border)]"></div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleTheme}
                  className="btn-ghost btn-sm rounded-full w-9 h-9 p-0"
                  title="Cambia tema"
                >
                  {isLight ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                  )}
                </button>
                
                <div className="text-right text-[0.85rem]">
                  <div className="text-[var(--color-text-primary)] font-medium">{user.nome}</div>
                  <div className="text-[var(--color-text-muted)]">{user.email}</div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn-ghost btn-sm rounded-full w-9 h-9 p-0"
                  title="Logout"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <Link href="/login">
              <button>Accedi</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
