// =====================================================================
//  ГЛАВА 6 — «Резня бензопилой в Перелесье». Микроб, Владос (серая X6)
//  и Столыпин (пиво) едут спасать родителей Микроба. Оружие потеряно —
//  у бати бензопилы. Участок → лес → коттеджная улица → ферма → леший.
//  Подключается после level5.js. Наружу: window.C6.
// =====================================================================
(function(){
'use strict';
if(!window.K56){console.warn('level6: нет kit56');return}
const K=K56,X=C1.X,E=C1.engine,PS=C1.PS,TAU=Math.PI*2,D2=K.D2,angDiff=K.angDiff,Q=K.Q,B=K.B,sfx=X.sfx,TOP=HQ.top;
const C6={on:false,done:false,started:false,sec:null,menu:null,kills0:0,flags:{alisa:false},myK:0};window.C6=C6;
const hold=K.hold;

// ================= МУЗЫКА =================
K.addMusic([['kalinka','kalinka.mp3'],['smajte','smajte.mp3'],['misund','misunderstanding.mp3'],['smoke','smoke.mp3'],['ride','ride.mp3'],['tommy','tommy.mp3']]);
const MZ6={call:'flat',x6:'tek2',gas:'rave_station',dacha:'zombie',forest:'fuckedup',street:'hahaa',farm:'misund',boss:'kupala',end:'smoke',hq:'flat',final:'menu'};
const mz6=k=>K.music(MZ6[k]);

// ================= МИКРОБ С БЕНЗОПИЛОЙ =================
function drawMikSaw(g){
  g.clearRect(0,0,24,24);const J='#8f9298',JD='#686b72',SK='#e4b495',HR='#33241b';
  if(C6.shov){const k=C6.shSw>0?Math.sin((1-C6.shSw/.3)*Math.PI)*3:0;P(g,10,15,6,2,J);P(g,15,15,2,2,SK);P(g,10,7,6,2,J);P(g,15,7,2,2,SK);P(g,8,13+k*.3,16,1.6,'#8a6a40');P(g,23,11,4,6,'#8a9098');P(g,26,11,1,6,'#c8ccd4')}else TOP.sawBlade(g,13,tm+(C6.saw>0?.3:0));
  ell(g,11,12,4.6,7.6,J);ell(g,9.6,12,3,6.6,JD);P(g,14,8,1,8,'#ececec');
  ell(g,12,12,4,4,HR);P(g,14,10,2,4,SK);P(g,15,10,1,4,'#4a3223');P(g,16,10,.6,1.5,'#ecb73c');P(g,16,12.5,.6,1.5,'#ecb73c');P(g,15.5,9.5,1,.5,'#111');
  if(C6.boost>0){P(g,8,7,1,1,'#ffd23a');P(g,8,16,1,1,'#ffd23a')}
  outline(g,'#0b0910');
}
const HERO={draw:drawMikSaw,leg:'#1c1c22',shoe:'#9a9ca2'};

// ================= ЗОМБИ ПЕРЕЛЕСЬЯ =================
// 600..603 дачники, 610..611 фермеры с вилами, 620..621 зомби-куры, 630 бабки-крикуньи в платках,
// 640 громила-тракторист, 650 зомби-леший (босс), 660..661 грибники, 670..671 вороны
function zLo(v,kind){
  const c=mk(24),g=c.getContext('2d',{willReadFrequently:true});const SK=['#86a478','#7a9a6c','#90aa80'][v%3];
  if(kind==='dach'){const C=['#2a3a8a','#3a3a3a','#8a2a2a','#2a6a3a'][v%4];P(g,11,6,8,3,C);P(g,18,6,3,3,SK);P(g,11,15,8,3,C);P(g,18,15,3,3,SK);ell(g,11,12,4.6,7.4,C);
    P(g,8,5,1,14,'#f4f4f4');P(g,10,5,1,14,'#f4f4f4');ell(g,12,12,4,4,v%2?'#3a2a20':'#c8c8c8');if(v===2){P(g,9,10,6,4,'#e8e8f0');P(g,10,9,4,1,'#c82a2a')}P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
  if(kind==='farm'){P(g,11,6,8,3,'#4a6a8a');P(g,18,6,3,3,SK);P(g,11,15,8,3,'#4a6a8a');P(g,18,15,3,3,SK);ell(g,11,12,4.6,7.4,'#4a6a8a');P(g,9,7,2,10,'#3a5a7a');
    ell(g,12,12,4.4,4.4,'#c8a860');P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030');P(g,14,15,10,1,'#8a6a40');P(g,22,13,1,5,'#a8a8b0');P(g,20,13,1,5,'#a8a8b0')}
  if(kind==='hen'){ell(g,11,12,5,4,'#f0ece4');ell(g,10,12,3.6,3,'#d8d4cc');P(g,4,11,3,2,'#e8e4dc');ell(g,16,12,2.4,2.4,'#f0ece4');P(g,15,9,3,2,'#d8302a');P(g,18,11,3,2,'#e8b040');P(g,16,11,1,1,'#ff2020');P(g,9,10,2,1,'#8a1a22')}
  if(kind==='baba'){P(g,11,7,8,2,'#5a3a6a');P(g,18,6,3,3,'#c8ccd0');P(g,11,15,8,2,'#5a3a6a');P(g,18,15,3,3,'#c8ccd0');ell(g,11,12,3.8,6.8,'#5a3a6a');
    ell(g,13,12,3.8,3.6,'#d83a5a');for(let i=0;i<5;i++)P(g,11+i,10+(i%2)*3,1,1,'#ffd23a');ell(g,16.5,12,1.8,2.2,'#120608');P(g,16,11,1,1,'#ff3030')}
  if(kind==='grib'){P(g,11,6,8,3,'#5a6a3a');P(g,18,6,3,3,SK);P(g,11,15,8,3,'#5a6a3a');P(g,18,15,3,3,SK);ell(g,11,12,4.8,7.6,'#5a6a3a');P(g,3,14,7,6,'#a87a48');P(g,4,15,2,2,'#c83a2a');P(g,7,15,2,2,'#e8d8b0');
    ell(g,12,12,4,4,'#4a5a2a');P(g,15,10,2,5,SK);P(g,16,10,1,1,'#ff3030');P(g,16,14,1,1,'#ff3030')}
  if(kind==='crow'){const w=v%2?3:1;P(g,6,12-w-4,8,3,'#1a1a22');P(g,6,13+w+1,8,3,'#1a1a22');ell(g,11,12,4,2.6,'#22222a');P(g,4,11,3,3,'#1a1a22');ell(g,15.5,12,2,2,'#22222a');P(g,17,11,3,2,'#3a3a3a');P(g,15,11,1,1,'#ff2020')}
  outline(g,'#0b0910');return c;
}
function zTractor(){const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});const SK='#6f8f5a';
  P(g,14,3,12,6,SK);P(g,14,23,12,6,SK);ell(g,14,16,8,11.5,'#3a4a6a');ell(g,12,16,6,10,'#2a3a5a');P(g,10,8,3,16,'#4a5a7a');ell(g,18,16,5,5,SK);P(g,15,12,6,2,'#e8e8e8');P(g,21,13,1,1,'#ff2020');P(g,21,18,1,1,'#ff2020');P(g,6,14,4,4,'#c8a040');outline(g,'#0b0910');return c}
function zLeshy(){const c=mk(32),g=c.getContext('2d',{willReadFrequently:true});const BK='#4a3a26',BD='#2a2016',MS='#4a7a2a';
  g.strokeStyle=BK;g.lineWidth=2;g.beginPath();g.moveTo(22,10);g.lineTo(30,2);g.moveTo(26,6);g.lineTo(31,8);g.moveTo(22,22);g.lineTo(30,30);g.moveTo(26,26);g.lineTo(31,24);g.stroke();
  P(g,10,2,10,6,BK);P(g,10,24,10,6,BK);P(g,18,2,4,4,MS);P(g,18,26,4,4,MS);
  ell(g,13,16,9,12,BK);for(let y=6;y<27;y+=3)P(g,6,y,14,1,BD);ell(g,13,16,6,8,MS);for(let i=0;i<14;i++)P(g,6+Math.floor(hash(i,4)*14),6+Math.floor(hash(4,i)*20),2,1,i%2?'#7aa83a':'#3a5a1a');
  ell(g,20,16,5.4,5.4,BK);ell(g,20,16,3.6,3.6,'#5a7a2a');P(g,23,13,2,2,'#9aff4a');P(g,23,18,2,2,'#9aff4a');P(g,16,12,3,3,'#c83a2a');P(g,17,12,1,1,'#fff');
  outline(g,'#0b0910');return c}
for(let v=0;v<4;v++)X.zCache['normal'+(600+v)]=zLo(v,'dach');
for(let v=0;v<2;v++){X.zCache['normal'+(610+v)]=zLo(v,'farm');X.zCache['crawler'+(620+v)]=zLo(v,'hen');X.zCache['normal'+(660+v)]=zLo(v,'grib');X.zCache['crawler'+(670+v)]=zLo(v,'crow')}
X.zCache['screamer630']=zLo(0,'baba');X.zCache['brute640']=zTractor();X.zCache['boss650']=zLeshy();
const r4=n=>(Math.random()*n)|0;
const Zd=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:600+r4(4),hp:60,max:60,sp:24},o||{}));
const Zf=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:610+r4(2),hp:80,max:80,sp:26},o||{}));
const Zhen=(x,y,o)=>E.addZ('crawler',x,y,Object.assign({v:620+r4(2),hp:16,max:16,sp:58,r:3},o||{}));
const Zbab=(x,y,o)=>E.addZ('screamer',x,y,Object.assign({v:630,hp:40,max:40},o||{}));
const Ztr=(x,y,o)=>E.addZ('brute',x,y,Object.assign({v:640,hp:500,max:500},o||{}));
const Zgr=(x,y,o)=>E.addZ('normal',x,y,Object.assign({v:660+r4(2),hp:55,max:55,sp:26},o||{}));
const Zcrow=(x,y,o)=>E.addZ('crawler',x,y,Object.assign({v:670+r4(2),hp:14,max:14,sp:70,r:3},o||{}));
C1.seenT=C1.seenT||{};

