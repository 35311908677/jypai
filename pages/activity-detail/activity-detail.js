// pages/activity-detail/activity-detail.js
const { get, post } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    activityId: '',
    activityDetail: null,
    isLoading: true,
    isJoined: false,
    participants: []
  },

  onLoad: function(options) {
    const { activityId } = options;
    
    this.setData({
      activityId
    });
    
    // 获取活动详情
    this.getActivityDetail();
  },

  // 获取活动详情
  getActivityDetail: function() {
    const { activityId } = this.data;
    
    get('/activities/' + activityId)
      .then((res) => {
        if (res.data) {
          // 检查当前用户是否已报名
          const isJoined = res.data.participants.some(participant => participant._id === app.globalData.userInfo.id);
          
          this.setData({
            activityDetail: res.data,
            participants: res.data.participants || [],
            isJoined,
            isLoading: false
          });
          
          // 设置页面标题
          wx.setNavigationBarTitle({
            title: res.data.title || '活动详情'
          });
        }
      })
      .catch((err) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: err.message || '获取活动详情失败',
          icon: 'none'
        });
      });
  },

  // 报名活动
  joinActivity: function() {
    const { activityId } = this.data;
    
    post('/activities/' + activityId + '/join')
      .then((res) => {
        if (res.data) {
          this.setData({
            isJoined: true,
            participants: res.data.participants || []
          });
          
          wx.showToast({
            title: '报名成功',
            icon: 'success'
          });
        }
      })
      .catch((err) => {
        wx.showToast({
          title: err.message || '报名失败',
          icon: 'none'
        });
      });
  },

  // 取消报名
  leaveActivity: function() {
    const { activityId } = this.data;
    
    wx.showModal({
      title: '确认取消',
      content: '确定要取消报名吗？',
      success: (res) => {
        if (res.confirm) {
          post('/activities/' + activityId + '/leave')
            .then((res) => {
              if (res.data) {
                this.setData({
                  isJoined: false,
                  participants: res.data.participants || []
                });
                
                wx.showToast({
                  title: '已取消报名',
                  icon: 'success'
                });
              }
            })
            .catch((err) => {
              wx.showToast({
                title: err.message || '操作失败',
                icon: 'none'
              });
            });
        }
      }
    });
  },

  // 分享活动
  onShareAppMessage: function() {
    const { activityDetail, activityId } = this.data;
    
    // 确保activityDetail存在时再访问其属性
    const title = activityDetail && activityDetail.title ? activityDetail.title : '交友π活动';
    const imageUrl = activityDetail && activityDetail.images && activityDetail.images.length > 0 ? 
                      activityDetail.images[0] : 'https://picsum.photos/400/300';
    
    return {
      title: title,
      path: '/pages/activity-detail/activity-detail?activityId=' + activityId,
      imageUrl: imageUrl
    };
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
  },

  // 预览图片
  previewImage: function(e) {
    const { index } = e.currentTarget.dataset;
    const { images } = this.data.activityDetail;
    
    if (images && images.length > 0) {
      wx.previewImage({
        current: images[index],
        urls: images
      });
    }
  },

  // 查看用户资料
  viewUserProfile: function(e) {
    const { userId } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: '/pages/profile/profile?userId=' + userId
    });
  }
});