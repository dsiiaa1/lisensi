"use client";

import { useState, useEffect } from "react";
import { X, Save, Upload, FileText, Calendar, Info, ShieldCheck } from "lucide-react";
import { License, LicenseCategory, LicenseStatus, categories, statuses } from "@/lib/mockData";

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (license: Omit<License, "id">) => void;
  license?: License | null;
}

export default function LicenseModal({ isOpen, onClose, onSave, license }: LicenseModalProps) {
  const [form, setForm] = useState({
    name: "", category: "Software" as LicenseCategory, licenseNumber: "",
    owner: "", vendor: "", issueDate: "", expiryDate: "",
    status: "Aktif" as LicenseStatus, notes: "", fileUrl: "", fileName: "",
  });

  useEffect(() => {
    if (license) {
      setForm({
        name: license.name, category: license.category, licenseNumber: license.licenseNumber,
        owner: license.owner, vendor: license.vendor, issueDate: license.issueDate,
        expiryDate: license.expiryDate, status: license.status, notes: license.notes,
        fileUrl: license.fileUrl || "", fileName: license.fileName || "",
      });
    } else {
      setForm({
        name: "", category: "Software", licenseNumber: "", owner: "", vendor: "",
        issueDate: "", expiryDate: "", status: "Aktif", notes: "", fileUrl: "", fileName: "",
      });
    }
  }, [license, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="headline-md">
            {license ? "Edit Lisensi" : "Tambah Lisensi"}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inset)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Informasi Umum */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-[rgba(99,102,241,0.1)] flex items-center justify-center">
                <Info className="w-4 h-4 text-[var(--accent-gradient-start)]" />
              </div>
              <h3 className="form-section-title !m-0 !p-0 !border-0 text-[var(--text-primary)]">Informasi Umum</h3>
            </div>
            
            <Field label="Nama Lisensi *">
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Mis: Microsoft 365 Business" required className="input" />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Nomor Lisensi *">
                <input type="text" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                  placeholder="MS365-BP-2024-001" required className="input font-mono text-[13px]" />
              </Field>
              <Field label="Kategori *">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as LicenseCategory })}
                  className="input cursor-pointer">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Vendor *">
                <input type="text" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                  placeholder="Mis: Microsoft Corporation" required className="input" />
              </Field>
              <Field label="PIC / Divisi (Pemilik) *">
                <input type="text" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  placeholder="Mis: Divisi IT" required className="input" />
              </Field>
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)]" />

          {/* Section 2: Tanggal & Status */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-[rgba(245,158,11,0.1)] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[var(--status-expiring)]" />
              </div>
              <h3 className="form-section-title !m-0 !p-0 !border-0 text-[var(--text-primary)]">Tanggal & Status</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Tanggal Terbit *">
                <input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                  required className="input cursor-text" />
              </Field>
              <Field label="Tanggal Kadaluarsa *">
                <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  required className="input cursor-text" />
              </Field>
            </div>

            <Field label="Status *">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LicenseStatus })}
                className="input sm:max-w-[50%] cursor-pointer">
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div className="border-t border-[var(--border-subtle)]" />

          {/* Section 3: Dokumen Pendukung */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[var(--status-active)]" />
              </div>
              <h3 className="form-section-title !m-0 !p-0 !border-0 text-[var(--text-primary)]">Dokumen & Catatan</h3>
            </div>

            <Field label="Catatan Tambahan">
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Tambahkan keterangan spesifik, kendala, atau informasi penting lainnya..." rows={3} className="input resize-none py-3" />
            </Field>

            <Field label="Upload Dokumen (Opsional)">
              <div className="relative flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--accent-gradient-start)] transition-colors bg-[var(--bg-inset)] cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {form.fileName ? <FileText className="w-6 h-6 text-[var(--accent-gradient-start)]" /> : <Upload className="w-6 h-6 text-[var(--text-muted)] group-hover:text-[var(--accent-gradient-start)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[var(--text-primary)] truncate">{form.fileName || "Pilih file atau tarik ke sini"}</p>
                  <p className="text-[12px] font-medium text-[var(--text-muted)] mt-1">{form.fileName ? "Dokumen berhasil dilampirkan" : "Format yang didukung: PDF, JPG, PNG (Maks 10MB)"}</p>
                </div>
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setForm({ ...form, fileName: file.name, fileUrl: URL.createObjectURL(file) });
                  }}
                />
              </div>
            </Field>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border-subtle)] mt-8">
            <button type="button" onClick={onClose} className="btn-secondary px-6">Batal</button>
            <button type="submit" className="btn-primary px-8">
              <Save className="w-4.5 h-4.5" />
              {license ? "Simpan Perubahan" : "Simpan Lisensi Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-[var(--text-secondary)] mb-2">{label}</label>
      {children}
    </div>
  );
}
