import { DueStatus, HealthLogInput } from '../types/models';

export function nowIso() {
  return new Date().toISOString();
}

export function normalizeDateString(value: string) {
  if (!value.trim()) {
    return nowIso();
  }
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? nowIso() : parsed.toISOString();
}

export function normalizeDateOnly(value: string) {
  if (!value.trim()) {
    return '';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.trim();
  }
  return parsed.toISOString().slice(0, 10);
}

export function toMiddayIso(value: string) {
  const dateOnly = normalizeDateOnly(value);
  return dateOnly ? `${dateOnly}T12:00:00.000Z` : nowIso();
}

export function formatDateTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString(undefined, { dateStyle: 'medium' });
}

export function formatRelativeDate(value: string) {
  const parsed = new Date(value);
  const now = new Date();
  const ms = parsed.getTime() - now.getTime();
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days > 1) return `In ${days} days`;
  if (days === -1) return 'Yesterday';
  return `${Math.abs(days)} days ago`;
}

export function addHours(value: string, hours: number) {
  const parsed = new Date(value);
  parsed.setHours(parsed.getHours() + hours);
  return parsed.toISOString();
}

export function addDays(value: string, days: number) {
  const parsed = new Date(value);
  parsed.setDate(parsed.getDate() + days);
  return parsed.toISOString();
}

export function safeNumber(value: string | number, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatWeightLabel(weight: number, unit: string) {
  const rounded = Number.isInteger(weight) ? String(weight) : weight.toFixed(1);
  return `${rounded} ${unit}`;
}

export function summarizeHealthLog(input: HealthLogInput) {
  const parts = [
    input.symptoms.trim(),
    input.notes.trim(),
    input.injuries.trim(),
    input.vomiting.trim() && input.vomiting.trim().toLowerCase() !== 'none' ? `Vomiting: ${input.vomiting.trim()}` : '',
    input.coughing.trim() && input.coughing.trim().toLowerCase() !== 'none' ? `Coughing: ${input.coughing.trim()}` : '',
    input.itching.trim() && input.itching.trim().toLowerCase() !== 'none' ? `Itching: ${input.itching.trim()}` : '',
  ].filter(Boolean);
  return parts.join(' • ') || `${input.mood} mood, ${input.energyLevel} energy`;
}

export function formatBirthday(value: string) {
  return value || 'Birthday not set';
}

export function formatPhone(value: string) {
  return value || 'No phone';
}

export function getDueStatus(date: string, completedAt?: string): DueStatus {
  if (completedAt) {
    return 'completed';
  }
  const due = new Date(date);
  const now = new Date();
  if (Number.isNaN(due.getTime())) {
    return 'upcoming';
  }
  if (due < startOfToday()) {
    return 'overdue';
  }
  if (isSameDay(due, now)) {
    return 'dueToday';
  }
  return 'upcoming';
}

export function getVaccineStatus(expiresAt: string): DueStatus {
  if (!expiresAt) {
    return 'current';
  }
  const expires = new Date(expiresAt);
  if (Number.isNaN(expires.getTime())) {
    return 'current';
  }
  if (expires < startOfToday()) {
    return 'expired';
  }
  const days = daysBetween(nowIso(), expires.toISOString());
  if (days <= 30) {
    return 'expiringSoon';
  }
  return 'current';
}

export function daysBetween(from: string, to: string) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  return Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function isWithinLastDays(value: string, days: number) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }
  return parsed.getTime() >= Date.now() - days * 24 * 60 * 60 * 1000;
}

export function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function endOfWeekFromToday() {
  const end = startOfToday();
  end.setDate(end.getDate() + 7);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function matchesSearch(search: string, ...values: string[]) {
  const normalized = search.trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  return values.some((value) => value.toLowerCase().includes(normalized));
}
