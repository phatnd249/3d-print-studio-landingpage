# 📰 News Section - WordPress API Integration

## Tổng quan
Tích hợp WordPress REST API để tự động tải và hiển thị bài viết từ blog **share4happy.com** vào landing page **Print 3D Studio**.

---

## ⚙️ Cấu hình API

### WordPress REST API Endpoint
```javascript
const NEWS_CONFIG = {
  apiUrl: 'https://share4happy.com/wp-json/wp/v2/posts',
  perPage: 5,             // Lấy 5 bài viết mới nhất
  blogUrl: 'https://share4happy.com'
};
```

### Thông tin Posts
- **Số bài viết**: 5 bài mới nhất (không phân biệt category)
- **API Endpoint**: `https://share4happy.com/wp-json/wp/v2/posts?per_page=5&_embed`
- **Layout**: 1 hàng ngang với horizontal scroll

---

## 📁 Cấu trúc Files

```
print-3d-studio/
├── index.html                 # Chứa News Section HTML
├── css/
│   └── sections/
│       └── news.css          # Styles cho News Section
└── js/
    ├── main.js               # Import news.js
    └── sections/
        └── news.js           # Logic fetch & render từ WordPress API
```

---

## 🚀 Cách hoạt động

### 1. **Auto-initialization**
```javascript
// news.js tự động chạy khi DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNewsFromWordPress);
} else {
  loadNewsFromWordPress();
}
```

### 2. **Fetch WordPress Posts**
```javascript
// Lấy posts với featured image và author info
const response = await fetch(
  `${apiUrl}?categories=158&per_page=6&_embed`
);
```

### 3. **Data Processing**
- Trích xuất **Featured Image** từ `_embedded['wp:featuredmedia']`
- Trích xuất **Author Name** từ `_embedded['author']`
- Format **Date** sang định dạng `dd/mm/yyyy`
- Tạo **Excerpt** từ content (max 150 ký tự)

### 4. **Render News Cards**
```javascript
processedPosts.map(post => renderNewsCard(post))
```

---

## 🎨 UI States

### ✅ Loading State
Hiển thị spinner khi đang fetch data:
```html
<div class="news-loading">
  <div class="loading-spinner"></div>
  <p>Đang tải tin tức...</p>
</div>
```

### ✅ Success State
Hiển thị 1 hàng ngang với 5 news cards (scroll horizontal):
- **Layout**: Flexbox horizontal scroll
- **Card Width**: 340px (fixed)
- **Scrollbar**: Custom styled với smooth scroll
- **Gradient Indicator**: Fade effect ở cuối để hint scroll
- Responsive: Card width giảm xuống 280px trên mobile

### ✅ Empty State
Hiển thị khi category không có bài viết:
```html
<div class="news-empty-state">
  <h3>Nội dung đang được cập nhật</h3>
  <a href="https://share4happy.com">Ghé thăm blog</a>
</div>
```

### ❌ Error State
Hiển thị khi fetch API thất bại:
```html
<div class="news-empty-state">
  <h3>Không thể tải tin tức</h3>
  <p>Vui lòng thử lại sau...</p>
</div>
```

---

## 🔧 Tùy chỉnh

### Thay đổi số lượng bài viết
```javascript
// Trong js/sections/news.js
const NEWS_CONFIG = {
  perPage: 10  // Thay đổi từ 5 → 10 bài
};
```

### Thêm filter theo Category
```javascript
const NEWS_CONFIG = {
  categoryId: 158,  // Thêm category ID
  perPage: 5
};

// Và update fetch URL:
`${apiUrl}?categories=${categoryId}&per_page=${perPage}&_embed`
```

### Thay đổi Card Width
```css
/* Trong css/sections/news.css */
.news-card {
  min-width: 400px;  /* Thay đổi từ 340px */
  max-width: 400px;
}
```

---

## 📊 API Response Structure

### WordPress REST API Response
```json
{
  "id": 12345,
  "date": "2026-01-15T10:30:00",
  "title": {
    "rendered": "Tiêu đề bài viết"
  },
  "excerpt": {
    "rendered": "<p>Excerpt text...</p>"
  },
  "content": {
    "rendered": "<p>Full content...</p>"
  },
  "link": "https://share4happy.com/post-slug/",
  "_embedded": {
    "wp:featuredmedia": [
      {
        "source_url": "https://example.com/image.jpg"
      }
    ],
    "author": [
      {
        "name": "Tên tác giả"
      }
    ]
  }
}
```

---

## ✨ Features

✅ **Auto-fetch** từ WordPress API  
✅ **Responsive Design** (Desktop → Mobile)  
✅ **Loading State** với spinner animation  
✅ **Error Handling** với fallback UI  
✅ **Featured Image** support  
✅ **Author Info** và Date formatting  
✅ **Excerpt** auto-truncate (150 chars)  
✅ **External Link** mở trong tab mới  
✅ **SEO Friendly** với semantic HTML  

---

## 🧪 Testing

### Test API manually
```bash
curl "https://share4happy.com/wp-json/wp/v2/posts?categories=158&per_page=6&_embed"
```

### Check trong browser
1. Mở landing page
2. Scroll đến News Section
3. Mở DevTools → Console
4. Kiểm tra network requests
5. Xem log: "🚀 Print 3D Studio - All sections initialized successfully"

---

## 🐛 Troubleshooting

### Không hiển thị bài viết?
1. Kiểm tra console có lỗi không
2. Verify Category ID 158 vẫn tồn tại
3. Check CORS policy của WordPress
4. Test API endpoint trực tiếp

### Ảnh không hiển thị?
1. Kiểm tra featured image đã set chưa
2. Verify `_embed` parameter trong API call
3. Check image URL trong response

### Styling bị lỗi?
1. Verify `css/sections/news.css` đã import trong `main.css`
2. Check responsive breakpoints
3. Test trên nhiều devices

---

## 📝 Notes

- API **không cần authentication** (public endpoint)
- Data được fetch **mỗi lần page load**
- Không có caching (có thể implement nếu cần)
- Fallback image: `./asset/images/placeholder-news.jpg`

---

## 🔗 Related Files

- **HTML**: `index.html` (line 509-600)
- **CSS**: `css/sections/news.css`
- **JavaScript**: `js/sections/news.js`
- **Main Entry**: `js/main.js`

---

## 📞 Support

Nếu có vấn đề, liên hệ:
- **Email**: locnguyen@share4happy.com
- **Phone**: 037 251 7173

---

**Created**: January 2026  
**Version**: 1.0.0  
**Last Updated**: January 2026
