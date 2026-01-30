# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 **Claude Code for VS Code 扩展的中文汉化工具**。通过命令行脚本直接修改 Claude Code 扩展的 JavaScript 文件，使用字符串替换将英文界面文本转换为中文。

该项目本质上是一个**汉化补丁工具**，而非独立的 VS Code 扩展。

## 常用命令

### 汉化 Claude Code 扩展

```bash
# 汉化指定的 Claude Code 扩展文件
node claude-code-hanhua.js <扩展文件路径>

# 还原之前的备份
node claude-code-hanhua.js <扩展文件路径> reset
```

### 开发相关命令

```bash
# 代码检查（ESLint）
pnpm run lint

# 运行测试（需要先通过 lint）
pnpm run test

# 开发模式构建（监听文件变化）
pnpm run dev

# 打包 VS Code 扩展
pnpm run build
```

## 高层架构

### 核心实现：[claude-code-hanhua.js](claude-code-hanhua.js)

这是项目的单一核心文件，实现了以下功能：

1. **文件备份机制**
   - 修改前自动创建 `.bak` 后缀的备份文件
   - 支持通过 `reset` 参数还原备份

2. **批量字符串替换**
   - 使用 JavaScript `String.replace()` 方法
   - 包含 100+ 条英中翻译替换规则
   - 一次性应用所有替换

3. **翻译覆盖范围**
   - 编辑模式界面：Ask/Auto/Agent modes
   - 文件操作：Files & Folders、Save、Explore 等
   - MCP 服务器：MCP status、server management 等
   - 插件管理：Extensions、Plugins 等
   - 会话管理：Past conversations、Chat history 等
   - 各类按钮、提示、错误信息等

### 新版扩展架构

项目已升级为完整的 VS Code 扩展，采用模块化架构：

**核心模块**：
- [lib/locator.js](lib/locator.js) - 扩展定位器，查找 Claude Code 的 `webview/index.js` 文件
- [lib/translator.js](lib/translator.js) - 翻译引擎，实现三阶段汉化（前置→内置→后置）
- [lib/backup.js](lib/backup.js) - 备份管理器，创建和还原 `.bak` 备份
- [lib/config.js](lib/config.js) - 配置管理器，读取用户自定义规则

**重要说明**：
- Claude Code 的界面文本位于 `webview/index.js` 而非 `extension.js`
- 扩展会自动查找 `webview/index.js` 文件并应用汉化
- 支持用户通过配置添加前置和后置翻译规则

### 使用场景

**典型工作流程：**

1. 获取本机已安装的 Claude Code 扩展路径
2. 运行汉化脚本指向该文件
3. 脚本自动创建备份并应用汉化
4. 重启 VS Code 使变更生效

**还原原始版本：**

1. 运行 `node claude-code-hanhua.js <path> reset`
2. 脚本从 `.bak` 备份还原原始内容

## 技术栈

- **Node.js** - 脚本运行环境
- **pnpm** - 包管理器
- **VS Code Extension API** - 类型定义（@types/vscode）
- **javascript-obfuscator** - 代码混淆工具（当前未使用）

## 项目文件说明

| 文件 | 说明 |
|------|------|
| [claude-code-hanhua.js](claude-code-hanhua.js) | 核心汉化脚本，包含所有翻译规则 |
| [extension.js](extension.js) | VS Code 扩展入口（当前为空） |
| [package.json](package.json) | 项目配置和依赖定义 |
| [translations.json](translations.json) | 翻译配置文件（当前未被使用） |
| [README.md](README.md) | 项目说明（内容已过时，需更新） |
| [CHANGELOG.md](CHANGELOG.md) | 版本更新日志 |

## 已知问题与限制

1. **文档与功能不符**
   - package.json 和 README.md 中仍保留旧的 JSE 项目（JavaScript 压缩混淆工具）的配置和说明
   - extension.js 为空文件，项目不作为标准 VS Code 扩展运行

2. **侵入式修改**
   - 直接修改已安装的 Claude Code 扩展文件
   - Claude Code 更新时会覆盖汉化，需重新运行脚本

3. **局限性**
   - 纯字符串替换方式，无法处理动态生成的文本
   - 无法本地化 UI 布局、图标等非文本元素

## 开发注意事项

- 修改汉化规则时，直接编辑 [claude-code-hanhua.js](claude-code-hanhua.js) 中的 `.replace()` 调用
- 添加新的翻译时，保持现有的链式调用模式
- 更新前运行 `pnpm run lint` 检查代码质量
- 打包扩展前确保测试通过：`pnpm run test`

## 未来改进方向

1. 更新 README.md 和 package.json，移除过时的 JSE 相关内容
2. 将翻译规则迁移到 [translations.json](translations.json)，实现动态加载
3. 考虑采用更规范的 i18n 框架
4. 实现 VS Code 扩展的完整激活逻辑（补充 extension.js）
