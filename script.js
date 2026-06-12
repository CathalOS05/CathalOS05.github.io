// ======================================================
// THEME + SCROLL LOGIC
// ======================================================

const sections = document.querySelectorAll('.snap-section');
const themeOverlay = document.getElementById('theme-overlay');
const body = document.body;
const mainLogo = document.getElementById('main-logo');

const logos = {
  eirspace: 'assets/logos/eirspace.png',
  formulatrinity: 'assets/logos/formulatrinity.png',
  muffin: 'assets/logos/muffindynamics.png',
  buggy: 'assets/logos/buggy.png'
};

// Set default theme
body.setAttribute('data-theme', 'natural');

const obsOptions = {
  threshold: 0.35
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const theme = entry.target.dataset.theme || 'natural';

    body.setAttribute('data-theme', theme);

    setThemeOverlay(theme);

    // Update main logo
    const logoImg = document.getElementById('logo-image');

    if (logoImg && logos[theme]) {
      logoImg.src = logos[theme];
      logoImg.classList.remove('animate-in');

      requestAnimationFrame(() => {
        logoImg.classList.add('animate-in');
      });
    }

    // Reveal content
    entry.target
      .querySelectorAll('.fade-slide')
      .forEach((el) => el.classList.add('in'));
  });
}, obsOptions);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

// ======================================================
// THEME OVERLAY
// ======================================================

const overlayColors = {
  eirspace:
    'radial-gradient(circle at center, rgba(15,25,50,.95), rgba(5,8,20,.95))',

  formulatrinity:
    'linear-gradient(135deg, rgba(80,0,20,.9), rgba(20,20,20,.95))',

  muffin:
    'linear-gradient(135deg, rgba(80,60,40,.85), rgba(30,30,30,.9))',

  buggy:
    'linear-gradient(135deg, rgba(0,80,60,.85), rgba(0,20,40,.9))',

  natural:
    'linear-gradient(135deg, rgba(134,187,216,.25), rgba(117,142,79,.25))'
};

function setThemeOverlay(theme) {
  themeOverlay.style.background =
    overlayColors[theme] || overlayColors.natural;

  themeOverlay.classList.add('active');

  clearTimeout(themeOverlay.fadeTimer);

  themeOverlay.fadeTimer = setTimeout(() => {
    themeOverlay.classList.remove('active');
  }, 700);
}

// ======================================================
// CANVAS PARTICLE BACKGROUND
// ======================================================

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createParticles(count = 150) {
  particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      phase: Math.random() * Math.PI * 2
    });
  }
}

createParticles();

function getParticleColor(theme) {
  switch (theme) {
    case 'eirspace':
      return '#ffffff';

    case 'formulatrinity':
      return '#ff3048';

    case 'muffin':
      return '#d0b080';

    case 'buggy':
      return '#4effc1';

    default:
      return '#ffffff';
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const theme = body.dataset.theme || 'natural';
  const color = getParticleColor(theme);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.phase += 0.03;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;

    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(
      p.x,
      p.y,
      p.r + Math.sin(p.phase) * 0.3,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.25;
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

// ======================================================
// REDUCED MOTION ACCESSIBILITY
// ======================================================

if (
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  canvas.style.display = 'none';
  themeOverlay.style.display = 'none';
}

// ======================================================
// SMOOTH SCROLL
// ======================================================

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(
      link.getAttribute('href')
    );

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// ======================================================
// OPTIONAL: ACTIVE SECTION HIGHLIGHTING
// ======================================================

const navLinks = document.querySelectorAll('a[href^="#"]');

function updateActiveLink(id) {
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');

    if (href === `#${id}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveLink(entry.target.id);
      }
    });
  },
  {
    threshold: 0.5
  }
);

document.querySelectorAll('section[id]').forEach((section) => {
  navObserver.observe(section);
});