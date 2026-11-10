'use strict';
(() => {
  const albums = {
    tunnelscope: {title:'TunnelScope · v0.9.6 alpha', repo:'tunnelscope', images:[
      ['tunnelscope-v07-report.png','docs/images/v07-report.png','Çevrimdışı HTML rapor: probların boyutu, yönü ve sonucu','Offline HTML report: probe size, direction and outcome'],
      ['tunnelscope-v07-terminal.png','docs/images/v07-terminal.png','tunnelscope show: 64 ve 1200 baytlık probların cevabı dönüyor, 1400 baytlıklar alıcıya ulaşıyor ama cevapları kayboluyor','tunnelscope show: 64- and 1200-byte probes get replies; 1400-byte probes reach the receiver but their replies are lost']
    ]},
    corepulse: {title:'CorePulse · v0.2.4 preview', repo:'CorePulse', images:[
      ['corepulse-dashboard-verified-lab.jpg','assets/dashboard-verified-lab.jpg','Servis yolu: AMF, SMF, UE, gNB ve UPF hazır, UPF\'ye giden 2 pingin 2\'si ulaşıyor','Service path: AMF, SMF, UE, gNB and UPF ready, 2 of 2 pings reach the UPF'],
      ['corepulse-dashboard-degraded.png','assets/dashboard-degraded.png','8 Kasım: AMF ve ardından UPF çöktükten sonra bütün pod\'lar hazır görünüyor ama N2 kopuk, SMF eski UPF adresini deniyor ve ping geçmiyor','8 November: after an AMF crash and then a UPF crash every pod reports ready, but N2 is lost, SMF keeps trying the old UPF address and pings fail'],
      ['corepulse-dashboard-live.png','assets/dashboard-desktop.png','6 Kasım: canlı laboratuvara bağlı dashboard ve deney geçmişi','6 November: the dashboard connected to the live lab, with run history']
    ]},
    itinerarium: {title:'Itinerarium', repo:'Itinerarium', images:[
      ['itinerarium-plan.jpeg','screenshots/plan.jpeg','Gün gün seyahat planı','Day-by-day trip planner'],
      ['itinerarium-home.jpeg','screenshots/home.jpeg','Uygulamanın karşılama ekranı','Application welcome screen'],
      ['itinerarium-tools.jpeg','screenshots/tool.jpeg','Harita, hava durumu ve döviz araçları','Maps, weather and currency tools'],
      ['itinerarium-pastplans.jpeg','screenshots/pastplans.jpeg','Kaydedilmiş seyahat planları','Saved travel plans'],
      ['itinerarium-travelogue.jpeg','screenshots/travelogue.jpeg','Seyahat günlüğü ve anılar','Travel journal and memories']
    ]},
    opscommand: {title:'OpsCommand', repo:'OpsCommand', images:[
      ['opscommand-operations.png','assets/operations.png','Sohbet ve Kubernetes operasyon ekranı','Chat and Kubernetes operations'],
      ['opscommand-dashboard.png','assets/dashboard.png','Kubernetes dashboard ve pod durumu','Kubernetes dashboard and pod status']
    ]},
    wordpress: {title:'Two-Server WordPress Lab', repo:'two-server-wordpress-lab', images:[
      ['wordpress-dashboard.png','docs/screenshots/wordpress-dashboard.png','İki sunuculu kurulumda çalışan WordPress','WordPress running across two servers'],
      ['wordpress-ubuntu.png','docs/screenshots/ubuntu-web-server.png','Ubuntu web sunucusu ve servis kontrolü','Ubuntu web server and service checks'],
      ['wordpress-debian.png','docs/screenshots/debian-db-server.png','Debian üzerinde MariaDB sunucusu','MariaDB server on Debian'],
      ['wordpress-database.png','docs/screenshots/remote-database-connection.png','Uzak veri tabanı bağlantısının doğrulanması','Verifying the remote database connection']
    ]}
  };
  const localized = (tr,en) => document.documentElement.lang === 'en' ? en : tr;
  const dialog = document.getElementById('project-gallery');
  const stage = dialog.querySelector('.gallery-stage');
  const image = document.getElementById('gallery-image');
  const skeleton = dialog.querySelector('.gallery-skeleton');
  const error = document.getElementById('gallery-error');
  let album, index = 0, loadId = 0, opener;

  function updateLabels() {
    document.querySelectorAll('[data-alt-tr]').forEach(img => { img.alt = localized(img.dataset.altTr,img.dataset.altEn); });
    document.querySelectorAll('.project-shot').forEach(link => { link.dataset.fallback = localized('Görüntüyü açmak için tıkla ↗','Click to open the image ↗'); });
    if (!album) return;
    const current = album.images[index];
    document.getElementById('gallery-title').textContent = album.title;
    document.getElementById('gallery-caption').textContent = localized(current[2],current[3]);
    document.getElementById('gallery-count').textContent = `${index + 1} / ${album.images.length}`;
    image.alt = localized(current[2],current[3]);
    document.getElementById('gallery-source').href = `https://github.com/lazypanic999/${album.repo}/blob/main/${current[1]}`;
  }
  async function show(nextIndex) {
    index = (nextIndex + album.images.length) % album.images.length;
    const request = ++loadId;
    updateLabels();
    stage.setAttribute('aria-busy','true');
    image.hidden = true;
    error.hidden = true;
    skeleton.hidden = false;
    image.src = `assets/projects/${album.images[index][0]}`;
    try {
      await image.decode();
      if (request !== loadId || !dialog.open) return;
      image.hidden = false;
    } catch {
      if (request !== loadId || !dialog.open) return;
      error.hidden = false;
    } finally {
      if (request === loadId) { skeleton.hidden = true; stage.setAttribute('aria-busy','false'); }
    }
  }
  document.querySelectorAll('[data-gallery]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      album = albums[link.dataset.gallery];
      opener = link;
      dialog.showModal();
      show(0);
    });
  });
  document.getElementById('gallery-close').addEventListener('click', () => dialog.close());
  document.getElementById('gallery-prev').addEventListener('click', () => show(index-1));
  document.getElementById('gallery-next').addEventListener('click', () => show(index+1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { ++loadId; stage.setAttribute('aria-busy','false'); skeleton.hidden = true; opener?.focus({preventScroll:true}); });
  document.querySelectorAll('.project-shot').forEach(link => {
    const cover = link.querySelector('img');
    link.classList.add('shot-pending');
    const finish = () => { link.classList.remove('shot-pending'); link.classList.toggle('shot-failed', !cover.naturalWidth); };
    cover.addEventListener('load',finish,{once:true});
    cover.addEventListener('error',finish,{once:true});
    if (cover.complete) finish();
  });
  new MutationObserver(updateLabels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  updateLabels();
})();
