import * as vscode from 'vscode';

import type { VariableInfo } from './model';

export function activate(context: vscode.ExtensionContext) {
  // const varFilePath = vscode.workspace
  //   .getConfiguration('sassvarpicker')
  //   .get('varFilePath');

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      'scss',
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
    if (!this.isColorProperty(document, range)) {
      return;
    }

    const replaceColor = this.createFix(document, range, '$test');

    return [replaceColor];
  }

  private isColorProperty(document: vscode.TextDocument, range: vscode.Range) {
    const start = range.start;
    const line = document.lineAt(start.line);

    return line.text[start.character] === '#';
  }

  private createFix(
    document: vscode.TextDocument,
    range: vscode.Range,
    color: string
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      'Convert color to variable',
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

export class PropertyInfo implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.CodeAction[] {
    return context.diagnostics
      .filter((diagnostic) => diagnostic.code === '#000')
      .map((diagnostic) => this.createCommandCodeAction(diagnostic));
  }

  private createCommandCodeAction(
    diagnostic: vscode.Diagnostic
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(
      'Learn more...',
      vscode.CodeActionKind.QuickFix
    );

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
