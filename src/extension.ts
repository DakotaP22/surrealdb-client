import * as vscode from "vscode";
import { DatabaseService } from "./DatabaseService";
import { TreeDataProvider } from "./TreeDataProvider";

export function activate(context: vscode.ExtensionContext) {
  const treeDataProvider: TreeDataProvider = new TreeDataProvider();
  vscode.window.registerTreeDataProvider("connectionView", treeDataProvider);

  const addConnectionCmd = vscode.commands.registerCommand(
    "surrealdb-explorer.addConnection",
    async () => {
      const conn = await vscode.window.showInputBox({
        prompt: "Enter Connection URL",
      });
      const username = await vscode.window.showInputBox({
        prompt: "Enter User Name",
      });
      const password = await vscode.window.showInputBox({
        prompt: "Enter Password",
      });
      // const conn = "http://localhost:8000";
      // const username = "root";
      // const password = "root";

      try {
        treeDataProvider.addConnection(conn, username, password);
      } catch (ex) {
        console.error(ex);
      }
    }
  );

  const addNamespaceCmd = vscode.commands.registerCommand(
    "surrealdb-explorer.addNamespace",
    async () => {
      const connections = treeDataProvider.connections;
      const connectionURL = await vscode.window.showQuickPick(connections.map((conn) => conn.url));
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
      });
      if (!name || name.trim() === "") {
        vscode.window.showErrorMessage("Namespace cannot be empty");
        return;
      } else if (
        treeDataProvider.data
          .find((conn) => conn.label === connection.url)
          ?.children?.find((ns) => ns.label === name)
      ) {
        vscode.window.showErrorMessage("Namespace already exists");
        return;
      }
      await dbSvc.addNamespace(name);
      treeDataProvider.refresh();
    }
  );

  context.subscriptions.push(addNamespaceCmd);
  context.subscriptions.push(addConnectionCmd);
}
