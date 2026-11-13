// ================= Трассы с поворотами и перекрёстками (06.11) =================
// Все поездки на общем движке K.car (кроме вагонетки) едут не по прямой полосе, а по городу:
// маршрут — ломаная по сетке кварталов (вверх / влево / вправо), на каждом узле перекрёсток с переулками-тупиками,
// из переулков вываливаются толпы. Зомби, огонь и сложность берутся из исходной постройки миссии и переносятся на маршрут.
// Наружу: window.RT (gen, paint, at, proj), HMC.ahead / HMC.vy для помех в cars.js.
(function(){
'use strict';
if(!window.C1||!window.K56)return;
const K=K56,E=C1.engine,X=C1.X,Q=K.Q,TAU=Math.PI*2;
const S=330,RW=140,SW=14,M=230;
function hstr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const hx=c=>{c=c.replace('#','');const n=parseInt(c,16);return [n>>16&255,n>>8&255,n&255]};
const mixc=(a,b,k)=>{const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.max(0,Math.min(255,Math.round(v+(B[i]-v)*k))).toString(16).padStart(2,'0')).join('')};
const lt=(c,k)=>mixc(c,'#ffffff',k),dk=(c,k)=>mixc(c,'#000000',k);
// ---------- темы ----------
const TH={
 city:{r1:'#34343a',r2:'#2c2c32',r3:'#3c3c44',sw:'#5a5a62',sw2:'#4e4e56',curb:'#9a9aa2',line:'#e8e8e0',ground:'#2a262e',roofs:['#5a5a6a','#6a5a5a','#4a5a6a','#5e5648','#3e4450','#6a6258','#4a4248'],win:1},
 spb:{r1:'#36363c',r2:'#2e2e34',r3:'#3e3e46',sw:'#6a6a70',sw2:'#5c5c62',curb:'#a8a8b0',line:'#f0f0e8',ground:'#2a262e',roofs:['#4a5a58','#6a3a32','#5a5a62','#3a4a42','#7a4a3a','#4e4a5a'],water:1},
 ekb:{r1:'#34343a',r2:'#2a2a30',r3:'#3a3a40',sw:'#54545c',sw2:'#4a4a52',curb:'#c8c8c0',line:'#e8e8e0',ground:'#24282a',roofs:['#5a5a6a','#6a5a5a','#4a5a6a','#585060','#3e4a50']},
 italy:{r1:'#4e4e54',r2:'#44444a',r3:'#5a5a60',sw:'#d8c49a',sw2:'#c8b48a',curb:'#f0e8d8',line:'#f4f4f4',ground:'#6a9a44',roofs:['#c05a34','#d07040','#b84a2a','#c8683a','#a84a30'],italy:1},
 forest:{r1:'#34322c',r2:'#2c2a24',r3:'#3a3830',sw:'#4a4a3a',sw2:'#424232',curb:'#c8c890',line:'#e8e8c8',ground:'#24402a',trees:['#1e4a24','#2a5a2a','#2e6a34','#245a2a'],forest:1},
 birch:{r1:'#34343a',r2:'#2a2a30',r3:'#3a3a40',sw:'#4a4a42',sw2:'#40403a',curb:'#c8c8c0',line:'#e8e8e0',ground:'#24402a',trees:['#6a8a3a','#b89a30','#5a7a32'],forest:1,birch:1},
 field:{r1:'#3a3830',r2:'#322f28',r3:'#424036',sw:'#4a5a30',sw2:'#405028',curb:'#c8c890',line:'#e8e8c8',ground:'#3a5a28',trees:['#2a5a2a','#3a6a2a'],forest:1,field:1},
};
// миссия → зоны по доле пути (0 — старт, 1 — финиш)
const SPEC={
 drive8:{z:[[.45,'birch'],[1,'ekb']],len:3000},
 drive10:{z:[[1,'spb']],len:2700},
 cabrio5:{z:[[1,'italy']],len:3000},
 x6road:{z:[[.42,'city'],[1,'forest']],len:3100},
 egor4:{z:[[1,'spb']],len:3000},
 buh7:{z:[[.3,'city'],[1,'field']],len:2900},
 drive:{z:[[.55,'city'],[1,'spb']],len:3300},
 so_road_gas:{z:[[1,'city']],len:2200},
 so_road_vape:{z:[[1,'city']],len:2600},
 so_road_lenta:{z:[[.5,'city'],[1,'field']],len:2900},
 so_road_dns:{z:[[.6,'city'],[1,'field']],len:3100},
 so_road_bunk:{z:[[.3,'field'],[1,'forest']],len:3200},
};
const zoneAt=(sp,f)=>{for(const [k,n] of sp.z)if(f<=k)return n;return sp.z[sp.z.length-1][1]};
// ---------- генерация маршрута ----------
function gen(id,target){let seed=hstr('rt'+id);const r=n=>{seed=(seed*1103515245+12345)&0x7fffffff;return (seed>>>12)%n};
  const NI=4,JMAX=5;let best=null;
  for(let tries=0;tries<40;tries++){let i=1+r(2),j=0,dir='N';const P=[[i,j]];let len=0,lastH=0;
    while(j<JMAX){if(dir==='N'){const k=Math.min(JMAX-j,1+r(2));j+=k;len+=k*S;P.push([i,j]);if(j>=JMAX)break;
        const can=[];if(i>0&&lastH!==1)can.push(-1);if(i<NI-1&&lastH!==-1)can.push(1);if(!can.length&&i>0)can.push(-1);if(!can.length&&i<NI-1)can.push(1);
        if(can.length&&r(10)<8){dir='H';lastH=can[r(can.length)]}}
      else{const room=lastH>0?NI-1-i:i;const k=Math.max(1,Math.min(room,1+r(3)));i+=lastH*k;len+=k*S;P.push([i,j]);dir='N'}}
    const turns=P.length-2,sc=-Math.abs(len-target)/S+turns*.6;if(!best||sc>best.sc)best={P,len,sc}}
  const W=(NI-1)*S+2*M,H=JMAX*S+2*M;
  const pts=best.P.map(([i,j])=>[M+i*S,H-M-j*S]);
  // начало чуть ниже первого узла, финиш чуть выше последнего
  pts[0]=[pts[0][0],H-60];pts[pts.length-1]=[pts[pts.length-1][0],80];
  return mkPath(pts,W,H,best.P)}
function mkPath(pts,W,H,P){const seg=[];let s=0;for(let k=0;k<pts.length-1;k++){const [x0,y0]=pts[k],[x1,y1]=pts[k+1],l=Math.hypot(x1-x0,y1-y0);seg.push({x0,y0,x1,y1,l,s0:s,dx:(x1-x0)/l,dy:(y1-y0)/l});s+=l}
  return {pts,seg,L:s,W,H,P}}
function at(R,s){s=Math.max(0,Math.min(R.L,s));for(const g of R.seg)if(s<=g.s0+g.l)return {x:g.x0+g.dx*(s-g.s0),y:g.y0+g.dy*(s-g.s0),dx:g.dx,dy:g.dy};const g=R.seg[R.seg.length-1];return {x:g.x1,y:g.y1,dx:g.dx,dy:g.dy}}
function proj(R,x,y,s0){let best=null;for(const g of R.seg){if(s0!=null&&(g.s0+g.l<s0-420||g.s0>s0+520))continue;let t=((x-g.x0)*g.dx+(y-g.y0)*g.dy);t=Math.max(0,Math.min(g.l,t));const px=g.x0+g.dx*t,py=g.y0+g.dy*t,d=Math.hypot(x-px,y-py);if(!best||d<best.d)best={d,s:g.s0+t}}return best?best.s:(s0||0)}
// ---------- рисование ----------
function paint(L,R,sp,id){const g=L.bx,B=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};let seed=hstr('rp'+id);const r=n=>{seed=(seed*1103515245+12345)&0x7fffffff;return (seed>>>12)%n},rf=()=>r(10000)/10000;
  const W=R.W,H=R.H,fr=y=>1-(y-80)/(H-140),thAt=y=>TH[zoneAt(sp,Math.max(0,Math.min(1,fr(y))))];
  E.gfill(0,0,W,H,1);
  // переулки-тупики на узлах
  const onPath=new Set(R.P.map(([i,j])=>i+','+j));const stubs=[];
  R.P.forEach(([i,j],k)=>{if(k===0||k===R.P.length-1)return;const used=[];const a=R.P[k-1],b=R.P[k+1];used.push([a[0]-i,a[1]-j].map(Math.sign).join(','),[b[0]-i,b[1]-j].map(Math.sign).join(','));
    for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){if(used.includes(di+','+dj))continue;if(dj<0&&j===0)continue;if(r(10)<3)continue;const n=(i+di)+','+(j+dj);const len=onPath.has(n)?S*.38:S*.62;
      const x=M+i*S,y=H-M-j*S;stubs.push({x0:x,y0:y,x1:x+di*len,y1:y-dj*len,dx:di,dy:-dj,node:k})}});
  // промежуточные узлы прямых отрезков — тоже перекрёстки
  for(const s of R.seg){const n=Math.round(s.l/S);for(let k=1;k<n;k++){const x=s.x0+s.dx*S*k,y=s.y0+s.dy*S*k;for(const sg of [1,-1]){if(r(10)<4)continue;const nx=s.dy!==0?sg:0,ny=s.dx!==0?sg:0;
      const ii=Math.round((x-M)/S)+nx,jj=Math.round((H-M-y)/S)-ny;const len=onPath.has(ii+','+jj)?S*.38:S*.62;if(x+nx*len<40||x+nx*len>W-40||y+ny*len<40||y+ny*len>H-40)continue;stubs.push({x0:x,y0:y,x1:x+nx*len,y1:y+ny*len,dx:nx,dy:ny})}}}
  R.stubs=stubs;
  const rect=(a,hw)=>{const x0=Math.min(a.x0,a.x1)-hw,x1=Math.max(a.x0,a.x1)+hw,y0=Math.min(a.y0,a.y1)-hw,y1=Math.max(a.y0,a.y1)+hw;return [x0,y0,x1,y1]};
  const all=R.seg.concat(stubs);
  // фон (кварталы) — по зонам
  for(let y=0;y<H;y+=4)for(let x=0;x<W;x+=4){const T=thAt(y),h=hash(x>>2,y>>2);B(x,y,4,4,T.forest?(h<.15?dk(T.ground,.15):h>.9?lt(T.ground,.08):T.ground):(h<.12?lt(T.ground,.06):T.ground))}
  // тротуары, асфальт
  for(const a of all){const [x0,y0,x1,y1]=rect(a,RW/2+SW);E.gfill(x0,y0,x1,y1,0);for(let y=y0;y<y1;y+=6)for(let x=x0;x<x1;x+=6){const T=thAt(y);B(x,y,6,6,((x+y)/6)%2?T.sw:T.sw2)}}
  for(const a of all){const [x0,y0,x1,y1]=rect(a,RW/2);for(let y=y0;y<y1;y+=4)for(let x=x0;x<x1;x+=4){const T=thAt(y),h=hash(x>>2,y>>2);B(x,y,4,4,h<.1?T.r3:h>.93?T.r2:T.r1)}}
  // бордюры
  for(const a of all){const [x0,y0,x1,y1]=rect(a,RW/2);const T=thAt((y0+y1)/2);if(a.dx===0){B(x0-1,y0,2,y1-y0,T.curb);B(x1-1,y0,2,y1-y0,T.curb)}else{B(x0,y0-1,x1-x0,2,T.curb);B(x0,y1-1,x1-x0,2,T.curb)}}
  // заново асфальт на перекрёстках (бордюры не перечёркивают проезд)
  const nodes=[];R.P.forEach(([i,j])=>nodes.push([M+i*S,H-M-j*S]));for(const s of R.seg){const n=Math.round(s.l/S);for(let k=1;k<n;k++)nodes.push([s.x0+s.dx*S*k,s.y0+s.dy*S*k])}
  for(const [nx,ny] of nodes){for(let y=ny-RW/2;y<ny+RW/2;y+=4)for(let x=nx-RW/2;x<nx+RW/2;x+=4){const T=thAt(y),h=hash(x>>2,y>>2);B(x,y,4,4,h<.1?T.r3:h>.93?T.r2:T.r1)}}
  const nearNode=(x,y,d)=>nodes.some(([nx,ny])=>Math.abs(x-nx)<d&&Math.abs(y-ny)<d);
  // разметка: осевая пунктиром, зебры у перекрёстков
  for(const a of all){const T=thAt((a.y0+a.y1)/2);const L_=Math.hypot(a.x1-a.x0,a.y1-a.y0);for(let t=0;t<L_;t+=40){const x=a.x0+a.dx*t,y=a.y0+a.dy*t;if(nearNode(x,y,RW/2+14))continue;if(a.dx===0)B(x-1,y,2,20*Math.sign(a.dy||1),T.line);else B(x,y-1,20*Math.sign(a.dx||1),2,T.line)}}
  for(const [nx,ny] of nodes){const T=thAt(ny);for(let k=-RW/2+10;k<RW/2-10;k+=12){for(const sg of [-1,1]){const o=sg*(RW/2+6);
      if(gridOpen(nx+o,ny,4)&&gridOpen(nx+o*1.6,ny,4)){B(nx+o-4,ny+k,8,7,'rgba(240,240,232,.75)')}
      if(gridOpen(nx,ny+o,4)&&gridOpen(nx,ny+o*1.6,4)){B(nx+k,ny+o-4,7,8,'rgba(240,240,232,.75)')}}}}
  // стрелки поворотов на асфальте
  for(let k=1;k<R.seg.length;k++){const a=R.seg[k-1],b=R.seg[k];const x=a.x1-a.dx*(RW/2+90),y=a.y1-a.dy*(RW/2+90);for(const off of [-RW/4,RW/4])arrow(g,x+(-a.dy)*off*-1,y+a.dx*off*-1,a,b)}
  // кварталы: крыши / лес / вода
  const lot=(x,y,w,h)=>{const cx=x+w/2,cy=y+h/2,T=thAt(cy);
    if(T.forest){if(T.field&&rf()<.5){for(let yy=y+4;yy<y+h-4;yy+=6)B(x+4,yy,w-8,3,dk(T.ground,.18));return}
      const n=Math.round(w*h/260);for(let i=0;i<n;i++){const tx=x+4+rf()*(w-8),ty=y+4+rf()*(h-8),rr=7+rf()*7;crown(g,tx,ty,rr,T.trees[r(T.trees.length)],T.birch)}return}
    if(T.water&&rf()<.22){B(x,y,w,h,'#8a8a90');B(x+3,y+3,w-6,h-6,'#24486a');for(let i=0;i<w*h/90;i++){B(x+5+rf()*(w-14),y+5+rf()*(h-10),8,1,'#4a7aa8')}return}
    if(T.italy&&rf()<.38){for(let i=0;i<Math.round(w*h/220);i++){const tx=x+5+rf()*(w-10),ty=y+6+rf()*(h-12);g.fillStyle='rgba(4,8,4,.35)';g.beginPath();g.ellipse(tx+2,ty+3,3.4,7,0,0,TAU);g.fill();g.fillStyle='#0c140c';g.beginPath();g.ellipse(tx,ty,3.6,7.4,0,0,TAU);g.fill();g.fillStyle='#244a2a';g.beginPath();g.ellipse(tx,ty,3,6.8,0,0,TAU);g.fill();g.fillStyle='#3a6a3a';g.fillRect(tx-1.4,ty-4,1.2,5)}return}
    const c=T.roofs[r(T.roofs.length)];B(x+2,y+3,w,h,'rgba(6,2,14,.5)');B(x-.7,y-.7,w+1.4,h+1.4,'#120a1a');B(x,y,w,h,c);B(x,y,w,2,lt(c,.25));B(x,y,2,h,lt(c,.15));B(x,y+h-2,w,2,dk(c,.3));B(x+w-2,y,2,h,dk(c,.25));
    B(x+4,y+4,w-8,h-8,dk(c,.08));
    if(T.italy){for(let yy=y+5;yy<y+h-4;yy+=4)B(x+4,yy,w-8,1,dk(c,.2))}
    else{const n=1+r(4);for(let i=0;i<n;i++){const ax=x+6+rf()*(w-18),ay=y+6+rf()*(h-16);B(ax-.7,ay-.7,9.4,7.4,'#120a1a');B(ax,ay,8,6,'#c8c4d0');B(ax+1,ay+1,6,1,'#8a86a0');B(ax+1,ay+3,6,1,'#8a86a0')}
      if(rf()<.35){const vx=x+w-14,vy=y+6;B(vx,vy,6,6,'#3a3a44');B(vx+1,vy+1,4,4,'#14121c')}
      if(rf()<.12){for(let i=0;i<4;i++)B(cx-6+i*3,cy-2-i,3,4,i%2?'#ff7a20':'#ffd040');L.glow.push&&L.glow.push([cx,cy,26,'rgba(255,120,40,A)',.3,7])}
      if(T.win&&rf()<.3){const nc=['#ff2e97','#22e5d4','#7dff3a','#ffe23a'][r(4)];B(x+4,y+h-6,Math.min(30,w-8),2,nc)}}};
  const free=(x0,y0,x1,y1)=>{for(let y=y0;y<y1;y+=4)for(let x=x0;x<x1;x+=4)if(E.gAt(x,y)!==1)return false;return true};
  for(let y=6;y<H-6;y+=84)for(let x=6;x<W-6;x+=84){const w=Math.min(78,W-6-x),h=Math.min(78,H-6-y);if(w<20||h<20)continue;
    if(free(x,y,x+w,y+h)){if(r(4)===0&&!thAt(y+h/2).forest){lot(x,y,w,36);lot(x,y+42,w,h-42)}else lot(x,y,w,h);continue}
    for(const [ox,oy] of [[0,0],[42,0],[0,42],[42,42]]){const xx=x+ox,yy=y+oy,ww=Math.min(36,w-ox),hh=Math.min(36,h-oy);if(ww>14&&hh>14&&free(xx,yy,xx+ww,yy+hh))lot(xx,yy,ww,hh)}}
  // деревья вдоль обочин в лесу/поле
  for(const a of R.seg){const L_=a.l;for(let t=20;t<L_;t+=26){const x=a.x0+a.dx*t,y=a.y0+a.dy*t,T=thAt(y);if(!T.forest)continue;for(const sg of [-1,1]){const o=sg*(RW/2+SW+10+rf()*8),px=x+(-a.dy)*o,py=y+a.dx*o;if(E.gAt(px,py)===1&&!nearNode(px,py,RW/2+30))crown(g,px,py,8+rf()*6,T.trees[r(T.trees.length)],T.birch)}}}
  // тупики: бетонные блоки + ржавая машина
  for(const s of stubs){const ex=s.x1-s.dx*10,ey=s.y1-s.dy*10;const vert=s.dx!==0;for(let k=-RW/2;k<RW/2;k+=13){const bx=vert?ex-5:ex+k,by=vert?ey+k:ey-5;B(bx-.7,by-.7,11.4,11.4,'#120a1a');B(bx,by,10,10,'#8a8a88');B(bx,by,10,2,'#b8b8b4');if(((k/13)|0)%2)B(bx+2,by+4,6,2,'#e8b020')}
    const [x0,y0,x1,y1]=rect({x0:ex,y0:ey,x1:s.x1,y1:s.y1},RW/2+SW);E.gfill(x0,y0,x1,y1,1);
    const [a0,b0,a1,b1]=vert?[ex-8,ey-RW/2-SW,ex+8,ey+RW/2+SW]:[ex-RW/2-SW,ey-8,ex+RW/2+SW,ey+8];E.gfill(a0,b0,a1,b1,1)}
  // фонари
  for(const a of R.seg.concat(stubs)){const L_=Math.hypot(a.x1-a.x0,a.y1-a.y0);for(let t=60;t<L_;t+=130){const x=a.x0+a.dx*t,y=a.y0+a.dy*t;const sg=(t/130|0)%2?1:-1,o=sg*(RW/2+7),px=x+(-a.dy)*o,py=y+a.dx*o;
      if(nearNode(px,py,RW/2))continue;B(px-2,py-2,4,4,'#2a2a30');B(px-1,py-1,2,2,'#ffe8a0');L.lights.push([px,py,64,.75]);L.glow.push&&L.glow.push([px,py,20,'rgba(255,220,150,A)',.25,0])}}
  // старт и финиш: подписи и клетчатая линия
  const e=R.pts[R.pts.length-1],s0=R.pts[0];
  for(let x=e[0]-RW/2,k=0;x<e[0]+RW/2;x+=8,k++){B(x,e[1]+40,8,6,k%2?'#f0f0f0':'#141418');B(x,e[1]+46,8,6,k%2?'#141418':'#f0f0f0')}
  E.gfill(0,0,W,e[1]+20,1);E.gfill(e[0]-RW/2,e[1]-10,e[0]+RW/2,e[1]+20,1);B(e[0]-RW/2-SW,e[1]-14,RW+2*SW,34,'#1a1620');B(e[0]-RW/2-SW,e[1]+16,RW+2*SW,3,'#ffd23a');
  return {s0,e}}
