// =====================================================================
//  ГЛАВА 2 — «Суперкорм для Черсика». Играем за Шмакодявку.
//  Подключается после level1.js и пользуется его движком (C1.engine, C1.X).
//  Всё своё держит внутри замыкания, наружу отдаёт только window.C2.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.X||!C1.engine){console.warn('level2: нет движка главы 1');return}
const X=C1.X,E=C1.engine,PS=C1.PS;
const TAU=Math.PI*2;
const D2=(a,b,c,d)=>Math.hypot(c-a,d-b);
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
const C2={on:false,done:false,started:false,sec:null,menu:null,food:false,cosm:0,tf:false,kills0:0,zone:null};
window.C2=C2;
const sfx=X.sfx;
let L=null;
const ZC=['#5a6a8a','#8a5a4a','#6a6a5a','#4a4a52','#8a7a5a','#3a5a4a','#7a3a3a','#a8a8b0'];

// ================= МУЗЫКА (пока треки пролога и главы 1) =================
// Когда автор пришлёт треки для главы 2: положить в music/, объявить в MUS и вписать сюда.
// misund = BABURA STUDMIRE «MISUNDERSTANDING» (бойня: поездка, ТЦ, зал, «Золотое яблоко»),
// tommy = BABURA «TOMMY WRIGHT III» (кат-сцены: выезд, ТЦ, лифты), smoke = BABURA «GOING TO SMOKE» (кат-сцены: корм, дорога домой)
for(const [k,f] of [['misund','misunderstanding.mp3'],['tommy','tommy.mp3'],['smoke','smoke.mp3'],['trance','trance.mp3']]){if(!MUS[k]){const a=new Audio('music/'+f);a.loop=true;a.preload='auto';a.volume=0;MUS[k]=a}}
const MZ2={talk:'flat',yard:'menu',depart:'tommy',drive:'tommy',mall:'tek2',lift:'tommy',gym:'motiv',food:'smoke',apple:'unmix',home:'smoke',flat:'flat',mall1:'rave_station',mall2:'melancholy'};
C2.MZ=MZ2;
function mz2(k){const n=MZ2[k];if(n&&MUS[n])music(n)}

// ================= ШМАКОДЯВКА: спрайт сверху (смотрит вправо) =================
function drawShmakHero(g,w,carry){
  g.clearRect(0,0,24,24);
  const D='#f59cc8',DD='#cf74a2',DL='#ffc4df',SK='#f2cab2',SKD='#d8a890',HR='#2c1a1f',HL='#4c2e36';
  if(w==='pistol'){P(g,11,15,8,2,SK);P(g,18,14,2,3,SKD);P(g,19,13,6,2,'#151515');P(g,20,12,2,1,'#151515');P(g,11,7,6,2,SK);P(g,16,8,2,3,SKD)}
  else if(w==='bat'){P(g,10,16,7,2,SK);P(g,16,16,2,2,SKD);P(g,2,17,15,2,'#b07434');P(g,2,17,4,2,'#c88a44');P(g,14,17,3,2,'#2a2a2a');P(g,10,6,6,2,SK)}
  else if(w==='shotgun'){P(g,11,14,8,2,SK);P(g,17,14,2,2,SKD);P(g,10,8,10,2,SK);P(g,19,8,2,2,SKD);P(g,6,11,7,3,'#6a4424');P(g,12,11,12,2,'#26262a');P(g,14,13,7,1,'#3a3a40')}
  else if(w==='rail'){P(g,11,14,8,2,SK);P(g,17,14,2,2,SKD);P(g,10,8,10,2,SK);P(g,19,8,2,2,SKD);P(g,8,10,16,4,'#3a4a5a');P(g,10,11,14,1,'#8af0ff');P(g,23,10,2,4,'#c8f8ff');P(g,12,9,4,1,'#2a2a30');P(g,12,14,4,1,'#2a2a30')}
  else if(w==='flamer'){P(g,11,14,8,2,SK);P(g,17,14,2,2,SKD);P(g,10,8,10,2,SK);P(g,19,8,2,2,SKD);P(g,9,10,10,4,'#8a6a3a');P(g,10,11,8,1,'#c8a060');P(g,18,11,6,2,'#4a4a52');P(g,23,10,2,4,'#2a2a2a');P(g,4,9,5,6,'#cfe8d0');P(g,5,10,3,4,'#e8e0c0')}
  else if(w==='axe'){P(g,10,16,7,2,SK);P(g,16,16,2,2,SKD);P(g,3,17,14,2,'#b8282a');P(g,0,13,5,9,'#8a9098');P(g,0,13,1,9,'#e0e4ea');P(g,4,15,1,5,'#5a6068');P(g,10,6,6,2,SK)}
  else if(w==='nail'){P(g,11,15,8,2,SK);P(g,18,15,2,2,SKD);P(g,17,12,8,5,'#e8a020');P(g,18,13,6,1,'#2a2a2a');P(g,24,14,1,1,'#c8ccd4');P(g,18,16,3,2,'#3a3a3a');P(g,11,7,6,2,SK);P(g,16,8,2,3,SKD)}
  else if(w==='ext'){P(g,11,15,8,2,SK);P(g,18,14,2,2,SKD);P(g,11,7,8,2,SK);P(g,18,8,2,2,SKD);P(g,15,8,5,9,'#c8202a');P(g,16,8,1,9,'#e85a5a');P(g,17,7,2,1,'#2a2a2a');P(g,19,10,5,1,'#2a2a2a');P(g,23,9,2,3,'#3a3a3a')}
  else if(carry){P(g,10,4,8,2,SK);P(g,10,18,8,2,SK)}
  else{P(g,10,3,6,2,SK);P(g,15,3,1,2,SKD);P(g,10,19,6,2,SK);P(g,15,19,1,2,SKD)}
  ell(g,11,12,4.2,7.2,D);ell(g,9.6,12,2.6,6.4,DD);P(g,14,7,1,10,DL);
  P(g,11,5,3,1,SK);P(g,11,18,3,1,SK);
  ell(g,7.5,12,4.4,3.2,HR);P(g,2,11,4,3,HR);P(g,5,12,4,1,HL);
  ell(g,12,12,4,4,HR);P(g,10,11,4,1,HL);
  P(g,15,10,2,5,SK);P(g,15,9,1,1,HR);P(g,15,15,1,1,HR);
  hdShmTop(g,0);
  outline(g,'#0b0910');
}
const HERO={draw:drawShmakHero,leg:'#f2cab2',shoe:'#0e0e12'};window.SHMAK_DRAW=drawShmakHero;

// ---- Шмакодявка сбоку (для кат-сцен) ----
function sideShmak(x,y,t,mode,gun){
  const SK='#f2cab2',D='#f59cc8',DD='#cf74a2',HR='#2c1a1f';
  const s=mode==='walk'?Math.round(Math.sin(t*10)*1.5):0;
  F(x-3+s,y-10,2,7,SK);F(x-s,y-10,2,7,SK);F(x-4+s,y-3,4,3,'#0e0e12');F(x-1-s,y-3,4,3,'#0e0e12');F(x-4+s,y-1,4,1,'#2a2a30');F(x-1-s,y-1,4,1,'#2a2a30');
  const ty=y-10;F(x-4,ty-11,8,11,D);F(x-5,ty-3,10,3,D);F(x-4,ty-11,2,11,DD);F(x-5,ty-1,10,1,DD);
  if(gun){F(x,ty-9,6,2,SK);F(x+5,ty-10,7,2,'#26262a');F(x+2,ty-9,3,3,'#6a4424')}else{F(x+1,ty-10,2,8,SK)}
  const hy=ty-18;F(x-3,hy,7,7,SK);F(x-4,hy-1,8,3,HR);F(x-5,hy,3,13,HR);F(x-4,hy+1,2,10,HR);
  F(x+2,hy+3,1,1,'#2a1e18');F(x+2,hy+5,2,1,'#c0506a');F(x+1,hy+4,1,1,'#f0a0a8');
}

// ================= ЗОМБИ ГЛАВЫ 2 (свои облики через кэш движка) =================
// v 100..109 — качки (обычные), 120..121 — качки-громилы, 130 — качок-чемпион (босс),
// 140..144 — консультантки «Золотого яблока», 150..151 — быстрые консультантки
function zjock(v){
  const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});
  const SK=['#7fa070','#8aa878','#749866'][v%3],TOP=['#c83a3a','#2a2a2e','#3a6ac8','#e8e8e8','#e8a030'][v%5],SH=shade(TOP,.7);
  P(g,10,2,10,4,SK);P(g,19,3,3,4,SK);P(g,13,3,3,2,shade(SK,.8));P(g,10,18,10,4,SK);P(g,19,17,3,4,SK);P(g,13,19,3,2,shade(SK,.8));
  ell(g,11,12,5.6,8.6,SK);ell(g,11,12,4.2,6.2,TOP);ell(g,9.8,12,2.8,5,SH);
  P(g,12,8,2,2,'#6a1a1a');P(g,8,14,1,2,'#6a1a1a');
  ell(g,13,12,3.6,3.6,['#2a2a2a','#5a3a20',SK][v%3]);P(g,12,9,1,7,v%2?'#e83a3a':'#3ae8a0');
  P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030');P(g,17,12,1,1,'#3a1010');
  outline(g,'#0b0910');return c;
}
function zjockBig(v,champ){
  const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});
  const SK=champ?'#8fb070':'#6f8f5a',SD=shade(SK,.8),TOP=champ?'#e8c040':'#2a2a2e';
  P(g,12,1,14,7,SK);P(g,24,2,7,6,SD);P(g,12,24,14,7,SK);P(g,24,24,7,6,SD);
  ell(g,14,16,9,13,SK);ell(g,14,16,6.5,9.5,TOP);ell(g,12,16,4,8,shade(TOP,.75));
  if(champ){P(g,7,10,2,12,'#7a4a1a');P(g,7,14,2,4,'#e8c040')}
  P(g,15,10,3,2,'#6a1a1a');P(g,11,20,2,3,'#6a1a1a');
  ell(g,19,16,5,5,SK);P(g,17,12,1,9,champ?'#e8c040':'#e83a3a');P(g,22,13,1,1,'#ff2020');P(g,22,18,1,1,'#ff2020');P(g,23,15,1,3,'#3a1010');
  outline(g,'#0b0910');return c;
}
function zconsult(v,fast){
  const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});
  const SK='#86a478',SH='#141418',HR=['#2a1a14','#d8c080','#6a3a20','#1a1a1a','#a85a3a'][v%5];
  P(g,11,6,8,3,SH);P(g,18,6,3,3,SK);P(g,11,15,8,3,SH);P(g,18,15,3,3,SK);
  ell(g,11,12,4.4,7.4,SH);ell(g,9.6,12,3,6.6,'#0a0a0e');P(g,13,8,2,2,'#e8c040');P(g,12,14,1,2,'#6a1a1a');
  ell(g,8,12,3,2.4,HR);ell(g,12,12,4,4,HR);P(g,15,10,2,5,SK);
  const ey=fast?'#ffe040':'#ff3030';P(g,16,10,1,1,ey);P(g,16,14,1,1,ey);P(g,17,12,1,1,'#c0304a');
  outline(g,'#0b0910');return c;
}
for(let v=0;v<10;v++)X.zCache['normal'+(100+v)]=zjock(v);
X.zCache['brute120']=zjockBig(0,false);X.zCache['brute121']=zjockBig(1,false);X.zCache['boss130']=zjockBig(0,true);
for(let v=0;v<5;v++)X.zCache['normal'+(140+v)]=zconsult(v,false);
for(let v=0;v<2;v++)X.zCache['fast'+(150+v)]=zconsult(v,true);
const Zn=(x,y,o)=>E.addZ('normal',x,y,Object.assign({hp:55,max:55},o||{}));
const Zf=(x,y,o)=>E.addZ('fast',x,y,Object.assign({hp:40,max:40},o||{}));
const Zt=(x,y,o)=>E.addZ('thrower',x,y,Object.assign({hp:45,max:45},o||{}));
const Zb=(x,y,o)=>E.addZ('brute',x,y,Object.assign({hp:260,max:260},o||{}));
const Zj=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:100+((Math.random()*10)|0),hp:75,max:75,sp:27},o||{}));
const Zjb=(x,y,o)=>E.addZ('brute',x,y,Object.assign({v:120+((Math.random()*2)|0),hp:340,max:340},o||{}));
const Zc=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:140+((Math.random()*5)|0),hp:50,max:50},o||{}));
const Zcf=(x,y,o)=>E.addZ('fast',x,y,Object.assign({v:150+((Math.random()*2)|0),hp:38,max:38},o||{}));

// ================= ОТРИСОВКА КАРТ =================
const B=(x,y,w,h,c)=>X.B(x,y,w,h,c);
function floor(x0,y0,x1,y1,kind){
  E.gfill(x0,y0,x1,y1,0);
  for(let y=y0;y<y1;y+=4)for(let x=x0;x<x1;x+=4){const h=hash(x>>2,y>>2),w=Math.min(4,x1-x),hh=Math.min(4,y1-y);let c;
    switch(kind){
      case'mall':c=((x>>4)+(y>>4))%2?'#b8b4ac':'#aaa69e';if(x%16===0||y%16===0)c='#9a968e';if(h>.97)c='#c8c4bc';break;
      case'shop':c=h<.1?'#c8c2b4':'#d2ccbe';if(y%12===0)c='#bab4a6';break;
      case'dark':c=h<.15?'#2a2630':'#24202a';break;
      case'gym':c=h<.12?'#26282c':h>.92?'#1e2024':'#222428';if(x%24===0||y%24===0)c='#1a1c20';break;
      case'tiles':c=(x%8===0||y%8===0)?'#8a96a0':'#a8b4bc';break;
      case'apple':c=((x>>3)+(y>>3))%2?'#16141a':'#1e1b22';if(h>.988)c='#8a6a2a';break;
      case'kitchen':c=((x>>3)+(y>>3))%2?'#c8c0ae':'#8a8274';break;
      case'kids':c=['#3a6ac8','#e8c040','#c83a5a','#3ac87a'][((x>>4)+(y>>4)*3)%4];break;
    }
    B(x,y,w,hh,c)}
}
function sign(x,y,w,t,bg,fg){
  B(x,y,w,9,bg||'#1a1420');B(x,y,w,1,shade(bg||'#1a1420',1.6));
  const g=L.bx;g.fillStyle=fg||'#ffd23a';g.font='bold 6px monospace';g.textAlign='center';g.fillText(t,x+w/2,y+7);g.textAlign='left';
}
function shelf(x,y,w,h,base,cols){X.lowBox(x,y,w,h,base||'#6a6e76');const vert=h>w;
  for(let i=1;i<(vert?h:w)-1;i+=3){const c=cols?cols[(i+x+y)%cols.length]:null;if(!c||hash(x+i,y+i)<.35)continue;if(vert)B(x+1,y+i,w-2,2,c);else B(x+i,y+1,2,h-2,c)}}
