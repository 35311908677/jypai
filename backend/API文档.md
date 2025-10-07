# 交友π后端API文档

## 项目介绍
交友π是一个基于AI匹配的社交平台，提供用户认证、个人资料管理、智能推荐、聊天和活动组织等功能。

## 技术栈
- 后端：Node.js + Express
- 数据库：MongoDB
- 缓存：Redis
- 认证：JWT

## 基础信息

### 基础URL
```
http://localhost:3000/api
```

### 认证方式
大部分接口需要JWT认证，在请求头中添加：
```
Authorization: Bearer {token}
```

### 响应格式
所有接口统一返回JSON格式，包含以下字段：
```json
{
  "success": true/false,
  "message": "操作描述",
  "data": {}
}
```

## 一、用户管理API

### 1. 微信登录
- **URL**: `/api/users/login`
- **方法**: `POST`
- **认证**: 无需
- **请求参数**: 
  ```json
  {
    "code": "微信登录code",
    "userInfo": {
      "nickName": "用户昵称",
      "avatarUrl": "头像URL",
      "gender": 0/1/2
    }
  }
  ```
- **响应**: 
  ```json
  {
    "success": true,
    "message": "登录成功",
    "data": {
      "user": {
        "id": "用户ID",
        "nickname": "用户昵称",
        "avatar": "头像URL",
        "gender": 0/1/2
      },
      "token": "JWT令牌"
    }
  }
  ```

