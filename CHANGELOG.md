# 更新日志

本项目的所有重要变更都将记录在此文件中。

## [1.4.6] - 2026-09-22

### 新增

- **命令面板标题汉化**：扩展 `translatePackageJson()` 以处理 `contributes.commands`，新增 27 条命令标题翻译（`Claude Code: Open in New Tab`、`New Conversation`、`Accept Proposed Changes` 等）
- **散落字段汉化**：新增 `others` 规则段与深度遍历逻辑，覆盖 `Accept this change` / `Reject this change` 等菜单项

### 说明

此前 `translatePackageJson()` 仅处理 `contributes.configuration`（设置面板描述），命令面板条目始终显示英文。本次补齐该缺口，适配 Claude Code for VS Code v2.1.278。

## [1.4.5] - 2026-08-05

### 新增

- 更新中文翻译内容，持续优化翻译质量

## [1.4.4] - 2026-06-28

### 优化

- IPC 保护预计算：将 `isInIpcContext()` 拆分为 `extractIpcValues()` + `isInIpcValues()`，翻译入口处预计算一次 IPC 标识符集，避免 470+ 条规则每条都重新扫描整个文件
- 原子写入保护：新增 `atomicWriteSync()`，写临时文件后原子 rename，防止写入中途失败导致目标文件损坏

## [1.4.1] - 2026-06-25

### 修复

- 移除 6 条会破坏 IPC 协议的翻译规则（install_plugin、uninstall_plugin、set_plugin_enabled、add_marketplace、remove_marketplace、refresh_marketplace）

### 新增

- 翻译引擎新增 IPC 协议保护：自动检测并跳过出现在 sendRequest/postMessage 上下文中的翻译规则，防止协议字符串被误翻译
- 新增 IPC 协议保护单元测试（`node test/ipc-protection.test.js`）

## [1.4.0] - 2026-06-25

### 新增

- 新增设置面板翻译：package.json 中的设置描述和枚举值翻译
- 新增 `translations/settings.json` 存储设置面板翻译规则
- 翻译引擎增加 `translatePackageJson()` 方法，支持 JSON 结构化翻译
- 定位器增加 `findPackageJson()` 方法
- 还原功能支持同时还原 package.json 备份

### 翻译内容

- useTerminal: 在终端而非原生 UI 中启动 Claude
- allowDangerouslySkipPermissions: 允许绕过权限模式
- respectGitIgnore: 执行文件搜索时遵循 .gitignore 文件
- initialPermissionMode: 新对话的初始权限模式
- useCtrlEnterToSend: 使用 Ctrl/Cmd+Enter 发送提示
- preferredLocation: Claude 默认打开位置 + 枚举值翻译
- hideOnboarding: 隐藏新手引导清单
- usePythonEnvironment: 自动激活 Python 环境

## [1.3.0] - 2026-06-25

### 新增

- 新增 MCP 服务器管理翻译：认证、连接状态、错误提示等 20 条
- 新增工作树 (Worktree) 相关翻译：创建、打开、状态提示等 11 条
- 新增分支切换相关翻译：切换、冲突处理等 6 条
- 新增语音听写翻译：录音、停止、麦克风权限等 4 条
- 新增浏览器连接翻译：连接状态、断开等 5 条
- 新增 Notebook 连接翻译：检测、连接状态等 3 条
- 新增调查反馈翻译：评分、评价、调查提示等 12 条
- 新增用量详情翻译：限额、归属数据、使用百分比等 9 条
- 新增会话管理翻译：加载、删除、重命名等 5 条
- 新增设置面板翻译：技能、子代理、诊断、API 密钥等 19 条
- 新增 Claude's Plan 标签翻译

### 改进

- 修复弯引号 (U+2019) 导致的匹配问题

## [1.2.0] - 2026-06-25

### 新增

- 新增自动模式（Auto mode）完整翻译：模式名称、启用状态、功能描述
- 新增快速模式状态翻译：启用状态、冷却提示
- 新增计划模式大写变体（Plan Mode）翻译
- 新增编辑模式变体（Ask before editing）翻译
- 新增思考强度相关 UI 提示翻译（点击/拖动设置思考强度）
- 新增权限提示翻译：glob 搜索、grep 搜索、网络连接、文件读写等
- 新增"拒绝"和"拒绝内联编辑"按钮翻译
- 新增欢迎页面翻译
- 新增模式切换引导提示翻译（Shift+Tab 操作说明）

### 改进

- 统一"思考强度"翻译：将 Effort 相关的"工作量"改为"思考强度"
- 去重 built-in.json 中 7 组重复条目
- 更新 CLAUDE.md 以反映当前项目架构

### 清理

- 删除遗留脚本 claude-code-hanhua.js（已被 VS Code 扩展取代）
- 删除未使用的 translations.json 占位文件

## [1.1.6] - 2026-04-15

### 改进

