import * as vscode from "vscode";
import * as Persistence from "../../Persistence";
import { promptForExistingConnectionUrl, promptUserForExistingNamespaceName } from "../../prompt/Prompts";
import { DatabaseService } from "../../service/database/DatabaseService";
import { SurrealConnection } from "../../SurrealConnection";
import { TreeDataProvider } from "../../TreeDataProvider";

export async function removeNamespace(context: vscode.ExtensionContext, treeDataProvider: TreeDataProvider) {
  const connections = Persistence.readAll(context);
  const connectionURL = await promptForExistingConnectionUrl(connections);
  const connection = getConnectionFromUrl(connectionURL, connections);
  const namespaceName = await promptUserForExistingNamespaceName(treeDataProvider, connection);

  const dbSvc = new DatabaseService(connection.url);
  await dbSvc.connect();
  await dbSvc.signIn(connection.username, connection.password);
  await dbSvc.removeNamespace(namespaceName);
  await treeDataProvider.refresh();
  vscode.window.showInformationMessage("Successfully removed namespace: " + namespaceName);
}

function getConnectionFromUrl(url: string, connections: SurrealConnection[]): SurrealConnection {
  const connection = connections.find((conn) => conn.url === url);
  if (!connection) throw new Error(`${url} does not match any existing connections`);
  return connection;
}
