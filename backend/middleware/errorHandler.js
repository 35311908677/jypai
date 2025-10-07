// 错误处理中间件

// 404错误处理
exports.notFound = (req, res, next) => {
  const error = new Error(`未找到请求的路由: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// 全局错误处理
exports.errorHandler = (err, req, res, next) => {
  // 确定错误状态码，默认500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // 构建错误响应
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};