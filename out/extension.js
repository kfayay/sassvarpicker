"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyInfo = exports.ColorPropertyPicker = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    // const varFilePath = vscode.workspace
    //   .getConfiguration('sassvarpicker')
    //   .get('varFilePath');
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider('scss', new ColorPropertyPicker(), {
        providedCodeActionKinds: ColorPropertyPicker.providedCodeACtionKinds,
    }));
}
exports.activate = activate;
class ColorPropertyPicker {
    constructor(varList = [], pathList = []) {
        this.varList = varList;
        this.pathList = pathList;
    }
    provideCodeActions(document, range, context, token) {
        if (!this.isColorProperty(document, range)) {
            return;
        }
        const replaceColor = this.createFix(document, range, '$test');
        return [replaceColor];
    }
    isColorProperty(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text[start.character] === '#';
    }
    createFix(document, range, color) {
        const fix = new vscode.CodeAction('Convert color to variable', vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        fix.edit.replace(document.uri, new vscode.Range(range.start, range.start.translate(0, 7)), color);
        return fix;
    }
}
exports.ColorPropertyPicker = ColorPropertyPicker;
ColorPropertyPicker.providedCodeACtionKinds = [
    vscode.CodeActionKind.QuickFix,
];
class PropertyInfo {
    provideCodeActions(document, range, context, token) {
        return context.diagnostics
            .filter((diagnostic) => diagnostic.code === '#000')
            .map((diagnostic) => this.createCommandCodeAction(diagnostic));
    }
    createCommandCodeAction(diagnostic) {
        const action = new vscode.CodeAction('Learn more...', vscode.CodeActionKind.QuickFix);
        action.command = {
            command: 'sassvarpicker.command',
            title: 'Learn more about emojis',
            tooltip: 'test',
        };
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        return action;
    }
}
exports.PropertyInfo = PropertyInfo;
PropertyInfo.providedCodeActionKinds = [];
//# sourceMappingURL=extension.js.map