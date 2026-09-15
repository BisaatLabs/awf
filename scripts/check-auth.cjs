const fs=require('fs'); const vm=require('vm'); const ts=require('typescript'); const assert=require('assert/strict');
const source=ts.transpileModule(fs.readFileSync('lib/supabase/ssr-client.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
async function check(user,role,error,expected){
 const client={auth:{getUser:async()=>({data:{user}})},from:()=>({select:()=>({eq:()=>({single:async()=>({data:role,error})})})})};
 const exports={};
 vm.runInNewContext(source,{exports,process:{env:{}},require:name=>name==='@supabase/ssr'?{createServerClient:()=>client}:name==='next/headers'?{cookies:async()=>({})}:{}});
 assert.equal(await exports.isAdminUser(),expected);
 if(expected)assert.equal(await exports.requireAdmin(),client);else await assert.rejects(()=>exports.requireAdmin(),/Administrator access required/);
}
(async()=>{await check(null,null,null,false);await check({id:'x'},null,null,false);await check({id:'x'},{role:'viewer'},null,false);await check({id:'x'},{role:'admin'},{message:'DB failed'},false);await check({id:'x'},{role:'admin'},null,true);console.log('5 admin authorization cases passed.');})().catch(e=>{console.error(e);process.exitCode=1});
