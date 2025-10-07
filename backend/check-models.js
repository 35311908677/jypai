const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 检查models目录下的所有文件
const modelsDir = path.join(__dirname, 'models');

fs.readdirSync(modelsDir).forEach(file => {
    const fullPath = path.join(modelsDir, file);
    const stats = fs.statSync(fullPath);
    console.log(`文件名: ${file}, 绝对路径: ${fullPath}, 是文件: ${stats.isFile()}`);
});

// 尝试直接检查User.js文件
const userJsPath = path.join(modelsDir, 'user.js');
const UserJsPath = path.join(modelsDir, 'User.js');

console.log('\n检查具体文件:');
console.log(`user.js 是否存在: ${fs.existsSync(userJsPath)}`);
console.log(`User.js 是否存在: ${fs.existsSync(UserJsPath)}`);

// 检查是否是同一个文件
if (fs.existsSync(userJsPath) && fs.existsSync(UserJsPath)) {
    const stat1 = fs.statSync(userJsPath);
    const stat2 = fs.statSync(UserJsPath);
    console.log(`是否是同一个文件: ${stat1.ino === stat2.ino}`);
}

// 检查模块解析
console.log('\n尝试解析模块:');
console.log('注意：在Windows系统上，文件系统大小写不敏感，这可能导致模块重复编译问题');

// 尝试清理mongoose的模型缓存
if (typeof mongoose !== 'undefined') {
    console.log('清理Mongoose模型缓存...');
    mongoose.models = {};
    mongoose.modelSchemas = {};
}

// 尝试导入所有模型
const models = [
    { name: 'user', path: './models/user' },
    { name: 'message', path: './models/message' },
    { name: 'Chat', path: './models/Chat' },
    { name: 'Activity', path: './models/Activity' }
];

for (const model of models) {
    try {
        const importedModule = require(model.path);
        console.log(`✅ 成功导入 ${model.path}`);
        console.log(`  模块类型: ${typeof importedModule}`);
        if (importedModule.modelName) {
            console.log(`  模型名称: ${importedModule.modelName}`);
        }
        // 检查导出语句是否正确
        const modelContent = fs.readFileSync(path.join(__dirname, model.path) + '.js', 'utf8');
        const hasSafeExport = /module\.exports\s*=\s*mongoose\.models\.[A-Z][a-zA-Z]+\s*\|\|\s*mongoose\.model\(/
            .test(modelContent);
        console.log(`  导出语句安全检查: ${hasSafeExport ? '通过' : '警告: 未使用安全的导出模式'}`);
    } catch (err) {
        console.log(`❌ 导入 ${model.path} 失败: ${err.message}`);
    }
}

// 检查控制器中的导入路径大小写一致性
console.log('\n检查控制器中的模型导入路径:');
const controllers = ['userController.js', 'chatController.js', 'activityController.js'];
const importPatterns = {
    'user': /require\(['"]\.\.\/models\/(user|User)['"]\)/,
    'message': /require\(['"]\.\.\/models\/(message|Message)['"]\)/,
    'Chat': /require\(['"]\.\.\/models\/(Chat|chat)['"]\)/,
    'Activity': /require\(['"]\.\.\/models\/(Activity|activity)['"]\)/
};

for (const controller of controllers) {
    try {
        const controllerPath = path.join(__dirname, 'controllers', controller);
        const controllerContent = fs.readFileSync(controllerPath, 'utf8');
        
        console.log(`\n${controller}:`);
        for (const [modelName, pattern] of Object.entries(importPatterns)) {
            const matches = controllerContent.match(pattern);
            if (matches) {
                console.log(`  导入 ${modelName} 模型: 使用了 ${matches[1]} 路径`);
                if (matches[1] !== modelName && matches[1] !== modelName.toLowerCase()) {
                    console.log(`  ⚠️  警告: 建议统一使用 ${modelName} 或 ${modelName.toLowerCase()} 路径`);
                }
            }
        }
    } catch (err) {
        console.log(`❌ 读取 ${controller} 失败: ${err.message}`);
    }
}

console.log('\n解决模型重复编译问题的建议:');
console.log('1. 在整个项目中统一使用相同大小写的导入路径');
console.log('2. 确保所有模型文件的导出语句使用 mongoose.models.ModelName || mongoose.model(...) 模式');
console.log('3. 避免在不同地方使用不同大小写的路径导入同一个模型文件');
console.log('4. 在开发环境中，考虑使用区分大小写的文件系统（如Linux或macOS）进行测试');