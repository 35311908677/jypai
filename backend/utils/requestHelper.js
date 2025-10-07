// 请求处理工具函数
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 生成JWT Token
exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// 验证微信登录
exports.verifyWechatLogin = async (code) => {
  try {
    const response = await axios.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.WECHAT_APPID}&secret=${process.env.WECHAT_SECRET}&js_code=${code}&grant_type=authorization_code`
    );
    return response.data;
  } catch (error) {
    console.error('验证微信登录失败:', error);
    throw new Error('验证微信登录失败');
  }
};

// 调用AI推荐服务
exports.callAIRecommendService = async (userId, count = 10) => {
  try {
    // 模拟AI推荐服务响应
    // 实际项目中应该调用真实的AI服务API
    return {
      success: true,
      data: {
        recommendedUsers: [], // 这里应该返回推荐的用户ID列表
      },
    };
  } catch (error) {
    console.error('调用AI推荐服务失败:', error);
    throw new Error('获取推荐用户失败');
  }
};

// 调用AI聊天助手服务
exports.callAIChatService = async (userId, chatHistory, type) => {
  try {
    // 模拟AI聊天助手服务响应
    // 实际项目中应该调用真实的AI服务API
    return {
      success: true,
      data: {
        suggestions: [], // AI推荐的回复内容列表
        emotion: 'neutral', // 聊天情绪分析结果
        summary: '', // 对话摘要
      },
    };
  } catch (error) {
    console.error('调用AI聊天助手服务失败:', error);
    throw new Error('获取AI聊天建议失败');
  }
};

// 计算两个经纬度之间的距离（公里）
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// 格式化响应数据
exports.formatResponse = (success, data = null, message = '') => {
  return {
    success,
    data,
    message,
  };
};