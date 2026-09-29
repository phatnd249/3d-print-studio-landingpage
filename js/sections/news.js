// ============================================================
// NEWS SECTION - WordPress API Integration
// ============================================================

const NEWS_CONFIG = {
  apiUrl: 'https://share4happy.com/wp-json/wp/v2/posts',
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
 * Tạo excerpt ngắn gọn từ content
 * @param {string} content - HTML content
 * @param {number} maxLength - Maximum length
 * @returns {string} - Plain text excerpt
 */
function createExcerpt(content, maxLength = 150) {
  const div = document.createElement('div');
  div.innerHTML = content;
  const text = div.textContent || div.innerText || '';

  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Render news card
 * @param {Object} post - WordPress post object
 * @returns {string} - HTML string
 */
function renderNewsCard(post) {
  const featuredImage = post.featured_image_url || './asset/images/placeholder-news.jpg';
  const title = post.title.rendered;
  const excerpt = post.excerpt?.rendered
    ? createExcerpt(post.excerpt.rendered, 120)
    : createExcerpt(post.content.rendered, 120);
  const date = formatVietnameseDate(post.date);
  const author = post.author_name || 'Admin';
  const postUrl = post.link;

  return `
    <article class="news-card">
      <div class="news-thumb">
        <img src="${featuredImage}" alt="${title}" class="news-thumb-img" loading="lazy">
        <span class="news-badge">In 3D</span>
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

/**
 * Fetch và hiển thị tin tức từ WordPress API
 */
async function loadNewsFromWordPress() {
  const newsGrid = document.querySelector('.news-grid');
  const emptyState = document.querySelector('.news-empty-state');
  const ctaWrapper = document.querySelector('.news-cta-wrapper');

  if (!newsGrid || !emptyState) {
    console.error('News section elements not found');
    return;
  }

  try {
    // Hiển thị loading state
    emptyState.innerHTML = `
      <div class="news-loading">
        <div class="loading-spinner"></div>
        <p>Đang tải tin tức...</p>
      </div>
    `;

    // Fetch posts với featured media và author
    const response = await fetch(
      `${NEWS_CONFIG.apiUrl}?per_page=${NEWS_CONFIG.perPage}&_embed`
    );

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
      featured_image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      author_name: post._embedded?.author?.[0]?.name || 'Admin'
    }));

    // Render news cards
    newsGrid.innerHTML = processedPosts.map(post => renderNewsCard(post)).join('');

    // Ẩn empty state và hiển thị grid + CTA
    emptyState.style.display = 'none';
    newsGrid.style.display = 'flex';
    if (ctaWrapper) {
      ctaWrapper.style.display = 'flex';
    }

    // Thêm class để hiển thị scroll indicator nếu content overflow
    setTimeout(() => {
      const container = document.querySelector('.news-container');
      if (container && newsGrid.scrollWidth > newsGrid.clientWidth) {
        container.classList.add('has-scroll');
      }
    }, 100);

  } catch (error) {
    console.error('Error loading news:', error);

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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNewsFromWordPress);
} else {
  loadNewsFromWordPress();
}
