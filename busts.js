// busts.js — портреты-арты для диалогов (06.11): сетка 96×96 (вдвое детальнее старых 64×64),
// объём по нормалям, дизеринг-тени, контровой свет цвета фона, блик на очках, моргание и рот по слогам.
// HP[who] = spec. Люди, коты-качки, зомби, крысы. Персонажи без spec рисуются по-старому.
(function(){
'use strict';
const N=96,OUT='#0a090d',BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function hx(c){c=c.replace('#','');return[parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)]}
function mix(a,b,k){const A=hx(a),B=hx(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,'0')).join('')}
const dk=(c,k)=>mix(c,'#000000',k==null?.3:k),lt=(c,k)=>mix(c,'#ffffff',k==null?.3:k);
function Canvas(){const col=new Array(N*N).fill(null),mat=new Uint8Array(N*N);
  const set=(x,y,c,m)=>{x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=N||y>=N)return;col[y*N+x]=c;mat[y*N+x]=m||0};
  const A={col,mat,px:set,
    rect(x,y,w,h,c,m){for(let j=Math.round(y);j<Math.round(y+h);j++)for(let i=Math.round(x);i<Math.round(x+w);i++)set(i,j,c,m)},
    ell(cx,cy,rx,ry,c,m,clip){for(let j=Math.floor(cy-ry);j<=cy+ry;j++)for(let i=Math.floor(cx-rx);i<=cx+rx;i++){const dx=(i+.5-cx)/rx,dy=(j+.5-cy)/ry;if(dx*dx+dy*dy<=1&&(!clip||clip(i,j)))set(i,j,c,m)}},
    poly(pts,c,m){let y0=1e9,y1=-1e9;for(let i=1;i<pts.length;i+=2){y0=Math.min(y0,pts[i]);y1=Math.max(y1,pts[i])}
      for(let j=Math.floor(y0);j<=y1;j++){const py=j+.5,xs=[];for(let a=0,b=pts.length-2;a<pts.length;b=a,a+=2){const xa=pts[a],ya=pts[a+1],xb=pts[b],yb=pts[b+1];if((ya>py)!==(yb>py))xs.push((xb-xa)*(py-ya)/(yb-ya)+xa)}
        xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2)for(let i=Math.ceil(xs[k]-.5);i<xs[k+1]-.5;i++)set(i,j,c,m)}},
    line(x0,y0,x1,y1,c,m){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0||1;for(let i=0;i<=n;i++)set(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,c,m)},
    get(x,y){return(x<0||y<0||x>=N||y>=N)?null:col[y*N+x]}};
  return A}
// тонирование по материалам (1 кожа, 2 волосы/мех, 3 одежда, 4 металл)
function shade(A,light,rim){const out=A.col.slice();
  const solid=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&A.col[y*N+x]!==null;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x,c=A.col[i];if(c===null)continue;const m=A.mat[i];if(m===0)continue;
    let nx=0,ny=0;for(let k=1;k<=4;k++){if(!solid(x-k,y)||A.mat[y*N+x-k]!==m)nx-=1/k;if(!solid(x+k,y)||A.mat[y*N+x+k]!==m)nx+=1/k;if(!solid(x,y-k)||A.mat[(y-k)*N+x]!==m)ny-=1/k;if(!solid(x,y+k)||A.mat[(y+k)*N+x]!==m)ny+=1/k}
    let lv=(-nx*.55-ny*.45);const b=BAY[(y&3)*4+(x&3)]/16-.5;lv+=b*.35;
    let cc=c;if(lv>.55)cc=mix(c,light||'#fff4e8',m===2?.32:m===4?.5:.22);else if(lv>.2)cc=mix(c,light||'#fff4e8',m===2?.14:.1);else if(lv<-.75)cc=mix(c,'#1a0c28',.42);else if(lv<-.3)cc=mix(c,'#2a1438',.24);
    out[i]=cc}
  if(rim)for(let y=0;y<N;y++)for(let x=1;x<N;x++){const i=y*N+x;if(A.col[i]===null||A.mat[i]===0)continue;if(!solid(x-1,y)&&y>8)out[i]=mix(out[i],rim,.7);else if(!solid(x-2,y)&&y>8)out[i]=mix(out[i],rim,.3)}
  return out}
