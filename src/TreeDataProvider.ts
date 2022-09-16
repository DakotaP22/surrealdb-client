import * as vscode from "vscode";
import { DatabaseInfoProvider, Namespace } from "./DatabaseInfoProvider";
import { TreeItem } from "./TreeItem";
const Surreal = require("surrealdb.js");

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  data: TreeItem[];

  constructor() {
    this.data = [];
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }

  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> =
    new vscode.EventEmitter<TreeItem | undefined | null | void>();

  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  async addConnection(connection?: string, username?: string, password?: string): Promise<void> {
    if (!connection || !username || !password) return;

    const namespaces = await this.getNamespaces(connection, username, password);
    const connectionElement = new TreeItem(
      connection,
      namespaces.map((namespace) => namespace.getAsTreeItem())
    );
    this.data.push(connectionElement);
    this.refresh();
  }

  async getNamespaces(url?: string, user?: string, pass?: string): Promise<Namespace[]> {
    let db = new Surreal(url + "/rpc");
    await db.signin({
      user,
      pass,
    });

    const dbInfo: DatabaseInfoProvider = new DatabaseInfoProvider(db);
    return await dbInfo.getInfo();
  }
}
