'use strict';
const lab = document.getElementById('engineering-lab');
if (document.fonts && !document.fonts.check('29px "Dust Mites"')) {
  let complete = false;
  const show = setTimeout(() => { if (!complete) { lab.classList.add('lab-loading'); lab.setAttribute('aria-busy','true'); } },120);
  const finish = () => { complete = true; clearTimeout(show); clearTimeout(fallback); lab.classList.remove('lab-loading'); lab.removeAttribute('aria-busy'); };
  const fallback = setTimeout(finish,3500);
  document.fonts.load('29px "Dust Mites"').then(finish,finish);
}
const documentDialog = document.getElementById('document-preview');
const documentStage = documentDialog.querySelector('.document-stage');
const documentSkeleton = documentDialog.querySelector('.document-skeleton');
const documentPages = document.getElementById('document-pages');
const documentError = document.getElementById('document-error');
const documentStatus = document.getElementById('document-status');
let documentRequest, documentTimeout, previousFocus;
let documentSequence = 0;
const say = (tr,en) => language === 'tr' ? tr : en;
function resetDocument() {
  documentSequence++;
  documentRequest?.abort();
  clearTimeout(documentTimeout);
  documentPages.replaceChildren();
  documentPages.hidden = true;
  documentStage.setAttribute('aria-busy','false');
  document.body.style.overflow = '';
}
document.getElementById('document-close').addEventListener('click', () => documentDialog.close());
documentDialog.addEventListener('click', event => {
  if (event.target !== documentDialog) return;
  const rect = documentDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) documentDialog.close();
});
documentDialog.addEventListener('close', () => { resetDocument(); previousFocus?.focus({preventScroll:true}); });
async function previewDocument(anchor) {
  resetDocument();
  const sequence = documentSequence;
  previousFocus = anchor;
  const url = new URL(anchor.href,location.href);
  document.getElementById('document-title').textContent = url.pathname.includes('Dogukan-Saglik-CV') ? 'Doğukan Sağlık · CV' : anchor.textContent.replace(/[↗↓]/g,'').trim();
  document.getElementById('document-open').href = url.href;
  document.getElementById('document-download').href = url.href;
  documentError.hidden = true;
  documentSkeleton.hidden = false;
  documentStatus.textContent = say('Belge yükleniyor…','Loading document…');
  documentStage.setAttribute('aria-busy','true');
  documentDialog.showModal();
  document.body.style.overflow = 'hidden';
  document.getElementById('document-close').focus();
  documentRequest = new AbortController();
  documentTimeout = setTimeout(() => documentRequest?.abort(),20000);
  try {
    const response = await fetch('assets/previews/manifest.json',{signal:documentRequest.signal});
    if (!response.ok) throw new Error('Document unavailable');
    const manifest = await response.json();
    const pages = manifest[url.pathname]?.pages;
    if (!pages?.length) throw new Error('Preview unavailable');
    if (sequence !== documentSequence || !documentDialog.open) return;
    clearTimeout(documentTimeout);
    const images = pages.map((page,index) => {
      const image = new Image();
      image.width = page.width;
      image.height = page.height;
      image.alt = document.getElementById('document-title').textContent + say(` — Sayfa ${index+1}`,` — Page ${index+1}`);
      image.loading = 'eager';
      image.src = page.src;
      documentPages.append(image);
      return image;
    });
    await Promise.race([Promise.all(images.map(image => image.decode())),new Promise((_,reject) => { documentTimeout = setTimeout(() => reject(new Error('Preview timed out')),15000); })]);
    if (sequence !== documentSequence || !documentDialog.open) return;
    clearTimeout(documentTimeout);
    documentPages.hidden = false;
    documentPages.scrollTop = 0;
    documentSkeleton.hidden = true;
    documentStage.setAttribute('aria-busy','false');
    documentStatus.textContent = say(`${pages.length} sayfa · Tam belgeyi PDF olarak indirebilirsin.`,`${pages.length} pages · Download the PDF for the full document.`);
  } catch (error) {
    if (sequence !== documentSequence || !documentDialog.open) return;
    clearTimeout(documentTimeout);
    documentSkeleton.hidden = true;
    documentStage.setAttribute('aria-busy','false');
    documentError.hidden = false;
    documentError.textContent = say('Belge önizlemesi yüklenemedi. Yeni sekmede açabilir veya dosyayı indirebilirsin.','The document preview could not load. Open it in a new tab or download the file.');
    documentStatus.textContent = say('Doğrudan belge bağlantıları kullanılabilir.','Direct document links remain available.');
  }
}
document.addEventListener('click', event => {
  const anchor = event.target.closest('a[href]');
  if (!anchor || anchor.closest('#document-preview') || anchor.hasAttribute('download') || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || typeof documentDialog.showModal !== 'function') return;
  const url = new URL(anchor.href,location.href);
  if (url.origin !== location.origin || !url.pathname.toLowerCase().endsWith('.pdf')) return;
  event.preventDefault();
  previewDocument(anchor);
});