function render(cv,cols){const g=cv.getContext('2d');g.clearRect(0,0,N,N);const has=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&cols[y*N+x]!==null;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=cols[y*N+x];if(c!==null){g.fillStyle=c;g.fillRect(x,y,1,1)}else if(has(x+1,y)||has(x-1,y)||has(x,y+1)||has(x,y-1)){g.fillStyle=OUT;g.fillRect(x,y,1,1)}}}
// ---------- плечи / одежда ----------
function shoulders(A,o){const S=o.suit,w=o.wide?4:o.f?-4:0;
  if(o.kind==='tank'||o.kind==='dress'){A.poly([2-w,96,10-w,80,22-w,72,38,68,58,68,74+w,72,86+w,80,94+w,96],o.skin,1);
    if(o.kind==='tank'){A.poly([30,74,40,70,56,70,66,74,70,96,26,96],S,3);A.rect(30,96-2,40,2,dk(S,.2),3)}
    else{A.poly([30,80,40,76,56,76,66,80,70,96,26,96],S,3);A.line(34,80,30,70,S,3);A.line(62,80,66,70,S,3);if(o.ruffle)for(let x=30;x<68;x+=3)A.px(x,79,lt(S,.35),3)}
    return}
  A.poly([2-w,96,10-w,80,22-w,72,38,68,58,68,74+w,72,86+w,80,94+w,96],S,3);
  if(o.kind==='fur'){for(let i=0;i<70;i++){const x=6+((i*37)%84),y=74+((i*53)%22);A.px(x,y,lt(S,.35),3);A.px(x+1,y+1,dk(S,.2),3)}}
  if(o.kind==='hoodie'){A.poly([26,72,38,64,58,64,70,72,62,78,34,78],dk(S,.15),3);A.line(42,76,40,90,lt(S,.4),3);A.line(54,76,56,90,lt(S,.4),3)}
  if(o.kind==='turtle'){A.rect(38,62,20,10,S,3);for(let y=63;y<71;y+=2)A.line(39,y,57,y,dk(S,.15),3)}
  if(o.kind==='coat'){A.poly([36,68,46,72,46,96,30,96,28,76],dk(S,.12),3);A.line(46,72,46,96,dk(S,.35),3);for(const y of [78,86,94])A.px(43,y,'#c8a040',4)}
  if(o.kind==='tee'&&o.print){A.rect(40,80,16,12,o.print,3)}
  if(o.shirt){A.poly([38,68,58,68,48,90],o.shirt,3);if(o.tie){A.poly([45,72,51,72,52,76,44,76],o.tie,3);A.poly([45,76,51,76,54,96,42,96],o.tie,3);A.line(46,80,50,84,dk(o.tie,.3),3)}}
  if(o.lapel){A.poly([36,68,44,70,42,86,30,78],dk(S,.15),3);A.poly([60,68,52,70,54,86,66,78],dk(S,.2),3);A.line(36,69,42,86,lt(S,.2),3)}
  if(o.zip)A.line(48,70,48,96,lt(S,.35),3);
  if(o.vest)A.poly([10,96,14,80,30,72,40,74,40,96],o.vest,3),A.poly([86,96,82,80,66,72,56,74,56,96],o.vest,3);
  if(o.apron)A.poly([34,80,62,80,66,96,30,96],o.apron,3);
  if(o.necklace)A.line(40,70,48,76,o.necklace,4),A.line(48,76,56,70,o.necklace,4);
  if(o.badge)A.rect(64,80,6,6,o.badge,4)}
