// =====================================================================
//  kit56.js — общий набор для глав 5 и 6: участки, напарники, снаряды
//  и предупреждения боссов, езда на машине, герои сбоку для кат-сцен,
//  меню главы на титуле. Подключается после hq.js. Наружу: window.K56.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.X||!C1.engine||!window.HQ){console.warn('kit56: нет движка');return}
const X=C1.X,E=C1.engine,PS=C1.PS,TAU=Math.PI*2,T=HQ.top;
const D2=(a,b,c,d)=>Math.hypot(c-a,d-b);
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
const K={on:null,L:null,Q:{},zone:null,zoneT:0,zoneCol:'#ffd23a',hud:null,tick:null,fx:null};window.K56=K;
const Q=K.Q,sfx=X.sfx;
K.D2=D2;K.angDiff=angDiff;
const hold=()=>!!dlg||!!cut||!!C1.over||!!(window.MG&&MG.active);K.hold=hold;

// ================= МУЗЫКА =================
K.addMusic=list=>{for(const [k,f] of list){if(!MUS[k]){const a=new Audio('music/'+f);a.loop=true;a.preload='auto';a.volume=0;MUS[k]=a}}};
K.music=n=>{if(n&&MUS[n]&&musCur!==n)music(n)};

// ================= КАРТА =================
const B=(x,y,w,h,c)=>X.B(x,y,w,h,c);K.B=B;
function floorK(x0,y0,x1,y1,kind,v){
  if(v!==undefined)E.gfill(x0,y0,x1,y1,v);else E.gfill(x0,y0,x1,y1,0);
  for(let y=y0;y<y1;y+=4)for(let x=x0;x<x1;x+=4){const h=hash(x>>2,y>>2),w=Math.min(4,x1-x),hh=Math.min(4,y1-y);let c;
    switch(kind){
      case'sand':c=h<.12?'#d8c08a':h>.9?'#c8ac74':'#e2cc96';if(h>.985)c='#f4ecd8';break;
      case'wet':c=h<.2?'#b8a070':'#c4ac7c';break;
      case'sea':{const k=(Math.sin(x*.06+y*.11)+1)*.5;c=k>.85?'#5ab8d8':h<.2?'#2a78a8':'#3488b8';break}
      case'deep':c=h<.2?'#1a5888':'#22689a';break;
      case'cobble':c=((x>>2)+(y>>3))%2?'#a89a86':'#b8aa94';if(h<.1)c='#8a7e6c';break;
      case'stone':c=(x%16===0||y%16===0)?'#9a8e7a':(h<.12?'#c2b49c':'#ccbea6');break;
      case'marble':c=(x%12===0||y%12===0)?'#c8c4bc':(h<.1?'#e4e0d8':'#ecebe4');break;
      case'grass':c=h<.15?'#4a8a3a':h>.9?'#3a7a2a':'#5a9a44';if(h>.985)c='#e8d040';break;
      case'pool':{const k=(Math.sin(x*.12+y*.08+(x*y%7))+1)*.5;c=k>.8?'#7ae0f0':'#3ab0d8';break}
      case'dirt':c=h<.15?'#6a5238':h>.9?'#5a4228':'#7a6044';break;
      case'forest':c=h<.1?'#3a4a22':h>.9?'#2a3a18':h>.6?'#44562a':'#4a5c2e';if(h>.985)c='#8a6a3a';break;
      case'wood':{c=(y%8===0)?'#6a4a2a':(h<.15?'#9a7248':'#8a6640');break}
      case'asph':c=h<.1?'#5a5a60':h>.93?'#44444a':'#4e4e54';break;
      case'walk':c=(x%16===0||y%16===0)?'#8a8a8e':(h<.12?'#a6a6aa':'#9c9ca0');break;
      case'tile':c=(x%12===0||y%12===0)?'#7a7a82':(h<.1?'#a8a8ae':'#b4b4ba');break;
      case'terra':c=(x%8===0||y%8===0)?'#a8583a':(h<.15?'#c86a44':'#d0744c');break;
      case'sewer':c=h<.15?'#2a3028':h>.9?'#1a201a':'#242a22';break;
      case'slime':{const k=(Math.sin(x*.1+y*.05)+1)*.5;c=k>.8?'#4a6a2a':'#3a5a22';break}
      case'hay':c=h<.2?'#c8a040':h>.85?'#a88030':'#d8b050';break;
      case'parq':{const row=y>>2;c=((x+(row%3)*8)%16===0)?'#4e3420':(h<.15?'#8a5e3a':h>.9?'#6a4628':'#7a5234');break}
      default:c='#555';
    }
    B(x,y,w,hh,c)}
}
K.floor=floorK;
function txt(x,y,t,c,sz){const g=E.L.bx;g.fillStyle=c;g.font='bold '+(sz||6)+'px monospace';g.textAlign='center';g.fillText(t,x,y);g.textAlign='left'}K.txt=txt;
function solid(x,y,r){const g=E.gAt;return g(x-r,y-r)||g(x+r,y-r)||g(x-r,y+r)||g(x+r,y+r)||g(x,y)}K.solid=solid;
function mv(e,dx,dy,r){e.tryMv=1;if(dx){const nx=e.x+dx;if(!solid(nx,e.y,r))e.x=nx}if(dy){const ny=e.y+dy;if(!solid(e.x,ny,r))e.y=ny}}K.mv=mv;
const DIR8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],NS=8;
function navDir(e){const L=E.L;
  if(!L.nd)return null;const nw=L.nw,cx=Math.floor(e.x/NS),cy=Math.floor(e.y/NS);let best=null,bd=1e9;
  for(const [dx,dy] of DIR8){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=nw||ny>=L.nh)continue;const i=ny*nw+nx;if(L.nb[i]||L.nd[i]<0)continue;
    if(dx&&dy&&(L.nb[cy*nw+nx]||L.nb[ny*nw+cx]))continue;const d=L.nd[i]+(dx&&dy?.45:0);if(d<bd){bd=d;best=[nx,ny]}}
  if(!best)return null;return Math.atan2((best[1]+.5)*NS-e.y,(best[0]+.5)*NS-e.x);
}K.navDir=navDir;
// дерево сверху (кроны рисуются поверх героев)
K.tree=(x,y,r,c)=>{E.gfill(x-3,y-3,x+3,y+3,2);B(x-2,y-2,4,4,'#5a3a22');(Q.crowns||(Q.crowns=[])).push([x,y,r,c||'#2e6a34'])};
K.cypress=(x,y)=>{E.gfill(x-2,y-2,x+2,y+2,2);(Q.crowns||(Q.crowns=[])).push([x,y,5,'#244a2a',1])};
function drawCrowns(){if(!Q.crowns)return;for(const [x,y,r,c,cy] of Q.crowns){const d=D2(x,y,pl.x,pl.y),a=d<r+6?.45:1;ctx.globalAlpha=a;
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x+3,y+3,cy?r*.8:r,cy?r*1.6:r,0,0,TAU);ctx.fill();
  ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,cy?r*.8:r,cy?r*1.6:r,0,0,TAU);ctx.fill();ctx.fillStyle=shade(c,1.3);ctx.beginPath();ctx.ellipse(x-r*.3,y-r*.3,r*.45,cy?r*.8:r*.45,0,0,TAU);ctx.fill();ctx.globalAlpha=1}}
K.drawCrowns=drawCrowns;

// ================= УЧАСТОК: общий запуск =================
K.zoneBanner=(t,c)=>{K.zone=t;K.zoneT=2.6;K.zoneCol=c||'#ffd23a'};
function trigs(){for(const t of Q.trig){if(t.done)continue;if(D2(pl.x,pl.y,t.x,t.y)<t.r){t.done=true;t.fn()}}}K.trigs=trigs;
K.rooms=list=>{const r=list.find(q=>pl.x>q[1]&&pl.x<q[3]&&pl.y>q[2]&&pl.y<q[4]);if(r&&r[0]!==Q.room){Q.room=r[0];K.zoneBanner(r[0],K.zoneCol)}};
// старт участка: ch — объект главы (C5/C6), n — имя, build — постройка уровня
K.sec=function(ch,n,build,retry){
  C1.on=true;ch.on=true;for(const o of [window.C2,window.C3,window.C4])if(o&&o!==ch){o.on=false;if('zone' in o)o.zone=null}
  for(const o of [window.C5,window.C6,window.C7,window.C8,window.C9,window.C10])if(o&&o!==ch)o.on=false;
  C1.over=null;C1.hurt=0;C1.shake=0;PS.carry=false;PS.inv=1;C1.mdown=false;lockMove=false;dlg=null;
  const s0=X.snap(),c0=Object.assign({},ch.flags||{});ch.sec=n;
  C1.retry=()=>{X.restore(s0);Object.assign(ch.flags||{},c0);PS.lives=3;PS.hp=PS.max;retry(n)};
  for(const k in Q)delete Q[k];Object.assign(Q,{trig:[],allies:[],eb:[],tele:[],slashes:[],ghosts:[],waves:null,crowns:[],room:null});
  C1.mode='td';scene='k56td';K.on=ch;K.hud=null;K.tick=null;K.fx=null;C1.noWpn=false;
  build();
  const L=E.L;K.L=L;
  const lu=L.drawUnder,lo=L.drawOver;L.drawUnder=()=>{if(lu)lu();drawPick()};L.drawOver=()=>{if(lo)lo();drawFx();drawCrowns();if(K.fx)K.fx()};
  const oi=L.onItem;L.onItem=it=>{pickItem(it);if(oi)oi(it)};
  C1.cx=clamp(pl.x-W/2,0,Math.max(0,L.w-W));C1.cy=clamp(pl.y-H/2,0,Math.max(0,L.h-H));if(L.w<=W)C1.cx=(L.w-W)/2;if(L.h<=H)C1.cy=(L.h-H)/2;
  camX=Math.round(C1.cx);camY=Math.round(C1.cy);
};
K.cut=function(ch,shots,onEnd,mus){C1.on=true;ch.on=true;C1.mode='cut';C1.noWpn=true;if(mus)K.music(mus);for(const s of shots)s._f={};playCut(shots,()=>X.go(onEnd))};

