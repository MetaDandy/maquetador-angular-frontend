import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ExportXmlToAngular } from '../utils/transform_xml_in_angular';
import Modal from '../../components/react/modal';

export default function ExportXmlToAngularModal() {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [isProcessing, setProcessing] = useState(false);
  const [projectName, setProjectName] = useState('grapesjs-angular-app');
  const [isOpen, setIsOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setXmlFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/xml': ['.xml'] },
    multiple: false,
  });

  const handleExport = async () => {
    if (!xmlFile) return;
    setProcessing(true);
    setTimeout(async () => {
      try {
        await ExportXmlToAngular(xmlFile);
        setIsOpen(false);
      } catch (err) {
        console.error(err);
        window.dispatchEvent(
          new CustomEvent('toast', {
            detail: {
              message: 'Error al generar Angular desde XML, inténtelo de nuevo más tarde.',
              variant: 'error'
            }
          })
        )
      } finally {
        setProcessing(false);
      }
    }, 0);
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={<button className="btn btn-soft">Exportar Angular desde XML</button>}
      title="Generar proyecto Angular desde XML"
    >
      <div className="space-y-4">
        <label className="block font-medium">Selecciona tu archivo XML:</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 text-center rounded cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
        >
          <input {...getInputProps()} />
          {xmlFile ? (
            <span>{xmlFile.name}</span>
          ) : isDragActive ? (
            <span>Suelta el archivo aquí...</span>
          ) : (
            <span>Arrastra tu XML aquí o haz clic para seleccionar</span>
          )}
        </div>

        <input
          type="text"
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Nombre del proyecto"
        />

        <button
          onClick={handleExport}
          className="btn btn-success w-full"
          disabled={!xmlFile || isProcessing}
        >
          {isProcessing
            ? <span className="loading loading-spinner" />
            : 'Generar Proyecto Angular'}
        </button>
      </div>
    </Modal>
  );
}
