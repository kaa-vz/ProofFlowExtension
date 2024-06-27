import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, workspace, commands } from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";

/**
 * This class manages the state and behavior of ProofFlow webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering ProofFlow webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class EditorPanel {
  public static currentPanel: EditorPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];
  private _pfDoc: string | undefined = undefined;
  private _fileName: string | undefined = undefined;

  /**
   * The EditorPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri, pfDoc: string | undefined = undefined, fileName: string | undefined = undefined) {
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(extensionUri), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);

    // Set the open file listerener
    this._setOpenFileListener();

    this._setViewListener();
    if (pfDoc !== undefined && fileName !== undefined) {
      this._panel.webview.postMessage({command: "loadFile", content: pfDoc, text: fileName});
    }
    
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: Uri) {
    if (EditorPanel.currentPanel) {
      // If the webview panel already exists reveal it
      console.log("Revealing panel");
      EditorPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      console.log("Creating panel");
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "showEditor",
        // Panel title
        "ProofFlow Editor",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
        }
      );
    
      EditorPanel.currentPanel = new EditorPanel(panel, extensionUri);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public async dispose(extensionUri: Uri) {
    const response = await window.showWarningMessage("Are you sure you want to close ProofFlow? (You may have unsaved changes)", {modal: true}, "Yes", "No");
    if (response === "No") {
      //this._panel.webview.postMessage({command: "windowClosed"});

      const panel = window.createWebviewPanel(
        "showEditor",
        "ProofFlow Editor",

        ViewColumn.One,
        {
          // Enable JavaScript in the webview
          enableScripts: true,
        });       
        EditorPanel.currentPanel = new EditorPanel(panel, extensionUri, this._pfDoc, this._fileName);
        //this._panel.webview.postMessage({command: "loadFile", content: this._pfDoc, text: this._fileName});
    } else {
      EditorPanel.currentPanel = undefined;

      // Dispose of the current webview panel
      this._panel.dispose();
  
      // Dispose of all disposables (i.e. commands) for the current webview panel
      while (this._disposables.length) {
        const disposable = this._disposables.pop();
        if (disposable) {
          disposable.dispose();
        }
      }
    }
   
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {

    const preset = getUri(webview, extensionUri, ["webview-ui", "dist"]);
    let html = /* PASTE HTML IN HERE */`<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/assets/ProofFlow_logo_rounded_rectacngle_wbackground-DOKaJZtG.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ProofFlow</title>
  <style id="dynamic-styles"></style>
  <script type="module" crossorigin src="/assets/index-5VQtafZS.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-CmsPUGgR.css">
</head>


<body>

</body>

</html>


`;
    const adaptedHtml = html.replaceAll('href="/assets/', `href="${preset}/assets/`).replaceAll('src="/assets/', `src="${preset}/assets/`);
    console.log(adaptedHtml);
    return adaptedHtml;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        const text = message.text;
        const content = message.content;
        switch (command) {
          case "saveFile":
            window.showInformationMessage(text);
            this.saveFile(content);
            return;
          case "syncFile":
            console.log("Synced: ", content);
            console.log("Filename: ", text);
            this._pfDoc = content;
            this._fileName = text;
            return;
        }
      },
      undefined,
      this._disposables
    );
  }

  async saveFile(content: string) {
    const uri = await window.showSaveDialog({
      saveLabel: 'Save File'
    });
    
    if (uri) {
      const encoder = new TextEncoder();
      const array = encoder.encode(content);
      await workspace.fs.writeFile(uri, array);
      window.showInformationMessage('File saved.');
    }
    }

  // Set up an event listener to listen for when a file is opened
  // and log the file content to the console
  private _setOpenFileListener() {
    console.log("Setting up open file listener...");
      workspace.onDidOpenTextDocument((document) => {
        console.log(document.getText);
        
      }, 
      undefined,
      this._disposables);
  }

  // Set up an event listener to listen for when the view state changes
  // a.k.a. for when the webview gets hidden or focused
  private _setViewListener() {
    this._panel.onDidChangeViewState((event) => {
      if (this._panel.visible) {
        this._panel.webview.postMessage({command: "loadFile", content: this._pfDoc, text: this._fileName});
      }
    });
  }
}





