// =====================================================================
//  zombies2.js — 14 новых зомби (04.11, разбор игры, согласовано Натальей).
//  Сначала каждый «вылазочный» тип встречается на своей вылазке, после её зачистки
//  изредка выходит и в главы. Поздние — в своих главах и дальше.
//  Хуки: C1.zConv (превращение обычных), C1.zInit, C1.zAI, C1.zHurt (в hurtZ), C1.onKillAny.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.engine||!C1.X)return;
const E=C1.engine,X=C1.X,ZT=X.ZT,TAU=Math.PI*2,sfx=X.sfx,PS=C1.PS;
const rn=(a,b)=>a+Math.random()*(b-a),D2=(a,b,c,d)=>Math.hypot(a-c,b-d);
const ad=(a,b)=>{let d=a-b;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
const Z2={};window.Z2=Z2;
// sp — базовая (движок умножает её примерно на 2.4)
Object.assign(ZT,{
  cashier:{hp:50,sp:13,r:4,dmg:8}, janitor:{hp:80,sp:14,r:4,dmg:8}, courier:{hp:40,sp:30,r:4,dmg:0}, burner:{hp:60,sp:16,r:4,dmg:12},
  vaper:{hp:55,sp:14,r:4,dmg:9}, loader:{hp:120,sp:12,r:5,dmg:12}, electric:{hp:70,sp:15,r:4,dmg:10}, gasmask:{hp:110,sp:12,r:4,dmg:12},
  sporer:{hp:60,sp:14,r:4,dmg:10}, sandman:{hp:90,sp:16,r:4,dmg:13}, ram:{hp:170,sp:12,r:5,dmg:16}, bomber:{hp:70,sp:13,r:4,dmg:10},
  sample:{hp:160,sp:15,r:4,dmg:14}, labrat:{hp:70,sp:13,r:4,dmg:8}});
const INFO={
  cashier:'Кассирша! Кидается консервами из-за прилавка — сближайся зигзагом.',
  janitor:'Зомби-дворник! Длинная метла сбивает с ног — не стой рядом после замаха.',
  courier:'Курьер с коробом! Не нападает, удирает. Догони — из короба выпадет лут.',
  burner:'Горящий! Оставляет за собой огонь. Не беги по его следу.',
  vaper:'Вейпер! Пускает облако — в дыму прячутся другие зомби.',
  loader:'Грузчик с тележкой! Замирает и таранит по прямой — уходи вбок.',
  electric:'Электрик! Бьёт током вблизи и гасит радар. С него падает электроника.',
  gasmask:'Солдат в противогазе! Кидает гранаты — уходи из красного круга.',
  sporer:'Споровик! После смерти оставляет облако спор — заражение растёт.',
  sandman:'Песчаник! Рвёт в облаке песка и заходит за спину.',
  ram:'Таран с дверью-щитом! Спереди почти неуязвим — бей сбоку и в спину.',
  bomber:'Подрывник с баллоном! Взрывается при смерти — стреляй издалека.',
  sample:'Образец! Привыкает к оружию — меняй ствол.',
  lab:'Лаборант! Лечит зомби вокруг — убей его первым.'};
INFO.labrat=INFO.lab;
// ---------- спрайты ----------
const SKN=['#7fa070','#86a676','#76966a','#8aa87a'];
function base(g,v,sh,shd,arms){const SK=SKN[v%4];if(arms!==false){P(g,11,6,9,3,sh);P(g,19,6,3,3,SK);P(g,11,15,9,3,sh);P(g,19,15,3,3,SK)}
  ell(g,11,12,4.6,7.6,sh);ell(g,9.6,12,3.2,6.8,shd||shade(sh,.72));return SK}
function head(g,SK,hc){ell(g,14,12,3.6,3.6,hc||SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
const ART={
  cashier(g,v){const SK=base(g,v,'#c8302a','#a02020');P(g,8,8,6,8,'#e8e4d8');P(g,9,10,3,1,'#2a2a30');head(g,SK);P(g,12,9,3,6,'#d8b040');P(g,20,6,3,3,'#c8c8d0');P(g,21,7,1,1,'#ff5040')},
  janitor(g,v){const SK=base(g,v,'#e07a1a','#b85a10');P(g,7,7,1,10,'#e8e840');P(g,13,7,1,10,'#e8e840');head(g,SK,'#6a6a72');P(g,18,4,2,16,'#8a6a40');P(g,19,2,4,4,'#c8b060');for(let i=0;i<4;i++)P(g,20+i,1,1,6,'#a89040')},
  courier(g,v){const SK=base(g,v,'#3a6ae8','#2a4ab8');P(g,2,6,7,12,'#ffd23a');P(g,3,7,5,10,'#ffe060');P(g,4,11,3,1,'#2a2a30');head(g,SK,'#2a4ab8');P(g,14,9,2,1,'#ffd23a')},
  burner(g,v){const SK=base(g,v,'#3a2a20','#2a1a14');for(let i=0;i<6;i++)P(g,7+((i*5)%8),6+((i*7)%11),2,2,i%2?'#ff7a1a':'#ffd040');head(g,'#5a3a2a');P(g,12,9,2,2,'#ff7a1a')},
  vaper(g,v){const SK=base(g,v,'#5a3a8a','#3a2a6a');P(g,7,8,5,8,'#8a5ac8');head(g,SK);P(g,13,8,3,2,'#141418');P(g,18,12,4,2,'#c8c8d0');P(g,22,11,2,4,'#d8e8ff')},
  loader(g,v){const SK=base(g,v,'#4a6a3a','#3a5a2a');head(g,SK,'#e07a1a');P(g,17,3,2,18,'#8a9098');P(g,19,3,5,2,'#8a9098');P(g,19,19,5,2,'#8a9098');P(g,22,5,2,14,'#5a5e66');for(let y=6;y<18;y+=3)P(g,19,y,3,1,'#6a6e78')},
  electric(g,v){const SK=base(g,v,'#3a4a8a','#2a3a6a');P(g,7,7,1,10,'#ffd23a');head(g,SK,'#ffd23a');P(g,19,10,4,1,'#3ad8ff');P(g,21,9,1,3,'#3ad8ff');P(g,5,5,1,2,'#8af0ff');P(g,4,16,1,2,'#8af0ff')},
  gasmask(g,v){const SK=base(g,v,'#4a5432','#3a4426');P(g,7,7,6,10,'#2e3420');P(g,4,9,2,6,'#5a6a3a');ell(g,14,12,3.8,3.8,'#2a2e24');P(g,16,11,2,3,'#3a3a40');P(g,15,9,2,2,'#8ab0c8');P(g,15,14,2,2,'#8ab0c8');P(g,18,12,2,1,'#5a5e66');P(g,18,5,3,3,'#4a5a2a')},
  sporer(g,v){const SK=base(g,v,'#5a6a3a','#4a5a2a');for(let i=0;i<7;i++)ell(g,6+((i*5)%10),5+((i*7)%14),1.6,1.6,i%2?'#c8e040':'#8ac83a');head(g,SK);ell(g,13,9,1.6,1.6,'#c8e040')},
  sandman(g,v){const SK=base(g,v,'#c8a868','#a88848');P(g,6,6,2,12,'#e8d098');head(g,'#b89858');P(g,12,8,4,8,'#d8c088');P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')},
  ram(g,v){const SK=base(g,v,'#4a4a52','#3a3a42');head(g,SK);P(g,18,2,4,20,'#8a6a40');P(g,19,3,2,18,'#a8844e');P(g,19,11,2,2,'#d8b040');P(g,18,2,4,1,'#5a4a30');P(g,18,21,4,1,'#5a4a30')},
  bomber(g,v){const SK=base(g,v,'#6a5a4a','#5a4a3a');ell(g,6,12,3.4,6,'#c8302a');P(g,4,7,4,1,'#ffffff');P(g,4,16,4,1,'#ffffff');P(g,2,11,2,2,'#8a9098');head(g,SK);P(g,9,6,1,12,'#2a2a30')},
  sample(g,v){const SK=base(g,v,'#c8d8e0','#a8b8c8');P(g,8,8,5,8,'#e8f0f4');P(g,9,11,3,2,'#ff3a4a');head(g,'#9ab8a0');P(g,12,10,3,4,'#3ef0b0');P(g,16,10,1,1,'#3ef0b0');P(g,16,14,1,1,'#3ef0b0')},
  labrat(g,v){const SK=base(g,v,'#f0f0f4','#c8c8d0');P(g,6,8,2,8,'#e8e8ec');head(g,SK);P(g,15,9,2,1,'#3a3a40');P(g,15,14,2,1,'#3a3a40');P(g,15,10,1,4,'#c8e8ff');P(g,19,11,3,2,'#3ef06a');P(g,21,10,1,4,'#e8e8ec')}};
function warm(){for(const t in ART)for(let v=0;v<8;v++){const k=t+v;if(X.zCache[k])continue;if(v>=4){X.zCache[k]=X.zCache[t+(v%4)];continue}
  try{const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});ART[t](g,v);try{if(X.shadeSpr&&window.NEON&&NEON.on)X.shadeSpr(c,g,true,X.hstr2(k))}catch(e){}outline(g,'#0b0910');X.zCache[k]=c}catch(e){console.warn('z2',t,e)}}}
try{warm()}catch(e){}
// ---------- где появляются ----------
const SO={mm:'cashier',by:'janitor',oz:'courier',gas:'burner',vape:'vaper',lenta:'loader',dns:'electric',bunk:'gasmask'};
const LATE=[[7,'sporer'],[8,'sandman'],[9,'ram'],[9,'bomber'],[10,'sample'],[10,'labrat']];
function curCh(){for(const n of [10,9,8,7,6,5,4,3,2])if(window['C'+n]&&window['C'+n].on)return n;return 1}
function soDone(){try{return (UP.SV().so||{}).done||{}}catch(e){return {}}}
function rates(){const r={};
  if(window.CS&&CS.on&&CS.id){const k=Object.keys(SO).find(id=>CS.id===id||CS.id==='so_'+id||String(CS.id).indexOf(id)>=0);if(k)r[SO[k]]=.24;return r}
  const ch=curCh();if(ch===3)return r;const dn=soDone();
  for(const id in SO)if(dn[id])r[SO[id]]=.025;
  for(const [c,t] of LATE)if(ch>=c)r[t]=ch===c?.09:.035;
  return r}
Z2.rates=rates;
const _conv=C1.zConv;
C1.zConv=function(type,o){let t=_conv?_conv(type,o):type;
  if(t!=='normal'||!o||o.nm||o.ai||o.boss||o.noConv)return t;
  const L=E.L;if(!L||C1.mode==='car'||C1.mode==='carK'||C1.mode==='ride')return t;
  const r=rates(),A=L.z2A||(L.z2A={});
  for(const k in r){A[k]=(A[k]==null?Math.random()*.7:A[k])+r[k];if(A[k]>=1){A[k]-=1;return k}}
  return t};
const _init=C1.zInit;
C1.zInit=function(z){if(ART[z.type]){z.v=(z.v|0)%4;if(!z.nm){const d=ZT[z.type];z.hp=z.max=d.hp}z.zc=rn(.5,1.5);z.sd=Math.random()<.5?1:-1}if(_init)_init(z)};
// ---------- поведение ----------
function bark(z,d,see){if(see&&d<170&&INFO[z.type]&&!(C1.seenT||(C1.seenT={}))[z.type]){C1.seenT[z.type]=1;if(window.note)note(INFO[z.type])}}
function throwAt(z,dmg,sp,c){const L=E.L,a=Math.atan2(pl.y-z.y,pl.x-z.x)+rn(-.08,.08);L.ebuls.push({x:z.x,y:z.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1.8,dmg})}
function push(z,k){const a=Math.atan2(pl.y-z.y,pl.x-z.x);try{const nx=pl.x+Math.cos(a)*k,ny=pl.y+Math.sin(a)*k;if(!E.solidAt(nx,ny,4)){pl.x=nx;pl.y=ny}}catch(e){}}
function boom(x,y,r,dP,dZ){const L=E.L;sfx('boom');C1.shake=Math.max(C1.shake||0,.5);
  for(let i=0;i<24;i++)L.fx.push({x,y,vx:rn(-90,90),vy:rn(-90,90),life:rn(.2,.6),c:i%2?'#ffd040':'#ff6a1a'});
  if(D2(x,y,pl.x,pl.y)<r)X.hurtPlayer(dP,'fire');for(const o of L.zs)if(!o.dead&&D2(x,y,o.x,o.y)<r)X.hurtZ(o,dZ,Math.atan2(o.y-y,o.x-x),120)}
const AI={
  cashier(z,d,see,dt,dir){z.zc-=dt;if(see&&d<150&&z.zc<=0){z.zc=rn(1.6,2.3);throwAt(z,9,120);sfx('swing',.5)}
    if(see){if(d<55)return {dir:Math.atan2(z.y-pl.y,z.x-pl.x),go:1};if(d<130)return {dir,go:0}}return {dir,go:1}},
  janitor(z,d,see,dt,dir){if(z.wind>0){z.wind-=dt;if(z.wind<=0){sfx('swing',1.2);if(d<32&&PS.inv<=0){X.hurtPlayer(14);push(z,18);PS.slow=1.2;X.floatT(pl.x,pl.y-12,'СБИЛ С НОГ!','#ffd040')}z.zc=1.3}return {dir,go:0}}
    z.zc-=dt;if(d<30&&z.zc<=0){z.wind=.4;z.cd=1;return {dir,go:0}}return {dir,go:1}},
  courier(z,d,see,dt,dir){z.cd=9;if(see&&d<180)return {dir:Math.atan2(z.y-pl.y,z.x-pl.x)+z.sd*.5,go:1};return {dir,go:Math.random()<.5?1:0}},
  burner(z,d,see,dt,dir){z.burn=0;z.zc-=dt;if(z.zc<=0&&z.st==='chase'){z.zc=1.6;E.L.fires.push({x:z.x,y:z.y,r:11,t:2.6})}if(Math.random()<dt*12)E.L.fx.push({x:z.x+rn(-3,3),y:z.y+rn(-3,3),vx:0,vy:-20,life:.4,c:'#ff7a1a'});return {dir,go:1}},
  vaper(z,d,see,dt,dir){z.zc-=dt;if(see&&d<170&&z.zc<=0){z.zc=rn(5,6.5);(E.L.z2smoke||(E.L.z2smoke=[])).push({x:z.x,y:z.y,t:6,r:42});sfx('hiss')}if(see&&d<70)return {dir:Math.atan2(z.y-pl.y,z.x-pl.x),go:1};return {dir,go:1}},
  loader(z,d,see,dt,dir){if(!z.sp0)z.sp0=z.sp;
    if(z.wind>0){z.wind-=dt;if(z.wind<=0){z.chg=.9;z.cdir=Math.atan2(pl.y-z.y,pl.x-z.x);sfx('thump',1.3)}return {dir,go:0}}
    if(z.chg>0){z.chg-=dt;z.sp=z.sp0*3.2;z.cd=9;if(d<13&&PS.inv<=0){X.hurtPlayer(20);push(z,26);z.chg=0}if(z.chg<=0){z.sp=z.sp0;z.cd=.8;z.zc=2.4}return {dir:z.cdir,go:1}}
    z.zc-=dt;if(see&&d>36&&d<150&&z.zc<=0){z.wind=.55;z.flash=.3;return {dir,go:0}}return {dir,go:1}},
  electric(z,d,see,dt,dir){z.zc-=dt;if(d<34&&z.zc<=0){z.zc=1.4;X.hurtPlayer(9);C1.radarOff=3;sfx('power',1.6);for(let i=0;i<10;i++)E.L.fx.push({x:z.x,y:z.y,vx:rn(-60,60),vy:rn(-60,60),life:.2,c:'#8af0ff'})}return {dir,go:1}},
  gasmask(z,d,see,dt,dir){z.zc-=dt;if(see&&d>45&&d<175&&z.zc<=0){z.zc=rn(3.2,4.2);(E.L.z2nade||(E.L.z2nade=[])).push({x:pl.x+rn(-8,8),y:pl.y+rn(-8,8),t:1.15,r:24});sfx('click',.8)}
    if(see){if(d<70)return {dir:Math.atan2(z.y-pl.y,z.x-pl.x),go:1};if(d<140)return {dir:Math.atan2(pl.y-z.y,pl.x-z.x)+Math.PI/2*z.sd,go:1}}return {dir,go:1}},
  sporer(z,d,see,dt,dir){if(Math.random()<dt*4)E.L.fx.push({x:z.x+rn(-4,4),y:z.y+rn(-4,4),vx:rn(-6,6),vy:rn(-10,-4),life:.8,c:'#c8e040'});return {dir,go:1}},
  sandman(z,d,see,dt,dir){z.zc-=dt;if(see&&d>55&&d<200&&z.zc<=0){z.zc=5;z.bur=1.2;sfx('thump',.6);X.floatT(z.x,z.y-8,'РЫВОК!','#e8d098')}return {dir,go:1}},
  ram(z,d,see,dt,dir){return {dir,go:1}},
  bomber(z,d,see,dt,dir){if(Math.random()<dt*2)E.L.fx.push({x:z.x-3,y:z.y,vx:rn(-5,5),vy:-8,life:.5,c:'smoke'});return {dir,go:1}},
  sample(z,d,see,dt,dir){return {dir,go:1}},
  labrat(z,d,see,dt,dir){z.zc-=dt;if(z.zc<=0){z.zc=.5;for(const o of E.L.zs)if(o!==z&&!o.dead&&o.hp<o.max&&D2(o.x,o.y,z.x,z.y)<56){o.hp=Math.min(o.max,o.hp+6);E.L.fx.push({x:o.x,y:o.y-6,vx:0,vy:-14,life:.5,c:'#3ef06a'})}}
    if(see&&d<100)return {dir:Math.atan2(z.y-pl.y,z.x-pl.x),go:1};return {dir,go:see?0:1}}};
C1.zAI=C1.zAI||{};
for(const t in AI){const f=AI[t];C1.zAI[t]=(z,d,see,dt,dir)=>{bark(z,d,see);return f(z,d,see,dt,dir)}}
// урон по ним
const _zh=C1.zHurt;
C1.zHurt=function(z,dmg,ang){if(_zh)dmg=_zh(z,dmg,ang);
  if(z.type==='ram'&&ang!=null){const hitFrom=ang+Math.PI;if(Math.abs(ad(hitFrom,z.a))<1.1){dmg*=.15;if(Math.random()<.3)X.floatT(z.x,z.y-10,'ДВЕРЬ!','#c8a060')}}
  if(z.type==='sample'){const w=PS.wpn||'?';z.ad=z.ad||{};z.ad[w]=(z.ad[w]||0)+1;const m=Math.max(.2,1-.1*(z.ad[w]-1));dmg*=m;if(m<.6&&!z.adN){z.adN=1;X.floatT(z.x,z.y-10,'ПРИВЫКАЕТ — МЕНЯЙ СТВОЛ','#3ef0b0')}}
  if(z.type==='burner'&&ang===0&&dmg<2)dmg=0; // свой огонь не жжёт
  return dmg};
const _kill=C1.onKillAny;
C1.onKillAny=function(z){if(_kill)_kill(z);try{const L=E.L;if(!L||z.fake)return;
  if(z.type==='courier'){L.items.push({kind:'rub',x:z.x,y:z.y,n:Math.round(rn(120,260)),taken:false});if(window.UP&&UP.pickAmmo){const k=UP.pickAmmo();L.items.push({kind:k,x:z.x+4,y:z.y+3,n:UP.qtyFor(k,10),taken:false})}if(Math.random()<.3&&window.ARS)ARS.addRes('elec',1,z.x,z.y);X.floatT(z.x,z.y-10,'КОРОБ!','#ffd23a')}
  if(z.type==='electric'&&Math.random()<.6&&window.ARS)ARS.addRes('elec',1,z.x,z.y);
  if(z.type==='burner')X.igniteAt(z.x,z.y);
  if(z.type==='bomber')boom(z.x,z.y,34,30,90);
  if(z.type==='sporer')(L.z2spore||(L.z2spore=[])).push({x:z.x,y:z.y,t:6,r:26});
  if(z.type==='gasmask'&&Math.random()<.25&&window.ARS)ARS.addRes('core',1,z.x,z.y)}catch(e){console.warn(e)}};
// ---------- такт: гранаты, дым, споры, песчаники ----------
function tick(dt){const L=E.L;if(!L||!L.zs||!C1.on)return;if(C1.radarOff>0)C1.radarOff-=dt;
  if(!L._z2d){L._z2d=1;(L.npcs=L.npcs||[]).push({draw:drawFx})}
  if(L.z2nade){for(const g of L.z2nade){g.t-=dt;if(g.t<=0)boom(g.x,g.y,g.r,24,60)}L.z2nade=L.z2nade.filter(g=>g.t>0)}
  if(L.z2smoke){for(const s of L.z2smoke)s.t-=dt;L.z2smoke=L.z2smoke.filter(s=>s.t>0)}
  if(L.z2spore){for(const s of L.z2spore){s.t-=dt;if(D2(s.x,s.y,pl.x,pl.y)<s.r&&C1.infect)C1.infect(.05*dt)}L.z2spore=L.z2spore.filter(s=>s.t>0)}
  for(const z of L.zs){if(z.dead||z.type!=='sandman'||!(z.bur>0))continue;z.bur-=dt;
    const tx=pl.x-Math.cos(pl.a||0)*22,ty=pl.y-Math.sin(pl.a||0)*22,a=Math.atan2(ty-z.y,tx-z.x),sp=95*dt;
    const nx=z.x+Math.cos(a)*sp,ny=z.y+Math.sin(a)*sp;if(!E.solidAt(nx,ny,3)){z.x=nx;z.y=ny}
    if(Math.random()<dt*10)L.fx.push({x:z.x+rn(-3,3),y:z.y+rn(-3,3),vx:rn(-8,8),vy:rn(-8,8),life:.4,c:'#c8a868'});
    if(z.bur<=0||D2(z.x,z.y,tx,ty)<6){z.bur=0;z.st='chase';z.hid=null;z.hunt=1;sfx('thump',.9);for(let i=0;i<10;i++)L.fx.push({x:z.x,y:z.y,vx:rn(-40,40),vy:rn(-40,40),life:.4,c:'#e8d098'})}}}
function drawFx(){const L=E.L;
  for(const g of L.z2nade||[]){const k=1-g.t/1.15;ctx.strokeStyle=`rgba(255,40,40,${.5+.4*Math.sin(k*30)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,TAU);ctx.stroke();ctx.fillStyle='rgba(255,40,40,.12)';ctx.beginPath();ctx.arc(g.x,g.y,g.r*k,0,TAU);ctx.fill();F(g.x-1,g.y-1,3,3,'#2a3a1a')}
  for(const s of L.z2smoke||[]){const a=Math.min(1,s.t/1.5)*.82;for(let i=0;i<7;i++){const an=i/7*TAU+tm*.3,r=s.r*.55;ctx.fillStyle=`rgba(200,195,215,${a*.55})`;ctx.beginPath();ctx.arc(s.x+Math.cos(an)*r*.6,s.y+Math.sin(an)*r*.5,r,0,TAU);ctx.fill()}}
  for(const s of L.z2spore||[]){const a=Math.min(1,s.t/1.5);ctx.fillStyle=`rgba(170,220,60,${a*.22})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,TAU);ctx.fill();for(let i=0;i<5;i++)F(s.x+Math.sin(tm*2+i*2)*s.r*.7,s.y+Math.cos(tm*1.7+i)*s.r*.6,1,1,'#d8ff60')}}
const _up=update;update=function(dt){_up(dt);try{tick(dt)}catch(e){console.warn('z2',e)}};
Z2.ART=ART;Z2.INFO=INFO;
})();
