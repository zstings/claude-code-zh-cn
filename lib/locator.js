const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

/**
 * 扩展定位器：负责查找 Claude Code 扩展的位置
 */
class Locator {
    constructor(config) {
        this.config = config;
    }

    /**
     * 查找 Claude Code 扩展的安装路径
     */
    async findClaudeCodeExtension() {
        const extensionId = this.config.get('claudeCodeExtensionId');
        console.log('正在查找 Claude Code 扩展，ID:', extensionId);

        // 优先使用 VS Code API（最可靠的方法）
        const extension = vscode.extensions.getExtension(extensionId);
        if (extension) {
            console.log('✓ 通过 VS Code API 找到扩展:', extension.extensionPath);
            return extension.extensionPath;
        }

        // console.warn('⚠ VS Code API 未找到扩展，尝试备用方法...');
        // console.warn('提示：请检查扩展 ID 是否正确（应为 "Anthropic.claude-code"）');

        // // 备用方法：手动搜索扩展目录
        // // 注意：这种方法不推荐，因为用户可能修改了扩展位置
        // const extensionDirs = this.getExtensionDirectories();

        // for (const dir of extensionDirs) {
        //     if (!fs.existsSync(dir)) {
        //         continue;
        //     }

        //     try {
        //         const files = fs.readdirSync(dir);
        //         for (const file of files) {
        //             // 匹配 anthropic.claude-code-* 或 Anthropic.claude-code-* 格式
        //             if (file.toLowerCase().startsWith('anthropic.claude-code')) {
        //                 const fullPath = path.join(dir, file);
        //                 if (fs.statSync(fullPath).isDirectory()) {
        //                     console.log('✓ 手动搜索找到扩展:', fullPath);
        //                     return fullPath;
        //                 }
        //             }
        //         }
        //     } catch (error) {
        //         console.error('搜索目录出错:', dir, error);
        //     }
        // }

        console.error('✗ 未找到 Claude Code 扩展');
        console.error('请确保：');
        console.error('1. Claude Code 扩展已安装');
        console.error('2. 扩展 ID 配置正确（Anthropic.claude-code）');
        return null;
    }

    /**
     * 获取 VS Code 扩展的可能目录
     */
    getExtensionDirectories() {
        const userProfile = process.env.USERPROFILE || process.env.HOME;

        // Windows 11 的扩展目录
        const directories = [
            path.join(userProfile, '.vscode', 'extensions'),
            path.join(userProfile, '.vscode-insiders', 'extensions'),
        ];

        // macOS
        if (process.platform === 'darwin') {
            directories.push(
                path.join(userProfile, 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'ms-vscode.remote-repositories'),
            );
        }

        // Linux
        if (process.platform === 'linux') {
            directories.push(path.join(userProfile, '.vscode', 'extensions'));
        }

        return directories;
    }

    /**
     * 查找扩展的 webview 文件
     * Claude Code 扩展的界面文本在 webview/index.js 中
     */
    findMainFile(extensionPath) {
        // 优先查找 webview/index.js（Claude Code 的界面文件）
        const possiblePaths = [
            path.join(extensionPath, 'webview', 'index.js'),
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                console.log('找到目标文件:', p);
                return p;
            }
        }

        console.log('未找到目标文件');
        return null;
    }

    /**
     * 获取当前汉化扩展自身的路径
     */
    getSelfExtensionPath() {
        const selfExtension = vscode.extensions.getExtension('zstings.claude-code-zh-cn');
        return selfExtension ? selfExtension.extensionPath : __dirname;
    }
}

module.exports = Locator;
