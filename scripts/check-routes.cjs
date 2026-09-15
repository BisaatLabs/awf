const assert = require('node:assert/strict');
const paths=['/','/about','/products','/products/walnut-checkerboard-lattice-bed','/spaces','/spaces/home','/spaces/office','/spaces/corporate','/spaces/institutional','/spaces/school','/projects','/projects/quiet-workplace','/custom-furniture','/corporate','/contact','/admin/login'];
(async()=>{
 for(const path of paths){const r=await fetch('http://localhost:3100'+path);assert.equal(r.status,200,path);const html=await r.text();assert.equal((html.match(/<html(?:\s|>)/g)||[]).length,1,path+' document count');if(path==='/contact')assert.ok(html.includes('923333444300')); console.log('200 '+path);}
 const denied=await fetch('http://localhost:3100/admin',{redirect:'manual'});assert.equal(denied.status,307);assert.ok(denied.headers.get('location').includes('/admin/login'));console.log('PASS anonymous admin redirect');
 const missing=await fetch('http://localhost:3100/does-not-exist');assert.equal(missing.status,404);console.log('PASS 404');
})().catch(e=>{console.error(e.message);process.exitCode=1});
