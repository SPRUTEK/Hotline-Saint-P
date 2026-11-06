// =====================================================================
//  sortie.js — вылазки (замысел Натальи 02.11): стенд с картой во дворе,
//  локации с уровнями сложности, доп. задания перед основными миссиями.
//  Сейчас: пролог — мини-маркет «Продукты 24» через дорогу (ур.1, машины
//  носятся — перебегать с умом) и задний двор с заданием Ханжи (ур.1).
//  Остальные локации на карте видны, но закрыты (в работе).
//  Подключается после cars.js. Наружу: window.SORTIE, глава-объект window.CS.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.engine||!C1.X||!window.K56||!window.UP||!UP.SV){console.warn('sortie: нет движка');return}
const E=C1.engine,X=C1.X,PS=C1.PS,K=K56,TAU=Math.PI*2,sfx=X.sfx,D2=(a,b,c,d)=>Math.hypot(c-a,d-b);
const B=(x,y,w,h,c)=>X.B(x,y,w,h,c);
const CS={on:false,flags:{}};window.CS=CS;
const SO={};window.SORTIE=SO;
function sv(){const s=UP.SV();if(!s.so)s.so={pro:0,done:{},open:{}};s.food=s.food|0;s.water=s.water|0;return s}
function so(){return sv().so}
function save(){try{UP.persist()}catch(e){}}
const fmt=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');

// ---------------- список локаций карты ----------------
const LOCS=[
  {id:'mm',n:'Мини-маркет «Продукты 24»',lv:1,how:'пешком, через дорогу',loot:'еда, вода',ch:1},
  {id:'by',n:'Задний двор',lv:1,how:'пешком',loot:'стройматериалы, гвоздомёт',ch:1},
  {id:'oz',n:'Озон и ВБ',lv:2,how:'пешком, в конец дома напротив',loot:'коробки, одежда, электроника',ch:2,when:'перед «Сити Моллом»'},
  {id:'gas',n:'Заправка',lv:3,how:'на Land Rover',loot:'канистры бензина',ch:2,car:1,fuel:0,when:'вместе с ВБ'},
  {id:'vape',n:'Табачка',lv:3,how:'Land Rover + малая парковка',loot:'вейп-дымовуха',ch:4,car:1,fuel:2,need:{tank:1},when:'перед Алкопатименом'},
  {id:'lenta',n:'Лента',lv:4,how:'Land Rover через калитку + большая парковка',loot:'много еды и воды, пожарный топор',ch:5,car:1,fuel:3,need:{tank:2,arm:1},when:'перед Италией'},
  {id:'dns',n:'ДНС',lv:4,how:'Land Rover, дальше Ленты',loot:'электроника, ядро, флешка',ch:7,car:1,fuel:3,need:{tank:2,tire:2},when:'перед Бабурой'},
  {id:'bunk',n:'Военный бункер',lv:5,how:'Land Rover, самый дальний',loot:'армейское, уникальные стволы, Прапор',ch:8,car:1,fuel:4,need:{tank:3,arm:2,eng:2,tire:2},flash:1,when:'перед Екатеринбургом'},
];
SO.LOCS=LOCS;
const REQ={2:['oz','gas'],4:['vape'],5:['lenta'],7:['dns'],8:['bunk']};SO.REQ=REQ;
const GN={tank:'бак',arm:'броня',eng:'мотор',tire:'шины'};
function curCh(){for(const n of [10,9,8,7,6,5,4,3,2])if(window['C'+n]&&window['C'+n].on)return n;return 1}
SO.curCh=curCh;
function isOpen(l){const s=so();if(s.done[l.id])return true;const ch=CS.hubCh||curCh();
  if(l.id==='mm')return s.pro>=1||!!C1.called||ch>=2;if(l.id==='by')return s.pro>=3||!!C1.called||ch>=2;return ch>=l.ch}
function blockOf(l){const s=sv(),o=s.so,car=s.car||{};
  if(l.car){const f=l.fuel|0;if((s.fuelC|0)<f)return 'нужно канистр: '+f+' (есть '+(s.fuelC|0)+')';
    if(l.need){const m=[];for(const k in l.need)if((car[k]|0)<l.need[k])m.push(GN[k]+' '+l.need[k]);if(m.length)return 'прокачай в гараже: '+m.map(x=>x.replace(/ (\d)$/,' до ур.$1')).join(', ')}}
  if(l.flash&&!o.flash)return 'нужна флешка с координатами (ДНС)';
  const req=(REQ[CS.hubCh||curCh()]||[]).includes(l.id)&&!o.done[l.id];
  if(!req&&(o.optN|0)>=2&&(CS.hubCh||curCh())>=2)return 'перед миссией — не больше 2 повторов';
  return null}
function lockText(l){if(l.id==='by'&&!isOpen(l))return 'задание Ханжи';return 'откроется '+(l.when||'по сюжету')}

// ================= КАРТА (оверлей) =================
const MAP={on:false,sel:0,rows:[],close:null};
function openMap(){MAP.on=true;MAP.sel=Math.max(0,LOCS.findIndex(l=>isOpen(l)&&!so().done[l.id]));if(MAP.sel<0)MAP.sel=0;lockMove=true;C1.mdown=false;C1.fire=null;sfx('click')}
function closeMap(){MAP.on=false;lockMove=false;sfx('click')}
SO.openMap=openMap;SO.isMap=()=>MAP.on;
function choose(i){const l=LOCS[i];if(!l)return;MAP.sel=i;
  if(!isOpen(l)){sfx('hit',.4);note(l.n+': '+lockText(l));return}
  const bl=blockOf(l);if(bl){sfx('hit',.4);note(l.n+': '+bl);return}
  MAP.on=false;lockMove=true;sfx('click');X.go(()=>{lockMove=false;start(l)})}
function drawMap(){
  const k=ui.width/W;u.setTransform(k,0,0,k,0,0);
  u.fillStyle='rgba(6,4,12,.82)';u.fillRect(0,0,W,H);
  const x0=18,y0=10,w=W-36,h=H-20;
  u.fillStyle='#d8c9a0';u.fillRect(x0,y0,w,h);u.fillStyle='#c8b88c';for(let i=0;i<w;i+=16)u.fillRect(x0+i,y0,1,h);for(let i=0;i<h;i+=16)u.fillRect(x0,y0+i,w,1);
  u.fillStyle='#3a2a1a';u.fillRect(x0,y0,w,2);u.fillRect(x0,y0+h-2,w,2);u.fillRect(x0,y0,2,h);u.fillRect(x0+w-2,y0,2,h);
  uiFont(6.4,true);u.fillStyle='#3a1a10';u.textAlign='center';u.fillText('КАРТА ВЫЛАЗОК',W/2,y0+10);u.textAlign='left';
  uiFont(3.8,false);u.fillStyle='#5a4a30';const sv0=sv();u.fillText('Канистры: '+(sv0.fuelC|0)+' · еда '+(sv0.food|0)+' · вода '+(sv0.water|0)+' · повторов перед миссией: '+(sv0.so.optN|0)+'/2',x0+8,y0+17);
  MAP.rows=[];const s=so();
  LOCS.forEach((l,i)=>{const y=y0+22+i*16,op=isOpen(l),dn=s.done[l.id]|0,sel=i===MAP.sel;
    MAP.rows.push([x0+6,y,w-12,15]);
    u.fillStyle=sel?(op?'rgba(255,210,58,.55)':'rgba(120,100,80,.35)'):'rgba(255,255,255,.18)';u.fillRect(x0+6,y,w-12,15);
    if(sel){u.fillStyle='#3a1a10';u.fillRect(x0+6,y,2,15)}
    uiFont(5,true);u.fillStyle=op?'#2a1408':'#7a6a58';u.fillText((op?'':'🔒 ')+l.n,x0+11,y+6.5);
    const cl=l.lv>=4?'#a01818':l.lv>=3?'#c05a10':'#6a5a20';for(let j=0;j<5;j++){u.fillStyle=j<l.lv?cl:'rgba(90,70,40,.25)';u.fillRect(x0+w-50+j*7,y+3,5,5)}uiFont(3.4,true);u.fillStyle=cl;u.fillText('СЛОЖН. '+l.lv,x0+w-50,y+12.5);
    uiFont(3.6,false);u.fillStyle=op?'#4a3a28':'#8a7a68';const bl=op&&blockOf(l),rq=op&&(REQ[CS.hubCh||curCh()]||[]).includes(l.id)&&!dn;if(bl)u.fillStyle='#a03018';else if(rq)u.fillStyle='#1a6a2a';u.fillText(op?(bl?'⛔ '+bl:(rq?'ОБЯЗАТЕЛЬНО · ':'')+l.how+' · '+l.loot+(dn?' · пройдено ×'+dn:'')+(l.car?' · канистр: '+(l.fuel|0):'')):lockText(l),x0+11,y+12.5);
  });
  uiFont(3.8,true);u.fillStyle='#3a2a1a';u.textAlign='center';
  u.fillText(touch.on?'Нажми на локацию, чтобы пойти · ✕ — закрыть':'W/S — выбор · E — идти · Esc — закрыть',W/2,y0+h-4);u.textAlign='left';
  MAP.close=[x0+w-14,y0+3,11,10];u.fillStyle='#3a1a10';u.fillRect(...MAP.close);uiFont(6,true);u.fillStyle='#fff';u.fillText('✕',x0+w-12,y0+11);
}
const toXY=e=>({x:(e.clientX-OX)/SC,y:(e.clientY-OY)/SC});
const inR=(p,x,y,w,h)=>p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h;
(window.__pre=window.__pre||[]).unshift(function(e){
  if(!MAP.on||state!=='play')return false;const t=e.type;
  if(t==='keydown'){if(e.repeat&&!/Arrow|Key[WS]/.test(e.code))return true;
    if(e.code==='Escape'||e.code==='KeyQ'||e.code==='KeyM')closeMap();
    else if(e.code==='KeyW'||e.code==='ArrowUp'){MAP.sel=(MAP.sel+LOCS.length-1)%LOCS.length;sfx('click')}
    else if(e.code==='KeyS'||e.code==='ArrowDown'){MAP.sel=(MAP.sel+1)%LOCS.length;sfx('click')}
    else if(['KeyE','Enter','Space'].includes(e.code))choose(MAP.sel);
    return true}
  if(t==='mousedown'||t==='touchstart'){const p=toXY(e.changedTouches?e.changedTouches[0]:e);if(e.changedTouches)touch.on=true;
    if(MAP.close&&inR(p,MAP.close[0]-3,MAP.close[1]-3,MAP.close[2]+6,MAP.close[3]+6)){closeMap();return true}
    const i=MAP.rows.findIndex(r=>inR(p,...r));if(i>=0){if(i===MAP.sel||touch.on)choose(i);else{MAP.sel=i;sfx('click')}}return true}
  if(t==='wheel'){MAP.sel=(MAP.sel+(e.deltaY>0?1:LOCS.length-1))%LOCS.length;return true}
  return t!=='mousemove';
});
const _render=render;
render=function(){_render();if(MAP.on&&state==='play')try{drawMap()}catch(err){console.warn(err)}};
setInterval(()=>{if(MAP.on&&(state!=='play'||!C1.on))MAP.on=false},500);

// стенд с картой — на любом дворе
function addStand(L,x,y){const f=E.freeSpot(x,y,6,40)||[x,y];const st={x:f[0],y:f[1]};L.soStand=st;
  L.its.push({x:st.x,y:st.y,r:15,label:()=>'Стенд: карта вылазок',act:openMap});
  const du=L.drawUnder;L.drawUnder=()=>{if(du)du();const x=st.x,y=st.y;
    F(x-9,y-12,18,12,'#5a4028');F(x-8,y-11,16,10,'#d8c9a0');F(x-6,y-9,5,3,'#6a8a4a');F(x+1,y-8,5,4,'#8a8aa0');F(x-4,y-5,8,1,'#c03a2a');F(x-1,y-10,1,6,'#c03a2a');
    F(x-8,y,2,4,'#3a2a1a');F(x+6,y,2,4,'#3a2a1a');
    if(Math.sin(tm*4)>0){F(x-1,y-15,2,2,'#ffd23a')}}}
