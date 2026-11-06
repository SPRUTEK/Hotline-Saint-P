// =====================================================================
//  hq.js — общее для всей игры и для глав 5–6:
//  · квартира-штаб: живые персонажи по ходу сюжета, статуэтка Аниса;
//  · полный боезапас на старте каждой миссии;
//  · портреты и спрайты новых героев (Валера, Олеся, Владос, Столыпин,
//    батя, мама, киса Алиса, леший) — ими пользуются level5.js и level6.js.
//  Подключается после minigames.js. Наружу: window.HQ.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.X||!C1.engine){console.warn('hq: нет движка');return}
const X=C1.X,E=C1.engine,PS=C1.PS,TAU=Math.PI*2;
const HQ={};window.HQ=HQ;

// ================= ПОРТРЕТЫ 64×64 =================
// общий каркас лица; o — параметры персонажа
function face(g,o,open,blink){
  g.clearRect(0,0,64,64);
  const SK=o.sk||'#eec4a4',SD=o.sd||shade(SK,.84);
  if(o.back)o.back(g);
  o.body(g);
  P(g,27,43,10,8,SD);
  const hw=o.hw||13,hh=o.hh||16;
  ell(g,32.5,31,hw,hh,SD);ell(g,31.5,30,hw-.5,hh-.5,SK);
  ell(g,32-hw-.5,32,2.6,4,SD);ell(g,32+hw,32,2.6,4,SD);
  const ey=o.ey||30;
  if(blink){P(g,21,ey+1,7,1,shade(SK,.55));P(g,36,ey+1,7,1,shade(SK,.55))}
  else for(const ex of [21,36]){P(g,ex,ey-1,7,4,'#f4f0ea');P(g,ex+2,ey-1,3.5,4,o.eye||'#5a3a22');P(g,ex+2.75,ey-.25,2,2.5,'#140c08');P(g,ex+2.5,ey-.5,.75,.75,'#ffffff');P(g,ex,ey-1.5,7,.5,shade(SK,.5))}
  P(g,20,ey-5,9,2,o.brow||'#3a2a1e');P(g,35,ey-5,9,2,o.brow||'#3a2a1e');
  P(g,30.5,ey+3,2,6,SD);P(g,29.5,ey+8,1,1,shade(SK,.7));P(g,32.5,ey+8,1,1,shade(SK,.7));
  const my=o.my||42,lip=o.lip||'#b06a62';
  if(o.beard)o.beard(g);
  if(open){P(g,27,my,10,4,'#3a1612');P(g,28,my,8,1,'#eeeeee');P(g,27,my-1,10,1,lip);P(g,27,my+4,10,1,lip)}
  else{P(g,27,my,10,1,lip);P(g,28,my+1,8,1,shade(lip,.7))}
  if(o.hair)o.hair(g);
  if(o.glasses)o.glasses(g);
  if(o.extra)o.extra(g,open,blink);
}
const hairStrands=(g,n,x0,x1,y0,y1,c,seed)=>{for(let i=0;i<n;i++){const x=x0+Math.floor(hash(i,seed)*(x1-x0)),y=y0+Math.floor(hash(seed,i)*(y1-y0));P(g,x,y,1,2,c)}};

// Валера: маленький, бородатый, каштановые волосы, задрот с игровой гарнитурой
function pValera(g,open,blink){face(g,{sk:'#eabd9a',eye:'#4a3a24',brow:'#4a2e1a',lip:'#a86058',
  body(g){ell(g,32,74,30,20,'#2e3a2e');ell(g,32,76,24,13,'#3a4a3a');P(g,22,54,20,3,'#26302a');P(g,24,52,16,4,'#3a4a3a');P(g,29,56,6,8,'#26302a');
    P(g,8,58,12,6,'#e8d8a0');P(g,9,59,10,1,'#2a2a2a');P(g,10,61,6,1,'#2a2a2a')}, // принт на худи
  beard(g){ell(g,32,44,15,12,'#5a3a22',(x,y)=>{const dx=Math.abs(x-31.5);return y>=45||(y>=37&&dx>=9)});ell(g,32,52,10,6,'#5a3a22');P(g,24,40,16,2,'#6a4628');hairStrands(g,30,20,44,42,56,'#4a2e18',7)},
  hair(g){ell(g,32,17,15,9,'#5a3a22',(x,y)=>y<=21);P(g,18,16,3,10,'#5a3a22');P(g,43,16,3,10,'#5a3a22');hairStrands(g,26,19,45,10,20,'#7a5232',3);P(g,24,20,6,2,'#5a3a22');P(g,34,20,8,2,'#5a3a22')},
  extra(g,open){ // гарнитура с микрофоном
    P(g,15,10,34,3,'#1a1a20');P(g,15,10,3,12,'#1a1a20');P(g,46,10,3,12,'#1a1a20');ell(g,16,30,4,7,'#1a1a20');ell(g,48,30,4,7,'#1a1a20');P(g,14,27,2,6,'#3af08a');P(g,48,27,2,6,'#3af08a');
    P(g,16,36,2,6,'#1a1a20');P(g,17,41,9,2,'#1a1a20');P(g,25,40,3,3,'#3a3a44')}},open,blink)}
