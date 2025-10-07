// 用户路由
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const userController = require('../controllers/userController');
const { formatResponse } = require('../utils/requestHelper');

// 测试端点 - 不需要认证
router.get('/test', (req, res) => {
  res.status(200).json(formatResponse(true, {
    message: '后端服务运行正常',
    timestamp: new Date().toISOString(),
    server: '交友π后端服务'
  }, '请求成功'));
});

// 微信登录
router.post('/login', userController.login);

// 需要认证的路由
router.use(verifyToken);

// 获取用户个人资料
router.get('/profile', userController.getProfile);

// 更新用户个人资料
router.put('/profile', userController.updateProfile);

// 设置匹配偏好
router.put('/match-preferences', userController.setMatchPreferences);

// 设置隐私偏好
router.put('/privacy-settings', userController.setPrivacySettings);

// 上传用户头像
router.post('/avatar', userController.uploadAvatar);

// 获取推荐用户
router.get('/recommend', userController.getRecommendUsers);

module.exports = router;