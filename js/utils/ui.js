// Tiny shared UI helpers.

let toastTimer;

/** Show a transient toast message at the bottom of the screen. */
export function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1600);
}

/** Escape text for safe insertion into innerHTML. */
export function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Render an empty-state block. */
export function emptyState(icon, text) {
  return `<div class="empty"><span class="empty-icon">${icon}</span>${esc(text)}</div>`;
}
