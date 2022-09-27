import * as vscode from "vscode";
import * as Persistence from "../../Persistence";
import {
  promptForExistingConnection,
  promptUserForDatabaseName,
  promptUserForExistingNamespaceName,
} from "../../prompt/Prompts";
import { DatabaseService } from "../../service/database/DatabaseService";
import { TreeDataProvider } from "../../TreeDataProvider";

export async function addDatabase(context: vscode.ExtensionContext, treeDataProvider: TreeDataProvider) {
  const connections = Persistence.readAll(context);
  const connection = await promptForExistingConnection(connections);
  const namespaceName = await promptUserForExistingNamespaceName(treeDataProvider, connection);
  const dbName = await promptUserForDatabaseName(treeDataProvider, connection, namespaceName);

  try {
    const dbSvc = new DatabaseService(connection.url);
    await dbSvc.signIn(connection.username, connection.password);
    await dbSvc.connect();
    await dbSvc.createDatabase(namespaceName, dbName);
    treeDataProvider.refresh();
  } catch (err) {
    console.log(err);
  }
}
