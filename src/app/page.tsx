"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, ArrowRight, Lock, Mail, KeyRound } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (email === "admin@company.com" && password === "admin123") {
      router.push("/dashboard");
    } else {
      setError("Email atau password salah.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-dot-pattern">
      {/* Background Orbs / Mesh */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-60 pointer-events-none" />

      {/* Theme Toggle in Corner */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-all shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-[var(--status-expiring)]" /> : <Moon className="w-5 h-5 text-[var(--accent-gradient-start)]" />}
        </button>
      </div>

      <div className="w-full max-w-[420px] animate-fadeIn z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] mb-5 shadow-md transform hover:scale-105 transition-transform duration-300">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="headline-lg tracking-tight mb-2">
            Lisensi<span className="gradient-text">Ku</span>
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Sistem Manajemen Lisensi Terpusat</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <div className="mb-6">
            <h2 className="headline-sm">Selamat Datang</h2>
            <p className="text-[13px] text-[var(--text-muted)] mt-1">Masuk dengan akun perusahaan Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--text-muted)]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com" required className="input pl-10 py-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Password</label>
                <Link href="#" className="text-[12px] font-medium text-[var(--accent-gradient-start)] hover:underline">Lupa password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--text-muted)]" />
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  required className="input pl-10 pr-10 py-2.5" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-[var(--status-expired-bg)] border border-[rgba(239,68,68,0.2)] text-[var(--status-expired)] text-[13px] font-medium animate-scaleIn flex items-center gap-2">
                <Shield className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-70 disabled:cursor-not-allowed text-[15px]">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Masuk ke Dashboard <ArrowRight className="w-4.5 h-4.5 ml-1" /></>
              )}
            </button>
          </form>

          {/* Demo Section */}
          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-4 h-4 text-[var(--text-muted)]" />
              <p className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Akses Demo</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button type="button" onClick={() => { setEmail("admin@company.com"); setPassword("admin123"); }}
                className="text-left px-4 py-3 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-subtle)] hover:border-[var(--accent-gradient-start)] hover:bg-[var(--bg-surface-hover)] transition-all cursor-pointer group">
                <span className="block text-[13px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-gradient-start)] transition-colors">Admin</span>
                <span className="block text-[11px] text-[var(--text-muted)] mt-0.5">admin@company.com</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
