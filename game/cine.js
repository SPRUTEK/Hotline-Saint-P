// cine.js — кинематографичные катсцены (06.11): холст 640×360 (как главное меню), мелкий пиксель,
// свет, дизеринг, параллакс, детальные персонажи и машины в профиль. Использует MART (menuart.js).
// Сцена: CINE.shot(fn) → draw(t) для массива катсцен; fn(t, s) рисует в 640×360.
(function(){
'use strict';
const M=window.MART;if(!M)return;
const AW=640,AH=360,OUT='#0a090d',TAU=Math.PI*2;
const cv=document.createElement('canvas');cv.width=AW;cv.height=AH;const cg=cv.getContext('2d');cg.imageSmoothingEnabled=false;
let g=cg;
const {hash,mix,build}=M;
const lit=(c,k)=>mix(c,'#ffffff',k==null?.3:k),drk=(c,k)=>mix(c,'#000000',k==null?.38:k);
const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
const P=(x,y,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),1,1)};
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
// дизеринг: заливка c2 поверх c1 с долей k (0..1) по матрице Байера
function dith(x,y,w,h,c,k){if(k<=0)return;g.fillStyle=c;const t=k*16;for(let j=0;j<h;j++)for(let i=0;i<w;i++){if(BAY[((y+j)&3)*4+((x+i)&3)]<t)g.fillRect(x+i,y+j,1,1)}}
// небо: список [y, цвет], между соседними — полосы с дизеринг-переходом
function skyBands(stops){for(let s=0;s<stops.length-1;s++){const [y0,c0]=stops[s],[y1,c1]=stops[s+1];const h=y1-y0,n=Math.max(1,Math.round(h/6));
  for(let i=0;i<n;i++){const ya=y0+Math.round(i*h/n),yb=y0+Math.round((i+1)*h/n),k=i/n;R(0,ya,AW,yb-ya,mix(c0,c1,k));dith(0,ya,AW,yb-ya,mix(c0,c1,(i+1)/n),.5*(1))}}}
