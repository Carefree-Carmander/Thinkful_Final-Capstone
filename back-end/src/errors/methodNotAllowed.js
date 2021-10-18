function methodNotAllowed(req, res, next) {
  return next({
    status: 405,
    message: `${req.method} not allowed for ${req.originalUrl}`,
  });
}

module.exports = methodNotAllowed;
