// Thin LocalStorage wrapper with JSON (de)serialization and a schema version.

const KEY = 'workout-logger:v1';

const DEFAULT_DATA = {
  version: 1,
  workouts: [], // [{ id, date, entries: [{ exerciseId, sets: [{ weight, reps }] }] }]
};

/** Load the full data object from storage (returns defaults if empty/corrupt). */
export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.workouts)) return structuredClone(DEFAULT_DATA);
    return parsed;
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

/** Persist the full data object. */
export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

/** Serialize current data to a downloadable JSON string. */
export function exportJSON(data) {
  return JSON.stringify(data, null, 2);
}

/** Validate + parse an imported JSON string. Throws on invalid shape. */
export function parseImport(text) {
  const parsed = JSON.parse(text);
  if (!parsed || !Array.isArray(parsed.workouts)) {
    throw new Error('Invalid file: missing "workouts" array');
  }
  return { version: 1, workouts: parsed.workouts };
}
