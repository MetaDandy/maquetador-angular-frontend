import { useCallback, useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import type { Editor } from "@grapesjs/studio-sdk/dist/typeConfigs/gjsExtend.js";
import Modal from "../../components/react/modal";
import { AIImageTransformer } from "../utils/ai_image_transformer";

export default function ExportFromImageModal({ editor }: { editor?: Editor }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    setGenerating(true);
    try {
      await AIImageTransformer(editor, imageFile);
      setIsOpen(false)
    } catch (err) {
      console.error(err);
      window.dispatchEvent(
        new CustomEvent('toast', {
          detail: {
            message: 'Error al generar la página, intentelo de nuevo mas tarde..',
            variant: 'warning'
          }
        })
      )
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={<button className="btn btn-soft">Crear página desde imagen</button>}
      title="Generar página desde imagen"
    >
      <div className="space-y-4">
        <label className="block font-medium">Selecciona una imagen (PNG/JPG):</label>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 text-center rounded cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
        >
          <input {...getInputProps()} />
          {previewUrl ? (
            <img src={previewUrl} alt="Vista previa" className="max-h-48 rounded-lg mx-auto" />
          ) : isDragActive ? (
            <span>Suelta la imagen aquí...</span>
          ) : (
            <span>Arrastra tu imagen aquí o haz clic para seleccionar</span>
          )}
        </div>

        <button
          onClick={handleGenerate}
          className="btn btn-success w-full"
          disabled={!imageFile || isGenerating}
        >
          {isGenerating ? (
            <span className="loading loading-spinner" />
          ) : (
            "Generar nueva página"
          )}
        </button>
      </div>
    </Modal>
  );
}
