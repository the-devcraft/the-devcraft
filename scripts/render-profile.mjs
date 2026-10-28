import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const config=JSON.parse(await fs.readFile(root+'profile.config.json','utf8'));
const pipeline=config.pipeline;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const icons={
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m17 7 5-5"/>',
  document:'<path d="M5 2h10l4 4v16H5zM14 2v5h5M8 11h8M8 15h8M8 19h5"/>',
  layers:'<path d="m2 8 10-6 10 6-10 6zM2 13l10 6 10-6M2 18l10 6 10-6"/>',
  code:'<path d="m7 5-6 7 6 7M17 5l6 7-6 7M14 3l-4 18"/>',
  branch:'<circle cx="6" cy="4" r="3"/><circle cx="18" cy="20" r="3"/><circle cx="6" cy="20" r="3"/><path d="M6 7v10M18 17v-5c0-5-12-1-12-5"/>',
  deploy:'<path d="M12 17V2M6 8l6-6 6 6M3 15v7h18v-7"/>',
  cycle:'<path d="M21 8a9 9 0 0 0-15-4L2 8M2 2v6h6M3 16a9 9 0 0 0 15 4l4-4M22 22v-6h-6"/>'
};
function text(value,max,label) { if(typeof value!=='string'||!value.trim()||value.length>max) throw new Error(`Invalid ${label}`); return esc(value); }
if(!pipeline || !Array.isArray(pipeline.stages)||pipeline.stages.length!==7) throw new Error('Pipeline requires seven stages');
const title=text(pipeline.title,45,'pipeline title');
const subtitle=text(pipeline.subtitle,90,'pipeline subtitle');
const positions=[[40,133],[307,133],[574,133],[841,133],[841,323],[440,323],[40,323]];
const cards=pipeline.stages.map((stage,index)=>{
  const label=text(stage.label,18,'stage label');
  const detail=text(stage.detail,32,'stage detail');
  if(!Object.hasOwn(icons,stage.icon)) throw new Error('Unknown stage icon');
  const [x,y]=positions[index];
  const accent=index%2===0?'#e8997c':'#ad9ce7';
  return `<g transform="translate(${x} ${y})"><text x="5" y="-13" fill="#8993aa" font-size="10" letter-spacing="1.4">${String(index+1).padStart(2,'0')} / ${label.toUpperCase()}</text><rect y="5" width="218" height="82" rx="14" fill="#060911" opacity=".8"/><rect width="218" height="82" rx="14" fill="url(#card)" stroke="${accent}" stroke-opacity=".65"/><path d="M15 1h188" stroke="#fff" stroke-opacity=".12"/><g transform="translate(17 25)" fill="none" stroke="${accent}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">${icons[stage.icon]}</g><text x="57" y="33" fill="#eceef7" font-size="18" font-weight="650">${label}</text><text x="57" y="55" fill="#a0a9bc" font-size="11">${detail}</text></g>`;
}).join('');
const paths='M258 174H307 M525 174H574 M792 174H841 M950 215V323 M841 364H658 M440 364H258';
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="490" viewBox="0 0 1100 490" role="img" aria-labelledby="title desc">
<title id="title">${title}</title><desc id="desc">${pipeline.stages.map(s=>esc(s.label+': '+s.detail)).join('. ')}. A continuous feedback loop.</desc>
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0b0f17"/><stop offset="1" stop-color="#111722"/></linearGradient><linearGradient id="card" x2="0" y2="1"><stop stop-color="#1c2331"/><stop offset="1" stop-color="#151b26"/></linearGradient><linearGradient id="signal"><stop stop-color="#e8997c"/><stop offset="1" stop-color="#ad9ce7"/></linearGradient></defs>
<style>.signal{stroke-dasharray:7 19;animation:signal 16s linear infinite}.return{stroke-dasharray:3 9;animation:signal 24s linear infinite}@keyframes signal{to{stroke-dashoffset:-208}}@media(prefers-reduced-motion:reduce){.signal,.return{animation:none}}</style>
<rect x="1" y="1" width="1098" height="488" rx="20" fill="url(#bg)" stroke="#30374a"/>
<g font-family="Segoe UI,Arial,sans-serif"><text x="40" y="49" fill="#f2f3fa" font-size="25" font-weight="650">${title}</text><text x="40" y="77" fill="#9aa6bd" font-size="14">${subtitle}</text><text x="1059" y="48" text-anchor="end" fill="#8d97b0" font-size="10" letter-spacing="1.6">THE DELIVERY LOOP</text>
<path d="${paths}" fill="none" stroke="#394154" stroke-width="2"/><path class="signal" d="${paths}" fill="none" stroke="url(#signal)" stroke-width="2"/>
<path class="return" d="M149 405V440H20V101H149V133" fill="none" stroke="#7b6b96" stroke-opacity=".45" stroke-width="1.4"/>
${cards}
<text x="550" y="467" text-anchor="middle" fill="#8996af" font-size="11" letter-spacing="1">FEEDBACK → BETTER DECISIONS → THE NEXT ITERATION</text></g></svg>\n`;
const output=root+'assets/delivery-pipeline.svg';
if(process.argv.includes('--check')) {
  if(await fs.readFile(output,'utf8')!==svg) throw new Error('Pipeline graphic is stale. Run node scripts/render-profile.mjs and commit the result.');
  console.log('Pipeline graphic matches configuration.');
} else {
  await fs.writeFile(output,svg);
  console.log('Rendered assets/delivery-pipeline.svg');
}
