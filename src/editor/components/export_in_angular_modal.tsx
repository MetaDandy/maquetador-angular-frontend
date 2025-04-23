import { useState } from 'react';
import type { Editor } from 'grapesjs';
import { ExportToAngular } from '../utils/export_to_angular';
import Modal from '../../components/react/modal';

export default function ExportToAngularModal({ editor }: { editor?: Editor }) {
  const [projectName, setProjectName] = useState('grapesjs-angular-app');

  const handleExport = () => {
    if (!editor) return;
    ExportToAngular(editor, projectName);
  };

  return (
    <Modal
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
        >
          Generar Proyecto Angular
        </button>
      </div>
    </Modal>
  );
}
