// Central app state with a tiny pub/sub. Mutations persist automatically.

import * as storage from './storage.js';
import { uid } from '../utils/format.js';

let data = storage.load();
const listeners = new Set();

/** Subscribe to state changes. Returns an unsubscribe function. */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function commit() {
  storage.save(data);
  listeners.forEach((fn) => fn(data));
}

/** All workouts, newest first. */
export function getWorkouts() {
  return [...data.workouts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getWorkout(id) {
  return data.workouts.find((w) => w.id === id);
}

/** Create a new workout for a given date and return it. */
export function createWorkout(date) {
  const workout = { id: uid(), date, entries: [] };
  data.workouts.push(workout);
  commit();
  return workout;
}

export function deleteWorkout(id) {
  data.workouts = data.workouts.filter((w) => w.id !== id);
  commit();
}

/** Add an exercise entry to a workout. */
export function addEntry(workoutId, exerciseId) {
  const w = getWorkout(workoutId);
  if (!w) return;
  w.entries.push({ exerciseId, sets: [{ weight: '', reps: '' }] });
  commit();
}

export function removeEntry(workoutId, index) {
  const w = getWorkout(workoutId);
  if (!w) return;
  w.entries.splice(index, 1);
  commit();
}

export function addSet(workoutId, entryIndex) {
  const w = getWorkout(workoutId);
  if (!w) return;
  const entry = w.entries[entryIndex];
  const last = entry.sets[entry.sets.length - 1];
  // Pre-fill from the previous set to speed up logging.
  entry.sets.push({ weight: last ? last.weight : '', reps: last ? last.reps : '' });
  commit();
}

export function removeSet(workoutId, entryIndex, setIndex) {
  const w = getWorkout(workoutId);
  if (!w) return;
  w.entries[entryIndex].sets.splice(setIndex, 1);
  commit();
}

/** Update a single set field without re-rendering the whole tree. */
export function updateSet(workoutId, entryIndex, setIndex, field, value) {
  const w = getWorkout(workoutId);
  if (!w) return;
  w.entries[entryIndex].sets[setIndex][field] = value;
  storage.save(data); // silent save — no re-render to keep inputs focused
}

/** Replace all data (used by import). */
export function replaceAll(newData) {
  data = newData;
  commit();
}

export function getData() {
  return data;
}
