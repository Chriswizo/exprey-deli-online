const byId = (id) => document.getElementById(id);
const supabaseReady = () => window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL && window.APP_CONFIG.SUPABASE_ANON_KEY && window.supabase;
let db = null;
function getDb(){ if(!db && supabaseReady()) db = window.supabase.createClient(window.APP_CONFIG.SUPABASE_URL, window.APP_CONFIG.SUPABASE_ANON_KEY); return db; }
byId('year').textContent = new Date().getFullYear();
byId('menuToggle').addEventListener('click',()=>byId('nav').classList.toggle('open'));
byId('nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>byId('nav').classList.remove('open')));
const demoShipments = [
 {tracking_number:'ED-100024',recipient:'Sample Customer',origin:'New York, NY',destination:'Boston, MA',status:'In Transit',estimated_delivery:'2026-10-12',updated_at:new Date().toISOString(),notes:'Shipment is moving between facilities.',events:[{status:'Shipment created',at:'2026-10-08 09:00'},{status:'Picked up',at:'2026-10-08 12:30'},{status:'In Transit',at:'2026-10-09 08:15'}]},
 {tracking_number:'ED-100025',recipient:'Sample Recipient',origin:'Chicago, IL',destination:'Detroit, MI',status:'Preparing',estimated_delivery:'2026-10-13',updated_at:new Date().toISOString(),notes:'Shipment is being prepared.',events:[{status:'Shipment created',at:'2026-10-09 10:00'}]}
];
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
async function findShipment(number){
 const client=getDb();
 if(client){const {data,error}=await client.from('shipments').select('*').eq('tracking_number',number).maybeSingle();if(error)throw error;return data;}
 return demoShipments.find(s=>s.tracking_number.toLowerCase()===number.toLowerCase())||null;
}
byId('trackForm').addEventListener('submit',async e=>{
 e.preventDefault(); const num=byId('trackingNumber').value.trim();const out=byId('trackingResult');
 out.innerHTML='<div class="notice">Looking up shipment…</div>';
 try{
  const s=await findShipment(num);
  if(!s){out.innerHTML='<div class="notice error">No shipment found for that tracking number. Please check the number or contact your delivery provider.</div>';return;}
  const events=Array.isArray(s.events)?s.events:[];
  out.innerHTML=`<div class="tracking-result"><h3>Shipment ${escapeHtml(s.tracking_number)}</h3><span class="status-pill">${escapeHtml(s.status)}</span><p><b>From:</b> ${escapeHtml(s.origin||'Not provided')}<br><b>To:</b> ${escapeHtml(s.destination||'Not provided')}<br><b>Estimated delivery:</b> ${escapeHtml(s.estimated_delivery||'Not available')}</p><p>${escapeHtml(s.notes||'')}</p><b>Tracking history</b><ul class="timeline">${events.length?events.map(ev=>`<li>${escapeHtml(ev.status||'Update')}<small>${escapeHtml(ev.at||'')}</small></li>`).join(''):'<li>Tracking history has not been added yet.</li>'}</ul></div>`;
 }catch(err){out.innerHTML='<div class="notice error">Tracking is temporarily unavailable. Please try again later.</div>';console.error(err);}
});
byId('quoteForm').addEventListener('submit',e=>{
 e.preventDefault();const f=new FormData(e.currentTarget);const email=window.APP_CONFIG?.CONTACT_EMAIL||'';
 if(!email||email.includes('replace-with-your-business-email')){byId('quoteMessage').textContent='Demo only: set CONTACT_EMAIL in config.js before using this form.';return;}
 const subject=encodeURIComponent('Exprey Deli Online quote request — '+f.get('service'));
 const body=encodeURIComponent(`Name: ${f.get('name')}\nEmail: ${f.get('email')}\nService: ${f.get('service')}\nDetails: ${f.get('details')}`);
 window.location.href=`mailto:${email}?subject=${subject}&body=${body}`;
});