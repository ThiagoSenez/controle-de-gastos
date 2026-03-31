import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd 'de' MMM", { locale: ptBR })
}

export function formatDateFull(date: Date | string): string {
  return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatMonth(month: number, year: number): string {
  return format(new Date(year, month - 1), 'MMMM yyyy', { locale: ptBR })
}

export function getMonthRange(date: Date = new Date()) {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  }
}

export function getLast6Months(): Array<{ month: number; year: number; label: string }> {
  const months = []
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    months.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: format(date, 'MMM', { locale: ptBR }),
    })
  }
  return months
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  WALLET: 'Carteira',
  CHECKING: 'Conta Corrente',
  SAVINGS: 'Poupança',
  INVESTMENT: 'Investimento',
}

export const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: 'Diário',
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensal',
  YEARLY: 'Anual',
}
