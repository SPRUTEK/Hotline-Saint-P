// music2.js — новые треки (03.11), музыка вылазок/вагонетки/снайперки и случайная точка старта трека.
// Подключается последним. Главы по-прежнему зовут music('ключ').
(()=>{
const NEW=['hellraiser','kupala_mud','kupala2025','neuro_demo1','oster','mazh_techno','mazh_electro','fuckedup','melancholy','rave_station','techno_show','acid','waves','factory'];
for(const k of NEW)if(!MUS[k]){const a=new Audio('music/'+k+'.mp3');a.loop=true;a.preload='none';a.volume=0;MUS[k]=a}
// вылазки: трек на локацию
window.SOMZ={mm:'mazh_techno',by:'techno_show',oz:'rave_station',gas:'pisyat',vape:'fuckedup',lenta:'unmix',dns:'lych',bunk:'neuro_demo1'};

// ---- случайная точка старта: 0–60% длины, повтор того же трека стартует подальше от прошлых точек
const used={};
function pick(k,d){const u=used[k]||(used[k]=[]);let best=0,bd=-1;
  for(let i=0;i<8;i++){const t=Math.random()*.6;let m=1;for(const p of u)m=Math.min(m,Math.abs(p-t));if(m>bd){bd=m;best=t}}
  u.push(best);if(u.length>4)u.shift();return best*d}
function seek(a,k,mob){const go=()=>{if(mob&&C1.audio.key!==k)return;const d=a.duration;if(!isFinite(d)||d<20)return;try{a.currentTime=pick(k,d)}catch(e){}};
  if(a.readyState>=1&&isFinite(a.duration))go();else a.addEventListener('loadedmetadata',go,{once:true})}
const prev=music;
music=function(name){
  const A=C1.audio,mob=A&&A.MOB&&A.MP;
  const fresh=mob?(A.key!==name):(MUS[name]&&MUS[name].paused);
  prev(name);
  if(!fresh)return;
  if(mob){if(A.key===name)seek(A.MP,name,1)}else if(MUS[name])seek(MUS[name],name)};
window.MUS2={pick,used};

// ---- вагонетка (гл.3) и снайперка (гл.4)
if(window.HMC&&HMC.cart){const c0=HMC.cart;HMC.cart=function(ch,done){const r=c0.apply(this,arguments);music('rave_station');return r}}
if(window.SNP&&SNP.play){const s0=SNP.play;SNP.play=function(o,cb){const was=musCur;music('tommy');
  return s0.call(this,o,function(){if(was&&musCur==='tommy')music(was);return cb&&cb.apply(this,arguments)})}}
})();
