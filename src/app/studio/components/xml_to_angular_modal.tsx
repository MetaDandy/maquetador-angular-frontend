import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAppStore from '@/lib/store';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ExportXmlToAngular } from '../utils/transform_xml_in_angular';

export default function ExportXmlToAngularModal() {
  const { setLockScreen, showToast } = useAppStore();
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('grapesjs-angular-app');

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
    setLockScreen({
      isVisible: true,
      type: 'loading',
      content: `Exportando ${projectName}`
    });
    setTimeout(async () => {
      try {
        await ExportXmlToAngular(xmlFile);
        showToast("Exportación exitosa", `Se exportó ${projectName}`, "success");
      } catch (err) {
        console.error(err);
        showToast(
          'Error al generar Angular desde XML, inténtelo de nuevo más tarde.',
          `Error: ${err}`,
          "error"
        );
      } finally {
        setLockScreen(false);
      }
    }, 0);
  };

  return (

    <section className="mx-auto space-y-4">
      <label className="block font-medium">Selecciona tu archivo XML:</label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 text-center rounded cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
      >
        <Input {...getInputProps()} />
        {xmlFile ? (
          <span>{xmlFile.name}</span>
        ) : isDragActive ? (
          <span>Suelta el archivo aquí...</span>
        ) : (
          <span>Arrastra tu XML aquí o haz clic para seleccionar</span>
        )}
      </div>

      <Input
        type="text"
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
        className="input input-bordered w-full"
        placeholder="Nombre del proyecto"
      />

      <Button
        onClick={handleExport}
        className="btn btn-success w-full"
        disabled={!xmlFile}
      >
        Exportar a angular
      </Button>
    </section>
  );
}