function blobs(n,x0,y0,x1,y1){const g=L.dx;for(let i=0;i<n;i++){g.fillStyle='rgba(100,6,12,.7)';g.beginPath();g.arc(rnd(x0,x1),rnd(y0,y1),rnd(2,7),0,TAU);g.fill()}}
function debris(n,x0,y0,x1,y1){for(let i=0;i<n;i++){const x=rnd(x0,x1)|0,y=rnd(y0,y1)|0;B(x,y,rnd(2,5)|0,rnd(1,3)|0,['#5a5650','#7a766e','#3a3a40','#c8d0d8'][i%4])}}
function treeOver(list){return()=>{for(const [x,y,r] of list){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.arc(x+3,y+3,r,0,7);ctx.fill();ctx.fillStyle='#1f4a26';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.fillStyle='#2e6a34';ctx.beginPath();ctx.arc(x-3,y-3,r*.6,0,7);ctx.fill()}}}

// ================= КРАСНЫЙ LAND ROVER =================
const ROVER=mk(40,24);
(g=>{const R='#a81c1c',RD='#7a1010',RL='#d03a30';
  for(const [x,y] of [[6,0],[28,0],[6,21],[28,21]])P(g,x,y,7,3,'#0a0a0c');
  P(g,1,3,37,18,R);P(g,1,3,37,1,RL);P(g,1,20,37,1,RD);
  P(g,30,4,8,16,shade(R,1.08));P(g,32,6,4,12,RD);
  P(g,24,4,4,16,'#1a2230');P(g,25,5,1,14,'#2a3a50');
  P(g,9,5,15,14,RL);for(let x=10;x<24;x+=3)P(g,x,5,1,14,'#3a3a40');
  P(g,5,4,3,16,'#1a2230');
  P(g,0,8,2,8,'#0a0a0c');P(g,38,4,2,16,'#3a3a40');
  P(g,37,4,1,3,'#fff6c0');P(g,37,17,1,3,'#fff6c0');P(g,1,4,1,2,'#ff2a2a');P(g,1,18,1,2,'#ff2a2a');
  outline(g,'#0b0910');
})(ROVER.getContext('2d'));
window.ROVER_DRAW=(...a)=>drawRoverTop(...a);function drawRoverTop(x,y,a,ta,flash,gunner){
  shadowBlob(x,y,14);
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(a);ctx.drawImage(ROVER,-20,-12);ctx.restore();
  ctx.save();ctx.translate(Math.round(x-Math.cos(a)*2),Math.round(y-Math.sin(a)*2));ctx.rotate(ta);
  ctx.fillStyle='#2a3020';ctx.beginPath();ctx.arc(0,0,5,0,TAU);ctx.fill();ctx.fillStyle='#4a5040';ctx.beginPath();ctx.arc(-1,-1,3.4,0,TAU);ctx.fill();
  F(2,-2,13,2,'#16161a');F(2,1,13,1,'#16161a');F(14,-2,2,4,'#2a2a30');
  if(gunner){F(-6,-2,3,4,'#2c1a1f')}
  if(flash)F(16,-2,3,4,'#fff6c0');
  ctx.restore();
}
function sideRed(x,y,t,o){
  o=o||{};ctx.save();if(o.left){ctx.translate(2*x+52,0);ctx.scale(-1,1)}
  const BB='#9a1818',BL='#d03a30',bob=o.move?Math.round(Math.sin(t*20)*.6):0;y+=bob;
  F(x,y-18,52,11,BB);F(x,y-18,52,1,BL);F(x+5,y-29,38,11,BB);F(x+5,y-29,38,1,BL);F(x,y-8,52,1,shade(BB,.7));
  F(x+7,y-27,10,7,'#1c2430');F(x+19,y-27,10,7,'#1c2430');F(x+31,y-27,10,7,'#1c2430');F(x+8,y-27,2,7,'#2a3644');
  F(x+4,y-31,40,2,'#2a2a30');
  F(x+52,y-17,2,10,'#3a3a40');F(x-1,y-16,2,8,'#2a2a2e');
  F(x+50,y-16,2,3,'#fff6c0');F(x,y-16,1,3,'#ff2a2a');
  for(const wx of [6,36]){F(x+wx,y-9,12,9,'#0a0a0c');F(x+wx+3,y-7,6,5,'#3a3a40');F(x+wx+5,y-5,2,1,'#6a6a70')}
  // турель на крыше
  F(x+16,y-35,14,4,'#3a4030');F(x+18,y-37,10,2,'#4a5040');
  const ga=o.aim||0;ctx.save();ctx.translate(x+24,y-36);ctx.rotate(-ga);F(0,-1,16,2,'#16161a');F(14,-2,3,4,'#2a2a30');if(o.fire&&Math.sin(t*50)>0)F(17,-2,3,4,'#fff6c0');ctx.restore();
  if(o.gunner){F(x+19,y-42,6,6,'#f2cab2');F(x+18,y-43,7,3,'#2c1a1f');F(x+17,y-42,3,8,'#2c1a1f')}
  if(o.heads){F(x+34,y-27,4,4,'#f2cab2');F(x+33,y-28,5,2,'#2c1a1f');F(x+33,y-27,1,5,'#2c1a1f')}
  ctx.restore();
  if(o.lights){ctx.save();ctx.globalCompositeOperation='lighter';const d=o.left?-1:1,hx=o.left?x+2:x+52;const g=ctx.createLinearGradient(hx,0,hx+d*80,0);g.addColorStop(0,'rgba(255,240,180,.45)');g.addColorStop(1,'rgba(255,240,180,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(hx,y-16);ctx.lineTo(hx+d*80,y-26);ctx.lineTo(hx+d*80,y+2);ctx.closePath();ctx.fill();ctx.restore()}
}

// ================= РАЗДЕЛЫ =================
const Q={}; // флаги текущего участка
function sec2(n){
  C1.on=true;C2.on=true;C1.over=null;C1.hurt=0;C1.shake=0;PS.carry=false;PS.inv=1;C1.mdown=false;lockMove=false;dlg=null;C2.zone=null;
  const s0=X.snap(),f0={food:C2.food,cosm:C2.cosm,tf:C2.tf};C2.sec=n;
  C1.retry=()=>{X.restore(s0);Object.assign(C2,f0);PS.lives=3;PS.hp=PS.max;sec2(n)};
  for(const k in Q)delete Q[k];
  if(n==='drive'){lvDrive();mz2('drive');return}
  C1.mode='td';scene='c1td';
  if(n==='yard2'){lvYard2();mz2('yard')}
  if(n==='mall1'){lvMall1(false);mz2('mall1');after(.5,()=>say([['s','Первый этаж. Аптека, охотничий, супермаркет... Беру всё полезное.'],['s','Патроны к пистолету и к дробовику разные. Не перепутать.']]))}
  if(n==='mall2'){lvMall2();mz2('mall2');after(.5,()=>say([['s','Фудкорт. Тут раньше пахло шавермой.'],['s','Теперь пахнет... ими. Лифт в зал в дальнем углу.']]))}
  if(n==='gym'){lvGym(false);mz2('gym');after(.5,()=>say([['s','Мой зал... Это же Серёга, который жмёт сто сорок. И Вован, вечно на бицепс.'],['s','Простите, мальчики. Сегодня день ног. Ваших.']]))}
  if(n==='gym2'){lvGym(true);mz2('food')}
  if(n==='apple'){lvMall1(true);mz2('apple');after(.5,()=>say([['s','Тишина. Только кровь и битое стекло.'],['s','А вот и «Золотое яблоко». Решётка поднята... Внутри кто-то шуршит.']]))}
  L=E.L;L.hero=HERO;
  C1.cx=clamp(pl.x-W/2,0,Math.max(0,L.w-W));C1.cy=clamp(pl.y-H/2,0,Math.max(0,L.h-H));if(L.w<=W)C1.cx=(L.w-W)/2;if(L.h<=H)C1.cy=(L.h-H)/2;
}
C2.go=sec2;
function playC2(shots,onEnd,k){C1.on=true;C2.on=true;C1.mode='cut';if(k)mz2(k);playCut(shots,()=>X.go(onEnd))}

// ---------- ДВОР: Ханжа и красный Land Rover ----------
const RV={x:292,y:172};
function lvYard2(){
  L=E.mkLevel('yard2',YW,YH);
  L.bx.drawImage(yardCv,0,0);
  E.gfill(0,0,YW,YH,0);
  for(const s of ysolids)E.gfill(s.x,s.y,s.x+s.w,s.y+s.h,1);
  E.gfill(0,0,2,YH,1);E.gfill(YW-2,0,YW,YH,1);E.gfill(0,YH-2,YW,YH,1);E.gfill(198,252,214,258,1);
  for(let x=0;x<YW;x+=6){if(x>=146&&x<218)continue;B(x,246,6,4,(x/6)%2?'#8a7a5a':'#9a8a64');B(x,246,6,1,'#b0a078')}
  for(let x=0;x<YW;x+=3)B(x,251,1,1,'#9aa0a6');
  for(const x of [160,176,224,240]){B(x,262,7,1,'#4a4a50');B(x+3,259,1,7,'#4a4a50')}
  for(const [x,y] of [[96,232],[60,240],[300,240]]){B(x-12,y-4,24,7,'#5a4a32');for(let i=0;i<3;i++)B(x-11,y-3+i*2,22,1,'#8a7a54')}
  for(const [x,y] of [[96,226]]){B(x-4,y-4,8,8,'#3a3030');B(x-3,y-3,6,6,'#1a1010');E.gfill(x-4,y-4,x+4,y+4,2);L.lights.push([x,y,60,.9]);L.glow.push([x,y,46,'rgba(255,120,40,A)',.35,9])}
  // окна первого этажа уже в решётках — Микроб начал работу
  for(let x=6;x<YW;x+=18){if(ENTR.some(c=>Math.abs(c-x-3)<14))continue;for(let i=0;i<4;i++)B(x+1+i*2,70,1,10,'#1a1a1e')}
  E.gfill(RV.x-12,RV.y-20,RV.x+12,RV.y+20,2);
  L.lights.push([100,122,46,.8],[260,122,46,.8],[100,222,46,.8],[260,222,46,.8],[RV.x,RV.y,40,.8]);
  for(const c of ENTR)L.lights.push([c,92,22,.7]);
  L.glow.push([100,122,40,'rgba(255,190,110,A)',.2],[260,122,40,'rgba(255,190,110,A)',.2],[100,222,40,'rgba(255,190,110,A)',.2],[260,222,40,'rgba(255,190,110,A)',.2]);
  L.dark=.5;L.tint='14,4,10';L.armed=false;L.noHud=true;
  X.buildNav();
  pl.x=180;pl.y=112;pl.a=Math.PI/2;pl.ma=pl.a;pl.scoot=false;pl.sit=false;
  const hz={x:206,y:226,a:-Math.PI/2},gu={x:268,y:196,a:Math.PI};
  Q.talked=false;Q.ready=false;
  L.npcs=[
    {draw(){shadowBlob(hz.x,hz.y,5);X.drawSoldier(X.sprN.getContext('2d'),tm,{body:'#4a5a32',head:'#2e3a22',hair:'#8a6748',sk:'#efc5a5',gun:true});spr(X.sprN,hz.x,hz.y,hz.a)}},
    {draw(){shadowBlob(gu.x,gu.y,5);X.drawSoldier(X.sprN.getContext('2d'),tm,{body:'#3a4a2a',head:'#4a5a3a',gun:false});spr(X.sprN,gu.x,gu.y,gu.a)}},
  ];
  L.onUpdate=()=>{
    if(D2(pl.x,pl.y,hz.x,hz.y)<44)hz.a=Math.atan2(pl.y-hz.y,pl.x-hz.x);
    if(D2(pl.x,pl.y,gu.x,gu.y)<44)gu.a=Math.atan2(pl.y-gu.y,pl.x-gu.x);
  };
  L.drawUnder=()=>{
    const a=-Math.PI/2;drawRoverTop(RV.x,RV.y,a,a+Math.sin(tm*.8)*.6,false,false);
    if(Q.talked){const k=.4+.4*Math.sin(tm*5);ctx.strokeStyle=`rgba(255,210,58,${k})`;ctx.strokeRect(RV.x-13.5,RV.y-21.5,27,43)}
  };
  L.drawOver=()=>{
    const tx=240,ty=212;F(tx-5,ty-4,10,8,'#3a4030');F(tx-4,ty-3,8,6,'#4a5040');
    ctx.save();ctx.translate(tx,ty);ctx.rotate(Math.sin(tm*.7)*1.3+Math.PI/2);F(0,-1,12,2,'#1a1a1e');ctx.restore();F(tx-1,ty-1,2,2,Math.sin(tm*6)>0?'#ff3030':'#5a1010');
    treeOver([[150,160,13],[200,176,15],[226,152,11],[136,190,9]])();
  };
  L.obj=()=>!Q.talked?['Поговорить с командиром Ханжой (у калитки)']:['Сесть в красный Land Rover'];
  L.its=[
    {get x(){return hz.x},get y(){return hz.y},r:22,label:()=>'Поговорить с командиром Ханжой',act:talkHanzha2},
    {get x(){return gu.x},get y(){return gu.y},r:18,label:()=>'Поговорить с Михалычем',act:()=>say(Q.talked?[['G','Красный — цвет победы. И крови на нём не видно.'],['G','Турель кормится сама, лента на тысячу. Только не перегревай, давай ей остыть.']]:[['G','Иди к командиру, дочка. Она тебе всё расскажет.']])},
    {x:RV.x,y:RV.y+8,r:24,label:()=>'Сесть в красный Land Rover',cond:()=>Q.talked,act:()=>{lockMove=true;X.go(()=>{lockMove=false;playC2(CUT_DEPART,()=>sec2('drive'),'depart')})}},
    {x:RV.x,y:RV.y+8,r:24,label:()=>'Красный Land Rover?..',cond:()=>!Q.talked,act:()=>say([['s','Это... машина Аниса? Почему она красная? И что это у неё на крыше?!']])},
  ];
}
function talkHanzha2(){
  if(Q.talked){say([['H','Чего стоишь, боец? Машина ждёт. Калитку открою.']]);return}
  say([['H','Стой, кто идёт?! ...Шмакодявка? Куда это ты собралась с таким арсеналом?'],['s','В тренажёрный зал, тётушка. За кормом для Черсика.'],['H','Командир Ханжа, деточка. Слушай внимательно.'],
    ['H','Очень жаль, но вашу машину пришлось слегка разобрать. Кенгурятник, лебёдку и запаску мы пустили на укрепление дома.'],
    ['H','Зато Михалыч в знак благодарности поставил на неё турель. И перекрасил в красный.'],['s','В красный?! Михалыч, ты чудо!'],
    ['H','Рулишь сама, а турель наводится с планшета, прямо из салона. Машина бронированная, в ней тебя никто не достанет.'],
    ['H','Но дохляки в районе озверели. Быстрее, злее, толпами. Не останавливайся. Дави.'],['H','Калитку открываю. С богом, боец.']],()=>{Q.talked=true;E.gfill(198,252,214,258,0);X.buildNav();sfx('click')});
}

// ---------- ПОЕЗДКА ПО РАЙОНУ (машина с турелью) ----------
let DW=480,DH=7000;const CROSS=[6300,5500,4700,3900,3100,2300,1500,800];
let CAR=null;C2.car=()=>CAR;
function solidC(x,y,r){const g=E.gAt;return g(x-r,y-r)||g(x+r,y-r)||g(x-r,y+r)||g(x+r,y+r)||g(x,y)}
function carFree(x,y,a){const c=Math.cos(a),s=Math.sin(a);for(const k of [-12,0,12])if(solidC(x+c*k,y+s*k,7))return false;return true}
function zMove(z,dx,dy){if(dx){const nx=z.x+dx;if(!solidC(nx,z.y,z.r))z.x=nx}if(dy){const ny=z.y+dy;if(!solidC(z.x,ny,z.r))z.y=ny}}
function roofs(x0,y0,x1,y1,k){ // крыши панелек
  B(x0,y0,x1-x0,y1-y0,'#3a363e');B(x0,y0,x1-x0,2,'#4a464e');B(x0,y1-2,x1-x0,2,'#2a262e');
  for(let y=y0+8;y<y1-8;y+=26){B(x0+6,y,8,6,'#4a464e');B(x1-16,y+10,8,6,'#4a464e');if(hash(k,y)>.7){for(let i=0;i<4;i++)B(x0+20+i*3,y+4-i,3,4,i%2?'#ff7a20':'#ffd040');L.glow.push([x0+24,y+2,24,'rgba(255,120,40,A)',.3,7])}}
}
function lvDrive(){
  DW=480;DH=7000;L=E.mkLevel('drive',DW,DH);L.noCull=1;Q.fires=[];Q.trees=[];
  B(0,0,DW,DH,'#2e2a32');
  // дорога и тротуары
  E.gfill(96,0,384,DH,0);
  for(let y=0;y<DH;y+=4)for(let x=120;x<360;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,h<.1?'#3a3a42':h>.93?'#2a2a30':'#323238')}
  for(let y=0;y<DH;y+=8){B(96,y,24,8,(y>>3)%2?'#5a5a62':'#626270');B(360,y,24,8,(y>>3)%2?'#5a5a62':'#626270')}
  B(119,0,1,DH,'#8a8a92');B(360,0,1,DH,'#8a8a92');
  for(let y=0;y<DH;y+=40)B(239,y,2,20,'#c8b040');for(let y=20;y<DH;y+=30){B(179,y,1,12,'#8a8a80');B(300,y,1,12,'#8a8a80')}
  // кварталы по бокам
  const segs=[[300,800]];for(let i=CROSS.length-1;i>=0;i--)segs.push([CROSS[i]+90,i?CROSS[i-1]:DH]);
  for(const [a,b] of segs){for(let y=a;y<b;y+=250){const y1=Math.min(b,y+250);if(y1-y<40)continue;roofs(4,y+4,90,y1-4,y);roofs(390,y+4,476,y1-4,y+1)}}
  // перекрёстки
  for(const c of CROSS){E.gfill(0,c,DW,c+90,0);for(let y=c;y<c+90;y+=4)for(let x=0;x<DW;x+=4){if(x>=96&&x<384)continue;const h=hash(x>>2,y>>2);B(x,y,4,4,h<.1?'#3a3a42':'#323238')}
    for(let x=124;x<356;x+=10)B(x,c+2,6,8,'#c8c8c0');for(let x=124;x<356;x+=10)B(x,c+80,6,8,'#c8c8c0')}
  // площадь у ТЦ
  E.gfill(20,0,460,300,0);for(let y=90;y<300;y+=4)for(let x=20;x<460;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,h<.1?'#3e3e46':'#36363e')}
  for(let x=40;x<440;x+=24)B(x,150,1,30,'#8a8a90');for(let x=40;x<440;x+=24)B(x,230,1,30,'#8a8a90');
  E.gfill(20,0,460,90,1);B(20,0,440,90,'#3a3236');for(let x=30;x<450;x+=30)B(x,10,14,10,'#4a4248');
  B(20,74,440,16,'#5a6a7a');for(let x=24;x<456;x+=16)B(x,76,12,12,'#2a3a50');B(200,70,80,20,'#1a1a20');B(206,74,30,16,'#6a8aa0');B(244,74,30,16,'#6a8aa0');
  sign(160,58,160,'ТЦ «СИТИ МОЛЛ» · ФИТНЕС 3 ЭТ.','#3a1a4a','#ffd23a');
  L.glow.push([240,80,60,'rgba(200,120,255,A)',.25,2]);
  // препятствия
  const cols=['#3a5a8a','#8a2a2a','#c8c8c8','#2a2a2a','#6a8a4a','#c8a040','#5a3a6a'];
  let s=7;const rr=()=>{s=(s*16807)%2147483647;return s/2147483647};
  for(let y=DH-300;y>500;y-=110+rr()*90){if(CROSS.some(c=>y>c-40&&y<c+120))continue;const x=rr()<.5?126+rr()*40:290+rr()*40;X.carTop(x|0,y|0,cols[(rr()*7)|0],true);if(rr()<.3)Q.fires.push([x+8,y+14])}
  const bus=(x,y,c)=>{B(x,y,26,78,c);B(x+2,y+3,22,72,shade(c,1.15));for(let i=0;i<6;i++)B(x+3,y+6+i*12,20,4,'#1a2230');E.gfill(x,y,x+26,y+78,2)};
  bus(140,6000,'#3a7ac8');bus(300,5150,'#c8a030');bus(200,4350,'#3a7ac8');bus(126,3420,'#c8a030');bus(320,2700,'#3a7ac8');bus(200,1980,'#c8a030');
  // баррикады с проходом
  const barr=(y,g0,g1)=>{for(const [x0,x1] of [[120,g0],[g1,360]]){for(let x=x0;x<x1;x+=12){B(x,y,11,10,'#8a8a88');B(x,y,11,2,'#a8a8a6')}E.gfill(x0,y,x1,y+10,2)}};
  barr(4900,276,350);barr(1180,204,276);
  for(const [x,y] of [[160,600],[300,640],[230,700]])X.carTop(x,y,cols[(x+y)%7],false);
  Q.fires.push([166,1160],[320,1160],[240,2010]);
  for(let y=200;y<DH;y+=180){X.lampPost(110,y);X.lampPost(370,y+90)}
  for(let y=150;y<DH;y+=120){if(CROSS.some(c=>y>c-20&&y<c+100))continue;E.gfill(102,y,114,y+12,2);E.gfill(366,y+60,378,y+72,2);Q.trees.push([108,y+6,8],[372,y+66,8])}
  L.dark=.55;L.tint='10,4,14';
  // зомби
  for(let y=DH-500;y>360;y-=28+rr()*30){const n=1+(rr()*2.2|0);for(let i=0;i<n;i++){const x=128+rr()*224,r=rr(),y2=y+rr()*20;
      if(solidC(x,y2,6))continue;if(r<.5)Zn(x,y2,{hp:70,max:70});else if(r<.75)Zf(x,y2,{hp:50,max:50,sp:52});else if(r<.83)E.addZ('crawler',x,y2,{hp:40,max:40});else if(r<.89)E.addZ('bloat',x,y2);else if(r<.93)E.addZ('shield',x,y2,{hp:120,max:120});else Zt(rr()<.5?106:374,y2)}}
  const horde=(y,n,b)=>{n=Math.round(n*.8);for(let i=0;i<n;i++){const x=130+rr()*220,y2=y+rr()*80;if(!solidC(x,y2,6))(rr()<.35?Zf:Zn)(x,y2,{hp:70,max:70})}for(let i=0;i<b;i++)Zb(170+i*50+rr()*20,y+20+rr()*40,{hp:380,max:380})};
  horde(6500,12,0);horde(5800,16,1);horde(5300,18,1);horde(4200,18,1);horde(3560,16,0);horde(2800,18,1);horde(2080,20,1);horde(1060,12,0);horde(420,22,2);
  for(const x of [222,248])Zb(x,1170,{hp:380,max:380});Zb(236,1150,{hp:380,max:380});Zb(316,4890,{hp:380,max:380});Zb(316,4870,{hp:380,max:380});
  for(const z of L.zs){z.hp*=1;}
  CAR={x:240,y:DH-120,a:-Math.PI/2,v:0,ta:-Math.PI/2,cd:0,heat:0,oh:0,buls:[],flash:0,slow:0,kills:PS.kills,start:DH-120,end:false,banner:4,thrNote:false,clung:0};
  CAR.spawned=CROSS.map(()=>false);CAR.hp=100;CAR.roofT=18;CAR.gate=0; // 04.11: ворот нет — открытая парковка
  C1.on=true;C2.on=true;C1.mode='car';scene='c2car';C1.over=null;
  C1.cx=CAR.x-W/2;C1.cy=CAR.y-H/2-30;
  // 06.11: маршрут с поворотами и перекрёстками вместо прямой полосы
  if(window.RT&&RT.convert&&!C1.noRoutes){try{const r=RT.convert('drive',L,{sx0:240,sy0:DH-120,fy0:190,hw0:112,fires:Q.fires,route:'ДВОР → ТЦ «СИТИ МОЛЛ»'});
    L=r.L;L.dark=.55;L.tint='10,4,14';Q.fires=r.fires;Q.trees=[];DW=r.R.W;DH=r.R.H;CAR.R=r.R;CAR.x=r.R.pts[0][0];CAR.y=r.R.pts[0][1]-30;CAR.start=CAR.y;CAR._s=0;CAR.spawned=CROSS.map(()=>true);
    C1.cx=CAR.x-W/2;C1.cy=CAR.y-H/2-30}catch(e){console.warn('rt drive2',e)}}
}
function carUpdate(dt){
  const c=CAR;L.t+=dt;if(c.R){c._s=RT.proj(c.R,c.x,c.y,c._s);RT.hordes(c.R,c)}
  if(c.banner>0)c.banner-=dt;if(c.flash>0)c.flash-=dt;if(C1.shake>0)C1.shake=Math.max(0,C1.shake-dt*2.5);
  const free=!dlg&&!tr&&!c.end;
  const [mx,my,ml]=free?X.inputMove():[0,0,0];
  if(ml>.15){const want=Math.atan2(my,mx),da=angDiff(want,c.a);
    if(Math.abs(da)>2.3){c.v+=clamp(-45-c.v,-140*dt,140*dt)}
    else{const turn=2.4*dt*Math.min(1,Math.abs(c.v)/45+.3);c.a+=clamp(da,-turn,turn);const tgt=105*ml*(1-Math.min(.55,Math.abs(da)/3));c.v+=clamp(tgt-c.v,-170*dt,85*dt)}}
  else c.v*=Math.exp(-1.6*dt);
  if(c.clung>0)c.v*=Math.exp(-Math.min(c.clung,5)*.35*dt);
  // поворот без проверки ставил машину боком в стену — выталкиваем на свободное место
  if(!carFree(c.x,c.y,c.a)){let ok=0;for(const r of [1.5,3,5,8,12,16]){for(let i=0;i<12&&!ok;i++){const q=i/12*Math.PI*2,x=c.x+Math.cos(q)*r,y=c.y+Math.sin(q)*r;if(carFree(x,y,c.a)){c.x=x;c.y=y;ok=1}}if(ok)break}if(!ok&&c._pa!=null&&carFree(c.x,c.y,c._pa))c.a=c._pa}c._pa=c.a;
  const nx=c.x+Math.cos(c.a)*c.v*dt,ny=c.y+Math.sin(c.a)*c.v*dt;
  if(carFree(nx,ny,c.a)){c.x=nx;c.y=ny}
  else if(carFree(nx,c.y,c.a)){c.x=nx;c.v*=.8}else if(carFree(c.x,ny,c.a)){c.y=ny;c.v*=.8}
  else{if(Math.abs(c.v)>40){C1.shake=Math.max(C1.shake,.35);sfx('thump',.5)}c.v*=-.3}
  // турель
  let aim=null;
  if(mouse.on&&!touch.on)aim=Math.atan2(mouse.y+camY-c.y,mouse.x+camX-c.x);
  else if(touch.aim&&touch.aim.moved)aim=Math.atan2(touch.aim.y-touch.aim.oy,touch.aim.x-touch.aim.ox);
  if(aim===null){let best=null,bd=150;for(const z of L.zs){if(z.dead)continue;const d=D2(z.x,z.y,c.x,c.y);if(d<bd){bd=d;best=z}}aim=best?Math.atan2(best.y-c.y,best.x-c.x):c.a}
  c.ta+=angDiff(aim,c.ta)*Math.min(1,dt*14);
  if(c.cd>0)c.cd-=dt;if(c.oh>0){c.oh-=dt;if(c.oh<=0)c.heat=.3}else c.heat=Math.max(0,c.heat-dt*.32);
  const firing=free&&((C1.mdown&&mouse.on&&!touch.on)||X.touchFiring());
  if(firing&&c.cd<=0&&c.oh<=0){c.cd=.085;c.heat+=.034;c.flash=.05;sfx('rifle',.55);
    const a=c.ta+rnd(-.05,.05),bx=c.x+Math.cos(c.ta)*16,by=c.y+Math.sin(c.ta)*16;c.buls.push({x:bx,y:by,vx:Math.cos(a)*460,vy:Math.sin(a)*460,life:.6});
    if(c.heat>=1){c.oh=1.8;sfx('power',.5);note('Турель перегрелась! Дави их, пока остывает')}}
  for(const b of c.buls){for(let s=0;s<4&&b.life>0;s++){b.x+=b.vx*dt/4;b.y+=b.vy*dt/4;
      if(E.gAt(b.x,b.y)===1){b.life=0;break}
      for(const z of L.zs){if(z.dead)continue;if(D2(b.x,b.y,z.x,z.y)<z.r+2.5){X.hurtZ(z,22,Math.atan2(b.vy,b.vx),30);sfx('hit',.6);b.life=0;break}}}
    b.life-=dt}
  c.buls=c.buls.filter(b=>b.life>0);
  // перекрёстки: из дворов вываливаются толпы
  CROSS.forEach((cy,i)=>{if(!c.spawned[i]&&c.y<cy+260){c.spawned[i]=true;for(let k=0;k<7;k++){Zn(8+k*5,cy+10+k*10,{st:'chase',hp:70,max:70});(k%2?Zf:Zn)(470-k*5,cy+12+k*10,{st:'chase',hp:60,max:60})}sfx('groan',1.5)}});
  // зомби
  c.clung=0;const sp=Math.abs(c.v);
  for(const z of L.zs){if(z.dead)continue;const d=D2(z.x,z.y,c.x,c.y);if(d>420&&z.st!=='chase')continue;
    if(z.flash>0)z.flash-=dt;if(z.stun>0)z.stun-=dt;if(z.cd>0)z.cd-=dt;if(z.lunge>0)z.lunge-=dt;if(z.wind>0)z.wind-=dt;
    if(z.kbx||z.kby){zMove(z,z.kbx*dt,z.kby*dt);const k=Math.exp(-9*dt);z.kbx*=k;z.kby*=k;if(Math.abs(z.kbx)+Math.abs(z.kby)<2)z.kbx=z.kby=0}
    if(z.st==='idle'){if(d<230){z.st='chase';if(Math.random()<.3)sfx('groan')}else continue}
    // таран
    const fx=c.x+Math.cos(c.a)*9,fy=c.y+Math.sin(c.a)*9,bx=c.x-Math.cos(c.a)*9,by=c.y-Math.sin(c.a)*9;
    const hitD=Math.min(D2(z.x,z.y,fx,fy),D2(z.x,z.y,bx,by));
    if(hitD<z.r+9){const ang=Math.atan2(z.y-c.y,z.x-c.x);
      if(sp>52&&z.type!=='brute'){X.hurtZ(z,999,c.a,0);c.v*=.86;C1.shake=Math.max(C1.shake,.2);X.blood(z.x,z.y,c.a,10,true);continue}
      if(z.type==='brute'&&sp>52){X.hurtZ(z,sp*.5,c.a,120);c.v=-c.v*.35;C1.shake=Math.max(C1.shake,.6);sfx('thump');continue}
      c.clung++;if(ml>.15&&z.type!=='brute'){z.gr=(z.gr||0)-dt;if(z.gr<=0){z.gr=.35;X.hurtZ(z,12,ang,90);X.blood(z.x,z.y,ang,2,false)}if(z.dead)continue}
      if(z.cd<=0){z.cd=.9;z.lunge=.2;C1.shake=Math.max(C1.shake,.15);sfx('hit',.4);if(z.type==='brute')c.v-=Math.cos(angDiff(ang,c.a))*40;roverDmg(c,z.type==='brute'?16:8)}
      zMove(z,Math.cos(ang)*(z.r+9-hitD),Math.sin(ang)*(z.r+9-hitD));
    }
    if(z.stun>0)continue;
    if(z.type==='thrower'){z.thr-=dt;if(d<170&&z.thr<=0){z.thr=rnd(1.8,2.6);const a=Math.atan2(c.y-z.y,c.x-z.x);L.ebuls.push({x:z.x,y:z.y,vx:Math.cos(a)*120,vy:Math.sin(a)*120,life:1.6});z.lunge=.25;sfx('swing',.5)}if(d<120)continue}
    const dir=Math.atan2(c.y-z.y,c.x-z.x),zs=z.sp*(z.type==='fast'?1.15:1.25);
    if(hitD>z.r+10){zMove(z,Math.cos(dir)*zs*dt,Math.sin(dir)*zs*dt);z.ph+=dt*zs*.32}
    z.a+=angDiff(dir,z.a)*Math.min(1,dt*6);
  }
  const zs=L.zs;
  for(let i=0;i<zs.length;i++){const a=zs[i];if(a.dead||a.st!=='chase')continue;for(let j=i+1;j<zs.length;j++){const b=zs[j];if(b.dead||b.st!=='chase')continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.r+b.r+1;if(d<m&&d>.01){const p=(m-d)/2;zMove(a,-dx/d*p,-dy/d*p);zMove(b,dx/d*p,dy/d*p)}}}
  for(let i=zs.length-1;i>=0;i--)if(zs[i].dead)zs.splice(i,1);
  for(const b of L.ebuls){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(E.gAt(b.x,b.y)===1)b.life=0;
    else if(D2(b.x,b.y,c.x,c.y)<12){b.life=0;sfx('thump',.3);for(let i=0;i<5;i++)L.fx.push({x:b.x,y:b.y,vx:rnd(-40,40),vy:rnd(-40,40),life:.3,c:'#6a6a5a'});if(!c.thrNote){c.thrNote=true;note('Бам! Мусор отскочил от брони. В машине тебя не достать')}}}
  L.ebuls=L.ebuls.filter(b=>b.life>0);
  for(const p of L.fx){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.dec&&p.life<=0){L.dx.fillStyle='rgba(110,8,14,.8)';L.dx.fillRect(Math.round(p.x),Math.round(p.y),1,1)}}
  L.fx=L.fx.filter(p=>p.life>0);
  // камера с упреждением
  const la=clamp(c.v,0,110)*.6,tx=clamp(c.x-W/2+Math.cos(c.a)*la,0,DW-W),ty=clamp(c.y-H/2+Math.sin(c.a)*la,0,DH-H);
  C1.cx+=(tx-C1.cx)*Math.min(1,dt*5);C1.cy+=(ty-C1.cy)*Math.min(1,dt*5);camX=Math.round(C1.cx);camY=Math.round(C1.cy);
  // Т2: зомби прыгает на крышу — стряхни резким поворотом или тормозом
  if(!c.end&&!dlg){if(!c.roof){c.roofT-=dt;if(c.roofT<=0&&(c.R?(c._s>300&&c._s<c.R.L-300):(c.y<DH-400&&c.y>500))){c.roof={t:0,hp:3,pa:c.a,pv:c.v};note('Зомби на крыше! Резко поверни или тормозни');sfx('thump',.7);C1.shake=.4}}
    else{const R=c.roof;R.t+=dt;const turn=Math.abs(angDiff(c.a,R.pa))/Math.max(dt,.001),brake=(R.pv-c.v)/Math.max(dt,.001);if(turn>2.4||brake>160)R.hp-=dt*6;R.pa=c.a;R.pv=c.v;
      if(R.t%1<dt)roverDmg(c,6);if(R.hp<=0){c.roof=null;c.roofT=rnd(12,18);const z=Zf(c.x+Math.cos(c.a+1.6)*16,c.y+Math.sin(c.a+1.6)*16,{st:'chase'});z.stun=.8;note('Стряхнули!');sfx('thump')}}}
  // Т2: ворота ТЦ — протарань трижды
  if(c.gate>0&&c.y<270&&c.y>236){const sp=c._sp||0;if(sp>50&&!c.gHit){c.gHit=1;c.gate--;C1.shake=1;sfx('clang');sfx('thump');c.v=-c.v*.5;roverDmg(c,5);note(c.gate>0?'Ворота держатся! Ещё таран: '+c.gate:'Ворота вынесли!');if(c.gate<=0){E.gfill(96,232,384,240,0)}}}
  if(c.y>275)c.gHit=0;c._sp=Math.abs(c.v);
  // финиш
  if(!c.end&&(c.R?(c._s>c.R.L-70&&c.y<c.R.pts[c.R.pts.length-1][1]+80):c.y<190)){c.end=true;C2.driveKills=PS.kills-c.kills;X.go(()=>playC2(CUT_MALL,()=>sec2('mall1'),'depart'))}
}
function roverDmg(c,d){if(c.end)return;const g=(window.UP&&UP.SV().car)||{};d*=1.3*(1-.3*(g.arm|0));/* 04.11: проще */c.hp-=d;if(c.hp<=0){c.hp=100;note('Land Rover заглох! Облепили.');X.loseLife()}}
function carRender(){
  const c=CAR;ctx.imageSmoothingEnabled=false;ctx.fillStyle='#07050c';ctx.fillRect(0,0,W,H);
  const sx=C1.shake>0?rnd(-3,3)*C1.shake:0,sy=C1.shake>0?rnd(-3,3)*C1.shake:0;
  ctx.save();ctx.translate(Math.round(-camX+sx),Math.round(-camY+sy));
  if(!L._hd){L._hd=1;hdTexture(L.bg,true)}
  ctx.drawImage(L.bg,0,0);ctx.drawImage(L.dec,0,0);
  for(const z of L.zs){if(z.dead||z.y<camY-30||z.y>camY+H+30)continue;X.drawZ(z)}
  if(c.gate>0){for(let x=96;x<384;x+=8){F(x,230,6,12,'#8a8a92');F(x+1,231,4,10,'#b8b8c0')}F(96,229,288,2,'#ffd23a');F(96,242,288,2,'#ffd23a');ctx.font='bold 6px monospace';ctx.textAlign='center';ctx.fillStyle='#ffd23a';ctx.fillText('ТЦ «СИТИ МОЛЛ» · ВОРОТА',240,226);ctx.textAlign='left'}
  drawRoverTop(c.x,c.y,c.a,c.ta,c.flash>0,true);
  if(c.roof){const sx=c.x+Math.sin(tm*9)*1.5,sy=c.y;ctx.save();ctx.translate(Math.round(sx),Math.round(sy));ctx.rotate(c.a+Math.PI/2);ctx.drawImage(X.zBody('fast',3),-12,-12);ctx.restore()}
  for(const b of c.buls){ctx.strokeStyle='#ffe27a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(b.x-b.vx*.02,b.y-b.vy*.02);ctx.lineTo(b.x,b.y);ctx.stroke()}
  for(const b of L.ebuls){F(b.x-2,b.y-2,4,4,'#2a2a26');F(b.x-1,b.y-2,2,1,'#6a6a5a')}
  for(const p of L.fx)F(p.x,p.y,1,1,p.c);
  for(const [x,y] of Q.fires){if(y<camY-30||y>camY+H+30)continue;for(let i=0;i<6;i++){const h=3+Math.abs(Math.sin(tm*9+i+x))*8;F(x-6+i*2,y-h,2,h,i%2?'#ff6a1a':'#ffc040')}}
  treeOver(Q.trees.filter(t=>t[1]>camY-20&&t[1]<camY+H+20))();
  ctx.restore();
  const ox=-camX+sx,oy=-camY+sy;
  sh.globalCompositeOperation='source-over';sh.clearRect(0,0,W,H);sh.fillStyle=`rgba(${L.tint},${L.dark})`;sh.fillRect(0,0,W,H);sh.globalCompositeOperation='destination-out';
  const px=c.x+ox,py=c.y+oy,ca=Math.cos(c.a),sa=Math.sin(c.a);
  radial(sh,px,py,36,'rgba(255,255,255,A)',.9);for(const k of [30,62,98])radial(sh,px+ca*k,py+sa*k,26+k*.35,'rgba(255,255,255,A)',.85);
  for(const l of L.lights)if(l[1]+oy>-60&&l[1]+oy<H+60)radial(sh,l[0]+ox,l[1]+oy,l[2],'rgba(255,255,255,A)',l[3]||.8);
  for(const [x,y] of Q.fires)if(y+oy>-60&&y+oy<H+60)radial(sh,x+ox,y+oy,50,'rgba(255,255,255,A)',.9);
  if(c.flash>0)radial(sh,px+Math.cos(c.ta)*18,py+Math.sin(c.ta)*18,50,'rgba(255,255,255,A)',.8);
  ctx.drawImage(shadow,0,0);
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(ox,oy);
  for(const [x,y] of Q.fires)if(y+oy>-60&&y+oy<H+60)radial(ctx,x,y,34,'rgba(255,120,30,A)',.35);
  for(const gl of L.glow)if(gl[1]+oy>-60&&gl[1]+oy<H+60)radial(ctx,gl[0],gl[1],gl[2],gl[3],gl[4]*(gl[5]?(.8+.2*Math.sin(tm*gl[5])):1));
  ctx.restore();
}
function carUI(){
  const k=ui.width/W;u.setTransform(1,0,0,1,0,0);u.clearRect(0,0,ui.width,ui.height);u.setTransform(k,0,0,k,0,0);
  const c=CAR;if(!c)return;
  panel(4,4,112,30,.72);u.fillStyle='#ff4fa3';u.fillRect(4,4,2,30);
  uiFont(4.4,true);u.fillStyle='#9a92b0';u.fillText('ТУРЕЛЬ',9,10.5);X.hudBar(36,7,60,4,c.heat,c.oh>0?(Math.sin(tm*20)>0?'#ff3a3a':'#8a1a1a'):c.heat>.7?'#ff8a30':'#ffd23a');
  if(c.oh>0){uiFont(4,true);u.fillStyle='#ff6a6a';u.fillText('ПЕРЕГРЕВ',99,10.5)}
  uiFont(4.4,true);u.fillStyle='#9a92b0';u.fillText('КУЗОВ',9,19);X.hudBar(36,16,60,4,(c.hp??100)/100,(c.hp??100)<30?'#ff3a3a':'#3ef0b0');
  uiFont(4.4,false);u.fillStyle='#fff';u.fillText('Раздавлено и убито: '+(PS.kills-c.kills),9,28);
  const prog=c.R?clamp(c._s/c.R.L,0,1):clamp((c.start-c.y)/(c.start-190),0,1);
  panel(W-110,4,106,20,.72);uiFont(4.4,true);u.fillStyle='#9a92b0';u.fillText('РАЙОН · ДО ТЦ «СИТИ МОЛЛ»',W-106,10.5);X.hudBar(W-106,14,98,3,prog,'#ff4fa3');
  uiFont(4,false);u.fillStyle='#ffe27a';u.fillText('Скорость: '+Math.round(Math.abs(c.v)*.6)+' км/ч',W-106,22);
  if(c.clung>2&&!dlg){uiFont(5,true);u.textAlign='center';u.fillStyle=Math.sin(tm*8)>0?'#ff6a6a':'#fff';u.fillText('Облепили машину! Стреляй или сдай назад',W/2,H-30);u.textAlign='left'}
  if(c.banner>0&&!dlg){u.globalAlpha=Math.min(1,c.banner);panel(0,H/2-24,W,36,.6);u.textAlign='center';uiFont(11,true);u.fillStyle='#ff4fa3';u.fillText('РАЙОН',W/2,H/2-6);uiFont(5.5,false);u.fillStyle='#fff';u.fillText('Красный Land Rover. Дави и стреляй',W/2,H/2+4);
    uiFont(4.4,false);u.fillStyle='#9a92b0';u.fillText(touch.on?'Левый стик — руль, правый — турель':'WASD — руль и газ, мышь — турель, ЛКМ — огонь',W/2,H/2+12);u.textAlign='left';u.globalAlpha=1}
  if(mouse.on&&!touch.on&&!dlg){const x=mouse.x,y=mouse.y;u.strokeStyle='#ff4fa3';u.lineWidth=.6;u.beginPath();u.arc(x,y,3,0,TAU);u.moveTo(x-6,y);u.lineTo(x-4,y);u.moveTo(x+4,y);u.lineTo(x+6,y);u.stroke()}
  if(toast){u.globalAlpha=Math.min(1,toast.life*2);uiFont(5.5,true);const w=u.measureText(toast.t).width+12;panel(W/2-w/2,H-42,w,11,.85);u.fillStyle='#fff';u.textAlign='center';u.fillText(toast.t,W/2,H-34.6);u.textAlign='left';u.globalAlpha=1}
  renderDlg();if(touch.on&&state==='play')touchUI();
}

// ---------- ТЦ, 1 ЭТАЖ (и обратный путь в «Золотое яблоко») ----------
const SHOPS=[ // x0,y0,x1,y1, дверь (y центра), сторона, вывеска
  {id:'pharm',x0:8,y0:8,x1:208,y1:140,dy:74,side:'L',t:'АПТЕКА',bg:'#1a5a3a'},
  {id:'hunt',x0:8,y0:148,x1:208,y1:284,dy:216,side:'L',t:'ОХОТА И РЫБАЛКА',bg:'#4a3a1a'},
  {id:'market',x0:8,y0:292,x1:208,y1:432,dy:362,side:'L',t:'СУПЕРМАРКЕТ',bg:'#8a1a1a'},
  {id:'apple',x0:512,y0:8,x1:712,y1:196,dy:102,side:'R',t:'ЗОЛОТОЕ ЯБЛОКО',bg:'#0e0c10'},
  {id:'tech',x0:512,y0:204,x1:712,y1:300,dy:252,side:'R',t:'ЭЛЕКТРОНИКА',bg:'#1a2a5a'},
  {id:'cloth',x0:512,y0:308,x1:712,y1:432,dy:370,side:'R',t:'ОДЕЖДА',bg:'#5a1a4a'},
];
const COSM=[{x:530,y:22,n:'Помада',c:'#d0204a'},{x:610,y:180,n:'Палетка теней',c:'#b070d0'},{x:530,y:180,n:'Тушь',c:'#1a1a1a'},{x:690,y:180,n:'Крем для лица',c:'#f0e8e0'},{x:640,y:60,n:'Сыворотка',c:'#e8c040'}];
const TF={x:612,y:108};
function lvMall1(post){
  L=E.mkLevel(post?'apple':'mall1',720,440);
  B(0,0,720,440,'#16131c');
  floor(216,8,504,432,'mall');
  for(const s of SHOPS){floor(s.x0,s.y0,s.x1,s.y1,s.id==='apple'?'apple':'shop');
    const wx=s.side==='L'?208:504;if(s.id!=='apple'||post)E.gfill(wx,s.dy-14,wx+8,s.dy+14,0)}
  // вход снизу, эскалаторы наверху
  X.drawWalls('#24202c','#4a4458');
  for(const s of SHOPS){const wx=s.side==='L'?208:504;
    for(let y=s.y0;y<s.y1;y+=4){if(Math.abs(y+2-s.dy)<14)continue;B(wx+2,y,4,4,'#4a6a8a');B(wx+3,y,1,4,'#8ab0d0')}
    if(Math.abs(s.dy)>0){const open=s.id!=='apple'||post;if(!open){B(wx,s.dy-14,8,28,'#5a5a62');for(let y=s.dy-14;y<s.dy+14;y+=2)B(wx,y,8,1,'#3a3a40')}
      else if(s.id==='apple'){for(let y=s.dy-16;y<s.dy-12;y+=2)B(wx,y,8,1,'#3a3a40')}}
    const sx=s.side==='L'?wx+10:wx-78;sign(sx,s.dy-24,76,s.t,s.bg,s.id==='apple'?'#e8c040':'#fff')}
  // эскалаторы
  for(const ex of [300,372]){B(ex,12,48,60,'#4a4e56');for(let y=14;y<70;y+=4)B(ex+3,y,42,2,'#6a6e76');B(ex,12,3,60,'#2a2a30');B(ex+45,12,3,60,'#2a2a30')}
  E.gfill(300,8,420,64,2);sign(326,72,68,'▲ 2 ЭТАЖ','#2a2a40','#3ef0b0');
  // фонтан, лавки, кадки
  B(332,232,56,36,'#8a8e96');B(336,236,48,28,'#2a5a8a');for(let i=0;i<6;i++)B(340+i*7,240+(i%2)*10,3,2,'#8ad0ff');E.gfill(332,232,388,268,2);
  for(const [x,y] of [[250,180],[450,180],[250,320],[450,320]])X.lowBox(x-12,y-3,24,6,'#7a5a3a','#9a7a5a');
  for(const [x,y] of [[230,100],[490,100],[230,410],[490,410]])X.plant(x,y);
  B(340,432,40,8,'#5a7a8a');B(342,433,17,6,'#8ab0c8');B(361,433,17,6,'#8ab0c8');
  // начинка магазинов
  const PH=['#e84040','#40a0e8','#f0f0f0','#3ae87a'];
  for(let x=20;x<200;x+=36)shelf(x,20,24,8,'#d8dce0',PH);shelf(20,40,8,88,'#d8dce0',PH);X.lowBox(120,96,60,10,'#2a6a4a','#4a8a6a');
  for(let y=160;y<270;y+=36)shelf(20,y,80,8,'#5a4a32',['#3a5a2a','#6a4a2a','#8a8a8a']);B(130,180,50,20,'#3a4a5a');B(132,182,46,16,'#4a6a7a');E.gfill(130,180,180,200,2);
  for(let x=24;x<180;x+=34)shelf(x,304,10,112,'#8a8e96',post?null:['#c83a3a','#e8c040','#3a8ac8']);
  for(let x=530;x<700;x+=30)shelf(x,216,18,10,'#2a2a30',['#1a2a5a','#3a6ac8']);shelf(530,270,150,8,'#2a2a30',['#3a3a3a']);
  for(const [x,y] of [[540,330],[600,330],[660,330],[540,380],[600,380]]){B(x,y,30,3,'#8a8a8a');for(let i=0;i<5;i++)B(x+2+i*6,y+3,4,8,['#c83a5a','#3a6ac8','#e8e8e8','#2a2a2a','#e8a030'][i]);E.gfill(x,y,x+30,y+11,2)}
  X.cabinet(690,316,18,40);X.cabinet(690,370,18,40);
  // «Золотое яблоко»
  {const G='#c8a040';for(let x=524;x<704;x+=20){X.lowBox(x,12,16,8,'#1a1a1e');B(x+2,13,12,1,G)}for(let x=524;x<704;x+=20){X.lowBox(x,184,16,8,'#1a1a1e');B(x+2,185,12,1,G)}
    X.lowBox(600,96,26,24,'#1a1a1e');B(602,98,22,2,G);B(602,118,22,1,G);for(const [x,y] of [[560,60],[660,60],[560,140],[660,140]]){X.lowBox(x-10,y-5,20,10,'#141418');B(x-8,y-4,16,1,G)}
    L.glow.push([612,108,40,'rgba(255,210,120,A)',.25,2])}
  // свет
  for(let x=260;x<480;x+=80)for(const y of [60,180,300,400]){L.lights.push([x,y,56,.75]);L.glow.push([x,y,24,'rgba(220,240,255,A)',.06])}
  for(const s of SHOPS)L.lights.push([(s.x0+s.x1)/2,(s.y0+s.y1)/2,70,.6]);
  L.dark=post?.62:.5;L.flick=post;L.tint='6,4,12';L.arrows=true;
  if(post){blobs(40,216,8,504,432);debris(120,216,8,504,432);blobs(10,512,8,712,196)}
  X.buildNav();
  pl.x=360;pl.y=410;pl.a=-Math.PI/2;pl.scoot=false;
  if(!post){
    // зомби первого этажа
    for(const [x,y] of [[300,330],[420,340],[360,180],[260,240],[460,240],[300,120],[430,110],[360,300]])Zn(x,y);
    for(const [x,y] of [[250,380],[480,150],[360,140]])Zf(x,y);
    Zn(60,60);Zn(150,120);Zn(176,34,{hid:'cab',wakeR:30});
    Zn(60,214);Zt(160,250);Zf(40,250);
    Zn(46,350);Zn(114,400);Zn(182,320);Zf(80,330);
    Zn(560,250);Zn(650,245);Zt(690,280);
    Zn(560,410);Zn(640,350);Zn(680,362,{hid:'cab',wakeR:26});Zf(680,418,{hid:'cab',wakeR:26});
    Zb(360,200,{hp:280,max:280});
    E.addZ('screamer',300,200);E.addZ('bloat',420,280);E.addZ('shield',100,250);E.addZ('shield',600,370);
    E.addZ('crawler',46,320,{hid:'desk',wakeR:30});E.addZ('crawler',114,330,{hid:'desk',wakeR:30});E.addZ('crawler',600,236,{hid:'desk',wakeR:30});
    E.addItem('ammo',560,280,12);
    E.addItem('syr',40,60);E.addItem('syr',150,120);E.addItem('ammo',30,190,12);E.addItem('shells',90,230,8);E.addItem('shells',170,260,8);E.addItem('ammo',150,170,12);
    E.addItem('moon',150,424);E.addItem('ammo',600,280,10);E.addItem('syr',650,410);
  }else{
    for(const [x,y] of [[560,40],[660,40],[540,110],[690,120],[580,170],[640,170]])Zc(x,y);
    Zc(600,60,{hid:'desk',wakeR:30});Zc(624,150,{hid:'desk',wakeR:30});
    Zcf(540,150);Zcf(680,80);E.addZ('crawler',612,130,{hid:'desk',wakeR:30});E.addZ('bloat',600,40);
    E.addItem('syr',600,24);E.addItem('ammo',420,300,10);
  }
  L.obj=()=>{
    if(!post){const r=['Зачистить первый этаж: осталось '+L.zs.length];if(!L.zs.length)r[0]='Первый этаж чист  ✓';r.push('Эскалатор на 2 этаж (наверху)');return r}
    const n=L.zs.length;const r=[(n?'Зачистить «Золотое яблоко»: '+n:'Магазин чист  ✓'),'Косметика: '+C2.cosm+'/5'+(C2.cosm>=5?'  ✓':''),(C2.tf?'✓ ':'')+'Духи Tom Ford'];
    if(C2.tf&&!n)r.push('Выйти к машине (главный вход)');return r};
  L.onItem=it=>{if(!post&&it.kind==='shells'&&!Q.sh){Q.sh=1;say([['s','Патроны к дробовику. Двенадцатый калибр, как у Аниса.']])}};
  L.onUpdate=()=>{
    const z=SHOPS.find(s=>pl.x>s.x0&&pl.x<s.x1&&pl.y>s.y0&&pl.y<s.y1);const nz=z?z.t:(post?'ТЦ «СИТИ МОЛЛ» · 1 ЭТАЖ':'ТЦ «СИТИ МОЛЛ» · 1 ЭТАЖ');if(nz!==C2.zone){C2.zone=nz;C2.zoneT=2.2}
    if(post&&!Q.inApple&&pl.x>512&&pl.y<196){Q.inApple=1;say([['s','Девочки-консультанты. Вам помочь?'],['s','Нет, спасибо. Я сама посмотрю.']])}
    if(!post&&!Q.clear&&!L.zs.length){Q.clear=1;say([['s','Чисто. Теперь наверх, на второй этаж.']])}
    if(post&&!Q.clear&&!L.zs.length){Q.clear=1;say([['s','Всё. Магазин мой. Теперь спокойно выбираю.']])}
  };
  L.drawUnder=()=>{
    if(!post)return;
    for(const k of COSM){if(k.taken)continue;const y=k.y+Math.sin(tm*3+k.x)*1;F(k.x-2,y-3,4,6,k.c);F(k.x-2,y-4,4,1,'#e8c040');const a=.3+.3*Math.sin(tm*5+k.x);ctx.strokeStyle=`rgba(255,210,58,${a})`;ctx.strokeRect(k.x-4.5,y-6.5,9,11)}
    if(!C2.tf){const y=TF.y+Math.sin(tm*2)*1;F(TF.x-3,y-5,6,8,'#2a1a10');F(TF.x-2,y-4,4,6,'#5a3a1a');F(TF.x-1,y-7,2,2,'#c8a040');F(TF.x-3,y-1,6,1,'#c8a040')}
  };
  L.its=[
    {x:360,y:76,r:18,label:()=>'Эскалатор на 2 этаж',cond:()=>!post,act:()=>{if(L.zs.length){say([['s','Сначала дочищу этаж. Не хочу, чтобы мне в спину дышали. Осталось: '+L.zs.length+'.']]);return}X.go(()=>sec2('mall2'))}},
    {x:360,y:76,r:18,label:()=>'Эскалатор наверх',cond:()=>post,act:()=>say([['s','Наверх больше не надо. Корм у меня.']])},
    {x:360,y:424,r:16,label:()=>post?'Выйти к машине':'Главный вход',act:()=>{
      if(!post){say([['s','Машина подождёт. Сначала корм.']]);return}
      if(!C2.tf||L.zs.length){say([['s',L.zs.length?'В магазине ещё кто-то шуршит. Сначала дочищу.':'Без Tom Ford не уйду. Я ради него и заходила.']]);return}
      if(C2.cosm<5)say([['s','Ой, не всё собрала... Ладно, и так хорошо.']],()=>X.go(()=>playC2(CUT_HOME2,endCh2,'home')));
      else X.go(()=>playC2(CUT_HOME2,endCh2,'home'))}},
    {x:496,y:102,r:16,label:()=>'«Золотое яблоко»',cond:()=>!post,act:()=>say([['s','«Золотое яблоко»... Решётка опущена.'],['s','Ничего. На обратном пути загляну.']])},
    {x:46,y:420,r:18,label:()=>'Полка «Корм для кошек»',act:()=>say([['s','Пусто. Вынесли всё до последнего пакетика.'],['s','Вся надежда на тренера.']])},
  ];
  if(post){
    for(const k of COSM){k.taken=false;L.its.push({x:k.x,y:k.y,r:14,label:()=>'Взять: '+k.n,cond:()=>!k.taken,act:()=>{k.taken=true;C2.cosm++;sfx('pick');X.floatT(k.x,k.y,'+'+k.n.toLowerCase(),'#ff7ab8');
      if(C2.cosm===1)say([['s','Ммм. Это я беру.']]);if(C2.cosm===5)say([['s','Всё! Полный набор. Сейчас бы ещё...']])}})}
    if(C2.cosm)COSM.slice(0,C2.cosm).forEach(k=>k.taken=true);
    L.its.push({x:TF.x,y:TF.y+12,r:16,label:()=>'Взять духи Tom Ford',cond:()=>!C2.tf,act:()=>{C2.tf=true;sfx('pick');X.floatT(TF.x,TF.y,'+Tom Ford','#e8c040');
      say([['s','Tom Ford. Последний флакон на весь город.'],['s','Апокалипсис апокалипсисом, а пахнуть надо хорошо.']])}});
  }
}

// ---------- ТЦ, 2 ЭТАЖ: фудкорт, кино, детская ----------
function lvMall2(){
  L=E.mkLevel('mall2',720,440);B(0,0,720,440,'#16131c');
  floor(178,8,552,432,'mall');floor(8,46,712,120,'mall');
  floor(8,128,170,432,'dark');floor(560,128,712,432,'kids');
  for(let i=0;i<5;i++)floor(40+i*130,8,140+i*130,46,'kitchen');
  E.gfill(170,260,178,300,0);E.gfill(552,260,560,300,0);
  X.drawWalls('#24202c','#4a4458');
  const KI=['ШАВЕРМА','ПИЦЦА','СУШИ','ПЫШКИ','КОФЕ'],KC=['#8a3a1a','#c83a2a','#2a2a2a','#c8a040','#5a3a2a'];
  for(let i=0;i<5;i++){const x=40+i*130;X.lowBox(x,46,70,8,'#8a8478','#aaa498');sign(x+5,36,60,KI[i],KC[i]);B(x+10,14,20,10,'#3a3a40');B(x+60,14,30,8,'#5a5a62')}
  for(let x=210;x<540;x+=56)for(let y=150;y<380;y+=52){X.lowBox(x,y,18,12,'#c8c0b0','#e8e0d0');B(x-5,y+3,4,5,'#c83a3a');B(x+19,y+3,4,5,'#c83a3a')}
  for(let y=150;y<420;y+=20)X.lowBox(20,y,130,5,'#5a1a2a','#7a2a3a');B(16,130,138,4,'#d8d8e0');sign(30,62,110,'КИНО · ЗАЛ 3','#2a1a3a','#ff7ab8');
  L.lights.push([84,128,40,.7]);L.glow.push([84,128,30,'rgba(220,220,255,A)',.3,1]);
  for(const [x,y,c] of [[580,150,'#e83a3a'],[640,180,'#3a8ae8'],[600,250,'#e8c040']])X.lowBox(x,y,40,24,c);sign(570,62,110,'ДЕТСКАЯ ЗОНА','#3a6ac8','#fff');
  for(let i=0;i<40;i++)B(600+hash(i,1)*40,250+hash(1,i)*24,2,2,['#e83a3a','#3a8ae8','#3ae87a','#ffffff'][i%4]);
  B(330,410,60,22,'#4a4e56');for(let x=332;x<388;x+=4)B(x,412,2,18,'#6a6e76');E.gfill(330,410,390,432,2);sign(326,400,68,'▼ 1 ЭТАЖ','#2a2a40','#3ef0b0');
  B(684,64,24,30,'#8a8e96');B(686,66,9,26,'#a8acb4');B(697,66,9,26,'#a8acb4');B(694,58,6,4,'#ff3030');sign(600,96,80,'ФИТНЕС ▲ 3','#1a3a1a','#3ef0b0');
  for(let x=220;x<540;x+=80)for(const y of [90,200,320]){L.lights.push([x,y,56,.7]);L.glow.push([x,y,24,'rgba(220,240,255,A)',.06])}
  L.lights.push([636,300,60,.6],[84,300,30,.4]);
  L.dark=.55;L.tint='6,4,12';L.arrows=true;
  X.buildNav();
  pl.x=360;pl.y=396;pl.a=-Math.PI/2;
  for(let i=0;i<5;i++)Zn(70+i*130,30,{hid:'desk',wakeR:34});
  for(const [x,y] of [[240,180],[300,250],[420,180],[480,300],[260,340],[360,120],[440,90],[520,200],[200,90]])Zn(x,y);
  for(const [x,y] of [[350,228],[470,240],[250,280]])Zf(x,y);
  Zt(60,200);Zt(120,340);Zn(40,280);Zn(140,400);Zf(90,160);
  Zn(600,200);Zn(680,350);Zf(620,400);Zn(650,140,{hid:'cab',wakeR:30});
  Zb(400,240,{hp:300,max:300});Zb(620,90,{hp:300,max:300});
  E.addZ('screamer',380,300);E.addZ('bloat',90,240);E.addZ('bloat',640,380);E.addZ('shield',300,320);E.addZ('shield',500,120);
  for(const [x,y] of [[219,170],[331,222],[443,274],[499,326]])E.addZ('crawler',x,y,{hid:'desk',wakeR:30});
  E.addItem('shells',600,410,6);
  E.addItem('syr',100,30);E.addItem('ammo',360,30,12);E.addItem('moon',620,30);E.addItem('shells',90,424,8);E.addItem('syr',700,420);E.addItem('ammo',230,410,12);E.addItem('shells',500,140,8);
  L.obj=()=>[L.zs.length?'Зачистить второй этаж: осталось '+L.zs.length:'Второй этаж чист  ✓','Лифт в фитнес-зал (справа вверху)'];
  L.onUpdate=()=>{const nz=pl.x<170&&pl.y>120?'КИНО · ЗАЛ 3':pl.x>560&&pl.y>120?'ДЕТСКАЯ ЗОНА':'ФУДКОРТ · 2 ЭТАЖ';if(nz!==C2.zone){C2.zone=nz;C2.zoneT=2.2}
    if(!Q.clear&&!L.zs.length){Q.clear=1;say([['s','Фудкорт свободен. Лифт в углу, едем в зал.']])}};
  L.its=[
    {x:690,y:100,r:18,label:()=>'Лифт в фитнес-зал',act:()=>{if(L.zs.length){say([['s','Пока лифт едет, они меня сожрут. Сначала дочищу. Осталось: '+L.zs.length+'.']]);return}X.go(()=>playC2(CUT_LIFT_GYM,()=>sec2('gym'),'lift'))}},
    {x:360,y:404,r:16,label:()=>'Эскалатор вниз',act:()=>say([['s','Вниз потом. Сначала зал.']])},
    {x:90,y:30,r:16,label:()=>Q.ak?'Стойка шавермы':'Стойка шавермы: под прилавком что-то лежит',act:()=>{if(Q.ak){say([['s','Последняя шаверма на Земле. И та с зомби внутри.']]);return}
      Q.ak=1;say([['s','Последняя шаверма на Земле. И та с зомби внутри.'],['s','Стоп. А под прилавком... Калашников?! Шаурмист явно не только лаваш крутил.'],['s','Тяжёлый. Тридцать патронов в магазине. Беру, дома повешу на стойку.']],()=>{C1.PS.r762=Math.max(C1.PS.r762||0,90);C1.giveWpn('ak',true);if(window.UP)UP.grant('ak');C1.PS.wpn='ak';note('АК-74 · 30 в магазине · [3] или колесо — выбрать')})}},
  ];
}

// ---------- ФИТНЕС-ЗАЛ: зомби-качки и шкафчик тренера ----------
const LOCK={x:600,y:22};
function lvGym(post){
  L=E.mkLevel('gym',640,400);B(0,0,640,400,'#16131c');
  floor(8,8,464,392,'gym');floor(464,168,632,392,'gym');floor(472,8,632,160,'tiles');
  E.gfill(536,160,572,168,0);
  X.drawWalls('#24202c','#4a4458');
  for(let x=20;x<456;x+=4)B(x,0,4,2,(x>>2)%3?'#8ab0d0':'#c8e0f0');
  for(let x=60;x<440;x+=30){X.lowBox(x,10,24,8,'#3a3a40');for(let i=0;i<4;i++)B(x+2+i*6,12,4,4,'#1a1a1e')}
  for(let x=100;x<440;x+=26){X.lowBox(x,362,14,26,'#2a2a30');B(x+2,364,10,4,'#3a8ae8');B(x+3,378,8,6,'#1a1a1e')}
  for(const [x,y] of [[160,150],[240,150],[320,150],[160,250],[240,250],[320,250]]){X.lowBox(x,y,10,26,'#3a2a2a','#5a3a3a');B(x-8,y+4,26,2,'#8a8a90');B(x-10,y+2,3,6,'#1a1a1e');B(x+15,y+2,3,6,'#1a1a1e')}
  for(const [x,y] of [[400,140],[400,240]]){X.lowBox(x,y,8,40,'#5a5a62');B(x-2,y+6,12,2,'#8a8a90')}
  // ринг
  B(480,240,140,140,'#1a3a6a');B(486,246,128,128,'#2a4a8a');for(const [x,y,w,h] of [[480,240,140,3],[480,377,140,3],[617,240,3,140]]){B(x,y,w,h,'#c83a3a');E.gfill(x,y,x+w,y+h,2)}
  B(480,240,3,50,'#c83a3a');E.gfill(480,240,483,290,2);B(480,330,3,50,'#c83a3a');E.gfill(480,330,483,380,2);
  sign(500,226,100,'РИНГ','#c83a3a','#fff');
  // раздевалка
  for(let x=476;x<628;x+=14){X.cabinet(x,10,12,16);B(x+5,14,2,1,'#c8c8c8')}
  for(let y=30;y<150;y+=14){X.cabinet(616,y,12,12)}
  X.lowBox(500,70,80,8,'#7a5a3a','#9a7a5a');X.lowBox(500,110,80,8,'#7a5a3a','#9a7a5a');sign(518,150,80,'РАЗДЕВАЛКА','#2a3a4a','#fff');
  B(20,140,50,16,'#3a3a40');B(22,142,46,4,'#ff4fa3');E.gfill(20,140,70,156,2);sign(16,124,64,'ФИТНЕС','#ff4fa3','#120a1c');
  B(0,186,8,28,'#8a8e96');
  for(let x=80;x<460;x+=90)for(const y of [80,200,320]){L.lights.push([x,y,58,.75]);L.glow.push([x,y,26,'rgba(255,220,255,A)',.07])}
  L.lights.push([550,310,70,.85],[550,80,50,.6]);L.glow.push([550,310,50,'rgba(120,160,255,A)',.18]);
  L.dark=post?.6:.5;L.tint='8,4,14';L.arrows=true;L.bossName='КАЧОК-ЧЕМПИОН';
  if(post){blobs(50,20,20,620,380)}
  X.buildNav();
  pl.x=22;pl.y=200;pl.a=0;
  Q.locker=post;
  if(!post){
    for(const [x,y] of [[120,60],[200,80],[300,60],[380,90],[140,200],[280,200],[360,200],[200,300],[300,320],[420,320],[100,320],[440,200]])Zj(x,y);
    for(const [x,y] of [[175,163],[255,163],[335,263]])Zj(x,y,{hid:'desk',wakeR:30});
    for(const [x,y] of [[520,40],[560,40],[600,90],[520,130]])Zj(x,y);Zj(490,32,{hid:'cab',wakeR:26});Zj(574,32,{hid:'cab',wakeR:26});
    Zjb(240,120);Zjb(330,300);
    E.addZ('screamer',420,260);E.addZ('bloat',140,330);E.addZ('bloat',380,40);E.addZ('shield',300,120);E.addZ('shield',200,230);
    for(const [x,y] of [[255,263],[175,263],[335,163]])E.addZ('crawler',x,y,{hid:'desk',wakeR:30});
    E.addItem('ammo',60,360,10);
    Q.boss=E.addZ('boss',560,310,{v:130,hp:620,max:620,sp:30});
    E.addItem('syr',30,380);E.addItem('ammo',440,30,12);E.addItem('shells',120,350,8);E.addItem('syr',600,360);E.addItem('shells',500,100,10);E.addItem('ammo',300,380,12);
  }
  L.onKill=z=>{if(z===Q.boss)after(.6,()=>say([['s','Чемпион, говоришь? Не в этот раз.']]))};
  L.obj=()=>{
    if(!post&&L.zs.length)return['Убить всех качков: осталось '+L.zs.length,'Корм — в раздевалке, в шкафчике тренера'];
    if(!C2.food)return['Открыть шкафчик тренера в раздевалке'];return['Лифт вниз (слева)'];
  };
  L.onUpdate=()=>{
    const nz=pl.x>472&&pl.y<160?'РАЗДЕВАЛКА':pl.x>480&&pl.y>240?'РИНГ':'ФИТНЕС-ЗАЛ · 3 ЭТАЖ';if(nz!==C2.zone){C2.zone=nz;C2.zoneT=2.2}
    if(!post&&!Q.clear&&!L.zs.length){Q.clear=1;say([['s','Всё. Тишина. Только железо лязгает.'],['s','Теперь раздевалка. Шкафчик тренера, номер семнадцать.']])}
    if(!Q.ringSaid&&Q.boss&&!Q.boss.dead&&D2(pl.x,pl.y,Q.boss.x,Q.boss.y)<150){Q.ringSaid=1;say([['s','А это кто на ринге... Чемпион района по жиму?'],['s','Осторожно. Он блинами от штанги кидается.']])}
  };
  L.drawUnder=()=>{
    if(!C2.food){const k=(!post&&L.zs.length)?.15:.45+.4*Math.sin(tm*5);ctx.strokeStyle=`rgba(255,210,58,${k})`;ctx.strokeRect(LOCK.x-6.5,LOCK.y-12.5,13,18)}
    else{F(LOCK.x-5,LOCK.y-12,10,16,'#2a2a2e');F(LOCK.x+4,LOCK.y-12,6,16,'#8a8a92')}
  };
  L.its=[
    {x:LOCK.x,y:LOCK.y+8,r:16,label:()=>'Шкафчик тренера №17',cond:()=>!C2.food,act:()=>{
      if(L.zs.length){say([['s','Сначала качки. Не хочу, чтобы меня жали вместо штанги. Осталось: '+L.zs.length+'.']]);return}
      X.go(()=>playC2(CUT_FOOD,()=>{C2.food=true;sec2('gym2')},'food'))}},
    {x:14,y:200,r:16,label:()=>'Лифт вниз',act:()=>{
      if(!C2.food){say([['s','Без корма не уйду. Шкафчик тренера в раздевалке.']]);return}
      X.go(()=>playC2(CUT_LIFT_DOWN2,()=>sec2('apple'),'lift'))}},
    {x:30,y:160,r:14,label:()=>'Стойка администратора',act:()=>say([['s','«Абонемент заморожен в связи с концом света». Смешно.']])},
  ];
}

// ================= КАТ-СЦЕНЫ =================
function liftScene2(t,up,dim){
  F(0,0,W,H,'#0e0e12');const x0=60,y0=16,w=200,h=152,fl=Math.sin(t*23)*Math.sin(t*7)>.6;
  F(x0,y0,w,h,'#4e525a');for(let x=x0;x<x0+w;x+=6)F(x,y0,1,h,'#464a52');F(x0,y0+h-16,w,16,'#26262a');
  F(x0+10,y0+4,w-20,3,fl?'#5a6070':'#e8f0ff');F(x0,y0+92,w,2,'#9aa0a8');F(x0+20,y0+30,40,56,'#8ab0d0');F(x0+22,y0+32,36,52,'#a8c8e0');
  F(x0+w/2-16,y0+12,32,12,'#0a0a0a');ctx.fillStyle='#ff3030';ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.fillText((up?'▲ ':'▼ ')+(up?Math.min(3,2+Math.floor(t/2)):Math.max(1,3-Math.floor(t/1.6))),x0+w/2,y0+21.5);ctx.textAlign='left';
  F(x0+w-40,y0+50,30,22,'#ff4fa3');ctx.fillStyle='#120a1c';ctx.font='bold 6px monospace';ctx.fillText('FIT',x0+w-35,y0+64);
  ctx.save();ctx.translate(150,y0+h-15);ctx.scale(2,2);sideShmak(0,0,t,'stand',true);ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,160,y0+8,90,'rgba(200,220,255,A)',fl?.05:.18);ctx.restore();
  if(fl||dim){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,0,W,H)}
}
function yardGate(t){
  drawHouse(t);ctx.fillStyle='rgba(80,0,10,.3)';ctx.fillRect(0,0,W,H);
  for(let x=0;x<W;x+=6)F(x,136,6,4,(x/6)%2?'#8a7a5a':'#9a8a64');F(250,118,14,10,'#3a4030');F(256,116,12,2,'#1a1a1e');
}
function mallFront(t){
  sky(SKY_RED,12,96);drawFar(120,96,true);
  F(20,30,280,76,'#3a3442');F(20,30,280,3,'#5a5462');for(let x=26;x<294;x+=12)F(x,40,8,30,hash(x,2)<.2?'#ff8a3a':'#1a2030');
  F(70,16,180,14,'#3a1a4a');ctx.fillStyle='#ffd23a';ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.fillText('ТЦ «СИТИ МОЛЛ»',160,26);ctx.textAlign='left';
  F(220,74,60,10,'#ff4fa3');ctx.fillStyle='#120a1c';ctx.font='bold 6px monospace';ctx.fillText('ФИТНЕС 3 ЭТ.',224,81.5);
  F(130,80,60,26,'#5a7a8a');F(132,82,27,24,'#8ab0c8');F(161,82,27,24,'#8ab0c8');F(140,94,10,6,'#2a1010');
  F(0,106,W,74,'#26262c');for(let x=0;x<W;x+=24)F(x,140,12,1,'#8a8a7a');
  for(let i=0;i<6;i++){const k=Math.sin(t*2+i)*3;sidePed(40+i*48+k,150+(i%2)*8,t+i,ZC[i],-1,true)}
}
const CUT_DEPART=[
  {dur:5.2,subs:[[.3,2.6,'s','Ну что, красная. Поехали за кормом.'],[2.7,5,'H','Калитку на замок! Держать периметр!']],draw(t){
    yardGate(t);sideRed(Math.min(150,-60+t*70),176,t,{lights:true,move:t<3,heads:true,aim:Math.sin(t)*.2})}},
  {dur:4.4,subs:[[.3,4.2,null,'(Район. Свой район, а не узнать. До «Сити Молла» четыре километра.)']],draw(t){
    X.cityRuins(400+t*80,t,true);for(let i=0;i<6;i++){const x=mod(W+40-t*120-i*70,W+80)-40;sidePed(x,170,t+i,ZC[i],-1,true)}
    sideRed(110,178,t,{lights:true,move:true,gunner:true,aim:.1});drawSmoke()}},
];
const CUT_MALL=[
  {dur:5,subs:[[.3,2.4,'s','Вот он, «Сити Молл». Зал на третьем этаже.'],[2.6,4.8,'s','Я тут каждый день ходила. С протеиновым коктейлем и в розовых лосинах.']],draw(t){
    mallFront(t);sideRed(Math.min(60,-60+t*80),176,t,{lights:true,move:t<1.5,gunner:true})}},
  {dur:1,lines:[['s','Машину оставлю у входа. Никуда не уезжай, красотка.'],['s','Тренер говорил: корм в раздевалке, в его шкафчике. Номер семнадцать.'],['s','Значит, план такой: первый этаж, эскалатор, фудкорт, лифт в зал.']],draw(t){
    mallFront(t);sideRed(60,176,t,{lights:true});sideShmak(130,172,t,'stand',true)}},
];
const CUT_LIFT_GYM=[
  {dur:1,lines:[['s','Третий этаж. Фитнес.'],['s','Тут тренировались самые здоровые парни района.'],['s','...Значит, и зомби тут будут самые здоровые.'],['s','Ничего. Я тоже не зря ходила на кроссфит.']],draw(t){liftScene2(t,true)}},
];
function lockerShot(t){
  F(0,0,W,H,'#1a1c22');for(let x=0;x<W;x+=48){F(x+2,10,44,150,'#5a6470');F(x+4,12,40,146,'#6a7480');F(x+36,70,4,10,'#a8b0b8');F(x+18,20,12,3,'#3a4048')}
  F(96,10,96,150,'#0e0e12');F(100,14,88,142,'#2a2a30');
  const g=Math.sin(t*3)*.5+.5;ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,144,96,70,'rgba(120,255,160,A)',.15+g*.1);ctx.restore();
  F(116,60,56,74,'#1a1a1e');F(118,62,52,70,'#e8e0d0');F(118,62,52,12,'#ff4fa3');
  ctx.fillStyle='#120a1c';ctx.font='bold 7px monospace';ctx.textAlign='center';ctx.fillText('КОТ-ПРОТЕИН',144,71);
  ctx.font='bold 4px monospace';ctx.fillText('протеиново-',144,84);ctx.fillText('креатиново-',144,90);ctx.fillText('моногидратный',144,96);ctx.fillText('КОШАЧИЙ КОРМ',144,104);
  ctx.fillStyle='#2a8a4a';ctx.font='bold 5px monospace';ctx.fillText('+ 33 ВИТАМИНА',144,114);
  F(128,118,32,10,'#141418');F(131,121,6,4,'#d4ea4f');F(141,121,6,4,'#d4ea4f');ctx.fillStyle='#fff';ctx.font='bold 4px monospace';ctx.fillText('MEOW',144,135);
  F(196,40,52,34,'#f0e890');ctx.fillStyle='#3a3020';ctx.font='4px monospace';ctx.textAlign='left';ctx.fillText('Для Черсика.',199,49);ctx.fillText('1 порция =',199,56);ctx.fillText('1 месяц!',199,62);ctx.fillText('Людям не давать',199,69);ctx.textAlign='left';
}
const CUT_FOOD=[
  {dur:1,lines:[['s','Семнадцатый... Вот он.'],['s','Протеиново-креатиново-моногидратный кошачий корм. С тридцатью тремя витаминами.'],['s','«Одна порция на месяц. Людям не давать». Тренер, ты гений.'],['s','Черсик, держись. Мама везёт тебе бицепсы.']],draw(t){lockerShot(t)}},
];
const CUT_LIFT_DOWN2=[
  {dur:1,lines:[['s','Корм в рюкзаке. Можно домой.'],['s','...Хотя стоп. На первом этаже же «Золотое яблоко».'],['s','Забегу-ка я на пять минут. Пара штучек красивеньких, и сразу домой.'],['s','И духи. Tom Ford. Я заслужила.']],draw(t){liftScene2(t,false)}},
];
function fortHouse(t){
  drawHouse(t);ctx.fillStyle='rgba(60,0,10,.3)';ctx.fillRect(0,0,W,H);
  // решётки на окнах
  for(let x=20;x<300;x+=4)F(x,104,1,46,'rgba(20,20,26,.55)');
  // бетонная стена, колючка, турели, прожекторы
  F(0,128,W,22,'#7a7a78');F(0,128,W,2,'#9a9a98');for(let x=0;x<W;x+=26)F(x,128,1,22,'#5a5a58');
  for(let x=0;x<W;x+=4){F(x,124+(x%8?0:1),3,1,'#b0b0b8')}for(let x=2;x<W;x+=8)F(x,122,1,3,'#b0b0b8');
  for(const x of [40,160,280]){F(x-6,114,12,14,'#3a4030');F(x-4,112,8,2,'#4a5040');ctx.save();ctx.translate(x,113);ctx.rotate(Math.sin(t*.9+x)*.6+Math.PI);F(0,-1,12,2,'#1a1a1e');ctx.restore();F(x-1,116,2,2,Math.sin(t*6+x)>0?'#ff3030':'#5a1010')}
  for(const x of [100,220]){F(x,108,4,20,'#2a2a30');F(x-3,104,10,5,'#3a3a40');ctx.save();ctx.globalCompositeOperation='lighter';const a=Math.sin(t*.8+x)*.5;ctx.translate(x+2,106);ctx.rotate(a-1.6);const g=ctx.createLinearGradient(0,0,120,0);g.addColorStop(0,'rgba(255,250,210,.35)');g.addColorStop(1,'rgba(255,250,210,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(120,-14);ctx.lineTo(120,14);ctx.closePath();ctx.fill();ctx.restore()}
  F(150,134,24,16,'#3a3a40');for(let y=136;y<150;y+=3)F(150,y,24,1,'#2a2a30');
  for(const x of [10,60,210,300])for(let k=0;k<3;k++){F(x+k*8,152,7,1,'#4a4a50');F(x+k*8+3,149,1,7,'#4a4a50')}
}
const CUT_HOME2=[
  {dur:5,subs:[[.3,2.4,null,'(Корм есть. Косметика есть. Tom Ford есть.)'],[2.6,4.8,null,'(Теперь домой. Пока город совсем не развалился.)']],draw(t){
    X.cityRuins(2200+t*140,t,true);for(let i=0;i<5;i++){const x=mod(W+40-t*170-i*80,W+80)-40;sidePed(x,170,t+i,ZC[i],-1,true)}
    sideRed(120,178,t,{lights:true,move:true,gunner:true,aim:Math.sin(t*3)*.3,fire:Math.sin(t*2)>.3});drawSmoke();
    if(Math.random()<.4)cparts.push({x:rnd(0,W),y:rnd(60,110),vx:rnd(-3,3),vy:rnd(-10,-4),life:3,c:'smoke',r:3})}},
  {dur:5.6,subs:[[.3,2.6,'s','Ого... Это наш двор?!'],[2.8,5.4,null,'(Бетонная стена, колючка в три ряда, три турели, прожекторы. Никак не пройти.)']],draw(t){
    fortHouse(t);sideRed(Math.min(140,-60+t*70),176,t,{lights:true,move:t<3,heads:true})}},
  {dur:1,lines:[['H','Стой! Пароль!'],['s','Тётушка, это я!'],['H','Пароль, боец! ...Ладно, свои. Открыть ворота!'],['G','Ну как машинка, дочка?'],['s','Михалыч, турель — огонь! Спасибо!'],['H','Иди уже домой. Твой там с утра решётки варит. Весь двор ему помогал.']],draw(t){
    fortHouse(t);sideRed(140,176,t,{lights:true});sideShmak(206,172,t,'stand')}},
];

// ================= СЮЖЕТ: начало и финал главы в квартире =================
function setFlat(){
  C1.on=false;C1.mode=null;C2.on=true;scene='flat';cut=null;dlg=null;tr=null;S.fade=0;state='play';
  S.step=12;S.alarm=true;S.skladLocked=false;S.bat=S.pistol=true;mapDirty=true;lastRoom=null;camY=0;
  pl.scoot=false;pl.sit=false;lockMove=true;
}
function startCh2(){
  C2.started=true;C2.done=false;C2.food=false;C2.cosm=0;C2.tf=false;
  setFlat();mz2('talk');
  pl.x=170;pl.y=70;pl.a=Math.PI;pl.ma=pl.a;shmak.mode='stand';shmak.x=146;shmak.y=64;shmak.a=0;
  after(.8,()=>say([
    ['c','Мяу. (Миска пустая. Уже третий час.)'],['m','Черсик, я помню. Корма нет нигде. Магазины разграблены.'],
    ['s','Зай, слушай. Мой тренер в зале... он же помешан на спортпите.'],
    ['s','Он сделал свою разработку. Протеиново-креатиново-моногидратный кошачий корм. С кучей витаминов.'],['m','Чего-чего?'],
    ['s','Одной порции хватает надолго. Он оставил его в моём зале, в торговом центре. Специально для Черсика.'],['c','Мяу?! (Креатин? Я в деле.)'],
    ['m','Отлично. Говори, где зал, я сгоняю.'],['s','Нет. Поеду я.'],['m','Даже не думай. Там ад. Я тебя не отпущу.'],
    ['s','Только я знаю, где он его спрятал. Ты будешь неделю этот зал обыскивать.'],
    ['s','А ты пока помоги во дворе. Надо всё укрепить, чтобы ни один зомби сюда не пробрался. И поставь решётки на окна.'],
    ['m','...Ладно. Но тогда бери из оружейной всё, что унесёшь. Дробовик Аниса, рельсотрон, пистолет, биту. Бронежилет надень. Шприцы, самогон.'],['m','И патроны. Все, что есть. И ещё сверху.'],
    ['s','Вот видишь, ты лучший. Вернусь быстрее, чем ты решётки прикрутишь.'],['m','Только вернись. Слышишь? Живой.'],
    ['s','Обещаю. Черсик, жди. Мама едет за суперкормом!'],['c','Мяу! (Возьми двойную порцию.)']],()=>{
      PS.moon=Math.max(PS.moon,1)+2;PS.hp=PS.max;PS.lives=3;if(window.UP)UP.kit(2);
      if(window.UP&&UP.prep)UP.prep('Шмакодявка едет за кормом',()=>X.go(()=>sec2('yard2')));
      else{note('Шмакодявка собирается в оружейной');after(1.4,()=>X.go(()=>sec2('yard2')))}
    }));
}
const SHMAK_BACK=[{x:168,y:198},{x:168,y:150},{x:136,y:58}];
function endCh2(){
  setFlat();mz2('flat');
  // 04.11: Микроб встречает её прямо у входной двери
  pl.x=188;pl.y=196;pl.a=0;pl.ma=0;shmak.x=210;shmak.y=206;shmak.a=Math.PI;shmak.mode='stand';shmak.path=[];
  after(.8,()=>say([['s','Микроб! Я дома!'],['m','Шмакодявка!!!']],()=>{
    shmakGo([{x:199,y:200}],()=>{shmak.mode='stand';shmak.a=Math.PI;pl.a=0;shmak.hug=1.6;for(let i=0;i<10;i++)parts.push({x:shmak.x+8+rnd(-6,6),y:shmak.y+rnd(-6,4),vx:rnd(-6,6),vy:rnd(-22,-10),life:1.6,c:'heart'});
      after(1.7,()=>say([['m','Живая! Целая! Я тут чуть с ума не сошёл.'],['s','Смотри! Суперкорм. Протеиново-креатиново-моногидратный.'],['c','МЯУ!!! (Дай. Дай. Дай.)'],
        ['m','А это что за пакет?'],['s','Это... стратегический запас. Косметика. И Tom Ford.'],['m','Ты ездила за кормом для кота и вернулась с Tom Ford?'],
        ['s','Одно другому не мешает. Ну, показывай, что ты тут натворил.'],
        ['m','Решётки на всех окнах. Сварил из остатков Land Rover и старой кровати со склада.'],
        ['m','Дверь обшил сталью. Во дворе бетонные блоки, три турели Михалыча, колючка в три ряда и прожекторы.'],
        ['m','Ханжа говорит, теперь сюда даже муха без пропуска не пролетит.'],['s','Мой герой. Мы живём в крепости.'],
        ['c','Мяу. (Хватит болтать. Корм.)'],['s','Ладно-ладно. Одну порцию, как тренер велел.'],['m','Интересно, что с ним будет от креатина...'],['c','...']],()=>{C2.done=true;S.fade=.01}));
    });
  }));
}

// ================= ПОДМЕНА ЦИКЛА =================
const _update=update,_render=render;
update=function(dt){
  if(!(C1.on&&C1.mode==='car'))return _update(dt);
  tm+=dt;
  for(const t of timers)t.t-=dt;const due=timers.filter(t=>t.t<=0);timers=timers.filter(t=>t.t>0);due.forEach(t=>t.fn());
  if(toast){toast.life-=dt;if(toast.life<=0)toast=null}
  if(dlg){const Ln=dlg.lines[dlg.i];dlg.shown=Math.min(Ln.t.length,dlg.shown+dt*48)}
  updateMusic(dt);
  if(tr){tr.t+=dt;if(!tr.done&&tr.t>=.5){tr.done=true;tr.fn()}if(tr&&tr.t>=1)tr=null}
  if(!(C1.on&&C1.mode==='car'))return;
  if(C1.over){C1.over.t+=dt;return} // 04.11: смерть в машине — нормальный экран «попробовать снова»
  if(cut){updateCut(dt);return}
  if(CAR&&L&&L.id==='drive')carUpdate(dt);
};
render=function(){
  if(C1.on&&state==='play'&&!cut&&C1.mode==='car'&&CAR){carRender();trFade();carUI();if(C1.over&&C1.deathOv)C1.deathOv();return}
  _render();
  // название зоны поверх интерфейса главы 1
  if(C2.on&&C1.on&&state==='play'&&!cut&&C1.mode==='td'&&C2.zone&&C2.zoneT>0&&!dlg){C2.zoneT-=1/60;
    u.globalAlpha=Math.min(1,C2.zoneT);uiFont(6,true);u.textAlign='center';u.fillStyle='#ff7ab8';u.fillText(C2.zone,W/2,44);u.textAlign='left';u.globalAlpha=1}
};
const _action=action;
action=function(){
  if(state==='end'&&C1.done&&!C2.done){continueCh2();return}
  if(C1.on&&C1.mode==='car'){if(C1.over){if(C1.over.t>.6){const f=C1.retry;C1.over=null;if(f)transition(f)}return}if(dlg){advance();return}if(cut){if(cut.t>.6)nextShot();return}return}
  return _action();
};

// ================= ЭКРАНЫ КОНЦА =================
const _re=renderEnd;
renderEnd=function(){
  if(C2.done){
    panel(0,0,W,H,1);u.textAlign='center';uiFont(16,true);u.fillStyle='#ff2a7a';u.fillText('ГЛАВА 2 ПРОЙДЕНА',W/2+1.5,52+1.5);u.fillStyle='#ffd23a';u.fillText('ГЛАВА 2 ПРОЙДЕНА',W/2,52);
    uiFont(7,true);u.fillStyle='#ff7ab8';u.fillText('Малявочные делишки',W/2,66);
    uiFont(5.5,false);u.fillStyle='#fff';u.fillText('Убито зомби: '+PS.kills+'   ·   Косметика: '+C2.cosm+'/5   ·   Tom Ford: '+(C2.tf?'есть':'нет'),W/2,84);
    u.fillStyle='#3ef0b0';u.fillText('Дом — крепость. Корм у Черсика.',W/2,96);
    u.fillStyle='#9a92b0';u.fillText('Глава 3 — финал. Скоро...',W/2,112);u.fillText(touch.on?'Коснись, чтобы сыграть заново':'R или клик — сыграть заново',W/2,128);u.textAlign='left';return}
  if(C1.done){
    panel(0,0,W,H,1);u.textAlign='center';uiFont(16,true);u.fillStyle='#ff2a7a';u.fillText('ГЛАВА 1 ПРОЙДЕНА',W/2+1.5,58+1.5);u.fillStyle='#ffd23a';u.fillText('ГЛАВА 1 ПРОЙДЕНА',W/2,58);
    uiFont(7,true);u.fillStyle='#3ef0b0';u.fillText('Погром в офисе',W/2,72);
    uiFont(5.5,false);u.fillStyle='#fff';u.fillText('Убито зомби: '+PS.kills+'   ·   Шприцы: '+PS.syr+'   ·   Патроны: '+PS.ammo+'   ·   Дробь: '+PS.shells,W/2,88);
    const k=.75+.25*Math.sin(tm*3);u.fillStyle=`rgba(255,79,163,${k})`;u.fillRect(W/2-90,100,180,16);u.fillStyle='#120a1c';uiFont(6.4,true);u.fillText('▶ ГЛАВА 2: МАЛЯВОЧНЫЕ ДЕЛИШКИ',W/2,110.5);
    uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText(touch.on?'Коснись, чтобы продолжить':'E или клик — продолжить   ·   R — начать игру заново',W/2,128);u.textAlign='left';return}
  _re();
};

// ================= МЕНЮ ГЛАВЫ 2 =================
const MENU2=[['Глава 2 с начала (разговор дома)','talk'],['Двор и красный Land Rover','yard2'],['Поездка по району с турелью','drive'],['Сити Молл: первый этаж','mall1'],['Сити Молл: фудкорт, второй этаж','mall2'],['Фитнес-зал, зомби-качки','gym'],['«Золотое яблоко»','apple'],['Дорога домой и финал','home2']];
const CH2_BTN={x:W-74,y:H-38,w:70,h:12};
function kit2(n){
  const i=MENU2.findIndex(m=>m[1]===n);
  Object.assign(PS,{hp:100,max:100,lives:3,inv:0,wpn:'pistol',ammo:66,shells:36,syr:5,moon:3,hasShotgun:true,mode:'spread',regen:0,rideGain:0,carry:false,food:true,hasAxe:false,hasNail:false,hasExt:false,nails:0,ext:0});
  if(window.UP)UP.kit(2);
  C2.food=i>=6;C2.cosm=0;C2.tf=false;C2.started=true;C2.done=false;C1.done=true;
}
function menuStart2(n){
  C2.menu=null;C1.menu=null;state='play';sfx('click');kit2(n);
  S.bat=S.pistol=true;S.skladLocked=false;S.alarm=true;S.key=true;mapDirty=true;S.fade=0;
  if(n==='talk'){startCh2();return}
  if(n==='home2'){playC2(CUT_HOME2,endCh2,'home');return}
  sec2(n);
}
C2.menuStart=menuStart2;C2.MENU=MENU2;
function continueCh2(){C2.menu=null;state='play';S.fade=0;sfx('click');startCh2()}
const _rt=renderTitle;
renderTitle=function(){
  _rt();if(C1.menu)return;
  const b=CH2_BTN;u.fillStyle='rgba(255,79,163,'+(.75+.25*Math.sin(tm*3+1))+')';u.fillRect(b.x,b.y,b.w,b.h);u.fillStyle='#120a1c';uiFont(5.4,true);u.textAlign='center';u.fillText('ГЛАВА 2 ▸'+(touch.on?'':'  (2)'),b.x+b.w/2,b.y+8.2);u.textAlign='left';
  if(C2.menu){panel(0,0,W,H,.92);u.textAlign='center';uiFont(10,true);u.fillStyle='#ff7ab8';u.fillText('ГЛАВА 2 · МАЛЯВОЧНЫЕ ДЕЛИШКИ',W/2,22);uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText('Выбери, откуда начать (для проверки участков)',W/2,30);u.textAlign='left';
    MENU2.forEach((m,i)=>{const y=38+i*14,sel=C2.menu.sel===i;u.fillStyle=sel?'rgba(255,122,184,.9)':'rgba(255,255,255,.08)';u.fillRect(W/2-90,y,180,11);u.fillStyle=sel?'#120a1c':'#fff';uiFont(5.4,true);u.fillText((i+1)+'. '+m[0],W/2-85,y+7.8)});
    uiFont(4.4,false);u.fillStyle='#9a92b0';u.textAlign='center';u.fillText(touch.on?'Коснись участка. Коснись вне списка — назад':'W/S и E, или клик. Esc — назад',W/2,H-4);u.textAlign='left'}
};
function menuPick2(x,y){const i=Math.floor((y-38)/14);if(x>W/2-90&&x<W/2+90&&i>=0&&i<MENU2.length&&y-38-i*14<=11){menuStart2(MENU2[i][1]);return true}C2.menu=null;return true}
const toXY=e=>({x:(e.clientX-OX)/SC,y:(e.clientY-OY)/SC});
const inBtn=(p,b,pad)=>p.x>=b.x-pad&&p.x<=b.x+b.w+pad&&p.y>=b.y-pad&&p.y<=b.y+b.h+pad;
addEventListener('keydown',e=>{
  if(state==='title'&&!C1.menu){
    if(C2.menu){const m=C2.menu;if(e.code==='KeyW'||e.code==='ArrowUp')m.sel=(m.sel+MENU2.length-1)%MENU2.length;else if(e.code==='KeyS'||e.code==='ArrowDown')m.sel=(m.sel+1)%MENU2.length;
      else if(['KeyE','Space','Enter'].includes(e.code)){if(!e.repeat&&m.sel>=0)menuStart2(MENU2[m.sel][1])}else if(e.code==='Escape')C2.menu=null;
      else if(/^Digit[1-8]$/.test(e.code)){const i=+e.code[5]-1;if(MENU2[i])menuStart2(MENU2[i][1])}
      e.preventDefault();e.stopImmediatePropagation();return}
    if(e.code==='Digit2'){C2.menu={sel:0};sfx('click');e.preventDefault();e.stopImmediatePropagation();return}
  }
  if(state==='end'&&C1.done&&!C2.done&&['KeyE','Space','Enter'].includes(e.code)&&!e.repeat){continueCh2();e.preventDefault();e.stopImmediatePropagation();return}
  if(state==='end'&&C2.done&&e.code==='KeyR'){location.hash='';}
},true);
addEventListener('mousedown',e=>{
  const p=toXY(e);
  if(state==='title'&&!C1.menu){
    if(C2.menu){menuPick2(p.x,p.y);e.stopImmediatePropagation();return}
    if(inBtn(p,CH2_BTN,0)){C2.menu={sel:0};sfx('click');e.stopImmediatePropagation();return}
  }
  if(state==='end'&&C1.done&&!C2.done){continueCh2();e.stopImmediatePropagation();return}
},true);
addEventListener('touchstart',e=>{
  for(const t of e.changedTouches){const p=toXY(t);
    if(state==='title'&&!C1.menu){
      if(C2.menu){menuPick2(p.x,p.y);e.preventDefault();e.stopImmediatePropagation();return}
      if(inBtn(p,CH2_BTN,3)){touch.on=true;mouse.on=false;C2.menu={sel:-1};e.preventDefault();e.stopImmediatePropagation();return}}
    if(state==='end'&&C1.done&&!C2.done){touch.on=true;continueCh2();e.preventDefault();e.stopImmediatePropagation();return}
  }
},{capture:true,passive:false});
// быстрый старт по ссылке: #ch2, #yard2, #drive, #mall1, #mall2, #gym, #apple, #home2
const hs=location.hash.slice(1);if(hs){const m={ch2:'talk'}[hs]||hs;if(MENU2.some(x=>x[1]===m))setTimeout(()=>{menuOn=true;menuStart2(m)},60)}
C2.CUTS={CUT_DEPART,CUT_MALL,CUT_LIFT_GYM,CUT_FOOD,CUT_LIFT_DOWN2,CUT_HOME2};
C2.get=()=>({L:E.L,CAR,Q,PS,scene,state,cut,dlg});
if(window.HDS){sideShmak=HDS.shmak(sideShmak)}
})();
