// =====================================================================
//  ГЛАВА 9 — «Осада двора» (замысел Натальи 03.11).
//  Орда идёт строем — её кто-то ведёт. Играем по очереди за каждого:
//  задний двор — Микроб (держать забор), Шмакодявка (прикрыть отход);
//  наш двор — Черсик (люки с крысами), Мыш (тыл у подъездов), Егор (колонка),
//  Валера (коллектор), Олеся (раненые), Владос (прожекторы), Столыпин (пиво),
//  Великий (объявление ТСЖ), Сатурналия (точки A и B);
//  финал — Ханжа с пулемётом Гатлинга. Орду ведёт крыса со свистком; на рассвете
//  её снимает охотница Катя, давняя подруга Шмакодявки. Следом — глава 10.
//  Подключается после level8.js. Наружу: window.C9.
// =====================================================================
(function(){
'use strict';
if(!window.K56||!window.HQ||!window.C8){console.warn('level9: нет kit56/hq/C8');return}
const K=K56,X=C1.X,E=C1.engine,PS=C1.PS,TAU=Math.PI*2,D2=K.D2,angDiff=K.angDiff,Q=K.Q,B=K.B||((x,y,w,h,c)=>X.B(x,y,w,h,c)),sfx=X.sfx,T=HQ.top,A8=C8.art||{};
const C9={on:false,done:false,started:false,sec:null,menu:null,kills0:0,flags:{},ready:false,epi:false,hk:{}};window.C9=C9;
const hold=K.hold,r4=n=>(Math.random()*n)|0;

// ================= МУЗЫКА =================
K.addMusic([['neuro','neuro.mp3'],['rampage','rampage.mp3'],['tek2','tek2.mp3'],['booyaka','booyaka.mp3'],['rapelectro','rapelectro.mp3'],['pisyat','pisyat.mp3'],['tommy','tommy.mp3'],
  ['trancer','trancer.mp3'],['kupala','kupala.mp3'],['misunderstanding','misunderstanding.mp3'],['kalinka','kalinka.mp3'],['smoke','smoke.mp3'],['histplace','histplace.mp3'],['zombie','zombie.mp3'],['flat','flat.mp3']]);
const MZ9={call:'flat',alarm:'zombie',back1:'neuro',back2:'rampage',y_c:'tek2',y_w:'motiv',y_e:'rapelectro',y_val:'neuro',y_ol:'tommy',y_vd:'trancer',y_st:'kupala',y_vel:'misunderstanding',y_sat:'rave_station',y_hz:'kalinka',cut:'smoke',dawn:'histplace',hq:'flat'};
const mz9=k=>K.music(MZ9[k]);

// ================= ВРАГИ =================
const ZA=t=>ZT_has(t)?t:'armor';
function ZT_has(t){return !!(X.ZT&&X.ZT[t])}
function addZ(type,x,y,o){return E.addZ(type,x,y,Object.assign({st:'chase'},o||{}))}
const RAT={mouse:()=>({v:200+r4(4)}),rat:()=>({v:210+r4(4)}),big:()=>({v:220+r4(2),hp:90,max:90})};
function rat(k,x,y,o){return addZ(k==='mouse'?'fast':'normal',x,y,Object.assign(RAT[k](),{rat9:1,noConv:1},o||{}))}

// ================= ДВОР: карта =================
const GATE={x:206,y:262};
const FENCE_IN=[[30,238],[70,238],[110,238],[136,238],[240,238],[280,238],[320,238],[345,238]];
const STREET=[[20,285],[90,288],[206,292],[300,288],[345,285]];
function spawnYard(type,where,o){
  let p;
  if(where==='fence'){const f=FENCE_IN[r4(FENCE_IN.length)];p=[f[0]+rnd(-6,6),f[1]];o=Object.assign({jump:.5},o||{})}
  else if(where==='gate')p=[GATE.x+rnd(-5,5),GATE.y+rnd(0,20)];
  else{const s=STREET[r4(STREET.length)];p=[s[0]+rnd(-8,8),s[1]+rnd(-4,4)]}
  const f=E.freeSpot(p[0],p[1],4,30)||p;return addZ(type,f[0],f[1],o)}
function lvYard(id,dark){
  const L=E.mkLevel(id,YW,YH);
  L.bx.drawImage(yardCv,0,0);
  E.gfill(0,0,YW,YH,0);for(const s of ysolids)E.gfill(s.x,s.y,s.x+s.w,s.y+s.h,1);
  E.gfill(0,0,2,YH,1);E.gfill(YW-2,0,YW,YH,1);E.gfill(0,YH-2,YW,YH,1);
  // калитка снесена, мешки с песком вдоль забора
  for(let x=0;x<YW;x+=6){if(x>=146&&x<218)continue;B(x,246,6,4,(x/6)%2?'#8a7a5a':'#9a8a64');B(x,246,6,1,'#b0a078')}
  B(198,252,16,6,'#2a2420');for(const [x,y] of [[196,262],[212,268],[220,258]]){B(x,y,6,2,'#5a4a32');B(x+1,y-1,4,1,'#7a6a4a')}
  // укрытия: баррикады во дворе
  for(const [x,y,w,h] of [[40,212,26,6],[96,224,6,16],[268,212,26,6],[300,170,6,22],[60,150,6,22]]){X.lowBox(x,y,w,h,'#5a4a32','#8a7a54')}
  // бочки с огнём
  for(const [x,y] of [[96,232],[300,128],[30,110]]){B(x-4,y-4,8,8,'#3a3030');B(x-3,y-3,6,6,'#1a1010');E.gfill(x-4,y-4,x+4,y+4,2);L.lights.push([x,y,60,.9]);L.glow.push([x,y,46,'rgba(255,120,40,A)',.35,9])}
  L.lights.push([100,122,46,.8],[260,122,46,.8],[100,222,46,.8],[260,222,46,.8]);for(const c of ENTR)L.lights.push([c,92,22,.7]);
  L.dark=dark==null?.55:dark;L.tint='14,4,10';L.arrows=true;
  X.buildNav();
  pl.x=180;pl.y=120;pl.a=Math.PI/2;pl.ma=pl.a;pl.scoot=false;pl.sit=false;
  return L;
}
// персонажи, уже отбившие свою волну, стоят у подъездов
const IDLE={c:[150,112],w:[160,116],e:[60,112],val:[118,112],ol:[200,112],vd:[262,112],st:[290,116],vel:[318,112],sat:[334,116],m:[96,116],s:[226,112],hz:[244,112]};
function drawIdle(L,cur){const done=C9.hk;for(const k in IDLE){if(k===cur||!(done[k]||k==='m'||k==='s'))continue;const H=HERO[k];if(!H)continue;const [x,y]=IDLE[k];shadowBlob(x,y,5);
  legs(lgIdle.getContext('2d'),0,false,H.leg,H.shoe);spr(lgIdle,x,y,Math.PI/2);H.top(cvIdle.getContext('2d'),0,0);spr(cvIdle,x,y,Math.PI/2+Math.sin(tm+x)*.15)}}
const cvIdle=mk(24),lgIdle=mk(24),cvHero=mk(24);cvIdle.getContext('2d',{willReadFrequently:true});lgIdle.getContext('2d',{willReadFrequently:true});cvHero.getContext('2d',{willReadFrequently:true});

// ================= ГЕРОИ =================
// top(g,sw,fl) — спрайт сверху 24×24 (смотрит вправо); atk — удар/выстрел; hp — здоровье
function catBuff(g,sw,side){g.clearRect(0,0,24,24);const Bc='#141219',HL='#34303e',EY='#d4ea4f',CL='#e8ecf4';const s=pl.mv?Math.sin(pl.ph):0,o=Math.round(s*2);
  for(let i=0;i<5;i++)P(g,4-i,12+Math.round(Math.sin(tm*4+i*.8)*1.5),1,2,Bc);P(g,5-o,6,3,2,Bc);P(g,5+o,16,3,2,Bc);
  const fx1=14+o+(sw>0&&side>0?3:0),fx2=14-o+(sw>0&&side<0?3:0);P(g,fx1,4,4,3,Bc);P(g,fx2,17,4,3,Bc);
  ell(g,8.5,12,5,3.6,Bc);ell(g,13.5,12,4.4,6.2,Bc);P(g,5,12,7,1,HL);P(g,11,8,5,1,HL);P(g,11,16,5,1,HL);
  ell(g,18.5,12,3.4,3.4,Bc);P(g,17,7,2,2,Bc);P(g,17,15,2,2,Bc);P(g,21,10,1,1,EY);P(g,21,14,1,1,EY);
  const k=sw>0?2:0;for(let i=0;i<3;i++){P(g,fx1+4,4+i,3+(side>0?k:0),1,CL);P(g,fx2+4,17+i,3+(side<0?k:0),1,CL)}outline(g,'#4a4458')}
function myshBuff(g,sw){T.topCat(g,T.PAL_MYSH,pl.ph,pl.mv,true);if(sw>0){P(g,20,10,3,1,'#fff');P(g,20,13,3,1,'#fff');P(g,21,11,2,2,'#7a1a1a')}}
function soldierTop(g,o){X.drawSoldier(g,tm,o)}
const HERO={
  m:{n:'МИКРОБ',leg:'#1c1c22',shoe:'#9a9ca2',top:(g)=>drawMikrob(g,'pistol')},
  s:{n:'ШМАКОДЯВКА',leg:'#f2cab2',shoe:'#0e0e12',top:(g)=>{if(window.SHMAK_DRAW)SHMAK_DRAW(g,'pistol',false)}},
  c:{n:'ЧЕРСИК',p:'C',leg:'rgba(0,0,0,0)',shoe:'rgba(0,0,0,0)',hp:240,spd:1.35,top:(g,sw,fl,side)=>catBuff(g,sw,side||1),
    atk:{kind:'claw',name:'КОГТИ',cd:.19,big:.42,dmg:55,bigDmg:95,reach:20,arc:1.2,kb:130,snd:'swing'},heal:'Корм'},
  w:{n:'МЫШ',p:'w',leg:'rgba(0,0,0,0)',shoe:'rgba(0,0,0,0)',hp:200,spd:1.45,top:(g,sw)=>myshBuff(g,sw),
    atk:{kind:'bite',name:'КЛЫКИ · каждый 3-й укус — прыжок',cd:.3,dmg:70,reach:17,arc:1,kb:90,snd:'bat'},heal:'Корм'},
  e:{n:'ЕГОР',p:'e',leg:'#18181e',shoe:'#0e0e12',hp:150,spd:1,top:(g,sw,fl)=>{T.topEgor(g);if(fl>0){P(g,17,10,3,1,'#ff5aff');P(g,17,13,3,1,'#ff5aff')}},
    atk:{kind:'beam',name:'ЛАЗЕР ИЗ ОЧКОВ',cd:.32,dmg:30,rng:170,pierce:3,col:'255,90,220',snd:'zap'},heal:'Шприц'},
  val:{n:'ВАЛЕРА',p:'val',leg:'#2a2a30',shoe:'#e8e8ec',hp:160,spd:1.05,top:(g,sw)=>T.topValera(g,true,sw),
    atk:{kind:'pipe',name:'ТРУБА · 3-й удар — «Прочистка»',cd:.42,dmg:46,reach:18,arc:1.2,kb:140,snd:'swing'},heal:'Шприц'},
  ol:{n:'ОЛЕСЯ',p:'ol',leg:'#f4cdb0',shoe:'#e8e0d0',hp:130,spd:1.15,top:(g,sw)=>{T.topOlesya(g);if(sw>0){P(g,16,15,5,4,'#c8203a');P(g,16,15,5,1,'#ff5a7a')}},
    atk:{kind:'bag',name:'СУМОЧКА',cd:.38,dmg:24,reach:17,arc:1.3,kb:240,snd:'bat'},heal:'Шприц'},
  vd:{n:'ВЛАДОС',p:'vd',leg:'#1e2638','shoe':'#0a0a0e',hp:150,spd:1.05,top:(g,sw,fl)=>{T.topVlados(g,0);P(g,16,15,5,2,'#2a2a30');P(g,20,15,1,2,fl>0?'#8ad8ff':'#3a5a7a')},
    atk:{kind:'zap',name:'ШОКЕР · цепная молния',cd:.55,dmg:40,rng:60,chain:3,snd:'zap'},heal:'Шприц'},
  st:{n:'СТОЛЫПИН',p:'st',leg:'#2a3a5a',shoe:'#2a2a2a',hp:190,spd:.92,top:(g)=>T.topStolypin(g,0,true),
    atk:{kind:'burp',name:'ОТРЫЖКА · пиво [H] — мощнее',cd:1.0,dmg:48,rng:40,arc:.75,kb:150,snd:'burp'},heal:'Пиво'},
  vel:{n:'ВЕЛИКИЙ',p:'vel',leg:'#1e2030',shoe:'#141418',hp:150,spd:1,top:(g,sw,fl)=>A8.topVel?A8.topVel(g,'mag',fl):drawMikrob(g,'pistol'),
    atk:{kind:'shot',name:'МАГНУМ',cd:1.0,dmg:120,rng:190,pierce:2,kb:150,col:'255,255,255',snd:'rifle'},heal:'Шприц'},
  sat:{n:'САТУРНАЛИЯ',p:'sat',leg:'#1a1a22',shoe:'#0e0e12',hp:140,spd:1.1,top:(g,sw,fl)=>A8.topSat?A8.topSat(g,fl):drawShmak(g,0),
    atk:{kind:'shot',name:'ДВЕ БЕРЕТТЫ',cd:.17,dmg:17,rng:160,pierce:0,kb:30,col:'255,220,120',snd:'shot',dual:1},heal:'Шприц'},
  hz:{n:'ХАНЖА',p:'H',leg:'#3a4628',shoe:'#1a1a1a',hp:460,spd:.62,top:(g,sw,fl)=>{soldierTop(g,{body:'#4a5a32',head:'#2e3a22',hair:'#8a6748',sk:'#efc5a5',gun:false});
      P(g,13,10,10,4,'#2a2a30');P(g,13,10,10,1,'#4a4a52');for(let i=0;i<3;i++)P(g,22,10+i+((C9.gatA*3|0)%2),2,1,'#1a1a1e');if(fl>0)P(g,23,10,2,4,'#fff6c0')},
    atk:{kind:'gat',name:'ПУЛЕМЁТ ГАТЛИНГА',dmg:30,rng:200,snd:'rifle'},heal:'Чай из термоса'},
};
C9.HERO=HERO;C9.gatA=0;
const HEROS={draw(g,w,carry){const H=HERO[C9.cur];if(H&&H.top)H.top(g,C9.sw,C9.fl,C9.side);else drawMikrob(g,w)},get leg(){const H=HERO[C9.cur];return H?H.leg:'#1c1c22'},get shoe(){const H=HERO[C9.cur];return H?H.shoe:'#9a9ca2'}};

// ---------- атака героя ----------
const HS={cd:0,combo:0,comboT:0,sw:0,fl:0,side:1,heat:0,over:0,spin:0,boost:0};
function tracer(x0,y0,x1,y1,c){(Q.tr||(Q.tr=[])).push({x0,y0,x1,y1,t:.08,c:c||'255,230,140'})}
function hit(z,dmg,a,kb){if(z.dead)return;const boss=z.type==='boss';X.hurtZ(z,boss?dmg*.6:dmg,a,boss?0:kb)}
function rayHit(x,y,a,rng,dmg,pierce,kb,col){const ca=Math.cos(a),sa=Math.sin(a);const L=E.L;
  const hits=[];for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const dx=z.x-x,dy=z.y-y,t=dx*ca+dy*sa;if(t<0||t>rng)continue;const pd=Math.abs(-dx*sa+dy*ca);if(pd>z.r+2.5)continue;hits.push([t,z])}
  hits.sort((p,q)=>p[0]-q[0]);let end=rng;
  // стена
  for(let t=4;t<rng;t+=3){if(!E.los(x,y,x+ca*t,y+sa*t)){end=t;break}}
  let n=0;for(const [t,z] of hits){if(t>end)break;hit(z,dmg,a,kb);n++;if(n>pierce){end=t;break}}
  tracer(x+ca*8,y+sa*8,x+ca*end,y+sa*end,col);return n}
function meleeArc(reach,arc,dmg,kb){let n=0;const a=pl.a;for(const z of E.L.zs){if(z.dead||z.st==='hidden')continue;const d=D2(pl.x,pl.y,z.x,z.y);if(d>z.r+reach)continue;
  const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(d>z.r+4&&Math.abs(angDiff(za,a))>arc)continue;hit(z,dmg,za,kb);n++}return n}
function slash(r,c){(Q.sl||(Q.sl=[])).push({x:pl.x,y:pl.y,a:pl.a,t:.14,r:r||14,c:c||'#ffffff',side:HS.side})}
function attack(){
  const H=HERO[C9.cur],k=H&&H.atk;if(!k)return;
  const boost=HS.boost>0?1.5:1;
  if(k.kind==='claw'||k.kind==='bite'||k.kind==='pipe'||k.kind==='bag'){
    HS.combo=HS.comboT>0?(HS.combo+1)%3:0;HS.comboT=.7;const big=HS.combo===2;HS.side=HS.combo===1?-1:1;HS.sw=.14;
    HS.cd=big&&k.big?k.big:k.cd;sfx(k.snd,1.2);
    if(k.kind==='pipe'&&big){HS.spin=.45;sfx('clang',.7);X.floatT(pl.x,pl.y-14,'ПРОЧИСТКА!','#6ad8ff');const n=meleeArc(36,Math.PI,k.dmg*1.8,200);
      for(let i=0;i<14;i++)E.L.fx.push({x:pl.x,y:pl.y,vx:Math.cos(i/14*TAU)*90,vy:Math.sin(i/14*TAU)*90,life:.3,c:'#bfe8ff'});if(n)C1.shake=.35;return}
    if(k.kind==='bite'&&big){const tx=pl.x+Math.cos(pl.a)*30,ty=pl.y+Math.sin(pl.a)*30;for(let i=0;i<6;i++){const nx=pl.x+Math.cos(pl.a)*5,ny=pl.y+Math.sin(pl.a)*5;if(!E.solidAt(nx,ny,3.5)){pl.x=nx;pl.y=ny}}PS.inv=Math.max(PS.inv,.3)}
    const n=meleeArc(k.reach+(big?5:0),k.arc+(big?.3:0),(big?(k.bigDmg||k.dmg*1.6):k.dmg)*boost,(big?1.6:1)*k.kb);slash(big?16:13,k.kind==='bag'?'#ff7a9a':'#ffffff');
    if(n){sfx('hit');sfx('bat',.8);C1.shake=Math.max(C1.shake,big?.3:.12)}return}
  if(k.kind==='beam'){HS.cd=k.cd;HS.fl=.08;sfx('zap',.8);rayHit(pl.x,pl.y,pl.a,k.rng,k.dmg,k.pierce,40,k.col);return}
  if(k.kind==='shot'){HS.cd=k.cd*(rnd(.95,1.05));HS.fl=.07;HS.lr=(HS.lr||0)^1;sfx(k.snd,k.dual?.4:.7);const off=k.dual?(HS.lr?3:-3):0,pa=pl.a+Math.PI/2;
    rayHit(pl.x+Math.cos(pa)*off,pl.y+Math.sin(pa)*off,pl.a+rnd(-.03,.03),k.rng,k.dmg,k.pierce,k.kb,k.col);if(!k.dual)C1.shake=Math.max(C1.shake,.25);return}
  if(k.kind==='zap'){HS.cd=k.cd;HS.fl=.1;sfx('zap',1);let src={x:pl.x,y:pl.y},used=new Set(),n=0;
    for(let i=0;i<k.chain;i++){let best=null,bd=i?k.rng*.8:k.rng;for(const z of E.L.zs){if(z.dead||z.st==='hidden'||used.has(z))continue;const d=D2(src.x,src.y,z.x,z.y);
        if(i===0&&Math.abs(angDiff(Math.atan2(z.y-pl.y,z.x-pl.x),pl.a))>.9)continue;if(d<bd&&E.los(src.x,src.y,z.x,z.y)){bd=d;best=z}}
      if(!best)break;used.add(best);const m=8;for(let j=0;j<=m;j++){const t=j/m;E.L.fx.push({x:src.x+(best.x-src.x)*t+rnd(-3,3),y:src.y+(best.y-src.y)*t+rnd(-3,3),vx:0,vy:0,life:.18,c:j%2?'#8ad8ff':'#ffffff'})}
      hit(best,k.dmg*(i?.75:1)*boost,Math.atan2(best.y-src.y,best.x-src.x),30);if(!best.dead)best.stun=Math.max(best.stun||0,1.1);src=best;n++}
    if(!n)X.floatT(pl.x+Math.cos(pl.a)*16,pl.y+Math.sin(pl.a)*16,'БЗЗТ','#8ad8ff');return}
  if(k.kind==='burp'){HS.cd=k.cd;sfx('burp',1);X.floatT(pl.x,pl.y-14,'БУ-У-ЭЭЭ!','#a8e040');
    for(let i=0;i<18;i++){const aa=pl.a+rnd(-.6,.6),sp=rnd(30,80);E.L.fx.push({x:pl.x+Math.cos(pl.a)*6,y:pl.y+Math.sin(pl.a)*6,vx:Math.cos(aa)*sp,vy:Math.sin(aa)*sp,life:rnd(.4,.8),c:i%2?'rgba(168,224,64,.7)':'rgba(220,200,80,.6)'})}
    const R=k.rng*(HS.boost>0?1.4:1);for(const z of E.L.zs.slice()){if(z.dead||z.st==='hidden')continue;const d=D2(pl.x,pl.y,z.x,z.y);if(d>z.r+R)continue;if(Math.abs(angDiff(Math.atan2(z.y-pl.y,z.x-pl.x),pl.a))>k.arc)continue;
      hit(z,k.dmg*boost,Math.atan2(z.y-pl.y,z.x-pl.x),k.kb*boost);if(!z.dead)z.stun=Math.max(z.stun||0,.7)}C1.shake=.25;return}
}
// Гатлинг: держишь — раскручивается, греется
function gatTick(dt,firing){
  if(HS.over>0){HS.over-=dt;HS.heat=Math.max(0,HS.heat-dt*.5);C9.gatSpin=Math.max(0,(C9.gatSpin||0)-dt*2);if(HS.over<=0)note('Ствол остыл — жги!');return}
  if(firing){C9.gatSpin=Math.min(1,(C9.gatSpin||0)+dt*1.6)}else{C9.gatSpin=Math.max(0,(C9.gatSpin||0)-dt*1.5);HS.heat=Math.max(0,HS.heat-dt*.32)}
  C9.gatA+=dt*C9.gatSpin*20;
  if(firing&&C9.gatSpin>.25){HS.cd-=dt;const rate=.2-C9.gatSpin*.16;while(HS.cd<=0){HS.cd+=rate;HS.fl=.05;HS.heat+=rate*.22;sfx('shot',.16);
      const a=pl.a+rnd(-.1,.1);rayHit(pl.x+Math.cos(pl.a+.5)*4,pl.y+Math.sin(pl.a+.5)*4,a,HERO.hz.atk.rng,HERO.hz.atk.dmg,2,45,'255,210,90');C1.shake=Math.max(C1.shake,.12);
      if(Math.random()<.5)E.L.fx.push({x:pl.x,y:pl.y,vx:Math.cos(pl.a+1.6)*40+rnd(-10,10),vy:Math.sin(pl.a+1.6)*40+rnd(-10,10),life:.3,c:'#e8c050'})}
    if(HS.heat>=1){HS.heat=1;HS.over=2.2;sfx('thump',.8);note('ПЕРЕГРЕВ! Ханжа: «Отставить! Дай стволу остыть!»')}}
  else if(firing&&C9.gatSpin<=.25&&Math.random()<dt*6)sfx('click',.3);
}
function heroTick(dt){
  const H=HERO[C9.cur];if(!H||!H.atk)return;
  PS.wpn='h9';PS.cd=1;PS.carry=false;
  if(HS.cd>0&&H.atk.kind!=='gat')HS.cd-=dt;if(HS.sw>0)HS.sw-=dt;if(HS.fl>0)HS.fl-=dt;if(HS.comboT>0)HS.comboT-=dt;if(HS.boost>0)HS.boost-=dt;if(HS.spin>0)HS.spin-=dt;
  C9.sw=HS.sw;C9.fl=HS.fl;C9.side=HS.side;
  if(Q.sl){for(const s of Q.sl)s.t-=dt;Q.sl=Q.sl.filter(s=>s.t>0)}
  const free=!dlg&&!tr&&!lockMove&&E.L.armed;
  const btn=C1.fire!=null||C1.fireQ,firing=free&&((C1.mdown&&mouse.on&&!touch.on)||X.touchFiring()||btn);
  // скорость героя: добавка (кот быстрее) или замедление (Ханжа с пулемётом)
  if(free&&H.spd&&H.spd!==1){const [mx,my,ml]=X.inputMove();if(ml>.1){const sp=(H.spd-1)*58*dt*(H.spd<1?1.2:1),nx=pl.x+mx*sp,ny=pl.y+my*sp;if(!E.solidAt(nx,pl.y,3.5))pl.x=nx;if(!E.solidAt(pl.x,ny,3.5))pl.y=ny}}
  if(H.atk.kind==='gat'){gatTick(dt,firing);return}
  if(firing&&HS.cd<=0){if(btn&&!(touch.aim&&touch.aim.moved))assist(H.atk.reach?60:180);attack();C1.fireQ=false}
}
function assist(R){let best=null,bd=1e9;for(const z of E.L.zs){if(z.dead||z.st==='hidden')continue;const d=D2(pl.x,pl.y,z.x,z.y);if(d>R||d>=bd)continue;if(!E.los(pl.x,pl.y,z.x,z.y))continue;
  const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(Math.abs(angDiff(za,pl.a))>1.3)continue;best=za;bd=d}if(best!==null)pl.a=best}
// лечение: H — у каждого своё (движок тратит PS.syr и даёт регенерацию)
let lastSyr=0;
function healWatch(){const H=HERO[C9.cur];if(PS.syr<lastSyr&&H){if(C9.cur==='st'){HS.boost=10;note('*пш-ш-ш* Пиво! Отрыжка мощнее 10 секунд')}else if(H.heal&&H.heal!=='Шприц')note(H.heal+'! Силы возвращаются')}lastSyr=PS.syr}

// ---------- HUD героя ----------
function heroHud(){const H=HERO[C9.cur];if(!H)return;if(!H.atk){if(Q.bars){u.save();u.translate(0,58);Q.bars();u.restore()}return}
  panel(4,4,118,30,.74);u.fillStyle=NCOL[H.p]||'#ffd23a';u.fillRect(4,4,2,30);
  uiFont(4,true);u.fillStyle='#9a92b0';u.fillText('HP',9,10.5);X.hudBar(20,6.5,70,4,PS.hp/PS.max,PS.hp<PS.max*.3?'#ff3a3a':'#c6ef4a');
  if(PS.regen>0){u.fillStyle='rgba(120,255,160,.5)';u.fillRect(20+70*PS.hp/PS.max,6.5,Math.min(70*(1-PS.hp/PS.max),70*PS.regen/PS.max),4)}
  uiFont(4.4,true);u.fillStyle=NCOL[H.p]||'#ffd23a';u.fillText(H.n,94,10.5);
  uiFont(4.4,true);u.fillStyle='#ffd23a';u.fillText(H.atk.name,9,19);
  uiFont(4.2,false);u.fillStyle='#ffb0d8';u.fillText((H.heal||'Шприц')+': '+PS.syr+(touch.on?'':' [H]')+(HS.boost>0?'   · БУСТ '+Math.ceil(HS.boost):''),9,28);
  u.save();u.translate(0,58); // под радаром
  if(H.atk.kind==='gat'){const y=38;panel(4,y,118,14,.74);uiFont(4,true);u.fillStyle='#9a92b0';u.fillText('РАСКРУТКА',9,y+5.5);X.hudBar(46,y+2.5,72,3,C9.gatSpin||0,'#ffd23a');
    u.fillText(HS.over>0?'ПЕРЕГРЕВ!':'НАГРЕВ',9,y+11.5);X.hudBar(46,y+8.5,72,3,HS.heat,HS.over>0||HS.heat>.8?'#ff3a3a':'#ff9a3a')}
  if(Q.bars)Q.bars();u.restore()}

// ================= ОБЩИЙ ЗАПУСК УЧАСТКА =================
function sec9(n){
  K.sec(C9,n,()=>{
    C9.cur=SEC[n].hero;HS.cd=.3;HS.heat=0;HS.over=0;HS.boost=0;C9.gatSpin=0;
    SEC[n].build();
    const L=E.L,H=HERO[C9.cur];
    if(H&&H.atk){L.hero=HEROS;L.noHud=true;C1.noWpn=true;PS.max=Math.round(H.hp*1.3);PS.hp=PS.max;PS.wpn='h9';if(PS.syr<3)PS.syr=3;
      if(window.ARS&&ARS.SH)L.noShmak=true}
    else if(C9.cur==='s'){L.hero={draw(g,w,c){if(window.SHMAK_DRAW)SHMAK_DRAW(g,w,c)},leg:'#f2cab2',shoe:'#0e0e12'};L.noShmak=true}
    lastSyr=PS.syr;
    const lo=L.drawOver,lu=L.drawUnder;
    L.drawUnder=()=>{if(lu)lu();if(Q.under)Q.under()};
    L.drawOver=()=>{if(lo)lo();fx9();if(Q.over)Q.over()};
    mz9(n);
  },sec9);
  K.tick=dt=>{trTick(dt);healWatch();if(C9.cur==='hz'){if(HS.lastHp!=null&&PS.hp<HS.lastHp&&PS.hp>0)PS.hp+=(HS.lastHp-PS.hp)*.5;HS.lastHp=PS.hp}else HS.lastHp=null; // Ханжа в бронежилете: урон ×0.5
  if(HERO[C9.cur]&&HERO[C9.cur].atk)heroTick(dt);if(Q.tick&&!hold())Q.tick(dt)};
  K.hud=()=>{heroHud()};
}
C9.go=sec9;
const playC9=(shots,onEnd,k)=>K.cut(C9,shots,onEnd,MZ9[k]);
function trTick(dt){if(Q.tr){for(const t of Q.tr)t.t-=dt;Q.tr=Q.tr.filter(t=>t.t>0)}}
function fx9(){
  if(Q.tr)for(const t of Q.tr){ctx.strokeStyle=`rgba(${t.c},${t.t/.08})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(t.x0,t.y0);ctx.lineTo(t.x1,t.y1);ctx.stroke()}
  if(Q.sl)for(const s of Q.sl){const k=s.t/.14;ctx.save();ctx.globalAlpha=Math.min(1,k*1.6);ctx.strokeStyle=s.c;ctx.lineWidth=1;const sw=(1-k)*2.2-1.1;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(s.x,s.y,s.r+i*2.2,s.a-1.1*s.side,s.a+sw*s.side,s.side<0);ctx.stroke()}ctx.restore()}
  if(HS.spin>0&&C9.cur==='val'){ctx.strokeStyle='rgba(190,232,255,.7)';ctx.beginPath();ctx.arc(pl.x,pl.y,30*(1-HS.spin/.45)+6,0,TAU);ctx.stroke()}
  // крысы с оружием (гл.10 использует тот же рисунок)
  for(const z of E.L.zs){if(z.dead||!z.gun9)continue;ctx.save();ctx.translate(z.x,z.y);ctx.rotate(z.a);F(4,-1,9,2,'#1a1a1e');F(10,-1,3,1,'#3a3a40');if(z.gfl>0)F(13,-2,3,4,'#fff6c0');ctx.restore()}
}
// общий финал волны: остатки разбегаются, короткий разговор, дальше — следующий герой
function waveDone(lines,next){if(Q.fin)return;Q.fin=1;C9.hk[C9.cur]=1;sfx('ring',1);K.zoneBanner('ВОЛНА ОТБИТА','#3ef0b0');
  K.ghostAll('rgba(120,255,160,A)');E.L.armed=false;
  after(1.2,()=>say(lines,()=>{lockMove=true;X.go(()=>{lockMove=false;next()})}))}
function intro(t,col,lines,go){lockMove=true;E.L.armed=false;after(.5,()=>{K.zoneBanner(t,col);say(lines,()=>{lockMove=false;E.L.armed=true;if(go)go()})})}
// зомби, идущие к цели (а не к игроку), пока их не задели
function seekTarget(z,tg,dt,onReach){const d=D2(z.x,z.y,tg.x,tg.y);
  if(D2(z.x,z.y,pl.x,pl.y)<34||z.hp<z.max*.98){z.ai=null;z.stun=0;z.st='chase';return}
  z.stun=99;if(d>z.r+(tg.r||8)){const a=E.los(z.x,z.y,tg.x,tg.y)?Math.atan2(tg.y-z.y,tg.x-z.x):K.navDir(z);if(a!=null){K.mv(z,Math.cos(a)*z.sp*.8*dt,Math.sin(a)*z.sp*.8*dt,z.r);z.a=a;z.ph+=dt*z.sp*.3}}
  else{z.a=Math.atan2(tg.y-z.y,tg.x-z.x);z.bt=(z.bt||0)-dt;if(z.bt<=0){z.bt=.8;z.lunge=.18;onReach(z)}}}
// поток врагов: [время, тип, откуда, кол-во, опции]
function director(dt){const D=Q.dir;if(!D)return;D.t+=dt;while(D.i<D.list.length&&D.list[D.i][0]<=D.t){const [t,type,from,n,o]=D.list[D.i++];for(let i=0;i<n;i++){const z=(from==='hatch'?hatchSpawn(type,o):spawnYard(type,from,o));if(z&&Q.tag)Q.tag(z)}}}
function dirDone(){const D=Q.dir;return D&&D.i>=D.list.length}
const live=()=>K.alive();

// ================= ЗАДНИЙ ДВОР =================
const BW=520,BH=420;
function lvBack(id){
  const L=E.mkLevel(id,BW,BH);B(0,0,BW,BH,'#222');
  K.floor(4,4,BW-4,BH-4,'dirt');K.floor(140,4,380,120,'grass');K.floor(236,4,284,BH-4,'asph');
  E.gfill(4,4,236,10,1);E.gfill(284,4,BW-4,10,1);for(let x=4;x<BW-4;x+=3)if(x<236||x>=284)B(x,4,2,6,'#3a4a3a');K.txt(260,20,'КАЛИТКА','#c8e8a0',4);
  for(let i=0;i<5;i++){const y=60+i*62;B(14,y,70,50,'#6a6e76');B(14,y,70,3,'#8a8e96');B(84,y+8,4,34,'#3a3e46');E.gfill(14,y,88,y+50,1);K.txt(49,y+28,'ГАРАЖ '+(i+1),'#c8ccd4',4)}
  K.floor(380,150,BW-4,BH-4,'sand');K.txt(450,146,'СТРОЙКА','#e8d8a0',4);
  E.gfill(380,150,384,300,1);B(380,150,4,150,'#8a7a5a');E.gfill(380,340,384,BH-4,1);B(380,340,4,76,'#8a7a5a');
  for(const [x,y,w,h] of [[410,180,40,12],[460,240,30,30],[400,320,50,14],[470,360,30,20]])X.lowBox(x,y,w,h,'#9a8a6a','#b8a888');
  for(const x of [300,330])X.lowBox(x,60,24,16,'#3a5a3a','#5a7a5a');
  // баррикады Ханжи — укрытия
  for(const [x,y,w,h] of [[150,150,40,6],[300,150,40,6],[200,210,6,26],[316,210,6,26],[180,280,50,6],[290,280,50,6],[120,200,24,6]])X.lowBox(x,y,w,h,'#5a4a32','#8a7a54');
  X.carTop(300,200,'#4a4a52',true);X.carTop(110,330,'#8a6a2a',false);
  for(const [x,y] of [[170,40],[350,110],[130,380],[330,390]])K.tree(x,y,15);
  E.gfill(0,0,4,BH,1);E.gfill(BW-4,0,BW,BH,1);E.gfill(0,BH-4,BW,BH,1);E.gfill(0,0,BW,4,1);
  X.lampPost(220,140);X.lampPost(300,280);X.lampPost(160,320);
  L.dark=.5;L.tint='14,8,10';L.arrows=true;X.buildNav();
  return L}
const BSP=[[60,410],[200,410],[330,410],[460,410],[500,210],[500,120],[110,30],[420,30]];
function backSpawn(type,o,sel){const s=sel!=null?BSP[sel]:BSP[r4(5)];const f=E.freeSpot(s[0]+rnd(-12,12),s[1]+rnd(-6,6),4,30)||s;return addZ(type,f[0],f[1],o)}
const SEC={};
// ---- 1. Микроб: держать забор ----
SEC.back1={hero:'m',build(){
  const L=lvBack('back9a');pl.x=260;pl.y=120;pl.a=Math.PI/2;pl.ma=pl.a;
  Q.w=0;Q.wt=0;Q.left=0;
  const W=[[['normal',8],['fast',4]],[['normal',6],['thrower',3],[ZA('zpist'),3]],[['normal',8],['fast',6],['brute',1],[ZA('zshot'),2],[ZA('zak'),1]]];
  function wave(i){Q.w=i+1;K.zoneBanner('ВОЛНА '+(i+1)+' / 3','#ff6a6a');let k=0;for(const [t,n] of W[i])for(let j=0;j<n;j++)after(k++*.35,()=>backSpawn(t,{}))}
  L.obj=()=>Q.w===0?['Занять позицию у баррикад']:['Отбить волну '+Q.w+' / 3','Осталось: '+live()];
  Q.tick=dt=>{if(Q.fin||!L.armed)return;Q.wt-=dt;if(Q.w>0&&live()===0&&Q.wt<=0){if(Q.w>=3){waveDone([['m','Три волны! Шмакодявка, ты как?'],['s','Жива! Но смотри — за гаражами... их сотни.'],['H','(по рации) Микроб! Это не толпа, это армия! Отходите во двор, калитку держу!'],['m','Шмакодявка, прикрой меня — я к калитке, открою засов.']],()=>sec9('back2'));return}Q.wt=4;after(2.4,()=>wave(Q.w))}};
  intro('ЗАДНИЙ ДВОР · МИКРОБ','#ffd23a',[['H','(по рации) Боец, приём! Орда идёт с пустыря, прямо на задний двор.'],['m','Видим. Идут... строем? Зомби строем не ходят.'],['s','Значит, кто-то их ведёт. Зай, я с тобой.'],['H','Держите баррикады. Три волны — и отходим. Конец связи.']],()=>{wave(0);Q.wt=3});
}};
// ---- 2. Шмакодявка: прикрыть отход ----
SEC.back2={hero:'s',build(){
  const L=lvBack('back9b');pl.x=260;pl.y=240;pl.a=Math.PI/2;pl.ma=pl.a;
  const mik={x:260,y:22,a:-Math.PI/2,r:6};Q.mik=mik;Q.open=0;Q.st=0;Q.sp=1;Q.mhp=100;
  L.npcs.push({draw(){shadowBlob(mik.x,mik.y,6);legs(lgIdle.getContext('2d'),0,false,'#1c1c22','#9a9ca2');spr(lgIdle,mik.x,mik.y,mik.a);const g=cvIdle.getContext('2d');drawMikrob(g,null);
    const k=Math.sin(tm*12)*1.2;g.fillStyle='#c8c8c8';g.fillRect(18,10+k,3,4);spr(cvIdle,mik.x,mik.y,mik.a)}});
  for(let i=0;i<10;i++)backSpawn(['normal','fast','normal'][i%3],{},i%5);
  Q.tag=z=>{if(Math.random()<.35){z.ai='mik'}};
  L.obj=()=>Q.st===0?['Прикрыть Микроба у калитки: '+Math.floor(Q.open)+'%','Микроб: '+Math.max(0,Math.ceil(Q.mhp))+' / 100']:['Беги к калитке!'];
  Q.bars=()=>{if(Q.st)return;const y=38;panel(4,y,118,10,.74);uiFont(4,true);u.fillStyle='#9a92b0';u.fillText('ЗАСОВ',9,y+6.5);X.hudBar(40,y+3.5,78,4,Q.open/100,'#3ef0b0')};
  Q.tick=dt=>{if(Q.fin||!L.armed)return;
    for(const z of L.zs)if(!z.dead&&z.ai==='mik')seekTarget(z,mik,dt,zz=>{Q.mhp-=zz.type==='brute'?16:7;sfx('hit',.5);X.floatT(mik.x,mik.y-12,'МИКРОБ!','#ffb060')});
    if(Q.mhp<=0){Q.mhp=60;Q.open=Math.max(0,Q.open-20);X.loseLife();note('Микроба покусали — засов заклинило')}
    if(Q.st===0){Q.open+=dt*100/40;Q.sp-=dt;if(Q.sp<=0){Q.sp=rnd(1.2,2)-Q.open/100*.6;const c=2+r4(3);for(let i=0;i<c;i++){const z=backSpawn(Math.random()<.25?'fast':Math.random()<.1?ZA('zpist'):'normal',{});if(Math.random()<.4)z.ai='mik'}
        if(Q.open>55&&!Q.big){Q.big=1;const z=backSpawn('brute',{nm:'ГРОМИЛА С ПУСТЫРЯ',nmc:'#ffd23a'},1);z.ai='mik'}}
      if(Q.open>=100){Q.st=1;sfx('ring');say([['m','Открыл! Шмакодявка, бегом ко мне!'],['s','Бегу!!!']]);for(let i=0;i<8;i++)backSpawn('fast',{},i%5)}}
    else if(D2(pl.x,pl.y,mik.x,mik.y)<20){waveDone([['m','Закрываю! Засов!'],['s','Фух... Зай, они перелезают через забор!'],['H','Все во двор! Тревога! Подъём, штаб!']],()=>playC9(CUT_YARD,()=>sec9('y_c'),'cut'))}};
  intro('ЗАДНИЙ ДВОР · ШМАКОДЯВКА','#ff7ac8',[['m','Шмакодявка, держи их! Засов заржавел, мне нужно секунд сорок!'],['s','Сорок секунд? Зай, их тут сотня!'],['m','Значит, по одной на каждые полсекунды. Справишься.']]);
}};

// ================= НАШ ДВОР: волна каждого героя =================
// люки (для Черсика и Валеры)
function hatchSpawn(type,o){const hs=Q.hatch.filter(h=>!h.shut);if(!hs.length)return null;const h=hs[r4(hs.length)];h.n--;if(h.n<=0)h.shut=1;
  const k=type==='mouse'||type==='rat'||type==='big';return k?rat(type,h.x+rnd(-3,3),h.y+rnd(-3,3),o):addZ(type,h.x+rnd(-3,3),h.y+rnd(-3,3),o)}
function drawHatches(){for(const h of Q.hatch||[]){F(h.x-7,h.y-5,14,10,'#2a2a2e');F(h.x-6,h.y-4,12,8,h.shut?'#4a4a52':'#0a0a0c');for(let i=-5;i<6;i+=3)F(h.x+i,h.y-4,1,8,h.shut?'#5a5a62':'#1a1a1e');
  if(!h.shut&&Math.sin(tm*6+h.x)>.5){F(h.x-2,h.y-1,1,1,'#ff2020');F(h.x+1,h.y-1,1,1,'#ff2020')}}}

// ---- Черсик: «Люки» ----
SEC.y_c={hero:'c',build(){
  const L=lvYard('y9c');pl.x=180;pl.y=118;
  Q.hatch=[{x:60,y:196,n:16},{x:300,y:150,n:16},{x:262,y:244,n:16}];Q.under=drawHatches;
  Q.dir={t:0,i:0,list:[[1,'mouse','hatch',4],[4,'rat','hatch',4],[8,'mouse','hatch',5],[11,'normal','fence',3],[13,'rat','hatch',5],[17,'big','hatch',3],[20,'mouse','hatch',6],[24,'rat','hatch',6],[27,'normal','fence',4],[30,'big','hatch',3],[34,'mouse','hatch',6],[38,'rat','hatch',6]]};
  L.obj=()=>['Задушить крыс из люков','Люки открыты: '+Q.hatch.filter(h=>!h.shut).length+'   ·   осталось врагов: '+live()];
  Q.tick=dt=>{director(dt);if(!Q.fin&&L.armed&&dirDone()&&live()===0){Q.hatch.forEach(h=>h.shut=1);waveDone([['C','Последняя. Люки чистые.'],['H','Котяра! Отлично! Мыш — твоя очередь, у подъездов шуршат!'],['w','Мрр-ряу! (Иду!)']],()=>sec9('y_w'))}};
  intro('ЧЕРСИК · ЛЮКИ','#d4ff3a',[['s','Черсик, там последняя баночка корма тренера. Держи.'],['C','Хрум. ...Я снова в форме.'],['C','Крысы лезут из люков. Это ко мне.'],['H','Котяра, они из канализации! Дави!']]);
}};
// ---- Мыш: «Тыл» ----
SEC.y_w={hero:'w',build(){
  const L=lvYard('y9w');pl.x=180;pl.y=200;
  Q.doors=ENTR.map(x=>({x,y:104,hp:100,r:6}));
  Q.under=()=>{for(const d of Q.doors){if(d.hp<100){F(d.x-10,d.y+4,20,2,'#3a1010');F(d.x-10,d.y+4,20*d.hp/100,2,d.hp<35?'#ff3a3a':'#ffb060')}}};
  Q.tag=z=>{if(Math.random()<.65){z.ai='door';z.door=Q.doors[r4(Q.doors.length)]}};
  for(let i=0;i<6;i++)addZ('crawler',30+i*55,108+rnd(-2,4),{hid:'floor',wakeR:22,st:'idle'});
  Q.dir={t:0,i:0,list:[[1,'normal','fence',4],[3,'crawler','fence',3],[6,'fast','gate',4],[9,'normal','fence',5],[12,'crawler','gate',4],[15,'fast','fence',4],[19,'normal','gate',6],[23,'brute','gate',1],[26,'fast','fence',5],[30,'normal','fence',6]]};
  L.obj=()=>['Не пустить зомби к подъездам','Двери целы: '+Q.doors.filter(d=>d.hp>0).length+' / 5   ·   осталось: '+live()];
  Q.tick=dt=>{director(dt);for(const z of L.zs)if(!z.dead&&z.ai==='door')seekTarget(z,z.door,dt,zz=>{zz.door.hp-=zz.type==='brute'?20:8;sfx('hit',.4);if(!Q.warn){Q.warn=1;note('Зомби грызут дверь подъезда!')}});
    for(const d of Q.doors)if(d.hp<=0){d.hp=60;X.loseLife();note('Дверь подъезда выбита!')}
    if(!Q.fin&&L.armed&&dirDone()&&live()===0)waveDone([['w','Мрр. (Тыл чист.)'],['e','Мыш, красавчик! А теперь — музыка. Без музыки драка не та.'],['H','Егор! Ты что, колонку принёс?!'],['e','Я её никогда не уношу.']],()=>sec9('y_e'))};
  intro('МЫШ · ТЫЛ','#58b0ff',[['e','Мыш, мальчик мой, у подъездов ползуны. Порви их!'],['w','Мя-а-у. (Я сиамский. Я не мальчик, я легенда.)'],['H','Двери подъездов не отдавать! Там Михалычев склад!']]);
}};
// ---- Егор: «Колонка» ----
SEC.y_e={hero:'e',build(){
  const L=lvYard('y9e');pl.x=180;pl.y=208;
  const spk={x:180,y:222,r:8,hp:100};Q.spk=spk;Q.song=0;const DUR=55;
  Q.under=()=>{F(spk.x-6,spk.y-7,12,14,'#1a1a22');F(spk.x-5,spk.y-6,10,12,'#2a2a34');const k=1+Math.sin(tm*14)*.6;ctx.fillStyle='#0a0a0c';ctx.beginPath();ctx.arc(spk.x,spk.y-1,3+k*.4,0,TAU);ctx.fill();F(spk.x-4,spk.y+4,8,1,'#ff5aa8');
    if(Math.random()<.2)E.L.fx.push({x:spk.x+rnd(-4,4),y:spk.y-8,vx:rnd(-10,10),vy:-20,life:.8,c:['#ff5aa8','#3ef0b0','#ffd23a'][r4(3)]})};
  L.lights.push([spk.x,spk.y,60,.9]);
  Q.bars=()=>{const y=38;panel(4,y,118,17,.74);uiFont(4,true);u.fillStyle='#9a92b0';u.fillText('ТРЕК',9,y+6.5);X.hudBar(36,y+3.5,82,4,Q.song/DUR,'#ff5aa8');u.fillText('КОЛОНКА',9,y+13.5);X.hudBar(36,y+10.5,82,4,spk.hp/100,spk.hp<35?'#ff3a3a':'#3ef0b0')};
  Q.tag=z=>{if(Math.random()<.6)z.ai='spk'};
  L.obj=()=>Q.song<DUR?['Защитить колонку, пока играет трек']:['Добить: '+live()];
  Q.tick=dt=>{if(Q.fin||!L.armed)return;Q.song=Math.min(DUR,Q.song+dt);
    for(const z of L.zs)if(!z.dead&&z.ai==='spk')seekTarget(z,spk,dt,zz=>{spk.hp-=zz.type==='brute'?18:7;sfx('hit',.4)});
    if(spk.hp<=0){spk.hp=60;X.loseLife();note('Колонку разбили! Егор в шоке')}
    if(Q.song<DUR){Q.sp=(Q.sp||1)-dt;if(Q.sp<=0){Q.sp=rnd(1.4,2.2)-Q.song/DUR*.7;const c=2+r4(3);for(let i=0;i<c;i++){const z=spawnYard(Math.random()<.3?'fast':Math.random()<.1?ZA('zpist'):'normal',Math.random()<.5?'gate':'fence');Q.tag(z)}
      if(Q.song>30&&!Q.big){Q.big=1;const z=spawnYard('brute','gate',{nm:'ЛЮБИТЕЛЬ ТИШИНЫ',nmc:'#ffd23a'});z.ai='spk'}}}
    else if(live()===0)waveDone([['e','Трек доиграл! Аплодисменты мертвецам!'],['val','Егор, тише. Из коллектора у калитки что-то поднимается.'],['val','Это по моей части. Я инженер ВК. Трубы — моя жизнь.']],()=>sec9('y_val'))};
  intro('ЕГОР · КОЛОНКА','#ff5aa8',[['e','Включаю бас! Зомби идут на звук — значит, придут ко мне.'],['m','Егор, это худший план, который я слышал.'],['e','Это лучший план! Лазер из очков у меня на что?']]);
}};
// ---- Валера: «Коллектор» ----
SEC.y_val={hero:'val',build(){
  const L=lvYard('y9val');pl.x=206;pl.y=200;
  const man={x:206,y:236,r:6};Q.man=man;Q.hatch=[{x:man.x,y:man.y,n:999}];Q.under=()=>{drawHatches();if(Q.k>=Q.need&&!Q.shut){const a=.4+.4*Math.sin(tm*6);ctx.strokeStyle=`rgba(106,216,255,${a})`;ctx.strokeRect(man.x-9.5,man.y-7.5,19,15)}};
  Q.k=0;Q.need=24;Q.hold=0;Q.k0=PS.kills;Q.shut=0;
  Q.bars=()=>{const y=38;panel(4,y,118,10,.74);uiFont(4,true);u.fillStyle='#9a92b0';u.fillText(Q.k<Q.need?'НАПОР':'ЗАДРАИТЬ',9,y+6.5);X.hudBar(44,y+3.5,74,4,Q.k<Q.need?Q.k/Q.need:Q.hold/2.5,'#6ad8ff')};
  L.obj=()=>Q.shut?['Добить: '+live()]:Q.k<Q.need?['Сбить напор из коллектора: '+Q.k+' / '+Q.need]:['Встань на люк и держи E — задраить'];
  L.its=[{x:man.x,y:man.y,r:12,label:()=>'Задраить люк (держи)',cond:()=>Q.k>=Q.need&&!Q.shut,act:()=>{Q.hold+=.5;sfx('clang',.4)}}];
  Q.tick=dt=>{if(Q.fin||!L.armed)return;Q.k=Math.min(Q.need,PS.kills-Q.k0);
    if(!Q.shut){Q.sp=(Q.sp||.5)-dt;if(Q.sp<=0&&L.zs.filter(z=>!z.dead).length<16){Q.sp=rnd(.9,1.5);const c=1+r4(3);for(let i=0;i<c;i++)hatchSpawn(Math.random()<.25?'fast':'normal');if(Math.random()<.2)spawnYard(Math.random()<.5?ZA('zshot'):'thrower','fence')}
      if(Q.k>=Q.need&&D2(pl.x,pl.y,man.x,man.y)<12&&(keys.KeyE||C1.fire!=null)){Q.hold+=dt}else Q.hold=Math.max(0,Q.hold-dt*.5);
      if(Q.hold>=2.5){Q.shut=1;Q.hatch[0].shut=1;sfx('thump',1);C1.shake=.4;note('Люк задраен!')}}
    else if(live()===0)waveDone([['val','Задраил. Сантехника — это искусство.'],['ol','Валера! Сюда! Ира, Гоша и Саня ранены, их загрызут!'],['val','Олесь, это твой выход. Я к трубам.']],()=>sec9('y_ol'))};
  intro('ВАЛЕРА · КОЛЛЕКТОР','#6ad8ff',[['val','Канализацию прорвало. Мертвецами. Классика.'],['val','Сначала сбиваю напор, потом задраиваю люк. Вопросы?'],['s','Валера, ты в CS так же уверенно говоришь?'],['val','В CS я ещё увереннее.']]);
}};
// ---- Олеся: «Раненые» ----
SEC.y_ol={hero:'ol',build(){
  const L=lvYard('y9ol');pl.x=180;pl.y=208;
  const W3=[{n:'ИРА',x:46,y:186,hp:70},{n:'ГОША',x:316,y:216,hp:70},{n:'САНЯ',x:120,y:118,hp:70}];Q.wd=W3;Q.box={x:240,y:212};Q.carry=0;Q.t=0;const DUR=70;
  for(const w of W3){w.r=6;L.npcs.push({draw(){shadowBlob(w.x,w.y,5);X.drawSoldier(X.sprN.getContext('2d'),tm,{body:'#3a3a5a',head:'#2a2a3a',sk:'#e8c0a0',gun:false});spr(X.sprN,w.x,w.y,Math.PI/2+.4);
    F(w.x-8,w.y-11,16,2,'#3a1010');F(w.x-8,w.y-11,16*Math.max(0,w.hp)/100,2,w.hp<30?'#ff3a3a':'#3aff7a');uiTxt(w.n,w.x,w.y-13)}})}
  Q.over=()=>{const b=Q.box;F(b.x-6,b.y-4,12,8,'#e8e8ec');F(b.x-1,b.y-3,2,6,'#e83a3a');F(b.x-3,b.y-1,6,2,'#e83a3a');if(!Q.carry&&Math.sin(tm*5)>0){ctx.strokeStyle='rgba(255,255,255,.8)';ctx.strokeRect(b.x-7.5,b.y-5.5,15,11)}
    if(Q.carry){F(pl.x-3,pl.y-12,6,3,'#e8f0f0');F(pl.x-2,pl.y-11,4,1,'#3aff7a')}};
  L.its=[{x:Q.box.x,y:Q.box.y,r:16,label:()=>'Взять шприц из аптечки Михалыча',cond:()=>!Q.carry,act:()=>{Q.carry=1;sfx('pick');note('Шприц у тебя. Беги к раненому!')}}];
  for(const w of W3)L.its.push({get x(){return w.x},get y(){return w.y},r:16,label:()=>'Уколоть: '+w.n,cond:()=>Q.carry&&w.hp>0,act:()=>{Q.carry=0;w.hp=100;sfx('pick');X.floatT(w.x,w.y-14,'+100','#3aff7a')}});
  Q.tag=z=>{if(Math.random()<.45){z.ai='wd';z.tw=W3[r4(3)]}};
  Q.bars=()=>{const y=38;panel(4,y,118,10,.74);uiFont(4,true);u.fillStyle='#9a92b0';u.fillText('ДО ПОДМОГИ',9,y+6.5);X.hudBar(50,y+3.5,68,4,Q.t/DUR,'#ffb0d8')};
  L.obj=()=>Q.t<DUR?['Держать раненых живыми: '+Math.ceil(DUR-Q.t)+' с',Q.carry?'Отнеси шприц раненому':'Шприцы — в аптечке у будки Михалыча']:['Добить: '+live()];
  Q.tick=dt=>{if(Q.fin||!L.armed)return;Q.t=Math.min(DUR,Q.t+dt);
    for(const w of W3){w.hp-=dt*2.1;if(w.hp<=0){w.hp=50;X.loseLife();note(w.n+' — без сознания!')}}
    for(const z of L.zs)if(!z.dead&&z.ai==='wd')seekTarget(z,z.tw,dt,zz=>{zz.tw.hp-=8;sfx('hit',.4)});
    if(Q.t<DUR){Q.sp=(Q.sp||1)-dt;if(Q.sp<=0){Q.sp=rnd(1.6,2.6);const c=2+r4(2);for(let i=0;i<c;i++)Q.tag(spawnYard(Math.random()<.25?'fast':'normal',Math.random()<.6?'fence':'gate'))}}
    else if(live()===0)waveDone([['ol','Все живы. Я не врач, я вообще-то на дизайнера училась...'],['vd','Олеся, ты лучшая. А теперь — да будет свет!'],['st','Владос, прожекторы сгорели ещё в прошлую пятницу.'],['vd','Значит, включу шокером.']],()=>sec9('y_vd'))};
  intro('ОЛЕСЯ · РАНЕНЫЕ','#ffb0d8',[['ol','Ира, Гоша, Саня — держитесь! Я принесу шприцы.'],['G','(из будки) Аптечка у меня на окне. Бесплатно. Сегодня — бесплатно!'],['ol','У меня из оружия только сумочка. Но она тяжёлая.']]);
}};
function uiTxt(t,x,y){ctx.font='bold 4px monospace';ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillText(t,x+.5,y+.5);ctx.fillStyle='#fff';ctx.fillText(t,x,y);ctx.textAlign='left'}
// ---- Владос: «Свет» ----
SEC.y_vd={hero:'vd',build(){
  const L=lvYard('y9vd',.82);pl.x=180;pl.y=120;
  const SW=[{x:24,y:214,on:0,p:0},{x:340,y:150,on:0,p:0},{x:180,y:236,on:0,p:0}];Q.sw=SW;
  Q.under=()=>{for(const s of SW){F(s.x-4,s.y-6,8,12,'#2a2a30');F(s.x-3,s.y-5,6,10,s.on?'#fff6c0':'#4a4a52');if(!s.on&&Math.sin(tm*5)>0){ctx.strokeStyle='rgba(138,216,255,.8)';ctx.strokeRect(s.x-6.5,s.y-8.5,13,17)}
    if(s.p>0&&!s.on){F(s.x-8,s.y+8,16,2,'#1a1a1e');F(s.x-8,s.y+8,16*s.p/2,2,'#8ad8ff')}}};
  L.obj=()=>{const n=SW.filter(s=>s.on).length;return n<3?['Включить прожекторы: '+n+' / 3 (стой рядом и держи E)']:['Добить в свете: '+live()]};
  Q.tag=z=>{};
  Q.tick=dt=>{if(Q.fin||!L.armed)return;
    for(const s of SW){if(s.on)continue;if(D2(pl.x,pl.y,s.x,s.y)<14&&(keys.KeyE||C1.fire!=null&&D2(pl.x,pl.y,s.x,s.y)<10))s.p+=dt;else s.p=Math.max(0,s.p-dt*.4);
      if(s.p>=2){s.on=1;sfx('power',1);C1.shake=.3;L.lights.push([s.x,s.y,130,1]);L.dark=Math.max(.3,L.dark-.17);note('Прожектор горит!');for(let i=0;i<4;i++)spawnYard(Math.random()<.4?ZA('zpist'):'fast','fence')}}
    const n=SW.filter(s=>s.on).length;
    if(n<3){Q.sp=(Q.sp||1)-dt;if(Q.sp<=0){Q.sp=rnd(1.5,2.4);const c=2+r4(2);for(let i=0;i<c;i++)spawnYard(Math.random()<.3?'fast':'normal',Math.random()<.5?'fence':'gate')}}
    else if(live()===0)waveDone([['vd','Да будет свет. Сто тысяч вольт — и никакой грязи.'],['st','Э! А пиво?! Где мой ящик?! Они раскидали мой ящик по всему двору!'],['vd','Столыпин, серьёзно? Сейчас?'],['st','Особенно сейчас.']],()=>sec9('y_st'))};
  L.its=SW.map(s=>({x:s.x,y:s.y,r:14,label:()=>'Включить прожектор (держи)',cond:()=>!s.on,act:()=>{s.p+=.4;sfx('zap',.5)}}));
  for(let i=0;i<8;i++)spawnYard(i%2?'normal':'crawler','fence',{st:'idle'});
  intro('ВЛАДОС · СВЕТ','#8ad8ff',[['vd','Темно, как в багажнике моего X6. Прожекторы — на трёх столбах.'],['vd','Включаю вручную. Шокером. Не повторяйте.'],['H','Аккуратнее, мажор! В темноте их не видно!']]);
}};
// ---- Столыпин: «Пиво» ----
SEC.y_st={hero:'st',build(){
  const L=lvYard('y9st');pl.x=180;pl.y=118;
  const CR=[{x:30,y:236,st:0},{x:330,y:236,st:0},{x:300,y:140,st:0}];Q.cr=CR;Q.home={x:180,y:104};Q.carry=null;
  Q.under=()=>{for(const c of CR){if(c.st)continue;const x=c.x,y=c.y;F(x-6,y-4,12,8,'#8a5a1a');F(x-6,y-4,12,1,'#b07a2a');for(let i=0;i<4;i++)F(x-5+i*3,y-6,2,3,'#e8c040');if(Math.sin(tm*5+x)>0){ctx.strokeStyle='rgba(255,210,58,.8)';ctx.strokeRect(x-7.5,y-7.5,15,13)}}
    const h=Q.home;F(h.x-10,h.y+4,20,2,'#ffd23a');uiTxt('ПОДЪЕЗД',h.x,h.y+12)};
  Q.over=()=>{if(Q.carry){F(pl.x-6,pl.y-12,12,6,'#8a5a1a');for(let i=0;i<4;i++)F(pl.x-5+i*3,pl.y-14,2,3,'#e8c040')}};
  L.its=CR.map(c=>({x:c.x,y:c.y,r:14,label:()=>'Взять ящик пива',cond:()=>!c.st&&!Q.carry,act:()=>{c.st=1;Q.carry=c;sfx('thump',.6);note('Тяжёлый... Неси к подъезду. С ящиком отрыжка не работает!')}}));
  L.its.push({x:Q.home.x,y:Q.home.y,r:18,label:()=>'Поставить ящик у подъезда',cond:()=>!!Q.carry,act:()=>{Q.carry.st=2;Q.carry=null;sfx('ring',.6);PS.syr++;X.floatT(pl.x,pl.y-14,'+пиво','#ffd23a')}});
  for(const c of CR)for(let i=0;i<3;i++){const z=addZ(i?'normal':'thrower',c.x+rnd(-14,14),c.y+rnd(-14,14),{st:'idle'})}
  L.obj=()=>{const n=CR.filter(c=>c.st===2).length;return n<3?['Ящики пива у подъезда: '+n+' / 3',Q.carry?'Неси к нашему подъезду':'Ящики раскиданы по двору']:['Добить: '+live()]};
  Q.tick=dt=>{if(Q.fin||!L.armed)return;if(Q.carry){HS.cd=Math.max(HS.cd,.2);C1.spdMul=(C1.spdMul||1)*.8}
    const n=CR.filter(c=>c.st===2).length;
    if(n<3){Q.sp=(Q.sp||1.5)-dt;if(Q.sp<=0){Q.sp=rnd(1.8,2.8);const c=2+r4(3);for(let i=0;i<c;i++)spawnYard(Math.random()<.2?ZA('zshot'):Math.random()<.3?'fast':'normal',Math.random()<.5?'gate':'fence')}}
    else if(live()===0)waveDone([['st','Все три. Ни одной разбитой. Это лучший день в моей жизни.'],['vel','Коллеги, я подготовил документ. Объявление ТСЖ: «Зомби во двор не пускать». Надо развесить.'],['sat','Он серьёзно. Он всегда серьёзно.']],()=>sec9('y_vel'))};
  intro('СТОЛЫПИН · ПИВО','#ffd23a',[['st','Мой ящик! Нефильтрованное! Его раскидали по всему двору!'],['vd','Мы тут вообще-то жизнь спасаем.'],['st','Вот и я спасаю. Самое ценное.']]);
}};
// ---- Великий: «Объявление» ----
SEC.y_vel={hero:'vel',build(){
  const L=lvYard('y9vel');pl.x=180;pl.y=130;
  const DS=ENTR.map(x=>({x,y:104,p:0,done:0}));Q.ds=DS;const NEED=3;
  Q.under=()=>{for(const d of DS){if(d.done){F(d.x-5,d.y-10,10,8,'#f4f0e4');F(d.x-5,d.y-10,10,2,'#2a3a8a');F(d.x-4,d.y-7,8,1,'#1a1a1a');F(d.x-4,d.y-5,6,1,'#1a1a1a')}
    else{if(Math.sin(tm*5+d.x)>0){ctx.strokeStyle='rgba(184,154,255,.8)';ctx.strokeRect(d.x-7.5,d.y-11.5,15,12)}if(d.p>0){F(d.x-8,d.y+5,16,2,'#1a1a1e');F(d.x-8,d.y+5,16*d.p/NEED,2,'#b89aff')}}}};
  L.obj=()=>{const n=DS.filter(d=>d.done).length;return n<5?['Расклеить объявления ТСЖ: '+n+' / 5 (стой у двери)']:['Добить: '+live()]};
  Q.tick=dt=>{if(Q.fin||!L.armed)return;
    for(const d of DS){if(d.done)continue;if(D2(pl.x,pl.y,d.x,d.y+8)<14){d.p+=dt;if(Math.random()<dt*3)sfx('click',.3);if(d.p>=NEED){d.done=1;sfx('ring',.7);X.floatT(d.x,d.y-14,'ОБЪЯВЛЕНИЕ','#b89aff');for(let i=0;i<3;i++)spawnYard(Math.random()<.5?ZA('zak'):ZA('zpist'),'fence')}}else d.p=Math.max(0,d.p-dt*.3)}
    const n=DS.filter(d=>d.done).length;
    if(n<5){Q.sp=(Q.sp||1)-dt;if(Q.sp<=0){Q.sp=rnd(1.6,2.4);const c=2+r4(3);for(let i=0;i<c;i++)spawnYard(Math.random()<.3?'fast':'normal',Math.random()<.5?'gate':'fence')}}
    else if(live()===0)waveDone([['vel','«Зомби во двор не пускать. Правление ТСЖ». Юридически безупречно.'],['sat','А теперь моя очередь. Две точки, A и B. Как в «Песках».'],['s','Катя, ты опять за своё.'],['sat','Это моё любимое.']],()=>sec9('y_sat'))};
  intro('ВЕЛИКИЙ · ОБЪЯВЛЕНИЕ','#b89aff',[['vel','Коллеги. Без бумаги — ты букашка. Объявление на каждый подъезд.'],['m','Великий, это зомби. Они не читают.'],['vel','Незнание закона не освобождает от ответственности.']]);
}};
// ---- Сатурналия: «Точки A и B» ----
SEC.y_sat={hero:'sat',build(){
  const L=lvYard('y9sat');pl.x=180;pl.y=210;
  const PT=[{n:'A',x:56,y:196,v:0,r:22},{n:'B',x:304,y:196,v:0,r:22}];Q.pt=PT;
  Q.under=()=>{for(const p of PT){ctx.strokeStyle=p.v>=100?'#3ef0b0':'rgba(255,180,138,.8)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,TAU);ctx.stroke();
    ctx.fillStyle=p.v>=100?'rgba(62,240,176,.12)':'rgba(255,180,138,.08)';ctx.fill();uiTxt(p.n,p.x,p.y+2)}};
  Q.bars=()=>{const y=38;panel(4,y,118,17,.74);uiFont(4,true);PT.forEach((p,i)=>{u.fillStyle='#9a92b0';u.fillText('ТОЧКА '+p.n,9,y+6.5+i*7);X.hudBar(40,y+3.5+i*7,78,4,p.v/100,p.v>=100?'#3ef0b0':'#ffb48a')})};
  Q.tag=z=>{if(Math.random()<.5){z.ai='pt';z.tp=PT[r4(2)]}};
  L.obj=()=>PT.every(p=>p.v>=100)?['Добить: '+live()]:['Захватить точки A и B (стой внутри, пока нет врагов)'];
  Q.tick=dt=>{if(Q.fin||!L.armed)return;
    for(const z of L.zs)if(!z.dead&&z.ai==='pt')seekTarget(z,{x:z.tp.x,y:z.tp.y,r:4},dt,()=>{});
    for(const p of PT){const zin=L.zs.some(z=>!z.dead&&z.st!=='hidden'&&D2(z.x,z.y,p.x,p.y)<p.r),me=D2(pl.x,pl.y,p.x,p.y)<p.r;
      if(p.v>=100)continue;if(me&&!zin)p.v=Math.min(100,p.v+dt*100/9);else if(zin)p.v=Math.max(0,p.v-dt*7);if(p.v>=100){sfx('ring');K.zoneBanner('ТОЧКА '+p.n+' НАША','#3ef0b0');for(let i=0;i<5;i++)Q.tag(spawnYard(Math.random()<.4?ZA('zshot'):'fast','fence'))}}
    if(!PT.every(p=>p.v>=100)){Q.sp=(Q.sp||1)-dt;if(Q.sp<=0){Q.sp=rnd(1.3,2.1);const c=2+r4(3);for(let i=0;i<c;i++)Q.tag(spawnYard(Math.random()<.15?ZA('zak'):Math.random()<.3?'fast':'normal',Math.random()<.5?'gate':'fence'))}}
    else if(live()===0)waveDone([['sat','Обе точки наши. Раунд.'],['H','Всем молодцам — по медали. Но это была разведка, бойцы.'],['H','Главные силы — на подходе. Слышите? Они идут с трёх сторон.'],['m','Тётушка Ханжа... что это у вас?'],['H','Это, сынок, Гатлинг. Михалыч берёг на чёрный день.'],['G','Не задавай вопросов, на которые не хочешь знать ответ.'],['H','Все за мою спину. Сейчас будет мясорубка.']],()=>playC9(CUT_GATLING,()=>sec9('y_hz'),'cut'))};
  intro('САТУРНАЛИЯ · ТОЧКИ A И B','#ffb48a',[['sat','Точка A — у песочницы, B — у гаражной стены. Держим обе.'],['vel','Катя, это двор, а не турнир.'],['sat','Для меня всё — турнир.']]);
}};
// ---- Ханжа: Гатлинг ----
SEC.y_hz={hero:'hz',build(){
  const L=lvYard('y9hz',.45);pl.x=180;pl.y=206;pl.a=Math.PI/2;
  Q.ph=0;Q.t=0;Q.k0=PS.kills;
  const PH=[{n:'ТОЛПА С ТРЁХ СТОРОН',dur:24},{n:'АВТОМАТЧИКИ В БРОНЕ',dur:22},{n:'ВСЁ И СРАЗУ',dur:26},{n:'ТАРАН',dur:0}];Q.PH=PH;
  L.obj=()=>Q.ph<3?['Фаза '+(Q.ph+1)+' / 4: '+PH[Q.ph].n,'Убито с Гатлинга: '+(PS.kills-Q.k0)]:Q.boss&&!Q.boss.dead?['Завалить Тарана']:['Добить: '+live()];
  function burst(){const c=Q.ph===2?6:4;for(let i=0;i<c;i++){const w=['gate','fence','street'][r4(3)];spawnYard(Q.ph===1&&Math.random()<.35?ZA('zak'):Q.ph===2&&Math.random()<.2?ZA(['zpist','zak','zshot'][r4(3)]):Math.random()<.3?'fast':'normal',w)}
    if(Q.ph===2&&Math.random()<.2)spawnYard('brute','gate')}
  Q.tick=dt=>{if(Q.fin||!L.armed)return;
    if(Q.ph<3){Q.t+=dt;Q.sp=(Q.sp||.5)-dt;if(Q.sp<=0&&live()<44){Q.sp=Q.ph===2?.75:1.05;burst()}
      if(Q.t>=PH[Q.ph].dur){Q.ph++;Q.t=0;K.zoneBanner('ФАЗА '+(Q.ph+1)+' · '+PH[Q.ph].n,'#ff6a6a');
        if(Q.ph===1)say([['H','Автоматчики! Не стой столбом, двигайся!']]);
        if(Q.ph===2)say([['H','А теперь — все разом! За Родину, за ТСЖ!']]);
        if(Q.ph===3){say([['G','Ханжа! Через калитку — что-то огромное!'],['H','Ну наконец-то. Иди сюда, красавец.']]);Q.boss=addZ('boss',206,290,{v:0,hp:3200,max:3200,nm:'ТАРАН',nmc:'#ff6a6a',sc:1.4});for(let i=0;i<6;i++)spawnYard('normal','street')}}}
    else if(Q.boss&&Q.boss.dead&&live()===0)waveDone([['H','Чисто.'],['m','Ханжа... вы... это было...'],['H','Знаю, сынок. Знаю.']],()=>playC9(CUT_DAWN,endCh9,'dawn'))};
  intro('ХАНЖА · ГАТЛИНГ','#ffd23a',[['H','Держи огонь, пока ствол не красный. Перегреешь — подождёшь.'],['H','Ну, иди к мамочке, гнильё.']]);
}};

// ================= КАТ-СЦЕНЫ =================
const SN=['#060814','#0a0c1c','#0e1024','#12142c','#161834','#1a1c3a','#1e2040','#222446','#26284a','#2a2c4e'];
const DAWN=['#2a2448','#3a2c58','#4a3460','#6a3e64','#8a4a62','#b05a5a','#d07450','#e8944a','#f0b45a','#f4cc7a'];
function yardSide(t,sky){K.skyG(sky||SN,0,110);F(0,40,W,70,'#5a2a22');for(let x=4;x<W;x+=30)for(let y=48;y<104;y+=12)F(x,y,6,6,Math.sin(x+y)>.3?'#ffd27a':'#2a3a5a');F(0,106,W,74,'#2a2a30');F(0,140,W,40,'#33333a');
  for(let x=0;x<W;x+=6)F(x,150,6,4,(x/6)%2?'#8a7a5a':'#9a8a64')}
function ratWhistler(x,y,t,whistle,dead){if(dead){F(x-8,y-4,14,4,'#5a4e48');F(x+6,y-3,3,2,'#c88a8a');F(x-12,y-3,4,1,'#c88a8a');return}
  F(x-4,y-14,9,12,'#5a4e48');F(x-3,y-13,7,3,'#6e625a');F(x-3,y-22,8,8,'#5a4e48');F(x+4,y-19,3,3,'#6e625a');F(x+6,y-18,1,1,'#2a1a1a');F(x-2,y-25,2,3,'#c88a8a');F(x+3,y-25,2,3,'#c88a8a');F(x+1,y-20,1,1,'#ff2020');
  F(x-8,y-4,5,1,'#c88a8a');F(x-10,y-6,2,2,'#c88a8a');F(x-3,y-2,2,2,'#3a302c');F(x+2,y-2,2,2,'#3a302c');F(x-3,y-27,8,2,'#7a1a1a');
  if(whistle){F(x+7,y-18,4,1,'#c0c0c8');for(let i=0;i<3;i++){const k=(t*2+i/3)%1;ctx.strokeStyle=`rgba(255,255,255,${1-k})`;ctx.beginPath();ctx.arc(x+12,y-18,3+k*10,-.6,.6);ctx.stroke()}}}
// Катя-охотница (по фото): медное каре с чёлкой, золотые серьги, чёрный топ, куртка-хаки, ружьё
function sideKat(x,y,t,aim){const SK='#f2cdb4',J='#4e5a34',HR='#9a4a24';F(x-3,y-10,2,10,'#1a1a1e');F(x,y-10,2,10,'#1a1a1e');F(x-3,y-1,3,1,'#2a1a14');F(x,y-1,3,1,'#2a1a14');
  F(x-4,y-22,8,12,J);F(x-2,y-22,4,5,'#141216');F(x-4,y-22,1,12,'#3e4828');F(x+3,y-22,1,12,'#3e4828');
  F(x-3,y-30,7,8,SK);F(x-4,y-32,8,3,HR);F(x-5,y-31,3,9,HR);F(x+3,y-31,2,3,HR);F(x-4,y-23,2,1,'#6a2e14');F(x+2,y-27,1,1,'#4a2a18');F(x+3,y-28,1,1,'#1a1010');F(x+1,y-24,2,1,'#d07a72');F(x-1,y-25,1,2,'#e8b830');
  if(aim){F(x+2,y-21,14,2,'#2a2a2e');F(x+1,y-20,4,3,'#6a4424')}else{F(x+3,y-28,2,20,'#2a2a2e');F(x+3,y-12,2,5,'#6a4424')}}
function garageRoof(t){F(200,96,120,16,'#4a4e56');F(200,96,120,2,'#6a6e76');for(let x=204;x<316;x+=14)F(x,100,1,10,'#3a3e46')}
const CUT_ALARM=[
  {dur:1,lines:[['H','(рация) Штаб, приём! Говорит командир Ханжа. Тревога!'],['m','Ханжа? Три часа ночи...'],['H','С пустыря идёт орда. Не толпа, боец. Колонна. Ровным строем.'],['vel','Зомби не умеют ходить строем. Это противоречит их природе.'],
    ['H','А эти умеют. И впереди кто-то свистит. Подъём, штаб! Задний двор — Микроб и Шмакодявка, остальные — ко мне во двор!']],draw(t){K.livingSide(t,true);sideMikrob(60,170,t,'stand');K.sideShmak(86,170,t,'stand');K.sideEgor(150,170,t,'stand');K.sideValera(176,170,t,'stand');K.sideStolypin(204,170,t,'stand');if(A8.sideVel)A8.sideVel(232,170,t,'stand')}},
  {dur:6,subs:[[.2,3,null,'(Пустырь за гаражами. Сотни огней. Мертвецы идут шеренгами.)'],[3.1,5.8,null,'(А на крыше гаража — здоровенная крыса со свистком. Она ведёт их.)']],draw(t){
    K.skyG(SN,0,120);F(0,110,W,70,'#1e1a16');garageRoof(t);ratWhistler(260,96,t,t>3);
    for(let r=0;r<4;r++)for(let i=0;i<16;i++){const x=i*20+r*6-mod(t*6,20),y=130+r*10;F(x,y-10,4,10,'#4a5a3a');F(x,y-13,4,3,'#7fa070');F(x+1,y-12,1,1,'#ff2020')}}},
];
const CUT_YARD=[
  {dur:1,lines:[['H','Все на позиции! Во двор лезут со всех сторон!'],['e','Мыш со мной. Колонка со мной. Я готов.'],['val','Я на люках. Всегда на люках.'],['ol','Я с ранеными.'],['vd','Я со светом.'],['st','Я с пивом.'],
    ['vel','Я с документами.'],['sat','Я с беретами. То есть береттами.'],['c','Мяу. (Я с вами всеми. Но сначала — крысы.)'],['H','По очереди, бойцы! Каждый держит свой участок!']],draw(t){yardSide(t);sideMikrob(40,170,t,'stand');K.sideShmak(60,170,t,'stand');
    K.sideEgor(96,170,t,'stand');K.sideValera(118,170,t,'stand',true);K.sideOlesya(140,170,t,'stand');K.sideVlados(162,170,t,'stand');K.sideStolypin(186,170,t,'stand');if(A8.sideVel)A8.sideVel(210,170,t,'stand');if(A8.sideSat)A8.sideSat(232,170,t,'stand');
    if(A8.sideHanzha)A8.sideHanzha(270,170,t);K.catSide(300,168,t,2,'stand',K.PAL_BLACK);K.catSide(84,168,t,1.6,'stand',K.PAL_SIAM)}},
];
const CUT_GATLING=[
  {dur:5,subs:[[.2,2.4,'H','Михалыч! Ящик!'],[2.5,4.8,'G','Двадцать лет ждал этого дня.']],draw(t){yardSide(t);if(A8.sideHanzha)A8.sideHanzha(150,170,t);
    const k=clamp((t-1.5)/1.5,0,1);F(164,150-k*6,26,4,'#2a2a30');for(let i=0;i<3;i++)F(188,150-k*6+i,6,1,'#1a1a1e');F(170,146-k*6,8,4,'#3a3a40');F(100,160,30,10,'#5a4a32');F(100,160,30,2,'#7a6a4a')}},
];
const CUT_DAWN=[
  {dur:6,subs:[[.2,2.8,null,'(Рассвет. На крыше гаража крыса снова подносит свисток...)'],[2.9,5.8,null,'(Выстрел. Свистун падает. Орда без свиста топчется — и разбредается.)']],draw(t){
    K.skyG(DAWN,0,120);F(0,110,W,70,'#3a3430');garageRoof(t);const shot=t>2.9;ratWhistler(260,96,t,!shot,shot);sideKat(214,96,t,t>1.6&&t<4.4);
    if(t>2.9&&t<3.2){F(230,73,6,3,'#fff6a0');F(236,74,24,1,'#ffe890')}
    for(let i=0;i<20;i++){const x=shot?mod(i*17+(i%2?t:-t)*14,W):mod(i*17,W),y=140+(i%4)*8;F(x,y-10,4,10,'#4a5a3a');F(x,y-13,4,3,'#7fa070')}}},
  {dur:1,lines:[['kt','Шмакодявка! Живая! А я смотрю — кто это так шумит на весь район?'],['s','Катя?! Катюша! Ты откуда тут?!'],
    ['kt','Иду за ордой от самой Ленобласти. Видишь свисток? Ими крысы командуют. Свистуны.'],['m','Крыса со свистком. Я уже ничему не удивляюсь.'],
    ['s','Зай, это Катя. Мы со школы дружим. Она охотница. Настоящая.'],['kt','Привет, Микроб. Наслышана. Ружьё не трогай — оно ревнивое.'],
    ['kt','Я трое суток иду за свистунами. Все бегут в одно место — на Заячий остров. Под крепость.'],['C','Мрр. (Крысы. Опять крысы.)']],
    draw(t){yardSide(t,DAWN);sideMikrob(110,170,t,'stand');K.sideShmak(134,170,t,'stand');sideKat(162,170,t,false);if(A8.sideHanzha)A8.sideHanzha(196,170,t);K.catSide(222,168,t,2,'stand',K.PAL_BLACK)}},
  {dur:1,lines:[['r','Экстренный выпуск. Под Петропавловской крепостью на Заячьем острове обнаружено огромное гнездо заражённых.'],['r','Оттуда, по данным разведки, ими кто-то управляет. Горьковская перекрыта, мосты на остров разведены.'],['r','Специалисты называют существо в гнезде «крысиной королевой».']],draw(t){
    K.skyG(['#1a0a14','#240e1a','#2e1220','#381626','#421a2c','#4c1e32','#562238','#60263e','#6a2a44','#742e4a'],0,140);F(0,120,W,60,'#141018');
    F(150,40,8,80,'#3a3430');F(146,36,16,6,'#4a4440');F(152,20,4,16,'#6a5a40');F(100,90,110,30,'#3a3430');F(0,118,W,4,'#2a4a6a');
    for(let i=0;i<5;i++){const k=(t*.8+i/5)%1;ctx.strokeStyle=`rgba(255,40,60,${1-k})`;ctx.beginPath();ctx.arc(154,110,8+k*50,0,TAU);ctx.stroke()}K.newsBar('ГНЕЗДО ПОД КРЕПОСТЬЮ',false)}},
  {dur:1,lines:[['m','Значит, Заячий остров. Где начался Питер — там и закончим.'],['s','Я с тобой. Даже не спорь.'],['C','Мяу. (И я. Корма у тренера больше нет, но я и так злой.)'],
    ['kt','А я остаюсь. Свистуны ещё полезут — кто-то должен снимать их с крыш.'],['H','Остальные держат двор. С Катей удержим. Втроём пойдёте — тише и быстрее.'],['val','Довезу вас до Горьковской. Дальше мост разведён — сами.'],['m','Утром выезжаем.']],draw(t){yardSide(t,DAWN);sideMikrob(110,170,t,'stand');K.sideShmak(134,170,t,'stand');K.catSide(160,168,t,2,'stand',K.PAL_BLACK);sideKat(270,170,t,false);
    if(A8.sideHanzha)A8.sideHanzha(196,170,t);K.sideValera(220,170,t,'stand');K.sideEgor(244,170,t,'stand')}},
];

// ================= КВАРТИРА: начало и конец главы =================
function setFlat9(){
  C1.on=false;C1.mode=null;C1.noWpn=false;C9.on=true;for(const o of [window.C2,window.C3,window.C4,window.C5,window.C6,window.C7,window.C8])if(o){o.on=false;if('epi' in o)o.epi=false;if('ready' in o)o.ready=false}if(window.C4)C4.cat=false;
  scene='flat';cut=null;dlg=null;tr=null;S.fade=0;state='play';K.hud=null;K.on=null;
  S.step=12;S.alarm=false;S.skladLocked=false;S.bat=S.pistol=false;S.bowls=true;mapDirty=true;lastRoom=null;camY=0;
  pl.scoot=false;pl.sit=false;lockMove=true;shmak.mode='sit';shmak.x=136;shmak.y=40;shmak.a=-Math.PI/2;shmak.hug=0;shmak.path=[];cat.path=[];cat.then=null;
  cat.x=CAT_HOME.x;cat.y=CAT_HOME.y;cat.mode='sleep';
}
function kit9(){Object.assign(C1.seenT||(C1.seenT={}),{crawler:1,screamer:1,brute:1,shield:1,thrower:1,fast:1});
  Object.assign(PS,{hp:120,max:120,lives:3,inv:0,wpn:'pistol',syr:Math.max(PS.syr||0,3),regen:0,carry:false,slow:0});
  C9.hk={};try{if(window.UP&&UP.kit)UP.kit(9)}catch(e){}}
function startCh9(){
  C9.started=true;C9.done=false;C9.flags={};C9.hk={};setFlat9();mz9('call');
  pl.x=176;pl.y=74;pl.a=0;pl.ma=0;
  after(1,()=>say([['s','Зай, ты спишь?'],['m','Уже нет. Что это за звук?'],['s','Рация. Ханжа.']],()=>{X.go(()=>playC9(CUT_ALARM,()=>{setFlat9();pl.x=176;pl.y=74;
    C9.ready=true;lockMove=false;if(window.UP&&UP.prep)UP.prep('на задний двор — к Ханже',launch9);else launch9()},'alarm'))}));
}
function launch9(){C9.ready=false;lockMove=true;kit9_keep();C9.kills0=PS.kills;X.go(()=>sec9('back1'))}
function kit9_keep(){C9.hk={};PS.lives=3;PS.hp=PS.max}
IT.push({x:212,y:205,r:16,label:()=>'Выйти: на задний двор — к Ханже',cond:()=>C9.on&&C9.ready&&!C9.done&&scene==='flat'&&!C1.on&&!(window.UP&&UP.prepping&&UP.prepping()),act:launch9});
IT.push({x:212,y:205,r:16,label:()=>'Выйти: титры',cond:()=>C9.on&&C9.done&&C9.epi&&scene==='flat'&&!C1.on,act:()=>{C9.epi=false;S.fade=.01;dlg=null}});
function endCh9(){
  C9.done=true;window.YARD_HELD=true;setFlat9();mz9('hq');pl.x=176;pl.y=74;pl.a=0;
  try{if(window.UP&&UP.grant&&C1.WD.m4)UP.grant('m4')}catch(e){}
  after(.8,()=>say([['m','Двор отбили. Все живы.'],['s','Зай, собирай рюкзак. Утром — на Заячий.'],['c','Мяу. (Я посплю. Последний раз перед подвигом.)']],()=>{lockMove=false;C9.epi=true;note('Глава 9 пройдена. Выход — титры')}));
}

// ================= МЕНЮ ГЛАВЫ 9 =================
const MENU9=[['Глава 9 с начала (тревога)','call9'],['Задний двор: Микроб','back1'],['Задний двор: Шмакодявка','back2'],['Двор: Черсик','y_c'],['Двор: Мыш','y_w'],['Двор: Егор','y_e'],['Двор: Валера','y_val'],
  ['Двор: Олеся','y_ol'],['Двор: Владос','y_vd'],['Двор: Столыпин','y_st'],['Двор: Великий','y_vel'],['Двор: Сатурналия','y_sat'],['Ханжа: Гатлинг','y_hz'],['Рассвет и финал','end9']];
function menuKit9(k){kit9();C1.done=true;for(const o of [window.C2,window.C3,window.C4,window.C5,window.C6,window.C7,window.C8])if(o){o.done=true;o.started=true;o.on=false}C9.started=true;C9.done=false;C9.kills0=PS.kills;
  const order=MENU9.map(m=>m[1]);const i=order.indexOf(k);for(const [h,s] of [['c','y_c'],['w','y_w'],['e','y_e'],['val','y_val'],['ol','y_ol'],['vd','y_vd'],['st','y_st'],['vel','y_vel'],['sat','y_sat']])if(order.indexOf(s)<i)C9.hk[h]=1;
  S.bat=S.pistol=false;S.skladLocked=false;S.alarm=false;S.key=true;mapDirty=true}
const cfg9={ch:C9,num:9,title:'МОЙ ДОМ — МОЯ КРЕПОСТЬ',col:'rgba(255,150,40,A)',btn:{x:4,get y(){return (window.C7&&C7.menu)||(window.C8&&C8.menu)?-99:H-80},w:70,h:12},menu:MENU9,alias:{ch9:'call9'},
  start(k){menuKit9(k);if(k==='call9'){startCh9();return}if(k==='end9'){playC9(CUT_DAWN,endCh9,'dawn');return}sec9(k)},
  canContinue:()=>!!(window.C8&&C8.done&&!C9.started),
  cont(){C9.menu=null;state='play';S.fade=0;sfx('click');kit9();startCh9()},
  endScreen(){
    if(window.C8&&C8.done&&!C9.started){K.endPanel({big:'ГЛАВА 8 ПРОЙДЕНА',sub:'Тактикульщина',col:'#ff6a6a',faces:['s','m','sat','vel','val'],
      l1:'Сбито в небе: '+(C8.airK||0)+'  ·  Сатурналия: '+(C8.satK||0)+'  ·  Великий: '+(C8.velK||0),l2:'Екатеринбург свободен. Но в Петербурге неспокойно...'});cfg9.contBtn(150);return true}
    if(!C9.done)return false;
    if(window.C10&&!C10.started)return false;
    K.endPanel({big:'ГЛАВА 9 ПРОЙДЕНА',sub:'Мой дом — моя крепость',col:'#ffa040',faces:['m','s','c','e','val','ol','vd','st','vel','sat','H'],
      l1:'Убито за ночь: '+Math.max(0,PS.kills-C9.kills0),l2:'Двор выстоял. Крысу-свистуна сняла охотница Катя.',l3:'Награда: M4A1 от Михалыча'});
    u.textAlign='center';uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText('Продолжение следует · '+(touch.on?'Коснись, чтобы сыграть заново':'R или клик — сыграть заново'),W/2,166);u.textAlign='left';return true}};
K.chapter(cfg9);C9.cfg=cfg9;C9.MENU=MENU9;
C9.start=startCh9;C9.lvYard=lvYard;C9.spawnYard=spawnYard;C9.heroTick=heroTick;C9.rayHit=rayHit;C9.attack=attack;C9.HS=HS;C9.sec9=sec9;C9.CUTS={CUT_ALARM,CUT_YARD,CUT_GATLING,CUT_DAWN};C9.sideKat=sideKat;
C9.sys={HEROS,heroHud,healWatch:()=>healWatch(),fx9:()=>fx9(),trTick:dt=>trTick(dt),syncSyr:()=>{lastSyr=PS.syr},catBuff,slash,meleeArc,hit,uiTxt,live:()=>live(),rat}; // для главы 10
C9.get=()=>({L:E.L,Q,PS,scene,state,cut,dlg,mode:C1.mode,cur:C9.cur});
})();
