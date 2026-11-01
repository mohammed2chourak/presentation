/* vote-page.js — the page students see on their phones (vote.html) */
(function () {
  'use strict';
  const P = window.PRESENTATION, M = P.meta, L = P.labels, S = P.slides;
  const KEYS = M.optionKeys || ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'];
  const root = document.documentElement;
  root.lang = M.lang || 'ar';
  root.dir = M.dir || 'rtl';
  document.title = M.title || document.title;
  document.getElementById('title').innerHTML = M.title || '';
  document.getElementById('who').textContent = [M.author, M.university].filter(Boolean).join(' · ');

  const view = document.getElementById('view');
  const STAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="5.5" y="5.5" width="13" height="13"/><rect x="5.5" y="5.5" width="13" height="13" transform="rotate(45 12 12)"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/></svg>';
  const session = (new URLSearchParams(location.search).get('s') || '').toUpperCase();

  function waitScreen(text) {
    view.innerHTML = '<div class="wait center">' + STAR + '<p>' + text + '</p></div>';
  }
  if (!session) { waitScreen(L.phoneNoSession); return; }

  const qById = {};
  S.forEach(function (s) { if (s.id) qById[s.id] = s; });

  const keyOf = function (id) { return 'pres:voted:' + session + ':' + id; };
  function myVote(q, state) {
    try {
      const v = JSON.parse(localStorage.getItem(keyOf(q.id)));
      // a reset by the presenter cancels the old vote
      if (v && v.r === (state['reset_' + q.id] || 0)) return v.i;
    } catch (e) { /* ignore */ }
    return null;
  }

  let state = {}, backend = null, device = null, already = {};
  waitScreen(L.phoneWaiting);

  function render() {
    const q = state.q && qById[state.q];
    if (!q) { waitScreen(L.phoneWaiting); return; }
    const mine = myVote(q, state);
    const quiz = q.type === 'quiz';
    const reveal = quiz && !!state.reveal;
    const open = !!state.open;
    let html = '<div class="chip-wrap"><span class="chip">' + (quiz ? L.quiz : L.poll) + '</span></div><h2 class="q">' + q.question + '</h2><div class="opts">';
    q.options.forEach(function (o, i) {
      let cls = 'opt';
      if (mine === i) cls += ' selected';
      if (reveal) {
        if (i === q.correct) cls += ' correct';
        else if (mine === i) cls += ' wrong';
      }
      const disabled = reveal || mine !== null || already[q.id] || !open;
      html += '<button class="' + cls + '" data-i="' + i + '"' + (disabled ? ' disabled' : '') + '><span class="k">' + (KEYS[i] || (i + 1)) + '</span><span>' + o + '</span></button>';
    });
    html += '</div>';
    if (reveal) {
      if (mine !== null) html += '<div class="msg ' + (mine === q.correct ? 'good' : 'bad') + '"><b>' + (mine === q.correct ? L.phoneRight : L.phoneWrong) + '</b></div>';
      if (q.explanation) html += '<div class="msg"><b>' + L.correct + '</b>' + q.explanation + '</div>';
    } else if (already[q.id]) {
      html += '<div class="msg">' + L.phoneAlready + '</div>';
    } else if (mine !== null) {
      html += '<div class="msg good"><b>✓</b>' + L.phoneVoted + '</div>';
    } else if (!open) {
      html += '<div class="msg">' + L.phoneClosed + '</div>';
    }
    view.innerHTML = html;
  }

  view.addEventListener('click', function (e) {
    const b = e.target.closest('.opt');
    if (!b || b.disabled || !backend) return;
    const q = qById[state.q];
    if (!q || !state.open) return;
    const i = +b.getAttribute('data-i');
    b.disabled = true;
    if (navigator.vibrate) navigator.vibrate(40);
    backend.vote(q.id, i, device).then(function (ok) {
      if (ok) localStorage.setItem(keyOf(q.id), JSON.stringify({ i: i, r: state['reset_' + q.id] || 0 }));
      else already[q.id] = true;
      render();
    });
  });

  Voting.init(session).then(function (v) {
    backend = v.backend;
    device = v.device;
    backend.onState(function (s) { state = s || {}; render(); });
  });
})();
