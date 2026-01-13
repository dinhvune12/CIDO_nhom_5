


Hoàn thiện **ĐĂNG KÝ – ĐĂNG NHẬP – XÁC THỰC NGƯỜI DÙNG**.

Sau tuần 3, hệ thống phải:
- Đăng ký / đăng nhập được bằng API backend
- JWT middleware hoạt động đúng
- Frontend login/register dùng API thật, lưu token
- Có API `/me` để FE kiểm tra phiên

---

## 👥 Phân công công việc (4 người)

### 👤 Người 1 – LEADER / PM / INTEGRATOR
- Setup project skeleton (repo này)
- Chuẩn hoá `.env.example`, `.gitignore`, cấu trúc folder
- Review PR của BE/FE, merge vào `dev`
- Fix bug tích hợp (CORS, path, env)

**Done khi:** clone repo, chạy được FE/BE và login end-to-end OK.

---

### 👤 Người 2 – BACKEND DEV (AUTH ROUTES)
Làm trong:
- `server/src/routes/auth.js`

Việc cần làm:
- Implement:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Yêu cầu:
  - Check thiếu dữ liệu (400)
  - Check email trùng (409)
  - Hash password (bcrypt)
  - Login trả JWT + user (id, name, role)
  - Nếu `locked = 1` thì không cho login (403)

**Done khi:** Postman test OK đủ case.

---

### 👤 Người 3 – BACKEND DEV (DB + MIDDLEWARE + /me)
Làm trong:
- `server/sql/schema.sql`
- `server/src/middleware/auth.js`
- `server/src/middleware/adminOnly.js`
- `server/src/routes/auth.js` (endpoint `/me` nếu cần)

Việc cần làm:
- Tạo DB + chạy schema users
- Middleware đọc `Authorization: Bearer <token>`
- Endpoint `GET /api/auth/me` trả info user theo token

**Done khi:** token gọi được `/me` và trả đúng user.

---

### 👤 Người 4 – FRONTEND DEV (AUTH UI + API)
Làm trong:
- `client/src/pages/LoginPage.jsx`
- `client/src/pages/RegisterPage.jsx`
- `client/src/api/http.js`
- `client/src/components/ProtectedRoute.jsx`

Việc cần làm:
- UI login/register
- Gọi API backend thật:
  - register -> chuyển sang login
  - login -> lưu token + user vào localStorage
- ProtectedRoute chặn route khi chưa login

**Done khi:** FE login OK, refresh trang vẫn giữ phiên (dùng token/localStorage).

---

## ✅ Checklist cuối tuần
- [ ] `POST /api/auth/register` tạo user vào MySQL
- [ ] `POST /api/auth/login` trả `{ token, user }`
- [ ] `GET /api/auth/me` trả đúng user theo token
- [ ] FE login/register hoạt động end-to-end
- [ ] Không commit `node_modules`
