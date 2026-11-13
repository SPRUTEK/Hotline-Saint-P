// =====================================================================
//  ГЛАВА 7 — «Бабура». Микроб (фиолетовая горилла) и Дюша (чёрная горилла) —
//  дуэт диджеев «Бабура». Сет в клубе «Грибыч» на юге города: верхний этаж
//  с баром и пультом → терраса (Артурчик Kirsanax) → подвал → главный
//  танцпол, босс HRD 303. Награда — два розовых узи от Лёхи Superlative.
//  Подключается после level6.js. Наружу: window.C7.
// =====================================================================
(function(){
'use strict';
if(!window.K56||!window.C6){console.warn('level7: нет kit56/level6');return}
const K=K56,X=C1.X,E=C1.engine,PS=C1.PS,TAU=Math.PI*2,D2=K.D2,angDiff=K.angDiff,Q=K.Q,B=K.B,sfx=X.sfx;
const C7={on:false,done:false,started:false,sec:null,menu:null,kills0:0,flags:{},duK:0,uzi:false};window.C7=C7;
const hold=K.hold;
const r4=n=>(Math.random()*n)|0;

// ================= МУЗЫКА =================
K.addMusic([['unmix','unmix.mp3'],['rampage','rampage.mp3'],['trance','trance.mp3'],['bunker','bunker.mp3'],['mind','mind.mp3'],['smoke','smoke.mp3'],['tommy','tommy.mp3'],['smajte','smajte.mp3']]);
const MZ7={call:'flat',ride:'tommy',top:'unmix',fight:'hellraiser',terrace:'kupala_mud',cellar:'bunker',main:'bunker',boss:'rave_station',end:'smoke',hq:'flat'};
const mz7=k=>K.music(MZ7[k]);

// ================= ПОРТРЕТЫ 64×64 =================
function face(g,o,open,blink){
  g.clearRect(0,0,64,64);
  const SK=o.sk||'#eec4a4',SD=o.sd||shade(SK,.84);
  if(o.back)o.back(g);
  o.body(g);
  P(g,27,43,10,8,SD);
  const hw=o.hw||13,hh=o.hh||16;
  ell(g,32.5,31,hw,hh,SD);ell(g,31.5,30,hw-.5,hh-.5,SK);
  ell(g,32-hw-.5,32,2.6,4,SD);ell(g,32+hw,32,2.6,4,SD);
  const ey=o.ey||30;
  if(blink){P(g,21,ey+1,7,1,shade(SK,.55));P(g,36,ey+1,7,1,shade(SK,.55))}
  else for(const ex of [21,36]){P(g,ex,ey-1,7,4,o.white||'#f4f0ea');P(g,ex+2,ey-1,3.5,4,o.eye||'#5a3a22');P(g,ex+2.75,ey-.25,2,2.5,'#140c08');P(g,ex+2.5,ey-.5,.75,.75,'#ffffff');P(g,ex,ey-1.5,7,.5,shade(SK,.5))}
  P(g,20,ey-5,9,2,o.brow||'#3a2a1e');P(g,35,ey-5,9,2,o.brow||'#3a2a1e');
  P(g,30.5,ey+3,2,6,SD);P(g,29.5,ey+8,1,1,shade(SK,.7));P(g,32.5,ey+8,1,1,shade(SK,.7));
  const my=o.my||42,lip=o.lip||'#b06a62';
  if(o.beard)o.beard(g);
  if(open){P(g,27,my,10,4,'#3a1612');P(g,28,my,8,1,'#eeeeee');P(g,27,my-1,10,1,lip);P(g,27,my+4,10,1,lip)}
  else{P(g,27,my,10,1,lip);P(g,28,my+1,8,1,shade(lip,.7))}
  if(o.hair)o.hair(g);
  if(o.glasses)o.glasses(g);
  if(o.extra)o.extra(g,open,blink);
}
const strands=(g,n,x0,x1,y0,y1,c,seed)=>{for(let i=0;i<n;i++){const x=x0+Math.floor(hash(i,seed)*(x1-x0)),y=y0+Math.floor(hash(seed,i)*(y1-y0));P(g,x,y,1,2,c)}};
const furBody=(g,c,cl)=>{ell(g,32,76,34,22,c);for(let i=0;i<60;i++)P(g,2+Math.floor(hash(i,21)*60),52+Math.floor(hash(21,i)*12),1,3,i%2?cl:shade(c,.7))};
// Дюша: короткие тёмные волнистые волосы, усы, светлая щетина на подбородке, крепкий; в чёрном костюме гориллы
function pDusha(g,open,blink){face(g,{sk:'#efc2a6',eye:'#4a3020',brow:'#3a2618',lip:'#c0807a',hw:14.5,hh:16.5,
  body(g){furBody(g,'#1e1c22','#3a3640');P(g,24,50,16,6,'#e2b292');ell(g,32,52,9,3,'#e2b292')}, // широкая шея
  beard(g){P(g,24,39,16,3,'#3a2a1e');P(g,23,40,3,5,'#3a2a1e');P(g,38,40,3,5,'#3a2a1e');strands(g,26,24,40,44,52,'#b89676',6);ell(g,32,49,6,3,'#c8a888');strands(g,10,27,37,47,52,'#8a6a50',8)},
  hair(g){ell(g,32,16,15,8,'#3a2618',(x,y)=>y<=20);for(let i=0;i<9;i++)ell(g,19+i*3.2,12+((i*5)%3),2.6,2.6,i%2?'#4a3020':'#2e1e14');P(g,17,16,3,8,'#3a2618');P(g,44,16,3,8,'#3a2618');strands(g,16,19,45,9,18,'#5a3a26',12)},
  extra(g){P(g,21,34,4,1,'#e8a090');P(g,39,34,4,1,'#e8a090');P(g,20,23,9,1,'#3a2618')}},open,blink)} // хмурится
// Лёха Superlative: светлые кудрявые взъерошенные волосы, рыжеватые усы и щетина, серо-голубые глаза, чёрная футболка
function pLyokha(g,open,blink){const HR='#9a7a52',HL='#c0a070',HD='#6a5236';face(g,{sk:'#f2cab4',eye:'#6a8aa8',brow:'#8a6a48',lip:'#c88a80',hw:13,hh:16.5,
  body(g){ell(g,32,76,30,20,'#141418');ell(g,32,78,24,12,'#1c1c22');P(g,26,52,12,4,'#0e0e12')},
  beard(g){P(g,26,39,12,1,'#c8946a');strands(g,22,24,40,43,52,'#d0a07a',4)},
  hair(g){ell(g,32,15,17,9,HR,(x,y)=>y<=22);for(let i=0;i<14;i++){const x=16+i*2.4,y=18+((i*7)%5);g.strokeStyle=i%2?HD:HL;g.lineWidth=1;g.beginPath();g.arc(x,y,2,0,Math.PI*1.6);g.stroke()}
    P(g,15,16,4,12,HR);P(g,45,16,4,12,HR);strands(g,40,15,49,6,24,HL,9);strands(g,20,15,49,8,22,HD,2);P(g,12,8,2,2,HL);P(g,50,6,2,2,HL);P(g,31,3,1,3,HL)}},open,blink)}
// Фейсер Паутина: худой, пепельно-русая лохматая стрижка с густой чёлкой до глаз, красные линзы, щетина, кожанка, цепочки
function pPautina(g,open,blink){const HR='#6a5646',HL='#8a7460',HD='#4a3a30';face(g,{sk:'#f0d4c4',eye:'#c81a1a',brow:'#4a3a30',lip:'#c09088',hw:11,hh:16,ey:31,
  back(g){ell(g,32,28,19,20,HR);for(let i=0;i<9;i++)P(g,13+i*4.4,40+((i*3)%5),3,8,i%2?HR:HD)},
  body(g){ell(g,32,78,30,20,'#141416');ell(g,32,80,22,12,'#0a0a0c');P(g,10,56,8,10,'#1e1e22');P(g,46,56,8,10,'#1e1e22');P(g,18,54,1,12,'#3a3a40');P(g,45,54,1,12,'#3a3a40');
    for(let i=0;i<16;i++){const a=Math.PI*.15+i/15*Math.PI*.7;P(g,32+Math.cos(a)*11,48+Math.sin(a)*9,1,1,'#d8d8e0')}for(let i=0;i<14;i++){const a=Math.PI*.2+i/13*Math.PI*.6;P(g,32+Math.cos(a)*8,50+Math.sin(a)*12,1,1,'#b8b8c0')}},
  beard(g){strands(g,24,25,39,44,52,'#7a6252',5)},
  hair(g){ell(g,32,16,18,10,HR,(x,y)=>y<=24);for(let i=0;i<12;i++){const x=16+i*2.8;P(g,x,18,3,8+((i*5)%4),i%3?HR:HD)}
    P(g,13,16,5,22,HR);P(g,46,16,5,22,HR);strands(g,40,14,50,6,30,HL,7);strands(g,20,16,48,18,28,HD,3)},
  extra(g){P(g,20,26,24,1,HD)}},open,blink)} // чёлка до глаз
// бармен: толстый, борода, бандана, фартук
function pBarman(g,open,blink){face(g,{sk:'#e8b494',eye:'#3a2a1a',brow:'#3a2618',lip:'#a0605a',hw:16,hh:17,
  body(g){ell(g,32,76,36,24,'#2a2a30');P(g,14,54,36,12,'#8a5a3a');P(g,14,54,36,2,'#6a4228');P(g,20,56,1,8,'#c8c8c8');P(g,43,56,1,8,'#c8c8c8')},
  beard(g){ell(g,32,46,16,13,'#4a3020',(x,y)=>{const dx=Math.abs(x-31.5);return y>=44||(y>=36&&dx>=10)});ell(g,32,54,12,7,'#4a3020');P(g,24,39,16,3,'#5a3a26');strands(g,40,18,46,40,60,'#2e1e14',5)},
  hair(g){ell(g,32,15,16,8,'#c82a2a',(x,y)=>y<=19);P(g,15,15,34,4,'#c82a2a');for(let i=0;i<8;i++)P(g,18+i*4,13,1,1,'#ffffff');P(g,46,18,6,3,'#a81a1a');P(g,48,20,4,4,'#a81a1a')},
  extra(g){P(g,20,36,4,2,'#e8907a');P(g,40,36,4,2,'#e8907a')}},open,blink)}
// Артурчик Kirsanax: невысокий, толстенький, тёмные волосы, густые брови, щетина, огромные наушники
function pArtur(g,open,blink){face(g,{sk:'#deac86',eye:'#2a1a10',brow:'#140e0a',lip:'#a06258',hw:15.5,hh:15.5,
  body(g){ell(g,32,76,34,22,'#3a2a6a');for(let i=0;i<10;i++)P(g,6+i*6,56+((i*3)%6),3,3,['#ff4fd8','#3ef0b0','#ffd23a'][i%3])},
  beard(g){strands(g,60,18,46,38,54,'#2a1e18',7);ell(g,32,50,10,4,'#3a2a20');P(g,25,39,14,2,'#1e140e')},
  hair(g){ell(g,32,16,15,7,'#140e0a',(x,y)=>y<=20);P(g,18,15,4,8,'#140e0a');P(g,42,15,4,8,'#140e0a');P(g,19,24,10,2,'#140e0a');P(g,35,24,10,2,'#140e0a')},
  extra(g){P(g,14,8,36,4,'#1a1a20');ell(g,15,30,6,8,'#1a1a20');ell(g,49,30,6,8,'#1a1a20');ell(g,15,30,3,5,'#ff4fd8');ell(g,49,30,3,5,'#ff4fd8')}},open,blink)}
// HRD 303: зомби-качок, почти человек; бритая голова, красный лазерный визор, шея-бочка, майка
function pHrd(g,open,blink){face(g,{sk:'#a8b894',eye:'#ff2020',white:'#3a0a0a',brow:'#5a6a4a',lip:'#5a3a3a',hw:15,hh:15.5,
  body(g){ell(g,32,74,40,24,'#8a9a7a');ell(g,10,60,12,10,'#9aaa88');ell(g,54,60,12,10,'#9aaa88');P(g,20,52,24,14,'#1a1a1e');P(g,22,56,20,2,'#c81a1a');ctx0(g);P(g,22,46,20,8,'#98a884')},
  beard(g){strands(g,20,22,42,40,50,'#6a7a5a',3);P(g,40,44,4,3,'#6a1a1a')},
  hair(g){ell(g,32,15,15,7,'#7a8a6a',(x,y)=>y<=18);strands(g,30,18,46,9,18,'#5a6a4a',4);P(g,24,18,4,1,'#5a3a3a');P(g,36,19,3,1,'#5a3a3a')},
  glasses(g){P(g,17,27,30,7,'#2a0606');P(g,18,28,28,5,blink?'#6a0a0a':'#ff2a2a');P(g,20,29,10,1,'#ffb0b0');P(g,14,29,4,3,'#2a2a2a');P(g,46,29,4,3,'#2a2a2a')},
  extra(g,open){if(open){P(g,27,42,10,5,'#1a0a0a');for(let i=0;i<4;i++)P(g,28+i*2.5,42,1.5,2,'#d8d0b0')}P(g,12,40,4,2,'#2a2a2a');P(g,48,40,4,2,'#2a2a2a')}},open,blink)}
function ctx0(){}
const NEWP={du:pDusha,lx:pLyokha,pw:pPautina,bm:pBarman,ak:pArtur,hr:pHrd};
Object.assign(PORTRAIT,NEWP);for(const k in NEWP)PCV[k]=mk(64);
Object.assign(NAME,{du:'ДЮША',lx:'ЛЁХА SUPERLATIVE',pw:'ФЕЙСЕР ПАУТИНА',bm:'БАРМЕН «СИСЬКАСТЫЙ ХУЙ»',ak:'АРТУРЧИК KIRSANAX',hr:'HRD 303'});
Object.assign(NCOL,{du:'#c8c0d8',lx:'#ff9ad8',pw:'#a8a8b8',bm:'#ffb060',ak:'#3ef0b0',hr:'#ff3a3a'});
Object.assign(BG,{du:['#121018','#8a7aa8'],lx:['#24101e','#ff9ad8'],pw:['#101014','#a8a8b8'],bm:['#24140a','#ffb060'],ak:['#0a2018','#3ef0b0'],hr:['#2a0606','#ff3a3a']});

// ================= ГОРИЛЛЫ СВЕРХУ 24×24 =================
const GOR={m:{f:'#6a3a9a',d:'#4a2470',l:'#8e5ec0',sk:'#3e3044',glass:'#ecb73c'},du:{f:'#1e1c24',d:'#0e0d12',l:'#3a3644',sk:'#4a4048',glass:null}};
function arms(g,w,J,SK){
  if(w==='pistol'){P(g,11,15,8,3,J);P(g,18,15,2,2,SK);P(g,19,13,6,2,'#151515');P(g,20,12,2,1,'#151515');P(g,11,6,6,3,J);P(g,16,7,2,3,SK)}
  else if(w==='bat'){P(g,10,16,7,3,J);P(g,16,16,2,2,SK);P(g,2,17,15,2,'#b07434');P(g,2,17,4,2,'#c88a44');P(g,14,17,3,2,'#2a2a2a');P(g,10,5,6,3,J);P(g,15,5,2,2,SK)}
  else if(w==='shotgun'){P(g,11,14,8,3,J);P(g,17,14,2,2,SK);P(g,10,7,10,3,J);P(g,19,8,2,2,SK);P(g,6,11,7,3,'#6a4424');P(g,12,11,12,2,'#26262a');P(g,14,13,7,1,'#3a3a40')}
  else if(w==='rail'){P(g,11,15,8,3,J);P(g,18,14,2,2,SK);P(g,10,7,10,3,J);P(g,19,8,2,2,SK);P(g,8,10,16,4,'#3a4a5a');P(g,10,11,14,1,'#8af0ff');P(g,23,10,2,4,'#c8f8ff')}
  else if(w==='uzi'){P(g,11,15,8,3,J);P(g,18,15,2,2,SK);P(g,19,14,5,3,'#ff5ac8');P(g,20,17,1,2,'#c8309a');P(g,11,6,8,3,J);P(g,18,7,2,2,SK);P(g,19,6,5,3,'#ff5ac8');P(g,20,5,1,2,'#c8309a')}
  else if(w==='fist'){P(g,12,15,7,4,J);P(g,18,15,3,4,SK);P(g,12,5,7,4,J);P(g,18,5,3,4,SK)}
  else{P(g,10,3,6,3,J);P(g,16,3,2,3,SK);P(g,10,18,6,3,J);P(g,16,18,2,3,SK)}
}
function drawGor(g,w,carry,pal,punch){
  g.clearRect(0,0,24,24);const p=pal;
  arms(g,punch>0?'fist':w,p.f,p.sk);if(punch>0){P(g,18,15,4,4,p.sk);P(g,21,15,2,4,shade(p.sk,1.3))}
  ell(g,11,12,5.4,8,p.f);ell(g,9.4,12,3.6,7,p.d);for(let i=0;i<10;i++)P(g,6+((i*7)%9),5+((i*5)%14),1,2,p.l);
  ell(g,12.5,12,4.2,4.2,p.d);ell(g,13,12,3.6,3.8,p.f);P(g,11,10,2,1,p.l);
  ell(g,15.2,12,1.8,2.6,p.sk);P(g,16,11,1,.6,'#1a1418');P(g,16,12.6,1,.6,'#1a1418');
  if(p.glass){P(g,15,9.5,1.4,1.6,p.glass);P(g,15,12.9,1.4,1.6,p.glass)}else{P(g,15,10,1,1,'#c8a080');P(g,15,13,1,1,'#c8a080')}
  outline(g,'#0b0910');
}
const HERO={draw:(g,w,c)=>drawGor(g,w,c,GOR.m,0),leg:'#4a2470',shoe:'#2a1a3a'};
const cvDu=mk(24);cvDu.getContext('2d',{willReadFrequently:true});const legDu=mk(24);legDu.getContext('2d',{willReadFrequently:true});

// ================= ДЮША — НАПАРНИК (кулаки гориллы, «Барабан» — удар в грудь) =================
function addDu(x,y){const A={x,y,a:-Math.PI/2,ma:0,ph:0,mv:false,cd:.6,sw:0,sup:5,kills:0,quip:rnd(8,14)};Q.du=A;
  E.L.npcs.push({draw(){drawDu(A)}});return A}
const DU_Q=['Дюша: «Бабура не отменяет сеты!»','Дюша: «Бас-кулак!»','Дюша: «Это за сорванный дроп!»','Дюша: «Микроб, держи бит!»','Дюша: «У-у-у-а-а!»'];
function duHit(A,z,dmg,kb){const a=Math.atan2(z.y-A.y,z.x-A.x),was=z.dead;X.hurtZ(z,z.type==='boss'?dmg*.3:dmg,a,z.type==='boss'?0:kb);if(!was&&z.dead)A.kills++}
function duTick(A,dt){
  A.cd-=dt;if(A.sw>0)A.sw-=dt;A.sup-=dt;A.quip-=dt;if(A.drum>0)A.drum-=dt;
  if(hold()){A.mv=false;return}
  const L=E.L,d=D2(A.x,A.y,pl.x,pl.y);
  if(d>230){for(let k=0;k<14;k++){const a=pl.a+Math.PI+rnd(-1.2,1.2),r=rnd(14,26),x=pl.x+Math.cos(a)*r,y=pl.y+Math.sin(a)*r;if(!K.solid(x,y,4)){A.x=x;A.y=y;break}}}
  let tg=null,bd=130;
  if(L.armed)for(const z of L.zs){if(z.dead||z.st==='hidden'||z.st==='rise')continue;if(z.st==='idle'&&D2(z.x,z.y,pl.x,pl.y)>110)continue;const dz=D2(A.x,A.y,z.x,z.y);if(dz<bd&&E.los(A.x,A.y,z.x,z.y)){bd=dz;tg=z}}
  A.mv=false;let dir=null,sp=0;
  if(tg&&D2(tg.x,tg.y,pl.x,pl.y)<170){if(bd>tg.r+11){dir=Math.atan2(tg.y-A.y,tg.x-A.x);sp=80}}
  else{const pa=pl.a+Math.PI/2,bx=pl.x-Math.cos(pl.a)*15+Math.cos(pa)*12,by=pl.y-Math.sin(pl.a)*15+Math.sin(pa)*12;
    if(d>22&&D2(A.x,A.y,bx,by)>6){dir=(E.los(A.x,A.y,bx,by)&&!K.solid(bx,by,3.5))?Math.atan2(by-A.y,bx-A.x):K.navDir(A);sp=d>70?88:70}}
  if(dir!=null){K.mv(A,Math.cos(dir)*sp*dt,Math.sin(dir)*sp*dt,4);A.ma=dir;A.mv=true;A.ph+=dt*12}
  const fa=tg?Math.atan2(tg.y-A.y,tg.x-A.x):(A.mv?A.ma:A.a);A.a+=angDiff(fa,A.a)*Math.min(1,dt*9);
  if(tg){
    // «БАРАБАН»: горилла бьёт себя в грудь — все рядом залипают
    if(A.sup<=0){const near=L.zs.filter(z=>!z.dead&&z.st!=='hidden'&&D2(z.x,z.y,A.x,A.y)<44);
      if(near.length>=3||(near.length&&A.sup<-8)){A.sup=11;A.drum=.6;sfx('thump',.7);sfx('groan',.6);C1.shake=Math.max(C1.shake,.35);X.floatT(A.x,A.y-14,'БАРАБАН!','#c8c0ff');
        for(const z of near){duHit(A,z,35,200);if(!z.dead&&z.type!=='boss')z.stun=Math.max(z.stun,1.4)}for(let i=0;i<16;i++)L.fx.push({x:A.x,y:A.y,vx:Math.cos(i/16*TAU)*100,vy:Math.sin(i/16*TAU)*100,life:.3,c:'#a890ff'});return}}
    if(A.cd<=0&&bd<tg.r+12&&Math.abs(angDiff(fa,A.a))<.5){A.cd=rnd(.42,.52);A.sw=.16;sfx('bat',.8);duHit(A,tg,48,160);Q.slashes.push({x:A.x,y:A.y,a:A.a,t:.14,c:'#c8c0ff'})
      if(A.quip<=0){A.quip=rnd(14,24);note(DU_Q[r4(DU_Q.length)])}}
  }
  const dx=A.x-pl.x,dy=A.y-pl.y,dd=Math.hypot(dx,dy);if(dd<10&&dd>.01)K.mv(A,dx/dd*(10-dd),dy/dd*(10-dd),4);
}
function drawDu(A){
  if(A.hidden)return;shadowBlob(A.x,A.y,7);
  legs(legDu.getContext('2d'),A.ph,A.mv,'#16141a','#0a0a0e');spr(legDu,A.x,A.y,A.mv?A.ma:A.a);
  drawGor(cvDu.getContext('2d'),null,false,GOR.du,A.sw);spr(cvDu,A.x,A.y,A.a);
  if(A.drum>0){ctx.strokeStyle=`rgba(168,144,255,${A.drum/.6})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(A.x,A.y,(1-A.drum/.6)*44,0,TAU);ctx.stroke()}
}

// ================= ЗОМБИ «ГРИБЫЧА» =================
// 700..703 тусовщики, 710..711 рейверы со светящимися палочками (быстрые), 720 вышибала (громила),
// 730..731 бармены (кидают бутылки), 740 визжалка с блёстками, 750 HRD 303 (босс)
function zClub(v,kind){
  const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});const SK=['#8aa47a','#7e9a70','#94ac84'][v%3];
  if(kind==='party'){const C=['#ff4fd8','#3a3a8a','#e8e8e8','#2ac8a0'][v%4],HR=['#2a1a10','#d8c070','#6a2a1a','#141414'][v%4];
    P(g,11,6,8,3,C);P(g,18,6,3,3,SK);P(g,11,15,8,3,C);P(g,18,15,3,3,SK);ell(g,11,12,4.6,7.4,C);ell(g,9.8,12,2.6,6.4,shade(C,.75));
    if(v%2)for(let i=0;i<6;i++)P(g,8+i,8+((i*5)%9),1,1,'#fff6c0');ell(g,12,12,4,4,HR);P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
  if(kind==='rave'){const C=v%2?'#1a1a1a':'#4a1a6a';P(g,11,6,8,3,C);P(g,18,5,3,3,SK);P(g,11,15,8,3,C);P(g,18,16,3,3,SK);P(g,20,3,1,6,'#3eff6a');P(g,20,15,1,6,'#ff4fd8');
    ell(g,11,12,4.4,7,C);ell(g,12,12,3.8,3.8,'#d8d8d8');P(g,10,9,4,6,v%2?'#ff4fd8':'#3ef0b0');P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
  if(kind==='barm'){P(g,11,6,8,3,'#f0f0f0');P(g,18,6,3,3,SK);P(g,11,15,8,3,'#f0f0f0');P(g,18,15,3,3,SK);P(g,19,14,3,5,'#3a8a3a');ell(g,11,12,4.6,7.4,'#f0f0f0');P(g,7,7,3,10,'#1a1a1a');
    P(g,13,11,2,2,'#1a1a1a');ell(g,12,12,4,4,v?'#2a1a10':'#5a3a20');P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
  if(kind==='scr'){P(g,11,7,8,2,'#c8a0ff');P(g,18,6,3,3,SK);P(g,11,15,8,2,'#c8a0ff');P(g,18,15,3,3,SK);ell(g,11,12,3.8,6.8,'#c8a0ff');for(let i=0;i<8;i++)P(g,8+((i*3)%7),7+((i*5)%10),1,1,'#ffffff');
    ell(g,9,12,5,3.6,'#e8c050');P(g,2,10,6,4,'#e8c050');ell(g,13,12,3.6,3.6,'#e8c050');ell(g,16.5,12,1.8,2.2,'#120608');P(g,16,11,1,1,'#ff3030')}
  outline(g,'#0b0910');return c;
}
function zBouncer(){const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});const SK='#86a078';
  P(g,14,3,12,6,'#0e0e12');P(g,24,3,4,6,SK);P(g,14,23,12,6,'#0e0e12');P(g,24,23,4,6,SK);ell(g,14,16,8.5,12,'#0e0e12');ell(g,12,16,6,10,'#1a1a1e');
  g.fillStyle='#e8e8e8';g.font='bold 4px monospace';g.save();g.translate(12,22);g.rotate(-Math.PI/2);g.fillText('ОХРАНА',0,0);g.restore();
  ell(g,18,16,5,5,SK);P(g,21,13,1,1,'#ff2020');P(g,21,18,1,1,'#ff2020');P(g,15,19,4,1,'#2a2a2a');outline(g,'#0b0910');return c}
function zHrd(){const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});const SK='#a0b48c',SD='#7a8e68';
  ell(g,20,5,6,4,SK);ell(g,20,27,6,4,SK);P(g,22,3,5,4,SD);P(g,22,25,5,4,SD); // бицепсы
  ell(g,14,16,9,12.5,SK);ell(g,13,16,7,10,'#1a1a1e');P(g,8,9,8,1,'#c81a1a');P(g,8,22,8,1,'#c81a1a');ell(g,10,16,3,8,SD);
  ell(g,19,16,5.5,5.5,SK);P(g,22,12,3,9,'#ff2a2a');P(g,23,13,1,7,'#ffb0b0');P(g,15,11,3,2,'#1a1a20');P(g,15,19,3,2,'#1a1a20');P(g,14,12,2,8,'#2a2a30'); // визор и наушники
  outline(g,'#0b0910');return c}
for(let v=0;v<4;v++)X.zCache['normal'+(700+v)]=zClub(v,'party');
for(let v=0;v<2;v++){X.zCache['fast'+(710+v)]=zClub(v,'rave');X.zCache['thrower'+(730+v)]=zClub(v,'barm')}
X.zCache['screamer740']=zClub(0,'scr');X.zCache['brute720']=zBouncer();X.zCache['boss750']=zHrd();
if(C1.LNAME)Object.assign(C1.LNAME,{top7:'«ГРИБЫЧ» · ВЕРХНИЙ ЭТАЖ',terrace7:'«ГРИБЫЧ» · ТЕРРАСА',cellar7:'«ГРИБЫЧ» · ПОДВАЛ',main7:'«ГРИБЫЧ» · ГЛАВНЫЙ ТАНЦПОЛ'});
const Zp=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:700+r4(4),hp:60,max:60,sp:25},o||{}));
const Zr=(x,y,o)=>E.addZ('fast',x,y,Object.assign({v:710+r4(2),hp:38,max:38,sp:50},o||{}));
const Zb=(x,y,o)=>E.addZ('brute',x,y,Object.assign({v:720,hp:420,max:420},o||{}));
const Zm=(x,y,o)=>E.addZ('thrower',x,y,Object.assign({v:730+r4(2),hp:50,max:50},o||{}));
const Zs=(x,y,o)=>E.addZ('screamer',x,y,Object.assign({v:740,hp:34,max:34},o||{}));
C1.seenT=C1.seenT||{};

// ================= ОТРИСОВКА КЛУБА =================
function tiles(x0,y0,x1,y1,a,b,s){E.gfill(x0,y0,x1,y1,0);s=s||8;for(let y=y0;y<y1;y+=4)for(let x=x0;x<x1;x+=4){const h=hash(x>>2,y>>2);let c=(((x/s)|0)+((y/s)|0))%2?a:b;if(h<.08)c=shade(c,.85);B(x,y,Math.min(4,x1-x),Math.min(4,y1-y),c)}}
function counter(x,y,w,h,c,top){X.lowBox(x,y,w,h,c||'#3a2418',top||'#7a4a2a');for(let i=x+3;i<x+w-3;i+=7)B(i,y+1,3,1,'#c8a060')}
function shelf(x,y,w){B(x,y,w,4,'#2a1a10');for(let i=x+1;i<x+w-2;i+=3)B(i,y-4,2,4,['#3a8a3a','#c8a040','#8a2a2a','#e8e8e8','#4a6ac8'][(i>>1)%5])}
function table(x,y){X.lowBox(x-6,y-6,12,12,'#2a2030','#4a3a58');B(x-1,y-1,2,2,'#ffd23a');for(const [dx,dy] of [[-10,0],[10,0],[0,-10],[0,10]]){X.lowBox(x+dx-3,y+dy-3,6,6,'#5a2a4a','#7a3a6a')}}
function sign(x,y,t,c,sz){K.txt(x,y,t,c||'#ffffff',sz||4)}
// пульт: корпус с кнопками и вертушками
function booth(x,y,w,h,col){X.lowBox(x,y,w,h,'#16121e','#2a2238');const n=Math.max(1,Math.floor(w/28));for(let i=0;i<n;i++){const cx=x+8+i*(w-16)/Math.max(1,n-1||1);B(cx-5,y+3,10,10,'#0a0a0e');B(cx-1,y+7,2,2,'#c8c8d0')}
  for(let i=x+4;i<x+w-4;i+=4)B(i,y+h-5,2,2,col||'#ff4fd8')}
// светодиодный танцпол: рисуется поверх пола каждый кадр
function ledFloor(x0,y0,x1,y1,beat,pal){const s=16;for(let y=y0;y<y1;y+=s)for(let x=x0;x<x1;x+=s){const k=(hash(x>>4,y>>4)*4+((beat|0)))%4|0;ctx.globalAlpha=.16+.12*((beat%1)<.25?1:0);ctx.fillStyle=pal[k%pal.length];ctx.fillRect(x+1,y+1,s-2,s-2)}ctx.globalAlpha=1}
const BPM=128,BEAT=60/BPM;const beatNow=()=>tm/BEAT;

// ================= ОБЩИЙ ЗАПУСК УЧАСТКА =================
function sec7(n){
  K.sec(C7,n,()=>{
    ({top:lvTop,terrace:lvTerrace,cellar:lvCellar,main:lvMain,gymst:lvGymSt,gym:lvGym})[n]();
    const L=E.L;L.hero=HERO;L.healName='Грибной шот';L.healNote='*глк* Фирменный «Грибной шот». Жжёт, но лечит.';L.healNone='Шоты кончились. Бармен остался наверху.';
    if(n==='gymst'||n==='gym'){L.healName='Протеиновый шейк';L.healNote='*глык* Шейк из бара Скалы. Белок лечит всё.';L.healNone='Шейки кончились.';Q.ckN='+шейк'}
  },sec7);
  C7.lastSyr=PS.syr;
  K.tick=dt=>{if(Q.du)duTick(Q.du,dt);if(Q.sk)skTick(Q.sk,dt);ckTick();if(K.L.onTick7)K.L.onTick7(dt)};
}
C7.go=sec7;
const playC7=(shots,onEnd,k)=>K.cut(C7,shots,onEnd,MZ7[k]);
function bankDu(){if(Q.du){C7.duK+=Q.du.kills;Q.du.kills=0}}
// фирменные шоты-лечилки, лежат на столиках
function addCk(x,y){(Q.ck||(Q.ck=[])).push({x,y})}
function ckTick(){if(!Q.ck)return;for(const c of Q.ck){if(c.t)continue;if(D2(c.x,c.y,pl.x,pl.y)<9){c.t=1;PS.syr++;sfx('pick');X.floatT(c.x,c.y-6,Q.ckN||'+грибной шот','#c8ff6a')}}}
function ckDraw(){if(!Q.ck)return;for(const c of Q.ck){if(c.t)continue;const y=c.y+Math.sin(tm*3+c.x);F(c.x-2,y-3,4,5,'rgba(200,255,140,.5)');F(c.x-2,y,4,2,'#9aff4a');F(c.x-2,y-4,4,1,'#e8fff0');F(c.x+1,y-6,1,3,'#ff4fd8');
  ctx.strokeStyle=`rgba(200,255,140,${.25+.25*Math.sin(tm*5+c.x)})`;ctx.strokeRect(c.x-5.5,y-7.5,11,13)}}
function wrapDraw(L,under,over){const lu=L.drawUnder,lo=L.drawOver;L.drawUnder=()=>{if(lu)lu();if(under)under();ckDraw()};L.drawOver=()=>{if(lo)lo();if(over)over()}}
function npc(L,o){const cv=mk(24);cv.getContext('2d',{willReadFrequently:true});L.npcs.push({draw(){if(o.hid)return;shadowBlob(o.x,o.y,o.big?7:5);o.top(cv.getContext('2d'),o);spr(cv,o.x,o.y,o.a!=null?o.a:Math.atan2(pl.y-o.y,pl.x-o.x))}});return o}
// люди сверху
function topHuman(g,o){g.clearRect(0,0,24,24);const C=o.c,SK=o.sk||'#efc2a6';
  P(g,11,6,7,3,C);P(g,17,6,2,3,SK);P(g,11,15,7,3,C);P(g,17,15,2,3,SK);ell(g,11,12,o.fat?5.6:4.2,o.fat?8:7,C);if(o.apron)ell(g,13,12,3,5,'#8a5a3a');
  ell(g,12,12,o.fat?4.4:3.8,o.fat?4.4:3.8,o.hr);if(o.curt){P(g,10,7,3,3,o.hr);P(g,10,14,3,3,o.hr)}if(o.phones){P(g,11,7,3,2,'#1a1a20');P(g,11,15,3,2,'#1a1a20');P(g,11,8,1,8,'#1a1a20')}
  P(g,14,10,2,4,SK);if(o.band)P(g,10,9,4,6,'#c82a2a');outline(g,'#0b0910')}
const LX={c:'#141418',hr:'#9a7a52',sk:'#f2cab4'},BM={c:'#2a2a30',hr:'#c82a2a',sk:'#e8b494',fat:1,apron:1,band:1},AK={c:'#3a2a6a',hr:'#140e0a',sk:'#deac86',fat:1,phones:1},PW={c:'#141416',hr:'#6a5646',sk:'#f0d4c4',curt:1};

// ---------- ВЕРХНИЙ ЭТАЖ: бар, столики, пульт ----------
function lvTop(){
  const L=E.mkLevel('top7',560,400);B(0,0,560,400,'#120c1a');
  tiles(20,20,540,380,'#2a1e34','#24182e',16);
  // панорамные окна на город
  for(let x=24;x<536;x+=40){B(x,10,36,10,'#0a1428');for(let i=0;i<5;i++)B(x+3+i*7,13+((x+i)%3),2,2,hash(x,i)>.5?'#ffd27a':'#4a6aa8')}
  // бар слева
  B(20,20,10,360,'#1a1016');for(let y=40;y<360;y+=26)shelf(21,y,8);
  counter(44,70,16,230,'#3a2418','#8a5a3a');sign(52,64,'БАР','#ffb060',5);
  for(const y of [90,140,190,240,280]){X.lowBox(64,y-3,6,6,'#5a2a4a','#7a3a6a')} // табуреты
  // столики
  for(const [x,y] of [[110,90],[110,170],[110,250],[110,330],[180,330],[250,350]])table(x,y);
  // танцпол и пульт
  E.gfill(240,140,440,300,0);
  booth(296,36,108,26,'#b45aff');sign(350,32,'ПУЛЬТ «БАБУРА»','#c890ff',4);
  for(const x of [286,414]){X.lowBox(x-6,30,12,16,'#0a0a0e','#2a2a30');B(x-3,34,6,6,'#2a2a30');B(x-1,36,2,2,'#5a5a62')} // колонки
  // лифт и лестница
  B(540,150,20,56,'#1a1a22');B(536,150,4,56,'#6a6a72');sign(530,146,'ЛИФТ','#ffffff',4);E.gfill(536,150,560,206,0);
  tiles(470,330,540,380,'#3a3a42','#34343c',6);for(let y=334;y<380;y+=6)B(474,y,62,1,'#1a1a20');sign(505,326,'ЛЕСТНИЦА ВНИЗ','#ffffff',4);
  K.txt(150,392,'КЛУБ «ГРИБЫЧ» · 3 ЭТАЖ','#5a4a6a',5);
  L.dark=.42;L.tint='30,0,50';L.lights.push([350,70,90,.9],[52,180,80,.7],[340,220,110,.7],[505,350,50,.6],[540,178,40,.6]);for(const [x,y] of [[110,90],[110,170],[110,250],[110,330],[180,330],[250,350]])L.lights.push([x,y,26,.6]);
  X.buildNav();
  pl.x=520;pl.y=178;pl.a=Math.PI;pl.ma=pl.a;
  L.armed=false;
  const lx=npc(L,Object.assign({x:420,y:84,top:topHuman},LX)),bm=npc(L,Object.assign({x:32,y:180,a:0,top:topHuman},BM));
  const du=addDu(510,194);Q.lx=lx;
  addCk(110,90);addCk(180,330);
  L.obj=()=>{if(!Q.met)return['Поздороваться с Лёхой у пульта'];if(Q.fight===2)return['Вниз по лестнице: терраса'];if(Q.fight)return['Зачистить верхний этаж: '+K.alive()];
    return[Q.drink?'Шоты от бармена  ✓':'(по желанию) Бар: бармен угощает','Встать за пульт и начать сет'];};
  wrapDraw(L,()=>{ledFloor(240,140,440,300,beatNow(),Q.fight?['#ff2a2a','#7a0a0a','#ff6a3a','#3a0a0a']:['#ff4fd8','#3ef0b0','#b45aff','#ffd23a']);
    if(Q.fight===2&&Math.sin(tm*5)>0){ctx.strokeStyle='rgba(255,210,58,.7)';ctx.strokeRect(470.5,330.5,69,49)}},()=>{
    // дискошар
    const bx=340,by=220;ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<8;i++){const a=tm*.8+i*TAU/8;ctx.fillStyle=Q.fight?'rgba(255,60,60,.12)':'rgba(255,255,255,.1)';ctx.fillRect(bx+Math.cos(a)*90,by+Math.sin(a)*60,3,3)}ctx.restore()});
  L.onUpdate=dt=>{if(hold())return;
    if(Q.fight===1&&!Q.waves.list.length&&K.alive()===0){Q.fight=2;bankDu();lx.hid=false;bm.hid=false;mz7('top');
      say([['lx','Всё? Они всё? Бабура, вы... вы сейчас отыграли лучший сет в истории «Грибыча».'],['bm','Я под стойкой лежал. С бутылкой. На всякий.'],
        ['lx','Слышите снизу? Терраса! Там Артурчик играет. Он в наушниках, он вообще ничего не слышит!'],['du','Если он доигрывает трек, его не остановишь. Я его знаю.'],['m','Тогда идём прикрывать. Лестница — справа внизу.']])}};
  L.its=[
    {x:lx.x,y:lx.y,r:22,label:()=>'Лёха Superlative',cond:()=>!lx.hid,act:()=>{if(Q.met){say([['lx',Q.fight===2?'Терраса — вниз по лестнице. Спасите Артурчика!':'Пульт ваш. Superlative — значит превосходно!']]);return}Q.met=1;
      say([['lx','БАБУРА! Живые! Я знал! Я всем говорил: Бабура приедет, даже если конец света!'],['du','Лёха, ты же писал: на юге зомби нет, всё чисто.'],['lx','Абсолютно чисто! Неделю тихо! Я даже афишу напечатал: «Первая туса после апокалипсиса».'],
        ['m','Народу-то немного.'],['lx','Народ подтянется! Как услышат ваш бас — весь юг сбежится.'],['lx','Бар — за счёт заведения. Пульт — ваш. Я арт-директор, мне можно всё.']],()=>note('Бар слева. Пульт — по центру наверху'))}},
    {x:bm.x+12,y:bm.y,r:16,label:()=>'Бармен',cond:()=>!bm.hid,act:()=>{if(Q.drink){say([['bm',Q.fight?'Я лучше пока под стойкой посижу.':'Ещё? Не-не. Сначала сет, потом шоты.']]);return}
      MG.play('A','pour',{title:'«Грибной шот» от бармена'},()=>{Q.drink=1;PS.syr+=3;sfx('pick');
        say([['bm','О, гориллы! Горилл обслуживаю без очереди.'],['bm','Фирменное: «Грибной шот». Три штуки. За счёт заведения.'],['m','А что в нём?'],['bm','Лучше не знать. Но лечит всё. Даже похмелье, которого ещё нет.'],
          ['du','Будем! За Бабуру!'],['m','За Бабуру!']],()=>note('+3 грибных шота: лечат ('+(touch.on?'кнопка аптечки':'H')+')'))})}},
    {x:350,y:72,r:18,label:()=>Q.fight?'Пульт':'Встать за пульт',cond:()=>Q.met&&!Q.fight,act:()=>djSet(()=>drop())},
    {x:505,y:360,r:22,label:()=>'Лестница вниз: терраса',cond:()=>Q.fight===2,act:()=>{bankDu();lockMove=true;X.go(()=>{lockMove=false;sec7('terrace')})}},
  ];
  function drop(){Q.fight=1;lx.hid=true;bm.hid=true;mz7('fight');sfx('thump',1.6);C1.shake=1.2;
    for(let i=0;i<20;i++)L.fx.push({x:540,y:178,vx:rnd(-90,-20),vy:rnd(-60,60),life:.6,c:'#c8e8ff'});
    say([['lx','ДРО-О-ОП!!! Вот это... стоп. Это не фанаты.'],['du','Они не танцуют. Они ЖРУТ.'],['lx','ЗОМБИ! Из лифта! И с лестницы!'],['m','Бабура, к бою! Дюша, бас!'],['du','У-у-у-А-А-А!']],()=>{
      L.armed=true;PS.wpn='pistol';X.buildNav();
      for(let i=0;i<5;i++)Zp(530,160+i*8,{st:'chase'});for(let i=0;i<4;i++)Zp(500+rnd(-20,20),360,{st:'chase'});Zs(520,190,{st:'chase'});
      Q.waves={t:0,list:[{t:9,fn:()=>{for(let i=0;i<4;i++)Zr(505,370,{st:'chase'});Zm(530,170,{st:'chase'});note('Ещё лезут с лестницы!')}},
        {t:20,fn:()=>{for(let i=0;i<5;i++)Zp(530,160+i*8,{st:'chase'});Zb(500,360,{st:'chase',nm:'ВЫШИБАЛА',nmc:'#c8c8d0'});note('Вышибала! Он и при жизни никого не пускал')}},
        {t:32,fn:()=>{for(let i=0;i<4;i++)Zr(530,170,{st:'chase'});for(let i=0;i<3;i++)Zp(505,370,{st:'chase'});Zm(500,370,{st:'chase'})}}]};note('Зомби! Бей их, Бабура!')})}
  after(.5,()=>{K.zoneBanner('КЛУБ «ГРИБЫЧ» · ВЕРХНИЙ ЭТАЖ','#c890ff');say([['du','Вот он, «Грибыч». Соскучился?'],['m','По этому полу — да. По этим лестницам — нет.'],['du','Лёха у пульта. Пошли здороваться.']])});
}

// ---------- МИНИ-ИГРА: ПУЛЬТ «БАБУРЫ» ----------
// 1) свести темп: держи — пич растёт, отпустил — плывёт вниз. Держи 128 BPM.
// 2) восемь ударов в такт. 3) ДРОП.
function djSet(cb){
  const PX=40,PY=18,PW=240,PH=144,HX=W/2;
  const R=(x,y,w,h,c)=>{u.fillStyle=c;u.fillRect(x,y,w,h)};const T=(s,x,y,c,sz,b,al)=>{uiFont(sz||5,b);u.fillStyle=c;u.textAlign=al||'left';u.fillText(s,x,y);u.textAlign='left'};
  const hit=m=>{if(m.st!==1||m.win)return;const n=m.notes.find(n=>Math.abs(n.y-(PY+105))<9&&!n.h);if(n){n.h=1;m.hit++;m.fb=1;m.fbT=.3;sfx('click');if(m.hit>=m.need){m.win=1;m.okText='ДРО-О-ОП!!!';m.dur=m.t+.01}}else{m.fb=-1;m.fbT=.3;m.hit=Math.max(0,m.hit-1)}};
  MG.open({title:'Пульт «Бабуры»: сет в «Грибыче»',col:'#b45aff',hint:'Сначала держи темп на 128, потом жми в такт.',
    init(m){m.st=0;m.bpm=116+Math.random()*3;m.ok=0;m.notes=[];m.hit=0;m.need=8;m.nt=.6;m.fb=0;m.fbT=0;m.up=0},
    onDown(m){if(m.st===1)hit(m)},onKey(m,c){if(m.st===1&&c==='act')hit(m)},
    solve(m){m.st=1;m.hit=m.need},
    tick(m,dt){if(m.fbT>0)m.fbT-=dt;
      if(m.st===0){m.bpm+=(m.hold?5.5:-2.2)*dt;m.bpm=clamp(m.bpm,110,140);if(Math.abs(m.bpm-128)<.8){m.ok+=dt;if(m.ok>=1.6){m.st=1;sfx('ring',1.2)}}else m.ok=Math.max(0,m.ok-dt*.7);return}
      if(m.win)return;m.nt-=dt;if(m.nt<=0){m.nt=BEAT*(Math.random()<.3?.5:1);m.notes.push({y:PY+18})}for(const n of m.notes)n.y+=70*dt;
      m.notes=m.notes.filter(n=>{if(n.y>PY+118&&!n.h){m.fb=-1;m.fbT=.4;return false}return n.y<PY+130&&!n.h})},
    draw(m){R(PX,PY+12,PW,PH-12,'#0e0a18');
      // две вертушки
      for(const [cx,sp] of [[PX+34,m.st?BPM:m.bpm],[PX+PW-34,BPM]]){const cy=PY+50;u.fillStyle='#1a1a22';u.beginPath();u.arc(cx,cy,24,0,TAU);u.fill();u.fillStyle='#0a0a0e';u.beginPath();u.arc(cx,cy,20,0,TAU);u.fill();
        const a=tm*sp/30;u.strokeStyle='#3a3a44';u.lineWidth=1;for(let r=8;r<20;r+=3){u.beginPath();u.arc(cx,cy,r,a,a+2);u.stroke()}u.fillStyle=cx<HX?'#b45aff':'#3a3a44';u.beginPath();u.arc(cx,cy,5,0,TAU);u.fill();
        R(cx+Math.cos(a)*14-1,cy+Math.sin(a)*14-1,2,2,'#fff');T(sp.toFixed(1)+' BPM',cx,cy+34,cx<HX?(Math.abs(sp-128)<.8?'#3ef0b0':'#ffd23a'):'#9a92b0',4.6,true,'center')}
      if(m.st===0){const y=PY+104,x0=HX-50;R(x0,y,100,6,'#2a2040');const tz=x0+(128-110)/30*100;R(tz-3,y-2,6,10,'rgba(62,240,176,.35)');R(x0+(m.bpm-110)/30*100-1,y-3,2,12,'#ffffff');
        R(x0,y+10,100*clamp(m.ok/1.6,0,1),3,'#3ef0b0');T('СВЕДЕНИЕ: подгони левую вертушку под 128',HX,PY+24,'#c8c0e0',4.6,true,'center');
        m.foot=touch.on?'Держи палец — темп растёт. Отпусти — падает':'Держи E (или кнопку мыши) — темп растёт. Отпусти — падает'}
      else{R(HX-14,PY+16,28,110,'#1a1428');R(HX-16,PY+104,32,2,'#ffffff');for(const n of m.notes)R(HX-10,n.y-3,20,6,'#b45aff');
        if(m.fbT>0)T(m.fb>0?'В ТАКТ!':'мимо',HX,PY+96,m.fb>0?'#3ef0b0':'#ff5a5a',5,true,'center');
        T('ТОЛПА ЗАВОДИТСЯ: '+m.hit+' / '+m.need,HX,PY+134,'#c8c0e0',5,true,'center');
        const k=m.hit/m.need;for(let i=0;i<12;i++){const h=4+Math.abs(Math.sin(tm*8+i))*14*k;R(PX+80+i*6+(i>5?40:0)-(i>5?40:0),PY+128-h,4,h,['#ff4fd8','#3ef0b0','#ffd23a'][i%3])}
        m.foot=touch.on?'Касайся, когда нота на белой линии':'Жми E, когда нота на белой линии'}}},cb);
}

// ---------- ТЕРРАСА: второй танцпол, Артурчик Kirsanax ----------
const TB={x:566,y:186}; // пульт Артурчика
function lvTerrace(){
  const L=E.mkLevel('terrace7',640,380);
  // ночное небо и огни юга вокруг
  B(0,0,640,380,'#0a0a1c');for(let i=0;i<160;i++)B(hash(i,1)*640,hash(1,i)*380,1,1,hash(i,i)>.7?'#ffd27a':'#3a4a8a');
  K.floor(20,20,620,360,'wood');
  for(let x=20;x<620;x+=4){B(x,18,3,3,'#8a8a92');B(x,358,3,3,'#8a8a92')}for(let y=20;y<360;y+=4){B(18,y,3,3,'#8a8a92');B(618,y,3,3,'#8a8a92')}
  E.gfill(200,120,440,280,0);
  // растения и диваны
  for(const [x,y] of [[60,60],[60,300],[200,50],[440,50],[200,320],[440,320],[580,60],[580,320]])K.tree(x,y,10,'#2a6a3a');
  for(const [x,y,w,h] of [[30,130,14,100],[260,330,120,14]]){X.lowBox(x,y,w,h,'#4a2a5a','#6a3a7a')}
  booth(TB.x-8,TB.y-36,16,72,'#3ef0b0');sign(TB.x,TB.y-42,'ARTURCHIK KIRSANAX','#3ef0b0',4);
  X.lowBox(548,118,12,14,'#0a0a0e','#2a2a30');X.lowBox(548,240,12,14,'#0a0a0e','#2a2a30');
  // лестница вниз — слева внизу
  tiles(24,312,84,356,'#3a3a42','#34343c',6);sign(54,308,'В ПОДВАЛ','#ffffff',4);
  sign(320,374,'ТЕРРАСА · ВТОРОЙ ТАНЦПОЛ','#3a6a5a',5);
  L.dark=.4;L.tint='10,0,40';for(let x=40;x<620;x+=60)L.lights.push([x,24,40,.7],[x,356,40,.7]);L.lights.push([TB.x,TB.y,70,.9],[320,200,120,.6]);
  X.buildNav();
  pl.x=60;pl.y=40;pl.a=Math.PI/2;pl.ma=pl.a;addDu(46,30);
  const ak=npc(L,Object.assign({x:TB.x+30,y:TB.y,a:Math.PI,top:topHuman},AK));
  addCk(320,40);addCk(60,250);addCk(470,330);
  Q.tb=100;Q.track=0;Q.dur=70;Q.state=0;Q.spawnT=1;Q.dropN=0;
  // стартовые танцующие зомби
  for(let i=0;i<10;i++)Zp(rnd(220,420),rnd(140,260),{st:'idle'});Zr(300,200);Zr(360,180);
  L.obj=()=>Q.state===0?['Защитить Артурчика, пока он доигрывает сет: '+Math.floor(Q.track/Q.dur*100)+'%','Пульт: '+Math.max(0,Math.ceil(Q.tb))+' / 100']:Q.state===1?['Добить оставшихся: '+K.alive()]:['Вниз в подвал — лестница слева внизу'];
  K.hud=()=>{if(Q.state!==0)return;const y=58;panel(4,y,108,19,.74);u.fillStyle='#3ef0b0';u.fillRect(4,y,2,19);uiFont(4.2,true);u.fillStyle='#3ef0b0';u.fillText('СЕТ',9,y+6.5);X.hudBar(34,y+3.5,74,4,Q.track/Q.dur,'#3ef0b0');
    u.fillStyle='#ffb060';u.fillText('ПУЛЬТ',9,y+15);X.hudBar(34,y+12,74,4,Q.tb/100,Q.tb<35?'#ff3a3a':'#ffb060')};
  wrapDraw(L,()=>{const b=beatNow();ledFloor(200,120,440,280,b,['#3ef0b0','#2a8aff','#b45aff','#ffffff']);
    if(Q.dropT>0){ctx.fillStyle=`rgba(62,240,176,${Q.dropT*.3})`;ctx.fillRect(200,120,240,160)}
    if(Q.state===2&&Math.sin(tm*5)>0){ctx.strokeStyle='rgba(255,210,58,.7)';ctx.strokeRect(24.5,312.5,59,43)}},()=>{
    // гирлянды
    for(let x=24;x<620;x+=12){const on=((x/12|0)+(beatNow()|0))%3===0;F(x,22+Math.sin(x*.1)*2,2,2,on?'#ffd27a':'#6a5a3a');F(x,354+Math.sin(x*.1)*2,2,2,on?'#ffd27a':'#6a5a3a')}
    // лазеры Артурчика в небо
    if(Q.state===0){ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const a=Math.PI+Math.sin(tm*1.3+i*2)*.9;ctx.strokeStyle=['rgba(62,240,176,.35)','rgba(180,90,255,.35)','rgba(255,79,216,.35)'][i];ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(TB.x,TB.y);ctx.lineTo(TB.x+Math.cos(a)*300,TB.y+Math.sin(a)*300);ctx.stroke()}ctx.restore()}
    if(Q.state===0&&Q.tbHit>0){F(TB.x-8,TB.y-38,16,2,'#ff3a3a')}
    for(const z of L.zs)if(!z.dead&&z.ai==='booth'&&Math.sin(tm*8)>0)F(z.x-1,z.y-12,2,3,'#ffb060')});
  L.onTick7=dt=>{if(hold())return;if(Q.dropT>0)Q.dropT-=dt;if(Q.tbHit>0)Q.tbHit-=dt;
    if(Q.state===0){
      if(!Q.go)return;
      Q.track+=dt;
      // каждые 8 долей — дроп: тусовщики на танцполе залипают
      const n=Math.floor(beatNow()/8);if(n!==Q.dropN){Q.dropN=n;Q.dropT=.8;let k=0;for(const z of L.zs)if(!z.dead&&z.type!=='brute'&&z.x>200&&z.x<440&&z.y>120&&z.y<280){z.stun=Math.max(z.stun,1.4);k++}if(k){X.floatT(320,116,'ДРОП! ЗАЛИПЛИ: '+k,'#3ef0b0');sfx('thump',.6)}}
      // волны: часть бежит к пульту
      Q.spawnT-=dt;if(Q.spawnT<=0&&L.zs.length<30){Q.spawnT=rnd(2.6,3.8)-Q.track/Q.dur*1.1;const sp=[[320,40],[598,48],[598,332],[320,338],[58,262]][r4(5)];
        const n=2+r4(3);for(let i=0;i<n;i++){const z=(Math.random()<.35?Zr:Zp)(sp[0]+rnd(-8,8),sp[1]+rnd(-8,8),{st:'chase'});if(Math.random()<.45){z.ai='booth';z.stun=99}}
        if(Math.random()<.18)Zm(sp[0],sp[1],{st:'chase'});if(Q.track>35&&!Q.big){Q.big=1;Zb(594,328,{st:'chase',ai:'booth',stun:99,nm:'ВЫШИБАЛА',nmc:'#c8c8d0'});note('Вышибала прёт к пульту!')}}
      // идущие к пульту
      for(const z of L.zs){if(z.dead||z.ai!=='booth')continue;const dp=D2(z.x,z.y,pl.x,pl.y),dq=Q.du?D2(z.x,z.y,Q.du.x,Q.du.y):999;
        if(dp<40||dq<26||z.hp<z.max){z.ai=null;z.stun=0;z.st='chase';continue}z.stun=99;
        const d=D2(z.x,z.y,TB.x-12,TB.y);if(d>z.r+10){if(!Q.bnd)Q.bnd=E.flowTo(TB.x-14,TB.y);const a=(d<40&&E.los(z.x,z.y,TB.x-12,TB.y))?Math.atan2(TB.y-z.y,TB.x-12-z.x):(E.navDirTo(z,Q.bnd)??Math.atan2(TB.y-z.y,TB.x-12-z.x));K.mv(z,Math.cos(a)*z.sp*dt,Math.sin(a)*z.sp*dt,z.r);z.a=a;z.ph+=dt*z.sp*.3}
        else{z.bt=(z.bt||0)-dt;if(z.bt<=0){z.bt=.9;Q.tb-=z.type==='brute'?14:6;Q.tbHit=.2;sfx('hit',.5);X.floatT(TB.x-10,TB.y-20,'ПУЛЬТ!','#ffb060');
          if(!Q.warn){Q.warn=1;say([['ak','Э-э! Кто трогает мой пульт?! У меня тут переход на тридцать два такта!']])}}}}
      if(Q.tb<=0){Q.tb=60;X.loseLife();note('Пульт сломали — Артурчик перезапускает трек')}
      if(Q.track>=Q.dur){Q.state=1;sfx('ring',1);for(const z of L.zs)if(z.ai==='booth'){z.ai=null;z.stun=0;z.st='chase'}
        say([['ak','...и-и-и финальный дроп! Спасибо, «Грибыч»!'],['du','Он доиграл. Посреди зомби-апокалипсиса. Уважаю.'],['m','Добиваем остальных.']])}}
    else if(Q.state===1&&K.alive()===0){Q.state=2;bankDu();
      say([['ak','Ребята, вот это вайб. А почему вы в крови? И почему вы гориллы?'],['m','Мы — Бабура. Артурчик, ты зомби вообще видел?'],['ak','Какие зомби? Я в наушниках с восьми вечера. Думал, публика сегодня вялая.'],
        ['ak','Но снизу, из подвала, кто-то шпарит кислоту. 303-я. Жёстко. Это не мой сет.'],['du','HRD 303. Он играл в подвале каждую пятницу. Здоровый такой. С лазерами.'],['m','Значит, главный — внизу. Артурчик, сиди тут. Пульт береги.']])}};
  L.its=[{x:ak.x,y:ak.y,r:20,label:()=>'Артурчик Kirsanax',act:()=>say(Q.state===0?[['ak','Не сейчас! Тут дроп через шестнадцать тактов!']]:[['ak','Буду играть до утра. Если что — я тут. С пультом.']])},
    {x:54,y:334,r:22,label:()=>'Лестница в подвал',cond:()=>Q.state===2,act:()=>{bankDu();K.hud=null;lockMove=true;X.go(()=>{lockMove=false;sec7('cellar')})}}];
  after(.5,()=>{K.zoneBanner('ТЕРРАСА · ВТОРОЙ ТАНЦПОЛ','#3ef0b0');
    say([['du','Терраса. Открытое небо, техно, и...'],['m','...и полный танцпол мертвецов. Они танцуют?'],['ak','ПРИВЕТ, «ГРИБЫЧ»! Ещё полтора трека и закругляюсь!'],['du','Он нас не слышит. Микроб, держи их подальше от пульта, пока он не доиграет.'],
      ['m','На каждый дроп они залипают. Бьём на дропе!']],()=>{Q.go=1;L.armed=true;for(const z of L.zs)z.st='chase';note('Защити Артурчика, пока идёт трек')})});
}

// ---------- ПОДВАЛ: бары и коридоры ----------
function lvCellar(){
  const L=E.mkLevel('cellar7',740,420);B(0,0,740,420,'#0a0406');
  const R=(x0,y0,x1,y1)=>tiles(x0,y0,x1,y1,'#1a0a0e','#140608',8);
  R(20,190,220,230);R(220,110,400,300);R(400,190,500,230);R(500,40,540,390);R(540,40,700,140);R(540,280,700,390);R(540,190,720,230);
  // бар «Споры»
  counter(236,124,148,14,'#2a0a0e','#8a1a22');shelf(236,114,148);sign(310,108,'БАР «СПОРЫ»','#ff3a3a',5);
  for(const [x,y] of [[260,200],[340,200],[260,270],[340,270]]){X.lowBox(x-7,y-7,14,14,'#1a0a0e','#3a1418');B(x-1,y-1,2,2,'#ff3a3a')}
  // гардероб
  counter(560,60,120,10,'#2a2a30','#4a4a52');for(let x=564;x<676;x+=6)B(x,46,4,12,['#2a2a3a','#4a2a2a','#2a3a2a','#3a3a3a'][(x>>2)%4]);sign(620,40,'ГАРДЕРОБ','#ffffff',4);
  // бар «Мицелий»
  counter(560,368,120,12,'#2a0a0e','#8a1a22');shelf(560,384,120);sign(620,364,'БАР «МИЦЕЛИЙ»','#ff3a3a',5);
  for(const [x,y] of [[580,310],[650,310]]){X.lowBox(x-7,y-7,14,14,'#1a0a0e','#3a1418')}
  // пасхалка: диванчики у стены «Мицелия», на них спит Столыпин (напился пива)
  X.lowBox(684,288,14,64,'#3a1a3a','#5a2a5a');for(let y=292;y<350;y+=16)B(685,y,12,1,'#2a0e2a');
  for(const [x,y] of [[676,296],[672,340],[680,356],[664,322]]){B(x-1,y-3,3,5,'#d8c040');B(x-1,y-3,3,1,'#c8c8c8')}
  // дверь на главный танцпол
  B(712,186,8,48,'#3a0a0e');B(713,190,6,40,'#6a1018');sign(690,182,'MAIN','#ff3a3a',5);E.gfill(712,186,720,234,1);
  sign(120,186,'ПОДВАЛ','#6a1a22',6);
  L.dark=.62;L.tint='40,0,0';for(const [x,y,r] of [[60,210,50],[160,210,50],[310,200,110],[450,210,50],[520,100,50],[520,320,50],[620,90,70],[620,330,70],[620,210,60]])L.lights.push([x,y,r,.85]);
  X.buildNav();
  pl.x=30;pl.y=210;pl.a=0;pl.ma=0;addDu(20,200);
  addCk(300,270);addCk(620,100);addCk(620,330);
  for(let i=0;i<4;i++)Zp(rnd(80,200),rnd(196,226));for(let i=0;i<8;i++)Zp(rnd(240,380),rnd(150,290));Zm(280,150);Zm(350,150);Zs(310,250);
  for(let i=0;i<4;i++)Zr(520,rnd(60,360));for(let i=0;i<5;i++)Zp(rnd(560,690),rnd(80,130));for(let i=0;i<5;i++)Zp(rnd(560,690),rnd(290,350));Zm(620,350);Zs(600,100);
  Zb(690,210,{nm:'ВЫШИБАЛА MAIN',nmc:'#c8c8d0'});
  L.obj=()=>[K.alive()?'Зачистить подвал: '+K.alive():'Дверь главного танцпола — справа',C7.flags.club?'Рейверские шмотки найдены  ✓':'(по желанию) Обыскать гардероб'].concat(C7.flags.stol?['Столыпин нашёлся (спит)  ✓']:[]);
  wrapDraw(L,()=>{if(!K.alive()&&Math.sin(tm*5)>0){ctx.strokeStyle='rgba(255,210,58,.8)';ctx.strokeRect(708.5,184.5,13,51)}},()=>{
    // красный стробоскоп в барах
    if(Math.floor(tm*8)%5===0){ctx.fillStyle='rgba(255,30,40,.06)';ctx.fillRect(220,110,180,190);ctx.fillRect(540,280,160,110)}
    // бас из-за двери
    const k=(beatNow()%1)<.2;if(k){ctx.strokeStyle='rgba(255,40,40,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(716,210,20+(beatNow()%1)*80,0,TAU);ctx.stroke()}});
  Q.trig.push({x:240,y:210,r:40,fn:()=>say([['du','Бар «Споры». Тут я когда-то потерял телефон. И ботинок.'],['m','Сегодня теряем только зомби.']])});
  Q.trig.push({x:520,y:210,r:30,fn:()=>{sfx('groan',1.4);say([['m','Слышишь? Из-за двери — кислота. 303-я.'],['du','Это он. Сначала зачистим гардероб и «Мицелий», а то в спину зайдут.']])}});
  L.onUpdate=()=>K.trigs();
  // Столыпин спит на диванчике (пасхалка)
  const cvSt7=mk(24);cvSt7.getContext('2d',{willReadFrequently:true});const st7={x:691,y:318};
  L.npcs.push({draw(){HQ.top.topStolypin(cvSt7.getContext('2d'),0,true);spr(cvSt7,st7.x,st7.y,Math.PI/2+.15);
    if(!C7.flags.stol||Math.sin(tm*2)>0){const k=(tm*.8)%1;ctx.fillStyle=`rgba(200,220,255,${1-k})`;ctx.font='bold 5px monospace';ctx.fillText('z',st7.x-6-k*4,st7.y-8-k*10);ctx.fillText('Z',st7.x-10-k*6,st7.y-14-k*12)}}});
  Q.trig.push({x:620,y:320,r:50,fn:()=>{sfx('groan',.3);say([['du','Слышишь? Кто-то храпит. Громче баса.'],['m','На диванчике у стены... это что, СТОЛЫПИН?!']])}});
  L.its_st={x:676,y:318,r:16,label:()=>'Столыпин спит на диванчике',act:()=>{if(C7.flags.stol){say([['st','Хр-р-р... *пш-ш-ш*... хр-р-р...']]);return}C7.flags.stol=true;
    say([['m','Столыпин! Ты как сюда попал?!'],['st','М-м... Микроб? А я... на тусу пришёл. Неделю назад. Сказали — первая после апокалипсиса.'],['du','Неделю назад клуб был закрыт.'],
      ['st','Ну да. Никого не было. Зато пиво было. Целый склад. Я прилёг на диванчик... на минутку.'],['m','Вокруг тебя полный подвал зомби!'],['st','А, эти. Они меня не трогали. Я, говорят, пахну как свой.'],
      ['du','Он проспал зомби-апокалипсис в зомби-клубе. Уважаю.'],['st','Разбудите, как Бабура заиграет... хр-р-р...'],['m','...Ладно. Пусть спит. Заберём на обратном пути.']],()=>{PS.syr++;X.floatT(st7.x,st7.y-12,'+пиво от Столыпина','#ffd23a');note('Столыпин отдал пиво из заначки: +1 лечилка')})}};
  // находка: забытая сумка в гардеробе — рейверские шмотки (скин 'club')
  const bag={x:676,y:76};L.npcs.push({draw(){if(C7.flags.club)return;F(bag.x-5,bag.y-4,10,7,'#1a1a1a');F(bag.x-4,bag.y-3,8,1,'#ff4fd8');F(bag.x-2,bag.y-6,4,2,'#3a3a3a');F(bag.x+1,bag.y-1,3,2,'#3ef0b0');
    ctx.strokeStyle=`rgba(255,79,216,${.3+.3*Math.sin(tm*5)})`;ctx.strokeRect(bag.x-7.5,bag.y-8.5,15,15)}});
  L.its=[{x:bag.x,y:bag.y,r:16,label:()=>'Гардероб: чья-то сумка',cond:()=>!C7.flags.club,act:()=>MG.play('A','rummage',{title:'Сумка с номерком 303'},()=>{C7.flags.club=true;sfx('pick');try{if(window.UP&&UP.grantSkin)UP.grantSkin('club')}catch(e){}
      say([['m','Номерок 303. Хозяин уже не вернётся.'],['du','Неоновые штаны, сетчатая майка, светящиеся очки... и розовое платье с блёстками.'],['m','Это Шмакодявке. А это — мне. Переоденемся дома у зеркала.']])})},
    L.its_st,
    {x:704,y:210,r:22,label:()=>'Дверь: главный танцпол',act:()=>{if(K.alive()){say([['du','Сначала добьём всех. Не хочу, чтобы гардеробщица-зомби вцепилась мне в мех.']]);return}bankDu();lockMove=true;X.go(()=>{lockMove=false;sec7('main')})}}];
  after(.5,()=>{K.zoneBanner('ПОДВАЛ · БАРЫ И КОРИДОРЫ','#ff3a3a');say([['du','Чёрно-красный. Как я помню. Только пахнет хуже.'],['m','Держись рядом. Тут темно.']])});
}

// ---------- ГЛАВНЫЙ ТАНЦПОЛ: HRD 303 ----------
const ROOM={x0:20,y0:20,x1:460,y1:340};
function lvMain(){
  const L=E.mkLevel('main7',480,360);B(0,0,480,360,'#080204');
  tiles(20,20,460,340,'#160608','#1e080a',16);
  X.lowBox(150,20,180,40,'#120a0e','#2a1418');booth(190,26,100,20,'#ff2a2a');sign(240,66,'HRD 303','#ff3a3a',6);
  for(const x of [140,340])X.lowBox(x-8,22,16,22,'#0a0a0e','#2a2a30');
  // колонны — укрытие от лазеров
  Q.pil=[[110,150],[370,150],[110,250],[370,250]];for(const [x,y] of Q.pil){B(x-9,y-9,18,18,'#2a0a0e');B(x-9,y-9,18,2,'#4a1418');E.gfill(x-9,y-9,x+9,y+9,1)}
  L.dark=.55;L.tint='40,0,0';L.lights.push([240,60,120,.9],[240,200,160,.6]);for(const [x,y] of Q.pil)L.lights.push([x,y+16,30,.6]);
  X.buildNav();
  pl.x=240;pl.y=322;pl.a=-Math.PI/2;pl.ma=pl.a;addDu(226,330);
  addCk(40,40);addCk(440,40);addCk(40,320);addCk(440,320);
  Q.lz=[];Q.phase=0;
  L.obj=()=>Q.won?['HRD 303 повержен']:Q.phase?['Победить HRD 303'+(Q.phase===2?' · лазерная сетка: ищи просвет':Q.phase===3?' · прячься за колонны от луча 303':'')]:['Подойти к сцене'];
  wrapDraw(L,()=>{ledFloor(60,90,420,320,beatNow(),['#ff2a2a','#5a0a0a','#ff6a3a','#2a0606'])},()=>{drawLz();
    if(Q.boss&&Q.boss.hot>0){ctx.fillStyle=`rgba(255,255,255,${.25+.2*Math.sin(tm*20)})`;ctx.font='bold 5px monospace';ctx.textAlign='center';ctx.fillText('ПЕРЕГРЕВ!',Q.boss.x,Q.boss.y-24);ctx.textAlign='left'}});
  Q.trig.push({x:240,y:200,r:70,fn:()=>{lockMove=true;sfx('groan',2.4);C1.shake=1;
    say([['hr','ДОБРО ПОЖАЛОВАТЬ НА МОЙ СЕТ.'],['hr','ДРЕСС-КОД — МЁРТВЫЙ. ВЫ НЕ ПРОХОДИТЕ.'],['du','HRD 303... Он же почти как человек. Только зелёный. И огромный.'],['hr','Я КАЧАЛСЯ ПОД КИСЛОТУ ДЕСЯТЬ ЛЕТ. Я — АСИД. Я — ЛАЗЕР.'],
      ['m','А мы — Бабура. И это наш клуб сегодня.'],['hr','ТОГДА — БАТТЛ. МОИ ЛАЗЕРЫ ПРОТИВ ВАШЕГО БАСА.']],()=>{lockMove=false;mz7('boss');Q.phase=1;
      const b=E.addZ('boss',240,90,{v:750,hp:3200,max:3200,sp:30,r:10,st:'chase',nm:'HRD 303',nmc:'#ff3a3a',ai:'hrd',stun:99,at:2.5,mt:1.2,sm:14,hot:0});Q.boss=b;K.zoneBanner('HRD 303','#ff3a3a')})}});
  L.onTick7=dt=>{K.trigs();if(hold())return;lzTick(dt);hrd(dt)};
  after(.5,()=>{K.zoneBanner('ГЛАВНЫЙ ТАНЦПОЛ','#ff3a3a');say([['du','Главный танцпол. Тут я впервые сыграл как Бабура.'],['m','Сцена пустая... но пульт работает. Кто-то играет.']])});
}
// лазеры: {x,y,a,len,w,warn,life,dmg,rot,track,col,z}
function addLz(o){Q.lz.push(Object.assign({len:600,w:3,warn:.9,life:2,dmg:18,rot:0,col:'255,40,40'},o))}
function beamLen(x,y,a,max){for(let d=6;d<max;d+=4){const v=E.gAt(x+Math.cos(a)*d,y+Math.sin(a)*d);if(v===1)return d}return max}
function lzTick(dt){
  for(const b of Q.lz){if(b.z){b.x=b.z.x;b.y=b.z.y}
    if(b.track&&b.warn>.25){const ta=Math.atan2(pl.y-b.y,pl.x-b.x);b.a+=angDiff(ta,b.a)*Math.min(1,dt*3.2)}
    if(b.warn>0){b.warn-=dt;if(b.warn<=0)sfx(b.track?'power':'shot',b.track?1.4:.5);continue}
    b.a+=b.rot*dt;b.life-=dt;b.L=beamLen(b.x,b.y,b.a,b.len);
    const dx=Math.cos(b.a),dy=Math.sin(b.a),px=pl.x-b.x,py=pl.y-b.y,t=clamp(px*dx+py*dy,0,b.L),qx=b.x+dx*t,qy=b.y+dy*t;
    if(D2(qx,qy,pl.x,pl.y)<b.w/2+3)X.hurtPlayer(b.dmg);
    if(b.track&&Q.du&&!Q.du.hit){const ex=Q.du.x-b.x,ey=Q.du.y-b.y,s=clamp(ex*dx+ey*dy,0,b.L);if(D2(b.x+dx*s,b.y+dy*s,Q.du.x,Q.du.y)<b.w/2+3){Q.du.hit=1;X.floatT(Q.du.x,Q.du.y-12,'ДЮША: «АЙ! МЕХ!»','#c8c0ff')}}
    if(Math.random()<.4)E.L.fx.push({x:b.x+dx*b.L,y:b.y+dy*b.L,vx:rnd(-20,20),vy:rnd(-20,20),life:.2,c:'#ff8a8a'})}
  Q.lz=Q.lz.filter(b=>b.warn>0||b.life>0);
  if(Q.du&&Q.du.hit&&!Q.lz.some(b=>b.track))Q.du.hit=0;
}
function drawLz(){
  for(const b of Q.lz){const L0=b.L||beamLen(b.x,b.y,b.a,b.len),ex=b.x+Math.cos(b.a)*L0,ey=b.y+Math.sin(b.a)*L0;
    if(b.warn>0){ctx.strokeStyle=`rgba(${b.col},${.25+.25*Math.sin(tm*30)})`;ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([])}
    else{ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(${b.col},.55)`;ctx.lineWidth=b.w+2;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.strokeStyle='rgba(255,230,230,.9)';ctx.lineWidth=Math.max(1,b.w/3);ctx.stroke();ctx.restore()}}
}
function hrd(dt){
  const L=E.L,z=Q.boss;if(!z)return;
  if(!z.dead){
    z.stun=99;const d=D2(z.x,z.y,pl.x,pl.y),ta=Math.atan2(pl.y-z.y,pl.x-z.x),k=z.hp/z.max;
    if(Q.phase===1&&k<.66){Q.phase=2;z.hot=1.5;sfx('power',1.2);C1.shake=.8;X.floatT(z.x,z.y-24,'ЛАЗЕРНАЯ СЕТКА!','#ff3a3a');
      say([['hr','РАЗОГРЕВ ОКОНЧЕН. ВКЛЮЧАЮ СЕТКУ.'],['du','Он весь танцпол расчертил! Ищи просвет!']])}
    if(Q.phase===2&&k<.33){Q.phase=3;z.hot=1.5;sfx('power',1.6);C1.shake=1.1;X.floatT(z.x,z.y-24,'ТРИ-НОЛЬ-ТРИ!','#ff3a3a');
      say([['hr','303! 303! КИСЛОТА В КРОВИ!'],['m','Луч наводится прямо на меня!'],['du','За колонны! Он сквозь бетон не пробивает!']])}
    if(z.hot>0){z.hot-=dt;z.a+=dt*2;return} // перегрев: стоит, дымится — бей
    if(Math.random()<dt*8)L.fx.push({x:z.x+rnd(-4,4),y:z.y-6,vx:rnd(-6,6),vy:rnd(-20,-8),life:.4,c:'#ff4040'});
    // идёт к игроку, держит дистанцию на лазерах
    const busy=Q.lz.some(b=>b.z===z&&b.warn<=0&&!b.track);
    if(d>40&&!busy){const dir=E.los(z.x,z.y,pl.x,pl.y)?ta:K.navDir(z);if(dir!=null){K.mv(z,Math.cos(dir)*z.sp*(Q.phase===3?1.2:1)*dt,Math.sin(dir)*z.sp*dt,z.r-2);z.ph+=dt*6}}
    z.a+=angDiff(ta,z.a)*Math.min(1,dt*6);
    // кач-удар вблизи (с предупреждением)
    z.mt-=dt;if(d<44&&z.mt<=0){z.mt=1.6;K.tele(pl.x,pl.y,16,.55,24,'saw');X.floatT(z.x,z.y-22,'КАЧ-УДАР!','#ffd23a')}
    // атаки лазерами
    z.at-=dt;if(z.at<=0){
      const p=Q.phase;
      if(p===1||(p===2&&Math.random()<.4)){const n=p===1?4:6,s=Math.random()<.5?1:-1;for(let i=0;i<n;i++)addLz({z,x:z.x,y:z.y,a:i/n*TAU+rnd(0,1),rot:s*(p===1?.9:1.2),warn:.9,life:3,w:3,dmg:16});X.floatT(z.x,z.y-22,'ЛАЗЕРНЫЙ ВЕЕР!','#ff3a3a');z.at=p===1?5.2:4.6;z.next='hot'}
      else if(p===2){const hz=Math.random()<.5,gap=r4(5);for(let i=0;i<6;i++){if(i===gap)continue;if(hz){const y=ROOM.y0+30+i*50;addLz({x:ROOM.x0,y,a:0,len:440,warn:1.2,life:.6,w:6,dmg:24,col:'255,60,200'})}else{const x=ROOM.x0+30+i*75;addLz({x,y:ROOM.y0,a:Math.PI/2,len:320,warn:1.2,life:.6,w:6,dmg:24,col:'255,60,200'})}}
        X.floatT(z.x,z.y-22,'СЕТКА!','#ff5ac8');z.at=3.6}
      else{addLz({z,x:z.x,y:z.y,a:ta,track:1,warn:1.5,life:.7,w:9,dmg:34,col:'255,20,20'});if(Math.random()<.5){const s=Math.random()<.5?1:-1;for(let i=0;i<3;i++)addLz({z,x:z.x,y:z.y,a:i/3*TAU,rot:s*1.4,warn:1,life:2.4,w:3,dmg:16})}
        X.floatT(z.x,z.y-22,'ЛУЧ 303!','#ff2020');z.at=3.4}
      sfx('power',.6)}
    // после веера — перегрев (окно для урона)
    if(z.next==='hot'&&!Q.lz.some(b=>b.z===z&&!b.track)){z.next=null;z.hot=1.8;sfx('hiss')}
    // свита: зомби-рейверы
    if(Q.phase>=2){z.sm-=dt;if(z.sm<=0){z.sm=13;for(let i=0;i<3;i++)Zr(rnd(40,440),330,{st:'chase'});Zp(40,40,{st:'chase'});Zp(440,40,{st:'chase'});X.floatT(z.x,z.y-22,'ФАНАТЫ!','#ff9ad8')}}
  }
  if(Q.phase>0&&!Q.won&&z.dead){Q.won=1;bankDu();Q.lz.length=0;K.ghostAll('#ff8a8a');sfx('power',1);C1.shake=1.4;
    after(1.2,()=>say([['hr','Мой... се-е-ет... без... дро-о-опа...'],['du','Готов. Пульт обесточен.'],['m','Тишина. Слышишь? Сверху Артурчик всё ещё играет.'],['du','Бабура отыграла. Пошли к Лёхе.']],()=>{
      lockMove=true;X.go(()=>{lockMove=false;playC7(CUT_END7,endCh7,'end')})}))}
}

// ================= КАТ-СЦЕНЫ =================
// гориллы и люди сбоку
function sideGor(x,y,t,mode,dark,o){o=o||{};const F0=dark?'#1e1c24':'#6a3a9a',FD=dark?'#0e0d12':'#4a2470',SK=dark?'#4a4048':'#3e3044';const s=mode==='walk'?Math.round(Math.sin(t*10)*1.5):0;
  F(x-4+s,y-10,4,8,FD);F(x+1-s,y-10,4,8,FD);F(x-5+s,y-3,5,3,SK);F(x-s,y-3,5,3,SK);
  const ty=y-10;F(x-7,ty-14,14,15,F0);F(x-6,ty-14,3,15,FD);F(x-2,ty-10,7,8,shade(F0,1.15));
  if(o.bag){F(x+5,ty-10,8,10,'#1a1a1a');F(x+6,ty-9,6,1,'#5a5a62')}else if(o.uzi){F(x+5,ty-10,3,8,F0);F(x+7,ty-12,7,3,'#ff5ac8');F(x+8,ty-9,1,3,'#c8309a')}else F(x+5,ty-12,3,13,F0);
  const hy=ty-23;F(x-5,hy,11,10,F0);F(x-6,hy+3,2,4,FD);F(x,hy+3,6,6,SK);F(x+2,hy+4,2,1,'#1a1418');F(x+4,hy+7,2,1,'#2a2028');F(x-4,hy-1,9,2,FD);
  if(!dark){F(x+1,hy+3,5,2,'#ecb73c')}if(o.head===false){F(x-5,hy,11,10,'rgba(0,0,0,0)')}}
function sideHum(x,y,t,mode,o){const s=mode==='walk'?Math.round(Math.sin(t*10)*1.5):0,h=o.h||8;F(x-3+s,y-h-2,3,h,o.leg||'#1a1a20');F(x-s,y-h-2,3,h,o.leg||'#1a1a20');F(x-4+s,y-3,5,3,'#0e0e12');F(x-1-s,y-3,5,3,'#0e0e12');
  const ty=y-h-2,bw=o.fat?14:8;F(x-bw/2,ty-11,bw,11,o.c);if(o.apron)F(x-bw/2+2,ty-8,bw-4,8,'#8a5a3a');F(x+bw/2-2,ty-10,2,8,o.sk);
  const hy=ty-18;F(x-3,hy,7,7,o.sk);if(o.hair)o.hair(x,hy);F(x+2,hy+3,1,1,'#2a1e18');if(o.beard)F(x-2,hy+4,7,4,o.beard)}
const SIDE={lx:{c:'#141418',sk:'#f2cab4',hair:(x,y)=>{F(x-4,y-3,10,4,'#9a7a52');F(x-5,y,3,5,'#9a7a52');F(x-2,y-4,2,1,'#c0a070');F(x+3,y-4,2,1,'#c0a070')}},
  pw:{c:'#141416',sk:'#f0d4c4',h:10,hair:(x,y)=>{F(x-4,y-3,10,5,'#6a5646');F(x-5,y,3,8,'#6a5646');F(x+4,y,2,4,'#6a5646');F(x+2,y+3,1,1,'#ff2020');F(x-1,y+7,5,1,'#d8d8e0')}},
  bm:{c:'#2a2a30',sk:'#e8b494',fat:1,apron:1,beard:'#4a3020',hair:(x,y)=>{F(x-4,y-2,9,3,'#c82a2a')}},
  ak:{c:'#3a2a6a',sk:'#deac86',fat:1,h:6,beard:'rgba(30,20,14,.6)',hair:(x,y)=>{F(x-3,y-2,8,3,'#140e0a');F(x-5,y,2,5,'#1a1a20');F(x-6,y+1,2,3,'#ff4fd8')}}};
const sideP=(k,x,y,t,mode)=>sideHum(x,y,t,mode,SIDE[k]);
function clubFront(t,doorOpen){K.skyG(['#0a0618','#120a24','#1a0e30','#22123a','#2a1644','#32184c','#3a1a50','#421c52','#4a1e54','#521e54'],0,120);
  F(0,120,W,60,'#24222a');for(let x=-20;x<W;x+=40)F(x+((t*0)|0),146,20,1,'#6a6672');
  F(110,30,140,92,'#1e1a26');for(let y=40;y<110;y+=14)for(let x=118;x<244;x+=16)F(x,y,8,8,(x*y)%7<2?'#ff4fd8':'#2a2238');
  // вывеска с грибом
  F(130,14,100,16,'#120a1c');ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,180,22,60,'rgba(180,90,255,A)',.4+.2*Math.sin(t*6));ctx.restore();
  ctx.fillStyle=Math.sin(t*7)>-.8?'#e0b0ff':'#6a4a8a';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText('ГРИБЫЧ',186,26);ctx.textAlign='left';
  ctx.fillStyle='#ff4a6a';ctx.beginPath();ctx.ellipse(140,22,6,4,0,Math.PI,0);ctx.fill();F(138,22,4,5,'#f0e0c8');F(137,19,2,1,'#fff');F(142,18,1,1,'#fff');
  F(166,92,28,30,doorOpen?'#ff4fd8':'#0a0a0e');F(166,92,28,2,'#5a5a62');if(doorOpen){ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,180,108,40,'rgba(255,79,216,A)',.4);ctx.restore()}
  F(150,118,60,2,'#c8c8d0');F(150,110,1,10,'#c8c8d0');F(209,110,1,10,'#c8c8d0')} // ограждение
