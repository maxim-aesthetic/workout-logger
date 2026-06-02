// Dependency-free line chart rendered on a <canvas>, tuned for the dark theme.

const COLORS = {
  axis: '#2d323d',
  text: '#9aa0aa',
  line: '#6c8cff',
  point: '#8aa2ff',
  fill: 'rgba(108,140,255,0.12)',
};

/**
 * Draw a line chart.
 * @param {HTMLCanvasElement} canvas
 * @param {{label:string, value:number}[]} points - left-to-right order
 * @param {{unit?:string}} [opts]
 */
export function lineChart(canvas, points, opts = {}) {
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 600;
  const cssH = 240;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssW, cssH);

  const pad = { top: 20, right: 16, bottom: 34, left: 48 };
  const plotW = cssW - pad.left - pad.right;
  const plotH = cssH - pad.top - pad.bottom;

  if (points.length === 0) {
    ctx.fillStyle = COLORS.text;
    ctx.font = '14px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No data yet', cssW / 2, cssH / 2);
    return;
  }

  const values = points.map((p) => p.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const x = (i) => pad.left + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const y = (v) => pad.top + plotH - ((v - min) / range) * plotH;

  // Y gridlines + labels
  ctx.strokeStyle = COLORS.axis;
  ctx.fillStyle = COLORS.text;
  ctx.font = '11px -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const ticks = 4;
  for (let t = 0; t <= ticks; t++) {
    const v = min + (range * t) / ticks;
    const yy = y(v);
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(cssW - pad.right, yy);
    ctx.stroke();
    ctx.fillText(Math.round(v).toLocaleString('en-US'), pad.left - 8, yy);
  }

  // Area fill
  ctx.beginPath();
  points.forEach((p, i) => (i ? ctx.lineTo(x(i), y(p.value)) : ctx.moveTo(x(i), y(p.value))));
  ctx.lineTo(x(points.length - 1), pad.top + plotH);
  ctx.lineTo(x(0), pad.top + plotH);
  ctx.closePath();
  ctx.fillStyle = COLORS.fill;
  ctx.fill();

  // Line
  ctx.beginPath();
  points.forEach((p, i) => (i ? ctx.lineTo(x(i), y(p.value)) : ctx.moveTo(x(i), y(p.value))));
  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Points
  ctx.fillStyle = COLORS.point;
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(p.value), 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // X labels (thin out if many)
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const step = Math.ceil(points.length / 6);
  points.forEach((p, i) => {
    if (i % step === 0 || i === points.length - 1) {
      ctx.fillText(p.label, x(i), pad.top + plotH + 8);
    }
  });
}
