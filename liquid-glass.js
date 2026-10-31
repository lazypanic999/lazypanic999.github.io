/*!
 * liquid-glass.js — dogukansaglik.com için "liquid glass" + animasyon katmanı
 * Portfolio integration: loaded last with defer; adapted to existing palette, layout and motion control.
 * Original upload SHA-256: 14c32f331c0c80dd4cce120c9ee73fee1e3e540fb3674560e0d5601ffeb76763
 * Original installation note:
 *   <script src="/liquid-glass.js"></script>
 * Mevcut HTML/CSS'e dokunmaz; tek bir <style> enjekte eder ve sınıf ekler.
 * Kapatmak için aşağıdaki OPTS değerlerini false yapın.
 */
(() => {
  'use strict';
  if (window.__lg) return;
  window.__lg = 1;

  const OPTS = {
    blobs: true,       // cam arkasında akan renkli ışık alanları
    refraction: true,  // üst çubukta/diyalogda sıvı kırılma (sadece Chromium)
    hero: true,        // açılışta hero içeriğinin sıralı belirmesi
    reveal: true,      // kaydırınca kartların belirmesi
    spotlight: true,   // imleci izleyen cam parlaması
    tilt: true,        // kartların imleçle hafif 3B eğilmesi
    headings: true,    // bölüm başlıklarında kelime kelime yükselme
    micro: true        // ok hareketi, zaman çizelgesi noktası nabzı
  };

  const d = document, root = d.documentElement;
  root.dataset.liquidGlass = "on";

  /* ---------- CSS ---------- */
  const CSS = `
:root{
  --lg-fill-a:rgba(255,255,255,.09);--lg-fill-b:rgba(255,255,255,.02);
  --lg-rim:rgba(255,255,255,.07);--lg-hi:rgba(255,255,255,.16);
  --lg-shadow:rgba(0,0,0,.30);--lg-spec:rgba(255,255,255,.14);
  --lg-solid:rgba(22,24,32,.9);
  --lg-b1:#0097de;--lg-b2:#fc734d;--lg-b3:#0097de;--lg-blob-op:.20;
  --lg-ease:cubic-bezier(.22,.9,.24,1);--lg-spring:cubic-bezier(.34,1.5,.5,1);
}
:root[data-theme="light"],:root.light{
  --lg-fill-a:rgba(255,255,255,.5);--lg-fill-b:rgba(255,255,255,.2);
  --lg-rim:rgba(255,255,255,.45);--lg-hi:rgba(255,255,255,.8);
  --lg-shadow:rgba(30,45,90,.09);--lg-spec:rgba(255,255,255,.6);
  --lg-solid:rgba(255,255,255,.92);
  --lg-b1:#008cb8;--lg-b2:#de3695;--lg-b3:#008cb8;--lg-blob-op:.18;
}
@media (prefers-color-scheme:light){
  :root:not([data-theme="dark"]):not(.dark){
    --lg-fill-a:rgba(255,255,255,.5);--lg-fill-b:rgba(255,255,255,.2);
    --lg-rim:rgba(255,255,255,.45);--lg-hi:rgba(255,255,255,.8);
    --lg-shadow:rgba(30,45,90,.09);--lg-spec:rgba(255,255,255,.6);
    --lg-solid:rgba(255,255,255,.92);
    --lg-b1:#008cb8;--lg-b2:#de3695;--lg-b3:#008cb8;--lg-blob-op:.18;
  }
}

/* --- ambient ışık alanı (camın kırıp göstereceği şey) --- */
.lg-bg{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none;contain:strict}
.lg-bg i{position:absolute;width:46vmax;height:46vmax;border-radius:50%;filter:blur(90px);
  opacity:var(--lg-blob-op);will-change:transform;
  translate:calc(var(--lg-px,0)*var(--k)*1px) calc(var(--lg-py,0)*var(--k)*1px);
  animation:lg-drift 26s ease-in-out infinite alternate}
.lg-bg i:nth-child(1){left:-12vmax;top:-12vmax;background:var(--lg-b1);--k:60}
.lg-bg i:nth-child(2){right:-14vmax;top:18vh;background:var(--lg-b2);--k:-45;animation-duration:32s;animation-delay:-8s}
.lg-bg i:nth-child(3){left:22vw;bottom:-22vmax;background:var(--lg-b3);--k:35;animation-duration:38s;animation-delay:-15s}
@keyframes lg-drift{to{transform:translate3d(9vw,7vh,0) scale(1.18)}}
@media (max-width:700px){.lg-bg i{filter:blur(60px);width:70vmax;height:70vmax}}

/* --- cam yüzeyler: kartlar --- */
.lg-glass{
  background:linear-gradient(135deg,var(--lg-fill-a),var(--lg-fill-b)) !important;
  -webkit-backdrop-filter:blur(26px) saturate(150%);backdrop-filter:blur(26px) saturate(150%);
  border:1px solid var(--lg-rim) !important;
  box-shadow:inset 0 1px 0 var(--lg-hi),0 32px 72px -44px var(--lg-shadow) !important;
  box-sizing:border-box;max-width:100%;min-width:0;overflow-wrap:break-word;
  transition:translate .6s var(--lg-ease),box-shadow .4s,transform .5s var(--lg-ease);
}
.lg-glass:not(.lg-reveal):hover{translate:0 -3px}
.lg-glass::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  opacity:0;transition:opacity .4s;z-index:0;
  background:radial-gradient(420px circle at var(--mx,50%) var(--my,0%),var(--lg-spec),transparent 60%)}
.lg-glass:hover::before{opacity:1}

/* Keep the portfolio's compact typography and image geometry. */
.lg-glass{position:relative}
.lg-glass img,.lg-glass video{max-width:100%}
html[data-liquid-glass="on"] .hero-copy{animation:none}
.lg-glass .project-expand>summary{position:relative;z-index:1}
/* --- ek animasyonlar --- */
.lg-reveal-x{translate:-28px 0}
.lg-reveal .lg-chip{opacity:0;scale:.8}
.lg-reveal.lg-in .lg-chip{opacity:1;scale:1;
  transition:opacity .5s var(--lg-ease),scale .55s var(--lg-spring);
  transition-delay:calc(.2s + var(--ci,0)*35ms)}
.lg-w{display:inline-block;overflow:hidden;vertical-align:top;padding:.18em 0 .16em;margin:-.18em 0 -.16em}
.lg-w>span{display:inline-block;translate:0 115%;transition:translate .95s var(--lg-ease);
  transition-delay:calc(var(--wi,0)*75ms)}
.lg-split.lg-in .lg-w>span{translate:0 0}
.lg-arr{display:inline-block;transition:translate .5s var(--lg-spring)}
a:hover>.lg-arr,button:hover>.lg-arr{translate:.22em -.22em}
a:hover>.lg-arr.lg-arr-d,button:hover>.lg-arr.lg-arr-d{translate:0 .22em}
.lg-dot{animation:lg-ping 2.8s ease-out infinite}
@keyframes lg-ping{
  0%{box-shadow:0 0 0 0 var(--lg-pulse,rgba(236,72,153,.45))}
  70%,100%{box-shadow:0 0 0 12px transparent}}
.lg-glass::after{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;
  opacity:.5;
  background:linear-gradient(135deg,rgba(255,255,255,.45),rgba(255,255,255,0) 28%,rgba(255,255,255,0) 72%,rgba(255,255,255,.14));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude}

/* --- etiketler --- */
.lg-chip{background:linear-gradient(135deg,var(--lg-fill-a),var(--lg-fill-b)) !important;
  border:1px solid var(--lg-rim) !important;box-shadow:inset 0 1px 0 var(--lg-hi) !important;
  border-radius:999px !important}

/* --- düğmeler --- */
.lg-btn{position:relative;overflow:hidden;border-radius:999px !important;
  transition:translate .45s var(--lg-spring),scale .45s var(--lg-spring),box-shadow .3s}
.lg-btn:not(.lg-solid){
  background:linear-gradient(135deg,var(--lg-fill-a),var(--lg-fill-b)) !important;
  -webkit-backdrop-filter:blur(12px) saturate(160%);backdrop-filter:blur(12px) saturate(160%);
  border:1px solid var(--lg-rim) !important;
  box-shadow:inset 0 1px 0 var(--lg-hi),0 6px 18px -8px var(--lg-shadow) !important}
.lg-btn.lg-solid{box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 8px 24px -8px var(--lg-shadow)}
.lg-btn:hover{translate:0 -2px}
.lg-btn:active{scale:.96;translate:0 0}
.lg-btn::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.38) 50%,transparent 65%);
  translate:-120% 0;transition:translate .8s var(--lg-ease)}
.lg-btn:hover::after{translate:120% 0}

/* --- üst çubuk --- */
.lg-nav{
  background:linear-gradient(180deg,var(--lg-fill-a),var(--lg-fill-b)) !important;
  -webkit-backdrop-filter:blur(18px) saturate(180%);backdrop-filter:blur(18px) saturate(180%);
  border-bottom:1px solid var(--lg-rim) !important;
  box-shadow:inset 0 -1px 0 var(--lg-hi);transition:box-shadow .4s}
.lg-nav.is-scrolled{box-shadow:inset 0 -1px 0 var(--lg-hi),0 12px 32px -12px var(--lg-shadow)}
.lg-progress{position:fixed;left:0;top:0;height:2px;width:100%;z-index:9999;pointer-events:none;
  transform-origin:0 50%;transform:scaleX(0);
  background:linear-gradient(90deg,var(--lg-b1),var(--lg-b2),var(--lg-b3))}

/* --- diyalog / CV önizleme --- */
.lg-dlg{
  background:linear-gradient(135deg,var(--lg-fill-a),var(--lg-fill-b)),var(--lg-solid) !important;
  -webkit-backdrop-filter:blur(28px) saturate(180%);backdrop-filter:blur(28px) saturate(180%);
  border:1px solid var(--lg-rim) !important;border-radius:26px;
  box-shadow:inset 0 1px 0 var(--lg-hi),0 30px 80px -20px var(--lg-shadow) !important;
  animation:lg-pop .55s var(--lg-spring)}
dialog::backdrop{background:rgba(5,6,12,.35);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
@keyframes lg-pop{from{opacity:0;scale:.94;translate:0 14px}}

/* --- sıvı kırılma (yalnızca Chromium) --- */
.lg-refract .lg-nav,.lg-refract .lg-dlg{
  -webkit-backdrop-filter:blur(14px) saturate(180%) url(#lg-refract);
  backdrop-filter:blur(14px) saturate(180%) url(#lg-refract)}

/* --- animasyonlar --- */
.lg-reveal{opacity:0;translate:0 26px;scale:.985}
.lg-reveal.lg-in{opacity:1;translate:0 0;scale:1;
  transition:opacity .8s var(--lg-ease),translate .9s var(--lg-ease),scale .9s var(--lg-ease);
  transition-delay:calc(var(--i,0)*70ms)}
.lg-hero-in{animation:lg-rise 1s var(--lg-ease) both;animation-delay:calc(var(--i,0)*110ms + 60ms)}
@keyframes lg-rise{from{opacity:0;translate:0 24px;filter:blur(12px)}to{opacity:1;translate:0 0;filter:blur(0)}}

/* --- hareket azaltma --- */
.lg-still .lg-bg i{animation:none;translate:none}
.lg-still .lg-reveal{opacity:1;translate:none;scale:1}
.lg-still .lg-glass,.lg-still .lg-btn,.lg-still .lg-dlg{transition:none;animation:none;transform:none!important;translate:none!important;scale:1!important}
.lg-still .lg-btn::after{display:none}
.lg-still .lg-w>span{translate:0 0;transition:none}
.lg-still .lg-dot{animation:none}
.lg-still .lg-arr{transition:none;translate:none!important}
.lg-still .lg-glass::before{display:none}
.lg-still .lg-hero-in{animation:none;opacity:1;translate:none;filter:none}
.lg-still .lg-reveal .lg-chip{opacity:1;scale:1}
@media (prefers-reduced-motion:reduce){
  .lg-bg i{animation:none}.lg-hero-in,.lg-dlg{animation:none}
}

/* --- backdrop-filter yoksa okunabilir düz zemin --- */
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){
  .lg-glass,.lg-nav,.lg-dlg{background:var(--lg-solid) !important}
}
`;

  const st = d.createElement('style');
  st.id = 'lg-style';
  st.textContent = CSS;
  d.head.appendChild(st);

  /* ---------- hareket tercihi ---------- */
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const isStill = () =>
    mq.matches ||
    ['off', 'reduced', 'false', 'none'].includes(root.dataset.motion) ||
    root.classList.contains('reduce-motion') ||
    root.classList.contains('no-motion');
  const syncStill = () => {
    const want = isStill();
    if (want) d.querySelectorAll(".lg-glass").forEach(el => { el.style.removeProperty("transform"); el.style.removeProperty("--mx"); el.style.removeProperty("--my"); });
    if (root.classList.contains('lg-still') !== want) root.classList.toggle('lg-still', want);
  };
  syncStill();
  if (mq.addEventListener) mq.addEventListener('change', syncStill);
  new MutationObserver(syncStill).observe(root, { attributes: true, attributeFilter: ['class', 'data-motion'] });

  /* ---------- yardımcılar ---------- */
  const q = (s, r = d) => Array.from(r.querySelectorAll(s));
  const cs = (el) => getComputedStyle(el);
  const ensurePos = (el) => { if (cs(el).position === 'static') el.style.position = 'relative'; };
  const alpha = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)|color\(([^)]+)\)/);
    if (!m) return 0;
    const p = (m[1] || m[2]).split(/[ ,\/]+/).filter(Boolean);
    if (p.length < 4) return 1;
    const a = parseFloat(p[p.length - 1]);
    return String(p[p.length - 1]).endsWith('%') ? a / 100 : a;
  };

  /* ---------- sabit katmanlar ---------- */
  const mountLayers = () => {
    if (OPTS.blobs && !q('.lg-bg')[0]) {
      const bg = d.createElement('div');
      bg.className = 'lg-bg';
      bg.setAttribute('aria-hidden', 'true');
      bg.innerHTML = '<i></i><i></i><i></i>';
      (d.querySelector(".ambient") || d.body).appendChild(bg);
    }
    const progress = d.querySelector('.reading-progress');
    if (progress) progress.classList.add('lg-progress');
    const chromium = !!(navigator.userAgentData &&
      navigator.userAgentData.brands.some((b) => /Chromium/i.test(b.brand)));
    if (OPTS.refraction && chromium && !q('#lg-refract-svg')[0]) {
      root.classList.add('lg-refract');
      const s = d.createElement('div');
      s.id = 'lg-refract-svg';
      s.setAttribute('aria-hidden', 'true');
      s.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      s.innerHTML =
        '<svg width="0" height="0"><filter id="lg-refract" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="n"/>' +
        '<feGaussianBlur in="n" stdDeviation="2" result="nb"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="nb" scale="6" xChannelSelector="R" yChannelSelector="G"/>' +
        '</filter></svg>';
      d.body.appendChild(s);
    }
  };

  /* ---------- etiketleme (tekrar çağrılabilir) ---------- */
  let nav = null;
  let cardList = [];
  let softList = []; // cam almayan ama animasyon alan kutular (Deneyim, İletişim)

  const tag = () => {
    nav = d.querySelector('.header');
    if (nav) nav.classList.add('lg-nav');
    cardList = q('.project, .skills>div, .certifications');
    softList = q('.timeline article, .contact-main');
    cardList.forEach(el => { ensurePos(el); el.classList.add('lg-glass'); });
    q('.tags>span').forEach(el => el.classList.add('lg-chip'));
    q('.button, .nav-contact').forEach(el => {
      el.classList.add('lg-btn');
      if (el.classList.contains('primary')) el.classList.add('lg-solid');
    });
    if (OPTS.micro) q('a, button').forEach(arrowize);
    q('dialog').forEach(el => el.classList.add('lg-dlg'));
  };
  // The existing responsive layout owns spacing and wrapping.
  const fixOverflow = () => {};
  const loadFont = () => {};

  /* ---------- animasyonlar ---------- */
  const setupHero = () => {
    if (!OPTS.hero || isStill()) return;
    const h1 = q('h1')[0];
    if (!h1 || !h1.parentElement) return;
    Array.from(h1.parentElement.children)
      .filter((el) => el.getBoundingClientRect().height > 0)
      .forEach((el, i) => {
        el.style.setProperty('--i', i);
        el.classList.add('lg-hero-in');
        el.addEventListener('animationend', () => {
          el.classList.remove('lg-hero-in');
          el.style.removeProperty('--i');
        }, { once: true });
      });
  };

  const setupReveal = () => {
    if (!OPTS.reveal || isStill() || !('IntersectionObserver' in window)) return;
    const targets = cardList
      .concat(softList)
      .concat(q('#projects h2 + p, #experience h2 + p, #about h2 + p, #contact h2 + p'));
    const vh = innerHeight;
    const perParent = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        requestAnimationFrame(() => el.classList.add('lg-in'));
        el.addEventListener('transitionend', function done(ev) {
          if (ev.target !== el || ev.propertyName !== 'opacity') return;
          el.removeEventListener('transitionend', done);
          el.classList.remove('lg-reveal', 'lg-reveal-x', 'lg-in');
          el.style.removeProperty('--i');
        });
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.95) return; // ilk ekran: hero akışına bırak
      const n = perParent.get(el.parentElement) || 0;
      perParent.set(el.parentElement, n + 1);
      el.style.setProperty('--i', Math.min(n, 4));
      el.classList.add('lg-reveal');
      if (el.closest('#experience')) el.classList.add('lg-reveal-x');
      q('.lg-chip', el).forEach((c, ci) => c.style.setProperty('--ci', Math.min(ci, 5)));
      io.observe(el);
    });
  };

  /* ---------- oklar ---------- */
  const arrowize = (a) => {
    if (a.querySelector(':scope > .lg-arr')) return;
    const kids = Array.from(a.childNodes);
    for (let i = kids.length - 1; i >= 0; i--) {
      const n = kids[i];
      if (n.nodeType === 3 && !n.nodeValue.trim()) continue;
      if (n.nodeType === 3) {
        const m = n.nodeValue.match(/^([\s\S]*?)\s*([↗↓])\s*$/);
        if (m) {
          n.nodeValue = m[1];
          const s = d.createElement('span');
          s.className = 'lg-arr' + (m[2] === '↓' ? ' lg-arr-d' : '');
          s.setAttribute('aria-hidden', 'true');
          s.textContent = m[2];
          a.appendChild(s);
        }
      } else if (n.nodeType === 1 && !n.children.length && /^[↗↓]$/.test(n.textContent.trim())) {
        n.classList.add('lg-arr');
        if (n.textContent.trim() === '↓') n.classList.add('lg-arr-d');
      }
      break;
    }
  };

  /* ---------- bölüm başlıkları: kelime kelime yükselme ---------- */
  const setupHeadings = () => {
    if (!OPTS.headings || isStill() || !('IntersectionObserver' in window)) return;
    const hs = q('#projects h2, #experience h2, #about h2').filter((h) => {
      if (h.children.length || h.dataset.lgSplit) return false;
      const s = cs(h);
      return s.backgroundClip !== 'text' && s.webkitBackgroundClip !== 'text';
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('lg-in');
      io.unobserve(e.target);
    }), { threshold: 0.4 });
    hs.forEach((h) => {
      const text = h.textContent.trim();
      if (!text) return;
      h.dataset.lgSplit = '1';
      h.setAttribute('aria-label', text);
      h.textContent = '';
      const words = text.split(/\s+/);
      words.forEach((w, i) => {
        const o = d.createElement('span');
        o.className = 'lg-w';
        o.setAttribute('aria-hidden', 'true');
        const n = d.createElement('span');
        n.style.setProperty('--wi', i);
        n.textContent = w;
        o.appendChild(n);
        h.appendChild(o);
        if (i < words.length - 1) h.appendChild(d.createTextNode(' '));
      });
      h.classList.add('lg-split');
      io.observe(h);
    });
  };

  /* ---------- zaman çizelgesi noktaları: yavaş nabız ---------- */
  const setupMicro = () => {
    if (!OPTS.micro || isStill()) return;
    q('#experience *').forEach((n) => {
      if (n.children.length || !n.offsetWidth || n.offsetWidth > 20 || n.offsetHeight > 20) return;
      const s = cs(n);
      if (s.position !== 'absolute' || alpha(s.backgroundColor) < 0.5) return;
      if ((parseFloat(s.borderTopLeftRadius) || 0) < n.offsetWidth / 2 - 1) return;
      n.classList.add('lg-dot');
      n.style.setProperty('--lg-pulse', s.backgroundColor.replace(/^rgb\(([^)]+)\)$/, 'rgba($1,.5)'));
    });
  };

  /* ---------- kaydırma & imleç ---------- */
  const setupInput = () => {
    const bar = q('.lg-progress')[0];
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = scrollY, h = root.scrollHeight - innerHeight;
        if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
        if (nav) nav.classList.toggle('is-scrolled', y > 24);
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    let raf = 0, ev = null;
    addEventListener('pointermove', (e) => {
      ev = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (OPTS.blobs && !isStill()) {
          root.style.setProperty('--lg-px', (ev.clientX / innerWidth - 0.5).toFixed(3));
          root.style.setProperty('--lg-py', (ev.clientY / innerHeight - 0.5).toFixed(3));
        }
        if ((OPTS.spotlight || OPTS.tilt) && !isStill() && ev.target.closest) {
          const g = ev.target.closest('.lg-glass, .lg-btn');
          if (g) {
            const r = g.getBoundingClientRect();
            if (OPTS.spotlight) {
              g.style.setProperty('--mx', ev.clientX - r.left + 'px');
              g.style.setProperty('--my', ev.clientY - r.top + 'px');
            }
            if (OPTS.tilt && !isStill() && g.classList.contains('lg-glass') && !g.classList.contains('lg-reveal')) {
              const px = (ev.clientX - r.left) / r.width - 0.5;
              const py = (ev.clientY - r.top) / r.height - 0.5;
              g.style.transform = 'perspective(1000px) rotateX(' + (-py * 4).toFixed(2) +
                'deg) rotateY(' + (px * 5).toFixed(2) + 'deg)';
            }
          }
        }
      });
    }, { passive: true });

    d.addEventListener('pointerout', (e) => {
      const g = e.target.closest && e.target.closest('.lg-glass');
      if (g && g.style.transform && !g.contains(e.relatedTarget)) g.style.transform = '';
    });
  };

  /* ---------- başlat ---------- */
  const init = () => {
    mountLayers();
    d.querySelectorAll('.reveal-pending').forEach(el => el.classList.remove('reveal-pending'));
    tag();
    loadFont();
    setupHeadings();
    setupMicro();
    setupHero();
    setupReveal();
    setupInput();

    new MutationObserver(() => {
      q('[data-lg-split]').forEach(h => {
        delete h.dataset.lgSplit;
        h.removeAttribute('aria-label');
        h.classList.remove('lg-split', 'lg-in');
      });
      setupHeadings();
      tag();
    }).observe(root, { attributes: true, attributeFilter: ['lang'] });

    fixOverflow();
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(fixOverflow);
    let rz = 0;
    addEventListener('resize', () => {
      clearTimeout(rz);
      rz = setTimeout(fixOverflow, 200);
    }, { passive: true });

    // site sonradan eleman eklerse (diyalog, filtre sonuçları) yeniden etiketle
    let t = 0;
    new MutationObserver(() => {
      clearTimeout(t);
      t = setTimeout(tag, 300);
    }).observe(d.body, { childList: true, subtree: true });
  };

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
})();
