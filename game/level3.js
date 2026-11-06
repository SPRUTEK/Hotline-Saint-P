// =====================================================================
//  ГЛАВА 3 — «Черсик против крысиного короля». Финал игры. Играем за кота.
//  Подключается после level1.js и level2.js, пользуется движком главы 1 (C1.engine, C1.X).
//  Всё своё держит внутри замыкания, наружу отдаёт только window.C3.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.X||!C1.engine){console.warn('level3: нет движка главы 1');return}
const X=C1.X,E=C1.engine,PS=C1.PS;
const TAU=Math.PI*2;
const D2=(a,b,c,d)=>Math.hypot(c-a,d-b);
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
const C3={on:false,done:false,started:false,sec:null,menu:null,buff:false,zone:null,zoneT:0,kills0:0,cd:0,swing:0,combo:0,comboT:0,slash:null,lastSyr:0,zzz:false};
window.C3=C3;
const sfx=X.sfx;
let L=null;
const C2=window.C2||{};

// ================= МУЗЫКА =================
// trimtryam = BABURA & ALLO4KA IZ UNIVERA «TRIM-TRYAM» (бойня в подвале), smoke = BABURA «GOING TO SMOKE» (кат-сцены)
for(const [k,f] of [['trimtryam','trimtryam.mp3'],['smoke','smoke.mp3']]){if(!MUS[k]){const a=new Audio('music/'+f);a.loop=true;MUS[k]=a}}
const MZ3={feed:'flat',cut:'smoke',news:'zombie',talk:'flat',yard:'menu',fight:'kupala',out:'smoke',sunny:'menu',home:'flat',restore:'smoke',final:'trimtryam',cellar:'rampage',tunnels:'smoke',lair:'waves'};
C3.MZ=MZ3;
function mz3(k){const n=MZ3[k];if(n&&MUS[n]&&musCur!==n)music(n)}

// ================= ПОРТРЕТЫ: кот-качок и крысиный король =================
function pChersikBuff(g,open,blink){
  pChersik(g,open,blink);
  const B='#141218',HL='#2e2a36';
  // трапеции и плечи
  ell(g,32,64,31,11,B);ell(g,8,57,10,9,B);ell(g,56,57,10,9,B);
  P(g,3,52,9,1,HL);P(g,52,52,9,1,HL);P(g,20,58,24,1,HL);P(g,24,61,16,1,HL);
  // злые брови
  for(let i=0;i<9;i++){P(g,17+i,26+Math.floor(i/3),1,2,'#050405');P(g,46-i,26+Math.floor(i/3),1,2,'#050405')}
  // шрам
  P(g,40,22,1,1,'#5a4a5a');P(g,41,23,1,1,'#5a4a5a');P(g,42,24,1,1,'#5a4a5a');
  // лапа с когтями
  ell(g,10,58,6,5,B);
  for(let k=0;k<3;k++)for(let i=0;i<20;i++){P(g,4+k*4+Math.round(i*.15),54-i,2,1,i>16?'#ffffff':'#d8dce6')}
}
function pRatKing(g,open,blink){
  g.clearRect(0,0,64,64);const F0='#5a524c',FD='#3e3834',PK='#d8909a';
  ell(g,32,70,30,16,FD);
  ell(g,13,20,9,10,F0);ell(g,13,20,6,7,PK);ell(g,51,20,9,10,F0);ell(g,51,20,6,7,PK);
  ell(g,32,35,17,16,F0);ell(g,32,47,11,8,shade(F0,1.15));ell(g,32,51,3,2,'#e88a9a');
  P(g,40,40,3,2,'#6ac83a');P(g,21,43,2,2,'#6ac83a');P(g,44,30,2,1,'#6ac83a');
  if(blink){P(g,21,33,7,1,'#1a0808');P(g,36,33,7,1,'#1a0808')}
  else{ell(g,24,33,3.6,3.6,'#ff2020');ell(g,40,33,3.6,3.6,'#ff2020');P(g,23,31,1,1,'#fff');P(g,39,31,1,1,'#fff');P(g,24,33,1,2,'#3a0000');P(g,40,33,1,2,'#3a0000')}
  g.strokeStyle='#9a928a';g.lineWidth=1;g.beginPath();g.moveTo(22,49.5);g.lineTo(5,46.5);g.moveTo(22,51.5);g.lineTo(6,54.5);g.moveTo(42,49.5);g.lineTo(59,46.5);g.moveTo(42,51.5);g.lineTo(58,54.5);g.stroke();
  if(open){P(g,26,54,12,6,'#3a0a10');P(g,29,54,3,5,'#f0e0a0');P(g,32,54,3,5,'#f0e0a0')}else{P(g,29,54,3,4,'#f0e0a0');P(g,32,54,3,4,'#f0e0a0')}
  P(g,19,11,26,6,'#e8c040');for(const x of [19,25,31,37,43])P(g,x,5,2,6,'#e8c040');P(g,19,16,26,1,'#b08a20');
  P(g,24,12,2,2,'#e83a3a');P(g,31,12,2,2,'#3a8ae8');P(g,38,12,2,2,'#3ae87a');
}
Object.assign(PORTRAIT,{C:pChersikBuff,K:pRatKing});
Object.assign(PCV,{C:mk(64),K:mk(64)});
Object.assign(NAME,{C:'ЧЕРСИК',K:'КРЫСИНЫЙ КОРОЛЬ'});
Object.assign(NCOL,{C:'#e8ff4a',K:'#ff5a5a'});
Object.assign(BG,{C:['#1a2a06','#d4ff3a'],K:['#2a0808','#c83a3a']});

// ================= ЧЕРСИК: спрайты сверху (смотрит вправо) =================
function outlineN(g,S,col){outline(g,col)} // HD: общий контур по реальным пикселям холста
function drawBuffTop(g,ph,mv,claws,swing){
  g.clearRect(0,0,24,24);const B='#141219',HL='#34303e',EY='#d4ea4f',CL='#e8ecf4';
  const s=mv?Math.sin(ph):0,o=Math.round(s*2);
  // хвост
  for(let i=0;i<5;i++)P(g,4-i,12+Math.round(Math.sin(tm*4+i*.8)*1.5),1,2,B);
  // лапы: задние и мощные передние
  P(g,5-o,6,3,2,B);P(g,5+o,16,3,2,B);
  const fx1=14+o+(swing>0&&C3.side>0?3:0),fx2=14-o+(swing>0&&C3.side<0?3:0);
  P(g,fx1,4,4,3,B);P(g,fx2,17,4,3,B);
  // тело: узкий зад, широкая грудь
  ell(g,8.5,12,5,3.6,B);ell(g,13.5,12,4.4,6.2,B);
  P(g,5,12,7,1,HL);P(g,11,8,5,1,HL);P(g,11,16,5,1,HL);P(g,14,10,1,4,HL);
  // голова
  ell(g,18.5,12,3.4,3.4,B);P(g,17,7,2,2,B);P(g,17,15,2,2,B);
  P(g,21,10,1,1,EY);P(g,21,14,1,1,EY);
  // когти
  if(claws){const k=swing>0?2:0;
    for(let i=0;i<3;i++){P(g,fx1+4,4+i,3+(C3.side>0?k:0),1,CL)}
    for(let i=0;i<3;i++){P(g,fx2+4,17+i,3+(C3.side<0?k:0),1,CL)}}
  outline(g,'#4a4458');
}
function drawCatHero(g,w){
  if(C3.buff)drawBuffTop(g,pl.ph,pl.mv,w==='claws',C3.swing);
  else drawCat(g,pl.mv?'walk':'idle',tm,pl.ph);
}
const HERO3={draw:drawCatHero,leg:'rgba(0,0,0,0)',shoe:'rgba(0,0,0,0)'};
// в квартире кот-качок рисуется вместо обычного
const _drawCat=drawCat;
drawCat=function(g,mode,t,ph){
  if(C3.on&&C3.buff&&scene==='flat'&&mode!=='sleep'){drawBuffTop(g,ph,mode==='walk',true,0);return}
  return _drawCat(g,mode,t,ph);
};

// ================= МЫШИ, КРЫСЫ, КРЫСИНЫЙ КОРОЛЬ =================
// fast 200..203 — заражённые мыши, normal 210..213 — крысы, normal 220..221 — большие крысы, boss 230 — крысиный король
function zMouse(v){
  const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});
  const F0=['#6a625a','#5a544e','#7a7064','#4e4a46'][v%4],FD=shade(F0,.75);
  for(let i=0;i<6;i++)P(g,7-i,12+Math.round(Math.sin(i*.9+v)*1),1,1,'#c08890');
  ell(g,11,12,4,2.8,F0);ell(g,10,12,2.6,1.8,FD);
  ell(g,15,12,2.2,1.9,F0);P(g,17,12,1,1,'#e8a0a8');
  P(g,13,9,2,2,'#c08890');P(g,13,14,2,2,'#c08890');
  P(g,16,11,1,1,'#ff3030');P(g,16,13,1,1,'#ff3030');
  P(g,9,11,2,1,'#5aa83a');
  outline(g,'#0b0910');return c;
}
function zRat(v,big){
  const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});
  const F0=['#4a4440','#5a5048','#3e3a38','#6a5e52'][v%4],FD=shade(F0,.72);
  if(big){
    for(let i=0;i<6;i++)P(g,Math.max(0,3-i),12+Math.round(Math.sin(i*.8+v)*1.6),1,1,'#b07880');
    ell(g,10,12,7.5,5,F0);ell(g,9,12,5,3.4,FD);P(g,6,9,3,2,'#5aa83a');P(g,11,15,2,2,'#5aa83a');P(g,8,14,2,1,'#c08890');
    ell(g,17,12,3.6,3.2,F0);P(g,20,11,2,2,'#e8a0a8');P(g,21,10,1,1,'#f0e8c0');P(g,21,13,1,1,'#f0e8c0');
    P(g,14,7,3,2,'#c08890');P(g,14,15,3,2,'#c08890');P(g,18,10,1,1,'#ff2020');P(g,18,14,1,1,'#ff2020');
  }else{
    for(let i=0;i<6;i++)P(g,Math.max(0,5-i),12+Math.round(Math.sin(i*.8+v)*1.3),1,1,'#b07880');
    ell(g,10,12,5.5,3.6,F0);ell(g,9,12,3.6,2.4,FD);P(g,8,10,2,1,'#5aa83a');
    ell(g,15.5,12,2.8,2.4,F0);P(g,18,12,1,1,'#e8a0a8');
    P(g,13,8,2,2,'#c08890');P(g,13,15,2,2,'#c08890');P(g,16,11,1,1,'#ff2020');P(g,16,13,1,1,'#ff2020');
  }
  outline(g,'#0b0910');return c;
}
function zKing(){
  const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});
  for(let i=0;i<46;i++){const a=i*.55,r=2+i*.11;P(g,Math.round(6+Math.cos(a)*r),Math.round(16+Math.sin(a)*r),1,1,'#c08890')}
  ell(g,15,16,9.5,9,'#3e3834');ell(g,13,16,6,6,'#2e2a28');
  for(const a of [-2.3,-1.4,1.4,2.3]){const x=15+Math.cos(a)*9,y=16+Math.sin(a)*9;ell(g,x,y,3,3,'#4a4440');P(g,Math.round(x+Math.cos(a)*2.5),Math.round(y+Math.sin(a)*2.5),1,1,'#ff3030');P(g,Math.round(x+Math.cos(a)*3.4),Math.round(y+Math.sin(a)*3.4),1,1,'#e8a0a8')}
  P(g,10,12,3,2,'#5aa83a');P(g,16,21,2,2,'#5aa83a');P(g,12,19,2,1,'#5aa83a');
  ell(g,24,16,5,4.6,'#4a4440');P(g,28,15,2,2,'#e8a0a8');P(g,27,13,1,1,'#ff2020');P(g,27,18,1,1,'#ff2020');P(g,29,14,1,1,'#f0e8c0');P(g,29,17,1,1,'#f0e8c0');
  for(let i=0;i<14;i++){const a=i/14*TAU;P(g,Math.round(23.5+Math.cos(a)*3.2),Math.round(16+Math.sin(a)*3.2),1,1,'#e8c040')}
  for(const a of [0,1.6,3.1,4.7])P(g,Math.round(23.5+Math.cos(a)*4.2),Math.round(16+Math.sin(a)*4.2),1,1,'#ffe070');
  P(g,23,15,2,2,'#e83a3a');
  outlineN(g,32,'#0b0910');return c;
}
for(let v=0;v<4;v++)X.zCache['fast'+(200+v)]=zMouse(v);
for(let v=0;v<4;v++)X.zCache['normal'+(210+v)]=zRat(v,false);
for(let v=0;v<2;v++)X.zCache['normal'+(220+v)]=zRat(v,true);
X.zCache['boss230']=zKing();
const Zm=(x,y,o)=>E.addZ('fast',x,y,Object.assign({v:200+((Math.random()*4)|0),hp:22,max:22,sp:46*rnd(.9,1.1),r:3},o||{}));
const Zr=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:210+((Math.random()*4)|0),hp:60,max:60,sp:30*rnd(.9,1.1)},o||{}));
const Zrb=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:220+((Math.random()*2)|0),hp:160,max:160,sp:25,r:6},o||{}));
function nest(x,y,n,rats,o){for(let i=0;i<n;i++)Zm(x+rnd(-14,14),y+rnd(-12,12),o);for(let i=0;i<(rats||0);i++)Zr(x+rnd(-12,12),y+rnd(-10,10),o)}

