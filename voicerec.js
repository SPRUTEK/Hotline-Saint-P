// voicerec.js — живые голоса (06.11): нарезка голосовых сообщений на «слоги», реплики звучат случайными кусочками.
// voice/<ключ>.mp3 — склейка кусочков, voice/voice.json — [начало, длина] каждого кусочка.
(function(){
'use strict';
if(!window.VOX)return;
let started=false;
async function load(){if(started)return;const a=VOX.ctx&&VOX.ctx();if(!a)return;started=true;
  try{const idx=await (await fetch('voice/voice.json')).json();
    for(const k in idx){try{const buf=await a.decodeAudioData(await (await fetch('voice/'+k+'.mp3')).arrayBuffer());const sr=buf.sampleRate,src=buf.getChannelData(0),out=[];
        for(const [st,len] of idx[k]){const n=Math.floor(len*sr),o=Math.floor(st*sr);if(n<200)continue;const b=a.createBuffer(1,n,sr);b.copyToChannel(src.subarray(o,o+n),0);out.push(b)}
        if(out.length){VOX.sample[k]=out;for(const [al,src2] of [['dh','du'],['mg','m']])if(src2===k)VOX.sample[al]=out}}catch(e){console.warn('voice',k,e)}}}catch(e){console.warn('voice idx',e)}}
// грузим после первого жеста (когда звук уже разрешён)
const go=()=>{setTimeout(load,300)};['pointerdown','keydown','touchstart'].forEach(ev=>window.addEventListener(ev,go,{once:true,passive:true}));
VOX.loadRec=load;
})();
