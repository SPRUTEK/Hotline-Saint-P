// =====================================================================
//  ГЛАВА 4 — «Алкопатимен». Микроб и Шмакодявка с Егором спасают кота Мыш,
//  потом Мыш (гипер-кот) и Черсик чистят центр и валят зомби-стриптизёршу Анжелу в клубе «Бардак» на Думской.
//  Подключается после level1.js, level2.js, level3.js. Пользуется движком главы 1.
//  Всё своё держит внутри замыкания, наружу отдаёт только window.C4.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.X||!C1.engine){console.warn('level4: нет движка главы 1');return}
const X=C1.X,E=C1.engine,PS=C1.PS;
const TAU=Math.PI*2;
const D2=(a,b,c,d)=>Math.hypot(c-a,d-b);
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
const C4={on:false,done:false,started:false,sec:null,menu:null,cat:false,zone:null,zoneT:0,kills0:0,cd:0,swing:0,combo:0,comboT:0,slash:null,lastSyr:0,buffM:false};
window.C4=C4;
const sfx=X.sfx;
let L=null;
const Q={};

// ================= МУЗЫКА =================
// треки уже лежат в игре; новые треки автора можно будет подставить сюда
for(const [k,f] of [['trimtryam','trimtryam.mp3'],['smoke','smoke.mp3'],['tommy','tommy.mp3'],['bunker','bunker.mp3'],['rampage','rampage.mp3'],['unmix','unmix.mp3'],['mind','mind.mp3'],['smajte','smajte.mp3']]){if(!MUS[k]){const a=new Audio('music/'+f);a.loop=true;a.preload='auto';a.volume=0;MUS[k]=a}}
const MZ4={call:'flat',yard:'intro',party:'hahaa',flatb:'acid',roof:'pisyat',feed:'trancer',go:'unmix',nevsky:'trance',club:'oster',win:'kalinka',home:'flat',final:'menu'};
C4.MZ=MZ4;
function mz4(k){const n=MZ4[k];if(n&&MUS[n]&&musCur!==n)music(n)}

// ================= ПОРТРЕТЫ =================
function pEgor(g,open,blink){
  g.clearRect(0,0,64,64);
  const SK='#e9b994',SD='#cf9a78',HR='#16121a',FUR='#ff5aa8',FD='#d63c88',FL='#ff9ccc';
  // розовая плюшевая шуба
  ell(g,32,76,34,22,FD);ell(g,8,62,10,10,FUR);ell(g,56,62,10,10,FUR);
  for(let i=0;i<220;i++){const x=Math.floor(hash(i,11)*64),y=50+Math.floor(hash(11,i)*14);if(Math.abs(x-32)<9-(y-50)*.1)continue;P(g,x,y,1,1,hash(i,5)<.5?FL:FUR)}
  // чёрная рубашка и красная футболка
  for(let y=50;y<64;y++){const w=Math.round(6+(y-50)*.9);P(g,32-w/2,y,w,1,'#141418')}
  P(g,29,56,6,8,'#c8283a');P(g,30,58,4,1,'#f0e0e0');
  P(g,24,49,6,3,'#141418');P(g,34,49,6,3,'#141418');
  // цепочка и кулон
  for(let i=0;i<9;i++){P(g,27+i,50+Math.round(Math.abs(i-4)*-.4+2),1,1,'#e8d070')}P(g,31,54,2,3,'#f0dc80');
  // шея и лицо
  P(g,27,43,10,8,SD);
  ell(g,32.5,31,13,16,SD);ell(g,31.5,30,12.5,15.5,SK);
  ell(g,18.5,32,2.6,4,SD);ell(g,45,32,2.6,4,SD);P(g,17,35,1,2,'#d8d8e0');
  // выбритые виски
  ell(g,32,18,14,7,'#9a8070',(x,y)=>y<=19);
  for(let i=0;i<30;i++)P(g,19+Math.floor(hash(i,3)*26),13+Math.floor(hash(3,i)*6),1,1,'#7a6458');
  // высокий зачёсанный ирокез
  ell(g,32,10,8,9,HR);P(g,25,2,14,16,HR);ell(g,33,3,6,3,HR);
  P(g,29,3,2,13,'#3a3040');P(g,34,4,1,10,'#2a2430');
  // большие тёмные квадратные очки
  P(g,18,25,13,1,'#2a2830');P(g,33,25,13,1,'#2a2830');
  P(g,18,26,13,9,'#0c0a10');P(g,33,26,13,9,'#0c0a10');P(g,31,27,2,2,'#0c0a10');
  P(g,20,27,4,1,'#5a5a7a');P(g,35,27,4,1,'#5a5a7a');P(g,20,28,1,2,'#3a3a52');P(g,35,28,1,2,'#3a3a52');
  // нос, щетина, рот
  P(g,30,34,2,5,SD);P(g,29,38,4,1,'#b8866a');
  for(let i=0;i<40;i++){const x=21+Math.floor(hash(i,7)*22),y=38+Math.floor(hash(7,i)*8);if(Math.abs(x-32)<5&&y<42)continue;P(g,x,y,1,1,'#b08a74')}
  if(open){P(g,27,41,10,4,'#5a1f25');P(g,28,41,8,1,'#f4f0ee')}else{P(g,27,42,9,1,'#a0605a');P(g,36,41,1,1,'#a0605a')}
  // рука: палец к виску, кольцо
  ell(g,10,40,5,6,SK);P(g,12,31,9,3,SK);P(g,13,34,6,2,SK);P(g,8,37,5,1,'#c8c8d0');P(g,8,38,5,1,'#8a8a92');
  ell(g,7,52,7,9,FUR);for(let i=0;i<30;i++)P(g,1+Math.floor(hash(i,21)*12),45+Math.floor(hash(21,i)*14),1,1,FL);
}
function siam(g,buff,open,blink){
  g.clearRect(0,0,64,64);
  const CR='#efe1c6',CD='#d6c19e',PT='#4a3024',PD='#2a1a12',EY='#58b0ff';
  if(buff){ell(g,32,68,31,13,CD);ell(g,8,58,10,9,CD);ell(g,56,58,10,9,CD);P(g,3,53,9,1,'#f6ead4');P(g,52,53,9,1,'#f6ead4');P(g,22,59,20,1,'#f6ead4')}
  else ell(g,32,66,22,12,CR);
  for(let y=4;y<28;y++){const k=(y-4)/24,w=Math.round(k*12);P(g,14-Math.round(k*2),y,w,1,PT);P(g,50-w+Math.round(k*2),y,w,1,PT);if(y>9){P(g,15,y,Math.max(0,w-5),1,'#a87070');P(g,49-Math.max(0,w-5),y,Math.max(0,w-5),1,'#a87070')}}
  ell(g,32,36,20,18,CR);ell(g,32,45,22,11,CR);
  ell(g,32,42,11,10,'#8a6a52');ell(g,32,40,8,9,PT);ell(g,32,44,6,5,PD);
  P(g,25,26,14,2,'#c8b08a');
  if(blink){P(g,19,34,9,2,'#3a78b8');P(g,36,34,9,2,'#3a78b8')}
  else{ell(g,23,34,5.5,4.5,EY);ell(g,41,34,5.5,4.5,EY);P(g,22,31,2,7,'#0a0a14');P(g,40,31,2,7,'#0a0a14');P(g,20,32,1,1,'#fff');P(g,38,32,1,1,'#fff')}
  if(buff){for(let i=0;i<9;i++){P(g,17+i,27+Math.floor(i/3),1,2,PD);P(g,46-i,27+Math.floor(i/3),1,2,PD)}}
  P(g,30,40,4,2,'#1a1010');
  if(buff){
    if(open){P(g,21,44,22,13,'#3a0a10');P(g,22,45,20,2,'#6a1a24');for(const x of [22,26,30,34,38])P(g,x,44,3,4,'#f8f4e8');for(const x of [24,28,32,36])P(g,x,53,3,4,'#f8f4e8');P(g,22,44,3,7,'#ffffff');P(g,39,44,3,7,'#ffffff')}
    else{P(g,23,46,18,2,PD);P(g,24,46,3,7,'#ffffff');P(g,37,46,3,7,'#ffffff');P(g,28,46,2,3,'#f8f4e8');P(g,34,46,2,3,'#f8f4e8')}
  }else{
    if(open){P(g,28,44,8,4,'#6a2a3a');P(g,29,44,1,2,'#f0f0f0');P(g,34,44,1,2,'#f0f0f0')}else{P(g,29,44,2,1,PD);P(g,33,44,2,1,PD)}
  }
  g.strokeStyle='#f4f0e6';g.lineWidth=1;g.beginPath();g.moveTo(22,43.5);g.lineTo(6,40.5);g.moveTo(22,45.5);g.lineTo(5,47.5);g.moveTo(42,43.5);g.lineTo(58,40.5);g.moveTo(42,45.5);g.lineTo(59,47.5);g.stroke();
}
const pMysh=(g,o,b)=>siam(g,false,o,b),pMyshBuff=(g,o,b)=>siam(g,true,o,b);
function ratFace(g,F0,o){
  const FD=shade(F0,.72);
  ell(g,13,20,9,10,F0);ell(g,13,20,6,7,'#d8909a');ell(g,51,20,9,10,F0);ell(g,51,20,6,7,'#d8909a');
  if(o.torn){P(g,5,12,5,4,'rgba(0,0,0,0)');g.clearRect(4,11,6,5)}
  ell(g,32,35,17,16,F0);ell(g,32,47,11,8,shade(F0,1.15));ell(g,32,51,3,2,'#e88a9a');
  if(o.blink){P(g,21,33,7,1,'#1a0808');P(g,36,33,7,1,'#1a0808')}
  else{ell(g,24,33,3.4,3.4,o.eye||'#ff2020');ell(g,40,33,3.4,3.4,o.eye||'#ff2020');P(g,23,31,1,1,'#fff');P(g,39,31,1,1,'#fff')}
  g.strokeStyle='#9a928a';g.lineWidth=1;g.beginPath();g.moveTo(22,49.5);g.lineTo(5,46.5);g.moveTo(22,51.5);g.lineTo(6,54.5);g.moveTo(42,49.5);g.lineTo(59,46.5);g.moveTo(42,51.5);g.lineTo(58,54.5);g.stroke();
  if(o.open){P(g,26,54,12,6,'#3a0a10');P(g,29,54,3,5,'#f0e0a0');P(g,32,54,3,5,'#f0e0a0')}else{P(g,29,54,3,4,'#f0e0a0');P(g,32,54,3,4,'#f0e0a0')}
  P(g,22,40,2,1,FD);P(g,40,40,2,1,FD);
}
function gorFace(g,F0,SK,o){ // морда гориллы 64×64
  const FD=shade(F0,.7),FL=shade(F0,1.35);
  ell(g,32,74,32,18,F0);ell(g,8,62,12,12,F0);ell(g,56,62,12,12,F0);for(let i=0;i<40;i++)P(g,2+Math.floor(hash(i,7)*60),52+Math.floor(hash(7,i)*12),1,2,FL);
  ell(g,32,30,22,22,F0);ell(g,32,12,12,8,F0);ell(g,32,10,8,5,FL);
  for(let i=0;i<30;i++)P(g,12+Math.floor(hash(i,3)*40),10+Math.floor(hash(3,i)*20),1,2,FL);
  ell(g,10,34,4,5,SK);ell(g,54,34,4,5,SK);
  ell(g,32,40,16,15,SK);P(g,15,26,34,5,FD);P(g,17,25,30,2,shade(F0,.5));
  if(o.blink){P(g,21,31,7,1,'#0a0606');P(g,36,31,7,1,'#0a0606')}else if(!o.visor){P(g,21,30,7,4,'#1a0c08');P(g,36,30,7,4,'#1a0c08');P(g,23,31,3,2,o.eye);P(g,38,31,3,2,o.eye);P(g,23,31,1,1,'#fff');P(g,38,31,1,1,'#fff')}
  ell(g,32,41,9,6,shade(SK,.8));P(g,26,40,4,3,'#0a0606');P(g,34,40,4,3,'#0a0606');
  if(o.open){P(g,22,48,20,8,'#2a0808');for(let x=23;x<41;x+=3)P(g,x,48,2,2,'#f0e8d0');P(g,23,48,2,5,'#f0e8d0');P(g,39,48,2,5,'#f0e8d0');P(g,26,54,12,2,'#c84a5a')}
  else{P(g,23,50,18,2,'#2a0808');P(g,24,52,16,1,shade(SK,.7))}
}
function headphones(g,c,c2){
  g.strokeStyle=c;g.lineWidth=2.4;g.beginPath();g.arc(32,24,24,Math.PI*1.08,Math.PI*1.92);g.stroke();
  for(const x of [5,59]){ell(g,x,34,6,9,'#141418');ell(g,x,34,4,7,c);P(g,x-1,30,2,8,c2)}
}
function pGorB(g,open,blink){ // DJ БАС — чёрная горилла: розовые наушники, золотая цепь
  g.clearRect(0,0,64,64);
  gorFace(g,'#16161c','#3a3438',{open,blink,eye:'#ff4fa3'});
  headphones(g,'#ff4fd8','#ffffff');
  for(let i=0;i<14;i++)P(g,19+i*2,58+Math.round(Math.abs(i-6.5)*.5),2,2,i%2?'#e8c040':'#c8a020');P(g,29,62,6,2,'#ffd23a');
  if(Math.sin(tm*8)>0){P(g,2,20,2,2,'#ff4fd8');P(g,60,16,2,2,'#3ef0b0')}
}
function pGorV(g,open,blink){ // DJ ФИОЛЕТ — фиолетовая горилла: светящийся визор, кислотные наушники
  g.clearRect(0,0,64,64);
  gorFace(g,'#5a2a8a','#8a6aa8',{open,blink,visor:true,eye:'#3ef0b0'});
  P(g,14,28,36,7,'#0a0a14');const k=Math.floor(tm*10)%8;for(let i=0;i<8;i++)P(g,16+i*4,30,3,3,i===k?'#ffffff':'#3ef0b0');P(g,14,28,36,1,'#7affd8');
  headphones(g,'#3ef0b0','#d4ea4f');
  for(let i=0;i<7;i++)P(g,20+i*4,58,3,6,['#ff4fd8','#3ef0b0','#ffd23a'][i%3]);
}
function pAnzh(g,open,blink){ // Анжела: платиновая грива, бледно-зелёная кожа, розовые губы, горящие розовые глаза, стразы
  g.clearRect(0,0,64,64);const SK='#b8cc a0'.replace(' ',''),SD='#90a880';
  P(g,6,4,52,52,'#e8dcb0');P(g,4,14,6,44,'#e8dcb0');P(g,54,14,6,44,'#e8dcb0');for(let i=0;i<10;i++)P(g,8+i*5,6,2,50,'#f8f0d0');
  P(g,26,46,12,10,SK);P(g,8,56,48,8,SK);P(g,16,56,4,8,'#ff4fd8');P(g,44,56,4,8,'#ff4fd8');
  P(g,16,12,32,36,SK);P(g,18,46,28,3,SK);P(g,14,18,2,22,SK);P(g,48,18,2,22,SK);
  P(g,16,10,32,8,'#f0e4c0');P(g,16,10,8,14,'#f0e4c0');P(g,40,10,8,12,'#f0e4c0');
  P(g,40,26,5,4,SD);P(g,19,36,3,3,SD);P(g,42,34,1,6,'#6a3a3a');
  P(g,19,23,10,2,'#8a3aa8');P(g,35,23,10,2,'#8a3aa8');
  if(blink){P(g,20,27,8,1,'#1a1018');P(g,36,27,8,1,'#1a1018')}else{P(g,20,25,8,5,'#1a1018');P(g,36,25,8,5,'#1a1018');P(g,23,26,3,3,'#ff4fd8');P(g,39,26,3,3,'#ff4fd8');P(g,24,26,1,1,'#ffffff');P(g,40,26,1,1,'#ffffff')}
  P(g,31,30,2,6,SD);
  P(g,25,39,14,4,'#ff2a6a');P(g,27,38,10,1,'#ff5a8a');if(open){P(g,27,40,10,3,'#3a0a14');P(g,28,40,2,1,'#e8e0d0');P(g,34,40,2,1,'#e8e0d0')}
  P(g,24,49,16,3,'#2a2a2a');for(let i=0;i<5;i++)P(g,25+i*3,50,2,1,Math.sin(tm*6+i)>0?'#ffffff':'#c8f0ff');
  P(g,12,32,3,6,'#ffd23a');P(g,49,32,3,6,'#ffd23a');P(g,11,37,5,2,'#ffd23a');P(g,48,37,5,2,'#ffd23a');
  if(Math.sin(tm*7)>0){P(g,4,8,2,2,'#ff4fd8');P(g,58,12,2,2,'#ffd23a')}
}
Object.assign(PORTRAIT,{e:pEgor,w:pMysh,M:pMyshBuff,B:pGorB,V:pGorV,A:pAnzh});
Object.assign(PCV,{e:mk(64),w:mk(64),M:mk(64),B:mk(64),V:mk(64),A:mk(64)});
Object.assign(NAME,{e:'ЕГОР «АЛКОПАТИМЕН»',w:'МЫШ',M:'МЫШ',B:'БАБУРА: БАС',V:'БАБУРА: ФИОЛЕТ',A:'АНЖЕЛА'});
Object.assign(NCOL,{e:'#ff7ac8',w:'#8ac8ff',M:'#58b0ff',B:'#ff4fd8',V:'#3ef0b0',A:'#ff7ad8'});
Object.assign(BG,{e:['#2a0a22','#ff4fa3'],w:['#0e1a2a','#8ac8ff'],M:['#081a2e','#58b0ff'],B:['#140a18','#ff4fd8'],V:['#1a0a2a','#3ef0b0'],A:['#1a0a1a','#ff7ad8']});

