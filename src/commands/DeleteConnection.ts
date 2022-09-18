import { TreeDataProvider } from "../TreeDataProvider";
import * as vscode from "vscode";
import { SurrealConnection } from "../SurrealConnection";

export async function removeConnection(context: vscode.ExtensionContext) {
  const savedConnections: SurrealConnection[] | undefined = context.globalState.get("connections");

  if (!savedConnections || savedConnections.length === 0) {
    vscode.window.showErrorMessage("You have no connections to remove!");
    return;
  }

  const url = await vscode.window.showQuickPick(savedConnections.map((conn) => conn.url));
  const filtered = savedConnections.filter((conn) => conn.url !== url);
  await context.globalState.update("connections", filtered);
}
