# TASK_WEEK_4 — FEED + POSTS + RESTAURANTS (Team 4 người, mỗi người 12h)

> Repo: CIDO_nhom_5  
> Quy tắc: Giữ nguyên code gốc, mỗi thành viên làm trên branch riêng, hạn chế conflict để Leader merge nhanh.

---

## 0) QUY TẮC CHỐNG CONFLICT (BẮT BUỘC)

### 0.1. Chỉ Leader/Integrator được sửa file “trung tâm”
**KHÔNG ai ngoài Leader được sửa:**
- `server/src/index.js`
- `client/src/App.jsx`
- `.env`, `.env.example`, `README.md`
- `package.json` (cả client & server) — trừ khi Leader yêu cầu

➡️ Thành viên chỉ **tạo file mới** hoặc **sửa file thuộc module mình** theo phân công dưới đây.

### 0.2. Mỗi module = 1 route file / 1 page + components riêng
- Backend routes: `server/src/routes/*.js`
- Frontend pages: `client/src/pages/*.jsx`
- Frontend components: `client/src/components/*.jsx`

### 0.3. Chuẩn hoá commit message
- `feat(posts): ...`
- `feat(restaurants): ...`
- `feat(feed): ...`
- `fix: ...`

---

## 1) MỤC TIÊU TUẦN 4 (DEMO ĐƯỢC)

1) **Feed** hiển thị danh sách bài viết (posts).
2) **Create Post**: đăng bài dạng `status` hoặc `review`.
3) **Restaurants list**: có API trả danh sách quán để chọn khi đăng review.
4) Tất cả route tạo mới cần **Bearer token** (đăng nhập trước).

---

## 2) API CONTRACT (FE/BE LÀM ĐỘC LẬP, CẮM LÀ CHẠY)

> Chi tiết xem file: `API_CONTRACT_WEEK4.md`

Tóm tắt:
- `GET /api/posts`
- `POST /api/posts`
- `GET /api/restaurants`
- `GET /api/restaurants/:id`

---

## 3) PHÂN CÔNG (4 người, mỗi người 12h)

### A) MEMBER 1 — BE POSTS (12h)
**Branch:** `feat/posts-api`

**Chỉ tạo/sửa các file sau:**
- `server/src/routes/posts.js` (MỚI)
- (tuỳ chọn) `server/src/services/posts.service.js` (MỚI)
- (tuỳ chọn) `server/src/validators/posts.validator.js` (MỚI)

**KHÔNG sửa:** `server/src/index.js`

**Tasks**
1. (5h) `GET /api/posts`
   - Trả list post mới nhất trước
   - Kèm thông tin user (id, name)
   - Kèm counts: `like_count`, `comment_count` (có thể trả 0 tạm nếu chưa làm tuần 5)
2. (5h) `POST /api/posts` (Auth required)
   - body: `content`, `type`, `restaurant_id?`, `rating?`, `image_url?`
   - validate:
     - `content` required
     - `type` in `status|review`
     - nếu `type=review` thì `restaurant_id` required, `rating` 0..5
3. (2h) Chuẩn hoá error response
   - 400: thiếu/invalid
   - 401: thiếu token/invalid token

**DONE khi:**
- Postman gọi `GET /api/posts` OK
- Đăng nhập -> `POST /api/posts` tạo được -> `GET` thấy post mới

---

### B) MEMBER 2 — BE RESTAURANTS (12h)
**Branch:** `feat/restaurants-api`

**Chỉ tạo/sửa các file sau:**
- `server/src/routes/restaurants.js` (MỚI)
- `server/sql/seed.sql` (MỚI)

**KHÔNG sửa:** `server/src/index.js`, `server/sql/schema.sql`

**Tasks**
1. (4h) `GET /api/restaurants`
   - Trả list quán (id, name, address, area?, type?, price_range?, rating_avg?)
2. (2h) `GET /api/restaurants/:id`
   - Trả detail quán
3. (3h) Seed data
   - Viết `server/sql/seed.sql` insert 8–12 quán mẫu
4. (3h) Chuẩn hoá response format theo contract

**DONE khi:**
- Import seed -> gọi API list ra dữ liệu
- API detail trả đúng quán theo id

---

### C) MEMBER 3 — FE FEED UI + CREATE POST (12h)
**Branch:** `feat/feed-ui`

**Chỉ tạo/sửa các file sau:**
- `client/src/pages/Feed.jsx` (SỬA — module owner)
- `client/src/components/PostCard.jsx` (MỚI)
- `client/src/components/CreatePostBox.jsx` (MỚI)

**KHÔNG sửa:** `client/src/App.jsx`

**Tasks**
1. (6h) Feed hiển thị list posts
   - gọi `GET /api/posts`
   - loading / empty / error
2. (6h) Create post box
   - content + type
   - nếu review: dropdown restaurants (gọi `GET /api/restaurants`) + rating input
   - submit gọi `POST /api/posts` (Bearer token)
   - đăng xong refresh list

**DONE khi:**
- UI tạo post xong thấy post xuất hiện trên feed

---

### D) MEMBER 4 — FE RESTAURANTS PAGES (12h)
**Branch:** `feat/restaurants-ui`

**Chỉ tạo/sửa các file sau:**
- `client/src/pages/RestaurantsPage.jsx` (MỚI)
- `client/src/pages/RestaurantDetail.jsx` (MỚI)
- (tuỳ chọn) `client/src/components/RestaurantCard.jsx` (MỚI)

**KHÔNG sửa:** `client/src/App.jsx`

**Tasks**
1. (7h) RestaurantsPage
   - gọi `GET /api/restaurants`
   - search theo tên (client-side)
   - hiển thị card list
2. (5h) RestaurantDetail
   - gọi `GET /api/restaurants/:id`
   - hiển thị thông tin chi tiết

**DONE khi:**
- Page list + page detail chạy độc lập (Leader sẽ mount route vào App.jsx)

---

## 4) LEADER / INTEGRATOR WORK (merge xong mới làm)
**Branch:** `chore/integrate-week4` (Leader làm)

Sau khi 4 PR merge:
1) Mount routes backend trong `server/src/index.js`
   - `/api/posts` -> `routes/posts.js`
   - `/api/restaurants` -> `routes/restaurants.js`
2) Mount routes frontend trong `client/src/App.jsx`
   - `/feed` (đã có)
   - `/restaurants`
   - `/restaurants/:id`
3) Smoke test: register/login -> feed -> create post -> restaurants list/detail

---

## 5) CHECKLIST CUỐI TUẦN (DEMO)
- [ ] Register/Login OK
- [ ] GET /api/restaurants OK (có seed)
- [ ] GET /api/posts OK
- [ ] POST /api/posts OK (auth)
- [ ] FE Feed list OK
- [ ] FE Create post OK
- [ ] FE Restaurants list/detail OK
