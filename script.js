// --- THEME + SCROLL LOGIC ---
const sections = document.querySelectorAll('.snap-section');
const themeOverlay = document.getElementById('theme-overlay');
const body = document.body;
const mainLogo = document.getElementById('main-logo');
const logos = {
  // IDs must match the section's logo placeholder
  eirspace:  'assets/logos/eirspace.png',
  formulatrinity: 'assets/logos/formulatrinity.png',
  muffin: 'assets/logos/muffindynamics.png',
  buggy: 'assets/logos/buggy.png'
};

// Intersection Observer
const obsOptions = { threshold: 0.55 };
const sectionObserver = new window.IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Which theme?
      const theme = entry.target.getAttribute('data-theme');
      body.setAttribute('data-theme', theme || 'natural');
      sectionSetThemeOverlay(theme || 'natural');

      // Animate logo
      const logoId = `logo-${theme}`;
      document.querySelectorAll('.project-logo').forEach(el => el.classList.remove('animate-in'));
      const logoEl = document.getElementById(logoId);
      if (logoEl) {
        logoEl.classList.add('animate-in');
        // Swap main logo as needed too
        if (logos[theme]) {
          mainLogo.innerHTML = `<img src="${logos[theme]}" alt="Logo" />`;
          setTimeout(() => mainLogo.classList.add('animate-in'), 100);
        } else {
          mainLogo.innerHTML = '';
        }
      }
      // Animate content progressive reveal
      entry.target.querySelectorAll('.fade-slide').forEach(e => e.classList.add('in'));
    }
  });
}, obsOptions);

sections.forEach(el => sectionObserver.observe(el));

// Set overlay background using theme variable (for animated backgrounds later)
function sectionSetThemeOverlay(theme) {
  // Could animate overlay or trigger canvas animations depending on theme!
  themeOverlay.style.background = getComputedStyle(document.body).getPropertyValue('--project-bg');
}

// ---- PARTICLE/STARFIELD CANVAS ANIMATION ----
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let stars = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createStars(count) {
  stars = [];
  for (let i = 0; i < count; ++i) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.25 + 0.04,
      tw: Math.random() * Math.PI * 2
    });
  }
}
createStars(180);

function animateStars() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Color by theme
  const theme = body.getAttribute('data-theme') || 'natural';
  let color = '#9be9f3';
  if (theme === 'eirspace') color = '#fff4ed';
  else if (theme === 'formulatrinity') color = '#ff193a';
  else if (theme === 'muffin') color = '#b0d7ff';
  else if (theme === 'buggy') color = '#67ffce';
  // Draw
  for (const s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r + 0.4*Math.sin(s.tw), 0, 2 * Math.PI);
    ctx.fillStyle = color + '99';
    ctx.globalAlpha = 0.33;
    ctx.fill();
    ctx.globalAlpha = 1;
    s.x += s.speed;
    if (s.x > canvas.width) s.x = 0;
    s.tw += 0.035;
  }
  requestAnimationFrame(animateStars);
}
animateStars();

// ---- ACCESSIBILITY ----
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.getElementById('bg-canvas').style.display = 'none';
  document.getElementById('theme-overlay').style.display = 'none';
}

// ---- OPTIONAL: Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.focus();
    }
  });
}); 