"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionDocumentChange = exports.refreshDiagnostic = void 0;
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
function refreshDiagnostic(doc, varDiagnostic, colorVars) {
    const diagnositc = [];
    const text = doc.getText();
    const regex = /(\$[a-zA-Z0-9_-]+):\s*(#[a-fA-F0-9]{3,6});/g;
    let match;
    while ((match = regex.exec(text))) {
        const varName = match[1];
        const varValue = match[2];
        if (colorVars.find((colorVar) => colorVar.value === varValue)) {
            diagnositc.push(new vscode.Diagnostic(new vscode.Range(doc.positionAt(match.index), doc.positionAt(match.index + match[0].length)), `${varName} 已定义为 ${varValue}`, vscode.DiagnosticSeverity.Warning));
        }
    }
    varDiagnostic.set(doc.uri, diagnositc);
}
exports.refreshDiagnostic = refreshDiagnostic;
function subscriptionDocumentChange(context, varDiagnostics, colorVars) {
    if (vscode.window.activeTextEditor) {
        refreshDiagnostic(vscode.window.activeTextEditor.document, varDiagnostics, colorVars);
    }
}
exports.subscriptionDocumentChange = subscriptionDocumentChange;
//# sourceMappingURL=diagnostics.js.map