// utils/request.js
const app = getApp();

// 开发环境模拟数据 - 完全避免网络请求
const mockData = {
  // 登录接口
  '/users/login': {
    success: true,
    message: '登录成功',
    data: {
      user: {
        _id: 'dev_user_123',
        openid: 'dev_openid_123',
        nickname: '开发者',
        avatar: 'https://picsum.photos/200/200',
        gender: 1,
        age: 28,
        bio: '这是一个开发环境的模拟用户',
        location: {
          latitude: 31.2304,
          longitude: 121.4737,
          address: '上海市'
        },
        interests: ['编程', '音乐', '旅行'],
        tags: ['技术控', '冒险家'],
        matchPreferences: {
          gender: 0,
          ageRange: [18, 45],
          distance: 5000
        },
        privacySettings: {
          showLocation: true,
          showAge: true,
          allowStrangers: true
        }
      },
      token: 'dev_token_1234567890'
    }
  },
  '/users/profile': {
    success: true,
    message: '获取资料成功',
    data: {
      _id: 'dev_user_123',
      openid: 'dev_openid_123',
      nickname: '开发者',
      avatar: 'https://picsum.photos/200/200',
      gender: 1,
      age: 28,
      bio: '这是一个开发环境的模拟用户',
      location: {
        latitude: 31.2304,
        longitude: 121.4737,
        address: '上海市'
      },
      interests: ['编程', '音乐', '旅行'],
      tags: ['技术控', '冒险家'],
      matchPreferences: {
        gender: 0,
        ageRange: [18, 45],
        distance: 5000
      },
      privacySettings: {
        showLocation: true,
        showAge: true,
        allowStrangers: true
      }
    }
  },
  
  // 推荐用户列表接口
  '/users/recommend?count=10': {
    success: true,
    message: '获取推荐用户成功',
    data: [
      {
        _id: 'user_001',
        openid: 'openid_001',
        nickname: '阳光女孩',
        avatar: 'https://picsum.photos/200/200?random=1',
        gender: 2,
        age: 25,
        bio: '喜欢旅行和摄影，寻找志同道合的朋友',
        location: {
          latitude: 31.2304,
          longitude: 121.4737,
          address: '上海市'
        },
        interests: ['摄影', '旅行', '美食'],
        tags: ['活泼', '开朗']
      },
      {
        _id: 'user_002',
        openid: 'openid_002',
        nickname: '技术达人',
        avatar: 'https://picsum.photos/200/200?random=2',
        gender: 1,
        age: 28,
        bio: '热爱编程和新技术，希望认识更多朋友',
        location: {
          latitude: 31.2305,
          longitude: 121.4738,
          address: '上海市'
        },
        interests: ['编程', '游戏', '电影'],
        tags: ['内敛', '智慧']
      },
      {
        _id: 'user_003',
        openid: 'openid_003',
        nickname: '音乐爱好者',
        avatar: 'https://picsum.photos/200/200?random=3',
        gender: 2,
        age: 26,
        bio: '钢琴教师，喜欢各种类型的音乐',
        location: {
          latitude: 31.2306,
          longitude: 121.4739,
          address: '上海市'
        },
        interests: ['音乐', '阅读', '瑜伽'],
        tags: ['优雅', '温柔']
      }
    ]
  },
  
  // 处理用户详情接口，匹配任意用户ID
  getUserById: function(url) {
    // 提取URL中的用户ID
    const userId = url.replace('/users/', '');
    // 返回与登录用户不同的模拟数据，用于查看他人资料
    return {
      success: true,
      message: '获取用户资料成功',
      data: {
        _id: userId,
        openid: `dev_openid_${userId}`,
        nickname: `用户${userId}`,
        avatar: `https://picsum.photos/200/200?random=${userId}`,
        gender: userId % 2 === 0 ? 2 : 1,
        age: 20 + (userId % 20),
        bio: `这是用户${userId}的个人简介`,
        location: {
          latitude: 31.2304 + (userId % 100) * 0.001,
          longitude: 121.4737 + (userId % 100) * 0.001,
          address: `上海市浦东新区${userId}号`
        },
        interests: ['阅读', '运动', '摄影'],
        tags: ['阳光', '活泼'],
        matchPreferences: {
          gender: 0,
          ageRange: [18, 45],
          distance: 5000
        },
        privacySettings: {
          showLocation: true,
          showAge: true,
          allowStrangers: true
        }
      }
    };
  },
  
  // 处理喜欢/不喜欢用户接口
  handleLikeAction: function(url, data) {
    // 根据action参数决定是否匹配成功
    // 只有action为'like'时才有可能匹配成功
    const isMatch = data.action === 'like' && Math.random() > 0.5; // 50%的概率匹配成功
    
    return {
      success: true,
      message: '操作成功',
      data: {
        isMatch: isMatch,
        matchId: isMatch ? 'match_' + Date.now() : null
      }
    };
  },
  
  // 聊天列表接口 - GET请求
  '/chats': {
    success: true,
    message: '获取聊天列表成功',
    data: [
      {
        _id: 'chat_123',
        participants: [
          {
            _id: 'dev_user_123',
            nickname: '开发者',
            avatar: 'https://picsum.photos/200/200'
          },
          {
            _id: 'user_001',
            nickname: '阳光女孩',
            avatar: 'https://picsum.photos/200/200?random=1'
          }
        ],
        lastMessage: {
          content: '你好，很高兴认识你！',
          type: 'text',
          sender: 'user_001'
        },
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(), // 1小时前
        unreadCount: 2
      },
      {
        _id: 'chat_124',
        participants: [
          {
            _id: 'dev_user_123',
            nickname: '开发者',
            avatar: 'https://picsum.photos/200/200'
          },
          {
            _id: 'user_002',
            nickname: '技术达人',
            avatar: 'https://picsum.photos/200/200?random=2'
          }
        ],
        lastMessage: {
          content: '这是一个很酷的技术分享！',
          type: 'text',
          sender: 'user_002'
        },
        lastMessageTime: new Date(Date.now() - 7200000).toISOString(), // 2小时前
        unreadCount: 1
      },
      {
        _id: 'chat_125',
        participants: [
          {
            _id: 'dev_user_123',
            nickname: '开发者',
            avatar: 'https://picsum.photos/200/200'
          },
          {
            _id: 'user_003',
            nickname: '音乐爱好者',
            avatar: 'https://picsum.photos/200/200?random=3'
          }
        ],
        lastMessage: {
          content: '[图片]',
          type: 'image',
          sender: 'dev_user_123'
        },
        lastMessageTime: new Date(Date.now() - 86400000).toISOString(), // 1天前
        unreadCount: 0
      }
    ]
  },
  
  // 创建聊天接口 - POST请求需要特殊处理
  createChat: function(data) {
    return {
      success: true,
      message: '创建聊天成功',
      data: {
        _id: 'chat_' + Date.now(),
        participants: [
          {
            _id: 'dev_user_123',
            nickname: '开发者',
            avatar: 'https://picsum.photos/200/200'
          },
          {
            _id: data.userId,
            nickname: `用户${data.userId}`,
            avatar: `https://picsum.photos/200/200?random=${data.userId}`
          }
        ],
        createdAt: new Date().toISOString()
      }
    };
  },
  
  // 获取聊天记录接口 - 匹配任意聊天ID
  getChatMessages: function(url) {
    // 提取URL中的聊天ID
    const chatId = url.replace('/chats/', '').replace('/messages', '');
    
    // 根据chatId生成不同的模拟聊天记录
    const messagesMap = {
      'chat_123': [
        {
          _id: 'msg_001',
          content: '你好，很高兴认识你！',
          type: 'text',
          sender: 'user_001',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          _id: 'msg_002',
          content: '你好，我也很高兴认识你！',
          type: 'text',
          sender: 'dev_user_123',
          createdAt: new Date(Date.now() - 3540000).toISOString()
        },
        {
          _id: 'msg_003',
          content: '今天天气真不错，适合出去走走！',
          type: 'text',
          sender: 'user_001',
          createdAt: new Date(Date.now() - 3480000).toISOString()
        },
        {
          _id: 'msg_004',
          content: '是啊，你平时喜欢什么户外活动？',
          type: 'text',
          sender: 'dev_user_123',
          createdAt: new Date(Date.now() - 3420000).toISOString()
        },
        {
          _id: 'msg_005',
          content: '我喜欢徒步和摄影，你呢？',
          type: 'text',
          sender: 'user_001',
          createdAt: new Date(Date.now() - 3360000).toISOString()
        }
      ],
      'chat_124': [
        {
          _id: 'msg_101',
          content: '嗨，听说你是技术达人？',
          type: 'text',
          sender: 'dev_user_123',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          _id: 'msg_102',
          content: '哈哈，过奖了，我只是对新技术比较感兴趣！',
          type: 'text',
          sender: 'user_002',
          createdAt: new Date(Date.now() - 7140000).toISOString()
        },
        {
          _id: 'msg_103',
          content: '这是一个很酷的技术分享！',
          type: 'text',
          sender: 'user_002',
          createdAt: new Date(Date.now() - 7080000).toISOString()
        }
      ],
      'chat_125': [
        {
          _id: 'msg_201',
          content: '你好，我是音乐爱好者！',
          type: 'text',
          sender: 'user_003',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          _id: 'msg_202',
          content: '你好，我也很喜欢音乐，尤其是古典音乐！',
          type: 'text',
          sender: 'dev_user_123',
          createdAt: new Date(Date.now() - 86340000).toISOString()
        },
        {
          _id: 'msg_203',
          content: 'https://picsum.photos/400/400?random=203',
          type: 'image',
          sender: 'dev_user_123',
          createdAt: new Date(Date.now() - 86280000).toISOString()
        }
      ]
    };
    
    // 返回对应的聊天记录，如果没有则返回空数组
    const messages = messagesMap[chatId] || [];
    
    return {
      success: true,
      message: '获取聊天记录成功',
      data: messages
    };
  },
  
  // 发送消息接口 - 匹配任意聊天ID
  sendChatMessage: function(url, data) {
    // 模拟发送成功，返回新消息
    return {
      success: true,
      message: '发送消息成功',
      data: {
        _id: 'msg_' + Date.now(),
        content: data.content,
        type: data.type || 'text',
        sender: 'dev_user_123',
        createdAt: new Date().toISOString()
      }
    };
  },
  
  // 发送图片接口 - 匹配任意聊天ID
  sendChatImage: function(url) {
    // 模拟发送图片成功
    return {
      success: true,
      message: '发送图片成功',
      data: {
        _id: 'msg_' + Date.now(),
        content: 'https://picsum.photos/400/400?random=' + Date.now(),
        type: 'image',
        sender: 'dev_user_123',
        createdAt: new Date().toISOString()
      }
    };
  },
  
  // 获取未读消息数量接口
  '/chats/unread/count': {
    success: true,
    message: '获取未读消息数量成功',
    data: {
      unreadCounts: {
        'chat_123': 2,
        'chat_124': 1
      },
      totalUnread: 3
    }
  },
  
  // 活动分类接口
  '/activities/categories': {
    success: true,
    message: '获取活动分类成功',
    data: [
      { id: '1', name: '户外探险' },
      { id: '2', name: '文化艺术' },
      { id: '3', name: '美食聚餐' },
      { id: '4', name: '运动健身' },
      { id: '5', name: '学习交流' },
      { id: '6', name: '娱乐休闲' }
    ]
  },
  
  // 活动列表接口
  '/activities': {
    success: true,
    message: '获取活动列表成功',
    data: [
      {
        _id: 'activity_001',
        title: '周末户外徒步',
        category: '户外探险',
        description: '一起探索城市周边的自然风光，享受新鲜空气',
        coverImage: 'https://picsum.photos/800/400?random=101',
        location: {
          address: '上海市浦东新区世纪公园',
          latitude: 31.2175,
          longitude: 121.5356
        },
        startTime: new Date(Date.now() + 86400000).toISOString(), // 明天
        endTime: new Date(Date.now() + 172800000).toISOString(), // 后天
        organizer: {
          _id: 'user_001',
          nickname: '阳光女孩',
          avatar: 'https://picsum.photos/200/200?random=1'
        },
        participants: 12,
        maxParticipants: 30,
        tags: ['户外', '徒步', '自然']
      },
      {
        _id: 'activity_002',
        title: '摄影爱好者交流会',
        category: '文化艺术',
        description: '分享摄影技巧，一起捕捉城市美景',
        coverImage: 'https://picsum.photos/800/400?random=102',
        location: {
          address: '上海市静安区南京西路',
          latitude: 31.2204,
          longitude: 121.4669
        },
        startTime: new Date(Date.now() + 172800000).toISOString(), // 后天
        endTime: new Date(Date.now() + 183600000).toISOString(), // 后天下午
        organizer: {
          _id: 'user_002',
          nickname: '技术达人',
          avatar: 'https://picsum.photos/200/200?random=2'
        },
        participants: 8,
        maxParticipants: 20,
        tags: ['摄影', '交流', '城市']
      },
      {
        _id: 'activity_003',
        title: '美食探店之旅',
        category: '美食聚餐',
        description: '探索城市隐藏的美食宝藏',
        coverImage: 'https://picsum.photos/800/400?random=103',
        location: {
          address: '上海市黄浦区外滩',
          latitude: 31.2304,
          longitude: 121.4737
        },
        startTime: new Date(Date.now() + 259200000).toISOString(), // 大后天
        endTime: new Date(Date.now() + 273600000).toISOString(), // 大后天晚上
        organizer: {
          _id: 'user_003',
          nickname: '音乐爱好者',
          avatar: 'https://picsum.photos/200/200?random=3'
        },
        participants: 15,
        maxParticipants: 25,
        tags: ['美食', '探店', '社交']
      }
    ]
  }
};

