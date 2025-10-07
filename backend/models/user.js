// 用户模型
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  openId: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
  },
  nickname: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  gender: {
    type: Number,
    required: true,
    enum: [0, 1, 2], // 0-未知, 1-男, 2-女
  },
  age: {
    type: Number,
    required: false,
    min: 18,
    max: 100,
  },
  location: {
    longitude: {
      type: Number,
      required: false,
    },
    latitude: {
      type: Number,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
  },
  interests: [
    {
      type: String,
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  bio: {
    type: String,
    required: false,
    maxlength: 200,
  },
  matchPreferences: {
    ageRange: [
      {
        type: Number,
        default: [18, 50],
      },
    ],
    gender: {
      type: Number,
      default: 0, // 0-不限, 1-男, 2-女
    },
    distance: {
      type: Number,
      default: 50, // 默认50公里内
    },
  },
  privacySettings: {
    showAge: {
      type: Boolean,
      default: true,
    },
    showLocation: {
      type: Boolean,
      default: true,
    },
    showInterests: {
      type: Boolean,
      default: true,
    },
    showTags: {
      type: Boolean,
      default: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 保存前更新更新时间
UserSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// 避免重复编译模型
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);