// menuart.js — пиксельная библиотека для титула (03.11): холст 640×360 (1 пиксель = ½ клетки),
// спрайты с объёмом и контуром (как иконки оружия), фоны ночного Питера, деревья, герои со спины.
(function(){
'use strict';
const AW=640,AH=360,OUT='#0a090d',TAU=Math.PI*2;
const cv=document.createElement('canvas');cv.width=AW;cv.height=AH;const g0=cv.getContext('2d');let g=g0;g.imageSmoothingEnabled=false;
const hash=(a,b)=>{const v=Math.sin(a*127.1+b*311.7)*43758.5453;return v-Math.floor(v)};
function hx(c){c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return[parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)]}
function mix(c,t,k){const a=hx(c),b=hx(t);return'#'+a.map((v,i)=>Math.round(v+(b[i]-v)*k).toString(16).padStart(2,'0')).join('')}
const lit=c=>mix(c,'#ffffff',.3),drk=c=>mix(c,'#000000',.38);
// ---------- построитель спрайтов (копия icons.js build + x0) ----------
function build(fn){
  const base=new Map(),det=new Map();const K=(x,y)=>x+','+y;
  const A={
    r(x,y,w,h,c){for(let i=Math.round(x);i<Math.round(x+w);i++)for(let j=Math.round(y);j<Math.round(y+h);j++){base.set(K(i,j),c);det.delete(K(i,j))}},
    q(pts,c){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(let i=0;i<pts.length;i+=2){x0=Math.min(x0,pts[i]);x1=Math.max(x1,pts[i]);y0=Math.min(y0,pts[i+1]);y1=Math.max(y1,pts[i+1])}
      for(let j=Math.floor(y0);j<y1;j++)for(let i=Math.floor(x0);i<x1;i++){const px=i+.5,py=j+.5;let ins=false;
        for(let a=0,b=pts.length-2;a<pts.length;b=a,a+=2){const xa=pts[a],ya=pts[a+1],xb=pts[b],yb=pts[b+1];if((ya>py)!==(yb>py)&&px<(xb-xa)*(py-ya)/(yb-ya)+xa)ins=!ins}
        if(ins){base.set(K(i,j),c);det.delete(K(i,j))}}},
    e(cx,cy,rx,ry,c){for(let j=Math.floor(cy-ry);j<=cy+ry;j++)for(let i=Math.floor(cx-rx);i<=cx+rx;i++){const dx=(i+.5-cx)/rx,dy=(j+.5-cy)/ry;if(dx*dx+dy*dy<=1){base.set(K(i,j),c);det.delete(K(i,j))}}},
    d(x,y,w,h,c){for(let i=Math.round(x);i<Math.round(x+w);i++)for(let j=Math.round(y);j<Math.round(y+h);j++){det.set(K(i,j),c);if(!base.has(K(i,j)))base.set(K(i,j),c)}},
    p(x,y,c){A.d(x,y,1,1,c)},
    ln(x0,y0,x1,y1,c){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0||1;for(let i=0;i<=n;i++)A.d(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),1,1,c)},
  };
  fn(A);
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const k of base.keys()){const [x,y]=k.split(',').map(Number);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
  const w=x1-x0+3,h=y1-y0+3,c=document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d');
  const at=(x,y)=>base.get(K(x,y));
  for(const [k,col0] of base){const [x,y]=k.split(',').map(Number);let col=col0;
    if(!det.has(k)){const up=at(x,y-1),dn=at(x,y+1);if(up!==col0&&!det.has(K(x,y-1)))col=lit(col0);else if(dn!==col0&&!det.has(K(x,y+1)))col=drk(col0)}
    else col=det.get(k);
    q.fillStyle=col;q.fillRect(x-x0+1,y-y0+1,1,1)}
  q.fillStyle=OUT;for(let y=y0-1;y<=y1+1;y++)for(let x=x0-1;x<=x1+1;x++){if(at(x,y))continue;if(at(x+1,y)||at(x-1,y)||at(x,y+1)||at(x,y-1))q.fillRect(x-x0+1,y-y0+1,1,1)}
  return{cv:c,w,h,x0:x0-1,y0:y0-1}}
