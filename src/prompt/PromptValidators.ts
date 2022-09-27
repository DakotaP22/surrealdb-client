import { SurrealConnection } from "../SurrealConnection";
import { TreeDataProvider } from "../TreeDataProvider";

export function validateConnectionInput(text: string, existing_connections: SurrealConnection[]) {
  if (!(text?.trim() !== "")) {
    return "You must enter a value!";
  } else if (existing_connections.find((conn) => conn.url === text)) {
    return "Connection already exists!";
  } else {
    return null;
  }
}

export function validateNotNullOrEmpty(text: string) {
  return text?.trim() !== "" ? null : "You must enter a value!";
}

export function validateNamespaceDoesNotExist(
  name: string,
  treeDataProvider: TreeDataProvider,
  connection: SurrealConnection
) {
  if (!(name?.trim() !== "")) {
    return "You must enter a value!";
  } else if (
    treeDataProvider.data.find((conn) => conn.label === connection.url)?.children?.find((ns) => ns.label === name)
  ) {
    return "Namespace already exists!";
  } else {
    return null;
  }
}

export function validateDatabaseDoesNotExist(
  dbName: string,
  treeDataProvider: TreeDataProvider,
  connection: SurrealConnection,
  namespace: string
) {
  if (!(dbName?.trim() !== "")) {
    return "You must enter a value!";
  } else if (
    treeDataProvider.data
      .find((conn) => conn.label === connection.url)
      ?.children?.find((ns) => ns.label === namespace)
      ?.children?.find((db) => db.label === dbName)
  ) {
    return "Database already exists!";
  } else {
    return null;
  }
}
