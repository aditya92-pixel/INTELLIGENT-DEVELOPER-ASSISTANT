import * as vscode from "vscode";

export class ChatPanel {
    public static currentPanel: ChatPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel) {
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getWebviewContent();
        this._setWebviewMessageListener(this._panel.webview);
    }

    public static render() {
        if (ChatPanel.currentPanel) {
            ChatPanel.currentPanel._panel.reveal(vscode.ViewColumn.Two);
        } else {
            const panel = vscode.window.createWebviewPanel(
                "devpilotChat",
                "DevPilot AI",
                vscode.ViewColumn.Two,
                { enableScripts: true }
            );

            ChatPanel.currentPanel = new ChatPanel(panel);
        }
    }

    public dispose() {
        ChatPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(
            async (message: any) => {
                const command = message.command;
                const text = message.text;

                switch (command) {
                    case "chat":
                        await this._handleChat(text);
                        return;
                }
            },
            undefined,
            this._disposables
        );
    }

    private async _handleChat(text: string) {
        // Get active editor context
        const editor = vscode.window.activeTextEditor;
        let context = undefined;
        let filePath = undefined;
        if (editor) {
            context = editor.document.getText();
            filePath = editor.document.fileName;
        }

        try {
            // Send to backend
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, context, file_path: filePath }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errText}`);
            }

            const data = await response.json();
            
            // Send reply back to webview
            this._panel.webview.postMessage({
                command: "reply",
                text: (data as any).reply,
            });
        } catch (error: any) {
            vscode.window.showErrorMessage(`DevPilot Error: ${error.message}`);
            this._panel.webview.postMessage({
                command: "reply",
                text: `Error connecting to DevPilot backend: ${error.message}`,
            });
        }
    }

    private _getWebviewContent() {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>DevPilot AI Chat</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        color: var(--vscode-editor-foreground);
                        background-color: var(--vscode-editor-background);
                        padding: 10px;
                        display: flex;
                        flex-direction: column;
                        height: 100vh;
                        box-sizing: border-box;
                    }
                    #chat-history {
                        flex-grow: 1;
                        overflow-y: auto;
                        margin-bottom: 10px;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    .message {
                        padding: 8px 12px;
                        border-radius: 4px;
                        max-width: 85%;
                        word-wrap: break-word;
                    }
                    .user {
                        align-self: flex-end;
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                    }
                    .bot {
                        align-self: flex-start;
                        background-color: var(--vscode-editorWidget-background);
                        border: 1px solid var(--vscode-widget-border);
                    }
                    #input-container {
                        display: flex;
                        gap: 8px;
                        margin-bottom: 20px;
                    }
                    #chat-input {
                        flex-grow: 1;
                        padding: 8px;
                        background: var(--vscode-input-background);
                        color: var(--vscode-input-foreground);
                        border: 1px solid var(--vscode-input-border);
                        border-radius: 2px;
                    }
                    button {
                        padding: 8px 16px;
                        background: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        border-radius: 2px;
                        cursor: pointer;
                    }
                    button:hover {
                        background: var(--vscode-button-hoverBackground);
                    }
                </style>
            </head>
            <body>
                <div id="chat-history"></div>
                <div id="input-container">
                    <input type="text" id="chat-input" placeholder="Ask DevPilot (context is automatically attached)..." />
                    <button id="send-btn">Send</button>
                </div>
                
                <script>
                    const vscode = acquireVsCodeApi();
                    const history = document.getElementById('chat-history');
                    const input = document.getElementById('chat-input');
                    const btn = document.getElementById('send-btn');

                    function addMessage(text, sender) {
                        const msg = document.createElement('div');
                        msg.className = 'message ' + sender;
                        msg.innerText = text;
                        history.appendChild(msg);
                        history.scrollTop = history.scrollHeight;
                    }

                    btn.addEventListener('click', () => {
                        const text = input.value;
                        if (!text) return;
                        addMessage(text, 'user');
                        vscode.postMessage({ command: 'chat', text: text });
                        input.value = '';
                    });

                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            btn.click();
                        }
                    });

                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.command) {
                            case 'reply':
                                addMessage(message.text, 'bot');
                                break;
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }
}
