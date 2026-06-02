// Formatting + small fitness math helpers.

/** Compact number formatting (e.g. 12,500). */
export function num(n) {
  if (!isFinite(n)) return '0';
  return Math.round(n).toLocaleString('en-US');
}

/** Total volume of a single set = weight * reps. */
export function setVolume(set) {
  return (Number(set.weight) || 0) * (Number(set.reps) || 0);
}

/** Total volume across an array of sets. */
export function totalVolume(sets) {
  return sets.reduce((sum, s) => sum + setVolume(s), 0);
}

/**
 * Estimated one-rep max using the Epley formula.
 * 1RM = weight * (1 + reps / 30)
 */
export function estimate1RM(weight, reps) {
  const w = Number(weight) || 0;
  const r = Number(reps) || 0;
  if (r <= 0) return 0;
  if (r === 1) return w;
  return w * (1 + r / 30);
}

/** Short unique id. */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
