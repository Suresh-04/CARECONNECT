export function notFoundHandler(req, res, next) {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  error.status = 404;
  error.code = 'NOT_FOUND';
  next(error);
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code || (statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR'),
    timestamp: new Date().toISOString(),
    ...(isDev && statusCode >= 500 && { stack: err.stack })
  });
}
