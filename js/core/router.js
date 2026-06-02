// Minimal hash-based router. Routes map a name to a render function.

const routes = new Map();
let notFound = null;

export function register(name, renderFn) {
  routes.set(name, renderFn);
}

export function setNotFound(fn) {
  notFound = fn;
}

/** Current route name parsed from location.hash (default: "log"). */
export function current() {
  const hash = location.hash.replace(/^#\/?/, '');
  return hash.split('/')[0] || 'log';
}

/** Navigate programmatically. */
export function go(name) {
  location.hash = `#/${name}`;
}

function render() {
  const name = current();
  const fn = routes.get(name) || notFound;
  // Highlight active nav link
  document.querySelectorAll('[data-route]').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === name);
  });
  if (fn) fn();
}

/** Start listening for hash changes and render the first route. */
export function start() {
  window.addEventListener('hashchange', render);
  if (!location.hash) location.hash = '#/log';
  else render();
}
