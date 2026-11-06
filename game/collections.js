// collections.js — «Коллекции» (03.11): три вида собирательства + достижения, новый экран.
// 1) ФОТОПЛЁНКА: 21 кадр с плёнки Шмакодявки (фото Натальи, пикселизация грубее, «плёночный» тон),
//    поровну по главам 1–10 (в гл.1 три кадра, в остальных по два).
// 2) ЛЕГЕНДАРНОЕ: 10 предметов, по одному на главу, спрятаны в дальних углах локаций, почти без блеска.
// 3) РЕДКИЕ НАХОДКИ: пасхалки в тайниках (старые 9 перерисованы + 18 новых для глав 2–10).
// 4) ДОСТИЖЕНИЯ: прежние легендарные карточки (S, комбо x10, 300 зомби…), перерисованы.
// В режиме «Миссии» новые предметы не появляются.
(function(){
'use strict';
const M=window.MART;if(!M||!window.C1||!C1.COLS)return;
const sfx=(k,v)=>{try{C1.X.sfx(k,v)}catch(e){}};
const TAU=Math.PI*2,E=C1.engine;
const COLS=C1.COLS,COLSET=C1.COLSET;
const save=()=>{try{localStorage.setItem('cols',JSON.stringify([...COLSET]))}catch(e){}};
// ---------- иконки в детальном пикселе (построитель MART: объём, контур) ----------
function mkIcon(fn,S){S=S||48;const s=M.build(fn),c=document.createElement('canvas');c.width=S;c.height=S;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  const k=Math.min(1,S/Math.max(s.w,s.h));g.drawImage(s.cv,Math.round((S-s.w*k)/2),Math.round((S-s.h*k)/2),Math.round(s.w*k),Math.round(s.h*k));return c}
const SK='#e8b898';
const star=(cx,cy,R,r)=>{const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r:R;p.push(cx+Math.cos(a)*q,cy+Math.sin(a)*q)}return p};
const ring=(a,cx,cy,r,c)=>{for(let k=0;k<64;k++){const t=k/64*TAU;a.p(Math.round(cx+Math.cos(t)*r),Math.round(cy+Math.sin(t)*r),c)}};
// ---------- 1) ЛЕГЕНДАРНЫЕ ПРЕДМЕТЫ ----------
const LI=[
 {id:'li_horn',ch:1,lv:['off2','off1'],col:'#ff8a3a',t:'Охотничий рог Аниса',hint:'Анис держал его поближе к своим трофеям',
  d:'Рог, с которым Анис открывал каждый сезон. Если подуть, где-то далеко отзывается Land Rover.',
  art:a=>{a.q([3,33,8,29,16,25,24,20,30,14,34,9,37,5,42,9,39,16,33,24,23,31,13,35,5,37],'#e8dcc0');a.e(39,7,5,5,'#d8b050');a.e(39,7,2.6,2.6,'#3a2410');a.r(0,32,5,4,'#c89a40');
    a.d(12,29,2,7,'#c89a40');a.d(24,20,2,8,'#c89a40');a.d(31,13,2,7,'#c89a40');a.ln(13,36,18,41,'#6a3a1a');a.ln(18,41,27,39,'#6a3a1a');a.ln(27,39,26,29,'#6a3a1a');a.d(16,27,6,1,'#fff6e0')}},
 {id:'li_lip',ch:2,lv:['apple','mall1'],col:'#ff4fa3',t:'Помада «Золотое яблоко» Limited',hint:'Там, где пахнет духами и скидками',
  d:'Лимитированный оттенок «Кровавая Нева». Шмакодявка охотилась за ним полгода. Апокалипсис помог.',
  art:a=>{a.r(13,22,14,18,'#b08a2a');a.r(14,14,12,9,'#e0c050');a.q([15,14,25,14,25,5,21,2,15,7],'#d8203e');a.d(16,6,2,7,'#ff6a80');a.e(20,31,3,3,'#ffd23a');a.d(20,26,2,2,'#5ac83a');a.d(13,22,14,1,'#7a5a1a');a.d(15,15,1,7,'#fff0b0');a.d(14,38,12,1,'#7a5a1a')}},
 {id:'li_crown',ch:3,lv:['lair','tunnels'],col:'#d8b040',t:'Корона крысиного короля',hint:'В логове того, кто её носил',
  d:'Сплетена из ложек, монет и хвостов. Крысы до сих пор кланяются тому, кто её держит.',
  art:a=>{for(let i=0;i<4;i++){const x=5+i*8;a.q([x,22,x+4,8,x+8,22],'#d8b040')}a.r(5,22,32,10,'#d8b040');for(let i=0;i<4;i++)a.e(9+i*8,8,1.6,1.6,'#fff0a0');
    a.e(10,27,2,2,'#e02040');a.e(21,27,2.6,2.6,'#3ad870');a.e(32,27,2,2,'#3a8aff');a.r(4,31,34,3,'#6a6a72');a.ln(8,34,6,42,'#d89a9a');a.ln(20,34,22,43,'#d89a9a');a.ln(32,34,35,41,'#d89a9a')}},
 {id:'li_cape',ch:4,lv:['roof','club'],col:'#3a8aff',t:'Плащ Алкопатимена',hint:'Выше всех, ближе к небу',
  d:'Супергеройский плащ Егора. Сшит из флага районного турнира по пиву. Развевается даже без ветра.',
  art:a=>{a.q([10,4,30,4,38,40,2,40],'#2a6ad8');a.q([9,3,31,3,29,10,11,10],'#d82a30');a.e(20,22,6,6,'#ffd23a');a.ln(18,26,20,18,'#d82a30');a.ln(20,18,22,26,'#d82a30');a.d(19,23,3,1,'#d82a30');
    a.d(9,14,1,24,'#1a4aa8');a.d(31,14,1,24,'#1a4aa8');a.d(14,30,1,9,'#1a4aa8');a.d(26,30,1,9,'#1a4aa8');a.d(2,39,36,1,'#ffd23a')}},
 {id:'li_mask',ch:5,lv:['villa5','colos5'],col:'#ff3a8a',t:'Венецианская маска Олеси',hint:'Богатый дом, самый дальний угол',
  d:'Олеся надевала её на карнавал. Теперь маска пахнет морем и немного порохом.',
  art:a=>{a.q([2,16,10,11,20,14,30,11,38,16,36,26,28,30,20,27,12,30,4,26],'#f4f0e6');a.e(12,20,4,2.5,'#1a0a14');a.e(28,20,4,2.5,'#1a0a14');a.ln(4,26,12,30,'#d8b040');a.ln(28,30,36,26,'#d8b040');a.ln(10,12,20,15,'#d8b040');a.ln(20,15,30,12,'#d8b040');
    a.q([30,11,33,0,37,1,35,13],'#ff3a8a');a.q([33,12,41,4,42,9,36,15],'#c05aff');a.ln(36,26,40,42,'#8a5a2a');a.p(20,18,'#ff4fd8');a.p(16,25,'#3ef0b0');a.p(24,25,'#3ef0b0')}},
 {id:'li_staff',ch:6,lv:['forest6','farm6'],col:'#7aff3a',t:'Посох лешего',hint:'Самая глушь леса',
  d:'Леший опирался на него триста лет. Где воткнёшь, там через час вырастают грибы.',
  art:a=>{a.q([18,42,22,42,24,14,20,14],'#6a4424');a.d(20,30,3,2,'#4a2a14');a.d(19,37,3,1,'#4a2a14');a.q([15,14,28,14,30,6,24,1,17,3,13,8],'#5a3a1a');a.e(22,8,3,3,'#7aff3a');a.p(21,7,'#e8ffd0');
    a.d(16,13,11,2,'#4a8a2a');a.d(21,24,3,3,'#4a8a2a');a.q([24,20,33,15,31,22],'#5ac83a');a.q([19,29,10,25,12,31],'#5ac83a');a.e(25,35,3,2,'#e0402a');a.d(24,35,2,3,'#f4f0e6')}},
 {id:'li_vinyl',ch:7,lv:['cellar7','main7'],col:'#ffd23a',t:'Золотая пластинка Бабуры',hint:'Подвал, где не смолкает музыка',
  d:'Тот самый сет, после которого «Грибыч» трясло до утра. Говорят, на обороте записан рецепт.',
  art:a=>{a.e(20,20,18,18,'#d8b030');ring(a,20,20,15,'#a8801a');ring(a,20,20,12.5,'#a8801a');ring(a,20,20,10,'#a8801a');a.e(20,20,6,6,'#ff4fd8');a.d(17,18,6,1,'#ffd0f0');a.e(20,20,1.4,1.4,'#0a090d');a.ln(7,12,13,6,'#fff0b0');a.ln(9,14,15,8,'#fff0b0')}},
 {id:'li_hglass',ch:8,lv:['sands8','sands8b'],col:'#e0b060',t:'Песочные часы Барханыча',hint:'Песок помнит всё',
  d:'Барханыч засекал по ним, сколько тебе осталось. Песок в них не кончается никогда.',
  art:a=>{a.r(7,1,26,4,'#8a5a2a');a.r(7,37,26,4,'#8a5a2a');a.r(9,5,2,32,'#6a4424');a.r(29,5,2,32,'#6a4424');a.q([12,5,28,5,22,21,28,37,12,37,18,21],'#cfe8f0');
    a.q([14,11,26,11,21,19,19,19],'#e0b060');a.q([13,37,27,37,24,31,20,29,16,31],'#e0b060');a.d(20,19,1,10,'#e0b060');a.d(14,7,1,6,'#ffffff');a.d(25,25,1,6,'#ffffff')}},
 {id:'li_medal',ch:9,lv:['back9b'],col:'#3ef0b0',t:'Медаль «Защитник Коломяг»',hint:'На заднем дворе, куда никто не ходит',
  d:'Ханжа отлила её из гильз после осады. Одна на весь двор, и вот она нашлась.',
  art:a=>{a.q([12,1,28,1,24,17,16,17],'#3ef0b0');a.d(17,1,2,16,'#ff4fd8');a.d(21,1,2,16,'#ff4fd8');a.e(20,18,2,2,'#c8a040');a.q(star(20,30,11,4.6),'#d8b040');a.e(20,30,3.6,3.6,'#ff4fd8');a.p(19,29,'#ffffff')}},
 {id:'li_zenit',ch:10,lv:['lab10','vent10'],col:'#ffffff',t:'Плёночный «Зенит» Шмакодявки',hint:'Лаборатория под крепостью',
  d:'Та самая камера. Внутри ещё плёнка: последний кадр снят уже после конца света. Что на нём, лучше не знать.',
  art:a=>{a.r(3,12,34,18,'#2a2a30');a.r(3,9,34,4,'#c8c8d0');a.q([14,9,26,9,24,3,16,3],'#2a2a30');a.e(20,22,8,8,'#c8c8d0');a.e(20,22,6,6,'#1a1a1e');a.e(20,22,3.5,3.5,'#3a3aa8');a.p(18,20,'#ffffff');
    a.r(30,6,3,3,'#c8c8d0');a.d(5,16,7,1,'#1a1a1e');a.d(5,19,7,1,'#1a1a1e');a.d(29,16,6,1,'#1a1a1e');a.d(29,19,6,1,'#1a1a1e');a.d(2,12,1,4,'#c8c8d0');a.d(37,12,1,4,'#c8c8d0');a.p(33,11,'#e02020');a.d(17,5,6,1,'#5a5a66')}},
];
LI.forEach(c=>{c.icon=mkIcon(c.art);c.how='Глава '+c.ch+' · '+c.hint;c.li=true});
// ---------- 2) РЕДКИЕ НАХОДКИ ----------
// перерисовка старых (глава 1)
const REDRAW={
 turret:a=>{a.q([6,4,34,4,34,24,20,38,6,24],'#4e6a3a');a.q([9,7,31,7,31,23,20,34,9,23],'#3a4a2a');a.r(15,14,10,12,'#c8a040');a.r(14,11,3,3,'#c8a040');a.r(19,11,3,3,'#c8a040');a.r(24,11,2,3,'#c8a040');a.d(19,21,3,5,'#3a4a2a');a.d(7,5,26,1,'#8aa060');a.d(12,28,16,1,'#c8a040')},
 neva:a=>{a.r(4,3,32,36,'#f4f0e6');a.d(7,6,26,22,'#e8a0b0');a.d(7,6,26,4,'#c880b8');a.d(7,20,26,8,'#3a5a8a');a.d(7,19,26,1,'#f8d0a0');a.d(7,16,26,1,'#4a3a5a');for(let i=0;i<3;i++)a.d(9+i*8,17,4,2,'#4a3a5a');
   a.d(13,12,4,3,'#3d2b20');a.d(14,14,2,2,SK);a.d(14,14,1,1,'#ffd23a');a.d(13,16,4,7,'#8f9298');a.d(20,11,4,8,'#1a1418');a.d(21,13,2,2,SK);a.d(20,17,4,6,'#ff6fb5');a.d(26,8,4,2,'#ffd23a');a.d(9,32,16,1,'#8a8aa0');a.d(9,35,10,1,'#8a8aa0')},
 mouse:a=>{a.e(16,27,10,6,'#8a8a92');a.e(23,20,3.5,3.5,'#a8a8b0');a.p(23,20,'#ff9ab0');a.p(25,25,'#111');a.p(27,27,'#ff9ab0');a.ln(6,28,1,33,'#c88aa0');a.ln(26,26,38,6,'#d8c8a0');a.e(38,5,2.4,2.4,'#ff2a7a');a.d(10,25,8,1,'#b8b8c0')},
 mug:a=>{a.r(8,10,20,27,'#f0f0f0');a.q([28,14,36,14,36,29,28,29,28,26,33,26,33,17,28,17],'#f0f0f0');a.d(9,10,18,2,'#5a3a20');a.d(11,17,14,2,'#2a6ad8');a.d(11,21,14,1,'#2a6ad8');a.d(11,24,10,1,'#2a6ad8');a.d(14,35,3,2,'#8a1a22');a.d(15,37,1,2,'#8a1a22');a.p(14,6,'#c8c8d0');a.p(16,4,'#c8c8d0');a.p(20,6,'#c8c8d0');a.p(22,3,'#c8c8d0')},
 hunt:a=>{a.r(4,3,32,36,'#f4f0e6');a.d(7,6,26,22,'#7a9a6a');a.d(7,6,26,5,'#9ab88a');a.d(7,22,26,6,'#4a6a3a');a.d(16,10,6,3,'#241a15');a.d(17,12,4,3,'#e2ad8c');a.d(15,15,8,8,'#4e4e32');a.d(16,23,2,4,'#2a2a1a');a.d(20,23,2,4,'#2a2a1a');a.ln(9,17,27,13,'#26262a');
   a.d(24,18,5,3,'#3a6a3a');a.d(28,17,2,2,'#2a8a5a');a.p(29,18,'#ffd23a');a.d(9,32,18,1,'#8a8aa0');a.d(9,35,12,1,'#8a8aa0')},
 sticker:a=>{a.q([5,5,35,5,35,29,29,35,5,35],'#ffe050');a.q([29,35,35,29,29,29],'#d8b020');a.e(13,15,2.5,2.5,'#111');a.e(27,15,2.5,2.5,'#111');a.d(10,11,6,1,'#111');a.d(24,11,6,1,'#111');a.d(13,25,14,2,'#111');a.d(11,27,2,1,'#111');a.d(27,27,2,1,'#111');a.p(12,14,'#fff');a.p(26,14,'#fff')},
 smelt:a=>{a.q([4,8,36,8,34,36,6,36],'#d8e8f0');for(let i=0;i<3;i++){const y=13+i*7;a.q([9,y,27,y,30,y+2,27,y+4,9,y+4],'#a8b8c0');a.q([30,y+2,34,y-1,34,y+5],'#8a9aa0');a.d(10,y+3,16,1,'#e8f0f4');a.p(11,y+1,'#111');a.d(16,y+1,6,1,'#c8a8d8')}a.r(14,4,12,4,'#c8d8e0')},
 pass:a=>{a.ln(14,0,18,8,'#3a3a40');a.ln(26,0,22,8,'#3a3a40');a.r(4,8,32,25,'#f0f0f4');a.d(4,8,32,5,'#2a6ad8');a.d(7,15,10,14,'#c8d0dc');a.d(8,16,8,3,'#3d2b20');a.d(9,19,6,4,SK);a.d(9,20,2,1,'#ffd23a');a.d(13,20,2,1,'#ffd23a');a.d(9,23,6,2,'#3d2b20');a.d(8,25,8,4,'#8f9298');
   a.d(19,16,14,1,'#3a3a40');a.d(19,20,11,1,'#8a8a92');a.d(19,23,12,1,'#8a8a92');for(let i=0;i<7;i++)a.d(19+i*2,27,1,4,'#1a1a1e')},
 laser:a=>{a.q([3,31,6,27,25,15,28,19,9,33],'#2a2a30');a.d(10,25,9,1,'#c8c8d0');a.d(15,22,2,2,'#e02020');a.ln(27,16,40,6,'#ff3030');a.e(40,5,2.2,2.2,'#ff6060');a.ln(6,30,24,18,'#4a4a52')},
};
// новые: глава, где лежит (уровни-кандидаты), что обыскать
const NEW=[
 ['abon',2,['gym'],'шкафчик тренера','Абонемент «Безлимит навсегда»','Фитнес продал его за неделю до конца света. «Навсегда» оказалось очень коротким.',
   a=>{a.r(4,10,32,21,'#1a1a1e');a.d(4,14,32,3,'#ffd23a');a.d(8,22,10,2,'#c8c8d0');a.d(7,20,2,6,'#c8c8d0');a.d(17,20,2,6,'#c8c8d0');a.d(24,21,9,1,'#8a8a92');a.d(24,24,7,1,'#8a8a92');a.r(26,8,6,4,'#d8b040');a.d(5,11,30,1,'#3a3a44')}],
 ['syrok',2,['mall2','mall1'],'холодильник с молочкой','Глазированный сырок','Последний в Питере. Срок годности: до конца света. Как раз.',
   a=>{a.q([2,17,8,12,32,12,38,17,38,27,32,31,8,31,2,27],'#e02040');a.r(10,15,20,13,'#f4f0e6');a.e(20,21,4,4,'#3a8aff');a.p(19,20,'#ffffff');a.d(3,18,3,8,'#b01020');a.d(34,18,3,8,'#b01020');a.d(12,26,16,1,'#8a2a3a')}],
 ['jar',3,['cellar'],'стеллаж с закрутками','Банка огурцов бабы Вали','Закатана в 2019-м. Хрустят до сих пор. Зомби обходят подвал стороной.',
   a=>{a.r(10,3,20,5,'#c8a040');a.r(8,8,24,31,'#bfe0c8');a.e(14,22,3,8,'#4a8a2a');a.e(21,20,3,9,'#5aa03a');a.e(27,24,3,7,'#4a8a2a');a.ln(12,11,18,16,'#2a6a1a');a.ln(24,12,28,16,'#2a6a1a');a.d(9,29,22,6,'#f4f0e6');a.d(12,31,14,1,'#a8301a');a.d(10,10,1,18,'#ffffff')}],
 ['rattail',3,['tunnels'],'куча тряпья','Брелок «крысиный хвост»','Сувенир из катакомб. На счастье. Крысы так не считают.',
   a=>{a.e(9,8,6,6,'#c8c8d0');a.e(9,8,3,3,'#3a3a44');a.ln(14,13,18,17,'#c8c8d0');a.ln(15,13,19,17,'#a8a8b0');for(let i=0;i<22;i++)a.d(18+i,17+i*.9+Math.sin(i/3)*2.5,2,2,'#d89a9a');a.p(40,37,'#e8b0b0')}],
 ['tape',4,['flatb'],'коробка с кассетами','Кассета «Группа крови»','Из бардачка бати. Перемотана карандашом столько раз, что звучит в миноре.',
   a=>{a.r(3,10,34,23,'#1a1a1e');a.r(6,12,28,11,'#f4f0e6');a.d(6,12,28,3,'#e02040');a.d(9,18,18,1,'#2a2a30');a.e(13,24,3.5,3.5,'#f4f0e6');a.e(27,24,3.5,3.5,'#f4f0e6');a.p(13,24,'#1a1a1e');a.p(27,24,'#1a1a1e');a.d(17,22,6,4,'#5a4a3a');a.q([10,33,30,33,28,28,12,28],'#2a2a30')}],
 ['shawa',4,['nevsky'],'ларёк у метро','Шаверма с Думской','Ещё тёплая. Никто не знает, из чего она. Даже зомби боятся спросить.',
   a=>{a.q([10,39,30,39,34,11,6,11],'#e8d0a0');a.q([9,39,31,39,32,27,8,27],'#c8c8d0');a.e(20,11,13,5,'#c86a3a');a.d(9,8,4,2,'#5ac83a');a.d(24,7,5,2,'#5ac83a');a.d(15,6,3,2,'#e02020');a.d(18,11,6,1,'#ffffff');a.d(10,31,20,1,'#a8a8b0');a.d(10,35,20,1,'#a8a8b0')}],
 ['coin',5,['town5','alley5'],'край фонтана','Монетка из фонтана','Кто-то загадал, чтобы всё это кончилось. Пока не сбылось.',
   a=>{a.e(20,20,15,15,'#d8b040');ring(a,20,20,12,'#a8801a');a.d(17,12,6,13,'#b8902a');a.d(15,14,3,5,'#b8902a');a.d(18,27,4,2,'#b8902a');a.p(33,7,'#8af0ff');a.p(35,10,'#8af0ff');a.d(10,10,3,1,'#fff0b0')}],
 ['shell',5,['beach5','pier5'],'зонтик у шезлонга','Ракушка с пляжа','Если приложить к уху, слышно море. И рычание. Лучше не прикладывать.',
   a=>{a.q([20,37,4,19,8,8,20,4,32,8,36,19],'#ffc8b0');for(const x of [8,14,20,26,32])a.ln(20,37,x,x===20?4:x<20?8-(x-8)/3:8-(32-x)/3,'#e09a80');a.r(16,35,8,4,'#e8a890');a.p(12,12,'#ffffff')}],
 ['skewer',6,['dacha6'],'мангал бати','Шампур бати','Батя жарил на нём шашлык 30 лет. Мясо всегда было «почти готово».',
   a=>{a.ln(4,36,40,4,'#c8c8d0');a.ln(5,37,41,5,'#8a8a92');a.e(4,36,3,3,'#c8c8d0');for(const k of [.35,.55,.75]){const x=4+36*k,y=36-32*k;a.e(x,y,4.5,4.5,'#8a3a1a');a.p(x-1,y-1,'#2a1410');a.p(x+1,y+1,'#c86a3a');a.e(x+4,y-4,2,2,'#f4e8f0')}}],
 ['lapot',6,['forest6','street6'],'дупло','Лапоть лешего','Левый. Правый леший до сих пор ищет и очень злится.',
   a=>{a.q([4,28,10,18,30,16,39,22,37,32,6,34],'#c8a060');for(let i=0;i<6;i++)a.ln(8+i*5,18,6+i*5,33,'#8a6a30');a.ln(6,25,38,25,'#8a6a30');a.e(25,20,7,3,'#3a2a14');a.d(6,32,6,2,'#4a8a2a');a.ln(30,18,36,8,'#8a6a30')}],
 ['glow',7,['main7','top7'],'колонка у сцены','Неоновая палочка','Светится с той самой ночи в «Грибыче». Батарейки ей не нужны. Это пугает.',
   a=>{a.q([7,35,30,8,35,12,12,39],'#ff4fd8');a.ln(10,36,32,10,'#ffd0f0');a.e(9,37,3,3,'#3ef0b0');a.e(33,10,3,3,'#3ef0b0');a.p(38,5,'#ffffff');a.p(36,2,'#ffd0f0');a.p(4,30,'#ffd0f0')}],
 ['towel',7,['gym7','gymst7'],'скамья у ринга','Полотенце Скалы','Влажное. Пахнет победой и мазью «Звёздочка». Скала будет искать.',
   a=>{a.r(4,15,32,21,'#e8e8f0');a.r(4,10,32,6,'#d0d0dc');a.d(4,27,32,2,'#3a8aff');a.d(4,31,32,1,'#3a8aff');a.d(16,19,8,5,'#e02040');a.d(18,20,4,3,'#ffd23a');a.p(9,7,'#8af0ff');a.p(30,6,'#8af0ff')}],
 ['pelm',8,['sosedi8'],'морозилка соседей','Уральские пельмени','Слеплены соседями вручную. Каждый пельмень — с характером.',
   a=>{a.e(20,26,19,10,'#f4f0e6');a.e(20,26,15,7,'#e0dce8');for(const [x,y] of [[12,24],[19,22],[26,24],[15,29],[23,29],[29,28]]){a.e(x,y,3.6,2.6,'#f8eedc');a.d(x-2,y-1,4,1,'#e8d8b8')}a.e(30,21,3,2,'#ffffff');a.d(18,20,1,1,'#3a8a2a');a.d(24,27,1,1,'#3a8a2a')}],
 ['malach',8,['sands8','stop8_1'],'обломки киоска','Малахитовая шкатулка','Уральский сувенир. Внутри записка: «Хозяйке Медной горы привет».',
   a=>{a.r(6,16,28,19,'#2a8a5a');a.r(4,10,32,7,'#3aa86a');a.ln(8,21,30,24,'#1a6a40');a.ln(8,28,30,31,'#5ac88a');a.ln(7,12,33,14,'#1a6a40');a.d(4,16,32,1,'#d8b040');a.d(19,22,2,3,'#d8b040');a.d(6,34,28,1,'#d8b040')}],
 ['kastr',9,['back9a'],'гараж-ракушка','Каска из кастрюли','Шедевр военной инженерии двора. Изнутри пахнет борщом.',
   a=>{a.q([4,27,6,17,12,11,20,9,28,11,34,17,36,27],'#c8c8d0');a.r(2,27,36,4,'#a8a8b0');a.r(0,23,4,3,'#2a2a30');a.r(36,23,4,3,'#2a2a30');a.d(16,10,8,17,'#8a8a92');a.e(20,18,2.6,2.6,'#ff4fd8');a.ln(6,31,10,38,'#4a3a24');a.ln(34,31,30,38,'#4a3a24')}],
 ['flare',9,['back9b'],'ящик с песком','Сигнальная ракета Ханжи','Запасная. Ханжа велела запускать только «когда совсем жопа».',
   a=>{a.r(14,10,11,26,'#e02020');a.r(13,6,13,5,'#2a2a30');a.d(14,20,11,3,'#f4f0e6');a.d(16,21,7,1,'#2a2a30');a.r(13,34,13,3,'#2a2a30');a.e(19,3,2.4,2.4,'#ffd23a');a.p(22,1,'#ffd23a');a.p(16,1,'#ff8a3a')}],
 ['ticket',10,['emb10','fort10'],'будка кассы','Билет в Петропавловку','Входной на 1 июля. Экскурсия «Тайны крепости». Тайн оказалось больше.',
   a=>{a.r(3,12,34,19,'#f0e0b0');for(let i=0;i<9;i++)a.d(26,12+i*2,1,1,'#a89060');a.ln(12,27,12,14,'#c8a040');a.d(10,23,5,4,'#c8a040');a.p(12,13,'#ffd23a');a.d(17,16,7,1,'#6a4a2a');a.d(17,19,6,1,'#6a4a2a');a.d(17,22,8,1,'#6a4a2a');a.e(31,21,3,3,'#e02040')}],
 ['vial',10,['lab10','anis10'],'лабораторный стол','Пробирка «Образец 0»','Пустая. Подпись почерком Аниса: «Не открывать. Никогда. Серьёзно».',
   a=>{a.q([16,4,24,4,24,32,20,37,16,32],'#cfe8f0');a.q([16,21,24,21,24,32,20,37,16,32],'#7aff3a');a.r(15,1,10,5,'#8a5a2a');a.d(16,12,8,5,'#f4f0e6');a.d(17,14,6,1,'#e02040');a.p(19,27,'#d0ffb0');a.p(21,31,'#d0ffb0');a.d(17,6,1,24,'#ffffff')}],
];
const RARE=[];
for(const id in REDRAW){const c=COLS.find(c=>c.id===id);if(c){c.icon=mkIcon(REDRAW[id]);c.ch=1;RARE.push(c)}}
for(const [id,ch,lv,spot,t,d,art] of NEW){C1.addCol(id,{t,d,where:'Глава '+ch+' · '+spot,draw:()=>{}});const c=COLS.find(c=>c.id===id);c.icon=mkIcon(art);c.ch=ch;c.lv=lv;c.spot=spot;RARE.push(c)}
// достижения: перерисовка
const ACH={
 angel:a=>{a.r(19,20,3,20,'#c8a040');a.r(16,19,9,2,'#ffd23a');a.r(13,39,15,3,'#c8a040');a.e(20,14,5.5,5,'#ffd23a');a.e(21,7,4.2,3.8,'#ffd23a');a.q([17,5,18,0,20,4],'#ffd23a');a.q([22,4,24,0,25,5],'#ffd23a');a.q([14,17,10,12,10,6,12,6,12,12,15,15],'#ffd23a');a.p(19,7,'#3a2a00');a.p(23,7,'#3a2a00');a.d(17,11,3,1,'#fff6c8');a.d(19,4,2,1,'#fff6c8')},
 gun:a=>{a.ln(4,36,38,4,'#2a2a30');a.ln(5,37,39,5,'#2a2a30');a.ln(6,37,40,6,'#5a5a62');a.q([2,30,12,24,17,30,7,40],'#7a4a24');a.e(15,27,2.4,2.4,'#c8c8d0');a.d(19,21,4,2,'#d8b040');a.p(38,4,'#ff3a4a')},
 protein:a=>{a.r(9,10,22,29,'#1a1a1e');a.r(8,5,24,6,'#7aff3a');a.r(11,16,18,15,'#7aff3a');a.q([13,19,15,15,17,19],'#111');a.q([23,19,25,15,27,19],'#111');a.p(16,22,'#111');a.p(24,22,'#111');a.d(19,25,3,1,'#111');a.d(12,34,16,2,'#7aff3a')},
 flame:a=>{a.r(13,17,14,22,'#cfe8f0');a.r(17,9,6,8,'#cfe8f0');a.r(17,7,6,3,'#8a5a2a');a.d(14,25,12,8,'#e8e0c0');a.d(14,33,12,5,'#9ad8e8');a.q([17,7,20,-5,23,7],'#3ad8ff');a.d(19,-1,2,6,'#8af0ff');a.p(20,-3,'#ffffff')},
 eye:a=>{a.e(20,20,19,11,'#111111');a.e(20,20,10,10,'#c8e040');a.q([19,11,21,11,23,20,21,29,19,29,17,20],'#111111');a.d(24,15,2,2,'#ffffff');a.p(4,6,'#c05aff');a.p(36,34,'#c05aff');a.p(6,32,'#c05aff')},
};
// 04.11: ещё 11 достижений (всего 16)
const ACH2=[
 ['king3','Кот-качок','#c8e040','Пройди главу 3 за Черсика','Крысиный король повержен лапой. Протеин работает, но кот всё равно хочет корм.',
  a=>{a.e(20,26,13,10,'#111114');a.e(20,13,9,8,'#111114');a.q([12,8,13,0,18,6],'#111114');a.q([22,6,27,0,28,8],'#111114');a.e(16,13,2,2,'#c8e040');a.e(24,13,2,2,'#c8e040');a.p(16,13,'#111');a.p(24,13,'#111');a.r(5,22,8,5,'#2a2a30');a.r(27,22,8,5,'#2a2a30');a.r(2,20,3,9,'#5a5a62');a.r(35,20,3,9,'#5a5a62');a.r(13,22,14,2,'#5a5a62');a.q([14,2,16,-2,18,2,20,-2,22,2,24,-2,26,2],'#ffd23a')}],
 ['pole4','Шест «Бардака»','#ff5aa8','Победи Анжелу в клубе «Бардак»','Кусок того самого шеста. Пахнет блёстками и протеином.',
  a=>{a.r(18,2,4,36,'#c8c8d0');a.r(19,2,1,36,'#ffffff');a.e(20,38,9,2,'#8a8a92');for(let i=0;i<6;i++)a.p(6+i*6,6+((i*13)%26),i%2?'#ff5aa8':'#ffd23a');a.d(26,12,8,4,'#ff5aa8');a.d(5,22,8,4,'#3ef0b0')}],
 ['cheese5','Голова пармезана','#f0d070','Спаси Олесю в Италии (глава 5)','Целая голова. Олеся обещала поделиться, но не сказала когда.',
  a=>{a.e(20,24,16,11,'#d8b040');a.e(20,20,16,10,'#f0d070');a.q([20,20,36,16,36,26,20,30],'#e0c060');a.p(12,18,'#c8a030');a.p(16,22,'#c8a030');a.p(26,17,'#c8a030');a.d(10,14,20,2,'#fff6c8')}],
 ['saw6','Бензопила бати','#ff7a1a','Отбей Перелесье (глава 6)','Заводится с третьего раза. Кабачки под защитой.',
  a=>{a.r(4,16,18,12,'#ff7a1a');a.r(6,18,14,8,'#e0600e');a.r(8,10,10,6,'#2a2a30');a.r(22,19,16,6,'#c8c8d0');for(let i=0;i<8;i++)a.p(22+i*2,18+(i%2)*8,'#5a5a62');a.e(38,22,2,3,'#c8c8d0');a.d(6,18,6,1,'#ffb070')}],
 ['disc7','Золотой диск «Грибыча»','#ffd23a','Отыграй диджей-сет в «Грибыче» (глава 7)','Первый тираж «Бабуры». Играет только задом наперёд. Специально.',
  a=>{a.e(20,20,17,17,'#d8a830');a.e(20,20,15,15,'#ffd23a');a.e(20,20,10,10,'#e8b830');a.e(20,20,5,5,'#c8302a');a.e(20,20,1.5,1.5,'#111');a.d(10,9,8,2,'#fff6c8');a.d(8,12,3,2,'#fff6c8')}],
 ['post8','Последний постер','#b89aff','Закрой дедлайн в Екатеринбурге (глава 8)','Клей ещё не высох. Великий поставил в трекере зелёную галочку.',
  a=>{a.r(7,3,26,34,'#e8e4d8');a.r(9,5,22,14,'#5a3a7a');a.e(20,12,5,5,'#ffd23a');a.r(9,21,22,2,'#1a1a1e');a.r(9,25,16,2,'#5a5a62');a.r(9,29,19,2,'#5a5a62');a.q([24,30,28,34,36,24,34,22,28,30,26,28],'#3ef06a')}],
 ['gat9','Ни шагу назад','#ffa040','Удержи двор до рассвета (глава 9)','Гатлинг Ханжи остыл только к обеду. Шпиц оглох, но доволен.',
  a=>{for(let i=0;i<4;i++)a.r(10,10+i*3,26,2,i%2?'#5a5a62':'#3a3a40');a.r(4,8,8,16,'#2a2a30');a.e(8,16,4,6,'#4a4a52');a.r(5,24,6,12,'#3a3a40');a.r(2,34,12,3,'#2a2a30');a.q([36,8,40,4,40,26,36,22],'#ffd23a');a.p(39,12,'#fff6a0')}],
 ['crown10','Корона королевы','#ff3a4a','Пройди игру до конца','Крысиная корона. Тяжёлая, кривая и немного обгрызенная.',
  a=>{a.q([4,32,6,10,13,20,20,4,27,20,34,10,36,32],'#ffd23a');a.r(4,30,32,6,'#d8a830');a.e(20,14,2.5,2.5,'#ff3a4a');a.e(8,24,2,2,'#3ad8ff');a.e(32,24,2,2,'#3ef06a');a.e(20,33,2,2,'#ff3a4a');a.q([30,30,36,26,36,36],'#2a1a1a');a.d(10,22,4,1,'#fff6c8')}],
 ['k1000','Тысяча','#ff4fd8','Убей 1000 зомби (за все игры)','Счётчик сломался на тысяче. Ханжа завела новый.',
  a=>{a.e(20,17,13,12,'#e8e4d8');a.r(12,24,16,10,'#e8e4d8');a.e(14,17,4,4.5,'#1a1a1e');a.e(26,17,4,4.5,'#1a1a1e');a.q([19,22,21,22,20,26],'#1a1a1e');for(let i=0;i<4;i++)a.r(14+i*3.5,30,2,4,'#1a1a1e');a.e(14,17,1.4,1.4,'#ff4fd8');a.e(26,17,1.4,1.4,'#ff4fd8')}],
 ['nohit','Ни царапины','#3ef0b0','Пройди участок без единого попадания по тебе','Бронежилет даже не помялся. Подозрительно.',
  a=>{a.q([20,3,35,9,33,26,20,37,7,26,5,9],'#3ef0b0');a.q([20,7,31,11,29,25,20,33,11,25,9,11],'#1a3a34');a.q([13,19,18,25,28,13,30,15,18,29,11,21],'#3ef0b0');a.d(12,9,6,2,'#c8fff0')}],
 ['film21','Фотограф','#ffb04a','Собери все 21 кадр фотоплёнки','«Зенит» Шмакодявки снова заряжен. Кадр 22 — за тобой.',
  a=>{a.r(3,12,34,22,'#2a2a30');a.r(3,12,34,4,'#4a4a52');a.r(7,8,8,4,'#2a2a30');a.e(22,24,8,8,'#111114');a.e(22,24,6,6,'#3a5a7a');a.e(22,24,3,3,'#1a2a3a');a.d(19,21,2,2,'#c8e8ff');a.r(29,9,6,3,'#ffb04a');a.r(6,17,5,2,'#c8c8d0')}],
];
for(const [id,t,col,how,d,art] of ACH2){C1.addLeg(id,{t,col,how,d,draw:()=>{}});ACH[id]=art}
for(const c of C1.LEGS||[])if(ACH[c.id])c.icon=mkIcon(ACH[c.id]);
// условия новых достижений (проверка раз в секунду)
const ULK=id=>{if(!C1.LEGSET.has(id))C1.unlockLeg(id)};
const CHA={3:'king3',4:'pole4',5:'cheese5',6:'saw6',7:'disc7',8:'post8',9:'gat9',10:'crown10'};
setInterval(()=>{try{if(window.MIS&&MIS.on)return;
  for(const n in CHA){const o=window['C'+n];if(o&&o.on&&o.done)ULK(CHA[n])}
  let kt=0;try{kt=+localStorage.getItem('kills_total')||0}catch(e){}if(kt>=1000)ULK('k1000');
  const L=C1.engine&&C1.engine.L,S=L&&L.score;if(S&&S.done&&!S.hits&&S.kills>=8)ULK('nohit');
  if(PH.length&&PH.every(c=>has(c.id)))ULK('film21');
 }catch(e){}},1000);
// ---------- 3) ФОТОПЛЁНКА: поровну по главам, грубее пиксель ----------
const PH=COLS.filter(c=>c.photo);
// переезды: из глав 2–5 в главы 8–10
const MOVE={ph9:[9,['back9a'],'полка в гараже'],ph4:[9,['y9c','y9w'],'ящик с инструментами у подъезда'],ph18:[8,['sosedi8'],'комод у соседей'],ph10:[10,['fort10','vent10'],'ящик у крепостной стены'],ph12:[10,['emb10','fort10'],'скамейка у Невы']};
try{const S=C1.STASH;for(const k in S)S[k]=S[k].filter(e=>!MOVE[e[0]])}catch(e){}
PH.forEach(c=>{const m=/Глава (\d+)/.exec(c.where);c.ch=m?+m[1]:1;const mv=MOVE[c.id];if(mv){c.ch=mv[0];c.lv=mv[1];c.spot=mv[2];c.where='Глава '+mv[0]+' · '+mv[2]}});
PH.sort((a,b)=>a.ch-b.ch||(+a.id.slice(2))-(+b.id.slice(2)));
function coarse(c){const im=c.img;if(!im||c._coarse||!im.width)return;const w=72,h=96,cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(im,0,0,w,h);
  const d=g.getImageData(0,0,w,h),p=d.data;let s=7+(+c.id.slice(2))*13;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647};
  for(let i=0;i<p.length;i+=4){const x=(i/4)%w,y=(i/4/w)|0,vx=(x-w/2)/(w/2),vy=(y-h/2)/(h/2),vig=1-.16*(vx*vx+vy*vy),n=(rnd()-.5)*9;
    let r=p[i]*vig+n+8,gg=p[i+1]*vig+n+3,b=p[i+2]*vig+n-6;r=r*.92+18;gg=gg*.92+14;b=b*.9+16;
    const q=v=>Math.max(0,Math.min(255,Math.round(v/14)*14));p[i]=q(r);p[i+1]=q(gg);p[i+2]=q(b)}
  g.putImageData(d,0,0);c.img=cv;c._coarse=1;const ig=c.icon.getContext('2d');ig.imageSmoothingEnabled=false;ig.clearRect(0,0,c.icon.width,c.icon.height);ig.fillStyle='#f4f0e6';ig.fillRect(0,0,c.icon.width,c.icon.height);ig.drawImage(cv,0,12,72,72,2,2,c.icon.width-4,c.icon.height-4)}