// ================= ОТРИСОВКА КАРТ =================
const B=(x,y,w,h,c)=>X.B(x,y,w,h,c);
function floor3(x0,y0,x1,y1,kind){
  E.gfill(x0,y0,x1,y1,0);
  for(let y=y0;y<y1;y+=4)for(let x=x0;x<x1;x+=4){const h=hash(x>>2,y>>2),w=Math.min(4,x1-x),hh=Math.min(4,y1-y);let c;
    switch(kind){
      case'conc':c=h<.1?'#3e3b34':h>.93?'#2a2824':'#34322c';break;
      case'cell':c=h<.12?'#2e2c28':'#292723';if(x%16===0)c='#24221f';break;
      case'brick':{const row=y>>2,off=(row%2)*4;c=((x+off)%8===0)?'#241c18':(h<.15?'#4a3a30':h>.9?'#3a2c24':'#42342c');break}
      case'lair':c=h<.1?'#2e2622':h>.9?'#1e1a18':'#262020';if(h>.996)c='#a8a090';break;
    }
    B(x,y,w,hh,c)}
}
function water(x0,y0,x1,y1){E.gfill(x0,y0,x1,y1,2);for(let y=y0;y<y1;y+=4)for(let x=x0;x<x1;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,h<.2?'#24402c':h>.9?'#2e5236':'#1c3424')}Q.water.push([x0,y0,x1,y1])}
function bones(x,y){B(x,y,5,1,'#d8d0b8');B(x-1,y-1,1,3,'#d8d0b8');B(x+5,y-1,1,3,'#d8d0b8')}
function skull(x,y){B(x,y,4,3,'#d8d0b8');B(x+1,y+3,2,1,'#d8d0b8');B(x,y+1,1,1,'#1a1410');B(x+2,y+1,1,1,'#1a1410')}
function slime(x,y,r){const g=L.bx;g.fillStyle='rgba(90,200,60,.28)';g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.fillStyle='rgba(140,240,90,.35)';g.beginPath();g.arc(x-1,y-1,r*.45,0,TAU);g.fill();L.glow.push([x,y,r*2.2,'rgba(90,255,80,A)',.14,2])}
function droppings(x0,y0,x1,y1,n){for(let i=0;i<n;i++)B(rnd(x0,x1)|0,rnd(y0,y1)|0,1,1,'#1a1612')}
function hole(x,y){const g=L.bx;g.fillStyle='#0a0606';g.beginPath();g.ellipse(x,y,7,5,0,0,TAU);g.fill();g.fillStyle='#1e1414';g.beginPath();g.ellipse(x,y-1,7,2,0,0,TAU);g.fill();Q.holes.push([x,y])}
function txt(x,y,t,c,sz){const g=L.bx;g.fillStyle=c;g.font='bold '+(sz||6)+'px monospace';g.textAlign='center';g.fillText(t,x,y);g.textAlign='left'}
function treeOver(list){for(const [x,y,r] of list){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.arc(x+3,y+3,r,0,7);ctx.fill();ctx.fillStyle='#1f4a26';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.fillStyle='#2e6a34';ctx.beginPath();ctx.arc(x-3,y-3,r*.6,0,7);ctx.fill()}}
function kfood(x,y){E.addItem('kfood',x,y)}
function drawKfood(){for(const it of L.items){if(it.taken||it.kind!=='kfood')continue;const y=it.y+Math.sin(tm*3+it.x)*1;F(it.x-3,y-4,6,8,'#e8e0d0');F(it.x-3,y-4,6,2,'#ff4fa3');F(it.x-2,y,4,2,'#141418');F(it.x-1,y,1,1,'#d4ea4f');F(it.x+1,y,1,1,'#d4ea4f');
  const a=.25+.25*Math.sin(tm*5+it.x);ctx.strokeStyle=`rgba(255,122,184,${a})`;ctx.strokeRect(it.x-5.5,y-6.5,11,13)}}

// ================= РАЗДЕЛЫ =================
const Q={};
function sec3(n){
  C1.on=true;C3.on=true;if(window.C2){C2.on=false;C2.zone=null}C1.over=null;C1.hurt=0;C1.shake=0;PS.carry=false;PS.inv=1;C1.mdown=false;lockMove=false;dlg=null;
  const s0=X.snap(),b0=C3.buff;C3.sec=n;
  C1.retry=()=>{X.restore(s0);C3.buff=b0;PS.lives=3;PS.hp=PS.max;sec3(n)};
  for(const k in Q)delete Q[k];Q.water=[];Q.holes=[];Q.trig=[];Q.ghosts=[];
  C1.mode='td';scene='c3td';C1.noWpn=true;PS.wpn='claws';C3.slash=null;C3.swing=0;C3.cd=.3;C3.lastSyr=PS.syr;
  if(n==='yard3'){lvYard3(false);mz3('yard')}
  if(n==='cellar'){lvCellar();mz3('cellar')}
  if(n==='tunnels'){lvTunnels();mz3('tunnels')}
  if(n==='lair'){lvLair();mz3('lair')}
  if(n==='sunny'){lvYard3(true);mz3('sunny')}
  L=E.L;L.hero=HERO3;L.noHud=true;
  if(n==='cellar'||n==='tunnels'||n==='lair')L._void=1; // под землёй стены сплошные, без ночного города за ними
  const lu=L.drawUnder,lo=L.drawOver;L.drawUnder=()=>{if(lu)lu();drawKfood()};L.drawOver=()=>{if(lo)lo();drawFx3()};
  const oi=L.onItem;L.onItem=it=>{if(it.kind==='kfood'){PS.syr++;C3.lastSyr=PS.syr;X.floatT(it.x,it.y,'+корм','#ff7ab8')}if(oi)oi(it)};
  C1.cx=clamp(pl.x-W/2,0,Math.max(0,L.w-W));C1.cy=clamp(pl.y-H/2,0,Math.max(0,L.h-H));if(L.w<=W)C1.cx=(L.w-W)/2;if(L.h<=H)C1.cy=(L.h-H)/2;
  camX=Math.round(C1.cx);camY=Math.round(C1.cy);
}
C3.go=sec3;
function playC3(shots,onEnd,k){C1.on=true;C3.on=true;C1.mode='cut';C1.noWpn=true;if(k)mz3(k);for(const s of shots)s._f={};playCut(shots,()=>X.go(onEnd))}
function zoneBanner(t){C3.zone=t;C3.zoneT=2.6}

