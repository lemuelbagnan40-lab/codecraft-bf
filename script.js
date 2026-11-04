// ===== GESTION DU THÈME SOMBRE/CLAIR =====
function toggleTheme() {
  const body = document.body;
  const themeButton = document.querySelector('.theme-toggle');

  // Basculer la classe dark-theme
  body.classList.toggle('dark-theme');

  // Changer l'icône du bouton
  if (body.classList.contains('dark-theme')) {
    themeButton.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    themeButton.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
}

// Charger le thème sauvegardé au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const themeButton = document.querySelector('.theme-toggle');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeButton.textContent = '☀️';
  }
});

// ===== NAVIGATION FLUIDE =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== ANIMATION DES BARRES DE COMPÉTENCES =====
// Observer pour déclencher l'animation quand les barres sont visibles
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const skillBars = entry.target.querySelectorAll('.skill-bar');
      skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observer la section compétences
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
  observer.observe(skillsSection);
}

// ===== ANIMATION AU SCROLL =====
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');

  if (window.scrollY > 100) {
    navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  } else {
    navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  }
});

// ===== MESSAGE DE BIENVENUE DANS LA CONSOLE =====
console.log('%c🎉 Bienvenue sur mon portfolio !', 'font-size: 20px; color: #0066cc; font-weight: bold;');
console.log('%cCe site a été créé avec HTML, CSS, JavaScript et déployé avec GitHub Pages', 'font-size: 14px; color: #6c757d;');