// ---------- голова ----------
function head(A,o){const SK=o.skin,f=o.f;A.rect(40,58,16,14,dk(SK,.18),1);
  A.ell(29,46,4,6,SK,1);A.ell(67,46,4,6,SK,1);A.px(29,46,dk(SK,.25),1);A.px(67,46,dk(SK,.25),1);
  const jw=o.jaw||0;A.ell(48,42,f?17:18+jw,21,SK,1);A.poly([31-jw,46,65+jw,46,60+jw,58,52,f?63:64,44,f?63:64,36-jw,58],SK,1);
  for(const ex of [40,56]){A.rect(ex-3,43,7,4,'#f4f0f4',0);A.rect(ex-1,43,4,4,o.eye,0);A.rect(ex,44,2,2,'#0a0a10',0);A.px(ex-1,43,'#ffffff',0);A.rect(ex-4,42,9,1,dk(SK,.45),0)}
  if(f){for(const ex of [40,56]){A.rect(ex-4,41,10,2,'#1a1018',0);A.px(ex+(ex<48?-5:5),40,'#1a1018',0);A.px(ex+(ex<48?-5:5),39,'#1a1018',0)}}
  const bw=f?7:9;A.rect(f?37:36,f?37:38,bw,f?1:2,o.brow,0);A.rect(f?52:51,f?37:38,bw,f?1:2,o.brow,0);if(!f){A.px(44,39,o.brow,0);A.px(51,37,o.brow,0)}
  if(o.angry){A.line(36,36,44,39,o.brow,0);A.line(60,36,52,39,o.brow,0)}
  A.line(49,45,51,53,dk(SK,.22),0);A.rect(46,54,6,1,dk(SK,.2),0);A.px(52,53,dk(SK,.3),0);if(o.nose)A.ell(49,52,4,3,o.nose,1);
  A.rect(34,50,4,2,mix(SK,'#ff6a7a',f?.4:.25),1);A.rect(60,50,4,2,mix(SK,'#ff6a7a',f?.4:.25),1);
  if(o.stub)for(let i=0;i<70;i++){const x=34+((i*29)%28),y=52+((i*17)%12);if(A.get(x,y)===SK)A.px(x,y,dk(SK,.18),1)}
  if(o.scar)A.line(58,36,62,46,dk(SK,.35),0);
  if(o.mole)A.px(58,56,dk(SK,.5),0)}
function mouth(A,o,open,smirk){const L=o.lip;const f=o.f;
  if(open){A.rect(43,58,10,4,'#2a0a14',0);A.rect(44,58,8,1,'#f4f0f0',0);A.rect(44,61,8,1,dk(L,.2),0);if(f)A.rect(43,57,10,1,L,0),A.rect(43,62,10,1,L,0)}
  else if(smirk){A.line(43,59,51,59,dk(L,.35),0);A.line(51,59,54,57,dk(L,.35),0);A.rect(44,60,7,1,L,0)}
  else{A.rect(43,59,10,1,dk(L,.35),0);A.rect(44,60,8,1,L,0);if(f)A.rect(44,58,8,1,L,0),A.rect(45,61,6,1,lt(L,.2),0)}
  if(o.teeth&&!open)A.rect(45,60,2,2,'#f4f0e8',0)}
function blink(A,o){for(const ex of [40,56]){A.rect(ex-4,42,9,5,o.skin,1);A.rect(ex-4,45,9,1,dk(o.skin,.45),0)}}
function glasses(A,o){const F=o.frame;for(const ex of [40,56]){A.rect(ex-6,40,13,1,F,0);A.rect(ex-6,48,13,1,F,0);A.rect(ex-6,40,1,9,F,0);A.rect(ex+6,40,1,9,F,0);if(o.shades)A.rect(ex-5,41,11,7,o.lens,0)}
  A.rect(47,42,2,1,F,0);A.rect(30,42,4,1,F,0);A.rect(62,42,4,1,F,0)}
