import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getStatusBadge(status: string): string {
  switch (status) {
    case 'Aktif':
      return 'badge badge-aktif';
    case 'Akan Kadaluarsa':
      return 'badge badge-akan';
    case 'Kadaluarsa':
      return 'badge badge-expired';
    case 'Non-aktif':
      return 'badge badge-nonaktif';
    default:
      return 'badge badge-nonaktif';
  }
}

export function getCategoryBadge(category: string): string {
  switch (category) {
    case 'Software':
      return 'badge badge-software';
    case 'Izin Usaha & Legalitas':
      return 'badge badge-izin';
    case 'Sertifikasi Profesi':
      return 'badge badge-sertifikasi';
    default:
      return 'badge badge-nonaktif';
  }
}

// Keep old functions for backward compatibility
export function getStatusColor(status: string): string {
  return getStatusBadge(status);
}

export function getCategoryColor(category: string): string {
  return getCategoryBadge(category);
}
