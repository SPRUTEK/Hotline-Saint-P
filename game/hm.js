// =====================================================================
//  hm.js — доработка 01.11 «как в Hotline Miami» (всё одобрено Натальей):
//  · Д1 мгновенный лут (тайники «Обшарить», без анимаций обыска), Д2 пять видов лута,
//    Д5 золотые находки, Д5б ценное — у опасных врагов; Л5 трофеи с особых зомби;
//  · Д4 сейф с кодом в каждой главе (записка — на участке раньше), Д4б ключ-карты
//    и служебные двери, Д5в секретные комнаты за ними;
//  · М1 тихий шаг (Ctrl/C или слабый наклон стика), М2 рывок (Shift), М2б пинок (V):
//    сбивает с ног, лежачих добивают любым ударом; М3/М3б заражение и антидот;
//    М4в «спящие» на полу встают, М4г раздутые взрываются от огня;
//    М5 фонарик на батарее в тёмных местах (L); М6 растяжки (T) и баррикады (Y);
//    М8 выжившие на участках → Л6 медсестра, Л6б оружейник, Л6в гараж во дворе.
//  Подключается после upgrade.js. Наружу: window.HM.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.engine||!C1.X||!window.UP||!UP.SV){console.warn('hm: нет движка');return}
const E=C1.engine,X=C1.X,PS=C1.PS,WD=C1.WD,TAU=Math.PI*2,sfx=X.sfx;
const HM={};window.HM=HM;
const SV=()=>UP.SV();
const dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
const ad=(a,b)=>{let d=a-b;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
const upg=()=>!!(C1.upg&&C1.upg());
const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)};
function chN(){for(const n of [10,9,8,7,6,5,4,3,2])if(window['C'+n]&&window['C'+n].on)return n;return 1}
function fmt(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')}
function sv(){const s=SV();s.troph=s.troph||{};s.survL=s.survL||{};s.know=s.know||{};s.codes=s.codes||{};s.safe=s.safe||{};s.secD=s.secD||{};s.cardCh=s.cardCh||{};return s}
function save(){try{UP.persist()}catch(e){}}

// ---------- Д1: убираем анимации обыска у лута ----------
try{if(window.MG&&MG.RULES){for(let i=MG.RULES.length-1;i>=0;i--){const src=MG.RULES[i][0].source;if(/Обыскать|Порыться|Взять: |Забрать припасы/.test(src))MG.RULES.splice(i,1)}}}catch(e){}

// ---------- поиск мест на уровне ----------
function reach(L){try{return E.flowTo(pl.x,pl.y)}catch(e){return null}}
function okAt(L,nd,x,y){if(E.solidAt(x,y,5))return false;if(!nd)return true;const cx=Math.floor(x/8),cy=Math.floor(y/8);const v=nd[cy*L.nw+cx];return v!=null&&v>=0}
function spots(L,nd,pred){const r=[];for(let y=14;y<L.h-14;y+=8)for(let x=14;x<L.w-14;x+=8){if(!okAt(L,nd,x,y))continue;if(pred&&!pred(x,y))continue;r.push([x,y])}return r}
const nearFurn=(x,y)=>[[9,0],[-9,0],[0,9],[0,-9]].some(([a,b])=>E.gAt(x+a,y+b)===2);
const nearWallUp=(x,y)=>E.gAt(x,y-9)===1&&E.gAt(x-6,y-9)===1&&E.gAt(x+6,y-9)===1;
function pick(arr,far,minD){const c=arr.filter(p=>dist(p[0],p[1],pl.x,pl.y)>(minD||70));const a=c.length?c:arr;if(!a.length)return null;
  if(far){a.sort((p,q)=>dist(q[0],q[1],pl.x,pl.y)-dist(p[0],p[1],pl.x,pl.y));return a[Math.floor(Math.random()*Math.min(4,a.length))]}
  return a[Math.floor(Math.random()*a.length)]}
function takeSpot(arr,p){if(!p)return;for(let i=arr.length-1;i>=0;i--)if(dist(arr[i][0],arr[i][1],p[0],p[1])<40)arr.splice(i,1)}

// ---------- Д2: лут — патроны, медицина, рубли, детали, трофеи ----------
const T=(x,y,t,c)=>X.floatT(x,y,t,c);
function giveAmmo(x,y,base){const k=UP.pickAmmo(),q=UP.qtyFor(k,base);if(k==='fuel')PS.fuel=Math.min(100,(PS.fuel||0)+q);else PS[k]=(PS[k]||0)+q;T(x,y,'+'+q+' '+((C1.AMN&&C1.AMN[k])||'патр.'),'#ffe27a')}
function giveParts(x,y,n){const s=sv();s.parts=(s.parts|0)+n;T(x,y-6,'+'+n+' дет.','#8af0ff')}
function giveMed(x,y){const r=Math.random();if(r<.15){PS.pot=(PS.pot||0)+1;T(x,y-10,'+зелье','#c86aff')}else if(r<.4){sv().anti=(sv().anti|0)+1;T(x,y-10,'+антидот','#8aff3a')}else if(r<.7){giveParts(x,y,1)}else{PS.syr=(PS.syr|0)+1;T(x,y-10,'+шприц','#6aff9a')}}
function openCache(c){c.done=true;sfx('pick');const x=c.x,y=c.y;{const s=sv(),id=E.L&&E.L.id;if(id){s.cacheO=s.cacheO||{};s.goldO=s.goldO||{};if(c.gold)s.goldO[id]=1;else s.cacheO[id]=(s.cacheO[id]|0)+1;save()}}
  if(c.gold){C1.addRub&&C1.addRub(350+Math.floor(Math.random()*400)+chN()*60,x,y);giveParts(x,y,3);giveMed(x,y);if(upg())giveAmmo(x,y+8,16);sfx('coin');C1.shake=Math.max(C1.shake||0,.2);
    if(c.card){const s=sv();s.cards=(s.cards|0)+1;T(x,y-16,'КЛЮЧ-КАРТА','#ffd23a');note('Ключ-карта! Служебная дверь с жёлтой полосой где-то в этой главе.')}return}
  let got=0;const r=Math.random();
  if(upg()&&r<.18){giveAmmo(x,y,8);got=1}else if(r<.32){giveMed(x,y);got=1}else if(r<.85){C1.addRub&&C1.addRub(60+Math.floor(Math.random()*140),x,y);got=1}
  if(Math.random()<.45||!got)giveParts(x,y,1+(Math.random()<.3?1:0));
}
HM.openCache=openCache;
const TROPHZ={gunner:['tag',.35],raider:['patch',.45],armor:['plate',.55],brute:['fang',.6],spitter:['gland',.3],shield:['tag',.25]};

// ---------- сейфы, записки, двери по главам ----------
const NOTEL={off1:1,mall1:2,cellar:3,flatb:4,town5:5,dacha6:6,top7:7,stop8_1:8,stop8_0:8};
const SAFEL={off2:1,gym:2,tunnels:3,club:4,villa5:5,farm6:6,main7:7,sands8:8};
const DOORL={off2:1,mall2:2,lair:3,nevsky:4,colos5:5,forest6:6,cellar7:7,sands8:8};
const SURVL={park:1,off2:1,mall2:1,gym:1,tunnels:1,nevsky:1,club:1,town5:1,colos5:1,forest6:1,street6:1,terrace7:1,main7:1,sands8:1,flatb:1,alley5:1};
const SNAMES=['Студент Петя','Ира, медсестра','Курьер Ахмед','Гоша, оружейник','Бабушка Зина','Саня, автослесарь','Таня с сыном','Дед Матвей','Бариста Лиза','Охранник Коля','Диджей Сеня','Почтальон Вера','Таксист Рустам','Школьница Алина','Сантехник Гена','Художник Арсений'];
function codeOf(ch){const s=sv();if(!s.codes[ch])s.codes[ch]=String(1000+Math.floor(Math.random()*9000));return s.codes[ch]}

// ---------- новый участок ----------
let curL=null;
function onLevel(L){
  if(L.hm)return;L.hm={caches:[],trips:[],bars:[],npcs:[],safe:null,note:null,door:null,surv:null};
  if(L.secret)return;
  const alive=L.zs.filter(z=>!z.dead).length,combat=L.armed!==false&&alive>=3;
  const ch=chN(),s=sv();
  // НПС двора у Михалыча
  for(const it of L.its||[]){let lb='';try{lb=it.label()}catch(e){}if(/Михалыч/.test(lb)){addYard(L,it.x,it.y);break}}
  if(!combat)return;
  const nd=reach(L);let all=spots(L,nd);if(all.length<6)return;
  let furn=all.filter(p=>nearFurn(p[0],p[1]));
  // Д1/Д5: тайники
  s.cacheO=s.cacheO||{};s.goldO=s.goldO||{};const n=Math.max(0,Math.min(5,2+Math.floor(alive/12))-(s.cacheO[L.id]|0)); // 02.11: тайники не появляются заново
  for(let i=0;i<n;i++){const p=pick(furn.length?furn:all,false,60);if(!p)break;takeSpot(furn,p);takeSpot(all,p);addCache(L,p[0],p[1],false)}
  // Д5б: золотая находка у самого опасного врага
  const dz=L.zs.find(z=>!z.dead&&(z.type==='brute'||z.type==='raider'||z.type==='armor'||z.type==='gunner'||z.type==='shield'));
  if(s.goldO[L.id]){}else if(dz){const f=E.freeSpot(dz.x+rn(-14,14),dz.y+rn(-14,14),5,40);if(f&&okAt(L,nd,f[0],f[1]))addCache(L,f[0],f[1],true)}
  else if(Math.random()<.5){const p=pick(all,true);if(p){takeSpot(all,p);addCache(L,p[0],p[1],true)}}
  // Д4: записка с кодом и сейф
  if(NOTEL[L.id]&&!s.know[NOTEL[L.id]]){const p=pick(furn.length?furn:all,true);if(p){takeSpot(all,p);const c=NOTEL[L.id];L.hm.note={x:p[0],y:p[1]};
    L.its.push({x:p[0],y:p[1],r:13,label:()=>'Записка',cond:()=>!s.know[c],act:()=>{s.know[c]=codeOf(c);save();sfx('click');note('Записка: «Сейф — '+s.know[c]+'. Не забудь!»');T(p[0],p[1]-8,'КОД '+s.know[c],'#ffd23a')}})}}
  if(SAFEL[L.id]&&!s.safe[SAFEL[L.id]]){const wl=all.filter(p=>nearWallUp(p[0],p[1]));const p=pick(wl.length?wl:all,true);if(p){takeSpot(all,p);const c=SAFEL[L.id];L.hm.safe={x:p[0],y:p[1],c};
    const open=()=>{s.safe[c]=1;save();sfx('power',.6);sfx('coin');C1.addRub&&C1.addRub(1200+c*300,p[0],p[1]);giveParts(p[0],p[1],4);PS.syr=(PS.syr|0)+1;s.cards=(s.cards|0)+1;s.anti=(s.anti|0)+1;
      T(p[0],p[1]-16,'КЛЮЧ-КАРТА','#ffd23a');note('Сейф открыт! Деньги, детали, шприц, антидот и ключ-карта.')};
    L.its.push({x:p[0],y:p[1],r:14,label:()=>s.know[c]?'Открыть сейф (код '+s.know[c]+')':'Сейф с кодовым замком',cond:()=>!s.safe[c],act:()=>{
      if(s.know[c]){open();return}
      if(window.MG&&MG.P&&MG.P.code){MG.play('P','code',{title:'Взлом сейфа: кода нет — подбирай'},()=>open());return}
      note('Нужен код. Записка где-то раньше в этой главе.')}})}}
  // Д4б/Д5в: служебная дверь → секретная комната
  if(DOORL[L.id]){const wl=all.filter(p=>nearWallUp(p[0],p[1]));const p=pick(wl.length?wl:all,true,90);if(p){takeSpot(all,p);L.hm.door={x:p[0],y:p[1]-6};const id=L.id,c=DOORL[L.id];
    L.its.push({x:p[0],y:p[1],r:14,label:()=>s.secD[id]?'Служебная дверь (открыта): войти':(s.cards|0)>0?'Служебная дверь: открыть ключ-картой':'Служебная дверь (нужна ключ-карта)',act:()=>{
      if(s.secD[id]){sfx('click');C1.enterSecret(prev=>buildSecret(prev,id,c));return} // 04.11: открытая дверь — входи сколько угодно, без новой карты
      if((s.cards|0)<=0){note('Заперто. Ключ-карты бывают в сейфах, у охраны и у Михалыча.');sfx('thump',1.6);return}
      s.cards--;s.secD[id]=1;save();sfx('click');C1.enterSecret(prev=>buildSecret(prev,id,c))}})}}
  // М8: выживший
  if(SURVL[L.id]&&!s.survL[L.id]&&upg()){const p=pick(furn.length?furn:all,true,110);if(p){takeSpot(all,p);const v={x:p[0],y:p[1],a:rn(0,TAU),done:false,t:0};L.hm.surv=v;
    L.its.push({x:v.x,y:v.y,r:15,label:()=>'Спасти выжившего',cond:()=>!v.done,act:()=>rescue(L,v)})}}
}
function addCache(L,x,y,gold){const c={x,y,gold,done:false,ph:Math.random()*6,card:gold&&!sv().cardCh[chN()]&&Math.random()<.5};if(c.card)sv().cardCh[chN()]=1;L.hm.caches.push(c);
  L.its.push({x,y,r:13,label:()=>gold?'Обшарить (золотая находка)':'Обшарить',cond:()=>!c.done,act:()=>openCache(c)})}
function rn(a,b){return a+Math.random()*(b-a)}
function rescue(L,v){v.done=true;const s=sv();s.surv=(s.surv|0)+1;s.survL[L.id]=1;const nm=SNAMES[(s.surv-1)%SNAMES.length];v.nm=nm;save();sfx('pick');
  C1.addRub&&C1.addRub(300,v.x,v.y);giveParts(v.x,v.y,2);T(v.x,v.y-18,'СПАСЁН: '+nm,'#7affb0');
  const un={2:'Медсестра Ира теперь во дворе у Михалыча: лечит и снимает заражение.',4:'Оружейник Гоша во дворе: улучшения стволов на 20% дешевле.',6:'Автослесарь Саня открыл гараж во дворе: броня, бампер и нитро для машин.'}[s.surv];
  note(un||(nm+' бежит к Михалычу. Спасибо!'))}
// секретная комната за служебной дверью
function buildSecret(prev,id,ch){
  C1.secRoom(prev,'hmsec_'+id,200,140,ch%2?'server':'wood');
  const B=X.B,lb=X.lowBox;
  for(let x=18;x<186;x+=26){B(x,12,20,12,'#2a2630');B(x+2,14,16,3,'#5a5262');B(x+2,19,16,3,'#4a4252')}E.gfill(12,8,188,26,1);
  lb(20,60,30,16,'#4a3a2a','#6a5a4a');lb(150,60,30,16,'#4a3a2a','#6a5a4a');B(90,40,20,14,'#ffd23a');B(92,42,16,10,'#2a2630');
  const L=E.L;L.hm={caches:[],trips:[],bars:[],npcs:[]};
  addCache(L,60,96,true);addCache(L,140,96,true);addCache(L,100,70,false);L.hm.caches[0].card=false;
  // 04.11: собранное в служебке запоминается — при повторном входе лут не появляется заново
  const sv0=sv();sv0.secC=sv0.secC||{};const st=sv0.secC[id]||(sv0.secC[id]=[0,0,0,0]);const again=!!st[3];st[3]=1;save();
  L.hm.caches.forEach((c,i)=>{let v=!!st[i];if(v)c.card=false;Object.defineProperty(c,'done',{configurable:true,get(){return v},set(x){v=x;if(x&&!st[i]){st[i]=1;save()}}})});
  L.lights.push([100,80,80,.9]);
  if(ch>=2&&!again){for(let i=0;i<2;i++)E.addZ(ch>=5?'raider':'gunner',40+i*120,40,{st:'idle',a:Math.PI/2})}
  X.buildNav();note('Служебка! Тут хранили самое ценное.');
}
// ---------- Л6: двор — медсестра, оружейник, гараж ----------
function addYard(L,mx,my){const s=sv(),list=[];
  const mk=(need,nm,col,hair,act,lb)=>{if((s.surv|0)<need)return;const f=E.freeSpot(mx+(list.length%2?-1:1)*(24+12*list.length),my+10,5,50);if(!f)return;const n={x:f[0],y:f[1],col,hair,nm};list.push(n);
    L.its.push({x:n.x,y:n.y,r:14,label:()=>lb,act})};
  mk(2,'Ира','#e8f0f4','#c86a3a',()=>{PS.hp=PS.max;PS.inf=0;PS.imm=30;sfx('pick');note('Ира: «Держи, зашила и прокапала. Заражения нет»')},'Медсестра Ира: подлечиться');
  mk(4,'Гоша','#4a5a3a','#2a2a2a',()=>UP.open('bench','smith'),'Оружейник Гоша: улучшить стволы −20%');
  mk(6,'Саня','#2a4a8a','#8a6a3a',()=>UP.open('garage','garage'),'Автослесарь Саня: гараж');
  L.hm.npcs=list}

// ---------- М2/М2б/М5/М6: действия игрока ----------
let dashCd=0,kickCd=0,altCd=0,lastSyr=0,prevScene='';
function canAct(){const L=E.L;return C1.on&&state==='play'&&C1.mode==='td'&&L&&L.armed&&!C1.noWpn&&!C1.over&&!(UP.isOpen&&UP.isOpen())}
function dash(){if(!canAct()||dashCd>0||PS.carry)return;dashCd=1.1;const a=pl.mv?pl.ma:pl.a;pl.hmDash={t:.17,a};PS.inv=Math.max(PS.inv,.22);sfx('swing',1.4)}
function kick(){if(!canAct()||kickCd>0)return;kickCd=.6;sfx('swing',.8);let hit=0;
  for(const z of E.L.zs){if(z.dead||z.st==='hidden')continue;const d=dist(z.x,z.y,pl.x,pl.y);if(d>z.r+14)continue;const za=Math.atan2(z.y-pl.y,z.x-pl.x);if(Math.abs(ad(za,pl.a))>1.1)continue;hit=1;
    if(z.down>0){X.hurtZ(z,z.hp+1,za,120);T(z.x,z.y-12,'ДОБИЛ!','#ff5050');continue}
    if(z.type==='boss'||z.nm){z.stun=Math.max(z.stun||0,.25);z.kbx+=Math.cos(za)*80;z.kby+=Math.sin(za)*80;continue}
    if(z.type==='brute'){z.stun=Math.max(z.stun||0,.5);z.kbx+=Math.cos(za)*90;z.kby+=Math.sin(za)*90;continue}
    X.hurtZ(z,8,za,0);if(!z.dead){z.down=1.6;z.kbx+=Math.cos(za)*170;z.kby+=Math.sin(za)*170;if(z.st==='idle'||z.st==='alert')z.st='chase'}}
  if(hit){sfx('bat');C1.shake=Math.max(C1.shake||0,.25)}}
function trip(){const s=sv();if(!canAct()||(s.trip|0)<=0)return;s.trip--;save();E.L.hm.trips.push({x:pl.x,y:pl.y,arm:.8});sfx('click');note('Растяжка стоит. Осталось: '+s.trip)}
function barricade(){const s=sv(),L=E.L;if(!canAct()||!L.hm)return;if((s.parts|0)<2){note('Баррикада: нужно 2 детали');return}if(L.hm.bars.filter(b=>!b.gone).length>=3){note('Больше трёх баррикад не поставить');return}
  const a=pl.a,cx=pl.x+Math.cos(a)*14,cy=pl.y+Math.sin(a)*14,hor=Math.abs(Math.sin(a))>Math.abs(Math.cos(a));const w=hor?16:4,h=hor?4:16,x0=Math.round(cx-w/2),y0=Math.round(cy-h/2);
  for(let y=y0;y<y0+h;y+=2)for(let x=x0;x<x0+w;x+=2)if(E.gAt(x,y)!==0){note('Тут не встанет');return}
  for(const z of L.zs)if(!z.dead&&z.x>x0-6&&z.x<x0+w+6&&z.y>y0-6&&z.y<y0+h+6){note('Мешают зомби');return}
  s.parts-=2;save();const b={x:x0,y:y0,w,h,hp:120,t:45};L.hm.bars.push(b);E.gfill(x0,y0,x0+w,y0+h,2);X.buildNav();sfx('thump');note('Баррикада: зомби её ломают, зато их пули её не пробивают')}
function torch(){const L=E.L;if(!L||!L.hmTorch)return;PS.fl=!PS.fl;sfx('click')}
// ПКМ/F с подствольником на прокачанном автомате
C1.altFire=function(){const d=WD[PS.wpn];if(!d||!d.gl)return false;if(altCd>0){if((PS.moon|0)>0)return false;note('Подствольник перезаряжается');return true}
  altCd=8;const a=pl.a,L=E.L;L.buls.push({x:pl.x+Math.cos(a)*10,y:pl.y+Math.sin(a)*10,vx:Math.cos(a)*240,vy:Math.sin(a)*240,dmg:30,life:.45,pierce:0,kb:120,hit:[],col:'#c8ff8a',boom:46});
  sfx('slug',.7);C1.shake=Math.max(C1.shake||0,.4);return true};
C1.onKey=function(c,e){
  if(c==='KeyI'||c==='Tab'){if(e&&e.preventDefault)e.preventDefault();if(state==='play'&&C1.on&&!(UP.isOpen&&UP.isOpen())){UP.open('bag','inv')}return}
  if(c==='ShiftLeft'||c==='ShiftRight')dash();
  if(c==='KeyV')kick();if(c==='KeyT')trip();if(c==='KeyY')barricade();if(c==='KeyL')torch();
};
// кнопки для телефона
const vis=()=>touch.on&&canAct();
C1.xbtn=[
  {x:W-92,y:H-42,r:9,t:'РЫВОК',col:'#6ab8ff',vis,act:dash,on:()=>dashCd<=0},
  {x:W-66,y:H-68,r:9,t:'ПИНОК',col:'#ff9a4a',vis,act:kick},
  {x:W-92,y:H-66,r:8,t:'РАСТЯЖ.',col:'#c8c8c8',vis:()=>vis()&&(sv().trip|0)>0,act:trip},
  {x:W-118,y:H-54,r:8,t:'БАРРИК.',col:'#c8a060',vis:()=>vis()&&(sv().parts|0)>=2,act:barricade},
  {x:W-62,y:H-92,r:8,t:'ФОНАРЬ',col:'#fff6b0',vis:()=>vis()&&!!(E.L&&E.L.hmTorch),act:torch,on:()=>!!PS.fl},
  {x:W/2+66,y:8,r:6,t:'🎒',col:'#ffd23a',vis:()=>touch.on&&C1.on&&state==='play'&&!(UP.isOpen&&UP.isOpen())&&!cut&&!dlg&&!C1.over,act:()=>UP.open('bag','inv')},
];

// ---------- цикл ----------
const _upd=update;
update=function(dt){
  _upd(dt);
  try{tick(dt)}catch(e){console.warn(e)}
};
function tick(dt){
  if(state!=='play')return;
  if(UP.isOpen&&UP.isOpen())return;
  // дома — заражение проходит
  if(scene==='flat'&&!C1.on){PS.inf=0;PS.fl=false;return}
  if(!C1.on)return;
  const L=E.L;if(!L)return;
  if(dashCd>0)dashCd-=dt;if(kickCd>0)kickCd-=dt;if(altCd>0)altCd-=dt;if(PS.imm>0)PS.imm-=dt;
  // М1: тихий шаг
  const mvL=(()=>{if(!touch.mv)return 1;const dx=touch.mv.x-touch.mv.ox,dy=touch.mv.y-touch.mv.oy;return Math.min(1,Math.hypot(dx,dy)/20)})();
  PS.sneak=!!(keys.ControlLeft||keys.ControlRight||keys.KeyC)||(touch.mv&&mvL<.6);
  if(keys.ControlLeft||keys.ControlRight||keys.KeyC)C1.spdMul=(C1.spdMul||1)*.55;
  if(C1.mode!=='td')return;
  if(L!==curL){curL=L;try{onLevel(L)}catch(e){console.warn('hm level',e)}if(L.dark>=.5&&!L.torch&&!L.secret){L.hmTorch=1;if(PS.bat==null)PS.bat=100}}
  if(!L.hm)return;
  hookDraw(L);
  const hold=!!dlg||!!cut;if(hold)return;
  // рывок
  const D=pl.hmDash;if(D){D.t-=dt;const sp=230*dt,nx=pl.x+Math.cos(D.a)*sp,ny=pl.y+Math.sin(D.a)*sp;if(!E.solidAt(nx,pl.y,3.5))pl.x=nx;if(!E.solidAt(pl.x,ny,3.5))pl.y=ny;
    if(Math.random()<.8)L.fx.push({x:pl.x+rn(-2,2),y:pl.y+rn(-2,2),vx:0,vy:0,life:.2,c:'#9ad8ff'});
    for(const z of L.zs){if(z.dead||z.st==='hidden'||z.down>0||z.type==='boss'||z.type==='brute'||z.nm)continue;if(dist(z.x,z.y,pl.x,pl.y)<z.r+6){const za=Math.atan2(z.y-pl.y,z.x-pl.x);z.down=1.3;z.kbx+=Math.cos(za)*140;z.kby+=Math.sin(za)*140;sfx('thump',1.3);if(z.st==='idle'||z.st==='alert')z.st='chase'}}
    if(D.t<=0)pl.hmDash=null}
  // М3: заражение
  if(PS.inf>0&&chN()!==3){
    if(PS.inf>=70&&(sv().anti|0)>0){sv().anti--;save();PS.inf=0;PS.imm=60;sfx('pick');note('Антидот! Заражение снято, минута иммунитета.')}
    else if(PS.inf>=100&&L.armed&&PS.hp>0&&!C1.over){PS.hp-=2*dt;C1.hurt=Math.max(C1.hurt||0,.08);if(PS.hp<=0)X.loseLife()}}
  if((PS.syr|0)<lastSyr&&PS.inf>0)PS.inf=Math.max(0,PS.inf-30);lastSyr=PS.syr|0;
  // М5: фонарик
  if(L.hmTorch){if(PS.fl&&PS.bat>0){PS.bat=Math.max(0,PS.bat-1.1*dt);if(PS.bat<=0){PS.fl=false;note('Батарея фонарика села. Подожди, подзарядится.')}}else PS.bat=Math.min(100,(PS.bat||0)+.6*dt);L.torch=!!(PS.fl&&PS.bat>0)}
  // М4в спящие встают, когда остальные кончились; М4г раздутые рвутся от огня
  let act=0,slp=0;for(const z of L.zs){if(z.dead)continue;if(z.st==='hidden'&&z.hid==='floor')slp++;else act++;
    if(z.type==='bloat'&&z.burn>0&&!z.dead&&C1.mode==='td')X.hurtZ(z,999,0,0)}
  if(slp&&!act&&L.t>2)for(const z of L.zs)if(!z.dead&&z.st==='hidden'&&z.hid==='floor'){z.st='rise';z.riseT=.55;z.mk='!';z.mkT=1.2}
  // М6: растяжки и баррикады
  for(const t of L.hm.trips){if(t.gone)continue;if(t.arm>0){t.arm-=dt;continue}
    for(const z of L.zs){if(z.dead||z.st==='hidden')continue;if(dist(z.x,z.y,t.x,t.y)<9){t.gone=1;L.buls.push({x:t.x,y:t.y,vx:0,vy:0,dmg:45,life:.001,pierce:0,kb:0,hit:[],boom:56,col:'#fff'});break}}}
  let nav=0;for(const b of L.hm.bars){if(b.gone)continue;b.t-=dt;let n=0;for(const z of L.zs)if(!z.dead&&z.st!=='hidden'&&z.x>b.x-8&&z.x<b.x+b.w+8&&z.y>b.y-8&&z.y<b.y+b.h+8)n++;b.hp-=n*14*dt;
    if(b.hp<=0||b.t<=0){b.gone=1;E.gfill(b.x,b.y,b.x+b.w,b.y+b.h,0);nav=1;sfx('thump',.8);for(let i=0;i<8;i++)L.fx.push({x:b.x+Math.random()*b.w,y:b.y+Math.random()*b.h,vx:rn(-30,30),vy:rn(-30,30),life:.4,c:'#8a6a3a'})}}
  if(nav)X.buildNav();
  if(L.hm.surv&&L.hm.surv.done)L.hm.surv.t+=dt;
}
// заражение от ударов зомби (пули людей не заражают)
const _ah=C1.armorHit;
C1.armorHit=function(d){if(C1._eb!==1&&C1.mode==='td'&&!(PS.imm>0)&&chN()!==3)PS.inf=Math.min(100,(PS.inf||0)+d*.33);return _ah?_ah(d):d};
C1.infect=k=>{if(PS.imm>0||chN()===3)return;PS.inf=Math.min(100,(PS.inf||0)+k*100)};
// трофеи, ключ-карты, детали с убийств; огонь от раздутых
const _kill=C1.onKillAny;
C1.onKillAny=function(z){if(_kill)_kill(z);try{const L=E.L;if(!L||C1.mode!=='td'||!L.armed)return;
  if(z.type==='bloat')X.igniteAt&&X.igniteAt(z.x,z.y);
  const tr=TROPHZ[z.type];if(z.type==='boss'||(z.nm&&z.type==='brute'))L.items.push({kind:'troph',n:'boss',x:z.x,y:z.y,taken:false});
  else if(tr&&Math.random()<tr[1])L.items.push({kind:'troph',n:tr[0],x:z.x+rn(-3,3),y:z.y+rn(-3,3),taken:false});
  if((z.type==='brute'||z.type==='armor')&&Math.random()<.5)L.items.push({kind:'part',n:1,x:z.x+rn(-4,4),y:z.y+rn(-4,4),taken:false});
  const s=sv(),ch=chN();if((z.type==='gunner'||z.type==='raider'||z.type==='armor')&&!s.cardCh[ch]){s.cardCh[ch]=1;L.items.push({kind:'card',n:1,x:z.x,y:z.y+4,taken:false})}
}catch(e){console.warn(e)}};
const _pick=C1.onPick;
C1.onPick=function(it){if(_pick)_pick(it);const s=sv();
  if(it.kind==='troph'){s.troph[it.n]=(s.troph[it.n]|0)+1;T(it.x,it.y,(UP.TROPH[it.n]||{n:'трофей'}).n,'#ff9a4a');save()}
  if(it.kind==='part'){giveParts(it.x,it.y,it.n||1);save()}
  if(it.kind==='card'){s.cards=(s.cards|0)+1;T(it.x,it.y,'КЛЮЧ-КАРТА','#ffd23a');note('Ключ-карта охраны! Ищи служебную дверь с жёлтой полосой.');save()}};

// ---------- отрисовка в мире ----------
function hookDraw(L){if(L.drawOver===L._hmD)return;const o=L.drawOver;L._hmD=function(){if(o)o();try{drawWorld(L)}catch(e){}};L.drawOver=L._hmD}
function drawWorld(L){const H_=L.hm;if(!H_)return;
  for(const c of H_.caches){const x=Math.round(c.x),y=Math.round(c.y);
    if(c.done){R(x-4,y-3,8,6,'#2a2228');R(x-3,y-2,6,1,'#140e14');continue}
    if(c.gold){const k=.6+.4*Math.sin(tm*4+c.ph);ctx.fillStyle=`rgba(255,210,60,${.22*k})`;ctx.beginPath();ctx.arc(x,y,10,0,TAU);ctx.fill()}
    R(x-4,y-3,8,6,c.gold?'#b8901a':'#6a4a2a');R(x-4,y-3,8,1,c.gold?'#ffe27a':'#8a6a4a');R(x-1,y-1,2,2,c.gold?'#fff6c0':'#c8a060');
    if(Math.sin(tm*3+c.ph)>.8){R(x+4,y-6,1,3,'#fff');R(x+3,y-5,3,1,'#fff')}}
  for(const it of L.items){if(it.taken)continue;const x=Math.round(it.x),y=Math.round(it.y);
    if(it.kind==='troph'){const bs=it.n==='boss';if(bs){ctx.fillStyle=`rgba(255,120,40,${.25+.15*Math.sin(tm*5)})`;ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill()}R(x-3,y-3,6,6,bs?'#ff9a4a':'#c8a060');R(x-2,y-2,4,2,bs?'#ffe0a0':'#fff0c0');R(x-1,y+1,2,1,'#3a2a1a')}
    if(it.kind==='part'){R(x-3,y-2,6,4,'#5a6a7a');R(x-2,y-3,2,2,'#8af0ff');R(x+1,y,2,1,'#c8c8d0')}
    if(it.kind==='card'){const k=Math.sin(tm*6);ctx.fillStyle=`rgba(255,210,60,${.25+.15*k})`;ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();R(x-4,y-3,8,5,'#ffd23a');R(x-3,y-2,3,3,'#2a6ad8');R(x+1,y-1,2,1,'#2a2a2a')}}
  if(H_.note&&!sv().know[NOTEL[L.id]]){const n=H_.note;R(n.x-3,n.y-3,6,5,'#f4f0e6');R(n.x-2,n.y-2,4,1,'#5a5a6a');R(n.x-2,n.y,3,1,'#5a5a6a');if(Math.sin(tm*4)>.6)R(n.x+3,n.y-6,1,2,'#fff')}
  if(H_.safe){const f=H_.safe,op=sv().safe[f.c];R(f.x-6,f.y-9,12,11,'#3a3e48');R(f.x-5,f.y-8,10,9,op?'#14141a':'#5a606e');if(!op){R(f.x-1,f.y-5,3,3,'#c8c8d0');R(f.x+3,f.y-4,1,2,'#ffd23a')}}
  if(H_.door){const d=H_.door,op=sv().secD[L.id];R(d.x-7,d.y-8,14,10,op?'#14121a':'#4a4a56');R(d.x-7,d.y-8,14,2,'#ffd23a');R(d.x-7,d.y-4,14,1,'#1a1a1a');if(!op)R(d.x+4,d.y-3,2,3,Math.sin(tm*6)>0?'#ff3a3a':'#3aff7a')}
  if(H_.surv){const v=H_.surv;if(!v.done)drawPerson(v.x,v.y,v.a,'#c86a8a','#3a2a1a',Math.sin(tm*8)>.6);else if(v.t<1.4){ctx.globalAlpha=1-v.t/1.4;drawPerson(v.x,v.y-v.t*20,-Math.PI/2,'#c86a8a','#3a2a1a');ctx.globalAlpha=1}}
  for(const n of H_.npcs)drawPerson(n.x,n.y,Math.PI/2,n.col,n.hair);
  for(const t of H_.trips){if(t.gone)continue;R(t.x-5,t.y-1,1,3,'#8a8a8a');R(t.x+4,t.y-1,1,3,'#8a8a8a');R(t.x-4,t.y,8,1,t.arm>0?'#6a6a6a':'#e8e8e8');R(t.x-1,t.y-2,3,3,'#4a5a3a');if(t.arm<=0&&Math.sin(tm*8)>.7)R(t.x,t.y-1,1,1,'#ff3030')}
  for(const b of H_.bars){if(b.gone)continue;R(b.x,b.y,b.w,b.h,'#6a4a2a');for(let i=0;i<Math.max(b.w,b.h);i+=4)if(b.w>b.h)R(b.x+i,b.y,2,b.h,'#8a6a3a');else R(b.x,b.y+i,b.w,2,'#8a6a3a');if(b.hp<60)R(b.x+1,b.y+1,2,1,'#2a1a10')}
}
function drawPerson(x,y,a,body,hair,wave){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(a);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,1,5,4,0,0,TAU);ctx.fill();
  ctx.fillStyle=body;ctx.fillRect(-4,-4,6,8);ctx.fillStyle='#e8c0a0';ctx.fillRect(1,-5,3,2);ctx.fillRect(1,3,3,2);if(wave)ctx.fillRect(3,-7,2,2);
  ctx.fillStyle=hair;ctx.beginPath();ctx.arc(0,0,2.8,0,TAU);ctx.fill();ctx.fillStyle='#e8c0a0';ctx.fillRect(1,-1,2,2);ctx.restore()}

