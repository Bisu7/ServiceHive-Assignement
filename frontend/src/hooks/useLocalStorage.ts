import { useState, useCallback } from 'react'

/**
 * Syncs state to localStorage with automatic JSON serialisation.
 * Falls back gracefully if localStorage is unavailable (e.g., in private browsing).
 *
 * @param key - localStorage key
 * @param initialValue - default value if key is not found
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T): void => {
      try {
        setStoredValue(value)
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // Silently ignore write errors (e.g., storage quota exceeded)
      }
    },
    [key]
  )

  return [storedValue, setValue]
}