// ================= БЕНЗОПИЛА, ПИВО, РЫВОК =================
Object.assign(C6,{saw:0,sawT:0,boost:0,dashCd:0,dash:0,lastSyr:0,sndT:0});
function sawTick(dt){
  const L=E.L;PS.wpn='bat';PS.hasShotgun=false;PS.moon=0;PS.cd=1;
  if(C6.saw>0)C6.saw-=dt;if(C6.boost>0)C6.boost-=dt;if(C6.dashCd>0)C6.dashCd-=dt;K.sawBuff=C6.boost>0;
  // пиво: H выпить — буст 10 с
  if(PS.syr<C6.lastSyr){PS.regen=Math.max(0,PS.regen-60);C6.boost=10;PS.hp=Math.min(PS.max,PS.hp+20);sfx('pick');sfx('hiss',.6);note('*пш-ш-ш* Пиво! БУСТ: зомби разлетаются, пила режет вдвое злее');X.floatT(pl.x,pl.y-14,'БУСТ!','#ffd23a')}
  C6.lastSyr=PS.syr;
  const free=!dlg&&!tr&&!lockMove&&L.armed;if(!free)return;
  // буст: лёгкое пошатывание
  if(C6.boost>0){const w=Math.sin(tm*3)*.35*dt*20;if(!K.solid(pl.x+w,pl.y,3.5))pl.x+=w}
  // рывок: Q или правая кнопка
  if(C6.dash>0){C6.dash-=dt;const sp=320*dt;const nx=pl.x+Math.cos(C6.da)*sp,ny=pl.y+Math.sin(C6.da)*sp;if(!K.solid(nx,pl.y,3.5))pl.x=nx;if(!K.solid(pl.x,ny,3.5))pl.y=ny;PS.inv=Math.max(PS.inv,.1);
    for(const z of L.zs){if(z.dead||z.st==='hidden'||z.dh)continue;if(D2(z.x,z.y,pl.x,pl.y)<z.r+9){z.dh=1;X.hurtZ(z,z.type==='boss'?30:60,C6.da,240);X.blood(z.x,z.y,C6.da,6,true)}}
    if(C6.dash<=0)for(const z of L.zs)z.dh=0}
  const btn=C1.fire!=null||C1.fireQ;
  const firing=(C1.mdown&&mouse.on&&!touch.on)||X.touchFiring()||btn;
  if(C6.shov){if(C6.shCd>0)C6.shCd-=dt;if(C6.shSw>0)C6.shSw-=dt;if(firing&&C6.shCd<=0){C6.shCd=.58;C6.shSw=.3;sfx('swing',.8);const a=pl.a,bst=C6.boost>0;let hit=0;
      for(const z of L.zs.slice()){if(z.dead||z.st==='hidden')continue;const d=D2(pl.x,pl.y,z.x,z.z===undefined?z.y:z.y);if(d>z.r+31)continue;const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(Math.abs(angDiff(za,a))>1)continue;
        let dmg=z.type==='boss'?22:38;if(bst)dmg*=1.8;if(z.armor>0){z.armor-=dmg*(bst?2:.3);if(z.armor<=0){z.armor=0;X.floatT(z.x,z.y-20,'КОРА ТРЕСНУЛА!','#ffd23a')}continue}
        X.hurtZ(z,dmg,za,z.type==='boss'?0:260);X.blood(z.x,z.y,za,3,false);hit++;if(z.dead)C6.myK++}
      if(hit){sfx('bat',.9);C1.shake=Math.max(C1.shake,.15)}}return}
  if(firing){C6.saw=.12;C6.sawT-=dt;C6.sndT-=dt;if(C6.sndT<=0){C6.sndT=.11;sfx('rifle',.22);if(Math.random()<.2)sfx('hiss',.3)}
    if(C6.sawT<=0){C6.sawT=.09;let hit=0;const a=pl.a,bst=C6.boost>0;
      for(const z of L.zs.slice()){if(z.dead||z.st==='hidden')continue;const d=D2(pl.x,pl.y,z.x,z.y);if(d>z.r+19)continue;const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(d>z.r+5&&Math.abs(angDiff(za,a))>1)continue;
        let dmg=z.type==='boss'?7:16;if(bst)dmg*=1.8;
        if(z.armor>0){const k=bst?3:.25;z.armor-=dmg*k;if(z.armor<=0){z.armor=0;X.floatT(z.x,z.y-20,'КОРА ТРЕСНУЛА!','#ffd23a');sfx('axe',1.2)}if(Math.random()<.3)L.fx.push({x:z.x,y:z.y,vx:rnd(-40,40),vy:rnd(-40,40),life:.3,c:'#8a6a40'});if(!bst&&Math.random()<.04)note('Кора! Пила еле берёт — выпей пива (H)!');hit++;continue}
        X.hurtZ(z,dmg,za,z.type==='boss'?0:(bst?190:60));if(z.type==='boss'&&Math.random()<.6)z.flash=0;X.blood(z.x,z.y,za,2,false);hit++;if(z.dead)C6.myK++}
      // сухие деревья в лесу
      if(Q.dead)for(const t of Q.dead){if(t.down)continue;if(D2(t.x,t.y,pl.x,pl.y)<20){t.hp-=.09;L.fx.push({x:t.x,y:t.y,vx:rnd(-30,30),vy:rnd(-30,-5),life:.3,c:'#c8a060'});if(t.hp<=0)fell(t,pl.a)}}
      if(hit){C1.shake=Math.max(C1.shake,.08)}}}
  else C6.sawT=0;
}
function fell(t,a){t.down=1;t.a=a;sfx('thump',1.3);sfx('axe',.8);C1.shake=.8;X.floatT(t.x,t.y-14,'БЕРЕГИСЬ!','#ffd23a');
  const L=E.L,len=80,x1=t.x+Math.cos(a)*len,y1=t.y+Math.sin(a)*len;let n=0;
  for(const z of L.zs){if(z.dead||z.type==='boss')continue;const px=z.x-t.x,py=z.y-t.y,tt=px*Math.cos(a)+py*Math.sin(a);if(tt<0||tt>len)continue;if(Math.abs(px*Math.sin(a)-py*Math.cos(a))<9){X.hurtZ(z,999,a+Math.PI/2,0);n++}}
  const g=L.bx;g.save();g.translate(t.x,t.y);g.rotate(a);g.fillStyle='#5a4028';g.fillRect(0,-3,len,6);g.fillStyle='#7a5a38';g.fillRect(0,-3,len,2);for(let i=10;i<len;i+=12){g.fillStyle='#3a2a18';g.fillRect(i,-6,2,12)}g.restore();
  for(let i=0;i<len;i+=4)E.gfill(t.x+Math.cos(a)*i-2,t.y+Math.sin(a)*i-2,t.x+Math.cos(a)*i+2,t.y+Math.sin(a)*i+2,2);X.buildNav();
  if(n)note('Дерево накрыло зомби: '+n+'!')}
function dash(){if(C6.dashCd>0||!E.L||!E.L.armed||dlg||lockMove)return;C6.dashCd=3;C6.dash=.2;C6.da=pl.a;sfx('swing',.6);sfx('power',.4)}
addEventListener('keydown',e=>{if(e.code==='KeyQ'&&C6.on&&C1.on&&C1.mode==='td'&&K.on===C6&&!(window.MG&&MG.active))dash();
  if((e.code==='Digit3'||e.code==='Digit1')&&C6.on&&C6.saws&&!C6.gun&&C1.on&&C1.mode==='td'&&K.on===C6){const s=e.code==='Digit3';if(C6.shov!==s){C6.shov=s;sfx('click');note(s?'Лопата бати':'Бензопила')}}},true);
addEventListener('touchstart',e=>{if(!(C6.on&&C6.saws&&!C6.gun&&C1.on&&C1.mode==='td'&&K.on===C6))return;const t=e.changedTouches[0],x=(t.clientX-OX)/SC,y=(t.clientY-OY)/SC;if(x>4&&x<128&&y>14&&y<24){C6.shov=!C6.shov;sfx('click');e.stopImmediatePropagation()}},true);
addEventListener('mousedown',e=>{if(e.button===2&&C6.on&&C1.on&&C1.mode==='td'&&K.on===C6&&!(window.MG&&MG.active))dash()},true);
function hud6(){
  panel(4,4,124,38,.74);u.fillStyle='#e8701a';u.fillRect(4,4,2,38);
  uiFont(4,true);u.fillStyle='#9a92b0';u.fillText('HP',9,10.5);X.hudBar(20,6.5,70,4,PS.hp/PS.max,PS.hp<PS.max*.3?'#ff3a3a':'#3ef0b0');
  if(!C1.hard)for(let i=0;i<3;i++){const x=95+i*7,y=6;u.fillStyle=i<PS.lives?'#ff3a5a':'rgba(255,255,255,.18)';u.fillRect(x,y,2,1);u.fillRect(x+3,y,2,1);u.fillRect(x,y+1,5,2);u.fillRect(x+1,y+3,3,1);u.fillRect(x+2,y+4,1,1)}
  if(PS.arm&&PS.arm.max){const A=PS.arm,k=A.dur/A.max;u.fillStyle='rgba(0,0,0,.5)';u.fillRect(20,12,70,2);u.fillStyle=A.dur<=0?'#5a5a62':'#6ab8ff';u.fillRect(20,12,70*k,2);uiFont(3.4,true);u.fillStyle='#cfe0ff';u.fillText(A.dur<=0?'БР СЛОМАНА':'БР '+Math.ceil(A.dur),94,14)}
  uiFont(5,true);u.fillStyle='#ffa040';u.fillText((C6.shov?'ЛОПАТА БАТИ':'БЕНЗОПИЛА · ∞')+(C6.boost>0?'   БУСТ '+Math.ceil(C6.boost):'')+(touch.on?'  ⇄':'  [1/3]'),9,19);
  uiFont(4.4,false);u.fillStyle='#ffd23a';u.fillText('Пиво: '+PS.syr+(touch.on?'':' [H]')+'    Рывок: '+(C6.dashCd>0?Math.ceil(C6.dashCd)+'с':'готов')+(touch.on?'':' [Q]'),9,28);
  const vd=Q.allies.find(a=>a.kind==='vd'),st=Q.allies.find(a=>a.kind==='st');
  if(vd||st){uiFont(4.2,true);u.fillStyle='#c8d8ff';u.fillText('Владос '+(C6.vdK+(vd?vd.kills:0)),9,37);u.fillStyle='#ffb040';u.fillText('Столыпин '+(C6.stK+(st?st.kills:0)),48,37);u.fillStyle='#ffd23a';u.fillText('Ты '+C6.myK,94,37)}
  if(C6.boost>0){u.fillStyle=`rgba(255,200,40,${.05+.04*Math.sin(tm*6)})`;u.fillRect(0,0,W,H)}
}

