// cinebg3.js — фоны кинокатсцен, часть 3: ТЦ, Исаакий, Морской фасад, полёт, Италия, дача, аэропорт, «Пески», пустырь, лаборатория, гнездо
(function(){
'use strict';
const C=window.CINE,M=window.MART;if(!C||!M)return;
const {AW,AH,R,P,dith,glow,cone,txt,txtW,neonTxt,hash,mix,lit,drk,layer}=C;const TAU=Math.PI*2;
const E=(x,y,rx,ry,c)=>M.use(C.g,()=>M.E(x,y,rx,ry,c));
// ---------- ТЦ «Сити Молл» ----------
function mallExt(t,o){o=o||{};C.sky('eve',t,{sx:120,sy:210});C.farCity(240,'#2e1648',{isaak:false,seed:4});
  C.g.drawImage(layer('mall',AW,AH,()=>{R(80,90,480,180,'#3a3a5a');R(80,90,480,6,'#5a5a7a');for(let y=110;y<250;y+=22)for(let x=90;x<550;x+=24){const v=hash(x,y);R(x,y,20,18,v<.15?'#ffe0a0':v<.25?'#3a1a2a':'#1a2a4a');R(x,y,20,1,'#6a8ac8')}
    R(250,200,140,70,'#0a1020');R(254,204,132,66,'#1a1418');for(let k=0;k<4;k++)R(254+k*33,204,1,66,'#3a4a6a');
    R(180,60,280,32,'#141020');for(let i=0;i<5;i++)R(80+i*120,270,2,0,'#000')}),0,0);
  const on=Math.sin(t*7)>-.7;neonTxt('СИТИ МОЛЛ',320-txtW('СИТИ МОЛЛ',3)/2,68,'#ff4fd8',3,on);
  R(0,270,AW,90,'#2a2634');C.asphalt(270,AH,'#2a2634',41);for(let x=20;x<AW;x+=60)R(x,300,2,40,'#c8c4b8');
  C.putS(C.sedan('#4a5a6a','burnt'),40,330);C.putS(C.sedan('#c8c8d0'),470,326);C.fire(70,318,30,24,t,3);C.smoke(90,290,t,4,6)}
// ---------- Исаакий в руинах ----------
function isaac(t,o){C.sky('fire',t,{});C.farCity(260,'#1a0608',{fire:1,isaak:false,seed:11});
  const cx=320,b=280;R(cx-150,b-90,300,90,'#3a2a2a');for(let i=0;i<10;i++)R(cx-140+i*30,b-86,10,80,'#4a3a3a');R(cx-160,b-96,320,8,'#2a1a1a');
  R(cx-70,b-150,140,60,'#3a2a2a');for(let i=0;i<8;i++)R(cx-64+i*17,b-146,7,50,'#4a3a3a');
  // разбитый купол: половина
  for(let a=Math.PI;a<TAU;a+=.02){const x=cx+Math.cos(a)*62,y=b-150+Math.sin(a)*58;if(a<Math.PI*1.6)R(x,y,3,3,'#c89a3a');else if(hash(Math.floor(a*20),1)<.5)R(x,y+hash(a,2)*8,3,3,'#8a6a2a')}
  for(let i=0;i<30;i++)R(cx-60+hash(i,3)*90,b-150-hash(3,i)*50,3,2,'#e0b04a');
  C.fire(cx-40,b-150,60,40,t,1);C.fire(cx+60,b-96,40,30,t,2);C.smoke(cx,b-180,t,5,10);C.embers(t,cx-150,b-200,300,200,30);
  R(0,b,AW,AH-b,'#1a1014');C.asphalt(b,AH,'#1e1418',61)}
// ---------- Морской фасад (Васька) ----------
function seaDock(t,o){o=o||{};C.sky(o.sky||'eve',t,{sx:520,sy:200});
  C.g.drawImage(layer('dock'+(o.sky||''),AW,AH,()=>{R(20,110,300,120,'#c8d8e8');for(let y=116;y<220;y+=12)R(24,y,292,8,'#3a6a9a');R(20,104,300,6,'#e8f0f8');R(140,80,180,30,'#c8d8e8');for(let k=0;k<12;k++)R(144+k*14,84,10,22,'#3a6a9a');
    txt('МОРСКОЙ ФАСАД',60,94,'#2a4a8a',2)}),0,0);
  R(0,230,AW,130,'#1a2a5a');for(let y=232;y<AH;y+=3)for(let x=0;x<AW;x+=12){const s=Math.sin(x*.05+t*1.6+y*.3);if(s>.55)R(x+((y*7)%6),y,5+(s>.9?4:0),1,'#4a6aaa')}
  R(0,226,340,8,'#8a8a94');R(0,226,340,2,'#b8b8c0');for(let x=0;x<340;x+=30)R(x,234,4,20,'#5a5a64')}
// ---------- кабина (вид из-за спин) ----------
function cockpit(t,view,o){o=o||{};// view(t) рисует пейзаж за стеклом
  view(t);
  C.g.drawImage(layer('cockpit'+(o.jet?1:0),AW,AH,()=>{const c=o.jet?'#2a2e34':'#3a3a44';R(0,0,AW,30,c);R(0,0,40,AH,c);R(600,0,40,AH,c);R(0,250,AW,110,c);
    C.g.fillStyle=c;C.g.beginPath();C.g.moveTo(0,30);C.g.lineTo(120,30);C.g.lineTo(40,140);C.g.lineTo(0,140);C.g.fill();C.g.beginPath();C.g.moveTo(640,30);C.g.lineTo(520,30);C.g.lineTo(600,140);C.g.lineTo(640,140);C.g.fill();
    R(318,30,4,220,c);R(40,246,560,6,lit(c,.2));
    for(let i=0;i<8;i++){const x=100+i*58;E(x,284,16,16,'#141418');E(x,284,14,14,'#e8e8e0');E(x,284,12,12,'#1a1a1e')}
    for(let i=0;i<20;i++)R(80+i*24,316,10,6,['#ff3a3a','#3aff7a','#ffe23a','#3a8aff'][i%4]);R(300,300,40,30,'#c81e2a');R(304,304,32,22,'#ff3a3a');txt('НЕ',310,308,'#ffffff',1);txt('ЖАТЬ',306,316,'#ffffff',1)}),0,0);
  for(let i=0;i<8;i++){const x=100+i*58,a=t*(1+i*.3)+i;C.g.strokeStyle='#ff3a3a';C.g.lineWidth=1;C.g.beginPath();C.g.moveTo(x,284);C.g.lineTo(x+Math.cos(a)*10,284+Math.sin(a)*10);C.g.stroke()}
  if(Math.sin(t*3)>0)glow(320,315,30,'#ff3a3a',.3)}
// пейзажи под самолётом (вид сбоку/сверху)
function flyClouds(t,o){o=o||{};C.sky(o.sky||'day',t,{clouds:false});for(let l=0;l<3;l++){const sp=(l+1)*40;for(let i=0;i<8;i++){const x=((hash(i,l)*AW*1.5-t*sp)%(AW+300)+AW+300)%(AW+300)-150,y=120+l*70+hash(l,i)*30;C.puff(x,y,80+hash(i,i)*80)}}}
function flyLand(t,o){o=o||{};const kind=o.kind||'europe';C.sky(kind==='spb'?'eve':kind==='ural'?'ural':'italy',t,{clouds:false,sx:520,sy:120});
  const hz=150;const sp=o.sp||30;
  for(let l=0;l<4;l++){const y0=hz+l*14+l*l*10,col=kind==='ural'?['#3a5a8a','#2a4a3a','#3a6a3a','#4a7a3a'][l]:['#8ab0d8','#7aa86a','#8ab85a','#a8c86a'][l];R(0,y0,AW,AH-y0,col);
    for(let i=0;i<14;i++){const x=((hash(i,l+5)*AW*1.6-t*sp*(l+1)*.4)%(AW+120)+AW+120)%(AW+120)-60;const w=30+hash(l,i)*80;if(kind==='ural'&&l>0)for(let k=0;k<w;k+=6)C.spruceS(x+k,y0+8,10+l*4,drk(col,.3));else R(x,y0+2,w,3+l,drk(col,.12))}}
  if(kind==='pisa'){const x=((420-t*sp*.6)%(AW+200)+AW+200)%(AW+200)-100,b=hz+52;C.g.save();C.g.translate(x,b);C.g.rotate(1.3);for(let k=0;k<8;k++){R(-8,-k*8-8,16,8,'#f0ece0');R(-8,-k*8-8,16,1,'#c8c0b0');for(let j=-6;j<6;j+=4)R(j,-k*8-6,2,4,'#a8a090')}C.g.restore();R(x-30,b-10,60,10,'#f0ece0');R(x-26,b-16,52,6,'#e8e0d0');C.smoke(x+20,b,t,7,5)}
  if(kind==='colos'){const x=((380-t*sp*.6)%(AW+260)+AW+260)%(AW+260)-130,b=hz+60;R(x-90,b-50,180,50,'#d8b888');for(let k=0;k<4;k++)for(let j=0;j<10;j++)R(x-84+j*18,b-46+k*12,10,8,'#8a6a4a');C.g.fillStyle='#d8b888';R(x+40,b-60,50,10,lit('#d8b888',.1));
    for(let i=0;i<60;i++)P(x-80+hash(i,4)*160,b+2+hash(4,i)*10,'#5a8a3a')}
  if(kind==='spb'){C.farCity(hz+20,'#3a2a5a',{seed:2,lakhta:500})}
  if(o.plane)C.putS(C.seaplane(),o.px||220,o.py||110+Math.sin(t*2)*3)}
// ---------- итальянский пляж ----------
function beach(t,o){o=o||{};C.sky('italy',t,{sx:120,sy:160});
  C.g.drawImage(layer('beach',AW,AH,()=>{R(0,150,AW,60,'#3a8ac8');for(let y=152;y<210;y+=4)for(let x=0;x<AW;x+=20)if(hash(x,y)<.4)R(x,y,8,1,'#7ac8f0');
    // холм с виллами
    C.g.fillStyle='#6a9a4a';C.g.beginPath();C.g.moveTo(330,150);C.g.quadraticCurveTo(480,40,640,90);C.g.lineTo(640,150);C.g.fill();
    for(const [x,y,c] of [[450,90,'#f0d8b0'],[520,74,'#f8e8c8'],[580,88,'#e8c0a0']]){R(x,y,40,26,c);R(x-2,y-6,44,6,'#c8603a');for(let k=0;k<3;k++)R(x+5+k*12,y+8,6,8,'#3a6a8a')}
    for(const x of [400,600])for(let k=0;k<5;k++)E(x,110-k*8,3,6,'#2a5a2a');
    R(0,206,AW,154,'#f0d8a0');for(let i=0;i<500;i++)P(hash(i,9)*AW,206+hash(9,i)*154,hash(i,1)<.5?'#e0c890':'#fff0c0');R(0,204,AW,3,'#ffffff')}),0,0);
  for(let x=0;x<AW;x+=4){const y=205+Math.sin(x*.05+t*2)*2;R(x,y,4,2,'#ffffff')}}
// ---------- дача Микроба / ферма ----------
function farm(t,o){o=o||{};C.sky(o.night?'night':'eve',t,{sx:140,sy:205});C.forest(214,23,'#2c1036',30,58,17,'#7a2a6a',t);
  C.g.drawImage(layer('farm'+(o.fence?1:0),AW,AH,()=>{const hx=330;R(hx,140,170,100,'#b8864a');for(let y=144;y<240;y+=8)R(hx,y,170,1,'#8a6234');C.g.fillStyle='#8a2a2a';C.g.beginPath();C.g.moveTo(hx-14,142);C.g.lineTo(hx+85,86);C.g.lineTo(hx+184,142);C.g.fill();R(hx-14,140,198,4,'#5a1a1a');
    for(const wx of [hx+20,hx+110]){R(wx,164,36,32,'#ffffff');R(wx+3,167,30,26,'#ffe8a0');R(wx+17,167,2,26,'#ffffff');R(wx-4,196,44,4,'#8a6234')}R(hx+70,180,26,60,'#5a3a22');R(hx+90,208,3,4,'#e8c050');
    R(hx+40,96,14,30,'#6a3a2a');C.grass(240,AH,'#2a4a2a','#4a8a3a',21);
    for(let r=0;r<3;r++){R(40,272+r*24,220,10,'#5a3a22');for(let k=0;k<11;k++){const x=50+k*20;R(x,262+r*24,4,10,'#3a8a3a');E(x+2,262+r*24,5,4,'#4ab84a');if(r===1)E(x+2,272+r*24,6,3,'#5aa83a')}}
    if(o.fence){R(0,180,AW,4,'#6a4a2a');for(let x=0;x<AW;x+=10){R(x,110,9,130,'#8a6234');R(x,110,1,130,'#a8824a');C.g.fillStyle='#8a6234';C.g.beginPath();C.g.moveTo(x,110);C.g.lineTo(x+4,102);C.g.lineTo(x+9,110);C.g.fill()}
      for(const tx of [40,580]){R(tx-12,40,24,80,'#6a4a2a');R(tx-18,32,36,10,'#5a3a22');R(tx-8,24,16,8,'#3a3e44');R(tx,20,20,4,'#2a2a30')}}}),0,0);
  if(o.fence)for(const tx of [40,580])if(Math.sin(t*4+tx)>.5)glow(tx,28,10,'#ff3a3a',.5);
  C.motes(t,0,180,AW,120,'#fff0c0',24,9)}
// поваленный леший
function leshy(x,b,t,dead){R(x-80,b-16,160,16,'#4a3a2a');for(let i=0;i<20;i++){const a=hash(i,3)*Math.PI,L=20+hash(3,i)*40;C.g.fillStyle=i%2?'#2a5a2a':'#3a7a3a';C.g.beginPath();C.g.moveTo(x-60+i*6,b-12);C.g.lineTo(x-60+i*6+Math.cos(a)*L,b-12-Math.sin(a)*L*.6);C.g.lineTo(x-56+i*6,b-12);C.g.fill()}
  E(x+70,b-20,16,14,'#5a4a3a');P(x+76,b-24,dead?'#2a2a2a':'#c8ff3a');P(x+66,b-24,dead?'#2a2a2a':'#c8ff3a')}
// ---------- аэропорт Кольцово ----------
function airport(t,o){o=o||{};C.sky(o.night?'night':'ural',t,{sx:500,sy:210});C.forest(226,31,'#2a3a5a',20,40,14,null,t);
  C.g.drawImage(layer('airport'+(o.night?1:0),AW,AH,()=>{R(60,130,440,100,'#c8d8e8');R(60,124,440,8,'#e8f0f8');for(let x=70;x<490;x+=24)R(x,140,18,70,o.night?'#ffe0a0':'#3a6a9a');txt('КОЛЬЦОВО',200,110,'#2a4ae8',3);
    R(520,60,30,170,'#c8d8e8');R(510,50,50,20,'#3a6a9a');R(0,230,AW,130,'#3a3a44');C.asphalt(230,AH,'#3a3a44',71);for(let x=0;x<AW;x+=60)R(x,300,30,3,'#ffe23a')}),0,0)}
// ---------- арена «Пески» ----------
function arenaGate(t,o){o=o||{};C.sky('ural',t,{sx:520,sy:200});
  C.g.drawImage(layer('peski',AW,AH,()=>{R(0,230,AW,130,'#d8b878');for(let i=0;i<800;i++)P(hash(i,5)*AW,230+hash(5,i)*130,hash(i,3)<.5?'#c8a868':'#e8c888');
    R(40,90,560,150,'#c8a060');for(let y=96;y<230;y+=10)for(let x=40+((y/10)%2)*14;x<600;x+=28)R(x,y,27,9,'#d8b070');dith(40,90,560,150,'#a88040',.15);
    for(let i=0;i<5;i++){const ax=90+i*110;R(ax,150,60,90,'#2a1e14');E(ax+30,150,30,20,'#2a1e14')}R(40,84,560,8,'#a88040');
    R(240,40,160,40,'#2a1e14');txt('ПЕСКИ',270,52,'#ffb060',4)}),0,0);
  C.motes(t,0,200,AW,160,'#ffe8b0',40,4)}
// ---------- пустырь и гаражи ночью, орда ----------
function wasteland(t,o){o=o||{};C.sky(o.dawn?'dawn':'night',t,{mx:540,my:60,sx:540,sy:220});C.farCity(230,o.dawn?'#4a3a6a':'#140c26',{isaak:false,seed:14});
  R(0,230,AW,130,o.dawn?'#4a4a3a':'#1e1a20');for(let i=0;i<300;i++)P(hash(i,11)*AW,232+hash(11,i)*128,o.dawn?'#5a5a4a':'#2a2430');
  // гаражи
  for(let i=0;i<5;i++){const x=300+i*68;R(x,186,66,48,o.dawn?'#6a6a72':'#3a3a44');R(x,186,66,4,'#5a5e66');R(x+6,196,54,38,o.dawn?'#4a5a6a':'#2a3a4a');for(let k=0;k<54;k+=6)R(x+6+k,196,1,38,'#1a2a3a')}
  // орда шеренгами
  if(o.horde!==false){const n=o.n||5;for(let r=0;r<n;r++)for(let i=0;i<14;i++){const x=20+i*20+r*6+Math.sin(t*2+i)*1,y=250+r*18;C.g.save();C.g.translate(x,y);C.g.scale(.6,.6);C.zombie(0,0,t,i+r*14,{walk:1,noShadow:1});C.g.restore();if((i+r)%4===0){glow(x+8,y-38,10,'#ff9a3a',.5);R(x+6,y-44,3,6,'#ffb84a')}}}
  // крыса со свистком
  if(o.rat!==false){const rx=440,ry=186;C.rat(rx,ry,t,{big:1,flip:true});R(rx-30,ry-20,6,3,'#c8ccd4');if(Math.sin(t*6)>0&&!o.dead){for(let k=1;k<4;k++){C.g.strokeStyle='rgba(255,255,255,.5)';C.g.beginPath();C.g.arc(rx-34,ry-20,k*6,Math.PI*.7,Math.PI*1.3);C.g.stroke()}}}}
// ---------- лаборатория ----------
function labStairs(t,o){C.g.drawImage(layer('labst',AW,AH,()=>{R(0,0,AW,AH,'#d8e8f0');for(let x=0;x<AW;x+=40)R(x,0,1,AH,'#b8c8d8');
    for(let i=0;i<12;i++){R(100+i*30,60+i*20,440-i*30,20,'#e8f4fa');R(100+i*30,60+i*20,440-i*30,2,'#ffffff');R(100+i*30,78+i*20,440-i*30,2,'#a8b8c8')}
    R(0,300,AW,60,'#c8d8e0');R(60,20,520,10,'#a8b8c8');for(let x=80;x<560;x+=80){R(x,30,40,6,'#ffffff')}}),0,0);
  for(let x=80;x<560;x+=80)cone(x+20,36,40,120,240,'#e8fcff',.1);glow(320,40,200,'#e8fcff',.2)}
function labArena(t,o){o=o||{};C.g.drawImage(layer('labar',AW,AH,()=>{R(0,0,AW,AH,'#0e1a1a');for(let x=0;x<AW;x+=32)R(x,0,2,260,'#1a2a2a');R(0,260,AW,100,'#1a2424');for(let x=0;x<AW;x+=40)R(x,260,1,100,'#0e1818');
    for(let i=0;i<4;i++){const x=60+i*150;R(x,100,60,140,'#2a3a3a');R(x+4,104,52,132,'#0a2a1a');R(x,96,60,6,'#4a5a5a');R(x,236,60,6,'#4a5a5a');if(i===1||i===3){for(let k=0;k<20;k++)R(x+4+hash(k,i)*52,140+hash(i,k)*96,3,3,'#c8ffd8')}}}),0,0);
  for(let i=0;i<4;i++){const x=60+i*150;if(i===0||i===2){R(x+4,104+20,52,112,'#2aff7a');C.g.globalAlpha=.4;R(x+4,104+18+Math.sin(t*2+i)*2,52,4,'#aaffc8');C.g.globalAlpha=1;for(let k=0;k<6;k++){const y=((t*30+k*20)%110);P(x+10+k*8,236-y,'#ccffdd')}glow(x+30,170,80,'#2aff7a',.25)}}
  if(o.broken)for(let i=0;i<40;i++)R(hash(i,2)*AW,262+hash(2,i)*90,4,2,'#a8e8c8');
  glow(320,60,240,'#2aff7a',.08);if(Math.sin(t*7)>.85)R(0,0,AW,AH,'rgba(255,40,40,.05)')}
function throne(t,o){o=o||{};C.g.drawImage(layer('throne',AW,AH,()=>{R(0,0,AW,AH,'#140a14');for(let i=0;i<200;i++){const x=hash(i,3)*AW,y=150+hash(3,i)*210,w=6+hash(i,i)*20;R(x,y,w,4+hash(i,7)*8,['#3a2a2a','#4a3a2a','#2a3a3a','#5a3a4a','#3a3a2a'][i%5])}
    C.g.fillStyle='#3a2a2a';C.g.beginPath();C.g.moveTo(220,300);C.g.lineTo(260,130);C.g.lineTo(380,130);C.g.lineTo(420,300);C.g.fill();for(let i=0;i<60;i++)R(230+hash(i,9)*180,140+hash(9,i)*160,8,4,['#5a4a3a','#6a5a4a','#4a5a6a','#c8a040'][i%4]);
    R(250,110,140,24,'#4a3a3a');for(let i=0;i<7;i++)R(254+i*20,96,10,16,'#4a3a3a')}),0,0);
  glow(320,170,200,'#ff4fd8',.15);for(let i=0;i<14;i++){const x=hash(i,5)*AW,y=280+hash(5,i)*70;C.rat(x+Math.sin(t*2+i)*4,y,t+i,{flip:i%2})}}
// ---------- рассвет над Невой со шпилем ----------
function dawnSpire(t,o){C.neva(t,{sky:'dawn',sx:150,sy:190,broken:1,parapet:true,py:310});
  const hx=380+Math.sin(t*.6)*10,hy=70+Math.sin(t*1.3)*4;C.heli(hx,hy,t);R(hx-1,hy-4,2,40,'#2a2a2a');
  const sx=hx,sy=hy+40;for(let y=0;y<110;y++){const w=y<70?2:3;R(sx-w/2,sy+y,w,1,'#ffd23a')}R(sx-6,sy+110,12,10,'#e0ac2e');
  // золотой Черсик на верхушке (сидит на кончике)
  const s=C.catSpr('gold',0,'sit');C.putS(s,sx-2,sy+2);glow(sx,sy-6,30,'#ffe88a',.5)}
Object.assign(C,{mallExt,isaac,seaDock,cockpit,flyClouds,flyLand,beach,farm,leshy,airport,arenaGate,wasteland,labStairs,labArena,throne,dawnSpire});
})();