// Олеся: светло-каштановые пышные волны до плеч, красная помада, малиновая блузка, руки в волосах
function pOlesya(g,open,blink){const HR='#9a6a44',HL='#c08a5a',HD='#6e4a2e';face(g,{sk:'#f4cdb0',eye:'#5a4430',brow:'#6a4a32',lip:'#d0102a',hw:12.5,
  back(g){ell(g,32,36,24,24,HR);for(let i=0;i<10;i++){ell(g,9+i*5,52+Math.sin(i)*2,4,6,i%2?HR:HD)}hairStrands(g,60,8,56,16,58,HL,11)},
  body(g){ell(g,32,74,30,20,'#c81e5a');ell(g,10,62,10,10,'#d8306a');ell(g,54,62,10,10,'#d8306a');P(g,10,58,6,1,'#f05a8a');P(g,48,58,6,1,'#f05a8a');
    for(let y=50;y<64;y++){const w=Math.max(0,12-(y-50)*1.2);P(g,32-w/2,y,w,1,'#f4cdb0')}},
  hair(g){ell(g,32,16,16,10,HR,(x,y)=>y<=22);ell(g,19,24,6,12,HR);ell(g,45,24,6,12,HR);ell(g,26,15,8,4,HL);hairStrands(g,40,16,48,8,34,HL,5);hairStrands(g,20,16,48,10,36,HD,9)},
  extra(g){ // руки в волосах
    ell(g,9,22,5,7,'#f4cdb0');ell(g,55,22,5,7,'#f4cdb0');P(g,6,26,4,10,'#d8306a');P(g,54,26,4,10,'#d8306a');P(g,8,16,2,4,HL);P(g,55,16,2,4,HL);
    P(g,22,35,4,1,'#f0a0a0');P(g,39,35,4,1,'#f0a0a0')}},open,blink)}
// Владос: блондин, короткие волосы вверх, тонкие тёмные прямоугольные очки, костюм
function pVlados(g,open,blink){face(g,{sk:'#f2cfb4',eye:'#3a5a7a',brow:'#c8a860',lip:'#b87a70',
  body(g){ell(g,32,74,30,20,'#1e2638');ell(g,32,76,24,12,'#26304a');for(let y=50;y<64;y++){const w=Math.max(2,14-(y-50));P(g,32-w/2,y,w,1,'#f4f4f8')}
    P(g,31,52,3,12,'#5a1a2a');P(g,30,51,5,3,'#6a2a3a');P(g,20,52,8,12,'#2a3450');P(g,36,52,8,12,'#2a3450');P(g,12,60,6,2,'#e8e8f0')},
  hair(g){ell(g,32,17,14,8,'#e8d07a',(x,y)=>y<=21);for(let i=0;i<9;i++)P(g,20+i*3,6+((i*5)%4),3,8,i%2?'#f4e08a':'#d8c068');P(g,18,16,3,7,'#d8c068');P(g,44,16,3,7,'#d8c068');hairStrands(g,18,20,46,7,16,'#fff4b0',4)},
  glasses(g){P(g,19,28,11,1,'#1a1a22');P(g,34,28,11,1,'#1a1a22');P(g,19,33,11,1,'#1a1a22');P(g,34,33,11,1,'#1a1a22');P(g,19,28,1,6,'#1a1a22');P(g,29,28,1,6,'#1a1a22');P(g,34,28,1,6,'#1a1a22');P(g,44,28,1,6,'#1a1a22');P(g,30,30,4,1,'#1a1a22');P(g,16,29,3,1,'#1a1a22');P(g,45,29,3,1,'#1a1a22');P(g,21,29,2,1,'rgba(255,255,255,.6)');P(g,36,29,2,1,'rgba(255,255,255,.6)')},
  extra(g,open){P(g,37,44,4,1,'#b87a70')}},open,blink)} // ухмылка
