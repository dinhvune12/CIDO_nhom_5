# API_CONTRACT_WEEK4 — CIDO_nhom_5

Base URL (dev): `http://localhost:5000`

## Auth (đã có)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)

## Restaurants
### GET /api/restaurants
Response 200:
```json
{ "restaurants": [ { "id": 1, "name": "...", "address": "...", "area": "...", "type": "...", "price_range": "...", "rating_avg": 4.2 } ] }
```

### GET /api/restaurants/:id
Response 200:
```json
{ "restaurant": { "id": 1, "name": "...", "address": "...", "area": "...", "type": "...", "price_range": "...", "rating_avg": 4.2 } }
```

## Posts
### GET /api/posts
Response 200:
```json
{ "posts": [ { "id": 10, "user": {"id": 1, "name": "A"}, "type": "status", "content": "...", "restaurant_id": null, "restaurant_name": null, "rating": null, "image_url": null, "status": "approved", "created_at": "...", "like_count": 0, "comment_count": 0 } ] }
```

### POST /api/posts (Bearer token)
Body:
```json
{ "content": "...", "type": "status|review", "restaurant_id": 1, "rating": 5, "image_url": "https://..." }
```
Rules:
- content required
- type in status|review
- if review: restaurant_id required, rating 0..5
