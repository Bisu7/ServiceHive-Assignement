import type { ILead } from '@leadflow/shared'
import { formatDate, formatCurrency } from './formatDate'
import { LEAD_STATUS_LABELS, LEAD_SOURCE_LABELS } from '@/types/lead.types'

/**
 * Converts a list of leads to a downloadable CSV file and triggers a browser download.
 * Uses the File System Access API pattern for broad compatibility.
 */
export function exportLeadsToCsv(leads: ILead[], filename = 'leads-export'): void {
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Value', 'Created At']

  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.phone ?? '',
    lead.company ?? '',
    LEAD_STATUS_LABELS[lead.status],
    LEAD_SOURCE_LABELS[lead.source],
    formatCurrency(lead.value ?? null),
    formatDate(lead.createdAt),
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
