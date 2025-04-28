import { useCallback, useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import type { Editor } from "@grapesjs/studio-sdk/dist/typeConfigs/gjsExtend.js";
import { AIImageTransformer } from "../utils/ai_image_transformer";
import useAppStore from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ExportFromImageModal({ editor }: { editor?: Editor }) {
  const { setLockScreen, showToast } = useAppStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageName, setPageName] = useState<string>("Pagina_generada");

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [imageFile]);

  const onDrop = useCallback((files: File[]) => {
    if (files.length) setImageFile(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleGenerate = async () => {
    if (!editor || !imageFile) return;
    setLockScreen({
      isVisible: true,
      type: 'loading',
      content: `Creando ${pageName}`
    });

    try {
      await AIImageTransformer(editor, imageFile, pageName);
      showToast("Creación exitosa", `Se creó ${pageName}`, "success");
    } catch (err) {
      console.error(err);
      showToast(
        'Error al generar la página, intentelo de nuevo mas tarde...',
        `Error: ${err}`,
        "error"
      );
    } finally {
      setLockScreen(false);
    }
  };

  return (
    <section className="space-y-4 mx-auto">
      <Label className="block font-medium">Selecciona una imagen (PNG/JPG):</Label>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 text-center rounded cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
      >
        <Input {...getInputProps()} />
        {previewUrl ? (
          <img src={previewUrl} alt="Vista previa" className="max-h-48 rounded-lg mx-auto" />
        ) : isDragActive ? (
          <span>Suelta la imagen aquí...</span>
        ) : (
          <span>Arrastra tu imagen aquí o haz clic para seleccionar</span>
        )}
      </div>

      <Input
        type="text"
        value={pageName}
        onChange={e => setPageName(e.target.value)}
        className="w-full"
      />

      <Button
        onClick={handleGenerate}
        className="btn btn-success w-full"
        disabled={!imageFile}
      >
        Generar una nueva página
      </Button>
    </section>
  );
}