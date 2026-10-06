// ============================================================
// NEWS SECTION - WordPress API Integration + Carousel
// ============================================================

const NEWS_CONFIG = {
  apiUrl: 'https://share4happy.com/wp-json/wp/v2/posts',
  categoryId: 208, // Chuyên mục "3D Print Studio"
  perPage: 5,
  blogUrl: 'https://share4happy.com'
};

/**
 * Format ngày tháng tiếng Việt
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date (dd/mm/yyyy)
 */
function formatVietnameseDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Escape HTML trước khi chèn vào template string
 * @param {*} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Chỉ cho phép URL http(s) từ domain tin cậy, tránh javascript:/data: và domain lạ
 * @param {string} rawUrl
 * @param {string[]} allowedHosts
 * @param {string} fallback
 * @returns {string}
 */
function safeUrl(rawUrl, allowedHosts, fallback) {
  try {
    const url = new URL(String(rawUrl), window.location.href);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return fallback;
    const hostOk = allowedHosts.some(host => url.hostname === host || url.hostname.endsWith('.' + host));
    return hostOk ? url.href : fallback;
  } catch (e) {
    return fallback;
  }
}

/**
 * Bóc tag HTML của nội dung WordPress mà không kích hoạt tải ảnh / script.
 * DOMParser tạo document "inert" nên <script> và onerror= không chạy.
 * @param {string} content - HTML content
 * @returns {string} - Plain text
 */
function htmlToPlainText(content) {
  try {
    const doc = new DOMParser().parseFromString(String(content || ''), 'text/html');
    return (doc.body && (doc.body.textContent || '')) || '';
  } catch (e) {
    return '';
  }
}

/**
 * Tạo excerpt ngắn gọn từ content
 * @param {string} content - HTML content
 * @param {number} maxLength - Maximum length
 * @returns {string} - Plain text excerpt
 */
