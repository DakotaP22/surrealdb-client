import * as vscode from "vscode";
import * as Persistence from "../../Persistence";
import { SurrealConnection } from "../../SurrealConnection";
import { TreeDataProvider } from "../../TreeDataProvider";

export async function editConnection(context: vscode.ExtensionContext, treeDataProvider: TreeDataProvider) {
  const connections = Persistence.readAll(context);
  const url = await promptForConnectionUrl(connections);
  const username = await promptForUsername();
  const password = await promptForPassword();
  const updated = new SurrealConnection(url, username, password);
  await Persistence.replace(context, updated);
  treeDataProvider.refresh();
}

async function promptForConnectionUrl(connections: SurrealConnection[]): Promise<string> {
  const response = await vscode.window.showQuickPick(
    connections.map((conn) => conn.url),
    { title: "Pick a connection " }
  );
  if (!response) throw new Error("No connection was selected");
  return response;
}

async function promptForUsername() {
  const response = await vscode.window.showInputBox({
    prompt: "Enter Username",
    validateInput: validateNotNullOrEmpty,
  });
  if (!response) throw new Error("You must enter a username!");
  return response;
}

async function promptForPassword() {
  const response = await vscode.window.showInputBox({
    prompt: "Enter Password",
    validateInput: validateNotNullOrEmpty,
  });
  if (!response) throw new Error("You must enter a password!");
  return response;
}

function validateNotNullOrEmpty(text: string) {
  return text?.trim() !== "" ? null : "You must enter a value!";
}
