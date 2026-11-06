// =====================================================================
//  ГЛАВА 5 — «Италия». Шмакодявка и Валера на гидросамолёте
//  летят за Олесей: пляж → приморский городок → площадь у Колизея →
//  улочки и канализация → вилла с бассейном → кабриолет → домой.
//  Подключается после kit56.js. Наружу: window.C5.
// =====================================================================
(function(){
'use strict';
if(!window.K56){console.warn('level5: нет kit56');return}
const K=K56,X=C1.X,E=C1.engine,PS=C1.PS,TAU=Math.PI*2,D2=K.D2,angDiff=K.angDiff,Q=K.Q,B=K.B,sfx=X.sfx,TOP=HQ.top;
const C5={on:false,done:false,started:false,sec:null,menu:null,kills0:0,flags:{parm:false,coin:false,pizza:false}};window.C5=C5;
const hold=K.hold;

// ================= МУЗЫКА =================
K.addMusic([['unmix','unmix.mp3'],['trance','trance.mp3'],['smajte','smajte.mp3'],['tommy','tommy.mp3'],['smoke','smoke.mp3'],['rampage','rampage.mp3'],['bunker','bunker.mp3'],['misund','misunderstanding.mp3']]);
const MZ5={call:'melancholy',cs:'booyaka',vaska:'intro',pier:'intro',fly:'smajte',beach:'mind',town:'unmix',colos:'histplace',alley:'fuckedup',sewer:'bunker',villa:'misund',cabrio:'smoke',home:'neuro',party:'flat',final:'lych'};
C5.MZ=MZ5;const mz5=k=>K.music(MZ5[k]);

// ================= ШМАКОДЯВКА СВЕРХУ (всё оружие) =================
function drawShmakHero(g,w,carry){
  g.clearRect(0,0,24,24);
  const D='#f59cc8',DD='#cf74a2',DL='#ffc4df',SK='#f2cab2',SKD='#d8a890',HR='#2c1a1f',HL='#4c2e36';
  if(w==='pistol'){P(g,11,15,8,2,SK);P(g,18,14,2,3,SKD);P(g,19,13,6,2,'#151515');P(g,20,12,2,1,'#151515');P(g,11,7,6,2,SK);P(g,16,8,2,3,SKD)}
  else if(w==='bat'){P(g,10,16,7,2,SK);P(g,16,16,2,2,SKD);P(g,2,17,15,2,'#b07434');P(g,2,17,4,2,'#c88a44');P(g,14,17,3,2,'#2a2a2a');P(g,10,6,6,2,SK)}
  else if(w==='shotgun'){P(g,11,14,8,2,SK);P(g,17,14,2,2,SKD);P(g,10,8,10,2,SK);P(g,19,8,2,2,SKD);P(g,6,11,7,3,'#6a4424');P(g,12,11,12,2,'#26262a');P(g,14,13,7,1,'#3a3a40')}
  else if(w==='rail'){P(g,11,14,8,2,SK);P(g,17,14,2,2,SKD);P(g,10,8,10,2,SK);P(g,19,8,2,2,SKD);P(g,8,10,16,4,'#3a4a5a');P(g,10,11,14,1,'#8af0ff');P(g,23,10,2,4,'#c8f8ff')}
  else if(w==='flamer'){P(g,11,14,8,2,SK);P(g,17,14,2,2,SKD);P(g,10,8,10,2,SK);P(g,19,8,2,2,SKD);P(g,9,10,10,4,'#8a6a3a');P(g,18,11,6,2,'#4a4a52');P(g,23,10,2,4,'#2a2a2a');P(g,4,9,5,6,'#cfe8d0')}
  else if(w==='axe'){P(g,10,16,7,2,SK);P(g,16,16,2,2,SKD);P(g,3,17,14,2,'#b8282a');P(g,0,13,5,9,'#8a9098');P(g,0,13,1,9,'#e0e4ea');P(g,10,6,6,2,SK)}
  else if(w==='nail'){P(g,11,15,8,2,SK);P(g,18,15,2,2,SKD);P(g,17,12,8,5,'#e8a020');P(g,18,13,6,1,'#2a2a2a');P(g,11,7,6,2,SK);P(g,16,8,2,3,SKD)}
  else if(w==='ext'){P(g,11,15,8,2,SK);P(g,18,14,2,2,SKD);P(g,11,7,8,2,SK);P(g,18,8,2,2,SKD);P(g,15,8,5,9,'#c8202a');P(g,16,8,1,9,'#e85a5a');P(g,19,10,5,1,'#2a2a2a')}
  else if(carry){P(g,10,4,8,2,SK);P(g,10,18,8,2,SK)}
  else{P(g,10,3,6,2,SK);P(g,15,3,1,2,SKD);P(g,10,19,6,2,SK);P(g,15,19,1,2,SKD)}
  ell(g,11,12,4.2,7.2,D);ell(g,9.6,12,2.6,6.4,DD);P(g,14,7,1,10,DL);P(g,11,5,3,1,SK);P(g,11,18,3,1,SK);
  ell(g,7.5,12,4.4,3.2,HR);P(g,2,11,4,3,HR);P(g,5,12,4,1,HL);ell(g,12,12,4,4,HR);P(g,10,11,4,1,HL);
  P(g,15,10,2,5,SK);P(g,15,9,1,1,HR);P(g,15,15,1,1,HR);P(g,13,8.5,1,7,'#ff9ae0'); // розовые очки Егора на макушке
  hdShmTop(g,0);outline(g,'#0b0910');
}
const HERO={draw:drawShmakHero,leg:'#f2cab2',shoe:'#0e0e12'};

// ================= ИТАЛЬЯНСКИЕ ЗОМБИ =================
// v 500..503 туристы и местные, 505..506 повара, 510..511 легионеры (щит),
// 520 гладиатор (громила), 530..531 зомби на мопедах (быстрые), 540..541 нонны-крикуньи,
// 545 торговец-метатель помидоров, 550..551 морские (ползуны), 560 садовник (босс)
const ZS='#86a478';
function zIt(v,kind){
  const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});const SK=['#86a478','#7a9a6c','#90aa80'][v%3];
  if(kind==='tour'){const TOPC=['#e85a3a','#3a8ae8','#e8c83a','#ffffff'][v%4];
    P(g,11,6,8,3,TOPC);P(g,18,6,3,3,SK);P(g,11,15,8,3,TOPC);P(g,18,15,3,3,SK);ell(g,11,12,4.6,7.4,TOPC);
    for(let i=0;i<6;i++)P(g,8+(i%3)*2,8+Math.floor(i/3)*6,1,2,v%2?'#3a8a3a':'#e83a8a'); // гавайка
    if(v%2){P(g,5,9,3,6,'#2a2a2a');P(g,6,10,1,1,'#8a8a8a')} // фотоаппарат на спине
    ell(g,12,12,4,4,v%2?'#e8d8a0':'#4a3a2a');if(v%2)P(g,10,9,6,1,'#c8a860'); // панама
    P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030');P(g,12,14,1,2,'#6a1a1a')}
  if(kind==='gond'){P(g,11,6,8,3,'#f4f4f4');P(g,18,6,3,3,SK);P(g,11,15,8,3,'#f4f4f4');P(g,18,15,3,3,SK);ell(g,11,12,4.6,7.4,'#f4f4f4');for(let y=6;y<19;y+=2)P(g,7,y,9,1,'#1a2a6a');
    ell(g,12,12,4.2,4.2,'#e8d080');P(g,9,12,7,1,'#c82a2a');P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
  if(kind==='chef'){P(g,11,6,8,3,'#ececec');P(g,18,6,3,3,SK);P(g,11,15,8,3,'#ececec');P(g,18,15,3,3,SK);ell(g,11,12,4.8,7.6,'#ececec');P(g,10,9,2,7,'#c8202a');P(g,13,11,2,2,'#8a1a1a');
    ell(g,11,12,4,4,'#ffffff');ell(g,10,12,3,3,'#f0f0f0');P(g,15,10,2,5,SK);P(g,16,11,1,1,'#ff3030');P(g,16,13,1,1,'#ff3030');P(g,18,14,4,1,'#3a3a3a');P(g,21,13,2,3,'#a8a8b0')} // поварёшка
  if(kind==='leg'){P(g,11,5,8,3,'#a82a2a');P(g,11,16,8,3,'#a82a2a');ell(g,10,12,4.6,7.6,'#a82a2a');ell(g,9,12,3.4,6.6,'#c8a040');for(let y=7;y<18;y+=2)P(g,7,y,6,1,'#8a6a20');
    ell(g,13,12,3.6,3.6,'#a8a8b0');P(g,10,11,7,2,'#d8303a');P(g,15,10,2,5,SK);P(g,16,11,1,1,'#ff3030');P(g,16,13,1,1,'#ff3030');
    P(g,18,1,4,22,'#a82a2a');P(g,19,2,2,20,'#c83a3a');P(g,19,10,2,4,'#e8c040');P(g,18,1,4,1,'#e8c040');P(g,18,22,4,1,'#e8c040')}
  if(kind==='nonna'){P(g,11,7,8,2,'#1a1a1e');P(g,18,6,3,3,'#c8ccd0');P(g,11,15,8,2,'#1a1a1e');P(g,18,15,3,3,'#c8ccd0');ell(g,11,12,3.6,6.8,'#1a1a1e');ell(g,10,12,2.6,6,'#101014');
    ell(g,13,12,3.6,3.4,'#d8d8dc');ell(g,10,12,2,2,'#b8b8c0');ell(g,16.5,12,1.8,2.2,'#120608');P(g,16,11,1,1,'#ff3030');P(g,6,13,3,3,'#6a3a1a');P(g,7,14,1,1,'#a87a3a')} // пучок и скалка
  if(kind==='vespa'){P(g,4,10,18,4,v%2?'#7ac8b8':'#e8d8a0');P(g,3,10,3,4,'#1a1a1e');P(g,20,10,3,4,'#1a1a1e');P(g,18,6,2,12,'#2a2a30');
    ell(g,11,12,3.6,5.6,'#3a5a8a');ell(g,13,12,3.4,3.4,v%2?'#e8302a':'#f4f4f4');P(g,12,9,4,1,'#2a2a2a');P(g,15,11,2,3,SK);P(g,16,11,1,1,'#ff3030')}
  if(kind==='vendor'){P(g,11,6,8,3,'#4a6a3a');P(g,18,6,3,3,SK);P(g,11,15,8,3,'#4a6a3a');P(g,18,15,3,3,SK);P(g,3,1,7,7,'#3a7a2a');P(g,4,2,2,2,'#d8302a');P(g,7,4,2,2,'#d8302a');
    ell(g,11,12,4.6,7.4,'#e8e0c8');P(g,9,8,4,8,'#c8b890');ell(g,12,12,4,4,'#3a2a1a');P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030');P(g,15,12,3,1,'#1a1a1a')}
  if(kind==='sea'){P(g,12,5,10,3,'#4a8a7a');P(g,21,5,3,3,SK);P(g,12,16,10,3,'#4a8a7a');P(g,21,16,3,3,SK);ell(g,11,12,4.4,6.4,'#3a7a6a');ell(g,10,12,3,5.6,'#2a5a5a');
    for(let i=0;i<6;i++)P(g,3+i*2,9+((i*5)%7),1,3,'#3a8a3a');P(g,5,12,4,1,'#e8a0a0');
    ell(g,15,12,3.6,3.6,'#2a4a4a');P(g,17,10,2,5,SK);P(g,18,10,1,1,'#ff3030');P(g,18,14,1,1,'#ff3030');P(g,14,9,2,1,'#e8d8c8')} // ракушка
  outline(g,'#0b0910');return c;
}
function zGlad(){const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});const SK='#6f8f5a',SD=shade(SK,.8);
  P(g,14,3,12,6,SK);P(g,24,3,6,6,SD);P(g,14,23,12,6,SK);P(g,24,23,6,6,SD);
  ell(g,14,16,7.5,11.5,'#7a5a3a');ell(g,12,16,5.5,10,'#5a4028');P(g,10,9,8,2,'#c8a040');P(g,10,21,8,2,'#c8a040');ell(g,15,16,4,7,SK);
  ell(g,18,16,5,5,'#a8a8b0');P(g,14,15,9,2,'#d8303a');P(g,20,13,3,7,'#3a3a40');P(g,22,14,1,1,'#ff2020');P(g,22,18,1,1,'#ff2020');
  P(g,26,2,2,28,'#8a6a40');P(g,25,1,4,2,'#c8ccd4');P(g,28,1,1,4,'#c8ccd4');P(g,28,27,1,4,'#c8ccd4'); // трезубец
  for(let i=0;i<6;i++)P(g,2+i*2,6+((i*7)%20),1,1,'#c8b890'); // сеть
  outline(g,'#0b0910');return c}
function zGardener(){const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});const SK='#7a9a6c';
  P(g,12,3,12,6,'#3a6a2a');P(g,22,4,5,5,SK);P(g,12,23,12,6,'#3a6a2a');P(g,22,23,5,5,SK);
  ell(g,14,16,8,11,'#3a6a2a');ell(g,12,16,6,10,'#2a5a22');P(g,9,10,10,12,'#5a8a3a');P(g,11,12,2,8,'#c8a040');
  ell(g,17,16,5.4,5.4,'#c8b060');ell(g,17,16,3.6,3.6,'#a89040');P(g,19,13,2,7,SK);P(g,21,14,1,1,'#ff2020');P(g,21,18,1,1,'#ff2020');
  P(g,22,8,9,2,'#c8ccd4');P(g,22,22,9,2,'#c8ccd4');P(g,29,8,2,16,'#c8ccd4');P(g,20,10,3,3,'#c82a2a');P(g,20,19,3,3,'#c82a2a'); // огромные садовые ножницы
  for(let i=0;i<8;i++)P(g,4+Math.floor(hash(i,8)*20),4+Math.floor(hash(8,i)*24),1,1,'#7aca4a');
  outline(g,'#0b0910');return c}