// ================= УЧАСТКИ =================
function sec6(n){
  K.sec(C6,n,()=>{
    ({dacha:lvDacha,forest:lvForest,street:lvStreet,farm:lvFarm})[n]();
    mz6(n);const L=E.L;L.hero=HERO;L.noHud=true;L.healName='Пиво';L.healNote='*пш-ш-ш*';L.healNone='Пиво кончилось. Столыпин всё выпил.';
    const oi=L.onItem;L.onItem=it=>{if(it.kind==='pir'){PS.syr--;C6.lastSyr=PS.syr;PS.hp=Math.min(PS.max,PS.hp+35);X.floatT(it.x,it.y-6,'+35 HP · мамин пирожок','#e8a060')}if(oi)oi(it)};
  },sec6);
  gunMode();C6.lastSyr=PS.syr;C6.boost=0;C6.dashCd=0;
  K.tick=dt=>{if(C6.saws&&!C6.gun)sawTick(dt);if(K.L.onTick6)K.L.onTick6(dt)};
}
C6.go=sec6;
// 04.11: после возврата сумок — стволы; [4] переключает пилу и стволы
function gunMode(){const g=!!(C6.bagsBack&&C6.gun);C1.noWpn=!!C6.saws&&!g;K.hud=C6.saws&&!g?hud6:null}
C6.gunMode=gunMode;
addEventListener('keydown',e=>{if(e.code==='Digit4'&&C6.on&&C6.bagsBack&&C6.saws&&C1.on&&C1.mode==='td'&&K.on===C6){C6.gun=!C6.gun;gunMode();sfx('click');note(C6.gun?'Стволы из сумок':'Бензопила бати (4 — обратно к стволам)');e.stopImmediatePropagation()}},true);
function bagsBack(){C6.bagsBack=true;C6.gun=true;try{if(window.UP&&UP.giveBack)UP.giveBack()}catch(e){}gunMode()}
C6.bagsBackFn=bagsBack;
const playC6=(shots,onEnd,k)=>K.cut(C6,shots,onEnd,MZ6[k]);
function crew(x,y,stol){const v=K.addAlly('vd',x,y);const s=stol===false?null:K.addAlly('st',x+10,y+6);return [v,s]}
function bankKills(){for(const A of Q.allies){if(A.kind==='vd')C6.vdK+=A.kills;if(A.kind==='st')C6.stK+=A.kills;A.kills=0}}
function fence(x0,y0,x1,y1){E.gfill(x0,y0,x1,y1,1);const hz=x1-x0>y1-y0;for(let i=hz?x0:y0;i<(hz?x1:y1);i+=4){if(hz)B(i,y0,3,y1-y0,i%8?'#8a6a40':'#7a5a34');else B(x0,i,x1-x0,3,i%8?'#8a6a40':'#7a5a34')}}
function bed(x,y,w,h){K.floor(x,y,x+w,y+h,'dirt');for(let yy=y+2;yy<y+h;yy+=6)for(let xx=x+2;xx<x+w-2;xx+=5)B(xx,yy,3,2,'#4a8a2a')}
function cottage(x,y,w,h,c,roof){B(x,y,w,h,c);E.gfill(x,y,x+w,y+h,1);for(let yy=y;yy<y+h;yy+=4)B(x,yy,w,2,roof||'#6a3a2a');B(x,y+h-3,w,3,shade(c,.7))}

// ---------- УЧАСТОК РОДИТЕЛЕЙ ----------
// 04.11: мужик на синем пикапе въезжает в ворота, давит зомби и возвращает сумки
function pickupArrive(){const L=E.L;
  for(let i=0;i<4;i++){const z=Zd(250+(i%2)*20,300+i*16,{st:'idle'});if(z)z.a=Math.PI/2}
  Q.pk={x:260,y:440,sp:120,stop:250,hit:0};note('Сигнал у ворот! Кто-то едет...');sfx('thump',1.4);C1.shake=.3;
  L.npcs.push({draw(){const k=Q.pk;if(!k)return;const x=k.x,y=k.y;F(x-9,y-17,18,34,'rgba(0,0,0,.28)');F(x-8,y-18,16,34,'#2a4a8a');F(x-7,y-17,14,6,'#3a5aa0');F(x-6,y-11,12,6,'#1a2230');
    F(x-6,y-4,12,3,'#2a4a8a');F(x-7,y,14,13,'#22407a');F(x-6,y+1,12,11,'#6a4a2a');if(!k.give){F(x-5,y+2,5,4,'#3a3a2a');F(x+1,y+3,4,5,'#4a3a22');F(x-4,y+7,6,4,'#2a3a2a')}
    F(x-9,y-14,1,5,'#111');F(x+8,y-14,1,5,'#111');F(x-9,y+8,1,5,'#111');F(x+8,y+8,1,5,'#111');F(x-7,y-19,3,1,'#ffe890');F(x+4,y-19,3,1,'#ffe890');
    if(k.give&&k.dr){F(k.dr.x-3,k.dr.y-3,6,6,'#d8a882');F(k.dr.x-3,k.dr.y-4,6,2,'#2a4a8a')}}})}
function pickTick(dt){const k=Q.pk;if(k.done)return;const L=E.L;
  if(k.y>k.stop){k.y-=k.sp*dt;if(Math.random()<.3)L.fx.push({x:k.x+(Math.random()*12-6),y:k.y+18,vx:0,vy:20,life:.4,c:'#8a7a5a'});
    for(const z of L.zs)if(!z.dead&&Math.abs(z.x-k.x)<14&&Math.abs(z.y-k.y)<20){X.killZ(z,-Math.PI/2);k.hit++;C1.shake=.4;sfx('thump',1.2);X.floatT(z.x,z.y-8,'ХРУСЬ!','#ffd23a')}
    if(Math.abs(pl.x-k.x)<12&&Math.abs(pl.y-k.y)<22)pl.x+=pl.x<k.x?-2:2;
    if(k.y<=k.stop){E.gfill(k.x-8,k.y-18,k.x+8,k.y+16,2);X.buildNav()}return}
  if(k.talk)return;k.talk=1;lockMove=true;
  say([['dr','Парни! Стойте! Это не ваше?'],['m','...Наши сумки?!'],['dr','Я вчера на заправке в кузове нашёл. Три дня думал, что за подарок такой.'],['st','Мои сумки!'],['vd','НАШИ сумки.'],
    ['dr','Там дробовик с гравировкой «Анис». Я не стал трогать. Мало ли.'],['m','Спасибо, друг. Это дробовик моего шефа. Очень важный.'],
    ['dr','Ну, я поехал. Вон ещё двоих по дороге переехал — не благодарите.'],['vd','Мой шокер всё равно со мной.'],['st','А пиво — со мной. Всегда.']],()=>{
    k.give=1;bagsBack();lockMove=false;sfx('pick');note('Сумки вернулись! Стволы снова с тобой · [4] — бензопила');Q.wave=1.6;k.done=1})}