// ---- свои подбираемые предметы ----
const PICK={gel:['+джелато','#ffb0d8'],pz:['+пицца','#ffcf6a'],beer:['+пиво','#ffd23a'],pir:['+пирожок','#e8a060']};
function pickItem(it){const p=PICK[it.kind];if(!p)return;
  if(it.kind==='gel'||it.kind==='pir'){PS.syr++;X.floatT(it.x,it.y,p[0],p[1])}
  else if(it.kind==='beer'){PS.syr++;X.floatT(it.x,it.y,p[0],p[1])}
  else if(it.kind==='pz'){PS.hp=Math.min(PS.max,PS.hp+30);X.floatT(it.x,it.y,'+30 HP · пицца','#ffcf6a');if(K.onPizza)K.onPizza()}
  sfx('pick')}
function drawPick(){const L=E.L;for(const it of L.items){if(it.taken||!PICK[it.kind])continue;const x=it.x,y=it.y+Math.sin(tm*3+it.x);
  if(it.kind==='gel'){F(x-2,y,4,4,'#d8a060');F(x-1,y+4,2,2,'#c88a4a');ctx.fillStyle=['#ffb0d8','#9ae8a0','#fff0c0'][(it.x>>3)%3];ctx.beginPath();ctx.arc(x,y-1,3,0,TAU);ctx.fill();F(x-1,y-3,1,1,'#fff')}
  else if(it.kind==='pz'){ctx.fillStyle='#e8b050';ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();ctx.fillStyle='#d8402a';ctx.beginPath();ctx.arc(x,y,3,0,TAU);ctx.fill();F(x-1,y-2,1,1,'#fff4c0');F(x+1,y,1,1,'#fff4c0');F(x-2,y+1,1,1,'#3a8a3a')}
  else if(it.kind==='beer'){F(x-2,y-4,4,7,'#8a5a1a');F(x-2,y-2,4,3,'#e8c040');F(x-1,y-6,2,2,'#5a3a10');F(x-1,y-7,2,1,'#d8d8d8')}
  else if(it.kind==='pir'){ctx.fillStyle='#d8903a';ctx.beginPath();ctx.ellipse(x,y,4,2.6,0,0,TAU);ctx.fill();F(x-2,y-1,4,1,'#f0b860')}
  const a=.25+.25*Math.sin(tm*5+it.x);ctx.strokeStyle=`rgba(255,240,180,${a})`;ctx.strokeRect(it.x-5.5,y-6.5,11,13)}}

// ================= НАПАРНИКИ =================
// val — Валера с трубой; vd/st — Владос/Столыпин с бензопилами; ol — Олеся (без оружия)
const AL={val:{r:14,dmg:42,cd:.55,sp:66,see:120},vd:{r:56,dmg:46,cd:.6,sp:70,see:130},st:{r:30,dmg:44,cd:1.5,sp:62,see:120},ol:{sp:70}};
const allyCv={};for(const k of ['val','vd','st','ol'])allyCv[k]=mk(24),allyCv[k].getContext('2d',{willReadFrequently:true});
const allyLeg=mk(24);allyLeg.getContext('2d',{willReadFrequently:true});
K.addAlly=function(kind,x,y,o){const A=Object.assign({kind,x,y,a:-Math.PI/2,ma:0,ph:0,mv:false,cd:rnd(.6,1.2),sw:0,sup:6,quip:rnd(5,10),kills:0,stay:null},o||{});Q.allies.push(A);E.L.npcs.push({draw(){drawAlly(A)}});return A};
K.quips={val:['Валера: «Раш Б, не стоим!»','Валера: «Изи катка»','Валера: «Хедшот трубой — засчитано»','Валера: «Плюс один, плюс один!»','Валера: «Я на рампе, прикрой»'],
  vd:['Владос: «Костюм от Бриони, между прочим!»','Владос: «Сто тысяч вольт — и никакой грязи»','Владос: «Столыпин, отстаёшь!»','Владос: «Лучший подарок на день рождения»'],
  st:['Столыпин: «Эх, раз!»','Столыпин: «Ща, только глотну...»','Столыпин: «Светлое нефильтрованное — убойная вещь»','Столыпин: «Извините. Это всё пиво»']};
