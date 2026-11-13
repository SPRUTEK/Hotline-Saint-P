// ================= Мебель в локациях (06.11): наборы вдоль стен, не мешают проходу =================
// Рисуется в фон уровня (L.bg) до мелкого декора NEON.decor. Не меняет сетку: герои и зомби проходят «по» мебели,
// но ставим её только туда, где перед стеной остаётся свободная полоса ≥ 5 клеток, и не к проёмам/дверям.
(function(){
'use strict';
if(!window.NEON||!NEON.decor)return;
const OL='#120a1a',T=1/3,TS=4,K=1.6;
const hx=c=>{c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');const n=parseInt(c,16);return [n>>16&255,n>>8&255,n&255]};
const mixc=(a,b,k)=>{const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,'0')).join('')};
const lt=(c,k)=>mixc(c,'#ffffff',k),dk=(c,k)=>mixc(c,'#000000',k);
function hstr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
// примитивы с контуром и объёмом (свет сверху-слева)
const R=(g,x,y,w,h,c,o)=>{if(o!==0){g.fillStyle=OL;g.fillRect(x-T,y-T,w+2*T,h+2*T)}g.fillStyle=c;g.fillRect(x,y,w,h);g.fillStyle=lt(c,.28);g.fillRect(x,y,w,T);g.fillRect(x,y,T,h);g.fillStyle=dk(c,.32);g.fillRect(x,y+h-T,w,T);g.fillRect(x+w-T,y,T,h)};
const F=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
const E=(g,x,y,rx,ry,c,o)=>{if(o!==0){g.fillStyle=OL;g.beginPath();g.ellipse(x,y,rx+T,ry+T,0,0,7);g.fill()}g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill()};
const SH=(g,x,y,w,h)=>{g.fillStyle='rgba(8,0,18,.38)';g.fillRect(x+1.2,y+1.2,w,h)};
const pick=(r,a)=>a[r(a.length)];
const FAB=['#c83a6a','#3a6ac8','#2a9a8a','#8a4ac8','#c8783a','#4a4a5a','#6a8a3a','#a83a3a','#2a5a8a','#d8b04a'];
const WOOD=['#8a5a32','#6a4428','#a8743e','#4a3020','#c8a070','#3a2a22'];
// предметы: (g,r,col) в локальных координатах — стена сверху (y=0), x вдоль стены. w,d — размер.
const P={
 sofa:{w:22,d:9,f(g,r,c){SH(g,0,0,22,9);R(g,0,0,22,4,dk(c,.18));R(g,0,0,3,9,dk(c,.1));R(g,19,0,3,9,dk(c,.1));for(let i=0;i<3;i++){R(g,3+i*5.33,3.6,5.33,5,c);F(g,3.6+i*5.33,4.4,4,.6,lt(c,.35))}
   if(r(2)){R(g,4,1,4,3,pick(r,FAB));}if(r(2))R(g,14,1,4,3,pick(r,FAB))}},
 armchair:{w:9,d:9,f(g,r,c){SH(g,0,0,9,9);R(g,0,0,9,4,dk(c,.18));R(g,0,0,2.4,9,dk(c,.1));R(g,6.6,0,2.4,9,dk(c,.1));R(g,2.4,3.4,4.2,5.2,c);F(g,3,4.2,3,.6,lt(c,.35))}},
 ctable:{w:11,d:6,f(g,r){const c=pick(r,WOOD);SH(g,0,0,11,6);R(g,0,0,11,6,c);F(g,1,1,9,.5,lt(c,.4));if(r(2)){R(g,2,1.6,2.4,2.4,'#e8e0f0');F(g,2.6,2.2,1.2,1.2,'#5a3020')}if(r(2)){R(g,6,2,3.4,2.2,pick(r,['#ff4fd8','#36d7ff','#ffe23a']))}}},
 rug:{w:26,d:16,f(g,r,c){const a=pick(r,['#7a2a5a','#2a4a7a','#6a3a2a','#3a5a4a','#5a2a7a']),b=pick(r,['#e8c86a','#ff4fd8','#22e5d4','#e8e0f0']);g.globalAlpha=.85;F(g,0,0,26,16,OL);F(g,.4,.4,25.2,15.2,a);F(g,2,2,22,12,dk(a,.2));g.fillStyle=b;
   for(let i=0;i<5;i++)F(g,3+i*4.6,3,2,10,dk(a,.05));F(g,2,2,22,.6,b);F(g,2,13.4,22,.6,b);F(g,2,2,.6,12,b);F(g,23.4,2,.6,12,b);E(g,13,8,4,2.4,b,0);E(g,13,8,2.6,1.4,a,0);g.globalAlpha=1;
   g.fillStyle=lt(b,.2);for(let x=1;x<26;x+=1.4){F(g,x,-.6,.4,.6,b);F(g,x,16,.4,.6,b)}}},
 tvstand:{w:18,d:5,f(g,r){const c=pick(r,['#2a2834','#3a2a22','#e8e0f0']);SH(g,0,0,18,5);R(g,0,0,18,5,c);R(g,2,.2,14,1.6,'#0a0a12');F(g,2.4,.5,13.2,.6,'#36d7ff');F(g,1,3,4,1.4,dk(c,.3));F(g,13,3,4,1.4,dk(c,.3));E(g,9,3.6,1,.7,'#ff2e60',0)},glow:[9,1,26,'#36d7ff']},
 shelf:{w:14,d:4,f(g,r){const c=pick(r,WOOD);SH(g,0,0,14,4);R(g,0,0,14,4,c);for(let x=.8;x<13;){const bw=.8+r(3)*.4;F(g,x,.6,bw,2.6,pick(r,['#c83a3a','#3a6ac8','#e8c84a','#2a9a6a','#e8e0f0','#8a4ac8','#1a1a20']));x+=bw+.2}F(g,0,3.4,14,.6,dk(c,.3))}},
 wardrobe:{w:14,d:7,f(g,r){const c=pick(r,WOOD);SH(g,0,0,14,7);R(g,0,0,14,7,c);F(g,6.8,.6,.4,6,dk(c,.35));F(g,5.6,3,.6,1.4,'#e8c86a');F(g,7.8,3,.6,1.4,'#e8c86a');F(g,1,1,4.6,.4,lt(c,.3));F(g,8.4,1,4.6,.4,lt(c,.3))}},
 bigplant:{w:8,d:8,f(g,r){const pc=pick(r,['#c8643a','#e8e0f0','#2a2a34','#ff4fd8','#6a8a9a']);SH(g,1.5,1.5,5,5);E(g,4,4,2.8,2.8,pc);E(g,4,4,2,2,'#3a2418',0);const lc=pick(r,['#2ec46a','#5ae04a','#1fa88a','#3a9a3a']);
   for(let i=0;i<9;i++){const a=i*.7+r(9)*.1,l=2.6+r(3)*.5;g.save();g.translate(4+Math.cos(a)*l*.6,4+Math.sin(a)*l*.6);g.rotate(a);g.fillStyle=OL;g.beginPath();g.ellipse(0,0,l*.75+T,1.1+T,0,0,7);g.fill();g.fillStyle=i%2?lc:lt(lc,.25);g.beginPath();g.ellipse(0,0,l*.75,1.1,0,0,7);g.fill();g.fillStyle=dk(lc,.3);g.fillRect(-l*.6,-.1,l*1.2,.25);g.restore()}}},
 palm:{w:8,d:8,f(g,r){SH(g,1.5,1.5,5,5);E(g,4,4,2.6,2.6,'#b87a4a');E(g,4,4,1.8,1.8,'#3a2418',0);const lc='#3ab85a';for(let i=0;i<7;i++){const a=i*.9;g.save();g.translate(4,4);g.rotate(a);g.fillStyle=OL;g.fillRect(0,-.7,4.6,1.4);g.fillStyle=lc;g.fillRect(.2,-.45,4.2,.9);g.fillStyle=lt(lc,.3);for(let k=1;k<4.2;k+=.8)g.fillRect(k,-.9,.3,1.8);g.restore()}E(g,4,4,.8,.8,'#6a4a2a')}},
 flowers:{w:6,d:6,f(g,r){const c=pick(r,WOOD);SH(g,.4,.4,5.2,5.2);R(g,.4,.4,5.2,5.2,c);E(g,3,3,1.4,1.4,pick(r,['#e8e0f0','#36d7ff','#ff4fd8']));
   for(let i=0;i<6;i++){const a=i*1.05,x=3+Math.cos(a)*1.3,y=3+Math.sin(a)*1.3;E(g,x,y,.75,.75,pick(r,['#ff3a6a','#ffe23a','#ff8ad8','#ffffff','#b04aff','#ff7a1a']))}E(g,3,3,.5,.5,'#ffe23a',0)}},
 lampF:{w:6,d:6,f(g,r,c){E(g,3,3,2.6,2.6,'#2a2834');E(g,3,3,1.8,1.8,lt(c,.4));E(g,3,3,.8,.8,'#ffffff',0)},glowC:1},
 desk:{w:16,d:7,f(g,r){const c=pick(r,['#e8e0f0','#8a5a32','#3a3a48','#c8a070']);SH(g,0,0,16,7);R(g,0,0,16,7,c);R(g,4,.6,8,1.8,'#14121c');F(g,4.6,.9,6.8,1,pick(r,['#36d7ff','#7dff3a','#ff4fd8']));R(g,4.6,3.6,6,1.4,'#2a2834');F(g,5,3.9,5.2,.3,'#5a5868');
   E(g,12.8,4.4,.7,.9,'#e8e0f0');if(r(2)){R(g,1,1,2.4,3,'#f0ecf8');R(g,1.4,1.4,2.4,3,'#ffffff')}if(r(2))E(g,14.2,1.6,.9,.9,'#e8e0f0')},glow:[8,2,16,'#36d7ff']},
 chair:{w:7,d:7,f(g,r,c){SH(g,.8,.8,5.4,5.4);E(g,3.5,3.5,2.8,2.8,'#1a1a22');R(g,1.2,1.4,4.6,4,c||'#2a2834');R(g,1.2,4.6,4.6,1.6,dk(c||'#2a2834',.2))}},
 fridge:{w:8,d:7,f(g,r){const c=pick(r,['#e8e8f0','#c8ccd8','#ff4a5a']);SH(g,0,0,8,7);R(g,0,0,8,7,c);F(g,0,2.6,8,.4,dk(c,.3));F(g,6.4,3.4,.6,2.4,'#5a5868');for(let i=0;i<3;i++)R(g,1+i*2,4+r(2),1.2,1,pick(r,['#ffe23a','#ff4fd8','#36d7ff']))}},
 counter:{w:18,d:6,f(g,r){const c=pick(r,['#e8e0f0','#3a3a48','#c8a070']);SH(g,0,0,18,6);R(g,0,0,18,6,c);R(g,2,1,5,3.4,'#8a96a8');F(g,2.6,1.6,3.8,2.2,'#5a6a7a');E(g,4.5,1.2,.4,.4,'#e8e8f0');
   R(g,10,.8,6,4,'#1a1a20');for(const [x,y] of [[11.6,2],[14.4,2],[11.6,4],[14.4,4]])E(g,x,y-.4,.9,.9,'#3a3a44',0);E(g,11.6,1.6,.5,.5,'#ff5a2a',0);if(r(2))R(g,8,1.4,1.4,1.4,pick(r,['#36d7ff','#ff4fd8']))}},
 vending:{w:9,d:6,f(g,r){const c=pick(r,['#c81e3a','#2a4ac8','#1a8a5a','#141418']);SH(g,0,0,9,6);R(g,0,0,9,6,c);R(g,1,.6,5.4,4,'#0a1a2a');for(let y=0;y<3;y++)for(let x=0;x<4;x++)F(g,1.4+x*1.3,.9+y*1.3,.9,.8,pick(r,['#ffe23a','#ff4fd8','#7dff3a','#36d7ff','#ff7a1a']));R(g,7,1,1.2,2,'#2a2834');F(g,7.2,3.6,.8,.8,'#7dff3a')},glow:[4.5,3,22,'#ff4fd8']},
 bench:{w:16,d:5,f(g,r){const c=pick(r,['#8a5a32','#a8743e','#5a6a7a']);SH(g,0,0,16,5);R(g,1,0,1.2,5,'#2a2834');R(g,13.8,0,1.2,5,'#2a2834');for(let i=0;i<3;i++)R(g,0,.6+i*1.5,16,1.2,c)}},
 locker:{w:16,d:5,f(g,r){const c=pick(r,['#5a6a8a','#6a8a5a','#8a5a5a','#4a4a5a']);SH(g,0,0,16,5);for(let i=0;i<4;i++){R(g,i*4,0,4,5,c);F(g,i*4+1,1,2,.3,dk(c,.35));F(g,i*4+1,1.8,2,.3,dk(c,.35));F(g,i*4+2.8,3,.5,1,'#e8e0f0')}}},
 crates:{w:14,d:7,f(g,r){SH(g,0,0,14,7);R(g,0,0,7,7,'#a8743e');F(g,0,3.2,7,.6,'#6a4428');F(g,3.2,0,.6,7,'#6a4428');R(g,7.4,1,6,6,'#c8904e');F(g,7.4,3.7,6,.5,'#8a5a32');R(g,8.4,-.4,3,2.4,'#3a6a3a')}},
 barrel:{w:6,d:6,f(g,r){SH(g,.5,.5,5,5);E(g,3,3,2.7,2.7,pick(r,['#3a6ac8','#c83a3a','#3a8a3a','#5a5a68']));E(g,3,3,1.8,1.8,'#2a2834',0);E(g,2.2,2.2,.5,.5,'#e8e0f0',0)}},
 mats:{w:16,d:8,f(g,r){for(let i=0;i<2;i++){const c=pick(r,['#2a6ac8','#c82a6a','#1a1a22','#2a9a6a']);R(g,i*8.4,0,7.4,8,c);F(g,i*8.4+.6,.6,6.2,.4,lt(c,.3))}}},
 rack:{w:16,d:5,f(g,r){SH(g,0,0,16,5);R(g,0,1.8,16,1.4,'#3a3a48');for(let i=0;i<6;i++){E(g,1.6+i*2.6,2.5,1.1,1.8,'#1a1a20');E(g,1.6+i*2.6,2.5,.5,.9,'#5a5868',0)}}},
 bar:{w:20,d:6,f(g,r){SH(g,0,0,20,6);R(g,0,0,20,6,'#4a2a2a');F(g,0,0,20,1.2,'#e8c86a');for(let i=0;i<5;i++){const x=1.6+i*3.8;g.fillStyle=OL;g.fillRect(x-.3,1.8,1.6,3);F(g,x,2,1,2.6,pick(r,['#3aa04a','#8a4a1a','#c8e8f0','#ff4fd8']))}},glow:[10,1,24,'#ffe23a']},
 stool:{w:4,d:4,f(g,r){E(g,2,2,1.6,1.6,pick(r,['#c81e3a','#e8c86a','#2a2834']))}},
 pool:{w:22,d:13,f(g,r){SH(g,0,0,22,13);R(g,0,0,22,13,'#6a3a22');R(g,1.4,1.4,19.2,10.2,'#1a7a4a',0);for(const [x,y] of [[1.4,1.4],[11,1.2],[20.6,1.4],[1.4,11.6],[11,11.8],[20.6,11.6]])E(g,x,y,.8,.8,'#0a0a10',0);
   for(let i=0;i<6;i++)E(g,6+r(10),3+r(7),.6,.6,pick(r,['#ffe23a','#c81e3a','#2a4ac8','#ffffff','#1a1a1a']),0);g.save();g.translate(4,6);g.rotate(.3);F(g,0,0,10,.4,'#c8a070');g.restore()}},
 hydrant:{w:5,d:5,f(g,r){E(g,2.5,2.5,1.8,1.8,'#c81e3a');E(g,2.5,2.5,.8,.8,'#e8e0f0',0)}},
 flowerbed:{w:16,d:6,f(g,r){SH(g,0,0,16,6);R(g,0,0,16,6,'#7a7a88');F(g,.8,.8,14.4,4.4,'#3a2418');for(let i=0;i<14;i++){const x=1.6+r(13),y=1.4+r(3)*1.2;E(g,x,y,.9,.9,i%3?'#2ec46a':pick(r,['#ff3a6a','#ffe23a','#ff8ad8','#b04aff']),0)}}},
};
// наборы: [предмет, отступ после]; front — предметы перед набором (отступ от стены)
const SETS={
 lounge:{row:[['lampF',1],['sofa',1],['bigplant',0]],front:[['rug',6,-2,-1],['ctable',11.5,12]],clear:7},
 reading:{row:[['bigplant',1],['armchair',.6],['flowers',.6],['armchair',0]],clear:6},
 media:{row:[['shelf',1.5],['tvstand',1.5],['palm',0]],front:[['armchair',13,8]],clear:6},
 office:{row:[['desk',2],['desk',2],['bigplant',0]],front:[['chair',4.5,7.5],['chair',22.5,7.5]],clear:6},
 study:{row:[['shelf',1],['desk',1],['flowers',0]],front:[['chair',19,7.5]],clear:6},
 storage:{row:[['shelf',1],['wardrobe',1],['crates',0]],clear:6},
 kitchen:{row:[['fridge',.5],['counter',1],['bigplant',0]],front:[['ctable',10,12],['chair',8,19],['chair',15,19]],clear:6},
 vend:{row:[['vending',1],['vending',1],['palm',0]],clear:6},
 gym:{row:[['rack',2],['mats',1],['locker',0]],clear:6},
 club:{row:[['bar',1.5],['stool',1],['stool',1],['bigplant',0]],clear:6},
 billiard:{row:[['pool',0]],off:3,clear:6},
 junk:{row:[['crates',1],['barrel',1],['barrel',0]],clear:5},
 lockers:{row:[['locker',1],['bench',0]],clear:6},
 park:{row:[['flowerbed',1.5],['bench',1.5],['flowerbed',0]],clear:6,out:1},
 street:{row:[['hydrant',4],['bench',2],['palm',0]],clear:6,out:1},
};
function setsFor(id){id=String(id||'').toLowerCase();const has=(...a)=>a.some(s=>id.includes(s));
 if(has('cellar','tunnel','lair','sewer','basement','podval','lab','bunker','sklad'))return ['storage','junk','junk','lockers'];
 if(has('gym','fit','skala','box'))return ['gym','gym','lockers','vend','reading'];
 if(has('club','bar','grib','myc','nora','bard'))return ['club','billiard','lounge','reading','club'];
 if(has('mall','shop','lenta','ozon','vape','market','store'))return ['vend','reading','lounge','vend','park'];
 if(has('off','anis','call','office','work'))return ['office','office','study','lounge','vend','reading'];
 if(has('flat','kv','hub','home','dacha','vil','cott','batya','kitch','living','bed'))return ['lounge','media','reading','kitchen','study','storage'];
 return ['lounge','reading','storage','vend','office','junk','media','study'];}
const OUTSETS=['park','street','junk'];
function size(set){let w=0,d=0;for(const [n,gap] of set.row){w+=P[n].w+gap;d=Math.max(d,P[n].d)}for(const f of (set.front||[]))d=Math.max(d,f[2]+P[f[0]].d);return {w:(w+(set.off||0))*K,d:d*K}}
// трансформ: стена сверху (n), снизу (s), слева (w), справа (e); (x0,y0) — левый верхний угол прямоугольника на карте
function orient(g,o,x0,y0,W,D){g.translate(x0,y0);if(o==='s'){g.transform(1,0,0,-1,0,D)}else if(o==='w'){g.transform(0,1,1,0,0,0)}else if(o==='e'){g.transform(0,1,-1,0,D,0)}}
function toWorld(o,x0,y0,W,D,lx,ly){if(o==='n')return [x0+lx,y0+ly];if(o==='s')return [x0+lx,y0+D-ly];if(o==='w')return [x0+ly,y0+lx];return [x0+D-ly,y0+lx]}
function drawSet(g,L,set,o,x0,y0,W,D,r,glow){g.save();orient(g,o,x0,y0,W,D);g.scale(K,K);const col=pick(r,FAB);let x=set.off||0;
  const fr=set.front||[];for(const f of fr)if(f[0]==='rug'){g.save();g.translate(f[1],f[2]);P.rug.f(g,r,col);g.restore()}
  for(const [n,gap] of set.row){const it=P[n];g.save();g.translate(x,0);it.f(g,r,col);g.restore();
    if(it.glow){const [wx,wy]=toWorld(o,x0,y0,W,D,(x+it.glow[0])*K,it.glow[1]*K);glow.push({x:wx,y:wy,r:it.glow[2],c:it.glow[3]})}
    if(it.glowC){const [wx,wy]=toWorld(o,x0,y0,W,D,(x+3)*K,3*K);glow.push({x:wx,y:wy,r:34,c:pick(r,['#ffd28a','#ff4fd8','#36d7ff'])})}
    x+=it.w+gap}
  for(const f of fr)if(f[0]!=='rug'){g.save();g.translate(f[1],f[2]);P[f[0]].f(g,r,col);g.restore()}
  g.restore()}
const od=NEON.decor;
NEON.decor=function(L){try{furnish(L)}catch(e){console.warn('furn',e)}return od(L)};
function busyMap(L){// яркость фона по 1 ед.: чтобы не ставить мебель на уже нарисованные предметы
  const w=Math.ceil(L.w/2),h=Math.ceil(L.h/2);if(w*h>3e6)return null;const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.drawImage(L.bg,0,0,w,h);const d=g.getImageData(0,0,w,h).data;
  const lum=new Float32Array(w*h);for(let i=0;i<w*h;i++)lum[i]=(d[i*4]*.3+d[i*4+1]*.59+d[i*4+2]*.11)/255;return {w,h,lum}}
function furnish(L){if(L.noDecor||L.noFurn||(window.LV&&LV[L.id]&&(LV[L.id].noDecor||LV[L.id].noFurn)))return;const g=L.bx,G=L.g,gw=L.gw,gh=L.gh,rooms=L._rooms,comp=L._comp;if(!g||!rooms)return;
  let seed=hstr('f'+L.id);const r=n=>{seed=(seed*1103515245+12345)&0x7fffffff;return (seed>>>12)%n};
  const at=(x,y)=>(x<0||y<0||x>=gw||y>=gh)?1:G[y*gw+x];
  const used=L._fused=L._fused||new Uint8Array(gw*gh);const BM=busyMap(L);
  const busy=(x0,y0,w,h)=>{if(!BM)return false;let s=0,s2=0,n=0;for(let y=Math.floor(y0/2);y<Math.ceil((y0+h)/2);y++)for(let x=Math.floor(x0/2);x<Math.ceil((x0+w)/2);x++){if(x<0||y<0||x>=BM.w||y>=BM.h)continue;const v=BM.lum[y*BM.w+x];s+=v;s2+=v*v;n++}
    if(!n)return true;const m=s/n;return Math.sqrt(Math.max(0,s2/n-m*m))>base*1.35+.03};
  let base=.07;
  const objs=[].concat(L.its||[],L.items||[],L.npcs||[]);
  const pool=setsFor(L.id),glow=[];const perRoom={};
  // кандидаты: для каждой комнаты и стены
  const bc={};for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){if(x>1&&y>1&&x<gw-2&&y<gh-2)continue;const k=y*gw+x;if(G[k]!==1&&comp[k]>=0)bc[comp[k]]=(bc[comp[k]]||0)+1}
  const openR={has:i=>(bc[i]||0)>40};
  const order=rooms.map((R_,i)=>i).sort((a,b)=>rooms[b].n-rooms[a].n);
  for(const ri of order){const Rm=rooms[ri];if(Rm.n<140||(Rm.sat>.42&&Rm.n<2500))continue;const out=openR.has(ri);const lim=out?Math.min(2,Math.floor(Rm.n/2400)):Math.min(4,Math.max(1,Math.floor(Rm.n/420)));if(lim<=0)continue;
    let tries=0;perRoom[ri]=0;
    // собрать клетки комнаты у стен
    const cand=[];for(let y=1;y<gh-1;y++)for(let x=1;x<gw-1;x++){const k=y*gw+x;if(comp[k]!==ri||G[k]!==0)continue;
      if(at(x,y-1)===1)cand.push(['n',x,y]);if(at(x,y+1)===1)cand.push(['s',x,y]);if(at(x-1,y)===1)cand.push(['w',x,y]);if(at(x+1,y)===1)cand.push(['e',x,y])}
    if(!cand.length)continue;
    if(BM){let s=0,s2=0,n=0;for(let i=0;i<400;i++){const c=cand[r(cand.length)];const x=(c[1]*TS/2)|0,y=(c[2]*TS/2)|0;if(x>=BM.w||y>=BM.h)continue;const v=BM.lum[y*BM.w+x];s+=v;s2+=v*v;n++}
      // фон комнаты: разброс яркости в окне 12×12 у стен
      const st=[];for(let i=0;i<24;i++){const c=cand[r(cand.length)];const x0=c[1]*TS-4,y0=c[2]*TS-4;let a=0,b=0,m=0;for(let y=y0>>1;y<(y0+12)>>1;y++)for(let x=x0>>1;x<(x0+12)>>1;x++){if(x<0||y<0||x>=BM.w||y>=BM.h)continue;const v=BM.lum[y*BM.w+x];a+=v;b+=v*v;m++}if(m)st.push(Math.sqrt(Math.max(0,b/m-(a/m)**2)))}
      st.sort((a,b)=>a-b);base=st.length?st[st.length>>1]:.07}
    while(perRoom[ri]<lim&&tries++<220){const c=cand[r(cand.length)];const name=out?pick(r,OUTSETS):pick(r,pool);const set=SETS[name];if(!set||(set.out&&!out))continue;
      const sz=size(set);const Lc=Math.ceil(sz.w/TS),Dc=Math.ceil(sz.d/TS),Cc=set.clear+(out?1:0);
      const [o,cx,cy]=c;let ok=true;const cells=[];
      // клетки прямоугольника + полоса прохода перед ним; стена сплошная на всю длину (+1 с краёв — не у двери)
      for(let a=-1;a<=Lc&&ok;a++){const wx=o==='n'||o==='s'?cx+a:(o==='w'?cx-1:cx+1),wy=o==='n'?cy-1:o==='s'?cy+1:cy+a;if(at(wx,wy)!==1)ok=false;
        for(let b=0;b<Dc+Cc&&ok&&a>=0&&a<Lc;b++){const x=o==='n'||o==='s'?cx+a:(o==='w'?cx+b:cx-b),y=o==='n'?cy+b:o==='s'?cy-b:cy+a;if(x<0||y<0||x>=gw||y>=gh){ok=false;break}const k=y*gw+x;if(G[k]!==0||comp[k]!==ri||used[k])ok=false;if(b<Dc)cells.push(k)}}
      if(!ok){(L._fr=L._fr||{}).geo=(L._fr.geo||0)+1;continue}
      // прямоугольник в мировых координатах
      const along=Lc*TS,dep=Dc*TS;let x0,y0,Wd,Dd;
      if(o==='n'){x0=cx*TS;y0=cy*TS;Wd=along;Dd=dep}else if(o==='s'){x0=cx*TS;y0=(cy+1)*TS-dep;Wd=along;Dd=dep}else if(o==='w'){x0=cx*TS;y0=cy*TS;Wd=dep;Dd=along}else{x0=(cx+1)*TS-dep;y0=cy*TS;Wd=dep;Dd=along}
      if(objs.some(it=>it&&it.x>x0-12&&it.x<x0+Wd+12&&it.y>y0-12&&it.y<y0+Dd+12))continue;
      if(L.startX>x0-26&&L.startX<x0+Wd+26&&L.startY>y0-26&&L.startY<y0+Dd+26)continue;
      if(busy(x0,y0,Wd,Dd)){(L._fr=L._fr||{}).busy=(L._fr.busy||0)+1;continue}
      // свободное место вдоль стены центрируем набор
      const pad=(along-sz.w)/2;
      // помечаем занятое (плюс зазор), чтобы наборы и мелкий декор не налезали
      for(const k of cells){used[k]=1;const x=k%gw,y=(k/gw)|0;for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const xx=x+i,yy=y+j;if(xx>=0&&yy>=0&&xx<gw&&yy<gh)used[yy*gw+xx]=1}}
      const D=sz.d;let ox=x0,oy=y0;
      if(o==='n'){ox=x0+pad}else if(o==='s'){ox=x0+pad;oy=y0+dep-D}else if(o==='w'){oy=y0+pad}else{ox=x0+dep-D;oy=y0+pad}
      drawSet(g,L,set,o,ox,oy,sz.w,D,r,glow);perRoom[ri]++;L._fn=(L._fn||0)+1;(L._fl=L._fl||[]).push([name,o,ri,out,Math.round(ox),Math.round(oy)])}}
  L._glow=(L._glow||[]).concat(glow)}
NEON.FURN={P,SETS,setsFor};
})();
