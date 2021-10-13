import { ThemeIcon, TreeItemCollapsibleState, Uri } from 'vscode';
import { CommandId } from '../../commands';
import { DocumentationLink, documentationLinks } from '../documentationConfig';
import { TreeNode } from '../nodes/treeNode';
import { DataProvider } from './dataProvider';

/**
 * Defines data provider for Documentation tree view.
 */
export class DocumentationDataProvider extends DataProvider {

	/**
	 * Creates documentation tree view from documenation links config.
	 * @returns Documentation tree view items to display.
	 */
	buildTree(): Promise<TreeNode[]> {
		const treeNodes: TreeNode[] = [];

		for (const link of documentationLinks) {
			let treeNode = this.createLinkNode(link, false);
			treeNode.collapsibleState = TreeItemCollapsibleState.Expanded;
			treeNodes.push(treeNode);

			// add doc section links
			for (const childLink of link.links || []) {
				let childNode: TreeNode = this.createLinkNode(childLink);
				treeNode.addChild(childNode);
			}
		}

		return Promise.resolve(treeNodes);
	}

	/**
   * Creates link tree view item.
   * @param link Documentation Link with title and link url.
   * @param showLinkIcon Optionally set link node icon.
   * @returns Documentation Link tree view item.
   */
	private createLinkNode(link: DocumentationLink, showLinkIcon = true): TreeNode {
		let linkNode = new TreeNode(link.title);
		linkNode.tooltip = link.url;

		linkNode.command = {
			command: CommandId.VSCodeOpen,
			arguments: [Uri.parse(link.url)],
			title: 'Open link',
		};

		if (showLinkIcon) {
			linkNode.setIcon(new ThemeIcon('link-external'));
		}

		return linkNode;
	}
}