for(let v=0;v<4;v++)X.zCache['normal'+(500+v)]=zIt(v,v===3?'gond':'tour');
for(let v=0;v<2;v++){X.zCache['normal'+(505+v)]=zIt(v,'chef');X.zCache['shield'+(510+v)]=zIt(v,'leg');X.zCache['fast'+(530+v)]=zIt(v,'vespa');X.zCache['screamer'+(540+v)]=zIt(v,'nonna');X.zCache['crawler'+(550+v)]=zIt(v,'sea')}
X.zCache['thrower545']=zIt(0,'vendor');X.zCache['brute520']=zGlad();X.zCache['boss560']=zGardener();
const r4=n=>(Math.random()*n)|0;
const Zt=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:500+r4(4),hp:55,max:55,sp:24},o||{}));
const Zch=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:505+r4(2),hp:70,max:70,sp:26},o||{}));
const Zleg=(x,y,o)=>E.addZ('shield',x,y,Object.assign({v:510+r4(2),hp:120,max:120},o||{}));
const Zglad=(x,y,o)=>E.addZ('brute',x,y,Object.assign({v:520,hp:700,max:700,nm:'ГЛАДИАТОР',nmc:'#e8c040'},o||{}));
const Zves=(x,y,o)=>E.addZ('fast',x,y,Object.assign({v:530+r4(2),hp:45,max:45,sp:78,ves:1},o||{}));
const Znon=(x,y,o)=>E.addZ('screamer',x,y,Object.assign({v:540+r4(2),hp:40,max:40},o||{}));
const Zven=(x,y,o)=>E.addZ('thrower',x,y,Object.assign({v:545,hp:50,max:50},o||{}));
const Zsea=(x,y,o)=>E.addZ('crawler',x,y,Object.assign({v:550+r4(2),hp:38,max:38,sp:24},o||{}));
C1.seenT=C1.seenT||{};

// ================= УЧАСТКИ =================
function sec5(n){
  K.sec(C5,n,()=>{
    ({pier:lvPier,beach:lvBeach,town:lvTown,colos:lvColos,alley:lvAlley,sewer:lvSewer,villa:lvVilla})[n]();
    mz5(n);
    const L=E.L;L.hero=HERO;L.healName='Джелато';L.healNote='Джелато! Холодное, сладкое — раны затягиваются.';L.healNone='Джелато кончилось';
    for(const it of L.items)if(it.kind==='syr')it.kind='gel';
  },sec5);
  K.hud=hud5;
}
C5.go=sec5;
const playC5=(shots,onEnd,k)=>K.cut(C5,shots,onEnd,MZ5[k]);
function valera(x,y){const A=K.addAlly('val',x,y);return A}
function hud5(){
  if(Q.timer!=null&&Q.timer>0){const s=Math.ceil(Q.timer);panel(W/2-40,4,80,16,.75);u.textAlign='center';uiFont(4.4,true);u.fillStyle='#9a92b0';u.fillText('ВАЛЕРА ШВАРТУЕТСЯ',W/2,10);uiFont(6,true);u.fillStyle=s<=10?'#3ef0b0':'#ffd23a';u.fillText(Math.floor(s/60)+':'+String(s%60).padStart(2,'0'),W/2,18);u.textAlign='left'}
  const A=Q.allies.find(a=>a.kind==='val');
  if(A&&!A.stay){panel(W-60,H-22,56,18,.7);uiFont(4.2,true);u.fillStyle='#6ad8ff';u.fillText('ВАЛЕРА'+(K.valBuff?' · ПИЦЦА':''),W-57,H-15.5);const k=clamp(1-A.sup/10,0,1);X.hudBar(W-57,H-12,50,3,k,k>=1?'#6ad8ff':'#3a6a8a');uiFont(3.8,false);u.fillStyle='#9a92b0';u.fillText(k>=1?'ПРОЧИСТКА ГОТОВА':'прочистка...',W-57,H-5.5)}
}
// общие украшения итальянских улиц
function house(x,y,w,h,c,win){B(x,y,w,h,c);B(x,y,w,2,shade(c,1.2));B(x,y+h-2,w,2,shade(c,.75));E.gfill(x,y,x+w,y+h,1);
  if(win)for(let wx=x+6;wx<x+w-6;wx+=14){B(wx,y+h-9,8,5,'#2a3a4a');B(wx-1,y+h-9,1,5,'#3a7a4a');B(wx+8,y+h-9,1,5,'#3a7a4a')}}
function tiles(x,y,w,h){for(let yy=y;yy<y+h;yy+=4)for(let xx=x;xx<x+w;xx+=6)B(xx+((yy>>2)%2)*3,yy,5,3,hash(xx,yy)>.8?'#a8482a':'#c05a34');E.gfill(x,y,x+w,y+h,1)}
function umbrella(x,y,c){(Q.crowns||(Q.crowns=[])).push([x,y,9,c]);B(x-1,y-1,2,2,'#e8e8e8')}
function lamp(x,y){B(x-1,y-1,3,3,'#2a2a2a');E.gfill(x-1,y-1,x+2,y+2,2)}
const laundry=list=>()=>{for(const [x0,y0,x1] of list){ctx.strokeStyle='rgba(60,60,60,.7)';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y0+2);ctx.stroke();
  for(let x=x0+4;x<x1-4;x+=9){const c=['#f4f4f4','#e85a8a','#5a9ae8','#f0d040'][(x>>3)%4],sw=Math.sin(tm*2+x)*1;F(x,y0+1+sw,5,6,c)}}};

// ---------- ПИРС НА МОРСКОМ ФАСАДЕ (Васька) ----------
function lvPier(){
  const L=E.mkLevel('pier5',400,260);B(0,0,400,260,'#2a3a4a');
  K.floor(0,0,400,150,'stone');K.floor(0,150,400,260,'sea',2);K.floor(250,150,290,236,'wood');
  for(let x=0;x<400;x+=6)if(x<250||x>=290){B(x,148,4,2,'#3a3a40');}B(0,150,400,1,'#5a5a62');E.gfill(0,148,250,151,2);E.gfill(290,148,400,151,2);
  E.gfill(0,0,400,4,1);E.gfill(0,0,4,260,1);E.gfill(396,0,400,260,1);
  B(0,0,400,10,'#4a5a6a');for(let x=8;x<400;x+=40){B(x,2,24,6,'#8ab0d8')}K.txt(200,24,'МОРСКОЙ ФАСАД','#c8d8e8',6);
  X.lowBox(40,46,40,24,'#9a1818','#d03a30');B(44,50,8,16,'#1c2430');B(70,50,6,16,'#1c2430'); // красный Land Rover
  for(const [x,y] of [[140,100],[200,100],[330,100]]){X.lowBox(x,y,24,6,'#6a4a2a','#8a6a48')}
  for(const x of [100,180,260,360])lamp(x,140);
  // гидросамолёт сверху
  const pg=L.bx;B(292,222,70,6,'#f4f4f8');B(292,222,70,1,'#fff');B(352,214,6,22,'#e8e8ec');B(300,196,10,56,'#e8e8f0');B(300,196,10,2,'#c8202a');B(300,250,10,2,'#c8202a');B(296,218,4,14,'#2a3a50');
  B(292,214,60,2,'#a8a8b0');B(292,232,60,2,'#a8a8b0');B(362,220,2,10,'#3a3a40');E.gfill(292,196,364,252,2);
  pg.fillStyle='#c8202a';pg.font='bold 4px monospace';pg.fillText('ВАЛЕРА-1',318,226);
  L.armed=false;L.dark=0;L.tint='255,200,150';
  X.buildNav();
  pl.x=60;pl.y=90;pl.a=0;pl.ma=0;
  const val={x:270,y:206,a:Math.PI};
  L.npcs.push({draw(){const g=K.L.bx;shadowBlob(val.x,val.y,5);TOP.topValera(cvV.getContext('2d'),true,0);spr(cvV,val.x,val.y,val.a)}});
  L.obj=()=>!Q.met?['Найти Валеру на пирсе']:!Q.check?['Предполётная проверка гидросамолёта']:['Сесть в самолёт'];
  L.onUpdate=()=>{val.a=Math.atan2(pl.y-val.y,pl.x-val.x)};
  L.its=[
    {get x(){return val.x},get y(){return val.y},r:20,label:()=>'Валера',act:()=>{
      if(Q.met){say([['val',Q.check?'Залезай. Только красную кнопку не трогай.':'Щиток в кабине. Щёлкни автоматы, чтобы всё горело зелёным.']]);return}
      Q.met=1;say([['val','О, Шмакодявка! Здоров. В жизни ты громче, чем в дискорде. Я тебя ещё с пирса услышал.'],['s','Валерочка! Спасибо, что согласился.'],
        ['val','Я пока катку не доиграл — уже знал, что полечу. Олеська же наша.'],['s','А это что у тебя?'],
        ['val','Труба от унитаза. Чугунная, советская. Я инженер ВК, у меня другого оружия нет и не надо.'],['val','Стрелять — это твоё. А я по-нашему, по-сантехнически.'],
        ['val','Короче. Нужна предполётная проверка: щиток в кабине. Я пока поплавки гляну.']],()=>note('Предполётная проверка — щиток в кабине'))}},
    {x:288,y:222,r:20,label:()=>Q.check?'Сесть в самолёт':'Предполётная проверка',cond:()=>!!Q.met,act:()=>{
      if(!Q.check){MG.play('P','breaker',{title:'Щиток гидросамолёта',hint:'Щёлкнешь автомат — соседние тоже переключатся. Нужно всё зелёное.'},()=>{Q.check=1;sfx('power',.6);say([['val','Всё зелёное! Красавица. Запрыгивай.']])});return}
      lockMove=true;X.go(()=>{lockMove=false;playC5(CUT_FLY,()=>sec5('beach'),'fly')})}},
    {x:60,y:58,r:18,label:()=>'Красный Land Rover',act:()=>say([['s','Пусть постоит тут. Михалыч обещал забрать.']])},
  ];
  after(.6,()=>{K.zoneBanner('ВАСЬКА · МОРСКОЙ ФАСАД','#8ac8ff');say([['s','Морской фасад. Залив, ветер, чайки. И ни одного зомби.'],['s','Где-то тут пирс Валеры.']])});
}
const cvV=mk(24);cvV.getContext('2d',{willReadFrequently:true});const cvO=mk(24);cvO.getContext('2d',{willReadFrequently:true});

