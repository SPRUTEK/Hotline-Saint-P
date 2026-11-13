// slides.js — слайды «загрузки» (03.11): 7 артов по главам, сменяются каждые ~3 с.
// Фон рисуется пикселями на холсте 640×360 (MART), герои — портреты из диалогов (PORTRAIT/PCV) 1:1 с неоновым контуром.
(function(){
'use strict';
const M=window.MART;if(!M)return;
const {AW,AH,R,P,E,mix,hash,spr,put,TAU}=M;const G=()=>M.g;
// ---------- портрет с неоновым контуром ----------
const tint=document.createElement('canvas');tint.width=tint.height=192;const tg=tint.getContext('2d');
function bust(who,x,y,rim,flip,size,blinkT){if(typeof PORTRAIT==='undefined'||!PORTRAIT[who]||!PCV[who])return;const g=M.g,sz=size||192;
  const pg=PCV[who].getContext('2d');const bl=blinkT!=null&&(blinkT%3.7)>3.55;PORTRAIT[who](pg,false,bl);try{if(typeof Q3P!=='undefined'&&Q3P[who]&&PORTRAIT[who]===Q3B[who])Q3P[who](pg,bl,false)}catch(e){}
  const src=PCV[who];g.save();g.imageSmoothingEnabled=false;if(flip){g.translate(x+sz,y);g.scale(-1,1);x=0;y=0}
  if(rim){tg.globalCompositeOperation='source-over';tg.clearRect(0,0,192,192);tg.drawImage(src,0,0,192,192);tg.globalCompositeOperation='source-in';tg.fillStyle=rim;tg.fillRect(0,0,192,192);tg.globalCompositeOperation='source-over';
    const k=sz/192;for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[-1,-1],[1,-1]])g.drawImage(tint,x+dx*k*1.5,y+dy*k*1.5,sz,sz)}
  g.drawImage(src,x,y,sz,sz);g.restore()}
// затемнение низа (портреты обрезаны по плечи)
function fadeBottom(y0,y1,col){const g=M.g,gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,col||'rgba(6,3,14,.95)');g.fillStyle=gr;g.fillRect(0,y0,AW,y1-y0)}
function neonSign(txt,x,y,sc,col,t,flick){const on=!flick||Math.sin(t*13)>-.85||Math.sin(t*2.1)<.8;const g=M.g;g.save();if(on){g.shadowColor=col;g.shadowBlur=8}
  M.pixText(txt,x,y,sc,sc,[on?'#ffffff':mix(col,'#000000',.6)].concat(Array(6).fill(on?col:mix(col,'#000000',.6))),{});g.restore()}
function lights(y,x0,x1,t,cols){for(let x=x0;x<x1;x+=10){const c=cols[((x/10|0)+Math.floor(t*3))%cols.length];R(x,y+Math.sin(x*.08)*3,3,3,c);P(x+1,y+Math.sin(x*.08)*3+1,'#ffffff')}
  const g=M.g;g.strokeStyle='#1a1424';g.lineWidth=1;g.beginPath();for(let x=x0;x<x1;x+=2)g.lineTo(x,y+Math.sin(x*.08)*3);g.stroke()}
