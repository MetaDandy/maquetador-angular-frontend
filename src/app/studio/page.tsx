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
import SaveProject from "./components/save_project";

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

  const handleSave = () => {
    setSheet({
      isOpen: true,
      title: `Guardar proyecto`,
      description: 'Ingrese los datos del proyecto',
      btnAction: null,
      btnCancel: null,
      content: <SaveProject />,
      side: "right"
    });
  }

  const onReady = (editor: Editor) => {
    setEditor(editor);
  };

  return (
    <main className="flex h-screen flex-col justify-between p-5 gap-2">
      <div className="p-1 flex gap-5">
        <Button onClick={() => handleExportAngular()} variant="ghost">
          Exportar a angular
        </Button>
        <Button onClick={() => handleExportXml()} variant="ghost">
          Exportar desde xml
        </Button>
        <Button onClick={() => handleImage()} variant="ghost">
          Subir imagen
        </Button>
        <Button onClick={() => handleSave()} variant="ghost">
          Guardar proyecto
        </Button>
      </div>
      <div className="flex-1 w-full h-full overflow-hidden">
        <GrapesJsStudio
          onReady={onReady}
          options={{
            licenseKey: `${process.env.NEXT_PUBLIC_GRAPJS_LICENSE}`,
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