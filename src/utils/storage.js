export function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function readList(key) {
  const value = readStorage(key, []);
  return Array.isArray(value) ? value : [];
}