// Столыпин: длинные коричневые волосы небрежно назад, усы и бородка, круглое лицо, крупный
function pStolypin(g,open,blink){const HR='#5a3a24',HL='#7a5234';face(g,{sk:'#e8b896',eye:'#4a3020',brow:'#4a2e1a',lip:'#a0605a',hw:15,hh:16,
  back(g){ell(g,32,30,18,22,HR);P(g,16,30,6,22,HR);P(g,42,30,6,22,HR);hairStrands(g,30,14,50,30,54,HL,13)},
  body(g){ell(g,32,74,34,22,'#2a3a5a');ell(g,32,76,28,14,'#344a6a');P(g,22,52,20,12,'#3a3a3a');P(g,23,54,6,3,'#c84a2a');P(g,24,55,4,1,'#fff');P(g,40,58,6,5,'#1a1a1a');P(g,12,60,6,4,'#1a1a1a');P(g,44,62,3,2,'#e8c040')},
  beard(g){P(g,24,39,16,3,HR);P(g,23,40,3,4,HR);P(g,38,40,3,4,HR);ell(g,32,50,5,5,HR);hairStrands(g,10,28,36,47,55,HL,3)},
  hair(g){ell(g,32,15,16,8,HR,(x,y)=>y<=19);for(let i=0;i<7;i++)P(g,18+i*4,11+((i*3)%3),4,3,HL);P(g,17,15,4,14,HR);P(g,43,15,4,14,HR);P(g,22,10,3,1,'#2a1a10');P(g,36,12,4,1,'#2a1a10')},
  extra(g){P(g,20,36,4,2,'#e8987a');P(g,40,36,4,2,'#e8987a')}},open,blink)}
// батя (70): лысина, седые виски и усы, очки, клетчатая рубашка
function pBatya(g,open,blink){face(g,{sk:'#e2b08e',eye:'#4a5a6a',brow:'#c8c8c8',lip:'#a06a62',
  body(g){ell(g,32,74,30,20,'#4a6a3a');for(let x=4;x<62;x+=6)P(g,x,56,2,10,'#3a5230');for(let y=56;y<64;y+=4)P(g,4,y,58,1,'#5a8048');P(g,28,52,8,10,'#e2b08e')},
  beard(g){P(g,24,39,16,3,'#d8d8d8');P(g,23,40,3,3,'#c8c8c8');P(g,38,40,3,3,'#c8c8c8')},
  hair(g){ell(g,32,18,12,6,'#e8bc9a',(x,y)=>y<=19);P(g,18,20,4,12,'#d0d0d0');P(g,42,20,4,12,'#d0d0d0');P(g,20,40,1,1,'#c8946e');P(g,25,24,6,1,'#c8946e');P(g,34,23,6,1,'#c8946e')},
  glasses(g){P(g,19,27,11,8,'rgba(200,220,240,.18)');P(g,34,27,11,8,'rgba(200,220,240,.18)');g.strokeStyle='#5a4a3a';g.lineWidth=1;g.strokeRect(19.5,27.5,10,7);g.strokeRect(34.5,27.5,10,7);P(g,30,30,4,1,'#5a4a3a')}},open,blink)}
// мама (70): короткие седые кудри с сиреневым, серьги, кофта в цветочек
function pMama(g,open,blink){face(g,{sk:'#f0c8aa',eye:'#5a6a4a',brow:'#a89aa8',lip:'#c0606a',hw:12.5,
  body(g){ell(g,32,74,30,20,'#8a4a7a');for(let i=0;i<14;i++)P(g,6+Math.floor(hash(i,2)*52),55+Math.floor(hash(2,i)*9),2,2,['#ffd23a','#f4f0f0','#ff9ac8'][i%3]);P(g,24,52,16,4,'#f4f0f0');P(g,28,51,8,6,'#f0c8aa')},
  hair(g){for(let i=0;i<22;i++){const a=Math.PI+i/21*Math.PI,x=32+Math.cos(a)*15,y=24+Math.sin(a)*13;ell(g,x,y,4,4,i%2?'#d8d0e0':'#c0b4cc')}ell(g,32,15,12,5,'#d8d0e0');ell(g,18,30,4,6,'#c0b4cc');ell(g,46,30,4,6,'#c0b4cc')},
  extra(g){P(g,17,37,2,3,'#e8c040');P(g,46,37,2,3,'#e8c040');P(g,22,35,4,1,'#f0a0a0');P(g,38,35,4,1,'#f0a0a0')}},open,blink)}