// ---------- ДВОР (ночной — к подвалу, и солнечный — финал) ----------
const DOOR={x:288,y:98},HZ={x:206,y:226},GU={x:268,y:196};
function lvYard3(sunny){
  L=E.mkLevel(sunny?'sunny':'yard3',YW,YH);
  L.bx.drawImage(yardCv,0,0);
  E.gfill(0,0,YW,YH,0);
  for(const s of ysolids)E.gfill(s.x,s.y,s.x+s.w,s.y+s.h,1);
  E.gfill(0,0,2,YH,1);E.gfill(YW-2,0,YW,YH,1);E.gfill(0,YH-2,YW,YH,1);E.gfill(198,252,214,258,1);
  for(let x=0;x<YW;x+=6){if(x>=146&&x<218)continue;B(x,246,6,4,(x/6)%2?'#8a7a5a':'#9a8a64');B(x,246,6,1,'#b0a078')}
  for(let x=0;x<YW;x+=3)B(x,251,1,1,'#9aa0a6');
  for(let x=6;x<YW;x+=18){if(ENTR.some(c=>Math.abs(c-x-3)<14)||Math.abs(x+4-DOOR.x)<14||Math.abs(x+4-144)<20)continue;for(let i=0;i<4;i++)B(x+1+i*2,70,1,10,'#1a1a1e')}
  // главный вход в подвал — заколочен Ханжой
  B(128,80,32,18,'#2a2226');for(let i=0;i<4;i++){B(126,82+i*4,36,2,'#8a6a40');B(126,82+i*4,36,1,'#a8885a')}B(130,80,2,18,'#6a4a2a');B(156,80,2,18,'#6a4a2a');
  for(let i=0;i<5;i++){B(124+i*8,100,8,6,'#8a7a5a');B(124+i*8,100,8,1,'#a89a74');B(128+i*8,104,8,6,'#7a6a4e')}E.gfill(124,100,168,110,2);
  txt(144,78,'ПОДВАЛ','#e8e0d0',5);
  // лазейка — техническая дверь с торца
  B(DOOR.x-8,82,16,16,'#3a3e44');B(DOOR.x-7,83,14,15,sunny?'#0a0a0c':'#5a6068');
  if(!sunny){B(DOOR.x-7,88,14,1,'#4a5058');B(DOOR.x+3,89,2,3,'#e8c050');B(DOOR.x-7,83,14,1,'#7a8088')}else{B(DOOR.x-12,84,5,14,'#5a6068')}
  txt(DOOR.x,80,'ТЕХ.','#9aa0a8',4);
  L.lights.push([DOOR.x,100,30,.7]);
  if(!sunny){
    for(const [x,y] of [[96,232],[60,240],[300,240]]){B(x-12,y-4,24,7,'#5a4a32');for(let i=0;i<3;i++)B(x-11,y-3+i*2,22,1,'#8a7a54')}
    B(92,222,8,8,'#3a3030');B(93,223,6,6,'#1a1010');E.gfill(92,222,100,230,2);L.lights.push([96,226,60,.9]);L.glow.push([96,226,46,'rgba(255,120,40,A)',.35,9]);
    L.lights.push([100,122,46,.8],[260,122,46,.8],[100,222,46,.8],[260,222,46,.8]);for(const c of ENTR)L.lights.push([c,92,22,.7]);
    L.glow.push([100,122,40,'rgba(255,190,110,A)',.2],[260,122,40,'rgba(255,190,110,A)',.2],[100,222,40,'rgba(255,190,110,A)',.2],[260,222,40,'rgba(255,190,110,A)',.2]);
    L.dark=.5;L.tint='14,4,10';
  }else{
    // солнечное утро: ни крови, ни огня
    for(let i=0;i<40;i++){const x=hash(i,3)*YW|0,y=116+(hash(3,i)*128|0);if(x>122&&x<238&&y>142&&y<198)B(x,y,1,1,hash(i,9)<.5?'#ffe070':'#ffffff')}
    L.dark=0;L.glow.push([220,40,240,'rgba(255,230,160,A)',.16],[120,180,160,'rgba(255,240,200,A)',.08]);
  }
  L.armed=false;
  X.buildNav();
  Q.jan={x:60,y:120,a:0,path:[],mv:false};
  if(!sunny){pl.x=180;pl.y=116;pl.a=Math.PI/2}
  else{pl.x=DOOR.x;pl.y=112;pl.a=Math.PI/2;Q.jan.x=DOOR.x+22;Q.jan.y=132}
  pl.ma=pl.a;pl.scoot=false;pl.sit=false;
  const hz=sunny?{x:DOOR.x-24,y:134,a:-Math.PI/2}:{x:HZ.x,y:HZ.y,a:-Math.PI/2},gu=sunny?{x:DOOR.x-46,y:150,a:-Math.PI/4}:{x:GU.x,y:GU.y,a:Math.PI};
  Q.hz=hz;Q.gu=gu;
  L.npcs=[
    {draw(){shadowBlob(hz.x,hz.y,5);X.drawSoldier(X.sprN.getContext('2d'),tm,{body:'#4a5a32',head:'#2e3a22',hair:'#8a6748',sk:'#efc5a5',gun:true});spr(X.sprN,hz.x,hz.y,hz.a)}},
    {draw(){shadowBlob(gu.x,gu.y,5);X.drawSoldier(X.sprN.getContext('2d'),tm,{body:'#3a4a2a',head:'#4a5a3a',gun:false});spr(X.sprN,gu.x,gu.y,gu.a)}},
    {draw(){const j=Q.jan;shadowBlob(j.x,j.y,6);drawJan(sprJ.getContext('2d'),j.mv?tm*2:(Q.janSweep?tm:0));spr(sprJ,j.x,j.y,j.a)}},
  ];
  L.onUpdate=dt=>{
    if(D2(pl.x,pl.y,hz.x,hz.y)<44)hz.a=Math.atan2(pl.y-hz.y,pl.x-hz.x);
    if(D2(pl.x,pl.y,gu.x,gu.y)<44)gu.a=Math.atan2(pl.y-gu.y,pl.x-gu.x);
    const j=Q.jan;j.mv=false;
    if(j.path.length){const tg=j.path[0],dx=tg.x-j.x,dy=tg.y-j.y,d=Math.hypot(dx,dy),sp=46*dt;
      if(d<sp){j.x=tg.x;j.y=tg.y;j.path.shift();if(!j.path.length&&j.then){const f=j.then;j.then=null;f()}}else{j.x+=dx/d*sp;j.y+=dy/d*sp;j.a=Math.atan2(dy,dx);j.mv=true}}
    else if(!sunny&&!Q.janGo){Q.janSweep=true;j.x+=(Q.jd||1)*7*dt;if(j.x>110)Q.jd=-1;if(j.x<40)Q.jd=1;j.a=(Q.jd||1)>0?0:Math.PI}
    else if(D2(pl.x,pl.y,j.x,j.y)<44)j.a=Math.atan2(pl.y-j.y,pl.x-j.x);
    if(!sunny&&Q.janAtDoor&&!Q.doorSaid&&D2(pl.x,pl.y,DOOR.x,DOOR.y+14)<34){Q.doorSaid=1;doorTalk()}
  };
  L.drawUnder=()=>{
    if(!sunny&&Q.doorOpen){F(DOOR.x-7,83,14,15,'#050405');if(Math.sin(tm*3)>.2){F(DOOR.x-4,90,1,1,'#ff2020');F(DOOR.x-2,90,1,1,'#ff2020')}if(Math.sin(tm*2.3+1)>.3){F(DOOR.x+2,93,1,1,'#ff2020');F(DOOR.x+4,93,1,1,'#ff2020')}}
    if(!sunny&&Q.doorOpen){const k=.4+.4*Math.sin(tm*5);ctx.strokeStyle=`rgba(255,210,58,${k})`;ctx.strokeRect(DOOR.x-9.5,81.5,19,18)}
  };
  L.drawOver=()=>{
    const tx=240,ty=212;F(tx-5,ty-4,10,8,'#3a4030');F(tx-4,ty-3,8,6,'#4a5040');
    ctx.save();ctx.translate(tx,ty);ctx.rotate(sunny?Math.PI/2:Math.sin(tm*.7)*1.3+Math.PI/2);F(0,-1,12,2,'#1a1a1e');ctx.restore();
    treeOver([[150,160,13],[200,176,15],[226,152,11],[136,190,9]]);
    if(sunny){for(let i=0;i<3;i++){const x=mod(tm*18+i*140,YW+40)-20,y=40+i*30+Math.sin(tm*2+i)*6;F(x,y,2,1,'#2a2a30');F(x+2,y-1,2,1,'#2a2a30');F(x-2,y-1,2,1,'#2a2a30')}}
  };
  if(!sunny){
    Q.talkH=false;Q.talkD=false;
    L.obj=()=>!Q.talkH?['Поговорить с командиром Ханжой (у калитки)']:!Q.talkD?['Найти дворника — он знает лазейку']:!Q.doorOpen?['Идти за дворником к технической двери']:['Спуститься в подвал'];
    L.its=[
      {get x(){return hz.x},get y(){return hz.y},r:22,label:()=>'Поговорить с командиром Ханжой',act:talkHanzha3},
      {get x(){return gu.x},get y(){return gu.y},r:18,label:()=>'Поговорить с Михалычем',act:()=>say([['G','Ну и котяра! Тебя бы к нам на турель.'],['C','Мне турель не нужна. У меня есть вот это.'],['G','...Понял. Не вопрос. Держи хвост пистолетом!']])},
      {get x(){return Q.jan.x},get y(){return Q.jan.y},r:20,label:()=>'Поговорить с дворником',cond:()=>!Q.janGo,act:talkJan3},
      {x:144,y:114,r:20,label:()=>'Главный вход в подвал',act:()=>say([['C','Доски, мешки с песком, два замка. Ханжа постаралась.'],['C','Тут даже я не пролезу. Нужен другой путь.']])},
      {x:DOOR.x,y:DOOR.y+12,r:16,label:()=>Q.doorOpen?'Спуститься в подвал':'Техническая дверь',act:()=>{
        if(!Q.doorOpen){say([['C','Заперто. Железная. Ключ, наверное, у дворника.']]);return}
        lockMove=true;X.go(()=>{lockMove=false;playC3(CUT_DOWN,()=>sec3('cellar'),'cut')})}},
    ];
    after(.6,()=>{zoneBanner('ДВОР');say([['C','Свежий воздух. Наконец-то.'],['C','Так. Сначала к Ханже. Она тут всем командует.']])});
  }else{
    Q.home=false;
    L.obj=()=>Q.home?['Вернуться домой (третий подъезд)']:[];
    L.its=[
      {get x(){return hz.x},get y(){return hz.y},r:22,label:()=>'Командир Ханжа',cond:()=>Q.home,act:()=>say([['H','Иди домой, герой. Тебя там ждут.']])},
      {get x(){return Q.jan.x},get y(){return Q.jan.y},r:20,label:()=>'Дворник',cond:()=>Q.home,act:()=>say([['D','Сегодня я даже мести не буду. Нечего. Чисто, как после субботника.']])},
      {get x(){return gu.x},get y(){return gu.y},r:18,label:()=>'Михалыч',cond:()=>Q.home,act:()=>say([['G','Турель свою сниму. Поставлю на дачу. Ворон гонять.']])},
      {x:ENTR[MY_ENTR],y:106,r:13,label:()=>'Зайти в подъезд',cond:()=>Q.home,act:()=>{lockMove=true;X.go(homeCh3)}},
    ];
    lockMove=true;
    after(.8,()=>say([['H','Черсик! Живой! Боец вернулся!'],['D','Гляньте-ка... Обычный кот. Опять маленький.'],
      ['c','Мяу. (Корм перестал действовать. Но дело сделано.)'],
      ['H','Ты не поверишь. Зомби на улице просто... растаяли. Как туман. Прямо у нас на глазах.'],
      ['D','И ни пятнышка не осталось. Ни крови, ничего. Будто и не было.'],
      ['H','У тебя получилось. В нашем районе зомби исчезли!'],['D','Только по радио говорят: за мостом и в других районах их ещё полно. Там свои крысиные короли.'],['H','Ну, значит, это только начало, боец.'],['G','Котяра — герой! Ура!'],
      ['c','Мрр. (Домой. Я устал.)']],()=>{Q.home=true;lockMove=false;zoneBanner('СОЛНЕЧНОЕ УТРО')}));
  }
}
function talkHanzha3(){
  if(Q.talkH){say([['H','К дворнику иди, боец. Он тебе лазейку покажет.']]);return}
  say([['H','Стой, кто идёт?! ...Черсик?! Мать честная. Это что с тобой сделали?!'],
    ['C','Протеин, тётушка. Тренерский. Новости слышали? Зараза пошла из подвала нашего дома.'],
    ['H','Слышала. Подвал я забаррикадировала ещё в первый день. Доски, мешки с песком, два замка.'],['H','Туда нет доступа. Ни туда, ни оттуда.'],
    ['C','Мне нужно вниз. Там крысиный король.'],
    ['H','Тогда хоть экипируйся, боец. Вот бронежилет. Жёсткий, армейский. И каска.'],
    ['C','Не надо. Моя шерсть как сталь. Мне ничего не почём.'],
    ['H','...Уважаю. Ладно. Через главный вход не пройдёшь, сама заколачивала.'],
    ['H','Но дворник покажет тебе одну лазейку. Он тут каждый угол знает.']],()=>{Q.talkH=true;sfx('click')});
}
function talkJan3(){
  if(!Q.talkH){say([['D','Ох ты ж... Черсик? Ну ты и раскабанел. Сначала к командиру зайди, она тут главная.']]);return}
  say([['D','Черсик? Ну ты и раскабанел...'],['C','Ханжа сказала, ты знаешь лазейку в подвал.'],
    ['D','Знаю. Техническая дверь, с торца. Ключи только у меня. Пойдём, покажу.']],()=>{
      Q.talkD=true;Q.janGo=true;Q.janSweep=false;const j=Q.jan;
      j.path=[{x:j.x,y:128},{x:DOOR.x-16,y:128},{x:DOOR.x-14,y:112}];
      j.then=()=>{Q.janAtDoor=true;j.a=-Math.PI/2};
    });
}
function doorTalk(){
  lockMove=true;
  say([['D','Вот она. Сейчас открою.'],['D','*звенит ключами* ...Этот нет. Этот нет. Вот.'],
    ['D','Только учти: там крыс и мышей — тьма тьмущая. Слышишь, как пищат?'],['D','Надеюсь, ты справишься.'],
    ['C','Справлюсь. Открывай.']],()=>{Q.doorOpen=true;sfx('click');sfx('thump',.5);lockMove=false});
}

// ---------- ПОДВАЛ ДОМА ----------
function lvCellar(){
  L=E.mkLevel('cellar',640,360);B(0,0,640,360,'#0e0d0c');
  floor3(0,164,632,200,'conc');
  const openT=[0,1,3,4,6],openB=[1,2,3,5,6];
  for(let i=0;i<7;i++){const x0=12+i*88,x1=x0+80;
    if(openT.includes(i)){floor3(x0,12,x1,156,'cell');E.gfill(x0+30,156,x0+50,164,0);floor3(x0+30,156,x0+50,164,'conc')}
    if(openB.includes(i)){floor3(x0,208,x1,348,'cell');E.gfill(x0+30,200,x0+50,208,0);floor3(x0+30,200,x0+50,208,'conc')}}
  floor3(616,150,640,214,'conc');
  X.drawWalls('#1a1816','#4a443a');
  // трубы вдоль коридора
  B(0,165,632,2,'#7a6a52');B(0,167,632,1,'#4a3e30');for(let x=40;x<632;x+=80){B(x,163,3,6,'#8a7a5a');B(x-1,164,5,1,'#c84a2a')}
  B(0,197,632,1,'#5a5a62');B(0,198,632,1,'#3a3a40');
  // кладовки: сетка-рабица на проёмах и хлам
  for(let i=0;i<7;i++){const x0=12+i*88;
    if(openT.includes(i)){X.lowBox(x0+4,16,30,8,'#5a4a36','#7a6a4e');for(let k=0;k<5;k++)B(x0+6+k*6,17,3,5,['#3a6a3a','#8a5a2a','#c8c0a0','#3a3a6a','#8a2a2a'][(k+i)%5]);
      X.lowBox(x0+56,40,18,40,'#4a4a52','#6a6a72');if(i%2)X.lowBox(x0+8,100,24,14,'#6a5a3a');droppings(x0,12,x0+80,156,30);
      for(let y=150;y<156;y+=2)for(let x=x0;x<x0+80;x+=2){if(x>=x0+30&&x<x0+50)continue;B(x,y,1,1,'#6a6a6e')}}
    if(openB.includes(i)){X.lowBox(x0+50,320,24,22,'#5a4a36','#7a6a4e');X.lowBox(x0+6,240,14,40,'#3a4a5a','#5a6a7a');if(i%2===0)X.lowBox(x0+30,290,30,10,'#6a6a62');droppings(x0,208,x0+80,348,30);
      for(let y=208;y<214;y+=2)for(let x=x0;x<x0+80;x+=2){if(x>=x0+30&&x<x0+50)continue;B(x,y,1,1,'#6a6a6e')}}}
  // лужи и следы заразы
  for(const [x,y,r] of [[150,182,8],[330,186,10],[470,176,7]]){const g=L.bx;g.fillStyle='#16201e';g.beginPath();g.ellipse(x,y,r*1.6,r*.8,0,0,TAU);g.fill()}
  slime(372,60,6);slime(110,300,5);slime(560,280,7);slime(560,90,5);
  // пролом в конце
  B(618,160,22,46,'#0a0606');for(let i=0;i<14;i++)B(606+rnd(0,14)|0,150+rnd(0,64)|0,rnd(2,5)|0,rnd(2,4)|0,['#5a5650','#7a766e','#3a3a40'][i%3]);
  txt(612,148,'ПРОЛОМ','#ff6a6a',5);
  hole(260,166);
  // свет: голые лампочки
  for(let x=60;x<632;x+=110){L.lights.push([x,182,44,.75]);L.glow.push([x,180,20,'rgba(255,220,140,A)',.18,x%3?0:13])}
  for(let i=0;i<7;i++){const x0=12+i*88;if(i%2===0){L.lights.push([x0+40,80,36,.5])}}
  L.dark=.64;L.tint='4,6,2';L.torch=true;L.arrows=true;L.flick=true;
  X.buildNav();
  pl.x=12;pl.y=182;pl.a=0;
  // обитатели
  nest(52,60,4,1);nest(140,110,3,1);nest(316,60,5,1);nest(404,120,4,0);nest(580,60,3,2);
  nest(140,270,4,1);nest(228,300,3,1);nest(316,250,5,1);nest(492,300,3,1);nest(580,260,4,1);
  for(const x of [200,380,540])Zr(x,182);
  Zrb(404,270);Zrb(580,110);Zrb(592,182);
  kfood(320,330);kfood(150,30);kfood(500,230);
  Q.trig.push({x:260,y:182,r:40,fn:()=>{sfx('groan',1.6);C1.shake=.4;for(let i=0;i<8;i++)Zm(260+rnd(-6,6),166+rnd(0,4),{st:'chase'});note('Из дыры в трубах лезут мыши!')}});
  L.obj=()=>[L.zs.length?'Перебить всех мышей и крыс: осталось '+L.zs.length:'Подвал чист  ✓','Пролом в конце подвала'];
  L.onUpdate=dt=>{trigs();if(!Q.clear&&!L.zs.length){Q.clear=1;say([['C','Чисто. А писк идёт из-за стены... Вон там, в конце, пролом.']])}};
  L.its=[{x:620,y:182,r:18,label:()=>'Пролом в катакомбы',act:()=>{if(L.zs.length){say([['C','Сначала доделаю тут. Не люблю, когда за спиной пищат. Осталось: '+L.zs.length+'.']]);return}X.go(()=>sec3('tunnels'))}}];
  after(.5,()=>{zoneBanner('ПОДВАЛ ДОМА');say([['C','Темно. Сыро. Пахнет... мышами.'],['C','Отлично. Ужин с доставкой.']],()=>note(touch.on?'Кнопка УДАР — когти. КОРМ — лечение':'ЛКМ — когти, третий удар подряд мощный. H — корм'))});
}

