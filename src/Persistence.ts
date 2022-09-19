import { ExtensionContext } from "vscode";
import { SurrealConnection } from "./SurrealConnection";

const stateId: string = "connections";

export function read(context: ExtensionContext): SurrealConnection[] {
  return context.globalState.get(stateId) ?? [];
}

export async function set(context: ExtensionContext, connections: SurrealConnection[]) {
  await context.globalState.update(stateId, connections);
}

export async function add(context: ExtensionContext, connection: SurrealConnection) {
  const curr = read(context);
  const updated = [connection, ...curr];
  await set(context, updated);
}

export async function remove(context: ExtensionContext, filterUrl: string) {
  const curr = read(context);
  const filtered = curr.filter((conn) => conn.url !== filterUrl);
  await set(context, filtered);
}
