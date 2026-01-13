import jwt from "jsonwebtoken";

/**
 * Header: Authorization: Bearer <token>
 */
export default function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { uid, role, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
