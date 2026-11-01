'use strict';
(() => {
  const trigger = document.querySelector('.contact-arrow');
  const dialog = document.getElementById('contact-options');
  const close = document.getElementById('contact-options-close');
  const status = document.getElementById('contact-options-status');
  let copyTimer;
  const say = (tr, en) => document.documentElement.lang === 'en' ? en : tr;
  trigger.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    status.textContent = '';
    if (!dialog.open) dialog.showModal();
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { clearTimeout(copyTimer); status.textContent = ''; trigger.focus({ preventScroll: true }); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  document.getElementById('contact-options-copy').addEventListener('click', async () => {
    clearTimeout(copyTimer);
    try {
      await navigator.clipboard.writeText('dogukansaglik8563@gmail.com');
      if (dialog.open) status.textContent = say('E-posta adresi kopyalandı.', 'Email address copied.');
    } catch {
      if (dialog.open) status.textContent = say('Kopyalanamadı. Yukarıdaki adresi seçip elle kopyalayabilirsin.', 'Could not copy. Select the address above and copy it manually.');
    }
    copyTimer = setTimeout(() => { status.textContent = ''; }, 6000);
  });
  new MutationObserver(() => { status.textContent = ''; }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
