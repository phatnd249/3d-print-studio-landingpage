/**
 * Landing Page Data & Constants - Print 3D Studio
 */

export const SITE_METADATA = {
  title: 'Print 3D Studio - Dịch Vụ In 3D & Tạo Mẫu Nhanh Tại Biên Hòa',
  description: 'Nhận in 3D theo mẫu có sẵn hoặc thiết kế theo yêu cầu tại Biên Hòa - Đồng Nai.',
  contact: {
    address: 'Số 10, Huỳnh Văn Nghệ, phường Trấn Biên, thành phố Đồng Nai',
    phone: '037 251 7173',
    email: 'locnguyen@share4happy.com'
  },
  social: {
    facebook: 'https://www.facebook.com/share/19TBLiMFEG/?mibextid=wwXIfr',
    zalo: 'https://zalo.me/0372517173',
    shopee: 'https://shopee.vn'
  }
};

export const NAV_LINKS = [
  { label: 'Trang chủ', href: '#hero' },
  { label: 'Dịch vụ', href: '#services' },
  { label: 'Bảng giá', href: '#pricing' },
  { label: 'Sản phẩm/ Dự án', href: '#gallery' },
  { label: 'Liên hệ', href: '#footer' }
];

export const SERVICES_DATA = [
  {
    id: 1,
    icon: './asset/icons/icon-1.png',
    title: 'IN 3D THEO YÊU CẦU',
    desc: 'Nhận in từ file 3D có sẵn với nhiều kích thước và kiểu dáng khác nhau.'
  },
  {
    id: 2,
    icon: './asset/icons/icon-2.png',
    title: 'THIẾT KẾ & CHỈNH SỬA MẪU 3D',
    desc: 'Nhận in từ file 3D có sẵn với nhiều kích thước và kiểu dáng khác nhau.'
  },
  {
    id: 3,
    icon: './asset/icons/icon-3.png',
    title: 'TẠO MẪU PROTOTYPE',
    desc: 'Phù hợp với cá nhân, sinh viên, startup và doanh nghiệp cần thử nghiệm sản phẩm.'
  },
  {
    id: 4,
    icon: './asset/icons/icon-4.png',
    title: 'IN MÔ HÌNH',
    desc: 'Mô hình nhân vật, kiến trúc, sản phẩm trưng bày, mô hình học tập...'
  },
  {
    id: 5,
    icon: './asset/icons/icon-5.png',
    title: 'IN PHỤ KIỆN',
    desc: 'Mô hình nhân vật, kiến trúc, sản phẩm trưng bày, mô hình học tập...'
  },
  {
    id: 6,
    icon: './asset/icons/icon-6.png',
    title: 'IN SẢN PHẨM CÁ NHÂN HÓA',
    desc: 'Tên, logo, chữ, quà tặng hoặc các sản phẩm thiết kế riêng.'
  }
];

export const MATERIALS_DATA = [
  {
    type: 'PLA',
    color: '#00b050',
    tagline: 'Dễ in • Đẹp • Phổ biến',
    bullets: [
      'Mô hình, đồ trang trí, prototype.',
      'Phù hợp sản phẩm không yêu cầu chịu nhiệt cao.'
    ]
  },
  {
    type: 'PETG',
    color: '#0066ff',
    tagline: 'Bền • Dẻo • Chịu va đập tốt',
    bullets: [
      'Hộp, đồ DIY, chi tiết sử dụng thực tế.',
      'Phù hợp khi cần bền hơn PLA.'
    ]
  },
  {
    type: 'PETG-CF',
    color: '#f59e0b',
    tagline: 'Cứng hơn • Ổn định • Bề mặt cao cấp',
    bullets: [
      'Jig, gá đỡ, linh kiện, prototype kỹ thuật.',
      'Phù hợp chi tiết cần độ cứng và ổn định cao.'
    ]
  },
  {
    type: 'ABS',
    color: '#ef4444',
    tagline: 'Cứng • Bền • Phù hợp chi tiết kỹ thuật',
    bullets: [
      'Vỏ máy, linh kiện, chi tiết kỹ thuật.',
      'Phù hợp sản phẩm cần độ bền cơ học cao.'
    ]
  },
  {
    type: 'TPU 95A',
    color: '#ff6600',
    tagline: 'Mềm • Dẻo • Đàn hồi',
    bullets: [
      'Gioăng, ốp, đế, chi tiết chống rung.',
      'Phù hợp sản phẩm cần co giãn hoặc linh hoạt.'
    ]
  }
];

export const PRICING_TABLE = [
  { service: 'In mẫu nhỏ', price: 'Từ 50.000đ' },
  { service: 'In mô hình', price: 'Từ 100.000đ' },
  { service: 'Thiết kế 3D', price: 'Liên hệ' },
  { service: 'Đơn hàng số lượng lớn', price: 'Báo giá riêng' }
];
