// API测试脚本
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 基础URL
const BASE_URL = 'http://localhost:3000/api';

// 保存测试结果
let testResults = {
  success: [],
  failed: [],
  total: 0,
  passed: 0,
  failed: 0,
};

// 存储测试过程中获取的token和ID
let testData = {
  token: '',
  userId: '',
  chatId: '',
  activityId: '',
};

// 测试日志记录
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const color = type === 'success' ? '\x1b[32m' : type === 'error' ? '\x1b[31m' : '\x1b[36m';
  const reset = '\x1b[0m';
  console.log(`${timestamp} ${color}[${type.toUpperCase()}]${reset} ${message}`);
}

// 执行API测试
async function runTest(testName, testFunction) {
  testResults.total++;
  log(`开始测试: ${testName}`);
  
  try {
    await testFunction();
    log(`测试通过: ${testName}`, 'success');
    testResults.success.push(testName);
    testResults.passed++;
    return true;
  } catch (error) {
    log(`测试失败: ${testName}, 错误: ${error.message || error}`, 'error');
    testResults.failed.push({ name: testName, error: error.message || error });
    testResults.failed++;
    return false;
  }
}

// 微信登录测试
async function testLogin() {
  const response = await axios.post(`${BASE_URL}/users/login`, {
    code: 'test_code',
    userInfo: {
      nickName: '测试用户',
      avatarUrl: 'https://example.com/avatar.jpg',
      gender: 1,
    },
  });
  
  if (response.data.success && response.data.data.token) {
    testData.token = response.data.data.token;
    testData.userId = response.data.data.user.id;
    log(`登录成功，获取到token和用户ID: ${testData.userId}`);
  } else {
    throw new Error('登录失败，未获取到token');
  }
}

// 获取个人资料测试
async function testGetProfile() {
  const response = await axios.get(`${BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${testData.token}` },
  });
  
  if (!response.data.success || !response.data.data) {
    throw new Error('获取个人资料失败');
  }
}

// 更新个人资料测试
async function testUpdateProfile() {
  const response = await axios.put(
    `${BASE_URL}/users/profile`,
    {
      bio: '这是一个测试简介',
      interests: ['音乐', '旅行'],
    },
    {
      headers: { Authorization: `Bearer ${testData.token}` },
    }
  );
  
  if (!response.data.success) {
    throw new Error('更新个人资料失败');
  }
}

// 设置匹配偏好测试
async function testSetMatchPreferences() {
  const response = await axios.put(
    `${BASE_URL}/users/match-preferences`,
    {
      matchPreferences: {
        gender: 0,
        ageRange: [18, 35],
        distance: 10000,
      },
    },
    {
      headers: { Authorization: `Bearer ${testData.token}` },
    }
  );
  
  if (!response.data.success) {
    throw new Error('设置匹配偏好失败');
  }
}

// 获取推荐用户测试
async function testGetRecommendUsers() {
  const response = await axios.get(`${BASE_URL}/users/recommend?count=5`, {
    headers: { Authorization: `Bearer ${testData.token}` },
  });
  
  if (!response.data.success) {
    throw new Error('获取推荐用户失败');
  }
}

// 创建活动测试
async function testCreateActivity() {
  const response = await axios.post(
    `${BASE_URL}/activities`,
    {
      title: '测试活动',
      description: '这是一个测试活动描述',
      location: {
        latitude: 39.9042,
        longitude: 116.4074,
        address: '北京市',
      },
      time: new Date(Date.now() + 86400000).toISOString(), // 明天
      maxParticipants: 10,
      tags: ['测试', '交友'],
    },
    {
      headers: { Authorization: `Bearer ${testData.token}` },
    }
  );
  
  if (response.data.success && response.data.data._id) {
    testData.activityId = response.data.data._id;
    log(`创建活动成功，活动ID: ${testData.activityId}`);
  } else {
    throw new Error('创建活动失败');
  }
}

// 获取活动列表测试
async function testGetActivities() {
  const response = await axios.get(`${BASE_URL}/activities?page=1&pageSize=10`);
  
  if (!response.data.success) {
    throw new Error('获取活动列表失败');
  }
}

// 获取活动详情测试
async function testGetActivityDetail() {
  if (!testData.activityId) {
    throw new Error('没有可用的活动ID');
  }
  
  const response = await axios.get(`${BASE_URL}/activities/${testData.activityId}`);
  
  if (!response.data.success) {
    throw new Error('获取活动详情失败');
  }
}

// 运行所有测试
async function runAllTests() {
  log('开始API测试套件');
  
  // 按照依赖顺序执行测试
  await runTest('微信登录', testLogin);
  await runTest('获取个人资料', testGetProfile);
  await runTest('更新个人资料', testUpdateProfile);
  await runTest('设置匹配偏好', testSetMatchPreferences);
  await runTest('获取推荐用户', testGetRecommendUsers);
  await runTest('创建活动', testCreateActivity);
  await runTest('获取活动列表', testGetActivities);
  await runTest('获取活动详情', testGetActivityDetail);
  
  // 如果有创建聊天的必要测试
  if (testData.userId) {
    // 这里可以添加聊天相关测试，但需要另一个用户ID
    log('注意：聊天相关测试需要另一个用户ID，暂未执行');
  }
  
  // 输出测试结果摘要
  log('\n测试结果摘要:');
  log(`总测试数: ${testResults.total}`);
  log(`通过数: ${testResults.passed}`, 'success');
  log(`失败数: ${testResults.failed.length}`, testResults.failed.length > 0 ? 'error' : 'info');
  
  if (testResults.failed.length > 0) {
    log('\n失败的测试:');
    testResults.failed.forEach((test, index) => {
      log(`${index + 1}. ${test.name}: ${test.error}`, 'error');
    });
  }
  
  // 保存测试结果到文件
  const reportPath = path.join(__dirname, 'api-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  log(`\n测试报告已保存到: ${reportPath}`);
}

// 运行测试套件
runAllTests().catch((error) => {
  log(`测试套件执行失败: ${error.message}`, 'error');
});