import * as vscode from "vscode";

export class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;

  constructor(label: string, children?: TreeItem[], expandable: boolean = false) {
    super(
      label,
      children === undefined && !expandable
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Collapsed
    );
    this.children = children;
  }
}
