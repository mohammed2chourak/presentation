/* app.js — builds the slides from content.js, navigation, overview,
   presenter panel and the live voting display on the projector. */
(function () {
  'use strict';
  const P = window.PRESENTATION, CFG = window.APP_CONFIG || {};
  const M = P.meta, L = P.labels, S = P.slides;
  const dir = M.dir || 'rtl';
  const root = document.documentElement;
  root.lang = M.lang || 'ar';
  root.dir = dir;
  document.title = M.title || document.title;

  const $ = function (q, el) { return (el || document).querySelector(q); };
  const $$ = function (q, el) { return Array.prototype.slice.call((el || document).querySelectorAll(q)); };
  const fmt = function (n) { return String(n).replace(/\d/g, function (d) { return M.digits === 'arab' ? '٠١٢٣٤٥٦٧٨٩'[d] : d; }); };
  const KEYS = M.optionKeys || ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'];
  Charts.setup({ fmt: fmt, keys: KEYS });

  /* ------------------------------------------------------------------ icons */
  const ICON = {
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="5.5" y="5.5" width="13" height="13"/><rect x="5.5" y="5.5" width="13" height="13" transform="rotate(45 12 12)"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/></svg>',
    next: '<svg class="flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    prev: '<svg class="flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="6.5" height="6.5"/><rect x="13.5" y="4" width="6.5" height="6.5"/><rect x="4" y="13.5" width="6.5" height="6.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>'
  };
  const ROSETTE = '<svg class="rosette" viewBox="-100 -100 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2"><rect x="-60" y="-60" width="120" height="120"/><rect x="-60" y="-60" width="120" height="120" transform="rotate(45)"/><rect x="-42" y="-42" width="84" height="84" transform="rotate(22.5)"/><rect x="-42" y="-42" width="84" height="84" transform="rotate(67.5)"/><circle r="26"/><circle r="8" fill="currentColor"/><circle r="88"/><circle r="94" stroke-dasharray="2 6"/></g></svg>';

  /* ------------------------------------------------------------ slide parts */
  const divider = function (cls) { return '<div class="divider ' + (cls ? 'divider--' + cls : '') + ' anim"><span></span>' + ICON.star + '<span></span></div>'; };
  const gold = function (t) { return '<span class="gold-text">' + t + '</span>'; };
  const head = function (s) {
    return '<header class="head">' + (s.kicker ? '<span class="chip anim">' + s.kicker + '</span>' : '') +
      '<h2 class="anim">' + (s.title || '') + '</h2>' + divider('start') + '</header>';
  };
  const bullets = function (pts) {
    return pts && pts.length ? '<ul class="points">' + pts.map(function (p) { return '<li class="anim">' + p + '</li>'; }).join('') + '</ul>' : '';
  };
  const pointCards = function (pts) {
    return '<div class="point-cards">' + (pts || []).map(function (p, i) {
      return '<div class="point-card anim"><span class="star-n">' + fmt(i + 1) + '</span><p>' + p + '</p></div>';
    }).join('') + '</div>';
  };
  const example = function (ex) {
    return ex ? '<div class="example anim"><b>' + (ex.label || L.example) + '</b><p>' + ex.text + '</p></div>' : '';
  };
  const imgTag = function (src, alt) {
    return '<img src="' + src + '" alt="' + (alt || '') + '" onerror="this.onerror=null;this.src=\'images/placeholder.svg\'">';
  };

  function visual(v) {
    if (!v) return '<div class="anim">' + ROSETTE + '</div>';
    if (v.kind === 'ring') {
      const suf = v.suffix || '';
      return '<div class="ring anim" style="--v:' + v.value + '"><svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="54"/><circle class="ring-fg" cx="60" cy="60" r="54" transform="rotate(-90 60 60)"/></svg>' +
        '<div class="ring-num"><b class="ltr" data-count="' + v.value + '" data-suffix="' + suf + '">0' + suf + '</b><span>' + (v.label || '') + '</span></div></div>';
    }
    if (v.kind === 'bars') {
      return '<div class="mini-bars anim" style="--max:' + (v.max || 100) + '">' + (v.items || []).map(function (it, i) {
        return '<div class="mini-row" style="--v:' + it.value + ';--r:' + i + '"><span>' + it.label + '</span><b class="ltr">' + it.value + (v.suffix || '') + '</b><div class="mini-track"><i></i></div></div>';
      }).join('') + '</div>';
    }
    if (v.kind === 'image') return '<figure class="arch arch--image anim">' + imgTag(v.src, v.alt) + '</figure>';
    return '';
  }

  function voteHtml(s) {
    return '<div class="vote-layout"><div class="vote-main">' +
      '<div class="vote-top anim"><span class="chip">' + (s.type === 'quiz' ? L.quiz : L.poll) + '</span><span class="status" data-status></span></div>' +
      '<h2 class="vote-q anim">' + s.question + '</h2>' +
      '<div class="bars anim" data-bars></div>' +
      (s.type === 'quiz' ? '<div class="explain" data-explain hidden><b>' + L.correct + ': <span data-correct-text></span></b><p>' + (s.explanation || '') + '</p></div>' : '') +
      '</div><aside class="vote-side anim"><div class="qr-card"><div class="qr" data-qr></div>' +
      '<p class="scan">' + L.scan + '</p><p class="code">' + L.code + ': <b class="ltr" data-code>—</b></p><p class="url ltr" data-url></p></div>' +
      '<div class="counters"><div><b class="ltr" data-n-votes>0</b><span>' + L.votes + '</span></div><div><b class="ltr" data-n-part>0</b><span>' + L.participants + '</span></div></div>' +
      '</aside></div>';
  }

  const R = {
    cover: function (s) {
      return '<div class="arch arch--cover"><p class="eyebrow anim">' + (M.university || '') + '</p><p class="eyebrow-sub anim">' + (M.faculty || '') + '</p>' +
        divider() + '<h1 class="anim">' + gold(s.title || M.title) + '</h1><p class="subtitle anim">' + (s.subtitle || M.subtitle || '') + '</p>' + divider() +
        '<p class="byline anim">' + (M.author || '') + '</p><p class="byline-sub anim">' + [M.supervisor, M.date].filter(Boolean).join(' · ') + '</p></div>';
    },
    intro: function (s) {
      return '<div class="split"><div class="split-text">' + head(s) + '<p class="lead anim">' + (s.text || '') + '</p></div><div class="split-visual">' + pointCards(s.points) + '</div></div>';
    },
    toc: function (s) {
      const items = S.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) {
        return o.x.toc !== undefined ? o.x.toc : (o.x.type === 'topic' || o.x.type === 'image');
      });
      return '<div class="wide">' + head(s) + '<ol class="toc">' + items.map(function (o, k) {
        return '<li class="anim" data-go="' + o.i + '"><span class="star-n">' + fmt(k + 1) + '</span><span>' + (o.x.tocTitle || o.x.title) + '</span></li>';
      }).join('') + '</ol></div>';
    },
    topic: function (s) {
      return '<div class="split"><div class="split-text">' + head(s) + '<p class="lead anim">' + (s.text || '') + '</p>' + bullets(s.points) + example(s.example) +
        '</div><div class="split-visual">' + visual(s.visual) + '</div></div>';
    },
    image: function (s) {
      if (s.shape === 'wide') {
        return '<div class="wide">' + head(s) + '<figure class="frame-img anim">' + imgTag(s.src, s.alt) + '<figcaption>' + (s.caption || '') + '</figcaption></figure></div>';
      }
      return '<div class="split"><div class="split-text">' + head(s) + '<p class="lead anim">' + (s.text || '') + '</p><p class="caption anim">' + (s.caption || '') + '</p></div>' +
        '<div class="split-visual"><figure class="arch arch--image anim">' + imgTag(s.src, s.alt) + '</figure></div></div>';
    },
    poll: voteHtml,
    quiz: voteHtml,
    conclusion: function (s) { return '<div class="wide">' + head(s) + pointCards(s.points) + '</div>'; },
    thanks: function (s) {
      return '<div class="arch arch--cover">' + divider() + '<h1 class="anim">' + gold(s.title || '') + '</h1><p class="subtitle anim">' + (s.text || '') + '</p>' + divider() +
        '<div class="contacts anim">' + (s.contacts || []).map(function (c) { return '<span class="ltr">' + c + '</span>'; }).join('') + '</div></div>';
    }
  };

  const titleOf = function (s) {
    return String(s.title || s.question || (s.type === 'cover' ? M.title : s.type)).replace(/<[^>]+>/g, '');
  };

  /* ------------------------------------------------------------ build slides */
  const deck = $('#deck');
  const barsById = {};
  const els = S.map(function (s, i) {
    const sec = document.createElement('section');
    sec.className = 'slide slide--' + s.type;
    sec.innerHTML = '<div class="slide-inner">' + (R[s.type] || R.topic)(s, i) + '</div>';
    $$('.anim', sec).forEach(function (n, k) { n.style.setProperty('--i', k); });
    deck.appendChild(sec);
    if (s.type === 'poll' || s.type === 'quiz') {
      barsById[s.id] = Charts.createBars($('[data-bars]', sec), s.options);
      if (s.type === 'quiz') $('[data-correct-text]', sec).textContent = (KEYS[s.correct] || '') + ' — ' + String(s.options[s.correct]).replace(/<[^>]+>/g, '');
    }
    return sec;
  });
  const voteSlides = S.map(function (s, i) { return { s: s, i: i }; }).filter(function (o) { return o.s.type === 'poll' || o.s.type === 'quiz'; });

  /* ------------------------------------------------------------ UI chrome */
  const chrome = $('#chrome');
  chrome.innerHTML =
    '<div class="progress" id="progress"></div>' +
    '<nav class="dots ui" id="dots"></nav>' +
    '<div class="badge ui" id="badge" hidden></div>' +
    '<div class="nav ui">' +
    '<button class="icon-btn" data-act="prev" title="' + L.prev + '" aria-label="' + L.prev + '">' + ICON.prev + '</button>' +
    '<span class="counter ltr" id="counter"></span>' +
    '<button class="icon-btn" data-act="next" title="' + L.next + '" aria-label="' + L.next + '">' + ICON.next + '</button>' +
    '<span class="sep"></span>' +
    '<button class="icon-btn" data-act="fullscreen" title="' + L.fullscreen + ' (F)" aria-label="' + L.fullscreen + '">' + ICON.full + '</button>' +
    '<button class="icon-btn" data-act="overview" title="' + L.overview + ' (O)" aria-label="' + L.overview + '">' + ICON.grid + '</button>' +
    '<button class="icon-btn" data-act="panel" title="' + L.panel + ' (P)" aria-label="' + L.panel + '">' + ICON.sliders + '</button>' +
    '</div>' +
    '<div class="overview" id="overview"></div>' +
    '<aside class="panel ui" id="panel" hidden></aside>';

  const dotsBox = $('#dots');
  S.forEach(function (s, i) {
    const b = document.createElement('button');
    b.setAttribute('data-go', i);
    b.title = titleOf(s);
    b.setAttribute('aria-label', titleOf(s));
    dotsBox.appendChild(b);
  });
  const dots = $$('button', dotsBox);

  $('#overview').innerHTML = '<h3>' + L.overview + '</h3><div class="ov-grid">' + S.map(function (s, i) {
    return '<button class="ov-item" data-go="' + i + '"><span class="star-n">' + fmt(i + 1) + '</span><b>' + titleOf(s) + '</b><small>' + ((L.types && L.types[s.type]) || s.type) + '</small></button>';
  }).join('') + '</div>';

  $('#panel').innerHTML =
    '<div class="panel-head"><b>' + L.panelTitle + '</b><button class="x" data-act="panel" aria-label="close">×</button></div>' +
    '<div class="panel-row"><span class="ltr" id="timer">00:00</span><span><button class="btn" data-act="timer" id="btn-timer">' + L.timerStart + '</button> <button class="btn" data-act="timer-reset">' + L.timerReset + '</button></span></div>' +
    '<div class="panel-row info"><span id="mode"></span><span>' + L.code + ': <b class="ltr" id="code">—</b></span></div>' +
    '<div class="panel-sec" id="sec-vote"><p class="sec-title" id="vote-name"></p><div class="panel-btns">' +
    '<button class="btn" data-act="toggle-open" id="btn-open"></button>' +
    '<button class="btn" data-act="reveal" id="btn-reveal">' + L.reveal + '</button>' +
    '<button class="btn" data-act="reset">' + L.reset + '</button>' +
    '<button class="btn" data-act="simulate" id="btn-sim">' + L.simulate + '</button></div></div>' +
    '<div class="panel-btns"><button class="btn" data-act="phone">' + L.openPhone + '</button>' +
    '<button class="btn" data-act="new-session">' + L.newSession + '</button>' +
    '<button class="btn" data-act="demo" id="btn-demo"></button>' +
    '<button class="btn" data-act="motion">' + L.motion + '</button></div>' +
    '<p class="keys">' + L.shortcuts + '</p>';

  /* ------------------------------------------------------------ navigation */
  let cur = 0;
  function go(i) {
    i = Math.max(0, Math.min(S.length - 1, i));
    cur = i;
    els.forEach(function (el, k) { el.classList.toggle('active', k === i); el.classList.toggle('before', k < i); });
    $$('[data-count]', els[i]).forEach(Charts.countUp);
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    $$('.ov-item').forEach(function (d, k) { d.classList.toggle('on', k === i); });
    $('#counter').textContent = fmt(i + 1) + ' / ' + fmt(S.length);
    $('#progress').style.width = ((i + 1) / S.length * 100) + '%';
    try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) { /* file:// in some browsers */ }
    applyVotingForSlide();
    refreshPanel();
  }
  const next = function () { go(cur + 1); };
  const prev = function () { go(cur - 1); };

  function fullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (root.requestFullscreen) root.requestFullscreen();
  }
  const overview = $('#overview'), panel = $('#panel');
  function toggleOverview() { overview.classList.toggle('open'); }
  function closeOverview() { overview.classList.remove('open'); }
  function togglePanel() { panel.hidden = !panel.hidden; refreshPanel(); }
  function motion() {
    const on = document.body.classList.toggle('reduce-motion');
    try { localStorage.setItem('pres:motion', on ? '1' : '0'); } catch (e) { /* ignore */ }
  }
  (function initMotion() {
    let saved = null;
    try { saved = localStorage.getItem('pres:motion'); } catch (e) { /* ignore */ }
    const on = saved !== null ? saved === '1' : (!!CFG.REDUCED_MOTION || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
    document.body.classList.toggle('reduce-motion', on);
  })();

  /* ------------------------------------------------------------ timer */
  let tSec = 0, tInt = null;
  function renderTimer() {
    const m = Math.floor(tSec / 60), s = tSec % 60;
    $('#timer').textContent = fmt(String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0'));
    $('#btn-timer').textContent = tInt ? L.timerPause : L.timerStart;
  }
  function timer() {
    if (tInt) { clearInterval(tInt); tInt = null; }
    else tInt = setInterval(function () { tSec++; renderTimer(); }, 1000);
    renderTimer();
  }
  function timerReset() { tSec = 0; renderTimer(); }

  /* ------------------------------------------------------------ live voting */
  let vt = null, state = {}, votes = {}, stateReady = false, connected = true;
  const revealed = new Set();
  const hasFirebaseCfg = !!(CFG.firebase && CFG.firebase.databaseURL);
  const curVote = function () { const s = S[cur]; return s && (s.type === 'poll' || s.type === 'quiz') ? s : null; };

  function counts(id, n) {
    const c = new Array(n).fill(0), v = votes[id] || {};
    Object.keys(v).forEach(function (d) { const x = v[d]; if (x >= 0 && x < n) c[x]++; });
    return c;
  }
  function participants() {
    const set = {};
    Object.keys(votes).forEach(function (q) { Object.keys(votes[q] || {}).forEach(function (d) { set[d] = 1; }); });
    return Object.keys(set).length;
  }

  function refreshVoting() {
    const part = participants();
    voteSlides.forEach(function (o) {
      const s = o.s, el = els[o.i];
      const c = counts(s.id, s.options.length);
      const isReveal = s.type === 'quiz' && (state.q === s.id ? !!state.reveal : revealed.has(s.id));
      const total = barsById[s.id].update(c, { correct: isReveal ? s.correct : -1 });
      Charts.tween($('[data-n-votes]', el), total);
      Charts.tween($('[data-n-part]', el), part);
      const st = $('[data-status]', el);
      if (vt) {
        const active = state.q === s.id;
        st.textContent = active ? (state.open ? L.open : L.closed) : L.waiting;
        st.classList.toggle('is-open', active && !!state.open);
      }
      const ex = $('[data-explain]', el);
      if (ex) ex.hidden = !isReveal;
    });
    refreshPanel();
  }

  function applyVotingForSlide() {
    if (!vt || !stateReady) return;
    const s = S[cur];
    if (s.type === 'poll' || s.type === 'quiz') {
      if (state.q !== s.id) vt.backend.setState({ q: s.id, open: CFG.AUTO_OPEN_VOTING !== false, reveal: false });
    } else if (state.q) {
      vt.backend.setState({ q: null, open: false, reveal: false });
    }
  }

  function renderQR() {
    if (!vt) return;
    const demo = vt.backend.mode === 'local';
    const url = Voting.voteUrl(vt.session, demo);
    const onFile = location.protocol === 'file:' && !CFG.VOTE_BASE_URL;
    $$('[data-qr]').forEach(function (el) {
      el.innerHTML = '';
      if (onFile) { el.innerHTML = '<p class="qr-note center">' + L.hostFirst + '</p>'; return; }
      if (window.QRCode) {
        new QRCode(el, { text: url, width: 256, height: 256, colorDark: '#06201b', colorLight: '#f3e9d2', correctLevel: QRCode.CorrectLevel.M });
      } else {
        el.innerHTML = '<p class="qr-note ltr">' + url + '</p>';
      }
    });
    $$('[data-code]').forEach(function (e) { e.textContent = vt.session; });
    $$('[data-url]').forEach(function (e) { e.textContent = onFile ? '' : url.replace(/^https?:\/\//, ''); });
  }

  function modeText() {
    if (!vt) return '…';
    if (vt.fallback) return L.modeFallback;
    if (vt.backend.mode === 'local') return L.modeDemo;
    return connected ? L.modeLive : L.modeOffline;
  }

  function refreshPanel() {
    const s = curVote();
    $('#sec-vote').hidden = !s;
    if (s) {
      $('#vote-name').textContent = (s.type === 'quiz' ? L.quiz : L.poll) + ' — ' + titleOf(s);
      $('#btn-open').textContent = (state.q === s.id && state.open) ? L.closeVoting : L.openVoting;
      $('#btn-reveal').hidden = s.type !== 'quiz';
    }
    const local = !!vt && vt.backend.mode === 'local';
    $('#btn-sim').hidden = !local;
    $('#btn-demo').hidden = !hasFirebaseCfg;
    $('#btn-demo').textContent = local ? L.demoOff : L.demoOn;
    $('#mode').textContent = modeText();
    $('#code').textContent = vt ? vt.session : '—';
    const badge = $('#badge');
    const warn = !!vt && (local || !connected);
    badge.hidden = !warn;
    if (warn) badge.textContent = modeText();
  }

  Voting.init().then(function (v) {
    vt = v;
    if (v.backend.onConnection) v.backend.onConnection(function (c) { connected = c; refreshPanel(); });
    v.backend.onState(function (s) {
      state = s || {};
      if (!stateReady) { stateReady = true; applyVotingForSlide(); }
      refreshVoting();
    });
    v.backend.onVotes(function (x) { votes = x || {}; refreshVoting(); });
    renderQR();
    refreshPanel();
  });

  /* ------------------------------------------------------------ panel actions */
  function toggleOpen() {
    const s = curVote(); if (!s || !vt) return;
    vt.backend.setState({ q: s.id, open: !(state.q === s.id && state.open) });
  }
  function reveal() {
    const s = curVote(); if (!s || !vt || s.type !== 'quiz') return;
    revealed.add(s.id);
    vt.backend.setState({ q: s.id, reveal: true, open: false });
  }
  function resetVotes() {
    const s = curVote(); if (!s || !vt) return;
    revealed.delete(s.id);
    Promise.resolve(vt.backend.resetVotes(s.id)).then(function () {
      const key = 'reset_' + s.id;
      vt.backend.setState({ q: s.id, reveal: false, open: CFG.AUTO_OPEN_VOTING !== false, [key]: (state[key] || 0) + 1 });
    });
  }
  function simulate() {
    const s = curVote(); if (!s || !vt || vt.backend.mode !== 'local') return;
    vt.backend.simulate(s.id, 14, s.options.length);
  }
  function openPhone() {
    if (!vt) return;
    window.open(Voting.voteUrl(vt.session, vt.backend.mode === 'local'), '_blank');
  }
  function newSession() { Voting.newSession(); location.reload(); }
  function demoToggle() { Voting.setDemo(!(vt && vt.backend.mode === 'local' && !vt.fallback)); location.reload(); }

  const ACT = {
    next: next, prev: prev, fullscreen: fullscreen, overview: toggleOverview, panel: togglePanel,
    timer: timer, 'timer-reset': timerReset, 'toggle-open': toggleOpen, reveal: reveal, reset: resetVotes,
    simulate: simulate, phone: openPhone, 'new-session': newSession, demo: demoToggle, motion: motion
  };

  document.addEventListener('click', function (e) {
    const g = e.target.closest('[data-go]');
    if (g) { closeOverview(); go(+g.getAttribute('data-go')); if (g.blur) g.blur(); return; }
    const a = e.target.closest('[data-act]');
    if (a && ACT[a.getAttribute('data-act')]) { ACT[a.getAttribute('data-act')](); a.blur(); }
  });

  /* ------------------------------------------------------------ keyboard */
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && e.target.closest && e.target.closest('input, textarea')) return;
    const onButton = e.target && e.target.tagName === 'BUTTON';
    const rtlArrows = dir === 'rtl' && CFG.ARROWS_FOLLOW_READING_DIRECTION !== false;
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); rtlArrows ? prev() : next(); return;
      case 'ArrowLeft': e.preventDefault(); rtlArrows ? next() : prev(); return;
      case 'PageDown': case 'ArrowDown': e.preventDefault(); next(); return;
      case 'PageUp': case 'ArrowUp': e.preventDefault(); prev(); return;
      case ' ': case 'Enter': if (onButton) return; e.preventDefault(); next(); return;
      case 'Home': go(0); return;
      case 'End': go(S.length - 1); return;
      case 'Escape': closeOverview(); if (!panel.hidden) togglePanel(); return;
    }
    // letters use the physical key, so they work with an Arabic keyboard too
    switch (e.code) {
      case 'KeyF': fullscreen(); break;
      case 'KeyO': toggleOverview(); break;
      case 'KeyP': togglePanel(); break;
      case 'KeyV': toggleOpen(); break;
      case 'KeyR': reveal(); break;
      case 'KeyM': motion(); break;
    }
  });

  /* ------------------------------------------------------------ hide the UI when idle */
  let idleTimer;
  function wake() {
    document.body.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (panel.hidden && !overview.classList.contains('open')) document.body.classList.add('idle');
    }, 3500);
  }
  ['mousemove', 'keydown', 'click', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, wake, { passive: true }); });
  wake();

  window.addEventListener('hashchange', function () {
    const n = parseInt(location.hash.slice(1), 10);
    if (n && n - 1 !== cur) go(n - 1);
  });

  renderTimer();
  go(Math.max(0, (parseInt(location.hash.slice(1), 10) || 1) - 1));
})();
