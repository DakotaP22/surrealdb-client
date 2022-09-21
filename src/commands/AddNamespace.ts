import * as vscode from "vscode";
import * as Persistence from "../Persistence";
import { DatabaseService } from "../service/database/DatabaseService";
import { SurrealConnection } from "../SurrealConnection";
import { TreeDataProvider } from "../TreeDataProvider";

export async function addNamespace(context: vscode.ExtensionContext, treeDataProvider: TreeDataProvider) {
  const connections = Persistence.read(context);

  const connectionURL = await promptForConnectionUrl(connections);
  const connection = getConnectionFromUrl(connectionURL, connections);

  const dbSvc = new DatabaseService(connection.url);
  await dbSvc.signIn(connection.username, connection.password);
  await dbSvc.connect();

  const name = await promptUserForNamespaceName(treeDataProvider, connection);
  await dbSvc.addNamespace(name);

  await treeDataProvider.refresh();
  vscode.window.showInformationMessage("Successfully added namespace!");
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

async function promptUserForNamespaceName(treeDataProvider: TreeDataProvider, connection: SurrealConnection) {
  const name = await vscode.window.showInputBox({
    prompt: "Enter a namespace name",
    validateInput: (name) => {
      // return text?.length > 0 ? null : "You must enter a value!";
      if (!(name?.trim() !== "")) {
        return "You must enter a value!";
      } else if (
        treeDataProvider.data.find((conn) => conn.label === connection.url)?.children?.find((ns) => ns.label === name)
      ) {
        return "Namespace already exists!";
      } else {
        return null;
      }
    },
  });
  if (!name) throw new Error("Namespace name cannot be null!");
  return name;
}
