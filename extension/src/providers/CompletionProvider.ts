import * as vscode from 'vscode';

export class DevPilotCompletionProvider implements vscode.InlineCompletionItemProvider {
    async provideInlineCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.InlineCompletionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.InlineCompletionItem[] | vscode.InlineCompletionList | undefined> {
        
        const prefix = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
        const suffix = document.getText(new vscode.Range(position, new vscode.Position(document.lineCount, 0)));

        try {
            const response = await fetch("http://127.0.0.1:8000/completion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    prefix: prefix, 
                    suffix: suffix, 
                    file_path: document.fileName 
                }),
            });

            if (!response.ok) return undefined;

            const data: any = await response.json();
            
            return [new vscode.InlineCompletionItem(data.completion)];
        } catch (e) {
            return undefined;
        }
    }
}
