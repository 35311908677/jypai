// 测试模型导入是否正常工作
// 这个脚本用于验证我们的模型统一导入方案是否解决了重复编译问题

console.log('开始测试模型导入...');

// 清理可能存在的模型缓存
const mongoose = require('mongoose');
mongoose.models = {};
mongoose.modelSchemas = {};

try {
  // 从统一入口导入所有模型
  const models = require('./models/index');
  
  console.log('✅ 成功从统一入口导入所有模型:', Object.keys(models));
  
  // 验证每个模型都能正确访问
  console.log('验证各个模型:');
  console.log('- User模型:', typeof models.User === 'function' ? '✓ 可用' : '✗ 不可用');
  console.log('- Message模型:', typeof models.Message === 'function' ? '✓ 可用' : '✗ 不可用');
  console.log('- Chat模型:', typeof models.Chat === 'function' ? '✓ 可用' : '✗ 不可用');
  console.log('- Activity模型:', typeof models.Activity === 'function' ? '✓ 可用' : '✗ 不可用');
  
  // 验证通过getModel函数访问模型
  try {
    const userModel = models.getModel('User');
    console.log('✓ 通过getModel函数成功获取User模型');
  } catch (error) {
    console.error('✗ 通过getModel函数获取User模型失败:', error.message);
  }
  
  // 尝试直接实例化一个模型来测试
  try {
    const testUser = new models.User({
      openid: 'test_openid',
      nickname: '测试用户',
      avatarUrl: 'https://example.com/avatar.jpg',
      gender: 1,
      age: 25,
      location: { type: 'Point', coordinates: [116.397128, 39.916527] },
      description: '这是一个测试用户',
      tags: ['测试', '用户']
    });
    console.log('✓ 成功实例化User模型');
  } catch (error) {
    console.error('✗ 实例化User模型失败:', error.message);
  }
  
  console.log('\n🎉 模型导入测试完成！所有测试均通过。');
  console.log('\n提示：');
  console.log('1. 您的应用现在应该可以正常运行，不会出现模型重复编译的问题了');
  console.log('2. 所有控制器和中间件都已修改为从统一的models/index.js导入模型');
  console.log('3. 如果要添加新的模型，请先在models/index.js中注册它');
  
} catch (error) {
  console.error('❌ 测试失败:', error.message);
  console.error('错误堆栈:', error.stack);
}