// ---------- ПЛЯЖ: швартовка под огнём ----------
function lvBeach(){
  const L=E.mkLevel('beach5',560,330);B(0,0,560,330,'#3a2a20');
  K.floor(0,40,560,240,'sand');K.floor(0,240,560,256,'wet');K.floor(0,256,560,330,'sea',2);K.floor(370,240,400,318,'wood');
  // набережная и стена городка
  for(let x=0;x<560;x+=40){const c=['#e8b878','#d88a6a','#f0d090','#c8a0b8'][(x/40)%4];B(x,0,40,32,c);for(let wx=x+6;wx<x+36;wx+=12)B(wx,14,6,8,'#3a4a5a')}
  E.gfill(0,0,560,40,1);B(0,32,560,8,'#b8a888');for(let x=0;x<560;x+=8)B(x,36,6,2,'#9a8a6a');
  E.gfill(470,0,510,40,0);K.floor(470,0,510,40,'stone');for(let y=4;y<40;y+=5)B(470,y,40,1,'#8a7e6c');K.txt(490,12,'↑ ГОРОД','#ffffff',5);
  // бар на пляже
  X.lowBox(30,56,90,14,'#7a5a3a','#9a7a58');B(34,58,20,10,'#e8e8f0');B(36,60,16,6,'#bfe8ff');K.txt(75,52,'GELATERIA DEL MARE','#ff5a8a',4);
  X.lowBox(20,90,12,30,'#e8e8f0');
  for(const [x,y,c] of [[160,100,'#e85a5a'],[220,150,'#3a8ae8'],[290,90,'#f0d040'],[320,190,'#e85a8a'],[120,190,'#3ac8a0'],[460,130,'#e8803a']]){umbrella(x,y,c);X.lowBox(x+6,y-4,10,18,'#f4f4f4','#ffffff')}
  X.lowBox(420,180,14,14,'#d8d0c0');B(424,176,6,4,'#c82a2a');K.txt(427,174,'BAGNINO','#c82a2a',3); // вышка спасателя
  // гидросамолёт у пирса
  B(404,286,72,6,'#f4f4f8');B(404,286,72,1,'#fff');B(466,278,6,22,'#e8e8ec');B(412,262,10,54,'#e8e8f0');B(412,262,10,2,'#c8202a');B(408,284,4,10,'#2a3a50');E.gfill(404,262,476,318,2);
  L.dark=0;L.tint='255,220,180';
  for(let i=0;i<4;i++)E.addItem('gel',40+i*14,80);E.addItem('gel',300,220);
  X.buildNav();
  pl.x=386;pl.y=246;pl.a=-Math.PI/2;pl.ma=pl.a;
  const A=valera(388,300);A.stay={x:388,y:300,a:Math.PI/2};
  for(const [x,y] of [[150,140],[250,120],[200,200],[330,140],[90,150],[480,100]])Zt(x,y);
  Zch(60,110);Zsea(260,250);Zsea(150,252);
  Q.timer=null;Q.spawnT=3;Q.vesT=12;
  L.obj=()=>Q.timer>0?['Прикрыть Валеру, пока он швартует самолёт']:Q.moored?(K.alive()?['Добить зомби на пляже: '+K.alive()]:['Подняться в город (лестница справа вверху)']):['Прикрыть Валеру'];
  L.onUpdate=dt=>{
    if(hold())return;
    if(Q.timer>0){Q.timer-=dt;Q.spawnT-=dt;Q.vesT-=dt;
      if(Q.spawnT<=0){Q.spawnT=rnd(4.5,6.5);const n=2+r4(2);for(let i=0;i<n;i++){const x=rnd(20,540);if(Math.abs(x-388)<30)continue;Zsea(x,252,{st:'chase'});for(let k=0;k<5;k++)L.fx.push({x,y:254,vx:rnd(-20,20),vy:rnd(-30,-10),life:.4,c:'#bfe8ff'})}
        if(Math.random()<.6)for(let i=0;i<2;i++)Zt(490+rnd(-10,10),46,{st:'chase'});sfx('groan',1.3)}
      if(Q.vesT<=0){Q.vesT=rnd(14,18);Zves(490,46,{st:'chase'});note('Зомби на мопеде! Не стой на пути!')}
      if(Q.timer<=0){Q.timer=0;Q.moored=1;A.stay=null;sfx('ring');say([['val','Всё! Пришвартовал! Два узла, и ни одного зомби в салоне.'],['s','А я тут, между прочим, полпляжа уложила.'],['val','Плюс сорок. Кайф. Погнали в город, я за тобой.']])}}
    if(Q.started&&!Q.timer&&!Q.moored)Q.timer=90;
  };
  L.its=[{x:490,y:30,r:20,label:()=>'Лестница в город',cond:()=>!!Q.moored,act:()=>{if(K.alive()){say([['val','Сначала зачистим пляж. Не хочу, чтобы самолёт погрызли.']]);return}lockMove=true;X.go(()=>{lockMove=false;sec5('town')})}}];
  after(.6,()=>{K.zoneBanner('ПЛЯЖ · ИТАЛИЯ','#ffd23a');say([['val','Так. Я швартую самолёт. Это минуты полторы. Ты держишь пляж.'],['s','Джелато! Тут бар с джелато!'],['val','Джелато — потом. ...Хотя возьми и мне фисташковое.'],['s','Поехали!']],()=>{Q.started=1})});
}

// ---------- ПРИМОРСКИЙ ГОРОДОК ----------
const ROOMS_T=[['ТАБАЧНАЯ ЛАВКА',80,230,200,340],['ПИЦЦЕРИЯ',420,40,560,140],['ДЖЕЛАТЕРИЯ',60,40,200,140]];
function lvTown(){
  const L=E.mkLevel('town5',640,360);B(0,0,640,360,'#2a2420');
  K.floor(0,140,640,220,'cobble');K.floor(300,0,340,140,'cobble');
  // дома сверху и снизу
  E.gfill(0,0,640,140,1);E.gfill(0,220,640,360,1);E.gfill(300,0,340,140,0); // проход наверх к воротам Колизея
  const cols=['#e8b878','#d88a6a','#f0d090','#c8a0b8','#a8c8a0','#e8a0a0'];
  for(let x=0,i=0;x<640;x+=60,i++){if(x>=300&&x<340)continue;B(x,0,60,140,cols[i%6]);B(x,0,1,140,shade(cols[i%6],.7));B(x,220,60,140,cols[(i+3)%6]);B(x,220,1,140,shade(cols[(i+3)%6],.7))}
  tiles(0,0,300,24);tiles(340,0,300,24);tiles(0,340,640,20);
  // открытые помещения
  K.floor(60,40,200,134,'terra');K.floor(126,134,146,142,'terra');
  K.floor(420,40,560,134,'terra');K.floor(480,134,500,142,'terra');
  K.floor(80,228,200,330,'parq');K.floor(130,218,150,228,'parq');
  X.drawWalls('#c8a080','#8a6a48');
  // вывески
  for(const [x,y,t,c] of [[130,146,'GELATO','#ff5a8a'],[490,146,'PIZZERIA','#e8302a'],[140,216,'TABACCHI','#3a5ae8']]){B(x-20,y-6,40,8,'#f4f0e0');K.txt(x,y,t,c,5)}
  // мебель
  X.lowBox(70,50,60,10,'#e8e8f0');for(let i=0;i<5;i++)B(74+i*11,52,8,6,['#ffb0d8','#9ae8a0','#fff0c0','#c89a6a','#e85a5a'][i]);
  X.lowBox(440,50,30,20,'#8a4a2a','#a86a48');B(446,54,18,12,'#ff7a30');X.lowBox(500,90,24,24,'#c8b890');X.lowBox(530,60,20,40,'#6a4a2a');
  X.lowBox(90,300,100,12,'#6a4a2a','#8a6a48');X.lowBox(170,240,22,14,'#3a3a40');
  for(const [x,y] of [[40,176],[260,160],[380,200],[600,170]])X.lowBox(x,y,12,12,'#6a8a3a');
  for(const [x,y,c] of [[220,180,'#e85a5a'],[560,190,'#3a8ae8']])X.carTop(x,y,c,false);
  for(let i=0;i<3;i++)E.addItem('gel',90+i*20,110);E.addItem('ammo',540,120,30);E.addItem('shells',100,250,12);
  L.dark=0;L.tint='255,210,170';
  X.buildNav();
  pl.x=20;pl.y=180;pl.a=0;pl.ma=0;valera(8,188);
  for(const [x,y] of [[120,170],[200,200],[340,160],[430,190],[520,170],[610,190],[320,90],[330,40]])(Math.random()<.4?Zch:Zt)(x,y);
  Zt(100,80,{hid:'cab',wakeR:30});Zch(470,100);Zt(150,280);Zves(600,160);Zves(320,30);
  L.obj=()=>[Q.signal?'Сигнал Олеси пойман  ✓':'Поймать сигнал Олеси (радио в табачной лавке)',K.valBuff?'Валера сыт пиццей  ✓':'(по желанию) Пицца для Валеры',Q.signal?'Ворота к Колизею — проход наверх':''].filter(Boolean);
  L.onUpdate=()=>K.rooms(ROOMS_T);
  L.its=[
    {x:140,y:318,r:18,label:()=>'Радио за прилавком',cond:()=>!Q.signal,act:()=>MG.play('P','freq',{title:'Радио табачной лавки',label:'Телефон Олеси'},()=>{Q.signal=1;sfx('ring');
      say([['ol','...пш-ш... Шмакодявка?! Это ты?! Вы где?!'],['s','Олеся! Мы в городке у моря! Где твоя вилла?'],['ol','На холме за Колизеем! Сначала площадь, потом улочки с рынком!'],
        ['ol','Ворота виллы с кодом. Код — год на табличке у ворот. Он римскими цифрами написан, сами переведёте?'],['val','Римские цифры? Легко. Я в «Цивилизации» тысячу часов наиграл.'],
        ['ol','И осторожно: в Колизее их тысячи! Я жду, у меня кончаются печенье и терпение!']],()=>note('Ворота к Колизею — проход наверх по центру'))})},
    {x:490,y:100,r:18,label:()=>'Пицца Маргарита',cond:()=>!K.valBuff,act:()=>{K.valBuff=true;C5.flags.pizza=true;sfx('pick');say([['val','Пицца! Настоящая! Из дровяной печи!'],['s','Ешь быстрее, нас ждут.'],['val','*чавк* ...Всё, я на баффе. Труба бьёт в полтора раза больнее.']])}},
    {x:320,y:16,r:20,label:()=>'Ворота к Колизею',act:()=>{if(!Q.signal){say([['s','Сначала узнаем, где Олеся. В табачной лавке было радио.']]);return}lockMove=true;X.go(()=>{lockMove=false;sec5('colos')})}},
  ];
  after(.6,()=>{K.zoneBanner('ПРИМОРСКИЙ ГОРОДОК','#ffd23a');say([['s','Связи нет. Олеся не отвечает уже час.'],['val','В табачных лавках всегда стоит радио. Найдём — поймаем её телефон через него.'],['s','Это так работает?'],['val','В Италии всё так работает.']])});
}