// ================= СПРАЙТЫ СВЕРХУ (смотрят вправо, 24×24) =================
const sprE=mk(24),sprS=mk(24),sprC=mk(24),sprW=mk(24),legE=mk(24),legS=mk(24),sprYS=mk(24);
for(const c of [sprE,sprS,sprC,sprW,legE,legS,sprYS])c.getContext('2d',{willReadFrequently:true});
function drawShmTop(g){ // Шмакодявка с дробовиком (как в главе 2)
  g.clearRect(0,0,24,24);const D='#f59cc8',DD='#cf74a2',DL='#ffc4df',SK='#f2cab2',SKD='#d8a890',HR='#2c1a1f',HL='#4c2e36';
  P(g,10,3,6,2,SK);P(g,15,3,1,2,SKD);P(g,10,19,6,2,SK);P(g,15,19,1,2,SKD); // 02.11: без дробовика, со скакалкой
  ell(g,11,12,4.2,7.2,D);ell(g,9.6,12,2.6,6.4,DD);P(g,14,7,1,10,DL);
  ell(g,7.5,12,4.4,3.2,HR);P(g,2,11,4,3,HR);P(g,5,12,4,1,HL);
  ell(g,12,12,4,4,HR);P(g,10,11,4,1,HL);P(g,15,10,2,5,SK);
  hdShmTop(g,0);outline(g,'#0b0910');
}
function drawEgorTop(g,beam){ // Егор: розовая шуба, ирокез, тёмные очки
  g.clearRect(0,0,24,24);const FUR='#ff5aa8',FD='#d63c88',FL='#ff9ccc',SK='#e9b994';
  P(g,12,5,6,3,FUR);P(g,17,5,2,3,SK);P(g,12,16,6,3,FUR);P(g,17,16,2,3,SK);
  ell(g,10.5,12,5.6,8.4,FD);ell(g,10,12,4.8,7.6,FUR);
  for(let i=0;i<22;i++){const x=6+Math.floor(hash(i,9)*9),y=5+Math.floor(hash(9,i)*14);P(g,x,y,1,1,hash(i,2)<.5?FL:FD)}
  P(g,13,9,2,6,'#141418');P(g,14,11,1,2,'#e8d070');
  ell(g,12.5,12,3.8,3.8,'#a88a74');P(g,9,11,8,2,'#16121a');P(g,8,11,2,2,'#2a2430');
  P(g,15,9,1,7,'#0c0a10');P(g,16,10,1,2,'#0c0a10');P(g,16,13,1,2,'#0c0a10');
  if(beam){P(g,16,10,2,2,'#ff7ad8');P(g,16,13,2,2,'#ff7ad8')}
  outline(g,'#0b0910');
}
function drawSiamTop(g,ph,mv,small){ // обычный Мыш сверху
  g.clearRect(0,0,24,24);const CR='#efe1c6',PT='#4a3024';const s=mv?Math.round(Math.sin(ph)*1.5):0;
  for(let i=0;i<5;i++)P(g,6-i,12+Math.round(Math.sin(tm*4+i*.8)*1.2),1,1,PT);
  P(g,8-s,8,2,2,PT);P(g,8+s,14,2,2,PT);P(g,14+s,8,2,2,PT);P(g,14-s,14,2,2,PT);
  ell(g,11,12,4.6,3,CR);ell(g,16.5,12,2.6,2.6,CR);P(g,17,11,2,2,PT);P(g,15,9,2,2,PT);P(g,15,14,2,2,PT);
  P(g,18,11,1,1,'#58b0ff');P(g,18,13,1,1,'#58b0ff');
  outline(g,'#2a2018');
}
function drawSiamBuffTop(g,ph,mv,bite){ // гипер-Мыш сверху: широкая грудь, огромная пасть
  g.clearRect(0,0,24,24);const CR='#efe1c6',CD='#d6c19e',PT='#4a3024',PD='#2a1a12';
  const s=mv?Math.sin(ph):0,o=Math.round(s*2);
  for(let i=0;i<5;i++)P(g,4-i,12+Math.round(Math.sin(tm*4+i*.8)*1.5),1,2,PT);
  P(g,5-o,6,3,2,PT);P(g,5+o,16,3,2,PT);P(g,14+o,4,4,3,PT);P(g,14-o,17,4,3,PT);
  ell(g,8.5,12,5,3.6,CR);ell(g,13.5,12,4.4,6.2,CR);P(g,5,12,7,1,CD);P(g,11,8,5,1,CD);P(g,11,16,5,1,CD);
  ell(g,18.5,12,3.6,3.6,CR);P(g,17,7,2,2,PT);P(g,17,15,2,2,PT);P(g,19,10,3,4,PT);
  P(g,20,10,1,1,'#58b0ff');P(g,20,13,1,1,'#58b0ff');
  if(bite>0){P(g,21,8,3,2,PD);P(g,21,14,3,2,PD);P(g,22,10,2,4,'#3a0a10');P(g,23,9,1,1,'#fff');P(g,23,14,1,1,'#fff')}
  else{P(g,22,11,2,2,PD);P(g,22,10,1,1,'#fff');P(g,22,13,1,1,'#fff')}
  outline(g,'#2a2018');
}
function drawChersikBuffTop(g,ph,mv,sw){ // Черсик-качок (как в главе 3)
  g.clearRect(0,0,24,24);const B='#141219',HL='#34303e',EY='#d4ea4f',CL='#e8ecf4';
  const s=mv?Math.sin(ph):0,o=Math.round(s*2);
  for(let i=0;i<5;i++)P(g,4-i,12+Math.round(Math.sin(tm*4+i*.8)*1.5),1,2,B);
  P(g,5-o,6,3,2,B);P(g,5+o,16,3,2,B);const k=sw>0?3:0;P(g,14+o+k,4,4,3,B);P(g,14-o,17,4,3,B);
  ell(g,8.5,12,5,3.6,B);ell(g,13.5,12,4.4,6.2,B);P(g,5,12,7,1,HL);P(g,11,8,5,1,HL);P(g,11,16,5,1,HL);
  ell(g,18.5,12,3.4,3.4,B);P(g,17,7,2,2,B);P(g,17,15,2,2,B);P(g,21,10,1,1,EY);P(g,21,14,1,1,EY);
  for(let i=0;i<3;i++){P(g,18+o+k,4+i,3,1,CL);P(g,18-o,17+i,3,1,CL)}
  outline(g,'#4a4458');
}
function drawYScoot(g){ // жёлтый самокат сверху (вертикально — вдоль оси Y спрайта)
  g.clearRect(0,0,24,24);P(g,4,10,16,4,'#ffd23a');P(g,4,10,16,1,'#ffe88a');P(g,3,10,2,4,'#1a1a1e');P(g,19,10,2,4,'#1a1a1e');P(g,18,6,2,12,'#2a2a30');P(g,18,5,2,2,'#1a1a1e');P(g,18,17,2,2,'#1a1a1e');outline(g,'#0b0910');
}
drawYScoot(sprYS.getContext('2d'));

// ---- зомби-голуби (тип crawler — без ног), мыши и крысы-бандиты ----
function zPigeon(v,kind){
  const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});
  const G0=['#7a7a86','#6a6a78','#8a8a94','#5e5e6a'][v%4],GD=shade(G0,.72);
  if(kind==='fat'){
    for(let i=0;i<4;i++)P(g,2+i,9+i,2,6-i*2+2,GD);
    ell(g,10,12,7,6,G0);ell(g,9,12,5,4.4,GD);P(g,6,7,7,2,'#4a4a56');P(g,6,15,7,2,'#4a4a56');
    ell(g,16,12,3.6,4,'#3a6a5a');P(g,15,9,2,6,'#7a3a8a');ell(g,19,12,2.6,2.6,G0);
    P(g,21,11,3,2,'#e8b040');P(g,19,10,1,1,'#ff2020');P(g,19,13,1,1,'#ff2020');P(g,16,7,1,3,'#d8d0c0');P(g,17,6,1,2,'#d8d0c0');
    P(g,8,10,2,2,'#8a1a22');P(g,11,14,2,1,'#8a1a22');P(g,6,13,1,2,'#5aa83a');
  }else{
    P(g,2,10,4,4,GD);P(g,1,11,2,2,GD);
    ell(g,10,12,5,3.6,G0);ell(g,9,12,3.4,2.6,GD);
    P(g,7,7,6,2,'#4a4a56');P(g,7,15,6,2,'#4a4a56');if(kind==='bomb'){P(g,5,6,6,2,'#3a3a46');P(g,5,16,6,2,'#3a3a46')}
    ell(g,15,12,2.6,2.8,'#3a6a5a');P(g,14,10,1,4,'#7a3a8a');ell(g,17.5,12,2,2,G0);
    P(g,19,11,2,2,'#e8b040');P(g,18,11,1,1,'#ff2020');P(g,18,13,1,1,'#ff2020');
    P(g,9,10,2,1,'#8a1a22');if(v%2)P(g,11,13,1,2,'#5aa83a');
  }
  outline(g,'#0b0910');return c;
}
function zBandit(kind){ // 32×32, смотрит вправо
  const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});
  const F0=kind==='bull'?'#4a4440':kind==='masl'?'#6a5e52':'#8a847c';
  for(let i=0;i<10;i++)P(g,Math.max(0,7-i),16+Math.round(Math.sin(i*.8)*1.6),1,1,'#b07880');
  ell(g,15,16,8.5,8,F0);
  if(kind==='bull'){ell(g,14,16,8,7.6,'#141418');P(g,10,9,8,2,'#2a2a30');P(g,10,21,8,2,'#2a2a30');P(g,16,12,1,8,'#e8d070');
    P(g,19,22,2,2,'#e9c0b0');P(g,20,24,10,2,'#b07434');P(g,26,24,4,2,'#c88a44')}
  if(kind==='masl'){ell(g,14,16,8,7.6,'#3a3a2a');P(g,18,9,4,2,F0);P(g,20,10,10,2,'#26262a');P(g,15,9,4,3,'#6a4424')}
  if(kind==='sham'){ell(g,14,16,8,7.6,'#2a4a32');for(let i=0;i<7;i++)P(g,16,10+i*2,2,1,['#c84a3a','#3ac87a','#e8c040'][i%3]);P(g,19,21,2,2,F0);P(g,8,24,22,1,'#6a4a2a');P(g,29,22,3,4,'#7aff7a')}
  ell(g,24,16,4.6,4.4,F0);P(g,28,15,2,2,'#e8a0a8');
  P(g,20,10,3,3,'#c08890');P(g,20,19,3,3,'#c08890');
  if(kind==='masl'){ell(g,23,16,4,4,'#4a4a52');P(g,26,13,3,6,'#3a3a42');P(g,27,14,1,1,'#ffcc20');P(g,27,18,1,1,'#ffcc20')}
  else if(kind==='sham'){P(g,26,13,2,2,'#0c0c10');P(g,26,17,2,2,'#0c0c10');P(g,22,14,1,4,'#d8d4cc')}
  else{P(g,26,14,1,1,'#ff2020');P(g,26,18,1,1,'#ff2020');P(g,23,19,3,1,'#c88a8a')}
  outline(g,'#0b0910');return c;
}
for(let v=0;v<4;v++){X.zCache['crawler'+(300+v)]=zPigeon(v,'n');}
for(let v=0;v<2;v++)X.zCache['crawler'+(310+v)]=zPigeon(v,'bomb');
X.zCache['crawler320']=zPigeon(0,'fat');
function zMonkey(v,kind){ // 24×24, смотрит вправо: зомби-тусовщики «Бардака» (tiny — тусовщица, mac — с бутылками, bab — вышибала)
  const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});const SK=['#9ab08a','#a8b890'][v%2];
  if(kind==='tiny'){const top=['#ff4fd8','#3ef0b0'][v%2],hair=['#f0e0a0','#1a1418'][v%2];
    P(g,11,7,8,2,SK);P(g,11,15,8,2,SK);P(g,19,5,1,4,'#7aff3a');P(g,19,15,1,4,'#ff7ad8');
    ell(g,11,12,3.6,6.2,top);ell(g,10,12,2.4,5,shade(top,.7));for(let i=0;i<4;i++)P(g,9+i,9+i*2,1,1,'#ffffff');
    P(g,4,10,7,4,hair);P(g,3,11,2,2,hair);ell(g,13,12,3.4,3.4,hair);P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030');P(g,17,12,1,1,'#ff2a6a');
  }else if(kind==='mac'){const jk=['#3a3a6a','#6a2a4a'][v%2];
    P(g,11,6,9,3,jk);P(g,19,6,3,3,SK);P(g,11,15,9,3,jk);P(g,19,15,3,3,SK);P(g,21,15,4,2,'#2a8a3a');P(g,24,15,2,2,'#5ae87a');
    ell(g,11,12,4.4,7.4,jk);ell(g,9.6,12,3,6.6,shade(jk,.7));for(let i=0;i<5;i++)P(g,8+i,8+i*2,1,1,'#c8c8ff');
    ell(g,12,12,3.8,3.8,['#2a2a2a','#6a4a2a'][v%2]);P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030');P(g,8,11,3,2,'#1a1a1a');
  }else{ // вышибала: шире, чёрная футболка SECURITY, лысый, гарнитура
    g.save();g.translate(12,12);g.scale(1.25,1.25);g.translate(-12,-12);
    P(g,11,5,9,3,'#141418');P(g,19,5,3,3,SK);P(g,11,16,9,3,'#141418');P(g,19,16,3,3,SK);
    ell(g,11,12,5,7.8,'#141418');ell(g,10,12,3.6,6.8,'#0a0a0e');P(g,7,8,1,8,'#ffd23a');
    ell(g,13,12,3.8,3.8,SK);P(g,12,9,2,1,'#2a2a2a');P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030');P(g,11,15,2,1,'#2a2a2a');
    g.restore()}
  outline(g,'#0b0910');return c;
}
function zAnzh(){ // 32×32, смотрит вправо: гигантская зомби-стриптизёрша Анжела
  const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});const SK='#b0c898',SD='#8aa878';
  for(let i=0;i<9;i++)P(g,1+i,7+i%3,8,18-((i%3)*2),i%2?'#f8f0d0':'#e8dcb0'); // волосы веером за спиной
  P(g,16,3,11,3,SK);P(g,26,3,3,3,SD);P(g,28,3,2,2,'#ff2a8a');P(g,16,26,11,3,SK);P(g,26,26,3,3,SD);P(g,28,27,2,2,'#ff2a8a');
  ell(g,15,16,7.5,10,SK);ell(g,15,16,5.6,8.6,'#ff4fd8');ell(g,14,16,3.6,7,'#d82ab8');
  for(let i=0;i<12;i++)P(g,11+((i*7)%9),9+((i*5)%14),1,1,i%3?'#ffd0f0':'#ffffff');
  P(g,12,8,2,2,SD);P(g,17,22,2,2,SD); // трупные пятна
  ell(g,22,16,4.6,4.6,SK);ell(g,20,16,4,5,'#f0e8c8');P(g,18,12,2,8,'#f8f0d8');
  P(g,19,13,1,6,'#ffd23a');P(g,24,14,1,1,'#ff4fd8');P(g,24,18,1,1,'#ff4fd8');P(g,26,15,1,2,'#ff2a6a');
  outline(g,'#0b0910');return c;
}
function zGorilla(kind){ // 32×32, смотрит вправо
  const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});
  const F0=kind==='b'?'#1c1c22':'#5a2a8a',FL=shade(F0,1.5),HP=kind==='b'?'#ff4fd8':'#3ef0b0';
  ell(g,22,6,4,3,F0);ell(g,22,26,4,3,F0);ell(g,25,5,2.4,2,shade(F0,.8));ell(g,25,27,2.4,2,shade(F0,.8));
  ell(g,14,16,10,10,F0);ell(g,12,16,7,8,FL);
  for(let i=0;i<10;i++)P(g,6+Math.floor(hash(i,kind==='b'?1:2)*14),8+Math.floor(hash(kind==='b'?1:2,i)*16),1,1,FL);
  ell(g,24,16,4.6,4.6,F0);ell(g,26,16,2.6,3.2,kind==='b'?'#4a4448':'#9a7ab8');
  P(g,22,10,2,12,HP);P(g,21,9,4,2,'#141418');P(g,21,21,4,2,'#141418');
  if(kind==='b'){for(let i=0;i<6;i++)P(g,18,11+i*2,1,1,'#ffd23a')}else{P(g,26,13,2,6,'#0a0a14');P(g,27,14,1,4,'#3ef0b0')}
  P(g,27,14,1,1,'#ff2020');P(g,27,18,1,1,'#ff2020');
  outline(g,'#0b0910');return c;
}
for(let v=0;v<2;v++){X.zCache['crawler'+(400+v)]=zMonkey(v,'tiny');X.zCache['crawler'+(410+v)]=zMonkey(v,'mac');X.zCache['crawler'+(420+v)]=zMonkey(v,'bab')}
X.zCache['boss250']=zGorilla('b');X.zCache['boss251']=zGorilla('v');X.zCache['boss252']=zAnzh();
const Zmt=(x,y,o)=>E.addZ('crawler',x,y,Object.assign({v:400+((Math.random()*2)|0),hp:20,max:20,sp:62*rnd(.9,1.12),r:3,mk:'tiny'},o||{}));
const Zmc=(x,y,o)=>E.addZ('crawler',x,y,Object.assign({v:410+((Math.random()*2)|0),hp:44,max:44,sp:44*rnd(.9,1.1),r:3.5,mk:'mac',tt:rnd(1.5,3.5)},o||{}));
const Zbb=(x,y,o)=>E.addZ('crawler',x,y,Object.assign({v:420+((Math.random()*2)|0),hp:170,max:170,sp:34,r:5,mk:'bab'},o||{}));
C1.seenT=C1.seenT||{};
const Zp=(x,y,o)=>E.addZ('crawler',x,y,Object.assign({v:300+((Math.random()*4)|0),hp:26,max:26,sp:52*rnd(.9,1.15),r:3.5},o||{}));
const Zpb=(x,y,o)=>E.addZ('crawler',x,y,Object.assign({v:310+((Math.random()*2)|0),hp:34,max:34,sp:30,r:3.5,bomb:true,bt:rnd(1,2.5)},o||{}));
const Zpf=(x,y,o)=>E.addZ('crawler',x,y,Object.assign({v:320,hp:420,max:420,sp:30,r:6,fat:true},o||{}));
const Zm=(x,y,o)=>E.addZ('fast',x,y,Object.assign({v:200+((Math.random()*4)|0),hp:22,max:22,sp:46*rnd(.9,1.1),r:3},o||{}));
function flock(x,y,n,o){for(let i=0;i<n;i++)Zp(x+rnd(-16,16),y+rnd(-12,12),o)}
const Zn=(type,x,y,o)=>E.addZ(type,x,y,o);

// ================= ПОЛЫ, НАВИГАЦИЯ, СТОЛКНОВЕНИЯ =================
const B=(x,y,w,h,c)=>X.B(x,y,w,h,c);
function floor4(x0,y0,x1,y1,kind){
  E.gfill(x0,y0,x1,y1,0);
  for(let y=y0;y<y1;y+=4)for(let x=x0;x<x1;x+=4){const h=hash(x>>2,y>>2),w=Math.min(4,x1-x),hh=Math.min(4,y1-y);let c;
    switch(kind){
      case'parq':{const row=y>>2;c=((x+(row%3)*8)%16===0)?'#4e3420':(h<.15?'#8a5e3a':h>.9?'#6a4628':'#7a5234');break}
      case'tile':c=(x%12===0||y%12===0)?'#7a7a82':(h<.1?'#a8a8ae':'#b4b4ba');break;
      case'kit':c=((x>>3)+(y>>3))%2?'#d8d0c0':'#a89a88';break;
      case'bath':c=(x%8===0||y%8===0)?'#8aa0a6':'#b0c4c8';break;
      case'balc':c=h<.15?'#6a6a70':'#7a7a80';break;
      case'roof':c=h<.08?'#4a4446':h>.94?'#2a2628':'#3a3638';if(h>.985)c='#d8d4cc';break;
      case'asph':c=h<.1?'#34343a':h>.93?'#222228':'#2a2a30';break;
      case'walk':c=(x%16===0||y%16===0)?'#5a5a62':(h<.12?'#76767e':'#6c6c74');break;
      case'club':c=h<.1?'#1e1626':h>.92?'#100c16':'#18121e';break;
      case'stage':c=(x%8===0)?'#1a1a22':'#24242e';break;
      case'dance':c=((x>>4)+(y>>4))%2?'#2a1a3a':'#1a1028';break;
    }
    B(x,y,w,hh,c)}
}
function txt(x,y,t,c,sz){const g=L.bx;g.fillStyle=c;g.font='bold '+(sz||6)+'px monospace';g.textAlign='center';g.fillText(t,x,y);g.textAlign='left'}
function solid(x,y,r){const g=E.gAt;return g(x-r,y-r)||g(x+r,y-r)||g(x-r,y+r)||g(x+r,y+r)||g(x,y)}
function mv(e,dx,dy,r){if(dx){const nx=e.x+dx;if(!solid(nx,e.y,r))e.x=nx}if(dy){const ny=e.y+dy;if(!solid(e.x,ny,r))e.y=ny}}
const DIR8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],NS=8;
function navDir(e){
  if(!L.nd)return null;const nw=L.nw,cx=Math.floor(e.x/NS),cy=Math.floor(e.y/NS);let best=null,bd=1e9;
  for(const [dx,dy] of DIR8){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=nw||ny>=L.nh)continue;const i=ny*nw+nx;if(L.nb[i]||L.nd[i]<0)continue;
    if(dx&&dy&&(L.nb[cy*nw+nx]||L.nb[ny*nw+cx]))continue;const d=L.nd[i]+(dx&&dy?.45:0);if(d<bd){bd=d;best=[nx,ny]}}
  if(!best)return null;return Math.atan2((best[1]+.5)*NS-e.y,(best[0]+.5)*NS-e.x);
}
function kfood(x,y){E.addItem('kfood',x,y)}
function drawKfood(){for(const it of L.items){if(it.taken||it.kind!=='kfood')continue;const y=it.y+Math.sin(tm*3+it.x)*1;F(it.x-3,y-4,6,8,'#e8e0d0');F(it.x-3,y-4,6,2,'#ff4fa3');F(it.x-2,y,4,2,'#141418');F(it.x-1,y,1,1,'#d4ea4f');F(it.x+1,y,1,1,'#d4ea4f');
  const a=.25+.25*Math.sin(tm*5+it.x);ctx.strokeStyle=`rgba(255,122,184,${a})`;ctx.strokeRect(it.x-5.5,y-6.5,11,13)}}
