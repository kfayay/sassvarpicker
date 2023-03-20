import * as vscode from "vscode";

import type { VariableInfo } from "./model";

export function activate(context: vscode.ExtensionContext) {
  // const varFilePath = vscode.workspace
  //   .getConfiguration('sassvarpicker')
  //   .get('varFilePath');

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      "scss",
      new ColorPropertyPicker(),
      {
        providedCodeActionKinds: ColorPropertyPicker.providedCodeACtionKinds,
      }
    )
  );
}

export class ColorPropertyPicker implements vscode.CodeActionProvider {
  public static readonly providedCodeACtionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  constructor(
    private varList: VariableInfo[] = [],
    private pathList: string[] = []
  ) {}

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    if (!this.isCursorInColorProperty(document, range)) {
      return;
    }

    const replaceColor = this.createFix(document, range, "$test");

    return [replaceColor];
  }

  // 定义一个函数来判断当前行是否存在 css 颜色属性，并且光标是否在颜色属性区间内
  private isCursorInColorProperty(
    document: vscode.TextDocument,
    range: vscode.Range
  ) {
    const start = range.start;
    const lineText = document.lineAt(start.line).text;
    const colorRegex =
      /(#(?:[a-f\d]{3}){1,2}|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|efQ6qDy8J6VDiYXrgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(?:0?\.\d+|1)\))/i;
    const match = colorRegex.exec(lineText);

    if (!match) {
      return false;
    }

    // 获取匹配结果在当前行中的起始和结束位置
    const colorStart = match.index;
    const colorEnd = colorStart + match[0].length;
    // 判断光标是否在匹配结果的区间内，如果是返回 true，否则返回 false
    return start.character >= colorStart && start.character <= colorEnd;
  }

  private createFix(
    document: vscode.TextDocument,
    range: vscode.Range,
    color: string
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      "Convert color to variable",
      vscode.CodeActionKind.QuickFix
    );
    fix.edit = new vscode.WorkspaceEdit();
    fix.edit.replace(
      document.uri,
      new vscode.Range(range.start, range.start.translate(0, 7)),
      color
    );

    return fix;
  }
}
