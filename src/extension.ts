import { ExtensionContext } from 'vscode';
import { setExtensionContext } from './extensionContext';
import { registerCommands } from './commands';
import { checkPrerequisites, promptToInstallFlux } from './install';
import { statusBar } from './statusBar';
import { createTreeViews } from './views/treeViews';

/**
 * Activates GitOps extension.
 * @param context VSCode extension context.
 */
export function activate(context: ExtensionContext) {

	// Keep a reference to the extension context
	setExtensionContext(context);

	// initialize gitops status bar
	context.subscriptions.push(statusBar.statusBarItem);

	// create gitops tree views
	createTreeViews();

	// register gitops commands
	registerCommands(context);

	// show error notification if flux is not installed
	promptToInstallFlux();

	// run Flux prerequisites check
	checkPrerequisites();
}

export function deactivate() {}
