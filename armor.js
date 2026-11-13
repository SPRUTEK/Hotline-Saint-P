// =====================================================================
//  armor.js — дальние зомби в броне (просьба Натальи 03.11):
//  · метатели мусора остаются как были;
//  · zpist  — зомби-ППС в лёгком бронике с пистолетом: двойной выстрел,
//             держит дистанцию и ходит боком;
//  · zshot  — зомби-ЧОПовец в бронике с дробовиком: лезет ближе, веер дроби;
//  · zak    — тяжёлый зомби-спецназ в плитнике и шлеме с автоматом:
//             долго целится, потом длинная очередь, ствол ведёт за тобой
//             медленно — уходи вбок или за стену.
//  Броня держит пули спереди (в спину — полный урон), бронебойные и
//  взрывы проходят, пинок/рывок сбивает с ног, ближний бой — полный урон.
//  Сколько их — растёт по главам (1→8) и по уровню вылазки (ур.1→5).
//  Подключается сразу после level1.js. Хуки в level1.js: C1.zConv, C1.zInit,
//  C1.zAI, z.arm (броня от пуль), z.azg (дроп патронов).
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.engine||!C1.X)return;
const E=C1.engine,X=C1.X,TAU=Math.PI*2,sfx=X.sfx,ZT=X.ZT;
const rn=(a,b)=>a+Math.random()*(b-a);
const ad=(a,b)=>{let d=a-b;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
const AZ={};window.AZ=AZ;

// ---------- характеристики ----------
// sp — базовая; движок умножает её на 1.4 и на 1.7 (как у «прочих» типов)
ZT.zpist={hp:80,sp:11,r:4,dmg:10};
ZT.zshot={hp:110,sp:12,r:4,dmg:12};
ZT.zak={hp:190,sp:8,r:5,dmg:14};
const GUN={
  //       прицел  выстрелов  интервал скорость урон разброс  перезарядка   дальн. броня  поворот ствола в очереди
  zpist:{aim:.5, n:2, iv:.17, bs:210, dmg:11, spr:.07, cd:[1.3,1.9], rng:200, arm:.5, trk:3.2, nm:'ЗОМБИ С ПИСТОЛЕТОМ'},
  zshot:{aim:.55,n:1, iv:.1,  bs:190, dmg:16, spr:.05, cd:[1.6,2.2], rng:115, arm:.45,trk:2.6, pel:6, cone:.5, life:.6},
  zak:  {aim:.8, n:9, iv:.085,bs:175, dmg:12, spr:.06, cd:[2.0,2.7], rng:240, arm:.3, trk:1.15},
};
AZ.GUN=GUN;
const BARK={
  zpist:'Зомби в бронике со стволом! Красный лазер — уходи с линии или за стену.',
  zshot:'Зомби с дробовиком! Вблизи разносит — держи дистанцию.',
  zak:'Автоматчик в броне! От очереди беги вбок и прячься за стену.',
};

// ---------- спрайты 24×24, смотрят вправо (+x) ----------
function spr(type,v){
  const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});
  const SK=['#7fa070','#86a676','#76966a','#8aa87a'][v%4],SD='#5a7a4a';
  if(type==='zpist'){
    const u=['#2c3446','#323a4e','#283040','#363c50'][v%4],ve='#1a1e28',vh='#3c465c';
    // плечи и руки: правая с пистолетом вперёд, левая поддерживает
    P(g,11,6,7,3,u);P(g,11,15,7,3,u);P(g,17,8,3,3,SK);P(g,17,13,3,3,SK);
    P(g,19,10,3,4,SK);P(g,21,11,4,2,'#121216');P(g,22,10,2,1,'#2a2a30');P(g,24,11,1,1,'#3a3a44');
    // торс в бронежилете
    ell(g,10,12,4.8,7.6,u);ell(g,10,12,4,6.4,ve);P(g,8,8,4,8,vh);P(g,9,9,2,6,'#4a5670');
    P(g,6,10,2,4,'#141820');P(g,12,7,1,10,'#0e1016');P(g,7,7,1,1,'#c8c8d0');
    P(g,6,6,1,12,'#c8d838');P(g,5,8,1,8,'#a8b828'); // светоотражающая полоса ППС на спине
    // голова в каске
    ell(g,13,12,3.9,3.9,'#2a3242');ell(g,12.5,12,3.1,3.1,'#3a4458');P(g,11,10,2,1,'#5a6680');
    P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030');P(g,17,12,1,1,'#3a1010');
    P(g,9,15,1,2,'#6a1a1a');
  }else if(type==='zshot'){
    const u=['#3a3428','#40382a','#352f24','#463c2c'][v%4],ve='#1c1c18',sh='#b02a22';
    P(g,11,6,8,3,u);P(g,11,15,8,3,u);P(g,18,7,3,3,SK);P(g,18,14,3,3,SK);
    // дробовик двумя руками, длинный ствол
    P(g,15,12,9,2,'#141418');P(g,15,11,3,4,'#5a3a1e');P(g,20,12,4,1,'#2a2a30');P(g,19,14,3,1,'#3a2a1a');
    // торс: чёрный броник + патронташ наискосок
    ell(g,10,12,5,7.6,u);ell(g,10,12,4.2,6.6,ve);P(g,8,8,4,8,'#2c2c26');
    for(let i=0;i<5;i++){P(g,7+i,7+i*2,1,1,sh);P(g,8+i,7+i*2,1,1,'#d8a040')}
    // голова: шлем-сфера с козырьком
    ell(g,13,12,3.9,3.9,'#24241e');ell(g,12.5,12,3.1,3.1,'#3a3a30');P(g,16,10,1,5,'#141410');
    P(g,15,10,1,1,SK);P(g,15,14,1,1,SK);P(g,16,11,1,1,'#ff3030');P(g,16,13,1,1,'#ff3030');
    P(g,12,16,2,1,'#6a1a1a');
  }else{ // zak — тяжёлый: плитник, наплечники, шлем с забралом, автомат
    const u=['#2e3424','#343a28','#2a3020','#3a3e2c'][v%4],pl='#1e2218',ph='#46503a';
    P(g,10,4,9,4,u);P(g,10,16,9,4,u);P(g,8,3,6,4,pl);P(g,8,17,6,4,pl);P(g,9,4,4,1,ph);P(g,9,18,4,1,ph);
    P(g,17,6,3,3,SK);P(g,17,15,3,3,SK);
    // автомат: ствол, магазин-рожок, цевьё
    P(g,14,11,10,2,'#121212');P(g,16,13,3,3,'#1a1a1a');P(g,17,15,2,1,'#1a1a1a');P(g,19,10,3,1,'#5a3a1e');P(g,22,11,2,1,'#2a2a2a');
    // торс
    ell(g,10,12,5.8,8.2,u);ell(g,10,12,4.8,7.2,pl);P(g,7,8,6,8,ph);P(g,8,9,4,6,'#5a6648');P(g,9,11,2,2,'#6a7858');
    P(g,4,9,3,6,'#262a1e');P(g,5,10,1,4,'#3a4030');P(g,12,7,1,10,'#121410');
    // шлем с забралом, глаза светятся сквозь щель
    ell(g,13,12,4.2,4.2,'#1e2218');ell(g,12.5,12,3.4,3.4,'#3a4230');P(g,11,10,2,1,'#566246');
    P(g,15,9,2,6,'#121410');P(g,16,10,1,1,'#ff2a2a');P(g,16,14,1,1,'#ff2a2a');P(g,17,10,1,5,'#262a1e');
    P(g,6,15,1,2,'#6a1a1a');
  }
  outline(g,'#0b0910');return c}
