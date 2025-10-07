// pages/activity-list/activity-list.js
const { get } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    activities: [],
    categories: [],
    selectedCategory: '',
    isLoading: true,
    refreshing: false
  },

  onLoad: function() {
    // 获取活动分类
    this.getCategories();
    
    // 获取活动列表
    this.getActivities();
  },

  onShow: function() {
    // 页面显示时刷新活动列表
    this.getActivities();
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({ refreshing: true });
    
    this.getActivities(true)
      .then(() => {
        wx.stopPullDownRefresh();
        this.setData({ refreshing: false });
      })
      .catch(() => {
        wx.stopPullDownRefresh();
        this.setData({ refreshing: false });
      });
  },

  // 获取活动分类
  getCategories: function() {
    get('/activities/categories')
      .then((res) => {
        if (res.data) {
          this.setData({
            categories: res.data
          });
        }
      })
      .catch((err) => {
        console.log('获取活动分类失败:', err);
      });
  },

  // 获取活动列表
  getActivities: function(forceRefresh = false) {
    if (!forceRefresh && !this.data.isLoading) {
      return Promise.resolve();
    }
    
    const { selectedCategory } = this.data;
    const params = selectedCategory ? { category: selectedCategory } : {};
    
    return get('/activities', params)
      .then((res) => {
        if (res.data) {
          this.setData({
            activities: res.data,
            isLoading: false
          });
        }
      })
      .catch((err) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: err.message || '获取活动列表失败',
          icon: 'none'
        });
      });
  },

  // 选择分类
  selectCategory: function(e) {
    const { category } = e.currentTarget.dataset;
    
    this.setData({
      selectedCategory: category,
      isLoading: true
    });
    
    this.getActivities();
  },

  // 进入活动详情
  enterActivityDetail: function(e) {
    const { activityId } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: '/pages/activity-detail/activity-detail?activityId=' + activityId
    });
  },

  // 创建新活动
  createActivity: function() {
    wx.navigateTo({
      url: '/pages/create-activity/create-activity'
    });
  },

  // 格式化时间
  formatTime: function(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
});