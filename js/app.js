// App entry point: wires routes, export/import, and starts the router.

import * as router from './core/router.js';
import * as state from './core/state.js';
import * as storage from './core/storage.js';
import { toast } from './utils/ui.js';

import { render as renderLog } from './features/workout.js';
import { render as renderHistory } from './features/history.js';
import { render as renderProgress } from './features/progress.js';
import { render as renderPRs } from './features/prs.js';

// --- Routes ---
router.register('log', renderLog);
router.register('history', renderHistory);
router.register('progress', renderProgress);
router.register('prs', renderPRs);
router.setNotFound(renderLog);

// --- Export / Import ---
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');

exportBtn.addEventListener('click', () => {
  const blob = new Blob([storage.exportJSON(state.getData())], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `workout-log-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Data exported');
});

importBtn.addEventListener('click', () => importFile.click());

importFile.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = storage.parseImport(text);
    if (confirm('Importing will replace your current data. Continue?')) {
      state.replaceAll(data);
      toast('Data imported');
      router.start();
      location.reload();
    }
  } catch (err) {
    toast('Import failed: ' + err.message);
  } finally {
    importFile.value = '';
  }
});

// --- Start ---
router.start();
