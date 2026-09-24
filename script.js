// ==========================================================================
// SAHIL KHOT — DEVELOPER PORTFOLIO JAVASCRIPT
// Lightweight, Robust, Fully Accessible, Vanilla JavaScript
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Functionality
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  function openMenu() {
    navMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when clicking any nav item
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close when clicking outside of navMenu
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== navToggle) {
        closeMenu();
      }
    });
  }

  // 2. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // 3. Modal Dialog Functionality
  window.openModal = function (modalKey) {
    const modal = document.getElementById(`modal-${modalKey}`);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Focus the close button for accessibility
      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) closeBtn.focus();
    }
  };

  window.closeModal = function (modalKey) {
    const modal = document.getElementById(`modal-${modalKey}`);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Close modals when clicking outside dialog
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // 4. Keyboard Navigation: ESC closes open menus & modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close mobile menu
      if (navMenu && navMenu.classList.contains('open')) {
        closeMenu();
      }
      // Close open modals
      document.querySelectorAll('.modal-overlay.open').forEach((overlay) => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });

  // 5. Contact Form Validation & Honest Mailto Handling
  const contactForm = document.getElementById('contactForm');
  const formSubmitBtn = document.getElementById('formSubmitBtn');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formSubmitBtn && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const subject = document.getElementById('userSubject').value.trim();
      const message = document.getElementById('userMessage').value.trim();

      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validation
      if (!name) {
        showFeedback('Please enter your name.', 'error');
        document.getElementById('userName').focus();
        return;
      }
      if (!email || !emailRegex.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        document.getElementById('userEmail').focus();
        return;
      }
      if (!subject) {
        showFeedback('Please enter a subject.', 'error');
        document.getElementById('userSubject').focus();
        return;
      }
      if (!message) {
        showFeedback('Please enter your message.', 'error');
        document.getElementById('userMessage').focus();
        return;
      }

      // Valid: Honest handling
      showFeedback('Opening your email client...', 'success');
      formSubmitBtn.disabled = true;

      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(
        `Hi Sahil,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via Portfolio Contact Form`
      );
      const mailtoUrl = `mailto:sahilkhot1152005@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      setTimeout(() => {
        window.location.href = mailtoUrl;

        setTimeout(() => {
          showFeedback(
            'If your email client did not automatically launch, you can email directly at sahilkhot1152005@gmail.com.',
            'success'
          );
          formSubmitBtn.disabled = false;
        }, 1200);
      }, 400);
    });

    function showFeedback(text, type) {
      formFeedback.textContent = text;
      formFeedback.className = `form-feedback-msg ${type}`;
    }
  }
});