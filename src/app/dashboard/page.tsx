"use client";

import { useMemo, useEffect, useState } from "react";
import {
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  ArrowRight,
  Loader2,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { getDaysUntilExpiry, formatDate, getStatusColor } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { License, mockLicenses } from "@/lib/mockData";

export default function DashboardPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from("licenses").select("*");
      if (!error && data && data.length > 0) {
        setLicenses(
          data.map((d: any) => {
            const days = getDaysUntilExpiry(d.expiry_date);
            let computedStatus = d.status;
            if (computedStatus !== "Non-aktif") {
              if (days < 0) computedStatus = "Kadaluarsa";
              else if (days <= 30) computedStatus = "Akan Kadaluarsa";
              else computedStatus = "Aktif";
            }
            return {
              id: d.id,
              name: d.name,
              category: d.category,
              licenseNumber: d.license_number,
              owner: d.owner,
              vendor: d.vendor,
              issueDate: d.issue_date,
              expiryDate: d.expiry_date,
              status: computedStatus,
              notes: d.notes || "",
              fileUrl: d.file_url || "",
              fileName: d.file_name || "",
            };
          })
        );
      } else {
        setLicenses(mockLicenses);
      }
      setIsLoading(false);
    };
    fetch();
  }, []);

  const stats = useMemo(() => {
    const total = licenses.length;
    const active = licenses.filter((l) => l.status === "Aktif").length;
    const expiringSoon = licenses.filter((l) => l.status === "Akan Kadaluarsa").length;
    const expired = licenses.filter((l) => l.status === "Kadaluarsa").length;
    const bySoftware = licenses.filter((l) => l.category === "Software").length;
    const byIzin = licenses.filter((l) => l.category === "Izin Usaha & Legalitas").length;
    const bySertifikasi = licenses.filter((l) => l.category === "Sertifikasi Profesi").length;
    return { total, active, expiringSoon, expired, bySoftware, byIzin, bySertifikasi };
  }, [licenses]);

  const upcomingExpiries = useMemo(() => {
    return licenses
      .filter((l) => l.status === "Akan Kadaluarsa" || l.status === "Kadaluarsa")
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }, [licenses]);

  const statCards = [
    { label: "Total Lisensi", value: stats.total, icon: Shield, color: "indigo" as const },
    { label: "Aktif", value: stats.active, icon: CheckCircle2, color: "emerald" as const },
    { label: "Akan Kadaluarsa", value: stats.expiringSoon, icon: AlertTriangle, color: "amber" as const },
    { label: "Kadaluarsa", value: stats.expired, icon: XCircle, color: "rose" as const },
  ];

  const colors = {
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", grad: "from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)]" },
    emerald: { bg: "var(--status-active-bg)", text: "var(--status-active)", grad: "from-emerald-500 to-teal-400" },
    amber: { bg: "var(--status-expiring-bg)", text: "var(--status-expiring)", grad: "from-amber-500 to-orange-400" },
    rose: { bg: "var(--status-expired-bg)", text: "var(--status-expired)", grad: "from-rose-500 to-pink-500" },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-gradient-start)] mb-4" />
        <p className="text-[var(--text-muted)] font-medium">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-8">
      {/* Dynamic Header */}
      <div className="relative rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-8 overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="headline-lg mb-2">Ringkasan <span className="gradient-text">Lisensi</span></h1>
            <p className="text-[15px] text-[var(--text-secondary)] font-medium">Pantau status seluruh lisensi perusahaan Anda di satu tempat.</p>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-inset)] px-4 py-2 rounded-full border border-[var(--border-subtle)]">
            <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">
              {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card) => {
          const c = colors[card.color];
          return (
            <div key={card.label} className="card p-6 relative overflow-hidden group">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.grad} opacity-80`} />
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" 
                  style={{ backgroundColor: c.bg.startsWith('var') ? `var(${c.bg.split('var(')[1].split(')')[0]})` : undefined }}
                  // Fallback for tailwind classes if needed, but we structured it mostly as vars above
                >
                  <card.icon 
                    className="w-5 h-5" 
                    style={{ color: c.text.startsWith('var') ? `var(${c.text.split('var(')[1].split(')')[0]})` : undefined }} 
                  />
                </div>
              </div>
              <p 
                className="text-4xl font-bold leading-none mb-2"
                style={{ color: c.text.startsWith('var') ? `var(${c.text.split('var(')[1].split(')')[0]})` : undefined }} 
              >
                {card.value}
              </p>
              <p className="text-[var(--text-secondary)] font-semibold text-[13px]">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expiring soon */}
        <div className="lg:col-span-2 card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--status-expiring-bg)] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[var(--status-expiring)]" />
              </div>
              <h2 className="headline-sm">Segera Kadaluarsa</h2>
            </div>
            <Link
              href="/dashboard/licenses"
              className="text-[13px] font-bold text-[var(--accent-gradient-start)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1.5 bg-[var(--accent-gradient-start)]/10 px-3 py-1.5 rounded-full"
            >
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {upcomingExpiries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-inset)] flex items-center justify-center mx-auto mb-4 border border-[var(--border-subtle)]">
                <FileText className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <p className="text-[var(--text-primary)] font-bold text-[16px] mb-1">Belum ada lisensi mendesak</p>
              <p className="text-[var(--text-muted)] text-[13px]">Status lisensi Anda saat ini aman terkendali.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {upcomingExpiries.map((license) => {
                const days = getDaysUntilExpiry(license.expiryDate);
                const isExpired = days < 0;
                const isUrgent = days >= 0 && days <= 30;
                
                const dotColor = isExpired ? "var(--status-expired)" : isUrgent ? "var(--status-expiring)" : "var(--status-active)";
                const dayColor = isExpired ? "var(--status-expired)" : isUrgent ? "var(--status-expiring)" : "var(--status-active)";
                const dayBg = isExpired ? "var(--status-expired-bg)" : isUrgent ? "var(--status-expiring-bg)" : "var(--status-active-bg)";

                return (
                  <div
                    key={license.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-[var(--bg-elevated)] transition-all border border-transparent hover:border-[var(--border-subtle)] hover:shadow-sm"
                  >
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: dotColor }} />
                      <div>
                        <p className="text-[14px] font-bold text-[var(--text-primary)] truncate">{license.name}</p>
                        <p className="text-[12px] font-medium text-[var(--text-muted)] truncate mt-0.5">{license.vendor}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pl-5 sm:pl-0">
                      <div className="text-left sm:text-right">
                        <p className="text-[13px] font-semibold text-[var(--text-primary)]">{formatDate(license.expiryDate)}</p>
                        <span 
                          className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold mt-1"
                          style={{ color: dayColor, backgroundColor: dayBg }}
                        >
                          {isExpired ? `${Math.abs(days)}d expired` : `${days}d left`}
                        </span>
                      </div>
                      <div className="w-[110px] text-right shrink-0">
                        <span className={getStatusColor(license.status)}>{license.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-subtle)]">
              <div className="w-8 h-8 rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              <h2 className="headline-sm">Kategori</h2>
            </div>
            <div className="space-y-5">
              {[
                { label: "Software", count: stats.bySoftware, grad: "from-violet-500 to-purple-500" },
                { label: "Izin Usaha & Legalitas", count: stats.byIzin, grad: "from-sky-500 to-blue-500" },
                { label: "Sertifikasi Profesi", count: stats.bySertifikasi, grad: "from-teal-500 to-emerald-500" },
              ].map((item) => {
                const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-[var(--text-secondary)]">{item.label}</span>
                      <span className="text-[14px] font-bold text-[var(--text-primary)]">{item.count}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[var(--bg-inset)] overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.grad} transition-all duration-700 ease-out`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick action */}
          <div className="card p-6 md:p-8 bg-mesh-gradient border-[var(--border-subtle)] relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="headline-sm mb-2 text-[var(--text-primary)]">Kelola Data</h2>
              <p className="text-[13px] text-[var(--text-secondary)] mb-6 font-medium">Tambah atau perbarui lisensi Anda.</p>
              <Link href="/dashboard/licenses" className="btn-primary w-full py-3 shadow-lg hover:shadow-xl">
                <FileText className="w-4.5 h-4.5" />
                Buka Manajemen Lisensi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
