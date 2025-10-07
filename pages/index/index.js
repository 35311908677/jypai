// pages/index/index.js
const { get, post, put } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    recommendedUsers: [],
    currentUser: null,
    isLoading: true,
    startX: 0,
    moveX: 0,
    direction: 0, // 1: right, -1: left
    noMoreUsers: false
  },
  
  // 模拟数据 - 为了展示效果
  mockUsers: [
    {
      _id: '1',
      nickname: '小美',
      age: 24,
      gender: 'female',
      avatar: 'https://picsum.photos/id/64/600/800',
      distance: 1.2,
      bio: '喜欢旅行和摄影，寻找志同道合的朋友',
      tags: ['旅行', '摄影', '美食'],
      soulMatch: 85
    },
    {
      _id: '2',
      nickname: '小明',
      age: 26,
      gender: 'male',
      avatar: 'https://picsum.photos/id/91/600/800',
      distance: 2.5,
      bio: '音乐爱好者，喜欢弹吉他和听古典音乐',
      tags: ['音乐', '吉他', '阅读'],
      soulMatch: 76
    },
    {
      _id: '3',
      nickname: '小红',
      age: 23,
      gender: 'female',
      avatar: 'https://picsum.photos/id/65/600/800',
      distance: 3.1,
      bio: '健身达人，喜欢跑步和瑜伽',
      tags: ['健身', '瑜伽', '跑步'],
      soulMatch: 92
    },
    {
      _id: '4',
      nickname: '小刚',
      age: 27,
      gender: 'male',
      avatar: 'https://picsum.photos/id/1005/600/800',
      distance: 1.8,
      bio: '程序员一枚，热爱技术和创新',
      tags: ['编程', '科技', '电影'],
      soulMatch: 78
    }
  ],

  onLoad: function(options) {
    // 先初始化一个默认的currentUser，防止页面首次加载时出现空白
    const defaultUser = {
      _id: 'default',
      nickname: '正在为您寻找',
      age: 0,
      avatar: 'https://picsum.photos/600/800',
      distance: 0,
      bio: '正在为您寻找合适的对象...',
      tags: [],
      soulMatch: 0
    };
    
    this.setData({
      currentUser: defaultUser
    });
    
    // 获取推荐用户列表
    this.getRecommendedUsers();
    // 获取位置信息
    this.getUserLocation();
  },

  onShow: function() {
    // 页面显示时检查是否需要刷新数据
    if (!this.data.recommendedUsers.length && !this.data.isLoading) {
      this.getRecommendedUsers();
    }
  },

  // 获取推荐用户列表
  getRecommendedUsers: function() {
    this.setData({ isLoading: true });
    
    // 模拟网络请求延迟
    setTimeout(() => {
      // 使用模拟数据
      const mockUsers = [
        {
          _id: '1',
          nickname: '小美',
          age: 24,
          gender: 'female',
          avatar: 'https://picsum.photos/id/64/600/800',
          distance: 1.2,
          bio: '喜欢旅行和摄影，寻找志同道合的朋友',
          tags: ['旅行', '摄影', '美食'],
          soulMatch: 85
        },
        {
          _id: '2',
          nickname: '小明',
          age: 26,
          gender: 'male',
          avatar: 'https://picsum.photos/id/91/600/800',
          distance: 2.5,
          bio: '音乐爱好者，喜欢弹吉他和听古典音乐',
          tags: ['音乐', '吉他', '阅读'],
          soulMatch: 76
        },
        {
          _id: '3',
          nickname: '小红',
          age: 23,
          gender: 'female',
          avatar: 'https://picsum.photos/id/65/600/800',
          distance: 3.1,
          bio: '健身达人，喜欢跑步和瑜伽',
          tags: ['健身', '瑜伽', '跑步'],
          soulMatch: 92
        },
        {
          _id: '4',
          nickname: '小刚',
          age: 27,
          gender: 'male',
          avatar: 'https://picsum.photos/id/1005/600/800',
          distance: 1.8,
          bio: '程序员一枚，热爱技术和创新',
          tags: ['编程', '科技', '电影'],
          soulMatch: 78
        }
      ];
      
      // 随机调整灵魂匹配度值
      mockUsers.forEach(user => {
        user.soulMatch = Math.floor(Math.random() * 30) + 70; // 70-99之间的随机值
      });
      
      this.setData({
        recommendedUsers: [...this.data.recommendedUsers, ...mockUsers],
        currentUser: mockUsers.length > 0 ? mockUsers[0] : null,
        isLoading: false,
        noMoreUsers: mockUsers.length === 0
      });
    }, 800);
  },

  // 获取用户位置
  getUserLocation: function() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        // 可以保存位置信息并发送给服务器
        this.updateUserLocation(latitude, longitude);
      },
      fail: () => {
        wx.showToast({
          title: '获取位置信息失败',
          icon: 'none'
        });
      }
    });
  },

  // 更新用户位置信息
  updateUserLocation: function(latitude, longitude) {
    put('/users/profile', {
      location: {
        latitude: latitude,
        longitude: longitude
      }
    })
    .then(() => {
      console.log('位置信息更新成功');
    })
    .catch((err) => {
      console.log('位置信息更新失败:', err);
    });
  },

  // 触摸开始事件
  onTouchStart: function(e) {
    this.setData({
      startX: e.touches[0].clientX,
      moveX: 0,
      direction: 0
    });
  },

  // 触摸移动事件
  onTouchMove: function(e) {
    const moveX = e.touches[0].clientX - this.data.startX;
    this.setData({
      moveX: moveX,
      direction: moveX > 0 ? 1 : -1
    });
  },

  // 触摸结束事件
  onTouchEnd: function(e) {
    const threshold = 100;
    if (Math.abs(this.data.moveX) > threshold) {
      // 滑动超过阈值，执行喜欢或不喜欢操作
      if (this.data.direction === 1) {
        this.likeUser();
      } else {
        this.dislikeUser();
      }
    } else {
      // 滑动不超过阈值，回到原位
      this.setData({ moveX: 0 });
    }
  },

  // 喜欢用户
  likeUser: function() {
    if (!this.data.currentUser) return;
    
    this.setData({
      moveX: 300 // 向右滑动到屏幕外
    });
    
    // 先保存用户ID，再移除并加载下一个
    const targetUserId = this.data.currentUser._id;
    setTimeout(() => {
      this.loadNextUser();
      // 调用API
      this.sendLikeAction(targetUserId, 'like');
    }, 300);
  },

  // 不喜欢用户
  dislikeUser: function() {
    if (!this.data.currentUser) return;
    
    this.setData({
      moveX: -300 // 向左滑动到屏幕外
    });
    
    // 先保存用户ID，再移除并加载下一个
    const targetUserId = this.data.currentUser._id;
    setTimeout(() => {
      this.loadNextUser();
      // 调用API
      this.sendLikeAction(targetUserId, 'dislike');
    }, 300);
  },

  // 加载下一个用户
  loadNextUser: function() {
    const users = this.data.recommendedUsers;
    users.shift(); // 移除当前用户
    
    this.setData({
      recommendedUsers: users,
      currentUser: users.length > 0 ? users[0] : null,
      moveX: 0
    });
    
    // 如果没有更多用户，加载新的推荐列表
    if (users.length === 0 && !this.data.noMoreUsers) {
      this.getRecommendedUsers();
    }
  },

  // 发送喜欢/不喜欢操作到服务器
  sendLikeAction: function(targetUserId, action) {
    post('/users/like', {
      targetUserId: targetUserId,
      action: action
    })
    .then((res) => {
      // 检查是否匹配成功
      if (res.data && res.data.isMatch) {
        wx.showModal({
          title: '匹配成功！',
          content: '您和' + this.data.currentUser.nickname + '互相喜欢了，现在可以开始聊天啦！',
          showCancel: false,
          confirmText: '去聊天',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 创建聊天会话并跳转到聊天页面
              this.createChatAndNavigate(targetUserId);
            }
          }
        });
      }
    })
    .catch((err) => {
      console.log('操作失败:', err);
    });
  },

  // 创建聊天会话并跳转到聊天页面
  createChatAndNavigate: function(targetUserId) {
    post('/chats', {
      receiverId: targetUserId
    })
    .then((res) => {
      if (res.data && res.data._id) {
        wx.navigateTo({
          url: '/pages/chat/chat?chatId=' + res.data._id + '&userId=' + targetUserId
        });
      }
    })
    .catch((err) => {
      wx.showToast({
        title: '创建聊天失败',
        icon: 'none'
      });
    });
  },

  // 查看用户详情
  viewUserDetail: function() {
    if (!this.data.currentUser) return;
    
    wx.navigateTo({
      url: '/pages/profile/profile?userId=' + this.data.currentUser._id + '&from=match'
    });
  },
  
  // 导航到个人资料页面
  navigateToProfile: function() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  },
  
  // 导航到消息列表页面
  navigateToMessages: function() {
    wx.switchTab({
      url: '/pages/message-list/message-list'
    });
  },
  
  // 导航到活动列表页面
  navigateToActivities: function() {
    wx.switchTab({
      url: '/pages/activity-list/activity-list'
    });
  }
});