// ---------- КАТАКОМБЫ ----------
function lvTunnels(){
  L=E.mkLevel('tunnels',800,480);B(0,0,800,480,'#0c0a08');
  for(const [x0,y0,x1,y1] of [[0,200,280,280],[200,40,280,280],[200,40,560,120],[480,40,560,440],[280,360,560,440],[280,300,360,440],[480,200,800,280]])floor3(x0,y0,x1,y1,'brick');
  water(280,72,480,88);water(512,120,528,360);
  E.gfill(512,232,528,248,0);for(let x=510;x<530;x+=3)B(x,232,2,16,'#6a4a2a');B(510,232,20,1,'#8a6a40');B(510,247,20,1,'#4a3020');
  E.gfill(360,72,376,88,0);for(let y=70;y<90;y+=3)B(360,y,16,2,'#6a4a2a');
  X.drawWalls('#1e1612','#5a4436');
  // решётки ливнёвок — сверху падает свет
  for(const [x,y] of [[240,240],[380,56],[520,150],[420,400],[660,240]]){for(let i=0;i<4;i++)B(x-6+i*4,y-6,1,12,'#3a3a40');L.lights.push([x,y,40,.8]);L.glow.push([x,y,26,'rgba(200,220,255,A)',.12])}
  for(let i=0;i<30;i++){const x=rnd(0,800),y=rnd(0,480);if(E.gAt(x,y)===0){if(i%3)bones(x|0,y|0);else skull(x|0,y|0)}}
  slime(230,100,7);slime(540,330,6);slime(300,420,8);slime(700,260,6);slime(120,250,5);
  droppings(0,200,800,480,200);droppings(200,40,560,120,120);
  hole(556,54);hole(300,310);hole(780,214);
  // ворота логова
  B(784,204,16,72,'#1a0e0e');for(let y=206;y<276;y+=6)B(786,y,12,2,'#3a2420');B(788,226,8,28,'#050303');
  for(let i=0;i<8;i++)skull(770+(i%2)*6,206+i*8);
  txt(760,198,'ЛОГОВО','#ff5a5a',6);L.glow.push([790,240,50,'rgba(255,40,40,A)',.2,3]);
  L.dark=.68;L.tint='2,6,4';L.torch=true;L.arrows=true;
  X.buildNav();
  pl.x=10;pl.y=240;pl.a=0;
  nest(150,240,4,1);nest(240,160,3,1);nest(240,70,4,1);nest(420,100,5,1);nest(530,180,4,1);nest(500,400,5,1);nest(320,400,5,1);nest(620,240,5,2);nest(720,250,3,1);
  Zrb(240,250);Zrb(540,300);Zrb(330,330);Zrb(700,230);
  kfood(320,430);kfood(550,430);kfood(230,52);kfood(470,108);
  Q.trig.push({x:520,y:70,r:40,fn:()=>{sfx('groan',1.6);for(let i=0;i<9;i++)Zm(556+rnd(-5,5),60+rnd(-4,4),{st:'chase'});note('Писк! Они лезут из нор!')}});
  Q.trig.push({x:320,y:330,r:40,fn:()=>{sfx('groan',1.6);for(let i=0;i<8;i++)Zm(300+rnd(-5,5),316,{st:'chase'});Zr(300,316,{st:'chase'})}});
  Q.trig.push({x:680,y:240,r:44,fn:()=>{sfx('groan',2);C1.shake=.5;for(let i=0;i<12;i++)Zm(780,220+rnd(-6,6),{st:'chase'});Zr(776,226,{st:'chase'});Zr(776,234,{st:'chase'});note('Из логова выбегает охрана короля!')}});
  L.obj=()=>[L.zs.length?'Зачистить катакомбы: осталось '+L.zs.length:'Катакомбы чисты  ✓','Логово крысиного короля (справа)'];
  L.onUpdate=dt=>{trigs();if(!Q.clear&&!L.zs.length){Q.clear=1;say([['C','Тихо. Только вода капает.'],['C','Дальше — логово. Король там. Чую его.']])}};
  L.drawUnder=()=>{for(const [x0,y0,x1,y1] of Q.water){for(let i=0;i<6;i++){const x=x0+mod(tm*14+i*37,x1-x0),y=y0+mod(i*11+tm*6,y1-y0);if(x1-x0>y1-y0)F(x,y0+2+((i*5)%(y1-y0-4)),3,1,'rgba(140,220,150,.35)');else F(x0+2+((i*3)%(x1-x0-4)),y,1,3,'rgba(140,220,150,.35)')}}};
  L.its=[{x:780,y:240,r:20,label:()=>'Логово крысиного короля',act:()=>{if(L.zs.length){say([['C','Сзади ещё пищат. Сначала их. Осталось: '+L.zs.length+'.']]);return}X.go(()=>(window.HMC?HMC.cart(C3,()=>sec3('lair')):sec3('lair')))}},
    {x:540,y:424,r:16,label:()=>'Что-то светится в кислотной луже',cond:()=>!Q.glock,act:()=>{Q.glock=1;sfx('pickup');say([['C','Пистолет. Глок. Весь в зелёной слизи, и слизь... шипит.'],['C','Кислота из крысиных нор пропитала затвор. Пули теперь, похоже, разъедают.'],['C','Лапами мне не стрелять. Но Микроб оценит. Тащу домой в зубах.']],()=>{if(window.UP)UP.grant('glock');note('Найден Глок 17 «Кислота» — ждёт в оружейной')})}}];
  {const du=L.drawUnder;L.drawUnder=()=>{du();if(!Q.glock){const k=.5+.5*Math.sin(tm*4);F(530,418,20,10,'rgba(120,255,60,'+(.18+.12*k)+')');F(535,421,8,3,'#2a2a2a');F(536,424,3,4,'#2a2a2a');F(543,421,2,2,'#8aff3a')}}}
  after(.5,()=>{zoneBanner('КАТАКОМБЫ');say([['C','Катакомбы. Под всем нашим двором...'],['C','Да тут целый крысиный город.']])});
}

