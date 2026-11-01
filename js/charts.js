/* charts.js — animated numbers and live voting bars (no library) */
window.Charts = (function () {
  'use strict';
  let fmt = function (n) { return String(n); };
  let keys = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'];

  function setup(o) {
    if (o.fmt) fmt = o.fmt;
    if (o.keys) keys = o.keys;
  }

  // smoothly change the number written inside an element
  function tween(el, to, suffix) {
    suffix = suffix || '';
    const from = parseFloat(el._v || 0);
    el._v = to;
    cancelAnimationFrame(el._raf);
    if (from === to) { el.textContent = fmt(Math.round(to)) + suffix; return; }
    const t0 = performance.now(), dur = 800;
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(from + (to - from) * e)) + suffix;
      if (p < 1) el._raf = requestAnimationFrame(step);
    })(t0);
  }

  // count from 0 to data-count (used when a slide appears)
  function countUp(el) {
    const to = parseFloat(el.dataset.count) || 0, suf = el.dataset.suffix || '';
    cancelAnimationFrame(el._raf);
    el._v = 0;
    el.textContent = fmt(0) + suf;
    const start = performance.now() + 600, dur = 1700;
    (function step(now) {
      if (now < start) { el._raf = requestAnimationFrame(step); return; }
      const p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(to * e)) + suf;
      if (p < 1) el._raf = requestAnimationFrame(step);
    })(performance.now());
  }

  // build the voting bars for one question; returns { update(counts, {correct}) }
  function createBars(container, options) {
    container.innerHTML = '';
    const rows = options.map(function (label, i) {
      const r = document.createElement('div');
      r.className = 'bar-row';
      r.innerHTML = '<span class="bar-key"></span><span class="bar-text"></span>' +
        '<div class="bar-track"><div class="bar-fill"></div></div><b class="bar-pct ltr">0%</b>';
      r.querySelector('.bar-key').textContent = keys[i] || String(i + 1);
      r.querySelector('.bar-text').innerHTML = label;
      container.appendChild(r);
      return r;
    });
    return {
      update: function (counts, o) {
        const correct = o && typeof o.correct === 'number' ? o.correct : -1;
        const total = counts.reduce(function (a, b) { return a + b; }, 0);
        const max = Math.max.apply(null, counts);
        rows.forEach(function (r, i) {
          const pct = total ? counts[i] / total * 100 : 0;
          r.querySelector('.bar-fill').style.width = pct + '%';
          tween(r.querySelector('.bar-pct'), pct, '%');
          r.classList.toggle('is-leader', correct < 0 && total > 0 && counts[i] === max);
          r.classList.toggle('is-correct', correct >= 0 && i === correct);
          r.classList.toggle('is-wrong', correct >= 0 && i !== correct);
        });
        return total;
      }
    };
  }

  return { setup: setup, tween: tween, countUp: countUp, createBars: createBars };
})();
