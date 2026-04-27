import { HealthLogInput } from '../types/models';

export function normalizeDateString(value: string) {
  if (!value.trim()) {
    return new Date().toISOString();
  }
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export function formatDateTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
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

export function nowIso() {
  return new Date().toISOString();
}

export function safeNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatWeightLabel(weight: number, unit: string) {
  return `${weight} ${unit}`;
}

export function summarizeHealthLog(input: HealthLogInput) {
  const parts = [input.symptoms, input.notes, input.injuries].filter(Boolean);
  return parts.join(' • ') || `${input.mood} mood, ${input.energyLevel} energy`;
}

export function formatBirthday(value: string) {
  return value || 'Birthday not set';
}

export function formatPhone(value: string) {
  return value || 'No phone';
}
