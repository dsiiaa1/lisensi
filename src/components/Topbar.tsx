"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, Sun, Moon, Bell, Search, User, Menu, X, LogOut } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Lisensi", href: "/dashboard/licenses" },
];

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/licenses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-sm"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Shield className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground hidden sm:block">
                Lisensi<span className="gradient-text">Ku</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative flex items-center">
              {showSearch && (
                <form onSubmit={handleSearch} className="absolute right-0 animate-fadeIn">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setShowSearch(false)}
                    placeholder="Cari lisensi..."
                    className="input pl-10 pr-4 py-2 w-48 sm:w-64 rounded-full border-[var(--border-subtle)] shadow-sm bg-[var(--bg-surface)] text-[13px] font-medium"
                  />
                </form>
              )}
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className={`w-9 h-9 z-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors ${showSearch ? 'pointer-events-none absolute left-1' : ''}`}
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Notifications */}
            <Link href="/dashboard/licenses?status=Akan+Kadaluarsa" className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors relative" title="Lihat lisensi akan kadaluarsa">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-[var(--status-expired)]" />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-[var(--status-expiring)]" /> : <Moon className="w-4.5 h-4.5 text-[var(--accent-gradient-start)]" />}
            </button>

            {/* Separator */}
            <div className="hidden sm:block w-[1px] h-6 bg-[var(--border-subtle)] mx-1" />

            {/* Avatar / Profile Dropdown */}
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[var(--bg-inset)] flex items-center justify-center border border-[var(--border-subtle)]">
                  <User className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
                <span className="text-[13px] font-semibold">Admin</span>
              </button>

              {/* Simple dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-lg py-1 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-[var(--border-subtle)]">
                    <p className="text-[13px] font-bold">Admin User</p>
                    <p className="text-[11px] text-[var(--text-muted)]">admin@company.com</p>
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={() => router.push("/")}
                      className="w-full text-left px-3 py-2 text-[13px] font-medium text-[var(--status-expired)] hover:bg-[var(--status-expired-bg)] rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[64px] z-30 bg-[var(--bg-base)] animate-slideDown overflow-y-auto">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-semibold transition-all",
                    isActive
                      ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-inset)] flex items-center justify-center border border-[var(--border-subtle)]">
                  <User className="w-5 h-5 text-[var(--text-muted)]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold">Admin User</p>
                  <p className="text-[12px] text-[var(--text-muted)]">admin@company.com</p>
                </div>
              </div>
              <button 
                onClick={() => router.push("/")}
                className="w-full mt-2 text-left px-4 py-3 text-[14px] font-semibold text-[var(--status-expired)] bg-[var(--status-expired-bg)] rounded-xl flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Keluar
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
