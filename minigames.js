// =====================================================================
//  minigames.js — анимации обычных действий и мини-головоломки на ключевых
//  Подключается после всех глав. Наружу: window.MG.
//  Как работает: E/касание на предмете → MG.intercept(near) ищет правило по
//  тексту подсказки → показывает окно (анимация или головоломка) → по успеху
//  вызывает обычное действие предмета. Пока окно открыто, игра на паузе.
// =====================================================================
(function(){
'use strict';
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,k)=>a+(b-a)*k;
const snd=(n,p)=>{try{if(window.C1&&C1.X&&C1.X.sfx)C1.X.sfx(n,p);else if(typeof sfx==='function')sfx(n,p)}catch(e){}};
const MG={active:null,done:{},seen:{},lastL:null};window.MG=MG;
// ---- детальная отрисовка (03.11): объём и контур как у иконок оружия ----
const OUT='#0a090d';let SH=0;const CC={};
const hx3=c=>{c=c.slice(1);if(c.length===3)c=c.split('').map(x=>x+x).join('');return[0,2,4].map(i=>parseInt(c.substr(i,2),16))};
const lit=c=>CC['l'+c]||(CC['l'+c]='rgb('+hx3(c).map(v=>Math.round(v+(255-v)*.3)).join(',')+')');
const drk=c=>CC['d'+c]||(CC['d'+c]='rgb('+hx3(c).map(v=>Math.round(v*.62)).join(',')+')');
const mid=c=>CC['m'+c]||(CC['m'+c]='rgb('+hx3(c).map(v=>Math.round(v*.85)).join(',')+')');
const fr=(x,y,w,h,c)=>{u.fillStyle=c;u.fillRect(x,y,w,h)};
const hash=(a,b)=>{const v=Math.sin(a*127.1+b*311.7)*43758.5;return v-Math.floor(v)};
function bgTex(x,y,w,h,c){if(CURM&&!(window.NEON&&NEON.on===false)){const v=hx3(c),a=hx3(accOf(CURM));c='#'+v.map((q,i)=>Math.round(q*.62+a[i]*.38).toString(16).padStart(2,'0')).join('')}fr(x,y,w,h,c); // стена: обои-ромбики, мягкий градиент к полу
  u.fillStyle=lit(c);u.globalAlpha=.16;for(let j=0;j<h;j+=8)for(let i=((j/8)%2)*6;i<w;i+=12){u.fillRect(x+i,y+j+3,1,1);u.fillRect(x+i-.5,y+j+3.5,2,.5)}
  u.globalAlpha=.10;u.fillStyle=drk(c);for(let i=0;i<w;i+=3)for(let j=0;j<h;j+=3)if(hash(i,j)<.18)u.fillRect(x+i,y+j,.5,.5);
  const g=u.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'rgba(0,0,0,.18)');g.addColorStop(.35,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.22)');u.globalAlpha=1;u.fillStyle=g;u.fillRect(x,y,w,h)}
function strip(x,y,w,h,c){fr(x,y,w,h,c); // пол/столешница: доски
  fr(x,y,w,.5,lit(c));const dc=drk(c);
  if(h>=6){for(let j=0,r=0;j<h;j+=5,r++){fr(x,y+j+4.5,w,.5,dc);for(let i=(r%2)*14;i<w;i+=28)fr(x+i,y+j+.5,.5,4,dc);
    u.globalAlpha=.25;for(let i=0;i<w;i+=7)if(hash(i,r)<.5)fr(x+i+2,y+j+2,3,.5,lit(c));u.globalAlpha=1}}
  else fr(x,y+h-.5,w,.5,dc)}
const R=(x,y,w,h,c)=>{
  if(!SH||typeof c!=='string'||c[0]!=='#'||w<0||h<0){u.fillStyle=c;u.fillRect(x,y,w,h);return}
  if(w>=PW-4&&h>=PH-30){bgTex(x,y,w,h,c);return}
  if(w>=PW-4&&h>=2.5){strip(x,y,w,h,c);return}
  if(w<2.5||h<2.5){u.fillStyle=c;u.fillRect(x,y,w,h);return}
  fr(x-.5,y-.5,w+1,h+1,OUT);fr(x,y,w,h,c);
  if(w>=10&&h>=10){u.globalAlpha=.07;fr(x+.5,y+.5,w-1,(h-1)/2,'#fff');u.globalAlpha=1}
  fr(x,y,w,.5,lit(c));fr(x,y+.5,.5,h-1,mid(c));fr(x,y+h-.5,w,.5,drk(c));fr(x+w-.5,y+.5,.5,h-1,drk(c));
  if(w>=6&&h>=6&&w*h<9000){// 04.11: фактура и блик — шум-дизеринг к низу, диагональный блик, цветной рефлекс от неона
    u.save();u.beginPath();u.rect(x,y,w,h);u.clip();u.fillStyle=drk(c);u.globalAlpha=.35;for(let j=h*.55;j<h-.5;j+=1)for(let i=((j*2)|0)%2*.5;i<w-.5;i+=1)if(hash(x+i,y+j)<(j/h-.5)*.9)u.fillRect(x+i,y+j,.5,.5);
    u.globalAlpha=.12;u.fillStyle='#fff';u.beginPath();u.moveTo(x+w*.15,y);u.lineTo(x+w*.15+3,y);u.lineTo(x+w*.15+3-h*.6,y+h);u.lineTo(x+w*.15-h*.6,y+h);u.fill();
    if(CURM){u.globalAlpha=.22;u.fillStyle=accOf(CURM);u.fillRect(x+w-1.5,y+.5,1,h-1)}u.restore()}};
const circ=(x,y,r,c)=>{
  if(SH&&typeof c==='string'&&c[0]==='#'&&r>=2){u.fillStyle=OUT;u.beginPath();u.arc(x,y,r+.5,0,TAU);u.fill();u.fillStyle=drk(c);u.beginPath();u.arc(x,y,r,0,TAU);u.fill();
    u.fillStyle=c;u.beginPath();u.arc(x-.3,y-.4,r*.86,0,TAU);u.fill();u.fillStyle=lit(c);u.beginPath();u.arc(x-r*.35,y-r*.38,r*.28,0,TAU);u.fill();return}
  u.fillStyle=c;u.beginPath();u.arc(x,y,r,0,TAU);u.fill()};
const line=(x0,y0,x1,y1,c,w)=>{u.strokeStyle=c;u.lineWidth=w||1;u.beginPath();u.moveTo(x0,y0);u.lineTo(x1,y1);u.stroke()};
const T=(s,x,y,c,sz,b,al)=>{uiFont(sz||5,b);u.fillStyle=c;u.textAlign=al||'left';u.fillText(s,x,y);u.textAlign='left'};
const rnd=(a,b)=>a+Math.random()*(b-a);
// окно: 240×140 по центру
const PX=40,PY=18,PW=240,PH=144;
const inR=(p,x,y,w,h)=>p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h;

// ---------------- общий каркас ----------------
function frame(m){
  const c=m.col||'#ff4fd8';
  u.fillStyle='rgba(6,4,12,.74)';u.fillRect(0,0,W,H);
  // неоновое свечение вокруг окна
  u.save();u.shadowColor=c;u.shadowBlur=10;fr(PX-3,PY-3,PW+6,PH+6,c);u.restore();
  fr(PX-3.5,PY-3.5,PW+7,PH+7,OUT);fr(PX-3,PY-3,PW+6,PH+6,c);fr(PX-3,PY-3,PW+6,.5,lit(c));fr(PX-3,PY+PH+2.5,PW+6,.5,drk(c));
  fr(PX-1.5,PY-1.5,PW+3,PH+3,'#0a0710');fr(PX,PY,PW,PH,'#120c1c');
}
function frame2(m){ // поверх сцены: заголовок, заклёпки, крестик
  const c=m.col||'#ff4fd8';
  const g=u.createLinearGradient(0,PY,0,PY+12);g.addColorStop(0,'#2c1e46');g.addColorStop(1,'#160f24');u.fillStyle=g;u.fillRect(PX,PY,PW,12);
  fr(PX,PY+11.5,PW,.5,c);fr(PX,PY+12,PW,.5,OUT);
  for(let i=0;i<PW;i+=4)fr(PX+i,PY+1,2,.5,'rgba(255,255,255,.04)');
  for(const [x,y] of [[PX-1.5,PY-1.5],[PX+PW-.5,PY-1.5],[PX-1.5,PY+PH-.5],[PX+PW-.5,PY+PH-.5]]){fr(x-.5,y-.5,3,3,OUT);fr(x,y,2,2,'#8a8298');fr(x,y,1,1,'#e8e0f0')}
  // значок-ромб и заголовок с тенью
  u.save();u.translate(PX+6,PY+6);u.rotate(Math.PI/4);fr(-2.2,-2.2,4.4,4.4,OUT);fr(-1.7,-1.7,3.4,3.4,c);fr(-1.7,-1.7,3.4,.8,lit(c));u.restore();
  T(m.title,PX+12.5,PY+9,'rgba(0,0,0,.7)',5.4,true);T(m.title,PX+12,PY+8.5,c,5.4,true);
  if(!m.anim){fr(PX+PW-12.5,PY+1.5,10,9,OUT);fr(PX+PW-12,PY+2,9,8,'#3a2a52');fr(PX+PW-12,PY+2,9,.5,'#5a4a78');T('✕',PX+PW-7.5,PY+8.5,'#c8c0e0',5,true,'center')}
}
// неоновая обработка (04.11): цветной свет лампы сверху, контровой свет, мягкий кислотный градиент
let CURM=null;
const ACM=['#ff2e97','#22e5d4','#b04aff','#7dff3a','#ff7a1a','#36d7ff','#ff3df2','#ffe23a'];
function accOf(m){if(!m)return '#ff4fd8';if(m._acc)return m._acc;let h=7;for(const ch of String(m.title||''))h=(h*31+ch.charCodeAt(0))|0;return m._acc=ACM[Math.abs(h)%ACM.length]}
function mood(m){if(window.NEON&&NEON.on===false)return;const a=accOf(m),c=m.col||'#ff4fd8',t=(typeof tm==='number'?tm:0);
  u.save();
  u.globalCompositeOperation='soft-light';let g=u.createLinearGradient(PX,PY,PX+PW,PY+PH);g.addColorStop(0,c);g.addColorStop(.55,'rgba(40,10,80,0.6)');g.addColorStop(1,a);u.globalAlpha=.55;u.fillStyle=g;u.fillRect(PX,PY+12,PW,PH-12);
  u.globalCompositeOperation='lighter';u.globalAlpha=1;
  const lx=PX+PW*.5+Math.sin(t*.7)*6,ly=PY+12;g=u.createRadialGradient(lx,ly,2,lx,ly+30,PW*.55);g.addColorStop(0,hexA(a,.34));g.addColorStop(.5,hexA(a,.10));g.addColorStop(1,hexA(a,0));u.fillStyle=g;u.fillRect(PX,PY+12,PW,PH-12);
  g=u.createLinearGradient(PX,0,PX+28,0);g.addColorStop(0,hexA(c,.22));g.addColorStop(1,hexA(c,0));u.fillStyle=g;u.fillRect(PX,PY+12,28,PH-12);
  g=u.createLinearGradient(PX+PW,0,PX+PW-28,0);g.addColorStop(0,hexA(a,.22));g.addColorStop(1,hexA(a,0));u.fillStyle=g;u.fillRect(PX+PW-28,PY+12,28,PH-12);
  // неоновая трубка под потолком
  u.globalAlpha=.9;fr(PX+PW*.5-40,PY+13,80,1,a);u.globalAlpha=.35;fr(PX+PW*.5-42,PY+12.5,84,2.5,a);
  u.restore()}
function hexA(c,al){const v=hx3(c);return 'rgba('+v[0]+','+v[1]+','+v[2]+','+al+')'}
function vignette(){const g=u.createRadialGradient(HX,HY,PW*.25,HX,HY,PW*.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(6,2,14,.42)');u.fillStyle=g;u.fillRect(PX,PY+12,PW,PH-12);
  u.globalAlpha=.05;u.fillStyle='#000';for(let y=PY+12;y<PY+PH;y+=1.5)u.fillRect(PX,y,PW,.5);u.globalAlpha=1}
function footer(m,txt){
  if(txt){uiFont(4.4);const w=u.measureText(txt).width+10;fr(W/2-w/2,PY+PH-9,w,7,'rgba(10,7,16,.78)')}
  T(txt,W/2,PY+PH-4,'#9a92b0',4.4,false,'center');
  if(!m.anim&&m.t>30&&m.hint)T('💬 '+m.hint,W/2,PY+PH-11,'#ffd23a',4.4,false,'center');
  if(!m.anim&&m.t>60&&!m.won){R(PX+PW-62,PY+PH-22,58,10,'rgba(255,210,58,.85)');T('Решить за меня',PX+PW-33,PY+PH-15,'#120a1c',4.4,true,'center')}
}
function finish(m,ok){
  if(m.closing)return;m.closing=true;m.won=ok;
  const end=()=>{MG.active=null;if(ok&&m.cb)m.cb()};
  if(ok){snd('ring',1.4);m.endT=m.anim?.5:.9;m.onEnd=end}else end();
}
MG.open=function(def,cb){const m=Object.assign({t:0,k:0,hold:false,cb},def);m.init&&m.init(m);MG.active=m;snd('click')};

// ---------------- ввод ----------------
const toXY=e=>({x:(e.clientX-OX)/SC,y:(e.clientY-OY)/SC});
function pdown(p){const m=MG.active;if(!m||m.closing)return;
  if(!m.anim&&inR(p,PX+PW-12,PY+2,9,8)){finish(m,false);return}
  if(!m.anim&&m.t>60&&inR(p,PX+PW-62,PY+PH-22,58,10)){m.solve&&m.solve(m);m.solved=1;finish(m,true);return}
  m.ptr=p;m.down=true;m.hold=true;m.onDown&&m.onDown(m,p);if(m.taps)tap(m)}
function pmove(p){const m=MG.active;if(!m)return;m.ptr=p;m.onMove&&m.onMove(m,p)}
function pup(p){const m=MG.active;if(!m)return;m.down=false;m.hold=m.keyHold||false;m.onUp&&m.onUp(m,p)}
function tap(m){if(m.closing)return;m.tapN=(m.tapN||0)+1;m.tapT=.25;m.onTap&&m.onTap(m);if(m.tapN>=m.taps)finish(m,true)}
addEventListener('keydown',e=>{const m=MG.active;if(!m)return;
  if(e.code==='Escape'&&!m.anim){finish(m,false)}
  else if(['KeyE','Space','Enter'].includes(e.code)){if(!e.repeat){m.keyHold=true;m.hold=true;if(m.taps)tap(m);m.onKey&&m.onKey(m,'act')}}
  else m.onKey&&m.onKey(m,e.code);
  e.preventDefault();e.stopImmediatePropagation()},true);
addEventListener('keyup',e=>{const m=MG.active;if(!m)return;if(['KeyE','Space','Enter'].includes(e.code)){m.keyHold=false;m.hold=m.down||false;m.onKeyUp&&m.onKeyUp(m)}m.onKeyUp2&&m.onKeyUp2(m,e.code)},true);
addEventListener('mousedown',e=>{if(!MG.active)return;pdown(toXY(e));e.preventDefault();e.stopImmediatePropagation()},true);
addEventListener('mousemove',e=>{if(!MG.active)return;pmove(toXY(e))},true);
addEventListener('mouseup',e=>{if(!MG.active)return;pup(toXY(e))},true);
addEventListener('touchstart',e=>{if(!MG.active)return;const t=e.changedTouches[0];pdown(toXY(t));e.preventDefault();e.stopImmediatePropagation()},{capture:true,passive:false});
addEventListener('touchmove',e=>{if(!MG.active)return;pmove(toXY(e.changedTouches[0]));e.preventDefault();e.stopImmediatePropagation()},{capture:true,passive:false});
addEventListener('touchend',e=>{if(!MG.active)return;pup(toXY(e.changedTouches[0]))},true);

// ---------------- цикл ----------------
const _update=update,_render=render;
update=function(dt){
  const m=MG.active;
  if(m){tm+=dt;m.t+=dt;if(m.tapT>0)m.tapT-=dt;
    if(m.closing){m.endT-=dt;if(m.endT<=0)m.onEnd&&m.onEnd();return}
    if(m.dur&&m.t>=m.dur&&!m.holdK&&!m.taps)finish(m,true);
    if(m.holdK){if(m.hold){m.k=clamp(m.k+dt*m.holdK,0,1.2);m.onHoldTick&&m.onHoldTick(m,dt)}if(!m.manual&&m.k>=1)finish(m,true)}
    m.tick&&m.tick(m,dt);return}
  _update(dt);
};
render=function(){
  _render();const m=MG.active;if(!m)return;
  u.save();frame(m);u.save();u.beginPath();u.rect(PX,PY+12,PW,PH-12);u.clip();SH=1;CURM=m;try{m.draw(m)}finally{SH=0}mood(m);vignette();u.restore();frame2(m);
  if(m.closing&&m.won){const k=1-m.endT/(m.anim?.5:.9);T(m.okText||(m.anim?'':'ГОТОВО!'),W/2,PY+PH/2+4,`rgba(62,240,176,${clamp(k*3,0,1)})`,12,true,'center')}
  footer(m,m.foot||'');u.restore();
};

// ---------------- общие рисовалки ----------------
const HX=W/2,HY=PY+12+(PH-12)/2; // центр рабочей области
function hand(x,y,a,grab,skin){const sk=skin||'#efc5a5',sd=drk(sk),sl='#5a5c64';u.save();u.translate(x,y);u.rotate(a||0);
  // рукав серой куртки Микроба с манжетой
  fr(-19.5,-4.5,17,10,OUT);fr(-19,-4,16,9,sl);fr(-19,-4,16,1,'#7a7c86');fr(-19,4,16,1,'#3a3c44');fr(-12,-4,.5,9,'#46484f');fr(-6,-4,3,9,'#46484f');fr(-6,-4,3,.6,'#6a6c76');
  // ладонь
  fr(-3.5,-4.5,9,10,OUT);fr(-3,-4,8,9,sk);fr(-3,-4,8,1,lit(sk));fr(-3,4,8,1,sd);fr(1,-1,.6,3,sd);
  if(grab){fr(4.5,-4.5,4,10,OUT);fr(5,-4,3,9,sk);for(const j of [-2,0.3,2.6])fr(5,j,3,.5,sd);fr(7.4,-4,.6,9,sd);fr(-1,-5.5,4,3,OUT);fr(-.5,-5,3,2,sk)}
  else{const F=[[-4,5],[-1.3,6],[1.4,5.5],[3.6,4.5]];for(const [fy,fl] of F){fr(4.5,fy-.5,fl+1,3,OUT);fr(5,fy,fl,2,sk);fr(5,fy,fl,.5,lit(sk));fr(5+fl-1.2,fy+.4,1,1.1,'#f8dccb')}
    fr(-1,-6.5,4,3,OUT);fr(-.5,-6,3,2,sk);fr(-.5,-6,3,.5,lit(sk))}
  u.restore()}
function holdBar(m,x,y,w,label){fr(x-1,y-1,w+2,7,OUT);fr(x,y,w,5,'#2a2040');fr(x,y,w,1,'#1a1428');const kw=w*clamp(m.k,0,1);fr(x,y,kw,5,'#3ef0b0');fr(x,y,kw,1,'#a8ffe0');fr(x,y+4,kw,1,'#1e9a70');for(let i=6;i<w;i+=6)fr(x+i,y,.5,5,'rgba(0,0,0,.3)');T(label||'',x+w/2,y-2,'#c8c0e0',4.4,false,'center')}
const HOLD=()=>touch.on?'Держи палец на экране':'Держи E (или кнопку мыши)';
const TAPS=n=>touch.on?'Коснись '+n+' раза':'Жми E '+n+' раза';

// иконки предметов/оружия из items.js / icons.js (если загружены)
const IC=(k,x,y,h)=>{try{return window.ICONS&&ICONS.item&&ICONS.item(u,k,x,y,h,'c')}catch(e){return 0}};
const WI=(k,x,y,s)=>{try{return window.ICONS&&ICONS.draw&&ICONS.draw(u,k,x,y,s)}catch(e){return 0}};
function shadow(x,y,w){u.fillStyle='rgba(0,0,0,.28)';u.beginPath();u.ellipse(x,y,w,w*.22,0,0,TAU);u.fill()}
function shelfWall(){for(let i=0;i<3;i++){const x=PX+16+i*78;R(x,PY+26,26,3,'#6a4a2e')}}

// ================= АНИМАЦИИ (обычные действия) =================
const A={};
A.cupboard={title:'Шкафчик',dur:2.4,anim:1,draw(m){const t=m.t;
  R(PX,PY+12,PW,PH-12,'#e8dcc8');R(PX,PY+112,PW,20,'#a87a4a');R(PX,PY+110,PW,3,'#c89a6a');
  const o=clamp(t/.6,0,1);R(HX-50,PY+22,100,60,'#5a3a24');R(HX-46,PY+26,92,52,'#2a1a10');
  for(let i=0;i<4;i++){R(HX-38+i*20,PY+40,10,16,'rgba(200,230,255,.5)');R(HX-38+i*20,PY+40,10,2,'#fff')}R(HX-44,PY+58,88,2,'#7a5a3a');
  R(HX-50-o*30,PY+22,50-o*20,60,'#8a5a34');R(HX+o*20,PY+22,50-o*20,60,'#8a5a34');
  const g=clamp((t-.7)/.7,0,1),d=clamp((t-1.5)/.7,0,1),gx=HX-18,gy=lerp(PY+48,PY+100,d);
  if(t>.6){hand(lerp(PX+20,gx-2,g),lerp(PY+120,gy,g),-.5+g*.3,g>=1)}
  if(t>1.4){R(gx-4,gy-8,10,16,'rgba(200,230,255,.6)');R(gx-4,gy-8,10,2,'#fff')}
  m.foot='Открыл шкафчик, взял стакан'}};
A.pour={title:'Налить воды',holdK:.42,manual:1,init(m){m.lv=0;m.done2=0},
  onHoldTick(m,dt){m.lv=m.k},onKeyUp(m){chk(m)},onUp(m){chk(m)},
  tick(m){if(m.lv>=1.08&&!m.closing){m.spill=1;m.okText='Ну и ладно, так свежее!';finish(m,true)}},
  draw(m){R(PX,PY+12,PW,PH-12,'#e8dcc8');R(PX,PY+112,PW,20,'#a87a4a');R(PX,PY+110,PW,3,'#c89a6a');
    const gx=HX+14,gy=PY+80,gh=30,lv=clamp(m.lv,0,1);
    R(gx-12,gy+gh-gh*lv,24,gh*lv,'rgba(90,170,255,.7)');u.strokeStyle='#dfefff';u.lineWidth=1;u.strokeRect(gx-12.5,gy-.5,25,gh+1);
    R(gx+14,gy+gh*.05,3,gh*.2,'rgba(62,240,176,.8)');T('норм',gx+19,gy+gh*.18,'#3ef0b0',4);
    if(m.spill||m.lv>1){R(gx-30,gy+gh+1,70,3,'rgba(90,170,255,.6)')}
    const tilt=m.hold?-1.1:-.2;u.save();u.translate(HX-28,PY+60);u.rotate(tilt);R(-8,-26,16,40,'rgba(150,200,255,.55)');R(-4,-34,8,9,'rgba(150,200,255,.55)');R(-4,-37,8,3,'#3a7ac8');R(-8,-10,16,10,'#3a7ac8');T('АКВА',0,-3,'#fff',4,true,'center');u.restore();
    if(m.hold&&m.lv<1.08){for(let i=0;i<6;i++)R(HX-6+i*2+Math.sin(tm*20+i),PY+62+i*3+((tm*60)%6),2,3,'rgba(90,170,255,.8)')}
    m.foot=HOLD()+', отпусти на зелёной метке'}};
function chk(m){if(m.closing)return;if(m.lv>=.8){m.okText=m.lv<=1?'Идеально!':'Ну и ладно, так свежее!';finish(m,true)}}
A.window={title:'Окно',holdK:.9,anim:0,draw(m){const k=clamp(m.k,0,1);R(PX,PY+12,PW,PH-12,'#3a4a7a');
    R(HX-50,PY+20,100,110,'#e8e8f0');R(HX-44,PY+26,88,98,'#14223a');for(let i=0;i<20;i++)R(HX-44+(i*37)%88,PY+30+(i*23)%60,1,1,'#fff');R(HX-44,PY+96,88,28,'#2a1a3a');
    u.save();u.translate(HX+44,PY+26);const sw=1-k*.7;R(-88*sw,0,88*sw,98,'rgba(180,210,240,.35)');u.strokeStyle='#fff';u.strokeRect(-88*sw+.5,.5,88*sw-1,97);u.restore();
    u.save();u.translate(HX-36+ (1-k)*0,PY+75);u.rotate(-k*Math.PI/2);R(-1,-2,10,4,'#d8d8e0');u.restore();
    for(let i=0;i<8;i++){const sx=Math.sin(tm*3+i)*k*4;R(HX-56+sx,PY+20+i*13,8,12,'#7a5aa8')}
    holdBar(m,HX-40,PY+PH-26,80,'поворачиваю ручку');m.foot=HOLD()}};
A.litter={title:'Лоток Черсика',taps:3,anim:0,draw(m){const n=m.tapN||0;R(PX,PY+12,PW,PH-12,'#d8c8a8');
    R(PX,PY+108,PW,24,'#b8a888');shadow(HX,PY+110,54);R(HX-50,PY+70,100,40,'#5aa8a0');R(HX-46,PY+72,92,30,'#e8e0c8');for(let i=0;i<60;i++)fr(HX-44+hash(i,3)*88,PY+74+hash(i,4)*26,.8,.8,hash(i,5)<.5?'#c8c0a8':'#f8f4e8');T('ЧЕРСИК',HX,PY+107,'#2a6a64',4,true,'center');for(let i=0;i<3-n;i++)R(HX-30+i*24,PY+80+(i%2)*6,8,5,'#6a4a2a');
    const sc=m.tapT>0?1:0;u.save();u.translate(HX+30,PY+60-sc*12);u.rotate(-.4-sc*.5);R(-14,-2,20,8,'#3ef0b0');R(6,0,20,3,'#2a8a6a');u.restore();
    for(let i=0;i<4;i++){const a=tm*2+i;u.strokeStyle=`rgba(120,200,60,${.4*(1-n/3)})`;u.beginPath();u.arc(HX-20+i*14,PY+60-((tm*20+i*10)%30),4,a,a+2);u.stroke()}
    T('Микроб: «Ох-х...»',HX,PY+30,'#9a6a4a',5,true,'center');m.foot=TAPS(3)}};
A.drawer={title:'Ящик под раковиной',dur:2,anim:1,draw(m){const t=m.t,o=clamp(t/.6,0,1);R(PX,PY+12,PW,PH-12,'#8a8a92');
    R(HX-60,PY+40,120,70,'#f0f0f0');R(HX-56,PY+60+o*14,112,40,'#1a1a1e');for(let i=0;i<10;i++)R(HX-50+i*11,PY+66+o*14,1,30,'#2a2a30');
    R(HX-30,PY+64+o*14,18,12,'#ffffff');R(HX-28,PY+66+o*14,14,8,'#f0e8e8');R(HX+6,PY+62+o*14,10,22,'#ff9ac8');R(HX+8,PY+60+o*14,6,3,'#fff');
    const g=clamp((t-.7)/.8,0,1);hand(lerp(PX+20,HX-22,g),lerp(PY+130,PY+70+o*14,g),-.6,g>=1);m.foot='Ватные диски и умывалка'}};
A.feed={title:'Корм Черсику',holdK:.55,draw(m){const k=clamp(m.k,0,1);R(PX,PY+12,PW,PH-12,'#e8d8b8');R(PX,PY+110,PW,22,'#c8a878');
    R(HX-20,PY+96,40,14,'#3a7ac8');R(HX-16,PY+96-k*6,32,6*k,'#a87a3a');
    u.save();u.translate(HX+10,PY+50);u.rotate(m.hold?-1:-.3);R(-12,-20,24,34,'#e8e0d0');R(-12,-20,24,6,'#ff4fa3');T('КОРМ',0,4,'#141418',4,true,'center');u.restore();
    if(m.hold)for(let i=0;i<5;i++)R(HX+rnd(-6,6),PY+60+((tm*80+i*9)%36),2,2,'#a87a3a');
    const cx=lerp(PX+PW+10,HX+40,clamp(k*1.5,0,1));R(cx,PY+92,30,14,'#141418');R(cx-6,PY+86,12,12,'#141418');R(cx-4,PY+82,3,5,'#141418');R(cx+2,PY+82,3,5,'#141418');R(cx-3,PY+90,2,2,'#c8e84a');R(cx+1,PY+90,2,2,'#c8e84a');R(cx+28,PY+80+Math.sin(tm*6)*3,3,14,'#141418');
    if(k>.6)T('Мрр-мяу!',cx,PY+76,'#fff',5,true,'center');holdBar(m,HX-40,PY+30,80,'сыплю корм');m.foot=HOLD()}};
A.pc={title:'За работу',dur:2.4,anim:1,draw(m){const t=m.t;R(PX,PY+12,PW,PH-12,'#1a1028');
    // окно с ночным городом за монитором
    R(PX+150,PY+20,74,56,'#2a2236');R(PX+153,PY+23,68,50,'#0c1430');for(let i=0;i<7;i++){const h=10+((i*29)%26);R(PX+153+i*10,PY+73-h,9,h,'#18203a');for(let j=0;j<h-4;j+=4)if(hash(i,j)<.5)fr(PX+155+i*10+(j%3),PY+75-h+j,1.5,1.5,'#ffd27a')}
    R(PX,PY+108,PW,24,'#d8d4e0');
    const g=clamp(t/.8,0,1);shadow(HX,PY+108,44);R(HX-52,PY+28,104,66,'#202028');R(HX-48,PY+32,96,56,g<1?'#05060a':'#16203e');fr(HX-48,PY+32,96,56,'rgba(80,140,255,'+(g*.06)+')');
    if(t>.8){R(HX-46,PY+34,92,6,'#2a3a6a');T('Почта · Jira · Zoom',HX-43,PY+38.6,'#c8d8ff',3.6,true);for(let i=0;i<7;i++){const w=10+((i*37+Math.floor(t*6))%56);fr(HX-42,PY+44+i*6,3,3,i%3?'#3ef0b0':'#ff7ac8');fr(HX-37,PY+44.5+i*6,w,2,i%3?'#3ef0b0':'#ff7ac8')}
      R(HX+20,PY+62,24,20,'#1e2a52');circ(HX+32,PY+70,4,'#efc5a5');R(HX+26,PY+74,12,8,'#3a7ac8')}
    fr(HX-2,PY+30,4,1,'#3a3a44');circ(HX,PY+31,.8,g<1?'#2a2a30':'#3ef0b0');
    R(HX-6,PY+94,12,12,'#2a2a30');R(HX-16,PY+104,32,4,'#2a2a30');
    R(HX-44,PY+110,88,10,'#2a2a30');for(let r=0;r<2;r++)for(let i=0;i<13;i++){const pr=Math.floor(t*12+i+r*5)%4===0;R(HX-42+i*6.6,PY+111.5+r*4+(pr?.5:0),5,3,pr?'#6a6a76':'#4a4a52')}
    // кружка
    R(HX+56,PY+98,12,12,'#e8e0d0');R(HX+68,PY+101,4,6,'#e8e0d0');fr(HX+57,PY+99,10,2,'#5a3a1a');T('♥',HX+62,PY+107,'#ff4fa3',4,true,'center');
    for(let i=0;i<3;i++){u.strokeStyle='rgba(255,255,255,.25)';u.lineWidth=.6;u.beginPath();u.arc(HX+60+i*3,PY+92-((tm*12+i*5)%10),2,i,i+2);u.stroke()}
    m.foot='Почта, таски, созвоны...'}};
A.glass={title:'Пожарный щит',taps:3,draw(m){const n=m.tapN||0;R(PX,PY+12,PW,PH-12,'#5a5a62');
    R(HX-40,PY+24,80,96,'#c8202a');R(HX-34,PY+30,68,84,'#2a0a0a');
    u.save();u.translate(HX-12,PY+38);u.rotate(Math.PI/2);WI('axe2',0,7,1.7);u.restore();
    R(HX+6,PY+52,18,44,'#c8202a');R(HX+10,PY+44,10,8,'#2a2a30');R(HX+18,PY+46,8,3,'#2a2a30');R(HX+8,PY+64,14,14,'#f0e8d8');T('ОУ-5',HX+15,PY+73,'#c8202a',3.2,true,'center');fr(HX+8,PY+54,2,40,'rgba(255,255,255,.3)');
    if(n<3){fr(HX-34,PY+30,68,84,'rgba(180,220,255,.22)');u.fillStyle='rgba(255,255,255,.25)';u.beginPath();u.moveTo(HX-30,PY+30);u.lineTo(HX-14,PY+30);u.lineTo(HX-34,PY+60);u.lineTo(HX-34,PY+40);u.fill()}
    else for(let i=0;i<10;i++){fr(HX-34+hash(i,1)*64,PY+108+hash(i,2)*6,2,1,'rgba(200,230,255,.6)')}
    u.strokeStyle='#fff';u.lineWidth=.8;for(let i=0;i<n*4;i++){const a=i*1.7;u.beginPath();u.moveTo(HX,PY+70);u.lineTo(HX+Math.cos(a)*(20+n*8),PY+70+Math.sin(a)*(20+n*8));u.stroke()}
    if(m.tapT>0)hand(HX+10,PY+80,-.3,true);T('ПРИ ПОЖАРЕ РАЗБИТЬ',HX,PY+22,'#fff',4.6,true,'center');m.foot=TAPS(3)}};
A.box={title:'Ящик сисадминов',dur:2,anim:1,draw(m){const o=clamp(m.t/.8,0,1);R(PX,PY+12,PW,PH-12,'#2a2a3a');
    R(PX,PY+112,PW,20,'#3a3a46');shadow(HX,PY+112,56);
    R(HX-50,PY+60,100,50,'#5a6a5a');for(let i=0;i<5;i++)fr(HX-46+i*20,PY+64,.5,44,'#46564a');R(HX-50,PY+60,100,4,'#6a7a6a');
    R(HX-46,PY+66,92,40,'#141418');
    WI('nailgun',HX-38,PY+92,3.2);IC('nails',HX+26,PY+76,14);for(let i=0;i<6;i++){R(HX-40+i*12,PY+98,8,3,'#a8a8b0')}
    u.save();u.translate(HX-50,PY+60);u.rotate(-o*.5);R(0,-8,100,8,'#6a7a6a');R(40,-6,20,4,'#c8c040');T('IT',50,-3,'#141418',3.4,true,'center');u.restore();
    R(HX-54,PY+80,6,10,'#4a4a52');R(HX+48,PY+80,6,10,'#4a4a52');
    T('ОТДЕЛ ИТ · НЕ ТРОГАТЬ',HX,PY+118,'#c8c0e0',3.6,true,'center');
    if(o>=1)T('Гвоздомёт! И гвозди.',HX,PY+24,'#ffd23a',5.4,true,'center');m.foot='Сисадмины знают толк'}};
A.card={title:'Ключ-карта',holdK:1.2,draw(m){const k=clamp(m.k,0,1);R(PX,PY+12,PW,PH-12,'#3a3a46');
    // дверь и считыватель
    R(HX-80,PY+18,70,120,'#5a5a66');R(HX-74,PY+26,58,50,'#4a4a56');R(HX-74,PY+82,58,50,'#4a4a56');R(HX-22,PY+76,8,4,'#c8c8d0');
    R(HX-4,PY+30,36,84,'#1a1a22');R(HX,PY+34,28,16,'#0a0a10');T(k>=1?'OPEN':'LOCKED',HX+14,PY+44,k>=1?'#3ef0b0':'#ff3a3a',4,true,'center');
    R(HX+12,PY+54,4,52,'#05050a');circ(HX+14,PY+110,2.4,k>=1?'#3ef0b0':'#ff3a3a');
    u.save();u.translate(HX+14,PY+50+k*44);R(-14,-6,16,22,'#e8e8f0');R(-12,-2,7,5,'#d8b030');fr(-12,0,7,.5,'#8a6a10');fr(-9.5,-2,.5,5,'#8a6a10');
    R(-4,-4,5,6,'#3a7ac8');T('АНИС',-6,12,'#141418',3.2,true,'center');fr(-13,14,14,.6,'#9a9aa8');u.restore();
    hand(HX+24,PY+60+k*44,Math.PI,true);
    holdBar(m,HX+40,PY+70,60,'провожу картой');m.foot=HOLD()}};
A.backpack={title:'Рюкзак',dur:2.4,anim:1,draw(m){const t=m.t;R(PX,PY+12,PW,PH-12,'#2a2030');R(PX,PY+120,PW,12,'#3a2a26');
    shadow(HX,PY+120,30);
    // рюкзак: лямки, карман, молния, нашивка
    R(HX-26,PY+64,52,56,'#3a5a3a');R(HX-22,PY+58,44,12,'#4a6a4a');fr(HX-20,PY+63,40,.6,'#c8c8a8');
    R(HX-16,PY+84,32,22,'#2e4a2e');fr(HX-15,PY+86,30,.6,'#c8c8a8');R(HX-2,PY+84,4,3,'#a8a8b0');
    R(HX-30,PY+70,5,40,'#2a3a2a');R(HX+25,PY+70,5,40,'#2a3a2a');R(HX-10,PY+52,20,6,'#2a3a2a');
    R(HX+8,PY+90,6,6,'#ff4fa3');fr(HX+10,PY+92,2,2,'#fff');
    const its=[['syr','шприц'],['ammo','патроны'],['key','ключ'],['band','бинт']];
    its.forEach((it,i)=>{const k=clamp((t-.3-i*.4)/.5,0,1);const x=lerp(PX+30+i*55,HX,k),y=lerp(PY+30,PY+70,k)-Math.sin(k*Math.PI)*20;if(k<1){
      if(it[0]==='key'){R(x-6,y-1,9,3,'#d8c040');circ(x+5,y,3.2,'#d8c040');fr(x-4,y+1,1.5,2,'#d8c040');fr(x-1,y+1,1.5,2,'#d8c040')}else if(!IC(it[0],x,y-6,12))R(x-5,y-3,10,6,'#c8c8d0');
      T(it[1],x,y-9,'#c8c0e0',4,false,'center')}});
    m.foot='Всё в рюкзак'}};
A.note={title:'Записка',dur:2.8,anim:1,draw(m){const o=clamp(m.t/.7,0,1);R(PX,PY+12,PW,PH-12,'#4a3a2a');
    R(HX-70*o,PY+24,140*o,100,'#f4eed8');if(o>=1){T('Мыша кормить',HX,PY+44,'#3a2a8a',6,true,'center');T('два раза в день!',HX,PY+54,'#3a2a8a',6,true,'center');T('Птичкам — зерно и воду.',HX,PY+70,'#3a2a8a',5,false,'center');T('ОКНА НЕ ОТКРЫВАТЬ!',HX,PY+88,'#c8202a',6,true,'center');T('— Полина ♥',HX+30,PY+110,'#3a2a8a',5,false,'center')}
    m.foot='Почерк Полины'}};
A.birds={title:'Кеша и Гоша',holdK:.6,draw(m){const k=clamp(m.k,0,1);R(PX,PY+12,PW,PH-12,'#2a3a2a');
    u.strokeStyle='#c8c8d0';for(let x=HX-60;x<=HX+60;x+=8){u.beginPath();u.moveTo(x,PY+24);u.lineTo(x,PY+118);u.stroke()}R(HX-62,PY+116,124,4,'#c8c8d0');
    R(HX-30,PY+108,30,6,'#e8c040');R(HX-28,PY+110-k*3,26,3*k,'#a87a3a');R(HX+10,PY+108,20,6,'#3a8ae8');
    const b=(x,c,ph)=>{const y=PY+80+Math.max(0,Math.sin(tm*8+ph))*k*10;R(x-6,y,12,14,c);R(x-4,y-6,9,8,c);R(x+3,y-4,3,2,'#e8b040');R(x-1,y-4,2,2,'#141418');R(x-5,y+12,4,8,shade(c,.7))};
    b(HX-34,'#5ad85a',0);b(HX-10,'#e8e05a',1.6);
    u.save();u.translate(HX+40,PY+40);u.rotate(m.hold?-1:-.3);R(-8,-12,16,22,'#e8d8a8');T('ЗЕРНО',0,2,'#5a3a1a',3.6,true,'center');u.restore();
    if(m.hold)for(let i=0;i<4;i++)R(HX+30-i*10+rnd(-2,2),PY+50+((tm*70+i*12)%56),2,2,'#d8b860');
    if(k>.7)T('АЛКОПАТИМЕН!',HX-30,PY+40,'#5ad85a',5.4,true,'center');m.foot=HOLD()}};
A.rummage={title:'Обыскиваю',dur:1.1,anim:1,draw(m){const t=m.t;R(PX,PY+12,PW,PH-12,'#2a2028');R(PX,PY+112,PW,20,'#3a2c26');shadow(HX,PY+112,44);
    R(HX-40,PY+60,80,50,'#7a5a3a');for(let i=0;i<3;i++)fr(HX-38,PY+74+i*12,76,.6,'#5a3e24');R(HX-40,PY+56,80,6,'#9a7a5a');R(HX-6,PY+78,12,5,'#c8a040');
    const K=['parts','ammo','syr','elec','band'];for(let i=0;i<5;i++){const a=t*10+i,x=HX-28+i*14+Math.sin(a)*3,y=PY+42-Math.abs(Math.sin(a))*14;IC(K[i],x,y,9)}
    hand(HX-10+Math.sin(t*14)*10,PY+70,-.8,false);m.foot=''}};
A.perfume={title:'Tom Ford',taps:1,draw(m){R(PX,PY+12,PW,PH-12,'#2a1a10');R(PX,PY+96,PW,36,'#4a2e1c');
    // мраморная полка и флакон
    R(HX-60,PY+94,120,6,'#d8d0c8');for(let i=0;i<8;i++)fr(HX-56+i*15,PY+95+(i%2),6,.5,'#a8a0a0');shadow(HX,PY+94,18);
    R(HX-15,PY+50,30,44,'#5a3418');fr(HX-13,PY+52,26,40,'rgba(255,180,80,.18)');fr(HX-12,PY+52,3,38,'rgba(255,255,255,.35)');fr(HX+9,PY+52,2,38,'rgba(0,0,0,.3)');
    R(HX-15,PY+66,30,16,'#f0e8d8');T('TOM FORD',HX,PY+72,'#141418',3.4,true,'center');T('OUD WOOD',HX,PY+78,'#8a6a2a',2.8,true,'center');
    R(HX-4,PY+44,8,6,'#c8a020');R(HX-11,PY+30,22,15,'#e8c040');fr(HX-10,PY+31,6,13,'rgba(255,255,255,.3)');
    if(m.tapN)for(let i=0;i<24;i++)circ(HX+16+i*4+rnd(-2,2),PY+36+rnd(-6-i*.6,6+i*.6),1+rnd(0,1),'rgba(255,230,180,.45)');m.foot='Пшик! '+TAPS(1)}};

// ================= ГОЛОВОЛОМКИ (ключевые действия) =================
const P={};
// --- раскопки: диван (пролог) ---
P.dig={title:'Пошарить в диване',hint:'Ключ где-то на самом дне. Убирай всё по очереди.',init(m){
  const names=['подушка','пульт','чипсы','носок','мелочь','игрушка','резинка','фантик','подушка'],cols=['#7a7a8a','#2a2a30','#e8c040','#c8c8d0','#d8b860','#ff7ac8','#3ef0b0','#c84a4a','#8a8a9a'];
  m.items=[];const kx=HX+rnd(-40,40),ky=PY+rnd(64,92);m.key={x:kx,y:ky,got:0};
  for(let i=0;i<9;i++){const big=i===0||i===8,w=big?60:rnd(18,30),h=big?24:rnd(10,16);
    const near=i>=6;const x=near?kx+rnd(-10,10):HX+rnd(-70,70),y=near?ky+rnd(-6,6):PY+rnd(40,108);
    m.items.push({x:x-w/2,y:y-h/2,w,h,c:cols[i],n:names[i],fly:0})}},
  onDown(m,p){if(m.closing)return;for(let i=m.items.length-1;i>=0;i--){const it=m.items[i];if(it.fly)continue;if(inR(p,it.x,it.y,it.w,it.h)){it.fly=1;it.vx=(p.x<HX?-1:1)*rnd(150,250);it.vy=-rnd(60,140);snd('swing',1.8);return}}
    const k=m.key;if(Math.abs(p.x-k.x)<10&&Math.abs(p.y-k.y)<8&&!m.items.some(it=>!it.fly&&inR({x:k.x,y:k.y},it.x,it.y,it.w,it.h))){k.got=1;m.okText='КЛЮЧ!';finish(m,true)}},
  onKey(m,c){if(c==='act'){const top=[...m.items].reverse().find(it=>!it.fly);if(top)this.onDown(m,{x:top.x+top.w/2,y:top.y+top.h/2});else this.onDown(m,{x:m.key.x,y:m.key.y})}},
  solve(m){m.items.forEach(it=>it.fly=1)},
  tick(m,dt){for(const it of m.items)if(it.fly){it.x+=it.vx*dt;it.y+=it.vy*dt;it.vy+=400*dt}},
  draw(m){R(PX,PY+12,PW,PH-12,'#5a5a66');R(PX+8,PY+30,PW-16,90,'#3a3a44');for(let i=0;i<PW-16;i+=12)for(let j=0;j<90;j+=12)fr(PX+14+i,PY+36+j,.8,.8,'#2a2a32');R(PX+8,PY+24,PW-16,8,'#6a6a76');R(PX+2,PY+24,8,100,'#6a6a76');R(PX+PW-10,PY+24,8,100,'#6a6a76');
    const k=m.key;R(k.x-7,k.y-2,10,4,'#d8c040');circ(k.x+5,k.y,3.5,'#d8c040');circ(k.x+5,k.y,1.4,'#3a3a44');
    for(const it of m.items)digObj(it);
    m.foot=touch.on?'Касайся вещей, чтобы отбросить. Ключ — коснись его.':'Кликай по вещам (или E). Найди ключ.'}};

// вещи из дивана: каждая нарисована как предмет, хитбокс прежний
function digObj(it){const {x,y,w,h,c,n}=it;
  if(n==='подушка'){R(x,y,w,h,c);fr(x+2,y+h/2,w-4,.6,drk(c));for(let i=4;i<w-2;i+=5)fr(x+i,y+h/2-1,.6,2,lit(c));circ(x+w/2,y+h/2,1.6,drk(c))}
  else if(n==='пульт'){R(x,y+h*.2,w,h*.6,'#2a2a30');circ(x+4,y+h/2,1.6,'#c83a3a');for(let i=0;i<4;i++)fr(x+8+i*3.5,y+h/2-1,2,2,'#6a6a76');fr(x+w-4,y+h/2-1.5,2,3,'#3ef0b0')}
  else if(n==='чипсы'){R(x,y,w,h,'#e8c040');fr(x,y,w,1.5,'#c8202a');fr(x,y+h-1.5,w,1.5,'#c8202a');R(x+w/2-4,y+h/2-2.5,8,5,'#c8202a');T('Lays',x+w/2,y+h/2+1.4,'#ffe27a',3,true,'center')}
  else if(n==='носок'){R(x,y,w*.7,h*.55,'#d8d8e0');R(x+w*.45,y+h*.35,w*.55,h*.6,'#d8d8e0');fr(x,y,w*.7,2,'#c83a3a');fr(x+w-3,y+h*.35,3,h*.6,'#a8a8b8')}
  else if(n==='мелочь'){for(let i=0;i<5;i++)circ(x+4+i*(w-8)/4,y+h/2+((i%2)?2:-2),3,i%2?'#c8a040':'#c8c8d0')}
  else if(n==='игрушка'){R(x+w*.2,y+h*.3,w*.6,h*.7,'#ff7ac8');circ(x+w/2,y+h*.3,h*.35,'#ff7ac8');circ(x+w*.32,y+h*.05,2,'#ff7ac8');circ(x+w*.68,y+h*.05,2,'#ff7ac8');fr(x+w*.4,y+h*.25,1,1,'#141418');fr(x+w*.58,y+h*.25,1,1,'#141418')}
  else if(n==='резинка'){u.strokeStyle=OUT;u.lineWidth=3;u.beginPath();u.ellipse(x+w/2,y+h/2,w/2-2,h/2-2,0,0,TAU);u.stroke();u.strokeStyle=c;u.lineWidth=2;u.stroke()}
  else if(n==='фантик'){R(x+w*.25,y+h*.2,w*.5,h*.6,c);u.fillStyle=c;u.beginPath();u.moveTo(x+w*.25,y+h/2);u.lineTo(x,y);u.lineTo(x,y+h);u.fill();u.beginPath();u.moveTo(x+w*.75,y+h/2);u.lineTo(x+w,y);u.lineTo(x+w,y+h);u.fill();fr(x+w*.3,y+h*.3,w*.4,1,lit(c))}
  else R(x,y,w,h,c);
  if(w>16&&(n==='подушка'))T(n,x+w/2,y+h-2,'rgba(0,0,0,.45)',3.4,true,'center')}
// --- замок: штифты (склад, шкафчик тренера) ---
P.lock={title:'Замок',hint:'Жми, когда штифт в зелёной зоне.',init(m){m.n=m.n||4;m.set=0;m.ph=0;m.sp=m.sp||1.2;m.zone=[];for(let i=0;i<m.n;i++)m.zone.push(rnd(.25,.6));m.fail=0},
  onKey(m,c){if(c==='act')pin(m)},onDown(m){pin(m)},
  solve(m){m.set=m.n},
  tick(m,dt){m.ph+=dt*m.sp*(1+m.set*.08);if(m.fail>0)m.fail-=dt},
  draw(m){R(PX,PY+12,PW,PH-12,'#2a2a34');const x0=HX-m.n*14;R(x0-10,PY+40,m.n*28+20,70,'#8a7a5a');R(x0-6,PY+44,m.n*28+12,40,'#3a3226');
    for(let i=0;i<m.n;i++){const x=x0+i*28+4,z=m.zone[i],set=i<m.set,cur=i===m.set;R(x,PY+46,20,36,'#1a1610');
      R(x,PY+46+z*36,20,12,cur?'rgba(62,240,176,.45)':'rgba(62,240,176,.15)');
      const y=set?PY+46+z*36:cur?PY+46+(Math.sin(m.ph*Math.PI)*.5+.5)*30:PY+74;R(x+4,y,12,6,set?'#3ef0b0':'#c8c8d0');R(x+7,y+6,6,82-(y-PY),'#a8a8b0')}
    R(x0-10,PY+90,m.n*28+20,6,'#6a5a3a');circ(HX,PY+104,6,'#141418');R(HX-1,PY+104,2,8,'#141418');
    if(m.fail>0)T('Сорвалось!',HX,PY+32,'#ff5a5a',6,true,'center');else T((m.set)+' / '+m.n,HX,PY+32,'#c8c0e0',6,true,'center');
    m.foot=touch.on?'Касайся экрана, когда штифт в зелёной зоне':'E или клик, когда штифт в зелёной зоне'}};
function pin(m){if(m.closing)return;const z=m.zone[m.set],y=(Math.sin(m.ph*Math.PI)*.5+.5)*30/36;
  if(Math.abs(y-z-.083)<.2){m.set++;snd('click');if(m.set>=m.n){m.okText='ЩЁЛК!';finish(m,true)}}else{m.set=Math.max(0,m.set-1);m.fail=.6;snd('thump',1.5)}}
// --- щиток: автоматы связаны с соседями (офис 1) ---
P.breaker={title:'Щиток серверной',hint:'Щёлкаешь автомат — соседние тоже переключаются.',col:'#ffd23a',init(m){m.n=6;m.s=Array(6).fill(1);
  for(let k=0;k<5;k++)flipB(m,(Math.random()*6)|0,true);if(m.s.every(v=>v))flipB(m,2,true);m.lever=0;m.sel=0},
  onDown(m,p){if(m.closing)return;for(let i=0;i<m.n;i++){const x=HX-78+i*26;if(inR(p,x,PY+44,20,40)){flipB(m,i);return}}if(m.s.every(v=>v)&&inR(p,HX+82,PY+40,30,80))m.lever=1},
  onKey(m,c){if(c==='KeyA'||c==='ArrowLeft')m.sel=(m.sel+5)%6;else if(c==='KeyD'||c==='ArrowRight')m.sel=(m.sel+1)%6;else if(c==='act'){if(m.s.every(v=>v))m.lever=1;else flipB(m,m.sel)}},
  solve(m){m.s.fill(1)},
  tick(m,dt){if(m.lever>0&&!m.closing){m.lever+=dt*3;if(m.lever>=2){snd('power');m.okText='СВЕТ ЕСТЬ!';finish(m,true)}}},
  draw(m){R(PX,PY+12,PW,PH-12,'#3a3a42');R(HX-90,PY+30,170,100,'#6a6a72');R(HX-86,PY+34,162,92,'#2a2a30');
    for(let i=0;i<m.n;i++){const x=HX-78+i*26,on=m.s[i];R(x,PY+44,20,40,'#e8e8e0');R(x+5,on?PY+48:PY+64,10,16,on?'#3ac84a':'#c83a3a');circ(x+10,PY+96,3,on?'#3ef0b0':'#4a2020');
      if(!touch.on&&i===m.sel)u.strokeRect(x-1.5,PY+42.5,23,43);T(['A','B','C','D','E','F'][i],x+10,PY+108,'#c8c8d0',5,true,'center')}
    const all=m.s.every(v=>v);R(HX+86,PY+40,20,80,all?'#4a4a52':'#2a2a30');const ly=PY+48+clamp(m.lever-1,0,1)*50;R(HX+82,ly,28,8,all?'#c8202a':'#5a2a2a');
    T(all?'РУБИЛЬНИК ↓':'',HX+96,PY+36,'#ffd23a',4.4,true,'center');
    m.foot=all?(touch.on?'Все горят! Дёрни рубильник':'Все горят! E или клик по рубильнику'):(touch.on?'Включи все автоматы':'Клик по автомату (или A/D и E). Включи все')}};
function flipB(m,i,q){for(const j of [i-1,i,i+1])if(j>=0&&j<m.n)m.s[j]^=1;if(!q)snd('click')}
// --- кодовый замок с трофеями (тайник Аниса) ---
P.code={title:'Сейф Аниса',hint:'Лось, кабан, заяц, утка: от самого крупного.',col:'#e8c040',init(m){m.code='4926';m.in='';m.err=0},
  onDown(m,p){if(m.closing)return;const k=keyAt(p);if(k!=null)press(m,k)},
  onKey(m,c){const d=/^(Digit|Numpad)(\d)$/.exec(c);if(d)press(m,d[2]);else if(c==='Backspace')m.in=m.in.slice(0,-1)},
  solve(m){m.in=m.code},tick(m,dt){if(m.err>0)m.err-=dt},
  draw(m){R(PX,PY+12,PW,PH-12,'#2a2420');
    const tr=[['ЛОСЬ','4',22],['КАБАН','9',17],['ЗАЯЦ','2',11],['УТКА','6',9]];
    [2,0,3,1].forEach((j,i)=>{const t=tr[j],x=PX+12+i*28,y=PY+22;R(x,y,24,30,'#6a4a2a');R(x+2,y+2,20,20,'#2a1c12');trophy(t[0],x+12,y+13);T(t[0],x+12,y+28,'#f4eed8',3.4,true,'center');R(x+16,y+1,8,7,'#f4eed8');T(t[1],x+20,y+6.6,'#c8202a',4.6,true,'center')});
    T('«Пароль — от самого',PX+62,PY+64,'#e8d8a8',4.4,false,'center');T('крупного трофея к мелкому»',PX+62,PY+71,'#e8d8a8',4.4,false,'center');T('— Анис',PX+90,PY+80,'#e8d8a8',4.4,false,'center');
    const bx=PX+140;R(bx,PY+18,88,110,'#4a4a52');R(bx+6,PY+22,76,14,m.err>0?'#5a1a1a':'#0a1a10');T(m.in.padEnd(4,'_').split('').join(' '),bx+44,PY+32,m.err>0?'#ff5a5a':'#3ef0b0',8,true,'center');
    KP.forEach((k,i)=>{const x=bx+8+(i%3)*25,y=PY+40+Math.floor(i/3)*21;R(x,y,22,18,'#2a2a30');T(k,x+11,y+12.5,'#e8e8f0',7,true,'center')});
    m.foot=touch.on?'Набери код на панели':'Набери код: цифры или клик'}};

// трофеи Аниса: головы на щитах
function trophy(n,x,y){
  if(n==='ЛОСЬ'){R(x-3,y-3,6,9,'#6a4a2a');R(x-2,y+5,4,3,'#4a3020');fr(x-2,y-1,1,1,'#141418');fr(x+1,y-1,1,1,'#141418');
    for(const sg of[-1,1]){R(x+sg*4-(sg<0?5:0),y-7,5,2.5,'#d8c8a0');R(x+sg*8-(sg<0?1.5:0),y-9,1.5,3,'#d8c8a0');R(x+sg*5.5-(sg<0?1.5:0),y-9,1.5,2.5,'#d8c8a0')}}
  else if(n==='КАБАН'){R(x-4,y-3,8,8,'#4a3a2a');R(x-2.5,y+3,5,4,'#7a5a4a');fr(x-1.5,y+5,1,1,'#2a1a10');fr(x+.5,y+5,1,1,'#2a1a10');fr(x-3,y+5,1,2.5,'#f0e8d8');fr(x+2,y+5,1,2.5,'#f0e8d8');fr(x-2,y-1,1,1,'#ff3a3a');fr(x+1,y-1,1,1,'#ff3a3a');R(x-5,y-5,2.5,3,'#4a3a2a');R(x+2.5,y-5,2.5,3,'#4a3a2a')}
  else if(n==='ЗАЯЦ'){R(x-3,y-2,6,7,'#a8a098');R(x-3,y-9,2,7,'#a8a098');R(x+1,y-9,2,7,'#a8a098');fr(x-2.5,y-8,1,5,'#e8b0b0');fr(x+1.5,y-8,1,5,'#e8b0b0');fr(x-2,y,1,1,'#141418');fr(x+1,y,1,1,'#141418');fr(x-.5,y+2.5,1,1,'#e87a8a')}
  else{R(x-3,y-4,6,6,'#2a6a3a');R(x-3,y+2,6,3,'#f0f0f0');R(x+3,y-2,4,2.5,'#e8b030');fr(x,y-2,1,1,'#141418');R(x-4,y+4,8,4,'#8a6a4a')}}
const KP=['1','2','3','4','5','6','7','8','9','⌫','0','✓'];
function keyAt(p){const bx=PX+140;for(let i=0;i<12;i++){const x=bx+8+(i%3)*25,y=PY+40+Math.floor(i/3)*21;if(inR(p,x,y,22,18))return KP[i]}return null}
function press(m,k){if(m.closing)return;snd('click');if(k==='⌫'){m.in=m.in.slice(0,-1);return}if(k==='✓'){chkCode(m);return}if(m.in.length<4)m.in+=k;if(m.in.length===4)chkCode(m)}
function chkCode(m){if(m.in===m.code){m.okText='ОТКРЫТО!';finish(m,true)}else{m.err=.8;m.in='';snd('thump',1.5)}}
// --- частота: радио в машине, антенна на крыше ---
P.freq={title:'Настройка частоты',hint:'Чем ближе к волне, тем меньше шума.',col:'#3ef0b0',init(m){m.f=rnd(.05,.25);m.tg=rnd(.55,.9);m.lock=0;m.drift=m.drift||0},
  onDown(m,p){m.drag=p.x},onMove(m,p){if(m.down&&m.drag!=null){m.f=clamp(m.f+(p.x-m.drag)/180,0,1);m.drag=p.x}},onUp(m){m.drag=null},
  onKey(m,c){if(c==='KeyA'||c==='ArrowLeft')m.kd=-1;else if(c==='KeyD'||c==='ArrowRight')m.kd=1},onKeyUp2(m,c){if(['KeyA','ArrowLeft','KeyD','ArrowRight'].includes(c))m.kd=0},
  solve(m){m.f=m.tg},
  tick(m,dt){if(m.kd)m.f=clamp(m.f+m.kd*dt*.35,0,1);if(m.drift)m.tg=clamp(m.tg+Math.sin(m.t*.9)*dt*m.drift,.1,.95);
    const d=Math.abs(m.f-m.tg);if(d<.03){m.lock+=dt;if(m.lock>=1.3&&!m.closing){m.okText='ЕСТЬ СИГНАЛ!';finish(m,true)}}else m.lock=Math.max(0,m.lock-dt*2)},
  draw(m){R(PX,PY+12,PW,PH-12,'#101820');const d=Math.abs(m.f-m.tg),noise=clamp(d*4,0,1);R(PX+8,PY+16,PW-16,PH-20,'#2a2a30');for(let i=0;i<14;i++)for(let j=0;j<3;j++)circ(PX+PW-46+(i%7)*5,PY+PH-36+j*5+Math.floor(i/7)*15,1,'#141418');R(PX+12,PY+20,PW-24,56,'#1a2a20');circ(PX+30,PY+PH-22,6,'#4a4a52');circ(PX+48,PY+PH-22,6,'#4a4a52');
    R(PX+14,PY+22,PW-28,50,'#06100a');u.strokeStyle='#3ef0b0';u.lineWidth=1;u.beginPath();
    for(let x=0;x<PW-28;x++){const y=PY+47+Math.sin(x*.18+m.t*8)*12*(1-noise)+rnd(-16,16)*noise;x?u.lineTo(PX+14+x,y):u.moveTo(PX+14,y)}u.stroke();
    R(PX+20,PY+86,PW-40,8,'#2a3a30');for(let i=0;i<=20;i++)R(PX+20+i*(PW-40)/20,PY+84,1,i%5?3:6,'#5a7a6a');
    R(PX+20+m.f*(PW-40)-1,PY+80,3,18,'#ff4fa3');
    R(PX+20,PY+104,(PW-40)*clamp(m.lock/1.3,0,1),4,'#3ef0b0');T(m.label||'FM',PX+20,PY+118,'#9ab8a8',4.6,true);T((87.5+m.f*20.5).toFixed(1)+' МГц',PX+PW-20,PY+118,'#3ef0b0',5,true,'right');
    m.foot=touch.on?'Веди пальцем влево-вправо, поймай чистую волну':'Тяни мышью или A/D. Поймай чистую волну и держи'}};
// --- провода: маршрутизатор на крыше ---
P.wires={title:'Маршрутизатор на крыше',hint:'Веди провод в обход искрящего пятна.',col:'#ff7ac8',init(m){
  const C=['#ff3a5a','#3a8ae8','#ffd23a','#3ec84a','#c84aff'];m.L=C.map((c,i)=>({c,x:PX+22,y:PY+30+i*21}));
  const ord=[0,1,2,3,4].sort(()=>Math.random()-.5);m.Rp=ord.map((ci,i)=>({c:C[ci],x:PX+PW-22,y:PY+30+i*21}));
  m.ok=[];m.cur=null;m.burn=[{x:HX+rnd(-20,20),y:PY+52,r:13},{x:HX+rnd(-30,30),y:PY+100,r:11}];m.zap=0},
  onDown(m,p){if(m.closing)return;const near=(arr)=>arr.filter(s=>!m.ok.includes(s.c)).map(s=>[s,Math.hypot(p.x-s.x,p.y-s.y)]).filter(a=>a[1]<14).sort((a,b)=>a[1]-b[1])[0];
    const a=near(m.L),b=near(m.Rp);const h=a&&(!b||a[1]<=b[1])?[a[0],'L']:b?[b[0],'R']:null;if(h){m.cur={s:h[0],side:h[1],pts:[{x:h[0].x,y:h[0].y}]};snd('click')}},
  onMove(m,p){const c=m.cur;if(!c||!m.down)return;const l=c.pts[c.pts.length-1];if(Math.hypot(p.x-l.x,p.y-l.y)>2)c.pts.push({x:p.x,y:p.y});
    if(m.burn.some(b=>Math.hypot(p.x-b.x,p.y-b.y)<b.r)){m.cur=null;m.zap=.5;snd('thump',1.6);if(window.C1)C1.shake=.3}},
  onUp(m,p){const c=m.cur;if(!c)return;const t=(c.side==='R'?m.L:m.Rp).filter(r=>r.c===c.s.c).find(r=>Math.hypot(p.x-r.x,p.y-r.y)<15);
    if(t&&t.c===c.s.c){c.pts.push({x:t.x,y:t.y});m.ok.push(c.s.c);(m.done=m.done||[]).push(c);snd('pick');if(m.ok.length===5){m.okText='ПОДКЛЮЧЕНО!';finish(m,true)}}m.cur=null},
  solve(m){m.ok=m.L.map(s=>s.c)},
  tick(m,dt){if(m.zap>0)m.zap-=dt},
  draw(m){R(PX,PY+12,PW,PH-12,'#1a2a20');for(let i=0;i<40;i++)R(PX+10+(i*53)%(PW-20),PY+20+(i*31)%(PH-30),3,1,'#2a4a30');
    for(const b of m.burn){circ(b.x,b.y,b.r,'#0a0a08');for(let i=0;i<5;i++)if(Math.random()<.5)R(b.x+rnd(-b.r,b.r),b.y+rnd(-b.r,b.r),1.5,1.5,'#ffe27a')}
    for(const c of (m.done||[]).concat(m.cur?[m.cur]:[])){u.strokeStyle=c.s.c;u.lineWidth=2.4;u.beginPath();c.pts.forEach((q,i)=>i?u.lineTo(q.x,q.y):u.moveTo(q.x,q.y));u.stroke()}
    for(const s of m.L){R(s.x-8,s.y-4,10,8,'#2a2a30');circ(s.x,s.y,3.6,s.c);if(m.ok.includes(s.c))circ(s.x,s.y,1.4,'#fff')}
    for(const r of m.Rp){R(r.x-2,r.y-4,10,8,'#2a2a30');circ(r.x,r.y,3.6,r.c);u.strokeStyle='#c8c8d0';u.beginPath();u.moveTo(r.x+8,r.y);u.lineTo(r.x+14,r.y-8);u.stroke()}
    T('ПЛАТА',PX+22,PY+22,'#9ab8a8',4.4,true,'center');T('АНТЕННЫ',PX+PW-22,PY+22,'#9ab8a8',4.4,true,'center');
    if(m.zap>0){u.fillStyle=`rgba(255,240,120,${m.zap})`;u.fillRect(PX,PY+12,PW,PH-12);T('БЗЗТ!',HX,HY,'#141418',10,true,'center')}
    m.foot=(touch.on?'Веди пальцем':'Зажми мышь и веди')+' провод от гнезда к антенне того же цвета (можно и обратно). В искры не лезь!'}};
// --- трубы: катакомбы (глава 3) ---
P.pipes={title:'Прорвало трубу',hint:'Вода должна дойти от трубы слева до стока справа.',col:'#5aa0e8',init(m){
  // 5×3 сетка; биты: 1 верх,2 право,4 низ,8 лево
  m.cw=5;m.ch=3;const path=[[0,1],[1,1],[1,0],[2,0],[3,0],[3,1],[3,2],[4,2]];m.g=[];
  for(let y=0;y<3;y++)for(let x=0;x<5;x++)m.g.push({b:[3,6,12,9,5,10][(Math.random()*6)|0]});
  const dir=(a,b)=>b[0]>a[0]?2:b[0]<a[0]?8:b[1]>a[1]?4:1,opp=d=>({1:4,4:1,2:8,8:2})[d];
  for(let i=0;i<path.length;i++){const [x,y]=path[i];let b=0;b|=i?opp(dir(path[i-1],path[i])):8;b|=i<path.length-1?dir(path[i],path[i+1]):2;m.g[y*5+x].b=b}
  for(const c of m.g){const r=1+((Math.random()*3)|0);for(let k=0;k<r;k++)c.b=rot(c.b)}if(flow(m))m.g[5].b=rot(m.g[5].b);m.sel=0},
  onDown(m,p){if(m.closing)return;const x=Math.floor((p.x-(HX-75))/30),y=Math.floor((p.y-(PY+34))/30);if(x>=0&&x<5&&y>=0&&y<3){turn(m,y*5+x)}},
  onKey(m,c){if(c==='KeyA'||c==='ArrowLeft')m.sel=(m.sel+14)%15;else if(c==='KeyD'||c==='ArrowRight')m.sel=(m.sel+1)%15;else if(c==='KeyW'||c==='ArrowUp')m.sel=(m.sel+10)%15;else if(c==='KeyS'||c==='ArrowDown')m.sel=(m.sel+5)%15;else if(c==='act')turn(m,m.sel)},
  solve(m){m.forceWin=1},
  draw(m){R(PX,PY+12,PW,PH-12,'#1a1a1e');const wet=flow(m);
    R(HX-90,PY+34+30+10,15,10,'#5a5a62');R(HX+75,PY+34+60+10,15,10,'#5a5a62');circ(HX-92,PY+34+45,6,'#3a7ac8');
    for(let i=0;i<15;i++){const x=HX-75+(i%5)*30,y=PY+34+Math.floor(i/5)*30,c=m.g[i],w=wet.has(i);R(x+1,y+1,28,28,'#2a2a30');
      pipeTile(x,y,c.b,w);
      if(!touch.on&&i===m.sel){u.strokeStyle='#ffd23a';u.strokeRect(x+.5,y+.5,29,29)}}
    T('ВОДА',HX-92,PY+30,'#5aa0e8',4.4,true,'center');T('СТОК',HX+84,PY+118,'#5aa0e8',4.4,true,'center');
    m.foot=touch.on?'Касайся труб, чтобы повернуть':'Клик по трубе (или WASD и E) — повернуть'}};

function pipeTile(x,y,b,wet){fr(x+2,y+2,26,26,'#1e1e24');for(let i=0;i<3;i++)fr(x+4+i*9,y+4+((i*7)%18),1,1,'#2e2e36');
  const col='#8a8f9a',W8=8;
  const seg=(sx,sy,sw,sh)=>{fr(sx-.5,sy-.5,sw+1,sh+1,OUT);fr(sx,sy,sw,sh,col);
    if(sw>sh){fr(sx,sy,sw,1.5,lit(col));fr(sx,sy+sh-1.5,sw,1.5,drk(col))}else{fr(sx,sy,1.5,sh,lit(col));fr(sx+sw-1.5,sy,1.5,sh,drk(col))}};
  if(b&1)seg(x+11,y,W8,15);if(b&4)seg(x+11,y+15,W8,15);if(b&2)seg(x+15,y+11,15,W8);if(b&8)seg(x,y+11,15,W8);
  fr(x+9.5,y+9.5,11,11,OUT);fr(x+10,y+10,10,10,'#7a7f8a');fr(x+10,y+10,10,1.5,'#b8bcc6');circ(x+12,y+12,.7,'#c8ccd6');circ(x+18,y+18,.7,'#4a4e58');
  // фланцы на краях
  if(b&1)fr(x+10,y,10,1.5,'#5a5e68');if(b&4)fr(x+10,y+28.5,10,1.5,'#5a5e68');if(b&2)fr(x+28.5,y+10,1.5,10,'#5a5e68');if(b&8)fr(x,y+10,1.5,10,'#5a5e68');
  if(wet){u.fillStyle='rgba(90,170,255,.85)';if(b&1)u.fillRect(x+13,y,4,15);if(b&4)u.fillRect(x+13,y+15,4,15);if(b&2)u.fillRect(x+15,y+13,15,4);if(b&8)u.fillRect(x,y+13,15,4);u.fillRect(x+12,y+12,6,6);
    u.fillStyle='rgba(220,240,255,.8)';const o=(tm*30)%10;if(b&2)u.fillRect(x+15+o,y+14,2,.6);if(b&8)u.fillRect(x+o,y+14,2,.6);if(b&1)u.fillRect(x+14,y+o,.6,2);if(b&4)u.fillRect(x+14,y+15+o,.6,2)}}
const rot=b=>((b<<1)&15)|(b>>3);
function turn(m,i){m.g[i].b=rot(m.g[i].b);snd('click');if(flow(m).has(14)&&(m.g[14].b&2)){m.okText='ВОДА УШЛА!';finish(m,true)}}
function flow(m){const s=new Set();if(m.forceWin){for(let i=0;i<15;i++)s.add(i);return s}if(!(m.g[5].b&8))return s;const q=[5];s.add(5);
  while(q.length){const i=q.shift(),x=i%5,y=(i/5)|0,b=m.g[i].b;for(const [d,dx,dy,o] of [[1,0,-1,4],[2,1,0,8],[4,0,1,1],[8,-1,0,2]]){if(!(b&d))continue;const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>4||ny>2)continue;const j=ny*5+nx;if(!s.has(j)&&(m.g[j].b&o)){s.add(j);q.push(j)}}}return s}
// --- ритм: выключить пульт в клубе (глава 4) ---
P.rhythm={title:'Пульт гориллы',hint:'Жми, когда нота на белой линии.',col:'#3ef0b0',init(m){m.notes=[];m.hit=0;m.need=8;m.nt=.5;m.fb=0;m.fbT=0},
  onKey(m,c){if(c==='act')hitN(m)},onDown(m){hitN(m)},solve(m){m.hit=m.need},
  tick(m,dt){m.nt-=dt;if(m.nt<=0){m.nt=60/128*(Math.random()<.3?.5:1);m.notes.push({y:PY+18})}for(const n of m.notes)n.y+=70*dt;
    m.notes=m.notes.filter(n=>{if(n.y>PY+118&&!n.h){m.fb=-1;m.fbT=.4;return false}return n.y<PY+130&&!n.h});if(m.fbT>0)m.fbT-=dt},
  draw(m){R(PX,PY+12,PW,PH-12,'#0e0a18');const vol=1-m.hit/m.need;for(let i=0;i<6;i++){const a=tm*1.2+i;u.fillStyle=['rgba(255,79,216,.08)','rgba(62,240,176,.08)'][i%2];u.beginPath();u.moveTo(HX,PY+12);u.lineTo(HX+Math.cos(a)*200,PY+PH);u.lineTo(HX+Math.cos(a+.2)*200,PY+PH);u.fill()}R(PX+8,PY+122,PW-16,10,'#2a2436');for(let i=0;i<3;i++)circ(PX+PW/2-60+i*60,PY+127,3,['#ff4fd8','#3ef0b0','#ffd23a'][i]);
    for(let i=0;i<8;i++){const h=(20+Math.abs(Math.sin(tm*8+i))*40)*vol;R(PX+16+i*8,PY+120-h,6,h,['#ff4fd8','#3ef0b0','#ffd23a'][i%3])}
    R(HX-14,PY+16,28,110,'#1a1428');R(HX-16,PY+104,32,2,'#ffffff');for(const n of m.notes)R(HX-10,n.y-3,20,6,'#ff4fd8');
    R(PX+PW-70,PY+30,50,80,'#1a1a22');T('ГРОМКОСТЬ',PX+PW-45,PY+26,'#9a92b0',4,true,'center');R(PX+PW-48,PY+36,6,68,'#2a2a30');R(PX+PW-52,PY+36+68*(1-vol)-2,14,5,'#c8c8d0');
    if(m.fbT>0)T(m.fb>0?'В ТАКТ!':'мимо',HX,PY+96,m.fb>0?'#3ef0b0':'#ff5a5a',5,true,'center');
    T(m.hit+' / '+m.need,HX,PY+134,'#c8c0e0',5,true,'center');m.foot=''}};
function hitN(m){if(m.closing)return;const n=m.notes.find(n=>Math.abs(n.y-(PY+105))<9);if(n){n.h=1;m.hit++;m.fb=1;m.fbT=.3;snd('click');if(m.hit>=m.need){m.okText='ТИШИНА...';finish(m,true)}}else{m.fb=-1;m.fbT=.3;m.hit=Math.max(0,m.hit-1)}}

// ================= ПРАВИЛА: какая подсказка → что открыть =================
// k: ключ анимации/головоломки; o: параметры; once: только один раз за уровень
const RULES=[
  [/^Открыть шкафчик, взять стакан/,'A','cupboard'],
  [/^Налить воды из бутылки/,'A','pour'],
  [/^Открыть окно$/,'A','window'],
  [/^Убрать за Черсиком/,'A','litter'],
  [/^Открыть ящик под раковиной/,'A','drawer'],
  [/^Насыпать корм/,'A','feed'],
  [/^Сесть работать/,'A','pc'],
  [/^Пошарить в диване/,'P','dig'],
  [/^Открыть склад ключом/,'P','lock',{title:'Замок склада (заржавел)',n:4,sp:1.1}],
  [/^Порыться$/,'A','rummage'],
  [/^Включить рубильник/,'P','breaker'],
  [/^Разбить пожарный щит/,'A','glass'],
  [/^Ящик сисадминов/,'A','box'],
  [/^Открыть дверь ключ-картой/,'A','card'],
  [/^Забрать припасы в рюкзак/,'A','backpack'],
  [/^Открыть тайник в гардеробе/,'P','code'],
  [/^Обыскать: /,'A','rummage'],
  [/^Сесть в красный Land Rover/,'P','freq',{title:'Рация в Land Rover',label:'Канал Ханжи'},1],
  [/^Шкафчик тренера/,'P','lock',{title:'Шкафчик тренера №17',n:4,sp:1.4},0,()=>!(C1.engine.L&&C1.engine.L.zs.length)],
  [/^Взять: /,'A','rummage'],
  [/^Взять духи Tom Ford/,'A','perfume'],
  [/^Пролом в катакомбы/,'P','pipes',null,1,()=>!(window.C1&&C1.engine.L&&C1.engine.L.zs.length)],
  [/^Записка на комоде/,'A','note',null,1],
  [/^Покормить птиц/,'A','birds'],
  [/^Открытое окно/,'A','window',{title:'Открытое окно'},1,()=>!(C1.engine.L&&C1.engine.L.zs.length)],
  [/^Починить маршрутизатор/,'P','wires',null,0],
  [/^Выключить пульт/,'P','rhythm'],
];
MG.RULES=RULES;MG.A=A;MG.P=P;
MG.play=function(kind,key,opts,cb){const base=(kind==='A'?A:P)[key];if(!base){cb&&cb();return}MG.open(Object.assign({},base,opts||{}),cb)};
MG.intercept=function(near){
  if(MG.active)return true;
  const curL=(window.C1&&C1.on&&C1.engine)?C1.engine.L:null;if(curL!==MG.lastL){MG.lastL=curL;MG.seen={}}
  let lbl='';try{lbl=typeof near.label==='function'?near.label():near.label}catch(e){}
  for(const [re,kind,key,opts,once,when] of RULES){if(!re.test(lbl))continue;
    if(when&&!when())return false;
    const id=lbl+'|'+key;if(once&&MG.seen[id])return false;
    MG.play(kind,key,opts,()=>{MG.seen[id]=1;near.act()});return true}
  return false;
};
})();
