//app.js
App({
  globalData: {
    userInfo: null,
    token: '',
    baseUrl: 'http://localhost:3000/api'
  },

  // 设置底部导航栏消息角标
  setTabBarBadge: function(count) {
    // 消息tab在tabBar中的索引是2（从0开始）
    const messageTabIndex = 2;
    
    if (count > 0) {
      // 如果有未读消息，设置角标
      wx.setTabBarBadge({
        index: messageTabIndex,
        text: count > 99 ? '99+' : String(count)
      });
    } else {
      // 如果没有未读消息，移除角标
      wx.removeTabBarBadge({
        index: messageTabIndex
      });
    }
  },

  // 清除底部导航栏所有角标
  removeAllTabBarBadges: function() {
    // 遍历所有tab项，清除角标
    const tabBarList = this.globalData.tabBarList || [];
    for (let i = 0; i < tabBarList.length; i++) {
      wx.removeTabBarBadge({
        index: i,
        fail: function() {
          // 忽略移除不存在角标的错误
        }
      });
    }
  },

  onLaunch: function() {
    // 初始化小程序
    this.checkLoginStatus();
  },

  checkLoginStatus: function() {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
    } else {
      // 未登录，跳转到登录页
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
  },

  // 保存用户信息到全局和本地存储
  saveUserInfo: function(userInfo, token) {
    this.globalData.userInfo = userInfo;
    this.globalData.token = token;
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('token', token);
  },

  // 清除登录信息，退出登录
  logout: function() {
    this.globalData.userInfo = null;
    this.globalData.token = '';
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
  }
})