// ---------- размещение на уровнях ----------
const hsh=s=>{let h=7;for(const ch of s)h=(h*31+ch.charCodeAt(0))>>>0;return h};
function reach(L){const gw=L.gw,gh=L.gh,g=L.g,dist=new Int32Array(gw*gh).fill(-1);let px=0,py=0;try{px=pl.x;py=pl.y}catch(e){}
  let s=Math.floor(py/4)*gw+Math.floor(px/4);if(g[s]!==0){let best=-1,bd=1e9;for(let i=0;i<gw*gh;i++)if(g[i]===0){const dx=i%gw-px/4,dy=((i/gw)|0)-py/4,dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=i}}s=best}
  if(s<0)return dist;const q=new Int32Array(gw*gh);let h=0,t=0;q[t++]=s;dist[s]=0;
  while(h<t){const i=q[h++],x=i%gw,y=(i/gw)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<1||ny<1||nx>=gw-1||ny>=gh-1)continue;const k=ny*gw+nx;if(g[k]===0&&dist[k]<0){dist[k]=dist[i]+1;q[t++]=k}}}return dist}
const roomy=(L,i)=>{const gw=L.gw,g=L.g;for(const o of [-1,1,-gw,gw,-gw-1,-gw+1,gw-1,gw+1])if(g[i+o]!==0)return false;return true};
function spotNear(L,dist,id){// у мебели (низкий объект рядом), достижимо
  const gw=L.gw,g=L.g,c=[];for(let i=0;i<dist.length;i++){if(dist[i]<8)continue;const n=[i-1,i+1,i-gw,i+gw].filter(k=>g[k]===2).length;if(n&&roomy(L,i-1)+roomy(L,i+1)+roomy(L,i-gw)+roomy(L,i+gw)>0)c.push(i)}
  if(!c.length)for(let i=0;i<dist.length;i++)if(dist[i]>=8&&[i-1,i+1,i-gw,i+gw].some(k=>g[k]!==0))c.push(i);
  if(!c.length)return null;const i=c[hsh(id)%c.length];return [(i%gw)*4+2,((i/gw)|0)*4+2]}
