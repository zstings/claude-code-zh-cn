# Claude Code 汉化扩展

这是一个 VS Code 扩展，用于将 Claude Code for VS Code 扩展汉化为简体中文。

## 功能特性

- ✅ **自动汉化**：VS Code 启动时自动应用汉化
- ✅ **三阶段汉化**：支持前置规则 → 内置规则 → 后置规则
- ✅ **自定义规则**：通过配置添加自己的翻译规则
- ✅ **自动备份**：修改前自动创建备份文件
- ✅ **一键还原**：随时还原到原版
- ✅ **更新检测**：Claude Code 更新后自动重新汉化

## 安装

1. 克隆或下载此项目
2. 在项目目录运行 `pnpm install`
3. 按 F5 启动调试，或运行 `pnpm run build` 打包扩展

## 使用方法

### 命令面板

按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS) 打开命令面板，然后输入：

- **Claude Code 汉化: 应用汉化** - 手动应用汉化
- **Claude Code 汉化: 还原原版** - 还原到原版
- **Claude Code 汉化: 打开配置** - 打开配置页面
- **Claude Code 汉化: 重新加载汉化** - 重新应用汉化规则

### 状态栏

点击右下角的 `$(globe) Claude 汉化` 按钮可快速打开配置。

## 配置选项

在 VS Code 设置中搜索 `claudeCodeZhCn` 可以找到以下配置：

### 基础配置

- **autoApplyOnStartup** (默认: `true`)
  VS Code 启动时自动应用汉化

- **autoApplyOnUpdate** (默认: `true`)
  检测到 Claude Code 更新时自动重新应用汉化

- **createBackup** (默认: `true`)
  应用汉化前创建备份文件

- **showNotifications** (默认: `true`)
  显示操作完成的通知

- **claudeCodeExtensionId** (默认: `"Anthropic.claude-code"`)
  Claude Code 扩展的 ID（格式：Publisher.ExtensionName）

  **注意**：扩展 ID 必须与 Claude Code 的实际 ID 匹配。如果使用的是不同版本或分支，可能需要调整此配置。

### 自定义翻译规则

#### 前置规则 (preTranslationRules)

在内置规则之前执行的自定义翻译规则。

示例配置：

```json
{
  "claudeCodeZhCn.preTranslationRules": [
    {
      "original": "My Custom Text",
      "chinese": "我的自定义文本",
      "regex": false
    }
  ]
}
```

#### 后置规则 (postTranslationRules)

在内置规则之后执行的自定义翻译规则，可以覆盖内置翻译。

示例配置：

```json
{
  "claudeCodeZhCn.postTranslationRules": [
    {
      "original": "Ask before edits",
      "chinese": "编辑前询问",
      "regex": false
    }
  ]
}
```

#### 使用正则表达式

```json
{
  "claudeCodeZhCn.postTranslationRules": [
    {
      "original": "\\bfile\\b",
      "chinese": "文件",
      "regex": true,
      "flags": "gi"
    }
  ]
}
```

## 工作原理

1. **定位扩展**：优先使用 VS Code API (`vscode.extensions.getExtension`) 查找 Claude Code 扩展
   - 这种方法最可靠，即使用户修改了扩展安装位置也能正常工作
   - 只在 API 失败时才使用手动搜索作为备用方案
2. **查找 webview 文件**：找到 `webview/index.js` 文件（Claude Code 的界面文本所在位置）
3. **创建备份**：在修改前创建 `.bak` 备份文件
4. **应用汉化**：按照 前置规则 → 内置规则 → 后置规则 的顺序替换文本
5. **写入文件**：将汉化后的内容写回 webview 文件
6. **重新加载**：提示用户重新加载窗口以生效

## 项目结构

```
f:\Desktop\hanhua\
├── lib/
│   ├── backup.js          # 备份管理器
│   ├── config.js          # 配置管理器
│   ├── locator.js         # 扩展定位器
│   └── translator.js      # 翻译引擎
├── translations/
│   └── built-in.json      # 内置翻译规则（100+ 条）
├── extension.js           # 扩展主入口
├── package.json           # 扩展配置
└── README.md              # 本文档
```

## 注意事项

1. **文件权限**：在某些系统上可能需要管理员权限修改扩展文件
2. **扩展更新**：Claude Code 更新时会覆盖汉化，但本扩展会自动重新应用
3. **备份文件**：首次汉化会创建 `.bak` 备份，不会覆盖已有备份
4. **还原功能**：可随时通过命令还原到原版

## 开发

### 安装依赖

```bash
pnpm install
```

### 调试

按 F5 启动扩展开发主机进行调试。

### 打包

```bash
pnpm run build
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 相关链接

- [Claude Code 官方文档](https://docs.anthropic.com/claude/docs)
- [VS Code 扩展开发文档](https://code.visualstudio.com/api)