function zoneBanner(t){C4.zone=t;C4.zoneT=2.6}
function trigs(){for(const t of Q.trig){if(t.done)continue;if(D2(pl.x,pl.y,t.x,t.y)<t.r){t.done=true;t.fn()}}}
function rooms(list){const r=list.find(q=>pl.x>q[1]&&pl.x<q[3]&&pl.y>q[2]&&pl.y<q[4]);if(r&&r[0]!==Q.room){Q.room=r[0];zoneBanner(r[0])}}
const hold=()=>!!dlg||!!cut||!!C1.over;

// ================= НАПАРНИКИ: Шмакодявка, Егор, Черсик =================
const QUIPS=['Егор: «Пиу-пиу, детка!»','Егор: «Розовый — цвет победы!»','Егор: «Это вам не караоке с балкона!»','Егор: «Очки от Алкопатимена. Лимитированная серия.»','Егор: «Туса окончена, расходимся!»'];
function addAlly(kind,x,y){const A={kind,x,y,a:-Math.PI/2,ma:0,ph:0,mv:false,cd:rnd(.6,1.2),flash:0,sw:0,quip:rnd(4,9)};Q.allies.push(A);L.npcs.push({draw(){drawAlly(A)}});return A}
function allyTick(A,dt){
  A.cd-=dt;if(A.flash>0)A.flash-=dt;if(A.sw>0)A.sw-=dt;A.quip-=dt;
  if(hold()){A.mv=false;return}
  const d=D2(A.x,A.y,pl.x,pl.y);
  if(d>220){for(let k=0;k<14;k++){const a=pl.a+Math.PI+rnd(-1.2,1.2),r=rnd(14,26),x=pl.x+Math.cos(a)*r,y=pl.y+Math.sin(a)*r;if(!solid(x,y,4)){A.x=x;A.y=y;break}}}
  let tg=null,bd=A.kind==='egor'?210:A.kind==='shmak'?150:125;
  if(L.armed)for(const z of L.zs){if(z.dead||z.st==='hidden'||z.st==='rise')continue;if(z.st==='idle'&&D2(z.x,z.y,pl.x,pl.y)>110)continue;const dz=D2(A.x,A.y,z.x,z.y);if(dz<bd&&E.los(A.x,A.y,z.x,z.y)){bd=dz;tg=z}}
  A.mv=false;let dir=null,sp=0;
  if((A.kind==='chersik'||A.kind==='shmak')&&tg&&D2(tg.x,tg.y,pl.x,pl.y)<170){if(bd>tg.r+(A.kind==='shmak'?16:9)){dir=Math.atan2(tg.y-A.y,tg.x-A.x);if(!E.los(A.x,A.y,tg.x,tg.y))dir=navDir(A);sp=86}}
  else{const i=Q.allies.indexOf(A),side=i%2?1:-1,pa=pl.a+Math.PI/2;
    const bx=pl.x-Math.cos(pl.a)*15+Math.cos(pa)*side*12,by=pl.y-Math.sin(pl.a)*15+Math.sin(pa)*side*12;
    if(d>22&&D2(A.x,A.y,bx,by)>6){dir=(E.los(A.x,A.y,bx,by)&&!solid(bx,by,3.5))?Math.atan2(by-A.y,bx-A.x):navDir(A);sp=d>70?80:62}}
  if(dir!=null){mv(A,Math.cos(dir)*sp*dt,Math.sin(dir)*sp*dt,3.5);A.ma=dir;A.mv=true;A.ph+=dt*13}
  const fa=tg?Math.atan2(tg.y-A.y,tg.x-A.x):(A.mv?A.ma:A.a);A.a+=angDiff(fa,A.a)*Math.min(1,dt*9);
  if(tg&&A.cd<=0&&Math.abs(angDiff(fa,A.a))<.32){
    if(A.kind==='shmak'&&bd<tg.r+24){A.cd=rnd(.6,.85);A.sw=.18;if(window.ARS&&ARS.whipHit)ARS.whipHit(A,tg)}
    if(A.kind==='egor'){A.cd=rnd(2,2.6);A.flash=.3;laser(A,A.a)}
    if(A.kind==='chersik'&&bd<tg.r+11){A.cd=.42;A.sw=.15;sfx('swing',1.2);sfx('bat',.7);C1._src='ally';X.hurtZ(tg,tg.type==='boss'?16:55,fa,tg.type==='boss'?0:130);C1._src=null;
      Q.slashes.push({x:A.x,y:A.y,a:A.a,t:.14})}
  }
  // не стоять на игроке и друг на друге
  const dx=A.x-pl.x,dy=A.y-pl.y,dd=Math.hypot(dx,dy);if(dd<10&&dd>.01)mv(A,dx/dd*(10-dd),dy/dd*(10-dd),3.5);
  for(const O of Q.allies){if(O===A)continue;const ex=A.x-O.x,ey=A.y-O.y,ed=Math.hypot(ex,ey);if(ed<9&&ed>.01)mv(A,ex/ed*(9-ed)/2,ey/ed*(9-ed)/2,3.5)}
}
function laser(A,a){
  const x0=A.x+Math.cos(a)*6,y0=A.y+Math.sin(a)*6;let x1=x0,y1=y0;
  for(let d=0;d<240;d+=3){const x=x0+Math.cos(a)*d,y=y0+Math.sin(a)*d,v=E.gAt(x,y);if(v===1||v===3)break;x1=x;y1=y}
  const len=D2(x0,y0,x1,y1);C1._src='ally';
  for(const z of L.zs.slice()){if(z.dead||z.st==='hidden')continue;const t=(z.x-x0)*Math.cos(a)+(z.y-y0)*Math.sin(a);if(t<0||t>len)continue;
    if(D2(x0+Math.cos(a)*t,y0+Math.sin(a)*t,z.x,z.y)<z.r+3)X.hurtZ(z,z.type==='boss'?38:90,a,90)}
  C1._src=null;Q.beams.push({x0,y0,x1,y1,life:.32});sfx('power',.28);sfx('hiss',.7);
  for(let i=0;i<8;i++)L.fx.push({x:x1,y:y1,vx:rnd(-50,50),vy:rnd(-50,50),life:.25,c:i%2?'#ff7ad8':'#ffffff'});
  if(A.quip<=0){A.quip=rnd(14,22);note(QUIPS[(Math.random()*QUIPS.length)|0])}
}
const allyLeg=mk(24);allyLeg.getContext('2d',{willReadFrequently:true});
function drawAlly(A){
  shadowBlob(A.x,A.y,6);
  if(A.kind==='chersik'){drawChersikBuffTop(sprC.getContext('2d'),A.ph,A.mv,A.sw);spr(sprC,A.x,A.y,A.a);return}
  legs(allyLeg.getContext('2d'),A.ph,A.mv,A.kind==='shmak'?'#f2cab2':'#141418',A.kind==='shmak'?'#0e0e12':'#2a2a30');spr(allyLeg,A.x,A.y,A.mv?A.ma:A.a);
  if(A.kind==='shmak'){drawShmTop(sprS.getContext('2d'));spr(sprS,A.x,A.y,A.a);if(window.ARS&&ARS.drawRope)ARS.drawRope(A.x,A.y,A.a,A.sw||0)}
  else{drawEgorTop(sprE.getContext('2d'),A.flash>0);spr(sprE,A.x,A.y,A.a)}
}

// ================= РАЗДЕЛЫ =================
const CAT_SECS=['nevsky','club'];
function sec4(n){
  C1.on=true;C4.on=true;if(window.C3)C3.on=false;if(window.C2){C2.on=false;C2.zone=null}
  C1.over=null;C1.hurt=0;C1.shake=0;PS.carry=false;PS.inv=1;C1.mdown=false;lockMove=false;dlg=null;
  const s0=X.snap();C4.sec=n;
  C1.retry=()=>{X.restore(s0);PS.lives=3;PS.hp=PS.max;sec4(n)};
  for(const k in Q)delete Q[k];Q.trig=[];Q.allies=[];Q.eb=[];Q.beams=[];Q.slashes=[];Q.ghosts=[];Q.clouds=[];Q.lasers=[];Q.rings=[];Q.strobe=0;Q.room=null;setRate(1);
  C1.mode='td';scene='c4td';C1.seenT.crawler=1;
  const cat=CAT_SECS.includes(n);C4.cat=cat;C1.noWpn=cat;
  if(cat){PS.wpn='bite';C4.slash=null;C4.swing=0;C4.cd=.3;C4.lastSyr=PS.syr}else if(PS.wpn!=='bat')PS.wpn='pistol';
  if(n==='yard4'){lvYard4();mz4('yard')}
  if(n==='flatb'){lvFlatB();mz4('flatb')}
  if(n==='roof'){lvRoof();mz4('roof')}
  if(n==='nevsky'){lvNevsky();mz4('nevsky')}
  if(n==='club'){lvClub();mz4('club')}
  L=E.L;if(cat){L.hero=HERO_M;L.noHud=true}
  const lu=L.drawUnder,lo=L.drawOver;L.drawUnder=()=>{if(lu)lu();drawKfood()};L.drawOver=()=>{if(lo)lo();drawFx4()};
  const oi=L.onItem;L.onItem=it=>{if(it.kind==='kfood'){PS.syr++;C4.lastSyr=PS.syr;X.floatT(it.x,it.y,'+корм','#ff7ab8')}if(oi)oi(it)};
  C1.cx=clamp(pl.x-W/2,0,Math.max(0,L.w-W));C1.cy=clamp(pl.y-H/2,0,Math.max(0,L.h-H));if(L.w<=W)C1.cx=(L.w-W)/2;if(L.h<=H)C1.cy=(L.h-H)/2;
  camX=Math.round(C1.cx);camY=Math.round(C1.cy);
}
C4.go=sec4;
function playC4(shots,onEnd,k){C1.on=true;C4.on=true;C1.mode='cut';C1.noWpn=true;if(k)mz4(k);for(const s of shots)s._f={};playCut(shots,()=>X.go(onEnd))}
const HERO_M={draw:(g,w)=>drawSiamBuffTop(g,pl.ph,pl.mv,C4.swing),leg:'rgba(0,0,0,0)',shoe:'rgba(0,0,0,0)'};

// ---------- ДВОР: встречаем Егора ----------
const GATE={x:206,y:250},HZ4={x:180,y:236};
function lvYard4(){
  L=E.mkLevel('yard4',YW,YH);
  L.bx.drawImage(yardCv,0,0);
  E.gfill(0,0,YW,YH,0);
  for(const s of ysolids)E.gfill(s.x,s.y,s.x+s.w,s.y+s.h,1);
  E.gfill(0,0,2,YH,1);E.gfill(YW-2,0,YW,YH,1);E.gfill(0,YH-2,YW,YH,1);E.gfill(198,252,214,258,1);
  L.lights.push([100,122,46,.8],[260,122,46,.8],[100,222,46,.8],[260,222,46,.8]);for(const c of ENTR)L.lights.push([c,92,22,.7]);
  L.glow.push([100,122,40,'rgba(255,190,110,A)',.2],[260,122,40,'rgba(255,190,110,A)',.2],[100,222,40,'rgba(255,190,110,A)',.2],[260,222,40,'rgba(255,190,110,A)',.2]);
  L.dark=.36;L.tint='24,8,34';L.armed=false;
  X.buildNav();
  pl.x=ENTR[MY_ENTR];pl.y=114;pl.a=Math.PI/2;pl.ma=pl.a;pl.scoot=false;pl.sit=false;
  addAlly('shmak',pl.x+14,pl.y+4);
  const hz={x:HZ4.x,y:HZ4.y,a:Math.PI/2},gu={x:268,y:196,a:Math.PI},jan={x:60,y:120,a:0,d:1};
  Q.eg={x:GATE.x,y:300,a:-Math.PI/2,st:0,path:[{x:GATE.x,y:244},{x:214,y:222}]};Q.park=null;
  L.npcs.push(
    {draw(){shadowBlob(hz.x,hz.y,5);X.drawSoldier(X.sprN.getContext('2d'),tm,{body:'#4a5a32',head:'#2e3a22',hair:'#8a6748',sk:'#efc5a5',gun:true});spr(X.sprN,hz.x,hz.y,hz.a)}},
    {draw(){shadowBlob(gu.x,gu.y,5);X.drawSoldier(X.sprN.getContext('2d'),tm,{body:'#3a4a2a',head:'#4a5a3a',gun:false});spr(X.sprN,gu.x,gu.y,gu.a)}},
    {draw(){shadowBlob(jan.x,jan.y,6);drawJan(sprJ.getContext('2d'),tm);spr(sprJ,jan.x,jan.y,jan.a)}},
    {draw(){const e=Q.eg;if(Q.park){spr(sprYS,Q.park.x,Q.park.y,Math.PI/2)}if(e.st<0)return;shadowBlob(e.x,e.y,6);if(e.st===1||e.st===0)spr(sprYS,e.x,e.y,e.a+Math.PI/2);
      if(e.st>=2){legs(allyLeg.getContext('2d'),0,false,'#141418','#2a2a30');spr(allyLeg,e.x,e.y,e.a)}drawEgorTop(sprE.getContext('2d'),false);spr(sprE,e.x,e.y,e.a)}},
  );
  L.onUpdate=dt=>{
    jan.x+=jan.d*7*dt;if(jan.x>110)jan.d=-1;if(jan.x<40)jan.d=1;jan.a=jan.d>0?0:Math.PI;
    if(D2(pl.x,pl.y,gu.x,gu.y)<44)gu.a=Math.atan2(pl.y-gu.y,pl.x-gu.x);
    const e=Q.eg;
    if(e.st===1&&!hold()){const tg=e.path[0],dx=tg.x-e.x,dy=tg.y-e.y,d=Math.hypot(dx,dy),sp=64*dt;
      if(d<sp){e.x=tg.x;e.y=tg.y;e.path.shift();if(!e.path.length){e.st=2;Q.park={x:226,y:238};sfx('click');e.a=Math.atan2(pl.y-e.y,pl.x-e.x)}}else{e.x+=dx/d*sp;e.y+=dy/d*sp;e.a=Math.atan2(dy,dx)}}
    if(e.st>=2&&e.st<9)e.a=Math.atan2(pl.y-e.y,pl.x-e.x);
    if(e.st===2&&!Q.met&&!dlg&&D2(pl.x,pl.y,e.x,e.y)<52){Q.met=1;meetEgor()}
    hz.a=e.st>=1?Math.atan2(e.y-hz.y,e.x-hz.x):Math.PI/2;
  };
  L.obj=()=>!Q.met?['Встретить Егора у калитки']:Q.ready?['Идти в подъезд бати (2-й подъезд)']:[];
  L.its=[
    {get x(){return Q.eg.x},get y(){return Q.eg.y},r:22,label:()=>'Егор',cond:()=>Q.eg.st===2&&!Q.met,act:()=>{Q.met=1;meetEgor()}},
    {get x(){return hz.x},get y(){return hz.y},r:20,label:()=>'Командир Ханжа',cond:()=>!!Q.ready,act:()=>say([['H','Идите, идите. И чтоб без музыки после одиннадцати, Егорушка!'],['e','Обещаю, тётушка. Только живая музыка.'],['H','Вот этого я и боюсь.']])},
    {get x(){return gu.x},get y(){return gu.y},r:18,label:()=>'Михалыч',cond:()=>!!Q.ready,act:()=>say([['G','Шуба зачётная, Егор. Как фламинго, только злой.'],['e','Михалыч, это не шуба. Это стиль жизни.']])},
    {get x(){return jan.x},get y(){return jan.y},r:20,label:()=>'Дворник',cond:()=>!!Q.ready,act:()=>say([['D','О, Егор приехал. Опять конфетти по всему двору выметать буду?'],['e','Сегодня без конфетти, дядь Вань. Сегодня по делу.']])},
  ];
  ENTR.forEach((c,i)=>{if(i===MY_ENTR)return;L.its.push({x:c,y:106,r:13,label:()=>i===1?'Подъезд бати (2-й)':'Подъезд '+(i+1),cond:()=>!!Q.ready,act:()=>{
    if(i!==1){say([['e','Не-не, батя во втором. Я тут каждую ступеньку знаю.']]);return}
    lockMove=true;X.go(()=>{lockMove=false;sec4('flatb')})}})});
  after(.6,()=>{zoneBanner('ДВОР · ВЕЧЕР');say([['s','Где он? Сказал, через десять минут будет.'],['m','Егор и «десять минут»... Это минимум полчаса.']],()=>{
    after(1.4,()=>{Q.eg.st=1;sfx('hiss',.8);note('Во двор въезжает жёлтый самокат!')})})});
}
function meetEgor(){
  lockMove=true;Q.eg.st=3;
  say([['e','Йо-хо-хо! Микроб! Шмакодявка! Живые, черти!'],['m','Егор! Ты как добрался?'],['e','Через мост, по набережной. Зомби в центре — толпами. А у вас тут... тихо. Даже птички поют.'],
    ['H','Так-так-так. Кого я вижу. Егорушка. Алкопатимен собственной персоной.'],['e','Здрасьте, тётушка Ханжа! Вы всё хорошеете.'],
    ['H','Не подлизывайся. Я твой день рождения до сих пор помню. До шести утра музыка, весь подъезд в конфетти...'],['H','А кто-то пел караоке с балкона. В два часа ночи.']],()=>{
      C1.mode='cut';for(const sh of CUT_PARTY)sh._f={};playCut(CUT_PARTY,()=>{C1.mode='td';mz4('yard');
        say([['e','Легендарная была туса. Ну признайте, тётушка, вам понравилось.'],['s','Подождите. Лифт-дискотека?! С гирляндой?'],['e','И с колонкой. Десять этажей драйва.'],
          ['H','...Ладно. Было весело. Чуть-чуть.'],['H','Прошли годы, вырос мальчик. Вон, в шубе даже приличной.'],['G','Шуба огонь.'],
          ['H','Идите уже к отцу в квартиру. Кот там три дня орал, весь подъезд слышал. А сегодня что-то затих.'],
          ['e','Затих? Это плохо. Погнали, быстро!'],['e','И да, я без оружия. Зато вот.'],['e','*поправляет очки* Розовый лазер. Не спрашивайте.'],['m','...Я даже не буду спрашивать.']],()=>{
            Q.eg.st=-1;addAlly('egor',Q.eg.x,Q.eg.y);Q.ready=1;lockMove=false;note('Егор в команде! Очки стреляют розовым лазером');
          });
      });
    });
}

