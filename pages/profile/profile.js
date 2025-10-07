// pages/profile/profile.js
const { get } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    userInfo: null,
    isOwnProfile: true,
    isLoading: true,
    userId: ''
  },

  onLoad: function(options) {
    // 检查是否是查看他人资料
    if (options.userId && options.userId !== app.globalData.userInfo.id) {
      this.setData({
        isOwnProfile: false,
        userId: options.userId
      });
      this.getUserInfo(options.userId);
    } else {
      // 查看自己的资料
      this.setData({
        userInfo: app.globalData.userInfo,
        isLoading: false
      });
    }
  },

  onShow: function() {
    // 页面显示时刷新用户信息
    if (this.data.isOwnProfile) {
      this.refreshUserInfo();
    }
  },

  // 刷新自己的用户信息
  refreshUserInfo: function() {
    get('/users/profile')
      .then((res) => {
        if (res.data) {
          // 更新全局用户信息
          app.globalData.userInfo = res.data;
          wx.setStorageSync('userInfo', res.data);
          
          this.setData({
            userInfo: res.data,
            isLoading: false
          });
        }
      })
      .catch((err) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: err.message || '获取资料失败',
          icon: 'none'
        });
      });
  },

  // 获取指定用户的信息
  getUserInfo: function(userId) {
    this.setData({ isLoading: true });
    
    get('/users/' + userId)
      .then((res) => {
        this.setData({
          userInfo: res.data,
          isLoading: false
        });
      })
      .catch((err) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: err.message || '获取用户资料失败',
          icon: 'none'
        });
      });
  },

  // 编辑个人资料
  editProfile: function() {
    wx.navigateTo({
      url: '/pages/edit-profile/edit-profile'
    });
  },

  // 设置匹配偏好
  setMatchPreferences: function() {
    wx.navigateTo({
      url: '/pages/edit-profile/edit-profile?tab=match'
    });
  },

  // 设置隐私偏好
  setPrivacySettings: function() {
    wx.navigateTo({
      url: '/pages/settings/settings?tab=privacy'
    });
  },

  // 查看消息列表
  viewMessages: function() {
    wx.switchTab({
      url: '/pages/message-list/message-list'
    });
  },

  // 查看活动列表
  viewActivities: function() {
    wx.switchTab({
      url: '/pages/activity-list/activity-list'
    });
  },

  // 进入聊天（当查看他人资料时）
  startChat: function() {
    if (!this.data.isOwnProfile && this.data.userInfo) {
      // 检查是否已经有聊天会话
      this.checkAndStartChat(this.data.userInfo._id);
    }
  },

  // 检查并开始聊天
  checkAndStartChat: function(userId) {
    wx.navigateTo({
      url: '/pages/chat/chat?userId=' + userId
    });
  },

  // 分享用户资料
  onShareAppMessage: function() {
    return {
      title: '看看我在交友π的资料',
      path: '/pages/profile/profile?userId=' + (this.data.isOwnProfile ? app.globalData.userInfo.id : this.data.userId)
    };
  }
});