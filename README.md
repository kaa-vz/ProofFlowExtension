# ProofFlowExtension
SEP Group 12 - 2024 - ProofFlow

## Introduction
**ProofFlowExtension** is ProofFlow as a VS Code extension.

## How to install ProofFlow as a VS Code extension:

Clone the repository for ProofFlow VSCode version: The repository for ProofFlow VS Code version
   can be cloned by running the following command:
```
git clone https://github.com/kaa-vz/ProofFlowExtension.git
```
Navigate to the directory: To navigate to the directory run the following command:
```
cd ProofFlowExtension
```
Install dependencies To install the node dependencies of ProofFlow the following command must be
   run: 
```
npm install
```
Build ProofFlow VSCode Copy the most recent ProofFlow source code from
   https://github.com/Moonlington/ProofFlow and paste it into the directory ”webview-ui”.
   Next run the following command;
```
npm run build:webview
 ```
Afterwards, copy the HTML from `webview-
   ui/dist/index.html` into `src/panels/EditorPanel.ts` in the HTML variable. 

Finally compile the extension with
   the command:
```
npm run compile 
```
Packaging it into an extension: To package it into an extension run vsce package . This will
   package the extension into a .vsix file.

Running VS Code extension
The ProofFlow VS Code version can be installed using the .vsix file that was created by the build procedure.
This can be done in the following way.
Open the extension tab inside VS Code.
Open the menu with three horizontal dots on the top right of the extension tab.
Select ”Install from VSIX...”.
Select the correct .vsix file.
It can also be installed by running the following command inside a terminal:
code --install-extension <path-to-vsix-file>

After ProofFlow VS Code version has been installed the editor can be opened inside VS Code by pressingCtrl+Shift+P and running the command ProofFlow: Open editor .

## Files to be checked for Code Quality Assesment:
Only `src/panels/EditorPanel.ts` and `src/extension.ts` need to be checked, since everything else is either copied from the main ProofFlow repository or is standard Visual Studio Code code or packages.
