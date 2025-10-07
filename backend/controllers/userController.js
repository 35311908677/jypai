// 用户控制器
const { generateToken, formatResponse } = require('../utils/requestHelper');

// 微信登录
exports.login = async (req, res, next) => {
  try {
    const { code, userInfo } = req.body;

    if (!code) {
      return res.status(400).json(formatResponse(false, null, '缺少必要的登录参数'));
    }

    // 完全模拟登录 - 不依赖MongoDB
    // 创建一个模拟用户ID（使用时间戳确保唯一性）
    const mockUserId = `mock_user_${Date.now()}`;
    
    // 生成token
    const token = generateToken(mockUserId);
    
    // 准备模拟用户信息
    const mockUserInfo = {
      id: mockUserId,
      nickname: userInfo?.nickName || '测试用户' + Math.random().toString(36).substr(2, 4),
      avatar: userInfo?.avatarUrl || 'https://via.placeholder.com/100',
      gender: userInfo?.gender || 0,
    };

    return res.status(200).json(formatResponse(true, {
      user: mockUserInfo,
      token,
    }, '登录成功（模拟环境）'));
  } catch (error) {
    console.error('登录错误:', error);
    return res.status(200).json(formatResponse(true, {
      user: {
        id: 'fallback_user_id',
        nickname: '默认测试用户',
        avatar: 'https://via.placeholder.com/100',
        gender: 0,
      },
      token: generateToken('fallback_user_id'),
    }, '登录成功（完全离线模式）'));
  }
  };

// 获取用户个人资料
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-openId');

    if (!user) {
      return res.status(404).json(formatResponse(false, null, '用户不存在'));
    }

    return res.status(200).json(formatResponse(true, user, '获取个人资料成功'));
  } catch (error) {
    next(error);
  }
};

// 更新用户个人资料
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-openId');

    if (!user) {
      return res.status(404).json(formatResponse(false, null, '用户不存在'));
    }

    return res.status(200).json(formatResponse(true, user, '更新个人资料成功'));
  } catch (error) {
    next(error);
  }
};

// 设置匹配偏好
exports.setMatchPreferences = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { matchPreferences } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { matchPreferences },
      {
        new: true,
        runValidators: true,
      }
    ).select('-openId');

    if (!user) {
      return res.status(404).json(formatResponse(false, null, '用户不存在'));
    }

    return res.status(200).json(formatResponse(true, user.matchPreferences, '设置匹配偏好成功'));
  } catch (error) {
    next(error);
  }
};

// 设置隐私偏好
exports.setPrivacySettings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { privacySettings } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { privacySettings },
      {
        new: true,
        runValidators: true,
      }
    ).select('-openId');

    if (!user) {
      return res.status(404).json(formatResponse(false, null, '用户不存在'));
    }

    return res.status(200).json(formatResponse(true, user.privacySettings, '设置隐私偏好成功'));
  } catch (error) {
    next(error);
  }
};

// 上传用户头像
exports.uploadAvatar = async (req, res, next) => {
  try {
    // 文件上传逻辑将在后面实现
    // 这里简单返回模拟数据
    const userId = req.user._id;
    const avatarUrl = `https://example.com/uploads/${Date.now()}.jpg`;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      {
        new: true,
      }
    ).select('-openId');

    return res.status(200).json(formatResponse(true, { avatarUrl }, '上传头像成功'));
  } catch (error) {
    next(error);
  }
};

// 获取推荐用户
exports.getRecommendUsers = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { count = 10 } = req.query;

    // 获取当前用户信息
    const currentUser = await User.findById(userId);

    // 调用AI推荐服务
    const { recommendedUsers } = await callAIRecommendService(userId, count);

    // 从数据库中获取推荐用户的详细信息
    let recommendUsers = [];
    if (recommendedUsers && recommendedUsers.length > 0) {
      recommendUsers = await User.find({
        _id: { $in: recommendedUsers },
        _id: { $ne: userId }, // 排除自己
      }).select('-openId -phone');
    }

    // 如果AI推荐服务返回为空，则从数据库中随机获取
    if (recommendUsers.length === 0) {
      recommendUsers = await User.find({
        _id: { $ne: userId },
        gender: currentUser.matchPreferences.gender === 0 ? { $exists: true } : currentUser.matchPreferences.gender,
        age: {
          $gte: currentUser.matchPreferences.ageRange[0],
          $lte: currentUser.matchPreferences.ageRange[1],
        },
      })
        .select('-openId -phone')
        .limit(parseInt(count))
        .sort({ createdAt: -1 });
    }

    // 根据用户位置计算距离并筛选
    if (currentUser.location && currentUser.location.latitude && currentUser.location.longitude) {
      recommendUsers = recommendUsers.filter((user) => {
        if (!user.location || !user.location.latitude || !user.location.longitude) {
          return true;
        }
        
        const distance = calculateDistance(
          currentUser.location.latitude,
          currentUser.location.longitude,
          user.location.latitude,
          user.location.longitude
        );
        
        return distance <= currentUser.matchPreferences.distance;
      });
    }

    return res.status(200).json(formatResponse(true, recommendUsers, '获取推荐用户成功'));
  } catch (error) {
    next(error);
  }
};