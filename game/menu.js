// menu.js — новый титул (03.11): слайд-шоу «загрузка» → главное меню с анимированным артом «Коломяги».
// Перехватывает ввод на титуле через window.__pre (первым), старые кнопки титула не показываются.
// Коллекции пока открывают прежнюю галерею (C1.gal); «Миссии» — отдельный режим (missions.js).
(function(){
'use strict';
const sfx=(k,v)=>{try{C1.X.sfx(k,v)}catch(e){}},ac=()=>{try{C1.X.sfx('click',.01)}catch(e){}};
const M=window.MART;if(!M)return;
const {AW,AH,g,R,P,E,mix,hash,spr,put,TAU}=M;
// ================= герои со спины =================
const MK={hr:'#3d2b20',hl:'#5a4232',hd:'#2a1d15',sk:'#e8b898',j:'#8f9298',jd:'#6f7278',jn:'#1d1e26',sh:'#9a9ca2',gun:'#1d1e23'};
function mikrobBack(a){const c=MK;
  // кеды и джинсы
  a.q([14,141,27,141,28,150,12,150],c.sh);a.q([33,141,46,141,48,150,32,150],c.sh);a.d(12,148,16,2,'#e8e8ec');a.d(32,148,16,2,'#e8e8ec');
  a.q([15,86,30,86,28,142,16,142],c.jn);a.q([30,86,45,86,44,142,32,142],c.jn);a.d(29,92,1,48,'#14141a');a.d(18,110,1,20,'#2a2b36');a.d(41,104,1,26,'#2a2b36');
  // куртка
  a.q([10,40,50,40,53,94,7,94],c.j);a.d(29,46,1,44,c.jd);a.d(7,89,46,5,'#7a7d83');a.d(12,60,1,26,'#9da0a6');a.d(46,58,1,28,'#7f8288');
  a.d(16,52,10,1,'#7f8288');a.d(34,52,10,1,'#7f8288');
  a.r(19,35,22,7,'#7a7d83');
  // левая рука (к Шмакодявке) и правая с пистолетом
  a.q([10,41,3,45,-4,92,4,95,12,62],c.j);a.d(-3,84,8,3,c.jd);a.r(-6,91,8,8,c.sk);a.d(-6,97,8,1,'#c08868');
  a.q([50,41,57,45,62,90,54,93,48,62],c.j);a.d(54,82,8,3,c.jd);a.r(53,89,8,8,c.sk);a.d(53,95,8,1,'#c08868');
  a.r(55,94,5,8,c.gun);a.r(56,101,4,13,c.gun);a.d(56,101,1,13,'#4a4c56');a.d(58,113,1,1,'#000');
  // шея, уши, голова: волосы зачёсаны назад
  a.r(24,29,12,8,c.sk);a.d(24,35,12,1,'#c08868');
  a.r(12,17,3,8,c.sk);a.r(45,17,3,8,c.sk);a.d(12,19,1,1,'#ffd23a');a.d(47,19,1,1,'#ffd23a');a.d(12,18,3,1,'#111');a.d(45,18,3,1,'#111');
  a.q([19,4,41,4,46,13,47,26,42,33,18,33,13,26,14,13],c.hr);
  for(let i=0;i<9;i++){const x=17+i*3.2;a.d(x,6+(i%2),1,22+((i*5)%5),i%2?c.hd:c.hl)}
  a.d(18,30,24,2,c.hd);a.d(13,24,2,6,c.hr);a.d(45,24,2,6,c.hr); // борода по краям
}
const SH={hr:'#1c1418',hl:'#2e2228',hd:'#0c0a0e',sk:'#f2cab2',dr:'#ff6fb5',dd:'#d94f95',dl:'#ffd0e6',bt:'#111116'};
function shmakBack(a){const c=SH;
  a.q([12,110,23,110,24,122,10,122],c.bt);a.q([27,110,38,110,40,122,26,122],c.bt);a.d(9,121,16,5,'#2e2e36');a.d(25,121,16,5,'#2e2e36');a.d(9,125,16,1,'#000');a.d(25,125,16,1,'#000');
  a.r(14,86,7,25,c.sk);a.r(29,86,7,25,c.sk);a.d(20,90,1,20,'#d8a890');a.d(35,90,1,20,'#d8a890');
  a.q([14,34,36,34,44,90,6,90],c.dr);a.d(6,87,38,3,c.dl);for(const x of [13,20,28,35])a.d(x,58,1,28,c.dd);
  // руки: правая (к Микробу), левая со скакалкой
  a.q([35,38,41,41,51,73,47,77,37,56],c.sk);a.r(47,72,7,7,c.sk);
  a.q([15,38,9,41,3,74,8,77,13,56],c.sk);a.r(0,73,7,7,c.sk);a.r(1,77,4,12,'#3ef0b0');a.d(1,77,4,1,'#c8fff0');a.d(2,88,2,1,'#1a8a6a');
  // волосы до пояса
  a.q([13,2,35,2,40,12,42,58,38,66,12,66,7,58,9,12],c.hr);
  for(let i=0;i<10;i++){const x=11+i*3;a.d(x,10+(i%3),1,48+((i*7)%8),i%2?c.hd:c.hl)}
  a.d(30,8,4,3,'#ff4fa3');a.d(31,8,2,1,'#ffd0e6'); // заколка
}
// голова зомби на боку и катана
function zHead(a){a.e(17,14,15,12,'#6a9a5a');a.e(12,10,7,5,'#7aaa64');a.d(6,8,3,3,'#3a5a30');a.d(22,6,4,2,'#4a6a3a');
  a.ln(7,15,11,19,'#1a0a0a');a.ln(11,15,7,19,'#1a0a0a');a.ln(15,13,19,17,'#1a0a0a');a.ln(19,13,15,17,'#1a0a0a');
  a.e(13,22,5,3,'#2a0808');a.d(10,21,2,1,'#e8e0c8');a.d(14,21,2,1,'#e8e0c8');
  a.q([27,4,33,8,32,20,27,24],'#7a1a1a');a.d(29,8,2,12,'#b8202a');a.d(30,12,1,4,'#e8d8c8'); // срез шеи
  for(let i=0;i<6;i++)a.d(4+i*4,1+(i%2),2,3,'#2a3a22')}
// ================= сцена главного меню =================
const GRASS=['#2e6a2a','#3a8a34','#4aa040','#2a5a24'];
function menuScene(t){
  M.sky('#07031a','#2a0c48','#a8206a',250);
  M.stars(t,3,170,110);M.moon(470,70,26,t);
  const cx=(t*4)%(AW+200);M.cloud(AW-cx,56,90,'rgba(60,20,90,.55)');M.cloud(((AW-cx*0.6)%(AW+200)+AW+200)%(AW+200)-100,96,70,'rgba(90,30,110,.45)');
  // горизонт
  const hg=g.createLinearGradient(0,170,0,250);hg.addColorStop(0,'rgba(255,79,216,0)');hg.addColorStop(1,'rgba(255,79,216,.35)');g.fillStyle=hg;g.fillRect(0,170,AW,80);
  M.skyline(240,11,'#1e1236',30,70,.1,t);M.lakhta(590,236,46,t);M.petro(360,238,t);M.skyline(246,23,'#150c28',10,34,.16,t);
  M.water(240,262,t,[[590,'rgba(120,200,255,.45)'],[361,'rgba(255,200,80,.45)'],[470,'rgba(255,220,240,.35)']]);
  // мост с машинами
  R(180,244,460,3,'#2a1e46');for(let x=190;x<640;x+=30)R(x,236,2,8,'#2a1e46');for(let i=0;i<3;i++){const x=(t*60+i*210)%520+160;R(x,242,4,2,'#fff6c8');R(x-6,242,3,2,'#ff3040')}
  // холм Коломяг
  const hill=x=>272-Math.max(0,1-Math.abs(x-330)/260)**1.3*22+Math.sin(x*.03)*1.2;
  g.fillStyle='#0b1a12';g.beginPath();g.moveTo(90,300);for(let x=90;x<=640;x+=4)g.lineTo(x,hill(x));g.lineTo(640,300);g.fill();
  for(let x=90;x<640;x+=2){const y=hill(x);if(hash(x,4)<.5)P(x,y-1,'#16301e');if(hash(x,6)<.25)P(x,y+2+((x*3)%5),'#142a1a')}
  // буквы из травы «КОЛОМЯГИ»: стоят по склону, как знаменитая надпись на холме
  {const sc=4,word='КОЛОМЯГИ';let lx=226;[...word].forEach((ch,ci)=>{const gw=M.GL[ch][0].length*sc,ly=Math.round(hill(lx+gw/2))-31;
    M.pixText(ch,lx,ly,sc,0,null,{cell(px,py,s){R(px-1,py-1,s+2,s+2,'#081008')}});
    M.pixText(ch,lx,ly,sc,0,null,{cell(px,py,s,row){R(px,py,s,s,GRASS[(px*7+py*3)%4===0?2:(px+py)%3===0?3:1]);
      if(hash(px,py)<.5)P(px+((py*5)%s),py,'#5ab84a');if(row===0&&hash(px,py+1)<.7)P(px+((px*3)%s),py-1,'#4aa040')}});
    R(lx+2,ly+28,1,5,'#3a2a20');R(lx+gw-3,ly+28,1,5,'#3a2a20');lx+=gw+4})}
  // деревья: берёзы и ели вместо пальм
  for(const [x,h] of [[178,92],[212,70],[258,58],[600,96],[628,78]])M.spruce(x,300,h,t,'#ff4fa3');
  for(const [x,h] of [[232,96],[540,104],[575,80]])M.birch(x,300,h,t,'#3ef0b0');
  // передний план
  R(0,298,AW,62,'#0a0812');for(let i=0;i<120;i++){const x=hash(i,5)*AW,y=300+hash(5,i)*58;P(x,y,hash(i,6)<.5?'#1a1428':'#14301e')}
  for(let x=0;x<AW;x+=3)if(hash(x,2)<.5)R(x,296+((x*7)%3),1,3,'#1e3a24');
  // неоновая лужа-отражение
  g.fillStyle='rgba(255,79,216,.18)';g.beginPath();g.ellipse(470,334,90,9,0,0,TAU);g.fill();g.fillStyle='rgba(62,240,176,.12)';g.beginPath();g.ellipse(470,334,60,5,0,0,TAU);g.fill();
  // кровь, голова, катана
  const pr=1+Math.sin(t*1.3)*.04;E(300,330,30*pr,7*pr,'#4a0610');E(300,329,26*pr,5.5*pr,'#7a0a18');E(292,327,9,1.6,'#c8203a');P(312,328,'#ff6a7a');
  for(let i=0;i<3;i++){const k=((t*.6+i/3)%1);E(300+(i-1)*14,330,4+k*14,1+k*3,`rgba(255,80,110,${.25*(1-k)})`)}
  put(spr('zh',zHead),282,306);
  const kat=window.ICONS&&ICONS.PIX&&ICONS.PIX.katana;if(kat){g.save();g.translate(322,340);g.rotate(-.12);g.drawImage(kat.cv,0,-kat.h,kat.w,kat.h);g.restore()}
  for(let i=0;i<4;i++){const a=t*3+i*1.7;P(300+Math.cos(a)*16,316+Math.sin(a*1.3)*6,'#1a1a1a')} // мухи
  // герои со спины, держатся за руки
  const by=356,mx=500;const breathe=Math.round(Math.sin(t*2)*.6);
  put(spr('shB',shmakBack),mx-52,by-126+breathe);put(spr('mkB',mikrobBack),mx,by-150);
  // скакалка
  const hx=mx-52+3,hy=by-126+89+breathe,sw=Math.sin(t*1.6)*6;g.strokeStyle='#0a090d';g.lineWidth=3;g.beginPath();g.moveTo(hx,hy);g.quadraticCurveTo(hx-14+sw,by+2,hx-34,by-4);g.stroke();
  g.strokeStyle='#ff4fa3';g.lineWidth=1.5;g.stroke();R(hx-40,by-8,4,10,'#3ef0b0');R(hx-40,by-8,4,1,'#c8fff0');
  // контровой неон по силуэтам
  g.fillStyle='rgba(255,79,216,.25)';g.fillRect(mx+50,by-110,2,60);g.fillStyle='rgba(62,240,176,.25)';g.fillRect(mx-52+6,by-120,2,40);
  // светлячки
  for(let i=0;i<10;i++){const x=(hash(i,8)*AW+Math.sin(t*.7+i)*20),y=200+hash(8,i)*90+Math.sin(t+i*2)*6;if(Math.sin(t*2+i)>0)P(x,y,i%2?'#c8ff8a':'#ffd27a')}
}
// ================= экран =================
const ST={ph:'slides',t:0,sel:0,slide:0,st:0,hover:-1,first:true,legacy:false,msg:'',msgT:0};window.TITLE=ST;
try{const f=sessionStorage.getItem('pp_newarm');if(f&&Date.now()-(+f)<120000&&!(window.SAVEP&&SAVEP.get())){ST.ph='main';ST.sel=0}sessionStorage.removeItem('pp_newarm')}catch(e){}
const hasSave=()=>!!(window.SAVEP&&SAVEP.get());
function items(){const L=[];if(hasSave())L.push({k:'cont',t:'ПРОДОЛЖИТЬ',sub:''});
  if(window.SAVEP&&SAVEP.slots&&SAVEP.slots().length)L.push({k:'slots',t:'СОХРАНЕНИЯ'});L.push({k:'new',t:'НОВАЯ ИГРА'},{k:'mis',t:'МИССИИ'},{k:'col',t:'КОЛЛЕКЦИИ'},{k:'set',t:'НАСТРОЙКИ',lock:window.VOLUI?0:1},{k:'code',t:'КОД СОХРАНЕНИЯ',small:1},{k:'exit',t:'ВЫХОД'});return L}
// раскладка кнопок (логические единицы 320×180)
const BX=10,BY0=62,BW=86,BH=11,BG=3.4;
function btnRect(i,L){let y=BY0;for(let j=0;j<i;j++)y+=(L[j].small?8:BH)+BG;return{x:BX,y,w:BW,h:L[i].small?8:BH}}
function drawArt(fn,t){fn(t);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(M.cv,0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore()}
function neonText(s,x,y,sz,c,al,glow){uiFont(sz,true);u.textAlign=al||'left';u.save();u.shadowColor=c;u.shadowBlur=glow||4;u.fillStyle=c;u.fillText(s,x,y);u.restore();u.fillStyle='#fff';u.globalAlpha=.25;u.fillText(s,x,y);u.globalAlpha=1;u.textAlign='left'}
function renderMain(){
  drawArt(menuScene,ST.t);
  // левая панель
  const gr=u.createLinearGradient(0,0,120,0);gr.addColorStop(0,'rgba(8,4,18,.9)');gr.addColorStop(.75,'rgba(8,4,18,.55)');gr.addColorStop(1,'rgba(8,4,18,0)');u.fillStyle=gr;u.fillRect(0,0,120,H);
  // логотип: рисуем на отдельном холсте пикселями
  if(!renderMain.lg){renderMain.lg=document.createElement('canvas');renderMain.lg.width=200;renderMain.lg.height=110}
  const lc=renderMain.lg,lg=lc.getContext('2d');lg.clearRect(0,0,200,110);
  logoTo(lg,ST.t);u.imageSmoothingEnabled=false;u.drawImage(lc,6,6,100,55);
  const L=items();
  L.forEach((it,i)=>{const b=btnRect(i,L),on=i===ST.sel,col=it.lock?'#6a6280':on?'#ff4fd8':'#3ef0b0';
    if(on){u.save();u.shadowColor='#ff4fd8';u.shadowBlur=8;u.fillStyle='rgba(255,79,216,.22)';u.fillRect(b.x-2,b.y,b.w+4,b.h);u.restore();
      u.fillStyle='#ff4fd8';u.fillRect(b.x-2,b.y,1.2,b.h);u.fillStyle='#3ef0b0';u.fillRect(b.x+b.w+1,b.y,1.2,b.h)}
    const tx=b.x+(on?4+Math.sin(ST.t*8)*.6:2);
    if(it.small){uiFont(4.2,true);u.fillStyle=on?'#ffd0f4':'#9a92b0';u.fillText(it.t,tx,b.y+5.8)}
    else{neonText(it.t,tx,b.y+8.2,6.6,on?'#ffffff':col,'left',on?8:3);
      if(it.lock){uiFont(4,true);u.fillStyle='#6a6280';u.fillText('🔒 скоро',b.x+b.w-24,b.y+7.6)}}
    if(it.k==='cont'&&window.SAVEP){const s=SAVEP.get();let lb='';try{lb=s.done?'Глава '+s.ch+' пройдена':'Глава '+s.ch}catch(e){}uiFont(3.6,false);u.fillStyle='#bdf5e0';u.fillText(lb,b.x+b.w-u.measureText(lb).width,b.y+7.6)}});
  uiFont(3.8,false);u.fillStyle='rgba(200,192,224,.6)';u.fillText(touch.on?'Коснись пункта меню':'W/S или мышь — выбор · E / Enter — выбрать',BX,H-5);
  if(ST.msgT>0){uiFont(5,true);u.textAlign='center';u.fillStyle='rgba(8,4,18,.8)';const w=u.measureText(ST.msg).width+12;u.fillRect(W*.62-w/2,H-20,w,10);u.fillStyle='#ffd23a';u.fillText(ST.msg,W*.62,H-13);u.textAlign='left'}
}
function logoTo(c,t){M.use(c,()=>M.logo(4,4,4,t))}
function renderExit(){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();
  u.textAlign='center';uiFont(7,true);u.fillStyle='#ff4fd8';u.fillText('Игра закрыта',W/2,H/2-4);uiFont(4.6,false);u.fillStyle='#9a92b0';u.fillText(touch.on?'Коснись экрана, чтобы вернуться в меню':'Нажми любую кнопку, чтобы вернуться в меню',W/2,H/2+8);u.textAlign='left'}
// ---------- слайд-шоу ----------
const SL=()=>window.SLIDES||[];
function renderSlides(){const L=SL();if(!L.length){ST.ph='main';return renderMain()}
  const dur=3.2,fade=.8,i=Math.floor(ST.st/dur)%L.length,k=(ST.st%dur);
  drawArt(L[i].draw,ST.t);
  if(k>dur-fade){const j=(i+1)%L.length;const a=(k-(dur-fade))/fade;
    if(!renderSlides.b){renderSlides.b=document.createElement('canvas');renderSlides.b.width=AW;renderSlides.b.height=AH}
    const bg=renderSlides.b.getContext('2d');bg.clearRect(0,0,AW,AH);bg.drawImage(M.cv,0,0); // текущий
    L[j].draw(ST.t);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;ctx.globalAlpha=a;ctx.drawImage(M.cv,0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore()}
  const cur=L[i];
  // подпись главы и логотип в углу
  u.fillStyle='rgba(8,4,18,.55)';u.fillRect(0,H-22,W,22);
  neonText(cur.ch||'',8,H-12.5,4.6,'#3ef0b0','left',3);neonText(cur.title||'',8,H-5,6.4,'#ff4fd8','left',5);
  if(!renderMain.lg){renderMain.lg=document.createElement('canvas');renderMain.lg.width=200;renderMain.lg.height=110}
  // точки-индикаторы
  for(let n=0;n<L.length;n++){u.fillStyle=n===i?'#ff4fd8':'rgba(255,255,255,.3)';u.fillRect(W-8-(L.length-n)*5,H-9,3,3)}
  uiFont(4.6,true);u.textAlign='right';u.globalAlpha=.55+.45*Math.sin(ST.t*3);u.fillStyle='#ffffff';u.fillText(touch.on?'Коснись экрана':'Нажми любую кнопку',W-8,H-13);u.globalAlpha=1;u.textAlign='left'}
// ---------- рендер титула ----------
const _rt=renderTitle;
function legacyOpen(){return !!(C1.menu||C1.gal||[window.C2,window.C3,window.C4,window.C5,window.C6,window.C7,window.C8,window.C9,window.C10].some(o=>o&&o.menu))}
renderTitle=function(){
  if(ST.legacy){if(legacyOpen()){_rt();return}ST.legacy=false}
  if(window.MIS&&MIS.ui&&MIS.render){drawArt(menuScene,ST.t);MIS.render();return}
  if(ST.ph==='exit')return renderExit();
  if(ST.ph==='slides')return renderSlides();
  renderMain()};
const _up=update;update=function(dt){if(state==='title'){ST.t+=dt;ST.st+=dt;if(ST.msgT>0)ST.msgT-=dt}_up(dt)};
// ---------- действия ----------
function startNew(){if(hasSave()){try{sessionStorage.setItem('pp_newarm',String(Date.now()))}catch(e){}SAVEP.openNew();return}
  menuOn=true;state='play';music('intro');playCut(INTRO,()=>transitionIn(startYard))}
function act(it){if(!it)return;sfx('click');
  if(it.k==='cont'){SAVEP.resume();return}
  if(it.k==='new'){startNew();return}
  if(it.k==='mis'){if(window.MIS&&MIS.open)MIS.open();else{ST.msg='Миссии скоро';ST.msgT=2}return}
  if(it.k==='col'){if(window.COLL){COLL.open('film');return}C1.gal={pg:0};ST.legacy=true;return}
  if(it.k==='set'){if(window.VOLUI){VOLUI.open();return}ST.msg='Настройки появятся позже';ST.msgT=2;return}
  if(it.k==='slots'){SAVEP.openSlots&&SAVEP.openSlots();return}
  if(it.k==='code'){SAVEP.openBox&&SAVEP.openBox();return}
  if(it.k==='exit'){ST.ph='exit';try{for(const k in MUS)MUS[k].pause()}catch(e){}try{window.close()}catch(e){}return}}
function wake(){if(ST.first){ST.first=false;try{ac()}catch(e){}menuOn=true;try{music('menu')}catch(e){}}}
function pt(e){const t=e.changedTouches?e.changedTouches[0]:e;return t?{x:(t.clientX-OX)/SC,y:(t.clientY-OY)/SC}:null}
(window.__pre=window.__pre||[]).unshift(function(e){
  if(state!=='title')return false;if(document.getElementById('savebox'))return false;
  if(ST.legacy)return false;
  if(window.MIS&&MIS.ui)return MIS.input?MIS.input(e):false;
  const ty=e.type;const isKey=ty==='keydown',isDown=ty==='mousedown'||ty==='touchstart';
  if(e.changedTouches){touch.on=true;mouse.on=false}
  if(ST.ph==='exit'){if(isKey||isDown){ST.ph='main';wake();try{music('menu')}catch(err){}}return isKey||isDown||ty==='keyup'||ty==='mouseup'||ty==='touchend'}
  if(ST.ph==='slides'){if((isKey&&!e.repeat)||isDown){wake();ST.ph='main';ST.sel=0;sfx('click')}return true}
  const L=items();
  if(isKey){wake();if(e.repeat&&!['KeyW','KeyS','ArrowUp','ArrowDown'].includes(e.code))return true;
    if(e.code==='KeyW'||e.code==='ArrowUp'){ST.sel=(ST.sel+L.length-1)%L.length;sfx('click',.6)}
    else if(e.code==='KeyS'||e.code==='ArrowDown'){ST.sel=(ST.sel+1)%L.length;sfx('click',.6)}
    else if(['KeyE','Space','Enter'].includes(e.code))act(L[ST.sel]);
    else if(e.code==='KeyC'&&hasSave())act({k:'cont'});
    else if(e.code==='Escape'){ST.ph='slides';ST.st=0}
    return true}
  if(ty==='mousemove'){const p=pt(e);if(p)L.forEach((it,i)=>{const b=btnRect(i,L);if(p.x>=b.x-3&&p.x<=b.x+b.w+3&&p.y>=b.y&&p.y<=b.y+b.h)ST.sel=i});return false}
  if(isDown){wake();const p=pt(e);if(!p)return true;let hit=-1;L.forEach((it,i)=>{const b=btnRect(i,L);if(p.x>=b.x-3&&p.x<=b.x+b.w+3&&p.y>=b.y-1&&p.y<=b.y+b.h+1)hit=i});
    if(hit>=0){ST.sel=hit;act(L[hit])}return true}
  if(ty==='keyup'||ty==='mouseup'||ty==='touchend'||ty==='wheel'||ty==='contextmenu')return true;
  return false});
window.TMENU={scene:menuScene,drawArt,neonText,items,ST};
})();
