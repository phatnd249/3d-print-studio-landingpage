/**
 * Section Controller: CTA / Quote Request & Lead Capture Form
 * - Quản lý form thu thập thông tin khách hàng
 * - Lưu trạng thái vào localStorage để ghi nhớ khách hàng đã điền
 * - Tương tác Region Pills thông minh (chọn nhanh Biên Hòa, TP.HCM, Bình Dương...)
 * - Kết nối dữ liệu vào Google Sheets của khách hàng:
 *   https://docs.google.com/spreadsheets/d/1p4HGXK7mepMIxt9l2TpughyTzt762zQnVgcLwzGlalg/edit
 * - Tự động chuyển hướng mở Facebook Fanpage
 */

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/share/19TBLiMFEG/?mibextid=wwXIfr';
const STORAGE_KEY = 'print3d_customer_info';

// Thông tin Google Sheet của bạn
export const GOOGLE_SHEET_CONFIG = {
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1p4HGXK7mepMIxt9l2TpughyTzt762zQnVgcLwzGlalg/edit?gid=0#gid=0',
  sheetId: '1p4HGXK7mepMIxt9l2TpughyTzt762zQnVgcLwzGlalg',
  webhookUrl: 'https://script.google.com/macros/s/AKfycbwSjUh2fPMloUnloNes4bxF7pEhEFy9nHGjktMOEHFAtRnnzVcpFBkClM4PO0426t1z/exec'
};

export function initCTA() {
  const form = document.getElementById('leadCaptureForm');
  const formWrapper = document.getElementById('quoteFormWrapper');
  const submittedState = document.getElementById('leadSubmittedState');
  const btnReset = document.getElementById('btnResetLead');

  if (!formWrapper) return;

  // 1. Khởi tạo tính năng chọn Region Pills
  initRegionPills();

  // 2. Kiểm tra xem khách đã từng nhập thông tin chưa
  checkAndRenderCustomerState();

  // 3. Xử lý submit form
  if (form) {
    form.addEventListener('submit', handleFormSubmit);

    // Xóa class lỗi khi người dùng bắt đầu gõ
    ['leadFullName', 'leadPhone', 'leadEmail', 'leadAddress'].forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (input) {
        input.addEventListener('input', () => {
          const group = input.closest('.form-group');
          if (group) group.classList.remove('has-error');
        });
      }
    });
  }

  // 4. Nút nhập lại thông tin / gửi yêu cầu khác
  if (btnReset) {
    btnReset.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Bạn có muốn nhập lại thông tin mới không?')) {
        localStorage.removeItem(STORAGE_KEY);
        if (form) form.reset();
        resetRegionPills();
        checkAndRenderCustomerState();
      }
    });
  }

  // 5. Lắng nghe các nút CTA trên trang trỏ về #quote-form
  setupCtaButtonsListener();
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
      // Bỏ active tất cả
      pills.forEach(p => p.classList.remove('is-active'));
      // Active pill được click
      pill.classList.add('is-active');

      const selectedRegion = pill.getAttribute('data-region') || 'Biên Hòa, Đồng Nai';
      if (hiddenRegionInput) {
        hiddenRegionInput.value = selectedRegion;
      }

      // Nếu chọn "Tỉnh / Thành khác" thì focus vào ô nhập địa chỉ chi tiết
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
 * Kiểm tra trạng thái trong localStorage và hiển thị view tương ứng
 */
