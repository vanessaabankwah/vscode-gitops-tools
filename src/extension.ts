import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {	
	let disposable = vscode.commands.registerCommand('gitops.hello', () => {
		vscode.window.showInformationMessage('Hello from GitOps!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
