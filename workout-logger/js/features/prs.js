// "PRs" view — personal records per exercise (heaviest set + estimated 1RM).

import * as state from '../core/state.js';
import { getExercise } from '../data/exercises.js';
import { estimate1RM, num } from '../utils/format.js';
import { formatDate } from '../utils/date.js';
import { esc, emptyState } from '../utils/ui.js';

/**
 * Compute personal records across all workouts.
 * Returns a map: exerciseId -> { maxWeight, bestSet, best1RM, date }
 */
export function computePRs() {
  const prs = {};
  for (const w of state.getWorkouts()) {
    for (const entry of w.entries) {
      for (const s of entry.sets) {
        const weight = Number(s.weight) || 0;
        const reps = Number(s.reps) || 0;
        if (weight <= 0 || reps <= 0) continue;

        const oneRM = estimate1RM(weight, reps);
        const rec = (prs[entry.exerciseId] ||= { maxWeight: 0, best1RM: 0, bestSet: null, date: w.date });

        if (weight > rec.maxWeight) {
          rec.maxWeight = weight;
          rec.bestSet = { weight, reps };
          rec.date = w.date;
        }
        if (oneRM > rec.best1RM) rec.best1RM = oneRM;
      }
    }
  }
  return prs;
}

export function render() {
  const view = document.getElementById('view');
  const prs = computePRs();
  const ids = Object.keys(prs);

  if (ids.length === 0) {
    view.innerHTML = `<h1 class="page-title">Personal Records</h1>
      <div class="panel">${emptyState('🏆', 'Log some sets with weight & reps to see your PRs.')}</div>`;
    return;
  }

  // Sort by estimated 1RM, strongest lifts first.
  ids.sort((a, b) => prs[b].best1RM - prs[a].best1RM);

  const rows = ids
    .map((id) => {
      const ex = getExercise(id);
      const r = prs[id];
      return `
        <div class="pr-row">
          <div>
            <strong>${esc(ex ? ex.name : id)}</strong>
            <div class="muted">Best: ${num(r.bestSet.weight)} × ${r.bestSet.reps} · ${formatDate(r.date)}</div>
          </div>
          <div style="text-align:right">
            <div class="stat-value" style="font-size:1.2rem">${num(r.best1RM)}</div>
            <div class="muted">est. 1RM</div>
          </div>
        </div>`;
    })
    .join('');

  view.innerHTML = `
    <h1 class="page-title">Personal Records</h1>
    <p class="muted" style="margin-bottom:1rem">Estimated 1RM uses the Epley formula: weight × (1 + reps / 30).</p>
    <div class="panel">${rows}</div>`;
}
