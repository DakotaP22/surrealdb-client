import * as vscode from "vscode";
import { SurrealConnection } from "../SurrealConnection";
import { TreeDataProvider } from "../TreeDataProvider";

export async function addConnection(treeDataProvider: TreeDataProvider): Promise<SurrealConnection[]> {
  const { url, username, password } = await promptUser(treeDataProvider.connections);
  return await treeDataProvider.addConnection(url, username, password);
}

async function promptUser(existing_connections: SurrealConnection[]): Promise<AddConnectionAnswers> {
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

  return { url, username, password } as AddConnectionAnswers;
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
  return !(text?.trim() !== "") ? null : "You must enter a value!";
}

interface AddConnectionAnswers {
  url: string;
  username: string;
  password: string;
}
