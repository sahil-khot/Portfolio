// ==========================================================================
// SAHIL KHOT — SENIOR DEVELOPER & RECRUITER-READY PORTFOLIO
// Fast, Accessible, Vanilla ES6+ JavaScript
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Theme Management (Light/Dark Mode with localStorage & System Sync)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function getSavedTheme() {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      // localStorage disabled / blocked in private browsing
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'light' ? '#f8fafc' : '#090d16');
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    }
  }

  // Initialize theme
  const initialTheme = getSavedTheme();
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try {
        localStorage.setItem('portfolio-theme', next);
      } catch (e) {}
    });
  }

  // Listen to OS theme change if user hasn't explicitly set localStorage
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('portfolio-theme')) {
          applyTheme(e.matches ? 'light' : 'dark');
        }
      } catch (err) {}
    });
  }

  // --------------------------------------------------------------------------
  // 2. Scroll Progress Bar & Back to Top Button
  // --------------------------------------------------------------------------
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTopBtn = document.getElementById('backToTop');

  function updateScrollMetrics() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progressPercent}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    }
  }

  if (backToTopBtn) {
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.pointerEvents = 'none';
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', updateScrollMetrics, { passive: true });
  updateScrollMetrics();

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Drawer & Accessible Toggle
  // --------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');

  function openMobileNav() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation menu');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMobileNav);
    }

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // --------------------------------------------------------------------------
  // 4. Scroll-Spy (Accurate Nav Tracking with aria-current)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  function updateActiveNavSection() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavSection, { passive: true });
  updateActiveNavSection();

  // --------------------------------------------------------------------------
  // 5. Hero Dynamic Typed Role Rotator (Clean State Machine)
  // Starts fully typed -> holds -> deletes -> pauses -> types -> holds
  // Respects prefers-reduced-motion and clears properly on pagehide
  // --------------------------------------------------------------------------
  const roleRotator = document.getElementById('roleRotator');
  const roles = [
    'Full-Stack Developer (MERN)',
    'Software Engineer',
    'Algorithmic Problem Solver'
  ];

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (roleRotator) {
    if (prefersReducedMotion) {
      // Show first role statically for reduced motion users
      roleRotator.textContent = roles[0];
    } else {
      let roleIdx = 0;
      let charIdx = roles[0].length;
      let state = 'HOLD'; // Initial state: start fully typed
      let roleTimer = null;

      function step() {
        const currentRole = roles[roleIdx];
        let nextDelay = 100;

        switch (state) {
          case 'HOLD':
            // Hold fully typed text for 2400ms before deleting
            nextDelay = 2400;
            state = 'DELETE';
            break;

          case 'DELETE':
            if (charIdx > 0) {
              charIdx--;
              roleRotator.textContent = currentRole.slice(0, charIdx);
              nextDelay = 40;
            } else {
              // Deletion finished; advance to next role
              roleIdx = (roleIdx + 1) % roles.length;
              state = 'PAUSE';
              nextDelay = 300;
            }
            break;

          case 'PAUSE':
            // Brief pause before typing next word
            state = 'TYPE';
            nextDelay = 120;
            break;

          case 'TYPE':
            const nextRole = roles[roleIdx];
            if (charIdx < nextRole.length) {
              charIdx++;
              roleRotator.textContent = nextRole.slice(0, charIdx);
              nextDelay = 75;
            } else {
              // Word completely typed; transition to hold
              state = 'HOLD';
              nextDelay = 2400;
            }
            break;
        }

        roleTimer = setTimeout(step, nextDelay);
      }

      // Start initial hold
      roleTimer = setTimeout(step, 2400);

      window.addEventListener('pagehide', () => {
        if (roleTimer) clearTimeout(roleTimer);
      });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (roleTimer) clearTimeout(roleTimer);
        } else {
          if (roleTimer) clearTimeout(roleTimer);
          roleTimer = setTimeout(step, 1000);
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. Credibility Numbers Animated Count-Up (Once on Scroll)
  // --------------------------------------------------------------------------
  const credibilityStrip = document.getElementById('credibilityStrip');
  let hasCountedUp = false;

  function runCountUp() {
    if (hasCountedUp || prefersReducedMotion) return;
    hasCountedUp = true;

    const countEls = document.querySelectorAll('.cred-value[data-count]');
    countEls.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-count'));
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = 1600; // ms
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = progress === 1 ? target : (target * ease);

        if (decimals > 0) {
          el.textContent = currentVal.toFixed(decimals);
        } else {
          el.textContent = Math.round(currentVal).toString();
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  if (credibilityStrip && 'IntersectionObserver' in window) {
    const credObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCountUp();
          credObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    credObserver.observe(credibilityStrip);
  } else {
    runCountUp();
  }

  // --------------------------------------------------------------------------
  // 7. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // --------------------------------------------------------------------------
  // 8. Modal Management with Inert Background & Layout-Shift Free Scroll Lock
  // --------------------------------------------------------------------------
  let lastFocusedTrigger = null;

  const backgroundElements = [
    document.getElementById('siteHeader'),
    document.getElementById('main-content'),
    document.querySelector('.site-footer')
  ];

  function setBackgroundInert(isInert) {
    backgroundElements.forEach((el) => {
      if (el) {
        if (isInert) {
          el.setAttribute('inert', '');
        } else {
          el.removeAttribute('inert');
        }
      }
    });
  }

  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  window.openModal = function (modalKey, triggerEl) {
    const modal = document.getElementById(`modal-${modalKey}`);
    if (!modal) return;

    lastFocusedTrigger = triggerEl || document.activeElement;

    // Lock scroll without layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      const siteHeader = document.getElementById('siteHeader');
      if (siteHeader) siteHeader.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    // Set background elements to inert for accessible focus isolation
    setBackgroundInert(true);

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    // Focus close button or first interactive element inside modal
    const focusable = getFocusableElements(modal);
    const closeBtn = modal.querySelector('.modal-close-btn');

    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 60);
    } else if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 60);
    }
  };

  window.closeModal = function (modalKey) {
    let modal;
    if (modalKey) {
      modal = document.getElementById(`modal-${modalKey}`);
    } else {
      modal = document.querySelector('.modal-overlay.open');
    }

    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    // Remove background inert state
    setBackgroundInert(false);

    // Restore body scroll and layout shift padding
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    const siteHeader = document.getElementById('siteHeader');
    if (siteHeader) siteHeader.style.paddingRight = '';

    // Restore focus to opener element
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      setTimeout(() => {
        try {
          lastFocusedTrigger.focus();
        } catch (e) {}
        lastFocusedTrigger = null;
      }, 50);
    }
  };

  // Event delegation for opening modals via data-modal-target
  document.addEventListener('click', (e) => {
    const targetTrigger = e.target.closest('[data-modal-target]');
    if (targetTrigger) {
      const modalKey = targetTrigger.getAttribute('data-modal-target');
      if (modalKey) {
        e.preventDefault();
        window.openModal(modalKey, targetTrigger);
      }
    }

    // Closing modal via data-modal-close
    const closeTrigger = e.target.closest('[data-modal-close]');
    if (closeTrigger) {
      const modalKey = closeTrigger.getAttribute('data-modal-close');
      window.closeModal(modalKey);
    }

    // Closing modal by clicking backdrop overlay
    if (e.target.classList.contains('modal-overlay')) {
      window.closeModal();
    }
  });

  // Handle Tab key trapping inside open modal & ESC closing
  document.addEventListener('keydown', (e) => {
    const openModalEl = document.querySelector('.modal-overlay.open');

    if (e.key === 'Escape') {
      if (openModalEl) {
        window.closeModal();
      }
      if (navMenu && navMenu.classList.contains('open')) {
        closeMobileNav();
      }
      return;
    }

    if (e.key === 'Tab' && openModalEl) {
      const focusable = getFocusableElements(openModalEl);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });

  // --------------------------------------------------------------------------
  // 9. Copy Email to Clipboard with Toast Notification
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg class="icon-stroke" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" style="color: var(--accent-green);">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'sahilkhot1152005@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for older browsers
          const temp = document.createElement('textarea');
          temp.value = email;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }

        const copyTextSpan = copyEmailBtn.querySelector('.copy-text');
        if (copyTextSpan) {
          const original = copyTextSpan.textContent;
          copyTextSpan.textContent = 'Copied!';
          setTimeout(() => copyTextSpan.textContent = original, 2000);
        }

        showToast('Email address copied to clipboard!');
      } catch (err) {
        showToast('Failed to copy. Please email sahilkhot1152005@gmail.com');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. Contact Form Submission (Validation, Honeypot & FormSubmit AJAX)
  // Control visibility ONLY via .success / .error classes (no inline display toggles)
  // Verify result.success === 'true' or true
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  if (contactForm) {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const subjectInput = document.getElementById('userSubject');
    const messageInput = document.getElementById('userMessage');
    const honeypot = document.getElementById('formHoneypot');

    function validateField(input) {
      const group = input.closest('.form-field-group');
      if (!group) return true;

      let isValid = true;
      const val = input.value.trim();

      if (!val) {
        isValid = false;
      } else if (input.type === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailPattern.test(val);
      }

      if (isValid) {
        group.classList.remove('has-error');
      } else {
        group.classList.add('has-error');
      }

      return isValid;
    }

    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
          const group = input.closest('.form-field-group');
          if (group && group.classList.contains('has-error')) {
            validateField(input);
          }
        });
      }
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check anti-spam honeypot
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam submission detected and dropped.');
        return;
      }

      // Validate all fields
      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput);
      const isSubjectValid = validateField(subjectInput);
      const isMessageValid = validateField(messageInput);

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback-msg error';
          formFeedback.innerHTML = `
            <svg class="feedback-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Please fill out all required fields with valid information.</span>
          `;
        }
        return;
      }

      // Reset feedback to hidden state by class only
      if (formFeedback) {
        formFeedback.className = 'form-feedback-msg';
      }

      // Enter loading state
      if (formSubmitBtn) {
        formSubmitBtn.classList.add('loading');
        formSubmitBtn.setAttribute('disabled', 'true');
      }

      const rawSubject = subjectInput.value.trim();
      const rawMessage = messageInput.value.trim();

      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        _subject: `[Portfolio Contact] ${rawSubject}`,
        message: rawMessage,
        _template: 'table',
        _captcha: 'false',
        _honey: honeypot ? honeypot.value : ''
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/sahilkhot1152005@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && (result.success === 'true' || result.success === true)) {
          contactForm.reset();
          if (formFeedback) {
            formFeedback.className = 'form-feedback-msg success';
            formFeedback.innerHTML = `
              <svg class="feedback-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Thank you! Your message has been sent successfully to sahilkhot1152005@gmail.com. I will get back to you shortly.</span>
            `;
          }
          showToast('Message sent successfully!');
        } else {
          throw new Error((result && result.message) || 'FormSubmit returned unsuccessful response');
        }
      } catch (error) {
        // Fallback to mailto link with inline error styling
        if (formFeedback) {
          formFeedback.className = 'form-feedback-msg error';
          formFeedback.innerHTML = `
            <svg class="feedback-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Could not dispatch message automatically. Please click 
              <a href="mailto:sahilkhot1152005@gmail.com?subject=${encodeURIComponent('[Portfolio Contact] ' + rawSubject)}&body=${encodeURIComponent(rawMessage)}" style="text-decoration:underline; font-weight:600; color:inherit;">
                here to send directly via your email client &rarr;
              </a>
            </span>
          `;
        }
      } finally {
        if (formSubmitBtn) {
          formSubmitBtn.classList.remove('loading');
          formSubmitBtn.removeAttribute('disabled');
        }
      }
    });
  }

});