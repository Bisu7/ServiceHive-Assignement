import { useState, useCallback } from 'react'

// Custom hook to sync state with localStorage.
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
        // Ignore write errors (e.g. storage quota exceeded)
      }
    },
    [key]
  )

  return [storedValue, setValue]
}
