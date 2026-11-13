// офлайн-режим: регистрирует кэш и докачивает музыку, показывает прогресс в углу
(()=>{if(!('serviceWorker' in navigator)||!window.caches)return;
const box=document.createElement('div');
box.style.cssText='position:fixed;left:8px;bottom:8px;z-index:99999;padding:6px 10px;border-radius:8px;background:rgba(7,5,12,.85);color:#7fffd4;font:12px -apple-system,sans-serif;pointer-events:none;border:1px solid #ff2bd6;display:none';
document.body.appendChild(box);
const say=(t,hide)=>{box.textContent=t;box.style.display='block';if(hide)setTimeout(()=>box.style.display='none',hide)};
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
navigator.serviceWorker.register('sw.js').then(()=>navigator.serviceWorker.ready).then(async()=>{
  if(!navigator.onLine)return;
  let list;try{list=await (await fetch('music.json',{cache:'no-store'})).json()}catch(e){return}
  const c=await caches.open('hsp-music');const have=new Set((await c.keys()).map(r=>new URL(r.url).pathname.split('/').pop()));
  const need=list.filter(f=>!have.has(f.split('/').pop()));
  if(!need.length){say('✓ Игра готова к офлайну',3000);return}
  let done=list.length-need.length,fail=0;
  for(const f of need){say('Загрузка для офлайна: музыка '+done+'/'+list.length);
    try{const r=await fetch(f,{cache:'reload'});if(r.ok){await c.put(new URL(f,location.href).href,r);done++}else fail++}catch(e){fail++}}
  say(fail?'⚠ Не всё скачалось ('+done+'/'+list.length+'). Открой игру ещё раз с интернетом':'✓ Всё скачано — можно играть без интернета',fail?8000:5000);
}).catch(()=>{})})();