function glow(x,y,r,col,a){const v=M.mix(col,col,0);g.save();g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,rgba(col,a));gr.addColorStop(1,rgba(col,0));g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);g.restore()}
function rgba(c,a){const n=parseInt(c.slice(1),16);return'rgba('+(n>>16)+','+((n>>8)&255)+','+(n&255)+','+a+')'}
function cone(x,y,w0,w1,h,col,a){g.save();g.globalCompositeOperation='lighter';const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,rgba(col,a));gr.addColorStop(1,rgba(col,0));g.fillStyle=gr;g.beginPath();g.moveTo(x-w0/2,y);g.lineTo(x+w0/2,y);g.lineTo(x+w1/2,y+h);g.lineTo(x-w1/2,y+h);g.fill();g.restore()}
function shadeRect(x,y,w,h,col,a){g.fillStyle=rgba(col,a);g.fillRect(x,y,w,h)}
// пиксельный шрифт 3×5 (широкие 5×5) для вывесок
const FN={'А':['.#.','#.#','###','#.#','#.#'],'Б':['###','#..','###','#.#','###'],'В':['##.','#.#','##.','#.#','##.'],'Г':['###','#..','#..','#..','#..'],'Д':['.##.','.#.#','.#.#','####','#..#'],
'Е':['###','#..','##.','#..','###'],'Ж':['#.#.#','#.#.#','.###.','#.#.#','#.#.#'],'З':['##.','..#','.#.','..#','##.'],'И':['#..#','#.##','##.#','#..#','#..#'],'Й':['#.##','#..#','#.##','##.#','#..#'],
'К':['#.#','##.','#..','##.','#.#'],'Л':['..##','.#.#','.#.#','.#.#','#..#'],'М':['#...#','##.##','#.#.#','#...#','#...#'],'Н':['#.#','#.#','###','#.#','#.#'],'О':['###','#.#','#.#','#.#','###'],
'П':['###','#.#','#.#','#.#','#.#'],'Р':['##.','#.#','##.','#..','#..'],'С':['###','#..','#..','#..','###'],'Т':['###','.#.','.#.','.#.','.#.'],'У':['#.#','#.#','###','..#','##.'],
'Ф':['.#.','###','#.#','###','.#.'],'Х':['#.#','#.#','.#.','#.#','#.#'],'Ц':['#.#.','#.#.','#.#.','####','...#'],'Ч':['#.#','#.#','###','..#','..#'],'Ш':['#.#.#','#.#.#','#.#.#','#.#.#','#####'],
'Щ':['#.#.#.','#.#.#.','#.#.#.','######','.....#'],'Ы':['#...#','#...#','##..#','#.#.#','##..#'],'Ь':['#..','#..','##.','#.#','##.'],'Э':['##.','..#','.##','..#','##.'],'Ю':['#.###','#.#.#','###.#','#.#.#','#.###'],'Я':['.##','#.#','.##','#.#','#.#'],
'0':['###','#.#','#.#','#.#','###'],'1':['.#.','##.','.#.','.#.','###'],'2':['##.','..#','.#.','#..','###'],'3':['##.','..#','.#.','..#','##.'],'4':['#.#','#.#','###','..#','..#'],'5':['###','#..','##.','..#','##.'],
'6':['.##','#..','###','#.#','###'],'7':['###','..#','.#.','.#.','.#.'],'8':['###','#.#','###','#.#','###'],'9':['###','#.#','###','..#','##.'],' ':['..','..','..','..','..'],'·':['.','.','#','.','.'],'.':['.','.','.','.','#'],
',':['.','.','.','#','#'],':':['.','#','.','#','.'],'-':['...','...','###','...','...'],'!':['#','#','#','.','#'],'?':['##.','..#','.#.','...','.#.'],'«':['..','.#','#.','.#','..'],'»':['..','#.','.#','#.','..'],'"':['#.#','#.#','...','...','...'],'/':['..#','..#','.#.','#..','#..'],'₽':['##.','#.#','##.','###','#..'],'Ё':['#.#','###','##.','#..','###'],'Ъ':['##..','.#..','.##.','.#.#','.##.'],'▲':['..#..','.###.','#####','.....','.....'],'▼':['#####','.###.','..#..','.....','.....'],'(':['.#','#.','#.','#.','.#'],')':['#.','.#','.#','.#','#.'],'+':['...','.#.','###','.#.','...'],'×':['...','#.#','.#.','#.#','...'],'%':['#..#','...#','..#.','.#..','#..#'],'*':['#.#','.#.','#.#','...','...'],'\'':['#','#','.','.','.']};
function txtW(s,sc){sc=sc||1;let w=0;for(const ch of s.toUpperCase()){const gl=FN[ch]||FN[' '];w+=(gl[0].length+1)*sc}return w-sc}
function txt(s,x,y,col,sc,sh){sc=sc||1;let xx=Math.round(x);for(const ch of s.toUpperCase()){const gl=FN[ch]||FN[' '];for(let j=0;j<5;j++)for(let i=0;i<gl[j].length;i++)if(gl[j][i]==='#'){if(sh)R(xx+i*sc,y+j*sc+1,sc,sc,sh);R(xx+i*sc,y+j*sc,sc,sc,col)}xx+=(gl[0].length+1)*sc}}
function neonTxt(s,x,y,col,sc,on){const w=txtW(s,sc);if(on!==false){glow(x+w/2,y+sc*2.5,w*.6,col,.3);txt(s,x,y,col,sc,drk(col,.55));txt(s,x,y-0,lit(col,.6),sc)}else txt(s,x,y,drk(col,.5),sc)}
// ---------- природа ----------
function spruceS(x,base,h,col,rim){const tiers=Math.max(3,Math.round(h/7));R(x-1,base-h*.12,2,h*.12,'#1a0e10');
  for(let i=0;i<tiers;i++){const k=i/tiers,y=base-h*.1-i*(h*.9/tiers),w=(1-k)*h*.32+2;for(let j=0;j<h*.9/tiers+2;j++){const ww=w*(j/(h*.9/tiers+2))+1;R(x-ww/2,y-h*.9/tiers+j,ww,1,col)}
    if(rim)R(x+w*.25,y-2,Math.max(1,w*.25),1,rim)}}
