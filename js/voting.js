/* voting.js — shared by the projector (index.html) and the phones (vote.html).
   Two interchangeable backends with the same API:
     - Firebase Realtime Database  (real phones, needs internet + config.js)
     - Local demo mode             (localStorage, works offline, same browser only)
   Data layout:  sessions/<CODE>/state   = { q, open, reveal, reset_<id> }
                 sessions/<CODE>/votes/<questionId>/<deviceId> = option index          */
window.Voting = (function () {
  'use strict';
  const CFG = window.APP_CONFIG || {};
  const FB = CFG.firebase || {};
  const params = new URLSearchParams(location.search);
  const hasFirebase = !!FB.databaseURL;
  const wantsDemo = params.get('demo') === '1' || localStorage.getItem('pres:demo') === '1';

  function deviceId() {
    let id = localStorage.getItem('pres:device');
    if (!id) {
      id = 'd' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem('pres:device', id);
    }
    return id;
  }

  function newCode() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  function projectorSession() {
    const p = params.get('s');
    if (p) { localStorage.setItem('pres:session', p.toUpperCase()); return p.toUpperCase(); }
    let s = localStorage.getItem('pres:session');
    if (!s) { s = newCode(); localStorage.setItem('pres:session', s); }
    return s;
  }

  function newSession() { localStorage.setItem('pres:session', newCode()); }

  function voteUrl(session, demo) {
    let base = CFG.VOTE_BASE_URL || new URL('.', location.href).href;
    if (!/\/$/.test(base)) base += '/';
    return base + 'vote.html?s=' + encodeURIComponent(session) + (demo ? '&demo=1' : '');
  }

  function setDemo(on) { localStorage.setItem('pres:demo', on ? '1' : '0'); }

  /* ------------------------- local (demo) backend ------------------------- */
  function createLocal(session) {
    const KS = 'pres:' + session + ':state', KV = 'pres:' + session + ':votes';
    const stateCbs = [], voteCbs = [];
    const read = function (k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } };
    const emitState = function () { const s = read(KS); stateCbs.forEach(function (cb) { cb(s); }); };
    const emitVotes = function () { const v = read(KV); voteCbs.forEach(function (cb) { cb(v); }); };
    window.addEventListener('storage', function (e) {
      if (e.key === KS) emitState();
      if (e.key === KV) emitVotes();
    });
    return {
      mode: 'local',
      setState: function (patch) {
        const s = Object.assign(read(KS), patch);
        Object.keys(s).forEach(function (k) { if (s[k] === null) delete s[k]; });
        localStorage.setItem(KS, JSON.stringify(s));
        emitState();
        return Promise.resolve();
      },
      onState: function (cb) { stateCbs.push(cb); cb(read(KS)); },
      onVotes: function (cb) { voteCbs.push(cb); cb(read(KV)); },
      vote: function (q, idx, dev) {
        const v = read(KV);
        v[q] = v[q] || {};
        if (v[q][dev] !== undefined) return Promise.resolve(false);
        v[q][dev] = idx;
        localStorage.setItem(KV, JSON.stringify(v));
        emitVotes();
        return Promise.resolve(true);
      },
      resetVotes: function (q) {
        const v = read(KV);
        delete v[q];
        localStorage.setItem(KV, JSON.stringify(v));
        emitVotes();
        return Promise.resolve();
      },
      simulate: function (q, n, optionCount) {
        const v = read(KV);
        v[q] = v[q] || {};
        for (let i = 0; i < n; i++) {
          // uneven on purpose so the bars look interesting
          const idx = Math.min(optionCount - 1, Math.floor(Math.pow(Math.random(), 1.6) * optionCount));
          v[q]['sim' + Math.random().toString(36).slice(2, 9)] = idx;
        }
        localStorage.setItem(KV, JSON.stringify(v));
        emitVotes();
      }
    };
  }

  /* ------------------------- Firebase backend ------------------------- */
  function createFirebase(session) {
    const base = firebase.database().ref('sessions/' + session);
    return {
      mode: 'firebase',
      setState: function (patch) { return base.child('state').update(patch); },
      onState: function (cb) { base.child('state').on('value', function (s) { cb(s.val() || {}); }); },
      onVotes: function (cb) { base.child('votes').on('value', function (s) { cb(s.val() || {}); }); },
      onConnection: function (cb) { firebase.database().ref('.info/connected').on('value', function (s) { cb(!!s.val()); }); },
      vote: function (q, idx, dev) {
        return base.child('votes/' + q + '/' + dev).set(idx).then(function () { return true; }, function () { return false; });
      },
      resetVotes: function (q) {
        return base.child('votes/' + q).once('value').then(function (snap) {
          const u = {};
          snap.forEach(function (c) { u[c.key] = null; });
          return base.child('votes/' + q).update(u);
        });
      },
      simulate: function () {}
    };
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      const timer = setTimeout(function () { reject(new Error('timeout')); }, 8000);
      s.src = src;
      s.onload = function () { clearTimeout(timer); resolve(); };
      s.onerror = function () { clearTimeout(timer); reject(new Error('load failed')); };
      document.head.appendChild(s);
    });
  }

  async function init(sessionOverride) {
    const session = sessionOverride || projectorSession();
    let backend, fallback = false;
    if (hasFirebase && !wantsDemo) {
      try {
        const v = '10.14.1';
       await loadScript('https://www.gstatic.com/firebasejs/' + v + '/firebase-app-compat.js');
       await loadScript('https://www.gstatic.com/firebasejs/' + v + '/firebase-database-compat.js');
        if (!firebase.apps.length) firebase.initializeApp(FB);
        backend = createFirebase(session);
      } catch (err) {
        console.warn('Firebase unavailable, switching to demo mode:', err);
        backend = createLocal(session);
        fallback = true;
      }
    } else {
      backend = createLocal(session);
    }
    return { backend: backend, session: session, device: deviceId(), fallback: fallback, hasFirebase: hasFirebase };
  }

  return { init: init, voteUrl: voteUrl, newSession: newSession, setDemo: setDemo, deviceId: deviceId, hasFirebase: hasFirebase };
})();