function gridOpen(x,y,r){return E.gAt(x,y)===0}
function crown(g,x,y,rr,c,birch){g.fillStyle='rgba(4,8,4,.4)';g.beginPath();g.arc(x+3,y+3,rr,0,TAU);g.fill();g.fillStyle='#0c140c';g.beginPath();g.arc(x,y,rr+.7,0,TAU);g.fill();g.fillStyle=c;g.beginPath();g.arc(x,y,rr,0,TAU);g.fill();
  g.fillStyle=lt(c,.22);g.beginPath();g.arc(x-rr*.3,y-rr*.3,rr*.5,0,TAU);g.fill();g.fillStyle=dk(c,.2);for(let i=0;i<5;i++){const a=i*1.3;g.fillRect(x+Math.cos(a)*rr*.55,y+Math.sin(a)*rr*.55,1.4,1.4)}if(birch){g.fillStyle='#e8e8e0';g.fillRect(x-.7,y-.7,1.4,1.4)}}
function arrow(g,x,y,a,b){g.save();g.translate(x,y);g.rotate(Math.atan2(a.dy,a.dx));g.globalAlpha=.8;g.fillStyle='#f0f0e8';
  // ствол вперёд и загиб в сторону поворота
  const turn=Math.sign(a.dx*b.dy-a.dy*b.dx);g.fillRect(-26,-2.5,24,5);g.fillRect(-5,turn>0?0:-14,5,14);g.beginPath();g.moveTo(-9,turn>0?12:-12);g.lineTo(4,turn>0?12:-12);g.lineTo(-2.5,turn>0?20:-20);g.fill();g.restore()}
