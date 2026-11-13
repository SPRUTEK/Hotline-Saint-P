// maps.js — читаемость локаций (03.11):
// 1) у всех препятствий-«мебели» (низкие объекты и небольшие твёрдые предметы) рисуется контур, блик и тень на пол —
//    чтобы ничего не сливалось с полом; контур идёт по настоящей границе столкновения;
// 2) «бутылочные горлышки»: проход уже 3 клеток (12 px) между мебелью расширяется — у толстой мебели
//    срезается крайняя клетка столкновения (сам рисунок не меняется, проходить становится свободнее).
(function(){
'use strict';
if(!window.C1||!C1.engine)return;
const E=C1.engine,TS=4;
let last=null,wait=0;
function process(L){
  const gw=L.gw,gh=L.gh,g=L.g;if(!g||!gw)return;
  // компоненты твёрдых клеток «1»: мелкие и не у края карты — это мебель
  const comp=new Int32Array(gw*gh).fill(-1),small=[];let cid=0;
  for(let i=0;i<gw*gh;i++){if(g[i]!==1||comp[i]>=0)continue;const q=[i];comp[i]=cid;let n=0,edge=false;
    while(q.length){const j=q.pop();n++;const x=j%gw,y=(j/gw)|0;if(x===0||y===0||x===gw-1||y===gh-1)edge=true;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=gw||ny>=gh)continue;const k=ny*gw+nx;if(g[k]===1&&comp[k]<0){comp[k]=cid;q.push(k)}}}
    small[cid]=!edge&&n<=160;cid++}
  const isF=i=>g[i]===2||(g[i]===1&&small[comp[i]]);
  const solid=i=>g[i]!==0;
  // расширение узких проходов
  let cut=0;
  const widen=(get,len,lines)=>{for(let a=0;a<lines;a++){let b=0;while(b<len){if(solid(get(a,b))){b++;continue}let e=b;while(e<len&&!solid(get(a,e)))e++;
      const run=e-b;if(run<=3&&b>0&&e<len){const L0=get(a,b-1),R0=get(a,e);
        if(isF(L0)&&b>1&&solid(get(a,b-2))){g[L0]=0;cut++}
        if(isF(R0)&&e<len-1&&solid(get(a,e+1))&&run+(g[L0]===0?1:0)<4){g[R0]=0;cut++}}b=e}}};
  widen((y,x)=>y*gw+x,gw,gh);widen((x,y)=>y*gw+x,gh,gw);
  // контуры мебели — в слой декора (рисуется над полом, под героями)
  const dc=L.dec,dx=L.dx||dc.getContext('2d');const q=dc.width/L.w;dx.save();dx.setTransform(q,0,0,q,0,0);
  const free=(x,y)=>x>=0&&y>=0&&x<gw&&y<gh&&g[y*gw+x]===0;
  for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){const i=y*gw+x;if(!isF(i))continue;const px=x*TS,py=y*TS;
    if(free(x,y+1)){dx.fillStyle='rgba(0,0,0,.34)';dx.fillRect(px,py+TS,TS,1.6);dx.fillStyle='rgba(8,6,12,.7)';dx.fillRect(px,py+TS-.4,TS,.4)}
    if(free(x+1,y)){dx.fillStyle='rgba(0,0,0,.26)';dx.fillRect(px+TS,py+.8,1.2,TS);dx.fillStyle='rgba(8,6,12,.7)';dx.fillRect(px+TS-.4,py,.4,TS)}
    if(free(x,y-1)){dx.fillStyle='rgba(255,255,255,.22)';dx.fillRect(px,py,TS,.45);dx.fillStyle='rgba(8,6,12,.55)';dx.fillRect(px,py-.4,TS,.4)}
    if(free(x-1,y)){dx.fillStyle='rgba(255,255,255,.14)';dx.fillRect(px,py,.45,TS);dx.fillStyle='rgba(8,6,12,.55)';dx.fillRect(px-.4,py,.4,TS)}}
  dx.restore();
  if(cut&&C1.X&&C1.X.buildNav)try{C1.X.buildNav()}catch(e){}
  L._maps={cut};
}
const _up=update;update=function(dt){_up(dt);try{const L=E.L;if(!L||state!=='play')return;if(L!==last){last=L;wait=2}if(wait>0&&--wait===0&&!L._maps)process(L)}catch(e){console.warn('maps',e)}};
window.MAPS={process};
})();
