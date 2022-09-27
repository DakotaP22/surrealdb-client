import { SurrealConnection } from "../SurrealConnection";
import * as vscode from "vscode";
import {
  validateConnectionInput,
  validateDatabaseDoesNotExist,
  validateNamespaceDoesNotExist,
  validateNotNullOrEmpty,
} from "./PromptValidators";
import { TreeDataProvider } from "../TreeDataProvider";

export async function promptUserForConnection(existing_connections: SurrealConnection[]): Promise<SurrealConnection> {
  const url = await vscode.window.showInputBox({
    prompt: "Enter Connection URL",
    validateInput: (text) => validateConnectionInput(text, existing_connections),
  });
  const username = await vscode.window.showInputBox({
    prompt: "Enter User Name",
    validateInput: validateNotNullOrEmpty,
  });
  const password = await vscode.window.showInputBox({
    prompt: "Enter Password",
    validateInput: validateNotNullOrEmpty,
  });

  // this condition should never be true unless something in the validators breaks
  if (!url || !username || !password) {
    vscode.window.showWarningMessage("A value you entered was blank.");
    throw new Error();
  }

  return new SurrealConnection(url, username, password);
}

export async function promptForExistingConnectionUrl(connections: SurrealConnection[]): Promise<string> {
  const response = await vscode.window.showQuickPick(
    connections.map((conn) => conn.url),
    { title: "Pick a connection " }
  );
  if (!response) throw new Error("No connection was selected");
  return response;
}

export async function promptForExistingConnection(connections: SurrealConnection[]) {
  const url = await promptForExistingConnectionUrl(connections);
  const connection = connections.find((conn) => conn.url === url);
  if (!connection) throw new Error(`${url} does not match any existing connections`);
  return connection;
}

export async function promptForUsername() {
  const response = await vscode.window.showInputBox({
    prompt: "Enter Username",
    validateInput: validateNotNullOrEmpty,
  });
  if (!response) throw new Error("You must enter a username!");
  return response;
}

export async function promptForPassword() {
  const response = await vscode.window.showInputBox({
    prompt: "Enter Password",
    validateInput: validateNotNullOrEmpty,
  });
  if (!response) throw new Error("You must enter a password!");
  return response;
}

export async function promptUserForNamespaceName(treeDataProvider: TreeDataProvider, connection: SurrealConnection) {
  const name = await vscode.window.showInputBox({
    prompt: "Enter a namespace name",
    validateInput: (text) => validateNamespaceDoesNotExist(text, treeDataProvider, connection),
  });
  if (!name) throw new Error("Namespace name cannot be null!");
  return name;
}

export async function promptUserForExistingNamespaceName(
  treeDataProvider: TreeDataProvider,
  connection: SurrealConnection
) {
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

export async function promptUserForDatabaseName(
  treeDataProvider: TreeDataProvider,
  connection: SurrealConnection,
  namespace: string
) {
  const response = await vscode.window.showInputBox({
    prompt: "Enter Database Name",
    validateInput: (text) => validateDatabaseDoesNotExist(text, treeDataProvider, connection, namespace),
  });
  if (!response) throw new Error("You must enter a database name!");
  return response;
}
