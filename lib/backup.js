const fs = require('fs');

/**
 * 备份管理器：负责创建和还原备份
 */
class BackupManager {
    constructor(config) {
        this.config = config;
    }

    /**
     * 创建备份文件
     */
    async createBackup(filePath) {
        const backupPath = filePath + '.bak';

        try {
            // 如果备份已存在，不覆盖
            if (fs.existsSync(backupPath)) {
                console.log('备份文件已存在，跳过创建');
                return true;
            }

            // 创建备份
            fs.copyFileSync(filePath, backupPath);
            console.log('备份创建成功:', backupPath);
            return true;
        } catch (error) {
            console.error('备份创建失败:', error);
            return false;
        }
    }

    /**
     * 还原备份文件
     */
    async restoreBackup(filePath) {
        const backupPath = filePath + '.bak';

        try {
            if (!fs.existsSync(backupPath)) {
                console.log('备份文件不存在');
                return false;
            }

            // 还原备份
            fs.copyFileSync(backupPath, filePath);
            console.log('备份还原成功');
            return true;
        } catch (error) {
            console.error('备份还原失败:', error);
            return false;
        }
    }

    /**
     * 删除备份文件
     */
    async deleteBackup(filePath) {
        const backupPath = filePath + '.bak';

        try {
            if (fs.existsSync(backupPath)) {
                fs.unlinkSync(backupPath);
                console.log('备份文件已删除');
                return true;
            }
            return false;
        } catch (error) {
            console.error('备份删除失败:', error);
            return false;
        }
    }

    /**
     * 检查备份是否存在
     */
    hasBackup(filePath) {
        const backupPath = filePath + '.bak';
        return fs.existsSync(backupPath);
    }
}

module.exports = BackupManager;
