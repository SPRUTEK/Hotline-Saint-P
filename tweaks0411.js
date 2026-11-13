// =====================================================================
//  tweaks0411.js — правки по прохождению Натальи (04.11). Подключается последним.
//  · музыка: AciDisco (flat) — только в квартире; во дворе всегда intro (кроме осады гл.9)
// =====================================================================
(function(){
'use strict';
if(!window.C1)return;
const E=C1.engine;
// ---------- музыка ----------
const YARDL=/^(fort|yard2|yard4)$/;
function curL(){return E&&E.L}
function inYard(){if(typeof scene!=='undefined'&&scene==='yard'&&!(C1.on&&C1.mode&&C1.mode!=='flat'))return true;
  const L=curL();return !!(C1.on&&C1.mode==='td'&&L&&YARDL.test(L.id))}
function inFlat(){return typeof scene!=='undefined'&&scene==='flat'&&!(C1.on&&C1.mode&&C1.mode!=='flat')}
function siege(){const L=curL();return !!(window.C9&&C9.on&&L&&/^y9/.test(L.id))}
const _m=music;
music=function(name){
  if(name==='flat'&&!inFlat()){if(inYard()&&!siege())name='intro';else return}
  return _m.apply(this,arguments)};
setInterval(()=>{try{if(typeof state!=='undefined'&&state!=='play')return;if(typeof cut!=='undefined'&&cut)return;
  if(inYard()&&!siege()&&musCur!=='intro'&&typeof MUS!=='undefined'&&MUS.intro)music('intro')}catch(e){}},500);
window.TW={inYard,inFlat};

const X=C1.X,PS=C1.PS;
const SVf=()=>{try{return UP.SV()}catch(e){return {}}};
const persist=()=>{try{UP.persist()}catch(e){}};
// ---------- подсказки при первом посещении ----------
const TXT={
  armory:'Оружейная. Вкладки сверху: ОРУЖИЕ — что берёшь с собой, БРОНЯ — что надеть, АПТЕЧКА — медицина, ВЕРСТАК — прокачка и крафт. A/D — вкладки, W/S — выбор, E — взять.',
  tab_wpn:'Три слота: одноручное дальнее, двуручное дальнее и холодное. Выбери ствол и нажми «Взять в слот». «???» — ещё не найдено.',
  tab_arm:'Надень броню: она забирает часть урона, пока не кончится прочность. Чинить — у Михалыча или на верстаке (Ремонт).',
  tab_med:'Аптечка: медицина, которую берёшь с собой. Шприц — H, зелье — J. Аптечка срабатывает сама, когда здоровья мало.',
  tab_bench:'Верстак: выбери раздел. Материалы — обычные, средние, редкие и легендарные — видны строкой сверху. Esc — назад.',
  bench_wpn:'Все стволы игры. Тёмные силуэты — ещё не найдены. Выбери найденный ствол: на каждом уровне выбираешь один из двух перков — A или B.',
  bench_cons:'Расходники открываются постепенно: собери простое — после следующей миссии откроется среднее, а за ним лучшее.',
  bench_arm:'Вся броня игры, ненайденная — силуэтом. Внутри: прокачка за кевлар и керамику и модули — 2 слота на надетой броне.',
  bench_rep:'Ремонт: залатать надетую броню или починить сломанное.',
  bench_uq:'Трофеи боссов: после каждого босса открывается уникальный рецепт с бонусом навсегда.',
  tab_shop:'Лавка Михалыча: патроны, медицина, ремонт брони, эксклюзивы. Патронов — три пачки за визит, шприцев — два. Чем больше тратишь, тем выше доверие и скидка.',
  tab_garage:'Гараж: прокачка Land Rover. Без большого бака до дальних вылазок не доехать.',
  tab_sm:'Зеркало: переодень Микроба и Шмакодявку. Новые шмотки находятся по главам.',tab_ss:'Зеркало: переодень Микроба и Шмакодявку. Новые шмотки находятся по главам.',
  tab_bag:'Рюкзак: всё, что у тебя с собой. Игра на паузе.',
  map:'Карта вылазок: доп. локации. Обязательные помечены, остальные — по желанию, за лут и рубли. После вылазки можно зайти домой и снова закупиться.',
  rev:'Возврат на места: пройденные локации глав. Зомби там уже нет — только трупы. Долутай пропущенные тайники, сейфы и находки.',
  leg:'Радар пищит и мигает жёлтым: где-то рядом легендарная находка. Чем ближе — тем чаще писк.'};
const TIPS={cur:null,t:0};window.TIPS=TIPS;
TIPS.show=function(k){const S=SVf();S.tips=S.tips||{};if(S.tips[k]||!TXT[k])return;S.tips[k]=1;persist();TIPS.cur=TXT[k];TIPS.t=0;TIPS.k=k};
function tipDraw(){if(!TIPS.cur)return;if((typeof dlg!=="undefined"&&dlg)||(typeof cut!=="undefined"&&cut))return;TIPS.t+=1/60;if(TIPS.t>9){TIPS.cur=null;return}
  const a=Math.min(1,TIPS.t*4,(9-TIPS.t)*2),w=196,x=(W-w)/2,y=H-44;u.save();u.globalAlpha=a;
  u.fillStyle='rgba(10,6,20,.94)';u.fillRect(x,y,w,30);u.fillStyle='#3ef0b0';u.fillRect(x,y,w,1.2);u.fillRect(x,y,1.2,30);
  uiFont(3.6,true);u.fillStyle='#3ef0b0';u.fillText('ПОДСКАЗКА',x+4,y+5.5);uiFont(3.8,false);u.fillStyle='#f0ecf8';
  const ws=TIPS.cur.split(' ');let line='',n=0;for(const wd of ws){const tt=line?line+' '+wd:wd;if(u.measureText(tt).width>w-8&&line){u.fillText(line,x+4,y+11+n*4.8);n++;line=wd}else line=tt}if(line)u.fillText(line,x+4,y+11+n*4.8);
  u.restore()}
function tipTick(){try{const ui=window.UP&&UP.ui;
  if(ui){if(ui.mode==='armory')TIPS.show('armory');else TIPS.show('tab_'+ui.tab);if(TIPS.k!=='armory'||TIPS.t>3)TIPS.show('tab_'+ui.tab);
    if(ui.tab==='bench'&&ui.bv&&ui.bv!=='home'&&ui.bv!=='wi'&&ui.bv!=='ai')TIPS.show('bench_'+ui.bv)}
  if(window.SORTIE&&SORTIE.isMap&&SORTIE.isMap())TIPS.show('map');
  if(!ui&&!(window.SORTIE&&SORTIE.isMap&&SORTIE.isMap())&&!REV.ui&&TIPS.k&&TIPS.k!=='leg'&&TIPS.t>.5)TIPS.cur=null}catch(e){}}
// ---------- легендарная находка рядом: радар мигает, писк ----------
let AC=null,beepT=0;
function beep(f){try{if(typeof muted!=='undefined'&&muted)return;AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
  const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=f;g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.001,t+.07);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.08)}catch(e){}}