// 基础请求方法
const request = (url, method, data, isAuth = true) => {
  return new Promise((resolve, reject) => {
    // 开发环境使用模拟数据，完全避免网络请求
    // 可以根据需要选择是否使用模拟数据
    const useMockData = true; // 设置为 true 表示使用模拟数据
    
    if (useMockData) {
      // 优先检查完全匹配的URL
      if (mockData[url]) {
        // 使用模拟数据响应
        console.log('使用模拟数据响应:', url);
        setTimeout(() => {
          resolve(mockData[url]);
        }, 300); // 模拟网络延迟
        return;
      }
      
      // 检查是否是用户详情请求 (/users/:userId)
      if (url.startsWith('/users/') && url.split('/').length === 3) {
        // 使用getUserById函数生成模拟数据
        console.log('使用动态用户模拟数据:', url);
        const mockResponse = mockData.getUserById(url);
        setTimeout(() => {
          resolve(mockResponse);
        }, 300); // 模拟网络延迟
        return;
      }
      
      // 检查是否是创建聊天请求 (POST /chats)
      if (url === '/chats' && method === 'POST') {
        // 使用createChat函数生成模拟数据
        console.log('使用创建聊天模拟数据:', url);
        const mockResponse = mockData.createChat(data);
        setTimeout(() => {
          resolve(mockResponse);
        }, 300); // 模拟网络延迟
        return;
      }
      
      // 检查是否是获取聊天记录请求 (/chats/:chatId/messages)
      if (url.includes('/chats/') && url.includes('/messages') && method === 'GET') {
        // 使用getChatMessages函数生成模拟数据
        console.log('使用聊天记录模拟数据:', url);
        const mockResponse = mockData.getChatMessages(url);
        setTimeout(() => {
          resolve(mockResponse);
        }, 300); // 模拟网络延迟
        return;
      }
      
      // 检查是否是发送消息请求 (POST /chats/:chatId/messages)
      if (url.includes('/chats/') && url.includes('/messages') && method === 'POST') {
        // 使用sendChatMessage函数生成模拟数据
        console.log('使用发送消息模拟数据:', url);
        const mockResponse = mockData.sendChatMessage(url, data);
        setTimeout(() => {
          resolve(mockResponse);
        }, 300); // 模拟网络延迟
        return;
      }
      
      // 检查是否是发送图片请求 (POST /chats/:chatId/messages/image)
      if (url.includes('/chats/') && url.includes('/messages/image')) {
        // 这个请求是通过uploadFile方法发送的，需要特殊处理
        // 但在这里我们只需要返回一个成功的响应
        console.log('使用发送图片模拟数据:', url);
        const mockResponse = mockData.sendChatImage(url);
        setTimeout(() => {
          resolve(mockResponse);
        }, 300); // 模拟网络延迟
        return;
      }
      
      // 检查是否是喜欢/不喜欢用户请求 (POST /users/like)
      if (url === '/users/like' && method === 'POST') {
        // 使用handleLikeAction函数处理喜欢/不喜欢操作
        console.log('使用喜欢/不喜欢用户模拟数据:', url);
        const mockResponse = mockData.handleLikeAction(url, data);
        setTimeout(() => {
          resolve(mockResponse);
        }, 300); // 模拟网络延迟
        return;
      }
      
      // 检查是否是活动详情请求 (/activities/:activityId)
      if (url.startsWith('/activities/') && url.split('/').length === 3 && method === 'GET') {
        console.log('使用活动详情模拟数据:', url);
        // 从URL中提取活动ID
        const activityId = url.split('/')[2];
        // 模拟活动详情数据
        const mockResponse = {
          success: true,
          message: '获取活动详情成功',
          data: {
            _id: activityId,
            title: '交友π线下活动',
            category: '社交聚会',
            description: '这是一个交友π平台组织的线下活动，欢迎大家参加！',
            coverImage: 'https://picsum.photos/800/400?random=' + activityId,
            images: [
              'https://picsum.photos/800/400?random=' + activityId + '01',
              'https://picsum.photos/800/400?random=' + activityId + '02'
            ],
            location: {
              address: '上海市静安区南京西路1266号',
              latitude: 31.2204,
              longitude: 121.4669
            },
            startTime: new Date(Date.now() + 86400000).toISOString(),
            endTime: new Date(Date.now() + 172800000).toISOString(),
            organizer: {
              _id: 'user_001',
              nickname: '阳光女孩',
              avatar: 'https://picsum.photos/200/200?random=1'
            },
            participants: [
              {
                _id: 'dev_user_123',
                nickname: '开发者',
                avatar: 'https://picsum.photos/200/200'
              }
            ],
            maxParticipants: 30,
            tags: ['交友', '线下活动', '社交'],
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        };
        setTimeout(() => {
          resolve(mockResponse);
        }, 300); // 模拟网络延迟
        return;
      }
      
      // 如果没有匹配到任何模拟数据，返回默认的成功响应
      console.log('使用默认模拟数据响应:', url);
      setTimeout(() => {
        resolve({
          success: true,
          message: '操作成功',
          data: {}
        });
      }, 300); // 模拟网络延迟
      return;
    }
    
    // 真实网络请求逻辑（仅在关闭模拟数据时执行）
    const token = isAuth ? wx.getStorageSync('token') : '';
    
    wx.request({
      url: app.globalData.baseUrl + url,
      method: method || 'GET',
      data: data,
      header: {
        'content-type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.success) {
            resolve(res.data);
          } else {
            // 业务错误
            reject(new Error(res.data.message || '请求失败'));
          }
        } else if (res.statusCode === 401) {
          // 未授权，跳转到登录页
          app.logout();
          wx.redirectTo({
            url: '/pages/login/login'
          });
          reject(new Error('请先登录'));
        } else {
          reject(new Error(`请求失败，状态码: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(new Error('网络错误，请稍后重试'));
      }
    });
  });
};

// GET请求
const get = (url, data, isAuth = true) => {
  return request(url, 'GET', data, isAuth);
};

// POST请求
const post = (url, data, isAuth = true) => {
  return request(url, 'POST', data, isAuth);
};

// PUT请求
const put = (url, data, isAuth = true) => {
  return request(url, 'PUT', data, isAuth);
};

// DELETE请求
const del = (url, data, isAuth = true) => {
  return request(url, 'DELETE', data, isAuth);
};

// 文件上传
const uploadFile = (url, filePath, name, formData = {}, isAuth = true) => {
  return new Promise((resolve, reject) => {
    // 开发环境使用模拟数据，完全避免网络请求
    const useMockData = true; // 设置为 true 表示使用模拟数据
    
    if (useMockData) {
      // 检查是否是发送图片请求 (POST /chats/:chatId/messages/image)
      if (url.includes('/chats/') && url.includes('/messages/image')) {
        console.log('使用模拟数据响应文件上传:', url);
        setTimeout(() => {
          resolve({
            success: true,
            message: '图片上传成功',
            data: {
              url: `https://picsum.photos/400/400?random=${Date.now()}`,
              fileName: filePath.split('/').pop()
            }
          });
        }, 800); // 模拟网络延迟，文件上传稍微长一点
        return;
      }
      
      // 其他文件上传请求返回默认的成功响应
      console.log('使用默认模拟数据响应文件上传:', url);
      setTimeout(() => {
        resolve({
          success: true,
          message: '文件上传成功',
          data: {
            url: `https://picsum.photos/400/400?random=${Date.now()}`,
            fileName: filePath.split('/').pop()
          }
        });
      }, 800); // 模拟网络延迟
      return;
    }
    
    // 真实文件上传逻辑（仅在关闭模拟数据时执行）
    const token = isAuth ? wx.getStorageSync('token') : '';
    
    wx.uploadFile({
      url: app.globalData.baseUrl + url,
      filePath: filePath,
      name: name,
      formData: formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (res.statusCode === 200) {
          if (data.success) {
            resolve(data);
          } else {
            reject(new Error(data.message || '上传失败'));
          }
        } else {
          reject(new Error(`上传失败，状态码: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(new Error('上传失败，请稍后重试'));
      }
    });
  });
};

module.exports = {
  get,
  post,
  put,
  del,
  uploadFile
};