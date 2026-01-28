# BRANCH_RULES_WEEK5 — CIDO_nhom_5 (NO BOOKING)

## 1) Luồng làm việc
1. `git checkout main`
2. `git pull origin main`
3. `git checkout -b feat/<module>`
4. Code đúng file được giao
5. `git add .`
6. `git commit -m "feat(module): message"`
7. `git push -u origin feat/<module>`
8. Tạo Pull Request vào `main`

## 2) Cấm sửa file trung tâm (chỉ Leader)
- `server/src/index.js`
- `client/src/App.jsx`
- `client/src/main.jsx`
- `.env`, `.env.example`, `README.md`
- `package.json`

## 3) Phạm vi file cho từng member
- BE appointments core: `server/src/routes/appointments.js`
- BE chat: `server/src/routes/appointments.js` (messages)
- FE UI doan theme: `client/src/styles.css`, `client/src/components/AppShell.jsx`
- FE appointments UI: `client/src/pages/AppointmentsPage.jsx`, `client/src/pages/AppointmentDetail.jsx`

## 4) PR requirements
- BE: dán Postman output (status code + response)
- FE: screenshot UI (list + create + chat + error state)
- Không commit `node_modules`, `dist`, `.env`