function spotFar(L,dist,id){// самый дальний закуток: в углу (2+ стены рядом), дальше всех от старта
  const gw=L.gw,g=L.g;let mx=0;for(const d of dist)mx=Math.max(mx,d);const c=[];
  for(let i=0;i<dist.length;i++){if(dist[i]<mx*.82)continue;const n=[i-1,i+1,i-gw,i+gw].filter(k=>g[k]!==0).length;if(n>=2)c.push(i)}
  if(!c.length)for(let i=0;i<dist.length;i++)if(dist[i]>=mx*.9)c.push(i);if(!c.length)return null;const i=c[hsh(id)%c.length];return [(i%gw)*4+2,((i/gw)|0)*4+2]}
const isMis=()=>!!(window.MIS&&MIS.on);
let lastL=null,wait=0;
const placedThisRun=new Set();
function place(L){if(!L||!L.g||!L.its||isMis())return;const dist=reach(L);
  // редкие + переехавшие фото
  for(const c of RARE.concat(PH)){if(!c.lv||COLSET.has(c.id)||(placedThisRun.has(c.id)&&!(window.REV&&REV.on)))continue;if(!c.lv.includes(L.id))continue;const s=spotNear(L,dist,c.id);if(!s)continue;placedThisRun.add(c.id);try{C1.stashCol(c.id,s[0],s[1],c.spot)}catch(e){}}
  // легендарное
  for(const c of LI){if(COLSET.has(c.id)||!c.lv.includes(L.id)||(placedThisRun.has(c.id)&&!(window.REV&&REV.on)))continue; // 04.11: при возврате на места — снова, пока не подобрана
const s=spotFar(L,dist,c.id);if(!s)continue;placedThisRun.add(c.id);
    const st={x:s[0],y:s[1],ph:0,get done(){return got||(performance.now()/1000)%7>.9}};let got=false;(L.stash||(L.stash=[])).push(st);
    L.its.push({x:s[0],y:s[1],r:11,label:()=>'Поднять: что-то тяжёлое',cond:()=>!got&&!COLSET.has(c.id),act:()=>{got=true;liFound(c)}});
    L._li=c.id}
}
function liFound(c){COLSET.add(c.id);save();sfx('ring');sfx('power',.6);try{C1.X.floatT(pl.x,pl.y-8,'★ ЛЕГЕНДАРНОЕ!',c.col)}catch(e){}
  C1.fire=null;C1.fireQ=false;C1.mdown=false;const n=LI.filter(k=>COLSET.has(k.id)).length;C1.colView={c:Object.assign({},c,{how:'найти в главе '+c.ch}),t:0,n,_li:n}}