// киса Алиса: пушистая коричневая табби, рыжеватая грудка
function pAlisa(g,open,blink){
  g.clearRect(0,0,64,64);const F0='#6a4a30',FD='#3a2818',FL='#b07a4a',GI='#d89a5a';
  ell(g,32,66,26,14,F0);for(let i=0;i<40;i++)P(g,8+Math.floor(hash(i,4)*48),54+Math.floor(hash(4,i)*10),1,3,i%3?FL:FD);ell(g,32,60,12,8,GI);
  for(const sx of [1,-1]){for(let y=4;y<26;y++){const k=(y-4)/22,w=Math.round(k*13);const x=sx>0?50-w+Math.round(k*2):14-Math.round(k*2);P(g,x,y,w,1,F0);if(y>10)P(g,sx>0?x+3:x+2,y,Math.max(0,w-5),1,'#c08a7a')}}
  ell(g,32,36,22,19,F0);ell(g,32,46,23,11,F0);
  for(let i=0;i<120;i++){const a=hash(i,9)*TAU,r=17+hash(9,i)*7;P(g,32+Math.cos(a)*r,38+Math.sin(a)*r*.8,1,2,i%2?FL:F0)}
  for(let i=0;i<5;i++)P(g,26+i*3,18,1,8,FD);P(g,18,36,6,1,FD);P(g,40,36,6,1,FD);P(g,17,40,6,1,FD);P(g,41,40,6,1,FD);
  ell(g,32,44,10,8,GI);ell(g,32,47,7,5,'#f0d0a8');
  if(blink){P(g,19,33,9,2,FD);P(g,36,33,9,2,FD)}else{ell(g,23,33,5,4.4,'#c8d040');ell(g,41,33,5,4.4,'#c8d040');P(g,22,30,2,7,'#140c06');P(g,40,30,2,7,'#140c06');P(g,20,31,1,1,'#fff');P(g,38,31,1,1,'#fff')}
  P(g,30,40,4,2,'#d07a7a');
  if(open){P(g,28,44,8,4,'#6a2a3a');P(g,29,44,1,2,'#f0f0f0');P(g,34,44,1,2,'#f0f0f0')}else{P(g,29,44,2,1,FD);P(g,33,44,2,1,FD)}
  g.strokeStyle='#f4ecd8';g.lineWidth=1;g.beginPath();g.moveTo(22,43.5);g.lineTo(5,40.5);g.moveTo(22,45.5);g.lineTo(4,48);g.moveTo(42,43.5);g.lineTo(59,40.5);g.moveTo(42,45.5);g.lineTo(60,48);g.stroke();
}
// зомби-леший: кора, мох, ветви-рога, зелёные глаза
function pLeshy(g,open,blink){
  g.clearRect(0,0,64,64);const BK='#4a3a26',BD='#2a2016',MS='#4a7a2a',ML='#7aa83a';
  g.strokeStyle=BK;g.lineWidth=3;g.beginPath();g.moveTo(20,20);g.lineTo(10,4);g.moveTo(14,12);g.lineTo(4,10);g.moveTo(44,20);g.lineTo(54,3);g.moveTo(50,12);g.lineTo(61,8);g.stroke();
  ell(g,32,72,32,22,BK);for(let i=0;i<30;i++)P(g,4+Math.floor(hash(i,1)*56),52+Math.floor(hash(1,i)*12),2,1,i%2?BD:MS);
  ell(g,32,34,17,22,BK);for(let y=14;y<56;y+=3)P(g,16+((y*7)%5),y,30,1,BD);
  ell(g,32,16,16,6,MS);for(let i=0;i<30;i++)P(g,16+Math.floor(hash(i,3)*32),10+Math.floor(hash(3,i)*10),2,2,i%2?ML:MS);
  for(let i=0;i<18;i++)P(g,18+Math.floor(hash(i,6)*28),44+Math.floor(hash(6,i)*16),1,4,i%2?MS:ML); // борода из мха
  const gl=blink?'#2a4a1a':'#9aff4a';ell(g,24,32,4,3,'#0a1406');ell(g,40,32,4,3,'#0a1406');ell(g,24,32,2.4,1.8,gl);ell(g,40,32,2.4,1.8,gl);
  P(g,30,34,4,8,BD);
  if(open){P(g,25,44,14,6,'#0a1406');for(let i=0;i<4;i++)P(g,26+i*3,44,2,3,'#c8c0a0')}else P(g,25,46,14,2,'#0a1406');
  P(g,44,40,3,3,'#c83a2a');P(g,45,39,1,1,'#fff'); // мухомор на щеке
}
// водитель пикапа
function pDriver(g,open,blink){face(g,{sk:'#d8a882',eye:'#3a2a1a',lip:'#9a5a52',
  body(g){ell(g,32,74,30,20,'#6a5a3a');P(g,26,52,12,10,'#e8e0c8')},
  beard(g){hairStrands(g,40,20,44,38,52,'#5a4a3a',2)},
  hair(g){ell(g,32,16,15,7,'#2a4a8a',(x,y)=>y<=20);P(g,16,18,32,3,'#2a4a8a');P(g,40,19,14,2,'#1a3a6a');P(g,30,13,6,3,'#fff')}},open,blink)}

