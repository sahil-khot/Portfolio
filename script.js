 // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  reveals.forEach(r => ro.observe(r));

  // Skill bars
  const fills = document.querySelectorAll('.skill-fill');
  const so = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.style.width = e.target.dataset.w + '%';
    });
  }, { threshold: 0.3 });
  fills.forEach(f => so.observe(f));

  // Form
  function sendMsg(btn) {
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#16a34a';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1400);
  }

  // Active nav
  const secs = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--accent)' : '';
    });
  });