SO.addStand=addStand;

// ================= ПРОЛОГ =================
// so.pro: 0 — ещё не начато; 1 — идти в мини-маркет; 2 — маркет пройден, к Ханже;
// 3 — задний двор; 4 — материалы принесены, ставим баррикады; 5 — домой, ждать звонка Аниса.
function inPro(){return !C1.called&&S.step===10}
// Шмакодявка в квартире
const shIt=IT[0],shA=shIt.act;
shIt.act=function(){const s=so();
  if(inPro()&&s.pro<5){
    if(s.pro===0){say([['m','Всё. Бита, пистолет и коробка патронов от бати.'],['s','Зай, я проверила холодильник. Еды на день, воды — одна бутылка.'],['c','Мяу. (Корма — ноль. Я считал.)'],
      ['s','Через дорогу «Продукты 24». Там наверняка всё бросили.'],['m','Через дорогу... Там же машины носятся, как бешеные. Все бегут из города.'],
      ['s','Вот и беги с умом. Принеси еды и воды. И корм коту.'],['m','Понял. Во дворе Ханжа повесила какую-то карту, гляну.']],()=>{s.pro=1;save();note('Выйди во двор: стенд с картой вылазок')});return}
    if(s.pro===1){say([['s','Еда и вода, зай. Мини-маркет через дорогу. Карта во дворе.']]);return}
    if(s.pro<=4){say([['s','Ханжа что-то от тебя хотела. Иди, а то обидится.']]);return}
  }
  shA()};
const exitIt=IT.find(i=>{try{return /Входная|Выйти/.test(i.label())}catch(e){return false}});
if(exitIt){const exL=exitIt.label,exA=exitIt.act;
  exitIt.label=()=>{const s=so();if(inPro()&&s.pro>=1&&s.pro<5)return 'Выйти во двор';return exL()};
  exitIt.act=function(){const s=so();if(inPro()&&s.pro>=1&&s.pro<5){toFort();return}
    if(inPro()&&s.pro>=5){say([['m','Ханжа сказала ждать дома. Поговорю со Шмакодявкой.']]);return}
    if(S.step===11&&C1.called&&!C1.done)eat();exA()}}
function toFort(){lockMove=true;X.go(()=>{lockMove=false;S.fade=0;CS.pre=1;C1.noFortHi=so().pro>1;C1.go('fort');C1.noFortHi=false;CS.pre=0})}
// ---- флаги глав: K.sec гасит C2..C6, а нам надо остаться в своей главе (сохранения, квартира) ----
function snapOn(){const r={};for(const n of [2,3,4,5,6,7,8,9,10]){const o=window['C'+n];if(o)r[n]=!!o.on}return r}
function restoreOn(){const r=CS.chOn;if(!r)return;for(const n in r){const o=window['C'+n];if(o)o.on=r[n]}}
SO.restoreOn=restoreOn;
function toFlat(){lockMove=true;X.go(()=>{lockMove=false;C1.on=false;C1.mode=null;CS.on=false;K.on=null;K.hud=null;C1.retry=null;restoreOn();CS.hub=0;CS.hubCh=0;scene='flat';cut=null;dlg=null;S.fade=0;state='play';
  music('flat');pl.scoot=false;pl.x=212;pl.y=204;pl.a=Math.PI;pl.ma=Math.PI;lastRoom=null;mapDirty=true;
  if(so().pro>=5&&inPro())after(.6,()=>note('Поговори со Шмакодявкой'))})}
SO.toFlat=toFlat;
// хаб: двор перед миссией (гл.2+)
function toHub(){CS.chOn=snapOn();CS.hubCh=curCh();lockMove=true;X.go(()=>{lockMove=false;S.fade=0;enterHub()})}
function enterHub(){CS.hub=1;C1.noFortHi=true;C1.go('fort');C1.noFortHi=false;restoreOn();music('flat')}
SO.toHub=toHub;
// еда и вода на миссию (Е1/Е2)
function eat(){const s=sv();if(s.food>0&&s.water>0){s.food--;s.water--;note('Паёк на миссию: −1 еда, −1 вода (осталось '+s.food+' / '+s.water+')')}
  else{CS.hungryM=1;note('Нет еды и воды! Выходишь голодным: половина здоровья')}s.so.optN=0;save()}
SO.eat=eat;
function missing(ch){const o=so();return (REQ[ch]||[]).filter(id=>!o.done[id])}
const LN=id=>(LOCS.find(l=>l.id===id)||{}).n||id;
setTimeout(()=>{ // двери миссий в квартире
  for(const it of IT){let lb='';try{lb=it.label()}catch(e){}if(!/^Выйти: /.test(lb)||/титры/.test(lb)||it._so)continue;it._so=1;const a0=it.act;
    it.act=function(){const ch=curCh(),m=missing(ch);if(m.length){const who=ch===2||ch===5?'s':'m';
        say([[who,'Перед миссией надо сходить на вылазку: '+m.map(LN).join(', ')+'.'],[who,'Карта вылазок — на стенде во дворе. Иду во двор.']],()=>toHub());return}
      eat();a0.call(this)}}
  IT.push({x:190,y:198,r:12,label:()=>'Во двор: карта вылазок',cond:()=>scene==='flat'&&state==='play'&&!C1.on&&!(UP.ui)&&curCh()>=2&&IT.some(q=>q._so&&(!q.cond||q.cond())),act:()=>toHub()});
},0);

C1.fortHook=function(L,FORT,N){const s=so();
  const hzIt=L.its.find(i=>{try{return /Ханжой/.test(i.label())}catch(e){return false}});
  addStand(L,170,128);
  if(CS.hub){hubYard(L,FORT,N,hzIt);return}
  if(!inPro()){ // обычный двор после звонка Аниса: двор уже укреплён в прологе
    if(s.pro>=5||C1.called){FORT.spots.forEach(q=>q.done=true);FORT.talked=true}
    return}
  // пролог до звонка
  L.its.push({x:206,y:100,r:14,label:()=>'Домой (подъезд)',act:toFlat});
  if(s.pro>=5){FORT.spots.forEach(q=>q.done=true);FORT.talked=true}
  else if(s.pro===4)FORT.talked=true;
  if(hzIt)hzIt.act=()=>proHanzha(FORT);
  const ob=L.obj;
  L.obj=()=>{const s=so();
    if(s.pro===1)return['Стенд с картой (у подъезда): мини-маркет'];
    if(s.pro===2)return['Поговорить с командиром Ханжой (у калитки)'];
    if(s.pro===3)return['Стенд с картой: задний двор','Найти стройматериалы для Ханжи'];
    if(s.pro===4){const n=FORT.spots.filter(q=>q.done).length;if(n<3)return ob();return['Доложить командиру Ханже']}
    return['Домой: ждать новостей (подъезд)']};
  if(s.pro===2&&!CS.hzGreet){CS.hzGreet=1;after(.8,()=>say([['H','Боец! Ко мне! Видела, как ты дорогу перебегал. Живой — уже хорошо.']]))}
};
function proHanzha(FORT){const s=so();
  if(s.pro===1){if(!CS.hz1){CS.hz1=1;say([['H','Стоять! Кто идёт?! ...А, это ты, Микроб. Вольно.'],['m','Тётушка Ханжа?! Это что... камуфляж?'],['H','Командир Ханжа. С сегодняшнего дня двор — крепость.'],
      ['H','За продуктами? Правильно. Стенд с картой у подъезда, я все точки отметила.'],['H','Через дорогу — смотри по сторонам. Машины не тормозят. Одного уже размазало.']]);return}
    say([['H','Карта у подъезда. Мини-маркет через дорогу. Смотри по сторонам, боец!']]);return}
  if(s.pro===2){say([['H','Вернулся? С продуктами? Молодец, боец.'],['H','Теперь задание от командира. Забор у нас дырявый, щиты делать не из чего.'],
      ['H','За калиткой задний двор: гаражи, стройка. Там доски, мешки с песком, сетка-рабица. Неси всё сюда.'],
      ['m','А зомби там есть?'],['H','Полно. Заодно и зачистишь. Говорят, у гаражей ходит здоровый такой... Палыч. Бывший.'],['H','На карте отметила. Шагом марш!']],()=>{s.pro=3;save();note('Задний двор открыт на карте')});return}
  if(s.pro===3){say([['H','Задний двор, боец. Доски, мешки, сетка. Без материалов не возвращайся.']]);return}
  if(s.pro===4){const n=FORT.spots.filter(q=>q.done).length;
    if(!FORT.talked){FORT.talked=true}
    if(n<3){say([['H',PS.carry?'Неси к забору, там где мигает. Бегом!':'Щиты я сколотила, лежат в куче у машин справа. Три штуки к забору, живо!']]);return}
    say([['H','Молодец, боец. Двор закрыт. Тут теперь безопасно, хоть конец света.'],['H','Шмакодявку твою и кота мы прикроем. Слово командира.'],['m','Спасибо, тётушка... то есть командир.'],
      ['H','Иди домой, отдохни. Если что, карта у подъезда. Всё, что открыли, можно обойти ещё раз.']],()=>{s.pro=5;save();note('Иди домой: подъезд')});return}
  say([['H','Чего встал? Домой, боец. Отдыхай.']]);
}

function hubYard(L,FORT,N,hzIt){const s=sv(),o=s.so,ch=CS.hubCh||curCh();
  FORT.spots.forEach(q=>q.done=true);FORT.talked=true;FORT.briefed=false;
  L.its=L.its.filter(it=>{let lb='';try{lb=it.label()}catch(e){}return !/самокат|щит-баррикаду/i.test(lb)});
  L.its.push({x:206,y:100,r:14,label:()=>'Домой (подъезд)',act:toFlat});
  // Land Rover у будки: гараж
  const rv={x:326,y:186};E.gfill(rv.x-9,rv.y-15,rv.x+9,rv.y+15,2);
  if(ch>=2){const du=L.drawUnder;L.drawUnder=()=>{if(du)du();if(window.ROVER_DRAW)try{ROVER_DRAW(rv.x,rv.y,-Math.PI/2,-Math.PI/2+Math.sin(tm*.6)*.4,false,false)}catch(e){}};
    L.its.push({x:rv.x,y:rv.y+18,r:16,label:()=>'Гараж: Land Rover (бак, мотор, шины, броня)',act:()=>UP.open('garage','garage')});
    if(!WD_own('sawn'))L.its.push({x:rv.x-16,y:rv.y,r:12,label:()=>'Брезент в углу гаража',cond:()=>!WD_own('sawn'),act:()=>{if(window.ARS)ARS.grant('sawn','Под брезентом: ')}});}
  L.its.push({x:258,y:230,r:12,label:()=>'Михалыч: канистра бензина (1 500 ₽)',cond:()=>ch>=2,act:()=>{const s=sv();if(s.rub<1500){note('Не хватает рублей: 1 500 ₽');sfx('thump',1.6);return}s.rub-=1500;s.fuelC=(s.fuelC|0)+1;save();sfx('coin');note('Михалыч: «Последняя. Почти.» Канистр: '+s.fuelC)}});
  if(o.prap)L.its.push({x:150,y:150,r:12,label:()=>'Рация Прапора: армейская лавка',act:()=>openPrap()});
  if(hzIt)hzIt.act=()=>{const m=missing(ch);
    if(ch>=2&&!o.gift2){o.gift2=1;s.fuelC=(s.fuelC|0)+3;save();say([['H','Боец! Держи. Три канистры из моих запасов. На заправку съездить хватит.'],['H','Дальше — сами. Бензин теперь дороже патронов.']]);return}
    if(m.length){say([['H','Перед миссией: '+m.map(LN).join(', ')+'. Карта у подъезда.']]);return}
    say([['H',['Двор держим. Иди, боец, тебя ждут.','Бензин береги. И еду.','Если что — карта у подъезда. Только не увлекайся.'][(Math.random()*3)|0]]])};
  L.obj=()=>{const m=missing(ch),r=[];if(m.length)r.push('Обязательно: '+m.map(LN).join(', '));r.push('Стенд с картой — у подъезда');if(ch>=2)r.push('Канистр: '+(sv().fuelC|0)+' · еда '+sv().food+' · вода '+sv().water);r.push('Домой — подъезд');return r};
  if(ch>=2&&!o.gift2)after(.7,()=>note('Ханжа машет тебе от калитки'));
}
function WD_own(k){const s=sv();return !!((s.own&&s.own[k])||(PS.own&&PS.own[k]))}