function allyHit(A,z,dmg,kb){C1._src='ally';const a=Math.atan2(z.y-A.y,z.x-A.x),was=z.dead;X.hurtZ(z,z.type==='boss'?dmg*.35:dmg,a,z.type==='boss'?0:kb);C1._src=null;if(!was&&z.dead){A.kills++;if(K.onAllyKill)K.onAllyKill(A,z)}}
function allyTick(A,dt){
  const S0=AL[A.kind];A.cd-=dt;if(A.sw>0)A.sw-=dt;A.quip-=dt;A.sup-=dt;
  if(hold()){A.mv=false;return}
  const L=E.L,d=D2(A.x,A.y,pl.x,pl.y);
  if(A.stay){const s=A.stay;if(D2(A.x,A.y,s.x,s.y)>3){const a=Math.atan2(s.y-A.y,s.x-A.x);mv(A,Math.cos(a)*60*dt,Math.sin(a)*60*dt,3.5);A.ma=a;A.mv=true;A.ph+=dt*12}else A.mv=false;if(s.a!=null)A.a=s.a;return}
  if(d>230){for(let k=0;k<14;k++){const a=pl.a+Math.PI+rnd(-1.2,1.2),r=rnd(14,26),x=pl.x+Math.cos(a)*r,y=pl.y+Math.sin(a)*r;if(!solid(x,y,4)){A.x=x;A.y=y;break}}}
  let tg=null,bd=S0.see||0;
  if(L.armed&&S0.dmg)for(const z of L.zs){if(z.dead||z.st==='hidden'||z.st==='rise')continue;if(z.st==='idle'&&D2(z.x,z.y,pl.x,pl.y)>110)continue;const dz=D2(A.x,A.y,z.x,z.z===undefined?z.y:z.y);if(dz<bd&&E.los(A.x,A.y,z.x,z.y)){bd=dz;tg=z}}
  A.mv=false;let dir=null,sp=0;
  if(tg&&D2(tg.x,tg.y,pl.x,pl.y)<170){if(bd>tg.r+S0.r-4){dir=Math.atan2(tg.y-A.y,tg.x-A.x);if(!E.los(A.x,A.y,tg.x,tg.y))dir=navDir(A);sp=S0.sp*1.15}}
  else{const i=Q.allies.indexOf(A),side=i%2?1:-1,pa=pl.a+Math.PI/2;
    const bx=pl.x-Math.cos(pl.a)*15+Math.cos(pa)*side*12,by=pl.y-Math.sin(pl.a)*15+Math.sin(pa)*side*12;
    if(d>22&&D2(A.x,A.y,bx,by)>6){dir=(E.los(A.x,A.y,bx,by)&&!solid(bx,by,3.5))?Math.atan2(by-A.y,bx-A.x):navDir(A);sp=d>70?84:S0.sp}}
  if(dir!=null){mv(A,Math.cos(dir)*sp*dt,Math.sin(dir)*sp*dt,3.5);A.ma=dir;A.mv=true;A.ph+=dt*13}
  const fa=tg?Math.atan2(tg.y-A.y,tg.x-A.x):(A.mv?A.ma:A.a);A.a+=angDiff(fa,A.a)*Math.min(1,dt*9);
  if(tg&&S0.dmg){
    // суперудар Валеры «ПРОЧИСТКА»: раз в 10 с, если рядом трое и больше
    if(A.kind==='val'&&A.sup<=0){const near=L.zs.filter(z=>!z.dead&&z.st!=='hidden'&&D2(z.x,z.y,A.x,A.y)<34);
      if(near.length>=3||(near.length&&A.sup<-6)){A.sup=10;A.spin=.5;sfx('swing',.7);sfx('bat',.9);C1.shake=Math.max(C1.shake,.3);X.floatT(A.x,A.y-14,'ПРОЧИСТКА!','#6ad8ff');
        for(const z of near)allyHit(A,z,(K.valBuff?1.5:1)*80,180);for(let i=0;i<14;i++)L.fx.push({x:A.x,y:A.y,vx:Math.cos(i/14*TAU)*90,vy:Math.sin(i/14*TAU)*90,life:.3,c:'#bfe8ff'});return}}
    if(A.cd<=0&&bd<tg.r+S0.r&&Math.abs(angDiff(fa,A.a))<.5){A.cd=S0.cd*rnd(.9,1.1);A.sw=.16;
      if(A.kind==='val'){sfx('swing',1.1);sfx('clang',.5);allyHit(A,tg,(K.valBuff?1.5:1)*S0.dmg,120);Q.slashes.push({x:A.x,y:A.y,a:A.a,t:.14,c:'#e8f4ff'})}
      else if(A.kind==='vd'){sfx('zap',1);const n=8;for(let i=0;i<=n;i++){const k=i/n;E.L.fx.push({x:A.x+(tg.x-A.x)*k+rnd(-3,3),y:A.y+(tg.y-A.y)*k+rnd(-3,3),vx:0,vy:0,life:.18,c:i%2?'#8ad8ff':'#ffffff'})}
        allyHit(A,tg,S0.dmg*(K.sawBuff?1.4:1),40);if(!tg.dead){tg.stun=Math.max(tg.stun||0,.8)}if(Math.random()<.5&&A.quip>4)X.floatT(tg.x,tg.y-10,'БЗЗТ!','#8ad8ff')}
      else if(A.kind==='st'){sfx('burp',1);X.floatT(A.x,A.y-14,'БУ-У-ЭЭЭ!','#a8e040');for(let i=0;i<16;i++){const aa=A.a+rnd(-.6,.6),sp=rnd(30,70);E.L.fx.push({x:A.x+Math.cos(A.a)*6,y:A.y+Math.sin(A.a)*6,vx:Math.cos(aa)*sp,vy:Math.sin(aa)*sp,life:rnd(.4,.8),c:i%2?'rgba(168,224,64,.7)':'rgba(220,200,80,.6)'})}
        for(const z of E.L.zs.slice()){if(z.dead||z.st==='hidden')continue;const dz=D2(A.x,A.y,z.x,z.y);if(dz>z.r+34)continue;if(Math.abs(angDiff(Math.atan2(z.y-A.y,z.x-A.x),A.a))>.7)continue;allyHit(A,z,S0.dmg*(K.sawBuff?1.4:1),130);if(!z.dead)z.stun=Math.max(z.stun||0,.6)}}
      else{sfx('rifle',.25);allyHit(A,tg,S0.dmg*(K.sawBuff?1.4:1),90);X.blood(tg.x,tg.y,A.a,4,false)}
      if(A.quip<=0&&K.quips[A.kind]){A.quip=rnd(14,24);note(K.quips[A.kind][(Math.random()*K.quips[A.kind].length)|0])}}
  }
  const dx=A.x-pl.x,dy=A.y-pl.y,dd=Math.hypot(dx,dy);if(dd<10&&dd>.01)mv(A,dx/dd*(10-dd),dy/dd*(10-dd),3.5);
  for(const O of Q.allies){if(O===A)continue;const ex=A.x-O.x,ey=A.y-O.y,ed=Math.hypot(ex,ey);if(ed<9&&ed>.01)mv(A,ex/ed*(9-ed)/2,ey/ed*(9-ed)/2,3.5)}
}
const LEGC={val:['#2a2a30','#e8e8ec'],vd:['#1e2638','#0a0a0e'],st:['#2a3a5a','#2a2a2a'],ol:['#f4cdb0','#e8e0d0']};
function drawAlly(A){
  if(A.hidden)return;shadowBlob(A.x,A.y,A.kind==='st'?7:6);
  legs(allyLeg.getContext('2d'),A.ph,A.mv,LEGC[A.kind][0],LEGC[A.kind][1]);spr(allyLeg,A.x,A.y,A.mv?A.ma:A.a);
  const g=allyCv[A.kind].getContext('2d');
  if(A.kind==='val'){T.topValera(g,true,A.sw);if(A.spin>0){A.spin-=1/60;ctx.save();ctx.translate(A.x,A.y);ctx.rotate(tm*30);ctx.drawImage(allyCv.val,-12,-12,24,24);ctx.restore();return}}
  else if(A.kind==='vd'){T.topVlados(g,0);P(g,16,15,5,2,'#2a2a30');P(g,20,15,1,2,A.sw>0||Math.sin(tm*20)>.7?'#8ad8ff':'#3a5a7a')}else if(A.kind==='st')T.topStolypin(g,0,true);else T.topOlesya(g);
  spr(allyCv[A.kind],A.x,A.y,A.a);
  if(false&&Math.random()<.2)E.L.fx.push({x:A.x-Math.cos(A.a)*6,y:A.y-Math.sin(A.a)*6,vx:rnd(-6,6),vy:rnd(-14,-6),life:.5,c:'#8a8a8a'});
}
K.drawAlly=drawAlly;

