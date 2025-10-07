// JWT认证中间件
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

// 验证Token中间件
exports.verifyToken = async (req, res, next) => {
  try {
    // 从请求头中获取token
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
      });
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找用户信息
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌',
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    console.error('认证错误:', error);
    return res.status(401).json({
      success: false,
      message: '认证失败',
    });
  }
};