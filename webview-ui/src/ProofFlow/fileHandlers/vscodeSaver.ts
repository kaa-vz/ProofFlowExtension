export { VSCodeSaver };
import { ProofFlow } from "../editor/ProofFlow";
import { vscode } from "../extension/vscode";
import { ProofFlowSaver } from "./proofFlowSaver";
import { AcceptedFileType } from "../parser/accepted-file-types";
class VSCodeSaver implements ProofFlowSaver {
  constructor() {

  }

  save(pf: ProofFlow): void {
    const result = pf.pfDocument.toString();
    vscode.postMessage({
      command: "saveFile",
      content: result,
      text: "Saving file...",
    });
  }

  syncPfDoc(pf: ProofFlow) {   
    sync(pf);
    addLoadListener(pf);
  }


}

function sync(pf: ProofFlow) {
  vscode.postMessage({
    command: "syncFile",
    content: pf.pfDocument.toString(),
    text: pf.fileName,
  });
  setTimeout(sync, 1000, pf);
  
}

function addLoadListener(pf: ProofFlow) {
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.command === "loadFile") {
      pf.openFile(message.content, message.text.split('.').pop() as AcceptedFileType);
    }
  });
}
