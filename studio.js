'use strict';
// Keep the decorative sculpture still off screen; global motion controls remain authoritative.
(() => {
  const scene = document.querySelector('.signal-scene');
  if (!scene || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { scene.dataset.idle = String(!entry.isIntersecting); });
  }, { rootMargin: '80px', threshold: 0 });
  observer.observe(scene);
})();