function lvDacha(){
  const L=E.mkLevel('dacha6',520,380);B(0,0,520,380,'#2a3a20');
  K.floor(0,0,520,380,'grass');fence(0,0,520,6);fence(0,0,6,380);fence(514,0,520,380);fence(0,374,236,380);fence(284,374,520,380);
  cottage(180,30,160,90,'#c8a060','#7a3a2a');B(240,120,40,16,'#9a7a48');E.gfill(240,120,280,128,2);K.txt(260,26,'ДОМ БАТИ','#ffffff',4); // крыльцо
  cottage(40,60,70,56,'#7a6a5a','#4a4a52');K.txt(75,56,'САРАЙ','#ffffff',4);B(64,114,20,4,'#3a2a1a');
  cottage(400,40,80,60,'#8a5a3a','#5a3a2a');K.txt(440,36,'БАНЯ','#ffffff',4);
  X.lowBox(380,180,90,60,'#c8e0e8','#e8f8ff');for(let x=384;x<466;x+=10)B(x,182,6,56,'#a8d0d8');K.txt(425,176,'ТЕПЛИЦА','#ffffff',4);
  bed(60,200,120,30);bed(60,250,120,30);bed(60,300,120,30);
  K.floor(236,136,284,380,'dirt');
  for(const [x,y] of [[30,160],[200,330],[330,320],[480,300],[500,150]])K.tree(x,y,14,'#2e6a34');
  for(let i=0;i<12;i++)(Q.crowns).push([430+rnd(-30,30),300+rnd(-20,20),6,'#3a7a2a']);// малина
  X.lowBox(300,180,30,20,'#6a4a2a','#8a6a48');K.txt(315,176,'СТОЛ','#ffffff',3);
  E.addItem('pir',314,190);E.addItem('pir',306,190);E.addItem('beer',320,188);
  L.armed=false;L.dark=.12;L.tint='255,180,120';
  X.buildNav();
  pl.x=260;pl.y=360;pl.a=-Math.PI/2;pl.ma=pl.a;crew(246,370);
  const pa={x:118,y:142,a:Math.PI/2},ma={x:260,y:146,a:Math.PI/2},al={x:430,y:300,hid:true};
  const cvPa=mk(24),cvMa=mk(24),cvAl=mk(24);for(const c of [cvPa,cvMa,cvAl])c.getContext('2d',{willReadFrequently:true});
  L.npcs.push({draw(){shadowBlob(pa.x,pa.y,5);TOP.topParent(cvPa.getContext('2d'),false);spr(cvPa,pa.x,pa.y,pa.a);shadowBlob(ma.x,ma.y,5);TOP.topParent(cvMa.getContext('2d'),true);spr(cvMa,ma.x,ma.y,ma.a);
    if(!al.hid){TOP.topCat(cvAl.getContext('2d'),TOP.PAL_ALISA,tm*6,al.mv,true);shadowBlob(al.x,al.y,4);spr(cvAl,al.x,al.y,al.a||0)}else if(Math.sin(tm*1.5)>.5){F(al.x-2,al.y-1,1,1,'#c8d040');F(al.x+1,al.y-1,1,1,'#c8d040')}}});
  L.obj=()=>{const o=[];if(!Q.saws)o.push(Q.talk?'Сарай бати: бензопила':'Поговорить с батей у сарая');if(!C6.flags.alisa)o.push('(по желанию) Найти кису Алису');if(Q.saws&&!Q.wave)o.push('Отбиться от зомби у забора');if(Q.wave===2)o.push('В лес — через калитку внизу');return o};
  L.onUpdate=dt=>{pa.a=Math.atan2(pl.y-pa.y,pl.x-pa.x);ma.a=Math.atan2(pl.y-ma.y,pl.x-ma.x);
    if(al.walk){const d=D2(al.x,al.y,ma.x+10,ma.y+6);al.mv=d>2;if(d>2){const a=Math.atan2(ma.y+6-al.y,ma.x+10-al.x);al.x+=Math.cos(a)*40*dt;al.y+=Math.sin(a)*40*dt;al.a=a}else{al.walk=0;al.a=Math.PI}}
    if(Q.pk)pickTick(dt);
    if(Q.wave===1&&K.alive()===0){Q.wave=1.5;bankKills();pickupArrive()}
    if(Q.wave===1.6){Q.wave=2;say([['pa','Ай, молодцы! Как по маслу!'],['pa','Они из леса лезут. Через лес — к нашей улице, а там ферма Петровича. Говорят, главный у них там.'],['ma','Возьмите пирожки в дорогу! С капустой!'],['m','Спасибо, мам. Сидите в доме. Мы быстро.']])}};
  L.its=[
    {x:pa.x,y:pa.y,r:20,label:()=>'Батя',act:()=>{if(Q.talk){say([['pa',Q.saws?'Пила — как продолжение руки. Только к себе не тяни.':'Сарай за мной. Там всё.']]);return}Q.talk=1;
      say([['pa','Сынок! Приехал! А это кто с тобой? Мажор и... этот.'],['vd','Владислав. Очень приятно.'],['st','Столыпин. *ик* Здрасьте.'],['m','Бать, у нас беда. Оружие пропало. Всё.'],
        ['pa','Пропало? Как?'],['vd','Спросите у Столыпина.'],['st','Да я ж не специально! Синий пикап, он похож был!'],
        ['pa','Ладно. Не беда. У меня в сарае бензопила. Я ей сорок лет дрова пилю. Бензина — бочка.'],['pa','А тебе, сынок, ещё лопата. Самая длинная в посёлке, черенок дубовый. Держи — близко никто не подойдёт.'],['vd','А мне? Стоп... у меня в BMW шокер! Вы же мне его на день рождения дарили.'],['m','Точно. Сто тысяч вольт. Неси.'],['st','А у меня пиво. *ик* Я на них рыгну — сами сдохнут.'],['pa','Вот и славно. Заводите, мужики.']],()=>{C1.giveWpn('shovel');if(window.UP)UP.grant('shovel');C1.PS.wpn='shovel';C1.PS.lo=C1.PS.lo||{};C1.PS.lo.m='shovel';C6.shov=true;note('Лопата бати — самое длинное холодное оружие. Сарай — слева от дома')})}},
    {x:74,y:124,r:16,label:()=>'Сарай бати',cond:()=>Q.talk&&!Q.saws,act:()=>MG.play('A','rummage',{title:'Сарай: бензопила и бочка бензина'},()=>MG.play('P','rhythm',{title:'Стартер: дёргай в такт',hint:'Жми, когда нота на белой линии. Тр-тр-тр... ВЖЖЖ!',col:'#e8701a'},()=>{
      Q.saws=1;C6.saws=true;C6.shov=false;C1.noWpn=true;K.hud=hud6;sfx('power',1.4);C1.shake=.5;
      say([['m','ВЖЖЖЖЖ! Работает!'],['vd','Шокер заряжен. Костюм не запачкаю — бью на расстоянии.'],['st','*глоток* Я готов. Встаньте с наветренной стороны.'],['pa','Пила — это тебе не пистолет. Подходи вплотную и не отпускай.'],
        ['m','Понял. Пиво — буст, пирожки — лечат, рывок — на Q, лопата — на 3.'],['ma','СЫНОК! ЗА ЗАБОРОМ!']],()=>{Q.wave=1;sfx('groan',1.8);C1.shake=.6;
        for(let i=0;i<5;i++)Zd(20+i*20,20,{st:'chase'});for(let i=0;i<4;i++)Zd(500,200+i*30,{st:'chase'});Zbab(250,370,{st:'chase'});Zhen(140,350,{st:'chase'});Zhen(160,350,{st:'chase'});
        for(let x=20;x<120;x+=20)E.gfill(x,0,x+12,6,0);E.L.armed=true;X.buildNav();note('Зомби лезут через забор!')})}))},
    {x:ma.x,y:ma.y,r:18,label:()=>'Мама',act:()=>say(C6.flags.alisa?[['ma','Алисонька моя нашлась. Спасибо, сынок.'],['al','Мрр.']]:[['ma','Сынок! Похудел-то как! Пирожки на столе, бери.'],['ma','А Алиса пропала. Как зомби завыли — забилась куда-то. Я её зову-зову...'],['m','Найду, мам.']])},
    {x:al.x,y:al.y,r:22,label:()=>'Малина... кто-то шуршит',cond:()=>al.hid,act:()=>MG.play('A','feed',{title:'Кис-кис, Алиса!'},()=>{al.hid=false;al.walk=1;C6.flags.alisa=true;sfx('pick');
      say([['al','Мя-а-ау! (Наконец-то. Я тут два часа сижу. В малине. Колется.)'],['m','Алиса! Иди к маме.'],['ma','Алисонька! Нашлась!']])})},
    {x:260,y:372,r:20,label:()=>'Калитка в лес',cond:()=>Q.wave===2,act:()=>{lockMove=true;X.go(()=>{lockMove=false;sec6('forest')})}},
  ];
  after(.6,()=>{K.zoneBanner('ПЕРЕЛЕСЬЕ · УЧАСТОК РОДИТЕЛЕЙ','#a8d870');say([['ma','Сыночек! Живой!'],['m','Мам! Бать! Всё хорошо?'],['pa','Пока да. Но они идут. Из леса. Слышишь — воют.']])});
}

// ---------- ЛЕС ----------
function lvForest(){
  const L=E.mkLevel('forest6',900,360);B(0,0,900,360,'#1a2414');
  K.floor(0,0,900,360,'forest');
  // тропа
  const path=[[0,180],[120,170],[220,230],[340,200],[460,130],[580,150],[700,230],[820,190],[900,180]];
  for(let i=0;i<path.length-1;i++){const [x0,y0]=path[i],[x1,y1]=path[i+1];for(let k=0;k<=1;k+=.02){const x=x0+(x1-x0)*k,y=y0+(y1-y0)*k;for(let dy=-14;dy<14;dy+=4)for(let dx=-4;dx<4;dx+=4)B(x+dx,y+dy,4,4,hash((x+dx)>>2,(y+dy)>>2)<.2?'#6a5a3a':'#7a6a48')}}
  E.gfill(0,0,900,6,1);E.gfill(0,354,900,360,1);
  let s=5;const rr=()=>{s=(s*16807)%2147483647;return s/2147483647};
  const near=(x,y)=>path.some((p,i)=>{if(i===path.length-1)return false;const q=path[i+1],dx=q[0]-p[0],dy=q[1]-p[1],t=clamp(((x-p[0])*dx+(y-p[1])*dy)/(dx*dx+dy*dy),0,1);return D2(x,y,p[0]+dx*t,p[1]+dy*t)<34});
  for(let i=0;i<160;i++){const x=rr()*900,y=10+rr()*340;if(near(x,y))continue;if(D2(x,y,620,80)<50)continue;K.tree(x|0,y|0,9+rr()*7,rr()<.5?'#1e4a24':'#2a5a2a')}
  // поляна, где пропал Столыпин
  K.floor(580,40,660,120,'grass');B(612,72,10,8,'#6a4a2a');K.txt(620,36,'ПОЛЯНА','#c8e8a0',4);
  // сухие деревья
  Q.dead=[];for(const [x,y] of [[200,200],[440,160],[560,180],[760,200],[340,230]]){Q.dead.push({x,y,hp:.6});E.gfill(x-3,y-3,x+3,y+3,2)}
  L.drawUnder=()=>{for(const t of Q.dead){if(t.down)continue;F(t.x-3,t.y-3,6,6,'#6a5038');ctx.strokeStyle='#5a4028';ctx.lineWidth=2;for(let i=0;i<4;i++){const a=i*1.6;ctx.beginPath();ctx.moveTo(t.x,t.y);ctx.lineTo(t.x+Math.cos(a)*10,t.y+Math.sin(a)*10);ctx.stroke()}
    if(D2(t.x,t.y,pl.x,pl.y)<60){ctx.strokeStyle=`rgba(255,210,58,${.4+.4*Math.sin(tm*6)})`;ctx.strokeRect(t.x-6.5,t.y-6.5,13,13)}}};
  E.addItem('beer',330,190);E.addItem('pir',600,150);E.addItem('beer',820,200);E.addItem('pir',120,175);
  L.dark=.35;L.tint='10,30,10';for(const [x,y] of path)L.lights.push([x,y,70,.6]);L.lights.push([620,80,60,.8]);
  X.buildNav();
  pl.x=16;pl.y=180;pl.a=0;pl.ma=0;const [vd]=crew(8,170,false);
  for(let i=0;i<10;i++){const p=path[1+r4(path.length-2)];Zd(p[0]+rnd(-20,20),p[1]+rnd(-20,20))}
  for(let i=0;i<5;i++)Zgr(rnd(150,800),rnd(40,320));for(let i=0;i<4;i++)Zcrow(rnd(200,800),rnd(40,320));
  for(let i=0;i<6;i++)Zd(620+rnd(-30,30),80+rnd(-30,30),{wakeR:60});Zbab(700,240);
  Q.trig.push({x:200,y:200,r:40,fn:()=>say([['vd','Стоп. А где Столыпин?'],['m','Только что тут был.'],['vd','Он сказал «я на минутку, по делам». С ящиком пива.'],['m','Ищем. И видишь сухие деревья? Подпили — рухнут прямо на зомби.']])});
  Q.trig.push({x:600,y:110,r:60,fn:()=>{sfx('groan',1.6);say([['st','Мужики! Я тут! Меня окружили, но пиво я не отдал!'],['vd','Он сидит на пне и пьёт. В окружении зомби.'],['m','Режем!']])}});
  L.obj=()=>[Q.found?'Столыпин нашёлся  ✓':'Найти Столыпина (он «на минутку отошёл»)','Тропа ведёт к коттеджам — направо'];
  L.onUpdate=()=>{K.trigs();if(!Q.found&&!L.zs.some(z=>!z.dead&&D2(z.x,z.y,620,80)<70)&&D2(pl.x,pl.y,620,80)<70){Q.found=1;const s=K.addAlly('st',616,78);
    say([['st','Спасибо, братва! Я уж думал — всё. Последнее пиво допивал.'],['vd','Ты отошёл в лес. Ночью. С ящиком пива. Где зомби.'],['st','Ну так природа же! Я ж не знал, что она с зомби.'],['m','Держись рядом. Пила твоя где?'],['st','Вот она! Я ею пень пилил. Для красоты.']])}};
  L.npcs.push({draw(){if(!Q.found){const c=cvSt;TOP.topStolypin(c.getContext('2d'),0,true);spr(c,616,78,Math.PI/2)}}});
  L.its=[{x:892,y:180,r:22,label:()=>'Тропа к коттеджам',act:()=>{if(!Q.found){say([['m','Без Столыпина не уйдём. Он где-то в лесу.']]);return}bankKills();lockMove=true;X.go(()=>{lockMove=false;sec6('street')})}}];
  after(.5,()=>{K.zoneBanner('ЛЕС','#7aca5a');say([['vd','Лес. Ночью. С бензопилами. Мы точно в фильме ужасов.'],['m','Только на этот раз маньяки — мы.']])});
}
const cvSt=mk(24);cvSt.getContext('2d',{willReadFrequently:true});