function topFloorBg(t){F(0,0,W,180,'#120c1a');for(let x=0;x<W;x+=40){F(x+2,4,36,40,'#0a1428');for(let i=0;i<6;i++)F(x+5+i*5,10+((x+i*13)%26),2,2,'#ffd27a')}F(0,128,W,52,'#24182e');
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++)radial(ctx,60+i*70+Math.sin(t*2+i)*20,100,40,['rgba(255,79,216,A)','rgba(62,240,176,A)','rgba(180,90,255,A)','rgba(255,210,58,A)'][i],.22);ctx.restore()}
function mainFloorBg(t){F(0,0,W,180,'#0e0406');F(0,128,W,52,'#1e080a');F(100,60,120,40,'#1a0a0e');F(110,66,100,16,'#120a0e');for(let i=0;i<6;i++)F(116+i*16,70,8,8,'#2a1418');
  for(let x=0;x<W;x+=32)F(x,128,16,52,'rgba(255,40,40,.05)')}
function southMap(t){F(0,0,W,180,'#0a0e18');
  // условная карта Петербурга: залив, Нева, районы (всё выше окна диалога)
  F(0,26,50,80,'#123a5a');ctx.fillStyle='#1a4a6a';ctx.beginPath();ctx.moveTo(50,56);ctx.quadraticCurveTo(140,46,170,60);ctx.quadraticCurveTo(210,78,280,64);ctx.lineTo(280,70);ctx.quadraticCurveTo(210,84,170,66);ctx.quadraticCurveTo(130,52,50,62);ctx.fill();
  const Z=[[60,28,100,22,'#c0302a','СЕВЕР','ЗАРАЖЕНО','#ff8a5a'],[170,28,100,22,'#c06a2a','ВОСТОК','ЗАРАЖЕНО','#ff8a5a'],[110,54,90,18,'#c8a02a','ЦЕНТР','ОЧАГИ','#ffd23a'],[60,76,200,24,'#2a9a5a','ЮГ','СВОБОДНО ✓','#3ef0b0']];
  for(const [x,y,w,h,c,n,st,sc] of Z){const pulse=n==='ЮГ'?.3+.2*Math.sin(t*4):.35;ctx.fillStyle=c;ctx.globalAlpha=pulse;ctx.fillRect(x,y,w,h);ctx.globalAlpha=1;ctx.strokeStyle=c;ctx.strokeRect(x+.5,y+.5,w-1,h-1);
    ctx.fillStyle='#fff';ctx.font='bold 6px monospace';ctx.fillText(n,x+4,y+9);ctx.fillStyle=sc;ctx.font='bold 5px monospace';ctx.fillText(st,x+4,y+h-3)}}
