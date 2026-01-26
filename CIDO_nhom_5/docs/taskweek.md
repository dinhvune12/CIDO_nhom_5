# TASK_WEEK_5 — UI theo doan.zip + CUỘC HẸN + CHAT (KHÔNG BOOKING)



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
- `feat(appointments): ...`
- `feat(chat): ...`
- `feat(ui): ...`
- `fix: ...`

---

## 1) MỤC TIÊU TUẦN 5 (DEMO ĐƯỢC)
1) UI đẹp hơn (theo `doan.zip`): topbar + sidebar + card layout.
2) **Cuộc hẹn**: tạo cuộc hẹn + list + join/leave.
3) **Chat trong cuộc hẹn**: nhắn tin (polling).

---

## 2) API CONTRACT
> Xem file: `API_CONTRACT_WEEK5.md`

Tóm tắt endpoints:
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

### A) MEMBER 1 — BE APPOINTMENTS CORE (12h)
**Branch:** `feat/appointments-api`

**Chỉ tạo/sửa các file sau:**
- `server/src/routes/appointments.js` (SỬA/HOÀN THIỆN)

**Tasks**
1. (3h) Chuẩn hoá `GET /api/appointments` trả:
   - `appointments: [{ id, title, restaurant_id, scheduled_at, is_joined, participants_count }]`
2. (5h) `POST /api/appointments` + validate
3. (2h) `POST /api/appointments/:id/join` + `leave`
4. (2h) `GET /api/appointments/:id` (chỉ cho phép nếu đã join)

**DONE khi:**
- Tạo + join/leave + xem detail OK

---

### B) MEMBER 2 — BE CHAT (12h)
**Branch:** `feat/appointment-chat-api`

**Chỉ tạo/sửa các file sau:**
- `server/src/routes/appointments.js` (SỬA phần messages)

**Tasks**
1. (6h) `GET /api/appointments/:id/messages?afterId=...`
2. (6h) `POST /api/appointments/:id/messages` + validate + auth + chỉ cho phép nếu joined

**DONE khi:**
- Polling nhận tin nhắn + gửi tin nhắn OK

---

### C) MEMBER 3 — FE UI THEO DOAN (12h)
**Branch:** `feat/ui-doan-theme`

**Chỉ tạo/sửa các file sau:**
- `client/src/styles.css` (THAY theo doan.zip)
- `client/src/components/AppShell.jsx` (SỬA layout theo doan.zip)

**KHÔNG sửa:** `client/src/App.jsx`, `client/src/main.jsx` (Leader làm)

**Tasks**
1. (7h) Theme + layout (topbar/sidebar/card)
2. (5h) Refactor UI classes ở Feed/Restaurants nếu cần (ưu tiên không đụng quá nhiều file)

**DONE khi:**
- UI chạy mượt, đồng nhất theme

---

### D) MEMBER 4 — FE APPOINTMENTS + CHAT UI (12h)
**Branch:** `feat/appointments-ui`

**Chỉ tạo/sửa các file sau:**
- `client/src/pages/AppointmentsPage.jsx` (SỬA/HOÀN THIỆN)
- `client/src/pages/AppointmentDetail.jsx` (SỬA/HOÀN THIỆN)

**Tasks**
1. (7h) AppointmentsPage: list + create + join/leave
2. (5h) AppointmentDetail: participants + chat polling + send

**DONE khi:**
- Tạo cuộc hẹn -> join -> chat OK

---

## 4) LEADER / INTEGRATOR WORK (Leader làm)
**Branch:** `chore/integrate-week5`

1) Backend mount routes trong `server/src/index.js`
   - `/api/appointments` -> `routes/appointments.js`
   - **KHÔNG mount bookings**
2) Frontend mount routes trong `client/src/App.jsx`
   - `/appointments`
   - `/appointments/:id`
3) Ensure `client/src/main.jsx` import `./styles.css`
4) Import SQL week 5 (chỉ appointment/chat):
```bash
mysql -u root -p foodbook < server/sql/week5.sql
```

---

## 5) CHECKLIST CUỐI TUẦN (DEMO)
- [ ] DB `foodbook` import schema + seed + week5.sql
- [ ] Register/Login OK
- [ ] Appointments list/create OK
- [ ] Join/Leave OK
- [ ] Appointment chat polling OK
- [ ] UI theo doan.zip
