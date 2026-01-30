const vscode = require('vscode');

/**
 * 配置管理器：负责读取和管理扩展配置
 */
class ConfigManager {
    constructor() {
        this.configPrefix = 'claudeCodeZhCn';
    }

    /**
     * 获取配置项
     */
    get(key) {
        const config = vscode.workspace.getConfiguration(this.configPrefix);
        return config.get(key);
    }

    /**
     * 设置配置项
     */
    async set(key, value, global = true) {
        const config = vscode.workspace.getConfiguration(this.configPrefix);
        await config.update(
            key,
            value,
            global ? vscode.ConfigurationTarget.Global : vscode.ConfigurationTarget.Workspace
        );
    }

    /**
     * 获取所有配置
     */
    getAll() {
        const config = vscode.workspace.getConfiguration(this.configPrefix);
        return {
            autoApplyOnStartup: config.get('autoApplyOnStartup'),
            autoApplyOnUpdate: config.get('autoApplyOnUpdate'),
            preTranslationRules: config.get('preTranslationRules'),
            postTranslationRules: config.get('postTranslationRules'),
            createBackup: config.get('createBackup'),
            showNotifications: config.get('showNotifications'),
            claudeCodeExtensionId: config.get('claudeCodeExtensionId')
        };
    }

    /**
     * 监听配置变化
     */
    onDidChange(callback) {
        return vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(this.configPrefix)) {
                callback(this.getAll());
            }
        });
    }
}

module.exports = ConfigManager;
