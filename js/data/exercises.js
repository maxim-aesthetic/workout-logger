// Built-in exercise library, grouped by primary muscle group.
// Each exercise has a stable id used to link sets across workouts.

export const EXERCISES = [
  // Chest
  { id: 'bench-press', name: 'Barbell Bench Press', muscle: 'Chest' },
  { id: 'incline-db-press', name: 'Incline Dumbbell Press', muscle: 'Chest' },
  { id: 'chest-fly', name: 'Cable Chest Fly', muscle: 'Chest' },
  { id: 'push-up', name: 'Push-Up', muscle: 'Chest' },

  // Back
  { id: 'deadlift', name: 'Deadlift', muscle: 'Back' },
  { id: 'pull-up', name: 'Pull-Up', muscle: 'Back' },
  { id: 'bent-row', name: 'Barbell Bent-Over Row', muscle: 'Back' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscle: 'Back' },

  // Legs
  { id: 'squat', name: 'Barbell Back Squat', muscle: 'Legs' },
  { id: 'leg-press', name: 'Leg Press', muscle: 'Legs' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscle: 'Legs' },
  { id: 'lunge', name: 'Walking Lunge', muscle: 'Legs' },
  { id: 'leg-curl', name: 'Leg Curl', muscle: 'Legs' },
  { id: 'calf-raise', name: 'Calf Raise', muscle: 'Legs' },

  // Shoulders
  { id: 'ohp', name: 'Overhead Press', muscle: 'Shoulders' },
  { id: 'lateral-raise', name: 'Lateral Raise', muscle: 'Shoulders' },
  { id: 'face-pull', name: 'Face Pull', muscle: 'Shoulders' },

  // Arms
  { id: 'barbell-curl', name: 'Barbell Curl', muscle: 'Arms' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', muscle: 'Arms' },
  { id: 'hammer-curl', name: 'Hammer Curl', muscle: 'Arms' },

  // Core
  { id: 'plank', name: 'Plank', muscle: 'Core' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', muscle: 'Core' },
  { id: 'cable-crunch', name: 'Cable Crunch', muscle: 'Core' },
];

const byId = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));

/** Look up an exercise by id. */
export function getExercise(id) {
  return byId[id];
}

/** Exercises grouped into { muscle: [exercise, ...] }. */
export function groupedByMuscle() {
  const groups = {};
  for (const ex of EXERCISES) {
    (groups[ex.muscle] ||= []).push(ex);
  }
  return groups;
}
