(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initStyleSelector();
    initLightbox();
  });

  function initStyleSelector() {
    var cards = document.querySelectorAll('.style-card');
    cards.forEach(function (card) {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', card.classList.contains('active') ? 'true' : 'false');

      card.addEventListener('click', function () {
        setActiveStyle(this.dataset.style);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveStyle(this.dataset.style);
        }
      });
    });
  }

  function setActiveStyle(styleId) {
    document.querySelectorAll('.style-card').forEach(function (card) {
      var isActive = card.dataset.style === styleId;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('.cabinet-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.dataset.style === styleId);
    });

    var contentSection = document.querySelector('.cabinet-content-section');
    if (contentSection) {
      var top = contentSection.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  // ── Lightbox ──────────────────────────────────────────────
  var lightboxPhotos = [];
  var lightboxIndex = 0;
  var lightboxEl, lightboxImg, lightboxCounter, prevBtn, nextBtn;

  function initLightbox() {
    lightboxEl = document.getElementById('lightbox');
    if (!lightboxEl) return;

    lightboxImg     = document.getElementById('lightbox-img');
    lightboxCounter = document.getElementById('lightbox-counter');
    prevBtn         = lightboxEl.querySelector('.lightbox-prev');
    nextBtn         = lightboxEl.querySelector('.lightbox-next');
    var closeBtn    = lightboxEl.querySelector('.lightbox-close');

    // Open on photo click
    document.querySelectorAll('.cabinet-photo').forEach(function (photo) {
      photo.addEventListener('click', function () {
        var panel  = this.closest('.cabinet-panel');
        var photos = Array.from(panel.querySelectorAll('.cabinet-photo img')).map(function (img) {
          return { src: img.dataset.full || img.src, alt: img.alt };
        });
        var idx = Array.from(panel.querySelectorAll('.cabinet-photo')).indexOf(this);
        openLightbox(photos, idx);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn)  prevBtn.addEventListener('click', function () { showPhoto(lightboxIndex - 1); });
    if (nextBtn)  nextBtn.addEventListener('click', function () { showPhoto(lightboxIndex + 1); });

    // Click outside image to close
    lightboxEl.addEventListener('click', function (e) {
      if (e.target === lightboxEl || e.target === lightboxEl.querySelector('.lightbox-img-wrap')) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lightboxEl.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   showPhoto(lightboxIndex - 1);
      if (e.key === 'ArrowRight')  showPhoto(lightboxIndex + 1);
    });

    // Touch swipe
    var touchStartX = 0;
    lightboxEl.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lightboxEl.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) showPhoto(lightboxIndex + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  function openLightbox(photos, index) {
    lightboxPhotos = photos;
    showPhoto(index);
    lightboxEl.classList.add('open');
    document.body.style.overflow = 'hidden';
    var close = lightboxEl.querySelector('.lightbox-close');
    if (close) close.focus();
  }

  function closeLightbox() {
    lightboxEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPhoto(idx) {
    var total = lightboxPhotos.length;
    lightboxIndex = (idx + total) % total;
    if (lightboxImg) {
      lightboxImg.src = lightboxPhotos[lightboxIndex].src;
      lightboxImg.alt = lightboxPhotos[lightboxIndex].alt;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = (lightboxIndex + 1) + ' / ' + total;
    }
    if (prevBtn) prevBtn.style.display = total > 1 ? '' : 'none';
    if (nextBtn) nextBtn.style.display = total > 1 ? '' : 'none';
  }
})();
