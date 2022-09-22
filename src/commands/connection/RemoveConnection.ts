import * as vscode from "vscode";
import * as Persistence from "../../Persistence";
import { promptForExistingConnectionUrl } from "../../prompt/Prompts";
import { SurrealConnection } from "../../SurrealConnection";
import { TreeDataProvider } from "../../TreeDataProvider";

export async function removeConnection(context: vscode.ExtensionContext, treeDataProvider: TreeDataProvider) {
  const savedConnections: SurrealConnection[] = Persistence.readAll(context);

  if (!savedConnections || savedConnections.length === 0) {
    vscode.window.showErrorMessage("You have no connections to remove!");
    return;
  }

  const url = await promptForExistingConnectionUrl(savedConnections);

  await Persistence.remove(context, url);
  await treeDataProvider.refresh();
}
