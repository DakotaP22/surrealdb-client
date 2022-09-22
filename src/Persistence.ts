import { ExtensionContext } from "vscode";
import { SurrealConnection } from "./SurrealConnection";

const stateId: string = "connections";

export function readAll(context: ExtensionContext): SurrealConnection[] {
  return context.globalState.get(stateId) ?? [];
}

export function read(context: ExtensionContext, url: string) {
  return readAll(context).find((conn) => conn.url === url);
}

export async function set(context: ExtensionContext, connections: SurrealConnection[]) {
  await context.globalState.update(stateId, connections);
}

export async function add(context: ExtensionContext, connection: SurrealConnection) {
  const curr = readAll(context);
  const updated = [connection, ...curr];
  await set(context, updated);
}

export async function remove(context: ExtensionContext, filterUrl: string) {
  const curr = readAll(context);
  const filtered = curr.filter((conn) => conn.url !== filterUrl);
  await set(context, filtered);
}

export async function replace(context: ExtensionContext, connection: SurrealConnection) {
  const connections = readAll(context);
  const fitered = connections.filter((conn) => conn.url !== connection.url);
  await set(context, [connection, ...fitered]);
}
