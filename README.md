# How to:

- Get most current ProofFlow source code from https://github.com/Moonlington/ProofFlow and copy it into "webview-ui" (perhaps replacing current code inside)
- Run "npm run build:webview" from the main extension folder (proofflowcode).
- Copy the HTML from "webview-ui/dist/index.html" into "src/panels/EditorPanel.ts" in the "html" variable
- Then adapt all file paths of the HTML and paste "${preset}" in front of it.
- Compile the extension with "npm run compile" from the main folder again.

You can now launch the extension with <F5>, and can then open a ProofFlow editor by running the command "ProofFlow: Open editor" in the VSCode terminal while the extension is active.

