import * as vscode from "vscode";

export function launchDocs() {
  vscode.env.openExternal(vscode.Uri.parse("https://surrealdb.com/docs"));
}
