import * as vscode from "vscode";

function subscribeToDocumentChanges(
  context: vscode.ExtensionContext,
  colorDiagnostics: vscode.DiagnosticCollection
): void {
  vscode.workspace.onDidChangeTextDocument((event) => {
    const document = event.document;
    if (document.languageId === "scss") {
      const diagnostics: vscode.Diagnostic[] = [];
      const regEx = /(\$[a-zA-Z0-9_-]+)\s*:/g;
      const text = document.getText();
      let match;
      while ((match = regEx.exec(text))) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPos, endPos);
        const diagnostic = new vscode.Diagnostic(
          range,
          `Sass variable "${match[1]}" is defined.`,
          vscode.DiagnosticSeverity.Information
        );
        diagnostics.push(diagnostic);
      }
      colorDiagnostics.set(document.uri, diagnostics);
    }
  });
}
