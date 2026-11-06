// =====================================================================
//  catpet.js — награды Черсика (04.11, просьба Натальи): луту ему не нужно.
//  · скины-аксессуары за главы (выбор у когтеточки в квартире);
//  · дома растут миска, туалет и домик: ур.1 после гл.3, ур.2 после гл.6, ур.3 после гл.9.
// =====================================================================
(function(){
'use strict';
if(typeof drawCat!=='function'||!window.C1)return;
const dn=k=>!!(window[k]&&window[k].done);
const legs=()=>(C1.LEGSET&&C1.LEGSET.size)|0;
const SK=[
  {id:'none',n:'Обычный Черсик',ok:()=>true},
  {id:'band',n:'Бандана «Бардака»',ok:()=>dn('C4'),how:'глава 4'},
  {id:'phones',n:'Наушники диджея',ok:()=>dn('C7'),how:'глава 7'},
  {id:'vest',n:'Тактикульный жилет',ok:()=>dn('C8'),how:'глава 8'},
  {id:'cap',n:'Охотничья шапка',ok:()=>dn('C9'),how:'глава 9'},
  {id:'crown',n:'Корона крысиной королевы',ok:()=>dn('C10'),how:'финал'},
  {id:'gold',n:'Золотой Черсик',ok:()=>legs()>=10,how:'10 достижений'}];
const CP={SK};window.CP=CP;
function sv(){try{const s=UP.SV();s.catp=s.catp||{skin:'none'};return s.catp}catch(e){return {skin:'none'}}}
function save(){try{UP.persist()}catch(e){}}
const D=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x/3,y/3,w/3,h/3)};
function acc(g,mode){const id=sv().skin;if(!id||id==='none')return;const sl=mode==='sleep';
  const hx=sl?46:53,hy=sl?33:36; // центр головы в третях пикселя
  if(id==='gold'){g.save();g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,200,40,.55)';g.fillRect(0,0,24,24);g.restore();
    if(!sl)for(const ey of [31,39]){D(g,58,ey,3,3,'#d4ea4f');D(g,59,ey,1,3,'#0a0a0a')}D(g,hx-6,hy-6,4,2,'#fff6c8');return}
  if(id==='band'){D(g,hx-6,hy-9,4,18,'#c8202a');D(g,hx-5,hy-8,2,16,'#ff4a50');for(let i=0;i<4;i++)D(g,hx-5,hy-7+i*4,1,1,'#fff');D(g,hx-12,hy-2,6,2,'#c8202a');D(g,hx-14,hy+1,5,2,'#a8181e')}
  else if(id==='phones'){D(g,hx-2,hy-11,4,22,'#2a2a30');D(g,hx-4,hy-13,8,5,'#3ad8ff');D(g,hx-4,hy+8,8,5,'#3ad8ff');D(g,hx-3,hy-12,6,1,'#c8f8ff');D(g,hx-3,hy+9,6,1,'#c8f8ff')}
  else if(id==='vest'){if(sl){D(g,26,28,20,14,'#4a5430');D(g,28,30,6,4,'#3a4226');D(g,36,30,6,4,'#3a4226')}else{D(g,22,28,22,16,'#4a5430');D(g,22,28,22,2,'#6a7a48');for(let x=24;x<42;x+=6)D(g,x,32,4,6,'#3a4226');D(g,40,30,2,2,'#3ad8ff')}}
  else if(id==='cap'){D(g,hx-6,hy-7,9,14,'#ff7a1a');D(g,hx-6,hy-7,9,2,'#ffa050');D(g,hx-8,hy-8,3,16,'#e0600e');D(g,hx-3,hy-1,2,2,'#fff6c8')}
  else if(id==='crown'){const c='#ffd23a';D(g,hx-7,hy-6,6,12,c);for(const dy of [-7,-2,3])D(g,hx-10,hy+dy,4,3,c);D(g,hx-6,hy-1,2,2,'#ff3a4a');D(g,hx-6,hy-5,2,2,'#3ad8ff');D(g,hx-6,hy+3,2,2,'#3ef06a')}}
