'use client';

import { type Editor } from "grapesjs";
import { useState } from "react";
import GrapesJsStudio from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";
import ExportXmlToAngularModal from "./components/xml_to_angular_modal";
import useAppStore from "@/lib/store";
import ExportToAngularModal from "./components/export_to_angular_modal";
import { Button } from "@/components/ui/button";
import ExportFromImageModal from "./components/image_to_code_modal";

// ! TODO: Parsear los nombres de las hojas, que sea todo caracter ingles!!!!!!!
// ! no dejar - ñ

export default function StudioEditor() {
  const { setSheet } = useAppStore();
  const [editor, setEditor] = useState<Editor>();

  const handleExportAngular = () => {
    setSheet({
      isOpen: true,
      title: `Exportar Proyecto`,
      description: 'Ingrese el titulo del proyecto a exportar',
      btnAction: null,
      btnCancel: null,
      content: <ExportToAngularModal editor={editor} />,
      side: "bottom"
    });
  }

  const handleExportXml = () => {
    setSheet({
      isOpen: true,
      title: `Exportar Proyecto`,
      description: 'Ingrese el titulo del proyecto a exportar',
      btnAction: null,
      btnCancel: null,
      content: <ExportXmlToAngularModal />,
      side: "bottom"
    });
  }

  const handleImage = () => {
    setSheet({
      isOpen: true,
      title: `Crear nueva página`,
      description: 'Ingrese el titulo de la página',
      btnAction: null,
      btnCancel: null,
      content: <ExportFromImageModal />,
      side: "bottom"
    });
  }

  const onReady = (editor: Editor) => {
    setEditor(editor);
  };

  return (
    <main className="flex h-screen flex-col justify-between p-5 gap-2">
      <div className="p-1 flex gap-5">
        <div className="font-bold">Maquetador Angular</div>
        <Button onClick={() => handleExportAngular()} variant="ghost">
          Exportar a angular
        </Button>
        <Button onClick={() => handleExportXml()} variant="ghost">
          Exportar desde xml
        </Button>
        <Button onClick={() => handleImage()} variant="ghost">
          Subir imagen
        </Button>
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