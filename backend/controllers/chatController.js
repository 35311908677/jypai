// 聊天控制器
const { Chat, Message, User } = require('../models/index');
const { formatResponse, callAIChatService } = require('../utils/requestHelper');

// 创建聊天会话
exports.createChat = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { receiverId } = req.body;

    // 检查接收者是否存在
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json(formatResponse(false, null, '接收者不存在'));
    }

    // 检查是否已经存在聊天会话
    let chat = await Chat.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (!chat) {
      // 创建新的聊天会话
      chat = new Chat({
        participants: [userId, receiverId],
        lastMessage: '',
      });
      await chat.save();
    }

    // 获取会话详情（包含参与者信息）
    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'nickname avatar');

    return res.status(200).json(formatResponse(true, populatedChat, '创建聊天会话成功'));
  } catch (error) {
    next(error);
  }
};

// 获取用户的所有聊天会话
exports.getChats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 查找用户参与的所有聊天会话
    const chats = await Chat.find({
      participants: userId,
    })
      .populate('participants', 'nickname avatar')
      .sort({ updatedAt: -1 });

    return res.status(200).json(formatResponse(true, chats, '获取聊天会话成功'));
  } catch (error) {
    next(error);
  }
};

// 发送消息
exports.sendMessage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { chatId, content, type = 'text' } = req.body;

    // 检查聊天会话是否存在且用户是否参与
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(404).json(formatResponse(false, null, '聊天会话不存在或您没有权限'));
    }

    // 创建新消息
    const message = new Message({
      chatId,
      senderId: userId,
      content,
      type,
      isRead: false,
    });

    await message.save();

    // 更新聊天会话的最后消息
    chat.lastMessage = content;
    chat.updatedAt = Date.now();
    await chat.save();

    // 填充消息的发送者信息
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'nickname avatar');

    // TODO: 这里应该有消息推送逻辑，使用WebSocket或其他推送机制

    return res.status(200).json(formatResponse(true, populatedMessage, '发送消息成功'));
  } catch (error) {
    next(error);
  }
};

// 获取聊天消息历史
exports.getMessages = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { chatId, limit = 20, offset = 0 } = req.query;

    // 检查聊天会话是否存在且用户是否参与
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(404).json(formatResponse(false, null, '聊天会话不存在或您没有权限'));
    }

    // 获取消息历史
    const messages = await Message.find({
      chatId,
    })
      .populate('sender', 'nickname avatar')
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    // 标记消息为已读
    await Message.updateMany(
      {
        chatId,
        senderId: { $ne: userId },
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return res.status(200).json(formatResponse(true, messages.reverse(), '获取消息历史成功'));
  } catch (error) {
    next(error);
  }
};

// 获取未读消息数量
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 获取用户参与的所有聊天会话
    const chats = await Chat.find({
      participants: userId,
    });

    // 计算每个会话的未读消息数量
    const unreadCounts = {};
    let totalUnread = 0;

    for (const chat of chats) {
      const count = await Message.countDocuments({
        chatId: chat._id,
        senderId: { $ne: userId },
        isRead: false,
      });
      
      unreadCounts[chat._id] = count;
      totalUnread += count;
    }

    return res.status(200).json(formatResponse(true, { unreadCounts, totalUnread }, '获取未读消息数量成功'));
  } catch (error) {
    next(error);
  }
};

// 获取AI聊天建议
exports.getAIChatSuggestions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { chatId, messageCount = 5 } = req.query;

    // 获取最近的消息作为上下文
    const recentMessages = await Message.find({
      chatId,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(messageCount));

    // 调用AI聊天助手服务
    const { suggestions, emotion, summary } = await callAIChatService(
      userId,
      recentMessages,
      'chat_suggestion'
    );

    return res.status(200).json(formatResponse(true, { suggestions, emotion, summary }, '获取AI聊天建议成功'));
  } catch (error) {
    next(error);
  }
};