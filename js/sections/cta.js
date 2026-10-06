/**
 * Section Controller: CTA / Quote Request & Lead Capture Form
 * - Quản lý form thu thập thông tin khách hàng
 * - Chỉ ghi nhớ trạng thái "đã gửi" + tên đã che trong localStorage,
 *   KHÔNG lưu SĐT / email / địa chỉ trên máy khách
 * - Tương tác Region Pills thông minh (chọn nhanh Biên Hòa, TP.HCM, Bình Dương...)
 * - Gửi dữ liệu tới endpoint Apps Script (không đưa Sheet ID/URL vào mã nguồn public)
 *
 * Lưu ý: js/app.js là bản bundle được index.html nạp (hỗ trợ cả file:// và http://).
 * Logic ở đây phải giữ giống app.js.
 */

// Endpoint nhận dữ liệu. Chống spam phải làm ở phía Apps Script (SECURITY.md).
export const LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwSjUh2fPMloUnloNes4bxF7pEhEFy9nHGjktMOEHFAtRnnzVcpFBkClM4PO0426t1z/exec';

const STORAGE_KEY = 'print3d_lead_state';
const LEGACY_PII_KEYS = ['print3d_customer_info', 'print3d_leads_history'];
const STORAGE_TTL_DAYS = 30;
const MAX_LEN = { fullName: 60, phone: 20, email: 100, address: 200 };
const SEND_TIMEOUT_MS = 12000;
const PAGE_LOADED_AT = Date.now();

let isSubmitting = false;
let sessionLead = null;

export function initCTA() {
  // Dọn dữ liệu PII của phiên bản cũ
  purgeLegacyPii();

  const form = document.getElementById('leadCaptureForm');
  const formWrapper = document.getElementById('quoteFormWrapper');
  const btnReset = document.getElementById('btnResetLead');

  if (!formWrapper) return;

  // 1. Khởi tạo tính năng chọn Region Pills
  initRegionPills();

  // 2. Kiểm tra khách đã từng gửi yêu cầu chưa
  checkAndRenderCustomerState();

  // 3. Xử lý submit (chống gửi trùng nhờ cờ isSubmitting)
  const submitBtn = document.getElementById('submitLeadBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleFormSubmit);
  }
  if (form) {
    form.addEventListener('submit', handleFormSubmit);

    ['leadFullName', 'leadPhone', 'leadEmail', 'leadAddress', 'leadConsent'].forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (input) {
        const clearError = () => {
          const group = input.closest('.form-group');
          if (group) group.classList.remove('has-error');
        };
        input.addEventListener('input', clearError);
        input.addEventListener('change', clearError);
      }
    });
  }

  // 4. Nút nhập lại thông tin / gửi yêu cầu khác
  if (btnReset) {
    btnReset.addEventListener('click', e => {
      e.preventDefault();
      if (confirm('Bạn có muốn nhập lại thông tin mới không?')) {
        clearLeadState();
        sessionLead = null;
        if (form) form.reset();
        resetRegionPills();
        setSubmitError(false);
        checkAndRenderCustomerState();
      }
    });
  }

  // 5. Lắng nghe các nút CTA trên trang trỏ về #quote-form
  setupCtaButtonsListener();
}

/**
 * Xoá các key localStorage phiên bản cũ từng chứa thông tin cá nhân
 */
function purgeLegacyPii() {
  LEGACY_PII_KEYS.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (e) { /* storage bị chặn -> bỏ qua */ }
  });
}

/**
 * Đọc trạng thái "đã gửi" đã lưu (không chứa PII), tự xoá khi quá hạn
 */
function readLeadState() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
  if (!raw) return null;

  try {
    const state = JSON.parse(raw);
    if (!state || typeof state !== 'object') return null;
    const ageDays = (Date.now() - (Number(state.submittedAt) || 0)) / 86400000;
    if (!(ageDays >= 0) || ageDays > STORAGE_TTL_DAYS) {
      clearLeadState();
      return null;
    }
    return state;
  } catch (e) {
    clearLeadState();
    return null;
  }
}