function legNear(){const L=E&&E.L;if(!L||!L.its||!C1.on||C1.mode!=='td'||L.secret)return null;let best=null,bd=1e9;
  for(const it of L.its){if(!it._leg){let lb='';try{lb=it.label()}catch(e){}it._leg=lb==='Поднять: что-то тяжёлое'?1:2}if(it._leg!==1)continue;if(it.cond&&!it.cond())continue;const d=Math.hypot(it.x-pl.x,it.y-pl.y);if(d<bd){bd=d;best=it}}
  return best&&bd<130?bd:null}
let legD=null;
function legTick(dt){legD=null;if(typeof state!=='undefined'&&state!=='play')return;if(cut||dlg||(window.UP&&UP.ui))return;const d=legNear();if(d==null)return;legD=d;
  TIPS.show('leg');beepT-=dt;if(beepT<=0){beepT=.18+.9*(d/130);beep(1400+600*(1-d/130))}}
function legDraw(){if(legD==null)return;if(C1.radarOff>0||(window.MG&&MG.active))return;const RR=22,cx=RR+4,cy=RR+(C1.hudBot?C1.hudBot+4:48);
  const k=.5+.5*Math.sin(performance.now()/(60+legD*1.2));u.save();u.globalAlpha=.35+.55*k;u.strokeStyle='#ffd23a';u.lineWidth=1.6;u.beginPath();u.arc(cx,cy,RR+1.2,0,Math.PI*2);u.stroke();
  u.globalAlpha=.12+.18*k;u.fillStyle='#ffd23a';u.beginPath();u.arc(cx,cy,RR,0,Math.PI*2);u.fill();u.globalAlpha=.9;uiFont(3.4,true);u.fillStyle='#ffd23a';u.textAlign='center';u.fillText('★ РЯДОМ',cx,cy+RR+5);u.textAlign='left';u.restore()}
