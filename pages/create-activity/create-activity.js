// pages/create-activity/create-activity.js
const { post } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    title: '',
    description: '',
    time: '',
    location: '',
    category: '',
    maxParticipants: 10,
    images: [],
    categories: ['聚餐', '旅行', '运动', '娱乐', '学习', '其他'],
    isSubmitting: false,
    showDatePicker: false
  },

  onLoad: function() {
    // 设置默认时间为明天
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultTime = this.formatDate(tomorrow);
    
    this.setData({
      time: defaultTime
    });
  },

  // 标题输入
  onTitleInput: function(e) {
    this.setData({
      title: e.detail.value
    });
  },

  // 描述输入
  onDescriptionInput: function(e) {
    this.setData({
      description: e.detail.value
    });
  },

  // 地点输入
  onLocationInput: function(e) {
    this.setData({
      location: e.detail.value
    });
  },

  // 选择分类
  onCategoryChange: function(e) {
    const { value } = e.detail;
    this.setData({
      category: this.data.categories[value]
    });
  },

  // 选择最大人数
  onMaxParticipantsChange: function(e) {
    const { value } = e.detail;
    this.setData({
      maxParticipants: value
    });
  },

  // 显示日期选择器
  showDatePicker: function() {
    this.setData({
      showDatePicker: true
    });
  },

  // 日期选择
  onDateChange: function(e) {
    const { value } = e.detail;
    this.setData({
      time: value,
      showDatePicker: false
    });
  },

  // 取消日期选择
  cancelDatePicker: function() {
    this.setData({
      showDatePicker: false
    });
  },

  // 上传图片
  uploadImage: function() {
    const { images } = this.data;
    
    if (images.length >= 9) {
      wx.showToast({
        title: '最多只能上传9张图片',
        icon: 'none'
      });
      return;
    }
    
    wx.chooseImage({
      count: 9 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        const uploadTasks = tempFilePaths.map(tempFilePath => {
          return this.uploadSingleImage(tempFilePath);
        });
        
        wx.showLoading({
          title: '上传中...'
        });
        
        Promise.all(uploadTasks)
          .then(results => {
            wx.hideLoading();
            
            const newImages = [...images];
            results.forEach(result => {
              if (result) {
                newImages.push(result);
              }
            });
            
            this.setData({
              images: newImages
            });
          })
          .catch(() => {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
          });
      }
    });
  },

  // 上传单张图片
  uploadSingleImage: function(tempFilePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.globalData.baseUrl + '/uploads',
        filePath: tempFilePath,
        name: 'image',
        header: {
          'Authorization': 'Bearer ' + app.globalData.token
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            if (data.code === 200 && data.data) {
              resolve(data.data.url);
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        },
        fail: () => {
          resolve(null);
        }
      });
    });
  },

  // 删除图片
  deleteImage: function(e) {
    const { index } = e.currentTarget.dataset;
    const { images } = this.data;
    
    images.splice(index, 1);
    
    this.setData({
      images
    });
  },

  // 预览图片
  previewImage: function(e) {
    const { index } = e.currentTarget.dataset;
    const { images } = this.data;
    
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },

  // 创建活动
  createActivity: function() {
    const { title, description, time, location, category, maxParticipants, images } = this.data;
    
    // 表单验证
    if (!title.trim()) {
      wx.showToast({
        title: '请输入活动标题',
        icon: 'none'
      });
      return;
    }
    
    if (!description.trim()) {
      wx.showToast({
        title: '请输入活动描述',
        icon: 'none'
      });
      return;
    }
    
    if (!time) {
      wx.showToast({
        title: '请选择活动时间',
        icon: 'none'
      });
      return;
    }
    
    if (!location.trim()) {
      wx.showToast({
        title: '请输入活动地点',
        icon: 'none'
      });
      return;
    }
    
    if (!category) {
      wx.showToast({
        title: '请选择活动分类',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.isSubmitting) {
      return;
    }
    
    this.setData({ isSubmitting: true });
    
    const activityData = {
      title,
      description,
      time: new Date(time).getTime(),
      location,
      category,
      maxParticipants: parseInt(maxParticipants),
      images
    };
    
    post('/activities', activityData)
      .then((res) => {
        this.setData({ isSubmitting: false });
        
        if (res.data) {
          wx.showToast({
            title: '创建成功',
            icon: 'success'
          });
          
          // 跳转到活动详情页
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/activity-detail/activity-detail?activityId=' + res.data._id
            });
          }, 1500);
        }
      })
      .catch((err) => {
        this.setData({ isSubmitting: false });
        wx.showToast({
          title: err.message || '创建失败',
          icon: 'none'
        });
      });
  },

  // 格式化日期
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
});