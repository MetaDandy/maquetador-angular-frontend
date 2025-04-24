import { useEffect, useState } from "react";
import type { Editor } from "@grapesjs/studio-sdk/dist/typeConfigs/gjsExtend.js";
import Modal from "../../components/react/modal";
import { AIImageTransformer } from "../utils/ai_image_transformer";

export default function ExportFromImageModal({ editor }: { editor?: Editor }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setGenerating] = useState(false);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [imageFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const handleGenerate = async () => {
    if (!editor || !imageFile) return;
    setGenerating(true);
    try {
      console.log("entro")
      await AIImageTransformer(editor, imageFile);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Modal
      trigger={<button className="btn btn-soft">Crear página desde imagen</button>}
      title="Generar página desde imagen"
    >
      <div className="space-y-4">
        <label className="block font-medium">Selecciona una imagen (PNG/JPG):</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full"
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Vista previa"
            className="max-h-48 rounded-lg mx-auto"
          />
        )}

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