function transfer(id,R,sp,Lt,Lb,P){const {sx0,sy0,fy0,hw0,zs,route}=P;const outF=[];
    Lb.dark=Lt.dark;Lb.tint=Lt.tint;Lb.sunTint=Lt.sunTint;
    paint(Lb,R,sp,id);
    const cx0=sx0,span=Math.max(1,sy0-fy0);
    const map=(x,y)=>{const f=(sy0-y)/span;const s=Math.max(.05,Math.min(.97,f))*R.L,p=at(R,s),l=Math.max(-1,Math.min(1,(x-cx0)/hw0))*(RW/2-14);return [p.x-p.dy*l,p.y+p.dx*l]};
    const keep=Math.min(1,R.L/span*1.1);let kz=0;
    for(const z of zs){const f=(sy0-z.y)/span;if(f<.07||f>1.02)continue;kz+=keep;if(kz<1)continue;kz-=1;const [x,y]=map(z.x,z.y);if(E.gAt(x,y)===1||Math.hypot(x-P.startX,y-P.startY)<260)continue;z.x=x;z.y=y;if(z.hx!=null){z.hx=x;z.hy=y}Lb.zs.push(z)}
    for(const f of P.fires){const [x,y]=map(f[0],f[1]);outF.push([x,y])}
    let s=hstr('ob'+id);const rr=()=>{s=(s*16807)%2147483647;return s/2147483647};
    for(let t=260;t<R.L-200;t+=150+rr()*110){const p=at(R,t);const near=R.pts.some(q=>Math.abs(q[0]-p.x)<RW/2+40&&Math.abs(q[1]-p.y)<RW/2+40);if(near)continue;
      const vert=p.dx===0,l=(rr()<.5?-1:1)*(30+rr()*(RW/2-60)),x=p.x-p.dy*l,y=p.y+p.dx*l;X.carTop(Math.round(x-(vert?8:14)),Math.round(y-(vert?14:8)),['#e8e8e8','#3a8ae8','#2a2a2a','#c8302a','#e8c040','#5a3a6a','#6a8a4a'][(rr()*7)|0],vert);E.gfill(x-(vert?8:14),y-(vert?14:8),x+(vert?8:14),y+(vert?14:8),2);if(rr()<.25)outF.push([x,y])}
    const nm=(route||'').split('→').map(t=>t.trim()).filter(Boolean);const g=Lb.bx;g.font='bold 8px monospace';g.textAlign='center';
    const e=R.pts[R.pts.length-1];if(nm.length){g.fillStyle='#120a1a';g.fillText(nm[nm.length-1],e[0]+1,e[1]+10);g.fillStyle='#ffd23a';g.fillText(nm[nm.length-1],e[0],e[1]+9);g.fillStyle='#fff';g.fillText(nm[0],R.pts[0][0],R.pts[0][1]-4)}g.textAlign='left';
    R.hordes=R.stubs.map(st=>({x:st.x1-st.dx*28,y:st.y1-st.dy*28,s:proj(R,st.x0,st.y0),done:false}));
    return outF}
