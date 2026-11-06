// =====================================================================
//  cars.js — поездки (одобрено Натальей 01.11, Т1–Т10):
//  · Т1 самокат гл.1: батарея, станции проката, разводной мост на время;
//  · Т3 вагонетка гл.3, Т4 самокат Егора гл.4 (стрельба назад по Невскому),
//    Т7 буханка гл.7 (хрупкий груз) — новые участки на общем движке K.car;
//  · Т5 кабриолет: серпантин на время + мопедные зомби;
//  · Т6 X6: ночь и фары, грязь, зомби-лесовоз;
//  · Т8 Поло RS: дрифт (Пробел), нитро, патрульные машины, трамвай, время;
//  · Т9 истребитель: топливо и баки, гроза — в level8.js;
//  · Т10 общий гараж (броня, бампер, нитро) и урон по машинам ×2.
//  Наружу: window.HMC.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!window.K56||!window.UP)return;
const K=K56,E=C1.engine,X=C1.X,PS=C1.PS,TAU=Math.PI*2,sfx=X.sfx;
const HMC={};window.HMC=HMC;
const dist=(a,b,c,d)=>Math.hypot(a-c,b-d),rn=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const ad=(a,b)=>{let d=a-b;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
const gar=()=>(UP.SV().car)||{};
let CURO=null;HMC.cur=()=>CURO;
const VY=(o,c)=>window.RTH?RTH.vy(o,c):c.y,AH=(o,c,d)=>window.RTH?RTH.ahead(o,c,d):{x:c.x,y:c.y-d,dx:0,dy:-1};
const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
function hitCar(c,d,why){const g=gar();d*=(1-.3*(g.arm|0))*(g.bump?.85:1);c.hp-=d;C1.shake=Math.max(C1.shake||0,.6);sfx('thump');if(why)note(why);if(c.hp<=0){c.hp=100;X.loseLife()}}

// ---------- общий K.car: урон ×2, гараж, нитро, движущиеся помехи, таймер ----------
const _car=K.car;
K.car=function(ch,o){
  if(!o._hm){o=Object.assign({},o);o._hm=1;const ex=EXTRA[o.id];if(ex)ex(o);
    if(!o.dmgCar)o.dmgCar=10;o.armorTxt=null;
    const t0=o.tick,d0=o.draw,b0=o.build;
    o.build=function(L){b0.call(this,L);if(o.night){L.dark=o.night;L.tint='4,6,14'}if(o.paint)o.paint(L)};
    o.tick=function(c,dt){if(t0)t0.call(this,c,dt);try{common(o,c,dt)}catch(e){console.warn(e)}};
    o.draw=function(x,y,a,ta,fl){try{drawMobs(o)}catch(e){}d0.call(this,x,y,a,ta,fl)}}
  o.mobs=[];o.tl=o.time||0;o.cp=0;o.nt=1;o.nb=0;o.cargo=100;o.spT=0;CURO=o;
  return _car(ch,o)};
function common(o,c,dt){
  const L=E.L,g=gar(),free=!dlg&&!c.end;
  // нитро (гараж или своё у машины)
  if(o.nitro||g.nitro){o.nt=Math.min(1,o.nt+dt*.12);if(free&&(keys.ShiftLeft||keys.ShiftRight||HMC.nitroTap)&&o.nt>=.35&&o.nb<=0){o.nb=1.2;o.nt-=.35;sfx('power',.8);C1.shake=Math.max(C1.shake||0,.3)}HMC.nitroTap=false;
    if(o.nb>0){o.nb-=dt;c.v=Math.min((o.vmax||110)*1.7,c.v+260*dt);if(Math.random()<.9)L.fx.push({x:c.x-Math.cos(c.a)*14+rn(-2,2),y:c.y-Math.sin(c.a)*14+rn(-2,2),vx:-Math.cos(c.a)*40,vy:-Math.sin(c.a)*40,life:.25,c:Math.random()<.5?'#6ad8ff':'#ffffff'})}}
  // время
  if(o.time&&free){o.tl-=dt;const cps=o.cps||[];if(o.cp<cps.length&&VY(o,c)<cps[o.cp]){o.cp++;o.tl+=o.cpAdd||20;sfx('coin');note('Чекпоинт! +'+(o.cpAdd||20)+' с')}
    if(o.tl<=0){o.tl=o.time;note(o.timeFail||'Не успели!');X.loseLife()}}
  // помехи: лесовоз, патруль, трамвай
  if(o.mobGen&&free)o.mobGen(o,c,dt);
  for(const m of o.mobs){m.x+=m.vx*dt;m.y+=m.vy*dt;if(m.t!=null)m.t+=dt;
    if(!m.hit&&Math.abs(c.x-m.x)<m.w/2+8&&Math.abs(c.y-m.y)<m.h/2+8){m.hit=1;hitCar(c,m.dmg||28,m.why);c.v*=-.4;c.x+=Math.sign(c.x-m.x||1)*6}
    if(m.hit&&!(Math.abs(c.x-m.x)<m.w/2+12&&Math.abs(c.y-m.y)<m.h/2+12))m.hit=0;
    if(m.kind==='police')for(const z of L.zs)if(!z.dead&&dist(z.x,z.y,m.x,m.y)<12)X.hurtZ(z,999,0,0)}
  o.mobs=o.mobs.filter(m=>m.x>-200&&m.x<L.w+200&&m.y>-200&&m.y<L.h+200&&dist(m.x,m.y,c.x,c.y)<900);
  // хрупкий груз
  if(o.cargoOn){const sp=Math.abs(c.v);if(o._pv!=null&&o._pv-sp>45&&o._pv>50){o.cargo-=12;note('Груз! Аккуратнее!');sfx('clang',.7)}o._pv=sp;
    if((PS.kills-(o._k0??(o._k0=PS.kills)))>(o._kk||0)){o._kk=PS.kills-o._k0;if(sp>60)o.cargo-=1.5}
    if(o.cargo<=0){o.cargo=100;note('Груз разбит!');X.loseLife()}}
  if(o.own)o.own(o,c,dt);
}
// поперечная помеха: выезжает сбоку перед машиной и пересекает дорогу
function crossMob(o,c,d,sp,w,h,ex){const p=AH(o,c,d),side=Math.random()<.5?1:-1,nx=-p.dy,ny=p.dx,rot=p.dx===0?false:true;
  return Object.assign({x:p.x+nx*side*330,y:p.y+ny*side*330,vx:-nx*side*sp,vy:-ny*side*sp,w:rot?h:w,h:rot?w:h,rot},ex)}
function drawMobs(o){for(const m0 of o.mobs){let m=m0;if(m0.rot){ctx.save();ctx.translate(m0.x,m0.y);ctx.rotate(Math.PI/2);m=Object.assign({},m0,{x:0,y:0,w:m0.h,h:m0.w,vx:m0.vy,vy:-m0.vx})}const x=m.x-m.w/2,y=m.y-m.h/2;
  if(m.kind==='log'){R(x,y,m.w,m.h,'#3a3a40');R(x+(m.vx>0?m.w-12:0),y,12,m.h,'#8a2a2a');R(x+(m.vx>0?m.w-10:2),y+2,8,4,'#9ad0ff');for(let i=0;i<4;i++)R(x+(m.vx>0?2:14),y+1+i*3.6,m.w-16,3,i%2?'#7a5a32':'#9a7a4a');R(x+4,y-1,4,m.h+2,'#1a1a1a');R(x+m.w-8,y-1,4,m.h+2,'#1a1a1a')}
  else if(m.kind==='police'){R(x,y,m.w,m.h,'#e8e8ec');R(x,y+m.h*.35,m.w,m.h*.3,'#1a2a6a');R(x+2,y+3,m.w-4,5,'#2a3a50');const f=Math.floor(tm*8)%2;R(x+2,y+m.h/2-1,4,2,f?'#ff2a2a':'#2a5aff');R(x+m.w-6,y+m.h/2-1,4,2,f?'#2a5aff':'#ff2a2a');R(x+3,y+m.h-5,m.w-6,2,'#8a1018')}
  else if(m.kind==='tram'){R(x,y,m.w,m.h,'#c82a2a');R(x,y+2,m.w,3,'#e8e8e0');for(let i=6;i<m.w-6;i+=12)R(x+i,y+7,8,7,'#2a3a50');R(x,y+m.h-3,m.w,3,'#5a1a1a');R(x+m.w/2-1,y-6,2,6,'#3a3a3a')}if(m0.rot)ctx.restore()}}
// подсказка/HUD поверх
const _rnd=render;
render=function(){_rnd();try{hud()}catch(e){}};
function hud(){const c=K.carState&&K.carState(),o=CURO;if(!c||!o||state!=='play'||C1.mode!=='carK'||(UP.isOpen&&UP.isOpen()))return;const k=ui.width/W;u.setTransform(k,0,0,k,0,0);
  let y=40;const bar=(lbl,v,col)=>{panel(4,y,116,8,.72);uiFont(3.8,true);u.fillStyle='#9a92b0';u.fillText(lbl,9,y+5.6);X.hudBar(40,y+2,58,4,v,col);y+=9};
  if(o.time){panel(W/2-26,26,52,12,.75);uiFont(7,true);u.textAlign='center';u.fillStyle=o.tl<15?(Math.sin(tm*10)>0?'#ff3a3a':'#fff'):'#ffd23a';u.fillText(Math.ceil(o.tl)+' с',W/2,35);u.textAlign='left'}
  if(o.cargoOn)bar('ГРУЗ',o.cargo/100,o.cargo<30?'#ff3a3a':'#ffd23a');
  if(o.nitro||gar().nitro)bar(touch.on?'НИТРО':'НИТРО ⇧',o.nt,o.nb>0?'#ffffff':'#6ad8ff');
  if(o.drift&&!touch.on){uiFont(3.6,true);u.fillStyle='rgba(255,255,255,.7)';u.fillText('Пробел — дрифт',9,y+5)}
}
// кнопки телефона в машине
C1.xbtn=C1.xbtn||[];
C1.xbtn.push({x:W-92,y:H-42,r:10,t:'НИТРО',col:'#6ad8ff',vis:()=>touch.on&&C1.mode==='carK'&&!!CURO&&!!(CURO.nitro||gar().nitro),act:()=>{HMC.nitroTap=true}},
  {x:W-66,y:H-68,r:9,t:'ДРИФТ',col:'#ff9a4a',vis:()=>touch.on&&C1.mode==='carK'&&!!CURO&&!!CURO.drift,act:()=>{HMC.driftT=.6}});

// ---------- особенности существующих поездок ----------
const EXTRA={
  // Т5 кабриолет: серпантин на время, мопедные зомби
  cabrio5(o){o.time=95;o.cpAdd=22;o.timeFail='Самолёт улетит без нас! Не успели.';
    o.paint=L=>{const h=o.h0||L.h;o.cps=[h*.78,h*.56,h*.34,h*.14]};
    o.own=(o,c,dt)=>{o.spT-=dt;if(o.spT<=0&&!c.end){o.spT=rn(4,6.5);const n=1+(Math.random()<.4?1:0);for(let i=0;i<n;i++){const bp=AH(o,c,-150-i*20),bl=rn(-50,50),z=E.addZ('fast',o.rt?bp.x-bp.dy*bl:cl(c.x+bl,110,370),o.rt?bp.y+bp.dx*bl:c.y+150+i*20,{st:'chase',hp:40,max:40,sp:118});z.moped=1}note('Зомби на мопедах сзади!')}}},
  // Т6 X6: ночь, фары, грязь, лесовоз
  x6road(o){o.night=.7;o.mud=[];
    o.paint=L=>{const H0=o.h0||L.h;for(let y=H0-500;y>300;y-=rn(240,380)){let x=rn(140,320),w=rn(50,90),h=rn(26,40);if(o.rt){const f=(H0-140-y)/(H0-340),p=RT.at(o.rt,f*o.rt.L),l=(x-230)*.7;x=p.x-p.dy*l;y=p.y+p.dx*l;if(p.dy===0){const t=w;w=h;h=t}}o.mud.push({x,y,w,h});for(let i=0;i<40;i++){const a=rn(0,TAU),r=Math.sqrt(Math.random());X.B(Math.round(x+Math.cos(a)*r*w/2),Math.round(y+Math.sin(a)*r*h/2),4,4,i%3?'#3a2a1a':'#4a3622')}}};
    o.own=(o,c,dt)=>{for(const m of o.mud)if(Math.abs(c.x-m.x)<m.w/2&&Math.abs(c.y-m.y)<m.h/2){c.v*=Math.exp(-2.4*dt);if(Math.random()<.5)E.L.fx.push({x:c.x+rn(-8,8),y:c.y+rn(-6,6),vx:rn(-20,20),vy:rn(-20,20),life:.3,c:'#4a3622'});if(!o._mn){o._mn=1;note('Грязь! Объезжай лужи')}}};
    o.mobGen=(o,c,dt)=>{o.lgT=(o.lgT==null?6:o.lgT)-dt;if(o.lgT<=0&&VY(o,c)>500){o.lgT=rn(9,13);o.mobs.push(crossMob(o,c,230,85,64,18,{kind:'log',dmg:35,why:'Зомби-лесовоз!'}));note('Лесовоз поперёк дороги!');sfx('groan',.6)}}},
  // Т8 Поло RS: дрифт, нитро, патрульные, трамвай, время
  drive8(o){o.nitro=1;o.drift=1;o.time=110;o.cpAdd=18;o.timeFail='Плотинку перекрыли. Не успели!';
    o.paint=L=>{const h=o.h0||L.h;o.cps=[h*.75,h*.5,h*.25]};
    o.own=(o,c,dt)=>{const dr=(keys.Space||HMC.driftT>0)&&Math.abs(c.v)>45;if(HMC.driftT>0)HMC.driftT-=dt;
      if(dr){const [mx,my,ml]=X.inputMove();if(ml>.15){const want=Math.atan2(my,mx);c.a+=cl(ad(want,c.a),-2.6*dt,2.6*dt)}c.v*=Math.exp(-.35*dt);
        if(Math.random()<.8){E.L.dx.fillStyle='rgba(10,10,12,.35)';E.L.dx.fillRect(Math.round(c.x-Math.cos(c.a)*10),Math.round(c.y-Math.sin(c.a)*10),2,2)}
        o.dT=(o.dT||0)+dt;if(o.dT>1.2){o.dT=0;C1.addRub&&C1.addRub(40,c.x,c.y-14);X.floatT(c.x,c.y-20,'ДРИФТ!','#ff9a4a')}}else o.dT=0};
    o.mobGen=(o,c,dt)=>{o.pT=(o.pT==null?8:o.pT)-dt;o.trT=(o.trT==null?14:o.trT)-dt;
      if(o.pT<=0&&VY(o,c)>600){o.pT=rn(10,14);const p=AH(o,c,260),l=rn(-70,70),rot=p.dy===0;o.mobs.push({kind:'police',x:p.x-p.dy*l,y:p.y+p.dx*l,vx:-p.dx*70,vy:-p.dy*70,w:rot?34:20,h:rot?20:34,rot,dmg:30,why:'Патрульная машина с зомби!'});note('Патруль навстречу!')}
      if(o.trT<=0&&VY(o,c)>600){o.trT=rn(16,22);o.mobs.push(crossMob(o,c,240,60,130,22,{kind:'tram',dmg:45,why:'Трамвай! Он не тормозит.'}));note('Трамвай поперёк!');sfx('clang',.5)}
      for(const m of o.mobs)if(m.kind==='police'){if(m.rot)m.vy=cl((c.y-m.y)*.8,-40,40);else m.vx=cl((c.x-m.x)*.8,-40,40)}}},
};
HMC.EXTRA=EXTRA;HMC.road=(ch,cfg,done)=>road(ch,cfg,done);

// ---------- Т3, Т4, Т7: новые поездки ----------
function road(ch,cfg,done){
  const RW=cfg.rw||480,RH=cfg.len||3600,x0=cfg.x0||120,x1=cfg.x1||360;
  K.car(ch,{id:cfg.id,w:RW,h:RH,startX:(x0+x1)/2,startY:RH-120,route:cfg.route,title:cfg.title,sub:cfg.sub,hudCol:cfg.col,vmax:cfg.vmax||115,noGun:cfg.noGun,
    gun:cfg.gun||{name:'ПИСТОЛЕТ',cd:.22,dmg:26,sp:440,snd:'shot',heat:.05,ohNote:'Магазин пуст! Перезарядка — дави!'},dmgCar:cfg.dmg||10,nitro:cfg.nitro,
    build(L){E.gfill(0,0,RW,RH,1);E.gfill(x0,0,x1,RH,0);const th=cfg.theme;
      for(let y=0;y<RH;y+=4)for(let x=0;x<RW;x+=4){const h=Math.abs(Math.sin(x*12.9898+y*78.233)*43758.5453)%1,inR=x>=x0&&x<x1;X.B(x,y,4,4,inR?(h<.1?th.r2:th.r1):(h<.15?th.s2:th.s1))}
      if(cfg.deco)cfg.deco(L,x0,x1,RH);
      let s=cfg.seed||7;const rr=()=>{s=(s*16807)%2147483647;return s/2147483647};
      for(let y=RH-360;y>220;y-=cfg.gap||70){const n=1+Math.floor(rr()*(cfg.pack||3));for(let i=0;i<n;i++){const r=rr();E.addZ(r<.15?'fast':r<.2&&cfg.brutes?'brute':(cfg.ztype||'normal'),x0+16+rr()*(x1-x0-32),y+rr()*30,{hp:50,max:50})}}
      if(cfg.dark){L.dark=cfg.dark;L.tint=cfg.tint||'6,4,10'}X.buildNav()},
    draw:cfg.draw,fin:c=>c.y<150,onFin:()=>{X.go(done)},prog:c=>1-(c.y-150)/(RH-270),
    tick:cfg.tick});
  if(cfg.after)cfg.after(CURO);
}
// Т3 вагонетка: три колеи, балки, без стрельбы (Черсик — кот)
HMC.cart=function(ch,done){
  const lanes=[176,240,304];let beams=[];
  road(ch,{id:'cart3',title:'ВАГОНЕТКА',sub:'Черсик несётся по старой узкоколейке',route:'КАТАКОМБЫ → ЛОГОВО',col:'#c8a060',len:3400,x0:150,x1:330,vmax:120,noGun:1,dmg:12,dark:.55,tint:'8,4,2',
    theme:{r1:'#2a221c',r2:'#1e1814',s1:'#141010',s2:'#1c1614'},ztype:'crawler',gap:120,pack:2,
    deco(L,x0,x1,RH){for(const lx of lanes){for(let y=0;y<RH;y+=4){X.B(lx-7,y,2,4,'#5a5a62');X.B(lx+5,y,2,4,'#5a5a62')}for(let y=0;y<RH;y+=10)X.B(lx-9,y,18,3,'#4a3626')}
      beams=[];for(let y=RH-500;y>260;y-=rn(260,360)){const free=Math.floor(Math.random()*3);beams.push({y,free});for(let i=0;i<3;i++)if(i!==free){X.B(lanes[i]-18,y-3,36,6,'#6a4a2a');X.B(lanes[i]-18,y-3,36,1,'#8a6a3a')}}
      for(let y=60;y<RH;y+=180)L.lights.push([x0-2,y,60,.7],[x1+2,y+90,60,.7])},
    gun:{name:'ДЕРЖИСЬ',cd:9,dmg:0,sp:0,n:0},
    draw(x,y,a){ctx.save();ctx.translate(Math.round(x),Math.round(y));R(-9,-12,18,24,'#5a4a3a');R(-8,-11,16,22,'#3a2e24');R(-9,-12,18,2,'#8a7a6a');R(-9,10,18,2,'#8a7a6a');
      R(-11,-9,2,5,'#1a1a1a');R(9,-9,2,5,'#1a1a1a');R(-11,4,2,5,'#1a1a1a');R(9,4,2,5,'#1a1a1a');R(-4,-6,8,8,'#141418');R(-3,-8,2,3,'#141418');R(1,-8,2,3,'#141418');R(-2,-4,1,1,'#c8e040');R(1,-4,1,1,'#c8e040');ctx.restore()},
    tick(c,dt){const [mx]=dlg?[0]:X.inputMove();c.a=-Math.PI/2;c.v=Math.max(c.v,85);
      const tgt=CURO._lane??1;if(!CURO._lk&&Math.abs(mx)>.5){CURO._lane=cl(tgt+(mx>0?1:-1),0,2);CURO._lk=1;sfx('clang',.4)}if(Math.abs(mx)<.3)CURO._lk=0;
      const lx=lanes[CURO._lane??1];c.x+=cl(lx-c.x,-120*dt,120*dt);
      for(const b of beams)if(!b.hit&&Math.abs(c.y-b.y)<6){b.hit=1;if(Math.abs(c.x-lanes[b.free])>14){hitCar(c,34,'Балка! Перескакивай на свободную колею');c.v*=.5}}}
  },done);
  note('Влево/вправо — перескочить на другую колею. Свободную от балки колею видно заранее.');
};
// Т4 самокат Егора по Невскому: Микроб стреляет назад
HMC.egor=function(ch,done){
  road(ch,{id:'egor4',title:'САМОКАТ ЕГОРА',sub:'Егор рулит, Микроб отстреливается назад',route:'ДВОР → НЕВСКИЙ',col:'#ffd23a',len:3800,x0:100,x1:380,vmax:135,dmg:14,nitro:0,gap:80,pack:2,
    theme:{r1:'#2e2e34',r2:'#26262c',s1:'#3a3a42',s2:'#44444c'},
    deco(L,x0,x1,RH){for(let y=0;y<RH;y+=40)X.B(239,y,2,18,'#e8e8e0');for(let y=40;y<RH;y+=150){X.B(8,y,84,110,'#8a7a6a');X.B(388,y+50,84,110,'#9a8a7a');for(let wy=y+8;wy<y+100;wy+=14)for(let wx=14;wx<86;wx+=14)X.B(wx,wy,7,8,(wx*wy)%7<2?'#ffd27a':'#2a2a3a')}},
    gun:{name:'НАЗАД',cd:.2,dmg:30,sp:460,snd:'shot',heat:.045,ohNote:'Перезарядка! Егор, гони!'},
    draw(x,y,a,ta,fl){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(a);R(-10,-2,20,4,'#2a2a30');R(8,-5,2,10,'#8a8a92');R(-12,-2,3,4,'#1a1a1a');R(9,-2,3,4,'#1a1a1a');
      R(0,-4,6,8,'#3a5a3a');ctx.fillStyle='#c8a080';ctx.beginPath();ctx.arc(4,0,2.6,0,TAU);ctx.fill();R(-7,-4,6,8,'#8f9298');ctx.fillStyle='#3d2b20';ctx.beginPath();ctx.arc(-4,0,2.6,0,TAU);ctx.fill();ctx.restore();
      ctx.save();ctx.translate(Math.round(x-Math.cos(a)*4),Math.round(y-Math.sin(a)*4));ctx.rotate(ta);R(2,-1,8,2,'#1a1a1a');if(fl)R(10,-2,3,4,'#ffe27a');ctx.restore()},
    tick(c,dt){const back=c.a+Math.PI,d=ad(c.ta,back);if(Math.abs(d)>1.25)c.ta=back+Math.sign(d)*1.25;
      CURO.spT-=dt;if(CURO.spT<=0&&!c.end){CURO.spT=rn(2.2,3.5);for(let i=0;i<2;i++)E.addZ('fast',...(CURO.rt?(p=>{const l=rn(-60,60);return [p.x-p.dy*l,p.y+p.dx*l]})(AH(CURO,c,-130-i*16)):[cl(c.x+rn(-60,60),110,370),c.y+130+i*16]),{st:'chase',hp:40,max:40,sp:105})}}
  },done);
  note('Егор рулит. Ты стреляешь только назад — мышь/правый стик. Спереди их сбиваем.');
};
// Т7 буханка: хрупкий груз (звук для «Грибыча»)
HMC.buhanka=function(ch,done){
  road(ch,{id:'buh7',title:'БУХАНКА',sub:'Колонки, пульт и Скала в кузове — едем в «Грибыч». Хрупкое!',route:'ЗАЛ «НОКАУТ» → КЛУБ «ГРИБЫЧ»',col:'#9aff4a',len:3600,x0:110,x1:370,vmax:100,dmg:12,gap:75,pack:3,brutes:1,dark:.45,tint:'10,4,14',
    theme:{r1:'#34302a',r2:'#2a2622',s1:'#2a3a20',s2:'#324628'},
    deco(L,x0,x1,RH){for(let y=0;y<RH;y+=50){X.B(x0+4,y,2,22,'#c8c890');X.B(x1-6,y+25,2,22,'#c8c890')}for(let y=30;y<RH;y+=110){K.tree&&K.tree(40+(y*7)%40,y,12,'#1e4a24');K.tree&&K.tree(430-(y*3)%30,y+50,12,'#2a5a2a')}for(let y=100;y<RH;y+=260)L.lights.push([x0+30,y,70,.6])},
    gun:{name:'ОБРЕЗ',cd:.55,dmg:22,sp:400,snd:'shotgun',heat:.12,n:4,spr:.18,ohNote:'Перезарядка обреза!'},
    draw(x,y,a,ta,fl){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(a);R(-15,-8,30,16,'#5a6a3a');R(-15,-8,30,2,'#7a8a5a');R(6,-7,8,14,'#2a3a50');R(-12,-6,16,12,'#4a5a30');
      R(-14,-10,6,3,'#0a0a0c');R(6,-10,6,3,'#0a0a0c');R(-14,7,6,3,'#0a0a0c');R(6,7,6,3,'#0a0a0c');R(14,-6,2,3,'#fff6c0');R(14,3,2,3,'#fff6c0');R(-10,-3,10,6,'#2a2a30');R(-8,-2,3,4,'#3ef0b0');ctx.restore();
      ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(ta);R(4,-1,10,2,'#2a2a2a');if(fl)R(14,-2,3,4,'#ffe27a');ctx.restore()}
  },done);
  CURO.cargoOn=1;CURO.cargo=100;
  note('В кузове колонки и пульт. Резкие удары и тараны бьют груз — шкала ГРУЗ.');
};

// ---------- Т1 самокат: батарея, станции проката, мост на время ----------
const _upd=update;
update=function(dt){_upd(dt);try{ride(dt)}catch(e){console.warn(e)}};
function ride(dt){const Rd=X.RD;if(C1.mode!=='ride'||!Rd||state!=='play'||(UP.isOpen&&UP.isOpen()))return;
  if(!Rd.hm){const len=[1700,1900,2100][Rd.loc]||1800;Rd.hm={bat:Rd.loc===0?100:(HMC.bat??100),docks:[len*.36,len*.7],len,bt:Rd.loc===1?27:0}}
  const h=Rd.hm,free=!dlg&&!tr&&!Rd.end&&Rd.fall<=0;
  if(free){const [mx]=X.inputMove();h.bat=Math.max(0,h.bat-dt*4.2*(1+Math.max(0,mx)*.6));const k=(h.bat>0?1:.5)*(1+.3*Math.max(0,mx))-1;Rd.x+=80*k*dt;
    for(const d of h.docks)if(!d.got&&Math.abs(d-(Rd.x+Rd.px))<16){h.docks=h.docks.map(v=>v===d?{got:1}:v);h.bat=100;sfx('power',.6);note('Станция проката: батарея полная!')}
    if(h.bat<=0&&!h.warn){h.warn=1;note('Батарея села! Едем вдвое медленнее — ищи станцию проката')}
    if(h.bat>0)h.warn=0;
    if(h.bt>0){h.bt-=dt;if(h.bt<=0&&Rd.x<h.len){h.bt=27;note('Мост развели! Не успели.');X.loseLife()}}}
  HMC.bat=h.bat;
}
const _rnd2=render;
render=function(){_rnd2();try{rideHud()}catch(e){}};
function rideHud(){const Rd=X.RD;if(C1.mode!=='ride'||!Rd||!Rd.hm||state!=='play')return;const h=Rd.hm;
  // станции проката на экране
  ctx.save();for(const d of h.docks){if(typeof d!=='number')continue;const sx=d-Rd.x;if(sx<-20||sx>W+20)continue;R(sx-6,118,12,14,'#2a8a4a');R(sx-5,119,10,4,'#3aff7a');R(sx-1,132,2,8,'#5a5a62');R(sx-8,140,16,3,'#3a3a42');
    ctx.font='bold 4px monospace';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('ПРОКАТ',sx,116);ctx.textAlign='left'}ctx.restore();
  const k=ui.width/W;u.setTransform(k,0,0,k,0,0);
  panel(W/2-40,4,80,9,.72);uiFont(3.8,true);u.fillStyle='#9a92b0';u.fillText('БАТАРЕЯ',W/2-37,10);X.hudBar(W/2-8,6,44,4,h.bat/100,h.bat<20?'#ff3a3a':'#3aff7a');
  if(h.bt>0){panel(W/2-34,15,68,11,.75);uiFont(5.4,true);u.textAlign='center';u.fillStyle=h.bt<8?(Math.sin(tm*10)>0?'#ff3a3a':'#fff'):'#ffd23a';u.fillText('МОСТ: '+Math.ceil(h.bt)+' с',W/2,23.4);u.textAlign='left'}
}
})();
