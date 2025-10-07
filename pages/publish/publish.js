// pages/publish/publish.js
const { get, post } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    userInfo: {},
    content: '',
    selectedImages: [],
    selectedMusic: null,
    selectedTopics: [],
    isPublishing: false
  },

  onLoad: function(options) {
    // 获取用户信息
    this.getUserInfo();
  },

  // 获取用户信息
  getUserInfo: function() {
    if (app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo });
    } else {
      // 从本地存储获取用户信息
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({ userInfo });
      } else {
        // 重新获取用户信息
        get('/users/profile')
          .then((res) => {
            if (res.data) {
              this.setData({ userInfo: res.data });
            }
          })
          .catch((err) => {
            wx.showToast({
              title: '获取用户信息失败',
              icon: 'none'
            });
          });
      }
    }
  },

  // 输入内容
  onContentInput: function(e) {
    this.setData({ content: e.detail.value });
  },

  // 选择图片
  chooseImage: function() {
    const maxCount = 9 - this.data.selectedImages.length;
    
    wx.chooseMedia({
      count: maxCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success: (res) => {
        const tempFilePaths = res.tempFiles.map(file => file.tempFilePath);
        const newImages = [...this.data.selectedImages, ...tempFilePaths];
        
        this.setData({ 
          selectedImages: newImages.slice(0, 9) // 确保不超过9张
        });
      }
    });
  },

  // 删除图片
  deleteImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const newImages = this.data.selectedImages.filter((_, i) => i !== index);
    this.setData({ selectedImages: newImages });
  },

  // 选择音乐
  chooseMusic: function() {
    // 模拟音乐选择，实际项目中应该调用音乐选择API
    // 这里显示一个模拟的音乐选择弹窗
    wx.showModal({
      title: '添加音乐',
      content: '请选择要添加的音乐',
      showCancel: false,
      success: () => {
        // 模拟选择音乐后的结果
        this.setData({
          selectedMusic: {
            id: 'music_001',
            title: '起风了',
            artist: '买辣椒也用券',
            cover: 'https://picsum.photos/60/60?musiccover'
          }
        });
      }
    });
  },

  // 删除音乐
  deleteMusic: function() {
    this.setData({ selectedMusic: null });
  },

  // 选择话题
  chooseTopic: function() {
    // 模拟话题选择，实际项目中应该调用话题选择API
    // 这里显示一个模拟的话题选择弹窗
    wx.showModal({
      title: '添加话题',
      content: '请输入话题名称',
      editable: true,
      placeholderText: '例如：旅行、美食',
      success: (res) => {
        if (res.confirm && res.content && res.content.trim()) {
          const topic = res.content.trim();
          // 检查话题是否已存在
          if (!this.data.selectedTopics.includes(topic)) {
            // 检查话题数量是否超过限制
            if (this.data.selectedTopics.length >= 5) {
              wx.showToast({
                title: '最多只能添加5个话题',
                icon: 'none'
              });
              return;
            }
            
            const newTopics = [...this.data.selectedTopics, topic];
            this.setData({ selectedTopics: newTopics });
            
            // 将话题添加到内容中
            const topicText = ` #${topic}#`;
            if (!this.data.content.endsWith(' ')) {
              this.setData({
                content: this.data.content + topicText
              });
            } else {
              this.setData({
                content: this.data.content + topicText
              });
            }
          } else {
            wx.showToast({
              title: '该话题已添加',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 删除话题
  deleteTopic: function(e) {
    const index = e.currentTarget.dataset.index;
    const topic = this.data.selectedTopics[index];
    const newTopics = this.data.selectedTopics.filter((_, i) => i !== index);
    
    this.setData({ selectedTopics: newTopics });
    
    // 从内容中移除话题
    const topicPattern = new RegExp(`\\s*#${topic}#\\s*`, 'g');
    const newContent = this.data.content.replace(topicPattern, ' ').trim();
    this.setData({ content: newContent });
  },

  // 发布动态
  publishFeed: function() {
    // 验证内容
    if (!this.data.content.trim() && this.data.selectedImages.length === 0 && !this.data.selectedMusic) {
      wx.showToast({
        title: '请添加内容或图片',
        icon: 'none'
      });
      return;
    }
    
    // 显示发布中状态
    this.setData({ isPublishing: true });
    
    // 构建发布数据
    const publishData = {
      content: this.data.content,
      images: this.data.selectedImages,
      music: this.data.selectedMusic,
      topics: this.data.selectedTopics
    };
    
    // 模拟发布请求
    setTimeout(() => {
      // 模拟成功
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });
      
      // 返回动态列表页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      
      // 在实际项目中，这里应该调用API发布动态
      /*
      post('/feeds', publishData)
        .then((res) => {
          this.setData({ isPublishing: false });
          
          if (res.success) {
            wx.showToast({
              title: '发布成功',
              icon: 'success'
            });
            
            // 返回动态列表页
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          } else {
            wx.showToast({
              title: res.message || '发布失败',
              icon: 'none'
            });
          }
        })
        .catch((err) => {
          this.setData({ isPublishing: false });
          wx.showToast({
            title: '网络错误，请重试',
            icon: 'none'
          });
        });
      */
    }, 2000);
  },

  // 取消发布
  cancelPublish: function() {
    // 检查是否有未保存的内容
    if (this.data.content.trim() || this.data.selectedImages.length > 0 || this.data.selectedMusic || this.data.selectedTopics.length > 0) {
      wx.showModal({
        title: '提示',
        content: '确定要放弃编辑吗？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  },

  // 页面卸载时保存草稿（可选）
  onUnload: function() {
    // 如果有内容，可以保存为草稿
    if (this.data.content.trim() || this.data.selectedImages.length > 0 || this.data.selectedMusic || this.data.selectedTopics.length > 0) {
      const draft = {
        content: this.data.content,
        selectedImages: this.data.selectedImages,
        selectedMusic: this.data.selectedMusic,
        selectedTopics: this.data.selectedTopics,
        savedTime: new Date().toISOString()
      };
      
      // 保存到本地存储
      wx.setStorageSync('feedDraft', draft);
    }
  }
});