const CUT_RIDE7=[
  {dur:1,lines:[['ska','Так, пацаны. Вы идите, а мне тут резко надо с одним типом встретиться.'],['du','С каким типом? Мы только приехали.'],['ska','Ну... с типом. По делу. Подышим с ним... в смысле, обсудим.'],
    ['m','Опять твоя «дыхательная гимнастика»?'],['ska','Спортсмену надо восстанавливаться. Я быстро. Начинайте без меня, я подтянусь.'],['du','Быстро. Ага. Как в прошлый раз.']],draw(t){
    clubFront(t,false);sideGor(70,170,t,'stand',false,{bag:true});sideGor(96,170,t,'stand',true,{bag:true});sideSka(126,170,t,'stand',{wave:Math.sin(t*4)>.3});sideP('pw',184,150,t,'stand')}},
  {dur:2.6,subs:[[.2,2.4,null,'(Скала сворачивает за угол. Через минуту оттуда тянется тонкий дымок.)']],draw(t){
    clubFront(t,false);sideGor(70,170,t,'stand',false,{bag:true});sideGor(96,170,t,'stand',true,{bag:true});const k=clamp(t/2,0,1);if(k<1)sideSka(126+k*200,170,t,'walk');sideP('pw',184,150,t,'stand');
    if(t>1.4)for(let i=0;i<4;i++){const q=((t*.5+i/4)%1);ctx.fillStyle=`rgba(210,210,220,${.4*(1-q)})`;ctx.fillRect(Math.round(304+Math.sin(t*2+i)*4),Math.round(150-q*40),3,3)}}},
  {dur:1,lines:[['du','Приехали. «Грибыч». Ты как в первый раз смотришь.'],['m','Вывеска горит. Значит, электричество есть. Значит, есть надежда.'],['du','И пластинки с собой. Костюм не жмёт?'],['m','Горилла не жалуется. Горилла играет.']],draw(t){
    clubFront(t,false);sideGor(70,170,t,'stand',false,{bag:true});sideGor(96,170,t,'stand',true,{bag:true});sideP('pw',184,150,t,'stand')}},
  {dur:1,lines:[['pw','Стоп. Вы кто?'],['m','Бабура. Мы сегодня играем.'],['pw','Гориллы. Двое. Без списка.'],['du','Паутина, ты нас пять лет пускаешь. Каждую пятницу.'],
    ['pw','...Я пошутил. Проходите. Только зомби с собой не приводите.'],['m','А что, бывали?'],['pw','Неделю тихо. Тьфу-тьфу. У меня тут всё схвачено. Как паутиной.']],draw(t){
    clubFront(t,false);sideGor(140,170,t,'stand',false,{bag:true});sideGor(118,170,t,'stand',true,{bag:true});sideP('pw',184,150,t,'stand')}},
  {dur:3,subs:[[.2,2.8,null,'(Дверь открывается. Бас. Свет. Запах коктейлей и... чего-то ещё.)']],draw(t){
    clubFront(t,true);const k=clamp(t/2.6,0,1);sideGor(140+k*36,170-k*20,t,'walk',false,{bag:true});sideGor(118+k*48,170-k*20,t,'walk',true,{bag:true});sideP('pw',204,150,t,'stand')}},
];
const CUT_END7=[
  {dur:1,lines:[['lx','БАБУРА!!! Вы живые! Вы спасли «Грибыч»!'],['lx','Подвал чистый, терраса чистая, Артурчик доиграл! Это... это SUPERLATIVE!'],['du','Лёха, ты сказал, что на юге чисто.'],['lx','Ну... теперь-то точно чисто!']],draw(t){
    mainFloorBg(t);sideGor(90,170,t,'stand',false);sideGor(112,170,t,'stand',true);sideP('lx',200,170,t,'stand')}},
  {dur:1,lines:[['lx','Я вам кое-что приготовил. Хотел подарить после сета. Сет был... необычный.'],['lx','Два розовых узи. Из сейфа арт-директора. Не спрашивайте, откуда.'],['m','Розовые?'],['lx','Под цвет афиши. Стреляют с двух рук. Как вы сводите — с двух вертушек.'],
    ['du','Бери, Микроб. Фиолетовой горилле — розовые стволы. Это стиль.'],['m','С двух рук. Ну, Бабура, держитесь.']],draw(t){
    mainFloorBg(t);sideGor(90,170,t,'stand',false,{uzi:t>.5});sideGor(112,170,t,'stand',true);sideP('lx',150,170,t,'stand');
    const gx=128,gy=136+Math.sin(t*3)*2;ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,gx+8,gy,24,'rgba(255,90,200,A)',.4);ctx.restore();F(gx,gy,10,4,'#ff5ac8');F(gx+2,gy+4,2,4,'#c8309a');F(gx+12,gy-2,10,4,'#ff5ac8');F(gx+14,gy+2,2,4,'#c8309a')}},
  {dur:1,lines:[['bm','Гориллам — бессрочный бар. Шоты за счёт заведения. Навсегда.'],['ak','А я вам трек напишу. «Бабура против 303». Сто тридцать BPM.'],['pw','И в список внесу. Навсегда. Даже без костюмов пущу.'],['du','Без костюмов не пойдём. Бабура — это гориллы.']],draw(t){
    topFloorBg(t);sideGor(70,170,t,'stand',false,{uzi:true});sideGor(92,170,t,'stand',true);sideP('lx',140,170,t,'stand');sideP('bm',170,170,t,'stand');sideP('ak',200,170,t,'stand');sideP('pw',228,170,t,'stand');
    if(Math.random()<.3)cparts.push({x:rnd(0,W),y:-4,vx:rnd(-10,10),vy:rnd(20,40),g:10,life:5,c:['#ff4fd8','#3ef0b0','#b45aff'][(Math.random()*3)|0]});for(const p of cparts)F(p.x,p.y,2,2,p.c)}},
  {dur:1,lines:[['ska','О! Пацаны! А чё, я опоздал уже, да?'],['du','Немного. На весь сет. И на HRD 303.'],['ska','Ну ладно, блин... Извините, пацаны. Тип долго не отпускал.'],
    ['m','Ты какой-то очень... расслабленный.'],['ska','Восстановление. Спортивное. Ну чё, на хату?'],['du','На хату.'],['m','Залезай в буханку. Окно открою.']],draw(t){
    clubFront(t,false);sideGor(70,170,t,'stand',false,{uzi:true});sideGor(96,170,t,'stand',true);const k=clamp(t/1.6,0,1),cx=W-k*(W-190);
    if(t>1.6)sideSka(176,170,t,'stand',{wave:true,smoke:true});K.carSide(cx,176,t,'cab',{move:k<1})}},
  {dur:1,lines:[['r','Хорошие новости с юга. Этой ночью от заражённых освобождён весь юг Петербурга.'],['r','Последний очаг был в клубе «Грибыч». Его зачистил дуэт диджеев в костюмах горилл.'],
    ['r','Ситуация в городе с каждым днём лучше. Но на севере и востоке ещё остаются заражённые районы. Будьте осторожны.']],draw(t){southMap(t);K.newsBar('ЮГ ПЕТЕРБУРГА СВОБОДЕН',true,'НЕВА 24')}},
];

