# TASK_WEEK_5 — UI đẹp hơn + ĐẶT BÀN + CUỘC HẸN + CHAT TRONG CUỘC HẸN (Cách 1

## 0) QUY TẮC CHỐNG CONFLICT (BẮT BUỘC)

### 0.1 Chỉ Leader/Integrator được sửa file “trung tâm”
**KHÔNG ai ngoài Leader được sửa:**
- `server/src/index.js`
- `client/src/App.jsx`
- `client/src/main.jsx`
- `.env`, `.env.example`, `README.md`
- `package.json` (cả client & server) — trừ khi Leader yêu cầu

➡️ Thành viên chỉ **tạo file mới** hoặc **sửa file thuộc module mình** theo phân công.

### 0.2 Chuẩn hoá commit message
- `feat(bookings): ...`
- `feat(appointments): ...`
- `feat(ui): ...`
- `fix: ...`

---

## 1) MỤC TIÊU TUẦN 5 (DEMO ĐƯỢC)
1) UI nhìn đẹp hơn (dark modern, layout có menu).
2) **Đặt bàn**: tạo đặt bàn + xem danh sách đặt bàn của tôi + huỷ đặt bàn.
3) **Cuộc hẹn**: tạo cuộc hẹn + join/leave.
4) **Chat trong cuộc hẹn**: nhắn tin trong cuộc hẹn (polling).

---

## 2) API CONTRACT
> Chi tiết xem file: `API_CONTRACT_WEEK5.md`

Tóm tắt endpoints:
- Bookings:
  - `POST /api/bookings`
  - `GET /api/bookings/me`
  - `PATCH /api/bookings/:id/cancel`
- Appointments:
  - `GET /api/appointments`
  - `POST /api/appointments`
  - `GET /api/appointments/:id`
  - `POST /api/appointments/:id/join`
  - `POST /api/appointments/:id/leave`
  - `GET /api/appointments/:id/messages?afterId=...`
  - `POST /api/appointments/:id/messages`

Tất cả endpoint tạo/sửa đều cần:
- `Authorization: Bearer <token>`

---

## 3) PHÂN CÔNG (4 người, mỗi người 12h)

### A) MEMBER 1 — BE BOOKINGS (12h)
**Branch:** `feat/bookings-api`

**Chỉ tạo/sửa các file sau:**
- `server/src/routes/bookings.js` (MỚI)

**KHÔNG sửa:** `server/src/index.js`, SQL

**Tasks**
1. (3h) Tạo route file `bookings.js` + cấu trúc router
2. (5h) `POST /api/bookings` (Auth required)
   - body: `restaurant_id`, `reserved_at`, `people`, `note?`
   - validate: restaurant_id, reserved_at hợp lệ; people > 0
3. (2h) `GET /api/bookings/me` (Auth required)
4. (2h) `PATCH /api/bookings/:id/cancel` (Auth required, chỉ owner)

**DONE khi:**
- Postman tạo booking OK, list booking OK, huỷ OK

---

### B) MEMBER 2 — BE APPOINTMENTS + CHAT (12h)
**Branch:** `feat/appointments-api`

**Chỉ tạo/sửa các file sau:**
- `server/src/routes/appointments.js` (MỚI)

**KHÔNG sửa:** `server/src/index.js`, SQL

**Tasks**
1. (3h) Tạo route file `appointments.js` + cấu trúc router
2. (7h) Appointments core:
   - `GET /api/appointments`
   - `POST /api/appointments`
   - `GET /api/appointments/:id` (chỉ xem nếu đã join)
   - `POST /api/appointments/:id/join`
   - `POST /api/appointments/:id/leave`
3. (2h) Messages:
   - `GET /api/appointments/:id/messages?afterId=...`
   - `POST /api/appointments/:id/messages`

**DONE khi:**
- Tạo cuộc hẹn -> join -> chat gửi/nhận ok (polling)

---

### C) MEMBER 3 — FE BOOKINGS UI (12h)
**Branch:** `feat/bookings-ui`

**Chỉ tạo/sửa các file sau:**
- `client/src/pages/BookingsPage.jsx` (MỚI)

**KHÔNG sửa:** `client/src/App.jsx`, `client/src/main.jsx`

**Tasks**
1. (7h) BookingsPage UI
   - form đặt bàn: chọn quán (GET /api/restaurants), thời gian, số người, note
   - list booking của tôi (GET /api/bookings/me)
2. (3h) Cancel booking
   - nút huỷ gọi `PATCH /api/bookings/:id/cancel`, refresh list
3. (2h) UI states
   - loading/empty/error + validate đơn giản

**DONE khi:**
- Đặt bàn và huỷ đặt bàn chạy được trong UI

---

### D) MEMBER 4 — FE APPOINTMENTS UI + CHAT UI (12h)
**Branch:** `feat/appointments-ui`

**Chỉ tạo/sửa các file sau:**
- `client/src/pages/AppointmentsPage.jsx` (MỚI)
- `client/src/pages/AppointmentDetail.jsx` (MỚI)

**KHÔNG sửa:** `client/src/App.jsx`, `client/src/main.jsx`

**Tasks**
1. (7h) AppointmentsPage
   - list (GET /api/appointments)
   - create (POST /api/appointments)
   - join/leave
2. (5h) AppointmentDetail (chat)
   - show participants + messages
   - polling 2–3s (GET messages?afterId=)
   - gửi tin nhắn (POST message)

**DONE khi:**
- Tạo cuộc hẹn -> join -> vào detail chat được

---

## 4) LEADER / INTEGRATOR WORK (Leader làm)
**Branch:** `chore/integrate-week5`

### 4.1 Backend mount routes (Leader sửa)
- `server/src/index.js`
  - `app.use("/api/bookings", bookingsRoutes);`
  - `app.use("/api/appointments", appointmentsRoutes);`

### 4.2 SQL tuần 5 (Leader add file + hướng dẫn import)
- Add file: `server/sql/week5.sql`
- Import:
```bash
mysql -u root -p foodbook < server/sql/week5.sql
