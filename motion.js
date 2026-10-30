'use strict';
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const motionButton = document.getElementById('motion');
let motionPaused = readPreference('ds-motion', 'on') === 'off';
let revealObserver;
let tiltFrame = 0;
let scrollFrame = 0;
const glassPanel = document.querySelector('.hero-visual');
const progress = document.querySelector('.reading-progress');
function motionIsOn() { return !motionPaused && !motionPreference.matches; }
function updateMotionLabel() {
  const paused = !motionIsOn();
  const label = language === 'tr' ? (paused ? 'Animasyonları etkinleştir' : 'Animasyonları duraklat') : (paused ? 'Enable animations' : 'Pause animations');
  motionButton.setAttribute('aria-label', label);
  motionButton.title = label;
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.disabled = motionPreference.matches;
  if (motionPreference.matches) {
    const reducedLabel = language === 'tr' ? 'Sistem tercihi: azaltılmış hareket' : 'System preference: reduced motion';
    motionButton.title = reducedLabel;
    motionButton.setAttribute('aria-label', reducedLabel);
  }
}
function clearTilt() {
  cancelAnimationFrame(tiltFrame);
  glassPanel.style.removeProperty('--tilt-x');
  glassPanel.style.removeProperty('--tilt-y');
}
function syncMotion() {
  const enabled = motionIsOn();
  document.documentElement.dataset.motion = enabled ? 'on' : 'off';
  updateMotionLabel();
  revealObserver?.disconnect();
  document.querySelectorAll('.reveal-pending').forEach(element => element.classList.remove('reveal-pending'));
  if (!enabled) { clearTilt(); return; }
  if (!('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.section-heading,.project,.experience-intro,.timeline article,.about-copy,.skills>div,.certifications,.contact-section').forEach(element => {
    element.classList.add('reveal-item');
    if (element.getBoundingClientRect().top > window.innerHeight - 30) {
      element.classList.add('reveal-pending');
      revealObserver.observe(element);
    }
  });
}
motionButton.addEventListener('click', () => {
  motionPaused = !motionPaused;
  savePreference('ds-motion', motionPaused ? 'off' : 'on');
  syncMotion();
});
motionPreference.addEventListener('change', syncMotion);
finePointer.addEventListener('change', clearTilt);
glassPanel.addEventListener('pointermove', event => {
  if (!motionIsOn() || !finePointer.matches || event.pointerType === 'touch') return;
  const bounds = glassPanel.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
  const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
  cancelAnimationFrame(tiltFrame);
  tiltFrame = requestAnimationFrame(() => {
    glassPanel.style.setProperty('--tilt-x', `${(0.5-y)*5}deg`);
    glassPanel.style.setProperty('--tilt-y', `${(x-0.5)*7}deg`);
    glassPanel.style.setProperty('--shine-x', `${x*100}%`);
    glassPanel.style.setProperty('--shine-y', `${y*100}%`);
  });
});
glassPanel.addEventListener('pointerleave', clearTilt);
glassPanel.addEventListener('pointercancel', clearTilt);
function updateScroll() {
  scrollFrame = 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY/maxScroll)) : 0})`;
  const sections = [...document.querySelectorAll('main>section[id]')];
  let active = '';
  for (const section of sections) if (section.getBoundingClientRect().top <= 200) active = section.id;
  document.querySelectorAll('nav a').forEach(anchor => {
    if (anchor.hash === `#${active}`) anchor.setAttribute('aria-current','location');
    else anchor.removeAttribute('aria-current');
  });
}
function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
window.addEventListener('scroll', scheduleScroll, { passive:true });
window.addEventListener('resize', scheduleScroll, { passive:true });
document.getElementById('lang').addEventListener('click', updateMotionLabel);
document.querySelector('meta[name="theme-color"]').content = document.documentElement.dataset.theme === 'light' ? '#e7dcec' : '#0a090a';
syncMotion();
updateScroll();