const _up=update;update=function(dt){
  if(COLL.on){try{tm+=dt;updateMusic(dt)}catch(e){}return}
  _up(dt);
  try{for(const c of PH)if(c.img&&!c._coarse)coarse(c)}catch(e){}
  // старая галерея → новый экран
  if(C1.gal&&!C1.gal._x){const tab=C1.gal.tab==='leg'?'ach':'film';C1.gal=null;try{UP.galOn=false}catch(e){}try{if(window.TITLE)TITLE.legacy=false}catch(e){}open(tab)}
  try{const L=E.L;if(L&&state==='play'){if(L!==lastL){lastL=L;wait=5}if(wait>0&&--wait===0)place(L)}}catch(e){console.warn('coll',e)}
};
// ---------- ЭКРАН КОЛЛЕКЦИЙ ----------
const TABS=[['film','ФОТОПЛЁНКА','#ffb04a'],['leg','★ ЛЕГЕНДАРНОЕ','#ffd23a'],['rare','РЕДКИЕ НАХОДКИ','#3ef0b0'],['ach','ДОСТИЖЕНИЯ','#ff4fd8']];
const COLL={on:false,tab:'film',sel:{film:0,leg:0,rare:0,ach:0},view:null,t:0};window.COLL=COLL;
function open(tab){COLL.on=true;COLL.tab=tab||'film';COLL.view=null;COLL.t=0;sfx('click')}
function close(){COLL.on=false;COLL.view=null;sfx('click')}
COLL.open=open;COLL.close=close;COLL.LI=LI;COLL.RARE=RARE;COLL.PH=PH;
const has=id=>COLSET.has(id);
const listOf=t=>t==='film'?PH:t==='leg'?LI:t==='rare'?RARE:(C1.LEGS||[]);
const gotOf=(t,c)=>t==='ach'?C1.LEGSET.has(c.id):has(c.id);
const colsOf=t=>t==='film'?7:t==='leg'?5:t==='rare'?9:8;
const GEO=t=>t==='ach'?{cw:36,ch:68,gap:3,s:28}:{cw:56,ch:t==='leg'?64:136,gap:5,s:t==='leg'?36:44};
function tx(s,x,y,c,sz,b,al){uiFont(sz,b);u.fillStyle=c;u.textAlign=al||'left';u.fillText(s,x,y);u.textAlign='left'}
function wrap(s,x,y,w,lh,max,al){const ws=String(s).split(' ');let line='',n=0;u.textAlign=al||'left';for(const wd of ws){const t=line?line+' '+wd:wd;if(u.measureText(t).width>w&&line){u.fillText(line,x,y+n*lh);n++;line=wd;if(n>=max){u.textAlign='left';return n}}else line=t}if(line&&n<max){u.fillText(line,x,y+n*lh);n++}u.textAlign='left';return n}
function bg(){const g=u.createLinearGradient(0,0,W,H);g.addColorStop(0,'#1a0a28');g.addColorStop(.55,'#0c0816');g.addColorStop(1,'#0a1a1c');u.fillStyle=g;u.fillRect(0,0,W,H);
  u.fillStyle='rgba(255,79,216,.05)';for(let x=-H;x<W;x+=14){u.beginPath();u.moveTo(x,H);u.lineTo(x+H,0);u.lineTo(x+H+4,0);u.lineTo(x+4,H);u.fill()}
  u.fillStyle='rgba(0,0,0,.18)';for(let y=0;y<H;y+=2)u.fillRect(0,y,W,.5)}
