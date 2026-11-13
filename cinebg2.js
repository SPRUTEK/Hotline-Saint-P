// cinebg2.js — фоны кинокатсцен, часть 2: интерьеры (квартира, лифт, офис, студия новостей, раздевалка, клуб), мебель в профиль
(function(){
'use strict';
const C=window.CINE,M=window.MART;if(!C||!M)return;
const {AW,AH,R,P,dith,glow,cone,txt,txtW,neonTxt,hash,mix,lit,drk,layer}=C;const TAU=Math.PI*2;
const E=(x,y,rx,ry,c)=>M.use(C.g,()=>M.E(x,y,rx,ry,c));
// ---------- мебель в профиль (низ = base) ----------
const F={
  sofa(x,b,w,c){c=c||'#c84a6a';R(x,b-40,w,26,c);R(x,b-40,w,3,lit(c,.25));R(x-6,b-30,10,22,drk(c,.1));R(x+w-4,b-30,10,22,drk(c,.1));R(x-6,b-30,10,2,lit(c,.2));R(x+w-4,b-30,10,2,lit(c,.2));
    R(x,b-16,w,8,drk(c,.2));for(let k=w/3;k<w;k+=w/3)R(x+k,b-40,1,22,drk(c,.3));R(x+4,b-8,4,8,'#2a1e18');R(x+w-8,b-8,4,8,'#2a1e18');
    R(x+10,b-36,16,12,'#ffd23a');R(x+w-30,b-36,16,12,'#3affd8')},
  armchair(x,b,c){c=c||'#5a3a8a';R(x,b-46,30,30,c);R(x,b-46,30,3,lit(c,.25));R(x-6,b-28,8,20,drk(c,.1));R(x+28,b-28,8,20,drk(c,.1));R(x,b-18,30,10,drk(c,.2));R(x+2,b-8,3,8,'#2a1e18');R(x+26,b-8,3,8,'#2a1e18')},
  tv(x,b,on,t){R(x,b-22,60,22,'#3a2a2a');R(x,b-22,60,2,'#5a4a4a');R(x+4,b-16,24,10,'#2a1e1e');R(x+32,b-16,24,10,'#2a1e1e');R(x+6,b-62,48,36,'#141418');R(x+8,b-60,44,32,on?'#3a6ae8':'#0e0e18');R(x+28,b-26,4,4,'#141418');
    if(on){for(let i=0;i<4;i++)R(x+10+i*10,b-56+((t*20+i*7)%22),8,2,'#7adfff');glow(x+30,b-44,40,'#5a8aff',.25)}},
  table(x,b,w,c){c=c||'#8a5a32';R(x,b-28,w,4,c);R(x,b-28,w,1,lit(c,.3));R(x+3,b-24,3,24,drk(c,.2));R(x+w-6,b-24,3,24,drk(c,.2))},
  chair(x,b,c,fl){c=c||'#6a4a2a';const d=fl?-1:1;R(x,b-18,14,3,c);R(x+(fl?12:0),b-38,2,38,drk(c,.1));R(x+(fl?0:12),b-15,2,15,drk(c,.1))},
  plant(x,b,k,t){k=k||0;R(x-7,b-14,14,14,['#c8603a','#e8e8e8','#3a3a44','#e8a0c0'][k%4]);R(x-8,b-15,16,3,lit(['#c8603a','#e8e8e8','#3a3a44','#e8a0c0'][k%4],.2));
    if(k%3===0){for(let i=0;i<7;i++){const a=-Math.PI/2+(i-3)*.35+Math.sin((t||0)*1.2+i)*.04,L=20+hash(i,x)*12;const ex=x+Math.cos(a)*L,ey=b-15+Math.sin(a)*L;C.limb({q:(p,c)=>{C.g.fillStyle=c;C.g.beginPath();C.g.moveTo(p[0],p[1]);for(let j=2;j<p.length;j+=2)C.g.lineTo(p[j],p[j+1]);C.g.fill()}},x,b-15,ex,ey,2,'#2a6a3a');E(ex,ey,6,4,i%2?'#3a9a4a':'#4ab85a');P(ex-2,ey-1,'#8ae88a')}}
    else if(k%3===1){R(x-1,b-40,3,26,'#4a3a2a');for(let i=0;i<10;i++)E(x-8+hash(i,x)*16,b-50+hash(x,i)*18,5,4,i%2?'#2a7a3a':'#3a9a4a')}
    else{R(x-3,b-34,6,20,'#4a9a4a');R(x-8,b-28,4,8,'#4a9a4a');R(x+4,b-30,4,10,'#4a9a4a');for(let j=0;j<20;j+=4)P(x,b-32+j,'#c8f0a8');E(x,b-36,3,3,'#ff6aa8')}},
  flowers(x,b,t){R(x-4,b-16,8,16,'#a8d8f0');R(x-4,b-16,8,2,'#e8f8ff');for(let i=0;i<6;i++){const fx=x-8+i*3,fy=b-26-hash(i,x)*10+Math.sin((t||0)*2+i)*.5;R(fx,fy,1,b-16-fy,'#3a8a3a');E(fx,fy,2.5,2.5,['#ff5a8a','#ffd23a','#ff8ad8','#ffffff','#ff6a3a','#c86aff'][i])}},
  lampF(x,b,on,col){col=col||'#ffd88a';R(x,b-70,2,70,'#2a2a30');R(x-5,b-3,12,3,'#2a2a30');C.g.fillStyle=on?'#ffe8b0':'#c8b890';C.g.beginPath();C.g.moveTo(x-9,b-70);C.g.lineTo(x+11,b-70);C.g.lineTo(x+7,b-86);C.g.lineTo(x-5,b-86);C.g.fill();if(on){glow(x+1,b-74,60,col,.3);cone(x+1,b-70,18,70,70,col,.12)}},
  shelf(x,b,w,h){R(x,b-h,w,h,'#5a3a2a');R(x+2,b-h+2,w-4,h-4,'#3a2418');for(let y=b-h+2;y<b-4;y+=22){R(x+2,y+20,w-4,2,'#6a4a32');for(let k=x+4;k<x+w-6;){const bw=3+hash(k,y)*4,bh=12+hash(y,k)*6;R(k,y+20-bh,bw,bh,['#c84a4a','#4a8ac8','#e8c84a','#5ac87a','#c86ac8','#e8e8e8'][Math.floor(hash(k*3,y)*6)]);k+=bw+1}}},
  wardrobe(x,b,w,h,c){c=c||'#c8b8a0';R(x,b-h,w,h,c);R(x,b-h,w,3,lit(c,.2));R(x+w/2,b-h,1,h,drk(c,.3));R(x+w/2-5,b-h/2,2,8,'#8a8a8a');R(x+w/2+3,b-h/2,2,8,'#8a8a8a');R(x,b-6,w,6,drk(c,.3))},
  fridge(x,b){R(x,b-110,46,110,'#e8eef4');R(x,b-110,46,3,'#ffffff');R(x,b-70,46,2,'#a8b0b8');R(x+38,b-104,3,26,'#a8b0b8');R(x+38,b-64,3,30,'#a8b0b8');for(let i=0;i<4;i++)R(x+6+i*8,b-100+hash(i,x)*20,6,6,['#ff5a8a','#3affd8','#ffd23a','#7a8aff'][i])},
  counter(x,b,w){R(x,b-46,w,46,'#e8e0d0');R(x,b-50,w,4,'#3a3a44');R(x,b-50,w,1,'#6a6a74');for(let k=0;k<w;k+=30){R(x+k,b-44,1,44,'#c8c0b0');R(x+k+12,b-40,8,2,'#a8a0a0')}R(x,b-130,w,40,'#e8e0d0');R(x,b-92,w,2,'#c8c0b0');for(let k=0;k<w;k+=30)R(x+k,b-130,1,40,'#c8c0b0');
    for(let k=0;k<w;k+=8)for(let j=0;j<4;j++)R(x+k,b-88+j*9,7,8,j%2?'#7adfc8':'#ffffff')},
  window(x,y,w,h,t,o){o=o||{};R(x-4,y-4,w+8,h+8,'#e8e8f0');R(x,y,w,h,o.sky||'#1a1040');if(o.view)o.view(x,y,w,h,t);else{for(let i=0;i<12;i++){const bx=x+hash(i,x)*w,bh=10+hash(x,i)*h*.6;R(bx,y+h-bh,10+hash(i,i)*14,bh,'#2a1e4a');for(let k=0;k<4;k++)if(hash(i,k)<.5)R(bx+3,y+h-bh+4+k*8,2,3,'#ffd27a')}}
    R(x+w/2-1,y,3,h,'#e8e8f0');R(x,y+h/3,w,3,'#e8e8f0');R(x-6,y+h+4,w+12,4,'#f4f4f8');if(o.curtain){R(x-14,y-8,12,h+18,o.curtain);R(x+w+2,y-8,12,h+18,o.curtain);for(let k=0;k<h+18;k+=6)R(x-12,y-8+k,1,4,drk(o.curtain,.2))}},
  picture(x,y,w,h,c){R(x,y,w,h,'#c8a040');R(x+2,y+2,w-4,h-4,c||'#3a6a8a');R(x+4,y+h-10,w-8,6,lit(c||'#3a6a8a',.3));E(x+w*.7,y+h*.35,3,3,'#ffd23a')},
  rug(x,b,w,c){R(x,b-2,w,4,c||'#c84a8a');for(let k=0;k<w;k+=6)R(x+k,b-2,3,1,lit(c||'#c84a8a',.3))},
  radiator(x,b){R(x,b-40,40,24,'#e8e8f0');for(let k=0;k<40;k+=5)R(x+k,b-40,1,24,'#a8a8b8')},
  bowl(x,b,food){R(x-8,b-5,16,5,'#3a7ac8');R(x-6,b-6,12,2,'#5a9ae8');if(food)R(x-5,b-7,10,2,'#a87a3a')},
  desk(x,b,w,o){o=o||{};R(x,b-36,w,4,'#2a2a32');R(x+2,b-32,3,32,'#1a1a20');R(x+w-5,b-32,3,32,'#1a1a20');if(o.pc!==false){R(x+w*.3,b-72,44,30,'#141418');R(x+w*.3+2,b-70,40,26,o.screen||'#3a6ae8');R(x+w*.3+20,b-42,4,6,'#141418');R(x+w*.3-4,b-38,30,2,'#2a2a30')}
    if(o.rgb){R(x+w-24,b-70,16,34,'#1a1a22');for(let i=0;i<3;i++)R(x+w-22,b-66+i*10,12,2,['#ff4fd8','#3affd8','#ffe23a'][i])}},
  gchair(x,b,c){c=c||'#c82a3a';R(x,b-70,16,36,c);R(x+2,b-68,12,4,'#141418');R(x-2,b-36,26,6,c);R(x+10,b-30,3,22,'#2a2a30');R(x+2,b-8,20,3,'#2a2a30')},
  bed(x,b,w,c){R(x,b-30,w,14,'#f0e8f0');R(x,b-30,w,2,'#ffffff');R(x+w-30,b-36,26,10,'#f8f4f8');R(x,b-16,w,8,c||'#c84a8a');R(x-4,b-50,6,50,'#6a4a32');R(x+w,b-38,6,38,'#6a4a32')},
  boxes(x,b){for(let i=0;i<3;i++)R(x+i*14,b-16-(i%2)*10,16,16,'#b8864a');R(x+18,b-26,14,1,'#8a6234')},
  speaker(x,b,h,t){R(x,b-h,28,h,'#141418');R(x+1,b-h+1,26,2,'#2a2a30');const p=1+Math.max(0,Math.sin(t*12))*.15;E(x+14,b-h*.3,9*p,9*p,'#2a2a34');E(x+14,b-h*.3,4,4,'#4a4a54');E(x+14,b-h*.72,5,5,'#2a2a34')},
};
// ---------- комната в профиль ----------
// o: wall (цвет), pat (0 полосы, 1 ромбы, 2 точки, 3 плитка), floor, night, lamp
function room(t,o){o=o||{};const key='room:'+JSON.stringify([o.wall,o.pat,o.floor,o.fy,o.night]);
  C.g.drawImage(layer(key,AW,AH,()=>{const fy=o.fy||290,W=o.wall||'#6a3a7a',Wd=drk(W,.18);R(0,0,AW,fy,W);
    const pat=o.pat||0;if(pat===0)for(let x=0;x<AW;x+=24){R(x,0,8,fy,Wd)}else if(pat===1){for(let y=10;y<fy;y+=24)for(let x=(y/24%2)*12;x<AW;x+=24){R(x,y,2,2,lit(W,.25));R(x-2,y+2,6,1,Wd)}}else if(pat===2){for(let y=8;y<fy;y+=14)for(let x=(y/14%2)*7;x<AW;x+=14)R(x,y,2,2,lit(W,.2))}else{for(let y=0;y<fy;y+=16)for(let x=0;x<AW;x+=16){R(x,y,16,1,Wd);R(x,y,1,16,Wd)}}
    dith(0,0,AW,fy,drk(W,.35),.15);R(0,0,AW,16,drk(W,.5));R(0,16,AW,2,lit(W,.3));
    R(0,fy-10,AW,10,'#f0e8e0');R(0,fy-10,AW,2,'#ffffff');
    const Fc=o.floor||'#8a5a3a';R(0,fy,AW,AH-fy,Fc);for(let y=fy;y<AH;y+=8){R(0,y,AW,1,drk(Fc,.25));for(let x=(y/8%2)*30;x<AW;x+=60)R(x,y,1,8,drk(Fc,.2))}dith(0,fy,AW,AH-fy,lit(Fc,.15),.12)}),0,0);
  if(o.lamp!==false){const lx=o.lx||320;R(lx,16,2,30,'#2a2a30');R(lx-14,46,30,8,'#ffe8b0');glow(lx+1,56,o.night?160:120,'#ffd88a',o.night?.3:.2);cone(lx+1,54,30,260,(o.fy||290)-54,'#ffe8b0',o.night?.1:.06)}}
// гостиная Микроба и Шмакодявки
function living(t,o){o=o||{};room(t,{wall:o.night?'#3a2a5a':'#6a3a7a',pat:1,floor:'#7a4a2e',night:o.night,lx:300});
  F.window(430,70,120,120,t,{curtain:'#ff6aa8',sky:o.night?'#0e0828':'#ff8a6a'});F.radiator(470,270);
  F.picture(110,80,60,44,'#3a8a9a');F.picture(190,94,30,30,'#c84a6a');
  F.shelf(20,290,70,170);F.sofa(130,290,170,'#4a5ac8');F.armchair(330,290,'#c84a6a');F.tv(560,290,o.tv,t);
  F.plant(400,290,0,t);F.plant(620,290,1,t);F.flowers(520,250,t);R(500,250,46,4,'#6a4a32');F.rug(120,300,300,'#e84a9a');F.bowl(560,320,1);F.lampF(102,290,true)}
function kitchen(t,o){o=o||{};room(t,{wall:o.wall||'#2a8a8a',pat:3,floor:'#e8e0f0',lx:340,night:o.night});
  F.counter(20,290,220);F.fridge(250,290);F.window(330,80,100,100,t,{curtain:'#ffd23a',sky:o.night?'#0e0828':'#ff9a7a'});
  F.table(360,290,110,'#c8a070');F.chair(330,290,'#e84a6a');F.chair(480,290,'#e84a6a',true);F.flowers(410,262,t);F.plant(600,290,2,t);F.plant(560,290,1,t);
  R(380,256,10,6,'#f0f0f0');R(440,256,8,6,'#f0f0f0')}
function pcRoom(t,o){o=o||{};room(t,{wall:'#1a1a3a',pat:2,floor:'#3a3a4a',night:1,lamp:false});
  for(let i=0;i<3;i++)R(0,40+i*60,AW,2,['#ff4fd8','#3affd8','#7a5aff'][i]);glow(320,60,300,'#7a5aff',.15);
  F.desk(240,290,200,{screen:'#e8a040',rgb:1});F.gchair(300,300,'#2a8a3a');F.shelf(40,290,60,150);F.plant(520,290,1,t);F.window(560,70,60,90,t,{sky:'#0e0828'});
  R(300,220,40,24,'#e8a040');for(let i=0;i<5;i++)R(302+i*8,224+((t*30+i*9)%16),4,4,'#3a2a1a');txt('CS',306,206,'#ffffff',1)}
// ---------- лифт ----------
function liftIn(t,o){o=o||{};C.g.drawImage(layer('lift',AW,AH,()=>{R(0,0,AW,AH,'#141018');R(100,24,440,300,'#5a5a6a');
    for(let x=100;x<540;x+=55){R(x,24,1,270,'#3a3a48');R(x+1,24,1,270,'#7a7a8a')}dith(100,24,440,270,'#7a7a8a',.12);
    R(100,24,440,16,'#2a2a34');R(130,30,380,4,'#ffffff');R(100,180,440,4,'#8a8a9a');R(100,184,440,2,'#3a3a48');
    R(100,294,440,30,'#3a3440');for(let x=100;x<540;x+=12)R(x,294,6,30,'#2e2a34');
    R(260,60,120,100,'#7a8aa0');R(262,62,116,96,'#9aaac0');dith(262,62,116,96,'#c8d8f0',.2);R(262,62,40,96,'#b8c8e0');// зеркало
    R(470,90,28,60,'#2a2a34');for(let i=0;i<6;i++){R(476,96+i*8,6,5,'#a8a8b8');R(486,96+i*8,6,5,'#a8a8b8')}
    R(80,24,20,300,'#2a2a34');R(540,24,20,300,'#2a2a34');R(84,24,14,300,'#8a8a9a');R(542,24,14,300,'#8a8a9a')}),0,0);
  const fl=o.flick&&Math.sin(t*23)*Math.sin(t*7)>.5;if(!fl)glow(320,32,200,'#e8f0ff',.18);
  R(296,40,48,16,'#141018');txt((o.up?'▲ ':'▼ ')+(o.floor||5),302,45,'#ff3a3a',1);R(304,46,4,4,'#ff3a3a');
  if(o.emerg){glow(320,40,80,'#ff3a3a',.2+Math.sin(t*6)*.1)}}
// ---------- офис ----------
function officeIn(t,o){o=o||{};C.g.drawImage(layer('office:'+(o.dark?1:0),AW,AH,()=>{const W=o.dark?'#2a2838':'#4a4a6a';R(0,0,AW,AH,W);
    for(let x=0;x<AW;x+=80){R(x+10,40,60,170,o.dark?'#14121e':'#1e2240');for(let y=44;y<210;y+=6)R(x+10,y,60,2,o.dark?'#22202e':'#3a4270');R(x+38,40,4,170,W)}
    R(0,24,AW,16,'#1a1824');for(let x=40;x<AW;x+=120){R(x,26,60,6,'#e8f0ff')}
    R(0,210,AW,60,'#3a3a52');R(0,210,AW,2,'#6a6a8a');R(0,270,AW,AH-270,'#26283a');for(let x=0;x<AW;x+=32)R(x,270,1,90,'#2e3046');
    for(let i=0;i<6;i++){const x=20+i*104;R(x,236,80,4,'#c8c0b0');R(x+4,240,3,30,'#6a6a7a');R(x+72,240,3,30,'#6a6a7a');R(x+26,208,30,24,'#141418');R(x+28,210,26,20,i%2?'#1a2a4a':'#0e0e18');R(x+38,232,6,4,'#141418');
      R(x+60,224,8,12,'#e8e8e8');F.plant(x+12,236,i,0)}
    R(560,120,60,90,'#2a6a5a');for(let k=0;k<6;k++)R(564,126+k*14,52,10,k%2?'#3affd8':'#1a4a3a');// серверная стойка
    for(let i=0;i<30;i++)R(hash(i,1)*AW,276+hash(1,i)*80,6,3,'#e8e8e0');// бумаги
    if(o.blood)for(let i=0;i<14;i++)E(80+hash(i,3)*480,300+hash(3,i)*40,4+hash(i,i)*8,2,'#6a0a14')}),0,0);
  const fl=Math.sin(t*17)*Math.sin(t*5)>.4;if(!fl)for(let x=40;x<AW;x+=120){cone(x+30,32,60,160,178,'#e8f0ff',o.dark?.06:.08)}
  if(o.dark)glow(590,160,60,'#3affd8',.2)}
// офисное здание снаружи (стеклянный бизнес-центр)
function officeExt(t,o){o=o||{};C.sky(o.night?'night':'eve',t,{sx:560,sy:230});C.farCity(250,o.night?'#140c26':'#2e1648',{isaak:false,seed:9});
  C.g.drawImage(layer('oext:'+(o.night?1:0)+(o.ruin?1:0),AW,AH,()=>{const x=60,w=300,top=40,b=280,G='#1e2a4a';R(x,top,w,b-top,G);
    for(let y=top+6;y<b-40;y+=14)for(let k=0;k<w-8;k+=20){const v=hash(k,y);const lit0=o.ruin?(v<.08?'#ff7a20':v<.2?'#3a1a1a':'#0a0e18'):(v<.45?'#a8e0ff':v<.6?'#ffe8a0':'#2a3a6a');R(x+4+k,y,18,11,lit0);if(!o.ruin)R(x+4+k,y,18,1,'#e8f8ff')}
    R(x,top-6,w,6,'#3a4a6a');R(x+w/2-50,b-40,100,40,'#0a1020');R(x+w/2-46,b-36,92,36,o.ruin?'#1a1418':'#e8f8ff');R(x+w/2,b-36,2,36,'#3a4a6a');
    neonT(o.ruin?'':'БЦ «ГОРИЗОНТ»',x+w/2,top+18);
    const x2=400,w2=200,top2=100;R(x2,top2,w2,b-top2,'#2a2440');for(let y=top2+8;y<b-30;y+=16)for(let k=0;k<w2-8;k+=16){const v=hash(k+7,y);R(x2+5+k,y,12,11,o.ruin?(v<.1?'#ff7a20':'#0a0a12'):(v<.4?'#ffe0a0':'#1a1a3a'))}
    R(0,280,AW,80,'#3a3448');dith(0,280,AW,80,'#4a4258',.2);for(let x=0;x<AW;x+=48)R(x,280,1,80,'#2a2438');R(0,280,AW,2,'#6a6478')}),0,0);
  if(!o.ruin)glow(210,260,120,'#a8e0ff',.18)}
function neonT(s,cx,y){if(!s)return;const w=txtW(s,2);R(cx-w/2-4,y-4,w+8,18,'#0a0e18');neonTxt(s,cx-w/2,y,'#3affd8',2)}
// ---------- студия новостей ----------
function newsStudio(t,o){o=o||{};C.g.drawImage(layer('news',AW,AH,()=>{R(0,0,AW,AH,'#0a0e2a');for(let x=0;x<AW;x+=40)R(x,0,20,AH,'#0e1436');dith(0,0,AW,AH,'#1a2a6a',.15);
    R(0,250,AW,110,'#141a3a');R(0,250,AW,3,'#3a6aff');R(60,220,300,60,'#e8eef8');R(60,220,300,5,'#c81e3a');R(60,226,300,2,'#ffffff');txt('НЕВА 24',150,250,'#c81e3a',3)}),0,0);
  // экран за спиной
  const sx=380,sy=50,sw=230,sh=150;R(sx-6,sy-6,sw+12,sh+12,'#1a1a2e');R(sx-4,sy-4,sw+8,sh+8,'#3a6aff');
  if(o.inset){const c=insetCanvas(o.inset,t,o.key||'');C.g.drawImage(c,0,0,AW,AH,sx,sy,sw,sh)}else R(sx,sy,sw,sh,'#000');
  for(let y=sy;y<sy+sh;y+=2)C.g.fillStyle='rgba(0,0,0,.18)',C.g.fillRect(sx,y,sw,1);
  if(o.map)o.map(sx,sy,sw,sh,t);
  glow(200,120,200,'#3a6aff',.15);
  C.hero('r',200,240,t,o.talk===false?'stand':'talk',{flip:false,noShadow:1});
  R(60,226,300,1,'#ffffff');R(54,238,312,44,'#d8e0f0');R(54,238,312,4,'#c81e3a');txt('НЕВА 24',150,256,'#c81e3a',3);
  R(160,296,AW-160,22,'#c81e3a');const tw=txtW(o.tag||'ЭКСТРЕННО',2)+16;R(160,296,tw,22,'#ffffff');txt(o.tag||'ЭКСТРЕННО',168,303,'#c81e3a',2);txt(o.head||'',176+tw,303,'#ffffff',2);if(C.cam&&C.cam.x==null){C.cam.x=400;C.cam.y=196}}
// вставка: рендер сцены в отдельный холст 640×360
const INS={};function insetCanvas(fn,t,key){let c=INS[key];if(!c){c=document.createElement('canvas');c.width=AW;c.height=AH;c.getContext('2d').imageSmoothingEnabled=false;INS[key]=c}const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,AW,AH);C.use(x,()=>fn(t));return c}
// карта заражения (для новостей)
function infMap(sx,sy,sw,sh,t,greens){R(sx,sy,sw,sh,'#0a1a2a');const pts=[['ПЕТРОГРАДКА',.35,.3],['ВАСЬКА',.2,.4],['НЕВСКИЙ',.55,.55],['ДУМСКАЯ',.5,.5],['ГОРЬКОВСКАЯ',.45,.28],['ЗАЯЧИЙ',.42,.38],['ЮГ',.5,.85],['КОЛОМЯГИ',.3,.1]];
  R(sx,sy+sh*.42,sw,8,'#1a4a8a');R(sx+sw*.3,sy,6,sh,'#1a4a8a');
  for(const [n,x,y] of pts){const g=greens&&greens.includes(n),c=g?'#3aff7a':'#ff2a3a';const px=sx+x*sw,py=sy+y*sh;glow(px,py,22,c,.3+Math.sin(t*4+x*9)*.1);R(px-3,py-3,6,6,c);txt(n,px+5,py-2,'#ffffff',1)}}
// ---------- раздевалка фитнеса ----------
function locker(t,o){room(t,{wall:'#2a3a5a',pat:3,floor:'#5a5a6a',lamp:true,lx:320});
  for(let i=0;i<10;i++){const x=40+i*58;R(x,110,52,180,i===4?'#ff5aa8':'#4a6aa8');R(x,110,52,3,'#8aaae8');R(x+2,116,48,6,'#2a3a6a');R(x+42,190,4,14,'#c8ccd4');for(let k=0;k<4;k++)R(x+10,124+k*4,32,1,'#2a3a6a');txt(String(13+i),x+18,140,'#ffffff',1)}
  R(60,262,520,8,'#c8a070');R(80,270,4,20,'#6a4a2a');R(540,270,4,20,'#6a4a2a');R(20,40,120,50,'#141418');txt('NO PAIN',30,52,'#ff5aa8',2);txt('NO GAIN',30,68,'#3affd8',2)}
// ---------- клуб «Грибыч» ----------
function clubExt(t,o){o=o||{};C.sky('night',t,{mx:100,my:60});C.facades(300,{seed:5,night:1,base:290,h0:150,h1:200});
  const cx=330;R(cx-120,90,240,200,'#1a1424');R(cx-120,90,240,4,'#3a2a4a');for(let y=100;y<280;y+=12)R(cx-120,y,240,1,'#140e1c');
  // гриб-вывеска
  const on=Math.sin(t*6)>-.85;const gc=on?'#ff4fd8':'#5a1a4a';E(cx,128,46,22,'#140e1c');for(let a=0;a<TAU;a+=.05){P(cx+Math.cos(a)*44,128+Math.sin(a)*20,gc)}R(cx-44,128,88,1,gc);
  for(let i=0;i<5;i++){E(cx-30+i*15,118-Math.abs(i-2)*3,4,3,on?'#ffe23a':'#5a5a1a')}R(cx-8,128,16,24,'#140e1c');for(let y=128;y<152;y++){P(cx-8,y,on?'#3affd8':'#1a4a4a');P(cx+8,y,on?'#3affd8':'#1a4a4a')}
  if(on){glow(cx,130,120,'#ff4fd8',.3)}neonTxt('ГРИБЫЧ',cx-txtW('ГРИБЫЧ',3)/2,160,'#3affd8',3,Math.sin(t*4+1)>-.9);
  const d=o.door||0;R(cx-26,210,52,80,'#0a0610');if(d>0){R(cx-24,212,48*d,78,'#ff4fd8');glow(cx,250,90*d,'#ff4fd8',.5*d);for(let i=0;i<6;i++)R(cx-24+hash(i,Math.floor(t*8))*48*d,212+hash(Math.floor(t*8),i)*78,3,3,['#3affd8','#ffe23a','#ffffff'][i%3])}
  R(cx-30,206,60,4,'#3a2a4a');R(cx+40,230,4,60,'#c8c8d0');R(cx+40,232,30,2,'#c81e3a');R(cx+68,230,4,60,'#c8c8d0');
  C.street(290,t,{night:1});C.lampSpb(120,290,true);C.lampSpb(560,290,true)}
function clubIn(t,o){o=o||{};C.g.drawImage(layer('clubin',AW,AH,()=>{R(0,0,AW,AH,'#0a0614');for(let x=0;x<AW;x+=60)R(x,0,2,260,'#1a1028');R(0,260,AW,100,'#140c20');
    for(let y=262;y<AH;y+=12)for(let x=((y/12)%2)*20;x<AW;x+=40)R(x,y,20,12,'#1e1230');
    R(220,150,200,60,'#1a1424');R(220,150,200,3,'#ff4fd8');R(240,138,60,12,'#2a2a34');R(340,138,60,12,'#2a2a34');E(270,144,10,4,'#1a1a1e');E(370,144,10,4,'#1a1a1e');
    R(30,190,140,70,'#2a1a14');R(30,186,140,6,'#6a4a2a');for(let i=0;i<14;i++)R(36+i*9,150,6,30,['#3a8a3a','#c89a3a','#8a3a8a','#3a6ac8'][i%4]);R(30,146,140,4,'#4a3a2a');
    for(let i=0;i<3;i++)F.speaker(460+i*44,262,90,0)}),0,0);
  for(let i=0;i<6;i++){const a=Math.sin(t*1.5+i)*.8+Math.PI/2,c=['#ff4fd8','#3affd8','#ffe23a','#7a5aff','#ff3a3a','#5aff7a'][i];C.g.save();C.g.globalCompositeOperation='lighter';C.g.strokeStyle=c;C.g.globalAlpha=.55;C.g.lineWidth=1;C.g.beginPath();C.g.moveTo(320,20);C.g.lineTo(320+Math.cos(a)*600,20+Math.sin(a)*600);C.g.stroke();C.g.restore()}
  glow(320,20,40,'#ffffff',.5);for(let i=0;i<14;i++){const x=hash(i,3)*AW,y=40+hash(3,i)*200;if(Math.sin(t*5+i)>.3)glow(x,y,8,'#ffffff',.3)}
  for(let i=0;i<12;i++){const x=hash(i,6)*AW,y=262+hash(6,i)*80,c=['#ff4fd8','#3affd8','#ffe23a'][i%3];if(Math.sin(t*3+i)>0)glow(x,y,26,c,.18)}}
// ---------- подвал и коллектор ----------
function cellarDoor(t,o){o=o||{};C.g.drawImage(layer('cellar',AW,AH,()=>{R(0,0,AW,AH,'#2a1a1a');for(let y=0;y<300;y+=10)for(let x=((y/10)%2)*14;x<AW;x+=28){R(x,y,27,9,y%20?'#7a3a2a':'#6a3222');R(x,y,27,1,'#8a4a3a')}
    dith(0,0,AW,300,'#1a0a0a',.3);R(0,300,AW,60,'#3a3030');for(let x=0;x<AW;x+=30)R(x,300,1,60,'#2a2222');
    R(250,130,140,170,'#3a3e44');R(250,130,140,4,'#6a6e76');R(256,136,128,164,'#4a4e56');for(let y=140;y<300;y+=24)R(256,y,128,2,'#3a3e44');R(370,210,8,20,'#c8a040');
    for(let i=0;i<4;i++){R(180,300+i*12,280,12,'#4a4040');R(180,300+i*12,280,2,'#5a5050')}
    R(100,60,12,240,'#4a5a4a');R(530,60,12,240,'#4a5a4a');R(100,60,442,10,'#4a5a4a')}),0,0);
  R(318,40,4,40,'#1a1a1a');E(320,86,7,9,'#fff6c8');glow(320,86,150,'#ffd88a',.35+Math.sin(t*13)*.03);cone(320,90,20,280,210,'#ffe8b0',.08)}
function sewerExit(t,o){o=o||{};R(0,0,AW,AH,'#0a0a0e');const cx=430,cy=180;
  for(let r=300;r>60;r-=20){const c=mix('#0a0a0e','#3a3a3a',(300-r)/300);E(cx-(r-60)*.8,cy,r*.9,r,c)}
  E(cx,cy,70,80,'#fff6d8');glow(cx,cy,220,'#fff0c0',.5);dith(cx-70,cy-80,140,160,'#ffffff',.3);
  C.grass(cy+40,cy+80,'#4a8a3a','#8ad84a',3);R(cx-70,cy+40,140,40,'#6ab84a');
  for(let i=0;i<30;i++){const k=((t*.1+hash(i,2))%1);P(cx-60+hash(i,5)*120,cy-80+k*160,'#ffffff')}
  R(0,300,AW,60,'#1a1a1e');for(let y=300;y<AH;y+=3)R(0,y,AW,1,y%6?'#22222a':'#1a1a20');R(0,296,AW,4,'#3a5a6a');for(let x=0;x<AW;x+=20)R(x+Math.sin(t*2+x)*3,298,10,1,'#5a8a9a')}
Object.assign(C,{FURN:F,room,living,kitchen,pcRoom,liftIn,officeIn,officeExt,neonT,newsStudio,insetCanvas,infMap,locker,clubExt,clubIn,cellarDoor,sewerExit});
})();
