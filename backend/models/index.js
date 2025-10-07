// 统一模型导入模块
// 这个模块的目的是解决在Windows系统上由于文件系统大小写不敏感导致的模型重复编译问题
// 所有控制器和其他需要使用模型的地方都应该从这个模块导入模型

const mongoose = require('mongoose');

// 清理可能存在的模型缓存
mongoose.models = {};
mongoose.modelSchemas = {};

// 导入所有模型
const User = require('./user');
const Message = require('./message');
const Chat = require('./Chat');
const Activity = require('./Activity');

// 导出所有模型
exports.User = User;
exports.Message = Message;
exports.Chat = Chat;
exports.Activity = Activity;

// 导出模型映射，方便动态访问
exports.models = {
  User,
  Message,
  Chat,
  Activity
};

// 提供一个函数来获取模型，防止直接使用mongoose.model()导致的重复编译
exports.getModel = (modelName) => {
  if (!exports.models[modelName]) {
    throw new Error(`模型 ${modelName} 不存在`);
  }
  return exports.models[modelName];
};

console.log('✅ 所有模型已从统一入口导入');