// alt-specs.ts → alt.json (alt.mjs uchun)
import { writeFileSync } from 'node:fs';
import { ALT, ALT_TEXT_ONLY } from './alt-specs';

writeFileSync('scripts/images/alt.json', JSON.stringify({ alt: ALT, textOnly: ALT_TEXT_ONLY }, null, 2));
console.log(Object.keys(ALT).length, 'ta ikkinchi holat');