const _dc=drawCat;
drawCat=function(g,mode,t,ph){_dc(g,mode,t,ph);try{if(!(window.C3&&C3.on&&window.C3.buff))acc(g,mode)}catch(e){}};
// --- дом Черсика: миска, туалет, домик ---
function lvl(){return (dn('C3')?1:0)+(dn('C6')?1:0)+(dn('C9')?1:0)}
CP.lvl=lvl;
function home(){const L=lvl();if(!L)return;
  // миска (кухня)
  if(L===1){R(167,359,20,8,'#5a3a2a');R(168,360,18,1,'#7a5a3a');R(169,361,7,4,'#c8ccd4');R(178,361,7,4,'#c8ccd4');R(170,362,5,2,'#7a4a2a');R(179,362,5,2,'#8ec4e8')}
  else if(L===2){R(166,358,22,9,'#2a2a30');R(167,359,20,1,'#4a4a52');R(169,360,7,5,'#ffd23a');R(178,360,7,5,'#ffd23a');R(170,361,5,3,'#7a4a2a');R(179,361,5,3,'#8ec4e8');R(171,366,12,1,'#ffd23a')}
  else{R(165,352,24,15,'#e8e8ec');R(166,353,22,5,'#2a2a34');R(167,354,8,3,'#3ef0b0');R(176,354,10,1,'#3ad8ff');R(176,356,6,1,'#3ad8ff');R(169,360,7,5,'#ffd23a');R(178,360,7,5,'#c8ccd4');R(170,361,5,3,'#7a4a2a');R(179,361,5,3,'#8ec4e8');R(165,367,24,1,'#ffd23a')}
  // туалет (санузел)
  if(L===1){R(200,263,16,16,'#6a8ac8');R(201,264,14,6,'#8aaae8');R(205,272,6,5,'#2a3a5a');R(201,278,14,1,'#4a6aa8')}
  else if(L===2){R(199,262,18,18,'#e8e4f0');R(200,263,16,7,'#c8c0e0');R(204,271,8,6,'#2a2a34');R(200,262,16,1,'#ffffff');R(213,264,2,4,'#3a8a3a');R(212,262,4,3,'#5ac85a')}
  else{R(199,261,18,19,'#2a2a34');R(200,262,16,8,'#3a3a48');R(201,263,14,2,'#ff4fd8');R(204,271,8,6,'#14141a');R(202,266,3,2,'#3ef0b0');R(199,279,18,1,'#ff4fd8');R(211,266,3,2,'#ffd23a')}
  // домик / когтеточка (у окна)
  if(L===1){R(207,30,18,25,'#c8a878');R(208,31,16,10,'#e8d8b8');R(208,44,16,10,'#e8d8b8');R(213,35,6,5,'#4a3a2a');R(207,42,18,1,'#a88858')}
  else if(L===2){R(206,28,20,27,'#8a5a3a');R(207,29,18,11,'#c8a878');R(207,43,18,11,'#c8a878');R(212,33,8,6,'#2a1a10');R(206,41,20,2,'#5a3a22');R(204,34,2,14,'#e8e4d8');R(226,34,2,14,'#e8e4d8');R(204,46,24,2,'#d82a6a')}
  else{R(205,26,22,29,'#5a2a6a');R(206,27,20,12,'#8a4aa8');R(206,42,20,12,'#8a4aa8');R(211,31,10,7,'#1a0a20');R(205,40,22,2,'#ffd23a');R(209,23,14,4,'#ffd23a');for(const x of [209,215,221])R(x,21,2,2,'#ffd23a');R(214,24,4,2,'#ff3a4a');R(205,54,22,1,'#ff4fd8')}}
CP.home=home;
const _q3=q3Furniture;q3Furniture=function(){_q3();try{home()}catch(e){console.warn('catpet',e)}};
let sig='';setInterval(()=>{try{const s=lvl()+'|'+sv().skin;if(s!==sig){if(sig)mapDirty=true;sig=s}}catch(e){}},1500);
// выбор скина у когтеточки
IT.push({x:216,y:58,r:12,label:()=>{const s=SK.find(k=>k.id===sv().skin)||SK[0];const n=SK.filter(k=>k.ok()).length;return 'Гардероб Черсика: '+s.n+' ('+n+'/'+SK.length+')'},
  cond:()=>scene==='flat'&&!(C1.on&&C1.mode)&&!cut&&SK.filter(k=>k.ok()).length>1,
  act:()=>{const av=SK.filter(k=>k.ok()),c=sv(),i=av.findIndex(k=>k.id===c.skin);c.skin=av[(i+1)%av.length].id;save();
    const nx=SK.find(k=>!k.ok());note('Черсик теперь: '+av[(i+1)%av.length].n+(nx?' · ещё: '+nx.n+' ('+nx.how+')':''));try{C1.X.sfx('pick')}catch(e){}}});
})();
