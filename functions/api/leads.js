const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
const clean=(v,max=200)=>String(v??"").trim().slice(0,max);
const hash=async value=>{const bytes=new TextEncoder().encode(value);const digest=await crypto.subtle.digest("SHA-256",bytes);return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,"0")).join("");};
export async function onRequestPost({request,env}) {
  if(!env.LEADS_DB)return json({ok:false,message:"Lead storage is not configured yet."},503);
  const origin=request.headers.get("Origin");
  const ownOrigin=new URL(request.url).origin;
  if(origin&&origin!==ownOrigin)return json({ok:false,message:"Origin not allowed."},403);
  if(Number(request.headers.get("content-length")||0)>12000)return json({ok:false,message:"Request too large."},413);
  let body;try{body=await request.json()}catch{return json({ok:false,message:"Invalid JSON."},400)}
  if(clean(body.website,160))return json({ok:true,message:"Thank you."});
  const name=clean(body.name,100),email=clean(body.email,160).toLowerCase(),business=clean(body.business,140);
  const services=Array.isArray(body.services)?body.services.map(x=>clean(x,60)).filter(Boolean).slice(0,5):[];
  const details=clean(body.details,4000),engagement=clean(body.engagement,60),budget=clean(body.budget,60),timeline=clean(body.timeline,60),source=clean(body.source||"website",80);
  if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!services.length||details.length<10)return json({ok:false,message:"Please provide a valid name, email, service and project description."},422);
  const ip=request.headers.get("CF-Connecting-IP")||"unknown";
  const key=await hash(ip+new Date().toISOString().slice(0,13));
  const recent=await env.LEADS_DB.prepare("SELECT count(*) AS n FROM lead_rate_limits WHERE bucket_key=? AND created_at >= datetime('now','-1 hour')").bind(key).first();
  if((recent?.n||0)>=5)return json({ok:false,message:"Please try again later or email us directly."},429);
  await env.LEADS_DB.prepare("INSERT INTO lead_rate_limits (bucket_key) VALUES (?)").bind(key).run();
  const id=crypto.randomUUID();
  await env.LEADS_DB.prepare("INSERT INTO leads (id,name,email,business,services,engagement,budget,timeline,details,source,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime('now'))")
    .bind(id,name,email,business,JSON.stringify(services),engagement,budget,timeline,details,source,"new").run();
  return json({ok:true,id,message:"Your enquiry has been received. QYBERLY will review the brief and reply by email."},201);
}
export async function onRequestGet({request,env}) {
  if(!env.LEADS_DB)return json({ok:false,message:"Lead storage is not configured."},503);
  const token=(request.headers.get("Authorization")||"").replace(/^Bearer\s+/i,"");
  if(!env.QYBERLY_ADMIN_TOKEN||token!==env.QYBERLY_ADMIN_TOKEN)return json({ok:false,message:"Unauthorised."},401);
  const url=new URL(request.url),limit=Math.min(100,Math.max(1,Number(url.searchParams.get("limit")||50)));
  const {results=[]}=await env.LEADS_DB.prepare("SELECT id,name,email,business,services,engagement,budget,timeline,details,source,status,created_at FROM leads ORDER BY created_at DESC LIMIT ?").bind(limit).all();
  return json({ok:true,leads:results});
}