// ---------- ПЛОЩАДЬ У КОЛИЗЕЯ ----------
const FTN={x:360,y:270,r:44};
function lvColos(){
  C1.seenT.shield=1;const L=E.mkLevel('colos5',720,440);B(0,0,720,440,'#2a2420');
  K.floor(0,100,720,440,'stone');
  // Колизей: дуга арок наверху
  E.gfill(0,0,720,100,1);
  for(let x=0;x<720;x+=4){const h=70+Math.round(Math.sin(x/720*Math.PI)*24);B(x,0,4,h,'#c8a878');B(x,h-2,4,2,'#8a7050')}
  for(let row=0;row<3;row++)for(let x=8;x<720;x+=26){const h=70+Math.round(Math.sin(x/720*Math.PI)*24),y=h-20-row*22;if(y<4)continue;B(x,y,14,16,'#3a2a20');B(x+1,y,12,2,'#5a4430')}
  for(let x=180;x<300;x+=4)B(x,0,4,24+((x*7)%14),'#2a2420'); // обрушенная часть
  E.gfill(340,90,380,100,0);K.floor(340,86,380,100,'stone');B(340,80,40,8,'#1a1410'); // арка входа
  // фонтан
  const g=L.bx;g.fillStyle='#d8d0c0';g.beginPath();g.arc(FTN.x,FTN.y,FTN.r,0,TAU);g.fill();g.fillStyle='#a89a86';g.beginPath();g.arc(FTN.x,FTN.y,FTN.r-3,0,TAU);g.fill();
  for(let y=FTN.y-FTN.r;y<FTN.y+FTN.r;y+=4)for(let x=FTN.x-FTN.r;x<FTN.x+FTN.r;x+=4)if(D2(x+2,y+2,FTN.x,FTN.y)<FTN.r-2)E.gfill(x,y,x+4,y+4,2);
  X.lowBox(354,320,12,8,'#5a5a62','#8a8a92');B(358,322,4,4,'#c8a040'); // люк насоса
  // колонны, обелиск, руины
  for(const [x,y,w,h] of [[120,200,40,8],[560,180,8,40],[200,340,30,8],[520,360,8,30],[620,260,40,8],[80,320,8,34]])X.lowBox(x,y,w,h,'#d8d0c0','#f0ece4');
  B(356,150,8,8,'#c8b898');E.gfill(356,150,364,158,1);K.txt(360,148,'SPQR','#5a4a3a',4);
  for(const [x,y,c] of [[100,140,'#e8302a'],[600,140,'#2a2a2a'],[460,400,'#f0d040']])X.carTop(x,y,c,false);
  for(let i=0;i<40;i++){const x=rnd(10,710)|0,y=rnd(110,430)|0;if(E.gAt(x,y)===0)B(x,y,rnd(2,4)|0,1,'#9a8a76')}
  E.gfill(712,280,720,320,0);K.floor(700,280,720,320,'cobble');K.txt(690,276,'→ УЛОЧКИ','#ffffff',5);
  E.addItem('gel',60,420);E.addItem('gel',680,420);E.addItem('ammo',120,400,30);E.addItem('shells',600,410,12);
  L.dark=0;L.tint='255,190,150';
  X.buildNav();
  pl.x=360;pl.y=420;pl.a=-Math.PI/2;pl.ma=pl.a;valera(372,432);
  // орда на площади
  for(let i=0;i<10;i++)Zleg(rnd(80,640),rnd(120,230));for(let i=0;i<14;i++)Zt(rnd(60,660),rnd(130,360));for(let i=0;i<4;i++)Zch(rnd(100,620),rnd(160,330));
  Q.trig.push({x:360,y:390,r:60,fn:()=>{for(const z of L.zs)if(z.st==='idle')z.st='chase';sfx('groan',1.6);C1.shake=.5;
    say([['s','Их тут... сотня?!'],['val','Слишком много! Слушай, фонтан! Если запустить насос на полную — волна снесёт всех!'],['val','Люк насоса перед фонтаном. Прикрой меня — я с трубами разберусь.']],()=>note('Насос фонтана — люк к югу от фонтана'))}});
  L.obj=()=>!Q.wave?['Запустить насос фонтана (люк к югу от фонтана)']:Q.glad&&!Q.gladDead?['Гладиатор!']:K.alive()?['Добить остатки: '+K.alive()]:['В улочки (восточный выход)'];
  L.onUpdate=dt=>{K.trigs();
    if(Q.wr!=null){Q.wr+=dt*120;for(const z of L.zs){if(z.dead||z.washed)continue;const d=D2(z.x,z.y,FTN.x,FTN.y);if(d<Q.wr&&d>Q.wr-30){z.washed=1;const a=Math.atan2(z.y-FTN.y,z.x-FTN.x);X.hurtZ(z,z.type==='brute'?150:999,a,300);X.blood(z.x,z.y,a,6,false)}}
      if(Math.random()<.9)for(let i=0;i<6;i++){const a=rnd(0,TAU);L.fx.push({x:FTN.x+Math.cos(a)*Q.wr,y:FTN.y+Math.sin(a)*Q.wr,vx:Math.cos(a)*30,vy:Math.sin(a)*30,life:.4,c:i%2?'#bfe8ff':'#7ad0f0'})}
      if(Q.wr>420){Q.wr=null;after(1.2,()=>{say([['val','ВОТ ЭТО НАПОР! Сантехника — сила!'],['s','Валера, ты гений!'],['val','Знаю. ...Погоди. Из арки кто-то идёт. Большой.']],()=>{
        Q.glad=1;const z=Zglad(360,104,{st:'chase'});for(let i=0;i<4;i++)Zleg(320+i*26,112,{st:'chase'});sfx('groan',2);C1.shake=.6;K.zoneBanner('ГЛАДИАТОР','#e8c040')})})}}
    if(Q.glad&&!Q.gladDead&&!L.zs.some(z=>!z.dead&&z.v===520)){Q.gladDead=1;say([['val','Гладиатор лёг. Римляне бы оценили.'],['s','Всё, в улочки. Олеся ждёт.']])}
  };
  L.drawUnder=()=>{const a=Q.wave?.95:.6;ctx.fillStyle=`rgba(90,190,230,${a})`;ctx.beginPath();ctx.arc(FTN.x,FTN.y,FTN.r-5,0,TAU);ctx.fill();
    for(let i=0;i<8;i++){const r=(tm*14+i*6)%(FTN.r-6);ctx.strokeStyle=`rgba(230,250,255,${.4*(1-r/(FTN.r-6))})`;ctx.beginPath();ctx.arc(FTN.x,FTN.y,r,0,TAU);ctx.stroke()}
    F(FTN.x-5,FTN.y-5,10,10,'#e8e0d0');if(Q.wave){for(let i=0;i<6;i++)F(FTN.x-1+Math.sin(tm*9+i)*3,FTN.y-10-i*2,2,2,'#e8f8ff')}
    if(Q.wr!=null){ctx.strokeStyle='rgba(190,232,255,.85)';ctx.lineWidth=6;ctx.beginPath();ctx.arc(FTN.x,FTN.y,Q.wr,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(FTN.x,FTN.y,Q.wr-4,0,TAU);ctx.stroke()}
    if(Q.coin){F(FTN.x+14,FTN.y+6,2,2,'#e8c040')}};
  L.its=[
    {x:360,y:334,r:18,label:()=>'Насос фонтана',cond:()=>!Q.wave,act:()=>MG.play('P','pipes',{title:'Насос фонтана',hint:'Вода должна дойти от насоса до фонтана. Крути трубы.'},()=>{
      Q.wave=1;Q.wr=FTN.r;sfx('boom',.8);sfx('power',1.2);C1.shake=1;K.zoneBanner('ВОЛНА!','#7ad0f0')})},
    {x:FTN.x+30,y:FTN.y+36,r:16,label:()=>'Бросить монетку в фонтан',cond:()=>Q.wave&&!Q.coin&&Q.wr==null,act:()=>{Q.coin=1;C5.flags.coin=true;sfx('pick');say([['s','Говорят, если бросить монетку, обязательно вернёшься.'],['val','Вернёмся. Но когда тут будут только туристы. Живые.']])}},
    {x:706,y:300,r:20,label:()=>'В улочки',act:()=>{if(!Q.wave||K.alive()){say([['val','Сзади ещё полно. Сначала разберёмся.']]);return}lockMove=true;X.go(()=>{lockMove=false;sec5('alley')})}},
  ];
  after(.6,()=>{K.zoneBanner('ПЛОЩАДЬ У КОЛИЗЕЯ','#e8c040');say([['s','Колизей... Две тысячи лет стоял. И вот.'],['val','Тише. Легионеры. Со щитами. В лоб не пробьёшь — заходи сбоку.']])});
}

// ---------- УЛОЧКИ И РЫНОК ----------
function lvAlley(){
  const L=E.mkLevel('alley5',760,300);B(0,0,760,300,'#2a2420');
  E.gfill(0,0,760,300,1);
  const cols=['#e8b878','#d88a6a','#f0d090','#c8a0b8','#e8a0a0','#b8c8a0'];
  for(let x=0,i=0;x<760;x+=38,i++){B(x,0,38,300,cols[i%6]);B(x,0,1,300,shade(cols[i%6],.75))}
  K.floor(0,120,760,180,'cobble');K.floor(200,40,420,280,'cobble');K.floor(100,40,140,120,'cobble');K.floor(600,40,640,120,'cobble');K.floor(600,180,640,280,'cobble');K.floor(440,200,520,290,'tile');K.floor(470,180,490,200,'tile');
  K.floor(100,40,200,70,'cobble');K.floor(640,40,720,70,'cobble');
  X.drawWalls('#a87850','#7a5838');
  // баррикада на главной улице
  for(let y=122;y<180;y+=12){X.lowBox(524,y,16,11,'#6a4a2a','#8a6a48')}E.gfill(524,120,544,180,1);X.carTop(546,124,'#c8202a',true);X.carTop(546,150,'#e8e8e8',true);E.gfill(546,120,566,180,1);
  // рынок: прилавки с фруктами
  for(const [x,y] of [[220,70],[300,70],[380,70],[220,220],[300,220],[380,220]]){X.lowBox(x,y,30,14,'#8a6a40','#a88a5a');for(let i=0;i<6;i++)B(x+3+i*4,y+3,3,3,['#e8302a','#f0a020','#3a8a3a','#e8d040','#a83ac8','#f05a3a'][(i+x)%6]);(Q.crowns||(Q.crowns=[])).push([x+15,y+7,12,['#e8302a','#3a8ae8','#f0d040'][(x+y)%3]])}
  B(458,190,44,8,'#f4f0e0');K.txt(480,196,'FORMAGGI','#c8a020',5);X.lowBox(450,260,60,12,'#c8b890');B(470,262,14,8,'#e8c860'); // сырная лавка
  // люк у баррикады
  B(500,146,10,10,'#3a3a42');B(501,147,8,8,'#1a1a20');for(let i=0;i<3;i++)B(502,149+i*2,6,1,'#5a5a62');
  L.drawOver=laundry([[100,60,200],[200,110,320],[340,110,420],[600,60,720],[620,200,640],[40,124,190]]);
  E.addItem('gel',240,260);E.addItem('gel',420,60);E.addItem('ammo',490,230,30);E.addItem('shells',120,90,12);E.addItem('ammo',120,60,20); // 03.11: были за баррикадой, недоступны
  L.dark=0;L.tint='255,200,150';
  X.buildNav();
  pl.x=16;pl.y=150;pl.a=0;pl.ma=0;valera(6,160);
  for(const [x,y] of [[120,140],[180,160],[260,130],[340,170],[420,140],[300,150]])Zt(x,y);
  Znon(260,240);Znon(400,60);Znon(470,232);Zven(330,100);Zven(260,200);Zves(460,150);Zves(110,50);Zch(480,240);
  for(let i=0;i<5;i++)Zt(rnd(210,410),rnd(90,260));Zleg(380,100);Zleg(330,250);
  L.obj=()=>[C5.flags.parm?'Пармезан для Ханжи  ✓':'(по желанию) Пармезан для Ханжи — сырная лавка','Улица перекрыта — спуститься в люк у баррикады'];
  L.its=[
    {x:478,y:268,r:16,label:()=>'Головка пармезана',cond:()=>!C5.flags.parm,act:()=>MG.play('A','backpack',{title:'Пармезан — в рюкзак'},()=>{C5.flags.parm=true;say([['s','Пармезан. Настоящий, кругом. Ханжа будет счастлива.'],['val','Он весит как моя труба.'],['s','Неси, неси.']])})},
    {x:505,y:151,r:16,label:()=>'Люк в канализацию',act:()=>{if(L.zs.some(z=>!z.dead&&D2(z.x,z.y,505,151)<120)){say([['val','Сначала отгони их от люка!']]);return}
      MG.play('A','box',{title:'Валера поддевает люк трубой'},()=>{lockMove=true;say([['val','Канализация! Моя стихия. Тут я каждую трубу по имени знаю.'],['s','Фу. Ладно. Только быстро.']],()=>X.go(()=>{lockMove=false;sec5('sewer')}))})}},
  ];
  after(.6,()=>{K.zoneBanner('УЛОЧКИ И РЫНОК','#ff7a5a');say([['s','Бабушки! Зомби-бабушки!'],['val','Нонны. Они орут — сбегаются все. Сначала их!']])});
}

// ---------- КАНАЛИЗАЦИЯ ----------
function lvSewer(){
  const L=E.mkLevel('sewer5',640,150);B(0,0,640,150,'#141814');
  K.floor(0,30,640,120,'sewer');K.floor(0,64,640,86,'slime',2);
  for(const x of [140,300,470])K.floor(x,64,x+20,86,'stone');
  E.gfill(0,0,640,30,1);E.gfill(0,120,640,150,1);
  for(let x=0;x<640;x+=8){B(x,26,6,4,'#2a3228');B(x,120,6,4,'#2a3228')}
  for(let x=20;x<640;x+=60){B(x,30,6,30,'#4a5a4a');B(x+1,30,1,30,'#6a7a6a')} // трубы по стенам
  B(612,34,16,20,'#3a3a42');for(let y=36;y<54;y+=4)B(614,y,12,1,'#8a8a92');
  L.dark=.72;L.tint='4,12,6';
  L.lights.push([20,50,40,.9],[200,40,40,.7],[380,110,40,.7],[560,40,40,.7],[620,44,40,.9]);L.glow.push([200,40,30,'rgba(140,255,120,A)',.12,2],[380,110,30,'rgba(140,255,120,A)',.12,3]);
  E.addItem('gel',300,100);E.addItem('ammo',470,40,20);
  // глубокий поперечный сток и деревянный мостик через него (сжечь огнемётом за собой)
  K.floor(400,30,424,120,'slime',2);for(let y=30;y<120;y+=6)B(400+((y/6)%2)*2,y,20,1,'#2a4a2a');
  K.floor(400,36,424,58,'wood');for(let x=401;x<424;x+=5)B(x,36,1,22,'#4a3018');B(400,35,24,1,'#3a2410');B(400,58,24,1,'#3a2410');
  // ящик газовой службы с огнемётом
  X.lowBox(350,32,20,10,'#c8a020','#e8c040');B(354,34,12,2,'#c8202a');K.txt(360,30,'GAS','#ffd23a',4);
  X.buildNav();
  pl.x=20;pl.y=46;pl.a=0;pl.ma=0;valera(10,56);
  for(const [x,y] of [[120,50],[200,100],[260,46],[350,104],[420,46],[520,100],[560,50]])Zsea(x,y,{v:550});
  for(let i=0;i<4;i++)E.addZ('crawler',rnd(100,600),rnd(36,58),{hp:40,max:40});
  L.obj=()=>Q.burnt?['Мост сгорел, орда отрезана  ✓','Лестница наверх — к вилле']:Q.horde?['СЖЕЧЬ ДЕРЕВЯННЫЙ МОСТ ОГНЕМЁТОМ!']:Q.flamer?['Перейти мост через сток']:['Пройти по канализации к вилле','Ящик газовой службы у стока'];
  Q.heat=0;
  L.onFlame=(x,y)=>{if(!Q.horde||Q.burnt||Q.burning)return;if(x>392&&x<432&&y>28&&y<66){Q.heat+=.05;if(Q.heat>1.4){Q.burning=2.2;sfx('fire',1);sfx('thump',.6);note('Мост горит!')}}};
  {const ou=L.onUpdate;L.onUpdate=dt=>{if(ou)ou(dt);
    if(!Q.flamer&&pl.x>392){pl.x=390;if(!Q.warnB){Q.warnB=1;say([['val','Стой! Мост гнилой, а за ним тупик с трубами. Сначала глянь ящик газовщиков, там что-то для таких мест.']])}}
    if(Q.flamer&&!Q.horde&&pl.x>436){Q.horde=1;C1.shake=.6;sfx('groan',2);for(let i=0;i<16;i++)Zsea(rnd(10,140),rnd(36,116),{v:550,st:'chase'});for(let i=0;i<4;i++)E.addZ('crawler',rnd(20,120),rnd(36,58),{hp:40,max:40,st:'chase'});
      const A=(Q.allies||[]).find(a=>a.kind==='val');if(A){A.x=pl.x+14;A.y=pl.y+8}
      say([['val','Сзади! Целая орда из сточной трубы!'],['s','Их слишком много!'],['val','Мост деревянный! Жги его, Шмакодявка! Огнемётом, прямо по доскам!']],()=>note('Зажми огонь по мосту, пока не загорится'))}
    if(Q.burning>0){Q.burning-=dt;for(let i=0;i<4;i++)L.fx.push({x:rnd(400,424),y:rnd(36,58),vx:rnd(-8,8),vy:rnd(-30,-10),life:rnd(.3,.7),c:'flame'});
      if(Q.burning<=0){Q.burnt=1;E.gfill(400,30,424,120,2);B(400,36,24,22,'#1a2a1a');for(let y=36;y<58;y+=4)B(400+((y/4)%2)*3,y,18,1,'#3a5a3a');B(402,36,2,22,'#1a1008');B(420,36,2,22,'#1a1008');X.buildNav();
        for(const z of L.zs)if(!z.dead&&z.x>396&&z.x<428)X.hurtZ(z,999,Math.PI/2,0);
        sfx('thump',1.2);C1.shake=.8;say([['val','Горит! Рухнул!'],['s','Пусть теперь плавают.'],['val','Они не плавают. Они тонут. Пошли, пока дым не дошёл.']])}}}}
  {const dw=L.drawUnder;L.drawUnder=()=>{if(dw)dw();if(Q.burning>0||(Q.horde&&!Q.burnt&&Q.heat>0)){const k=Q.burning>0?1:Q.heat/1.4;F(400,36,24,22,'rgba(255,120,30,'+(.15+.35*k)+')')}}}
  L.its=[{x:360,y:46,r:16,label:()=>'Ящик газовой службы',cond:()=>!Q.flamer,act:()=>{Q.flamer=1;sfx('pick');
      say([['s','Ящик газовой службы. Внутри... огнемёт?! Ручной, на баллоне.'],['val','Итальянские газовщики выжигают в стоках крысиные гнёзда. Бери!'],['s','Беру. Пахнет как шашлык у бати Микроба.']],()=>{
        C1.PS.fuel=Math.max(C1.PS.fuel||0,150);C1.giveWpn('flamer',true);if(window.UP)UP.grant('flamer');C1.PS.wpn='flamer';note('Огнемёт! Зажми огонь — струя пламени')})}},
    {x:620,y:44,r:18,label:()=>'Лестница наверх',act:()=>{if(Q.flamer&&!Q.burnt&&Q.horde){say([['val','Сначала мост! Иначе они пойдут за нами до самой виллы!']]);return}lockMove=true;say([['val','Судя по трубам — выходим прямо у виллы. Тут водопровод бассейна.']],()=>X.go(()=>{lockMove=false;sec5('villa')}))}}];
  after(.5,()=>{K.zoneBanner('КАНАЛИЗАЦИЯ','#7aca5a');say([['s','Темно и воняет.'],['val','Это не воняет. Это пахнет работой.']])});
}

// ---------- ВИЛЛА ----------
const POOL={x0:230,y0:200,x1:410,y1:290};
function lvVilla(){
  const L=E.mkLevel('villa5',640,480);B(0,0,640,480,'#2a3020');
  K.floor(0,120,640,470,'grass');K.floor(280,120,360,470,'stone');K.floor(160,110,480,140,'marble');
  K.floor(POOL.x0-12,POOL.y0-12,POOL.x1+12,POOL.y1+12,'marble');K.floor(POOL.x0,POOL.y0,POOL.x1,POOL.y1,'pool',2);
  // вилла
  E.gfill(0,0,640,110,1);B(0,0,640,110,'#f0e0c0');B(0,100,640,10,'#d8c8a8');for(let x=20;x<640;x+=44){B(x,40,20,30,'#3a4a5a');B(x-2,40,2,30,'#5a7a4a');B(x+20,40,2,30,'#5a7a4a')}
  tiles(0,0,640,20);B(296,60,48,40,'#8a5a3a');B(300,64,40,36,'#6a3a2a');B(290,56,60,4,'#e8e8e8');for(let x=292;x<350;x+=4)B(x,56,2,10,'#c8c8c8'); // балкон Олеси
  // стена и ворота снизу
  E.gfill(0,466,640,480,1);for(let x=0;x<640;x+=8)B(x,466,8,14,x%16?'#c8b898':'#b8a888');
  E.gfill(0,110,6,470,1);E.gfill(634,110,640,470,1);B(0,110,6,360,'#c8b898');B(634,110,6,360,'#c8b898');
  B(292,462,56,10,'#2a2a2e');for(let x=294;x<348;x+=5)B(x,462,2,10,'#6a6a72');E.gfill(292,460,348,472,1);
  B(356,448,14,10,'#d8c8a0');K.txt(363,455,'MCMLXXXVIII','#5a3a1a',2.6); // табличка
  // живые изгороди, кипарисы, оранжерея, домик насоса, гараж
  for(const [x,y,w,h] of [[30,150,120,10],[490,150,120,10],[30,400,90,10],[520,400,90,10],[180,330,10,80],[450,330,10,80]]){X.lowBox(x,y,w,h,'#2a6a2a','#3a8a3a')}
  for(const [x,y] of [[20,200],[620,200],[20,300],[620,300],[200,440],[440,440]])K.cypress(x,y);
  X.lowBox(50,190,100,70,'#c8e0e8','#e8f8ff');for(let x=54;x<146;x+=10)B(x,192,6,66,'#a8d0d8');K.txt(100,186,'ОРАНЖЕРЕЯ','#ffffff',4);E.gfill(90,250,110,260,0);
  X.lowBox(520,230,50,40,'#d8c8a8','#f0e0c0');B(536,266,12,4,'#2a2a2e');K.txt(545,226,'НАСОС','#3a3a42',4);
  X.lowBox(540,380,70,40,'#c8b898','#e0d0b0');B(552,418,46,4,'#2a2a2e');K.txt(575,376,'ГАРАЖ','#3a3a42',4);
  for(const [x,y] of [[250,170],[390,170],[250,320],[390,320]])X.lowBox(x,y,16,6,'#f4f4f4','#ffffff');
  E.addItem('gel',100,440);E.addItem('gel',560,180);E.addItem('ammo',60,440,40);E.addItem('shells',600,440,16);E.addItem('gel',320,150);
  L.dark=.12;L.tint='255,150,90';L.sunTint='rgba(255,140,60,.08)';
  X.buildNav();
  pl.x=320;pl.y=478;pl.a=-Math.PI/2;pl.ma=pl.a;
  // старт снаружи у ворот: игрок за воротами (небольшой карман)
  E.gfill(280,472,360,480,0);pl.y=476;
  valera(336,477);
  Q.wave=0;Q.poolT=4;Q.drained=false;
  L.obj=()=>{const o=[];if(!Q.gate)o.push('Открыть ворота: код — год на табличке');else if(Q.wave<4)o.push('Зачистить сад: волна '+Math.max(1,Q.wave)+' из 3');
    if(Q.gate&&!Q.drained)o.push('Слить бассейн — из него лезут (домик насоса справа)');if(Q.wave>=4&&!Q.ol)o.push('Поговорить с Олесей');if(Q.ol&&!Q.bag)o.push('Помочь Олесе с чемоданом');if(Q.bag)o.push('В гараж — к кабриолету');return o};
  L.onUpdate=dt=>{
    if(hold())return;
    if(Q.gate&&!Q.drained&&Q.wave>=1&&Q.wave<4){Q.poolT-=dt;if(Q.poolT<=0){Q.poolT=rnd(4,6);if(L.zs.filter(z=>!z.dead&&z.pool).length<5){const x=rnd(POOL.x0+10,POOL.x1-10),y=Math.random()<.5?POOL.y0-6:POOL.y1+6;Zsea(x,y,{st:'chase',pool:1});for(let k=0;k<6;k++)L.fx.push({x,y,vx:rnd(-30,30),vy:rnd(-30,30),life:.4,c:'#bfe8ff'})}}}
    const nonPool=L.zs.filter(z=>!z.dead&&!z.pool).length;
    if(Q.wave===1&&Q.w1&&nonPool===0){Q.wave=2;after(1,()=>{K.zoneBanner('ВОЛНА 2','#ff7a5a');for(let i=0;i<5;i++)Zleg(300+i*10,440,{st:'chase'});for(let i=0;i<5;i++)Zt(rnd(40,600),rnd(140,180),{st:'chase'});Zves(320,440,{st:'chase'});note('Из-за ворот — легионеры!')})}
    if(Q.wave===2&&nonPool===0&&!Q.w3){Q.w3=1;after(1.2,()=>{Q.wave=3;K.zoneBanner('САДОВНИК','#7aca4a');sfx('groan',2);C1.shake=.8;
      const b=E.addZ('boss',100,262,{v:560,hp:1300,max:1300,sp:30,r:9,st:'chase',nm:'ЗОМБИ-САДОВНИК',nmc:'#7aca4a',ai:'gard',ct:4,th:3,dw:0,ch:0});
      for(let i=0;i<3;i++)Zt(100+rnd(-20,20),280,{st:'chase'});say([['s','Из оранжереи! Огромный!'],['val','Садовник. С секатором. Держись от него подальше, когда он замахивается.']])})}
    if(Q.wave===3&&!L.zs.some(z=>!z.dead&&z.ai==='gard')&&!Q.bossDead){Q.bossDead=1;Q.wave=4;after(.8,()=>{K.ghostAll('#bfe8ff');sfx('power',1);
      say([['val','Подстригли садовника.'],['ol','ШМАКОДЯВКА!!! Я сейчас спущусь! Не уходите!']],()=>{Q.olX=320;Q.olY=100;Q.olWalk=1})})}
    if(Q.olWalk){const tx=320,ty=160;const d=D2(Q.olX,Q.olY,tx,ty);if(d>2){Q.olY+=Math.min(d,60*dt)}else Q.olWalk=0}
    gardener(dt);
  };
  L.npcs.push({draw(){
    if(!Q.ol&&!Q.olY){const b=Math.sin(tm*6)>0?1:0;F(318,58-b,6,6,'#9a6a44');F(319,60-b,4,4,'#f4cdb0');F(316,62,10,6,'#c81e5a');if(b){F(314,56,2,4,'#f4cdb0');F(326,56,2,4,'#f4cdb0')}}
    else if(Q.olY&&!Q.bag){shadowBlob(Q.olX,Q.olY,5);TOP.topOlesya(cvO.getContext('2d'));spr(cvO,Q.olX,Q.olY,Math.PI/2)}}});
  L.drawUnder=()=>{if(Q.drained){const k=Math.min(1,(tm-Q.drT)/2);ctx.fillStyle=`rgba(210,220,225,${k})`;ctx.fillRect(POOL.x0,POOL.y0,POOL.x1-POOL.x0,POOL.y1-POOL.y0);for(let x=POOL.x0;x<POOL.x1;x+=10)F(x,POOL.y0,1,POOL.y1-POOL.y0,`rgba(150,180,190,${k})`);
      ctx.fillStyle=`rgba(60,170,210,${.8*(1-k)})`;ctx.fillRect(POOL.x0,POOL.y0+(POOL.y1-POOL.y0)*k,POOL.x1-POOL.x0,(POOL.y1-POOL.y0)*(1-k))}};
  L.its=[
    {x:320,y:458,r:26,label:()=>'Ворота виллы',cond:()=>!Q.gate,act:()=>MG.play('P','villa',null,()=>{Q.gate=1;sfx('power',.6);for(let x=292;x<348;x+=4)E.gfill(x,460,x+4,472,0);const g=L.bx;g.fillStyle='#4a6a3a';g.fillRect(292,460,56,12);X.buildNav();
      say([['s','Открыто! 1988!'],['val','М — тысяча, CM — девятьсот, LXXX — восемьдесят, VIII — восемь. Цивилизация, детка.'],['ol','Шмакодявка! Сад полон зомби! И из бассейна лезут!']],()=>{Q.wave=1;Q.w1=1;
        for(const [x,y] of [[60,180],[580,180],[120,320],[520,330],[200,140],[440,140],[100,420],[560,440]])Zt(x,y,{st:'chase'});Zch(300,140,{st:'chase'});Zch(340,140,{st:'chase'});K.zoneBanner('ВОЛНА 1','#ff7a5a')})})},
    {x:545,y:276,r:18,label:()=>'Насос бассейна',cond:()=>Q.gate&&!Q.drained,act:()=>MG.play('P','wires',{title:'Щиток насоса бассейна',hint:'Веди провод в обход искрящего пятна.'},()=>{Q.drained=true;Q.drT=tm;sfx('hiss',1.4);sfx('power',.6);
      for(const z of L.zs)if(z.pool&&!z.dead)X.hurtZ(z,999,0,0);say([['val','Сливаю! Двести кубов — в канализацию. Привет моим трубам.']])})},
    {get x(){return Q.olX||320},get y(){return Q.olY||100},r:28,label:()=>'Олеся',cond:()=>Q.wave>=4&&!Q.olWalk&&!Q.ol,act:()=>{Q.ol=1;
      say([['ol','Шмакодявка!!! Ты прилетела!!! *обнимает*'],['s','Олесечка! Живая!'],['ol','Пять дней! Пять дней на печенье и холодном кофе! Я выучила все песни Челентано!'],
        ['val','Привет. Я Валера. Самолёт, труба, всё такое.'],['ol','Ты тот самый Валера из CS? Шмакодявка про тебя говорила. Говорит, ты лучший снайпер на сервере.'],['val','Врёт. Я второй. Первый — она.'],
        ['ol','Мне нужно собрать чемодан. Две минуты!'],['s','Олеся. Одну.']],()=>note('Помоги Олесе с чемоданом'))}},
    {get x(){return Q.olX||320},get y(){return (Q.olY||100)+4},r:28,label:()=>'Чемодан Олеси',cond:()=>Q.ol&&!Q.bag,act:()=>MG.play('A','backpack',{title:'Чемодан Олеси'},()=>{Q.bag=1;
      const A=K.addAlly('ol',Q.olX,Q.olY);say([['ol','Всё влезло! Почти. Платья, туфли, конспекты... фен.'],['s','Фен?!'],['ol','Он итальянский! Поехали на моём кабриолете — он в гараже. До пляжа десять минут.'],['val','Я сзади. С трубой. Буду отбиваться.']])})},
    {x:575,y:426,r:22,label:()=>'Кабриолет Олеси',cond:()=>!!Q.bag,act:()=>{lockMove=true;X.go(()=>{lockMove=false;startCabrio()})}},
  ];
  after(.5,()=>{K.zoneBanner('ВИЛЛА ОЛЕСИ','#ff5a8a');say([['s','Вот она! Ворота на коде.'],['val','Табличка с цифрами — справа от ворот.']])});
}
// зомби-садовник: рывок с ножницами и секаторы-бумеранги
function gardener(dt){
  const L=E.L;if(hold())return;
  for(const z of L.zs){if(z.dead||z.ai!=='gard')continue;const d=D2(z.x,z.y,pl.x,pl.y),ta=Math.atan2(pl.y-z.y,pl.x-z.x),rage=z.hp<z.max*.5?1.35:1;z.thr=99;
    if(z.ch===1){z.stun=.1;z.cw-=dt;z.a=z.da;if(z.cw<=0){z.ch=2;z.dt=.7;sfx('swing',.5);sfx('clang',.8)}}
    else if(z.ch===2){z.stun=.1;z.dt-=dt;const sp=230*rage*dt,nx=z.x+Math.cos(z.da)*sp,ny=z.y+Math.sin(z.da)*sp;
      if(K.solid(nx,ny,z.r-2)){z.ch=0;z.stun=1.2;C1.shake=.7;sfx('thump');X.floatT(z.x,z.y-18,'ЗАСТРЯЛ!','#ffd23a');z.ct=rnd(4,5)/rage}
      else{z.x=nx;z.y=ny;if(Math.random()<.7)L.fx.push({x:z.x+rnd(-4,4),y:z.y+rnd(-4,4),vx:0,vy:-6,life:.4,c:'#5aaa3a'})}
      if(!z.hitP&&d<z.r+6){z.hitP=1;X.hurtPlayer(22);note('Чик! Садовник прошёлся ножницами!')}
      if(z.ch===2&&z.dt<=0){z.ch=0;z.ct=rnd(4,5.5)/rage}}
    else{z.ct-=dt;z.th-=dt;
      if(z.ct<=0&&d<200&&d>40&&E.los(z.x,z.y,pl.x,pl.y)){z.ch=1;z.cw=.75;z.da=ta;z.hitP=0;X.floatT(z.x,z.y-18,'СТРИЖКА!','#7aca4a')}
      else if(z.th<=0&&d<220&&E.los(z.x,z.y,pl.x,pl.y)){z.th=rnd(2.6,3.6)/rage;const n=rage>1?3:1;for(let i=0;i<n;i++)K.shoot(z.x,z.y,ta+(i-(n-1)/2)*.3,130,12,'shear',{spin:14});sfx('swing',1.4)}}
  }
}
// кодовый замок ворот — римские цифры на табличке
if(window.MG&&MG.P.code){
  const R=(x,y,w,h,c)=>{u.fillStyle=c;u.fillRect(x,y,w,h)},Tt=(s,x,y,c,sz,b,al)=>{uiFont(sz||5,b);u.fillStyle=c;u.textAlign=al||'left';u.fillText(s,x,y);u.textAlign='left'};
  const PX=40,PY=18,PW=240,KP=['1','2','3','4','5','6','7','8','9','⌫','0','✓'];
  MG.P.villa=Object.assign({},MG.P.code,{title:'Ворота виллы',hint:'M = 1000, CM = 900, LXXX = 80, VIII = 8.',col:'#ff5a8a',init(m){m.code='1988';m.in='';m.err=0},
    draw(m){R(PX,PY+12,PW,PH-12,'#2a2a22');R(PX+12,PY+26,116,46,'#c8b898');R(PX+14,PY+28,112,42,'#e8d8b0');Tt('VILLA OLESIA',PX+70,PY+40,'#5a3a1a',5,true,'center');Tt('MCMLXXXVIII',PX+70,PY+56,'#3a2010',8.4,true,'center');R(PX+20,PY+62,100,1,'#8a6a40');
      Tt('«Код — год на табличке.',PX+70,PY+86,'#e8d8a8',4.4,false,'center');Tt('Римскими цифрами, сами',PX+70,PY+94,'#e8d8a8',4.4,false,'center');Tt('переведёте?» — Олеся',PX+70,PY+102,'#e8d8a8',4.4,false,'center');
      Tt('I=1 V=5 X=10 L=50 C=100 D=500 M=1000',PX+70,PY+118,'#9a92b0',3.6,false,'center');
      const bx=PX+140;R(bx,PY+18,88,110,'#4a4a52');R(bx+6,PY+22,76,14,m.err>0?'#5a1a1a':'#0a1a10');Tt(m.in.padEnd(4,'_').split('').join(' '),bx+44,PY+32,m.err>0?'#ff5a5a':'#3ef0b0',8,true,'center');
      KP.forEach((k,i)=>{const x=bx+8+(i%3)*25,y=PY+40+Math.floor(i/3)*21;R(x,y,22,18,'#2a2a30');Tt(k,x+11,y+12.5,'#e8e8f0',7,true,'center')});
      m.foot=touch.on?'Набери код на панели':'Набери код: цифры или клик'}});
}
const PH=144;

// ---------- КАБРИОЛЕТ ОЛЕСИ ----------
const CAB=mk(40,24);
(g=>{const C='#f4f0e8',CD='#c8c4bc';for(const [x,y] of [[6,0],[28,0],[6,21],[28,21]])P(g,x,y,7,3,'#0a0a0c');
  P(g,1,3,37,18,C);P(g,1,3,37,1,'#fff');P(g,1,20,37,1,CD);P(g,30,4,8,16,'#ece8e0');P(g,24,4,2,16,'#2a3a50');
  P(g,8,5,16,14,'#c81e5a');P(g,10,6,5,5,'#a81848');P(g,10,13,5,5,'#a81848');P(g,17,6,5,12,'#a81848');P(g,0,8,2,8,'#0a0a0c');P(g,37,4,1,3,'#fff6c0');P(g,37,17,1,3,'#fff6c0');outline(g,'#0b0910')})(CAB.getContext('2d'));
const CW=480,CH=4200;
function startCabrio(){
  C5.on=true;mz5('cabrio');
  K.car(C5,{id:'cabrio5',w:CW,h:CH,startX:240,startY:CH-140,route:'ВИЛЛА → ПЛЯЖ · САМОЛЁТ',title:'КАБРИОЛЕТ',sub:'Олеся за рулём, Шмакодявка стреляет, Валера машет трубой',hudCol:'#ff5a8a',
    gun:{name:'ШМАКОДЯВКА',cd:.11,dmg:20,sp:440,snd:'shot',heat:.035,ohNote:'Шмакодявка перезаряжается! Дави, Олеся!'},armorTxt:'ВАЛЕРА ОТБИВАЕТСЯ ТРУБОЙ',
    build(L){B(0,0,CW,CH,'#3a3a2a');E.gfill(0,0,CW,CH,1);E.gfill(96,0,384,CH,0);
      for(let y=0;y<CH;y+=4)for(let x=96;x<384;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,h<.1?'#5a5a60':h>.93?'#44444a':'#4e4e54')}
      for(let y=0;y<CH;y+=40)B(239,y,2,20,'#f4f4f4');
      for(let y=0;y<CH;y+=4){for(let x=0;x<96;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,h<.15?'#5a8a3a':'#6a9a44')}for(let x=384;x<CW;x+=4){const k=(Math.sin(x*.06+y*.05)+1)*.5;B(x,y,4,4,x<400?'#e2cc96':k>.85?'#5ab8d8':'#3488b8')}}
      for(let y=60;y<CH;y+=70){K.cypress(60+((y*7)%30),y);if(hash(y,3)>.5)K.cypress(30,y+30)}
      for(let y=200;y<CH;y+=500){B(10,y,70,50,'#e8b878');B(10,y,70,6,'#c05a34');B(20,y+20,10,10,'#3a4a5a');B(50,y+20,10,10,'#3a4a5a')}
      let s=11;const rr=()=>{s=(s*16807)%2147483647;return s/2147483647};
      for(let y=CH-400;y>400;y-=120+rr()*80){const x=rr()<.5?110+rr()*50:280+rr()*60;X.carTop(x|0,y|0,['#e8302a','#3a8ae8','#f0d040','#e8e8e8','#2a2a2a'][(rr()*5)|0],true);if(rr()<.25)Q.fires.push([x+8,y+14])}
      for(let y=CH-500;y>300;y-=30+rr()*34){const n=1+(rr()*2.4|0);for(let i=0;i<n;i++){const x=110+rr()*260,r=rr();if(solid2(x,y,6))continue;
        if(r<.5)Zt(x,y,{hp:60,max:60});else if(r<.7)Zch(x,y);else if(r<.85)Zleg(x,y);else if(r<.95)Zves(x,y);else Zglad(x,y,{hp:400,max:400,nm:null})}}
      for(let y=600;y<CH;y+=700){for(let i=0;i<10;i++)Zt(120+rr()*240,y+rr()*60,{hp:60,max:60})}
      // пляж и самолёт вверху
      E.gfill(0,0,CW,200,0);for(let y=0;y<200;y+=4)for(let x=0;x<CW;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,y<60?((Math.sin(x*.06+y*.11)+1)*.5>.85?'#5ab8d8':'#3488b8'):h<.12?'#d8c08a':'#e2cc96')}
      E.gfill(0,0,CW,60,2);B(200,30,72,6,'#f4f4f8');B(260,22,6,22,'#e8e8ec');B(208,8,10,52,'#e8e8f0');B(208,8,10,2,'#c8202a');
      L.dark=0;L.sunTint='rgba(255,130,60,.10)'},
    draw(x,y,a,ta,fl){shadowBlob(x,y,14);ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(a);ctx.drawImage(CAB,-20,-12);
      F(4,-6,4,4,'#9a6a44');F(-6,2,4,4,'#2c1a1f');F(-12,-5,4,4,'#5a3a22');ctx.restore();
      ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(ta);F(2,-1,10,2,'#26262a');if(fl)F(12,-2,3,4,'#fff6c0');ctx.restore();
      const sw=Math.sin(tm*8)*1.2;ctx.save();ctx.translate(Math.round(x-Math.cos(a)*10),Math.round(y-Math.sin(a)*10));ctx.rotate(a+Math.PI/2+sw);F(0,-1,12,2,'#e8e8ec');F(10,-2,3,4,'#d8d8dc');ctx.restore()},
    tick(c,dt){ // Валера отбивается трубой от тех, кто вцепился
      for(const z of E.L.zs){if(z.dead)continue;if(D2(z.x,z.y,c.x,c.y)<20){z.vh=(z.vh||0)-dt;if(z.vh<=0){z.vh=.6;X.hurtZ(z,35,Math.atan2(z.y-c.y,z.x-c.x),160);sfx('clang',.5)}}}},
    prog:c=>(c.start-c.y)/(c.start-200),fin:c=>c.y<200,
    onFin(k){C5.cabKills=k;X.go(()=>playC5(CUT_TAKEOFF,takeoff,'cabrio'))}});
  after(.8,()=>say([['ol','Держитесь! Я вожу как итальянка!'],['s','Это хорошо или плохо?!'],['val','Плохо. Очень плохо. ГАЗУЙ!']]));
}
function solid2(x,y,r){const g=E.gAt;return g(x-r,y-r)||g(x+r,y-r)||g(x-r,y+r)||g(x+r,y+r)||g(x,y)}
function takeoff(){C1.mode='cut';MG.play('P','rhythm',{title:'Взлёт: держи обороты',hint:'Жми, когда нота на белой линии. Мотор любит ритм.',col:'#6ad8ff'},()=>playC5(CUT_HOME5,endCh5,'home'))}

