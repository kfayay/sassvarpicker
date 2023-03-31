"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorVars = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
function readFileSync(filePath) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceRootPath = workspaceFolders?.[0]?.uri.path;
    if (!workspaceRootPath) {
        new Error();
        return '';
    }
    return fs.readFileSync(path.join(workspaceRootPath, filePath), 'utf-8');
}
function getColorVars() {
    let config;
    try {
        config = JSON.parse(readFileSync('./sassvarpickerc.json'));
    }
    catch (error) {
        console.error('Error reading config file:', error);
        return [];
    }
    const colors = [];
    config.scssPaths.forEach(({ path: scssPath, alias }) => {
        const scssContent = readFileSync(scssPath);
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