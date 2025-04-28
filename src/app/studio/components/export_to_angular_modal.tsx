import { useState } from 'react';
import type { Editor } from '@grapesjs/studio-sdk/dist/typeConfigs/gjsExtend.js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useAppStore from '@/lib/store';
import { ExportToAngular } from '../utils/export_to_angular';

export default function ExportToAngularModal({ editor }: { editor?: Editor }) {
  const { setLockScreen, showToast } = useAppStore();
  const [projectName, setProjectName] = useState('grapesjs-angular-app');


  const handleExport = async () => {
    if (!editor) return;
    setLockScreen({
      isVisible: true,
      type: 'loading',
      content: `Exportando ${projectName}`
    });
    
    setTimeout(async () => {
      try {
        await ExportToAngular(editor, projectName, showToast);
        showToast("Exportación exitosa", `Se exportó ${projectName}`, "success");
      } catch (err) {
        console.error(err);
        showToast(
          'Fallo al exportar.',
          `Error: ${err}`,
          "error"
        );
      } finally {
        setLockScreen(false);
      }
    }, 0);
  };

  return (
    <section className="mx-auto space-y-5">
      <Label className="">Nombre del proyecto a exportar:</Label>
      <Input
        type="text"
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
        className="w-full"
      />
      <Button
        onClick={handleExport}
        className="btn btn-success w-full"
      >
        Exportar
      </Button>
    </section>
  );
}