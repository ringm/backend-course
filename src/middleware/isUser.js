export const isUser = async (req, res, next) => {
  if (req.user.role === "user") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden", details: "Only users can access this resource." });
  }
};