function head(){u.save();u.textAlign='center';uiFont(7.5,true);u.shadowColor='#ff4fd8';u.shadowBlur=8;u.fillStyle='#ff4fd8';u.fillText('КОЛЛЕКЦИИ',W/2,10);u.shadowBlur=0;u.fillStyle='rgba(255,255,255,.85)';u.fillText('КОЛЛЕКЦИИ',W/2-.4,9.6);u.restore();
  TABS.forEach(([k,t,c],i)=>{const x=6+i*78,y=13,on=COLL.tab===k,L=listOf(k),n=L.filter(o=>gotOf(k,o)).length;
    u.save();if(on){u.shadowColor=c;u.shadowBlur=6}u.fillStyle=on?c:'rgba(255,255,255,.06)';u.fillRect(x,y,74,9);u.restore();u.fillStyle=c;u.fillRect(x,y+8.4,74,.6);
    tx(t+'  '+n+'/'+L.length,x+37,y+6.3,on?'#120a1c':c,4.1,true,'center')})}
function silh(ic,x,y,s,a){u.save();u.globalAlpha=a;u.filter='brightness(0)';u.drawImage(ic,x,y,s,s);u.restore();u.filter='none'}
// --- плёнка ---
const FX=(i)=>14+(i%7)*42,FY=(i)=>41+((i/7)|0)*46.5;
function filmTab(){tx('Плёнку из «Зенита» Шмакодявки растащило по всему свету: 21 кадр, по два-три в каждой главе. Сам «Зенит» тоже где-то там.',W/2,29,'#c8b090',3.5,false,'center');
  for(let r=0;r<3;r++){const y=FY(r*7)-6;u.fillStyle='#1c130c';u.fillRect(4,y,W-8,45);u.fillStyle='#2a1c10';u.fillRect(4,y,W-8,1);
    u.fillStyle='#0a0604';for(let x=8;x<W-8;x+=6){u.fillRect(x,y+1.6,3,2.2);u.fillRect(x,y+41.2,3,2.2)}tx('ПЛЁНКА 400   '+(r*7+1)+'–'+(r*7+7),W-10,y+44.4,'#a8702a',2.6,true,'right')}
  PH.forEach((c,i)=>{const x=FX(i),y=FY(i),got=has(c.id),sel=COLL.sel.film===i;u.fillStyle='#0a0604';u.fillRect(x-1,y-1,30,35);
    if(got){u.imageSmoothingEnabled=false;u.drawImage(c.img||c.icon,x,y,28,c.img?37.3:28)}else{u.fillStyle='#3a2414';u.fillRect(x,y,28,33);u.fillStyle='rgba(255,140,40,.18)';u.fillRect(x,y,28,33);tx('?',x+14,y+20,'#7a4a24',10,true,'center');tx('ГЛ. '+c.ch,x+14,y+30,'#a8702a',3.4,true,'center')}
    u.fillStyle='#1c130c';u.fillRect(x-1,y+33.4,30,4);tx((i+1)+'A',x+1,y+36.6,'#ffb04a',2.6,true);
    if(sel){u.save();u.strokeStyle='#ffb04a';u.shadowColor='#ffb04a';u.shadowBlur=6;u.lineWidth=1;u.strokeRect(x-1.5,y-1.5,31,35);u.restore()}})}
