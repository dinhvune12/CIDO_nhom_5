# 🍜 FoodFinder – Web quản lý bài đăng tìm món ăn

## 1) Giới thiệu
FoodFinder là web cho phép người dùng đăng bài tìm kiếm/chia sẻ món ăn, hỗ trợ tìm kiếm theo danh mục, địa điểm và khoảng giá.

## 2) Công nghệ
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL
- Auth: JWT

## 3) Cấu trúc repo
- `client/`: Frontend
- `server/`: Backend
- `docs/`: Tài liệu/ghi chú
- `TASK_WEEK_3.md`: Phân công tuần 3 (Auth & User)

## 4) Cách chạy Backend
```bash
cd server
npm install
cp .env.example .env
# chỉnh DB_* trong .env cho đúng MySQL của bạn
npm run dev
```

## 5) Cách chạy Frontend
```bash
cd client
npm install
npm run dev
```

## 6) Quick test
- Backend: mở `http://localhost:5000/health` phải trả `{status:"OK"}`
- Frontend: mở `http://localhost:5173`

## 7) API tuần 3
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (cần Bearer token)

## 8) Lưu ý Git
- KHÔNG commit `node_modules`
- Mỗi người làm 1 branch, tạo PR vào `dev`

## Week 4 (Posts + Restaurants)

### 1) Import DB schema
- Create DB `fookbook` (or set DB_NAME in server/.env)
- Import schema:
  - `mysql -u root -p foodbook < server/sql/schema.sql`

### 2) Seed restaurants (optional but recommended)
- `mysql -u root -p foodbook < server/sql/seed.sql`

### 3) Run
Backend:
- `cd server && npm i && cp .env.example .env && npm run dev`

Frontend:
- `cd client && npm i && cp .env.example .env && npm run dev`