function forest(base,seed,col,hmin,hmax,step,rim,t){for(let x=-10,i=0;x<AW+10;i++){const h=hmin+hash(i,seed)*(hmax-hmin);spruceS(x+Math.sin((t||0)*.8+i)*.0,base,h,col,rim);x+=step*(.6+hash(seed,i)*.8)}R(0,base,AW,4,col)}
function birchS(x,base,h,t){R(x,base-h,3,h,'#e8e4ec');for(let j=0;j<h;j+=5)if(hash(x,j)<.5)R(x+(hash(j,x)<.5?0:1),base-h+j,2,1,'#2a2430');
  for(let i=0;i<6;i++){const a=hash(x,i),yy=base-h+i*h/9,sw=Math.sin((t||0)*1.4+i+x)*1.2;M.E&&0;for(let k=0;k<10;k++)R(x-8+a*6+k+sw,yy+Math.sin(k)*2,2,2,k%3?'#3a8a3a':'#5ab84a')}}
function grass(y0,y1,c0,c1,seed){R(0,y0,AW,y1-y0,c0);for(let i=0;i<AW*(y1-y0)/14;i++){const x=hash(i,seed)*AW,y=y0+hash(seed,i)*(y1-y0);R(x,y,1,2+hash(i,i)*2,i%3?c1:lit(c1,.2))}}
function asphalt(y0,y1,base,seed){R(0,y0,AW,y1-y0,base);for(let i=0;i<AW*(y1-y0)/9;i++){const x=hash(i,seed+1)*AW,y=y0+hash(seed+2,i)*(y1-y0);P(x,y,hash(i,3)<.5?lit(base,.08):drk(base,.18))}
  for(let i=0;i<6;i++){let x=hash(i,seed+5)*AW,y=y0+hash(seed,i+9)*(y1-y0);for(let k=0;k<26;k++){P(x,y,drk(base,.4));x+=hash(k,i)*2-.3;y+=hash(i,k)*2-1}}}
