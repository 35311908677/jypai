/**
 * 格式化API响应的工具函数
 */

/**
 * 格式化成功响应
 * @param {Object} res - Express响应对象
 * @param {any} data - 要返回的数据
 * @param {number} statusCode - HTTP状态码，默认为200
 * @param {string} message - 成功消息，默认为'操作成功'
 * @returns {Object} 格式化的响应
 */
exports.successResponse = (res, data = null, statusCode = 200, message = '操作成功') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * 格式化错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @param {number} statusCode - HTTP状态码，默认为400
 * @param {any} error - 错误详情，可选
 * @returns {Object} 格式化的响应
 */
exports.errorResponse = (res, message = '操作失败', statusCode = 400, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error ? (error instanceof Error ? error.message : error) : undefined,
  });
};

/**
 * 格式化分页响应
 * @param {Object} res - Express响应对象
 * @param {Array} data - 分页数据列表
 * @param {number} total - 总条数
 * @param {number} page - 当前页码
 * @param {number} limit - 每页条数
 * @param {string} message - 成功消息，默认为'获取成功'
 * @returns {Object} 格式化的分页响应
 */
exports.paginatedResponse = (res, data = [], total = 0, page = 1, limit = 10, message = '获取成功') => {
  const totalPages = Math.ceil(total / limit);
  
  return res.status(200).json({
    success: true,
    message,
    data: {
      items: data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
};

/**
 * 统一的响应处理函数
 * @param {Object} res - Express响应对象
 * @param {boolean} success - 是否成功
 * @param {any} data - 数据
 * @param {string} message - 消息
 * @param {number} statusCode - 状态码
 * @param {Object} options - 额外选项
 * @returns {Object} 格式化的响应
 */
exports.formatResponse = (res, success, data, message, statusCode, options = {}) => {
  const response = {
    success,
    message,
  };

  if (data !== undefined && data !== null) {
    response.data = data;
  }

  if (options.error) {
    response.error = options.error instanceof Error ? options.error.message : options.error;
  }

  if (options.pagination) {
    response.pagination = options.pagination;
  }

  return res.status(statusCode).json(response);
};