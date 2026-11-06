// settings.js — экран «НАСТРОЙКИ» (06.11, Natalia): звук, экран, игра, управление, прочее.
// Подключается последним (заменяет volume.js). Окно открывается из главного меню и из паузы.
// Хранение: pp_vol — громкость, pp_set — остальные настройки, pp_keys — свои клавиши, pp_seen — прочитанные реплики.
// В чужих файлах — только точечные проверки SETT.get(...): level1.js (автоприцел, очки, стрелки), voices.js (приглушение),
// cineshots.js (вспышки), save.js (сброс прогресса не трогает настройки).
(function(){
'use strict';
const LSg=k=>{try{return localStorage.getItem(k)}catch(e){return null}},LSs=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const rd=(k,d)=>{try{const v=JSON.parse(LSg(k)||'null');return v&&typeof v==='object'?v:d}catch(e){return d}};

// ======================= ЗНАЧЕНИЯ =======================
const VDEF={all:1,mus:1,sfx:1,vox:1};
const VOL=Object.assign({},VDEF,rd('pp_vol',{}));for(const k in VDEF)VOL[k]=Math.max(0,Math.min(1,+VOL[k]||0));
const SDEF={hshad:0,shake:1,flash:1,txt:1,tspd:1,skip:0,aim:1,pts:1,arrows:1,radar:1,stk:1,lefty:0,duck:1,bg:1};
const SET=Object.assign({},SDEF,rd('pp_set',{}));
const KEYS=rd('pp_keys',{}); // действие → своя клавиша (code)
function saveVol(){LSs('pp_vol',JSON.stringify(VOL))}
function saveSet(){LSs('pp_set',JSON.stringify(SET))}
function saveKeys(){LSs('pp_keys',JSON.stringify(KEYS))}
const SETT={get:k=>k in SET?SET[k]:SDEF[k],SET,VOL,KEYS};window.SETT=SETT;

// ======================= ЗВУК =======================
// всё, что Web Audio подключает к динамикам, идёт через регулятор своего контекста: контекст голосов → «диалоги», остальные → «звуки»
const BUS=new Map();let voiceAC=null;
function vAC(){if(voiceAC)return voiceAC;try{if(window.VOX&&VOX.ctx){const a=VOX.ctx();if(a)voiceAC=a}}catch(e){}return voiceAC}
function silent(){return !SET.bg&&document.hidden}
function busGain(ctx){return silent()?0:VOL.all*(ctx===vAC()?VOL.vox:VOL.sfx)}
const C0=AudioNode.prototype.connect;
function busOf(ctx){let b=BUS.get(ctx);if(!b){b=ctx.createGain();b.gain.value=busGain(ctx);C0.call(b,ctx.destination);BUS.set(ctx,b)}return b}
AudioNode.prototype.connect=function(dst,...rest){
  try{if(dst&&typeof AudioDestinationNode!=='undefined'&&dst instanceof AudioDestinationNode)return C0.call(this,busOf(dst.context),...rest)}catch(e){}
  return C0.call(this,dst,...rest)};
function applyBus(){for(const [ctx,b] of BUS){const g=busGain(ctx);try{b.gain.setTargetAtTime(g,ctx.currentTime,.02)}catch(e){b.gain.value=g}}}
document.addEventListener('visibilitychange',applyBus);
function musMax(){return silent()?0:(typeof MUS_VOL==='number'?MUS_VOL:.7)*VOL.all*VOL.mus}
function wrapMusic(){if(typeof updateMusic!=='function'||updateMusic.__vol)return;const u0=updateMusic;
  updateMusic=function(dt){u0(dt);const m=musMax();
    try{for(const k in MUS){const a=MUS[k];if(!a.paused&&a.volume>m)a.volume=m}}catch(e){}
    try{const A=C1.audio;if(A&&A.MOB&&A.MP){if(A.VOLOK&&A.MP.volume>m)A.MP.volume=m;if(!A.VOLOK)A.MP.muted=(typeof muted!=='undefined'&&muted)||silent()||VOL.mus*VOL.all===0}}catch(e){}};
  updateMusic.__vol=1}
wrapMusic();addEventListener('load',wrapMusic);setInterval(wrapMusic,1000);

// ======================= ЭКРАН =======================
// тряска и вспышка урона: рост значения гасится коэффициентом, затухание — как было
function damp(obj,key,kf){if(!obj)return;const d=Object.getOwnPropertyDescriptor(obj,key);if(d&&d.get)return;let raw=+obj[key]||0;
  try{Object.defineProperty(obj,key,{configurable:true,enumerable:true,get(){return raw},set(v){v=+v||0;raw=v>raw?raw+(v-raw)*kf():v}})}catch(e){}}
const kShake=()=>SET.shake,kFlash=()=>SET.flash;
try{damp(window.C1,'shake',kShake);damp(window.C1,'hurt',kFlash)}catch(e){}
try{if(typeof S==='object')damp(S,'shake',kShake)}catch(e){}
try{if(typeof playCut==='function'){const pc=playCut;playCut=function(){const r=pc.apply(this,arguments);try{damp(cut,'shake',kShake)}catch(e){}return r}}}catch(e){}
// размер текста в диалогах
let inDlg=false;
try{const uf=uiFont;uiFont=function(sz,b){return uf(inDlg&&sz>=5.5?sz*SET.txt:sz,b)}}catch(e){}
function wrapDlg(){try{if(typeof renderDlg!=='function'||renderDlg.__set)return;const r0=renderDlg;renderDlg=function(){inDlg=true;try{return r0.apply(this,arguments)}finally{inDlg=false}};renderDlg.__set=1}catch(e){}}
wrapDlg();setInterval(wrapDlg,1000);
// тени-кружки под героями и людьми (06.11 Natalia: «странно выглядит») — по умолчанию выкл; под зомби и машинами (r≥10) остаются
try{if(typeof shadowBlob==='function'){const sb0=shadowBlob;
  shadowBlob=function(x,y,r){if(SET.hshad||r>=10)return sb0(x,y,r);
    try{const L=C1.engine&&C1.engine.L;if(L&&L.zs)for(const z of L.zs)if(z.x===x&&z.y===y&&!z.ally)return sb0(x,y,r)}catch(e){}}}}catch(e){}
function isFull(){return !!(document.fullscreenElement||document.webkitFullscreenElement)}
function toggleFull(){try{if(isFull())(document.exitFullscreen||document.webkitExitFullscreen).call(document);else{const el=document.documentElement;(el.requestFullscreen||el.webkitRequestFullscreen).call(el)}}catch(e){}}

// ======================= ИГРА: скорость текста, прочитанное, радар =======================
const SEEN=new Set();try{for(const h of JSON.parse(LSg('pp_seen')||'[]'))SEEN.add(h)}catch(e){}
let seenDirty=false;
function hs(w,t){let h=0;const s=w+'|'+t;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h}
setInterval(()=>{if(!seenDirty)return;seenDirty=false;let a=[...SEEN];if(a.length>6000)a=a.slice(-6000);LSs('pp_seen',JSON.stringify(a))},3000);
let lastDlg=null,lastI=-1,lastShown=0;
function dlgTick(){let D=null;try{D=dlg}catch(e){return}
  if(!D||!D.lines){lastDlg=null;return}
  if(D!==lastDlg){lastDlg=D;lastI=-1;
    if(SET.skip&&D.lines.length&&D.lines.every(l=>SEEN.has(hs(l.w,l.t)))&&typeof skipDlg==='function'){skipDlg();lastDlg=null;return}}
  const L=D.lines[D.i];if(!L)return;
  if(D.i!==lastI){lastI=D.i;lastShown=D.shown;const h=hs(L.w,L.t);if(!SEEN.has(h)){SEEN.add(h);seenDirty=true}return}
  if(D.shown>lastShown&&D.shown<L.t.length){const k=SET.tspd;if(k>=9)D.shown=L.t.length;else if(k!==1)D.shown=Math.min(L.t.length,lastShown+(D.shown-lastShown)*k)}
  lastShown=D.shown}
try{const up0=update;update=function(dt){up0(dt);try{dlgTick()}catch(e){}try{if(!SET.radar&&window.C1)C1.radarOff=Math.max(C1.radarOff||0,.15)}catch(e){}}}catch(e){}

// ======================= УПРАВЛЕНИЕ: стики =======================
function tpt(t){return{x:(t.clientX-OX)/SC,y:(t.clientY-OY)/SC}}
const playing=()=>{try{return state==='play'&&!dlg&&!cut}catch(e){return false}};
addEventListener('touchstart',e=>{if(!SET.lefty||!playing())return;try{
  for(const t of e.changedTouches){const p=tpt(t);
    if(touch.mv&&touch.mv.id===t.identifier&&!touch.aim){touch.aim={id:t.identifier,ox:p.x,oy:p.y,x:p.x,y:p.y,t:performance.now(),moved:false};touch.mv=null}
    else if(touch.aim&&touch.aim.id===t.identifier&&!touch.aim.moved&&!touch.mv&&p.x>=W/2){touch.mv={id:t.identifier,ox:p.x,oy:p.y,x:p.x,y:p.y};touch.aim=null}}}catch(err){}},{passive:true});
addEventListener('touchmove',e=>{if(SET.stk===1)return;try{for(const t of e.changedTouches){if(touch.mv&&touch.mv.id===t.identifier){const p=tpt(t);touch.mv.x=touch.mv.ox+(p.x-touch.mv.ox)*SET.stk;touch.mv.y=touch.mv.oy+(p.y-touch.mv.oy)*SET.stk}}}catch(err){}},{passive:true});

// ======================= УПРАВЛЕНИЕ: свои клавиши =======================
const ACTS=[['up','Вверх','KeyW'],['down','Вниз','KeyS'],['left','Влево','KeyA'],['right','Вправо','KeyD'],['act','Действие / взять','KeyE'],
  ['dash','Рывок','ShiftLeft'],['kick','Пинок','KeyV'],['sneak','Тихий шаг','KeyC'],['reload','Перезарядка','KeyR'],['next','Следующее оружие','KeyQ'],
  ['w1','Оружие 1','Digit1'],['w2','Оружие 2','Digit2'],['w3','Оружие 3','Digit3'],['mol','Молотов','KeyF'],['heal','Лечение','KeyH'],['pot','Зелье','KeyJ'],
  ['beer','Пиво','KeyB'],['stim','Стимулятор','KeyX'],['gren','Граната','KeyG'],['trap','Ловушка','KeyZ'],['vape','Вейп','KeyK'],['trip','Растяжка','KeyT'],
  ['barr','Баррикада','KeyY'],['light','Фонарик','KeyL'],['inv','Рюкзак','KeyI'],['pause','Пауза','KeyP'],['skip','Пропустить диалог','Tab'],['mute','Звук вкл/выкл','KeyM']];
const DEF=Object.fromEntries(ACTS.map(a=>[a[0],a[2]]));
const keyOf=a=>KEYS[a]||DEF[a];
let MAP=null; // физическая клавиша → клавиша, которую ждёт игра (null — никакая)
function buildMap(){MAP={};for(const [a] of ACTS){const k=keyOf(a);if(k!==DEF[a])MAP[k]=DEF[a]}
  for(const [a] of ACTS){const d=DEF[a];if(keyOf(a)!==d&&!(d in MAP))MAP[d]=null}}
buildMap();
function keyName(c){if(!c)return '—';if(/^Key/.test(c))return c.slice(3);if(/^Digit/.test(c))return c.slice(5);if(/^Numpad/.test(c))return 'Num'+c.slice(6);
  return {ShiftLeft:'Shift',ShiftRight:'Shift (пр.)',ControlLeft:'Ctrl',ControlRight:'Ctrl (пр.)',AltLeft:'Alt',AltRight:'Alt (пр.)',Space:'Пробел',Tab:'Tab',Enter:'Enter',
    Backquote:'`',Minus:'-',Equal:'=',BracketLeft:'[',BracketRight:']',Semicolon:';',Quote:"'",Comma:',',Period:'.',Slash:'/',Backslash:'\\',CapsLock:'Caps',
    ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→'}[c]||c}
function keyChar(c){if(/^Key/.test(c))return c.slice(3).toLowerCase();if(/^Digit/.test(c))return c.slice(5);return {Space:' ',Tab:'Tab',ShiftLeft:'Shift',ShiftRight:'Shift',Enter:'Enter'}[c]||c}

// ======================= ОКНО =======================
let box=null,tab='snd',sel=0,wait=null,confirmReset=false;
const TABS=[['snd','ЗВУК'],['scr','ЭКРАН'],['game','ИГРА'],['ctl','УПРАВЛЕНИЕ'],['etc','ПРОЧЕЕ']];
const SL=[['all','Общая громкость','#ffffff'],['mus','Музыка','#ff4fd8'],['sfx','Звуки в игре','#3ef0b0'],['vox','Диалоги (голоса)','#ffd23a']];
const CH={ // [ключ, подпись, варианты [значение, надпись], пояснение]
  snd:[['duck','Тише музыка во время диалогов',[[1,'Да'],[0,'Нет']]],['bg','Звук, когда игра свёрнута',[[1,'Играет'],[0,'Тишина']]]],
  scr:[['full','Полный экран',[[1,'Вкл'],[0,'Выкл']],'F11 или Alt+Enter в ПК-версии'],['shake','Тряска экрана',[[1,'Полная'],[.4,'Слабая'],[0,'Выкл']]],
    ['flash','Вспышки (урон, взрывы в роликах)',[[1,'Обычные'],[.35,'Мягкие']]],['txt','Размер текста в диалогах',[[1,'100%'],[1.15,'115%'],[1.3,'130%']]],['hshad','Тени под героями',[[0,'Выкл'],[1,'Вкл']],'Под зомби и машинами тени остаются']],
  game:[['tspd','Скорость текста',[[.6,'Медленно'],[1,'Обычно'],[2,'Быстро'],[99,'Сразу']]],['skip','Пропускать прочитанные диалоги',[[0,'Нет'],[1,'Да']],'Удобно, когда участок переигрывается после смерти'],
    ['aim','Автоприцел (телефон)',[[0,'Выкл'],[1,'Слабый'],[2,'Сильный']]],['pts','Очки над зомби',[[1,'Показывать'],[0,'Скрыть']]],
    ['arrows','Стрелки к последним зомби',[[1,'Показывать'],[0,'Скрыть']]],['radar','Радар-миникарта',[[1,'Показывать'],[0,'Скрыть']]]],
  ctl:[['stk','Чувствительность стика (телефон)',[[.75,'Низкая'],[1,'Обычная'],[1.4,'Высокая']]],['lefty','Стики для левши (телефон)',[[0,'Нет'],[1,'Да']],'Ходьба — правой рукой, прицел — левой']],
};
const css={btn:'padding:6px 10px;border-radius:5px;border:1px solid #4a3a64;background:#0c0814;color:#d8d0ec;font-weight:bold;font-size:13px;font-family:inherit;cursor:pointer;white-space:nowrap',
  on:'background:#ff4fd8;color:#1a0a20;border-color:#ff4fd8'};
function rows(){if(tab==='snd')return SL.length+CH.snd.length;if(tab==='ctl')return CH.ctl.length+ACTS.length+1;if(tab==='etc')return 1;return (CH[tab]||[]).length}
function val(k){return k==='full'?(isFull()?1:0):SET[k]}
function setv(k,v){if(k==='full'){if(!!v!==isFull())toggleFull();setTimeout(paint,250);return}SET[k]=v;saveSet();applyBus();paint()}
function setVol(k,v){VOL[k]=Math.max(0,Math.min(1,v));saveVol();applyBus();paint()}
let testT=0;
function test(k){const t=performance.now();if(t-testT<180)return;testT=t;
  try{if(k==='vox'){if(window.VOX&&VOX.syl)[...'ривет'].forEach((ch,i)=>setTimeout(()=>{try{VOX.syl('m',ch,'',i===0)}catch(e){}},i*85))}else if(k!=='mus'&&C1.X&&C1.X.sfx)C1.X.sfx('click',1.2)}catch(e){}}
function choiceRow(i,[k,t,opts,hint]){
  const cur=val(k);let h='<div data-row="'+i+'" style="display:flex;align-items:center;gap:8px;padding:6px;border-radius:5px;flex-wrap:wrap">'+
    '<div style="flex:1 1 180px;font-size:14px;font-weight:bold;color:#e8e0f8">'+t+(hint?'<div style="font-weight:normal;font-size:11px;color:#8a80a8">'+hint+'</div>':'')+'</div><div style="display:flex;gap:4px;flex-wrap:wrap">';
  for(const [v,n] of opts)h+='<button data-k="'+k+'" data-v="'+v+'" style="'+css.btn+(cur==v?';'+css.on:'')+'">'+n+'</button>';
  return h+'</div></div>'}
function body(){let h='';
  if(tab==='snd'){SL.forEach(([k,t,c],i)=>{h+='<div data-row="'+i+'" style="display:flex;align-items:center;gap:10px;padding:6px;border-radius:5px">'+
      '<div style="flex:0 0 140px;color:'+c+';font-weight:bold;font-size:14px">'+t+'</div>'+
      '<input data-vol="'+k+'" type="range" min="0" max="100" step="5" value="'+Math.round(VOL[k]*100)+'" style="flex:1;min-width:80px;accent-color:'+c+';height:22px;cursor:pointer">'+
      '<div style="flex:0 0 42px;text-align:right;font-size:14px">'+Math.round(VOL[k]*100)+'%</div></div>'});
    CH.snd.forEach((r,j)=>h+=choiceRow(SL.length+j,r))}
  else if(tab==='ctl'){CH.ctl.forEach((r,j)=>h+=choiceRow(j,r));const n0=CH.ctl.length;
    h+='<div style="margin:10px 6px 4px;font-size:13px;color:#ff9ae8;font-weight:bold">КЛАВИШИ (ПК) · нажми на клавишу, потом новую · Esc — отмена</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:2px 10px">';
    ACTS.forEach(([a,t],j)=>{const k=keyOf(a),own=k!==DEF[a],w=wait===a;
      h+='<div data-row="'+(n0+j)+'" style="display:flex;align-items:center;justify-content:space-between;gap:6px;padding:3px 6px;border-radius:5px"><span style="font-size:13px;color:#d8d0ec">'+t+'</span>'+
        '<button data-key="'+a+'" style="'+css.btn+';min-width:74px;'+(w?css.on:own?'color:#ffd23a;border-color:#ffd23a':'')+'">'+(w?'жми…':keyName(k))+'</button></div>'});
    h+='</div><div data-row="'+(n0+ACTS.length)+'" style="padding:8px 6px"><button data-a="keyreset" style="'+css.btn+'">Вернуть клавиши по умолчанию</button></div>'+
      '<div style="font-size:11px;color:#8a80a8;padding:0 6px">Стрелки, мышь, Esc, F5 и пункты меню (W/S, E) работают как раньше, если не переназначены.</div>'}
  else if(tab==='etc'){h+='<div data-row="0" style="padding:8px 6px"><div style="font-size:14px;font-weight:bold;color:#ff9aaa;margin-bottom:4px">Сбросить прогресс</div>'+
      '<div style="font-size:12px;color:#bdb4d4;margin-bottom:8px">Удалит сохранение, оружейную, рубли, коллекции и достижения. Настройки и клавиши останутся. Перед сбросом можно скопировать код сохранения.</div>'+
      '<button data-a="reset" style="'+css.btn+';border-color:#ff5a7a;color:#ff9aaa">Сбросить прогресс…</button></div>'+
      '<div style="padding:8px 6px;font-size:12px;color:#8a80a8">Язык: пока только русский.</div>'}
  else (CH[tab]||[]).forEach((r,j)=>h+=choiceRow(j,r));
  return h}
function paint(){if(!box)return;
  const tb=box.querySelector('#st_tabs');tb.innerHTML=TABS.map(([k,t])=>'<button data-tab="'+k+'" style="'+css.btn+';font-size:12px;'+(k===tab?css.on:'')+'">'+t+'</button>').join('');
  const b=box.querySelector('#st_body'),sc=b.scrollTop;b.innerHTML=body();b.scrollTop=sc;
  const r=b.querySelector('[data-row="'+sel+'"]');if(r){r.style.background='rgba(255,255,255,.08)';if(!wait)r.scrollIntoView({block:'nearest'})}
  for(const inp of b.querySelectorAll('input[data-vol]')){const k=inp.dataset.vol;inp.addEventListener('input',()=>{VOL[k]=inp.value/100;saveVol();applyBus();inp.nextSibling.textContent=inp.value+'%';test(k)})}}
function open(t){if(box)return;tab=t||'snd';sel=0;wait=null;
  box=document.createElement('div');box.id='volbox';
  box.style.cssText='position:fixed;inset:0;z-index:99;background:rgba(8,5,16,.9);display:flex;align-items:center;justify-content:center;font:15px "Trebuchet MS",Verdana,sans-serif;color:#fff';
  box.innerHTML='<div style="width:min(94vw,640px);max-height:92vh;display:flex;flex-direction:column;background:#1a1228;border:2px solid #ff4fd8;box-shadow:0 0 18px rgba(255,79,216,.45);border-radius:8px;padding:14px 16px;box-sizing:border-box">'+
    '<div style="font-weight:bold;font-size:19px;color:#ff4fd8;letter-spacing:1px;margin-bottom:8px">НАСТРОЙКИ</div>'+
    '<div id="st_tabs" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px"></div>'+
    '<div id="st_body" style="overflow:auto;flex:1;min-height:120px"></div>'+
    '<div style="display:flex;gap:10px;margin-top:10px;align-items:center"><div style="flex:1;font-size:11px;color:#8a80a8">Q / E — вкладки · W/S — строка · A/D — изменить · Esc — закрыть</div>'+
    '<button data-a="ok" style="padding:9px 26px;background:#ff4fd8;color:#1a0a20;border:0;border-radius:5px;font-weight:bold;font-size:15px;font-family:inherit;cursor:pointer">Готово</button></div></div>';
  document.body.appendChild(box);
  box.addEventListener('click',e=>{const el=e.target.closest('button');if(!el)return;const d=el.dataset;
    if(d.tab){tab=d.tab;sel=0;wait=null;paint();return}
    if(d.k){setv(d.k,+d.v);return}
    if(d.key){wait=wait===d.key?null:d.key;paint();return}
    if(d.a==='ok'){close();return}
    if(d.a==='keyreset'){for(const k in KEYS)delete KEYS[k];saveKeys();buildMap();paint();return}
    if(d.a==='reset'){close();if(window.SAVEP&&SAVEP.openNew)SAVEP.openNew();return}});
  box.addEventListener('mousedown',e=>{if(e.target===box)close()});
  paint();try{C1.X.sfx('click')}catch(e){}}
function close(){if(!box)return;box.remove();box=null;wait=null;try{C1.X.sfx('click')}catch(e){}}
function bind(a,code){for(const [b] of ACTS)if(b!==a&&keyOf(b)===code){KEYS[b]=keyOf(a);if(KEYS[b]===DEF[b])delete KEYS[b]} // обмен, если клавиша занята
  if(code===DEF[a])delete KEYS[a];else KEYS[a]=code;saveKeys();buildMap()}
function rowInfo(){if(tab==='snd'){if(sel<SL.length)return{vol:SL[sel][0]};return{ch:CH.snd[sel-SL.length]}}
  if(tab==='ctl'){if(sel<CH.ctl.length)return{ch:CH.ctl[sel]};const j=sel-CH.ctl.length;return j<ACTS.length?{key:ACTS[j][0]}:{btn:'keyreset'}}
  if(tab==='etc')return{btn:'reset'};return{ch:(CH[tab]||[])[sel]}}
function key(e){if(e.type!=='keydown')return;const c=e.code;
  if(wait){if(c==='Escape'){wait=null;paint();return}if(['F5','F11','F12','MetaLeft','MetaRight'].includes(c))return;bind(wait,c);wait=null;paint();return}
  if(c==='Escape'){if(!e.repeat)close();return}
  const n=rows(),ri=rowInfo();
  if(c==='KeyQ'||c==='KeyE'){const i=TABS.findIndex(t=>t[0]===tab);tab=TABS[(i+(c==='KeyQ'?TABS.length-1:1))%TABS.length][0];sel=0;paint();return}
  if(c==='KeyW'||c==='ArrowUp'){sel=(sel+n-1)%n;paint();return}
  if(c==='KeyS'||c==='ArrowDown'){sel=(sel+1)%n;paint();return}
  const dir=(c==='KeyA'||c==='ArrowLeft')?-1:(c==='KeyD'||c==='ArrowRight')?1:0;
  if(dir&&ri.vol){setVol(ri.vol,Math.round(VOL[ri.vol]*20+dir)/20);test(ri.vol);return}
  if(dir&&ri.ch){const [k,,opts]=ri.ch;const i=opts.findIndex(o=>o[0]==val(k));const j=Math.max(0,Math.min(opts.length-1,(i<0?0:i)+dir));setv(k,opts[j][0]);return}
  if(c==='Enter'||c==='Space'){if(ri.key){wait=ri.key;paint()}else if(ri.btn){const b=box.querySelector('[data-a="'+ri.btn+'"]');if(b)b.click()}}}

// ======================= ВВОД =======================
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA')&&t.type!=='range'};
(window.__pre=window.__pre||[]).unshift(function(e){
  if(box){if(e.type==='keydown'){key(e);return true}if(e.type==='keyup')return true;return 'own'}
  // свои клавиши: подменяем нажатие на то, которое ждёт игра
  if((e.type==='keydown'||e.type==='keyup')&&!e.__rm&&MAP&&(e.code in MAP)&&!typing(e)&&!document.getElementById('savebox')){
    const to=MAP[e.code];if(to){const ev=new KeyboardEvent(e.type,{code:to,key:keyChar(to),repeat:e.repeat,shiftKey:e.shiftKey,ctrlKey:e.ctrlKey,altKey:e.altKey,bubbles:true,cancelable:true});
      ev.__rm=1;window.dispatchEvent(ev)}
    return true}
  return false});
// Alt+Enter в браузере — тоже полный экран (в ПК-версии это делает само приложение)
addEventListener('keydown',e=>{if(e.code==='Enter'&&e.altKey&&!navigator.userAgent.includes('Electron')){toggleFull();e.preventDefault()}},true);

window.SETUI={open,close,get on(){return !!box}};
window.VOLUI={open:()=>open('snd'),close,get on(){return !!box},VOL,set:setVol}; // меню и пауза открывают через VOLUI
})();