// ---------- частицы ----------
function motes(t,x0,y0,w,h,col,n,seed){for(let i=0;i<n;i++){const ph=hash(i,seed)*TAU,x=x0+((hash(seed,i)*w+t*(4+hash(i,2)*6))%w),y=y0+((hash(i,seed+3)*h+Math.sin(t*1.5+ph)*6)%h),tw=Math.sin(t*3+ph);if(tw>-.3)P(x,y,tw>.7?'#ffffff':col)}}
// ---------- персонаж в профиль (смотрит вправо), ~66px ----------
// P: {skin,hair,style,beard,glasses,top,top2,shirt,tie,pants,shoes,bag,beer}
function person(P,frame,mode){const key='p:'+JSON.stringify(P)+':'+frame+':'+mode;return M.spr(key,A=>{
  const walk=mode==='walk',st=walk?[[-5,4],[-2,2],[4,-5],[2,-2]][frame&3]:[[-2,2],[-2,2],[-2,2],[-2,2]][0],bob=walk&&(frame&1)?-1:0;
  const sk=P.skin,top=P.top,top2=P.top2||drk(P.top,.25),pants=P.pants,shoes=P.shoes;
  // задняя нога
  A.q([-3+st[0],-27+bob,3+st[0],-27+bob,2+st[0]*1.4,-3,-4+st[0]*1.4,-3],drk(pants,.25));A.r(-5+st[0]*1.4,-4,9,4,drk(shoes,.2));
  // задняя рука
  const sw=walk?[[4,-3],[1,-1],[-4,3],[-1,1]][frame&3]:[0,0];
  if(!P.beer)A.q([-3,-48+bob,1,-48+bob,1+sw[1]*1.2,-28+bob,-3+sw[1]*1.2,-28+bob],drk(top,.35));
  // передняя нога
  A.q([-3+st[1],-27+bob,3+st[1],-27+bob,2+st[1]*1.4,-3,-4+st[1]*1.4,-3],pants);A.r(-4+st[1]*1.4,-4,10,4,shoes);A.d(-4+st[1]*1.4,-1,10,1,drk(shoes,.5));
  // туловище
  const tw=P.wide?8:7;A.q([-tw,-50+bob,tw-1,-50+bob,tw,-26+bob,-tw+1,-26+bob],top);
  A.d(-tw+1,-49+bob,2,22,top2);
  if(P.shirt){A.q([2,-50+bob,6,-50+bob,4,-40+bob],P.shirt);if(P.tie)A.q([3,-49+bob,5,-49+bob,5,-36+bob,3,-38+bob],P.tie)}
  if(P.zip)A.d(4,-48+bob,1,20,lit(top,.35));
  A.d(-tw+1,-28+bob,tw*2-1,2,drk(top,.3));
  // передняя рука
  if(P.beer){A.q([2,-47+bob,6,-47+bob,10,-38+bob,7,-36+bob],top);A.q([7,-38+bob,10,-38+bob,10,-44+bob,7,-46+bob],top);A.r(7,-50+bob,4,5,sk);A.r(7,-58+bob,5,9,'#c8a02a');A.d(8,-57+bob,1,7,'#f0d870');A.r(7,-60+bob,5,2,'#e8e8e8')}
  else{A.q([-1,-48+bob,4,-48+bob,4-sw[0],-29+bob,0-sw[0],-29+bob],top);A.r(-sw[0],-30+bob,4,4,sk)}
  if(P.bag)A.r(-12,-36+bob,10,12,P.bag);
  // шея и голова
  A.r(-1,-53+bob,5,4,drk(sk,.15));
  const hy=-66+bob;A.r(-5,hy,12,13,sk);A.r(7,hy+5,2,3,sk);A.d(2,hy+12,4,1,drk(sk,.25));
  A.d(4,hy+5,2,2,'#ffffff');A.d(5,hy+5,1,2,P.eye||'#3a2a1a');A.d(3,hy+3,4,1,drk(P.hair,.1));
  A.d(-2,hy+5,2,3,drk(sk,.18));
  if(P.glasses){A.d(2,hy+4,6,4,P.glasses);A.d(3,hy+5,4,2,P.lens||'#a8d8ff');A.d(5,hy+5,1,2,'#3a2a1a');A.d(-3,hy+5,5,1,P.glasses)}
  const H=P.hair;
  if(P.style==='back'){A.r(-6,hy-2,13,5,H);A.r(-6,hy,4,10,H);A.d(4,hy-2,3,1,lit(H,.25))}
  else if(P.style==='long'){A.r(-6,hy-2,13,5,H);A.r(-8,hy,6,22,H);A.d(-7,hy+2,1,18,lit(H,.2))}
  else if(P.style==='spiky'){A.r(-6,hy-1,13,4,H);for(let i=0;i<6;i++)A.q([-6+i*2.4,hy,-4+i*2.4,hy,-4.5+i*2.4,hy-4-(i%2)*2],H);A.r(-6,hy,3,6,H)}
  else if(P.style==='short'){A.r(-6,hy-1,13,4,H);A.r(-6,hy,3,7,H)}
  if(P.beard){A.r(1,hy+8,7,6,P.beard);A.r(-2,hy+10,5,4,P.beard);A.d(4,hy+9,3,1,drk(sk,.3))}
})}
const CH={
  m:{skin:'#e8b898',hair:'#3d2b20',style:'back',beard:'#4a3223',glasses:'#2a2a2a',lens:'#ffd23a',eye:'#3a4a2a',top:'#8f9298',top2:'#6c6f75',shirt:'#f0f0f0',pants:'#1c1c22',shoes:'#9a9ca2',zip:1},
  vd:{skin:'#f2cfb4',hair:'#e8d07a',style:'spiky',glasses:'#1a1a22',lens:'#d8eaff',top:'#1e2638',top2:'#141a28',shirt:'#f4f4f8',tie:'#6a1a2a',pants:'#1e2638',shoes:'#0a0a0e'},
  st:{skin:'#e8b896',hair:'#5a3a24',style:'long',beard:'#5a3a24',top:'#2a3a5a',top2:'#1e2a44',pants:'#2a2a3a',shoes:'#2a2a2a',wide:1,zip:1}};
