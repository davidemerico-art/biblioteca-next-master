"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "@/services/AuthService";
import { User } from "@/types";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(AuthService.getCurrentUser());
    
    if (document.documentElement.classList.contains("dark-theme")) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, [pathname]);

  // Chiude il menu mobile quando si cambia pagina
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  if (pathname === "/") return null;

  return (
    <>
      <nav className="glass px-4 sm:px-6 py-3 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 z-50">
            <div className="bg-[var(--color-accent-base)] w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
              B
            </div>
            <span className="font-serif text-xl sm:text-[1.4rem] font-semibold text-[var(--color-text-primary)] tracking-tight">
              Biblio<span className="text-[var(--color-accent-base)]">Sphere</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link href="/biblioteca" className={`text-[15px] ${pathname === "/biblioteca" ? "text-[var(--color-text-primary)] font-semibold" : "text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-text-primary)] transition-colors"}`}>Biblioteca</Link>
                <Link href="/miei-libri" className={`text-[15px] ${pathname === "/miei-libri" ? "text-[var(--color-text-primary)] font-semibold" : "text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-text-primary)] transition-colors"}`}>I Miei Libri</Link>
                <Link href="/cronologia" className={`text-[15px] ${pathname === "/cronologia" ? "text-[var(--color-text-primary)] font-semibold" : "text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-text-primary)] transition-colors"}`}>Cronologia</Link>
                <Link href="/messaggi" className={`text-[15px] ${pathname === "/messaggi" ? "text-[var(--color-text-primary)] font-semibold" : "text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-text-primary)] transition-colors"}`}>Messaggi</Link>
                
                <div className="w-px h-6 bg-[var(--color-border)] mx-2"></div>

                <button onClick={toggleTheme} className="btn-ghost rounded-full w-10 h-10 p-0 flex items-center justify-center" title="Cambia tema">
                  {isDark ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                  )}
                </button>
                
                <div className="text-right text-[0.85rem]">
                  <div className="text-[var(--color-text-primary)] font-semibold tracking-tight">{user.nome}</div>
                  <div className="text-[var(--color-text-muted)] text-[11px] uppercase tracking-wider">{user.role}</div>
                </div>
                <button onClick={handleLogout} className="btn-ghost rounded-full w-10 h-10 p-0 flex items-center justify-center text-red-500 hover:bg-red-500/10 hover:text-red-500 border-transparent" title="Logout">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
              </>
            ) : (
              <Link href="/" className="text-[var(--color-text-primary)] font-medium hover:underline">Accedi</Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-2 z-50">
            <button onClick={toggleTheme} className="btn-ghost rounded-full w-10 h-10 p-0 flex items-center justify-center">
               {isDark ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>}
            </button>
            <button 
              className="btn-ghost rounded-full w-10 h-10 p-0 flex items-center justify-center border-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[var(--color-bg-base)] pt-20 px-6 pb-6 flex flex-col animate-slide-down overflow-y-auto">
          {user ? (
            <div className="flex flex-col gap-6 mt-4">
              <div className="bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div className="text-[var(--color-text-primary)] font-semibold text-lg">{user.nome}</div>
                <div className="text-[var(--color-text-muted)] text-sm">{user.email}</div>
                <div className="inline-block mt-2 badge bg-[var(--color-accent-dim)] text-[var(--color-accent-base)]">{user.role}</div>
              </div>

              <div className="flex flex-col gap-2">
                <Link href="/biblioteca" className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium active:scale-95 transition-transform">Biblioteca</Link>
                <Link href="/miei-libri" className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium active:scale-95 transition-transform">I Miei Libri</Link>
                <Link href="/cronologia" className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium active:scale-95 transition-transform">Cronologia</Link>
                <Link href="/messaggi" className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium active:scale-95 transition-transform">Messaggi</Link>
              </div>

              <button onClick={handleLogout} className="mt-auto bg-red-500/10 text-red-500 w-full py-4 text-lg">
                Esci dall'Account
              </button>
            </div>
          ) : (
            <div className="mt-8">
              <Link href="/" className="block text-center bg-[var(--color-accent-base)] text-white py-4 rounded-full font-semibold">Accedi</Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}