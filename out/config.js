"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorVars = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
function getColorVars() {
    let config;
    try {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const workspacePath = workspaceFolders?.[0]?.uri.path;
        config = JSON.parse(fs.readFileSync(path.join(workspacePath || __dirname, './sassvarpickerc.json'), 'utf-8'));
    }
    catch (error) {
        console.error('Error reading config file:', error);
        return [];
    }
    const colors = [];
    config.scssPaths.forEach(({ path: scssPath, alias }) => {
        const scssContent = fs.readFileSync(scssPath, 'utf-8');
        const colorRegex = /\$([a-zA-Z0-9_-]+):\s*(#[a-zA-Z0-9]+);/g;
        let match;
        while ((match = colorRegex.exec(scssContent)) !== null) {
            colors.push({
                varName: match[1],
                value: match[2],
                path: scssPath,
                alias,
            });
        }
    });
    return colors;
}
exports.getColorVars = getColorVars;
//# sourceMappingURL=config.js.map