// ---------- КОТТЕДЖНАЯ УЛИЦА ----------
const GAZ={x:420,y:200};
function lvStreet(){
  const L=E.mkLevel('street6',840,400);B(0,0,840,400,'#2a3a20');
  K.floor(0,0,840,400,'grass');K.floor(0,170,840,230,'asph');for(let x=0;x<840;x+=30)B(x,199,14,2,'#d8d8c8');
  // коттеджи с заборами
  for(let x=20,i=0;x<820;x+=140,i++){if(Math.abs(x+50-GAZ.x)<70)continue;
    cottage(x+10,30,90,70,['#d8c8a8','#a8c8d8','#e8d0a0','#c8a8a8'][i%4],['#5a3a2a','#3a4a6a','#6a3a2a','#4a4a4a'][i%4]);fence(x,150,x+48,156);fence(x+76,150,x+120,156);
    cottage(x+10,300,90,70,['#c8d8a8','#d8a8a8','#a8b8d8','#e8c8a0'][i%4],'#5a3a2a');fence(x,244,x+48,250);fence(x+76,244,x+120,250)}
  // площадь с беседкой
  K.floor(GAZ.x-60,110,GAZ.x+60,300,'wood');B(GAZ.x-20,GAZ.y-20,40,40,'#8a6a40');for(let i=0;i<40;i+=4)B(GAZ.x-20+i,GAZ.y-20,2,40,'#7a5a34');B(GAZ.x-24,GAZ.y-24,48,4,'#6a3a2a');B(GAZ.x-24,GAZ.y+20,48,4,'#6a3a2a');K.txt(GAZ.x,GAZ.y-28,'БЕСЕДКА','#ffffff',4);
  // пролом в заборе
  Q.breach={x:640,y:150};B(632,150,16,6,'#2a2a1a');E.gfill(632,148,648,158,0);
  E.addItem('beer',100,200);E.addItem('pir',300,180);E.addItem('beer',560,220);E.addItem('pir',760,190);
  L.dark=.3;L.tint='20,10,30';for(let x=40;x<840;x+=120)L.lights.push([x,200,60,.7]);L.lights.push([GAZ.x,GAZ.y,70,.8]);
  X.buildNav();
  pl.x=16;pl.y=200;pl.a=0;pl.ma=0;crew(8,190);
  const nb=[{x:120,y:120,n:'Тётя Валя',saved:false},{x:540,y:276,n:'Дед Михей',saved:false},{x:760,y:120,n:'Петрович-младший',saved:false}];Q.nb=nb;
  const cvN=mk(24);cvN.getContext('2d',{willReadFrequently:true});
  L.npcs.push({draw(){for(const p of nb){shadowBlob(p.x,p.y,5);TOP.topParent(cvN.getContext('2d'),p.n==='Тётя Валя');spr(cvN,p.x,p.y,p.a||Math.PI/2);if(!p.go&&!p.saved&&Math.sin(tm*4)>0){ctx.fillStyle='#fff';ctx.font='bold 5px monospace';ctx.fillText('!',p.x-1,p.y-10)}}}});
  for(let i=0;i<14;i++)Zd(rnd(80,820),rnd(176,226));for(let i=0;i<6;i++)Zd(rnd(40,820),rnd(110,140));Zbab(300,280);Zbab(700,120);Ztr(600,200,{nm:'ТРАКТОРИСТ',nmc:'#c8a040'});
  Q.spawnT=4;
  L.obj=()=>[(Q.patched?'Пролом заколочен  ✓':'Заколотить пролом в заборе (справа вверху)'),'Соседей в беседку: '+nb.filter(p=>p.saved).length+' из 3',Q.patched&&nb.every(p=>p.saved)&&!K.alive()?'На ферму Петровича — направо':''].filter(Boolean);
  L.onUpdate=dt=>{if(hold())return;
    for(const p of nb){if(p.go&&!p.saved){const d=D2(p.x,p.y,GAZ.x,GAZ.y);if(d<8){p.saved=true;sfx('pick');X.floatT(p.x,p.y-10,'В БЕЗОПАСНОСТИ','#3ef0b0')}else{const a=Math.atan2(GAZ.y-p.y,GAZ.x-p.x);p.x+=Math.cos(a)*44*dt;p.y+=Math.sin(a)*44*dt;p.a=a}}}
    if(!Q.patched){Q.spawnT-=dt;if(Q.spawnT<=0){Q.spawnT=rnd(3.5,5);if(L.zs.length<26){Zd(640+rnd(-6,6),120,{st:'chase'});if(Math.random()<.4)Zhen(640,130,{st:'chase'})}}}};
  L.drawUnder=()=>{if(Q.patched){F(630,149,20,8,'#a8884a');F(630,151,20,1,'#6a4a2a')}else if(Math.sin(tm*5)>0){ctx.strokeStyle='rgba(255,60,60,.6)';ctx.strokeRect(630.5,146.5,19,12)}};
  L.its=nb.map(p=>({get x(){return p.x},get y(){return p.y},r:18,label:()=>p.n,cond:()=>!p.go,act:()=>{p.go=1;say([['m',p.n+', в беседку! Там свет и мы рядом.']])}}));
  L.its.push({x:640,y:160,r:20,label:()=>'Заколотить пролом',cond:()=>!Q.patched,act:()=>{if(L.zs.some(z=>!z.dead&&D2(z.x,z.y,640,150)<50)){say([['st','Сначала отгони их от дыры!']]);return}
      MG.play('A','box',{title:'Доски, гвозди, Столыпин держит'},()=>{Q.patched=1;E.gfill(632,148,648,158,1);for(const o of [pl].concat(Q.allies||[]))if(o&&o.x>624&&o.x<656&&o.y>138&&o.y<164){o.y=168} // не замуровать героя в проёме
        X.buildNav();sfx('nail');say([['st','Заколотили! Как на сто тысяч ТО.'],['vd','Ты держал доску вверх ногами.'],['st','Зато держал!']])})}});
  L.its.push({x:832,y:200,r:22,label:()=>'Дорога на ферму',act:()=>{if(!Q.patched||!nb.every(p=>p.saved)){say([['m','Сначала соседей в беседку и пролом заколотить.']]);return}if(K.alive()){say([['vd','Тут ещё бродят. Добьём.']]);return}
    bankKills();lockMove=true;X.go(()=>{lockMove=false;sec6('farm')})}});
  after(.5,()=>{K.zoneBanner('КОТТЕДЖНАЯ УЛИЦА','#ffb040');say([['vd','Соседи в домах. Кто-то кричит.'],['m','Собираем всех в беседку. И найдём, откуда лезут.']])});
}

