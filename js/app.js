/**
 * Print 3D Studio - Main Application Bundle (Universal Script)
 * Hoạt động hoàn hảo 100% trên cả:
 * - Giao thức file:/// (khi click đúp mở file HTML trực tiếp)
 * - Giao thức http:// và https:// (khi chạy qua server hoặc đưa lên web)
 */

(function () {
  'use strict';

  // ============================================================
  // CẤU HÌNH HỆ THỐNG & GOOGLE SHEET WEBHOOK
  // ============================================================
  const FACEBOOK_PAGE_URL = 'https://www.facebook.com/share/19TBLiMFEG/?mibextid=wwXIfr';
  const STORAGE_KEY = 'print3d_customer_info';
  const GOOGLE_SHEET_CONFIG = {
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1p4HGXK7mepMIxt9l2TpughyTzt762zQnVgcLwzGlalg/edit?gid=0#gid=0',
    sheetId: '1p4HGXK7mepMIxt9l2TpughyTzt762zQnVgcLwzGlalg',
    webhookUrl: 'https://script.google.com/macros/s/AKfycbwSjUh2fPMloUnloNes4bxF7pEhEFy9nHGjktMOEHFAtRnnzVcpFBkClM4PO0426t1z/exec'
  };

  // ============================================================
  // 1. QUOTE REQUEST & LEAD CAPTURE FORM CONTROLLER
  // ============================================================
  function initCTA() {
    const form = document.getElementById('leadCaptureForm');
    const formWrapper = document.getElementById('quoteFormWrapper');
    const submittedState = document.getElementById('leadSubmittedState');
    const btnReset = document.getElementById('btnResetLead');

    if (!formWrapper) return;

    // Khởi tạo Region Pills
    initRegionPills();

    // Kiểm tra khách đã từng nhập thông tin chưa
    checkAndRenderCustomerState();

    // Xử lý gửi form
    if (form) {
      form.addEventListener('submit', handleFormSubmit);

      // Xóa báo lỗi khi bắt đầu gõ
      ['leadFullName', 'leadPhone', 'leadEmail', 'leadAddress'].forEach(function (fieldId) {
        const input = document.getElementById(fieldId);
        if (input) {
          input.addEventListener('input', function () {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('has-error');
          });
        }
      });
    }

    // Nút nhập lại thông tin
    if (btnReset) {
      btnReset.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Bạn có muốn nhập lại thông tin mới không?')) {
          localStorage.removeItem(STORAGE_KEY);
          if (form) form.reset();
          resetRegionPills();
          checkAndRenderCustomerState();
        }
      });
    }

    // Các nút CTA cuộn về form
    setupCtaButtonsListener();
  }

  function initRegionPills() {
    const pills = document.querySelectorAll('.region-pill');
    const hiddenRegionInput = document.getElementById('leadRegion');
    const addressInput = document.getElementById('leadAddress');

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('is-active'); });
        pill.classList.add('is-active');

        const selectedRegion = pill.getAttribute('data-region') || 'Biên Hòa, Đồng Nai';
        if (hiddenRegionInput) {
          hiddenRegionInput.value = selectedRegion;
        }

        if (selectedRegion.indexOf('khác') !== -1 && addressInput) {
          addressInput.placeholder = 'Vui lòng nhập tên Tỉnh / Thành phố của bạn...';
          addressInput.focus();
        } else if (addressInput) {
          addressInput.placeholder = 'Phường/Xã, Quận/Huyện hoặc địa chỉ giao hàng (Tùy chọn)';
        }
      });
    });
  }

  function resetRegionPills() {
    const pills = document.querySelectorAll('.region-pill');
    const hiddenRegionInput = document.getElementById('leadRegion');
    const addressInput = document.getElementById('leadAddress');

    pills.forEach(function (p, idx) {
      if (idx === 0) p.classList.add('is-active');
      else p.classList.remove('is-active');
    });

    if (hiddenRegionInput) hiddenRegionInput.value = 'Biên Hòa, Đồng Nai';
    if (addressInput) addressInput.placeholder = 'Phường/Xã, Quận/Huyện hoặc địa chỉ giao hàng (Tùy chọn)';
  }

  function checkAndRenderCustomerState() {
    const form = document.getElementById('leadCaptureForm');
    const submittedState = document.getElementById('leadSubmittedState');
    const savedDataStr = localStorage.getItem(STORAGE_KEY);

    if (savedDataStr) {
      try {
        const data = JSON.parse(savedDataStr);
        if (data && data.fullName) {
          const savedLeadName = document.getElementById('savedLeadName');
          const savedValName = document.getElementById('savedValName');
          const savedValPhone = document.getElementById('savedValPhone');
          const savedValEmail = document.getElementById('savedValEmail');
          const savedValRegion = document.getElementById('savedValRegion');

          const displayRegion = data.address ? (data.address + ' - ' + data.region) : (data.region || '-');

          if (savedLeadName) savedLeadName.textContent = data.fullName;
          if (savedValName) savedValName.textContent = data.fullName;
          if (savedValPhone) savedValPhone.textContent = data.phone || '-';
          if (savedValEmail) savedValEmail.textContent = data.email || '-';
          if (savedValRegion) savedValRegion.textContent = displayRegion;

          if (form) form.style.display = 'none';
          if (submittedState) submittedState.style.display = 'block';
          return true;
        }
      } catch (e) {
        console.warn('Lỗi đọc localStorage:', e);
      }
    }

    if (form) form.style.display = 'block';
    if (submittedState) submittedState.style.display = 'none';
    return false;
  }

  async function handleFormSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const fullNameInput = document.getElementById('leadFullName');
    const phoneInput = document.getElementById('leadPhone');
    const emailInput = document.getElementById('leadEmail');
    const hiddenRegionInput = document.getElementById('leadRegion');
    const addressInput = document.getElementById('leadAddress');
    const submitBtn = document.getElementById('submitLeadBtn');

    let hasError = false;

    const fullName = fullNameInput ? fullNameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const region = hiddenRegionInput ? hiddenRegionInput.value : 'Biên Hòa, Đồng Nai';
    const address = addressInput ? addressInput.value.trim() : '';

    if (!fullName || fullName.length < 2) {
      showFieldError('leadFullName');
      hasError = true;
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phone || !phoneRegex.test(phone.replace(/\s+/g, ''))) {
      showFieldError('leadPhone');
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showFieldError('leadEmail');
      hasError = true;
    }

    if (hasError) return false;

    const displayRegion = address ? (address + ' (' + region + ')') : region;

    const leadData = {
      fullName: fullName,
      phone: phone,
      email: email,
      region: region,
      address: address,
      displayRegion: displayRegion,
      googleSheetTarget: GOOGLE_SHEET_CONFIG.sheetUrl,
      source: 'Website Landing Page',
      submittedAt: new Date().toLocaleString('vi-VN')
    };

    console.log('🚀 Đang gửi dữ liệu khách hàng:', leadData);

    // Trạng thái nút bấm
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Đang lưu thông tin &amp; kết nối Facebook...</span>
      `;
    }

    // 1. Lưu vào localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leadData));

    // 2. Gửi dữ liệu vào Google Sheet Webhook
    try {
      await sendLeadToGoogleSheet(leadData);
    } catch (err) {
      console.warn('Lỗi khi gửi webhook:', err);
    }

    // 3. Mở Facebook trong tab mới
    try {
      window.open(FACEBOOK_PAGE_URL, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Popup blocked:', e);
    }

    // 4. Cập nhật giao diện sang state đã gửi
    setTimeout(function () {
      checkAndRenderCustomerState();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }, 400);

    return false;
  }

  function showFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    if (input) {
      const group = input.closest('.form-group');
      if (group) {
        group.classList.add('has-error');
        input.focus();
      }
    }
  }

  async function sendLeadToGoogleSheet(data) {
    console.log('📊 Đang gửi tới Webhook:', GOOGLE_SHEET_CONFIG.webhookUrl);
    if (!GOOGLE_SHEET_CONFIG.webhookUrl) return;

    try {
      await fetch(GOOGLE_SHEET_CONFIG.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(data)
      });
      console.log('✅ Đã gửi thông tin đến Google Sheet thành công!');
    } catch (err) {
      console.warn('⚠️ Gửi webhook thất bại, lưu backup vào máy:', err);
      try {
        const historyKey = 'print3d_leads_history';
        const list = JSON.parse(localStorage.getItem(historyKey) || '[]');
        list.push(data);
        localStorage.setItem(historyKey, JSON.stringify(list));
      } catch (e) {}
    }
  }

  function setupCtaButtonsListener() {
    const ctaLinks = document.querySelectorAll('a[href="#quote-form"]');
    ctaLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetElement = document.getElementById('quote-form');
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          const isSubmitted = localStorage.getItem(STORAGE_KEY);
          if (isSubmitted) {
            const card = document.getElementById('leadSubmittedState');
            if (card) {
              card.style.transition = 'transform 0.3s ease';
              card.style.transform = 'scale(1.02)';
              setTimeout(function () { card.style.transform = 'scale(1)'; }, 350);
            }
          }
        }
      });
    });
  }

  // ============================================================
  // 2. HEADER & NAVIGATION CONTROLLER
  // ============================================================
  function initHeader() {
    const header = document.getElementById('header');
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const drawer = document.getElementById('mobileDrawer');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    window.addEventListener('scroll', function () {
      if (window.scrollY > 30) {
        if (header) header.classList.add('is-scrolled');
      } else {
        if (header) header.classList.remove('is-scrolled');
      }
      updateActiveNavLink();
    }, { passive: true });

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', function () {
        drawer.classList.toggle('is-open');
      });

      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          drawer.classList.remove('is-open');
        });
      });
    }

    function updateActiveNavLink() {
      const sections = document.querySelectorAll('section[id], footer[id]');
      const scrollPosition = window.scrollY + 120;

      sections.forEach(function (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPosition >= top && scrollPosition < top + height) {
          document.querySelectorAll('.nav-link').forEach(function (link) {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === ('#' + id)) {
              link.classList.add('is-active');
            }
          });
        }
      });
    }
  }

  // ============================================================
  // 3. MODAL CONTROLLER (Disclaimer Modal)
  // ============================================================
  function initModal() {
    const openButtons = document.querySelectorAll('.open-modal-btn');
    const modals = document.querySelectorAll('.modal');

    openButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target') || 'disclaimer-modal';
        const targetModal = document.getElementById(targetId);
        if (targetModal) {
          targetModal.classList.add('is-active');
          targetModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    modals.forEach(function (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target.dataset.close === 'true') {
          closeModal(modal);
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        modals.forEach(function (modal) {
          if (modal.classList.contains('is-active')) {
            closeModal(modal);
          }
        });
      }
    });

    function closeModal(modal) {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // ============================================================
  // 4. SMOOTH SCROLL FOR ALL ANCHORS
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
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
  }

  // ============================================================
  // 5. KHỞI TẠO TOÀN TRANG KHI DOM SẴN SÀNG
  // ============================================================
  function startApp() {
    initHeader();
    initCTA();
    initModal();
    initSmoothScroll();
    console.log('🚀 Print 3D Studio - Hệ thống JavaScript đã sẵn sàng (Tương thích file:// & http://)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
})();