// ---------- КВАРТИРА БАТИ ----------
const ROOMS_B=[['ПРИХОЖАЯ',200,230,372,312],['СПАЛЬНЯ БАТИ',160,48,340,208],['КУХНЯ-ГОСТИНАЯ',360,40,548,212],['БАЛКОН',400,8,540,38],['КОРИДОР',372,268,660,300],['ТУАЛЕТ',420,222,460,264],['СПАЛЬНЯ',560,150,680,264],['КОМНАТА ЕГОРА',560,304,680,400]];
const HEXC={x:250,y:130,R:90};
function inHex(x,y){const dx=Math.abs(x-HEXC.x),dy=Math.abs(y-HEXC.y),R=HEXC.R,h=R*.866;if(dy>h||dx>R)return false;return dx<=R-dy/Math.sqrt(3)}
function lvFlatB(){
  L=E.mkLevel('flatb',700,410);B(0,0,700,410,'#1a1620');
  floor4(200,230,372,310,'tile');floor4(248,308,272,318,'tile');
  for(let y=40;y<220;y+=4)for(let x=156;x<346;x+=4){if(inHex(x+2,y+2))floor4(x,y,x+4,y+4,'parq')}
  floor4(240,204,262,232,'parq');
  floor4(360,40,440,210,'kit');floor4(440,40,548,210,'parq');floor4(340,204,364,232,'tile');
  floor4(400,8,540,36,'balc');floor4(456,30,480,42,'kit');
  floor4(372,268,660,300,'parq');
  floor4(420,222,460,262,'bath');floor4(432,260,448,270,'bath');
  floor4(560,150,680,262,'parq');floor4(600,258,620,270,'parq');
  floor4(560,306,680,400,'parq');floor4(600,298,620,308,'parq');
  X.drawWalls('#2a2630','#5a5068');
  // входная дверь
  B(246,316,28,4,'#c89a50');B(246,316,28,1,'#e8ba70');txt(260,326,'ВХОД','#9a92b0',4);
  // три окна в шестиугольной спальне
  B(232,44,36,3,'#c8ccd4');B(233,45,34,1,'#4a6a9a');
  for(let i=0;i<5;i++){B(198-i*3,62+i*5,3,3,'#9ac0e8');B(300+i*3,62+i*5,3,3,'#9ac0e8')}
  // окна кухни, балкон
  for(let x=404;x<540;x+=6)B(x,8,2,2,'#8a8a92');B(400,8,140,1,'#aaaab2');
  // открытое окно в дальней спальне
  B(681,180,4,26,'#c8ccd4');B(682,181,2,24,'#0a0a14');B(685,178,6,3,'#c8ccd4');
  // мебель: прихожая
  X.lowBox(204,236,12,44,'#d8d4cc');X.lowBox(330,292,26,10,'#e8e8ec');B(268,250,40,26,'#7a3a4a');B(270,252,36,22,'#8a4a5a');
  // спальня бати
  X.lowBox(222,70,56,42,'#3a4a7a','#5a6a9a');B(226,72,20,8,'#e8e8f0');B(254,72,20,8,'#e8e8f0');X.lowBox(206,72,12,12,'#6a4a30');X.lowBox(282,72,12,12,'#6a4a30');
  X.lowBox(174,116,14,28,'#6a4a30','#8a6a48');B(178,124,6,5,'#f0f0e0');X.lowBox(300,150,16,16,'#7a3a3a');B(212,150,60,36,'#4a5a3a');B(214,152,56,32,'#5a6a4a');
  // кухня-гостиная
  X.lowBox(364,44,72,12,'#d8d8d0','#ffffff');B(380,46,10,6,'#2a2a30');B(406,46,12,6,'#8a9aa8');X.lowBox(364,58,12,30,'#e8e8ec');
  X.lowBox(394,120,32,22,'#8a6a48');X.lowBox(470,44,40,6,'#141418');X.lowBox(498,160,42,14,'#5a5a7a','#7a7a9a');B(470,110,50,40,'#6a2a2a');
  X.lowBox(526,56,16,22,'#c8b040','#e8d060');X.lowBox(526,90,16,22,'#c8b040','#e8d060');
  B(374,194,6,4,'#3a7ac8');B(382,194,6,4,'#c83a3a');
  // туалет
  X.lowBox(436,226,10,12,'#f0f0f0');X.lowBox(444,248,12,8,'#6a8aa8');
  // дальняя спальня: следы лап и перья у окна
  X.lowBox(586,160,44,34,'#8a5a8a','#aa7aaa');X.lowBox(636,232,36,8,'#6a4a30');
  for(let i=0;i<8;i++){B(632+i*6,212-i*3+(i%2?2:0),2,2,'#3a2a20');}for(let i=0;i<14;i++)B(640+rnd(0,36)|0,180+rnd(0,40)|0,2,1,i%3?'#c8c8d0':'#8a8a96');
  for(let i=0;i<5;i++){const g=L.dx;g.fillStyle='rgba(110,8,14,.6)';g.fillRect(650+rnd(0,24),190+rnd(0,30),2,2)}
  // комната Егора: пульт, постеры, диско-шар
  X.lowBox(620,358,50,30,'#2a2a3a','#4a4a5a');X.lowBox(566,312,40,12,'#1a1a22','#3a3a4a');for(let i=0;i<8;i++)B(569+i*4,315,2,2,['#ff4fa3','#3ef0b0','#ffd23a'][i%3]);
  B(566,392,22,4,'#ff4fa3');B(600,392,22,4,'#3ef0b0');B(642,306,22,3,'#ffd23a');
  L.glow.push([620,350,40,'rgba(255,80,200,A)',.18,3],[650,195,40,'rgba(150,180,255,A)',.15]);
  L.lights.push([286,270,50,.8],[250,130,70,.7],[454,120,70,.75],[470,22,30,.6],[516,284,60,.7],[440,242,24,.6],[620,206,50,.6],[620,352,50,.7]);
  L.dark=.42;L.tint='10,6,18';L.arrows=true;
  X.buildNav();
  pl.x=260;pl.y=298;pl.a=-Math.PI/2;pl.ma=pl.a;
  addAlly('shmak',248,306);addAlly('egor',272,306);
  Zp(600,212);Zp(636,236);Zp(586,240);Zp(650,176);
  Zp(470,70);Zp(500,96);
  Q.trig.push({x:610,y:240,r:44,fn:()=>{sfx('groan',1.8);C1.shake=.4;note('Голуби! Они залетели через окно!')}});
  L.drawUnder=()=>{
    for(const [cx,cy] of [[534,67],[534,101]]){const b=Q.birds?Math.sin(tm*6+cy):0;F(cx-2,cy-4+b,3,3,'#5ad85a');F(cx+1,cy-3+b,1,1,'#ffd23a');F(cx-2,cy+2,3,3,'#e8e05a');F(cx-3,cy+3,1,1,'#3a8ae8')}
    if(!Q.note){const a=.4+.4*Math.sin(tm*5);ctx.strokeStyle=`rgba(255,210,58,${a})`;ctx.strokeRect(176.5,122.5,9,7)}
  };
  L.obj=()=>[Q.birds?'Птицы накормлены  ✓':'Покормить птиц (кухня-гостиная)',Q.win?'Мыш ушёл на крышу':'Обыскать квартиру, найти Мыша'];
  L.onUpdate=dt=>{trigs();rooms(ROOMS_B)};
  L.its=[
    {x:181,y:132,r:16,label:()=>'Записка на комоде',act:()=>{Q.note=1;say([['m','Записка от Полины.'],['m','«Мыша кормить два раза в день. Птичкам — зерно и вода. ОКНА НЕ ОТКРЫВАТЬ! Мыш — гуляка!»'],['e','Это она вообще-то про меня писала. Но про кота тоже правда.']])}},
    {x:534,y:84,r:18,label:()=>Q.birds?'Птицы':'Покормить птиц',act:()=>{if(Q.birds){say([['s','Чирик-чирик, хорошие мои.']]);return}Q.birds=1;sfx('pick');
      say([['e','Кеша! Гоша! Живые, пацаны!'],['s','Ой, попугайчики! Какие хорошенькие!'],['e','Зерно, водичка. Батя бы меня убил, если бы с ними что-то случилось.'],['m','Птицы целы. Осталось найти кота.']])}},
    {x:381,y:190,r:14,label:()=>'Миски Мыша',act:()=>say([['m','Миски пустые. И вода тоже. Мыш давно тут не ел.'],['e','Бедолага. Три дня на голодном пайке.']])},
    {x:450,y:244,r:14,label:()=>'Лоток',act:()=>say([['s','Лоток чистый. Значит, Мыш тут давно не был.'],['m','Ну, хоть убирать не надо. Черсик бы так не смог.']])},
    {x:586,y:322,r:16,label:()=>'Старый пульт Егора',act:()=>say([['e','Моя комната! Мой первый пульт! Отсюда всё и началось.'],['s','Отсюда и начались все жалобы Ханжи.'],['e','Именно. Золотые времена.']])},
    {x:262,y:92,r:20,label:()=>'Кровать бати',act:()=>say([['e','Мыш! Кс-кс-кс! ...Под кроватью нету.'],['m','В спальне пусто. Три окна, все закрыты.']])},
    {x:672,y:194,r:18,label:()=>'Открытое окно',act:()=>{
      if(L.zs.length){say([['m','Сначала голуби! Осталось: '+L.zs.length+'.']]);return}
      if(!Q.win){Q.win=1;say([['m','Окно открыто настежь.'],['s','Смотри: следы лап на подоконнике. И перья. Много перьев.'],['e','Мыш гонял голубей... и полез за ними по карнизу. Наверх!'],['m','На крышу. Через подъезд и чердак, быстро!']],()=>goRoof())}else goRoof()}},
  ];
  after(.5,()=>{zoneBanner('КВАРТИРА БАТИ');say([['e','Батина хата! Мыш! Мы-ыш! Кс-кс-кс!'],['s','Тихо как-то...'],['m','И пахнет... перьями? Осторожно. Обыщем квартиру.']],()=>note(touch.on?'ОГОНЬ — стрелять, ШПРИЦ — лечение':'ЛКМ — стрелять, 1/2 — бита/пистолет, H — шприц'))});
}
function goRoof(){if(!Q.birds){say([['e','Стой! Сначала птиц покормлю. Батя не простит.']]);return}lockMove=true;X.go(()=>{lockMove=false;sec4('roof')})}

// ---------- КРЫША ----------
const MYSH={x:524,y:44};
function lvRoof(){
  L=E.mkLevel('roof',560,380);B(0,0,560,380,'#2a2628');
  floor4(8,8,552,372,'roof');
  E.gfill(150,110,210,150,1);E.gfill(360,230,420,270,1);
  X.drawWalls('#5a4a4e','#8a7a7e');
  for(const [x,y,w,h] of [[150,110,60,40],[360,230,60,40]]){B(x,y,w,h,'#7a3426');for(let yy=y;yy<y+h;yy+=3){B(x,yy,w,1,'#6a2c20')}B(x,y,w,2,'#9a4a36');B(x+w/2-6,y+h-2,12,2,'#2a2a30')}
  // люк, вентиляция, антенны, тарелки
  B(22,326,22,22,'#3a3a42');B(24,328,18,18,'#14141a');B(24,328,18,2,'#5a5a62');
  for(const [x,y,s] of [[100,80,16],[300,140,14],[460,300,16],[240,320,12],[420,120,14],[500,26,14]])X.lowBox(x,y,s,s,'#8a8a92','#b0b0b8');
  for(const [x,y] of [[80,250],[330,60],[480,200]]){B(x,y,2,2,'#2a2a30');L.bx.strokeStyle='#6a6a72';L.bx.beginPath();L.bx.moveTo(x+1,y);L.bx.lineTo(x-10,y-14);L.bx.moveTo(x+1,y);L.bx.lineTo(x+12,y-12);L.bx.stroke()}
  for(const [x,y] of [[200,250],[60,120]]){L.bx.fillStyle='#c8ccd4';L.bx.beginPath();L.bx.ellipse(x,y,7,5,.4,0,TAU);L.bx.fill();E.gfill(x-6,y-4,x+6,y+4,2)}
  for(let i=0;i<220;i++){const x=rnd(10,550)|0,y=rnd(10,370)|0;if(E.gAt(x,y)===0)B(x,y,1,1,i%5?'#e8e4dc':'#b8b4ac')}
  for(let i=0;i<30;i++){const x=rnd(10,550)|0,y=rnd(10,370)|0;if(E.gAt(x,y)===0)B(x,y,3,1,'#9a9aa6')}
  for(const [x,y,r] of [[260,200,12],[120,330,9],[450,80,10]]){const g=L.bx;g.fillStyle='rgba(30,40,60,.6)';g.beginPath();g.ellipse(x,y,r*1.5,r*.8,0,0,TAU);g.fill()}
  txt(33,322,'ЛЮК','#9a92b0',4);
  L.dark=.3;L.tint='40,10,50';L.arrows=true;
  L.glow.push([280,190,260,'rgba(255,120,60,A)',.06],[540,10,90,'rgba(255,80,40,A)',.1,1]);
  X.buildNav();
  pl.x=52;pl.y=336;pl.a=-Math.PI/4;pl.ma=pl.a;
  addAlly('shmak',40,322);addAlly('egor',64,350);
  flock(150,300,4);flock(270,190,4);flock(430,330,3);flock(300,60,4);
  Zpb(240,90);Zpb(470,180);Zpb(120,200);Zpb(380,40);
  Q.trig.push({x:440,y:90,r:80,fn:()=>{sfx('groan',2);C1.shake=.6;for(let i=0;i<8;i++)Zp(rnd(300,540),rnd(14,30),{st:'chase'});Zpf(520,140,{st:'chase'});note('Вожак стаи! Жирный голубь-мутант!')}});
  L.drawUnder=()=>{
    if(Q.router&&!Q.awpDone){F(172,157,16,9,'#3a4a2a');F(172,157,16,2,'#5a6a3a');F(178,160,4,3,'#c8a040');if(Math.sin(tm*4)>0)F(186,158,1,1,'#ff3030')}
    F(330,66,16,14,'#5a5a62');F(331,67,14,12,'#2a2a30');for(let i=0;i<4;i++)F(333+i*3,70,2,2,Q.router?(Math.sin(tm*8+i)>0?'#3ef0b0':'#1a4a3a'):(i===0&&Math.sin(tm*5)>0?'#ff3a3a':'#3a1a1a'));
    if(!Q.router&&Math.random()<.15){F(344+rnd(-2,2),64+rnd(-2,2),1,1,'#ffe27a')}
    const sc=Q.found?0:Math.sin(tm*8)*.4;drawSiamTop(sprW.getContext('2d'),tm*6,false,true);
    ctx.save();ctx.translate(MYSH.x+sc,MYSH.y);ctx.rotate(Math.PI*.8);ctx.drawImage(sprW,-12,-12,24,24);ctx.restore();
    if(!Q.found&&Math.sin(tm*2)>.6){ctx.fillStyle='#fff';ctx.font='bold 5px monospace';ctx.fillText('мяу!',MYSH.x-20,MYSH.y-6)}
  };
  L.obj=()=>[L.zs.length?'Перебить зомби-голубей: осталось '+L.zs.length:'Голуби кончились  ✓'].concat(Q.called?[Q.router?'Связь с городом есть  ✓':'Починить маршрутизатор с антеннами']:[],['Найти Мыша']);
  L.onUpdate=dt=>{trigs();pigeons(dt);if(!Q.clear&&!L.zs.length&&Q.trig[0].done){Q.clear=1;say([['e','Всё! Крыша наша!'],['s','Слышите? Мяукает где-то за трубой!']],()=>{
    sfx('ring');after(.9,()=>sfx('ring'));after(1.6,()=>say([['H','Алло! Микроб? Вы на крыше? Я видела вспышки.'],['m','Да, тётушка Ханжа. Голубей разогнали.'],
      ['H','Раз уж вы там, почините маршрутизатор с антеннами. У дома сутки нет связи с городом. Мы как в танке.'],
      ['e','Так это я его ставил! Для стримов тус.'],['H','Вот и чини, Егорушка. Голуби провода расклевали.']],()=>{Q.called=1;note('Маршрутизатор — у антенны в середине крыши')}))})}};
  L.its=[{x:338,y:84,r:20,label:()=>'Починить маршрутизатор',cond:()=>Q.called&&!Q.router,act:()=>{
    const news=()=>{Q.router=1;sfx('power',1.2);say([['r','...пш-ш... Экстренная служба. Эпицентр заражения — центр города, ночной клуб «Бардак» на Думской.'],
      ['r','Внутри тусовка не прекращается вторые сутки. Заражённые идут туда со всего центра, как на зов. Не приближайтесь!'],
      ['H','Связь есть! Спасибо, Егорушка. Хоть какая-то польза от твоих тус.'],['e','«Бардак» на Думской... Это же мой клуб. Я там каждую пятницу.'],['s','Потом! Слышите? Мяукает! За трубой!']])};
    if(window.MG)MG.play('P','freq',{title:'Антенна: поймать город',label:'Городская сеть',drift:.06},news);else news()}},
  {x:180,y:162,r:16,label:()=>Q.awp?'Ящик Ханжи (пустой)':'Ящик Ханжи у голубятни',cond:()=>Q.router&&!Q.awpDone,act:()=>{
    if(L.zs.length){say([['m','Сначала голуби. Потом ящик.']]);return}
    const go=()=>{Q.awp=1;if(window.UP)UP.grant('awp');C1.PS.awp=Math.max(C1.PS.awp||0,10);
      if(!window.SNP){Q.awpDone=1;return}
      SNP.play({need:14,total:18,leak:4},r=>{Q.awpDone=1;const rub=r.win?300+r.kills*30+r.head*40:r.kills*20;if(rub&&C1.addRub)C1.addRub(rub,pl.x,pl.y-10);
        say(r.win?[['H','Вижу из окна: двор чистый! Ни один не дошёл до подъезда. Вот это выучка.'],['m','Хорошая винтовка, тётушка Ханжа.'],['H','Оставь себе. Мужу она уже не понадобится. А тебе — пригодится.']]
          :[['H','Ох, прорвались к подъезду... Ничего, дворник с лопатой встретил.'],['m','Простите, тётушка Ханжа. Рука дрогнула.'],['H','Винтовку всё равно оставь себе. Потренируешься.']],()=>note('AWP с лазером — в оружейной'))})};
    say([['m','Ящик. Армейский. С замком, но ключ в замке.'],['m','...AWP. С лазерным прицелом. Ни фига себе.'],
      ['H','Это моя, Микроб. Со службы осталась, муж-покойник в голубятне от меня прятал. Думал, я не знаю.'],
      ['H','Раз уж ты нашёл, сделай доброе дело. Внизу к подъездам бегут зомби со всех сторон, а у нас дети во дворе.'],
      ['H','Сверху тебе всё видно. Ложись у парапета и прикрой двор.'],['e','Я рядом, если что. Буду считать.'],['m','Понял. Работаю.']],go)}},
  {x:MYSH.x,y:MYSH.y+6,r:20,label:()=>'Мыш!',cond:()=>!Q.found,act:()=>{
    if(L.zs.length){say([['w','МЯУ!!! (Сначала голуби! Они меня тут три часа держат!)']]);return}
    if(!Q.router){say([['w','Мяу! (Я тут! ...А, вы заняты? Ладно, чините свою антенну.)'],['H','Микроб! Маршрутизатор! Кота потом!']]);return}
    Q.found=1;lockMove=true;
    say([['e','МЫШ! Котик мой! Нашёлся!'],['w','Мяу. (Ты где был три дня, хозяин?)'],['e','Прости, брат. Прости. Город, зомби, всё вот это.'],
      ['s','Он худенький совсем. Аж рёбра видно.'],['m','Пошли к нам. У нас кое-что есть для голодных котов.'],['s','Протеиновый корм! Тренерский!'],['e','Это который из Черсика качка сделал? ...А давайте.']],()=>{
        X.go(()=>{lockMove=false;playC4(CUT_FEED,afterFeed,'feed')})});
  }}];
  after(.5,()=>{zoneBanner('КРЫША');say([['e','Крыша. Я тут когда-то рассвет встречал. С шампанским.'],['m','Голуби. Много голубей. И у всех красные глаза.'],['s','Стреляю во всё, что машет крыльями.']],()=>note('Где-то за трубами мяукает кот...'))});
}
function pigeons(dt){
  if(hold())return;
  for(const z of L.zs){if(z.dead||!z.bomb||z.st!=='chase')continue;const d=D2(z.x,z.y,pl.x,pl.y);
    if(d<60){const a=Math.atan2(z.y-pl.y,z.x-pl.x);mv(z,Math.cos(a)*50*dt,Math.sin(a)*50*dt,z.r)}
    z.bt-=dt;if(z.bt<=0&&d<160&&E.los(z.x,z.y,pl.x,pl.y)){z.bt=rnd(2,3);const a=Math.atan2(pl.y-z.y,pl.x-z.x)+rnd(-.1,.1);Q.eb.push({x:z.x,y:z.y,vx:Math.cos(a)*110,vy:Math.sin(a)*110,life:1.6,dmg:8,k:'poop'});sfx('swing',.5)}}
}