// ================= КВАРТИРА: начало и эпилог =================
function setFlat7(){
  C1.on=false;C1.mode=null;C1.noWpn=false;C7.on=true;for(const o of [window.C2,window.C3,window.C4,window.C5,window.C6])if(o){o.on=false}if(window.C4)C4.cat=false;
  scene='flat';cut=null;dlg=null;tr=null;S.fade=0;state='play';K.hud=null;
  S.step=12;S.alarm=false;S.skladLocked=false;S.bat=S.pistol=false;S.bowls=true;mapDirty=true;lastRoom=null;camY=0;
  pl.scoot=false;pl.sit=false;lockMove=true;shmak.mode='sit';shmak.x=136;shmak.y=40;shmak.a=-Math.PI/2;shmak.hug=0;shmak.path=[];cat.path=[];cat.then=null;
  cat.x=CAT_HOME.x;cat.y=CAT_HOME.y;cat.mode='sleep';
}
function kit7(){Object.assign(C1.seenT,{crawler:1,screamer:1,brute:1,shield:1,thrower:1,fast:1});
  Object.assign(PS,{hp:120,max:120,lives:3,inv:0,wpn:'pistol',ammo:140,shells:36,syr:2,moon:0,hasShotgun:true,mode:'spread',hasAxe:false,hasNail:false,hasExt:false,hasRail:true,cells:6,hasFlame:false,nails:0,ext:0,fuel:0,regen:0,carry:false,slow:0});
  Object.assign(C7,{duK:0,skK:0})}
