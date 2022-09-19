import * as vscode from "vscode";
import { SurrealConnection } from "../SurrealConnection";
import * as Persistence from "../Persistence";
import { TreeDataProvider } from "../TreeDataProvider";

export async function removeConnection(context: vscode.ExtensionContext, treeDataProvider: TreeDataProvider) {
  const savedConnections: SurrealConnection[] = Persistence.read(context);

  if (!savedConnections || savedConnections.length === 0) {
    vscode.window.showErrorMessage("You have no connections to remove!");
    return;
  }

  const url = await vscode.window.showQuickPick(savedConnections.map((conn) => conn.url));

  if (!url) {
    vscode.window.showErrorMessage("You did not select an existing connection!");
    return;
  }

  await Persistence.remove(context, url);
  await treeDataProvider.refresh();
}
