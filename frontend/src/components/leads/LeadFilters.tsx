import { Dropdown } from '@/components/ui/Dropdown'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { LeadStatus, LeadSource } from '@leadflow/shared'
import { LEAD_STATUS_LABELS, LEAD_SOURCE_LABELS } from '@/types/lead.types'
import { useLeadsStore } from '@/store/leadsStore'
import { useDebounce } from '@/hooks/useDebounce'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const statusOptions = [
  { value: '', label: 'All statuses' },
  ...Object.values(LeadStatus).map((v) => ({ value: v, label: LEAD_STATUS_LABELS[v] })),
]

const sourceOptions = [
  { value: '', label: 'All sources' },
  ...Object.values(LeadSource).map((v) => ({ value: v, label: LEAD_SOURCE_LABELS[v] })),
]

/** Filter bar for the leads list — status, source, and full-text search */
export function LeadFilters() {
  const { filters, setFilters } = useLeadsStore()
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debouncedSearch = useDebounce(searchInput, 400)

  // Sync debounced search value into the store
  useEffect(() => {
    setFilters({ search: debouncedSearch || undefined })
  }, [debouncedSearch, setFilters])

  const hasActiveFilters = filters.status || filters.source || filters.search

  return (
    <div className="flex flex-wrap items-end gap-3">
      <Input
        id="lead-search"
        placeholder="Search by name, email, company…"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="min-w-[220px]"
      />
      <Dropdown
        id="lead-status-filter"
        label=""
        options={statusOptions}
        value={filters.status ?? ''}
        onChange={(v) => setFilters({ status: (v as LeadStatus) || undefined })}
        placeholder="All statuses"
      />
      <Dropdown
        id="lead-source-filter"
        label=""
        options={sourceOptions}
        value={filters.source ?? ''}
        onChange={(v) => setFilters({ source: (v as LeadSource) || undefined })}
        placeholder="All sources"
      />
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setFilters({ status: undefined, source: undefined, search: undefined }); setSearchInput('') }}
          aria-label="Clear all filters"
        >
          <X className="h-4 w-4" aria-hidden />
          Clear
        </Button>
      )}
    </div>
  )
}
