// 活动控制器
const mongoose = require('mongoose');
const { Activity, User } = require('../models/index');
const { formatResponse, calculateDistance } = require('../utils/requestHelper');

// 创建活动
exports.createActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { title, description, location, time, maxParticipants, tags } = req.body;

    if (!title || !description || !location || !time) {
      return res.status(400).json(formatResponse(false, null, '缺少必要的活动参数'));
    }

    // 创建新活动
    const activity = new Activity({
      title,
      description,
      location,
      time,
      organizer: userId,
      participants: [userId],
      maxParticipants: maxParticipants || 20,
      tags: tags || [],
    });

    await activity.save();

    // 填充活动的组织者信息
    const populatedActivity = await Activity.findById(activity._id)
      .populate('organizer', 'nickname avatar')
      .populate('participants', 'nickname avatar');

    return res.status(200).json(formatResponse(true, populatedActivity, '创建活动成功'));
  } catch (error) {
    next(error);
  }
};

// 获取活动列表
exports.getActivities = async (req, res, next) => {
  try {
    const { 
      keyword = '', 
      tags = '', 
      date = '', 
      distance = '', 
      latitude = '', 
      longitude = '', 
      page = 1, 
      pageSize = 10 
    } = req.query;

    const query = {};
    
    // 关键词搜索
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    
    // 标签筛选
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // 日期筛选
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.time = {
        $gte: targetDate,
        $lt: nextDay,
      };
    }
    
    // 分页
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);
    
    // 查询活动
    let activities = await Activity.find(query)
      .populate('organizer', 'nickname avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // 根据位置筛选
    if (latitude && longitude && distance) {
      activities = activities.filter(activity => {
        if (!activity.location || !activity.location.latitude || !activity.location.longitude) {
          return false;
        }
        
        const calculatedDistance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          activity.location.latitude,
          activity.location.longitude
        );
        
        return calculatedDistance <= parseFloat(distance);
      });
    }
    
    // 获取总数
    const total = await Activity.countDocuments(query);
    
    return res.status(200).json(formatResponse(true, {
      activities,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize),
    }, '获取活动列表成功'));
  } catch (error) {
    next(error);
  }
};

// 获取活动详情
exports.getActivityDetail = async (req, res, next) => {
  try {
    const { activityId } = req.params;

    // 查询活动详情
    const activity = await Activity.findById(activityId)
      .populate('organizer', 'nickname avatar')
      .populate('participants', 'nickname avatar');

    if (!activity) {
      return res.status(404).json(formatResponse(false, null, '活动不存在'));
    }

    return res.status(200).json(formatResponse(true, activity, '获取活动详情成功'));
  } catch (error) {
    next(error);
  }
};

// 加入活动
exports.joinActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { activityId } = req.params;

    // 查询活动
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json(formatResponse(false, null, '活动不存在'));
    }

    // 检查活动是否已满
    if (activity.participants.length >= activity.maxParticipants) {
      return res.status(400).json(formatResponse(false, null, '活动名额已满'));
    }

    // 检查用户是否已加入活动
    if (activity.participants.includes(userId)) {
      return res.status(400).json(formatResponse(false, null, '您已加入该活动'));
    }

    // 添加用户到参与者列表
    activity.participants.push(userId);
    await activity.save();

    // 填充活动详情
    const populatedActivity = await Activity.findById(activity._id)
      .populate('organizer', 'nickname avatar')
      .populate('participants', 'nickname avatar');

    return res.status(200).json(formatResponse(true, populatedActivity, '加入活动成功'));
  } catch (error) {
    next(error);
  }
};

// 退出活动
exports.leaveActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { activityId } = req.params;

    // 查询活动
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json(formatResponse(false, null, '活动不存在'));
    }

    // 检查用户是否是活动组织者
    if (activity.organizer.equals(userId)) {
      return res.status(400).json(formatResponse(false, null, '组织者不能退出活动'));
    }

    // 检查用户是否在活动中
    if (!activity.participants.includes(userId)) {
      return res.status(400).json(formatResponse(false, null, '您未加入该活动'));
    }

    // 从参与者列表中移除用户
    activity.participants = activity.participants.filter(id => !id.equals(userId));
    await activity.save();

    // 填充活动详情
    const populatedActivity = await Activity.findById(activity._id)
      .populate('organizer', 'nickname avatar')
      .populate('participants', 'nickname avatar');

    return res.status(200).json(formatResponse(true, populatedActivity, '退出活动成功'));
  } catch (error) {
    next(error);
  }
};

// 更新活动
exports.updateActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { activityId } = req.params;
    const updateData = req.body;

    // 查询活动
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json(formatResponse(false, null, '活动不存在'));
    }

    // 检查用户是否是活动组织者
    if (!activity.organizer.equals(userId)) {
      return res.status(403).json(formatResponse(false, null, '您没有权限更新此活动'));
    }

    // 更新活动
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('organizer', 'nickname avatar')
     .populate('participants', 'nickname avatar');

    return res.status(200).json(formatResponse(true, updatedActivity, '更新活动成功'));
  } catch (error) {
    next(error);
  }
};

// 删除活动
exports.deleteActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { activityId } = req.params;

    // 查询活动
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json(formatResponse(false, null, '活动不存在'));
    }

    // 检查用户是否是活动组织者
    if (!activity.organizer.equals(userId)) {
      return res.status(403).json(formatResponse(false, null, '您没有权限删除此活动'));
    }

    // 删除活动
    await Activity.findByIdAndDelete(activityId);

    return res.status(200).json(formatResponse(true, null, '删除活动成功'));
  } catch (error) {
    next(error);
  }
};