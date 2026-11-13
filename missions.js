// missions.js — режим «Миссии» (03.11): любая глава отдельно, без общего прогресса.
// Лоадаут выбирается перед заходом: чем дальше глава, тем лучше доступное оружие, броня и запасы (с лимитом).
// Пока идёт миссия, запись в localStorage отключена (ничего не сохраняется: ни рубли, ни коллекции, ни чертежи),
// по выходу/концу миссии страница перезагружается и открывает список миссий.
(function(){
'use strict';
const sfx=(k,v)=>{try{C1.X.sfx(k,v)}catch(e){}},ac=()=>{try{C1.X.sfx('click',.01)}catch(e){}};
const TT=['Вечер в Коломягах','Погром в офисе','Малявочные делишки','Крысиные бега','Алко Пати Лайф','Итальянский вайб','Перелесье','Диджей-сет в Грибыче','Тактикульщина','Мой дом — моя крепость','Северная столица'];
const START={1:'call',2:'talk',3:'feed',4:'call4',5:'call5',6:'call6',7:'call7',8:'call8',9:'call9',10:'call10'};
const NOLO={0:'Пролог: квартира, без оружия',3:'Играешь за Черсика — свой набор'};
// пулы по главе, с которой предмет доступен
const POOL={
  m:[['bat',1],['shovel',1],['machete',2],['kukri',3],['axe2',4],['katana',5],['sledge',7]],
  p:[['pistol',1],['glock',2],['flare',3],['usp',4],['deagle',5],['beretta',7]],
  t:[['nailgun',2],['shotgun',2],['sawn',3],['uzi',3],['mp5',4],['ak',4],['xbow',5],['rail',5],['saiga',6],['m4',6],['awp',6],['flamer',6],['rpk',7],['rpg',8],['vint',8],['pech',9],['minigun',10],['gatl',10],['shtuc',10],['ags',10]],
  a:[['k',1],['1',2],['h',3],['pp',4],['hk',4],['f',5],['2',5],['3',7],['t',9]]};
const MIS={ui:null,on:false};window.MIS=MIS;
const avail=(slot,c)=>POOL[slot].filter(x=>x[1]<=Math.max(1,c)).map(x=>x[0]);
const lim=c=>({syr:Math.min(6,1+Math.ceil(c/2)),pot:Math.floor(c/3),mags:2+Math.floor(c/2)});
function defLo(c){const L={c,m:avail('m',c).slice(-1)[0],p:avail('p',c).slice(-1)[0],t:c>=2?avail('t',c).slice(-1)[0]:null,a:avail('a',c).slice(-1)[0]||null,syr:lim(c).syr,pot:lim(c).pot};return L}
const WD=()=>C1.WD,nm=k=>{const w=WD()[k];return w?w.n:'—'};
// ---------- запуск ----------
const SS=Storage.prototype.setItem;
function lockStorage(){Storage.prototype.setItem=function(k,v){if(k==='snd_off'||k==='pp_mis')return SS.call(this,k,v)}}
function applyLo(){const L=MIS.lo;if(!L||!C1.upg||!C1.upg())return;const PS=C1.PS,W=WD(),lm=lim(L.c);
  PS.own={};for(const k of [L.m,L.p,L.t])if(k&&W[k])PS.own[k]=1;PS.lo={m:L.m||null,p:L.p||null,t:L.t||null};PS.wpn=L.t||L.p||L.m||'bat';PS.mag={};
  for(const k of ['ammo','p50','shells','r762','r556','awp','cells','fuel','rockets','nlg','flr','bolt','pkm','sp6','vog'])PS[k]=0;
  for(const k of [L.p,L.t]){const w=W[k];if(!w||!w.am)continue;const mag=(w._b&&w._b.mag)||w.mag||10;PS.mag[k]=mag;PS[w.am]=(PS[w.am]||0)+mag*lm.mags}
  PS.syr=L.syr|0;PS.pot=L.pot|0;PS.hasShotgun=!!PS.own.shotgun;PS.hasRail=!!PS.own.rail;PS.hasFlame=!!PS.own.flamer;
  const A=window.UP&&UP.ARM;if(L.a&&A&&A[L.a]){const a=A[L.a];PS.arm={id:L.a,lvl:L.a==='h'?'h':a.lvl,dur:a.max,max:a.max,prot:a.prot}}else PS.arm=null;
  PS.hp=PS.max}
function go(c){const L=MIS.ui&&MIS.ui.lo;MIS.lo=c===0||NOLO[c]?null:L;MIS.ui=null;MIS.on=true;MIS.c=c;lockStorage();
  try{ac()}catch(e){}menuOn=true;
  if(window.UP&&UP.kit&&!UP.kit._mis){const k=UP.kit;UP.kit=function(ch){k(ch);if(MIS.on)applyLo()};UP.kit._mis=1}
  if(c===0){state='play';music('intro');playCut(INTRO,()=>transitionIn(startYard));return}
  const o=c===1?C1:window['C'+c];
  if(c===1)C1.menuStart(START[1]);else if(c<=4)o.menuStart(START[c]);else o.cfg.go(START[c]);
  setTimeout(applyLo,30);setTimeout(applyLo,400)}
MIS.go=go;
function back(){try{SS.call(sessionStorage,'pp_misback','1')}catch(e){}try{location.hash=''}catch(e){}(window.__leaving=1,location.reload())}
MIS.back=back;
// конец миссии
let endT=0;
const _up=update;update=function(dt){_up(dt);if(!MIS.on||state!=='play')return;const o=MIS.c===1?C1:window['C'+MIS.c];
  if(MIS.c>0&&o&&o.done){endT+=dt;if(endT>4)back()}};
const _rn=render;render=function(){_rn();if(MIS.on&&state==='play'&&endT>0){u.textAlign='center';uiFont(10,true);u.save();u.shadowColor='#3ef0b0';u.shadowBlur=10;u.fillStyle='#3ef0b0';u.fillText('МИССИЯ ПРОЙДЕНА',W/2,H/2);u.restore();uiFont(5,false);u.fillStyle='#c8c0e0';u.fillText('Возврат к списку миссий…',W/2,H/2+10);u.textAlign='left'}};
// ---------- экран выбора ----------
MIS.open=function(){MIS.ui={sel:1,row:-1,lo:defLo(1)}};
try{if(sessionStorage.getItem('pp_misback')){sessionStorage.removeItem('pp_misback');setTimeout(()=>{if(window.TITLE){TITLE.ph='main';TITLE.first=true}MIS.open()},0)}}catch(e){}
const ROWS=[['m','ХОЛОДНОЕ'],['p','ПИСТОЛЕТ'],['t','ДВУРУЧНОЕ'],['a','БРОНЯ'],['syr','ШПРИЦЫ'],['pot','ЗЕЛЬЯ РЕГЕНА']];
const LX=8,LY=26,LH=12.2,PXr=128,PY=22,PW=184,PH=134;
function cyc(slot,dir){const U=MIS.ui,L=U.lo,c=L.c;
  if(slot==='syr'||slot==='pot'){const mx=lim(c)[slot];L[slot]=Math.max(0,Math.min(mx,(L[slot]|0)+dir));return}
  const a=avail(slot,c);if(slot==='t'&&c<2){L.t=null;return}const opts=slot==='t'||slot==='a'?[null].concat(a):a;let i=opts.indexOf(L[slot]);i=(i+dir+opts.length)%opts.length;L[slot]=opts[i]}
function pick(i){const U=MIS.ui;U.sel=i;U.lo=defLo(i);U.row=-1}
MIS.render=function(){const U=MIS.ui;if(!U)return;
  u.fillStyle='rgba(6,3,14,.86)';u.fillRect(0,0,W,H);
  TMENU.neonText('МИССИИ',LX,16,9,'#ff4fd8','left',8);uiFont(4.2,false);u.fillStyle='#9a92b0';u.fillText('Любая глава отдельно. Без сохранений, коллекций и крафта.',LX+52,15);
  TT.forEach((t,i)=>{const y=LY+i*LH,on=i===U.sel;if(on){u.fillStyle='rgba(255,79,216,.22)';u.fillRect(LX-2,y-1,114,LH-1.5);u.fillStyle='#ff4fd8';u.fillRect(LX-2,y-1,1.2,LH-1.5)}
    uiFont(4,true);u.fillStyle=on?'#3ef0b0':'#6a6280';u.fillText(i===0?'ПРОЛОГ':'ГЛАВА '+i,LX+2,y+4.4);uiFont(5,true);u.fillStyle=on?'#ffffff':'#c8c0e0';u.fillText(t,LX+2,y+9.6)});
  // правая панель: лоадаут
  u.fillStyle='rgba(30,16,52,.9)';u.fillRect(PXr,PY,PW,PH);u.fillStyle='#ff4fd8';u.fillRect(PXr,PY,PW,1);u.fillStyle='#3ef0b0';u.fillRect(PXr,PY+PH-1,PW,1);
  const c=U.sel,L=U.lo;TMENU.neonText(TT[c],PXr+6,PY+10,6.4,'#ffd23a','left',4);
  if(c===0||NOLO[c]){uiFont(5,false);u.fillStyle='#c8c0e0';u.fillText(NOLO[c]||'',PXr+6,PY+26)}
  else{uiFont(3.8,false);u.fillStyle='#9a92b0';u.fillText('Доступно оружие до главы '+c+' · магазинов на ствол: '+lim(c).mags,PXr+6,PY+17);
    ROWS.forEach(([k,lb],j)=>{const y=PY+21+j*18,on=U.row===j;if(on){u.fillStyle='rgba(62,240,176,.14)';u.fillRect(PXr+2,y-1,PW-4,17)}
      uiFont(3.8,true);u.fillStyle='#9a92b0';u.fillText(lb,PXr+6,y+5);
      u.fillStyle=on?'#ff4fd8':'#5a5276';uiFont(6,true);u.fillText('◀',PXr+60,y+11);u.fillText('▶',PXr+PW-10,y+11);
      if(k==='syr'||k==='pot'){const n=L[k]|0,mx=lim(c)[k];let qx=PXr+70;for(let q=0;q<mx;q++){u.globalAlpha=q<n?1:.25;let w=0;try{w=ICONS.item(u,k==='syr'?'syr':'pot',qx,y+3,k==='syr'?5:9)}catch(e){}qx+=(w||8)+2;u.globalAlpha=1}uiFont(4.6,true);u.fillStyle='#fff';u.fillText(n+' / '+mx,PXr+6,y+12.5)}
      else{const id=L[k];if(k==='a'){const A=window.UP&&UP.ARM&&UP.ARM[id];if(A){try{ICONS.item(u,'arm_'+id,PXr+70,y+1,13)}catch(e){}uiFont(4.4,true);u.fillStyle='#fff';u.fillText(A.n,PXr+88,y+6);uiFont(3.6,false);u.fillStyle='#bdf5e0';u.fillText('защита '+Math.round(A.prot*100)+'% · прочность '+A.max,PXr+88,y+11.5)}else{uiFont(4.4,true);u.fillStyle='#6a6280';u.fillText('без брони',PXr+72,y+9)}}
        else if(id){try{ICONS.draw(u,id,PXr+68,y+4,.8)}catch(e){}uiFont(4.4,true);u.fillStyle='#fff';u.textAlign='right';u.fillText(nm(id),PXr+PW-14,y+6);u.textAlign='left'}
        else{uiFont(4.4,true);u.fillStyle='#6a6280';u.fillText(k==='t'&&c<2?'в этой главе нет':'пусто',PXr+72,y+9)}}})}
  // кнопка
  const bx=PXr+PW-64,by=PY+PH+4,on=U.row===ROWS.length||U.row===-1;u.save();u.shadowColor='#3ef0b0';u.shadowBlur=on?8:2;u.fillStyle=on?'#3ef0b0':'#1e5a4a';u.fillRect(bx,by,64,10);u.restore();
  uiFont(5.6,true);u.textAlign='center';u.fillStyle='#120a1c';u.fillText('В БОЙ ▶',bx+32,by+7.4);u.textAlign='left';
  uiFont(3.8,false);u.fillStyle='rgba(200,192,224,.65)';u.fillText(touch.on?'Касайся глав и стрелок · ✕ — назад':'W/S — глава/строка · A/D — сменить · Tab — к лоадауту · E — в бой · Esc — назад',LX,H-3);
  uiFont(5,true);u.fillStyle='#9a92b0';u.fillText('✕',W-10,9)};
MIS.input=function(e){const U=MIS.ui;if(!U)return false;const ty=e.type;
  const toP=t=>({x:(t.clientX-OX)/SC,y:(t.clientY-OY)/SC});
  if(ty==='keydown'){const c=e.code;
    if(c==='Escape'){if(U.row>=0)U.row=-1;else MIS.ui=null;sfx('click');return true}
    if(c==='Tab'){U.row=U.row<0?0:-1;return true}
    const lo=!(U.sel===0||NOLO[U.sel]);
    if(c==='KeyW'||c==='ArrowUp'){if(U.row<0)pick((U.sel+TT.length-1)%TT.length);else U.row=Math.max(0,U.row-1);sfx('click',.6);return true}
    if(c==='KeyS'||c==='ArrowDown'){if(U.row<0)pick((U.sel+1)%TT.length);else U.row=Math.min(ROWS.length,U.row+1);sfx('click',.6);return true}
    if(c==='KeyA'||c==='ArrowLeft'){if(U.row>=0&&U.row<ROWS.length&&lo){cyc(ROWS[U.row][0],-1);sfx('click',.6)}return true}
    if(c==='KeyD'||c==='ArrowRight'){if(U.row<0&&lo)U.row=0;else if(U.row>=0&&U.row<ROWS.length&&lo)cyc(ROWS[U.row][0],1);sfx('click',.6);return true}
    if(['KeyE','Space','Enter'].includes(c)&&!e.repeat){if(U.row>=0&&U.row<ROWS.length&&lo){cyc(ROWS[U.row][0],1);return true}sfx('click');go(U.sel);return true}
    return true}
  if(ty==='mousedown'||ty==='touchstart'){const t=e.changedTouches?e.changedTouches[0]:e;if(!t)return true;const p=toP(t);
    if(p.x>W-16&&p.y<14){MIS.ui=null;return true}
    for(let i=0;i<TT.length;i++){const y=LY+i*LH;if(p.x>=LX-2&&p.x<=LX+112&&p.y>=y-1&&p.y<=y+LH-2){if(U.sel!==i){pick(i);sfx('click')}return true}}
    const bx=PXr+PW-64,by=PY+PH+4;if(p.x>=bx&&p.x<=bx+64&&p.y>=by-2&&p.y<=by+12){sfx('click');go(U.sel);return true}
    if(!(U.sel===0||NOLO[U.sel]))ROWS.forEach(([k],j)=>{const y=PY+21+j*18;if(p.y>=y-1&&p.y<=y+16){U.row=j;if(p.x>=PXr+52&&p.x<=PXr+70){cyc(k,-1);sfx('click',.6)}else if(p.x>=PXr+PW-18&&p.x<=PXr+PW){cyc(k,1);sfx('click',.6)}}});
    return true}
  return ty!=='mousemove'};
})();
