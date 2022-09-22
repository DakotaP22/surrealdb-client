import { SurrealConnection } from "../SurrealConnection";

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
