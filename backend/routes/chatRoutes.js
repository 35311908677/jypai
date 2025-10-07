// 聊天路由
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const chatController = require('../controllers/chatController');

// 需要认证的路由
router.use(verifyToken);

// 创建聊天会话
router.post('/', chatController.createChat);

// 获取用户的所有聊天会话
router.get('/', chatController.getChats);

// 发送消息
router.post('/message', chatController.sendMessage);

// 获取聊天消息历史
router.get('/:chatId/messages', chatController.getMessages);

// 获取未读消息数量
router.get('/unread/count', chatController.getUnreadCount);

// 获取AI聊天建议
router.get('/:chatId/ai-suggestions', chatController.getAIChatSuggestions);

module.exports = router;