// ---------- машины в профиль (смотрят вправо) ----------
function carX6(){return M.spr('car:x6b',A=>{const B='#8a8e96',W='#1a2230';
  A.q([0,-14,2,-30,30,-36,58,-56,110,-58,132,-40,154,-36,160,-24,160,-10,0,-10],B);
  A.q([62,-53,92,-54,92,-40,48,-40],W);A.q([96,-54,108,-54,126,-40,96,-40],W);A.d(93,-55,2,15,drk(B,.15));
  A.d(66,-52,12,2,'#6a7a92');A.d(98,-53,6,2,'#6a7a92');A.d(30,-35,30,1,lit(B,.4));A.d(110,-38,40,1,lit(B,.35));
  A.d(2,-16,154,1,drk(B,.22));A.d(56,-38,1,26,drk(B,.3));A.d(94,-38,1,26,drk(B,.3));A.d(80,-33,6,1,'#c8ccd4');A.d(114,-33,6,1,'#c8ccd4');
  A.r(148,-32,10,4,'#f4f8ff');A.d(150,-31,6,2,'#ffffff');A.d(146,-29,2,1,'#3a8aff');A.r(0,-30,6,5,'#c81e2a');A.d(1,-29,4,1,'#ff5a5a');
  A.r(138,-16,22,5,'#2a2c32');A.d(142,-14,4,2,'#4a4e58');A.d(150,-14,4,2,'#4a4e58');A.r(0,-14,14,4,'#2a2c32');A.d(3,-12,3,2,'#c8ccd4');A.d(8,-12,3,2,'#c8ccd4');
  A.q([16,-24,50,-24,50,-10,16,-10],'#141418');A.q([110,-24,146,-24,146,-10,110,-10],'#141418');
  for(const wx of [33,128]){A.e(wx,-10,15,15,'#141418');A.e(wx,-10,11,11,'#a8acb4');A.e(wx,-10,8,8,'#3a3c44');A.e(wx,-10,3,3,'#c8ccd4');for(let k=0;k<5;k++){const a=k*TAU/5+.3;A.ln(wx+Math.cos(a)*3,-10+Math.sin(a)*3,wx+Math.cos(a)*9,-10+Math.sin(a)*9,'#b8bcc4')}A.d(wx-6,-17,4,2,'#d8dce4')}
  A.d(60,-14,40,1,'#2a2c32');A.d(126,-30,6,1,'#1a1a1e')})}
function carPick(bags){return M.spr('car:pick'+(bags?1:0),A=>{const B='#3a6a9a';
  A.q([0,-10,0,-26,70,-26,74,-44,112,-44,124,-28,150,-26,154,-14,154,-6,0,-6],B);
  A.q([78,-41,96,-41,96,-29,76,-29],'#22303a');A.q([100,-41,110,-41,118,-29,100,-29],'#22303a');A.d(80,-40,8,2,'#5a7a92');
  A.d(0,-26,70,2,drk(B,.25));A.d(4,-24,62,1,'#1a2a3a');
  for(let i=0;i<14;i++){const x=hash(i,5)*150,y=-24+hash(5,i)*16;A.d(x,y,2+hash(i,i)*4,1+hash(i,2)*2,i%2?'#8a4a1a':'#a85a22')}
  A.r(146,-24,6,4,'#f0e8c0');A.r(0,-22,3,5,'#c81e2a');A.r(-2,-10,8,3,'#4a4a50');A.r(148,-10,8,3,'#4a4a50');
  if(bags){A.r(10,-36,22,12,'#2a2a2a');A.d(12,-34,18,1,'#4a4a4a');A.r(34,-34,18,10,'#3a3a2a');A.d(36,-32,14,1,'#5a5a3a');A.r(54,-32,12,8,'#2a2a2a');A.d(16,-38,10,2,'#5a5a5a')}
  for(const wx of [30,124]){A.e(wx,-6,12,12,'#141418');A.e(wx,-6,7,7,'#6a6a70');A.e(wx,-6,3,3,'#2a2a30')}
  A.q([16,-18,44,-18,44,-6,16,-6],'#141418');A.q([110,-18,138,-18,138,-6,110,-6],'#141418');
  for(const wx of [30,124]){A.e(wx,-6,12,12,'#141418');A.e(wx,-6,7,7,'#6a6a70');A.e(wx,-6,3,3,'#2a2a30')}})}
