/**
 * Main Application Entry Point - Print 3D Studio Landing Page
 */

import { initHeader } from './sections/header.js';
import { initModal } from './components/modal.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header interactions (sticky navbar, mobile drawer)
  initHeader();

  // Initialize Consultation & Quotation Modal
  initModal();

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
});
