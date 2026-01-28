# LEADER_INTEGRATION_SNIPPETS (copy/paste)

## 1) server/src/index.js
Add imports:
```js
import postsRoutes from "./routes/posts.js";
import restaurantsRoutes from "./routes/restaurants.js";
```

Add mounts:
```js
app.use("/api/posts", postsRoutes);
app.use("/api/restaurants", restaurantsRoutes);
```

## 2) client/src/App.jsx
Add imports:
```js
import RestaurantsPage from "./pages/RestaurantsPage.jsx";
import RestaurantDetail from "./pages/RestaurantDetail.jsx";
```

Add routes (inside <Routes>):
```jsx
<Route
  path="/restaurants"
  element={
    <ProtectedRoute>
      <RestaurantsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/restaurants/:id"
  element={
    <ProtectedRoute>
      <RestaurantDetail />
    </ProtectedRoute>
  }
/>
```