// ---------- лимиты лавки: после каждой вылазки — заново ----------
let soN=-1;function soCount(){const d=SVf().so&&SVf().so.done;let n=0;if(d)for(const k in d)n+=(d[k]|0);return n}
setInterval(()=>{try{const n=soCount();if(soN>=0&&n!==soN){const S=SVf();S.visA=0;S.visAm={};S.visS=0;UP._shopL=null;UP._shopS=null;persist()}soN=n}catch(e){}},700);
// ---------- возврат на пройденные места ----------
const REVL=[
  [1,'park','Гл.1 · Парковка у офисов'],[1,'off1','Гл.1 · Офис 1'],[1,'off2','Гл.1 · Офис 2'],
  [2,'mall1','Гл.2 · Сити Молл, 1 этаж'],[2,'mall2','Гл.2 · Сити Молл, фудкорт'],[2,'gym','Гл.2 · Фитнес-зал'],[2,'apple','Гл.2 · «Золотое яблоко»'],
  [3,'cellar','Гл.3 · Подвал дома'],[3,'tunnels','Гл.3 · Катакомбы'],
  [4,'flatb','Гл.4 · Квартира бати'],[4,'roof','Гл.4 · Крыша'],[4,'nevsky','Гл.4 · Невский'],[4,'club','Гл.4 · Клуб «Бардак»'],
  [5,'beach','Гл.5 · Пляж'],[5,'town','Гл.5 · Приморский городок'],[5,'colos','Гл.5 · Колизей'],[5,'alley','Гл.5 · Улочки и рынок'],[5,'sewer','Гл.5 · Канализация'],[5,'villa','Гл.5 · Вилла Олеси'],
  [6,'forest','Гл.6 · Лес'],[6,'street','Гл.6 · Коттеджная улица'],[6,'farm','Гл.6 · Ферма'],
  [7,'gymst','Гл.7 · Улица у зала Скалы'],[7,'top','Гл.7 · «Грибыч»: верхний этаж'],[7,'terrace','Гл.7 · Терраса'],[7,'cellar','Гл.7 · Подвал клуба'],[7,'main','Гл.7 · Танцпол'],
  [8,'sands8','Гл.8 · «Пески»']];
const chObj=n=>n===1?C1:window['C'+n];
function chDone(n){const S=SVf();if((S.maxCh|0)>n)return true;const o=chObj(n);return !!(o&&o.done)}
const REV={on:false,ui:null};window.REV=REV;
function revList(){return REVL.filter(r=>chDone(r[0])&&chObj(r[0])&&(r[0]===1||(chObj(r[0]).MENU||(chObj(r[0]).cfg&&chObj(r[0]).cfg.menu)||[]).some(m=>m[1]===r[1])))}
function revOpen(){const l=revList();if(!l.length){note('Пока нечего: пройди хотя бы одну главу.');return}REV.ui={sel:0,l};lockMove=true;C1.mdown=false;C1.fire=null;TIPS.show('rev');try{X.sfx('click')}catch(e){}}
function revClose(){REV.ui=null;lockMove=false}
const NUMK=['ammo','p50','shells','r762','r556','awp','cells','fuel','rockets','nlg','flr','bolt','pkm','sp6','vog','nails','ext','syr','pot','moon','beer'];
function snapFlags(){const r={};for(let n=1;n<=10;n++){const o=chObj(n);if(o)r[n]={on:o.on,sec:o.sec,done:o.done}}r.called=C1.called;r.mode=C1.mode;return r}
function restFlags(r){for(let n=1;n<=10;n++){const o=chObj(n);if(o&&r[n]){o.on=r[n].on;o.done=r[n].done;try{o.sec=r[n].sec}catch(e){}}}C1.called=r.called}
function revGo(r){REV.ui=null;const ps0=X.snap(),fl=snapFlags();REV.on=true;REV.ps0=ps0;REV.fl=fl;REV.seg=r;REV.ready=false;
  const [n,k]=r;try{if(n===1)C1.menuStart(k);else if(n<=4)chObj(n).menuStart(k);else chObj(n).cfg.go(k)}catch(e){console.warn('rev',e);REV.on=false;lockMove=false;return}
  REV.t0=performance.now()}