function glassFx(cols,o){const lens=o.lens;if(!lens||!o.frame)return;for(const ex of [40,56])for(let y=41;y<48;y++)for(let x=ex-5;x<ex+6;x++){const i=y*N+x;if(cols[i]===null)continue;cols[i]=mix(cols[i],lens,o.shades?.6:.22);if((x-ex)+(y-41)===-1||(x-ex)+(y-41)===0)cols[i]=mix(cols[i],'#ffffff',.65)}}
// ---------- причёски ----------
const HAIR={
  spiky(A,o){const H=o.hair,D=dk(H),Lh=lt(H,.35);A.ell(48,33,20,12,H,2,(i,j)=>j<38);A.rect(29,32,4,11,H,2);A.rect(63,32,4,9,H,2);
    const sp=[[30,33,22,22],[35,29,33,15],[41,27,45,12],[48,27,57,14],[55,28,65,17],[61,31,71,25],[44,30,40,17]];for(const [x0,y0,tx,ty] of sp)A.poly([x0-5,y0+5,x0+5,y0+5,tx,ty],H,2);
    for(const [x0,y0,tx,ty] of sp)A.line(x0+1,y0+2,(x0+tx)/2+1,(y0+ty)/2+1,Lh,2);A.line(33,37,63,37,D,2);A.line(36,36,44,34,D,2)},
  back(A,o){const H=o.hair;A.ell(48,30,20,12,H,2,(i,j)=>j<36);A.rect(28,30,6,16,H,2);A.rect(62,30,5,10,H,2);for(let i=0;i<6;i++)A.line(34+i*5,22,30+i*5,34,lt(H,.18),2)},
  long(A,o){const H=o.hair;A.ell(48,30,21,13,H,2,(i,j)=>j<38);A.poly([27,30,34,30,36,80,22,84],H,2);A.poly([62,30,69,30,74,84,60,80],H,2);for(let i=0;i<5;i++)A.line(26+i*2,34,24+i*3,80,lt(H,.15),2)},
  fem(A,o){const H=o.hair,Lh=lt(H,.22),l=o.hl||86;A.ell(48,31,22,14,H,2,(i,j)=>j<40);A.poly([26,30,35,32,34,l,20,l+2],H,2);A.poly([61,32,70,30,76,l+2,62,l],H,2);
    A.poly([30,30,48,24,60,30,58,38,46,36,34,40],H,2);for(let i=0;i<5;i++){A.line(24+i*2,40,22+i*2,l-2,Lh,2);A.line(66+i*2,40,68+i*2,l-2,dk(H,.2),2)}A.line(36,26,52,24,Lh,2);if(o.clip)A.rect(60,32,5,3,o.clip,4)},
  bob(A,o){const H=o.hair;A.ell(48,32,22,14,H,2,(i,j)=>j<40);A.poly([26,30,34,32,34,62,24,60],H,2);A.poly([62,32,70,30,72,60,62,62],H,2);A.rect(32,30,32,6,H,2);A.line(30,28,60,26,lt(H,.25),2)},
  bun(A,o){const H=o.hair;A.ell(48,31,20,12,H,2,(i,j)=>j<38);A.ell(48,16,9,8,H,2);A.rect(28,30,5,10,H,2);A.rect(63,30,5,10,H,2);A.line(42,14,54,14,lt(H,.25),2)},
  short(A,o){const H=o.hair;A.ell(48,31,20,11,H,2,(i,j)=>j<36);A.rect(29,30,4,10,H,2);A.rect(63,30,4,10,H,2);for(let i=0;i<5;i++)A.line(36+i*5,23,34+i*5,30,lt(H,.18),2)},
  buzz(A,o){const H=o.hair;A.ell(48,32,19,10,H,2,(i,j)=>j<34);for(let i=0;i<40;i++)A.px(32+((i*13)%32),23+((i*7)%9),lt(H,.15),2)},
  curly(A,o){const H=o.hair;for(let i=0;i<16;i++){const a=Math.PI+i/15*Math.PI;A.ell(48+Math.cos(a)*19,34+Math.sin(a)*13,6,6,i%2?H:lt(H,.12),2)}A.ell(48,28,16,8,H,2);A.rect(27,32,6,14,H,2);A.rect(63,32,6,14,H,2)},
  quiff(A,o){const H=o.hair;A.ell(48,31,20,11,H,2,(i,j)=>j<36);A.poly([34,30,44,14,64,14,66,28],H,2);A.rect(29,30,4,10,H,2);A.rect(63,30,4,8,H,2);A.line(46,16,62,18,lt(H,.35),2)},
  mohawk(A,o){const H=o.hair;A.ell(48,32,19,9,dk(o.skin,.1),1,(i,j)=>j<34);A.poly([42,30,46,6,52,6,56,30],H,2);for(let y=8;y<30;y+=4)A.line(46,y,52,y-2,lt(H,.3),2)},
  bald(A,o){A.line(40,24,54,23,lt(o.skin,.35),1)}};
function beard(A,o){const B=o.beard;if(o.beardS==='short'){A.poly([34,52,40,60,46,64,52,64,58,58,62,52,60,62,52,68,44,68,36,62],B,2);return}
  A.poly([33,50,38,58,44,64,52,64,58,58,63,50,62,66,52,74,44,74,34,66],B,2);A.rect(42,56,12,2,B,2);for(let i=0;i<6;i++)A.line(38+i*4,64,39+i*4,72,lt(B,.12),2)}