// ---------- ЛОГОВО КРЫСИНОГО КОРОЛЯ ----------
const THRONE={x:240,y:78};
function lvLair(){
  L=E.mkLevel('lair',480,400);B(0,0,480,400,'#0a0606');
  const cx=240,cy=210,R=168;
  for(let y=0;y<400;y+=4)for(let x=0;x<480;x+=4){if(Math.hypot(x+2-cx,(y+2-cy)*1.15)<R)floor3(x,y,x+4,y+4,'lair')}
  floor3(220,330,260,400,'lair');
  X.drawWalls('#140e0e','#4a2a2a');
  // трон из мусора и костей
  {const g=L.bx;for(let i=0;i<60;i++){g.fillStyle=['#3a3430','#5a5048','#d8d0b8','#4a3a2a','#2a2a30'][i%5];const a=rnd(Math.PI,TAU),r=rnd(10,38);g.fillRect(THRONE.x+Math.cos(a)*r*1.3,THRONE.y-6+Math.sin(a)*r*.7,rnd(2,6),rnd(2,5))}
    for(let i=0;i<10;i++)skull(THRONE.x-40+i*8,THRONE.y-26+Math.abs(i-4.5)*2)}
  E.gfill(THRONE.x-40,THRONE.y-34,THRONE.x+40,THRONE.y-14,2);
  for(const [x,y] of [[140,160],[340,160],[150,280],[330,280]]){const g=L.bx;g.fillStyle='#3a3028';g.beginPath();g.arc(x,y,9,0,TAU);g.fill();skull(x-2,y-6);bones(x-4,y+1);E.gfill(x-8,y-8,x+8,y+8,2)}
  for(let i=0;i<40;i++){const x=rnd(80,400),y=rnd(60,360);if(E.gAt(x,y)===0)(i%2?bones:skull)(x|0,y|0)}
  for(const [x,y] of [[112,142],[368,142],[106,280],[374,280]])hole(x,y);
  slime(200,240,9);slime(290,200,7);slime(240,320,6);slime(160,120,6);slime(330,110,6);
  txt(240,394,'▼ КАТАКОМБЫ','#9a7a6a',5);
  L.lights.push([240,210,90,.55],[THRONE.x,THRONE.y,60,.8]);L.glow.push([THRONE.x,THRONE.y,60,'rgba(255,200,60,A)',.12,2],[240,210,140,'rgba(90,255,80,A)',.06,1]);
  L.dark=.58;L.tint='6,2,4';L.torch=true;L.bossName='КРЫСИНЫЙ КОРОЛЬ';
  X.buildNav();
  pl.x=240;pl.y=380;pl.a=-Math.PI/2;
  Q.phase=0;Q.intro=false;Q.boss=null;Q.waveT=12;
  kfood(100,210);kfood(380,210);
  L.obj=()=>Q.boss&&!Q.boss.dead?['Убить крысиного короля']:Q.won?[]:['Подойти к трону'];
  L.onBossLow=z=>{
    if(Q.phase===0){Q.phase=1;z.minHp=850;z.sp=38;summon(10,2);roar(z,'ДЕТИ МОИ, КО МНЕ!')}
    else if(Q.phase===1){Q.phase=2;z.minHp=0;z.sp=46;summon(14,3);roar(z,'КОРОНА МОЯ! НЕ ОТДАМ!')}
  };
  L.onKill=z=>{if(z===Q.boss)kingDown(z)};
  L.onUpdate=dt=>{
    if(!Q.intro&&pl.y<330){Q.intro=true;lockMove=true;
      say([['C','Ну здравствуй, Величество.'],['K','Пи-и-и! Кто посмел явиться в моё царство?!'],['K','Я — король! Мои дети уже в каждом доме этого города!'],
        ['C','Ты в моём доме. В моём подвале. Под моей лежанкой.'],['C','Был король. Сейчас будет коврик.'],['K','Взять его-о-о!!!']],()=>{
          lockMove=false;sfx('groan',2);C1.shake=.7;
          Q.boss=E.addZ('boss',THRONE.x,THRONE.y+4,{v:230,hp:2600,max:2600,sp:30,r:9,st:'chase',minHp:1750});
          summon(6,0);
        })}
    if(Q.boss&&!Q.boss.dead){Q.waveT-=dt;if(Q.waveT<=0){Q.waveT=11;summon(4,Q.phase>0?1:0)}}
    if(Q.ghosts.length){for(const g of Q.ghosts){g.t-=dt;if(Math.random()<dt*14)L.fx.push({x:g.x+rnd(-5,5),y:g.y+rnd(-5,5),vx:rnd(-4,4),vy:rnd(-26,-12),life:rnd(.4,.8),c:Math.random()<.5?'#d8ffd0':'#ffffff'})}Q.ghosts=Q.ghosts.filter(g=>g.t>0)}
    if(Q.vanishT>0){Q.vanishT-=dt;const g=L.dx;g.save();g.globalCompositeOperation='destination-out';g.fillStyle='rgba(0,0,0,.035)';g.fillRect(0,0,L.w,L.h);g.restore()}
  };
  L.drawUnder=()=>{
    if(!Q.boss){const b=X.zBody('boss',230),k=1+Math.sin(tm*2)*.04;ctx.save();ctx.translate(THRONE.x,THRONE.y);ctx.rotate(Math.PI/2+Math.sin(tm*.8)*.15);ctx.scale(k,k);ctx.drawImage(b,-16,-16);ctx.restore();
      F(THRONE.x-1,THRONE.y+9,1,1,'#ff2020');}
  };
  after(.5,()=>{zoneBanner('ЛОГОВО КРЫСИНОГО КОРОЛЯ');say([['C','Вот оно. Сердце заразы.'],['C','А вон и трон. Кто-то там шевелится...']])});
}
function summon(nm,nr){
  const hs=Q.holes;if(!hs.length)return;sfx('groan',1.8);C1.shake=Math.max(C1.shake,.4);
  for(let i=0;i<nm;i++){const h=hs[i%hs.length];Zm(h[0]+rnd(-4,4),h[1]+rnd(-4,4),{st:'chase'})}
  for(let i=0;i<nr;i++){const h=hs[(i*3+1)%hs.length];Zr(h[0]+rnd(-4,4),h[1]+rnd(-4,4),{st:'chase'})}
}
function roar(z,t){C1.shake=Math.max(C1.shake,.8);sfx('power',.7);X.floatT(z.x,z.y-16,t,'#ff6a6a');note('Крысиный король: «'+t+'»')}
function kingDown(z){
  Q.won=true;C1.shake=1.2;sfx('power',1);
  after(.6,()=>{
    for(const m of L.zs){if(m.dead)continue;Q.ghosts.push({x:m.x,y:m.y,a:m.a,type:m.type,v:m.v,t:1.4+Math.random()*1.4});m.dead=true}
    L.zs.length=0;L.ebuls.length=0;Q.vanishT=5;
    for(let i=0;i<60;i++)L.fx.push({x:z.x+rnd(-20,20),y:z.y+rnd(-20,20),vx:rnd(-30,30),vy:rnd(-50,-10),life:rnd(.6,1.4),c:Math.random()<.5?'#d8ffd0':'#ffe070'});
  });
  after(3.4,()=>say([['C','Всё. Король мёртв.'],['C','Смотрите... Они тают. Все до одной. И кровь уходит.'],['K','Пи-и-и... Ты убил одного короля, котик...'],['K','Но нас много. В каждом районе этого города — свой король. Мы ещё встретимся...'],['C','Значит, наверху, в нашем районе, всё чисто. А до остальных королей я ещё доберусь.'],['C','Но сначала — домой.']],()=>{lockMove=true;X.go(()=>{lockMove=false;playC3(CUT_OUT,()=>{C3.buff=false;sec3('sunny')},'out')})}));
}
function trigs(){for(const t of Q.trig){if(t.done)continue;if(D2(pl.x,pl.y,t.x,t.y)<t.r){t.done=true;t.fn()}}}
function drawFx3(){
  for(const g of Q.ghosts||[]){const b=X.zBody(g.type,g.v),S=g.type==='boss'?32:24;ctx.save();ctx.globalAlpha=clamp(g.t/1.4,0,1)*.9;ctx.translate(Math.round(g.x),Math.round(g.y-(1.4-g.t)*4));ctx.rotate(g.a);ctx.drawImage(b,-S/2,-S/2);ctx.restore()}
  const s=C3.slash;if(s&&s.t>0){const k=s.t/s.T;ctx.save();ctx.globalAlpha=Math.min(1,k*1.6);ctx.strokeStyle=s.big?'#ffe27a':'#ffffff';ctx.lineWidth=1;
    const sweep=(1-k)*2.2-1.1;
    for(let i=0;i<3;i++){const r=(s.big?15:12)+i*2.2;ctx.beginPath();ctx.arc(pl.x,pl.y,r,s.a-1.1*s.side,s.a+sweep*s.side,s.side<0);ctx.stroke()}
    ctx.restore()}
}

// ================= КОГТИ И ПРОЧЕЕ ЗА КОТА =================
function claw(){
  C3.combo=C3.comboT>0?(C3.combo+1)%3:0;C3.comboT=.65;
  const big=C3.combo===2;C3.cd=big?.42:.19;C3.swing=.14;C3.side=C3.combo===1?-1:1;
  C3.slash={t:.14,T:.14,a:pl.a,big,side:C3.side};
  sfx('swing',1.3);const a=pl.a;let hit=0;
  for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const d=D2(pl.x,pl.y,z.x,z.y);if(d>z.r+(big?24:20))continue;
    const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(d>z.r+4&&Math.abs(angDiff(za,a))>(big?1.5:1.2))continue;
    const boss=z.type==='boss';X.hurtZ(z,boss?(big?45:22):(big?95:55),za,boss?0:(big?230:130));if(boss&&big)z.stun=Math.max(z.stun,.25);hit++}
  if(hit){sfx('bat',1.1);sfx('hit');C1.shake=Math.max(C1.shake,big?.35:.14)}
}
function solidC(x,y,r){const g=E.gAt;return g(x-r,y-r)||g(x+r,y-r)||g(x-r,y+r)||g(x+r,y+r)||g(x,y)}
function c3Tick(dt){
  PS.wpn='claws';PS.hasShotgun=false;PS.moon=0;PS.cd=1; // движок сам не бьёт за кота — удар делает claw()
  if(C3.cd>0)C3.cd-=dt;if(C3.swing>0)C3.swing-=dt;if(C3.comboT>0)C3.comboT-=dt;if(C3.slash&&C3.slash.t>0)C3.slash.t-=dt;
  if(PS.syr<C3.lastSyr){PS.regen+=70;sfx('pick');note('Хрум! Протеиновый корм — раны затягиваются');for(let i=0;i<8;i++)L.fx.push({x:pl.x+rnd(-5,5),y:pl.y+rnd(-5,5),vx:rnd(-10,10),vy:rnd(-30,-10),life:.6,c:'#ff7ab8'})}
  C3.lastSyr=PS.syr;
  if(C3.zoneT>0)C3.zoneT-=dt;
  const free=!dlg&&!tr&&!lockMove;
  if(!free||!L.armed)return;
  // кот-качок быстрее человека
  if(C3.buff){const [mx,my,ml]=X.inputMove();if(ml>.1){const sp=28*dt;const nx=pl.x+mx*sp,ny=pl.y+my*sp;if(!solidC(nx,pl.y,3.5))pl.x=nx;if(!solidC(pl.x,ny,3.5))pl.y=ny}}
  const btn=C1.fire!=null||C1.fireQ; // телефон: большая кнопка УДАР, направление — левым стиком
  if(C3.cd<=0&&((C1.mdown&&mouse.on&&!touch.on)||X.touchFiring()||btn)){if(btn&&!(touch.aim&&touch.aim.moved))clawAssist();claw();C1.fireQ=false}
  unstick(dt);
}
function clawAssist(){ // доводка: ближайший враг рядом и примерно впереди
  let best=null,bd=1e9;for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const d=D2(pl.x,pl.y,z.x,z.y);if(d>48||d>=bd)continue;
    const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(d>z.r+8&&Math.abs(angDiff(za,pl.a))>1.2)continue;best=za;bd=d}
  if(best!==null)pl.a=best}
function unstick(dt){ // враг, до которого не дойти (застрял в мебели/стене), переносится на ближайшее доступное место
  if(!L.nd||!L.nw)return;const NS=8;
  for(const z of L.zs){if(z.dead||z.st==='hidden')continue;
    const cx=Math.floor(z.x/NS),cy=Math.floor(z.y/NS),i=cy*L.nw+cx;
    const bad=cx<0||cy<0||cx>=L.nw||cy>=L.nh||L.nb[i]||L.nd[i]<0||solidC(z.x,z.y,z.r);
    z.unr=bad?(z.unr||0)+dt:0;if(z.unr<2.5)continue;z.unr=0;
    let done=false;for(let r=1;r<30&&!done;r++)for(let j=-r;j<=r&&!done;j++)for(let k=-r;k<=r&&!done;k++){if(Math.max(Math.abs(j),Math.abs(k))!==r)continue;
      const x=cx+k,y=cy+j;if(x<0||y<0||x>=L.nw||y>=L.nh)continue;const q=y*L.nw+x;if(L.nb[q]||L.nd[q]<0)continue;
      const nx=(x+.5)*NS,ny=(y+.5)*NS;if(solidC(nx,ny,z.r))continue;z.x=nx;z.y=ny;z.kbx=z.kby=0;if(z.st==='idle')z.st='chase';done=true}
  }
}