// ---------- НЕВСКИЙ ----------
function facade(x0,y0,x1,y1,top){
  const cols=['#7a5a48','#8a6a50','#6a5a6a','#7a6a52','#8a5a4a'];
  for(let x=x0,i=0;x<x1;x+=100,i++){const w=Math.min(100,x1-x),c=cols[i%cols.length];B(x,y0,w,y1-y0,c);B(x,y0,1,y1-y0,shade(c,.7));
    for(let wx=x+8;wx<x+w-8;wx+=14){for(let wy=y0+6;wy<y1-10;wy+=14){B(wx,wy,8,8,shade(c,.6));B(wx+1,wy+1,6,6,hash(wx,wy)>.75?'#ffd27a':'#1a1a2a')}}
    B(x,top?y1-3:y0,w,3,shade(c,1.2))}
}
function lvNevsky(){
  L=E.mkLevel('nevsky',1000,340);B(0,0,1000,340,'#1a1620');
  floor4(4,56,996,88,'walk');floor4(4,88,996,252,'asph');floor4(4,252,996,284,'walk');floor4(380,4,430,56,'asph');floor4(900,40,940,56,'club');
  X.drawWalls('#2a2228','#5a4a50');
  facade(0,0,380,56,true);facade(430,0,900,56,true);facade(940,0,1000,56,true);facade(0,284,1000,340,false);
  B(4,56,2,228,'#2a2228');
  for(let x=10;x<1000;x+=28)B(x,169,14,2,'#d8d8c8');B(4,90,992,1,'#e8e0a0');B(4,250,992,1,'#e8e0a0');
  // вывески
  const sign=(x,y,t,c)=>{B(x-22,y-6,44,9,'#141418');txt(x,y,t,c,5);L.glow.push([x,y-2,24,'rgba(255,200,120,A)',.12])};
  sign(120,52,'КНИГИ','#ffd23a');sign(240,52,'ШАВЕРМА 24','#ff7a30');sign(520,52,'АПТЕКА','#3ef0b0');sign(700,52,'КАФЕ','#ffd23a');sign(200,298,'ГАЛЕРЕЯ','#9ac8ff');sign(620,298,'ТЕАТР','#ff4fa3');
  // клуб
  B(898,28,44,12,'#141018');txt(920,37,'БАРДАК','#ff4fa3',6);B(904,40,32,16,'#2a0a2a');B(910,44,20,12,'#0a0408');
  L.glow.push([920,36,40,'rgba(255,60,220,A)',.35,6],[920,60,30,'rgba(255,60,220,A)',.2,6]);
  // машины, троллейбус, баррикада
  for(const [x,y,c] of [[60,110,'#8a2a2a'],[150,200,'#2a4a6a'],[260,130,'#d0d0d0'],[340,214,'#3a3a3a'],[470,100,'#6a8a4a'],[520,206,'#c8a030'],[690,128,'#2a2a2a'],[790,210,'#8a5a2a'],[860,112,'#4a2a6a']])X.carTop(x,y,c,false);
  X.lowBox(560,118,72,22,'#2a6a9a','#4a8aba');for(let i=0;i<6;i++)B(566+i*11,122,8,5,'#1a2230');
  X.lowBox(760,150,8,56,'#8a6a40','#a88a5a');
  for(let x=60;x<1000;x+=130){X.lampPost(x,62);X.lampPost(x+60,278)}
  for(const [x,y] of [[268,138],[700,136]]){L.glow.push([x+14,y+8,40,'rgba(255,120,40,A)',.35,9]);for(let i=0;i<5;i++)B(x+rnd(4,24)|0,y+rnd(2,12)|0,2,2,'#1a1010')}
  for(let i=0;i<60;i++){const x=rnd(8,990)|0,y=rnd(92,248)|0;B(x,y,rnd(2,5)|0,1,['#4a4a52','#6a5a3a','#3a3a40'][i%3])}
  L.dark=.5;L.tint='14,4,20';L.arrows=true;
  X.buildNav();
  pl.x=24;pl.y=170;pl.a=0;pl.ma=0;
  addAlly('chersik',14,186);
  const grp=(x,y,n,t)=>{for(let i=0;i<n;i++)E.addZ(t||(Math.random()<.25?'fast':'normal'),x+rnd(-20,20),y+rnd(-20,20))};
  grp(160,150,4);grp(250,230,3);grp(330,110,4);grp(470,170,5);grp(560,240,4);grp(650,100,4);grp(720,200,5);grp(840,160,4);
  E.addZ('thrower',300,70);E.addZ('thrower',600,268);E.addZ('thrower',810,70);
  E.addZ('bloat',420,200);E.addZ('bloat',740,120);E.addZ('screamer',640,180);
  E.addZ('brute',880,120);E.addZ('brute',890,220);
  Zmt(930,112);Zmt(952,150);Zmt(940,200);Zmc(905,150);
  kfood(200,70);kfood(480,268);kfood(640,70);kfood(830,268);
  Q.trig.push({x:400,y:160,r:60,fn:()=>{sfx('groan',2);C1.shake=.4;for(let i=0;i<9;i++)E.addZ(i%3?'normal':'fast',395+rnd(-12,12),20+rnd(0,20),{st:'chase'});note('Из переулка валит толпа!')}});
  Q.trig.push({x:760,y:170,r:60,fn:()=>{sfx('groan',2);for(let i=0;i<7;i++)E.addZ('fast',990,rnd(100,240),{st:'chase'});note('Сзади бегуны!')}});
  L.obj=()=>[L.zs.length?'Зачистить Невский: осталось '+L.zs.length:'Невский чист  ✓','Клуб «Бардак» на Думской (в конце улицы)'];
  L.onUpdate=dt=>{trigs();monkeys(dt);if(!Q.clear&&!L.zs.length&&Q.trig.every(t=>t.done)){Q.clear=1;say([['C','Улица чистая. А в конце — Думская. Оттуда и музыка.'],['M','Р-р-р. (Бит. Из «Бардака». Бум-бум-бум.)']])}};
  L.its=[{x:920,y:62,r:18,label:()=>'Клуб «Бардак»',act:()=>{if(L.zs.length){say([['C','Сначала улица. Не люблю, когда за спиной кусаются. Осталось: '+L.zs.length+'.']]);return}X.go(()=>sec4('club'))}}];
  after(.5,()=>{zoneBanner('НЕВСКИЙ ПРОСПЕКТ');say([['M','Невский. Зомби больше, чем туристов летом.'],['C','Кусай и не останавливайся. Я прикрою.']],()=>note(touch.on?'УДАР — укус, третий подряд — РАЗГРЫЗ. КОРМ — лечение':'ЛКМ — укус, третий подряд — РАЗГРЫЗ (лечит). H — корм'))});
}

