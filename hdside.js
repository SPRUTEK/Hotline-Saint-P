// hdside.js — герои в кат-сценах в новом пикселе (03.11).
// Каждая фигурка «сбоку» (Микроб, Шмакодявка, Анис, Валера, Ханжа…) рисуется во внутренний холст,
// увеличивается вдвое с сглаживанием лесенок (Scale2x), получает объём (свет сверху, тень снизу)
// и тонкий тёмный контур, как у новых иконок и меню, — и только потом ложится в кадр полупиксельной сеткой.
// Подключается до level1.js: уровни оборачивают свои функции через HDS.wrap(fn).
(function(){
'use strict';
const BW=72,BH=72,OX=28,OY=60;           // окно вокруг ног фигурки: x-28..x+44, y-60..y+12
const oc=document.createElement('canvas');oc.width=BW;oc.height=BH;const o=oc.getContext('2d',{willReadFrequently:true});
const hc=document.createElement('canvas');hc.width=BW*2;hc.height=BH*2;const h=hc.getContext('2d');
const out=h.createImageData(BW*2,BH*2);
let depth=0;
const FWD=['fillRect','clearRect','beginPath','moveTo','lineTo','closePath','arc','ellipse','rect','fill','stroke','translate','rotate','scale','drawImage','fillText','strokeRect','quadraticCurveTo','bezierCurveTo'];
const PROPS=['fillStyle','strokeStyle','lineWidth','globalAlpha','globalCompositeOperation','font','textAlign','lineCap','lineJoin'];
function sync(){for(const p of PROPS){try{if(o[p]!==ctx[p])o[p]=ctx[p]}catch(e){}}}
function hook(){for(const m of FWD){ctx[m]=function(){sync();return o[m].apply(o,arguments)}}
  ctx.save=function(){o.save();CanvasRenderingContext2D.prototype.save.call(ctx)};ctx.restore=function(){o.restore();CanvasRenderingContext2D.prototype.restore.call(ctx)};
  // радиальные свечения и т.п. создаются от настоящего ctx — подходят и для o
}
function unhook(){for(const m of FWD)delete ctx[m];delete ctx.save;delete ctx.restore}
const OUT=[10,9,13];
function post(){const src=o.getImageData(0,0,BW,BH).data,d=out.data,W2=BW*2;d.fill(0);
  const A=(x,y)=>(x<0||y<0||x>=BW||y>=BH)?-1:(y*BW+x)*4;
  const same=(i,j)=>i>=0&&j>=0&&src[i]===src[j]&&src[i+1]===src[j+1]&&src[i+2]===src[j+2]&&src[i+3]===src[j+3];
  // Scale2x (EPX)
  for(let y=0;y<BH;y++)for(let x=0;x<BW;x++){const P=A(x,y);if(src[P+3]===0)continue;const a=A(x,y-1),b=A(x+1,y),c=A(x-1,y),dd=A(x,y+1);
    let e0=P,e1=P,e2=P,e3=P;
    if(!same(c,b)&&!same(a,dd)){if(same(c,a))e0=c;if(same(a,b))e1=b;if(same(dd,c))e2=c;if(same(b,dd))e3=b}
    const put=(k,sx,sy)=>{if(k<0||src[k+3]===0)k=P;const q=((y*2+sy)*W2+(x*2+sx))*4;d[q]=src[k];d[q+1]=src[k+1];d[q+2]=src[k+2];d[q+3]=src[k+3]};
    put(e0,0,0);put(e1,1,0);put(e2,0,1);put(e3,1,1)}
  // объём: верхний край светлее, нижний темнее (только непрозрачные)
  const H2=BH*2,solid=q=>q>=0&&d[q+3]>=200,at=(x,y)=>(x<0||y<0||x>=W2||y>=H2)?-1:(y*W2+x)*4;
  const shade=new Int8Array(W2*H2);
  for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const q=at(x,y);if(!solid(q))continue;const up=at(x,y-1),dn=at(x,y+1);
    const diff=k=>k<0||d[k+3]<200||Math.abs(d[k]-d[q])+Math.abs(d[k+1]-d[q+1])+Math.abs(d[k+2]-d[q+2])>24;
    if(diff(up))shade[y*W2+x]=1;else if(diff(dn))shade[y*W2+x]=-1}
  for(let i=0;i<shade.length;i++){if(!shade[i])continue;const q=i*4;if(shade[i]>0){d[q]=d[q]+(255-d[q])*.22;d[q+1]=d[q+1]+(255-d[q+1])*.22;d[q+2]=d[q+2]+(255-d[q+2])*.22}else{d[q]*=.72;d[q+1]*=.72;d[q+2]*=.72}}
  // контур
  const edge=[];for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const q=at(x,y);if(d[q+3]>0)continue;if(solid(at(x+1,y))||solid(at(x-1,y))||solid(at(x,y+1))||solid(at(x,y-1)))edge.push(q)}
  for(const q of edge){d[q]=OUT[0];d[q+1]=OUT[1];d[q+2]=OUT[2];d[q+3]=235}
  h.putImageData(out,0,0)}
