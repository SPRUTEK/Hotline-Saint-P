// cine6.js — гл.6 «Перелесье»: катсцена заправки (пилот кинематографичных катсцен, 06.11)
(function(){
'use strict';
const C=window.CINE;if(!C||!window.C6||!C6.CUTS||!C6.CUTS.CUT_GAS)return;
const {AW,AH,R,P,dith,skyBands,glow,cone,txt,txtW,neonTxt,forest,grass,asphalt,motes,carX6,carPick,putS,shadow,hero,hash,lit,drk,mix}=C;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// ---------- заправка на закате ----------
function sunsetSky(t){skyBands([[0,'#1a0c3e'],[40,'#3a1260'],[85,'#7a1e7a'],[125,'#d23a7a'],[160,'#ff7a5a'],[190,'#ffb86a'],[205,'#ffe2a0']]);
  // солнце
  const sx=520,sy=196;glow(sx,sy,90,'#ff8a4a',.45);for(let j=-16;j<=0;j++){const w=Math.sqrt(16*16-j*j);R(sx-w,sy+j,w*2,1,j>-4?'#fff4c8':'#ffe08a')}
  for(let j=-14;j<0;j+=3)R(sx-20,sy+j,40,1,'#ffb86a');
  // облака-полосы
  const cl=(x,y,w,c)=>{R(x,y,w,2,c);R(x+6,y-1,w-14,1,c);R(x+w*.3,y+2,w*.5,1,drk(c,.2))};
  for(let i=0;i<7;i++){const x=((hash(i,4)*AW*1.4+t*(2+i*.4))%(AW+160))-120,y=50+hash(4,i)*110;cl(x,y,60+hash(i,9)*90,y<110?'#5a1a6a':'#ff6a7a')}
  // птицы
  for(let i=0;i<4;i++){const x=(330+i*14+t*12)%AW,y=70+Math.sin(t*2+i)*3+i*5,f=Math.floor(t*6+i)%2;P(x,y,'#2a0a2a');P(x-1,y-f,'#2a0a2a');P(x+1,y-f,'#2a0a2a')}}
function gasStation(t,o){o=o||{};
  sunsetSky(t);
  // лес: три плана
  forest(212,3,'#4a1a50',22,40,14,null,t);forest(220,7,'#2c1036',30,58,17,'#7a2a6a',t);
  // поле и обочина
  R(0,222,AW,20,'#2a1a2a');for(let x=0;x<AW;x+=3)R(x,222+(x*7)%6,1,2,'#3a2238');
  // площадка заправки (плиты)
  R(0,238,AW,62,'#4a4258');for(let x=0;x<AW;x+=32)R(x,238,1,62,'#3a3446');for(let y=238;y<300;y+=14)R(0,y,AW,1,'#3a3446');
  dith(0,238,AW,62,'#5a5070',.12);
  // дорога
  asphalt(300,360,'#25212e',11);R(0,300,AW,2,'#6a6478');for(let x=-((t*0)%40);x<AW;x+=40)R(x,334,22,2,'#d8d0a8');
  // магазин справа
  const sx0=440;R(sx0,150,190,90,'#d8d4e0');R(sx0,150,190,6,'#2a2a38');R(sx0,156,190,2,'#f04a6a');
  R(sx0+10,172,90,56,'#ffe6a8');for(let i=0;i<4;i++)R(sx0+10+i*23,172,2,56,'#8a8494');R(sx0+10,198,90,2,'#8a8494');
  for(let i=0;i<5;i++){R(sx0+16+i*17,206,10,22,'#c84a6a');R(sx0+16+i*17,206,10,3,'#4ab8d8');R(sx0+18+i*17,214,6,2,'#f0c040')}// полки внутри
  R(sx0+20,180,14,12,'#2a2a38');R(sx0+22,182,10,7,'#7adfff');// кофемашина
  R(sx0+112,176,30,52,'#4a5266');R(sx0+113,177,28,50,'#7a8aa8');R(sx0+126,177,2,50,'#4a5266');R(sx0+138,200,2,6,'#d8d8e0');
  neonTxt('КОФЕ',sx0+150,184,'#ff4fd8',2,Math.sin(t*5)>-.8);neonTxt('24',sx0+156,200,'#3affd8',3);
  glow(sx0+55,200,70,'#ffd88a',.25);
  // навес
  const cx0=70,cx1=410;for(let px of [100,250,380]){R(px,92,8,150,'#c8c4d4');R(px,92,2,150,'#ffffff');R(px+6,92,2,150,'#8a86a0');R(px,170,8,6,'#e82a3a');R(px,182,8,6,'#e82a3a')}
  R(cx0-6,70,cx1-cx0+12,24,'#e8263a');R(cx0-6,70,cx1-cx0+12,3,'#ff6a7a');R(cx0-6,90,cx1-cx0+12,4,'#8a1020');R(cx0-6,80,cx1-cx0+12,3,'#ffffff');
  R(cx0-6,94,cx1-cx0+12,5,'#3a3446');for(let x=cx0;x<cx1;x+=24){R(x,95,16,2,'#fffbe8');cone(x+8,97,16,60,140,'#fff2c8',.16)}
  neonTxt('АЗС · 24 ЧАСА',cx0+(cx1-cx0)/2-txtW('АЗС · 24 ЧАСА',2)/2,74,'#ffffff',2);
  // стела с ценами
  R(16,120,40,118,'#2a2a38');R(18,122,36,20,'#e8263a');txt('АЗС',24,128,'#ffffff',2);
  const pr=[['92','56.40'],['95','61.10'],['ДТ','68.90']];pr.forEach(([a,b],i)=>{R(20,148+i*16,32,13,'#0a0a14');txt(a,22,152+i*16,'#ffe23a',1);txt(b,32,152+i*16,'#ff6a3a',1)});
  // колонки
  for(const px of [170,320]){R(px,190,34,52,'#e8e8f0');R(px,190,34,4,'#e8263a');R(px+4,198,26,14,'#0a1a24');txt('92',px+7,201,'#3affd8',1);txt(String(56+Math.floor(t*3)%9),px+18,204,'#ffe23a',1);
    R(px+6,218,8,14,'#2a2a38');R(px+20,218,8,14,'#2a2a38');R(px+28,214,4,10,'#1a1a22');R(px+31,224,1,14,'#1a1a22');R(px,240,34,2,'#8a86a0');glow(px+17,205,26,'#3affd8',.18)}
  // свет под навесом на плитах
  glow(250,250,170,'#fff2c8',.14);
  motes(t,cx0,100,cx1-cx0,120,'#fff6c8',22,5);
}
// ---------- поле у Перелесья ----------
function field(t){skyBands([[0,'#2a1458'],[60,'#5a2a8a'],[120,'#c84a8a'],[170,'#ffa86a'],[200,'#ffd8a0']]);
  glow(140,190,90,'#ff9a5a',.4);forest(205,13,'#3a1a4a',24,44,13,null,t);forest(214,17,'#24102e',30,62,16,'#6a2a6a',t);
  grass(214,360,'#2a4a2a','#4a8a3a',21);for(let x=0;x<AW;x+=10){R(x,228,3,40,'#8a6a40');R(x,228,3,2,'#b08a5a')}R(0,236,AW,2,'#6a4a2a');R(0,252,AW,2,'#6a4a2a');
  R(0,300,AW,60,'#4a3a2a');for(let i=0;i<300;i++)P(hash(i,77)*AW,300+hash(77,i)*60,hash(i,1)<.5?'#5a4a36':'#3a2a1e');
  motes(t,0,180,AW,120,'#fff0c0',30,9)}
const S=C6.CUTS.CUT_GAS;
S[0].draw=C.shot(function(t){gasStation(t);
  putS(carX6(),40,292);shadow(120,293,150);putS(carPick(false),400,292);shadow(478,293,150);
  hero('st',372,288,t,'stand',{beer:true})});
S[1].draw=C.shot(function(t){gasStation(t);const k=clamp(t/5,0,1);
  putS(carX6(),30,292);shadow(110,293,150);putS(carPick(k>.45),400,292);shadow(478,293,150);
  const x=150+k*230;hero('st',x,288,t,k<1?'walk':'stand',{bag:k<.45||k>1?'#2a2a2a':null});
  if(k<.45){R(x-14,252,14,12,'#2a2a2a');R(x-12,250,10,2,'#4a4a4a')}});
S[2].draw=C.shot(function(t){gasStation(t);putS(carX6(),30,292);shadow(110,293,150);const x=400+t*90;putS(carPick(true),x,292);
  for(let i=0;i<10;i++){const a=(t*3+i*.3)%1;C.g.fillStyle='rgba(200,190,210,'+(.35*(1-a))+')';C.g.fillRect(Math.round(x-6-a*40),Math.round(284-a*14+hash(i,2)*4),3+a*6,2+a*4)}});
S[3].draw=C.shot(function(t){field(t);putS(carX6(),220,330);shadow(300,331,150);
  hero('m',200,326,t,'stand');hero('vd',408,326,t,'stand',{flip:true});hero('st',448,326,t,'stand',{beer:true,flip:true})});
})();