// ================= КАТ-СЦЕНЫ =================
const SS=K.SKY_SUN,SD=K.SKY_DUSK;
function lakhta(x,y){F(x-3,y-70,6,70,'#5a7aa8');F(x-2,y-90,4,20,'#6a8ab8');F(x-1,y-104,2,14,'#8aaad8');for(let i=0;i<10;i++)F(x-3,y-70+i*7,6,1,'#8ab0d8')}
function colosseum(x,y,s,smoke,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);F(-60,-40,120,40,'#c8a878');F(-60,-40,40,10,'#2a1a10');
  for(let r=0;r<3;r++)for(let i=0;i<10;i++){if(r===0&&i<3)continue;F(-56+i*12,-36+r*12,7,8,'#5a3a24')}F(-60,-2,120,2,'#8a7050');ctx.restore();
  if(smoke)for(let i=0;i<6;i++){const k=(t*.3+i/6)%1;ctx.fillStyle=`rgba(60,50,50,${.5*(1-k)})`;ctx.beginPath();ctx.arc(x-20+i*8+k*10,y-40*s-k*40,6+k*10,0,TAU);ctx.fill()}}
function pisa(x,y,t){ctx.save();ctx.translate(x,y);ctx.rotate(1.35);for(let i=0;i<7;i++){F(i*12,-6,11,12,'#f0ece0');F(i*12,-6,11,1,'#c8c4b8');for(let k=0;k<3;k++)F(i*12+2+k*3,-3,1,6,'#a8a498')}ctx.restore();for(let i=0;i<8;i++)F(x+rnd(-4,40),y+rnd(-2,4),3,2,'#d8d4c8')}
function csScreen(t,s){
  F(0,0,W,H,'#c8a868');F(0,0,W,70,'#7ab0e0');F(0,60,W,10,'#d8b878');for(let x=0;x<W;x+=40)F(x,40,30,30,'#c09858');F(100,30,50,40,'#b08848');F(110,40,12,30,'#2a1a10');
  const en=[[80,92],[200,86],[260,96]];en.forEach(([x,y],i)=>{const dead=t>1.6+i*.7;if(!dead){F(x,y-14,6,14,'#3a4a3a');F(x+1,y-18,4,4,'#e0b090')}else{F(x-6,y-2,14,3,'#3a4a3a');F(x+8,y-2,3,3,'#e0b090')}});
  const kick=Math.max(0,1-((t*2.6)%1)*3);F(200,120-kick*4,90,60,'#2a2a2e');F(240,108-kick*4,60,14,'#3a3a40');F(296,112-kick*4,10,4,'#1a1a1a');if(kick>.7)F(300,104,8,8,'#fff6c0');
  ctx.strokeStyle='#3af08a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(W/2-6,H/2);ctx.lineTo(W/2-2,H/2);ctx.moveTo(W/2+2,H/2);ctx.lineTo(W/2+6,H/2);ctx.moveTo(W/2,H/2-6);ctx.lineTo(W/2,H/2-2);ctx.moveTo(W/2,H/2+2);ctx.lineTo(W/2,H/2+6);ctx.stroke();
  F(4,H-26,50,12,'rgba(0,0,0,.5)');ctx.fillStyle='#fff';ctx.font='bold 7px monospace';ctx.fillText('♥ 12',8,H-17);F(W-60,H-26,56,12,'rgba(0,0,0,.5)');ctx.fillText('7 / 90',W-54,H-17);
  const n=Math.min(3,Math.floor((t-1.6)/.7)+1);F(W/2-24,14,48,10,'rgba(0,0,0,.6)');ctx.textAlign='center';ctx.fillStyle=n>=3?'#3ef0b0':'#ffd23a';ctx.fillText(n>=3?'ПОБЕДА':'1 vs '+(3-Math.max(0,t>1.6?n:0)),W/2,22);ctx.textAlign='left';
  for(let i=0;i<Math.max(0,t>1.6?n:0);i++){F(W-110,26+i*9,106,8,'rgba(0,0,0,.5)');ctx.fillStyle='#6ad8ff';ctx.font='bold 5px monospace';ctx.fillText('Valera_VK  ✚  bot_'+(i+1),W-106,32+i*9)}
}
const CUT_CS=[
  {dur:5.2,subs:[[.2,1.6,'val','Шмакодявка, не сейчас! У меня клатч, один против трёх!'],[1.7,3.4,'s','Валера! Это срочно! Олеся в Италии в осаде!'],[3.5,5,'val','Плюс три. Изи. ...Что с Олесей?']],draw:csScreen},
  {dur:1,lines:[['s','Она забаррикадировалась на вилле. Город кишит зомби, учёбу отменили. Хочет домой.'],['val','Слушай, у меня тут Приморскую отбили. Рядом со мной чисто, сижу спокойно.'],
    ['s','У нас во дворе тоже тихо. А в Италии нет. Валера, у тебя же гидросамолёт!'],['val','Ну... есть. На Ваське стоит, у Морского фасада. Взлетает с воды, садится на воду.'],
    ['val','Ладно. Я полечу. Но только если ты потом сыграешь со мной турнир.'],['s','Договорились!'],['val','Беру трубу. Встречаемся на пирсе.']],draw(t){
    F(0,0,W,H,'#14141c');F(0,120,W,60,'#20202a');F(40,60,120,50,'#0a0a10');F(44,64,112,40,'#1a3a2a');for(let i=0;i<5;i++)F(50+i*20,70+((i*7)%20),10,6,'#3af08a');F(90,110,20,12,'#1a1a1e');F(30,124,140,4,'#2a2a34');
    for(let i=0;i<12;i++)F(200+(i%4)*24,30+Math.floor(i/4)*24,18,18,['#3a6ac8','#c83a6a','#3ac88a'][i%3]);
    ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,100,84,90,'rgba(60,240,140,A)',.2);ctx.restore();K.sideValera(190,170,t,'stand');}},
];
const CUT_VASKA=[
  {dur:1,lines:[['H','Шмакодявка! Ты куда это собралась с таким чемоданом оружия?'],['s','В Италию, тётушка. Подругу спасать.'],['H','В Италию... Ох. Тогда привези мне пармезан. Настоящий, кругом, а не эту нарезку из магазина.'],['s','Постараюсь!'],['m','Береги себя. И звони.'],['s','Позвоню. Если там будет связь.']],draw(t){
    K.skyG(SS,0,100);F(0,100,W,80,'#5a5652');F(0,96,W,6,'#7a3426');for(let x=0;x<W;x+=30)F(x,40,24,58,'#8a3a2a');for(let x=4;x<W;x+=30)for(let y=46;y<94;y+=12)F(x,y,6,6,'#2a3a5a');
    K.carSide(150,160,t,'rover',{});K.sideShmak(120,162,t,'stand',true);sideMikrob(96,162,t,'stand');F(220,140,8,22,'#4a5a32');F(219,132,10,8,'#efc5a5');F(218,130,12,3,'#8a6748')}},
  {dur:5,subs:[[.3,2.5,'s','Морской фасад. Дальше — на самолёте.'],[2.6,4.8,'s','Олеся, держись. Мы летим.']],draw(t){
    K.skyG(SS,0,110);K.clouds(t,24);lakhta(260,110);K.sea(110,t);F(0,140,W,40,'#8a8a92');F(0,138,W,3,'#c8c8d0');for(let x=0;x<W;x+=8)F(x-mod(t*90,8),142,4,2,'#6a6a72');
    K.carSide(120,172,t,'rover',{move:true,heads:[[34,'#2c1a1f']]})}},
];
const CUT_FLY=[
  {dur:6,subs:[[.2,2,'val','Пристегнись. И не трогай красную кнопку.'],[2.1,3.6,'s','А что она делает?'],[3.7,5.8,'val','Не знаю. Поэтому и не трогай.']],draw(t){
    K.skyG(SS,0,110);K.clouds(t,24);lakhta(70,112);K.sea(110,t);const k=clamp((t-2)/3,0,1);K.planeSide(80+t*30,128-k*50,t,{tilt:-k*.25,pilots:1});
    if(k<.2)for(let i=0;i<6;i++)F(60+t*30-i*6,136,4,2,'#e8f8ff')}},
  {dur:5.5,subs:[[.2,2.6,'val','Через всю Европу. Часа четыре. Могу пока катку поставить на телефоне.'],[2.8,5.2,'s','Валера, ты за штурвалом!']],draw(t){
    K.skyG(SD,0,H);for(let i=0;i<12;i++){const x=mod(i*50-t*40,W+60)-30;ctx.fillStyle='rgba(255,230,220,.55)';ctx.beginPath();ctx.ellipse(x,130+(i%3)*10,30,7,0,0,TAU);ctx.fill()}
    K.sun(260,60,10);K.planeSide(150,80+Math.sin(t*2)*3,t,{pilots:1})}},
  {dur:5.5,subs:[[.2,2.6,'s','Смотри... Пизанская башня. Она всё-таки упала.'],[2.8,5.2,'val','Восемьсот лет падала. Дождалась.']],draw(t){
    K.skyG(SS,0,120);F(0,120,W,60,'#7a9a54');for(let i=0;i<8;i++)F(i*44,110,20,12,'#c86a44');pisa(130,140,t);for(let i=0;i<5;i++)F(200+i*16+Math.sin(t+i)*3,146,3,6,'#4a6a3a');
    K.planeSide(60+t*40,40,t,{pilots:1})}},
  {dur:5.5,subs:[[.2,2.6,'s','Колизей. Там их тысячи...'],[2.8,5.2,'val','Садимся на пляже у городка. Вилла Олеси — на холме за Колизеем.']],draw(t){
    K.skyG(SS,0,120);F(0,110,W,70,'#b89a6a');colosseum(160,140,1.1,true,t);for(let i=0;i<60;i++){const x=40+((i*53)%240),y=146+((i*29)%30);F(x+Math.sin(t*3+i),y,1,2,'#3a5a2a')}
    K.planeSide(W-t*50,36,t,{pilots:1})}},
  {dur:1,lines:[['val','Пляж кишит. Значит так: я швартую самолёт, ты прикрываешь.'],['s','Сколько тебе нужно?'],['val','Полторы минуты. Если не будут грызть поплавки.']],draw(t){
    K.skyG(SS,0,90);K.sea(90,t);F(0,130,W,50,'#e2cc96');K.drawPalms(0,134);for(let i=0;i<14;i++)F(30+i*20+Math.sin(t*2+i)*2,140+(i%3)*8,3,7,'#4a7a5a');
    K.planeSide(170,108,t,{pilots:1})}},
];
const CUT_TAKEOFF=[
  {dur:1,lines:[['ol','Мой кабриолет... Пусть остаётся. Пусть зомби завидуют.'],['val','Все на борт! Шмакодявка, ты за обороты — я за штурвал.'],['s','Поняла. В такт, как в ритм-игре.']],draw(t){
    K.skyG(SD,0,90);K.sea(90,t,'#3a6aa0','#c8b0c0');F(0,128,W,52,'#d8b880');K.carSide(40,160,t,'cab',{});K.planeSide(200,112,t,{pilots:1});K.sideOlesya(130,150,t,'stand');K.sideShmak(150,150,t,'stand',true)}}];
