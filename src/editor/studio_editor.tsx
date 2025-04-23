import type { Editor } from "grapesjs";
import { useState } from "react";
import GrapesJsStudio from "@grapesjs/studio-sdk/react";
import { ExportInAngular } from "./components/export_in_angular";
import { TransformXmlAngular } from "./components/transform_xml_in_angular";

export default function StudioEditor() {
  const [editor, setEditor] = useState<Editor>();

  const onReady = (editor: Editor) => {
    setEditor(editor);
  };

  return (
    <main className="flex h-screen flex-col justify-between p-5 gap-2">
      <div className="p-1 flex gap-5">
        <div className="font-bold">SDK example Astro</div>
        <TransformXmlAngular />
        <ExportInAngular editor={editor} />
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