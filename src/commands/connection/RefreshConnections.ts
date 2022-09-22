import { TreeDataProvider } from "../../TreeDataProvider";

export async function refreshConnections(treeDataProvider: TreeDataProvider) {
  await treeDataProvider.refresh();
}