// --- карточки (легендарное, достижения) ---
function cardsTab(t){const L=listOf(t),n=colsOf(t),{cw,ch,gap,s:S0}=GEO(t),x0=(W-(n*cw+(n-1)*gap))/2;
  if(t==='leg')tx('Десять вещей с историей, по одной на главу. Спрятаны в самых дальних углах и почти не блестят. Наведи, чтобы прочитать подсказку.',W/2,30,'#c8b878',3.5,false,'center');
  L.forEach((c,i)=>{const x=x0+(i%n)*(cw+gap),y=35+((i/n)|0)*(ch+4),got=gotOf(t,c),sel=COLL.sel[t]===i,col=c.col||'#ffd23a';
    u.save();if(got){u.shadowColor=col;u.shadowBlur=7+4*Math.sin(tm*3+i)}u.fillStyle=got?'rgba(22,14,34,.96)':'rgba(255,255,255,.035)';u.fillRect(x,y,cw,ch);u.restore();
    u.strokeStyle=sel?'#ffffff':got?col:'#3a3448';u.lineWidth=sel?1.2:got?1:.6;u.strokeRect(x,y,cw,ch);
    const s=S0;u.imageSmoothingEnabled=false;if(got)u.drawImage(c.icon,x+(cw-s)/2,y+4,s,s);else silh(c.icon,x+(cw-s)/2,y+4,s,.75);
    uiFont(3.9,true);u.fillStyle=got?col:'#6a6278';wrap(got?c.t:'???',x+cw/2,y+s+10,cw-4,4.6,2,'center');
    uiFont(3.2,false);u.fillStyle=got?'#9a92b0':'#8a82a0';if(t==='leg')u.fillText('',0,0),wrap('Глава '+c.ch,x+cw/2,y+ch-3,cw-4,4,1,'center');else wrap(c.how,x+cw/2,y+ch-(t==='ach'?14:18),cw-4,t==='ach'?3.8:4.2,t==='ach'?3:4,'center')})}
