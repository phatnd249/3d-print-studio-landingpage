/**
 * News/Blog Section - Fetch từ share4happy.com API
 */

// Configuration
const NEWS_CONFIG = {
  apiUrl: 'https://share4happy.com/wp-json/wp/v2/posts',
  categoryId: 158, // Testing category 158
  perPage: 6,
  timeout: 10000 // 10 seconds
};

/**
 * Fetch news từ WordPress REST API
 */
async function fetchNews() {
  try {
    const url = `${NEWS_CONFIG.apiUrl}?categories=${NEWS_CONFIG.categoryId}&_embed&per_page=${NEWS_CONFIG.perPage}`;

    console.log('Fetching news from:', url);

    // Fetch với timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), NEWS_CONFIG.timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();
    console.log('Fetched posts:', posts);

    return posts;

  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

/**
 * Extract featured image từ _embedded data
 */
function getFeaturedImage(post) {
  try {
    if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
      const media = post._embedded['wp:featuredmedia'][0];

      // Ưu tiên sizes theo thứ tự: medium_large > medium > full
      if (media.media_details && media.media_details.sizes) {
        const sizes = media.media_details.sizes;
        if (sizes.medium_large) return sizes.medium_large.source_url;
        if (sizes.medium) return sizes.medium.source_url;
      }

      return media.source_url || '';
    }
  } catch (error) {
    console.warn('Error extracting featured image:', error);
  }

  return 'https://via.placeholder.com/400x300?text=No+Image';
}

/**
 * Extract category name từ _embedded data
 */
function getCategoryName(post) {
  try {
    if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]) {
      const categories = post._embedded['wp:term'][0];
      if (categories.length > 0) {
        return categories[0].name;
      }
    }
  } catch (error) {
    console.warn('Error extracting category:', error);
  }

  return 'Tin tức';
}

/**
 * Extract author name từ _embedded data
 */
function getAuthorName(post) {
  try {
    if (post._embedded && post._embedded.author && post._embedded.author[0]) {
      return post._embedded.author[0].name;
    }
  } catch (error) {
    console.warn('Error extracting author:', error);
  }

  return 'Admin';
}

/**
 * Format date theo định dạng Việt Nam
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return '';
  }
}

/**
 * Decode HTML entities
 */
function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

/**
 * Strip HTML tags và giới hạn độ dài
 */
function getExcerpt(content, maxLength = 150) {
  // Remove HTML tags
  const stripped = content.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  const decoded = decodeHtml(stripped);

  // Trim và limit length
  const trimmed = decoded.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return trimmed.substring(0, maxLength).trim() + '...';
}

/**
 * Render một news card
 */
function renderNewsCard(post) {
  const featuredImage = getFeaturedImage(post);
  const category = getCategoryName(post);
  const author = getAuthorName(post);
  const date = formatDate(post.date);
  const title = decodeHtml(post.title.rendered);
  const excerpt = post.excerpt ? getExcerpt(post.excerpt.rendered) : '';

  return `
    <article class="news-card">
      <div class="news-thumb">
        <img src="${featuredImage}" alt="${title}" class="news-thumb-img" loading="lazy">
        <span class="news-badge">${category}</span>
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
        <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="news-read-more">
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
 * Render news grid với posts
 */
function renderNewsGrid(posts) {
  const newsGrid = document.querySelector('.news-grid');
  const newsEmptyState = document.querySelector('.news-empty-state');
  const newsCtaWrapper = document.querySelector('.news-cta-wrapper');

  if (!newsGrid) {
    console.error('News grid element not found');
    return;
  }

  if (posts && posts.length > 0) {
    // Có bài viết: hiển thị grid
    newsGrid.innerHTML = posts.map(post => renderNewsCard(post)).join('');
    newsGrid.style.display = 'grid';

    // Ẩn empty state
    if (newsEmptyState) {
      newsEmptyState.style.display = 'none';
    }

    // Hiển thị CTA "Xem tất cả"
    if (newsCtaWrapper) {
      newsCtaWrapper.style.display = 'block';
    }

    console.log(`Rendered ${posts.length} news posts`);
  } else {
    // Không có bài viết: hiển thị empty state
    if (newsEmptyState) {
      newsEmptyState.style.display = 'block';
    }

    newsGrid.style.display = 'none';

    if (newsCtaWrapper) {
      newsCtaWrapper.style.display = 'none';
    }

    console.log('No news posts found - showing empty state');
  }
}

/**
 * Initialize news section
 */
async function initNews() {
  console.log('Initializing news section...');

  try {
    const posts = await fetchNews();
    renderNewsGrid(posts);
  } catch (error) {
    console.error('Failed to initialize news:', error);
    // Giữ nguyên empty state khi có lỗi
    renderNewsGrid([]);
  }
}

// Export functions
window.NewsModule = {
  init: initNews,
  fetch: fetchNews,
  render: renderNewsGrid
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNews);
} else {
  initNews();
}
