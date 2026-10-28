import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const readme=await fs.readFile(root+'README.md','utf8');
const references=[...readme.matchAll(/src="(assets\/[^"?#]+)"/g)].map(match=>match[1]);
if (!references.length) throw new Error('README has no profile graphics');
for (const reference of new Set(references)) {
  if (reference.includes('..')) throw new Error('Asset paths must stay in assets/');
  const content=await fs.readFile(root+reference,'utf8');
  if (!content.trimStart().startsWith('<svg') || !content.trimEnd().endsWith('</svg>')) throw new Error(`Invalid SVG asset: ${reference}`);
  if (!/<title[\s>]/.test(content) || !/<desc[\s>]/.test(content)) throw new Error(`Accessible title or description missing: ${reference}`);
  if (/<script[\s>]/i.test(content)) throw new Error(`Executable script found in ${reference}`);
}
console.log(`Validated ${new Set(references).size} profile graphics and README asset references.`);
