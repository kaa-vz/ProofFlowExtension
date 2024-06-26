# How to:
### You can now also install the extension the following way:
- Download the ".vsix" file and execute "code --install-extension proofflowcode-0.0.1.vsix"
- If the "Error loading webview: Error: Could not register service workers: TypeError: Failed to register a ServiceWorker for scope" occurs,
  follow the following steps:
    - Close VSCode
    - Go to the file explorer and to the path C:\Users\<user_name>\AppData\Roaming\Code and clear the contents of the folders Cache, CachedData, CachedExtensions, CachedExtensionVSIXs (if this folder exists) and Code Cache
    - Restart VSCode

- Launching the ProofFlow editor with the extension installed can be done by executing "ProofFlow: Open Editor" in the VSCode Command Panel

  
*To compile/build:*

- Get most current ProofFlow source code from https://github.com/Moonlington/ProofFlow and copy it into "webview-ui" (perhaps replacing current code inside)
- Run "npm run build:webview" from the main extension folder (proofflowcode).
- Copy the HTML from "webview-ui/dist/index.html" into "src/panels/EditorPanel.ts" in the "html" variable
- Compile the extension with "npm run compile" from the main folder again.

You can now launch the extension with F5, and can then open a ProofFlow editor by running the command "ProofFlow: Open editor" in the VSCode terminal while the extension is active.

