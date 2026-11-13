// combo.js — комбо-убийства до ×15 (06.11): чем выше серия, тем сильнее эффект убийства, новые цвета и свои слова.
// Без стоп-кадра (hitStop отключён в level1.js) — игра не замедляется.
(function(){
'use strict';
if(!window.C1)return;
const TAU=Math.PI*2;
// палитры ступеней 1..15
const PAL=[null,['#ffffff'],['#ffd23a'],['#ffd23a','#ffffff'],['#ff4fa3','#ffd23a'],['#ff4fa3','#ffd23a','#ffffff'],['#3affd8','#ff4fa3'],['#3affd8','#ff4fa3','#ffffff'],
  ['#a05aff','#3affd8','#ff4fa3'],['#a05aff','#3affd8','#ff4fa3','#ffd23a'],['#ff3a3a','#ffd23a','#5aff3a','#3affd8','#a05aff','#ff4fa3'],
  ['#ff3a3a','#ff9a2a','#ffe23a','#5aff3a','#3affd8','#4a7aff','#a05aff','#ff4fa3'],null,null,null,null];
for(let i=12;i<=15;i++)PAL[i]=PAL[11];
function UIX(){try{return u}catch(e){return null}}
const tier=n=>Math.max(1,Math.min(15,n|0));
C1.comboCol=function(n){n=tier(n);if(n<=1)return'#ffffff';if(n<=3)return'#ffd23a';if(n<=5)return'#ff4fa3';if(n<=7)return'#3affd8';if(n<=9)return'#a05aff';const P=PAL[11],k=Math.floor(performance.now()/90+n)%P.length;return P[k]};
const prev=C1.onKillAny;
C1.onKillAny=function(z){if(prev)prev.apply(this,arguments);
  try{const L=C1.engine&&C1.engine.L;if(!L||!L.fx||C1.mode!=='td'||C1._src==='ally')return;const S=L.score;const n=tier(S&&S.cb||1);if(n<2)return;
    const P=PAL[n],x=z.x,y=z.y,cnt=Math.min(90,6+n*5);
    // искры
    for(let i=0;i<cnt;i++){const a=Math.random()*TAU,sp=30+Math.random()*(50+n*9);L.fx.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:.25+Math.random()*(.25+n*.025),c:P[i%P.length]})}
    // кольца-ударные волны: с 6-й ступени
    const rings=n>=14?3:n>=10?2:n>=6?1:0;for(let r=0;r<rings;r++){const N=24+n*2,sp=70+r*45+n*4;for(let i=0;i<N;i++){const a=i/N*TAU;L.fx.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:.22+r*.06,c:P[(i+r)%P.length]})}}
    // лучи-молнии: с 12-й
    if(n>=12)for(let b=0;b<6;b++){const a=Math.random()*TAU;for(let k=0;k<10;k++){const d=6+k*7;L.fx.push({x:x+Math.cos(a)*d+(Math.random()-.5)*4,y:y+Math.sin(a)*d+(Math.random()-.5)*4,vx:0,vy:0,life:.18+k*.012,c:P[(b+k)%P.length]})}}
    C1.shake=Math.max(C1.shake||0,Math.min(.9,.15+n*.045));
    if(n>=10)C1.comboFlash={t:.22,c:P[n%P.length]};
  }catch(e){console.warn('combo',e)}};
// баннер ступени: размер и цвет растут, с 10-й — радужные буквы
C1.comboBanner=function(b,s,T){const n=tier(b.n),u=UIX();if(C1.comboFlash&&u){const f=C1.comboFlash;u.save();u.globalAlpha=Math.max(0,f.t)*.9;u.fillStyle=f.c;u.globalCompositeOperation='lighter';u.fillRect(0,0,320,180);u.restore()}if(!u)return T(b.t,160,30,'#ffd23a',6.4*s,true,'center');
  const sz=(6+Math.min(n,15)*.28)*s,y=31+Math.min(n,15)*.35+(n>=10?Math.sin(performance.now()/60)*1.2:0);
  if(n<10){T(b.t,160+.6,y+.6,'rgba(0,0,0,.6)',sz,true,'center');T(b.t,160,y,C1.comboCol(n),sz,true,'center');return}
  // радуга по буквам
  const P=PAL[11];u.save();u.font='bold '+sz+'px "Trebuchet MS",sans-serif';const w=u.measureText(b.t).width;let x=160-w/2;const t0=performance.now()/80;
  for(let i=0;i<b.t.length;i++){const ch=b.t[i],cw=u.measureText(ch).width,yy=y+Math.sin(t0*.6+i*.7)*(n>=13?2:1);u.fillStyle='rgba(0,0,0,.6)';u.fillText(ch,x+.7,yy+.7);u.fillStyle=P[(i+Math.floor(t0))%P.length];u.fillText(ch,x,yy);x+=cw}
  u.restore()};
// вспышка экрана на больших сериях — поверх UI-слоя
(function loop(){const f=C1.comboFlash;if(f){f.t-=1/60;if(f.t<=0)C1.comboFlash=null}requestAnimationFrame(loop)})();
})();
