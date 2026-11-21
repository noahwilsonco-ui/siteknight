import assert from 'node:assert/strict';
import worker from '../worker.mjs';
const base='https://siteknight.tools';
for(const [path,surface] of [
 ['/', 'home'],['/website-checker','checker'],['/tools/qr-code-generator','qr'],
 ['/tools/image-compressor','compressor'],['/tools/utm-builder','marketing'],
 ['/tools/pixel-tag-creator','marketing'],['/tools/file-converter','utilities'],
 ['/tools/digital-business-card','card']
]){
 const response=await worker.fetch(new Request(base+path),{});
 assert.equal(response.status,200,path);
 assert.match(response.headers.get('content-type'),/text\/html/,path);
 const html=await response.text();
 assert.ok(html.includes('data-sk-surface="'+surface+'"'),path+' theme marker');
 assert.ok(html.includes('--sk-purple:#7144aa'),path+' shared theme');
 assert.equal((html.match(/<style id="sk-site-2026">/g)||[]).length,1,path+' single theme injection');
}
const bulk=await worker.fetch(new Request(base+'/tools/bulk-qr-code-generator'),{});
assert.equal(bulk.status,302);
assert.ok(bulk.headers.get('location').endsWith('#bulk'));
console.log('Shared UI: all eight native HTML routes and bulk QR redirect passed.');
