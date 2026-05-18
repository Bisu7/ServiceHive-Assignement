// Formats date into a human-readable format.

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const DATETIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(isoString: string | undefined | null): string {
  if (!isoString) return 'N/A'
  return DATE_FORMATTER.format(new Date(isoString))
}

export function formatDateTime(isoString: string | undefined | null): string {
  if (!isoString) return 'N/A'
  return DATETIME_FORMATTER.format(new Date(isoString))
}

// Formats a number as USD currency
export function formatCurrency(value: number | undefined | null): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}
