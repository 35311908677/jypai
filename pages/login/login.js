// pages/login/login.js
const { post } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    isLoading: false
  },

  onLoad: function(options) {
    // 页面加载
  },

  // 微信登录
  onGetUserInfo: function(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '您拒绝了授权',
        icon: 'none'
      });
      return;
    }

    this.setData({ isLoading: true });
    
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          // 发送 code 和 userInfo 到后端
          this.loginToServer(loginRes.code, e.detail.userInfo);
        } else {
          this.setData({ isLoading: false });
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },

  // 发送登录请求到服务器
  loginToServer: function(code, userInfo) {
    post('/users/login', {
      code: code,
      userInfo: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender
      }
    }, false)
    .then((res) => {
      this.setData({ isLoading: false });
      
      if (res.data && res.data.token) {
        // 保存用户信息和token
        app.saveUserInfo(res.data.user, res.data.token);
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
        
        // 跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    })
    .catch((err) => {
      this.setData({ isLoading: false });
      wx.showToast({
        title: err.message || '登录失败',
        icon: 'none'
      });
    });
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      app.saveUserInfo(userInfo, token);
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  }
});