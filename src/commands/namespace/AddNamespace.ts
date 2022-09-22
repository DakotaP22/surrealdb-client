import * as vscode from "vscode";
import * as Persistence from "../../Persistence";
import { promptForExistingConnectionUrl, promptUserForNamespaceName } from "../../prompt/Prompts";
import { DatabaseService } from "../../service/database/DatabaseService";
import { SurrealConnection } from "../../SurrealConnection";
import { TreeDataProvider } from "../../TreeDataProvider";

export async function addNamespace(context: vscode.ExtensionContext, treeDataProvider: TreeDataProvider) {
  const connections = Persistence.readAll(context);

  const connectionURL = await promptForExistingConnectionUrl(connections);
  const connection = getConnectionFromUrl(connectionURL, connections);

  const dbSvc = new DatabaseService(connection.url);
  await dbSvc.signIn(connection.username, connection.password);
  await dbSvc.connect();

  const name = await promptUserForNamespaceName(treeDataProvider, connection);
  await dbSvc.addNamespace(name);

  await treeDataProvider.refresh();
  vscode.window.showInformationMessage("Successfully added namespace!");
}

function getConnectionFromUrl(url: string, connections: SurrealConnection[]): SurrealConnection {
  const connection = connections.find((conn) => conn.url === url);
  if (!connection) throw new Error(`${url} does not match any existing connections`);
  return connection;
}
