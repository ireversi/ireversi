module.exports = (req, res, next) => {
  const x = +req.body.x;
  const y = +req.body.y;
  const userId = +req.body.userId;
  req.body.x = x;
  req.body.y = y;
  req.body.userId = userId;
  next();
};
