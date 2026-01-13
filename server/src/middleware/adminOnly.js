/**
 * Must be used AFTER authMiddleware.
 */
export default function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  return next();
}
