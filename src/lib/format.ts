/**
 * Shared formatters for dates, currency and CPF.
 */

/** Formats a value as date (pt-BR) or datetime. Use for table cells and detail views. */
export function formatDate(
  value: string | number | Date | null | undefined | unknown,
  options: { style?: 'date' | 'datetime'; locale?: string } = {},
): string {
  if (value == null || value === '') return '—'
  const v = value as string | number | Date
  const { style = 'datetime', locale = 'pt-BR' } = options
  try {
    const date = typeof v === 'object' && v !== null && 'getTime' in v ? (v as Date) : new Date(String(v))
    if (Number.isNaN(date.getTime())) return '—'
    return style === 'date'
      ? date.toLocaleDateString(locale)
      : date.toLocaleString(locale)
  } catch {
    return '—'
  }
}

/** Formats a numeric value as BRL currency (pt-BR). */
export function formatMoney(value: unknown): string {
  if (value == null) return '—'
  const num = Number(value)
  if (Number.isNaN(num)) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

/**
 * Formats CPF: 11 digits as XXX.XXX.XXX-XX; fewer digits as partial mask (for input).
 * Null/undefined/empty returns '—'.
 */
export function formatCpf(value: string | null | undefined): string {
  if (value == null) return '—'
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return '—'
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}
