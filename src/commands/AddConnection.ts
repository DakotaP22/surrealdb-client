import * as vscode from "vscode";
import { SurrealConnection } from "../SurrealConnection";
import * as Persistence from "../Persistence";
import { TreeDataProvider } from "../TreeDataProvider";

export async function addConnection(
  context: vscode.ExtensionContext,
  treeDataProvider: TreeDataProvider
): Promise<void> {
  console.log("ADDING CONNECTION");
  const connections = Persistence.read(context);
  console.log(connections);
  const newConnection = await promptUser(connections);
  console.log(newConnection);
  await Persistence.add(context, newConnection);
  await treeDataProvider.refresh();
}

async function promptUser(existing_connections: SurrealConnection[]): Promise<SurrealConnection> {
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

function validateConnectionInput(text: string, existing_connections: SurrealConnection[]) {
  if (!(text?.trim() !== "")) {
    return "You must enter a value!";
  } else if (existing_connections.find((conn) => conn.url === text)) {
    return "Connection already exists!";
  } else {
    return null;
  }
}

function validateNotNullOrEmpty(text: string) {
  return text?.trim() !== "" ? null : "You must enter a value!";
}

interface AddConnectionAnswers {
  url: string;
  username: string;
  password: string;
}
