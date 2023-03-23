"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorVars = void 0;
const fs = require("fs");
const path = require("path");
/**
 * 功能描述：配置文件获取
 * 获取途径：
 * 1. vsode 配置文件（不推荐，配置不可见，修改不方便，不可共享）
 * 2. 读取配置文件
 * 配置文件定义：
 * json格式，sassvarpicker.json
 * 配置结构定义：
 * {
 *  path: string,
 *  alias?: string
 * }[]
 * 输出格式
 * {
 *  varName: string;
 *  value: string;
 *  path: string;
 *  alias: string
 * }[]
 * 边界情况：
 * 1. 未配置 config 情况
 * 2. config 配置文件无效
 * 最终结果都是输出为空
 */
function getColorVars() {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../sassvarpickerc.json'), 'utf-8'));
    // TODO: 增加错误
    const colors = [];
    config.scssPaths.forEach(({ path: scssPath }) => {
        const scssContent = fs.readFileSync(scssPath, 'utf-8');
        const colorRegex = /\$([a-zA-Z0-9_-]+):\s*(#[a-zA-Z0-9]+);/g;
        let match;
        while ((match = colorRegex.exec(scssContent)) !== null) {
            colors.push({ name: match[1], value: match[2] });
        }
    });
    return colors;
}
exports.getColorVars = getColorVars;
//# sourceMappingURL=config.js.map