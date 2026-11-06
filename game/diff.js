// =====================================================================
//  diff.js — кривая сложности по главам (04.11, решение Натальи):
//  мой разбор (+7% за главу) и сверху ещё ×1.1 ко всему.
//  Строка главы: здоровье зомби / их число / скорость / урон по герою / доля стрелков в броне.
//  Боссы и именные растут только по здоровью. Вылазки идут по строке главы,
//  перед которой на них идёшь. Подключается последним.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.engine)return;
const E=C1.engine;
const BASE={1:[1.00,1.00,1.00,1.8,.06],2:[1.07,1.05,1.02,1.9,.10],3:[1.14,1.10,1.04,2.0,0],4:[1.21,1.15,1.06,2.1,.17],5:[1.28,1.20,1.08,2.2,.21],
  6:[1.35,1.25,1.10,2.3,.10],7:[1.42,1.30,1.12,2.4,.28],8:[1.49,1.35,1.14,2.5,.32],9:[1.56,1.40,1.16,2.6,.36],10:[1.63,1.45,1.18,2.7,.40]};
const K=1.1,ROW={};for(const n in BASE)ROW[n]=BASE[n].map(v=>v*K);
const DF={ROW,on:true};window.DF=DF;
function liveCh(){for(const n of [10,9,8,7,6,5,4,3,2])if(window['C'+n]&&window['C'+n].on)return n;return 0}
function nextCh(){let d=C1.done?1:0;for(let n=2;n<=10;n++)if(window['C'+n]&&window['C'+n].done)d=n;return Math.min(10,d+1)}
function ch(){if(window.CS&&CS.on)return CS.id==='gas'?Math.max(4,nextCh()):nextCh();return liveCh()||1} // 04.11: заправка — уровень 3, как табачка
DF.ch=ch;DF.row=()=>ROW[ch()]||ROW[1];
// урон по герою
Object.defineProperty(C1,'dmgMul',{configurable:true,get(){return DF.on?DF.row()[3]:2.4},set(v){}});
// здоровье, скорость, число
const BOSS={boss:1,brute:0};
const _init=C1.zInit;let busy=0;
C1.zInit=function(z){if(_init)_init(z);if(!DF.on||z._df)return;z._df=1;const r=DF.row();
  const car=C1.mode==='car'||C1.mode==='carK';
  z.hp=Math.round(z.hp*r[0]);z.max=Math.round((z.max||z.hp)*r[0]);
  const big=z.type==='boss'||z.nm||z.boss;
  if(!big)z.sp*=r[2];
  if(big||busy||car||z.type==='brute'||z.fake)return;
  const L=E.L;if(!L)return;L.dfA=(L.dfA==null?Math.random()*.5:L.dfA)+(r[1]-1);
  if(L.dfA>=1){L.dfA-=1;busy=1;try{const a=Math.random()*Math.PI*2,x=z.x+Math.cos(a)*9,y=z.y+Math.sin(a)*9;
    const o={};for(const k of ['st','hid','wakeR','v'])if(z[k]!=null)o[k]=z[k];if(o.st==='hidden')delete o.st;
    const f=E.freeSpot?E.freeSpot(x,y,z.r||4,20):[x,y];if(f&&(!E.los||E.los(z.x,z.y,f[0],f[1])))E.addZ(z.type,f[0],f[1],o)}catch(e){}finally{busy=0}}};
// доля стрелков в броне: делим по пропорциям armor.js, сумма — из таблицы
if(window.AZ&&AZ.rates){const _r=AZ.rates;
  const _conv=C1.zConv;
  C1.zConv=function(type,o){if(!DF.on)return _conv(type,o);
    const so=!!(window.CS&&CS.on);
    if(!(type==='normal'||type==='gunner'||(so&&type==='armor'))||!o||o.nm||o.ai||o.boss||o.noConv)return type;
    const L=E.L;if(!L||C1.mode==='car'||C1.mode==='carK'||C1.mode==='ride')return type;
    if(window.C3&&C3.on)return type;
    const c=ch(),s=ROW[c][4];if(!s)return type;
    const b=_r(Math.max(c,2)),sum=b.zpist+b.zshot+b.zak||1;
    let r={zpist:b.zpist/sum*s,zshot:b.zshot/sum*s,zak:b.zak/sum*s};
    if(window.C6&&C6.on)r.zak=0;
    const A=L.azA||(L.azA={zpist:Math.random()*.6,zshot:Math.random()*.6,zak:Math.random()*.6});
    for(const k of ['zak','zshot','zpist']){A[k]+=r[k];if(A[k]>=1){A[k]-=1;return k}}
    return type}}
})();
