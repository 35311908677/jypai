# 《交友π- Al距离交友》微信小程序技术架构文档

## 一、架构概述

本文档基于《交友π- Al距离交友》微信小程序产品需求，提供技术实现架构方案。架构设计遵循最小化开发原则，仅实现需求文档中明确提到的功能，并严格遵循前后端分离原则。

## 二、前端架构

### 1. 技术栈选择
- **开发框架**：微信小程序原生开发框架（WXML、WXSS、JavaScript）
- **数据请求**：微信小程序内置API（wx.request）
- **组件库**：微信小程序原生组件

### 2. 目录结构
```
├── pages/
│   ├── index/                  # 首页/匹配页
│   ├── login/                  # 登录/注册页
│   ├── profile/                # 个人主页
│   ├── edit-profile/           # 编辑个人资料页
│   ├── message-list/           # 消息列表页
│   ├── chat/                   # 聊天详情页
│   ├── activity-list/          # 活动列表页
│   ├── interest-circle/        # 兴趣圈页面
│   └── settings/               # 设置页面
├── components/                 # 公共组件
│   ├── user-card/              # 用户卡片组件
│   ├── chat-input/             # 聊天输入组件
│   ├── ai-chat-assistant/      # AI聊天助手组件
│   └── ...
├── utils/                      # 工具函数
│   ├── request.js              # 网络请求封装
│   ├── auth.js                 # 权限认证相关
│   └── ...
├── app.js                      # 应用入口文件
├── app.json                    # 全局配置
└── app.wxss                    # 全局样式
```

### 3. 核心模块实现

#### 3.1 页面导航与状态管理
- 使用微信小程序的页面栈进行页面跳转
- 通过全局变量或本地存储管理用户登录状态
- 使用页面间参数传递实现简单数据共享

#### 3.2 用户匹配模块
- 实现上下滑动切换推荐用户功能
- 展示用户基本信息和匹配度
- 实现喜欢/不喜欢操作及回调处理

#### 3.3 个人资料模块
- 实现多步骤表单提交
- 处理图片上传功能
- 实现资料隐私设置UI与逻辑

#### 3.4 聊天系统模块
- 实现文字、表情、图片发送功能
- 集成AI聊天助手建议展示
- 实现聊天记录本地缓存与分页加载

## 三、后端架构

### 1. 技术栈选择
- **服务器环境**：Node.js
- **Web框架**：Express.js
- **数据库**：MongoDB（用户数据、聊天记录）
- **缓存**：Redis（临时数据缓存）
- **认证**：JWT (JSON Web Token)

### 2. API接口设计
- **用户接口**：注册、登录、个人资料管理、隐私设置
- **匹配接口**：获取推荐用户、喜欢/不喜欢操作、匹配结果查询
- **聊天接口**：获取聊天列表、发送消息、获取聊天记录
- **活动接口**：获取活动列表、参与/发布活动
- **兴趣圈接口**：获取兴趣圈列表、加入/退出兴趣圈

### 3. 数据库设计

#### 3.1 用户表(User)
```
{
  _id: ObjectId,              // 用户唯一标识
  openId: String,              // 微信OpenID
  phone: String,               // 手机号
  nickname: String,            // 昵称
  avatar: String,              // 头像URL
  gender: Number,              // 性别
  age: Number,                 // 年龄
  location: {                  // 位置信息
    longitude: Number,
    latitude: Number,
    address: String
  },
  interests: Array,            // 兴趣爱好
  tags: Array,                 // 个人标签
  bio: String,                 // 个人简介
  matchPreferences: {          // 匹配偏好
    ageRange: [Number, Number],
    gender: Number,
    distance: Number
  },
  privacySettings: {           // 隐私设置
    showAge: Boolean,
    showLocation: Boolean,
    ...
  },
  createdAt: Date,             // 创建时间
  updatedAt: Date              // 更新时间
}
```

