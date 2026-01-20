# BRANCH_RULES — CIDO_nhom_5 (Làm việc nhóm không conflict)

## 1) Luồng làm việc
1. `git checkout main`
2. `git pull origin main`
3. `git checkout -b feat/<module>`
4. Code đúng phần được giao
5. `git add .`
6. `git commit -m "feat(module): message"`
7. `git push -u origin feat/<module>`
8. Tạo Pull Request -> main

## 2) Cấm sửa file trung tâm (chỉ Leader được sửa)
- `server/src/index.js`
- `client/src/App.jsx`
- `.env`, `.env.example`, `README.md`
- `package.json`

## 3) Quy ước file theo module
### Backend
- Posts: `server/src/routes/posts.js`
- Restaurants: `server/src/routes/restaurants.js`

### Frontend
- Feed UI: `client/src/pages/Feed.jsx`, `client/src/components/PostCard.jsx`, `CreatePostBox.jsx`
- Restaurants UI: `client/src/pages/RestaurantsPage.jsx`, `RestaurantDetail.jsx`

## 4) Quy ước PR
- Có screenshot (FE) hoặc Postman proof (BE)
- Không commit file build/node_modules