function writeLeadState(maskedName) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      v: 1,
      submittedAt: Date.now(),
      maskedName
    }));
  } catch (e) { /* storage bị chặn -> bỏ qua */ }
}

function clearLeadState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) { /* bỏ qua */ }
}

/**
 * Che bớt tên để ghi nhớ mà không lộ danh tính khách trên máy
 */
function maskFullName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'Khách hàng';
  if (parts.length === 1) return parts[0].slice(0, 2) + '***';
  const last = parts[parts.length - 1];
  return `${parts[0]} ${'*'.repeat(3)}${last.slice(-1)}`;
}

/**
 * Làm sạch giá trị nhập: bỏ ký tự điều khiển, gộp khoảng trắng, cắt độ dài
 */
function cleanValue(value, maxLen) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function isValidPhone(phone) {
  // Số di động VN: 10 số cục bộ (03x/05x/07x/08x/09x) hoặc dạng +84 + 9 số
  return /^(?:\+?84[35789]|0[35789])\d{8}$/.test(String(phone || '').replace(/[\s.()-]/g, ''));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= MAX_LEN.email;
}

/**
 * Khởi tạo tương tác chọn nhanh Khu Vực (Region Pills)
 */
function initRegionPills() {
  const pills = document.querySelectorAll('.region-pill');
  const hiddenRegionInput = document.getElementById('leadRegion');
  const addressInput = document.getElementById('leadAddress');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      const selectedRegion = pill.getAttribute('data-region') || 'Biên Hòa, Đồng Nai';
      if (hiddenRegionInput) {
        hiddenRegionInput.value = selectedRegion;
      }

      if (selectedRegion.includes('khác') && addressInput) {
        addressInput.placeholder = 'Vui lòng nhập tên Tỉnh / Thành phố cụ thể của bạn...';
        addressInput.focus();
      } else if (addressInput) {
        addressInput.placeholder = 'Phường/Xã, Quận/Huyện hoặc địa chỉ giao hàng (Tùy chọn)';
      }
    });
  });
}

/**
 * Đặt lại trạng thái Region Pills về mặc định (Biên Hòa)
 */
function resetRegionPills() {
  const pills = document.querySelectorAll('.region-pill');
  const hiddenRegionInput = document.getElementById('leadRegion');
  const addressInput = document.getElementById('leadAddress');

  pills.forEach((p, idx) => {
    if (idx === 0) p.classList.add('is-active');
    else p.classList.remove('is-active');
  });

  if (hiddenRegionInput) hiddenRegionInput.value = 'Biên Hòa, Đồng Nai';
  if (addressInput) addressInput.placeholder = 'Phường/Xã, Quận/Huyện hoặc địa chỉ giao hàng (Tùy chọn)';
}

/**
 * Render thẻ "đã gửi": dùng dữ liệu trong phiên nếu có, không thì dùng trạng thái đã lưu
 */
function checkAndRenderCustomerState() {
  const form = document.getElementById('leadCaptureForm');
  const submittedState = document.getElementById('leadSubmittedState');

  const lead = sessionLead || readLeadState();

  if (lead) {
    const isSession = !!sessionLead;
    const displayRegion = lead.address ? `${lead.address} - ${lead.region}` : (lead.region || '-');

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('savedLeadName', lead.fullName || lead.maskedName || 'Khách hàng');
    setText('savedValName', lead.fullName || lead.maskedName || '-');
    setText('savedValPhone', isSession ? (lead.phone || '-') : '••••••••');
    setText('savedValEmail', isSession ? (lead.email || '-') : '••••••••');
    setText('savedValRegion', isSession ? displayRegion : (lead.region || '••••••••'));

    const privacyNote = document.getElementById('savedPrivacyNote');
    if (privacyNote) {
      privacyNote.style.display = isSession ? 'none' : '';
    }

    if (form) form.style.display = 'none';
    if (submittedState) submittedState.style.display = 'block';
    return true;
  }

  if (form) form.style.display = 'block';
  if (submittedState) submittedState.style.display = 'none';
  return false;
}