// ---------- ФЕРМА И ЛЕШИЙ ----------
const HAY=[[140,330],[500,330],[140,170],[500,170],[320,400]];
function lvFarm(){
  const L=E.mkLevel('farm6',640,480);B(0,0,640,480,'#2a2a1a');
  K.floor(0,0,640,480,'dirt');fence(0,0,640,6);fence(0,0,6,480);fence(634,0,640,480);fence(0,474,640,480);
  for(let y=200;y<300;y+=8)K.floor(220,y,420,y+4,'grass');
  cottage(20,20,140,90,'#8a3a2a','#5a2a1a');K.txt(90,16,'КОРОВНИК','#ffffff',4);
  cottage(480,20,90,60,'#a88a5a','#6a4a2a');K.txt(525,16,'КУРЯТНИК','#ffffff',4);
  X.lowBox(300,30,40,30,'#4a4a52','#6a6a72');K.txt(320,26,'ГЕНЕРАТОР','#ffd23a',4);
  for(const [x,y] of HAY){X.lowBox(x-12,y-10,24,20,'#c8a040','#e8c060');for(let i=0;i<6;i++)B(x-10+i*4,y-8,1,16,'#a88030')}
  X.carTop(560,400,'#2a6a3a',false);K.txt(574,396,'ТРАКТОР','#ffffff',3);
  E.addItem('beer',40,440);E.addItem('beer',600,200);E.addItem('pir',320,120);E.addItem('beer',320,460);E.addItem('pir',60,200);
  L.dark=.55;L.tint='10,10,30';L.lights.push([320,240,50,.6]);
  X.buildNav();
  pl.x=320;pl.y=460;pl.a=-Math.PI/2;pl.ma=pl.a;crew(306,466);
  for(let i=0;i<8;i++)Zhen(rnd(480,600),rnd(90,140));for(let i=0;i<6;i++)Zf(rnd(60,580),rnd(150,420));for(let i=0;i<4;i++)Zd(rnd(60,580),rnd(150,420));
  Q.phase=0;Q.fires=[];
  L.obj=()=>!Q.gen?['Запустить генератор (наверху)']:!Q.boss?['Зачистить ферму: '+K.alive()]:Q.won?['Леший повержен']:['Победить зомби-лешего'+(Q.phase===2?' · кора: выпей пива и пили':Q.phase===3?' · заманивай в горящее сено':'')];
  L.its=[{x:320,y:66,r:20,label:()=>'Генератор',cond:()=>!Q.gen,act:()=>MG.play('P','breaker',{title:'Генератор фермы',hint:'Автомат щёлкает и соседей. Нужно всё зелёное.'},()=>{Q.gen=1;sfx('power',1.4);L.dark=.25;
    for(const [x,y] of [[100,140],[540,140],[320,240],[140,400],[500,400]])L.lights.push([x,y,90,.85]);note('Свет есть! Теперь видно, кого пилить')})}];
  L.onTick6=dt=>{if(hold())return;
    if(Q.gen&&!Q.boss&&K.alive()===0){Q.boss=1;bankKills();lockMove=true;
      after(.5,()=>{sfx('groan',2.5);C1.shake=1.2;say([['ls','Кто-о-о... в мой ле-е-ес... с пилами при-и-ишёл...'],['st','Э. Это пень разговаривает.'],['vd','Это не пень. Это леший. Зомби-леший.'],
        ['ls','Я — хозяин! Мертвецы — мои! Посёлок — мой!'],['m','Посёлок — мамин. Мужики, заводи!']],()=>{lockMove=false;mz6('boss');Q.phase=1;
        const b=E.addZ('boss',320,150,{v:650,hp:2400,max:2400,sp:24,r:10,st:'chase',nm:'ЗОМБИ-ЛЕШИЙ',nmc:'#9aff4a',ai:'leshy',rt:2,ct:2.4,sm:6,sw:5,armor:0,armorMax:600});K.zoneBanner('ЗОМБИ-ЛЕШИЙ','#9aff4a')})})}
    leshy(dt)};
  after(.5,()=>{K.zoneBanner('ФЕРМА ПЕТРОВИЧА','#ffd23a');say([['m','Темно, хоть глаз выколи. Генератор — наверху.'],['vd','Куры. Зомби-куры. Я этого в резюме не писал.']])});
}
function leshy(dt){
  const L=E.L;
  for(const z of L.zs){if(z.dead||z.ai!=='leshy')continue;const d=D2(z.x,z.y,pl.x,pl.y),ta=Math.atan2(pl.y-z.y,pl.x-z.x);z.thr=99;
    const k=z.hp/z.max;
    if(Q.phase===1&&k<.66){Q.phase=2;z.armor=z.armorMax;z.stun=1.2;sfx('thump',1.5);C1.shake=1;X.floatT(z.x,z.y-22,'КОРА!','#c8a060');
      say([['ls','Кора-а-а! Не возьмёшь!'],['m','Пила соскальзывает!'],['st','Пиво! Пей пиво — пила с пивом злее! Проверено!']])}
    if(Q.phase===2&&k<.33){Q.phase=3;z.armor=0;z.stun=1.6;sfx('groan',2.4);C1.shake=1.2;X.floatT(z.x,z.y-22,'ВЫРВАЛ СОСНУ!','#ffd23a');
      say([['ls','Ах та-а-ак! Сосно-о-ой!'],['st','Мужики! Он деревянный! А деревянное — горит!'],['st','Я сено подожгу! Заманивайте его в огонь!']],()=>{for(const [x,y] of HAY){X.igniteAt(x,y);const f=L.fires[L.fires.length-1];f.t=999;f.r=22}note('Сено горит! Заманивай лешего в огонь')})}
    if(z.stun>0)continue;
    z.stun=.05;
    // ходит к игроку медленно
    if(d>30){const dir=E.los(z.x,z.y,pl.x,pl.y)?ta:K.navDir(z);if(dir!=null){K.mv(z,Math.cos(dir)*z.sp*dt,Math.sin(dir)*z.sp*dt,z.r-2);z.ph+=dt*6}}z.a=ta;
    if(d<z.r+8&&(z.hc=(z.hc||0)-dt)<=0){z.hc=1;X.hurtPlayer(18)}
    // фаза 1+: корни из-под земли
    z.rt-=dt;if(z.rt<=0){z.rt=Q.phase===3?2.2:3;const n=Q.phase>=2?4:3;for(let i=0;i<n;i++){const a=rnd(0,TAU),r=i?rnd(14,40):0;K.tele(pl.x+Math.cos(a)*r,pl.y+Math.sin(a)*r,16,1,16,'root')}X.floatT(z.x,z.y-22,'КОРНИ!','#c8a060')}
    // шишки веером
    z.ct-=dt;if(z.ct<=0&&d<230){z.ct=Q.phase===3?1.8:2.4;const n=Q.phase===1?3:5;for(let i=0;i<n;i++)K.shoot(z.x,z.y,ta+(i-(n-1)/2)*.22,130,10,'cone');sfx('swing',1.6)}
    // фаза 2: грибники и вороны
    if(Q.phase>=2){z.sm-=dt;if(z.sm<=0){z.sm=12;for(let i=0;i<3;i++)Zgr(z.x+rnd(-30,30),z.y+rnd(-30,30),{st:'chase'});for(let i=0;i<4;i++)Zcrow(rnd(40,600),20,{st:'chase'});X.floatT(z.x,z.y-22,'ГРИБНИКИ!','#9aff4a')}}
    // фаза 3: удар сосной по линии
    if(Q.phase===3){z.sw-=dt;if(z.sw<=0&&d<140){z.sw=4.5;const a=ta;for(let i=1;i<=6;i++)K.tele(z.x+Math.cos(a)*i*20,z.y+Math.sin(a)*i*20,12,1.1,i===1?0:22,'root');X.floatT(z.x,z.y-22,'СОСНОЙ!','#ffd23a')}
      for(const f of L.fires)if(D2(f.x,f.y,z.x,z.y)<f.r+6&&!(z.fb>0)){z.fb=2;X.hurtZ(z,140,0,0);z.stun=1.2;z.burn=3;sfx('fire',1);X.floatT(z.x,z.y-22,'ГОРИТ!','#ff8a30');C1.shake=.6}
      if(z.fb>0)z.fb-=dt}
  }
  if(Q.phase>0&&!Q.won&&!L.zs.some(z=>!z.dead&&z.ai==='leshy')){Q.won=1;bankKills();Q.fir={x:320,y:240};for(const z of L.zs)if(!z.dead){Q.ghosts.push({x:z.x,y:z.y,a:z.a,type:z.type,v:z.v,t:1.4});z.dead=true}
    for(const f of L.fires)f.t=Math.min(f.t,2);sfx('power',1);C1.shake=1.4;
    after(1.5,()=>say([['ls','Ле-е-ес... мой... ле-е-ес...'],['vd','Он... уменьшается?'],['st','Он ёлочкой стал. Маленькой. Пушистой.'],['m','Ну всё. Пусть растёт. Посадим у бати на участке.'],['m','А кора с него осталась. Толстая, как броня.'],['pa','Дай сюда. Скобами сошью — будет тебе жилет. Ни один зубастый не прокусит.'],['vd','Счёт! Кто больше напилил?']],()=>{if(C1.giveArmor)C1.giveArmor('3');
      lockMove=true;X.go(()=>{lockMove=false;playC6(CUT_END6,endCh6,'end')})}))}
}
K.fx6=null;

// ================= X6 — дорога в Ленобласть =================
const X6=mk(40,24);
(g=>{const C='#6a6e76',CD='#4a4e56';for(const [x,y] of [[6,0],[28,0],[6,21],[28,21]])P(g,x,y,7,3,'#0a0a0c');
  P(g,1,3,37,18,C);P(g,1,3,37,1,'#9a9ea6');P(g,1,20,37,1,CD);P(g,30,4,8,16,'#7a7e86');P(g,32,6,4,12,CD);P(g,24,4,4,16,'#1a2230');P(g,8,5,16,14,'#5a5e66');P(g,5,4,3,16,'#1a2230');
  P(g,37,4,2,3,'#fff6c0');P(g,37,17,2,3,'#fff6c0');P(g,38,9,2,6,'#1a1a1a');P(g,1,8,1,8,'#2a2a2e');P(g,12,3,10,1,'#2a3a8a');P(g,12,20,10,1,'#2a3a8a');outline(g,'#0b0910')})(X6.getContext('2d'));
