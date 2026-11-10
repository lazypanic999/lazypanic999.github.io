'use strict';
// Small synthesized sounds. Nothing is downloaded; every effect is built with the Web Audio API.
// Browsers only allow audio after the visitor's first click or key press, so nothing plays on load.
const Sound = (() => {
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, master = null, noiseBuf = null, unlocked = false, lastHover = 0;
  let enabled = true;
  try { enabled = localStorage.getItem('ds-sound') !== 'off'; } catch (e) {}

  function init() {
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.55;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp).connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }
  function unlock() { if (init()) unlocked = true; }
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, unlock, { capture: true, passive: true }));

  const ready = () => enabled && unlocked && ctx && ctx.state === 'running';

  function tone(freq, dur, { type = 'sine', vol = 0.2, at = 0, to = null, attack = 0.004 } = {}) {
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, { vol = 0.3, freq = 2000, q = 1, kind = 'bandpass', at = 0 } = {}) {
    const t = ctx.currentTime + at;
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf;
    f.type = kind; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(master);
    s.start(t, Math.random() * 0.3); s.stop(t + dur + 0.02);
  }

  const fx = {
    // faint tick when the pointer reaches something you can use
    hover() { tone(2600, 0.03, { type: 'sine', vol: 0.035 }); },
    // an RJ45 plug going in: plastic scrape, latch click, low thud
    plug() {
      noise(0.07, { vol: 0.18, freq: 3200, q: 0.7 });
      noise(0.018, { vol: 0.55, freq: 5200, kind: 'highpass', at: 0.075 });
      tone(160, 0.12, { vol: 0.32, at: 0.075, to: 70 });
    },
    // switch port coming up: two short square beeps
    link() { tone(988, 0.07, { type: 'square', vol: 0.05 }); tone(1480, 0.1, { type: 'square', vol: 0.05, at: 0.085 }); },
    unplug() { noise(0.02, { vol: 0.4, freq: 4200, kind: 'highpass' }); tone(220, 0.1, { vol: 0.15, to: 120, at: 0.01 }); },
    open() { tone(420, 0.14, { type: 'triangle', vol: 0.09, to: 760 }); noise(0.03, { vol: 0.08, freq: 6000, kind: 'highpass' }); },
    close() { tone(700, 0.12, { type: 'triangle', vol: 0.08, to: 360 }); },
    toggle() { noise(0.012, { vol: 0.45, freq: 4800, kind: 'highpass' }); tone(1900, 0.025, { type: 'square', vol: 0.03, at: 0.004 }); },
    page() { noise(0.05, { vol: 0.12, freq: 2400, q: 0.6 }); tone(1200, 0.04, { vol: 0.04, at: 0.01 }); },
    copy() { tone(1320, 0.06, { type: 'square', vol: 0.045 }); tone(1760, 0.06, { type: 'square', vol: 0.045, at: 0.07 }); tone(2640, 0.12, { type: 'square', vol: 0.04, at: 0.14 }); }
  };

  function play(name) {
    if (!ready() || !fx[name]) return;
    if (name === 'hover') { const now = performance.now(); if (now - lastHover < 60) return; lastHover = now; }
    try { fx[name](); } catch (e) {}
  }
  function setEnabled(on) {
    enabled = on;
    try { localStorage.setItem('ds-sound', on ? 'on' : 'off'); } catch (e) {}
    if (on) { unlock(); fx.toggle && ctx && ctx.state === 'running' && fx.toggle(); }
  }
  return { play, setEnabled, get enabled() { return enabled; } };
})();