### 2. 获取用户个人资料
- **URL**: `/api/users/profile`
- **方法**: `GET`
- **认证**: 需要JWT
- **请求参数**: 无
- **响应**: 
  ```json
  {
    "success": true,
    "message": "获取个人资料成功",
    "data": {
      "_id": "用户ID",
      "nickname": "用户昵称",
      "avatar": "头像URL",
      "gender": 0/1/2,
      "age": 25,
      "bio": "个人简介",
      "location": {
        "latitude": 39.9042,
        "longitude": 116.4074,
        "address": "北京市"
      },
      "interests": [],
      "tags": [],
      "matchPreferences": {
        "gender": 1,
        "ageRange": [20, 35],
        "distance": 5000
      },
      "privacySettings": {
        "showLocation": true,
        "showAge": true
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### 3. 更新用户个人资料
- **URL**: `/api/users/profile`
- **方法**: `PUT`
- **认证**: 需要JWT
- **请求参数**: 
  ```json
  {
    "nickname": "新昵称",
    "bio": "新简介",
    "age": 26,
    "location": {
      "latitude": 39.9042,
      "longitude": 116.4074,
      "address": "北京市"
    },
    "interests": ["音乐", "旅行"],
    "tags": ["开朗", "乐观"]
  }
  ```
- **响应**: 
  ```json
  {
    "success": true,
    "message": "更新个人资料成功",
    "data": {"更新后的用户资料"}
  }
  ```

### 4. 设置匹配偏好
- **URL**: `/api/users/match-preferences`
- **方法**: `PUT`
- **认证**: 需要JWT
- **请求参数**: 
  ```json
  {
    "matchPreferences": {
      "gender": 1, // 0:不限, 1:男, 2:女
      "ageRange": [20, 35],
      "distance": 5000
    }
  }
  ```
- **响应**: 
  ```json
  {
    "success": true,
    "message": "设置匹配偏好成功",
    "data": {"匹配偏好对象"}
  }
  ```

### 5. 设置隐私偏好
- **URL**: `/api/users/privacy-settings`
- **方法**: `PUT`
- **认证**: 需要JWT
- **请求参数**: 
  ```json
  {
    "privacySettings": {
      "showLocation": true,
      "showAge": true,
      "allowStrangers": true
    }
  }
  ```
- **响应**: 
  ```json
  {
    "success": true,
    "message": "设置隐私偏好成功",
    "data": {"隐私偏好对象"}
  }
  ```

### 6. 上传用户头像
- **URL**: `/api/users/avatar`
- **方法**: `POST`
- **认证**: 需要JWT
- **请求参数**: 
  - FormData: `avatar` (文件)
- **响应**: 
  ```json
  {
    "success": true,
    "message": "上传头像成功",
    "data": {
      "avatarUrl": "头像URL"
    }
  }
  ```

### 7. 获取推荐用户
- **URL**: `/api/users/recommend?count=10`
- **方法**: `GET`
- **认证**: 需要JWT
- **请求参数**: 
  - `count`: 推荐用户数量（可选，默认10）
- **响应**: 
  ```json
  {
    "success": true,
    "message": "获取推荐用户成功",
    "data": ["用户对象列表"]
  }
  ```

## 二、聊天管理API

### 1. 创建聊天会话
- **URL**: `/api/chats`
- **方法**: `POST`
- **认证**: 需要JWT
- **请求参数**: 
  ```json
  {
    "receiverId": "接收者用户ID"
  }
  ```
- **响应**: 
  ```json
  {
    "success": true,
    "message": "创建聊天会话成功",
    "data": {
      "_id": "聊天会话ID",
      "participants": ["用户对象列表"],
      "lastMessage": "",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### 2. 获取用户的所有聊天会话
- **URL**: `/api/chats`
- **方法**: `GET`
- **认证**: 需要JWT
- **请求参数**: 无
- **响应**: 
  ```json
  {
    "success": true,
    "message": "获取聊天会话成功",
    "data": ["聊天会话对象列表"]
  }
  ```

### 3. 发送消息
- **URL**: `/api/chats/message`
- **方法**: `POST`
- **认证**: 需要JWT
- **请求参数**: 
  ```json
  {
    "chatId": "聊天会话ID",
    "content": "消息内容",
    "type": "text" // 可选，默认text
  }
  ```
- **响应**: 
  ```json
  {
    "success": true,
    "message": "发送消息成功",
    "data": {
      "_id": "消息ID",
      "chatId": "聊天会话ID",
      "sender": {"发送者用户信息"},
      "content": "消息内容",
      "type": "text",
      "isRead": false,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### 4. 获取聊天消息历史
- **URL**: `/api/chats/:chatId/messages?limit=20&offset=0`
- **方法**: `GET`
- **认证**: 需要JWT
- **请求参数**: 
  - `limit`: 每页消息数量（可选，默认20）
  - `offset`: 偏移量（可选，默认0）
- **响应**: 
  ```json
  {
    "success": true,
    "message": "获取消息历史成功",
    "data": ["消息对象列表"]
  }
  ```

### 5. 获取未读消息数量
- **URL**: `/api/chats/unread/count`
- **方法**: `GET`
- **认证**: 需要JWT
- **请求参数**: 无
- **响应**: 
  ```json
  {
    "success": true,
    "message": "获取未读消息数量成功",
    "data": {
      "unreadCounts": {
        "chatId1": 5,
        "chatId2": 2
      },
      "totalUnread": 7
    }
  }
  ```

### 6. 获取AI聊天建议
- **URL**: `/api/chats/:chatId/ai-suggestions?messageCount=5`
- **方法**: `GET`
- **认证**: 需要JWT
- **请求参数**: 
  - `messageCount`: 用于生成建议的历史消息数量（可选，默认5）
- **响应**: 
  ```json
  {
    "success": true,
    "message": "获取AI聊天建议成功",
    "data": {
      "suggestions": ["建议回复1", "建议回复2"],
      "emotion": "happy",
      "summary": "对话摘要"
    }
  }
  ```

## 三、活动管理API

### 1. 创建活动
- **URL**: `/api/activities`
- **方法**: `POST`
- **认证**: 需要JWT
- **请求参数**: 
  ```json
  {
    "title": "活动标题",
    "description": "活动描述",
    "location": {
      "latitude": 39.9042,
      "longitude": 116.4074,
      "address": "北京市"
    },
    "time": "2023-01-15T14:00:00.000Z",
    "maxParticipants": 20,
    "tags": ["交友", "户外"]
  }
  ```
- **响应**: 
  ```json
  {
    "success": true,
    "message": "创建活动成功",
    "data": {
      "_id": "活动ID",
      "title": "活动标题",
      "description": "活动描述",
      "location": {"位置信息"},
      "time": "2023-01-15T14:00:00.000Z",
      "organizer": {"组织者用户信息"},
      "participants": ["参与者用户信息列表"],
      "maxParticipants": 20,
      "tags": ["交友", "户外"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### 2. 获取活动列表
- **URL**: `/api/activities?keyword=交友&tags=户外,运动&date=2023-01-15&distance=5000&latitude=39.9042&longitude=116.4074&page=1&pageSize=10`
- **方法**: `GET`
- **认证**: 无需
- **请求参数**: 
  - `keyword`: 关键词搜索（可选）
  - `tags`: 标签筛选，逗号分隔（可选）
  - `date`: 日期筛选（可选）
  - `distance`: 距离筛选（可选）
  - `latitude`: 纬度（与distance配合使用，可选）
  - `longitude`: 经度（与distance配合使用，可选）
  - `page`: 页码（可选，默认1）
  - `pageSize`: 每页条数（可选，默认10）
- **响应**: 
  ```json
  {
    "success": true,
    "message": "获取活动列表成功",
    "data": {
      "activities": ["活动对象列表"],
      "total": 100,
      "page": 1,
      "pageSize": 10,
      "totalPages": 10
    }
  }
  ```

### 3. 获取活动详情
- **URL**: `/api/activities/:activityId`
- **方法**: `GET`
- **认证**: 无需
- **请求参数**: 无
- **响应**: 
  ```json
  {
    "success": true,
    "message": "获取活动详情成功",
    "data": {"活动对象详情"}
  }
  ```

### 4. 加入活动
- **URL**: `/api/activities/:activityId/join`
- **方法**: `POST`
- **认证**: 需要JWT
- **请求参数**: 无
- **响应**: 
  ```json
  {
    "success": true,
    "message": "加入活动成功",
    "data": {"更新后的活动对象"}
  }
  ```

### 5. 退出活动
- **URL**: `/api/activities/:activityId/leave`
- **方法**: `POST`
- **认证**: 需要JWT
- **请求参数**: 无
- **响应**: 
  ```json
  {
    "success": true,
    "message": "退出活动成功",
    "data": {"更新后的活动对象"}
  }
  ```

### 6. 更新活动
- **URL**: `/api/activities/:activityId`
- **方法**: `PUT`
- **认证**: 需要JWT
- **请求参数**: 
  ```json
  {
    "title": "新活动标题",
    "description": "新活动描述",
    "time": "2023-01-16T14:00:00.000Z"
  }
  ```
- **响应**: 
  ```json
  {
    "success": true,
    "message": "更新活动成功",
    "data": {"更新后的活动对象"}
  }
  ```

### 7. 删除活动
- **URL**: `/api/activities/:activityId`
- **方法**: `DELETE`
- **认证**: 需要JWT
- **请求参数**: 无
- **响应**: 
  ```json
  {
    "success": true,
    "message": "删除活动成功",
    "data": null
  }
  ```

## 四、错误码说明

| 错误码 | 描述 | 解决方案 |
|-------|------|---------|
| 400 | 错误的请求参数 | 检查请求参数是否正确 |
| 401 | 未授权访问 | 请提供有效的JWT令牌 |
| 403 | 禁止访问 | 检查用户权限 |
| 404 | 资源不存在 | 确认资源ID是否正确 |
| 500 | 服务器内部错误 | 联系管理员或稍后重试 |

## 五、开发说明

1. 运行开发服务器：`npm run dev`
2. 运行生产服务器：`npm start`
3. 测试模型导入：`node check-models.js`

## 六、部署说明

1. 确保MongoDB和Redis服务正常运行
2. 配置环境变量（详见.env文件）
3. 启动应用：`npm start`