export const error = (err, req, res, next) => {
  const message = err.message.toLowerCase();
  switch (true) {
    case message.includes("bad request"):
    case message.includes("required"):
      res.status(400);
      break;
    case message.includes("unauthorized"):
      res.status(401);
      break;
    case message.includes("forbidden"):
      res.status(403);
      break;
    case message.includes("not found"):
      res.status(404);
      break;
    default:
      res.status(500);
  }
  res.send(err.message);
};
