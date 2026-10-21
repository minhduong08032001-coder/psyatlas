# PsyAtlas – gói đưa lên web

Thư mục này là bản tĩnh (HTML/CSS/JS thuần), chạy ngay không cần máy chủ. Điểm vào: index.html.

## Cách 1: GitHub Pages (miễn phí)
1. Tạo tài khoản tại github.com, bấm New repository, đặt tên (ví dụ psyatlas), chọn Public.
2. Bấm "uploading an existing file", kéo TOÀN BỘ nội dung thư mục này (index.html, css, js, data, .nojekyll, NOTICE.md) vào, bấm Commit.
3. Vào Settings > Pages > Source: "Deploy from a branch", Branch: main, thư mục /(root), Save.
4. Sau 1-2 phút trang có địa chỉ https://<tên-bạn>.github.io/psyatlas/

## Cách 2: Netlify Drop (nhanh nhất, không cần Git)
Mở app.netlify.com/drop, kéo thả thư mục này vào, nhận ngay link công khai.

## Cách 3: Cloudflare Pages
Pages > Create > Upload assets, tải thư mục lên.

## Lưu ý
- Sách PDF người dùng nạp ở mục Thư viện chỉ lưu trong trình duyệt của họ, không lên máy chủ.
- Muốn cập nhật: sửa trong thư mục psyatlas rồi chép lại index.html, css, js, data sang đây và tải lên lại.
