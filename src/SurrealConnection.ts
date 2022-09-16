import { devNull } from "os";
import { DatabaseInfoProvider, Namespace } from "./DatabaseInfoProvider";

const Surreal = require("surrealdb.js");

export async function getNamespaces(
  url?: string,
  user?: string,
  pass?: string
): Promise<Namespace[]> {
  let db = new Surreal(url + "/rpc");
  await db.signin({
    user,
    pass,
  });

  const dbInfo: DatabaseInfoProvider = new DatabaseInfoProvider(db);
  return await dbInfo.getInfo();

  //   const nsRes = await db.query("INFO FOR KV;");
  //   const namespaces: any[] = [];
  //   for (const NS in nsRes.map((val: any) => val.result.ns)[0]) {
  //     await db.use(NS, "*");
  //     let dbRes = await db.query("INFO FOR NS;");
  //     let databasesForNamespace = dbRes[0].result.db;

  //     let databases = [];
  //     for (let DB in databasesForNamespace) {
  //       databases.push(DB);
  //     }
  //     console.log(NS, databases);
  //   }
  //   return namespaces;
}

async function getSurrealTreeData(db: any): Promise<string[]> {
  const nsRes = await db.query("INFO FOR KV;");
  const namespaces: any[] = [];
  for (const NS in nsRes.map((val: any) => val.result.ns)[0]) {
    await db.use(NS, "*");
    let dbRes = await db.query("INFO FOR NS;");
    let databasesForNamespace = dbRes[0].result.db;

    let databases = [];
    for (let DB in databasesForNamespace) {
      databases.push(DB);
    }
    console.log(NS, databases);
  }
  return namespaces;
}