const NEWP={val:pValera,ol:pOlesya,vd:pVlados,st:pStolypin,pa:pBatya,ma:pMama,al:pAlisa,ls:pLeshy,dr:pDriver};
Object.assign(PORTRAIT,NEWP);
for(const k in NEWP)PCV[k]=mk(64);
Object.assign(NAME,{val:'ВАЛЕРА',ol:'ОЛЕСЯ',vd:'ВЛАДОС',st:'СТОЛЫПИН',pa:'БАТЯ',ma:'МАМА',al:'КИСА АЛИСА',ls:'ЗОМБИ-ЛЕШИЙ',dr:'МУЖИК НА ПИКАПЕ'});
Object.assign(NCOL,{val:'#6ad8ff',ol:'#ff5a8a',vd:'#c8d8ff',st:'#ffb040',pa:'#a8d870',ma:'#ffb0c0',al:'#e8a060',ls:'#9aff4a',dr:'#c8b890'});
Object.assign(BG,{val:['#0a1e2a','#6ad8ff'],ol:['#2a0a18','#ff5a8a'],vd:['#10182a','#c8d8ff'],st:['#2a1a08','#ffb040'],pa:['#14220e','#a8d870'],ma:['#2a1420','#ffb0c0'],al:['#24160a','#e8a060'],ls:['#0a1406','#9aff4a'],dr:['#1e1a10','#c8b890']});

