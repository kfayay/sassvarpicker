"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
/**
 * 样式变量检测
 * 检测文件类型：
 *  scss
 * 检测时机：
 *  文档打开
 *  文档更新
 * 检测提示：
 *  变量已定义
 *  检测级别警告
 * 边界情况：
 *  1. 当存在全局禁用检测时
 *  2. 当存在单条禁用检测时
 */
function subscribeToDocumentChanges(context, colorDiagnostics) {
    vscode.workspace.onDidChangeTextDocument((event) => {
        const document = event.document;
        if (document.languageId === 'scss') {
            const diagnostics = [];
            const regEx = /(\$[a-zA-Z0-9_-]+)\s*:/g;
            const text = document.getText();
            let match;
            while ((match = regEx.exec(text))) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos);
                const diagnostic = new vscode.Diagnostic(range, `Sass variable "${match[1]}" is defined.`, vscode.DiagnosticSeverity.Information);
                diagnostics.push(diagnostic);
            }
            colorDiagnostics.set(document.uri, diagnostics);
        }
    });
}
//# sourceMappingURL=diagnostics.js.map