// ================= КАТ-СЦЕНЫ: отрисовка =================
const SKY_DAY=['#3a7ad8','#4a86dc','#5a92e0','#6a9ee4','#7aaae8','#8ab6ec','#9ac2f0','#aacef2','#bad8f4','#cae2f6'];
function withDay(fn){const bak=SKY_EVE.slice();SKY_EVE.splice(0,SKY_EVE.length,...SKY_DAY);try{fn()}finally{SKY_EVE.splice(0,SKY_EVE.length,...bak)}}
function catSide(x,y,t,s,mode){ // обычный кот сбоку, смотрит вправо, (x,y) — земля
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);
  const Bk='#141219',HL='#2f2a38',EY='#d4ea4f';
  const w=mode==='walk'?Math.round(Math.sin(t*12)*1.2):0;
  F(-6+w,-3,1,3,Bk);F(-4-w,-3,1,3,Bk);F(3+w,-3,1,3,Bk);F(5-w,-3,1,3,Bk);
  F(-7,-7,13,4,Bk);F(-6,-7,10,1,HL);
  const hd=mode==='eat'?3+Math.round(Math.sin(t*14)):0;
  F(5,-10+hd,5,5,Bk);F(5,-12+hd,1,2,Bk);F(8,-12+hd,1,2,Bk);F(8,-8+hd,1,1,EY);F(10,-7+hd,1,1,'#2f2630');
  for(let i=0;i<6;i++)F(-8-Math.round(Math.sin(t*3+i*.6)),-8-i,1,1,Bk);
  ctx.restore();
}
function buffSide(x,y,t,s,cl,o){ // кот-качок стоит на задних лапах, cl — длина когтей 0..1
  o=o||{};ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(o.flip?-s:s,s);
  const Bk='#141219',HL='#34303e',EY='#d4ea4f',CL='#e8ecf4';
  const br=Math.round(Math.sin(t*2)*.5);
  for(let i=0;i<8;i++)F(-7-Math.round(Math.sin(t*3+i*.5)*1.5),-6-i*1.5,2,2,Bk);
  F(-4,-9,3,9,Bk);F(1,-9,3,9,Bk);F(-5,-1,4,1,Bk);F(1,-1,4,1,Bk);
  F(-5,-19+br,10,11,Bk);F(-7,-21+br,14,5,Bk);
  F(-3,-17+br,6,1,HL);F(-1,-14+br,2,1,HL);F(-1,-12+br,2,1,HL);F(-6,-20+br,4,1,HL);F(2,-20+br,4,1,HL);
  F(-9,-19+br,3,9,Bk);F(6,-19+br,3,9,Bk);F(-9,-11+br,3,3,Bk);F(6,-11+br,3,3,Bk);
  F(-8,-17+br,1,4,HL);F(7,-17+br,1,4,HL);
  if(cl>0){const n=Math.round(cl*7);for(let i=0;i<3;i++){F(5+i*2,-11+br-n,1,n,CL);F(-10+i*2,-11+br-n,1,n,CL)}if(cl>=1&&o.shine){F(8,-18+br,1,1,'#ffffff');F(-8,-18+br,1,1,'#ffffff')}}
  F(-4,-28+br,8,8,Bk);F(-4,-31+br,2,3,Bk);F(2,-31+br,2,3,Bk);F(-3,-30+br,1,1,'#3a2630');F(3,-30+br,1,1,'#3a2630');
  F(-3,-25+br,2,1,EY);F(1,-25+br,2,1,EY);F(-3,-26+br,2,1,'#050405');F(1,-26+br,2,1,'#050405');
  F(-1,-23+br,2,1,'#3a2a34');F(-1,-22+br,2,1,o.open?'#6a2a3a':Bk);
  ctx.restore();
}
function sideJan(x,y,t,o){
  o=o||{};ctx.save();ctx.translate(Math.round(x),Math.round(y));if(o.left)ctx.scale(-1,1);
  const SK='#d8a080';F(-3,-10,2,10,'#3a3a42');F(0,-10,2,10,'#3a3a42');F(-4,-1,3,1,'#1a1a1e');F(0,-1,3,1,'#1a1a1e');
  F(-4,-22,8,12,'#7adf3a');F(-4,-17,8,1,'#e8e8e8');F(-4,-13,8,1,'#e8e8e8');F(2,-20,2,8,'#5aaf2a');F(3,-12,2,2,SK);
  if(o.keys){F(5,-13,1,3,'#e8c050');F(6,-12,2,1,'#e8c050');F(5,-10,2,1,'#c8a030')}
  F(-3,-30,7,8,SK);F(-4,-31,9,3,'#2a4a2a');F(3,-29,3,1,'#2a4a2a');F(2,-27,1,1,'#2a1e18');F(-2,-25,5,2,'#8a6a50');
  ctx.restore();
}
function kitchenSide(t){
  F(0,0,W,124,'#d8c8a8');for(let y=60;y<124;y+=8)F(0,y,W,1,'#c8b898');for(let x=0;x<W;x+=12)F(x,60,1,64,'#c8b898');
  F(0,52,W,8,'#8a6a48');F(0,56,W,1,'#6a4a30');for(let x=20;x<W;x+=60){F(x,10,40,40,'#a88a68');F(x+2,12,36,36,'#b89a78');F(x+18,28,4,2,'#d8c8a8')}
  F(0,124,W,56,'#8a8274');for(let y=124;y<180;y+=8)for(let x=((y/8)%2)*8;x<W;x+=16)F(x,y,8,8,'#c8c0ae');
  F(140,150,26,6,'#3a7ac8');F(142,148,22,3,'#5a9ae8');F(146,148,14,2,'#a87a3a');
  F(186,110,28,40,'#e8e0d0');F(186,110,28,8,'#ff4fa3');ctx.fillStyle='#120a1c';ctx.font='bold 5px monospace';ctx.textAlign='center';ctx.fillText('КОТ-',200,126);ctx.fillText('ПРОТЕИН',200,133);ctx.textAlign='left';
  F(194,138,12,6,'#141418');F(196,140,2,2,'#d4ea4f');F(202,140,2,2,'#d4ea4f');
  ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,160,30,120,'rgba(255,230,180,A)',.12);ctx.restore();
}
function livingSide(t){
  F(0,0,W,180,'#18122a');for(let x=0;x<W;x+=40)F(x,0,1,130,'#221a38');
  F(0,128,W,52,'#2a2238');for(let x=0;x<W;x+=24)F(x,128,1,52,'#241c32');
  F(20,18,280,2,'rgba(40,230,150,.6)');F(20,126,280,2,'rgba(40,230,150,.6)');
  F(230,40,60,40,'#0e0e16');F(232,42,56,30,'#2a3a6a');F(256,80,8,14,'#1a1a1e');F(244,94,32,3,'#2a2a30');
  ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,160,10,90,'rgba(255,60,190,A)',.18);radial(ctx,260,60,40,'rgba(120,160,255,A)',.25);ctx.restore();
}
function newsBar(head,good){
  F(0,12,W,12,good?'#1a6a3a':'#c0101a');ctx.fillStyle='#fff';ctx.font='bold 7px monospace';ctx.fillText(good?'ХОРОШИЕ НОВОСТИ':'СРОЧНО · ПРЯМОЕ ВКЛЮЧЕНИЕ',6,21);
  ctx.textAlign='right';ctx.fillText('НЕВА 24',W-6,21);ctx.textAlign='left';
  F(6,H-40,W-12,10,'rgba(245,245,245,.95)');F(6,H-40,4,10,good?'#1a6a3a':'#c0101a');ctx.fillStyle='#111';ctx.font='bold 6px monospace';ctx.fillText(head,13,H-32.5);
  ctx.fillStyle='rgba(255,255,255,.035)';for(let y=0;y<H;y+=2)ctx.fillRect(0,y,W,1);
}
function heli(x,y,t){F(x-10,y-4,20,8,'#2a4a6a');F(x-6,y-3,8,4,'#8ac0e8');F(x+10,y-2,16,2,'#2a4a6a');F(x+24,y-5,2,6,'#2a4a6a');F(x-6,y+5,16,1,'#1a1a1e');
  const r=Math.sin(t*40)>0;F(x-(r?18:6),y-7,r?36:12,1,'#1a1a1e');F(x+22,y-(r?7:3),1,r?8:2,'#1a1a1e')}
