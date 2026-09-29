/**
 * Main Application Entry Point - Print 3D Studio Landing Page
 */

// Import all section initializers
import { initHeader } from './sections/header.js';
import { initHero } from './sections/hero.js';
import { initServices } from './sections/services.js';
import { initFeatures } from './sections/features.js';
import { initProcess } from './sections/process.js';
import { initGallery } from './sections/gallery.js';
import { initOverview } from './sections/overview.js';
import { initFAQ } from './sections/faq.js';
import { initCTA } from './sections/cta.js';
import { initFooter } from './sections/footer.js';
import { initNews } from './sections/news.js';

// Import components
import { initModal } from './components/modal.js';
import { initAccordion } from './components/accordion.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all sections in order
  initHeader();
  initHero();
  initServices();
  initFeatures();
  initProcess();
  initGallery();
  initOverview();
  initFAQ();
  initCTA();
  initNews();
  initFooter();

  // Initialize components
  initModal();
  initAccordion();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  console.log('🚀 Print 3D Studio - All sections initialized successfully');
});
