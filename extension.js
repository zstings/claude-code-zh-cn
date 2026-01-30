const vscode = require('vscode');
const fs = require('fs');
const Locator = require('./lib/locator');
const Translator = require('./lib/translator');
const BackupManager = require('./lib/backup');
const ConfigManager = require('./lib/config');

/**
 * 扩展激活时调用
 */
async function activate(context) {
    console.log('Claude Code 汉化扩展已激活');

    const config = new ConfigManager();
    const locator = new Locator(config);
    const backup = new BackupManager(config);
    const translator = new Translator(config);

    // 状态栏按钮
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.text = "$(globe) Claude 汉化";
    statusBarItem.tooltip = "Claude Code 汉化状态";
    statusBarItem.command = 'claudeCodeZhCn.openConfig';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // 注册命令：应用汉化
    let applyCommand = vscode.commands.registerCommand(
        'claudeCodeZhCn.applyTranslation',
        async () => {
            await applyTranslation(locator, translator, backup, config);
        }
    );
    context.subscriptions.push(applyCommand);

    // 注册命令：还原原版
    let restoreCommand = vscode.commands.registerCommand(
        'claudeCodeZhCn.restoreOriginal',
        async () => {
            await restoreOriginal(locator, backup, config);
        }
    );
    context.subscriptions.push(restoreCommand);

    // 注册命令：打开配置
    let configCommand = vscode.commands.registerCommand(
        'claudeCodeZhCn.openConfig',
        () => {
            vscode.commands.executeCommand(
                'workbench.action.openSettings',
                'claudeCodeZhCn'
            );
        }
    );
    context.subscriptions.push(configCommand);

    // 注册命令：重新加载汉化
    let reloadCommand = vscode.commands.registerCommand(
        'claudeCodeZhCn.reloadExtension',
        async () => {
            await applyTranslation(locator, translator, backup, config);
            vscode.window.showInformationMessage('汉化已重新加载');
        }
    );
    context.subscriptions.push(reloadCommand);

    // 监听 Claude Code 扩展的安装/更新
    vscode.extensions.onDidChange(async () => {
        if (config.get('autoApplyOnUpdate')) {
            const claudeExt = vscode.extensions.getExtension(
                config.get('claudeCodeExtensionId')
            );
            if (claudeExt) {
                setTimeout(async () => {
                    await applyTranslation(locator, translator, backup, config, true);
                }, 1000);
            }
        }
    });

    // 启动时自动应用汉化
    if (config.get('autoApplyOnStartup')) {
        // 延迟执行，确保所有扩展都已加载
        setTimeout(async () => {
            await applyTranslation(locator, translator, backup, config, true);
        }, 2000);
    }
}

/**
 * 应用汉化
 */
async function applyTranslation(locator, translator, backup, config, silent = false) {
    try {
        // 1. 定位 Claude Code 扩展
        const claudePath = await locator.findClaudeCodeExtension();
        if (!claudePath) {
            vscode.window.showErrorMessage(
                'Claude Code 扩展未安装或未找到'
            );
            return;
        }

        // 2. 找到 webview 文件
        const mainFilePath = locator.findMainFile(claudePath);
        if (!mainFilePath) {
            vscode.window.showErrorMessage(
                '未找到 Claude Code 扩展的 webview 文件'
            );
            return;
        }

        // 3. 创建备份
        if (config.get('createBackup')) {
            const backupCreated = await backup.createBackup(mainFilePath);
            if (!backupCreated) {
                const choice = await vscode.window.showWarningMessage(
                    '备份创建失败，是否继续？',
                    '继续', '取消'
                );
                if (choice !== '继续') return;
            }
        }

        // 4. 读取文件内容
        let content = fs.readFileSync(mainFilePath, 'utf8');

        // 5. 应用三阶段汉化
        content = await translator.translate(content);

        // 6. 写入文件
        fs.writeFileSync(mainFilePath, content, 'utf8');

        // 7. 通知用户
        if (config.get('showNotifications') && !silent) {
            const choice = await vscode.window.showInformationMessage(
                '汉化应用成功！需要重新打开新的聊天窗口或者重新加载窗口以生效。',
                '立即重新加载', '稍后'
            );
            if (choice === '立即重新加载') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        }
    } catch (error) {
        vscode.window.showErrorMessage(
            `汉化应用失败：${error.message}`
        );
        console.error(error);
    }
}

/**
 * 还原原版
 */
async function restoreOriginal(locator, backup, config) {
    try {
        // 1. 定位 Claude Code 扩展
        const claudePath = await locator.findClaudeCodeExtension();
        if (!claudePath) {
            vscode.window.showErrorMessage(
                'Claude Code 扩展未安装或未找到'
            );
            return;
        }

        // 2. 找到 webview 文件
        const mainFilePath = locator.findMainFile(claudePath);
        if (!mainFilePath) {
            vscode.window.showErrorMessage(
                '未找到 Claude Code 扩展的 webview 文件'
            );
            return;
        }

        // 3. 还原备份
        const restored = await backup.restoreBackup(mainFilePath);
        if (!restored) {
            vscode.window.showErrorMessage(
                '备份文件不存在，无法还原'
            );
            return;
        }

        // 4. 通知用户
        if (config.get('showNotifications')) {
            const choice = await vscode.window.showInformationMessage(
                '已还原到原版！需要重新打开新的聊天窗口或者重新加载窗口以生效。',
                '立即重新加载', '稍后'
            );
            if (choice === '立即重新加载') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        }
    } catch (error) {
        vscode.window.showErrorMessage(
            `还原失败：${error.message}`
        );
        console.error(error);
    }
}

/**
 * 扩展停用时调用
 */
function deactivate() {
    console.log('Claude Code 汉化扩展已停用');
}

module.exports = {
    activate,
    deactivate
};