function startCh7(){
  C7.started=true;C7.done=false;C7.flags={};setFlat7();mz7('call');
  pl.x=176;pl.y=74;pl.a=0;pl.ma=0;
  after(1,()=>{sfx('ring');after(.9,()=>sfx('ring'));note('Звонит телефон: «Дюша»');
    after(1.8,()=>say([['m','Алло?'],['du','Микроб, здоров. Ты не забыл?'],['m','Что не забыл?'],['du','Сегодня наш сет. «Грибыч». Бабура в деле.'],
      ['m','Дюша, какой сет? Полгорода в зомби.'],['du','Лёха Superlative звонил. Говорит, на юге неделю тихо. Клуб открывают, первая туса после всего этого.'],
      ['du','Арт-директор лично зовёт. Костюмы не забудь. Ты фиолетовый, я чёрный. Как всегда.'],['m','Горилла свой мех не забывает.'],
      ['du','Только сначала за Скалой. Мы ж договорились у его зала встретиться. Ща, добавлю его. *щёлк*'],['ska','Алло, пацаны! Я тут только заканчиваю.'],['m','Тренировка?'],
      ['ska','Ну типа. Только у меня вместо спарринга с людьми — спарринг с зомби. Они сами в зал пришли, прикинь.'],['du','Скала, тебе помочь?'],
      ['ska','Да вы подъедьте, заберите меня чисто. Но не парьтесь — я тут сам всех раскидаю. Вообще не проблема. *БУМ*'],
      ['m','Ну да. Ты-то уж справишься.'],['du','Но мы всё равно приедем. Мы ж кенты. Знаем, что ты не в беде, но поможем.'],['ska','...Ладно, приезжайте. Только перчатки мои не трогайте. *БУМ* Это не вам. Всё, давайте.'],
      ['s','Опять до утра? Зай, я ставлю будильник на шесть.'],['m','Отыграем — и сразу домой.'],['s','Ага. Как в прошлый раз.'],['vd','Бабура? Это ты, что ли, в костюме гориллы за пультом? Уважаю.'],['st','А пиво там есть?']],()=>{
        lockMove=false;C7.ready=true;note('Штаб: поговори с кем хочешь. Выход — входная дверь')}))});
}
IT.push({x:212,y:205,r:16,label:()=>'Выйти: к залу Скалы',cond:()=>C7.on&&C7.ready&&!C7.done&&scene==='flat'&&!C1.on,act:()=>{C7.ready=false;lockMove=true;kit7();C7.kills0=PS.kills;X.go(()=>{lockMove=false;sec7('gymst')})}});
IT.push({x:212,y:205,r:16,label:()=>'Выйти: титры',cond:()=>C7.on&&C7.done&&C7.epi&&scene==='flat'&&!C1.on,act:()=>{C7.epi=false;S.fade=.01;dlg=null}});
// розовые узи: запись в таблицу оружия (C1.WD) и выдача в оружейную (UP.grant) — если система склада уже подключена
function regUzi(){if(C1.WD&&!C1.WD.uzi)C1.WD.uzi={slot:'t',n:'РОЗОВЫЕ УЗИ ×2',pose:'pistol',am:'ammo',mag:60,rt:1.6,cd:.045,dmg:13,sp:460,life:.5,spr:.12,kb:25,snd:'shot',noise:160,dual:1,col:'#ff7ad8'}}
regUzi();
function grantUzi(){regUzi();try{if(window.UP&&UP.grant)UP.grant('uzi')}catch(e){}}
function endCh7(){
  C7.done=true;C7.uzi=true;PS.hasUzi=true;grantUzi();window.SOUTH_FREE=true;setFlat7();mz7('hq');pl.x=176;pl.y=74;pl.a=Math.PI/2;
  after(.8,()=>say([['s','Зай! Шесть утра. Ровно. И ты весь в... это кровь?'],['m','Это был очень жёсткий сет.'],['s','А это что? Розовые узи?!'],['m','Подарок от Лёхи. Стреляют с двух рук.'],
    ['s','Розовые... Зай, это же мой цвет. Дашь пострелять?'],['m','На складе лежат. Бери, когда пойдёшь на дело.'],['e','Юг свободен! Это надо отметить! Колонка заряжена!'],['ska','Всем привет. Я Скала. Я у вас на балконе подышу и на диванчике посплю, ладно?'],['s','Подышит он... Ладно. Только окно потом закрой.']].concat(C7.flags.stol?[['st','*заходит* Мужики... А чё вы меня на диванчике забыли? Я проснулся — клуб пустой, только Артурчик играет.'],['vd','Неделю. Его не было неделю. И никто не заметил.']]:[]),()=>{lockMove=false;C7.epi=true;note('Эпилог: розовые узи — на складе. Выход — титры')}));
}

