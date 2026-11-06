// 02.11: (1) взятый лут сохраняется после смерти — патроны/аптечки, подобранные на участке, возвращаются после перезапуска участка;
//        (2) круглый радар-миникарта вверху справа: схема стен, игрок, выход, потайные комнаты.
(function(){
'use strict';
if(!window.C1||!C1.engine||!window.UP)return;
const E=C1.engine,PS=C1.PS,TAU=Math.PI*2;
// ---------- (1) журнал лута участка ----------
const G=['ammo','shells','cells','fuel','syr','pot','p50','r762','r556','awp','nlg','flr','bolt','pkm','sp6','vog'];
let LED={},inRetry=false,ev=false,sh=null,retried=false,cacheN=-1,lastL=null;
const d=Object.getOwnPropertyDescriptor(C1,'retry')||{get(){return this._r0},set(f){this._r0=f}};
function shadow(){const o={};for(const k of G)o[k]=+PS[k]||0;return o}
let pending=null;
function applyLed(led){for(const k in led){if(k==='fuel')PS.fuel=Math.min(100,(PS.fuel||0)+led[k]);else PS[k]=(PS[k]||0)+led[k]}
  LED=led;if(Object.keys(led).length)try{note('Найденное на участке осталось при тебе')}catch(e){}}
Object.defineProperty(C1,'retry',{configurable:true,get:d.get,set(f){
  if(pending&&f){const led=pending;pending=null;applyLed(led)}else if(!inRetry)LED={};
  if(f&&!f._kw){const f0=f;f=function(){const led=Object.assign({},LED);pending=led;inRetry=true;retried=true;
      try{return f0.apply(this,arguments)}finally{inRetry=false;setTimeout(()=>{if(pending===led){pending=null;applyLed(led)}},4000)}};f._kw=1}
  d.set.call(C1,f)}});
{const cur=d.get.call(C1);if(cur&&!cur._kw)C1.retry=cur} // участок мог стартовать до загрузки этого файла
const _pick=C1.onPick;C1.onPick=function(it){if(_pick)_pick(it);if(it._lk)ev=true};
function cachesDone(L){return L&&L.hm&&L.hm.caches?L.hm.caches.filter(c=>c.done).length:0}
const _up=update;
update=function(dt){
  const L0=E.L;sh=shadow();retried=false;ev=false;const c0=L0===lastL?cacheN:cachesDone(L0);
  _up(dt);
  const L=E.L;if(L!==L0||L!==lastL){lastL=L;cacheN=cachesDone(L);return}
  const c1=cachesDone(L);if(c1>c0)ev=true;cacheN=c1;
  if(ev&&!retried){const now=shadow();for(const k of G){const dd=now[k]-sh[k];if(dd>0)LED[k]=(LED[k]||0)+dd}}
};
// ---------- (2) радар ----------
const RR=22,SC=.14;
function mapOf(L){if(L._radar!==undefined)return L._radar;let cv=null;
  try{const st=4,w=Math.ceil(L.w/st),h=Math.ceil(L.h/st);if(w*h>400000){L._radar=null;return null}
    cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d'),im=g.createImageData(w,h),D=im.data;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const v=E.gAt(x*st+2,y*st+2),i=(y*w+x)*4;
      if(v===1||v===3){D[i]=150;D[i+1]=150;D[i+2]=175;D[i+3]=235}else{D[i]=34;D[i+1]=30;D[i+2]=46;D[i+3]=200}}
    g.putImageData(im,0,0)}catch(e){cv=null}
  L._radar=cv;return cv}
function secrets(L){const r=[];for(const it of L.its||[]){if(!it._sc){it._sc=/enterSecret/.test(String(it.act))?1:2}
  if(it._sc!==1)continue;let ok=true;try{ok=!it.cond||it.cond()}catch(e){}if(ok)r.push(it)}return r}
function on(){const L=E.L;return state==='play'&&C1.on&&C1.mode==='td'&&L&&!L.secret&&!cut&&!UP.ui&&!UP.paused&&!(C1.gal&&UP.galOn)}
const _rn=render;
render=function(){_rn.apply(this,arguments);try{if(on()&&!(window.MG&&MG.active)&&!C1.colView&&!(window.COLL&&COLL.on)&&!(C1.radarOff>0))drawRadar(E.L)}catch(e){}};
function drawRadar(L){
  const cx=RR+4,cy=RR+(C1.hudBot?C1.hudBot+4:48); // слева под панелью здоровья (справа — список задач)
  const fa=C1.hudFade?C1.hudFade('rd',cx-RR,cy-RR,RR*2,RR*2):1;u.save();u.globalAlpha=fa;u.beginPath();u.arc(cx,cy,RR,0,TAU);u.fillStyle='rgba(8,6,14,.78)';u.fill();u.clip();
  const m=mapOf(L);if(m){u.imageSmoothingEnabled=false;u.drawImage(m,cx-pl.x*SC,cy-pl.y*SC,m.width*4*SC,m.height*4*SC)}
  // выход
  let ex=null;try{ex=UP.exitOf(L)}catch(e){}
  const dot=(wx,wy,c,s,edge)=>{let dx=(wx-pl.x)*SC,dy=(wy-pl.y)*SC;const dd=Math.hypot(dx,dy);if(dd>RR-3){if(!edge)return;dx*=(RR-3)/dd;dy*=(RR-3)/dd}u.fillStyle=c;u.fillRect(cx+dx-s/2,cy+dy-s/2,s,s)};
  if(ex)dot(ex.x,ex.y,'#3aff7a',3,true);
  // потайные комнаты: мигающая жёлтая отметка (на краю радара, если далеко)
  const bl=Math.sin(performance.now()/180)>-.3;
  if(bl)for(const it of secrets(L)){dot(it.x,it.y,'#ffd23a',4,true);dot(it.x,it.y,'#1a1206',2,true)}
  // осталось ≤10 зомби — красные метки (на краю, если далеко)
  {const left=L.zs.filter(z=>!z.dead&&!z.ally);if(left.length&&left.length<=10&&(L.armed||L.arrows))for(const z of left){dot(z.x,z.y,'#ff2a3a',3,true)}}
  // игрок
  u.fillStyle='#ffffff';u.fillRect(cx-1.5,cy-1.5,3,3);u.strokeStyle='#ffffff';u.lineWidth=.8;u.beginPath();u.moveTo(cx,cy);u.lineTo(cx+Math.cos(pl.a)*5,cy+Math.sin(pl.a)*5);u.stroke();
  u.restore();
  u.save();u.globalAlpha=fa;u.strokeStyle='rgba(255,90,168,.8)';u.lineWidth=.8;u.beginPath();u.arc(cx,cy,RR,0,TAU);u.stroke();u.restore();
}
window.KEEP={LED:()=>LED,mapOf};
})();
