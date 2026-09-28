// ==========================================================================
// SAHIL KHOT — PROFESSIONAL DEVELOPER PORTFOLIO
// Fast, Lightweight, Fully Accessible, Vanilla JavaScript
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Mobile Menu Functionality & Accessible Toggle
  // --------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  function openMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation menu');
  }

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
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

  // --------------------------------------------------------------------------
  // 2. Active Nav Link on Scroll
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 140;

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

  // --------------------------------------------------------------------------
  // 3. Modal Dialog Functionality with Focus Trap & Focus Restoration
  // --------------------------------------------------------------------------
  let lastFocusedElement = null;

  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  window.openModal = function (modalKey) {
    const modal = document.getElementById(`modal-${modalKey}`);
    if (!modal) return;

    lastFocusedElement = document.activeElement;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button or first interactive element
    const focusable = getFocusableElements(modal);
    const closeBtn = modal.querySelector('.modal-close-btn');

    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50);
    } else if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 50);
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
    document.body.style.overflow = '';

    // Restore focus to opener element
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      setTimeout(() => {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }, 50);
    }
  };

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        window.closeModal();
      }
    });
  });

  // Handle Tab key trapping inside open modal & ESC closing
  document.addEventListener('keydown', (e) => {
    const openModalEl = document.querySelector('.modal-overlay.open');

    if (e.key === 'Escape') {
      if (navMenu && navMenu.classList.contains('open')) {
        closeMenu();
      }
      if (openModalEl) {
        window.closeModal();
      }
      return;
    }

    // Modal focus trapping
    if (e.key === 'Tab' && openModalEl) {
      const focusable = getFocusableElements(openModalEl);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });

  // Keyboard support for interactive preview cards (Enter or Space to open modal)
  document.querySelectorAll('.project-preview-wrap[role="button"]').forEach((cardPreview) => {
    cardPreview.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cardPreview.click();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Contact Form - Direct Email Dispatch to Sahil
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSubmitBtn = document.getElementById('formSubmitBtn');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formSubmitBtn && formFeedback) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const subjectInput = document.getElementById('userSubject');
      const messageInput = document.getElementById('userMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) {
        showFeedback('Please enter your name.', 'error');
        if (nameInput) nameInput.focus();
        return;
      }
      if (!email || !emailRegex.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        if (emailInput) emailInput.focus();
        return;
      }
      if (!subject) {
        showFeedback('Please enter a subject.', 'error');
        if (subjectInput) subjectInput.focus();
        return;
      }
      if (!message) {
        showFeedback('Please enter your message.', 'error');
        if (messageInput) messageInput.focus();
        return;
      }

      // UI Loading State
      const originalBtnHTML = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = 'Sending Message...';
      showFeedback('Sending your message directly to Sahil...', 'success');

      try {
        const response = await fetch('https://formsubmit.co/ajax/sahilkhot1152005@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `[Portfolio Contact] ${subject}`,
            message: message,
            _captcha: 'false',
            _template: 'table'
          })
        });

        const result = await response.json();

        if (response.ok && (result.success === 'true' || result.success === true || result.message)) {
          showFeedback(`Thank you, ${name}! Your message has been sent directly to Sahil. He will reply to ${email} soon.`, 'success');
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Form submission failed');
        }
      } catch (err) {
        // Fallback: If network or browser blocks endpoint, provide clear direct mailto option
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(`Hi Sahil,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via Portfolio Contact Form`);
        const mailtoUrl = `mailto:sahilkhot1152005@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

        showFeedback(
          'Direct network dispatch failed. Opening your email client to send to sahilkhot1152005@gmail.com...',
          'error'
        );
        window.location.href = mailtoUrl;
      } finally {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnHTML;
      }
    });

    function showFeedback(text, type) {
      formFeedback.textContent = text;
      formFeedback.className = `form-feedback-msg ${type}`;
    }
  }
});