const CUT_TRANSFORM=[
  {dur:4.6,subs:[[.3,2.3,'c','Хрум-хрум-хрум...'],[2.4,4.4,'s','Ой. Черсик? А ты чего... светишься?']],draw(t){
    kitchenSide(t);catSide(124,156,t,3,'eat');
    if(t>2.2){ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,124,138,40+Math.sin(t*12)*6,'rgba(120,255,120,A)',(t-2.2)*.25);ctx.restore()}}},
  {dur:5,subs:[[.4,2.5,null,'(ХРУСТ. Мышцы растут прямо на глазах.)'],[2.7,4.8,'m','Э-э-э... Шмакодявка, это нормально?!']],draw(t,s){
    kitchenSide(t);const p=clamp((t-.3)/3.2,0,1);
    ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,124,120,70+p*40,'rgba(120,255,120,A)',.35+Math.sin(t*20)*.15);ctx.restore();
    if(p<.55){const sc=3+p*3.6+Math.sin(t*30)*.2;catSide(124,156,t,sc,'stand')}else{buffSide(124,158,t,1.6+(p-.55)*4.4,0)}
    if(!s._f.boom&&p>.55){s._f.boom=1;cut.shake=1;sfx('power',.8);sfx('thump',1);for(let i=0;i<40;i++)cparts.push({x:124+rnd(-20,20),y:120+rnd(-30,30),vx:rnd(-60,60),vy:rnd(-70,10),g:120,life:1.4,c:Math.random()<.5?'#9aff7a':'#e8ff9a'})}
    drawSmoke();
    if(t<4&&Math.random()<.3)cut.shake=Math.max(cut.shake,.25)}},
  {dur:1,lines:[['C','Я готов.'],['C','Я готов спасти этот мир. Во мне полно сил!'],['s','Тренер... Что ты туда намешал?!'],
    ['C','Смотрите.'],['C','Когти. Как у росомахи.'],['m','Ничего себе...'],
    ['C','Только выпустите меня наружу.'],['C','И я устрою этим зомби апокалипсис.']],draw(t,s){
    livingSide(t);sideMikrob(40,170,t,'stand');
    const d=s._f;if(dlg&&dlg.i>=4&&!d.snikt){d.snikt=t;sfx('swing',1.6);sfx('glass',.5);cut.shake=.5}
    const cl=d.snikt?clamp((t-d.snikt)*5,0,1):0;
    buffSide(170,170,t,3.6,cl,{shine:Math.sin(t*4)>.6});
    if(d.snikt&&t-d.snikt<.25){ctx.fillStyle=`rgba(255,255,255,${.6-(t-d.snikt)*2.4})`;ctx.fillRect(0,0,W,H)}}},
];
const CUT_NEWS3=[
  {dur:.9,draw(){noise()}},
  {dur:7.4,subs:[[.3,2.5,'r','Прерываем эфир! Срочное включение.'],[2.6,4.9,'r','Учёные выяснили: вирус пошёл от мышей.'],[5,7.3,'r','Заражение началось в подвале жилого дома. Десятиэтажка из красного кирпича.']],draw(t){
    sky(SKY_RED,12,110);drawFar(60,110,true);F(0,110,W,70,'#1a080c');
    for(let i=0;i<8;i++){const x=mod(i*47-t*20,W+20)-10;F(x,150+(i%3)*6,6,3,'#4a4440');F(x+6,150+(i%3)*6,2,2,'#4a4440');F(x-3,151+(i%3)*6,3,1,'#c08890')}
    const talk=Math.floor(t*9)%2===0;pReporter(portR.getContext('2d'),talk,(t%3.2)>3.05,false);ctx.imageSmoothingEnabled=false;ctx.drawImage(portR,40,26,128,128);
    newsBar('ВИРУС ПОШЁЛ ОТ МЫШЕЙ',false)}},
  {dur:7.6,subs:[[.3,2.7,'r','Там, внизу, живёт источник заразы — крысиный король.'],[2.8,5.1,'r','Если его уничтожить, вирус перестанет действовать.'],[5.2,7.5,'r','Это шанс остановить заражение хотя бы здесь!']],draw(t){
    drawHouse(t);ctx.fillStyle='rgba(80,0,10,.25)';ctx.fillRect(0,0,W,H);
    const k=.5+.5*Math.sin(t*6);ctx.strokeStyle=`rgba(255,40,40,${.5+k*.5})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(160,150,60+k*4,10+k,0,0,TAU);ctx.stroke();ctx.lineWidth=1;
    for(let i=0;i<10;i++){const x=mod(i*31+t*40,W);F(x,153,5,2,'#3a3430');F(x+5,153,1,1,'#ff2020')}
    if(t>2.6){ctx.save();ctx.translate(250,60);const sc=1+Math.sin(t*3)*.05;ctx.scale(sc,sc);ctx.drawImage(X.zBody('boss',230),-16,-16);ctx.restore();F(236,78,28,1,'#ff4040')}
    pReporter(portR.getContext('2d'),Math.floor(t*9)%2===0,false,false);F(6,30,52,52,'#c0101a');ctx.drawImage(portR,8,32,48,48);
    newsBar('ИСТОЧНИК ЗАРАЗЫ — КРЫСИНЫЙ КОРОЛЬ',false)}},
];
const CUT_DOWN=[
  {dur:1,lines:[['D','Всё, открыл. Дальше без меня, я туда ни ногой.'],['C','Закрой за мной. Если оттуда что-то полезет — это буду не я.'],['D','С богом, котяра.']],draw(t){
    F(0,12,W,140,'#8a3426');for(let y=12;y<152;y+=4){F(0,y,W,1,'#7a2c20');for(let x=((y/4)%2)*6;x<W;x+=12)F(x,y+1,1,3,'#7a2c20')}
    F(0,150,W,30,'#4a4652');F(0,150,W,1,'#6a6672');
    F(136,62,48,90,'#3a3e44');F(140,66,40,86,'#050405');F(184,66,6,86,'#5a6068');
    for(let i=0;i<6;i++)F(144+i*5,120+i*5,34-i*5,2,'#141210');
    for(let i=0;i<5;i++){if(Math.sin(t*2.3+i*1.7)>.2){const x=146+(i*7)%28,y=80+(i*13)%60;F(x,y,1,1,'#ff2020');F(x+3,y,1,1,'#ff2020')}}
    ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,100,40,60,'rgba(255,190,110,A)',.25);ctx.restore();
    buffSide(100,170,t,2.2,1);sideJan(220,168,t,{left:true,keys:true});
    ctx.fillStyle='rgba(10,4,20,.35)';ctx.fillRect(0,0,W,H)}},
];
const CUT_OUT=[
  {dur:5.4,subs:[[.3,2.4,null,'(Наверх. К свету.)'],[2.6,5.2,null,'(Корм перестал действовать. Я снова обычный кот.)']],draw(t,s){
    F(0,0,W,H,'#141210');for(let i=0;i<9;i++)F(30+i*28,160-i*12,30,4+i*12,'#2a2622');for(let i=0;i<9;i++)F(30+i*28,160-i*12,30,1,'#4a443c');
    const op=clamp((t-.5)/1.5,0,1);F(262,20,40,52,'#3a3e44');F(264,22,36,50,`rgba(255,240,200,${op})`);
    ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,282,46,90,'rgba(255,240,200,A)',op*.5);ctx.restore();
    const q=clamp(t/4,0,1),x=40+q*220,y=158-q*96;
    if(t<2.4)buffSide(x,y,t,1.6,0);
    else{if(!s._f.pop){s._f.pop=1;sfx('pick');for(let i=0;i<30;i++)cparts.push({x,y:y-10,vx:rnd(-40,40),vy:rnd(-50,0),g:60,life:1.2,c:Math.random()<.5?'#ffffff':'#d8ffd0'})}catSide(x,y,t,1.8,'walk')}
    drawSmoke()}},
  {dur:5,subs:[[.3,4.8,null,'(Солнце. Тишина. Ни одного зомби. Ни капли крови.)']],draw(t){
    withDay(()=>drawHouse(t));ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,290,22,70,'rgba(255,240,170,A)',.5);ctx.restore();F(286,18,8,8,'#fff6c0');
    for(let i=0;i<4;i++){const bx=mod(t*20+i*80,W+20)-10,by=30+i*7+Math.sin(t*3+i)*3;F(bx,by,2,1,'#2a2a30');F(bx+2,by-1,2,1,'#2a2a30');F(bx-2,by-1,2,1,'#2a2a30')}
    catSide(Math.min(196,150+t*14),157,t,1.3,t<3.2?'walk':'stand')}},
];
const CUT_RESTORE=[
  {dur:7.4,subs:[[.3,3.5,'r','Хорошие новости! В одном из районов города заражённые исчезли прямо на глазах.'],[3.6,7.2,'r','Но жители видели, как по коллекторам уходят полчища крыс. В сторону центра.']],draw(t,s){
    // 03.11: шпиль больше не ставят — крысы разбегаются по городу (лор финала)
    withDay(()=>drawPanorama(t,false,{a:.0001,gone:true}));
    F(0,160,W,20,'#3a3640');F(0,160,W,1,'#5a5662');F(40,166,22,6,'#1a1820');F(42,167,18,1,'#4a4652');
    for(let i=0;i<34;i++){const sp=60+(i%5)*14,x=W+20-mod(t*sp+i*37,W+60),y=163+(i*7)%14,ph=Math.sin(t*22+i)>0;
      F(x,y,5,2,'#2a2228');F(x-2,y,2,1,'#2a2228');F(x+5,y+1,4,1,'#5a4a50');F(x+1,y+2,1,ph?1:0,'#2a2228');F(x-1,y,1,1,'#ff3030')}
    if(!s._f.sq&&t>3.6){s._f.sq=1;sfx('thump',.4)}
    drawSmoke();newsBar('ОЧАГ ПОДАВЛЕН · КРЫСЫ УХОДЯТ В ЦЕНТР',true)}},
  {dur:6,subs:[[.3,2.9,'r','Очищенный район оживает. Люди выходят на улицы.'],[3,5.8,'r','Но в других частях города заражение продолжается. Учёные ищут новые очаги.']],draw(t){
    const off=600+t*30;sky(SKY_DAY,12,104);drawFar(off*.2,104,false);drawStrip(STRIP,off,142,false,t);street(off,142,false);
    for(let i=0;i<3;i++){const x=i*130-mod(off*.6,130)+60;F(x,30,3,112,'#e8c040');F(x,30,50,3,'#e8c040');for(let k=0;k<5;k++)F(x+6+k*9,31,1,1,'#2a2a30');F(x+44,33,1,20,'#2a2a30');F(x+41,53,7,5,'#8a8a90')}
    for(let i=0;i<8;i++){const sp=i%2?16:-14,x=mod(i*53+t*sp,W+40)-20;sidePed(x,148,t+i,PAL[i%PAL.length],sp>0?1:-1,false)}
    newsBar('НАШ РАЙОН ОЖИВАЕТ · ЦЕНТР ПОД УГРОЗОЙ',true)}},
  {dur:4.4,subs:[[.3,4.2,null,'(А в одной квартире красного кирпичного дома...)']],draw(t){
    withDay(()=>drawHouse(t));ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,290,22,70,'rgba(255,240,170,A)',.45);ctx.restore();F(286,18,8,8,'#fff6c0');
    for(let i=0;i<5;i++){const bx=mod(t*22+i*70,W+20)-10,by=26+i*6+Math.sin(t*3+i)*3;F(bx,by,2,1,'#2a2a30');F(bx+2,by-1,2,1,'#2a2a30');F(bx-2,by-1,2,1,'#2a2a30')}}},
];

// ================= СЮЖЕТ В КВАРТИРЕ =================
function setFlat3(calm){
  C1.on=false;C1.mode=null;C1.noWpn=false;C3.on=true;if(window.C2){C2.on=false;C2.zone=null}scene='flat';cut=null;dlg=null;tr=null;S.fade=0;state='play';
  S.step=12;S.alarm=!calm;S.skladLocked=false;S.bat=S.pistol=!calm;S.bowls=true;mapDirty=true;lastRoom=null;camY=0;
  pl.scoot=false;pl.sit=false;lockMove=true;C3.zzz=false;
  shmak.mode='stand';shmak.hug=0;shmak.path=[];cat.path=[];cat.then=null;
}
function startCh3(){
  C3.started=true;C3.done=false;C3.buff=false;
  setFlat3(false);mz3('feed');
  pl.x=136;pl.y=318;pl.a=0;pl.ma=0;shmak.x=200;shmak.y=322;shmak.a=Math.PI;
  cat.x=196;cat.y=300;cat.a=Math.PI/2;cat.mode='idle';
  after(.8,()=>say([
    ['s','Ну что, Черсик. Момент истины.'],['s','Протеиново-креатиново-моногидратный. Одна порция, как тренер велел.'],
    ['m','Может, для начала половинку? Мало ли.'],['c','МЯУ! (Целую. Немедленно.)'],['s','Кушай, мой хороший.']],()=>{
      catGo([{x:176,y:340}],()=>{cat.mode='eat';cat.a=Math.PI/2;
        after(1.6,()=>{S.shake=1.2;sfx('power',.7);for(let i=0;i<30;i++)parts.push({x:cat.x+rnd(-8,8),y:cat.y+rnd(-8,8),vx:rnd(-12,12),vy:rnd(-16,4),life:2,c:'stink'});
          after(1.4,()=>X.go(()=>playC3(CUT_TRANSFORM,()=>playC3(CUT_NEWS3,afterNews3,'news'),'cut')))})});
    }));
}
function afterNews3(){
  C3.buff=true;setFlat3(false);mz3('talk');
  pl.x=136;pl.y=318;pl.a=0;pl.ma=0;shmak.x=200;shmak.y=322;shmak.a=Math.PI;
  cat.x=170;cat.y=334;cat.a=-Math.PI/2;cat.mode='idle';
  after(.6,()=>say([
    ['m','Вау... Это же наш дом!'],['s','Как так?! Всё началось прямо у нас под ногами?'],
    ['m','Интересно, Ханжа забаррикадировала подвал? Чтобы к нам оттуда никто не пробрался.'],
    ['C','Я пойду проверю.'],['C','Оставайтесь здесь. Я всё порешаю.'],
    ['s','Черсик, стой! Возьми с собой корм. Пять порций.'],['s','Если ранят — поешь, и всё заживёт. Тренер говорил, он и лечит.'],
    ['C','Спасибо, мам.'],['m','Возвращайся живым, боец. Мы тебя ждём.']],()=>{
      Object.assign(PS,{hp:250,max:250,lives:3,inv:0,wpn:'claws',ammo:0,shells:0,syr:5,moon:0,hasShotgun:false,regen:0,carry:false});
      C3.kills0=PS.kills;note('Корм у Черсика: 5 порций — лечение');
      catGo([{x:124,y:300},{x:120,y:262},{x:190,y:214},{x:222,y:204}]);
      after(2.2,()=>X.go(()=>sec3('yard3')));
    }));
}
function homeCh3(){
  C3.buff=false;setFlat3(true);mz3('home');
  pl.x=184;pl.y=196;pl.a=0;pl.ma=0;shmak.x=196;shmak.y=176;shmak.a=0;
  cat.x=222;cat.y=204;cat.a=Math.PI;cat.mode='idle';
  after(.7,()=>say([['m','Черсик!!!'],['s','Черсик вернулся!']],()=>{
    shmak.hug=1.6;for(let i=0;i<14;i++)parts.push({x:cat.x+rnd(-10,6),y:cat.y+rnd(-8,4),vx:rnd(-6,6),vy:rnd(-22,-10),life:1.8,c:'heart'});
    after(1.6,()=>say([['m','Мы всё видели в окно. Зомби просто исчезли. Растворились!'],
      ['s','И по новостям реально передали: у нас в районе зомби исчезают!'],['m','Только у нас. Дальше по городу всё как было.'],['s','А крысы? Ханжа говорит, ночью из люков полезли целые стаи. Все — в сторону центра.'],['m','Значит, они не сдались. Просто ушли готовить что-то в другом месте.'],
      ['c','Мяу. (Я в курсе. Это был я.)'],['s','Ты наш герой. Самый сильный котик на свете.'],['m','Смотри, опять новости...']],()=>{
        X.go(()=>playC3(CUT_RESTORE,finalFlat,'restore'));
      }));
  }));
}
function finalFlat(){
  C3.buff=false;setFlat3(true);mz3('final');
  pl.x=176;pl.y=74;pl.a=0;pl.ma=0;shmak.x=150;shmak.y=70;shmak.a=0;
  cat.x=190;cat.y=110;cat.a=-Math.PI/2;cat.mode='idle';
  after(.8,()=>say([['c','Мрр... (Фух. Слава богу.)'],['c','Мяу. (Я же говорил, что справлюсь с задачей.)']],()=>{
    catGo([{x:206,y:70},CAT_HOME],()=>{cat.mode='sleep';C3.zzz=true;
      after(2.4,()=>say([
        ['m','Ну вот. Спит наш спаситель.'],['m','Шмакодявка... И что же мы будем делать дальше?'],
        ['s','Дай я одну каточку в CS сыграю, потом посмотрим.'],['s','А ты пока найди нам фильм.'],
        ['s','И я там рилсиков в Инстаграме накидала. Перед сном посмотрим.'],
        ['s','И вообще, завтра у меня реснички. Потом брови. Потом волосы. Дел куча!'],
        ['m','...Окей.'],['m','Мне, видимо, в офис завтра уже ехать не надо. От него ничего не осталось.'],['m','Пора искать новую работу.'],['n','...Крысы из уничтоженного очага расходятся по другим районам. Специалисты предупреждают: зараза может вернуться. И это не последний крысиный король...'],['m','Слышишь? Это ещё не конец.'],['s','Значит, завтра и решим. Всё вместе. Втроём.'],['c','Мрр... (Высплюсь — и пойдём за остальными королями.)']],()=>{
          shmakGo([{x:136,y:58},{x:136,y:40}],()=>{shmak.mode='sit';pl.a=-Math.PI/2;after(2.2,()=>{C3.done=true;S.fade=.01})});
        }));
    });
  }));
}

// ================= ПОДМЕНА ЦИКЛА =================
const _update=update,_render=render,_action=action;
update=function(dt){
  _update(dt);
  if(C1.TB&&C1.TB.h)C1.TB.h.t=(C3.on&&C1.noWpn)?'КОРМ':'ШПРИЦ';
  if(state!=='play'||cut||C1.over)return;
  if(C3.on&&C1.on&&C1.mode==='td'&&L&&E.L===L)c3Tick(dt);
  if(C3.on&&!C1.on&&scene==='flat'&&C3.zzz&&Math.random()<dt*1.2)parts.push({x:cat.x+4,y:cat.y-6,vx:rnd(2,5),vy:-8,life:2.2,c:'zzz'});
};
function heart(x,y,on){u.fillStyle=on?'#ff3a5a':'rgba(255,255,255,.18)';u.fillRect(x,y,2,1);u.fillRect(x+3,y,2,1);u.fillRect(x,y+1,5,2);u.fillRect(x+1,y+3,3,1);u.fillRect(x+2,y+4,1,1)}
function hud3(){
  panel(4,4,112,30,.72);u.fillStyle='#d4ff3a';u.fillRect(4,4,2,30);
  uiFont(4,true);u.fillStyle='#9a92b0';u.fillText('HP',9,10.5);X.hudBar(20,6.5,66,4,PS.hp/PS.max,PS.hp<PS.max*.3?'#ff3a3a':'#c6ef4a');
  if(PS.regen>0){u.fillStyle='rgba(255,122,184,.55)';u.fillRect(20+66*PS.hp/PS.max,6.5,Math.min(66*(1-PS.hp/PS.max),66*PS.regen/PS.max),4)}
  if(!C1.hard)for(let i=0;i<3;i++)heart(91+i*7,6,i<PS.lives);
  uiFont(5,true);u.fillStyle='#ffd23a';u.fillText('КОГТИ'+(C3.comboT>0&&C3.combo===1?'  · ещё удар — мощный!':''),9,19);
  uiFont(4.4,false);u.fillStyle='#ffb0d8';u.fillText('Корм: '+PS.syr+(touch.on?'':' [H]')+'     Убито: '+(PS.kills-C3.kills0),9,28);
}
render=function(){
  _render();
  if(state!=='play')return;
  if(C3.on&&C1.on&&C1.mode==='td'&&!cut&&L&&E.L===L){
    if(L.armed)hud3();
    if(C3.zone&&C3.zoneT>0&&!dlg){u.globalAlpha=Math.min(1,C3.zoneT);uiFont(7,true);u.textAlign='center';u.fillStyle='rgba(0,0,0,.6)';u.fillText(C3.zone,W/2+.5,46.5);u.fillStyle='#d4ff3a';u.fillText(C3.zone,W/2,46);u.textAlign='left';u.globalAlpha=1}
  }
  if(C3.on&&!C1.on&&scene==='flat'&&!cut){
    ctx.save();ctx.translate(-camX,-camY);ctx.font='bold 5px monospace';
    for(const p of parts){if(p.c!=='zzz')continue;ctx.fillStyle=`rgba(220,230,255,${Math.min(1,p.life*.6)})`;ctx.fillText('z',Math.round(p.x),Math.round(p.y))}
    ctx.restore();
  }
};
action=function(){
  if(state==='end'&&window.C2&&C2.done&&!C3.done){continueCh3();return}
  return _action();
};

// ================= ЭКРАНЫ КОНЦА =================
const _re=renderEnd;
renderEnd=function(){
  if(C3.done){
    panel(0,0,W,H,1);u.textAlign='center';
    uiFont(15,true);u.fillStyle='#ff2a7a';u.fillText('ПРОДОЛЖЕНИЕ СЛЕДУЕТ',W/2+1.5,34+1.5);u.fillStyle='#ffd23a';u.fillText('ПРОДОЛЖЕНИЕ СЛЕДУЕТ',W/2,34);
    uiFont(6.4,true);u.fillStyle='#d4ff3a';u.fillText('Конец первой части · Глава 3 · Крысиные бега',W/2,46);
    const ws=['m','s','c'];ws.forEach((w,i)=>{const x=W/2-104+i*72,y=54+Math.sin(tm*2+i)*1.5;u.fillStyle=BG[w][0];u.fillRect(x,y,64,64);u.strokeStyle=BG[w][1];u.lineWidth=.8;u.strokeRect(x,y,64,64);
      const g=PCV[w].getContext('2d');PORTRAIT[w](g,false,w==='c'?true:(tm+i)%3.4>3.25);u.imageSmoothingEnabled=false;u.drawImage(PCV[w],x,y,64,64);uiFont(5,true);u.fillStyle=NCOL[w];u.fillText(NAME[w],x+32,y+72)});
    uiFont(4.6,true);u.fillStyle='#c8c0e0';u.fillText('zZz',W/2+72+46,62+Math.sin(tm*2)*2);
    uiFont(5.2,false);u.fillStyle='#fff';u.fillText('Крыс и мышей: '+Math.max(0,PS.kills-C3.kills0)+'   ·   Всего за игру: '+PS.kills,W/2,140);
    u.fillStyle='#3ef0b0';u.fillText('Наш район спасён. Но зараза ещё по всему городу.',W/2,150);
    u.fillStyle='#9a92b0';uiFont(4.6,false);u.fillStyle='#ffb0d8';u.fillText('Впереди: новые районы, новые крысиные короли, новые герои.',W/2,158);u.fillStyle='#9a92b0';u.fillText('Спасибо, что играли!   ·   '+(touch.on?'Коснись, чтобы сыграть заново':'R или клик — сыграть заново'),W/2,168);u.textAlign='left';return}
  if(window.C2&&C2.done){
    panel(0,0,W,H,1);u.textAlign='center';uiFont(16,true);u.fillStyle='#ff2a7a';u.fillText('ГЛАВА 2 ПРОЙДЕНА',W/2+1.5,52+1.5);u.fillStyle='#ffd23a';u.fillText('ГЛАВА 2 ПРОЙДЕНА',W/2,52);
    uiFont(7,true);u.fillStyle='#ff7ab8';u.fillText('Малявочные делишки',W/2,66);
    uiFont(5.5,false);u.fillStyle='#fff';u.fillText('Убито зомби: '+PS.kills+'   ·   Косметика: '+(C2.cosm||0)+'/5   ·   Tom Ford: '+(C2.tf?'есть':'нет'),W/2,84);
    const k=.75+.25*Math.sin(tm*3);u.fillStyle=`rgba(212,255,58,${k})`;u.fillRect(W/2-100,98,200,16);u.fillStyle='#120a1c';uiFont(6.2,true);u.fillText('▶ ГЛАВА 3: КРЫСИНЫЕ БЕГА',W/2,108.5);
    uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText(touch.on?'Коснись, чтобы продолжить':'E или клик — продолжить   ·   R — начать игру заново',W/2,128);u.textAlign='left';return}
  _re();
};

// ================= МЕНЮ ГЛАВЫ 3 =================
const MENU3=[['Глава 3 с начала (суперкорм)','feed'],['Двор: Ханжа и дворник','yard3'],['Подвал дома','cellar'],['Катакомбы','tunnels'],['Логово: крысиный король','lair'],['Выход наверх, солнечный двор','sunny'],['Дома: финал игры','home3']];
const CH3_BTN={x:W-74,y:H-52,w:70,h:12};
function kit3(n){
  Object.assign(PS,{hp:250,max:250,lives:3,inv:0,wpn:'claws',ammo:0,shells:0,syr:5,moon:0,hasShotgun:false,mode:'spread',regen:0,rideGain:0,carry:false,food:true});
  C1.done=true;if(window.C2)C2.done=true;C3.started=true;C3.done=false;C3.buff=!['sunny','home3'].includes(n);C3.kills0=PS.kills;
}
function menuStart3(n){
  C3.menu=null;C1.menu=null;if(window.C2)C2.menu=null;state='play';sfx('click');kit3(n);
  S.bat=S.pistol=true;S.skladLocked=false;S.alarm=true;S.key=true;mapDirty=true;S.fade=0;
  if(n==='feed'){startCh3();return}
  if(n==='home3'){homeCh3();return}
  if(n==='sunny'){playC3(CUT_OUT,()=>{C3.buff=false;sec3('sunny')},'out');return}
  sec3(n);
}
C3.menuStart=menuStart3;C3.MENU=MENU3;
function continueCh3(){C3.menu=null;state='play';S.fade=0;sfx('click');C1.done=true;startCh3()}
const _rt=renderTitle;
renderTitle=function(){
  _rt();if(C1.menu||(window.C2&&C2.menu))return;
  const b=CH3_BTN;u.fillStyle='rgba(212,255,58,'+(.75+.25*Math.sin(tm*3+2))+')';u.fillRect(b.x,b.y,b.w,b.h);u.fillStyle='#120a1c';uiFont(5.4,true);u.textAlign='center';u.fillText('ГЛАВА 3 ▸'+(touch.on?'':'  (3)'),b.x+b.w/2,b.y+8.2);u.textAlign='left';
  if(C3.menu){panel(0,0,W,H,.92);u.textAlign='center';uiFont(10,true);u.fillStyle='#d4ff3a';u.fillText('ГЛАВА 3 · КРЫСИНЫЕ БЕГА',W/2,22);uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText('Выбери, откуда начать (для проверки участков)',W/2,30);u.textAlign='left';
    MENU3.forEach((m,i)=>{const y=38+i*14,sel=C3.menu.sel===i;u.fillStyle=sel?'rgba(212,255,58,.9)':'rgba(255,255,255,.08)';u.fillRect(W/2-90,y,180,11);u.fillStyle=sel?'#120a1c':'#fff';uiFont(5.4,true);u.fillText((i+1)+'. '+m[0],W/2-85,y+7.8)});
    uiFont(4.4,false);u.fillStyle='#9a92b0';u.textAlign='center';u.fillText(touch.on?'Коснись участка. Коснись вне списка — назад':'W/S и E, или клик. Esc — назад',W/2,H-4);u.textAlign='left'}
};
function menuPick3(x,y){const i=Math.floor((y-38)/14);if(x>W/2-90&&x<W/2+90&&i>=0&&i<MENU3.length&&y-38-i*14<=11){menuStart3(MENU3[i][1]);return true}C3.menu=null;return true}
const toXY=e=>({x:(e.clientX-OX)/SC,y:(e.clientY-OY)/SC});
const inBtn=(p,b,pad)=>p.x>=b.x-pad&&p.x<=b.x+b.w+pad&&p.y>=b.y-pad&&p.y<=b.y+b.h+pad;
const otherMenu=()=>C1.menu||(window.C2&&C2.menu);
addEventListener('keydown',e=>{
  if(state==='title'&&!otherMenu()){
    if(C3.menu){const m=C3.menu;if(e.code==='KeyW'||e.code==='ArrowUp')m.sel=(m.sel+MENU3.length-1)%MENU3.length;else if(e.code==='KeyS'||e.code==='ArrowDown')m.sel=(m.sel+1)%MENU3.length;
      else if(['KeyE','Space','Enter'].includes(e.code)){if(!e.repeat&&m.sel>=0)menuStart3(MENU3[m.sel][1])}else if(e.code==='Escape')C3.menu=null;
      else if(/^Digit[1-7]$/.test(e.code)){const i=+e.code[5]-1;if(MENU3[i])menuStart3(MENU3[i][1])}
      e.preventDefault();e.stopImmediatePropagation();return}
    if(e.code==='Digit3'){C3.menu={sel:0};sfx('click');e.preventDefault();e.stopImmediatePropagation();return}
  }
  if(state==='end'&&window.C2&&C2.done&&!C3.done&&['KeyE','Space','Enter'].includes(e.code)&&!e.repeat){continueCh3();e.preventDefault();e.stopImmediatePropagation();return}
},true);
addEventListener('mousedown',e=>{
  const p=toXY(e);
  if(state==='title'&&!otherMenu()){
    if(C3.menu){menuPick3(p.x,p.y);e.stopImmediatePropagation();return}
    if(inBtn(p,CH3_BTN,0)){C3.menu={sel:0};sfx('click');e.stopImmediatePropagation();return}
  }
  if(state==='end'&&window.C2&&C2.done&&!C3.done){continueCh3();e.stopImmediatePropagation();return}
},true);
addEventListener('touchstart',e=>{
  for(const t of e.changedTouches){const p=toXY(t);
    if(state==='title'&&!otherMenu()){
      if(C3.menu){menuPick3(p.x,p.y);e.preventDefault();e.stopImmediatePropagation();return}
      if(inBtn(p,CH3_BTN,3)){touch.on=true;mouse.on=false;C3.menu={sel:-1};e.preventDefault();e.stopImmediatePropagation();return}}
    if(state==='end'&&window.C2&&C2.done&&!C3.done){touch.on=true;continueCh3();e.preventDefault();e.stopImmediatePropagation();return}
  }
},{capture:true,passive:false});
// быстрый старт по ссылке: #ch3, #yard3, #cellar, #tunnels, #lair, #sunny, #home3
const hs=location.hash.slice(1);if(hs){const m={ch3:'feed'}[hs]||hs;if(MENU3.some(x=>x[1]===m))setTimeout(()=>{menuOn=true;menuStart3(m)},70)}
C3.CUTS={CUT_TRANSFORM,CUT_NEWS3,CUT_DOWN,CUT_OUT,CUT_RESTORE};
C3.get=()=>({L:E.L,Q,PS,scene,state,cut,dlg});
if(window.HDS){catSide=HDS.wrap(catSide,[34,44],3.4);buffSide=HDS.wrap(buffSide,[34,62],1.8);sideJan=HDS.wrap(sideJan)}
})();
