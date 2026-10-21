'use strict';
const readPreference = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
let language = readPreference('ds-language', 'tr');
if (!['tr','en'].includes(language)) language = 'tr';
let activeFilter = 'all';
const descriptions = {tr:'Doğukan Sağlık — Bilgisayar mühendisliği öğrencisi. Linux, bulut altyapısı, Kubernetes ve full-stack yazılım projeleri.',en:'Doğukan Sağlık — Computer Engineering student working with Linux, cloud infrastructure, Kubernetes and full-stack software.'};
function applyLanguage(next) {
  language = next;
  document.documentElement.lang = next;
  document.querySelectorAll('[data-tr][data-en]').forEach(element => { element.textContent = element.dataset[next].replace(/\\n/g, '\n'); });
  document.querySelectorAll('[data-label-tr]').forEach(element => { element.setAttribute('aria-label', next === 'tr' ? element.dataset.labelTr : element.dataset.labelEn); });
  const button = document.getElementById('lang');
  button.innerHTML = `${next === 'tr' ? 'EN' : 'TR'} <span aria-hidden="true">↗</span>`;
  button.setAttribute('aria-label', next === 'tr' ? 'Switch to English' : 'Türkçeye geç');
  document.querySelector('meta[name="description"]').content = descriptions[next];
  document.querySelector('meta[property="og:description"]').content = next === 'tr' ? 'Koddan çalışan sistemlere. Projeler, deneyim ve güncel CV.' : 'From code to working systems. Projects, experience and current CV.';
  document.getElementById('copy-status').textContent = '';
  updateThemeLabel();
  applyFilter(activeFilter, false);
  savePreference('ds-language', next);
}
function updateThemeLabel() {
  const light = document.documentElement.dataset.theme === 'light';
  const label = language === 'tr' ? (light ? 'Koyu temaya geç' : 'Açık temaya geç') : (light ? 'Switch to dark theme' : 'Switch to light theme');
  const button = document.getElementById('theme');
  button.setAttribute('aria-label', label);
  button.title = label;
  button.textContent = light ? '◑' : '◐';
}
function applyFilter(filter, announce = true) {
  activeFilter = filter;
  let count = 0;
  document.querySelectorAll('[data-category]').forEach(project => { project.hidden = filter !== 'all' && !project.dataset.category.split(' ').includes(filter); if (!project.hidden) count++; });
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  if (announce) document.getElementById('filter-status').textContent = language === 'tr' ? `${count} proje gösteriliyor.` : `${count} projects shown.`;
}
const savedTheme = readPreference('ds-theme', 'dark');
document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';
document.getElementById('theme').addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; savePreference('ds-theme', next); updateThemeLabel(); });
document.getElementById('lang').addEventListener('click', () => applyLanguage(language === 'tr' ? 'en' : 'tr'));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
let copyTimer;
document.getElementById('copy-email').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try { await navigator.clipboard.writeText('dogukansaglik8563@gmail.com'); status.textContent = language === 'tr' ? 'E-posta kopyalandı.' : 'Email copied.'; }
  catch { status.textContent = language === 'tr' ? 'Adres kopyalanamadı. E-posta bağlantısını kullanabilirsin.' : 'Could not copy. Please use the email link.'; }
  clearTimeout(copyTimer); copyTimer = setTimeout(() => { status.textContent = ''; }, 6000);
});
const certificates = [
 ['Introduction to Python','datacamp-introduction-to-python.pdf'],['Intermediate Python','datacamp-intermediate-python.pdf'],['Joining Data with pandas','datacamp-joining-data-pandas.pdf'],['Introduction to Statistics in Python','datacamp-introduction-to-statistics.pdf'],['Introduction to Data Visualization with Seaborn','datacamp-data-visualization-seaborn.pdf'],['Exploratory Data Analysis in Python','datacamp-exploratory-data-analysis.pdf'],['Sampling in Python','datacamp-sampling-in-python.pdf'],['Hypothesis Testing in Python','datacamp-hypothesis-testing.pdf']
];
const certificateList = document.getElementById('more-cert-list');
certificates.forEach(([name,file]) => { const anchor = document.createElement('a'); anchor.href = `certs/${file}`; anchor.target = '_blank'; anchor.rel = 'noopener'; anchor.textContent = name; const arrow = document.createElement('span'); arrow.textContent = '↗'; anchor.append(arrow); certificateList.append(anchor); });
document.getElementById('year').textContent = new Date().getFullYear();
applyLanguage(language);