// ================= СПРАЙТЫ СВЕРХУ 24×24 (смотрят вправо) =================
function topValera(g,pipe,sw){ // маленький, худи, гарнитура, труба от унитаза
  g.clearRect(0,0,24,24);const H='#3a4a3a',HD='#26302a',SK='#eabd9a',HR='#5a3a22';
  if(pipe){const a=sw>0?-.9+sw*6:0;g.save();g.translate(14,16);g.rotate(a);P(g,0,-1,13,2,'#e8e8ec');P(g,0,-1,13,.5,'#ffffff');P(g,11,-2,3,4,'#d8d8dc');P(g,0,-1.5,2,3,'#8a8a92');g.restore()}
  P(g,11,14,6,2,SK);P(g,10,7,5,2,SK);
  ell(g,11,12,3.6,6,H);ell(g,10,12,2.4,5.2,HD);
  ell(g,12,12,3.4,3.4,HR);P(g,14,10,2,4,SK);P(g,15,11,1,2,'#4a2e18');P(g,10,8.5,1,7,'#1a1a20');P(g,13,8.5,1,7,'#1a1a20');P(g,9,10,6,1,'#1a1a20');
  outline(g,'#0b0910');
}
function topOlesya(g){ // пышные волны, малиновая блузка
  g.clearRect(0,0,24,24);const HR='#9a6a44',HL='#c08a5a',SK='#f4cdb0';
  P(g,11,15,5,2,SK);P(g,11,7,5,2,SK);ell(g,11,12,4,6.6,'#c81e5a');ell(g,9,7,2,2,'#d8306a');ell(g,9,17,2,2,'#d8306a');
  ell(g,10.5,12,5.2,5,HR);for(let i=0;i<8;i++)P(g,6+Math.floor(hash(i,5)*9),8+Math.floor(hash(5,i)*8),1,1,HL);P(g,14,10,2,4,SK);P(g,15.5,11.5,.5,1,'#d0102a');
  outline(g,'#0b0910');
}
function topVlados(g,saw){ // блондин в костюме
  g.clearRect(0,0,24,24);const S='#1e2638',SL='#2a3450',SK='#f2cfb4';
  if(saw)sawBlade(g,13,saw);else{P(g,11,15,5,2,S);P(g,15,15,2,2,SK);P(g,11,7,5,2,S);P(g,15,7,2,2,SK)}
  ell(g,11,12,4,7,S);ell(g,10,12,2.6,6,SL);P(g,13,9,2,6,'#f4f4f8');P(g,14,11,1,2,'#5a1a2a');
  ell(g,12,12,3.4,3.4,'#e8d07a');P(g,10,10,4,1,'#fff4b0');P(g,14,10,2,4,SK);P(g,15,10,1,4,'#1a1a22');
  outline(g,'#0b0910');
}
function topStolypin(g,saw,can){ // крупный, волосы назад, комбинезон, пузо
  g.clearRect(0,0,24,24);const O='#2a3a5a',OL='#344a6a',SK='#e8b896',HR='#5a3a24';
  if(saw)sawBlade(g,14,saw);else{P(g,12,16,6,2,O);P(g,17,16,2,2,SK);P(g,12,6,6,2,O);P(g,17,6,2,2,SK);if(can){P(g,18,15,3,4,'#d8c040');P(g,18,15,3,1,'#c8c8c8')}}
  ell(g,11,12,5.4,7.6,O);ell(g,13,12,3.4,5,OL);ell(g,14,12,2.2,3.4,'#3a5070');
  P(g,4,11,5,2,HR);ell(g,11,12,3.6,3.6,HR);P(g,14,10,2,4,SK);P(g,16,11,1,2,HR);
  outline(g,'#0b0910');
}
function sawBlade(g,x,ph){ // бензопила в руках: корпус и шина с цепью
  P(g,x-3,8,4,2,'#e8b896');P(g,x-3,14,4,2,'#e8b896');P(g,x,9,6,6,'#e8701a');P(g,x+1,10,4,1,'#ffa04a');P(g,x,8,2,8,'#2a2a2a');
  P(g,x+6,11,9,3,'#b8bcc4');P(g,x+6,11,9,.5,'#e8ecf0');for(let i=0;i<9;i+=2)P(g,x+6+((i+Math.floor(ph*30))%9),10.5,1,4,'#4a4a52');
}
function topParent(g,mama){ // батя — клетчатая рубашка и лысина; мама — сиреневые кудри и кофта
  g.clearRect(0,0,24,24);const C=mama?'#8a4a7a':'#4a6a3a',SK=mama?'#f0c8aa':'#e2b08e';
  P(g,11,15,5,2,C);P(g,15,15,2,2,SK);P(g,11,7,5,2,C);P(g,15,7,2,2,SK);
  ell(g,11,12,4,6.6,C);if(!mama)for(let y=7;y<18;y+=3)P(g,8,y,6,1,'#5a8048');
  if(mama){ell(g,11.5,12,3.8,3.8,'#c0b4cc');for(let i=0;i<6;i++)P(g,9+Math.floor(hash(i,2)*5),9+Math.floor(hash(2,i)*6),1,1,'#d8d0e0')}
  else{ell(g,11.5,12,3.4,3.4,SK);P(g,9,9,3,1,'#d0d0d0');P(g,9,14,3,1,'#d0d0d0');P(g,8,10,1,4,'#d0d0d0')}
  P(g,14,10,2,4,SK);outline(g,'#0b0910');
}
function topCat(g,pal,ph,mv,fluffy){ // кот сверху (Алиса, Мыш)
  g.clearRect(0,0,24,24);const s=mv?Math.round(Math.sin(ph)*1.5):0;
  for(let i=0;i<6;i++)P(g,6-i,12+Math.round(Math.sin(tm*4+i*.8)*1.2),fluffy?2:1,fluffy?2:1,pal.t);
  P(g,8-s,8,2,2,pal.p);P(g,8+s,14,2,2,pal.p);P(g,14+s,8,2,2,pal.p);P(g,14-s,14,2,2,pal.p);
  ell(g,11,12,fluffy?5.4:4.6,fluffy?3.8:3,pal.b);if(fluffy)for(let i=0;i<8;i++)P(g,7+i,9+((i*3)%6),1,1,pal.s);
  ell(g,16.5,12,fluffy?3:2.6,fluffy?3:2.6,pal.b);P(g,17,11,2,2,pal.f);P(g,15,9,2,2,pal.p);P(g,15,14,2,2,pal.p);
  P(g,18,11,1,1,pal.e);P(g,18,13,1,1,pal.e);
  outline(g,'#2a2018');
}
const PAL_ALISA={b:'#6a4a30',s:'#3a2818',t:'#3a2818',p:'#6a4a30',f:'#d89a5a',e:'#c8d040'};
const PAL_MYSH={b:'#efe1c6',s:'#d6c19e',t:'#4a3024',p:'#4a3024',f:'#4a3024',e:'#58b0ff'};
function topEgor(g){ // розовая шуба, ирокез
  g.clearRect(0,0,24,24);const FUR='#ff5aa8',FD='#d63c88',FL='#ff9ccc',SK='#e9b994';
  P(g,12,5,6,3,FUR);P(g,17,5,2,3,SK);P(g,12,16,6,3,FUR);P(g,17,16,2,3,SK);
  ell(g,10.5,12,5.6,8.4,FD);ell(g,10,12,4.8,7.6,FUR);for(let i=0;i<22;i++)P(g,6+Math.floor(hash(i,9)*9),5+Math.floor(hash(9,i)*14),1,1,hash(i,2)<.5?FL:FD);
  ell(g,12.5,12,3.8,3.8,'#a88a74');P(g,9,11,8,2,'#16121a');P(g,15,9,1,7,'#0c0a10');
  outline(g,'#0b0910');
}
HQ.top={topValera,topOlesya,topVlados,topStolypin,topParent,topCat,topEgor,sawBlade,PAL_ALISA,PAL_MYSH};