- 更新中文翻译内容，持续优化翻译质量

### 修复

- 修正 package.json 中的项目名称格式

## [1.1.5] - 2026-03-25

### 改进

- 添加新的中文翻译内容，扩充翻译覆盖范围

## [1.1.4] - 2026-03-06

### 改进

- 更新包名和分类信息，优化扩展在 VS Code 市场的展示

### 文档

- 移除 README 中的开发相关说明
- 移除 README 中的安装说明

## [1.1.3] - 2026-02-04

### 修复

- 修正翻译文件中的转义字符和标点格式问题
- 统一中文翻译中的省略号格式，全部使用"…"（U+2026）
- 修正翻译文件中的不一致和错误

## [1.1.2] - 2026-02-02

### 修复

- 修复内置翻译文件中的转义引号错误，解决导致扩展崩溃的 JSON 解析问题
- 移除翻译条目冗余的 `replaceAll` 字段

## [1.1.1] - 2026-02-02

### 新增

- 在 `package.json` 中添加 Issues 反馈链接，方便用户提交问题和建议

### 改进

- 优化扩展分类和关键词：
  - 添加 `AI`、`Chat` 分类标签
  - 增加 `sonnet`、`ai`、`mcp`、`agent` 等关键词，提升扩展可发现性
- 新增翻译条目：
  - 添加 "Read" → "读取" 的翻译
  - 添加 "Details" → "详情" 的翻译
  - 添加 "Do you want to proceed with" 操作确认提示的翻译

### 文档

- 重写并完善 CHANGELOG.md，提供更详细的版本历史记录

## [1.1.0] - 2026-02-02

### 新增

- 增强"重新加载汉化"命令，支持强制重新应用汉化

### 改进

- 更新和完善大量翻译内容：
  - 添加"未找到会话记录"的翻译
  - 更新"Thinking"相关的翻译文本
  - 添加 MCP（Model Context Protocol）和登录相关的中文文本
  - 添加中断操作相关的中文翻译
  - 优化多处中文措辞，提升语言流畅度

### 修复

- 修正终端运行命令的正则表达式匹配问题
- 修正部分内置翻译文件中的中文表述

## [1.0.1] - 2026-01-30

### 新增

- 添加 Prettier 代码格式化配置
- 添加 VSCode 工作区设置

### 改进

- 更新扩展显示名称为"Claude Code for VS Code 汉化 (简体中文)"，更清晰地描述扩展功能
- 持续更新和完善翻译文件内容

### 修复

- 修正内置翻译文件中的部分中文措辞

## [1.0.0] - 2026-01-29

### 新增 🎉

- **首次发布！** Claude Code for VS Code 的完整汉化扩展
- 核心功能模块：
  - **扩展定位器** (`lib/locator.js`) - 自动查找 Claude Code 扩展的 `webview/index.js` 文件
  - **翻译引擎** (`lib/translator.js`) - 实现三阶段汉化（前置规则 → 内置规则 → 后置规则）
  - **备份管理器** (`lib/backup.js`) - 自动创建和还原备份文件
  - **配置管理器** (`lib/config.js`) - 支持用户自定义翻译规则

- **四个核心命令**：
  - `应用汉化` - 一键汉化 Claude Code 界面
  - `还原原版` - 还原到英文原版
  - `打开配置` - 快速访问扩展配置
  - `重新加载汉化` - 重新应用汉化规则

- **丰富的配置选项**：
  - 支持启动时自动应用汉化
  - 支持 Claude Code 更新后自动重新汉化
  - 支持用户自定义前置/后置翻译规则（支持正则表达式）
  - 支持备份文件管理
  - 支持通知开关

- **全面的翻译覆盖**：
  - 编辑模式界面（Ask/Auto/Agent modes）
  - 文件操作（Files & Folders、Save、Explore）
  - MCP 服务器管理
  - 插件和扩展管理
  - 会话历史记录
  - 各类按钮、提示和错误信息
  - 100+ 条内置翻译规则

- **状态栏集成**：
  - 在 VS Code 状态栏显示"Claude 汉化"按钮
  - 一键访问汉化配置

### 技术特性

- 降低 VS Code 引擎版本要求至 1.94.0，提升兼容性
- 使用 pnpm 作为包管理器
- 包含 ESLint 代码质量检查
- 支持打包为 `.vsix` 扩展文件

---

## 版本说明

### [未发布]

当前正在开发中的功能将在此列出。

---

## 贡献指南

如果你发现翻译不准确或有改进建议，欢迎：

1. 在 [GitHub Issues](https://github.com/zstings/claude-code-zh-cn/issues) 提交反馈
2. 通过扩展配置添加自定义翻译规则（前置/后置规则）
3. 提交 Pull Request 改进内置翻译

---

**注意**: 由于 Claude Code 扩展会不定期更新，更新后可能需要重新应用汉化。本扩展支持自动检测更新并重新汉化。
