// pages/message-list/message-list.js
const { get } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    chatList: [],
    unreadCounts: {},
    totalUnread: 0,
    isLoading: true,
    refreshing: false
  },

  onLoad: function(options) {
    // 获取聊天列表
    this.getChatList();
    // 获取未读消息数量
    this.getUnreadCount();
  },

  // 初始化模拟数据（仅在开发环境使用）
  initMockData: function() {
    // 检查是否已加载到真实数据
    if (Object.keys(this.data.unreadCounts).length === 0 && this.data.totalUnread === 0) {
      setTimeout(() => {
        this.setData({
          unreadCounts: {
            'chat1': 2,
            'chat2': 1
          },
          totalUnread: 3
        });
        // 更新底部导航栏消息角标
        app.setTabBarBadge(3);
      }, 1000);
    }
  },

  onShow: function() {
    // 页面显示时刷新聊天列表
    this.getChatList();
    this.getUnreadCount();
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({ refreshing: true });
    
    Promise.all([
      this.getChatList(true),
      this.getUnreadCount(true)
    ]).then(() => {
      wx.stopPullDownRefresh();
      this.setData({ refreshing: false });
    }).catch(() => {
      wx.stopPullDownRefresh();
      this.setData({ refreshing: false });
    });
  },

  // 获取聊天列表
  getChatList: function(forceRefresh = false) {
    if (!forceRefresh && !this.data.isLoading) {
      return Promise.resolve();
    }
    
    return get('/chats')
      .then((res) => {
        if (res.data) {
          this.setData({
            chatList: res.data,
            isLoading: false
          });
        }
      })
      .catch((err) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: err.message || '获取消息列表失败',
          icon: 'none'
        });
      });
  },

  // 获取未读消息数量
  getUnreadCount: function(forceRefresh = false) {
    if (!forceRefresh && !this.data.isLoading) {
      return Promise.resolve();
    }
    
    return get('/chats/unread/count')
      .then((res) => {
        if (res.data) {
          const totalUnread = res.data.totalUnread || 0;
          
          this.setData({
            unreadCounts: res.data.unreadCounts || {},
            totalUnread: totalUnread
          });
          
          // 更新底部导航栏消息角标
          app.setTabBarBadge(totalUnread);
        } else {
          // 如果返回数据为空，初始化模拟数据
          this.initMockData();
        }
      })
      .catch((err) => {
        console.log('获取未读消息数量失败:', err);
        // 如果API请求失败，初始化模拟数据
        this.initMockData();
      });
  },

  // 进入聊天页面
  enterChat: function(e) {
    const { chatId, userId } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: '/pages/chat/chat?chatId=' + chatId + '&userId=' + userId
    });
  },

  // 获取最后一条消息的显示内容
  getLastMessageContent: function(chat) {
    if (!chat || !chat.lastMessage) {
      return '开始聊天吧';
    }
    
    const { content, type } = chat.lastMessage;
    
    switch (type) {
      case 'image':
        return '[图片]';
      case 'emoji':
        return content;
      default:
        return content || '';
    }
  },

  // 格式化时间
  formatTime: function(timestamp) {
    if (!timestamp) return '';
    
    const now = new Date();
    const messageTime = new Date(timestamp);
    
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDate = now.getDate();
    
    const messageYear = messageTime.getFullYear();
    const messageMonth = messageTime.getMonth();
    const messageDate = messageTime.getDate();
    
    // 今天的消息显示时间
    if (messageYear === nowYear && messageMonth === nowMonth && messageDate === nowDate) {
      const hours = messageTime.getHours().toString().padStart(2, '0');
      const minutes = messageTime.getMinutes().toString().padStart(2, '0');
      return hours + ':' + minutes;
    }
    
    // 昨天的消息显示"昨天"
    const yesterday = new Date(now);
    yesterday.setDate(nowDate - 1);
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = yesterday.getMonth();
    const yesterdayDate = yesterday.getDate();
    
    if (messageYear === yesterdayYear && messageMonth === yesterdayMonth && messageDate === yesterdayDate) {
      return '昨天';
    }
    
    // 今年的消息显示月日
    if (messageYear === nowYear) {
      return (messageMonth + 1) + '-' + messageDate;
    }
    
    // 其他显示完整日期
    return messageYear + '-' + (messageMonth + 1) + '-' + messageDate;
  }
});