// ================= КВАРТИРА-ШТАБ =================
// кто живёт в штабе — по пройденным главам
const done=k=>!!(window[k]&&window[k].done);
HQ.has=who=>({anis:done('C1'),egor:done('C4'),mysh:done('C4'),val:done('C5'),ol:done('C5'),vd:done('C6'),st:done('C6')})[who];
HQ.active=()=>scene==='flat'&&state==='play'&&!(C1.on&&C1.mode);
const cv={};for(const k of ['val','ol','vd','st','egor','mysh'])cv[k]=mk(24);for(const k in cv)cv[k].getContext('2d',{willReadFrequently:true});
const SPOT={anis:{x:216,y:150},egor:{x:194,y:164},speaker:{x:204,y:176},mysh:{x:190,y:352},val:{x:150,y:166},ol:{x:124,y:84},vd:{x:196,y:322},st:{x:124,y:124}};
let baked=false;
function bake(){baked=true;topValera(cv.val.getContext('2d'),false,0);topOlesya(cv.ol.getContext('2d'));topVlados(cv.vd.getContext('2d'),0);topStolypin(cv.st.getContext('2d'),0,true);topEgor(cv.egor.getContext('2d'))}
function hqDraw(){
  if(!baked)bake();
  const S0=SPOT;
  if(HQ.has('anis')){const {x,y}=S0.anis;F(x-5,y-2,10,4,'#4a2e1a');F(x-5,y-2,10,1,'#6a4428');F(x-2,y-9,4,7,'#d8a830');F(x-1,y-11,2,2,'#e8c050');F(x+2,y-10,1,8,'#8a6a20');F(x-1,y-8,1,1,'#fff0a0');
    ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,x,y-6,10,'rgba(255,210,80,A)',.25+.1*Math.sin(tm*2));ctx.restore()}
  if(HQ.has('egor')){const {x,y}=S0.speaker;F(x-5,y-6,10,12,'#141418');F(x-3,y-4,6,6,'#2a2a30');F(x-2,y-3,4,4,Math.sin(tm*16)>0?'#3a3a44':'#24242a');F(x-1,y+3,2,2,'#ff4fa3');
    const e=S0.egor,b=Math.abs(Math.sin(tm*4.3))*1.5;shadowBlob(e.x,e.y,6);spr(cv.egor,e.x,e.y-b,Math.PI*.15+Math.sin(tm*2.2)*.5)}
  if(HQ.has('mysh')){const m=S0.mysh;topCat(cv.mysh.getContext('2d'),PAL_MYSH,tm*6,false,false);shadowBlob(m.x,m.y,5);spr(cv.mysh,m.x,m.y,Math.PI/2+Math.sin(tm*10)*.06)}
  if(HQ.has('val')){const v=S0.val;F(v.x+4,v.y-4,7,5,'#2a2a30');F(v.x+5,v.y-3,5,3,Math.sin(tm*7)>0?'#3a8ae8':'#2a6ac8');shadowBlob(v.x,v.y,5);spr(cv.val,v.x,v.y,-.2+Math.sin(tm*9)*.04)}
  if(HQ.has('ol')){const o=S0.ol;spr(cv.ol,o.x,o.y,Math.sin(tm*.8)*.3);if(Math.sin(tm*.7)>.4){F(o.x+6,o.y-3,3,5,'#1a1a22');F(o.x+7,o.y-2,1,3,'#8ac8ff')}}
  if(HQ.has('vd')){const v=S0.vd;shadowBlob(v.x,v.y,5);spr(cv.vd,v.x,v.y,Math.PI*.8);F(v.x-8,v.y+2,3,3,'#f4f4f4');F(v.x-7,v.y+2,1,1,'#6a3a1a')}
  if(HQ.has('st')){const s=S0.st;spr(cv.st,s.x,s.y,Math.sin(tm*.5)*.2);if(Math.sin(tm*1.3)>.6)for(let i=0;i<3;i++)F(s.x+10+i*2,s.y-6-i*3-((tm*8)%3),1,1,'rgba(255,255,255,.6)')}
}
HQ.draw=hqDraw;
// рисуем штаб тем же проходом, что и Микроба (камера уже сдвинута)
const _dm=drawMikrob;
drawMikrob=function(g,w){if(scene==='flat'&&state==='play'&&!cut)try{hqDraw()}catch(e){console.warn(e)}return _dm(g,w)};