function vign(){const g=M.g,gr=g.createRadialGradient(AW/2,AH/2,AW*.3,AW/2,AH/2,AW*.7);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(4,2,10,.55)');g.fillStyle=gr;g.fillRect(0,0,AW,AH)}
// ---------- мелкие спрайты ----------
const catRun=f=>a=>{const l=f?3:-3;a.e(20,12,12,6,'#121218');a.e(33,8,6,5,'#121218');a.q([29,4,31,-2,33,3],'#121218');a.q([34,3,37,-2,38,4],'#121218');
  a.d(35,7,2,1,'#c6ef4a');a.d(37,7,1,1,'#c6ef4a');a.r(10+l,15,3,8,'#121218');a.r(15-l,15,3,8,'#121218');a.r(24+l,15,3,8,'#121218');a.r(28-l,15,3,8,'#121218');
  a.q([8,10,0,4+(f?2:-2),-2,6+(f?2:-2),7,13],'#121218');a.d(14,9,10,1,'#2a2a3a')};
const mouseS=f=>a=>{a.e(6,5,6,4,'#8a8a96');a.e(11,4,3,3,'#9a9aa6');a.d(12,3,1,1,'#141418');a.d(9,1,2,2,'#e8a0b0');a.r(2+(f?1:0),8,2,2,'#8a8a96');a.r(8-(f?1:0),8,2,2,'#8a8a96');a.ln(0,5,-6,f?3:7,'#c8909a')};
const monitor=(c)=>a=>{a.r(0,0,46,30,'#1a1a22');a.r(2,2,42,24,c);a.r(19,30,8,6,'#2a2a30');a.r(12,36,22,3,'#2a2a30')};
const deskS=a=>{a.r(0,0,150,8,'#5a3a24');a.d(0,0,150,1,'#8a5a34');a.r(6,8,6,40,'#3a2414');a.r(138,8,6,40,'#3a2414');a.r(40,10,40,24,'#4a2e1c');a.d(44,20,32,1,'#2a1a10')};
const plane=a=>{a.q([0,10,70,8,84,12,70,16,0,14],'#e8e8f0');a.q([30,10,46,10,40,-4,34,-4],'#c8c8d4');a.q([4,10,12,10,6,0,2,0],'#c8202a');a.r(60,9,10,4,'#2a4a8a');
  a.r(20,16,4,8,'#5a5a66');a.r(50,16,4,8,'#5a5a66');a.r(10,23,50,4,'#d8d8e0');a.d(16,11,40,1,'#3a8ae8')};
const lounger=a=>{a.q([0,20,90,20,96,8,104,0,108,2,98,24,4,24],'#e8e0d0');for(let x=6;x<92;x+=8)a.d(x,20,4,4,'#3ab0d8');a.r(6,24,3,10,'#8a8a92');a.r(86,24,3,10,'#8a8a92')};
const bmw=a=>{a.q([0,22,8,12,30,6,70,6,90,14,112,16,116,26,0,28],'#1a2a5a');a.q([32,8,68,8,82,15,26,15],'#0a1020');a.d(48,8,1,7,'#1a2a5a');a.r(104,17,10,4,'#fff6c8');a.d(2,20,6,3,'#ff3040');
  a.e(22,28,8,8,'#141418');a.e(94,28,8,8,'#141418');a.e(22,28,3,3,'#8a8a96');a.e(94,28,3,3,'#8a8a96');a.d(106,22,6,2,'#c8c8d4');a.d(108,21,2,1,'#3a8ae8')};
const beer=a=>{a.r(0,0,9,16,'#e8c040');a.r(0,4,9,8,'#2a6a3a');a.d(2,6,5,3,'#fff');a.d(1,0,7,1,'#c8c8d0')};
const sandbag=a=>{for(let i=0;i<5;i++)a.e(10+i*18,16,10,6,'#8a7a52');for(let i=0;i<4;i++)a.e(19+i*18,6,10,6,'#9a8a5a')};
const dumbbell=a=>{a.r(0,0,6,14,'#2a2a30');a.r(6,5,24,4,'#b8b8c4');a.r(30,0,6,14,'#2a2a30');a.d(1,1,1,12,'#4a4a56');a.d(31,1,1,12,'#4a4a56')};
const pistolS=c=>a=>{a.r(0,0,22,6,c);a.r(14,6,6,10,'#2a1a14');a.d(0,0,22,1,'#ffffff')};
const target=a=>{a.e(14,14,14,14,'#f0e8d8');a.e(14,14,10,10,'#c8202a');a.e(14,14,6,6,'#f0e8d8');a.e(14,14,2.5,2.5,'#c8202a');a.r(13,28,2,30,'#5a4a3a')};
const zomb=a=>{a.r(4,12,12,16,'#4a5a3a');a.e(10,7,6,6,'#7aaa64');a.d(7,6,2,1,'#ff3030');a.d(11,6,2,1,'#ff3030');a.r(5,28,4,10,'#2a2a3a');a.r(11,28,4,10,'#2a2a3a');a.r(-4,14,8,3,'#7aaa64');a.r(16,14,8,3,'#7aaa64')};
// ================= слайды =================
const S=[];
// 1. Хата + подвал
S.push({ch:'ПРОЛОГ · ГЛАВА 3',title:'Вечер в Коломягах · Крысиные бега',draw(t){
  M.sky('#120a24','#1c1034','#24143e',300);R(0,0,AW,280,'#1e1430');
  for(let y=0;y<280;y+=12)for(let x=(y/12%2)*10;x<AW;x+=20){P(x,y+4,'#2a1e42');P(x+1,y+5,'#2a1e42')}
  // окно с ночными Коломягами
  R(236,30,168,118,'#3a2a20');R(242,36,156,106,'#0a0a24');M.use(M.g,()=>{});
  {const g=M.g;g.save();g.beginPath();g.rect(242,36,156,106);g.clip();M.stars(t,8,90,30);M.moon(370,60,10,t);M.skyline(142,31,'#140c26',14,48,.2,t);g.restore()}
  R(318,36,4,106,'#3a2a20');R(242,86,156,4,'#3a2a20');R(236,142,168,6,'#5a4030');
  lights(24,20,620,t,['#ff4fd8','#3ef0b0','#ffd23a','#7a5aff']);
  // столы, мониторы с играми
  put(spr('desk',deskS),26,212);put(spr('desk',deskS),464,212);
  const scr1=Math.sin(t*6)>0?'#3a1a6a':'#2a1a5a',scr2=Math.sin(t*5+1)>0?'#1a4a3a':'#1a3a3a';
  put(spr('mon1',monitor('#3a1a6a')),76,174);R(78,176,42,24,scr1);for(let i=0;i<5;i++)R(82+i*7,192-((t*30+i*9)%14),4,4,'#ff4fd8');R(96,180,6,6,'#ffd23a');
  put(spr('mon2',monitor('#1a4a3a')),512,174);R(514,176,42,24,scr2);for(let i=0;i<4;i++)R(518+((t*40+i*11)%38),186+i*3,3,2,'#3ef0b0');
  const gl=M.g.createRadialGradient(100,190,0,100,190,90);gl.addColorStop(0,'rgba(140,80,255,.25)');gl.addColorStop(1,'rgba(140,80,255,0)');M.g.fillStyle=gl;M.g.fillRect(0,100,220,180);
  const gl2=M.g.createRadialGradient(535,190,0,535,190,90);gl2.addColorStop(0,'rgba(62,240,176,.2)');gl2.addColorStop(1,'rgba(62,240,176,0)');M.g.fillStyle=gl2;M.g.fillRect(420,100,220,180);
  bust('m',30,48,'#ffd23a',false,192,t);bust('s',418,48,'#ff7ab8',true,192,t+1.3);
  // пол и разрез в подвал
  R(0,238,AW,8,'#4a3020');R(0,238,AW,1,'#7a5034');
  R(0,246,AW,114,'#140e10');for(let y=250;y<360;y+=7)for(let x=((y/7)%2)*10;x<AW;x+=20)R(x,y,18,5,'#21161a');
  R(0,268,AW,6,'#3a3a44');R(0,268,AW,1,'#6a6a76');for(let x=40;x<AW;x+=120){R(x,264,8,14,'#4a4a56')}
  for(let i=0;i<3;i++){const x=(t*70+i*200)%760-60;P(x,280+((x*3)%7),'#3a6ab8')}
  R(0,302,AW,58,'#0c0a0c');R(0,302,AW,1,'#2a2228');
  const run=(t*120)%(AW+220)-110,f=Math.floor(t*12)%2;put(spr('mouse'+f,mouseS(f)),run+60,292);put(spr('catR'+f,catRun(f)),run-20,280);
  M.pixText('ПОДВАЛ',12,252,2,2,['#5a4a6a'],{});vign()}});
// 2. Анис у офиса + Шмакодявка в «Золотом яблоке»
S.push({ch:'ГЛАВА 1 · ГЛАВА 2',title:'Погром в офисе · Малявочные делишки',draw(t){
  M.sky('#06041a','#1a0c3a','#5a1a5a',260);M.stars(t,4,120,60);
  // офисная башня слева
  R(10,30,250,260,'#141c34');for(let y=40;y<280;y+=10)for(let x=18;x<252;x+=12){const v=hash(x,y);R(x,y,8,6,v<.3?'#ffd27a':v<.5?'#7ae8ff':'#1e2a4a')}
  neonSign('ОФИС',60,12,3,'#3ef0b0',t,true);
  // витрина «Золотое яблоко»
  R(330,90,300,200,'#2a1a2a');R(342,120,276,150,'#3a2030');
  for(let s=0;s<3;s++){R(350,150+s*40,260,4,'#d8b878');for(let i=0;i<22;i++){const c=['#ff4fa3','#ffd23a','#e8e0f0','#c84aff','#ff8a6a','#3ef0b0'][(i+s)%6];R(354+i*12,138+s*40,6,12,c);R(355+i*12,136+s*40,4,2,'#ffd27a')}}
  const gl=M.g.createLinearGradient(0,120,0,270);gl.addColorStop(0,'rgba(255,220,160,.18)');gl.addColorStop(1,'rgba(255,220,160,.04)');M.g.fillStyle=gl;M.g.fillRect(342,120,276,150);
  neonSign('ЗОЛОТОЕ ЯБЛОКО',356,98,2,'#ffd23a',t,false);E(612,104,5,5,'#ffd23a');P(613,98,'#3a8a3a');
  R(0,290,AW,70,'#0e0a16');for(let x=0;x<AW;x+=40)R(x+((t*40)%40),322,20,2,'#3a3446');
  R(0,288,AW,3,'#2a2436');
  bust('a',40,98,'#3ef0b0',false,192,t);bust('s',398,98,'#ff7ab8',false,192,t+2);
  // помада в руке-иконке
  R(560,236,8,22,'#c8202a');R(560,230,8,6,'#e8c040');R(561,226,6,4,'#ff4fa3');
  fadeBottom(250,330);vign()}});
// 3. Италия: Олеся у бассейна, Валера на самолёте
S.push({ch:'ГЛАВА 5',title:'Итальянский вайб',draw(t){
  M.sky('#1a0a3a','#8a2a6a','#ff8a5a',230);M.stars(t,6,90,30);
  E(320,230,60,60,'#ffb050');E(320,230,46,46,'#ffd27a');R(0,230,AW,40,'#3a1a4a');
  for(let y=232;y<262;y+=3)R(320-50+Math.sin(t*2+y)*4,y,100-(y-232)*2,1,'rgba(255,200,120,.5)');
  // кипарисы и вилла
  for(const x of [40,70,560,600])for(let y=0;y<90;y++){const w=Math.max(1,Math.sin(y/90*Math.PI)*8);R(x-w,230-y,w*2,1,'#0e2a1a')}
  R(440,170,110,70,'#e8c8a0');R(440,160,110,10,'#c86a3a');for(let i=0;i<4;i++){R(450+i*24,184,12,18,'#ffd27a');R(450+i*24,184,12,1,'#fff0c0')}
  // бассейн
  R(0,262,AW,98,'#d8c8a8');for(let x=0;x<AW;x+=16)for(let y=262;y<360;y+=16)P(x,y,'#b8a888');
  R(150,290,380,60,'#18a8c8');for(let i=0;i<40;i++){const x=150+((i*37+t*20)%380),y=292+(i*13)%56;R(x,y,6,1,'#8af0ff')}R(150,290,380,2,'#e8f8ff');
  put(spr('loung',lounger),20,300);
  // самолёт Валеры летит
  const px=((t*60)%(AW+200))-120;put(spr('plane',plane),px,40+Math.sin(t*2)*4);R(px+62,48+Math.sin(t*2)*4,4,3,'#6ad8ff');
  bust('ol',10,128,'#ff5a8a',false,192,t);bust('val',430,96,'#6ad8ff',true,192,t+1);
  fadeBottom(300,360,'rgba(10,4,20,.6)');vign()}});
// 4. Перелесье: родители, киса Алиса, Столыпин с пивом, Владос на бэхе
S.push({ch:'ГЛАВА 6',title:'Перелесье',draw(t){
  M.sky('#040814','#0c1a30','#1a3a3a',240);M.stars(t,9,160,110);M.moon(560,50,16,t,'#f0f0d8');
  for(const [x,h] of [[20,110],[60,90],[600,120],[630,90]])M.spruce(x,250,h,t,null);for(const [x,h] of [[100,100],[520,96]])M.birch(x,250,h,t,null);
  // дом и грядки
  R(250,150,150,100,'#5a3a24');for(let y=154;y<250;y+=8)R(250,y,150,1,'#3a2414');M.g.fillStyle='#3a2a2a';M.g.beginPath();M.g.moveTo(240,152);M.g.lineTo(325,100);M.g.lineTo(410,152);M.g.fill();
  R(276,178,30,24,'#ffd27a');R(344,178,30,24,'#ffd27a');R(290,178,2,24,'#5a3a24');R(358,178,2,24,'#5a3a24');R(310,210,26,40,'#3a2414');
  lights(150,250,400,t,['#ffd23a','#ff8a5a']);
  R(0,250,AW,110,'#14240e');for(let i=0;i<5;i++){R(20+i*120,286,90,10,'#3a2414');for(let x=0;x<90;x+=8)R(24+i*120+x,280,4,6,'#3a7a2a')}
  for(let x=0;x<AW;x+=14){R(x,254,3,22,'#6a4a2a');}R(0,258,AW,2,'#6a4a2a');R(0,268,AW,2,'#6a4a2a');
  // дорога и бэха Владоса
  R(0,330,AW,30,'#1a1a1e');const cx=((t*90)%(AW+260))-140;put(spr('bmw',bmw),cx,300);
  const hl=M.g.createLinearGradient(cx+112,0,cx+200,0);hl.addColorStop(0,'rgba(255,246,200,.45)');hl.addColorStop(1,'rgba(255,246,200,0)');M.g.fillStyle=hl;M.g.beginPath();M.g.moveTo(cx+114,318);M.g.lineTo(cx+210,300);M.g.lineTo(cx+210,340);M.g.fill();
  bust('pa',-10,96,'#a8d870',false,192,t);bust('ma',118,110,'#ffb0c0',false,192,t+.8);bust('st',440,96,'#ffb040',true,192,t+2.2);
  put(spr('beer',beer),476,236);bust('al',250,232,'#e8a060',false,96,t+1.5);
  fadeBottom(318,360,'rgba(6,8,10,.5)');vign()}});
// 5. «Грибыч»: Бабура играет сет, Скала качается
S.push({ch:'ГЛАВА 7',title:'Диджей-сет в Грибыче',draw(t){
  R(0,0,AW,AH,'#0a0614');
  const g=M.g;for(let i=0;i<8;i++){const a=Math.sin(t*1.4+i)*0.7+Math.PI/2,c=['rgba(255,79,216,.18)','rgba(62,240,176,.18)','rgba(180,90,255,.18)'][i%3];g.fillStyle=c;g.beginPath();g.moveTo(320,20);g.lineTo(320+Math.cos(a-.03)*500,20+Math.sin(a-.03)*500);g.lineTo(320+Math.cos(a+.03)*500,20+Math.sin(a+.03)*500);g.fill()}
  // грибы-декор
  for(const [x,y,s] of [[40,200,1.4],[600,190,1.6],[110,250,1],[540,250,1.1]]){E(x,y,26*s,14*s,'#c8202a');for(let i=0;i<5;i++)E(x-18*s+i*9*s,y-4*s+(i%2)*4,3*s,2*s,'#f0e8d8');R(x-5*s,y+10*s,10*s,30*s,'#e8dcc8')}
  neonSign('ГРИБЫЧ',230,30,4,'#b45aff',t,true);
  bust('V',120,70,'#3ef0b0',false,192,t);bust('du',260,64,'#ff4fd8',false,192,t+1);
  // пульт
  R(110,220,320,60,'#1a1424');R(110,220,320,3,'#3a2a52');for(let i=0;i<14;i++){const h=4+Math.abs(Math.sin(t*8+i))*10;R(124+i*8,250-h,5,h,['#ff4fd8','#3ef0b0','#ffd23a'][i%3])}
  for(const x of [250,370]){E(x,240,16,16,'#2a2a34');E(x,240,12,12,'#141418');g.save();g.translate(x,240);g.rotate(t*4);R(-1,-12,2,8,'#ff4fd8');g.restore()}
  // Скала качается
  const up=Math.abs(Math.sin(t*2.4));bust('ska',440,110-up*8,'#ffd23a',true,192,t+.5);put(spr('dmb',dumbbell),458,212-up*30);put(spr('dmb',dumbbell),586,212-up*30);
  // толпа
  for(let i=0;i<26;i++){const x=i*26-6,y=300+Math.abs(Math.sin(t*6+i))*6;E(x,y,10,12,'#14101c');E(x,y-14,6,6,'#14101c')}
  R(0,320,AW,40,'#0a0812');vign()}});
// 6. Тир: Великий и Сатурналия
S.push({ch:'ГЛАВА 8',title:'Тактикульщина',draw(t){
  R(0,0,AW,AH,'#120e16');for(let y=0;y<200;y+=16)R(0,y,AW,1,'#1e1824');
  for(let i=0;i<6;i++){R(i*110+10,40,90,170,'#1a1620');R(i*110+10,40,90,2,'#3a3446');const sw=Math.sin(t*2+i)*4;put(spr('tg',target),i*110+40+sw,80)}
  for(let x=0;x<AW;x+=6)R(x,36,3,2,(x/6+Math.floor(t*4))%4?'#ffd23a':'#141414');
  neonSign('ТИР',290,8,4,'#ff8a3a',t,false);
  // стойка
  R(0,220,AW,20,'#3a3446');R(0,220,AW,2,'#6a6276');
  bust('vel',40,88,'#ff8a3a',false,192,t);bust('sat',400,88,'#ff5a6a',true,192,t+.9);
  // оружие и вспышки
  if(window.ICONS&&ICONS.PIX){const pk=ICONS.PIX.deagle,bk=ICONS.PIX.beretta;if(pk)M.g.drawImage(pk.cv,200,224);if(bk){M.g.drawImage(bk.cv,430,228);M.g.drawImage(bk.cv,470,236)}}
  if(Math.sin(t*9)>.6){E(196,230,8,5,'#ffd23a');E(196,230,4,3,'#fff')}if(Math.sin(t*11+1)>.6){E(426,234,7,4,'#ffd23a');E(466,242,7,4,'#ffd23a')}
  for(let i=0;i<4;i++){const k=(t*2+i/4)%1;R(160+i*90,260+k*60,3,5,'#e8c040')}
  R(0,240,AW,120,'#0e0a12');fadeBottom(280,360);vign()}});
// 7. Наш двор: Ханжа укрепляет, Алкопатимен на балконе, панорама Питера
S.push({ch:'ГЛАВА 9 · ГЛАВА 10',title:'Мой дом — моя крепость · Северная столица',draw(t){
  M.sky('#06031a','#240a40','#8a1a5a',230);M.stars(t,13,140,80);
  M.skyline(232,41,'#1a1030',24,60,.12,t);M.lakhta(600,232,40,t);M.petro(170,232,t);
  // хрущёвка с балконом
  R(300,60,330,250,'#3a3448');for(let y=76;y<300;y+=36)for(let x=316;x<620;x+=40){const v=hash(x,y);R(x,y,20,22,v<.4?'#ffd27a':'#1a1626');R(x+9,y,2,22,'#3a3448')}
  R(344,148,120,40,'#4a4458');R(344,148,120,3,'#6a6478');for(let x=348;x<464;x+=6)R(x,152,2,34,'#2a2438');
  lights(150,344,464,t,['#ff5aa8','#3ef0b0','#ffd23a']);
  bust('e',354,52,'#ff5aa8',false,96,t);bust('w',420,96,'#c8f0ff',false,48,t);
  // двор, мешки, бочка с огнём
  R(0,290,AW,70,'#141018');put(spr('sb',sandbag),180,282);put(spr('sb',sandbag),270,286);
  R(560,280,26,34,'#4a3a2a');for(let i=0;i<6;i++){const k=(t*3+i/6)%1;E(573+Math.sin(i+t*5)*4,278-k*24,5*(1-k)+1,6*(1-k)+1,k<.3?'#fff0a0':k<.6?'#ff8a3a':'#c8202a')}
  for(let i=0;i<3;i++){const x=((t*14+i*90)%300)+330;put(spr('zz',zomb),x,300)}
  bust('H',0,110,'#a8d870',false,192,t);
  // сигнальная ракета
  const k=(t*.5)%1;R(140+k*40,250-k*200,2,4,'#ff3040');if(k>.85)E(180,80,10*(k-.85)*7,10*(k-.85)*7,'rgba(255,60,80,.3)');
  fadeBottom(320,360);vign()}});
window.SLIDES=S;
})();
