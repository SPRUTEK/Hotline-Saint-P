// =====================================================================
//  ГЛАВА 1 — «Офисы Аниса».  Подключается после основного скрипта пролога
//  и пользуется его функциями (ctx, u, say, playCut, music, sideMikrob…).
//  Всё своё держит внутри замыкания, наружу отдаёт только window.C1.
// =====================================================================
(function(){
'use strict';
const C1={on:false,mode:null,done:false,called:false,menu:null,over:null,lastIn:'key',mdown:false,shake:0,hurt:0,cx:0,cy:0};
window.C1=C1;
const TAU=Math.PI*2;
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
const D2=(a,b,c,d)=>Math.hypot(c-a,d-b);

// ================= ИГРОК: ресурсы =================
const PS={hp:100,max:100,lives:3,inv:0,wpn:'pistol',ammo:12,shells:0,syr:0,moon:0,hasShotgun:false,mode:'spread',regen:0,cd:0,swing:0,carry:false,flash:0,kills:0,rideGain:0,food:false,hasAxe:false,hasExt:false,hasNail:false,nails:0,ext:0,slow:0,hasRail:false,cells:0,hasFlame:false,fuel:0,key1:false,key2:false,
  // доработка: магазины, перезарядка, лоадаут, зелья, броня, пиво
  mag:{pistol:8},rl:0,rlw:null,own:{bat:1,pistol:1},lo:{m:'bat',p:'pistol',t:null},found:[],pot:0,potT:0,beer:0,beerT:0,arm:null,p50:0,r762:0,r556:0,awp:0};
const snap=()=>JSON.parse(JSON.stringify(PS));
const restore=s=>Object.assign(PS,JSON.parse(JSON.stringify(s)));
C1.PS=PS;

// ================= ЗВУКИ (синтез, без файлов) =================
let AC=null,NB=null;
function ac(){
  const fresh=!AC;
  if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();const n=AC.sampleRate;NB=AC.createBuffer(1,n,n);const d=NB.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1}catch(e){AC=null}}
  if(AC&&AC.state==='suspended')AC.resume();musicKick();return AC}
function sfx(k,vol){
  const a=ac();if(!a||muted)return;const t=a.currentTime,g=a.createGain();g.connect(a.destination);const v=(vol||1)*.45;
  const env=(peak,dur)=>{g.gain.setValueAtTime(peak,t);g.gain.exponentialRampToValueAtTime(.001,t+dur)};
  const nz=(dur,f,type)=>{const s=a.createBufferSource();s.buffer=NB;const fl=a.createBiquadFilter();fl.type=type||'lowpass';fl.frequency.value=f;s.connect(fl);fl.connect(g);s.start(t,Math.random()*.5,dur)};
  const os=(type,f0,f1,dur)=>{const o=a.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);o.connect(g);o.start(t);o.stop(t+dur)};
  switch(k){
    case'shot':env(v*.9,.16);nz(.16,2400);os('square',180,50,.07);break;
    case'shotgun':env(v*1.3,.42);nz(.42,1100);os('sawtooth',120,30,.2);break;
    case'slug':env(v*1.3,.5);nz(.5,1800);os('square',90,25,.3);break;
    case'rifle':env(v*.55,.25);nz(.25,1500);break;
    case'bat':env(v*.7,.12);nz(.12,500,'bandpass');os('sine',140,50,.1);break;
    case'swing':env(v*.18,.12);nz(.12,1800,'highpass');break;
    case'hit':env(v*.35,.07);nz(.07,3000);break;
    case'hurt':env(v*.5,.25);os('square',240,80,.25);break;
    case'pick':env(v*.35,.16);os('sine',660,1320,.16);break;
    case'fire':env(v*.8,.8);nz(.8,800,'bandpass');break;
    case'glass':env(v*.5,.22);nz(.22,5000,'highpass');break;
    case'groan':env(v*.16,.5);os('sawtooth',95,55,.5);break;
    case'thump':env(v*.8,.3);os('sine',90,35,.3);break;
    case'click':env(v*.3,.05);os('square',900,600,.05);break;
    case'ring':env(v*.35,.7);os('sine',988,990,.35);os('sine',1318,1320,.7);break;
    case'power':env(v*.6,.9);os('sawtooth',50,200,.9);break;
    case'hiss':env(v*.22,.12);nz(.12,3500,'highpass');break;
    case'nail':env(v*.4,.08);nz(.06,4200,'highpass');os('square',600,300,.05);break;
    case'axe':env(v*.9,.18);nz(.16,700,'bandpass');os('sine',110,40,.16);break;
    case'boom':env(v*1.4,.9);nz(.9,500);os('sine',70,25,.7);break;
    case'scream':env(v*.35,1.1);os('sawtooth',620,880,.5);os('square',300,520,1.1);break;
    case'reload':env(v*.4,.18);os('square',420,260,.05);nz(.08,3000,'highpass');break;
    case'zap':env(v*.5,.25);os('square',1800,600,.2);nz(.2,5000,'highpass');break;
    case'burp':env(v*.9,.7);os('sawtooth',70,48,.7);nz(.5,300,'bandpass');break;
    case'coin':env(v*.3,.3);os('square',1320,1320,.08);os('square',1760,1760,.3);break;
    case'clang':env(v*.45,.25);os('square',1400,900,.2);nz(.1,6000,'highpass');break;
  }
}
C1.sfx=sfx;

// ================= ПОРТРЕТЫ =================
function pAnis(g,open,blink){
  g.clearRect(0,0,64,64);
  const SK='#e2ad8c',SD='#c99272',HR='#241a15';
  ell(g,32,75,32,18,'#17171b');ell(g,32,77,26,12,'#1e1e23');
  ell(g,14,64,7,8,'#4a4a30');ell(g,50,64,7,8,'#4a4a30'); // жилет на плечах
  P(g,22,45,20,15,'#1b1b20');P(g,22,45,20,2,'#2a2a31');for(let y=48;y<60;y+=3)P(g,23,y,18,1,'#131317');
  ell(g,32.5,33,16,18,SD);ell(g,31.5,32,15.5,17.5,SK);
  ell(g,16,34,3,5,SD);ell(g,47.5,34,3,5,SD);
  ell(g,32,19,17,10,HR,(x,y)=>y<=18+Math.abs(x-32)*0.18);P(g,15,17,3,10,HR);P(g,46,17,3,10,HR);
  P(g,21,12,8,1,'#3e2c22');P(g,33,13,9,1,'#3e2c22');
  P(g,20,24,9,2,HR);P(g,35,24,9,2,HR);
  if(blink){P(g,21,29,7,1,'#3a2418');P(g,36,29,7,1,'#3a2418')}
  else{P(g,21,28,7,3,'#fff');P(g,23,28,3,3,'#4a3020');P(g,24,29,1,1,'#111');P(g,36,28,7,3,'#fff');P(g,38,28,3,3,'#4a3020');P(g,39,29,1,1,'#111');P(g,21,31,7,1,SD);P(g,36,31,7,1,SD)}
  P(g,30,30,3,7,SD);P(g,29,36,5,1,'#b07a5c');
  P(g,18,36,5,2,'#eaa08c');P(g,41,36,5,2,'#eaa08c');
  if(open){P(g,24,40,16,6,'#4a1418');P(g,25,40,14,2,'#f4f0ea');P(g,26,44,12,1,'#f4f0ea');P(g,23,39,2,1,'#a85a50');P(g,39,39,2,1,'#a85a50')}
  else{P(g,23,39,1,1,'#a85a50');P(g,40,39,1,1,'#a85a50');P(g,24,40,16,1,'#a85a50');P(g,25,41,14,2,'#f4f0ea');P(g,25,43,14,1,'#a85a50')}
  P(g,26,49,12,1,SD);
}
const CAMO=['#4a5a32','#3a4628','#6a6a42','#2a3020'];
function camo(g,x0,y0,x1,y1,cond){for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){if(cond&&!cond(x,y))continue;P(g,x,y,1,1,CAMO[Math.floor(hash(x>>2,y>>2)*4)])}}
function pHanzhaMil(g,open,blink){
  pHanzha(g,open,blink);
  camo(g,0,52,64,64,(x,y)=>Math.abs(x-32)>8);P(g,24,52,16,3,'#3a4628');
  ell(g,30,13,17,6,'#2e3a22');P(g,13,14,34,3,'#2e3a22');P(g,40,10,4,3,'#c8a030');
  P(g,20,26,11,6,'#111');P(g,33,27,11,5,'#111');P(g,31,28,2,1,'#111');P(g,21,27,3,1,'#5a6a7a');P(g,34,28,3,1,'#5a6a7a');
}
function pGuardMil(g,open,blink){
  pGuard(g,open,blink);
  camo(g,0,56,64,64,(x,y)=>Math.abs(x-32)>5);
  ell(g,32,19,19,11,'#4a5a3a',(x,y)=>y<=25);P(g,12,24,40,3,'#3a4a2a');for(let x=16;x<48;x+=4)P(g,x,14+(x%8?1:0),2,1,'#5a6a46');
}
function pDvornikMil(g,open,blink){
  pDvornik(g,open,blink);
  camo(g,0,56,64,64,(x,y)=>Math.abs(x-32)>7);P(g,4,59,20,1,'#c8c8c8');P(g,40,59,20,1,'#c8c8c8');
  ell(g,32,20,16,12,'#3a4628',(x,y)=>y<=25);P(g,15,23,34,4,'#2a3420');
}
Object.assign(PORTRAIT,{a:pAnis,H:pHanzhaMil,G:pGuardMil,D:pDvornikMil});
Object.assign(PCV,{a:mk(64),H:mk(64),G:mk(64),D:mk(64)});
Object.assign(NAME,{a:'АНИС',H:'КОМАНДИР ХАНЖА',G:'МИХАЛЫЧ',D:'ДВОРНИК'});
Object.assign(NCOL,{a:'#e8c070',H:'#c8e06a',G:'#9ac08a',D:'#9be04a'});
Object.assign(BG,{a:['#2a2410','#d8a840'],H:['#1e2612','#a8c84a'],G:['#141e14','#6a9a5a'],D:['#1a2a08','#8ae83a']});

// ================= СПРАЙТЫ (вид сверху, смотрят вправо) =================
const sprMk=mk(24),legT=mk(24),sprA=mk(24),sprN=mk(24),sprZ=mk(32),legBig=mk(32);
for(const c of [sprMk,legT,sprA,sprN,sprZ,legBig])c.getContext('2d',{willReadFrequently:true});
function drawMik(g,w,carry){
  g.clearRect(0,0,24,24);
  const J='#8f9298',JD='#686b72',JL='#b4b7bc',SK='#e8b898',HR='#3d2b20';
  if(carry){P(g,10,4,8,3,J);P(g,10,17,8,3,J);P(g,15,3,8,18,'#6a5a3a');P(g,16,4,6,16,'#8a7a4a');for(let i=0;i<4;i++)P(g,16,5+i*4,6,1,'#5a4a2a')}
  else if(w==='pistol'){P(g,11,15,8,3,J);P(g,18,15,2,2,SK);P(g,19,13,6,2,'#151515');P(g,20,12,2,1,'#151515');P(g,11,6,6,3,J);P(g,16,7,2,3,SK)}
  else if(w==='bat'){P(g,10,16,7,3,J);P(g,16,16,2,2,SK);P(g,2,17,15,2,'#b07434');P(g,2,17,4,2,'#c88a44');P(g,14,17,3,2,'#2a2a2a');P(g,10,5,6,3,J);P(g,15,5,2,2,SK)}
  else if(w==='shotgun'){P(g,11,14,8,3,J);P(g,17,14,2,2,SK);P(g,10,7,10,3,J);P(g,19,8,2,2,SK);P(g,6,11,7,3,'#6a4424');P(g,12,11,12,2,'#26262a');P(g,14,13,7,1,'#3a3a40')}
  else if(w==='axe'){P(g,10,16,7,3,J);P(g,16,16,2,2,SK);P(g,3,17,14,2,'#b8282a');P(g,0,13,5,9,'#8a9098');P(g,0,13,1,9,'#e0e4ea');P(g,4,15,1,5,'#5a6068');P(g,10,5,6,3,J);P(g,15,5,2,2,SK)}
  else if(w==='nail'){P(g,11,15,8,3,J);P(g,18,15,2,2,SK);P(g,17,12,8,5,'#e8a020');P(g,18,13,6,1,'#2a2a2a');P(g,24,14,1,1,'#c8ccd4');P(g,18,16,3,2,'#3a3a3a');P(g,11,6,6,3,J);P(g,16,7,2,3,SK)}
  else if(w==='ext'){P(g,11,15,8,3,J);P(g,18,14,2,2,SK);P(g,11,6,8,3,J);P(g,18,8,2,2,SK);P(g,15,8,5,9,'#c8202a');P(g,16,8,1,9,'#e85a5a');P(g,17,7,2,1,'#2a2a2a');P(g,19,10,5,1,'#2a2a2a');P(g,23,9,2,3,'#3a3a3a')}
  else if(w==='rail'){P(g,11,15,8,3,J);P(g,18,14,2,2,SK);P(g,10,7,10,3,J);P(g,19,8,2,2,SK);P(g,8,10,16,4,'#3a4a5a');P(g,10,11,14,1,'#8af0ff');P(g,23,10,2,4,'#c8f8ff');P(g,12,9,4,1,'#2a2a30');P(g,12,14,4,1,'#2a2a30')}
  else if(w==='flamer'){P(g,11,15,8,3,J);P(g,18,14,2,2,SK);P(g,10,7,10,3,J);P(g,19,8,2,2,SK);P(g,9,10,10,4,'#8a6a3a');P(g,10,11,8,1,'#c8a060');P(g,18,11,6,2,'#4a4a52');P(g,23,10,2,4,'#2a2a2a');P(g,4,9,5,6,'#cfe8d0');P(g,5,10,3,4,'#e8e0c0')}
  else if(w==='molotov'){P(g,11,15,8,3,J);P(g,18,14,3,4,'#7aa050');P(g,21,15,2,2,'#e8e0d0');P(g,11,6,6,3,J);P(g,16,7,2,2,SK);P(g,18,6,2,2,'#c8c8d0')}
  else if(w==='scoot'){P(g,10,5,8,3,J);P(g,17,6,2,2,SK);P(g,10,16,8,3,J);P(g,17,16,2,2,SK)}
  else{P(g,10,3,6,3,J);P(g,16,3,2,3,SK);P(g,10,18,6,3,J);P(g,16,18,2,3,SK)}
  ell(g,11,12,4.6,8.2,J);ell(g,9.5,12,3,7.4,JD);P(g,14,6,1,12,JL);
  P(g,14,8,2,8,'#f0f0f0');P(g,14,8,1,8,'#c9cbd0');
  ell(g,12,12,4.3,4.3,HR);P(g,9,10,3,1,'#5a4232');P(g,10,13,3,1,'#5a4232');
  P(g,15,9,2,7,SK);P(g,16,11,1,2,'#5a3d2b');
  P(g,16,9,1,3,'#ffd23a');P(g,16,13,1,3,'#ffd23a');P(g,16,12,1,1,'#111');P(g,15,8,1,1,'#111');P(g,15,16,1,1,'#111');
  hdMikTop(g);
  outline(g,'#0b0910');
}
function gunOverlay(g,w){ // ствол в руках поверх базовой позы (pistol/shotgun/bat)
  if(WD[w]&&WD[w].ov2){for(const r of WD[w].ov2)P(g,...r);return} // скины (skins.js)
  if(w==='glock'){P(g,19,13,6,2,'#1a2a14');P(g,20,12,3,1,'#8aff3a');P(g,24,13,1,2,'#8aff3a')}
  else if(w==='deagle'){P(g,18,12,8,3,'#c8a030');P(g,18,12,8,1,'#ffe890');P(g,19,15,2,2,'#8a6a1a')}
  else if(w==='ak'){P(g,6,11,18,3,'#141418');P(g,6,11,6,3,'#7a4424');P(g,14,13,3,3,'#141418');P(g,15,14,2,3,'#2a2a2a');P(g,18,11,4,1,'#7a4424')}
  else if(w==='m4'){P(g,6,11,18,3,'#26262c');P(g,6,11,5,3,'#3a3a42');P(g,12,10,6,1,'#4a4a52');P(g,14,13,2,3,'#1a1a1e');P(g,22,11,2,3,'#3a3a42')}
  else if(w==='rpk'){P(g,5,11,19,3,'#141418');P(g,5,11,6,3,'#6a3a1c');P(g,12,13,6,4,'#2a2a2a');P(g,22,14,1,3,'#3a3a3a');P(g,20,15,1,2,'#3a3a3a')}
  else if(w==='awp'){P(g,5,11,19,3,'#3a5a2a');P(g,5,11,6,3,'#2a3a1e');P(g,11,9,7,2,'#141418');P(g,24,12,1,1,'#ff3030')}
  else if(w==='shotgun'){}
  else if(w==='kukri'){P(g,15,18,4,2,'#4a2e1a');P(g,19,17,5,2,'#c8ccd4');P(g,19,17,5,.5,'#f0f4f8');P(g,22,19,2,1,'#c8ccd4')}
  else if(WD[w]&&WD[w].ov){for(const r of WD[w].ov)P(g,...r)}
  else if(w==='uzi'){P(g,11,6,8,3,'#1c1c22');P(g,18,7,2,2,'#e2ad8c');P(g,19,6,6,3,'#ff5ac8');P(g,20,9,1,2,'#c8309a');P(g,24,7,1,1,'#2a2a2a');P(g,19,14,6,3,'#ff5ac8');P(g,20,17,1,2,'#c8309a');P(g,24,15,1,1,'#2a2a2a')}
  else if(w==='shovel'){P(g,8,18,14,1.6,'#8a6a40');P(g,7,17,2,3,'#5a3a20');P(g,21,16,3,6,'#8a9098');P(g,21,16,3,1,'#e0e4ea')}
}
function drawAnisSpr(g){
  g.clearRect(0,0,24,24);const SK='#e2ad8c',TN='#1c1c22',VS='#4e4e32';
  P(g,5,11,7,3,'#6a4424');P(g,11,11,13,2,'#26262a');
  P(g,11,14,8,3,TN);P(g,18,13,2,2,SK);P(g,10,7,10,3,TN);P(g,19,8,2,3,SK);
  ell(g,11,12,4.8,8,TN);ell(g,10.5,12,3.9,7,VS);P(g,12,7,2,2,'#3a3a24');P(g,12,15,2,2,'#3a3a24');P(g,8,6,1,12,'#3a3a24');
  ell(g,12,12,4.2,4.2,'#241a15');P(g,15,9,2,7,SK);P(g,16,11,1,2,'#c99272');
  outline(g,'#0b0910');
}
function drawSoldier(g,t,o){ // военные соседи во дворе
  g.clearRect(0,0,24,24);const SK=o.sk||'#e0ae8c',B=o.body||'#4a5a32';
  const s=o.mv?Math.round(Math.sin(t*9)):0;
  if(o.gun){P(g,11,14,8,3,B);P(g,18,13,2,2,SK);P(g,10,7,9,3,B);P(g,18,8,2,2,SK);P(g,8,11,5,3,'#2a2a2a');P(g,12,11,11,2,'#1a1a1e')}
  else{P(g,10,5,6,3,B);P(g,15+s,5,2,3,SK);P(g,10,16,6,3,B);P(g,15-s,16,2,3,SK)}
  ell(g,11,12,o.w||4.4,7.4,B);camo(g,7,5,16,19,(x,y)=>((x-11)**2/20+(y-12)**2/55)<1&&hash(x,y)<.5);
  if(o.hair){ell(g,8,12,3.4,2.6,o.hair);P(g,5,11,2,2,o.hair)}
  ell(g,12,12,3.6,3.6,o.head||'#3a4628');P(g,10,11,3,1,shade(o.head||'#3a4628',1.3));P(g,15,10,1,4,SK);
  outline(g,'#0b0910');
}
const ZCOL=['#5a6a8a','#8a5a4a','#6a6a5a','#4a4a52','#8a7a5a','#3a5a4a','#7a3a3a','#a8a8b0'];
const zCache={};
const ZDK={};function zDark(type,v){const k=type+v;if(ZDK[k])return ZDK[k];const b=zBody(type,v),c=document.createElement('canvas');c.width=b.width;c.height=b.height;const g=c.getContext('2d');g.drawImage(b,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(10,8,16,.45)';g.fillRect(0,0,c.width,c.height);return ZDK[k]=c}
// объём спрайта (04.11): блик сверху-слева, тень снизу-справа, лёгкий шум, пятна кислотной слизи
function sprVol(g){if(!(window.NEON&&NEON.on))return;g.save();g.globalCompositeOperation='source-atop';const gr=g.createLinearGradient(2,2,22,22);gr.addColorStop(0,'rgba(255,240,255,.2)');gr.addColorStop(.45,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(14,0,34,.32)');g.fillStyle=gr;g.fillRect(0,0,24,24);g.restore()}
function hstr2(s){let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
function shadeSpr(c,g,slime,seed){const w=c.width,h=c.height,id=g.getImageData(0,0,w,h),d=id.data,a=new Uint8Array(w*h);for(let i=0;i<w*h;i++)a[i]=d[i*4+3]>40?1:0;
  const q=c._q||Q,k=Math.max(1,Math.round(q));const A=(x,y)=>x<0||y<0||x>=w||y>=h?0:a[y*w+x];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(!a[i])continue;const p=i*4;let f=1;
    if(!A(x-k,y)||!A(x,y-k))f=1.3;else if(!A(x+k,y)||!A(x,y+k))f=.7;else if(!A(x+2*k,y+2*k))f=.84;f*=1.12-.24*((x/w+y/h)/2);
    const n=((x*73856093^y*19349663^seed)>>>0)%100;f*=n<12?.93:n>90?1.06:1;
    d[p]=Math.min(255,d[p]*f);d[p+1]=Math.min(255,d[p+1]*f);d[p+2]=Math.min(255,d[p+2]*f)}
  if(slime){let r=seed;const R=m=>{r=(r*1103515245+12345)&0x7fffffff;return (r>>>10)%m};
    for(let s=0;s<2;s++){let cx=0,cy=0,tries=0;do{cx=R(w);cy=R(h);tries++}while(!a[cy*w+cx]&&tries<40);if(!a[cy*w+cx])continue;const rr=q*(.7+R(2)*.5);
      for(let y=Math.max(0,cy-rr*2|0);y<Math.min(h,cy+rr*2);y++)for(let x=Math.max(0,cx-rr*2|0);x<Math.min(w,cx+rr*2);x++){const i=y*w+x;if(!a[i])continue;const dd=Math.hypot((x-cx)/1.3,y-cy);if(dd>rr)continue;const p=i*4;
        if(dd>rr-q*.4){d[p]=d[p]*.5+20;d[p+1]=d[p+1]*.5+60;d[p+2]=d[p+2]*.5+8}else{d[p]=d[p]*.35+80;d[p+1]=d[p+1]*.35+165;d[p+2]=d[p+2]*.35+38}}}}
  g.putImageData(id,0,0)}
function zBody(type,v,rise){
  const key=type+v;if(zCache[key])return zCache[key];
  const big=type==='brute'||type==='boss',S=big?32:24,c=mk(S),g=c.getContext('2d',{willReadFrequently:true});
  const SK=type==='brute'?'#5f7f52':'#7fa070',SD='#5a7a4a';
  const SPEC=type==='crawler'||type==='bloat'||type==='shield'||type==='screamer'||type==='gunner'||type==='raider'||type==='armor'||type==='spitter';
  if(type==='gunner'){
    // зомби-охранник / ОМОН: тёмная форма, шлем, пистолет двумя руками вперёд
    const u=v%2?'#22283a':'#2a3040';P(g,12,7,7,3,u);P(g,12,14,7,3,u);P(g,18,9,3,6,SK);P(g,20,11,4,2,'#121216');P(g,21,10,1,1,'#3a3a44');
    ell(g,10,12,4.6,7.4,u);ell(g,9,12,3.4,6.4,shade(u,.75));P(g,6,9,4,6,'#3a4458');P(g,7,10,2,1,'#c8c8d0');
    ell(g,13,12,3.8,3.8,'#2e3a2e');ell(g,12.5,12,3,3,'#3e4c3a');P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030');
  }else if(type==='raider'){
    // мародёр (живой): куртка хаки, рюкзак, балаклава, автомат
    const u=v%2?'#5a4a30':'#4a4a36';P(g,12,6,7,3,u);P(g,18,6,2,3,'#c89a78');P(g,12,15,8,3,u);P(g,19,15,2,3,'#c89a78');
    P(g,14,13,10,2,'#18181a');P(g,13,14,3,3,'#4a321c');P(g,20,12,2,1,'#2a2a2e');
    ell(g,10,12,4.6,7.4,u);ell(g,9,12,3.4,6.4,shade(u,.75));P(g,3,8,5,8,'#3a4a2a');P(g,4,9,3,6,'#2c3a20');
    ell(g,13,12,3.6,3.6,'#1a1a1c');P(g,15,11,1,3,'#d8b090');P(g,16,11,1,1,'#2a2a2a');P(g,16,13,1,1,'#2a2a2a');
  }else if(type==='armor'){
    // зомби в бронежилете и каске
    P(g,11,4,9,4,'#3a4232');P(g,19,4,3,4,SK);P(g,11,16,9,4,'#3a4232');P(g,19,16,3,4,SK);
    ell(g,11,12,5.6,8.2,'#4a5440');ell(g,10,12,4.4,7.2,'#3a4232');P(g,8,6,6,12,'#5a6450');P(g,9,7,4,10,'#6a7660');P(g,10,9,2,6,'#7a8870');
    ell(g,14,12,4,4,'#4a5a3a');ell(g,13.5,12,3.2,3.2,'#5a6a48');P(g,16,10,2,5,SK);P(g,17,10,1,1,'#ff3030');P(g,17,14,1,1,'#ff3030');
  }else if(type==='spitter'){
    // плевун: тощий, раздутое зелёное горло
    P(g,11,7,7,2,'#6a7a5a');P(g,17,6,3,3,SK);P(g,11,15,7,2,'#6a7a5a');P(g,17,15,3,3,SK);
    ell(g,10,12,3.6,6.6,'#5a6a4a');ell(g,9,12,2.6,5.8,'#4a5a3a');P(g,7,9,2,6,'#3a4a2a');
    ell(g,14,12,3.6,3.4,SK);ell(g,17,12,2.4,2.6,'#8aff3a');ell(g,17.5,12,1.2,1.4,'#2a5a0a');P(g,15,10,1,1,'#ffe040');P(g,15,14,1,1,'#ffe040');
  }else if(!big&&!SPEC){
    const sh=ZCOL[v%ZCOL.length],shd=shade(sh,.72);
    if(type==='thrower'){P(g,11,15,9,3,sh);P(g,19,15,3,3,SK);P(g,9,3,6,3,sh);P(g,3,1,7,7,'#18181c');P(g,4,2,2,2,'#3a3a42');P(g,8,6,2,1,'#2a2a30')}
    else{P(g,11,6,9,3,sh);P(g,19,6,3,3,SK);P(g,11,15,9,3,sh);P(g,19,15,3,3,SK)}
    const bw=type==='fast'?3.8:4.6;
    ell(g,11,12,bw,7.6,sh);ell(g,9.6,12,bw-1.4,6.8,shd);
    P(g,12,9,2,2,'#6a1a1a');P(g,9,14,1,2,'#6a1a1a');P(g,13,15,1,1,'#6a1a1a');
    ell(g,12,12,4,4,v%3===0?SK:['#3a2a20','#6a5a40','#2a2a2a'][v%3]);
    P(g,15,10,2,5,SK);const ey=type==='fast'?'#ffe040':'#ff3030';P(g,16,10,1,1,ey);P(g,16,14,1,1,ey);P(g,17,12,1,1,'#3a1010');
    if(type==='fast'){P(g,7,10,2,4,'#e8e8e8')}
  }else if(type==='crawler'){
    // офисный без ног: торс, белая рубашка, галстук, руки тянутся вперёд, кишки сзади
    P(g,12,5,10,3,'#e8e4dc');P(g,21,5,3,3,SK);P(g,12,16,10,3,'#e8e4dc');P(g,21,16,3,3,SK);
    ell(g,11,12,4.4,6.4,'#e8e4dc');ell(g,10,12,3,5.6,'#c8c2b8');P(g,9,11,6,2,'#2a3a6a');
    P(g,3,10,4,1,'#8a1a22');P(g,2,12,5,2,'#6a1018');P(g,4,14,3,1,'#8a1a22');P(g,6,9,2,6,'#5a0a12');
    ell(g,15,12,3.6,3.6,['#3a2a20','#2a2a2a','#6a5a40'][v%3]);P(g,17,10,2,5,SK);P(g,18,10,1,1,'#ff3030');P(g,18,14,1,1,'#ff3030');
  }else if(type==='bloat'){
    // раздутый курьер: огромное брюхо в жёлтой куртке, короб за спиной
    P(g,2,6,7,12,'#c8681a');P(g,3,7,5,10,'#e8862a');P(g,4,11,3,2,'#2a2a2a');
    ell(g,12,12,7,7.5,'#d8c040');ell(g,13,12,5.6,6,'#8aa848');ell(g,14,11,3,3,'#a8c860');P(g,10,9,1,4,'#5a7a2a');P(g,15,14,3,1,'#5a7a2a');P(g,12,15,1,2,'#6a1a1a');
    P(g,13,2,4,3,'#d8c040');P(g,13,19,4,3,'#d8c040');P(g,17,3,2,2,SK);P(g,17,19,2,2,SK);
    ell(g,18,12,2.6,2.6,SK);P(g,19,11,1,1,'#ffe040');P(g,19,13,1,1,'#ffe040');
  }else if(type==='shield'){
    // охранник бизнес-центра: чёрная форма, кепка, полицейский щит спереди
    P(g,11,5,8,3,'#1a1e2a');P(g,11,16,8,3,'#1a1e2a');
    ell(g,10,12,4.6,7.6,'#1a1e2a');ell(g,9,12,3.4,6.6,'#11141c');P(g,8,7,2,1,'#c8a040');
    ell(g,13,12,3.6,3.6,'#22283a');P(g,15,10,2,5,'#6a8a5a');P(g,16,11,1,1,'#ff3030');P(g,16,13,1,1,'#ff3030');
    P(g,18,2,3,20,'#8a96a8');P(g,19,3,2,18,'#b8c8dc');P(g,20,3,1,18,'#e0ecf8');P(g,18,10,3,4,'#2a3a6a');P(g,19,11,1,2,'#e8e8f0');
  }else if(type==='screamer'){
    // крикун: тощий, бледный, огромный открытый рот
    P(g,11,7,8,2,'#9a9aa2');P(g,18,6,3,3,'#c8ccd0');P(g,11,15,8,2,'#9a9aa2');P(g,18,15,3,3,'#c8ccd0');
    ell(g,11,12,3.2,6.6,'#6a6a72');ell(g,10,12,2.2,5.8,'#55555c');P(g,8,10,1,5,'#c8ccd0');
    ell(g,14,12,3.6,3.4,'#d8dce0');ell(g,16.5,12,1.8,2.2,'#120608');P(g,16,11,1,1,'#ff3030');P(g,13,10,1,1,'#101014');P(g,13,14,1,1,'#101014');
  }else if(type==='brute'){
    P(g,14,3,12,6,SK);P(g,24,3,6,6,SD);P(g,14,23,12,6,SK);P(g,24,23,6,6,SD);
    ell(g,14,16,7.5,11.5,'#4a4a3a');ell(g,12,16,5.5,10,'#3a3a2c');ell(g,15,16,4,7,SK);P(g,13,12,3,2,'#6a1a1a');P(g,16,19,2,3,'#6a1a1a');
    ell(g,18,16,5,5,SK);P(g,19,13,3,1,SD);P(g,22,13,1,1,'#ff2020');P(g,22,18,1,1,'#ff2020');P(g,23,15,1,3,'#3a1010');
  }else{ // босс — громила в костюме
    P(g,14,5,11,5,'#3a3e4a');P(g,24,5,4,5,SK);P(g,14,22,11,5,'#3a3e4a');P(g,24,22,4,5,SK);
    ell(g,14,16,7,10.5,'#3a3e4a');ell(g,12,16,5,9.5,'#2c3038');P(g,18,11,2,10,'#e8e8e8');P(g,19,13,1,6,'#b0202a');P(g,16,8,2,3,'#6a1a1a');P(g,11,19,3,2,'#6a1a1a');
    ell(g,17,16,5,5,SK);P(g,15,13,4,1,'#3a3a3a');P(g,21,13,1,1,'#ff2020');P(g,21,18,1,1,'#ff2020');P(g,22,15,1,3,'#3a1010');
  }
  if(window.NEON&&NEON.on)try{shadeSpr(c,g,type!=='sample'&&type!=='labrat',hstr2(key))}catch(e){}
  outline(g,'#0b0910');zCache[key]=c;return c;
}

// ================= ДВИЖОК «ВИД СВЕРХУ» =================
const TS=4,NS=8,DIR8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
let L=null;
function mkLevel(id,w,h){
  const gw=Math.ceil(w/TS),gh=Math.ceil(h/TS);
  L={id,w,h,gw,gh,g:new Uint8Array(gw*gh).fill(1),bg:mk(w,h),dec:mk(w,h),zs:[],items:[],its:[],fires:[],buls:[],ebuls:[],mol:[],fx:[],texts:[],lights:[],npcs:[],corpses:[],cas:[],
     dark:0,ally:null,t:0,armed:true,navT:0,obj:()=>[],onUpdate:null,drawUnder:null,drawOver:null,startX:0,startY:0,glow:[]};
  L.bx=L.bg.getContext('2d');L.dx=L.dec.getContext('2d');
  L.score={pts:0,kills:0,maxCb:0,cb:0,cbT:0,hits:0,t:0,wp:{},style:{},done:false,par:0};
  C1.L=L;return L;
}
function gfill(x0,y0,x1,y1,v){
  const a=Math.max(0,Math.floor(x0/TS)),b=Math.min(L.gw,Math.ceil(x1/TS)),c=Math.max(0,Math.floor(y0/TS)),d=Math.min(L.gh,Math.ceil(y1/TS));
  for(let y=c;y<d;y++)for(let x=a;x<b;x++)L.g[y*L.gw+x]=v;
}
function gAt(x,y){const cx=Math.floor(x/TS),cy=Math.floor(y/TS);if(cx<0||cy<0||cx>=L.gw||cy>=L.gh)return 1;return L.g[cy*L.gw+cx]}
function solidAt(x,y,r){return gAt(x-r,y-r)||gAt(x+r,y-r)||gAt(x-r,y+r)||gAt(x+r,y+r)||gAt(x,y)}
function shotBlock(x,y){const v=gAt(x,y);return v===1||v===3}
function los(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/3);for(let i=1;i<n;i++){const k=i/n;if(shotBlock(x0+(x1-x0)*k,y0+(y1-y0)*k))return false}return true}
function moveEnt(e,dx,dy,r){if(dx){const nx=e.x+dx;if(!solidAt(nx,e.y,r))e.x=nx}if(dy){const ny=e.y+dy;if(!solidAt(e.x,ny,r))e.y=ny}}
function buildNav(){
  L.nw=Math.ceil(L.w/NS);L.nh=Math.ceil(L.h/NS);L.nb=new Uint8Array(L.nw*L.nh);L.nd=new Int16Array(L.nw*L.nh);
  for(let y=0;y<L.nh;y++)for(let x=0;x<L.nw;x++){let b=0;for(let j=0;j<2;j++)for(let i=0;i<2;i++){const gx=x*2+i,gy=y*2+j;if(gx>=L.gw||gy>=L.gh||L.g[gy*L.gw+gx])b=1}L.nb[y*L.nw+x]=b}
}
function flow(){
  const nd=L.nd,nw=L.nw,nh=L.nh;nd.fill(-1);const q=new Int32Array(nw*nh);let h=0,t=0;
  let sx=Math.floor(pl.x/NS),sy=Math.floor(pl.y/NS),s=-1;
  for(let r=0;r<3&&s<0;r++)for(let j=-r;j<=r&&s<0;j++)for(let i=-r;i<=r&&s<0;i++){const x=sx+i,y=sy+j;if(x>=0&&y>=0&&x<nw&&y<nh&&!L.nb[y*nw+x])s=y*nw+x}
  if(s<0)return;nd[s]=0;q[t++]=s;
  while(h<t){const c=q[h++],cx=c%nw,cy=(c/nw)|0,d=nd[c]+1;
    if(cx>0&&!L.nb[c-1]&&nd[c-1]<0){nd[c-1]=d;q[t++]=c-1}
    if(cx<nw-1&&!L.nb[c+1]&&nd[c+1]<0){nd[c+1]=d;q[t++]=c+1}
    if(cy>0&&!L.nb[c-nw]&&nd[c-nw]<0){nd[c-nw]=d;q[t++]=c-nw}
    if(cy<nh-1&&!L.nb[c+nw]&&nd[c+nw]<0){nd[c+nw]=d;q[t++]=c+nw}}
}
function navDir(e){
  const nw=L.nw,cx=Math.floor(e.x/NS),cy=Math.floor(e.y/NS);let best=null,bd=1e9;
  for(const [dx,dy] of DIR8){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=nw||ny>=L.nh)continue;const i=ny*nw+nx;if(L.nb[i]||L.nd[i]<0)continue;
    if(dx&&dy&&(L.nb[cy*nw+nx]||L.nb[ny*nw+cx]))continue;const d=L.nd[i]+(dx&&dy?.45:0);if(d<bd){bd=d;best=[nx,ny]}}
  if(!best)return null;return Math.atan2((best[1]+.5)*NS-e.y,(best[0]+.5)*NS-e.x);
}

// ---- страховка от застревания и навигация к произвольной точке ----
function freeSpot(x,y,r,maxR){if(!solidAt(x,y,r))return [x,y];for(let R=4;R<=(maxR||64);R+=4)for(let k=0;k<16;k++){const a=k/16*TAU,nx=x+Math.cos(a)*R,ny=y+Math.sin(a)*R;if(nx>r&&ny>r&&nx<L.w-r&&ny<L.h-r&&!solidAt(nx,ny,r))return [nx,ny]}return null}
function unstick(z){const nw=L.nw;let best=null,bd=1e9;
  if(nw&&L.nd){const cx=Math.floor(z.x/NS),cy=Math.floor(z.y/NS);
    for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++){if(!i&&!j)continue;const nx=cx+i,ny=cy+j;if(nx<0||ny<0||nx>=nw||ny>=L.nh)continue;const k=ny*nw+nx;if(L.nb[k]||L.nd[k]<0)continue;const px=(nx+.5)*NS,py=(ny+.5)*NS;if(solidAt(px,py,z.r))continue;const sc=L.nd[k]*2+Math.hypot(i,j);if(sc<bd){bd=sc;best=[px,py]}}}
  if(!best){const f=freeSpot(z.x,z.y,z.r,48);if(f&&(f[0]!==z.x||f[1]!==z.y))best=f}
  if(best){z.x=best[0];z.y=best[1];z.kbx=z.kby=0;z.unst=(z.unst||0)+1}}
function flowTo(tx,ty){if(!L.nw)buildNav();const nw=L.nw,nh=L.nh,nd=new Int16Array(nw*nh).fill(-1),q=new Int32Array(nw*nh);let h=0,t=0;
  const sx=Math.floor(tx/NS),sy=Math.floor(ty/NS);let s=-1;
  for(let r=0;r<4&&s<0;r++)for(let j=-r;j<=r&&s<0;j++)for(let i=-r;i<=r&&s<0;i++){const x=sx+i,y=sy+j;if(x>=0&&y>=0&&x<nw&&y<nh&&!L.nb[y*nw+x])s=y*nw+x}
  if(s<0)return nd;nd[s]=0;q[t++]=s;
  while(h<t){const c=q[h++],cx=c%nw,cy=(c/nw)|0,d=nd[c]+1;
    if(cx>0&&!L.nb[c-1]&&nd[c-1]<0){nd[c-1]=d;q[t++]=c-1}if(cx<nw-1&&!L.nb[c+1]&&nd[c+1]<0){nd[c+1]=d;q[t++]=c+1}
    if(cy>0&&!L.nb[c-nw]&&nd[c-nw]<0){nd[c-nw]=d;q[t++]=c-nw}if(cy<nh-1&&!L.nb[c+nw]&&nd[c+nw]<0){nd[c+nw]=d;q[t++]=c+nw}}
  return nd}
function navDirTo(e,nd){const nw=L.nw,cx=Math.floor(e.x/NS),cy=Math.floor(e.y/NS);let best=null,bd=1e9;
  for(const [dx,dy] of DIR8){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=nw||ny>=L.nh)continue;const i=ny*nw+nx;if(L.nb[i]||nd[i]<0)continue;
    if(dx&&dy&&(L.nb[cy*nw+nx]||L.nb[ny*nw+cx]))continue;const d=nd[i]+(dx&&dy?.45:0);if(d<bd){bd=d;best=[nx,ny]}}
  if(!best)return null;return Math.atan2((best[1]+.5)*NS-e.y,(best[0]+.5)*NS-e.x)}

// ---- зомби ----
const ZT={normal:{hp:40,sp:22,r:4,dmg:13},fast:{hp:30,sp:44,r:4,dmg:11},thrower:{hp:35,sp:18,r:4,dmg:10},brute:{hp:220,sp:19,r:7,dmg:0},boss:{hp:700,sp:34,r:6,dmg:20},crawler:{hp:30,sp:15,r:4,dmg:6},bloat:{hp:26,sp:14,r:5,dmg:0},shield:{hp:100,sp:17,r:5,dmg:14},screamer:{hp:22,sp:42,r:4,dmg:6},gunner:{hp:55,sp:20,r:4,dmg:10},raider:{hp:50,sp:30,r:4,dmg:12},armor:{hp:170,sp:17,r:5,dmg:16},spitter:{hp:40,sp:21,r:4,dmg:8}};
const CULLT={normal:1,fast:1,crawler:1,screamer:1};
const ZSPD={normal:1.25,boss:1.2,brute:1.35,fast:1.35,screamer:1.35,crawler:1.6,bloat:1.5};
function noGunCh(){return (window.C3&&C3.on)||(window.C6&&C6.on)}
// 04.11: зомби, добавленные посреди участка, не возникают на глазах — выходят из-за края экрана
function reachN(x,y){if(!L.nd||!L.nw)return true;const i=Math.floor(y/NS)*L.nw+Math.floor(x/NS);return L.nd[i]>=0}
function offView(z){const inV=(x,y)=>x>camX-6&&x<camX+W+6&&y>camY-6&&y<camY+H+6;if(!inV(z.x,z.y))return;
  let a=Math.atan2(z.y-pl.y,z.x-pl.x);if(!isFinite(a))a=rnd(0,TAU);
  for(const da of [0,.5,-.5,1,-1,1.6,-1.6,Math.PI]){const ca=Math.cos(a+da),sa=Math.sin(a+da);
    for(let r=20;r<420;r+=14){const x=z.x+ca*r,y=z.y+sa*r;if(x<8||y<8||x>L.w-8||y>L.h-8)break;if(inV(x,y))continue;if(!solidAt(x,y,z.r||4)&&reachN(x,y)){z.x=x;z.y=y;if(z.st!=='hidden'){z.st='chase';z.hunt=1}return}}}}
function addZ(type,x,y,o){o=o||{};
  const inB=L.t===0&&!L.noCull&&!o.nm&&!o.ai&&o.st!=='chase'&&!o.hid&&C1.mode!=='car'&&C1.mode!=='carK';
  if(inB&&CULLT[type]&&!addZ.dup){L.cullA=(L.cullA||0)+.4;if(L.cullA>=1){L.cullA-=1;return {dead:true,fake:1,type,x,y,hp:0,max:1,r:4,a:0,st:'idle'}}}
  if(inB&&type==='normal'&&!noGunCh()){if(L.gunA==null){L.gunA=.55;L.raidA=.3}L.gunA+=.13;L.raidA+=.06;if(L.gunA>=1){L.gunA-=1;type='gunner'}else if(L.raidA>=1){L.raidA-=1;type='raider'}else{L.armA=(L.armA==null?.35:L.armA)+.05;if(L.armA>=1){L.armA-=1;type='armor'}}}
  if(inB&&type==='thrower'){L.spA=(L.spA||0)+.5;if(L.spA>=1){L.spA-=1;type='spitter'}}
  if(inB&&type==='normal'){L.slA=(L.slA==null?.3:L.slA)+.12;if(L.slA>=1){L.slA-=1;o=Object.assign({},o,{hid:'floor',wakeR:26})}}
  if(C1.zConv)try{type=C1.zConv(type,o)}catch(e){console.warn('zConv',e.message)} // 03.11: стрелки в броне (armor.js)
  const d=ZT[type];
  const z={type,x,y,a:rnd(0,TAU),hp:d.hp,max:d.hp,sp:d.sp*rnd(.9,1.1),r:d.r,st:'idle',cd:rnd(0,1),ph:rnd(0,6),v:(Math.random()*8)|0,kbx:0,kby:0,stun:0,burn:0,wt:rnd(0,2),wa:rnd(0,TAU),wm:false,flash:0,thr:rnd(1,2.5),hid:null,wind:0,riseT:0};
  Object.assign(z,o||{});if(z.hid&&z.hid!=='floor'&&z.type!=='boss'&&!z.nm&&z.wakeR!==0)z.hid='floor'; // 04.11: никто не прячется невидимо — все лежат на виду
  if(L.t>1&&!o.vis&&!o.nm&&!o.ai&&type!=='boss'&&C1.mode==='td'&&L.armed&&L.w>W+40)offView(z);if(C1.zInit)C1.zInit(z);if(z.hid)z.st='hidden';if(z.st==='chase')z.hunt=1;
  if(!L.noCull&&C1.mode!=='car'&&C1.mode!=='carK')z.sp*=(type==='boss'||type==='brute')?1.12:1.4;
  if(C1.mode!=='car'&&C1.mode!=='carK'){z.sp*=ZSPD[type]||1.7;if(type!=='boss')z.sp=Math.min(z.sp,92)} // 02.11: зомби быстрее (обычные +25%, остальные бегут)
  L.zs.push(z);
  if(inB&&!addZ.dup&&type!=='boss'&&type!=='brute'){L.dupA=(L.dupA==null?Math.random()*.6:L.dupA)+.2;if(L.dupA>=1){L.dupA-=1;addZ.dup=1;try{const f=freeSpot(x+rnd(-10,10),y+rnd(-10,10),d.r,24);if(f&&los(x,y,f[0],f[1]))addZ(type,f[0],f[1],Object.assign({},o))}finally{addZ.dup=0}}} // 02.11: +20% зомби
  if(L.score)L.score.par+=(ZPTS[type]||100)*2.2;return z}
function mark(z,m){z.mk=m;z.mkT=1.2}
function noiseAt(x,y,r){for(const z of L.zs){if(z.dead||(z.st!=='idle'&&z.st!=='alert'))continue;const dd=D2(x,y,z.x,z.y);if(dd>r)continue;
  if(dd<r*.45&&los(x,y,z.x,z.y))wake(z);else{if(z.st!=='alert')mark(z,'?');z.st='alert';z.alT=6;z.tx=x;z.ty=y}}}
function wake(z){if(z.st==='idle'||z.st==='alert'){z.st='chase';z.rush=1.1;z.lost=0;mark(z,'!');if(Math.random()<.4)sfx('groan');
  for(const o of L.zs)if(o!==z&&!o.dead&&(o.st==='idle'||o.st==='alert')&&D2(o.x,o.y,z.x,z.y)<64&&los(o.x,o.y,z.x,z.y)){o.st='chase';o.rush=.9;o.lost=0;mark(o,'!')}}}
// 04.11 кислотный стиль: у зомби — ярко-зелёная слизь, у людей — красная кровь
const GR_RED={p:'#8a1018',a:'rgba(110,8,14,.75)',t:'rgba(30,0,4,.5)',c:'rgba(90,6,12,.8)',w:'rgba(120,8,16,.85)',d:'rgba(100,6,12,.7)'};
const GR_SLIME={p:'#7dff3a',a:'rgba(110,240,40,.8)',t:'rgba(20,70,0,.42)',c:'rgba(70,200,30,.8)',w:'rgba(140,255,60,.9)',d:'rgba(80,210,30,.75)'};
let gHum=0;const G_=()=>(gHum||!(window.NEON&&NEON.on))?GR_RED:GR_SLIME;
function blood(x,y,a,n,big,hum){gHum=hum?1:0;
  for(let i=0;i<n;i++)L.fx.push({x,y,vx:Math.cos(a+rnd(-.6,.6))*rnd(20,70),vy:Math.sin(a+rnd(-.6,.6))*rnd(20,70),life:rnd(.2,.5),c:G_().p,dec:true});
  const g=L.dx;g.fillStyle=G_().a;for(let i=0;i<(big?7:2);i++){const r=rnd(1,big?5:2.5);g.beginPath();g.arc(x+Math.cos(a)*rnd(0,big?10:6)+rnd(-3,3),y+Math.sin(a)*rnd(0,big?10:6)+rnd(-3,3),r,0,TAU);g.fill()}
  gHum=0;
}
function hurtZ(z,dmg,ang,kb){
  if(z.dead||z.st==='hidden')return;
  if(C1.zHurt){dmg=C1.zHurt(z,dmg,ang);if(!(dmg>0))return} // zombies2.js
  if(C1._src==='ally'){dmg*=C1.allyMul==null?.07:C1.allyMul;kb=(kb||0)*.4} // 02.11: союзники только чуть-чуть дамажат
  z.hp-=dmg;z.flash=.08;if(z.st==='idle'||z.st==='alert')wake(z);else if(z.st==='rise')z.st='chase';
  if(kb){z.kbx+=Math.cos(ang)*kb;z.kby+=Math.sin(ang)*kb;z.stun=Math.max(z.stun,.12)}
  if(dmg>=5)blood(z.x,z.y,ang,3,false);
  if(z.type==='boss'&&z.minHp&&z.hp<=z.minHp){z.hp=z.minHp;if(L.onBossLow)L.onBossLow(z);return}
  if(z.hp<=0){z._kb=kb||0;killZ(z,ang)}
}
function killZ(z,ang){
  z.dead=true;PS.kills++;KTOT++;if(KTOT%10===0)try{localStorage.setItem('kills_total',KTOT)}catch(e){}if(KTOT>=300)unlockLeg('eye');sfx('thump',.7);blood(z.x,z.y,ang,8,true,z.human);gHum=z.human?1:0;
  const big=z.type==='brute'||z.type==='boss',S=big?32:24,body=zBody(z.type,z.v);
  const tmp=mk(S),tg=tmp.getContext('2d');tg.drawImage(body,0,0);tg.globalCompositeOperation='source-atop';tg.fillStyle=G_().t;tg.fillRect(0,0,S,S);
  wallSplat(z.x,z.y,ang,big);gHum=0;
  const c={x:z.x,y:z.y,ang,S,tmp,burn:z.burn>0,v:z._kb>0?clamp(45+z._kb*.45,50,140)*(big?.5:1)*rnd(.85,1.15):12,tr:0};
  if(C1.mode==='td'&&L.corpses){L.corpses.push(c);hitStop(big?.11:.05);C1.shake=Math.max(C1.shake,big?.55:.22)}else stampCorpse(c);
  scoreKill(z);
  if(C1.onKillAny)try{C1.onKillAny(z)}catch(e){console.warn(e)}
  if((z.type==='gunner'||z.type==='raider'||z.azg)&&C1.armedDrop)try{C1.armedDrop(z)}catch(e){}
  if(z.type==='bloat')boom(z.x,z.y,z);
  if(L.onKill)L.onKill(z);
}
// ---- «сочность»: хитстоп, отлёт трупов, кровь на стенах, гильзы, отдача ----
function boom(x,y,src){
  const pv=C1._src;C1._src='boom';setTimeout(()=>{},0);
  sfx('boom');C1.shake=Math.max(C1.shake,.8);hitStop(.09);noiseAt(x,y,200);
  for(let i=0;i<26;i++){const a=rnd(0,TAU),sp=rnd(30,110);L.fx.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:rnd(.2,.55),c:i%3?'#a8c040':'#6a8a2a'})}
  for(let i=0;i<8;i++)L.fx.push({x:x+rnd(-8,8),y:y+rnd(-8,8),vx:rnd(-8,8),vy:rnd(-12,-2),life:1.6,c:'smoke'});
  const g=L.dx;g.fillStyle='rgba(90,110,30,.55)';g.beginPath();g.arc(x,y,16,0,TAU);g.fill();g.fillStyle='rgba(60,70,20,.5)';for(let i=0;i<14;i++){const a=rnd(0,TAU),r=rnd(10,28);g.fillRect(Math.round(x+Math.cos(a)*r),Math.round(y+Math.sin(a)*r),2,2)}
  for(const z of L.zs){if(z===src||z.dead||z.st==='hidden')continue;const d=D2(x,y,z.x,z.y);if(d<38){const a=Math.atan2(z.y-y,z.x-x);hurtZ(z,(z.type==='boss'?40:95)*(1-d/60),a,240)}}
  C1._src=pv;
  if(D2(x,y,pl.x,pl.y)<32&&C1.mode==='td'){hurtPlayer(26);note('Раздутый рванул рядом!')}
}
function spray(){
  const a=pl.a,ca=Math.cos(a),sa=Math.sin(a);
  for(let i=0;i<3;i++){const aa=a+rnd(-.3,.3),sp=rnd(110,170);L.fx.push({x:pl.x+ca*12,y:pl.y+sa*12,vx:Math.cos(aa)*sp,vy:Math.sin(aa)*sp,life:rnd(.25,.4),c:'foam'})}
  for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const d=D2(pl.x,pl.y,z.x,z.y);if(d>58)continue;const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(Math.abs(angDiff(za,a))>.5)continue;
    const hv=z.type==='brute'||z.type==='boss'?8:30;z.kbx+=Math.cos(za)*hv;z.kby+=Math.sin(za)*hv;z.stun=Math.max(z.stun,.4);z.burn=0;z.fuse=0;if(z.st==='idle'||z.st==='rise')z.st='chase'}
  for(const f of L.fires){const d=D2(pl.x,pl.y,f.x,f.y);if(d<70&&Math.abs(angDiff(Math.atan2(f.y-pl.y,f.x-pl.x),a))<.6)f.t=Math.min(f.t,1.1)-.08}
}
const BARK={crawler:'Осторожно, ползуны! Прячутся внизу и хватают за ноги.',bloat:'Раздутый! Не подпускай — рванёт. Стреляй издалека, пусть заберёт с собой остальных.',shield:'Охрана со щитами! Пули спереди не возьмут. Заходи сбоку или бей в упор.',screamer:'Крикун! Снимай его первым, иначе сбежится весь этаж.',gunner:'Охрана со стволами! Красный лазер — значит целится. Уходи с линии или за стену.',raider:'Мародёры! Живые, бьют очередями и прячутся. Обходи с фланга.',armor:'Зомби в бронежилете — пули в лоб вязнут. Заходи со спины или сбей с ног пинком.',spitter:'Плевун! Кислота заражает. Не стой на месте.'};
function hitStop(t){} // 06.11: без стоп-кадра на убийствах (просьба Натальи)
function stampCorpse(c){const g=L.dx,S=c.S,a=c.ang;
  g.fillStyle=G_().c;g.beginPath();g.ellipse(c.x+Math.cos(a)*2,c.y+Math.sin(a)*2,S*.32,S*.24,a,0,TAU);g.fill();
  g.save();g.translate(Math.round(c.x),Math.round(c.y));g.rotate(a+Math.PI);g.scale(1.1,.85);g.drawImage(c.tmp,-S/2,-S/2);g.restore();
  if(c.burn){g.fillStyle='rgba(20,14,10,.5)';g.beginPath();g.arc(c.x,c.y,S*.35,0,TAU);g.fill()}}
function wallSplat(x,y,ang,big){const g=L.dx;
  for(let r=0;r<(big?7:4);r++){const a=ang+rnd(-.55,.55),len=rnd(16,big?46:32);let px=x,py=y;
    for(let d=4;d<len;d+=2){px=x+Math.cos(a)*d;py=y+Math.sin(a)*d;
      if(shotBlock(px,py)){g.fillStyle=G_().w;for(let i=0;i<6;i++){const s=rnd(1,2.6);g.fillRect(Math.round(px+rnd(-3,3)),Math.round(py+rnd(-3,3)),Math.round(s),Math.round(s))}
        g.fillStyle=G_().d;for(let i=0;i<3;i++)g.fillRect(Math.round(px+rnd(-2,2)),Math.round(py),1,Math.round(rnd(2,6)));break}
      if(Math.random()<.18){g.fillStyle=G_().a;g.fillRect(Math.round(px),Math.round(py),1+(Math.random()<.3),1)}}}}
function ejectCase(a,shell){if(!L.cas)return;const e=a+Math.PI/2+rnd(-.35,.35),sp=rnd(45,75);
  L.cas.push({x:pl.x+Math.cos(a)*4,y:pl.y+Math.sin(a)*4,vx:Math.cos(e)*sp,vy:Math.sin(e)*sp,r:rnd(0,3),vr:rnd(-20,20),shell,t:0});if(L.cas.length>60)L.cas.shift()}
function juiceUpdate(dt){
  if(C1.rx||C1.ry){const k=Math.exp(-18*dt);C1.rx*=k;C1.ry*=k;if(Math.abs(C1.rx)+Math.abs(C1.ry)<.05)C1.rx=C1.ry=0}
  const g=L.dx;
  for(const c of L.corpses){const st=c.v*dt,nx=c.x+Math.cos(c.ang)*st,ny=c.y+Math.sin(c.ang)*st;
    if(solidAt(nx,ny,3)){c.v=0}else{c.x=nx;c.y=ny;c.tr+=st;if(c.tr>2.5){c.tr=0;g.fillStyle=G_().d;g.fillRect(Math.round(c.x+rnd(-2,2)),Math.round(c.y+rnd(-2,2)),2,1+(Math.random()<.5))}}
    c.v*=Math.exp(-7*dt);if(c.v<6){c.done=true;stampCorpse(c)}}
  if(L.corpses.length)L.corpses=L.corpses.filter(c=>!c.done);
  for(const c of L.cas){c.t+=dt;const nx=c.x+c.vx*dt,ny=c.y+c.vy*dt;
    if(shotBlock(nx,ny)){c.vx*=-.4;c.vy*=-.4}else{c.x=nx;c.y=ny}
    const k=Math.exp(-6*dt);c.vx*=k;c.vy*=k;c.r+=c.vr*dt;c.vr*=k;
    if(c.t>.7||Math.hypot(c.vx,c.vy)<4){c.done=true;g.fillStyle=c.shell?'#a8322a':'#b89040';g.fillRect(Math.round(c.x),Math.round(c.y),c.shell?2:1+(Math.cos(c.r)>0),c.shell?2:1+(Math.cos(c.r)<=0))}}
  if(L.cas.length)L.cas=L.cas.filter(c=>!c.done);
}
function juiceDraw(){
  for(const c of L.corpses){ctx.save();ctx.translate(Math.round(c.x),Math.round(c.y));ctx.rotate(c.ang+Math.PI);ctx.scale(1.1,.85);ctx.drawImage(c.tmp,-c.S/2,-c.S/2);ctx.restore()}
  for(const c of L.cas){const h=Math.round(Math.sin(Math.min(1,c.t/.5)*Math.PI)*3);if(c.shell){F(c.x,c.y-h,2,2,'#d8483a');F(c.x,c.y-h,2,1,'#e8c050')}else F(c.x,c.y-h,Math.cos(c.r)>0?2:1,Math.cos(c.r)>0?1:2,'#f0c860')}
}
function muzzle(x,y,a,big){const n=big?9:6,ca=Math.cos(a),sa=Math.sin(a);
  for(let i=0;i<n;i++){const k=i/n;F(x+ca*i-.5,y+sa*i-.5,big&&i<4?3:2,big&&i<4?3:2,k<.3?'#ffffff':k<.6?'#ffe27a':'#ff8a20')}
  const pa=a+Math.PI/2;for(const s of [-1,1]){const L2=big?4:3;for(let i=1;i<=L2;i++)F(x+ca*2+Math.cos(pa)*s*i,y+sa*2+Math.sin(pa)*s*i,1,1,i<2?'#fff6c0':'#ffb040')}
  F(x-1,y-1,3,3,'#ffffff')}
function hurtPlayer(d,src){
  if(PS.inv>0||C1.over||dlg||cut||C1.colView||!L||!L.armed&&src!=='fire')return;
  if(C1.hard)d*=C1.dmgMul||1.2;C1._hsrc=src;if(C1.armorHit)d=C1.armorHit(d);C1._hsrc=null;
  PS.hp-=d;PS.inv=.55;C1.hurt=.5;if(L&&L.score)L.score.hits++;C1.shake=Math.max(C1.shake,.35);sfx('hurt');blood(pl.x,pl.y,rnd(0,TAU),3,false,1);
  if(PS.hp<=0)loseLife();
}
function loseLife(){
  if(C1.hard){PS.lives=0;PS.hp=0;C1.shake=1;gameOver();return}
  PS.lives--;PS.hp=0;C1.shake=1;
  if(PS.lives>0){PS.hp=PS.max;PS.inv=2.5;PS.regen=0;
    if(C1.mode==='td'){for(const z of L.zs){const d=D2(pl.x,pl.y,z.x,z.y);if(d<50&&!z.dead){const a=Math.atan2(z.y-pl.y,z.x-pl.x);z.kbx+=Math.cos(a)*220;z.kby+=Math.sin(a)*220;z.stun=1}}}
    note('Тебя порвали... Осталось жизней: '+PS.lives);
  }else gameOver();
}
function gameOver(){C1.over={t:0};C1.mdown=false;sfx('thump');}

// ---- оружие ----
// slot: m — одноручное (холодное), p — пистолет, t — двуручное. am — тип патронов (поле PS), mag — магазин, rt — перезарядка, с.
const WD={
  bat:{slot:'m',n:'БИТА',pose:'bat',ml:{cd:.42,sw:.22,reach:19,arc:1.15,dmg:26,boss:18,kb:150,snd:'bat'}},
  kukri:{slot:'m',n:'КУКРИ',pose:'none',ml:{cd:.28,sw:.15,reach:18,arc:1.25,dmg:46,boss:26,kb:80,snd:'axe',bleed:1}},
  shovel:{slot:'m',n:'ЛОПАТА БАТИ',pose:'none',ml:{cd:.58,sw:.3,reach:31,arc:1.0,dmg:38,boss:22,kb:260,snd:'bat'}},
  pistol:{slot:'p',n:'ПИСТОЛЕТ',pose:'pistol',am:'ammo',mag:12,rt:1.0,cd:.26,dmg:20,sp:420,life:.6,spr:.04,kb:50,snd:'shot',noise:170},
  glock:{slot:'p',n:'ГЛОК 17 «КИСЛОТА»',pose:'pistol',am:'ammo',mag:16,rt:1.1,cd:.16,dmg:15,sp:440,life:.6,spr:.05,kb:30,snd:'shot',noise:150,acid:1,col:'#8aff3a'},
  deagle:{slot:'p',n:'ЗОЛОТОЙ DESERT EAGLE',pose:'pistol',am:'p50',mag:8,rt:1.5,cd:.42,dmg:85,sp:580,life:.7,spr:.02,kb:160,pierce:1,snd:'slug',noise:230,shake:.25,col:'#ffe890'},
  shotgun:{slot:'t',n:'ДРОБОВИК АНИСА',pose:'shotgun',am:'shells',mag:6,rt:2.0,cd:.7,pel:8,dmg:15,sp:400,life:.24,spr:.32,kb:90,snd:'shotgun',noise:220,shake:.35,col:'#ffcf6a'},
  ak:{slot:'t',n:'КАЛАШ',pose:'shotgun',am:'r762',mag:30,rt:1.8,cd:.11,dmg:24,sp:480,life:.6,spr:.075,kb:55,snd:'rifle',noise:200,shake:.12},
  m4:{slot:'t',n:'M4A1',pose:'shotgun',am:'r556',mag:30,rt:1.4,cd:.085,dmg:25,sp:520,life:.65,spr:.035,kb:50,snd:'rifle',noise:180,shake:.1},
  rpk:{slot:'t',n:'РПК',pose:'shotgun',am:'r762',mag:80,rt:3.0,cd:.09,dmg:28,sp:500,life:.65,spr:.09,kb:70,snd:'rifle',noise:220,shake:.16,slow:.85},
  awp:{slot:'t',n:'AWP',pose:'shotgun',am:'awp',mag:5,rt:2.4,cd:1.25,dmg:220,sp:950,life:.8,spr:0,kb:170,pierce:4,snd:'slug',noise:240,shake:.45,laser:1,col:'#fff2b0'},
  rail:{slot:'t',n:'РЕЛЬСОТРОН',pose:'rail',am:'cells',mag:3,rt:2.6,cd:1},
  flamer:{slot:'t',n:'ОГНЕМЁТ',pose:'flamer',am:'fuel',mag:100,rt:2.4,cd:.04},
};
const AMN={ammo:'9 мм',p50:'.50 AE',shells:'12 кал.',r762:'7,62',r556:'5,56',awp:'.338',cells:'батареи',fuel:'топливо',rockets:'ракеты',nlg:'гвозди',flr:'сигн. ракеты',bolt:'болты',pkm:'7,62 ПКМ',sp6:'СП-6',vog:'ВОГ'};
const WNAME={};for(const k in WD)WNAME[k]=WD[k].n;
C1.WD=WD;C1.AMN=AMN;
function weapons(){const w=[],lo=PS.lo||{},br=C1.railBroken&&C1.railBroken();for(const k of [lo.m||'bat',lo.p,lo.t])if(k&&WD[k]&&!w.includes(k)&&!(br&&k==='rail'))w.push(k);for(const k of (PS.found||[]))if(WD[k]&&!w.includes(k)&&!(br&&k==='rail'))w.push(k);return w}
function giveWpn(k,fill){if(!WD[k])return;PS.own=PS.own||{};PS.own[k]=1;PS.found=PS.found||[];if(!weapons().includes(k))PS.found.push(k);PS.mag=PS.mag||{};if(WD[k].am&&PS.mag[k]==null)PS.mag[k]=0;
  if(fill&&WD[k].am){const d=WD[k],n=Math.min(d.mag-PS.mag[k],PS[d.am]||0);PS.mag[k]+=n;PS[d.am]-=n}
  if(k==='shotgun')PS.hasShotgun=true;if(k==='rail')PS.hasRail=true;if(k==='flamer')PS.hasFlame=true;if(C1.onGive)C1.onGive(k)}
C1.giveWpn=giveWpn;
function setWpn(w){if(!weapons().includes(w))return;if(PS.wpn!==w){PS.wpn=w;sfx('click');if(PS.rl>0&&PS.rlw!==w){PS.rl=0;PS.rlw=null}if(WD[w]&&WD[w].am&&(PS.mag[w]||0)<=0)startReload(true)}}
function cycleWpn(d){const ws=weapons();let i=ws.indexOf(PS.wpn);i=(i+(d||1)+ws.length)%ws.length;setWpn(ws[i])}
function slotWpn(sl){const ws=weapons().filter(k=>WD[k].slot===sl);if(!ws.length)return;const i=ws.indexOf(PS.wpn);setWpn(ws[(i+1)%ws.length])}
C1.slotWpn=slotWpn;
function magOf(w){return (PS.mag&&PS.mag[w])||0}
function startReload(quiet){const w=PS.wpn,d=WD[w];if(!d||!d.am||PS.rl>0)return false;if(magOf(w)>=d.mag)return false;
  if((PS[d.am]||0)<=0){if(!quiet)note('Нет патронов: '+AMN[d.am]);return false}
  PS.rl=d.rt*(C1.rlMul||1);PS.rlw=w;PS.rlT=PS.rl;sfx('reload');return true}
function endReload(){const w=PS.rlw,d=WD[w];PS.rl=0;PS.rlw=null;if(!d||PS.wpn!==w)return;const n=Math.min(d.mag-magOf(w),PS[d.am]||0);PS.mag[w]=magOf(w)+n;PS[d.am]-=n;sfx('click')}
C1.reload=()=>startReload(false);
function bullet(x,y,a,sp,dmg,life,pierce,kb,col){L.buls.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,dmg,life,pierce:pierce||0,kb:kb||40,hit:[],col:col||'#ffe27a'})}
function meleeHit(d){
  PS.cd=d.cd;PS.swing=d.sw;sfx('swing');let hit=false;const a=pl.a,bst=PS.beerT>0;
  for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const dd=D2(pl.x,pl.y,z.x,z.y);if(dd>z.r+d.reach)continue;const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(Math.abs(angDiff(za,a))>d.arc)continue;
    let dm=(z.type==='boss'?d.boss:d.dmg)*(bst?1.5:1);
    if(z.type!=='boss'&&!z.nm&&(z.st==='idle'||z.st==='alert'||z.down>0||Math.abs(angDiff(za,z.a))<1.0)){if(z.type==='brute')dm*=3;else dm=Math.max(dm,z.hp+1);floatT(z.x,z.y-12,z.down>0?'ДОБИЛ!':'В СПИНУ!','#ff5050');hitStop(.06)}
    hurtZ(z,dm,za,d.kb*(bst?1.8:1));if(d.bleed&&!z.dead)z.bleed=Math.max(z.bleed||0,2.5);hit=true}
  if(hit){sfx(d.snd);C1.shake=Math.max(C1.shake,.2);hitStop(.035)}
}
function attack(){
  if(PS.cd>0||PS.carry)return;
  const w=PS.wpn,d=WD[w];if(!d)return;
  const a=pl.a,mx=pl.x+Math.cos(a)*9,my=pl.y+Math.sin(a)*9;
  if(d.ml){meleeHit(d.ml);return}
  if(PS.rl>0)return;
  if(magOf(w)<=0){if(!startReload(true)){note('Патроны кончились: '+AMN[d.am]);const ws=weapons();setWpn(ws.find(k=>WD[k].am&&(magOf(k)>0||PS[WD[k].am]>0))||ws.find(k=>WD[k].ml)||'bat');PS.cd=.3}return}
  if(w==='rail'){
    PS.mag[w]--;PS.cd=1;PS.flash=.12;sfx('power',.8);sfx('slug');noiseAt(pl.x,pl.y,200);C1.shake=Math.max(C1.shake,.6);C1.rx=-Math.cos(a)*5;C1.ry=-Math.sin(a)*5;
    let ex=mx,ey=my;for(let dd=0;dd<420;dd+=3){const x=mx+Math.cos(a)*dd,y=my+Math.sin(a)*dd;if(shotBlock(x,y))break;ex=x;ey=y}
    const hitL=[];for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const t=(z.x-mx)*Math.cos(a)+(z.y-my)*Math.sin(a);if(t<0||t>Math.hypot(ex-mx,ey-my))continue;const px=mx+Math.cos(a)*t,py=my+Math.sin(a)*t;if(D2(px,py,z.x,z.y)<z.r+4)hitL.push(z)}
    for(const z of hitL)hurtZ(z,z.type==='boss'?160:400,a,260);
    (L.beams||(L.beams=[])).push({x0:mx,y0:my,x1:ex,y1:ey,life:.3});for(let i=0;i<10;i++)L.fx.push({x:ex,y:ey,vx:rnd(-60,60),vy:rnd(-60,60),life:.25,c:'#8af0ff'});
  }else if(w==='flamer'){
    PS.mag[w]=Math.max(0,PS.mag[w]-1.2);PS.cd=.04;if(Math.random()<.25)sfx('fire',.35);noiseAt(pl.x,pl.y,120);
    for(let i=0;i<3;i++){const aa=a+rnd(-.22,.22),sp=rnd(120,170);L.fx.push({x:mx,y:my,vx:Math.cos(aa)*sp,vy:Math.sin(aa)*sp,life:rnd(.3,.45),c:'flame'})}
    for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const dd=D2(pl.x,pl.y,z.x,z.y);if(dd>66)continue;const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(Math.abs(angDiff(za,a))>.38||!los(pl.x,pl.y,z.x,z.y))continue;
      z.burn=Math.max(z.burn,3);hurtZ(z,z.type==='boss'?3:7,za,12);if(z.st==='idle')wake(z)}
    if(L.onFlame)L.onFlame(mx+Math.cos(a)*40,my+Math.sin(a)*40);
  }else{
    PS.mag[w]--;PS.cd=d.cd;PS.flash=w==='awp'||w==='deagle'||w==='shotgun'?.1:.06;sfx(d.snd,w==='ak'||w==='m4'||w==='rpk'?.8:1);ejectCase(a,w==='shotgun');
    const kick=w==='shotgun'?3.5:w==='awp'?4:w==='deagle'?2.5:1.5;C1.rx=-Math.cos(a)*kick;C1.ry=-Math.sin(a)*kick;
    const n=d.pel||1;let dx0=0,dy0=0;if(d.dual){PS._dl=(PS._dl||1)*-1;dx0=Math.cos(a+Math.PI/2)*3*PS._dl;dy0=Math.sin(a+Math.PI/2)*3*PS._dl}
    for(let i=0;i<n;i++){bullet(mx+dx0,my+dy0,a+rnd(-d.spr,d.spr),n>1?rnd(d.sp*.9,d.sp*1.1):d.sp,d.dmg,d.life,d.pierce||0,d.kb,d.col);if(d.acid)L.buls[L.buls.length-1].acid=1;if(d.fire)L.buls[L.buls.length-1].fire=1;if(d.boom)L.buls[L.buls.length-1].boom=d.boom}
    noiseAt(pl.x,pl.y,d.noise||170);C1.shake=Math.max(C1.shake,d.shake||.08);
  }
  if(magOf(w)<=0.01&&PS.mag[w]<1)startReload(true);
}
function throwMol(){
  if(!L.armed)return;if(C1.altFire&&C1.altFire())return;
  if(PS.moon<=0){note('Самогона нет');return}
  let tx,ty;if(mouse.on&&!touch.on){tx=mouse.x+camX;ty=mouse.y+camY}else{tx=pl.x+Math.cos(pl.a)*80;ty=pl.y+Math.sin(pl.a)*80}
  let d=D2(pl.x,pl.y,tx,ty);const a=Math.atan2(ty-pl.y,tx-pl.x);d=clamp(d,24,110);
  PS.moon--;sfx('swing');L.mol.push({x0:pl.x,y0:pl.y,x:pl.x,y:pl.y,tx:pl.x+Math.cos(a)*d,ty:pl.y+Math.sin(a)*d,t:0,T:.3+d/260,h:0});
}
function heal(){
  if(PS.syr<=0){note((L&&L.healNone)||'Шприцов нет');return}
  if(PS.hp>=PS.max&&PS.regen<=0){note('Ты и так в порядке');return}
  PS.syr--;PS.regen+=60;sfx('pick');note((L&&L.healNote)||'Вколол зелёный шприц. Раны затягиваются...');
}
function drinkPot(){
  if(!(PS.pot>0)){note('Зелий регенерации нет');return}
  if(PS.potT>0){note('Зелье ещё действует');return}
  PS.pot--;PS.potT=60;sfx('pick');sfx('power',.4);note('Зелье регенерации: целую минуту лечит понемногу');
}
function drinkBeer(){
  if(!(PS.beer>0)){note('Пива нет. Ящик Столыпина на балконе');return}
  if(PS.beerT>0){note('Ещё не выветрилось');return}
  PS.beer--;PS.beerT=10;sfx('hiss',.6);sfx('pick');note('*пш-ш-ш* Пивной буст: бьёшь сильнее, зомби отлетают дальше');floatT(pl.x,pl.y-14,'БУСТ!','#ffd23a');
}
function toggleMode(){startReload(false)}
C1.drinkPot=drinkPot;C1.drinkBeer=drinkBeer;C1.magOf=magOf;
C1.attack=attack;C1.heal=heal;C1.throwMol=throwMol;C1.cycleWpn=cycleWpn;C1.toggleMode=toggleMode;

// ---- предметы ----
const ITEMN={nails:'Гвозди',ext:'Огнетушитель',moon:'Самогон',ammo:'Патроны',syr:'Зелёный шприц',shells:'Патроны к дробовику',food:'Еда'};
function addItem(kind,x,y,n){L.items.push({kind,x,y,n:n||1,taken:false})}
const CAPS={syr:10,moon:10,pot:5};C1.CAPS=CAPS; // 04.11: общий лимит по всей игре
function takeItem(it){
  const capK=it.kind==='syr'?'syr':it.kind==='moon'&&L.id!=='off1'?'moon':null; // самогон Аниса в офисе 1 — сюжетный, его не держим
  if(capK&&(PS[capK]|0)>=CAPS[capK]){if(!(C1.capT>0)){C1.capT=2.5;floatT(it.x,it.y,'МАКС. '+CAPS[capK],'#ff8a8a');note((capK==='syr'?'Шприцов':'Самогона')+' уже '+CAPS[capK]+' — больше не унести')}return}
  it.taken=true;sfx('pick');
  if(it.kind==='moon'){PS.moon+=it.n;floatT(it.x,it.y,'+самогон','#9ae06a')}
  if(it.kind==='ammo'){PS.ammo+=it.n;floatT(it.x,it.y,'+'+it.n+' патр.','#ffe27a')}
  if(it.kind==='shells'){PS.shells+=it.n;floatT(it.x,it.y,'+'+it.n+' дробь','#ffcf6a')}
  if(it.kind==='syr'){PS.syr+=it.n;floatT(it.x,it.y,'+шприц','#6aff9a')}
  if(it.kind==='col')colReveal(it.n,it.x,it.y);
  if(it.kind==='key1'){PS.key1=true;floatT(it.x,it.y,'КЛЮЧ-КАРТА','#ffd23a');note('Ключ-карта сисадмина! Где-то на этаже есть дверь, которую она откроет.')}
  if(it.kind==='cells'){PS.cells+=it.n;floatT(it.x,it.y,'+'+it.n+' батарей','#8af0ff')}
  if(it.kind==='fuel'){PS.fuel=Math.min(100,PS.fuel+it.n);floatT(it.x,it.y,'+самогон в бак','#ffa030')}
  if(it.kind==='nails'||it.kind==='ext'){PS.ammo+=8;floatT(it.x,it.y,'+8 патр.','#ffe27a')}
  if(it.kind==='pot'){PS.pot=(PS.pot||0)+it.n;floatT(it.x,it.y,'+зелье регенерации','#c86aff')}
  if(it.kind==='p50'||it.kind==='r762'||it.kind==='r556'||it.kind==='awp'){PS[it.kind]=(PS[it.kind]||0)+it.n;floatT(it.x,it.y,'+'+it.n+' '+AMN[it.kind],'#ffe27a')}
  if(it.kind==='rub'){if(C1.addRub)C1.addRub(it.n,it.x,it.y)}
  if(it.kind==='wpn'){giveWpn(it.n,true);setWpn(it.n);floatT(it.x,it.y,WD[it.n].n,'#ffd23a')}
  if(it.kind==='beer'&&!(window.K56&&K56.on)){PS.beer=(PS.beer||0)+1;floatT(it.x,it.y,'+пиво','#ffd23a')}
  if(C1.onPick)C1.onPick(it);
  if(L.onItem)L.onItem(it);
}
function floatT(x,y,t,c){L.texts.push({x,y,t,c,life:1.3})}
function drawItem(it){
  const x=Math.round(it.x),y=Math.round(it.y+Math.sin(tm*3+it.x)*1);
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(x-4,y+3,8,2);
  if(it.kind==='moon'){F(x-2,y-5,4,8,'#cfe8d0');F(x-1,y-7,2,2,'#cfe8d0');F(x-1,y-8,2,1,'#8a5a2a');F(x-2,y-2,4,3,'#e8e0c0')}
  else if(it.kind==='ammo'){F(x-4,y-3,8,6,'#5a6a3a');F(x-4,y-3,8,1,'#7a8a5a');F(x-2,y-1,4,2,'#e8c050')}
  else if(it.kind==='shells'){F(x-4,y-3,8,6,'#8a2a2a');F(x-4,y-3,8,1,'#aa4a4a');F(x-3,y-1,2,2,'#e8c050');F(x+1,y-1,2,2,'#e8c050')}
  else if(it.kind==='col'){const k=Math.sin(tm*5+it.x);F(x-3,y-4,7,7,'#f4f0e6');F(x-2,y-3,5,4,'#ff5a9a');F(x-2,y,5,1,'#3a5a8a');if(k>.3){F(x+3,y-7,1,3,'#fff');F(x+2,y-6,3,1,'#fff')}if(k<-.4){F(x-5,y+2,1,1,'#ffd23a')}}
  else if(it.kind==='key1'){F(x-4,y-3,8,5,'#ffd23a');F(x-3,y-2,3,3,'#2a6ad8');F(x+1,y-1,2,1,'#2a2a2a')}
  else if(it.kind==='cells'){F(x-3,y-4,6,8,'#3a4a5a');F(x-2,y-3,4,6,'#8af0ff');F(x-1,y-5,2,1,'#c8c8c8')}
  else if(it.kind==='fuel'){F(x-3,y-5,6,9,'#cfe8d0');F(x-2,y-2,4,4,'#ffa030');F(x-1,y-7,2,2,'#8a5a2a')}
  else if(it.kind==='nails'){F(x-4,y-3,8,6,'#6a6e76');F(x-4,y-3,8,1,'#8a8e96');F(x-2,y-1,4,1,'#c8ccd4');F(x-2,y+1,4,1,'#c8ccd4')}
  else if(it.kind==='ext'){F(x-2,y-6,4,10,'#c8202a');F(x-1,y-6,1,10,'#e85a5a');F(x-1,y-8,3,2,'#2a2a2a')}
  else if(it.kind==='pot'){F(x-2,y-4,5,7,'#c86aff');F(x-1,y-3,2,2,'#f0c0ff');F(x-1,y-6,3,2,'#8a5a2a');F(x-3,y+2,7,1,'#7a3ab8')}
  else if(it.kind==='p50'){F(x-4,y-3,8,6,'#8a6a1a');F(x-4,y-3,8,1,'#c8a040');F(x-2,y-1,4,2,'#ffe890')}
  else if(it.kind==='r762'){F(x-4,y-3,8,6,'#4a5a3a');F(x-4,y-3,8,1,'#6a7a5a');F(x-3,y-1,1,3,'#e8c050');F(x-1,y-1,1,3,'#e8c050');F(x+1,y-1,1,3,'#e8c050')}
  else if(it.kind==='r556'){F(x-4,y-3,8,6,'#3a4a5a');F(x-4,y-3,8,1,'#5a6a7a');F(x-3,y-1,1,3,'#e8c050');F(x-1,y-1,1,3,'#e8c050');F(x+1,y-1,1,3,'#e8c050')}
  else if(it.kind==='awp'){F(x-4,y-3,8,6,'#2a3a2a');F(x-4,y-3,8,1,'#4a6a4a');F(x-3,y-1,6,1,'#e8c050');F(x-3,y+1,6,1,'#e8c050')}
  else if(it.kind==='rub'){const k=Math.sin(tm*6+it.x);F(x-4,y-2,8,5,'#3a8a4a');F(x-3,y-1,6,3,'#5ac86a');F(x-1,y,2,1,'#e8f8e0');if(k>.6)F(x+3,y-4,1,1,'#fff')}
  else if(it.kind==='beer'&&!(window.K56&&K56.on)){F(x-2,y-4,4,7,'#d8a020');F(x-2,y-4,4,1,'#c8c8c8');F(x-1,y-2,2,2,'#fff0a0')}
  else if(it.kind==='wpn'){const k=.6+.4*Math.sin(tm*5);ctx.fillStyle=`rgba(255,210,60,${.25*k})`;ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill();F(x-6,y-1,12,3,'#2a2a30');F(x-6,y-1,12,1,'#5a5a62');F(x-2,y+2,2,3,'#3a2a1a')}
  else if(it.kind==='syr'){F(x-4,y-1,7,3,'#e8f0f0');F(x-3,y,5,1,'#3aff7a');F(x+3,y,2,1,'#c8c8c8');F(x-5,y-1,1,3,'#c8c8c8')}
}

// ---- ход игрока / камера ----
function aimAngle(){
  if(touch.on&&touch.aim&&touch.aim.moved)return Math.atan2(touch.aim.y-touch.aim.oy,touch.aim.x-touch.aim.ox);
  if(mouse.on&&!touch.on)return Math.atan2(mouse.y+camY-pl.y,mouse.x+camX-pl.x);
  return null;
}
function touchFiring(){return touch.on&&touch.aim&&touch.aim.moved&&Math.hypot(touch.aim.x-touch.aim.ox,touch.aim.y-touch.aim.oy)>12}
function inputMove(){
  let mx=0,my=0;
  if(keys.KeyW||keys.ArrowUp)my-=1;if(keys.KeyS||keys.ArrowDown)my+=1;if(keys.KeyA||keys.ArrowLeft)mx-=1;if(keys.KeyD||keys.ArrowRight)mx+=1;
  if(touch.mv){const dx=touch.mv.x-touch.mv.ox,dy=touch.mv.y-touch.mv.oy,d=Math.hypot(dx,dy);if(d>3){const k=Math.min(1,d/20);mx=dx/d*k;my=dy/d*k}}
  const l=Math.hypot(mx,my);if(l>1){mx/=l;my/=l}return [mx,my,l];
}

function tdUpdate(dt){
  stashHook();
  if(C1.hs>0){C1.hs-=dt;if(C1.shake>0)C1.shake=Math.max(0,C1.shake-dt*2.5);return}
  L.t+=dt;if(!L.corpses){L.corpses=[];L.cas=[]}juiceUpdate(dt);scoreTick(dt);if(PS.slow>0)PS.slow-=dt;if(L.beams){for(const bm of L.beams)bm.life-=dt;L.beams=L.beams.filter(b=>b.life>0)}
  if(PS.inv>0)PS.inv-=dt;if(PS.cd>0)PS.cd-=dt;if(PS.swing>0)PS.swing-=dt;if(PS.flash>0)PS.flash-=dt;if(C1.hurt>0)C1.hurt-=dt;if(C1.shake>0)C1.shake=Math.max(0,C1.shake-dt*2.5);
  if(PS.regen>0){const k=Math.min(PS.regen,22*dt);PS.hp=Math.min(PS.max,PS.hp+k);PS.regen-=k}
  if(PS.potT>0&&!dlg){PS.potT-=dt;PS.hp=Math.min(PS.max,PS.hp+1.6*dt)}
  if(PS.beerT>0&&!dlg)PS.beerT-=dt;
  if(PS.rl>0&&!dlg){PS.rl-=dt;if(PS.rlw!==PS.wpn){PS.rl=0;PS.rlw=null}else if(PS.rl<=0)endReload()}
  const free=!dlg&&!tr&&!lockMove;
  // движение
  const [mx,my,ml]=free?inputMove():[0,0,0];
  pl.mv=ml>.1;
  if(pl.mv){const wd=WD[PS.wpn];const sp=(pl.scoot?95:PS.carry?42:62)*(PS.slow>0?.5:1)*(C1.spdMul||1)*(wd&&wd.slow&&!pl.scoot?wd.slow:1)*(PS.beerT>0?1.08:1)*dt;moveEnt(pl,mx*sp,my*sp,3.5);pl.ma=Math.atan2(my,mx);pl.ph+=dt*13}
  const ta=aimAngle();let want=ta!==null?ta:(pl.mv?pl.ma:null);if(pl.scoot&&pl.mv)want=pl.ma;
  if(want!==null){pl.a+=angDiff(want,pl.a)*Math.min(1,dt*20)}
  if(free&&L.armed&&!pl.scoot&&((C1.mdown&&mouse.on&&!touch.on)||touchFiring()))attack();
  else if(free&&L.armed&&!pl.scoot&&(C1.fire||C1.fireQ)){if(PS.cd<=0){if(!(touch.aim&&touch.aim.moved))aimAssist();attack();C1.fireQ=false}}
  if(!L.armed||!free)C1.fireQ=false;
  // пока идёт диалог — мир замирает: зомби стоят, урона нет; после диалога секунда форы
  const hold=!!dlg||!!cut||(L.t<1.1&&L.armed&&!C1.noIntroHold);if(hold){C1.held=true}else if(C1.held){C1.held=false;PS.inv=Math.max(PS.inv,1)}
  // навигация
  L.navT-=dt;if(L.navT<=0){L.navT=.3;flow()}
  // зомби
  const zs=L.zs;
  for(const z of zs){if(z.dead||hold)continue;
    if(!z.chk&&(z.st!=='hidden'||z.hid==='floor')){z.chk=1;if(z.hid==='floor')z.a=rnd(0,TAU);if(solidAt(z.x,z.y,z.r)){const f=freeSpot(z.x,z.y,z.r,80);if(f){z.x=f[0];z.y=f[1]}}}
    if(z.tryMv){z.tryMv=0;z.stT=(z.stT||0)+dt;if(z.stT>=2){if(D2(z.x,z.y,z.sx||0,z.sy||0)<3&&D2(z.x,z.y,pl.x,pl.y)>36&&z.type!=='boss')unstick(z);z.stT=0;z.sx=z.x;z.sy=z.y}}else{z.stT=0;z.sx=z.x;z.sy=z.y}
    if(z.flash>0)z.flash-=dt;if(z.stun>0)z.stun-=dt;if(z.cd>0)z.cd-=dt;if(z.mkT>0)z.mkT-=dt;if(z.rush>0)z.rush-=dt;if(z.fl>0)z.fl-=dt;
    if(z.acid>0){z.acid-=dt;hurtZ(z,9*dt,0,0);if(Math.random()<dt*14)L.fx.push({x:z.x+rnd(-4,4),y:z.y+rnd(-4,4),vx:rnd(-4,4),vy:rnd(-14,-4),life:rnd(.3,.6),c:Math.random()<.5?'#8aff3a':'#4ac81a'});if(z.dead)continue}
    if(z.bleed>0){z.bleed-=dt;hurtZ(z,10*dt,0,0);if(Math.random()<dt*8)L.fx.push({x:z.x,y:z.y,vx:rnd(-6,6),vy:rnd(-6,6),life:.4,c:'#8a1018',dec:true});if(z.dead)continue}
    if(z.burn>0){z.burn-=dt;hurtZ(z,12*dt,0,0);if(Math.random()<dt*20)L.fx.push({x:z.x+rnd(-4,4),y:z.y+rnd(-4,4),vx:rnd(-5,5),vy:rnd(-25,-10),life:rnd(.2,.5),c:Math.random()<.5?'#ff8a20':'#ffd040'});if(z.dead)continue}
    if(z.kbx||z.kby){moveEnt(z,z.kbx*dt,z.kby*dt,z.r);const k=Math.exp(-9*dt);z.kbx*=k;z.kby*=k;if(Math.abs(z.kbx)+Math.abs(z.kby)<2){z.kbx=z.kby=0}}
    if(z.down>0){z.down-=dt;z.aim=0;z.burst=0;continue}
    const d=D2(z.x,z.y,pl.x,pl.y);
    if(z.st==='hidden'){if(d<(z.wakeR||36)*(z.hid==='floor'?1.4:1)&&L.armed){z.st='rise';z.riseT=.55;sfx('groan',1.4);if(z.hid==='cab')L.fx.push({x:z.x,y:z.y,vx:0,vy:0,life:.4,c:'#c8b8a0'})}continue}
    if(z.st==='rise'){z.riseT-=dt;z.a=Math.atan2(pl.y-z.y,pl.x-z.x);if(z.riseT<=0)z.st='chase';continue}
    if(z.st==='idle'||z.st==='alert'){
      if(z.st==='idle'){
        z.wt-=dt;if(z.wt<=0){z.wt=rnd(1.5,3.5);z.wa=rnd(0,TAU);z.wm=Math.random()<.5}
        if(z.wm){moveEnt(z,Math.cos(z.wa)*z.sp*.22*dt,Math.sin(z.wa)*z.sp*.22*dt,z.r);z.a+=angDiff(z.wa,z.a)*Math.min(1,dt*4);z.ph+=dt*5}
      }else if(!(z.stun>0)){z.alT-=dt;const dd=D2(z.x,z.y,z.tx,z.ty);
        if(z.alT<=0||dd<10){z.st='idle';z.wt=rnd(.5,1.5);z.wm=false}
        else{const dir=(dd<48&&los(z.x,z.y,z.tx,z.ty))?Math.atan2(z.ty-z.y,z.tx-z.x):navDir(z);
          if(dir!=null){z.tryMv=1;moveEnt(z,Math.cos(dir)*z.sp*.7*dt,Math.sin(dir)*z.sp*.7*dt,z.r);z.ph+=dt*z.sp*.25;z.a+=angDiff(dir,z.a)*Math.min(1,dt*5)}}}
      if(L.armed&&!(z.stun>0)){const off=Math.abs(angDiff(Math.atan2(pl.y-z.y,pl.x-z.x),z.a)),al=z.st==='alert',vr=(L.dark>.5&&!L.torch?95:150)*(al?1.15:1);
        if(d<22||(d<vr&&off<(al?1.45:1.05)&&los(z.x,z.y,pl.x,pl.y))||(d<46&&pl.mv&&!(PS.sneak)&&los(z.x,z.y,pl.x,pl.y)))wake(z)}
      continue;
    }
    if(!L.armed)continue;
    if(z.scr>0)z.scr-=dt;
    if(z.stun>0)continue;
    const see=d<220&&los(z.x,z.y,pl.x,pl.y);
    if(see){z.lost=0;z.lx=pl.x;z.ly=pl.y}else if(!z.hunt&&z.type!=='boss'&&!z.nm&&!z.ai){z.lost=(z.lost||0)+dt;if(z.lost>6&&d>150){z.st='alert';z.alT=6;z.tx=z.lx||pl.x;z.ty=z.ly||pl.y;mark(z,'?');continue}}
    let dir=see?Math.atan2(pl.y-z.y,pl.x-z.x):navDir(z),go=1;
    if(see&&d<150&&BARK[z.type]&&!(C1.seenT||(C1.seenT={}))[z.type]){C1.seenT[z.type]=1;note((L.ally?'Анис: ':'')+BARK[z.type])}
    if(z.type==='bloat'){if(z.fuse>0){z.fuse-=dt;go=0;if(z.fuse<=0){hurtZ(z,999,z.a,0);continue}}else if(d<17){z.fuse=.7;sfx('hiss');sfx('groan',1.5)}}
    if(z.type==='screamer'&&see){if(z.sct===undefined)z.sct=.6;z.sct-=dt;
      if(z.sct<=0){z.sct=rnd(4,5.5);z.scr=.9;sfx('scream');for(const o of L.zs)if(!o.dead&&o!==z&&o.st==='idle'&&D2(o.x,o.y,z.x,z.y)<240)wake(o)}
      if(d<80)dir=Math.atan2(z.y-pl.y,z.x-pl.x);else if(d<150)go=0}
    if(z.type==='thrower'||z.type==='spitter'||(z.type==='boss'&&d>50)){
      z.thr-=dt;const sp=z.type==='spitter';
      if(see&&d<170&&z.thr<=0){z.thr=z.type==='boss'?rnd(2.6,3.6):rnd(2,2.8);const a=Math.atan2(pl.y-z.y,pl.x-z.x)+rnd(-.08,.08);L.ebuls.push({x:z.x,y:z.y,vx:Math.cos(a)*(sp?100:115),vy:Math.sin(a)*(sp?100:115),life:1.8,dmg:z.type==='boss'?14:sp?8:10,acid:sp?1:0});z.lunge=.25;sfx(sp?'hiss':'swing',.6)}
      if(z.type!=='boss'&&see){if(d<55)dir=Math.atan2(z.y-pl.y,z.x-pl.x);else if(d<120)go=0}
    }
    if(C1.zAI&&C1.zAI[z.type]){const r=C1.zAI[z.type](z,d,see,dt,dir);dir=r.dir;go=r.go} // armor.js
    if(z.type==='gunner'||z.type==='raider'){const rd=z.type==='raider';
      if(z.aim>0){go=0;z.aim+=dt;const ta=Math.atan2(pl.y-z.y,pl.x-z.x);z.aa+=angDiff(ta,z.aa)*Math.min(1,dt*(rd?3:2.2));
        if(!see&&z.aim<.35)z.aim=0;else if(z.aim>=.6){z.aim=0;z.burst=rd?3:1;z.bt=0;z.gcd=rd?rnd(1.7,2.4):rnd(1.2,1.7)}}
      else if(z.burst>0){go=0;z.bt-=dt;if(z.bt<=0){z.bt=.12;z.burst--;const a=z.aa+rnd(-.05,.05);L.ebuls.push({x:z.x+Math.cos(a)*8,y:z.y+Math.sin(a)*8,vx:Math.cos(a)*230,vy:Math.sin(a)*230,life:1.4,dmg:rd?7:11,bul:1});z.fl=.06;sfx('shot',.45)}}
      else{if(z.gcd>0)z.gcd-=dt;
        if(see&&d<210&&d>16&&!(z.gcd>0)){z.aim=.001;z.aa=Math.atan2(pl.y-z.y,pl.x-z.x)+rnd(-.25,.25);sfx('click',.7)}
        else if(see&&d<70)dir=Math.atan2(z.y-pl.y,z.x-pl.x);
        else if(see&&rd&&d<170){dir=Math.atan2(pl.y-z.y,pl.x-z.x)+Math.PI/2*(z.sd||(z.sd=Math.random()<.5?1:-1));if(Math.random()<dt*.5)z.sd=-z.sd}
        else if(see&&d<150)go=0}
      if(z.aim>0||z.burst>0)z.a=z.aa}
    if(z.type==='brute'){
      if(z.wind>0){z.wind-=dt;go=0;if(z.wind<=0){C1.shake=Math.max(C1.shake,.6);sfx('thump');if(d<z.r+15&&PS.inv<=0){note('Громила размазал тебя одним ударом!');loseLife();PS.inv=Math.max(PS.inv,2.5)}z.cd=1.3}}
      else if(d<z.r+12&&z.cd<=0){z.wind=.6;go=0}
    }else if(z.type!=='bloat'&&d<z.r+8&&z.cd<=0){hurtPlayer(ZT[z.type].dmg);if(z.type==='crawler'&&PS.inv>0){PS.slow=1.4}z.cd=z.type==='fast'?.7:.95;z.lunge=.18}
    if(z.lunge>0)z.lunge-=dt;
    if(dir!=null&&go&&!(z.cd>.55&&d<z.r+10)){const sk=z.sp*(z.rush>0?1.6:1);z.tryMv=1;moveEnt(z,Math.cos(dir)*sk*dt,Math.sin(dir)*sk*dt,z.r);z.ph+=dt*sk*.32}
    if(z.aim>0||z.burst>0)continue;
    const fa=see?Math.atan2(pl.y-z.y,pl.x-z.x):(dir!=null?dir:z.a);z.a+=angDiff(fa,z.a)*Math.min(1,dt*6);
  }
  // расталкивание
  for(let i=0;i<zs.length;i++){const a=zs[i];if(a.dead||a.st==='hidden')continue;
    for(let j=i+1;j<zs.length;j++){const b=zs[j];if(b.dead||b.st==='hidden')continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.r+b.r+1;if(d<m&&d>.01){const p=(m-d)/2;moveEnt(a,-dx/d*p,-dy/d*p,a.r);moveEnt(b,dx/d*p,dy/d*p,b.r)}}
    const dx=a.x-pl.x,dy=a.y-pl.y,d=Math.hypot(dx,dy),m=a.r+4;if(d<m&&d>.01)moveEnt(a,dx/d*(m-d),dy/d*(m-d),a.r)}
  for(let i=zs.length-1;i>=0;i--)if(zs[i].dead)zs.splice(i,1);
  // напарник
  const A=L.ally;if(A)allyUpdate(A,dt);
  // пули
  for(const b of L.buls){
    const n=Math.max(1,Math.ceil(Math.hypot(b.vx,b.vy)*dt/3));
    for(let s=0;s<n&&b.life>0;s++){b.x+=b.vx*dt/n;b.y+=b.vy*dt/n;
      if(shotBlock(b.x,b.y)){b.life=0;for(let i=0;i<4;i++)L.fx.push({x:b.x,y:b.y,vx:rnd(-45,45),vy:rnd(-45,45),life:.15,c:'#ffe8a0'});for(let i=0;i<2;i++)L.fx.push({x:b.x,y:b.y,vx:rnd(-12,12),vy:rnd(-18,-4),life:.5,c:'#8a8478'});L.dx.fillStyle='rgba(10,8,8,.7)';L.dx.fillRect(Math.round(b.x-b.vx*.004),Math.round(b.y-b.vy*.004),1,1);break}
      for(const z of zs){if(z.dead||z.st==='hidden'||b.hit.includes(z))continue;if(D2(b.x,b.y,z.x,z.y)<z.r+2.5){b.hit.push(z);const a=Math.atan2(b.vy,b.vx);C1._src=b.ally?'ally':null;if(z.type==='shield'&&!b.ap&&!(z.stun>0)&&Math.abs(angDiff(a+Math.PI,z.a))<1.15){b.life=0;sfx('clang');z.kbx+=Math.cos(a)*b.kb*.5;z.kby+=Math.sin(a)*b.kb*.5;if(b.dmg>=100){hurtZ(z,b.dmg*.4,a,0);z.stun=.5}for(let i=0;i<5;i++)L.fx.push({x:b.x,y:b.y,vx:rnd(-50,50),vy:rnd(-50,50),life:.15,c:'#e8f0ff'});break}if((z.type==='armor'||z.arm)&&!b.ap&&Math.abs(angDiff(a+Math.PI,z.a))<1.6&&!(z.down>0)){hurtZ(z,b.dmg*(z.arm||.3),a,b.kb*.3);for(let i=0;i<3;i++)L.fx.push({x:b.x,y:b.y,vx:rnd(-40,40),vy:rnd(-40,40),life:.12,c:'#ffe8a0'});if(Math.random()<.3)sfx('clang',.5)}else hurtZ(z,b.dmg,a,b.kb);if(b.acid&&!z.dead){z.acid=Math.max(z.acid||0,3);z.flash=.1}if(b.fire&&!z.dead)z.burn=Math.max(z.burn||0,2.2);C1._src=null;sfx('hit');if(b.pierce--<=0){b.life=0;break}}}
    }
    b.life-=dt;
    if(b.boom&&b.life<=0&&!b.boomed){b.boomed=1;const R0=b.boom;sfx('thump',.5);sfx('power',.4);C1.shake=Math.max(C1.shake,.9);noiseAt(b.x,b.y,300);
      for(let i=0;i<34;i++){const q=rnd(0,TAU),v=rnd(30,140);L.fx.push({x:b.x,y:b.y,vx:Math.cos(q)*v,vy:Math.sin(q)*v,life:rnd(.25,.6),c:i%3?'flame':'#ffe27a'})}
      L.dx.fillStyle='rgba(10,8,8,.5)';L.dx.beginPath();L.dx.arc(b.x,b.y,R0*.35,0,TAU);L.dx.fill();
      for(const z of zs){if(z.dead||z.st==='hidden')continue;const dd=D2(b.x,b.y,z.x,z.y);if(dd>R0+z.r)continue;const a=Math.atan2(z.y-b.y,z.x-b.x);hurtZ(z,(z.type==='boss'?.5:1)*b.dmg*3*(1-.6*dd/R0),a,260);z.burn=Math.max(z.burn||0,2)}}
  }
  L.buls=L.buls.filter(b=>b.life>0);
  // мусор от метателей
  if(!hold)for(const b of L.ebuls){b.life-=dt;const n=b.bul?3:1;
    for(let s=0;s<n&&b.life>0;s++){b.x+=b.vx*dt/n;b.y+=b.vy*dt/n;const gv=gAt(b.x,b.y);
      if(gv===1||gv===3||(gv===2&&b.bul)){b.life=0;for(let i=0;i<(b.bul?3:1);i++)L.fx.push({x:b.x,y:b.y,vx:b.bul?rnd(-30,30):0,vy:b.bul?rnd(-30,30):0,life:b.bul?.15:.3,c:b.bul?'#ffd27a':b.acid?'#8aff3a':'#5a5a50'})}
      else if(D2(b.x,b.y,pl.x,pl.y)<(b.bul?5:6)){b.life=0;C1._eb=b.bul?1:2;hurtPlayer(b.dmg,b.acid?'acid':null);C1._eb=0;if(b.acid&&C1.infect)C1.infect(.18);if(!b.bul)note(b.acid?'Кислотой обожгло!':'Прилетело мусором!')}}}
  L.ebuls=L.ebuls.filter(b=>b.life>0);
  // молотовы
  for(const m of L.mol){m.t+=dt;const k=Math.min(1,m.t/m.T);const nx=m.x0+(m.tx-m.x0)*k,ny=m.y0+(m.ty-m.y0)*k;m.h=Math.sin(k*Math.PI)*16;
    if(shotBlock(nx,ny)||k>=1){m.done=true;igniteAt(m.x,m.y)}else{m.x=nx;m.y=ny}}
  L.mol=L.mol.filter(m=>!m.done);
  for(const f of L.fires){f.t-=dt;
    for(const z of zs){if(z.dead||z.st==='hidden')continue;if(D2(f.x,f.y,z.x,z.y)<f.r){z.burn=Math.max(z.burn,2.5);hurtZ(z,30*dt,0,0);if(z.st==='idle')wake(z)}}
    if(D2(f.x,f.y,pl.x,pl.y)<f.r-4&&PS.inv<=0){PS.hp-=7*dt;C1.hurt=Math.max(C1.hurt,.15);if(PS.hp<=0)loseLife()}
    if(Math.random()<dt*30)L.fx.push({x:f.x+rnd(-f.r,f.r)*.8,y:f.y+rnd(-f.r,f.r)*.6,vx:rnd(-4,4),vy:rnd(-30,-12),life:rnd(.3,.7),c:Math.random()<.5?'#ff7a1a':'#ffd040'});
    if(Math.random()<dt*4)L.fx.push({x:f.x+rnd(-8,8),y:f.y,vx:rnd(-3,3),vy:rnd(-14,-6),life:1.6,c:'smoke'});
    if(f.t<1.2)f.r=Math.max(4,f.r-dt*10);}
  L.fires=L.fires.filter(f=>f.t>0);
  // предметы
  if(C1.capT>0)C1.capT-=dt;
  for(const it of L.items)if(!it.taken&&D2(it.x,it.y,pl.x,pl.y)<11)takeItem(it);
  // частицы и тексты
  for(const p of L.fx){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.dec&&p.life<=0){L.dx.fillStyle='rgba(110,8,14,.8)';L.dx.fillRect(Math.round(p.x),Math.round(p.y),1,1)}}
  L.fx=L.fx.filter(p=>p.life>0);
  for(const t of L.texts){t.y-=12*dt;t.life-=dt}L.texts=L.texts.filter(t=>t.life>0);
  // взаимодействие
  C1.near=null;let best=1e9;
  if(free)for(const it of L.its){if(it.cond&&!it.cond())continue;const d=D2(it.x,it.y,pl.x,pl.y);if(d<(it.r||16)&&d<best){best=d;C1.near=it}}
  if(L.onUpdate)L.onUpdate(dt);
  // камера
  let lx=0,ly=0;if(mouse.on&&!touch.on&&L.armed){lx=clamp((mouse.x-W/2)*.28,-40,40);ly=clamp((mouse.y-H/2)*.28,-26,26)}else if(touchFiring()){lx=Math.cos(pl.a)*26;ly=Math.sin(pl.a)*18}
  // камера «с запасом»: мёртвая зона вокруг героя, у края локации заглядывает за неё (видно фон)
  const NM=window.NEON&&NEON.on?(NEON.CAMM||34):0;
  if(C1.fx==null||Math.abs(C1.fx-pl.x)>200||Math.abs(C1.fy-pl.y)>200){C1.fx=pl.x;C1.fy=pl.y}
  if(NM){const DX=22,DY=14;if(pl.x-C1.fx>DX)C1.fx=pl.x-DX;else if(C1.fx-pl.x>DX)C1.fx=pl.x+DX;if(pl.y-C1.fy>DY)C1.fy=pl.y-DY;else if(C1.fy-pl.y>DY)C1.fy=pl.y+DY}else{C1.fx=pl.x;C1.fy=pl.y}
  const tx=L.w<=W?(L.w-W)/2+clamp((C1.fx-L.w/2)*.3+lx*.5,-NM,NM):clamp(C1.fx-W/2+lx,-NM,L.w-W+NM),ty=L.h<=H?(L.h-H)/2+clamp((C1.fy-L.h/2)*.3+ly*.5,-NM*.7,NM*.7):clamp(C1.fy-H/2+ly,-NM*.7,L.h-H+NM*.7);
  const ck=Math.min(1,dt*(NM?4.5:7));C1.cx+=(tx-C1.cx)*ck;C1.cy+=(ty-C1.cy)*ck;
  camX=Math.round(C1.cx);camY=Math.round(C1.cy);
}
function igniteAt(x,y){sfx('glass');sfx('fire');L.fires.push({x,y,r:26,t:5.5});noiseAt(x,y,140);for(let i=0;i<14;i++)L.fx.push({x,y,vx:rnd(-50,50),vy:rnd(-50,50),life:rnd(.2,.5),c:'#ffd070'});
  const g=L.dx;g.fillStyle='rgba(20,12,8,.45)';g.beginPath();g.arc(x,y,20,0,TAU);g.fill()}
function allyUpdate(A,dt){
  A.cd-=dt;if(A.flash>0)A.flash-=dt;
  const d=D2(A.x,A.y,pl.x,pl.y);
  if(d>240){for(let k=0;k<12;k++){const a=pl.a+Math.PI+rnd(-1,1),r=rnd(14,26),x=pl.x+Math.cos(a)*r,y=pl.y+Math.sin(a)*r;if(!solidAt(x,y,4)){A.x=x;A.y=y;break}}}
  A.mv=false;
  if(d>30&&!A.stay){const see=los(A.x,A.y,pl.x,pl.y);const dir=see?Math.atan2(pl.y-A.y,pl.x-A.x):navDir(A);
    if(dir!=null){const sp=(d>70?72:58)*dt;moveEnt(A,Math.cos(dir)*sp,Math.sin(dir)*sp,3.5);A.ma=dir;A.mv=true;A.ph+=dt*13}}
  let tg=null,bd=150;
  if(L.armed)for(const z of L.zs){if(z.dead||z.st==='hidden'||z.st==='idle'&&D2(z.x,z.y,pl.x,pl.y)>130)continue;const dz=D2(A.x,A.y,z.x,z.y);if(dz<bd&&los(A.x,A.y,z.x,z.y)){bd=dz;tg=z}}
  const fa=tg?Math.atan2(tg.y-A.y,tg.x-A.x):(A.mv?A.ma:A.a);A.a+=angDiff(fa,A.a)*Math.min(1,dt*8);
  if(tg&&A.cd<=0&&Math.abs(angDiff(fa,A.a))<.3){A.cd=rnd(1.1,1.6);A.flash=.07;sfx('rifle',.7);bullet(A.x+Math.cos(A.a)*10,A.y+Math.sin(A.a)*10,A.a+rnd(-.07,.07),440,9,.6,0,35,'#ffe8b0');L.buls[L.buls.length-1].ally=1}
  // не стоять на месте игрока
  const dx=A.x-pl.x,dy=A.y-pl.y,dd=Math.hypot(dx,dy);if(dd<9&&dd>.01)moveEnt(A,dx/dd*(9-dd),dy/dd*(9-dd),3.5);
}


// ---- фон за пределами карты: ночной разрушенный город далеко внизу (параллакс), вместо однотонной заливки ----
let OUTP=null;
function outPattern(){
  const N=192,c=mk(N,N),g=c.getContext('2d');let sd=7;const R=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
  g.fillStyle='#0c0a12';g.fillRect(0,0,N,N);
  for(let y=0;y<N;y+=2)for(let x=0;x<N;x+=2){const h=R();if(h<.18){g.fillStyle=h<.06?'#16131e':'#110e18';g.fillRect(x,y,2,2)}}
  // кварталы: крыши домов с трещинами и швами
  const blocks=[[6,6,70,52],[96,8,84,40],[8,90,56,88],[84,70,48,58],[142,64,44,62],[84,140,100,44]];
  for(const [x,y,w,h] of blocks){g.fillStyle='#17141f';g.fillRect(x,y,w,h);g.fillStyle='#1d1927';g.fillRect(x+1,y+1,w-2,h-2);
    g.fillStyle='#141120';for(let i=x+8;i<x+w-2;i+=12)g.fillRect(i,y+1,1,h-2);for(let j=y+10;j<y+h-2;j+=14)g.fillRect(x+1,j,w-2,1);
    g.fillStyle='#0e0c14';g.fillRect(x+w,y+2,2,h);g.fillRect(x+2,y+h,w,2);
    for(let k=0;k<3;k++){g.fillStyle='#262034';g.fillRect(x+4+R()*(w-14)|0,y+4+R()*(h-12)|0,6,5)}
    for(let k=0;k<5;k++){const lx=x+3+R()*(w-6)|0,ly=y+3+R()*(h-6)|0;g.fillStyle=R()<.5?'#3a2a16':'#1a2a3a';g.fillRect(lx,ly,1,1)}
    let cx=x+R()*w,cy=y+R()*h;g.fillStyle='#0d0b13';for(let i=0;i<14;i++){cx+=R()*3-1;cy+=R()*3-1;if(cx>x&&cx<x+w&&cy>y&&cy<y+h)g.fillRect(cx|0,cy|0,1,1)}}
  // улицы: разметка, брошенные машины, обломки, огоньки
  g.fillStyle='#2a2630';for(let x=0;x<N;x+=10)g.fillRect(x,66,5,1);for(let y=0;y<N;y+=10)g.fillRect(80,y,1,5);
  const car=(x,y,col,v)=>{g.fillStyle='#08070c';v?g.fillRect(x+1,y+1,6,11):g.fillRect(x+1,y+1,11,6);g.fillStyle=col;v?g.fillRect(x,y,6,11):g.fillRect(x,y,11,6);g.fillStyle='#0e1420';v?g.fillRect(x+1,y+3,4,5):g.fillRect(x+3,y+1,5,4)};
  car(20,68,'#3a1a22',0);car(150,58,'#1e2a36',0);car(72,110,'#2c2c30',1);car(186,150,'#3a2a14',1);car(40,184,'#22202a',0);
  for(let k=0;k<70;k++){g.fillStyle=['#221e2a','#2a2430','#1a1620','#302a36'][k%4];g.fillRect(R()*N|0,R()*N|0,1+(R()<.3),1)}
  for(const [x,y] of [[78,62],[134,182],[4,186],[188,90]]){g.fillStyle='#ff7a2a';g.fillRect(x,y,1,1);g.fillStyle='rgba(255,110,30,.18)';g.fillRect(x-2,y-2,5,5)}
  for(const [x,y,col] of [[60,30,'rgba(255,42,122,.5)'],[120,120,'rgba(58,220,200,.4)'],[30,140,'rgba(255,210,58,.35)']]){g.fillStyle=col;g.fillRect(x,y,4,1)}
  return c}
function carveVoid(){
  L._void=1;const w=Math.round(L.w*Q),h=Math.round(L.h*Q),TQ=TS*Q;if(w*h>1e7)return;
  let id;try{id=L.bx.getImageData(0,0,w,h)}catch(e){return}const d=id.data,gw=L.gw,gh=L.gh;
  const deep=(x,y)=>{for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const xx=x+i,yy=y+j;if(xx<0||yy<0||xx>=gw||yy>=gh)continue;if(L.g[yy*gw+xx]!==1)return false}return true};
  const cnt={},cells=[];
  for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){if(L.g[y*gw+x]!==1||!deep(x,y))continue;
    const p0=((y*TQ)*w+x*TQ)*4;let uni=true;const c0=d[p0]<<16|d[p0+1]<<8|d[p0+2];
    for(let j=0;j<TQ&&uni;j++)for(let i=0;i<TQ;i++){const px=x*TQ+i,py=y*TQ+j;if(px>=w||py>=h)continue;const p=(py*w+px)*4;if((d[p]<<16|d[p+1]<<8|d[p+2])!==c0||d[p+3]<250){uni=false;break}}
    if(uni){cnt[c0]=(cnt[c0]||0)+1;cells.push([x,y,c0])}}
  let best=null,bn=0;for(const k in cnt)if(cnt[k]>bn){bn=cnt[k];best=+k}
  if(bn<12)return;
  // не трогаем «светлые» заливки (это не стены, а чья-то крыша/пол)
  const lum=((best>>16&255)+(best>>8&255)+(best&255))/3;if(lum>70)return;L._voidC=best;
  for(const [x,y,c] of cells){if(c!==best)continue;for(let j=0;j<TQ;j++)for(let i=0;i<TQ;i++){const px=x*TQ+i,py=y*TQ+j;if(px<w&&py<h)d[(py*w+px)*4+3]=0}}
  // тёмная кромка по краю провала — глубина
  const a=new Uint8Array(w*h);for(let i=0;i<w*h;i++)a[i]=d[i*4+3]===0?1:0;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(a[i]||!(a[i-1]||a[i+1]||a[i-w]||a[i+w]))continue;const p=i*4;d[p]=d[p]*.55|0;d[p+1]=d[p+1]*.55|0;d[p+2]=d[p+2]*.55|0}
  L.bx.putImageData(id,0,0);
}
function drawOutside(sx,sy){
  if(!L._void)carveVoid();
  if(window.NEON&&NEON.on&&NEON.outside){try{NEON.outside(L,sx,sy);return}catch(e){console.warn(e)}}
  if(!OUTP)OUTP=outPattern();const N=192;
  const px=((-camX*.55+sx)%N+N)%N-N,py=((-camY*.55+sy)%N+N)%N-N;
  for(let y=py;y<H;y+=N)for(let x=px;x<W;x+=N)ctx.drawImage(OUTP,Math.round(x),Math.round(y));
  ctx.fillStyle='rgba(4,3,8,.35)';ctx.fillRect(0,0,W,H);
}

// ---- отрисовка «вид сверху» ----
function sprAt(c,x,y,a,S){S=S||24;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(a);ctx.drawImage(c,-S/2,-S/2);ctx.restore()}
function drawZ(z){
  const big=z.type==='brute'||z.type==='boss',S=big?32:24;
  if(z.st==='hidden'){
    if(z.hid==='floor'){const tw=Math.sin(tm*1.3+z.x*3)>.992?1:0;shadowBlob(z.x,z.y,6);ctx.save();ctx.translate(Math.round(z.x)+tw,Math.round(z.y));ctx.rotate(z.a+1.4);ctx.scale(1.08,.82);ctx.drawImage(zDark(z.type,z.v),-12,-12);ctx.restore()}
    if(z.hid!=='floor'){shadowBlob(z.x,z.y,6);ctx.save();ctx.translate(Math.round(z.x),Math.round(z.y));ctx.rotate((z.a||0)+1.4);ctx.scale(1.08,.82);ctx.drawImage(zDark(z.type,z.v),-12,-12);ctx.restore()}
    return;
  }
  const rise=z.st==='rise'?(z.hid==='floor'?.45+.55*(1-z.riseT/.55):1-z.riseT/.55):1;
  shadowBlob(z.x,z.y,big?8:5);
  const lg=(big?legBig:legT).getContext('2d');
  if(big){lg.setTransform(Q,0,0,Q,0,0);lg.clearRect(0,0,32,32);lg.setTransform(1.33*Q,0,0,1.33*Q,0,0);legs(lg,z.ph,true,z.type==='boss'?'#2a2e38':'#3a3a2c','#1a1a1a');lg.setTransform(Q,0,0,Q,0,0)}
  else if(z.type!=='crawler')legs(lg,z.ph,z.st==='chase'||z.st==='alert'||z.wm,z.type==='shield'?'#141822':z.type==='gunner'?'#1e2430':z.type==='raider'?'#3a3424':z.type==='armor'?'#2a2e24':'#2a2a30','#1a1a1a');
  ctx.save();ctx.translate(Math.round(z.x),Math.round(z.y));ctx.rotate(z.a);
  if(rise<1){ctx.globalAlpha=rise;ctx.scale(.6+.4*rise,.6+.4*rise)}
  if(z.sc)ctx.scale(z.sc,z.sc);
  if(z.down>0){ctx.rotate(1.3);ctx.scale(1.05,.7);ctx.globalAlpha=.85}
  if(z.type!=='crawler'&&!(z.down>0))ctx.drawImage(big?legBig:legT,-S/2,-S/2);else ctx.translate(Math.sin(z.ph*2)*1,0);
  if(z.type==='bloat'){const k=1+.06*Math.sin(tm*6+z.x)+(z.fuse>0?.18*(1-z.fuse/.7):0);ctx.scale(k,k)}
  let ox=0;if(z.lunge>0)ox=3;if(z.wind>0)ox=-3+Math.sin(tm*40)*1;
  ctx.drawImage(zBody(z.type,z.v),-S/2+ox,-S/2);
  if(z.flash>0||(z.fuse>0&&Math.floor(tm*14)%2)){const sb=zBody(z.type,z.v);const fc=window.__flC||(window.__flC=document.createElement('canvas'));if(fc.width!==sb.width||fc.height!==sb.height){fc.width=sb.width;fc.height=sb.height}const fg=fc.getContext('2d');fg.globalCompositeOperation='source-over';fg.clearRect(0,0,fc.width,fc.height);fg.drawImage(sb,0,0);fg.globalCompositeOperation='source-atop';fg.fillStyle=z.fuse>0?'rgba(255,240,80,.6)':'rgba(255,255,255,.8)';fg.fillRect(0,0,fc.width,fc.height);ctx.drawImage(fc,-S/2+ox,-S/2)}
  ctx.restore();
  if(z.scr>0){const r=(1-z.scr/.9)*60;ctx.strokeStyle=`rgba(255,80,120,${z.scr})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(z.x,z.y,r,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(z.x,z.y,r*.6,0,TAU);ctx.stroke()}
  if(z.wind>0){ctx.strokeStyle=`rgba(255,40,40,${.5+.5*Math.sin(tm*30)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(z.x,z.y,z.r+15,0,TAU);ctx.stroke()}
  if(z.burn>0){for(let i=0;i<3;i++)F(z.x+rnd(-5,4),z.y+rnd(-6,3),2,3,Math.random()<.5?'#ff7a1a':'#ffd040')}
  if(z.aim>0||z.burst>0){const ca=Math.cos(z.aa),sa=Math.sin(z.aa),x0=z.x+ca*7,y0=z.y+sa*7;let ex=x0,ey=y0;for(let q=0;q<260;q+=2){const x=x0+ca*q,y=y0+sa*q,gv=gAt(x,y);if(gv===1||gv===3||gv===2)break;ex=x;ey=y}
    const k=z.burst>0?1:Math.min(1,z.aim/.6),bl=k>.75&&Math.floor(tm*20)%2;ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,${bl?120:30},30,${.25+.6*k})`;ctx.lineWidth=k>.75?1:.6;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(ex,ey);ctx.stroke();F(ex-1,ey-1,2,2,'rgba(255,60,60,.9)');ctx.restore()}
  if(z.fl>0)muzzle(z.x+Math.cos(z.aa)*10,z.y+Math.sin(z.aa)*10,z.aa,false);
  if(z.down>0){for(let i=0;i<3;i++){const q=tm*5+i*2.1;F(z.x+Math.cos(q)*6,z.y-9+Math.sin(q)*2,1,1,'#ffe060')}}
  if(z.mkT>0&&z.mk){const bo=Math.max(0,(z.mkT-.95)*20);ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.fillStyle='#000';ctx.fillText(z.mk,z.x+1,z.y-12-bo+1);ctx.fillStyle=z.mk==='!'?'#ff3030':'#ffd23a';ctx.fillText(z.mk,z.x,z.y-12-bo);ctx.textAlign='left'}
}
function drawPlayerTD(){
  const w=pl.scoot?'scoot':(!L.armed?null:PS.wpn);
  if(PS.inv>0&&Math.floor(tm*16)%2===0&&L.armed)return;
  shadowBlob(pl.x,pl.y,6);
  if(pl.scoot){spr(sprScoot,pl.x,pl.y,pl.a)}else{{const sl=C1.skinLegs&&C1.skinLegs(L.hero);legs(legCv.getContext('2d'),pl.ph,pl.mv,sl?sl[0]:L.hero?L.hero.leg:'#1c1c22',sl?sl[1]:L.hero?L.hero.shoe:'#9a9ca2')}spr(legCv,pl.x,pl.y,pl.mv?pl.ma:pl.a)}
  const HE=L.hero,wd=w&&WD[w],gs=sprMk.getContext('2d');(HE?HE.draw:drawMik)(gs,wd?wd.pose:w,PS.carry);if(C1.skinFx)try{C1.skinFx(gs,HE)}catch(e){}if(wd&&!pl.scoot&&!PS.carry)gunOverlay(gs,w);sprVol(gs);
  if(wd&&wd.laser&&L.armed&&!dlg&&!pl.scoot){const ca=Math.cos(pl.a),sa=Math.sin(pl.a),x0=pl.x+ca*12,y0=pl.y+sa*12;let ex=x0,ey=y0;for(let d=0;d<300;d+=2){const x=x0+ca*d,y=y0+sa*d;if(shotBlock(x,y))break;ex=x;ey=y}
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,30,30,.55)';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(ex,ey);ctx.stroke();F(ex-1,ey-1,2,2,'rgba(255,60,60,.9)');ctx.restore()}
  let a=pl.a;const ml=wd&&wd.ml;if(ml&&PS.swing>0&&L.armed){const k=1-PS.swing/ml.sw;a+=-1.3+k*2.6}
  spr(sprMk,pl.x,pl.y,a);
  if(PS.flash>0&&wd&&wd.am&&w!=='flamer')muzzle(pl.x+Math.cos(pl.a)*12,pl.y+Math.sin(pl.a)*12,pl.a,w==='shotgun'||w==='awp'||w==='deagle')
}
function drawAlly(A){
  shadowBlob(A.x,A.y,6);legs(legT.getContext('2d'),A.ph,A.mv,'#24242a','#3a2a1a');spr(legT,A.x,A.y,A.mv?A.ma:A.a);
  drawAnisSpr(sprA.getContext("2d"));sprVol(sprA.getContext("2d"));spr(sprA,A.x,A.y,A.a);
  if(A.flash>0)muzzle(A.x+Math.cos(A.a)*13,A.y+Math.sin(A.a)*13,A.a,true)
}
function tdRender(){
  ctx.imageSmoothingEnabled=false;
  const sx=(C1.shake>0?rnd(-3,3)*C1.shake:0)+(C1.rx||0),sy=(C1.shake>0?rnd(-3,3)*C1.shake:0)+(C1.ry||0);
  drawOutside(sx,sy);
  ctx.save();ctx.translate(Math.round(-camX+sx),Math.round(-camY+sy));
  if(!L._hd){L._hd=1;hdTexture(L.bg,true)}
  if(window.NEON&&NEON.on&&!L._neon){L._neon=1;try{NEON.stylize(L)}catch(e){console.warn(e)}}
  ctx.drawImage(L.bg,0,0);ctx.drawImage(L.dec,0,0);
  if(L.drawUnder)L.drawUnder();
  if(L.corpses)juiceDraw();
  for(const it of L.items)if(!it.taken)drawItem(it);
  if(L.stash)for(const st of L.stash)if(!st.done)drawGlint(st);
  for(const f of L.fires){for(let i=0;i<10;i++){const a=hash(i,Math.floor(tm*12))*TAU,r=hash(i+5,Math.floor(tm*12))*f.r*.85;const h=2+hash(i,i+Math.floor(tm*10))*5;F(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r*.7-h,2,h,i%3?'#ff7a1a':'#ffd040')}}
  const ents=[];
  for(const z of L.zs)ents.push(z);
  ents.sort((a,b)=>a.y-b.y);
  for(const z of ents)drawZ(z);
  for(const n of L.npcs)n.draw();
  if(L.ally)drawAlly(L.ally);
  drawPlayerTD();
  for(const b of L.buls){ctx.strokeStyle=b.col;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(b.x-b.vx*.018,b.y-b.vy*.018);ctx.lineTo(b.x,b.y);ctx.stroke()}
  for(const b of L.ebuls){if(b.bul){ctx.strokeStyle='#ffcf6a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(b.x-b.vx*.03,b.y-b.vy*.03);ctx.lineTo(b.x,b.y);ctx.stroke();F(b.x,b.y,1,1,'#fff6d0')}else if(b.acid){F(b.x-2,b.y-2,4,4,'#3a8a1a');F(b.x-1,b.y-2,2,2,'#8aff3a')}else{F(b.x-2,b.y-2,4,4,'#2a2a26');F(b.x-1,b.y-2,2,1,'#6a6a5a')}}
  for(const m of L.mol){F(m.x-1,m.y+2,3,1,'rgba(0,0,0,.4)');F(m.x-1,m.y-m.h-2,3,4,'#cfe8d0');F(m.x,m.y-m.h-4,1,2,Math.random()<.5?'#ff8a20':'#ffd040')}
  if(L.beams){for(const bm of L.beams){const k=bm.life/.3;ctx.strokeStyle=`rgba(140,240,255,${k})`;ctx.lineWidth=3*k+1;ctx.beginPath();ctx.moveTo(bm.x0,bm.y0);ctx.lineTo(bm.x1,bm.y1);ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${k})`;ctx.lineWidth=1;ctx.stroke()}}
  for(const p of L.fx){if(p.c==='flame'){const k=p.life/.45,r=Math.round(2+(1-k)*6);ctx.fillStyle=k>.6?'#fff0a0':k>.35?'#ffa030':'rgba(200,60,20,.7)';ctx.fillRect(Math.round(p.x-r/2),Math.round(p.y-r/2),r,r)}else if(p.c==='foam'){const r=Math.round(2+(.4-p.life)*14);ctx.fillStyle=`rgba(226,232,240,${Math.min(.75,p.life*2.2)})`;ctx.fillRect(Math.round(p.x-r/2),Math.round(p.y-r/2),r,r)}else if(p.c==='smoke'){const a=Math.min(.45,p.life*.3),r=Math.round(3+(1.6-p.life)*4);ctx.fillStyle=`rgba(30,26,28,${a})`;ctx.fillRect(Math.round(p.x-r/2),Math.round(p.y-r/2),r,r)}else F(p.x,p.y,1,1,p.c)}
  if(window.NEON&&NEON.on&&NEON.light)try{NEON.light(L)}catch(e){console.warn(e)}
  if(L.drawOver)L.drawOver();
  ctx.restore();
  // свет
  const ox=-camX+sx,oy=-camY+sy;
  if(L.dark>0){
    sh.globalCompositeOperation='source-over';sh.clearRect(0,0,W,H);
    const dk=L.dark*(L.flick?(.85+.15*Math.sin(tm*31)*Math.sin(tm*7)):1);
    sh.fillStyle=`rgba(${L.tint||'4,3,10'},${dk})`;sh.fillRect(0,0,W,H);
    sh.globalCompositeOperation='destination-out';
    const px=pl.x+ox,py=pl.y+oy,ca=Math.cos(pl.a),sa=Math.sin(pl.a);
    radial(sh,px,py,34,'rgba(255,255,255,A)',.9);
    if(L.torch){radial(sh,px+ca*28,py+sa*28,40,'rgba(255,255,255,A)',.95);radial(sh,px+ca*62,py+sa*62,50,'rgba(255,255,255,A)',.85);radial(sh,px+ca*100,py+sa*100,46,'rgba(255,255,255,A)',.6)}
    if(L.ally)radial(sh,L.ally.x+ox+Math.cos(L.ally.a)*16,L.ally.y+oy+Math.sin(L.ally.a)*16,34,'rgba(255,255,255,A)',.6);
    for(const l of L.lights)radial(sh,l[0]+ox,l[1]+oy,l[2],'rgba(255,255,255,A)',l[3]||.8);
    for(const f of L.fires)radial(sh,f.x+ox,f.y+oy,f.r*2.4,'rgba(255,255,255,A)',.95);
    if(PS.flash>0)radial(sh,px+ca*14,py+sa*14,60,'rgba(255,255,255,A)',.9);
    if(L.ally&&L.ally.flash>0)radial(sh,L.ally.x+ox,L.ally.y+oy,50,'rgba(255,255,255,A)',.8);
    ctx.drawImage(shadow,0,0);
  }
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(ox,oy);
  for(const f of L.fires)radial(ctx,f.x,f.y,f.r*2,'rgba(255,120,30,A)',.35);
  for(const gl of L.glow)radial(ctx,gl[0],gl[1],gl[2],gl[3],gl[4]*(gl[5]?(.8+.2*Math.sin(tm*gl[5])):1));
  if(PS.flash>0)radial(ctx,pl.x+Math.cos(pl.a)*14,pl.y+Math.sin(pl.a)*14,22,'rgba(255,220,120,A)',.6);
  ctx.restore();
  if(C1.hurt>0){ctx.fillStyle=`rgba(200,0,20,${C1.hurt*.5})`;ctx.fillRect(0,0,W,H)}
  if(PS.hp<35&&L.armed){ctx.fillStyle=`rgba(160,0,20,${.12+.08*Math.sin(tm*5)})`;ctx.fillRect(0,0,W,H)}
}
C1.engine={mkLevel,gfill,gAt,addZ,addItem,los,flowTo,navDirTo,freeSpot,unstick,solidAt:(x,y,r)=>solidAt(x,y,r),get L(){return L},set L(v){L=v;C1.L=v}};

// ================= ОТРИСОВКА КАРТ =================
function B(x,y,w,h,c){L.bx.fillStyle=c;L.bx.fillRect(x,y,w,h)}
function paint(x0,y0,x1,y1,kind,noFloor){
  if(!noFloor)gfill(x0,y0,x1,y1,0);
  const t=T3_;
  for(let y=y0;y<y1;y+=4)for(let x=x0;x<x1;x+=4){const h=hash(x>>2,y>>2),w=Math.min(4,x1-x),hh=Math.min(4,y1-y);
    switch(kind){
      case'carpet':{ // офисный ковролин: фиолетово-бирюзовый геометрический узор
        const tx=(x>>4),ty=(y>>4),alt=(tx+ty)%2;B(x,y,w,hh,alt?'#3a3058':'#332a4e');
        if(((x>>2)+(y>>2))%4===0)B(x+1,y+1,2,2,alt?'#4a3a72':'#2a8a8a');if(h>.93)B(x+hash(y,x)*3,y+hash(x,y)*3,t,t,'#ff4fb0');
        if(x%16===0)B(x,y,t,hh,'#2a2244');if(y%16===0)B(x,y,w,t,'#2a2244');break}
      case'tile':{const c=((x>>3)+(y>>3))%2?'#8a8e98':'#7e828c';B(x,y,w,hh,c);if(x%8===0)B(x,y,t*2,hh,'#5e6270');if(y%8===0)B(x,y,w,t*2,'#5e6270');
        if(x%8===4&&y%8===4)B(x-3,y-3,1,t,'rgba(255,255,255,.25)');if(h<.12)B(x+1,y+2,1.5,t,'rgba(30,20,50,.35)');break}
      case'wc':{const c=((x>>2)+(y>>2))%2?'#ff7ab8':'#ff92c6';B(x,y,w,hh,'#a8336d');B(x+t,y+t,w-t,hh-t,c);B(x+t,y+t,w-t*2,t,'rgba(255,255,255,.4)');break}
      case'server':{B(x,y,w,hh,(x%12===0||y%12===0)?'#1f3a4a':'#161a26');if(x%12===0)B(x,y,t,hh,'#22e5d4');if(y%12===0)B(x,y,w,t,'#1a8a9a');if(h>.94)B(x+2,y+2,.67,.67,'#7dff3a');break}
      case'kitchen':{const c=((x>>2)+(y>>2))%2?'#24d2e6':'#f1f7ff';B(x,y,w,hh,'#ff3d9a');B(x+t,y+t,w-t,hh-t,c);B(x+t,y+t,w-t*2,t,'rgba(255,255,255,.45)');break}
      case'wood':{const row=y>>2,c=hash(((x+row*13)>>4),row)<.5?'#6e4a34':'#644230';B(x,y,w,hh,c);B(x,y+hh-t,w,t,'#3e2618');if(((x+row*13)%16)<4&&x%4===0)B(x,y,t,hh,'#3e2618');if(h<.3)B(x+.5,y+1.5,2.5,t,'#7e5a40');break}
      case'parquet':{const hb=(((x>>2)+(y>>2))%2);B(x,y,w,hh,hb?'#a06a3a':'#8e5a30');if(hb)B(x,y,w,t,'#5a3420');else B(x,y,t,hh,'#5a3420');if(h<.2)B(x+1,y+2,2,t,'#b07a48');break}
      case'steel':{B(x,y,w,hh,(x%8===0)?'#6a6e7a':'#5a5e6a');if((x+y)%8===0){B(x+1,y+1,1.5,t,'#9aa0ae');B(x+1,y+1+t,1.5,t,'#3a3e4a')}break}
      case'asphalt':{B(x,y,w,hh,h<.1?'#3a3a44':h>.92?'#2a2a32':'#32323a');if(h>.97)B(x+hash(y,x)*3,y+1,2,t,'#24242a');if(h<.03)B(x+1,y+1,t,t,'#5a5a66');break}
      default:B(x,y,w,hh,'#555');
    }
  }
}
function drawWalls(top,side){
  for(let y=0;y<L.gh;y++)for(let x=0;x<L.gw;x++){
    if(L.g[y*L.gw+x]!==1)continue;const px=x*TS,py=y*TS;B(px,py,TS,TS,top||'#24202c');
    const n=(xx,yy)=>xx>=0&&yy>=0&&xx<L.gw&&yy<L.gh&&L.g[yy*L.gw+xx]!==1;
    if(n(x,y+1))B(px,py+TS-1,TS,1,side||'#4a4458');
    if(n(x,y-1))B(px,py,TS,1,'#36303f');
    if(n(x+1,y))B(px+TS-1,py,1,TS,'#3c3648');
    if(n(x-1,y))B(px,py,1,TS,'#3c3648');
  }
}
function win(x,y,w,horiz){ // окно в наружной стене
  if(horiz){B(x,y+2,w,4,'#c8ccd4');B(x+1,y+3,w-2,2,'#1a2440');for(let i=4;i<w;i+=12)B(x+i,y+2,1,4,'#c8ccd4');if(hash(x,y)>.5)B(x+3,y+3,2,1,'#ff7a30')}
  else{B(x+2,y,4,w,'#c8ccd4');B(x+3,y+1,2,w-2,'#1a2440')}
}
function deskCol(cx,y0,n){
  const x0=cx-14;
  for(let i=0;i<n;i++){const y=y0+i*24;
    B(x0-10,y+6,7,11,'#2a2a34');B(x0-9,y+7,5,9,'#34343e');B(x0+31,y+6,7,11,'#2a2a34');B(x0+32,y+7,5,9,'#34343e');
    B(x0,y,28,24,'#d0c9b9');B(x0,y,28,1,'#ece6d8');B(x0+13,y,2,24,'#a8a090');B(x0,y+23,28,1,'#8e8678');
    B(x0+9,y+5,2,13,'#141418');B(x0+17,y+5,2,13,'#141418');B(x0+8,y+7,1,9,hash(cx,y)>.6?'#3a6aa8':'#1e2430');B(x0+19,y+7,1,9,hash(y,cx)>.6?'#3a6aa8':'#1e2430');
    B(x0+3,y+8,4,8,'#3a3a40');B(x0+21,y+8,4,8,'#3a3a40');
    if(hash(cx+i,y)>.4)B(x0+2,y+18,5,4,'#f0f0f0');if(hash(y,cx+i)>.6)B(x0+22,y+2,3,3,'#c8402a');
  }
  gfill(x0,y0,x0+28,y0+n*24,2);
}
// ---- 04.11 этап 2: общие детали в новом стиле (контур, верхний блик, передняя грань, мелкие детали) ----
const OLC='#120a1a',T3_=1/3;
function shd(c,k){return shade(c,k)}
function boxN(x,y,w,h,c,hi,face){const bx=L.bx;
  bx.fillStyle='rgba(10,0,24,.42)';bx.fillRect(x+1,y+1.33,w,h);
  bx.fillStyle=OLC;bx.fillRect(x-.67,y-.67,w+1.33,h+1.33);
  B(x,y,w,h,c);const fh=Math.min(1.67,h*.25);B(x,y+h-fh,w,fh,face||shd(c,.68));
  B(x,y,w,T3_,hi||shd(c,1.35));B(x,y,T3_,h-fh,shd(c,1.15));B(x+w-T3_,y+T3_,T3_,h-fh-T3_,shd(c,.85))}
function lowBox(x,y,w,h,c,hi){boxN(x,y,w,h,c,hi);
  const k=hash(x|0,y|0);
  if(w>=6&&h>=6){ // мелкие детали на крышке: стык, ручки, стикеры
    if(k<.35){B(x+w/2-T3_/2,y+1,T3_,h-2.5,shd(c,.8))}
    else if(k<.6){B(x+1.5,y+1.5,w-3,T3_,shd(c,1.2));B(x+1.5,y+h-3,w-3,T3_,shd(c,.8))}
    else if(k<.75){B(x+1.5,y+1.5,Math.min(3,w-3),Math.min(2,h-3),['#ff2e97','#ffe23a','#22e5d4','#9b4dff'][(k*40|0)%4])}}
  gfill(x,y,x+w,y+h,2)}
function cabinet(x,y,w,h){boxN(x,y,w,h,'#7a6450','#a08a70');for(let i=3;i<w;i+=6){B(x+i,y+1,T3_,h-2.5,'#4e3e2e');B(x+i+1.5,y+h/2-1,.67,2,'#e8d098')}gfill(x,y,x+w,y+h,1)}
function plant(x,y){const bx=L.bx;bx.fillStyle='rgba(10,0,24,.4)';bx.beginPath();bx.arc(x+1,y+1.33,5.5,0,TAU);bx.fill();
  bx.fillStyle=OLC;bx.beginPath();bx.arc(x,y,3.6,0,TAU);bx.fill();bx.fillStyle='#c8572e';bx.beginPath();bx.arc(x,y,3.2,0,TAU);bx.fill();bx.fillStyle='#3a2414';bx.beginPath();bx.arc(x,y,2.4,0,TAU);bx.fill();
  for(let i=0;i<7;i++){const a=i/7*TAU+hash(x|0,i)*.5,L2=4+hash(i,y|0)*2;bx.save();bx.translate(x,y);bx.rotate(a);bx.fillStyle=OLC;bx.beginPath();bx.ellipse(L2*.55,0,L2*.6,1.5,0,0,TAU);bx.fill();bx.fillStyle=i%2?'#3ad86a':'#5aff8a';bx.beginPath();bx.ellipse(L2*.55,0,L2*.55,1.1,0,0,TAU);bx.fill();bx.fillStyle='#1f8a3a';bx.fillRect(.5,-T3_/2,L2,T3_);bx.restore()}
  gfill(x-3,y-3,x+3,y+3,2)}
function carTop(x,y,c,vert){const bx=L.bx,G2='#1a2230';
  const w=vert?16:28,h=vert?28:16;bx.fillStyle='rgba(10,0,24,.45)';bx.fillRect(x+1.5,y+2,w,h);
  bx.fillStyle=OLC;bx.fillRect(x-.67,y-.67,w+1.33,h+1.33);B(x,y,w,h,c);
  if(vert){B(x,y,w,T3_,shd(c,1.4));B(x,y,T3_,h,shd(c,1.2));B(x+w-T3_,y,T3_,h,shd(c,.7));
    const g=bx.createLinearGradient(0,y+5,0,y+11);g.addColorStop(0,'#5ab8ff');g.addColorStop(1,'#1a2a6a');bx.fillStyle=OLC;bx.fillRect(x+1.67,y+4.67,12.67,6.67);bx.fillStyle=g;bx.fillRect(x+2,y+5,12,6);B(x+3,y+5.5,4,.67,'rgba(255,255,255,.6)');
    bx.fillStyle=OLC;bx.fillRect(x+1.67,y+18.67,12.67,4.67);B(x+2,y+19,12,4,'#26324a');B(x+3,y+11,10,7,shd(c,1.15));B(x+3,y+11,10,T3_,shd(c,1.4));
    B(x+1,y+.5,3,1.2,'#fff4c0');B(x+12,y+.5,3,1.2,'#fff4c0');B(x+1,y+26.5,3,1,'#ff2a3a');B(x+12,y+26.5,3,1,'#ff2a3a');
    for(const [ix,iy] of [[-1,4],[16,4],[-1,19],[16,19]])B(x+ix,y+iy,1,5,'#111');B(x-1.5,y+9,1.5,1.2,c);B(x+16,y+9,1.5,1.2,c);gfill(x,y,x+16,y+28,2)}
  else{B(x,y,w,T3_,shd(c,1.4));B(x,y,T3_,h,shd(c,1.2));B(x,y+h-T3_,w,T3_,shd(c,.7));
    const g=bx.createLinearGradient(x+5,0,x+11,0);g.addColorStop(0,'#1a2a6a');g.addColorStop(1,'#5ab8ff');bx.fillStyle=OLC;bx.fillRect(x+4.67,y+1.67,6.67,12.67);bx.fillStyle=g;bx.fillRect(x+5,y+2,6,12);B(x+5.5,y+3,.67,4,'rgba(255,255,255,.6)');
    bx.fillStyle=OLC;bx.fillRect(x+18.67,y+1.67,4.67,12.67);B(x+19,y+2,4,12,'#26324a');B(x+11,y+3,7,10,shd(c,1.15));B(x+11,y+3,T3_,10,shd(c,1.4));
    B(x+26.5,y+1,1.2,3,'#fff4c0');B(x+26.5,y+12,1.2,3,'#fff4c0');B(x+.3,y+1,1,3,'#ff2a3a');B(x+.3,y+12,1,3,'#ff2a3a');gfill(x,y,x+28,y+16,2)}}
function lampPost(x,y){const bx=L.bx;bx.fillStyle='rgba(10,0,24,.4)';bx.beginPath();bx.arc(x+1,y+1.5,2.6,0,TAU);bx.fill();bx.fillStyle=OLC;bx.beginPath();bx.arc(x+.5,y+.5,2.2,0,TAU);bx.fill();bx.fillStyle='#3a3446';bx.beginPath();bx.arc(x+.5,y+.5,1.8,0,TAU);bx.fill();bx.fillStyle='#fff2c0';bx.beginPath();bx.arc(x+.5,y+.5,1,0,TAU);bx.fill();
  gfill(x-1,y-1,x+2,y+2,2);L.lights.push([x,y,50,.85]);L.glow.push([x,y,40,'rgba(255,190,110,A)',.22])}


// ---------- ДВОР-КРЕПОСТЬ ----------
const FORT={spots:[{x:62,y:240,done:false},{x:122,y:240,done:false},{x:300,y:240,done:false}],talked:false,briefed:false,gateOpen:false,onScoot:false,turretA:0,leaving:false};
function lvFort(){
  mkLevel('fort',YW,YH);
  FORT.spots.forEach(s=>s.done=false);FORT.talked=false;FORT.briefed=false;FORT.gateOpen=false;FORT.leaving=false;PS.carry=false;
  L.bx.drawImage(yardCv,0,0);
  gfill(0,0,YW,YH,0);
  for(const s of ysolids)gfill(s.x,s.y,s.x+s.w,s.y+s.h,1);
  gfill(0,0,2,YH,1);gfill(YW-2,0,YW,YH,1);gfill(0,YH-2,YW,YH,1);gfill(198,252,214,258,1);
  // мешки с песком вдоль забора, колючка, сетка
  for(let x=0;x<YW;x+=6){if(x>=146&&x<218)continue;B(x,246,6,4,(x/6)%2?'#8a7a5a':'#9a8a64');B(x,246,6,1,'#b0a078')}
  for(let x=0;x<YW;x+=3)B(x,251,1,1,'#9aa0a6');
  B(0,64,YW,2,'#2a2a2a');for(let x=8;x<YW;x+=40){B(x,64,2,6,'#5a5a5a')}
  // «ежи» у калитки снаружи
  for(const x of [160,176,224,240]){B(x,262,7,1,'#4a4a50');B(x+3,259,1,7,'#4a4a50')}
  // бочки с огнём
  for(const [x,y] of [[96,232],[300,128]]){B(x-4,y-4,8,8,'#3a3030');B(x-3,y-3,6,6,'#1a1010');gfill(x-4,y-4,x+4,y+4,2);L.lights.push([x,y,60,.9]);L.glow.push([x,y,46,'rgba(255,120,40,A)',.35,9])}
  // куча щитов-баррикад
  B(286,134,26,14,'#5a4a32');for(let i=0;i<4;i++)B(287,135+i*3,24,2,i%2?'#7a6a4a':'#8a7a54');gfill(286,134,312,148,2);
  L.lights.push([100,122,46,.8],[260,122,46,.8],[100,222,46,.8],[260,222,46,.8],[238,232,30,.8]);
  for(const c of ENTR)L.lights.push([c,92,22,.7]);
  L.glow.push([100,122,40,'rgba(255,190,110,A)',.2],[260,122,40,'rgba(255,190,110,A)',.2],[100,222,40,'rgba(255,190,110,A)',.2],[260,222,40,'rgba(255,190,110,A)',.2]);
  L.dark=.5;L.tint='14,4,10';L.armed=false;
  buildNav();
  pl.x=180;pl.y=112;pl.a=Math.PI/2;pl.ma=pl.a;pl.scoot=false;pl.sit=false;
  const hz={x:206,y:230,a:-Math.PI/2},gu={x:240,y:220,a:Math.PI/2},dv={x:270,y:242,a:0,dir:1};
  L.npcs=[
    {draw(){shadowBlob(hz.x,hz.y,5);drawSoldier(sprN.getContext('2d'),tm,{body:'#4a5a32',head:'#2e3a22',hair:'#8a6748',sk:'#efc5a5',gun:true});spr(sprN,hz.x,hz.y,hz.a)}},
    {draw(){drawSoldier(sprN.getContext('2d'),tm,{body:'#3a4a2a',head:'#4a5a3a',gun:false});spr(sprN,gu.x,gu.y,gu.a)}},
    {draw(){shadowBlob(dv.x,dv.y,5);drawSoldier(sprN.getContext('2d'),tm,{body:'#3a4628',head:'#2a3420',sk:'#d8a080',gun:false,mv:true});spr(sprN,dv.x,dv.y,dv.a);F(dv.x-12*dv.dir-4,dv.y-3,8,6,'#7a6a4a')}},
  ];
  L.onUpdate=dt=>{
    FORT.turretA=Math.sin(tm*.7)*1.3+Math.PI/2;
    dv.x+=dv.dir*10*dt;if(dv.x>340)dv.dir=-1;if(dv.x<262)dv.dir=1;dv.a=dv.dir>0?0:Math.PI;
    const p=Math.hypot(pl.x-hz.x,pl.y-hz.y);if(p<40)hz.a=Math.atan2(pl.y-hz.y,pl.x-hz.x);
    if(FORT.gateOpen&&pl.scoot&&pl.y>246&&Math.abs(pl.x-206)<14&&!FORT.leaving){FORT.leaving=true;lockMove=true;C1.retry=null;transition(()=>{lockMove=false;playC(CUT_CITY,()=>startRide(0,true))})}
  };
  L.drawUnder=()=>{
    for(const s of FORT.spots){if(s.done){F(s.x-12,s.y-4,24,7,'#5a4a32');for(let i=0;i<3;i++)F(s.x-11,s.y-3+i*2,22,1,'#8a7a54');F(s.x-12,s.y-5,24,1,'#a89a70')}
      else if(FORT.talked){const a=.4+.4*Math.sin(tm*5);ctx.strokeStyle=`rgba(255,210,58,${a})`;ctx.strokeRect(s.x-12.5,s.y-4.5,25,8)}}
    if(FORT.gateOpen){F(198,252,16,6,'#33333a')}
    if(!pl.scoot){ctx.save();ctx.translate(211,104);ctx.rotate(Math.PI/2);ctx.drawImage(sprScoot,-12,-12);ctx.restore()}
  };
  L.drawOver=()=>{
    // турель на будке
    const tx=240,ty=212;F(tx-5,ty-4,10,8,'#3a4030');F(tx-4,ty-3,8,6,'#4a5040');
    ctx.save();ctx.translate(tx,ty);ctx.rotate(FORT.turretA);F(0,-1,12,2,'#1a1a1e');F(10,-1,3,2,'#2a2a30');ctx.restore();
    F(tx-1,ty-1,2,2,Math.sin(tm*6)>0?'#ff3030':'#5a1010');
    for(const [x,y,r] of [[150,160,13],[200,176,15],[226,152,11],[136,190,9]]){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.arc(x+3,y+3,r,0,7);ctx.fill();ctx.fillStyle='#1f4a26';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.fillStyle='#2e6a34';ctx.beginPath();ctx.arc(x-3,y-3,r*.6,0,7);ctx.fill()}
  };
  L.obj=()=>{
    if(!FORT.talked)return['Поговорить с командиром Ханжой (у калитки)'];
    const n=FORT.spots.filter(s=>s.done).length;
    if(n<3)return['Баррикады к забору: '+n+'/3',PS.carry?'Неси к подсвеченному месту у забора':'Возьми щит из кучи у машин справа'];
    if(!FORT.briefed)return['Доложить командиру Ханже'];
    if(!pl.scoot)return['Взять самокат у подъезда'];
    return['Выехать через калитку'];
  };
  L.its=[
    {get x(){return hz.x},get y(){return hz.y},r:22,label:()=>'Поговорить с командиром Ханжой',act:talkHanzha},
    {x:240,y:240,r:16,label:()=>'Поговорить с Михалычем',act:()=>say([['G','Видал? Автоматическая турель. Завалялась тут у меня штуковина интересная...'],['m','Михалыч, откуда у тебя турель?!'],['G','Не задавай вопросов, на которые не хочешь знать ответ.'],['G','Двор под прицелом. Ни один дохляк не пройдёт.']])},
    {get x(){return dv.x},get y(){return dv.y},r:18,label:()=>'Поговорить с дворником',act:()=>say([['D','Метлу на автомат сменял. Мусорить теперь некому, хе-хе.'],['D','Только ты это... гильзы за собой подбирай.']])},
    {x:299,y:150,r:18,label:()=>'Взять щит-баррикаду',cond:()=>FORT.talked&&!PS.carry&&FORT.spots.some(s=>!s.done),act:()=>{PS.carry=true;sfx('thump',.5);note('Тяжёлый, зараза...')}},
    {x:206,y:96,r:0,label:()=>'',cond:()=>false,act:()=>{}},
    {x:211,y:108,r:14,label:()=>'Сесть на самокат',cond:()=>FORT.briefed&&!pl.scoot,act:()=>{pl.scoot=true;sfx('click');note('Самокат готов. К калитке!')}},
  ];
  FORT.spots.forEach(s=>L.its.push({x:s.x,y:s.y-6,r:16,label:()=>'Поставить баррикаду',cond:()=>PS.carry&&!s.done,act:()=>{s.done=true;PS.carry=false;sfx('thump');C1.shake=.3;
    const n=FORT.spots.filter(q=>q.done).length;if(n===1)say([['H','Ровнее ставь, боец! ...Сойдёт.']]);if(n===3)say([['H','Все три на месте. Ко мне, боец!']])}}));
  if(C1.fortHook)C1.fortHook(L,FORT,{hz,gu,dv});
}
C1.FORT=FORT;C1.talkHanzha=()=>talkHanzha();
function talkHanzha(){
  if(!FORT.talked){say([['H','Стоять! Кто идёт?! ...А, это ты, Микроб. Вольно.'],['m','Тётушка Ханжа?! Это что... камуфляж?'],['H','Командир Ханжа. С сегодняшнего дня двор — крепость. Ни один дохляк сюда не пролезет.'],
    ['H','Михалыч ставит турель на будку. Дворник тянет забор. Пуся охраняет подъезд.'],['H','А ты, боец, перед уходом таскай баррикады к забору. Три щита, живо!'],['m','Есть, командир!']],()=>{FORT.talked=true});return}
  const n=FORT.spots.filter(s=>s.done).length;
  if(n<3){say([['H',PS.carry?'Неси к забору, там где мигает. Бегом!':'Щиты в куче у машин справа. Шевелись, боец!']]);return}
  if(!FORT.briefed){say([['H','Молодец, боец. Двор закрыт. Тут теперь безопасно, хоть конец света.'],['H','Кота и квартиру мы прикроем. Шмакодявка, держись за ним. Слово командира.'],['m','Спасибо, тётушка... то есть командир.'],['H','Самокат у подъезда. Калитку открою. И не вздумай там помереть, мне отчёт писать некому.']],()=>{FORT.briefed=true;FORT.gateOpen=true;gfill(198,252,214,258,0);buildNav();sfx('click')});return}
  say([['H','Чего встал? Калитка открыта. Вперёд!']]);
}

// ---------- ПАРКОВКА У ОФИСОВ ----------
const PARK={phase:1,cleared:false};
function newAlly(x,y){return{x,y,a:-Math.PI/2,ma:0,ph:0,cd:1,flash:0,mv:false}}
function lvPark(phase){
  PARK.phase=phase;PARK.cleared=phase>1;
  mkLevel('park',600,440);
  paint(0,0,600,440,'asphalt');
  // разметка
  for(const y of [146,182,246,282])for(let x=30;x<570;x+=30)B(x,y,1,0,'#000');
  for(let x=30;x<300;x+=30){B(x,146,1,36,'#8a8a90');}for(let x=330;x<570;x+=30)B(x,146,1,36,'#8a8a90');
  for(let x=30;x<570;x+=30)B(x,246,1,36,'#8a8a90');
  for(let y=200;y<232;y+=8)B(298,y,4,4,'#c8b040');
  // здания (крыши) и фасады
  for(const [x0,x1,door] of [[0,250,136],[350,600,464]]){
    B(x0,0,x1-x0,104,'#3a3236');for(let x=x0+6;x<x1;x+=24)B(x,10,10,8,'#4a4248');
    B(x0,92,x1-x0,20,'#8a8478');for(let x=x0+6;x<x1-8;x+=14){B(x,96,8,10,hash(x,1)>.7?'#ffcf7a':'#1a2030');B(x,106,8,1,'#c8c0b0')}
    B(door-12,98,24,14,'#2a2a2e');B(door-10,100,9,12,'#5a7a8a');B(door+1,100,9,12,'#5a7a8a');B(door-14,94,28,3,'#c8c0b0');
    gfill(x0,0,x1,112,1);L.lights.push([door,118,40,.8]);L.glow.push([door,112,26,'rgba(200,230,255,A)',.25]);
  }
  B(250,0,100,24,'#2a3a30');for(let x=250;x<350;x+=4)B(x,20,1,4,'#4a5a50');gfill(250,0,350,24,1);
  // забор, калитка, улица
  gfill(0,0,6,440,1);gfill(594,0,600,440,1);gfill(0,396,600,440,1);
  B(0,396,600,6,'#1e2a24');for(let x=0;x<600;x+=4)B(x,394,1,8,'#2a3a30');B(278,392,44,10,'#3a4a40');B(280,394,40,6,'#5a6a5a');for(let x=282;x<320;x+=4)B(x,394,1,6,'#2a3a30');
  B(0,402,600,38,'#26262c');for(let x=0;x<600;x+=24)B(x,420,12,1,'#8a8a7a');
  // Land Rover Аниса за калиткой
  B(250,408,56,26,'#111114');B(262,410,30,22,'#1c2028');B(256,408,4,26,'#2a2a30');B(304,410,3,4,'#fff6c0');B(304,428,3,4,'#fff6c0');B(268,412,22,2,'#2a2a30');
  L.glow.push([330,421,40,'rgba(255,240,180,A)',.3]);
  // машины
  const cols=['#3a5a8a','#8a2a2a','#c8c8c8','#2a2a2a','#6a8a4a','#c8a040','#5a3a6a'];let k=0;
  for(const x of [34,64,94,124,154,  424,454,484,514,544])carTop(x,150,cols[k++%7],true);
  for(const x of [34,64,124,184, 364,424,454,514])carTop(x,250,cols[k++%7],true);
  carTop(250,320,'#8a2a2a',false);B(256,322,16,12,'#2a1010');
  // контейнеры и деревья
  for(const x of [16,560]){B(x,316,26,18,'#3a5a3a');B(x,316,26,2,'#5a7a5a');gfill(x,316,x+26,334,2)}
  for(const [x,y] of [[200,360],[420,360],[60,210],[540,210]]){gfill(x-2,y-2,x+2,y+2,2)}
  lampPost(150,220);lampPost(450,220);lampPost(300,140);lampPost(300,330);
  L.dark=.55;L.tint='10,4,14';
  buildNav();
  pl.x=300;pl.y=380;pl.a=-Math.PI/2;pl.scoot=false;
  L.ally=newAlly(318,384);
  if(phase===1){
    for(const [x,y] of [[100,220],[200,320],[330,250],[420,320],[520,226],[240,130],[380,136],[150,360],[480,360]])addZ('normal',x,y);
    for(const [x,y] of [[100,214],[200,214],[400,214],[500,214],[300,124],[120,124],[470,124],[560,370]])addZ('normal',x,y); // 04.11: +5 (с учётом отсева 40%)
    addZ('thrower',40,300);addZ('thrower',560,300);
    addZ('crawler',94,192,{hid:'car',wakeR:34});addZ('crawler',454,192,{hid:'car',wakeR:34});addZ('crawler',184,292,{hid:'car',wakeR:30});
    addZ('bloat',330,300);addZ('screamer',520,320);
  }else{pl.x=136;pl.y=124;pl.a=Math.PI/2;L.ally.x=150;L.ally.y=130;L.gradeId='park2';
    // охрана второго здания вышла на шум
    addZ('shield',440,170);addZ('shield',492,176);addZ('bloat',400,300);addZ('crawler',424,292,{hid:'car',wakeR:34});addZ('normal',520,250);addZ('normal',360,240)}
  L.drawOver=()=>{for(const [x,y,r] of [[200,360,14],[420,360,13],[60,210,12],[540,210,12]]){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.arc(x+3,y+3,r,0,7);ctx.fill();ctx.fillStyle='#1f3a22';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.fillStyle='#2a4a2c';ctx.beginPath();ctx.arc(x-3,y-3,r*.6,0,7);ctx.fill()}};
  L.obj=()=>{
    if(PARK.phase===1&&!PARK.cleared)return['Зачистить парковку: осталось '+L.zs.length];
    if(PARK.phase===1)return['Войти в левое здание (офис 1)'];
    return['Войти в правое здание (офис 2)'];
  };
  L.onUpdate=()=>{if(PARK.phase===1&&!PARK.cleared&&L.zs.length===0){PARK.cleared=true;say([['a','Чисто! Хорошо работаешь.'],['a','Левое здание, первый офис. Лифт сразу за дверью.']])}};
  L.its=[
    {x:136,y:120,r:18,label:()=>'Войти в здание 1',act:()=>{
      if(PARK.phase>1){say([['m','Там уже чисто. Нам в правое здание.']]);return}
      if(!PARK.cleared){say([['a','Сначала зачистим парковку. Не хочу, чтобы нам в спину дышали.']]);return}
      go(()=>playC(CUT_LIFT1,()=>sec('off1')))}},
    {x:464,y:120,r:18,label:()=>'Войти в здание 2',act:()=>{
      if(PARK.phase===1){say([['a','Во втором офисе нет света. Сначала рубильник в первом.']]);return}
      go(()=>playC(CUT_OFF2,()=>sec('off2')))}},
    {x:300,y:388,r:16,label:()=>'Калитка',act:()=>say([['m','Без сервера не уеду. Анис рассчитывает на меня.']])},
  ];
}

// ---------- ОФИС 1 (по чертежу) ----------
const OF1={on:false,done:false,moon:0,said:{},box:false};
function lvOff1(){
  OF1.on=false;OF1.done=false;OF1.moon=0;OF1.said={};OF1.box=false;
  mkLevel('off1',500,360);
  B(0,0,500,360,'#16131c');
  paint(8,8,176,120,'carpet');paint(184,8,240,80,'carpet');paint(184,88,240,120,'server');
  paint(96,128,240,220,'tile');paint(240,152,492,188,'tile');
  paint(248,8,368,144,'carpet');paint(376,8,492,144,'carpet');paint(248,196,368,352,'carpet');paint(376,196,492,352,'carpet');
  paint(120,228,240,352,'carpet');paint(8,228,112,352,'wc');paint(52,148,96,196,'steel');
  for(const d of [[136,120,160,128],[176,40,184,56],[200,120,224,128],[328,144,352,152],[448,144,472,152],[272,188,296,196],[400,188,424,196],[152,220,176,228],[96,220,112,228]])paint(d[0],d[1],d[2],d[3],'tile');
  gfill(104,8,112,64,1);
  gfill(28,300,32,352,1);gfill(52,300,56,352,1);gfill(76,300,80,352,1);
  drawWalls();
  // окна
  for(let x=12;x<172;x+=28)if(x<100||x>116)win(x,0,22,true);win(196,0,30,true);
  for(let x=256;x<364;x+=28)win(x,0,22,true);for(let x=384;x<488;x+=28)win(x,0,22,true);
  for(let x=128;x<236;x+=28)win(x,352,22,true);for(let x=256;x<364;x+=28)win(x,352,22,true);for(let x=384;x<488;x+=28)win(x,352,22,true);for(let x=12;x<108;x+=32)win(x,352,22,true);
  // лестница (завалена) и лифт
  for(let y=132;y<216;y+=6){B(10,y,36,4,'#4a4650');B(10,y,36,1,'#5a5660')}B(14,160,28,20,'#3a3030');for(let i=0;i<6;i++)B(16+i*4,162+(i%2)*6,6,4,'#5a4a3a');
  B(52,148,4,48,'#8a8e96');B(92,148,4,10,'#8a8e96');B(92,186,4,10,'#8a8e96');B(60,150,2,2,'#ff3030');
  // мебель
  deskCol(56,24,2);deskCol(144,24,3);
  lowBox(196,16,32,14,'#c8c0b0');B(208,18,8,6,'#141418');cabinet(228,40,12,36);
  for(let x=188;x<236;x+=12){B(x,90,10,10,'#1a1c22');for(let i=0;i<4;i++)B(x+1,91+i*2,8,1,(i+Math.floor(x/12))%3?'#2a8a4a':'#1a3a2a')}gfill(188,88,236,100,1);
  B(236,106,4,12,'#8a8a30');B(237,108,2,8,'#2a2a2a');
  deskCol(308,24,4);deskCol(434,24,4);deskCol(308,216,5);deskCol(434,216,5);deskCol(180,240,4);
  lowBox(168,196,48,10,'#7a5a3a','#9a7a5a');plant(232,212);plant(104,136);
  lowBox(16,232,40,8,'#e8e8ec');for(let x=18;x<56;x+=12)B(x+2,233,6,5,'#c8d0d8');
  for(const x of [8,32,56])B(x+6,336,10,12,'#f0f0f0');
  B(488,158,4,26,'#8a6a40');B(489,170,2,3,'#d0b060');
  // пожарный щит в коридоре (топор + огнетушитель) и ящик сисадминов в серверной (гвоздомёт)
  B(362,144,22,9,'#a8181e');B(363,145,20,7,'#3a1010');
  // предметы
  for(const [x,y] of [[30,104],[228,24],[480,22],[258,340],[484,340]])addItem('moon',x,y);
  addItem('ammo',232,344,8);addItem('ammo',258,20,8);addItem('ammo',98,112,8);
  addItem('syr',16,322);addItem('syr',360,132);
  // зомби
  const Z=(t,x,y,o)=>addZ(t,x,y,o);
  Z('normal',200,150);Z('normal',130,204);
  Z('normal',24,40);Z('normal',90,96);Z('fast',168,104);Z('normal',124,64,{hid:'desk'});
  Z('normal',200,60);
  Z('normal',264,40);Z('normal',352,100);Z('normal',286,96,{hid:'desk'});
  Z('normal',392,60);Z('thrower',474,112);Z('normal',412,48,{hid:'desk'});
  Z('normal',268,250);Z('fast',352,300);Z('normal',286,300,{hid:'desk'});
  Z('normal',396,236);Z('normal',474,320);Z('thrower',392,334);
  Z('normal',132,300);Z('normal',158,280,{hid:'desk'});
  Z('normal',18,330,{hid:'cab',wakeR:30});
  Z('normal',420,170);Z('normal',300,168);
  Z('crawler',330,60,{hid:'desk',wakeR:32});Z('crawler',456,260,{hid:'desk',wakeR:32});Z('crawler',200,290,{hid:'desk',wakeR:32});
  Z('screamer',456,96);Z('bloat',70,262);Z('shield',466,170);
  addItem('key1',66,330);
  L.dark=.93;L.torch=true;L.tint='2,2,8';
  buildNav();
  pl.x=112;pl.y=172;pl.a=0;pl.scoot=false;L.ally=newAlly(104,184);
  L.obj=()=>{
    const r=['Самогон: '+OF1.moon+'/5'+(OF1.moon>=5?'  ✓':''),'Рубильник в серверной'+(OF1.on?'  ✓':''),'Зомби осталось: '+L.zs.length+(L.zs.length?'':'  ✓')];
    if(OF1.done)r.push('Вернуться к лифту');return r;
  };
  L.onItem=it=>{
    if(it.kind==='moon'){OF1.moon++;
      if(OF1.moon===1)say([['a','Моя прелесть! Первая есть. Ещё четыре.']]);
      if(OF1.moon===3)say([['a','Не урони только. Это лучший самогон на Петроградке.']]);
      if(OF1.moon===5)say([['a','Все пять! Во втором офисе будет чем погреться. В смысле, поджечь.'],['a','Кнопка F, кидаешь бутылку в толпу. Или правая кнопка мыши.']])}
    if(it.kind==='syr'&&!OF1.said.syr){OF1.said.syr=1;say([['a','Шприц! Бери, лишним не будет. Кнопка H.']])}
    if(it.kind==='ammo'&&!OF1.said.ammo){OF1.said.ammo=1;say([['a','Мои охотничьи патроны. Под твой пистолет тоже подходят. Не спрашивай.']])}
  };
  L.onUpdate=()=>{
    if(!OF1.done&&OF1.moon>=5&&OF1.on&&L.zs.length===0){OF1.done=true;say([['a','Чисто. Ни одного живого... то есть неживого.'],['a','Возвращаемся к лифту. Следующая остановка — второй офис.']])}
  };
  L.its=[
    {x:228,y:112,r:14,label:()=>OF1.on?'Рубильник включён':'Включить рубильник',cond:()=>!OF1.on,act:()=>{OF1.on=true;sfx('power');C1.shake=.5;
      L.lights.push([168,174,60,.45],[300,170,46,.35],[420,170,46,.35],[212,104,30,.6]);L.glow.push([168,140,50,'rgba(255,30,40,A)',.25,3],[300,170,40,'rgba(255,30,40,A)',.2,3],[420,170,40,'rgba(255,30,40,A)',.2,3],[212,104,26,'rgba(60,255,120,A)',.25]);
      say([['m','Есть контакт!'],['a','Слышишь гул? Это второй офис ожил. Там теперь свет.'],['a','Включилась аварийка в коридоре. Уже легче.']])}},
    {x:100,y:172,r:14,label:()=>'Лифт вниз',act:()=>{
      if(!OF1.done){const need=[];if(OF1.moon<5)need.push('самогон '+OF1.moon+'/5');if(!OF1.on)need.push('рубильник');if(L.zs.length)need.push('зомби: '+L.zs.length);say([['a','Рано уходить. Осталось: '+need.join(', ')+'.']]);return}
      go(()=>playC(CUT_LIFT_DOWN,()=>sec('park2')))}},
    {x:484,y:170,r:14,label:()=>PS.key1?'Открыть дверь ключ-картой':'Дверь в конце коридора',act:()=>{if(!PS.key1){say([['m','Заперто. Замок под ключ-карту.'],['a','Карты были только у админов. Поищи, вдруг какая-то валяется на этаже.']]);return}enterSecret(secretOff1)}},
  ];
}

// ---------- ОФИС 2 (опенспейс) ----------
const OF2={boss:null,bossOn:false,dead:false,gun:false,server:false,loot:false,wave:false,arm:false};
function lvOff2(post){
  Object.assign(OF2,{boss:null,bossOn:false,dead:!!post,gun:false,server:false,loot:false,wave:false,arm:false});
  mkLevel('off2',900,320);
  B(0,0,900,320,'#16131c');
  paint(40,120,208,200,'tile');paint(8,140,40,180,'steel');
  paint(8,8,96,112,'wood');paint(104,8,200,112,'wc');paint(8,208,200,312,'kitchen');
  paint(56,112,80,120,'tile');paint(128,112,152,120,'tile');paint(96,200,120,208,'tile');
  paint(208,8,892,312,'carpet');
  paint(764,68,892,252,'parquet');
  // колонны
  for(const x of [272,368,464,560,656])for(const y of [96,212])gfill(x-8,y-8,x+8,y+8,1);
  // стеклянный кабинет
  gfill(760,64,764,256,3);gfill(760,64,892,68,3);gfill(760,252,892,256,3);gfill(760,148,764,172,0);
  // перегородки туалета
  gfill(104,60,140,64,1);gfill(124,8,128,40,1);gfill(148,8,152,40,1);gfill(172,8,176,40,1);
  drawWalls();
  for(const x of [272,368,464,560,656])for(const y of [96,212]){B(x-8,y-8,16,16,'#6a6a72');B(x-8,y-8,16,2,'#8a8a92');B(x-8,y+6,16,2,'#4a4a52')}
  // стекло
  L.bx.fillStyle='rgba(150,210,255,.45)';L.bx.fillRect(760,64,4,84);L.bx.fillRect(760,172,4,84);L.bx.fillRect(760,64,132,4);L.bx.fillRect(760,252,132,4);
  B(761,66,1,80,'#d8f0ff');B(762,64,128,1,'#d8f0ff');
  // окна
  for(let x=216;x<888;x+=30)if(x<756||x>768)win(x,0,22,true);for(let x=216;x<888;x+=30)win(x,312,22,true);
  win(0,20,24,false);win(0,240,24,false);
  // мебель
  for(const cx of [240,320,416,512,608,704]){deskCol(cx,20,2);deskCol(cx,244,2)}
  for(const x of [278,470,662])cabinet(x,8,14,10);for(const x of [374,566])cabinet(x,302,14,10);
  for(let y=12;y<104;y+=14)lowBox(12,y,30,6,'#5a4030','#7a6050');for(let y=12;y<104;y+=10)B(48+((y*7)%30),y,6,6,['#8a2a2a','#2a4a8a','#c8a040'][y%3]);
  lowBox(12,284,180,24,'#9a9488','#bab4a8');B(30,288,14,10,'#2a2a2e');B(60,286,20,14,'#e8e8ec');lowBox(150,220,36,22,'#e8e8ec');lowBox(60,236,60,30,'#8a6a4a','#a88a6a');
  B(13,140,2,40,'#8a8e96');
  lowBox(820,120,32,80,'#3a2a20','#5a4232');B(828,140,10,8,'#141418');B(826,170,14,4,'#c8c0b0');B(856,152,10,16,'#1a1a1e');
  B(872,76,16,24,'#1a1c22');for(let i=0;i<5;i++)B(874,78+i*4,12,2,'#2a8a4a');gfill(872,76,888,100,1);
  cabinet(864,220,24,28);lowBox(776,76,40,14,'#2a2a34');plant(780,240);plant(880,116);
  plant(220,20);plant(220,296);plant(748,20);plant(748,296);
  // зомби
  if(!post){
    const Z=(t,x,y,o)=>addZ(t,x,y,o);
    Z('normal',150,150);Z('normal',184,182);Z('normal',60,262);Z('fast',150,288);Z('normal',170,80);Z('normal',70,30);Z('normal',24,80,{hid:'cab',wakeR:28});
    for(const [x,y] of [[300,150],[340,120],[420,180],[450,140],[520,110],[600,170],[640,130],[720,180]])Z('normal',x,y);
    for(const [x,y] of [[380,160],[500,190],[560,150],[680,120],[730,150]])Z('fast',x,y);
    for(const [x,y] of [[620,90],[700,230],[740,100],[540,240]])Z('thrower',x,y);
    Z('brute',512,150);Z('brute',700,160);
    for(const cx of [320,512,704])Z('normal',cx-22,40,{hid:'desk'});for(const cx of [416,608])Z('normal',cx+22,268,{hid:'desk'});
    for(const x of [278,470,662])Z('normal',x+7,24,{hid:'cab'});for(const x of [374,566])Z('fast',x+7,296,{hid:'cab'});
    Z('shield',236,140);Z('shield',236,184);
    Z('bloat',400,150);Z('bloat',640,200);Z('bloat',297,263);
    Z('screamer',606,75);Z('screamer',470,262);
    for(const cx of [416,608])Z('crawler',cx+22,40,{hid:'desk',wakeR:30});for(const cx of [320,512])Z('crawler',cx-22,268,{hid:'desk',wakeR:30});
    OF2.boss=Z('boss',812,160,{hid:'desk',wakeR:0,minHp:50,sp:36});
    addItem('ammo',70,60,8);addItem('syr',190,300);addItem('ammo',430,150,8);addItem('syr',580,40);addItem('ammo',700,300,8);addItem('ammo',330,300,8);addItem('ammo',560,22,8);addItem('syr',760,40);
  }
  for(let x=96;x<880;x+=96)for(const y of [52,160,268]){L.lights.push([x,y,52,.7]);L.glow.push([x,y,30,'rgba(220,240,255,A)',.08])}
  L.lights.push([820,160,60,.8]);
  L.dark=.55;L.flick=true;L.tint='4,4,12';
  buildNav();
  pl.x=52;pl.y=160;pl.a=0;pl.scoot=false;
  if(!post){L.ally=newAlly(52,176)}else{pl.x=790;pl.y=170}
  L.obj=()=>{
    if(!OF2.dead){if(OF2.bossOn)return['Убить громилу в кабинете Аниса'];return['Пройти опенспейс к стеклянному кабинету Аниса','Самогон: '+PS.moon+' шт. (F — бросить)']}
    const r=[(OF2.gun?'✓ ':'')+'Взять ружьё Аниса',(OF2.arm?'✓ ':'')+'Бронежилет Аниса на вешалке',(OF2.server?'✓ ':'')+'Осмотреть сервер',(OF2.loot?'✓ ':'')+'Забрать припасы в рюкзак'];
    if(OF2.gun&&OF2.server&&OF2.loot&&OF2.arm)r.push('Вернуться к лифту');return r;
  };
  L.onBossLow=z=>{if(OF2.dead)return;OF2.dead=true;scoreKill(z);scoreFinish();z.st='idle';go(()=>playC(CUT_DEATH,()=>sec('off2b')))};
  L.onUpdate=()=>{
    const b=OF2.boss;
    if(b&&!OF2.bossOn&&pl.x>772&&pl.y>68&&pl.y<252){OF2.bossOn=true;b.st='rise';b.riseT=.8;sfx('groan',2);C1.shake=.6;
      say([['a','Под моим столом кто-то есть!'],['m','Это... это вообще человек был?!'],['a','Это был наш сисадмин. Огонь!']])}
    if(OF2.dead&&OF2.gun&&!OF2.wave){OF2.wave=true;for(const [t,x,y] of [['fast',420,160],['normal',480,120],['normal',500,200],['fast',560,170],['normal',620,150],['thrower',360,140],['normal',380,200],['bloat',450,170],['shield',520,150],['screamer',600,200],['crawler',560,230]])addZ(t,x,y,{st:'chase'});
      after(1.2,()=>say([['m','На шум сбежались ещё. Ну, ружьё, покажи себя.'],['m','Дробь бьёт веером, вблизи — насмерть. Шесть патронов, потом R — перезарядка.']]))}
  };
  L.drawUnder=()=>{
    if(OF2.dead){ // тело Аниса
      const x=800,y=176;F(x-9,y-3,18,7,'#1c1c22');F(x-7,y-3,12,6,'#4e4e32');F(x+8,y-3,6,6,'#e2ad8c');F(x+9,y-3,4,3,'#241a15');
      if(!OF2.gun){F(x-12,y+6,22,2,'#26262a');F(x-14,y+6,6,3,'#6a4424')}
      F(x-14,y-8,10,4,'rgba(110,8,14,.7)');
    }
    if(OF2.dead&&!OF2.arm){const x=846,y=124;F(x-1,y-8,2,14,'#4a3a2a');F(x-5,y-6,10,10,'#4e4e32');F(x-4,y-5,8,8,'#5e5e3a');F(x-1,y-6,2,10,'#3a3a24');F(x-5,y-7,10,1,'#6a6a42')}
    if(OF2.dead){F(872,76,16,24,'#2a2a2e');for(let i=0;i<5;i++)F(873+((i*3)%7),78+i*4,8,2,'#1a1a1a');F(874,90,3,3,'#ff3030')}
  };
  L.its=[
    {x:798,y:182,r:16,label:()=>'Взять ружьё Аниса',cond:()=>OF2.dead&&!OF2.gun,act:()=>{OF2.gun=true;PS.shells+=16;giveWpn('shotgun',true);setWpn('shotgun');sfx('pick');note('Дробовик Аниса: веер дроби вблизи. 6 патронов, R — перезарядка');}},
    {x:846,y:130,r:16,label:()=>'Снять бронежилет Аниса',cond:()=>OF2.dead&&!OF2.arm,act:()=>{OF2.arm=true;if(C1.giveArmor)C1.giveArmor('1');sfx('pick');
      say([['m','Его охотничий бронежилет. Висел на вешалке, как будто ждал.'],['m','Анис говорил: на кабана без брони не ходят. На зомби, видимо, тоже.'],['m','Броня держит часть урона, пока цела. Потом надо чинить.']])}},
    {x:868,y:100,r:18,label:()=>'Осмотреть сервер',cond:()=>OF2.dead&&!OF2.server,act:()=>say([['m','Сервер... Корпус смят, платы в труху. Этот громила его разнёс.'],['m','Всё. Спасать больше нечего. Компании конец.'],['m','Прости, Анис.']],()=>{OF2.server=true})},
    {x:870,y:212,r:18,label:()=>'Забрать припасы в рюкзак',cond:()=>OF2.dead&&!OF2.loot,act:()=>{OF2.loot=true;PS.key2=true;after(6,()=>note('В рюкзаке ключ с биркой «Гардероб». Анис что-то прятал у входа...'));PS.syr+=3;PS.ammo+=20;PS.shells+=10;PS.food=true;sfx('pick');
      floatT(870,200,'+3 шприца','#6aff9a');floatT(870,190,'+20 патр.','#ffe27a');floatT(870,180,'+10 дробь','#ffcf6a');
      say([['m','Консервы, крупа, тушёнка, аптечка, патроны... Анис, ты был готов к апокалипсису.'],['m','Всё в рюкзак. Шмакодявка обалдеет.']])}},
    {x:30,y:60,r:22,label:()=>PS.key2?'Открыть тайник в гардеробе':'Задняя стенка шкафа',act:()=>{if(!PS.key2){say([['m','Задняя стенка шкафа фальшивая. Тут замочная скважина.']]);return}enterSecret(secretOff2)}},
    {x:42,y:160,r:16,label:()=>'Лифт вниз',act:()=>{
      if(!OF2.dead){say([['a','Сервер в моём кабинете, в самом конце. Без него не уходим.']]);return}
      if(!(OF2.gun&&OF2.server&&OF2.loot&&OF2.arm)){say([['m','Нужно забрать всё из кабинета Аниса.']]);return}
      go(()=>playC(CUT_HOME,endHome))}},
  ];
}

// ================= САМОКАТ: 3 ЛОКАЦИИ (вид сбоку) =================
const LOCS=[
  {name:'СПАЛЬНЫЙ РАЙОН',sub:'Панельки. Свой район, а не узнать',len:1700},
  {name:'ТРОИЦКИЙ МОСТ',sub:'Петропавловка горит',len:1900},
  {name:'ПЕТРОГРАДСКАЯ СТОРОНА',sub:'До встречи с Анисом',len:2100},
];
const RZ={normal:{hp:30,sp:9,rw:1},fast:{hp:25,sp:30,rw:1},thrower:{hp:30,sp:0,rw:2},brute:{hp:170,sp:7,rw:4}};
let RD=null;
const ROAD0=130,ROAD1=174;
function startRide(loc,fresh){
  C1.on=true;C1.mode='ride';scene='c1ride';
  const s0=snap();C1.retry=()=>{restore(s0);PS.lives=3;PS.hp=PS.max;startRide(loc)};
  RD={loc,x:0,t:0,px:70,py:152,zs:[],tr:[],buls:[],fx:[],texts:[],fall:0,inv:1,cd:0,banner:3.2,gainStart:PS.rideGain,signs:[]};
  let s=loc*977+13;const rr=()=>{s=(s*16807)%2147483647;return s/2147483647};
  const len=LOCS[loc].len;
  for(let wx=300;wx<len-60;){
    const r=rr();let type='normal';
    if(loc===1)type=r<.45?'normal':r<.75?'fast':'thrower';
    if(loc===2)type=r<.32?'normal':r<.6?'fast':r<.78?'thrower':'brute';
    let y=ROAD0+4+rr()*(ROAD1-ROAD0-6);if(type==='thrower')y=rr()<.5?ROAD0-2:ROAD1+3;
    const d=RZ[type];RD.zs.push({wx,y,type,hp:d.hp,sp:d.sp*(.8+rr()*.4),ph:rr()*6,thr:1+rr()*2,v:(rr()*8)|0,flash:0,wind:0});
    wx+=(loc===0?44:loc===1?38:34)+rr()*(loc===0?60:50);
    if(rr()<.25&&loc>0){const y2=ROAD0+4+rr()*(ROAD1-ROAD0-6);RD.zs.push({wx:wx-10,y:y2,type:'normal',hp:30,sp:8,ph:rr()*6,thr:9,v:(rr()*8)|0,flash:0,wind:0})}
  }
  music(MZ.ride);
}
function rideUpdate(dt){
  const R=RD;R.t+=dt;if(R.banner>0)R.banner-=dt;if(R.inv>0)R.inv-=dt;if(R.cd>0)R.cd-=dt;if(PS.flash>0)PS.flash-=dt;if(C1.hurt>0)C1.hurt-=dt;if(C1.shake>0)C1.shake=Math.max(0,C1.shake-dt*2.5);
  if(PS.regen>0){const k=Math.min(PS.regen,22*dt);PS.hp=Math.min(PS.max,PS.hp+k);PS.regen-=k}
  const free=!dlg&&!tr;
  if(R.fall>0){R.fall-=dt}else if(free){R.x+=80*dt}
  if(free&&R.fall<=0){const [mx,my]=inputMove();R.px=clamp(R.px+mx*80*dt,26,220);R.py=clamp(R.py+my*62*dt,ROAD0+2,ROAD1)}
  // прицел и стрельба
  const sx=R.px+3,sy=R.py-25;
  if(mouse.on&&!touch.on)R.aim=Math.atan2(mouse.y-sy,mouse.x-sx);else if(touch.aim&&touch.aim.moved)R.aim=Math.atan2(touch.aim.y-touch.aim.oy,touch.aim.x-touch.aim.ox);else if(R.aim==null)R.aim=0;
  if(free&&R.fall<=0&&R.cd<=0&&((C1.mdown&&mouse.on&&!touch.on)||touchFiring())){R.cd=.24;PS.flash=.06;sfx('shot');const a=R.aim+rnd(-.03,.03);R.buls.push({x:sx+Math.cos(a)*7,y:sy+Math.sin(a)*7,vx:Math.cos(a)*400,vy:Math.sin(a)*400,life:.9})}
  // зомби
  for(const z of R.zs){if(z.dead)continue;const zx=z.wx-R.x;if(zx>W+60)continue;
    if(z.flash>0)z.flash-=dt;z.ph+=dt*(z.type==='fast'?14:6);
    if(z.type!=='thrower'){z.wx-=z.sp*dt;const dy=R.py-z.y;if(zx<W&&zx>R.px-10)z.y+=Math.sign(dy)*Math.min(Math.abs(dy),z.sp*.5*dt+(z.type==='fast'?6*dt:2*dt))}
    else{z.thr-=dt;if(zx<W-10&&zx>R.px+30&&z.thr<=0&&R.fall<=0){z.thr=2.2+Math.random();z.wind=.4;const T=.9,txw=R.x+R.px+80*T*.9;R.tr.push({wx:zx+R.x,y:z.y,h:24,vx:(txw-(zx+R.x))/T,vy:(R.py-z.y)/T,t:0,T});sfx('swing',.6)}}
    if(z.wind>0)z.wind-=dt;
    // столкновение
    const cx=z.wx-R.x;
    if(Math.abs(cx-R.px)<(z.type==='brute'?10:8)&&Math.abs(z.y-R.py)<(z.type==='brute'?8:6)&&R.inv<=0&&z.type!=='thrower'){
      if(z.type==='brute'){note('Громила снёс тебя одной тычкой!');loseLife();R.inv=2.5;z.wx+=40}
      else{PS.hp-=30;C1.hurt=.5;C1.shake=.4;sfx('hurt');R.inv=1;z.wx+=26;if(PS.hp<=0)loseLife()}
    }
    if(cx<-40)z.dead=true;
  }
  // пули
  for(const b of R.buls){const n=4;for(let s=0;s<n&&b.life>0;s++){b.x+=b.vx*dt/n;b.y+=b.vy*dt/n;
      for(const z of R.zs){if(z.dead)continue;const zx=z.wx-R.x,big=z.type==='brute';const hw=big?7:4,hh=big?34:21;
        if(b.x>zx-hw&&b.x<zx+hw&&b.y>z.y-hh&&b.y<z.y-1){z.hp-=20;z.flash=.08;b.life=0;sfx('hit');for(let i=0;i<4;i++)R.fx.push({x:b.x,y:b.y,vx:rnd(-30,40),vy:rnd(-40,10),g:150,life:.4,c:'#8a1018'});
          if(z.hp<=0){z.dead=true;const rw=RZ[z.type].rw;PS.ammo+=rw;PS.rideGain+=rw;PS.kills++;R.texts.push({x:zx,y:z.y-24,t:'+'+rw+' патр.',life:1.2});sfx('thump',.6);R.fx.push({x:zx,y:z.y,corpse:z.type,life:6,v:z.v,bx:R.x})}break}}}
    b.life-=dt;if(b.y>H||b.y<0||b.x>W||b.x<0)b.life=0}
  R.buls=R.buls.filter(b=>b.life>0);
  // мусор
  for(const t of R.tr){t.t+=dt;t.wx+=t.vx*dt;t.y+=t.vy*dt;const k=t.t/t.T;t.h=24*(1-k)+Math.sin(k*Math.PI)*22;
    if(k>=1){t.done=true;const tx=t.wx-R.x;R.fx.push({x:tx,y:t.y,vx:0,vy:0,life:.6,c:'#4a4a40'});
      if(Math.abs(tx-R.px)<11&&Math.abs(t.y-R.py)<8&&R.inv<=0&&R.fall<=0){PS.hp-=20;C1.hurt=.5;sfx('hurt');R.fall=1.3;R.inv=1.6;note('Мусором сбили с самоката!');if(PS.hp<=0)loseLife()}}}
  R.tr=R.tr.filter(t=>!t.done);
  for(const p of R.fx){if(p.corpse){p.x-=0;p.life-=dt;continue}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.g||0)*dt;p.life-=dt}
  R.fx=R.fx.filter(p=>p.life>0);
  for(const t of R.texts){t.y-=14*dt;t.life-=dt}R.texts=R.texts.filter(t=>t.life>0);
  // конец локации
  if(R.x>=LOCS[R.loc].len&&!tr&&!R.end){R.end=true;
    if(R.loc<2)transition(()=>startRide(R.loc+1,false));
    else{const g=PS.rideGain;transition(()=>playC(CUT_ANIS,()=>{PS.syr+=2;sec('park')}));note('Патронов набрал по дороге: '+g)}}
}
// ---- фоны локаций ----
function panelBld(x,base,w,h,k,t){
  const top=base-h;F(x,top,w,h,'#4e4e56');F(x,top,w,2,'#62626a');F(x-1,top-2,w+2,2,'#2a2a30');
  for(let fy=top+5;fy<base-8;fy+=8){F(x,fy+6,w,1,'#43434b');for(let fx=x+3;fx<x+w-4;fx+=7){const hh=hash(Math.round(fx-x)+k*31,fy-top+k);let c=hh<.12?(Math.sin(t*14+hh*60)>0?'#ff7a20':'#ffb030'):hh<.2?'#ffd27a':hh<.3?'#3a1212':'#16161e';F(fx,fy,4,4,c);if(hh>.8)F(fx-1,fy+4,6,2,'#5a5a62')}}
  for(let fx=x+16;fx<x+w;fx+=34)F(fx,top+2,1,h-2,'#3e3e46');
  if(hash(k,3)>.6){const fx=x+10+hash(k,4)*(w-20);for(let i=0;i<4;i++)F(fx+rnd(-3,3),top+20-i*3-rnd(0,3),3,4,i%2?'#ff7a20':'#ffd040')}
}
function rideBgPanelki(off,t){
  sky(SKY_RED,0,118);drawFar(off*.15,96,true);
  const ws=[110,96,130,104,120];let x=-mod(off*.45,560),i=Math.floor(off*.45/560)*5;
  for(let j=0;j<12;j++){const w=ws[(i+j)%5],h=62+hash(i+j,7)*26;if(x>-w&&x<W)panelBld(x,118,w,h,i+j,t);x+=w+8}
  F(0,118,W,10,'#46424a');for(let x=-mod(off,16);x<W;x+=16)F(x,118,1,10,'#3a3640');F(0,128,W,2,'#6a6672');
  F(0,130,W,50,'#1e1c22');for(let x=-mod(off,40);x<W;x+=40)F(x,153,20,1,'#6a6658');
  for(let k=0;k<3;k++){const cx=k*400+200-mod(off,1200);if(cx>-40&&cx<W+10)sideCar(cx,126,['#4a3a3a','#3a3a4a','#4a4a3a'][k],1,k!==1,t)}
}
function rideBgBridge(off,t){
  const tt=off/22;drawPanorama(tt,true,{a:1.95,dx:0,dy:0,gone:true});
  const pan=Math.round(tt*4);
  for(let i=0;i<14;i++){const fx=122+hash(i,1)*76-pan,fy=82+hash(i,2)*14,h=3+Math.abs(Math.sin(t*9+i))*9;F(fx,fy-h,3,h,i%2?'#ff6a1a':'#ffc040')}
  ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,160-pan,84,46,'rgba(255,110,30,A)',.35);ctx.restore();
  F(0,112,W,8,'#2e2830');for(let x=-mod(off,10);x<W;x+=10)F(x,113,2,6,'#3e3640');F(0,112,W,1,'#4a424c');
  for(let k=-1;k<4;k++){const lx=k*120-mod(off,120)+60;F(lx,78,2,34,'#1a1a1e');F(lx-6,78,14,2,'#1a1a1e');for(const dx of [-6,0,6]){F(lx+dx,74,3,4,'#3a3a40');F(lx+dx+1,75,1,2,'#ffcf7a')}}
  F(0,120,W,60,'#24202a');F(0,128,W,1,'#3a3640');F(0,170,W,1,'#3a3640');for(let x=-mod(off,40);x<W;x+=40)F(x,151,20,1,'#6a6658');
}
const SIGNS=['БУТИК','КОФЕ','ЦВЕТЫ','АПТЕКА','ВИНО','ОПТИКА','ШАВЕРМА','ЧАСЫ','КНИГИ','ПЫШКИ'];
const SIGNC=['#a83a5a','#3a6a5a','#7a3a8a','#2a5a9a','#8a5a2a','#3a3a3a'];
const OLDC=['#c8a060','#c98a8a','#8ab8a0','#d8c8a0','#b8a0c8','#d0a070'];
function rideBgPetro(off,t){
  sky(SKY_RED,0,118);drawFar(off*.15,92,true);
  RD.signs.length=0;
  let x=-mod(off*.6,880),i=Math.floor(off*.6/880)*10;
  for(let j=0;j<14;j++){const k=i+j,w=70+Math.floor(hash(k,3)*30),h=78+Math.floor(hash(k,4)*18),top=118-h,c=shade(OLDC[k%6],.5);
    if(x>-w&&x<W){F(x,top,w,h,c);F(x-1,top-3,w+2,3,shade(c,.7));F(x,top+18,w,2,shade(c,1.3));F(x,top+40,w,1,shade(c,1.2));
      for(let fy=top+6;fy<118-26;fy+=17)for(let fx=x+5;fx<x+w-6;fx+=11){const hh=hash(fx-x+k*7,fy-top);F(fx,fy,5,10,hh<.12?(Math.sin(t*12+hh*40)>0?'#ff7a20':'#ffc040'):hh<.22?'#ffd27a':'#1a1420');F(fx-1,fy-1,7,1,shade(c,1.3));F(fx,fy+10,5,1,shade(c,.7))}
      F(x+3,118-22,w-6,22,'#1c1418');F(x+5,118-18,w-10,14,hash(k,9)>.5?'#2a3a44':'#1a1a20');if(hash(k,10)>.5)for(let q=0;q<4;q++)F(x+8+q*9,118-12+q%2*3,4,1,'#8ab0c0');
      const sc=SIGNC[k%6];F(x+6,118-28,w-12,6,sc);F(x+6,118-28,w-12,1,shade(sc,1.4));RD.signs.push([x+w/2,118-23.6,SIGNS[k%SIGNS.length],Math.sin(t*20+k)>-.6||k%3]);
    }x+=w+2}
  F(0,118,W,10,'#5a4e48');for(let x=-mod(off,8);x<W;x+=8)F(x,118,1,10,'#4a3e38');F(0,128,W,2,'#7a6e66');
  F(0,130,W,50,'#26222a');for(let y=134;y<180;y+=6)for(let x=-mod(off,8)+(y%12?4:0);x<W;x+=8)F(x,y,7,5,'#2c2830');
  for(let k=0;k<2;k++){const cx=k*600+350-mod(off,1200);if(cx>-40&&cx<W+10)sideCar(cx,126,'#3a2a2a',1,true,t)}
}
function sideZombie(x,y,t,z){
  const big=z.type==='brute';ctx.save();ctx.translate(Math.round(x),Math.round(y));if(big)ctx.scale(1.6,1.6);
  if(z.flash>0)ctx.globalAlpha=.6;
  sidePed(0,0,t+z.ph,big?'#3a3a2c':ZCOL[z.v%ZCOL.length],-1,true);
  if(z.type==='thrower'){const up=z.wind>0;F(up?-4:1,up?-24:-12,5,5,'#18181c')}
  if(z.type==='fast'){F(-1,-19,3,1,'#ffe040')}
  ctx.restore();
}
function rideRender(){
  const R=RD,t=R.t;ctx.imageSmoothingEnabled=false;
  const sx=C1.shake>0?rnd(-3,3)*C1.shake:0,sy=C1.shake>0?rnd(-3,3)*C1.shake:0;
  ctx.save();ctx.translate(sx,sy);
  ctx.fillStyle='#000';ctx.fillRect(-4,-4,W+8,H+8);
  if(R.loc===0)rideBgPanelki(R.x,t);else if(R.loc===1)rideBgBridge(R.x,t);else rideBgPetro(R.x,t);
  for(const p of R.fx)if(p.corpse){const x=p.x-(R.x-p.bx);F(x-6,p.y-2,12,3,'#3a3030');F(x-8,p.y-1,16,2,'rgba(110,8,14,.8)')}
  const list=R.zs.filter(z=>!z.dead&&z.wx-R.x<W+30&&z.wx-R.x>-30).map(z=>({y:z.y,d:()=>sideZombie(z.wx-R.x,z.y,t,z)}));
  list.push({y:R.py,d:()=>{
    if(R.fall>0){sideScooter(R.px+8,R.py);F(R.px-10,R.py-5,16,5,'#8f9298');F(R.px+6,R.py-6,6,6,'#e8b898');F(R.px+5,R.py-7,4,3,'#3d2b20');F(R.px-14,R.py-4,5,3,'#1c1c22');return}
    if(R.inv>0&&Math.floor(tm*16)%2===0)return;
    shS(R.px-7,R.py-4,t,'stand');
    sideMikrob(R.px,R.py,t,'ride');
    const ax=R.px+3,ay=R.py-25+Math.round(Math.sin(t*8)*.6),a=R.aim||0;
    ctx.save();ctx.translate(ax,ay);ctx.rotate(a);F(0,-1,6,2,'#8f9298');F(5,-1,2,2,'#e8b898');F(6,-2,5,2,'#151515');ctx.restore();
    if(PS.flash>0)F(ax+Math.cos(a)*12-1,ay+Math.sin(a)*12-1,3,3,'#fff6c0');
  }});
  list.sort((a,b)=>a.y-b.y);for(const e of list)e.d();
  for(const b of R.buls){ctx.strokeStyle='#ffe27a';ctx.beginPath();ctx.moveTo(b.x-b.vx*.02,b.y-b.vy*.02);ctx.lineTo(b.x,b.y);ctx.stroke()}
  for(const tt of R.tr){const x=tt.wx-R.x;F(x-2,tt.y,4,1,'rgba(0,0,0,.4)');F(x-2,tt.y-tt.h-3,5,4,'#1c1c20');F(x-1,tt.y-tt.h-3,2,1,'#5a5a50')}
  for(const p of R.fx)if(!p.corpse)F(p.x,p.y,2,2,p.c);
  if(R.loc===1){F(0,174,W,6,'#2e2830');for(let x=-mod(R.x*1.3,12);x<W;x+=12)F(x,175,3,5,'#3e3640')}
  ctx.restore();
  if(C1.hurt>0){ctx.fillStyle=`rgba(200,0,20,${C1.hurt*.5})`;ctx.fillRect(0,0,W,H)}
}

// ================= КАТ-СЦЕНЫ =================
// 04.11: Шмакодявка всю главу 1 рядом с Микробом (кат-сцены, самокат, машина)
function shS(x,y,t,m,g){const K=window.K56;if(K&&K.sideShmak)try{K.sideShmak(x,y,t,m||'stand',g)}catch(e){}}
function sideRover(x,y,t,o){
  o=o||{};ctx.save();if(o.left){ctx.translate(2*x+52,0);ctx.scale(-1,1)}
  const B='#111115',BL='#26262e',bob=o.move?Math.round(Math.sin(t*20)*.6):0;y+=bob;
  F(x,y-18,52,11,B);F(x,y-18,52,1,BL);F(x+5,y-29,38,11,B);F(x+5,y-29,38,1,BL);
  F(x+7,y-27,10,7,'#1c2430');F(x+19,y-27,10,7,'#1c2430');F(x+31,y-27,10,7,'#1c2430');F(x+8,y-27,2,7,'#2a3644');
  F(x+4,y-31,40,2,'#2a2a30');for(let i=0;i<5;i++)F(x+31+i*3,y-33,2,2,o.lights?'#fff6c0':'#7a7a68');
  F(x+52,y-17,3,11,'#3a3a40');F(x+54,y-12,2,3,'#5a5a5a');F(x-3,y-19,4,10,'#0a0a0c');
  F(x+50,y-16,2,3,'#fff6c0');F(x,y-16,1,3,'#ff2a2a');
  for(const wx of [6,36]){F(x+wx,y-9,12,9,'#0a0a0c');F(x+wx+3,y-7,6,5,'#3a3a40');F(x+wx+5,y-5,2,1,'#6a6a70')}
  if(o.trunk)F(x-7,y-29,7,13,'#1a1a1e');
  if(o.heads){F(x+34,y-27,4,4,'#e2ad8c');F(x+34,y-28,4,2,'#241a15');F(x+22,y-27,4,4,'#e8b898');F(x+22,y-28,4,2,'#3d2b20');F(x+25,y-25,1,1,'#ffd23a');F(x+10,y-27,4,4,'#f2cab2');F(x+9,y-28,6,2,'#2c1a1f');F(x+9,y-27,1,6,'#2c1a1f')}
  ctx.restore();
  if(o.lights){ctx.save();ctx.globalCompositeOperation='lighter';const d=o.left?-1:1,hx=o.left?x+2:x+52;const g=ctx.createLinearGradient(hx,0,hx+d*80,0);g.addColorStop(0,'rgba(255,240,180,.45)');g.addColorStop(1,'rgba(255,240,180,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(hx,y-16);ctx.lineTo(hx+d*80,y-26);ctx.lineTo(hx+d*80,y+2);ctx.closePath();ctx.fill();ctx.restore()}
}
function sideAnis(x,y,t,aim,lying){
  const SK='#e2ad8c',HR='#241a15',TN='#18181c',VS='#4e4e32';
  if(lying){F(x-14,y-5,22,5,TN);F(x-12,y-6,12,5,VS);F(x+8,y-7,7,7,SK);F(x+9,y-8,6,3,HR);F(x-20,y-3,7,3,'#24242a');F(x-30,y-1,40,2,'rgba(110,8,14,.8)');return}
  F(x-3,y-10,2,10,'#24242a');F(x,y-10,2,10,'#24242a');F(x-4,y-2,4,2,'#3a2a1a');F(x,y-2,4,2,'#3a2a1a');
  const ty=y-10;F(x-4,ty-12,8,12,TN);F(x-4,ty-11,7,9,VS);F(x-1,ty-11,1,9,TN);F(x-3,ty-6,2,2,'#3a3a24');
  if(aim){F(x+1,ty-9,6,2,TN);F(x+3,ty-10,13,1,'#2a2a2e');F(x-1,ty-9,4,2,'#6a4424')}else{F(x+3,ty-13,1,13,'#2a2a2e');F(x+2,ty-3,2,5,'#6a4424');F(x+2,ty-9,2,6,TN)}
  const hy=ty-19;F(x-3,hy,8,8,SK);F(x-4,hy-1,8,3,HR);F(x-4,hy+1,2,3,HR);F(x+2,hy+5,3,1,'#f4f0ea');F(x+3,hy+3,1,1,'#2a1e18');F(x-2,ty-13,6,2,TN);
}
function bossSide(x,y,t,grab){
  ctx.save();ctx.translate(x,y);ctx.scale(2,2);
  const s=Math.sin(t*10);F(-2+Math.round(s),-7,2,7,'#1a1a20');F(1-Math.round(s),-7,2,7,'#1a1a20');
  F(-4,-17,8,11,'#3a3e4a');F(-1,-17,2,8,'#e8e8e8');F(0,-16,1,6,'#b0202a');
  if(grab){F(-10,-16,7,2,'#3a3e4a');F(-12,-16,2,2,'#7fa070')}else{F(-9,-15,6,2,'#3a3e4a');F(-11,-15,2,2,'#7fa070')}
  F(-3,-23,6,6,'#7fa070');F(-3,-24,6,1,'#3a3a3a');F(-3,-21,1,1,'#ff2020');ctx.restore();
}
function cityRuins(off,t,ruin){
  sky(SKY_RED,12,104);drawFar(off*.2,104,true);
  ctx.save();drawStrip(STRIP,off,142,true,t);ctx.restore();
  if(ruin){for(let i=-1;i<6;i++){const x=i*70-mod(off,70);for(let k=0;k<5;k++){const h=4+Math.abs(Math.sin(t*8+i+k))*8;F(x+12+k*7,104-h,3,h,k%2?'#ff6a1a':'#ffc040')}}if(Math.random()<.5)cparts.push({x:rnd(0,W),y:rnd(70,100),vx:rnd(-3,3),vy:rnd(-10,-4),life:3,c:'smoke',r:3})}
  street(off,142,true);
}
function liftScene(t,lines,up,noA){
  F(0,0,W,H,'#0e0e12');const x0=60,y0=16,w=200,h=152,fl=Math.sin(t*23)*Math.sin(t*7)>.6;
  F(x0,y0,w,h,'#4e525a');for(let x=x0;x<x0+w;x+=6)F(x,y0,1,h,'#464a52');F(x0,y0+h-16,w,16,'#26262a');for(let x=x0;x<x0+w;x+=10)F(x,y0+h-16,1,16,'#2e2e32');
  F(x0+10,y0+4,w-20,3,fl?'#5a6070':'#e8f0ff');F(x0,y0+92,w,2,'#9aa0a8');F(x0+w-20,y0+40,8,22,'#3a3a40');for(let i=0;i<4;i++)F(x0+w-18,y0+42+i*5,4,3,i===1?'#ffcf5a':'#7a7a80');
  F(x0+w/2-16,y0+12,32,12,'#0a0a0a');ctx.fillStyle='#ff3030';ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.fillText((up?'▲ ':'▼ ')+(up?Math.min(5,1+Math.floor(t/1.4)):Math.max(1,5-Math.floor(t/1.4))),x0+w/2,y0+21.5);ctx.textAlign='left';
  ctx.save();ctx.translate(130,y0+h-15);ctx.scale(2,2);sideMikrob(0,0,t,'stand');ctx.restore();
  if(!noA){ctx.save();ctx.translate(196,y0+h-15);ctx.scale(-2,2);sideAnis(0,0,t,false);ctx.restore()}
  ctx.save();ctx.translate(98,y0+h-15);ctx.scale(2,2);shS(0,0,t,'stand');ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,160,y0+8,90,'rgba(200,220,255,A)',fl?.05:.18);ctx.restore();
  if(fl){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,0,W,H)}
}
function officeYardShot(t){
  sky(SKY_RED,12,90);drawFar(40,90,true);
  for(const [x,w] of [[10,120],[190,120]]){F(x,30,w,70,'#4a4238');for(let fy=36;fy<92;fy+=10)for(let fx=x+5;fx<x+w-6;fx+=10)F(fx,fy,6,6,hash(fx,fy)<.15?'#ff8a3a':'#16141c');}
  F(0,100,W,60,'#2a2a30');F(0,138,W,4,'#1e2a24');for(let x=0;x<W;x+=4)F(x,132,1,10,'#2a3a30');F(146,128,28,14,'#3a4a40');F(148,130,24,10,'#1a1a20');
  for(let i=0;i<4;i++){F(30+i*40,118,26,10,['#3a5a8a','#8a2a2a','#c8c8c8','#2a2a2a'][i])}
  sideRover(180,172,t,{lights:true});
}
const CUT_CITY=[
  {dur:5.6,subs:[[.5,2.8,null,'(Вчера тут были пробки, шаверма и самокатчики.)'],[2.9,5.4,null,'(А сегодня... До Петроградки три района. Придётся прорываться.)']],draw(t){
    cityRuins(800+t*6,t,true);for(let i=0;i<6;i++){const x=mod(W-t*(8+i)-i*52,W+40);sidePed(x,148+(i%3)*8,t+i,ZCOL[i],-1,true)}
    for(let x=0;x<W;x+=4)F(x,150,1,12,'#2a3a30');F(0,150,W,1,'#2a3a30');F(0,156,W,1,'#2a3a30');
    shS(46,176,t,'stand');sideMikrob(60,176,t,'idle');drawSmoke();if(Math.random()<.3)cparts.push({x:rnd(0,W),y:rnd(60,100),vx:rnd(-3,3),vy:rnd(-10,-4),life:3,c:'smoke',r:3})}},
  {dur:3,subs:[[.3,1.6,'m','Ну что, Черсик... папа поехал на работу.'],[1.7,2.9,'s','Держись крепче, зай. Я сзади.']],draw(t){
    cityRuins(824+t*30,t,true);shS(53+t*t*20,172,t,'stand');sideMikrob(60+t*t*20,176,t,'ride');headlights(72+t*t*20,172,1)}},
];
const CUT_ANIS=[
  {dur:7.2,subs:[[.4,2.2,'m','Их слишком много...'],[2.4,4.2,null,'*РЁВ МОТОРА*'],[4.8,7,'a','Тук-тук! Такси до офиса заказывали?']],draw(t,s){
    if(!RD)RD={signs:[]};rideBgPetro(2600,t);
    const rx=t<1.6?W+20:Math.max(96,W+20-(t-1.6)*130);
    s._z=s._z||[0,1,2,3,4].map(i=>({x:140+i*34,y:150+(i%3)*9,fly:0,vy:0}));
    for(const z of s._z){if(!z.fly&&rx<z.x+6&&t>1.6){z.fly=1;z.vy=-80;C1.shake=.3;for(let i=0;i<10;i++)cparts.push({x:z.x,y:z.y-10,vx:rnd(-40,40),vy:rnd(-80,-20),g:200,life:1,c:'#8a1018'})}
      if(z.fly){z.vy+=200*1/60;z.y+=z.vy/60;z.x-=2;if(z.y<200){ctx.save();ctx.translate(z.x,z.y);ctx.rotate(t*8);sidePed(0,0,t,'#4a3a3a',-1,true);ctx.restore()}}
      else{z.x-=.15;sidePed(z.x,z.y,t+z.x,'#4a3a3a',-1,true)}}
    shS(62,172,t,'stand');sideMikrob(48,172,t,'stand');sideScooter(30,172);
    sideRover(rx,176,t,{left:true,lights:true,move:rx>96});drawSmoke();
    if(cut&&cut.shake<.3&&t>1.6&&rx>96)cut.shake=.15}},
  {dur:1,lines:[['m','Анис!!! Ты как танк приехал.'],['s','Здравствуйте, Анис! Я с ним.'],['a','Шмакодявка? Вот это поддержка. Садись назад.'],['a','Он и есть танк. Лебёдка, кенгурятник, люстра на крыше. Заряженный по полной.'],['a','Самокат в багажник, сам в машину. Быстро!']],draw(t){
    rideBgPetro(2600,t);sideRover(96,176,t,{left:true,lights:true,trunk:true});sideMikrob(166,172,t,'stand');shS(152,172,t,'stand');sideScooter(176,170);sideAnis(84,176,t,true)}},
  {dur:1,lines:[['a','Держи. Два шприца. Зелёные, охотничьи.'],['a','Вколол — и раны затягиваются. Кнопка H, если что.'],['m','Это вообще законно?'],['a','Сейчас всё законно.'],
    ['a','План такой. Во дворе офиса два здания. В первом офисе вырубило свет.'],['a','В серверной рубильник. Он даёт питание во второй офис. А сервер там, в моём кабинете.'],
    ['a','И ещё. В первом офисе моя заначка. Пять бутылок самогона. Сам гнал, сам прятал по кабинетам.'],['m','Самогон? Анис, сейчас не время.'],['a','Он горит как напалм. Поверь охотнику. И патроны там есть, я хранил. Поищи.']],draw(t){
    rideBgPetro(3000+t*120,t);sideRover(130,176,t,{lights:true,move:true,heads:true});drawSmoke()}},
  {dur:3.4,subs:[[.4,3.2,'a','Приехали. Двор офиса. Держись рядом и не геройствуй.']],draw(t){officeYardShot(t)}},
];
const CUT_LIFT1=[
  {dur:1,lines:[['a','Лифт работает от аварийки. Повезло.'],['a','Значит так. Задачи в первом офисе.'],['a','Первое: самогон. Пять бутылок, по разным кабинетам.'],['a','Второе: патроны и шприцы. Всё, что найдёшь, бери.'],
    ['a','Третье: серверная, она сразу у холла. Там рубильник. Врубишь, и во втором офисе дадут свет.'],['a','И зачищаем всё. Каждый кабинет.'],['m','Ты стреляешь, я бью. Понял.'],['a','Стреляю я так себе, если честно. Вся надежда на тебя, Микроб.'],['s','А я подожду тут, в лифте. Тут безопасно, двери держат.'],['m','Никуда не выходи. Мы быстро.'],['s','Возвращайтесь целыми. Оба.']],draw(t){liftScene(t,null,true)}},
];
const CUT_LIFT_DOWN=[
  {dur:1,lines:[['s','Живые! Я тут чуть с ума не сошла от звуков.'],['a','Самогон у тебя, рубильник включён. Хорошая работа.'],['m','Теперь второй офис. Пошли за сервером.']],draw(t){liftScene(t,null,false)}},
];
const CUT_OFF2=[
  {dur:1,lines:[['s','Я снова жду в лифте. Удачи, мальчики.'],['m','...Ох.'],['a','Тут их в три раза больше. Это же весь отдел продаж.'],['m','Работаем как в первом. Чётко. Я впереди, ты прикрываешь.'],
    ['a','Бутылку кидай в толпу и отходи. Самогон моего производства, горит до последнего.'],['a','Мой кабинет в самом конце, стеклянный. Сервер там.']],draw(t){
    F(0,0,W,H,'#0e0a10');const fl=Math.sin(t*17)*Math.sin(t*5)>.4;
    F(0,30,W,110,'#2a2830');for(let x=0;x<W;x+=40){F(x+10,30,10,110,'#3a3840');F(x+30,36,6,4,fl?'#2a2a30':'#e8f0ff')}
    F(0,140,W,40,'#26283a');for(let i=0;i<7;i++){F(20+i*44,120,30,10,'#c8c0b0');F(30+i*44,112,8,8,'#141418')}
    for(let i=0;i<14;i++){const x=40+i*20+Math.sin(t*2+i)*3;sidePed(x,150+(i%3)*8,t+i,ZCOL[i%8],-1,true)}
    F(0,0,26,H,'#6a6e76');F(W-26,0,26,H,'#6a6e76');
    if(fl){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,0,W,H)}
    ctx.save();ctx.translate(46,176);ctx.scale(1.4,1.4);sideMikrob(0,0,t,'stand');ctx.restore();ctx.save();ctx.translate(20,178);ctx.scale(1.4,1.4);sideAnis(0,0,t,true);ctx.restore()}},
];
function glassOffice(t){
  F(0,0,W,H,'#1a1620');F(0,20,W,130,'#2a2630');for(let x=20;x<W;x+=60){F(x,20,2,130,'rgba(150,210,255,.4)')}
  F(220,100,70,24,'#3a2a20');F(226,92,16,8,'#141418');F(270,60,26,60,'#1a1c22');for(let i=0;i<6;i++)F(272,62+i*9,22,4,'#2a8a4a');
  F(0,150,W,30,'#5a3c24');for(let x=0;x<W;x+=12)F(x,150,1,30,'#4a301c');
}
const CUT_DEATH=[
  {dur:3.4,subs:[[.2,1.5,'a','Готов? Добиваем его!'],[1.7,3.3,'a','А-А-А!!!']],draw(t,s){
    glassOffice(t);
    if(t<1.6){bossSide(200,168,t,false);sideAnis(140,168,t,true);sideMikrob(90,168,t,'stand')}
    else{if(!s._hit){s._hit=1;cut.shake=1.2;sfx('hurt');for(let i=0;i<30;i++)cparts.push({x:170,y:140,vx:rnd(-60,60),vy:rnd(-90,-10),g:220,life:1.4,c:'#8a1018'})}
      bossSide(180,168,t,true);sideAnis(160,168,t,false);sideMikrob(90,168,t,'stand');ctx.fillStyle=`rgba(255,0,0,${Math.max(0,.5-(t-1.6))})`;ctx.fillRect(0,0,W,H)}
    drawSmoke()}},
  {dur:2.6,subs:[[.2,2.4,'m','ПОЛУЧАЙ!!!']],draw(t,s){
    glassOffice(t);sideAnis(150,168,t,false,true);
    const k=Math.min(1,t/.5);if(t>.5&&!s._b){s._b=1;cut.shake=1;sfx('bat');for(let i=0;i<20;i++)cparts.push({x:200,y:140,vx:rnd(-30,80),vy:rnd(-80,-10),g:220,life:1.2,c:'#8a1018'})}
    if(t<.8)bossSide(206,168,t,false);else{F(186,162,40,6,'#3a3e4a');F(224,162,8,6,'#7fa070');F(180,166,50,2,'rgba(110,8,14,.8)')}
    sideMikrob(110+k*70,168,t,'stand');ctx.save();ctx.translate(184+k*0,140);ctx.rotate(-1.2+k*2.2);F(0,-1,18,3,'#b07434');ctx.restore();drawSmoke()}},
  {dur:1,lines:[['m','Анис! Анис, держись!'],['a','...Не вышло у нас... с сервером...'],['a','Ружьё... возьми. Два режима... Вблизи дробь, вдаль пуля.'],['a','Припасы... в шкафу. Это вам... с Шмакодявкой...'],['m','Анис...'],['m','...']],draw(t){
    glassOffice(t);sideAnis(150,168,t,false,true);F(186,162,40,6,'#3a3e4a');F(224,162,8,6,'#7fa070');sideMikrob(130,168,t,'stand');
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,0,W,H)}},
];
function isaac(cx,base,t,fall){
  const c='#6a5a4c',cd='#4a3e34';
  F(cx-62,base-36,124,36,c);for(let i=0;i<12;i++)F(cx-56+i*10,base-32,4,28,'#8a7a6a');for(let r=0;r<12;r++)F(cx-36+r*3,base-36-r,72-r*6,1,c);
  F(cx-62,base-54,16,18,c);F(cx+46,base-54,16,18,c);ell(ctx,cx-54,base-56,6,5,'#8a7030');ell(ctx,cx+54,base-56,6,5,'#8a7030');
  const k=fall||0,dx=k*14,dy=k*k*46;
  if(k<1.4){F(cx-20,base-62+dy*.3,40,26-dy*.3,cd);for(let i=0;i<8;i++)F(cx-18+i*5,base-60+dy*.3,2,22,'#6a5a4a');
    ctx.save();ctx.translate(cx+dx,base-62+dy);ctx.rotate(k*.5);for(let r=0;r<20;r++){const w=Math.round(Math.sqrt(400-r*r)*2);F(-w/2,-r,w,1,r%4?'#c8a040':'#a8822a')}F(-3,-26,6,6,'#c8a040');F(-1,-32,2,6,'#e8c050');ctx.restore()}
  if(k>0){for(let i=0;i<3;i++)cparts.push({x:cx+rnd(-40,40),y:base-30-rnd(0,20),vx:rnd(-10,10),vy:rnd(-12,-3),life:3,c:'smoke',r:4})}
  for(let i=0;i<8;i++){const h=4+Math.abs(Math.sin(t*9+i))*10;F(cx-50+i*13,base-36-h,3,h,i%2?'#ff7a20':'#ffc040')}
}
const CUT_HOME=[
  {dur:1,lines:[['s','Зай! Что там было?! А где Анис?'],['m','...Анис не выжил. Босс достал его в последний момент.'],['s','Господи...'],['m','Пошли. Расскажу по дороге.']],draw(t){liftScene(t,null,false,true)}},
  {dur:4.6,subs:[[.4,4.3,null,'(Прости, Анис. Твоя машина теперь со мной.)']],draw(t){officeYardShot(t);F(160,150,8,22,'#8f9298');F(160,144,7,6,'#e8b898');shS(176,172,t,'stand')}},
  {dur:5.2,subs:[[.4,2.5,null,'(Город за один день превратился в руины.)'],[2.6,5,null,'(Мой район, мост, Петроградка. Всё горит.)']],draw(t){
    cityRuins(1500+t*140,t,true);for(let i=0;i<5;i++){const x=mod(W+40-t*160-i*90,W+80)-40;sidePed(x,170,t+i,ZCOL[i],-1,true)}sideRover(120,178,t,{lights:true,move:true,heads:true});drawSmoke();
    if(Math.random()<.4)cparts.push({x:rnd(0,W),y:rnd(60,110),vx:rnd(-3,3),vy:rnd(-10,-4),life:3,c:'smoke',r:3})}},
  {dur:6.4,subs:[[.4,3,null,'(Исаакий... Даже он не выдержал.)'],[3.4,6.2,'m','Господи...']],draw(t){
    sky(SKY_RED,12,140);drawFar(200,130,true);const k=Math.max(0,t-1.8)*.55;isaac(170,140,t,Math.min(1.5,k));
    if(t>1.8&&t<2.2&&cut)cut.shake=.6;F(0,140,W,40,'#1e1a22');sideRover(-60+t*40,176,t,{lights:true,move:true});drawSmoke()}},
  {dur:5.4,subs:[[.4,5.2,null,'(Этот мост последний целый. Остальные рухнули в Неву.)']],draw(t){
    sky(SKY_RED,12,100);drawFar(300,100,true);F(0,100,W,80,'#1a080c');
    for(const [x,y,w] of [[20,96,60],[200,98,90]]){F(x,y,w*.4,3,'#2a1a1a');F(x+w*.6,y,w*.4,3,'#2a1a1a');ctx.save();ctx.translate(x+w*.4,y);ctx.rotate(.5);F(0,0,w*.2,3,'#2a1a1a');ctx.restore();for(let i=0;i<3;i++)F(x+i*w/3,y+3,3,10,'#1e1214')}
    for(let y=104;y<140;y+=3)F(mod(y*37-t*20,W),y,10,1,'#3a1418');
    F(0,140,W,4,'#3a3036');F(0,144,W,36,'#24202a');for(let x=0;x<W;x+=10)F(x,140,2,4,'#4a4048');
    sideRover(-60+t*80,172,t,{lights:true,move:true})}},
  {dur:1,lines:[['G','Свои! Открывай!'],['H','С возвращением, боец. Живой — уже хорошо.'],['H','...Хорошая машина. Ставь у будки.']],draw(t){
    drawHouse(t);ctx.fillStyle='rgba(80,0,10,.35)';ctx.fillRect(0,0,W,H);for(let x=0;x<W;x+=6)F(x,136,6,4,(x/6)%2?'#8a7a5a':'#9a8a64');
    F(250,118,14,10,'#3a4030');F(256,116,12,2,'#1a1a1e');sideRover(Math.min(130,-60+t*90),176,t,{lights:true,move:t<2})}},
];
function playC(shots,onEnd){C1.on=true;C1.mode='cut';
  const mk=shots===CUT_CITY?'city':shots===CUT_ANIS?'anis':(shots===CUT_LIFT1||shots===CUT_LIFT_DOWN)?'lift':shots===CUT_OFF2?'office2':shots===CUT_DEATH?'death':shots===CUT_HOME?'home':null;
  if(mk)mz(mk);playCut(shots,()=>go(onEnd))}
C1.CUTS={CUT_CITY,CUT_ANIS,CUT_LIFT1,CUT_LIFT_DOWN,CUT_OFF2,CUT_DEATH,CUT_HOME};

// ================= МУЗЫКА (временно — треки пролога) =================
// Когда придут треки для кат-сцен главы 1: положить в music/ и вписать сюда.
for(const [k,f] of [['ride','ride.mp3'],['rampage','rampage.mp3'],['bunker','bunker.mp3']]){if(!MUS[k]){const a=new Audio('music/'+f);a.loop=true;a.preload='auto';a.volume=0;MUS[k]=a}}
// ride = BABURA «TEK» (дорога до офиса), rampage = BABURA «RAMPAGE Intro» (резня в офисах), bunker = BABURA Sixxseven «BUNKER» (кат-сцены с Анисом)
const MZ={fort:'menu',city:'ride',ride:'techno_show',anis:'bunker',combat:'neuro',lift:'bunker',office2:'hellraiser',death:'menu',home:'menu',ending:'flat',park:'unmix',off1:'hellraiser'};
C1.MZ=MZ;
function mz(k){const n=MZ[k];if(n&&MUS[n])music(n)}
// ---- МУЗЫКА: общий движок для пролога и всех глав.
// ПК: у каждого трека свой <audio>, плавный кроссфейд через volume.
// Телефон/планшет: ОДИН плеер MP, треки меняются подменой src — два трека физически не могут играть одновременно
// (iOS не даёт менять volume, а Android/iOS глючат с кучей параллельных <audio> и 50 МБ предзагрузки).
// Главы включают музыку только через music('ключ'); новые треки — MUS[k]=new Audio('music/x.mp3') (сам трек не играет).
const VOLOK=!window.__forceIOSAudio&&(()=>{try{const a=new Audio();a.volume=.5;return Math.abs(a.volume-.5)<.01}catch(e){return false}})();
const MOB=!!window.__forceIOSAudio||!VOLOK||('ontouchstart' in window)||(navigator.maxTouchPoints||0)>0;
const MURL={};
function mTame(){for(const k in MUS){const a=MUS[k];if(!MURL[k])MURL[k]=a.currentSrc||a.src;if(MOB){if(!a.paused)a.pause();if(a.getAttribute('src')){a.preload='none';a.removeAttribute('src');try{a.load()}catch(e){}}}}}
let MP=null,mpKey=null,mpWant=false;
if(MOB){MP=new Audio();MP.loop=true;MP.preload='auto';MP.volume=VOLOK?0:1;mTame();
  if(musCur){const k=musCur;musCur=null;music(k)}}
function mpPlay(){if(!MP||!mpKey)return;mpWant=true;MP.muted=muted;const p=MP.play();if(p&&p.catch)p.catch(()=>{})}
const music0=music;
music=function(name){
  if(!MOB)return music0(name);
  musCur=name;mTame();if(!MURL[name])return;
  if(mpKey!==name){mpKey=name;MP.pause();MP.src=MURL[name];if(VOLOK)MP.volume=0;try{MP.currentTime=0}catch(e){}}
  if(MP.paused)mpPlay()};
function musicKick(){if(MOB&&mpKey&&musCur===mpKey&&MP.paused&&!document.hidden)mpPlay()}
document.addEventListener('visibilitychange',()=>{if(!MP)return;if(document.hidden)MP.pause();else musicKick()});
// touchstart в Chrome/Android и новых iOS не считается жестом — разблокируем звук на отпускании пальца и клике
for(const ev of ['touchend','click','pointerup','keyup'])addEventListener(ev,()=>{if(AC||MOB)ac();musicKick()},true);
// ---- кнопка звука (телефон): HTML-кнопка поверх канваса, работает на титуле, в кат-сценах и во всех главах
try{if(localStorage.getItem('snd_off')==='1')muted=true}catch(e){}
const SND_ON='<svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 9h4l5-4v14l-5-4H3z" fill="#fff"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
const SND_OFF='<svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 9h4l5-4v14l-5-4H3z" fill="#ff5a8a"/><path d="M16 9l6 6M22 9l-6 6" stroke="#ff5a8a" stroke-width="2.4" stroke-linecap="round"/></svg>';
let sndBtn=null;
function sndPaint(){if(sndBtn)sndBtn.innerHTML=muted?SND_OFF:SND_ON}
function setMuted(v){muted=!!v;try{localStorage.setItem('snd_off',muted?'1':'0')}catch(e){}sndPaint();if(MP)MP.muted=muted;if(!muted){ac();musicKick()}}
C1.setMuted=setMuted;
if(MOB){sndBtn=document.createElement('div');sndBtn.id='sndBtn';sndBtn.setAttribute('aria-label','Звук');
  sndBtn.style.cssText='position:fixed;z-index:50;top:calc(env(safe-area-inset-top,0px) + 8px);right:calc(env(safe-area-inset-right,0px) + 8px);width:40px;height:40px;border-radius:50%;background:rgba(10,8,20,.55);border:1.5px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;touch-action:none;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none';
  document.body.appendChild(sndBtn);sndPaint();
  const onBtn=e=>{const t=e.changedTouches?e.changedTouches[0]:e;const r=sndBtn.getBoundingClientRect();return t&&t.clientX>=r.left-6&&t.clientX<=r.right+6&&t.clientY>=r.top-6&&t.clientY<=r.bottom+6};
  const eat=e=>{e.preventDefault();e.stopImmediatePropagation()};
  for(const ev of ['touchstart','touchmove','mousedown','click','pointerdown','pointerup'])addEventListener(ev,e=>{if(onBtn(e))eat(e)},{capture:true,passive:false});
  addEventListener('touchend',e=>{if(!onBtn(e))return;eat(e);setMuted(!muted)},{capture:true,passive:false});
  addEventListener('mouseup',e=>{if(!onBtn(e))return;eat(e);setMuted(!muted)},{capture:true});
  addEventListener('keydown',e=>{if(e.code==='KeyM')setTimeout(sndPaint,0)},true);}
C1.audio={get VOLOK(){return VOLOK},get MOB(){return MOB},get MP(){return MP},get key(){return mpKey}};
function routeMusic(){}
updateMusic=function(dt){
  if(!MOB){for(const k in MUS){const a=MUS[k];if(a.paused)continue;const tg=(k===musCur&&!muted)?MUS_VOL:0;
    a.volume=tg>a.volume?Math.min(tg,a.volume+dt*.8):Math.max(tg,a.volume-dt*.6);if(k!==musCur&&a.volume<=.001)a.pause()}return}
  mTame();
  if(MP.muted!==muted)MP.muted=muted;
  if(VOLOK&&!MP.paused&&MP.volume<MUS_VOL)MP.volume=Math.min(MUS_VOL,MP.volume+dt*1.5)};

// ================= СЮЖЕТ И РАЗДЕЛЫ =================
function go(fn){if(tr&&!tr.done)return;transition(fn)}
function sec(n){
  C1.on=true;C1.over=null;C1.hurt=0;C1.shake=0;PS.carry=false;PS.inv=1;C1.mdown=false;lockMove=false;dlg=null;
  const s0=snap();C1.sec=n;C1.retry=()=>{restore(s0);PS.lives=3;PS.hp=PS.max;sec(n)};
  if(n.startsWith('ride')){startRide(+n[4],true);C1.retry=()=>{restore(s0);PS.lives=3;PS.hp=PS.max;sec(n)};return}
  C1.mode='td';scene='c1td';
  if(n==='fort'){lvFort();mz('fort');if(!C1.noFortHi)after(.6,()=>say([['m','Ого... Наш двор не узнать.'],['m','Это что, тётушка Ханжа в камуфляже?!']]))}
  if(n==='park'){lvPark(1);mz('park');after(.5,()=>say([['a','Парковка. Дохляки между машин. Работаем!'],['m','ЛКМ — бить или стрелять, 1/2 или Q — сменить оружие. Поехали.']]))}
  if(n==='off1'){lvOff1();mz('off1');after(.5,()=>say([['a','Темно, как в багажнике. Фонарь у тебя на телефоне, свети.']]))}
  if(n==='park2'){lvPark(2);mz('park')}
  if(n==='off2'){lvOff2(false);mz('office2')}
  if(n==='off2b'){lvOff2(true);mz('death');after(.6,()=>say([['m','Анис погиб. Сервер... Надо проверить сервер. И забрать ружьё.']]))}
  C1.cx=clamp(pl.x-W/2,0,Math.max(0,L.w-W));C1.cy=clamp(pl.y-H/2,0,Math.max(0,L.h-H));if(L.w<=W)C1.cx=(L.w-W)/2;if(L.h<=H)C1.cy=(L.h-H)/2;
}
C1.sec=null;C1.go=sec;
function retry(){const f=C1.retry;C1.over=null;if(f)transition(f)}
// звонок Аниса в квартире
function startCall(){
  lockMove=true;
  say([['m','Всё. Бита, пистолет и коробка патронов от бати.'],['s','И что теперь? Сидеть тут и ждать, пока они дверь выломают?'],['m','Не знаю. Еды на пару дней. Интернет еле живой...'],['c','Мяу. (Корма на один день. Я считал.)']],()=>{
    sfx('ring');after(.9,()=>sfx('ring'));note('Звонит телефон: «Анис (директор)»');
    after(1.8,()=>say([['m','Алло? Анис?'],['a','Микроб! Живой? Слава богу. Слушай внимательно.'],['a','В офисе полный кошмар. Связи нет, электричества нет. А там сервер со всей инфраструктурой компании.'],
      ['a','Если не вытащим сервер, компании конец. Всё, что мы строили, просто исчезнет.'],['m','Анис, там на улицах зомби. Ты серьёзно?'],
      ['a','Серьёзнее некуда. Я уже еду на своём Land Rover, ружьё с собой. Подберу тебя на Петроградке, недалеко от офиса.'],
      ['a','Поможешь — отдам тебе ценный лут из второго офиса. Там то, что поможет вам выжить. Слово охотника.'],['m','...Ладно. Еду.'],
      ['s','Ты с ума сошёл?! ...Ладно. Но одного я тебя не отпущу. Я с тобой.'],['m','Шмакодявка, там опасно.'],['s','Поэтому и с тобой. Пистолет бати я заберу, стрелять умею. Черсик, ты за старшего.'],['c','Мяу. (Ну наконец-то признали.)'],['c','Мяу! (И корм. Не забудь корм.)']],()=>{C1.called=true;S.step=11;lockMove=false;if(PS.ammo<12)PS.ammo=12;
      if(shmak.mode==='sit'||shmak.mode==='stand'){shmakGo(SHMAK_PATH,()=>{shmak.mode='stand';shmak.a=-Math.PI/2})} // 04.11: идёт к двери вместе с Микробом
      note('Шмакодявка ждёт у входной двери')}));
  });
}
function leaveFlat(){lockMove=true;const g=()=>go(()=>{lockMove=false;S.fade=0;sec('fort')});
  if(shmak.mode==='walk'){const t0=shmak.then;shmak.then=()=>{if(t0)t0();g()};return}g()}
// финал главы в квартире
function endHome(){
  C1.on=false;C1.mode=null;scene='flat';mz('ending');
  unlockLeg('gun');S.step=12;S.alarm=true;S.skladLocked=false;S.bat=S.pistol=true;mapDirty=true;
  pl.x=212;pl.y=204;pl.a=Math.PI;pl.ma=Math.PI;pl.scoot=false;pl.sit=false;lastRoom=null;camY=0;
  // 04.11: заходят домой вместе, целуются у двери
  pl.x=188;pl.y=196;pl.a=0;pl.ma=0;shmak.mode='stand';shmak.x=210;shmak.y=206;shmak.a=Math.PI;shmak.path=[];shmak.hug=0;lockMove=true;dlg=null;
  after(.8,()=>say([['m','Черсик! Мы дома!'],['s','Зай... иди сюда.']],()=>{
    shmakGo([{x:199,y:200}],()=>{shmak.mode='stand';shmak.a=Math.PI;pl.a=0;shmak.hug=1.6;for(let i=0;i<10;i++)parts.push({x:shmak.x+8+rnd(-6,6),y:shmak.y+rnd(-6,4),vx:rnd(-6,6),vy:rnd(-22,-10),life:1.6,c:'heart'});
      after(1.7,()=>say([['s','Мы живы. Мы правда живы. Я там чуть с ума не сошла!'],['m','Живой. А вот Анис... не выжил. И сервер тоже. Компании больше нет.'],['s','Господи... Мне так жаль, зай.'],
        ['m','Он отдал мне всё, что у него было. Смотри: его дробовик, рюкзак еды, лекарства, патроны.'],['m','И его Land Rover. Стоит у будки, Ханжа охраняет.'],
        ['c','Мяу?! (Корм принёс?)'],['m','Корма нет, Черсик. Прости.'],['c','Мяу. (Предатель.)'],
        ['s','Город горит, а мы живы. И у нас теперь есть машина.'],['s','Что будем делать дальше?'],['m','Для начала поедим. А дальше... придумаем.'],
        ['s','Кстати! Пока ты отсыпался, я разобрала комнату родителей. Хлам — на помойку.'],['s','Теперь там наша оружейная: стойка под стволы, аптечка, броня, запасы еды и воды.'],
        ['s','Повесила полку для всяких находок и стену с нашими фотками. Чтобы было уютно.'],['m','Зай... Ты лучшая.'],
        ['s','А на балконе нашла ящик пива. Столыпин у нас как-то оставил и забыл. Бери с собой — для храбрости.'],
        ['m','И Михалыч передал: открывает лавку в своей будке. Патроны, аптечка, ремонт брони. Всё за рубли.'],['s','Рубли? Где их брать?'],
        ['m','По району столько всего валяется... И за каждый зачищенный квартал жильцы скидываются. Чем чище работа, тем больше.']],()=>{if(C1.onArmory)C1.onArmory();C1.done=true;S.fade=.01}));
    });
  }));
}
// ================= ПРОЛОГ: перехват концовки =================
TASK[10]='Вернуться к Шмакодявке и решить, что делать';TASK[11]='Выйти из квартиры';
const shIt=IT[0],shAct=shIt.act;
try{Object.defineProperty(shIt,'x',{configurable:true,get(){return S.step===11?shmak.x:136}});Object.defineProperty(shIt,'y',{configurable:true,get(){return S.step===11?shmak.y:54}})}catch(e){}
shIt.act=function(){if(S.step===10&&!C1.called){startCall();return}if(S.step===11){say([['s','Я готова. Пошли, зай!']]);return}shAct()};
const exitIt=IT.find(i=>{try{const l=i.label();return /Входная|Выйти/.test(l)}catch(e){return false}});
if(exitIt){const exAct=exitIt.act;exitIt.label=()=>S.step===11?'Выйти из квартиры':'Входная дверь';
  exitIt.act=function(){if(S.step===11){leaveFlat();return}if(S.step===10){say([['m','Сначала поговорю со Шмакодявкой. Надо решить, что делаем.']]);return}exAct()}}

// ================= ИНТЕРФЕЙС =================
// ---- телефон: большая кнопка ОГОНЬ/УДАР, направление — левым стиком ----
const FB={x:W-32,y:H-36,r:21};
BTN.r=13; // кнопка ДЕЙСТВ. поменьше
function fbVisible(){return touch.on&&C1.on&&state==='play'&&!cut&&!dlg&&!C1.over&&C1.mode==='td'&&L&&L.armed&&!pl.scoot}
function fbLabel(){return C1.noWpn?'УДАР':(WD[PS.wpn]&&WD[PS.wpn].ml)?'УДАР':'ОГОНЬ'}
function placeBtns(){ // в бою ДЕЙСТВ. уезжает левее, на её месте — ОГОНЬ
  if(fbVisible()){BTN.x=W-90;BTN.y=H-17;BTN.r=11}else{BTN.x=W-30;BTN.y=H-32;BTN.r=13}}
function aimAssist(){ // лёгкий доводчик: ближайший зомби в секторе ±30° перед героем
  let best=null,bd=1e9;for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const d=Math.hypot(z.x-pl.x,z.y-pl.y);if(d>170||d>=bd)continue;
    const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(Math.abs(angDiff(za,pl.a))>.52)continue;if(!los(pl.x,pl.y,z.x,z.y))continue;best=za;bd=d}
  if(best!==null)pl.a=best}
function fbDraw(){if(!fbVisible())return;const on=!!C1.fire,b=FB;
  // ДЕЙСТВ. в бою мельче: перерисовываем поверх с мелким шрифтом
  u.globalAlpha=near?.9:.35;u.fillStyle=near?'#ffd23a':'#ffffff';u.beginPath();u.arc(BTN.x,BTN.y,BTN.r,0,TAU);u.fill();u.fillStyle='#120a1c';uiFont(3.6,true);u.textAlign='center';u.fillText('ДЕЙСТВ.',BTN.x,BTN.y+1.3);u.textAlign='left';u.globalAlpha=1;
  u.globalAlpha=on?.8:.5+.12*Math.sin(tm*4);u.fillStyle=C1.noWpn||(WD[PS.wpn]&&WD[PS.wpn].ml)?'#ff8a30':'#ff3a4a';u.beginPath();u.arc(b.x,b.y,b.r*(on?.94:1),0,TAU);u.fill();
  u.globalAlpha=.9;u.strokeStyle='#fff';u.lineWidth=.8;u.beginPath();u.arc(b.x,b.y,b.r*(on?.94:1),0,TAU);u.stroke();
  u.fillStyle='#fff';uiFont(6,true);u.textAlign='center';u.fillText(fbLabel(),b.x,b.y+2);u.textAlign='left';u.globalAlpha=1}
// подсказка, пока игрок ни разу не нажал кнопку
function fireHint(){if(!fbVisible()||C1.hint<=0)return;const a=.6+.3*Math.sin(tm*4);u.globalAlpha=a;uiFont(4.8,true);u.textAlign='right';u.fillStyle='#fff';
  u.fillText('Левый стик — ходьба и прицел',W-58,H-58);u.fillText(fbLabel()+': тап — раз, зажми — очередь',W-58,H-50);u.textAlign='left';u.globalAlpha=1}
C1.hint=1;C1.fire=null;C1.fireQ=false;
const TB={w:{x:W-60,y:H-16,r:11,t:'ОРУЖ.'},h:{x:W-14,y:H-66,r:10,t:'ШПРИЦ'},f:{x:W-40,y:H-74,r:10,t:'МОЛОТ.'},m:{x:W-66,y:H-44,r:9,t:'ПЕРЕЗ.'},p:{x:W-14,y:H-90,r:9,t:'ЗЕЛЬЕ'},b:{x:W-36,y:H-98,r:9,t:'ПИВО'}};
function tbVisible(k){if(!C1.on||state!=='play'||cut||dlg||C1.over)return false;if(C1.mode==='ride')return k==='h';if(C1.mode!=='td'||!L||!L.armed)return false;if(C1.noWpn)return k==='h';if(k==='m')return !!(WD[PS.wpn]&&WD[PS.wpn].am);if(k==='p')return !!(C1.upg&&C1.upg()&&PS.pot>0);if(k==='b')return !!(C1.upg&&C1.upg()&&PS.beer>0);return true}
function hudBar(x,y,w,h,k,c,bg){u.fillStyle=bg||'rgba(0,0,0,.6)';u.fillRect(x,y,w,h);u.fillStyle=c;u.fillRect(x,y,w*clamp(k,0,1),h)}
function heart(x,y,on){u.fillStyle=on?'#ff3a5a':'rgba(255,255,255,.18)';u.fillRect(x,y,2,1);u.fillRect(x+3,y,2,1);u.fillRect(x,y+1,5,2);u.fillRect(x+1,y+3,3,1);u.fillRect(x+2,y+4,1,1)}
// 03.11: панели бледнеют, когда под ними игрок, зомби, предмет или прицел
const HFA={};
function hudFade(k,x,y,w,h){let hit=false;const m=5,inR=(px,py)=>px>x-m&&px<x+w+m&&py>y-m&&py<y+h+m;
  if(C1.mode==='td'&&L){if(inR(pl.x-camX,pl.y-camY))hit=true;
    if(!hit&&mouse.on&&!touch.on&&inR(mouse.x,mouse.y))hit=true;
    if(!hit)for(const z of L.zs){if(z.dead||z.st==='hidden')continue;if(inR(z.x-camX,z.y-camY)){hit=true;break}}
    if(!hit&&L.items)for(const it of L.items){if(it.taken)continue;if(inR(it.x-camX,it.y-camY)){hit=true;break}}}
  const t=hit?.2:1,a=HFA[k]==null?1:HFA[k];HFA[k]=a+(t-a)*.18;return HFA[k]}
C1.hudFade=hudFade;
// 03.11: компактная панель для ПК — HP и оружие сверху, запасы одной строкой внизу слева; на телефоне — как было
// иконка ствола в HUD (icons.js): дулом вправо, вписана в maxW×maxH; вернёт ширину
function hudGun(w,x,top,maxH,maxW){if(!window.ICONS||!ICONS.PIX[w])return 0;const iw=ICONS.width(w),ih=ICONS.height(w),s=Math.min(maxH/ih,maxW/iw);
  u.save();u.translate(x+iw*s,top+s*ICONS.fac(w));u.scale(-1,1);ICONS.draw(u,w,0,0,s);u.restore();return iw*s}
C1.hudGun=hudGun;
function hudStatsPC(){
  const ar=PS.arm&&C1.upg&&C1.upg(),up=C1.upg&&C1.upg();
  let t='',nm='',red=false,wk=null;
  if(C1.mode==='ride'){wk='pistol';nm='ПИСТОЛЕТ';t='∞  запас '+PS.ammo}
  else if(L&&L.armed){const w=PS.wpn,d=WD[w];wk=w;nm=d?d.n:'';
    if(d&&d.am){const m=w==='flamer'?Math.ceil(PS.mag[w]||0)+'%':String(PS.mag[w]||0),r=w==='flamer'?Math.ceil(PS.fuel||0):(PS[d.am]||0);t=m+'/'+r;red=(PS.mag[w]||0)<=0&&r<=0}}
  const hasI=wk&&window.ICONS&&ICONS.PIX[wk];
  const iT=ar?13.2:9.2,iH=9;
  let iw=0,tw=0;if(hasI)iw=Math.min(34,ICONS.width(wk)*Math.min(iH/ICONS.height(wk),34/ICONS.width(wk)));
  if(wk){uiFont(2.8,true);tw=u.measureText(nm).width;uiFont(4,true);tw=Math.max(tw,t?u.measureText(t).width:0)}
  const wy=ar?17.5:13.5;
  const pw=Math.max(C1.hard?66:86,wk?(hasI?8+iw+3+tw+4:tw+12):0),hh=wk?(hasI?iT+iH+2.5-4:wy+3.5):(ar?14:10);
  u.save();u.globalAlpha=hudFade('st',4,4,pw,hh);
  panel(4,4,pw,hh,.6);u.fillStyle='#ff4fa3';u.fillRect(4,4,1.5,hh);
  uiFont(3.4,true);u.fillStyle='#9a92b0';u.fillText('HP',8,9.4);hudBar(16,6.3,46,3,PS.hp/PS.max,PS.hp<35?'#ff3a3a':'#3ef0b0');
  if(PS.regen>0||PS.potT>0){u.fillStyle=PS.potT>0?'rgba(200,106,255,.55)':'rgba(106,255,154,.5)';u.fillRect(16+46*PS.hp/PS.max,6.3,Math.min(46*(1-PS.hp/PS.max),46*Math.max(PS.regen,PS.potT*1.6)/PS.max),3)}
  if(!C1.hard)for(let i=0;i<3;i++)heart(66+i*7,5.5,i<PS.lives);
  if(ar){const A=PS.arm,k=A.dur/A.max;uiFont(3.2,true);u.fillStyle='#9a92b0';u.fillText('БР',8,13.6);hudBar(16,11.4,46,2,k,A.dur<=0?'#5a5a62':k<.3?'#ff8a30':'#6ab8ff');uiFont(3,true);u.fillStyle=A.dur<=0?'#ff6a6a':'#cfe0ff';u.fillText(A.dur<=0?'СЛОМАНА':(A.lvl==='h'?'ХАНЖА':'УР.'+A.lvl)+' '+Math.ceil(A.dur),64,13.6)}
  if(wk&&hasI){const ih=ICONS.height(wk)*Math.min(iH/ICONS.height(wk),34/ICONS.width(wk));hudGun(wk,8,iT+(iH-ih)/2,iH,34);
    const tx=8+iw+3;uiFont(2.8,true);u.fillStyle='#9a92b0';u.fillText(nm,tx,iT+3.2);if(t){uiFont(4,true);u.fillStyle=red?'#ff6a6a':'#ffd23a';u.fillText(t,tx,iT+8.2)}
    if(PS.rl>0&&PS.rlw===wk){const k=1-PS.rl/(PS.rlT||1),bw=pw-8;u.fillStyle='rgba(0,0,0,.6)';u.fillRect(8,iT+iH+.4,bw,1.1);u.fillStyle='#ffd23a';u.fillRect(8,iT+iH+.4,bw*k,1.1)}}
  else if(wk){const tt=nm+(t?'  '+t:'');uiFont(4.2,true);u.fillStyle=red?'#ff6a6a':'#ffd23a';u.fillText(tt,8,wy);
    if(PS.rl>0&&PS.rlw===wk){const k=1-PS.rl/(PS.rlT||1);u.fillStyle='rgba(0,0,0,.6)';u.fillRect(8,wy+1.2,pw-12,1.2);u.fillStyle='#ffd23a';u.fillRect(8,wy+1.2,(pw-12)*k,1.2)}}
  if(C1.hudExtra)C1.hudExtra(hh);
  u.restore();C1.hudBot=4+hh;
  // запасы — внизу слева одной строкой
  const segs=[[L&&L.healName&&L.healName!=='Шприцы'?null:'syr',(L&&L.healName&&L.healName!=='Шприцы'?L.healName+' ':'')+PS.syr,'H']];if(up)segs.push(['pot',PS.pot||0,'J']);segs.push(['moon',PS.moon,'F']);if(up)segs.push(['beer',(PS.beer||0)+(PS.beerT>0?' ▲'+Math.ceil(PS.beerT):''),'B']);
  const UPI=window.UP&&UP.itI;uiFont(3.6,true);let lw=6;for(const g of segs){lw+=(g[0]&&UPI?6:0)+u.measureText(String(g[1])).width+u.measureText(' '+g[2]).width*.8+7}
  const ly=H-11;u.save();u.globalAlpha=hudFade('inv',4,ly,lw,8);panel(4,ly,lw,8,.55);let x=8;
  for(const g of segs){if(g[0]&&UPI){UPI(g[0],x,ly+1.2,5.6,null,7);x+=7}uiFont(3.6,true);u.fillStyle='#cfe8d0';u.fillText(String(g[1]),x,ly+5.6);x+=u.measureText(String(g[1])).width+1;uiFont(2.8,false);u.fillStyle='#8a82a0';u.fillText(g[2],x,ly+5.6);x+=u.measureText(g[2]).width+6}
  u.restore();
}
function hudStats(){
  if(!touch.on)return hudStatsPC();C1.hudBot=0;
  const ar=PS.arm&&C1.upg&&C1.upg(),hh=ar?44:38;u.save();u.globalAlpha=hudFade('st',4,4,130,hh);
  panel(4,4,130,hh,.72);u.fillStyle='#ff4fa3';u.fillRect(4,4,2,hh);
  uiFont(4,true);u.fillStyle='#9a92b0';u.fillText('HP',9,10.5);hudBar(20,6.5,64,4,PS.hp/PS.max,PS.hp<35?'#ff3a3a':'#3ef0b0');if(PS.regen>0||PS.potT>0){u.fillStyle=PS.potT>0?'rgba(200,106,255,.55)':'rgba(106,255,154,.5)';u.fillRect(20+64*PS.hp/PS.max,6.5,Math.min(64*(1-PS.hp/PS.max),64*Math.max(PS.regen,PS.potT*1.6)/PS.max),4)}
  if(!C1.hard)for(let i=0;i<3;i++)heart(89+i*7,6,i<PS.lives);
  let y=19;
  if(ar){const A=PS.arm,k=A.dur/A.max;uiFont(3.6,true);u.fillStyle='#9a92b0';u.fillText('БР',9,14.6);hudBar(20,12.4,64,2.4,k,A.dur<=0?'#5a5a62':k<.3?'#ff8a30':'#6ab8ff');uiFont(3.4,true);u.fillStyle=A.dur<=0?'#ff6a6a':'#cfe0ff';u.fillText(A.dur<=0?'СЛОМАНА':(A.lvl==='h'?'ХАНЖА':'УР.'+A.lvl)+' '+Math.ceil(A.dur),88,14.8);y=24}
  uiFont(5,true);u.fillStyle='#fff';
  if(C1.mode==='ride'){u.fillText('ПИСТОЛЕТ  ∞   в запас: '+PS.ammo,9,y);}
  else if(L&&L.armed){const w=PS.wpn,d=WD[w];let t=d?d.n:'';let red=false;
    if(d&&d.am){const m=w==='flamer'?Math.ceil(PS.mag[w]||0)+'%':String(PS.mag[w]||0),r=w==='flamer'?Math.ceil(PS.fuel||0):(PS[d.am]||0);t+='  '+m+' / '+r;red=(PS.mag[w]||0)<=0&&r<=0}
    let tx=9;if(window.ICONS&&ICONS.PIX[w]){const iw=hudGun(w,9,y-6.2,7,26);if(iw){tx=9+iw+3;uiFont(4,true)}}
    u.fillStyle=red?'#ff6a6a':'#ffd23a';u.fillText(t,tx,y);
    if(PS.rl>0&&PS.rlw===w){const k=1-PS.rl/(PS.rlT||1);u.fillStyle='rgba(0,0,0,.6)';u.fillRect(9,y+1.5,60,1.6);u.fillStyle='#ffd23a';u.fillRect(9,y+1.5,60*k,1.6);uiFont(3.6,true);u.fillStyle='#ffd23a';u.fillText('ПЕРЕЗАРЯДКА',72,y+3.2)}}
  uiFont(4.2,false);u.fillStyle='#cfe8d0';const hk=k=>touch.on?'':' ['+k+']';
  let l1=((L&&L.healName)||'Шприцы')+': '+PS.syr+hk('H');if(C1.upg&&C1.upg())l1+='   Зелья: '+(PS.pot||0)+hk('J');u.fillText(l1,9,y+8.5);
  let l2='Самогон: '+PS.moon+hk('F');if(C1.upg&&C1.upg())l2+='   Пиво: '+(PS.beer||0)+hk('B')+(PS.beerT>0?' ▲'+Math.ceil(PS.beerT):'');u.fillText(l2,9,y+15);
  if(C1.hudExtra)C1.hudExtra(hh);
  u.restore();
}
function hudObj(lines){
  if(!lines||!lines.length)return;const fs=touch.on?4.6:4,lh=touch.on?7:5.6;uiFont(fs,true);let w=0;for(const l of lines)w=Math.max(w,u.measureText(l).width);
  const x=W-w-14,h=(touch.on?8:6.5)+lines.length*lh;u.save();u.globalAlpha=hudFade('ob',x,4,w+10,h);panel(x,4,w+10,h,.72);u.fillStyle='#3ef0b0';u.fillRect(x+w+8,4,2,h);
  u.fillStyle='#9a92b0';uiFont(touch.on?3.6:3,true);u.fillText('ЗАДАЧИ',x+4,touch.on?9.5:8.6);uiFont(fs,true);
  lines.forEach((l,i)=>{u.fillStyle=/✓/.test(l)?'#7affb0':'#fff';u.fillText(l,x+4,(touch.on?16:14.2)+i*lh)});
  u.restore();
}
function c1UI(){
  const k=ui.width/W;u.setTransform(1,0,0,1,0,0);u.clearRect(0,0,ui.width,ui.height);u.setTransform(k,0,0,k,0,0);
  if(C1.mode==='td'&&L){
    if((L.armed||L.id!=='fort')&&!L.noHud)hudStats();
    if(!dlg&&!tr)hudObj(L.obj());
    hudScore();legUI();
    // босс
    const b=L.zs.find(z=>z.type==='boss'&&z.st!=='hidden');
    if(b&&!dlg){uiFont(4.6,true);u.textAlign='center';u.fillStyle='#ff6a6a';u.fillText(b.nm||L.bossName||'ГРОМИЛА-СИСАДМИН',W/2,H-24);u.textAlign='left';hudBar(W/2-60,H-21,120,4,b.hp/b.max,'#c0202a')}
    // стрелки к последним зомби
    if(L.id==='off1'||L.id==='park'||L.arrows||L.armed){const left=L.zs.filter(z=>!z.dead&&!z.ally);if(left.length&&left.length<=10&&!dlg)for(const z of left){const sx=z.x-camX,sy=z.y-camY;if(sx>0&&sx<W&&sy>0&&sy<H)continue;const a=Math.atan2(sy-H/2,sx-W/2),ex=W/2+Math.cos(a)*(W/2-14),ey=H/2+Math.sin(a)*(H/2-14);
      u.save();u.translate(clamp(ex,10,W-10),clamp(ey,10,H-10));u.rotate(a);u.fillStyle='rgba(255,60,60,.8)';u.beginPath();u.moveTo(5,0);u.lineTo(-3,-3);u.lineTo(-3,3);u.fill();u.restore()}}
    // подсказка
    const nr=C1.near;if(nr&&!dlg){const sx=nr.x-camX,sy=nr.y-camY-14;uiFont(5,true);const t=(touch.on?'':'E  ')+nr.label();const w=u.measureText(t).width+8;const x=clamp(sx-w/2,2,W-w-2),y=clamp(sy-7,36,H-12);
      panel(x,y,w,9,.85);u.strokeStyle='#ffd23a';u.lineWidth=.4;u.strokeRect(x,y,w,9);u.fillStyle='#ffd23a';u.fillText(t,x+4,y+6.4)}
    for(const t of L.texts){u.globalAlpha=Math.min(1,t.life*2);uiFont(4.6,true);u.textAlign='center';u.fillStyle=t.c;u.fillText(t.t,t.x-camX,t.y-camY-8);u.textAlign='left';u.globalAlpha=1}
    if(mouse.on&&!touch.on&&L.armed&&!dlg&&!pl.scoot){const x=mouse.x,y=mouse.y;u.strokeStyle='#ffd23a';u.lineWidth=.6;u.beginPath();u.arc(x,y,3,0,TAU);u.moveTo(x-6,y);u.lineTo(x-4,y);u.moveTo(x+4,y);u.lineTo(x+6,y);u.moveTo(x,y-6);u.lineTo(x,y-4);u.moveTo(x,y+4);u.lineTo(x,y+6);u.stroke()}
  }
  if(C1.mode==='ride'&&RD){
    hudStats();const R=RD,loc=LOCS[R.loc];
    for(const s of R.signs){if(!s[3])continue;uiFont(3.6,true);u.textAlign='center';u.fillStyle='#fff6e0';u.fillText(s[2],s[0],s[1]);u.textAlign='left'}
    panel(W-110,4,106,20,.72);uiFont(4.4,true);u.fillStyle='#9a92b0';u.fillText('ЛОКАЦИЯ '+(R.loc+1)+'/3: '+loc.name,W-106,10.5);hudBar(W-106,14,98,3,R.x/loc.len,'#ffd23a');
    uiFont(4,false);u.fillStyle='#ffe27a';u.fillText('Патроны на офис: +'+PS.rideGain,W-106,22);
    for(const t of R.texts){u.globalAlpha=Math.min(1,t.life*2);uiFont(4.6,true);u.textAlign='center';u.fillStyle='#ffe27a';u.fillText(t.t,t.x,t.y);u.textAlign='left';u.globalAlpha=1}
    if(R.banner>0&&!dlg){u.globalAlpha=Math.min(1,R.banner);panel(0,H/2-24,W,34,.6);u.textAlign='center';uiFont(11,true);u.fillStyle='#ffd23a';u.fillText(loc.name,W/2,H/2-6);uiFont(5.5,false);u.fillStyle='#fff';u.fillText(loc.sub,W/2,H/2+4);
      if(R.loc===0){uiFont(4.4,false);u.fillStyle='#9a92b0';u.fillText(touch.on?'Левый стик — руль, правый — целься и стреляй':'WASD — руль и скорость, мышь — целься, ЛКМ — стрелять',W/2,H/2+12)}u.textAlign='left';u.globalAlpha=1}
    if(mouse.on&&!touch.on&&!dlg){const x=mouse.x,y=mouse.y;u.strokeStyle='#ffd23a';u.lineWidth=.6;u.beginPath();u.arc(x,y,3,0,TAU);u.stroke()}
  }
  if(toast){u.globalAlpha=Math.min(1,toast.life*2);uiFont(5.5,true);const w=u.measureText(toast.t).width+12;panel(W/2-w/2,H-42,w,11,.85);u.fillStyle='#fff';u.textAlign='center';u.fillText(toast.t,W/2,H-34.6);u.textAlign='left';u.globalAlpha=1}
  renderDlg();
  // сенсорные кнопки
  if(touch.on&&state==='play'){
    near=C1.near&&!dlg&&!cut?C1.near:null; // кнопка ДЕЙСТВ. загорается, когда рядом есть с чем взаимодействовать
    placeBtns();{const r=BTN.r;if(fbVisible()){BTN.r=0.01;BTN.x=-99}touchUI();if(fbVisible()){BTN.r=r;BTN.x=W-90}}fbDraw();
    fireHint();
    for(const k in TB){if(!tbVisible(k))continue;const b=TB[k];u.globalAlpha=.45;u.fillStyle=k==='h'?'#3aff7a':k==='f'?'#ff8a30':k==='p'?'#c86aff':k==='b'?'#ffd23a':'#ffffff';u.beginPath();u.arc(b.x,b.y,b.r,0,TAU);u.fill();u.globalAlpha=.9;u.fillStyle='#120a1c';uiFont(3.6,true);u.textAlign='center';u.fillText(b.t,b.x,b.y+1.3);u.textAlign='left';u.globalAlpha=1}
    if(C1.xbtn)for(const b of C1.xbtn){if(!b.vis())continue;u.globalAlpha=b.on&&b.on()?.8:.45;u.fillStyle=b.col||'#fff';u.beginPath();u.arc(b.x,b.y,b.r,0,TAU);u.fill();u.globalAlpha=.9;u.fillStyle='#120a1c';uiFont(3.4,true);u.textAlign='center';u.fillText(b.t,b.x,b.y+1.3);u.textAlign='left';u.globalAlpha=1}
  }
  colViewDraw();
  if(C1.over)deathOv();
}
function deathOv(){if(!C1.over)return;const a=Math.min(1,C1.over.t);panel(0,0,W,H,.85*a);u.globalAlpha=a;u.textAlign='center';uiFont(16,true);u.fillStyle='#ff2a4a';u.fillText('ТЕБЯ СОЖРАЛИ',W/2,H/2-10);
    uiFont(6,false);u.fillStyle='#fff';u.fillText(touch.on?'Коснись, чтобы попробовать снова':'E или клик — попробовать снова',W/2,H/2+8);uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText((C1.hard?'Контрольная точка — начало этого участка. Пройденные участки остаются за тобой':'Начнёшь с начала этого участка, с теми же патронами'),W/2,H/2+18);u.textAlign='left';u.globalAlpha=1}
C1.deathOv=deathOv;
function tdRenderAll(){if(C1.mode==='ride')rideRender();else tdRender();trFade();c1UI()}

// ================= МЕНЮ ВЫБОРА УЧАСТКА =================
const MENU=[['Глава 1 с начала (разговор и звонок Аниса)','call'],['Двор-крепость','fort'],['Самокат: панельки','ride0'],['Самокат: мост','ride1'],['Самокат: Петроградка','ride2'],['Парковка у офисов','park'],['Офис 1 (тёмный)','off1'],['Офис 2 и босс','off2'],['Дорога домой и финал','home']];



// ================= СЕКРЕТНЫЕ КОМНАТЫ =================
// вход: enterSecret(build) — текущий уровень сохраняется целиком, выход возвращает в то же место
function enterSecret(build){const prev={L,x:pl.x,y:pl.y,a:pl.a};go(()=>{build(prev);sfx('click')})}
function leaveSecret(prev){go(()=>{L=prev.L;C1.L=L;pl.x=prev.x;pl.y=prev.y;pl.a=prev.a+Math.PI;if(L.ally){L.ally.x=pl.x-8;L.ally.y=pl.y+6}C1.cx=clamp(pl.x-W/2,0,Math.max(0,L.w-W));C1.cy=clamp(pl.y-H/2,0,Math.max(0,L.h-H));L.navT=0})}
function secRoom(prev,id,w,h,floor){mkLevel(id,w,h);B(0,0,w,h,'#16131c');paint(8,8,w-8,h-8,floor);drawWalls();L.secret=true;L.noGrade=true;L.ally=null;L.dark=.35;L.tint='6,4,12';
  pl.x=w/2;pl.y=h-18;pl.a=-Math.PI/2;C1.cx=Math.max(0,(w-W)/2)*0+(w<=W?(w-W)/2:0);C1.cy=h<=H?(h-H)/2:0;
  L.its=[{x:w/2,y:h-10,r:14,label:()=>'Выйти',act:()=>leaveSecret(prev)}];buildNav()}
function secretOff1(prev){
  secRoom(prev,'sec1',220,150,'server');
  for(let x=16;x<204;x+=16){B(x,12,12,16,'#1a1c22');for(let i=0;i<6;i++)B(x+1,14+i*2,10,1,(i+x)%3?'#2a8a4a':'#3ad8ff')}gfill(12,8,208,28,1);
  lowBox(30,70,40,14,'#5a5a62');B(36,72,8,6,'#141418');B(50,72,14,4,'#3ad8ff');lowBox(150,64,50,30,'#6a3a4a','#8a5a6a');
  B(80,40,60,24,'#e8e8ec');B(82,42,56,20,'#f4f4f6');for(let i=0;i<5;i++)B(86+i*10,46+(i%2)*6,8,2,['#2a6ad8','#d82a2a','#2aa84a'][i%3]);B(96,56,30,1,'#2a2a2a');
  lowBox(92,90,40,12,'#3a3a40');L.glow.push([110,92,30,'rgba(120,230,255,A)',.5,3]);
  addItem('cells',140,108,6);addItem('syr',40,110);addItem('ammo',180,110,12);
  L.lights.push([110,90,70,.9]);
  L.its.push({x:112,y:96,r:16,label:()=>'Взять рельсотрон',cond:()=>!(PS.own&&PS.own.rail),act:()=>{PS.cells+=6;giveWpn('rail',true);const br=C1.railBroken&&C1.railBroken();if(!br)setWpn('rail');sfx('power');C1.shake=.4;
    say(br?[['m','Это что... рельсотрон? Из блоков питания серверов?!'],['a','Наши админы по ночам тут явно не бэкапы делали.'],['m','*щёлк* ...Не стреляет. Катушка выгорела.'],['a','Забирай. Электроника для такой штуки — только в ДНС. Почини на верстаке, и прошьёт всё на линии.']]:[['m','Это что... рельсотрон? Из блоков питания серверов?!'],['a','Наши админы по ночам тут явно не бэкапы делали.'],['a','Прошивает всё на линии, пока не упрётся в стену. Три заряда в обойме, потом перезарядка. Цифра 3.']])}});
  say([['m','Тайная серверная. Диван, доска, гирлянда...'],['a','Так вот где они «чинили сеть» по выходным.']]);
}
function secretOff2(prev){
  secRoom(prev,'sec2',220,150,'wood');
  for(let x=20;x<200;x+=30){B(x,10,16,10,'#5a3a20');B(x+4,8,8,4,'#d8c8a0');B(x+2,6,2,3,'#c8b890');B(x+12,6,2,3,'#c8b890')}gfill(12,8,208,22,1);
  lowBox(20,40,30,50,'#8a6a3a','#a88a5a');for(let y=44;y<88;y+=8)B(24,y,22,4,'#cfe8d0');
  B(150,40,40,40,'#6a6e76');B(158,48,24,24,'#9a9ea6');B(166,30,8,12,'#8a8e96');B(186,56,16,4,'#8a8e96');gfill(150,40,190,80,2);L.glow.push([170,60,26,'rgba(255,140,40,A)',.35,5]);
  lowBox(90,96,40,12,'#4a3020','#6a5040');L.glow.push([110,98,28,'rgba(255,150,60,A)',.45,4]);
  addItem('shells',180,110,12);addItem('syr',30,110);addItem('pot',60,110);
  L.lights.push([110,90,70,.9]);
  L.its.push({x:110,y:104,r:16,label:()=>'Заначка Аниса',cond:()=>!PS.anisCash,act:()=>{PS.anisCash=true;PS.moon+=2;if(C1.addRub)C1.addRub(1500,110,96);sfx('pick');
    say([['m','Конверт под самогонным аппаратом. «На чёрный день». Полторы тысячи рублей.'],['m','И две бутылки самогона. Анис, ты был готов ко всему.'],['m','Чёрный день настал. Пригодится у Михалыча.']])}});
  say([['m','Тайник Аниса. Трофеи, самогонный аппарат...'],['m','Так вот куда он «уезжал на совещания».']]);
}
C1.enterSecret=enterSecret;C1.leaveSecret=leaveSecret;C1.secRoom=secRoom;

// ================= ОЧКИ, КОМБО И ОЦЕНКА УРОВНЯ (как в HM) =================
const ZPTS={gunner:250,raider:300,armor:350,spitter:200,normal:100,fast:150,thrower:150,crawler:120,bloat:200,shield:300,screamer:250,brute:500,boss:1500};
const STYLE={boom:['ЦЕПНАЯ РЕАКЦИЯ',150],fire:['ПОДЖИГАТЕЛЬ',100],melee:['БЛИЖНИЙ БОЙ',50],nail:['ТИХУШНИК',50],slug:['НАВЫЛЕТ',80]};
let GRADES={};try{GRADES=JSON.parse(localStorage.getItem('grades')||'{}')}catch(e){}
C1.GRADES=GRADES;
function scoreKill(z){const S=L&&L.score;if(!S||S.done||C1.mode!=='td')return;
  const base=ZPTS[z.type]||100;S.kills++;
  if(C1._src==='ally'){const pts=Math.round(base*.5);S.pts+=pts;floatT(z.x,z.y-6,'+'+pts,'#9a92b0');return}
  S.cb=S.cbT>0?S.cb+1:1;S.cbT=2.6;S.maxCb=Math.max(S.maxCb,S.cb);if(S.cb>=10)unlockLeg('flame');
  let st=null;if(C1._src==='boom')st='boom';else if(z.burn>0)st='fire';else if(WD[PS.wpn]&&WD[PS.wpn].ml)st='melee';else if(PS.wpn==='awp'||PS.wpn==='deagle')st='slug';
  const w=C1._src==='boom'?'boom':z.burn>0?'fire':PS.wpn;S.wp[w]=1;
  let pts=base*Math.min(S.cb,15);if(st){pts+=STYLE[st][1];S.style[st]=(S.style[st]||0)+1}
  S.pts+=pts;floatT(z.x,z.y-6,'+'+pts+(S.cb>1?'  x'+S.cb:''),C1.comboCol?C1.comboCol(S.cb):S.cb>=4?'#ff4fa3':S.cb>1?'#ffd23a':'#ffffff');
}
function scoreTick(dt){const S=L.score;if(!S||S.done)return;S.t+=dt;if(S.cbT>0){S.cbT-=dt;if(S.cbT<=0)S.cb=0}
  if(S.kills>0&&!L.noGrade&&!L.zs.some(z=>!z.dead))scoreFinish()}
function scoreFinish(){const S=L.score;if(!S||S.done||!S.kills)return;S.done=true;
  const nw=Object.keys(S.wp).length,bon={variety:nw>=3?nw*400:0,clean:S.hits===0?2000:S.hits<=3?800:0,time:Math.max(0,Math.round((S.kills*9-S.t)*20))};
  const total=S.pts+bon.variety+bon.clean+bon.time,r=total/Math.max(1,S.par+2000);
  const g=r>=1?'S':r>=.75?'A':r>=.5?'B':r>=.3?'C':'D';
  const gid=L.gradeId||L.id,best=GRADES[gid];const rec=!best||total>best.s;if(rec){GRADES[gid]={s:total,g};try{localStorage.setItem('grades',JSON.stringify(GRADES))}catch(e){}}
  if(g==='S')setTimeout(()=>unlockLeg('angel'),1500);
  C1.res={id:gid,total,g,rec,best:rec?null:best,b:bon,S:Object.assign({},S),t0:tm};sfx(g==='S'||g==='A'?'ring':'pick')}
C1.scoreFinish=()=>scoreFinish();
const LNAME={park2:'ПАРКОВКА · ОХРАНА',park:'ПАРКОВКА',off1:'ОФИС 1',off2:'ОФИС 2',drive:'ДОРОГА',gym:'ФИТНЕС-ЗАЛ',mall2:'ТЦ «СИТИ МОЛЛ»',yard2:'ДВОР',cellar:'ПОДВАЛ',tunnels:'КАТАКОМБЫ',lair:'ЛОГОВО',yard4:'ДВОР',flatb:'КВАРТИРА БАТИ',roof:'КРЫША',nevsky:'ЦЕНТР',club:'КЛУБ «НОРА»'};C1.LNAME=LNAME;
function fmtN(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')}
function hudScore(){const S=L&&L.score;if(!S||!L.armed||L.noHud)return;
  if(S.pts>0||S.cb>0){u.textAlign='center';uiFont(6,true);u.fillStyle='#fff';u.fillText(fmtN(S.pts),W/2,11);
    if(S.cb>1){uiFont(5,true);const cc=(C1.comboCol?C1.comboCol(S.cb):S.cb>=4?'#ff4fa3':'#ffd23a');u.fillStyle=cc;u.fillText('КОМБО x'+S.cb,W/2,19);u.fillStyle='rgba(255,255,255,.2)';u.fillRect(W/2-20,21,40,1.5);u.fillStyle=cc;u.fillRect(W/2-20,21,40*S.cbT/2.6,1.5)}
    u.textAlign='left'}
  const R=C1.res;if(R){const k=tm-R.t0;if(k>3.2){C1.res=null;return}const a=Math.min(1,k*3,(3.2-k)*2.5);u.globalAlpha=a;
    const x=W/2-62,y=40;panel(x,y,124,R.rub?80:72,.9);u.fillStyle='#ff4fa3';u.fillRect(x,y,124,1.5);u.textAlign='center';
    uiFont(4.6,true);u.fillStyle='#9a92b0';u.fillText((LNAME[R.id]||R.id.toUpperCase())+' · ЗАЧИЩЕНО',W/2,y+8);
    const gc={S:'#ff4fa3',A:'#ffd23a',B:'#3ef0b0',C:'#8ab4ff',D:'#9a92b0'}[R.g];uiFont(26,true);u.fillStyle='#120a1c';u.fillText(R.g,W/2+30+1.5,y+38+1.5);u.fillStyle=gc;u.fillText(R.g,W/2+30,y+38);
    u.textAlign='left';uiFont(4.2,false);u.fillStyle='#e8e4f0';const L2=[['Убийства',fmtN(R.S.pts)],['Макс. комбо','x'+R.S.maxCb],['Разнообразие оружия','+'+fmtN(R.b.variety)],['Без царапин','+'+fmtN(R.b.clean)],['Скорость','+'+fmtN(R.b.time)]];
    L2.forEach((l,i)=>{u.fillText(l[0],x+5,y+16+i*6);u.fillStyle='#ffd23a';u.fillText(l[1],x+50,y+16+i*6);u.fillStyle='#e8e4f0'});
    const sty=Object.entries(R.S.style).map(([k,v])=>STYLE[k][0]+' ×'+v).join(' · ');if(sty){uiFont(3.6,true);u.fillStyle='#3ef0b0';u.fillText(sty,x+5,y+50)}
    uiFont(5.4,true);u.fillStyle='#fff';u.fillText('ИТОГ  '+fmtN(R.total),x+5,y+60);uiFont(4,true);u.fillStyle=R.rec?'#ff4fa3':'#9a92b0';u.fillText(R.rec?'НОВЫЙ РЕКОРД!':'Рекорд: '+fmtN(R.best.s)+' ('+R.best.g+')',x+5,y+67);
    if(R.rub){uiFont(5,true);u.fillStyle='#5ae87a';u.fillText('НАГРАДА  +'+fmtN(R.rub)+' ₽',x+5,y+75);uiFont(3.4,false);u.fillStyle='#9a92b0';u.textAlign='right';u.fillText(R.rubWhy||'',x+120,y+75);u.textAlign='left'}
    u.globalAlpha=1}
}

// ================= КОЛЛЕКЦИОНКИ И ГАЛЕРЕЯ =================
// Главы 2/3: C1.addCol(id,{t,d,where,draw(g)}) и C1.colItem(id,x,y) — предмет появится на уровне, если ещё не найден.
const COLS=[],COLSET=new Set();try{for(const id of JSON.parse(localStorage.getItem('cols')||'[]'))COLSET.add(id)}catch(e){}
function addCol(id,o){if(COLS.some(c=>c.id===id))return;const c=Object.assign({id},o);c.icon=mk(32);c.draw(c.icon.getContext('2d'));COLS.push(c)}
function colItem(id,x,y){if(COLSET.has(id))return;const free=(x,y)=>[[-5,-5],[5,-5],[-5,5],[5,5],[0,0]].every(([a,b])=>!gAt(x+a,y+b));
  if(!free(x,y)){let ok=false;for(let r=4;r<90&&!ok;r+=4)for(let a=0;a<16;a++){const xx=Math.round(x+Math.cos(a/16*TAU)*r),yy=Math.round(y+Math.sin(a/16*TAU)*r);if(free(xx,yy)){x=xx;y=yy;ok=true;break}}}
  addItem('col',x,y,id)}
function colFound(id){if(COLSET.has(id))return;COLSET.add(id);try{localStorage.setItem('cols',JSON.stringify([...COLSET]))}catch(e){}if(COLS.every(c=>COLSET.has(c.id)))unlockLeg('protein')}
// Находка открывается окном и ставит игру на паузу; тайники — в мебели/багажниках, подсвечены искоркой, берутся взаимодействием
function colReveal(id,x,y){const first=!COLSET.has(id);colFound(id);sfx('ring');if(x!=null)floatT(x,y,'НАХОДКА!','#3ef0b0');C1.lastCol=id;C1.fire=null;C1.fireQ=false;C1.mdown=false;
  const c=COLS.find(c=>c.id===id);if(c)C1.colView={c,t:0,n:[...COLSET].filter(i=>COLS.some(k=>k.id===i)).length}}
function stashCol(id,x,y,where){if(COLSET.has(id)||!L)return;const st={id,x,y,where:where||'тайник',done:false,ph:Math.random()*6};(L.stash||(L.stash=[])).push(st);
  L.its.push({x,y,r:19,label:()=>'Обыскать: '+st.where,cond:()=>!st.done&&!COLSET.has(id),act:()=>{st.done=true;sfx('click');colReveal(id,x,y-6)}})}
function drawGlint(st){const k=(tm*1.3+st.ph)%3.2;if(k>.9)return;const a=Math.sin(k/.9*Math.PI),x=Math.round(st.x),y=Math.round(st.y)-3;
  ctx.globalAlpha=a*.9;ctx.fillStyle='#fff6c0';ctx.fillRect(x,y-3,1,7);ctx.fillRect(x-3,y,7,1);ctx.globalAlpha=a*.35;ctx.fillStyle='#3ef0b0';ctx.fillRect(x-1,y-1,3,3);ctx.globalAlpha=1}
function colViewDraw(){const v=C1.colView;if(!v)return;const k=Math.min(1,v.t*4);u.globalAlpha=k;galView(v.c,v.t>.5?(touch.on?'Коснись, чтобы продолжить':'E, клик или Esc — продолжить'):' ');
  uiFont(5,true);u.textAlign='right';u.fillStyle='#3ef0b0';u.fillText('НАХОДКА '+v.n+'/'+COLS.length+'  · пауза',W-10,14);u.textAlign='left';u.globalAlpha=1}
function colViewClose(){if(C1.colView&&C1.colView.t>.5){C1.colView=null;sfx('click');return true}return !!C1.colView}
// где спрятаны находки: id уровня → [id, x, y, где]
const STASH={
  fort:[['turret',28,162,'бардачок машины']],
  park:[['neva',42,182,'багажник синей машины'],['mouse',574,318,'мусорный бак'],['ph3',432,282,'багажник красной машины']],
  off1:[['mug',446,100,'ящик стола'],['hunt',42,40,'стол у окна'],['sticker',446,300,'ящик стола'],['ph5',212,32,'шкаф с документами']],
  off2:[['smelt',168,242,'холодильник'],['pass',416,252,'ящик стола'],['laser',822,160,'стол Аниса'],['ph8',720,268,'тумбочка']],
  mall1:[['ph2',150,110,'аптечный прилавок'],['ph9',674,346,'вешалка с одеждой']],
  apple:[['ph6',692,26,'полка с косметикой']],
  gym:[['ph4',618,100,'шкафчик в раздевалке']],
  cellar:[['ph1',162,318,'ящик в кладовке'],['ph7',560,30,'полка с банками']],
  tunnels:[['ph10',290,428,'груда хлама']],
  nevsky:[['ph11',700,70,'киоск у кафе']],club:[['ph18',62,250,'край барной стойки']],flatb:[['ph15',585,332,'стол с компьютером']],
  beach5:[['ph17',472,151,'шезлонг']],alley5:[['ph12',395,92,'прилавок рынка']],villa5:[['ph14',545,285,'летний домик']],
  forest6:[['ph13',620,80,'пень на поляне']],street6:[['ph19',75,112,'калитка коттеджа']],
  top7:[['ph20',130,172,'столик у бара']],cellar7:[['ph16',310,150,'бар «Споры»']],sands8:[['ph21',416,400,'ящик в переулке']]};
function stashHook(){if(!L||L._st)return;L._st=1;for(const [id,x,y,w] of (STASH[L.id]||[]))stashCol(id,x,y,w)}
C1.STASH=STASH;C1.stashCol=stashCol;C1.colReveal=colReveal;
C1.addCol=addCol;C1.colItem=colItem;C1.COLS=COLS;C1.COLSET=COLSET;
const SKM='#e8b898',HRM='#3d2b20';
function frame(g,bg){P(g,2,2,28,28,'#f4f0e6');P(g,4,4,24,19,bg)}
addCol('turret',{t:'Шеврон крепости',d:'Ханжа нашила такие всем защитникам двора. Теперь ты свой.',where:'Глава 1 · двор-крепость',draw:g=>{P(g,6,5,20,22,'#3a4a2a');P(g,7,6,18,20,'#4e6a3a');P(g,10,9,12,3,'#c8a040');P(g,14,12,4,8,'#c8a040');P(g,11,20,10,2,'#c8a040');P(g,6,5,20,1,'#8aa060');P(g,8,24,16,2,'#2a3a1a')}});
addCol('neva',{t:'Фото: мы на Неве',d:'Микроб и Шмакодявка на набережной. Белые ночи, никаких зомби.',where:'Глава 1 · парковка',draw:g=>{frame(g,'#e8a0b0');P(g,4,14,24,9,'#3a5a8a');P(g,4,13,24,1,'#f8d0a0');P(g,9,8,4,4,HRM);P(g,10,10,2,2,SKM);P(g,9,12,4,6,'#8f9298');P(g,10,10,1,1,'#ffd23a');P(g,17,8,4,6,'#1a1418');P(g,18,10,2,2,SKM);P(g,17,13,4,6,'#ff5a9a');P(g,22,6,3,2,'#ffd23a')}});
addCol('mouse',{t:'Мышь на верёвочке',d:'Любимая игрушка Черсика. Как она попала на парковку, загадка.',where:'Глава 1 · парковка',draw:g=>{P(g,6,18,12,7,'#8a8a92');P(g,7,17,10,1,'#a8a8b0');P(g,16,16,4,4,'#8a8a92');P(g,18,15,2,2,'#ff9ab0');P(g,17,19,1,1,'#111');P(g,4,21,3,1,'#c88aa0');for(let i=0;i<8;i++)P(g,20+i,14-i,1,1,'#d8c8a0');P(g,27,5,3,3,'#ff2a7a')}});
addCol('mug',{t:'Кружка «Лучший сисадмин»',d:'Подарок от отдела на день сисадмина. Теперь звучит немного жутко.',where:'Глава 1 · офис 1',draw:g=>{P(g,8,8,14,18,'#f0f0f0');P(g,8,8,14,2,'#d8d8d8');P(g,22,12,4,8,'#f0f0f0');P(g,23,14,2,4,'#3a3a40');P(g,10,13,10,2,'#2a6ad8');P(g,10,17,10,1,'#2a6ad8');P(g,10,20,7,1,'#2a6ad8');P(g,9,9,12,2,'#5a3a20');P(g,13,24,3,2,'#8a1a22')}});
addCol('hunt',{t:'Фото Аниса с охоты',d:'Анис с ружьём и трофейным селезнем. Подпись: «Сезон открыт!»',where:'Глава 1 · офис 1',draw:g=>{frame(g,'#7a9a6a');P(g,4,18,24,5,'#4a6a3a');P(g,12,8,6,5,'#241a15');P(g,13,10,4,3,'#e2ad8c');P(g,11,13,8,8,'#4e4e32');P(g,6,14,14,1,'#26262a');P(g,20,14,5,4,'#3a6a3a');P(g,23,13,2,2,'#2a8a5a');P(g,24,17,2,3,'#c8a040')}});
addCol('sticker',{t:'Стикер «Ненавижу понедельники»',d:'Висел на мониторе. Апокалипсис, кстати, начался в понедельник.',where:'Глава 1 · офис 1',draw:g=>{P(g,6,6,20,20,'#ffe050');P(g,6,6,20,2,'#f0c830');P(g,22,22,4,4,'#d8b020');P(g,10,11,3,3,'#111');P(g,19,11,3,3,'#111');P(g,11,19,10,2,'#111');P(g,10,18,2,1,'#111');P(g,20,18,2,1,'#111')}});
addCol('smelt',{t:'Корюшка',d:'Пакет свежей корюшки из офисного холодильника. Пахнет огурцом и Питером.',where:'Глава 1 · офис 2',draw:g=>{P(g,5,8,22,18,'rgba(220,235,245,.5)');for(let i=0;i<3;i++){const y=11+i*5;P(g,8,y,14,3,'#a8b8c0');P(g,9,y,12,1,'#d8e4ea');P(g,22,y-1,3,5,'#8a9aa0');P(g,9,y+1,1,1,'#111')}P(g,5,7,22,2,'#c8d8e0')}});
addCol('pass',{t:'Пропуск Микроба',d:'Фото на пропуске ужасное. Как у всех. Больше он не понадобится.',where:'Глава 1 · офис 2',draw:g=>{P(g,4,8,24,17,'#f0f0f4');P(g,4,8,24,4,'#2a6ad8');P(g,7,14,8,9,'#c8d0dc');P(g,8,15,6,3,HRM);P(g,9,17,4,3,SKM);P(g,9,18,1,1,'#ffd23a');P(g,12,18,1,1,'#ffd23a');P(g,8,20,6,3,'#8f9298');P(g,17,15,9,1,'#3a3a40');P(g,17,18,7,1,'#8a8a92');P(g,17,21,8,1,'#8a8a92');P(g,14,4,4,5,'#3a3a40')}});
addCol('laser',{t:'Лазерная указка',d:'Черсик будет счастлив. Главное, не светить в глаза зомби. Хотя...',where:'Глава 1 · офис 2',draw:g=>{P(g,4,20,14,4,'#2a2a30');P(g,5,21,12,1,'#4a4a52');P(g,9,20,2,1,'#c8c8d0');P(g,17,21,2,2,'#ff2020');for(let i=0;i<10;i++)P(g,19+i,20-i*1.2|0,1,1,'#ff3030');P(g,27,7,3,3,'#ff6060')}});

// ---- настоящие фото (пиксель-арт, photos/pN.png) ----
const PHOTOS=[
 ['Черсик-босс','Этим взглядом Черсик оценивает твой план спасения мира. Не впечатлён.','Глава 3 · подвал'],
 ['Обнимашки по расписанию','Шмакодявка обнимает Черсика. Черсик терпит. Ровно три секунды.','Глава 2 · Сити Молл, аптека'],
 ['Вечерние чтения','Шмакодявка читает, Черсик охраняет диван. Тише, идёт самая интересная глава.','Глава 1 · парковка'],
 ['Кот-надзиратель','Черсик проверяет, правильно ли ты читаешь. Строгий, но справедливый.','Глава 2 · фитнес-зал'],
 ['Нос крупным планом','Черсик пришёл выяснить, кто тут фотографирует. Лучший нос района.','Глава 1 · офис 1'],
 ['Неоновая ночь','Глаза Черсика светятся ярче фонарей на Невском. Зомби, бойтесь.','Глава 2 · «Золотое яблоко»'],
 ['Утро втроём','Микроб, Шмакодявка и Черсик посередине. Будильник отменён.','Глава 3 · подвал'],
 ['Кот лёг на клавиатуру','Катка проиграна. Виноват известно кто. Он не раскаивается.','Глава 1 · офис 2'],
 ['Его величество','Черсик на троне. Уже тогда было ясно, кто в доме главный.','Глава 2 · Сити Молл, одежда'],
 ['Штурман Черсик','Черсик прокладывает маршрут. Навигатор больше не нужен.','Глава 3 · катакомбы'],
 ['С Новым годом!','Ёлка, гирлянды и кружка чего-то горячего. Зомби подождут до старого Нового года.','Глава 4 · Невский'],
 ['Лимонад на солнышке','Жара, зелень и бутылка чего-то освежающего. Улыбка сильнее любого апокалипсиса.','Глава 5 · рынок'],
 ['Тихая охота','Полное ведро лисичек. Леший до сих пор уверен, что это были его грибы.','Глава 6 · лес'],
 ['Зеркальное селфи','Микроб и Шмакодявка. Телефон держит она, нежность — он.','Глава 5 · вилла'],
 ['Ещё пять минут','Шмакодявка в офисе делает лицо «ещё пять минут и домой».','Глава 4 · квартира бати'],
 ['После сета','Розовые очки, неон и наушники на шее. Танцпол ещё дымится.','Глава 7 · подвал «Грибыча»'],
 ['Закат на пляже','Микроб и Шмакодявка на песке. Море тёплое, зомби далеко.','Глава 5 · пляж'],
 ['Блёстки и шампанское','Микроб и Шмакодявка на вечеринке. Дресс-код: сиять.','Глава 4 · клуб «Бардак»'],
 ['Соломенный кот','Огромный кот из соломы сторожит посёлок. Леший его побаивается.','Глава 6 · коттеджи'],
 ['Микроб в коже','Кожанка, цепочка и взгляд «я уже слышал твой сет».','Глава 7 · бар наверху'],
 ['Черсик-светлячок','Глаза горят, лапы на коленке. Ночной дозор заступил.','Глава 8 · «Пески»'],
];
PHOTOS.forEach((ph,i)=>{const id='ph'+(i+1);addCol(id,{t:'Фото: '+ph[0],d:ph[1],where:ph[2],photo:true,draw:g=>{P(g,2,2,28,28,'#f4f0e6');P(g,4,4,24,24,'#2a2438')}});
  const c=COLS.find(c=>c.id===id),im=new Image();im.onload=()=>{const g=c.icon.getContext('2d');g.clearRect(0,0,32,32);g.fillStyle='#f4f0e6';g.fillRect(0,0,32,32);g.imageSmoothingEnabled=true;g.drawImage(im,0,16,96,96,2,2,28,28);c.img=im};im.src='photos/p'+(i+1)+'.png'});
const GAL_BTN={x:W-74,y:4,w:70,h:12};
C1.gal=null;
function galRender(){
  const b=GAL_BTN;u.fillStyle='rgba(58,240,200,'+(.7+.25*Math.sin(tm*3+3))+')';u.fillRect(b.x,b.y,b.w,b.h);u.fillStyle='#120a1c';uiFont(5,true);u.textAlign='center';u.fillText('ГАЛЕРЕЯ '+[...COLSET].filter(id=>COLS.some(c=>c.id===id)).length+'/'+COLS.length+'  ★'+LEGSET.size+(touch.on?'':' (K)'),b.x+b.w/2,b.y+8);u.textAlign='left';
}

// ---- ЛЕГЕНДАРНЫЕ КАРТОЧКИ (отдельная вкладка галереи, светятся своим цветом) ----
const LEGS=[],LEGSET=new Set();try{for(const id of JSON.parse(localStorage.getItem('legs')||'[]'))LEGSET.add(id)}catch(e){}
let KTOT=0;try{KTOT=+localStorage.getItem('kills_total')||0}catch(e){}
function addLeg(id,o){if(LEGS.some(c=>c.id===id))return;const c=Object.assign({id},o);c.icon=mk(32);c.draw(c.icon.getContext('2d'));LEGS.push(c)}
function unlockLeg(id){if(LEGSET.has(id))return;const c=LEGS.find(c=>c.id===id);if(!c)return;LEGSET.add(id);try{localStorage.setItem('legs',JSON.stringify([...LEGSET]))}catch(e){}C1.legNote={c,t0:tm};sfx('ring');sfx('power',.6)}
C1.addLeg=addLeg;C1.unlockLeg=unlockLeg;C1.LEGS=LEGS;C1.LEGSET=LEGSET;
addLeg('angel',{t:'Золотой Черсик',col:'#ffd23a',how:'Получи оценку S на любом уровне',d:'Старый шпиль с ангелом город убрал. На новом стоит золотой Черсик — в честь героя. Говорят, он выбирает только лучших.',draw:g=>{P(g,15,2,2,30,'#c8a040');P(g,16,2,1,30,'#ffe890');P(g,12,6,8,2,'#ffd23a');P(g,13,9,6,7,'#ffd23a');P(g,14,10,4,5,'#fff0a0');P(g,14,5,4,4,'#ffe890');P(g,4,8,9,3,'#ffe890');P(g,6,11,7,2,'#ffd23a');P(g,19,8,9,3,'#ffe890');P(g,19,11,7,2,'#ffd23a');P(g,10,24,12,2,'#c8a040')}});
addLeg('gun',{t:'Ружьё Аниса',col:'#ff3a4a',how:'Пройди главу 1',d:'Двустволка Аниса. Он бы хотел, чтобы она досталась тебе. Сезон открыт навсегда.',draw:g=>{for(let i=0;i<24;i++){P(g,4+i,26-i,3,2,'#26262a');P(g,5+i,26-i,1,1,'#5a5a62')}for(let i=0;i<8;i++)P(g,2+i,26-i+2,4,3,'#6a4424');P(g,10,19,4,3,'#8a6434');P(g,26,3,3,2,'#ff3a4a')}});
addLeg('protein',{t:'Банка «КОТ-ПРОТЕИН»',col:'#7aff3a',how:'Найди все находки в галерее',d:'Та самая. Одна ложка, и Черсик сдвинет диван. Хранить вдали от котов. Бесполезно.',draw:g=>{P(g,8,6,16,22,'#1a1a1e');P(g,9,7,14,20,'#2a2a30');P(g,7,3,18,4,'#7aff3a');P(g,9,11,14,10,'#7aff3a');P(g,11,13,2,2,'#111');P(g,19,13,2,2,'#111');P(g,10,11,2,2,'#111');P(g,20,11,2,2,'#111');P(g,14,17,4,1,'#111');P(g,12,23,8,1,'#7aff3a')}});
addLeg('flame',{t:'Голубое пламя',col:'#3ad8ff',how:'Сделай комбо x10',d:'Последняя бутылка запретной партии Анисова самогона. Горит синим. Пить нельзя никому.',draw:g=>{P(g,12,12,8,16,'#cfe8f0');P(g,13,13,6,14,'#9ad8e8');P(g,14,8,4,4,'#cfe8f0');P(g,14,7,4,1,'#8a5a2a');P(g,13,18,6,4,'#e8e0c0');P(g,15,1,2,6,'#3ad8ff');P(g,14,3,4,3,'#8af0ff');P(g,16,0,1,2,'#fff')}});
addLeg('eye',{t:'Глаз Черсика',col:'#c05aff',how:'Убей 300 зомби (за все игры)',d:'Кто видел этот взгляд, уже не боится зомби. Зомби, кстати, тоже его видели.',draw:g=>{P(g,3,10,26,12,'#111');P(g,5,8,22,16,'#111');P(g,7,10,18,12,'#c8e040');P(g,9,11,14,10,'#e0f060');P(g,15,9,2,14,'#111');P(g,14,11,4,10,'#111');P(g,18,12,2,2,'#fff');P(g,5,6,5,2,'#c05aff');P(g,22,24,5,2,'#c05aff')}});
// условия
const _sf=scoreFinish;
function legUI(){const N=C1.legNote;if(!N)return;const k=tm-N.t0;if(k>4.5){C1.legNote=null;return}const a=Math.min(1,k*4,(4.5-k)*2),c=N.c;u.globalAlpha=a;
  const x=W/2-70,y=H-58;panel(x,y,140,30,.92);u.save();u.shadowColor=c.col;u.shadowBlur=10+6*Math.sin(tm*6);u.strokeStyle=c.col;u.lineWidth=1.2;u.strokeRect(x,y,140,30);u.restore();
  u.imageSmoothingEnabled=false;u.drawImage(c.icon,x+4,y+3,24,24);uiFont(4.4,true);u.fillStyle=c.col;u.fillText('★ ЛЕГЕНДАРНАЯ КАРТОЧКА',x+32,y+10);uiFont(6,true);u.fillStyle='#fff';u.fillText(c.t,x+32,y+19);uiFont(3.6,false);u.fillStyle='#9a92b0';u.fillText('Смотри в галерее на титуле',x+32,y+26);u.globalAlpha=1}
function legCard(c,x,y,w,h,got){
  u.save();if(got){u.shadowColor=c.col;u.shadowBlur=8+5*Math.sin(tm*3+x)}u.fillStyle=got?'rgba(20,14,32,.95)':'rgba(255,255,255,.03)';u.fillRect(x,y,w,h);u.restore();
  u.strokeStyle=got?c.col:'#3a3448';u.lineWidth=got?1.2:.6;u.strokeRect(x,y,w,h);
  if(got){u.save();u.globalAlpha=.25+.15*Math.sin(tm*4+x);u.fillStyle=c.col;u.fillRect(x+2,y+2,w-4,2);u.fillRect(x+2,y+h-4,w-4,2);u.restore()}
  u.imageSmoothingEnabled=false;const s=w-16;if(got)u.drawImage(c.icon,x+8,y+6,s,s);else{u.fillStyle='#1a1624';u.fillRect(x+8,y+6,s,s);u.fillStyle='#4a4458';uiFont(18,true);u.textAlign='center';u.fillText('★',x+w/2,y+6+s*.68);u.textAlign='left'}
  uiFont(4.4,true);u.fillStyle=got?c.col:'#6a6278';u.textAlign='center';const ws=(got?c.t:'???').split(' ');let line='',n=0;for(const wd of ws){const t=line?line+' '+wd:wd;if(u.measureText(t).width>w-4&&line){u.fillText(line,x+w/2,y+s+14+n*5.5);n++;line=wd}else line=t}u.fillText(line,x+w/2,y+s+14+n*5.5);
  uiFont(3.5,false);u.fillStyle=got?'#9a92b0':'#8a82a0';const ws2=c.how.split(' ');line='';let m=0;for(const wd of ws2){const t=line?line+' '+wd:wd;if(u.measureText(t).width>w-6&&line){u.fillText(line,x+w/2,y+h-14+m*4.4);m++;line=wd}else line=t}u.fillText(line,x+w/2,y+h-14+m*4.4);u.textAlign='left'}
function legTab(){const w=56,h=112,gap=6,x0=(W-(LEGS.length*w+(LEGS.length-1)*gap))/2,y=38;
  LEGS.forEach((c,i)=>legCard(c,x0+i*(w+gap),y,w,h,LEGSET.has(c.id)))}
function legHit(p){const w=56,h=112,gap=6,x0=(W-(LEGS.length*w+(LEGS.length-1)*gap))/2,y=38;for(let i=0;i<LEGS.length;i++){const x=x0+i*(w+gap);if(p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h)return LEGS[i]}return null}
function galTabs(){const tabs=[['col','НАХОДКИ '+[...COLSET].filter(id=>COLS.some(c=>c.id===id)).length+'/'+COLS.length,'#3ef0b0'],['leg','★ ЛЕГЕНДАРНЫЕ '+[...LEGSET].filter(id=>LEGS.some(c=>c.id===id)).length+'/'+LEGS.length,'#ffd23a']];
  const tab=C1.gal.tab||'col';tabs.forEach((t,i)=>{const x=W/2-82+i*84,y=20,on=tab===t[0];u.fillStyle=on?t[2]:'rgba(255,255,255,.07)';u.fillRect(x,y,80,8);uiFont(4.4,true);u.fillStyle=on?'#120a1c':t[2];u.textAlign='center';u.fillText(t[1],x+40,y+5.8);u.textAlign='left'})}
function tabHit(p){if(p.y>=19&&p.y<=29){if(p.x>=W/2-82&&p.x<W/2-2)return'col';if(p.x>=W/2+2&&p.x<W/2+82)return'leg'}return null}

function galOverlay(){
  if(!C1.gal)return;
  if(C1.gal.view){galView(C1.gal.view);return}
  panel(0,0,W,H,.94);u.textAlign='center';uiFont(8,true);u.fillStyle='#3ef0b0';u.fillText('ГАЛЕРЕЯ',W/2,13);u.textAlign='left';galTabs();
  if(C1.gal.tab==='leg'){legTab();uiFont(4.4,false);u.fillStyle='#9a92b0';u.textAlign='center';u.fillText(touch.on?'Коснись карточки, чтобы рассмотреть · мимо — закрыть':'Клик по карточке — рассмотреть · Tab — вкладки · Esc — закрыть',W/2,H-3);u.textAlign='left';return}
  const per=9,pg=C1.gal.pg||0,pages=Math.max(1,Math.ceil(COLS.length/per));
  if(pages>1){uiFont(4,false);u.fillStyle='#9a92b0';u.textAlign='right';u.fillText('стр. '+(pg+1)+'/'+pages,W-16,12);u.textAlign='left'}
  COLS.slice(pg*per,pg*per+per).forEach((c,i)=>{const cx=8+(i%3)*103,cy=31+Math.floor(i/3)*44,got=COLSET.has(c.id);
    u.fillStyle=got?'rgba(255,255,255,.08)':'rgba(255,255,255,.03)';u.fillRect(cx,cy,100,41);u.fillStyle=got?'#3ef0b0':'#3a3448';u.fillRect(cx,cy,1.5,41);
    u.imageSmoothingEnabled=false;if(got)u.drawImage(c.icon,cx+4,cy+4,32,32);else{u.fillStyle='#1a1624';u.fillRect(cx+4,cy+4,32,32);u.fillStyle='#4a4458';uiFont(16,true);u.textAlign='center';u.fillText('?',cx+20,cy+26);u.textAlign='left'}
    uiFont(4.6,true);u.fillStyle=got?'#ffd23a':'#6a6278';const two=got&&u.measureText(c.t).width>57;galWrap(got?c.t:'???',cx+40,cy+8,57,5.5,2);
    uiFont(3.7,false);u.fillStyle=got?'#e8e4f0':'#6a6278';galWrap(got?c.d:c.where,cx+40,cy+(two?21:16),57,4.6,two?3:4)});
  uiFont(4.4,false);u.fillStyle='#9a92b0';u.textAlign='center';u.fillText(touch.on?'Коснись находки, чтобы рассмотреть · мимо — закрыть':'Клик по находке — рассмотреть · Esc — закрыть'+(pages>1?' · стрелки — страницы':''),W/2,H-3);u.textAlign='left';
  if(pages>1){uiFont(9,true);u.fillStyle='#3ef0b0';u.fillText('◀',4,22);u.textAlign='right';u.fillText('▶',W-4,22);u.textAlign='left'}
}
function galWrap(t,x,y,w,lh,max){const ws=t.split(' ');let line='',n=0;for(const wd of ws){const tt=line?line+' '+wd:wd;if(u.measureText(tt).width>w&&line){u.fillText(line,x,y+n*lh);n++;line=wd;if(n>=max)return}else line=tt}if(line&&n<max)u.fillText(line,x,y+n*lh)}
function galView(c,foot){panel(0,0,W,H,.97);u.imageSmoothingEnabled=false;
  if(c.col){const s=140,x=16,y=(H-s)/2;u.save();u.shadowColor=c.col;u.shadowBlur=18+8*Math.sin(tm*3);u.fillStyle='#140e20';u.fillRect(x,y,s,s);u.restore();u.strokeStyle=c.col;u.lineWidth=1.5;u.strokeRect(x,y,s,s);u.drawImage(c.icon,x+10,y+10,s-20,s-20);
    const tx=x+s+18,tw=W-tx-12;uiFont(4.6,true);u.fillStyle=c.col;u.fillText('★ ЛЕГЕНДАРНАЯ',tx,32);uiFont(9,true);u.fillStyle='#fff';galWrap(c.t,tx,46,tw,10,3);uiFont(6,false);u.fillStyle='#e8e4f0';galWrap(c.d,tx,76,tw,8,5);uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText('Как получить: '+c.how,tx,128);u.fillText(foot||(touch.on?'Коснись, чтобы вернуться':'Клик или Esc — назад'),tx,H-12);return}
  const ih=150,iw=c.img?ih*c.img.width/c.img.height:ih,ix=14,iy=(H-ih)/2;u.fillStyle='#f4f0e6';u.fillRect(ix-4,iy-4,iw+8,ih+16);
  if(c.img)u.drawImage(c.img,ix,iy,iw,ih);else u.drawImage(c.icon,ix,iy,ih,ih);
  const tx=ix+iw+16,tw=W-tx-12;uiFont(9,true);u.fillStyle='#ffd23a';galWrap(c.t,tx,40,tw,10,3);
  uiFont(6,false);u.fillStyle='#e8e4f0';galWrap(c.d,tx,72,tw,8,6);uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText(c.where,tx,128);
  u.fillText(foot||(touch.on?'Коснись, чтобы вернуться':'Клик или Esc — назад'),tx,H-12)}
function galTap(p){const pages=Math.max(1,Math.ceil(COLS.length/9));
  if(C1.gal){if(C1.gal.view){C1.gal.view=null;return true}
    const th=tabHit(p);if(th){C1.gal.tab=th;C1.gal.pg=0;sfx('click');return true}
    if(C1.gal.tab==='leg'){const c=legHit(p);if(c){if(LEGSET.has(c.id)){C1.gal.view=c;sfx('click')}return true}C1.gal=null;return true}
    if(pages>1&&p.y<30&&(p.x<30||p.x>W-30)){C1.gal.pg=((C1.gal.pg||0)+(p.x<30?pages-1:1))%pages;sfx('click');return true}
    const pg=C1.gal.pg||0;for(let i=0;i<9;i++){const c=COLS[pg*9+i];if(!c)break;const cx=8+(i%3)*103,cy=31+Math.floor(i/3)*44;if(p.x>=cx&&p.x<=cx+100&&p.y>=cy&&p.y<=cy+41){if(COLSET.has(c.id)){C1.gal.view=c;sfx('click')}return true}}
    C1.gal=null;return true}
  const b=GAL_BTN;if(state==='title'&&!C1.menu&&p.x>=b.x-3&&p.x<=b.x+b.w+3&&p.y>=b.y-3&&p.y<=b.y+b.h+3){C1.gal={pg:0};sfx('click');return true}return false}
const _rt2=renderTitle;renderTitle=function(){_rt2();galRender();if(!C1.gal)legUI()};
addEventListener('load',()=>{const _rt3=renderTitle;renderTitle=function(){_rt3();galOverlay()}});
addEventListener('keydown',e=>{if(state!=='title')return;
  if(C1.gal){if(C1.gal.view){C1.gal.view=null}else if(e.code==='Tab'){C1.gal.tab=C1.gal.tab==='leg'?'col':'leg';C1.gal.pg=0}else if(e.code==='ArrowRight'||e.code==='ArrowLeft'){const n=Math.max(1,Math.ceil(COLS.length/9));C1.gal.pg=((C1.gal.pg||0)+(e.code==='ArrowRight'?1:n-1))%n}else C1.gal=null;e.preventDefault();e.stopImmediatePropagation();return}
  if(e.code==='KeyK'&&!C1.menu){C1.gal={pg:0};sfx('click');e.preventDefault();e.stopImmediatePropagation()}},true);
for(const ev of ['mousedown','touchstart'])addEventListener(ev,e=>{if(state!=='title')return;const t=e.changedTouches?e.changedTouches[0]:e;if(!t)return;const p=toXY(t);
  if(galTap(p)){if(e.changedTouches)touch.on=true;e.preventDefault();e.stopImmediatePropagation()}},{capture:true,passive:false});

const CH_BTN={x:W-74,y:H-24,w:70,h:12};
function kit(n){
  const i=MENU.findIndex(m=>m[1]===n);Object.assign(PS,{mag:{pistol:8},rl:0,rlw:null,own:{bat:1,pistol:1},lo:{m:'bat',p:'pistol',t:null},found:[],pot:0,potT:0,beer:0,beerT:0,arm:null,p50:0,r762:0,r556:0,awp:0,anisCash:false,hp:100,lives:3,inv:0,wpn:'pistol',ammo:12,shells:0,syr:0,moon:0,hasShotgun:false,mode:'spread',regen:0,rideGain:0,carry:false,food:false,hasAxe:false,hasExt:false,hasNail:false,nails:0,ext:0,slow:0,hasRail:false,cells:0,hasFlame:false,fuel:0,key1:false,key2:false});
  if(i>=5){PS.ammo=30;PS.syr=2;PS.rideGain=18}
  if(i>=7){PS.moon=5;PS.ammo=36;PS.syr=3}
  if(i>=8){PS.shells=20;PS.food=true;giveWpn('shotgun',true);giveWpn('rail',false);PS.cells=6;if(C1.giveArmor)C1.giveArmor('1')}
}
function menuStart(n){
  C1.menu=null;state='play';ac();kit(n);S.bat=S.pistol=true;S.skladLocked=false;S.alarm=true;S.key=true;mapDirty=true;
  if(n==='call'){scene='flat';C1.on=false;S.step=10;pl.x=170;pl.y=70;pl.a=-Math.PI/2;mz('loot');note('Подойди к Шмакодявке');return}
  if(n==='home'){C1.on=true;playC(CUT_HOME,endHome);mz('home');return}
  sec(n);
}
const _rt=renderTitle;
renderTitle=function(){
  _rt();
  const b=CH_BTN;u.fillStyle='rgba(255,210,58,'+(.75+.25*Math.sin(tm*3))+')';u.fillRect(b.x,b.y,b.w,b.h);u.fillStyle='#120a1c';uiFont(5.4,true);u.textAlign='center';u.fillText('ГЛАВА 1 ▸'+(touch.on?'':'  (G)'),b.x+b.w/2,b.y+8.2);u.textAlign='left';
  if(C1.menu){panel(0,0,W,H,.92);u.textAlign='center';uiFont(10,true);u.fillStyle='#ffd23a';u.fillText('ГЛАВА 1 · ПОГРОМ В ОФИСЕ',W/2,22);uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText('Выбери, откуда начать (для проверки участков)',W/2,30);u.textAlign='left';
    MENU.forEach((m,i)=>{const y=38+i*14,sel=C1.menu.sel===i;u.fillStyle=sel?'rgba(255,210,58,.9)':'rgba(255,255,255,.08)';u.fillRect(W/2-90,y,180,11);u.fillStyle=sel?'#120a1c':'#fff';uiFont(5.4,true);u.fillText((i+1)+'. '+m[0],W/2-85,y+7.8);const gr=GRADES[m[1]];if(gr){u.textAlign='right';u.fillStyle=sel?'#120a1c':'#ff4fa3';u.fillText(gr.g+'  '+fmtN(gr.s),W/2+86,y+7.8);u.textAlign='left'}});
    uiFont(4.4,false);u.fillStyle='#9a92b0';u.textAlign='center';u.fillText(touch.on?'Коснись участка. Коснись вне списка — назад':'W/S и E, или клик. Esc — назад',W/2,H-4);u.textAlign='left'}
};
const _re=renderEnd;
renderEnd=function(){
  if(!C1.done)return _re();
  panel(0,0,W,H,1);u.textAlign='center';uiFont(16,true);u.fillStyle='#ff2a7a';u.fillText('ГЛАВА 1 ПРОЙДЕНА',W/2+1.5,62+1.5);u.fillStyle='#ffd23a';u.fillText('ГЛАВА 1 ПРОЙДЕНА',W/2,62);
  uiFont(7,true);u.fillStyle='#3ef0b0';u.fillText('Погром в офисе',W/2,76);
  uiFont(5.5,false);u.fillStyle='#fff';u.fillText('Убито зомби: '+PS.kills+'   ·   В рюкзаке: еда, шприцы ('+PS.syr+'), патроны ('+PS.ammo+'), дробь ('+PS.shells+')',W/2,94);
  legUI();u.textAlign='center';u.fillStyle='#9a92b0';u.fillText('Продолжение следует...',W/2,108);u.fillText(touch.on?'Коснись, чтобы сыграть ещё раз':'R или клик — сыграть ещё раз',W/2,124);u.textAlign='left';
};
function menuPick(x,y){const i=Math.floor((y-38)/14);if(x>W/2-90&&x<W/2+90&&i>=0&&i<MENU.length&&y-38-i*14<=11){menuStart(MENU[i][1]);return true}C1.menu=null;return true}

// ================= ВВОД (перехват до обработчиков пролога) =================
const toXY=e=>({x:(e.clientX-OX)/SC,y:(e.clientY-OY)/SC});
addEventListener('keydown',e=>{
  C1.lastIn='key';ac();
  if(C1.on&&C1.colView){if(!e.repeat&&['KeyE','Space','Enter','Escape'].includes(e.code))colViewClose();e.preventDefault();e.stopImmediatePropagation();return}
  if(state==='title'){
    if(C1.menu){const m=C1.menu;if(e.code==='KeyW'||e.code==='ArrowUp')m.sel=(m.sel+MENU.length-1)%MENU.length;else if(e.code==='KeyS'||e.code==='ArrowDown')m.sel=(m.sel+1)%MENU.length;
      else if(['KeyE','Space','Enter'].includes(e.code)){if(!e.repeat)menuStart(MENU[m.sel][1])}else if(e.code==='Escape')C1.menu=null;
      else if(/^Digit[1-9]$/.test(e.code)){const i=+e.code[5]-1;if(MENU[i])menuStart(MENU[i][1])}
      e.preventDefault();e.stopImmediatePropagation();return}
    if(e.code==='KeyG'){C1.menu={sel:0};ac();e.preventDefault();e.stopImmediatePropagation();return}
  }
  if(!C1.on||state!=='play'||e.repeat)return;ac();
  if(C1.over){if(['KeyE','Space','Enter'].includes(e.code)){retry();e.preventDefault();e.stopImmediatePropagation()}return}
  if(dlg||cut||(window.MG&&MG.active))return;
  const c=e.code;
  if(C1.mode==='td'&&L&&L.armed&&!C1.noWpn){
    if(c==='Digit1')slotWpn('m');if(c==='Digit2')slotWpn('p');if(c==='Digit3')slotWpn('t');if(c==='KeyQ')cycleWpn(1);if(c==='KeyF')throwMol();if(c==='KeyR')startReload(false);
    if(C1.upg&&C1.upg()){if(c==='KeyJ')drinkPot();if(c==='KeyB')drinkBeer()}
  }
  if(c==='KeyH'&&(C1.mode==='ride'||(L&&L.armed)))heal();
  if(C1.onKey)try{C1.onKey(c,e)}catch(er){console.warn(er)}
},true);
addEventListener('mousedown',e=>{
  C1.lastIn='mouse';ac();const p=toXY(e);
  if(state==='title'){
    if(C1.menu){menuPick(p.x,p.y);e.stopImmediatePropagation();return}
    const b=CH_BTN;if(p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h){C1.menu={sel:0};ac();e.stopImmediatePropagation();return}
  }
  if(!C1.on||state!=='play')return;ac();
  if(C1.colView){colViewClose();e.stopImmediatePropagation();return}
  if(C1.over){if(C1.over.t>.6)retry();e.stopImmediatePropagation();return}
  if(e.button===0)C1.mdown=true;
  if(e.button===2&&C1.mode==='td'&&L&&L.armed&&!dlg&&!cut&&!C1.noWpn)throwMol();
},true);
addEventListener('mouseup',e=>{if(e.button===0)C1.mdown=false},true);
addEventListener('contextmenu',e=>{if(C1.on)e.preventDefault()});
addEventListener('wheel',e=>{if(C1.on&&C1.mode==='td'&&L&&L.armed&&!dlg&&!C1.noWpn)cycleWpn(e.deltaY>0?1:-1)},{passive:true});
addEventListener('touchstart',e=>{
  C1.lastIn='touch';ac();
  for(const t of e.changedTouches){const p=toXY(t);
    if(state==='title'){touch.on=true;mouse.on=false;
      if(C1.menu){menuPick(p.x,p.y);e.preventDefault();e.stopImmediatePropagation();return}
      const b=CH_BTN;if(p.x>=b.x-4&&p.x<=b.x+b.w+4&&p.y>=b.y-4&&p.y<=b.y+b.h+4){C1.menu={sel:-1};e.preventDefault();e.stopImmediatePropagation();return}}
    if(!C1.on||state!=='play')continue;
    if(C1.colView){colViewClose();e.preventDefault();e.stopImmediatePropagation();return}
    if(C1.over){if(C1.over.t>.6)retry();e.preventDefault();e.stopImmediatePropagation();return}
    if(fbVisible()&&Math.hypot(p.x-FB.x,p.y-FB.y)<FB.r+5){C1.fire=t.identifier;C1.fireQ=true;C1.hint=0;e.preventDefault();e.stopImmediatePropagation();return}
    if(C1.xbtn)for(const b of C1.xbtn){if(b.vis()&&Math.hypot(p.x-b.x,p.y-b.y)<b.r+3){b.act();e.preventDefault();e.stopImmediatePropagation();return}}
    for(const k in TB){if(!tbVisible(k))continue;const b=TB[k];if(Math.hypot(p.x-b.x,p.y-b.y)<b.r+3){
      if(k==='w')cycleWpn(1);if(k==='h')heal();if(k==='f')throwMol();if(k==='m')startReload(false);if(k==='p')drinkPot();if(k==='b')drinkBeer();
      e.preventDefault();e.stopImmediatePropagation();return}}
  }
},{capture:true,passive:false});

for(const ev of ['touchend','touchcancel'])addEventListener(ev,e=>{if(C1.fire===null)return;for(const t of e.changedTouches)if(t.identifier===C1.fire){C1.fire=null;e.stopImmediatePropagation()}},{capture:true});
// ================= ПОДМЕНА ЦИКЛА ПРОЛОГА =================
const _update=update,_render=render,_action=action;
update=function(dt){
  if(!C1.on)return _update(dt);
  tm+=dt;
  if(C1.colView){C1.colView.t+=dt;updateMusic(dt);return}
  for(const t of timers)t.t-=dt;const due=timers.filter(t=>t.t<=0);timers=timers.filter(t=>t.t>0);due.forEach(t=>t.fn());
  if(toast){toast.life-=dt;if(toast.life<=0)toast=null}
  if(dlg){const Ln=dlg.lines[dlg.i];dlg.shown=Math.min(Ln.t.length,dlg.shown+dt*48)}
  updateMusic(dt);
  if(tr){tr.t+=dt;if(!tr.done&&tr.t>=.5){tr.done=true;tr.fn()}if(tr&&tr.t>=1)tr=null}
  if(!C1.on)return;
  if(C1.over){C1.over.t+=dt;return}
  if(cut){updateCut(dt);return}
  if(C1.mode==='td'&&L)tdUpdate(dt);else if(C1.mode==='ride'&&RD)rideUpdate(dt);
};
render=function(){
  if(!C1.on||state!=='play')return _render();
  if(cut){renderCut();renderUI();return}
  if(C1.mode==='td'||C1.mode==='ride'){tdRenderAll();return}
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);trFade();c1UI();
};
action=function(){
  if(!C1.on)return _action();
  if(C1.colView){colViewClose();return}
  if(C1.over){if(C1.over.t>.6)retry();return}
  if(dlg){advance();return}
  if(cut){if(cut.t>.6)nextShot();return}
  if(tr)return;
  if(C1.lastIn==='mouse'&&L&&L.armed&&C1.mode==='td')return;
  if(C1.mode==='td'&&C1.near){if(window.MG&&MG.intercept(C1.near))return;C1.near.act();return}
};
// курсор прячем в бою (рисуем свой прицел)
setInterval(()=>{const hide=C1.on&&state==='play'&&!cut&&!dlg&&!(window.MG&&MG.active)&&!(window.UP&&UP.isOpen&&UP.isOpen())&&(C1.mode==='ride'||(C1.mode==='td'&&L&&L.armed));document.body.style.cursor=hide?'none':''},200);
// быстрый старт по ссылке: #ch1, #fort, #ride0..2, #park, #off1, #off2, #home
const hs=location.hash.slice(1);if(hs){const m={ch1:'call'}[hs]||hs;if(MENU.some(x=>x[1]===m))setTimeout(()=>{menuOn=true;menuStart(m)},50)}
// крючки для главы 2 (level2.js)
C1.TB=TB; // глава 3 подписывает кнопку лечения «КОРМ»
C1.X={shadeSpr,hstr2,buildNav,paint,drawWalls,B,lowBox,cabinet,plant,carTop,lampPost,win,hurtZ,killZ,drawZ,zBody,zCache,ZT,blood,hurtPlayer,loseLife,sfx,playC,go,mz,floatT,setWpn,weapons,hudStats,hudObj,hudBar,igniteAt,sideRover,cityRuins,drawSoldier,sprN,camo,kit,snap,restore,tdRender,aimAngle,inputMove,touchFiring,MENU,CH_BTN,get RD(){return RD}};
C1.galOverlay=galOverlay;C1.galTap=galTap;C1.legCard=legCard;C1.endHomeHook=null;
C1.menuStart=menuStart;C1.get=()=>({L,RD,PS,cut,dlg,scene,state});
if(window.HDS){sideZombie=HDS.wrap(sideZombie);sideAnis=HDS.wrap(sideAnis);bossSide=HDS.wrap(bossSide,[34,62])}
})();
// 03.11: дальние зомби в броне — armor.js подгружается отсюда, чтобы не зависеть от правок index.html
if(!window.AZ&&!document.querySelector('script[src="armor.js"]')){const s=document.createElement('script');s.src='armor.js';s.async=false;document.head.appendChild(s)}
