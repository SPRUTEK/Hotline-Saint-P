// voices.js — голоса и музыка диалогов (03.11).
// 1) Неразборчивое «бормотание»: пока печатается реплика, звучат слоги. Источник — пила на высоте голоса,
//    два полосовых фильтра (форманты гласной из текста) и короткий шум на согласных. У каждого персонажа свой голос.
// 2) Музыка во время реплик приглушается (ducking).
// 3) Диалог в игре (не в кат-сцене) идёт под один трек главы — без скачков.
// Позже голоса можно заменить нарезкой из записей: VOX.sample[key]=[AudioBuffer,...].
(function(){
'use strict';
// ---------- голоса: f — высота (Гц), sp — слог каждые N букв, w — форма волны, br — «хрипотца» (шум), vib — дрожание, gl — скольжение высоты, k — громкость, t — особый тембр
const V={
  m:{f:112,sp:2,w:'sawtooth',br:.18,vib:.02,k:1},            // Микроб: низкий, с хрипотцой
  s:{f:265,sp:2,w:'sawtooth',br:.05,vib:.03,gl:.06,k:.9},    // Шмакодявка: звонкая, быстрая
  c:{f:420,sp:3,w:'triangle',t:'meow',k:.8},C:{f:300,sp:3,w:'sawtooth',t:'meow',br:.2,k:.9},w:{f:520,sp:3,w:'triangle',t:'meow',k:.7},al:{f:470,sp:3,w:'triangle',t:'meow',k:.7},M:{f:330,sp:3,w:'sawtooth',t:'meow',k:.8},
  a:{f:98,sp:2,w:'sawtooth',br:.08,k:1},                     // Анис: густой бас
  za:{f:70,sp:3,w:'sawtooth',t:'growl',br:.5,k:1},rq:{f:150,sp:3,w:'sawtooth',t:'growl',br:.5,k:.9},K:{f:80,sp:3,w:'sawtooth',t:'growl',br:.4,k:1},ls:{f:65,sp:3,w:'sawtooth',t:'growl',br:.6,k:1},
  h:{f:215,sp:2,w:'sawtooth',vib:.05,k:.85},H:{f:200,sp:2,w:'square',br:.06,k:.75},          // Ханжа: командный голос
  G:{f:96,sp:2,w:'sawtooth',br:.15,k:.95},g:{f:96,sp:2,w:'sawtooth',br:.15,k:.95},D:{f:120,sp:2,w:'sawtooth',br:.25,vib:.05,k:.9},d:{f:120,sp:2,w:'sawtooth',br:.25,k:.9},
  r:{f:175,sp:2,w:'square',t:'radio',k:.7},n:{f:150,sp:2,w:'square',t:'radio',k:.7},P:{f:105,sp:2,w:'sawtooth',br:.2,k:.9},A:{f:180,sp:2,w:'sawtooth',k:.85},
  val:{f:135,sp:2,w:'sawtooth',br:.1,gl:.05,k:.95},ol:{f:240,sp:2,w:'sawtooth',vib:.04,k:.85},vd:{f:150,sp:2,w:'square',k:.75},
  st:{f:88,sp:2,w:'sawtooth',br:.12,vib:.08,t:'drunk',k:1},pa:{f:104,sp:2,w:'sawtooth',br:.1,k:.95},ma:{f:215,sp:2,w:'sawtooth',vib:.06,k:.85},
  e:{f:140,sp:2,w:'sawtooth',gl:.1,vib:.05,k:.9},du:{f:116,sp:2,w:'sawtooth',br:.12,k:.95},dh:{f:116,sp:2,w:'sawtooth',br:.12,k:.95},lx:{f:165,sp:2,w:'square',gl:.08,k:.75},
  pw:{f:235,sp:2,w:'triangle',vib:.05,k:.9},bm:{f:118,sp:2,w:'sawtooth',k:.9},ak:{f:132,sp:2,w:'sawtooth',k:.9},hr:{f:145,sp:2,w:'square',k:.75},
  ska:{f:80,sp:2,w:'sawtooth',br:.1,k:1.05},vel:{f:124,sp:2,w:'sawtooth',br:.08,k:.95},sat:{f:250,sp:2,w:'sawtooth',vib:.03,gl:.04,k:.85},kt:{f:230,sp:2,w:'square',vib:.02,br:.05,k:.9},bh:{f:92,sp:2,w:'square',br:.15,k:.85},
  V:{f:120,sp:2,w:'sawtooth',t:'growl',br:.2,k:.9},B:{f:100,sp:2,w:'sawtooth',t:'growl',br:.25,k:.9},
};
function voiceOf(k){if(V[k])return V[k];let h=0;for(const ch of String(k))h=(h*31+ch.charCodeAt(0))%997;return {f:100+(h%160),sp:2,w:h%2?'sawtooth':'square',br:.06,k:.85}}
// форманты гласных (Гц)
const FM={'а':[800,1250],'о':[500,900],'у':[350,700],'ы':[400,1500],'э':[550,1800],'е':[500,2000],'и':[300,2300],'я':[750,1600],'ю':[350,1400],'ё':[500,1000],a:[800,1250],o:[500,900],u:[350,700],e:[550,1800],i:[300,2300]};
let AC=null,MASTER=null,NB=null;
function ctx(){if(AC)return AC;try{AC=new (window.AudioContext||window.webkitAudioContext)();MASTER=AC.createGain();MASTER.gain.value=.16;MASTER.connect(AC.destination);
  NB=AC.createBuffer(1,AC.sampleRate*.3,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}catch(e){AC=null}return AC}
for(const ev of ['pointerdown','keydown','touchend'])addEventListener(ev,()=>{const a=ctx();if(a&&a.state==='suspended')a.resume().catch(()=>{})},true);
const isMuted=()=>{try{return typeof muted!=='undefined'&&muted}catch(e){return false}};
const VOX={on:true,V,sample:{},ctx:()=>ctx()};window.VOX=VOX;
function syl(key,ch,next,emph){const a=ctx();if(!a||a.state!=='running'||isMuted()||!VOX.on)return;VOX.n=(VOX.n||0)+1;const v=voiceOf(key),t=a.currentTime;
  // нарезка из записи (если когда-нибудь появится)
  const smp=VOX.sample[key];if(smp&&smp.length){VOX._end=VOX._end||{};if(t<(VOX._end[key]||0)-.02)return;const s=a.createBufferSource();s.buffer=smp[(Math.random()*smp.length)|0];VOX._end[key]=t+s.buffer.duration/(.97);s.playbackRate.value=.92+Math.random()*.16;const gg=a.createGain();gg.gain.value=(v.k||1)*2.6;s.connect(gg).connect(MASTER);s.start(t);return}
  const vow=FM[ch]||FM[next]||FM['а'],dur=v.t==='meow'?.13:.075+Math.random()*.02;
  const f0=v.f*(1+(Math.random()-.5)*.18+(emph?.12:0));
  const o=a.createOscillator();o.type=v.w||'sawtooth';o.frequency.setValueAtTime(f0,t);
  if(v.t==='meow'){o.frequency.setValueAtTime(f0*.8,t);o.frequency.linearRampToValueAtTime(f0*1.25,t+dur*.4);o.frequency.linearRampToValueAtTime(f0*.7,t+dur)}
  else if(v.gl)o.frequency.linearRampToValueAtTime(f0*(1+(Math.random()<.5?-1:1)*v.gl),t+dur);
  if(v.t==='drunk')o.frequency.linearRampToValueAtTime(f0*(.85+Math.random()*.1),t+dur);
  if(v.vib){const l=a.createOscillator(),lg=a.createGain();l.frequency.value=7+Math.random()*3;lg.gain.value=f0*v.vib;l.connect(lg).connect(o.frequency);l.start(t);l.stop(t+dur+.02)}
  const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime((v.k||1)*(emph?1.2:1),t+.008);g.gain.setValueAtTime((v.k||1)*.9,t+dur*.6);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  const out=a.createGain();out.gain.value=1;
  for(const [fq,q,gn] of [[vow[0],6,1],[vow[1],9,.55]]){const bp=a.createBiquadFilter();bp.type='bandpass';bp.frequency.value=fq*(v.f>200?1.12:1);bp.Q.value=q;const bg=a.createGain();bg.gain.value=gn*2.2;o.connect(bp).connect(bg).connect(g)}
  let last=g;
  if(v.t==='radio'){const hp=a.createBiquadFilter();hp.type='highpass';hp.frequency.value=700;const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;g.connect(hp).connect(lp);last=lp}
  if(v.t==='growl'){const ws=a.createWaveShaper();const c=new Float32Array(256);for(let i=0;i<256;i++){const x=i/128-1;c[i]=Math.tanh(x*4)}ws.curve=c;g.connect(ws);last=ws}
  last.connect(out);out.connect(MASTER);o.start(t);o.stop(t+dur+.03);
  // хрипотца / согласная: короткий шум
  const nz=(v.br||0)+(/[бвгджзйклмнпрстфхцчшщ]/.test(ch)?.25:0);if(nz>.05){const s=a.createBufferSource();s.buffer=NB;const hp=a.createBiquadFilter();hp.type='bandpass';hp.frequency.value=v.t==='growl'?400:2500+Math.random()*2500;hp.Q.value=1.2;
    const ng=a.createGain();ng.gain.setValueAtTime(nz*.5*(v.k||1),t);ng.gain.exponentialRampToValueAtTime(.001,t+.04+(v.t==='growl'?.06:0));s.connect(hp).connect(ng).connect(MASTER);s.start(t,Math.random()*.2);s.stop(t+.12)}}
VOX.syl=syl;
// ---------- музыка диалогов: один трек на главу (из треков этой же главы) ----------
const DLGM={1:'flat',2:'smoke',3:'trimtryam',4:'trancer',5:'melancholy',6:'tek2',7:'kupala_mud',8:'histplace',9:'kalinka',10:'lych'};VOX.DLGM=DLGM;
function chNow(){for(const n of [10,9,8,7,6,5,4,3,2]){const o=window['C'+n];if(o&&o.on)return n}return 1}
let lastT=0,prevMus=null,dlgTrack=null,lastDlg=null,lastLine=-1,lastN=0,duck=0;
const _up=update;
update=function(dt){_up(dt);
  let d=null;try{d=dlg}catch(e){}
  // вход/выход из диалога
  if(d&&d!==lastDlg){lastDlg=d;lastLine=-1;
    let inCut=false;try{inCut=!!cut}catch(e){}
    if(state==='play'&&!inCut&&!(window.MG&&MG.active)){const tr=DLGM[chNow()];if(tr&&MUS[tr]&&musCur!==tr){prevMus=musCur;dlgTrack=tr;music(tr)}}}
  if(!d&&lastDlg){lastDlg=null;if(dlgTrack&&musCur===dlgTrack&&prevMus){music(prevMus)}prevMus=null;dlgTrack=null}
  // слоги
  if(d){const L=d.lines[d.i];if(L){if(d.i!==lastLine){lastLine=d.i;lastN=0}const n=Math.floor(d.shown),txt=L.t||'',v=voiceOf(L.w);
      if(n>lastN){const now=performance.now()/1000,gap=v.t==='meow'?.17:v.t==='drunk'?.11:(v.sp>2?.12:.085);
        if(now-lastT>=gap){for(let i=n-1;i>=lastN;i--){const ch=(txt[i]||'').toLowerCase();if(!/[a-zа-яё]/.test(ch))continue;syl(L.w,ch,(txt[i+1]||'').toLowerCase(),/[!]/.test(txt.slice(i,i+10)));lastT=now;break}}lastN=n}}}
  // приглушение музыки во время реплик
  duck+=((d?1:0)-duck)*Math.min(1,dt*4);
  if(duck>.01&&!(window.SETT&&!SETT.get('duck'))){const lim=MUS_VOL*(1-.5*duck);try{const a=MUS[musCur];if(a&&!a.paused&&a.volume>lim)a.volume=lim}catch(e){}
    try{const A=C1.audio;if(A&&A.MOB&&A.MP&&A.MP.volume>lim)A.MP.volume=lim}catch(e){}}
};
})();
