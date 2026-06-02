// "Progress" view — weekly volume trend + per-exercise weight progression.

import * as state from '../core/state.js';
import { EXERCISES, getExercise } from '../data/exercises.js';
import { lineChart } from './charts.js';
import { totalVolume, estimate1RM, num } from '../utils/format.js';
import { esc, emptyState } from '../utils/ui.js';

/** Aggregate total training volume per workout date (chronological). */
function volumeSeries() {
  return state
    .getWorkouts()
    .slice()
    .reverse() // oldest -> newest
    .map((w) => ({
      label: w.date.slice(5), // MM-DD
      value: w.entries.reduce((sum, e) => sum + totalVolume(e.sets), 0),
    }));
}

/** Best estimated 1RM per session for a given exercise (chronological). */
function exerciseSeries(exerciseId) {
  const out = [];
  for (const w of state.getWorkouts().slice().reverse()) {
    let best = 0;
    for (const entry of w.entries) {
      if (entry.exerciseId !== exerciseId) continue;
      for (const s of entry.sets) {
        best = Math.max(best, estimate1RM(s.weight, s.reps));
      }
    }
    if (best > 0) out.push({ label: w.date.slice(5), value: best });
  }
  return out;
}

/** Exercises that actually have logged data, for the selector. */
function loggedExerciseIds() {
  const ids = new Set();
  for (const w of state.getWorkouts()) {
    for (const e of w.entries) {
      if (e.sets.some((s) => Number(s.weight) > 0 && Number(s.reps) > 0)) ids.add(e.exerciseId);
    }
  }
  return [...ids];
}

export function render() {
  const view = document.getElementById('view');
  const workouts = state.getWorkouts();

  if (workouts.length === 0) {
    view.innerHTML = `<h1 class="page-title">Progress</h1>
      <div class="panel">${emptyState('📈', 'No data yet. Log a few workouts to see trends.')}</div>`;
    return;
  }

  const logged = loggedExerciseIds();
  const options = logged
    .map((id) => `<option value="${id}">${esc(getExercise(id)?.name || id)}</option>`)
    .join('');

  const totalVol = workouts.reduce(
    (sum, w) => sum + w.entries.reduce((s, e) => s + totalVolume(e.sets), 0),
    0
  );

  view.innerHTML = `
    <h1 class="page-title">Progress</h1>
    <div class="stat-grid" style="margin-bottom:1.25rem">
      <div class="stat"><div class="stat-value">${workouts.length}</div><div class="stat-label">Workouts</div></div>
      <div class="stat"><div class="stat-value">${num(totalVol)}</div><div class="stat-label">Lifetime volume</div></div>
    </div>

    <div class="panel">
      <div class="section-title" style="margin-top:0">Volume per session</div>
      <canvas id="volumeChart"></canvas>
    </div>

    <div class="panel">
      <div class="row-inline" style="margin-bottom:1rem">
        <div class="field" style="flex:2">
          <label>Exercise progression (est. 1RM)</label>
          <select id="exerciseSelect">${options || '<option>No data</option>'}</select>
        </div>
      </div>
      <canvas id="exerciseChart"></canvas>
    </div>
  `;

  lineChart(document.getElementById('volumeChart'), volumeSeries());

  const sel = document.getElementById('exerciseSelect');
  const drawExercise = () => lineChart(document.getElementById('exerciseChart'), exerciseSeries(sel.value));
  if (logged.length) {
    drawExercise();
    sel.addEventListener('change', drawExercise);
  }

  // Redraw on resize so canvas stays crisp.
  window.addEventListener('resize', () => {
    lineChart(document.getElementById('volumeChart'), volumeSeries());
    if (logged.length) drawExercise();
  }, { once: true });
}
