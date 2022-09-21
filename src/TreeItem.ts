import * as vscode from "vscode";

export class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  iconPath: vscode.ThemeIcon | undefined;

  constructor(label: string, children?: TreeItem[], expandable: boolean = false, iconId?: string) {
    super(
      label,
      children === undefined && !expandable
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Collapsed
    );
    this.children = children;
    this.iconPath = iconId ? new vscode.ThemeIcon(iconId) : undefined;
  }
}
