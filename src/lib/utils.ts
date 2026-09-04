import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDateBR(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'Dominado':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'Instável':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'Ponto Cego':
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse';
    default:
      return 'bg-slate-700/20 text-slate-400 border-slate-700/30';
  }
}

export function getAccuracyBadgeColor(accuracy: number) {
  if (accuracy >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  if (accuracy >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
}
