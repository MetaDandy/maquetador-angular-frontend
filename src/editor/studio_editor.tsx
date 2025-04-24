import { type Editor } from "grapesjs";
import { useState } from "react";
import GrapesJsStudio from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";
import ExportToAngularModal from "./components/export_in_angular_modal";
import ExportFromImageModal from "./components/image_to_code_modal";
import ExportXmlToAngularModal from "./components/xml_to_angular_modal";

export default function StudioEditor() {
  const [editor, setEditor] = useState<Editor>();
  const onReady = (editor: Editor) => {
    setEditor(editor);
  };

  return (
    <main className="flex h-screen flex-col justify-between p-5 gap-2">
      <div className="p-1 flex gap-5">
        <div className="font-bold">Maquetador Angular</div>
        <ExportXmlToAngularModal />
        <ExportToAngularModal editor={editor} />
        <ExportFromImageModal editor={editor} />
      </div>
      <div className="flex-1 w-full h-full overflow-hidden">
        <GrapesJsStudio
          onReady={onReady}
          options={{
            licenseKey: "YOUR_LICENSE_KEY",
            project: {
              default: {
                pages: [
                  { name: "Home", component: `<h1>hola mundo</h1>` },
                ],
              },
            },
          }}
        />
      </div>
    </main>
  );
}