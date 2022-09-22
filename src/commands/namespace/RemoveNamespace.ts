import { DatabaseService } from "../../service/database/DatabaseService";
import { SurrealConnection } from "../../SurrealConnection";
import { TreeDataProvider } from "../../TreeDataProvider";
import * as vscode from "vscode";
import * as Persistence from "../../Persistence";

export async function removeNamespace(context: vscode.ExtensionContext, treeDataProvider: TreeDataProvider) {
  const connections = Persistence.readAll(context);
  const connectionURL = await promptForConnectionUrl(connections);
  const connection = getConnectionFromUrl(connectionURL, connections);
  const namespaceName = await promptUserForNamespaceName(treeDataProvider, connection);

  const dbSvc = new DatabaseService(connection.url);
  await dbSvc.connect();
  await dbSvc.signIn(connection.username, connection.password);
  await dbSvc.removeNamespace(namespaceName);
  await treeDataProvider.refresh();
  vscode.window.showInformationMessage("Successfully removed namespace: " + namespaceName);
}

async function promptForConnectionUrl(connections: SurrealConnection[]): Promise<string> {
  const url = await vscode.window.showQuickPick(
    connections.map((conn) => conn.url),
    {
      title: "Choose a connection",
    }
  );
  if (!url) throw new Error("Connection cannot be null!");
  return url;
}

function getConnectionFromUrl(url: string, connections: SurrealConnection[]): SurrealConnection {
  const connection = connections.find((conn) => conn.url === url);
  if (!connection) throw new Error(`${url} does not match any existing connections`);
  return connection;
}

//todo: change to use quick pick
async function promptUserForNamespaceName(treeDataProvider: TreeDataProvider, connection: SurrealConnection) {
  const namespaces = treeDataProvider.data
    .find((conn) => conn.label === connection.url)
    ?.children?.map((child) => child.label as string);

  if (!namespaces) throw new Error("There are no namespaces to choose from!");

  const name = await vscode.window.showQuickPick(namespaces, {
    title: "Choose a namespace to remove",
  });
  if (!name) throw new Error("Namespace name cannot be null!");
  return name;
}
