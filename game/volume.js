// volume.js — настройки громкости (06.11, Natalia): общая, музыка, звуки, диалоги.
// Подключается последним. Ничего не переписывает в чужих файлах:
//  • музыка — обёртка updateMusic: громкость трека не выше MUS_VOL × общая × музыка;
//  • звуки и голоса — всё, что Web Audio подключает к динамикам, идёт через общий узел-регулятор своего AudioContext
//    (контекст голосов из voices.js → «диалоги», остальные → «звуки»).
// Значения хранятся в localStorage 'pp_vol'. Окно открывается из главного меню и из паузы (НАСТРОЙКИ), Esc — закрыть.
(function(){
'use strict';
const DEF={all:1,mus:1,sfx:1,vox:1};
const VOL=Object.assign({},DEF);
try{const s=JSON.parse(localStorage.getItem('pp_vol')||'null');if(s)for(const k in DEF)if(typeof s[k]==='number')VOL[k]=Math.max(0,Math.min(1,s[k]))}catch(e){}
function store(){try{localStorage.setItem('pp_vol',JSON.stringify(VOL))}catch(e){}}

// ---- звуки и голоса: перехват подключения к динамикам
const BUS=new Map();
let voiceAC=null;
function vAC(){if(voiceAC)return voiceAC;try{if(window.VOX&&VOX.ctx){const a=VOX.ctx();if(a)voiceAC=a}}catch(e){}return voiceAC}
function busGain(ctx){return VOL.all*(ctx===vAC()?VOL.vox:VOL.sfx)}
function busOf(ctx){let b=BUS.get(ctx);if(!b){b=ctx.createGain();b.gain.value=busGain(ctx);C0.call(b,ctx.destination);BUS.set(ctx,b)}return b}
const C0=AudioNode.prototype.connect;
AudioNode.prototype.connect=function(dst,...rest){
  try{if(dst&&typeof AudioDestinationNode!=='undefined'&&dst instanceof AudioDestinationNode)return C0.call(this,busOf(dst.context),...rest)}catch(e){}
  return C0.call(this,dst,...rest)};
function applyBus(){for(const [ctx,b] of BUS){try{b.gain.setTargetAtTime(busGain(ctx),ctx.currentTime,.02)}catch(e){b.gain.value=busGain(ctx)}}}

// ---- музыка
function musMax(){return (typeof MUS_VOL==='number'?MUS_VOL:.7)*VOL.all*VOL.mus}
function wrapMusic(){if(typeof updateMusic!=='function'||updateMusic.__vol)return;
  const u0=updateMusic;
  updateMusic=function(dt){u0(dt);const m=musMax();
    try{for(const k in MUS){const a=MUS[k];if(!a.paused&&a.volume>m)a.volume=m}}catch(e){}
    try{const A=C1.audio;if(A&&A.MOB&&A.MP&&A.VOLOK&&A.MP.volume>m)A.MP.volume=m}catch(e){}};
  updateMusic.__vol=1}
wrapMusic();setTimeout(wrapMusic,0);addEventListener('load',wrapMusic);
// главы иногда заменяют updateMusic уже после загрузки — проверяем обёртку раз в секунду
setInterval(wrapMusic,1000);

// ---- окно настроек
let box=null,sel=0;
const ROWS=[['all','Общая громкость','#ffffff'],['mus','Музыка','#ff4fd8'],['sfx','Звуки в игре','#3ef0b0'],['vox','Диалоги (голоса)','#ffd23a']];
function pct(v){return Math.round(v*100)+'%'}
function paint(){if(!box)return;ROWS.forEach(([k],i)=>{const r=box.querySelector('#vr_'+k),l=box.querySelector('#vl_'+k),row=box.querySelector('#vw_'+k);
  if(r&&+r.value!==Math.round(VOL[k]*100))r.value=Math.round(VOL[k]*100);if(l)l.textContent=pct(VOL[k]);if(row)row.style.background=i===sel?'rgba(255,255,255,.08)':'transparent'})}
function set(k,v){VOL[k]=Math.max(0,Math.min(1,v));store();applyBus();paint()}
let testT=0;
function test(k){const t=performance.now();if(t-testT<180)return;testT=t;
  try{if(k==='vox'){if(window.VOX&&VOX.syl){const w='при-вет';[...'ривет'].forEach((ch,i)=>setTimeout(()=>{try{VOX.syl('m',ch,'',i===0)}catch(e){}},i*85))}}else if(k!=='mus'&&C1.X&&C1.X.sfx)C1.X.sfx('click',1.2)}catch(e){}}
function open(){if(box)return;sel=0;
  box=document.createElement('div');box.id='volbox';
  box.style.cssText='position:fixed;inset:0;z-index:99;background:rgba(8,5,16,.9);display:flex;align-items:center;justify-content:center;font:15px "Trebuchet MS",Verdana,sans-serif;color:#fff';
  let h='<div style="width:min(92vw,520px);background:#1a1228;border:2px solid #ff4fd8;box-shadow:0 0 18px rgba(255,79,216,.45);border-radius:8px;padding:16px 18px;box-sizing:border-box">'+
    '<div style="font-weight:bold;font-size:19px;color:#ff4fd8;letter-spacing:1px;margin-bottom:12px">НАСТРОЙКИ · ЗВУК</div>';
  for(const [k,t,c] of ROWS)h+='<div id="vw_'+k+'" style="display:flex;align-items:center;gap:10px;padding:7px 6px;border-radius:5px">'+
    '<div style="flex:0 0 150px;color:'+c+';font-weight:bold;font-size:14px">'+t+'</div>'+
    '<input id="vr_'+k+'" type="range" min="0" max="100" step="5" style="flex:1;accent-color:'+c+';height:22px;cursor:pointer">'+
    '<div id="vl_'+k+'" style="flex:0 0 44px;text-align:right;font-size:14px;color:#e8e0f8"></div></div>';
  h+='<div style="display:flex;gap:10px;margin-top:14px">'+
    '<button id="vb_def" style="flex:1;padding:9px;background:#0c0814;color:#bdb4d4;border:1px solid #6a5a8a;border-radius:5px;font-weight:bold;font-size:14px;font-family:inherit;cursor:pointer">Сбросить</button>'+
    '<button id="vb_ok" style="flex:2;padding:9px;background:#ff4fd8;color:#1a0a20;border:0;border-radius:5px;font-weight:bold;font-size:15px;font-family:inherit;cursor:pointer">Готово</button></div>'+
    '<div style="margin-top:10px;font-size:12px;color:#8a80a8">Мышь или пальцем по ползунку · W/S — строка, A/D — громкость · Esc — закрыть</div></div>';
  box.innerHTML=h;document.body.appendChild(box);
  for(const [k] of ROWS){const r=box.querySelector('#vr_'+k);r.addEventListener('input',()=>{set(k,r.value/100);test(k)})}
  box.querySelector('#vb_def').onclick=()=>{Object.assign(VOL,DEF);store();applyBus();paint()};
  box.querySelector('#vb_ok').onclick=close;
  box.addEventListener('mousedown',e=>{if(e.target===box)close()});
  paint();try{C1.X.sfx('click')}catch(e){}}
function close(){if(!box)return;box.remove();box=null;try{C1.X.sfx('click')}catch(e){}}
function key(e){if(e.type!=='keydown')return;const c=e.code,k=ROWS[sel][0];
  if(c==='Escape'||c==='Enter'||c==='KeyE'){if(!e.repeat)close();return}
  if(c==='KeyW'||c==='ArrowUp'){sel=(sel+ROWS.length-1)%ROWS.length;paint();return}
  if(c==='KeyS'||c==='ArrowDown'){sel=(sel+1)%ROWS.length;paint();return}
  if(c==='KeyA'||c==='ArrowLeft'){set(k,Math.round(VOL[k]*20-1)/20);test(k);return}
  if(c==='KeyD'||c==='ArrowRight'){set(k,Math.round(VOL[k]*20+1)/20);test(k);return}}
// пока окно открыто, игра не получает ввод; клавиатурой управляем сами
(window.__pre=window.__pre||[]).unshift(function(e){if(!box)return false;if(e.type==='keydown'){key(e);return true}if(e.type==='keyup')return true;return 'own'});

window.VOLUI={open,close,get on(){return !!box},VOL,set};
})();