const XW=480,XH=4400;
function startX6(){
  C6.on=true;mz6('x6');
  K.car(C6,{id:'x6road',w:XW,h:XH,startX:240,startY:XH-140,route:'ГОРОД → ПЕРЕЛЕСЬЕ',title:'СЕРАЯ X6',sub:'Владос за рулём, Микроб стреляет из окна',hudCol:'#c8d8ff',vmax:125,
    gun:{name:'ПИСТОЛЕТ',cd:.2,dmg:28,sp:460,snd:'shot',heat:.05,ohNote:'Магазин пуст! Перезарядка — дави!'},armorTxt:'M-ОБВЕС. ВЛАДОС НЕ ПРОСТИТ ЦАРАПИН',
    build(L){B(0,0,XW,XH,'#2a3a20');E.gfill(0,0,XW,XH,1);E.gfill(96,0,384,XH,0);
      for(let y=0;y<XH;y+=4)for(let x=96;x<384;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,h<.1?'#3a3a42':h>.93?'#2a2a30':'#323238')}
      for(let y=0;y<XH;y+=40)B(239,y,2,20,'#e8e8e0');B(100,0,1,XH,'#c8c8c0');B(380,0,1,XH,'#c8c8c0');
      for(let y=0;y<XH;y+=4){for(let x=0;x<96;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,y>XH*.6?(h<.2?'#4a4a52':'#5a5a62'):(h<.15?'#3a5a2a':'#4a6a32'))}for(let x=384;x<XW;x+=4){const h=hash(x>>2,y>>2);B(x,y,4,4,y>XH*.6?(h<.2?'#4a4a52':'#5a5a62'):(h<.15?'#3a5a2a':'#4a6a32'))}}
      for(let y=XH*.62;y<XH;y+=160){B(10,y,74,120,'#8a8a92');for(let wy=y+6;wy<y+114;wy+=12)for(let wx=16;wx<80;wx+=12)B(wx,wy,6,6,hash(wx,wy)>.7?'#ffd27a':'#2a2a3a');B(396,y+40,74,120,'#9a9aa2')}
      for(let y=200;y<XH*.6;y+=60){K.tree(30+((y*7)%40),y,12,'#1e4a24');K.tree(430+((y*3)%30),y+30,12,'#2a5a2a')}
      let s=13;const rr=()=>{s=(s*16807)%2147483647;return s/2147483647};
      for(let y=XH-400;y>400;y-=130+rr()*90){const x=rr()<.5?110+rr()*50:280+rr()*60;X.carTop(x|0,y|0,['#3a5a8a','#8a2a2a','#c8c8c8','#2a2a2a'][(rr()*4)|0],true);if(rr()<.3)Q.fires.push([x+8,y+14])}
      for(let y=XH-500;y>300;y-=28+rr()*30){const n=1+(rr()*2.4|0);for(let i=0;i<n;i++){const x=110+rr()*260,r=rr();if(solid2(x,y,6))continue;if(r<.6)Zd(x,y);else if(r<.8)E.addZ('fast',x,y,{hp:40,max:40,sp:50});else if(r<.92)Zbab(x,y);else Ztr(x,y,{hp:300,max:300})}}
      K.txt(240,180,'ПЕРЕЛЕСЬЕ · 2 КМ','#ffffff',6);L.dark=.25;L.tint='30,10,30'},
    draw(x,y,a,ta,fl){shadowBlob(x,y,14);ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(a);ctx.drawImage(X6,-20,-12);ctx.restore();
      ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(ta);F(4,-1,8,2,'#151515');if(fl)F(12,-2,3,4,'#fff6c0');ctx.restore()},
    prog:c=>(c.start-c.y)/(c.start-200),fin:c=>c.y<200,
    onFin(k){C6.x6K=k;X.go(()=>playC6(CUT_GAS,()=>sec6('dacha'),'gas'))}});
  after(.8,()=>say([['vd','Пристегнитесь. Пятьсот тридцать сил. Обвес M. Царапина — и я плачу.'],['st','*пш-ш-ш* Поехали!'],['vd','Не открывай пиво в салоне!'],['m','Я стреляю из окна. Владос, дави!']]));
}
function solid2(x,y,r){const g=E.gAt;return g(x-r,y-r)||g(x+r,y-r)||g(x-r,y+r)||g(x+r,y+r)||g(x,y)}

// ================= КАТ-СЦЕНЫ =================
const SS=K.SKY_SUN,SD=K.SKY_DUSK;
function yardBg(){K.skyG(SD,0,100);F(0,100,W,80,'#5a5652');F(0,96,W,6,'#7a3426');for(let x=0;x<W;x+=30)F(x,40,24,58,'#8a3a2a');for(let x=4;x<W;x+=30)for(let y=46;y<94;y+=12)F(x,y,6,6,'#ffd27a')}
const CUT_X6=[
  {dur:1,lines:[['H','Это что за рёв?! Тише, барин! Тут люди спят!'],['vd','Тётушка, это не рёв. Это выхлоп M-пакета. Музыка.'],['H','Музыка у Егорушки. А у тебя — тарахтелка.'],['m','Ханжа, это Владос. Мы к моим родителям в Перелесье.'],['H','Ну с богом. И пусть не газует во дворе!']],draw(t){
    yardBg();K.carSide(140,166,t,'x6',{heads:[[16,'#e8d07a']]});sideMikrob(110,166,t,'stand');F(240,140,8,22,'#4a5a32');F(239,132,10,8,'#efc5a5');F(238,130,12,3,'#8a6748');
    if(Math.random()<.4)cparts.push({x:140,y:158,vx:rnd(-30,-10),vy:rnd(-6,0),life:1,c:'#8a8a8a'});for(const p of cparts)F(p.x,p.y,3,3,'rgba(140,140,140,.5)')}},
  {dur:1,lines:[['st','Опа, Микроб! И мажор. Я с пивом. Мы ж на природу?'],['vd','Не на природу. На войну. И не в мою машину с этим ящиком.'],['st','Это не ящик. Это провизия.'],['m','Залезай. Быстро.'],['st','*залезает* О, кожа. Мягонько.'],['vd','Если прольёшь — выйдешь на ходу.']],draw(t){
    K.skyG(SD,0,110);F(0,110,W,70,'#4a4a52');F(180,40,140,74,'#6a6a72');F(196,60,50,54,'#2a2a30');ctx.fillStyle='#ffd23a';ctx.font='bold 7px monospace';ctx.fillText('АВТОСЕРВИС',200,52);
    K.carSide(40,168,t,'x6',{heads:[[16,'#e8d07a'],[28,'#33241b']]});K.sideStolypin(150,170,t,'stand',{beer:true});F(158,160,14,10,'#c8a040');F(159,161,12,2,'#8a5a1a')}},
];
function gasBg(){K.skyG(SD,0,100);F(0,100,W,80,'#3a3a42');F(60,40,200,10,'#c82a2a');F(80,50,6,70,'#8a8a92');F(234,50,6,70,'#8a8a92');ctx.fillStyle='#fff';ctx.font='bold 6px monospace';ctx.fillText('АЗС · 24 ЧАСА',120,48);}
const CUT_GAS=[
  {dur:1,lines:[['vd','Заправка. Я за кофе. Микроб — бензин. Столыпин, НИЧЕГО НЕ ТРОГАЙ.'],['st','Я? Я — ничего.']],draw(t){
    gasBg();
    F(140,110,12,30,'#e8e8e8');F(142,114,8,8,'#2a2a30');K.carSide(40,168,t,'x6',{});K.carSide(200,168,t,'pick',{});K.sideStolypin(180,168,t,'stand',{beer:true})}},
  {dur:6,subs:[[.2,2.2,'st','О, это ж мои сумки... Тяжёлые. Лишние, что ли?'],[2.3,4.2,'st','Переложу в нашу тачку. Синяя, большая... наша же?'],[4.3,5.9,'st','*ик* Наша. Точно наша.']],draw(t){
    gasBg();K.carSide(20,168,t,'x6',{});const k=clamp(t/5,0,1);K.carSide(190,168,t,'pick',{bags:k>.4});
    K.sideStolypin(80+k*90,168,t,'walk',{});F(84+k*90,150,10,7,'#2a2a2a');F(88+k*90,146,8,5,'#3a3a2a')}},
  {dur:4,subs:[[.2,3.8,null,'(Синий пикап уезжает. С сумками. Со всем оружием.)']],draw(t){
    gasBg();K.carSide(20,168,t,'x6',{});K.carSide(190+t*50,168,t,'pick',{bags:true,move:true})}},
  {dur:1,lines:[['m','Приехали. Перелесье. ...Столыпин. Где сумки?'],['st','Какие сумки?'],['m','С оружием. Дробовик Аниса. Пистолет. Топор. ВСЁ.'],['st','А... Я их в нашу тачку переложил. В синюю.'],
    ['vd','У нас X6! Серая! С M-обвесом! Как можно перепутать с ржавым пикапом?!'],['st','Ну они оба... машины.'],['m','Отлично. Едем к бате без единого ствола.'],['vd','Счёт: Столыпин — минус весь арсенал.']],draw(t){
    K.skyG(SD,0,110);F(0,110,W,70,'#3a5a2a');for(let x=0;x<W;x+=6)F(x,120,4,30,'#8a6a40');K.carSide(130,170,t,'x6',{});sideMikrob(110,170,t,'stand');K.sideVlados(196,170,t,'stand');K.sideStolypin(222,170,t,'stand',{beer:true})}},
];
function palisade(t){K.skyG(SS,0,120);F(0,120,W,60,'#5a8a3a');for(let x=0;x<W;x+=8){const h=60+((x*7)%9);F(x,120-h,7,h,'#8a6a40');F(x,120-h,7,2,'#a88a5a');F(x+3,120-h-4,1,4,'#6a4a2a')}
  for(const tx of [60,200]){F(tx,40,20,20,'#4a5a4a');ctx.save();ctx.translate(tx+10,44);ctx.rotate(Math.sin(t)*.6-.4);F(0,-2,22,4,'#2a2a2e');ctx.restore()}
  F(270,30,30,30,'#5a6a5a');ctx.save();ctx.translate(285,30);ctx.rotate(t*2);F(-14,-2,28,4,'#c8ccd4');ctx.restore();ctx.fillStyle='#fff';ctx.font='bold 5px monospace';ctx.fillText('ПВО',276,70)}
