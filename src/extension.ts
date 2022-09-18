import * as vscode from "vscode";
import { DatabaseService } from "./DatabaseService";
import { SurrealConnection } from "./SurrealConnection";
import { TreeDataProvider } from "./TreeDataProvider";
import { addConnection } from "./commands/AddConnection";

export async function activate(context: vscode.ExtensionContext) {
  const savedConnections: SurrealConnection[] = context.globalState.get("connections") ?? [];

  const treeDataProvider: TreeDataProvider = new TreeDataProvider(savedConnections);
  await treeDataProvider.load();

  vscode.window.registerTreeDataProvider("connectionView", treeDataProvider);

  const addConnectionCmd = vscode.commands.registerCommand("surrealdb-explorer.addConnection", async () => {
    try {
      const connections = await addConnection(treeDataProvider);
      saveConnections(context, connections);

      // const connections = await treeDataProvider.addConnection(conn, username, password);
      // context.globalState.update("connections", connections);
    } catch (ex) {
      console.error(ex);
    }
  });

  const addNamespaceCmd = vscode.commands.registerCommand("surrealdb-explorer.addNamespace", async () => {
    const connections = treeDataProvider.connections;
    const connectionURL = await vscode.window.showQuickPick(
      connections.map((conn) => conn.url),
      {
        title: "Choose a connection",
      }
    );
    const connection = connections.find((conn) => conn.url === connectionURL);

    if (!connection) {
      vscode.window.showErrorMessage(`${connectionURL} does not match any existing connections`);
      return;
    }
    console.log(connection);
    const dbSvc: DatabaseService = new DatabaseService(connection.url);
    await dbSvc.signIn(connection.username, connection.password);

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
    if (!name) return;

    await dbSvc.addNamespace(name);
    treeDataProvider.refresh();
  });

  context.subscriptions.push(addNamespaceCmd);
  context.subscriptions.push(addConnectionCmd);
}

function saveConnections(context: vscode.ExtensionContext, connections: SurrealConnection[]) {
  context.globalState.update("connections", connections);
}
