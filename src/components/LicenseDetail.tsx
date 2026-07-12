"use client";

import {
  X, Download, Calendar, User, Building, Hash,
  FileText, Tag, Clock, StickyNote,
} from "lucide-react";
import { License } from "@/lib/mockData";
import { formatDate, getDaysUntilExpiry, getStatusColor, getCategoryColor } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

interface LicenseDetailProps {
  isOpen: boolean;
  onClose: () => void;
  license: License | null;
}

export default function LicenseDetail({ isOpen, onClose, license }: LicenseDetailProps) {
  const { t } = useLanguage();
  if (!isOpen || !license) return null;

  const days = getDaysUntilExpiry(license.expiryDate);
  const isExpired = days < 0;
  const isUrgent = days >= 0 && days <= 30;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="headline-md leading-tight mb-3">{license.name}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={getStatusColor(license.status)}>{license.status}</span>
              <span className={getCategoryColor(license.category)}>{license.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Expiry Banner */}
        <div
          className={`p-4 rounded-2xl mb-6 flex items-center gap-3 border shadow-sm ${
            isExpired
              ? "bg-[var(--status-expired-bg)] border-[rgba(239,68,68,0.2)]"
              : isUrgent
              ? "bg-[var(--status-expiring-bg)] border-[rgba(245,158,11,0.2)]"
              : "bg-[var(--status-active-bg)] border-[rgba(16,185,129,0.2)]"
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isExpired ? "bg-[rgba(239,68,68,0.15)]" : isUrgent ? "bg-[rgba(245,158,11,0.15)]" : "bg-[rgba(16,185,129,0.15)]"
          }`}>
            <Clock className={`w-5 h-5 ${
              isExpired ? "text-[var(--status-expired)]" : isUrgent ? "text-[var(--status-expiring)]" : "text-[var(--status-active)]"
            }`} />
          </div>
          <span className={`text-[14px] font-bold ${
            isExpired ? "text-[var(--status-expired)]" : isUrgent ? "text-[var(--status-expiring)]" : "text-[var(--status-active)]"
          }`}>
            {isExpired
              ? t("detail.expired_ago", { days: Math.abs(days) })
              : t("detail.days_until_expiry", { days: days })}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <DetailItem icon={Hash} label={t("modal.field_number").replace(" *", "")} value={license.licenseNumber} />
          <DetailItem icon={User} label={t("modal.field_owner").replace(" *", "")} value={license.owner} />
          <DetailItem icon={Building} label={t("modal.field_vendor").replace(" *", "")} value={license.vendor} />
          <DetailItem icon={Tag} label={t("modal.field_category").replace(" *", "")} value={license.category} />
          <DetailItem icon={Calendar} label={t("modal.field_issue_date").replace(" *", "")} value={formatDate(license.issueDate)} />
          <DetailItem icon={Calendar} label={t("modal.field_expiry_date").replace(" *", "")} value={formatDate(license.expiryDate)} />
        </div>

        {/* Notes */}
        {license.notes && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <StickyNote className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t("detail.notes")}</span>
            </div>
            <p className="text-[14px] font-medium text-[var(--text-primary)] leading-relaxed p-4 rounded-2xl bg-[var(--bg-inset)] border border-[var(--border-subtle)]">
              {license.notes}
            </p>
          </div>
        )}

        {license.fileName && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
               <FileText className="w-4 h-4 text-[var(--text-muted)]" />
               <span className="text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t("detail.document")}</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-inset)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 text-[var(--accent-gradient-start)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[var(--text-primary)] truncate">{license.fileName}</p>
                <p className="text-[12px] font-medium text-[var(--text-muted)] mt-0.5">{t("detail.official_file")}</p>
              </div>
              <a href={license.fileUrl !== '#' ? license.fileUrl : '#'} target="_blank" rel="noopener noreferrer" className="btn-secondary text-[13px] py-2 px-4 shadow-sm inline-flex items-center gap-2">
                <Download className="w-4 h-4" /> {t("detail.download")}
              </a>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
          <button onClick={onClose} className="btn-secondary w-full py-3 text-[14px]">
            {t("detail.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-[var(--bg-inset)] border border-[var(--border-subtle)] transition-all hover:border-[var(--border-hover)] hover:shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[var(--text-muted)]" />
        <span className="text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-[14px] text-[var(--text-primary)] font-bold">{value}</p>
    </div>
  );
}
