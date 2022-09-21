import * as vscode from "vscode";
import { addConnection } from "./commands/AddConnection";
import { removeConnection } from "./commands/RemoveConnection";
import { refreshConnections } from "./commands/RefreshConnections";
import { launchDocs } from "./commands/LaunchDocs";
import { addNamespace } from "./commands/AddNamespace";
import { TreeDataProvider } from "./TreeDataProvider";
import { removeNamespace } from "./commands/RemoveNamespace";

export async function activate(context: vscode.ExtensionContext) {
  const treeDataProvider: TreeDataProvider = new TreeDataProvider([], context);
  await treeDataProvider.refresh();

  vscode.window.registerTreeDataProvider("connectionView", treeDataProvider);

  const launchDocsCmd = vscode.commands.registerCommand("surrealdb-explorer.launchDocs", launchDocs);
  context.subscriptions.push(launchDocsCmd);

  const addConnectionCmd = vscode.commands.registerCommand("surrealdb-explorer.addConnection", async () => {
    try {
      await addConnection(context, treeDataProvider);
    } catch (ex) {
      console.error(ex);
    }
  });
  context.subscriptions.push(addConnectionCmd);

  const deleteConnectionCmd = vscode.commands.registerCommand("surrealdb-explorer.removeConnection", async () => {
    try {
      await removeConnection(context, treeDataProvider);
    } catch (ex) {
      console.error(ex);
    }
  });
  context.subscriptions.push(deleteConnectionCmd);

  const refreshConnectionsCmd = vscode.commands.registerCommand("surrealdb-explorer.refreshConnections", async () => {
    await refreshConnections(treeDataProvider);
  });
  context.subscriptions.push(refreshConnectionsCmd);

  const addNamespaceCmd = vscode.commands.registerCommand("surrealdb-explorer.addNamespace", async () => {
    await addNamespace(context, treeDataProvider);
  });
  context.subscriptions.push(addNamespaceCmd);

  const removeNamespaceCmd = vscode.commands.registerCommand("surrealdb-explorer.removeNamespace", async () => {
    await removeNamespace(context, treeDataProvider);
  });
  context.subscriptions.push(removeNamespaceCmd);
}