// ================= 03.11: СКАЛА — боксёр, друг Бабуры =================
// Накачанный, короткие тёмно-каштановые волосы: виски сбриты, сверху колючий ёжик. Карие глаза.
// Красные боксёрские перчатки, белая боксёрская майка, бордовые шорты. Бьёт только кулаками.
// Его фишка (как пиво у Столыпина) — вечно «отходит подышать» и «встретиться с типом». Прямо не называем.
const SKA={sk:'#ecbf9c',sd:'#cf9c78',hr:'#3a2416',hl:'#5e3e28',fade:'#9a7c68',tank:'#f2f2f4',tr:'#c81e2a',sh:'#6a1424',gl:'#d0202a',gll:'#ff6a6a',gd:'#8a1018'};
function pSkala(g,open,blink){face(g,{sk:SKA.sk,eye:'#5a3218',brow:'#2a1a10',lip:'#b8786a',hw:14.5,hh:16.5,
  body(g){ell(g,32,84,42,28,SKA.sk);ell(g,6,64,11,10,SKA.sk);ell(g,58,64,11,10,SKA.sk);ell(g,6,62,7,5,shade(SKA.sk,1.06));ell(g,58,62,7,5,shade(SKA.sk,1.06)); // трапеции и дельты
    P(g,22,46,20,10,SKA.sd);ell(g,32,86,24,26,SKA.tank);P(g,17,54,6,12,SKA.tank);P(g,41,54,6,12,SKA.tank);ell(g,32,58,9,4,SKA.sd);
    P(g,17,54,1,12,SKA.tr);P(g,46,54,1,12,SKA.tr);P(g,24,62,16,1,shade(SKA.tank,.88))},
  hair(g){ell(g,32,17,15,7,SKA.fade,(x,y)=>y<=22&&(Math.abs(x-31.5)>8||y<=14)); // сбритые виски
    ell(g,32,13,11,6,SKA.hr,(x,y)=>y<=17);for(let i=0;i<9;i++){const x=22+i*2.5,h=3+((i*7)%3);P(g,x,11-h,2,h,i%2?SKA.hr:SKA.hl)} // колючий верх
    strands(g,14,22,42,8,16,SKA.hl,13);P(g,17,18,2,10,SKA.fade);P(g,45,18,2,10,SKA.fade)},
  extra(g,open,blink){if(!blink){P(g,21,28.5,7,1.4,shade(SKA.sk,.82));P(g,36,28.5,7,1.4,shade(SKA.sk,.82))} // спокойный, чуть прищуренный взгляд
    P(g,20,25,9,2,'#2a1a10');P(g,35,25,9,2,'#2a1a10');
    ell(g,54,60,8,7,SKA.gl);ell(g,52,57,3,2,SKA.gll);P(g,47,62,12,4,'#f0f0f0');P(g,48,63,10,1,SKA.gd)}},open,blink)} // красная перчатка в кадре
Object.assign(PORTRAIT,{ska:pSkala});PCV.ska=mk(64);
Object.assign(NAME,{ska:'СКАЛА'});Object.assign(NCOL,{ska:'#ff6a6a'});Object.assign(BG,{ska:['#240a0e','#ff6a6a']});
// сверху 24×24
function topSkala(g,sw,side){g.clearRect(0,0,24,24);const S=SKA;
  const jab=sw>0?Math.min(1,sw/.08):0,ly=side?18:6,oy=side?6:18;
  P(g,9,3,6,4,S.sk);P(g,9,17,6,4,S.sk); // плечи
  P(g,14,oy-1.5,4,3,S.sk);ell(g,19,oy,2.8,2.6,S.gl);P(g,18.5,oy-1.6,1.6,1,S.gll);
  const gx=19+jab*4;P(g,14,ly-1.5,gx-14,3,S.sk);ell(g,gx,ly,2.9,2.7,S.gl);P(g,gx-.5,ly-1.6,1.6,1,S.gll);
  ell(g,11,12,5.4,8.8,S.sk);ell(g,8.6,12,3.4,5.8,S.tank);P(g,5.4,8.5,1,7,S.tr);ell(g,13.6,7,2.4,2,S.sd);ell(g,13.6,17,2.4,2,S.sd);
  ell(g,12.6,12,3.7,3.7,'#7a5c48');ell(g,12.2,12,2.9,3,S.hr);P(g,11,10,1,1,S.hl);P(g,13,13,1,1,S.hl);P(g,12,11.5,1,1,S.hl);P(g,10.5,12.5,1,1,S.hl);
  P(g,15.4,11,1.4,2,S.sk);outline(g,'#0b0910')}
