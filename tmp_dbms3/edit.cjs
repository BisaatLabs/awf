const sharp = require('C:/Users/bilal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs = require('fs');
(async()=>{
 const gen='C:/Users/bilal/.codex/generated_images/01a13cd7-24bd-72b3-aabf-abf50c2898e9/exec-0fe724b7-6525-4ad9-983a-502005b9a425.png';
 const specs=[[2,112,9,70,10],[3,110,13,70,10],[4,110,13,70,10],[5,115,8,70,10],[6,115,8,70,10],[7,243,7,140,20],[8,120,5,70,10],[9,120,5,70,10],[10,117,11,70,10],[11,117,11,70,10],[12,118,10,70,10],[13,118,10,70,10],[16,116,7,70,10],[17,116,7,70,10],[18,117,11,70,10],[19,117,11,70,10],[20,114,3,70,10],[21,114,3,70,10]];
 fs.mkdirSync('tmp_dbms3/edited',{recursive:true});
 for(const [n,x,y,w,h] of specs){
  const pad=n===7?2:1;
  const patch=await sharp(gen).extract({left:300,top:21,width:194,height:33}).resize(w+pad*2,h+pad*2).png().toBuffer();
  await sharp(`tmp_dbms3/image${n}.png`).composite([{input:patch,left:x-pad,top:y-pad}]).png().toFile(`tmp_dbms3/edited/image${n}.png`);
 }
 const previews=[];
 for(let i=0;i<specs.length;i++){const [n]=specs[i];const b=await sharp(`tmp_dbms3/edited/image${n}.png`).extract({left:0,top:0,width:n===7?440:225,height:30}).resize(660,90).png().toBuffer();previews.push({input:b,left:0,top:i*95});}
 await sharp({create:{width:660,height:specs.length*95,channels:3,background:'#cccccc'}}).composite(previews).png().toFile('tmp_dbms3/edited_headers.png');
 console.log('Updated '+specs.length+' images');
})();
