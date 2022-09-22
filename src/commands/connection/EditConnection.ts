import * as vscode from "vscode";
import * as Persistence from "../../Persistence";
import { promptForExistingConnectionUrl, promptForPassword, promptForUsername } from "../../prompt/Prompts";
import { SurrealConnection } from "../../SurrealConnection";
import { TreeDataProvider } from "../../TreeDataProvider";

export async function editConnection(context: vscode.ExtensionContext, treeDataProvider: TreeDataProvider) {
  const connections = Persistence.readAll(context);
  const url = await promptForExistingConnectionUrl(connections);
  const username = await promptForUsername();
  const password = await promptForPassword();
  const updated = new SurrealConnection(url, username, password);
  await Persistence.replace(context, updated);
  treeDataProvider.refresh();
}
