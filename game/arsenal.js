// =====================================================================
//  arsenal.js — согласовано Натальей 02.11:
//  · О1–О12 новое оружие (секретки по главам, Лента, задний двор, гараж),
//    уникальные стволы бункера (Печенег, Винторез, АГС);
//  · верстак В2–В6 в бою: аптечка (сама), стимулятор X, гранаты G,
//    ловушки Z, экспансивные/бронебойные патроны; вейп-дымовуха K;
//  · В1 ресурсы: электроника и ядра (боссы, охрана, секретки);
//  · Шмакодявка-напарница с пистолетом во всех миссиях за Микроба
//    (кроме Перелесья; за Черсика и в Италии — без неё).
//  Подключается после sortie.js. Наружу: window.ARS.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.engine||!C1.X||!window.UP)return;
const E=C1.engine,X=C1.X,PS=C1.PS,WD=C1.WD,TAU=Math.PI*2,sfx=X.sfx,D2=(a,b,c,d)=>Math.hypot(c-a,d-b);
const ARS={};window.ARS=ARS;
const SV=()=>UP.SV();const save=()=>{try{UP.persist()}catch(e){}};
const rn=(a,b)=>a+Math.random()*(b-a);
const ad=(a,b)=>{let d=a-b;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
function curCh(){for(const n of [10,9,8,7,6,5,4,3,2])if(window['C'+n]&&window['C'+n].on)return n;return 1}
ARS.curCh=curCh;

// ================= О1–О12 + бункер =================
const G=(c)=>c; // для читаемости
Object.assign(WD,{
  mp5:{slot:'t',n:'MP5 С ГЛУШИТЕЛЕМ',pose:'shotgun',am:'ammo',mag:30,rt:1.6,cd:.08,dmg:17,sp:470,life:.55,spr:.06,kb:35,snd:'shot',noise:45,shake:.06,col:'#e8e8c8',
    ico:[[0,2,20,3,'#1a1a1e'],[20,2,12,4,'#3a3a42'],[9,5,3,6,'#2a2a2a'],[3,0,8,2,'#2a2a30']],ov:[[5,11,19,3,'#1a1a1e'],[5,11,6,3,'#3a3a42'],[13,13,2,3,'#2a2a2a']]},
  sawn:{slot:'t',n:'ОБРЕЗ-ДВУСТВОЛКА',pose:'shotgun',am:'shells',mag:2,rt:1.5,cd:.22,pel:10,dmg:17,sp:380,life:.17,spr:.45,kb:170,snd:'shotgun',noise:230,shake:.45,col:'#ffcf6a',
    ico:[[0,1,18,2,'#26262a'],[0,3,18,2,'#3a3a40'],[16,1,10,6,'#6a4424']],ov:[[10,11,14,2,'#26262a'],[10,13,14,1,'#3a3a40'],[6,11,5,3,'#6a4424']]},
  saiga:{slot:'t',n:'САЙГА',pose:'shotgun',am:'shells',mag:8,rt:2.2,cd:.3,pel:7,dmg:13,sp:400,life:.22,spr:.3,kb:80,snd:'shotgun',noise:220,shake:.3,col:'#ffcf6a',
    ico:[[0,2,28,3,'#141418'],[22,2,10,5,'#2a2a2e'],[11,5,5,7,'#2a2a2a']],ov:[[5,11,19,3,'#141418'],[12,13,3,4,'#2a2a2a']]},
  xbow:{slot:'t',n:'АРБАЛЕТ',pose:'shotgun',am:'bolt',mag:1,rt:1.0,cd:.6,dmg:120,sp:520,life:.7,spr:0,kb:120,pierce:1,snd:'swing',noise:20,col:'#c8a060',
    ico:[[0,3,26,2,'#6a4a2a'],[2,-2,2,12,'#2a2a2e'],[2,4,22,1,'#c8ccd4']],ov:[[8,12,16,2,'#6a4a2a'],[20,7,2,12,'#2a2a2e']]},
  nailgun:{slot:'t',n:'ГВОЗДОМЁТ',pose:'shotgun',am:'nlg',mag:40,rt:1.5,cd:.12,dmg:14,sp:380,life:.45,spr:.06,kb:20,snd:'shot',noise:90,col:'#c8ccd4',pin:1,
    ico:[[0,1,18,7,'#e8a020'],[2,3,14,2,'#2a2a2a'],[18,3,4,2,'#c8ccd4'],[6,8,4,5,'#3a3a3a']],ov:[[14,11,9,5,'#e8a020'],[15,12,7,1,'#2a2a2a'],[23,13,1,1,'#c8ccd4']]},
  flare:{slot:'p',n:'СИГНАЛЬНАЯ РАКЕТНИЦА',pose:'pistol',am:'flr',mag:1,rt:1.4,cd:.5,dmg:30,sp:300,life:.9,spr:.02,kb:60,snd:'slug',noise:160,fire:1,col:'#ff5a3a',flare:1,
    ico:[[0,0,14,5,'#d8402a'],[9,5,4,6,'#1a1a1e'],[0,0,14,1,'#ff8a6a']],ov:[[19,12,7,3,'#d8402a'],[19,12,7,1,'#ff8a6a']]},
  machete:{slot:'m',n:'МАЧЕТЕ',pose:'none',ml:{cd:.24,sw:.13,reach:21,arc:1.45,dmg:40,boss:22,kb:70,snd:'axe',bleed:1},
    ico:[[0,2,20,4,'#c8ccd4'],[0,2,20,1,'#f0f4f8'],[20,2,8,3,'#2a2a2a']],ov:[[15,18,4,2,'#2a2a2a'],[19,17,7,2,'#c8ccd4'],[19,17,7,.5,'#f0f4f8']]},
  axe2:{slot:'m',n:'ПОЖАРНЫЙ ТОПОР',pose:'none',ml:{cd:.72,sw:.32,reach:23,arc:1.0,dmg:92,boss:40,kb:220,snd:'axe'},
    ico:[[0,2,26,3,'#b8282a'],[0,-2,6,10,'#8a9098'],[0,-2,1,10,'#e0e4ea']],ov:[[9,18,13,2,'#b8282a'],[20,15,4,7,'#8a9098'],[20,15,1,7,'#e0e4ea']]},
  sledge:{slot:'m',n:'КУВАЛДА',pose:'none',ml:{cd:.95,sw:.4,reach:24,arc:1.6,dmg:60,boss:34,kb:340,snd:'bat'},
    ico:[[0,2,24,3,'#8a6a40'],[22,-2,8,10,'#5a5e66'],[22,-2,8,2,'#8a8e96']],ov:[[9,18,12,2,'#8a6a40'],[20,15,5,7,'#5a5e66']]},
  katana:{slot:'m',n:'КАТАНА',pose:'none',ml:{cd:.26,sw:.14,reach:24,arc:1.7,dmg:72,boss:34,kb:90,snd:'axe',bleed:1},
    ico:[[0,2,28,2,'#e0e4ea'],[0,2,28,1,'#ffffff'],[28,1,2,4,'#c8a040'],[30,2,8,2,'#2a1a2a']],ov:[[13,18,3,2,'#2a1a2a'],[16,17,1,4,'#c8a040'],[17,18,8,1.4,'#e0e4ea']]},
  minigun:{slot:'t',n:'МИНИГАН',pose:'shotgun',am:'r762',mag:200,rt:4.0,cd:.3,dmg:20,sp:520,life:.6,spr:.1,kb:40,snd:'rifle',noise:240,shake:.14,slow:.7,spin:1,
    ico:[[0,1,30,7,'#2a2a2e'],[0,2,30,1,'#5a5a62'],[0,5,30,1,'#5a5a62'],[22,0,10,9,'#3a3a42'],[12,8,6,5,'#4a4a52']],ov:[[4,10,20,6,'#2a2a2e'],[4,11,20,1,'#5a5a62'],[4,14,20,1,'#5a5a62']]},
  pech:{slot:'t',n:'ПУЛЕМЁТ «ПЕЧЕНЕГ»',pose:'shotgun',am:'pkm',mag:100,rt:3.2,cd:.075,dmg:34,sp:540,life:.7,spr:.06,kb:70,pierce:1,snd:'rifle',noise:230,shake:.16,slow:.85,
    ico:[[0,2,34,3,'#26262a'],[26,2,10,6,'#3a3a32'],[11,5,8,8,'#3a3a32'],[0,1,6,1,'#5a5a62']],ov:[[4,11,20,3,'#26262a'],[12,13,6,4,'#3a3a32']]},
  vint:{slot:'t',n:'ВИНТОРЕЗ',pose:'shotgun',am:'sp6',mag:20,rt:1.8,cd:.2,dmg:75,sp:600,life:.7,spr:.01,kb:90,pierce:1,snd:'shot',noise:25,
    ico:[[0,1,16,5,'#2a2a2e'],[16,2,16,3,'#3a2a1a'],[11,5,3,6,'#1a1a1e'],[6,-1,8,2,'#141418']],ov:[[5,11,19,3,'#2a2a2e'],[5,11,6,3,'#3a2a1a'],[10,9,6,1,'#141418']]},
  ags:{slot:'t',n:'ГРАНАТОМЁТ АГС',pose:'shotgun',am:'vog',mag:10,rt:3.0,cd:.45,dmg:34,sp:260,life:.5,spr:.05,kb:120,snd:'slug',noise:250,shake:.4,boom:42,col:'#c8ff8a',
    ico:[[0,0,24,8,'#4a5a3a'],[24,2,8,4,'#2a2a2e'],[6,8,10,4,'#3a4a2a'],[2,1,6,1,'#7a8a5a']],ov:[[6,10,18,6,'#4a5a3a'],[22,12,3,2,'#2a2a2e']]},
});
for(const k of ['mp5','sawn','saiga','xbow','nailgun','flare','machete','axe2','sledge','katana','minigun','pech','vint','ags'])if(C1.WNAME)C1.WNAME[k]=WD[k].n;
try{UP.applyWU&&UP.applyWU()}catch(e){}
const WTXT={mp5:'Почти бесшумный: стелс-зачистка.',sawn:'Два выстрела в упор, сносит с ног.',saiga:'Автоматический дробовик: 8 выстрелов подряд.',xbow:'Бесшумный, болт прошивает.',
  nailgun:'Пригвождает зомби на 2 секунды.',flare:'Поджигает и подсвечивает тёмные места.',machete:'Быстрое, рубит по дуге.',axe2:'Медленный, обычного зомби — с одного удара.',
  sledge:'Сбивает с ног всех вокруг.',katana:'Легендарное холодное: широкий быстрый удар.',minigun:'Раскручивается секунду, потом косит всё. Медленно бегаешь.',
  pech:'Уникальный: 100 патронов, прошивает. Патроны — только в бункере.',vint:'Уникальный бесшумный снайперский. Патроны СП-6 — только в бункере.',ags:'Уникальный: очередь гранат. ВОГ — только в бункере.'};
ARS.WTXT=WTXT;

// ================= находки оружия =================
const SECW={1:['mp5'],3:['xbow'],4:['saiga'],6:['sledge'],7:['flare'],8:['katana','minigun']};
function owns(k){const s=SV();return !!((s.own&&s.own[k])||(PS.own&&PS.own[k]))}
function grantNow(k,why){UP.grant(k);if(C1.giveWpn)C1.giveWpn(k,true);note((why||'Новое оружие: ')+WD[k].n+(WTXT[k]?' — '+WTXT[k]:''));sfx('pick');save()}
ARS.grant=grantNow;
function addWpnItem(L,k,x,y){const f=E.freeSpot(x,y,5,60)||[x,y];E.addItem('wpn',f[0],f[1],k)}
ARS.addWpnItem=addWpnItem;

// ================= ресурсы: электроника, ядра, жетоны =================
function addRes(k,n,x,y){const s=SV();s[k]=(s[k]|0)+n;const nm={elec:'средн. деталь',core:'РЕДКАЯ ДЕТАЛЬ',leg:'ЛЕГЕНДАРНАЯ ДЕТАЛЬ',tok:'жетон'}[k]||k;X.floatT(x,y-14,'+'+n+' '+nm,k==='leg'?'#ff9a2a':k==='core'?'#ffd23a':k==='tok'?'#c8ff8a':'#6ab8ff');save()}
ARS.addRes=addRes;
const _kill=C1.onKillAny;
C1.onKillAny=function(z){if(_kill)_kill(z);try{const L=E.L;if(!L||!L.armed||z.fake)return;
  // 04.11 баланс (Natalia): средних больше, редких и легендарных меньше
  if(z.type==='boss'){addRes('core',1,z.x,z.y);addRes('elec',2,z.x,z.y+6);if(Math.random()<.4)addRes('leg',1,z.x,z.y+12);if(L.id==='so_bunk')addRes('tok',10,z.x,z.y+6)}
  else if(z.nm){addRes('elec',2,z.x,z.y);if(Math.random()<.3)addRes('core',1,z.x,z.y+6);if(Math.random()<.04)addRes('leg',1,z.x,z.y+12);if(L.id==='so_bunk')addRes('tok',10,z.x,z.y+6)}
  else if((z.type==='gunner'||z.type==='armor'||z.type==='raider')&&Math.random()<.35)addRes('elec',1,z.x,z.y);
  else if(Math.random()<.035)addRes('elec',1,z.x,z.y);
  if(L.id&&L.id.startsWith('so_bunk')&&z.type!=='boss'&&(z.type==='gunner'||z.type==='armor'||z.type==='raider'||Math.random()<.3))addRes('tok',1,z.x,z.y)}catch(e){console.warn(e)}};
if(window.HM&&HM.openCache){const oc=HM.openCache;HM.openCache=function(c){const g=c.gold;oc(c);if(g){addRes('elec',2,c.x,c.y);if(Math.random()<.12)addRes('core',1,c.x,c.y+6);if(Math.random()<.02)addRes('leg',1,c.x,c.y+12)}else if(Math.random()<.3)addRes('elec',1,c.x,c.y)}}

// новые предметы на уровнях
const NEWAM={nlg:1,flr:1,bolt:1,pkm:1,sp6:1,vog:1};
const _pick=C1.onPick;
C1.onPick=function(it){if(_pick)_pick(it);
  if(NEWAM[it.kind]){PS[it.kind]=(PS[it.kind]||0)+it.n;X.floatT(it.x,it.y,'+'+it.n+' '+C1.AMN[it.kind],'#ffe27a')}
  if(it.kind==='selec')addRes('elec',it.n,it.x,it.y);if(it.kind==='score')addRes('core',it.n,it.x,it.y);if(it.kind==='stok')addRes('tok',it.n,it.x,it.y)};
function drawMine(L){for(const it of L.items){if(it.taken)continue;const x=Math.round(it.x),y=Math.round(it.y+Math.sin(tm*3+it.x));let k=it.kind;
  if(k==='selec'){F(x-4,y-3,8,6,'#1a3a2a');F(x-3,y-2,6,4,'#2a8a4a');F(x-2,y-1,1,1,'#ffd23a');F(x+1,y,1,1,'#ffd23a');F(x-4,y+3,1,1,'#c8c8c8');F(x+3,y+3,1,1,'#c8c8c8')}
  else if(k==='score'){const a=.6+.4*Math.sin(tm*6);ctx.fillStyle=`rgba(255,210,60,${.3*a})`;ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();F(x-2,y-3,5,6,'#ffd23a');F(x-1,y-2,3,4,'#fff6b0')}
  else if(k==='stok'){F(x-3,y-2,6,4,'#8a9a6a');F(x-2,y-1,4,2,'#c8d8a0')}
  else if(NEWAM[k]){F(x-4,y-3,8,6,k==='vog'?'#4a5a3a':k==='flr'?'#8a2a1a':'#5a5a62');F(x-4,y-3,8,1,'#9a9aa2');F(x-2,y-1,4,2,k==='nlg'?'#c8ccd4':'#e8c050')}
  else continue;
  const a=.25+.25*Math.sin(tm*5+it.x);ctx.strokeStyle=`rgba(255,240,180,${a})`;ctx.strokeRect(x-6.5,y-7.5,13,15)}}
ARS.drawMine=drawMine;

// ================= В2–В6, О10: действия в бою =================
const A={stimT:0,inf0:0,traps:[],pins:[],flares:[],tl:[],spin:0,vape:[],lastSw:0,seenB:new WeakSet()};ARS.A=A;
function canAct(){const L=E.L;return state==='play'&&C1.on&&C1.mode==='td'&&L&&L.armed&&!dlg&&!cut&&!C1.over&&!(UP.isOpen&&UP.isOpen())&&!(window.MG&&MG.active)&&!lockMove}
function stim(){const s=SV();if(!canAct())return;if((s.stim|0)<=0){note('Нет стимуляторов — собери на верстаке');return}s.stim--;A.stimT=10;A.inf0=PS.inf||0;sfx('power',.8);X.floatT(pl.x,pl.y-14,'СТИМУЛЯТОР!','#ffd23a');save()}
function grenade(){const s=SV();if(!canAct())return;let t=null;if((s.nade|0)>0)t='nade';else if((s.term|0)>0)t='term';if(!t){note('Нет гранат — собери на верстаке');return}
  s[t]--;save();const L=E.L,a=pl.a;let d=90;const aim=window.mouse&&mouse.on&&!touch.on?D2(pl.x,pl.y,mouse.x+camX,mouse.y+camY):90;d=Math.max(30,Math.min(110,aim));
  const sp=210,b={x:pl.x+Math.cos(a)*8,y:pl.y+Math.sin(a)*8,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,dmg:t==='term'?44:36,life:d/sp,pierce:9,kb:160,hit:[],col:t==='term'?'#ff8a20':'#c8ccd4',boom:t==='term'?36:46,_a:1};
  L.buls.push(b);if(t==='term')A.tl.push({b,term:1});sfx('swing');note(t==='term'?'Термитная!':'Гвоздевая граната!')}
function trap(){const s=SV();if(!canAct())return;let t=null;if((s.etrap|0)>0)t='etrap';else if((s.clay|0)>0)t='clay';if(!t){note('Нет ловушек (Z) — собери на верстаке. Растяжка — на T');return}
  s[t]--;save();A.traps.push({t,x:pl.x,y:pl.y,a:pl.a,L:E.L,arm:.8,on:0});sfx('click');note(t==='etrap'?'Электрокапкан поставлен':'Клеймор: взрыв вперёд по направлению взгляда')}
function vape(){const s=SV();if(!canAct())return;if((s.vape|0)<=0){note('Вейп пуст. Заправка — в табачке');return}s.vape--;save();A.vape.push({x:pl.x,y:pl.y,t:6,L:E.L});sfx('hiss',1);X.floatT(pl.x,pl.y-14,'*пф-ф-ф*','#e8e8ff')}
ARS.stim=stim;ARS.grenade=grenade;ARS.trap=trap;ARS.vape=vape;
const _key=C1.onKey;
C1.onKey=function(c,e){if(_key)_key(c,e);if(c==='KeyX')stim();if(c==='KeyG')grenade();if(c==='KeyZ')trap();if(c==='KeyK')vape()};
const vis=()=>touch.on&&canAct();
C1.xbtn.push(
  {x:W-118,y:H-78,r:8,t:'ГРАНАТА',col:'#c8ccd4',vis:()=>vis()&&((SV().nade|0)+(SV().term|0))>0,act:grenade},
  {x:W-88,y:H-92,r:8,t:'ЛОВУШ.',col:'#8af0ff',vis:()=>vis()&&((SV().etrap|0)+(SV().clay|0))>0,act:trap},
  {x:W-142,y:H-66,r:8,t:'СТИМ',col:'#ffd23a',vis:()=>vis()&&(SV().stim|0)>0,act:stim},
  {x:W-114,y:H-102,r:8,t:'ВЕЙП',col:'#e8e8ff',vis:()=>vis()&&(SV().vape|0)>0,act:vape});

// ================= Шмакодявка-напарница =================
// 02.11: вместо пистолета — скакалка как плётка, урон совсем маленький (общий множитель союзников C1.allyMul в hurtZ)
function whipHit(A,tg){sfx('swing',1.4);C1._src='ally';try{X.hurtZ(tg,tg.type==='boss'?8:18,Math.atan2(tg.y-A.y,tg.x-A.x),tg.type==='boss'?0:40)}finally{C1._src=null}
  E.L.fx.push({x:tg.x,y:tg.y-2,vx:0,vy:-20,life:.15,c:'#ff8ac8'})}
function drawRope(x,y,a,sw){try{const ca=Math.cos(a),sa=Math.sin(a),hx=x+ca*4-sa*4,hy=y+sa*4+ca*4;ctx.save();ctx.lineWidth=1;ctx.strokeStyle='#ff5aa8';ctx.beginPath();ctx.moveTo(hx,hy);
  if(sw>0){const k=1-sw/.18,ln=10+16*Math.sin(k*Math.PI),aa=a+.9-1.8*k,ex=x+Math.cos(aa)*ln,ey=y+Math.sin(aa)*ln;ctx.quadraticCurveTo(x+Math.cos(aa+.5)*ln*.6,y+Math.sin(aa+.5)*ln*.6,ex,ey);ctx.stroke();ctx.restore();F(ex-1,ey-1,2,2,'#ffd23a')}
  else{const tx=x-ca*3-sa*7,ty=y-sa*3+ca*7;ctx.quadraticCurveTo(x-ca*8,y-sa*8,tx,ty);ctx.stroke();ctx.restore();F(hx-1,hy-1,2,2,'#ffd23a');F(tx-1,ty-1,2,2,'#ffd23a')}}catch(e){}}
ARS.whipHit=whipHit;ARS.drawRope=drawRope;
const SH={on:false,x:0,y:0,a:0,ph:0,mv:false,cd:1,fl:0,L:null,quip:8,hi:{}};ARS.SH=SH;
const shCv=mk(24),shLg=mk(24);shCv.getContext('2d',{willReadFrequently:true});shLg.getContext('2d',{willReadFrequently:true});
function shWanted(L){if(!L||L.hero||L.noShmak)return false;const ch=curCh();
  if(ch===1&&L.id==='fort')return !!C1.called; // 04.11: во дворе после звонка Аниса идёт с Микробом
  if(!L.armed)return false;
  if(ch===1&&/^off/.test(L.id))return false; // 04.11: в офисах ждёт в лифте
  if(ch===4&&!(L.id&&L.id.startsWith('so_')))return false; // 04.11: в гл.4 у неё свой союзник с дробовиком — без второй копии
  if(ch===3||ch===5||ch===6||ch===2)return ch===2&&L.id&&L.id.startsWith('so_'); // гл.2 — она сама героиня, но на вылазках с Микробом
  if(L.id&&L.id.startsWith('so_'))return !!C1.called||ch>=2;
  if(ch===1)return L.id!=='fort';
  return true}
const SHQ=['Шмакодявка: «Сзади, зай!»','Шмакодявка: «На, скакалкой!»','Шмакодявка: «Я прикрываю»','Шмакодявка: «Раз-два, прыг-скок!»','Шмакодявка: «Фу, он ещё шевелится»','Шмакодявка: «Не отставай!»'];
function shSpawn(L){SH.L=L;SH.on=true;const f=E.freeSpot(pl.x-12,pl.y+10,4,40)||[pl.x,pl.y];SH.x=f[0];SH.y=f[1];SH.a=pl.a;SH.cd=1;
  L.npcs=L.npcs||[];L.npcs.push({draw(){if(!SH.on||SH.L!==E.L)return;const g=shLg.getContext('2d');legs(g,SH.ph,SH.mv,'#f2cab2','#0e0e12');shadowBlob(SH.x,SH.y,4.5);spr(shLg,SH.x,SH.y,SH.ma||SH.a);
    if(window.SHMAK_DRAW){window.SHMAK_DRAW(shCv.getContext('2d'),null,false)}spr(shCv,SH.x,SH.y,SH.a);drawRope(SH.x,SH.y,SH.a,SH.sw||0)}});
  const ch=curCh();if(!SH.hi[ch]&&ch!==1){SH.hi[ch]=1;after(1.2,()=>note('Шмакодявка с тобой: хлещет зомби скакалкой (урон совсем небольшой)'))}}
function shTick(dt){const L=E.L;if(!SH.on||SH.L!==L)return;if(dlg||cut||C1.over){SH.mv=false;return}
  SH.cd-=dt;SH.fl-=dt;SH.quip-=dt;const d=D2(SH.x,SH.y,pl.x,pl.y);
  if(d>220){const f=E.freeSpot(pl.x-Math.cos(pl.a)*14,pl.y-Math.sin(pl.a)*14,4,40);if(f){SH.x=f[0];SH.y=f[1]}}
  // цель
  let tg=null,bd=150;for(const z of L.zs){if(z.dead||z.st==='hidden'||z.st==='rise')continue;const dz=D2(SH.x,SH.y,z.x,z.y);
    if(z.st==='idle'&&dz>46)continue;if(dz<bd&&E.los(SH.x,SH.y,z.x,z.y)){bd=dz;tg=z}}
  // ход: держится сзади-сбоку
  const bx=pl.x-Math.cos(pl.a)*16+Math.cos(pl.a+Math.PI/2)*10,by=pl.y-Math.sin(pl.a)*16+Math.sin(pl.a+Math.PI/2)*10;SH.mv=false;
  const chase=tg&&D2(tg.x,tg.y,pl.x,pl.y)<120&&d<90,gx=chase?tg.x:bx,gy=chase?tg.y:by;if(SH.sw>0)SH.sw-=dt;
  if(chase?bd>tg.r+16:(D2(SH.x,SH.y,bx,by)>8&&d>18)){let dir=Math.atan2(gy-SH.y,gx-SH.x);if(!E.los(SH.x,SH.y,gx,gy)&&window.K56&&K56.navDir){const nd=K56.navDir(SH);if(nd!=null)dir=nd}
    const sp=d>70?92:68,nx=SH.x+Math.cos(dir)*sp*dt,ny=SH.y+Math.sin(dir)*sp*dt;if(!E.solidAt(nx,SH.y,3.5))SH.x=nx;if(!E.solidAt(SH.x,ny,3.5))SH.y=ny;SH.ma=dir;SH.mv=true;SH.ph+=dt*13}
  const fa=tg?Math.atan2(tg.y-SH.y,tg.x-SH.x):(SH.mv?SH.ma:pl.a);SH.a+=ad(fa,SH.a)*Math.min(1,dt*10);
  if(tg&&SH.cd<=0&&bd<tg.r+24&&Math.abs(ad(fa,SH.a))<.5){SH.cd=rn(.6,.85);SH.sw=.18;whipHit(SH,tg);
    if(SH.quip<=0&&Math.random()<.3){SH.quip=rn(9,16);X.floatT(SH.x,SH.y-12,SHQ[(Math.random()*SHQ.length)|0],'#ffb0d8')}}
}

// ================= общий тик =================
let lastL=null;
function onNewLevel(L){A.traps=A.traps.filter(t=>t.L===L);A.vape=[];A.tl=[];A.pins=[];
  const du=L.drawUnder;L.drawUnder=()=>{if(du)du();try{drawMine(L);drawTraps(L)}catch(e){}};
  const dO=L.drawOver;L.drawOver=()=>{if(dO)dO();try{drawVape(L)}catch(e){}};
  SH.on=false;if(shWanted(L))shSpawn(L);
  // находки оружия
  const ch=curCh();
  if(L.secret&&SECW[ch]){for(const k of SECW[ch]){if(owns(k))continue;if(ch===3||ch===6){after(.8,()=>grantNow(k,(ch===3?'Черсик нашёл в секретке: ':'В секретке: ')+''));continue}addWpnItem(L,k,L.w/2,L.h/2)}
    E.addItem('selec',L.w/2-12,L.h/2+10,2);E.addItem('score',L.w/2+12,L.h/2+10,1)}
  if(L.id==='town5'&&!owns('machete'))addWpnItem(L,'machete',pl.x+30,pl.y-20);
}
function tick(dt){
  const L=E.L;if(!C1.on||!L||state!=='play'){A.spin=0;return}
  if(L!==lastL){lastL=L;if(C1.mode==='td')onNewLevel(L)}
  if(C1.mode!=='td')return;
  const s=SV();
  // аптечка сама
  if((s.kit|0)>0&&PS.hp>0&&PS.hp<PS.max*.25&&L.armed&&!C1.over){s.kit--;PS.hp=Math.min(PS.max,PS.hp+80);PS.inf=0;sfx('pick');X.floatT(pl.x,pl.y-14,'АПТЕЧКА +80','#3aff7a');save()}
  // стимулятор
  if(A.stimT>0){A.stimT-=dt;C1.spdMul=(C1.spdMul||1)*1.3;if((PS.inf||0)>A.inf0)PS.inf=A.inf0}
  // новые пули игрока: спецпатроны, гвозди, ракеты
  for(const b of L.buls){if(A.seenB.has(b))continue;A.seenB.add(b);if(b._a||b.ally)continue;if(D2(b.x,b.y,pl.x,pl.y)>26)continue;const d=WD[PS.wpn];if(!d)continue;
    if((s.apA|0)>0){s.apA--;b.ap=1;b.pierce=(b.pierce|0)+1;b.col='#8af0ff'}else if((s.expA|0)>0){s.expA--;b.dmg*=1.4;b.col='#ff9a4a'}
    if(d.pin)A.pins.push(b);if(d.flare)A.flares.push({b,t:0})}
  for(let i=A.pins.length-1;i>=0;i--){const b=A.pins[i];for(const z of b.hit){if(!z._pin){z._pin=1;z.stun=Math.max(z.stun||0,2);X.floatT(z.x,z.y-10,'ПРИГВОЗДИЛ','#c8ccd4')}}if(b.life<=0){for(const z of b.hit)z._pin=0;A.pins.splice(i,1)}}
  // ракетница: светит 8 с там, где упала
  for(const t of A.tl)if(t.term&&t.b.life<=0&&!t.done){t.done=1;try{X.igniteAt&&X.igniteAt(t.b.x,t.b.y)}catch(e){}for(const z of L.zs){if(z.dead)continue;if(D2(z.x,z.y,t.b.x,t.b.y)<40){z.burn=Math.max(z.burn||0,6);if(z.type==='armor'||z.type==='shield')X.hurtZ(z,80,0,0)}}}
  A.tl=A.tl.filter(t=>!t.done);
  for(let i=A.flares.length-1;i>=0;i--){const f=A.flares[i];if(f.b.life<=0){f.t+=dt;if(f.t>8){A.flares.splice(i,1)}}}
  if(L.lights){if(L._arsL)for(const q of L._arsL){const j=L.lights.indexOf(q);if(j>=0)L.lights.splice(j,1)}L._arsL=A.flares.map(f=>[f.b.x,f.b.y,70,1]);L.lights.push(...L._arsL)}
  // миниган раскручивается
  const firing=(C1.mdown&&mouse.on&&!touch.on)||X.touchFiring()||C1.fire!=null;
  const SW=WD[PS.wpn];if(SW&&SW.spin){A.spin=Math.max(0,Math.min(1,A.spin+(firing?dt*(PS.wpn==='gatl'?.85:1.1):-dt*1.6)));SW.cd=(SW.cdMin||.035)+(1-A.spin)*.3}else A.spin=0;
  // кувалда сбивает всех вокруг
  if(PS.wpn==='sledge'&&(PS.swing||0)>0&&A.lastSw<=0){for(const z of L.zs){if(z.dead||z.st==='hidden'||z.type==='boss')continue;if(D2(z.x,z.y,pl.x,pl.y)<34){z.down=Math.max(z.down||0,1.6);z.stun=Math.max(z.stun||0,1)}}C1.shake=Math.max(C1.shake,.4)}
  A.lastSw=PS.swing||0;
  // ловушки
  for(let i=A.traps.length-1;i>=0;i--){const t=A.traps[i];if(t.L!==L)continue;t.arm-=dt;if(t.on>0){t.on-=dt;if(t.on<=0)A.traps.splice(i,1);continue}if(t.arm>0)continue;
    for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const dz=D2(z.x,z.y,t.x,t.y);
      if(t.t==='etrap'&&dz<14){t.on=4;sfx('zap',1);for(const q of L.zs)if(!q.dead&&D2(q.x,q.y,t.x,t.y)<44){q.stun=Math.max(q.stun||0,4);q.flash=.2}break}
      if(t.t==='clay'&&dz<30&&Math.abs(ad(Math.atan2(z.y-t.y,z.x-t.x),t.a))<.8){sfx('boom');C1.shake=1;for(const q of L.zs){if(q.dead)continue;const dq=D2(q.x,q.y,t.x,t.y),qa=Math.atan2(q.y-t.y,q.x-t.x);if(dq<80&&Math.abs(ad(qa,t.a))<.7)X.hurtZ(q,q.type==='boss'?120:260,qa,300)}
        for(let k=0;k<30;k++){const q=t.a+rn(-.7,.7),v=rn(60,200);L.fx.push({x:t.x,y:t.y,vx:Math.cos(q)*v,vy:Math.sin(q)*v,life:rn(.2,.5),c:k%3?'flame':'#ffe27a'})}A.traps.splice(i,1);break}}}
  // вейп-облако: внутри тебя не видят
  for(let i=A.vape.length-1;i>=0;i--){const v=A.vape[i];v.t-=dt;if(v.t<=0||v.L!==L){A.vape.splice(i,1);continue}
    if(D2(pl.x,pl.y,v.x,v.y)<42)for(const z of L.zs){if(z.dead||z.type==='boss')continue;if((z.st==='chase'||z.st==='search')&&D2(z.x,z.y,v.x,v.y)>30){z.st='alert';z.alT=3;z.tx=v.x+rn(-40,40);z.ty=v.y+rn(-40,40);z.hunt=0}}}
  shTick(dt);
}
function drawTraps(L){for(const t of A.traps){if(t.L!==L)continue;
  if(t.t==='etrap'){F(t.x-4,t.y-2,8,4,'#3a3a42');F(t.x-3,t.y-1,6,2,t.on>0?(Math.sin(tm*40)>0?'#8af0ff':'#fff'):'#4a8aa0');if(t.on>0){ctx.strokeStyle='rgba(140,240,255,.6)';ctx.beginPath();ctx.arc(t.x,t.y,44*(.6+.4*Math.sin(tm*20)),0,TAU);ctx.stroke()}}
  else{ctx.save();ctx.translate(t.x,t.y);ctx.rotate(t.a);F(-2,-4,4,8,'#4a5a3a');F(1,-3,1,6,'#2a3a1a');ctx.restore();if(Math.sin(tm*6)>0)F(t.x-1,t.y-1,1,1,'#ff3030')}}}
