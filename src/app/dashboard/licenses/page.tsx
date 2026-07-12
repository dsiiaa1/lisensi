/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  SortAsc,
  Eye,
  Pencil,
  Trash2,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  License,
  LicenseCategory,
  LicenseStatus,
  categories,
  statuses,
  mockLicenses,
} from "@/lib/mockData";
import {
  formatDate,
  getDaysUntilExpiry,
  getStatusColor,
  getCategoryColor,
} from "@/lib/utils";
import LicenseModal from "@/components/LicenseModal";
import LicenseDetail from "@/components/LicenseDetail";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/LanguageContext";

import { Suspense } from "react";

function LicensesContent() {
  const { t } = useLanguage();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<LicenseCategory | "">("");
  const [statusFilter, setStatusFilter] = useState<LicenseStatus | "">("");
  const [sortByExpiry, setSortByExpiry] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [viewingLicense, setViewingLicense] = useState<License | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams?.get("search");
    if (q) setSearchQuery(q);
    
    const s = searchParams?.get("status");
    if (s && statuses.includes(s as LicenseStatus)) setStatusFilter(s as LicenseStatus);
  }, [searchParams]);

  const fetchLicenses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("licenses")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      setLicenses(
        data.map((d: Record<string, string>) => {
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
            category: d.category as LicenseCategory,
            licenseNumber: d.license_number,
            owner: d.owner,
            vendor: d.vendor,
            issueDate: d.issue_date,
            expiryDate: d.expiry_date,
            status: computedStatus as LicenseStatus,
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

  useEffect(() => { fetchLicenses(); }, []);

  const filteredLicenses = useMemo(() => {
    let result = [...licenses];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.licenseNumber.toLowerCase().includes(q) ||
          l.vendor.toLowerCase().includes(q) ||
          l.owner.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) result = result.filter((l) => l.category === categoryFilter);
    if (statusFilter) result = result.filter((l) => l.status === statusFilter);
    if (sortByExpiry) {
      result.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
    }
    return result;
  }, [licenses, searchQuery, categoryFilter, statusFilter, sortByExpiry]);

  const handleSave = async (data: Omit<License, "id">) => {
    const payload = {
      name: data.name, category: data.category, license_number: data.licenseNumber,
      owner: data.owner, vendor: data.vendor, issue_date: data.issueDate,
      expiry_date: data.expiryDate, status: data.status, notes: data.notes,
      file_url: data.fileUrl, file_name: data.fileName,
    };
    if (editingLicense) {
      const { error } = await supabase.from("licenses").update(payload).eq("id", editingLicense.id);
      if (error) {
        // Fallback update mock local state
        setLicenses(prev => prev.map(l => l.id === editingLicense.id ? { ...data, id: editingLicense.id } : l));
      } else {
        fetchLicenses();
      }
    } else {
      const { error } = await supabase.from("licenses").insert([payload]).select();
      if (error) {
        // Fallback add mock local state
        setLicenses(prev => [{ ...data, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      } else {
        fetchLicenses();
      }
    }
    setEditingLicense(null);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("licenses").delete().eq("id", id);
    if (error) {
       // local fallback delete
       setLicenses((prev) => prev.filter((l) => l.id !== id));
    } else {
       setLicenses((prev) => prev.filter((l) => l.id !== id));
    }
    setDeleteConfirm(null);
  };

  const activeFilters = (categoryFilter ? 1 : 0) + (statusFilter ? 1 : 0) + (sortByExpiry ? 1 : 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="headline-lg">{t("licenses.title")}</h1>
          <p className="text-[var(--text-secondary)] text-[14px] font-medium mt-1">
            {isLoading ? t("licenses.loading") : t("licenses.found", { count: filteredLicenses.length })}
          </p>
        </div>
        <button
          onClick={() => { setEditingLicense(null); setIsModalOpen(true); }}
          className="btn-primary"
        >
          <Plus className="w-4.5 h-4.5" />
          {t("licenses.add_new")}
        </button>
      </div>

      {/* Search & Filter Card */}
      <div className="card p-5 bg-[var(--bg-inset)] border-[var(--border-subtle)] shadow-none">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("licenses.search_placeholder")}
              className="input pl-11 pr-10 py-3 rounded-full border-[var(--border-subtle)] shadow-sm bg-[var(--bg-surface)] text-[14px] font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary h-11 shrink-0 ${activeFilters > 0 ? "border-[var(--accent-gradient-start)] text-[var(--text-primary)]" : "border-[var(--border-subtle)] text-[var(--text-secondary)]"} bg-[var(--bg-surface)]`}
          >
            <Filter className="w-4.5 h-4.5" />
            {t("licenses.filter_sort")}
            {activeFilters > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-[var(--accent-gradient-start)] text-white text-[11px] font-bold flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-5 pt-5 border-t border-[var(--border-hover)] grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
            <div>
              <label className="block text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">{t("licenses.category")}</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as LicenseCategory | "")}
                className="input py-2.5 rounded-xl border-[var(--border-subtle)] bg-[var(--bg-surface)]"
              >
                <option value="">{t("licenses.all_categories")}</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">{t("licenses.status")}</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LicenseStatus | "")}
                className="input py-2.5 rounded-xl border-[var(--border-subtle)] bg-[var(--bg-surface)]"
              >
                <option value="">{t("licenses.all_statuses")}</option>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">{t("licenses.sorting")}</label>
              <button
                onClick={() => setSortByExpiry(!sortByExpiry)}
                className={`input flex items-center justify-between cursor-pointer py-2.5 rounded-xl border-[var(--border-subtle)] ${
                  sortByExpiry ? "border-[var(--accent-gradient-start)] bg-[rgba(99,102,241,0.05)] text-[var(--text-primary)]" : "bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                }`}
              >
                <span className="text-[14px] font-medium">{sortByExpiry ? t("licenses.sort_nearest") : t("licenses.sort_earliest")}</span>
                <SortAsc className={`w-4.5 h-4.5 shrink-0 ${sortByExpiry ? "text-[var(--accent-gradient-start)]" : "text-[var(--text-muted)]"}`} />
              </button>
            </div>
            {activeFilters > 0 && (
              <div className="sm:col-span-3 flex justify-end mt-1">
                <button
                  onClick={() => { setCategoryFilter(""); setStatusFilter(""); setSortByExpiry(false); }}
                  className="text-[13px] font-bold text-[var(--status-expired)] hover:opacity-80 cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" /> {t("licenses.reset_filters")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-inset)]">
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  {t("licenses.table_detail")}
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">
                  {t("licenses.table_category")}
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">
                  {t("licenses.table_vendor")}
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  {t("licenses.table_expiry")}
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell text-center">
                  {t("licenses.table_status")}
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider text-right">
                  {t("licenses.table_actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--accent-gradient-start)]" />
                    <p className="text-[14px] font-bold text-[var(--text-primary)]">{t("licenses.loading")}</p>
                  </td>
                </tr>
              ) : filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-24">
                    <div className="w-16 h-16 rounded-full bg-[var(--bg-inset)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                    <p className="text-[16px] font-bold text-[var(--text-primary)]">{t("licenses.not_found")}</p>
                    <p className="text-[14px] font-medium text-[var(--text-muted)] mt-1">{t("licenses.not_found_desc")}</p>
                  </td>
                </tr>
              ) : (
                filteredLicenses.map((license) => {
                  const days = getDaysUntilExpiry(license.expiryDate);
                  const isExpired = days < 0;
                  const dayColor = isExpired ? "var(--status-expired)" : days <= 30 ? "var(--status-expiring)" : "var(--status-active)";

                  return (
                    <tr key={license.id} className="table-row border-b border-[var(--border-subtle)] last:border-0 group">
                      <td className="px-6 py-4 align-top sm:align-middle">
                        <p className="text-[14px] font-bold text-[var(--text-primary)] truncate max-w-[240px]">{license.name}</p>
                        <p className="text-[12px] font-medium text-[var(--text-muted)] mt-1 font-mono">{license.licenseNumber}</p>
                        {/* Mobile Badges */}
                        <div className="mt-3 sm:hidden flex flex-wrap gap-2">
                           <span className={getStatusColor(license.status)}>{license.status}</span>
                           <span className={getCategoryColor(license.category)}>{license.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell align-middle">
                        <span className={getCategoryColor(license.category)}>{license.category}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell align-middle">
                        <p className="text-[13px] font-semibold text-[var(--text-secondary)] truncate max-w-[160px]">{license.vendor}</p>
                      </td>
                      <td className="px-6 py-4 align-top sm:align-middle">
                        <p className="text-[14px] font-bold text-[var(--text-primary)]">{formatDate(license.expiryDate)}</p>
                        <p className="text-[12px] font-bold mt-1" style={{ color: dayColor }}>
                          {isExpired ? `${Math.abs(days)} hari lewat` : `${days} hari lagi`}
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell align-middle text-center">
                        <span className={getStatusColor(license.status)}>{license.status}</span>
                      </td>
                      <td className="px-6 py-4 align-top sm:align-middle">
                        <div className="flex items-center justify-end gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewingLicense(license)}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-gradient-start)] hover:bg-[rgba(99,102,241,0.1)] transition-colors cursor-pointer shadow-sm border border-transparent hover:border-[rgba(99,102,241,0.2)]"
                            title={t("licenses.action_view")}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditingLicense(license); setIsModalOpen(true); }}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--status-expiring)] hover:bg-[var(--status-expiring-bg)] transition-colors cursor-pointer shadow-sm border border-transparent hover:border-[rgba(245,158,11,0.2)]"
                            title={t("licenses.action_edit")}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          
                          {deleteConfirm === license.id ? (
                            <div className="flex items-center gap-1.5 animate-scaleIn bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-1 rounded-full shadow-md ml-1 absolute right-6 z-10">
                              <button
                                onClick={() => handleDelete(license.id)}
                                className="text-[12px] px-3 py-1.5 rounded-full bg-[var(--status-expired)] text-white cursor-pointer font-bold hover:opacity-90"
                              >
                                {t("licenses.confirm_delete")}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-inset)] cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(license.id)}
                              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--status-expired)] hover:bg-[var(--status-expired-bg)] transition-colors cursor-pointer shadow-sm border border-transparent hover:border-[rgba(239,68,68,0.2)]"
                              title={t("licenses.action_delete")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <LicenseModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingLicense(null); }}
        onSave={handleSave}
        license={editingLicense}
      />
      <LicenseDetail
        isOpen={!!viewingLicense}
        onClose={() => setViewingLicense(null)}
        license={viewingLicense}
      />
    </div>
  );
}

export default function LicensesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-gradient-start)] mb-4" />
        <p className="text-[var(--text-muted)] font-medium">Memuat...</p>
      </div>
    }>
      <LicensesContent />
    </Suspense>
  );
}
