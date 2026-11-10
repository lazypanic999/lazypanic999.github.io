'use strict';
// Starfield behind the page: three depth layers that twinkle and drift with scroll,
// plus an occasional shooting star. Follows the page's ∿ animation switch and reduced-motion setting.
(() => {
  const ambient = document.querySelector('.ambient');
  if (!ambient) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'starfield';
  ambient.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  let w = 0, h = 0, dpr = 1, stars = [], meteors = [], raf = 0, last = 0, nextMeteor = 0;
  let scroll = window.scrollY, pointerX = 0, pointerY = 0, px = 0, py = 0;
  const layers = [
    { depth: 0.04, size: [0.55, 1.05], alpha: [0.35, 0.75], share: 0.62 },
    { depth: 0.09, size: [0.8, 1.4], alpha: [0.5, 0.9], share: 0.3 },
    { depth: 0.16, size: [1.2, 2.0], alpha: [0.75, 1], share: 0.08 }
  ];
  const tints = ['255,255,255', '255,255,255', '255,255,255', '186,220,255', '255,226,196', '205,196,255'];
  const rand = (a, b) => a + Math.random() * (b - a);
  const moving = () => root.dataset.motion !== 'off' && !reduce.matches;
  const light = () => root.dataset.theme === 'light';

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const total = Math.min(650, Math.round((w * h) / 2300));
    stars = [];
    layers.forEach((layer, li) => {
      const count = Math.round(total * layer.share);
      // each layer is taller than the screen so scrolling can move it without running out
      const span = h + layer.depth * 6000;
      for (let i = 0; i < count; i++) {
        stars.push({
          li, x: Math.random() * w, y: Math.random() * span, span,
          r: rand(layer.size[0], layer.size[1]), a: rand(layer.alpha[0], layer.alpha[1]),
          tw: rand(0.6, 2.2), ph: Math.random() * Math.PI * 2,
          c: tints[(Math.random() * tints.length) | 0]
        });
      }
    });
  }

  function spawnMeteor(t) {
    const fromLeft = Math.random() < 0.5;   // starts on the left and flies right, or the reverse
    const angle = rand(0.3, 0.6);            // radians below horizontal
    const speed = rand(800, 1150);
    meteors.push({
      x: fromLeft ? rand(-0.05, 0.5) * w : rand(0.5, 1.05) * w,
      y: rand(-0.05, 0.35) * h,
      vx: (fromLeft ? 1 : -1) * Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0, max: rand(0.7, 1.15), len: rand(90, 170)
    });
    nextMeteor = t + rand(5000, 11000);
  }

  function draw(t) {
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
    last = t;
    ctx.clearRect(0, 0, w, h);
    const isLight = light();
    const anim = moving();
    // ease the pointer drift
    px += (pointerX - px) * 0.04; py += (pointerY - py) * 0.04;

    for (const s of stars) {
      const layer = layers[s.li];
      let y = (s.y - scroll * layer.depth * 3) % s.span;
      if (y < 0) y += s.span;
      if (y > h + 4) continue;
      const x = s.x + px * layer.depth * 60;
      const y2 = y + py * layer.depth * 40;
      const twinkle = anim ? 0.65 + 0.35 * Math.sin(t / 1000 * s.tw + s.ph) : 1;
      const alpha = s.a * twinkle * (isLight ? 0.32 : 1);
      ctx.fillStyle = isLight ? `rgba(30,60,120,${alpha})` : `rgba(${s.c},${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y2, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.li === 2 && !isLight) { // brightest stars get a soft glow
        ctx.fillStyle = `rgba(${s.c},${alpha * 0.12})`;
        ctx.beginPath(); ctx.arc(x, y2, s.r * 4, 0, Math.PI * 2); ctx.fill();
      }
    }

    if (anim && !isLight) {
      if (!nextMeteor) nextMeteor = t + rand(2500, 5000);
      if (t > nextMeteor && !document.hidden) spawnMeteor(t);
      meteors = meteors.filter(m => (m.life += dt) < m.max);
      for (const m of meteors) {
        m.x += m.vx * dt; m.y += m.vy * dt;
        const k = m.life / m.max;
        const fade = k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8;
        const speed = Math.hypot(m.vx, m.vy);
        const tx = m.x - (m.vx / speed) * m.len, ty = m.y - (m.vy / speed) * m.len;
        const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
        g.addColorStop(0.3, `rgba(150,210,255,${0.35 * fade})`);
        g.addColorStop(1, 'rgba(150,210,255,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
      }
    } else {
      meteors = [];
    }
    raf = anim ? requestAnimationFrame(draw) : 0;
  }

  function redraw() {
    if (raf) return; // the loop is already running
    if (moving()) { last = 0; raf = requestAnimationFrame(draw); }
    else draw(performance.now());
  }

  build();
  redraw();
  window.__space = { meteor: () => spawnMeteor(performance.now()) }; // handy for testing in the console
  window.addEventListener('resize', () => { build(); redraw(); });
  window.addEventListener('scroll', () => { scroll = window.scrollY; if (!moving()) redraw(); }, { passive: true });
  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    pointerX = e.clientX / w - 0.5; pointerY = e.clientY / h - 0.5;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else redraw();
  });
  new MutationObserver(() => { cancelAnimationFrame(raf); raf = 0; redraw(); })
    .observe(root, { attributes: true, attributeFilter: ['data-motion', 'data-theme'] });
  reduce.addEventListener('change', () => { cancelAnimationFrame(raf); raf = 0; redraw(); });
})();
