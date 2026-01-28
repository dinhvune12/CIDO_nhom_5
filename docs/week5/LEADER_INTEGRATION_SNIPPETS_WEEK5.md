# LEADER_INTEGRATION_SNIPPETS_WEEK5 (NO BOOKING)

## A) SQL tuần 5
Add file: `server/sql/week5.sql` (chỉ appointment/chat)  
Import:
```bash
mysql -u root -p foodbook < server/sql/week5.sql
```

## B) Mount backend routes — `server/src/index.js`
Thêm import:
```js
import appointmentsRoutes from "./routes/appointments.js";
```

Mount:
```js
app.use("/api/appointments", appointmentsRoutes);
```

> KHÔNG mount bookings.

## C) Mount frontend routes — `client/src/App.jsx`
Thêm import:
```jsx
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import AppointmentDetail from "./pages/AppointmentDetail.jsx";
```

Routes:
```jsx
<Route path="/appointments" element={<ProtectedRoute><AppShell><AppointmentsPage /></AppShell></ProtectedRoute>} />
<Route path="/appointments/:id" element={<ProtectedRoute><AppShell><AppointmentDetail /></AppShell></ProtectedRoute>} />
```

## D) Theme/UI
- Đảm bảo `client/src/main.jsx` có:
```js
import "./styles.css";
```
