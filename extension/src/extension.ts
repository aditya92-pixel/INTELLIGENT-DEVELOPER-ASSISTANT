import * as vscode from 'vscode';
import { ChatPanel } from './panels/ChatPanel';
import { DevPilotCompletionProvider } from './providers/CompletionProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "devpilot-ai" is now active!');

    // Start Chat Command
    let startDisposable = vscode.commands.registerCommand('devpilot.start', () => {
        ChatPanel.render();
    });

    // Explain Code Command
    let explainDisposable = vscode.commands.registerCommand('devpilot.explainCode', () => {
        ChatPanel.render();
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.document.getText(editor.selection);
            // In a real impl, we'd send a message directly to the ChatPanel here
        }
    });

    // Fix Error Command
    let fixDisposable = vscode.commands.registerCommand('devpilot.fixError', () => {
        ChatPanel.render();
        // In a real impl, we'd grab terminal context here
    });

    // Inline Completion Provider
    const provider = new DevPilotCompletionProvider();
    let completionDisposable = vscode.languages.registerInlineCompletionItemProvider(
        { pattern: '**' }, provider
    );

    context.subscriptions.push(startDisposable, explainDisposable, fixDisposable, completionDisposable);
}

export function deactivate() {}