// ---------- HUD: заражение, фонарь, подсказка ----------
const _rnd=render;
render=function(){_rnd();try{hud()}catch(e){}};
function hud(){
  if(state!=='play'||!C1.on||C1.mode!=='td'||(UP.isOpen&&UP.isOpen())||cut||dlg)return;const L=E.L;if(!L||!L.armed||L.noHud)return;
  const k=ui.width/W;u.setTransform(k,0,0,k,0,0);
  let y=C1.hudBot?C1.hudBot+56:(PS.arm&&upg()?54:48);
  if(PS.inf>0){u.fillStyle='rgba(0,0,0,.55)';u.fillRect(4,y-5,70,7);u.fillStyle=PS.inf>=100?(Math.sin(tm*10)>0?'#ff3a3a':'#8aff3a'):'#8aff3a';u.fillRect(5,y-4,68*PS.inf/100,5);uiFont(3.6,true);u.fillStyle='#0a1a04';u.fillText(PS.inf>=100?'ЗАРАЖЁН! ШПРИЦ / АНТИДОТ':'ЗАРАЖЕНИЕ '+Math.round(PS.inf)+'%',7,y-0.4);y+=9;
    if(PS.inf>50){const g=u.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.8);g.addColorStop(0,'rgba(80,200,40,0)');g.addColorStop(1,`rgba(80,200,40,${(PS.inf-50)/50*.35})`);u.fillStyle=g;u.fillRect(0,0,W,H)}}
  if(L.hmTorch){u.fillStyle='rgba(0,0,0,.55)';u.fillRect(4,y-5,46,7);u.fillStyle=PS.fl?'#fff6b0':'#6a6a5a';u.fillRect(5,y-4,44*(PS.bat||0)/100,5);uiFont(3.4,true);u.fillStyle='#1a1a10';u.fillText((PS.fl?'ФОНАРЬ':'ФОНАРЬ ВЫКЛ')+(touch.on?'':' · L'),7,y-0.4);y+=9}
  if(PS.sneak&&pl.mv){uiFont(3.6,true);u.fillStyle='#9ad8ff';u.fillText('тихий шаг',6,y);}
  if(!HM.tip&&!touch.on&&L.t>1&&L.t<9&&upg()){uiFont(3.6,true);u.fillStyle='rgba(255,255,255,.75)';u.textAlign='center';u.fillText('Shift — рывок · V — пинок · Ctrl — тихо · I — рюкзак · T — растяжка · Y — баррикада',W/2,H-15);u.textAlign='left'}
  if(L.t>=9)HM.tip=1;
}
})();
