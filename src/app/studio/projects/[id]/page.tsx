'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_ROUTES } from "@/lib/api.routes";
import "@grapesjs/studio-sdk/style";
import useAuthStore from "@/lib/auth.store";
import useAppStore from "@/lib/store";
import GrapesJsStudio from "@grapesjs/studio-sdk/react";
import { Editor } from "grapesjs";
import ExportFromImageModal from "../../components/image_to_code_modal";
import ExportToAngularModal from "../../components/export_to_angular_modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EditorPage() {
  const router = useRouter();
  const { token, hydrate  } = useAuthStore();
  const { id } = useParams();
  const { setSheet, showToast, setLockScreen } = useAppStore();
  const [editor, setEditor] = useState<Editor>();
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProject = async (id: string) => {
    const response = await fetch(`${API_ROUTES.PROJECT}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar el proyecto");
    }

    return response.json();
  };

  useEffect(() => {
    if (id && token) {
      fetchProject(id as string)
        .then((data) => {
          setProjectData(data.data);
          setIsLoading(false);

          const projectContent = data.data.content;
          localStorage.setItem('gjsProject', projectContent);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [id, token]);

  useEffect(()=>{
    hydrate()
    if (!token) router.push('/login')
  }, [])

  const updateProject = async () => {
    console.log("actualizando")
    const content = localStorage.getItem('gjsProject');
    const response = await fetch(`${API_ROUTES.PROJECT}/${projectData.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        content
      }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el proyecto");
    }

    return response.json();
  };

  const handleSave = async () => {
    if (editor) {
      setLockScreen({ isVisible: true, type: "loading", content: "Actualizando..." });

      try {
        const updatedProject = await updateProject();
        console.log("Proyecto actualizado:", updatedProject);
        showToast('Actualizacion exitosa', "Se guardaron los cambios correctamente.", "success");
      } catch (error: any) {
        showToast("Error al actualizar el proyecto:", error.message, "error");
        console.error("Error al guardar el proyecto:", error);
      } finally {
        setLockScreen(false);
      }
    }
  };


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

  const handleImage = () => {
    setSheet({
      isOpen: true,
      title: `Crear nueva página`,
      description: 'Ingrese el titulo de la página',
      btnAction: null,
      btnCancel: null,
      content: <ExportFromImageModal editor={editor} />,
      side: "bottom"
    });
  }

  const onReady = (editor: Editor) => {
    setEditor(editor);
  };


  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando proyecto...</div>;
  }

  return (
    <main className="flex h-screen flex-col justify-between p-5 gap-2">
      <div className="p-1 flex gap-5">
        <div className="font-bold">Editando: {projectData?.title}</div>
      </div>
      <div className="p-1 flex gap-5">
        <Button onClick={() => handleExportAngular()} variant="ghost">
          Exportar a angular
        </Button>
        <Button onClick={() => handleImage()} variant="ghost">
          Subir imagen
        </Button>
        <Button onClick={() => handleSave()} variant="ghost">
          Actializar Proyecto
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
