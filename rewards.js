// =====================================================================
//  rewards.js — награды пустых глав (04.11, согласовано Натальей):
//  гл.7 — бойцовская броня Скалы (ур.3), гл.9 — Гатлинг Ханжи в стойку,
//  гл.10 — штуцер Аниса. Броня ур.4 («Тактикул») уже даётся после гл.8.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.WD||!window.UP)return;
const WD=C1.WD;
// --- оружие ---
WD.gatl=Object.assign({},WD.minigun||{slot:'t',pose:'shotgun',am:'r762',snd:'rifle',spin:1},{n:'ГАТЛИНГ ХАНЖИ',mag:300,rt:4.6,cd:.28,dmg:24,sp:540,life:.62,spr:.09,kb:50,noise:260,shake:.16,slow:.65,spin:1,cdMin:.03});
WD.shtuc={slot:'t',n:'ШТУЦЕР АНИСА',pose:'shotgun',am:'awp',mag:2,rt:2.2,cd:.42,dmg:340,sp:1000,life:.8,spr:0,kb:280,pierce:6,snd:'slug',noise:260,shake:.55,laser:1,col:'#ffe0a0',
  ico:[[0,2,34,3,'#2a2a2e'],[0,3,34,1,'#5a5a62'],[22,1,16,6,'#7a4a24'],[24,5,8,4,'#5a3418']],ov:[[4,12,22,3,'#2a2a2e'],[18,12,10,5,'#7a4a24']]};
if(C1.WNAME){C1.WNAME.gatl=WD.gatl.n;C1.WNAME.shtuc=WD.shtuc.n}
const DESC={gatl:'Шестиствольный пулемёт Ханжи. Двадцать лет ждал своего дня. Раскручивается дольше минигана, но косит всё.',
  shtuc:'Двуствольный штуцер Аниса. Два выстрела, пробивает шеренгу насквозь. Сезон открыт навсегда.'};
try{if(window.ARS&&ARS.WTXT)Object.assign(ARS.WTXT,DESC)}catch(e){}
C1.WDESC=Object.assign(C1.WDESC||{},DESC);
// --- иконки ---
if(window.ICONS&&ICONS.ART&&ICONS.build){
  ICONS.ART.gatl=a=>{a.r(0,4,20,12,'#4a5a32');a.hl(1,4,18,'#6a7a48');a.d(3,7,12,6,'#3a4626');a.d(4,8,10,1,'#ffa040');
    a.q([8,16, 14,16, 13,24, 7,24],'#26272c');a.r(14,1,8,4,'#26272c');a.r(20,4,8,12,'#5a5e68');
    for(let i=0;i<6;i++)a.r(28,4+i*2,42,1.6,i%2?'#2a2b30':'#4a4c54');a.r(34,3,3,14,'#6a6e78');a.r(50,3,3,14,'#6a6e78');a.r(68,3,3,14,'#2a2b30');
    a.r(24,16,14,7,'#6a5a2a');for(let x=25;x<38;x+=2)a.d(x,17,1,5,'#c8a040')};
  ICONS.ART.shtuc=a=>{a.q([0,6, 4,4, 18,5, 22,9, 18,12, 6,12, 2,15, 0,15],'#7a4a24');a.hl(1,5,16,'#a86a34');a.d(8,8,8,1,'#5a3418');
    a.r(22,4,14,6,'#3a3a40');a.d(24,6,10,1,'#c8a040');a.d(26,8,6,1,'#c8a040');a.r(36,4,40,2,'#2a2a2e');a.r(36,7,40,2,'#2a2a2e');a.hl(36,4,38,'#6a6e78');
    a.r(40,9,22,3,'#7a4a24');a.q([24,10, 28,10, 27,15, 23,15],'#26272c');a.r(74,3,2,2,'#c8ccd4')};
  for(const k of ['gatl','shtuc'])try{ICONS.PIX[k]=ICONS.build(ICONS.ART[k]);WD[k].pix=ICONS.PIX[k]}catch(e){console.warn('rewards icon',k,e)}
}
// --- броня Скалы ---
const ARM=UP.ARM;
if(ARM&&!ARM.sk){ARM.sk={n:'Бойцовская броня Скалы',lvl:3,prot:.5,max:230,rp:4,mel:.2,spd:1.03,c:'#8a1e22',d:'Защита с ринга Скалы: бинты, щитки, кевларовый жилет. Укусы и удары держит особенно хорошо, бегать не мешает.'};
  try{if(UP.applyAU)UP.applyAU()}catch(e){}}
if(window.ICONS&&ICONS.IP&&ICONS.build&&!ICONS.IP.arm_sk)try{ICONS.IP.arm_sk=ICONS.build(a=>{const B='#8a1e22';
  a.q([4,0, 9,0, 10,4, 14,4, 15,0, 20,0, 22,6, 22,26, 2,26, 2,6],B);a.d(10,0,4,4,'#0a090d');a.r(0,7,2,9,'#6a1418');a.r(22,7,2,9,'#6a1418');
  for(const y of [8,13,18])a.d(4,y,16,2,'#e8e4d8');a.d(9,21,6,3,'#ffd23a');a.d(10,22,4,1,'#c8302a')},1)}catch(e){}
// --- выдача по сюжету ---
function owns(id){const S=UP.SV();return id.startsWith('arm')?!!(S.arms&&S.arms[id.slice(3)]):!!(S.own&&S.own[id])}
function give(id,msg){if(window.MIS&&MIS.on)return;if(owns(id))return;UP.grant(id);try{UP.persist()}catch(e){}if(window.note)note(msg);try{C1.X.sfx('power',.6)}catch(e){}}
setInterval(()=>{try{
  if(window.C7&&C7.on&&C7.done)give('armsk','Награда за «Грибыч»: бойцовская броня Скалы — в оружейной');
  if(window.C9&&C9.on&&C9.done)give('gatl','Ханжа отдала Гатлинг: он теперь в стойке оружейной');
  if(window.C10&&C10.on&&C10.done)give('shtuc','Штуцер Аниса — в стойке оружейной. Помним.');
}catch(e){}},1500);
})();
