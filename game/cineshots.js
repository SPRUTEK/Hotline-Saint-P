// cineshots.js — все катсцены игры в кинорежиме 640×360 (06.11): пролог, новости, главы 1–10, эпилог.
// Заменяет draw у кадров C1..C10.CUTS, INTRO, NEWS. Тексты, длительности и диалоги не трогаем.
(function(){
'use strict';
const C=window.CINE;if(!C||!C.sky)return;
const {AW,AH,R,P,dith,glow,cone,txt,txtW,neonTxt,hash,mix,lit,drk,hero,cat,rat,zombie,putS,shadow,FURN:F}=C;const TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=k=>k<0?0:k>1?1:k*k*(3-2*k);
const SFX=(n,v)=>{try{if(typeof sfx==='function')sfx(n,v)}catch(e){}};
const SHAKE=v=>{try{if(typeof cut!=='undefined'&&cut)cut.shake=Math.max(cut.shake||0,v)}catch(e){}};
// частицы кадра (в координатах 640×360)
function PS(s,t){if(!s._ps||t<(s._pt||0)-.001){s._ps=[];s._ev={}}const dt=Math.min(.05,Math.max(0,t-(s._pt||0)));s._pt=t;for(const p of s._ps){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.g==null?300:p.g)*dt;p.l-=dt}s._ps=s._ps.filter(p=>p.l>0);return s}
function drawPS(s){for(const p of s._ps){if(p.glow)glow(p.x,p.y,p.r*4,p.c,.3*Math.min(1,p.l));R(p.x,p.y,p.r,p.r,p.c)}}
function once(s,k){if(s._ev[k])return false;s._ev[k]=1;return true}
function burst(s,x,y,n,c,sp,o){o=o||{};for(let i=0;i<n;i++){const a=Math.random()*TAU,v=sp*(.3+Math.random()*.7);s._ps.push({x,y,vx:Math.cos(a)*v*(o.wx||1),vy:Math.sin(a)*v-(o.up||sp*.5),g:o.g==null?300:o.g,l:(o.life||.9)+Math.random()*.6,c:Array.isArray(c)?c[i%c.length]:c,r:o.r||1+(Math.random()*2|0),glow:o.glow})}}
const BLOOD=['#8a0a18','#c81e2a','#5a0610'],SLIME=['#5aff3a','#aaff4a','#2ac81a','#e8ff9a'];
// игрок на самокате
function scooterRide(x,y,t,who2){putS(C.scooter(),x,y);hero('m',x+16,y-5,t,'stand',{noShadow:1});if(who2)hero('s',x+6,y-5,t,'stand',{noShadow:1});shadow(x+18,y,40)}
// головы в окнах машины
function heads(x,y,list){for(const [dx,c,hc] of list){R(x+dx,y,8,9,c||'#e8b898');R(x+dx-1,y-2,10,4,hc||'#2a1a10')}}
// гудок/вспышка в кадре
function flash(a,c){if(a<=0)return;C.g.fillStyle=c||'rgba(255,255,255,'+a+')';if(c)C.g.globalAlpha=a;C.g.fillRect(0,0,AW,AH);C.g.globalAlpha=1}
// пешеходы (мирные): небольшие, в масштабе
const PEDS=[{f:1,hair:'#c8a060',style:'fem',dress:'#3affd8',legs:'#f0c8a8',shoes:'#1a1a1a'},{hair:'#2a1a10',style:'short',top:'#c84a4a',pants:'#2a2a3a'},{f:1,hair:'#1a1a1a',style:'bob',top:'#ffd23a',pants:'#3a3a5a'},{hair:'#5a3a20',style:'curly',top:'#4a8ac8',kind:'hoodie',pants:'#1a1a22'},{hair:'#8a8a8a',style:'short',top:'#5a5a6a',kind:'coat',coat:'#5a5a6a'},{f:1,hair:'#8a3a2a',style:'fem',top:'#ff6aa8',pants:'#1a1a22'}];
function ped(i,x,y,t,pose,fl,sc){const P=Object.assign({skin:hash(i,2)<.5?'#f0c8a8':'#d8a080',shoes:'#1a1a1e'},PEDS[i%PEDS.length]);sc=sc||.8;C.g.save();C.g.translate(Math.round(x),Math.round(y));C.g.scale(sc,sc);hero(P,0,0,t+i*.3,pose||'walk',{flip:fl,noShadow:1});C.g.restore()}
function zomS(i,x,y,t,sc,o){C.g.save();C.g.translate(Math.round(x),Math.round(y));C.g.scale(sc,sc);zombie(0,0,t,i,o);C.g.restore()}
function mod(a,n){return((a%n)+n)%n}
const X=(arr,i,fn,cam)=>{if(arr&&arr[i])arr[i].draw=C.shot(fn,cam)};
// ================= ПРОЛОГ (INTRO) =================
try{if(typeof INTRO!=='undefined'){
X(INTRO,0,function(t){C.officeExt(t,{});const k=clamp(t/1.6,0,1);putS(C.scooter(),330,312);hero('m',200+k*110,312,t,k<1?'walk':'stand');R(0,330,AW,30,'#2a2634')});
X(INTRO,1,function(t){C.sky('eve',t,{sx:540,sy:200});C.farCity(220,'#2e1648',{adm:420,seed:3});const off=t*70;C.facades(off,{seed:1,night:1,base:292});C.street(292,t,{night:1,dash:t*140});
  for(let i=0;i<5;i++){const x=mod(i*150-t*(40+i*6)*(i%2?1:-1)+t*70,AW+80)-40;ped(i,x,300,t,'walk',i%2===0)}
  for(let i=0;i<4;i++){const x=mod(i*220-t*180,AW+300)-150;putS(C.sedan(['#3a6ab8','#e8e8e8','#c84a4a','#ffd23a'][i],i===3?'taxi':'sedan'),x,350,true)}
  for(let x=mod(-off,200);x<AW;x+=200)C.lampSpb(x,292,true);scooterRide(250,334,t)});
X(INTRO,2,function(t){C.neva(t,{py:282});for(let x=mod(-t*90,160);x<AW;x+=160)C.lampSpb(x,282,true);scooterRide(260,282,t)},{y:160});
X(INTRO,3,function(t){C.sky('eve',t,{sx:120,sy:210});C.farCity(220,'#2e1648',{ix:520,seed:5});const off=t*70+600;C.facades(off,{seed:4,night:1,base:292});C.street(292,t,{night:1,dash:t*140});
  for(let k=0;k<8;k++)R(380+k*12,316,8,40,'#e8e8e0');for(let i=0;i<6;i++){const x=mod(i*130+t*30*(i%2?1:-1),AW+80)-40;ped(i+2,x,300,t,'walk',i%2)}
  for(let x=mod(-off,200);x<AW;x+=200)C.lampSpb(x,292,true);scooterRide(250,334,t);glow(560,250,40,'#ff4fd8',.2)});
X(INTRO,4,function(t){C.homeYard(t,{});const k=clamp(t/2.2,0,1),x=-40+ease(k)*300;if(k<1)scooterRide(x,320,t);else{putS(C.scooter(),260,320);hero('m',300,320,t,'stand',{flip:false})}});
}}catch(e){console.warn('cine intro',e)}
// ================= НОВОСТИ (пролог) =================
try{if(typeof NEWS!=='undefined'){
X(NEWS,0,function(t,s){PS(s,t);C.sky('fire',t,{});C.farCity(220,'#2a0a10',{fire:1,adm:440});C.facades(0,{seed:6,ruin:1,base:292});C.ruinFlicker(0,t,{seed:6,base:292});C.street(292,t,{ruin:1});
  C.fire(80,292,50,60,t,1);C.smoke(100,240,t,2,8);C.putS(C.sedan('#e8e8f0','police'),420,350);const bl=Math.sin(t*12)>0;glow(495,300,30,bl?'#ff2a3a':'#2a6aff',.5);
  for(let i=0;i<4;i++){const x=mod(600-t*(70+i*20)+i*90,AW+100)-50;ped(i,x,330,t,'run',true,.9)}for(let i=0;i<5;i++){const x=mod(680-t*40+i*60,AW+200)-60;zomS(i,x,334,t,.9,{flip:true,walk:1})}
  hero('r',140,330,t,'talk',{item:'mic'});drawPS(s)});
X(NEWS,1,function(t,s){PS(s,t);C.sky('fire',t,{});C.farCity(230,'#2a0a10',{fire:1,ix:420});C.facades(300,{seed:8,ruin:1,base:292});C.ruinFlicker(300,t,{seed:8,base:292});C.street(292,t,{ruin:1});
  C.putS(C.bus('#3a8a5a',1),40,330);C.fire(60,270,160,50,t,2);C.smoke(140,230,t,3,10);C.putS(C.sedan('#555','burnt'),330,345);C.fire(350,330,80,30,t,4);C.putS(C.sedan('#e8e8f0','police'),480,352,true);
  for(let i=0;i<8;i++){const x=mod(i*80+t*60,AW+100)-50;zomS(i+3,x,320+(i%3)*10,t,.85,{walk:1})}C.embers(t,0,100,AW,200,30)});
X(NEWS,2,function(t,s){PS(s,t);C.neva(t,{sky:'fire',broken:1,sx:120,sy:220,sun:false});const k=clamp((t-1.5)/2.2,0,1),cx=300,by=200;
  C.g.save();C.g.translate(cx+1,by-118);C.g.rotate(ease(k)*1.35);for(let y=0;y<132;y++){const w=y<80?4:y<115?3:2;R(-w/2,-y,w,1,y>125?'#fff0a0':'#e0ac2e')}R(-4,-140,9,1,'#ffd23a');C.g.restore();
  if(k>=1&&once(s,'boom')){SHAKE(1);burst(s,cx+130,by-10,40,['#ffd23a','#ff8a2a','#ffffff'],160,{glow:1});SFX('thump',.8)}
  if(k>.98)C.smoke(cx+120,by-10,t,9,8);C.fire(cx-200,by-26,30,20,t,5);C.fire(cx+150,by-26,40,24,t,6);drawPS(s)},{y:150});
X(NEWS,3,function(t){for(let y=0;y<AH;y+=2)for(let x=0;x<AW;x+=4){const v=hash(x+Math.floor(t*30)*7,y);R(x,y,4,2,v<.5?'#1a1a1a':v<.8?'#5a5a5a':'#c8c8c8')}const bars=['#e8e8e8','#e8e830','#30e8e8','#30e830','#e830e8','#e83030','#3030e8'];if(Math.sin(t*8)>.3)bars.forEach((c,i)=>{C.g.globalAlpha=.25;R(i*AW/7,0,AW/7,AH,c);C.g.globalAlpha=1})});
}}catch(e){console.warn('cine news',e)}
// ================= ГЛАВА 1 =================
const C1=window.C1&&window.C1.CUTS;
function ruinStreet(t,off,o){o=o||{};C.sky('fire',t,{});C.farCity(225,'#2a0a10',{fire:1,ix:o.ix||480});C.facades(off,{seed:o.seed||2,ruin:1,base:292});C.ruinFlicker(off,t,{seed:o.seed||2,base:292});C.street(292,t,{ruin:1,dash:o.dash||0});C.embers(t,0,80,AW,220,24)}
function roverDrive(t,x,y,col,o){o=o||{};const b=Math.round(Math.sin(t*22)*.6);putS(C.rover(col,o),x,y+b);if(o.heads)heads(x+(o.hx||74),y-48+b,o.heads);if(o.lightsOn!==false){cone(x+126,y-30,6,90,40,'#fff6c8',.0);C.g.save();C.g.globalCompositeOperation='lighter';const gr=C.g.createLinearGradient(x+126,0,x+260,0);gr.addColorStop(0,'rgba(255,246,200,.35)');gr.addColorStop(1,'rgba(255,246,200,0)');C.g.fillStyle=gr;C.g.beginPath();C.g.moveTo(x+126,y-32+b);C.g.lineTo(x+260,y-50+b);C.g.lineTo(x+260,y-6+b);C.g.fill();C.g.restore()}shadow(x+62,y,120)}
if(C1){
X(C1.CUT_CITY,0,function(t){ruinStreet(t,0,{seed:2});C.fire(470,292,40,40,t,3);C.smoke(490,250,t,4,8);putS(C.sedan('#555','burnt'),300,344);
  for(let i=0;i<6;i++){const x=mod(AW-t*(8+i)-i*70,AW+60);zomS(i,x,316+(i%3)*10,t,.85,{flip:true})}putS(C.scooter(),70,330);hero('s',96,322,t,'stand');hero('m',120,322,t,'stand')},{x:270});
X(C1.CUT_CITY,1,function(t){const sp=40+t*t*60;ruinStreet(t,t*sp,{seed:2,dash:t*sp*2});scooterRide(140+t*t*14,330,t,true);for(let i=0;i<4;i++){const x=mod(500-t*sp*1.3+i*130,AW+100)-50;zomS(i+6,x,318,t,.85,{flip:true})}});
X(C1.CUT_ANIS,0,function(t,s){PS(s,t);ruinStreet(t,900,{seed:3});
  const rx=t<1.6?AW+40:Math.max(250,AW+40-(t-1.6)*360);
  if(!s._z||t<.05)s._z=[0,1,2,3,4].map(i=>({x:330+i*48,y:320+(i%3)*8,fly:0,vy:0,vx:0,r:0}));
  for(const z of s._z){if(!z.fly&&rx<z.x+20&&t>1.6){z.fly=1;z.vy=-260;z.vx=-60-Math.random()*80;SHAKE(.4);burst(s,z.x,z.y-30,14,SLIME,160,{glow:0})}
    if(z.fly){const dt=1/60;z.vy+=600*dt;z.y+=z.vy*dt;z.x+=z.vx*dt;z.r+=.2;if(z.y<AH+80){C.g.save();C.g.translate(z.x,z.y);C.g.rotate(z.r);C.zombie(0,0,t,z.x|0,{noShadow:1});C.g.restore()}}else{z.x-=.3;zombie(z.x,z.y,t,(z.x|0)%9,{flip:true})}}
  putS(C.scooter(),70,330);hero('s',96,322,t,'stand');hero('m',120,322,t,'stand',{item:'pistol'});
  if(t>1.6)roverDrive(t,rx,340,'#141418',{black:1,lights:1,winch:1});if(t>1.6&&rx>250)SHAKE(.15);if(t>1.55&&once(s,'eng'))SFX('power',.5);drawPS(s)},{x:290});
X(C1.CUT_ANIS,1,function(t){ruinStreet(t,900,{seed:3});roverDrive(t,250,340,'#141418',{black:1,lights:1,winch:1});putS(C.scooter(),390,334);hero('a',230,330,t,'talk');hero('s',420,330,t,'stand',{flip:true});hero('m',450,330,t,'stand',{flip:true})});
X(C1.CUT_ANIS,2,function(t){ruinStreet(t,900+t*150,{seed:3,dash:t*300});roverDrive(t,240,340,'#141418',{black:1,lights:1,winch:1,heads:[[0,'#e2b08a','#1e1a18'],[-34,'#e8b898','#3d2b20'],[-62,'#f2cdb4','#2a1a16']],hx:94});
  for(let i=0;i<3;i++){const x=mod(600-t*260+i*220,AW+200)-100;zomS(i+9,x,326,t,.85,{flip:true})}});
X(C1.CUT_ANIS,3,function(t){C.officeExt(t,{night:1,ruin:1});const k=ease(clamp(t/2,0,1));roverDrive(t,-150+k*330,330,'#141418',{black:1,lights:1,winch:1});for(let i=0;i<3;i++)zomS(i,480+i*40,322,t,.8,{flip:true})});
X(C1.CUT_LIFT1,0,function(t){C.liftIn(t,{floor:1,up:1});hero('s',230,322,t,'stand');hero('m',290,322,t,'stand',{item:'bag',bagc:'#2a2a2a'});hero('a',400,322,t,'talk',{flip:true})});
X(C1.CUT_LIFT_DOWN,0,function(t){C.liftIn(t,{floor:5});hero('s',230,322,t,'talk');hero('m',290,322,t,'stand',{item:'bottle'});hero('a',400,322,t,'stand',{flip:true,item:'shotgun'})});
X(C1.CUT_OFF2,0,function(t){C.officeIn(t,{dark:1});for(let i=0;i<14;i++){const x=200+i*30+Math.sin(t*2+i)*3;zomS(i,x,300+(i%3)*14,t,.85,{flip:true})}hero('m',70,330,t,'stand',{item:'bag'});hero('a',120,330,t,'aim',{item:'shotgun'})});
function boss(x,y,t,o){o=o||{};const P={skin:'#c89070',hair:'#1a1a1a',style:'bald',top:'#2a2e3a',kind:'suit',shirt:'#e8e8e8',tie:'#8a0a18',pants:'#2a2e3a',shoes:'#0a0a0a',zombie:1,seed:3,fat:1,k:1.35,wide:1};hero(P,x,y,t,o.pose||'zombie',{flip:true,rot:o.rot})}
function glassOffice(t){C.officeIn(t,{dark:1,blood:1},{x:260});R(0,24,AW,220,'rgba(160,220,255,.05)');for(let x=60;x<AW;x+=150){R(x,40,2,230,'#8ac8e8');R(x+2,40,1,230,'#e8f8ff')}R(0,40,AW,2,'#8ac8e8');R(0,240,AW,2,'#8ac8e8')}
X(C1.CUT_DEATH,0,function(t,s){PS(s,t);glassOffice(t);if(t<1.6){boss(420,330,t);hero('a',320,330,t,'aim',{item:'shotgun'});hero('m',220,330,t,'stand',{item:'bag'})}
  else{if(once(s,'hit')){SHAKE(1.2);SFX('hurt');burst(s,350,280,40,BLOOD,180)}boss(380,330,t,{pose:'fist'});hero('a',330,330,t,'stand',{rot:-.25});hero('m',220,330,t,'stand');flash(Math.max(0,.5-(t-1.6)),'#ff0000')}drawPS(s)});
X(C1.CUT_DEATH,1,function(t,s){PS(s,t);glassOffice(t);hero('a',300,340,t,'stand',{rot:-Math.PI/2,noShadow:1});const k=clamp(t/.5,0,1);
  if(t>.5&&once(s,'b')){SHAKE(1);SFX('bat');burst(s,430,270,30,SLIME,200)}if(t<.8)boss(440,330,t);else boss(470,334,t,{rot:Math.PI/2});
  const mx=220+k*170;hero('m',mx,330,t,t<.5?'run':'fist');C.g.save();C.g.translate(mx+10,268);C.g.rotate(-1.4+k*2.4);R(0,-2,34,5,'#b07434');R(26,-3,10,7,'#8a5424');C.g.restore();drawPS(s)});
X(C1.CUT_DEATH,2,function(t){glassOffice(t);hero('a',300,330,t,'stand',{rot:-Math.PI/2,noShadow:1});burstStatic(300,330);hero('m',370,330,t,'sit',{flip:true});boss(520,334,t,{rot:Math.PI/2})});
function burstStatic(x,y){for(let i=0;i<20;i++)C.g.fillStyle=BLOOD[i%3],C.g.fillRect(x-40+hash(i,4)*80,y-3+hash(4,i)*6,3+hash(i,i)*5,2)}
X(C1.CUT_HOME,0,function(t){C.liftIn(t,{floor:1});hero('s',260,322,t,'talk');hero('m',320,322,t,'stand',{item:'shotgun',flip:true})});
X(C1.CUT_HOME,1,function(t){C.officeExt(t,{night:1,ruin:1});const k=ease(clamp((t-1)/3,0,1));roverDrive(t,180+k*520,330,'#141418',{black:1,lights:1,winch:1,heads:[[0,'#e8b898','#3d2b20'],[-34,'#f2cdb4','#2a1a16']],hx:94})});
X(C1.CUT_HOME,2,function(t){ruinStreet(t,t*160+300,{seed:7,dash:t*320});C.fire(120,292,60,60,t,1);C.smoke(150,240,t,2,8);roverDrive(t,260,340,'#141418',{black:1,lights:1,heads:[[0,'#e8b898','#3d2b20'],[-34,'#f2cdb4','#2a1a16']],hx:94})});
X(C1.CUT_HOME,3,function(t){C.isaac(t);roverDrive(t,mod(t*120,AW+300)-160,340,'#141418',{black:1,lights:1})});
X(C1.CUT_HOME,4,function(t){C.sky('fire',t,{});C.farCity(200,'#1a0608',{fire:1,ix:120});R(0,250,AW,110,'#0e0a1a');for(let y=252;y<AH;y+=3)for(let x=0;x<AW;x+=12)if(Math.sin(x*.05+t*1.6+y*.3)>.6)R(x,y,6,1,'#5a1a1a');
  for(let i=0;i<3;i++){const bx=60+i*220;R(bx,250,60,8,'#3a2a3a');C.g.save();C.g.translate(bx+60,250);C.g.rotate(.5+i*.1);R(0,0,50,8,'#3a2a3a');C.g.restore()}C.fire(200,252,40,20,t,7);
  C.g.save();C.g.translate(0,-10);C.bridge(t,{by:290});C.g.restore();roverDrive(t,mod(t*140,AW+300)-160,280,'#141418',{black:1,lights:1})});
X(C1.CUT_HOME,5,function(t){C.homeYard(t,{night:1});roverDrive(t,40,330,'#141418',{black:1,lights:1,lightsOn:false});hero('m',200,326,t,'stand',{item:'shotgun'});hero('s',230,326,t,'stand');hero('G',440,326,t,'talk',{flip:true});hero('H',480,326,t,'hips',{flip:true})},{x:300});
}
// ================= ГЛАВА 2 =================
const C2=window.C2&&window.C2.CUTS;
if(C2){
X(C2.CUT_DEPART,0,function(t){C.homeYard(t,{fort:1,gate:470,tur:[90,300,600]});const k=ease(clamp((t-1)/4,0,1));roverDrive(t,120+k*420,340,'#b82024',{turret:1,winch:1,heads:[[0,'#f2cdb4','#2a1a16']],hx:94});hero('H',80,334,t,'point');hero('G',40,334,t,'stand')},{x:300});
X(C2.CUT_DEPART,1,function(t){ruinStreet(t,t*170+1400,{seed:9,dash:t*340});roverDrive(t,240,340,'#b82024',{turret:1,winch:1,heads:[[0,'#f2cdb4','#2a1a16']],hx:94});for(let i=0;i<3;i++)zomS(i+2,mod(700-t*300+i*240,AW+200)-100,322,t,.85,{flip:true})});
X(C2.CUT_MALL,0,function(t){C.mallExt(t);const k=ease(clamp(t/2.5,0,1));roverDrive(t,-150+k*330,346,'#b82024',{turret:1,winch:1});if(t>2.6)hero('s',330,346,t,'talk')});
X(C2.CUT_MALL,1,function(t){C.mallExt(t);roverDrive(t,180,346,'#b82024',{turret:1,winch:1,lightsOn:false});hero('s',340,346,t,'talk',{item:'shotgun'})});
X(C2.CUT_LIFT_GYM,0,function(t){C.liftIn(t,{floor:3,up:1});hero('s',300,322,t,'talk');hero('s',300,322,t,'stand',{item:'shotgun'})});
X(C2.CUT_FOOD,0,function(t){C.locker(t);R(272,113,52,174,'#1a1a22');R(276,120,44,6,'#c8c8d0');R(282,180,32,40,'#ffffff');R(282,180,32,8,'#ff5aa8');txt('КОТ',288,192,'#1a1a22',1);txt('ПРОТЕИН',284,200,'#1a1a22',1);glow(298,200,40,'#9aff7a',.25);hero('s',380,330,t,'talk',{flip:true})});
X(C2.CUT_LIFT_DOWN2,0,function(t){C.liftIn(t,{floor:1});hero('s',300,322,t,'talk',{bagBack:'#ff5aa8'})});
X(C2.CUT_HOME2,0,function(t){ruinStreet(t,t*170+2400,{seed:10,dash:t*340});roverDrive(t,240,340,'#b82024',{turret:1,winch:1,heads:[[0,'#f2cdb4','#2a1a16']],hx:94})});
X(C2.CUT_HOME2,1,function(t){C.homeYard(t,{night:1,fort:1,gate:330});const k=ease(clamp(t/2,0,1));roverDrive(t,-150+k*230,350,'#b82024',{turret:1,winch:1})});
X(C2.CUT_HOME2,2,function(t){C.homeYard(t,{night:1,fort:1,gate:330});roverDrive(t,40,350,'#b82024',{turret:1,winch:1,lightsOn:false});hero('s',210,340,t,'talk');hero('H',420,340,t,'point',{flip:true});hero('G',470,340,t,'stand',{flip:true})},{x:300});
}
// ================= ГЛАВА 3 =================
const C3=window.C3&&window.C3.CUTS;
function catGrow(t,s,col,buffKey,p,x,y){// p 0..1: кот растёт, потом становится качком
  const glc=col==='w'?'#7ab4ff':'#7aff7a';glow(x,y-40,70+p*60,glc,.3+Math.sin(t*20)*.12);
  if(p<.55){cat(col,x,y,t,'stand',{sc:1+p*2.4+Math.sin(t*30)*.06})}else{const k=Math.min(1,(p-.55)*2.2);C.g.save();C.g.translate(x,y);C.g.scale(.7+k*.5,.7+k*.5);hero(buffKey,0,0,t,'fist',{noShadow:1});C.g.restore()}
  if(p>.55&&once(s,'boom')){SHAKE(1);SFX('power',.8);SFX('thump',1);burst(s,x,y-50,50,col==='w'?['#9ad8ff','#ffffff']:['#9aff7a','#e8ff9a'],220,{glow:1})}}
if(C3){
X(C3.CUT_TRANSFORM,0,function(t){C.kitchen(t);F.bowl(300,320,1);cat('c',290,320,t,'eat');hero('s',470,326,t,t>2.4?'talk':'stand',{flip:true});if(t>2.2)glow(290,300,40+Math.sin(t*12)*6,'#7aff7a',(t-2.2)*.25)});
X(C3.CUT_TRANSFORM,1,function(t,s){PS(s,t);C.kitchen(t);const p=clamp((t-.3)/3.2,0,1);catGrow(t,s,'c','C',p,290,322);hero('s',470,326,t,'stand',{flip:true});hero('m',520,326,t,t>2.7?'shrug':'stand',{flip:true});if(t<4&&Math.random()<.3)SHAKE(.25);drawPS(s)});
X(C3.CUT_TRANSFORM,2,function(t){C.kitchen(t);hero('C',300,326,t,'fist');hero('s',440,326,t,'talk',{flip:true});hero('m',490,326,t,'stand',{flip:true})});
X(C3.CUT_NEWS3,0,function(t){for(let y=0;y<AH;y+=2)for(let x=0;x<AW;x+=4){const v=hash(x+Math.floor(t*30)*7,y);R(x,y,4,2,v<.5?'#101010':v<.8?'#4a4a4a':'#a8a8a8')}});
X(C3.CUT_NEWS3,1,function(t){C.newsStudio(t,{key:'n31',head:'ВИРУС ПОШЁЛ ОТ МЫШЕЙ',inset:tt=>{C.cellarDoor(tt);for(let i=0;i<8;i++)rat(100+i*60+Math.sin(tt*3+i)*10,330,tt+i,{flip:i%2})}})});
X(C3.CUT_NEWS3,2,function(t){C.newsStudio(t,{key:'n32',head:'КРЫСИНЫЙ КОРОЛЬ',inset:tt=>{C.throne(tt);rat(320,200,tt,{big:1,crown:'k'})}})});
X(C3.CUT_DOWN,0,function(t){C.cellarDoor(t);hero('D',220,330,t,'talk',{item:'keys'});hero('C',420,330,t,'cross',{flip:true})});
X(C3.CUT_OUT,0,function(t){C.sewerExit(t);const k=clamp(t/5,0,1);cat('c',200+k*170,300,t,'walk')});
X(C3.CUT_OUT,1,function(t){C.sky('day',t,{});C.farCity(230,'#5a6a9a',{seed:3,isaak:false});C.grass(230,AH,'#3a8a3a','#7ad84a',7);for(let i=0;i<12;i++)F.flowers(30+i*55,300+(i%3)*14,t);cat('c',320,316,t,'sit');
  for(let i=0;i<3;i++){const x=300+Math.sin(t*.8+i*2)*80,y=240+Math.cos(t*1.3+i)*20,f=Math.sin(t*20+i)>0;R(x,y,2,2,'#ffd23a');if(f){R(x-3,y-2,3,2,'#ffffff');R(x+2,y-2,3,2,'#ffffff')}}glow(320,60,200,'#fff8d8',.3)});
X(C3.CUT_RESTORE,0,function(t){C.newsStudio(t,{key:'r30',tag:'ХОРОШИЕ НОВОСТИ',head:'РАЙОН ОЧИЩЕН',inset:tt=>{C.sky('day',tt,{});C.facades(tt*30,{seed:12,base:300});C.street(300,tt,{});for(let i=0;i<6;i++)ped(i,mod(i*110+tt*30,AW),330,tt,'walk');for(let i=0;i<10;i++)rat(mod(i*70-tt*120,AW),350,tt+i,{flip:true})}})});
X(C3.CUT_RESTORE,1,function(t){C.sky('day',t,{});C.farCity(220,'#6a7ab8',{seed:3,adm:400});C.facades(t*20,{seed:12,base:292});C.street(292,t,{dash:0});for(let i=0;i<8;i++){const x=mod(i*90+t*(20+i*4)*(i%2?1:-1),AW+80)-40;ped(i,x,300+(i%2)*14,t,'walk',i%2)}
  for(let x=60;x<AW;x+=200)C.lampSpb(x,292,false);glow(500,60,160,'#fff8d8',.25)});
X(C3.CUT_RESTORE,2,function(t){C.sky('night',t,{mx:120});C.farCity(250,'#140c26',{seed:7,isaak:false});C.brickTower(120,330,400,300,t,{night:1});const on=Math.sin(t*3)>-.5;R(330,206,10,16,'#7aff7a');glow(335,214,40,'#7aff7a',on?.5:.25)});
}
// ================= ГЛАВА 4 =================
const C4=window.C4&&window.C4.CUTS;
function balcony(t){C.sky('night',t,{mx:540,my:50});C.g.drawImage(C.layer('balc',AW,AH,()=>{const B='#6a2a2a';R(0,40,AW,320,B);for(let y=40;y<AH;y+=3){R(0,y,AW,1,drk(B,.12));for(let k=(y/3)%2?0:5;k<AW;k+=10)R(k,y,1,3,drk(B,.18))}
    for(const [x,y] of [[60,70],[460,70],[60,230],[460,230]]){R(x,y,100,80,'#e8d8c8');R(x+4,y+4,92,72,'#1a1020');R(x+48,y+4,4,72,'#e8d8c8')}}),0,0);
  // окно Ханжи справа снизу (горит)
  R(464,234,92,72,'#ffe0a0');glow(510,270,60,'#ffd88a',.3);
  // балкон Егора по центру
  R(200,110,240,120,'#1a1020');R(200,110,240,4,'#3a2a3a');R(180,226,280,8,'#5a4a5a');for(let x=184;x<456;x+=10)R(x,186,2,40,'#2a2a34');R(180,184,280,3,'#2a2a34');
  for(let i=0;i<14;i++){const x=200+i*17,c=['#ff4fd8','#3affd8','#ffe23a','#7a5aff'][i%4],on=Math.sin(t*6+i)>0;R(x,116+Math.sin(i)*3,4,4,on?c:drk(c,.5));if(on)glow(x+2,118,10,c,.4)}
  F.speaker(410,226,50,t);glow(320,170,140,'#ff4fd8',.18);for(let i=0;i<4;i++){const a=Math.sin(t*2+i)*.6+1.6;C.g.save();C.g.globalCompositeOperation='lighter';C.g.strokeStyle=['#ff4fd8','#3affd8','#ffe23a','#7a5aff'][i];C.g.globalAlpha=.4;C.g.beginPath();C.g.moveTo(320,120);C.g.lineTo(320+Math.cos(a)*400,120+Math.sin(a)*-400);C.g.stroke();C.g.restore()}}
if(C4){
X(C4.CUT_PARTY,0,function(t,s){PS(s,t);balcony(t);hero('e',300,226,t,'talk',{item:'mic'});hero('mg',350,226,t,'raise',{noShadow:1});if(once(s,'th'))SFX('thump',.6);
  for(let i=0;i<5;i++){const k=(t*.6+i/5)%1;txt('♪',330+Math.sin(i+t)*60,180-k*120,'#ffffff',2)}drawPS(s)},{y:190});
X(C4.CUT_PARTY,1,function(t){balcony(t);hero('e',300,226,t,'point',{item:'mic'});C.g.save();C.g.beginPath();C.g.rect(464,234,92,72);C.g.clip();hero('H',520,340,t,'fist',{flip:true,noShadow:1});C.g.restore()},{x:380,y:200});
X(C4.CUT_FEED,0,function(t){C.kitchen(t,{wall:'#7a3a8a'});F.bowl(300,320,1);cat('w',290,320,t,'eat');hero('e',160,326,t,'talk');hero('s',470,326,t,'stand',{flip:true});if(t>3.6)glow(290,300,40+Math.sin(t*12)*6,'#7ab4ff',(t-3.6)*.3)},{x:310});
X(C4.CUT_FEED,1,function(t,s){PS(s,t);C.kitchen(t,{wall:'#7a3a8a'});const p=clamp((t-.3)/3.2,0,1);catGrow(t,s,'w','M',p,290,322);hero('e',160,326,t,t>2.7?'shrug':'stand');hero('s',470,326,t,'stand',{flip:true});if(t<4&&Math.random()<.3)SHAKE(.25);drawPS(s)},{x:320});
X(C4.CUT_FEED,2,function(t){C.kitchen(t,{wall:'#7a3a8a'});hero('M',300,326,t,'fist');cat('c',380,326,t,'sit',{flip:true});hero('e',160,326,t,'talk');hero('m',470,326,t,'stand',{flip:true});hero('s',510,326,t,'stand',{flip:true})},{x:330});
X(C4.CUT_FEED,3,function(t){C.kitchen(t,{wall:'#7a3a8a'});hero('C',260,326,t,'fist');hero('M',320,326,t,'cross');hero('e',160,326,t,'talk');hero('m',470,326,t,'stand',{flip:true});hero('s',510,326,t,'stand',{flip:true})},{x:330});
X(C4.CUT_GO,0,function(t){C.sky('night',t,{mx:120,my:60});C.farCity(230,'#2a0a1a',{fire:0,ix:480,adm:360});for(let i=0;i<6;i++)C.fire(380+i*40,232,20,30,t,i);C.smoke(450,210,t,3,8);
  R(0,250,AW,110,'#0e0a1a');for(let y=252;y<AH;y+=3)for(let x=0;x<AW;x+=12)if(Math.sin(x*.05+t*1.6+y*.3)>.6)R(x,y,6,1,'#3a1a5a');C.g.save();C.g.translate(0,-10);C.bridge(t,{by:290});C.g.restore();
  const k=t/6;hero('C',100+k*360,280,t,'run',{noShadow:1});hero('M',60+k*360,280,t,'run',{noShadow:1})});
X(C4.CUT_WIN,0,function(t){C.newsStudio(t,{key:'w40',tag:'ХОРОШИЕ НОВОСТИ',head:'«БАРДАК» НА ДУМСКОЙ ЗАТИХ',inset:tt=>{C.clubExt(tt,{door:1});hero('C',260,330,tt,'walk');hero('M',360,330,tt,'walk')}})});
X(C4.CUT_WIN,1,function(t){C.newsStudio(t,{key:'w41',tag:'КАРТА ЗАРАЖЕНИЯ',head:'НЕВСКИЙ И ДУМСКАЯ ЧИСТЫ',map:(x,y,w,h,tt)=>C.infMap(x,y,w,h,tt,['НЕВСКИЙ','ДУМСКАЯ','КОЛОМЯГИ'])})});
X(C4.CUT_FINAL,0,function(t){C.living(t,{tv:1});hero('e',200,330,t,'raise',{item:'speaker'});hero('s',280,330,t,'talk');hero('m',330,330,t,'stand');hero('C',420,330,t,'fist',{flip:true});hero('M',480,330,t,'cross',{flip:true})});
}
// ================= ГЛАВА 5 =================
const C5=window.C5&&window.C5.CUTS;
function backHeads(t){// затылки в кабине: Валера (наушники) и Шмакодявка
  R(200,270,60,70,'#2a3a2a');E2(230,262,22,26,'#3a2a1a');R(206,250,8,20,'#1a1a22');R(246,250,8,20,'#1a1a22');R(208,238,44,4,'#1a1a22');
  R(380,270,60,70,'#ff6fb5');E2(410,262,22,26,'#2a1a16');R(390,262,40,40,'#2a1a16')}
function E2(x,y,rx,ry,c){M2().use(C.g,()=>M2().E(x,y,rx,ry,c))}function M2(){return window.MART}
if(C5){
X(C5.CUT_CS,0,function(t){C.pcRoom(t);hero('val',300,300,t,'sit',{flip:true});R(470,90,130,90,'#1a1a22');R(474,94,122,82,'#ff6fb5');hero('s',540,190,t,'talk',{noShadow:1,phone:1});txt('ВИДЕОЗВОНОК',476,170,'#ffffff',1)},{x:400,y:200});
X(C5.CUT_CS,1,function(t){C.pcRoom(t);hero('val',300,300,t,'sit',{flip:true});R(470,90,130,90,'#1a1a22');R(474,94,122,82,'#ff6fb5');hero('s',540,190,t,'talk',{noShadow:1})},{x:400,y:200});
X(C5.CUT_VASKA,0,function(t){C.homeYard(t,{fort:1,gate:470});hero('H',260,334,t,'point');hero('s',330,334,t,'talk',{flip:true,item:'case'})});
X(C5.CUT_VASKA,1,function(t){C.seaDock(t);const b=Math.sin(t*2)*1.5;putS(C.seaplane(),320,262+b);hero('val',440,236+b,t,'wave',{noShadow:1});const k=clamp(t/3,0,1);hero('s',60+k*220,226,t,k<1?'walk':'stand',{item:'case'})},{y:200});
X(C5.CUT_FLY,0,function(t){C.cockpit(t,tt=>C.flyClouds(tt,{}));backHeads(t)});
X(C5.CUT_FLY,1,function(t){C.flyLand(t,{kind:'europe',plane:1,sp:40,py:190})});
X(C5.CUT_FLY,2,function(t){C.cockpit(t,tt=>C.flyLand(tt,{kind:'pisa',sp:24}));backHeads(t)});
X(C5.CUT_FLY,3,function(t){C.flyLand(t,{kind:'colos',plane:1,sp:30,py:170});for(let i=0;i<80;i++){const x=mod(380-t*18+hash(i,3)*200-100,AW+260)-130,y=214+hash(3,i)*20;P(x,y,'#3a5a2a')}});
X(C5.CUT_FLY,4,function(t){C.beach(t);const k=ease(clamp(t/3,0,1));putS(C.seaplane(),260,190-(1-k)*120);for(let i=0;i<12;i++)zomS(i,40+i*48+Math.sin(t+i)*4,280+(i%3)*24,t,.85,{flip:i%2})},{y:220});
X(C5.CUT_TAKEOFF,0,function(t){C.beach(t);putS(C.seaplane(),260,196+Math.sin(t*2)*1.5);putS(C.cabrio(),40,320);hero('ol',220,300,t,'talk',{flip:true});hero('s',260,300,t,'stand');hero('val',370,180,t,'wave',{noShadow:1});for(let i=0;i<6;i++)zomS(i,460+i*30,300+(i%2)*20,t,.85,{flip:true})},{x:300,y:230});
X(C5.CUT_HOME5,0,function(t){C.flyClouds(t,{sky:'eve'});putS(C.seaplane(),200,170+Math.sin(t*2)*4)},{y:180});
X(C5.CUT_HOME5,1,function(t){C.seaDock(t);const k=ease(clamp(t/4,0,1));putS(C.seaplane(),500-k*200,140+k*124+Math.sin(t*3)*2*(1-k));if(k>.95)for(let i=0;i<6;i++)R(300+i*20+Math.sin(t*8+i)*4,264,8,2,'#ffffff')},{y:200});
X(C5.CUT_HOME5,2,function(t){C.newsStudio(t,{key:'h52',head:'ЗАРАЖЁННЫЕ УХОДЯТ В ОБЛАСТЬ',map:(x,y,w,h,tt)=>C.infMap(x,y,w,h,tt,['НЕВСКИЙ','ДУМСКАЯ','КОЛОМЯГИ','ПЕТРОГРАДКА','ВАСЬКА'])})});
X(C5.CUT_HOME5,3,function(t){C.homeYard(t,{fort:1,gate:470});hero('s',220,334,t,'walk');hero('ol',260,334,t,'walk',{item:'case'});hero('val',300,334,t,'walk')});
X(C5.CUT_HOME5,4,function(t){C.living(t,{tv:1});hero('s',200,330,t,'raise');hero('ol',250,330,t,'talk');hero('m',340,330,t,'stand',{flip:true});hero('e',400,330,t,'talk',{flip:true,item:'speaker'});cat('c',150,300,t,'sit');hero('val',460,330,t,'stand',{flip:true})});
}
// ================= ГЛАВА 6 =================
const C6=window.C6&&window.C6.CUTS;
if(C6){
X(C6.CUT_X6,0,function(t){C.homeYard(t,{fort:1,gate:560});putS(C.carX6(),120,346);shadow(200,346,150);hero('vd',300,334,t,'talk');hero('H',360,334,t,'fist',{flip:true});hero('m',410,334,t,'stand',{flip:true})},{x:300});
X(C6.CUT_X6,1,function(t){C.homeYard(t,{fort:1,gate:560});putS(C.carX6(),120,346);shadow(200,346,150);hero('vd',300,334,t,'cross');hero('m',350,334,t,'stand',{flip:true});hero('st',420,334,t,'talk',{flip:true,item:'box'})},{x:300});
// заправка (из пилота) — улучшенные позы
const GAS=C6.CUT_GAS;if(GAS&&window.C6){const gs=window.__cineGas;// cine6.js мог уже переопределить — заменяем на общий вариант
}
X(C6.CUT_END6,0,function(t){C.farm(t,{});C.leshy(200,330,t,1);hero('pa',380,330,t,'talk',{flip:true});hero('ma',430,330,t,'talk',{flip:true});hero('m',320,330,t,'stand',{item:'chainsaw'})});
X(C6.CUT_END6,1,function(t){C.farm(t,{});putS(C.carPick(false),40,340);shadow(118,340,150);hero('dr',230,334,t,'wave');hero('st',330,334,t,'drink',{item:'beer',flip:true});hero('vd',380,334,t,'cross',{flip:true})},{x:260});
X(C6.CUT_END6,2,function(t){C.newsStudio(t,{key:'e62',tag:'НОВОСТИ ЛЕНОБЛАСТИ',head:'ЗАБОРЫ, ТУРЕЛИ И ПВО',inset:tt=>{C.farm(tt,{fence:1})}})});
X(C6.CUT_END6,3,function(t){C.farm(t,{fence:1});hero('pa',300,330,t,'talk');hero('ma',350,330,t,'stand');hero('m',430,330,t,'stand',{flip:true})});
X(C6.CUT_END6,4,function(t){C.living(t,{tv:1});hero('s',200,330,t,'raise');hero('m',260,330,t,'talk');hero('vd',380,330,t,'stand',{flip:true,item:'turka'});hero('st',440,330,t,'hold',{flip:true,item:'beer'})});
}
// ================= ГЛАВА 7 =================
const C7=window.C7&&window.C7.CUTS;
function nightStreet(t,off){C.sky('night',t,{mx:520,my:56});C.farCity(230,'#140c26',{seed:7,isaak:false});C.facades(off||500,{seed:15,night:1,base:292});C.street(292,t,{night:1});for(let x=60;x<AW;x+=220)C.lampSpb(x,292,true)}
if(C7){
X(C7.CUT_RIDE7,0,function(t){nightStreet(t);putS(C.sedan('#2a2a3a'),60,346);hero('ska',300,334,t,'talk',{flip:true});hero('du',360,334,t,'stand',{flip:true,item:'bag'});hero('mg',410,334,t,'shrug',{flip:true})},{x:300});
X(C7.CUT_RIDE7,1,function(t){nightStreet(t,900);const k=clamp(t/1.4,0,1);if(k<1)hero('ska',300+k*240,334,t,'walk');R(560,150,80,142,'#1a1020');for(let i=0;i<10;i++){const kk=((t*.4+i/10)%1);C.g.fillStyle='rgba(210,210,220,'+(.4*(1-kk))+')';C.g.fillRect(Math.round(560+Math.sin(t*2+i)*6),Math.round(200-kk*120),3+kk*6,3+kk*6)}hero('du',160,334,t,'stand');hero('mg',200,334,t,'stand')},{x:360});
X(C7.CUT_RIDE7,2,function(t){C.clubExt(t,{});hero('du',160,330,t,'talk',{item:'bag'});hero('mg',210,330,t,'stand',{item:'case'})},{x:260});
X(C7.CUT_RIDE7,3,function(t){C.clubExt(t,{});hero('pw',350,330,t,'hips',{flip:true});hero('du',220,330,t,'talk');hero('mg',270,330,t,'stand')});
X(C7.CUT_RIDE7,4,function(t){const k=clamp(t/1.6,0,1);C.clubExt(t,{door:ease(k)});hero('pw',400,330,t,'stand',{flip:true});hero('du',260,330,t,'walk');hero('mg',300,330,t,'walk');if(Math.sin(t*16)>0)SHAKE(.05)});
X(C7.CUT_END7,0,function(t){C.clubIn(t);hero('lx',320,330,t,'raise');hero('du',220,330,t,'talk');hero('mg',260,330,t,'stand')});
X(C7.CUT_END7,1,function(t){C.clubIn(t);hero('lx',330,330,t,'talk',{item:'uzi',flip:true});hero('du',240,330,t,'stand');hero('mg',280,330,t,'hold',{item:'uzi'})});
X(C7.CUT_END7,2,function(t){C.clubIn(t);hero('bm',120,330,t,'talk');hero('ak',300,330,t,'talk');hero('pw',380,330,t,'hips',{flip:true});hero('du',450,330,t,'stand',{flip:true});hero('mg',490,330,t,'stand',{flip:true})},{x:300});
X(C7.CUT_END7,3,function(t){C.clubExt(t,{});hero('ska',420,330,t,'wave',{flip:true});for(let i=0;i<5;i++){const kk=((t*.5+i/5)%1);C.g.fillStyle='rgba(210,210,220,'+(.4*(1-kk))+')';C.g.fillRect(Math.round(440+Math.sin(t*2+i)*4),Math.round(260-kk*40),3,3)}hero('du',230,330,t,'cross');hero('mg',280,330,t,'stand')});
X(C7.CUT_END7,4,function(t){C.newsStudio(t,{key:'e74',tag:'ХОРОШИЕ НОВОСТИ',head:'ЮГ ПЕТЕРБУРГА СВОБОДЕН',inset:tt=>{C.clubExt(tt,{door:1});hero('du',260,330,tt,'raise');hero('mg',320,330,tt,'raise')}})});
}
// ================= ГЛАВА 8 =================
const C8=window.C8&&window.C8.CUTS;
if(C8){
X(C8.CUT_RUNWAY,0,function(t){C.homeYard(t,{runway:1});putS(C.jet(),380,300);hero('H',140,300,t,'talk',{item:'keys'});hero('s',220,300,t,'stand',{flip:true});hero('m',260,300,t,'stand',{flip:true})},{x:300,y:210});
X(C8.CUT_RUNWAY,1,function(t,s){PS(s,t);C.homeYard(t,{runway:1});const k=clamp(t/4,0,1),x=200+k*k*700,y=300-Math.max(0,k-.5)*2*120;C.g.save();C.g.translate(x,y);C.g.rotate(-Math.max(0,k-.5)*.4);putS(C.jet(),0,0);C.g.restore();glow(x-58,y,30,'#ff8a3a',.6);
  for(let i=0;i<4;i++)C.g.fillStyle='rgba(200,200,210,.3)',C.g.fillRect(x-80-i*30,y-4+Math.sin(t*20+i)*3,26,6);hero('H',100,310,t,'wave');SHAKE(.1)},{y:210});
X(C8.CUT_RUNWAY,2,function(t){C.flyClouds(t,{sky:'eve'});C.g.save();C.g.translate(300,170+Math.sin(t*1.5)*6);C.g.rotate(-.05);putS(C.jet(),0,0);C.g.restore();glow(242,170,24,'#ff8a3a',.6)},{y:180});
X(C8.CUT_MEET,0,function(t){C.airport(t);putS(C.jet(),420,290);hero('vel',230,334,t,'talk');hero('sat',270,334,t,'wave');hero('s',350,334,t,'stand',{flip:true});hero('m',390,334,t,'stand',{flip:true})});
X(C8.CUT_MEET,1,function(t){C.airport(t);putS(C.jet(),420,290);hero('vel',230,334,t,'talk',{item:'phone'});hero('sat',270,334,t,'stand');hero('s',350,334,t,'stand',{flip:true});hero('m',390,334,t,'shrug',{flip:true})});
X(C8.CUT_MEET,2,function(t){C.airport(t);const k=ease(clamp(t/2,0,1));putS(C.sedan('#141418','polo'),-140+k*340,346);shadow(266,346,130);hero('vel',420,334,t,'point',{flip:true});hero('sat',470,334,t,'stand',{flip:true})});
X(C8.CUT_GATE,0,function(t){C.arenaGate(t);putS(C.sedan('#141418','polo'),40,346);hero('sat',250,334,t,'talk');hero('s',330,334,t,'stand',{flip:true,item:'shotgun'});hero('m',370,334,t,'stand',{flip:true});hero('vel',430,334,t,'stand',{flip:true})},{x:300});
X(C8.CUT_END8,0,function(t){C.arenaGate(t);hero('vel',220,334,t,'talk');hero('sat',270,334,t,'hold',{item:'rpg'});hero('s',350,334,t,'raise',{flip:true});hero('m',400,334,t,'stand',{flip:true})});
X(C8.CUT_END8,1,function(t){C.newsStudio(t,{key:'e81',tag:'НОВОСТИ УРАЛА',head:'ЕКАТЕРИНБУРГ СВОБОДЕН',inset:tt=>{C.arenaGate(tt);hero('s',300,330,tt,'hold',{item:'rpg'})}})});
X(C8.CUT_END8,2,function(t){C.airport(t,{night:0});putS(C.jet(),420,290);hero('sat',230,334,t,'talk');hero('vel',270,334,t,'stand');hero('m',350,334,t,'stand',{flip:true});hero('s',390,334,t,'raise',{flip:true})});
X(C8.CUT_END8,3,function(t){C.flyClouds(t,{sky:'eve'});C.g.save();C.g.translate(340,170+Math.sin(t*1.5)*6);C.g.scale(-1,1);putS(C.jet(),0,0);C.g.restore();glow(398,170,24,'#ff8a3a',.6)},{y:180});
}
// ================= ГЛАВА 9 =================
const C9=window.C9&&window.C9.CUTS;
if(C9){
X(C9.CUT_ALARM,0,function(t){C.living(t,{night:1});hero('m',160,330,t,'phone',{item:'phone'});hero('s',200,330,t,'stand');hero('e',270,330,t,'stand');hero('val',320,330,t,'stand');hero('st',370,330,t,'stand',{flip:true});hero('vel',420,330,t,'talk',{flip:true});if(Math.sin(t*5)>0)glow(320,40,300,'#ff2a3a',.15)},{x:290});
X(C9.CUT_ALARM,1,function(t){C.wasteland(t,{})});
X(C9.CUT_YARD,0,function(t){C.homeYard(t,{night:1,fort:1,gate:330});hero('H',120,340,t,'point',{item:'pistol'});hero('e',200,340,t,'stand',{item:'speaker'});hero('M',250,340,t,'fist');hero('val',350,340,t,'talk');hero('ol',420,340,t,'stand',{item:'syringe'});hero('G',490,340,t,'stand',{flip:true})},{x:300});
X(C9.CUT_GATLING,0,function(t){C.homeYard(t,{night:1,fort:1,gate:330});hero('H',180,340,t,t<2.4?'point':'stand');const k=clamp((t-1.5)/1.5,0,1);R(300,316,60,24,'#5a4a32');R(300,316,60,4,'#7a6a4a');R(300+k*10,312-k*30,60,6,'#6a5a3a');
  hero('G',300,340,t,k>0?'gun':'stand',{flip:true,item:k>0?'rifle':null});if(k>0){const gx=268,gy=286-k*10;R(gx-30,gy,40,8,'#2a2a30');for(let i=0;i<4;i++)R(gx-50,gy+1+i*2,24,1,'#1a1a1e');glow(gx-30,gy+4,20,'#ffd23a',.2*k)}});
X(C9.CUT_DAWN,0,function(t,s){PS(s,t);const dead=t>3.1;C.wasteland(t,{dawn:1,dead,horde:true,n:3});if(dead&&once(s,'shot')){SHAKE(.5);SFX('thump',.6);burst(s,440,170,30,BLOOD,160)}if(t>3&&t<3.15)flash(.5);drawPS(s)});
X(C9.CUT_DAWN,1,function(t){C.homeYard(t,{dawn:1,fort:1,gate:330});hero('kt',380,340,t,'talk',{item:'awp',flip:true});hero('s',300,340,t,'raise')});
X(C9.CUT_DAWN,2,function(t){C.newsStudio(t,{key:'d92',head:'ГНЕЗДО ПОД ПЕТРОПАВЛОВКОЙ',inset:tt=>{C.neva(tt,{sky:'night',broken:1});glow(300,180,90,'#5aff7a',.4)}})});
X(C9.CUT_DAWN,3,function(t){C.homeYard(t,{dawn:1,fort:1,gate:330});hero('m',260,340,t,'talk',{item:'shotgun'});hero('s',310,340,t,'stand',{flip:true});cat('c',360,340,t,'sit',{flip:true});hero('kt',420,340,t,'stand',{flip:true,item:'awp'})});
}
// ================= ГЛАВА 10 =================
const C10=window.C10&&window.C10.CUTS;
function jumpScene(t){C.sky('dawn',t,{sx:520,sy:170});const by=230;C.g.drawImage(C.layer('jumpbg',AW,AH,()=>{C.farCity(by-10,'#4a3a6a',{seed:13,isaak:false});const cx=520;R(cx-90,by-30,180,20,'#5a4a6a');for(let x=cx-90;x<cx+90;x+=10)R(x,by-34,6,4,'#5a4a6a');R(cx-14,by-70,30,40,'#6a5868');R(cx-3,by-96,8,26,'#8a7a58');R(cx,by-100,2,6,'#3a2a2a')}),0,0);
  R(0,by,AW,AH-by,'#3a3a7a');for(let y=by+2;y<AH;y+=3)for(let x=0;x<AW;x+=12)if(Math.sin(x*.05+t*1.6+y*.3)>.55)R(x,y,6,1,'#6a6aaa');C.bridge(t,{by:by+40,open:1,ang:.75})}
if(C10){
X(C10.CUT_GO,0,function(t){C.homeYard(t,{fort:1,gate:560});roverDrive(t,40,346,'#b82024',{turret:1,winch:1,lightsOn:false});hero('H',220,340,t,'point');hero('G',260,340,t,'talk',{item:'box'});hero('e',320,340,t,'stand',{item:'speaker'});hero('m',390,340,t,'stand',{flip:true,item:'shotgun'});hero('s',430,340,t,'stand',{flip:true});cat('c',460,340,t,'sit',{flip:true})},{x:300});
X(C10.CUT_GO,1,function(t){C.homeYard(t,{fort:1,gate:560});const k=ease(clamp(t/3.5,0,1));roverDrive(t,40+k*600,346,'#b82024',{turret:1,winch:1,heads:[[0,'#e8b898','#3d2b20'],[-34,'#f2cdb4','#2a1a16']],hx:94});for(const [w,x] of [['H',120],['G',160],['e',200],['val',240],['ol',280],['vel',320]])hero(w,x,334,t,'wave',{ph:x*.01})},{x:320});
X(C10.CUT_JUMP,0,function(t){jumpScene(t);roverDrive(t,40,270,'#b82024',{turret:1,winch:1,heads:[[0,'#e8b898','#3d2b20'],[-34,'#f2cdb4','#2a1a16']],hx:94})},{x:240,y:200});
X(C10.CUT_JUMP,1,function(t,s){PS(s,t);jumpScene(t);const k=clamp(t/4,0,1),x=40+k*560,air=clamp((x-130)/300,0,1),y=270-Math.sin(air*Math.PI)*90;
  C.g.save();C.g.translate(x+62,y-20);C.g.rotate(air>0&&air<1?-.2+air*.4:0);C.g.translate(-62,20);roverDrive(t,0,0,'#b82024',{turret:1,winch:1,heads:[[0,'#e8b898','#3d2b20'],[-34,'#f2cdb4','#2a1a16']],hx:94});C.g.restore();
  if(air>=1&&once(s,'land')){SHAKE(1);SFX('thump',1);burst(s,x+60,272,30,['#c8c8d0','#8a8a94','#ffd23a'],160)}drawPS(s)},{y:200});
X(C10.CUT_JUMP,2,function(t){C.neva(t,{sky:'dawn',sx:150,sy:190,broken:1,py:300});roverDrive(t,120,340,'#b82024',{turret:1,winch:1,lightsOn:false});C.smoke(240,300,t,4,6);hero('m',300,334,t,'stand',{item:'shotgun'});hero('s',340,334,t,'fist',{flip:true});cat('c',380,334,t,'sit',{flip:true})});
X(C10.CUT_DOWN,0,function(t){C.labStairs(t);hero('m',240,330,t,'talk',{item:'shotgun'});hero('s',300,330,t,'stand',{flip:true});cat('c',350,330,t,'stand',{flip:true})});
X(C10.CUT_ARENA,0,function(t){C.labArena(t);hero('m',180,330,t,'aim',{item:'shotgun'});hero('za',440,330,t,'zombie',{flip:true})});
X(C10.CUT_ANIS,0,function(t){C.labArena(t,{broken:1});hero('m',260,330,t,'stand',{item:'shotgun'});hero('za',360,334,t,'sit',{flip:true})});
X(C10.CUT_ANIS,1,function(t){C.labArena(t,{broken:1});hero('m',300,330,t,'hold',{item:'shotgun'});hero('za',420,340,t,'stand',{rot:Math.PI/2,noShadow:1,flip:true})});
X(C10.CUT_ANIS,2,function(t){C.labArena(t,{broken:1});hero('m',300,330,t,'phone',{item:'phone'});const k=clamp(t/3,0,1);cat('c',360+k*200,330-k*180,t,'walk');R(520,130,60,30,'#3a4a4a');for(let i=0;i<5;i++)R(524,134+i*5,52,2,'#1a2a2a')});
X(C10.CUT_QUEEN,0,function(t){C.throne(t);const b=Math.sin(t*2)*2;rat(330,190+b,t,{big:1,crown:'q'});glow(330,150,60,'#ff4fd8',.3);hero('m',140,330,t,'aim',{item:'shotgun'});hero('s',190,330,t,'aim',{item:'rpg'})},{x:270});
X(C10.CUT_FINAL,0,function(t,s){PS(s,t);C.throne(t);const k=clamp(t/1.5,0,1);C.g.save();C.g.translate(330,190+k*80);C.g.rotate(k*1.4);rat(0,0,t,{big:1,crown:'q'});C.g.restore();if(k>=1&&once(s,'f')){SHAKE(.8);SFX('thump',.8);burst(s,330,270,30,BLOOD,140)}drawPS(s)},{y:200});
X(C10.CUT_FINAL,1,function(t,s){PS(s,t);C.labArena(t,{broken:1});SHAKE(.3);if(Math.random()<.4)s._ps.push({x:Math.random()*AW,y:20,vx:0,vy:60,g:400,l:1.4,c:['#4a5a5a','#2a3a3a','#6a7a7a'][Math.random()*3|0],r:4+Math.random()*6|0});hero('m',260,330,t,'run');hero('s',220,330,t,'run');cat('c',320,330,t,'run');drawPS(s)});
X(C10.CUT_FINAL,2,function(t){C.dawnSpire(t)},{y:180});
X(C10.CUT_FINAL,3,function(t){C.newsStudio(t,{key:'f103',tag:'ГОВОРИТ ПЕТЕРБУРГ',head:'КРЫСЫ ПОГИБЛИ ПО ВСЕМУ ГОРОДУ',map:(x,y,w,h,tt)=>C.infMap(x,y,w,h,tt,['ПЕТРОГРАДКА','ВАСЬКА','НЕВСКИЙ','ДУМСКАЯ','ГОРЬКОВСКАЯ','ЗАЯЧИЙ','ЮГ','КОЛОМЯГИ'])})});
X(C10.CUT_FINAL,4,function(t){C.neva(t,{sky:'dawn',sx:150,sy:190,broken:1,py:300});R(260,262,60,6,'#b82024');R(270,256,20,6,'#3a3e44');for(let i=0;i<4;i++){const k=((t*.8+i/4)%1);P(280+i*8,262-k*10,'#c8e8ff')}hero('m',360,300,t,'sit');hero('s',400,300,t,'sit');cat('c',440,300,t,'sit')});
// эпилог: открытки
const EP=[['m','МИКРОБ','основатель «Протеин-Корп»'],['s','ШМАКОДЯВКА','студия ресниц «Розовый Глок» · чемпионка CS'],['c','ЧЕРСИК','лицо бренда «КОТ-ПРОТЕИН»'],['w','МЫШ','почётный гость'],['e','ЕГОР «АЛКОПАТИМЕН»','клуб «Бардак 2.0» на Думской'],['H','КОМАНДИР ХАНЖА','председатель ТСЖ · аэродром во дворе'],['G','МИХАЛЫЧ','сеть магазинов «У Михалыча»'],['D','ДВОРНИК','хранитель ключей'],['val','ВАЛЕРА','«Труба Airlines»'],['ol','ОЛЕСЯ','сырная лавка «Пармезан»'],['vd','ВЛАДОС И СТОЛЫПИН','автосервис «Пила и Пиво»'],['pa','БАТЯ И МАМА','Перелесье'],['du','ДЮША И «БАБУРА»','тур с Лёхой Superlative'],['vel','ВЕЛИКИЙ И САТУРНАЛИЯ','киберарена «Пески» · Екатеринбург'],['kt','ОХОТНИЦА КАТЯ','служба «Свистунов.нет»'],['a','АНИС','самогон «Анисовка»']];
const EPS=[
 t=>{C.room(t,{wall:'#2a3a6a',pat:0,floor:'#5a4a6a'});F.window(440,60,140,130,t,{sky:'#ff9a7a'});F.desk(180,290,180,{screen:'#3affd8'});R(310,236,8,18,'#d8a830');R(311,230,6,6,'#e8c050');F.plant(130,290,0,t);hero('m',420,330,t,'talk',{flip:true})},
 t=>{C.pcRoom(t);hero('s',220,330,t,'raise');hero('val',300,300,t,'sit',{flip:true})},
 t=>{C.room(t,{wall:'#e8ff4a',pat:2,floor:'#3a3a4a'});for(let i=0;i<6;i++){R(80+i*50,190,36,60,'#1a1a22');R(84+i*50,204,28,20,'#e8ff4a');txt('КОТ',88+i*50,210,'#1a1a22',1)}cat('c',420,330,t,'sit',{sc:1.6})},
 t=>{C.living(t,{});F.bowl(330,330,1);cat('w',300,330,t,'eat',{sc:1.3});cat('c',400,330,t,'sit',{flip:true,sc:1.3})},
 t=>{C.clubIn(t);hero('e',320,330,t,'raise',{item:'mic'});for(let i=0;i<3;i++){C.g.save();C.g.globalCompositeOperation='lighter';C.g.strokeStyle=['#ff4fd8','#3affd8','#ffe23a'][i];C.g.beginPath();C.g.moveTo(327,265);C.g.lineTo(640,200+i*30+Math.sin(t*3+i)*30);C.g.stroke();C.g.restore()}},
 t=>{C.homeYard(t,{runway:1});putS(C.jet(),380,300);hero('H',200,310,t,'point')},
 t=>{C.sky('eve',t,{});C.facades(0,{seed:20,night:1,base:300});C.street(300,t,{night:1});for(let i=0;i<3;i++){const x=60+i*200;R(x,180,140,24,'#c8302a');txt('У МИХАЛЫЧА',x+20,188,'#ffffff',2)}hero('G',320,334,t,'cross')},
 t=>{C.cellarDoor(t);hero('D',320,330,t,'talk',{item:'keys'});for(let i=0;i<8;i++){R(200+i*8,210,2,8,'#d8c040');R(199+i*8,208,4,3,'#d8c040')}},
 t=>{C.flyLand(t,{kind:'spb',plane:1,sp:20,py:200});},
 t=>{C.sky('eve',t,{});C.facades(400,{seed:21,night:1,base:300});C.street(300,t,{night:1});R(220,220,200,70,'#f8e8c8');R(220,214,200,8,'#e8a040');txt('ПАРМЕЗАН',260,230,'#8a5a2a',3);E3(320,268,24,14,'#ffe080');hero('ol',460,330,t,'talk',{flip:true})},
 t=>{C.room(t,{wall:'#3a3a44',pat:3,floor:'#2a2a30'});putS(C.carX6(),160,320);R(160,240,160,4,'#e8a020');hero('vd',400,330,t,'stand',{item:'chainsaw',flip:true});hero('st',450,330,t,'drink',{item:'beer',flip:true})},
 t=>{C.farm(t,{fence:1});hero('pa',280,330,t,'stand');hero('ma',330,330,t,'talk');for(let i=0;i<4;i++)E3(150+i*24,300,9,5,'#3a8a2a')},
 t=>{C.clubIn(t);hero('du',240,330,t,'raise');hero('mg',300,330,t,'raise');hero('lx',380,330,t,'talk',{flip:true})},
 t=>{C.arenaGate(t);hero('vel',260,334,t,'cross');hero('sat',320,334,t,'aim',{item:'pistol'})},
 t=>{C.wasteland(t,{dawn:1,horde:false,rat:false});hero('kt',300,334,t,'aim',{item:'awp'});hero('s',220,334,t,'stand')},
 t=>{C.room(t,{wall:'#4a2a1a',pat:0,floor:'#3a2a1a'});F.shelf(60,290,200,170);for(let i=0;i<8;i++){R(300+i*30,240,14,40,'#e8f0e0');R(303+i*30,226,8,14,'#e8f0e0');R(300+i*30,252,14,12,'#c8a040')}txt('АНИСОВКА',330,200,'#ffd23a',2)}];
function E3(x,y,rx,ry,c){window.MART.use(C.g,()=>window.MART.E(x,y,rx,ry,c))}
const EPI=C10.CUT_EPI;if(EPI)for(let i=0;i<Math.min(16,EPI.length-1);i++){const ep=EP[i],sc=EPS[i];X(EPI,i,function(t){sc(t);
  // плашка с именем
  const g=C.g;g.fillStyle='rgba(8,5,16,.78)';g.fillRect(90,112,AW-180,52);g.fillStyle=(window.NCOL&&NCOL[ep[0]])||'#ffd23a';g.font='bold 22px "Trebuchet MS",sans-serif';g.textBaseline='top';g.fillText(ep[1],104,118);g.fillStyle='#ffffff';g.font='15px "Trebuchet MS",sans-serif';g.fillText(ep[2],104,144);g.fillStyle=(window.NCOL&&NCOL[ep[0]])||'#ffd23a';g.fillRect(90,112,4,52)})}
if(EPI&&EPI[16])X(EPI,16,function(t){C.living(t,{night:1,tv:1});hero('m',260,330,t,'sit');hero('s',300,330,t,'sit');cat('c',340,300,t,'sit')});
}
// ---------- заправка гл.6 (из пилота) — уже выставлена в cine6.js ----------
})();