const SPR={};const spr=(k,fn)=>SPR[k]||(SPR[k]=build(fn));
// put: рисует спрайт так, что его локальная (0,0) попадает в (x,y)
function put(s,x,y,fl){if(fl){g.save();g.translate(Math.round(x),Math.round(y));g.scale(-1,1);g.drawImage(s.cv,s.x0,s.y0);g.restore()}else g.drawImage(s.cv,Math.round(x+s.x0),Math.round(y+s.y0))}
// ---------- примитивы ----------
const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
const P=(x,y,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),1,1)};
function E(cx,cy,rx,ry,c){g.fillStyle=c;for(let j=Math.floor(cy-ry);j<=cy+ry;j++){const dy=(j+.5-cy)/ry;if(Math.abs(dy)>1)continue;const w=Math.sqrt(1-dy*dy)*rx;g.fillRect(Math.round(cx-w),j,Math.round(w*2),1)}}
function sky(top,mid,bot,y1){const st=[top,mid,bot];const n=18;for(let i=0;i<n;i++){const k=i/(n-1);const c=k<.5?mix(top,mid,k*2):mix(mid,bot,(k-.5)*2);R(0,Math.floor(i*y1/n),AW,Math.ceil(y1/n)+1,c)}}
function stars(t,seed,y1,n){for(let i=0;i<(n||90);i++){const x=hash(i,seed)*AW,y=hash(seed,i)*y1,tw=Math.sin(t*(1.5+hash(i,3)*3)+i);if(tw<-.6)continue;const c=tw>.7?'#ffffff':hash(i,7)<.3?'#ffb8e8':'#c8c0ff';P(x,y,c);if(tw>.92&&hash(i,9)<.3){P(x-1,y,'#8a80c8');P(x+1,y,'#8a80c8');P(x,y-1,'#8a80c8');P(x,y+1,'#8a80c8')}}}
function moon(x,y,r,t,col){const gl=g.createRadialGradient(x,y,r*.6,x,y,r*3);gl.addColorStop(0,'rgba(255,190,230,.32)');gl.addColorStop(1,'rgba(255,120,200,0)');g.fillStyle=gl;g.fillRect(x-r*3,y-r*3,r*6,r*6);
  E(x,y,r,r,col||'#ffe0f0');E(x+r*.18,y+r*.12,r*.92,r*.92,mix(col||'#ffe0f0','#d890c0',.25));E(x-r*.2,y-r*.2,r*.7,r*.7,col||'#ffe0f0');
  for(const [dx,dy,rr] of [[-.35,-.1,.18],[.25,.3,.14],[.1,-.45,.1],[-.1,.45,.08]])E(x+dx*r,y+dy*r,rr*r,rr*r,mix(col||'#ffe0f0','#c070a8',.35))}
function cloud(x,y,w,c){for(let i=0;i<w;i+=6){const h=3+hash(i,x|0)*5;R(x+i,y-h,7,h+2,c)}R(x-3,y,w+6,3,c)}
function skyline(base,seed,col,hmin,hmax,win,t){let x=-5;let i=0;while(x<AW){const w=12+Math.floor(hash(i,seed)*26),h=hmin+Math.floor(hash(seed,i)*(hmax-hmin));R(x,base-h,w,h+2,col);
    if(hash(i,seed+1)<.25){R(x+w/2-1,base-h-6,2,6,col)}
    if(win)for(let yy=base-h+4;yy<base-3;yy+=5)for(let xx=x+3;xx<x+w-3;xx+=4){const v=hash(xx,yy+seed);if(v<win){const fl=v<.01&&Math.sin(t*9+xx)>0;R(xx,yy,2,2,fl?col:v<win*.3?'#ff7ad8':v<win*.6?'#ffd27a':'#7ae8ff')}}
    x+=w+Math.floor(hash(i,seed+2)*3);i++}}
