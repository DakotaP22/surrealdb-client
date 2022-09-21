import { TreeItem } from "../../TreeItem";
const Surreal = require("surrealdb.js");

export class DatabaseService {
  db: any;

  constructor(url: string) {
    const uri = url + "/rpc";
    this.db = new Surreal(uri);
  }

  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        console.log("TIMED OUT!");
        resolve(false);
      }, 5 * 1000);
      this.db.wait().then(() => {
        clearTimeout(timeoutId);
        resolve(true);
      });
    });
  }

  async signIn(user: string, pass: string) {
    try {
      await this.db.signin({
        user,
        pass,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async getNamespaces(): Promise<Namespace[]> {
    let nsRes = await this.db.query("INFO FOR KV;");
    let namespacesForConnection = nsRes[0].result.ns;
    let namespaces: Namespace[] = [];
    for (let namespaceName in namespacesForConnection) {
      const namespace: Namespace = new Namespace(namespaceName, this.db);
      await namespace.getDatabases();
      namespaces.push(namespace);
    }
    return namespaces;
  }

  async addNamespace(name: string) {
    await this.db.query(`DEFINE NAMESPACE ${name};`);
  }

  async removeNamespace(name: string) {
    await this.db.query(`REMOVE NAMESPACE ${name}`);
  }
}

export class Namespace {
  name: string;
  databases: Database[];
  db: any;

  constructor(name: string, db: any) {
    this.name = name;
    this.databases = [];
    this.db = db;
  }

  getAsTreeItem(): TreeItem {
    return new TreeItem(
      this.name,
      this.databases.map((db) => db.getAsTreeItem())
    );
  }

  async getDatabases() {
    this.databases = [];
    await this.db.use(this.name, "*");
    let dbRes = await this.db.query("INFO FOR NS;");
    let databasesForNamespace = dbRes[0].result.db;
    for (let dbName in databasesForNamespace) {
      const database: Database = new Database(this.name, dbName, this.db);
      await database.getTables();
      this.databases.push(database);
    }
  }
}

export class Database {
  namespace: string;
  dbName: string;
  tables: DatabaseTable[];
  db: any;

  constructor(namespace: string, dbName: string, db: any) {
    this.namespace = namespace;
    this.dbName = dbName;
    this.db = db;
    this.tables = [];
  }

  async getTables() {
    this.tables = [];
    await this.db.use(this.namespace, this.dbName);
    let tblRes = await this.db.query("INFO FOR DB;");
    let tablesForDB = tblRes[0].result.tb;
    for (let TB in tablesForDB) {
      this.tables.push(new DatabaseTable(this.namespace, this.dbName, TB));
    }
  }
  getAsTreeItem(): TreeItem {
    return new TreeItem(
      this.dbName,
      this.tables.map((tbl) => tbl.getAsTreeItem())
    );
  }
}

export class DatabaseTable {
  namespace: string;
  dbName: string;
  tblName: string;

  constructor(namespace: string, dbName: string, tblName: string) {
    this.namespace = namespace;
    this.dbName = dbName;
    this.tblName = tblName;
  }

  getAsTreeItem(): TreeItem {
    return new TreeItem(this.tblName);
  }
}
