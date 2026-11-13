// =====================================================================
//  ГЛАВА 10 — «Сердце города» (финал, замысел Натальи 03.11).
//  Едут только Микроб, Шмакодявка и Черсик. Перед выездом — сборы на двоих.
//  Land Rover по набережной → прыжок через разведённый Троицкий мост →
//  Микроб: Троицкая площадь и Иоанновский мост (крысы с автоматами) →
//  Шмакодявка: крепость, генераторы гнезда, пулемётные гнёзда →
//  Микроб: подземная лаборатория, сервер → босс ЗОМБИ-АНИС (3 фазы) →
//  Черсик: вентиляция и кладки → КРЫСИНАЯ КОРОЛЕВА: Черсик → Шмакодявка →
//  Микроб со штуцером Аниса → финал, шпиль возвращают → эпилог-судьбы.
//  Подключается после level9.js. Наружу: window.C10.
// =====================================================================
(function(){
'use strict';
if(!window.K56||!window.HQ||!window.C9||!C9.sys){console.warn('level10: нет kit56/hq/C9');return}
const K=K56,X=C1.X,E=C1.engine,PS=C1.PS,TAU=Math.PI*2,D2=K.D2,angDiff=K.angDiff,Q=K.Q,B=K.B||((x,y,w,h,c)=>X.B(x,y,w,h,c)),sfx=X.sfx,T=HQ.top,A8=C8.art||{},SY=C9.sys,HERO=C9.HERO;
const C10={on:false,done:false,started:false,sec:null,menu:null,kills0:0,flags:{},ready:false,loM:null,loS:null,qhp:0,cur:'m'};window.C10=C10;
const r4=n=>(Math.random()*n)|0,hold=K.hold;
const WD=()=>C1.WD||{};

// ================= МУЗЫКА =================
K.addMusic([['ride','ride.mp3'],['lych','lych.mp3'],['motiv','motiv.mp3'],['bunker','bunker.mp3'],['hahaa','hahaa.mp3'],['rap808','rap808.mp3'],['unmix','unmix.mp3'],['trance','trance.mp3'],
  ['smajte','smajte.mp3'],['histplace','histplace.mp3'],['menu','menu.mp3'],['intro','intro.mp3'],['flat','flat.mp3'],['smoke','smoke.mp3']]);
const MZ10={call:'flat',go:'smoke',drive:'ride',emb:'lych',fort:'motiv',lab:'bunker',anis:'hahaa',vent:'rap808',q1:'unmix',q2:'trance',q3:'smajte',cut:'smoke',fin:'histplace',epi:'intro',hq:'flat',end:'menu'};
const mz10=k=>K.music(MZ10[k]);

// ================= ПОРТРЕТЫ: зомби-Анис и королева =================
function pZAnis(g,open,blink){PORTRAIT.a(g,open,true);
  g.save();g.globalCompositeOperation='source-atop';g.fillStyle='rgba(70,140,60,.42)';g.fillRect(0,0,64,64);g.restore();
  if(!blink){P(g,21,28,7,3,'#2a0a0a');P(g,23,28,3,3,'#ff2020');P(g,36,28,7,3,'#2a0a0a');P(g,38,28,3,3,'#ff2020')}
  P(g,40,40,8,2,'#7a1a1a');P(g,44,42,3,5,'#7a1a1a');P(g,18,20,5,2,'#5a8a3a');P(g,12,58,6,6,'#7a1a1a');
  for(let i=0;i<3;i++)P(g,46+i*2,14+i,1,7,'#3a0808')} // след крысиных когтей
function pQueen(g,open,blink){PORTRAIT.K(g,open,blink);
  P(g,17,2,30,15,'rgba(0,0,0,0)');g.clearRect(17,2,30,15);
  P(g,16,10,32,7,'#f0c040');for(const x of [16,22,28,34,40,46])P(g,x,2,2,9,'#f0c040');P(g,16,16,32,1,'#b08a20');
  P(g,20,12,3,3,'#ff4fa3');P(g,30,11,4,4,'#c03aff');P(g,41,12,3,3,'#ff4fa3');
  if(!blink){P(g,19,30,8,1,'#1a0808');P(g,37,30,8,1,'#1a0808');P(g,19,29,1,1,'#1a0808');P(g,44,29,1,1,'#1a0808')}
  P(g,27,58,10,2,'#ff4fa3');ell(g,32,72,30,14,'#5a1a4a');P(g,22,62,20,2,'#f0c040')}
Object.assign(PORTRAIT,{za:pZAnis,rq:pQueen});Object.assign(PCV,{za:mk(64),rq:mk(64)});
Object.assign(NAME,{za:'ЗОМБИ-АНИС',rq:'КРЫСИНАЯ КОРОЛЕВА'});Object.assign(NCOL,{za:'#9adf6a',rq:'#ff6ac8'});
try{Object.assign(BG,{za:['#16220e','#9adf6a'],rq:['#2a0a22','#ff6ac8']})}catch(e){}

// ================= СПРАЙТЫ =================
function zRatGun(v,mg){const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});
  const F0=['#4a4440','#5a5048','#3e3a38','#6a5e52'][v%4],FD=shade(F0,.72);
  for(let i=0;i<6;i++)P(g,Math.max(0,4-i),12+Math.round(Math.sin(i*.8+v)*1.3),1,1,'#b07880');
  ell(g,10,12,mg?6.5:5.5,mg?4.4:3.6,F0);ell(g,9,12,mg?4.4:3.6,mg?3:2.4,FD);
  if(mg){P(g,7,7,2,10,'#c8a030');for(let y=8;y<17;y+=2)P(g,7,y,2,1,'#8a6a18')}else{P(g,6,9,6,1,'#3a4a2a');P(g,6,15,6,1,'#3a4a2a')}
  ell(g,15.5,12,2.8,2.4,F0);ell(g,15,12,2.6,2.1,'#3a4a2a');P(g,18,12,1,1,'#e8a0a8');
  P(g,13,8,2,2,'#c08890');P(g,13,15,2,2,'#c08890');P(g,17,11,1,1,'#ff2020');P(g,17,13,1,1,'#ff2020');
  P(g,14,13,mg?10:8,mg?2:1,'#1a1a1e');P(g,13,12,3,3,'#2a2a2e');if(mg){P(g,16,14,3,3,'#3a3a40');P(g,22,12,2,1,'#1a1a1e')}else P(g,17,14,1,2,'#2a2a2e');
  P(g,15,14,2,1,'#c08890');outline(g,'#0b0910');return c}
function zGen(){const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});
  P(g,3,4,18,16,'#22262c');P(g,4,5,16,14,'#3a4048');P(g,4,5,16,2,'#5a6068');for(let i=0;i<3;i++){ell(g,8+i*4,15,1.6,1.6,'#c87a2a');P(g,7+i*4,10,2,3,'#6a7078')}
  P(g,9,8,6,4,'#3ef06a');P(g,10,9,4,2,'#c8ffd0');P(g,0,11,3,2,'#1a1a1e');P(g,21,11,3,2,'#1a1a1e');
  for(let i=0;i<3;i++)P(g,15+i,6,1,5,'#7a1a1a');outline(g,'#0b0910');return c}
function zEgg(){const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});
  ell(g,12,12,9,8,'#a89878');ell(g,11,11,7,6,'#c8b898');ell(g,9,9,3,2.4,'#e0d4bc');
  for(const [x,y] of [[8,14],[14,8],[15,15],[11,11]]){ell(g,x,y,2,1.4,'#6a5a4a');P(g,x+1,y,1,1,'#ff3030')}
  for(let i=0;i<5;i++)P(g,4+i*3,5+((i*7)%12),1,3,'#a03040');outline(g,'#0b0910');return c}
function zAnisTop(){const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});const J='#4e4e32',JD='#3a3a24',SK='#8aa078';
  ell(g,14,16,7.5,10,J);ell(g,13,16,5,7,JD);P(g,10,8,8,3,'#6a6a48');P(g,10,22,8,3,'#6a6a48');
  P(g,15,9,9,3,J);P(g,15,20,8,3,J);P(g,23,10,2,2,SK);P(g,22,20,2,2,SK);
  P(g,11,15,9,3,'#6a4424');P(g,18,15,13,2,'#2a2a2e');P(g,18,17,10,1,'#2a2a2e');P(g,29,14,2,1,'#3a3a40');
  ell(g,14,16,4.6,4.6,SK);ell(g,13,16,4,4.2,'#241a15');P(g,16,14,2,1,'#ff2020');P(g,16,18,2,1,'#ff2020');
  P(g,9,12,3,2,'#7a1a1a');P(g,12,21,2,3,'#7a1a1a');P(g,6,15,3,2,'#5a8a3a');outline(g,'#0b0910');return c}
function zQueenTop(){const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});
  for(let i=0;i<46;i++){const a=i*.55,r=2+i*.11;P(g,Math.round(6+Math.cos(a)*r),Math.round(16+Math.sin(a)*r),1,1,'#d890a8')}
  ell(g,13,16,11,11,'#5a1a4a');ell(g,12,16,8,9,'#7a2a6a');
  ell(g,15,16,9,8.5,'#5e504c');ell(g,13,16,6,6,'#4a3e3a');
  for(const a of [-2.3,-1.4,1.4,2.3]){const x=15+Math.cos(a)*9,y=16+Math.sin(a)*9;ell(g,x,y,3,3,'#6a5a56');P(g,Math.round(x+Math.cos(a)*2.5),Math.round(y+Math.sin(a)*2.5),1,1,'#ff3030')}
  P(g,10,12,3,2,'#5aa83a');P(g,16,21,2,2,'#5aa83a');
  ell(g,24,16,5,4.6,'#6a5a56');P(g,28,15,2,2,'#ff8ab8');P(g,27,13,1,1,'#ff2020');P(g,27,18,1,1,'#ff2020');P(g,29,14,1,1,'#f0e8c0');P(g,29,17,1,1,'#f0e8c0');
  for(let i=0;i<16;i++){const a=i/16*TAU;P(g,Math.round(23.5+Math.cos(a)*3.6),Math.round(16+Math.sin(a)*3.6),1,1,'#f0c040')}
  for(const a of [0,.8,1.6,2.4,3.1,3.9,4.7,5.5])P(g,Math.round(23.5+Math.cos(a)*4.8),Math.round(16+Math.sin(a)*4.8),1,1,'#ffe070');
  P(g,23,15,2,2,'#c03aff');P(g,20,10,2,2,'#ff4fa3');P(g,20,21,2,2,'#ff4fa3');outline(g,'#0b0910');return c}
for(let v=0;v<4;v++){X.zCache['normal'+(260+v)]=zRatGun(v,false);X.zCache['normal'+(270+v)]=zRatGun(v,true)}
X.zCache['normal240']=zGen();X.zCache['normal250']=zEgg();X.zCache['boss232']=zAnisTop();X.zCache['boss233']=zQueenTop();

// ================= КРЫСЫ С ОРУЖИЕМ: свой прицел и очереди (не зависят от других модулей) =================
// автоматчик: красный луч-прицел → очередь, ствол ведёт за игроком медленно — от очереди уходят вбок;
// пулемётчик: сидит за мешками, длинные очереди
const GR={aim:.55,n:6,iv:.08,sp:200,dmg:8,spr:.07,cd:[1.4,2.1],rng:210,trk:1.7},GM={aim:.9,n:18,iv:.065,sp:210,dmg:8,spr:.09,cd:[1.6,2.4],rng:250,trk:1.0};
function gunAI(dt){for(const z of E.L.zs){if(z.dead||!z.g10)continue;const g=z.g10,G=g.mg?GM:GR,d=D2(z.x,z.y,pl.x,pl.y),ta=Math.atan2(pl.y-z.y,pl.x-z.x);
  const see=d<G.rng&&E.los(z.x,z.y,pl.x,pl.y)&&E.L.armed;
  if(g.mg){z.x=g.x;z.y=g.y;z.kbx=0;z.kby=0;z.stun=Math.max(z.stun||0,.05);if(!(g.aim>0)&&!(g.burst>0))z.a+=angDiff(ta,z.a)*Math.min(1,dt*2)}
  if(g.aim>0){z.stun=Math.max(z.stun||0,.05);g.aim+=dt;g.aa+=angDiff(ta,g.aa)*Math.min(1,dt*2.4);z.a=g.aa;if(!see&&g.aim<.3)g.aim=0;else if(g.aim>=G.aim){g.aim=0;g.burst=G.n;g.bt=0}}
  else if(g.burst>0){z.stun=Math.max(z.stun||0,.05);const mx=G.trk*dt;g.aa+=clamp(angDiff(ta,g.aa),-mx,mx);z.a=g.aa;g.bt-=dt;
    if(g.bt<=0){g.bt=G.iv;g.burst--;proj(z.x+Math.cos(g.aa)*8,z.y+Math.sin(g.aa)*8,g.aa+rnd(-G.spr,G.spr),G.sp,G.dmg,{col:'#ffd060',r:1.2,life:1.4});g.fl=.06;sfx('shot',.3);if(g.burst<=0)g.cd=rnd(G.cd[0],G.cd[1])}}
  else{if(g.cd>0)g.cd-=dt;else if(see&&d>14){g.aim=.001;g.aa=ta+rnd(-.3,.3);sfx('click',.6);if(!C10.warned){C10.warned=1;note('Крыса с автоматом! Красный луч — уходи с линии или за стену')}}
    if(see&&!g.mg&&d<60)K.mv(z,-Math.cos(ta)*22*dt,-Math.sin(ta)*22*dt,z.r)}
  if(g.fl>0)g.fl-=dt}}
