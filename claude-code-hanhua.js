import fs from "fs";

const path = process.argv[2];
// 备份原文件
const backupPath = path + ".bak";
// 3. 增强备份逻辑（不要覆盖已有的备份）
if (!fs.existsSync(backupPath)) {
  fs.cpSync(path, backupPath);
}

if (process.argv.includes("reset")) {
  if (fs.existsSync(backupPath)) {
    try {
      // 将备份文件覆盖回原文件
      fs.copyFileSync(backupPath, path);
      // 可选：还原后删除备份文件，保持环境整洁
      // fs.unlinkSync(backupPath);
      console.log("[INFO] ✅ 已从备份文件还原成功");
    } catch (err) {
      console.error("[ERROR] 还原失败:", err.message);
    }
  } else {
    console.warn("[WARN] ⚠️ 未发现备份文件 (.bak)，无法自动还原。");
  }
  console.log("[INFO] ✅ 以还原");
  process.exit(0);
}

// 读取上面的内容
let content = fs.readFileSync(path, "utf8");

content = content
  .replace(`to focus or unfocus Claude`, `聚焦或取消聚焦 Claude 窗口`)
  .replace(`"Ask before edits"`, `"修改前询问"`)
  .replace(`"Edit automatically"`, `"自动编辑"`)
  .replace(`"Plan mode"`, `"计划模式"`)
  .replace(
    `Tired of repeating yourself? Tell Claude to remember what you\\u2019ve told it using CLAUDE.md.`,
    `无需重复指令。通过 CLAUDE.md 记录已知信息，让 Claude 拥有持久记忆。`,
  )
  .replace(`"Ready to code?"`, `"准备好开始写代码了吗？"`)
  .replace(
    `"Let's write something worth deploying."`,
    `"别写烂代码了，写点能跑上线的吧。"`,
  )
  .replace(
    `"// TODO: Everything. Let\\u2019s start."`,
    `"// TODO: 万事待兴。开始吧。"`,
  )
  .replace(
    `"Type /model to pick the right tool for the job."`,
    `"输入 /model，为当前任务选择合适的工具。"`,
  )
  .replace(
    `"Use planning mode to talk through big changes before a commit. Press"`,
    `"在提交代码前，使用计划模式讨论重大变更。按下"`,
  )
  .replace(`"to cycle between modes."`, `"以切换模式。"`)
  .replace(`"Highlight any text and press"`, `"选中文本并按下"`)
  .replace(`"to chat about it"`, `"来讨论它。"`)
  .replace(
    `"Make a CLAUDE.md file for instructions Claude will read every single time."`,
    `"创建一个 CLAUDE.md 文件，用于存放 Claude 每次都会读取的指令。"`,
  )
  .replace(
    `"You\\u2019ve come to the absolutely right place!"`,
    `"你绝对找对地方了！"`,
  )
  .replace(`"Prefer the Terminal experience?"`, `"更倾向于终端体验？"`)
  .replace(`"Switch back in Settings."`, `"可在设置中切回。"`)
  .replace(`"Files & Folders"`, `"文件和文件夹"`)
  .replace(`"Remote server is not connected"`, `"远程服务器未连接"`)
  .replace(`"Filter actions\\u2026"`, `"过滤操作..."`)
  .replace(`"No matching commands"`, `"没有匹配的指令"`)
  .replace(`"Attach file\\u2026"`, `"添加文件..."`)
  .replace(`"Mention file from this project\\u2026"`, `"引用此项目中的文件..."`)
  .replace(`"MCP status"`, `"MCP 状态"`)
  .replace(`"Manage plugins"`, `"管理插件"`)
  .replace(`"General config\\u2026"`, `"通用配置..."`)
  .replace(
    `"Open Claude Code Extension configuration"`,
    `"打开 Claude Code 扩展配置"`,
  )
  .replace(`"View help docs"`, `"查看帮助文档"`)
  .replace(`"Open help documentation"`, `"打开帮助文档"`)
  .replace(`"Open Claude in Terminal"`, `"在终端中打开 Claude"`)
  .replace(
    `"Open a new Claude instance in the Terminal"`,
    `"在终端中开启新的 Claude 实例"`,
  )
  .replaceAll(`"Thinking"`, `"深度思考"`)
  .replace(`"Extended thinking is on"`, `"深度思考已开启"`)
  .replace(`"Extended thinking is off"`, `"深度思考已关闭"`)
  .replace(`"Drop to attach as context"`, `"拖拽至此作为上下文引用"`)
  .replace(`"Loading..."`, `"加载中..."`)
  .replace(`"Account & Usage"`, `"账户与用量"`)
  .replace(`"Account & usage\\u2026"`, `"账户与用量..."`)
  .replace(`"Switch model\\u2026"`, `"切换模型..."`)
  .replace(`"Ask Claude for help"`, `"向 Claude 寻求帮助"`)
  .replace(`"Queue another message\\u2026"`, `"排队发送下一条消息..."`)
  .replace(`to attach selected text`, `以附加选中文本`)
  .replace(`to focus or unfocus Claude`, `以聚焦或取消聚焦 Claude 窗口`)
  .replace(`"Ask Claude to edit\\u2026"`, `"请求 Claude 进行编辑..."`)
  .replace(`"Plugins"`, `"插件"`)
  .replace(`"Continue in Terminal to manage plugins?"`, `"前往终端管理插件？"`)
  .replace(
    `"After installing plugins, reload this extension to use them here."`,
    `"安装插件后，请重新加载扩展以在此使用。"`,
  )
  .replaceAll(`"Manage MCP servers"`, `"管理 MCP 服务器"`)
  .replace(`"Output styles"`, `"输出样式"`)
  .replace(
    `"Continue in Terminal to change output style?"`,
    `"前往终端更改输出样式？"`,
  )
  .replace(
    `"After changing your output style in Terminal and reloading this extension, you'll be able to use it here."`,
    `"在终端修改输出样式并重载扩展后，即可在此生效。"`,
  )
  .replace(`"Agents"`, `"智能体 (Agents)"`)
  .replace(
    `"Continue in Terminal to configure agents?"`,
    `"前往终端配置智能体？"`,
  )
  .replace(
    `"Once agents are configured in Terminal, you can reload this extension and ask Claude to use them here."`,
    `"在终端配置完成后，重载扩展即可在此调用智能体。"`,
  )
  .replace(`"Hooks"`, `"钩子 (Hooks)"`)
  .replace(
    `"Continue in Terminal to configure hooks?"`,
    `"前往终端配置 Hooks？"`,
  )
  .replace(
    `"Once hooks are configured in this repository, they'll be active in your IDE, too."`,
    `"在此仓库配置 Hooks 后，它们也会在 IDE 中生效。"`,
  )
  .replace(`"Memory"`, `"记忆 (Memory)"`)
  .replace(`"Continue in Terminal to edit memory?"`, `"前往终端编辑记忆内容？"`)
  .replace(
    `"Once configured, memories will be picked up by Claude Code here in your IDE."`,
    `"配置完成后，Claude Code 将在 IDE 中同步你的记忆内容。"`,
  )
  .replace(`"Permissions"`, `"权限管理"`)
  .replace(
    `"Continue in Terminal to manage permissions?"`,
    `"前往终端管理权限？"`,
  )
  .replace(
    `"Permission settings are shared between Terminal and this IDE."`,
    `"权限设置在终端与 IDE 之间共享。"`,
  )
  .replace(`"Loading MCP servers\\u2026"`, `"正在加载 MCP 服务器..."`)
  .replace(`"No running MCP servers."`, `"没有运行中的 MCP 服务器。"`)
  .replace(`"Clear conversation"`, `"清空对话"`)
  .replace(`"New conversation"`, `"新建对话"`)
  .replaceAll(`"Untitled"`, `"无标题"`)
  .replaceAll(`"Search sessions\\u2026"`, `"搜索会话..."`)
  .replace(`"Resume conversation"`, `"恢复对话"`)
  .replace(`"Switch account"`, `"切换账户"`)
  .replace(`"Flag model behavior (internal)"`, `"标记模型行为 (内部)"`)
  .replace(
    `"Report model issues to the research team"`,
    `"向研究团队报告模型问题"`,
  )
  .replace(`"Share with team (internal)"`, `"分享给团队 (内部)"`)
  .replace(`"Share conversation with team members"`, `"与团队成员分享对话"`)
  .replace(`"Reset onboarding [internal]"`, `"重置新手引导 [内部]"`)
  .replace(`"Report a problem"`, `"报告问题"`)
  .replace(`"Show command menu (/)"`, `"显示命令菜单 (/)"`)
  .replace(`"Adding\\u2026"`, `"正在添加..."`)
  .replace(`"Add"`, `"添加"`)
  .replace(
    `"No marketplaces configured. Add one above to discover plugins."`,
    `"尚未配置市场。请在上方添加一个市场以探索插件。"`,
  )
  .replaceAll(`"Press"`, `"按下"`)
  .replace(`"to automatically approve code edits"`, `"以自动批准代码修改"`)
  .replace(
    `"Use Claude Code in the terminal to configure MCP servers. They\\u2019ll work here, too!"`,
    `"在终端中使用 Claude Code 配置 MCP 服务器，设置也会在此处生效！"`,
  )
  .replaceAll(`"Past conversations"`, `"历史对话"`)
  .replace(`"New session"`, `"开启新会话"`)
  .replace(`Claude is requesting permission to use`, `Claude 正在请求使用权限`)
  .replace(`"User cancelled the edit"`, `"用户取消了编辑"`)
  .replace(`"User cancelled the write"`, `"用户取消了写入"`)
  .replace(
    `"Claude will edit your selected text or the whole file. Click, or press Shift+Tab, to switch modes."`,
    `"Claude 将编辑选中的文本或整个文件。点击或按 Shift+Tab 切换模式。"`,
  )
  .replace(
    `"Claude will explore the code and present a plan before editing. Click, or press Shift+Tab, to switch modes."`,
    `"Claude 将探索代码并在编辑前提供方案。点击或按 Shift+Tab 切换模式。"`,
  )
  .replace(
    `"Claude Code will not ask for your approval before running potentially dangerous commands."`,
    `"Claude Code 在执行潜在危险命令前将不再请求您的批准。"`,
  )
  .replace(
    `"Claude will ask before each edit. Click, or press Shift+Tab, to switch modes."`,
    `"Claude 将在每次编辑前进行询问。点击或按 Shift+Tab 切换模式。"`,
  )
  .replace(`"Bypass permissions"`, `"绕过权限验证"`)
  .replace(
    `Not showing Claude your current file selection`,
    `不向 Claude 显示当前选中的文件`,
  )
  .replace(
    `Showing Claude your current file selection`,
    `正在向 Claude 显示当前选中的文件`,
  )
  .replace(`. Click to attach.`, `。点击以附加。`)
  .replace(`"Concocting"`, `"正在构思"`)
  .replace(`"Forging"`, `"正在生成代码"`);

// 写入回去
fs.writeFileSync(path, content, "utf8");

console.log("✅ Claude Code 扩展汉化补丁执行成功！");