function drawVape(L){for(const v of A.vape){if(v.L!==L)continue;const a=Math.min(1,v.t/1.5);for(let i=0;i<9;i++){const q=i*.7+tm*.3,r=22+8*Math.sin(tm+i);ctx.fillStyle=`rgba(225,225,240,${.18*a})`;ctx.beginPath();ctx.arc(v.x+Math.cos(q)*r*.6,v.y+Math.sin(q)*r*.6,r,0,TAU);ctx.fill()}}}
const _upd=update;update=function(dt){_upd(dt);try{tick(dt)}catch(e){console.warn(e)}};
// HUD: запас гаджетов
const _render=render;
render=function(){_render();try{const L=E.L;if(state!=='play'||!C1.on||C1.mode!=='td'||!L||!L.armed||L.noHud||dlg||cut||(UP.isOpen&&UP.isOpen())||(window.SORTIE&&(SORTIE.isMap()||SORTIE.isPrap())))return;
  const s=SV(),it=[];if(s.nade|0)it.push('G гвозд.'+s.nade);if(s.term|0)it.push('G терм.'+s.term);if(s.etrap|0)it.push('Z капк.'+s.etrap);if(s.clay|0)it.push('Z клейм.'+s.clay);if(s.stim|0)it.push('X стим'+s.stim);if(s.vape|0)it.push('K вейп'+s.vape);if(s.kit|0)it.push('аптечка'+s.kit);
  if(s.apA|0)it.push('БРОНЕБ. '+s.apA);else if(s.expA|0)it.push('ЭКСП. '+s.expA);if(A.stimT>0)it.push('СТИМ '+Math.ceil(A.stimT)+'с');if(WD[PS.wpn]&&WD[PS.wpn].spin)it.push('РАСКРУТКА '+Math.round(A.spin*100)+'%');
  if(!it.length)return;const k=ui.width/W;u.setTransform(k,0,0,k,0,0);uiFont(3.8,true);u.fillStyle='rgba(8,5,16,.6)';const tx=it.join('  ·  ');const w=u.measureText(tx).width+8;u.fillRect(4,58,w,8);u.fillStyle='#e8e4f0';u.fillText(tx,8,63.5)}catch(e){}};
// УЗИ из старых сохранений: были «холодным» — переносим в двуручный слот
setTimeout(()=>{try{const s=SV();for(const lo of [s.lo,PS.lo])if(lo&&lo.m==='uzi'){lo.m='bat';if(!lo.t)lo.t='uzi'}}catch(e){}},500);
})();