// --- редкие ---
function rareTab(){tx('Пасхалки в тайниках: ищи искорки на мебели, в ящиках и багажниках.',W/2,30,'#a8d8c8',3.5,false,'center');
  const n=9,cw=33,ch=45,x0=(W-n*(cw+1))/2;RARE.forEach((c,i)=>{const x=x0+(i%n)*(cw+1),y=35+((i/n)|0)*(ch+1),got=has(c.id),sel=COLL.sel.rare===i;
    u.fillStyle=got?'rgba(62,240,176,.07)':'rgba(255,255,255,.03)';u.fillRect(x,y,cw,ch);u.fillStyle=got?'#3ef0b0':'#3a3448';u.fillRect(x,y,cw,.8);
    u.imageSmoothingEnabled=false;if(got)u.drawImage(c.icon,x+4,y+3,25,25);else silh(c.icon,x+4,y+3,25,.6);
    uiFont(3,true);u.fillStyle=got?'#e8e4f0':'#6a6278';wrap(got?c.t:'???',x+cw/2,y+32,cw-3,3.6,2,'center');tx('гл. '+c.ch,x+cw/2,y+ch-1.6,got?'#3ef0b0':'#5a5468',2.8,true,'center');
    if(sel){u.save();u.strokeStyle='#3ef0b0';u.shadowColor='#3ef0b0';u.shadowBlur=6;u.lineWidth=1;u.strokeRect(x-.5,y-.5,cw+1,ch+1);u.restore()}})}