function hats(A,o){if(o.cap){const C=o.cap;A.ell(48,28,21,11,C,3,(i,j)=>j<32);A.poly([28,30,70,30,74,34,26,34],dk(C,.15),3);A.rect(44,22,8,3,lt(C,.3),3)}
  if(o.beanie){const C=o.beanie;A.ell(48,28,21,13,C,3,(i,j)=>j<34);A.rect(27,30,42,6,dk(C,.15),3);for(let x=30;x<66;x+=3)A.line(x,30,x,35,dk(C,.3),3)}
  if(o.band)A.rect(28,32,40,3,o.band,3);
  if(o.headph){const C=o.headph;A.ell(28,46,6,8,C,4);A.ell(68,46,6,8,C,4);A.poly([26,40,30,22,48,14,66,22,70,40,66,40,62,24,48,18,34,24,30,40],C,4)}
  if(o.crown){for(let i=0;i<5;i++)A.poly([30+i*8,24,38+i*8,24,34+i*8,12],'#f0c040',4);A.rect(30,22,40,5,'#f0c040',4);A.rect(46,23,4,3,'#c03aff',0)}
  if(o.earring){A.rect(28,52,2,3,o.earring,4);A.rect(66,52,2,3,o.earring,4)}}
// ---------- особые: зомби, маска гориллы, кот, крыса ----------
function zombify(A,o){for(let i=0;i<N*N;i++)if(A.mat[i]===1)A.col[i]=mix(A.col[i],'#7aa85a',.55);
  for(const ex of [40,56]){A.rect(ex-4,41,9,7,'#3a4a2a',0);A.rect(ex-1,43,4,3,'#c8ff3a',0)}A.rect(56,30,6,4,'#4a6a2a',1);A.line(36,50,42,56,'#3a0a0a',0);A.rect(44,58,10,3,'#2a0a0a',0);A.rect(45,58,2,2,'#e8e0c0',0);A.rect(50,58,2,2,'#e8e0c0',0);
  for(let i=0;i<14;i++)A.px(30+((i*19)%36),70+((i*7)%24),'#2a8a2a',3)}
function gorilla(A,o){const G=o.maskc||'#6a3a9a';A.ell(48,40,24,26,G,2);A.ell(48,50,16,14,o.face||'#3e3044',1);A.rect(34,36,28,5,dk(G,.35),2);
  for(const ex of [40,56]){A.rect(ex-3,42,6,3,'#1a1418',0);A.px(ex,43,'#e8e0e0',0)}A.rect(44,52,2,2,'#1a1418',0);A.rect(50,52,2,2,'#1a1418',0);A.rect(42,58,12,2,'#1a1418',0);
  if(o.visor)A.rect(32,41,32,5,o.visor,4);A.ell(25,44,5,6,G,2);A.ell(71,44,5,6,G,2)}
function catHead(A,o){const F=o.fur,D=dk(F,.35);
  // уши
  A.poly([26,34,30,8,46,26],F,2);A.poly([70,34,66,8,50,26],F,2);A.poly([30,30,32,14,42,26],o.earIn||'#ff8ab8',1);A.poly([66,30,64,14,54,26],o.earIn||'#ff8ab8',1);
  A.ell(48,42,24,22,F,2);A.ell(48,56,14,9,o.muz||lt(F,.08),2);
  if(o.points)A.ell(48,52,13,10,o.points,2);
  for(const ex of [38,58]){A.ell(ex,42,6,5,o.eye,0);A.rect(ex-1,38,2,9,'#0a0a10',0);A.px(ex-2,40,'#ffffff',0)}
  A.poly([45,52,51,52,48,55],o.nose||'#ff8ab8',0);A.line(48,55,48,58,D,0);A.line(48,58,44,60,D,0);A.line(48,58,52,60,D,0);
  for(let i=0;i<3;i++){A.line(34,54+i*2,18,52+i*3,'#d8d8d8',0);A.line(62,54+i*2,78,52+i*3,'#d8d8d8',0)}
  if(o.teeth)for(let i=0;i<5;i++)A.poly([42+i*3,60,44+i*3,60,43+i*3,64],'#ffffff',0);
  if(o.scar)A.line(56,30,62,40,'#ff8ab8',0)}
function catBody(A,o){const F=o.fur;if(o.buff){A.poly([0,96,4,74,20,64,38,62,58,62,76,64,92,74,96,96],F,2);A.ell(30,80,12,9,lt(F,.06),2);A.ell(66,80,12,9,lt(F,.06),2);A.line(48,66,48,96,dk(F,.4),2);if(o.band)A.rect(26,64,44,3,o.band,3)}
  else{A.ell(48,92,26,18,F,2)}}
