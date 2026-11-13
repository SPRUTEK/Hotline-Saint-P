// cinekit.js — набор для кинокатсцен (06.11): персонажи в профиль (позы, предметы), коты, крысы, зомби, машины.
// Всё рисуется в холст CINE 640×360. Спрайты кешируются через MART.spr.
(function(){
'use strict';
const C=window.CINE,M=window.MART;if(!C||!M)return;
const {hash,mix}=M,lit=C.lit,drk=C.drk,TAU=Math.PI*2;
// масштабирующая обёртка над A (MART.build): kx/ky растягивают фигуру
function SC(A,kx,ky){if(kx===1&&ky===1)return A;const X=v=>v*kx,Y=v=>v*ky;return{
  r:(x,y,w,h,c)=>A.r(X(x),Y(y),X(w),Y(h),c),d:(x,y,w,h,c)=>A.d(X(x),Y(y),Math.max(1,X(w)),Math.max(1,Y(h)),c),
  q:(p,c)=>A.q(p.map((v,i)=>i%2?Y(v):X(v)),c),e:(x,y,rx,ry,c)=>A.e(X(x),Y(y),X(rx),Y(ry),c),p:(x,y,c)=>A.p(X(x),Y(y),c),ln:(a,b,c2,d,c)=>A.ln(X(a),Y(b),X(c2),Y(d),c)}}
const limb=(A,x0,y0,x1,y1,w,c)=>{const dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy)||1,nx=-dy/l*w/2,ny=dx/l*w/2;A.q([x0+nx,y0+ny,x1+nx,y1+ny,x1-nx,y1-ny,x0-nx,y0-ny],c)};
// ---------- предметы в руке (рисуются в точке кисти hx,hy) ----------
function item(A,k,hx,hy,P){
  if(k==='shotgun'||k==='rifle'||k==='awp'){const L=k==='awp'?34:28;A.r(hx-10,hy-3,12,4,'#5a3a22');A.d(hx-10,hy-3,12,1,'#7a5432');A.r(hx,hy-3,L,3,'#2a2a30');A.d(hx,hy-3,L,1,'#5a5a64');A.r(hx+4,hy,8,2,'#5a3a22');if(k==='awp'){A.r(hx+4,hy-7,12,3,'#1a1a1e');A.d(hx+14,hy-7,2,3,'#7adfff');A.r(hx-2,hy-3,6,4,'#4a6a3a')}}
  else if(k==='pistol'||k==='magnum'){A.r(hx-1,hy-4,k==='magnum'?11:8,3,'#2a2a30');A.d(hx,hy-4,7,1,'#6a6a74');A.r(hx-1,hy-1,3,4,'#1a1a1e')}
  else if(k==='uzi'){A.r(hx-2,hy-5,11,4,'#ff5ac8');A.d(hx-1,hy-5,9,1,'#ffa8e8');A.r(hx+1,hy-1,3,6,'#c8309a')}
  else if(k==='rpg'){A.r(hx-16,hy-6,40,5,'#4a5a32');A.d(hx-16,hy-6,40,1,'#6a7a4a');A.q([hx+24,hy-8,hx+32,hy-4,hx+24,hy],'#8a2a1a');A.r(hx-2,hy-1,3,5,'#2a2a2a')}
  else if(k==='chainsaw'){A.r(hx-6,hy-8,12,9,'#e8a020');A.d(hx-6,hy-8,12,2,'#ffd060');A.r(hx+6,hy-6,22,5,'#c8ccd4');for(let i=0;i<11;i++)A.p(hx+6+i*2,hy-7,'#4a4a50');A.d(hx-4,hy-11,6,2,'#2a2a2a')}
  else if(k==='shovel'){A.r(hx-2,hy-22,2,30,'#8a5a32');A.q([hx-5,hy+8,hx+3,hy+8,hx+2,hy+16,hx-4,hy+16],'#8a8e96')}
  else if(k==='beer'){A.r(hx-1,hy-9,5,9,'#c8a02a');A.d(hx,hy-8,1,7,'#f0d870');A.r(hx-1,hy-11,5,2,'#e8e8e8')}
  else if(k==='bottle'){A.r(hx,hy-10,4,10,'#3a7a3a');A.r(hx+1,hy-14,2,4,'#3a7a3a');A.d(hx+1,hy-8,1,6,'#8ae88a');A.d(hx,hy-6,4,3,'#e8e0c0')}
  else if(k==='coffee'){A.r(hx-1,hy-7,5,7,'#f0ece4');A.d(hx-1,hy-5,5,2,'#8a5a32');A.r(hx-1,hy-8,5,1,'#2a2a2a')}
  else if(k==='phone'){A.r(hx,hy-6,3,6,'#1a1a22');A.d(hx+1,hy-5,1,4,'#7adfff')}
  else if(k==='mic'){A.r(hx,hy-4,2,6,'#2a2a2a');A.e(hx+1,hy-6,2.2,2.2,'#a8acb4')}
  else if(k==='bag'){A.r(hx-5,hy,11,13,P&&P.bagc||'#2a2a2a');A.d(hx-4,hy+1,9,1,'#4a4a4a');A.d(hx-1,hy-2,3,2,'#1a1a1a')}
  else if(k==='case'){A.r(hx-7,hy+1,16,12,'#3a2a2a');A.d(hx-6,hy+2,14,1,'#5a4a4a');A.d(hx-2,hy-1,6,2,'#1a1a1a');A.d(hx-7,hy+6,16,1,'#c8a040')}
  else if(k==='speaker'){A.r(hx-6,hy-2,13,16,'#1a1a22');A.e(hx,hy+3,3.5,3.5,'#3a3a44');A.e(hx,hy+10,2.5,2.5,'#3a3a44');A.d(hx-6,hy-2,13,1,'#ff4fd8');A.d(hx-3,hy-5,7,3,'#2a2a30')}
  else if(k==='syringe'){A.r(hx,hy-6,2,7,'#e8f8e8');A.d(hx,hy-5,2,4,'#5aff7a');A.d(hx+.5,hy-9,1,3,'#c8ccd4')}
  else if(k==='whistle'){A.r(hx,hy-3,4,3,'#c8ccd4')}
  else if(k==='box'){A.r(hx-10,hy-6,18,14,'#b8864a');A.d(hx-10,hy-6,18,1,'#d8a86a');A.d(hx-2,hy-6,2,14,'#8a6234')}
  else if(k==='keys'){A.d(hx,hy,2,3,'#e8c050');A.d(hx+1,hy+2,3,1,'#c8a030')}
  else if(k==='turka'){A.r(hx,hy-4,6,5,'#c88a3a');A.d(hx,hy-4,6,1,'#f0b860');A.r(hx-6,hy-3,6,1,'#2a1a10')}
}
// ---------- человек в профиль, ~66px, смотрит вправо ----------
// P: skin hair style beard glasses lens eye top kind top2 shirt tie zip pants shoes dress legs boots fat k (рост) f(женский) zombie cap hat ...
const POSE={ // [локоть, кисть] относительно плеча (0,-47): f — передняя рука, b — задняя
  stand:{f:[[1,10],[1,20]],b:[[-1,10],[-2,20]]},
  talk:{f:[[3,10],[11,5]],b:[[-1,10],[-2,20]],f2:[[3,10],[12,1]]},
  point:{f:[[8,3],[18,-1]],b:[[-1,10],[-2,20]]},
  wave:{f:[[7,-5],[8,-16]],b:[[-1,10],[-2,20]],f2:[[8,-4],[12,-15]]},
  raise:{f:[[5,-7],[5,-19]],b:[[-4,-7],[-4,-19]]},
  gun:{f:[[5,9],[12,8]],b:[[2,10],[4,10]]},
  aim:{f:[[8,4],[17,3]],b:[[5,7],[9,6]]},
  pistol:{f:[[9,2],[18,1]],b:[[-1,10],[-2,20]]},
  zombie:{f:[[9,3],[18,4]],b:[[8,5],[16,7]]},
  hips:{f:[[6,8],[2,17]],b:[[-6,8],[-3,17]]},
  phone:{f:[[6,8],[6,-7]],b:[[-1,10],[-2,20]]},
  carry:{f:[[5,10],[10,14]],b:[[3,11],[7,15]]},
  cross:{f:[[4,9],[-2,11]],b:[[3,9],[-1,9]]},
  hold:{f:[[3,10],[8,14]],b:[[-1,10],[-2,20]]},
  drink:{f:[[7,6],[7,-6]],b:[[-1,10],[-2,20]]},
  sit:{f:[[4,10],[12,12]],b:[[2,10],[9,13]]},
  shrug:{f:[[6,6],[11,0]],b:[[-6,6],[-9,0]]},
  fist:{f:[[7,-2],[14,-12]],b:[[-2,10],[-3,19]]},
  walk:null,run:null};
function person(P,frame,pose){const key='P2:'+JSON.stringify(P)+':'+frame+':'+pose;return M.spr(key,A0=>{
  const A=SC(A0,P.fat?1.18:P.thin?.9:1,P.k||1);
  const f=P.f,zomb=P.zombie;let sk=P.skin||'#e8b898';if(zomb)sk=mix(sk,'#7aa85a',.6);
  const top=P.top||'#555',top2=P.top2||drk(top,.25),pants=P.pants||'#22222a',shoes=P.shoes||'#1a1a1e';
  const walk=pose==='walk'||pose==='run',run=pose==='run',sit=pose==='sit';
  const st=walk?(run?[[-8,7],[-3,3],[7,-8],[3,-3]]:[[-5,4],[-2,2],[4,-5],[2,-2]])[frame&3]:[-2,2];
  const bob=walk&&(frame&1)?-1:0,lean=run?3:zomb&&pose==='zombie'?2:0;
  const sy=sit?12:0; // посадка
  const shY=-47+bob+sy,shX=lean;
  const legC=P.dress&&!P.pantsUnder?(P.legs||sk):pants;
  // ---- ноги
  const footY=P.boots==='plat'?-6:-3;
  const leg=(o,c,sc)=>{if(sit){A.r(-4+o*.3,-20,18,6,c);A.r(9+o*.3,-16,5,13,c);A.r(9+o*.3,-4,10,4,sc);return}
    A.q([-3+o,-27+bob,3+o,-27+bob,2+o*1.4,footY,-4+o*1.4,footY],c);
    if(P.boots==='plat'){A.r(-5+o*1.4,-8,10,8,sc);A.d(-5+o*1.4,-2,10,2,lit(sc,.18))}
    else if(P.boots==='high'){A.r(-4+o*1.4,-12,8,12,sc);A.r(-4+o*1.4,-4,10,4,sc)}
    else{A.r(-4+o*1.4,-4,10,4,sc);A.d(-4+o*1.4,-1,10,1,P.sole||lit(sc,.45))}};
  leg(st[0],drk(legC,.22),drk(shoes,.2));
  // ---- задняя рука
  const pz=POSE[pose]||POSE.stand;
  const sw=walk?([[4,-3],[1,-1],[-4,3],[-1,1]])[frame&3]:[0,0];
  const arm=(sel,c,w)=>{let el,hd;if(walk){const s=sel==='f'?sw[0]:-sw[0];el=[s*.4,10];hd=[s*1.2,run?14:20];if(run){el=[s*.6+2,8];hd=[s*1.4+6,2]}}
    else{const d=(frame&1)&&pz[sel+'2']?pz[sel+'2']:pz[sel];el=d[0];hd=d[1]}
    const x0=shX+(sel==='f'?1:-2),y0=shY,ex=x0+el[0],ey=y0+el[1],hx=x0+hd[0],hy=y0+hd[1];
    if(sel==='f'){limb(A,x0,y0,ex,ey,w+1.6,drk(c,.45));limb(A,ex,ey,hx,hy,w+1.1,drk(c,.45))}limb(A,x0,y0,ex,ey,w,c);limb(A,ex,ey,hx,hy,w-.5,c);A.r(hx-2,hy-2,4,4,P.glove||sk);return[hx,hy]};
  const armW=P.fat||P.buff?6:5;
  if((P.kind==='tank'||P.dress&&!P.top)&&!P.sleeve)P=Object.assign({},P,{sleeve:sk});
  const back=arm('b',drk(P.sleeve||top,.32),armW);
  // ---- передняя нога
  leg(st[1],legC,shoes);
  // ---- юбка/пальто
  const tw=f?6:P.wide||P.buff?9:7;const ty=-50+bob+sy;
  if(P.dress){A.q([-tw+1,-30+bob+sy,tw-1,-30+bob+sy,tw+3,-17+bob+sy,-tw-2,-17+bob+sy],P.dress);A.d(-tw-1,-18+bob+sy,tw*2+3,1,drk(P.dress,.3));if(P.ruffle)for(let i=0;i<5;i++)A.d(-tw-1+i*3,-17+bob+sy,2,1,lit(P.dress,.3))}
  if(P.coat){A.q([-tw,-30+bob,tw,-30+bob,tw+2,-12+bob,-tw-2,-12+bob],P.coat);A.d(1,-30+bob,1,18,drk(P.coat,.3))}
  // ---- туловище
  const tc=P.dress&&!P.top?P.dress:top;
  if(P.buff){A.q([-tw-1,ty-1,tw+2,ty-1,tw,-26+bob+sy,-tw+2,-26+bob+sy],tc);A.d(1,ty+5,6,1,drk(tc,.3));A.d(0,ty+12,7,1,drk(tc,.25));A.d(2,ty+16,4,1,drk(tc,.25))}
  else A.q([-tw,ty,tw-1,ty,tw-(f?1:0),-26+bob+sy,-tw+1,-26+bob+sy],tc);
  if(f&&!P.flat)A.e(tw-2,ty+8,2.6,2.4,tc);
  if(P.kind!=='tank'&&!P.buff)A.d(-tw+1,ty+1,2,22,top2);
  if(P.kind==='tank'){A.q([tw-5,ty,tw-1,ty,tw-1,ty+6],sk);A.d(-tw+1,ty,3,3,sk)}
  if(P.kind==='turtle'){A.r(-1,ty-3,6,4,tc)}
  if(P.kind==='hoodie'){A.r(-tw-1,ty-2,6,6,tc);A.d(3,ty+12,6,4,drk(tc,.15))}
  if(P.kind==='fur'){for(let i=0;i<16;i++)A.d(-tw+1+hash(i,3)*(tw*2-2),ty+1+hash(3,i)*22,1,1,lit(tc,.35))}
  if(P.shirt){A.q([2,ty,6,ty,4,ty+10],P.shirt);if(P.tie)A.q([3,ty+1,5,ty+1,5,ty+14,3,ty+12],P.tie)}
  if(P.print)A.d(1,ty+6,5,5,P.print);
  if(P.zip)A.d(4,ty+2,1,20,lit(top,.35));
  if(P.belt)A.d(-tw+1,ty+21,tw*2-1,2,P.belt);else if(!P.dress&&!P.buff)A.d(-tw+1,-28+bob+sy,tw*2-1,2,drk(tc,.3));
  if(P.apron){A.q([0,ty+6,tw,ty+6,tw+1,-14+bob,0,-14+bob],P.apron)}
  if(P.vest){A.q([-tw,ty,2,ty,2,-26+bob,-tw+1,-26+bob],P.vest)}
  if(zomb){for(let i=0;i<5;i++)A.d(-tw+2+hash(i,P.seed||1)*(tw*2-4),ty+2+hash(P.seed||1,i)*18,2,2+hash(i,i)*2,i%2?drk(tc,.55):'#5a7a3a');A.d(-2,ty+9,3,2,'#2a8a2a')}
  // ---- шея и голова
  A.r(-1+shX,ty-3,5,4,drk(sk,.15));
  const hy=-66+bob+sy,hx=shX;
  if(P.cat){const fu=P.cat;A.r(hx-5,hy,13,12,fu);A.q([hx+7,hy+4,hx+11,hy+7,hx+7,hy+10],fu);A.q([hx-4,hy+1,hx-3,hy-6,hx+1,hy],fu);A.q([hx+2,hy,hx+5,hy-6,hx+7,hy+1],fu);
    A.d(hx+3,hy-3,1,2,P.earIn||'#ff8ab8');A.d(hx+4,hy+4,3,2,P.eye||'#c6ef4a');A.d(hx+5,hy+4,1,2,'#0a0a0a');A.d(hx+10,hy+6,1,1,P.nose||'#ff8ab8');A.d(hx+6,hy+9,4,1,drk(fu,.4));
    for(let i=0;i<3;i++)A.d(hx+9,hy+7+i,4,1,'#d8d8d8');if(P.teeth)for(let i=0;i<4;i++)A.d(hx+5+i,hy+9+(i%2),1,1,'#ffffff')}
  else{
  A.r(hx-5,hy,12,13,sk);A.r(hx+7,hy+5,2,3,sk);A.d(hx+7,hy+7,2,1,drk(sk,.2));
  const tk=pose==='talk'&&(frame&1);A.d(hx+3,hy+10,4,tk?2:1,tk?'#5a2020':drk(sk,.3));
  if(f){A.d(hx+3,hy+10,4,1,P.lips||'#c8506a')}
  A.d(hx+4,hy+5,2,2,'#ffffff');A.d(hx+5,hy+5,1,2,zomb?'#c8ff3a':P.eye||'#3a2a1a');A.d(hx+3,hy+3,4,1,drk(P.hair||sk,.1));
  if(f)A.d(hx+6,hy+4,1,1,'#1a1a1a');
  A.d(hx-2,hy+5,2,3,drk(sk,.18));if(P.ear)A.d(hx-2,hy+8,1,2,P.ear);
  if(P.blush)A.d(hx+3,hy+8,3,1,'#f08aa0');
  if(zomb){A.d(hx+1,hy+2,3,2,'#4a6a2a');A.d(hx+5,hy+9,2,2,'#3a0a0a');A.d(hx+4,hy+12,2,2,'#2a8a2a')}
  if(P.glasses){A.d(hx+2,hy+4,6,4,P.glasses);A.d(hx+3,hy+5,4,2,P.lens||'#a8d8ff');A.d(hx+5,hy+5,1,2,'#3a2a1a');A.d(hx-3,hy+5,5,1,P.glasses);if(P.shades)A.d(hx+3,hy+5,4,2,P.lens)}
  if(P.stub)for(let i=0;i<10;i++)A.d(hx+hash(i,2)*8,hy+8+hash(2,i)*4,1,1,drk(sk,.35));
  const H=P.hair||'#2a1e18',st2=P.style;
  if(st2==='back'){A.r(hx-6,hy-2,13,5,H);A.r(hx-6,hy,4,10,H);A.d(hx+4,hy-2,3,1,lit(H,.25));A.d(hx-4,hy-1,6,1,lit(H,.15))}
  else if(st2==='long'){A.r(hx-6,hy-2,13,5,H);A.r(hx-8,hy,6,P.hl||22,H);A.d(hx-7,hy+2,1,(P.hl||22)-4,lit(H,.2));A.r(hx+5,hy+1,2,3,H)}
  else if(st2==='fem'){A.r(hx-6,hy-2,14,5,H);A.q([hx-9,hy,hx-2,hy,hx-1,hy+(P.hl||26),hx-10,hy+(P.hl||26)-2],H);A.d(hx-8,hy+2,1,(P.hl||26)-6,lit(H,.18));A.r(hx+5,hy+1,3,4,H);A.d(hx+6,hy+1,1,5,H);A.d(hx-1,hy-2,5,1,lit(H,.3))}
  else if(st2==='bob'){A.r(hx-6,hy-2,14,5,H);A.r(hx-8,hy,7,13,H);A.r(hx+5,hy+1,3,5,H);A.d(hx-7,hy+2,1,9,lit(H,.2))}
  else if(st2==='bun'){A.r(hx-6,hy-2,13,5,H);A.r(hx-6,hy,4,8,H);A.e(hx-5,hy-3,4,4,H)}
  else if(st2==='spiky'){A.r(hx-6,hy-1,13,4,H);const sp=[[0,-5],[2.3,-7],[4.6,-4],[6.9,-8],[9.2,-5],[11,-3]];for(const [o,h] of sp)A.q([hx-6+o,hy+1,hx-3+o,hy+1,hx-2+o,hy+h],H);A.r(hx-6,hy,3,6,H);A.d(hx,hy-2,4,1,lit(H,.35))}
  else if(st2==='short'){A.r(hx-6,hy-1,13,4,H);A.r(hx-6,hy,3,7,H);A.d(hx-3,hy-1,6,1,lit(H,.2))}
  else if(st2==='buzz'){A.r(hx-5,hy-1,11,3,H);A.r(hx-6,hy,2,5,H)}
  else if(st2==='curly'){for(let i=0;i<9;i++)A.e(hx-5+i*1.5,hy-1+Math.sin(i)*1,2.2,2.2,H);A.r(hx-7,hy,4,9,H)}
  else if(st2==='quiff'){A.r(hx-6,hy-1,13,4,H);A.q([hx-2,hy,hx+8,hy-1,hx+6,hy-5,hx-3,hy-4],H);A.r(hx-6,hy,3,6,H)}
  else if(st2==='mohawk'){A.r(hx-5,hy,11,2,H);A.q([hx-6,hy,hx+6,hy,hx+3,hy-7,hx-4,hy-6],P.hair2||H)}
  else if(st2==='bald'){A.d(hx-1,hy,5,1,lit(sk,.3))}
  if(P.hair2&&st2!=='mohawk')A.d(hx-7,hy+3,2,4,P.hair2);
  if(P.cap){A.r(hx-6,hy-3,13,5,P.cap);A.r(hx+5,hy,7,2,drk(P.cap,.2));A.d(hx-4,hy-2,8,1,lit(P.cap,.3))}
  if(P.beanie){A.r(hx-6,hy-4,13,7,P.beanie);A.d(hx-6,hy+1,13,2,drk(P.beanie,.2))}
  if(P.band)A.d(hx-6,hy+1,13,2,P.band);
  if(P.headph){A.r(hx-4,hy+3,4,6,P.headph);A.d(hx-3,hy-2,1,5,P.headph)}
  if(P.crown){A.r(hx-5,hy-6,11,4,'#f0c040');for(let i=0;i<4;i++)A.q([hx-5+i*3,hy-6,hx-3+i*3,hy-6,hx-4+i*3,hy-10],'#f0c040');A.d(hx,hy-5,2,2,'#c03aff')}
  if(P.beard){const bl=P.beardL||6;A.r(hx+1,hy+8,7,bl,P.beard);A.r(hx-2,hy+9,5,bl-1,P.beard);A.d(hx+3,hy+9,4,1,drk(sk,.3));A.d(hx+3,hy+10,4,1,P.beard);A.d(hx,hy+9+bl-2,6,1,lit(P.beard,.15))}
  if(P.mous)A.d(hx+4,hy+9,4,1,P.mous);
  if(P.earring)A.d(hx-1,hy+9,1,2,P.earring)}
  if(P.mask==='gorilla'){const G=P.maskc||'#6a3a9a';A.r(hx-6,hy-2,14,15,G);A.r(hx+2,hy+4,7,8,P.face||'#3e3044');A.d(hx+3,hy+5,2,1,'#1a1418');A.d(hx+6,hy+9,3,1,'#1a1418');A.d(hx-5,hy-2,10,2,drk(G,.3));if(P.visor)A.d(hx+2,hy+3,7,2,P.visor)}
  // ---- передняя рука + предмет
  let fh;const fw=armW;
  if(P.item&&(pose==='gun'||pose==='aim')){fh=arm('f',lit(P.sleeve||top,.1),fw);item(A,P.item,fh[0]-4,fh[1]+1,P)}
  else{fh=arm('f',lit(P.sleeve||top,.1),fw);if(P.item)item(A,P.item,fh[0],fh[1],P)}
  if(P.backItem)item(A,P.backItem,back[0],back[1],P);
  if(P.bagBack)A.r(-tw-5,ty+3,6,14,P.bagBack);
})}
// персонаж: who — ключ из CH или объект; pose; o — переопределения (flip, item...)
const CH=C.CH;
Object.assign(CH,{
  m:Object.assign(CH.m,{pants:'#1a1a20',shoes:'#9a9ca2',sole:'#e8e8ec'}),
  s:{f:1,skin:'#f2cdb4',hair:'#2a1a16',style:'fem',hl:28,dress:'#ff6fb5',ruffle:1,legs:'#f2cdb4',boots:'plat',shoes:'#141418',eye:'#4a5a2a',lips:'#e05a8a'},
  a:{skin:'#e2b08a',hair:'#1e1a18',style:'short',top:'#18181c',kind:'turtle',pants:'#2a2a32',shoes:'#2a1e16',wide:1,fat:1},
  za:{skin:'#e2b08a',hair:'#1e1a18',style:'short',top:'#18181c',kind:'turtle',pants:'#2a2a32',shoes:'#2a1e16',wide:1,fat:1,zombie:1,seed:7},
  H:{f:1,skin:'#efc5a5',hair:'#8a6748',style:'bob',top:'#4a5a32',coat:'#4a5a32',pants:'#3a3a2a',shoes:'#2a1e16',k:.96,flat:1,glasses:'#6a4a2a',lens:'#e8f0ff'},
  G:{skin:'#e0a888',hair:'#c8c8c8',style:'short',mous:'#c8c8c8',top:'#1e2a3a',kind:'coat',coat:'#1e2a3a',cap:'#1e2a3a',pants:'#1e2a3a',shoes:'#141418',fat:1,belt:'#141418'},
  D:{skin:'#d8a080',hair:'#2a4a2a',style:'short',beanie:'#2a4a2a',top:'#7adf3a',belt:'#e8e8e8',pants:'#3a3a42',shoes:'#1a1a1e',stub:1},
  e:{skin:'#e9b994',hair:'#16121a',style:'quiff',top:'#ff5aa8',kind:'fur',pants:'#18181e',shoes:'#0e0e12',glasses:'#0c0a10',lens:'#2a1a3a',shades:1,shirt:'#141418'},
  val:{skin:'#eec8a8',hair:'#3a2a1a',style:'short',top:'#2a3a2a',kind:'hoodie',pants:'#3a3e4a',shoes:'#e8e8ec',headph:'#1a1a22',stub:1},
  ol:{f:1,skin:'#f6d6c0',hair:'#e8c87a',style:'fem',hl:24,top:'#f4f0e8',kind:'tee',pants:'#4a6aa8',shoes:'#f4f4f4',lips:'#d8506a',eye:'#3a6a9a'},
  pa:{skin:'#e0a888',hair:'#8a8a8a',style:'short',mous:'#8a8a8a',top:'#3a5a3a',kind:'vest',vest:'#3a4a2a',pants:'#3a3a2a',shoes:'#2a2a1a',fat:1,cap:'#4a5a3a'},
  ma:{f:1,skin:'#f0c8a8',hair:'#8a4a2a',style:'bun',top:'#c84a6a',dress:'#4a6aa8',legs:'#f0c8a8',shoes:'#4a3a2a',apron:'#f0e8d8',flat:1},
  dr:{skin:'#e0a888',hair:'#4a3a2a',style:'buzz',top:'#8a5a2a',kind:'tee',pants:'#3a4a6a',shoes:'#2a2a2a',cap:'#c8402a',stub:1,fat:1},
  ska:{skin:'#e8b490',hair:'#2a1a10',style:'buzz',top:'#e8e8ec',kind:'tank',pants:'#3a3a44',shoes:'#e8e8ec',buff:1,glove:'#c82a2a',fat:1},
  du:{skin:'#e8b898',hair:'#2a1a10',style:'short',mask:'gorilla',maskc:'#6a3a9a',top:'#6a3a9a',pants:'#4a2470',shoes:'#3e3044',fat:1,visor:'#ecb73c'},
  mg:{mask:'gorilla',maskc:'#6a3a9a',top:'#6a3a9a',pants:'#4a2470',shoes:'#3e3044',fat:1,visor:'#ecb73c',skin:'#e8b898'},
  pw:{f:1,skin:'#f0d4c4',hair:'#6a5646',style:'long',hl:16,top:'#141416',pants:'#141416',shoes:'#0e0e12',earring:'#ff2020',k:1.06},
  lx:{skin:'#f2cab4',hair:'#9a7a52',style:'curly',top:'#141418',kind:'tee',print:'#ff4fd8',pants:'#2a2a3a',shoes:'#e8e8ec'},
  bm:{skin:'#e8b494',hair:'#c82a2a',style:'mohawk',beard:'#4a3020',top:'#2a2a30',kind:'tee',apron:'#8a5a3a',pants:'#1a1a1e',fat:1},
  ak:{skin:'#deac86',hair:'#140e0a',style:'short',hair2:'#ff4fd8',top:'#3a2a6a',kind:'hoodie',pants:'#1a1a20',shoes:'#e8e8ec',fat:1,k:.94,headph:'#ff4fd8',stub:1},
  vel:{skin:'#eec6aa',hair:'#3a2a20',style:'short',beard:'#8a6448',beardL:4,glasses:'#1a1a1a',lens:'#c8d8e8',top:'#55565c',kind:'hoodie',pants:'#1e2030',shoes:'#141418'},
  sat:{f:1,skin:'#f4d2bc',hair:'#6a4430',style:'fem',hl:30,top:'#1e1e24',pants:'#1a1a22',shoes:'#0e0e12',boots:'high',lips:'#e0707e'},
  kt:{f:1,skin:'#f2cdb4',hair:'#9a4a24',style:'fem',hl:20,top:'#4e5a34',kind:'coat',pants:'#1a1a1e',shoes:'#2a1a14',boots:'high',belt:'#2a1a14'},
  r:{f:1,skin:'#f2cdb4',hair:'#c8a060',style:'bob',top:'#c81e3a',kind:'suit',shirt:'#ffffff',pants:'#1a1a22',shoes:'#141418'},
  bh:{skin:'#d8a070',hair:'#5a4a2a',style:'buzz',beard:'#5a4a2a',top:'#a88a5a',kind:'coat',belt:'#4a3a1a',pants:'#8a7a4a',shoes:'#3a2a1a',fat:1,beanie:'#a88a5a'},
  // кошачьи качки (стоят на двух лапах)
  C:{cat:'#1a1a20',skin:'#1a1a20',top:'#1e1e26',pants:'#1a1a20',shoes:'#141418',buff:1,fat:1,eye:'#c6ef4a',glove:'#1a1a20',sole:'#2a2a30'},
  M:{cat:'#e8dcc4',skin:'#e8dcc4',top:'#e0d4bc',pants:'#4a3a32',shoes:'#3a2a24',buff:1,fat:1,eye:'#4ab8ff',glove:'#4a3a32',nose:'#3a2a24',earIn:'#4a3a32',teeth:1,sole:'#5a4a40'},
});
CH.vd=Object.assign(CH.vd,{kind:'suit'});CH.st=Object.assign(CH.st,{kind:'jacket'});
function frameOf(pose,t){return pose==='walk'?Math.floor(t*8)%4:pose==='run'?Math.floor(t*12)%4:(pose==='talk'||pose==='wave')?Math.floor(t*4)%2:0}
function hero(who,x,y,t,pose,o){o=o||{};pose=pose||'stand';const base=typeof who==='string'?CH[who]:who;const P=Object.assign({},base,o);delete P.flip;delete P.rot;delete P.noShadow;
  // старые флаги пилота: beer → предмет
  if(P.beer){delete P.beer;P.item='beer';if(pose==='stand')pose='hold'}
  if(P.bag&&typeof P.bag==='string'){P.bagc=P.bag;P.item='bag';delete P.bag}
  const fr=frameOf(pose,t+(o.ph||0));if(!o.noShadow)C.shadow(x+1,y,P.fat?30:26);const s=person(P,fr,pose);
  if(o.rot){const g=C.g;g.save();g.translate(Math.round(x),Math.round(y));g.rotate(o.rot);if(o.flip)g.scale(-1,1);g.drawImage(s.cv,s.x0,s.y0);g.restore()}else C.putS(s,x,y,o.flip)}
// ---------- кот в профиль ----------
const CATS={c:{fur:'#16161c',hi:'#3a3a48',eye:'#c6ef4a'},w:{fur:'#e8dcc4',hi:'#fff6e4',pt:'#4a3a32',eye:'#4ab8ff'},y:{fur:'#e8a040',hi:'#ffd080',eye:'#5ad84a'},gold:{fur:'#e8b830',hi:'#fff0a0',eye:'#ffffff'}};
function catSpr(k,frame,pose){return M.spr('cat:'+k+':'+frame+':'+pose,A=>{const P=CATS[k]||CATS.c,F=P.fur,D=P.pt||drk(F,.2);
  const sit=pose==='sit',walk=pose==='walk'||pose==='run';const st=walk?[[-3,3],[-1,1],[3,-3],[1,-1]][frame&3]:[0,0];
  if(sit){A.e(0,-9,8,9,F);A.q([-6,-2,-12,0,-14,-3,-8,-4],F);A.r(3,-10,3,10,F);A.r(3,-2,5,2,D);
    A.q([-6,-1,-14,-1,-16,-6,-17,-10],F);A.e(5,-20,6,5.5,F);A.q([1,-24,2,-30,5,-24],F);A.q([6,-24,9,-30,10,-23],F);A.d(3,-27,1,2,'#ff8ab8');
    A.d(6,-21,3,2,P.eye);A.d(7,-21,1,2,'#0a0a0a');A.d(10,-18,1,1,'#ff8ab8');for(let i=0;i<2;i++)A.d(10,-17+i,4,1,'#c8c8c8');A.d(-5,-14,3,6,P.hi);return}
  const yb=pose==='eat'?3:0;
  A.e(-2,-12,11,5.5,F);A.d(-8,-16,10,1,P.hi);
  A.q([-12,-13,-16,-16,-19,-22,-18,-25,-16,-20,-11,-11],F);
  for(const [lx,o,c] of [[-9,st[0],drk(F,.25)],[5,st[1],drk(F,.25)],[-7,-st[0],F],[7,-st[1],F]])A.q([lx-1.5,-10,lx+1.5,-10,lx+1.5+o,0,lx-1.5+o,0],c);
  if(P.pt)for(const lx of [-7,7])A.r(lx-2,-3,4,3,D);
  A.e(10,-16+yb,5.5,5,F);A.q([6,-19+yb,7,-25+yb,10,-20+yb],F);A.q([11,-20+yb,13,-25+yb,15,-18+yb],F);A.d(8,-22+yb,1,2,'#ff8ab8');
  if(P.pt){A.e(13,-14+yb,3,3,D);A.q([11,-20+yb,13,-25+yb,15,-18+yb],D)}
  A.d(11,-17+yb,3,2,P.eye);A.d(12,-17+yb,1,2,'#0a0a0a');A.d(15,-14+yb,1,1,'#ff8ab8');A.d(14,-13+yb,4,1,'#c8c8c8');A.d(14,-12+yb,4,1,'#a8a8a8')})}
function cat(k,x,y,t,pose,o){o=o||{};const fr=pose==='walk'?Math.floor(t*10)%4:pose==='run'?Math.floor(t*14)%4:0;C.shadow(x,y,20);const s=catSpr(k,fr,pose||'stand');
  if(o.sc&&o.sc!==1){const g=C.g;g.save();g.translate(Math.round(x),Math.round(y));g.scale(o.flip?-o.sc:o.sc,o.sc);g.drawImage(s.cv,s.x0,s.y0);g.restore()}else C.putS(s,x,y,o.flip)}
// ---------- крысы ----------
function ratSpr(big,crown,fr){return M.spr('rat:'+big+':'+crown+':'+fr,A=>{const F=big?'#5e504c':'#6a5a54',k=big?2.4:1,s=fr&1?1:0;
  A.e(-2*k,-6*k,9*k,5*k,F);A.d(-8*k,-9*k,10*k,1,lit(F,.25));A.e(7*k,-7*k,4.5*k,3.5*k,F);A.q([10*k,-8*k,14*k,-6*k,10*k,-5*k],F);A.p(14*k,-6*k,'#ff8ab8');
  A.e(5*k,-10*k,2*k,2*k,'#c88a9a');A.d(8*k,-8*k,Math.max(1,k),Math.max(1,k),big?'#ff2020':'#1a0a0a');
  for(let i=0;i<14;i++)A.p(-10*k-i*1.4*k,-3*k+Math.sin(i*.5)*2,'#d890a8');
  A.r(-6*k+s,-2*k,2*k,2*k,drk(F,.2));A.r(3*k-s,-2*k,2*k,2*k,drk(F,.2));
  if(crown){A.r(3*k,-15*k,7*k,3*k,'#f0c040');for(let i=0;i<4;i++)A.q([3*k+i*2*k,-15*k,4*k+i*2*k,-15*k,3.5*k+i*2*k,-18*k],'#f0c040');A.d(6*k,-14*k,2,2,'#c03aff')}
  if(big&&crown==='q'){A.q([-12*k,-11*k,2*k,-12*k,4*k,-4*k,-14*k,-1*k],'#c8306a');for(let i=0;i<9;i++)A.d(-13*k+i*2*k,-2*k,2,2,i%2?'#ffffff':'#1a1a1a');A.d(-10*k,-11*k,12*k,1,'#ff6aa8');A.r(12*k,-16*k,2,14*k,'#f0c040');A.e(13*k,-17*k,3,3,'#c03aff')}})}
function rat(x,y,t,o){o=o||{};const s=ratSpr(!!o.big,o.crown||'',Math.floor(t*10+x)%2);C.shadow(x,y,o.big?50:16);C.putS(s,x,y,o.flip)}
// зомби-толпа: разные цвета одежды
const ZC=['#4a3a5a','#5a3a2a','#2a4a5a','#6a2a3a','#3a4a2a','#5a5a6a','#7a4a2a','#2a2a3a','#8a2a4a','#3a5a4a'];
function zombie(x,y,t,i,o){o=o||{};const P={skin:hash(i,3)<.5?'#e0b090':'#c89070',hair:['#2a1a10','#5a3a20','#8a8a8a','#c8a060','#1a1a1a'][i%5],style:['short','long','buzz','bald','fem','curly'][i%6],f:i%3===0?1:0,top:ZC[i%ZC.length],pants:ZC[(i+3)%ZC.length],shoes:'#1a1a1a',zombie:1,seed:i,kind:i%4===1?'hoodie':''};
  if(P.f&&i%2)P.dress=ZC[(i+5)%ZC.length];hero(P,x,y,t+i*.37,o.pose||(o.walk?'walk':'zombie'),{flip:o.flip,noShadow:o.noShadow,ph:i*.21})}
Object.assign(C,{person,hero,CH,cat,catSpr,rat,zombie,item,limb,SC,POSE});
})();