function hordes(R,c){for(const h of R.hordes||[]){if(h.done||c._s<h.s-280||c._s>h.s+40)continue;h.done=true;const n=4+((h.x*7+h.y)%3|0);for(let i=0;i<n;i++)E.addZ(i%3?'normal':'fast',h.x+(i%3-1)*14,h.y+((i/3)|0)*12,{st:'chase',hp:60,max:60});X.sfx('groan',1.2)}}
// для своих движков (гл.2): перестроить уже собранную прямую полосу в маршрут
function convert(id,Lt,P){const sp=SPEC[id];const R=gen(id,sp.len);const Lb=E.mkLevel(id,R.W,R.H);Lb.noCull=1;Lb.glow=Lb.glow||[];
  const fires=transfer(id,R,sp,Lt,Lb,Object.assign({zs:Lt.zs.slice(),startX:R.pts[0][0],startY:R.pts[0][1]-30},P));if(X.buildNav)try{X.buildNav()}catch(e){}return {L:Lb,R,fires}}
// ---------- подмена постройки K.car ----------
const ROUTE=window.RT={gen,at,proj,paint,SPEC,TH,convert,hordes};
const _car=K.car;
K.car=function(ch,o){const sp=SPEC[o.id];if(!sp||o._rt||C1.noRoutes)return _car(ch,o);
  o=Object.assign({},o);o._rt=1;const R=gen(o.id,sp.len);
  const w0=o.w,h0=o.h,sx0=o.startX,sy0=o.startY,b0=o.build,fy0=200;o.h0=h0;o.w0=w0;o.startY0=sy0;
  o.w=R.W;o.h=R.H;o.startX=R.pts[0][0];o.startY=R.pts[0][1]-30;o.startA=-Math.PI/2;o.rt=R;
  o.build=function(Lb){
    // 1) исходная постройка на прямой полосе — чтобы взять состав зомби, огонь и затемнение
    const Lt=E.mkLevel(o.id+'~',w0,h0);Q.fires=[];Q.crowns=[];let zs=[],fires=[];
    try{b0.call(this,Lt);zs=Lt.zs.slice();fires=(Q.fires||[]).slice()}catch(e){console.warn('rt build0',e)}
    E.L=Lb;Q.crowns=[];Q.trees=[];
    Q.fires=transfer(o.id,R,sp,Lt,Lb,{sx0,sy0,fy0,hw0:(o.x1&&o.x0)?(o.x1-o.x0)/2:136,zs,fires,route:o.route,startX:o.startX,startY:o.startY});
    if(X.buildNav)try{X.buildNav()}catch(e){}};
  const t0=o.tick;o.tick=function(c,dt){c._s=proj(R,c.x,c.y,c._s);if(t0)t0.call(this,c,dt);
    hordes(R,c)};
  o.prog=c=>(c._s||0)/R.L;o.fin=c=>(c._s||0)>R.L-70&&c.y<R.pts[R.pts.length-1][1]+80;
  return _car(ch,o)};