// --- просмотр ---
function viewDraw(){const {t,c}=COLL.view,got=gotOf(t,c),col=t==='film'?'#ffb04a':c.col||(t==='rare'?'#3ef0b0':'#ffd23a');
  u.fillStyle='rgba(6,3,14,.9)';u.fillRect(0,0,W,H);u.imageSmoothingEnabled=false;let tx0;
  if(t==='film'){const ih=150,iw=ih*.75,ix=18,iy=15;u.fillStyle='#f4f0e6';u.fillRect(ix-4,iy-4,iw+8,ih+16);
    if(got&&c.img)u.drawImage(c.img,ix,iy,iw,ih);else{u.fillStyle='#3a2414';u.fillRect(ix,iy,iw,ih);tx('?',ix+iw/2,iy+ih/2+12,'#7a4a24',40,true,'center')}
    tx('кадр '+(PH.indexOf(c)+1)+' / 21',ix+iw/2,iy+ih+9,'#8a7a6a',4,true,'center');tx0=ix+iw+18}
  else{const s=120,x=16,y=(H-s)/2;u.save();u.shadowColor=col;u.shadowBlur=got?18+8*Math.sin(tm*3):0;u.fillStyle='#140e20';u.fillRect(x,y,s,s);u.restore();u.strokeStyle=got?col:'#3a3448';u.lineWidth=1.2;u.strokeRect(x,y,s,s);
    if(got)u.drawImage(c.icon,x+12,y+12,s-24,s-24);else silh(c.icon,x+12,y+12,s-24,.8);tx0=x+s+16}
  const tw=W-tx0-12;tx(t==='film'?'ФОТОПЛЁНКА':t==='leg'?'★ ЛЕГЕНДАРНЫЙ ПРЕДМЕТ':t==='rare'?'РЕДКАЯ НАХОДКА':'★ ДОСТИЖЕНИЕ',tx0,30,col,4.6,true);
  uiFont(8.5,true);u.fillStyle='#ffffff';const nl=wrap(got?c.t.replace(/^Фото: /,''):'???',tx0,44,tw,9.5,3);
  uiFont(5.4,false);u.fillStyle='#e8e4f0';wrap(got?c.d:(t==='leg'?'Ещё не найден. Подсказка: '+c.hint+'.':t==='ach'?'Ещё не открыто.':'Ещё не найдено.'),tx0,48+nl*9.5+4,tw,7.4,6);
  tx(t==='ach'?'Как получить: '+c.how:t==='leg'?'Глава '+c.ch:c.where,tx0,150,'#9a92b0',4.4,false);
  tx(touch.on?'Коснись, чтобы вернуться':'Esc / клик — назад · ←/→ — листать',tx0,H-10,'#6a6280',4,false)}
function drawColl(){if(!COLL.on)return;const k=ui.width/W;u.save();u.setTransform(k,0,0,k,0,0);
  bg();if(COLL.view)viewDraw();else{head();const t=COLL.tab;if(t==='film')filmTab();else if(t==='rare')rareTab();else cardsTab(t);
    tx(touch.on?'Коснись вкладки или карточки · мимо — закрыть':'Tab / A,D — вкладки · стрелки — выбор · E — рассмотреть · Esc — закрыть',W/2,H-2,'#6a6280',3.6,false,'center')}
  u.restore()}
const _R=render;render=function(){_R();try{const v=C1.colView;if(v&&v._li&&state==='play'){const k=ui.width/W;u.save();u.setTransform(k,0,0,k,0,0);u.globalAlpha=Math.min(1,v.t*4);u.fillStyle='#0b0812';u.fillRect(W-120,4,116,14);tx('★ ЛЕГЕНДАРНОЕ '+v._li+'/10  · пауза',W-10,14,'#ffd23a',5,true,'right');u.restore()}drawColl()}catch(e){console.warn(e)}};
// --- ввод ---
function hit(p){if(COLL.view)return {back:1};if(p.y>=12&&p.y<=23){for(let i=0;i<4;i++){const x=6+i*78;if(p.x>=x&&p.x<=x+74)return {tab:TABS[i][0]}}}
  const t=COLL.tab,L=listOf(t);for(let i=0;i<L.length;i++){let x,y,w,h;
    if(t==='film'){x=FX(i)-1;y=FY(i)-1;w=30;h=38}
    else if(t==='rare'){const n=9,cw=33,ch=45,x0=(W-n*(cw+1))/2;x=x0+(i%n)*(cw+1);y=35+((i/n)|0)*(ch+1);w=cw;h=ch}
    else{const n=colsOf(t),{cw,ch,gap}=GEO(t),x0=(W-(n*cw+(n-1)*gap))/2;x=x0+(i%n)*(cw+gap);y=35+((i/n)|0)*(ch+4);w=cw;h=ch}
    if(p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h)return {i}}return null}
function openView(i){const t=COLL.tab,c=listOf(t)[i];if(!c)return;if(t==='film'&&!has(c.id))return;COLL.view={t,c};sfx('click')}
function pt(e){const q=e.changedTouches?e.changedTouches[0]:e;return q?{x:(q.clientX-OX)/SC,y:(q.clientY-OY)/SC}:null}
(window.__pre=window.__pre||[]).unshift(function(e){
  const ty=e.type;
  if(!COLL.on){if(ty==='keydown'&&e.code==='KeyK'&&!e.repeat&&state==='play'&&!(window.UP&&UP.isOpen&&UP.isOpen())&&!dlg&&!cut&&!(window.MG&&MG.active)&&!C1.colView){open('film');return true}return false}
  if(e.changedTouches){touch.on=true}
  if(ty==='keydown'){if(e.repeat&&!/Arrow|Key[WASD]/.test(e.code))return true;const t=COLL.tab,L=listOf(t),n=colsOf(t);
    if(COLL.view){if(/Arrow(Left|Right)|Key[AD]/.test(e.code)){const d=/Left|KeyA/.test(e.code)?-1:1;let i=L.indexOf(COLL.view.c);for(let k=0;k<L.length;k++){i=(i+d+L.length)%L.length;if(t!=='film'||has(L[i].id))break}COLL.sel[t]=i;COLL.view={t,c:L[i]};sfx('click',.6)}else COLL.view=null;return true}
    if(e.code==='Escape'||e.code==='KeyK'){close();return true}
    if(e.code==='Tab'||e.code==='KeyQ'||e.code==='KeyR'){const i=TABS.findIndex(x=>x[0]===t);COLL.tab=TABS[(i+(e.code==='KeyQ'||e.shiftKey?3:1))%4][0];sfx('click');return true}
    let s=COLL.sel[t];if(e.code==='ArrowRight'||e.code==='KeyD')s++;else if(e.code==='ArrowLeft'||e.code==='KeyA')s--;else if(e.code==='ArrowDown'||e.code==='KeyS')s+=n;else if(e.code==='ArrowUp'||e.code==='KeyW')s-=n;
    else if(['KeyE','Enter','Space'].includes(e.code)){openView(s);return true}
    if(s!==COLL.sel[t]){COLL.sel[t]=Math.max(0,Math.min(L.length-1,s));sfx('click',.5)}return true}
  if(ty==='mousemove'){const p=pt(e);const h=p&&!COLL.view&&hit(p);if(h&&h.i!=null)COLL.sel[COLL.tab]=h.i;return true}
  if(ty==='mousedown'||ty==='touchstart'){const p=pt(e);const h=p&&hit(p);if(COLL.view){COLL.view=null;sfx('click');return true}
    if(!h){close();return true}if(h.tab){COLL.tab=h.tab;sfx('click');return true}if(h.i!=null){COLL.sel[COLL.tab]=h.i;openView(h.i)}return true}
  return true});
})();