// ================= ЗАПУСК ВЫЛАЗКИ =================
function start(l){const s=sv();CS.chOn=CS.chOn||snapOn();if(!CS.hub&&!inPro())CS.chOn=snapOn();CS.rep=!!s.so.done[l.id];
  if(l.car){s.fuelC=(s.fuelC|0)-(l.fuel|0);save();if(l.fuel)note('−'+l.fuel+' канистр'+(l.fuel===1?'а':'ы')+' бензина');drive(l)}else run(l.id)}
SO.start=start;
function run(id){CS.id=id;K.sec(CS,id,()=>BUILD[id](),run);restoreOn();if(window.SOMZ&&SOMZ[id]&&MUS[SOMZ[id]])music(SOMZ[id]);else X.mz('combat');
  const L=E.L;L.arrows=1;CS.L=L}
SO.run=run;
function finish(id){const s=sv(),o=s.so;const first=!o.done[id],req=(REQ[CS.hubCh||curCh()]||[]).includes(id)&&first;o.done[id]=(o.done[id]|0)+1;if(!req&&!inPro()&&(CS.hubCh||curCh())>=2)o.optN=(o.optN|0)+1;
  const Q=CS.got||{};s.food+=Q.food|0;s.water+=Q.water|0;s.fuelC=(s.fuelC|0)+(Q.fuel|0);
  const rub=Math.round((first?400:150)*(LOCS.find(l=>l.id===id)||{lv:1}).lv);if(C1.addRub)C1.addRub(rub,pl.x,pl.y);
  if(id==='mm'&&o.pro===1)o.pro=2;if(id==='by'&&o.pro===3)o.pro=4;
  if(BUILD[id].fin)BUILD[id].fin(first);
  save();
  const got=[];if(Q.food)got.push('+'+Q.food+' еды');if(Q.water)got.push('+'+Q.water+' воды');if(Q.fuel)got.push('+'+Q.fuel+' канистр');got.push('+'+rub+' ₽');
  note((first?'Вылазка пройдена! ':'Вылазка: ')+got.join(', '));
  lockMove=true;X.go(()=>{lockMove=false;CS.on=false;K.on=null;K.hud=null;
    if(inPro()){CS.pre=1;C1.noFortHi=true;C1.go('fort');C1.noFortHi=false;CS.pre=0}
    else if(CS.hub)enterHub();
    else{C1.noFortHi=true;C1.go('fort');C1.noFortHi=false;restoreOn()}})}
// голодный выход: половина здоровья на первом участке миссии
let hL=null;const _upd0=update;update=function(dt){_upd0(dt);try{const L=E.L;if(CS.hungryM&&C1.on&&L&&L!==hL&&L.armed&&!(L.id||'').startsWith('so_')){hL=L;CS.hungryM=0;PS.hp=Math.min(PS.hp,PS.max*.5);note('Голодный: половина здоровья')}}catch(e){}};
const _eat=eat;

