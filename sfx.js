'use strict';
// Hooks the synthesized sounds in sound.js into the page. Sounds only answer the visitor's own actions.
(() => {
  if (typeof Sound === 'undefined') return;
  const $$ = s => [...document.querySelectorAll(s)];
  const tr = () => document.documentElement.lang !== 'en';

  const soundBtn = document.getElementById('sound');
  function label() {
    if (!soundBtn) return;
    const on = Sound.enabled;
    const text = on ? (tr() ? 'Sesleri kapat' : 'Turn sounds off') : (tr() ? 'Sesleri aç' : 'Turn sounds on');
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.setAttribute('aria-label', text);
    soundBtn.title = text;
  }
  if (soundBtn) {
    soundBtn.addEventListener('click', () => { Sound.setEnabled(!Sound.enabled); label(); });
    label();
    new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  const on = (selector, event, name) => document.addEventListener(event, e => {
    const el = e.target instanceof Element && e.target.closest(selector);
    if (el) Sound.play(typeof name === 'function' ? name(el) : name);
  }, true);

  // clicks
  on('#lang, #theme, #motion, [data-filter]', 'click', 'toggle');
  on('[data-gallery], .contact-arrow', 'click', 'open');
  on('#gallery-next, #gallery-prev', 'click', 'page');
  on('#copy-email, #contact-options-copy', 'click', 'copy');
  on('nav a, .button, .text-link, .nav-contact, .footer a', 'click', 'page');

  // opening and closing details panels
  $$('details').forEach(d => d.addEventListener('toggle', () => Sound.play(d.open ? 'open' : 'close')));
  // closing dialogs
  $$('dialog').forEach(d => d.addEventListener('close', () => Sound.play('close')));

  // a faint tick when the pointer reaches something clickable
  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const el = e.target instanceof Element && e.target.closest('a, button, summary, .project-shot');
    if (!el || (e.relatedTarget instanceof Element && el.contains(e.relatedTarget))) return;
    Sound.play('hover');
  });
})();
