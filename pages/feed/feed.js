// pages/feed/feed.js
const { get, post } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    activeTab: 'recommend',
    currentShareFeedId: null,
    feedList: [
      {
        id: '1',
        user: {
          id: 'user1',
          nickname: '小确幸',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        content: '今天阳光很好，心情也跟着明媚起来。分享一组午后的咖啡时光，希望大家也能感受到这份温暖。#生活碎片#',
        postTime: '2小时前',
        images: [
          'https://picsum.photos/seed/coffee1/600/400',
          'https://picsum.photos/seed/coffee2/600/400',
          'https://picsum.photos/seed/coffee3/600/400'
        ],
        topics: ['生活碎片'],
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
        content: '发现了一家隐藏在小巷子里的宝藏咖啡馆，环境安静舒适，咖啡也很地道。周末可以来这里坐坐，享受慢时光。#咖啡控#',
        postTime: '5小时前',
        images: [
          'https://picsum.photos/seed/cafe1/600/400',
          'https://picsum.photos/seed/cafe2/600/400'
        ],
        topics: ['咖啡控'],
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
        content: '读完了《百年孤独》，马尔克斯的文字总是那么有魔力，让人沉浸其中无法自拔。推荐给喜欢文学的朋友们。#读书笔记#',
        postTime: '昨天',
        images: [
          'https://picsum.photos/seed/book1/600/400'
        ],
        topics: ['读书笔记'],
        likeCount: 324,
        commentCount: 58,
        collectCount: 126,
        isLiked: false,
        isCollected: true,
        soulMatch: 92
      },
      {
        id: '4',
        user: {
          id: 'user4',
          nickname: '美食达人',
          avatar: 'https://randomuser.me/api/portraits/women/29.jpg'
        },
        content: '周末在家做了顿丰盛的晚餐，自己动手丰衣足食的感觉真好！分享给大家，希望你们也能喜欢。#美食日记#',
        postTime: '2天前',
        images: [
          'https://picsum.photos/seed/food1/600/400',
          'https://picsum.photos/seed/food2/600/400',
          'https://picsum.photos/seed/food3/600/400',
          'https://picsum.photos/seed/food4/600/400'
        ],
        topics: ['美食日记'],
        likeCount: 456,
        commentCount: 89,
        collectCount: 201,
        isLiked: true,
        isCollected: true,
        soulMatch: 85
      }
    ],
    isLoading: false,
    noMoreFeeds: false,
    pageNum: 1,
    pageSize: 10,
    showCommentModal: false,
    commentContent: '',
    currentFeedId: ''
  },

  onLoad: function(options) {
    // 加载动态列表
    this.loadFeedList();
  },

  onShow: function() {
    // 页面显示时检查是否需要刷新
    if (this.data.feedList.length === 0 && !this.data.isLoading) {
      this.loadFeedList();
    }
    
    // 微信小程序不支持document.createElement('img')，所以移除预加载调用
    // if (this.data.feedList.length > 0) {
    //   this.preloadVisibleImages();
    // }
  },

  // 切换标签
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    if (this.data.activeTab === tab) return;
    
    this.setData({
      activeTab: tab,
      feedList: [],
      pageNum: 1,
      noMoreFeeds: false
    });
    
    this.loadFeedList();
  },

  // 加载动态列表
  loadFeedList: function() {
    if (this.data.isLoading || this.data.noMoreFeeds) return;
    
    this.setData({ isLoading: true });
    
    // 模拟API请求
    setTimeout(() => {
      // 生成模拟数据
      const mockFeeds = this.generateMockFeeds();
      
      if (mockFeeds.length === 0) {
        this.setData({ noMoreFeeds: true });
      } else {
        const newFeeds = this.data.pageNum === 1 ? mockFeeds : [...this.data.feedList, ...mockFeeds];
        this.setData({
          feedList: newFeeds,
          pageNum: this.data.pageNum + 1,
          noMoreFeeds: mockFeeds.length < this.data.pageSize
        });
      }
      
      this.setData({ isLoading: false });
      
      // 微信小程序不支持document.createElement('img')，所以移除预加载调用
      // this.preloadVisibleImages();
    }, 1000);
  },
  
  // 图片加载完成处理
  imageLoad: function(e) {
    const { index, feedid } = e.currentTarget.dataset;
    console.log(`图片加载完成: feedId=${feedid}, index=${index}`);
  },

  // 图片加载失败处理
  imageLoadError: function(e) {
    const { index, feedid } = e.currentTarget.dataset;
    console.log(`图片加载失败: feedId=${feedid}, index=${index}`);
    
    // 尝试使用备用URL重新加载
    const feedList = this.data.feedList;
    for (let i = 0; i < feedList.length; i++) {
      if (feedList[i].id === feedid && feedList[i].images && feedList[i].images[index]) {
        // 生成新的随机URL尝试重新加载
        const retryUrl = this.generateRetryImageUrl(feedid, index);
        
        // 如果是第一次失败，添加重试标记
        if (!feedList[i].imageErrors) {
          feedList[i].imageErrors = {};
        }
        
        const errorCount = (feedList[i].imageErrors[index] || 0) + 1;
        
        // 最多重试3次
        if (errorCount <= 3) {
          feedList[i].imageErrors[index] = errorCount;
          feedList[i].images[index] = retryUrl;
          this.setData({ feedList });
          console.log(`尝试重新加载图片: 第${errorCount}次`);
        } else {
          // 超过重试次数，使用占位图
          feedList[i].images[index] = '/assets/icons/placeholder.png';
          this.setData({ feedList });
          console.log(`图片加载失败已达最大重试次数，使用占位图`);
        }
        break;
      }
    }
  },

  // 生成重试图片URL
  generateRetryImageUrl: function(feedid, index) {
    // 使用不同的图片服务或参数生成备用URL
    const timestamp = new Date().getTime();
    return `https://picsum.photos/800/800?random=${feedid}_${index}_${timestamp}`;
  },

  // 图片预加载处理（使用微信小程序支持的方式）
  preloadVisibleImages: function() {
    // 微信小程序没有wx.preloadImage API，改为使用image对象进行预加载
    const { feedList } = this.data;
    const preloadImages = [];
    
    // 收集需要预加载的图片URL
    for (let i = 0; i < Math.min(3, feedList.length); i++) {
      if (feedList[i].images) {
        preloadImages.push(...feedList[i].images.slice(0, 3)); // 每个feed预加载前3张图片
      }
    }
    
    // 使用JavaScript Image对象预加载图片
    if (preloadImages.length > 0) {
      preloadImages.forEach((url) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          console.log(`图片预加载完成: ${url}`);
        };
        img.onerror = (err) => {
          console.log(`图片预加载失败: ${url}`, err);
        };
      });
    }
  },

  // 生成模拟动态数据
  generateMockFeeds: function() {
    const feeds = [];
    // 使用更稳定的图片URL格式
    const userAvatars = [
      'https://picsum.photos/id/1/200/200',
      'https://picsum.photos/id/2/200/200',
      'https://picsum.photos/id/3/200/200',
      'https://picsum.photos/id/4/200/200',
      'https://picsum.photos/id/5/200/200'
    ];
    const userNicknames = ['甜甜圈', '奶茶少女', '吉他手', '旅行日记', '咖啡不加糖', '深夜诗人', '电影收藏家'];
    const contents = [
      '今日份的快乐是阳光给的～☀️ 出来走走心情都变好了～ #今日份开心 #生活碎片',
      '新买的相机终于到了！📷 迫不及待想出去拍美美的照片，有人一起约拍吗？ #摄影爱好者 #约拍',
      '周末参加了一个超有意思的读书会📚 认识了很多志同道合的小伙伴，分享了好多好书～ #读书 #分享',
      '今天尝试做了一道新菜，卖相还不错吧？味道也超赞！下次可以教大家～ #美食日记 #做饭',
      '最近在学习一门新技能，虽然很难但很有成就感，每天进步一点点！💪 #学习日常 #坚持',
      '昨天去看了一场超棒的演唱会🎵 现场气氛太嗨了，音乐真的有治愈的力量～ #音乐现场 #演唱会',
      '分享一首最近单曲循环的歌🎧 旋律太洗脑了，推荐给大家～ #音乐推荐 #单曲循环'
    ];
    const topics = ['今日份开心', '生活碎片', '摄影爱好者', '约拍', '读书', '分享', '美食日记', '做饭', '学习日常', '坚持', '音乐现场', '演唱会', '音乐推荐', '单曲循环'];
    const musicList = [
      { title: '晴天', artist: '周杰伦' },
      { title: '起风了', artist: '买辣椒也用券' },
      { title: '这世界那么多人', artist: '莫文蔚' },
      { title: '夜曲', artist: '周杰伦' },
      { title: '海阔天空', artist: 'Beyond' }
    ];
    
    for (let i = 0; i < this.data.pageSize; i++) {
      const index = (this.data.pageNum - 1) * this.data.pageSize + i;
      const hasImages = Math.random() > 0.3;
      const imageCount = hasImages ? Math.floor(Math.random() * 9) + 1 : 0;
      const images = [];
      
      for (let j = 0; j < imageCount; j++) {
        // 使用更稳定的ID-based URL格式
        images.push(`https://picsum.photos/id/${(index * 10 + j) % 100}/800/800`);
      }
      
      const hasMusic = Math.random() > 0.6;
      const music = hasMusic ? musicList[Math.floor(Math.random() * musicList.length)] : null;
      
      const hasComments = Math.random() > 0.4;
      const commentCount = hasComments ? Math.floor(Math.random() * 5) + 1 : 0;
      const comments = [];
      
      for (let j = 0; j < commentCount; j++) {
        comments.push({
          user: {
            nickname: userNicknames[Math.floor(Math.random() * userNicknames.length)]
          },
          content: ['写得真好！', '太赞了', '不错不错', '收藏了', '学到了'][Math.floor(Math.random() * 5)]
        });
      }
      
      // 提取内容中的话题
      const content = contents[Math.floor(Math.random() * contents.length)];
      const contentTopics = [];
      
      // 随机添加1-3个话题
      const topicCount = Math.floor(Math.random() * 3) + 1;
      const shuffledTopics = topics.sort(() => 0.5 - Math.random());
      for (let j = 0; j < topicCount; j++) {
        contentTopics.push(shuffledTopics[j]);
      }
      
      feeds.push({
        id: `feed_${index}`,
        user: {
          id: `user_${Math.floor(Math.random() * 5) + 1}`,
          avatar: userAvatars[Math.floor(Math.random() * userAvatars.length)],
          nickname: userNicknames[Math.floor(Math.random() * userNicknames.length)]
        },
        content: content,
        topics: contentTopics,
        images: images,
        music: music,
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
    const minutesAgo = Math.floor(Math.random() * 1440); // 0-24小时
    const pastTime = new Date(now - minutesAgo * 60000);
    
    if (minutesAgo < 60) {
      return `${minutesAgo}分钟前`;
    } else if (minutesAgo < 1440) {
      return `${Math.floor(minutesAgo / 60)}小时前`;
    } else {
      return `${Math.floor(minutesAgo / 1440)}天前`;
    }
  },

  // 上拉加载更多
  loadMoreFeeds: function() {
    this.loadFeedList();
  },

  // 点赞
  likeFeed: function(e) {
    const feedId = e.currentTarget.dataset.feedid;
    const feedList = this.data.feedList;
    
    for (let i = 0; i < feedList.length; i++) {
      if (feedList[i].id === feedId) {
        feedList[i].isLiked = !feedList[i].isLiked;
        feedList[i].likeCount += feedList[i].isLiked ? 1 : -1;
        break;
      }
    }
    
    this.setData({ feedList });
    
    // 这里可以调用API发送点赞请求
  },

  // 评论
  commentFeed: function(e) {
    const feedId = e.currentTarget.dataset.feedid;
    this.setData({
      showCommentModal: true,
      commentContent: '',
      currentFeedId: feedId
    });
  },

  // 收藏
  collectFeed: function(e) {
    const feedId = e.currentTarget.dataset.feedid;
    const feedList = this.data.feedList;
    
    for (let i = 0; i < feedList.length; i++) {
      if (feedList[i].id === feedId) {
        feedList[i].isCollected = !feedList[i].isCollected;
        feedList[i].collectCount += feedList[i].isCollected ? 1 : -1;
        break;
      }
    }
    
    this.setData({ feedList });
    
    // 这里可以调用API发送收藏请求
  },

  // 分享
  shareFeed: function(e) {
    // 保存当前要分享的feedId
    const feedId = e.currentTarget.dataset.feedid;
    this.setData({ currentShareFeedId: feedId });
    
    // 显示分享菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 查看全部评论
  viewAllComments: function(e) {
    const feedId = e.currentTarget.dataset.feedid;
    // 这里可以跳转到评论详情页
    wx.showToast({
      title: '查看全部评论',
      icon: 'none'
    });
  },

  // 显示评论输入框
  showCommentInput: function(e) {
    const feedId = e.currentTarget.dataset.feedid;
    this.setData({
      showCommentModal: true,
      commentContent: '',
      currentFeedId: feedId
    });
  },

  // 隐藏评论弹窗
  hideCommentModal: function() {
    this.setData({ showCommentModal: false });
  },

  // 输入评论内容
  onCommentInput: function(e) {
    this.setData({ commentContent: e.detail.value });
  },

  // 发送评论
  sendComment: function() {
    if (!this.data.commentContent.trim()) return;
    
    const feedId = this.data.currentFeedId;
    const feedList = this.data.feedList;
    
    for (let i = 0; i < feedList.length; i++) {
      if (feedList[i].id === feedId) {
        // 创建新评论
        const newComment = {
          user: {
            nickname: app.globalData.userInfo.nickname || '我'
          },
          content: this.data.commentContent.trim()
        };
        
        // 添加到评论列表
        if (!feedList[i].comments) {
          feedList[i].comments = [];
        }
        feedList[i].comments.unshift(newComment);
        feedList[i].commentCount += 1;
        break;
      }
    }
    
    this.setData({
      feedList,
      showCommentModal: false,
      commentContent: ''
    });
    
    // 这里可以调用API发送评论请求
  },

  // 停止冒泡
  stopPropagation: function() {
    // 阻止事件冒泡
  },

  // 导航到发布页面
  navigateToPublish: function() {
    wx.navigateTo({
      url: '/pages/publish/publish'
    });
  },

  // 导航到用户资料页
  navigateToUserProfile: function(e) {
    const userId = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: `/pages/profile/profile?userId=${userId}`
    });
  },

  // 导航到搜索页面
  navigateToSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },
  
  // 导航到话题页面
  navigateToTopic: function(e) {
    const topic = e.currentTarget.dataset.topic;
    wx.navigateTo({
      url: `/pages/topic/topic?topic=${encodeURIComponent(topic)}`
    });
  },

  // 显示更多选项
  showMoreOptions: function(e) {
    const feedId = e.currentTarget.dataset.feedid;
    wx.showActionSheet({
      itemList: ['举报', '不感兴趣', '复制链接'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 举报
          wx.showToast({
            title: '已举报',
            icon: 'none'
          });
        } else if (res.tapIndex === 1) {
          // 不感兴趣
          const feedList = this.data.feedList;
          const index = feedList.findIndex(item => item.id === feedId);
          if (index !== -1) {
            feedList.splice(index, 1);
            this.setData({ feedList });
          }
        } else if (res.tapIndex === 2) {
          // 复制链接
          const path = `/pages/feed/feed?shareId=${feedId}`;
          wx.setClipboardData({
            data: path,
            success: () => {
              wx.showToast({
                title: '分享路径已复制',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  // 页面分享
  onShareAppMessage: function() {
    const { currentShareFeedId, feedList } = this.data;
    
    // 如果有指定要分享的feed，则使用该feed的信息
    if (currentShareFeedId) {
      const feed = feedList.find(item => item.id === currentShareFeedId);
      if (feed) {
        return {
          title: feed.content.substring(0, 30) + (feed.content.length > 30 ? '...' : ''),
          path: '/pages/feed/feed?shareId=' + currentShareFeedId,
          imageUrl: feed.images && feed.images.length > 0 ? feed.images[0] : 'https://picsum.photos/400/300'
        };
      }
    }
    
    // 默认分享信息
    return {
      title: '来看看我在交友π发现的精彩动态',
      path: '/pages/feed/feed',
      imageUrl: 'https://picsum.photos/400/300'
    };
  }
});