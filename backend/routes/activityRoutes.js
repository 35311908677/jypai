// 活动路由
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const activityController = require('../controllers/activityController');

// 创建活动（需要认证）
router.post('/', verifyToken, activityController.createActivity);

// 获取活动列表（无需认证）
router.get('/', activityController.getActivities);

// 获取活动详情（无需认证）
router.get('/:activityId', activityController.getActivityDetail);

// 需要认证的路由
router.use(verifyToken);

// 加入活动
router.post('/:activityId/join', activityController.joinActivity);

// 退出活动
router.post('/:activityId/leave', activityController.leaveActivity);

// 更新活动
router.put('/:activityId', activityController.updateActivity);

// 删除活动
router.delete('/:activityId', activityController.deleteActivity);

module.exports = router;