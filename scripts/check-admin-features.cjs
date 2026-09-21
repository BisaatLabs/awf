const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
function load(path, mocks) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  vm.runInNewContext(code, {exports, require: name => name in mocks ? mocks[name] : require(name), process:{env:{NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:'test',CLOUDINARY_API_KEY:'test',CLOUDINARY_API_SECRET:'test'}}, File, Buffer, TextEncoder, FormData, URL, console});
  return exports;
}
const validation = load('lib/admin-security.ts', {});
const validPassword = {currentPassword:'old-password-123',newPassword:'new-password-456',confirmPassword:'new-password-456'};
async function main() {
  assert.equal(validation.passwordChangeSchema.safeParse(validPassword).success,true);
  for(const value of [ {...validPassword,confirmPassword:'mismatch'}, {...validPassword,newPassword:'short',confirmPassword:'short'}, {...validPassword,newPassword:validPassword.currentPassword,confirmPassword:validPassword.currentPassword} ]) assert.equal(validation.passwordChangeSchema.safeParse(value).success,false);
  const png=Buffer.from([137,80,78,71,13,10,26,10,0]);
  assert.doesNotThrow(()=>validation.validateImageBytes(png,'image/png'));
  assert.throws(()=>validation.validateImageBytes(Buffer.from('<svg/>'),'image/png'));
  assert.throws(()=>validation.validateImageBytes(Buffer.alloc(validation.MAX_IMAGE_BYTES+1),'image/png'));
  let allowed=true, uploads=0, fail=false;
  const upload = load('app/(admin)/admin/uploads.ts', {
    '@/lib/supabase/ssr-client':{requireAdmin:async()=>{if(!allowed)throw Error('denied');}},
    '@/lib/admin-security':validation,
    cloudinary:{v2:{uploader:{upload_stream:(options,callback)=>({end(bytes){uploads++;assert.equal(options.overwrite,false);assert.equal(options.resource_type,'image');callback(fail?Error('upstream'):null,fail?null:{secure_url:'https://res.cloudinary.com/test/image/upload/awf/products/test.png',public_id:'awf/products/test'});}})}}},
  });
  const form=new FormData();form.set('file',new File([png],'photo.png',{type:'image/png'}));
  allowed=false;assert.ok((await upload.uploadProductImage(form)).error);assert.equal(uploads,0);
  allowed=true;const bad=new FormData();bad.set('file',new File(['<script/>'],'photo.png',{type:'image/png'}));assert.ok((await upload.uploadProductImage(bad)).error);assert.equal(uploads,0);
  assert.equal((await upload.uploadProductImage(form)).image.cloudinary_public_id,'awf/products/test');
  fail=true;assert.ok((await upload.uploadProductImage(form)).error);
  let correct=true, updated=0, signedOut=0, weak=false;
  const passwords=load('app/(admin)/admin/settings/actions.ts',{
    '@/lib/admin-security':validation,
    '@/lib/supabase/ssr-client':{requireAdmin:async()=>{if(!allowed)throw Error('denied');return {auth:{getUser:async()=>({data:{user:{id:'admin',email:'admin@example.test'}}}),signOut:async()=>{signedOut++;return {error:null};}}};}},
    '@supabase/supabase-js':{createClient:()=>({auth:{signInWithPassword:async()=>({data:{user:correct?{id:'admin'}:null},error:correct?null:Error('wrong')}),updateUser:async(value)=>{updated++;assert.equal(value.current_password,validPassword.currentPassword);return {error:weak?{code:'weak_password'}:null};},signOut:async()=>({error:null})}})},
  });
  allowed=false;assert.ok((await passwords.changeAdminPassword(validPassword)).error);assert.equal(updated,0);
  allowed=true;correct=false;assert.ok((await passwords.changeAdminPassword(validPassword)).error);assert.equal(updated,0);
  correct=true;weak=true;assert.ok((await passwords.changeAdminPassword(validPassword)).error);assert.equal(signedOut,0);
  weak=false;assert.equal((await passwords.changeAdminPassword(validPassword)).success,true);assert.equal(signedOut,1);
  const writes=[];
  const chain = table => ({
    insert(rows){writes.push({table,rows});return this;},
    update(row){writes.push({table,row});return this;},
    select(){return this;},eq(){return this;},
    single:async()=>({data:{id:'11111111-1111-4111-8111-111111111111'},error:null}),
    then(resolve){return Promise.resolve({error:null}).then(resolve);},
    throwOnError:async()=>({error:null}),
  });
  const productValidation=load('lib/admin-validation.ts',{});
  const products=load('app/(admin)/admin/actions.ts',{
    '@/lib/supabase/ssr-client':{requireAdmin:async()=>({from:chain})},
    '@/lib/admin-validation':productValidation,
    'next/cache':{revalidatePath(){}},
  });
  const image={secure_url:'https://res.cloudinary.com/test/image/upload/awf/products/test.png',cloudinary_public_id:'awf/products/test',is_primary:true,sort_order:0};
  const product={name:'Test desk',sku:'',category_id:'',space:'',description:'',short_description:'',materials:[],finish:'',width_mm:'',depth_mm:'',height_mm:'',price_display:'',customizable:true,featured:false,is_active:false,images:[image]};
  assert.equal((await products.createProduct(product)).success,true);
  assert.equal(writes.find(w=>w.table==='product_images').rows[0].cloudinary_public_id,image.cloudinary_public_id);
  assert.equal(writes.find(w=>w.table==='product_images').rows[0].secure_url,image.secure_url);
  writes.length=0;
  assert.equal((await products.updateProduct('11111111-1111-4111-8111-111111111111',product)).success,true);
  assert.equal(writes.find(w=>w.table==='product_images').rows[0].product_id,'11111111-1111-4111-8111-111111111111');
  console.log('PASS: password validation, file validation, unauthorized upload/password actions, rejected files, Cloudinary success/failure, current password verification, policy failure, session revocation, and Supabase image persistence on product create/update.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});

