// =====================================================================
//  ГЛАВА 8 — «Екатеринбург». Звонит Великий: зомби дошли до Екб.
//  Валера везёт Микроба и Шмакодявку на истребителе с полосы Ханжи.
//  Подлёт к Кольцово (Шмакодявка за турелью, сбиваем летающих зомби) →
//  встреча с Великим и Сатурналией → чёрное Поло RS по ночному городу →
//  расклейка рекламы на трёх остановках (Плотинка, Ельцин-центр, Вайнера) →
//  арена «Пески» (зомби-террористы, две бомбы) → командир Барханыч →
//  Екб свободен, друзья покупают соседнюю квартиру. Награда — РПГ-7.
//  Вся глава — за Шмакодявку. Подключается после level7.js. Наружу: window.C8.
// =====================================================================
(function(){
'use strict';
if(!window.K56||!window.HQ){console.warn('level8: нет kit56/hq');return}
const K=K56,X=C1.X,E=C1.engine,PS=C1.PS,TAU=Math.PI*2,D2=K.D2,angDiff=K.angDiff,Q=K.Q,B=K.B,sfx=X.sfx;
const C8={on:false,done:false,started:false,sec:null,menu:null,kills0:0,flags:{},satK:0,velK:0,airK:0};window.C8=C8;
const hold=K.hold;
const r4=n=>(Math.random()*n)|0;

// ================= МУЗЫКА =================
K.addMusic([['smajte','smajte.mp3'],['trimtryam','trimtryam.mp3'],['rampage','rampage.mp3'],['smoke','smoke.mp3']]);
const MZ8={call:'flat',runway:'techno_show',air:'neuro',meet:'smoke',drive:'rap808',glue:'histplace',gate:'smoke',sands:'rampage',boss:'rampage',end:'smoke',hq:'flat'};
const mz8=k=>K.music(MZ8[k]);

// ================= ПОРТРЕТЫ 64×64 =================
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
  else for(const ex of [21,36]){P(g,ex,ey-1,7,4,o.white||'#f4f0ea');P(g,ex+2,ey-1,3.5,4,o.eye||'#5a3a22');P(g,ex+2.75,ey-.25,2,2.5,'#140c08');P(g,ex+2.5,ey-.5,.75,.75,'#ffffff');P(g,ex,ey-1.5,7,.5,shade(SK,.5))}
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
const strands=(g,n,x0,x1,y0,y1,c,seed)=>{for(let i=0;i<n;i++){const x=x0+Math.floor(hash(i,seed)*(x1-x0)),y=y0+Math.floor(hash(seed,i)*(y1-y0));P(g,x,y,1,2,c)}};
// Великий: взъерошенные тёмно-каштановые волосы, очки-авиаторы в тонкой оправе, щетина, серая куртка-худи, фиолетовый свитер
function pVel(g,open,blink){const HR='#3a2a20',HL='#5a4232',HD='#241812';face(g,{sk:'#eec6aa',eye:'#5a3a22',brow:'#3a2618',lip:'#c08078',hw:13,hh:16.5,
  body(g){ell(g,32,77,32,22,'#55565c');ell(g,32,80,26,14,'#606168');P(g,17,50,8,14,'#1a1a1e');P(g,39,50,8,14,'#1a1a1e');P(g,21,55,2,2,'#b8b8c0');P(g,41,55,2,2,'#b8b8c0');
    ell(g,32,55,9,5,'#5a3a7a');P(g,26,51,12,3,'#4a2e66');P(g,45,58,1,6,'#2a2a2e')},
  beard(g){strands(g,40,22,42,38,50,'#8a6448',5);P(g,26,39,12,2,'#7a5a40');strands(g,14,26,38,44,50,'#6a4a34',8);P(g,30,48,4,2,'#8a6448')},
  hair(g){ell(g,32,15,17,10,HR,(x,y)=>y<=22);for(let i=0;i<10;i++)ell(g,17+i*3.4,8+((i*3)%4),3.2,3.6,i%2?HL:HD);
    P(g,15,15,4,10,HR);P(g,45,15,4,10,HR);P(g,22,4,3,4,HR);P(g,34,3,4,4,HL);P(g,41,6,3,3,HR);strands(g,30,16,48,4,22,HL,3);strands(g,16,18,46,8,20,HD,9);P(g,27,18,10,3,HR)},
  glasses(g){g.strokeStyle='#1a1a1a';g.lineWidth=.8;for(const cx of [24.5,39.5]){g.fillStyle='rgba(210,220,230,.18)';g.beginPath();g.moveTo(cx-6,27);g.lineTo(cx+6,27);g.quadraticCurveTo(cx+6.5,35,cx,35.5);g.quadraticCurveTo(cx-6.5,35,cx-6,27);g.fill();g.stroke()}
    P(g,30,27,4,.8,'#1a1a1a');P(g,13,28,5,.8,'#1a1a1a');P(g,46,28,5,.8,'#1a1a1a');P(g,19,28,2,1,'rgba(255,255,255,.5)');P(g,34,28,2,1,'rgba(255,255,255,.5)')}},open,blink)}
// Сатурналия: длинные каштановые волосы с пробором, карие глаза, стрелки, блестящие губы, чёрный свитшот
function pSat(g,open,blink){const HR='#6a4430',HL='#8a5a3e',HD='#4a2e20';face(g,{sk:'#f4d2bc',eye:'#5a3a20',brow:'#4a2e20',lip:'#e0707e',hw:12.5,hh:16,
  back(g){ell(g,32,36,20,27,HR);P(g,11,30,9,34,HR);P(g,44,30,9,34,HR);strands(g,40,12,52,30,64,HD,4);strands(g,30,12,52,26,62,HL,6)},
  body(g){ell(g,32,77,30,20,'#1e1e24');ell(g,32,80,22,12,'#26262c');ell(g,32,53,8,3.5,'#f0f0f0');P(g,27,49,10,4,'#f4d2bc');P(g,11,52,9,14,HR);P(g,44,52,9,14,HR)},
  hair(g){ell(g,32,16,15,9,HR,(x,y)=>y<=24);P(g,31,7,1.5,7,'#d8a890');P(g,17,16,5,28,HR);P(g,42,16,5,28,HR);P(g,20,14,10,6,HR);P(g,33,14,10,6,HR);
    strands(g,24,16,48,10,40,HL,2);strands(g,14,16,48,12,40,HD,7);P(g,18,40,4,6,HR);P(g,42,40,4,6,HR)},
  extra(g,open,blink){if(!blink){P(g,19,28,2,1,'#1a1010');P(g,43,28,2,1,'#1a1010')}P(g,30,41,3,1,'#ffc4cc');P(g,22,35,4,1,'#f0b0a8');P(g,38,35,4,1,'#f0b0a8')}},open,blink)}
// Катя-охотница (давняя подруга Шмакодявки), по фото 04.11: медное каре до плеч с чёлкой-шторкой на пробор,
// карие глаза со стрелками, золотые серьги-капли, чёрный топ, сверху охотничья куртка-хаки
function pKat(g,open,blink){const HR='#9a4a24',HL='#c06a3a',HD='#6a2e14';face(g,{sk:'#f2cdb4',eye:'#4a2a18',brow:'#7a3e20',lip:'#d07a72',hw:12.5,hh:16,
  back(g){ell(g,32,34,19,22,HR);P(g,12,30,9,22,HR);P(g,43,30,9,22,HR);for(const x of [14,18,46,50])P(g,x,32,1,18,HD);P(g,13,48,8,4,HD);P(g,43,48,8,4,HD)},
  body(g){ell(g,32,78,31,21,'#4e5a34');ell(g,32,81,23,13,'#5a6840');P(g,22,54,20,12,'#141216');P(g,25,52,14,3,'#f2cdb4');P(g,24,55,1,8,'#141216');P(g,39,55,1,8,'#141216');
    P(g,14,58,8,12,'#3e4828');P(g,42,58,8,12,'#3e4828');P(g,21,57,2,10,'#6a7a48');P(g,41,57,2,10,'#6a7a48')},
  hair(g){ell(g,32,15,16,9,HR,(x,y)=>y<=23);P(g,16,16,6,24,HR);P(g,42,16,6,24,HR);
    P(g,19,15,12,6,HR);P(g,20,20,6,5,HR);P(g,17,22,4,9,HL);P(g,35,14,9,5,HR);P(g,40,18,5,9,HR);P(g,43,24,3,8,HL);P(g,30,8,2,8,HD);
    for(const x of [19,23,40,44])P(g,x,14,1,16,HL);P(g,26,10,5,1,HL);P(g,34,10,5,1,HL)},
  extra(g,open,blink){if(!blink){P(g,19,28,3,1,'#1a1010');P(g,43,28,3,1,'#1a1010');P(g,20,29,2,1,'#1a1010');P(g,42,29,2,1,'#1a1010')}
    P(g,22,35,4,1,'#eaa898');P(g,38,35,4,1,'#eaa898');P(g,30,41,3,1,'#f4b0a8');
    P(g,13,37,3,4,'#e8b830');P(g,13,37,1,2,'#fff0a0');P(g,48,37,3,4,'#e8b830');P(g,49,37,1,2,'#fff0a0')}},open,blink)}
const NEWP={vel:pVel,sat:pSat,kt:pKat};
Object.assign(PORTRAIT,NEWP);for(const k in NEWP)PCV[k]=mk(64);
Object.assign(NAME,{vel:'ВЕЛИКИЙ',sat:'САТУРНАЛИЯ',kt:'КАТЯ'});
Object.assign(NCOL,{vel:'#b89aff',sat:'#ffb48a',kt:'#e08a5a'});
Object.assign(BG,{vel:['#141220','#8a7ab8'],sat:['#201410','#c8805a'],kt:['#1c120e','#c06a3a']});

// ================= ШМАКОДЯВКА СВЕРХУ (всё оружие) =================
function poseOf(w){if(!w)return null;if(['pistol','bat','shotgun','rail','flamer','axe','nail','ext','rpg','uzi'].includes(w))return w;const d=C1.WD&&C1.WD[w];return d&&d.pose||'shotgun'}
function drawShmak8(g,w,carry){
  g.clearRect(0,0,24,24);
  const D='#f59cc8',DD='#cf74a2',DL='#ffc4df',SK='#f2cab2',SKD='#d8a890',HR='#2c1a1f',HL='#4c2e36';const p=poseOf(w);
  if(p==='pistol'){P(g,11,15,8,2,SK);P(g,18,14,2,3,SKD);P(g,19,13,6,2,'#151515');P(g,20,12,2,1,'#151515');P(g,11,7,6,2,SK);P(g,16,8,2,3,SKD)}
  else if(p==='uzi'){P(g,11,15,8,2,SK);P(g,18,14,2,3,SKD);P(g,19,14,5,3,'#ff5ac8');P(g,11,6,8,2,SK);P(g,18,6,2,3,SKD);P(g,19,6,5,3,'#ff5ac8')}
  else if(p==='bat'){P(g,10,16,7,2,SK);P(g,16,16,2,2,SKD);P(g,2,17,15,2,'#b07434');P(g,2,17,4,2,'#c88a44');P(g,14,17,3,2,'#2a2a2a');P(g,10,6,6,2,SK)}
  else if(p==='rail'){P(g,11,14,8,2,SK);P(g,17,14,2,2,SKD);P(g,10,8,10,2,SK);P(g,19,8,2,2,SKD);P(g,8,10,16,4,'#3a4a5a');P(g,10,11,14,1,'#8af0ff');P(g,23,10,2,4,'#c8f8ff')}
  else if(p==='flamer'){P(g,11,14,8,2,SK);P(g,17,14,2,2,SKD);P(g,10,8,10,2,SK);P(g,19,8,2,2,SKD);P(g,9,10,10,4,'#8a6a3a');P(g,18,11,6,2,'#4a4a52');P(g,23,10,2,4,'#2a2a2a');P(g,4,9,5,6,'#cfe8d0')}
  else if(p==='rpg'){P(g,11,14,8,2,SK);P(g,17,14,2,2,SKD);P(g,10,8,10,2,SK);P(g,19,8,2,2,SKD);P(g,3,10,20,3,'#4a5a3a');P(g,3,10,20,1,'#6a7a52');P(g,20,9,4,5,'#3a3a32');P(g,12,13,2,3,'#2a2a2a')}
  else if(p==='axe'||p==='nail'||p==='ext'){P(g,11,15,8,2,SK);P(g,18,14,2,2,SKD);P(g,11,7,8,2,SK);P(g,15,8,5,9,'#8a8a92')}
  else if(p){P(g,11,14,8,2,SK);P(g,17,14,2,2,SKD);P(g,10,8,10,2,SK);P(g,19,8,2,2,SKD);P(g,6,11,7,3,'#6a4424');P(g,12,11,12,2,'#26262a');P(g,14,13,7,1,'#3a3a40')}
  else if(carry){P(g,10,4,8,2,SK);P(g,10,18,8,2,SK)}
  else{P(g,10,3,6,2,SK);P(g,15,3,1,2,SKD);P(g,10,19,6,2,SK);P(g,15,19,1,2,SKD)}
  ell(g,11,12,4.2,7.2,D);ell(g,9.6,12,2.6,6.4,DD);P(g,14,7,1,10,DL);P(g,11,5,3,1,SK);P(g,11,18,3,1,SK);
  ell(g,7.5,12,4.4,3.2,HR);P(g,2,11,4,3,HR);P(g,5,12,4,1,HL);ell(g,12,12,4,4,HR);P(g,10,11,4,1,HL);
  P(g,15,10,2,5,SK);P(g,15,9,1,1,HR);P(g,15,15,1,1,HR);
  if(typeof hdShmTop==='function')hdShmTop(g,0);outline(g,'#0b0910');
}
const HERO={draw:drawShmak8,leg:'#f2cab2',shoe:'#0e0e12'};

// Сатурналия сверху: длинные каштановые волосы, чёрный свитшот, две беретты
function topSat(g,sw){g.clearRect(0,0,24,24);const SK='#f4d2bc',C='#1e1e24',HR='#6a4430',HL='#8a5a3e';
  P(g,11,15,8,3,C);P(g,18,15,2,2,SK);P(g,19,14,6,2,'#1a1a1c');P(g,21,14,2,1,'#9a9aa2');P(g,11,6,8,3,C);P(g,18,7,2,2,SK);P(g,19,7,6,2,'#1a1a1c');P(g,21,8,2,1,'#9a9aa2');
  if(sw>0){P(g,25,14,2,2,'#fff6c0');P(g,25,7,2,2,'#fff6c0')}
  ell(g,11,12,4.4,7,C);ell(g,9.6,12,2.6,6.2,'#141418');
  ell(g,6,12,5.4,3.4,HR);P(g,0,10,6,5,HR);P(g,1,11,4,1,HL);P(g,0,13,3,1,HL);ell(g,12,12,4,4,HR);P(g,10,11,5,1,HL);P(g,12,10,4,.8,'#d8a890');
  P(g,15,10,2,5,SK);outline(g,'#0b0910')}
// Великий сверху: серая куртка, взъерошенные волосы, револьвер или кисть с клеем
function topVel(g,w,sw){g.clearRect(0,0,24,24);const SK='#eec6aa',C='#55565c',HR='#3a2a20';
  if(w==='mag'){P(g,11,15,8,3,C);P(g,18,14,2,3,SK);P(g,19,13,8,2,'#c8ccd4');P(g,19,13,3,3,'#8a8e96');P(g,11,7,6,3,C);P(g,16,8,2,3,SK);if(sw>0)P(g,26,12,3,4,'#fff6c0')}
  else if(w==='glue'){const k=Math.sin(tm*8)*2;P(g,11,15,8,3,C);P(g,18,15+k*.5,2,2,SK);P(g,19,14+k*.5,4,3,'#e8e0c8');P(g,11,6,8,3,C);P(g,18,6,2,2,SK);P(g,19,4,3,5,'#c8b080')}
  else{P(g,10,3,6,3,C);P(g,15,3,2,3,SK);P(g,10,18,6,3,C);P(g,15,18,2,3,SK)}
  ell(g,11,12,4.6,7.4,C);ell(g,9.6,12,2.8,6.6,'#46474c');P(g,13,8,2,8,'#1a1a1e');P(g,13,10,2,4,'#5a3a7a');
  ell(g,12,12,4.2,4.2,HR);for(let i=0;i<5;i++)P(g,8+i*2,7+((i*3)%3),2,2,i%2?'#4a3428':'#2e2018');P(g,15,10,2,5,SK);P(g,16,10,1,2,'#1a1a1a');P(g,16,13,1,2,'#1a1a1a');outline(g,'#0b0910')}
const cvSat=mk(24),cvVel=mk(24),cvMik=mk(24),legSat=mk(24),legVel=mk(24),legMik=mk(24);
for(const c of [cvSat,cvVel,cvMik,legSat,legVel,legMik])c.getContext('2d',{willReadFrequently:true});

// ================= ЗОМБИ ЕКАТЕРИНБУРГА И «ПЕСКОВ» =================
// 800..803 горожане и гопники в спортивках, 810..811 бегуны в худи, 820 громила-охранник,
// 830..833 зомби-террористы (балаклава, песочный камуфляж), 840..841 автоматчики, 850 Барханыч (босс)
function zEkb(v,kind){
  const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});const SK=['#8aa47a','#7e9a70','#94ac84','#86a078'][v%4];
  if(kind==='city'){const C=['#2a2a3a','#3a5a8a','#1a1a1e','#6a3a5a'][v%4],HR=['#2a1a10','#141414','#8a6a3a','#3a2a1a'][v%4];
    P(g,11,6,8,3,C);P(g,18,6,3,3,SK);P(g,11,15,8,3,C);P(g,18,15,3,3,SK);ell(g,11,12,4.6,7.4,C);ell(g,9.8,12,2.6,6.4,shade(C,.75));
    if(v%2===0){P(g,9,5,1,14,'#e8e8e8');P(g,12,5,1,14,'#e8e8e8')} // спортивка с полосками
    ell(g,12,12,4,4,HR);if(v===1){ell(g,12,12,4,4,'#1a1a1e');P(g,10,9,4,1,'#e8e8e8')} // кепка
    P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
  if(kind==='run'){const C=v?'#5a2a2a':'#2a4a3a';P(g,11,6,8,3,C);P(g,18,5,3,3,SK);P(g,11,15,8,3,C);P(g,18,16,3,3,SK);ell(g,11,12,4.4,7,C);ell(g,11,12,4.2,4.2,shade(C,.7));P(g,8,9,3,6,shade(C,.6));
    P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
  if(kind==='terr'){const C=['#b8a070','#a89060','#c8b080','#9a8458'][v%4];
    P(g,11,6,8,3,C);P(g,18,6,3,3,'#1a1a1e');P(g,11,15,8,3,C);P(g,18,15,3,3,'#1a1a1e');ell(g,11,12,4.8,7.6,C);for(let i=0;i<7;i++)P(g,7+((i*5)%8),6+((i*7)%12),2,2,i%2?'#6a5a3a':'#8a7a4a');
    P(g,7,9,4,6,'#4a4a3a');ell(g,12,12,4,4,'#18181c');P(g,14,10,2,1,'#86a078');P(g,14,13,2,1,'#86a078');P(g,15,10,1,1,'#ff3030');P(g,15,13,1,1,'#ff3030')}
  if(kind==='gun'){const C=v?'#a89060':'#b8a070';P(g,11,15,9,3,C);P(g,19,15,3,3,'#1a1a1e');P(g,11,7,8,3,C);P(g,18,8,3,3,'#1a1a1e');P(g,16,11,9,2,'#2a2a2a');P(g,18,13,2,3,'#5a3a20');P(g,22,10,2,1,'#2a2a2a');
    ell(g,11,12,4.8,7.6,C);P(g,7,8,4,8,'#4a4a3a');P(g,8,9,2,2,'#c8a040');P(g,8,13,2,2,'#c8a040');ell(g,12,12,4,4,'#18181c');P(g,15,10,1,1,'#ff3030');P(g,15,13,1,1,'#ff3030')}
  outline(g,'#0b0910');return c;
}
function zGuard(){const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});const SK='#86a078';
  P(g,14,3,12,6,'#2a2a34');P(g,24,3,4,6,SK);P(g,14,23,12,6,'#2a2a34');P(g,24,23,4,6,SK);ell(g,14,16,8.5,12,'#2a2a34');ell(g,12,16,6,10,'#34343e');
  g.fillStyle='#ffd23a';g.font='bold 4px monospace';g.save();g.translate(12,22);g.rotate(-Math.PI/2);g.fillText('ОХРАНА',0,0);g.restore();
  ell(g,18,16,5,5,SK);P(g,21,13,1,1,'#ff2020');P(g,21,18,1,1,'#ff2020');outline(g,'#0b0910');return c}