// ================= СНАРЯДЫ ВРАГОВ, ПРЕДУПРЕЖДЕНИЯ, ВОЛНЫ =================
// Q.eb: {x,y,vx,vy,life,dmg,k} · Q.tele: {x,y,r,w,dmg,k,fn} — круг-предупреждение, через w секунд удар
K.shoot=(x,y,a,sp,dmg,k,o)=>Q.eb.push(Object.assign({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:2,dmg,k:k||'rock'},o||{}));
K.tele=(x,y,r,w,dmg,k,fn)=>Q.tele.push({x,y,r,w,w0:w,dmg,k:k||'root',fn,boom:0});
function ebTick(dt){
  if(hold())return;const L=E.L;
  for(const b of Q.eb){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(b.spin)b.rot=(b.rot||0)+dt*b.spin;const v=E.gAt(b.x,b.y);
    if(v===1||v===3){b.life=0;L.fx.push({x:b.x,y:b.y,vx:0,vy:0,life:.3,c:'#c8b890'})}
    else if(D2(b.x,b.y,pl.x,pl.y)<6){b.life=0;C1._eb=b.k==='fire'?2:1;X.hurtPlayer(b.dmg,b.k==='fire'?'fire':(b.k==='acid'?'acid':null));C1._eb=0;if(b.onHit)b.onHit()}}
  Q.eb=Q.eb.filter(b=>b.life>0);
  for(const t of Q.tele){if(t.w>0){t.w-=dt;if(t.w<=0){t.boom=.35;C1.shake=Math.max(C1.shake,.25);sfx('thump',.8);
      if(D2(t.x,t.y,pl.x,pl.y)<t.r+3&&t.dmg)X.hurtPlayer(t.dmg,t.k==='fire'?'fire':null);if(t.fn)t.fn(t);
      for(let i=0;i<8;i++)L.fx.push({x:t.x+rnd(-t.r,t.r)*.6,y:t.y+rnd(-t.r,t.r)*.6,vx:rnd(-30,30),vy:rnd(-40,-10),life:.5,c:t.k==='water'?'#bfe8ff':t.k==='fire'?'#ffa030':'#6a4a2a'})}}
    else t.boom-=dt}
  Q.tele=Q.tele.filter(t=>t.w>0||t.boom>0);
  for(const s of Q.slashes)s.t-=dt;Q.slashes=Q.slashes.filter(s=>s.t>0);
  for(const g of Q.ghosts){g.t-=dt;if(Math.random()<dt*14)L.fx.push({x:g.x+rnd(-5,5),y:g.y+rnd(-5,5),vx:rnd(-4,4),vy:rnd(-26,-12),life:rnd(.4,.8),c:g.c||'#d8ffd0'})}
  Q.ghosts=Q.ghosts.filter(g=>g.t>0);
  // волны врагов: Q.waves={list:[{t, fn}], t}
  if(Q.waves&&Q.waves.list.length){Q.waves.t+=dt;while(Q.waves.list.length&&Q.waves.t>=Q.waves.list[0].t){Q.waves.list.shift().fn()}}
}
function drawFx(){
  for(const t of Q.tele){
    if(t.w>0){const k=1-t.w/t.w0,col=t.k==='water'?'90,200,255':t.k==='fire'?'255,140,40':t.k==='saw'?'255,60,60':'150,110,40';
      ctx.fillStyle=`rgba(${col},${.1+.18*k})`;ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,TAU);ctx.fill();
      ctx.strokeStyle=`rgba(${col},${.5+.5*Math.sin(tm*30)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(t.x,t.y,t.r*k,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,TAU);ctx.stroke()}
    else{const k=t.boom/.35;if(t.k==='root'){for(let i=0;i<6;i++){const a=i/6*TAU+t.x;ctx.strokeStyle=`rgba(90,60,30,${k})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(t.x,t.y);ctx.lineTo(t.x+Math.cos(a)*t.r,t.y+Math.sin(a)*t.r-6*k);ctx.stroke()}}
      else{ctx.strokeStyle=t.k==='water'?`rgba(190,232,255,${k})`:`rgba(255,200,120,${k})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(t.x,t.y,t.r*(1.2-k*.2),0,TAU);ctx.stroke()}}}
  for(const b of Q.eb){const k=b.k;
    if(k==='leaf'){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.rot||0);F(-3,-1,6,2,'#3a8a2a');F(-1,-2,2,4,'#5aaa3a');ctx.restore()}
    else if(k==='cone'){F(b.x-2,b.y-3,4,6,'#7a5230');F(b.x-1,b.y-2,2,1,'#a87a48');F(b.x-1,b.y+1,2,1,'#a87a48')}
    else if(k==='egg'){F(b.x-2,b.y-2,4,4,'#f0ece0');F(b.x-1,b.y-1,1,1,'#fff')}
    else if(k==='shear'){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.rot||0);F(-5,-1,10,2,'#c8ccd4');F(-1,-4,2,8,'#c8ccd4');ctx.restore()}
    else if(k==='water'){F(b.x-2,b.y-2,4,4,'#7ad0f0');F(b.x-1,b.y-1,2,2,'#e8f8ff')}
    else if(k==='tomato'){F(b.x-2,b.y-2,4,4,'#d8302a');F(b.x-1,b.y-2,2,1,'#3a8a3a')}
    else if(k==='feather'){F(b.x-2,b.y-1,4,2,'#2a2a30');F(b.x-1,b.y-2,1,4,'#4a4a52')}
    else{F(b.x-2,b.y-2,4,4,'#6a6a62');F(b.x-1,b.y-2,2,1,'#9a9a90')}}
  for(const s of Q.slashes){const k=s.t/.14;ctx.strokeStyle=s.c||`rgba(255,255,255,${k})`;ctx.globalAlpha=k;ctx.lineWidth=1;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(s.x,s.y,11+i*2,s.a-1,s.a+1-k*1.5);ctx.stroke()}ctx.globalAlpha=1}
  for(const g of Q.ghosts){const b=X.zBody(g.type,g.v),S=g.type==='boss'||g.type==='brute'?32:24;ctx.save();ctx.globalAlpha=clamp(g.t/1.4,0,1)*.9;ctx.translate(Math.round(g.x),Math.round(g.y-(1.4-g.t)*4));ctx.rotate(g.a);ctx.drawImage(b,-S/2,-S/2);ctx.restore()}
  // имена и полоски здоровья боссов
  for(const z of E.L.zs){if(z.dead||!z.nm)continue;ctx.font='bold 4px monospace';ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillText(z.nm,z.x+.5,z.y-16.5);ctx.fillStyle=z.nmc||'#ffd23a';ctx.fillText(z.nm,z.x,z.y-17);ctx.textAlign='left';
    F(z.x-12,z.y-15,24,2,'rgba(0,0,0,.6)');F(z.x-12,z.y-15,24*Math.max(0,z.hp)/z.max,2,'#c0202a');if(z.armor>0){F(z.x-12,z.y-12,24*z.armor/z.armorMax,1,'#c8a060')}}
}
K.ghostAll=(c)=>{for(const m of E.L.zs){if(m.dead)continue;Q.ghosts.push({x:m.x,y:m.y,a:m.a,type:m.type,v:m.v,t:1.2+Math.random()*1.2,c});m.dead=true}E.L.zs.length=0;Q.eb.length=0;Q.tele.length=0};
K.alive=()=>E.L.zs.filter(z=>!z.dead).length;

// ================= ЕЗДА НА МАШИНЕ (кабриолет Олеси, X6 Владоса) =================
// o: {id,w,h,build(L), draw(x,y,a,ta,flash), fin:(c)=>bool, onFin, title, sub, hudCol, gun:{cd,dmg,sp,snd}, startX,startY}
let CAR=null,CO=null;
function solidC(x,y,r){const g=E.gAt;return g(x-r,y-r)||g(x+r,y-r)||g(x-r,y+r)||g(x+r,y+r)||g(x,y)}
function carFree(x,y,a){const c=Math.cos(a),s=Math.sin(a);for(const k of [-12,0,12])if(solidC(x+c*k,y+s*k,7))return false;return true}
function zMove(z,dx,dy){if(dx){const nx=z.x+dx;if(!solidC(nx,z.y,z.r))z.x=nx}if(dy){const ny=z.y+dy;if(!solidC(z.x,ny,z.r))z.y=ny}}
K.car=function(ch,o){
  C1.on=true;ch.on=true;C1.over=null;C1.hurt=0;C1.shake=0;PS.inv=1;C1.mdown=false;lockMove=false;dlg=null;K.on=ch;
  const s0=X.snap();C1.retry=()=>{X.restore(s0);PS.lives=3;PS.hp=PS.max;K.car(ch,o)};
  for(const k in Q)delete Q[k];Object.assign(Q,{trig:[],allies:[],eb:[],tele:[],slashes:[],ghosts:[],crowns:[],fires:[]});
  const L=E.mkLevel(o.id,o.w,o.h);L.noCull=1;K.L=L;CO=o;o.build(L);
  CAR={x:o.startX,y:o.startY,a:o.startA!=null?o.startA:-Math.PI/2,v:0,ta:-Math.PI/2,cd:0,heat:0,oh:0,buls:[],flash:0,kills:PS.kills,start:o.startY,end:false,banner:4,clung:0,hp:100};
  C1.mode='carK';scene='k56car';C1.cx=CAR.x-W/2;C1.cy=CAR.y-H/2;
};
K.carState=()=>CAR;
function carUpdate(dt){
  const c=CAR,L=E.L,o=CO;L.t+=dt;
  if(c.banner>0)c.banner-=dt;if(c.flash>0)c.flash-=dt;if(C1.shake>0)C1.shake=Math.max(0,C1.shake-dt*2.5);
  const free=!dlg&&!tr&&!c.end&&!(window.MG&&MG.active);
  const [mx,my,ml]=free?X.inputMove():[0,0,0];
  if(ml>.15){const want=Math.atan2(my,mx),da=angDiff(want,c.a);
    if(Math.abs(da)>2.3){c.v+=clamp(-45-c.v,-140*dt,140*dt)}
    else{const turn=2.5*dt*Math.min(1,Math.abs(c.v)/45+.3);c.a+=clamp(da,-turn,turn);const tgt=(o.vmax||110)*ml*(1-Math.min(.55,Math.abs(da)/3));c.v+=clamp(tgt-c.v,-170*dt,90*dt)}}
  else c.v*=Math.exp(-1.6*dt);
  if(c.clung>0)c.v*=Math.exp(-Math.min(c.clung,5)*.35*dt);
  // поворот без проверки ставил машину боком в стену — выталкиваем на свободное место
  if(!carFree(c.x,c.y,c.a)){let ok=0;for(const r of [1.5,3,5,8,12,16]){for(let i=0;i<12&&!ok;i++){const q=i/12*Math.PI*2,x=c.x+Math.cos(q)*r,y=c.y+Math.sin(q)*r;if(carFree(x,y,c.a)){c.x=x;c.y=y;ok=1}}if(ok)break}if(!ok&&c._pa!=null&&carFree(c.x,c.y,c._pa))c.a=c._pa}c._pa=c.a;
  const nx=c.x+Math.cos(c.a)*c.v*dt,ny=c.y+Math.sin(c.a)*c.v*dt;
  if(carFree(nx,ny,c.a)){c.x=nx;c.y=ny}else if(carFree(nx,c.y,c.a)){c.x=nx;c.v*=.8}else if(carFree(c.x,ny,c.a)){c.y=ny;c.v*=.8}
  else{if(Math.abs(c.v)>40){C1.shake=Math.max(C1.shake,.35);sfx('thump',.5)}c.v*=-.3}
  let aim=null;
  if(mouse.on&&!touch.on)aim=Math.atan2(mouse.y+camY-c.y,mouse.x+camX-c.x);
  else if(touch.aim&&touch.aim.moved)aim=Math.atan2(touch.aim.y-touch.aim.oy,touch.aim.x-touch.aim.ox);
  if(aim===null){let best=null,bd=150;for(const z of L.zs){if(z.dead)continue;const d=D2(z.x,z.y,c.x,c.y);if(d<bd){bd=d;best=z}}aim=best?Math.atan2(best.y-c.y,best.x-c.x):c.a}
  c.ta+=angDiff(aim,c.ta)*Math.min(1,dt*14);
  const G=o.gun;if(c.cd>0)c.cd-=dt;if(c.oh>0){c.oh-=dt;if(c.oh<=0)c.heat=.3}else c.heat=Math.max(0,c.heat-dt*.35);
  const firing=free&&((C1.mdown&&mouse.on&&!touch.on)||X.touchFiring()||C1.fire!=null);
  if(firing&&!o.noGun&&c.cd<=0&&c.oh<=0){c.cd=G.cd;c.heat+=G.heat||.04;c.flash=.05;sfx(G.snd||'shot',.55);
    const n=G.n||1;for(let i=0;i<n;i++){const a=c.ta+rnd(-(G.spr||.05),G.spr||.05),bx=c.x+Math.cos(c.ta)*12,by=c.y+Math.sin(c.ta)*12;c.buls.push({x:bx,y:by,vx:Math.cos(a)*G.sp,vy:Math.sin(a)*G.sp,life:.6})}
    if(c.heat>=1){c.oh=1.6;sfx('power',.5);note(G.ohNote||'Перегрев! Дави, пока остывает')}}
  for(const b of c.buls){for(let s=0;s<4&&b.life>0;s++){b.x+=b.vx*dt/4;b.y+=b.vy*dt/4;if(E.gAt(b.x,b.y)===1){b.life=0;break}
      for(const z of L.zs){if(z.dead)continue;if(D2(b.x,b.y,z.x,z.y)<z.r+2.5){X.hurtZ(z,G.dmg,Math.atan2(b.vy,b.vx),30);sfx('hit',.6);b.life=0;break}}}b.life-=dt}
  c.buls=c.buls.filter(b=>b.life>0);
  if(o.tick)o.tick(c,dt);
  c.clung=0;const sp=Math.abs(c.v);
  for(const z of L.zs){if(z.dead)continue;const d=D2(z.x,z.y,c.x,c.y);if(d>420&&z.st!=='chase')continue;
    if(z.flash>0)z.flash-=dt;if(z.stun>0)z.stun-=dt;if(z.cd>0)z.cd-=dt;if(z.lunge>0)z.lunge-=dt;
    if(z.kbx||z.kby){zMove(z,z.kbx*dt,z.kby*dt);const k=Math.exp(-9*dt);z.kbx*=k;z.kby*=k;if(Math.abs(z.kbx)+Math.abs(z.kby)<2)z.kbx=z.kby=0}
    if(z.st==='idle'){if(d<230){z.st='chase';if(Math.random()<.3)sfx('groan')}else continue}
    const fx=c.x+Math.cos(c.a)*9,fy=c.y+Math.sin(c.a)*9,bx=c.x-Math.cos(c.a)*9,by=c.y-Math.sin(c.a)*9;
    const hitD=Math.min(D2(z.x,z.y,fx,fy),D2(z.x,z.y,bx,by));
    if(hitD<z.r+9){const ang=Math.atan2(z.y-c.y,z.x-c.x);
      if(sp>50&&z.type!=='brute'){X.hurtZ(z,999,c.a,0);c.v*=.88;C1.shake=Math.max(C1.shake,.2);X.blood(z.x,z.y,c.a,10,true);continue}
      if(z.type==='brute'&&sp>50){X.hurtZ(z,sp*.5,c.a,120);c.v=-c.v*.35;C1.shake=Math.max(C1.shake,.6);sfx('thump');continue}
      c.clung++;if(z.cd<=0){z.cd=.9;z.lunge=.2;C1.shake=Math.max(C1.shake,.15);sfx('hit',.4);if(o.dmgCar){c.hp-=o.dmgCar;if(c.hp<=0){c.hp=100;X.loseLife()}}}
      zMove(z,Math.cos(ang)*(z.r+9-hitD),Math.sin(ang)*(z.r+9-hitD))}
    if(z.stun>0)continue;
    const dir=Math.atan2(c.y-z.y,c.x-z.x),zs=z.sp*(z.type==='fast'?1.15:1.25);
    if(hitD>z.r+10){zMove(z,Math.cos(dir)*zs*dt,Math.sin(dir)*zs*dt);z.ph+=dt*zs*.32}
    z.a+=angDiff(dir,z.a)*Math.min(1,dt*6)}
  const zs=L.zs;for(let i=zs.length-1;i>=0;i--)if(zs[i].dead)zs.splice(i,1);
  for(const p of L.fx){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.dec&&p.life<=0){L.dx.fillStyle='rgba(110,8,14,.8)';L.dx.fillRect(Math.round(p.x),Math.round(p.y),1,1)}}
  L.fx=L.fx.filter(p=>p.life>0);
  const la=clamp(c.v,0,110)*.6,tx=clamp(c.x-W/2+Math.cos(c.a)*la,0,L.w-W),ty=clamp(c.y-H/2+Math.sin(c.a)*la,0,L.h-H);
  C1.cx+=(tx-C1.cx)*Math.min(1,dt*5);C1.cy+=(ty-C1.cy)*Math.min(1,dt*5);camX=Math.round(C1.cx);camY=Math.round(C1.cy);
  if(!c.end&&o.fin(c)){c.end=true;o.onFin(PS.kills-c.kills)}
}
function carRender(){
  const c=CAR,L=E.L,o=CO;ctx.imageSmoothingEnabled=false;ctx.fillStyle='#07050c';ctx.fillRect(0,0,W,H);
  const sx=C1.shake>0?rnd(-3,3)*C1.shake:0,sy=C1.shake>0?rnd(-3,3)*C1.shake:0;
  ctx.save();ctx.translate(Math.round(-camX+sx),Math.round(-camY+sy));
  if(!L._hd){L._hd=1;hdTexture(L.bg,true)}
  ctx.drawImage(L.bg,0,0);ctx.drawImage(L.dec,0,0);
  for(const z of L.zs){if(z.dead||z.y<camY-30||z.y>camY+H+30)continue;X.drawZ(z)}
  o.draw(c.x,c.y,c.a,c.ta,c.flash>0);
  for(const b of c.buls){ctx.strokeStyle='#ffe27a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(b.x-b.vx*.02,b.y-b.vy*.02);ctx.lineTo(b.x,b.y);ctx.stroke()}
  for(const p of L.fx)if(p.c!=='smoke')F(p.x,p.y,1,1,p.c);
  for(const [x,y] of Q.fires){if(y<camY-30||y>camY+H+30)continue;for(let i=0;i<6;i++){const h=3+Math.abs(Math.sin(tm*9+i+x))*8;F(x-6+i*2,y-h,2,h,i%2?'#ff6a1a':'#ffc040')}}
  drawCrowns();
  ctx.restore();
  if(L.dark>0){const ox=-camX+sx,oy=-camY+sy;sh.globalCompositeOperation='source-over';sh.clearRect(0,0,W,H);sh.fillStyle=`rgba(${L.tint||'0,0,0'},${L.dark})`;sh.fillRect(0,0,W,H);sh.globalCompositeOperation='destination-out';
    const px=c.x+ox,py=c.y+oy,ca=Math.cos(c.a),sa=Math.sin(c.a);radial(sh,px,py,40,'rgba(255,255,255,A)',.9);for(const k of [30,62,98])radial(sh,px+ca*k,py+sa*k,26+k*.35,'rgba(255,255,255,A)',.85);
    for(const l of L.lights)if(l[1]+oy>-60&&l[1]+oy<H+60)radial(sh,l[0]+ox,l[1]+oy,l[2],'rgba(255,255,255,A)',l[3]||.8);ctx.drawImage(shadow,0,0)}
  if(L.sunTint){ctx.fillStyle=L.sunTint;ctx.fillRect(0,0,W,H)}
}
function carUI(){
  const k=ui.width/W;u.setTransform(1,0,0,1,0,0);u.clearRect(0,0,ui.width,ui.height);u.setTransform(k,0,0,k,0,0);
  const c=CAR,o=CO;if(!c)return;const col=o.hudCol||'#ff4fa3';
  panel(4,4,116,30,.72);u.fillStyle=col;u.fillRect(4,4,2,30);
  uiFont(4.4,true);u.fillStyle='#9a92b0';u.fillText(o.gun.name||'СТВОЛ',9,10.5);X.hudBar(40,7,58,4,c.heat,c.oh>0?(Math.sin(tm*20)>0?'#ff3a3a':'#8a1a1a'):c.heat>.7?'#ff8a30':'#ffd23a');
  if(o.dmgCar){uiFont(4.4,true);u.fillStyle='#9a92b0';u.fillText('КУЗОВ',9,19);X.hudBar(40,16,58,4,c.hp/100,c.hp<30?'#ff3a3a':'#3ef0b0')}else{uiFont(4.4,true);u.fillStyle='#3ef0b0';u.fillText(o.armorTxt||'В МАШИНЕ НЕ ДОСТАНУТ',9,19)}
  uiFont(4.4,false);u.fillStyle='#fff';u.fillText('Сбито и убито: '+(PS.kills-c.kills),9,28);
  const prog=clamp(o.prog?o.prog(c):0,0,1);
  panel(W-112,4,108,20,.72);uiFont(4.2,true);u.fillStyle='#9a92b0';u.fillText(o.route,W-108,10.5);X.hudBar(W-108,14,100,3,prog,col);
  uiFont(4,false);u.fillStyle='#ffe27a';u.fillText('Скорость: '+Math.round(Math.abs(c.v)*.6)+' км/ч',W-108,22);
  if(c.clung>2&&!dlg){uiFont(5,true);u.textAlign='center';u.fillStyle=Math.sin(tm*8)>0?'#ff6a6a':'#fff';u.fillText('Облепили машину! Стреляй или сдай назад',W/2,H-30);u.textAlign='left'}
  if(c.banner>0&&!dlg){u.globalAlpha=Math.min(1,c.banner);panel(0,H/2-24,W,36,.6);u.textAlign='center';uiFont(11,true);u.fillStyle=col;u.fillText(o.title,W/2,H/2-6);uiFont(5.5,false);u.fillStyle='#fff';u.fillText(o.sub,W/2,H/2+4);
    uiFont(4.4,false);u.fillStyle='#9a92b0';u.fillText(touch.on?'Левый стик — руль, правый — прицел':'WASD — руль и газ, мышь — прицел, ЛКМ — огонь',W/2,H/2+12);u.textAlign='left';u.globalAlpha=1}
  if(mouse.on&&!touch.on&&!dlg){const x=mouse.x,y=mouse.y;u.strokeStyle=col;u.lineWidth=.6;u.beginPath();u.arc(x,y,3,0,TAU);u.moveTo(x-6,y);u.lineTo(x-4,y);u.moveTo(x+4,y);u.lineTo(x+6,y);u.stroke()}
  if(toast){u.globalAlpha=Math.min(1,toast.life*2);uiFont(5.5,true);const w=u.measureText(toast.t).width+12;panel(W/2-w/2,H-42,w,11,.85);u.fillStyle='#fff';u.textAlign='center';u.fillText(toast.t,W/2,H-34.6);u.textAlign='left';u.globalAlpha=1}
  renderDlg();if(touch.on&&state==='play')touchUI();
}

// ================= ПОДМЕНА ЦИКЛА =================
const _update=update,_render=render,_action=action;
update=function(dt){
  if(C1.on&&C1.mode==='carK'){
    tm+=dt;for(const t of timers)t.t-=dt;const due=timers.filter(t=>t.t<=0);timers=timers.filter(t=>t.t>0);due.forEach(t=>t.fn());
    if(toast){toast.life-=dt;if(toast.life<=0)toast=null}
    if(dlg){const Ln=dlg.lines[dlg.i];dlg.shown=Math.min(Ln.t.length,dlg.shown+dt*48)}
    updateMusic(dt);if(tr){tr.t+=dt;if(!tr.done&&tr.t>=.5){tr.done=true;tr.fn()}if(tr&&tr.t>=1)tr=null}
    if(!(C1.on&&C1.mode==='carK'))return;if(C1.over){C1.over.t+=dt;return}if(cut){updateCut(dt);return}
    if(CAR&&E.L===K.L)carUpdate(dt);return}
  _update(dt);
  if(K.zoneT>0)K.zoneT-=dt;
  if(state!=='play'||cut||C1.over||(window.MG&&MG.active))return;
  if(K.on&&K.on.on&&C1.on&&C1.mode==='td'&&E.L&&E.L===K.L&&Q.allies){
    if(K.tick)K.tick(dt);
    for(const A of Q.allies)allyTick(A,dt);
    ebTick(dt);
  }
};
render=function(){
  if(C1.on&&state==='play'&&!cut&&C1.mode==='carK'&&CAR){carRender();trFade();carUI();if(C1.over&&C1.deathOv)C1.deathOv();return}
  _render();
  if(state!=='play'||(window.MG&&MG.active))return;
  if(K.on&&K.on.on&&C1.on&&C1.mode==='td'&&!cut&&E.L===K.L){
    if(K.hud&&E.L.armed)K.hud();
    if(K.zone&&K.zoneT>0&&!dlg){u.globalAlpha=Math.min(1,K.zoneT);uiFont(7,true);u.textAlign='center';u.fillStyle='rgba(0,0,0,.6)';u.fillText(K.zone,W/2+.5,46.5);u.fillStyle=K.zoneCol;u.fillText(K.zone,W/2,46);u.textAlign='left';u.globalAlpha=1}
  }
};
action=function(){
  if(C1.on&&C1.mode==='carK'){if(C1.over){if(C1.over.t>.6){const f=C1.retry;C1.over=null;if(f)transition(f)}return}if(dlg){advance();return}if(cut){if(cut.t>.6)nextShot();return}return}
  return _action();
};

// ================= ГЕРОИ СБОКУ (кат-сцены) =================
const SKY_SUN=['#4a9ae8','#58a4ec','#68aeee','#78b8f0','#88c2f2','#98ccf4','#a8d4f4','#b8dcf4','#c8e4f4','#d8ecf2'];
const SKY_DUSK=['#2a3a7a','#3a4688','#4e5294','#665c9a','#82629a','#a06a92','#c07a84','#d88c74','#e8a066','#f0b45e'];
K.SKY_SUN=SKY_SUN;K.SKY_DUSK=SKY_DUSK;
K.skyG=(cols,y0,y1)=>sky(cols,y0,y1);
K.sun=(x,y,r,c)=>{ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,x,y,r*3,c||'rgba(255,230,160,A)',.4);ctx.restore();ctx.fillStyle='#fff4c8';ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill()};
K.sea=(y,t,c1,c2)=>{F(0,y,W,H-y,c1||'#2a78a8');for(let i=0;i<40;i++){const x=mod(i*37+t*(8+i%5),W+20)-10,yy=y+3+((i*13)%(H-y-4));F(x,yy,6+(i%4)*2,1,c2||'#7ac8e8')}};
K.clouds=(t,y,c)=>{for(let i=0;i<6;i++){const x=mod(i*70-t*6,W+80)-40,yy=y+(i%3)*8;ctx.fillStyle=c||'rgba(255,255,255,.75)';ctx.beginPath();ctx.ellipse(x,yy,18,5,0,0,TAU);ctx.ellipse(x+12,yy-3,12,5,0,0,TAU);ctx.fill()}};
function legsSide(x,y,t,mode,c,shoe,h){const s=mode==='walk'?Math.round(Math.sin(t*10)*1.5):0;h=h||8;F(x-3+s,y-h-2,3,h,c);F(x-s,y-h-2,3,h,c);F(x-4+s,y-3,5,3,shoe);F(x-1-s,y-3,5,3,shoe)}
K.sideShmak=function(x,y,t,mode,gun){const SK='#f2cab2',D='#f59cc8',DD='#cf74a2',HR='#2c1a1f';const s=mode==='walk'?Math.round(Math.sin(t*10)*1.5):0;
  F(x-3+s,y-10,2,7,SK);F(x-s,y-10,2,7,SK);F(x-4+s,y-3,4,3,'#0e0e12');F(x-1-s,y-3,4,3,'#0e0e12');
  const ty=y-10;F(x-4,ty-11,8,11,D);F(x-5,ty-3,10,3,D);F(x-4,ty-11,2,11,DD);
  if(gun){F(x,ty-9,6,2,SK);F(x+5,ty-10,7,2,'#26262a');F(x+2,ty-9,3,3,'#6a4424')}else F(x+1,ty-10,2,8,SK);
  const hy=ty-18;F(x-3,hy,7,7,SK);F(x-4,hy-1,8,3,HR);F(x-5,hy,3,13,HR);F(x-4,hy+1,2,10,HR);F(x+2,hy+3,1,1,'#2a1e18');F(x+2,hy+5,2,1,'#c0506a')};
K.sideValera=function(x,y,t,mode,pipe){const SK='#eabd9a',H='#3a4a3a',HR='#5a3a22';legsSide(x,y,t,mode,'#2a2a30','#e8e8ec',6);
  const ty=y-8;F(x-4,ty-9,8,9,H);F(x-4,ty-9,2,9,'#26302a');F(x-2,ty-6,4,3,'#e8d8a0');
  if(pipe){ctx.save();ctx.translate(x+3,ty-6);ctx.rotate(pipe===true?-.9:pipe);F(0,-1,14,2,'#e8e8ec');F(12,-2,3,4,'#d8d8dc');ctx.restore()}else F(x+3,ty-8,2,7,H);
  const hy=ty-16;F(x-3,hy,7,7,SK);F(x-4,hy-1,8,3,HR);F(x-4,hy,2,4,HR);F(x-2,hy+4,7,4,HR);F(x+2,hy+2,1,1,'#2a1e18');F(x-4,hy,1,6,'#1a1a20');F(x-5,hy+2,2,3,'#3af08a')};
K.sideOlesya=function(x,y,t,mode){const SK='#f4cdb0',HR='#9a6a44',HL='#c08a5a';legsSide(x,y,t,mode,'#1a1a2a','#2a2a30',8);
  const ty=y-10;F(x-4,ty-11,8,11,'#c81e5a');F(x-6,ty-11,3,4,'#d8306a');F(x+3,ty-11,3,4,'#d8306a');F(x+1,ty-10,2,8,SK);
  const hy=ty-18;F(x-3,hy,7,7,SK);F(x-6,hy-2,10,4,HR);F(x-6,hy,4,10,HR);F(x-5,hy+1,1,8,HL);F(x+4,hy+1,2,6,HR);F(x+2,hy+3,1,1,'#2a1e18');F(x+2,hy+5,2,1,'#d0102a')};
K.sideVlados=function(x,y,t,mode,saw){const SK='#f2cfb4';legsSide(x,y,t,mode,'#1e2638','#0a0a0e',8);
  const ty=y-10;F(x-4,ty-12,8,12,'#1e2638');F(x-1,ty-12,2,6,'#f4f4f8');F(x,ty-11,1,4,'#5a1a2a');
  if(saw){F(x+2,ty-8,7,5,'#e8701a');F(x+9,ty-7,10,3,'#b8bcc4');for(let i=0;i<5;i++)F(x+9+((i*2+Math.floor(t*30))%10),ty-8,1,1,'#4a4a52')}else F(x+3,ty-11,2,9,'#1e2638');
  const hy=ty-19;F(x-3,hy,7,7,SK);F(x-3,hy-2,7,3,'#e8d07a');F(x-2,hy-3,5,1,'#f4e08a');F(x+1,hy+2,4,1,'#1a1a22');F(x+2,hy+5,2,1,'#b87a70')};
K.sideStolypin=function(x,y,t,mode,o){o=o||{};const SK='#e8b896',HR='#5a3a24';legsSide(x,y,t,mode,'#2a3a5a','#2a2a2a',8);
  const ty=y-10;F(x-6,ty-13,12,13,'#2a3a5a');F(x-2,ty-7,9,6,'#344a6a');F(x-6,ty-13,2,13,'#1e2a44');
  if(o.saw){F(x+4,ty-9,7,5,'#e8701a');F(x+11,ty-8,10,3,'#b8bcc4')}else if(o.beer){F(x+5,ty-14,2,6,SK);F(x+5,ty-17,3,5,'#d8c040')}else F(x+5,ty-12,2,9,'#2a3a5a');
  const hy=ty-21;F(x-4,hy,9,8,SK);F(x-5,hy-1,9,3,HR);F(x-7,hy,4,9,HR);F(x-1,hy+5,5,1,HR);F(x+1,hy+6,2,2,HR);F(x+2,hy+3,1,1,'#2a1e18')};
K.sideParent=function(x,y,t,mode,mama){const SK=mama?'#f0c8aa':'#e2b08e',C=mama?'#8a4a7a':'#4a6a3a';legsSide(x,y,t,mode,mama?'#3a2a3a':'#3a3a2a','#2a2a2a',7);
  const ty=y-9;F(x-4,ty-11,8,11,C);F(x+2,ty-10,2,8,SK);if(mama){F(x-5,ty-3,10,3,C);F(x-3,ty-8,6,7,'#f4f0e8')}
  const hy=ty-18;F(x-3,hy,7,7,SK);if(mama){F(x-4,hy-2,8,4,'#c0b4cc');F(x-5,hy,3,5,'#c0b4cc')}else{F(x-3,hy,1,4,'#d0d0d0');F(x+1,hy+5,4,1,'#d8d8d8');F(x,hy+2,4,1,'#5a4a3a')}F(x+2,hy+3,1,1,'#2a1e18')};
K.sideEgor=function(x,y,t,mode){const SK='#e9b994',FUR='#ff5aa8';legsSide(x,y,t,mode,'#18181e','#0e0e12',9);
  const ty=y-11;F(x-6,ty-13,12,14,FUR);F(x-6,ty-13,2,14,'#d63c88');F(x-1,ty-13,3,10,'#141418');
  const hy=ty-21;F(x-3,hy,7,8,SK);F(x-1,hy-7,4,7,'#16121a');F(x+1,hy+2,4,2,'#0c0a10')};
K.catSide=function(x,y,t,s,mode,p){ // p: {b,hl,ey,pt,face}
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);const w=mode==='walk'?Math.round(Math.sin(t*12)*1.2):0;
  F(-6+w,-3,1,3,p.pt);F(-4-w,-3,1,3,p.pt);F(3+w,-3,1,3,p.pt);F(5-w,-3,1,3,p.pt);F(-7,-7,13,4,p.b);F(-6,-7,10,1,p.hl);
  F(5,-10,5,5,p.b);F(8,-9,2,3,p.face);F(5,-12,1,2,p.pt);F(8,-12,1,2,p.pt);F(8,-8,1,1,p.ey);
  for(let i=0;i<6;i++)F(-8-Math.round(Math.sin(t*3+i*.6)),-8-i,1,1,p.pt);ctx.restore()};
K.PAL_BLACK={b:'#141219',hl:'#2f2a38',ey:'#d4ea4f',pt:'#141219',face:'#141219'};
K.PAL_ALISA={b:'#6a4a30',hl:'#b07a4a',ey:'#c8d040',pt:'#3a2818',face:'#d89a5a'};
K.PAL_SIAM={b:'#efe1c6',hl:'#d6c19e',ey:'#58b0ff',pt:'#4a3024',face:'#4a3024'};
K.livingSide=function(t,party){
  F(0,0,W,180,'#18122a');for(let x=0;x<W;x+=40)F(x,0,1,130,'#221a38');F(0,128,W,52,'#2a2238');for(let x=0;x<W;x+=24)F(x,128,1,52,'#241c32');
  F(20,18,280,2,'rgba(40,230,150,.6)');F(20,126,280,2,'rgba(40,230,150,.6)');F(230,40,60,40,'#0e0e16');F(232,42,56,30,'#2a3a6a');F(256,80,8,14,'#1a1a1e');F(244,94,32,3,'#2a2a30');
  F(30,100,70,28,'#4a3a5a');F(30,96,70,6,'#5a4a6a'); // диван
  F(150,90,10,14,'#4a2e1a');F(152,78,6,12,'#d8a830');F(153,76,4,2,'#e8c050'); // статуэтка Аниса
  ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,160,10,90,'rgba(255,60,190,A)',.18);radial(ctx,260,60,40,'rgba(120,160,255,A)',.25);
  if(party){for(let i=0;i<3;i++)radial(ctx,60+i*100+Math.sin(t*3+i)*30,60,50,['rgba(255,60,220,A)','rgba(60,240,200,A)','rgba(255,210,60,A)'][i],.25+.15*Math.sin(t*8+i))}
  ctx.restore()};
K.newsBar=function(head,good,ch){
  F(0,12,W,12,good?'#1a6a3a':'#c0101a');ctx.fillStyle='#fff';ctx.font='bold 7px monospace';ctx.fillText(good?'ХОРОШИЕ НОВОСТИ':'СРОЧНО · ПРЯМОЕ ВКЛЮЧЕНИЕ',6,21);
  ctx.textAlign='right';ctx.fillText(ch||'НЕВА 24',W-6,21);ctx.textAlign='left';
  F(6,H-40,W-12,10,'rgba(245,245,245,.95)');F(6,H-40,4,10,good?'#1a6a3a':'#c0101a');ctx.fillStyle='#111';ctx.font='bold 6px monospace';ctx.fillText(head,13,H-32.5)};
// гидросамолёт Валеры сбоку (смотрит вправо)
K.planeSide=function(x,y,t,o){o=o||{};ctx.save();ctx.translate(Math.round(x),Math.round(y));if(o.tilt)ctx.rotate(o.tilt);
  F(-34,6,60,4,'#e8e8ec');F(-30,10,18,2,'#a8a8b0');F(6,10,18,2,'#a8a8b0'); // поплавки
  F(-14,0,1,7,'#5a5a62');F(14,0,1,7,'#5a5a62');
  F(-30,-8,56,10,'#f4f4f8');F(-30,-8,56,2,'#ffffff');F(-30,0,56,2,'#3a7ac8');F(18,-6,6,6,'#3a7ac8');
  F(-36,-16,8,10,'#f4f4f8');F(-36,-16,8,2,'#c8202a');F(-26,-10,4,3,'#c8202a');
  F(-8,-12,22,3,'#d8d8e0');F(-8,-12,22,1,'#ffffff'); // крыло
  F(6,-7,8,4,'#2a3a50');F(-4,-7,8,4,'#2a3a50');if(o.pilots){F(8,-7,2,3,'#5a3a22');F(-2,-7,2,3,'#2c1a1f')}
  F(26,-6,2,6,'#3a3a40');const pr=Math.sin(t*60)>0;F(28,pr?-12:-2,1,pr?10:4,'rgba(200,200,210,.8)');F(28,pr?-2:-12,1,pr?4:10,'rgba(200,200,210,.5)');
  ctx.fillStyle='#c8202a';ctx.font='bold 4px monospace';ctx.fillText('ВАЛЕРА-1',-20,-2);
  ctx.restore()};
// машины сбоку
K.carSide=function(x,y,t,kind,o){o=o||{};ctx.save();if(o.left){ctx.translate(2*x+52,0);ctx.scale(-1,1)}const bob=o.move?Math.round(Math.sin(t*20)*.6):0;y+=bob;
  const C={rover:['#9a1818','#d03a30'],cab:['#f4f0e8','#ffffff'],x6:['#6a6e76','#9a9ea6'],pick:['#3a5a8a','#5a7aaa']}[kind];
  if(kind==='cab'){F(x,y-16,54,9,C[0]);F(x,y-16,54,1,C[1]);F(x+20,y-22,2,6,'#3a3a40');F(x+22,y-22,10,1,'#2a3a50');F(x+6,y-19,34,3,'#c81e5a');}
  else if(kind==='pick'){F(x,y-17,52,10,C[0]);F(x,y-17,52,1,C[1]);F(x+28,y-27,20,10,C[0]);F(x+30,y-25,14,6,'#1c2430');F(x+2,y-21,24,4,shade(C[0],.7));if(o.bags){F(x+4,y-26,8,6,'#2a2a2a');F(x+13,y-25,10,5,'#3a3a2a')}}
  else if(kind==='x6'){F(x,y-17,56,10,C[0]);F(x,y-17,56,1,C[1]);F(x+8,y-27,36,10,C[0]);F(x+10,y-25,14,7,'#1c2430');F(x+26,y-25,14,7,'#1c2430');F(x+44,y-21,10,4,C[0]);F(x+52,y-16,4,3,'#fff6c0');F(x+52,y-12,4,2,'#1a1a1a');F(x,y-10,56,2,'#2a2a2e');F(x+20,y-14,14,1,'#2a3a8a');F(x+21,y-13,4,1,'#c8202a')}
  else{F(x,y-18,52,11,C[0]);F(x,y-18,52,1,C[1]);F(x+5,y-29,38,11,C[0]);F(x+7,y-27,10,7,'#1c2430');F(x+19,y-27,10,7,'#1c2430');F(x+31,y-27,10,7,'#1c2430')}
  for(const wx of kind==='x6'?[6,40]:[6,36]){F(x+wx,y-9,12,9,'#0a0a0c');F(x+wx+3,y-7,6,5,kind==='x6'?'#8a8e96':'#3a3a40')}
  if(o.heads)for(const [hx,c] of o.heads)F(x+hx,y-(kind==='cab'?24:28),4,4,c);
  ctx.restore()};
K.drawPalms=(t,y)=>{for(let i=0;i<5;i++){const x=mod(i*80-t*20,W+80)-40;F(x,y-40,3,40,'#7a5a32');for(let k=0;k<5;k++){const a=-2.6+k*.55+Math.sin(t*2+i)*.05;ctx.strokeStyle='#2a8a3a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+1,y-40);ctx.quadraticCurveTo(x+1+Math.cos(a)*10,y-46+Math.sin(a)*4,x+1+Math.cos(a)*18,y-38+Math.sin(a)*12);ctx.stroke()}}};

// ================= МЕНЮ ГЛАВЫ НА ТИТУЛЕ, ПРОДОЛЖЕНИЕ С ЭКРАНА КОНЦА =================
// cfg: {ch, num, title, col, btn, menu:[[подпись,ключ]], start(key), canContinue(), cont(), endScreen()}
K.chapter=function(cfg){
  const ch=cfg.ch;
  const others=()=>C1.menu||(window.C2&&C2.menu)||(window.C3&&C3.menu)||(window.C4&&C4.menu)||[window.C5,window.C6,window.C7,window.C8,window.C9,window.C10].some(o=>o&&o!==ch&&o.menu)||C1.gal;
  const _rt=renderTitle;
  renderTitle=function(){_rt();if(others())return;
    const b=cfg.btn;u.fillStyle=cfg.col.replace('A',.75+.25*Math.sin(tm*3+cfg.num));u.fillRect(b.x,b.y,b.w,b.h);u.fillStyle='#120a1c';uiFont(5.4,true);u.textAlign='center';u.fillText('ГЛАВА '+cfg.num+' ▸'+(touch.on?'':'  ('+(cfg.num%10)+')'),b.x+b.w/2,b.y+8.2);u.textAlign='left';
    if(ch.menu){panel(0,0,W,H,.92);u.textAlign='center';uiFont(10,true);u.fillStyle=cfg.col.replace('A',1);u.fillText('ГЛАВА '+cfg.num+' · '+cfg.title,W/2,20);uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText('Выбери, откуда начать (для проверки участков)',W/2,28);u.textAlign='left';
      const RH=Math.min(13,(H-42)/cfg.menu.length);cfg.menu.forEach((m,i)=>{const y=34+i*RH,sel=ch.menu.sel===i;u.fillStyle=sel?cfg.col.replace('A',.9):'rgba(255,255,255,.08)';u.fillRect(W/2-90,y,180,RH-2.5);u.fillStyle=sel?'#120a1c':'#fff';uiFont(RH<12?4.6:5.2,true);u.fillText((i+1)+'. '+m[0],W/2-85,y+(RH<12?6.2:7.4))});
      uiFont(4.4,false);u.fillStyle='#9a92b0';u.textAlign='center';u.fillText(touch.on?'Коснись участка. Коснись вне списка — назад':'W/S и E, или клик. Esc — назад',W/2,H-4);u.textAlign='left'}};
  const pickAt=(x,y)=>{const RH=Math.min(13,(H-42)/cfg.menu.length),i=Math.floor((y-34)/RH);if(x>W/2-90&&x<W/2+90&&i>=0&&i<cfg.menu.length&&y-34-i*RH<=RH-2.5){go(cfg.menu[i][1]);return}ch.menu=null};
  function go(k){ch.menu=null;for(const o of [C1,window.C2,window.C3,window.C4,window.C5,window.C6,window.C7,window.C8,window.C9,window.C10])if(o)o.menu=null;state='play';sfx('click');S.fade=0;cfg.start(k)}
  cfg.go=go;
  const toXY=e=>({x:(e.clientX-OX)/SC,y:(e.clientY-OY)/SC});
  const inBtn=(p,b,pad)=>p.x>=b.x-pad&&p.x<=b.x+b.w+pad&&p.y>=b.y-pad&&p.y<=b.y+b.h+pad;
  const digit='Digit'+(cfg.num%10);
  addEventListener('keydown',e=>{
    if(state==='title'&&!others()){
      if(ch.menu){const m=ch.menu,n=cfg.menu.length;if(e.code==='KeyW'||e.code==='ArrowUp')m.sel=(m.sel+n-1)%n;else if(e.code==='KeyS'||e.code==='ArrowDown')m.sel=(m.sel+1)%n;
        else if(['KeyE','Space','Enter'].includes(e.code)){if(!e.repeat&&m.sel>=0)go(cfg.menu[m.sel][1])}else if(e.code==='Escape')ch.menu=null;
        else if(/^Digit[1-9]$/.test(e.code)){const i=+e.code[5]-1;if(cfg.menu[i])go(cfg.menu[i][1])}
        e.preventDefault();e.stopImmediatePropagation();return}
      if(e.code===digit){ch.menu={sel:0};sfx('click');e.preventDefault();e.stopImmediatePropagation();return}}
    if(state==='end'&&cfg.canContinue()&&['KeyE','Space','Enter'].includes(e.code)&&!e.repeat){cfg.cont();e.preventDefault();e.stopImmediatePropagation()}
  },true);
  addEventListener('mousedown',e=>{const p=toXY(e);
    if(state==='title'&&!others()){if(ch.menu){pickAt(p.x,p.y);e.stopImmediatePropagation();return}if(inBtn(p,cfg.btn,0)){ch.menu={sel:0};sfx('click');e.stopImmediatePropagation();return}}
    if(state==='end'&&cfg.canContinue()){cfg.cont();e.stopImmediatePropagation()}},true);
  addEventListener('touchstart',e=>{for(const t of e.changedTouches){const p=toXY(t);
    if(state==='title'&&!others()){if(ch.menu){pickAt(p.x,p.y);e.preventDefault();e.stopImmediatePropagation();return}if(inBtn(p,cfg.btn,3)){touch.on=true;mouse.on=false;ch.menu={sel:-1};e.preventDefault();e.stopImmediatePropagation();return}}
    if(state==='end'&&cfg.canContinue()){touch.on=true;cfg.cont();e.preventDefault();e.stopImmediatePropagation();return}}},{capture:true,passive:false});
  const _a=action;action=function(){if(state==='end'&&cfg.canContinue()){cfg.cont();return}return _a()};
  const _re=renderEnd;renderEnd=function(){if(cfg.endScreen&&cfg.endScreen())return;_re()};
  cfg.contBtn=y=>{u.textAlign='center';const k=.75+.25*Math.sin(tm*3);u.fillStyle=cfg.col.replace('A',k);u.fillRect(W/2-90,y,180,14);u.fillStyle='#120a1c';uiFont(6.2,true);u.fillText('▶ ГЛАВА '+cfg.num+': '+cfg.title,W/2,y+9.5);
    uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText(touch.on?'Коснись, чтобы продолжить':'E или клик — продолжить   ·   R — начать игру заново',W/2,y+22);u.textAlign='left'};
  const hs=location.hash.slice(1);if(hs){const m=cfg.alias&&cfg.alias[hs]||hs;if(cfg.menu.some(x=>x[1]===m))setTimeout(()=>{menuOn=true;go(m)},110)}
};
// общий экран конца главы
K.endPanel=function(o){
  panel(0,0,W,H,1);u.textAlign='center';
  uiFont(15,true);u.fillStyle='#ff2a7a';u.fillText(o.big,W/2+1.5,28+1.5);u.fillStyle='#ffd23a';u.fillText(o.big,W/2,28);
  uiFont(6.4,true);u.fillStyle=o.col||'#ff7ac8';u.fillText(o.sub,W/2,40);
  const ws=o.faces;ws.forEach((w,i)=>{const n=ws.length,st=Math.min(62,(W-12)/n),sz=st-8,x=W/2-n*st/2+i*st+4,y=50+(54-sz)/2+Math.sin(tm*2+i)*1.5;u.fillStyle=BG[w][0];u.fillRect(x,y,sz,sz);u.strokeStyle=BG[w][1];u.lineWidth=.8;u.strokeRect(x,y,sz,sz);
    const g=PCV[w].getContext('2d');PORTRAIT[w](g,false,(tm+i)%3.4>3.25);u.imageSmoothingEnabled=false;u.drawImage(PCV[w],x,y,sz,sz);uiFont(4.6,true);u.fillStyle=NCOL[w];u.fillText(NAME[w],x+sz/2,y+sz+8)});
  uiFont(5.2,false);u.fillStyle='#fff';u.fillText(o.l1,W/2,128);u.fillStyle='#3ef0b0';u.fillText(o.l2,W/2,138);
  if(o.l3){uiFont(4.6,false);u.fillStyle='#ffb0d8';u.fillText(o.l3,W/2,147)}
  u.textAlign='left';
};
})();