const cvSk=mk(24);cvSk.getContext('2d',{willReadFrequently:true});const legSk=mk(24);legSk.getContext('2d',{willReadFrequently:true});
C7.topSkala=topSkala;
// сбоку (ролики)
function sideSka(x,y,t,mode,o){o=o||{};const S=SKA,s=mode==='walk'?Math.round(Math.sin(t*10)*1.5):0;
  F(x-3+s,y-10,3,8,S.sk);F(x-s,y-10,3,8,S.sk);F(x-4+s,y-3,5,3,'#e8e8ec');F(x-1-s,y-3,5,3,'#e8e8ec');F(x-4+s,y-3,5,1,S.tr);F(x-1-s,y-3,5,1,S.tr);
  const ty=y-10;F(x-5,ty-5,10,6,S.sh);F(x-5,ty-5,10,1,shade(S.sh,1.3));
  F(x-7,ty-17,14,12,S.tank);F(x-7,ty-17,2,12,shade(S.tank,.85));F(x+6,ty-17,1,12,S.tr);F(x-8,ty-18,16,3,S.sk);
  F(x-10,ty-16,3,8,S.sk);F(x-11,ty-8,5,5,S.gd);
  if(o.wave){F(x+7,ty-24,3,9,S.sk);F(x+6,ty-29,5,5,S.gl)}else{F(x+7,ty-16,3,8,S.sk);F(x+6,ty-8,6,5,S.gl);F(x+7,ty-8,3,1,S.gll)}
  const hy=ty-27;F(x-1,hy+8,4,2,S.sd);F(x-4,hy,8,9,S.sk);F(x-4,hy,1,5,S.fade);F(x-4,hy-2,8,3,S.hr);F(x-3,hy-4,1,2,S.hr);F(x-1,hy-5,1,3,S.hl);F(x+1,hy-4,1,2,S.hr);F(x+3,hy-3,1,1,S.hl);
  F(x+2,hy+3,2,1,'#2a1a10');F(x+2,hy+2,2,1,shade(S.sk,.8));F(x+3,hy+6,2,1,'#b8786a');
  if(o.smoke)for(let i=0;i<3;i++){const k=((t*.7+i/3)%1);ctx.fillStyle=`rgba(210,210,220,${.45*(1-k)})`;ctx.fillRect(Math.round(x+5+Math.sin(t*2+i)*3),Math.round(hy-2-k*16),2,2)}}
C7.sideSka=sideSka;

// ---------- Скала-напарник: только кулаки; на ринге не выходит за канаты ----------
const SK_Q=['Скала: «Раз-два, корпус-голова!»','Скала: «Это даже не разминка»','Скала: «Слабенько, слабенько!»','Скала: «Нокаут!»','Скала: «Пацаны, отдыхайте, я сам»','Скала: «Следующий!»','Скала: «Держи двоечку»'];
function addSk(x,y,box){const A={x,y,a:Math.PI,ma:0,ph:0,mv:false,cd:.8,sw:0,side:0,n:0,kills:0,quip:rnd(6,10),puff:rnd(6,12),box:box||null};Q.sk=A;
  E.L.npcs.push({draw(){drawSk(A)}});return A}
function skHit(A,z,dmg,kb){const a=Math.atan2(z.y-A.y,z.x-A.x),was=z.dead;X.hurtZ(z,z.type==='boss'?dmg*.3:dmg,a,z.type==='boss'?0:kb);if(!was&&z.dead){A.kills++;C7.skK=(C7.skK||0)+1}}
const inBox=(b,x,y)=>x>b[0]&&x<b[2]&&y>b[1]&&y<b[3];
function skTick(A,dt){
  A.cd-=dt;if(A.sw>0)A.sw-=dt;A.quip-=dt;A.puff-=dt;
  if(hold()){A.mv=false;return}
  const L=E.L,d=D2(A.x,A.y,pl.x,pl.y),b=A.box;
  if(!b&&d>230){for(let k=0;k<14;k++){const a=pl.a+Math.PI+rnd(-1.2,1.2),r=rnd(14,26),x=pl.x+Math.cos(a)*r,y=pl.y+Math.sin(a)*r;if(!K.solid(x,y,4)){A.x=x;A.y=y;break}}}
  let tg=null,bd=b?400:130;
  if(L.armed)for(const z of L.zs){if(z.dead||z.st==='hidden'||z.st==='rise')continue;if(b&&!inBox(b,z.x,z.y))continue;if(!b&&z.st==='idle'&&D2(z.x,z.y,pl.x,pl.y)>110)continue;
    const dz=D2(A.x,A.y,z.x,z.y);if(dz<bd&&(b||E.los(A.x,A.y,z.x,z.y))){bd=dz;tg=z}}
  A.mv=false;let dir=null,sp=0;
  if(tg&&(b||D2(tg.x,tg.y,pl.x,pl.y)<170)){if(bd>tg.r+9){dir=Math.atan2(tg.y-A.y,tg.x-A.x);sp=b?66:84}}
  else if(b){const cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2;if(D2(A.x,A.y,cx,cy)>14){dir=Math.atan2(cy-A.y,cx-A.x);sp=40}} // гуляет по центру ринга, «пританцовывает»
  else{const pa=pl.a-Math.PI/2,bx=pl.x-Math.cos(pl.a)*15+Math.cos(pa)*12,by=pl.y-Math.sin(pl.a)*15+Math.sin(pa)*12;
    if(d>22&&D2(A.x,A.y,bx,by)>6){dir=(E.los(A.x,A.y,bx,by)&&!K.solid(bx,by,3.5))?Math.atan2(by-A.y,bx-A.x):K.navDir(A);sp=d>70?90:72}}
  if(dir!=null){K.mv(A,Math.cos(dir)*sp*dt,Math.sin(dir)*sp*dt,4);A.ma=dir;A.mv=true;A.ph+=dt*13}
  if(b){A.x=clamp(A.x,b[0]+6,b[2]-6);A.y=clamp(A.y,b[1]+6,b[3]-6)}
  const fa=tg?Math.atan2(tg.y-A.y,tg.x-A.x):(A.mv?A.ma:A.a);A.a+=angDiff(fa,A.a)*Math.min(1,dt*10);
  if(tg&&A.cd<=0&&bd<tg.r+11&&Math.abs(angDiff(fa,A.a))<.55){A.n++;A.side=A.n%2;A.sw=.16;
    if(A.n%4===0){A.cd=rnd(.6,.7);sfx('thump',.9);skHit(A,tg,64,260);if(!tg.dead)tg.stun=Math.max(tg.stun||0,1.2);X.floatT(tg.x,tg.y-12,'АППЕРКОТ!','#ff6a6a');C1.shake=Math.max(C1.shake,.25)}
    else{A.cd=rnd(.36,.46);sfx('bat',.7);skHit(A,tg,30,120)}
    Q.slashes.push({x:A.x,y:A.y,a:A.a,t:.1,c:'#ff8a8a'});
    if(A.quip<=0){A.quip=rnd(12,20);note(SK_Q[r4(SK_Q.length)])}}
  // фирменная привычка: без драки — «дыхательная гимнастика», лёгкий дымок
  if(!tg&&A.puff<=0){A.puff=rnd(9,16);A.puffT=2.2}
  if(A.puffT>0){A.puffT-=dt;if(Math.random()<dt*5)L.fx.push({x:A.x+rnd(-2,2),y:A.y-6,vx:rnd(-4,4),vy:rnd(-14,-8),life:.9,c:'rgba(214,214,224,.45)'})}
  if(!b){const dx=A.x-pl.x,dy=A.y-pl.y,dd=Math.hypot(dx,dy);if(dd<10&&dd>.01)K.mv(A,dx/dd*(10-dd),dy/dd*(10-dd),4);
    if(Q.du){const ex=A.x-Q.du.x,ey=A.y-Q.du.y,ed=Math.hypot(ex,ey);if(ed<10&&ed>.01)K.mv(A,ex/ed*(10-ed)/2,ey/ed*(10-ed)/2,4)}}
}
function drawSk(A){if(A.hidden)return;shadowBlob(A.x,A.y,6.5);
  legs(legSk.getContext('2d'),A.ph,A.mv,SKA.sh,'#e8e8ec');spr(legSk,A.x,A.y,A.mv?A.ma:A.a);
  topSkala(cvSk.getContext('2d'),A.sw,A.side);spr(cvSk,A.x,A.y,A.a)}

// ---------- зомби спортзала ----------
// 760..763 посетители тренажёрки, 770..771 бегуны с дорожек (быстрые), 780 зомби-качок (громила), 790..791 спарринг-зомби на ринге
function zGym(v,kind){const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});const SK=['#8aa47a','#7e9a70','#94ac84'][v%3];
  if(kind==='gym'){const C=['#3a3a42','#2a6ac8','#e8e8e8','#ff8a2a'][v%4],HR=['#2a1a10','#d8c070','#141414','#6a2a1a'][v%4];
    P(g,11,6,8,3,SK);P(g,18,6,3,3,SK);P(g,11,15,8,3,SK);P(g,18,15,3,3,SK);ell(g,11,12,4.8,7.6,SK);ell(g,10.6,12,3.8,5.6,C);
    ell(g,12,12,4,4,HR);if(v%2)P(g,11,8.5,2,7,'#c82a2a');P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
  if(kind==='run'){const C=v?'#2a2a6a':'#6a1a2a';P(g,11,6,8,3,C);P(g,18,5,3,3,SK);P(g,11,15,8,3,C);P(g,18,16,3,3,SK);ell(g,11,12,4.4,7,C);P(g,7,7,1,10,'#e8e8e8');
    ell(g,12,12,3.8,3.8,'#3a2a1a');P(g,11,9,2,1,'#1a1a1a');P(g,11,14,2,1,'#1a1a1a');P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
  if(kind==='box'){const GL=v?'#2a5ad8':'#1a1a1a';P(g,11,6,7,3,SK);P(g,11,15,7,3,SK);ell(g,19,7.5,2.6,2.4,GL);ell(g,19,16.5,2.6,2.4,GL);P(g,18.5,6.4,1.2,.8,'#ffffff');
    ell(g,11,12,5.2,7.8,SK);for(let i=0;i<5;i++)P(g,8+i,9+((i*3)%6),1,1,shade(SK,.7));ell(g,12,12,3.8,3.8,'#5a6a4a');P(g,10,9,4,6,v?'#c82a2a':'#2a5ad8');P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
  outline(g,'#0b0910');return c}
function zGymBrute(){const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});const SK='#8aa078';
  ell(g,20,5,6,4,SK);ell(g,20,27,6,4,SK);ell(g,14,16,9,12.5,SK);ell(g,13,16,6.6,9.4,'#1a1a1e');P(g,8,10,1,12,'#ffd23a');
  g.fillStyle='#ffd23a';g.font='bold 3px monospace';g.save();g.translate(11,21);g.rotate(-Math.PI/2);g.fillText('GYM',0,0);g.restore();
  ell(g,19,16,5,5,SK);P(g,15,12,3,8,'#2a1a10');P(g,22,13,1,1,'#ff2020');P(g,22,18,1,1,'#ff2020');outline(g,'#0b0910');return c}
for(let v=0;v<4;v++)X.zCache['normal'+(760+v)]=zGym(v,'gym');
for(let v=0;v<2;v++){X.zCache['fast'+(770+v)]=zGym(v,'run');X.zCache['normal'+(790+v)]=zGym(v,'box')}
X.zCache['brute780']=zGymBrute();
const Zg=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:760+r4(4),hp:60,max:60,sp:25},o||{}));
const Zgr=(x,y,o)=>E.addZ('fast',x,y,Object.assign({v:770+r4(2),hp:38,max:38,sp:50},o||{}));
const Zring=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:790+r4(2),hp:90,max:90,sp:28,st:'chase',ring:1,noConv:1},o||{}));
if(C1.LNAME)Object.assign(C1.LNAME,{gymst7:'УЛИЦА У ЗАЛА «НОКАУТ»',gym7:'ЗАЛ «НОКАУТ» · РИНГ СКАЛЫ'});

// ---------- УЛИЦА У ЗАЛА: встречаемся с Дюшей ----------
const GDOOR={x:452,y:62};
function lvGymSt(){
  const L=E.mkLevel('gymst7',640,320);B(0,0,640,320,'#16161c');
  K.floor(0,150,640,250,'asph');for(let x=8;x<640;x+=36)B(x,198,18,2,'#c8c890');
  K.floor(0,90,640,150,'walk');K.floor(0,250,640,300,'walk');
  // фасад зала сверху, соседние дома снизу
  B(0,0,640,90,'#2a2630');for(let x=10;x<640;x+=44){if(x>380&&x<540)continue;B(x,30,26,20,'#141a28');B(x+2,32,22,7,hash(x,3)>.5?'#ffd27a':'#2a3a5a')}
  B(380,6,160,84,'#3a1a20');B(380,6,160,3,'#6a2a32');for(let x=392;x<530;x+=24)B(x,40,16,24,'#1a2230');
  B(396,14,128,16,'#120a0e');K.txt(460,26,'БОКС-КЛУБ «НОКАУТ»','#ff4a4a',6);
  B(GDOOR.x-14,62,28,28,'#0a0a0e');B(GDOOR.x-14,62,28,2,'#8a8a92');E.gfill(GDOOR.x-14,62,GDOOR.x+14,90,0);
  B(0,300,640,20,'#24222a');for(let x=20;x<640;x+=60)B(x,304,40,12,'#1a1a22');
  // брошенные машины, урны, скамейки
  for(const [x,y,c,v] of [[60,160,'#8a1a1a'],[180,214,'#3a5a8a'],[300,166,'#d8d8dc'],[520,212,'#2a2a2e'],[600,160,'#6a6a2a'],[250,250,'#5a3a6a',1]]){if(v)X.carTop(x,y,c,1);else X.carTop(x,y,c)}
  for(const x of [40,160,280,560])X.lampPost(x,100);for(const x of [120,400,600])X.lampPost(x,262);
  for(const [x,y] of [[100,96],[340,96],[540,262]])X.lowBox(x,y,16,6,'#4a3a2a','#6a5a3a');
  K.txt(120,316,'ДО «ГРИБЫЧА» — ЧЕРЕЗ ВЕСЬ ЮГ','#4a4458',5);
  L.dark=.5;L.tint='20,10,40';L.lights.push([GDOOR.x,80,60,.9]);
  X.buildNav();
  pl.x=20;pl.y=200;pl.a=0;pl.ma=0;L.armed=true;
  const du=addDu(GDOOR.x-24,104);du.a=Math.PI;
  L.exit='Вход в зал';
  for(let i=0;i<7;i++)E.addZ('normal',rnd(120,620),rnd(156,246));for(let i=0;i<4;i++)E.addZ('normal',rnd(200,620),rnd(96,146));for(let i=0;i<3;i++)E.addZ('fast',rnd(300,620),rnd(256,296));
  E.addZ('thrower',560,120);E.addZ('screamer',360,276);Zg(430,110,{st:'idle'});Zg(480,116,{st:'idle'});Zgr(500,180);
  E.addZ('brute',600,200,{nm:'ПРОХОЖИЙ-ШКАФ',nmc:'#c8c8d0'});
  addCk(160,96);addCk(560,296);
  L.obj=()=>K.alive()?['Зачистить улицу у зала: '+K.alive()]:['Вход в зал «Нокаут» (дверь вверху)'];
  let shout=0;
  wrapDraw(L,()=>{if(!K.alive()&&Math.sin(tm*5)>0){ctx.strokeStyle='rgba(255,210,58,.8)';ctx.strokeRect(GDOOR.x-14.5,61.5,29,29)}},()=>{
    // удары из зала: глухие «бум» в окнах
    const k=(tm*1.3)%1;if(k<.15){ctx.fillStyle='rgba(255,80,80,.12)';ctx.fillRect(388,36,144,32)}});
  L.onTick7=dt=>{if(hold())return;if(!K.alive()&&!shout){shout=1;bankDu();
    say([['ska','*из зала* ПАЦАНЫ, ВЫ ТАМ?! Я ЖЕ ГОВОРИЛ — НЕ ПАРЬТЕСЬ!'],['du','Он даже не запыхался.'],['m','Заходим. Посмотрим на его «спарринг».']])}};
  L.its=[{x:GDOOR.x,y:94,r:20,label:()=>'Вход в зал «Нокаут»',act:()=>{if(K.alive()){say([['du','Сначала улица. А то зайдут нам в спину, пока мы на Скалу любуемся.']]);return}bankDu();lockMove=true;X.go(()=>{lockMove=false;sec7('gym')})}}];
  after(.5,()=>{K.zoneBanner('УЛИЦА У ЗАЛА «НОКАУТ»','#ff6a6a');
    say([['du','Микроб! Ты уже в костюме. Правильно — от Скалы сразу на сет.'],['m','Горилла всегда готова. Где Скала?'],
      ['du','Внутри. Слышишь «бум»? Это не груша. Это зомби.'],['m','А на улице-то их сколько набежало.'],['du','На звук сбежались. Он орёт «раз-два, корпус-голова» на весь квартал.'],['m','Ладно. Чистим улицу, потом к нему.']],()=>{for(const z of L.zs)if(z.st==='idle'&&Math.random()<.5)z.st='chase';note('Зачисти улицу у зала')})});
}

