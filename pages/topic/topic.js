// pages/topic/topic.js
Page({
  data: {
    topic: '今日话题',
    topicInfo: {
      name: '今日话题',
      description: '分享你的日常生活和感悟，结交志同道合的朋友。在这个话题下，每个人都可以畅所欲言，表达真实的自己。',
      postCount: 1256,
      followerCount: 8732,
      viewCount: 123456
    },
    isFollowing: false,
    activeTab: 'hot',
    feedList: [
      {
        id: '1',
        user: {
          id: 'user1',
          nickname: '小确幸',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        content: '今天阳光很好，心情也跟着明媚起来。分享一组午后的咖啡时光，希望大家也能感受到这份温暖。#今日话题# #生活碎片#',
        postTime: '2小时前',
        images: [
          'https://picsum.photos/seed/coffee1/600/400',
          'https://picsum.photos/seed/coffee2/600/400',
          'https://picsum.photos/seed/coffee3/600/400'
        ],
        topics: ['今日话题', '生活碎片'],
        likeCount: 245,
        commentCount: 42,
        collectCount: 89,
        isLiked: false,
        isCollected: false,
        soulMatch: 88
      },
      {
        id: '2',
        user: {
          id: 'user2',
          nickname: '城市探险家',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        content: '发现了一家隐藏在小巷子里的宝藏咖啡馆，环境安静舒适，咖啡也很地道。周末可以来这里坐坐，享受慢时光。#今日话题# #咖啡控#',
        postTime: '5小时前',
        images: [
          'https://picsum.photos/seed/cafe1/600/400',
          'https://picsum.photos/seed/cafe2/600/400'
        ],
        topics: ['今日话题', '咖啡控'],
        likeCount: 189,
        commentCount: 36,
        collectCount: 72,
        isLiked: true,
        isCollected: false,
        soulMatch: 75
      },
      {
        id: '3',
        user: {
          id: 'user3',
          nickname: '文艺青年',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
        },
        content: '读完了《百年孤独》，马尔克斯的文字总是那么有魔力，让人沉浸其中无法自拔。推荐给喜欢文学的朋友们。#今日话题# #读书笔记#',
        postTime: '昨天',
        images: [
          'https://picsum.photos/seed/book1/600/400'
        ],
        topics: ['今日话题', '读书笔记'],
        likeCount: 324,
        commentCount: 58,
        collectCount: 126,
        isLiked: false,
        isCollected: true,
        soulMatch: 92
      }
    ],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad: function(options) {
    // 获取从上个页面传递的话题参数
    if (options.topic) {
      this.setData({
        topic: decodeURIComponent(options.topic)
      });
      this.loadTopicInfo();
      this.loadTopicFeeds();
    }
  },

  // 返回上一页
  goBack: function() {
    wx.navigateBack();
  },

  // 加载话题信息
  loadTopicInfo: function() {
    // 实际项目中应该调用API获取话题信息
    // 这里使用模拟数据
    setTimeout(() => {
      this.setData({
        topicInfo: {
          name: this.data.topic,
          description: '分享关于' + this.data.topic + '的一切，发现更多志同道合的朋友！',
          postCount: Math.floor(Math.random() * 10000) + 1000,
          followerCount: Math.floor(Math.random() * 5000) + 500,
          viewCount: Math.floor(Math.random() * 50000) + 5000
        },
        isFollowing: Math.random() > 0.5
      });
    }, 500);
  },

  // 加载话题动态
  loadTopicFeeds: function() {
    if (!this.data.hasMore || this.data.loading) return;
    
    this.setData({
      loading: true
    });
    
    // 实际项目中应该调用API获取话题动态
    // 这里使用模拟数据
    setTimeout(() => {
      const newFeeds = this.generateMockFeeds(this.data.page);
      
      if (newFeeds.length === 0 || newFeeds.length < this.data.pageSize) {
        this.setData({
          hasMore: false
        });
      }
      
      this.setData({
        feedList: this.data.page === 1 ? newFeeds : [...this.data.feedList, ...newFeeds],
        loading: false,
        page: this.data.page + 1
      });
    }, 1000);
  },

  // 生成模拟动态数据
  generateMockFeeds: function(page) {
    const feeds = [];
    const userAvatars = [
      'https://picsum.photos/200/200?random=1',
      'https://picsum.photos/200/200?random=2',
      'https://picsum.photos/200/200?random=3',
      'https://picsum.photos/200/200?random=4',
      'https://picsum.photos/200/200?random=5'
    ];
    const userNicknames = ['甜甜圈', '奶茶少女', '吉他手', '旅行日记', '咖啡不加糖', '深夜诗人', '电影收藏家'];
    const contents = [
      '今天和朋友一起讨论了' + this.data.topic + '，收获满满！大家有什么看法吗？',
      '分享一些关于' + this.data.topic + '的小技巧，希望对大家有帮助～',
      '最近对' + this.data.topic + '特别感兴趣，有没有大神可以指导一下？',
      '发现了一个超棒的' + this.data.topic + '资源，分享给大家！',
      '终于完成了一个关于' + this.data.topic + '的小项目，好开心！',
      '今天参加了一个' + this.data.topic + '主题的线下活动，认识了很多新朋友～',
      '想知道大家都是怎么开始接触' + this.data.topic + '的呢？'
    ];
    
    // 生成每页数据
    for (let i = 0; i < this.data.pageSize; i++) {
      const feedIndex = (page - 1) * this.data.pageSize + i;
      const images = [];
      const imageCount = Math.floor(Math.random() * 9);
      
      for (let j = 0; j < imageCount; j++) {
        images.push({
          url: `https://picsum.photos/800/800?random=${feedIndex * 10 + j}`
        });
      }
      
      // 随机生成评论
      const comments = [];
      const commentCount = Math.floor(Math.random() * 5);
      
      for (let k = 0; k < commentCount; k++) {
        comments.push({
          user: {
            nickname: userNicknames[Math.floor(Math.random() * userNicknames.length)]
          },
          content: ['说得很有道理！', '学习了～', '我也有同样的感受', '感谢分享！', '太棒了！'][Math.floor(Math.random() * 5)],
          time: this.getRandomTime()
        });
      }
      
      feeds.push({
        id: `topic_feed_${feedIndex}`,
        user: {
          id: `user_${Math.floor(Math.random() * 5) + 1}`,
          avatar: userAvatars[Math.floor(Math.random() * userAvatars.length)],
          nickname: userNicknames[Math.floor(Math.random() * userNicknames.length)]
        },
        content: contents[Math.floor(Math.random() * contents.length)],
        topics: [this.data.topic],
        images: images,
        postTime: this.getRandomTime(),
        likeCount: Math.floor(Math.random() * 1000),
        commentCount: commentCount,
        collectCount: Math.floor(Math.random() * 100),
        isLiked: Math.random() > 0.7,
        isCollected: Math.random() > 0.8,
        comments: comments,
        soulMatch: Math.floor(Math.random() * 100)
      });
    }
    
    return feeds;
  },

  // 获取随机时间
  getRandomTime: function() {
    const now = new Date();
    const pastTime = new Date(now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)); // 7天内
    const diff = now.getTime() - pastTime.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    
    if (days > 0) {
      return days + '天前';
    } else if (hours > 0) {
      return hours + '小时前';
    } else if (minutes > 0) {
      return minutes + '分钟前';
    } else {
      return '刚刚';
    }
  },

  // 切换标签
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab !== this.data.activeTab) {
      this.setData({
        activeTab: tab,
        feedList: [],
        page: 1,
        hasMore: true
      });
      this.loadTopicFeeds();
    }
  },

  // 关注/取消关注话题
  toggleFollow: function() {
    this.setData({
      isFollowing: !this.data.isFollowing,
      'topicInfo.followerCount': this.data.isFollowing ? 
        this.data.topicInfo.followerCount - 1 : this.data.topicInfo.followerCount + 1
    });
    
    // 实际项目中应该调用API更新关注状态
    wx.showToast({
      title: this.data.isFollowing ? '关注成功' : '已取消关注',
      icon: 'none'
    });
  },

  // 分享话题
  shareTopic: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 点赞
  likeFeed: function(e) {
    const feedId = e.currentTarget.dataset.id;
    const index = this.data.feedList.findIndex(feed => feed.id === feedId);
    
    if (index !== -1) {
      const isLiked = this.data.feedList[index].isLiked;
      const likeCount = this.data.feedList[index].likeCount;
      
      this.setData({
        [`feedList[${index}].isLiked`]: !isLiked,
        [`feedList[${index}].likeCount`]: isLiked ? likeCount - 1 : likeCount + 1
      });
    }
  },

  // 收藏
  collectFeed: function(e) {
    const feedId = e.currentTarget.dataset.id;
    const index = this.data.feedList.findIndex(feed => feed.id === feedId);
    
    if (index !== -1) {
      const isCollected = this.data.feedList[index].isCollected;
      const collectCount = this.data.feedList[index].collectCount;
      
      this.setData({
        [`feedList[${index}].isCollected`]: !isCollected,
        [`feedList[${index}].collectCount`]: isCollected ? collectCount - 1 : collectCount + 1
      });
    }
  },

  // 评论
  commentFeed: function(e) {
    const feedId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/comment/comment?feedId=${feedId}`
    });
  },

  // 查看用户主页
  viewUserProfile: function(e) {
    const userId = e.currentTarget.dataset.userId;
    wx.navigateTo({
      url: `/pages/user/profile?userId=${userId}`
    });
  },

  // 查看话题标签
  viewTopic: function(e) {
    const topic = e.currentTarget.dataset.topic;
    wx.navigateTo({
      url: `/pages/topic/topic?topic=${encodeURIComponent(topic)}`
    });
  },

  // 上拉加载更多
  onReachBottom: function() {
    this.loadTopicFeeds();
  },

  // 分享给朋友
  onShareAppMessage: function() {
    return {
      title: '我在Soul发现了一个有趣的话题：' + this.data.topic,
      path: `/pages/topic/topic?topic=${encodeURIComponent(this.data.topic)}`,
      imageUrl: 'https://picsum.photos/400/400?random=100'
    };
  },

  // 分享到朋友圈
  onShareTimeline: function() {
    return {
      title: '我在Soul发现了一个有趣的话题：' + this.data.topic,
      query: `topic=${encodeURIComponent(this.data.topic)}`,
      imageUrl: 'https://picsum.photos/400/400?random=100'
    };
  }
});