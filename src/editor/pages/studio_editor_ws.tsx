import { type Editor } from "grapesjs";
import { useEffect, useRef, useState } from "react";
import GrapesJsStudio from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";
import ExportToAngularModal from "../components/export_in_angular_modal";
import ExportFromImageModal from "../components/image_to_code_modal";
import ExportXmlToAngularModal from "../components/xml_to_angular_modal";
import type { RemoteMessage } from "../types/studio";
import ApplyRemoteChange from "../utils/apply_remote_change";
import { debounce } from '../utils/debounce';

// ! TODO: Parsear los nombres de las hojas, que sea todo caracter ingles!!!!!!!
// ! no dejar - ñ

export default function StudioEditor() {
  const [editor, setEditor] = useState<Editor>();
  const wsRef = useRef<WebSocket | null>(null);
  const applyingRemote = useRef(false);
  // const { pageID } = useParams();
  const [pageID, setPageID] = useState<string | null>(null);
  console.log("pageID: ", pageID);

  useEffect(() => {
    const raw = window.location.hash;
    const segments = raw.slice(2).split('/');
    setPageID(segments[1] || null);
  }, []);

  useEffect(() => {
    if (!editor || !pageID) return;

    const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/${pageID}`);
    wsRef.current = ws;
    ws.onopen = () => console.log("Ws conectado a: ", pageID);
    ws.onerror = (e) => console.log("Ws error: ", e);
    ws.onclose = () => console.log("Ws desconectado");
    ws.onmessage = ev => {
      const msg = JSON.parse(ev.data) as RemoteMessage;
      applyingRemote.current = true;
      ApplyRemoteChange(editor, msg);
      applyingRemote.current = false;
    }

    return () => {
      ws.close();
      wsRef.current = null;
    }
  }, [editor, pageID])

  useEffect(() => {
    if (!editor || !pageID) return;
    const ws = wsRef.current;
    const wrapper = editor.DomComponents.getWrapper();

    // Sólo envía adds cuando el padre directo sea el wrapper
    const onAdd = (model: any) => {
      if (applyingRemote.current) return;
      if (model.parent() === wrapper) {
        ws?.send(JSON.stringify({ type: "add", component: model.toJSON() }));
      }
    };

    // Agrupa updates sucesivos en uno solo
    const debouncedUpdate = debounce((model: any) => {
      ws?.send(JSON.stringify({
        type: "update",
        id: model.get("id"),
        attributes: model.attributes,
      }));
    }, 200);

    const onUpdate = (model: any, opts: any) => {
      if (applyingRemote.current) return;
      if (opts.temporary) return;  // evita envíos intermedios
      debouncedUpdate(model);
    };

    // Sólo envía removes del nivel raíz
    const onRemove = (model: any) => {
      if (applyingRemote.current) return;
      if (model.parent() === wrapper) {
        ws?.send(JSON.stringify({ type: "remove", id: model.get("id") }));
      }
    };

    const onUpdateContent = (model: any) => {
      if (applyingRemote.current) return;
      ws?.send(JSON.stringify({
        // clientId: clientId.current,
        type: "update",
        id: model.get("id"),
        attributes: { content: model.get("content") },
      }));
    }

    editor.on("component:add", onAdd);
    editor.on("component:update", onUpdate);
    editor.on("component:remove", onRemove);
    editor.on("component:change:content", onUpdateContent);

    return () => {
      editor.off("component:add", onAdd);
      editor.off("component:update", onUpdate);
      editor.off("component:remove", onRemove);
      editor.off("component:change:content", onUpdateContent);
    };
  }, [editor])

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