const NV=4;
function warm(){for(const t of ['zpist','zshot','zak'])for(let v=0;v<8;v++){const k=t+v;if(!X.zCache[k])X.zCache[k]=v<NV?spr(t,v):X.zCache[t+(v%NV)]}}
try{warm()}catch(e){console.warn('armor: спрайты',e)}
AZ.warm=warm;

// ---------- сколько их: сложность по главам и вылазкам ----------
function curCh(){for(const n of [10,9,8,7,6,5,4,3,2])if(window['C'+n]&&window['C'+n].on)return n;return 1}
function tier(){
  if(window.CS&&CS.on&&CS.id&&window.SORTIE){const l=(SORTIE.LOCS||[]).find(o=>o.id===CS.id);if(l)return l.lv*1.6}
  return curCh()}
AZ.tier=tier;
// доля «обычных», которые становятся стрелками в броне
function rates(t){return {
  zpist:.04+.022*t,                      // гл.1 ≈6%, гл.4 ≈13%, гл.8 ≈22%
  zshot:t>=2?.018*(t-1):0,               // с гл.2: 2% → 13%
  zak:t>=3?.022*(t-2.5):0}}              // с гл.3: 1% → 12%
AZ.rates=rates;
C1.zConv=function(type,o){
  const so=!!(window.CS&&CS.on);
  // кандидаты: обычные и старые охранники с пистолетом; на вылазках ещё и бронированные рукопашники
  if(!(type==='normal'||type==='gunner'||(so&&type==='armor'))||!o||o.nm||o.ai||o.boss||o.noConv)return type;
  const L=E.L;if(!L||C1.mode==='car'||C1.mode==='carK'||C1.mode==='ride')return type;
  if(window.C3&&C3.on)return type;               // глава за кота — без стволов
  let r=rates(tier());
  if(window.C6&&C6.on)r={zpist:r.zpist*.5,zshot:r.zshot*.5,zak:0}; // Перелесье — бензопилы
  if(so&&type!=='normal')r={zpist:r.zpist*1.5,zshot:r.zshot*1.5,zak:r.zak*1.5};
  const A=L.azA||(L.azA={zpist:Math.random()*.6,zshot:Math.random()*.6,zak:Math.random()*.6});
  for(const k of ['zak','zshot','zpist']){A[k]+=r[k];if(A[k]>=1){A[k]-=1;return k}}
  return type};
