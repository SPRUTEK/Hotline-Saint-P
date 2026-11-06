// =====================================================================
//  upgrade.js — большая доработка всей игры:
//  · сохранение: рубли, оружейная, патроны, аптечка, броня, лоадаут;
//  · оружейная в квартире (после миссии с Анисом) и сборы перед каждой миссией;
//  · лавка Михалыча (патроны, медицина, ремонт брони, эксклюзивы);
//  · рубли за участок + комбо-серии убийств; дроп с сильных мобов; меньше лута;
//  · броня трёх уровней с прочностью; зелья регенерации; пивной буст;
//  · пауза в любой момент с выходом в главное меню; жёлтая стрелка к выходу.
//  Подключается последним. Наружу: window.UP.
// =====================================================================
(function(){
'use strict';
if(!window.C1||!C1.X||!C1.engine||!C1.WD){console.warn('upgrade: нет движка');return}
const X=C1.X,E=C1.engine,PS=C1.PS,WD=C1.WD,AMN=C1.AMN,TAU=Math.PI*2,sfx=X.sfx;
const UP={ui:null,paused:false};window.UP=UP;
// хардкор: одна жизнь на участок, зомби бьют на 20% сильнее, смерть — заново только текущий участок
C1.hard=true;C1.dmgMul=2.4; // 01.11: урон зомби ×2 (было 1.2)
const fmt=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const inR=(p,x,y,w,h)=>p&&p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h;

// ================= СОХРАНЕНИЕ =================
const SKEY='pp_up1';
const AMKEYS=['ammo','p50','shells','r762','r556','awp','cells','fuel','rockets','nlg','flr','bolt','pkm','sp6','vog'];
const DEF=()=>({rub:0,earned:0,armory:false,shop:false,beerBox:false,maxCh:1,got:{},own:{bat:1,pistol:1},lo:{m:'bat',p:'pistol',t:null},
  am:{ammo:12},mag:{pistol:8},syr:0,pot:0,moon:0,arms:{},eq:null});
let SV=DEF();
try{const o=JSON.parse(localStorage.getItem(SKEY)||'null');if(o)SV=Object.assign(DEF(),o)}catch(e){}
function persist(){try{localStorage.setItem(SKEY,JSON.stringify(SV))}catch(e){}}
UP.save=()=>SV;
// PS → сохранение (после боёв, покупок, сборов)
function store(){
  if(!UP.upg())return persist();
  for(const k of AMKEYS)SV.am[k]=Math.max(0,Math.round(PS[k]||0));
  SV.mag=Object.assign({},PS.mag||{});SV.syr=PS.syr|0;SV.pot=PS.pot|0;SV.moon=PS.moon|0;
  for(const k in (PS.own||{}))if(WD[k]&&k!=='saw')SV.own[k]=1;
  if(PS.arm&&SV.arms[PS.arm.id])SV.arms[PS.arm.id].dur=PS.arm.dur;
  persist();
}
UP.store=store;
setTimeout(()=>{try{applyWU()}catch(e){console.warn(e)}},0);
// сохранение → PS (на старте каждой главы за Микроба/Шмакодявку)
function load(){
  for(const k of AMKEYS)PS[k]=SV.am[k]||0;
  PS.mag=Object.assign({},SV.mag||{});PS.own=Object.assign({},SV.own);PS.lo=Object.assign({},SV.lo);PS.found=[];
  PS.syr=SV.syr|0;PS.pot=SV.pot|0;PS.moon=Math.max(PS.moon|0,SV.moon|0);PS.rl=0;PS.rlw=null;PS.potT=0;PS.beerT=0;
  PS.arm=SV.eq&&SV.arms[SV.eq]?mkArm(SV.eq):null;
  PS.hasShotgun=!!PS.own.shotgun;PS.hasRail=!!PS.own.rail;PS.hasFlame=!!PS.own.flamer;PS.hasAxe=PS.hasExt=PS.hasNail=false;
  PS.wpn=PS.lo.t||PS.lo.p||PS.lo.m||'bat';
}

// ================= ЧЕЙ ХОД: за кого играем =================
UP.upg=function(){
  if(window.C4&&C4.cat)return false;
  if(window.C3&&C3.on)return false;
  if(window.C6&&C6.on)return true;
  return !C1.noWpn;
};
C1.upg=UP.upg;
function chNow(){for(const n of [10,9,8,7,6,5,4,3,2])if(window['C'+n]&&window['C'+n].on)return n;return 1}

// ================= СЮЖЕТНЫЕ НАХОДКИ ПО ГЛАВАМ =================
// что игрок гарантированно получил к началу главы n (для запуска главы из меню)
const STORY=[[2,'armory'],[2,'shotgun'],[2,'rail'],[2,'arm1'],[3,'ak'],[4,'glock'],[5,'awp'],[5,'arm2'],[6,'flamer']];
function grant(id){
  SV.got[id]=1;
  if(id==='armory'){SV.armory=true;SV.shop=true;SV.beerBox=true}
  else if(id.startsWith('arm')){const a=id.slice(3);if(!SV.arms[a])SV.arms[a]={dur:ARM[a].max};if(!SV.eq||ARM[a].lvl>ARM[SV.eq].lvl)SV.eq=a}
  else if(WD[id]){SV.own[id]=1}
}
UP.kit=function(ch){
  const fresh=SV.maxCh<ch;
  for(const [c,id] of STORY)if(c<=ch&&!SV.got[id])grant(id);
  // слоты по умолчанию, если пусто
  if(!SV.lo.t){const t=['ak','shotgun','rail'].find(k=>SV.own[k]);if(t)SV.lo.t=t}
  if(fresh){ // глава запущена впервые (или из меню без прохождения) — базовый запас
    const fl=(k,v)=>{if((SV.am[k]||0)<v)SV.am[k]=v};
    fl('ammo',32);if(SV.own.shotgun)fl('shells',12);if(SV.own.ak)fl('r762',40);if(SV.own.rail)fl('cells',2);if(SV.own.awp)fl('awp',7);if(SV.own.flamer)fl('fuel',67);
    if(SV.syr<2)SV.syr=2;SV.maxCh=ch;
  }
  persist();load();
  if(ch===6){PS.lo={m:null,p:null,t:null};PS.wpn='bat'}
};
UP.grant=id=>{grant(id);persist()};
function storyTo(ch){let n=0;for(const [c,id] of STORY)if(c<=ch&&!SV.got[id]){grant(id);n++}if(ch>SV.maxCh)SV.maxCh=ch;if(n)persist()}
UP.storyTo=storyTo;

// ================= БРОНЯ =================
const ARM={
  '1':{n:'Бронежилет Аниса',lvl:1,prot:.25,max:100,rp:2,c:'#6a6a42',d:'Охотничий жилет с пластинами. Держит четверть урона.'},
  '2':{n:'Бронежилет охраны «Бардака»',lvl:2,prot:.4,max:160,rp:3,c:'#2a2a34',d:'Тяжёлый, с керамикой. Снят в VIP-зале клуба. Держит 40% урона.'},
  '3':{n:'Броня из коры лешего',lvl:3,prot:.55,max:240,rp:4,c:'#5a4a2a',d:'Кора, мох и стальные скобы бати. Держит больше половины урона.'},
  'h':{n:'Спецброня Ханжи',lvl:2,prot:.32,max:120,rp:3,spd:1.15,c:'#4a5a32',d:'Лёгкий армейский жилет её молодости. Держит треть урона, в ней бегаешь быстрее.'},
  // 03.11: новые виды (спецсвойства: spd — скорость, bul — доп. защита от пуль, mel — от укусов и ударов, fire — от огня и кислоты)
  'k':{n:'Косуха «Ночной волк»',lvl:1,prot:.18,max:90,rp:1,spd:1.06,c:'#2a2226',d:'Кожанка байкера с заклёпками. Слабая, зато лёгкая: бегаешь чуть быстрее.'},
  'pp':{n:'Бронежилет ППС',lvl:2,prot:.34,max:150,rp:3,bul:.12,c:'#3a4458',d:'Полицейский, снят с зомби-ППС. Пули держит лучше, чем укусы.'},
  'hk':{n:'Хоккейная форма «СКА»',lvl:2,prot:.3,max:140,rp:3,mel:.12,c:'#2a4aa8',d:'Щитки, налокотники, шлем. Укусы и удары держит лучше, чем пули.'},
  'f':{n:'Пожарная боевка',lvl:2,prot:.28,max:160,rp:3,fire:.6,c:'#c8a030',d:'Огнеупорная куртка МЧС. От огня и кислоты почти не жжёт.'},
  't':{n:'Плитник «Тактикул»',lvl:4,prot:.6,max:300,rp:5,spd:.9,c:'#3a4226',d:'Тяжёлый армейский плитник со шлемом. Держит больше половины урона, но бегаешь медленнее.'},
};
// прокачка брони на верстаке: 3 уровня, отдельные запчасти — кевлар и керамика
const AUC=[[700,2,0],[1600,3,2],[3400,3,4]]; // ₽, кевлар, керамика
function applyAU(){SV.au=SV.au||{};const U=SV.uq||{};for(const id in ARM){const a=ARM[id];if(!a._b)a._b={prot:a.prot,max:a.max,mel:a.mel,spd:a.spd};const t=SV.au[id]|0,md=(SV.aslot&&SV.aslot[id])||[];
    a.prot=Math.min(.85,a._b.prot+.05*t+(md.includes('plates')?.15:0)+(U.u4?.05:0));a.max=Math.round(a._b.max*(1+.25*t)*(U.u5?1.25:1));a.mel=(a._b.mel||0)+(md.includes('kevl')?.15:0)||undefined;a.spd=md.includes('plates')?(a._b.spd||1)*.95:a._b.spd}
  if(PS.arm&&ARM[PS.arm.id]){PS.arm.max=ARM[PS.arm.id].max;PS.arm.prot=ARM[PS.arm.id].prot}}
function haveA(c){return SV.rub>=c[0]&&(SV.kev|0)>=c[1]&&(SV.cer|0)>=c[2]}
function txtA(c){const a=[];if(c[0])a.push(fmt(c[0])+' ₽');if(c[1])a.push(c[1]+' кевлар');if(c[2])a.push(c[2]+' керамика');return a.join(' + ')}
function doAU(id){SV.au=SV.au||{};const t=SV.au[id]|0;if(t>=3){note('Максимум');return}const c=AUC[t];if(!haveA(c)){note('Нужно: '+txtA(c));sfx('thump',1.6);return}
  SV.rub-=c[0];SV.kev-=c[1];SV.cer-=c[2];SV.au[id]=t+1;applyAU();SV.arms[id].dur=ARM[id].max;if(PS.arm&&PS.arm.id===id)PS.arm.dur=ARM[id].max;
  sfx('power',.6);sfx('pick');persist();note(ARM[id].n+': уровень '+(t+1)+' — защита '+Math.round(ARM[id].prot*100)+'%, прочность '+ARM[id].max)}
const AUT=['+5% защиты, +25% прочности','+5% защиты, +25% прочности','+5% защиты, +25% прочности, починка при прокачке'];
UP.applyAU=applyAU;UP.AUC=AUC;
function dropArmParts(){const L=E.L;if(!L||!L.zs||!UP.upg()||!C1.on)return;
  if(window.C8&&C8.done&&!SV.arms.t&&C1.giveArmor){C1.giveArmor('t');note('За «Тактикульщину»: плитник «Тактикул» — в оружейной')}
  for(const z of L.zs){if(!z.dead||z._ap||z.fake)continue;z._ap=1;if(z.ring)continue;
    if(z.type==='zpist'&&!SV.arms.pp&&(C1.done||(window.ARS&&ARS.curCh&&ARS.curCh()>=2))&&Math.random()<.08&&C1.giveArmor){C1.giveArmor('pp');X.floatT(z.x,z.y-22,'БРОНЕЖИЛЕТ ППС!','#8ab4ff')}
    let k=0,c=0;if(z.arm||z.azg){if(Math.random()<.4)k=1;if(Math.random()<.14)c=1}else if(z.type==='brute'){if(Math.random()<.3)k=1;if(Math.random()<.2)c=1}else if(z.type==='boss'){k=2;c=1}
    if(k){SV.kev=(SV.kev|0)+k;X.floatT(z.x,z.y-10,'+'+k+' кевлар','#c8a0ff')}if(c){SV.cer=(SV.cer|0)+c;X.floatT(z.x,z.y-16,'+'+c+' керамика','#ffd0a0')}}}
UP.ARM=ARM;
function mkArm(id){const a=ARM[id],s=SV.arms[id];return {id,lvl:id==='h'?'h':a.lvl,dur:s?s.dur:a.max,max:a.max,prot:a.prot}}
C1.giveArmor=function(id){
  if(!SV.arms[id])SV.arms[id]={dur:ARM[id].max};else SV.arms[id].dur=ARM[id].max;SV.got['arm'+id]=1;
  const better=!SV.eq||ARM[id].lvl>=ARM[SV.eq].lvl;if(better){SV.eq=id;if(UP.upg())PS.arm=mkArm(id)}
  persist();sfx('power',.5);note('Броня: '+ARM[id].n+(better?' — надета':' — на складе'));
};
C1.armorHit=function(d){
  if(!UP.upg()||!PS.arm||PS.arm.dur<=0)return d;
  const A=ARM[PS.arm.id]||{};let p=PS.arm.prot;if(A.bul&&C1._eb===1)p+=A.bul;if(A.mel&&C1._eb!==1&&C1._hsrc!=='fire')p+=A.mel;if(A.fire&&(C1._hsrc==='fire'||C1._hsrc==='acid'))p+=A.fire;p=Math.min(.9,p);
  const ab=d*p;PS.arm.dur=Math.max(0,PS.arm.dur-ab*1.6);
  if(PS.arm.dur<=0){note('Броня сломана и больше не защищает. Почини у Михалыча');sfx('clang')}
  return d-ab;
};

// ================= РУБЛИ, КОМБО, НАГРАДА ЗА УЧАСТОК =================
const INC_MUL=.7; // 02.11: все доходы −30%
function repKey(L){return L&&(L.gradeId||L.id)}
function isRep(L){const k=repKey(L);return !!(k&&SV.clr&&SV.clr[k])}
UP.isRep=isRep;
C1.addRub=function(n,x,y){n=Math.round(n>0?n*INC_MUL:n);if(!n)return;try{const w=WD[PS.wpn],Sc=E.L&&E.L.score;if(n>0&&w&&w.named&&Sc&&(Sc.cb|0)>=2)n*=2}catch(e){}SV.rub+=n;SV.earned+=n;const L=E.L;if(L)L.upRub=(L.upRub||0)+n;
  if(x!=null&&L)X.floatT(x,y-10,'+'+fmt(n)+' ₽','#5ae87a');sfx('coin',.5);persist()};
UP.rub=()=>SV.rub;
const CB=['','','ДВОЙНОЕ УБИЙСТВО!','ТРОЙНОЕ УБИЙСТВО!','ЧЕТВЕРНОЕ!','ПЯТЕРНОЕ!','МЯСОРУБКА!','РЕЗНЯ!','НЕУДЕРЖИМ!','БЕШЕНСТВО!','КИСЛОТНЫЙ ШТОРМ!','ЗОМБОАПОКАЛИПСИС!','ПИТЕРСКИЙ ПОГРОМ!','ЛЕГЕНДА КОЛОМЯГ!','НЕОНОВЫЙ БОГ!','АБСОЛЮТНЫЙ ХАОС!!!'];
let banner=null;
C1.onKillAny=function(z){
  const L=E.L;if(!L)return;
  // комбо-серия: шкала быстро тает, успел убить ещё — двойное, тройное и т.д.
  const S=L.score;if(S&&C1._src!=='ally'&&C1.mode==='td'&&S.cb>=2){const bonus=Math.min(420,(S.cb-1)*20)*(isRep(L)?.25:1);C1.addRub(bonus,z.x,z.y-6);banner={t:CB[Math.min(S.cb,15)]||('СЕРИЯ x'+S.cb),n:S.cb,life:1.4+Math.min(S.cb,15)*.04,combo:1}}
  drops(z);
};
C1.onPick=function(it){const L=E.L;if(!L)return;if(it._lk){(SV.lootT=SV.lootT||{})[it._lk]=1;persist()}if(it.kind==='col')L.upCols=(L.upCols||0)+1;else L.upLoot=(L.upLoot||0)+1};
let lastRes=null;
function rewardFor(R){
  const L=E.L,G={S:500,A:350,B:220,C:120,D:60}[R.g]||60,h=R.S.hits;
  const clean=h===0?250:h<=3?120:h<=8?40:0,speed=Math.min(250,Math.round((R.b.time||0)/10)),loot=(L&&L.upLoot||0)*12,cols=(L&&L.upCols||0)*150,combo=R.S.maxCb>=3?R.S.maxCb*15:0;
  const rep=isRep(L),tot=Math.round((120+G+clean+speed+loot+cols+combo)*(rep?.25:1)); // 02.11: повтор участка — 25%
  R.rub=Math.round(tot*INC_MUL);R.rubWhy='оценка '+R.g+(clean?' · чисто':'')+(speed?' · быстро':'')+(loot?' · лут':'')+(cols?' · находки':'')+(rep?' · повтор 25%':'');
  const k=repKey(L);if(k){SV.clr=SV.clr||{};SV.clr[k]=1}
  C1.addRub(tot);
}

// ================= ЛУТ: меньше на полу, патроны под выбранное оружие, дроп с сильных =================
const AMQ={ammo:1,shells:.5,r762:1.6,r556:1.6,p50:.45,awp:.3,cells:.12,fuel:3,nlg:2,flr:.25,bolt:.6,pkm:3,sp6:.8,vog:.3};
function ammoKindFor(slot){const w=slot==='t'?(PS.lo&&PS.lo.t):(PS.lo&&PS.lo.p);return w&&WD[w]&&WD[w].am}
function pickAmmoKind(){const r=Math.random(),t=ammoKindFor('t'),p=ammoKindFor('p')||'ammo';
  if(t&&r<.55)return t;if(r<.85)return p;const own=Object.keys(PS.own||{}).map(k=>WD[k]&&WD[k].am).filter(Boolean);return own.length?own[(Math.random()*own.length)|0]:p}
const AMMO_DIV=2.6; // 02.11: дефицит патронов (было 1,5)
function qtyFor(kind,base){return Math.max(kind==='cells'?1:2,Math.round(base*(AMQ[kind]||1)/AMMO_DIV))}
UP.pickAmmo=pickAmmoKind;UP.qtyFor=qtyFor;UP.persist=persist;UP.SV=()=>SV;UP.ammoKindFor=ammoKindFor;
const FIXK=['ammo','shells','syr','cells','fuel','nails','ext','pot','rub','part','p50','r762','r556','awp','nlg','flr','bolt','pkm','sp6','vog'];
function processLoot(L){
  if(L._upLoot)return;L._upLoot=1;
  const up=UP.upg(),keep=[];
  // 02.11: лут на участке фиксированный — после смерти и при повторном заходе взятое не появляется, новое не добавляется
  const lid=L.id,known=lid&&SV.lootL&&SV.lootL[lid],tk=(SV.lootT=SV.lootT||{});
  for(const it of L.items){
    const fx=FIXK.includes(it.kind);if(fx){it._lk=lid+'|'+it.kind+'@'+Math.round(it.x/6)+','+Math.round(it.y/6);
      if(known&&(!known.includes(it._lk)||tk[it._lk]))continue}
    const cut=['ammo','shells','syr','moon','cells','fuel','nails','ext'].includes(it.kind);
    if(cut&&!known&&!L.noCut&&!(it.kind==='moon'&&L.id==='off1')&&Math.random()<(it.kind==='syr'?.86:['ammo','shells','cells','fuel','nails','ext'].includes(it.kind)?.7:.45))continue; // самогон Аниса в офисе 1 — задание, не трогаем // лута на полу меньше
    if(up&&(it.kind==='ammo'||it.kind==='shells'||it.kind==='nails'||it.kind==='ext')){const base=it.kind==='shells'?it.n*2:(it.n||8);const k=pickAmmoKind();it.kind=k;it.n=qtyFor(k,base)}
    if(up&&it.kind==='syr'&&Math.random()<.14&&!known){it.kind='pot';it.n=1}
    keep.push(it)}
  L.items.length=0;L.items.push(...keep);
  if(lid&&!known){SV.lootL=SV.lootL||{};SV.lootL[lid]=keep.filter(i=>i._lk).map(i=>i._lk);persist()}
}
// Д6: вооружённые враги роняют патроны
C1.armedDrop=function(z){const L=E.L;if(!L||!L.armed)return;const k=pickAmmoKind();const a=Math.random()*TAU;
  if(Math.random()<.35)L.items.push({kind:k,x:z.x+Math.cos(a)*4,y:z.y+Math.sin(a)*4,n:qtyFor(k,z.type==='raider'?8:5),taken:false});
  if(z.type==='raider'&&Math.random()<.5)L.items.push({kind:'rub',x:z.x-3,y:z.y+3,n:40+((Math.random()*60)|0),taken:false})};
function drops(z){
  const L=E.L;if(!L||!L.armed)return;
  const strong=z.type==='brute'||z.type==='boss'||z.type==='shield'||(z.max||0)>=150;
  const dropAt=(k,n)=>{const a=Math.random()*TAU;X.floatT&&0;L.items.push({kind:k,x:z.x+Math.cos(a)*4,y:z.y+Math.sin(a)*4,n,taken:false})};
  if(!UP.upg()){if(strong&&Math.random()<.5)dropAt('rub',60+((Math.random()*90)|0));return}
  if(strong){const r=Math.random();
    if(r<.25){const k=pickAmmoKind();dropAt(k,qtyFor(k,8))}else if(r<.33)dropAt('syr',1);else if(r<.52)dropAt('pot',1);else if(r<.62)dropAt('moon',1);
    if(Math.random()<.4)dropAt('rub',80+((Math.random()*120)|0))}
  else if(Math.random()<.02){const k=pickAmmoKind();dropAt(k,qtyFor(k,4))}
}

// ================= ЛАВКА МИХАЛЫЧА =================
// st — с какой главы появляется (баланс: самое дорогое открывается позже)
const SHOP=[
  {id:'ammo',n:'Патроны 9 мм ×24',am:'ammo',q:24,p:120,d:'Для пистолета и Глока.'},
  {id:'shells',n:'Патроны 12 кал. ×12',am:'shells',q:12,p:200,need:'shotgun',d:'Для дробовика Аниса.'},
  {id:'r762',n:'Патроны 7,62 ×60',am:'r762',q:60,p:300,need:['ak','rpk'],d:'Для калаша и РПК.'},
  {id:'r556',n:'Патроны 5,56 ×60',am:'r556',q:60,p:330,need:'m4',d:'Для M4A1.'},
  {id:'p50',n:'Патроны .50 AE ×16',am:'p50',q:16,p:320,need:'deagle',d:'Для золотого Desert Eagle.'},
  {id:'awp',n:'Патроны .338 ×10',am:'awp',q:10,p:360,need:'awp',d:'Для снайперки AWP.'},
  {id:'cells',n:'Батареи рельсотрона ×3',am:'cells',q:3,p:420,need:'rail',d:'Один заряд — одна сквозная линия.'},
  {id:'fuel',n:'Топливо для огнемёта ×100',am:'fuel',q:100,p:320,need:'flamer',d:'Самогон Михалыча. Пить нельзя.'},
  {id:'nlg',n:'Гвозди ×40',am:'nlg',q:40,p:160,need:'nailgun',d:'Для гвоздомёта.'},
  {id:'flr',n:'Сигнальные ракеты ×4',am:'flr',q:4,p:300,need:'flare',d:'Для ракетницы: поджигают и светят.'},
  {id:'bolt',n:'Болты ×10',am:'bolt',q:10,p:260,need:'xbow',d:'Для арбалета.'},
  {id:'syr',n:'Шприц',p:300,d:'Быстро затягивает раны (+60 HP за пару секунд).'},
  {id:'pot',n:'Зелье регенерации',p:420,d:'Минуту лечит понемногу, можно не прятаться.'},
  {id:'moon',n:'Самогон (молотов)',p:180,d:'Кинуть в толпу — горит.'},
  {id:'rep',n:'Ремонт надетой брони',p:0,d:'Михалыч латает пластины. Цена зависит от износа.'},
  {id:'kukri',n:'Золотой кукри',p:1800,st:2,wpn:1,d:'Режет лучше биты и топора, раны кровоточат. Одноручное.'},
  {id:'usp',n:'USP «Протокол»',p:3200,st:2,wpn:1,d:'Чёрный с синим неоном, глушитель: 12 патронов 9 мм, почти бесшумный.'},
  {id:'beretta',n:'Беретты «Кровь» ×2',p:5200,st:4,wpn:1,d:'Две бордовые беретты с двух рук: 30 патронов 9 мм, быстрая стрельба.'},
  {id:'m4',n:'M4A1 с обвесом',p:4500,st:3,wpn:1,d:'Штурмовая винтовка: 30 патронов, точная и скорострельная.'},
  {id:'arm_h',arm:'h',n:'Спецброня Ханжи',p:6000,st:3,d:'Лёгкая армейская: треть урона, бегаешь быстрее.'},
  {id:'arm_k',arm:'k',n:'Косуха «Ночной волк»',p:1600,st:1,d:'Лёгкая кожанка: 18% урона, бегаешь чуть быстрее.'},
  {id:'arm_hk',arm:'hk',n:'Хоккейная форма «СКА»',p:3800,st:3,tr:2,d:'30% урона, укусы и удары держит ещё лучше.'},
  {id:'arm_f',arm:'f',n:'Пожарная боевка',p:4200,st:4,tr:2,d:'28% урона, огонь и кислота почти не жгут.'},
  {id:'kev',n:'Кевлар ×2',p:520,tr:2,d:'Запчасть для прокачки брони на верстаке.'},
  {id:'cer',n:'Керамическая вставка',p:900,tr:3,d:'Запчасть для прокачки брони на верстаке (2-й и 3-й уровень).'},
  {id:'rpk',n:'Пулемёт РПК',p:7000,st:5,wpn:1,d:'80 патронов в коробе, очень больно бьёт. Медленнее бегаешь.'},
  {id:'deagle',n:'Золотой Desert Eagle',p:8500,st:5,wpn:1,d:'8 патронов, огромный урон, прошивает насквозь.'},
  {id:'anti',n:'Антидот',p:260,tr:2,d:'Снимает заражение и даёт минуту иммунитета. Колется сам, когда заражение подходит к краю.'},
  {id:'parts',n:'Обычные детали ×3',p:450,tr:2,d:'Обычные материалы для верстака: улучшения стволов и крафт.'},
  {id:'legp',n:'Легендарная деталь',p:2600,tr:4,st:5,d:'Самый редкий материал верстака: нужен для тяжёлых стволов и уникальных рецептов.'},
  {id:'card',n:'Ключ-карта',p:1500,tr:4,d:'Открывает служебную дверь с жёлтой полосой. Одна дверь — одна карта.'},
];
// ---- Л1 доверие Михалыча, Л4 сделка дня, Л4б лимит патронов, Л5 трофеи ----
const TRUST=[0,4000,12000,30000,60000],TDISC=[0,.05,.1,.15,.2];
function trustLv(){const sp=SV.spent|0;let l=1;for(let i=0;i<TRUST.length;i++)if(sp>=TRUST[i])l=i+1;return l}
UP.trustLv=trustLv;
const TROPH={tag:{n:'Жетон охраны',p:150},patch:{n:'Нашивка мародёра',p:220},plate:{n:'Бронепластина',p:260},fang:{n:'Клык громилы',p:400},gland:{n:'Кислотная железа',p:180},boss:{n:'Трофей босса',p:0}};
UP.TROPH=TROPH;
function trophSum(){let s=0;for(const k in (SV.troph||{}))if(TROPH[k]&&k!=='boss')s+=TROPH[k].p*(SV.troph[k]|0);return Math.round(s*(1+.05*(trustLv()-1)))}
function dayHash(){const d=new Date().toDateString()+'|'+SV.maxCh;let h=7;for(const c of d)h=(h*31+c.charCodeAt(0))>>>0;return h}
let _dealC=null,_dealT=0;
function dealId(){const now=Date.now();if(_dealC&&now-_dealT<1500)return _dealC;_dealT=now;
  const c=baseShop().filter(it=>!it.wpn&&it.id!=='rep'&&it.id!=='card'||it.wpn&&!itemOwned(it));_dealC=c.length?c[dayHash()%c.length].id:'-';return _dealC}
UP.dealId=dealId;
function shopList(){const L=baseShop(),x=[];
  if(trophSum()>0)x.push({id:'sell',sell:1,n:'Продать все трофеи',d:'Михалыч скупает жетоны, нашивки, пластины, клыки и железы. Чем выше доверие — тем щедрее.'});
  if((SV.troph&&SV.troph.boss|0)>0){x.push({id:'bx1',bx:1,n:'Трофей босса → именной обвес',d:'Михалыч отдаёт свой обвес: одно бесплатное улучшение любого ствола на верстаке.'});
    x.push({id:'bx2',bx:1,n:'Трофей босса → аптечка МЧС',d:'Три шприца, два антидота и зелье регенерации.'})}
  return x.concat(L)}
function baseShop(){const st=Math.max(SV.maxCh,chNow());return SHOP.filter(it=>{
  if(it.st&&st<it.st)return false;if(it.tr&&trustLv()<it.tr)return false;
  if(it.need){const n=[].concat(it.need);if(!n.some(k=>SV.own[k]||(PS.own&&PS.own[k])))return false}
  if(it.id==='rep')return !!SV.eq;
  return true})}
function repCost(){if(!SV.eq)return 0;const a=ARM[SV.eq],dur=(PS.arm&&PS.arm.id===SV.eq)?PS.arm.dur:SV.arms[SV.eq].dur;return Math.ceil((a.max-dur)*a.rp)}
function itemOwned(it){if(it.wpn)return !!SV.own[it.id];if(it.arm)return !!SV.arms[it.arm];return false}
const PRICE_MUL=3.9; // 01.11: цены в лавке ×3; 02.11: ещё +30%
function itemPrice(it){if(it.sell||it.bx)return 0;return Math.round((it.id==='rep'?repCost():it.p)*PRICE_MUL*(1-TDISC[trustLv()-1])*(it.id===dealId()?.6:1))}
function buy(it){
  if(it.sell){const sum=trophSum();if(sum<=0)return;SV.rub+=sum;SV.earned+=sum;for(const k in SV.troph)if(k!=='boss')SV.troph[k]=0;sfx('coin');sfx('pick');persist();note('Михалыч: «Сувенирчики беру. Держи '+fmt(sum)+' ₽»');return}
  if(it.bx){if(!(SV.troph&&SV.troph.boss>0))return;SV.troph.boss--;if(it.id==='bx1'){SV.freeTier=(SV.freeTier|0)+1;note('Бесплатное улучшение ждёт на верстаке')}else{PS.syr+=3;SV.syr=(SV.syr|0)+3;SV.anti=(SV.anti|0)+2;PS.pot=(PS.pot||0)+1;SV.pot=(SV.pot|0)+1;note('Аптечка МЧС: 3 шприца, 2 антидота, зелье')}sfx('coin');sfx('pick');persist();return}
  if(itemOwned(it)){note('Уже есть');return}
  if(it.id==='syr'&&capFull('PS.syr'))return;if(it.id==='pot'&&capFull('PS.pot'))return;if(it.id==='moon'&&capFull('PS.moon'))return;
  if(it.am){if(UP._shopL!==E.L){UP._shopL=E.L;SV.visA=0;SV.visAm={}}const vk=String(it.am);SV.visAm=SV.visAm||{};if((SV.visAm[vk]|0)>=3){note('Михалыч: «Этих три пачки за раз, не больше. Другим тоже надо»');sfx('thump',1.6);return}}
  if(it.id==='syr'){if(UP._shopS!==E.L){UP._shopS=E.L;SV.visS=0}if((SV.visS|0)>=2){note('Михалыч: «Два шприца за раз, не больше. Лекарства на вес золота»');sfx('thump',1.6);return}}
  const p=itemPrice(it);if(it.id==='rep'&&p<=0){note('Броня целая');return}
  if(SV.rub<p){note('Не хватает рублей: нужно '+fmt(p)+' ₽');sfx('thump',1.6);return}
  const tl0=trustLv();SV.rub-=p;SV.spent=(SV.spent|0)+p;if(it.am){SV.visA=(SV.visA|0)+1;SV.visAm=SV.visAm||{};SV.visAm[String(it.am)]=(SV.visAm[String(it.am)]|0)+1}
  if(trustLv()>tl0)setTimeout(()=>note('Михалыч доверяет больше: уровень '+trustLv()+' из 5, скидка '+Math.round(TDISC[trustLv()-1]*100)+'%'),900);
  if(it.id==='anti'){SV.anti=(SV.anti|0)+1}
  else if(it.id==='parts'){SV.parts=(SV.parts|0)+3}
  else if(it.id==='legp'){SV.leg=(SV.leg|0)+1}
  else if(it.id==='card'){SV.cards=(SV.cards|0)+1}
  else if(it.am){PS[it.am]=(PS[it.am]||0)+it.q;SV.am[it.am]=(SV.am[it.am]||0)+it.q}
  else if(it.id==='syr'){SV.visS=(SV.visS|0)+1;PS.syr++;SV.syr++}
  else if(it.id==='pot'){PS.pot=(PS.pot||0)+1;SV.pot++}
  else if(it.id==='moon'){PS.moon++;SV.moon++}
  else if(it.id==='rep'){const a=ARM[SV.eq];SV.arms[SV.eq].dur=a.max;if(PS.arm)PS.arm.dur=a.max}
  else if(it.wpn){SV.own[it.id]=1;PS.own=PS.own||{};PS.own[it.id]=1;SV.mag[it.id]=0;PS.mag[it.id]=0;
    const am=WD[it.id].am;if(am){const q={r556:60,r762:80,p50:16}[am]||30;SV.am[am]=(SV.am[am]||0)+q;PS[am]=(PS[am]||0)+q}}
  else if(it.arm){SV.arms[it.arm]={dur:ARM[it.arm].max};SV.got['arm'+it.arm]=1}
  else if(it.id==='kev'){SV.kev=(SV.kev|0)+2}
  else if(it.id==='cer'){SV.cer=(SV.cer|0)+1}
  sfx('coin');sfx('pick');persist();
  note(it.id==='rep'?'Михалыч: «Как новенькая!»':'Куплено: '+it.n);
}

// ================= ОКНО: ОРУЖЕЙНАЯ / СБОРЫ / ЛАВКА =================
// mode: 'armory' — в квартире, 'sortie' — перед выходом на миссию, 'shop' — у Михалыча
const TABS={wpn:'ОРУЖИЕ',arm:'БРОНЯ',med:'АПТЕЧКА',bench:'ВЕРСТАК',shop:'ЛАВКА МИХАЛЫЧА',bag:'РЮКЗАК',garage:'ГАРАЖ'};
// ---- Л2 улучшения на верстаке (3 уровня), Л2б особые на 3-м, Л3 крафт из деталей ----
const NOWU={rail:1,flamer:1,rpg:1,saw:1,claws:1};
const WUC=[[900,2,0,0],[2400,4,2,0],[4800,6,3,1]];
function haveC(c){return SV.rub>=(c[0]|0)&&(SV.parts|0)>=(c[1]|0)&&(SV.elec|0)>=(c[2]|0)&&(SV.core|0)>=(c[3]|0)&&(SV.leg|0)>=(c[4]|0)}
function payC(c){SV.rub-=c[0]|0;SV.parts=(SV.parts|0)-(c[1]|0);SV.elec=(SV.elec|0)-(c[2]|0);SV.core=(SV.core|0)-(c[3]|0);SV.leg=(SV.leg|0)-(c[4]|0)}
function txtC(c){const a=[];if(c[0])a.push(fmt(c[0])+' ₽');if(c[1])a.push(c[1]+' обыч.');if(c[2])a.push(c[2]+' сред.');if(c[3])a.push(c[3]+' редк.');if(c[4])a.push(c[4]+' легенд.');return a.join(' + ')||'бесплатно'}
UP.haveC=haveC;UP.payC=payC;UP.txtC=txtC;
const RAR=['обычное','редкое','легендарное'],RARC=['#c8c8d0','#6ab8ff','#ffd23a'];
const PERK={pistol:'Глушитель: выстрелы почти не слышно',glock:'Глушитель: выстрелы почти не слышно',deagle:'Глушитель: выстрелы почти не слышно',uzi:'Глушитель: очереди почти не слышно',
  shotgun:'Зажигательная дробь: поджигает',ak:'Подствольник: ПКМ / F — граната раз в 8 с',m4:'Подствольник: ПКМ / F — граната раз в 8 с',rpk:'Подствольник: ПКМ / F — граната раз в 8 с',awp:'Глушитель и пуля прошивает ещё двоих'};
// 04.11: перки — на каждом уровне выбор одного из двух (A/B); старые сохранения = A
function wuCh(k,i){return (SV.wuc&&SV.wuc[k]&&SV.wuc[k][i-1])||'A'}
const OPT={g:{1:['+20% урона','Тихий ствол: шум −50%'],2:['Магазин +30%','Перезарядка −35%'],3:[null,'Именной: +15% урона, стреляет чаще, ×2 ₽ в комбо']},
  m:{1:['+20% урона','Замах длиннее и шире'],2:['Бьёт на четверть быстрее','Отбрасывает в полтора раза сильнее'],3:['Гвозди и заточка: раны кровоточат','Именной: +15% урона, ×2 ₽ в комбо']}};
function wuText(k,t,o){const d=WD[k];o=o||wuCh(k,t);const O=OPT[d&&d.ml?'m':'g'][t];if(!O)return '';const v=O[o==='B'?1:0];return v||(PERK[k]||'+20% урона')}
function applyWU(){const U=SV.uq||{};for(const k in WD){const d=WD[k];if(!d||NOWU[k])continue;if(!d._b)d._b={dmg:d.dmg,mag:d.mag,rt:d.rt,cd:d.cd,noise:d.noise,pierce:d.pierce,fire:d.fire,gl:d.gl,ml:d.ml?Object.assign({},d.ml):null};
  const b=d._b,t=(SV.wu&&SV.wu[k])|0,nl=!!SV.nails,ch=!!SV.chain,sw=!!SV.sawM,c1=wuCh(k,1),c2=wuCh(k,2),c3=wuCh(k,3);d.named=t>=3&&c3==='B'?1:0;
  if(b.ml){let dm=b.ml.dmg*(t>=1&&c1==='A'?1.2:1)*(t>=3&&c3==='B'?1.15:1)*(U.u3?1.25:1);d.ml.dmg=Math.round((dm+(nl?8:0))*(sw?1.5:1));d.ml.cd=b.ml.cd*(t>=2&&c2==='A'?.75:1);
    d.ml.reach=b.ml.reach+(ch?8:0)+(t>=1&&c1==='B'?5:0);d.ml.arc=b.ml.arc+(ch?.15:0)+(t>=1&&c1==='B'?.2:0);d.ml.kb=(b.ml.kb||0)*(t>=2&&c2==='B'?1.5:1);d.ml.bleed=b.ml.bleed||(t>=3&&c3==='A')||nl||sw?1:0;continue}
  if(b.dmg!=null)d.dmg=b.dmg*(t>=1&&c1==='A'?1.2:1)*(t>=3&&c3==='B'?1.15:1)*(U.u8?1.1:1);
  if(b.mag!=null)d.mag=Math.round(b.mag*(t>=2&&c2==='A'?1.3:1)*(U.u6?1.15:1));if(b.rt!=null)d.rt=b.rt*(t>=2&&c2==='B'?.65:1)*(U.u7?.85:1);
  if(b.cd!=null&&!d.spin)d.cd=b.cd*(t>=3&&c3==='B'?.87:1);
  d.noise=b.noise!=null&&t>=1&&c1==='B'?b.noise*.5:b.noise;d.fire=b.fire;d.gl=b.gl;d.pierce=b.pierce;
  if(t>=3&&c3==='A'){if(/pistol|glock|deagle|uzi/.test(k)&&b.noise)d.noise=b.noise*.25;else if(k==='shotgun')d.fire=1;else if(k==='ak'||k==='m4'||k==='rpk')d.gl=1;else if(k==='awp'){d.noise=(b.noise||200)*.4;d.pierce=(b.pierce||0)+2}else if(!PERK[k]&&b.dmg!=null)d.dmg*=1.2}}}
UP.applyWU=applyWU;
const RECIPES=[
  {cat:'МЕДИЦИНА',id:'band',r:0,n:'Бинт (+1 шприц)',c:[0,1],d:'Бинт и обезбол. Работает как шприц: H.',f:()=>{PS.syr=(PS.syr|0)+1;SV.syr=(SV.syr|0)+1},has:()=>PS.syr|0},
  {cat:'МЕДИЦИНА',id:'kit',r:1,n:'Аптечка',c:[0,2,1],d:'Срабатывает сама, когда здоровья меньше четверти: +80 HP и снимает заражение.',f:()=>{SV.kit=(SV.kit|0)+1},has:()=>SV.kit|0},
  {cat:'МЕДИЦИНА',id:'stim',r:2,n:'Боевой стимулятор',c:[0,1,1,1],d:'X / кнопка СТИМ: 10 секунд заражение не растёт, бегаешь на 30% быстрее.',f:()=>{SV.stim=(SV.stim|0)+1},has:()=>SV.stim|0},
  {cat:'МЕТАТЕЛЬНОЕ',id:'mol',r:0,n:'Молотов',c:[0,2],d:'Бутылка самогона с тряпкой. F / ПКМ — бросить.',f:()=>{PS.moon=(PS.moon|0)+1;SV.moon=(SV.moon|0)+1},has:()=>PS.moon|0},
  {cat:'МЕТАТЕЛЬНОЕ',id:'nade',r:1,n:'Гвоздевая граната',c:[0,2,1],d:'G / кнопка ГРАНАТА: взрыв и шрапнель, сбивает с ног.',f:()=>{SV.nade=(SV.nade|0)+1},has:()=>SV.nade|0},
  {cat:'МЕТАТЕЛЬНОЕ',id:'term',r:2,n:'Термитная граната',c:[0,2,1,1],d:'G (когда гвоздевые кончились): прожигает бронированных и щиты, всё вокруг горит.',f:()=>{SV.term=(SV.term|0)+1},has:()=>SV.term|0},
  {cat:'ЛОВУШКИ',id:'trip',r:0,n:'Растяжка',c:[0,2],d:'T (или кнопка РАСТЯЖ.) — поставить под ноги. Рвёт всех, кто заденет.',f:()=>{SV.trip=(SV.trip|0)+1},has:()=>SV.trip|0},
  {cat:'ЛОВУШКИ',id:'etrap',r:1,n:'Электрокапкан',c:[0,2,1],d:'Z / кнопка ЛОВУШКА: держит всех вокруг 4 секунды, добивай.',f:()=>{SV.etrap=(SV.etrap|0)+1},has:()=>SV.etrap|0},
  {cat:'ЛОВУШКИ',id:'clay',r:2,n:'Клеймор',c:[0,2,1,1],d:'Z (когда капканы кончились): мина направленного действия, взрыв конусом вперёд.',f:()=>{SV.clay=(SV.clay|0)+1},has:()=>SV.clay|0},
  {cat:'ПАТРОНЫ',id:'am',r:0,n:'Самокрутные патроны',c:[0,2],d:'Пачка патронов под твой пистолет.',f:()=>{const k=ammoKindFor('p')||'ammo',q=qtyFor(k,18);PS[k]=(PS[k]||0)+q;SV.am[k]=(SV.am[k]||0)+q;note('+'+q+' '+(AMN[k]||'патр.'))},has:()=>PS[ammoKindFor('p')||'ammo']|0},
  {cat:'ПАТРОНЫ',id:'exp',r:1,n:'Экспансивные ×30',c:[0,2,1],d:'Следующие 30 выстрелов любого ствола: +40% урона.',f:()=>{SV.expA=(SV.expA|0)+30},has:()=>SV.expA|0},
  {cat:'ПАТРОНЫ',id:'ap',r:2,n:'Бронебойные ×30',c:[0,2,1,1],d:'Следующие 30 выстрелов прошивают броне-зомби, щиты и ещё одного за ними.',f:()=>{SV.apA=(SV.apA|0)+30},has:()=>SV.apA|0},
  {cat:'ХОЛОДНОЕ (навсегда)',id:'nails',r:0,n:'Гвозди на биту',c:[0,3],once:1,d:'Всё холодное: +8 урона, раны кровоточат.',f:()=>{SV.nails=1;applyWU()}},
  {cat:'ХОЛОДНОЕ (навсегда)',id:'chain',r:1,n:'Цепь',c:[0,3,2],once:1,d:'Всё холодное достаёт дальше и шире.',f:()=>{SV.chain=1;applyWU()}},
  {cat:'ХОЛОДНОЕ (навсегда)',id:'sawM',r:2,n:'Заточка-пила',c:[0,3,2,1],once:1,d:'Всё холодное: +50% урона и кровотечение.',f:()=>{SV.sawM=1;applyWU()}},
];
// 04.11: расходники по качеству (обычное / редкое / легендарное), лимит с собой
const QP=[[150,2,0,0,0],[400,2,1,0,0],[900,2,1,1,0]];
for(const c of RECIPES)if(!c.once)c.c=QP[c.r].slice();
{const b=RECIPES.find(c=>c.id==='band');if(b)b.c=[450,3,1,0,0]} // 04.11: шприцов было слишком много
const CAP={band:4,kit:2,stim:1,mol:3,nade:3,term:1,trip:3,etrap:3,clay:1};
UP.CAP=CAP;
function bossDone(n){return (SV.maxCh|0)>n||!!(window['C'+n]&&window['C'+n].done)}
function uq(id){SV.uq=SV.uq||{};SV.uq[id]=1;SV[id]=1;applyWU();applyAU()}
const UCAT='УНИКАЛЬНОЕ: ТРОФЕИ БОССОВ';
RECIPES.push(
  {cat:UCAT,id:'u3',r:2,once:1,boss:3,n:'Коготь крысиного короля',c:[1500,4,2,1,0],d:'Трофей главы 3. Всё холодное: +25% урона навсегда.',f:()=>uq('u3')},
  {cat:UCAT,id:'u4',r:2,once:1,boss:4,n:'Блёстки Анжелы',c:[2000,5,2,1,0],d:'Трофей главы 4. Вся броня: +5% защиты навсегда.',f:()=>uq('u4')},
  {cat:UCAT,id:'u5',r:2,once:1,boss:5,n:'Щит центуриона',c:[2400,5,3,1,0],d:'Трофей главы 5 из Колизея. Вся броня: прочность +25% навсегда.',f:()=>uq('u5')},
  {cat:UCAT,id:'u6',r:2,once:1,boss:6,n:'Смола лешего',c:[2800,6,3,1,0],d:'Трофей главы 6. Магазины всех стволов +15% навсегда.',f:()=>uq('u6')},
  {cat:UCAT,id:'u7',r:2,once:1,boss:7,n:'Нить Паутины',c:[3200,6,3,2,0],d:'Трофей главы 7. Перезарядка всех стволов на 15% быстрее навсегда.',f:()=>uq('u7')},
  {cat:UCAT,id:'u8',r:2,once:1,boss:8,n:'Песок Барханыча',c:[4000,8,4,2,1],d:'Трофей главы 8. Урон всех стволов +10% навсегда.',f:()=>uq('u8')},
  {cat:'РЕМОНТ',id:'railFix',r:2,once:1,n:'Починить рельсотрон',c:[1800,3,3,1,0],vis:()=>!!(SV.own.rail||(PS.own&&PS.own.rail)),
    lock:()=>!(SV.so&&SV.so.done&&SV.so.done.dns),lockT:'Нужна электроника из ДНС: сначала зачисти вылазку в ДНС.',
    d:'Катушка выгорела ещё в офисе. С деталями из ДНС рельсотрон снова прошивает всё на линии.',f:()=>{SV.railFix=1;note('Рельсотрон починен! Возьми его в слот в оружейной')}});
for(const c of RECIPES)if(c.boss&&!c.lock){const n=c.boss;c.lock=()=>!bossDone(n);c.lockT='Откроется после босса главы '+n+'.'}
C1.railBroken=()=>!!(UP.upg&&UP.upg())&&!SV.railFix&&!(window.MIS&&MIS.on);
// модули брони: 2 слота на надетой броне, собираются из кевлара и керамики
const MODS=[
  {id:'plates',n:'Бронепластины',c:[900,0,2],d:'+15% защиты, но бегаешь на 5% медленнее.'},
  {id:'pouch',n:'Подсумок',c:[600,1,0],d:'На каждый выход: +1 шприц и +1 гвоздевая граната (в пределах лимита).'},
  {id:'kevl',n:'Кевларовая подкладка',c:[700,2,0],d:'От укусов и ударов: ещё +15% защиты.'},
  {id:'antip',n:'Антидотный карман',c:[900,1,1],d:'Заражение растёт на 25% медленнее.'}];
UP.MODS=MODS;
function slotsOf(id){SV.aslot=SV.aslot||{};return SV.aslot[id]=SV.aslot[id]||[]}
function hasMod(m){return !!(PS.arm&&PS.arm.dur>0&&slotsOf(PS.arm.id).includes(m))}
UP.hasMod=hasMod;
function doMod(id){const M=MODS.find(m=>m.id===id);SV.amod=SV.amod||{};
  if(!SV.amod[id]){if(!haveA(M.c)){note('Нужно: '+txtA(M.c));sfx('thump',1.6);return}SV.rub-=M.c[0];SV.kev-=M.c[1];SV.cer-=M.c[2];SV.amod[id]=1;sfx('pick');note('Собран модуль: '+M.n)}
  else if(!SV.eq){note('Сначала надень броню');return}
  else{const sl=slotsOf(SV.eq),i=sl.indexOf(id);if(i>=0){sl.splice(i,1);note(M.n+': снят')}else{for(const k in SV.aslot){const j=SV.aslot[k].indexOf(id);if(j>=0)SV.aslot[k].splice(j,1)}if(sl.length>=2){note('В броне только 2 слота — сначала сними модуль');sfx('thump',1.6);return}sl.push(id);note(M.n+' → '+ARM[SV.eq].n)}sfx('reload')}
  applyAU();persist()}
addEventListener('load',()=>{const f=C1.infect;if(f&&!f._am){C1.infect=k=>f(k*(hasMod('antip')?.75:1));C1.infect._am=1}});
const GAR=[
  {id:'tank',n:'Бак (дальность)',max:3,c:[[1200,3,0,0],[3000,5,2,0],[6000,8,4,1]],d:'Чем больше бак, тем дальше можно уехать на вылазку: табачка — 1, Лента и ДНС — 2, бункер — 3.'},
  {id:'eng',n:'Мотор',max:2,c:[[2500,4,1,0],[5000,6,3,0]],d:'Машина быстрее на 12% за уровень. Для бункера нужен 2-й.'},
  {id:'tire',n:'Шины и подвеска',max:2,c:[[1800,3,0,0],[4000,5,3,0]],d:'Меньше урона от зомби и завалов (−20% за уровень). Для ДНС и бункера нужен 2-й.'},
  {id:'arm',n:'Бронелисты на машину',max:2,c:[[1500,3],[3500,6]],d:'Машина получает на треть меньше урона за уровень. Работает во всех поездках.'},
  {id:'bump',n:'Таранный бампер',max:1,c:[[2000,4]],d:'Сбитые зомби не цепляются, машина меньше страдает от тарана.'},
  {id:'nitro',n:'Нитро',max:1,c:[[3000,5]],d:'Shift / кнопка НИТРО — рывок вперёд в поездках на машине.'},
];
UP.GAR=GAR;UP.rowsOf=ui=>rowsOf(ui);
function benchRowsOld(){const r=[];let cat=null;for(const c of RECIPES){if(c.vis&&!c.vis())continue;if(c.cat!==cat){cat=c.cat;r.push({h:cat})}r.push({c})}
  r.push({h:'ОБВЕСЫ НА СТВОЛЫ'});for(const sl of ['p','t','m'])for(const k of allw(sl))if(!NOWU[k]&&(SV.own[k]||(PS.own&&PS.own[k])))r.push({k,wu:1});
  const ar=Object.keys(ARM).filter(id=>SV.arms[id]);if(ar.length){r.push({h:'БРОНЯ: КЕВЛАР И КЕРАМИКА'});for(const id of ar)r.push({id,au:1});r.push({h:'МОДУЛИ БРОНИ (2 СЛОТА НА НАДЕТОЙ)'});for(const m of MODS)r.push({am:m.id})}return r}
function garRows(){return GAR.map(g=>({g}))}
// 04.11: цена по классу ствола; чем мощнее, тем больше видов материалов (обычные / средние / редкие / легендарные)
const WCL={light:[[540,2,0,0,0],[1440,4,1,0,0],[2900,6,2,0,0]],mid:[[900,3,0,0,0],[2400,5,2,0,0],[4800,8,3,1,0]],heavy:[[1350,5,1,0,0],[3600,9,3,1,0],[7200,14,4,2,1]]};
const HEAVY={awp:1,rpk:1,minigun:1,gatl:1,shtuc:1,vint:1,pech:1,ags:1,deagle:1,saiga:1};
function wClass(k){const d=WD[k];if(!d)return 'mid';if(HEAVY[k])return 'heavy';if(d.ml||d.slot==='p'||k==='uzi'||k==='nailgun')return 'light';return 'mid'}
const WCLN={light:'лёгкий класс',mid:'средний класс',heavy:'тяжёлый класс'};
function wuCost(t,k){const c=(WCL[wClass(k)]||WUC)[t];if(!c)return null;const m=UP.ui&&UP.ui.mode==='smith'?.8:1;return [Math.round(c[0]*m),c[1],c[2],c[3],c[4]]}
function doWU(k,o){SV.wu=SV.wu||{};const t=SV.wu[k]|0;if(t>=3){note('Максимум');return}o=o==='B'?'B':'A';
  if((SV.freeTier|0)>0){SV.freeTier--;}else{const c=wuCost(t,k);if(!haveC(c)){note('Нужно: '+txtC(c));sfx('thump',1.6);return}payC(c)}
  SV.wuc=SV.wuc||{};(SV.wuc[k]=SV.wuc[k]||[])[t]=o;
  SV.wu[k]=t+1;applyWU();sfx('reload');sfx('pick');persist();note(WD[k].n+': уровень '+(t+1)+' — '+wuText(k,t+1,o))}
// перекинуть последний выбор — только у Михалыча, 30% цены уровня в рублях
function rerollCost(k){const t=(SV.wu&&SV.wu[k])|0;if(!t)return 0;const c=(WCL[wClass(k)]||WUC)[t-1];return Math.round(c[0]*.3)}
function doReroll(k){const t=(SV.wu&&SV.wu[k])|0;if(!t){note('Сначала улучши ствол');return}const p=rerollCost(k);if(SV.rub<p){note('Нужно '+fmt(p)+' ₽');sfx('thump',1.6);return}
  SV.rub-=p;SV.wuc=SV.wuc||{};const a=(SV.wuc[k]=SV.wuc[k]||[]);a[t-1]=wuCh(k,t)==='A'?'B':'A';applyWU();persist();sfx('reload');note('Михалыч переделал: '+wuText(k,t))}
function capFull(src){const C=C1.CAPS||{syr:10,moon:10,pot:5},N={syr:'Шприцов',moon:'Самогона',pot:'Зелий'};for(const k in C)if(new RegExp('PS\\.'+k+'\\b').test(src)&&(PS[k]|0)>=C[k]){note(N[k]+' уже '+C[k]+' — больше не унести');sfx('thump',1.6);return true}return false}
function doCraft(c){if(c.once&&SV[c.id]){note('Уже сделано');return}if(capFull(String(c.f||'')))return;if(c.lock&&c.lock()){note(c.lockT||'Пока закрыто');sfx('thump',1.6);return}
  if(CAP[c.id]!=null&&c.has&&c.has()>=CAP[c.id]){note('Лимит с собой: '+CAP[c.id]+' шт.');sfx('thump',1.6);return}if(!haveC(c.c)){note('Не хватает: нужно '+txtC(c.c));sfx('thump',1.6);return}payC(c.c);c.f();SV.crU=SV.crU||{};if(SV.crU[c.id]==null)SV.crU[c.id]=missN();sfx('pick');persist();if(c.id!=='am')note('Собрано: '+c.n)}
function doGar(g){SV.car=SV.car||{};const t=SV.car[g.id]|0;if(t>=g.max){note('Максимум');return}const c=g.c[t];if(!haveC(c)){note('Нужно: '+txtC(c));sfx('thump',1.6);return}
  payC(c);SV.car[g.id]=t+1;sfx('reload');persist();note(g.n+': готово')}
function stars(n,m){return m===5?'ур. '+n+' из 5':(n>=m?'МАКС':'ур. '+n+'/'+m)}
UP.open=function(tab,mode){
  const tabs=mode==='mirror'?['sm','ss']:mode==='shop'?['shop']:mode==='inv'?['bag']:mode==='smith'?['bench']:mode==='garage'?['garage']:['wpn','arm','med','bench'].concat(SV.shop?['shop']:[]);
  UP.ui={mode:mode||'armory',tabs,tab:tabs.includes(tab)?tab:tabs[0],sel:0,scroll:0,t:0};C1.mdown=false;C1.fire=null;sfx('click');
  if(mode!=='sortie')store();
};
function close(){
  const ui=UP.ui;if(!ui)return;UP.ui=null;sfx('click');
  if(ui.mode==='mirror'){persist();note('Шмотки сохранены');}else if(ui.mode==='sortie')applySortie();else{SV.lo=Object.assign({},PS.lo);store()}
  C1.mdown=false;
}
function applySortie(){
  SV.lo=Object.assign({},PS.lo);PS.found=[];
  for(const k of [PS.lo.p,PS.lo.t]){if(!k||!WD[k]||!WD[k].am)continue;const d=WD[k],n=Math.min(d.mag-(PS.mag[k]||0),PS[d.am]||0);PS.mag[k]=(PS.mag[k]||0)+n;PS[d.am]-=n}
  PS.wpn=PS.lo.t&&(PS.mag[PS.lo.t]>0)?PS.lo.t:(PS.lo.p||PS.lo.m||'bat');
  if(SV.beerBox)PS.beer=Math.max(PS.beer||0,2);
  PS.arm=SV.eq?mkArm(SV.eq):null;
  if(chNow()===6){PS.lo={m:null,p:null,t:null}} // в главе 6 сумки уедут в чужом пикапе
  if(hasMod('pouch')){PS.syr=(PS.syr|0)+1;SV.nade=Math.min(CAP.nade,(SV.nade|0)+1)}
  store();note('Собрались! Пистолет, двуручное и холодное — с собой');
}
// 04.11: гл.6 — мужик на пикапе вернул сумки посреди главы
UP.giveBack=function(){PS.lo=Object.assign({},SV.lo);
  for(const k of [PS.lo.p,PS.lo.t]){if(!k||!WD[k]||!WD[k].am)continue;const d=WD[k],n=Math.min(d.mag-(PS.mag[k]||0),PS[d.am]||0);PS.mag[k]=(PS.mag[k]||0)+n;PS[d.am]-=n}
  PS.wpn=PS.lo.t&&(PS.mag[PS.lo.t]>0)?PS.lo.t:(PS.lo.p||PS.lo.m||'bat')};
// строки вкладки оружия
const SLOTN={p:'ОДНОРУЧНОЕ ДАЛЬНЕЕ',t:'ДВУРУЧНОЕ ДАЛЬНЕЕ',m:'ХОЛОДНОЕ'};
const ALLW={p:['pistol','usp','glock','beretta','deagle','flare'],t:['shotgun','sawn','saiga','ak','m4','mp5','rpk','awp','xbow','nailgun','rail','flamer','rpg','uzi','pech','vint','ags','minigun','gatl','shtuc'],m:['bat','kukri','shovel','machete','axe2','sledge','katana']};
function allw(sl){return ALLW[sl].filter(k=>WD[k])}
function wpnRows(){const r=[];for(const sl of ['p','t','m']){r.push({h:SLOTN[sl]});for(const k of allw(sl))r.push({k,own:!!(SV.own[k]||(PS.own&&PS.own[k])),sl})}return r}
function armRows(){return Object.keys(ARM).filter(id=>SV.arms[id]).map(id=>({id}))}
function rowsOf(ui){if(ui.tab==='bench')return benchRows();if(ui.tab==='garage')return garRows();if(ui.tab==='wpn')return wpnRows();if(ui.tab==='arm')return armRows();if(ui.tab==='shop')return shopList();return []}
function selectable(ui,r){return (ui.tab==='wpn'||ui.tab==='bench')?!r.h:true}
function moveSel(ui,d){const rows=rowsOf(ui);if(!rows.length)return;let i=ui.sel;for(let n=0;n<rows.length;n++){i=(i+d+rows.length)%rows.length;if(selectable(ui,rows[i]))break}ui.sel=i;sfx('click')}
function actSel(ui,opt){const rows=rowsOf(ui),r=rows[ui.sel];if(!r)return;
  if(ui.tab==='wpn'){if(r.h||!r.own){if(!r.own)note('Ещё не найдено');return}if(r.k==='rail'&&C1.railBroken&&C1.railBroken()&&PS.lo[r.sl]!=='rail'){note('Рельсотрон сломан — почини на верстаке (нужна электроника из ДНС)');sfx('thump',1.6);return}PS.lo[r.sl]=PS.lo[r.sl]===r.k&&r.sl!=='m'?null:r.k;if(r.sl==='m'&&!PS.lo.m)PS.lo.m='bat';sfx('pick');SV.lo=Object.assign({},PS.lo);persist();return}
  if(ui.tab==='arm'){SV.eq=SV.eq===r.id?null:r.id;if(PS.arm&&SV.arms[PS.arm.id])SV.arms[PS.arm.id].dur=PS.arm.dur;PS.arm=SV.eq?mkArm(SV.eq):null;sfx('pick');persist();return}
  if(ui.tab==='shop'){buy(r);return}
  if(ui.tab==='bench'){if(r.au)doAU(r.id);else if(r.am)doMod(r.am);else if(r.wu){const t=(SV.wu&&SV.wu[r.k])|0;if(t>=3){if(ui.mode==='smith')doReroll(r.k);else note('Максимум')}else doWU(r.k,opt)}else if(r.c)doCraft(r.c);return}
  if(ui.tab==='garage'){doGar(r.g);return}
}
function fixSel(ui){const rows=rowsOf(ui);if(ui.sel>=rows.length)ui.sel=0;if(rows[ui.sel]&&!selectable(ui,rows[ui.sel]))moveSel(ui,1)}
// иконки стволов (сбоку), рисуются на UI-холсте
function gunIcon(w,x,y,s){if(window.ICONS&&ICONS.draw(u,w,x,y,s))return;const R2=(a,b,c,d,col)=>{u.fillStyle=col;u.fillRect(x+a*s,y+b*s,c*s,d*s)};
  if(WD[w]&&WD[w].ico2){for(const q of WD[w].ico2)R2(...q);return} // скины (skins.js)
  if(w==='pistol'){R2(0,0,14,4,'#2a2a2e');R2(9,4,4,6,'#1a1a1e');R2(0,0,14,1,'#5a5a62')}
  else if(w==='glock'){R2(0,0,15,4,'#1a2a14');R2(10,4,4,6,'#141a10');R2(0,0,15,1,'#8aff3a');R2(15,1,2,2,'#8aff3a')}
  else if(w==='deagle'){R2(0,0,18,5,'#c8a030');R2(12,5,5,7,'#8a6a1a');R2(0,0,18,1.2,'#ffe890');R2(2,2,8,1,'#e8c860')}
  else if(w==='shotgun'){R2(0,2,26,3,'#26262a');R2(18,2,12,5,'#6a4424');R2(0,2,26,1,'#4a4a52');R2(8,5,8,2,'#6a4424')}
  else if(w==='ak'){R2(0,2,30,3,'#141418');R2(22,2,12,5,'#7a4424');R2(10,5,4,7,'#2a2a2a');R2(4,1,10,1,'#7a4424')}
  else if(w==='m4'){R2(0,2,30,3,'#2a2a30');R2(23,2,10,5,'#3a3a42');R2(11,5,3,6,'#1a1a1e');R2(8,0,12,2,'#4a4a52');R2(14,-1,4,1,'#ff4040')}
  else if(w==='rpk'){R2(0,2,34,3,'#141418');R2(26,2,10,5,'#6a3a1c');R2(10,5,8,8,'#2a2a2a');R2(2,5,1,4,'#3a3a3a');R2(5,5,1,4,'#3a3a3a')}
  else if(w==='awp'){R2(0,2,36,3,'#3a5a2a');R2(26,2,10,6,'#2a3a1e');R2(10,-1,12,3,'#141418');R2(0,3,2,1,'#ff3030')}
  else if(w==='rail'){R2(0,1,28,6,'#3a4a5a');R2(2,3,24,1,'#8af0ff');R2(26,0,4,8,'#c8f8ff')}
  else if(w==='flamer'){R2(0,2,24,4,'#4a4a52');R2(14,0,10,8,'#8a6a3a');R2(24,-2,6,10,'#cfe8d0');R2(0,3,2,2,'#ff8a20')}
  else if(w==='uzi'){for(const o of [0,7]){R2(o,o*.6,12,4,'#ff5ac8');R2(o+7,o*.6+4,3,6,'#c8309a');R2(o+2,o*.6+4,2,5,'#2a2a2e');R2(o,o*.6,12,1,'#ffb0e8')}}
  else if(w==='bat'){R2(0,2,26,3,'#b07434');R2(20,2,6,3,'#2a2a2a');R2(0,1,8,4,'#c88a44')}
  else if(w==='kukri'){R2(0,2,14,4,'#c8ccd4');R2(0,2,14,1,'#f0f4f8');R2(2,5,6,2,'#c8ccd4');R2(14,2,8,3,'#4a2e1a')}
  else if(w==='shovel'){R2(0,0,8,8,'#8a9098');R2(0,0,8,1,'#e0e4ea');R2(8,3,22,2,'#8a6a40');R2(28,1,3,6,'#5a3a20')}
  else if(WD[w]&&WD[w].ico){for(const q of WD[w].ico)R2(...q)}
}
UP.gunIcon=gunIcon;
function T(t,x,y,c,sz,b,al){uiFont(sz||5,b);u.fillStyle=c;u.textAlign=al||'left';u.fillText(t,x,y);u.textAlign='left'}
function btn(x,y,w,h,t,on,col){u.fillStyle=on?(col||'#ffd23a'):'rgba(255,255,255,.1)';u.fillRect(x,y,w,h);T(t,x+w/2,y+h/2+2,on?'#120a1c':'#fff',5,true,'center')}
const LX=8,LY=32,LW=150,RH=9.6;
function drawUI(){
  const ui=UP.ui;if(!ui)return;fixSel(ui);
  panel(0,0,W,H,.94);
  const title=ui.mode==='mirror'?'ЗЕРКАЛО В ПРИХОЖЕЙ':ui.mode==='sortie'?'СБОРЫ ПЕРЕД ВЫХОДОМ':ui.mode==='shop'?'ЛАВКА МИХАЛЫЧА':ui.mode==='inv'?'РЮКЗАК':ui.mode==='smith'?'ОРУЖЕЙНИК ВО ДВОРЕ':ui.mode==='garage'?'ГАРАЖ ВО ДВОРЕ':'ОРУЖЕЙНАЯ';
  T(title,8,11,'#ffd23a',8,true);T('₽ '+fmt(SV.rub),W-8,11,'#5ae87a',7,true,'right');
  // вкладки
  if(ui.tab==='shop'){const tl=trustLv();T('Доверие '+stars(tl,5)+(tl>1?'  −'+Math.round(TDISC[tl-1]*100)+'%':''),W-8,22,'#ffd23a',4.2,true,'right');if(UP._shopL!==E.L){UP._shopL=E.L;SV.visA=0;SV.visAm={}}T('патроны: до 3 пачек каждого типа',W-8,28,'#9a92b0',3.6,true,'right')}
  if(ui.tab==='bench'||ui.tab==='garage')T('₽ '+fmt(SV.rub)+'  ·  обычные: '+(SV.parts|0)+'  ·  средние: '+(SV.elec|0)+'  ·  редкие: '+(SV.core|0)+'  ·  легенд.: '+(SV.leg|0)+'  ·  кевлар: '+(SV.kev|0)+'  ·  керамика: '+(SV.cer|0)+((SV.freeTier|0)>0?'  ·  бесплатно: '+SV.freeTier:''),W-8,29,'#8af0ff',3.6,true,'right');
  let tx=8;for(const k of ui.tabs){const w=k==='shop'||k==='ss'?64:k==='bench'?46:44;btn(tx,15,w,10,TABS[k],ui.tab===k,ui.tab===k?'#ffd23a':null);ui['tb_'+k]=[tx,15,w,10];tx+=w+4}
  const rows=rowsOf(ui),r=rows[ui.sel];
  // список
  const maxN=13;if(ui.sel<ui.scroll)ui.scroll=ui.sel;if(ui.sel>=ui.scroll+maxN)ui.scroll=ui.sel-maxN+1;
  if(ui.tab==='med'){drawMed();}
  else if(ui.tab==='bag'){drawBag();}
  else if(ui.tab==='bench'&&BG(ui)){drawBenchGrid(ui)}
  else{
    if(!rows.length)T(ui.tab==='arm'?'Брони пока нет. Первую найдёшь у Аниса.':'Пусто',LX,LY+8,'#9a92b0',5);
    rows.slice(ui.scroll,ui.scroll+maxN).forEach((row,i0)=>{const i=i0+ui.scroll,y=LY+i0*RH,sel=i===ui.sel;
      if(row.h){T(row.h,LX,y+7,'#9a92b0',4,true);return}
      u.fillStyle=sel?'rgba(255,210,58,.22)':'rgba(255,255,255,.04)';u.fillRect(LX,y,LW,RH-1.2);if(sel){u.fillStyle='#ffd23a';u.fillRect(LX,y,1.5,RH-1.2)}
      if(ui.tab==='wpn'){const d=WD[row.k],eq=PS.lo[row.sl]===row.k;
        if(!row.own){T('???',LX+4,y+6.4,'#4a4458',4.8,true);return}
        T((eq?'✓ ':'')+d.n,LX+4,y+6.4,eq?'#7affb0':'#fff',4.6,true);
        if(d.am){const m=row.k==='flamer'?Math.ceil(PS.mag[row.k]||0)+'%':(PS.mag[row.k]||0),rs=row.k==='flamer'?Math.ceil(PS.fuel||0):(PS[d.am]||0);T(m+' / '+rs,LX+LW-3,y+6.4,rs+(+PS.mag[row.k]||0)>0?'#ffd23a':'#ff6a6a',4.4,true,'right')}else T('∞',LX+LW-3,y+6.4,'#9a92b0',4.4,true,'right')}
      if(ui.tab==='arm'){const a=ARM[row.id],s=SV.arms[row.id],dur=PS.arm&&PS.arm.id===row.id?PS.arm.dur:s.dur,eq=SV.eq===row.id;
        T((eq?'✓ ':'')+a.n,LX+4,y+6.4,eq?'#7affb0':'#fff',4.4,true);u.fillStyle='rgba(0,0,0,.6)';u.fillRect(LX+LW-34,y+3,30,3);u.fillStyle=dur<=0?'#5a5a62':'#6ab8ff';u.fillRect(LX+LW-34,y+3,30*dur/a.max,3)}
      if(ui.tab==='sm'||ui.tab==='ss'){const who=ui.tab==='sm'?'m':'s',on=(SV.wear[who]||null)===row.id;if(row.id&&!row.own){T('???',LX+4,y+6.4,'#4a4458',4.8,true);return}T((on?'✓ ':'')+(row.id?SKINS[row.id].n:'Обычная одежда'),LX+4,y+6.4,on?'#7affb0':'#fff',4.6,true)}
      if(ui.tab==='shop'){if(row.sell){T(row.n,LX+4,y+6.4,'#ffd23a',4.4,true);T('+'+fmt(trophSum())+' ₽',LX+LW-3,y+6.4,'#5ae87a',4.4,true,'right');return}
        if(row.bx){T(row.n,LX+4,y+6.4,'#ff9a4a',4.2,true);T('1 трофей',LX+LW-3,y+6.4,'#ff9a4a',4,true,'right');return}
        const own=itemOwned(row),p=itemPrice(row),dl=row.id===dealId();let ix=0;if(row.wpn&&window.ICONS&&ICONS.PIX[row.id]){u.save();const s2=Math.min(6.4/ICONS.height(row.id),14/ICONS.width(row.id));u.translate(LX+3+ICONS.width(row.id)*s2,y+1.6+s2*ICONS.fac(row.id));u.scale(-1,1);ICONS.draw(u,row.id,0,0,s2);u.restore();ix=17}else{const w=itI(row.arm?'arm_'+row.arm:(row.am||row.id),LX+3,y+1.6,6.4,null,14);if(w)ix=17}T((dl?'% ':'')+row.n,LX+4+ix,y+6.4,own?'#7affb0':dl?'#ff4fd8':'#fff',4.4,true);T(own?'есть':row.id==='rep'&&p<=0?'целая':fmt(p)+' ₽',LX+LW-3,y+6.4,own?'#7affb0':SV.rub>=p?'#5ae87a':'#ff6a6a',4.4,true,'right')}
      if(ui.tab==='bench'&&row.au){const t=(SV.au&&SV.au[row.id])|0;T(ARM[row.id].n,LX+4,y+6.4,'#fff',4.2,true);T(stars(t,3),LX+LW-3,y+6.4,RARC[Math.min(2,Math.max(0,t-1))],4.4,true,'right')}
      else if(ui.tab==='bench'){if(row.wu){const t=(SV.wu&&SV.wu[row.k])|0;T(WD[row.k].n,LX+4,y+6.4,'#fff',4.2,true);T(stars(t,3),LX+LW-3,y+6.4,RARC[Math.min(2,Math.max(0,t-1))],4.4,true,'right')}
        else if(row.am){const M=MODS.find(m=>m.id===row.am),got=SV.amod&&SV.amod[row.am],on=SV.eq&&slotsOf(SV.eq).includes(row.am);T(M.n,LX+4,y+6.4,on?'#7affb0':'#fff',4.2,true);T(on?'в броне':got?'есть':'',LX+LW-3,y+6.4,on?'#7affb0':'#9a92b0',4,true,'right')}
        else{const c=row.c,dn=c.once&&SV[c.id],lk=!dn&&c.lock&&c.lock();u.fillStyle=lk?'#4a4458':RARC[c.r];u.fillRect(LX+1,y+2,2,6);T(c.n,LX+5,y+6.4,dn?'#7affb0':lk?'#5a5470':RARC[c.r],4.3,true);T(dn?'есть':lk?'закрыто':c.has?'есть '+c.has():'',LX+LW-3,y+6.4,dn?'#7affb0':lk?'#6a6480':'#9a92b0',4,true,'right')}}
      if(ui.tab==='garage'){const g=row.g,t=(SV.car&&SV.car[g.id])|0;T(g.n,LX+4,y+6.4,'#fff',4.4,true);T(stars(t,g.max),LX+LW-3,y+6.4,'#ffd23a',4.4,true,'right')}
    });
    if(rows.length>maxN){T('▲▼ ещё',LX+LW,LY+maxN*RH+5,'#9a92b0',3.6,false,'right')}
  }
  // карточка справа
  const cx=166,cy=32,cw=146;if(!(ui.tab==='bench'&&BG(ui))){u.fillStyle='rgba(255,255,255,.05)';u.fillRect(cx,cy,cw,124)}
  if(ui.tab==='bench')benchTop(ui);
  if(ui.tab==='wpn'&&r&&!r.h){const d=WD[r.k];
    if(r.own){u.save();u.translate(cx+cw/2,cy+22);u.scale(-1,1);gunIcon(r.k,window.ICONS&&ICONS.PIX[r.k]?-ICONS.width(r.k)*1.5:-((r.k==='rpk'||r.k==='awp')?54:45),window.ICONS&&ICONS.PIX[r.k]?3-ICONS.height(r.k)*1.5:-8,3);u.restore();
      T(d.n,cx+6,cy+48,'#ffd23a',6,true);T(SLOTN[d.slot],cx+6,cy+55,'#9a92b0',4,true);
      const L2=[];if(d.ml)L2.push(['Урон',d.ml.dmg],['Дальность',d.ml.reach>25?'длинная':'ближняя'],['Скорость',d.ml.cd<.35?'быстро':d.ml.cd>.5?'медленно':'средне']);
      else if(d.am){L2.push(['Магазин',d.mag+(r.k==='flamer'?'%':'')],['Перезарядка',d.rt+' с'],['Патроны',AMN[d.am]],['В запасе',r.k==='flamer'?Math.ceil(PS.fuel||0):(PS[d.am]||0)]);if(d.dmg)L2.unshift(['Урон',d.dmg+(d.pel?' ×'+d.pel:'')])}
      L2.forEach((l,i)=>{T(l[0],cx+6,cy+65+i*7,'#c8c0e0',4.6);T(String(l[1]),cx+cw-6,cy+65+i*7,'#fff',4.6,true,'right')});
      const extra={uzi:'Два узи, по 30 патронов в каждом. Стреляют по очереди из обеих рук — бешеная скорострельность.',glock:'Кислотные пули: зомби разъедает ещё 3 секунды.',awp:'Лазерный прицел. Пуля прошивает несколько зомби.',shotgun:'Только дробь: веер вблизи.',rpk:'Тяжёлый: бегаешь медленнее.',kukri:'Раны кровоточат.',shovel:'Достаёт дальше всего холодного.',deagle:'Прошивает насквозь.',rail:'Сквозной луч до стены.'}[r.k];
      if(extra){uiFont(4.2,false);u.fillStyle='#3ef0b0';wrapT(extra,cx+6,cy+108,cw-12,5.5)}
      const eq=PS.lo[d.slot]===r.k;btn(cx+6,cy+112+(extra?6:0),cw-12,9,eq?(d.slot==='m'?'✓ В РУКЕ':'✓ В СЛОТЕ — УБРАТЬ'):'ВЗЯТЬ В СЛОТ',!eq);ui.actBtn=[cx+6,cy+112+(extra?6:0),cw-12,9]}
    else{T('???',cx+cw/2,cy+40,'#4a4458',12,true,'center');T('Ещё не найдено. Ищи по сюжету',cx+cw/2,cy+56,'#9a92b0',4.6,false,'center');T('или у Михалыча.',cx+cw/2,cy+63,'#9a92b0',4.6,false,'center');ui.actBtn=null}}
  else if(ui.tab==='arm'&&r){const a=ARM[r.id],s=SV.arms[r.id],dur=PS.arm&&PS.arm.id===r.id?PS.arm.dur:s.dur;
    vest(cx+cw/2,cy+24,a.c,r.id);T(a.n+((SV.au&&SV.au[r.id])?'  '+stars(SV.au[r.id],3):''),cx+6,cy+52,'#ffd23a',5.4,true);
    T('Защита',cx+6,cy+62,'#c8c0e0',4.6);T(Math.round(a.prot*100)+'% урона',cx+cw-6,cy+62,'#fff',4.6,true,'right');
    T('Прочность',cx+6,cy+69,'#c8c0e0',4.6);T(Math.ceil(dur)+' / '+a.max,cx+cw-6,cy+69,dur<=0?'#ff6a6a':'#fff',4.6,true,'right');
    {let yy=cy+76;const L3=[];if(a.spd)L3.push(['Скорость',(a.spd>1?'+':'')+Math.round((a.spd-1)*100)+'%']);if(a.bul)L3.push(['От пуль','ещё +'+Math.round(a.bul*100)+'%']);if(a.mel)L3.push(['От укусов и ударов','ещё +'+Math.round(a.mel*100)+'%']);if(a.fire)L3.push(['От огня и кислоты','ещё +'+Math.round(a.fire*100)+'%']);const t3=(SV.au&&SV.au[r.id])|0;L3.push(['Прокачка (верстак)',t3+' / 3']);for(const l of L3.slice(0,2)){T(l[0],cx+6,yy,'#c8c0e0',4.6);T(l[1],cx+cw-6,yy,'#fff',4.6,true,'right');yy+=7}}
    uiFont(4.2,false);u.fillStyle='#3ef0b0';wrapT(a.d+' На нуле прочности не защищает — чини у Михалыча.',cx+6,cy+93,cw-12,5.2);
    const eq=SV.eq===r.id;btn(cx+6,cy+112,cw-12,9,eq?'✓ НАДЕТА — СНЯТЬ':'НАДЕТЬ',!eq);ui.actBtn=[cx+6,cy+112,cw-12,9]}
  else if(ui.tab==='sm'||ui.tab==='ss')drawSkinCard(ui,r,cx,cy,cw);
  else if(ui.tab==='bench'&&r&&!r.h){
    if(r.am){const M=MODS.find(m=>m.id===r.am),got=SV.amod&&SV.amod[r.am],on=SV.eq&&slotsOf(SV.eq).includes(r.am);T('⛨',cx+cw/2,cy+30,'#8af0ff',16,true,'center');T(M.n,cx+6,cy+50,'#ffd23a',5.4,true);
      uiFont(4.4,false);u.fillStyle='#e8e4f0';wrapT(M.d,cx+6,cy+60,cw-12,6);
      T(SV.eq?'Надета: '+ARM[SV.eq].n+' · слоты '+slotsOf(SV.eq).length+'/2':'Броня не надета',cx+6,cy+92,'#9a92b0',4);T(slotsOf(SV.eq||'_').map(id=>MODS.find(m=>m.id===id).n).join(', ')||'',cx+6,cy+100,'#7affb0',3.8);
      btn(cx+6,cy+112,cw-12,9,!got?'СОБРАТЬ · '+txtA(M.c):on?'СНЯТЬ ИЗ БРОНИ':'ПОСТАВИТЬ В БРОНЮ',got?!!SV.eq:haveA(M.c),'#8af0ff');ui.actBtn=[cx+6,cy+112,cw-12,9]}
    else if(r.au){const a=ARM[r.id],t=(SV.au&&SV.au[r.id])|0,c=AUC[t];vest(cx+cw/2,cy+24,a.c,r.id);T(a.n,cx+6,cy+48,'#ffd23a',5.2,true);T(stars(t,3),cx+cw-6,cy+48,'#ffd23a',6,true,'right');
      T('Сейчас: защита '+Math.round(a.prot*100)+'%, прочность '+a.max,cx+6,cy+56,'#c8c0e0',4.2);
      let yy=cy+66;for(let i=1;i<=3;i++){const q=AUC[i-1];T((i<=t?'✓ ':i===t+1?'▸ ':'  ')+i+': '+AUT[i-1],cx+6,yy,i<=t?'#7affb0':i===t+1?RARC[i-1]:'#6a6480',3.8,i===t+1);yy+=6.5;if(i===t+1){T(txtA(q),cx+12,yy-1,'#8af0ff',3.6);yy+=5.5}}
      btn(cx+6,cy+112,cw-12,9,t>=3?'МАКСИМУМ':'ПРОКАЧАТЬ · '+txtA(c),t<3&&haveA(c),'#8af0ff');ui.actBtn=[cx+6,cy+112,cw-12,9]}
    else if(r.wu){const k=r.k,t=(SV.wu&&SV.wu[k])|0,c=wuCost(t,k);u.save();u.translate(cx+cw/2,cy+22);u.scale(-1,1);gunIcon(k,window.ICONS&&ICONS.PIX[k]?-ICONS.width(k)*1.5:-((k==='rpk'||k==='awp')?54:45),window.ICONS&&ICONS.PIX[k]?3-ICONS.height(k)*1.5:-8,3);u.restore();
      T(WD[k].n,cx+6,cy+48,'#ffd23a',5.4,true);T(stars(t,3),cx+cw-6,cy+48,'#ffd23a',6,true,'right');
      T(WCLN[wClass(k)],cx+6,cy+55,'#9a92b0',3.6,false);
      for(let i=1;i<=t;i++)T('✓ '+i+': '+wuText(k,i)+(wuCh(k,i)==='B'?'  (B)':'  (A)'),cx+6,cy+56+i*7,'#7affb0',3.7,false);
      const fr=(SV.freeTier|0)>0;ui.actBtn2=null;
      if(t<3){T('▸ Уровень '+(t+1)+' — выбери один:',cx+6,cy+64+t*7,RARC[Math.min(2,t)],4,true);
        T('A) '+wuText(k,t+1,'A'),cx+8,cy+71+t*7,'#e8e4f0',3.7,false);T('B) '+wuText(k,t+1,'B'),cx+8,cy+78+t*7,'#e8e4f0',3.7,false);
        T(fr?'Бесплатное улучшение от Михалыча':'Цена: '+txtC(c),cx+6,cy+108,fr||haveC(c)?'#8af0ff':'#ff7a7a',3.8,true);
        const ok=fr||haveC(c),hw=(cw-15)/2;btn(cx+6,cy+112,hw,9,'A  [E]',ok,'#8af0ff');btn(cx+9+hw,cy+112,hw,9,'B  [Q]',ok,'#ffb04a');ui.actBtn=[cx+6,cy+112,hw,9];ui.actBtn2=[cx+9+hw,cy+112,hw,9]}
      else{const sm=ui.mode==='smith';T(sm?'R — перекинуть последний выбор · '+fmt(rerollCost(k))+' ₽':'Перекинуть выбор можно у Михалыча',cx+6,cy+108,'#9a92b0',3.6,false);
        btn(cx+6,cy+112,cw-12,9,sm?'ПЕРЕКИНУТЬ · '+fmt(rerollCost(k))+' ₽':'МАКСИМУМ',sm&&SV.rub>=rerollCost(k),'#ffd23a');ui.actBtn=sm?[cx+6,cy+112,cw-12,9]:null;ui.rerollBtn=sm}}
    else{const c=r.c,dn=c.once&&SV[c.id];if(!itI(c.id,cx+cw/2,cy+8,30,'c',120))T('⚒',cx+cw/2,cy+30,RARC[c.r],14,true,'center');T(c.n,cx+6,cy+50,RARC[c.r],5.4,true);T(RAR[c.r].toUpperCase(),cx+cw-6,cy+50,RARC[c.r],3.8,true,'right');uiFont(4.4,false);u.fillStyle='#e8e4f0';wrapT(c.d,cx+6,cy+60,cw-12,6);
      T('Есть: '+(c.has?c.has():dn?'да':'нет'),cx+6,cy+100,'#9a92b0',4.4);
      const lk=c.lock&&c.lock(),cap=CAP[c.id];if(lk)T('🔒 '+c.lockT,cx+6,cy+106,'#ff7a7a',3.8,true);else if(cap!=null)T('Лимит с собой: '+cap,cx+6,cy+106,'#9a92b0',3.8);
      btn(cx+6,cy+112,cw-12,9,dn?'УЖЕ СДЕЛАНО':lk?'ЗАКРЫТО':'СОБРАТЬ · '+txtC(c.c),!dn&&!lk&&haveC(c.c),RARC[c.r]);ui.actBtn=[cx+6,cy+112,cw-12,9]}}
  else if(ui.tab==='garage'&&r){const g=r.g,t=(SV.car&&SV.car[g.id])|0,c=g.c[t];T('🚗',cx+cw/2,cy+30,'#ffd23a',14,true,'center');T(g.n,cx+6,cy+52,'#ffd23a',5.4,true);uiFont(4.4,false);u.fillStyle='#e8e4f0';wrapT(g.d,cx+6,cy+62,cw-12,6);
    btn(cx+6,cy+112,cw-12,9,!c?'МАКСИМУМ':txtC(c),!!c&&haveC(c),'#ffd23a');ui.actBtn=[cx+6,cy+112,cw-12,9]}
  else if(ui.tab==='shop'&&r&&(r.sell||r.bx)){if(!itI(r.sell?'tag':r.id,cx+cw/2,cy+8,30,'c',120))T(r.sell?'₽':'☠',cx+cw/2,cy+30,r.sell?'#5ae87a':'#ff9a4a',14,true,'center');T(r.n,cx+6,cy+52,'#ffd23a',5,true);uiFont(4.4,false);u.fillStyle='#e8e4f0';wrapT(r.d,cx+6,cy+62,cw-12,6);
    if(r.sell){let i=0;for(const k in SV.troph)if(k!=='boss'&&SV.troph[k]>0&&i<3){T(TROPH[k].n+' ×'+SV.troph[k],cx+6,cy+90+i*6,'#9a92b0',4);i++}}
    btn(cx+6,cy+112,cw-12,9,r.sell?'ПРОДАТЬ · +'+fmt(trophSum())+' ₽':'ОБМЕНЯТЬ',true,'#5ae87a');ui.actBtn=[cx+6,cy+112,cw-12,9]}
  else if(ui.tab==='shop'&&r){const own=itemOwned(r),p=itemPrice(r);if(r.id===dealId())T('СДЕЛКА ДНЯ −40%',cx+cw-6,cy+8,'#ff4fd8',4.6,true,'right');
    if(r.wpn){if(window.ICONS&&ICONS.PIX[r.id]){u.save();u.translate(cx+cw/2,cy+22);u.scale(-1,1);gunIcon(r.id,-ICONS.width(r.id)*1.5,3-ICONS.height(r.id)*1.5,3);u.restore()}else gunIcon(r.id,cx+20,cy+16,3)}else if(r.arm)vest(cx+cw/2,cy+24,ARM[r.arm].c,r.arm);else if(!itI(r.am||r.id,cx+cw/2,cy+8,30,'c',120)){T(r.am?'▮▮▮':r.id==='syr'?'✚':r.id==='pot'?'⚗':r.id==='rep'?'🔧':'♨',cx+cw/2,cy+30,'#ffd23a',14,true,'center')}
    T(r.n,cx+6,cy+52,'#ffd23a',5.4,true);uiFont(4.4,false);u.fillStyle='#e8e4f0';wrapT(r.d,cx+6,cy+62,cw-12,6);
    if(r.am)T('Сейчас: '+(r.am==='fuel'?Math.ceil(PS.fuel||0):(PS[r.am]||0)),cx+6,cy+96,'#9a92b0',4.4);
    if(r.id==='rep'&&SV.eq){const a=ARM[SV.eq],dur=PS.arm?PS.arm.dur:SV.arms[SV.eq].dur;T(a.n+': '+Math.ceil(dur)+'/'+a.max,cx+6,cy+96,'#9a92b0',4.4)}
    btn(cx+6,cy+112,cw-12,9,own?'УЖЕ ЕСТЬ':(r.id==='rep'&&p<=0)?'ЧИНИТЬ НЕЧЕГО':'КУПИТЬ · '+fmt(p)+' ₽',!own&&SV.rub>=p&&p>0,'#5ae87a');ui.actBtn=[cx+6,cy+112,cw-12,9]}
  else ui.actBtn=null;
  // слоты внизу
  const lo=PS.lo||{};if(ui.mode!=='mirror'&&ui.mode!=='inv'&&!(ui.tab==='bench'&&bv(ui)!=='home'))T('С собой — одноруч. дальнее: '+(lo.p&&WD[lo.p]?WD[lo.p].n:'—')+' · двуруч. дальнее: '+(lo.t&&WD[lo.t]?WD[lo.t].n:'—')+' · холодное: '+(lo.m&&WD[lo.m]?WD[lo.m].n:'—')+(SV.eq?' · '+ARM[SV.eq].n:''),8,166,'#c8c0e0',3.6,true);
  const bt=ui.mode==='sortie'?'В ПУТЬ ▸':ui.mode==='inv'?'ЗАКРЫТЬ':'ГОТОВО';btn(W-58,160,50,12,bt,true,ui.mode==='sortie'?'#3ef0b0':'#ffd23a');ui.goBtn=[W-58,160,50,12];
  if(ui.mode==='inv'){T(touch.on?'Игра на паузе':'Игра на паузе · I / Tab / Esc — закрыть',8,176,'#6a6480',3.6);return}
  T(touch.on?'Касайся строк и вкладок':'W/S — выбрать · E — взять/купить · A/D — вкладки · Esc — '+(ui.mode==='sortie'?'в путь':'закрыть'),8,176,'#6a6480',3.6);
}
function wrapT(t,x,y,w,lh){const ws=t.split(' ');let line='',n=0;for(const wd of ws){const tt=line?line+' '+wd:wd;if(u.measureText(tt).width>w&&line){u.fillText(line,x,y+n*lh);n++;line=wd}else line=tt}if(line)u.fillText(line,x,y+n*lh)}
// детальные иконки предметов (items.js): вписать в h×maxW
function itI(k,x,y,h,al,maxW){if(!window.ICONS||!ICONS.item)return 0;const kk=ICONS.itemKey(k);if(!kk)return 0;const P=ICONS.IP[kk];if(maxW&&P.w*h/P.h>maxW)h=maxW*P.h/P.w;return ICONS.item(u,kk,x,y,h,al)}
UP.itI=itI;
function vest(x,y,c,id){if(id&&itI('arm_'+id,x,y-15,32,'c',60))return;u.fillStyle=c;u.fillRect(x-14,y-14,28,30);u.fillStyle=shade(c,1.3);u.fillRect(x-14,y-14,28,3);u.fillStyle='#120a1c';u.fillRect(x-6,y-14,12,7);u.fillStyle=shade(c,.7);u.fillRect(x-12,y-2,10,8);u.fillRect(x+2,y-2,10,8);u.fillStyle='rgba(255,255,255,.2)';u.fillRect(x-12,y-2,10,1);u.fillRect(x+2,y-2,10,1)}
// ---- Д3б инвентарь: только просмотр, игра на паузе ----
function drawBag(){
  const AN={ammo:'9 мм',p50:'.50 AE',shells:'12 кал.',r762:'7,62',r556:'5,56',awp:'.338',cells:'батареи',fuel:'топливо',rockets:'ракеты'};
  // справа в левой колонке — герой в полный рост в текущих шмотках
  const DL=window.DOLL?44:0,VX=LX+LW-3-DL;
  if(DL){let who='m';try{const L=C1.engine.L;if(L&&L.hero)who=heroWho(L.hero)||'m'}catch(e){}
    const dx=LX+LW-DL/2,gg=u.createRadialGradient(dx,LY+70,3,dx,LY+70,40);gg.addColorStop(0,'rgba(255,79,216,.2)');gg.addColorStop(1,'rgba(62,240,176,0)');u.fillStyle=gg;u.fillRect(dx-DL/2,LY,DL,126);
    DOLL.draw(u,who,SV.wear[who]||null,dx,LY+118,84,tm);const sk=SV.wear[who]&&SKINS[SV.wear[who]];T(who==='m'?'МИКРОБ':'ШМАКОДЯВКА',dx,LY+126,'#ffd23a',4,true,'center');T(sk?sk.n:'обычная одежда',dx,LY+132,'#9a92b0',3.6,false,'center')}
  const wIc=(k,x,y)=>{const P=window.ICONS&&ICONS.PIX[k];if(!P)return 0;const z=Math.min(5/P.h,16/P.w);u.save();u.imageSmoothingEnabled=false;u.drawImage(P.cv,x,y-4.6+(5-P.h*z)/2,P.w*z,P.h*z);u.restore();return 1};
  let y=LY+6;const H1=(t)=>{T(t,LX,y,'#9a92b0',4,true);y+=7},R=(a,b,c,ic)=>{const w=ic?wIc(ic,LX+3,y):0;T(a,LX+4+(w?18:0),y,'#fff',4.4,true);T(String(b),VX,y,c||'#ffd23a',4.4,true,'right');y+=6.4};
  H1('ОРУЖИЕ');const ws=Object.keys(PS.own||{}).filter(k=>WD[k]&&PS.own[k]);for(const k of ws.slice(0,7)){const d=WD[k],t=(SV.wu&&SV.wu[k])|0;R(d.n+(t?' '+stars(t,3):''),d.am?((k==='flamer'?Math.ceil(PS.mag[k]||0)+'%':(PS.mag[k]|0))):'∞','#ffd23a',k)}
  if(ws.length>7)R('…ещё',ws.length-7,'#9a92b0');
  y+=2;H1('ПАТРОНЫ');let any=0;for(const k in AN){const n=k==='fuel'?Math.ceil(PS.fuel||0):(PS[k]|0);if(n>0){const w=itI(k,LX+3,y-4.6,5.6,null,9);R((w?'     ':'')+AN[k],n);any=1}}if(!any)R('пусто','—','#ff6a6a');
  const cx=166;y=LY+6;const BI={'Шприцы (H)':'syr','Зелья (J)':'pot','Антидоты (сами)':'anti','Обычные детали':'parts','Молотовы (F)':'moon','Растяжки (T)':'trip','Ключ-карты':'card','Электроника · ядра':'elec','Кевлар · керамика':'kev','Канистры':'fuel'};for(const k in TROPH)BI[TROPH[k].n]=k;const R2=(a,b,c)=>{const w=BI[a]?itI(BI[a],cx+5,y-4.6,5.6,null,9):0;T(a,cx+6+(w?11:0),y,'#fff',4.4,true);T(String(b),cx+146-6,y,c||'#ffd23a',4.4,true,'right');y+=6.4},H2=(t)=>{T(t,cx+6,y,'#9a92b0',4,true);y+=7};
  H2('МЕДИЦИНА');R2('Шприцы (H)',PS.syr|0,'#3aff7a');R2('Зелья (J)',PS.pot|0,'#c86aff');R2('Антидоты (сами)',SV.anti|0,'#8aff3a');
  if(PS.inf>0)R2('Заражение',Math.round(PS.inf)+'%',PS.inf>60?'#ff3a3a':'#c8ff6a');
  y+=2;H2('ЗАПАСЫ');R2('Рубли',fmt(SV.rub)+' ₽','#5ae87a');R2('Обычные детали',SV.parts|0,'#c8c8d0');R2('Средние',SV.elec|0,'#6aff9a');R2('Редкие',SV.core|0,'#6ab8ff');R2('Легендарные',SV.leg|0,'#ffb04a');R2('Молотовы (F)',PS.moon|0);R2('Растяжки (T)',SV.trip|0);R2('Ключ-карты',SV.cards|0);R2('Электроника · ядра',(SV.elec|0)+' · '+(SV.core|0),'#6ab8ff');R2('Кевлар · керамика',(SV.kev|0)+' · '+(SV.cer|0),'#c8a0ff');if(SV.so)R2('Еда · вода',(SV.food|0)+' · '+(SV.water|0),'#ffcf6a');if(SV.so&&SV.fuelC)R2('Канистры',SV.fuelC|0,'#ffa030');
  y+=2;H2('ТРОФЕИ');let tn=0;for(const k in (SV.troph||{}))if(SV.troph[k]>0){if(tn<3)R2(TROPH[k].n,SV.troph[k],'#ff9a4a');tn++}if(!tn)R2('пока нет','—','#6a6480');
  T('Спасено выживших: '+(SV.surv|0),8,166,'#c8c0e0',4.2,true);
  UP.ui.actBtn=null;
}
function drawMed(){
  const y0=LY,IK=['syr','pot','beer','moon','kit'];const row=(i,a,b,c)=>{itI(IK[i],LX+3,y0+2+i*14,11,null,14);T(a,LX+19,y0+8+i*14,'#fff',5,true);T(b,LX+LW-3,y0+8+i*14,'#ffd23a',5,true,'right');T(c,LX+19,y0+14+i*14,'#9a92b0',3.8)};
  row(0,'Шприцы',PS.syr|0,'H — быстро +60 HP');row(1,'Зелья регенерации',PS.pot|0,'J — минуту лечат понемногу');
  row(2,'Пиво (ящик на балконе)',SV.beerBox?'2 на выход':'—','B — буст 10 с: бьёшь сильнее');row(3,'Самогон (молотов)',PS.moon|0,'F / ПКМ — бросить');
  row(4,'Запасы еды и воды','полно','Консервы, крупа, вода. На месяц хватит.');
  const cx=166,cy=32;T('АПТЕЧКА',cx+6,cy+12,'#ffd23a',6,true);uiFont(4.4,false);u.fillStyle='#e8e4f0';
  wrapT('Шприцы и зелья берёшь все, лимита нет. Самогон и пиво — тоже вне лимита. Докупить можно у Михалыча.',cx+6,cy+24,134,6);
  if(!(itI('syr',cx+16,cy+64,16,null,54)&&itI('pot',cx+80,cy+58,24)&&itI('kit',cx+106,cy+62,20))){u.fillStyle='#e8f0f0';u.fillRect(cx+30,cy+70,30,8);u.fillStyle='#3aff7a';u.fillRect(cx+33,cy+72,22,4)}
  UP.ui.actBtn=null;
}
function uiTap(p){const ui=UP.ui;if(!ui)return;
  for(const k of ui.tabs){const b=ui['tb_'+k];if(b&&inR(p,...b)){if(ui.tab!==k){ui.tab=k;ui.sel=0;ui.scroll=0;sfx('click')}return}}
  if(ui.goBtn&&inR(p,...ui.goBtn)){close();return}
  if(ui.tab==='bench'&&benchTap(ui,p))return;
  if(ui.actBtn2&&ui.tab==='bench'&&(rowsOf(ui)[ui.sel]||{}).wu&&inR(p,...ui.actBtn2)){actSel(ui,'B');return}
  if(ui.actBtn&&inR(p,...ui.actBtn)){actSel(ui);return}
  if(ui.tab!=='med'&&p.x>=LX&&p.x<=LX+LW&&p.y>=LY){const i=Math.floor((p.y-LY)/RH)+ui.scroll,rows=rowsOf(ui);if(rows[i]&&selectable(ui,rows[i])){if(ui.sel===i&&ui.tab!=='shop')actSel(ui);else{ui.sel=i;sfx('click')}}return}
}
function uiKey(c){const ui=UP.ui;if(ui.mode==='inv'&&(c==='KeyI'||c==='Tab')){close();return}
  if(ui.tab==='bench'&&benchKey(ui,c))return;
  if(c==='Escape'){close();return}
  if(c==='KeyW'||c==='ArrowUp')moveSel(ui,-1);else if(c==='KeyS'||c==='ArrowDown')moveSel(ui,1);
  else if(c==='KeyA'||c==='ArrowLeft'||c==='KeyD'||c==='ArrowRight'||c==='Tab'){const i=ui.tabs.indexOf(ui.tab),d=(c==='KeyA'||c==='ArrowLeft')?-1:1;ui.tab=ui.tabs[(i+d+ui.tabs.length)%ui.tabs.length];ui.sel=0;ui.scroll=0;sfx('click')}
  else if(c==='KeyE'||c==='Enter'||c==='Space')actSel(ui);
  else if(c==='KeyQ'&&ui.tab==='bench')actSel(ui,'B');
  else if(c==='KeyR'&&ui.tab==='bench'&&ui.mode==='smith'){const r=rowsOf(ui)[ui.sel];if(r&&r.wu)doReroll(r.k)}
}

// ================= 04.11: ВЕРСТАК ПО КАТЕГОРИЯМ =================
// главный экран — иконки категорий; оружие и броня — сетка (ненайденное силуэтом) → экран предмета
const CONS=['МЕДИЦИНА','МЕТАТЕЛЬНОЕ','ЛОВУШКИ','ПАТРОНЫ'];
function missN(){let n=SV.maxCh|0;const d=SV.so&&SV.so.done;if(d)for(const k in d)n+=(d[k]|0);return n}
UP.missN=missN;
// расходники открываются по цепочке: обычное → (скрафтил + прошла миссия) → среднее → (так же) → лучшее
function consLock(c){if(!CONS.includes(c.cat)||!c.r)return null;const prev=RECIPES.find(q=>q.cat===c.cat&&q.r===c.r-1);if(!prev)return null;
  const t=SV.crU&&SV.crU[prev.id];if(t==null)return 'Сначала собери «'+prev.n+'» — после следующей миссии откроется это.';if(missN()<=t)return 'Откроется после следующей миссии (ты уже собирал «'+prev.n+'»).';return null}
for(const c of RECIPES)if(CONS.includes(c.cat)&&c.r){const l0=c.lock;c.lock=()=>!!consLock(c)||!!(l0&&l0());Object.defineProperty(c,'lockT',{configurable:true,get(){return consLock(c)||''}})}
// ремонт надетой брони на верстаке
RECIPES.push({cat:'РЕМОНТ',id:'armFix',r:0,n:'Залатать надетую броню',c:[350,2,0,0,0],vis:()=>!!SV.eq,
  lock:()=>{if(!SV.eq)return true;const a=ARM[SV.eq],d=PS.arm&&PS.arm.id===SV.eq?PS.arm.dur:(SV.arms[SV.eq]||{}).dur;return d>=a.max},lockT:'Броня целая.',
  d:'Кевларовые заплатки и стяжки: прочность надетой брони снова полная.',f:()=>{const a=ARM[SV.eq];if(PS.arm&&PS.arm.id===SV.eq)PS.arm.dur=a.max;if(SV.arms[SV.eq])SV.arms[SV.eq].dur=a.max;note(a.n+': как новая')}});
const BCAT=[
  {id:'wpn',n:'ОРУЖИЕ',d:'Обвесы и перки на стволы'},
  {id:'cons',n:'РАСХОДНИКИ',d:'Медицина, гранаты, ловушки, патроны'},
  {id:'arm',n:'БРОНЯ',d:'Кевлар, керамика, модули'},
  {id:'rep',n:'РЕМОНТ',d:'Что можно починить'},
  {id:'uq',n:'ТРОФЕИ БОССОВ',d:'Уникальные рецепты'}];
function bv(ui){return ui.bv||(ui.bv='home')}
function BG(ui){const v=bv(ui);return v==='home'||v==='wpn'||v==='arm'}
UP.benchView=ui=>bv(ui||UP.ui||{});
function ownW(k){return !!(SV.own[k]||(PS.own&&PS.own[k]))}
function wList(){const a=[];for(const sl of ['p','t','m'])for(const k of allw(sl))if(!NOWU[k])a.push(k);return a}
function aList(){return Object.keys(ARM)}
function benchRows(){const ui=UP.ui||{},v=bv(ui),r=[];
  if(v==='cons'){for(const cat of CONS){const cs=RECIPES.filter(c=>c.cat===cat&&(!c.vis||c.vis()));if(!cs.length)continue;r.push({h:cat});for(const c of cs)r.push({c})}}
  else if(v==='rep'){const cs=RECIPES.filter(c=>c.cat==='РЕМОНТ'&&(!c.vis||c.vis()));if(cs.length){r.push({h:'РЕМОНТ'});for(const c of cs)r.push({c})}}
  else if(v==='uq'){r.push({h:UCAT});for(const c of RECIPES)if(c.cat===UCAT&&(!c.vis||c.vis()))r.push({c})}
  else if(v==='wi'){const k=ui.bk;r.push({h:'ОРУЖИЕ ▸ '+(WD[k]?WD[k].n:'')});r.push({k,wu:1});
    if(WD[k]&&WD[k].ml){r.push({h:'ХОЛОДНОЕ — НАВСЕГДА (для всех)'});for(const c of RECIPES)if(c.cat==='ХОЛОДНОЕ (навсегда)'&&(!c.vis||c.vis()))r.push({c})}}
  else if(v==='ai'){const id=ui.bk;r.push({h:'БРОНЯ ▸ '+(ARM[id]?ARM[id].n:'')});r.push({id,au:1});r.push({h:'МОДУЛИ (2 СЛОТА НА НАДЕТОЙ)'});for(const m of MODS)r.push({am:m.id})}
  return r}
// силуэты (кэш): рисуем иконку и заливаем тёмным
const SIL={};
function silOf(P,key){if(SIL[key])return SIL[key];const c=document.createElement('canvas');c.width=P.cv.width;c.height=P.cv.height;const g=c.getContext('2d');g.drawImage(P.cv,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#2c2640';g.fillRect(0,0,c.width,c.height);return SIL[key]=c}
function fitIcon(P,cv,x,y,w,h){const z=Math.min(w/P.w,h/P.h),dw=P.w*z,dh=P.h*z;const sm=u.imageSmoothingEnabled;u.imageSmoothingEnabled=false;u.drawImage(cv,x+(w-dw)/2,y+(h-dh)/2,dw,dh);u.imageSmoothingEnabled=sm}
function wIcon(k,x,y,w,h,own){const P=window.ICONS&&(ICONS.PIX[k]||(WD[k]&&WD[k].pix));if(!P||!P.cv){T(own?(WD[k]?WD[k].n:k):'?',x+w/2,y+h/2+2,own?'#fff':'#4a4458',3.4,true,'center');return}
  u.save();u.translate(x+w/2,0);u.scale(-1,1);fitIcon(P,own?P.cv:silOf(P,'w'+k),-w/2,y,w,h);u.restore()}
function aIcon(id,x,y,w,h,own){const P=window.ICONS&&ICONS.IP&&ICONS.IP['arm_'+id];if(!P||!P.cv){if(own)vest(x+w/2,y+h/2,ARM[id].c,id);else T('?',x+w/2,y+h/2+3,'#4a4458',8,true,'center');return}fitIcon(P,own?P.cv:silOf(P,'a'+id),x,y,w,h)}
function catIcon(id,x,y,w,h){
  if(id==='wpn'){const k=['ak','shotgun','pistol'].find(q=>WD[q]&&ICONS&&ICONS.PIX[q])||'pistol';wIcon(k,x+4,y+2,w-8,h-4,true)}
  else if(id==='arm'){aIcon(SV.eq||Object.keys(SV.arms)[0]||'1',x,y,w,h,true)}
  else{const ik={cons:'kit',rep:'parts',uq:'boss'}[id];const P=window.ICONS&&ICONS.itemKey&&ICONS.IP[ICONS.itemKey(ik)];if(P&&P.cv)fitIcon(P,P.cv,x,y,w,h);else T({cons:'✚',rep:'⚒',uq:'☠'}[id],x+w/2,y+h/2+4,'#ffd23a',12,true,'center')}}
function grid(ui){return ui.bv==='home'?BCAT.map(c=>c.id):ui.bv==='wpn'?wList():aList()}
function drawBenchGrid(ui){const v=bv(ui),items=grid(ui);ui.grid=[];ui.gsel=Math.max(0,Math.min(items.length-1,ui.gsel|0));
  const X0=8,Y0=32,AW=304,AH=122;
  let cols,cw,ch;if(v==='home'){cols=5;cw=57;ch=70}else if(v==='wpn'){cols=8;cw=36;ch=22}else{cols=5;cw=57;ch=40}
  const gap=(AW-cols*cw)/(cols-1);
  items.forEach((it,i)=>{const cx=X0+(i%cols)*(cw+gap),cy=Y0+Math.floor(i/cols)*(ch+3),sel=i===ui.gsel;
    let own=true,lab='',sub='';
    if(v==='home'){const c=BCAT[i];lab=c.n;sub=c.d}
    else if(v==='wpn'){own=ownW(it)}else{own=!!SV.arms[it]}
    u.fillStyle=sel?'rgba(255,210,58,.2)':own?'rgba(255,255,255,.06)':'rgba(255,255,255,.025)';u.fillRect(cx,cy,cw,ch);
    if(sel){u.strokeStyle='#ffd23a';u.lineWidth=.6;u.strokeRect(cx+.3,cy+.3,cw-.6,ch-.6)}
    if(v==='home'){catIcon(it,cx+8,cy+6,cw-16,ch-30);T(lab,cx+cw/2,cy+ch-15,sel?'#ffd23a':'#fff',4.2,true,'center');uiFont(3.2,false);u.fillStyle='#9a92b0';u.textAlign='center';wrapT(sub,cx+cw/2,cy+ch-9,cw-4,4);u.textAlign='left'}
    else if(v==='wpn'){wIcon(it,cx+2,cy+2,cw-4,ch-6,own);if(own){const t=(SV.wu&&SV.wu[it])|0;if(t)T('★'.repeat(t),cx+cw-2,cy+ch-1.5,'#ffd23a',3,true,'right')}}
    else{aIcon(it,cx+4,cy+2,cw-8,ch-12,own);T(own?ARM[it].n:'???',cx+cw/2,cy+ch-3,own?(sel?'#ffd23a':'#e8e4f0'):'#4a4458',3,true,'center');if(own){const t=(SV.au&&SV.au[it])|0;if(t)T('★'.repeat(t),cx+cw-2,cy+6,'#ffd23a',3,true,'right')}}
    ui.grid.push([cx,cy,cw,ch,i])});
  // подпись выбранного
  const it=items[ui.gsel];let line='';
  if(v==='wpn')line=ownW(it)?(WD[it].n+' · '+SLOTN[WD[it].slot].toLowerCase()+' · ур. '+((SV.wu&&SV.wu[it])|0)+'/3 — E / клик: прокачка'):'??? — ещё не найдено. Ищи по сюжету, в тайниках и у Михалыча.';
  else if(v==='arm')line=SV.arms[it]?(ARM[it].n+' — E / клик: прокачка и модули'):'??? — эта броня ещё не найдена.';
  else line='Выбери раздел верстака';
  T(line,X0,Y0+AH+4,'#c8c0e0',3.8,true)}
function benchTop(ui){const v=bv(ui);if(v==='home'){ui.backBtn=null;return}
  const nm={wpn:'ОРУЖИЕ',arm:'БРОНЯ',cons:'РАСХОДНИКИ',rep:'РЕМОНТ',uq:'ТРОФЕИ БОССОВ',wi:'ОРУЖИЕ',ai:'БРОНЯ'}[v];
  btn(8,159,104,11,'◀ НАЗАД · '+nm+(touch.on?'':' (Esc)'),true,'#8af0ff');ui.backBtn=[8,159,104,11]}
function benchBack(ui){const v=bv(ui);ui.bv=v==='wi'?'wpn':v==='ai'?'arm':'home';ui.sel=0;ui.scroll=0;if(v==='wi'||v==='ai'){}else ui.gsel=BCAT.findIndex(c=>c.id===v);if(ui.gsel<0)ui.gsel=0;sfx('click')}
function benchEnter(ui,i){const v=bv(ui),items=grid(ui),it=items[i];if(it==null)return;ui.gsel=i;
  if(v==='home'){ui.bv=it;ui.gsel=0;ui.sel=0;ui.scroll=0;sfx('click');if(!BG(ui))fixFirst(ui);if(window.TIPS)TIPS.show('bench_'+it);return}
  if(v==='wpn'){if(!ownW(it)){note('Ещё не найдено');sfx('thump',1.6);return}ui.wg=i;ui.bv='wi';ui.bk=it;fixFirst(ui);sfx('click');return}
  if(v==='arm'){if(!SV.arms[it]){note('Эта броня ещё не найдена');sfx('thump',1.6);return}ui.ag=i;ui.bv='ai';ui.bk=it;fixFirst(ui);sfx('click');return}}
function fixFirst(ui){const rows=benchRows();ui.sel=Math.max(0,rows.findIndex(r=>!r.h));ui.scroll=0}
function benchTap(ui,p){if(ui.backBtn&&inR(p,...ui.backBtn)){benchBack(ui);return true}
  if(BG(ui)&&ui.grid){for(const g of ui.grid)if(inR(p,g[0],g[1],g[2],g[3])){if(ui.gsel===g[4]||touch.on||true)benchEnter(ui,g[4]);return true}return true}
  return false}
function benchKey(ui,c){const v=bv(ui);
  if(c==='Escape'||c==='Backspace'){if(v==='home'){if(c==='Backspace')return true;return false}benchBack(ui);return true}
  if(!BG(ui))return false;const n=grid(ui).length,cols=v==='wpn'?8:5;
  if(c==='KeyA'||c==='ArrowLeft'){ui.gsel=(ui.gsel-1+n)%n;sfx('click');return true}
  if(c==='KeyD'||c==='ArrowRight'){ui.gsel=(ui.gsel+1)%n;sfx('click');return true}
  if(c==='KeyW'||c==='ArrowUp'){ui.gsel=Math.max(0,ui.gsel-cols);sfx('click');return true}
  if(c==='KeyS'||c==='ArrowDown'){ui.gsel=Math.min(n-1,ui.gsel+cols);sfx('click');return true}
  if(c==='KeyE'||c==='Enter'||c==='Space'){benchEnter(ui,ui.gsel);return true}
  if(c==='Tab'&&ui.tabs.length>1)return false;
  return true}


// ================= СКИНЫ ОДЕЖДЫ: зеркало в прихожей =================
// карта цветов (база → скин) + накладка поверх спрайта 24×24; leg/shoe — цвет ног и обуви
const MB={J:'#8f9298',JD:'#686b72',JL:'#b4b7bc',JF:'#5a5d63',SH:'#f0f0f0',SH2:'#c9cbd0',H1:'#3d2b20',H2:'#5a4232',H3:'#4e3828',H4:'#2a1d15'};
const SB={D:'#f59cc8',DD:'#cf74a2',DL:'#ffc4df'};
const SKINS={
  office:{n:'Офисный стиль',where:'офис Аниса',
    m:{map:{J:'#2e3a52',JD:'#1e2638',JL:'#46557a',JF:'#24304a'},leg:'#1e2638',shoe:'#0a0a0c',over:g=>{P(g,14.5,9,1,6,'#b8202a');P(g,14.5,9,1,1,'#e83a40')}},
    s:{map:{D:'#4a4a5a',DD:'#36364a',DL:'#6a6a80'},shoe:'#141414',over:g=>{P(g,13,10,1.5,4,'#f0f0f0');P(g,9,11.5,5,.5,'#2a2a34')}}},
  brand:{n:'Брендовый хайп',where:'ТЦ «Сити Молл»',
    m:{map:{J:'#d8b060',JD:'#a8803a',JL:'#f0d898',JF:'#8a6a2a'},leg:'#2a2a34',shoe:'#f4f4f4',over:g=>{for(let i=0;i<9;i++)P(g,8.5+(i%3)*2,7.5+((i/3)|0)*3.5,.5,.5,'#6a4a1a');P(g,13.5,8,.5,8,'#ffd23a')}},
    s:{map:{D:'#e8202e',DD:'#b01020',DL:'#ff6a70'},shoe:'#ffd23a',over:g=>{P(g,8,11.5,7,1,'#ffd23a');P(g,11,9.5,1,5,'#141418');P(g,11,9.5,1,1,'#ff4fd8')}}},
  acid:{n:'Кислотный',where:'канализация в Италии',
    m:{map:{J:'#5aee2a',JD:'#3ab81a',JL:'#b8ff7a',JF:'#2a8a12',SH:'#141418',SH2:'#0a0a0e'},leg:'#1a2a12',shoe:'#7aff3a',over:g=>{P(g,9,7,.5,10,'#141418');P(g,11,7,.5,10,'#141418');P(g,14.5,10,.5,4,'#d4ff3a')}},
    s:{map:{D:'#7aff3a',DD:'#4ac81a',DL:'#d0ff9a'},shoe:'#3ef05a',over:g=>{for(let i=0;i<8;i++)P(g,8+(i%4)*1.6,8.5+((i/4)|0)*6,.5,.5,'#141418');P(g,8,11.5,7,.5,'#141418')}}},
  rome:{n:'Гладиатор',where:'Колизей',
    m:{map:{J:'#9a6030',JD:'#6a3e1a',JL:'#d8a050',JF:'#5a3214',SH:'#c8b080',SH2:'#a89060'},leg:'#e0b090',shoe:'#6a3e1a',over:g=>{P(g,3,6,5,12,'#a8181e');P(g,3,6,1,12,'#d82a30');P(g,10,8.5,.5,7,'#d8b030');P(g,12,8.5,.5,7,'#d8b030')}},
    s:{map:{D:'#f2eee2',DD:'#d0c8b4',DL:'#ffffff'},shoe:'#a8783a',over:g=>{P(g,8,11.5,7,1,'#d8b030');P(g,10,8,.5,8,'#7ab040');P(g,10.5,8,.5,1,'#9ad050');P(g,10.5,15,.5,1,'#9ad050')}}},
  ski:{n:'Лыжный от бати',where:'Перелесье',
    m:{map:{J:'#d8282a',JD:'#a01a1c',JL:'#ff6a5a',JF:'#801214',H1:'#2a5ad8',H2:'#4a7af0',H3:'#3a6ae0',H4:'#1a3aa0'},leg:'#2a2a3a',shoe:'#e8e8f0',over:g=>{P(g,9,7,.5,10,'#f0f0f0');P(g,10,7,.5,10,'#f0f0f0');P(g,8.5,11.5,1.5,1,'#ffffff')}},
    s:{map:{D:'#5ac8ff',DD:'#3a98d8',DL:'#b8ecff'},leg:'#2a2a3a',shoe:'#f0f0f8',over:g=>{P(g,13,8,1.5,8,'#f8f8ff');P(g,9,7.5,.5,9,'#ffffff')}}},
  desert:{n:'Пустынный камуфляж',where:'Екатеринбург (глава 8)',
    m:{map:{J:'#c8b080',JD:'#a89060',JL:'#e0cca0',JF:'#6a5a3a',SH:'#6a5a3a',SH2:'#5a4a2a'},leg:'#a89060',shoe:'#4a3a24',over:g=>{for(let i=0;i<7;i++)P(g,8+(i*3)%7,7+i*1.6,1.5,1,'#6a5a3a')}},
    s:{map:{D:'#c8b080',DD:'#a89060',DL:'#e0cca0'},shoe:'#4a3a24',over:g=>{for(let i=0;i<6;i++)P(g,8.5+(i*3)%6,8+i*1.5,1.5,1,'#6a5a3a')}}},
  club:{n:'Клубный рейв',where:'клуб «Грибыч» (глава 7)',
    m:{map:{J:'#141418',JD:'#0a0a0e',JL:'#ff4fd8',JF:'#2a2a30',SH:'#3ef0b0',SH2:'#2ab890'},leg:'#3ef0b0',shoe:'#141418',over:g=>{for(let i=0;i<10;i++)P(g,8+(i%5)*1.4,8+((i/5)|0)*7,.5,.5,'#ff4fd8')}},
    s:{map:{D:'#ff4fd8',DD:'#d82ab8',DL:'#ffffff'},shoe:'#b45aff',over:g=>{for(let i=0;i<9;i++)P(g,8.5+(i%3)*2,8+((i/3)|0)*3,.5,.5,i%2?'#ffffff':'#ffd0f0')}}},
};
UP.SKINS=SKINS;
const SKORDER=['office','brand','acid','rome','ski','club','desert'];UP.SKORDER=SKORDER;
if(!SV.skins)SV.skins={};if(!SV.wear)SV.wear={m:null,s:null};
const hx=h=>{const n=parseInt(h.slice(1),16);return n};
const CMAP={};
function cmapOf(id,who){const k=id+who;if(CMAP[k])return CMAP[k];const B=who==='m'?MB:SB,sk=SKINS[id][who],m=new Map();for(const key in sk.map)if(B[key])m.set(hx(B[key]),hx(sk.map[key]));return CMAP[k]=m}
function applySkin(g,who,id){
  id=id||SV.wear[who];if(!id||!SKINS[id])return;const c=g.canvas,m=cmapOf(id,who);
  if(m.size){const im=g.getImageData(0,0,c.width,c.height),d=im.data;for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const k=(d[i]<<16)|(d[i+1]<<8)|d[i+2],v=m.get(k);if(v!==undefined){d[i]=v>>16;d[i+1]=(v>>8)&255;d[i+2]=v&255}}g.putImageData(im,0,0)}
  const o=SKINS[id][who].over;if(o)o(g);
}
UP.applySkin=applySkin;
function heroWho(HE){if(!HE)return 'm';if(HE.leg==='#f2cab2')return 's';if(HE.leg==='#1c1c22')return 'm';return null}
C1.skinFx=(g,HE)=>{const w=heroWho(HE);if(w)applySkin(g,w)};
C1.skinLegs=(HE)=>{const w=heroWho(HE);if(!w)return null;const id=SV.wear[w];if(!id||!SKINS[id])return null;const sk=SKINS[id][w];return [sk.leg||(HE?HE.leg:'#1c1c22'),sk.shoe||(HE?HE.shoe:'#9a9ca2')]};
// квартира: Микроб в выбранных шмотках
const _dmBase=drawMikrob;
{const _dm2=drawMikrob;drawMikrob=function(g,w){const r=_dm2(g,w);try{applySkin(g,'m')}catch(e){}return r}}
UP.grantSkin=function(id){if(!SKINS[id]||SV.skins[id])return;SV.skins[id]=1;persist();sfx('pickup');
  note('Найдены шмотки «'+SKINS[id].n+'» для Микроба и Шмакодявки! Переодеться — у зеркала в прихожей');banner={t:'НОВЫЕ ШМОТКИ: '+SKINS[id].n.toUpperCase(),life:2.4,n:1}};
// зеркало: окно с двумя вкладками
TABS.sm='МИКРОБ';TABS.ss='ШМАКОДЯВКА';
function skinRows(){return [{id:null}].concat(SKORDER.filter(id=>SKINS[id]).map(id=>({id,own:!!SV.skins[id]})))}
const pvC=mkQ(24,24,true),pvG=pvC.getContext('2d',{willReadFrequently:true});
function drawSkinCard(ui,r,cx,cy,cw){const who=ui.tab==='sm'?'m':'s';
  pvG.setTransform(Q,0,0,Q,0,0);if(who==='m')drawMikrob(pvG,null);else drawShmak(pvG,tm);
  if(who==='m'){/* drawMikrob уже надел текущее — перерисуем базу */pvG.setTransform(Q,0,0,Q,0,0);_dmBase(pvG,null)}
  if(r&&r.id&&r.own)applySkin(pvG,who,r.id);
  if(window.DOLL){const id=r&&r.id&&r.own?r.id:(r&&!r.id?null:undefined);
    // крупная кукла в полный рост + маленький вид сверху в углу
    const gg=u.createRadialGradient(cx+cw/2,cy+40,4,cx+cw/2,cy+40,46);gg.addColorStop(0,'rgba(255,79,216,.22)');gg.addColorStop(1,'rgba(62,240,176,0)');u.fillStyle=gg;u.fillRect(cx+2,cy,cw-4,64);
    if(id===undefined){u.save();u.globalAlpha=.9;u.filter='brightness(0)';DOLL.draw(u,who,null,cx+cw/2,cy+62,58,tm);u.restore()}else DOLL.draw(u,who,id,cx+cw/2,cy+62,58,tm);
    u.save();u.imageSmoothingEnabled=false;u.translate(cx+cw-14,cy+12);u.rotate(-Math.PI/2);u.drawImage(pvC,-11,-11,22,22);u.restore()}
  else{u.save();u.imageSmoothingEnabled=false;u.translate(cx+cw/2,cy+32);u.rotate(-Math.PI/2);u.drawImage(pvC,-32,-32,64,64);u.restore()}
  if(!r)return;
  if(r.id&&!r.own){T('???',cx+cw/2,cy+66,'#4a4458',8,true,'center');T('Ещё не найдено. Где искать: '+SKINS[r.id].where,cx+cw/2,cy+78,'#9a92b0',4.2,false,'center');ui.actBtn=null;return}
  const nm=r.id?SKINS[r.id].n:'Обычная одежда';T(nm,cx+6,cy+66,'#ffd23a',6,true);
  uiFont(4.2,false);u.fillStyle='#e8e4f0';wrapT(r.id?'Найдено: '+SKINS[r.id].where+'. Только внешний вид, на бой не влияет.':(who==='m'?'Серая куртка, белая футболка, чёрные джинсы, жёлтые очки.':'Розовое платье и чёрные ботинки на платформе.'),cx+6,cy+76,cw-12,6);
  const on=(SV.wear[who]||null)===r.id;btn(cx+6,cy+112,cw-12,9,on?'✓ НАДЕТО':'НАДЕТЬ',!on);ui.actBtn=[cx+6,cy+112,cw-12,9];
}
UP.openMirror=()=>{UP.open('sm','mirror')};
// встраиваемся в окно
{const _rowsOf=rowsOf;rowsOf=function(ui){if(ui.tab==='sm'||ui.tab==='ss')return skinRows();return _rowsOf(ui)}}
{const _act=actSel;actSel=function(ui,opt){if(ui.tab==='sm'||ui.tab==='ss'){const r=rowsOf(ui)[ui.sel];if(!r)return;if(r.id&&!r.own){note('Ещё не найдено');return}SV.wear[ui.tab==='sm'?'m':'s']=r.id;persist();sfx('pick');return}return _act(ui,opt)}}
// зеркало в прихожей
for(const it of IT){let lb='';try{lb=it.label()}catch(e){}if(lb==='Посмотреться в зеркало'){const a0=it.act;it.label=()=>Object.keys(SV.skins).length?'Зеркало: переодеться':'Посмотреться в зеркало';it.act=()=>{if(Object.keys(SV.skins).length)UP.openMirror();else a0()}}}

// ================= ПАУЗА =================
const PB={x:W/2+46,y:2,w:14,h:10}; // кнопка паузы на экране (для телефона)
function canPause(){return state==='play'&&!UP.ui&&!(C1.gal&&UP.galOn)}
function pause(on){UP.paused=on;C1.mdown=false;C1.fire=null;sfx('click');for(const k in keys)keys[k]=false;if(on)store()}
const PBT=[[0,'ПРОДОЛЖИТЬ','#3ef0b0'],[4,'СОХРАНЕНИЯ · F5','#3ef0b0'],[3,'НАСТРОЙКИ','#6a6280'],[2,'КОД СОХРАНЕНИЯ','#ffd23a'],[1,'В ГЛАВНОЕ МЕНЮ','#ff4fd8']];
const PBY=i=>56+i*15;
function drawPause(){
  // полупрозрачный неоновый фон: розовый с бирюзой, игра видна сквозь него
  const g=u.createLinearGradient(0,0,W,H);g.addColorStop(0,'rgba(255,79,216,.34)');g.addColorStop(.5,'rgba(20,8,40,.7)');g.addColorStop(1,'rgba(62,240,176,.3)');u.fillStyle=g;u.fillRect(0,0,W,H);
  u.fillStyle='rgba(0,0,0,.12)';for(let y=0;y<H;y+=2)u.fillRect(0,y,W,.6);
  u.save();u.textAlign='center';uiFont(18,true);u.shadowColor='#ff4fd8';u.shadowBlur=12;u.fillStyle='#ff4fd8';u.fillText('ПАУЗА',W/2,46);u.shadowColor='#3ef0b0';u.shadowBlur=6;u.fillStyle='rgba(255,255,255,.85)';u.fillText('ПАУЗА',W/2-.6,45.4);u.restore();
  PBT.forEach(([id,t,c],i)=>{const y=PBY(i),on=(UP.psel|0)===id,lock=id===3;
    u.save();if(on){u.shadowColor=c;u.shadowBlur=10}u.fillStyle=on?'rgba(255,255,255,.14)':'rgba(10,4,24,.55)';u.fillRect(W/2-62,y,124,13);u.restore();
    u.fillStyle=lock?'#4a4260':c;u.fillRect(W/2-62,y,2,13);u.fillRect(W/2+60,y,2,13);
    u.save();u.textAlign='center';uiFont(6.4,true);if(on&&!lock){u.shadowColor=c;u.shadowBlur=6}u.fillStyle=lock?'#6a6280':on?'#ffffff':c;u.fillText(t+(lock?'  🔒':''),W/2,y+9.2);u.restore()});
  T(window.MIS&&MIS.on?'Режим «Миссии»: прогресс не сохраняется.':'Игра сохраняется сама в начале каждого участка.',W/2,134,'#e8e0f8',4.2,false,'center');
  T(touch.on?'':'Esc / P — продолжить · W/S и E — выбрать',W/2,141,'#c8c0e0',4,false,'center');
  if(!(window.MIS&&MIS.on))T('₽ '+fmt(SV.rub),W/2,152,'#5ae87a',6,true,'center');
  if(UP.pmsgT>0){UP.pmsgT-=1/60;T('Настройки появятся позже',W/2,56,'#ffd23a',4.6,true,'center')}
}
function toMenu(){if(window.MIS&&MIS.on){MIS.back();return}store();try{location.hash=''}catch(e){}(window.__leaving=1,location.reload())}
function pAct(id){if(id===0)pause(false);else if(id===3){UP.pmsgT=1.6;sfx('thump',1.6)}else if(id===2){if(window.SAVEP)SAVEP.openBox()}else if(id===4){if(window.SAVEP&&SAVEP.openSlots)SAVEP.openSlots()}else if(id===1)toMenu()}
function pauseTap(p){PBT.forEach(([id],i)=>{if(inR(p,W/2-62,PBY(i),124,13))pAct(id)})}
function drawPauseBtn(){if(state!=='play'||UP.ui||UP.paused||C1.over||cut&&C1.mode!=='cut'&&!C1.on)return;if(!touch.on&&!(mouse.on&&mouse.y<20))return;
  u.globalAlpha=.55;u.fillStyle='rgba(8,5,16,.8)';u.fillRect(PB.x,PB.y,PB.w,PB.h);u.fillStyle='#fff';u.fillRect(PB.x+4,PB.y+2,2,6);u.fillRect(PB.x+8,PB.y+2,2,6);u.globalAlpha=1}

// ================= ЖЁЛТАЯ СТРЕЛКА К ВЫХОДУ =================
// выход ищется по подписи действия; для участков без явного действия — таблица EXITS
const EXIT_RE=/^(Выйти|Лифт|Эскалатор|Калитка|Войти в здание|Главный вход|Лестница|Люк|Ворота|В улочки|Пролом|Логово|Дорога|Тропа|Подъезд бати|Спуститься|Зайти в подъезд|Клуб|Кабриолет|Сесть|«Золотое|Красный Land Rover|Вернуться|Выход|Дальше|Уйти|На крышу|Вниз|Наверх|К машине|В машину)/;
const EXITS={cellar7:'Дверь: главный танцпол',apple:'Выйти к машине',yard2:'Сесть в красный',flatb:'Открытое окно'}; // id участка → {x,y} или функция
UP.EXITS=EXITS;UP.exitOf=L=>exitOf(L);
function exitOf(L){
  const ex=EXITS[L.id]||L.exit;let re=EXIT_RE;if(typeof ex==='string')re=new RegExp('^'+ex);else if(ex){const p=typeof ex==='function'?ex():ex;if(p)return p}
  let best=null;for(const it of L.its||[]){try{if(it.cond&&!it.cond())continue;const lb=typeof it.label==='function'?it.label():it.label;if(re.test(lb||'')){best=it;break}}catch(e){}}
  if(!best&&re!==EXIT_RE)for(const it of L.its||[]){try{const lb=typeof it.label==='function'?it.label():it.label;if(EXIT_RE.test(lb||'')){best=it;break}}catch(e){}}
  return best;
}
function cleared(L){return L.armed!==false&&!L.zs.some(z=>!z.dead)&&!(L.score&&L.score.kills===0&&L.zs.length===0&&!L.exitAlways&&L.t<1)}
function drawExitArrow(){
  if(!C1.on||C1.mode!=='td'||cut||dlg||tr||(window.MG&&MG.active))return;const L=E.L;if(!L||!L.its||L.noExitArrow)return;
  if(L.zs.some(z=>!z.dead))return;
  const t=exitOf(L);if(!t)return;
  const sx=t.x-camX,sy=t.y-camY,d=Math.hypot(t.x-pl.x,t.y-pl.y);if(d<18)return;
  const pulse=.75+.25*Math.sin(tm*6);
  if(sx>8&&sx<W-8&&sy>14&&sy<H-8){ // цель на экране: прыгающая стрелка над выходом
    const b=Math.abs(Math.sin(tm*4))*4,y=sy-16-b;u.save();u.translate(sx,y);u.fillStyle='#120a1c';u.beginPath();u.moveTo(-6,-7);u.lineTo(6,-7);u.lineTo(6,-1);u.lineTo(10,-1);u.lineTo(0,9);u.lineTo(-10,-1);u.lineTo(-6,-1);u.closePath();u.fill();
    u.fillStyle=`rgba(255,210,58,${pulse})`;u.beginPath();u.moveTo(-4.5,-6);u.lineTo(4.5,-6);u.lineTo(4.5,0);u.lineTo(7.5,0);u.lineTo(0,7.5);u.lineTo(-7.5,0);u.lineTo(-4.5,0);u.closePath();u.fill();u.restore();
    T('ВЫХОД',sx,y-10,'#ffd23a',4.4,true,'center');
  }else{ // за краем экрана: стрелка у края
    const a=Math.atan2(sy-H/2,sx-W/2),ex=W/2+Math.cos(a)*(W/2-16),ey=H/2+Math.sin(a)*(H/2-16),px=clamp(ex,14,W-14),py=clamp(ey,22,H-14);
    u.save();u.translate(px,py);u.rotate(a);u.fillStyle='#120a1c';u.beginPath();u.moveTo(11,0);u.lineTo(-6,-8);u.lineTo(-2,0);u.lineTo(-6,8);u.closePath();u.fill();
    u.fillStyle=`rgba(255,210,58,${pulse})`;u.beginPath();u.moveTo(9,0);u.lineTo(-5,-6.5);u.lineTo(-1.5,0);u.lineTo(-5,6.5);u.closePath();u.fill();u.restore();
    T('ВЫХОД',px-Math.cos(a)*14,py-Math.sin(a)*12+2,'#ffd23a',4,true,'center');
  }
}

// ================= ОРУЖЕЙНАЯ В КВАРТИРЕ =================
UP.armOn=()=>SV.armory&&S.step>=12;
setInterval(()=>{try{if(window.__ROOMNAME)__ROOMNAME.sklad=UP.armOn()?'ОРУЖЕЙНАЯ':'СКЛАД'}catch(e){}},500);
C1.onArmory=()=>{grant('armory');SV.maxCh=Math.max(SV.maxCh,2);store()};
// мебель оружейной (клетки 8 px, комната x 8..104, y 8..184)
const ARMS_SOLID=[[1,1,2,12],[3,1,7,1],[1,15,3,3],[6,11,2,2],[1,19,4,4],[7,17,3,2],[11,4,1,9],[10,1,2,2]];
let armSolidsOn=false;const savedJunk=[];
function syncArmory(){
  const on=UP.armOn();if(on===armSolidsOn)return;armSolidsOn=on;
  if(on){for(let i=solids.length-1;i>=0;i--){const s=solids[i];if(s.x<104&&s.y<184&&s.x>=8&&s.y>=8&&!(s.w===20&&s.h===6)){savedJunk.push(s);solids.splice(i,1)}}
    for(const r of ARMS_SOLID)solids.push({x:r[0]*C,y:r[1]*C,w:r[2]*C,h:r[3]*C,arm:1})}
  else{for(let i=solids.length-1;i>=0;i--)if(solids[i].arm)solids.splice(i,1);solids.push(...savedJunk.splice(0))}
  mapDirty=true;
}
const _drawSklad=drawSklad;
drawSklad=function(){if(!UP.armOn())return _drawSklad();
  // пол — чистый, светлый ковролин
  R(8,8,96,176,'#4a4250');for(let y=8;y<184;y+=8)for(let x=8;x<104;x+=8)if((x+y)/8%2)R(x,y,8,8,'#4e4656');
  // стойка оружия (левая стена)
  box(8,8,16,96,'#3a3a42','#5a5a62','#2a2a30');for(let y=14;y<100;y+=10){R(10,y,12,1.5,'#8a8a92');R(12,y-3,1,6,'#2a2a30');R(19,y-3,1,6,'#2a2a30')}
  // полка коллекции (верх)
  box(24,8,56,8,'#6a4a2a','#8a6a48','#4a3420');R(26,14,52,1,'#3a2414');
  // балкон с ящиком пива (верхний правый угол)
  box(80,8,16,16,'#7a5a2a','#9a7a48','#5a4020');for(let i=0;i<3;i++)for(let j=0;j<2;j++){R(82+i*5,10+j*6,4,4,'#d8a020');R(82+i*5,10+j*6,4,1,'#c8c8c8')}
  R(96,8,8,4,'#8ac8e8');
  // стена фотокарточек (правая стена)
  box(88,32,8,72,'#c8a878','#e8c898','#a88858');
  // аптечка: белый контейнер с крестом
  box(8,120,24,24,'#e8e8ec','#ffffff','#b8b8c0');R(17,124,6,16,'#d82a2a');R(12,129,16,6,'#d82a2a');
  // манекен с бронёй
  box(48,88,16,16,'#2a2a30','#3a3a42','#1a1a20');
  // запасы: консервы, вода, крупа (низ слева)
  box(8,152,32,32,'#7a5a3a','#9a7a58','#5a4028');for(let i=0;i<4;i++){R(10+i*7,155,5,5,'#c8c8d0');R(10+i*7,155,5,1,'#e8e8f0');R(10+i*7,163,5,7,'#4a8ad8');R(11+i*7,162,3,1,'#8ac8f8')}R(10,173,28,8,'#c8b080');R(12,175,24,1,'#a89060');
  // стол с рацией Михалыча
  box(56,136,24,16,'#6a5a4a','#8a7a6a','#4a3a2a');R(62,139,6,9,'#2a2a30');R(64,136,1,4,'#2a2a2a');R(70,140,6,4,'#3a8a4a');
  // светильник
  R(48,40,16,1,'rgba(255,240,200,.25)');
};
// динамика: стволы на стойке, легендарки на полке, фото на стене, броня на манекене
function drawArmoryDyn(){
  if(!UP.armOn())return;
  const lo=PS.lo||{};let y=14;
  for(const k of ['pistol','glock','deagle','shotgun','ak','m4','rpk','awp','rail','flamer','kukri','shovel']){if(!SV.own[k])continue;if(y>98)break;
    ctx.save();ctx.translate(12,y-1);ctx.scale(.36,.36);const R2=(a,b,c,d,col)=>{ctx.fillStyle=col;ctx.fillRect(a,b,c,d)};
    if(!(window.ICONS&&ICONS.draw(ctx,k,0,0,1)))gunIconCtx(k,R2);ctx.restore();if(lo.p===k||lo.t===k||lo.m===k)F(21,y-2,2,2,'#7affb0');y+=7}
  // полка: легендарные карточки
  let x=27;for(const c of C1.LEGS||[]){if(!C1.LEGSET.has(c.id))continue;ctx.drawImage(c.icon,x,9,6,6);x+=8}
  const cols=[...C1.COLSET].filter(id=>!/^ph/.test(id)).length;for(let i=0;i<Math.min(cols,6);i++)F(x+i*4,11,3,4,['#ff5a9a','#3ef0b0','#ffd23a','#8ab4ff'][i%4]);
  // стена фото
  let n=0;for(const c of C1.COLS||[]){if(!c.photo||!C1.COLSET.has(c.id))continue;const px=89,py=35+n*7;if(py>98)break;F(px,py,6,6,'#f4f0e6');if(c.icon)ctx.drawImage(c.icon,px+.5,py+.5,5,5);n++}
  // броня
  if(SV.eq){const a=ARM[SV.eq];F(51,91,10,10,a.c);F(51,91,10,2,shade(a.c,1.3));F(54,91,4,3,'#2a2a30')}
  // подсветка
  ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,56,96,40,'rgba(255,220,160,A)',.1);ctx.restore();
}
function gunIconCtx(w,R2){const S=1;
  if(WD[w]&&WD[w].ico2){for(const q of WD[w].ico2)R2(...q);return}
  if(w==='pistol'||w==='glock'){R2(0,0,14,4,w==='glock'?'#1a2a14':'#2a2a2e');R2(9,4,4,6,'#1a1a1e')}
  else if(w==='deagle'){R2(0,0,18,5,'#c8a030');R2(12,5,5,7,'#8a6a1a')}
  else if(w==='kukri'){R2(0,2,14,4,'#c8ccd4');R2(14,2,8,3,'#4a2e1a')}
  else if(w==='shovel'){R2(0,0,8,8,'#8a9098');R2(8,3,22,2,'#8a6a40')}
  else if(w==='uzi'){R2(0,0,12,4,'#ff5ac8');R2(7,4,3,5,'#c8309a');R2(4,6,12,4,'#ff5ac8')}
  else if(WD[w]&&WD[w].ico){for(const q of WD[w].ico)R2(...q)}
  else{const col={shotgun:'#6a4424',ak:'#7a4424',m4:'#3a3a42',rpk:'#6a3a1c',awp:'#3a5a2a',rail:'#3a4a5a',flamer:'#8a6a3a'}[w]||'#3a3a3a';R2(0,2,28,3,'#1a1a1e');R2(18,2,10,5,col);if(w==='rail')R2(2,3,24,1,'#8af0ff')}}
const _dm=drawMikrob;
drawMikrob=function(g,w){if(scene==='flat'&&state==='play'&&!cut)try{syncArmory();drawArmoryDyn()}catch(e){console.warn(e)}return _dm(g,w)};
// действия в оружейной
const armIt=(x,y,label,act)=>IT.push({x,y,r:13,label:()=>label,cond:()=>UP.armOn()&&HQ.active()&&!HQ.busy&&!UP.ui,act});
armIt(30,58,'Оружейная стойка',()=>UP.open('wpn','armory'));
armIt(38,132,'Аптечка',()=>UP.open('med','armory'));
armIt(56,112,'Броня на манекене',()=>UP.open('arm','armory'));
armIt(52,24,'Полка коллекции',()=>{C1.gal={pg:0,tab:'leg'};UP.galOn=true;sfx('click')});
armIt(80,68,'Стена фотокарточек',()=>{C1.gal={pg:0,tab:'col'};UP.galOn=true;sfx('click')});
armIt(88,30,'Ящик пива Столыпина',()=>say([['m','Ящик пива на балконе. Столыпин оставил и забыл.'],['m','Беру две банки на каждую вылазку. Кнопка B — буст.']]));
armIt(48,160,'Запасы еды и воды',()=>say([['m',['Консервы, крупа, вода. Шмакодявка всё подписала. «Не трогать до апокалипсиса». Апокалипсис уже был.','Тушёнка Аниса. Ещё на месяц хватит.','Вода в бутылках. Черсик пьёт только из крана. Сноб.'][(Math.random()*3)|0]]]));
armIt(68,160,'Рация Михалыча',()=>{if(!SV.shop){say([['m','Тишина в эфире.']]);return}say([['m','Михалыч, приём. Нужен товар.'],['g','Принял. Чего надо — говори, занесу к двери.']],()=>UP.open('shop','shop'))});

// ================= СБОРЫ В КВАРТИРЕ ПЕРЕД МИССИЕЙ =================
// глава отдаёт запуск миссии сюда: игрок свободно ходит по квартире (оружейная, зеркало, рация Михалыча)
// и сам выходит через входную дверь, когда готов
let PREP=null;
UP.prep=function(label,launch){PREP={label,launch};lockMove=false;dlg=null;
  note(SV.armory?'Собирайся: оружейная на складе, зеркало в прихожей. На миссию — входная дверь':'Осмотрись. На миссию — входная дверь')};
IT.push({x:212,y:205,r:16,label:()=>'Выйти: '+(PREP?PREP.label:''),cond:()=>!!PREP&&scene==='flat'&&state==='play'&&!C1.on&&!UP.ui,act:()=>{const p=PREP;PREP=null;lockMove=true;p.launch()}});
UP.prepping=()=>!!PREP;
// ================= МИХАЛЫЧ ВО ДВОРАХ: лавка =================
function hookMikhalych(L){
  if(!SV.shop||!L||!L.its)return;
  for(const it of L.its){let lb='';try{lb=it.label()}catch(e){}if(/Михалыч/.test(lb)&&!/канистр/i.test(lb)&&!it._shop){it._shop=1;const a0=it.act;it.act=()=>UP.open('shop','shop')}}
}


// находки скинов по участкам
const SKSPOT={
  off2:{id:'office',x:780,y:240,l:'Шкаф Аниса: запасные костюмы',say:[['m','Шкаф Аниса. Костюм-тройка, галстуки... и женский офисный комплект. Видимо, для секретарши.'],['m','Беру оба. Шмакодявке пойдёт.']]},
  mall1:{id:'brand',x:650,y:330,l:'Бутик: брендовые шмотки',say:[['s','Бутик! Всё с ценниками, всё бесплатно, потому что апокалипсис.'],['s','Мне красное. А Микробу — вот эту золотую куртку. Будет как рэпер.']]},
  sewer5:{id:'acid',x:330,y:60,l:'Рюкзак в кислотной жиже',say:[['s','Рюкзак. Внутри два комплекта, светятся зелёным от кислоты.'],['val','Ядрёно. Стирать не советую.'],['s','Ещё как берём. Микроб будет как радиоактивный.']]},
  colos5:{id:'rome',x:200,y:330,l:'Сундук гладиаторского шоу',say:[['s','Сундук с костюмами для шоу гладиаторов. Тога, лавровый венок...'],['s','А это для Микроба: доспех и красный плащ. Аве, Микроб!']]},
  dacha6:{id:'ski',x:96,y:150,l:'Сундук бати: лыжные костюмы',say:[['m','Батин сундук. Лыжные костюмы, ещё с девяностых. Красный — мне.'],['m','А голубой — Шмакодявке. Обрадуется, она давно хотела на лыжи.']]},
};
UP.SKSPOT=SKSPOT;
function floorNear(L,x,y){for(let r=0;r<60;r+=4)for(let a=0;a<8;a++){const px=x+Math.cos(a*Math.PI/4)*r,py=y+Math.sin(a*Math.PI/4)*r;if(E.gAt(px,py)===0&&E.gAt(px+4,py)===0&&E.gAt(px-4,py)===0)return [px,py]}return [x,y]}
function addSkinSpot(L){const sp=SKSPOT[L.id];if(!sp||!L.its||L._sk)return;L._sk=1;const [x,y]=floorNear(L,sp.x,sp.y);
  L.its.push({x,y,r:16,label:()=>sp.l,cond:()=>!SV.skins[sp.id],act:()=>say(sp.say,()=>UP.grantSkin(sp.id))});
  const du=L.drawUnder;L.drawUnder=function(){if(du)du();if(SV.skins[sp.id])return;const k=.5+.5*Math.sin(tm*4);
    P(ctx,x-5,y-4,10,8,'#6a3a8a');P(ctx,x-5,y-4,10,2,'#9a5ac8');P(ctx,x-2,y-6,4,2,'#3a1a4a');P(ctx,x-1,y-1,2,2,'#ffd23a');
    ctx.fillStyle='rgba(255,210,58,'+(.25*k)+')';ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.fill()}}
// ================= НОВЫЙ УЧАСТОК: лут, сборы, лавка =================
let hintT=0,freeFlat=false,fromTitleNow=false,seenL=null,wasFlat=false,fromTitle=false,lastState=state,saveT=0;
function onNewLevel(L,sortie){
  try{const ch=chNow();if(ch>=2)storyTo(ch)}catch(e){}
  processLoot(L);hookMikhalych(L);try{addSkinSpot(L)}catch(e){console.warn(e)}
  if(UP.upg()&&!L.secret){ // минимальный запас для пистолета, чтобы не остаться с пустыми руками
    const p=PS.lo&&PS.lo.p;if(p&&WD[p]&&WD[p].am==='ammo'&&(PS.ammo||0)+(PS.mag[p]||0)<16&&sortie)PS.ammo=16;
  }
  if(sortie&&SV.armory&&UP.upg()&&chNow()!==1&&chNow()!==6&&!L.hero){
    if(freeFlat&&!fromTitleNow)applySortie(); // собирались сами в оружейной — без окна сборов
    else UP.open('wpn','sortie')}
  freeFlat=false;
  store();
}
// ================= ЦИКЛ =================
const _update=update;
update=function(dt){
  if(state==='title')freeFlat=false;
  if(state==='play'&&lastState==='title')fromTitle=true;lastState=state;
  if(UP.ui){UP.ui.t+=dt;tm+=dt;updateMusic(dt);return}
  if(UP.paused){updateMusic(dt);return}
  if(C1.gal&&UP.galOn&&state==='play'){tm+=dt;updateMusic(dt);return}
  _update(dt);
  if(banner){banner.life-=dt;if(banner.life<=0)banner=null}
  if(scene==='flat'&&state==='play'&&!C1.on){wasFlat=true;syncArmory();if(!lockMove&&!dlg&&!cut){if(!freeFlat&&SV.armory&&!PREP&&[window.C5,window.C7,window.C8,window.C9,window.C10].some(o=>o&&o.ready))hintT=2.6;freeFlat=true}}
  if(hintT>0){hintT-=dt;if(hintT<=0&&scene==='flat'&&!C1.on)note('Перед выходом зайди в оружейную на складе: оружие, броня, аптечка, рация Михалыча')}
  const L=E.L;
  if(C1.on&&(C1.mode==='td'||C1.mode==='car')&&L&&L!==seenL&&!L.secret){seenL=L;fromTitleNow=fromTitle&&!wasFlat;onNewLevel(L,wasFlat||fromTitle);wasFlat=false;fromTitle=false}
  else if(L&&L!==seenL&&L.secret){processLoot(L)}
  if(C1.res&&C1.res!==lastRes){lastRes=C1.res;if(C1.mode==='td')rewardFor(C1.res)}
  // скорость в спецброне Ханжи
  applyAU();C1.spdMul=(UP.upg()&&PS.arm&&PS.arm.dur>0&&ARM[PS.arm.id]&&ARM[PS.arm.id].spd)?ARM[PS.arm.id].spd:1;dropArmParts();
  saveT+=dt;if(saveT>6){saveT=0;if(C1.on&&UP.upg())store()}
};
const _render=render;
render=function(){
  _render();
  const k=ui.width/W;u.setTransform(k,0,0,k,0,0);
  if(state==='play'&&!UP.ui&&!UP.paused){
    try{drawExitArrow()}catch(e){console.warn(e)}
    if(banner&&C1.on&&C1.mode==='td'){const a=Math.min(1,banner.life*3);u.globalAlpha=a;const s=1+Math.max(0,banner.life-1.1)*1.5;if(banner.combo&&C1.comboBanner)C1.comboBanner(banner,s,T);else T(banner.t,W/2,30*1+0,banner.n>=4?'#ff4fa3':'#ffd23a',6.4*s,true,'center');u.globalAlpha=1}
    if(C1.on&&C1.mode==='td'&&E.L&&E.L.armed&&!E.L.noHud&&!dlg&&!cut){const L=E.L;T('₽ '+fmt(SV.rub),9,C1.hudBot?H-14:(PS.arm&&UP.upg()?44:38)+11,'#5ae87a',4.6,true)}
  }
  if(C1.gal&&UP.galOn&&state==='play'){C1.galOverlay()}
  if(UP.ui)drawUI();
  if(UP.paused)drawPause();
  drawPauseBtn();
};
UP.isOpen=()=>!!(UP.ui||UP.paused||(C1.gal&&UP.galOn));

// ================= ВВОД: ранний перехват (см. window.__pre в index.html) =================
const toXY=e=>({x:(e.clientX-OX)/SC,y:(e.clientY-OY)/SC});
(window.__pre=window.__pre||[]).push(function(e){
  const t=e.type;
  if(state!=='play')return false;
  // галерея в квартире
  if(C1.gal&&UP.galOn){
    if(t==='keydown'){const g=C1.gal;if(g.view)g.view=null;else if(e.code==='Tab'){g.tab=g.tab==='leg'?'col':'leg';g.pg=0}else if(e.code==='ArrowRight'||e.code==='ArrowLeft'||e.code==='KeyD'||e.code==='KeyA'){const n=Math.max(1,Math.ceil(C1.COLS.length/9));g.pg=((g.pg||0)+((e.code==='ArrowRight'||e.code==='KeyD')?1:n-1))%n}else if(!e.repeat){C1.gal=null;UP.galOn=false}return true}
    if(t==='mousedown'||t==='touchstart'){const p=toXY(e.changedTouches?e.changedTouches[0]:e);if(e.changedTouches)touch.on=true;C1.galTap(p);if(!C1.gal)UP.galOn=false;return true}
    return t!=='mousemove'&&t!=='keyup'&&t!=='mouseup'&&t!=='touchend';
  }
  if(UP.ui){
    if(t==='keydown'){if(!e.repeat||/Arrow|Key[WS]/.test(e.code))uiKey(e.code);return true}
    if(t==='mousedown'||t==='touchstart'){const p=toXY(e.changedTouches?e.changedTouches[0]:e);if(e.changedTouches){touch.on=true;mouse.on=false}uiTap(p);return true}
    if(t==='wheel'){moveSel(UP.ui,e.deltaY>0?1:-1);return true}
    return t==='touchmove'||t==='contextmenu';
  }
  if(UP.paused){
    if(t==='keydown'){if(e.code==='Escape'||e.code==='KeyP')pause(false);else if(e.code==='KeyW'||e.code==='ArrowUp'||e.code==='KeyS'||e.code==='ArrowDown'){const ord=PBT.map(b=>b[0]),i=ord.indexOf(UP.psel|0);UP.psel=ord[(i+(e.code==='KeyW'||e.code==='ArrowUp'?ord.length-1:1))%ord.length];sfx('click')}else if(['KeyE','Enter','Space'].includes(e.code)&&!e.repeat)pAct(UP.psel|0);return true}
    if(t==='mousedown'||t==='touchstart'){const p=toXY(e.changedTouches?e.changedTouches[0]:e);pauseTap(p);return true}
    return t!=='mousemove'&&t!=='keyup'&&t!=='mouseup'&&t!=='touchend';
  }
  // открыть паузу
  if(t==='keydown'&&!e.repeat){
    if(e.code==='KeyP'||(e.code==='Escape'&&!cut&&!(window.MG&&MG.active)&&!C1.colView&&!C1.over)){UP.psel=0;pause(true);return true}
  }
  if((t==='mousedown'||t==='touchstart')){const p=toXY(e.changedTouches?e.changedTouches[0]:e);if(inR(p,PB.x-3,PB.y-2,PB.w+6,PB.h+5)&&(touch.on||e.changedTouches||p.y<20)){UP.psel=0;pause(true);return true}}
  return false;
});
addEventListener('blur',()=>{if(state==='play'&&C1.on&&!(window.SNP&&SNP.on)&&!UP.ui&&!UP.paused&&C1.mode==='td'){UP.psel=0;pause(true)}});
UP.pause=pause;
})();
