import JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import type { ParseModel } from './xml_parser';
import { ParseModelXml } from './xml_parser';

/**
 * Genera un ZIP con:
 *   • model.json            (modelo parseado)
 *   • generate-from-model.js (script que crea el proyecto Angular v19)
 *   • README.txt             (instrucciones)
 *
 * @param xmlFile      Archivo XML seleccionado por el usuario
 * @param projectName  Nombre del proyecto Angular que se creará (default: model-angular-app)
 */
export async function ExportXmlToAngular(
  xmlFile: File,
  projectName = 'model-angular-app',
) {
  if (!xmlFile) return;
  const xmlText = await xmlFile.text();
  const clases: ParseModel[] = await ParseModelXml(xmlText);

  const zip = new JSZip();
  zip.file('model.json', JSON.stringify(clases, null, 2));

  const script = `#!/usr/bin/env node
/**
 * generate-from-model.js
 * Genera un proyecto Angular v19 a partir de model.json
 */
const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

const appName = path.basename(__filename, '.js');
if (!appName) {
  console.error("Error: El nombre del proyecto no puede ser vacío.");
  process.exit(1);  // Salir si no se puede obtener el nombre
}

console.log('⚙️  ng new', appName);
execSync(\`npx @angular/cli@19 new \${appName} --routing --style=css --skip-install --defaults\`, { stdio: 'inherit' });

// Copiar model.json dentro del proyecto
fs.copyFileSync('model.json', \`\${appName}/model.json\`);

// Leer el modelo
const model = require(path.resolve('model.json'));
const valid = model;

// ---------- CRUD + Rutas dinámicas ----------
valid.forEach(clase => {
  const kebab = clase.name.toLowerCase().replace(/[_\\s]+/g, '-');
  const className = clase.name
    .split(/[_\\s]+/g)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') + 'Component';

  console.log('🚀 Generando CRUD para', clase.name);
  execSync(\`npx ng generate component pages/\${kebab} --module=app.module.ts\`, {
    cwd: appName, stdio: 'inherit'
  });

  const pageDir = path.join(appName, 'src/app/pages', kebab);
  fs.mkdirSync(pageDir, { recursive: true });

  // TS
  fs.writeFileSync(
    path.join(pageDir, \`\${kebab}.component.ts\`),
    \`import { Component } from '@angular/core';
@Component({
  selector: 'app-\${kebab}',
  templateUrl: './\${kebab}.component.html',
  styleUrls: ['./\${kebab}.component.css']
})
export class \${className} {
  model: any = { \${clase.attribute.map(a => \`\${a.name}: ''\`).join(', ')} };
  items: any[] = [];
  add() { this.items.push({ ...this.model }); this.model = {}; }
}\`,
    'utf-8'
  );

  // HTML
  fs.writeFileSync(
    path.join(pageDir, \`\${kebab}.component.html\`),
    \`<h2>\${clase.name} CRUD</h2>
<form (ngSubmit)="add()">
  \${clase.attribute.map(a => \`<div class="field"><label>\${a.name}</label><input [(ngModel)]="model.\${a.name}" name="\${a.name}" /></div>\`).join('')}
  <button type="submit">Guardar</button>
</form>
<table>
  <thead><tr>\${clase.attribute.map(a => \`<th>\${a.name}</th>\`).join('')}</tr></thead>
  <tbody><tr *ngFor="let item of items">\${clase.attribute.map(a => \`<td>{{ item.\${a.name} }}</td>\`).join('')}</tr></tbody>
</table>\`,
    'utf-8'
  );

  // CSS
  fs.writeFileSync(
    path.join(pageDir, \`\${kebab}.component.css\`),
    \`.field{margin-bottom:8px;} table{width:100%;border-collapse:collapse;margin-top:16px;} th,td{border:1px solid #ccc;padding:4px;} button{margin-top:8px;}\`,
    'utf-8'
  );
});

// ---------- Rutas ----------
(() => {
  const imports = valid
    .map(c => {
      const kebab = c.name.toLowerCase().replace(/[_\s]+/g, '-');
      const className =
        c.name
          .split(/[_\s]+/g)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join('') + 'Component';
      return \`import { \${className} } from './pages/\${kebab}/\${kebab}.component';\`;
  }).join('\\n');

  const routes = valid
    .map((c, i) => {
      const kebab = c.name.toLowerCase().replace(/[_\s]+/g, '-');
      const className =
        c.name
          .split(/[_\s]+/g)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join('') + 'Component';
      const pathStr = i===0?"''":\`'\${kebab}'\`;
      return \`  { path: \${pathStr}, component: \${className} },\`;
  }).join('\\n');

  const fileContent = \`// ⚠️ Archivo generado automáticamente — NO editar a mano
\${imports}

export const routes = [
\${routes}
  { path: '**', redirectTo: '' }   // Fallback
];
\`;

  fs.writeFileSync(
    path.join(appName, 'src/app/app.routes.ts'),
    fileContent,
    'utf-8',
  );
  console.log('✅ app.routes.ts generado (stand-alone)');
})();

// ---------- app.component ----------
(() => {
  /* ---- Navegación dinámica ---- */
  const nav = valid
    .map((c, i) => {
      const kebab = c.name.toLowerCase().replace(/[_\s]+/g, '-');
      const link = i === 0 ? '/' : '/' + kebab;
      return \`<a routerLink="\${link}">\${c.name}</a>\`;
    })
    .join(' | ');

  /* ---- HTML ---- */
  const appHtml = \`<nav>\${nav}</nav>
<hr/>
<router-outlet></router-outlet>\`;

  /* ---- TS (stand-alone) ---- */
  const appTs = \`
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],      // Habilita <router-outlet>, routerLink, etc.
  templateUrl: './app.component.html',
})
export class AppComponent {}
\`.trimStart();

  /* ---- Escritura en disco ---- */
  fs.writeFileSync(
    path.join(appName, 'src/app/app.component.html'),
    appHtml,
    'utf-8'
  );
  fs.writeFileSync(
    path.join(appName, 'src/app/app.component.ts'),
    appTs,
    'utf-8'
  );

  console.log('✅ app.component.html y app.component.ts actualizados');
})();

// ---------- Dependencias ----------
console.log('📦 npm install');
execSync('npm install', { cwd: appName, stdio: 'inherit' });
console.log('🎉 ¡Listo! cd ' + appName + ' && npm start');
`;

  zip.file(`${projectName}.js`, script, { unixPermissions: '755' });

  zip.file(
    'README.txt',
    `
# Instrucciones de generación

1. Descomprime este ZIP.
2. Abre terminal en la carpeta resultante.
3. Ejecuta:
   \`\`\`
   node \`\${projectName}.js\`
   \`\`\`
4. Entra en la carpeta creada:
   \`\`\`
   cd \`\${projectName}\`
   npm start
   \`\`\`

> **Requisitos**: Node.js y conexión a Internet.
`.trim(),
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  FileSaver.saveAs(blob, `${projectName}-bootstrap.zip`);
}