C1.zInit=function(z){const G=GUN[z.type];if(!G)return;
  z.arm=G.arm;z.azg=1;z.v=(z.v|0)%NV;
  if(!z.nm){const d=ZT[z.type];z.hp=z.max=d.hp}
  z.gcd=rn(.4,1.2);z.sd=Math.random()<.5?1:-1};

// ---------- поведение ----------
function fire(z,G){const L=E.L;
  const n=G.pel||1;
  for(let i=0;i<n;i++){const a=z.aa+(n>1?(i/(n-1)-.5)*G.cone:0)+rn(-G.spr,G.spr);
    L.ebuls.push({x:z.x+Math.cos(a)*9,y:z.y+Math.sin(a)*9,vx:Math.cos(a)*G.bs*rn(.92,1.08),vy:Math.sin(a)*G.bs*rn(.92,1.08),life:G.life||1.5,dmg:G.dmg,bul:1})}
  z.fl=.06;sfx(z.type==='zshot'?'shotgun':'shot',z.type==='zak'?.5:.45);
  if(z.type==='zak')C1.shake=Math.max(C1.shake||0,.08)}
function ai(z,d,see,dt,dir){const G=GUN[z.type];let go=1;
  if(see&&d<170&&BARK[z.type]&&!(C1.seenT||(C1.seenT={}))[z.type]){C1.seenT[z.type]=1;if(window.note)note(BARK[z.type])}
  const ta=Math.atan2(pl.y-z.y,pl.x-z.x);
  if(z.aim>0){go=0;z.aim+=dt;z.aa+=ad(ta,z.aa)*Math.min(1,dt*2.4);
    if(!see&&z.aim<.3)z.aim=0;else if(z.aim>=G.aim){z.aim=0;z.burst=G.n;z.bt=0}}
  else if(z.burst>0){go=0;
    // в очереди ствол ведёт за игроком с ограниченной скоростью — от автомата можно уйти вбок
    const df=ad(ta,z.aa),mx=G.trk*dt;z.aa+=Math.max(-mx,Math.min(mx,df));
    z.bt-=dt;if(z.bt<=0){z.bt=G.iv;z.burst--;fire(z,G);if(z.burst<=0)z.gcd=rn(G.cd[0],G.cd[1])}}
  else{if(z.gcd>0)z.gcd-=dt;
    if(see&&d<G.rng&&d>14&&!(z.gcd>0)){z.aim=.001;z.aa=ta+rn(-.3,.3);sfx('click',.7)}
    else if(see){
      if(z.type==='zshot'){if(d<45)dir=ta+Math.PI;else if(d<90){dir=ta+Math.PI/2*z.sd;if(Math.random()<dt*.6)z.sd=-z.sd}}
      else if(z.type==='zpist'){if(d<70)dir=ta+Math.PI;else if(d<160){dir=ta+Math.PI/2*z.sd;if(Math.random()<dt*.5)z.sd=-z.sd}}
      else{if(d<60)dir=ta+Math.PI;else if(d<200)go=0}}}
  if(z.aim>0||z.burst>0)z.a=z.aa;
  return {dir,go}}
C1.zAI={zpist:ai,zshot:ai,zak:ai};

// очки и трофеи для новых типов
try{if(window.HM&&HM.TROPHZ)Object.assign(HM.TROPHZ,{zpist:['tag',.35],zshot:['tag',.35],zak:['plate',.6]})}catch(e){}
})();
