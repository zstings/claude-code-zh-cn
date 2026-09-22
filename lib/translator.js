const path = require('path');
const fs = require('fs');
const vscode = require('vscode');

/**
 * 翻译引擎：负责应用汉化规则
 */
class Translator {
    constructor(config) {
        this.config = config;
        this.builtInRules = null;
    }

    /**
     * 加载内置翻译规则
     */
    loadBuiltInRules() {
        if (this.builtInRules) return this.builtInRules;

        try {
            const extension = vscode.extensions.getExtension('zstings.claude-code-zh-cn');
            let translationsPath;

            if (extension) {
                translationsPath = path.join(
                    extension.extensionPath,
                    'translations',
                    'built-in.json'
                );
            } else {
                // 如果无法通过 API 获取，使用相对路径
                translationsPath = path.join(
                    __dirname,
                    '..',
                    'translations',
                    'built-in.json'
                );
            }

            if (fs.existsSync(translationsPath)) {
                const content = fs.readFileSync(translationsPath, 'utf8');
                this.builtInRules = JSON.parse(content);
                console.log('成功加载内置翻译规则,共', this.builtInRules.translations.length, '条');
            } else {
                console.warn('未找到内置翻译规则文件:', translationsPath);
                this.builtInRules = { translations: [] };
            }
        } catch (error) {
            console.error('加载内置翻译规则出错:', error);
            this.builtInRules = { translations: [] };
        }

        return this.builtInRules;
    }

    /**
     * 应用三阶段汉化
     */
    async translate(content) {
        console.log('开始应用汉化...');
        const originalLength = content.length;

        // 预计算一次 IPC 标识符集，避免每条规则重复扫描整个文件
        const ipcValues = this.extractIpcValues(content);
        if (ipcValues.size > 0) {
            console.log('检测到 IPC 标识符', ipcValues.size, '个');
        }

        // 阶段 1: 前置规则（用户自定义）
        const preRules = this.config.get('preTranslationRules') || [];
        if (preRules.length > 0) {
            console.log('应用前置规则,共', preRules.length, '条');
            content = this.applyRules(content, preRules, ipcValues);
        }

        // 阶段 2: 内置规则
        const builtInRules = this.loadBuiltInRules();
        if (builtInRules.translations && builtInRules.translations.length > 0) {
            console.log('应用内置规则,共', builtInRules.translations.length, '条');
            content = this.applyRules(content, builtInRules.translations, ipcValues);
        }

        // 阶段 3: 后置规则（用户自定义）
        const postRules = this.config.get('postTranslationRules') || [];
        if (postRules.length > 0) {
            console.log('应用后置规则,共', postRules.length, '条');
            content = this.applyRules(content, postRules, ipcValues);
        }

        console.log('汉化完成,文件大小变化:', originalLength, '->', content.length);
        return content;
    }

    /**
     * 翻译 package.json 中的设置面板文本
     */
    async translatePackageJson(content) {
        const settingsRules = this.loadSettingsRules();
        if (!settingsRules) return content;

        try {
            const pkg = JSON.parse(content);
            const configs = pkg.contributes?.configuration;
            if (!configs) return content;

            const configList = Array.isArray(configs) ? configs : [configs];

            for (const config of configList) {
                if (!config.properties) continue;

                for (const [key, prop] of Object.entries(config.properties)) {
                    // 翻译 description（纯文本，不含加粗）
                    if (settingsRules.descriptions?.[key]) {
                        if (prop.description) {
                            prop.description = settingsRules.descriptions[key];
                        }
                    }
                    // 翻译 markdownDescription（加粗标题）
                    if (settingsRules.markdownDescriptions?.[key]) {
                        if (prop.markdownDescription) {
                            prop.markdownDescription = settingsRules.markdownDescriptions[key];
                        } else {
                            // 原始只有 description 时，新增 markdownDescription 用于加粗显示
                            prop.markdownDescription = settingsRules.markdownDescriptions[key];
                        }
                    }
                    // 翻译枚举项描述（不使用 enumItemLabels，有 VS Code 渲染 bug）
                    if (settingsRules.enumDescriptions?.[key]) {
                        prop.enumDescriptions = settingsRules.enumDescriptions[key];
                    }
                }
            }

            // 翻译命令面板标题（contributes.commands）
            // 这些是用户按 Ctrl+Shift+P 时看到的条目，与设置项不同源。
            const commands = pkg.contributes?.commands;
            if (Array.isArray(commands) && settingsRules.commands) {
                for (const cmd of commands) {
                    if (!cmd || typeof cmd.title !== 'string') continue;
                    const translated = settingsRules.commands[cmd.title];
                    if (translated) cmd.title = translated;
                }
            }

            // 翻译其他散落的标题字段（菜单项等）
            if (settingsRules.others) {
                const translateDeep = (node) => {
                    if (Array.isArray(node)) {
                        node.forEach(translateDeep);
                    } else if (node && typeof node === 'object') {
                        for (const [k, v] of Object.entries(node)) {
                            if (typeof v === 'string' && settingsRules.others[v]) {
                                node[k] = settingsRules.others[v];
                            } else {
                                translateDeep(v);
                            }
                        }
                    }
                };
                translateDeep(pkg.contributes);
            }

            return JSON.stringify(pkg, null, 2) + '\n';
        } catch (error) {
            console.error('翻译 package.json 出错:', error);
            return content;
        }
    }