// ---- дорога на машине (Д1) ----
const ROADS={
  gas:{len:2400,route:'ДВОР → ЗАПРАВКА',theme:{r1:'#3a3a40',r2:'#323238',s1:'#4a4a52',s2:'#54545c'},pack:2,gap:90},
  vape:{len:3000,route:'ДВОР → МНОГОЭТАЖКИ → ТАБАЧКА',theme:{r1:'#34343a',r2:'#2c2c32',s1:'#5a5a62',s2:'#6a6a72'},pack:3,gap:75},
  lenta:{len:3400,route:'КАЛИТКА → КОТТЕДЖИ → ЛЕНТА',theme:{r1:'#3a3830',r2:'#322f28',s1:'#2a4a20',s2:'#345a28'},pack:3,gap:70,brutes:1},
  dns:{len:3800,route:'ЗА ЛЕНТУ → ТРАССА → ДНС',theme:{r1:'#30303a',r2:'#282832',s1:'#3a3a42',s2:'#44444c'},pack:4,gap:65,brutes:1},
  bunk:{len:4400,route:'ТРАССА → ЛЕС → ВОЕННАЯ ЧАСТЬ',theme:{r1:'#2e2c26',r2:'#26241e',s1:'#1e3a1a',s2:'#26461e'},pack:4,gap:60,brutes:1,dark:.55},
};
function drive(l){const R=ROADS[l.id],car=sv().car||{};CS.id=l.id;
  if(!window.HMC||!HMC.road){runFoot(l.id);return}
  HMC.road(CS,{id:'so_road_'+l.id,title:'LAND ROVER',sub:'Шмакодявка за турелью, ты за рулём',route:R.route,col:'#ff5a4a',len:R.len,x0:110,x1:370,
    vmax:Math.round(115*(1+.12*(car.eng|0))),dmg:Math.round(11*(1-.2*(car.tire|0))*(1+.15*(l.lv-2))),gap:R.gap,pack:R.pack,brutes:R.brutes,dark:R.dark,tint:'8,6,14',theme:R.theme,
    gun:{name:'ТУРЕЛЬ',cd:.12,dmg:24,sp:480,snd:'rifle',heat:.035,ohNote:'Турель перегрелась! Шмакодявка, остынь!'},
    deco(L,x0,x1,RH){for(let y=0;y<RH;y+=40)X.B(239,y,2,18,'#d8d8c8');
      for(let y=40;y<RH;y+=170){if(l.id==='lenta'||l.id==='bunk'){K.tree&&K.tree(50+(y*7)%40,y,14,'#1e4a24');K.tree&&K.tree(430-(y*3)%30,y+60,14,'#2a5a2a')}
        else{X.B(8,y,90,120,'#8a7a6a');X.B(384,y+50,90,120,'#9a8a7a');for(let wy=y+8;wy<y+110;wy+=14)for(let wx=14;wx<92;wx+=14)X.B(wx,wy,7,8,(wx*wy)%7<2?'#ffd27a':'#2a2a3a')}}
      for(let y=200;y<RH-300;y+=330){X.B(x0+30+((y*13)%140),y,26,14,'#5a5a62');E.gfill(x0+30+((y*13)%140),y,x0+56+((y*13)%140),y+14,1)}},
    draw(x,y,a,ta,fl){if(window.ROVER_DRAW)ROVER_DRAW(x,y,a,ta,fl,true);else{ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#c82a2a';ctx.fillRect(-14,-8,28,16);ctx.restore()}}},
    ()=>runFoot(l.id));
  restoreOn();X.mz('ride');
  after(.8,()=>note('До '+LN(l.id)+' на машине. Сбивай, Шмакодявка стреляет из турели (мышь/правый стик).'));
}
function runFoot(id){run(id)}

// ---- общие предметы вылазок: еда, вода, стройматериалы ----
function lootIt(L,kind,x,y,n){L.items.push({kind,x,y,n:n||1,taken:false})}
function drawSo(L){for(const it of L.items){if(it.taken)continue;const x=Math.round(it.x),y=Math.round(it.y+Math.sin(tm*3+it.x));
  if(it.kind==='sfood'){F(x-4,y-3,8,6,'#c8902a');F(x-4,y-3,8,1,'#e8b050');F(x-2,y-1,4,2,'#d83a2a');F(x-3,y+3,6,1,'rgba(0,0,0,.3)')}
  else if(it.kind==='swat'){F(x-2,y-5,4,9,'#8ad0ff');F(x-2,y-2,4,3,'#2a6ad8');F(x-1,y-7,2,2,'#e8f0f8')}
  else if(it.kind==='smat'){const t=it.n;if(t===0){F(x-6,y-2,12,2,'#b08a50');F(x-6,y+1,12,2,'#9a7440')}else if(t===1){F(x-4,y-3,8,6,'#9a8a64');F(x-4,y-3,8,1,'#b0a078')}else{F(x-5,y-4,10,8,'#7a8288');for(let i=-4;i<5;i+=2)F(x+i,y-4,1,8,'#a8b0b8')}}
  else continue;
  const a=.25+.25*Math.sin(tm*5+it.x);ctx.strokeStyle=`rgba(255,240,180,${a})`;ctx.strokeRect(x-6.5,y-7.5,13,15)}}
const MATN=['доски','мешки с песком','сетка-рабица'];
function onSoItem(it){const Q=CS.got;
  if(it.kind==='sfood'){Q.food+=it.n;X.floatT(it.x,it.y,'+'+it.n+' еда','#ffcf6a')}
  if(it.kind==='swat'){Q.water+=it.n;X.floatT(it.x,it.y,'+'+it.n+' вода','#8ad0ff')}
  if(it.kind==='smat'){Q.mat=(Q.mat|0)+1;Q['m'+it.n]=(Q['m'+it.n]|0)+1;X.floatT(it.x,it.y,'+'+MATN[it.n],'#e8c890')}}
function common(L){CS.got={food:0,water:0,mat:0};L.armed=true;
  const du=L.drawUnder;L.drawUnder=()=>{if(du)du();drawSo(L)};
  const oi=L.onItem;L.onItem=it=>{onSoItem(it);if(oi)oi(it)}}
function bossAlive(L){return L.zs.some(z=>(z.type==='boss'||z.nm)&&!z.dead)}
// П2: босс только в первый раз, на повторах — элитный зомби; П1: лута меньше
function bossOr(x,y,nm,hp,o){if(CS.rep)return E.addZ('armor',x,y,{nm:'ЭЛИТНЫЙ ЗОМБИ',hp:Math.round(hp*.6),max:Math.round(hp*.6)});return E.addZ('boss',x,y,Object.assign({nm,hp,max:hp},o||{}))}
function lootR(L,kind,x,y,n){if(CS.rep&&Math.random()<.5)return;lootIt(L,kind,x,y,n)}
const need=n=>CS.rep?0:n;

// ---- машины на дороге (перебежка) ----
function traffic(L,lanes,o){o=o||{};const cars=[];L.cars=cars;const cols=['#c8c8c8','#2a2a2a','#8a2a2a','#3a5a8a','#c8a040','#e8e8e8','#5a3a6a','#2a6a4a'];
  for(const ln of lanes)ln.t=Math.random()*1.5;
  const spawn=ln=>{const truck=Math.random()<.18,len=truck?46:30,sp=(truck?.75:1)*(o.sp||170)*(.85+Math.random()*.4);
    cars.push({x:ln.d>0?-len:L.w+len,y:ln.y,d:ln.d,len,sp,c:truck?'#d8d0c0':cols[(Math.random()*cols.length)|0],truck,honk:0})};
  L.carTick=dt=>{
    for(const ln of lanes){ln.t-=dt;if(ln.t<=0){spawn(ln);ln.t=(o.gap||1.6)*(.6+Math.random()*1.1)}}
    for(let i=cars.length-1;i>=0;i--){const c=cars[i];c.x+=c.d*c.sp*dt;if(c.x<-80||c.x>L.w+80){cars.splice(i,1);continue}
      const hx=c.len/2+3,hy=8;
      if(Math.abs(pl.y-c.y)<hy&&Math.abs(pl.x-c.x)<hx&&PS.inv<=0&&!dlg){X.hurtPlayer(o.dmg||45);C1.shake=.7;sfx('thump',1.3);
        const ny=pl.y+(pl.y<c.y?-12:12);if(!K.solid(pl.x,ny,3.5))pl.y=ny;const nx=pl.x+c.d*18;if(!K.solid(nx,pl.y,3.5))pl.x=nx;PS.inv=Math.max(PS.inv,.9);note('Сбила машина! Смотри по сторонам!')}
      // гудок, когда герой на полосе впереди
      const ahead=(pl.x-c.x)*c.d;if(Math.abs(pl.y-c.y)<14&&ahead>0&&ahead<90&&c.honk<=0){c.honk=2;X.floatT(c.x+c.d*c.len/2,c.y-10,'БИИИП!','#ffd23a');sfx('ring',.25)}c.honk-=dt;
      for(const z of L.zs){if(z.dead||z.st==='hidden')continue;if(Math.abs(z.y-c.y)<hy&&Math.abs(z.x-c.x)<hx){X.hurtZ(z,z.type==='boss'?60:999,c.d>0?0:Math.PI,280);X.blood(z.x,z.y,c.d>0?0:Math.PI,6,true);if(z.dead)X.floatT(z.x,z.y-10,'СБИЛО!','#ff6a6a')}}
    }};
  L.carDraw=()=>{for(const c of cars){const x=c.x-c.len/2,y=c.y-7;
    F(x+2,y+2,c.len,14,'rgba(0,0,0,.35)');F(x,y,c.len,14,c.c);
    if(c.truck){F(c.d>0?x+c.len-12:x,y,12,14,'#3a5a8a');F(c.d>0?x+c.len-9:x+3,y+2,5,10,'#1a2230')}
    else{F(x+6,y+2,c.len-12,10,shade(c.c,1.15));F(c.d>0?x+c.len-11:x+5,y+2,5,10,'#1a2230');F(c.d>0?x+5:x+c.len-9,y+2,4,10,'#1a2230')}
    const fx=c.d>0?x+c.len:x-1;F(fx,y+2,1,3,'#fff6c0');F(fx,y+9,1,3,'#fff6c0');
    ctx.fillStyle='rgba(255,240,180,.12)';ctx.beginPath();ctx.moveTo(fx,y+1);ctx.lineTo(fx+c.d*44,y-8);ctx.lineTo(fx+c.d*44,y+22);ctx.lineTo(fx,y+13);ctx.fill();
    const bx=c.d>0?x:x+c.len-1;F(bx,y+2,1,3,'#ff3030');F(bx,y+9,1,3,'#ff3030')}};
}

// ================= МИНИ-МАРКЕТ «ПРОДУКТЫ 24» (ур.1) =================
const BUILD={};
BUILD.mm=function(){
  const Wd=360,Hd=470,L=E.mkLevel('so_mm',Wd,Hd);B(0,0,Wd,Hd,'#222');
  // магазин
  K.floor(40,20,320,150,'tile');
  E.gfill(40,20,320,26,1);B(40,20,280,6,'#5a4a4a');E.gfill(40,20,46,150,1);B(40,20,6,130,'#5a4a4a');E.gfill(314,20,320,150,1);B(314,20,6,130,'#5a4a4a');
  E.gfill(40,144,165,150,1);E.gfill(195,144,320,150,1);B(40,144,125,6,'#6a5a5a');B(195,144,125,6,'#6a5a5a');
  for(let x=50;x<160;x+=14)B(x,145,10,3,'#5a7a8a');for(let x=200;x<310;x+=14)B(x,145,10,3,'#5a7a8a');
  // склад
  E.gfill(230,80,260,84,1);E.gfill(280,80,314,84,1);B(230,80,30,4,'#5a4a4a');B(280,80,34,4,'#5a4a4a');E.gfill(230,26,234,84,1);B(230,26,4,58,'#5a4a4a');
  K.floor(234,26,314,80,'walk');K.txt(272,36,'СКЛАД','#c8c0b0',4);
  for(const [x,y] of [[240,40],[296,40],[240,62]]){X.lowBox(x,y,14,12,'#8a6a40','#a8885a')}
  // стеллажи и холодильники
  for(const y of [40,64,88])X.lowBox(64,y,150,8,'#7a7a82','#a8a8b0');
  for(const y of [40,64,88])for(let x=66;x<212;x+=6)B(x,y+2,4,4,['#d83a2a','#e8c040','#3a8a4a','#e88a2a','#5a7ad8'][(x+y)%5]);
  X.lowBox(46,36,8,80,'#c8e0e8','#e8f8ff');for(let y=40;y<112;y+=10)B(47,y,6,6,'#8ad0ff');
  X.lowBox(64,118,40,10,'#5a4a3a','#7a6a5a');X.lowBox(116,118,34,10,'#5a4a3a','#7a6a5a');B(70,119,8,4,'#2a2a2a');B(122,119,8,4,'#2a2a2a');
  K.txt(180,158,'ПРОДУКТЫ 24','#ff5a4a',6);
  // тротуары, дорога
  K.floor(4,150,Wd-4,178,'walk');K.floor(4,178,Wd-4,290,'asph');K.floor(4,290,Wd-4,316,'walk');
  for(let x=0;x<Wd;x+=24){B(x,205,12,1,'#d8d8c8');B(x,261,12,1,'#d8d8c8')}B(0,232,Wd,1,'#d8b040');B(0,234,Wd,1,'#d8b040');
  for(let y=180;y<288;y+=8)B(165,y,30,4,'#c8c8c0');
  B(4,177,Wd-8,1,'#8a8a8e');B(4,290,Wd-8,1,'#8a8a8e');
  // свой двор снизу
  K.floor(4,320,Wd-4,Hd-4,'grass');K.floor(165,314,195,322,'walk');E.gfill(4,316,165,320,1);E.gfill(195,316,Wd-4,320,1);for(let x=4;x<Wd-4;x+=3)if(x<165||x>=195)B(x,316,2,4,'#3a4a3a');
  K.txt(180,334,'НАШ ДВОР','#c8e8a0',4);
  for(const [x,y] of [[60,380],[300,380],[120,440],[250,440]])K.tree(x,y,13);
  E.gfill(0,0,4,Hd,1);E.gfill(Wd-4,0,Wd,Hd,1);E.gfill(0,Hd-4,Wd,Hd,1);E.gfill(0,0,Wd,4,1);
  X.lampPost(100,168);X.lampPost(260,168);X.lampPost(100,300);X.lampPost(260,300);
  // брошенные машины на тротуаре — укрытия
  X.carTop(20,152,'#4a4a52',false);X.carTop(320,294,'#6a2a2a',false);
  L.dark=.45;L.tint='12,6,16';
  X.buildNav();
  pl.x=180;pl.y=440;pl.a=-Math.PI/2;pl.ma=pl.a;
  common(L);
  // зомби: улица и магазин
  for(const [x,y] of [[80,164],[250,304]])E.addZ('normal',x,y); // 06.11 Natalia: −5 зомби (−3 улица, −2 магазин)
  E.addZ('fast',220,164);
  for(const [x,y] of [[90,56],[150,80],[120,104],[200,56],[290,120]])E.addZ('normal',x,y);
  E.addZ('thrower',300,100);E.addZ('crawler',140,56,{hid:'floor',wakeR:24});
  bossOr(272,54,'ГРУЗЧИК ТОЛЯН',300);
  // еда и вода
  for(const [x,y] of [[72,56],[130,56],[205,80],[100,104],[160,104],[180,56]])lootR(L,'sfood',x,y,1);
  for(const [x,y] of [[58,50],[58,74],[58,98]])lootR(L,'swat',x,y,1);
  lootIt(L,'swat',262,44,2);lootIt(L,'sfood',300,62,2);lootIt(L,'syr',250,70);
  E.addItem('ammo',300,130,10);
  const lanes=[{y:192,d:1},{y:220,d:1},{y:248,d:-1},{y:276,d:-1}];traffic(L,lanes,{sp:105,gap:1.9,dmg:45}); // 06.11 Natalia: машины медленнее (было sp:175, gap:1.5)
  L.onUpdate=dt=>{if(L.carTick)L.carTick(dt);
    const Q=CS.got;if(Q.food>=need(4)&&Q.water>=need(4)&&!bossAlive(L)&&pl.y>430&&!CS.fin){CS.fin=1;finish('mm')}};
  const dO=L.drawOver;L.drawOver=()=>{if(dO)dO();L.carDraw()};
  L.obj=()=>{const Q=CS.got,o=[],nf=need(4);o.push('Еда: '+Q.food+(nf?'/'+nf:'')+(Q.food>=nf&&nf?' ✓':''),'Вода: '+Q.water+(nf?'/'+nf:'')+(Q.water>=nf&&nf?' ✓':''));
    if(bossAlive(L))o.push(CS.rep?'Элитный зомби на складе':'Грузчик на складе');else o.push('Склад зачищен ✓');
    if(Q.food>=nf&&Q.water>=nf&&!bossAlive(L))o.push('Назад через дорогу, во двор');return o};
  CS.fin=0;
  after(.6,()=>{K.zoneBanner('МИНИ-МАРКЕТ «ПРОДУКТЫ 24» · СЛОЖНОСТЬ 1','#ffd23a');say([['m','Так. Дорога. Четыре полосы, и никто не тормозит.'],['m','Жду просвет — и бегом. Зомби, кстати, тоже не смотрят по сторонам.']])});
};

// ================= ЗАДНИЙ ДВОР (ур.1) =================
BUILD.by=function(){
  const Wd=520,Hd=420,L=E.mkLevel('so_by',Wd,Hd);B(0,0,Wd,Hd,'#222');
  K.floor(4,4,Wd-4,Hd-4,'dirt');K.floor(140,4,380,120,'grass');K.floor(236,4,284,Hd-4,'asph');
  // калитка из нашего двора сверху
  E.gfill(4,4,236,10,1);E.gfill(284,4,Wd-4,10,1);for(let x=4;x<Wd-4;x+=3)if(x<236||x>=284)B(x,4,2,6,'#3a4a3a');K.txt(260,20,'КАЛИТКА','#c8e8a0',4);
  // гаражи слева
  for(let i=0;i<5;i++){const y=60+i*62;B(14,y,70,50,'#6a6e76');B(14,y,70,3,'#8a8e96');B(84,y+8,4,34,'#3a3e46');E.gfill(14,y,88,y+50,1);K.txt(49,y+28,'ГАРАЖ '+(i+1),'#c8ccd4',4)}
  // стройка справа
  K.floor(380,150,Wd-4,Hd-4,'sand');K.txt(450,146,'СТРОЙКА','#e8d8a0',4);
  E.gfill(380,150,384,300,1);B(380,150,4,150,'#8a7a5a');E.gfill(380,340,384,Hd-4,1);B(380,340,4,76,'#8a7a5a');
  for(const [x,y,w,h] of [[410,180,40,12],[460,240,30,30],[400,320,50,14],[470,360,30,20]])X.lowBox(x,y,w,h,'#9a8a6a','#b8a888');
  // контейнеры, детская площадка, лавки
  for(const x of [300,330])X.lowBox(x,60,24,16,'#3a5a3a','#5a7a5a');
  X.lowBox(150,200,50,6,'#8a4a2a','#aa6a4a');X.lowBox(150,240,6,30,'#c8a040','#e8c060');X.lowBox(190,250,20,20,'#3a6ad8','#5a8af8');
  X.carTop(300,200,'#4a4a52',true);X.carTop(320,300,'#8a6a2a',true);
  for(const [x,y] of [[170,40],[350,110],[130,360],[330,380]])K.tree(x,y,15);
  E.gfill(0,0,4,Hd,1);E.gfill(Wd-4,0,Wd,Hd,1);E.gfill(0,Hd-4,Wd,Hd,1);E.gfill(0,0,Wd,4,1);
  X.lampPost(220,140);X.lampPost(300,280);
  L.dark=.4;L.tint='14,8,10';
  X.buildNav();
  pl.x=260;pl.y=24;pl.a=Math.PI/2;pl.ma=pl.a;
  common(L);
  for(const [x,y] of [[200,90],[320,140],[120,150],[110,270],[200,330],[300,250],[420,220],[470,300],[430,390],[260,380],[150,400]])E.addZ('normal',x,y);
  E.addZ('fast',360,360);E.addZ('thrower',480,200);E.addZ('crawler',100,210,{hid:'floor',wakeR:24});E.addZ('bloat',250,300);
  bossOr(110,390,'ГАРАЖНИК ПАЛЫЧ',340);
  // стройматериалы: 0 доски, 1 мешки, 2 сетка
  for(const [x,y,t] of [[420,200,0],[490,330,0],[100,120,0],[440,300,1],[400,395,1],[180,300,1],[100,240,2],[470,170,2],[350,340,2]])lootIt(L,'smat',x,y,t);
  lootIt(L,'sfood',330,90,1);lootIt(L,'swat',160,220,1);
  if(!WD_own('nailgun')&&window.ARS)ARS.addWpnItem(L,'nailgun',470,230);E.addItem('nlg',440,250,30);E.addItem('nlg',420,360,20);
  L.onUpdate=dt=>{const Q=CS.got;if(Q.mat>=need(6)&&!bossAlive(L)&&pl.y<26&&Math.abs(pl.x-260)<26&&!CS.fin){CS.fin=1;finish('by')}};
  L.obj=()=>{const Q=CS.got,nm=need(6),o=['Стройматериалы: '+Q.mat+(nm?'/'+nm:'')+(nm&&Q.mat>=nm?' ✓':'')];
    o.push(bossAlive(L)?(CS.rep?'Элитный зомби у гаражей':'Гаражник Палыч (у гаражей внизу)'):'Гаражи зачищены ✓');
    if(Q.mat>=nm&&!bossAlive(L))o.push('Назад через калитку');return o};
  CS.fin=0;
  after(.6,()=>{K.zoneBanner('ЗАДНИЙ ДВОР · СЛОЖНОСТЬ 1','#ffd23a');say([['m','Задний двор. Гаражи, стройка... и гости.'],['m','Доски, мешки, сетка. Беру всё, что найду.']])});
};

// ================= ОБЩИЙ КОНСТРУКТОР МАГАЗИНОВ =================
function wallBox(x0,y0,x1,y1,col,doors){const t=6;const gaps=doors||[];
  const seg=(ax,ay,bx,by)=>{E.gfill(ax,ay,bx,by,1);B(ax,ay,bx-ax,by-ay,col)};
  for(const side of ['t','b']){const y=side==='t'?y0:y1-t;let x=x0;for(const g of gaps.filter(g=>g[0]===side).sort((a,b)=>a[1]-b[1])){seg(x,y,g[1],y+t);x=g[2]}seg(x,y,x1,y+t)}
  for(const side of ['l','r']){const x=side==='l'?x0:x1-t;let y=y0;for(const g of gaps.filter(g=>g[0]===side).sort((a,b)=>a[1]-b[1])){seg(x,y,x+t,g[1]);y=g[2]}seg(x,y,x+t,y1)}}
function shelves(x0,y0,x1,y1,step,cols,aisle){for(let y=y0;y<y1;y+=step){let x=x0;while(x<x1-20){const w=Math.min(aisle||80,x1-x-10);X.lowBox(x,y,w,8,'#6a6a72','#9a9aa2');for(let k=x+2;k<x+w-2;k+=6)B(k,y+2,4,4,cols[((k+y)>>2)%cols.length]);x+=w+22}}}
function spotIn(x0,y0,x1,y1){for(let i=0;i<40;i++){const x=x0+Math.random()*(x1-x0),y=y0+Math.random()*(y1-y0);if(!E.solidAt(x,y,5))return [x,y]}return E.freeSpot((x0+x1)/2,(y0+y1)/2,5,80)||[(x0+x1)/2,(y0+y1)/2]}
function zIn(type,n,a,o){for(let i=0;i<n;i++){const p=spotIn(...a);E.addZ(type,p[0],p[1],o)}}
function lootIn(L,kind,cnt,a,n){for(let i=0;i<cnt;i++){const p=spotIn(...a);lootR(L,kind,p[0],p[1],n||1)}}
function itemsIn(kind,cnt,a,n){for(let i=0;i<cnt;i++){const p=spotIn(...a);E.addItem(kind,p[0],p[1],n||1)}}
function sign(x,y,t,c,bg,w){B(x-w/2,y-7,w,10,bg);K.txt(x,y,t,c,6)}
// парковка: машины-укрытия, сигнализация (Д2), канистры у машин (Т5)
function parking(L,x0,y0,x1,y1,rows){K.floor(x0,y0,x1,y1,'asph');const cars=[];const cols=['#3a5a8a','#8a2a2a','#c8c8c8','#2a2a2a','#6a8a4a','#c8a040','#5a3a6a'];let k=0;
  for(let r=0;r<rows;r++){const y=y0+16+r*58;for(let x=x0+14;x<x1-30;x+=34){B(x-3,y-4,1,36,'#c8c8c0');if(Math.random()<.3)continue;X.carTop(x,y,cols[k++%7],true);cars.push({x,y,w:16,h:28,al:0})}}
  B(x1-2,y0,1,y1-y0,'#c8c8c0');L.so.cars=L.so.cars.concat(cars);
  for(const c of cars)if(Math.random()<.12)lootR(L,'sfuel',c.x+22,c.y+14,1);return cars}
function carts(L,list){for(const [x,y] of list)L.so.carts.push({x,y,vx:0,vy:0,a:0})}
function barrels(L,list){for(const [x,y] of list){L.so.bar.push({x,y,hp:1});E.gfill(x-5,y-5,x+5,y+5,2)}}
function soInit(L){L.so={cars:[],carts:[],bar:[],proj:[],tk:0}}
function soTick(L,dt){const S0=L.so;if(!S0)return;
  for(const b of L.buls){if(b.ally||b._so)continue;
    for(const c of S0.cars)if(!c.al&&b.x>c.x&&b.x<c.x+c.w&&b.y>c.y&&b.y<c.y+c.h){c.al=1;b._so=1;sfx('ring',.6);X.floatT(c.x+8,c.y-4,'УИУ-УИУ!','#ff5a5a');
      for(const z of L.zs)if(!z.dead&&D2(z.x,z.y,c.x,c.y)<260&&(z.st==='idle'||z.st==='alert')){z.st='alert';z.alT=6;z.tx=c.x;z.ty=c.y}
      for(let i=0;i<3;i++){const p=E.freeSpot(c.x+rnd(-120,120),c.y+rnd(-90,90),4,50);if(p)E.addZ('normal',p[0],p[1],{st:'chase'})}note('Сигнализация! Сбегаются на звук')}
    for(const r of S0.bar)if(r.hp>0&&D2(b.x,b.y,r.x,r.y)<6){r.hp=0;b.life=0;boomAt(L,r.x,r.y,52,90)}}
  // тележки (Д3): пинок V
  for(const c of S0.carts){if(Math.abs(c.vx)+Math.abs(c.vy)<5){c.vx=c.vy=0;continue}const nx=c.x+c.vx*dt,ny=c.y+c.vy*dt;if(E.solidAt(nx,ny,4)){c.vx*=-.3;c.vy*=-.3;sfx('clang',.5)}else{c.x=nx;c.y=ny}c.vx*=Math.exp(-1.2*dt);c.vy*=Math.exp(-1.2*dt);
    for(const z of L.zs){if(z.dead||z.st==='hidden')continue;if(D2(z.x,z.y,c.x,c.y)<z.r+6){const a=Math.atan2(c.vy,c.vx);X.hurtZ(z,z.type==='boss'?30:70,a,260);z.down=Math.max(z.down||0,1.4);c.vx*=.7;c.vy*=.7}}}
  // снаряды боссов (тележки охранника)
  for(let i=S0.proj.length-1;i>=0;i--){const p=S0.proj[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.t-=dt;if(p.t<=0||E.solidAt(p.x,p.y,3)){S0.proj.splice(i,1);continue}
    if(D2(p.x,p.y,pl.x,pl.y)<8){X.hurtPlayer(p.dmg||26);S0.proj.splice(i,1);note('Тележкой по ногам!');continue}
    for(const z of L.zs)if(!z.dead&&z.type!=='boss'&&D2(z.x,z.y,p.x,p.y)<z.r+5)X.hurtZ(z,50,Math.atan2(p.vy,p.vx),200)}}
function boomAt(L,x,y,R0,dmg){sfx('boom');C1.shake=1;for(let i=0;i<40;i++){const q=rnd(0,TAU),v=rnd(30,170);L.fx.push({x,y,vx:Math.cos(q)*v,vy:Math.sin(q)*v,life:rnd(.25,.7),c:i%3?'flame':'#ffe27a'})}
  for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const d=D2(z.x,z.y,x,y);if(d<R0){X.hurtZ(z,(z.type==='boss'?.4:1)*dmg*(1-.5*d/R0),Math.atan2(z.y-y,z.x-x),280);z.burn=Math.max(z.burn||0,3)}}
  if(D2(pl.x,pl.y,x,y)<R0*.8)X.hurtPlayer(35);try{X.igniteAt&&X.igniteAt(x,y)}catch(e){}}
function soDraw(L){const S0=L.so;if(!S0)return;
  for(const c of S0.carts){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(Math.atan2(c.vy,c.vx)||c.a);F(-5,-4,10,8,'#9aa0a8');F(-4,-3,8,6,'#5a6068');for(let k=-4;k<5;k+=2)F(k,-4,1,8,'#c8ccd4');F(5,-4,2,8,'#e83a2a');ctx.restore()}
  for(const r of S0.bar)if(r.hp>0){F(r.x-4,r.y-5,8,10,'#c82a2a');F(r.x-4,r.y-5,8,2,'#e85a4a');F(r.x-2,r.y-1,4,3,'#ffd23a')}
  for(const c of S0.cars)if(c.al&&Math.sin(tm*14)>0){F(c.x-1,c.y+2,2,3,'#ff9a20');F(c.x+15,c.y+2,2,3,'#ff9a20');F(c.x-1,c.y+23,2,3,'#ff9a20');F(c.x+15,c.y+23,2,3,'#ff9a20')}
  for(const p of S0.proj){F(p.x-5,p.y-4,10,8,'#9aa0a8');F(p.x-4,p.y-3,8,6,'#5a6068')}}
function cartKick(){const L=E.L;if(!L||!L.so)return;for(const c of L.so.carts)if(D2(c.x,c.y,pl.x,pl.y)<16){c.vx=Math.cos(pl.a)*280;c.vy=Math.sin(pl.a)*280;sfx('clang');X.floatT(c.x,c.y-8,'ПОЕХАЛА!','#ffd23a');return}}
{const _k=C1.onKey;C1.onKey=function(c,e){if(_k)_k(c,e);if(c==='KeyV')cartKick()};const kb=C1.xbtn.find(b=>b.t==='ПИНОК');if(kb){const a0=kb.act;kb.act=()=>{a0();cartKick()}}}
// коробки с наградами (Озон/ВБ), канистры, электроника, особые предметы
function onSo2(it){const Q=CS.got,s=sv();
  if(it.kind==='sfuel'){Q.fuel=(Q.fuel|0)+it.n;X.floatT(it.x,it.y,'+'+it.n+' канистра','#ffa030')}
  if(it.kind==='sbox'){Q.box=(Q.box|0)+1;const r=Math.random();
    if(!CS.rep&&!s.so.clothes&&Q.box>=2){s.so.clothes=1;X.floatT(it.x,it.y,'ПЛАТЬЕ ДЛЯ ШМАКОДЯВКИ!','#ff9ad8');note('В коробке — то самое платье. Шмакодявке есть в чём ехать!')}
    else if(r<.3){C1.addRub&&C1.addRub(120+((Math.random()*260)|0),it.x,it.y)}else if(r<.55){s.parts=(s.parts|0)+1;X.floatT(it.x,it.y,'+1 дет.','#8af0ff')}
    else if(r<.75&&window.ARS)ARS.addRes('elec',1,it.x,it.y);else if(r<.82){PS.syr=(PS.syr|0)+1;X.floatT(it.x,it.y,'+шприц','#6aff9a')}else{s.food++;X.floatT(it.x,it.y,'+еда','#ffcf6a')}}
  if(it.kind==='svape'){s.vape=(s.vape|0)+3;CS.got.vape=1;X.floatT(it.x,it.y,'ВЕЙП-ДЫМОВУХА','#e8e8ff');note('Вейп-дымовуха: K / кнопка ВЕЙП — облако пара, в нём тебя не видят. 3 затяжки, дозаправка — в табачке.')}
  if(it.kind==='sflash'){s.so.flash=1;X.floatT(it.x,it.y,'ФЛЕШКА: КООРДИНАТЫ','#ffd23a');note('Флешка с координатами военного бункера! Откроется перед Екатеринбургом.')}
  save()}
function common2(L){soInit(L);const oi=L.onItem;L.onItem=it=>{onSo2(it);if(oi)oi(it)};const du=L.drawUnder;L.drawUnder=()=>{if(du)du();soDraw(L);drawSo2(L)}}
function drawSo2(L){for(const it of L.items){if(it.taken)continue;const x=Math.round(it.x),y=Math.round(it.y+Math.sin(tm*3+it.x));const k=it.kind;
  if(k==='sfuel'){F(x-3,y-4,7,9,'#c82a2a');F(x-2,y-3,5,2,'#e85a4a');F(x+2,y-6,2,2,'#2a2a2a')}
  else if(k==='sbox'){F(x-5,y-4,10,8,'#c8a070');F(x-5,y-1,10,1,'#8a6a40');F(x-1,y-4,2,8,'#8a6a40');F(x-4,y-3,3,2,it.n===2?'#a83ad8':'#2a6ad8')}
  else if(k==='svape'){F(x-1,y-5,3,10,'#2a2a2e');F(x-1,y-5,3,2,'#ff5ad8');F(x,y+2,1,2,'#8af0ff')}
  else if(k==='sflash'){F(x-3,y-2,6,4,'#2a2a2e');F(x+3,y-1,2,2,'#c8c8c8');F(x-2,y-1,2,1,'#ffd23a')}
  else continue;const a=.25+.25*Math.sin(tm*5+it.x);ctx.strokeStyle=`rgba(255,240,180,${a})`;ctx.strokeRect(x-6.5,y-7.5,13,15)}}
function retCar(L,x,y,txt){x+=40;L.so.ret={x,y};const dO=L.drawOver;L.drawOver=()=>{if(dO)dO();if(window.ROVER_DRAW&&L.so.carShow)try{ROVER_DRAW(x,y,-Math.PI/2,-Math.PI/2,false,false)}catch(e){}};L.so.carShow=1;E.gfill(x-9,y-15,x+9,y+15,2)}
const nearRet=L=>L.so.ret&&D2(pl.x,pl.y,L.so.ret.x,L.so.ret.y)<26;
function intro(t,lines){after(.6,()=>{K.zoneBanner(t,'#ffd23a');if(lines)say(lines)})}
function bossAI(L,dt,fn){const b=L.zs.find(z=>z.type==='boss'&&!z.dead);if(b&&b.st!=='idle'&&b.st!=='hidden')fn(b,dt)}

// ================= ОЗОН И ВБ (ур.2, пешком) =================
BUILD.oz=function(){
  const Wd=760,Hd=360,L=E.mkLevel('so_oz',Wd,Hd);B(0,0,Wd,Hd,'#222');common(L);common2(L);
  // большой дом напротив: фасад сверху, пункты в дальнем конце
  K.floor(4,4,Wd-4,150,'walk');B(4,4,Wd-8,70,'#8a7a6a');E.gfill(4,4,Wd-4,74,1);for(let x=14;x<Wd-20;x+=24)for(let y=12;y<64;y+=16)B(x,y,10,9,hash(x,y)>.75?'#ffd27a':'#2a2a3a');
  K.txt(200,84,'ДОМ НАПРОТИВ','#c8c0b0',5);
  // Озон (синий), ВБ (фиолетовый) — помещения внутри дома
  K.floor(430,74,590,150,'tile');wallBox(430,74,590,150,'#2a4aa8',[['b',496,526]]);sign(510,70,'OZON','#ffffff','#1a5ad8',46);
  K.floor(600,74,756,150,'tile');wallBox(600,74,756,150,'#7a2aa8',[['b',666,696]]);sign(678,70,'WILDBERRIES','#ffffff','#a83ad8',74);
  for(const x of [444,474,546])X.lowBox(x,86,8,44,'#8a6a40','#a8885a');for(const x of [614,640,716])X.lowBox(x,86,8,44,'#8a6a40','#a8885a');
  // тротуар, дорога, наш двор снизу
  K.floor(4,150,Wd-4,176,'walk');K.floor(4,176,Wd-4,262,'asph');for(let x=0;x<Wd;x+=24)B(x,218,12,1,'#d8d8c8');K.floor(4,262,Wd-4,286,'walk');
  K.floor(4,290,Wd-4,Hd-4,'grass');E.gfill(4,286,165,290,1);E.gfill(195,286,Wd-4,290,1);for(let x=4;x<Wd-4;x+=3)if(x<165||x>=195)B(x,286,2,4,'#3a4a3a');K.txt(180,306,'НАШ ДВОР','#c8e8a0',4);
  for(const [x,y] of [[60,330],[300,330],[520,330],[700,330]])K.tree(x,y,13);
  E.gfill(0,0,4,Hd,1);E.gfill(Wd-4,0,Wd,Hd,1);E.gfill(0,Hd-4,Wd,Hd,1);
  X.carTop(260,152,'#4a4a52',false);X.carTop(380,264,'#6a2a2a',false);X.lampPost(320,160);X.lampPost(620,160);
  L.dark=.4;L.tint='10,8,18';X.buildNav();pl.x=180;pl.y=330;pl.a=-Math.PI/2;pl.ma=pl.a;
  traffic(L,[{y:192,d:1},{y:246,d:-1}],{sp:190,gap:1.4,dmg:45});
  zIn('normal',8,[20,90,420,160]);zIn('fast',2,[300,90,560,170]);zIn('normal',4,[440,90,585,145]);zIn('normal',4,[605,90,750,145]);zIn('thrower',1,[620,90,740,140]);
  bossOr(512,110,'КУРЬЕР-ГРОМИЛА',420);if(!CS.rep)E.addZ('boss',690,110,{nm:'СОТРУДНИЦА ВБ',hp:380,max:380});
  lootIn(L,'sbox',5,[436,80,586,146],1);lootIn(L,'sbox',5,[606,80,752,146],2);lootIn(L,'selec',1,[436,80,750,146],1);
  L.onUpdate=dt=>{L.carTick(dt);soTick(L,dt);const Q=CS.got;if((Q.box|0)>=need(6)&&!bossAlive(L)&&pl.y>325&&!CS.fin){CS.fin=1;finish('oz')}};
  const dO=L.drawOver;L.drawOver=()=>{if(dO)dO();L.carDraw()};
  L.obj=()=>{const Q=CS.got,o=['Коробки: '+(Q.box|0)+(need(6)?'/6':'')];const oz=L.zs.find(z=>z.nm==='КУРЬЕР-ГРОМИЛА'&&!z.dead),wb=L.zs.find(z=>z.nm==='СОТРУДНИЦА ВБ'&&!z.dead);
    if(oz)o.push('Озон: курьер-громила');if(wb)o.push('ВБ: сотрудница под горой коробок');if(!bossAlive(L)&&(Q.box|0)>=need(6))o.push('Домой через дорогу');return o};
  CS.fin=0;intro('ОЗОН И ВБ · СЛОЖНОСТЬ 2',CS.rep?null:[['m','Шмакодявке не в чем ехать. Говорит, все платья в пунктах выдачи.'],['s','Не «все», а одно. Розовое. Трек-номер у меня в телефоне!'],['m','Через дорогу и в самый конец дома. Сначала Озон, потом ВБ.']]);
};
BUILD.oz.fin=f=>{if(f)note('Шмакодявка: «Платье! Теперь хоть в ТЦ, хоть на край света»')};

// ================= ЗАПРАВКА (ур.2, на машине) =================
BUILD.gas=function(){
  const Wd=520,Hd=420,L=E.mkLevel('so_gas',Wd,Hd);B(0,0,Wd,Hd,'#222');common(L);common2(L);
  K.floor(4,4,Wd-4,Hd-4,'asph');B(110,120,300,150,'#3a3a40');
  // навес и колонки
  B(120,130,280,8,'#e8e8e8');B(120,130,280,2,'#d82a2a');K.txt(260,126,'АЗС «ПЕТРОЛ»','#ffffff',6);
  for(const x of [170,250,330]){X.lowBox(x,170,14,20,'#d82a2a','#e85a4a');B(x+3,174,8,5,'#1a1a1a');}
  barrels(L,[[150,230],[370,230],[200,300],[320,300]]);
  // магазинчик АЗС
  K.floor(160,20,360,100,'tile');wallBox(160,20,360,100,'#c8c8c8',[['b',246,276]]);X.lowBox(180,40,80,8,'#6a6a72','#9a9aa2');X.lowBox(280,40,60,8,'#6a6a72','#9a9aa2');X.lowBox(190,70,40,10,'#5a4a3a','#7a6a5a');
  E.gfill(0,0,4,Hd,1);E.gfill(Wd-4,0,Wd,Hd,1);E.gfill(0,0,Wd,4,1);E.gfill(0,Hd-4,Wd,Hd,1);
  for(const [x,y] of [[40,60],[480,60],[40,360],[480,360]])K.tree(x,y,14);
  L.dark=.4;L.tint='14,8,6';X.buildNav();pl.x=260;pl.y=380;pl.a=-Math.PI/2;pl.ma=pl.a;retCar(L,260,396);
  zIn('normal',9,[20,120,500,330]);zIn('fast',2,[20,120,500,330]);zIn('normal',3,[166,26,354,94]);zIn('thrower',1,[20,20,500,120]);
  bossOr(260,60,'ОПЕРАТОР АЗС',420);
  const nf=CS.rep?2:4;lootIn(L,'sfuel',nf,[120,150,400,320],1);lootIn(L,'sfuel',1,[166,26,354,94],1);lootIn(L,'sfood',2,[166,26,354,94],1);lootIn(L,'swat',2,[166,26,354,94],1);
  L.onUpdate=dt=>{soTick(L,dt);const Q=CS.got;if((Q.fuel|0)>=need(3)&&!bossAlive(L)&&nearRet(L)&&!CS.fin){CS.fin=1;finish('gas')}};
  L.obj=()=>{const Q=CS.got,o=['Канистры: '+(Q.fuel|0)+(need(3)?'/3':'')];o.push(bossAlive(L)?'Оператор АЗС в магазинчике':'Магазинчик ✓');o.push('Красные бочки взрываются от выстрела!');if(!bossAlive(L)&&(Q.fuel|0)>=need(3))o.push('Назад к Land Rover');return o};
  CS.fin=0;intro('ЗАПРАВКА · СЛОЖНОСТЬ 2',CS.rep?null:[['s','Бензин! Лей в канистры всё, что найдёшь.'],['m','И не стреляй по бочкам рядом со мной. Пожалуйста.']]);
};

// ================= ТАБАЧКА (ур.3, малая парковка) =================
BUILD.vape=function(){ // 04.11 (Natalia): большая парковка с равномерными зомби → вторая зачистка внутри → коридоры и подсобки → табачка в конце
  const Wd=760,Hd=1000,L=E.mkLevel('so_vape',Wd,Hd);B(0,0,Wd,Hd,'#222');common(L);common2(L);
  K.floor(4,4,Wd-4,Hd-4,'walk');
  // здание: сначала всё глухое, потом вырезаем комнаты
  const WC='#3a2a4a';B(60,20,640,400,'#17131c');E.gfill(60,20,700,420,1);
  const room=(x0,y0,x1,y1,fl)=>{E.gfill(x0,y0,x1,y1,0);K.floor(x0,y0,x1,y1,fl||'tile')};
  room(300,320,460,420);room(80,320,306,420);room(80,144,160,326,'walk');room(80,20,420,150,'walk');room(414,20,700,250);room(454,244,700,420,'walk');
  wallBox(300,320,460,420,WC,[['b',360,400],['l',340,380],['r',350,390]]);   // вестибюль
  wallBox(80,320,306,420,WC,[['r',340,380],['t',100,140]]);                  // коридор на запад
  wallBox(80,144,160,326,WC,[['b',100,140],['t',100,140]]);                  // коридор на север
  wallBox(80,20,420,150,WC,[['b',100,140],['r',60,100]]);                    // подсобки
  wallBox(414,20,700,250,WC,[['l',60,100],['b',540,580]]);                   // табачка
  wallBox(454,244,700,420,WC,[['t',540,580],['l',350,390]]);                 // склад табачки
  // обстановка
  for(const [x,y] of [[100,40],[150,40],[200,40],[300,90],[340,40],[250,110]])X.lowBox(x,y,30,16,'#8a6a40','#a8885a');
  K.txt(120,30,'ПОДСОБКА','#c8c0b0',4);K.txt(520,262,'СКЛАД','#c8c0b0',4);K.txt(380,334,'ВХОД','#c8c0b0',4);
  for(let x=96;x<290;x+=40)X.lowBox(x,404,16,8,'#4a4a52','#6a6a72');
  X.lowBox(440,40,240,8,'#3a3a42','#5a5a62');for(let x=442;x<678;x+=6)B(x,42,4,4,['#ff5ad8','#8af0ff','#ffd23a','#7aff9a'][(x>>2)%4]);
  X.lowBox(470,120,80,10,'#5a4a3a','#7a6a5a');X.lowBox(620,90,8,60,'#6a6a72','#9a9aa2');
  for(const [x,y] of [[480,300],[540,330],[620,290],[660,370],[500,380]])X.lowBox(x,y,26,14,'#8a6a40','#a8885a');
  sign(380,432,'ТАБАК · ВЕЙП','#ff9af0','#2a1a3a',84);
  // многоэтажки по бокам здания
  for(let y=30;y<400;y+=18){for(let x=10;x<54;x+=14)B(x,y,7,8,(x*y)%9<2?'#ffd27a':'#2a2a3a');for(let x=708;x<752;x+=14)B(x,y,7,8,(x*y)%11<2?'#ffd27a':'#2a2a3a')}
  E.gfill(4,4,56,430,1);E.gfill(704,4,Wd-4,430,1);
  // большая парковка
  parking(L,40,470,720,840,6);
  E.gfill(0,0,Wd,4,1);E.gfill(0,Hd-4,Wd,Hd,1);E.gfill(0,0,4,Hd,1);E.gfill(Wd-4,0,Wd,Hd,1);
  L.dark=.5;L.tint='14,6,18';X.buildNav();pl.x=380;pl.y=960;pl.a=-Math.PI/2;pl.ma=pl.a;retCar(L,380,968);
  // парковка: зомби равномерно по сетке, далеко от старта, без крикуна (он будил всю орду разом)
  const PK=['normal','normal','fast','normal','gunner','normal','normal','normal','fast','normal','gunner','normal'];
  let k=0;for(let r=0;r<3;r++)for(let c=0;c<4;c++){const x0=50+c*165,y0=480+r*105;zIn(PK[k++],1,[x0,y0,x0+150,y0+95]);if((r+c)%2===0)zIn('normal',1,[x0,y0,x0+150,y0+95])}
  // внутри — вторая зачистка
  zIn('normal',3,[310,330,450,410]);zIn('normal',3,[90,330,296,410]);zIn('fast',1,[90,330,296,410]);
  zIn('normal',2,[88,160,152,316]);zIn('normal',4,[90,50,410,140]);zIn('gunner',1,[90,50,410,140]);
  zIn('normal',3,[464,270,690,410]);zIn('normal',3,[424,60,690,240]);
  const b=bossOr(560,90,'ОБЛАЧНЫЙ',520);
  lootIt(L,'svape',640,70,1);lootIn(L,'selec',2,[90,50,410,140],1);lootIn(L,'selec',1,[464,270,690,410],1);lootIn(L,'sfood',2,[464,270,690,410],1);lootIn(L,'sfood',1,[60,480,720,800],1);
  const inB=z=>z.y<430,cnt=f=>L.zs.filter(z=>!z.dead&&!z.fake&&f(z)).length;let inSaid=0;
  L.onUpdate=dt=>{soTick(L,dt);const Q=CS.got;
    if(!inSaid&&pl.y<425){inSaid=1;K.zoneBanner('ВНУТРИ: ВТОРАЯ ЗАЧИСТКА','#ff9af0');if(!CS.rep)say([['s','Коридоры какие-то… Табачка в самом конце, за подсобками.'],['m','Идём по одному. Не разбегаемся.']])}
    if(!bossAlive(L)&&(Q.vape||CS.rep)&&nearRet(L)&&!CS.fin){CS.fin=1;finish('vape')}};
  const dO=L.drawOver;L.drawOver=()=>{if(dO)dO();const z=L.zs.find(q=>q.nm==='ОБЛАЧНЫЙ'&&!q.dead);if(z){const far=D2(z.x,z.y,pl.x,pl.y);for(let i=0;i<8;i++){const q=i*.8+tm*.5,r=14+5*Math.sin(tm*1.3+i);ctx.fillStyle=`rgba(230,225,245,${far>40?.32:.16})`;ctx.beginPath();ctx.arc(z.x+Math.cos(q)*8,z.y+Math.sin(q)*8,r,0,TAU);ctx.fill()}}};
  L.obj=()=>{const Q=CS.got,o=[],np=cnt(z=>!inB(z)),nb=cnt(inB);
    o.push(np?'Парковка: зомби осталось '+np:'Парковка зачищена ✓');
    o.push(bossAlive(L)?'Здание: зомби '+nb+' · Облачный в табачке, в конце коридоров':'Табачка зачищена ✓');
    if(!Q.vape&&!CS.rep)o.push('Забрать вейп с прилавка');if(!bossAlive(L))o.push('Назад к Land Rover');o.push('Не стреляй по машинам — сигнализация');return o};
  CS.fin=0;intro('ТАБАЧКА · СЛОЖНОСТЬ 3',CS.rep?null:[['m','Табачка внутри торгового здания. Сначала парковка, потом коридоры.'],['s','Говорят, там один стоит в облаке пара уже неделю. Облачный.']]);
};

// ================= ЛЕНТА (ур.4, большая парковка, тележки) =================
BUILD.lenta=function(){
  const Wd=820,Hd=560,L=E.mkLevel('so_lenta',Wd,Hd);B(0,0,Wd,Hd,'#222');common(L);common2(L);
  K.floor(4,4,Wd-4,Hd-4,'walk');
  K.floor(40,20,780,230,'tile');wallBox(40,20,780,230,'#2a4a8a',[['b',380,440]]);sign(410,16,'ЛЕНТА','#ffd23a','#1a3a8a',60);
  shelves(70,44,560,190,28,['#d83a2a','#e8c040','#3a8a4a','#e88a2a','#5a7ad8','#8ad0ff'],90);
  K.floor(600,26,774,120,'walk');wallBox(596,20,780,124,'#2a4a8a',[['b',650,690]]);K.txt(688,36,'СКЛАД','#c8c0b0',4);for(const [x,y] of [[612,46],[700,46],[612,86]])X.lowBox(x,y,30,16,'#8a6a40','#a8885a');
  for(const x of [100,160,220,280])X.lowBox(x,200,40,10,'#5a4a3a','#7a6a5a');
  K.txt(120,40,'ОВОЩИ','#3a8a4a',4);K.txt(300,40,'ВОДА','#5a7ad8',4);K.txt(480,40,'КОНСЕРВЫ','#d83a2a',4);
  parking(L,40,260,780,510,4);
  carts(L,[[200,250],[260,252],[480,250],[560,252],[640,250],[330,380],[600,440]]);
  E.gfill(0,0,4,Hd,1);E.gfill(Wd-4,0,Wd,Hd,1);E.gfill(0,0,Wd,4,1);E.gfill(0,Hd-4,Wd,Hd,1);
  L.dark=.42;L.tint='8,8,16';X.buildNav();pl.x=410;pl.y=530;pl.a=-Math.PI/2;pl.ma=pl.a;retCar(L,410,538);
  zIn('normal',16,[40,250,780,510]);zIn('fast',4,[40,250,780,510]);zIn('gunner',3,[40,250,780,510]);zIn('armor',2,[40,250,780,510]);zIn('bloat',2,[40,250,780,510]);
  zIn('normal',10,[50,40,580,220]);zIn('shield',2,[50,40,580,220]);zIn('raider',2,[600,30,774,118]);zIn('spitter',1,[50,40,580,220]);
  bossOr(690,80,'ОХРАННИК ЛЕНТЫ',700);
  lootIn(L,'sfood',10,[50,40,580,220],1);lootIn(L,'swat',10,[50,40,580,220],1);lootIn(L,'sfood',2,[604,30,770,116],3);lootIn(L,'swat',2,[604,30,770,116],3);
  if(!WD_own('axe2')&&window.ARS)ARS.addWpnItem(L,'axe2',740,100);
  let bt=3;
  L.onUpdate=dt=>{soTick(L,dt);bossAI(L,dt,b=>{bt-=dt;if(bt<=0){bt=3.6;const a=Math.atan2(pl.y-b.y,pl.x-b.x);L.so.proj.push({x:b.x+Math.cos(a)*12,y:b.y+Math.sin(a)*12,vx:Math.cos(a)*190,vy:Math.sin(a)*190,t:2.2,dmg:28});sfx('clang');X.floatT(b.x,b.y-14,'ТЕЛЕЖКУ ЕМУ!','#ff6a6a')}});
    const Q=CS.got;if(Q.food>=need(8)&&Q.water>=need(8)&&!bossAlive(L)&&nearRet(L)&&!CS.fin){CS.fin=1;finish('lenta')}};
  L.obj=()=>{const Q=CS.got,nf=need(8),o=['Еда: '+Q.food+(nf?'/'+nf:''),'Вода: '+Q.water+(nf?'/'+nf:'')];o.push(bossAlive(L)?'Охранник Ленты на складе (кидается тележками)':'Склад ✓');o.push('V у тележки — запустить её в толпу');if(Q.food>=nf&&Q.water>=nf&&!bossAlive(L))o.push('Назад к Land Rover');return o};
  CS.fin=0;intro('ЛЕНТА · СЛОЖНОСТЬ 4',CS.rep?null:[['s','Лента! Запасы почти кончились, грузим всё.'],['m','Парковка огромная. Тележки видишь? Пинком — и в толпу.'],['s','А по машинам не стреляй. Завоют — вся округа сбежится.']]);
};

// ================= ДНС (ур.4, электроника) =================
BUILD.dns=function(){
  const Wd=700,Hd=520,L=E.mkLevel('so_dns',Wd,Hd);B(0,0,Wd,Hd,'#222');common(L);common2(L);
  K.floor(4,4,Wd-4,Hd-4,'asph');
  K.floor(40,20,660,250,'tile');wallBox(40,20,660,250,'#e8701a',[['b',320,380]]);sign(350,16,'ДНС','#ffffff','#e8701a',50);
  shelves(70,44,480,220,30,['#2a2a2e','#3a3a42','#8af0ff','#5a5a62','#ff8a20'],80);
  K.floor(500,26,654,130,'walk');wallBox(496,20,660,134,'#e8701a',[['b',560,600]]);K.txt(578,36,'СЕРВИС','#c8c0b0',4);X.lowBox(512,50,60,10,'#3a3a42','#5a5a62');X.lowBox(590,80,50,10,'#3a3a42','#5a5a62');
  parking(L,60,280,640,470,3);
  E.gfill(0,0,4,Hd,1);E.gfill(Wd-4,0,Wd,Hd,1);E.gfill(0,0,Wd,4,1);E.gfill(0,Hd-4,Wd,Hd,1);
  L.dark=.5;L.tint='14,8,4';X.buildNav();pl.x=350;pl.y=490;pl.a=-Math.PI/2;pl.ma=pl.a;retCar(L,350,498);
  zIn('normal',12,[60,270,640,470]);zIn('fast',4,[60,270,640,470]);zIn('gunner',3,[60,270,640,470]);zIn('armor',3,[60,40,480,240]);zIn('normal',10,[60,40,480,240]);zIn('raider',2,[500,30,650,128]);zIn('screamer',2,[60,40,480,240]);
  bossOr(580,90,'КОНСУЛЬТАНТ ДНС',650);
  lootIn(L,'selec',CS.rep?3:8,[60,40,480,240],1);lootIn(L,'selec',2,[504,30,650,128],2);if(!CS.rep){lootIt(L,'sflash',620,60,1);lootIt(L,'score',540,110,1)}
  let st=6;
  L.onUpdate=dt=>{soTick(L,dt);bossAI(L,dt,b=>{st-=dt;if(st<=0){st=7;for(let i=0;i<2;i++){const p=E.freeSpot(b.x+rnd(-40,40),b.y+rnd(10,40),4,40);if(p)E.addZ('fast',p[0],p[1],{st:'chase'})}X.floatT(b.x,b.y-14,'«Чем могу помочь?»','#ff8a20')}});
    const Q=CS.got;if(!bossAlive(L)&&(CS.rep||sv().so.flash)&&nearRet(L)&&!CS.fin){CS.fin=1;finish('dns')}};
  L.obj=()=>{const o=[];o.push(bossAlive(L)?'Консультант ДНС в сервисе':'Сервис ✓');if(!CS.rep&&!sv().so.flash)o.push('Флешка с координатами — в сервисе');o.push('Электроника: '+(sv().elec|0));if(!bossAlive(L))o.push('Назад к Land Rover');return o};
  CS.fin=0;intro('ДНС · СЛОЖНОСТЬ 4',CS.rep?null:[['m','Оранжевый. ДНС. Тут электроника для верстака и гаража.'],['s','И говорят, в сервисе кто-то оставил флешку. С военными координатами.']]);
};

// ================= ВОЕННЫЙ БУНКЕР (ур.5) =================
BUILD.bunk=function(){
  const Wd=760,Hd=620,L=E.mkLevel('so_bunk',Wd,Hd);B(0,0,Wd,Hd,'#111');common(L);common2(L);
  K.floor(4,4,Wd-4,Hd-4,'tile');B(4,4,Wd-8,Hd-8,'#3a3e3a');
  // бетонные коридоры: сетка комнат
  K.floor(4,520,Wd-4,Hd-4,'forest');K.txt(380,532,'ВХОД В БУНКЕР','#c8e8a0',5);
  const rooms=[[40,380,300,500],[340,380,720,500],[40,220,250,350],[290,220,470,350],[510,220,720,350],[40,30,330,190],[370,30,720,190]];
  for(const r of rooms){K.floor(r[0],r[1],r[2],r[3],'stone')}
  E.gfill(4,4,Wd-4,516,1);for(const r of rooms)E.gfill(r[0],r[1],r[2],r[3],0);
  // проходы
  for(const [x0,y0,x1,y1] of [[360,500,400,520],[140,350,180,380],[380,350,420,380],[600,350,640,380],[250,270,290,300],[470,270,510,300],[150,190,190,220],[560,190,600,220],[330,90,370,130]]){E.gfill(x0,y0,x1,y1,0);K.floor(x0,y0,x1,y1,'stone')}
  for(let y=4;y<516;y+=8)for(let x=4;x<Wd-4;x+=8)if(E.gAt(x+1,y+1)===1)B(x,y,8,8,(x+y)%16?'#2a2e2a':'#323632');
  K.txt(170,392,'КАЗАРМА','#c8d8a0',4);K.txt(530,392,'СТОЛОВАЯ','#c8d8a0',4);K.txt(145,232,'ОРУЖЕЙНАЯ','#ffd23a',4);K.txt(380,232,'ШТАБ','#c8d8a0',4);K.txt(615,232,'СКЛАД','#c8d8a0',4);K.txt(185,42,'РЕАКТОРНАЯ','#ff8a5a',4);K.txt(545,42,'ПРАПОРЩИЦКАЯ','#c8ff8a',4);
  for(const r of rooms){for(let i=0;i<3;i++){const p=spotIn(r[0]+20,r[1]+20,r[2]-20,r[3]-20);X.lowBox(p[0]-8,p[1]-5,16,10,'#4a5a3a','#6a7a5a')}}
  barrels(L,[[100,300],[620,300],[200,120],[520,450]]);
  L.dark=.7;L.tint='4,8,4';X.buildNav();pl.x=380;pl.y=580;pl.a=-Math.PI/2;pl.ma=pl.a;retCar(L,380,596);
  zIn('armor',3,[40,380,720,500]);zIn('gunner',4,[40,380,720,500]);zIn('normal',8,[40,380,720,500]);
  zIn('armor',3,[40,220,720,350]);zIn('raider',3,[40,220,720,350]);zIn('shield',2,[290,220,470,350]);zIn('normal',8,[40,220,720,350]);
  zIn('armor',2,[40,30,330,190]);zIn('gunner',3,[40,30,330,190]);zIn('spitter',2,[40,30,330,190]);
  bossOr(190,110,'ЭКЗОСКЕЛЕТ',1100);
  if(!WD_own('pech')&&window.ARS)ARS.addWpnItem(L,'pech',145,300);
  itemsIn('pkm',2,[40,220,250,350],60);itemsIn('sp6',1,[510,220,720,350],12);itemsIn('vog',1,[510,220,720,350],4);itemsIn('stok',4,[40,30,720,500],2);
  lootIn(L,'selec',3,[40,30,720,500],1);lootIn(L,'sfood',3,[340,380,720,500],2);lootIn(L,'swat',3,[340,380,720,500],2);lootIn(L,'sfuel',2,[510,220,720,350],1);
  const pr={x:600,y:110};L.npcs.push({draw(){shadowBlob(pr.x,pr.y,5);X.drawSoldier(X.sprN.getContext("2d"),tm,{body:"#4a5a32",head:"#2e3a22",sk:"#e8b898",gun:true});spr(X.sprN,pr.x,pr.y,Math.atan2(pl.y-pr.y,pl.x-pr.x))}});
  L.its.push({x:pr.x,y:pr.y,r:18,label:()=>bossAlive(L)?'Прапор (за решёткой)':'Прапор: армейская лавка',act:()=>{if(bossAlive(L)){say([['P','Сначала железного внизу... то есть в реакторной. Тогда поговорим.']]);return}
    const s=sv();if(!s.so.prap){s.so.prap=1;save();say([['P','Прапорщик Сидорчук. Сижу тут с первого дня. Вы этого железного уложили?'],['m','Уложили.'],['P','Уважаю. Слушай сюда: склад мой — лавка твоя. Платишь жетонами — их у мертвецов в форме полно.'],
      ['P','И рацию возьми. Будешь во дворе — вызывай, привезу.']],()=>openPrap());return}openPrap()}});
  L.onUpdate=dt=>{soTick(L,dt);const s=sv();if(!bossAlive(L)&&s.so.prap&&nearRet(L)&&!CS.fin){CS.fin=1;finish('bunk')}};
  L.obj=()=>{const o=[];o.push(bossAlive(L)?'Экзоскелет в реакторной (слева сверху)':'Реакторная ✓');if(!sv().so.prap)o.push('Прапор в прапорщицкой (справа сверху)');o.push('Жетоны: '+(sv().tok|0));if(!bossAlive(L)&&sv().so.prap)o.push('Назад к Land Rover');return o};
  CS.fin=0;intro('ВОЕННЫЙ БУНКЕР · СЛОЖНОСТЬ 5',CS.rep?null:[['m','Координаты с флешки. Военная часть, бункер под холмом.'],['s','Тут патроны, которых нигде нет. И, говорят, живой прапорщик.'],['m','Живой — это хорошо. Остальные тут в форме и в броне.']]);
};
BUILD.bunk.fin=f=>{if(f&&!WD_own('vint')&&window.ARS)ARS.grant('vint','Прапор: «Держи, заслужил». ')};

// ================= ЛАВКА ПРАПОРА (Б4/Б5: за жетоны) =================
const PRAP=[
  {n:'Патроны ПКМ ×100 (Печенег)',p:8,f:()=>{PS.pkm=(PS.pkm|0)+100}},
  {n:'Патроны СП-6 ×20 (Винторез)',p:8,f:()=>{PS.sp6=(PS.sp6|0)+20}},
  {n:'Выстрелы ВОГ ×8 (АГС)',p:10,f:()=>{PS.vog=(PS.vog|0)+8}},
  {n:'Гранатомёт АГС',p:40,w:'ags',f:()=>{window.ARS&&ARS.grant('ags','Прапор: ')}},
  {n:'Бронебойные ×60',p:12,f:()=>{const s=sv();s.apA=(s.apA|0)+60}},
  {n:'Боевой стимулятор',p:10,f:()=>{const s=sv();s.stim=(s.stim|0)+1}},
  {n:'Термитная граната ×2',p:10,f:()=>{const s=sv();s.term=(s.term|0)+2}},
  {n:'Клеймор ×2',p:12,f:()=>{const s=sv();s.clay=(s.clay|0)+2}},
  {n:'Ядро',p:15,f:()=>{const s=sv();s.core=(s.core|0)+1}},
  {n:'Канистра армейского бензина',p:6,f:()=>{const s=sv();s.fuelC=(s.fuelC|0)+1}},
];
const PM={on:false,sel:0,rows:[]};
function openPrap(){PM.on=true;PM.sel=0;lockMove=true;sfx('click')}
SO.openPrap=openPrap;SO.isPrap=()=>PM.on;
function prapBuy(i){const it=PRAP[i];if(!it)return;const s=sv();if(it.w&&WD_own(it.w)){note('Уже есть');return}if((s.tok|0)<it.p){note('Не хватает жетонов: нужно '+it.p);sfx('thump',1.6);return}
  s.tok-=it.p;it.f();save();sfx('coin');note('Прапор: «Держи. '+it.n+'»')}
function drawPrap(){const k=ui.width/W;u.setTransform(k,0,0,k,0,0);u.fillStyle='rgba(4,8,4,.85)';u.fillRect(0,0,W,H);
  const x0=30,y0=12,w=W-60;u.fillStyle='#2a3a22';u.fillRect(x0,y0,w,H-24);u.fillStyle='#6a7a4a';u.fillRect(x0,y0,w,2);
  uiFont(6,true);u.fillStyle='#c8ff8a';u.textAlign='center';u.fillText('ЛАВКА ПРАПОРА · жетонов: '+(sv().tok|0),W/2,y0+10);u.textAlign='left';
  PM.rows=[];PRAP.forEach((it,i)=>{const y=y0+16+i*12.5,own=it.w&&WD_own(it.w);PM.rows.push([x0+4,y,w-8,11.5]);u.fillStyle=i===PM.sel?'rgba(200,255,138,.35)':'rgba(255,255,255,.06)';u.fillRect(x0+4,y,w-8,11.5);
    uiFont(4.6,true);u.fillStyle=own?'#7affb0':'#e8f0d8';u.fillText(it.n,x0+8,y+7.5);u.textAlign='right';u.fillStyle=(sv().tok|0)>=it.p?'#c8ff8a':'#ff6a6a';u.fillText(own?'есть':it.p+' жет.',x0+w-8,y+7.5);u.textAlign='left'});
  uiFont(3.8,true);u.fillStyle='#9ab07a';u.textAlign='center';u.fillText(touch.on?'Нажми на товар · вне списка — закрыть':'W/S — выбор · E — купить · Esc — закрыть',W/2,H-15);u.textAlign='left'}
(window.__pre=window.__pre||[]).unshift(function(e){if(!PM.on||state!=='play')return false;const t=e.type;
  if(t==='keydown'){if(e.code==='Escape'||e.code==='KeyQ'){PM.on=false;lockMove=false}else if(e.code==='KeyW'||e.code==='ArrowUp')PM.sel=(PM.sel+PRAP.length-1)%PRAP.length;else if(e.code==='KeyS'||e.code==='ArrowDown')PM.sel=(PM.sel+1)%PRAP.length;else if(['KeyE','Enter','Space'].includes(e.code)&&!e.repeat)prapBuy(PM.sel);return true}
  if(t==='mousedown'||t==='touchstart'){const p=toXY(e.changedTouches?e.changedTouches[0]:e);const i=PM.rows.findIndex(r=>inR(p,...r));if(i<0){PM.on=false;lockMove=false}else{if(i===PM.sel||touch.on)prapBuy(i);PM.sel=i}return true}
  return t!=='mousemove'});
{const _r2=render;render=function(){_r2();if(PM.on&&state==='play')try{drawPrap()}catch(e){console.warn(e)}}}

})();
try{BG.P=BG.G;NAME.P='ПРАПОР';NCOL.P='#c8ff8a';PORTRAIT.P=PORTRAIT.G;PCV.P=PCV.G}catch(e){console.warn('sortie: прапор',e)}
