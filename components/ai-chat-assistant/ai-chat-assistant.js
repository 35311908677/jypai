// AI聊天助手组件逻辑
Component({
  properties: {
    chatHistory: {
      type: Array,
      value: [],
      observer: function(newValue) {
        // 当聊天历史更新时，刷新AI分析
        if (newValue && newValue.length > 0) {
          this.analyzeConversation();
        }
      }
    },
    targetUserInfo: {
      type: Object,
      value: {}
    }
  },

  data: {
    showAssistant: false,
    emotionAnalysis: null,
    replySuggestions: [],
    conversationSummary: '',
    isAnalyzing: false
  },

  methods: {
    // 切换助手显示状态
    toggleAssistant: function() {
      this.setData({
        showAssistant: !this.data.showAssistant
      });
      
      // 如果显示助手并且还没有分析，进行分析
      if (this.data.showAssistant && !this.data.emotionAnalysis && this.properties.chatHistory.length > 0) {
        this.analyzeConversation();
      }
    },

    // 分析对话内容
    analyzeConversation: function() {
      const that = this;
      
      this.setData({ isAnalyzing: true });
      
      // 模拟API调用延迟
      setTimeout(() => {
        // 生成情绪分析结果
        const emotionResult = that.generateMockEmotionAnalysis();
        
        // 生成回复建议
        const replySuggestions = that.generateMockReplySuggestions();
        
        // 生成对话摘要
        const summary = that.generateMockConversationSummary();
        
        that.setData({
          emotionAnalysis: emotionResult,
          replySuggestions: replySuggestions,
          conversationSummary: summary,
          isAnalyzing: false
        });
      }, 800);
    },

    // 生成模拟情绪分析结果
    generateMockEmotionAnalysis: function() {
      const emotions = [
        {
          score: 85,
          label: '愉快',
          description: '对方心情不错，氛围很轻松',
          color: '#34c759'
        },
        {
          score: 70,
          label: '友好',
          description: '对方很友好，可以继续深入交流',
          color: '#5856d6'
        },
        {
          score: 60,
          label: '平静',
          description: '对话氛围比较平静',
          color: '#007aff'
        },
        {
          score: 50,
          label: '一般',
          description: '对话氛围一般，可以尝试找些有趣的话题',
          color: '#ff9500'
        }
      ];
      
      // 随机选择一个情绪状态
      return emotions[Math.floor(Math.random() * emotions.length)];
    },

    // 生成模拟回复建议
    generateMockReplySuggestions: function() {
      const suggestions = [
        ['你平时喜欢做什么呀？', '看你资料说你喜欢旅行，去过哪些地方呢？', '今天天气真不错，你在做什么呢？'],
        ['我也很喜欢这个爱好！', '听起来很有趣，能详细说说吗？', '你是怎么开始对这个感兴趣的？'],
        ['哈哈哈太搞笑了', '我理解你的感受', '真的吗？那太棒了！'],
        ['你说得很有道理', '我之前也有类似的经历', '这个观点很独特']
      ];
      
      // 随机选择一组建议
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    },

    // 生成模拟对话摘要
    generateMockConversationSummary: function() {
      const summaries = [
        '你们聊了各自的兴趣爱好，对方对旅行很感兴趣，还提到了喜欢看电影。可以继续聊聊最近看过的好电影。',
        '对话氛围很轻松，你们分享了今天的经历，对方提到了今天去了一家不错的餐厅。可以问问具体是哪家餐厅，有什么推荐的菜品。',
        '你们讨论了工作和生活的平衡，对方似乎对这个话题很感兴趣。可以分享一些你自己的经验或者看法。',
        '聊天很愉快，你们互相了解了一些基本情况。可以尝试约个时间一起参加活动，增进了解。'
      ];
      
      // 随机选择一个摘要
      return summaries[Math.floor(Math.random() * summaries.length)];
    },

    // 选择回复建议
    selectReply: function(e) {
      const reply = e.currentTarget.dataset.reply;
      this.triggerEvent('replyselect', { content: reply });
      
      // 选择后隐藏助手
      this.setData({ showAssistant: false });
    },

    // 刷新对话摘要
    refreshSummary: function() {
      this.setData({
        conversationSummary: this.generateMockConversationSummary()
      });
    },

    // 生成问候语
    generateGreeting: function() {
      const greetings = [
        '你好！看了你的资料，觉得我们有很多共同兴趣呢～',
        'Hi！很高兴认识你，能和我聊聊你的爱好吗？',
        '嗨！今天过得怎么样？想找个人聊聊天吗？',
        '你好呀！在这个平台上遇到真的很有缘呢～'
      ];
      
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      this.triggerEvent('replyselect', { content: greeting });
      
      // 生成后隐藏助手
      this.setData({ showAssistant: false });
    },

    // 生成破冰话题
    generateIceBreaker: function() {
      const iceBreakers = [
        '如果你可以拥有一种超能力，你最想要什么？为什么？',
        '最近有看什么好看的电影或电视剧吗？可以推荐一下吗？',
        '你平时周末最喜欢做什么？',
        '如果给你一次免费旅行的机会，你最想去哪里？'
      ];
      
      const iceBreaker = iceBreakers[Math.floor(Math.random() * iceBreakers.length)];
      this.triggerEvent('replyselect', { content: iceBreaker });
      
      // 生成后隐藏助手
      this.setData({ showAssistant: false });
    }
  }
});