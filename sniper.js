// =====================================================================
//  Снайперская мини-миссия от первого лица (глава 4, задание Ханжи).
//  Микроб с AWP на крыше прикрывает двор: зомби бегут к подъезду с разных сторон.
//  Наружу: window.SNP.play(opts, onDone(res)). Подключается после upgrade.js.
// =====================================================================
(function(){
'use strict';
const SNP={on:false};window.SNP=SNP;SNP.G=()=>G;
const TAU=Math.PI*2,rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>v<a?a:v>b?b:v;
const sfx=(n,r)=>{try{C1.X.sfx(n,r)}catch(e){}};
let G=null; // состояние миссии
const SCN=document.createElement('canvas');SCN.width=640;SCN.height=360;const sg=SCN.getContext('2d');sg.imageSmoothingEnabled=false;
const BG=document.createElement('canvas');BG.width=640;BG.height=360;
const zY=z=>72+z*z*96, zS=z=>.22+.98*z, zX=(wx,z)=>160+wx*(.3+.7*z);
function hash(a,b){const s=Math.sin(a*127.1+b*311.7)*43758.5453;return s-Math.floor(s)}
function drawBG(){const g=BG.getContext('2d');g.setTransform(2,0,0,2,0,0);const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
  // небо
  for(let y=0;y<72;y+=2)R(0,y,320,2,`rgb(${20+y*.5|0},${10+y*.2|0},${34+y*.4|0})`);
  for(let i=0;i<40;i++)R(hash(i,1)*320,hash(i,2)*40,1,1,'rgba(255,255,255,.6)');
  // дальние дома
  for(let i=0;i<9;i++){const x=i*38-10,h=30+hash(i,3)*26,y=72-h;R(x,y,36,h,'#1c1826');for(let wy=y+4;wy<70;wy+=6)for(let wx=x+3;wx<x+33;wx+=6)if(hash(wx,wy)>.55)R(wx,wy,3,3,hash(wy,wx)>.7?'#ffd27a':'#6a5a7a')}
  // арка-ворота двора по центру
  R(144,50,32,22,'#120e18');R(146,52,28,20,'#05040a');
  // земля: асфальт двора
  for(let y=72;y<180;y+=2){const k=(y-72)/108;R(0,y,320,2,`rgb(${40+k*30|0},${38+k*26|0},${46+k*28|0})`)}
  // площадка, гаражи, машины, лавочки
  g.fillStyle='rgba(120,60,40,.35)';g.beginPath();g.ellipse(230,112,46,10,0,0,TAU);g.fill();
  R(40,80,60,10,'#3a3440');for(let i=0;i<5;i++)R(42+i*12,82,10,8,'#4a4452');
  R(214,104,6,8,'#c84a3a');R(244,104,6,8,'#3a8ac8');R(222,100,24,2,'#8a8a92');
  for(const [x,y,w,c] of [[60,128,34,'#5a2a2a'],[250,140,40,'#2a3a5a'],[150,96,22,'#4a4a3a']]){R(x,y,w,w*.45,c);R(x+3,y+2,w-6,w*.2,'rgba(160,200,230,.35)')}
  for(let i=0;i<10;i++){const x=hash(i,7)*320,y=80+hash(i,8)*90;R(x,y,3,1,'#5a5a64')}
  // фонари
  for(const [x,y] of [[30,90],[290,96],[110,150]]){R(x,y-26,1.5,26,'#2a2a30');g.fillStyle='rgba(255,210,120,.12)';g.beginPath();g.arc(x,y-26,20,0,TAU);g.fill();R(x-2,y-28,5,2,'#ffe8a0')}
}
function drawZ(g,z){const s=zS(z.z),x=zX(z.wx,z.z),y=zY(z.z),h=30*s,w=10*s,R=(a,b,c,d,col)=>{g.fillStyle=col;g.fillRect(a,b,c,d)};
  const ph=Math.sin(z.t*z.sp*.9+z.seed)*(z.run?1:.6);
  R(x-w*.36,y-h*.42,w*.28,h*.42+ph*s*1.5,'#1e1e26');R(x+w*.08,y-h*.42,w*.28,h*.42-ph*s*1.5,'#1e1e26'); // ноги
  R(x-w*.5,y-h*.82,w,h*.44,z.col);R(x-w*.5,y-h*.82,w,h*.06,'rgba(255,255,255,.12)'); // тело
  R(x-w*.72,y-h*.8+ph*s,w*.22,h*.36,'#7fa070');R(x+w*.5,y-h*.8-ph*s,w*.22,h*.36,'#7fa070'); // руки
  R(x-w*.32,y-h,w*.64,h*.2,'#8aa878');R(x-w*.32,y-h,w*.64,h*.06,z.hair); // голова
  R(x-w*.2,y-h*.92,w*.12,h*.03+.3,'#ff2a2a');R(x+w*.08,y-h*.92,w*.12,h*.03+.3,'#ff2a2a');
  if(z.big){R(x-w*.6,y-h*.7,w*1.2,h*.12,z.col)}
}
function scene(){sg.setTransform(1,0,0,1,0,0);sg.drawImage(BG,0,0);sg.setTransform(2,0,0,2,0,0);
  const zs=G.zs.filter(z=>!z.dead).sort((a,b)=>a.z-b.z);for(const z of zs)drawZ(sg,z);
  for(const c of G.corpses){const s=zS(c.z),x=zX(c.wx,c.z),y=zY(c.z);sg.fillStyle='rgba(120,10,20,.7)';sg.fillRect(x-6*s,y-2*s,12*s,3*s);sg.fillStyle=c.col;sg.fillRect(x-5*s,y-3*s,10*s,2.4*s)}
  for(const f of G.fx){sg.fillStyle=f.c;sg.fillRect(f.x,f.y,f.s,f.s)}
  // парапет нашей крыши
  sg.fillStyle='#4a3a3e';sg.fillRect(0,164,320,16);sg.fillStyle='#6a5a5e';sg.fillRect(0,164,320,2);for(let x=0;x<320;x+=14)sg.fillRect(x,166,1,14);
  sg.fillStyle='#ffd23a';sg.font='bold 5px monospace';sg.textAlign='center';sg.fillText('▼ ПОДЪЕЗД ▼',160,174);sg.textAlign='left';
}
SNP.play=function(o,done){
  o=o||{};drawBG();
  G={t:0,ax:160,ay:110,sx:0,sy:0,mag:5,cd:0,rl:0,kills:0,head:0,shots:0,leak:0,need:o.need||14,total:o.total||18,maxLeak:o.leak||4,spawned:0,next:1.5,zs:[],corpses:[],fx:[],over:null,done,flash:0,drag:null,intro:3};
  SNP.on=true;C1.mdown=false;try{for(const k in keys)keys[k]=false}catch(e){}
};
function spawn(){if(G.spawned>=G.total)return;G.spawned++;const side=(Math.random()*4)|0;let wx,z;
  if(side===0){wx=-330;z=rnd(.25,.6)}else if(side===1){wx=330;z=rnd(.25,.6)}else if(side===2){wx=rnd(-20,20);z=0}else{wx=-150;z=.12}
  const run=Math.random()<Math.min(.5,.1+G.spawned*.03),big=!run&&Math.random()<.15;
  G.zs.push({wx0:wx,z0:z,wx,z,tx:rnd(-30,30),p:0,dur:run?rnd(6,8):rnd(11,15),run,big,hp:big?2:1,t:0,sp:run?14:8,seed:Math.random()*9,
    col:['#5a6a8a','#8a5a4a','#6a6a5a','#4a4a52','#8a7a5a','#3a5a4a'][(Math.random()*6)|0],hair:['#3a2a20','#6a5a40','#2a2a2a','#c8b070'][(Math.random()*4)|0]})}
function shoot(){
  if(G.over||G.intro>0)return;if(G.rl>0||G.cd>0)return;if(G.mag<=0){startRl();return}
  G.mag--;G.shots++;G.cd=.85;G.flash=.12;sfx('slug',.9);try{C1.shake=.3}catch(e){}
  const ax=G.ax+G.sx,ay=G.ay+G.sy;let hit=null,best=-1;
  for(const z of G.zs){if(z.dead)continue;const s=zS(z.z),x=zX(z.wx,z.z),y=zY(z.z),h=30*s,w=10*s*(z.big?1.3:1);
    if(ax>x-w*.6&&ax<x+w*.6&&ay>y-h&&ay<y&&z.z>best){best=z.z;hit={z,head:ay<y-h*.78,x,y,h}}}
  if(hit){const z=hit.z;z.hp-=hit.head?9:1;for(let i=0;i<10;i++)G.fx.push({x:ax+rnd(-2,2),y:ay+rnd(-2,2),vx:rnd(-20,20),vy:rnd(-30,5),s:rnd(.6,1.4),c:i%3?'#8a1018':'#c8202a',life:.6});
    if(z.hp<=0){z.dead=true;G.kills++;if(hit.head){G.head++;floatT('В ГОЛОВУ!',ax,ay-8,'#ffd23a')}G.corpses.push({wx:z.wx,z:z.z,col:z.col});sfx('thump',.8)}else floatT('ЕЩЁ ВЫСТРЕЛ!',ax,ay-8,'#ff7a7a')}
  else{for(let i=0;i<5;i++)G.fx.push({x:ax,y:ay,vx:rnd(-12,12),vy:rnd(-16,-2),s:.8,c:'#c8c0b0',life:.4})}
  if(G.mag<=0)setTimeout(()=>{if(G&&!G.over)startRl()},500);
}
function startRl(){if(G.rl>0||G.mag>=5)return;G.rl=2.2;sfx('reload')}
const FT=[];function floatT(t,x,y,c){FT.push({t,x,y,c,life:1})}
function tick(dt){
  if(!G)return;G.t+=dt;
  for(const f of FT){f.life-=dt;f.y-=dt*8}for(let i=FT.length-1;i>=0;i--)if(FT[i].life<=0)FT.splice(i,1);
  for(const f of G.fx){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=60*dt;f.life-=dt}G.fx=G.fx.filter(f=>f.life>0);
  if(G.over){G.over.t+=dt;return}
  if(G.intro>0){G.intro-=dt;return}
  // прицел: клавиши
  const sp=110*dt;let mx=0,my=0;try{if(keys.KeyA||keys.ArrowLeft)mx-=1;if(keys.KeyD||keys.ArrowRight)mx+=1;if(keys.KeyW||keys.ArrowUp)my-=1;if(keys.KeyS||keys.ArrowDown)my+=1}catch(e){}
  G.ax=clamp(G.ax+mx*sp,4,316);G.ay=clamp(G.ay+my*sp,20,170);
  const br=G.breath?.25:1;G.sx=Math.sin(G.t*1.3)*2.2*br;G.sy=Math.sin(G.t*1.9+1)*1.6*br;
  if(G.cd>0)G.cd-=dt;if(G.flash>0)G.flash-=dt;
  if(G.rl>0){G.rl-=dt;if(G.rl<=0){G.mag=5;sfx('click')}}
  G.next-=dt;if(G.next<=0&&G.spawned<G.total){spawn();if(G.spawned>6&&Math.random()<.45)spawn();G.next=rnd(1.4,2.8)}
  for(const z of G.zs){if(z.dead)continue;z.t+=dt;z.p=Math.min(1,z.p+dt/z.dur);const e=z.p;z.z=z.z0+(1-z.z0)*e*e;z.wx=z.wx0+(z.tx-z.wx0)*Math.min(1,e*1.3);
    if(z.p>=1){z.dead=true;z.leaked=true;G.leak++;sfx('groan',1.4);floatT('ПРОРВАЛСЯ!',160,150,'#ff4a4a')}}
  if(G.leak>=G.maxLeak)end(false);
  else if(G.kills>=G.need||(G.spawned>=G.total&&G.zs.every(z=>z.dead)))end(G.kills>=Math.min(G.need,G.total-G.maxLeak+1)||G.leak<G.maxLeak);
}
function end(win){G.over={win,t:0};sfx(win?'power':'thump',win?1:.6)}
function finish(retry){const g=G;if(!g)return;if(retry){SNP.play({need:g.need,total:g.total,leak:g.maxLeak},g.done);return}
  SNP.on=false;G=null;if(g.done)g.done({win:g.over.win,kills:g.kills,head:g.head,shots:g.shots})}
function T(t,x,y,c,sz,b,al){uiFont(sz||5,b);u.fillStyle=c;u.textAlign=al||'left';u.fillText(t,x,y);u.textAlign='left'}
function draw(){
  const k=ui.width/W;u.setTransform(k,0,0,k,0,0);u.imageSmoothingEnabled=false;
  scene();
  u.drawImage(SCN,0,0,320,180);u.fillStyle='rgba(0,0,0,.45)';u.fillRect(0,0,320,180);
  // оптика: увеличенный круг
  const ax=G.ax+G.sx,ay=G.ay+G.sy,R=34,Z=2.4;
  u.save();u.beginPath();u.arc(ax,ay,R,0,TAU);u.clip();u.fillStyle='#000';u.fillRect(ax-R,ay-R,R*2,R*2);
  u.drawImage(SCN,(ax-R/Z)*2,(ay-R/Z)*2,(R*2/Z)*2,(R*2/Z)*2,ax-R,ay-R,R*2,R*2);
  u.strokeStyle='rgba(0,0,0,.85)';u.lineWidth=.6;u.beginPath();u.moveTo(ax-R,ay);u.lineTo(ax-3,ay);u.moveTo(ax+3,ay);u.lineTo(ax+R,ay);u.moveTo(ax,ay-R);u.lineTo(ax,ay-3);u.moveTo(ax,ay+3);u.lineTo(ax,ay+R);u.stroke();
  for(let i=1;i<4;i++){u.fillStyle='rgba(0,0,0,.8)';u.fillRect(ax-.3,ay+i*6,.6,.6);u.fillRect(ax-2+i*0,ay+i*6,4,.3)}
  const g=u.createRadialGradient(ax,ay,R*.6,ax,ay,R);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.7)');u.fillStyle=g;u.fillRect(ax-R,ay-R,R*2,R*2);
  u.restore();u.strokeStyle='#0a0a0e';u.lineWidth=2;u.beginPath();u.arc(ax,ay,R,0,TAU);u.stroke();
  // лазер: из угла (ствол) в точку
  u.save();u.globalCompositeOperation='lighter';u.strokeStyle='rgba(255,30,30,.35)';u.lineWidth=.6;u.beginPath();u.moveTo(300,182);u.lineTo(ax,ay);u.stroke();u.fillStyle='rgba(255,40,40,.95)';u.fillRect(ax-.8,ay-.8,1.6,1.6);u.restore();
  // ствол AWP снизу справа
  u.fillStyle='#2a3a22';u.save();u.translate(300,182);u.rotate(Math.atan2(ay-182,ax-300));u.fillRect(-4,-3,46,6);u.fillStyle='#1a1a1e';u.fillRect(40,-1.6,26,3.2);u.fillStyle='#4a5a3a';u.fillRect(4,-5,16,3);u.restore();
  if(G.flash>0){u.fillStyle=`rgba(255,240,200,${G.flash*3})`;u.fillRect(0,0,320,180)}
  for(const f of FT){u.globalAlpha=clamp(f.life*2,0,1);T(f.t,f.x,f.y,f.c,5.4,true,'center');u.globalAlpha=1}
  // HUD
  u.fillStyle='rgba(8,5,16,.75)';u.fillRect(4,4,124,22);T('AWP · ЗАДАНИЕ ХАНЖИ',8,11,'#ffd23a',4.6,true);
  T('Убито: '+G.kills+' / '+G.need,8,19,'#fff',4.6,true);T('Прорвалось: '+G.leak+' / '+G.maxLeak,70,19,G.leak?'#ff6a6a':'#9a92b0',4.2,true);
  for(let i=0;i<5;i++){u.fillStyle=i<G.mag?'#ffd23a':'rgba(255,255,255,.15)';u.fillRect(W-12-i*6,8,4,10)}
  if(G.rl>0){T('ПЕРЕЗАРЯДКА',W-8,26,'#ffd23a',4.4,true,'right');u.fillStyle='rgba(255,255,255,.15)';u.fillRect(W-44,28,36,2);u.fillStyle='#ffd23a';u.fillRect(W-44,28,36*(1-G.rl/2.2),2)}
  if(touch.on){u.globalAlpha=.6;u.fillStyle='#c8202a';u.beginPath();u.arc(290,140,16,0,TAU);u.fill();u.globalAlpha=1;T('ОГОНЬ',290,142,'#fff',5,true,'center');
    u.globalAlpha=.4;u.fillStyle='#3a3a52';u.beginPath();u.arc(290,104,10,0,TAU);u.fill();u.globalAlpha=1;T('R',290,106,'#fff',5,true,'center')}
  if(G.intro>0){u.fillStyle='rgba(8,5,16,.82)';u.fillRect(40,56,240,62);T('КРЫША · ПРИКРЫТЬ ДВОР',160,70,'#ffd23a',7,true,'center');
    T('Зомби бегут к подъезду со всех сторон. Не пропусти больше '+(G.maxLeak-1)+'.',160,82,'#fff',4.6,false,'center');
    T(touch.on?'Веди пальцем — прицел, кнопка ОГОНЬ — выстрел':'Мышь или WASD — прицел · ЛКМ / Пробел — выстрел · R — перезарядка',160,92,'#c8c0e0',4.2,false,'center');
    T('Затвор передёргивается — стреляй с расчётом. В голову — сразу насмерть.',160,101,'#9a92b0',4,false,'center');T(Math.ceil(G.intro)+'',160,112,'#ffd23a',6,true,'center')}
  if(G.over){const a=Math.min(1,G.over.t*2);u.globalAlpha=a;u.fillStyle='rgba(8,5,16,.86)';u.fillRect(50,50,220,80);
    T(G.over.win?'ДВОР ПРИКРЫТ':'ЗОМБИ ПРОРВАЛИСЬ',160,68,G.over.win?'#7affb0':'#ff4a5a',9,true,'center');
    T('Убито: '+G.kills+' · в голову: '+G.head+' · выстрелов: '+G.shots,160,80,'#fff',4.8,false,'center');
    if(G.over.win){T('AWP с лазером теперь твоя. Ждёт в оружейной.',160,90,'#ffd23a',4.6,false,'center');T(touch.on?'Коснись — дальше':'E / клик — дальше',160,118,'#9a92b0',4.4,false,'center')}
    else{u.fillStyle='#ffd23a';u.fillRect(70,100,84,12);T('ЕЩЁ РАЗ',112,108,'#120a1c',5,true,'center');u.fillStyle='rgba(255,255,255,.12)';u.fillRect(166,100,84,12);T('ПОТОМ',208,108,'#fff',5,true,'center');
      T('AWP останется у тебя в любом случае',160,122,'#9a92b0',4,false,'center')}
    u.globalAlpha=1}
}
// цикл
const _u=update;update=function(dt){if(SNP.on){tick(dt);try{tm+=dt;updateMusic(dt)}catch(e){}return}_u(dt)};
const _r=render;render=function(){if(SNP.on){draw();return}_r()};
// ввод
(window.__pre=window.__pre||[]).unshift(function(e){
  if(!SNP.on||!G)return false;const t=e.type;
  const P=ev=>({x:(ev.clientX-OX)/SC,y:(ev.clientY-OY)/SC});
  if(G.over){if(G.over.t<.5)return true;
    if(t==='keydown'){if(G.over.win||e.code==='KeyE'||e.code==='Enter'||e.code==='Space')finish(!G.over.win&&e.code!=='Escape');else if(e.code==='Escape')finish(false);return true}
    if(t==='mousedown'||t==='touchstart'){const p=P(e.changedTouches?e.changedTouches[0]:e);if(G.over.win)finish(false);else finish(p.x<160);return true}
    return true}
  if(t==='keydown'){if(e.code==='Space'||e.code==='KeyE'||e.code==='Enter')shoot();else if(e.code==='KeyR')startRl();else if(e.code==='ShiftLeft'||e.code==='ShiftRight')G.breath=true;else keys[e.code]=true;return true}
  if(t==='keyup'){if(e.code==='ShiftLeft'||e.code==='ShiftRight')G.breath=false;keys[e.code]=false;return true}
  if(t==='mousemove'&&!touch.on){const p=P(e);G.ax=clamp(p.x,4,316);G.ay=clamp(p.y,20,170);return true}
  if(t==='mousedown'){if(e.button===2)G.breath=true;else shoot();return true}
  if(t==='mouseup'){if(e.button===2)G.breath=false;return true}
  if(t==='touchstart'){touch.on=true;for(const tt of e.changedTouches){const p=P(tt);if(Math.hypot(p.x-290,p.y-140)<20)shoot();else if(Math.hypot(p.x-290,p.y-104)<13)startRl();else G.drag={id:tt.identifier,x:p.x,y:p.y}}return true}
  if(t==='touchmove'){for(const tt of e.changedTouches){if(G.drag&&tt.identifier===G.drag.id){const p=P(tt);G.ax=clamp(G.ax+(p.x-G.drag.x)*1.2,4,316);G.ay=clamp(G.ay+(p.y-G.drag.y)*1.2,20,170);G.drag.x=p.x;G.drag.y=p.y}}return true}
  if(t==='touchend'){for(const tt of e.changedTouches)if(G.drag&&tt.identifier===G.drag.id)G.drag=null;return true}
  return true;
});
})();
