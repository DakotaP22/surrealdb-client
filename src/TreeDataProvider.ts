import * as vscode from "vscode";
import * as Persistence from "./Persistence";
import { DatabaseService, Namespace } from "./service/database/DatabaseService";
import { SurrealConnection } from "./SurrealConnection";
import { TreeItem } from "./TreeItem";
const Surreal = require("surrealdb.js");

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  data: TreeItem[];
  context: vscode.ExtensionContext;

  constructor(connections: SurrealConnection[], context: vscode.ExtensionContext) {
    this.data = [];
    this.context = context;
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

  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<
    TreeItem | undefined | null | void
  >();

  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  async refresh(): Promise<void> {
    console.log("REFERESHING TREE VIEW!");
    this.data = [];
    const connections = Persistence.read(this.context).sort((a, b) => a.url.localeCompare(b.url));

    for (var connection of connections) {
      const namespaces = await this.getNamespaces(connection.url, connection.username, connection.password);
      const connectionElement = new TreeItem(
        connection.url,
        namespaces.map((namespace) => namespace.getAsTreeItem())
      );
      this.data.push(connectionElement);
    }
    this._onDidChangeTreeData.fire();
  }

  async getNamespaces(url: string, user: string, pass: string): Promise<Namespace[]> {
    const dbSvc: DatabaseService = new DatabaseService(url);
    await dbSvc.signIn(user, pass);
    return await dbSvc.getNamespaces();
  }
}
