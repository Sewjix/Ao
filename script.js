/* ============================================
   BASTION Capital — JavaScript
   Interactions, animations, cursor, scroll
   ============================================ */

/*
 * EmailJS setup — https://www.emailjs.com/
 * 1. Create a free account
 * 2. Add an Email Service (Gmail, Outlook, SMTP, etc.)
 * 3. Create an Email Template with variables:
 *      {{from_name}}, {{from_email}}, {{inquiry_type}}, {{message}}
 * 4. Replace the three IDs below with your real values.
 *
 * The form sends to: shizuniu@sewjixcapital.com
 * (set this as the "To Email" in your EmailJS template)
 */
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_xxxxxx'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xxxxxx'

/*
 * BTC Price Ticker — intentionally static at $87,420.
 * The value lives in the HTML and is never fetched from a live API,
 * so it will always display exactly $87,420.
 */

(function () {
  'use strict';

  /* ---- Loader ---- */
  const loader = document.getElementById('loader');

  function hideLoader() {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    initAnimations();
  }

  // Hide after fonts/resources settle — 1.8s feels right with the animation
  window.addEventListener('load', () => setTimeout(hideLoader, 1800));
  // Fallback in case load fires late
  setTimeout(hideLoader, 3500);

  /* ---- Custom Cursor ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = document.querySelectorAll(
      'a, button, .project-card, .service-item, .nav-toggle'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        follower.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        follower.classList.remove('hovered');
      });
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }

  /* ---- Navigation ---- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Scrolled state
    if (currentScrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });

  /* ---- Scroll Animations ---- */
  function initAnimations() {
    // Animate lines (section titles)
    const animateLines = document.querySelectorAll('.animate-line');
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 120);
          lineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    animateLines.forEach(el => lineObserver.observe(el));

    // Generic scroll reveal
    const revealEls = document.querySelectorAll(
      '.project-card, .service-item, .stat-item, .value-item, .testimonial-author, .contact-detail, .footer-col'
    );

    revealEls.forEach(el => el.classList.add('scroll-reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // Stagger cards
    const grids = document.querySelectorAll('.projects-grid, .services-list, .stats-inner');
    grids.forEach(grid => {
      const children = grid.querySelectorAll('.scroll-reveal');
      children.forEach((child, i) => {
        child.style.transitionDelay = (i * 0.08) + 's';
      });
    });

    // Counter animation
    initCounters();
  }

  /* ---- Counter Animation ---- */
  function initCounters() {
    const counters = document.querySelectorAll('.count');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.textContent);
          animateCounter(el, 0, target, 1800);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + (end - start) * eased);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = end;
      }
    }
    requestAnimationFrame(update);
  }

  /* ---- Testimonial Slider ---- */
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.t-dots span');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  let currentSlide = 0;
  let autoplayTimer;

  function goToSlide(index) {
    testimonials[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + testimonials.length) % testimonials.length;
    testimonials[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoplay(); });
    nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoplay(); });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); resetAutoplay(); });
    });
    startAutoplay();
  }

  /* ---- Smooth Anchor Scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Contact Form (EmailJS) ---- */
  emailjs.init(EMAILJS_PUBLIC_KEY);

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('.btn-submit');
      const originalHTML = btn.innerHTML;

      // Sending state
      btn.innerHTML = '<span>Sending…</span><span class="btn-arrow">↻</span>';
      btn.disabled = true;

      const templateParams = {
        from_name:    document.getElementById('name').value,
        from_email:   document.getElementById('email').value,
        inquiry_type: document.getElementById('service').value,
        message:      document.getElementById('message').value,
        // This must match the "To Email" field in your EmailJS template
        to_email:     'shizuniu@sewjixcapital.com',
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          // Success state
          btn.innerHTML = '<span>Inquiry Sent ✓</span><span class="btn-arrow">✓</span>';
          btn.style.background = 'var(--highlight)';
          btn.style.color = 'var(--black)';
          contactForm.reset();
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 4000);
        })
        .catch((err) => {
          // Error state
          console.error('EmailJS error:', err);
          btn.innerHTML = '<span>Failed — Try Again</span>';
          btn.style.background = '#c0392b';
          btn.style.color = '#fff';
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 3500);
        });
    });
  }

  /* ---- Parallax for Hero Grid ---- */
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ---- Project Card Tilt ---- */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ---- Marquee Speed on Hover ---- */
  document.querySelectorAll('.marquee-track, .clients-track').forEach(track => {
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  });

  /* ---- Active Nav Link on Scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.contact-btn)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--white)' : '';
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---- Page visibility handling ---- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(autoplayTimer);
    } else {
      startAutoplay();
    }
  });

})();