#### 3.2 聊天表(Chat)
```
{
  _id: ObjectId,               // 会话唯一标识
  participants: [ObjectId],    // 参与用户ID
  lastMessage: {
    content: String,
    type: String,              // text/image/emoji
    senderId: ObjectId,
    timestamp: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 3.3 消息表(Message)
```
{
  _id: ObjectId,
  chatId: ObjectId,            // 所属会话ID
  senderId: ObjectId,          // 发送者ID
  content: String,             // 消息内容
  type: String,                // text/image/emoji
  timestamp: Date,             // 发送时间
  isRead: Boolean              // 是否已读
}
```

#### 3.4 活动表(Activity)
```
{
  _id: ObjectId,
  title: String,               // 活动标题
  description: String,         // 活动描述
  location: {                  // 活动地点
    longitude: Number,
    latitude: Number,
    address: String
  },
  time: Date,                  // 活动时间
  organizerId: ObjectId,       // 组织者ID
  participants: [ObjectId],    // 参与者ID列表
  createdAt: Date,
  updatedAt: Date
}
```

## 四、AI能力集成

### 1. 推荐算法服务
- **功能**：根据用户资料和行为数据生成匹配推荐
- **实现**：基于用户兴趣、标签、地理位置等特征的协同过滤算法
- **调用方式**：HTTP API调用

### 2. 聊天辅助服务
- **功能**：提供智能回复建议、聊天情绪分析、对话摘要生成
- **实现**：基于NLP的文本分析和生成模型
- **调用方式**：HTTP API调用

### 3. 图像分析服务
- **功能**：形象风格分析、内容审核
- **实现**：基于计算机视觉的图像识别模型
- **调用方式**：HTTP API调用

### 4. AI服务接口设计
```
# 推荐用户接口
POST /api/ai/recommend
参数: {
  userId: String,
  count: Number
}

# 聊天助手接口
POST /api/ai/chat-assistant
参数: {
  userId: String,
  chatHistory: Array,
  type: String  // 'reply'|'analysis'|'summary'
}

# 图像分析接口
POST /api/ai/image-analysis
参数: {
  userId: String,
  imageUrl: String,
  type: String  // 'style'|'audit'
}
```

## 五、前后端交互流程

### 1. 用户认证流程
1. 前端调用微信登录获取code
2. 前端将code发送至后端认证接口
3. 后端通过微信接口获取openId并生成token
4. 后端返回token给前端
5. 前端存储token并在后续请求中携带

### 2. 数据请求流程
1. 前端封装请求参数，携带token
2. 调用wx.request发送请求
3. 后端验证token有效性
4. 后端处理业务逻辑并返回数据
5. 前端处理返回结果并更新UI

### 3. 聊天消息流程
1. 前端发送消息至后端API
2. 后端存储消息并更新会话状态
3. 后端推送消息通知给接收方
4. 接收方前端接收消息并更新界面

## 六、核心功能实现方案

### 1. 智能用户匹配
- 前端展示匹配卡片，支持滑动操作
- 后端接收用户选择，更新用户行为数据
- 后端调用推荐算法服务获取新的推荐列表
- 前端分页加载推荐用户

### 2. 个性化资料展示
- 前端实现多步骤表单，分步收集用户信息
- 后端验证并存储用户资料
- 前端根据隐私设置控制资料显示

### 3. 智能聊天系统
- 前端实现消息发送和接收功能
- 后端处理消息存储和转发
- 前端调用AI聊天助手API获取建议
- 前端展示聊天情绪分析结果

### 4. 社交互动功能
- 前端实现喜欢/不喜欢按钮及动画效果
- 后端处理匹配逻辑，生成匹配结果
- 前端展示活动列表和兴趣圈内容

### 5. 安全与隐私保护
- 前端实现敏感操作的二次确认
- 后端对用户敏感数据进行加密处理
- 后端集成AI内容审核服务
- 后端实现用户举报处理机制

---

**文档版本**：v1.0
**编写日期**：2023年11月
**更新记录**：初始版本