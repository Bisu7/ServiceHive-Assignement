import React, { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../ui/Input'
import { Dropdown } from '../ui/Dropdown'
import { Button } from '../ui/Button'
import { useLeadsStore } from '@/store/leadsStore'
import { useDebounce } from '@/hooks/useDebounce'
import { LeadStatus, LeadSource } from '@leadflow/shared'

export function LeadFilters() {
  const filters = useLeadsStore((state) => state.filters)
  const setFilter = useLeadsStore((state) => state.setFilter)
  const clearFilters = useLeadsStore((state) => state.clearFilters)

  const [localSearch, setLocalSearch] = useState(filters.search || '')
  const debouncedSearch = useDebounce(localSearch, 400)
  const [isSearching, setIsSearching] = useState(false)

  // Sync local input with store when search changes externally (e.g. on clear)
  useEffect(() => {
    setLocalSearch(filters.search || '')
  }, [filters.search])

  // Toggle debouncing loading border pulse when user types
  useEffect(() => {
    if (localSearch !== (filters.search || '')) {
      setIsSearching(true)
    }
  }, [localSearch, filters.search])

  // Sync debounced value with store
  useEffect(() => {
    // Only call setFilter if the value actually changed to prevent double renders
    if (debouncedSearch !== (filters.search || '')) {
      setFilter('search', debouncedSearch || undefined)
    }
    setIsSearching(false)
  }, [debouncedSearch, filters.search, setFilter])

  const handleFilterChange = (key: 'status' | 'source', value: string) => {
    setFilter(key, (value as any) || undefined)
  }

  const statusOptions = [
    { label: 'All Statuses', value: '' },
    ...Object.values(LeadStatus).map((s) => ({
      label: s.toUpperCase(),
      value: s,
    })),
  ]

  const sourceOptions = [
    { label: 'All Sources', value: '' },
    ...Object.values(LeadSource).map((s) => ({
      label: s.toUpperCase(),
      value: s,
    })),
  ]

  const hasActiveFilters = !!(filters.search || filters.status || filters.source)

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 w-full bg-obsidian-700 p-4 border border-white/[0.05] rounded-xl">
      <div className="flex-1">
        <Input
          label="Search Leads"
          placeholder="Search by name or email..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          leftIcon={<Search size={16} />}
          className={isSearching ? 'animate-pulse-accent' : undefined}
        />
      </div>
      <div className="w-full md:w-48">
        <Dropdown
          label="Filter Status"
          value={filters.status || ''}
          onChange={(val) => handleFilterChange('status', val)}
          options={statusOptions}
        />
      </div>
      <div className="w-full md:w-48">
        <Dropdown
          label="Filter Source"
          value={filters.source || ''}
          onChange={(val) => handleFilterChange('source', val)}
          options={sourceOptions}
        />
      </div>
      {hasActiveFilters && (
        <Button
          variant="secondary"
          onClick={() => {
            clearFilters()
            setLocalSearch('')
          }}
          icon={<X size={14} />}
          className="flex-shrink-0"
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}

export default LeadFilters