function zBarkh(){const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});const SK='#86a078',C='#9a8458';
  ell(g,20,5,6,4,C);ell(g,20,27,6,4,C);P(g,24,2,4,5,SK);P(g,24,25,4,5,SK);
  P(g,4,12,26,5,'#4a5a3a');P(g,4,12,26,1,'#6a7a52');P(g,26,11,5,7,'#3a3a32');P(g,2,13,3,3,'#2a2a2a'); // РПГ на плече
  ell(g,14,16,9.5,12.5,C);for(let i=0;i<12;i++)P(g,7+((i*5)%13),6+((i*7)%20),3,2,i%2?'#6a5a3a':'#7a6a40');P(g,7,8,5,16,'#4a4a3a');for(let i=0;i<4;i++)P(g,8,9+i*4,3,2,'#5a6a3a');
  ell(g,19,16,5.5,5.5,'#18181c');P(g,19,11,3,10,'#c8b080');P(g,22,13,1,1,'#ff2020');P(g,22,18,1,1,'#ff2020');outline(g,'#0b0910');return c}
for(let v=0;v<4;v++){X.zCache['normal'+(800+v)]=zEkb(v,'city');X.zCache['normal'+(830+v)]=zEkb(v,'terr')}
for(let v=0;v<2;v++){X.zCache['fast'+(810+v)]=zEkb(v,'run');X.zCache['normal'+(840+v)]=zEkb(v,'gun');X.zCache['fast'+(812+v)]=zEkb(v+2,'terr')}
X.zCache['brute820']=zGuard();X.zCache['boss850']=zBarkh();X.zCache['brute821']=zBarkh();
const Zc=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:800+r4(4),hp:55,max:55,sp:24},o||{}));
const Zf=(x,y,o)=>E.addZ('fast',x,y,Object.assign({v:810+r4(2),hp:36,max:36,sp:50},o||{}));
const Zg=(x,y,o)=>E.addZ('brute',x,y,Object.assign({v:820,hp:420,max:420},o||{}));
const Zt=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:830+r4(4),hp:70,max:70,sp:26},o||{}));
const Ztf=(x,y,o)=>E.addZ('fast',x,y,Object.assign({v:812+r4(2),hp:45,max:45,sp:52},o||{}));
const Zgun=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:840+r4(2),hp:65,max:65,sp:20,gun:{cd:rnd(1,2)}},o||{}));
const Zcr=(x,y,o)=>E.addZ('crawler',x,y,Object.assign({hp:34,max:34},o||{}));
C1.seenT=C1.seenT||{};

// ================= НАПАРНИКИ: Сатурналия (две беретты) и Великий (магнум) =================
const AK={sat:{cd:.24,dmg:15,rng:150,see:170,sp:74,kb:30},vel:{cd:1.3,dmg:110,rng:175,see:185,sp:68,kb:140}};
const AQ={sat:['Сатурналия: «Две беретты — двойная радость»','Сатурналия: «Минус один!»','Сатурналия: «Это вам не на Плотинке гулять»','Сатурналия: «Шмакодявка, слева!»','Сатурналия: «Екб — не для слабых»'],
  vel:['Великий: «Возражение отклонено»','Великий: «Ваше резюме нам не подходит»','Великий: «Вы уволены. По статье»','Великий: «Испытательный срок не пройден»','Великий: «Адвокат вам не поможет»']};
function addAl(kind,x,y,o){const A=Object.assign({kind,x,y,a:-Math.PI/2,ma:0,ph:0,mv:false,cd:rnd(.3,.8),fl:0,kills:0,quip:rnd(6,12),post:null,glue:false,lr:0},o||{});
  (Q.al||(Q.al=[])).push(A);E.L.npcs.push({draw(){drawAl(A)}});return A}
function tracer(x0,y0,x1,y1,c){(Q.tr||(Q.tr=[])).push({x0,y0,x1,y1,t:.08,c:c||'255,230,140'})}
function alFire(A,tg){const S=AK[A.kind],a=Math.atan2(tg.y-A.y,tg.x-A.x),was=tg.dead;A.cd=S.cd*rnd(.9,1.1);A.fl=.06;A.lr^=1;
  const off=A.kind==='sat'?(A.lr?3:-3):0,pa=a+Math.PI/2,mx=A.x+Math.cos(a)*11+Math.cos(pa)*off,my=A.y+Math.sin(a)*11+Math.sin(pa)*off;
  C1._src='ally';X.hurtZ(tg,tg.type==='boss'?S.dmg*.35:S.dmg,a,tg.type==='boss'?0:S.kb);C1._src=null;tracer(mx,my,tg.x,tg.y,A.kind==='vel'?'255,255,255':'255,220,120');
  sfx(A.kind==='vel'?'rifle':'shot',A.kind==='vel'?.5:.22);
  if(!was&&tg.dead){A.kills++;if(A.kind==='sat')C8.satK++;else C8.velK++;if(A.quip<=0){A.quip=rnd(12,20);note(AQ[A.kind][r4(AQ[A.kind].length)])}}}
function alTick(A,dt){
  const S=AK[A.kind];A.cd-=dt;A.quip-=dt;if(A.fl>0)A.fl-=dt;
  if(hold()){A.mv=false;return}
  const L=E.L,d=D2(A.x,A.y,pl.x,pl.y);
  if(!A.post&&d>230){for(let k=0;k<14;k++){const a=pl.a+Math.PI+rnd(-1.2,1.2),r=rnd(14,26),x=pl.x+Math.cos(a)*r,y=pl.y+Math.sin(a)*r;if(!K.solid(x,y,4)){A.x=x;A.y=y;break}}}
  let tg=null,bd=A.post?(A.glue?52:S.rng):S.see;
  if(L.armed)for(const z of L.zs){if(z.dead||z.st==='hidden'||z.st==='rise')continue;if(!A.post&&z.st==='idle'&&D2(z.x,z.y,pl.x,pl.y)>120)continue;const dz=D2(A.x,A.y,z.x,z.y);if(dz<bd&&E.los(A.x,A.y,z.x,z.y)){bd=dz;tg=z}}
  A.mv=false;let dir=null,sp=0;
  if(A.post){const p=A.post;if(D2(A.x,A.y,p.x,p.y)>4){dir=E.los(A.x,A.y,p.x,p.y)?Math.atan2(p.y-A.y,p.x-A.x):K.navDir(A);sp=S.sp}}
  else if(tg&&bd>S.rng){dir=Math.atan2(tg.y-A.y,tg.x-A.x);sp=S.sp}
  else if(!tg){const side=A.kind==='sat'?1:-1,pa=pl.a+Math.PI/2,bx=pl.x-Math.cos(pl.a)*16+Math.cos(pa)*side*12,by=pl.y-Math.sin(pl.a)*16+Math.sin(pa)*side*12;
    if(d>24&&D2(A.x,A.y,bx,by)>6){dir=(E.los(A.x,A.y,bx,by)&&!K.solid(bx,by,3.5))?Math.atan2(by-A.y,bx-A.x):K.navDir(A);sp=d>70?90:S.sp}}
  if(dir!=null){K.mv(A,Math.cos(dir)*sp*dt,Math.sin(dir)*sp*dt,3.5);A.ma=dir;A.mv=true;A.ph+=dt*12}
  const fa=tg?Math.atan2(tg.y-A.y,tg.x-A.x):A.post&&A.post.a!=null&&!A.mv?A.post.a:(A.mv?A.ma:A.a);A.a+=angDiff(fa,A.a)*Math.min(1,dt*10);
  if(tg&&bd<=S.rng&&A.cd<=0&&Math.abs(angDiff(fa,A.a))<.35)alFire(A,tg);
  if(!A.post){const dx=A.x-pl.x,dy=A.y-pl.y,dd=Math.hypot(dx,dy);if(dd<10&&dd>.01)K.mv(A,dx/dd*(10-dd),dy/dd*(10-dd),3.5)}
  for(const O of Q.al){if(O===A)continue;const ex=A.x-O.x,ey=A.y-O.y,ed=Math.hypot(ex,ey);if(ed<9&&ed>.01)K.mv(A,ex/ed*(9-ed)/2,ey/ed*(9-ed)/2,3.5)}
}
function drawAl(A){
  if(A.hidden)return;shadowBlob(A.x,A.y,6);
  if(A.kind==='sat'){legs(legSat.getContext('2d'),A.ph,A.mv,'#1a1a22','#0e0e12');spr(legSat,A.x,A.y,A.mv?A.ma:A.a);topSat(cvSat.getContext('2d'),A.fl);spr(cvSat,A.x,A.y,A.a)}
  else{legs(legVel.getContext('2d'),A.ph,A.mv,'#1e2030','#141418');spr(legVel,A.x,A.y,A.mv?A.ma:A.a);topVel(cvVel.getContext('2d'),A.glue&&A.cd<AK.vel.cd-.4?'glue':'mag',A.fl);spr(cvVel,A.x,A.y,A.a)}
}
// Микроб у остановки: клеит
function drawMikGlue(o){shadowBlob(o.x,o.y,6);legs(legMik.getContext('2d'),0,false,'#1c1c22','#9a9ca2');spr(legMik,o.x,o.y,o.a);
  const g=cvMik.getContext('2d');drawMikrob(g,null);const k=Math.sin(tm*7)*1.5;g.fillStyle='#e8e0c8';g.fillRect(17,10+k,4,4);spr(cvMik,o.x,o.y,o.a)}
// стрелки-террористы: короткие очереди
function gunTick(dt){const L=E.L;for(const z of L.zs){if(z.dead||!z.gun||z.st!=='chase'||z.stun>0)continue;z.gun.cd-=dt;const d=D2(z.x,z.y,pl.x,pl.y);
  if(z.gun.cd<=0&&d<190&&E.los(z.x,z.y,pl.x,pl.y)){z.gun.cd=rnd(1.7,2.5);z.gun.burst=3;z.gun.bt=0;if(!C1.seenT.gun8){C1.seenT.gun8=1;note('Автоматчики! Стреляют очередями — уходи с линии огня')}}
  if(z.gun.burst>0){z.gun.bt-=dt;if(z.gun.bt<=0){z.gun.bt=.11;z.gun.burst--;const a=Math.atan2(pl.y-z.y,pl.x-z.x)+rnd(-.08,.08);K.shoot(z.x+Math.cos(a)*8,z.y+Math.sin(a)*8,a,190,7,'bul8',{life:1.2});sfx('shot',.18);z.lunge=.1}}}}
