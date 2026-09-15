require('dotenv').config({path:'.env.local',quiet:true});
const {createClient}=require('@supabase/supabase-js');
(async()=>{
 const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{persistSession:false}});
 for(const table of ['products','categories','product_images','user_roles']){
  const {count,error}=await db.from(table).select('*',{count:'exact',head:true});
  console.log(table+': '+(error?error.message:count+' public rows'));
 }
 const {data,error}=await db.from('products').select('id').eq('is_active',false);
 console.log('Inactive products hidden: '+(!error && data.length===0));
 const {data:images}=await db.from('product_images').select('secure_url').limit(3);
 for(const img of images||[]){if(!img.secure_url)continue;const u=new URL(img.secure_url);if(u.hostname!=='res.cloudinary.com')continue;const r=await fetch(u,{method:'HEAD'});console.log('Cloudinary sample image: HTTP '+r.status);}
})().catch(e=>{console.error(e.message);process.exitCode=1});