// Лахта-центр: закрученный стеклянный шпиль
function lakhta(cx,base,top,t){const H=base-top;for(let y=top;y<base;y++){const k=(y-top)/H,hw=1+k*16+Math.sin(k*3)*1.5,off=Math.sin(k*2.2)*2;
    R(cx-hw+off,y,hw*2,1,mix('#14204a','#2a4a8a',k*.6));R(cx-hw+off,y,1,1,'#5a8ad8');if(y%4===0)R(cx-hw+off+1,y,hw*2-2,1,'rgba(120,200,255,.35)');
    const sw=((y*3+Math.floor(t*20))%40);if(sw<2)R(cx-hw+off,y,hw*2,1,'rgba(160,240,255,.55)')}
  for(let i=0;i<6;i++){const y=base-10-i*((H-20)/6);g.fillStyle='rgba(62,240,176,.5)';g.fillRect(cx-1+Math.sin((y-top)/H*2.2)*2,y,2,1)}
  if(Math.sin(t*3)>0){R(cx-1,top-3,3,3,'#ff3040');const gl=g.createRadialGradient(cx,top-2,0,cx,top-2,8);gl.addColorStop(0,'rgba(255,60,80,.6)');gl.addColorStop(1,'rgba(255,60,80,0)');g.fillStyle=gl;g.fillRect(cx-8,top-10,16,16)}
  R(cx,top-8,1,6,'#8aa8d8')}
// Петропавловка: стена, собор, золотой шпиль с ангелом
function petro(cx,base,t){
  R(cx-110,base-10,220,10,'#2a1e3a');for(let x=cx-110;x<cx+110;x+=8)R(x,base-13,5,3,'#2a1e3a');R(cx-110,base-10,220,1,'#4a3a5a');
  for(const bx of [cx-110,cx-40,cx+60])R(bx,base-18,14,18,'#2e2240');
  R(cx-24,base-38,44,28,'#5a4a5a');R(cx-24,base-38,44,1,'#8a7080');for(let i=0;i<5;i++)R(cx-20+i*8,base-32,3,8,'#ffd27a');
  R(cx-6,base-56,14,18,'#6a5868');R(cx-4,base-70,10,14,'#6a5868');R(cx-2,base-80,6,10,'#8a7a58');
  for(let y=base-80;y>base-170;y--){const k=(base-80-y)/90,w=k<.7?3:2;R(cx+1-w/2+.5,y,w,1,k>.95?'#fff0a0':'#e0ac2e');if((y+Math.floor(t*30))%23===0)R(cx,y,1,1,'#ffffff')}
  const ay=base-176;R(cx,ay,1,8,'#ffd23a');R(cx-3,ay+2,7,1,'#ffd23a');R(cx-1,ay-2,3,3,'#fff0a0');
  const gl=g.createRadialGradient(cx,base-120,0,cx,base-120,40);gl.addColorStop(0,'rgba(255,200,80,.12)');gl.addColorStop(1,'rgba(255,200,80,0)');g.fillStyle=gl;g.fillRect(cx-40,base-160,80,80)}
function water(y0,y1,t,refl){R(0,y0,AW,y1-y0,'#0a0820');for(let y=y0+1;y<y1;y+=2)for(let x=0;x<AW;x+=9){const s=Math.sin(x*.05+t*2+y);if(s>.6)R(x+((y*7)%5),y,4+(s>.9?3:0),1,'#2a2058')}
  if(refl)for(const [x,c] of refl)for(let y=y0+2;y<y1;y+=2)if(Math.sin(y*1.7+t*4+x)>-.3)R(x-1+Math.sin(t*3+y)*1.5,y,3,1,c)}