function fxOver(){
  if(Q.tr){for(const t of Q.tr){ctx.strokeStyle=`rgba(${t.c},${t.t/.08})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(t.x0,t.y0);ctx.lineTo(t.x1,t.y1);ctx.stroke()}}
  for(const b of Q.eb)if(b.k==='bul8'){ctx.strokeStyle='rgba(255,210,90,.95)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(b.x-b.vx*.03,b.y-b.vy*.03);ctx.lineTo(b.x,b.y);ctx.stroke()}
  if(Q.rk)for(const r of Q.rk){const k=clamp(r.t/r.T,0,1),x=r.x0+(r.x1-r.x0)*k,y=r.y0+(r.y1-r.y0)*k-Math.sin(k*Math.PI)*14,a=Math.atan2(r.y1-r.y0,r.x1-r.x0);
    ctx.save();ctx.translate(x,y);ctx.rotate(a);F(-4,-1,8,2,'#4a5a3a');F(3,-1.5,3,3,'#c8c8c0');ctx.restore();if(Math.random()<.7)E.L.fx.push({x,y,vx:rnd(-6,6),vy:rnd(-6,6),life:.4,c:'#8a8a8a'})}
}
function trTick(dt){if(Q.tr){for(const t of Q.tr)t.t-=dt;Q.tr=Q.tr.filter(t=>t.t>0)}if(Q.rk){for(const r of Q.rk)r.t+=dt;Q.rk=Q.rk.filter(r=>r.t<r.T)}}
// ракета РПГ врага: летит к точке, там взрыв (через предупреждение kit56)
function enemyRocket(x0,y0,x1,y1,T){(Q.rk||(Q.rk=[])).push({x0,y0,x1,y1,t:0,T});K.tele(x1,y1,22,T,26,'fire',t=>{sfx('boom',.6);for(const z of E.L.zs){if(z.dead||z.type==='boss')continue;if(D2(z.x,z.y,t.x,t.y)<24)X.hurtZ(z,60,Math.atan2(z.y-t.y,z.x-t.x),160)}})}

// ================= ОБЩИЙ ЗАПУСК УЧАСТКА =================
function sec8(n){
  K.sec(C8,n,()=>{
    ({stop1:()=>lvStop(1),stop2:()=>lvStop(2),stop3:()=>lvStop(3),sands:()=>lvSands(false),boss:()=>lvSands(true),sosedi:lvSosedi})[n]();
    const L=E.L;if(n!=='sosedi'){L.hero=HERO;L.healName='Пельмени';L.healNote='Горячие уральские пельмени! Силы возвращаются.';L.healNone='Пельмени кончились'}
    for(const it of L.items)if(it.kind==='syr')it.kind='pir';
    const lo=L.drawOver;L.drawOver=()=>{if(lo)lo();fxOver()};
  },sec8);
  K.tick=dt=>{trTick(dt);pelTick();if(Q.al)for(const A of Q.al)alTick(A,dt);gunTick(dt);if(E.L.onTick8)E.L.onTick8(dt)};
}
C8.go=n=>n==='air'?startAir():n==='drive'?startDrive():sec8(n);
const playC8=(shots,onEnd,k)=>K.cut(C8,shots,onEnd,MZ8[k]);
function addPel(x,y){(Q.pel||(Q.pel=[])).push({x,y})}
function pelTick(){if(!Q.pel)return;for(const c of Q.pel){if(c.t)continue;if(D2(c.x,c.y,pl.x,pl.y)<9){c.t=1;PS.syr++;sfx('pick');X.floatT(c.x,c.y-6,'+пельмени','#ffe0a0')}}}
function pelDraw(){if(!Q.pel)return;for(const c of Q.pel){if(c.t)continue;const y=c.y+Math.sin(tm*3+c.x);F(c.x-4,y-1,8,3,'#f4f4f0');F(c.x-3,y-3,2,2,'#f0e8d0');F(c.x,y-3,2,2,'#f0e8d0');F(c.x-1,y-6,1,2,'rgba(255,255,255,.5)');F(c.x+2,y-7,1,3,'rgba(255,255,255,.4)');
  ctx.strokeStyle=`rgba(255,230,160,${.25+.25*Math.sin(tm*5+c.x)})`;ctx.strokeRect(c.x-5.5,y-7.5,11,13)}}
function wrapDraw(L,under,over){const lu=L.drawUnder,lo=L.drawOver;L.drawUnder=()=>{if(lu)lu();if(under)under();pelDraw()};L.drawOver=()=>{if(lo)lo();if(over)over()}}
function lamp8(x,y){B(x-1,y-1,3,3,'#2a2a2a');E.gfill(x-1,y-1,x+2,y+2,2);E.L.lights.push([x,y,46,.85])}
function birch(x,y,r){E.gfill(x-2,y-2,x+2,y+2,2);B(x-1,y-2,3,4,'#e8e8e0');B(x,y-1,1,1,'#2a2a2a');(Q.crowns||(Q.crowns=[])).push([x,y,r||8,hash(x,y)>.5?'#c8a838':'#8aa83a'])}

// ================= ОСТАНОВКИ: расклейка рекламы =================
const STOPS={1:{name:'ПЛОТИНКА',col:'#6ad8ff',dur:36,poster:['ЮРИСТ «ВЕЛИКИЙ»','развод · ДТП · укусы','звоните 24/7'],pc:'#2a3a8a'},
  2:{name:'ЕЛЬЦИН ЦЕНТР',col:'#ffd23a',dur:40,poster:['ВАКАНСИЯ','охотник на зомби','белая з/п · ДМС'],pc:'#8a2a2a'},
  3:{name:'УЛИЦА ВАЙНЕРА',col:'#ff7ac8',dur:44,poster:['БАБУРА','гастроли · Екб','клуб «Грибыч» едет'],pc:'#6a2a9a'}};
const SW=520,SH=360;
function lvStop(n){
  const S=STOPS[n],L=E.mkLevel('stop8_'+n,SW,SH);B(0,0,SW,SH,'#141418');
  const vain=n===3;
  // дорога и тротуар
  if(!vain){K.floor(0,250,SW,320,'asph');for(let x=8;x<SW;x+=28)B(x,284,14,2,'#d8d8d0');K.floor(0,196,SW,250,'walk');K.floor(0,320,SW,336,'walk');B(0,248,SW,2,'#7a7a7e');B(0,320,SW,2,'#7a7a7e')}
  else{K.floor(0,120,SW,336,'cobble');for(let x=20;x<SW;x+=60)B(x,228,30,2,'#8a7e6c')}
  // юг — дома
  for(let x=0;x<SW;x+=74){const c=['#5a4a5a','#4a5a6a','#6a5a4a','#4a4a5a'][(x/74|0)%4];B(x,336,72,24,c);B(x,336,72,2,shade(c,1.3));for(let wx=x+6;wx<x+66;wx+=12)B(wx,342,6,6,hash(wx,n)>.5?'#ffd27a':'#2a3040')}
  E.gfill(0,336,SW,SH,1);
  if(n===1){ // Плотинка: Исеть, плотина, сквер
    K.floor(0,20,SW,110,'sea');E.gfill(0,20,SW,110,1);K.floor(200,20,320,110,'stone');for(let y=24;y<108;y+=6){B(200,y,2,4,'#6a6a6a');B(318,y,2,4,'#6a6a6a')}
    K.floor(0,110,SW,196,'stone');for(let x=0;x<SW;x+=4)B(x,110,4,2,'#4a4a52');for(const x of [40,120,380,460])birch(x,150,9);for(const x of [180,340])lamp8(x,180);
    K.txt(260,64,'ПЛОТИНКА',' #e8f0ff'.trim(),6);K.txt(90,60,'р. ИСЕТЬ','#bfe8ff',5);E.gfill(0,0,SW,20,1);B(0,0,SW,20,'#1a2030');
  }else if(n===2){ // Ельцин-центр: большое белое здание, площадь
    B(0,0,SW,30,'#1a1a22');E.gfill(0,0,SW,120,1);B(100,24,320,96,'#e8e8e4');B(100,24,320,4,'#ffffff');for(let x=110;x<410;x+=14)B(x,40,8,70,'#9ab0c0');B(100,116,320,4,'#b8b8b4');
    K.txt(260,20,'ЕЛЬЦИН ЦЕНТР','#ffffff',7);K.floor(0,120,SW,196,'marble');for(const x of [60,460])birch(x,160,10);for(const x of [150,370])lamp8(x,186);
    B(0,24,100,96,'#2a2a34');B(420,24,100,96,'#2a2a34');
  }else{ // Вайнера: пешеходная улица, магазины, тумба
    E.gfill(0,0,SW,120,1);for(let x=0;x<SW;x+=86){const c=['#c8a078','#8a6a8a','#7a9a8a','#b87a5a','#8a8aa8','#a89a6a'][(x/86|0)%6];B(x,0,84,120,c);B(x,112,84,8,shade(c,.7));B(x+10,96,64,12,'#1a1a22');
      const nm=['ЧЕБУРЕЧНАЯ','КНИГИ','КОФЕ','ПЕЛЬМЕННАЯ','ЧАСЫ','СУВЕНИРЫ'][(x/86|0)%6];K.txt(x+42,105,nm,'#ffd27a',4)}
    for(const x of [70,450])lamp8(x,140);for(const x of [140,380])lamp8(x,316);for(const [x,y] of [[40,300],[480,300]]){X.lowBox(x-8,y-4,16,8,'#6a4a2a','#8a6a40')}
    K.txt(260,330,'УЛИЦА ВАЙНЕРА','#c8b8a0',5);
  }
  // остановка (или тумба) и место расклейки
  const P0=vain?{x:260,y:214}:{x:265,y:206};
  if(!vain){B(222,198,86,4,'#3a4a5a');B(222,198,2,14,'#6a6a72');B(306,198,2,14,'#6a6a72');E.gfill(222,198,308,202,1);B(240,202,50,8,'#2a2a30');K.txt(232,196,'ОСТ.','#ffffff',4)}
  else{ctx;B(248,196,24,18,'#3a3a42');B(250,198,20,14,'#e8e0c8');E.gfill(248,196,272,212,1)}
  // чёрное Поло RS
  const car={x:110,y:vain?260:280};Q.car=car;if(!vain)E.gfill(car.x-20,car.y-11,car.x+20,car.y+11,1);else E.gfill(car.x-20,car.y-11,car.x+20,car.y+11,1);
  L.dark=.5;L.tint='8,10,40';L.lights.push([P0.x,P0.y+10,70,.9],[car.x+24,car.y,40,.7]);
  X.buildNav();
  pl.x=car.x+30;pl.y=car.y-24;pl.a=0;pl.ma=0;
  const vel=addAl('vel',P0.x-12,P0.y+16,{post:{x:P0.x-12,y:P0.y+16,a:-Math.PI/2},glue:true});
  const mik={x:P0.x+12,y:P0.y+16,a:-Math.PI/2};L.npcs.push({draw(){drawMikGlue(mik)}});
  const sat=addAl('sat',pl.x-14,pl.y+6);
  Q.vel=vel;Q.mik=mik;Q.P0=P0;Q.g=0;Q.gl=100;Q.st=0;Q.spawnT=1.5;Q.big=0;Q.n=n;
  addPel(60,210);addPel(470,210);if(n>1)addPel(260,330);
  // стартовые зомби
  const sp=vain?[[10,180],[510,180],[10,300],[510,300],[200,130],[330,130]]:[[10,226],[510,226],[10,290],[510,290],[10,328],[510,328]];Q.sp=sp;
  for(let i=0;i<4+n*2;i++){const s=sp[r4(sp.length)];Zc(s[0]+rnd(-6,6)+(s[0]<100?30:-30),s[1]+rnd(-6,6))}
  L.armed=false;
  L.obj=()=>Q.st===0?['Подойти к остановке']:Q.st===1?['Защити Микроба и Великого, пока клеят: '+Math.floor(Q.g/S.dur*100)+'%','Клейщики: '+Math.max(0,Math.ceil(Q.gl))+' / 100']:Q.st===2?['Добить оставшихся: '+K.alive()]:['Сесть в Поло'];
  K.hud=()=>{if(Q.st!==1)return;const y=38;panel(4,y,108,19,.74);u.fillStyle=S.col;u.fillRect(4,y,2,19);uiFont(4.2,true);u.fillStyle=S.col;u.fillText('ПОСТЕР',9,y+6.5);X.hudBar(36,y+3.5,72,4,Q.g/S.dur,S.col);
    u.fillStyle='#ffb060';u.fillText('КЛЕЙЩИКИ',9,y+15);X.hudBar(36,y+12,72,4,Q.gl/100,Q.gl<35?'#ff3a3a':'#ffb060')};
  wrapDraw(L,()=>{
    // Поло
    drawPolo(car.x,car.y,0);
    if(Q.st===3&&Math.sin(tm*5)>0){ctx.strokeStyle='rgba(255,210,58,.8)';ctx.strokeRect(car.x-22.5,car.y-13.5,45,27)}
  },()=>{
    // постер над местом расклейки
    const k=clamp(Q.g/S.dur,0,1);if(Q.st>=1||k>0){const px=P0.x-26,py=P0.y-58;F(px-1,py-1,54,36,'rgba(0,0,0,.45)');F(px,py,52*k,34,'#f4f0e4');
      ctx.save();ctx.beginPath();ctx.rect(px,py,52*k,34);ctx.clip();F(px,py,52,9,S.pc);ctx.font='bold 4px monospace';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(S.poster[0],px+26,py+6.5);
      ctx.fillStyle='#1a1a1a';ctx.fillText(S.poster[1],px+26,py+17);ctx.fillText(S.poster[2],px+26,py+25);ctx.fillStyle=S.pc;ctx.fillRect(px+4,py+29,44,2);ctx.restore();ctx.textAlign='left';
      if(Q.st===1&&k<1){F(px+52*k-1,py,1,34,'#ffd23a')}}
    if(Q.st===1&&Q.bit>0){F(P0.x-20,P0.y+28,40,2,'#ff3a3a')}
    for(const z of E.L.zs)if(!z.dead&&z.ai==='glue'&&Math.sin(tm*8)>0)F(z.x-1,z.y-12,2,3,'#ffb060');
  });
  L.onTick8=dt=>{if(hold())return;if(Q.bit>0)Q.bit-=dt;
    if(Q.st===0){if(D2(pl.x,pl.y,P0.x,P0.y)<70)startGlue();return}
    if(Q.st===1){
      // зомби, идущие к клейщикам
      let biting=false;
      for(const z of E.L.zs){if(z.dead||z.ai!=='glue')continue;const dp=D2(z.x,z.y,pl.x,pl.y),ds=D2(z.x,z.y,sat.x,sat.y);
        if(dp<38||ds<24||z.hp<z.max){z.ai=null;z.stun=0;z.st='chase';continue}z.stun=99;
        const tg=z.tgt===1?mik:vel,d=D2(z.x,z.y,tg.x,tg.y);
        if(d>z.r+9){const a=E.los(z.x,z.y,tg.x,tg.y)?Math.atan2(tg.y-z.y,tg.x-z.x):K.navDir(z);if(a!=null){K.mv(z,Math.cos(a)*z.sp*dt,Math.sin(a)*z.sp*dt,z.r);z.a=a;z.ph+=dt*z.sp*.3}}
        else{biting=true;z.a=Math.atan2(tg.y-z.y,tg.x-z.x);z.bt=(z.bt||0)-dt;if(z.bt<=0){z.bt=.9;z.lunge=.18;Q.gl-=z.type==='brute'?14:6;Q.bit=.25;sfx('hit',.5);X.floatT(tg.x,tg.y-12,z.tgt===1?'МИКРОБ!':'ВЕЛИКИЙ!','#ffb060');
          if(!Q.warn){Q.warn=1;say([[z.tgt===1?'m':'vel',z.tgt===1?'Шмакодявка! Меня жуют! Я клей держу!':'Коллеги, у меня тут посторонние в рабочей зоне!']])}}}}
      if(!biting)Q.g+=dt;
      if(Q.gl<=0){Q.gl=60;X.loseLife();note('Клейщиков покусали — начинаем лист заново');Q.g=Math.max(0,Q.g-8)}
      Q.spawnT-=dt;if(Q.spawnT<=0&&E.L.zs.length<26){Q.spawnT=rnd(2.4,3.4)-Q.g/S.dur*.9-n*.2;const s=sp[r4(sp.length)],cnt=2+r4(2+n);
        for(let i=0;i<cnt;i++){const z=(Math.random()<.3?Zf:Zc)(s[0]+rnd(-8,8),s[1]+rnd(-8,8),{st:'chase'});if(Math.random()<.5){z.ai='glue';z.stun=99;z.tgt=r4(2)}}}
      if(!Q.big&&Q.g>S.dur*.55){Q.big=1;const s=sp[r4(2)];const z=Zg(s[0],s[1],{st:'chase',nm:n===2?'ОХРАНА ЦЕНТРА':'ОХРАННИК',nmc:'#ffd23a'});z.ai='glue';z.stun=99;z.tgt=0;note('Громила идёт прямо на клейщиков!')}
      if(Q.g>=S.dur){Q.st=2;sfx('ring',1);for(const z of E.L.zs)if(z.ai==='glue'){z.ai=null;z.stun=0;z.st='chase'}vel.glue=false;
        say([['vel','Лист ровный. Без пузырей. Фото для отчёта сделано.'],['m','Клей кончается. Как и мои нервы.'],['sat','Добиваем — и по машинам.']])}}
    else if(Q.st===2&&K.alive()===0){Q.st=3;C8.flags['stop'+n]=1;vel.post=null;
      say(n===1?[['vel','Первая точка закрыта. В трекере — зелёная галочка.'],['s','Великий, мы правда это делаем? Посреди апокалипсиса?'],['vel','Дедлайн — это святое. Следующая точка — Ельцин-центр.']]
        :n===2?[['sat','Он так каждую ночь. Я привыкла.'],['vel','HR-задача: «привлечь кандидатов». Кандидатов привлекли. Правда, не тех.'],['m','Последняя — Вайнера. Там пешеходка, машину бросим рядом.']]
        :[['vel','Всё. Задача закрыта. Можно ставить статус «выполнено».'],['sat','Отлично. А теперь — моя очередь. Поехали, кое-что покажу.'],['s','Что ещё?'],['sat','Увидишь. Тебе понравится. Там песок.']],()=>note('Садись в Поло'))}
  };
  L.its=[{x:car.x,y:car.y,r:26,label:()=>'Сесть в Поло',cond:()=>Q.st===3,act:()=>{lockMove=true;K.hud=null;X.go(()=>{lockMove=false;if(n<3)playC8(cutHop(n+1),()=>sec8('stop'+(n+1)),'drive');else playC8(CUT_GATE,()=>sec8('sands'),'gate')})}},
    {x:vel.x,y:vel.y,r:16,label:()=>'Великий',cond:()=>Q.st!==1,act:()=>say([['vel',Q.st===0?'Сначала безопасность, потом клей. Прикройте нас.':'Спасибо за содействие. Укажу вас в отчёте.']])}];
  function startGlue(){Q.st=-1;lockMove=true;
    say([['vel',n===1?'Так. Плотинка. Ведро, кисть, рулон. Микроб — держишь угол.':n===2?'Ельцин-центр. Тут проходимость высокая. Даже у мёртвых.':'Вайнера. Тумба старая, клей схватится не сразу.'],
      ['m','Держу. Шмакодявка, Сатурналия — на вас всё остальное.'],['sat','Они уже идут. С двух сторон.'],['s','Значит, работаем. Стреляю я, клеят они.']],()=>{lockMove=false;Q.st=1;L.armed=true;mz8('glue');for(const z of E.L.zs){z.st='chase';if(Math.random()<.4){z.ai='glue';z.stun=99;z.tgt=r4(2)}}note('Не подпускай зомби к клейщикам')})}
  after(.5,()=>{K.zoneBanner('ОСТАНОВКА · '+S.name,S.col)});
}

// ================= ЧЁРНОЕ ПОЛО RS (сверху) =================
const POLO=mk(40,24);
(g=>{const C='#141418',CD='#0a0a0c',CL='#2e2e36';for(const [x,y] of [[7,0],[27,0],[7,21],[27,21]])P(g,x,y,7,3,'#050506');
  P(g,1,3,38,18,C);P(g,1,3,38,1,CL);P(g,1,20,38,1,CD);P(g,28,4,10,16,'#1a1a20');P(g,22,4,2,16,'#2a3a50');P(g,9,5,13,14,'#0e0e12');P(g,11,6,3,12,'#2a3a50');
  P(g,2,8,36,1,'#c81a2a');P(g,2,15,36,1,'#c81a2a');P(g,38,4,1,3,'#fff6c0');P(g,38,17,1,3,'#fff6c0');P(g,0,5,1,3,'#ff2a2a');P(g,0,16,1,3,'#ff2a2a');
  P(g,30,10,4,4,'#d8d8e0');outline(g,'#0b0910')})(POLO.getContext('2d'));
function drawPolo(x,y,a){shadowBlob(x,y,14);ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(a);ctx.drawImage(POLO,-20,-12);ctx.restore()}

// ================= «ПЕСКИ»: арена в пустынном стиле (своя карта) =================
// Запад — караван-сарай (наш вход), восток — дорога, откуда лезут.
// Точка A — крытый рынок на севере, точка B — водокачка на юге,
// в центре — площадь с часовой башней, под городом — старая цистерна.
const AW=960,AH=660;
const SANDS=[[20,250,150,410,'stone'],[60,40,112,250,'sand'],[60,40,620,92,'sand'],[600,30,850,230,'cobble'],[500,92,548,250,'sand'],[150,300,390,348,'sand'],
  [390,250,590,420,'sand'],[440,420,488,470,'sand'],[560,460,850,630,'stone'],[40,410,96,590,'sewer'],[40,540,580,590,'sewer'],[850,40,930,630,'sand'],[590,300,850,346,'sand'],[440,460,600,500,'sand']];
const ARCH=[[200,40,52],[330,40,52],[460,40,52],[500,150,48,1],[240,300,48],[650,300,46],[440,440,48]];
function lvSands(boss){
  const L=E.mkLevel(boss?'sands8b':'sands8',AW,AH);
  // крыши домов (всё, что не улица): плоские, терракотовые, с бортиками по кварталам
  for(let y=0;y<AH;y+=4)for(let x=0;x<AW;x+=4){const q=hash(x/64|0,y/64|0),h=hash(x>>2,y>>2);const base=q<.33?'#a8744a':q<.66?'#b88456':'#9a6a44';B(x,y,4,4,h<.12?shade(base,.9):base)}
  for(let y=0;y<AH;y+=64)B(0,y,AW,2,'#c8a070');for(let x=0;x<AW;x+=64)B(x,0,2,AH,'#c8a070');
  for(let y=16;y<AH;y+=64)for(let x=16;x<AW;x+=64){const h=hash(x,y);if(h<.3){B(x+4,y+4,14,10,'#6a7a8a');B(x+5,y+5,12,2,'#8a9aaa')}else if(h<.55){L.bx.fillStyle='#e8d4a8';L.bx.beginPath();L.bx.arc(x+16,y+16,9,0,TAU);L.bx.fill();L.bx.fillStyle='#c8b080';L.bx.beginPath();L.bx.arc(x+18,y+18,6,0,TAU);L.bx.fill();L.bx.fillStyle='#fff4d8';L.bx.fillRect(x+12,y+11,3,2)}
    else if(h<.7){for(let i=0;i<4;i++)B(x+2+i*7,y+6,5,16,['#c83a3a','#3a6ac8','#e8c040','#3a9a5a'][i])}}
  for(const [x0,y0,x1,y1,k] of SANDS)K.floor(x0,y0,x1,y1,k);
  // тени от стен (свет сверху-слева)
  for(let y=4;y<AH;y+=4)for(let x=4;x<AW;x+=4){if(E.gAt(x,y))continue;if(E.gAt(x,y-4)){B(x,y,4,4,'#c8a474');B(x,y+3,4,1,'#8a6a42');if(!E.gAt(x,y+4))B(x,y+4,4,3,'rgba(90,60,25,.3)')}if(E.gAt(x-4,y))B(x,y,3,4,'rgba(90,60,25,.3)')}
  for(let y=4;y<AH;y+=4)for(let x=4;x<AW;x+=4){if(!E.gAt(x,y))continue;if(!E.gAt(x,y+4)&&y+4<AH)B(x,y+2,4,2,'#e0c08a');if(!E.gAt(x-4,y)||!E.gAt(x+4,y))B(x,y,4,4,shade('#b88456',1.15))}
  // часовая башня в центре
  B(468,313,44,44,'#8a6a42');B(470,315,40,40,'#d8b484');B(475,320,30,30,'#c8a070');B(480,325,20,20,'#b8905e');B(486,331,8,8,'#a07848');B(489,334,2,2,'#e8c050');for(const [cx,cy] of [[490,316],[490,354],[471,335],[509,335]]){B(cx-2,cy-2,4,4,'#f4ecd8');B(cx,cy-1,1,2,'#2a2a2a')}E.gfill(470,315,510,355,1);
  // рынок (A): прилавки под навесами и ящики
  for(const [x,y] of [[640,70],[700,70],[760,70],[640,170],[760,170]]){B(x,y,40,14,'#8a5a3a');B(x,y,40,3,'#c86a3a');for(let i=0;i<5;i++)B(x+3+i*8,y+5,5,5,['#e8c040','#c83a2a','#5aaa3a','#e88a2a','#a85aa8'][i]);E.gfill(x,y,x+40,y+14,1)}
  const crate=(x,y,s)=>{s=s||14;B(x,y,s,s,'#a8783e');B(x+1,y+1,s-2,s-2,'#c08a48');B(x,y+s/2-1,s,2,'#8a5a2a');B(x+s/2-1,y,2,s,'#8a5a2a');E.gfill(x,y,x+s,y+s,1)};
  for(const [x,y,s] of [[700,120,16],[716,120,12],[620,120],[800,120],[150,268],[118,380],[400,262],[560,392,16],[600,500],[620,500,12],[800,500],[780,600],[660,600],[880,200],[880,450],[300,310,12],[660,320,12]])crate(x,y,s);
  // водокачка (B)
  L.bx.fillStyle='#8a7a6a';L.bx.beginPath();L.bx.arc(710,540,22,0,TAU);L.bx.fill();L.bx.fillStyle='#a89888';L.bx.beginPath();L.bx.arc(708,538,18,0,TAU);L.bx.fill();L.bx.fillStyle='#6a8aa8';L.bx.beginPath();L.bx.arc(708,538,9,0,TAU);L.bx.fill();E.gfill(690,520,730,560,1);
  // метки точек
  const mark=(x,y,t)=>{L.bx.fillStyle='rgba(200,40,40,.55)';L.bx.font='bold 26px monospace';L.bx.textAlign='center';L.bx.fillText(t,x,y);L.bx.textAlign='left'};mark(726,160,'A');mark(760,590,'B');
  K.txt(85,404,'КАРАВАН-САРАЙ','#7a5a3a',5);K.txt(340,86,'ДЛИННАЯ УЛИЦА','#8a6a42',5);K.txt(490,300,'ПЛОЩАДЬ','#8a6a42',5);K.txt(300,584,'ЦИСТЕРНА','#5a5a4a',5);K.txt(890,36,'ВОСТОЧНАЯ ДОРОГА','#8a6a42',4);
  // пальмы
  for(const [x,y] of [[40,270],[130,270],[410,400],[570,400],[580,620],[840,620],[620,40]])K.tree(x,y,9,'#4a8a3a');
  L.dark=0;L.sunTint='rgba(255,170,80,.08)';
  X.buildNav();
  // бомбы на точках
  Q.bombs=boss?null:{A:{x:726,y:130,def:false,t:150},B:{x:760,y:560,def:false,t:150}};
  Q.boss=null;Q.phase=0;
  if(!boss){pl.x=60;pl.y=330;pl.a=0;pl.ma=0}else{pl.x=440;pl.y=270;pl.a=Math.PI/2;pl.ma=pl.a}
  addAl('sat',pl.x-10,pl.y+12);addAl('vel',pl.x-10,pl.y-12);
  addPel(130,60);addPel(480,280);addPel(80,560);addPel(900,330);addPel(820,40);addPel(580,610);
  L.armed=true;
  if(!boss){
    for(let i=0;i<6;i++)Zt(rnd(140,580),rnd(50,84));Zgun(560,66);
    for(let i=0;i<8;i++)Zt(rnd(610,840),rnd(40,220));Zgun(680,200);Zgun(820,100);Zg(780,150,{v:821,hp:500,max:500,nm:'ОХРАНА ТОЧКИ A',nmc:'#ffb060'});
    for(let i=0;i<7;i++)Zt(rnd(400,580),rnd(260,410));Zgun(580,260);Zgun(400,410);
    for(let i=0;i<8;i++)Zt(rnd(570,840),rnd(470,620));Zgun(840,480);Zgun(600,620);Zg(820,600,{v:821,hp:500,max:500,nm:'ОХРАНА ТОЧКИ B',nmc:'#ffb060'});
    for(let i=0;i<6;i++)Zcr(rnd(50,90),rnd(430,580));for(let i=0;i<5;i++)Zcr(rnd(120,540),rnd(550,580));
    for(let i=0;i<6;i++)Ztf(rnd(860,920),rnd(60,620));for(let i=0;i<4;i++)Zt(rnd(600,840),rnd(306,340));
  }
  L.obj=()=>{if(boss)return Q.won?['Барханыч повержен']:Q.phase?['Победить командира Барханыча']:['Выйти на площадь'];
    const b=Q.bombs,o=[];for(const k of ['A','B']){const t=b[k];o.push(t.def?'Бомба '+k+' обезврежена  ✓':'Обезвредить бомбу на точке '+k+' · '+Math.max(0,Math.ceil(t.t))+' с')}
    o.push(K.alive()?'Зачистить «Пески»: '+K.alive():'«Пески» зачищены  ✓');if(!C8.flags.desert)o.push('(по желанию) Ящик в цистерне');return o};
  K.hud=()=>{if(boss||!Q.bombs)return;const y=38;panel(4,y,96,19,.74);u.fillStyle='#ff5a3a';u.fillRect(4,y,2,19);uiFont(4.2,true);
    for(const [i,k] of [[0,'A'],[1,'B']]){const t=Q.bombs[k];u.fillStyle=t.def?'#3ef0b0':(t.t<30&&Math.sin(tm*10)>0?'#ff3a3a':'#ffd23a');u.fillText('БОМБА '+k+': '+(t.def?'ОБЕЗВРЕЖЕНА':Math.ceil(t.t)+' с'),9,y+7.5+i*8)}};
  // ящик с камуфляжем — скин 'desert'
  const box={x:58,y:572};
  wrapDraw(L,()=>{
    if(Q.bombs)for(const k of ['A','B']){const t=Q.bombs[k];if(t.def){F(t.x-5,t.y-3,10,6,'#3a3a32');F(t.x-3,t.y-1,6,2,'#3ef0b0');continue}
      F(t.x-6,t.y-4,12,8,'#2a2a22');F(t.x-5,t.y-3,10,6,'#4a4a3a');F(t.x-4,t.y-2,4,2,Math.sin(tm*(t.t<30?16:6))>0?'#ff2020':'#5a0a0a');F(t.x+1,t.y-2,3,4,'#c8a040');
      ctx.strokeStyle=`rgba(255,60,40,${.3+.3*Math.sin(tm*6)})`;ctx.beginPath();ctx.arc(t.x,t.y,10+Math.sin(tm*4)*2,0,TAU);ctx.stroke()}
    if(!C8.flags.desert){F(box.x-7,box.y-5,14,10,'#6a5a3a');F(box.x-6,box.y-4,12,3,'#c8b080');F(box.x-2,box.y-1,4,3,'#a89060');ctx.strokeStyle=`rgba(255,210,120,${.3+.3*Math.sin(tm*5)})`;ctx.strokeRect(box.x-9.5,box.y-7.5,19,15)}
  },()=>{
    // арки над улицами (поверх героев, прозрачнее рядом)
    for(const [x,y,w,vert] of ARCH){const near=D2(pl.x,pl.y,x+(vert?w/2:4),y+(vert?4:w/2))<26;ctx.globalAlpha=near?.35:1;
      if(vert){F(x,y,w,7,'#c8a070');F(x,y,w,2,'#e0c090');F(x+4,y+7,w-8,2,'rgba(60,30,10,.35)')}else{F(x,y,8,w,'#c8a070');F(x,y,2,w,'#e0c090');F(x+8,y+4,2,w-8,'rgba(60,30,10,.35)')}ctx.globalAlpha=1}
    if(Q.boss&&Q.boss.hot>0){ctx.fillStyle=`rgba(255,255,255,${.3+.2*Math.sin(tm*20)})`;ctx.font='bold 5px monospace';ctx.textAlign='center';ctx.fillText('ПЕРЕЗАРЯЖАЕТ!',Q.boss.x,Q.boss.y-24);ctx.textAlign='left'}
    if(Q.storm>0){ctx.fillStyle=`rgba(220,180,110,${Q.storm*.35})`;ctx.fillRect(camX,camY,W,H);for(let i=0;i<30;i++){const x=camX+mod(i*53+tm*160,W),y=camY+mod(i*37+tm*20,H);F(x,y,3,1,'rgba(255,230,180,.6)')}}
  });
  const bombAct=k=>()=>{const t=Q.bombs[k];MG.play('P','wires',{title:'Бомба на точке '+k,hint:'Соедини провода по цветам — таймер остановится.',col:'#ff5a3a'},()=>{t.def=true;sfx('ring',1.2);X.floatT(t.x,t.y-10,'ОБЕЗВРЕЖЕНА','#3ef0b0');
    say(k==='A'?[['s','Точка A — чисто. Бомба обезврежена.'],['sat','Красиво! Как будто ты всю жизнь только этим и занималась.']]:[['s','Точка B — тоже. Таймер стоит.'],['vel','Зафиксирую в протоколе: «обезврежено гражданкой Шмакодявкой».']])})};
  L.its=[{x:Q.bombs?Q.bombs.A.x:0,y:Q.bombs?Q.bombs.A.y:0,r:16,label:()=>'Обезвредить бомбу A',cond:()=>Q.bombs&&!Q.bombs.A.def,act:bombAct('A')},
    {x:Q.bombs?Q.bombs.B.x:0,y:Q.bombs?Q.bombs.B.y:0,r:16,label:()=>'Обезвредить бомбу B',cond:()=>Q.bombs&&!Q.bombs.B.def,act:bombAct('B')},
    {x:box.x,y:box.y,r:16,label:()=>'Ящик: «КАМУФЛЯЖ»',cond:()=>!C8.flags.desert,act:()=>MG.play('A','rummage',{title:'Ящик в цистерне'},()=>{C8.flags.desert=true;sfx('pick');try{if(window.UP&&UP.grantSkin)UP.grantSkin('desert')}catch(e){}
      say([['s','Песочный камуфляж. Два комплекта. Мне и Микробу.'],['sat','Вам пойдёт. Переоденетесь дома у зеркала.']])})}];
  L.onUpdate=()=>K.trigs();
  if(!boss){
    L.onTick8=dt=>{if(hold())return;
      for(const k of ['A','B']){const t=Q.bombs[k];if(t.def)continue;t.t-=dt;if(t.t<=0){t.t=60;C1.shake=1.4;sfx('boom',1);X.loseLife();note('Бомба '+k+' рванула! Новая — 60 секунд. Быстрее!')}}
      if(!Q.cleared&&Q.bombs.A.def&&Q.bombs.B.def&&K.alive()===0){Q.cleared=1;
        say([['sat','Тихо. Слишком тихо.'],['vel','В таких местах всегда есть начальник. Тот, кто подписывает приказы.'],['s','Слышите? С площади. Кто-то орёт в мегафон.'],['sat','Идём на площадь. Последний.']],()=>{lockMove=true;X.go(()=>{lockMove=false;sec8('boss')})})}};
    Q.trig.push({x:330,y:66,r:40,fn:()=>say([['sat','Длинная улица. Здесь всегда стреляют из-за арок.'],['s','Поняла. Держимся стен.']])});
    Q.trig.push({x:470,y:320,r:50,fn:()=>say([['vel','Площадь — центр всего. Отсюда видно и рынок, и водокачку.']])});
    Q.trig.push({x:70,y:450,r:30,fn:()=>say([['s','Цистерна. Темно, сыро, и кто-то ползает.'],['sat','Ползуны. Смотри под ноги.']])});
    after(.5,()=>{K.zoneBanner('«ПЕСКИ»','#ffb060');mz8('sands');
      say([['sat','Добро пожаловать в «Пески». Строили для турниров по стрельбе — песок, арки, две точки.'],['vel','А теперь тут засели зомби в балаклавах. И, судя по тиканью, с бомбами.'],
        ['s','Две бомбы — точки A и B. Обезвреживаем обе и чистим всё.'],['sat','Карта большая. Шмакодявка, веди. Мы прикроем.']])});
  }else{
    Q.trig.push({x:480,y:380,r:90,fn:()=>{lockMove=true;sfx('groan',2);C1.shake=1;
      say([['bh','ВНИМАНИЕ. ГОВОРИТ КОМАНДИР БАРХАНЫЧ.'],['bh','ВЫ ОБЕЗВРЕДИЛИ МОИ БОМБЫ. ЭТО БЫЛО НЕВЕЖЛИВО.'],['vel','Гражданин, у вас незаконное хранение. Статья двести двадцать два.'],
        ['bh','У МЕНЯ ЕСТЬ РПГ. ЭТО МОЙ АДВОКАТ.'],['s','А у меня — дробовик. И очень плохое настроение.']],()=>{lockMove=false;Q.phase=1;mz8('boss');
        const b=E.addZ('boss',480,560,{v:850,hp:3000,max:3000,sp:24,r:10,st:'chase',nm:'КОМАНДИР БАРХАНЫЧ',nmc:'#ffb060',stun:99,at:2,mt:1.2,sm:12,hot:0});Q.boss=b;K.zoneBanner('КОМАНДИР БАРХАНЫЧ','#ffb060')})}});
    L.onTick8=dt=>{K.trigs();if(hold())return;if(Q.storm>0&&Q.phase<3)Q.storm=Math.max(0,Q.storm-dt);barkh(dt)};
    after(.5,()=>{K.zoneBanner('«ПЕСКИ» · ПЛОЩАДЬ','#ffb060');say([['sat','Площадь. Пусто.'],['s','Под башней следы. Большие. И гильзы от ракет.']])});
  }
}
function barkh(dt){
  const z=Q.boss;if(!z)return;
  if(!z.dead){
    z.stun=99;const d=D2(z.x,z.y,pl.x,pl.y),ta=Math.atan2(pl.y-z.y,pl.x-z.x),k=z.hp/z.max;
    if(Q.phase===1&&k<.6){Q.phase=2;z.hot=1.5;C1.shake=.8;X.floatT(z.x,z.y-24,'ПОДКРЕПЛЕНИЕ!','#ffb060');say([['bh','ВЗВОД! КО МНЕ!'],['sat','Их стало больше. Стреляют с крыш!']]);
      for(let i=0;i<3;i++)Zgun(rnd(400,580),rnd(260,410),{st:'chase'});for(let i=0;i<4;i++)Ztf(900,rnd(300,340),{st:'chase'})}
    if(Q.phase===2&&k<.3){Q.phase=3;z.hot=1.5;C1.shake=1.2;Q.storm=1;X.floatT(z.x,z.y-24,'ПЕСЧАНАЯ БУРЯ!','#ffd23a');say([['bh','БУРЯ! ВЫ МЕНЯ НЕ УВИДИТЕ!'],['s','Зато я его слышу. Он орёт в мегафон.'],['vel','Целься на голос!']])}
    if(Q.phase===3)Q.storm=Math.min(.9,Q.storm+dt*.5);
    if(z.hot>0){z.hot-=dt;z.a+=dt*1.5;return}
    // идёт к игроку, но держит дистанцию для ракет
    if((d>90||Q.phase===3)&&d>36){const dir=E.los(z.x,z.y,pl.x,pl.y)?ta:K.navDir(z);if(dir!=null){K.mv(z,Math.cos(dir)*z.sp*(Q.phase===3?1.4:1)*dt,Math.sin(dir)*z.sp*dt,z.r-2);z.ph+=dt*6}}
    z.a+=angDiff(ta,z.a)*Math.min(1,dt*5);
    z.mt-=dt;if(d<40&&z.mt<=0){z.mt=1.6;K.tele(pl.x,pl.y,16,.55,24,'saw');X.floatT(z.x,z.y-22,'ПРИКЛАДОМ!','#ffd23a')}
    z.at-=dt;if(z.at<=0){
      if(Math.random()<.6||Q.phase===3){const n=Q.phase===1?1:Q.phase===2?2:3;for(let i=0;i<n;i++){const tx=pl.x+rnd(-1,1)*(i?30:6),ty=pl.y+rnd(-1,1)*(i?30:6);after(i*.3,()=>{if(!z.dead){enemyRocket(z.x,z.y,tx,ty,1);sfx('power',.5)}})}
        X.floatT(z.x,z.y-22,n>1?'ЗАЛП РПГ!':'ВЫСТРЕЛ РПГ!','#ff7a3a');z.at=Q.phase===1?3.2:2.8;z.rl=(z.rl||0)+n;if(z.rl>=4){z.rl=0;z.next='hot'}}
      else{for(let i=0;i<5;i++){const a=rnd(0,TAU),r=rnd(10,40);K.tele(pl.x+Math.cos(a)*r,pl.y+Math.sin(a)*r,14,1.1+i*.12,18,'fire')}X.floatT(z.x,z.y-22,'ГРАНАТЫ!','#ffd23a');z.at=2.6}
    }
    if(z.next==='hot'){z.next=null;z.hot=2;sfx('hiss')}
    if(Q.phase>=2){z.sm-=dt;if(z.sm<=0){z.sm=12;for(let i=0;i<3;i++)Zt(rnd(860,920),rnd(300,340),{st:'chase'});Zgun(900,320,{st:'chase'});X.floatT(z.x,z.y-22,'ВЗВОД!','#ffb060')}}
  }
  if(Q.phase>0&&!Q.won&&z.dead){Q.won=1;Q.storm=0;Q.tele.length=0;if(Q.rk)Q.rk.length=0;K.ghostAll('#ffd8a0');sfx('power',1);C1.shake=1.4;
    after(1.2,()=>say([['bh','МОЙ... АДВОКАТ... НЕ ПОМОГ...'],['vel','Я же говорил. Двести двадцать два.'],['s','Смотрите — его РПГ. Целый.'],['sat','Трофей! Шмакодявка, он твой.']],()=>{
      lockMove=true;X.go(()=>{lockMove=false;playC8(CUT_END8,endCh8,'end')})}))}
}

// ================= ПОДЛЁТ К КОЛЬЦОВО: истребитель, турель Шмакодявки =================
// Свой режим C1.mode='c8air': экран стоит, земля едет вниз. WASD/левый стик — манёвр,
// мышь/правый стик — турель, ЛКМ — огонь. Валера сам пускает ракеты.
let AIR=null;
const JET=mk(36,40);
(g=>{const C='#8a929c',CD='#5a626c',CL='#b4bcc6';
  P(g,16,0,4,6,CL);P(g,15,4,6,30,C);P(g,14,10,8,20,C);P(g,16,6,4,6,'#2a3a50');P(g,17,7,2,2,'#8ab0d8'); // нос и кабина
  for(let i=0;i<14;i++){P(g,14-i,14+i,i+1,2,C);P(g,21,14+i,i+1,2,C)}P(g,0,27,14,2,CD);P(g,22,27,14,2,CD); // крылья
  P(g,10,31,4,7,CD);P(g,22,31,4,7,CD);P(g,9,32,2,6,C);P(g,25,32,2,6,C); // кили
  P(g,14,34,3,4,'#3a3a42');P(g,19,34,3,4,'#3a3a42');P(g,4,22,2,4,'#c82a2a');P(g,30,22,2,4,'#c82a2a');P(g,6,24,3,2,'#e8e8e8');P(g,27,24,3,2,'#e8e8e8');
  P(g,15,14,6,1,CL);outline(g,'#0b0910')})(JET.getContext('2d'));
function startAir(){
  C1.on=true;C8.on=true;C8.sec='air';C1.over=null;C1.hurt=0;C1.shake=0;PS.inv=0;C1.mdown=false;lockMove=false;dlg=null;K.on=C8;
  const s0=X.snap();C1.retry=()=>{X.restore(s0);PS.lives=3;PS.hp=PS.max;startAir()};
  for(const k in Q)delete Q[k];
  AIR={t:0,dur:70,px:160,py:140,hp:100,inv:0,cd:0,heat:0,oh:0,ta:-Math.PI/2,buls:[],en:[],eb:[],fx:[],ms:[],kills:0,scroll:0,rk:5,boss:null,end:false,banner:4,spawnT:1.5,flash:0};
  C1.mode='c8air';scene='c8air';mz8('air');C1.cx=0;C1.cy=0;camX=0;camY=0;
  after(1,()=>say([['val','Подлетаем к Кольцово. Сесть не дадут — небо кишит.'],['s','Это что, летающие зомби?!'],['val','Вороны. И какие-то идиоты на парапланах. Мёртвые идиоты.'],['m','Шмакодявка, турель твоя. Я держусь за кресло.'],['val','А я пускаю ракеты. Поехали!']]));
}
function airSpawn(k,x,y,o){const S={crow:{hp:14,r:4,sp:78},glider:{hp:60,r:8,sp:24},para:{hp:30,r:5,sp:30},big:{hp:900,r:16,sp:30}}[k];
  const e=Object.assign({k,x,y,hp:S.hp,max:S.hp,r:S.r,sp:S.sp,t:rnd(0,6),a:Math.PI/2,cd:rnd(1,2.5),fl:0},o||{});AIR.en.push(e);return e}
function airHurtE(e,d){if(e.dead)return;e.hp-=d;e.fl=.08;if(e.hp<=0){e.dead=true;AIR.kills++;PS.kills++;C8.airK++;sfx('thump',.5);for(let i=0;i<10;i++)AIR.fx.push({x:e.x,y:e.y,vx:rnd(-50,50),vy:rnd(-50,50),life:rnd(.2,.5),c:i%2?'#8a1018':'#2a2a2a'});
  if(e.k==='big'){C1.shake=1.2;for(let i=0;i<30;i++)AIR.fx.push({x:e.x+rnd(-14,14),y:e.y+rnd(-8,8),vx:rnd(-80,80),vy:rnd(-80,80),life:rnd(.3,.8),c:['#ff8a2a','#ffd23a','#5a5a5a'][i%3]})}}}
function airHit(d){if(AIR.inv>0||AIR.end)return;AIR.hp-=d*2;AIR.inv=.5;C1.shake=Math.max(C1.shake,.4);sfx('hurt');if(AIR.hp<=0){AIR.hp=100;AIR.inv=2.5;X.loseLife()}}
function airUpdate(dt){
  const A=AIR;A.t+=dt;if(A.banner>0)A.banner-=dt;if(A.inv>0)A.inv-=dt;if(A.flash>0)A.flash-=dt;if(C1.shake>0)C1.shake=Math.max(0,C1.shake-dt*2.5);
  const free=!dlg&&!tr&&!A.end;
  A.scroll+=dt*(A.end?20:60);
  const [mx,my]=free?X.inputMove():[0,0];A.px=clamp(A.px+mx*130*dt,18,W-18);A.py=clamp(A.py+my*110*dt,40,H-26);
  if(A.end){A.py+=(110-A.py)*dt;A.px+=(160-A.px)*dt}
  if(A.fuel==null){A.fuel=100;A.tanks=[];A.tkT=5;A.storm=0;A.light=0}
  if(free){A.fuel-=dt*1.6;A.tkT-=dt;if(A.tkT<=0){A.tkT=rnd(6.5,9.5);A.tanks.push({x:rnd(30,290),y:-10})}}
  for(const t of A.tanks){t.y+=55*dt;if(D2(t.x,t.y,A.px,A.py)<13){t.got=1;A.fuel=Math.min(100,A.fuel+38);sfx('pick');X.floatT&&0;note('Топливо +38')}}A.tanks=A.tanks.filter(t=>!t.got&&t.y<H+20);
  if(A.fuel<=0&&!A.end){A.fuel=100;note('Топливо кончилось!');X.loseLife()}
  {const st=A.t>26&&A.t<48&&!A.end;A.storm=st?Math.min(1,A.storm+dt*.5):Math.max(0,A.storm-dt*.5);if(st&&!A.stN){A.stN=1;note('Гроза! Болтает — держи самолёт')}
   if(A.storm>0){A.px=clamp(A.px+Math.sin(A.t*1.3)*48*A.storm*dt,18,W-18);A.py=clamp(A.py+Math.cos(A.t*1.7)*30*A.storm*dt,40,H-26);if(Math.random()<dt*.6*A.storm){A.light=.22;sfx('thump',.35);C1.shake=Math.max(C1.shake,.3)}}if(A.light>0)A.light-=dt}
  // прицел турели
  let aim=null;if(mouse.on&&!touch.on)aim=Math.atan2(mouse.y-A.py,mouse.x-A.px);else if(touch.aim&&touch.aim.moved)aim=Math.atan2(touch.aim.y-touch.aim.oy,touch.aim.x-touch.aim.ox);
  if(aim===null){let best=null,bd=180;for(const e of A.en){if(e.dead)continue;const d=D2(e.x,e.y,A.px,A.py);if(d<bd){bd=d;best=e}}aim=best?Math.atan2(best.y-A.py,best.x-A.px):-Math.PI/2}
  A.ta+=angDiff(aim,A.ta)*Math.min(1,dt*16);
  if(A.cd>0)A.cd-=dt;if(A.oh>0){A.oh-=dt;if(A.oh<=0)A.heat=.3}else A.heat=Math.max(0,A.heat-dt*.4);
  const firing=free&&((C1.mdown&&mouse.on&&!touch.on)||X.touchFiring()||C1.fire!=null||(touch.on&&!touch.aim&&A.en.some(e=>!e.dead)));
  if(firing&&A.cd<=0&&A.oh<=0){A.cd=.085;A.heat+=.03;A.flash=.04;sfx('shot',.35);const a=A.ta+rnd(-.04,.04);A.buls.push({x:A.px+Math.cos(A.ta)*8,y:A.py+Math.sin(A.ta)*8,vx:Math.cos(a)*420,vy:Math.sin(a)*420,life:.6});
    if(A.heat>=1){A.oh=1.4;sfx('power',.5);note('Турель перегрелась! Уворачивайся, пока остывает')}}
  for(const b of A.buls){for(let s=0;s<3&&b.life>0;s++){b.x+=b.vx*dt/3;b.y+=b.vy*dt/3;for(const e of A.en){if(e.dead)continue;if(D2(b.x,b.y,e.x,e.y)<e.r+2){airHurtE(e,18);sfx('hit',.4);b.life=0;break}}}b.life-=dt}
  A.buls=A.buls.filter(b=>b.life>0&&b.x>-10&&b.x<W+10&&b.y>-10&&b.y<H+10);
  // ракеты Валеры
  A.rk-=dt;if(A.rk<=0&&free){let best=null,bh=0;for(const e of A.en){if(e.dead||e.y<0)continue;if(e.max>bh){bh=e.max;best=e}}if(best){A.rk=5.5;A.ms.push({x:A.px,y:A.py,a:-Math.PI/2,v:60,tg:best,life:3});sfx('power',.6);if(Math.random()<.4)note('Валера: «Ракета пошла!»')}else A.rk=1}
  for(const m of A.ms){m.life-=dt;m.v=Math.min(260,m.v+300*dt);if(m.tg&&!m.tg.dead){const ta=Math.atan2(m.tg.y-m.y,m.tg.x-m.x);m.a+=clamp(angDiff(ta,m.a),-5*dt,5*dt)}
    m.x+=Math.cos(m.a)*m.v*dt;m.y+=Math.sin(m.a)*m.v*dt;A.fx.push({x:m.x,y:m.y,vx:rnd(-5,5),vy:rnd(-5,5),life:.4,c:'#9a9aa0'});
    for(const e of A.en){if(e.dead)continue;if(D2(m.x,m.y,e.x,e.y)<e.r+4){m.life=0;sfx('boom',.6);C1.shake=Math.max(C1.shake,.4);for(const o of A.en)if(!o.dead&&D2(o.x,o.y,m.x,m.y)<28)airHurtE(o,o===e?90:45);for(let i=0;i<14;i++)A.fx.push({x:m.x,y:m.y,vx:rnd(-70,70),vy:rnd(-70,70),life:rnd(.2,.5),c:i%2?'#ff8a2a':'#ffd23a'});break}}}
  A.ms=A.ms.filter(m=>m.life>0);
  // волны
  if(!A.boss&&!A.end){A.spawnT-=dt;if(A.spawnT<=0){const p=A.t/A.dur;A.spawnT=rnd(1.6,2.4)-p*.8;const r=Math.random();
      if(r<.5){const x0=rnd(30,290),n=4+r4(3);for(let i=0;i<n;i++)airSpawn('crow',x0+rnd(-20,20),-10-i*8)}
      else if(r<.72){const side=Math.random()<.5;for(let i=0;i<5;i++)airSpawn('crow',side?-10-i*10:W+10+i*10,rnd(20,90),{side:side?1:-1})}
      else if(r<.9)airSpawn('glider',rnd(40,280),-14);else for(let i=0;i<3;i++)airSpawn('para',rnd(40,280),-10-i*14)}
    if(A.t>=A.dur){A.boss=airSpawn('big',160,-30,{nm:'ЛЕТУЧИЙ ГРОМИЛА'});note('Огромный! На дельтаплане!');say([['val','Это что за дельтаплан?!'],['s','Это не дельтаплан. Это ГРОМИЛА на дельтаплане.'],['val','Сбивай, иначе не сядем!']])}}
  // враги
  for(const e of A.en){if(e.dead)continue;e.t+=dt;if(e.fl>0)e.fl-=dt;
    if(e.k==='crow'){const ta=Math.atan2(A.py-e.y,A.px-e.x);e.a+=clamp(angDiff(ta,e.a),-2.4*dt,2.4*dt);e.x+=Math.cos(e.a)*e.sp*dt;e.y+=Math.sin(e.a)*e.sp*dt+Math.sin(e.t*9)*.3}
    else if(e.k==='glider'){e.y+=e.sp*dt;e.x+=Math.sin(e.t*.8)*30*dt;e.cd-=dt;if(e.cd<=0&&e.y>0){e.cd=rnd(1.8,2.6);const a=Math.atan2(A.py-e.y,A.px-e.x);A.eb.push({x:e.x,y:e.y+4,vx:Math.cos(a)*90,vy:Math.sin(a)*90,life:3,dmg:10})}}
    else if(e.k==='para'){e.y+=e.sp*dt;e.x+=Math.sin(e.t*2)*14*dt}
    else if(e.k==='big'){e.y+=(66-e.y)*dt*.8;e.x=160+Math.sin(e.t*.6)*110;e.cd-=dt;
      if(e.cd<=0){e.cd=e.hp<e.max*.5?1.8:2.4;const a0=Math.atan2(A.py-e.y,A.px-e.x);for(let i=-2;i<=2;i++){const a=a0+i*.22;A.eb.push({x:e.x,y:e.y+8,vx:Math.cos(a)*85,vy:Math.sin(a)*85,life:3,dmg:12})}sfx('swing',.6)}
      if(Math.random()<dt*.35)for(let i=0;i<4;i++)airSpawn('crow',e.x+rnd(-20,20),e.y+10)}
    const d=D2(e.x,e.y,A.px,A.py);if(d<e.r+9&&e.k!=='big'){airHit(e.k==='glider'?16:9);airHurtE(e,e.k==='glider'?40:99)}
    if(e.y>H+30||e.x<-60||e.x>W+60)e.dead=true}
  A.en=A.en.filter(e=>!e.dead);
  for(const b of A.eb){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(D2(b.x,b.y,A.px,A.py)<7){b.life=0;airHit(b.dmg)}}A.eb=A.eb.filter(b=>b.life>0);
  for(const p of A.fx){p.x+=p.vx*dt;p.y+=p.vy*dt+A.scroll*0;p.life-=dt}A.fx=A.fx.filter(p=>p.life>0);
  if(A.boss&&A.boss.dead&&!A.end){A.end=true;A.en.forEach(e=>e.dead=true);sfx('ring',1);
    say([['val','Чисто! Небо наше. Захожу на посадку.'],['m','Шмакодявка, ты сбила... я сбился со счёта.'],['s','Я тоже. Но было красиво.']],()=>after(1.2,()=>X.go(()=>playC8(CUT_MEET,startDrive,'meet'))))}
}
// фон: тучи → лес с берёзами → город → аэродром
function airBg(A){
  const t=A.t,sc=A.scroll,city=clamp((t-22)/6,0,1)*(1-clamp((t-58)/6,0,1)),air=clamp((t-60)/6,0,1);
  F(0,0,W,H,'#3a5a32');
  for(let y=-40;y<H+40;y+=40){const wy=Math.floor((sc-y)/40),yy=y+mod(sc,40);
    for(let x=0;x<W;x+=40){const h=hash(x>>3,wy);
      if(air>.5){F(x,yy,40,40,h<.5?'#6a8a4a':'#7a9a54')}
      else if(city>.5){F(x,yy,40,40,'#4a4a52');if(h<.7){F(x+3,yy+3,34,34,h<.25?'#6a6a7a':h<.5?'#7a6a5a':'#5a6a7a');F(x+5,yy+5,30,4,'rgba(255,255,255,.12)');if(h<.08){F(x+10,yy+10,20,20,'#2a3a5a');F(x+12,yy+12,16,16,'#8ab0d8')}}else F(x+4,yy+4,32,32,'#3a6a3a')}
      else{F(x,yy,40,40,h<.5?'#2e4a2a':'#345230');for(let i=0;i<3;i++){const bx=x+((h*97+i*13)|0)%36,by=yy+((h*53+i*17)|0)%36;F(bx,by,4,4,i%2?'#c8a838':'#4a7a3a');F(bx+1,by+3,1,2,'#e8e8e0')}}}}
  if(city>.5){for(let y=-80;y<H+80;y+=160){const yy=y+mod(sc,160);F(0,yy,W,10,'#2a2a30');F(150,yy-80,10,160,'#2a2a30')}if(t>36&&t<50){const yy=mod(sc*.0+(t-36)*60,400)-100;F(0,yy,W,22,'#2a6a9a');F(0,yy+3,W,3,'#4a8aba')}}
  if(air>.5){const yy=mod(sc,400)-200;F(110,-20,100,H+40,'#5a5a62');for(let y=-20;y<H+40;y+=24)F(158,y+mod(sc,24),4,12,'#f0f0f0');F(110,0,4,H,'#e8e8e8');F(206,0,4,H,'#e8e8e8');
    F(240,yy,70,40,'#c8c8d0');F(240,yy,70,6,'#3a7ac8');ctx.fillStyle='#1a1a2a';ctx.font='bold 5px monospace';ctx.fillText('КОЛЬЦОВО',248,yy+20)}
  // облака
  for(let i=0;i<8;i++){const x=(i*61)%W,y=mod(i*47+sc*1.8,H+80)-40;ctx.fillStyle=`rgba(230,230,240,${t<20?.55:.25})`;ctx.beginPath();ctx.ellipse(x,y,26,9,0,0,TAU);ctx.ellipse(x+14,y-4,16,7,0,0,TAU);ctx.fill()}
}
function airEnemyDraw(e){const x=Math.round(e.x),y=Math.round(e.y),f=e.fl>0;
  if(e.k==='crow'){const w=Math.sin(e.t*16)>0?3:1;F(x-2,y-2,4,4,f?'#fff':'#1a1a1e');F(x-6,y-1-w+2,4,1+w,'#2a2a30');F(x+2,y-1-w+2,4,1+w,'#2a2a30');F(x+1,y-1,1,1,'#ff3030');F(x-1,y+2,2,2,'#8aa47a')}
  else if(e.k==='glider'){F(x-12,y-4,24,4,f?'#fff':'#c83a6a');F(x-12,y-4,24,1,'#e85a8a');ctx.strokeStyle='#d8d8d8';ctx.beginPath();ctx.moveTo(x-10,y);ctx.lineTo(x,y+7);ctx.lineTo(x+10,y);ctx.stroke();F(x-2,y+6,4,5,'#3a5a8a');F(x-2,y+5,4,2,'#86a078');F(x,y+6,1,1,'#ff3030')}
  else if(e.k==='para'){F(x-7,y-10,14,4,f?'#fff':'#e8a020');F(x-7,y-10,14,1,'#ffd040');ctx.strokeStyle='#c8c8c8';ctx.beginPath();ctx.moveTo(x-6,y-6);ctx.lineTo(x,y);ctx.lineTo(x+6,y-6);ctx.stroke();F(x-2,y,4,5,'#4a4a3a');F(x-2,y-1,4,2,'#86a078')}
  else{F(x-28,y-6,56,6,f?'#fff':'#4a3a6a');F(x-28,y-6,56,2,'#6a5a8a');F(x-28,y,4,3,'#3a2a4a');F(x+24,y,4,3,'#3a2a4a');ctx.strokeStyle='#c8c8c8';ctx.beginPath();ctx.moveTo(x-20,y);ctx.lineTo(x,y+12);ctx.lineTo(x+20,y);ctx.stroke();
    F(x-6,y+8,12,12,'#2a2a34');F(x-5,y+6,10,6,'#86a078');F(x-3,y+8,2,1,'#ff2020');F(x+1,y+8,2,1,'#ff2020');F(x-9,y+10,3,6,'#86a078');F(x+6,y+10,3,6,'#86a078');
    ctx.font='bold 4px monospace';ctx.textAlign='center';ctx.fillStyle='#ffb060';ctx.fillText(e.nm||'',x,y-10);ctx.textAlign='left';F(x-20,y-16,40,2,'rgba(0,0,0,.6)');F(x-20,y-16,40*Math.max(0,e.hp)/e.max,2,'#c0202a')}}
function airRender(){airRender0();const A=AIR;if(!A||A.fuel==null)return;
  for(const t of A.tanks){F(t.x-3,t.y-5,6,9,'#c82a2a');F(t.x-2,t.y-4,4,2,'#ff8a8a');F(t.x-1,t.y-7,2,2,'#3a3a3a');F(t.x-4,t.y+4,8,1,'#5a1a1a')}
  if(A.storm>0){ctx.fillStyle=`rgba(10,12,30,${A.storm*.45})`;ctx.fillRect(0,0,W,H);ctx.strokeStyle=`rgba(160,170,220,${A.storm*.5})`;ctx.lineWidth=1;for(let i=0;i<24;i++){const x=(i*41+tm*70)%W,y=(i*67+tm*260)%H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-3,y+8);ctx.stroke()}}
  if(A.light>0){ctx.fillStyle=`rgba(230,235,255,${A.light*2.5})`;ctx.fillRect(0,0,W,H)}}
function airRender0(){
  const A=AIR;ctx.imageSmoothingEnabled=false;const sx=C1.shake>0?rnd(-3,3)*C1.shake:0,sy=C1.shake>0?rnd(-3,3)*C1.shake:0;
  ctx.save();ctx.translate(Math.round(sx),Math.round(sy));
  airBg(A);
  // тень самолёта
  ctx.globalAlpha=.25;ctx.drawImage(JET,A.px-18+14,A.py-20+18,36*.8,40*.8);ctx.globalAlpha=1;
  for(const e of A.en)airEnemyDraw(e);
  if(!(A.inv>0&&Math.floor(tm*16)%2===0)){ctx.drawImage(JET,Math.round(A.px-18),Math.round(A.py-20));const fl=2+Math.random()*3;F(A.px-4,A.py+18,3,fl,'#ffb040');F(A.px+1,A.py+18,3,fl,'#ffb040')}
  ctx.save();ctx.translate(Math.round(A.px),Math.round(A.py-2));ctx.rotate(A.ta);F(0,-1,10,2,'#2a2a30');F(-2,-2,4,4,'#f59cc8');if(A.flash>0)F(10,-2,3,4,'#fff6c0');ctx.restore();
  for(const b of A.buls){ctx.strokeStyle='#ffe27a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(b.x-b.vx*.02,b.y-b.vy*.02);ctx.lineTo(b.x,b.y);ctx.stroke()}
  for(const m of A.ms){ctx.save();ctx.translate(m.x,m.y);ctx.rotate(m.a);F(-4,-1,8,2,'#d8d8d8');F(-6,-1,2,2,'#ff8a2a');ctx.restore()}
  for(const b of A.eb){F(b.x-2,b.y-2,4,4,'#8ac040');F(b.x-1,b.y-1,2,2,'#d8ff8a')}
  for(const p of A.fx)F(p.x,p.y,p.c==='#9a9aa0'?2:1,p.c==='#9a9aa0'?2:1,p.c);
  ctx.restore();
}
function airUI(){airUI0();const A=AIR;if(!A||A.fuel==null)return;panel(W/2-34,4,68,9,.72);uiFont(3.8,true);u.fillStyle='#9a92b0';u.fillText('ТОПЛИВО',W/2-31,10);X.hudBar(W/2-2,6,34,4,A.fuel/100,A.fuel<25?(Math.sin(tm*10)>0?'#ff3a3a':'#8a1a1a'):'#ffd23a')}
function airUI0(){
  const k=ui.width/W;u.setTransform(1,0,0,1,0,0);u.clearRect(0,0,ui.width,ui.height);u.setTransform(k,0,0,k,0,0);
  const A=AIR;if(!A)return;const col='#6ad8ff';
  panel(4,4,116,30,.72);u.fillStyle=col;u.fillRect(4,4,2,30);
  uiFont(4.4,true);u.fillStyle='#9a92b0';u.fillText('ТУРЕЛЬ',9,10.5);X.hudBar(40,7,58,4,A.heat,A.oh>0?(Math.sin(tm*20)>0?'#ff3a3a':'#8a1a1a'):A.heat>.7?'#ff8a30':'#ffd23a');
  u.fillText('КОРПУС',9,19);X.hudBar(40,16,58,4,A.hp/100,A.hp<30?'#ff3a3a':'#3ef0b0');
  uiFont(4.4,false);u.fillStyle='#fff';u.fillText('Сбито: '+A.kills+'   ♥'+PS.lives,9,28);
  panel(W-112,4,108,20,.72);uiFont(4.2,true);u.fillStyle='#9a92b0';u.fillText(A.boss?'ЛЕТУЧИЙ ГРОМИЛА':'ДО КОЛЬЦОВО',W-108,10.5);
  X.hudBar(W-108,14,100,3,A.boss?Math.max(0,A.boss.hp)/A.boss.max:clamp(A.t/A.dur,0,1),A.boss?'#c0202a':col);
  if(A.banner>0&&!dlg){u.globalAlpha=Math.min(1,A.banner);panel(0,H/2-24,W,36,.6);u.textAlign='center';uiFont(11,true);u.fillStyle=col;u.fillText('ПОДЛЁТ К КОЛЬЦОВО',W/2,H/2-6);uiFont(5.5,false);u.fillStyle='#fff';u.fillText('Валера за штурвалом, Шмакодявка за турелью',W/2,H/2+4);
    uiFont(4.4,false);u.fillStyle='#9a92b0';u.fillText(touch.on?'Левый стик — манёвр, правый — турель':'WASD — манёвр, мышь — прицел, ЛКМ — огонь',W/2,H/2+12);u.textAlign='left';u.globalAlpha=1}
  if(mouse.on&&!touch.on&&!dlg){const x=mouse.x,y=mouse.y;u.strokeStyle='#f59cc8';u.lineWidth=.6;u.beginPath();u.arc(x,y,3,0,TAU);u.moveTo(x-6,y);u.lineTo(x-4,y);u.moveTo(x+4,y);u.lineTo(x+6,y);u.stroke()}
  if(C1.over){panel(0,H/2-20,W,34,.85);u.textAlign='center';uiFont(10,true);u.fillStyle='#ff3a3a';u.fillText('ИСТРЕБИТЕЛЬ ПОДБИТ',W/2,H/2-4);uiFont(5,false);u.fillStyle='#fff';u.fillText(touch.on?'Коснись — ещё раз':'E — ещё раз',W/2,H/2+7);u.textAlign='left'}
  if(toast){u.globalAlpha=Math.min(1,toast.life*2);uiFont(5.5,true);const w=u.measureText(toast.t).width+12;panel(W/2-w/2,H-42,w,11,.85);u.fillStyle='#fff';u.textAlign='center';u.fillText(toast.t,W/2,H-34.6);u.textAlign='left';u.globalAlpha=1}
  renderDlg();if(touch.on&&state==='play')touchUI();
}
const _u8=update,_r8=render,_a8=action;
update=function(dt){
  if(C1.on&&C1.mode==='c8air'){
    tm+=dt;for(const t of timers)t.t-=dt;const due=timers.filter(t=>t.t<=0);timers=timers.filter(t=>t.t>0);due.forEach(t=>t.fn());
    if(toast){toast.life-=dt;if(toast.life<=0)toast=null}
    if(dlg){const Ln=dlg.lines[dlg.i];dlg.shown=Math.min(Ln.t.length,dlg.shown+dt*48)}
    updateMusic(dt);if(tr){tr.t+=dt;if(!tr.done&&tr.t>=.5){tr.done=true;tr.fn()}if(tr&&tr.t>=1)tr=null}
    if(!(C1.on&&C1.mode==='c8air'))return;if(C1.over){C1.over.t+=dt;return}if(cut){updateCut(dt);return}
    if(AIR)airUpdate(dt);return}
  _u8(dt);
};
render=function(){if(C1.on&&state==='play'&&!cut&&C1.mode==='c8air'&&AIR){airRender();trFade();airUI();return}_r8()};
action=function(){if(C1.on&&C1.mode==='c8air'){if(C1.over){if(C1.over.t>.6){const f=C1.retry;C1.over=null;if(f)transition(f)}return}if(dlg){advance();return}return}return _a8()};

// ================= ЧЁРНОЕ ПОЛО ПО НОЧНОМУ ЕКБ =================
const DW=480,DH=3600;
function startDrive(){
  C8.on=true;C8.sec='drive';mz8('drive');
  K.car(C8,{id:'drive8',w:DW,h:DH,startX:240,startY:DH-140,route:'КОЛЬЦОВО → ПЛОТИНКА',title:'ЧЁРНОЕ ПОЛО RS',sub:'Великий за рулём, Шмакодявка и Сатурналия стреляют из окон',hudCol:'#c81a2a',vmax:125,
    gun:{name:'ДВА СТВОЛА',cd:.08,dmg:18,sp:440,snd:'shot',heat:.03,ohNote:'Перезаряжаемся! Великий, жми!'},armorTxt:'ПОЛО ЗАРЯЖЕННОЕ — НЕ ДОСТАНУТ',
    build(L){B(0,0,DW,DH,'#1a2a1a');E.gfill(0,0,DW,DH,1);E.gfill(110,0,370,DH,0);
      for(let y=0;y<DH;y+=4)for(let x=110;x<370;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,h<.1?'#3a3a40':h>.93?'#2a2a30':'#34343a')}
      for(let y=0;y<DH;y+=40)B(239,y,2,20,'#e8e8e0');B(112,0,2,DH,'#c8c8c0');B(366,0,2,DH,'#c8c8c0');
      for(let y=0;y<DH;y+=4){for(let x=0;x<110;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,y<DH*.55?(h<.2?'#4a4a52':'#3e3e46'):(h<.15?'#2a4a2a':'#24402a'))}for(let x=370;x<DW;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,y<DH*.55?(h<.2?'#4a4a52':'#3e3e46'):(h<.15?'#2a4a2a':'#24402a'))}}
      // берёзы за городом, дома в городе
      for(let y=DH*.55;y<DH;y+=34){for(const x of [30+((y*7)%40),430-((y*5)%40)]){B(x-1,y-2,3,5,'#e8e8e0');(Q.crowns||(Q.crowns=[])).push([x,y,8,hash(x,y)>.5?'#b89a30':'#6a8a3a'])}}
      for(let y=60;y<DH*.55;y+=90){for(const x0 of [6,374]){const c=['#5a5a6a','#6a5a5a','#4a5a6a'][(y/90|0)%3];B(x0,y,100,70,c);B(x0,y,100,3,shade(c,1.3));for(let wy=y+8;wy<y+64;wy+=10)for(let wx=x0+6;wx<x0+96;wx+=10)B(wx,wy,5,5,hash(wx,wy)>.6?'#ffd27a':'#20283a')}}
      // стела у въезда и подписи
      B(380,DH*.55,30,8,'#c8c8d0');K.txt(395,DH*.55-2,'ЕКАТЕРИНБУРГ','#ffffff',5);K.txt(240,DH-60,'КОЛЬЦОВО','#6ad8ff',8);K.txt(240,160,'ПЛОТИНКА','#6ad8ff',8);K.txt(240,DH*.3,'ул. 8 МАРТА','#c8c8c0',5);
      for(let y=100;y<DH;y+=120){L.lights.push([114,y,60,.75],[366,y,60,.75]);B(112,y-1,4,3,'#2a2a2a');B(364,y-1,4,3,'#2a2a2a')}
      let s=19;const rr=()=>{s=(s*16807)%2147483647;return s/2147483647};
      for(let y=DH-400;y>400;y-=110+rr()*90){const x=rr()<.5?130+rr()*60:280+rr()*60;X.carTop(x|0,y|0,['#e8e8e8','#3a8ae8','#2a2a2a','#c8302a','#e8c040'][(rr()*5)|0],true);if(rr()<.2)Q.fires.push([x+8,y+14])}
      for(let y=DH-500;y>300;y-=30+rr()*30){const n=1+(rr()*2.6|0);for(let i=0;i<n;i++){const x=125+rr()*230,r=rr();if(K.solid(x,y,6))continue;
        if(r<.6)Zc(x,y,{hp:60,max:60});else if(r<.85)Zf(x,y);else Zg(x,y,{hp:300,max:300,nm:null})}}
      for(let y=700;y<DH;y+=650)for(let i=0;i<10;i++)Zc(130+rr()*220,y+rr()*60,{hp:60,max:60});
      L.dark=.5;L.tint='6,8,30'},
    draw(x,y,a,ta,fl){drawPolo(x,y,a);
      ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(ta);F(2,-1,10,2,'#26262a');if(fl)F(12,-2,3,4,'#fff6c0');ctx.restore();
      ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(ta+.25);F(0,2,9,2,'#1a1a1c');ctx.restore()},
    tick(c,dt){},
    prog:c=>(c.start-c.y)/(c.start-200),fin:c=>c.y<200,
    onFin(k){C8.driveK=k;X.go(()=>playC8(cutHop(1),()=>sec8('stop1'),'drive'))}});
  after(.8,()=>say([['vel','Пристегнитесь. Поло заряженное, двести лошадей.'],['sat','Он его любит больше, чем меня.'],['vel','Неправда. Одинаково.'],['s','Стреляю из окна — веди ровно!']]));
}

// ================= КАТ-СЦЕНЫ =================
const SS=K.SKY_SUN,SD=K.SKY_DUSK,SN=['#060814','#0a0c1c','#0e1024','#12142c','#161834','#1a1c3a','#1e2040','#222446','#26284a','#2a2c4e'];
// Ханжа сбоку
function sideHanzha(x,y,t){F(x,y-22,8,22,'#4a5a32');F(x+1,y-30,7,8,'#efc5a5');F(x,y-32,9,3,'#8a6748');F(x+5,y-27,1,1,'#2a1e18');
  const k=Math.round(Math.sin(t*12)*1);F(x+14,y-6+k,8,5,'#f4f0e8');F(x+20,y-8+k,4,4,'#f4f0e8');F(x+22,y-7+k,1,1,'#1a1a1a');F(x+12,y-8+k,3,3,'#f4f0e8')} // шпиц
// Великий и Сатурналия сбоку
function legsS(x,y,t,mode,c,shoe,h){const s=mode==='walk'?Math.round(Math.sin(t*10)*1.5):0;h=h||8;F(x-3+s,y-h-2,3,h,c);F(x-s,y-h-2,3,h,c);F(x-4+s,y-3,5,3,shoe);F(x-1-s,y-3,5,3,shoe)}
function sideVel(x,y,t,mode,o){o=o||{};const SK='#eec6aa',HR='#3a2a20';legsS(x,y,t,mode,'#1e2030','#141418',8);
  const ty=y-10;F(x-4,ty-12,8,12,'#55565c');F(x-4,ty-12,2,12,'#46474c');F(x-1,ty-12,3,3,'#5a3a7a');F(x+3,ty-12,2,4,'#1a1a1e');
  if(o.gun){F(x+3,ty-10,6,2,'#55565c');F(x+8,ty-11,8,2,'#c8ccd4');F(x+8,ty-11,3,3,'#8a8e96')}else if(o.bucket){F(x+3,ty-10,2,8,'#55565c');F(x+3,ty-3,6,6,'#d8d8d0');F(x+4,ty-2,4,1,'#8a8a8a')}else F(x+3,ty-11,2,9,'#55565c');
  const hy=ty-19;F(x-3,hy,7,7,SK);F(x-4,hy-3,9,4,HR);F(x-3,hy-4,2,2,'#4a3428');F(x+1,hy-5,2,2,HR);F(x+3,hy-4,2,2,'#4a3428');F(x-4,hy,2,4,HR);
  F(x+1,hy+2,5,2,'#1a1a1a');F(x+2,hy+2,1,1,'rgba(220,230,240,.6)');F(x+4,hy+2,1,1,'rgba(220,230,240,.6)');F(x,hy+5,5,2,'#8a6448')}
function sideSat(x,y,t,mode,o){o=o||{};const SK='#f4d2bc',HR='#6a4430';legsS(x,y,t,mode,'#1a1a22','#0e0e12',8);
  const ty=y-10;F(x-4,ty-11,8,11,'#1e1e24');F(x-4,ty-11,2,11,'#141418');
  if(o.gun){F(x+3,ty-10,6,2,'#1e1e24');F(x+8,ty-11,6,2,'#1a1a1c');F(x+8,ty-9,6,2,'#1a1a1c')}else F(x+2,ty-10,2,8,'#1e1e24');
  const hy=ty-18;F(x-3,hy,7,7,SK);F(x-4,hy-2,8,3,HR);F(x-6,hy-1,4,14,HR);F(x-5,hy,1,12,'#8a5a3e');F(x+3,hy,2,8,HR);F(x+2,hy+3,1,1,'#2a1e18');F(x+2,hy+5,2,1,'#e0707e')}
// истребитель сбоку (смотрит вправо)
function jetSide(x,y,t,o){o=o||{};ctx.save();ctx.translate(Math.round(x),Math.round(y));if(o.tilt)ctx.rotate(o.tilt);
  const poly=(pts,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))ctx.lineTo(p[0],p[1]);ctx.closePath();ctx.fill()};
  poly([[-42,-18],[-30,-18],[-20,-5],[-42,-5]],'#7a828c');poly([[-40,-16],[-32,-16],[-26,-8],[-40,-8]],'#8a929c');F(-38,-14,4,3,'#c82a2a');F(-33,-14,2,3,'#e8e8e8'); // киль
  poly([[-44,-5],[26,-6],[46,0],[26,5],[-44,4]],'#8a929c');poly([[-44,-5],[26,-6],[46,0],[-44,-2]],'#a4acb6');F(-44,2,70,2,'#6a727c'); // фюзеляж с носом
  poly([[4,-6],[10,-12],[22,-11],[28,-6]],'#2a3a50');poly([[8,-7],[12,-11],[18,-10],[20,-7]],'#8ab0d8'); // фонарь кабины
  if(o.pilots){F(12,-10,2,3,'#5a3a22');F(16,-10,2,3,'#2c1a1f');F(19,-9,2,2,'#3a2a20')}
  poly([[-20,2],[8,2],[-4,10],[-26,10]],'#6a727c');F(-24,8,6,2,'#c82a2a'); // крыло
  F(-48,-4,5,7,'#3a3a42');if(o.burn){const k=8+Math.random()*10;poly([[-48,-3],[-48-k,0],[-48,3]],'#ffb040');poly([[-48,-1.5],[-48-k*.6,0],[-48,1.5]],'#fff6c0')}
  F(-12,4,2,8,'#3a3a42');F(22,4,2,8,'#3a3a42');F(-13,11,4,3,'#1a1a1a');F(21,11,4,3,'#1a1a1a');
  ctx.fillStyle='#c82a2a';ctx.font='bold 4px monospace';ctx.fillText('ВАЛЕРА-2',-22,1);ctx.restore()}
function poloSide(x,y,t,o){o=o||{};ctx.save();if(o.left){ctx.translate(2*x+50,0);ctx.scale(-1,1)}const bob=o.move?Math.round(Math.sin(t*22)*.6):0;y+=bob;
  F(x,y-16,50,9,'#141418');F(x,y-16,50,1,'#3a3a44');F(x+8,y-24,28,8,'#141418');F(x+10,y-22,11,5,'#1c2430');F(x+23,y-22,11,5,'#1c2430');F(x+36,y-20,10,4,'#141418');
  F(x,y-12,50,1,'#c81a2a');F(x+46,y-15,4,3,'#fff6c0');F(x,y-15,2,3,'#ff2a2a');ctx.fillStyle='#c81a2a';ctx.font='bold 3px monospace';ctx.fillText('RS',x+40,y-9);
  for(const wx of [5,35]){F(x+wx,y-9,10,9,'#050506');F(x+wx+3,y-6,4,3,'#8a8e96')}
  if(o.heads)for(const [hx,c] of o.heads)F(x+hx,y-23,4,4,c);if(o.lights){ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,x+70,y-12,30,'rgba(255,240,180,A)',.35);ctx.restore()}
  ctx.restore()}
// Екатеринбург вдали: высотки, Исеть
function ekbSky(t,night){K.skyG(night?SN:SD,0,120);if(night)for(let i=0;i<40;i++)F((i*53)%W,(i*29)%70,1,1,'#c8c8ff');
  const tw=[[40,40,22],[70,60,16],[110,30,26],[150,70,18],[200,8,20],[226,50,16],[260,36,22],[290,64,18]];
  for(const [x,h0,w] of tw){const h=120-h0;F(x,h0,w,h,night?'#1a2238':'#4a5a7a');for(let y=h0+4;y<118;y+=6)for(let xx=x+3;xx<x+w-2;xx+=5)F(xx,y,2,3,hash(xx,y)>.55?'#ffd27a':night?'#2a3450':'#6a7a9a')}
  F(200,4,20,4,night?'#2a3a5a':'#6a8ab8');F(209,0,2,6,'#c8c8d0');F(0,118,W,4,night?'#1a3a5a':'#3a6a9a')}
function koltsovo(t){K.skyG(SD,0,120);F(0,110,W,70,'#4a4a52');for(let x=0;x<W;x+=30)F(x-mod(t*0,30),140,16,2,'#e8e8e0');
  F(60,50,200,60,'#c8ccd4');F(60,50,200,6,'#3a7ac8');for(let x=66;x<254;x+=12)F(x,62,8,40,'#7a9ab8');ctx.fillStyle='#1a2a4a';ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.fillText('КОЛЬЦОВО',160,48);ctx.textAlign='left'}
function yardRunway(t){K.skyG(SS,0,110);F(0,40,W,70,'#8a3a2a');for(let x=4;x<W;x+=30)for(let y=48;y<104;y+=12)F(x,y,6,6,'#2a3a5a');F(0,106,W,74,'#5a5652');F(0,124,W,30,'#3a3a40');for(let x=0;x<W;x+=24)F(x+4,138,12,2,'#f0f0f0');
  ctx.fillStyle='#ffd23a';ctx.font='bold 4px monospace';ctx.fillText('ВПП «ХАНЖА-1»',8,132)}
function sandsGate(t){K.skyG(['#6a8ac8','#7a98cc','#8aa6d0','#9ab2d2','#aabed4','#bac8d4','#cad0d2','#d8d4cc','#e4d4c0','#ecd2b0'],0,120);F(0,110,W,70,'#d8c08a');
  F(70,40,180,72,'#c8a070');F(70,40,180,4,'#e0c090');for(let x=80;x<240;x+=24){F(x,56,14,20,'#8a6a42');ctx.fillStyle='#c8a070';ctx.beginPath();ctx.arc(x+7,56,7,Math.PI,0);ctx.fill()}
  F(140,80,40,32,'#3a2a1a');ctx.fillStyle='#e0c090';ctx.beginPath();ctx.arc(160,80,20,Math.PI,0);ctx.fill();ctx.fillStyle='#3a2a1a';ctx.beginPath();ctx.arc(160,82,17,Math.PI,0);ctx.fill();
  ctx.fillStyle='#7a3a1a';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText('ПЕСКИ',160,36);ctx.textAlign='left';
  for(const x of [40,280]){F(x,70,4,42,'#7a5a32');for(let k=0;k<5;k++){const a=-2.6+k*.55;ctx.strokeStyle='#4a8a3a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+2,70);ctx.quadraticCurveTo(x+2+Math.cos(a)*10,64+Math.sin(a)*4,x+2+Math.cos(a)*18,72+Math.sin(a)*12);ctx.stroke()}}}
// Барханыч: портрет
function pBarkh(g,open,blink){face(g,{sk:'#a0b48c',eye:'#ff2020',white:'#3a0a0a',brow:'#1a1a1a',lip:'#5a3a3a',hw:15,hh:16,
  body(g){ell(g,32,76,36,22,'#9a8458');for(let i=0;i<30;i++)P(g,4+((i*7)%56),52+((i*5)%14),4,3,i%2?'#6a5a3a':'#7a6a40');P(g,4,50,56,6,'#4a5a3a');P(g,4,50,56,2,'#6a7a52')},
  hair(g){ell(g,32,26,16,19,'#18181c',(x,y)=>y<27||y>36);P(g,17,27,30,9,'#18181c');P(g,19,28,26,6,'#a0b48c')},
  extra(g,open){P(g,40,44,4,3,'#6a1a1a');P(g,14,24,36,2,'#2a2a2e')}},open,blink)}
Object.assign(PORTRAIT,{bh:pBarkh});PCV.bh=mk(64);Object.assign(NAME,{bh:'КОМАНДИР БАРХАНЫЧ'});Object.assign(NCOL,{bh:'#ffb060'});Object.assign(BG,{bh:['#2a1e0a','#ffb060']});

const CUT_RUNWAY=[
  {dur:1,lines:[['H','Шмакодявка! Микроб! Принимайте работу. Полоса — семьсот метров, сама размечала.'],['s','Тётушка Ханжа... это вы построили?'],['H','А кто ещё? Михалыч асфальт катал, дворник разметку красил. Я руководила.'],
    ['m','А истребитель откуда?'],['H','Не спрашивай. Списанный. Почти.'],['val','Я его неделю чинил. Сиденье одно, но если поджаться — влезем втроём.']],draw(t){
    yardRunway(t);jetSide(210,128,t,{});sideHanzha(40,170,t);K.sideValera(80,170,t,'stand');sideMikrob(110,170,t,'stand');K.sideShmak(132,170,t,'stand',true)}},
  {dur:4.5,subs:[[.2,2.2,'val','Держитесь. Форсаж.'],[2.4,4.3,'H','Пармезан не привезёте — так хоть пельменей!']],draw(t){
    yardRunway(t);const k=clamp((t-1)/3,0,1);jetSide(120+k*k*260,128-Math.max(0,k-.5)*80,t,{burn:true,pilots:1,tilt:-Math.max(0,k-.5)*.4});sideHanzha(40,170,t);C1.shake=0}},
  {dur:5,subs:[[.2,2.4,'m','Два часа до Екатеринбурга.'],[2.6,4.8,'s','Великий и Сатурналия держатся в аэропорту. Летим, ребята.']],draw(t){
    K.skyG(SD,0,H);for(let i=0;i<12;i++){const x=mod(i*50-t*80,W+60)-30;ctx.fillStyle='rgba(255,230,220,.55)';ctx.beginPath();ctx.ellipse(x,130+(i%3)*10,30,7,0,0,TAU);ctx.fill()}K.sun(260,60,10);jetSide(150,70+Math.sin(t*2)*3,t,{burn:true,pilots:1})}},
];
const CUT_MEET=[
  {dur:1,lines:[['vel','Ребята! Вы на истребителе прилетели. Это даже для меня перебор.'],['sat','Шмакодявка!!! Микроб!!! Живые!'],['s','Катя! Обнимашки потом — сначала скажи, что тут у вас.'],
    ['sat','Город почти весь их. Мы три дня сидели в бизнес-зале. Ели орешки.'],['m','Тогда валим отсюда. Куда-нибудь, где безопасно.']],draw(t){
    koltsovo(t);jetSide(250,128,t,{});sideVel(100,170,t,'stand',{gun:true});sideSat(122,170,t,'stand',{gun:true});K.sideShmak(160,170,t,'stand',true);sideMikrob(182,170,t,'stand')}},
  {dur:1,lines:[['vel','Безопасно — это хорошо. Но сначала мне надо закрыть задачу по работе.'],['m','...Что?'],['vel','Зомби зомби, а дедлайн никто не отменял. Сегодня ночью — расклейка рекламы. Три остановки.'],
    ['s','Какого зуя?! Ты же юрист! И HR! Ты зарабатываешь кучу денег!'],['vel','Днём — юрист. Днём — HR. А ночью я на тачке клею рекламу. Это для души.'],['sat','Он серьёзно. Он так каждую ночь. Даже в апокалипсис.'],
    ['m','...Ладно. Мы с тобой клеим, девочки прикрывают.'],['s','Значит так: сегодня командую я. Катя — со мной, стреляем. Мальчики — клеят.'],['sat','Обожаю этот план.'],['val','А я посторожу самолёт. И поиграю в катку, пока вы там.']],draw(t){
    koltsovo(t);sideVel(100,170,t,'stand',{bucket:true});sideSat(122,170,t,'stand');K.sideShmak(160,170,t,'stand',true);sideMikrob(182,170,t,'stand');K.sideValera(230,170,t,'stand')}},
  {dur:4.5,subs:[[.2,2.2,'vel','Знакомьтесь: чёрное Поло RS. Заряженное.'],[2.4,4.3,'sat','Только не трогай магнитолу. Он на ней рэп про налоги слушает.']],draw(t){
    koltsovo(t);poloSide(130,166,t,{lights:true});sideVel(110,170,t,'stand',{bucket:true});sideSat(196,170,t,'stand')}},
];
const HOP=[null,null,['ЕЛЬЦИН ЦЕНТР','Следующая точка — Ельцин-центр. Там всегда людно. Сейчас — мёртво людно.','Держитесь, срежу через набережную.'],['УЛИЦА ВАЙНЕРА','Вайнера. Пешеходка. Машину бросим у края.','Последний лист — и задача закрыта.']];
function cutHop(n){const h=HOP[n];if(!h)return[{dur:4.2,subs:[[.2,2,'vel','Плотинка. Первая точка.'],[2.2,4,'m','Ведро, кисть, рулон. Поехали.']],draw(t){ekbSky(t,true);F(0,120,W,60,'#24242a');for(let x=0;x<W;x+=30)F(x-mod(t*120,30),146,16,1,'#6a6a72');poloSide(100,168,t,{move:true,lights:true,heads:[[12,'#3a2a20'],[24,'#2c1a1f'],[30,'#6a4430']]})}}];
  return[{dur:4.6,subs:[[.2,2.3,'vel',h[1]],[2.5,4.4,'sat',h[2]]],draw(t){ekbSky(t,true);F(0,120,W,60,'#24242a');for(let x=0;x<W;x+=30)F(x-mod(t*120,30),146,16,1,'#6a6a72');
    poloSide(100,168,t,{move:true,lights:true,heads:[[12,'#3a2a20'],[24,'#2c1a1f'],[30,'#6a4430']]});ctx.fillStyle='#ffd23a';ctx.font='bold 7px monospace';ctx.textAlign='center';ctx.fillText(h[0],W/2,24);ctx.textAlign='left'}}]}
const CUT_GATE=[
  {dur:1,lines:[['sat','Вот. В прошлом году у нас построили «Пески». Арена для турниров по стрельбе. Песок завезли настоящий.'],['s','Подожди... это же почти как карта из шутера.'],['sat','Почти! Своя планировка: рынок, водокачка, площадь с часами, цистерна. Две точки, A и B.'],
    ['vel','А теперь там засели зомби в балаклавах. Говорят, с бомбами. Пока они там — Екб не чистый.'],['m','Я посторожу Поло. И отвечу на рабочие письма Великого.'],['vel','Только не подписывай ничего.'],['s','Катя, Великий — со мной. Зачищаем «Пески».']],draw(t){
    sandsGate(t);poloSide(20,170,t,{});sideMikrob(84,170,t,'stand');K.sideShmak(150,170,t,'stand',true);sideSat(172,170,t,'stand',{gun:true});sideVel(196,170,t,'stand',{gun:true})}},
];
function ekbMap(t){F(0,0,W,180,'#0a0e18');
  const Z=[[40,24,110,30,'#2a9a5a','ЕКАТЕРИНБУРГ','СВОБОДЕН ✓','#3ef0b0'],[170,24,110,30,'#c8a02a','ПЕТЕРБУРГ','ВСЁ ЛУЧШЕ','#ffd23a']];
  for(const [x,y,w,h,c,n,st,sc] of Z){ctx.fillStyle=c;ctx.globalAlpha=.3+.2*Math.sin(t*4);ctx.fillRect(x,y,w,h);ctx.globalAlpha=1;ctx.strokeStyle=c;ctx.strokeRect(x+.5,y+.5,w-1,h-1);
    ctx.fillStyle='#fff';ctx.font='bold 6px monospace';ctx.fillText(n,x+4,y+10);ctx.fillStyle=sc;ctx.font='bold 5px monospace';ctx.fillText(st,x+4,y+h-4)}
  ctx.strokeStyle='rgba(255,255,255,.4)';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(150,40);ctx.lineTo(170,40);ctx.stroke();ctx.setLineDash([]);
  const x=mod(t*30,140)+150;F(x-3,70,6,2,'#c8ccd4')}
const CUT_END8=[
  {dur:1,lines:[['vel','Протокол: «Пески» очищены. Бомбы обезврежены. Командир... уволен.'],['sat','Шмакодявка, бери РПГ. Ракеты мощные, но их мало. Береги.'],['s','Мой первый гранатомёт. Даже не знаю, плакать или радоваться.'],
    ['m','Задачу по работе Великий закрыл. Город Сатурналия зачистила. А мы — просто туристы.']],draw(t){
    sandsGate(t);K.sideShmak(120,170,t,'stand',true);F(126,146,18,3,'#4a5a3a');F(142,145,4,5,'#3a3a32');sideSat(142,170,t,'stand',{gun:true});sideVel(166,170,t,'stand',{gun:true});sideMikrob(96,170,t,'stand')}},
  {dur:1,lines:[['r','Новости Урала. Екатеринбург свободен. Последний очаг — арена «Пески» — зачищен этой ночью.'],['r','Очевидцы рассказывают про девушку в розовом с дробовиком, девушку с двумя пистолетами и мужчину, который клеил рекламу под обстрелом.'],
    ['r','А в Петербурге тоже легче: северные районы почти чисты, к выходным откроют мосты.']],draw(t){ekbMap(t);K.newsBar('ЕКАТЕРИНБУРГ СВОБОДЕН',true,'УРАЛ 24')}},
  {dur:1,lines:[['sat','Ребята... можно честно? Нам надоело тут жить.'],['vel','Хотим поближе к вам. Я уже посмотрел объявления. Квартира рядом с вашей — продаётся.'],['m','Соседняя?! Через стенку от гостиной?'],
    ['vel','Двушка. Спальня, кухня и гостиная, где мы сделаем игровую. Сделку проведу сам. Я же юрист.'],['s','То есть мы будем соседями?!'],['sat','И каждый вечер — катка. Шмакодявка, ты обещала.'],['val','Я всех довезу. Если влезете. Вшестером. В истребитель.']],draw(t){
    koltsovo(t);jetSide(250,128,t,{});sideMikrob(70,170,t,'stand');K.sideShmak(92,170,t,'stand');sideSat(120,170,t,'stand');sideVel(142,170,t,'stand');K.sideValera(220,170,t,'stand')}},
  {dur:5,subs:[[.2,2.4,'val','Курс на Питер. Не трогайте красную кнопку.'],[2.6,4.8,'vel','А что она делает? ...Понял. Не трогаю.']],draw(t){
    K.skyG(SD,0,H);for(let i=0;i<12;i++){const x=mod(i*50-t*80,W+60)-30;ctx.fillStyle='rgba(255,230,220,.55)';ctx.beginPath();ctx.ellipse(x,130+(i%3)*10,30,7,0,0,TAU);ctx.fill()}K.sun(60,90,12);jetSide(160,70+Math.sin(t*2)*3,t,{burn:true,pilots:1})}},
];

// ================= КВАРТИРА СОСЕДЕЙ: Великий и Сатурналия =================
function sosediOpen(){try{return C8.done||(S.step>=12&&localStorage.getItem('pp_sosedi')==='1')}catch(e){return C8.done}}
function lvSosedi(){
  const L=E.mkLevel('sosedi8',420,260);B(0,0,420,260,'#1a1620');
  const tiles=(x0,y0,x1,y1,a,b)=>{E.gfill(x0,y0,x1,y1,0);for(let y=y0;y<y1;y+=4)for(let x=x0;x<x1;x+=4){const h=hash(x>>2,y>>2);B(x,y,Math.min(4,x1-x),Math.min(4,y1-y),((x>>3)+(y>>3))%2?a:b);if(h<.06)B(x,y,2,2,shade(a,.85))}};
  K.floor(20,100,80,180,'tile');K.floor(84,20,276,240,'parq');K.floor(280,20,400,120,'parq');tiles(280,124,400,240,'#c8c4bc','#d8d4cc');
  E.gfill(80,140,84,170,0);E.gfill(276,60,280,90,0);E.gfill(276,170,280,200,0); // проходы
  // игровая: длинный стол с двумя компами у окна
  for(let x=96;x<264;x+=40)B(x,12,32,8,'#2a3a5a');
  X.lowBox(100,24,140,12,'#e8e8ec','#ffffff');
  B(118,25,22,9,'#0a0a0e');B(119,26,20,7,'#3a2a6a');B(166,25,22,9,'#0a0a0e');B(167,26,20,7,'#6a2a3a');
  X.lowBox(104,26,8,10,'#1a1a1e','#ff4fd8');X.lowBox(226,26,8,10,'#1a1a1e','#3ef0b0');
  // картина «собаки играют в покер» и абстракция
  B(84,60,3,26,'#c83a3a');
  X.lowBox(110,206,110,20,'#7a7270','#9a9290'); // серый диван
  for(let y=110;y<190;y+=4)for(let x=120;x<220;x+=4){const k=((x-120)>>4)+((y-110)>>4);B(x,y,4,4,['#c83a5a','#e8a040','#3a8ac8','#5ac88a'][k%4])}B(120,110,100,2,'#f4f0e8');B(120,188,100,2,'#f4f0e8'); // яркий ковёр
  for(const [x,y] of [[96,120],[96,180]]){L.bx.fillStyle='#6a3a9a';L.bx.beginPath();L.bx.arc(x,y,8,0,TAU);L.bx.fill();L.bx.fillStyle='#8a5ac0';L.bx.beginPath();L.bx.arc(x-2,y-2,5,0,TAU);L.bx.fill();E.gfill(x-6,y-6,x+6,y+6,2)} // кресла-мешки
  for(const [x,y] of [[262,36],[262,226],[96,226]]){B(x-4,y-4,8,8,'#6a4a2a');(Q.crowns||(Q.crowns=[])).push([x,y,7,'#3a8a4a'])}
  B(84,20,192,2,'rgba(60,240,150,.8)');B(84,238,192,2,'rgba(60,240,150,.8)');B(84,20,2,220,'rgba(60,240,150,.8)');B(274,20,2,220,'rgba(60,240,150,.8)'); // LED-лента
  B(226,240,48,18,'#3a2a1a');B(228,242,44,14,'#1a4a2a');for(let i=0;i<4;i++){B(233+i*10,245,6,8,'#8a6a42');B(234+i*10,244,4,3,'#a8845a')}B(244,250,12,3,'#e8e8e8'); // картина: собаки играют в покер
  B(244,60,30,44,'#e8e8ec');for(let y=64;y<100;y+=8)B(246,y,26,2,'#c8c8d0'); // белый стеллаж
  X.lowBox(230,150,30,30,'#3a2a2a','#5a4a3a'); // журнальный стол
  // спальня
  X.lowBox(330,30,60,44,'#e8e0f0','#ffffff');B(334,34,52,10,'#c8b8d8');X.lowBox(290,30,20,14,'#6a4a2a','#8a6a40');
  // кухня
  X.lowBox(380,130,16,100,'#d8d8d8','#f0f0f0');for(const y of [140,160])B(384,y,8,8,'#2a2a2a');X.lowBox(310,170,40,26,'#8a6a40','#a88a5a');for(const [x,y] of [[302,183],[358,183]])X.lowBox(x-4,y-4,8,8,'#5a4a3a','#7a6a50');
  // дверь к нам
  B(20,132,4,30,'#c89a5a');B(22,146,2,2,'#2a2a2a');K.txt(50,96,'ПРИХОЖАЯ','#8a8a92',4);K.txt(180,236,'ИГРОВАЯ','#6a5a8a',4);K.txt(340,116,'СПАЛЬНЯ','#8a7a9a',4);K.txt(340,236,'КУХНЯ','#8a8a8a',4);
  L.dark=.25;L.tint='20,0,40';L.lights.push([140,40,70,.9],[180,60,90,.7],[340,60,60,.7],[340,180,60,.7],[50,140,40,.6]);
  X.buildNav();
  pl.x=36;pl.y=148;pl.a=0;pl.ma=0;L.armed=false;
  const vel={x:129,y:46,a:-Math.PI/2},sat={x:177,y:46,a:-Math.PI/2};
  L.npcs.push({draw(){shadowBlob(vel.x,vel.y,6);topVel(cvVel.getContext('2d'),null,0);spr(cvVel,vel.x,vel.y,vel.a)}});
  L.npcs.push({draw(){shadowBlob(sat.x,sat.y,6);topSat(cvSat.getContext('2d'),Math.sin(tm*14)>.6?1:0);spr(cvSat,sat.x,sat.y,sat.a)}});
  L.obj=()=>['Гости у соседей','Выход — дверь в прихожей слева'];
  const wrap=L.drawUnder;L.drawUnder=()=>{if(wrap)wrap();
    for(const [x,c] of [[119,'#6ad8ff'],[167,'#ff7ac8']]){ctx.fillStyle=c;ctx.globalAlpha=.4+.3*Math.sin(tm*9+x);ctx.fillRect(x+2,27,16,5);ctx.globalAlpha=1}
    ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,150,30,60,'rgba(255,79,216,A)',.15+.05*Math.sin(tm*2));radial(ctx,230,30,40,'rgba(62,240,176,A)',.12);ctx.restore()};
  const VT=[['vel','Добро пожаловать. Договор купли-продажи — в рамочке на кухне.'],['vel','Не отвлекай, у меня клатч. ...Всё, слили. Из-за тебя.'],['vel','Если что — у меня на этой неделе пробная консультация бесплатно. Для соседей.']];
  const ST=[['sat','Шмакодявка, катку? Мы втроём, нужен четвёртый!'],['sat','Как тебе обои? Великий хотел белые. Я победила.'],['sat','Черсик сегодня приходил через балкон. Мы его покормили. Не говори Шмакодявке.']];
  L.its=[{x:vel.x,y:vel.y+10,r:14,label:()=>'Великий',act:()=>say([VT[r4(VT.length)]])},{x:sat.x,y:sat.y+10,r:14,label:()=>'Сатурналия',act:()=>say([ST[r4(ST.length)]])},
    {x:30,y:148,r:16,label:()=>'Вернуться домой',act:()=>{lockMove=true;X.go(()=>{lockMove=false;backToFlat()})}}];
  after(.4,()=>K.zoneBanner('КВАРТИРА ВЕЛИКОГО И САТУРНАЛИИ','#b89aff'));
}
function backToFlat(){C1.on=false;C1.mode=null;C1.noWpn=false;C8.on=true;K.on=null;K.hud=null;scene='flat';cut=null;dlg=null;state='play';lockMove=false;mapDirty=true;lastRoom=null;
  pl.x=212;pl.y=68;pl.a=Math.PI;pl.ma=pl.a;mz8('hq')}
// дверь в стене гостиной (справа, у окна)
const _bm=buildMap;buildMap=function(){_bm();if(!sosediOpen())return;R(222,56,10,24,'#2a2018');R(223,57,8,22,'#c89a5a');R(224,58,6,9,'#b0844a');R(224,69,6,9,'#b0844a');R(224,67,2,2,'#2a2a2a');
  m.fillStyle='#ffd27a';m.font='bold 3px monospace';m.fillText('СОСЕДИ',208,54)};
IT.push({x:216,y:68,r:16,label:()=>'Зайти к соседям: Великий и Сатурналия',cond:()=>scene==='flat'&&!C1.on&&sosediOpen(),act:()=>{lockMove=true;X.go(()=>{lockMove=false;sec8('sosedi')})}});

// ================= КВАРТИРА: звонок и эпилог =================
function setFlat8(){
  C1.on=false;C1.mode=null;C1.noWpn=false;C8.on=true;for(const o of [window.C2,window.C3,window.C4,window.C5,window.C6,window.C7])if(o){o.on=false;if('epi' in o)o.epi=false}if(window.C4)C4.cat=false;
  scene='flat';cut=null;dlg=null;tr=null;S.fade=0;state='play';K.hud=null;
  S.step=12;S.alarm=false;S.skladLocked=false;S.bat=S.pistol=false;S.bowls=true;mapDirty=true;lastRoom=null;camY=0;
  pl.scoot=false;pl.sit=false;lockMove=true;shmak.mode='sit';shmak.x=136;shmak.y=40;shmak.a=-Math.PI/2;shmak.hug=0;shmak.path=[];cat.path=[];cat.then=null;
  cat.x=CAT_HOME.x;cat.y=CAT_HOME.y;cat.mode='sleep';
}
function kit8(){Object.assign(C1.seenT,{crawler:1,screamer:1,brute:1,shield:1,thrower:1,fast:1});
  Object.assign(PS,{hp:120,max:120,lives:3,inv:0,wpn:'shotgun',ammo:160,shells:44,syr:3,moon:0,hasShotgun:true,mode:'spread',hasAxe:false,hasNail:false,hasExt:false,hasRail:true,cells:8,hasFlame:true,fuel:100,nails:0,ext:0,regen:0,carry:false,slow:0});
  Object.assign(C8,{satK:0,velK:0,airK:0});try{if(window.UP&&UP.kit)UP.kit(8)}catch(e){}}
function startCh8(){
  C8.started=true;C8.done=false;C8.flags={};setFlat8();mz8('call');
  pl.x=176;pl.y=74;pl.a=0;pl.ma=0;
  after(1,()=>{sfx('ring');after(.9,()=>sfx('ring'));note('Звонит телефон: «Великий»');
    after(1.8,()=>say([['m','Алло? Великий?'],['vel','Микроб, привет. Слушай, тут такое... В Екатеринбурге зомби. Прямо сейчас.'],['sat','Они везде! Мы в аэропорту, в бизнес-зале. Орешки кончаются!'],
      ['m','Держитесь. В Питере уже спокойнее, хоть и не до конца... Мы прилетим.'],['s','Прилетим? На чём?'],['m','Ханжа что-то строила во дворе всю неделю. Говорила — «взлётку».'],
      ['s','Тогда собираюсь. В этот раз — я главная. Ты, Зай, будешь... помогать.'],['vel','Прилетайте. И захватите клей. Объясню на месте.'],['st','Екатеринбург? Там пельмени хорошие. Привезите.']],()=>{
        lockMove=false;C8.ready=true;note('Штаб: поговори с кем хочешь. Выход — входная дверь')}))});
}
IT.push({x:212,y:205,r:16,label:()=>'Выйти: к истребителю Ханжи',cond:()=>C8.on&&C8.ready&&!C8.done&&scene==='flat'&&!C1.on,act:()=>{C8.ready=false;lockMove=true;kit8();C8.kills0=PS.kills;X.go(()=>playC8(CUT_RUNWAY,startAir,'runway'))}});
IT.push({x:212,y:205,r:16,label:()=>'Выйти: титры',cond:()=>C8.on&&C8.done&&C8.epi&&scene==='flat'&&!C1.on,act:()=>{C8.epi=false;S.fade=.01;dlg=null}});
// РПГ-7: запись в таблицу оружия (движок взрыва и патроны 'rockets' — в upgrade.js)
function regRpg(){if(C1.WD&&!C1.WD.rpg)C1.WD.rpg={slot:'t',n:'РПГ-7',pose:'shotgun',am:'rockets',mag:1,rt:2.8,cd:1,dmg:60,sp:220,life:1.4,spr:0,kb:220,boom:52,snd:'slug',noise:280,shake:.7}}
regRpg();
function grantRpg(){regRpg();PS.hasRpg=true;try{if(window.UP&&UP.grant)UP.grant('rpg');C1.PS.rockets=Math.max(C1.PS.rockets||0,4)}catch(e){}}
function endCh8(){
  C8.done=true;C8.rpg=true;grantRpg();try{localStorage.setItem('pp_sosedi','1')}catch(e){}window.EKB_FREE=true;setFlat8();mz8('hq');pl.x=176;pl.y=74;pl.a=0;
  after(.8,()=>say([['s','Дома! Зай, видишь эту дверь в стене гостиной?'],['m','Её тут не было. Великий за ночь прорубил?'],['vel','(из-за стены) Не прорубил, а согласовал перепланировку! Всё по закону!'],
    ['sat','(из-за стены) Заходите! У нас уже стоят компы! Катка через пять минут!'],['s','А РПГ я положила на склад. Ракет мало, но бахает — ого.'],['e','Соседи-геймеры? Я принесу колонку!']],()=>{lockMove=false;C8.epi=true;note('Дверь к соседям — справа в гостиной. Выход — титры')}));
}

// ================= МЕНЮ ГЛАВЫ 8 =================
const MENU8=[['Глава 8 с начала (звонок Великого)','call8'],['Взлётная полоса Ханжи','runway8'],['Подлёт к Кольцово (истребитель)','air8'],['Поло по ночному Екб','drive8'],['Остановка: Плотинка','stop1'],['Остановка: Ельцин-центр','stop2'],['Остановка: Вайнера','stop3'],['«Пески»: бомбы A и B','sands8'],['«Пески»: Барханыч','boss8'],['Финал и эпилог','end8']];
function menuKit8(k){kit8();C1.done=true;for(const o of [window.C2,window.C3,window.C4,window.C5,window.C6,window.C7])if(o){o.done=true;o.started=true;o.on=false}C8.started=true;C8.done=false;C8.kills0=PS.kills;S.bat=S.pistol=false;S.skladLocked=false;S.alarm=false;S.key=true;mapDirty=true}
const cfg8={ch:C8,num:8,title:'ТАКТИКУЛЬЩИНА',col:'rgba(200,26,42,A)',btn:{x:4,get y(){return window.C7&&C7.menu?-99:H-66},w:70,h:12},menu:MENU8,alias:{ch8:'call8'},
  start(k){menuKit8(k);if(k==='call8'){startCh8();return}if(k==='runway8'){playC8(CUT_RUNWAY,startAir,'runway');return}if(k==='air8'){startAir();return}if(k==='drive8'){startDrive();return}if(k==='sands8'){sec8('sands');return}if(k==='boss8'){sec8('boss');return}
    if(k==='end8'){playC8(CUT_END8,endCh8,'end');return}sec8(k)},
  canContinue:()=>!!(window.C7&&C7.done&&!C8.started),
  cont(){C8.menu=null;state='play';S.fade=0;sfx('click');kit8();startCh8()},
  endScreen(){
    if(window.C7&&C7.done&&!C8.started){K.endPanel({big:'ГЛАВА 7 ПРОЙДЕНА',sub:'Диджей-сет в «Грибыче»',col:'#c890ff',faces:['m','du','lx','ak','pw'],
      l1:'Дюша уложил зомби: '+(C7.duK||0)+'   ·   Награда: два розовых узи',l2:'Юг Петербурга свободен. Город с каждым днём ближе к спасению.'});cfg8.contBtn(150);return true}
    if(!C8.done)return false;
    K.endPanel({big:'ГЛАВА 8 ПРОЙДЕНА',sub:'Тактикульщина',col:'#ff6a6a',faces:['s','m','sat','vel','val'],
      l1:'Сбито в небе: '+C8.airK+'  ·  Сатурналия: '+C8.satK+'  ·  Великий: '+C8.velK,l2:'Екатеринбург свободен. Великий и Сатурналия теперь соседи.',l3:'Награда: РПГ-7 — огромный взрыв, мало ракет'});
    u.textAlign='center';uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText('Спасибо, что играли!   ·   '+(touch.on?'Коснись, чтобы сыграть заново':'R или клик — сыграть заново'),W/2,166);u.textAlign='left';return true}};
K.chapter(cfg8);C8.cfg=cfg8;
C8.CUTS={CUT_RUNWAY,CUT_MEET,CUT_GATE,CUT_END8};
C8.get=()=>({L:E.L,Q,PS,scene,state,cut,dlg,AIR,mode:C1.mode});
if(window.HDS){sideHanzha=HDS.wrap(sideHanzha);sideVel=HDS.wrap(sideVel);sideSat=HDS.wrap(sideSat)}
C8.art={topSat,topVel,sideVel,sideSat,sideHanzha,jetSide}; // 03.11: для глав 9–10
})();
