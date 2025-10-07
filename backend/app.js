// 主应用程序文件
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// 加载环境变量
dotenv.config();

// 连接数据库
const { connectDB } = require('./config/db');
connectDB();

// 创建Express应用
const app = express();

// 配置中间件
app.use(cors());
app.use(express.json());

// 在开发环境中启用请求日志
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 设置静态文件目录
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 设置路由
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const activityRoutes = require('./routes/activityRoutes');

// 根路由处理程序
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '交友π后端API服务运行正常',
    version: '1.0.0',
    availableEndpoints: [
      '/api/users - 用户相关接口',
      '/api/chats - 聊天相关接口',
      '/api/activities - 活动相关接口'
    ]
  });
});

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/activities', activityRoutes);

// 404错误处理
const { notFound, errorHandler } = require('./middleware/errorHandler');
app.use(notFound);
app.use(errorHandler);

// 设置服务器端口
const PORT = process.env.PORT || 5000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT} 上，环境: ${process.env.NODE_ENV}`);
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  // 在生产环境中，可能需要考虑优雅退出
  if (process.env.NODE_ENV !== 'development') {
    process.exit(1);
  }
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (err) => {
  console.error('未处理的Promise拒绝:', err);
  // 在生产环境中，可能需要考虑优雅退出
  if (process.env.NODE_ENV !== 'development') {
    process.exit(1);
  }
});