// после постройки: убрать зомби (оставить трупы), выключить сюжет, вернуть свой инвентарь
function revFix(){const L=E.L;if(!REV.on||REV.ready||!L||!L.zs||C1.mode!=='td')return;if(performance.now()-REV.t0<250)return;if(!L.hm&&performance.now()-REV.t0<1500)return;
  REV.ready=true;REV.L=L;
  try{timers.length=0}catch(e){}dlg=null;cut=null;
  X.restore(JSON.parse(JSON.stringify(REV.ps0)));PS.hp=PS.max;REV.base={};for(const k of NUMK)REV.base[k]=+PS[k]||0;
  for(const z of L.zs){if(z.dead||z.fake)continue;z.dead=true;corpse(L,z)}L.zs.length=0;
  for(let i=0;i<8;i++){const x=40+Math.random()*(L.w-80),y=40+Math.random()*(L.h-80);if(!E.solidAt(x,y,5))corpse(L,{x,y,type:'normal',v:(Math.random()*8)|0})}
  L.ally=null;L.onUpdate=null;L.noGrade=true;L.score=null;L.armed=true;L.arrows=0;C1.res=null;try{if(window.K56)K56.on=null}catch(e){}
  const KEEP=/^(Обыскать|Обшарить|Записка|Открыть сейф|Сейф|Служебная дверь|Спасти выжившего|Поднять|Взять|Подобрать|Забрать)/;
  L.its=L.its.filter(it=>{let lb='';try{lb=it.label()}catch(e){}return KEEP.test(lb)});
  const ex={x:pl.x,y:pl.y};L.its.push({x:ex.x,y:ex.y,r:16,label:()=>'Вернуться во двор',act:revBack});
  L.obj=()=>['Долутать пропущенное','Выход — там, где вошёл (E)'];
  try{music('menu')}catch(e){}note('Тут уже чисто. Ищи пропущенное: тайники, сейфы, находки.')}
function corpse(L,z){try{const g=L.dx;if(!g)return;const b=X.zBody(z.type==='boss'||z.type==='brute'?z.type:'normal',z.v|0);const S=b.width;g.save();g.translate(Math.round(z.x),Math.round(z.y));g.rotate(Math.random()*6.28);
  g.fillStyle='rgba(90,6,12,.55)';g.beginPath();g.ellipse(2,1,S*.42,S*.3,0,0,6.3);g.fill();g.globalAlpha=.85;g.drawImage(b,-S/2,-S/2);g.globalAlpha=1;g.restore()}catch(e){}}
function revBack(){if(!REV.on)return;const gain={};for(const k of NUMK)gain[k]=Math.max(0,(+PS[k]||0)-(REV.base[k]||0));
  X.restore(JSON.parse(JSON.stringify(REV.ps0)));for(const k in gain)if(gain[k]){if(k==='fuel')PS.fuel=Math.min(100,(PS.fuel||0)+gain[k]);else PS[k]=(PS[k]||0)+gain[k]}
  restFlags(REV.fl);REV.on=false;REV.L=null;persist();
  try{SORTIE.toHub()}catch(e){console.warn(e)}}
// второй стенд во дворе — рядом с картой вылазок
const _fh=C1.fortHook;
C1.fortHook=function(L,FORT,N){if(_fh)_fh.apply(this,arguments);try{const st=L.soStand;if(!st)return;const curCh=(window.ARS&&ARS.curCh)?ARS.curCh():1;if(curCh<2&&!chDone(1))return;
  const f=E.freeSpot(st.x+26,st.y,6,30)||[st.x+26,st.y];const p={x:f[0],y:f[1]};
  L.its.push({x:p.x,y:p.y,r:14,label:()=>'Стенд: вернуться на места (долутать)',act:revOpen});
  const du=L.drawUnder;L.drawUnder=()=>{if(du)du();const x=p.x,y=p.y;F(x-9,y-12,18,12,'#3a2a40');F(x-8,y-11,16,10,'#cfc6e0');for(let i=0;i<3;i++){F(x-6,y-9+i*3,8,1,'#5a4a6a');F(x+4,y-9+i*3,2,2,'#3ef0b0')}F(x-8,y,2,4,'#2a1a2a');F(x+6,y,2,4,'#2a1a2a');if(Math.sin(tm*4+1)>0)F(x-1,y-15,2,2,'#3ef0b0')}}catch(e){console.warn('rev stand',e)}};
