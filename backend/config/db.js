// 数据库配置文件
const mongoose = require('mongoose');
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB连接配置
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5秒超时
    });
    console.log('MongoDB连接成功');
  } catch (error) {
    console.error('MongoDB连接失败:', error.message);
    console.log('注意: 应用程序将继续运行，但某些功能可能不可用。请确保MongoDB服务正在运行。');
    // 不退出进程，让应用程序继续运行
  }
};

// Redis客户端配置
let redisClient;

// 尝试创建Redis连接
if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
  try {
    redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    redisClient.on('connect', () => {
      console.log('Redis连接成功');
    });

    redisClient.on('error', (error) => {
      console.error('Redis连接失败:', error.message);
      console.log('注意: Redis功能将不可用，但应用程序将继续运行。');
    });
  } catch (error) {
    console.error('创建Redis客户端失败:', error.message);
    redisClient = null;
  }
} else {
  console.log('Redis配置未设置，Redis功能将不可用。');
  redisClient = null;
}

// 导出所有功能
module.exports = {
  connectMongoDB,
  connectDB: connectMongoDB, // 为了兼容app.js中的调用
  redisClient,
};