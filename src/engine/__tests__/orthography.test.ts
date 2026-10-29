import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// Foydalanuvchi ko'radigan barcha matnlar (satrlar va JSX matni): o‘/g‘ — U+2018, tutuq belgisi — U+2019.
// Izohlar tekshirilmaydi; 3D shader matni (GLSL faqat ASCII) istisno.
const ROOT = resolve(__dirname, '../..');
const SKIP = ['__tests__', 'Muscle3D.tsx'];
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (SKIP.some((s) => p.includes(s))) return [];
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) ? [p] : [];
  });

function texts(file: string): string[] {
  const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out: string[] = [];
  const visit = (n: ts.Node) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n) || ts.isJsxText(n)) out.push(n.text);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

describe('O‘zbek imlosi', () => {
  it('o‘ va g‘ to‘g‘ri belgi bilan, apostrof bilan emas', () => {
    const bad: string[] = [];
    for (const f of files(ROOT))
      for (const t of texts(f)) if (/(?<!Pr)[oOgG]['`ʼ](?=[a-zA-Z])|\b([YyTtBbSs]og)'/.test(t)) bad.push(`${f.replace(ROOT, 'src')}: ${t.slice(0, 80)}`);
    expect(bad).toEqual([]);
  });
});