function revDraw(){const R=REV.ui;if(!R)return;const w=170,h=Math.min(150,24+R.l.length*7.6),x=(W-w)/2,y=Math.max(6,(H-h)/2);
  u.fillStyle='rgba(8,6,14,.95)';u.fillRect(x,y,w,h);u.fillStyle='#3ef0b0';u.fillRect(x,y,w,1.5);uiFont(5.4,true);u.fillStyle='#3ef0b0';u.fillText('ВЕРНУТЬСЯ НА МЕСТА',x+5,y+9);
  uiFont(3.4,false);u.fillStyle='#9a92b0';u.fillText('Зомби нет — долутай пропущенное. W/S, E — идти, Esc — закрыть',x+5,y+15);
  const maxN=Math.floor((h-22)/7.6),sc=Math.max(0,Math.min(R.sel-maxN+1,R.l.length-maxN));R.hit=[];
  R.l.slice(sc,sc+maxN).forEach((r,i0)=>{const i=i0+sc,yy=y+20+i0*7.6,sel=i===R.sel;u.fillStyle=sel?'rgba(62,240,176,.22)':'rgba(255,255,255,.04)';u.fillRect(x+4,yy,w-8,6.6);
    uiFont(4,true);u.fillStyle=sel?'#3ef0b0':'#e8e4f0';u.fillText(r[2],x+7,yy+4.8);R.hit.push([x+4,yy,w-8,6.6,i])})}
(window.__pre=window.__pre||[]).unshift(function(e){const R=REV.ui;if(!R||state!=='play')return false;const t=e.type;
  if(t==='keydown'){const c=e.code;if(c==='Escape'){revClose();return true}if(c==='KeyW'||c==='ArrowUp'){R.sel=(R.sel-1+R.l.length)%R.l.length;return true}if(c==='KeyS'||c==='ArrowDown'){R.sel=(R.sel+1)%R.l.length;return true}
    if(c==='KeyE'||c==='Enter'||c==='Space'){const r=R.l[R.sel];lockMove=true;X.go(()=>{lockMove=false;revGo(r)});REV.ui=null;return true}return true}
  if(t==='mousedown'||t==='touchstart'){const p=toUI(e);if(!p)return true;const h=(R.hit||[]).find(b=>p.x>=b[0]&&p.x<=b[0]+b[2]&&p.y>=b[1]&&p.y<=b[1]+b[3]);
    if(h){if(R.sel===h[4]){const r=R.l[h[4]];REV.ui=null;lockMove=true;X.go(()=>{lockMove=false;revGo(r)})}else R.sel=h[4]}else revClose();return true}
  return t==='keyup'||t==='mouseup'||t==='touchend'||t==='touchmove'||t==='mousemove'?false:true});
function toUI(e){try{const t=e.changedTouches?e.changedTouches[0]:e;const r=(typeof ui!=='undefined'?ui:document.querySelector('canvas')).getBoundingClientRect();return {x:(t.clientX-r.left)/r.width*W,y:(t.clientY-r.top)/r.height*H}}catch(err){return null}}
setInterval(()=>{if(REV.ui&&(state!=='play'||!C1.on))revClose()},500);
// ---------- общий лимит: шприцы 10, самогон 10, зелья 5 (сейфы, тайники, награды — всё срезается до лимита) ----------
let capN=0;function capTick(){if(window.MIS&&MIS.on)return;const C=C1.CAPS||{syr:10,moon:10,pot:5},S=SVf();let cut0=null;
  for(const k in C){if((PS[k]|0)>C[k]){PS[k]=C[k];cut0=k}if(S&&(S[k]|0)>C[k])S[k]=C[k]}
  if(cut0&&performance.now()-capN>3000){capN=performance.now();const N={syr:'Шприцов',moon:'Самогона',pot:'Зелий'};try{note(N[cut0]+' максимум '+C[cut0]+' — лишнее не влезло')}catch(e){}}}
setInterval(()=>{try{capTick()}catch(e){}},250);
// ---------- общий тик/рендер ----------
const _u=update;update=function(dt){_u(dt);try{if((window.SORTIE&&SORTIE.isMap&&SORTIE.isMap())||REV.ui||(window.UP&&UP.ui))C1.radarOff=Math.max(C1.radarOff||0,.15);tipTick();legTick(dt);revFix()}catch(e){console.warn('tw',e)}};
const _r=render;render=function(){_r();try{const k=ui.width/W;u.save();u.setTransform(k,0,0,k,0,0);if(state==='play'){legDraw();revDraw();tipDraw()}u.restore()}catch(e){}};

})();