const CUT_END6=[
  {dur:1,lines:[['pa','Сынок! Живые! А это что за ёлочка посреди фермы?'],['m','Это леший, бать. Был.'],['ma','Ой, какая пушистенькая. Пересадим к нам, под окно.'],['ma','Я окрошку сделала. Всем. Мойте руки.'],['st','А квас есть?'],['ma','Есть квас. И пиво — для тебя, я уж поняла.']],draw(t){
    K.skyG(SS,0,110);F(0,110,W,70,'#6a5a3a');F(150,120,8,20,'#4a3a26');for(let i=0;i<4;i++)F(146-i*3+6,96+i*8,8+i*6-6+6,6,'#2a7a3a');F(152,92,4,4,'#ffd23a');
    sideMikrob(60,170,t,'stand');K.sideVlados(86,170,t,'stand',true);K.sideStolypin(112,170,t,'stand',{saw:true});K.sideParent(210,170,t,'stand');K.sideParent(232,170,t,'stand',true);K.catSide(256,168,t,2,'stand',K.PAL_ALISA)}},
  {dur:1,lines:[['dr','Мужики! Я на шашлыки. Можно? Пикап помыл, зомби с бампера отскрёб.'],['st','Наш человек!'],['vd','Только сумки больше не перекладывай.'],['dr','Да я теперь в кузов вообще ничего не кладу. Ученый.'],['m','Садись, друг. Мама всем окрошку сделала.']],draw(t){
    K.skyG(SS,0,110);F(0,110,W,70,'#6a5a3a');K.carSide(150,170,t,'pick',{});F(160,140,10,22,'#6a5a3a');F(160,132,10,8,'#d8a882');F(159,130,12,3,'#2a4a8a');sideMikrob(80,170,t,'stand');K.sideStolypin(110,170,t,'stand',{})}},
  {dur:1,lines:[['r','Новости Ленобласти. После нашествия заражённых администрация строит вокруг посёлков огромные деревянные заборы.'],['r','На вышках — турели и системы ПВО. Перелесье стало первым посёлком-крепостью.'],['r','Местные благодарят троих мужчин с бензопилами. Один из них, по словам очевидцев, был в костюме.']],draw(t){palisade(t);K.newsBar('ПЕРЕЛЕСЬЕ — ПОСЁЛОК-КРЕПОСТЬ',true,'ЛЕНОБЛ ТВ')}},
  {dur:1,lines:[['pa','Ну вот. Забор выше дома, турели, ПВО. Как в крепости живём.'],['ma','Приезжайте на шашлыки. С Шмакодявкой. И с котиком.'],['m','Обязательно, мам. Теперь тут безопаснее, чем у нас во дворе.'],['al','Мрр. (Ёлочка — моя. Буду точить когти.)']],draw(t){
    palisade(t);K.sideParent(130,170,t,'stand');K.sideParent(152,170,t,'stand',true);K.catSide(176,168,t,2,'stand',K.PAL_ALISA)}},
  {dur:1,lines:[['s','Зай! Вернулся! И с гостями!'],['m','Владос и Столыпин. Они теперь тоже в штабе.'],['vd','Где тут можно сварить нормальный кофе? В турке.'],['st','А холодильник где? Я тут пиво привёз. Ящик. Второй.'],
    ['val','Плюс два в штаб. Столыпин, в CS играешь?'],['st','Это где стреляют? Не, я по бензопилам.'],['ol','Шмакодявка, у вас тут веселее, чем в Италии.'],['e','Это надо отметить! Колонка заряжена!'],
    ['c','Мяу. (Уже пятеро на моём диване.)'],['w','Мрр. (Зато корма всё больше.)'],['m','Ну вот. Все дома. Все живы.']],draw(t){
    K.livingSide(t,true);sideMikrob(26,170,t,'stand');K.sideShmak(48,170,t,'stand');K.sideVlados(72,170,t,'stand');K.sideStolypin(98,170,t,'stand',{beer:true});K.sideValera(124,170,t,'stand');K.sideOlesya(146,170,t,'stand');K.sideEgor(170,170,t,'stand');
    K.catSide(214,168,t,2.2,'stand',K.PAL_BLACK);K.catSide(250,168,t,2.2,'stand',K.PAL_SIAM);
    if(Math.random()<.3)cparts.push({x:rnd(0,W),y:-4,vx:rnd(-10,10),vy:rnd(20,40),g:10,life:5,c:['#ff4fd8','#3ef0b0','#ffd23a'][(Math.random()*3)|0]});for(const p of cparts)F(p.x,p.y,2,2,p.c)}},
];

// ================= КВАРТИРА: начало и эпилог =================
function setFlat6(){
  C1.on=false;C1.mode=null;C1.noWpn=false;C6.on=true;for(const o of [window.C2,window.C3,window.C4,window.C5])if(o){o.on=false}if(window.C4)C4.cat=false;
  scene='flat';cut=null;dlg=null;tr=null;S.fade=0;state='play';
  S.step=12;S.alarm=false;S.skladLocked=false;S.bat=S.pistol=false;S.bowls=true;mapDirty=true;lastRoom=null;camY=0;
  pl.scoot=false;pl.sit=false;lockMove=true;shmak.mode='sit';shmak.x=136;shmak.y=40;shmak.a=-Math.PI/2;shmak.hug=0;shmak.path=[];cat.path=[];cat.then=null;
  cat.x=CAT_HOME.x;cat.y=CAT_HOME.y;cat.mode='sleep';
}
function kit6(){Object.assign(C1.seenT,{crawler:1,screamer:1,brute:1,shield:1});Object.assign(PS,{hp:120,max:120,lives:3,inv:0,wpn:'bat',ammo:0,shells:0,syr:3,moon:0,hasShotgun:false,hasAxe:false,hasNail:false,hasExt:false,hasRail:false,hasFlame:false,nails:0,ext:0,cells:0,fuel:0,regen:0,carry:false,slow:0});
  Object.assign(C6,{vdK:0,stK:0,myK:0,saws:false,shov:false,shCd:0,shSw:0});if(window.UP)UP.kit(6)}
function startCh6(){
  C6.started=true;C6.done=false;C6.bagsBack=false;C6.gun=false;C6.flags={alisa:false};setFlat6();mz6('call');
  pl.x=176;pl.y=74;pl.a=0;pl.ma=0;
  after(1,()=>{sfx('ring');after(.9,()=>sfx('ring'));note('Звонит телефон: «Батя»');
    after(1.8,()=>say([['m','Алло, бать?'],['pa','Сынок. Тут такое дело. По радио сказали: зомби ушли из города в область. Почти все. Только на Горьковской и на Заячьем острове ещё сидят.'],
      ['pa','Целыми толпами. Идут лесом. К нам в Перелесье. Петрович с фермы звонил — у него уже ходят.'],['ma','Сыночек, ты не волнуйся! У нас забор! ...Деревянный.'],
      ['m','Бать, сидите в доме. Я еду. Сейчас.'],['pa','Ждём. Алиса под кровать забилась, трясётся.'],
      ['s','Я с тобой!'],['m','Нет, зай. Ты только из Италии. Отдыхай. Я возьму Владоса — у него X6. И Столыпина.'],
      ['s','Столыпина?! Он же опять напьётся.'],['m','Зато он крепкий. И с ним весело.'],['val','Если что — самолёт на Ваське. Только в Перелесье нет залива.']],()=>{
        lockMove=false;C6.ready=true;note('Штаб: поговори с кем хочешь. Выход — входная дверь')}))});
}
IT.push({x:212,y:205,r:16,label:()=>'Выйти: в Перелесье',cond:()=>C6.on&&C6.ready&&!C6.done&&scene==='flat'&&!C1.on,act:()=>{C6.ready=false;lockMove=true;kit6();C6.kills0=PS.kills;X.go(()=>playC6(CUT_X6,startX6,'x6'))}});
IT.push({x:212,y:205,r:16,label:()=>'Выйти: титры',cond:()=>C6.on&&C6.done&&C6.epi&&scene==='flat'&&!C1.on,act:()=>{C6.epi=false;S.fade=.01;dlg=null}});
function endCh6(){
  C6.done=true;setFlat6();mz6('hq');pl.x=176;pl.y=74;pl.a=Math.PI/2;
  after(.8,()=>say([['m','Все дома. Штаб в сборе.'],['s','Пройдись, зай. Поговори со всеми. Ты заслужил.']],()=>{lockMove=false;C6.epi=true;note('Эпилог: поговори со всеми в штабе. Выход — титры')}));
}

// ================= МЕНЮ ГЛАВЫ 6 =================
const MENU6=[['Глава 6 с начала (звонок бати)','call6'],['Серая X6: дорога','x6'],['Заправка (кат-сцена)','gas6'],['Участок родителей','dacha'],['Лес','forest'],['Коттеджная улица','street'],['Ферма и леший','farm'],['Финал (кат-сцена)','end6'],['Эпилог в штабе','epi6']];
function menuKit6(k){kit6();C1.done=true;for(const o of [window.C2,window.C3,window.C4,window.C5])if(o){o.done=true;o.started=true;o.on=false}C6.started=true;C6.done=false;C6.kills0=PS.kills;S.bat=S.pistol=false;S.skladLocked=false;S.alarm=false;S.key=true;mapDirty=true;
  C6.bagsBack=false;C6.gun=false;if(['forest','street','farm'].includes(k)){C6.saws=true;bagsBack()}}
const cfg6={ch:C6,num:6,title:'ПЕРЕЛЕСЬЕ',col:'rgba(232,112,26,A)',btn:{x:4,y:H-24,w:70,h:12},menu:MENU6,alias:{ch6:'call6'},
  start(k){menuKit6(k);if(k==='call6'){startCh6();return}if(k==='x6'){startX6();return}if(k==='gas6'){playC6(CUT_GAS,()=>sec6('dacha'),'gas');return}if(k==='end6'){playC6(CUT_END6,endCh6,'end');return}if(k==='epi6'){endCh6();return}sec6(k)},
  canContinue:()=>!!(window.C5&&C5.done&&!C6.started),
  cont(){C6.menu=null;state='play';S.fade=0;sfx('click');kit6();startCh6()},
  endScreen(){if(!C6.done)return false;
    K.endPanel({big:window.C7?'ГЛАВА 6 ПРОЙДЕНА':'ИГРА ПРОЙДЕНА',sub:'Глава 6 · Перелесье',col:'#ffa040',faces:['m','vd','st','pa','ma','al'],
      l1:'Счёт пил: Микроб '+C6.myK+' · Владос '+C6.vdK+' · Столыпин '+C6.stK+'   ·   Алиса: '+(C6.flags.alisa?'нашлась':'сама вышла'),l2:'Перелесье — посёлок-крепость. Родители в безопасности.',l3:'Штаб в сборе: все живы, все дома. Продолжение следует...'});
    u.textAlign='center';uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText('Спасибо, что играли!   ·   '+(touch.on?'Коснись, чтобы сыграть заново':'R или клик — сыграть заново'),W/2,166);u.textAlign='left';return true}};
K.chapter(cfg6);C6.cfg=cfg6;
C6.CUTS={CUT_X6,CUT_GAS,CUT_END6};
C6.get=()=>({L:E.L,Q,PS,scene,state,cut,dlg});
})();
