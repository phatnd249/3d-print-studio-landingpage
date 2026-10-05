/**
 * Modal Component Controller
 */
export function initModal() {
  const openButtons = document.querySelectorAll('.open-modal-btn');
  const modals = document.querySelectorAll('.modal');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target') || 'quote-modal';
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('is-active');
        targetModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target.dataset.close === 'true') {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('is-active')) {
          closeModal(modal);
        }
      });
    }
  });
}

function closeModal(modal) {
  modal.classList.remove('is-active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