function skylineSPb(t,good){K.skyG(good?SS:SD,0,120);F(0,100,W,30,'#4a5a7a');for(let i=0;i<14;i++){const x=i*24,h=20+((i*13)%26);F(x,120-h,20,h,'#5a6a8a');for(let y=124-h;y<118;y+=5)F(x+3,y,2,2,'#ffd27a')}
  F(150,40,3,80,'#d8a830');F(149,34,5,8,'#e8c050');F(146,80,11,40,'#c8a878');if(good)for(let i=0;i<4;i++){const k=(t*.6+i*.25)%1,x=40+i*80,y=60-k*30;for(let j=0;j<10;j++){const a=j/10*TAU;F(x+Math.cos(a)*k*20,y+Math.sin(a)*k*20,2,2,['#ff4fd8','#3ef0b0','#ffd23a','#ff7a3a'][i])}}}
const CUT_HOME5=[
  {dur:5.5,subs:[[.2,2.8,'ol','Я думала, больше никогда не увижу Питер.'],[2.9,5.3,'val','Через четыре часа увидишь. Если никто не тронет красную кнопку.']],draw(t){
    K.skyG(SD,0,H);for(let i=0;i<12;i++){const x=mod(i*50-t*40,W+60)-30;ctx.fillStyle='rgba(255,230,220,.55)';ctx.beginPath();ctx.ellipse(x,130+(i%3)*10,30,7,0,0,TAU);ctx.fill()}K.sun(60,90,12);
    K.planeSide(170,76+Math.sin(t*2)*3,t,{pilots:1});F(176,69,2,3,'#9a6a44')}},
  {dur:5,subs:[[.2,2.4,'s','Васька! Морской фасад!'],[2.5,4.8,'val','Садимся. Плавно. ...Почти плавно.']],draw(t){
    K.skyG(SS,0,110);lakhta(270,112);K.sea(110,t);const k=clamp(t/3.4,0,1);K.planeSide(40+t*36,70+k*48,t,{tilt:(1-k)*.18,pilots:1});if(k>=1)for(let i=0;i<8;i++)F(40+t*36-i*7,126,5,2,'#e8f8ff')}},
  {dur:1,lines:[['r','Экстренный выпуск! Заражённые массово уходят из города в область. Василеостровский и Петроградский районы свободны!'],
    ['r','Но Горьковская и Заячий остров у крепости — по-прежнему красная зона. Мосты туда не сводят.'],
    ['r','А сегодня над Васильевским видели гидросамолёт. Говорят, он вернул домой студентку из Италии. Её спасли подруга и... сантехник с трубой.']],draw(t){
    skylineSPb(t,true);for(let i=0;i<16;i++){const x=20+i*18;F(x,150+Math.sin(t*4+i)*2,4,10,PAL[i%PAL.length]);F(x,146+Math.sin(t*4+i)*2,4,4,'#e8c0a0')}K.newsBar('ЗОМБИ УХОДЯТ · ЗАЯЧИЙ ОСТРОВ ЕЩЁ ЗАРАЖЁН',true)}},
  {dur:1,lines:null,draw(t){K.skyG(SS,0,100);F(0,100,W,80,'#5a5652');F(0,96,W,6,'#7a3426');for(let x=0;x<W;x+=30)F(x,40,24,58,'#8a3a2a');
    K.sideShmak(120,162,t,'stand');K.sideOlesya(98,162,t,'stand');K.sideValera(144,162,t,'stand',true);F(220,140,8,22,'#4a5a32');F(219,132,10,8,'#efc5a5');F(218,130,12,3,'#8a6748');
    if(C5.flags.parm){ctx.fillStyle='#e8c860';ctx.beginPath();ctx.ellipse(196,150,9,4,0,0,TAU);ctx.fill();F(187,150,18,6,'#d8b850')}}},
  {dur:1,lines:[['s','Мы дома! Все живы!'],['ol','Микроб! Котики! Это и есть ваш штаб?'],['m','Добро пожаловать. Диван твой. Только Черсика не сгоняй.'],
    ['e','Новых людей — новая туса! Я колонку принёс.'],['val','Мне нужен комп. У меня турнир через час. Шмакодявка обещала.'],['s','Обещала. Садись за комп Микроба.'],['m','Эй!'],
    ['c','Мяу. (Опять гости. Опять мой диван.)'],['w','Мрр. (Зато всех кормят.)'],['ol','Спасибо вам. Правда. Я думала, это конец.'],['s','Своих не бросаем.']],draw(t){
    K.livingSide(t,true);sideMikrob(40,170,t,'stand');K.sideShmak(70,170,t,'stand');K.sideOlesya(96,170,t,'stand');K.sideValera(122,170,t,'stand');K.sideEgor(150,170,t,'stand');
    K.catSide(200,168,t,2.2,'stand',K.PAL_BLACK);K.catSide(236,168,t,2.2,'stand',K.PAL_SIAM);
    if(Math.random()<.3)cparts.push({x:rnd(0,W),y:-4,vx:rnd(-10,10),vy:rnd(20,40),g:10,life:5,c:['#ff4fd8','#3ef0b0','#ffd23a'][(Math.random()*3)|0]});for(const p of cparts)F(p.x,p.y,2,2,p.c)}},
];
// реплики Ханжи зависят от пармезана — подставляем перед показом
function prepHome(){CUT_HOME5[3].lines=C5.flags.parm?[['s','Тётушка Ханжа! Ваш пармезан. Настоящий, кругом, прямо из Италии.'],['H','Шмакодявка! Золото, а не девочка! Весь подъезд угощу. ...Ну, не весь.'],['H','А это кто? Ещё одна? И маленький с трубой?'],['val','Я сантехник. Если что — обращайтесь.'],['H','Сантехник! Свой! Михалыч, запиши его в штаб!']]
  :[['H','Шмакодявка! Вернулась! А пармезан?'],['s','Ой... Не успели, тётушка. Там была орда.'],['H','Эх, молодёжь. Ладно, главное — живые. А это кто, маленький с трубой?'],['val','Я сантехник. Если что — обращайтесь.'],['H','Сантехник! Свой! Михалыч, запиши его в штаб!']]}

