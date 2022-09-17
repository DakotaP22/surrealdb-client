import * as vscode from "vscode";
import { DatabaseService, Namespace } from "./DatabaseService";
import { SurrealConnection } from "./SurrealConnection";
import { TreeItem } from "./TreeItem";
const Surreal = require("surrealdb.js");

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  data: TreeItem[];
  connections!: SurrealConnection[];

  constructor(connections: SurrealConnection[]) {
    this.data = [];
    this.connections = connections;
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

  async load() {
    this.data = [];
    for (var connection of this.connections) {
      const namespaces = await this.getNamespaces(
        connection.url,
        connection.username,
        connection.password
      );
      const connectionElement = new TreeItem(
        connection.url,
        namespaces.map((namespace) => namespace.getAsTreeItem())
      );
      this.data.push(connectionElement);
    }
  }

  async refresh(): Promise<void> {
    this.data = [];
    for (var connection of this.connections) {
      const namespaces = await this.getNamespaces(
        connection.url,
        connection.username,
        connection.password
      );
      const connectionElement = new TreeItem(
        connection.url,
        namespaces.map((namespace) => namespace.getAsTreeItem())
      );
      this.data.push(connectionElement);
    }
    this._onDidChangeTreeData.fire();
  }

  async addConnections(connections: SurrealConnection[]) {
    this.connections = connections;
    await this.refresh();
  }

  async addConnection(
    url: string,
    username: string,
    password: string
  ): Promise<SurrealConnection[]> {
    this.connections.push(new SurrealConnection(url, username, password));
    await this.refresh();
    return this.connections;
  }

  async getNamespaces(url: string, user: string, pass: string): Promise<Namespace[]> {
    const dbSvc: DatabaseService = new DatabaseService(url);
    await dbSvc.signIn(user, pass);
    return await dbSvc.getNamespaces();
  }
}
