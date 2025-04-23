import { useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ParseModel } from '../utils/xml_parser';
import { ParseModelXml } from '../utils/xml_parser';

export function TransformXmlAngular() {
  const onSelectFile = useCallback(() => {
    const input = document.getElementById('xml-input') as HTMLInputElement | null;
    input?.click();
  }, []);

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const xml = await file.text();
      const clases: ParseModel[] = await ParseModelXml(xml);

      const zip = new JSZip();
      zip.file('model.json', JSON.stringify(clases, null, 2));

      const scriptContent = `#!/usr/bin/env node
/**
 * generate-from-model.js
 * Genera un proyecto Angular v19 con CRUDs
 * a partir de model.json.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appName = 'model-angular-app';
console.log('⚙️ ng new', appName);
execSync(\`npx @angular/cli@19 new \${appName} --routing --style=css --skip-install --defaults\`, { stdio: 'inherit' });

// Copiar model.json dentro del proyecto
fs.copyFileSync('model.json', \`\${appName}/model.json\`);

// Leer el modelo
const model = require(path.resolve('model.json'));

// Filtrar sólo clases válidas
const validClasses = model.filter(c => typeof c.nombre === 'string' && c.nombre.length);

validClasses.forEach(clase => {
  const kebab = clase.nombre.toLowerCase().replace(/[_\\s]+/g, '-');
  const className = clase.nombre
    .split(/[_\\s]+/g)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') + 'Component';

  console.log('🚀 Generando CRUD para', clase.nombre);
  execSync(\`npx ng generate component pages/\${kebab} --module=app.module.ts\`, {
    cwd: appName, stdio: 'inherit'
  });

  const pageDir = path.join(appName, 'src/app/pages', kebab);
  fs.mkdirSync(pageDir, { recursive: true });

  // TS
  const tsContent = \`import { Component } from '@angular/core';
@Component({
  selector: 'app-\${kebab}',
  templateUrl: './\${kebab}.component.html',
  styleUrls: ['./\${kebab}.component.css']
})
export class \${className} {
  model: any = { \${clase.atributos.map(a => \`\${a.nombre}: ''\`).join(', ')} };
  items: any[] = [];
  add() {
    this.items.push({ ...this.model });
    this.model = {};
  }
}\`;
  fs.writeFileSync(path.join(pageDir, \`\${kebab}.component.ts\`), tsContent, 'utf-8');

  // HTML
  const htmlContent = \`<h2>\${clase.nombre} CRUD</h2>
<form (ngSubmit)="add()">
  \${clase.atributos.map(a => \`<div class="field"><label>\${a.nombre}</label><input [(ngModel)]="model.\${a.nombre}" name="\${a.nombre}" /></div>\`).join('')}
  <button type="submit">Guardar</button>
</form>
<table>
  <thead><tr>\${clase.atributos.map(a => \`<th>\${a.nombre}</th>\`).join('')}</tr></thead>
  <tbody><tr *ngFor="let item of items">\${clase.atributos.map(a => \`<td>{{ item.\${a.nombre} }}</td>\`).join('')}</tr></tbody>
</table>\`;
  fs.writeFileSync(path.join(pageDir, \`\${kebab}.component.html\`), htmlContent, 'utf-8');

  // CSS
  const cssContent = \`.field { margin-bottom: 8px; }
table { width: 100%; border-collapse: collapse; margin-top: 16px; }
th, td { border: 1px solid #ccc; padding: 4px; }
button { margin-top: 8px; }\`;
  fs.writeFileSync(path.join(pageDir, \`\${kebab}.component.css\`), cssContent, 'utf-8');
});

// Generar rutas dinámicas con las clases filtradas
(() => {
  const imports = validClasses.map(clase => {
    const kebab = clase.nombre.toLowerCase().replace(/[_\\s]+/g, '-');
    const className = clase.nombre
      .split(/[_\\s]+/g)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('') + 'Component';
    return \`import { \${className} } from './pages/\${kebab}/\${kebab}.component';\`;
  }).join('\\n');

  const routes = validClasses.map((clase, i) => {
    const kebab = clase.nombre.toLowerCase().replace(/[_\\s]+/g, '-');
    const className = clase.nombre
      .split(/[_\\s]+/g)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('') + 'Component';
    const pathStr = i === 0 ? "''" : \`'\${kebab}'\`;
    return \`  { path: \${pathStr}, component: \${className} },\`;
  }).join('\\n');

  const routingModule = \`import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
\${imports}

const routes: Routes = [
\${routes}
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}\`;

  fs.writeFileSync(path.join(appName, 'src/app/app-routing.module.ts'), routingModule, 'utf-8');
  console.log('✅ Rutas generadas');
})();

// Sobreescribir app.component.html
(() => {
  const nav = validClasses.map((clase, i) => {
    const kebab = clase.nombre.toLowerCase().replace(/[_\\s]+/g, '-');
    const link = i === 0 ? '/' : '/' + kebab;
    return \`<a routerLink="\${link}">\${clase.nombre}</a>\`;
  }).join(' | ');

  const appHtml = \`<nav>\${nav}</nav><hr/><router-outlet></router-outlet>\`;
  fs.writeFileSync(path.join(appName, 'src/app/app.component.html'), appHtml, 'utf-8');
  console.log('✅ app.component.html actualizado');
})();

// Instalar dependencias y listo
console.log('📦 npm install');
execSync('npm install', { cwd: appName, stdio: 'inherit' });
console.log('🎉 ¡Listo! cd ' + appName + ' && npm start');
`;

      zip.file('generate-from-model.js', scriptContent, { unixPermissions: '755' });

      zip.file(
        'README.txt',
        `
# Generación Angular desde XML

1. Descomprime este ZIP.
2. Ejecuta:
   \`\`\`
   node generate-from-model.js
   \`\`\`
3. Entra en \`model-angular-app\` y haz:
   \`\`\`
   npm install
   npm start
   \`\`\`
`.trim()
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'model-angular-bootstrap.zip');
    } catch (err) {
      console.error('Error generando ZIP:', err);
    } finally {
      e.target.value = '';
    }
  }, []);

  return (
    <>
      <input
        id="xml-input"
        type="file"
        accept=".xml"
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
      <button
        onClick={onSelectFile}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Generar Angular desde XML
      </button>
    </>
  );
}