// ---------- ЗАЛ СКАЛЫ: ринг в центре, тренажёрка вокруг ----------
const RING=[250,150,390,260]; // внутренняя часть ринга (за канатами)
function lvGym(){
  const L=E.mkLevel('gym7',640,420);B(0,0,640,420,'#141018');
  K.floor(20,20,620,400,'wood');
  // резиновое покрытие тренажёрки
  for(const [x0,y0,x1,y1] of [[30,30,230,390],[410,30,610,390]])for(let y=y0;y<y1;y+=8)for(let x=x0;x<x1;x+=8)B(x,y,8,8,hash(x>>3,y>>3)<.1?'#26262c':((x+y)>>3)%2?'#202026':'#1c1c22');
  // зеркала на стенах
  for(let x=40;x<600;x+=56)B(x,20,44,4,'#6a8aa8');for(let y=40;y<380;y+=60){B(20,y,3,40,'#6a8aa8');B(617,y,3,40,'#6a8aa8')}
  // ринг: помост, угловые стойки, три каната
  const [r0,r1,r2,r3]=RING;B(r0-14,r1-14,r2-r0+28,r3-r1+28,'#1a2a5a');B(r0-8,r1-8,r2-r0+16,r3-r1+16,'#2a4aa8');
  for(let y=r1;y<r3;y+=10)B(r0,y,r2-r0,1,'#3a5ac0');K.txt((r0+r2)/2,(r1+r3)/2+4,'НОКАУТ','#4a6ad8',10);
  for(const [x,y] of [[r0-8,r1-8],[r2+8,r1-8],[r0-8,r3+8],[r2+8,r3+8]]){B(x-4,y-4,8,8,'#c8c8d0');B(x-3,y-3,6,6,(x<320)===(y<210)?'#c81e2a':'#2a5ad8')}
  for(let i=0;i<3;i++){const o=-8+i*2,cl=['#c81e2a','#f0f0f0','#2a5ad8'][i];B(r0+o,r1+o,r2-r0-2*o,1,cl);B(r0+o,r3-o,r2-r0-2*o,1,cl);B(r0+o,r1+o,1,r3-r1-2*o,cl);B(r2-o,r1+o,1,r3-r1-2*o,cl)}
  E.gfill(r0-10,r1-10,r2+10,r1-4,1);E.gfill(r0-10,r3+4,r2+10,r3+10,1);E.gfill(r0-10,r1-10,r0-4,r3+10,1);E.gfill(r2+4,r1-10,r2+10,r3+10,1);
  // беговые дорожки сверху слева, штанги, гантели, груши
  for(let x=40;x<220;x+=30){X.lowBox(x,36,20,34,'#2a2a30','#4a4a52');B(x+3,42,14,24,'#141418');B(x+6,38,8,3,'#3ef0b0')}
  for(const [x,y] of [[60,140],[60,220],[140,140]]){X.lowBox(x-14,y-3,28,6,'#5a5a62','#8a8a92');X.lowBox(x-18,y-6,5,12,'#1a1a1e');X.lowBox(x+13,y-6,5,12,'#1a1a1e');X.lowBox(x-4,y+6,8,14,'#3a2a2a','#5a3a3a')}
  X.lowBox(40,300,150,10,'#2a2a30','#4a4a52');for(let x=46;x<186;x+=10){B(x,296,6,4,'#5a5a62');B(x,310,6,4,'#5a5a62')}K.txt(115,328,'ГАНТЕЛИ','#5a5a6a',5);
  for(const [x,y] of [[450,70],[500,70],[550,70],[450,150],[550,150]]){X.lowBox(x-6,y-6,12,12,'#8a1a1a','#c82a2a');B(x-1,y-12,2,6,'#3a3a40')}K.txt(500,110,'ГРУШИ','#5a3a3a',5);
  for(const [x,y] of [[470,250],[560,250],[470,330]]){X.lowBox(x-14,y-8,28,16,'#2a2a30','#4a4a52');B(x-10,y-4,20,8,'#141418')}
  // раздевалка (дверь справа) и ресепшен у входа
  B(600,180,20,60,'#0e0e12');K.txt(590,176,'РАЗДЕВАЛКА','#8a8a9a',4);
  X.lowBox(250,330,90,14,'#3a2a20','#6a4a2a');K.txt(295,326,'РЕСЕПШЕН','#c8a060',4);
  B(40,400,60,20,'#0a0a0e');K.txt(70,396,'ВЫХОД','#ffffff',4);E.gfill(40,396,100,420,0);
  L.dark=.4;L.tint='10,0,20';L.lights.push([320,205,120,1],[120,60,80,.7],[500,110,80,.7],[120,250,80,.6],[520,300,80,.6],[70,390,40,.6]);
  X.buildNav();
  pl.x=70;pl.y=384;pl.a=-Math.PI/2;pl.ma=pl.a;L.armed=true;L.exit='Выйти к буханке';
  addDu(90,392);const sk=addSk(320,205,RING);
  addCk(130,330);addCk(600,40);addCk(320,370);
  // ринг: стартовые спарринг-партнёры + подкрепление «через канаты»
  for(let i=0;i<6;i++)Zring(rnd(r0+10,r2-10),rnd(r1+10,r3-10));
  Q.ringLeft=14;Q.ringT=6;Q.done=0;
  // тренажёрка
  for(let i=0;i<6;i++)Zg(rnd(40,220),rnd(80,280),{st:'idle'});for(let i=0;i<3;i++)Zgr(40+i*30,54);for(let i=0;i<6;i++)Zg(rnd(420,600),rnd(60,360),{st:'idle'});
  Zg(300,300);Zg(360,120);Zg(280,110);Zgr(380,300);E.addZ('thrower',520,360);E.addZ('screamer',140,200);
  Q.waves={t:0,list:[{t:22,fn:()=>{for(let i=0;i<4;i++)Zg(604,196+i*10,{st:'chase'});Zgr(604,230,{st:'chase'});note('Из раздевалки ещё лезут!')}},
    {t:40,fn:()=>{E.addZ('brute',604,210,{v:780,hp:460,max:460,st:'chase',nm:'ЗОМБИ-КАЧОК',nmc:'#ffd23a'});for(let i=0;i<3;i++)Zg(604,190+i*14,{st:'chase'});
      say([['ska','О, Толян! Он у нас жим лёжа двести. Был.'],['du','Скала, может, поможешь?'],['ska','Не могу, у меня раунд. Вы справитесь, я в вас верю.']])}}]};
  const outside=()=>L.zs.filter(z=>!z.dead&&!z.ring).length,inRing=()=>L.zs.filter(z=>!z.dead&&z.ring).length;
  L.obj=()=>Q.done?['Выйти к буханке со Скалой (выход внизу слева)']:[outside()?'Зачистить тренажёрку вокруг ринга: '+outside():'Тренажёрка чистая  ✓','Скала на ринге: '+(inRing()+Q.ringLeft)+' соперников'];
  K.hud=()=>{if(Q.done)return;const x=W-86,y=H-26;panel(x,y,82,10,.74);u.fillStyle='#ff6a6a';u.fillRect(x,y,2,10);uiFont(4,true);u.fillStyle='#ff6a6a';u.fillText('СКАЛА: '+(C7.skK||0)+' нокаутов',x+5,y+6.8)};
  wrapDraw(L,()=>{if(Q.done&&Math.sin(tm*5)>0){ctx.strokeStyle='rgba(255,210,58,.8)';ctx.strokeRect(40.5,396.5,59,23)}},()=>{
    // прожектор над рингом
    ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,320,205,90,'rgba(255,240,210,A)',.08+.03*Math.sin(tm*3));ctx.restore()});
  L.onTick7=dt=>{K.trigs();if(hold()||Q.done)return;
    if(Q.ringLeft>0){Q.ringT-=dt;if(Q.ringT<=0){Q.ringT=rnd(4.5,6.5);const n=Math.min(Q.ringLeft,1+r4(2));Q.ringLeft-=n;
      for(let i=0;i<n;i++){const c=[[r0+8,r1+8],[r2-8,r1+8],[r0+8,r3-8],[r2-8,r3-8]][r4(4)];Zring(c[0],c[1])}if(Math.random()<.4)note('Ещё один полез через канаты к Скале')}}
    if(!outside()&&!Q.waves.list.length&&Q.ringLeft>0){Q.ringLeft=0;say([['ska','Пацаны, вы уже всё? Ладно, ладно, добиваю.']])}
    if(!outside()&&!Q.waves.list.length&&!Q.ringLeft&&!inRing()){Q.done=1;bankDu();lockMove=true;sk.box=null;sk.x=r2+18;sk.y=(r1+r3)/2;sfx('ring',1);
      say([['ska','...и НОКАУТ! Двенадцатый раунд, чистая победа!'],['m','Ты сколько их положил?'],['ska','Не считаю. Считать — это для бухгалтеров. Ну ладно, '+(C7.skK||0)+'.'],
        ['du','Скала, ты в курсе, что у нас сет? Поехали.'],['ska','Перчатки беру с собой. Мало ли. И это... я на минутку на воздух выйду. После тренировки надо подышать.'],
        ['m','Скала, у нас буханка у входа. Подышишь в окно.'],['ska','Ну окно так окно. Погнали, Бабура!']],()=>{lockMove=false;note('Выход — внизу слева. Скала с вами')})}};
  L.its=[{x:70,y:400,r:22,label:()=>'Выйти к буханке',cond:()=>Q.done,act:()=>{bankDu();lockMove=true;K.hud=null;X.go(()=>{lockMove=false;rideToClub()})}},
    {x:70,y:400,r:22,label:()=>'Выход',cond:()=>!Q.done,act:()=>say([['du','Без Скалы не уедем. Он же сам не попросит.']])}];
  Q.trig.push({x:320,y:330,r:40,fn:()=>say([['ska','Пацаны, ринг мой! За канаты не лезьте. Это святое.']])});
  after(.5,()=>{K.zoneBanner('ЗАЛ «НОКАУТ» · РИНГ СКАЛЫ','#ff6a6a');
    say([['ska','О! Бабура приехала! Вы чё, уже в костюмах?'],['du','Сет через час. Скала, тебе помочь?'],
      ['ska','Не, пацаны, у меня спарринг. Вы вон тренажёрку почистите, там какие-то хлюпики на беговых дорожках.'],['m','Хлюпики. Ну да.'],
      ['ska','Только ринг — мой. Я тут сам. Отдыхайте.'],['du','Мы и не сомневались. Микроб, тренажёрка наша.']],()=>{for(const z of L.zs)if(!z.ring&&Math.random()<.6)z.st='chase';note('Зачисти тренажёрку. Ринг — Скале')})});
}
// из зала — буханка до «Грибыча», потом ролик у входа (Скала сливается)
function rideToClub(){if(window.HMC&&HMC.buhanka)HMC.buhanka(C7,()=>playC7(CUT_RIDE7,()=>sec7('top'),'ride'));else playC7(CUT_RIDE7,()=>sec7('top'),'ride')}
function bankSk(){}

// ================= МЕНЮ ГЛАВЫ 7 =================
const MENU7=[['Глава 7 с начала (звонок Дюши)','call7'],['Улица у зала Скалы','gymst'],['Зал Скалы: ринг','gym'],['Буханка и вход в клуб','ride7'],['Верхний этаж: бар и пульт','top'],['Терраса: Артурчик','terrace'],['Подвал: бары и коридоры','cellar'],['Главный танцпол: HRD 303','main'],['Финал (кат-сцена)','end7'],['Эпилог в штабе','epi7']];
function menuKit7(k){kit7();C1.done=true;for(const o of [window.C2,window.C3,window.C4,window.C5,window.C6])if(o){o.done=true;o.started=true;o.on=false}C7.started=true;C7.done=false;C7.kills0=PS.kills;S.bat=S.pistol=false;S.skladLocked=false;S.alarm=false;S.key=true;mapDirty=true;
  if(k!=='call7'&&k!=='ride7')PS.syr=3}
const cfg7={ch:C7,num:7,title:'ДИДЖЕЙ-СЕТ В ГРИБЫЧЕ',col:'rgba(180,90,255,A)',btn:{x:4,y:H-52,w:70,h:12},menu:MENU7,alias:{ch7:'call7'},
  start(k){menuKit7(k);if(k==='call7'){startCh7();return}if(k==='ride7'){rideToClub();return}if(k==='end7'){playC7(CUT_END7,endCh7,'end');return}if(k==='epi7'){endCh7();return}sec7(k)},
  canContinue:()=>!!(window.C6&&C6.done&&!C7.started),
  cont(){C7.menu=null;state='play';S.fade=0;sfx('click');kit7();startCh7()},
  endScreen(){
    if(window.C6&&C6.done&&!C7.started){K.endPanel({big:'ГЛАВА 6 ПРОЙДЕНА',sub:'Перелесье',col:'#ffa040',faces:['m','vd','st','pa','ma','al'],
      l1:'Счёт пил: Микроб '+(C6.myK||0)+' · Владос '+(C6.vdK||0)+' · Столыпин '+(C6.stK||0),l2:'Перелесье — посёлок-крепость. Родители в безопасности.'});cfg7.contBtn(150);return true}
    if(!C7.done)return false;
    K.endPanel({big:'ГЛАВА 7 ПРОЙДЕНА',sub:'Диджей-сет в «Грибыче»',col:'#c890ff',faces:['m','du','ska','lx','ak','pw'],
      l1:'Дюша: '+C7.duK+' · Скала: '+(C7.skK||0)+' нокаутов   ·   Награда: два розовых узи',l2:'Юг Петербурга свободен. Город с каждым днём ближе к спасению.',l3:'Но на севере и востоке ещё неспокойно. Продолжение следует...'});
    u.textAlign='center';uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText('Спасибо, что играли!   ·   '+(touch.on?'Коснись, чтобы сыграть заново':'R или клик — сыграть заново'),W/2,166);u.textAlign='left';return true}};
K.chapter(cfg7);C7.cfg=cfg7;
C7.CUTS={CUT_RIDE7,CUT_END7};
C7.get=()=>({L:E.L,Q,PS,scene,state,cut,dlg});

// ================= 03.11: ДЮША ДОМА (после главы 7, без костюма гориллы) =================
// Скин «дома»: короткие тёмно-каштановые волнистые волосы, усы, щетина, широкая шея;
// графитовая футболка с жёлтым принтом «БАБУРА», наушники на шее, чёрные джинсы.
function pDushaHome(g,open,blink){face(g,{sk:'#efc2a6',eye:'#4a3020',brow:'#3a2618',lip:'#c0807a',hw:14.5,hh:16.5,
  body(g){ell(g,32,78,34,24,'#2c2c34');ell(g,32,76,30,20,'#34343e');P(g,24,50,16,6,'#e2b292');ell(g,32,52,9,3,'#e2b292');
    P(g,20,58,24,4,'#ffd23a');P(g,22,59,20,2,'#2c2c34');for(let i=0;i<6;i++)P(g,23+i*3.2,59,2,2,'#ffd23a'); // принт БАБУРА
    P(g,18,51,6,4,'#1a1a1e');P(g,40,51,6,4,'#1a1a1e');P(g,22,54,20,1.5,'#8a8a96');P(g,19,52,3,2,'#c8c8d4');P(g,42,52,3,2,'#c8c8d4')}, // наушники на шее
  beard(g){P(g,24,39,16,3,'#3a2a1e');P(g,23,40,3,5,'#3a2a1e');P(g,38,40,3,5,'#3a2a1e');strands(g,26,24,40,44,52,'#b89676',6);ell(g,32,49,6,3,'#c8a888');strands(g,10,27,37,47,52,'#8a6a50',8)},
  hair(g){ell(g,32,16,15,8,'#3a2618',(x,y)=>y<=20);for(let i=0;i<9;i++)ell(g,19+i*3.2,12+((i*5)%3),2.6,2.6,i%2?'#4a3020':'#2e1e14');P(g,17,16,3,8,'#3a2618');P(g,44,16,3,8,'#3a2618');strands(g,16,19,45,9,18,'#5a3a26',12)},
  extra(g){P(g,21,34,4,1,'#e8a090');P(g,39,34,4,1,'#e8a090')}},open,blink)}
PORTRAIT.dh=pDushaHome;PCV.dh=mk(64);NAME.dh='ДЮША';NCOL.dh=NCOL.du;BG.dh=['#14141c','#ffd23a'];
// вид сверху 24×24, смотрит вправо
const cvDh=mk(24);
function topDushaHome(g,bob){g.clearRect(0,0,24,24);const SH='#34343e',SD='#24242c',SK='#e6b898';
  P(g,11,4,7,3,SH);P(g,11,17,7,3,SH);P(g,17,4,3,3,SK);P(g,17,17,3,3,SK); // плечи и руки на пульте
  ell(g,10.5,12,6.2,8.6,SD);ell(g,10,12,5.4,7.8,SH);P(g,6,9,2,6,'#ffd23a');P(g,6,10,2,1,SD);P(g,6,12,2,1,SD); // принт на спине
  ell(g,14,12,3.6,4.8,'#d8a888'); // широкая шея
  P(g,13,7,3,10,'#1a1a1e');P(g,13,7,3,1,'#8a8a96');P(g,13,16,3,1,'#8a8a96'); // наушники на шее
  ell(g,13+bob*.4,12,3.9,3.9,'#2e1e14');for(let i=0;i<6;i++)P(g,10+((i*3)%7)+bob*.4,9+((i*5)%7),1,1,i%2?'#4a3020':'#5a3a26');
  P(g,16.5+bob*.4,10.5,1,3,'#3a2a1e');outline(g,'#0b0910')}
C7.topDushaHome=topDushaHome;
const DH={x:206,y:62};C7.DH=DH;
const dhHas=()=>!!C7.done;
const _dmDh=drawMikrob;
drawMikrob=function(g,w){
  if(scene==='flat'&&state==='play'&&!cut&&dhHas())try{
    const b=Math.sin(tm*8)>0?1:0; // качает головой в такт
    F(DH.x+6,DH.y-7,8,14,'#141418');F(DH.x+7,DH.y-6,6,5,'#2a2a30');F(DH.x+7,DH.y+1,6,5,'#2a2a30'); // вертушки
    F(DH.x+9,DH.y-4,2,2,Math.sin(tm*12)>0?'#ffd23a':'#ff4fa3');F(DH.x+9,DH.y+3,2,2,Math.sin(tm*12+1)>0?'#3ef0b0':'#ffd23a');
    topDushaHome(cvDh.getContext('2d'),b);shadowBlob(DH.x,DH.y,6);spr(cvDh,DH.x,DH.y,0)}catch(e){console.warn(e)}
  return _dmDh(g,w)};
const dpick=a=>a[(Math.random()*a.length)|0];
IT.push({x:DH.x,y:DH.y,r:16,label:()=>'Дюша',cond:()=>dhHas()&&scene==='flat'&&state==='play'&&!(C1.on&&C1.mode)&&!(window.HQ&&HQ.busy),act:()=>say(dpick([
  [['dh','Костюм гориллы сдал в химчистку. Там до сих пор крестятся.']],
  [['dh','Микроб, следующий сет — у вас на балконе. Ханжа уже согласна.'],['m','Прямо согласна?'],['dh','Почти. Она пока не знает.']],
  [['dh','Без шерсти, конечно, холодновато. Зато видно, какой я красивый.']],
  [['dh','Лёха звонил: «Грибыч» скоро снова откроется. Паутина на входе уже никого не пускает. Даже живых.']],
  [['dh','*крутит пластинку* Слушай, новый трек. Назову «Столыпин спит в подвале».'],['m','Жизненно.']],
  [['dh','Черсик сел на вертушку и сделал скретч. Талант. Беру в «Бабуру» третьим.']],
]))});
if(window.HDS){sideGor=HDS.wrap(sideGor,[34,62]);sideHum=HDS.wrap(sideHum);sideSka=HDS.wrap(sideSka,[34,62])}
})();
