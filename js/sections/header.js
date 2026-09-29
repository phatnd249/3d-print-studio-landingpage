/**
 * Header & Navigation Controller
 */
export function initHeader() {
  const header = document.getElementById('header');
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Sticky header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    updateActiveNavLink();
  }, { passive: true });

  // Mobile menu toggle
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('is-open');
    });

    // Close mobile drawer when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('is-open');
      });
    });
  }

  // Active navigation link tracking
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }
}
