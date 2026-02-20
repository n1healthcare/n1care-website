/* ============================================
   n1.care
   Nav, scroll reveals, particle hero, form mock
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Nav ---
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile Nav Toggle (with scroll-lock, backdrop, ESC) ---
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const backdrop = document.querySelector('.nav-backdrop');

  function closeNav() {
    if (!toggle || !links) return;
    toggle.classList.remove('open');
    links.classList.remove('open');
    document.body.classList.remove('nav-open');
    if (nav) nav.classList.remove('nav-open');
    if (backdrop) backdrop.classList.remove('active');
  }

  function openNav() {
    if (!toggle || !links) return;
    toggle.classList.add('open');
    links.classList.add('open');
    document.body.classList.add('nav-open');
    if (nav) nav.classList.add('nav-open');
    if (backdrop) backdrop.classList.add('active');
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      if (links.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeNav);
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeNav);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        closeNav();
      }
    });
  }

  // --- Active Nav Link ---
  const path = location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.nav-links a:not(.btn)').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === '/')) {
      a.classList.add('active');
    }
  });

  // --- Hero Visual Selector ---
  const hero = document.querySelector('.hero');
  const visDots = document.querySelectorAll('.vis-dot');
  const heroVisuals = document.querySelectorAll('.hero-vis');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (visDots.length && heroVisuals.length) {
    visDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const target = dot.dataset.vis;
        heroVisuals.forEach(v => v.classList.remove('active'));
        const vis = document.querySelector(`.hero-vis--${target}`);
        if (vis) vis.classList.add('active');
        visDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');

        // Restart process animation if switching to it
        if (target === 'process') startProcessAnim();
        else stopProcessAnim();
      });
    });
  }

  // --- Process Animation (Upload → Extract → Report → Success) ---
  let processTimer = null;
  const isMobile = window.innerWidth <= 768;
  const STAGE_DURATION = isMobile ? 2800 : 3800; // faster on mobile

  function startProcessAnim() {
    stopProcessAnim();
    const container = document.querySelector('.hero-vis--process');
    if (!container) return;

    const stages = container.querySelectorAll('.process-stage');
    const stepInds = container.querySelectorAll('.process-step-ind');
    const stepLines = container.querySelectorAll('.process-step-line');
    let current = 0;
    const TOTAL_STAGES = 3; // upload, extract, report

    function showStage(index) {
      // Hide all stages
      stages.forEach(s => s.classList.remove('active'));
      // Show target
      stages[index].classList.add('active');

      // Update step indicators
      stepInds.forEach((ind, i) => {
        ind.classList.toggle('active', i <= index);
      });
      stepLines.forEach((line, i) => {
        line.classList.toggle('filled', i < index);
      });

      // Re-trigger animations on the extract card rows
      if (index === 1) {
        const rows = stages[1].querySelectorAll('.process-data-row');
        rows.forEach(row => {
          row.style.animation = 'none';
          row.offsetHeight; // force reflow
          row.style.animation = '';
        });
      }

      // Re-trigger upload animations (progress bar, content fade, done check)
      if (index === 0) {
        const uploadEls = stages[0].querySelectorAll('.process-doc-progress-bar, .process-doc-content, .process-doc-done, .process-doc-done-circle, .process-doc-done-tick');
        uploadEls.forEach(el => {
          el.style.animation = 'none'; el.offsetHeight; el.style.animation = '';
        });
      }

      // Re-trigger report card animations
      if (index === 2) {
        const anims = stages[2].querySelectorAll('.report-anim');
        anims.forEach(el => {
          el.style.animation = 'none';
          el.offsetHeight;
          el.style.animation = '';
        });
      }
    }

    // Start with upload
    showStage(0);

    function nextStage() {
      current = (current + 1) % TOTAL_STAGES;
      showStage(current);
      processTimer = setTimeout(nextStage, STAGE_DURATION);
    }

    processTimer = setTimeout(nextStage, STAGE_DURATION);
  }

  function stopProcessAnim() {
    if (processTimer) {
      clearTimeout(processTimer);
      processTimer = null;
    }
  }

  // Auto-start if process is the default active visual
  if (document.querySelector('.hero-vis--process.active')) {
    startProcessAnim();
  }

  // --- Mouse tracking for Tide parallax ---
  // Disable on touch devices and reduced motion
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  if (hero && !isTouch) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = (e.clientX - rect.left) - rect.width / 2;
      targetY = (e.clientY - rect.top) - rect.height / 2;
    });

    hero.addEventListener('mouseleave', () => {
      targetX = 0; targetY = 0;
    });
  }

  // --- Parallax for Tide waves ---
  function tick() {
    curX += (targetX - curX) * 0.05;
    curY += (targetY - curY) * 0.05;

    const activeBg = hero && hero.querySelector('.hero-bg.active');
    if (activeBg && activeBg.children.length > 0) {
      const kids = activeBg.children;
      for (let i = 0; i < kids.length; i++) {
        const s = 0.02 + (i * 0.008);
        kids[i].style.translate = `${curX * s}px ${curY * s}px`;
      }
    }

    requestAnimationFrame(tick);
  }

  if (hero && !reducedMotion && !isTouch) tick();

  // --- Scroll Reveal (IntersectionObserver) ---
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  }

  // --- Contact Form ---
  const form = document.querySelector('#contact-form');
  const formSuccess = document.querySelector('.form-success');
  const formError = document.querySelector('.form-error');
  if (form && formSuccess) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      // Reset error state
      if (formError) formError.classList.remove('show');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const data = Object.fromEntries(new FormData(form));

        const resp = await fetch('https://api.n1.care/support/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!resp.ok) throw new Error(resp.status);

        form.style.display = 'none';
        formSuccess.classList.add('show');
      } catch (err) {
        btn.textContent = originalText;
        btn.disabled = false;
        if (formError) formError.classList.add('show');
      }
    });
  }

  // --- Platform Tabs ---
  const tabs = document.querySelectorAll('.platform-tab');
  const panels = document.querySelectorAll('.platform-panel');
  if (tabs.length && panels.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.querySelector(`.platform-panel[data-panel="${target}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // --- FAQ Accordion ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (faqQuestions.length) {
    faqQuestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        // Close all others
        faqQuestions.forEach(other => {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            other.nextElementSibling.classList.remove('open');
          }
        });

        // Toggle current
        btn.setAttribute('aria-expanded', !isOpen);
        answer.classList.toggle('open', !isOpen);
      });
    });
  }

});
