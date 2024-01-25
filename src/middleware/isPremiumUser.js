export const isPremiumUser = async (req, res, next) => {
  if (req.user.role === "premium") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden", details: "Only premium users can access this resource." });
  }
};
