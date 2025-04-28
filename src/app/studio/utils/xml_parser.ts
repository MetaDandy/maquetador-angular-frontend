import { parseStringPromise } from 'xml2js';
import { stripPrefix } from 'xml2js/lib/processors';

export interface ParseModel {
  name: string;
  attribute: { name: string; type: string }[];
}

/**
 * parseModelXml
 * — Soporta XMI de Enterprise Architect y XML simples.
 */
export async function ParseModelXml(xml: string): Promise<ParseModel[]> {
  // 1) Parseamos quitando los prefijos UML: y xmi:
  const result: any = await parseStringPromise(xml, {
    tagNameProcessors: [stripPrefix],
    attrNameProcessors: [stripPrefix],
  });

  // 2) Recorrer todo el árbol para encontrar nodos 'Class'
  function findClasses(node: any): any[] {
    if (!node || typeof node !== 'object') return [];
    let out: any[] = [];
    for (const key of Object.keys(node)) {
      if (key === 'Class') {
        const arr = Array.isArray(node[key]) ? node[key] : [node[key]];
        out.push(...arr);
      } else if (typeof node[key] === 'object') {
        out.push(...findClasses(node[key]));
      }
    }
    return out;
  }

  // 3) Para cada ParseModel, buscar todos los nodos 'Attribute' (o 'attribute')
  function findAttributes(node: any): any[] {
    if (!node || typeof node !== 'object') return [];
    let out: any[] = [];
    for (const key of Object.keys(node)) {
      if (key === 'Attribute' || key === 'attribute') {
        const arr = Array.isArray(node[key]) ? node[key] : [node[key]];
        out.push(...arr);
      } else if (typeof node[key] === 'object') {
        out.push(...findAttributes(node[key]));
      }
    }
    return out;
  }

  // 4) Ejecutar
  const rawClasses = findClasses(result);

  const parsed: ParseModel[] = rawClasses
    .filter((c: any) => c.$?.name)
    .map((c: any) => {
      const attrsRaw = findAttributes(c);
      const attribute = attrsRaw.map((a: any) => ({
        name: a.$.name,
        type: a.$.type ?? 'text',
      }));
      return {
        name: c.$.name,
        attribute,
      };
    });

  return parsed;
}