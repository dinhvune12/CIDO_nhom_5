# API_CONTRACT_WEEK5 — Appointments + Chat (KHÔNG BOOKING)
Base URL (dev): `http://localhost:<SERVER_PORT>`  
All responses JSON. All write endpoints require Bearer token.

---

## 1) Appointments — Cuộc hẹn

### GET /api/appointments
Headers:
- `Authorization: Bearer <token>`

Response 200:
```json
{
  "appointments": [
    {
      "id": 1,
      "title": "Ăn tối",
      "description": "tụ tập",
      "meeting_time": "2026-02-02 19:00:00",
      "status": "open",
      "restaurant": { "id": 1, "name": "Bún chả" },
      "participants_count": 3,
      "joined_by_me": true
    }
  ]
}
```

### POST /api/appointments
Headers:
- `Authorization: Bearer <token>`

Body:
```json
{
  "title": "Ăn tối cuối tuần",
  "description": "Tụ tập nhẹ",
  "meeting_time": "2026-02-02 19:00:00",
  "restaurant_id": 1,
  "max_participants": 4
}
```

Response 201:
```json
{
  "appointment": {
    "id": 1,
    "title": "...",
    "meeting_time": "..."
  }
}
```

### POST /api/appointments/:id/join
Headers:
- `Authorization: Bearer <token>`
Response 200:
```json
{ "message": "Joined" }
```

### POST /api/appointments/:id/leave
Headers:
- `Authorization: Bearer <token>`
Response 200:
```json
{ "message": "Left" }
```

### GET /api/appointments/:id
> Chỉ xem được nếu **đã join**.

Headers:
- `Authorization: Bearer <token>`

Response 200:
```json
{
  "appointment": {
    "id": 1,
    "title": "...",
    "description": "...",
    "meeting_time": "...",
    "restaurant": { "id": 1, "name": "..." }
  },
  "participants": [ { "id": 1, "name": "A" }, { "id": 2, "name": "B" } ]
}
```

---

## 2) Chat trong cuộc hẹn

### GET /api/appointments/:id/messages?afterId=0
> Chỉ xem được nếu **đã join**.

Headers:
- `Authorization: Bearer <token>`

Response 200:
```json
{
  "messages": [
    {
      "id": 5,
      "user": { "id": 1, "name": "A" },
      "content": "Hello",
      "created_at": "..."
    }
  ]
}
```

### POST /api/appointments/:id/messages
> Chỉ gửi được nếu **đã join**.

Headers:
- `Authorization: Bearer <token>`

Body:
```json
{ "content": "Hello" }
```

Response 201:
```json
{
  "message": {
    "id": 6,
    "content": "Hello",
    "created_at": "..."
  }
}
```