function setSubmitError(show) {
  const box = document.getElementById('leadSubmitError');
  if (box) box.style.display = show ? 'block' : 'none';
}

/**
 * Xử lý khi khách bấm nút gửi form
 */
async function handleFormSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (isSubmitting) return false;

  const honeypot = document.getElementById('leadWebsite');
  if (honeypot && honeypot.value.trim() !== '') {
    // Bot đã điền ô ẩn -> bỏ qua, không gửi dữ liệu đi
    return false;
  }

  const fullNameInput = document.getElementById('leadFullName');
  const phoneInput = document.getElementById('leadPhone');
  const emailInput = document.getElementById('leadEmail');
  const hiddenRegionInput = document.getElementById('leadRegion');
  const addressInput = document.getElementById('leadAddress');
  const consentInput = document.getElementById('leadConsent');
  const submitBtn = document.getElementById('submitLeadBtn');

  const fullName = cleanValue(fullNameInput && fullNameInput.value, MAX_LEN.fullName);
  const phone = cleanValue(phoneInput && phoneInput.value, MAX_LEN.phone);
  const email = cleanValue(emailInput && emailInput.value, MAX_LEN.email).toLowerCase();
  const region = cleanValue(hiddenRegionInput && hiddenRegionInput.value, 60) || 'Biên Hòa, Đồng Nai';
  const address = cleanValue(addressInput && addressInput.value, MAX_LEN.address);
  const consented = !!(consentInput && consentInput.checked);

  let hasError = false;

  if (fullName.length < 2) {
    showFieldError('leadFullName');
    hasError = true;
  }
  if (!isValidPhone(phone)) {
    showFieldError('leadPhone');
    hasError = true;
  }
  if (!isValidEmail(email)) {
    showFieldError('leadEmail');
    hasError = true;
  }
  if (!consented) {
    showFieldError('leadConsent');
    hasError = true;
  }

  if (hasError) return false;

  setSubmitError(false);

  const leadData = {
    fullName,
    phone,
    email,
    region,
    address,
    source: 'Website Landing Page',
    consent: true,
    pageUrl: window.location.href.split('#')[0],
    elapsedMs: Date.now() - PAGE_LOADED_AT,
    submittedAt: new Date().toISOString()
  };

  isSubmitting = true;

  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      <span>Đang gửi thông tin...</span>
    `;
  }

  const sent = await sendLeadToGoogleSheet(leadData);

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHtml;
  }
  isSubmitting = false;

  if (!sent) {
    // Không gửi được -> giữ nguyên form để khách thử lại, không lưu gì
    setSubmitError(true);
    return false;
  }

  sessionLead = leadData;
  writeLeadState(maskFullName(fullName));
  checkAndRenderCustomerState();

  return false;
}

/**
 * Hiển thị lỗi cho trường input
 */
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

/**
 * Gửi dữ liệu lên endpoint Apps Script. Không log PII, không lưu PII xuống máy.
 */
async function sendLeadToGoogleSheet(data) {
  if (!LEAD_ENDPOINT) return false;

  const controller = ('AbortController' in window) ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), SEND_TIMEOUT_MS) : null;

  try {
    await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(data),
      signal: controller ? controller.signal : undefined
    });
    return true;
  } catch (err) {
    console.warn('[lead] Không gửi được dữ liệu:', err && err.name);
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Thiết lập các nút CTA trên trang trỏ về section báo giá
 */
function setupCtaButtonsListener() {
  const ctaLinks = document.querySelectorAll('a[href="#quote-form"]');
  ctaLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetElement = document.getElementById('quote-form');
      if (!targetElement) return;

      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      if (readLeadState()) {
        const card = document.getElementById('leadSubmittedState');
        if (card) {
          card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
          card.style.transform = 'scale(1.02)';
          setTimeout(() => {
            card.style.transform = 'scale(1)';
          }, 350);
        }
      }
    });
  });
}
