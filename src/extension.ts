import * as vscode from "vscode";
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

  context.subscriptions.push(addConnectionCmd);
}
