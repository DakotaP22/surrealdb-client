import * as vscode from "vscode";
import * as Persistence from "../../Persistence";
import { promptUserForConnection } from "../../prompt/Prompts";
import { TreeDataProvider } from "../../TreeDataProvider";

export async function addConnection(
  context: vscode.ExtensionContext,
  treeDataProvider: TreeDataProvider
): Promise<void> {
  const connections = Persistence.readAll(context);
  const newConnection = await promptUserForConnection(connections);
  await Persistence.add(context, newConnection);
  await treeDataProvider.refresh();
}

interface AddConnectionAnswers {
  url: string;
  username: string;
  password: string;
}
