import type { Editor } from "grapesjs";
import type { RemoteMessage } from "../types/studio";

export default function ApplyRemoteChange(editor: Editor, msg: RemoteMessage) {
  switch (msg.type) {
    case "add": 
      editor.Components.addComponent(msg.component);
      break;
    case "update": {
      const comp = editor.getWrapper()?.find(`#${msg.id}`)[0];
      comp && comp.set(msg.attributes);
      break;
    }
    case "remove": {
      const comp = editor.getWrapper()?.find(`#${msg.id}`)[0];
      comp && comp.remove();
      break;
    }
  }
}