// ================= СЮЖЕТ В КВАРТИРЕ =================
function setFlat5(){
  C1.on=false;C1.mode=null;C1.noWpn=false;C5.on=true;for(const o of [window.C2,window.C3,window.C4,window.C6])if(o){o.on=false}if(window.C4)C4.cat=false;
  scene='flat';cut=null;dlg=null;tr=null;S.fade=0;state='play';
  S.step=12;S.alarm=false;S.skladLocked=false;S.bat=S.pistol=false;S.bowls=true;mapDirty=true;lastRoom=null;camY=0;
  pl.scoot=false;pl.sit=false;lockMove=true;shmak.mode='sit';shmak.x=136;shmak.y=40;shmak.a=-Math.PI/2;shmak.hug=0;shmak.path=[];cat.path=[];cat.then=null;
  cat.x=CAT_HOME.x;cat.y=CAT_HOME.y;cat.mode='sleep';
}
function kit5(){Object.assign(PS,{hp:110,max:110,lives:3,inv:0,wpn:'shotgun',ammo:120,shells:40,syr:4,moon:4,hasShotgun:true,mode:'spread',hasAxe:false,hasNail:false,nails:0,hasExt:false,ext:0,regen:0,carry:false,slow:0});K.valBuff=false;if(window.UP)UP.kit(5)}
function startCh5(){
  C5.started=true;C5.done=false;C5.flags={parm:false,coin:false,pizza:false};setFlat5();mz5('call');
  pl.x=176;pl.y=74;pl.a=0;pl.ma=0;
  after(1,()=>{sfx('ring');after(.9,()=>sfx('ring'));note('Видеозвонок: «Олеся 🇮🇹»');
    after(1.8,()=>say([['s','Зай! Олеся звонит! По видео!'],['ol','Шмакодявка!!! Наконец-то! У меня тут... *грохот* ...полный кошмар!'],
      ['s','Олесечка! Ты где? Ты как?'],['ol','Я в Италии! На вилле! Учёбу отменили, кругом зомби, Колизей кишит ими, как муравейник!'],
      ['ol','Я забаррикадировала двери шкафом и диваном. Печенье кончается. Хочу домой!'],['m','У нас по новостям: районы освобождают по одному. Наш уже чистый, но до конца ещё далеко.'],
      ['ol','Вот! А я тут! Самолёты не летают, поезда не ходят!'],['s','Держись! Я что-нибудь придумаю. ...Валера! У Валеры есть гидросамолёт!'],
      ['m','Валера? Который с CS?'],['s','Он сейчас в катке. Зайду к нему в игру — так быстрее, чем дозвониться.']],()=>{
        pl.sit=false;MG.play('A','pc',{title:'Шмакодявка заходит в катку к Валере'},()=>{C1.mode='cut';playC5(CUT_CS,afterCS,'cs')})}))});
}
function afterCS(){
  setFlat5();mz5('call');pl.x=176;pl.y=74;pl.a=Math.PI;
  say([['s','Валера в деле! Летим за Олесей!'],['m','Я бы с тобой полетел, но в самолёте мест на троих. С Олесей.'],['s','А ты держишь штаб. Два кота, Егор, Ханжа — на тебе.'],
    ['e','Шмакодявка, держи мои розовые очки! На удачу. Лазер не стреляет, но выглядишь — огонь.'],['s','Беру! Дробовик, пистолет, всё — тоже беру.'],['m','Патроны полные. Проверь всё и выходи. Я провожу до машины.']],()=>{
      lockMove=false;C5.ready=true;note('Штаб: поговори с кем хочешь. Выход — входная дверь')});
}
IT.push({x:212,y:205,r:16,label:()=>'Выйти: проводить Шмакодявку',cond:()=>C5.on&&C5.ready&&scene==='flat'&&!C1.on,act:()=>{C5.ready=false;lockMove=true;kit5();C5.kills0=PS.kills;X.go(()=>playC5(CUT_VASKA,()=>sec5('pier'),'vaska'))}});
const _cutH=CUT_HOME5;
function endCh5(){
  C5.done=true;setFlat5();mz5('final');S.fade=.01;
}
// подставить реплики Ханжи перед финалом
const _playC5=playC5;