// ---------- НОЧНОЙ КЛУБ «БАРДАК» на Думской: зомби-тусовщики и стриптизёрша Анжела ----------
function lvClub(){
  L=E.mkLevel('club',520,440);B(0,0,520,440,'#0c0810');
  floor4(200,352,320,432,'club');floor4(234,330,286,356,'club');floor4(30,110,490,334,'club');floor4(150,110,370,150,'stage');floor4(150,184,370,320,'dance');
  for(const [x,y] of [[118,198],[390,198],[118,296],[390,296]])E.gfill(x,y,x+12,y+12,1);
  X.drawWalls('#1a1020','#5a2a6a');
  for(const [x,y] of [[118,198],[390,198],[118,296],[390,296]]){B(x,y,12,12,'#1a3a1a');B(x,y,12,2,'#3ef0b0');for(let i=0;i<5;i++)B(x-3+i*4,y-4+(i%2)*2,3,5,'#2a7a2a')}
  X.lowBox(40,150,14,160,'#3a2a2a','#6a4a3a');for(let y=150;y<310;y+=12){B(64,y+4,4,4,'#4a4a52')}for(let y=120;y<320;y+=6)B(32,y,3,4,['#3ac87a','#c83a3a','#e8c040','#3a8ae8'][(y/6)%4|0]);
  X.lowBox(200,118,120,20,'#141418','#3a3a4a');for(let i=0;i<14;i++)B(206+i*8,124,4,2,['#ff4fd8','#3ef0b0','#ffd23a'][i%3]);B(226,128,14,6,'#2a2a34');B(280,128,14,6,'#2a2a34');
  X.lowBox(156,114,22,26,'#0a0a0e','#2a2a30');X.lowBox(342,114,22,26,'#0a0a0e','#2a2a30');
  X.lowBox(420,118,60,10,'#6a1a3a','#8a2a5a');X.lowBox(470,130,10,60,'#6a1a3a','#8a2a5a');B(430,140,30,20,'#2a1a2a');
  // гирлянды, конфетти, пластиковые стаканы и пустые шейкеры из-под протеина — вечеринка идёт вторые сутки
  for(let x=36;x<490;x+=6)B(x,111+((x/6)%2),2,1,['#ff4fd8','#ffd23a','#3ef0b0','#ffffff'][(x/6|0)%4]);
  for(let i=0;i<26;i++){const x=rnd(40,480)|0,y=rnd(150,330)|0;if(E.gAt(x,y)===0){if(i%3){B(x,y,2,3,'#e8e8f0');B(x,y,2,1,'#ff4fd8')}else{B(x,y,3,4,'#3a3a44');B(x,y,3,1,'#ff4fd8')}}}
  txt(260,108,'БАРДАК','#ff4fd8',8);txt(260,96,'СЕГОДНЯ: АНЖЕЛА · ШЕСТ','#ffd23a',5);txt(450,114,'VIP','#ffd23a',5);txt(260,428,'▼ ДУМСКАЯ','#9a7a8a',5);
  for(let i=0;i<20;i++){const x=rnd(40,480)|0,y=rnd(114,330)|0;if(E.gAt(x,y)===0)B(x,y,2,1,['#ff4fd8','#ffd23a','#3ef0b0'][i%3])}
  L.glow.push([260,128,60,'rgba(255,60,220,A)',.25,4],[260,250,110,'rgba(80,255,180,A)',.08,2],[450,160,40,'rgba(255,210,60,A)',.12,3],[48,230,40,'rgba(255,120,60,A)',.12]);
  L.lights.push([260,250,100,.8],[260,130,60,.8],[450,160,40,.7],[60,230,50,.7],[260,390,50,.8]);
  L.dark=.5;L.tint='10,20,30';L.arrows=true;
  L.bossName='';Object.defineProperty(L,'bossName',{get(){const b=L.zs.find(z=>z.type==='boss'&&!z.dead);return b?b.nm:''}});
  X.buildNav();
  pl.x=260;pl.y=418;pl.a=-Math.PI/2;pl.ma=pl.a;
  addAlly('chersik',248,428);
  for(const [x,y] of [[180,200],[220,240],[300,230],[340,270],[200,290],[260,210],[320,200],[240,300]])Zmt(x,y);
  for(const [x,y] of [[90,180],[90,280],[440,240],[460,300],[240,370]])Zmc(x,y);
  Zbb(150,320);Zbb(370,320);
  kfood(80,330);kfood(440,320);kfood(300,160);kfood(120,250);
  Q.down=0;Q.rage=0;Q.beat=0;Q.bpm=128;
  L.drawUnder=()=>{
    const pulse=Q.beatK||0;
    for(let y=184;y<320;y+=16)for(let x=150;x<370;x+=16){const k=Math.sin(tm*4+x*.05+y*.07)*.5+.5,h=((x>>4)+(y>>4)+(Q.beatN||0))%3;
      ctx.fillStyle=['rgba(255,60,220,','rgba(60,240,200,','rgba(255,210,60,'][h]+(.06+k*.1+pulse*.18)+')';ctx.fillRect(x,y,16,16)}
    const bx=260+Math.sin(tm)*2;F(bx-3,100,6,6,'#d8d8e0');for(let i=0;i<6;i++){const a=tm*2+i;F(260+Math.cos(a)*90,240+Math.sin(a)*60,2,2,'rgba(255,255,255,.5)')}
    for(const sx of [167,353]){const k=1+pulse*.4;ctx.fillStyle='rgba(255,255,255,'+(.15+pulse*.3)+')';ctx.beginPath();ctx.arc(sx,127,4*k,0,TAU);ctx.fill()}
  };
  L.obj=()=>Q.fight?['Анжела: не стой у шеста, сбивай гипно-танец']:Q.won?(Q.arm2&&Q.pult&&!Q.off?['Выключить пульт']:!Q.arm2?['Забрать бронежилет охраны']:[]):['Пробиться на танцпол'];
  L.onKill=z=>{if(z===Q.anz)anzDown(z)};
  L.onUpdate=dt=>{
    Q.beat+=dt*Q.bpm/60;const n=Math.floor(Q.beat);if(n!==Q.beatN){Q.beatN=n}Q.beatK=Math.max(0,1-(Q.beat-n)*3);
    monkeys(dt);
    if(!Q.intro&&pl.y<330){Q.intro=true;lockMove=true;
      Q.anz=E.addZ('boss',260,170,{v:252,hp:2200,max:2200,sp:28,r:13,sc:1.6,st:'chase',nm:'АНЖЕЛА · ЗВЕЗДА «БАРДАКА»',ai:'anz',mode:'chase',pc:6,sh:2.5,ent:9,hy:11,lhp:2200});
      sfx('groan',2);C1.shake=.6;
      say([['A','Мальчики... Котики... На мою вечеринку без приглашения?'],['C','Ты Анжела. Звезда «Бардака». Про тебя весь центр говорит.'],
        ['A','Я выпила протеиновый коктейль. Тот самый, новый. После него я стала... больше. Сильнее. Красивее.'],
        ['A','А когда я танцую — они приходят. Все. Со всего центра. И никто не хочет уходить.'],
        ['M','Р-р-р. (Сейчас уйдут.)'],['C','Вечеринка окончена, Анжела.'],['A','Вечеринка только начинается. МУЗЫКУ ГРОМЧЕ!']],()=>{lockMove=false;Q.fight=1;
          note('Красный круг у шеста — уходи! Туфли летят веером. Гипно-танец сбивай ударами.')});
    }
    if(Q.fight&&!Q.won)anzhela(dt);
    if(Q.vanishT>0){Q.vanishT-=dt;const g=L.dx;g.save();g.globalCompositeOperation='destination-out';g.fillStyle='rgba(0,0,0,.035)';g.fillRect(0,0,L.w,L.h);g.restore()}
  };
  {const lu=L.drawUnder;L.drawUnder=()=>{lu();const P0=POLE;for(let y=P0.y-3;y<P0.y+3;y++)F(P0.x-3,y,6,1,'rgba(255,255,255,.08)');F(P0.x-1.5,P0.y-1.5,3,3,'#d8d8e8');F(P0.x-.5,P0.y-.5,1,1,'#ffffff');
    const z=Q.anz;if(z&&!z.dead&&z.mode==='pole'&&z.pp!=='go'){const k=z.pp==='warn'?1-z.pw/.9:1;ctx.fillStyle=`rgba(255,40,80,${z.pp==='warn'?.1+.15*k:.22})`;ctx.beginPath();ctx.arc(P0.x,P0.y,POLE.r,0,TAU);ctx.fill();
      ctx.strokeStyle=`rgba(255,40,80,${.5+.5*Math.sin(tm*30)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(P0.x,P0.y,POLE.r*(z.pp==='warn'?k:1),0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(P0.x,P0.y,POLE.r,0,TAU);ctx.stroke()}
    if(z&&!z.dead&&z.mode==='hypno'){for(let i=0;i<4;i++){const r=((tm*40+i*22)%88);ctx.strokeStyle=`rgba(255,79,216,${(1-r/88)*.6})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(z.x,z.y,r,0,TAU);ctx.stroke()}}}}
  L.its=[];
  after(.5,()=>{zoneBanner('НОЧНОЙ КЛУБ «БАРДАК» · ДУМСКАЯ');say([['C','Музыка орёт, а танцуют... мертвецы.'],['M','Р-р-р. (Блёстки, шейкеры, протеин. Весь центр на тусовке.)'],['C','А в центре танцпола шест. Кто-то там очень большой.']])});
}
const POLE={x:260,y:250,r:50};
function anzhela(dt){
  if(hold())return;const z=Q.anz;if(!z||z.dead)return;const rg=Q.rage?1.3:1;
  const d=D2(z.x,z.y,pl.x,pl.y),see=E.los(z.x,z.y,pl.x,pl.y),ta=Math.atan2(pl.y-z.y,pl.x-z.x);z.thr=99;
  const dmg=Math.max(0,(z.lhp||z.hp)-z.hp);z.lhp=z.hp;
  if(!Q.prot&&z.hp<z.max*.45&&z.mode==='chase'){Q.prot=1;z.mode='drink';z.dk=1.6;X.floatT(z.x,z.y-20,'ПРОТЕИНОВЫЙ КОКТЕЙЛЬ!','#ffd23a');sfx('groan',1.4)}
  if(z.mode==='drink'){z.stun=.1;z.dk-=dt;if(z.dk<=0){z.mode='chase';z.hp=Math.min(z.max,z.hp+260);z.lhp=z.hp;Q.rage=1;Q.bpm=150;setRate(1.1);C1.shake=.8;sfx('power',.6);
      note('Анжела допила коктейль! Она быстрее и злее');for(let i=0;i<20;i++)L.fx.push({x:z.x+rnd(-8,8),y:z.y+rnd(-8,8),vx:rnd(-20,20),vy:rnd(-40,-10),life:.8,c:'#ffe8a0'})}return}
  if(z.mode==='pole'){z.stun=.1;
    if(z.pp==='go'){z.pg-=dt;const a=Math.atan2(POLE.y-z.y,POLE.x-z.x),pd=D2(z.x,z.y,POLE.x,POLE.y);z.a=a;
      if(pd<6||z.pg<=0){z.x=POLE.x;z.y=POLE.y;z.pp='warn';z.pw=.9;sfx('hiss',.6)}else mv(z,Math.cos(a)*170*dt,Math.sin(a)*170*dt,z.r-3)}
    else if(z.pp==='warn'){z.pw-=dt;z.a+=dt*4;if(z.pw<=0){z.pp='spin';z.ps=2.6;sfx('swing',.6);X.floatT(z.x,z.y-20,'КРУЧУ ШЕСТ!','#ff4fd8')}}
    else{z.ps-=dt;z.a+=dt*16;if(Math.random()<dt*6)sfx('swing',.7+Math.random()*.3);
      if(d<POLE.r&&(Q.spinHit||0)<=0){Q.spinHit=.7;X.hurtPlayer(18);for(let i=0;i<10;i++)mv(pl,Math.cos(ta)*4,Math.sin(ta)*4,4);note('Каблуком с шеста! Отойди от круга')}
      for(const m of L.zs)if(!m.dead&&m.mk&&D2(m.x,m.y,z.x,z.y)<POLE.r)X.hurtZ(m,40*dt,Math.atan2(m.y-z.y,m.x-z.x),60);
      if(z.ps<=0){z.mode='chase';z.pc=rnd(8,10)/rg;z.stun=.6}}
    if(Q.spinHit>0)Q.spinHit-=dt;return}
  if(z.mode==='hypno'){z.stun=.1;z.a+=dt*3;z.ht-=dt;z.hd+=dmg;
    if(d>18&&!lockMove){const a=Math.atan2(z.y-pl.y,z.x-pl.x);mv(pl,Math.cos(a)*30*dt,Math.sin(a)*30*dt,4)}
    for(const m of L.zs)if(!m.dead&&m.mk&&m.st==='chase'){const a=Math.atan2(pl.y-m.y,pl.x-m.x);mv(m,Math.cos(a)*18*dt,Math.sin(a)*18*dt,m.r)}
    if(z.hd>=130){z.mode='chase';z.stun=2.2;z.hy=rnd(12,15)/rg;C1.shake=.6;sfx('thump',1.1);X.floatT(z.x,z.y-20,'ТАНЕЦ СБИТ!','#ffd23a')}
    else if(z.ht<=0){z.mode='chase';z.hy=rnd(12,15)/rg}
    return}
  z.pc-=dt;z.sh-=dt;z.ent-=dt;z.hy-=dt;
  if(z.pc<=0){z.mode='pole';z.pp='go';z.pg=2.2;X.floatT(z.x,z.y-20,'К ШЕСТУ!','#ff4fd8');return}
  if(z.hy<=0&&z.hp<z.max*.75){z.mode='hypno';z.ht=3.4;z.hd=0;Q.strobe=1.2;sfx('power',.7);X.floatT(z.x,z.y-20,'ГИПНО-ТАНЕЦ!','#ff4fd8');note('Гипноз тянет к ней! Бей Анжелу, чтобы сбить танец');return}
  if(z.sh<=0&&see&&d<220){z.sh=rnd(2.6,3.6)/rg;const n=Q.rage?5:3;for(let i=0;i<n;i++){const a=ta+(i-(n-1)/2)*.24;Q.eb.push({x:z.x,y:z.y,vx:Math.cos(a)*135,vy:Math.sin(a)*135,life:1.8,dmg:10,k:'shoe',sp:rnd(-12,12)})}sfx('swing',1.2);X.floatT(z.x,z.y-20,'ТУФЛИ!','#ff7ad8')}
  if(z.ent<=0){z.ent=12/rg;Q.strobe=1.6;sfx('groan',1.6);X.floatT(z.x,z.y-20,'СВИТА, КО МНЕ!','#ffd23a');
    for(const sx of [167,353])for(let i=0;i<2;i++)Zmt(sx+rnd(-8,8),146+rnd(0,8),{st:'chase'});if(Q.rage)Zbb(260,150,{st:'chase'})}
}
function anzDown(z){
  Q.won=true;Q.fight=0;C1.shake=1.2;sfx('power',1);setRate(1);Q.strobe=0;
  after(.6,()=>{
    for(const m of L.zs){if(m.dead)continue;Q.ghosts.push({x:m.x,y:m.y,a:m.a,type:m.type,v:m.v,t:1.4+Math.random()*1.4});m.dead=true}
    L.zs.length=0;Q.eb.length=0;Q.clouds.length=0;Q.vanishT=5;Q.bpm=0;
    for(let i=0;i<60;i++)L.fx.push({x:z.x+rnd(-20,20),y:z.y+rnd(-20,20),vx:rnd(-30,30),vy:rnd(-50,-10),life:rnd(.6,1.4),c:Math.random()<.5?'#ffd0f0':'#ffd23a'});
  });
  after(3.2,()=>say([['M','Всё. Танец окончен.'],['C','Смотри... тусовщики тают. Все до одного. Как у нас во дворе.'],['C','А у VIP-зала валяется бронежилет охраны клуба. Тяжёлый, с керамикой.'],['M','Мр-р. (Отнесём Микробу. Ему нужнее.)']],()=>{
    Q.pult=1;note('Забери бронежилет у VIP-зала');
    L.its.push({x:450,y:160,r:20,label:()=>'Бронежилет охраны «Бардака»',cond:()=>!Q.arm2,act:()=>{Q.arm2=1;if(C1.giveArmor)C1.giveArmor('2');
      say([['M','Р-р. (Взял в зубы. Тяжёлый.)'],['C','Дома отдадим. А теперь пульт, Мыш. Пусть город выспится.']],()=>note('Выключи пульт на сцене'))}});
    L.its.push({x:260,y:148,r:22,label:()=>'Выключить пульт',cond:()=>Q.arm2&&Q.pult&&!Q.off,act:()=>{Q.off=1;sfx('power',.6);setRate(.6);after(.8,()=>setRate(1));
      say([['C','Тишина. Наконец-то.'],['M','Мр-р. (Невский свободен.)'],['C','Пошли домой, Мыш. Нас ждут.']],()=>{lockMove=true;X.go(()=>{lockMove=false;playC4(CUT_WIN,()=>playC4(CUT_FINAL,endCh4,'home'),'win')})})}});
  }));
}
function setRate(r){try{for(const k in MUS){if(MUS[k])MUS[k].playbackRate=r}}catch(e){}}
function monkeys(dt){
  if(hold())return;
  for(const z of L.zs){if(z.dead||!z.mk||z.st!=='chase')continue;const d=D2(z.x,z.y,pl.x,pl.y);
    if(z.mk==='mac'){z.tt-=dt;if(z.tt<=0&&d<150&&E.los(z.x,z.y,pl.x,pl.y)){z.tt=rnd(2.6,4);const a=Math.atan2(pl.y-z.y,pl.x-z.x);
      Q.eb.push({x:z.x,y:z.y,vx:Math.cos(a)*120,vy:Math.sin(a)*120,life:1.6,dmg:7,k:'bottle',sp:rnd(-12,12)});sfx('swing',1.6)}}
    if(z.mk==='bab'){z.lp=(z.lp||rnd(1,3))-dt;
      if(z.lj>0){z.lj-=dt;z.stun=.05;mv(z,Math.cos(z.la)*190*dt,Math.sin(z.la)*190*dt,z.r-1);if(!z.lh&&d<z.r+5){z.lh=1;X.hurtPlayer(16)}}
      else if(z.lp<=0&&d<70&&d>16){z.lp=rnd(2.5,4);z.lj=.32;z.lh=0;z.la=Math.atan2(pl.y-z.y,pl.x-z.x);X.floatT(z.x,z.y-10,'ФЕЙС-КОНТРОЛЬ!','#ffd23a')}}
  }
}
function gorillas(dt){
  if(hold())return;const rg=Q.rage?1.3:1;
  for(const z of L.zs){if(z.dead||!z.ai)continue;const d=D2(z.x,z.y,pl.x,pl.y),see=E.los(z.x,z.y,pl.x,pl.y),ta=Math.atan2(pl.y-z.y,pl.x-z.x);
    if(z.ai==='bas'){z.thr=99;
      if(z.dw>0){z.stun=.1;z.a=ta;z.dw-=dt;if(z.dw<=0){C1.shake=1;sfx('thump',.7);sfx('power',.5);Q.rings.push({x:z.x,y:z.y,r:8,life:.7});
        if(d<64){X.hurtPlayer(24);const pa=Math.atan2(pl.y-z.y,pl.x-z.x);for(let i=0;i<10;i++)mv(pl,Math.cos(pa)*4,Math.sin(pa)*4,4);note('Бас-дроп! Тебя отбросило волной.')}
        for(const m of L.zs)if(!m.dead&&m.mk&&D2(m.x,m.y,z.x,z.y)<64)X.hurtZ(m,30,Math.atan2(m.y-z.y,m.x-z.x),120);z.dd=rnd(4.5,6)/rg}}
      else if(z.ch===1){z.stun=.1;z.cw-=dt;z.a=ta;if(z.cw<=0){z.ch=2;z.da=ta;z.dt=.8;sfx('groan',2.2)}}
      else if(z.ch===2){z.stun=.1;z.dt-=dt;const sp=220*dt*rg,nx=z.x+Math.cos(z.da)*sp,ny=z.y+Math.sin(z.da)*sp;
        if(solid(nx,ny,z.r-2)){z.ch=3;z.stun=1.4;C1.shake=.8;sfx('thump',1.2);X.floatT(z.x,z.y-18,'БУМ! В стену!','#ffd23a')}
        else{z.x=nx;z.y=ny;if(Math.random()<.6)L.fx.push({x:z.x+rnd(-4,4),y:z.y+rnd(-4,4),vx:0,vy:-8,life:.4,c:'#ff4fd8'})}
        if(!z.hitP&&D2(z.x,z.y,pl.x,pl.y)<z.r+6){z.hitP=1;X.hurtPlayer(26);note('DJ БАС снёс тебя с ног!')}
        if(z.ch===2&&z.dt<=0){z.ch=0;z.ct=rnd(5,7)/rg}}
      else if(z.ch===3){if(z.stun<=.06){z.ch=0;z.ct=rnd(5,7)/rg}}
      else{z.dd-=dt;z.ct-=dt;
        if(z.dd<=0&&d<110){z.dw=1;sfx('hiss',.6);X.floatT(z.x,z.y-18,'БАС-ДРОП!','#ff4fd8')}
        else if(z.ct<=0&&see&&d<220&&d>60){z.ch=1;z.cw=.7;z.hitP=0;X.floatT(z.x,z.y-18,'БРЕЙКБИТ!','#ff4fd8')}}
    }
    if(z.ai==='fio'){z.stun=Math.max(z.stun,.05);z.a=ta;
      if(z.lz>0){z.lz-=dt}
      else{let dir=null;if(!see||d>170)dir=navDir(z);else if(d<90)dir=ta+Math.PI;else{if(Math.random()<dt*.5)z.sd*=-1;dir=ta+Math.PI/2*z.sd}
        if(dir!=null)mv(z,Math.cos(dir)*z.sp*.85*dt,Math.sin(dir)*z.sp*.85*dt,z.r-2);z.ph+=dt*8}
      z.lt-=dt;if(z.lt<=0&&see){z.lt=rnd(7,9)/rg;z.lz=3.6;const a0=ta+Math.PI/3,w=(Math.random()<.5?-1:1)*.75*rg;
        Q.lasers.push({z,a:a0,w,warn:.9,t:3.6,n:3});sfx('power',1.8);X.floatT(z.x,z.y-18,'ЛАЗЕР-ШОУ!','#3ef0b0')}
      z.dr-=dt;if(z.dr<=0){z.dr=11/rg;Q.strobe=1.6;sfx('groan',1.6);X.floatT(z.x,z.y-18,'ДРОП!','#ffd23a');
        for(const sx of [167,353])for(let i=0;i<3;i++)Zmt(sx+rnd(-8,8),146+rnd(0,8),{st:'chase'})}
    }
  }
  for(const lz of Q.lasers){if(lz.warn>0||lz.z.dead)continue;for(let i=0;i<lz.n;i++){const a=lz.a+i*TAU/lz.n,dx=Math.cos(a),dy=Math.sin(a),px=pl.x-lz.z.x,py=pl.y-lz.z.y,t=px*dx+py*dy;
    if(t>0&&t<220&&Math.abs(px*dy-py*dx)<4&&(Q.lzHit||0)<=0){Q.lzHit=.4;X.hurtPlayer(12)}}}
}
function gorillasDown(z){
  Q.won=true;Q.fight=0;C1.shake=1.2;sfx('power',1);setRate(1);Q.lasers.length=0;Q.strobe=0;
  after(.6,()=>{
    for(const m of L.zs){if(m.dead)continue;Q.ghosts.push({x:m.x,y:m.y,a:m.a,type:m.type,v:m.v,t:1.4+Math.random()*1.4});m.dead=true}
    L.zs.length=0;Q.eb.length=0;Q.clouds.length=0;Q.vanishT=5;Q.bpm=0;
    for(let i=0;i<60;i++)L.fx.push({x:z.x+rnd(-20,20),y:z.y+rnd(-20,20),vx:rnd(-30,30),vy:rnd(-50,-10),life:rnd(.6,1.4),c:Math.random()<.5?'#d8ffd0':'#ff9ae8'});
  });
  after(3.2,()=>say([['M','Всё. Сет окончен.'],['C','Смотри... обезьяны тают. Все до одной. Как у нас во дворе.'],['M','Мр-р. (А пульт всё ещё долбит.)'],['C','Выруби его, Мыш. Лапой. Пусть город выспится.']],()=>{
    Q.pult=1;note('Выключи пульт гориллы');
    L.its.push({x:260,y:148,r:22,label:()=>'Выключить пульт',cond:()=>Q.pult&&!Q.off,act:()=>{Q.off=1;sfx('power',.6);setRate(.6);after(.8,()=>setRate(1));
      say([['C','Тишина. Наконец-то.'],['M','Мр-р. (Невский свободен.)'],['C','Пошли домой, Мыш. Нас ждут.']],()=>{lockMove=true;X.go(()=>{lockMove=false;playC4(CUT_WIN,()=>playC4(CUT_FINAL,endCh4,'home'),'win')})})}});
  }));
}
function ebTick(dt){
  if(hold())return;
  for(const b of Q.eb){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;const v=E.gAt(b.x,b.y);
    if(v===1||v===3){b.life=0;L.fx.push({x:b.x,y:b.y,vx:0,vy:0,life:.3,c:b.k==='poop'?'#e8e4dc':'#ffcc40'})}
    else if(D2(b.x,b.y,pl.x,pl.y)<6){b.life=0;X.hurtPlayer(b.dmg);if(b.k==='poop'){PS.slow=1;note('Голубь нагадил прямо на тебя! Фу!')}}}
  Q.eb=Q.eb.filter(b=>b.life>0);
  for(const c of Q.clouds){c.t-=dt;if(c.w>0){c.w-=dt;continue}if(D2(c.x,c.y,pl.x,pl.y)<c.r&&PS.inv<=0&&L.armed){PS.hp-=10*dt;C1.hurt=Math.max(C1.hurt,.12);if(PS.hp<=0)X.loseLife()}}
  Q.clouds=Q.clouds.filter(c=>c.t>0);
  for(const lz of Q.lasers){if(lz.warn>0)lz.warn-=dt;else{lz.t-=dt;lz.a+=lz.w*dt}}Q.lasers=Q.lasers.filter(l=>l.t>0&&!l.z.dead);if(Q.lzHit>0)Q.lzHit-=dt;
  for(const r of Q.rings){r.life-=dt;r.r+=200*dt}Q.rings=Q.rings.filter(r=>r.life>0);if(Q.strobe>0)Q.strobe-=dt;
  for(const b of Q.beams)b.life-=dt;Q.beams=Q.beams.filter(b=>b.life>0);
  for(const s of Q.slashes)s.t-=dt;Q.slashes=Q.slashes.filter(s=>s.t>0);
  for(const g of Q.ghosts){g.t-=dt;if(Math.random()<dt*14)L.fx.push({x:g.x+rnd(-5,5),y:g.y+rnd(-5,5),vx:rnd(-4,4),vy:rnd(-26,-12),life:rnd(.4,.8),c:Math.random()<.5?'#d8ffd0':'#ffffff'})}
  Q.ghosts=Q.ghosts.filter(g=>g.t>0);
}
function drawFx4(){
  for(const c of Q.clouds){const k=c.w>0?.15+.15*Math.sin(tm*20):.32;ctx.fillStyle=`rgba(90,230,80,${k})`;ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,TAU);ctx.fill();if(c.w>0){ctx.strokeStyle='rgba(120,255,100,.7)';ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,TAU);ctx.stroke()}}
  for(const b of Q.eb){if(b.k==='shoe'){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(tm*12+b.sp);F(-3,-1.5,6,3,'#ff4fd8');F(-3,-1.5,2,3,'#d82ab8');F(2,1.5,1,2,'#ffd23a');ctx.restore()}else if(b.k==='bottle'){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(tm*12+b.sp);F(-2.5,-1,4,2,'#2a8a3a');F(1.5,-.5,2,1,'#5ae87a');ctx.restore()}else if(b.k==='stick'){const a=tm*14+b.sp;ctx.strokeStyle='#7affd8';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(b.x-Math.cos(a)*3,b.y-Math.sin(a)*3);ctx.lineTo(b.x+Math.cos(a)*3,b.y+Math.sin(a)*3);ctx.stroke()}else if(b.k==='poop'){F(b.x-2,b.y-2,4,4,'#e8e4dc');F(b.x-1,b.y-1,2,2,'#8a8a7a')}else{F(b.x-1,b.y-1,2,2,'#ffe27a')}}
  for(const bm of Q.beams){const k=bm.life/(bm.heal?.5:.32);ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=bm.heal?`rgba(90,255,120,${k*.7})`:`rgba(255,70,200,${k})`;ctx.lineWidth=bm.heal?2:3*k+1.5;
    ctx.beginPath();ctx.moveTo(bm.x0,bm.y0);ctx.lineTo(bm.x1,bm.y1);ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${k})`;ctx.lineWidth=1;ctx.stroke();ctx.restore()}
  for(const s of Q.slashes){const k=s.t/.14;ctx.strokeStyle=`rgba(255,255,255,${k})`;ctx.lineWidth=1;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(s.x,s.y,11+i*2,s.a-1,s.a+1-k*1.5);ctx.stroke()}}
  for(const g of Q.ghosts){const b=X.zBody(g.type,g.v),S=g.type==='boss'?32:24;ctx.save();ctx.globalAlpha=clamp(g.t/1.4,0,1)*.9;ctx.translate(Math.round(g.x),Math.round(g.y-(1.4-g.t)*4));ctx.rotate(g.a);ctx.drawImage(b,-S/2,-S/2);ctx.restore()}
  for(const lz of Q.lasers){const z=lz.z;for(let i=0;i<lz.n;i++){const a=lz.a+i*TAU/lz.n,x1=z.x+Math.cos(a)*220,y1=z.y+Math.sin(a)*220;ctx.save();ctx.globalCompositeOperation='lighter';
      if(lz.warn>0){ctx.strokeStyle=`rgba(62,240,176,${.25+.25*Math.sin(tm*30)})`;ctx.lineWidth=1}else{ctx.strokeStyle='rgba(62,240,176,.8)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(z.x,z.y);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=1}
      ctx.beginPath();ctx.moveTo(z.x,z.y);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore()}}
  for(const r of Q.rings){ctx.strokeStyle=`rgba(255,79,216,${r.life/.7})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,TAU);ctx.stroke()}
  for(const z of L.zs){if(z.dead||z.ai!=='bas'||!(z.dw>0))continue;const k=1-z.dw;ctx.fillStyle=`rgba(255,40,80,${.12+.18*k})`;ctx.beginPath();ctx.arc(z.x,z.y,64,0,TAU);ctx.fill();ctx.strokeStyle=`rgba(255,40,80,${.5+.5*Math.sin(tm*30)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(z.x,z.y,64*k,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(z.x,z.y,64,0,TAU);ctx.stroke()}
  if(Q.strobe>0&&Math.floor(tm*14)%2){ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(0,0,L.w,L.h)}
  for(const z of L.zs){if(z.dead||!z.ai)continue;
    ctx.font='bold 4px monospace';ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillText(z.nm,z.x+.5,z.y-14.5);ctx.fillStyle=z.ai==='bas'?'#ff4fd8':'#3ef0b0';ctx.fillText(z.nm,z.x,z.y-15);ctx.textAlign='left';
    F(z.x-10,z.y-13,20,2,'rgba(0,0,0,.6)');F(z.x-10,z.y-13,20*z.hp/z.max,2,'#c0202a');
    if(z.ch===1){ctx.strokeStyle=`rgba(255,40,40,${.5+.5*Math.sin(tm*30)})`;ctx.beginPath();ctx.arc(z.x,z.y,z.r+10,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(z.x,z.y);ctx.lineTo(z.x+Math.cos(z.a)*50,z.y+Math.sin(z.a)*50);ctx.stroke()}
    if(z.mf>0){for(let i=0;i<6;i++)F(z.x+Math.cos(z.a)*(12+i),z.y+Math.sin(z.a)*(12+i),2,2,i<2?'#fff':'#ffb040')}}
  const s=C4.slash;if(C4.cat&&s&&s.t>0){const k=s.t/s.T,r=s.big?14:11,cx=pl.x+Math.cos(s.a)*9,cy=pl.y+Math.sin(s.a)*9,gap=(1-k)*6;
    ctx.save();ctx.translate(cx,cy);ctx.rotate(s.a);ctx.globalAlpha=Math.min(1,k*1.8);
    for(const sd of [-1,1]){ctx.strokeStyle=s.big?'#ffe27a':'#ffffff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,sd*(r*.5-gap*.5),r*.6,sd>0?Math.PI*1.1:Math.PI*.1,sd>0?Math.PI*1.9:Math.PI*.9);ctx.stroke();
      for(let i=-2;i<=2;i++)F(i*3,sd*(r*.5-gap*.5)-sd*r*.6+(sd>0?0:-2),1,2,'#ffffff')}
    ctx.restore()}
}

// ================= ПАСТЬ И ПРОЧЕЕ ЗА МЫША =================
function bite(){
  C4.combo=C4.comboT>0?(C4.combo+1)%3:0;C4.comboT=.7;
  const big=C4.combo===2;C4.cd=big?.48:.22;C4.swing=.16;
  C4.slash={t:.16,T:.16,a:pl.a,big};
  sfx('swing',1.1);let hit=0;const a=pl.a;
  for(const z of L.zs.slice()){if(z.dead||z.st==='hidden')continue;const d=D2(pl.x,pl.y,z.x,z.y);if(d>z.r+(big?22:18))continue;
    const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(d>z.r+4&&Math.abs(angDiff(za,a))>(big?1.3:1))continue;
    const boss=z.type==='boss';X.hurtZ(z,boss?(big?50:24):(big?140:70),za,boss?0:(big?210:110));if(boss&&big)z.stun=Math.max(z.stun,.3);hit++}
  if(hit){sfx('bat',1.2);sfx('hit');C1.shake=Math.max(C1.shake,big?.4:.15);
    if(big){PS.hp=Math.min(PS.max,PS.hp+5*hit);X.floatT(pl.x,pl.y-12,'ХРЯСЬ! +'+(5*hit),'#ffe27a')}}
}
function biteAssist(){let best=null,bd=1e9;for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const d=D2(pl.x,pl.y,z.x,z.y);if(d>48||d>=bd)continue;
  const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(d>z.r+8&&Math.abs(angDiff(za,pl.a))>1.2)continue;best=za;bd=d}if(best!==null)pl.a=best}
function c4Tick(dt){
  PS.wpn='bite';PS.hasShotgun=false;PS.moon=0;PS.cd=1;
  if(C4.cd>0)C4.cd-=dt;if(C4.swing>0)C4.swing-=dt;if(C4.comboT>0)C4.comboT-=dt;if(C4.slash&&C4.slash.t>0)C4.slash.t-=dt;
  if(PS.syr<C4.lastSyr){PS.regen+=70;sfx('pick');note('Хрум! Протеиновый корм — раны затягиваются');for(let i=0;i<8;i++)L.fx.push({x:pl.x+rnd(-5,5),y:pl.y+rnd(-5,5),vx:rnd(-10,10),vy:rnd(-30,-10),life:.6,c:'#ff7ab8'})}
  C4.lastSyr=PS.syr;
  const free=!dlg&&!tr&&!lockMove;if(!free||!L.armed)return;
  const [mx,my,ml]=X.inputMove();if(ml>.1){const sp=30*dt;const nx=pl.x+mx*sp,ny=pl.y+my*sp;if(!solid(nx,pl.y,3.5))pl.x=nx;if(!solid(pl.x,ny,3.5))pl.y=ny}
  const btn=C1.fire!=null||C1.fireQ;
  if(C4.cd<=0&&((C1.mdown&&mouse.on&&!touch.on)||X.touchFiring()||btn)){if(btn&&!(touch.aim&&touch.aim.moved))biteAssist();bite();C1.fireQ=false}
}

// ================= КАТ-СЦЕНЫ: персонажи сбоку =================
const SKY_DAY=['#3a7ad8','#4a86dc','#5a92e0','#6a9ee4','#7aaae8','#8ab6ec','#9ac2f0','#aacef2','#bad8f4','#cae2f6'];
function withDay(fn){const bak=SKY_EVE.slice();SKY_EVE.splice(0,SKY_EVE.length,...SKY_DAY);try{fn()}finally{SKY_EVE.splice(0,SKY_EVE.length,...bak)}}
const PAL_BLACK={b:'#141219',hl:'#2f2a38',ey:'#d4ea4f',pt:'#141219',face:'#141219'};
const PAL_SIAM={b:'#efe1c6',hl:'#d6c19e',ey:'#58b0ff',pt:'#4a3024',face:'#4a3024'};
function catSide(x,y,t,s,mode,p){
  p=p||PAL_BLACK;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);
  const w=mode==='walk'?Math.round(Math.sin(t*12)*1.2):0;
  F(-6+w,-3,1,3,p.pt);F(-4-w,-3,1,3,p.pt);F(3+w,-3,1,3,p.pt);F(5-w,-3,1,3,p.pt);
  F(-7,-7,13,4,p.b);F(-6,-7,10,1,p.hl);
  const hd=mode==='eat'?3+Math.round(Math.sin(t*14)):0;
  F(5,-10+hd,5,5,p.b);F(8,-9+hd,2,3,p.face);F(5,-12+hd,1,2,p.pt);F(8,-12+hd,1,2,p.pt);F(8,-8+hd,1,1,p.ey);F(10,-7+hd,1,1,'#2f2630');
  for(let i=0;i<6;i++)F(-8-Math.round(Math.sin(t*3+i*.6)),-8-i,1,1,p.pt);
  ctx.restore();
}
function buffSide(x,y,t,s,o){ // кот-качок на задних лапах; o.siam — Мыш, o.cl — когти 0..1, o.jaw — пасть 0..1
  o=o||{};const p=o.siam?PAL_SIAM:PAL_BLACK;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(o.flip?-s:s,s);
  const Bk=p.b,HL=o.siam?'#fff4de':'#34303e',EY=p.ey,PT=p.pt,CL='#e8ecf4';const br=Math.round(Math.sin(t*2)*.5);
  for(let i=0;i<8;i++)F(-7-Math.round(Math.sin(t*3+i*.5)*1.5),-6-i*1.5,2,2,PT);
  F(-4,-9,3,9,Bk);F(1,-9,3,9,Bk);F(-5,-1,4,1,PT);F(1,-1,4,1,PT);
  F(-5,-19+br,10,11,Bk);F(-7,-21+br,14,5,Bk);
  F(-3,-17+br,6,1,HL);F(-1,-14+br,2,1,HL);F(-1,-12+br,2,1,HL);F(-6,-20+br,4,1,HL);F(2,-20+br,4,1,HL);
  F(-9,-19+br,3,9,Bk);F(6,-19+br,3,9,Bk);F(-9,-11+br,3,3,PT);F(6,-11+br,3,3,PT);
  if(o.cl>0){const n=Math.round(o.cl*7);for(let i=0;i<3;i++){F(5+i*2,-11+br-n,1,n,CL);F(-10+i*2,-11+br-n,1,n,CL)}}
  F(-4,-28+br,8,8,Bk);F(-4,-31+br,2,3,PT);F(2,-31+br,2,3,PT);if(o.siam)F(-2,-26+br,4,5,PT);
  F(-3,-25+br,2,1,EY);F(1,-25+br,2,1,EY);F(-3,-26+br,2,1,'#050405');F(1,-26+br,2,1,'#050405');
  const j=o.jaw||0;
  if(j>0){const h=1+Math.round(j*4);F(-3,-22+br,6,h,'#3a0a10');F(-3,-22+br,1,2,'#fff');F(2,-22+br,1,2,'#fff');F(-2,-22+br+h-1,1,1,'#fff');F(1,-22+br+h-1,1,1,'#fff')}
  else{F(-1,-23+br,2,1,'#3a2a34');F(-1,-22+br,2,1,o.open?'#6a2a3a':Bk)}
  ctx.restore();
}
function sideShmak(x,y,t,mode){
  const SK='#f2cab2',D='#f59cc8',DD='#cf74a2',HR='#2c1a1f';const s=mode==='walk'?Math.round(Math.sin(t*10)*1.5):0;
  F(x-3+s,y-10,2,7,SK);F(x-s,y-10,2,7,SK);F(x-4+s,y-3,4,3,'#0e0e12');F(x-1-s,y-3,4,3,'#0e0e12');
  const ty=y-10;F(x-4,ty-11,8,11,D);F(x-5,ty-3,10,3,D);F(x-4,ty-11,2,11,DD);F(x+1,ty-10,2,8,SK);
  const hy=ty-18;F(x-3,hy,7,7,SK);F(x-4,hy-1,8,3,HR);F(x-5,hy,3,13,HR);F(x-4,hy+1,2,10,HR);F(x+2,hy+3,1,1,'#2a1e18');F(x+2,hy+5,2,1,'#c0506a');
}
function sideEgor(x,y,t,mode,o){
  o=o||{};const SK='#e9b994',FUR='#ff5aa8',FD='#d63c88',FL='#ff9ccc';const s=mode==='walk'?Math.round(Math.sin(t*10)*1.5):0;
  F(x-3+s,y-11,3,9,'#18181e');F(x-s,y-11,3,9,'#18181e');F(x-4+s,y-3,5,3,'#0e0e12');F(x-1-s,y-3,5,3,'#0e0e12');
  const ty=y-11;F(x-6,ty-13,12,14,FUR);F(x-6,ty-13,2,14,FD);for(let i=0;i<10;i++)F(x-5+Math.floor(hash(i,3)*10),ty-12+Math.floor(hash(3,i)*13),1,1,FL);
  F(x-1,ty-13,3,10,'#141418');F(x,ty-9,1,1,'#e8d070');
  if(o.point){F(x+4,ty-12,2,5,FUR);F(x+5,ty-18,2,6,SK)}else F(x+5,ty-11,2,9,FUR);
  const hy=ty-21;F(x-3,hy,7,8,SK);F(x-3,hy-1,7,2,'#9a8070');F(x-1,hy-7,4,7,'#16121a');F(x,hy-8,3,2,'#16121a');
  F(x+1,hy+2,4,2,'#0c0a10');F(x-1,hy+2,2,1,'#0c0a10');F(x+2,hy+6,2,1,'#a0605a');
  if(o.laser){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,70,200,.9)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+5,hy+3);ctx.lineTo(W,hy+3+o.laser);ctx.stroke();ctx.restore()}
}
function kitchenSide(t){
  F(0,0,W,124,'#d8c8a8');for(let y=60;y<124;y+=8)F(0,y,W,1,'#c8b898');for(let x=0;x<W;x+=12)F(x,60,1,64,'#c8b898');
  F(0,52,W,8,'#8a6a48');F(0,56,W,1,'#6a4a30');for(let x=20;x<W;x+=60){F(x,10,40,40,'#a88a68');F(x+2,12,36,36,'#b89a78');F(x+18,28,4,2,'#d8c8a8')}
  F(0,124,W,56,'#8a8274');for(let y=124;y<180;y+=8)for(let x=((y/8)%2)*8;x<W;x+=16)F(x,y,8,8,'#c8c0ae');
  F(230,110,28,40,'#e8e0d0');F(230,110,28,8,'#ff4fa3');ctx.fillStyle='#120a1c';ctx.font='bold 5px monospace';ctx.textAlign='center';ctx.fillText('КОТ-',244,126);ctx.fillText('ПРОТЕИН',244,133);ctx.textAlign='left';
  ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,160,30,120,'rgba(255,230,180,A)',.12);ctx.restore();
}
function livingSide(t,party){
  F(0,0,W,180,'#18122a');for(let x=0;x<W;x+=40)F(x,0,1,130,'#221a38');
  F(0,128,W,52,'#2a2238');for(let x=0;x<W;x+=24)F(x,128,1,52,'#241c32');
  F(20,18,280,2,'rgba(40,230,150,.6)');F(20,126,280,2,'rgba(40,230,150,.6)');
  F(230,40,60,40,'#0e0e16');F(232,42,56,30,'#2a3a6a');F(256,80,8,14,'#1a1a1e');F(244,94,32,3,'#2a2a30');
  ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,160,10,90,'rgba(255,60,190,A)',.18);radial(ctx,260,60,40,'rgba(120,160,255,A)',.25);
  if(party){for(let i=0;i<3;i++)radial(ctx,60+i*100+Math.sin(t*3+i)*30,60,50,['rgba(255,60,220,A)','rgba(60,240,200,A)','rgba(255,210,60,A)'][i],.25+.15*Math.sin(t*8+i))}
  ctx.restore();
}
function newsBar(head,good){
  F(0,12,W,12,good?'#1a6a3a':'#c0101a');ctx.fillStyle='#fff';ctx.font='bold 7px monospace';ctx.fillText(good?'ХОРОШИЕ НОВОСТИ':'СРОЧНО · ПРЯМОЕ ВКЛЮЧЕНИЕ',6,21);
  ctx.textAlign='right';ctx.fillText('НЕВА 24',W-6,21);ctx.textAlign='left';
  F(6,H-40,W-12,10,'rgba(245,245,245,.95)');F(6,H-40,4,10,good?'#1a6a3a':'#c0101a');ctx.fillStyle='#111';ctx.font='bold 6px monospace';ctx.fillText(head,13,H-32.5);
}

// ================= КАТ-СЦЕНЫ =================
const CUT_PARTY=[ // флэшбэк: старая туса Егора
  {dur:5.6,subs:[[.3,2.6,'h','(Пять лет назад. Два часа ночи.)'],[2.7,5.4,'e','ДЛЯ ВСЕХ МОИХ СОСЕДЕЙ! КАРАОКЕ С БАЛКОНА-А-А!']],draw(t,s){
    drawHouse(t);ctx.fillStyle='rgba(10,0,30,.45)';ctx.fillRect(0,0,W,H);
    for(let i=0;i<16;i++){const x=40+(i%8)*32,y=40+Math.floor(i/8)*30;const c=['#ff4fd8','#3ef0b0','#ffd23a'][(i+Math.floor(t*4))%3];F(x,y,10,8,c)}
    ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++)radial(ctx,100+i*60+Math.sin(t*4+i)*20,70,60,['rgba(255,60,220,A)','rgba(60,240,200,A)','rgba(255,210,60,A)'][i],.3);ctx.restore();
    F(150,92,24,3,'#c8c8d0');sideEgor(160,92,t,'stand',{point:Math.floor(t*4)%2===0});
    if(Math.random()<.5)cparts.push({x:rnd(0,W),y:-4,vx:rnd(-10,10),vy:rnd(20,40),g:10,life:4,c:['#ff4fd8','#3ef0b0','#ffd23a','#ffffff'][(Math.random()*4)|0]});
    for(const p of cparts)F(p.x,p.y,2,2,p.c);
    if(t>4.2&&!s._f.w){s._f.w=1;sfx('thump',.6)}}},
  {dur:5.2,subs:[[.3,2.5,'h','А ну выключили музыку! Я полицию вызову!'],[2.6,5,'e','Тётушка Ханжа! Поднимайтесь к нам! Лифт — дискотека!']],draw(t){
    F(0,0,W,H,'#0e0a18');F(110,20,100,150,'#3a3a44');F(116,26,88,140,'#1a1020');
    for(let i=0;i<8;i++)F(118+i*11,30+Math.sin(t*6+i)*3,6,4,['#ff4fd8','#3ef0b0','#ffd23a'][i%3]);
    ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,160,90,70,'rgba(255,60,220,A)',.25+.2*Math.sin(t*10));ctx.restore();
    F(130,120,18,26,'#141418');F(132,124,14,8,'#3a3a44');F(136,126,6,4,Math.sin(t*12)>0?'#ff4fd8':'#3ef0b0');
    sideEgor(170,166,t,'stand',{point:true});
    F(250,110,30,60,'#6a6a72');F(254,114,22,52,'#2a2a30');F(262,140,6,24,'#7a2a3a');F(260,126,10,10,'#efc5a5');F(259,124,12,4,'#8a6748')}},
];
const CUT_FEED=[
  {dur:5.4,subs:[[.3,2.6,'s','Одна порция... Две... Мыш, может, хватит?'],[2.7,5.2,'e','Он три дня не ел! Пусть хоть пять!']],draw(t){
    kitchenSide(t);F(150,150,30,6,'#3a7ac8');F(152,148,26,3,'#5a9ae8');F(156,148,18,2,'#a87a3a');catSide(158,156,t,3,'eat',PAL_SIAM);sideEgor(70,170,t,'stand');sideShmak(270,170,t,'stand');
    if(t>3.6){ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,158,138,40+Math.sin(t*12)*6,'rgba(120,180,255,A)',(t-3.6)*.3);ctx.restore()}}},
  {dur:5,subs:[[.4,2.5,null,'(ХРУСТ. Мышцы растут прямо на глазах.)'],[2.7,4.8,'e','Э-э-э... Мыш?! Ты чего такой огромный?!']],draw(t,s){
    kitchenSide(t);const p=clamp((t-.3)/3.2,0,1);
    ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,158,120,70+p*40,'rgba(120,180,255,A)',.35+Math.sin(t*20)*.15);ctx.restore();
    if(p<.55)catSide(158,156,t,3+p*3.6+Math.sin(t*30)*.2,'stand',PAL_SIAM);else buffSide(158,160,t,1.6+(p-.55)*4.4,{siam:1});
    if(!s._f.boom&&p>.55){s._f.boom=1;cut.shake=1;sfx('power',.8);sfx('thump',1);for(let i=0;i<40;i++)cparts.push({x:158+rnd(-20,20),y:120+rnd(-30,30),vx:rnd(-60,60),vy:rnd(-70,10),g:120,life:1.4,c:Math.random()<.5?'#9ad8ff':'#ffffff'})}
    drawSmoke();if(t<4&&Math.random()<.3)cut.shake=Math.max(cut.shake,.25)}},
  {dur:1,lines:[['M','Мр-р-р... ГР-Р-Р.'],['M','(Ох. Что это со мной? Я чувствую... зубы. Много зубов.)'],['m','Добро пожаловать в клуб, Мыш.'],
    ['e','Пацан, у тебя пасть как у акулы!'],['M','Р-Р-РАВ! (Хочу кого-нибудь разгрызть. Желательно зомби.)'],
    ['c','Мяу?! (Это кто? Тебя зовут МЫШ?! Серьёзно?)'],['M','Мр. (Проблемы, Черсик?)'],['c','Мяу. (...Никаких. Корм не трогай.)'],
    ['s','Черсик, тебе тоже порция. Вы теперь вдвоём.']],draw(t,s){
    livingSide(t);sideMikrob(36,170,t,'stand');sideEgor(66,170,t,'stand');sideShmak(96,170,t,'stand');
    const d=s._f;if(dlg&&dlg.i>=3&&!d.jaw){d.jaw=t;sfx('swing',1.4);cut.shake=.4}
    const j=d.jaw?Math.max(0,Math.sin((t-d.jaw)*6)):0;buffSide(170,170,t,3.4,{siam:1,jaw:j});
    if(dlg&&dlg.i>=8&&!d.ch){d.ch=t;sfx('power',.7);cut.shake=.6}
    if(d.ch&&t-d.ch>.6)buffSide(250,170,t,3.4,{cl:clamp((t-d.ch-.6)*4,0,1),flip:true});else catSide(250,166,t,3,'stand')}},
  {dur:1,lines:[['C','Снова в форме.'],['e','Пацаны... у меня в центре всё плохо. Мой район, Невский, всё вокруг — до сих пор зомби.'],
    ['e','Хорошо, что связь на крыше починили. По радио сказали: эпицентр заразы в центре — ночной клуб «Бардак» на Думской.'],
    ['s','Там вечеринка не кончается вторые сутки. Зомби со всего центра идут туда, как под гипнозом.'],
    ['e','Говорят, на шесте там танцует Анжела. Звезда «Бардака». Только она теперь... большая. Очень.'],['C','Стриптизёрша-зомби. Ну, хоть не крысы.'],['M','Р-р-р. (Я им всё отгрызу.)'],['m','Два кота-качка против всего центра. Звучит как план.'],
    ['s','Корм возьмите! Пять порций. Ранят — ешьте.'],['C','Пошли, Мыш. Охота начинается.']],draw(t){
    livingSide(t);sideMikrob(36,170,t,'stand');sideEgor(66,170,t,'stand');sideShmak(96,170,t,'stand');buffSide(170,170,t,3.4,{siam:1});buffSide(250,170,t,3.4,{cl:1,flip:true})}},
];
const CUT_GO=[
  {dur:6,subs:[[.3,2.8,null,'(Ночь. Два кота-качка бегут через мост к центру.)'],[2.9,5.8,null,'(Там, где ещё горят дома, их ждёт охота.)']],draw(t){
    const off=t*80;sky(SKY_RED,12,110);drawFar(off*.2,110,true);F(0,110,W,70,'#1a080c');F(0,128,W,6,'#4a3a3a');for(let x=-mod(off,24);x<W;x+=24)F(x,118,2,10,'#6a5a5a');F(0,116,W,2,'#6a5a5a');
    F(0,134,W,46,'#0a1020');for(let i=0;i<12;i++)F(mod(i*37-off*.4,W),150+(i%4)*7,10,1,'rgba(255,120,60,.4)');
    buffSide(140+Math.sin(t*12)*2,128,t,1.4,{siam:1});buffSide(110+Math.sin(t*12+1)*2,128,t,1.4,{cl:1});
    ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,280,80,90,'rgba(255,100,40,A)',.25);ctx.restore()}},
];
const CUT_WIN=[
  {dur:7,subs:[[.3,3.3,'r','Хорошие новости! В клубе «Бардак» на Думской всё стихло. Заражённые на Невском исчезают.'],[3.4,6.8,'r','Очевидцы видели двух огромных котов, выходящих из клуба на Думской.']],draw(t){
    const off=600+t*30;withDay(()=>{sky(SKY_DAY,12,104)});drawFar(off*.2,104,false);drawStrip(STRIP,off,142,false,t);street(off,142,false);
    for(let i=0;i<8;i++){const sp=i%2?16:-14,x=mod(i*53+t*sp,W+40)-20;sidePed(x,148,t+i,PAL[i%PAL.length],sp>0?1:-1,false)}
    buffSide(150,148,t,1.2,{siam:1});buffSide(172,148,t,1.2,{cl:1,flip:true});
    newsBar('АНЖЕЛА ПОВЕРЖЕНА · КОТЫ-ГЕРОИ',true)}},
  {dur:9,subs:[[.3,4.2,'r','Карта заражения: Невский и Думская снова зелёные.'],[4.4,8.8,'r','Но Горьковская и Заячий остров с крепостью — по-прежнему красные. Туда крысы и стекаются.']],draw(t){cityMap(t)}},
];
function cityMap(t){
  F(0,0,W,H,'#0a0e16');for(let x=0;x<W;x+=16)F(x,0,1,H,'rgba(80,120,160,.08)');for(let y=0;y<H;y+=16)F(0,y,W,1,'rgba(80,120,160,.08)');
  const CX=170,CY=88,cs=8,hot=[[CX-72,CY-26],[CX+64,CY+38],[CX+104,CY-18]];
  for(let gy=28;gy<H-30;gy+=cs)for(let gx=20;gx<W-20;gx+=cs){const dx=gx-CX,dy=(gy-CY)*1.3,dd=Math.hypot(dx,dy);if(dd>150+hash(gx,gy)*20)continue;
    const clean=t*42>dd-6;let c=clean?(hash(gx,gy*3)<.5?'#1e5a3a':'#246a44'):(hash(gx*3,gy)<.5?'#6a1a22':'#7a222a');
    if(hot.some(([hx,hy])=>Math.hypot(gx-hx,gy-hy)<10)&&t>3.5)c=Math.sin(t*6)>0?'#c8202a':'#8a1018';F(gx,gy,cs-1,cs-1,c)}
  ctx.strokeStyle='#3a7ac8';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(20,70);ctx.bezierCurveTo(90,60,120,96,170,82);ctx.bezierCurveTo(210,70,240,96,300,92);ctx.stroke();
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(150,84);ctx.lineTo(140,40);ctx.moveTo(196,78);ctx.lineTo(210,30);ctx.stroke();
  ctx.strokeStyle='#5aa0e8';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(20,70);ctx.bezierCurveTo(90,60,120,96,170,82);ctx.bezierCurveTo(210,70,240,96,300,92);ctx.stroke();
  F(CX+8,CY+6,5,5,'#3ef0b0');F(CX+9,CY+7,3,3,'#ffffff');F(CX-46,CY+30,5,5,'#ffd23a');
  ctx.font='bold 5px monospace';ctx.fillStyle='#3ef0b0';ctx.fillText('«БАРДАК»',CX+15,CY+11);ctx.fillStyle='#ffd23a';ctx.fillText('НАШ ДОМ',CX-40,CY+35);ctx.fillStyle='#ff5a5a';ctx.fillText('КРЕПОСТЬ',CX-92,CY-34);
  if(t>3.5)for(const [hx,hy] of hot){const k=(t*1.5+hx)%1;ctx.strokeStyle=`rgba(255,60,60,${1-k})`;ctx.beginPath();ctx.arc(hx+3,hy+3,4+k*10,0,TAU);ctx.stroke()}
  ctx.font='bold 7px monospace';ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.fillText('САНКТ-ПЕТЕРБУРГ · КАРТА ЗАРАЖЕНИЯ',W/2,22);ctx.textAlign='left';
  F(8,26,6,5,'#246a44');F(8,34,6,5,'#3ef0b0');ctx.font='5px monospace';ctx.fillStyle='#c8d0e0';ctx.fillText('чисто',16,30);ctx.fillText('восстановлен',16,38);
}
const CUT_FINAL=[
  {dur:1,lines:[['e','Пацаны вернулись!!!'],['s','Котики! Живые!'],['m','Ну что, Егор. Проверили животных?'],['e','Проверили. Птицы накормлены. Мыш накормлен. Даже слишком.'],
    ['w','Мяу. (Корм перестал действовать. Но вкус я запомнил.)'],['c','Мяу. (Теперь он будет ходить в гости. Каждый день. За кормом.)'],
    ['e','Так. Мой район свободен, все живы. Это надо отметить! Туса у вас!'],['s','Только тихо! Ханжа нас убьёт.'],['e','Ханжа сама просила включить её любимую. Я колонку принёс.'],
    ['m','...Ладно. Одну песню.'],['e','Одну песню! *включает* ...и ещё одну.'],['m','По новостям Невский чистый. Но у крепости всё ещё красная зона. Туда никто не суётся.'],['s','А в мире ещё неспокойно... Олеся в Италии не отвечает.'],['e','Завтра. Всё завтра. Сегодня — туса.']],draw(t){
    livingSide(t,true);sideMikrob(60,170,t,'stand');sideShmak(96,170,t,'stand');sideEgor(140,170,t,'stand',{point:Math.floor(t*2)%2===0});
    catSide(200,168,t,2.4,'stand',PAL_SIAM);catSide(240,168,t,2.4,'stand');
    if(Math.random()<.3)cparts.push({x:rnd(0,W),y:-4,vx:rnd(-10,10),vy:rnd(20,40),g:10,life:5,c:['#ff4fd8','#3ef0b0','#ffd23a'][(Math.random()*3)|0]});for(const p of cparts)F(p.x,p.y,2,2,p.c)}},
];

// ================= СЮЖЕТ В КВАРТИРЕ =================
function setFlat4(){
  C1.on=false;C1.mode=null;C1.noWpn=false;C4.on=true;C4.cat=false;if(window.C3)C3.on=false;if(window.C2){C2.on=false;C2.zone=null}
  scene='flat';cut=null;dlg=null;tr=null;S.fade=0;state='play';
  S.step=12;S.alarm=false;S.skladLocked=false;S.bat=S.pistol=false;S.bowls=true;mapDirty=true;lastRoom=null;camY=0;
  pl.scoot=false;pl.sit=false;lockMove=true;
  shmak.mode='stand';shmak.hug=0;shmak.path=[];cat.path=[];cat.then=null;
}
function kitMikrob(){Object.assign(PS,{hp:100,max:100,lives:3,inv:0,wpn:'pistol',ammo:90,shells:0,syr:3,moon:0,hasShotgun:false,hasAxe:false,hasNail:false,hasExt:false,hasRail:false,hasFlame:false,regen:0,carry:false,slow:0});if(window.UP)UP.kit(4)}
function kitMysh(){Object.assign(PS,{hp:260,max:260,lives:3,inv:0,wpn:'bite',ammo:0,shells:0,syr:5,moon:0,hasShotgun:false,regen:0,carry:false,slow:0})}
function startCh4(){
  C4.started=true;C4.done=false;setFlat4();mz4('call');
  pl.x=176;pl.y=74;pl.a=0;pl.ma=0;shmak.x=136;shmak.y=40;shmak.mode='sit';shmak.a=-Math.PI/2;
  cat.x=CAT_HOME.x;cat.y=CAT_HOME.y;cat.mode='sleep';
  after(1,()=>{sfx('ring');after(.9,()=>sfx('ring'));note('Звонит телефон: «Егор Алкопатимен»');
    after(1.8,()=>say([['m','Алло? Егор?'],['e','Братан! Живой?! У меня тут двое суток связи не было.'],['e','Слушай, ты Мыша покормил? И птичек? Батя с Полиной в отъезде, я на тебя рассчитывал.'],
      ['m','Егор... Тут был полный пиздец. Зомби, крысы, король в подвале.'],['m','Но мы быстро, за день, всё порешали.'],['e','За день?! А кот?'],
      ['m','До кота я, честно, не дошёл. Слушай, у нас сейчас самое безопасное место в городе. Приезжай. Проверим животных вместе.'],
      ['e','Выезжаю! Жёлтый самокат заряжен, шуба на мне. Держитесь, Алкопатимен едет!'],
      ['s','Только пусть тусу не устраивает! ...И я с тобой иду. Дробовик Аниса — мой.'],['m','Тогда мне пистолет. Пошли встречать.'],['c','Мр... (Сплю. Разбудите, когда будет корм.)']],()=>{
        kitMikrob();C4.kills0=PS.kills;if(window.UP&&UP.prep)UP.prep('встречать Егора',()=>{C4.kills0=PS.kills;X.go(()=>sec4('yard4'))});else X.go(()=>sec4('yard4'))}))});
}
function afterFeed(){kitMysh();C4.kills0=PS.kills;playC4(CUT_GO,()=>(window.HMC?HMC.egor(C4,()=>sec4('nevsky')):sec4('nevsky')),'go')}
function endCh4(){
  setFlat4();mz4('final');pl.x=176;pl.y=74;shmak.x=136;shmak.y=40;shmak.mode='sit';cat.x=CAT_HOME.x;cat.y=CAT_HOME.y;cat.mode='sleep';
  C4.done=true;S.fade=.01;
}

// ================= ПОДМЕНА ЦИКЛА =================
const _update=update,_render=render,_action=action;
update=function(dt){
  _update(dt);
  if(C4.on&&C4.cat&&C1.TB&&C1.TB.h)C1.TB.h.t='КОРМ';
  if(C4.zoneT>0)C4.zoneT-=dt;
  if(state!=='play'||cut||C1.over)return;
  if(C4.on&&C1.on&&C1.mode==='td'&&L&&E.L===L&&Q.allies){
    if(C4.cat)c4Tick(dt);
    for(const A of Q.allies)allyTick(A,dt);
    ebTick(dt);
  }
};
function heart(x,y,on){u.fillStyle=on?'#ff3a5a':'rgba(255,255,255,.18)';u.fillRect(x,y,2,1);u.fillRect(x+3,y,2,1);u.fillRect(x,y+1,5,2);u.fillRect(x+1,y+3,3,1);u.fillRect(x+2,y+4,1,1)}
function hud4(){
  panel(4,4,116,30,.72);u.fillStyle='#58b0ff';u.fillRect(4,4,2,30);
  uiFont(4,true);u.fillStyle='#9a92b0';u.fillText('HP',9,10.5);X.hudBar(20,6.5,70,4,PS.hp/PS.max,PS.hp<PS.max*.3?'#ff3a3a':'#8ad0ff');
  if(PS.regen>0){u.fillStyle='rgba(255,122,184,.55)';u.fillRect(20+70*PS.hp/PS.max,6.5,Math.min(70*(1-PS.hp/PS.max),70*PS.regen/PS.max),4)}
  if(!C1.hard)for(let i=0;i<3;i++)heart(95+i*7,6,i<PS.lives);
  uiFont(5,true);u.fillStyle='#ffd23a';u.fillText('ПАСТЬ'+(C4.comboT>0&&C4.combo===1?'  · ещё укус — РАЗГРЫЗ!':''),9,19);
  uiFont(4.4,false);u.fillStyle='#ffb0d8';u.fillText('Корм: '+PS.syr+(touch.on?'':' [H]')+'     Убито: '+(PS.kills-C4.kills0),9,28);
}
render=function(){
  _render();
  if(state!=='play')return;
  if(C4.on&&C1.on&&C1.mode==='td'&&!cut&&L&&E.L===L){
    if(C4.cat&&L.armed)hud4();
    if(C4.zone&&C4.zoneT>0&&!dlg){u.globalAlpha=Math.min(1,C4.zoneT);uiFont(7,true);u.textAlign='center';u.fillStyle='rgba(0,0,0,.6)';u.fillText(C4.zone,W/2+.5,46.5);u.fillStyle='#ff7ac8';u.fillText(C4.zone,W/2,46);u.textAlign='left';u.globalAlpha=1}
  }
};
action=function(){
  if(state==='end'&&window.C3&&C3.done&&!C4.started){continueCh4();return}
  return _action();
};

// ================= ЭКРАНЫ КОНЦА =================
const _re=renderEnd;
renderEnd=function(){
  if(C4.done){
    panel(0,0,W,H,1);u.textAlign='center';
    uiFont(15,true);u.fillStyle='#ff2a7a';u.fillText('ПРОДОЛЖЕНИЕ СЛЕДУЕТ',W/2+1.5,30+1.5);u.fillStyle='#ffd23a';u.fillText('ПРОДОЛЖЕНИЕ СЛЕДУЕТ',W/2,30);
    uiFont(6.4,true);u.fillStyle='#ff7ac8';u.fillText('Глава 4 пройдена · Алко Пати Лайф',W/2,42);
    const ws=['m','s','e','w','c'];ws.forEach((w,i)=>{const x=W/2-150+i*62,y=52+Math.sin(tm*2+i)*1.5;u.fillStyle=BG[w][0];u.fillRect(x,y,54,54);u.strokeStyle=BG[w][1];u.lineWidth=.8;u.strokeRect(x,y,54,54);
      const g=PCV[w].getContext('2d');PORTRAIT[w](g,false,(tm+i)%3.4>3.25);u.imageSmoothingEnabled=false;u.drawImage(PCV[w],x,y,54,54);uiFont(4.6,true);u.fillStyle=NCOL[w];u.fillText(NAME[w].replace(' «АЛКОПАТИМЕН»',''),x+27,y+62)});
    uiFont(5.2,false);u.fillStyle='#fff';u.fillText('Убито: '+Math.max(0,PS.kills-C4.kills0)+'   ·   Всего за игру: '+PS.kills,W/2,134);
    u.fillStyle='#3ef0b0';u.fillText('Анжела повержена. Невский свободен. Мыш накормлен.',W/2,144);
    uiFont(4.6,false);u.fillStyle='#ffb0d8';u.fillText('Районы оживают один за другим. Но Заячий остров ещё в руках заразы...',W/2,154);
    u.fillStyle='#9a92b0';u.fillText('Спасибо, что играли!   ·   '+(touch.on?'Коснись, чтобы сыграть заново':'R или клик — сыграть заново'),W/2,166);u.textAlign='left';return}
  _re();
  if(window.C3&&C3.done&&!C4.started){
    panel(0,131,W,49,1);u.textAlign='center';
    uiFont(5.2,false);u.fillStyle='#3ef0b0';u.fillText('Наш район спасён. Но в центре всё ещё зомби...',W/2,140);
    const k=.75+.25*Math.sin(tm*3);u.fillStyle=`rgba(255,79,163,${k})`;u.fillRect(W/2-90,146,180,14);u.fillStyle='#120a1c';uiFont(6.2,true);u.fillText('▶ ГЛАВА 4: АЛКО ПАТИ ЛАЙФ',W/2,155.5);
    uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText(touch.on?'Коснись, чтобы продолжить':'E или клик — продолжить   ·   R — начать игру заново',W/2,170);u.textAlign='left'}
};

// ================= МЕНЮ ГЛАВЫ 4 =================
const MENU4=[['Глава 4 с начала (звонок Егора)','call4'],['Двор: встречаем Егора','yard4'],['Квартира бати','flatb'],['Крыша: зомби-голуби','roof'],['Корм для Мыша (кат-сцена)','feed4'],['Невский: за Мыша','nevsky'],['Клуб «Бардак»: стриптизёрша Анжела','club'],['Финал дома','home4']];
const CH4_BTN={x:W-74,y:H-66,w:70,h:12};
function kit4(n){
  if(['nevsky','club'].includes(n))kitMysh();else kitMikrob();
  Object.assign(PS,{food:true,rideGain:0,mode:'spread'});
  C1.done=true;if(window.C2)C2.done=true;if(window.C3){C3.done=true;C3.on=false;C3.buff=false}C4.started=true;C4.done=false;C4.kills0=PS.kills;
}
function menuStart4(n){
  C4.menu=null;C1.menu=null;if(window.C2)C2.menu=null;if(window.C3)C3.menu=null;state='play';sfx('click');kit4(n);
  S.bat=S.pistol=false;S.skladLocked=false;S.alarm=false;S.key=true;mapDirty=true;S.fade=0;
  if(n==='call4'){startCh4();return}
  if(n==='feed4'){playC4(CUT_FEED,afterFeed,'feed');return}
  if(n==='home4'){playC4(CUT_FINAL,endCh4,'home');return}
  sec4(n);
}
C4.menuStart=menuStart4;C4.MENU=MENU4;
function continueCh4(){C4.menu=null;state='play';S.fade=0;sfx('click');startCh4()}
const _rt=renderTitle;
renderTitle=function(){
  _rt();if(C1.menu||(window.C2&&C2.menu)||(window.C3&&C3.menu))return;
  const b=CH4_BTN;u.fillStyle='rgba(255,79,200,'+(.75+.25*Math.sin(tm*3+3))+')';u.fillRect(b.x,b.y,b.w,b.h);u.fillStyle='#120a1c';uiFont(5.4,true);u.textAlign='center';u.fillText('ГЛАВА 4 ▸'+(touch.on?'':'  (4)'),b.x+b.w/2,b.y+8.2);u.textAlign='left';
  if(C4.menu){panel(0,0,W,H,.92);u.textAlign='center';uiFont(10,true);u.fillStyle='#ff7ac8';u.fillText('ГЛАВА 4 · АЛКО ПАТИ ЛАЙФ',W/2,20);uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText('Выбери, откуда начать (для проверки участков)',W/2,28);u.textAlign='left';
    MENU4.forEach((m,i)=>{const y=34+i*14,sel=C4.menu.sel===i;u.fillStyle=sel?'rgba(255,122,200,.9)':'rgba(255,255,255,.08)';u.fillRect(W/2-90,y,180,11);u.fillStyle=sel?'#120a1c':'#fff';uiFont(5.4,true);u.fillText((i+1)+'. '+m[0],W/2-85,y+7.8)});
    uiFont(4.4,false);u.fillStyle='#9a92b0';u.textAlign='center';u.fillText(touch.on?'Коснись участка. Коснись вне списка — назад':'W/S и E, или клик. Esc — назад',W/2,H-4);u.textAlign='left'}
};
function menuPick4(x,y){const i=Math.floor((y-34)/14);if(x>W/2-90&&x<W/2+90&&i>=0&&i<MENU4.length&&y-34-i*14<=11){menuStart4(MENU4[i][1]);return true}C4.menu=null;return true}
const toXY=e=>({x:(e.clientX-OX)/SC,y:(e.clientY-OY)/SC});
const inBtn=(p,b,pad)=>p.x>=b.x-pad&&p.x<=b.x+b.w+pad&&p.y>=b.y-pad&&p.y<=b.y+b.h+pad;
const otherMenu=()=>C1.menu||(window.C2&&C2.menu)||(window.C3&&C3.menu);
addEventListener('keydown',e=>{
  if(state==='title'&&!otherMenu()){
    if(C4.menu){const m=C4.menu;if(e.code==='KeyW'||e.code==='ArrowUp')m.sel=(m.sel+MENU4.length-1)%MENU4.length;else if(e.code==='KeyS'||e.code==='ArrowDown')m.sel=(m.sel+1)%MENU4.length;
      else if(['KeyE','Space','Enter'].includes(e.code)){if(!e.repeat&&m.sel>=0)menuStart4(MENU4[m.sel][1])}else if(e.code==='Escape')C4.menu=null;
      else if(/^Digit[1-8]$/.test(e.code)){const i=+e.code[5]-1;if(MENU4[i])menuStart4(MENU4[i][1])}
      e.preventDefault();e.stopImmediatePropagation();return}
    if(e.code==='Digit4'){C4.menu={sel:0};sfx('click');e.preventDefault();e.stopImmediatePropagation();return}
  }
  if(state==='end'&&window.C3&&C3.done&&!C4.started&&['KeyE','Space','Enter'].includes(e.code)&&!e.repeat){continueCh4();e.preventDefault();e.stopImmediatePropagation();return}
},true);
addEventListener('mousedown',e=>{
  const p=toXY(e);
  if(state==='title'&&!otherMenu()){
    if(C4.menu){menuPick4(p.x,p.y);e.stopImmediatePropagation();return}
    if(inBtn(p,CH4_BTN,0)){C4.menu={sel:0};sfx('click');e.stopImmediatePropagation();return}
  }
  if(state==='end'&&window.C3&&C3.done&&!C4.started){continueCh4();e.stopImmediatePropagation();return}
},true);
addEventListener('touchstart',e=>{
  for(const t of e.changedTouches){const p=toXY(t);
    if(state==='title'&&!otherMenu()){
      if(C4.menu){menuPick4(p.x,p.y);e.preventDefault();e.stopImmediatePropagation();return}
      if(inBtn(p,CH4_BTN,3)){touch.on=true;mouse.on=false;C4.menu={sel:-1};e.preventDefault();e.stopImmediatePropagation();return}}
    if(state==='end'&&window.C3&&C3.done&&!C4.started){touch.on=true;continueCh4();e.preventDefault();e.stopImmediatePropagation();return}
  }
},{capture:true,passive:false});
// быстрый старт по ссылке: #ch4 #yard4 #flatb #roof #feed4 #nevsky #club #home4
const hs=location.hash.slice(1);if(hs){const m={ch4:'call4'}[hs]||hs;if(MENU4.some(x=>x[1]===m))setTimeout(()=>{menuOn=true;menuStart4(m)},90)}
C4.CUTS={CUT_PARTY,CUT_FEED,CUT_GO,CUT_WIN,CUT_FINAL};
C4.get=()=>({L:E.L,Q,PS,scene,state,cut,dlg});
if(window.HDS){catSide=HDS.wrap(catSide,[34,44],1.9);buffSide=HDS.wrap(buffSide,[34,62],1.8);sideShmak=HDS.shmak(sideShmak);sideEgor=HDS.wrap(sideEgor)}
})();
