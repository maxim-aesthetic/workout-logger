// "Log" view — create today's workout and record exercises, sets, reps & weight.

import * as state from '../core/state.js';
import { groupedByMuscle, getExercise } from '../data/exercises.js';
import { todayISO, formatDate } from '../utils/date.js';
import { totalVolume, num } from '../utils/format.js';
import { toast, esc, emptyState } from '../utils/ui.js';

/** Find an existing workout for today, or null. */
function todaysWorkout() {
  return state.getWorkouts().find((w) => w.date === todayISO()) || null;
}

function exercisePicker() {
  const groups = groupedByMuscle();
  const opts = Object.entries(groups)
    .map(([muscle, list]) => {
      const inner = list.map((e) => `<option value="${e.id}">${esc(e.name)}</option>`).join('');
      return `<optgroup label="${esc(muscle)}">${inner}</optgroup>`;
    })
    .join('');
  return `<select id="exercisePicker">${opts}</select>`;
}

function renderEntry(workout, entry, index) {
  const ex = getExercise(entry.exerciseId);
  const rows = entry.sets
    .map(
      (s, si) => `
      <tr>
        <td>${si + 1}</td>
        <td><input type="number" inputmode="decimal" data-set="${index}:${si}:weight" value="${esc(s.weight)}" placeholder="kg" min="0" /></td>
        <td><input type="number" inputmode="numeric" data-set="${index}:${si}:reps" value="${esc(s.reps)}" placeholder="reps" min="0" /></td>
        <td><button class="btn btn-danger btn-sm" data-remove-set="${index}:${si}">✕</button></td>
      </tr>`
    )
    .join('');

  return `
    <div class="entry">
      <div class="entry-head">
        <div>
          <div class="entry-name">${esc(ex ? ex.name : entry.exerciseId)}</div>
          <div class="entry-muscle">${esc(ex ? ex.muscle : '')} · volume ${num(totalVolume(entry.sets))}</div>
        </div>
        <button class="btn btn-danger btn-sm" data-remove-entry="${index}">Remove</button>
      </div>
      <table class="sets-table">
        <thead><tr><th>#</th><th>Weight</th><th>Reps</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <button class="btn btn-ghost btn-sm" data-add-set="${index}" style="margin-top:.6rem">+ Add set</button>
    </div>`;
}

export function render() {
  const view = document.getElementById('view');
  const workout = todaysWorkout();

  if (!workout) {
    view.innerHTML = `
      <h1 class="page-title">Today · ${formatDate(todayISO())}</h1>
      <div class="panel">
        ${emptyState('💪', 'No workout logged today.')}
        <div style="text-align:center">
          <button class="btn btn-primary" id="startWorkout">Start a workout</button>
        </div>
      </div>`;
    document.getElementById('startWorkout').addEventListener('click', () => {
      state.createWorkout(todayISO());
      render();
    });
    return;
  }

  const entriesHtml = workout.entries.length
    ? workout.entries.map((e, i) => renderEntry(workout, e, i)).join('')
    : emptyState('➕', 'Add your first exercise below.');

  const sessionVolume = workout.entries.reduce((sum, e) => sum + totalVolume(e.sets), 0);

  view.innerHTML = `
    <h1 class="page-title">Today · ${formatDate(todayISO())}</h1>
    <div class="panel">
      <div class="stat-grid" style="margin-bottom:1rem">
        <div class="stat"><div class="stat-value">${workout.entries.length}</div><div class="stat-label">Exercises</div></div>
        <div class="stat"><div class="stat-value">${num(sessionVolume)}</div><div class="stat-label">Total volume</div></div>
      </div>
      <div class="row-inline">
        <div class="field" style="flex:2">
          <label>Add exercise</label>
          ${exercisePicker()}
        </div>
        <button class="btn btn-primary" id="addExercise">Add</button>
      </div>
    </div>
    ${entriesHtml}
  `;

  attachHandlers(workout.id);
}

function attachHandlers(workoutId) {
  const view = document.getElementById('view');

  document.getElementById('addExercise')?.addEventListener('click', () => {
    const id = document.getElementById('exercisePicker').value;
    state.addEntry(workoutId, id);
    render();
  });

  // Set field edits (silent save, no re-render to preserve focus)
  view.querySelectorAll('input[data-set]').forEach((input) => {
    input.addEventListener('input', () => {
      const [entryIdx, setIdx, field] = input.dataset.set.split(':');
      state.updateSet(workoutId, +entryIdx, +setIdx, field, input.value);
    });
  });

  view.querySelectorAll('[data-add-set]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.addSet(workoutId, +btn.dataset.addSet);
      render();
    })
  );

  view.querySelectorAll('[data-remove-set]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const [entryIdx, setIdx] = btn.dataset.removeSet.split(':');
      state.removeSet(workoutId, +entryIdx, +setIdx);
      render();
    })
  );

  view.querySelectorAll('[data-remove-entry]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.removeEntry(workoutId, +btn.dataset.removeEntry);
      toast('Exercise removed');
      render();
    })
  );
}
