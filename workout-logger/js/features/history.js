// "History" view — list of past workouts with summary + delete.

import * as state from '../core/state.js';
import { getExercise } from '../data/exercises.js';
import { formatDate } from '../utils/date.js';
import { totalVolume, num } from '../utils/format.js';
import { toast, esc, emptyState } from '../utils/ui.js';

function summarize(workout) {
  const names = workout.entries
    .map((e) => getExercise(e.exerciseId)?.name || e.exerciseId)
    .slice(0, 3);
  const extra = workout.entries.length - names.length;
  let text = names.join(', ');
  if (extra > 0) text += ` +${extra} more`;
  return text || 'No exercises';
}

export function render() {
  const view = document.getElementById('view');
  const workouts = state.getWorkouts();

  if (workouts.length === 0) {
    view.innerHTML = `<h1 class="page-title">History</h1>
      <div class="panel">${emptyState('📭', 'No workouts yet. Log one to get started!')}</div>`;
    return;
  }

  const rows = workouts
    .map((w) => {
      const vol = w.entries.reduce((sum, e) => sum + totalVolume(e.sets), 0);
      const sets = w.entries.reduce((sum, e) => sum + e.sets.length, 0);
      return `
        <div class="history-row">
          <div>
            <strong>${formatDate(w.date)}</strong>
            <div class="muted">${esc(summarize(w))}</div>
          </div>
          <div style="text-align:right">
            <div>${num(vol)} vol · ${sets} sets</div>
            <button class="btn btn-danger btn-sm" data-delete="${w.id}" style="margin-top:.35rem">Delete</button>
          </div>
        </div>`;
    })
    .join('');

  view.innerHTML = `<h1 class="page-title">History</h1><div class="panel">${rows}</div>`;

  view.querySelectorAll('[data-delete]').forEach((btn) =>
    btn.addEventListener('click', () => {
      if (confirm('Delete this workout? This cannot be undone.')) {
        state.deleteWorkout(btn.dataset.delete);
        toast('Workout deleted');
        render();
      }
    })
  );
}
