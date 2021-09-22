import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem
} from 'vscode';
import { TreeViewItem } from './treeNode';

/**
 * Defines tree view data provider base class for all GitOps tree views.
 */
export class TreeViewDataProvider implements TreeDataProvider<TreeItem> {
  private treeItems: TreeItem[] | null = null;
  private _onDidChangeTreeData: EventEmitter<TreeItem | undefined> = new EventEmitter<TreeItem | undefined>();
  readonly onDidChangeTreeData: Event<TreeItem | undefined> = this._onDidChangeTreeData.event;

	/**
	 * Reloads tree view item and its children.
	 * @param treeItem Tree item to refresh.
	 */
  public refresh(treeItem?: TreeItem) {
    this.treeItems = null;
    this._onDidChangeTreeData.fire(treeItem);
  }

	/**
	 * Gets tree view item for the specified tree element.
	 * @param element Tree element.
	 * @returns Tree view item.
	 */
  public getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

	/**
	 * Gets tree element parent.
	 * @param element Tree item to get parent for.
	 * @returns Parent tree item or null for the top level nodes.
	 */
  public getParent(element: TreeItem): TreeItem | null {
    if (element instanceof TreeViewItem && element.parent) {
      return element.parent;
    }
    return null;
  }

	/**
	 * Gets children for the specified tree element.
	 * Creates new tree view items for the root node.
	 * @param element The tree element to get children for.
	 * @returns Tree element children or empty array.
	 */
  public async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (!this.treeItems) {
      this.treeItems = await this.buildTree();
    }

    if (element instanceof TreeViewItem) {
      return element.children;
    }

    if (!element) {
      if (this.treeItems) {
        return this.treeItems;
      }
    }
    return [];
  }

	/**
	 * Creates initial tree view items collection.
	 * @returns
	 */
  buildTree(): Promise<TreeViewItem[]> {
    return Promise.resolve([]);
  }
}
