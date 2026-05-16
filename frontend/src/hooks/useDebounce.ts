import { useEffect, useState } from 'react'

/**
 * Debounces a value — useful for search inputs to avoid firing an API request
 * on every keystroke.
 *
 * @param value - The value to debounce
 * @param delay - Milliseconds to wait after the last change (default 400ms)
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
