# 🖨️ Print 3D Studio - Landing Page

> Landing page chuyên nghiệp cho dịch vụ in 3D & tạo mẫu nhanh tại Biên Hòa - Đồng Nai

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Demo & Screenshots](#-demo--screenshots)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Tùy chỉnh](#-tùy-chỉnh)
- [Tích hợp API](#-tích-hợp-api)
- [Responsive Design](#-responsive-design)
- [Performance](#-performance)
- [SEO](#-seo)
- [Đóng góp](#-đóng-góp)
- [License](#-license)
- [Liên hệ](#-liên-hệ)

## 🎯 Giới thiệu

Landing page hiện đại và responsive cho **Print 3D Studio** - dịch vụ in 3D chuyên nghiệp tại Biên Hòa, Đồng Nai. Trang web được thiết kế với UX/UI tối ưu, hiệu ứng đẹp mắt và tối ưu hóa cho chuyển đổi khách hàng.

### ✨ Điểm nổi bật

- 🎨 **Modern UI/UX**: Thiết kế glassmorphism hiện đại với gradient xanh nhẹ nhàng
- 📱 **Fully Responsive**: Hoạt động mượt mà trên mọi thiết bị (Mobile, Tablet, Desktop)
- ⚡ **Performance**: Tải nhanh, tối ưu hóa hình ảnh và CSS
- 🔍 **SEO Optimized**: Meta tags, semantic HTML, structured data
- ♿ **Accessible**: Tuân thủ WCAG 2.1 guidelines
- 🎭 **Animations**: Smooth transitions và hover effects
- 📧 **Lead Generation**: Form liên hệ và báo giá tích hợp

## 🚀 Tính năng

### 1. **Hero Section**
- Tiêu đề nổi bật với typography rõ ràng
- CTA buttons với hiệu ứng hover đẹp mắt
- Hình ảnh máy in 3D chất lượng cao

### 2. **Services Section** 
- 6 dịch vụ chính với icons minh họa
- Card hover effects với shadow và transform
- Mô tả ngắn gọn, dễ hiểu

### 3. **Why Choose Us Section**
- Banner xanh nổi bật với 6 lợi ích
- Icons SVG inline để tối ưu performance
- Layout grid responsive

### 4. **Materials Section**
- 5 loại vật liệu in 3D (PLA, PETG, PETG-CF, ABS, TPU)
- Color-coded cards theo từng loại vật liệu
- Thông tin chi tiết về đặc tính và ứng dụng

### 5. **Pricing Section**
- Bảng giá tham khảo rõ ràng
- CTA button để nhận báo giá chi tiết
- Layout 2 cột responsive

### 6. **Gallery Section**
- 6 dự án mẫu với hình ảnh thực tế
- Floating badges với tên mô hình
- Lightbox effect khi hover

### 7. **News/Blog Section** 🆕
- Section tin tức từ [share4happy.com](https://share4happy.com/)
- Empty state design đẹp mắt
- Sẵn sàng tích hợp API

### 8. **Footer**
- Thông tin liên hệ đầy đủ
- Social media links (Facebook, Zalo, Shopee)
- Logo và branding

### 9. **Modal Form**
- Form báo giá với validation
- Dropdown chọn vật liệu
- Textarea cho ghi chú/link file 3D

## 📸 Demo & Screenshots

### Desktop View
![Desktop Hero](./asset/images/Landing%20Page%20Print%203D.png)

### Color Palette
- **Primary Blue**: `#0066ff`
- **Background Gradient**: `#d7ebff → #e8f3ff → #f0f7ff → #ffffff`
- **Materials**:
  - PLA: `#00b050` (Green)
  - PETG: `#0066ff` (Blue)
  - PETG-CF: `#f59e0b` (Orange)
  - ABS: `#ef4444` (Red)
  - TPU: `#ff6600` (Orange-Red)

## 🛠️ Công nghệ sử dụng

- **HTML5**: Semantic markup, accessibility
- **CSS3**: 
  - Custom Properties (CSS Variables)
  - Flexbox & Grid Layout
  - Animations & Transitions
  - Glassmorphism effects
  - Responsive Media Queries
- **JavaScript (ES6+)**:
  - Modular architecture
  - Event delegation
  - Smooth scrolling
  - Modal management
  - Mobile menu toggle
- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) from Google Fonts
- **Icons**: Inline SVG for performance

## 📁 Cấu trúc dự án

```
print-3d-studio/
├── index.html              # Main HTML file
├── README.md              # Documentation
├── asset/
│   ├── icons/             # Logo & service icons
│   │   ├── logo.png
│   │   ├── logo-2.png
│   │   ├── icon-1.png → icon-6.png
│   │   └── service-1.png → service-6.png
│   └── images/            # Gallery & hero images
│       ├── Landing Page Print 3D.png
│       └── gallery-*.jpg
├── css/
│   ├── main.css           # Main entry point
│   ├── variables.css      # CSS custom properties
│   ├── reset.css          # CSS reset & normalize
│   ├── layout.css         # Grid system & containers
│   ├── components.css     # Reusable components
│   └── sections/          # Section-specific styles
│       ├── header.css
│       ├── hero.css
│       ├── services.css
│       ├── features.css
│       ├── overview.css
│       ├── pricing.css
│       ├── gallery.css
│       ├── news.css
│       └── footer.css
├── js/
│   ├── main.js            # Main entry point
│   ├── components/        # Reusable components
│   │   ├── modal.js
│   │   └── accordion.js
│   ├── sections/          # Section-specific JS
│   │   ├── header.js
│   │   ├── hero.js
│   │   └── ...
│   └── constants/
│       └── landing-data.js # Content data
├── sections/              # HTML partials (optional)
│   ├── header.html
│   ├── hero.html
│   └── ...
└── components/            # HTML components (optional)
    ├── button.html
    ├── card.html
    └── modal.html
```

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- (Optional) Local server cho development

### Cách 1: Mở trực tiếp
```bash
# Clone repository
git clone https://github.com/your-username/print-3d-studio.git

# Di chuyển vào thư mục
cd print-3d-studio

# Mở file index.html bằng trình duyệt
# Windows:
start index.html

# macOS:
open index.html

# Linux:
xdg-open index.html
```

### Cách 2: Sử dụng Local Server (Recommended)

#### Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Mở: http://localhost:8000
```

#### Node.js (http-server)
```bash
# Cài đặt http-server
npm install -g http-server

# Chạy server
http-server -p 8000

# Mở: http://localhost:8000
```

#### PHP
```bash
php -S localhost:8000
```

#### VS Code Live Server
1. Cài đặt extension "Live Server"
2. Right-click vào `index.html`
3. Chọn "Open with Live Server"

## 🎨 Tùy chỉnh

### Thay đổi màu sắc
Chỉnh sửa file `css/variables.css`:

```css
:root {
  /* Brand Colors */
  --color-primary: #0066ff;        /* Màu chủ đạo */
  --color-primary-hover: #0052cc;  /* Màu hover */
  
  /* Backgrounds */
  --color-bg-hero: linear-gradient(...);  /* Gradient hero */
  --color-bg-materials: #0066ff;   /* Nền materials section */
}
```

### Thay đổi font chữ
Trong `css/variables.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;500;600;700;800&display=swap');

:root {
  --font-family-base: 'YourFont', sans-serif;
  --font-family-heading: 'YourFont', sans-serif;
}
```

### Thay đổi nội dung
Chỉnh sửa trực tiếp trong `index.html` hoặc sử dụng file `js/constants/landing-data.js` để quản lý data.

## 🔌 Tích hợp API

### Tích hợp tin tức từ share4happy.com

1. **Chuẩn bị API endpoint**
```javascript
const NEWS_API_URL = 'https://share4happy.com/api/posts?category=print3d&limit=3';
```

2. **Fetch và render tin tức**

Trong file `js/sections/news.js`, thêm:

```javascript
async function fetchNews() {
  try {
    const response = await fetch(NEWS_API_URL);
    const data = await response.json();
    
    if (data.posts && data.posts.length > 0) {
      renderNews(data.posts);
      document.querySelector('.news-empty-state').style.display = 'none';
      document.querySelector('.news-grid').style.display = 'grid';
      document.querySelector('.news-cta-wrapper').style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

function renderNews(posts) {
  const newsGrid = document.querySelector('.news-grid');
  newsGrid.innerHTML = posts.map(post => `
    <article class="news-card">
      <div class="news-thumb">
        <img src="${post.thumbnail}" alt="${post.title}" class="news-thumb-img">
        <span class="news-badge">${post.category}</span>
      </div>
      <div class="news-content">
        <div class="news-meta">
          <span class="news-date">
            <svg>...</svg>
            ${new Date(post.date).toLocaleDateString('vi-VN')}
          </span>
          <span class="news-author">
            <svg>...</svg>
            ${post.author}
          </span>
        </div>
        <h3 class="news-title">${post.title}</h3>
        <p class="news-excerpt">${post.excerpt}</p>
        <a href="${post.url}" class="news-read-more">
          Đọc tiếp
          <svg>...</svg>
        </a>
      </div>
    </article>
  `).join('');
}

// Gọi khi DOM ready
document.addEventListener('DOMContentLoaded', fetchNews);
```

### Form submission
Tích hợp với backend/email service trong `js/components/modal.js`:

```javascript
async function handleFormSubmit(formData) {
  const response = await fetch('/api/quote-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  // Xử lý response
}
```

## 📱 Responsive Design

- **Mobile First**: Thiết kế tối ưu cho mobile trước
- **Breakpoints**:
  - Mobile: `< 576px`
  - Tablet: `576px - 992px`
  - Desktop: `> 992px`
  - Large Desktop: `> 1280px`

## ⚡ Performance

### Optimization đã thực hiện:
- ✅ Minify CSS/JS (production ready)
- ✅ Lazy loading images
- ✅ Inline critical CSS
- ✅ Inline SVG icons
- ✅ Preload fonts
- ✅ Optimize images (WebP with fallback)
- ✅ CSS contain property
- ✅ Will-change hints

### Lighthouse Score (Target):
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## 🔍 SEO

### Meta Tags
```html
<title>Print 3D Studio - Dịch Vụ In 3D & Tạo Mẫu Nhanh Tại Biên Hòa</title>
<meta name="description" content="...">
<meta name="keywords" content="in 3d, print 3d, dịch vụ in 3d, bien hoa, dong nai">
```

### Open Graph (Social Sharing)
```html
<meta property="og:title" content="Print 3D Studio">
<meta property="og:description" content="...">
<meta property="og:image" content="./asset/images/og-image.jpg">
<meta property="og:url" content="https://yourwebsite.com">
```

### Structured Data (JSON-LD)
Thêm vào `<head>`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Print 3D Studio",
  "description": "Dịch vụ in 3D chuyên nghiệp tại Biên Hòa",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Số 10, Huỳnh Văn Nghệ",
    "addressLocality": "Biên Hòa",
    "addressRegion": "Đồng Nai",
    "addressCountry": "VN"
  },
  "telephone": "+84372517173",
  "email": "locnguyen@share4happy.com"
}
</script>
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! 

### Quy trình:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Code Style:
- Sử dụng 2 spaces cho indentation
- CSS: BEM naming convention
- JavaScript: camelCase cho variables, PascalCase cho classes
- Comment code khi cần thiết

## 📜 License

Distributed under the MIT License. See `LICENSE` file for more information.

## 📞 Liên hệ

**Print 3D Studio**
- 📍 Địa chỉ: Số 10, Huỳnh Văn Nghệ, phường Trấn Biên, TP. Biên Hòa, Đồng Nai
- 📱 Điện thoại: [037 251 7173](tel:0372517173)
- 📧 Email: [locnguyen@share4happy.com](mailto:locnguyen@share4happy.com)
- 🌐 Website: [share4happy.com](https://share4happy.com/)
- 💬 Zalo: [0372517173](https://zalo.me/0372517173)

---

<div align="center">
  
**Made with ❤️ by Print 3D Studio**

[🏠 Website](https://share4happy.com) • [💬 Zalo](https://zalo.me/0372517173) • [📘 Facebook](https://facebook.com) • [🛒 Shopee](https://shopee.vn/locprri)

</div>