// ель и берёза (ночные, с неоновой подсветкой края)
function spruce(x,base,h,t,rim){const sw=Math.sin(t*1.3+x*.1)*.8;R(x-1,base-h*.15,3,h*.15,'#2a1a14');
  const tiers=Math.max(3,Math.round(h/12));for(let i=0;i<tiers;i++){const ty=base-h*.12-i*(h*.85/tiers),tw=(tiers-i)*h*.075+3,th=h*.85/tiers*1.5;
    for(let y=0;y<th;y++){const k=y/th,w=Math.max(1,tw*k),off=sw*(1-i/tiers)*0;R(x-w+off,ty-th+y,w*2,1,'#0c2a28');R(x-w+off,ty-th+y,1,1,'#16403a');if(rim)R(x+w-1+off,ty-th+y,1,1,rim)}
    R(x-tw,ty-1,tw*2,1,'#081c1c')}}
function birch(x,base,h,t,rim){const sw=Math.sin(t*1.1+x*.07);
  for(let y=0;y<h;y++){const xx=x+Math.round(sw*y/h*1.5);R(xx-2,base-y,4,1,'#d8d4cc');R(xx+1,base-y,1,1,'#a8a49c');if(hash(y,x)<.18)R(xx-2+((y*3)%3),base-y,2,1,'#1a1a1e')}
  R(x-6,base-h*.55,6,1,'#c8c4bc');R(x+2,base-h*.7,7,1,'#c8c4bc');
  for(let i=0;i<14;i++){const a=hash(i,x)*TAU,rr=hash(x,i)*h*.24,cx=x+Math.cos(a)*rr+sw*2,cy=base-h*.8+Math.sin(a)*rr*.8;
    E(cx,cy,5+hash(i,1)*4,4+hash(1,i)*3,i%3?'#2a5a2a':'#3a7a34');if(i%2)E(cx-1,cy-1,2,1.5,'#5a9a44');if(rim&&Math.cos(a)>.3)R(cx+5,cy-1,1,3,rim)}}
// ---------- пиксельный шрифт 5×7 ----------
const GL={H:['#...#','#...#','#...#','#####','#...#','#...#','#...#'],O:['.###.','#...#','#...#','#...#','#...#','#...#','.###.'],T:['#####','..#..','..#..','..#..','..#..','..#..','..#..'],
  L:['#....','#....','#....','#....','#....','#....','#####'],I:['#####','..#..','..#..','..#..','..#..','..#..','#####'],N:['#...#','##..#','#.#.#','#.#.#','#..##','#...#','#...#'],E:['#####','#....','#....','####.','#....','#....','#####'],
  'П':['#####','#...#','#...#','#...#','#...#','#...#','#...#'],'И':['#...#','#...#','#..##','#.#.#','##..#','#...#','#...#'],'Т':['#####','..#..','..#..','..#..','..#..','..#..','..#..'],
  'Е':['#####','#....','#....','####.','#....','#....','#####'],'Р':['####.','#...#','#...#','####.','#....','#....','#....'],'К':['#...#','#..#.','#.#..','##...','#.#..','#..#.','#...#'],
  'О':['.###.','#...#','#...#','#...#','#...#','#...#','.###.'],'Л':['..###','.#..#','.#..#','.#..#','.#..#','.#..#','##..#'],'М':['#...#','##.##','#.#.#','#.#.#','#...#','#...#','#...#'],
  'Я':['.####','#...#','#...#','.####','..#.#','.#..#','#...#'],'Г':['#####','#....','#....','#....','#....','#....','#....'],'А':['.###.','#...#','#...#','#####','#...#','#...#','#...#'],'Б':['#####','#....','#....','####.','#...#','#...#','####.'],'В':['####.','#...#','#...#','####.','#...#','#...#','####.'],
  'Д':['.###.','.#.#.','.#.#.','.#.#.','.#.#.','#####','#...#'],'Ж':['#.#.#','#.#.#','.###.','..#..','.###.','#.#.#','#.#.#'],'З':['.###.','#...#','....#','..##.','....#','#...#','.###.'],
  'Й':['#.#.#','#...#','#..##','#.#.#','##..#','#...#','#...#'],'Н':['#...#','#...#','#...#','#####','#...#','#...#','#...#'],'С':['.###.','#...#','#....','#....','#....','#...#','.###.'],
  'У':['#...#','#...#','#...#','.####','....#','#...#','.###.'],'Ф':['..#..','.###.','#.#.#','#.#.#','.###.','..#..','..#..'],'Х':['#...#','#...#','.#.#.','..#..','.#.#.','#...#','#...#'],
  'Ц':['#..#.','#..#.','#..#.','#..#.','#..#.','#####','....#'],'Ч':['#...#','#...#','#...#','.####','....#','....#','....#'],'Ш':['#.#.#','#.#.#','#.#.#','#.#.#','#.#.#','#.#.#','#####'],
  'Щ':['#.#.#.','#.#.#.','#.#.#.','#.#.#.','#.#.#.','######','.....#'],'Ъ':['##...','.#...','.#...','.###.','.#..#','.#..#','.###.'],'Ы':['#...#','#...#','#...#','###.#','#.#.#','#.#.#','###.#'],
  'Ь':['#....','#....','#....','####.','#...#','#...#','####.'],'Э':['.###.','#...#','....#','..###','....#','#...#','.###.'],'Ю':['#..##.','#.#..#','#.#..#','###..#','#.#..#','#.#..#','#..##.'],
  'Ё':['#####','#....','#....','####.','#....','#....','#####'],'«':['.....','..#.#','.#.#.','#.#..','.#.#.','..#.#','.....'],'»':['.....','#.#..','.#.#.','..#.#','.#.#.','#.#..','.....'],'-':['....','....','....','####','....','....','....'],'.':['.','.','.','.','.','.','#'],
  ' ':['...','...','...','...','...','...','...'],'S':['.####','#....','#....','.###.','....#','....#','####.'],A:['.###.','#...#','#...#','#####','#...#','#...#','#...#'],P:['####.','#...#','#...#','####.','#....','#....','#....']};