function checkAndRenderCustomerState() {
  const form = document.getElementById('leadCaptureForm');
  const submittedState = document.getElementById('leadSubmittedState');
  const savedDataStr = localStorage.getItem(STORAGE_KEY);

  if (savedDataStr) {
    try {
      const data = JSON.parse(savedDataStr);
      if (data && data.fullName) {
        // Cập nhật thông tin vào view đã gửi
        const savedLeadName = document.getElementById('savedLeadName');
        const savedValName = document.getElementById('savedValName');
        const savedValPhone = document.getElementById('savedValPhone');
        const savedValEmail = document.getElementById('savedValEmail');
        const savedValRegion = document.getElementById('savedValRegion');

        const displayRegion = data.address ? `${data.address} - ${data.region}` : (data.region || '-');

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
      console.warn('Lỗi đọc dữ liệu khách hàng từ localStorage', e);
    }
  }

  // Nếu chưa có hoặc lỗi -> hiện form nhập
  if (form) form.style.display = 'block';
  if (submittedState) submittedState.style.display = 'none';
  return false;
}

/**
 * Xử lý khi khách bấm nút gửi form
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const fullNameInput = document.getElementById('leadFullName');
  const phoneInput = document.getElementById('leadPhone');
  const emailInput = document.getElementById('leadEmail');
  const hiddenRegionInput = document.getElementById('leadRegion');
  const addressInput = document.getElementById('leadAddress');
  const submitBtn = document.getElementById('submitLeadBtn');

  // Validate các trường
  let hasError = false;

  const fullName = fullNameInput ? fullNameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const region = hiddenRegionInput ? hiddenRegionInput.value : 'Biên Hòa, Đồng Nai';
  const address = addressInput ? addressInput.value.trim() : '';

  // Validate Họ tên
  if (!fullName || fullName.length < 2) {
    showFieldError('leadFullName');
    hasError = true;
  }

  // Validate SĐT Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09...)
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!phone || !phoneRegex.test(phone.replace(/\s+/g, ''))) {
    showFieldError('leadPhone');
    hasError = true;
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showFieldError('leadEmail');
    hasError = true;
  }

  if (hasError) return;

  const displayRegion = address ? `${address} (${region})` : region;

  // Thu thập dữ liệu khách hàng
  const leadData = {
    fullName,
    phone,
    email,
    region,
    address,
    displayRegion,
    googleSheetTarget: GOOGLE_SHEET_CONFIG.sheetUrl,
    source: 'Website Landing Page',
    submittedAt: new Date().toLocaleString('vi-VN')
  };

  // Trạng thái đang xử lý trên nút bấm
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

  // 2. Gửi dữ liệu về Google Sheets (đồng bộ với file Google Sheet của bạn)
  await sendLeadToGoogleSheet(leadData);

  // 3. Mở Facebook trong tab mới
  window.open(FACEBOOK_PAGE_URL, '_blank', 'noopener,noreferrer');

  // 4. Cập nhật giao diện sang state ĐÃ ĐIỀN THÀNH CÔNG
  setTimeout(() => {
    checkAndRenderCustomerState();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  }, 400);
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
 * Hàm gửi dữ liệu lên Google Sheets
 * Tương thích với Google Apps Script Webhook đã được tạo cho file Google Sheet của bạn
 */
async function sendLeadToGoogleSheet(data) {
  console.log('📊 Chuẩn bị ghi vào Google Sheet:', GOOGLE_SHEET_CONFIG.sheetUrl);
  console.log('📋 Dữ liệu gửi:', data);

  if (!GOOGLE_SHEET_CONFIG.webhookUrl) {
    // Lưu tạm thời vào lịch sử leads trên browser
    saveToLocalLeadsHistory(data);
    return;
  }

  try {
    await fetch(GOOGLE_SHEET_CONFIG.webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(data)
    });
    console.log('✅ Đã gửi dữ liệu khách hàng lên Google Sheet thành công');
  } catch (err) {
    console.warn('⚠️ Lỗi gửi Google Sheet:', err);
    saveToLocalLeadsHistory(data);
  }
}

/**
 * Backup danh sách leads vào localStorage để không bao giờ bị mất dữ liệu
 */
function saveToLocalLeadsHistory(data) {
  try {
    const historyKey = 'print3d_leads_history';
    const list = JSON.parse(localStorage.getItem(historyKey) || '[]');
    list.push(data);
    localStorage.setItem(historyKey, JSON.stringify(list));
  } catch (e) {
    // Ignore storage quota errors
  }
}

/**
 * Thiết lập các nút CTA trên trang trỏ về section báo giá
 */
function setupCtaButtonsListener() {
  const ctaLinks = document.querySelectorAll('a[href="#quote-form"]');
  ctaLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetElement = document.getElementById('quote-form');
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Nếu khách đã điền rồi, nhấp nháy nhẹ khung thông tin để khách chú ý nút Facebook
        const isSubmitted = localStorage.getItem(STORAGE_KEY);
        if (isSubmitted) {
          const card = document.getElementById('leadSubmittedState');
          if (card) {
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
              card.style.transform = 'scale(1)';
            }, 350);
          }
        }
      }
    });
  });
}
