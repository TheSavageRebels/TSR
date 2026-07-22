// =====================================================================
// SCRIPT PRINCIPAL — VOID REQUIEM
// Gère : le scroll fluide du bouton CTA, l'effet glitch au survol,
// et les animations de révélation au scroll (IntersectionObserver).
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------
  // 1. SCROLL FLUIDE DEPUIS LE BOUTON "Découvrir le groupe"
  // -------------------------------------------------------------
  const discoverBtn = document.getElementById('discoverBtn');
  const aboutSection = document.getElementById('about');

  if (discoverBtn && aboutSection) {
    discoverBtn.addEventListener('click', () => {
      aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });

    // Effet glitch déclenché au survol (ajoute/retire une classe CSS)
    discoverBtn.addEventListener('mouseenter', () => {
      discoverBtn.classList.add('is-glitching');
    });
    discoverBtn.addEventListener('mouseleave', () => {
      discoverBtn.classList.remove('is-glitching');
    });
  }

  // -------------------------------------------------------------
  // 2. SCROLL FLUIDE POUR TOUS LES LIENS D'ANCRE DE LA NAV
  // -------------------------------------------------------------
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // -------------------------------------------------------------
  // 3. ANIMATIONS DE REVELATION AU SCROLL
  //    On observe les blocs de contenu et on ajoute "is-visible"
  //    quand ils entrent dans le viewport.
  // -------------------------------------------------------------
  const revealTargets = document.querySelectorAll(
    '.section-header, .about-text, .member-card, .gallery-item'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animation jouée une seule fois
      }
    });
  }, {
    threshold: 0.15
  });

  revealTargets.forEach(el => observer.observe(el));

  // Décalage progressif (stagger) pour les cartes de membres et la galerie
  document.querySelectorAll('.members-grid .member-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });
  document.querySelectorAll('.gallery-grid .gallery-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.06}s`;
  });

  // -------------------------------------------------------------
  // 4. SECURITE VIDEO : relance l'autoplay si le navigateur le bloque
  //    (certains navigateurs mobiles suspendent l'autoplay)
  // -------------------------------------------------------------
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.play().catch(() => {
      // Si l'autoplay est bloqué, on retente au premier clic utilisateur
      document.body.addEventListener('click', () => heroVideo.play(), { once: true });
    });
  }

});
