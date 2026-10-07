export function readStored(key: string): unknown {
  try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : null; } catch { return null; }
}
export function saveStored(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Continue with in-memory preferences. */ }
}