// ================= МЕНЮ ГЛАВЫ 5 =================
const MENU5=[['Глава 5 с начала (звонок Олеси)','call5'],['Пирс на Морском фасаде','pier'],['Пляж: швартовка','beach'],['Приморский городок','town'],['Площадь у Колизея','colos'],['Улочки и рынок','alley'],['Канализация','sewer'],['Вилла Олеси','villa'],['Кабриолет','cabrio'],['Возвращение домой (кат-сцена)','home5']];
function menuKit5(){kit5();C1.done=true;for(const o of [window.C2,window.C3,window.C4])if(o){o.done=true;o.started=true;o.on=false}C5.started=true;C5.done=false;C5.kills0=PS.kills;S.bat=S.pistol=false;S.skladLocked=false;S.alarm=false;S.key=true;mapDirty=true}
const cfg5={ch:C5,num:5,title:'ИТАЛЬЯНСКИЙ ВАЙБ',col:'rgba(255,90,138,A)',btn:{x:4,y:H-38,w:70,h:12},menu:MENU5,alias:{ch5:'call5'},
  start(k){menuKit5();if(k==='call5'){startCh5();return}if(k==='cabrio'){K.valBuff=false;startCabrio();return}if(k==='home5'){prepHome();playC5(CUT_HOME5,endCh5,'home');return}sec5(k)},
  canContinue:()=>!!(window.C4&&C4.done&&!C5.started),
  cont(){C5.menu=null;state='play';S.fade=0;sfx('click');kit5();startCh5()},
  endScreen(){
    if(window.C4&&C4.done&&!C5.started){K.endPanel({big:'ГЛАВА 4 ПРОЙДЕНА',sub:'Алко Пати Лайф',col:'#ff7ac8',faces:['m','s','e','w','c'],l1:'Анжела повержена. Центр свободен. Мыш накормлен.',l2:'Но очаги остались: несколько ночных клубов ещё заражены...'});cfg5.contBtn(150);return true}
    if(C5.done){K.endPanel({big:'ГЛАВА 5 ПРОЙДЕНА',sub:'Итальянский вайб',col:'#ff5a8a',faces:['s','val','ol'],l1:'Убито в Италии: '+Math.max(0,PS.kills-C5.kills0)+'   ·   Пармезан: '+(C5.flags.parm?'привезли':'нет')+'   ·   Монетка: '+(C5.flags.coin?'брошена':'нет'),l2:'Олеся дома. Зомби уходят из города — но не все.'});
      if(window.C6&&C6.cfg&&!C6.started)C6.cfg.contBtn(150);else{u.textAlign='center';uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText('Спасибо, что играли!   ·   '+(touch.on?'Коснись, чтобы сыграть заново':'R или клик — сыграть заново'),W/2,162);u.textAlign='left'}return true}
    return false}};
K.chapter(cfg5);C5.cfg=cfg5;
// перед финальной кат-сценой подставим реплики Ханжи
const _kc=K.cut;K.cut=function(ch,shots,onEnd,mus){if(shots===CUT_HOME5)prepHome();return _kc(ch,shots,onEnd,mus)};
C5.CUTS={CUT_CS,CUT_VASKA,CUT_FLY,CUT_TAKEOFF,CUT_HOME5};
C5.get=()=>({L:E.L,Q,PS,scene,state,cut,dlg});
C5.startCabrio=startCabrio;
})();
