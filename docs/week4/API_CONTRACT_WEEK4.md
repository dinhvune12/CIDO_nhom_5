# API_CONTRACT_WEEK4 — CIDO_nhom_5

Base URL (dev): `http://localhost:<SERVER_PORT>`  
All responses JSON.

---

## 1) Auth (đã có)
### GET /api/auth/me
Headers:
- `Authorization: Bearer <token>`

Response 200:
```json
{ "user": { "id": 1, "name": "A", "email": "a@gmail.com", "role": "user" } }
```

---

## 2) Restaurants (tuần 4)

### GET /api/restaurants
Response 200:
```json
{
  "restaurants": [
    {
      "id": 1,
      "name": "Bún bò Huế",
      "address": "123 ...",
      "area": "Hải Châu",
      "type": "Vietnamese",
      "price_range": "50k-100k",
      "rating_avg": 4.2
    }
  ]
}
```

### GET /api/restaurants/:id
Response 200:
```json
{
  "restaurant": {
    "id": 1,
    "name": "Bún bò Huế",
    "address": "123 ...",
    "area": "Hải Châu",
    "type": "Vietnamese",
    "price_range": "50k-100k",
    "rating_avg": 4.2,
    "description": "..."
  }
}
```

Response 404:
```json
{ "message": "Restaurant not found" }
```

---

## 3) Posts (tuần 4)

### GET /api/posts
Response 200:
```json
{
  "posts": [
    {
      "id": 10,
      "user": { "id": 1, "name": "A" },
      "type": "status",
      "content": "Hello",
      "restaurant_id": null,
      "rating": null,
      "image_url": null,
      "status": "approved",
      "created_at": "2026-01-20T10:10:10.000Z",
      "like_count": 0,
      "comment_count": 0
    },
    {
      "id": 11,
      "user": { "id": 2, "name": "B" },
      "type": "review",
      "content": "Ngon",
      "restaurant_id": 1,
      "rating": 4.5,
      "image_url": "https://...",
      "status": "approved",
      "created_at": "2026-01-20T10:12:10.000Z",
      "like_count": 3,
      "comment_count": 1
    }
  ]
}
```

### POST /api/posts
Headers:
- `Authorization: Bearer <token>`

Body:
```json
{
  "content": "Text...",
  "type": "status",
  "restaurant_id": 1,
  "rating": 4.5,
  "image_url": "https://..."
}
```

Rules:
- `content` required
- `type` in `status|review`
- If `type=review` => `restaurant_id` required, `rating` required (0..5)

Response 201:
```json
{
  "post": {
    "id": 12,
    "user": { "id": 1, "name": "A" },
    "type": "status",
    "content": "Text...",
    "restaurant_id": null,
    "rating": null,
    "image_url": null,
    "status": "approved",
    "created_at": "2026-01-20T10:15:00.000Z"
  }
}
```

Response 400:
```json
{ "message": "Invalid payload" }
```

Response 401:
```json
{ "message": "Unauthorized" }
```
