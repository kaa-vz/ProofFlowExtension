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