    /**
     * 加载设置面板翻译规则
     */
    loadSettingsRules() {
        try {
            const extension = vscode.extensions.getExtension('zstings.claude-code-zh-cn');
            let settingsPath;

            if (extension) {
                settingsPath = path.join(extension.extensionPath, 'translations', 'settings.json');
            } else {
                settingsPath = path.join(__dirname, '..', 'translations', 'settings.json');
            }

            if (fs.existsSync(settingsPath)) {
                const content = fs.readFileSync(settingsPath, 'utf8');
                return JSON.parse(content);
            }
        } catch (error) {
            console.error('加载设置翻译规则出错:', error);
        }
        return null;
    }

    /**
     * 提取文件中所有 IPC 协议标识符（type/command 的值）
     * 在翻译开始时调用一次，避免每条规则重复扫描整个文件
     *
     * 策略：提取所有 sendRequest/postMessage 中 type/command 的值
     * - 使用 [\s\S]*? 穿过嵌套花括号（旧版 [^}]*? 会在嵌套 } 处停止）
     * - 使用 (['"])...\1 支持单引号和双引号
     * - 贪婪回溯到最后一个 type/command，确保目标值紧跟其后
     */
    extractIpcValues(content) {
        const ipcValues = new Set();
        const pattern = /(?:sendRequest|postMessage)\s*\([\s\S]*?(?:type|command)\s*:\s*(['"])((?:(?!\1).)*)\1/g;
        let m;
        while ((m = pattern.exec(content)) !== null) {
            ipcValues.add(m[1] + m[2] + m[1]); // 带引号的值
            ipcValues.add(m[2]);                // 纯值（不含引号）
        }
        return ipcValues;
    }

    /**
     * 检查规则原文是否命中预提取的 IPC 标识符
     */
    isInIpcValues(ipcValues, ruleOriginal) {
        if (!ipcValues || ipcValues.size === 0) return false;
        const bareRule = ruleOriginal.replace(/^["']|["']$/g, '');
        return ipcValues.has(ruleOriginal) || ipcValues.has(bareRule);
    }

    /**
     * 应用翻译规则
     * @param {string} content - 文件内容
     * @param {Array} rules - 翻译规则
     * @param {Set} [ipcValues] - 预计算的 IPC 标识符集（可选）
     */
    applyRules(content, rules, ipcValues) {
        for (const rule of rules) {
            if (!rule.original || !rule.chinese) continue;

            try {
                if (rule.regex) {
                    // 使用正则表达式
                    const flags = rule.flags || 'g';
                    const regex = new RegExp(rule.original, flags);
                    content = content.replace(regex, rule.chinese);
                } else {
                    // 简单字符串替换

                    // IPC 协议保护：检测规则原文是否出现在 IPC 发送上下文中
                    if (this.isInIpcValues(ipcValues, rule.original)) {
                        console.warn(
                            '[IPC 保护] 跳过规则，原文包含 IPC 协议字符串:',
                            rule.original,
                            '翻译:',
                            rule.chinese,
                        );
                        continue;
                    }

                    // JSON 中的规则已包含双引号，直接使用
                    // 默认使用 replaceAll（替换所有匹配），除非显式设置为 false
                    if (rule.replaceAll === false) {
                        // 只替换第一个匹配
                        content = content.replace(rule.original, rule.chinese);
                    } else {
                        // 替换所有匹配（默认行为）
                        content = content.replaceAll(rule.original, rule.chinese);
                    }
                }
            } catch (error) {
                console.warn('应用规则出错:', rule, error);
            }
        }

        return content;
    }
}

module.exports = Translator;
