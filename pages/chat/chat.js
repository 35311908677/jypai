// pages/chat/chat.js
const { get, post } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    chatId: '',
    userId: '',
    userInfo: {},
    messages: [],
    inputValue: '',
    scrollTop: 0,
    isLoading: true,
    showEmoji: false,
    showImagePicker: false,
    isSending: false
  },

  onLoad: function(options) {
    // 获取聊天ID和对方用户ID
    const { chatId, userId } = options;
    
    this.setData({
      chatId,
      userId
    });
    
    // 获取对方用户信息
    this.getUserInfo(userId);
    
    // 获取聊天记录
    this.getMessages();
    
    // 设置页面标题为对方昵称
    this.setNavigationBarTitle(userId);
  },
  
  // 页面渲染完成后获取组件实例
  onReady: function() {
    this.aiAssistant = this.selectComponent('#ai-chat-assistant');
  },

  onShow: function() {
    // 页面显示时，如果有聊天ID，获取最新消息并标记为已读
    if (this.data.chatId) {
      this.getMessages();
      this.markMessagesAsRead();
    }
  },

  // 标记消息为已读
  markMessagesAsRead: function() {
    const { chatId } = this.data;
    
    if (chatId) {
      post('/chats/' + chatId + '/messages/read')
        .then(() => {
          // 标记成功后，刷新消息列表页面的未读数
          this.refreshMessageListUnreadCount();
        })
        .catch((err) => {
          console.log('标记消息为已读失败:', err);
        });
    }
  },

  // 刷新消息列表页面的未读消息数量
  refreshMessageListUnreadCount: function() {
    // 通知消息列表页面刷新未读消息数量
    const pages = getCurrentPages();
    const messageListPage = pages.find(page => page.route === 'pages/message-list/message-list');
    
    if (messageListPage) {
      messageListPage.getUnreadCount(true);
    }
  },

  // 设置页面标题
  setNavigationBarTitle: function(userId) {
    get('/users/' + userId)
      .then((res) => {
        if (res.data) {
          wx.setNavigationBarTitle({
            title: res.data.nickname || '聊天'
          });
        }
      })
      .catch((err) => {
        console.log('获取用户信息失败:', err);
      });
  },

  // 获取对方用户信息
  getUserInfo: function(userId) {
    get('/users/' + userId)
      .then((res) => {
        if (res.data) {
          this.setData({
            userInfo: res.data
          });
        }
      })
      .catch((err) => {
        console.log('获取用户信息失败:', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      });
  },

  // 获取聊天记录
  getMessages: function() {
    const { chatId, userId } = this.data;
    
    if (chatId) {
      get('/chats/' + chatId + '/messages')
        .then((res) => {
          if (res.data) {
            this.setData({
              messages: res.data,
              isLoading: false
            });
            // 滚动到底部
            this.scrollToBottom();
          }
        })
        .catch((err) => {
          this.setData({ isLoading: false });
          wx.showToast({
            title: err.message || '获取聊天记录失败',
            icon: 'none'
          });
        });
    } else {
      // 如果没有聊天ID，创建新的聊天
      this.createNewChat(userId);
    }
  },

  // 创建新的聊天
  createNewChat: function(userId) {
    post('/chats', { userId })
      .then((res) => {
        if (res.data) {
          this.setData({
            chatId: res.data._id,
            messages: [],
            isLoading: false
          });
        }
      })
      .catch((err) => {
        this.setData({ isLoading: false });
        wx.showToast({
          title: err.message || '创建聊天失败',
          icon: 'none'
        });
      });
  },

  // 发送消息
  sendMessage: function() {
    const { chatId, inputValue } = this.data;
    
    if (!inputValue.trim()) {
      return;
    }
    
    if (this.data.isSending) {
      return;
    }
    
    this.setData({ isSending: true });
    
    const message = {
      content: inputValue.trim(),
      type: 'text'
    };
    
    post('/chats/' + chatId + '/messages', message)
      .then((res) => {
        if (res.data) {
          // 添加新消息到消息列表
          const newMessages = [...this.data.messages, res.data];
          
          this.setData({
            messages: newMessages,
            inputValue: '',
            isSending: false
          });
          
          // 滚动到底部
          this.scrollToBottom();
        }
      })
      .catch((err) => {
        this.setData({ isSending: false });
        wx.showToast({
          title: err.message || '发送消息失败',
          icon: 'none'
        });
      });
  },
  
  // 切换AI助手显示状态
  toggleAIAssistant: function() {
    if (this.aiAssistant) {
      this.aiAssistant.toggleAssistant();
    }
  },
  
  // 选择AI推荐的回复
  onReplySelect: function(e) {
    const { content } = e.detail;
    this.setData({ inputValue: content });
    // 自动发送消息
    this.sendMessage();
  },

  // 输入框内容变化
  onInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 滚动到底部
  scrollToBottom: function() {
    setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select('#message-container').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec((res) => {
        if (res[0]) {
          this.setData({
            scrollTop: res[0].height
          });
        }
      });
    }, 100);
  },

  // 显示表情面板
  showEmojiPanel: function() {
    this.setData({
      showEmoji: !this.data.showEmoji,
      showImagePicker: false
    });
  },

  // 显示图片选择器
  showImagePicker: function() {
    this.setData({
      showImagePicker: !this.data.showImagePicker,
      showEmoji: false
    });
  },

  // 选择表情
  selectEmoji: function(e) {
    const { emoji } = e.currentTarget.dataset;
    this.setData({
      inputValue: this.data.inputValue + emoji
    });
  },

  // 发送图片
  sendImage: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        
        // 导入utils中的uploadFile函数
        const { uploadFile } = require('../../utils/request');
        
        // 使用工具函数上传图片
        uploadFile('/chats/' + this.data.chatId + '/messages/image', tempFilePath, 'image')
          .then((res) => {
            if (res.success && res.data) {
              // 根据返回的URL创建新消息
              const newMessage = {
                _id: 'msg_' + Date.now(),
                content: res.data.url,
                type: 'image',
                senderId: app.globalData.userInfo.id,
                timestamp: Date.now()
              };
              
              // 添加新消息到消息列表
              const newMessages = [...this.data.messages, newMessage];
              
              this.setData({
                messages: newMessages
              });
              
              // 滚动到底部
              this.scrollToBottom();
            }
          })
          .catch((err) => {
            wx.showToast({
              title: err.message || '发送图片失败',
              icon: 'none'
            });
          });
      },
      fail: (err) => {
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 格式化时间
  formatTime: function(timestamp) {
    if (!timestamp) return '';
    
    const now = new Date();
    const messageTime = new Date(timestamp);
    
    const nowYear = now.getFullYear();
    const messageYear = messageTime.getFullYear();
    
    // 今天的消息显示时间
    if (messageYear === nowYear && messageTime.toDateString() === now.toDateString()) {
      const hours = messageTime.getHours().toString().padStart(2, '0');
      const minutes = messageTime.getMinutes().toString().padStart(2, '0');
      return hours + ':' + minutes;
    }
    
    // 其他显示日期
    const month = (messageTime.getMonth() + 1).toString().padStart(2, '0');
    const day = messageTime.getDate().toString().padStart(2, '0');
    
    if (messageYear === nowYear) {
      return month + '-' + day;
    } else {
      return messageYear + '-' + month + '-' + day;
    }
  }
});