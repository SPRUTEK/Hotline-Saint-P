// 02.11: кнопка «Пропустить диалог» — моментально закрывает весь текущий разговор (Tab на ПК, кнопка над окном диалога)
(function(){
const SB={x:W-80,y:H-62,w:76,h:10};
function on(){return state==='play'&&dlg&&dlg.lines}
function skipDlg(){let n=0;while(dlg&&n<30){n++;const cb=dlg.cb;dlg=null;if(cb){try{cb()}catch(e){console.error(e)}}}if(window.C1)C1.mdown=false}
window.skipDlg=skipDlg;
function inB(x,y){return x>=SB.x-3&&x<=SB.x+SB.w+3&&y>=SB.y-4&&y<=SB.y+SB.h+3}
(window.__pre=window.__pre||[]).unshift(function(e){
  if(!on())return false;const t=e.type;
  if(t==='keydown'&&e.code==='Tab'){skipDlg();return true}
  if(t==='mousedown'&&e.button===0){const x=(e.clientX-OX)/SC,y=(e.clientY-OY)/SC;if(inB(x,y)){skipDlg();return true}}
  if(t==='touchstart'){for(const tt of e.changedTouches){const x=(tt.clientX-OX)/SC,y=(tt.clientY-OY)/SC;if(inB(x,y)){skipDlg();return true}}}
  return false});
const _rd=renderDlg;
renderDlg=function(){_rd.apply(this,arguments);if(!on())return;
  const hv=mouse.on&&!touch.on&&inB(mouse.x,mouse.y);
  u.fillStyle=hv?'rgba(255,90,168,.9)':'rgba(6,3,12,.85)';u.fillRect(SB.x,SB.y,SB.w,SB.h);u.strokeStyle='#ff5aa8';u.lineWidth=.6;u.strokeRect(SB.x+.3,SB.y+.3,SB.w-.6,SB.h-.6);
  uiFont(4.6,true);u.textAlign='center';u.fillStyle='#fff';u.fillText(touch.on?'ПРОПУСТИТЬ ДИАЛОГ »':'ПРОПУСТИТЬ ДИАЛОГ [Tab]',SB.x+SB.w/2,SB.y+7);u.textAlign='left'};
})();