function createExcerpt(content, maxLength = 150) {
  const text = htmlToPlainText(content).replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Render news card
 * @param {Object} post - WordPress post object
 * @returns {string} - HTML string
 */
function renderNewsCard(post) {
  const allowedHosts = ['share4happy.com'];
  const featuredImage = safeUrl(post.featured_image_url, [...allowedHosts, 'localhost'], './asset/images/gallery-figure.jpg');
  const title = escapeHtml(htmlToPlainText(post.title && post.title.rendered));
  const excerpt = escapeHtml(
    post.excerpt?.rendered
      ? createExcerpt(post.excerpt.rendered, 120)
      : createExcerpt(post.content.rendered, 120)
  );
  const date = escapeHtml(formatVietnameseDate(post.date));
  const author = escapeHtml(post.author_name || 'Admin');
  const postUrl = safeUrl(post.link, allowedHosts, '#');

  return `
    <article class="news-card">
      <div class="news-thumb">
        <img src="${featuredImage}" alt="${title}" class="news-thumb-img" loading="lazy">
      </div>
      <div class="news-content">
        <div class="news-meta">
          <span class="news-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${date}
          </span>
          <span class="news-author">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            ${author}
          </span>
        </div>
        <h3 class="news-title">${title}</h3>
        <p class="news-excerpt">${excerpt}</p>
        <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="news-read-more">
          Đọc tiếp
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </article>
  `;
}

// ============================================================
// CAROUSEL ENGINE
// ============================================================

let isNewsLoaded = false;
let carouselState = {
  currentIndex: 0,
  totalCards: 0,
  visibleCards: 3,
  gap: 24,
  autoPlayTimer: null,
  autoPlayDelay: 5000,
  isDragging: false,
  startX: 0,
  currentTranslate: 0,
  prevTranslate: 0,
};

/**
 * Tính số card hiển thị dựa trên viewport width
 */
function getVisibleCards() {
  const width = window.innerWidth;
  if (width <= 640) return 1;
  if (width <= 1024) return 2;
  return 3;
}

/**
 * Tính số "page" (steps) của carousel
 */
function getTotalPages() {
  const maxIndex = carouselState.totalCards - carouselState.visibleCards;
  return Math.max(1, maxIndex + 1);
}

/**
 * Update carousel position with smooth animation
 */
function updateCarousel(animate = true) {
  const track = document.querySelector('.news-carousel-track');
  const prevBtn = document.querySelector('.news-carousel-prev');
  const nextBtn = document.querySelector('.news-carousel-next');

  if (!track) return;

  const cards = track.querySelectorAll('.news-card');
  if (cards.length === 0) return;

  // Calculate card width from the first card's actual rendered width
  const trackWidth = track.parentElement.clientWidth;
  const totalGaps = (carouselState.visibleCards - 1) * carouselState.gap;
  const cardWidth = (trackWidth - totalGaps) / carouselState.visibleCards;

  // Set card widths
  cards.forEach(card => {
    card.style.width = `${cardWidth}px`;
  });

  // Calculate offset
  const offset = carouselState.currentIndex * (cardWidth + carouselState.gap);

  if (animate) {
    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
  } else {
    track.style.transition = 'none';
  }
  track.style.transform = `translateX(-${offset}px)`;
  carouselState.currentTranslate = -offset;
  carouselState.prevTranslate = -offset;

  // Update button states
  const maxIndex = carouselState.totalCards - carouselState.visibleCards;
  if (prevBtn) prevBtn.disabled = carouselState.currentIndex <= 0;
  if (nextBtn) nextBtn.disabled = carouselState.currentIndex >= maxIndex;

  // Update dots
  updateDots();
}

/**
 * Generate and update dot pagination
 */
function updateDots() {
  const dotsContainer = document.querySelector('.news-carousel-dots');
  if (!dotsContainer) return;

  const totalPages = getTotalPages();

  // Only regenerate dots if count changed
  if (dotsContainer.children.length !== totalPages) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'news-carousel-dot';
      dot.setAttribute('aria-label', `Trang ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Update active state
  const dots = dotsContainer.querySelectorAll('.news-carousel-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === carouselState.currentIndex);
  });
}

/**
 * Navigate to a specific slide
 */
function goToSlide(index) {
  const maxIndex = carouselState.totalCards - carouselState.visibleCards;
  carouselState.currentIndex = Math.max(0, Math.min(index, maxIndex));
  updateCarousel();
}

/**
 * Navigate to next slide
 */
function nextSlide() {
  const maxIndex = carouselState.totalCards - carouselState.visibleCards;
  if (carouselState.currentIndex < maxIndex) {
    carouselState.currentIndex++;
    updateCarousel();
  }
}

/**
 * Navigate to previous slide
 */
function prevSlide() {
  if (carouselState.currentIndex > 0) {
    carouselState.currentIndex--;
    updateCarousel();
  }
}

/**
 * Auto-play carousel
 */
function startAutoPlay() {
  stopAutoPlay();
  carouselState.autoPlayTimer = setInterval(() => {
    const maxIndex = carouselState.totalCards - carouselState.visibleCards;
    if (carouselState.currentIndex >= maxIndex) {
      carouselState.currentIndex = 0;
    } else {
      carouselState.currentIndex++;
    }
    updateCarousel();
  }, carouselState.autoPlayDelay);
}

function stopAutoPlay() {
  if (carouselState.autoPlayTimer) {
    clearInterval(carouselState.autoPlayTimer);
    carouselState.autoPlayTimer = null;
  }
}

function resetAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

/**
 * Setup touch/swipe support
 */
function setupSwipe() {
  const viewport = document.querySelector('.news-carousel-viewport');
  if (!viewport) return;

  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let isHorizontalSwipe = null;

  function onTouchStart(e) {
    isDragging = true;
    isHorizontalSwipe = null;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    stopAutoPlay();
  }

  function onTouchMove(e) {
    if (!isDragging) return;

    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;

    // Determine swipe direction on first move
    if (isHorizontalSwipe === null) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 5) {
        isHorizontalSwipe = true;
      } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 5) {
        isHorizontalSwipe = false;
        isDragging = false;
        return;
      }
    }

    if (isHorizontalSwipe) {
      e.preventDefault();
    }
  }

  function onTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - startX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    startAutoPlay();
  }

  viewport.addEventListener('touchstart', onTouchStart, { passive: true });
  viewport.addEventListener('touchmove', onTouchMove, { passive: false });
  viewport.addEventListener('touchend', onTouchEnd, { passive: true });

  // Mouse drag support for desktop
  viewport.addEventListener('mousedown', onTouchStart);
  viewport.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    onTouchMove(e);
  });
  viewport.addEventListener('mouseup', onTouchEnd);
  viewport.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      startAutoPlay();
    }
  });
}

/**
 * Setup keyboard navigation
 */
function setupKeyboard() {
  const carousel = document.querySelector('.news-carousel');
  if (!carousel) return;

  carousel.setAttribute('tabindex', '0');
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Tin tức carousel');

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoPlay();
    }
  });
}

/**
 * Handle window resize
 */
function handleResize() {
  const newVisibleCards = getVisibleCards();
  if (newVisibleCards !== carouselState.visibleCards) {
    carouselState.visibleCards = newVisibleCards;
    // Ensure current index is valid
    const maxIndex = carouselState.totalCards - carouselState.visibleCards;
    if (carouselState.currentIndex > maxIndex) {
      carouselState.currentIndex = Math.max(0, maxIndex);
    }
  }
  updateCarousel(false);
}

// ============================================================
// MAIN INIT
// ============================================================

/**
 * Fetch và hiển thị tin tức từ WordPress API
 */
export async function initNews() {
  if (isNewsLoaded) return;
  
  const newsCarousel = document.querySelector('.news-carousel');
  const emptyState = document.querySelector('.news-empty-state');
  const ctaWrapper = document.querySelector('.news-cta-wrapper');
  const track = document.querySelector('.news-carousel-track');

  if (!track || !emptyState) {
    console.error('News section elements not found');
    return;
  }

  isNewsLoaded = true;

  try {
    // Hiển thị loading state
    emptyState.innerHTML = `
      <div class="news-loading">
        <div class="loading-spinner"></div>
        <p>Đang tải tin tức...</p>
      </div>
    `;

    // Fetch posts với featured media và author
    const fetchUrl = NEWS_CONFIG.categoryId
      ? `${NEWS_CONFIG.apiUrl}?categories=${NEWS_CONFIG.categoryId}&per_page=${NEWS_CONFIG.perPage}&_embed`
      : `${NEWS_CONFIG.apiUrl}?per_page=${NEWS_CONFIG.perPage}&_embed`;

    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();

    if (posts.length === 0) {
      // Giữ nguyên empty state nếu không có bài viết
      emptyState.innerHTML = `
        <div class="news-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        <h3 class="news-empty-title">Nội dung đang được cập nhật</h3>
        <p class="news-empty-text">
          Chúng tôi đang chuẩn bị những bài viết hữu ích về công nghệ in 3D.
        </p>
      `;
      return;
    }

    // Xử lý data với featured image và author
    const processedPosts = posts.map(post => ({
      ...post,
      featured_image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || './asset/images/gallery-figure.jpg',
      author_name: post._embedded?.author?.[0]?.name || 'Admin'
    }));

    // Render news cards into carousel track
    track.innerHTML = processedPosts.map(post => renderNewsCard(post)).join('');

    // Setup carousel state
    carouselState.totalCards = processedPosts.length;
    carouselState.visibleCards = getVisibleCards();
    carouselState.currentIndex = 0;

    // Ẩn empty state và hiển thị carousel + CTA
    emptyState.style.display = 'none';
    if (newsCarousel) newsCarousel.style.display = 'block';
    if (ctaWrapper) {
      ctaWrapper.style.display = 'flex';
      ctaWrapper.style.justifyContent = 'center';
    }

    // Initialize carousel UI
    updateCarousel(false);

    // Setup navigation buttons
    const prevBtn = document.querySelector('.news-carousel-prev');
    const nextBtn = document.querySelector('.news-carousel-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    // Setup swipe, keyboard, and auto-play
    setupSwipe();
    setupKeyboard();
    startAutoPlay();

    // Pause auto-play on hover
    if (newsCarousel) {
      newsCarousel.addEventListener('mouseenter', stopAutoPlay);
      newsCarousel.addEventListener('mouseleave', startAutoPlay);
    }

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    });

  } catch (error) {
    console.error('Error loading news:', error);
    isNewsLoaded = false;

    // Hiển thị error state
    emptyState.innerHTML = `
      <div class="news-empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 class="news-empty-title">Không thể tải tin tức</h3>
      <p class="news-empty-text">
        Vui lòng thử lại sau hoặc truy cập trực tiếp blog của chúng tôi.
      </p>
      <a href="${NEWS_CONFIG.blogUrl}" target="_blank" rel="noopener noreferrer" class="news-empty-cta">
        <span>Ghé thăm blog</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>
    `;
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNews);
} else {
  initNews();
}
