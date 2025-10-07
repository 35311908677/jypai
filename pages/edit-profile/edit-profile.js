// pages/edit-profile/edit-profile.js
const { get, put, uploadFile } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    userInfo: {},
    isLoading: true,
    activeTab: 'basic', // basic, match, privacy
    genderOptions: [
      { id: 0, name: '保密' },
      { id: 1, name: '男' },
      { id: 2, name: '女' }
    ],
    ageRangeOptions: [],
    distanceOptions: [
      { id: 1000, name: '1公里内' },
      { id: 3000, name: '3公里内' },
      { id: 5000, name: '5公里内' },
      { id: 10000, name: '10公里内' },
      { id: 20000, name: '20公里内' },
      { id: 50000, name: '不限距离' }
    ],
    avatarTempFilePath: ''
  },

  onLoad: function(options) {
    // 初始化年龄范围选项
    const ageRangeOptions = [];
    for (let i = 18; i <= 60; i++) {
      ageRangeOptions.push({ id: i, name: i + '岁' });
    }
    
    this.setData({
      ageRangeOptions: ageRangeOptions,
      activeTab: options.tab || 'basic'
    });
    
    // 获取用户资料
    this.getUserInfo();
    // 获取位置信息
    this.getUserLocation();
  },

  // 获取用户资料
  getUserInfo: function() {
    this.setData({ isLoading: true });
    
    get('/users/profile')
      .then((res) => {
        if (res.data) {
          // 如果没有匹配偏好，设置默认值
          if (!res.data.matchPreferences) {
            res.data.matchPreferences = {
              gender: 0,
              ageRange: [18, 45],
              distance: 5000
            };
          }
          
          // 如果没有隐私设置，设置默认值
          if (!res.data.privacySettings) {
            res.data.privacySettings = {
              showLocation: true,
              showAge: true,
              allowStrangers: true
            };
          }
          
          // 计算当前选中的距离索引
          const distanceIndex = this.data.distanceOptions.findIndex(item => item.id === res.data.matchPreferences.distance);
          
          this.setData({
            userInfo: res.data,
            distanceIndex: distanceIndex,
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

  // 获取用户位置
  getUserLocation: function() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        
        // 可以通过微信地图API获取地址信息
        this.setData({
          'userInfo.location.latitude': latitude,
          'userInfo.location.longitude': longitude
        });
      },
      fail: () => {
        wx.showToast({
          title: '获取位置信息失败',
          icon: 'none'
        });
      }
    });
  },

  // 切换标签页
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 输入框内容变化
  onInputChange: function(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    if (field.includes('.')) {
      // 处理嵌套字段
      const fields = field.split('.');
      if (fields.length === 2) {
        this.setData({
          [`userInfo.${fields[0]}.${fields[1]}`]: value
        });
      }
    } else {
      this.setData({
        [`userInfo.${field}`]: value
      });
    }
  },

  // 选择器值变化
  onPickerChange: function(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    if (field.includes('.')) {
      // 处理嵌套字段
      const fields = field.split('.');
      if (fields.length === 2) {
        this.setData({
          [`userInfo.${fields[0]}.${fields[1]}`]: parseInt(value)
        });
      }
    } else {
      this.setData({
        [`userInfo.${field}`]: parseInt(value)
      });
    }
  },

  // 滑块值变化
  onSliderChange: function(e) {
    const { field, index } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    this.setData({
      [`userInfo.${field}[${index}]`]: value
    });
  },

  // 开关值变化
  onSwitchChange: function(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    if (field.includes('.')) {
      // 处理嵌套字段
      const fields = field.split('.');
      if (fields.length === 2) {
        this.setData({
          [`userInfo.${fields[0]}.${fields[1]}`]: value
        });
      }
    } else {
      this.setData({
        [`userInfo.${field}`]: value
      });
    }
  },

  // 选择头像
  chooseAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          avatarTempFilePath: tempFilePath,
          'userInfo.avatar': tempFilePath // 临时显示本地图片
        });
      }
    });
  },

  // 保存基本资料
  saveBasicInfo: function() {
    this.setData({ isLoading: true });
    
    // 准备要提交的数据
    const data = {
      nickname: this.data.userInfo.nickname,
      age: parseInt(this.data.userInfo.age),
      gender: parseInt(this.data.userInfo.gender),
      bio: this.data.userInfo.bio,
      location: this.data.userInfo.location,
      interests: this.data.userInfo.interests || [],
      tags: this.data.userInfo.tags || []
    };
    
    put('/users/profile', data)
      .then((res) => {
        // 上传头像（如果有新选择的头像）
        if (this.data.avatarTempFilePath) {
          this.uploadAvatar(this.data.avatarTempFilePath, res.data);
        } else {
          this.handleSaveSuccess(res.data);
        }
      })
      .catch((err) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: err.message || '保存失败',
          icon: 'none'
        });
      });
  },

  // 上传头像
  uploadAvatar: function(filePath, userInfo) {
    uploadFile('/users/avatar', filePath, 'avatar')
      .then((res) => {
        if (res.data && res.data.avatarUrl) {
          userInfo.avatar = res.data.avatarUrl;
        }
        this.handleSaveSuccess(userInfo);
      })
      .catch((err) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: err.message || '头像上传失败',
          icon: 'none'
        });
      });
  },

  // 保存匹配偏好
  saveMatchPreferences: function() {
    this.setData({ isLoading: true });
    
    put('/users/match-preferences', {
      matchPreferences: this.data.userInfo.matchPreferences
    })
      .then((res) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      })
      .catch((err) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: err.message || '保存失败',
          icon: 'none'
        });
      });
  },

  // 保存隐私设置
  savePrivacySettings: function() {
    this.setData({ isLoading: true });
    
    put('/users/privacy-settings', {
      privacySettings: this.data.userInfo.privacySettings
    })
      .then((res) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      })
      .catch((err) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: err.message || '保存失败',
          icon: 'none'
        });
      });
  },

  // 保存成功处理
  handleSaveSuccess: function(userInfo) {
    // 更新全局用户信息
    app.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
    
    this.setData({
      userInfo: userInfo,
      isLoading: false,
      avatarTempFilePath: ''
    });
    
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
  }
});