function ratHead(A,o){const F=o.fur||'#5e504c';A.ell(48,46,22,20,F,2);A.ell(48,60,10,10,lt(F,.1),2);A.ell(28,26,9,10,F,2);A.ell(68,26,9,10,F,2);A.ell(28,26,5,6,'#c88a9a',1);A.ell(68,26,5,6,'#c88a9a',1);
  for(const ex of [40,56]){A.ell(ex,44,3,3,'#ff2020',0);A.px(ex-1,43,'#ffc0c0',0)}A.ell(48,66,3,2,'#ff8ab8',0);A.rect(46,70,2,4,'#f4f0e0',0);A.rect(49,70,2,4,'#f4f0e0',0);
  for(let i=0;i<3;i++){A.line(38,64+i*2,20,62+i*3,'#c8c8c8',0);A.line(58,64+i*2,76,62+i*3,'#c8c8c8',0)}
  A.poly([6,96,14,78,30,72,66,72,82,78,90,96],o.mantle||dk(F,.2),3);if(o.mantle)for(let x=14;x<84;x+=4)A.rect(x,76,2,2,x%8?'#ffffff':'#1a1a1a',3)}
// ---------- спецификации ----------
const SKL='#f2cdb4',SKM='#e8b898',SKD='#d8a080';
const HP={
  m:{skin:SKM,eye:'#4a5a2a',brow:'#3d2b20',lip:'#b8706a',hair:'#3d2b20',hairS:'back',beard:'#4a3223',frame:'#1a1a1a',lens:'#ffd23a',suit:'#8f9298',shirt:'#f0f0f0',zip:1,light:'#fff2dc'},
  s:{f:1,skin:SKL,eye:'#4a5a2a',brow:'#2a1a16',lip:'#e05a8a',hair:'#2a1a16',hairS:'fem',suit:'#ff6fb5',kind:'dress',ruffle:1,light:'#fff2f0',earring:'#ffd23a'},
  vd:{skin:'#f2cfb4',eye:'#3a6a9a',brow:'#c8a860',lip:'#c07a72',hair:'#e8cc6a',hairS:'spiky',frame:'#14141c',lens:'#bfe4ff',suit:'#1e2638',shirt:'#f4f4f8',tie:'#7a1a2e',lapel:1,smirk:1,light:'#fff2dc'},
  st:{skin:'#e8b896',eye:'#5a3a24',brow:'#5a3a24',lip:'#b0706a',hair:'#5a3a24',hairS:'long',beard:'#5a3a24',suit:'#2a3a5a',zip:1,light:'#fff2dc',nose:'#f0a090'},
  a:{skin:'#e2b08a',eye:'#3a2a1a',brow:'#1e1a18',lip:'#a8605a',hair:'#1e1a18',hairS:'short',suit:'#18181c',kind:'turtle',wide:1,jaw:2,smirk:1,light:'#fff2dc'},
  za:{skin:'#e2b08a',eye:'#3a2a1a',brow:'#1e1a18',lip:'#5a3a3a',hair:'#1e1a18',hairS:'short',suit:'#18181c',kind:'turtle',wide:1,jaw:2,zombie:1,light:'#c8ffd8'},
  H:{f:1,skin:'#efc5a5',eye:'#5a4a3a',brow:'#8a6748',lip:'#b0606a',hair:'#8a6748',hairS:'bob',suit:'#4a5a32',kind:'coat',frame:'#6a4a2a',lens:'#e8f0ff',angry:1,light:'#fff2dc',badge:'#c8a040'},
  h:null,
  G:{skin:'#e0a888',eye:'#3a4a6a',brow:'#c8c8c8',lip:'#a8605a',hair:'#c8c8c8',hairS:'short',beard:'#d8d8d8',beardS:'short',suit:'#1e2a3a',kind:'coat',cap:'#1e2a3a',wide:1,jaw:2,nose:'#e89080',light:'#fff2dc'},
  D:{skin:'#d8a080',eye:'#3a2a1a',brow:'#2a4a2a',lip:'#a8605a',hair:'#2a4a2a',hairS:'short',beanie:'#2a4a2a',suit:'#7adf3a',stub:1,light:'#fff2dc'},
  e:{skin:'#e9b994',eye:'#3a2a1a',brow:'#16121a',lip:'#b8706a',hair:'#16121a',hairS:'quiff',frame:'#0c0a10',lens:'#2a1a3a',shades:1,suit:'#ff5aa8',kind:'fur',shirt:'#141418',necklace:'#f0c040',smirk:1,light:'#fff0f8'},
  val:{skin:'#eec8a8',eye:'#4a6a3a',brow:'#3a2a1a',lip:'#b8706a',hair:'#3a2a1a',hairS:'short',suit:'#2a3a2a',kind:'hoodie',headph:'#1a1a22',stub:1,light:'#e8fff0'},
  ol:{f:1,skin:'#f6d6c0',eye:'#3a6a9a',brow:'#c8a060',lip:'#d8506a',hair:'#e8c87a',hairS:'fem',hl:80,suit:'#f4f0e8',kind:'tee',light:'#fff8e8',necklace:'#e8e8f0'},
  pa:{skin:'#e0a888',eye:'#3a4a6a',brow:'#8a8a8a',lip:'#a8605a',hair:'#8a8a8a',hairS:'short',beard:'#9a9a9a',beardS:'short',suit:'#3a5a3a',vest:'#3a4a2a',cap:'#4a5a3a',wide:1,jaw:2,light:'#fff2dc'},
  ma:{f:1,skin:'#f0c8a8',eye:'#5a3a24',brow:'#8a4a2a',lip:'#c8506a',hair:'#8a4a2a',hairS:'bun',suit:'#c84a6a',apron:'#f0e8d8',light:'#fff2dc'},
  dr:{skin:'#e0a888',eye:'#3a2a1a',brow:'#4a3a2a',lip:'#a8605a',hair:'#4a3a2a',hairS:'buzz',suit:'#8a5a2a',kind:'tee',cap:'#c8402a',stub:1,wide:1,jaw:2,light:'#fff2dc'},
  ska:{skin:'#e8b490',eye:'#2a1a10',brow:'#2a1a10',lip:'#b8786a',hair:'#2a1a10',hairS:'buzz',suit:'#e8e8ec',kind:'tank',wide:1,jaw:3,scar:1,light:'#ffe8e0'},
  du:{skin:SKM,eye:'#3a2a1a',brow:'#2a1a10',lip:'#b8706a',hair:'#2a1a10',hairS:'short',suit:'#6a3a9a',mask:1,maskc:'#6a3a9a',visor:'#ecb73c',light:'#f8e8ff'},
  pw:{f:1,skin:'#f0d4c4',eye:'#3a2a2a',brow:'#6a5646',lip:'#a8404a',hair:'#6a5646',hairS:'long',suit:'#141416',kind:'turtle',earring:'#ff2020',angry:1,light:'#ffe8e8'},
  lx:{skin:'#f2cab4',eye:'#4a6a8a',brow:'#9a7a52',lip:'#c07a72',hair:'#9a7a52',hairS:'curly',suit:'#141418',kind:'tee',print:'#ff4fd8',smirk:1,light:'#fff2dc'},
  bm:{skin:'#e8b494',eye:'#3a2a1a',brow:'#c82a2a',lip:'#a8605a',hair:'#c82a2a',hairS:'mohawk',beard:'#4a3020',suit:'#2a2a30',kind:'tee',apron:'#8a5a3a',wide:1,jaw:3,light:'#fff2dc'},
  ak:{skin:'#deac86',eye:'#2a1a10',brow:'#140e0a',lip:'#a8605a',hair:'#140e0a',hairS:'short',suit:'#3a2a6a',kind:'hoodie',headph:'#ff4fd8',stub:1,wide:1,light:'#ffe8ff'},
  vel:{skin:'#eec6aa',eye:'#3a2a20',brow:'#3a2a20',lip:'#a8705a',hair:'#3a2a20',hairS:'short',beard:'#8a6448',beardS:'short',frame:'#1a1a1a',lens:'#c8d8e8',suit:'#55565c',kind:'hoodie',light:'#fff2dc'},
  sat:{f:1,skin:'#f4d2bc',eye:'#4a3a2a',brow:'#6a4430',lip:'#e0707e',hair:'#6a4430',hairS:'fem',hl:90,suit:'#1e1e24',kind:'turtle',earring:'#e8e8f0',light:'#fff2f0'},
  kt:{f:1,skin:SKL,eye:'#3a6a3a',brow:'#9a4a24',lip:'#d07a72',hair:'#9a4a24',hairS:'fem',hl:74,suit:'#4e5a34',kind:'coat',light:'#fff2dc',clip:'#e8b830'},
  r:{f:1,skin:SKL,eye:'#3a6a9a',brow:'#c8a060',lip:'#d8506a',hair:'#c8a060',hairS:'bob',suit:'#c81e3a',shirt:'#ffffff',lapel:1,light:'#fff2f0'},
  bh:{skin:'#d8a070',eye:'#2a1a10',brow:'#5a4a2a',lip:'#a8605a',hair:'#5a4a2a',hairS:'buzz',beard:'#5a4a2a',suit:'#a88a5a',kind:'coat',beanie:'#a88a5a',wide:1,jaw:3,angry:1,light:'#ffe8c8'},
  A:{f:1,skin:'#e8b8a0',eye:'#3a2a2a',brow:'#2a1a16',lip:'#c82a5a',hair:'#e84ab8',hairS:'fem',hl:76,suit:'#141418',kind:'dress',zombie:1,earring:'#ffd23a',light:'#ffe0f8'},
  // коты (большие головы) и крысы
  c:{cat:1,fur:'#1a1a22',eye:'#c6ef4a',light:'#e8ffe0'},C:{cat:1,fur:'#1a1a22',eye:'#c6ef4a',buff:1,band:'#c81e3a',scar:1,light:'#e8ffe0'},
  w:{cat:1,fur:'#e8dcc4',points:'#5a4a40',eye:'#4ab8ff',nose:'#3a2a24',earIn:'#5a4a40',light:'#e8f4ff'},M:{cat:1,fur:'#e8dcc4',points:'#5a4a40',eye:'#4ab8ff',nose:'#3a2a24',earIn:'#5a4a40',buff:1,teeth:1,light:'#e8f4ff'},
  K:{rat:1,fur:'#5e504c',crown:1,light:'#ffe8c8'},rq:{rat:1,fur:'#6e5e5a',crown:1,mantle:'#c8306a',light:'#ffd8f0'}};