function gunDraw(){for(const z of E.L.zs){if(z.dead||!z.g10)continue;const g=z.g10;
  if(g.mg){F(z.x-9,z.y-9,18,3,'#7a6a48');F(z.x-9,z.y+6,18,3,'#7a6a48')}
  if(g.fl>0){F(z.x+Math.cos(z.a)*12-1.5,z.y+Math.sin(z.a)*12-1.5,3,3,'#fff6c0')}
  if(g.aim>0||g.burst>0){const ca=Math.cos(g.aa),sa=Math.sin(g.aa),k=g.burst>0?1:Math.min(1,g.aim/.6);let ex=z.x,ey=z.y;for(let q=6;q<260;q+=2){const x=z.x+ca*q,y=z.y+sa*q,v=E.gAt(x,y);if(v===1||v===3)break;ex=x;ey=y}
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,${k>.75&&Math.floor(tm*20)%2?120:30},30,${.25+.6*k})`;ctx.lineWidth=k>.75?1:.6;ctx.beginPath();ctx.moveTo(z.x+ca*7,z.y+sa*7);ctx.lineTo(ex,ey);ctx.stroke();ctx.restore()}}}
function addZ(type,x,y,o){return E.addZ(type,x,y,Object.assign({st:'chase'},o||{}))}
function gunRat(x,y,mg,o){const f=E.freeSpot(x,y,4,30)||[x,y];return addZ('normal',f[0],f[1],Object.assign({v:(mg?270:260)+r4(4),hp:mg?280:110,max:mg?280:110,sp:mg?0:26,noConv:1,g10:{mg,x:f[0],y:f[1],cd:rnd(.4,1.2)}},o||{}))}
function rat(k,x,y,o){const f=E.freeSpot(x,y,3,30)||[x,y];return SY.rat(k,f[0],f[1],o)}
function zomb(t,x,y,o){const f=E.freeSpot(x,y,4,30)||[x,y];return addZ(t,f[0],f[1],o)}
const live=()=>K.alive();

// ================= СБОРЫ НА ДВОИХ =================
function fillMags(lo){const W=WD();for(const k of [lo.p,lo.t]){if(!k||!W[k]||!W[k].am)continue;const d=W[k],n=Math.min(d.mag-(PS.mag[k]||0),PS[d.am]||0);if(n>0){PS.mag[k]=(PS.mag[k]||0)+n;PS[d.am]-=n}}}
function defLoS(){const own=k=>window.UP&&UP.owns?UP.owns(k):!!(PS.own&&PS.own[k]);const lo=Object.assign({},PS.lo||{});
  return {p:lo.p||'pistol',t:['uzi','mp5','ak','shotgun'].find(k=>WD()[k]&&own(k))||lo.t||null,m:lo.m||'bat'}}
function useLo(who){const lo=who==='s'?(C10.loS||defLoS()):(C10.loM||PS.lo);if(!lo)return;PS.lo=Object.assign({},lo);if(!PS.mag)PS.mag={};fillMags(PS.lo);
  PS.wpn=PS.lo.t&&(PS.mag[PS.lo.t]>0)?PS.lo.t:(PS.lo.p||PS.lo.m||'bat')}

// ================= ГЕРОИ ГЛАВЫ =================
// обычный Черсик (корма тренера больше нет) и Микроб со штуцером Аниса — на системе героев главы 9
const CATP={b:'#141219',s:'#2f2a38',t:'#141219',p:'#141219',f:'#141219',e:'#d4ea4f'};
HERO.c10={n:'ЧЕРСИК',p:'c',leg:'rgba(0,0,0,0)',shoe:'rgba(0,0,0,0)',hp:200,spd:1.45,top:(g,sw)=>{T.topCat(g,CATP,pl.ph,pl.mv,false);if(sw>0){P(g,20,9,3,1,'#e8ecf4');P(g,20,14,3,1,'#e8ecf4')}},
  atk:{kind:'claw',name:'КОГТИ · 3-й удар — мощный',cd:.2,big:.45,dmg:48,bigDmg:90,reach:19,arc:1.2,kb:120,snd:'swing'},heal:'Корм'};
HERO.mr={n:'МИКРОБ',p:'m',leg:'#1c1c22',shoe:'#9a9ca2',hp:140,spd:1,top:(g,sw,fl)=>{drawMikrob(g,'awp');if(fl>0)P(g,23,11,3,3,'#fff6c0')},
  atk:{kind:'shot',name:'ШТУЦЕР АНИСА · на медведя',cd:.72,dmg:170,rng:260,pierce:4,kb:240,col:'255,240,200',snd:'rifle'},heal:'Шприц'};
function applyHero(h){const L=E.L;C10.cur=h;
  if(HERO[h]&&HERO[h].atk){C9.cur=h;const H=HERO[h],HS=C9.HS;HS.cd=.3;HS.heat=0;HS.over=0;HS.boost=0;
    L.hero=SY.HEROS;L.noHud=true;C1.noWpn=true;PS.max=Math.round(H.hp*1.3);PS.hp=PS.max;PS.wpn='h9';if(PS.syr<3)PS.syr=3;L.noShmak=true;SY.syncSyr();return}
  C9.cur=null;C1.noWpn=false;L.noHud=false;
  if(h==='s'){L.hero={draw(g,w,c){if(window.SHMAK_DRAW)SHMAK_DRAW(g,w,c)},leg:'#f2cab2',shoe:'#0e0e12'};L.noShmak=true;PS.max=120}
  else{L.hero=null;PS.max=130}
  useLo(h);PS.hp=PS.max;if(PS.syr<2)PS.syr=2}

// ================= СНАРЯДЫ, ЛОВУШКИ, ОГОНЬ =================
function proj(x,y,a,sp,dmg,o){(Q.pr||(Q.pr=[])).push(Object.assign({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:2.2,dmg,col:'#ffe0a0',r:2},o||{}))}
function prTick(dt){if(!Q.pr)return;const L=E.L;for(const b of Q.pr){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;const v=E.gAt(b.x,b.y);
    if(v===1||v===3){b.life=0;L.fx.push({x:b.x,y:b.y,vx:0,vy:0,life:.3,c:b.col})}else if(D2(b.x,b.y,pl.x,pl.y)<4+b.r){b.life=0;X.hurtPlayer(b.dmg);if(b.onHit)b.onHit(b)}}
  Q.pr=Q.pr.filter(b=>b.life>0)}
function prDraw(){if(Q.pr)for(const b of Q.pr){ctx.fillStyle=b.col;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.fill();if(b.trail){ctx.strokeStyle=b.trail;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-b.vx*.03,b.y-b.vy*.03);ctx.stroke()}}}
function fireZone(x,y,r,t){(Q.fz||(Q.fz=[])).push({x,y,r,t,t0:t})}
function fzTick(dt){if(!Q.fz)return;for(const f of Q.fz){f.t-=dt;if(D2(f.x,f.y,pl.x,pl.y)<f.r){Q.burnT=(Q.burnT||0)-dt;if(Q.burnT<=0){Q.burnT=.3;X.hurtPlayer(7)}}
    if(Math.random()<dt*20)E.L.fx.push({x:f.x+rnd(-f.r,f.r)*.7,y:f.y+rnd(-f.r,f.r)*.7,vx:rnd(-4,4),vy:rnd(-30,-10),life:rnd(.3,.6),c:Math.random()<.5?'#ff7a1a':'#ffd040'})}
  Q.fz=Q.fz.filter(f=>f.t>0)}
function fzDraw(){if(Q.fz)for(const f of Q.fz){const k=Math.min(1,f.t/1);ctx.fillStyle=`rgba(255,120,30,${.22*k})`;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,TAU);ctx.fill();ctx.fillStyle=`rgba(255,220,80,${.18*k})`;ctx.beginPath();ctx.arc(f.x,f.y,f.r*.55,0,TAU);ctx.fill()}}
function trapTick(){if(!Q.traps)return;for(const t of Q.traps){if(t.shut)continue;if(D2(t.x,t.y,pl.x,pl.y)<6){t.shut=1;sfx('clang',1);X.hurtPlayer(20);PS.slow=Math.max(PS.slow||0,1.4);X.floatT(t.x,t.y-8,'КАПКАН!','#ffb060')}}}
function trapDraw(){if(Q.traps)for(const t of Q.traps){F(t.x-5,t.y-1,10,2,'#5a5a62');if(t.shut){F(t.x-3,t.y-3,6,6,'#3a3a40')}else{for(let i=-4;i<=4;i+=2){F(t.x+i,t.y-3,1,2,'#9a9aa2');F(t.x+i,t.y+1,1,2,'#9a9aa2')}}}}

// ящики с патронами на аренах боссов: к оружию того, кто сейчас в бою
const SAFE_AM={ammo:1,shells:1,r762:1,r556:1,p50:1,awp:1,cells:1};
function supply(dt){if(HERO[C10.cur]&&HERO[C10.cur].atk)return;Q.sup=(Q.sup==null?6:Q.sup)-dt;if(Q.sup>0)return;Q.sup=11;const L=E.L;
  if(L.items.filter(i=>!i.taken).length>=4)return;const W=WD(),t=PS.lo&&PS.lo.t,am=t&&W[t]&&W[t].am;
  for(let k=0;k<20;k++){const x=40+Math.random()*(L.w-80),y=60+Math.random()*(L.h-100);if(E.solidAt(x,y,6)||D2(x,y,pl.x,pl.y)<40)continue;
    if(am&&SAFE_AM[am])E.addItem(am,x,y,Math.max(4,Math.round((W[t].mag||10)*.8)));else E.addItem('ammo',x,y,24);
    if(Math.random()<.3)E.addItem('syr',x+10,y,1);X.floatT(x,y-8,'ПРИПАСЫ','#ffe27a');break}}
// ================= ОБЩИЙ ЗАПУСК УЧАСТКА =================
const SEC={};
function sec10(n){
  K.sec(C10,n,()=>{
    SEC[n].build();applyHero(SEC[n].hero);
    const L=E.L,lo=L.drawOver,lu=L.drawUnder;
    L.drawUnder=()=>{if(lu)lu();trapDraw();fzDraw();if(Q.under)Q.under()};
    L.drawOver=()=>{if(lo)lo();gunDraw();prDraw();SY.fx9();if(Q.over)Q.over()};
    mz10(n);
  },sec10);
  K.tick=dt=>{SY.trTick(dt);SY.healWatch();if(HERO[C10.cur]&&HERO[C10.cur].atk)C9.heroTick(dt);if(hold())return;gunAI(dt);prTick(dt);fzTick(dt);trapTick();if(Q.tick)Q.tick(dt)};
  K.hud=()=>{if(HERO[C10.cur]&&HERO[C10.cur].atk)SY.heroHud()};
}
C10.go=sec10;
const playC10=(shots,onEnd,k)=>K.cut(C10,shots,onEnd,MZ10[k]);
function bossBar(){const z=Q.boss;if(!z||!Q.bossNm)return;const hp=Q.bossHp?Q.bossHp():Math.max(0,z.hp)/z.max,y=H-26;
  panel(W/2-82,y,164,12,.78);uiFont(4.4,true);u.textAlign='center';u.fillStyle=Q.bossCol||'#ff6a6a';u.fillText(Q.bossNm,W/2,y+5);u.textAlign='left';
  X.hudBar(W/2-78,y+7,156,3,clamp(hp,0,1),Q.bossCol||'#c0202a');if(Q.bossMarks)for(const m of Q.bossMarks)F2(W/2-78+156*m,y+6,1,5,'#ffffff')}
function F2(x,y,w,h,c){u.fillStyle=c;u.fillRect(x,y,w,h)}
function intro(t,col,lines,go){lockMove=true;E.L.armed=false;after(.5,()=>{K.zoneBanner(t,col);say(lines,()=>{lockMove=false;E.L.armed=true;if(go)go()})})}
function finish(lines,next){if(Q.fin)return;Q.fin=1;sfx('ring',1);E.L.armed=false;after(.8,()=>say(lines,()=>{lockMove=true;X.go(()=>{lockMove=false;next()})}))}
function edges(L){E.gfill(0,0,4,L.h,1);E.gfill(L.w-4,0,L.w,L.h,1);E.gfill(0,L.h-4,L.w,L.h,1);E.gfill(0,0,L.w,4,1)}
function bags(x,y,w,h){X.lowBox(x,y,w,h,'#7a6a48','#a89870');for(let i=x;i<x+w;i+=5)B(i,y,1,h,'#5a4a32')}
// неподвижные цели (генераторы, кладки): на месте, без отбрасывания
function pinTick(){for(const z of E.L.zs){if(z.dead||!z.pin)continue;z.x=z.pin[0];z.y=z.pin[1];z.stun=99;z.kbx=0;z.kby=0;z.a=z.pin[2]||0}}

// ================= 1. МИКРОБ: ТРОИЦКАЯ ПЛОЩАДЬ И ИОАННОВСКИЙ МОСТ =================
SEC.emb={hero:'m',build(){
  const L=E.mkLevel('emb10',760,420);B(0,0,760,420,'#1a1c22');
  K.floor(4,4,430,330,'cobble');K.floor(430,4,470,330,'deep',2);K.floor(4,330,756,416,'deep',2);K.floor(470,4,756,330,'walk');
  K.floor(426,150,474,184,'wood');for(let x=426;x<474;x+=6)B(x,150,1,34,'#5a3a22');B(426,148,48,2,'#3a2a1a');B(426,184,48,2,'#3a2a1a');
  // крепость: стены и Иоанновские ворота
  E.gfill(520,4,756,148,1);E.gfill(520,186,756,330,1);B(520,4,236,144,'#8a5a4a');B(520,186,236,144,'#8a5a4a');
  for(let x=520;x<756;x+=12){B(x,142,8,6,'#a87060');B(x,186,8,4,'#a87060')}B(520,4,6,144,'#6a4234');B(520,186,6,144,'#6a4234');
  K.floor(520,148,756,186,'stone');B(560,140,40,8,'#e8d8b0');K.txt(580,146,'ИОАННОВСКИЕ ВОРОТА','#5a3a2a',4);
  K.txt(220,24,'ТРОИЦКАЯ ПЛОЩАДЬ','#e8e0c8',6);K.txt(450,140,'ИОАННОВСКИЙ МОСТ','#c8e8ff',4);K.txt(220,370,'Н Е В А','#8ac8ff',10);
  for(const [x,y] of [[70,70],[150,60],[300,70],[360,120],[60,230],[380,280]])K.tree(x,y,14);
  X.carTop(180,150,'#c8302a',true);X.carTop(250,250,'#e8e8e8',false);X.lowBox(120,180,60,10,'#5a6a7a','#7a8a9a'); // трамвай-остов
  bags(300,150,30,6);bags(330,200,6,30);bags(200,90,36,6);bags(100,280,40,6);bags(480,140,6,14);bags(480,180,6,12);
  for(let x=10;x<430;x+=40)X.lampPost(x,326);
  pl.x=40;pl.y=300;pl.a=-Math.PI/4;
  L.dark=.42;L.tint='10,12,30';L.arrows=true;X.buildNav();edges(L);
  // враги
  for(const [x,y] of [[180,120],[230,160],[310,140],[340,215],[215,80],[120,270]])gunRat(x,y,false);
  for(let i=0;i<7;i++)zomb('normal',60+r4(340),40+r4(260));for(let i=0;i<5;i++)zomb('fast',150+r4(250),40+r4(200));
  for(let i=0;i<8;i++)rat('rat',100+r4(300),60+r4(240));
  Q.g1=gunRat(498,166,true,{nm:'СТРАЖ МОСТА',nmc:'#ffd23a',hp:520,max:520});Q.g2=gunRat(640,166,true,{nm:'СТРАЖ ВОРОТ',nmc:'#ffd23a',hp:620,max:620});
  for(const [x,y] of [[560,160],[600,175],[690,160]])gunRat(x,y,false);
  Q.wv=0;
  L.obj=()=>{const g=[Q.g1,Q.g2].filter(z=>z&&!z.dead).length;return g?['Прорваться к Иоанновским воротам','Пулемётных гнёзд: '+g]:['Войти в крепость →']};
  Q.tick=dt=>{if(Q.fin||!L.armed)return;
    if(!Q.wv&&pl.x>300){Q.wv=1;sfx('scream',.6);for(let i=0;i<8;i++)zomb(i%2?'fast':'normal',20+r4(80),40+r4(260));for(let i=0;i<6;i++)rat('mouse',30+r4(60),300)}
    if(Q.wv===1&&pl.x>420){Q.wv=2;for(let i=0;i<4;i++)gunRat(560+r4(150),150+r4(30),false)}
    if(Q.g1.dead&&Q.g2.dead&&pl.x>735)finish([['m','Внутри. Шмакодявка, это двор крепости.'],['s','Зай, здесь гудит. Как трансформаторная будка.'],['c','Мрр. (Снизу. Пахнет крысами. Много.)'],
      ['m','Генераторы. Гнездо питается от них.'],['s','Я — по генераторам. Ты прикрывай вход. Не спорь, твоя очередь отдыхать.']],()=>sec10('fort'))};
  intro('ТРОИЦКАЯ ПЛОЩАДЬ · МИКРОБ','#ffd23a',[['m','Приземлились. Почти.'],['s','Зай, у них автоматы. У КРЫС. АВТОМАТЫ.'],['c','Мяу. (Я предупреждал. Ну, я думал об этом.)'],['m','К воротам. Короткими перебежками.']]);
}};

// ================= 2. ШМАКОДЯВКА: КРЕПОСТЬ И ГЕНЕРАТОРЫ =================
SEC.fort={hero:'s',build(){
  const L=E.mkLevel('fort10',640,520);B(0,0,640,520,'#5a3a30');
  K.floor(20,20,620,500,'stone');
  for(let x=20;x<620;x+=10){B(x,16,8,4,'#8a5a4a');B(x,500,8,4,'#8a5a4a')}
  // собор: стены, колокольня, упавший шпиль
  E.gfill(250,170,390,320,1);B(250,170,140,150,'#e8c8a8');B(250,170,140,4,'#f4dcc0');B(262,182,116,126,'#4a8a6a');for(let y=186;y<306;y+=8)B(262,y,116,1,'#3a7a5a');
  E.gfill(300,320,340,356,1);B(300,320,40,36,'#e8c8a8');B(306,326,28,24,'#4a8a6a');
  K.txt(320,248,'СОБОР','#f4ecd8',6);K.txt(320,258,'ПЕТРА И ПАВЛА','#f4ecd8',4);
  E.gfill(120,380,250,388,2);for(let x=120;x<250;x+=2)B(x,380,2,8,x%8<4?'#e8c040':'#c89a20');B(112,376,10,16,'#f0d060');K.txt(180,376,'ШПИЛЬ (упал в первый день)','#ffe08a',4);
  // Монетный двор
  E.gfill(440,40,600,130,1);B(440,40,160,90,'#c8b090');B(440,40,160,4,'#e0c8a8');K.txt(520,90,'МОНЕТНЫЙ ДВОР','#4a3a2a',5);
  E.gfill(40,40,170,110,1);B(40,40,130,70,'#b89a80');K.txt(105,80,'КОМЕНДАНТСКИЙ','#4a3a2a',4);
  for(const [x,y] of [[200,120],[440,200],[470,330],[90,250],[560,420]])K.tree(x,y,12);
  pl.x=320;pl.y=480;pl.a=-Math.PI/2;
  // генераторы гнезда + пулемётные гнёзда
  Q.gens=[];for(const [x,y] of [[70,170],[580,200],[520,460]]){const z=zomb('normal',x,y,{v:240,hp:420,max:420,nm:'ГЕНЕРАТОР',nmc:'#3ef06a',noConv:1,pin:[x,y,0],sp:0});Q.gens.push(z);L.lights.push([x,y,46,.9])}
  bags(100,150,6,40);bags(546,180,6,40);bags(490,440,6,40);
  gunRat(120,170,true,{hp:300,max:300});gunRat(540,200,true,{hp:300,max:300});gunRat(480,460,true,{hp:300,max:300});
  for(const [x,y] of [[200,300],[420,380],[300,140],[160,450],[600,300],[230,60]])gunRat(x,y,false);
  for(let i=0;i<8;i++)rat('rat',40+r4(560),40+r4(440));
  Q.hatch=[{x:420,y:260},{x:200,y:420},{x:560,y:300},{x:110,y:340}];
  L.lights.push([320,480,80,.8]);L.dark=.5;L.tint='14,6,20';L.arrows=true;X.buildNav();edges(L);
  Q.under=()=>{for(const h of Q.hatch){F(h.x-7,h.y-5,14,10,'#2a2a2e');F(h.x-6,h.y-4,12,8,'#0a0a0c');if(Math.sin(tm*6+h.x)>.5){F(h.x-2,h.y-1,1,1,'#ff2020');F(h.x+1,h.y-1,1,1,'#ff2020')}}
    for(const g of Q.gens){if(g.dead)continue;ctx.strokeStyle='rgba(62,240,106,.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(320,338);ctx.stroke()}
    if(Q.open){const k=.5+.5*Math.sin(tm*5);ctx.strokeStyle=`rgba(62,240,176,${k})`;ctx.strokeRect(306.5,355.5,27,10)}};
  L.its=[{x:320,y:364,r:16,label:()=>'Спуститься в лабораторию',cond:()=>!!Q.open,act:()=>{if(Q.fin)return;Q.fin=1;E.L.armed=false;lockMove=true;X.go(()=>{lockMove=false;playC10(CUT_DOWN,()=>sec10('lab'),'cut')})}}];
  Q.sp=3;
  L.obj=()=>{const n=Q.gens.filter(g=>g.dead).length;return n<3?['Взорвать генераторы гнезда: '+n+' / 3','Пулемётные гнёзда — обходи сбоку']:['Вход в лабораторию — у колокольни собора']};
  Q.tick=dt=>{pinTick();if(Q.fin||!L.armed)return;const n=Q.gens.filter(g=>g.dead).length;
    if(n!==Q.n0){if(Q.n0!=null){sfx('thump',1);C1.shake=.5;K.zoneBanner('ГЕНЕРАТОР '+n+' / 3','#3ef06a');for(let i=0;i<4;i++){const h=Q.hatch[r4(4)];rat(Math.random()<.5?'rat':'mouse',h.x,h.y)}}Q.n0=n}
    if(n<3){Q.sp-=dt;if(Q.sp<=0&&live()<30){Q.sp=rnd(3,4.5)-n*.6;const h=Q.hatch[r4(4)];for(let i=0;i<3;i++)rat(Math.random()<.4?'mouse':'rat',h.x+rnd(-4,4),h.y+rnd(-4,4));if(Math.random()<.35)gunRat(h.x,h.y,false)}}
    else if(!Q.open){Q.open=1;sfx('power',1);C1.shake=.6;say([['s','Последний! Гудеть перестало.'],['m','(рация) Шмакодявка, у колокольни открылся люк. Иду к тебе.'],['c','Мяу! (Я первый!)']])}};
  intro('КРЕПОСТЬ · ШМАКОДЯВКА','#ff7ac8',[['s','Три генератора. Зелёные провода — к собору.'],['s','Пулемётчики сидят за мешками. Значит, захожу сбоку.'],['m','(рация) Шмакодявка, я у ворот. Если что — кричи.'],['s','Я не кричу. Я стреляю.']]);
}};

// ================= 3. МИКРОБ: ЛАБОРАТОРИЯ =================
SEC.lab={hero:'m',build(){
  const L=E.mkLevel('lab10',740,480);B(0,0,740,480,'#0e1014');
  const room=(x0,y0,x1,y1,k)=>K.floor(x0,y0,x1,y1,k||'tile');
  room(20,190,200,300);room(200,222,560,262);room(240,40,500,200);room(340,200,380,222);room(520,40,720,200);room(500,100,520,140);
  room(540,262,580,290);room(520,290,720,450);room(60,300,100,420);room(20,420,240,460,'sewer');room(240,262,280,420);room(240,420,280,460,'sewer');
  for(const [x0,y0,x1,y1] of [[20,190,200,300],[240,40,500,200],[520,40,720,200],[520,290,720,450]]){B(x0-2,y0-2,x1-x0+4,2,'#3a4a5a');B(x0-2,y1,x1-x0+4,2,'#3a4a5a');B(x0-2,y0,2,y1-y0,'#3a4a5a');B(x1,y0,2,y1-y0,'#3a4a5a')}
  K.txt(110,206,'ШЛЮЗ','#8ad8ff',5);K.txt(370,56,'КАПСУЛЫ','#8ad8ff',5);K.txt(620,56,'СЕРВЕРНАЯ','#8ad8ff',5);K.txt(620,306,'АРЕНА','#ff6a6a',5);
  // капсулы с заражёнными
  Q.caps=[];for(let i=0;i<4;i++)for(let j=0;j<2;j++){const x=270+i*60,y=90+j*60;E.gfill(x-9,y-9,x+9,y+9,2);Q.caps.push({x,y,br:0})}
  // стойки серверов
  for(let i=0;i<4;i++){E.gfill(540+i*42,70,560+i*42,110,1);B(540+i*42,70,20,40,'#1a1e26');for(let y=74;y<108;y+=5)B(542+i*42,y,16,2,Math.random()<.5?'#3ef06a':'#1a3a2a')}
  Q.srv={x:620,y:150};
  pl.x=60;pl.y=250;pl.a=0;
  L.lights.push([60,250,70,.8],[370,120,110,.6],[620,120,90,.7],[620,370,90,.6]);L.dark=.62;L.tint='0,20,24';L.arrows=true;X.buildNav();edges(L);
  for(const [x,y] of [[150,230],[300,240],[420,230],[520,240],[620,180],[600,330],[680,420],[260,320]])gunRat(x,y,false);
  for(let i=0;i<10;i++){const p=[[120,270],[320,240],[460,240],[380,180],[260,440],[100,440],[560,275],[640,250]][i%8];zomb(i%3?'normal':'fast',p[0]+rnd(-10,10),p[1]+rnd(-6,6))}
  for(let i=0;i<6;i++)rat('rat',220+r4(300),226+r4(30));
  Q.under=()=>{for(const c of Q.caps){F(c.x-9,c.y-9,18,18,'#1a2a2a');ctx.fillStyle=c.br?'rgba(40,60,40,.6)':'rgba(80,220,140,.35)';ctx.beginPath();ctx.arc(c.x,c.y,8,0,TAU);ctx.fill();
      if(!c.br){ctx.fillStyle='#4a6a3a';ctx.beginPath();ctx.arc(c.x,c.y+Math.sin(tm*1.5+c.x)*1,3.5,0,TAU);ctx.fill();F(c.x-1,c.y-2+Math.sin(tm*1.5+c.x),1,1,'#ff2020')}else for(let i=0;i<5;i++)F(c.x-8+i*4,c.y+6,2,2,'#c8f0e0')}
    const s=Q.srv;if(!Q.card){const k=.5+.5*Math.sin(tm*5);ctx.strokeStyle=`rgba(62,240,176,${k})`;ctx.strokeRect(s.x-8.5,s.y-6.5,17,13)}F(s.x-6,s.y-5,12,8,'#1a1e26');F(s.x-5,s.y-4,10,5,Q.card?'#2a4a3a':'#3ef06a');
    const d=Q.door;F(d.x-3,d.y-14,6,28,Q.card?'#3ef06a':'#c0202a')};
  Q.door={x:716,y:370};E.gfill(712,350,720,390,1);
  L.its=[{x:Q.srv.x,y:Q.srv.y,r:16,label:()=>'Сервер лаборатории: прочитать',cond:()=>!Q.card,act:()=>{lockMove=true;say([
      ['m','Журнал опытов. «Объект №1: Анис Р. Охотник. Укушен 1-го числа. Устойчив к распаду».'],['m','«Подчиняется сигналу королевы. Использует свисток для управления стадом».'],
      ['m','«Объект пытался стереть адрес гнезда с сервера. Наказан».'],['s','(рация) Зай... он пытался нас предупредить.'],['m','Ключ-карта от арены. Он там. Я чувствую.']],()=>{Q.card=1;lockMove=false;sfx('pick');note('Ключ-карта от арены')})}},
    {x:700,y:370,r:18,label:()=>Q.card?'Войти на арену':'Нужна ключ-карта (серверная)',cond:()=>true,act:()=>{if(!Q.card){sfx('thump',1.6);return}if(Q.fin)return;Q.fin=1;E.L.armed=false;lockMove=true;X.go(()=>{lockMove=false;playC10(CUT_ARENA,()=>sec10('anis'),'cut')})}}];
  L.obj=()=>Q.card?['Арена — дверь на востоке','Осталось врагов: '+live()]:['Найти серверную и прочитать журнал'];
  Q.tick=dt=>{if(Q.fin||!L.armed)return;
    for(const c of Q.caps){if(c.br)continue;if(D2(pl.x,pl.y,c.x,c.y)<40&&Math.random()<dt*.9){c.br=1;sfx('glass',1);C1.shake=.2;zomb(Math.random()<.5?'fast':'normal',c.x,c.y+14,{noConv:1});X.floatT(c.x,c.y-12,'ДЗЫНЬ!','#c8f0e0')}}
    if(Q.card&&!Q.wv){Q.wv=1;for(let i=0;i<3;i++)gunRat(600+r4(80),300+r4(120),false);for(let i=0;i<6;i++)rat('mouse',560,280)}};
  intro('ЛАБОРАТОРИЯ · МИКРОБ','#8ad8ff',[['m','Лаборатория. Под собором. Кто-то это строил годами.'],['c','Мрр. (Пахнет Анисом. И крысами.)'],['s','(рация) Зай, я наверху, держу люк. Иди тихо.'],['m','Тихо не получится.']]);
}};

// ================= 4. БОСС: ЗОМБИ-АНИС =================
SEC.anis={hero:'m',build(){
  const L=E.mkLevel('anis10',420,320);B(0,0,420,320,'#0e0e12');K.floor(20,20,400,300,'stone');
  for(const [x,y] of [[110,110],[310,110],[110,220],[310,220]]){E.gfill(x-10,y-10,x+10,y+10,1);B(x-10,y-10,20,20,'#4a4a52');B(x-10,y-10,20,3,'#6a6a72')}
  for(let i=0;i<6;i++)B(30+i*64,24,8,3,'#ff3a3a');K.txt(210,40,'АРЕНА','#5a2a2a',10);
  pl.x=210;pl.y=270;pl.a=-Math.PI/2;
  L.lights.push([210,160,150,.7]);L.dark=.55;L.tint='20,4,4';X.buildNav();edges(L);
  const z=addZ('boss',210,70,{v:232,hp:3000,max:3000,nm:'ЗОМБИ-АНИС',nmc:'#9adf6a',r:7,noConv:1});Q.boss=z;z.stun=99;Q.bossNm='ЗОМБИ-АНИС · ОХОТНИК КОРОЛЕВЫ';Q.bossCol='#9adf6a';Q.bossMarks=[1/3,2/3];
  Q.ph=0;Q.cd=1.5;Q.aim=0;Q.ws=6;Q.bt=3;Q.ch=0;Q.sd=1;Q.traps=[];Q.fz=[];
  Q.over=()=>{const z=Q.boss;if(!z||z.dead)return;
    if(Q.aim>0){const ca=Math.cos(z.aa),sa=Math.sin(z.aa),k=Math.min(1,Q.aim/1);ctx.strokeStyle=`rgba(255,40,40,${.3+.6*k})`;ctx.lineWidth=k>.8?1:.5;let ex=z.x,ey=z.y;for(let q=0;q<300;q+=3){const x=z.x+ca*q,y=z.y+sa*q;if(E.gAt(x,y)===1)break;ex=x;ey=y}ctx.beginPath();ctx.moveTo(z.x,z.y);ctx.lineTo(ex,ey);ctx.stroke()}
    if(Q.wh>0){for(let i=0;i<3;i++){const k=((1-Q.wh)*2+i/3)%1;ctx.strokeStyle=`rgba(255,255,255,${1-k})`;ctx.beginPath();ctx.arc(z.x,z.y,6+k*40,0,TAU);ctx.stroke()}}
    if(Q.ch>0&&Q.chW>0){ctx.strokeStyle=`rgba(255,60,60,${.5+.5*Math.sin(tm*30)})`;ctx.beginPath();ctx.arc(z.x,z.y,14,0,TAU);ctx.stroke()}};
  L.obj=()=>['Остановить Аниса','Фаза '+(Q.ph+1)+' / 3: '+['ружьё','свисток и капканы','самогон'][Q.ph]];
  Q.tick=dt=>{const z=Q.boss;if(!z)return;
    if(z.dead){if(!Q.fin){K.ghostAll('rgba(160,255,120,A)');Q.pr=[];Q.fz=[];finish([['za','...Микроб?'],['m','Анис. Это я.']],()=>playC10(CUT_ANIS,()=>sec10('vent'),'cut'))}return}
    if(Q.fin||!L.armed){z.stun=99;return}
    z.stun=99;const d=D2(z.x,z.y,pl.x,pl.y),ta=Math.atan2(pl.y-z.y,pl.x-z.x),hp=z.hp/z.max;
    const nph=hp>2/3?0:hp>1/3?1:2;if(nph!==Q.ph){Q.ph=nph;K.zoneBanner('ФАЗА '+(nph+1)+' / 3','#9adf6a');sfx('scream',.8);
      if(nph===1)say([['za','Свист... слышишь?.. Она... зовёт...'],['m','Анис, борись с ней!']]);
      if(nph===2)say([['za','Са-мо-гон... мой лучший... ГОРИ!'],['s','(рация) Зай, у него бутылки!']])}
    // движение: держит дистанцию, обходит сбоку
    let mv=null,sp=24;
    if(Q.ch>0){Q.chW-=dt;if(Q.chW<=0){Q.ch-=dt;sp=170;mv=Q.chA;if(d<12&&!Q.chHit){Q.chHit=1;X.hurtPlayer(26);C1.shake=.4}}else{mv=null}if(Q.ch<=0)Q.cd=Math.max(Q.cd,.8)}
    else if(Q.aim<=0){if(d<80)mv=ta+Math.PI+Q.sd*.6;else if(d>150)mv=ta+Q.sd*.5;else mv=ta+Math.PI/2*Q.sd;if(Math.random()<dt*.4)Q.sd=-Q.sd}
    if(mv!=null){const ox=z.x,oy=z.y;K.mv(z,Math.cos(mv)*sp*dt,Math.sin(mv)*sp*dt,6);if(Math.abs(z.x-ox)+Math.abs(z.y-oy)<.01*sp*dt)Q.sd=-Q.sd;z.ph=(z.ph||0)+dt*sp*.2}
    z.a=Q.aim>0?z.aa:(Q.ch>0?Q.chA:ta);
    // выстрел из ружья: прицел (красный луч), потом пуля
    if(Q.aim>0){Q.aim+=dt;z.aa+=angDiff(ta,z.aa)*Math.min(1,dt*(Q.ph?2.6:2));if(Q.aim>=(Q.ph?.8:1)){Q.aim=0;sfx('rifle',1);C1.shake=.25;proj(z.x+Math.cos(z.aa)*10,z.y+Math.sin(z.aa)*10,z.aa,400,30,{col:'#ffe8a0',r:2,trail:'rgba(255,230,160,.8)'});Q.cd=Q.ph===2?2.4:1.7}}
    else if(Q.ch<=0){Q.cd-=dt;if(Q.cd<=0){if(d<55){sfx('shotgun',1);for(let i=0;i<6;i++)proj(z.x,z.y,ta+(i/5-.5)*.7,260,9,{col:'#ffd080',life:.5});Q.cd=1.2;Q.sd=-Q.sd}else{Q.aim=.001;z.aa=ta+rnd(-.3,.3);sfx('click',.8)}}}
    // фаза 2: свисток — стадо и капканы
    if(Q.wh>0)Q.wh-=dt*1.5;
    if(Q.ph>=1){Q.ws-=dt;if(Q.ws<=0){Q.ws=Q.ph===1?8:11;Q.wh=1;sfx('whistle',1);X.floatT(z.x,z.y-16,'ФЬЮ-ИТЬ!','#ffffff');
      for(let i=0;i<(Q.ph===1?5:3);i++){const e=[[30,30],[390,30],[30,290],[390,290]][r4(4)];zomb(Math.random()<.4?'fast':'normal',e[0],e[1],{noConv:1})}
      if(Q.traps.filter(t=>!t.shut).length<6)for(let i=0;i<3;i++){const a=rnd(0,TAU),r=rnd(26,60),x=clamp(pl.x+Math.cos(a)*r,30,390),y=clamp(pl.y+Math.sin(a)*r,30,290);if(!E.solidAt(x,y,4))Q.traps.push({x,y,shut:0})}}}
    // фаза 3: самогон и рывки
    if(Q.ph===2){Q.bt-=dt;if(Q.bt<=0){Q.bt=2.3;const tx=pl.x+rnd(-14,14),ty=pl.y+rnd(-14,14);sfx('swing',.8);X.floatT(z.x,z.y-16,'«АНИСОВКА»!','#ffb060');K.tele(tx,ty,17,1,16,'fire',t=>{fireZone(t.x,t.y,19,5);sfx('glass',.8)})}
      if(Q.ch<=0&&Q.aim<=0&&Math.random()<dt*.18){Q.ch=.5;Q.chW=.65;Q.chA=ta;Q.chHit=0;X.floatT(z.x,z.y-16,'Р-РА!','#ff6a6a')}}
    // контакт
    if(d<13){Q.ct=(Q.ct||0)-dt;if(Q.ct<=0){Q.ct=.7;X.hurtPlayer(14)}}supply(dt)};
  intro('ЗОМБИ-АНИС','#9adf6a',[['za','...Мик...роб...'],['m','Анис... Это правда ты.'],['za','Королева... не велит... пускать...'],['m','Прости, Анис. Я должен.']]);
}};

// ================= 5. ЧЕРСИК: ВЕНТИЛЯЦИЯ И КЛАДКИ =================
SEC.vent={hero:'c10',build(){
  const L=E.mkLevel('vent10',600,420);B(0,0,600,420,'#141418');
  const sh=(x0,y0,x1,y1)=>{K.floor(x0,y0,x1,y1,'tile');B(x0,y0,x1-x0,1,'#6a6e76');B(x0,y1-1,x1-x0,1,'#3a3e46')};
  sh(20,190,380,222);sh(80,40,104,390);sh(200,40,224,390);sh(300,100,324,330);sh(80,40,330,64);sh(80,366,380,390);sh(300,100,380,124);
  K.floor(380,60,580,380,'slime');for(let i=0;i<30;i++)B(390+r4(180),70+r4(300),3,2,'#c8c0a8');K.txt(480,76,'ГНЕЗДО','#ff6ac8',6);
  for(let x=24;x<376;x+=16)B(x,206,8,1,'#2a2a30');
  pl.x=40;pl.y=206;pl.a=0;
  Q.eggs=[];for(const [x,y] of [[92,52],[212,378],[312,112],[430,120],[530,300],[470,240],[540,110],[420,340]].slice(0,8)){const z=zomb('normal',x,y,{v:250,hp:200,max:200,nm:'КЛАДКА',nmc:'#ff6ac8',noConv:1,pin:[x,y,0],sp:0});z.sp=0;Q.eggs.push(z)}
  for(let i=0;i<6;i++)rat('mouse',120+r4(220),196+r4(20));for(let i=0;i<5;i++)rat('rat',400+r4(160),80+r4(280));
  L.lights.push([480,220,120,.5]);L.dark=.6;L.tint='20,4,16';L.arrows=true;X.buildNav();edges(L);
  Q.sp=2;
  L.obj=()=>{const n=Q.eggs.filter(z=>z.dead).length;return n<Q.eggs.length?['Разорвать кладки: '+n+' / '+Q.eggs.length,'Из живых кладок лезут мыши']:['Ход к королеве — в глубине гнезда →']};
  Q.tick=dt=>{pinTick();if(Q.fin||!L.armed)return;const alive=Q.eggs.filter(z=>!z.dead);
    Q.sp-=dt;if(alive.length&&Q.sp<=0&&live()<26){Q.sp=rnd(1.6,2.6);const e=alive[r4(alive.length)];for(let i=0;i<2;i++)rat(Math.random()<.75?'mouse':'rat',e.x+rnd(-8,8),e.y+rnd(-8,8));if(Math.random()<.2)rat('big',e.x,e.y)}
    if(!alive.length&&!Q.done){Q.done=1;sfx('ring');K.zoneBanner('КЛАДКИ УНИЧТОЖЕНЫ','#ff6ac8');E.gfill(576,190,580,230,0)}
    if(Q.done&&pl.x>560)finish([['c','Мрр. (Она там. За стеной. Я слышу, как она дышит.)'],['s','(рация) Черсик! Мы бежим к тебе, не лезь один!'],['c','Мяу. (Поздно.)']],()=>playC10(CUT_QUEEN,()=>sec10('q1'),'cut'))};
  intro('ВЕНТИЛЯЦИЯ · ЧЕРСИК','#d4ff3a',[['m','Черсик, в шахту пролезешь только ты. Кладки — порви.'],['c','Мяу. (Корма у тренера нет. Но я и так злой.)'],['s','Котик, осторожно. Ты у нас один.']]);
}};

// ================= 6. КРЫСИНАЯ КОРОЛЕВА: три героя по очереди =================
const QHP=10800,QP=[1,.8,.45,0];
function lvQueen(id){const L=E.mkLevel(id,460,360);B(0,0,460,360,'#120810');K.floor(20,20,440,340,'slime');
  for(let i=0;i<40;i++)B(30+r4(400),30+r4(300),3,2,i%3?'#c8c0a8':'#8a7a6a');
  E.gfill(170,20,290,60,1);B(170,20,120,40,'#3a2a2a');for(let i=0;i<14;i++)B(172+r4(110),22+r4(34),4,3,['#6a5a4a','#8a6a3a','#4a4a52','#c8302a'][i%4]);K.txt(230,46,'ТРОН ИЗ МУСОРА','#ff6ac8',5);
  for(const [x,y] of [[90,120],[370,120],[90,260],[370,260]]){E.gfill(x-9,y-9,x+9,y+9,2);B(x-9,y-9,18,18,'#4a3a3e');B(x-9,y-9,18,3,'#6a5a5e')}
  L.lights.push([230,180,170,.6]);L.dark=.58;L.tint='26,4,22';X.buildNav();edges(L);
  pl.x=230;pl.y=310;pl.a=-Math.PI/2;
  const qi=['q1','q2','q3'].indexOf(id.slice(0,2)),st=QHP*QP[qi];
  const hp=Math.round(C10.qhp>QHP*QP[qi+1]&&C10.qhp<=st+1?C10.qhp:st);
  const z=addZ('boss',230,100,{v:233,hp,max:QHP,nm:'КРЫСИНАЯ КОРОЛЕВА',nmc:'#ff6ac8',r:12,sc:1.6,noConv:1});z.stun=99;Q.boss=z;
  Q.bossNm='КРЫСИНАЯ КОРОЛЕВА';Q.bossCol='#ff6ac8';Q.bossMarks=[QP[1],QP[2]];Q.bossHp=()=>Math.max(0,z.hp)/QHP;
  Q.cd=2;Q.sum=4;Q.ct=0;Q.ch=0;Q.chW=0;Q.fz=[];
  Q.over=()=>{if(Q.ch>0&&Q.chW>0&&!z.dead){ctx.strokeStyle=`rgba(255,60,160,${.5+.5*Math.sin(tm*30)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(z.x,z.y,26,0,TAU);ctx.stroke()}
    if(!z.dead&&Q.crown){ctx.fillStyle='rgba(255,106,200,.12)';ctx.beginPath();ctx.arc(z.x,z.y,30+Math.sin(tm*4)*2,0,TAU);ctx.fill()}};
  return {L,z}}
// общий мозг королевы; lvl: 0 — Черсик, 1 — Шмакодявка, 2 — Микроб
function queenTick(dt,lvl,stopAt,onStop){const z=Q.boss;if(!z)return;
  if(z.dead||z.hp<=QHP*stopAt){if(!Q.fin){C10.qhp=Math.max(0,z.hp);onStop()}return}
  if(Q.fin||!E.L.armed){z.stun=99;return}
  z.stun=99;const d=D2(z.x,z.y,pl.x,pl.y),ta=Math.atan2(pl.y-z.y,pl.x-z.x);
  let sp=lvl===2?24:17,mv=ta;if(Q.ch>0){Q.chW-=dt;if(Q.chW>0)mv=null;else{Q.ch-=dt;sp=150;mv=Q.chA;if(d<20&&!Q.chHit){Q.chHit=1;X.hurtPlayer(28);C1.shake=.5}}}else if(d<34)mv=null;
  if(mv!=null){K.mv(z,Math.cos(mv)*sp*dt,Math.sin(mv)*sp*dt,10);z.ph=(z.ph||0)+dt*sp*.25}
  z.a=Q.ch>0?Q.chA:ta;
  Q.cd-=dt;if(Q.cd<=0&&Q.ch<=0){const r=Math.random();
    if(d<52&&r<.5){Q.cd=lvl===2?1.3:1.7;sfx('swing',1);K.tele(z.x,z.y,46,.75,lvl?26:22,'saw')}
    else if(r<.8){Q.cd=lvl===2?1.5:2;sfx('spit',1);const n=lvl===2?7:5;for(let i=0;i<n;i++)proj(z.x+Math.cos(ta)*14,z.y+Math.sin(ta)*14,ta+(i/(n-1)-.5)*(lvl===2?1.1:.9),150,13,{col:'#9aff3a',r:2.4,life:2.6,onHit:b=>{PS.slow=Math.max(PS.slow||0,.8)}})}
    else if(lvl===2){Q.cd=1.4;Q.ch=.55;Q.chW=.7;Q.chA=ta;Q.chHit=0;X.floatT(z.x,z.y-24,'ПИ-И-И!','#ff6ac8')}
    else{Q.cd=1.6;for(let i=0;i<3;i++)K.tele(pl.x+rnd(-30,30),pl.y+rnd(-30,30),14,1.1,14,'fire',t=>fireZone(t.x,t.y,13,3))}}
  Q.sum-=dt;if(Q.sum<=0&&live()<(lvl===1?22:26)){Q.sum=lvl===0?5:lvl===1?7:6.5;sfx('scream',.7);X.floatT(z.x,z.y-24,'КО МНЕ, ДЕТКИ!','#ff6ac8');
    for(let i=0;i<(lvl===0?6:5);i++)rat(lvl===0?'mouse':(Math.random()<.5?'mouse':'rat'),z.x+rnd(-24,24),z.y+rnd(10,24));
    if(lvl===1)for(let i=0;i<2;i++){const e=[[40,320],[420,320],[40,40],[420,40]][r4(4)];gunRat(e[0],e[1],false)}
    if(lvl===2){gunRat([40,420][r4(2)],320,false);if(Math.random()<.4)rat('big',z.x,z.y+20)}}
  if(d<20){Q.ct-=dt;if(Q.ct<=0){Q.ct=.7;X.hurtPlayer(lvl?16:10)}}
  supply(dt)}
SEC.q1={hero:'c10',build(){lvQueen('q1_10');Q.crown=1;
  E.L.obj=()=>['Королева: '+Math.ceil(Math.max(0,Q.boss.hp)/QHP*100)+'%','Черсик держится до 80%'];
  Q.tick=dt=>queenTick(dt,0,QP[1],()=>{finish([['rq','Гадкий... котишка!..'],['c','Мря-а-у!.. (Хвостом... больно...)'],['s','ОТОЙДИ ОТ МОЕГО КОТА!'],['s','Черсик, за меня! Зай, я её держу!']],()=>sec10('q2'))});
  intro('КРЫСИНАЯ КОРОЛЕВА','#ff6ac8',[['rq','Котик... Маленький, чёрный... Мои детки тебя помнят.'],['rq','Ты убил моего мужа. Короля.'],['c','Мяу. (Было дело.)'],['rq','Тогда я сделаю из тебя шапку.']]);
}};
SEC.q2={hero:'s',build(){lvQueen('q2_10');
  E.L.obj=()=>['Королева: '+Math.ceil(Math.max(0,Q.boss.hp)/QHP*100)+'%','Шмакодявка держится до 45%'];
  Q.tick=dt=>queenTick(dt,1,QP[2],()=>{finish([['rq','Девчонка... Розовая... ДЕВЧОНКА!'],['s','Зай!.. Патроны кончаются!'],['m','Отходи, Шмакодявка. Дальше — я.'],['m','У меня для неё подарок. От Аниса.']],()=>sec10('q3'))});
  intro('КОРОЛЕВА · ШМАКОДЯВКА','#ff7ac8',[['s','Королева, да? Ну, принцесса тут одна.'],['rq','Автоматчики! Ко мне!'],['m','(издалека) Шмакодявка, держись! Я бегу!']]);
}};
SEC.q3={hero:'mr',build(){lvQueen('q3_10');
  E.L.obj=()=>['Королева: '+Math.ceil(Math.max(0,Q.boss.hp)/QHP*100)+'%','Штуцер Аниса — добей её'];
  Q.tick=dt=>queenTick(dt,2,0,()=>{K.ghostAll('rgba(255,106,200,A)');Q.pr=[];Q.fz=[];finish([['rq','Город... был... мой...'],['m','Город — наш.'],['s','Зай... всё?'],['c','Мяу. (Всё.)']],()=>endGame())});
  intro('КОРОЛЕВА · МИКРОБ','#ffd23a',[['m','Штуцер Аниса. На медведя ходил.'],['m','На королеву — тем более.'],['rq','Ещё один! Сколько вас?!'],['m','Трое. Нам хватает.']]);
}};

// ================= ВОЖДЕНИЕ: Land Rover к Троицкому мосту =================
const DW=480,DH=3000;
function startDrive(){
  C10.on=true;C10.sec='drive';mz10('drive');
  const Zc=(x,y,o)=>E.addZ('normal',x,y,Object.assign({hp:55,max:55,sp:24},o||{})),Zf=(x,y,o)=>E.addZ('fast',x,y,Object.assign({hp:36,max:36,sp:50},o||{}));
  K.car(C10,{id:'drive10',w:DW,h:DH,startX:240,startY:DH-140,route:'ДВОРЦОВАЯ НАБ. → ТРОИЦКИЙ МОСТ',title:'КРАСНЫЙ LAND ROVER',sub:'Микроб за рулём, Шмакодявка за турелью, Черсик на панели',hudCol:'#d03a30',vmax:120,
    gun:{name:'ТУРЕЛЬ',cd:.085,dmg:19,sp:440,snd:'shot',heat:.03,ohNote:'Турель перегрелась! Микроб, газуй!'},armorTxt:'ЛЕНД РОВЕР — ТАНК',
    build(L){B(0,0,DW,DH,'#1a2a3a');E.gfill(0,0,DW,DH,1);E.gfill(110,0,370,DH,0);
      for(let y=0;y<DH;y+=4)for(let x=110;x<370;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,h<.1?'#3a3a40':h>.93?'#2a2a30':'#34343a')}
      for(let y=0;y<DH;y+=40)B(239,y,2,20,'#e8e8e0');B(112,0,2,DH,'#c8c8c0');B(366,0,2,DH,'#c8c8c0');
      for(let y=0;y<DH;y+=4)for(let x=0;x<106;x+=4){const k=(Math.sin(x*.06+y*.05+hash(x>>3,y>>3))+1)*.5;B(x,y,4,4,k>.85?'#4a7aa8':k<.2?'#1a3a5a':'#24486a')}
      B(106,0,4,DH,'#8a8a90');for(let y=0;y<DH;y+=10)B(106,y,4,2,'#6a6a70');
      for(let y=40;y<DH;y+=100){const c=['#d8c8a0','#a8c8a8','#e0b0a0','#c8d0e0'][(y/100|0)%4];B(374,y,106,90,c);B(374,y,106,3,shade(c,1.15));for(let wy=y+10;wy<y+84;wy+=14)for(let wx=380;wx<476;wx+=12)B(wx,wy,6,9,hash(wx,wy)>.65?'#ffd27a':'#2a3040')}
      K.txt(240,DH-60,'ДВОРЦОВАЯ НАБЕРЕЖНАЯ','#e8e0c8',7);K.txt(240,170,'ТРОИЦКИЙ МОСТ — РАЗВЕДЁН!','#ff6a6a',7);K.txt(55,DH*.5,'НЕВА','#8ac8ff',9);
      B(110,150,260,10,'#c8202a');for(let x=110;x<370;x+=20)B(x,150,10,10,'#f0f0f0');
      for(let y=100;y<DH;y+=120){L.lights.push([114,y,60,.7],[366,y,60,.7])}
      let s=23;const rr=()=>{s=(s*16807)%2147483647;return s/2147483647};
      for(let y=DH-400;y>400;y-=110+rr()*90){const x=rr()<.5?130+rr()*60:280+rr()*60;X.carTop(x|0,y|0,['#e8e8e8','#3a8ae8','#2a2a2a','#c8302a','#e8c040'][(rr()*5)|0],true);if(rr()<.2)Q.fires.push([x+8,y+14])}
      for(let y=DH-500;y>300;y-=28+rr()*28){const n=1+(rr()*2.6|0);for(let i=0;i<n;i++){const x=125+rr()*230,r=rr();if(K.solid(x,y,6))continue;
        if(r<.45)Zc(x,y);else if(r<.7)Zf(x,y);else if(r<.92)E.addZ('normal',x,y,{v:210+(rr()*4|0),hp:40,max:40,sp:30,noConv:1});else E.addZ('brute',x,y,{hp:300,max:300})}}
      L.dark=.4;L.tint='20,14,30'},
    draw(x,y,a,ta,fl){if(window.ROVER_DRAW)ROVER_DRAW(x,y,a,ta,fl,true);else{ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#c82a2a';ctx.fillRect(-14,-8,28,16);ctx.restore()}},
    tick(c,dt){},
    prog:c=>(c.start-c.y)/(c.start-200),fin:c=>c.y<200,
    onFin(k){C10.driveK=k;X.go(()=>playC10(CUT_JUMP,()=>sec10('emb'),'cut'))}});
  after(.8,()=>say([['s','Зай, ты точно умеешь его водить?'],['m','Я его водил. В главе два. Ты его водила.'],['c','Мяу. (Я на панели. Я — навигатор.)'],['s','Стреляю! Веди ровно!']]));
}

// ================= КАТ-СЦЕНЫ =================
const SN=['#060814','#0a0c1c','#0e1024','#12142c','#161834','#1a1c3a','#1e2040','#222446','#26284a','#2a2c4e'];
const DAWN=['#2a2448','#3a2c58','#4a3460','#6a3e64','#8a4a62','#b05a5a','#d07450','#e8944a','#f0b45a','#f4cc7a'];
const DAY=K.SKY_SUN||['#5aa8e8','#68b0ea','#76b8ec','#84c0ee','#92c8f0','#a0d0f2','#aed8f4','#bce0f6','#cae8f8','#d8f0fa'];
function neva(y,t){F(0,y,W,H-y,'#24486a');for(let i=0;i<28;i++){const x=mod(i*37-t*10,W),yy=y+4+(i*13)%(H-y-6);F(x,yy,8,1,'#4a7aa8')}}
function fortress(x,y,spire,t){F(x,y-24,170,24,'#8a5a4a');for(let i=0;i<170;i+=12)F(x+i,y-28,8,4,'#a87060');
  F(x+60,y-60,40,36,'#e8c8a8');F(x+64,y-56,32,28,'#d8b898');F(x+70,y-80,20,20,'#e8c8a8');F(x+74,y-90,12,10,'#4a8a6a');
  if(spire){const k=typeof spire==='number'?spire:1;F(x+79,y-90-16*k,2,16*k,'#f0d060');if(k>=1){/* золотой Черсик вместо ангела */const v=y-106;F(x+76,v,8,1,'#c89a20');F(x+76,v-4,6,4,'#ffd23a');F(x+81,v-8,4,4,'#ffd23a');F(x+81,v-9,1,1,'#ffd23a');F(x+84,v-9,1,1,'#ffd23a');F(x+75,v-8,1,5,'#ffd23a');F(x+82,v-7,1,1,'#3a2a00');F(x+77,v-3,2,1,'#fff6c8')}}
  else{F(x+79,y-96,2,6,'#c89a20')}}
function sideAnis(x,y,t,zombie){const SK=zombie?'#8aa078':'#e2ad8c',J='#4e4e32';F(x-3,y-10,2,10,'#24242a');F(x,y-10,2,10,'#24242a');F(x-4,y-22,8,12,J);F(x-4,y-22,8,1,'#6a6a48');
  F(x-3,y-30,7,8,SK);F(x-4,y-31,8,3,'#241a15');F(x+2,y-27,1,1,zombie?'#ff2020':'#2a1e18');F(x+4,y-20,10,2,'#2a2a2e');F(x+1,y-19,4,3,'#6a4424')}
function sideQueen(x,y,t,dead){ctx.save();ctx.translate(x,y);if(dead){ctx.rotate(1.4);ctx.translate(0,10)}
  ctx.fillStyle='#5a1a4a';ctx.beginPath();ctx.ellipse(-4,-18,20,18,0,0,TAU);ctx.fill();ctx.fillStyle='#5e504c';ctx.beginPath();ctx.ellipse(0,-20,16,15,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.ellipse(16,-30,9,8,0,0,TAU);ctx.fill();F(23,-31,3,2,'#ff8ab8');F(18,-33,2,2,dead?'#3a0a0a':'#ff2020');F(10,-46,14,6,'#f0c040');for(let i=0;i<4;i++)F(10+i*4,-50,2,4,'#f0c040');F(16,-45,2,2,'#c03aff');
  for(let i=0;i<20;i++)F(-20-i*1.6,-6+Math.sin(t*3+i*.5)*3,2,2,'#d890a8');ctx.restore()}
function stars(t){for(let i=0;i<30;i++){const x=(i*53)%W,y=(i*29)%70;if(Math.sin(t*2+i)>-.3)F(x,y,1,1,'#ffffff')}}
function raisedBridge(){F(0,118,130,12,'#5a5a62');F(250,118,W-250,12,'#5a5a62');for(let x=0;x<W;x+=24){if(x>126&&x<250)continue;F(x,108,2,10,'#3a3a40')}
  ctx.save();ctx.translate(130,118);ctx.rotate(-.75);F(0,0,52,8,'#6a6a72');F(0,0,52,2,'#8a8a92');ctx.restore();ctx.save();ctx.translate(250,118);ctx.rotate(.75+Math.PI);F(0,-8,52,8,'#6a6a72');F(0,-8,52,2,'#8a8a92');ctx.restore();
  F(122,118,12,30,'#4a4a52');F(246,118,12,30,'#4a4a52')}
function heli(x,y,t){F(x-14,y-4,28,10,'#3a4a3a');F(x+14,y-1,16,3,'#3a4a3a');F(x+28,y-5,2,8,'#3a4a3a');F(x-8,y-2,10,5,'#8ac8e8');const k=Math.sin(t*40)*20;F(x-k,y-8,2*Math.abs(k)+1,1,'#1a1a1a');F(x-2,y-8,4,4,'#1a1a1a')}

const CUT_GO=[
  {dur:1,lines:[['H','Бойцы! Двор держим. Ваше дело — Заячий остров.'],['G','Тут патроны, тут бутерброды. Бутерброды — Черсику.'],['e','Микроб! Колонку возьмёшь? Нет? Ну и зря.'],['val','Land Rover заправлен. Турель смазана. Я бы поехал, но...'],
    ['ol','...но он обещал мне пармезан. Живым.'],['vd','Микроб, если что — X6 у подъезда. Ключи под ковриком. Шучу. Ключей нет.'],['st','(протягивает бутылку) Это не пиво. Это самогон Аниса. Последняя. Вдруг пригодится.'],
    ['m','...Спасибо, Столыпин.'],['vel','Коллеги. Удачи. Юридически вы — герои.'],['sat','Одну каточку — когда вернётесь.'],['s','Договорились.']],
    draw(t){K.skyG(DAWN,0,110);F(0,40,W,70,'#5a2a22');for(let x=4;x<W;x+=30)for(let y=48;y<104;y+=12)F(x,y,6,6,Math.sin(x+y)>.3?'#ffd27a':'#2a3a5a');F(0,106,W,74,'#2a2a30');
      K.carSide(30,168,t,'rover',{heads:[[16,'#3a2a20'],[28,'#2a1a14']]});if(A8.sideHanzha)A8.sideHanzha(110,170,t);K.sideEgor(140,170,t,'stand');K.sideValera(160,170,t,'stand');K.sideOlesya(180,170,t,'stand');
      K.sideVlados(200,170,t,'stand');K.sideStolypin(222,170,t,'stand');if(A8.sideVel)A8.sideVel(246,170,t,'stand');if(A8.sideSat)A8.sideSat(266,170,t,'stand');K.catSide(290,168,t,1.6,'stand',K.PAL_SIAM)}},
  {dur:4,subs:[[.2,3.8,null,'(Красный Land Rover выезжает со двора. Весь штаб машет вслед.)']],draw(t){K.skyG(DAWN,0,110);F(0,106,W,74,'#2a2a30');K.carSide(60+t*60,168,t,'rover',{move:true,heads:[[16,'#3a2a20'],[28,'#2a1a14']]});
    if(A8.sideHanzha)A8.sideHanzha(40,170,t);K.sideEgor(20,170,t,'stand')}},
];
const CUT_JUMP=[
  {dur:1,lines:[['s','Зай! Мост! Он РАЗВЕДЁН!'],['m','Вижу.'],['s','Ты же не собираешься...'],['m','Собираюсь. Держи кота.'],['c','МЯУ!!! (Я ДЕРЖУСЬ САМ!)']],draw(t){K.skyG(DAWN,0,120);neva(130,t);
    fortress(200,112,false,t);raisedBridge();K.carSide(20,118,t,'rover',{heads:[[16,'#3a2a20'],[28,'#2a1a14']]})}},
  {dur:5,subs:[[.2,1.6,'m','Держитесь!'],[1.8,3.4,'s','А-А-А-А-А!!!'],[3.6,4.8,'c','МЯ-А-А-У!!!']],draw(t){K.skyG(DAWN,0,120);neva(130,t);
    fortress(200,112,false,t);raisedBridge();
    const k=clamp(t/4,0,1),x=-20+k*300,y=118-Math.max(0,Math.sin(Math.min(1,Math.max(0,(x-110)/170))*Math.PI))*80;
    ctx.save();ctx.translate(x+26,y-10);ctx.rotate(x<120?0:x<290?-.25+(x-120)/170*.5:0);ctx.translate(-26,10);K.carSide(0,0,t,'rover',{heads:[[16,'#3a2a20'],[28,'#2a1a14']]});ctx.restore();
    if(t>3.9){C1.shake=.6;for(let i=0;i<6;i++)F(x+rnd(0,52),y-rnd(0,8),2,2,'#c8c8c0')}}},
  {dur:1,lines:[['m','...Приехали.'],['s','Я тебя убью. Потом. Когда всё кончится.'],['c','Мяу. (Я поседел. Я чёрный кот, и я поседел.)'],['m','Дальше пешком. Крепость — за площадью.']],draw(t){K.skyG(DAWN,0,120);F(0,120,W,60,'#3a3a40');
    K.carSide(140,170,t,'rover',{});F(186,148,6,6,'#d8d8d0');sideMikrob(110,170,t,'stand');K.sideShmak(90,170,t,'stand',true);K.catSide(70,168,t,1.6,'stand',K.PAL_BLACK)}},
];
const CUT_DOWN=[
  {dur:1,lines:[['m','Лестница вниз. И она... стерильная.'],['s','Лаборатория? Под собором?'],['c','Мрр. (Пахнет Анисом. Точно им.)'],['m','Шмакодявка, держи люк сверху. Если полезут — стреляй.'],['s','А ты?'],['m','А я поговорю со старым другом.']],
    draw(t){F(0,0,W,H,'#0e1014');for(let i=0;i<8;i++){F(120+i*10,40+i*14,60,4,'#3a4a5a')}F(0,150,W,30,'#1a2a2a');F(140,20,40,8,'#3ef06a');sideMikrob(150,150,t,'stand');K.catSide(130,148,t,1.6,'stand',K.PAL_BLACK)}},
];
const CUT_ARENA=[
  {dur:1,lines:[['m','Анис?..'],['za','(свист)'],['m','Ты... живой? Мы же тебя похоронили.'],['za','...не я... Она...'],['za','УХОДИ, МИКРОБ!'],['m','Не уйду. Ты бы не ушёл.']],
    draw(t){F(0,0,W,H,'#120a0a');F(0,140,W,40,'#2a2a30');for(let i=0;i<6;i++)F(20+i*52,20,6,3,'#ff3a3a');sideMikrob(90,170,t,'stand');sideAnis(230,170,t,true);
      if(Math.sin(t*3)>0)for(let i=0;i<3;i++){const k=(t*2+i/3)%1;ctx.strokeStyle=`rgba(255,255,255,${1-k})`;ctx.beginPath();ctx.arc(236,143,3+k*10,-.6,.6);ctx.stroke()}}},
];
const CUT_ANIS=[
  {dur:1,lines:[['za','Микроб... Ты вырос.'],['m','Анис... держись. Мы что-нибудь придумаем.'],['za','Не придумаете. Я — её. Был её.'],['za','Сервер... там был адрес гнезда... я пытался стереть... простите.'],
    ['za','Королева — за вентиляцией. Туда только кот пролезет.'],['za','Штуцер... возьми. На медведя ходил.'],['za','На королеву — тем более.'],['za','И самогон мой... допейте. За меня.'],['m','...Спи, Анис.']],
    draw(t){F(0,0,W,H,'#120a0a');F(0,140,W,40,'#2a2a30');ctx.save();ctx.translate(200,166);ctx.rotate(-1.57);sideAnis(0,0,t,true);ctx.restore();F(210,150,24,3,'#2a2a2e');sideMikrob(160,170,t,'stand')}},
  {dur:5,subs:[[.2,2.4,null,'(Микроб поднимает штуцер Аниса.)'],[2.5,4.8,'s','(рация) Зай... Ты как?'],],draw(t){F(0,0,W,H,'#120a0a');F(0,140,W,40,'#2a2a30');sideMikrob(160,170,t,'stand');F(166,150,22,2,'#2a2a2e');F(160,151,6,3,'#6a4424')}},
  {dur:1,lines:[['m','Нормально. Анис... всё.'],['s','...'],['c','Мяу. (Вентиляция. Я пойду.)'],['m','Черсик, кладки рви. Мы — следом.']],draw(t){F(0,0,W,H,'#120a0a');F(0,140,W,40,'#2a2a30');F(250,60,40,30,'#2a2e36');for(let i=0;i<5;i++)F(252,64+i*5,36,2,'#1a1e26');sideMikrob(160,170,t,'stand');K.catSide(220,168,t,1.6,'stand',K.PAL_BLACK)}},
];
const CUT_QUEEN=[
  {dur:5,subs:[[.2,2.4,null,'(Тронный зал из мусора. На троне — она.)'],[2.5,4.8,'rq','Вы-ы пришли-и-и...']],draw(t){F(0,0,W,H,'#120810');F(0,140,W,40,'#2a1a22');F(130,100,120,40,'#3a2a2a');for(let i=0;i<14;i++)F(132+(i*29)%110,104+(i*7)%30,4,3,['#6a5a4a','#8a6a3a','#4a4a52','#c8302a'][i%4]);sideQueen(200,100,t);K.catSide(60,168,t,1.6,'stand',K.PAL_BLACK)}},
];
const CUT_FINAL=[
  {dur:5,subs:[[.2,2.4,null,'(Королева падает. И по всему гнезду крысы замирают...)'],[2.5,4.8,null,'(...и падают. Одна за другой. По всему городу.)']],draw(t){F(0,0,W,H,'#120810');F(0,140,W,40,'#2a1a22');sideQueen(200,140,t,true);
    for(let i=0;i<14;i++){const x=(i*41)%W,k=clamp(t-i*.2,0,1);ctx.save();ctx.translate(x,170);ctx.rotate(k*1.5);F(-4,-4,8,4,'#4a4440');ctx.restore()}sideMikrob(80,170,t,'stand');K.sideShmak(60,170,t,'stand',true);K.catSide(110,168,t,1.6,'stand',K.PAL_BLACK)}},
  {dur:1,lines:[['s','Зай... земля трясётся.'],['m','Лаборатория рушится. БЕЖИМ!'],['c','МЯУ! (Я ПЕРВЫЙ!)']],draw(t){F(0,0,W,H,'#120810');C1.shake=.3;for(let i=0;i<10;i++)F((i*37+t*40)%W,(t*90+i*19)%140,5,4,'#4a3a3e');F(0,140,W,40,'#2a1a22')}},
  {dur:6,subs:[[.2,2.8,null,'(Рассвет над Невой. Над крепостью — тишина.)'],[2.9,5.8,null,'(Вертолёт несёт новый шпиль. Наверху — золотой Черсик.)']],draw(t){K.skyG(DAWN,0,120);neva(130,t);fortress(70,130,clamp((t-3.5)/2,0,1)||false,t);
    const hx=clamp(330-t*40,150,330),hy=40+clamp((t-3)*12,0,26);heli(hx,hy,t);if(t<3.5){F(hx-1,hy+6,2,30,'#c8c8c0');F(hx-1,hy+36,2,40,'#f0d060')}}},
  {dur:1,lines:[['r','Экстренный выпуск. Говорит Петербург.'],['r','Этой ночью по всему городу заражённые крысы погибли. Одновременно. Учёные не могут объяснить.'],['r','Зомби в Ленинградской области замерли и больше не встают. Специалисты называют это «концом заразы».'],
    ['r','А над Петропавловской крепостью сегодня утром встал новый шпиль. Город решил: вместо ангела — золотой кот Черсик. В честь героя.'],['r','Город — свободен.']],draw(t){K.skyG(DAY,0,140);neva(140,t);fortress(70,140,true,t);K.newsBar('ГОРОД СВОБОДЕН · ЗАРАЗА ПОБЕЖДЕНА',true)}},
  {dur:1,lines:[['m','Шмакодявка...'],['s','Мм?'],['m','Поехали домой.'],['s','Пешком? Land Rover в Неве.'],['m','Пешком.'],['c','Мяу. (Меня понесёте.)']],draw(t){K.skyG(DAY,0,120);neva(150,t);F(0,140,W,12,'#8a8a90');
    sideMikrob(140,150,t,'stand');K.sideShmak(160,150,t,'stand');K.catSide(122,148,t,1.6,'stand',K.PAL_BLACK);fortress(190,140,true,t)}},
];

// ================= ЭПИЛОГ: судьбы =================
function card(t,o){K.skyG(o.sky||DAY,0,120);F(0,118,W,62,o.gr||'#3a3a40');if(o.bg)o.bg(t);
  const px=8,py=8;ctx.fillStyle='rgba(8,5,16,.75)';ctx.fillRect(px-2,py-2,52,52);const g=PCV[o.p].getContext('2d');PORTRAIT[o.p](g,false,(t%3.4)>3.25);ctx.imageSmoothingEnabled=false;ctx.drawImage(PCV[o.p],px,py,48,48);
  ctx.fillStyle='rgba(8,5,16,.7)';ctx.fillRect(62,8,W-70,22);ctx.font='bold 7px "Trebuchet MS",sans-serif';ctx.fillStyle=NCOL[o.p]||'#ffd23a';ctx.fillText(o.nm,66,17);ctx.font='5px "Trebuchet MS",sans-serif';ctx.fillStyle='#ffffff';ctx.fillText(o.tag,66,26);
  if(o.fg)o.fg(t)}
const EPI=[
  {p:'m',nm:'МИКРОБ',tag:'основатель «Протеин-Корп»',sub:'Открыл свою компанию. На столе в кабинете — статуэтка охотника с ружьём. Каждое утро он говорит ей: «Доброе утро, Анис».',
    fg:t=>{F(120,140,90,6,'#6a4a2a');F(126,146,4,24,'#4a3020');F(200,146,4,24,'#4a3020');F(180,126,6,14,'#d8a830');F(181,122,4,4,'#e8c050');sideMikrob(240,170,t,'stand')}},
  {p:'s',nm:'ШМАКОДЯВКА',tag:'студия ресниц «Розовый Глок» · чемпионка CS',sub:'Наращивает ресницы полгорода. По вечерам с Валерой берёт турниры по CS — Валера всё так же кричит «раш Б».',
    fg:t=>{K.sideShmak(120,170,t,'stand',true);K.sideValera(160,170,t,'stand');F(200,130,60,36,'#1a1a22');F(204,134,52,26,'#3a6ae8');F(226,166,8,4,'#2a2a30');ctx.font='bold 6px monospace';ctx.fillStyle='#ffd23a';ctx.fillText('16:0',214,150)}},
  {p:'c',nm:'ЧЕРСИК',tag:'лицо бренда «КОТ-ПРОТЕИН»',sub:'Его лицо — на каждой банке кошачьего протеина. Сам он протеин не ест. Ест корм. Много. А с нового шпиля на Заячьем острове на город смотрит его золотая копия.',
    fg:t=>{for(let i=0;i<5;i++){F(110+i*28,138,20,28,'#1a1a22');F(112+i*28,144,16,10,'#e8ff4a');ctx.font='bold 3px monospace';ctx.fillStyle='#1a1a22';ctx.fillText('КОТ',113+i*28,150)}K.catSide(260,168,t,2,'stand',K.PAL_BLACK)}},
  {p:'w',nm:'МЫШ',tag:'почётный гость',sub:'Каждое воскресенье приходит в гости. Говорит — к Черсику. На самом деле — к миске.',
    fg:t=>{K.catSide(140,168,t,1.6,'stand',K.PAL_SIAM);F(170,164,14,4,'#c8c8d0');F(172,162,10,2,'#8a5a3a');K.catSide(210,168,t,1.6,'stand',K.PAL_BLACK)}},
  {p:'e',nm:'ЕГОР «АЛКОПАТИМЕН»',tag:'клуб «Бардак 2.0» на Думской',sub:'Отстроил «Бардак» заново. Колонку не унёс ни разу. Лазер из очков теперь — часть светового шоу.',
    sky:SN,gr:'#1a1a22',bg:t=>{stars(t);for(let i=0;i<5;i++){ctx.strokeStyle=['#ff5aa8','#3ef0b0','#ffd23a','#8a5aff','#ff3a3a'][i];ctx.beginPath();ctx.moveTo(200,40);ctx.lineTo(80+i*50+Math.sin(t*2+i)*30,120);ctx.stroke()}},
    fg:t=>{K.sideEgor(200,170,t,'stand');F(230,150,12,18,'#141418');F(233,154,6,6,'#2a2a30')}},
  {p:'H',nm:'КОМАНДИР ХАНЖА',tag:'председатель ТСЖ · аэродром во дворе',sub:'Председатель ТСЖ. Во дворе теперь своя взлётная полоса. Гатлинг — в кладовке. На всякий случай.',
    fg:t=>{F(100,150,200,10,'#4a4a52');for(let x=100;x<300;x+=20)F(x,154,10,2,'#e8e8e0');if(A8.sideHanzha)A8.sideHanzha(60,170,t)}},
  {p:'G',nm:'МИХАЛЫЧ',tag:'сеть магазинов «У Михалыча»',sub:'Сорок магазинов по городу. В каждом под прилавком лежит что-нибудь, о чём лучше не спрашивать.',
    fg:t=>{for(let i=0;i<3;i++){F(90+i*70,110,60,50,'#c8b090');F(90+i*70,110,60,8,'#c8302a');ctx.font='bold 4px monospace';ctx.fillStyle='#fff';ctx.fillText('У МИХАЛЫЧА',93+i*70,116);F(110+i*70,140,20,20,'#2a3040')}}},
  {p:'D',nm:'ДВОРНИК',tag:'хранитель ключей',sub:'Хранит ключи от всего: от подвала, от крыши, от катакомб. Никому не даёт. И правильно.',
    fg:t=>{F(170,120,40,30,'#6a4a2a');for(let i=0;i<8;i++){F(174+i*4,126,2,6,'#d8c040');F(173+i*4,124,4,2,'#d8c040')}}},
  {p:'val',nm:'ВАЛЕРА',tag:'«Труба Airlines»',sub:'Гидросамолёт, два рейса в неделю: Петербург — Италия. Бортпроводник — он же. Трубы чинит в полёте.',
    sky:DAY,bg:t=>{K.clouds?K.clouds(t,40):0},fg:t=>{K.planeSide?K.planeSide(100+mod(t*30,140),70,t,{}):F(140,70,40,8,'#e8e8e8');neva(150,t)}},
  {p:'ol',nm:'ОЛЕСЯ',tag:'сырная лавка «Пармезан»',sub:'Валера всё-таки привёз ей пармезан. Целую голову. Теперь у неё своя сырная лавка на Рубинштейна.',
    fg:t=>{K.sideOlesya(150,170,t,'stand');ctx.fillStyle='#f0d070';ctx.beginPath();ctx.arc(200,150,14,0,TAU);ctx.fill();F(186,148,28,4,'#e0c060')}},
  {p:'vd',nm:'ВЛАДОС И СТОЛЫПИН',tag:'автосервис «Пила и Пиво»',sub:'Чинят машины. Пилят двери. Пьют пиво после смены. Серая X6 — на вечном ремонте.',
    fg:t=>{K.carSide(150,170,t,'x6',{});K.sideVlados(110,170,t,'stand',true);K.sideStolypin(230,170,t,'stand',{})}},
  {p:'pa',nm:'БАТЯ И МАМА',tag:'Перелесье',sub:'Грядки охраняют две турели. Кабачки — неприкосновенны. Леший не возвращался.',
    gr:'#3a5a2a',fg:t=>{for(let i=0;i<6;i++)F(80+i*30,150,20,8,'#5a3a22');F(70,130,10,20,'#4a4a52');F(240,130,10,20,'#4a4a52');K.sideParent(140,170,t,'stand');K.sideParent(170,170,t,'stand',true)}},
  {p:'du',nm:'ДЮША И «БАБУРА»',tag:'тур с Лёхой Superlative',sub:'Двадцать городов, сорок концертов. В райдере: «грибы — только в виде декора».',
    sky:SN,gr:'#1a1a22',bg:t=>{stars(t);for(let i=0;i<6;i++){ctx.fillStyle=`rgba(${[255,62,255][i%3]},${[90,240,210][i%3]},${[200,176,60][i%3]},.2)`;ctx.beginPath();ctx.arc(60+i*45,70,20+Math.sin(t*3+i)*5,0,TAU);ctx.fill()}}},
  {p:'vel',nm:'ВЕЛИКИЙ И САТУРНАЛИЯ',tag:'киберарена «Пески» · Екатеринбург',sub:'Карта «Пески» стала настоящей ареной. Великий — главный судья. Сатурналия — главная угроза.',
    fg:t=>{if(A8.sideVel)A8.sideVel(140,170,t,'stand');if(A8.sideSat)A8.sideSat(170,170,t,'stand');F(200,120,90,40,'#d8c08a');ctx.font='bold 6px monospace';ctx.fillStyle='#5a3a1a';ctx.fillText('ПЕСКИ',225,144)}},
  {p:'kt',nm:'ОХОТНИЦА КАТЯ',tag:'служба «Свистунов.нет»',sub:'Снимает крыс-свистунов с крыш по всей Ленобласти. По пятницам — девичник со Шмакодявкой. Ружьё всё так же ревнивое.',
    fg:t=>{if(C9.sideKat)C9.sideKat(150,170,t,false);K.sideShmak(180,170,t,'stand');F(220,150,30,4,'#5a4e48');F(246,151,4,2,'#c88a8a')}},
  {p:'a',nm:'АНИС',tag:'самогон «Анисовка»',sub:'Его самогон теперь продают в каждом магазине Михалыча. На этикетке — охотник с ружьём. Помним.',
    sky:DAWN,fg:t=>{for(let i=0;i<5;i++){F(110+i*24,130,12,30,'#c8d8c0');F(114+i*24,124,4,6,'#c8d8c0');F(112+i*24,140,8,10,'#4e4e32')}}},
];
const CUT_EPI=EPI.map(o=>({dur:6.2,subs:[[.3,6,null,o.sub]],draw(t){card(t,o)}})).concat([
  {dur:1,lines:[['s','Зай...'],['m','М?'],['s','И что будем делать дальше?'],['m','...'],['m','Одну каточку.'],['c','Мяу. (А корм?)']],draw(t){K.livingSide(t,true);sideMikrob(140,170,t,'stand');K.sideShmak(162,170,t,'stand');K.catSide(186,168,t,1.6,'stand',K.PAL_BLACK)}},
]);

// ================= КОНЕЦ ИГРЫ =================
function endGame(){C10.done=true;C10.on=true;
  playC10(CUT_FINAL,()=>playC10(CUT_EPI,()=>{setFlat10();mz10('end');S.fade=.01;C10.over=true},'epi'),'fin')}

// ================= КВАРТИРА =================
function setFlat10(){
  C1.on=false;C1.mode=null;C1.noWpn=false;C10.on=true;for(const o of [window.C2,window.C3,window.C4,window.C5,window.C6,window.C7,window.C8,window.C9])if(o){o.on=false;if('epi' in o)o.epi=false;if('ready' in o)o.ready=false}if(window.C4)C4.cat=false;
  scene='flat';cut=null;dlg=null;tr=null;S.fade=0;state='play';K.hud=null;K.on=null;
  S.step=12;S.alarm=false;S.skladLocked=false;S.bat=S.pistol=false;S.bowls=true;mapDirty=true;lastRoom=null;camY=0;
  pl.scoot=false;pl.sit=false;lockMove=true;shmak.mode='sit';shmak.x=136;shmak.y=40;shmak.a=-Math.PI/2;shmak.hug=0;shmak.path=[];cat.path=[];cat.then=null;
  cat.x=CAT_HOME.x;cat.y=CAT_HOME.y;cat.mode='sleep';
}
function kit10(){Object.assign(C1.seenT||(C1.seenT={}),{crawler:1,screamer:1,brute:1,shield:1,thrower:1,fast:1});
  Object.assign(PS,{hp:130,max:130,lives:3,inv:0,syr:Math.max(PS.syr||0,3),regen:0,carry:false,slow:0});
  try{if(window.UP&&UP.kit)UP.kit(10)}catch(e){}}
function startCh10(){
  C10.started=true;C10.done=false;C10.flags={};C10.qhp=0;setFlat10();mz10('call');pl.x=176;pl.y=74;pl.a=0;pl.ma=0;
  after(1,()=>say([['s','Зай. Шесть утра. Пора.'],['m','Я не спал.'],['c','Мяу. (Я спал. За троих.)'],['H','(рация) Мосты разведены. Land Rover заправлен. Дальше — сами, бойцы.'],
    ['m','Шмакодявка, собираемся по очереди. Сначала я.'],['s','Только быстро. И возьми что-нибудь большое.']],()=>{
    C10.ready=true;lockMove=false;if(window.UP&&UP.prep){UP.prep('собрать Шмакодявку',prepShmak);note('Сборы Микроба: оружейная на складе. Потом — к двери, соберём Шмакодявку')}else launch10()}));
}
function prepShmak(){C10.loM=Object.assign({},PS.lo||{});lockMove=true;
  say([['s','Моя очередь! Зай, отвернись, я выбираю.'],['m','Только не всё розовое.'],['s','Всё розовое. И не спорь.']],()=>{lockMove=false;if(window.UP&&UP.open){C10.waitS=1;UP.open('wpn','armory');note('Сборы ШМАКОДЯВКИ: выбери её оружие')}else{C10.loS=defLoS();launch10()}})}
function launch10(){C10.ready=false;lockMove=true;C10.kills0=PS.kills;PS.lives=3;PS.hp=PS.max;X.go(()=>playC10(CUT_GO,startDrive,'go'))}
const _u10=update;update=function(dt){_u10(dt);if(C10.waitS&&!(window.UP&&UP.ui)){C10.waitS=0;C10.loS=Object.assign({},PS.lo||{});PS.lo=Object.assign({},C10.loM||PS.lo);
  sfx('pick');say([['s','Готова. Розовые — мои.'],['m','Выезжаем.']],()=>launch10())}};

// ================= МЕНЮ ГЛАВЫ 10 =================
const MENU10=[['Глава 10 с начала (сборы на двоих)','call10'],['Land Rover по набережной','drive10'],['Микроб: Троицкая площадь','emb'],['Шмакодявка: крепость','fort'],['Микроб: лаборатория','lab'],
  ['Босс: Зомби-Анис','anis'],['Черсик: вентиляция','vent'],['Королева: Черсик','q1'],['Королева: Шмакодявка','q2'],['Королева: Микроб','q3'],['Финал и эпилог','end10']];
function menuKit10(k){kit10();C1.done=true;for(const o of [window.C2,window.C3,window.C4,window.C5,window.C6,window.C7,window.C8,window.C9])if(o){o.done=true;o.started=true;o.on=false}
  C10.started=true;C10.done=false;C10.kills0=PS.kills;C10.loM=Object.assign({},PS.lo||{});C10.loS=defLoS();C10.qhp=0;
  for(const [k,v] of [['ammo',120],['shells',36],['r762',150],['r556',150],['p50',30],['awp',20],['cells',6]])if((PS[k]||0)<v)PS[k]=v;
  S.bat=S.pistol=false;S.skladLocked=false;S.alarm=false;S.key=true;mapDirty=true}
const cfg10={ch:C10,num:10,title:'СЕВЕРНАЯ СТОЛИЦА',col:'rgba(255,106,200,A)',btn:{x:4,get y(){return (window.C7&&C7.menu)||(window.C8&&C8.menu)||(window.C9&&C9.menu)?-99:H-94},w:70,h:12},menu:MENU10,alias:{ch10:'call10'},
  start(k){menuKit10(k);if(k==='call10'){startCh10();return}if(k==='drive10'){X.go(()=>startDrive());return}if(k==='end10'){endGame();return}sec10(k)},
  canContinue:()=>!!(window.C9&&C9.done&&!C10.started),
  cont(){C10.menu=null;state='play';S.fade=0;sfx('click');kit10();startCh10()},
  endScreen(){
    if(window.C9&&C9.done&&!C10.started){K.endPanel({big:'ГЛАВА 9 ПРОЙДЕНА',sub:'Мой дом — моя крепость',col:'#ffa040',faces:['m','s','c','e','val','ol','vd','st','vel','sat','H'],
      l1:'Убито за ночь: '+Math.max(0,PS.kills-(C9.kills0||0)),l2:'Двор выстоял. Крысу-свистуна сняла охотница Катя.',l3:'Награда: M4A1 от Михалыча'});cfg10.contBtn(150);return true}
    if(!C10.done)return false;
    K.endPanel({big:'ИГРА ПРОЙДЕНА',sub:'Hotline Saint-P',col:'#ff6ac8',faces:['m','s','c','w','e','H','G','val','ol','vd','st','vel','sat','a'],
      l1:'Убито за всю игру: '+PS.kills+'   ·   в финале: '+Math.max(0,PS.kills-C10.kills0),l2:'Заразу победили. Шпиль на месте. Город — наш.',l3:'Идея, уровни и музыка — Наталья. Спасибо, что играли!'});
    u.textAlign='center';uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText(touch.on?'Коснись, чтобы сыграть заново':'R или клик — сыграть заново',W/2,166);u.textAlign='left';return true}};
K.chapter(cfg10);C10.cfg=cfg10;C10.MENU=MENU10;
C10.start=startCh10;C10.sec10=sec10;C10.CUTS={CUT_GO,CUT_JUMP,CUT_DOWN,CUT_ARENA,CUT_ANIS,CUT_QUEEN,CUT_FINAL,CUT_EPI};C10.endGame=endGame;
C10.get=()=>({L:E.L,Q,PS,scene,state,cut,dlg,mode:C1.mode,cur:C10.cur});
if(window.HDS){sideAnis=HDS.wrap(sideAnis)}
})();
