import * as vscode from "vscode";
import { addConnection } from "./commands/connection/AddConnection";
import { removeConnection } from "./commands/connection/RemoveConnection";
import { refreshConnections } from "./commands/connection/RefreshConnections";
import { editConnection } from "./commands/connection/EditConnection";
import { launchDocs } from "./commands/LaunchDocs";
import { addNamespace } from "./commands/namespace/AddNamespace";
import { TreeDataProvider } from "./TreeDataProvider";
import { removeNamespace } from "./commands/namespace/RemoveNamespace";

export async function activate(context: vscode.ExtensionContext) {
  const treeDataProvider: TreeDataProvider = new TreeDataProvider(context);
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

  const editConnectionCmd = vscode.commands.registerCommand("surrealdb-explorer.editConnection", async () => {
    await editConnection(context, treeDataProvider);
  });
  context.subscriptions.push(editConnectionCmd);

  const addNamespaceCmd = vscode.commands.registerCommand("surrealdb-explorer.addNamespace", async () => {
    await addNamespace(context, treeDataProvider);
  });
  context.subscriptions.push(addNamespaceCmd);

  const removeNamespaceCmd = vscode.commands.registerCommand("surrealdb-explorer.removeNamespace", async () => {
    await removeNamespace(context, treeDataProvider);
  });
  context.subscriptions.push(removeNamespaceCmd);
}