// подсказка-стрелка: куда ехать дальше
const _r=render;
render=function(){_r();try{hint()}catch(e){}};
function hint(){let c=null,R=null;if(C1.mode==='carK'){c=K.carState&&K.carState();const o=window.HMC&&HMC.cur&&HMC.cur();R=o&&o.rt}else if(C1.mode==='car'&&window.C2&&C2.car){c=C2.car();R=c&&c.R}if(!c||!R||state!=='play'||c.end)return;
  const p=at(R,(c._s||0)+170);const a=Math.atan2(p.y-c.y,p.x-c.x);const sx=c.x-camX,sy=c.y-camY;const k=ui.width/W;u.setTransform(k,0,0,k,0,0);
  const d=26+Math.sin(tm*6)*2,x=sx+Math.cos(a)*d,y=sy+Math.sin(a)*d;u.save();u.translate(x,y);u.rotate(a);u.globalAlpha=.85;u.fillStyle='#120a1a';u.beginPath();u.moveTo(7,0);u.lineTo(-4,-5.5);u.lineTo(-1.5,0);u.lineTo(-4,5.5);u.closePath();u.fill();
  u.fillStyle='#ffd23a';u.beginPath();u.moveTo(5.6,0);u.lineTo(-3,-4.2);u.lineTo(-.8,0);u.lineTo(-3,4.2);u.closePath();u.fill();u.restore()}
// помехи и чекпоинты в cars.js: «впереди по маршруту» и «виртуальный y» прямой полосы
window.RTH={ahead(o,c,d){if(o&&o.rt){const p=at(o.rt,(c._s||0)+d);return {x:p.x,y:p.y,dx:p.dx,dy:p.dy}}return {x:c.x,y:c.y-d,dx:0,dy:-1}},
  vy(o,c){if(o&&o.rt){const f=(c._s||0)/o.rt.L;return o.startY0!=null?o.startY0-f*(o.startY0-200):o.h0-140-f*(o.h0-340)}return c.y},
  along(o,fr,fn){if(o&&o.rt){const p=at(o.rt,fr*o.rt.L);return fn(p)}return null}};
})();