function wrap(fn,box,maxS){if(!fn||fn._hd)return fn;const bw=box&&box[0]||OX,bh=box&&box[1]||OY;
  // 04.11: крупная фигура (гигантский кот в катсцене) не влезает в окно 72×72 — рисуем напрямую, без обрезки головы
  const w=function(x,y){if(depth||!HDS.on||typeof x!=='number'||typeof y!=='number'||(maxS&&typeof arguments[3]==='number'&&arguments[3]>maxS))return fn.apply(this,arguments);
    const bx=Math.round(x)-bw,by=Math.round(y)-bh;depth++;o.setTransform(1,0,0,1,0,0);o.clearRect(0,0,BW,BH);o.setTransform(1,0,0,1,-bx,-by);o.globalAlpha=1;o.globalCompositeOperation='source-over';
    hook();let r;try{r=fn.apply(this,arguments)}finally{unhook();depth--}
    try{post();const sm=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=false;ctx.drawImage(hc,bx,by,BW,BH);ctx.imageSmoothingEnabled=sm}catch(e){}
    return r};
  w._hd=true;w._raw=fn;return w}
const HDS={on:true,wrap};window.HDS=HDS;

// ---------- Микроб и Шмакодявка: заново нарисованы в полупиксель (вид сбоку) ----------
const SPR={};
function spr(k,fn){if(SPR[k])return SPR[k];const M=window.MART;if(!M)return null;return SPR[k]=M.build(fn)}
function putS(s,x,y){const sm=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=false;ctx.drawImage(s.cv,Math.round(x)+s.x0/2,Math.round(y)+s.y0/2,s.w/2,s.h/2);ctx.imageSmoothingEnabled=sm}
function mikArt(a,pose,ph){const J='#8f9298',JD='#686b72',SH='#f0f0f0',SK='#e8b898',SD='#c99478',HR='#3d2b20',HL='#5a4232',JE='#1d1e26',SHO='#9a9ca2';
  const b=pose==='ride'?-1:ph,f=pose==='ride'?1:-ph;
  a.q([-6,-23,-1,-23,-1+b*3,-4,-6+b*3,-4],'#17181f');a.q([0,-23,5,-23,5+f*3,-4,0+f*3,-4],JE);a.d(2+f,-20,1,14,'#2a2c38');
  a.r(-7+b*3,-4,8,4,'#7a7c82');a.r(-1+f*3,-4,9,4,SHO);a.d(-7+b*3,-1,8,1,'#4a4a52');a.d(-1+f*3,-1,9,1,'#4a4a52');a.d(1+f*3,-4,4,1,'#c8c8d0');
  a.q([-9,-45,5,-45,7,-23,-9,-23],J);a.d(-9,-44,2,21,JD);a.d(4,-44,3,21,SH);a.d(3,-44,1,21,JD);a.d(1,-46,5,2,JD);a.d(-6,-31,7,1,JD);a.d(-9,-24,16,1,JD);
  if(pose==='ride'){a.q([-2,-43,4,-43,14,-36,12,-32,1,-37],J);a.d(-2,-43,1,5,JD);a.r(12,-37,4,4,SK)}
  else{const sw=-ph*2;a.q([-3,-43,3,-43,3+sw,-26,-3+sw,-26],J);a.d(-3,-43,1,17,JD);a.d(-3+sw,-27,6,1,JD);a.r(-2+sw,-26,5,4,SK)}
  a.r(-1,-48,5,4,SK);a.d(-1,-48,2,4,SD);
  a.q([-6,-61,5,-61,8,-57,9,-52,8,-48,3,-45,-3,-46,-6,-50],SK);a.d(-2,-55,2,3,SD);a.p(-1,-54,'#b8806a');
  a.q([-8,-63,3,-64,8,-60,7,-58,1,-59,-2,-57,-5,-53,-6,-49,-8,-51],HR);a.d(-5,-63,7,1,HL);a.d(-7,-60,4,1,HL);a.d(-3,-61,5,1,HL);
  a.q([0,-51,9,-51,9,-48,6,-44,0,-44,-2,-48],'#4a3223');a.d(5,-50,4,1,HR);a.d(7,-48,2,1,'#2a1a14');a.d(1,-47,3,1,'#5a4030');
  a.d(4,-58,4,1,HR);a.d(2,-56,7,1,'#2a2a2a');a.d(5,-56,4,3,'#ffd23a');a.p(8,-56,'#fff6c0');a.p(6,-55,'#6a4a10');a.d(9,-54,1,3,SD)}
