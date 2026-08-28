import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTipoBadgeStyles(tipo: string): string {
  const t = (tipo || '').toLowerCase();
  if (t.includes('prova') || t.includes('exame') || t.includes('avalia')) {
    return 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40';
  }
  if (t.includes('trabalho') || t.includes('projeto') || t.includes('apresenta')) {
    return 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40';
  }
  // Standard classes ("Aula normal", "Aula", "Evento", etc.) are now colored in emerald green
  return 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40';
}

export function getModalidadeBadgeStyles(modalidade: string): string {
  const m = (modalidade || '').toLowerCase();
  if (m.includes('ead')) {
    return 'bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/40';
  }
  if (m.includes('presencial')) {
    return 'bg-violet-50 text-violet-700 border-violet-200/60 dark:bg-violet-950/20 dark:text-violet-400 dark:border-violet-900/40';
  }
  return 'bg-neutral-50 text-neutral-600 border-neutral-200/60 dark:bg-neutral-800/40 dark:text-neutral-400 dark:border-neutral-700/40';
}

export function getFaseBadgeStyles(fase: string): string {
  const f = (fase || '').toLowerCase();
  if (f.includes('1') || f.includes('2')) {
    return 'bg-cyan-50 text-cyan-700 border-cyan-200/60 dark:bg-cyan-950/20 dark:text-cyan-400 dark:border-cyan-900/40';
  }
  if (f.includes('3') || f.includes('4')) {
    return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/60 dark:bg-fuchsia-950/20 dark:text-fuchsia-400 dark:border-fuchsia-900/40';
  }
  if (f.includes('5') || f.includes('6')) {
    return 'bg-orange-50 text-orange-700 border-orange-200/60 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40';
  }
  return 'bg-teal-50 text-teal-700 border-teal-200/60 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/40';
}

export function getDayFromHorario(horario: string): string {
  const h = (horario || '').toLowerCase();
  if (h.includes('segunda')) return 'Segunda-feira';
  if (h.includes('terça') || h.includes('terca')) return 'Terça-feira';
  if (h.includes('quarta')) return 'Quarta-feira';
  if (h.includes('quinta')) return 'Quinta-feira';
  if (h.includes('sexta')) return 'Sexta-feira';
  if (h.includes('sábado') || h.includes('sabado')) return 'Sábado';
  return 'Horário não informado';
}