// разговоры в штабе (меняются по главам)
const pick=a=>a[(Math.random()*a.length)|0];
HQ.talk={
  anis:()=>say([['m',pick(['Анис. Директор, охотник, самогонщик. Без него мы бы не выбрались из офисов.','Статуэтка Аниса. Шмакодявка сама отлила из латуни. Ружьё — как настоящее.','Спасибо, шеф. Сервер мы так и не починили. Но ты бы понял.'])]]),
  egor:()=>say(pick([[['e','Братан, послушай этот дроп! *делает громче*'],['m','Егор, одиннадцатый час.'],['e','Ханжа сама просила погромче. Ну, почти.']],
    [['e','Мыш теперь каждый день сюда за кормом ходит. Я с ним. Нам тут нравится.']],[['e','Если что — розовый лазер заряжен. Очки на мне.']]])),
  mysh:()=>say([['w',pick(['Хрум-хрум. (Корм у вас вкуснее, чем дома.)','Мяу. (Черсик сказал, что миска общая. Я ему верю.)','Мрр. (Я всё ещё помню протеин.)'])]]),
  val:()=>say(pick([[['val','Плюс один, плюс один! Микроб, не стой над душой, у меня катка.']],[['val','Самолёт на Ваське, заправлен. Если что — звоните. Трубу я тоже взял.']],
    [['val','Я эту трубу теперь не выпускаю. Она у меня как талисман.']]])),
  ol:()=>say(pick([[['ol','У вас тут так уютно! Как будто и не было никакого апокалипсиса.']],[['ol','Учёбу перенесли в онлайн. Буду учиться прямо с вашего дивана, можно?'],['m','Конечно. Только Черсика не сгоняй.']],
    [['ol','Валера опять в CS. Шмакодявка, скажи ему!']]])),
  vd:()=>say(pick([[['vd','Кофе в турке — это база. А не вот это ваше растворимое.']],[['vd','X6 на парковке. Михалыч обещал присмотреть. За отдельную плату.']]])),
  st:()=>say(pick([[['st','*пш-ш-ш* Будешь? ...Нет? Ну и правильно, мне больше достанется.']],[['st','Слышь, Владос опять кофе свой варит. Аристократ, блин.']]])),
};
for(const [k,label] of [['anis','Статуэтка Аниса'],['egor','Егор'],['mysh','Мыш'],['val','Валера'],['ol','Олеся'],['vd','Владос'],['st','Столыпин']]){
  const p=SPOT[k];IT.push({x:p.x,y:p.y,r:16,label:()=>label,cond:()=>HQ.has(k)&&HQ.active()&&!HQ.busy,act:()=>HQ.talk[k]()});
}

// ================= ПОЛНЫЙ БОЕЗАПАС НА СТАРТЕ КАЖДОЙ МИССИИ =================
let lastL=null;
function topUp(){
  let up=false;const fl=(k,v,ok)=>{if(ok&&(PS[k]||0)<v){PS[k]=v;up=true}};
  fl('ammo',80,true);fl('shells',30,PS.hasShotgun);fl('nails',60,PS.hasNail);fl('ext',100,PS.hasExt);fl('cells',8,PS.hasRail);fl('fuel',100,PS.hasFlame);fl('moon',2,C1.done);
  if(up&&L0().armed&&!C1.noWpn)note('Боезапас пополнен до нормы');
}
const L0=()=>E.L||{};
const _upd=update;
update=function(dt){_upd(dt);
  if(C1.on&&(C1.mode==='td'||C1.mode==='car')&&E.L&&E.L!==lastL){lastL=E.L;if(!C1.noWpn&&!window.UP)topUp()}
  if(!C1.on)lastL=null;
};
HQ.topUp=topUp;
})();
