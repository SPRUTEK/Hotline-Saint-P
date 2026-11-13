// офлайн-кэш Hotline Saint-P
const VER='2611131757',CORE='hsp-core-'+VER,MUS='hsp-music';
const FILES=["./","index.html","manifest.webmanifest","armor.js","arsenal.js","busts.js","cars.js","catpet.js","cine.js","cine6.js","cinebg.js","cinebg2.js","cinebg3.js","cinecars.js","cinekit.js","cineshots.js","collections.js","combo.js","diff.js","dolls.js","furn.js","hdside.js","hm.js","hq.js","icons.js","items.js","keep.js","kit56.js","level1.js","level10.js","level2.js","level3.js","level4.js","level5.js","level6.js","level7.js","level8.js","level9.js","maps.js","menu.js","menuart.js","minigames.js","missions.js","music2.js","neon.js","offline.js","rewards.js","routes.js","save.js","settings.js","skins.js","skipdlg.js","slides.js","sniper.js","sortie.js","tweaks0411.js","upgrade.js","voicerec.js","voices.js","zombies2.js","apple-touch-icon.png","dusha_home.png","icon-192.png","icon-512.png","icons_sheet.png","items_sheet.png","weapon_skins_hands.png","weapon_skins_icons.png","photos/p1.png","photos/p10.png","photos/p11.png","photos/p12.png","photos/p13.png","photos/p14.png","photos/p15.png","photos/p16.png","photos/p17.png","photos/p18.png","photos/p19.png","photos/p2.png","photos/p20.png","photos/p21.png","photos/p3.png","photos/p4.png","photos/p5.png","photos/p6.png","photos/p7.png","photos/p8.png","photos/p9.png","voice/du.mp3","voice/m.mp3","voice/ol.mp3","voice/s.mp3","voice/sat.mp3","voice/ska.mp3","voice/st.mp3","voice/vd.mp3","voice/vel.mp3","voice/voice.json"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CORE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('hsp-core-')&&k!==CORE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
async function ranged(req,res){
  const b=await res.blob(),n=b.size,m=/bytes=(\d*)-(\d*)/.exec(req.headers.get('range')||'');
  let s=0,e=n-1;if(m){if(m[1]===''&&m[2]!==''){s=Math.max(0,n-+m[2])}else{s=+m[1]||0;if(m[2]!=='')e=Math.min(+m[2],n-1)}}
  if(s>=n)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+n}});
  return new Response(b.slice(s,e+1),{status:206,statusText:'Partial Content',headers:{'Content-Type':res.headers.get('Content-Type')||'audio/mpeg','Content-Range':`bytes ${s}-${e}/${n}`,'Content-Length':String(e-s+1),'Accept-Ranges':'bytes'}})}
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith((async()=>{
    const nav=r.mode==='navigate';
    let hit=await caches.match(nav?'index.html':r.url,{ignoreSearch:true});
    if(hit)return r.headers.has('range')?ranged(r,hit):hit;
    try{const res=await fetch(r);
      if(res.ok&&res.status===200&&!r.headers.has('range')){const c=await caches.open(/\/music\//.test(r.url)?MUS:CORE);c.put(r.url,res.clone())}
      return res}
    catch(err){if(nav){const i=await caches.match('index.html');if(i)return i}throw err}})())});