function textW(s,sc,gap){return[...s].reduce((a,ch)=>a+(GL[ch]||GL[' '])[0].length*sc+gap,0)-gap}
// рисует слово: pal — цвета по строкам; cell(x,y,sc,row,col) — своя заливка клетки
function pixText(s,x,y,sc,gap,pal,opt){opt=opt||{};let xx=x;
  for(const pass of opt.cell?['cell']:['sh','ol','fill']){xx=x;[...s].forEach((ch,ci)=>{const rows=GL[ch]||GL[' '];const wob=opt.wob?opt.wob(ci):0;
    rows.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]==='#'){const px=xx+i*sc,py=y+j*sc+wob;
      if(pass==='cell')opt.cell(px,py,sc,j,ci);
      else if(pass==='sh')R(px+Math.max(1,sc/3),py+Math.max(1,sc/3),sc,sc,opt.sh||'#1a0628');
      else if(pass==='ol')R(px-1,py-1,sc+2,sc+2,'#0a0312');
      else{R(px,py,sc,sc,pal[Math.min(pal.length-1,j)]);if(sc>2)R(px,py,sc,1,'rgba(255,255,255,.35)')}}});
    xx+=rows[0].length*sc+gap})}}
const LOGO_W=['#fff6b0','#fff27a','#ffd23a','#ffb12e','#ff8a3a','#ff5a6a','#ff2a7a'],LOGO_P=['#c8fff0','#8affe0','#3ef0b0','#2ad8c8','#28b8d8','#3a8ae8','#5a5ae8'];
function logo(x,y,sc,t){pixText('HOTLINE',x,y,sc,sc,LOGO_W,{wob:i=>Math.round(Math.sin(t*4-i*.8)*1)});pixText('SAINT-P',x,y+sc*9,sc,sc,LOGO_P,{wob:i=>Math.round(Math.sin(t*4-i*.8+2)*1)})}
window.MART={use(c,fn){const o=g;g=c;try{fn()}finally{g=o}},AW,AH,cv,g:g0,hash,mix,lit,drk,build,spr,put,R,P,E,sky,stars,moon,cloud,skyline,lakhta,petro,water,spruce,birch,pixText,textW,logo,GL,OUT,TAU};
})();