function putS(s,x,y,fl){if(fl){g.save();g.translate(Math.round(x),Math.round(y));g.scale(-1,1);g.drawImage(s.cv,s.x0,s.y0);g.restore()}else g.drawImage(s.cv,Math.round(x+s.x0),Math.round(y+s.y0))}
function shadow(x,y,w){g.fillStyle='rgba(8,4,18,.45)';for(let j=0;j<4;j++){const ww=w*(1-j*.18);g.fillRect(Math.round(x-ww/2),Math.round(y+j-1),Math.round(ww),1)}}
function hero(who,x,y,t,mode,o){const P=Object.assign({},CH[who],o||{});const f=mode==='walk'?Math.floor(t*8)%4:0;shadow(x+1,y,26);putS(person(P,f,mode),x,y,o&&o.flip)}
// ---------- общий кадр: рисуем в 640×360 и выводим на экран ----------
function blit(){CINE.fr=1;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;let sh=0;try{sh=(typeof cut!=='undefined'&&cut&&cut.shake)||0}catch(e){}const W0=ctx.canvas.width,H0=ctx.canvas.height,k=W0/AW;
  const dx=sh?Math.round((Math.random()*2-1)*sh*6)*k:0,dy=sh?Math.round((Math.random()*2-1)*sh*6)*k:0;if(sh){ctx.fillStyle='#000';ctx.fillRect(0,0,W0,H0)}
  // камера: показываем 480×270 → ровно ×2 на экране 960×540 (чёткие пиксели, крупнее герои)
  const cm=CINE.cam||{},z=cm.z||4/3,sw=Math.round(AW/z),shh=Math.round(AH/z),sx=Math.round(Math.max(0,Math.min(AW-sw,(cm.x==null?AW/2:cm.x)-sw/2))),sy=Math.round(Math.max(0,Math.min(AH-shh,(cm.y==null?226:cm.y)-shh/2)));
  ctx.drawImage(cv,sx,sy,sw,shh,dx,dy,W0,H0);ctx.restore()}
function grade(t,o){o=o||{};g.save();// виньетка и лёгкая цветокоррекция
  const v=g.createRadialGradient(AW/2,AH*.55,AH*.35,AW/2,AH*.55,AH*.95);v.addColorStop(0,'rgba(10,0,30,0)');v.addColorStop(1,'rgba(10,0,30,'+(o.vig||.55)+')');g.fillStyle=v;g.fillRect(0,0,AW,AH);
  if(o.grain!==false){g.fillStyle='rgba(255,255,255,.035)';for(let i=0;i<260;i++){const x=(hash(i,Math.floor(t*12))*AW)|0,y=(hash(Math.floor(t*12),i)*AH)|0;g.fillRect(x,y,1,1)}}
  g.restore()}
// кеш слоёв: рисуем fn в отдельный холст один раз
const LAY={};function use(c,fn){const o=g;g=c;try{M.use(c,fn)}finally{g=o}}
function layer(key,w,h,fn){let L=LAY[key];if(!L){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;use(x,fn);L=LAY[key]=c}return L}
const CINE={AW,AH,cv,get g(){return g},use,layer,LAY,R,P,dith,skyBands,glow,cone,txt,txtW,neonTxt,spruceS,forest,birchS,grass,asphalt,motes,person,CH,carX6,carPick,putS,shadow,hero,grade,rgba,lit,drk,mix,hash,
  shot(fn,cam){return function(t,s){CINE.cam=cam?Object.assign({},cam):{};g=cg;g.imageSmoothingEnabled=false;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,AW,AH);try{fn(t,s||this)}catch(e){console.warn('cine',e)}grade(t,this&&this.grade);blit()}}};
window.CINE=CINE;
})();