HP.al={cat:1,fur:'#8a5a32',points:'#4a2e18',eye:'#c8d040',nose:'#c87a7a',earIn:'#c08a7a',light:'#ffe8c8'};
HP.hr={skin:'#c8b49a',eye:'#ff2020',brow:'#5a6a4a',lip:'#5a3a3a',hair:'#5a6a4a',hairS:'bald',suit:'#1a1a1e',kind:'tank',frame:'#1a1a1e',lens:'#ff2020',shades:1,wide:1,jaw:3,zombie:1,angry:1,scar:1,light:'#ffe0e0'};
HP.h=HP.H;HP.P=HP.G;HP.g=HP.G;HP.d=HP.D;HP.B=HP.du;HP.V=Object.assign({},HP.du,{maskc:'#8a4ac8'});HP.dh=HP.du;
const cache={};
function bust(who,talk,bl){const o=HP[who];const k=who+(talk?1:0)+(bl?1:0)+(window.__dlgRim||'');if(cache[k])return cache[k];
  const A=Canvas();
  if(o.cat){catBody(A,o);catHead(A,o);if(talk){A.rect(44,59,8,4,'#2a0a14',0);A.rect(45,59,6,1,'#ff8ab8',0)}if(bl)for(const ex of [38,58]){A.ell(ex,42,6,5,o.fur,2);A.line(ex-5,42,ex+5,42,'#0a0a10',0)}}
  else if(o.rat){ratHead(A,o);if(o.crown)hats(A,{crown:1});if(talk)A.rect(44,68,8,4,'#2a0a14',0)}
  else{shoulders(A,o);head(A,o);if(o.beard)beard(A,o);if(o.mask)gorilla(A,o);else{HAIR[o.hairS||'short'](A,o);mouth(A,o,talk,o.smirk);if(bl)blink(A,o);if(o.frame)glasses(A,o)}hats(A,o);if(o.zombie)zombify(A,o)}
  const cols=shade(A,o.light,window.__dlgRim);glassFx(cols,o);const cv=document.createElement('canvas');cv.width=cv.height=N;render(cv,cols);return cache[k]=cv}
window.BUSTS={HP,bust,N};
if(typeof drawPortrait==='function'){const od=drawPortrait;window.drawPortrait=function(who,x,y,talking){if(!HP[who])return od(who,x,y,talking);
  const blink=(tm%3.4)>3.25,op=talking&&(Math.floor(tm*9)%2===0);const cv=bust(who,op,blink);u.imageSmoothingEnabled=false;
  const br=Math.sin(tm*1.6)>.6?-.67:0;u.drawImage(cv,x,y+br,64,64)}}
})();
