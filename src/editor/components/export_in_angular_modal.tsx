import { useState } from 'react';
import type { Editor } from '@grapesjs/studio-sdk/dist/typeConfigs/gjsExtend.js';
import { ExportToAngular } from '../utils/export_to_angular';
import Modal from '../../components/react/modal';

export default function ExportToAngularModal({ editor }: { editor?: Editor }) {
  const [projectName, setProjectName] = useState('grapesjs-angular-app');
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  const handleExport = async () => {
    if (!editor) return;
    setIsProcessing(true);
    setTimeout(async () => {
      try {
        await ExportToAngular(editor, projectName);
        setIsOpen(false);
      } catch (err) {
        console.error(err);
        window.dispatchEvent(
          new CustomEvent('toast', {
            detail: {
              message: 'Error al generar el proyecto Angular, inténtelo de nuevo mas tarde.',
              variant: 'error'
            }
          })
        )
      } finally {
        setIsProcessing(false);
      }
    }, 0);
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={<button className="btn btn-soft">Exportar a Angular</button>}
      title="Nombre del proyecto"
    >
      <div className="space-y-4">
        <label className="block font-medium">Proyecto:</label>
        <input
          type="text"
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
          className="input input-bordered w-full"
        />
        <button
          onClick={handleExport}
          className="btn btn-success w-full"
          disabled={isProcessing}
        >
          {isProcessing
            ? <span className="loading loading-spinner" />
            : 'Generar Proyecto Angular'}
        </button>
      </div>
    </Modal>
  );
}
