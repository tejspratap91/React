/**
 * localStorage Utility Functions
 * Common utilities for managing localStorage across the application
 */

/**
 * Save data to localStorage
 * @param key - The localStorage key
 * @param data - The data to save (will be JSON stringified)
 */
export const saveToLocalStorage = <T,>(key: string, data: T): void => {
  try {
    const serialized = JSON.stringify(data)
    window.localStorage.setItem(key, serialized)
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
  }
}

/**
 * Retrieve data from localStorage
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist or error occurs
 * @returns The parsed data or default value
 */
export const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return defaultValue
  }
}

/**
 * Remove an item from localStorage
 * @param key - The localStorage key
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error)
  }
}

/**
 * Clear all localStorage
 * Warning: This clears all localStorage data for the application
 */
export const clearAllLocalStorage = (): void => {
  try {
    window.localStorage.clear()
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * Check if localStorage is available
 * @returns true if localStorage is available and accessible
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__'
    window.localStorage.setItem(test, test)
    window.localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Get the size of a specific key in localStorage (in bytes)
 * @param key - The localStorage key
 * @returns Size in bytes
 */
export const getLocalStorageItemSize = (key: string): number => {
  const item = window.localStorage.getItem(key)
  return item ? new Blob([item]).size : 0
}

/**
 * Get total localStorage usage (in bytes)
 * @returns Total size in bytes
 */
export const getTotalLocalStorageSize = (): number => {
  let total = 0
  for (let key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      total += getLocalStorageItemSize(key)
    }
  }
  return total
}

/**
 * Get all keys in localStorage
 * @returns Array of all localStorage keys
 */
export const getAllLocalStorageKeys = (): string[] => {
  const keys: string[] = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (key) keys.push(key)
  }
  return keys
}