function shmArt(a,pose,ph,gun){const SK='#f2cab2',SD='#d8a890',D='#f59cc8',DD='#cf74a2',DL='#ffc4df',HR='#2c1a1f',HL='#4a3038',B='#0e0e12';
  a.q([-9,-58,1,-59,-1,-50,-4,-37,-9,-35,-11,-46],HR);a.d(-8,-52,1,14,HL);a.d(-6,-50,1,12,HL);
  a.q([-5,-21,-1,-21,-1-ph*3,-7,-5-ph*3,-7],SD);a.q([0,-21,4,-21,4+ph*3,-7,0+ph*3,-7],SK);
  a.r(-6-ph*3,-9,7,6,B);a.r(-6-ph*3,-3,8,3,'#2a2a32');a.r(-1+ph*3,-9,7,6,B);a.r(-1+ph*3,-3,8,3,'#2a2a32');a.d(1+ph*3,-8,3,1,'#3a3a44');a.d(-1+ph*3,-2,8,1,'#4a4a54');
  a.q([-7,-44,5,-44,6,-34,9,-20,-10,-20,-7,-34],D);a.d(-7,-35,13,1,DD);a.d(-4,-33,1,12,DD);a.d(2,-33,1,12,DD);a.d(-10,-21,19,1,DD);a.d(-6,-43,9,1,DL);a.d(-1,-42,1,6,DL);
  if(gun){a.q([-1,-42,3,-42,13,-38,12,-34,-1,-38],SK);a.r(12,-40,10,3,'#26262a');a.d(13,-40,8,1,'#4a4a52');a.r(13,-37,3,4,'#4a3a2a');a.r(10,-38,4,3,SK)}
  else{const sw=-ph*2;a.q([-1,-42,3,-42,3+sw,-28,-1+sw,-28],SK);a.d(-1,-42,1,14,SD);a.r(-1+sw,-28,4,3,SK)}
  a.r(-1,-47,4,3,SK);a.d(-1,-47,1,3,SD);
  a.q([-5,-60,5,-60,8,-56,8,-50,5,-46,-3,-46,-5,-50],SK);
  a.q([-7,-62,4,-63,8,-59,8,-56,5,-58,0,-57,-3,-52,-5,-48,-7,-52],HR);a.d(5,-58,3,2,HR);a.d(-3,-62,5,1,HL);a.d(-5,-59,3,1,HL);a.d(-1,-62,2,2,'#ff4fa3');a.p(-1,-62,'#ffd0e6');
  a.d(4,-55,3,2,'#ffffff');a.d(5,-55,2,2,'#6a5a2a');a.p(6,-55,'#2a3a1a');a.p(5,-55,'#ffffff');a.d(4,-56,4,1,'#1c1418');a.d(4,-51,2,1,'#f0a0a0');a.d(6,-49,2,1,'#d0406a');a.p(8,-53,SD)}
const phOf=(mode,t)=>mode==='walk'||mode==='run'?Math.round(Math.sin(t*10)):0;
function mik(orig){const ho=wrap(orig);const w=function(x,y,t,mode){if(!HDS.on||typeof x!=='number')return orig.apply(this,arguments);
    if(mode&&mode!=='stand'&&mode!=='idle'&&mode!=='walk'&&mode!=='ride')return ho.apply(this,arguments);
    if(mode==='ride'){try{(sideScooter._hd?sideScooter:sideScooter)(x,y)}catch(e){}const bob=Math.round(Math.sin((t||0)*8)*.6),s=spr('m_ride',a=>mikArt(a,'ride',0));if(!s)return orig.apply(this,arguments);putS(s,x,y-5+bob);return}
    const ph=phOf(mode,t||0),s=spr('m_'+ph,a=>mikArt(a,'stand',ph));if(!s)return orig.apply(this,arguments);putS(s,x,y)};w._hd=true;return w}
function shm(orig){const ho=wrap(orig);const w=function(x,y,t,mode,gun){if(!HDS.on||typeof x!=='number')return orig.apply(this,arguments);
    if(mode&&mode!=='stand'&&mode!=='walk'&&mode!=='idle')return ho.apply(this,arguments);
    const ph=phOf(mode,t||0),g=!!gun,s=spr('s_'+ph+g,a=>shmArt(a,'stand',ph,g));if(!s)return orig.apply(this,arguments);putS(s,x,y)};w._hd=true;return w}
HDS.shmak=shm;HDS.mik=mik;
try{sideScooter=wrap(sideScooter,[24,40])}catch(e){}
// общие (index.html)
try{sideMikrob=mik(sideMikrob)}catch(e){}
try{sidePed=wrap(sidePed)}catch(e){}
// кит глав 5–10: оборачиваем после загрузки
addEventListener('load',()=>{const K=window.K56;if(!K)return;if(K.sideShmak)K.sideShmak=shm(K.sideShmak);for(const k of Object.keys(K)){if(/^side[A-Z]/.test(k)&&typeof K[k]==='function')K[k]=wrap(K[k])}
  if(K.catSide)K.catSide=wrap(K.catSide,[34,40])});
})();
