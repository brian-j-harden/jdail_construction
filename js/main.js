/* ============================================================
   COASTAL KITCHENS NC — Main JS
   ============================================================ */

(function () {
  'use strict';

  /* --- Sticky Nav --- */
  const header = document.querySelector('.site-header');

  function updateNav() {
    if (!header) return;
    if (header.classList.contains('solid')) return; // Inner pages: always solid
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
      header.classList.remove('transparent');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('transparent');
    }
  }

  if (header && !header.classList.contains('solid')) {
    header.classList.add('transparent');
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* --- Mobile Menu --- */
  const toggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      const isOpen = toggle.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* --- Animate elements on scroll --- */
  const animateEls = document.querySelectorAll(
    '.service-card, .work-card, .testimonial-card, .process-step, .portfolio-card, .timeline-step'
  );

  if ('IntersectionObserver' in window && animateEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    animateEls.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease ' + (i * 0.05) + 's, transform 0.5s ease ' + (i * 0.05) + 's';
      observer.observe(el);
    });
  }

  /* --- Before/After Sliders --- */
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var after = slider.querySelector('.ba-after');
    var before = slider.querySelector('.ba-before');
    var handle = slider.querySelector('.ba-handle');
    var active = false;

    function update(clientX) {
      var rect = slider.getBoundingClientRect();
      var pct = Math.min(100, Math.max(0, (clientX - rect.left) / rect.width * 100));
      after.style.clipPath  = 'inset(0 0 0 ' + pct.toFixed(1) + '%)';
      before.style.clipPath = 'inset(0 ' + (100 - pct).toFixed(1) + '% 0 0)';
      handle.style.left = pct.toFixed(1) + '%';
    }

    function snap() {
      active = false;
      slider.classList.remove('dragging');
      after.style.clipPath  = 'inset(0 0 0 50%)';
      before.style.clipPath = 'inset(0 50% 0 0)';
      handle.style.left = '50%';
    }

    slider.addEventListener('pointerdown', function (e) {
      active = true;
      slider.classList.add('dragging'); // disables CSS transitions during drag
      slider.setPointerCapture(e.pointerId);
      update(e.clientX);
      e.preventDefault();
    });
    slider.addEventListener('pointermove', function (e) {
      if (active) update(e.clientX);
    });
    slider.addEventListener('pointerup', snap);
    slider.addEventListener('pointercancel', snap);
  });

  /* --- Contact form basic validation --- */
  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = contactForm.querySelector('#name');
      const phone = contactForm.querySelector('#phone');
      const message = contactForm.querySelector('#message');
      let valid = true;

      [name, phone, message].forEach(function (field) {
        if (field && !field.value.trim()) {
          field.style.borderColor = '#B34A4A';
          valid = false;
        } else if (field) {
          field.style.borderColor = '';
        }
      });

      if (valid) {
        // TODO: Wire up to a real form handler (Formspree, Netlify Forms, etc.)
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.textContent = 'Message Sent — We\'ll Be in Touch';
        btn.disabled = true;
        btn.style.background = '#4A7A4A';
        btn.style.borderColor = '#4A7A4A';
      }
    });
  }

})();
