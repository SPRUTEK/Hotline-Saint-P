// =====================================================================
//  СОХРАНЕНИЕ ПРОГРЕССА
//  · автосейв в начале каждого участка (там же, где контрольная точка хардкора — C1.retry);
//  · после конца главы — «Продолжить» начинает следующую главу;
//  · кнопка «ПРОДОЛЖИТЬ (C)» на титуле;
//  · код сохранения (скопировать / вставить) — на титуле и в паузе;
//  · «НОВАЯ ИГРА (N)» на титуле — сброс всех сохранений с двойным подтверждением;
//  · облако: личный документ игрока в базе артефакта (если доступна).
// =====================================================================
(function(){
const SK='pp_save1',TK='pp_t',KEYS=['pp_up1','pp_save1','grades','cols','legs','kills_total','pp_sosedi','snd_off','pp_t'];
const LS={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v);return true}catch(e){return false}}};
const X=C1.X,PS=C1.PS;
let SAVE=null;try{SAVE=JSON.parse(LS.get(SK)||'null')}catch(e){}
const SV_={on:true};window.SAVEP=SV_;
const START={2:'talk',3:'feed',4:'call4',5:'call5',6:'call6',7:'call7',8:'call8',9:'call9',10:'call10'};
const chObj=n=>n===1?C1:window['C'+n];
function chNow(){for(const n of [10,9,8,7,6,5,4,3,2]){const o=window['C'+n];if(o&&o.on)return n}return 1}
function menuOf(n){const o=chObj(n);if(!o)return null;if(n===1)return X.MENU;return o.MENU||(o.cfg&&o.cfg.menu)||null}
function secName(n,k){const m=menuOf(n);const r=m&&m.find(x=>x[1]===k);return r?r[0]:''}
function flagsOf(n){const o=chObj(n);try{if(n===2)return {food:o.food,cosm:o.cosm,tf:o.tf};if(n===3)return {buff:o.buff};if(o.flags)return JSON.parse(JSON.stringify(o.flags))}catch(e){}return null}
function applyFlags(n,f){if(!f)return;const o=chObj(n);if(n===2||n===3)Object.assign(o,f);else if(o.flags)Object.assign(o.flags,f)}
function stamp(){LS.set(TK,String(Date.now()))}
function write(){LS.set(SK,JSON.stringify(SAVE));stamp();cloudPush()}
// ---------- автосейв: перехват C1.retry ----------
let quiet=false,force=false,_r=C1.retry;
Object.defineProperty(C1,'retry',{configurable:true,get(){return _r},set(f){_r=f;if(f&&!quiet)try{auto()}catch(e){console.warn(e)}}});
function auto(){
  if(window.SNP&&SNP.on)return;
  // 04.11: двор-хаб, вылазки, возврат на места и «Миссии» — не точка сюжета: раньше хаб записывал «Глава 1 · двор» поверх пройденных глав
  if(window.CS&&(CS.on||CS.hub))return;if(window.REV&&REV.on)return;if(window.MIS&&MIS.on)return;
  if(window.REV&&REV.on)return; // 04.11: возврат на пройденные места не трогает сохранение
  const ch=chNow(),o=chObj(ch);if(!o)return;const n=o.sec;if(!n||typeof n!=='string')return;
  if(!force&&SAVE&&!SAVE.done&&SAVE.ch===ch&&SAVE.n===n)return; // повтор того же участка — не перезаписываем
  if(!force&&SAVE&&ch<SAVE.ch)return; // сохранение никогда не откатывается на более раннюю главу
  force=false;
  SAVE={v:1,ch,n,ps:JSON.parse(JSON.stringify(PS)),fl:flagsOf(ch),hard:!!C1.hard,t:Date.now(),done:false};
  write();
}
// конец главы: следующий запуск начнёт новую главу
let doneChk=0;
function checkDone(dt){doneChk-=dt;if(doneChk>0||!SAVE||SAVE.done)return;doneChk=.5;const o=chObj(SAVE.ch);if(o&&o.done&&state==='play'){SAVE.done=true;SAVE.t=Date.now();write();try{addSlot('chapter','Глава '+SAVE.ch+' пройдена')}catch(e){}}}
// ---------- продолжить ----------
function startAt(ch,n){
  if(ch===1)C1.menuStart(n);
  else if(ch<=4)chObj(ch).menuStart(n);
  else chObj(ch).cfg.go(n);
}
function resume(){
  const s=SAVE;if(!s)return;try{ac()}catch(e){}
  for(const o of [C1,window.C2,window.C3,window.C4,window.C5,window.C6,window.C7,window.C8,window.C9,window.C10])if(o)o.menu=null;C1.gal=null;
  if(s.done){const nx=s.ch+1;if(START[nx]&&chObj(nx)){quiet=false;startAt(nx,START[nx]);return}}
  quiet=true;try{startAt(s.ch,s.n)}finally{quiet=false}
  if(s.ps){X.restore(JSON.parse(JSON.stringify(s.ps)));applyFlags(s.ch,s.fl);force=true;const o=chObj(s.ch);(o.go||C1.go)(s.n)}
}
SV_.resume=resume;SV_.get=()=>SAVE;
function label(){if(!SAVE)return '';const s=SAVE;if(s.done)return START[s.ch+1]&&chObj(s.ch+1)?'Начало главы '+(s.ch+1):'Глава '+s.ch+' пройдена';const nm=secName(s.ch,s.n);return 'Глава '+s.ch+(nm?' · '+nm:'')}
// ---------- код сохранения ----------
function makeCode(){const o={};for(const k of KEYS){const v=LS.get(k);if(v!=null)o[k]=v}const j=JSON.stringify({zp:1,d:o});return 'ZP1-'+btoa(unescape(encodeURIComponent(j)))}
function readCode(c){c=(c||'').replace(/\s+/g,'');if(c.startsWith('ZP1-'))c=c.slice(4);const o=JSON.parse(decodeURIComponent(escape(atob(c))));if(!o||o.zp!==1||!o.d)throw 0;return o.d}
function applyData(d){for(const k of KEYS)if(k in d)LS.set(k,d[k])}
// ---------- облако ----------
let ref=null,busy=false,again=false;
function cloudPush(){if(!ref)return;if(busy){again=true;return}busy=true;const t=+LS.get(TK)||Date.now();
  ref.set({code:makeCode(),t}).catch(e=>console.warn('cloud',e&&e.code)).finally(()=>{busy=false;if(again){again=false;cloudPush()}})}
SV_.push=()=>{stamp();cloudPush()};
(async()=>{try{
  for(let i=0;i<40&&!(window.claude&&claude.use);i++)await new Promise(r=>setTimeout(r,250));
  if(!(window.claude&&claude.use))return;
  const db=await claude.use('db'),us=await claude.use('user');if(!db||!us)return;
  const id=await us.id();if(!id)return;
  const r=db.doc('data/users/'+id+'/save');const s=await r.get();ref=r;SV_.cloud=true;
  const lt=+LS.get(TK)||0;
  if(s.exists){const d=s.data()||{};if((d.t||0)>lt&&d.code){
    if(state==='title'&&!SAVE_SEEN()){applyData(readCode(d.code));LS.set(TK,String(d.t));(window.__leaving=1,location.reload());return}
  }else if(lt>(d.t||0))cloudPush()}
  else if(lt)cloudPush();
}catch(e){console.warn('cloud save off',e)}})();
let started=false;const SAVE_SEEN=()=>started; // если игрок уже начал играть — облако не трогаем
// уход со страницы / сворачивание — досохранить
document.addEventListener('visibilitychange',()=>{if(document.hidden){try{if(window.UP&&UP.store)UP.store()}catch(e){}stamp();cloudPush()}});
// ---------- окно кода (HTML поверх игры: поле ввода работает и на телефоне) ----------
let box=null;
function openBox(){
  if(box)return;try{if(window.UP&&UP.store)UP.store()}catch(e){}stamp();
  box=document.createElement('div');box.id='savebox';
  box.style.cssText='position:fixed;inset:0;z-index:99;background:rgba(8,5,16,.92);display:flex;align-items:center;justify-content:center;font:15px "Trebuchet MS",Verdana,sans-serif;color:#fff';
  box.innerHTML='<div style="width:min(92vw,560px);background:#1a1228;border:2px solid #ffd23a;border-radius:8px;padding:16px;box-sizing:border-box">'+
    '<div style="font-weight:bold;font-size:18px;color:#ffd23a;margin-bottom:6px">Код сохранения</div>'+
    '<div style="color:#bdb4d4;font-size:13px;margin-bottom:8px">Игра и так сохраняется сама в начале каждого участка'+(SV_.cloud?' и в твоём аккаунте Claude':' в этом браузере')+'. Код нужен на всякий случай: скопируй его и сохрани в заметках. Чтобы восстановить игру, вставь код сюда и нажми «Загрузить».</div>'+
    '<textarea id="savecode" spellcheck="false" style="width:100%;height:110px;box-sizing:border-box;background:#0c0814;color:#5ae87a;border:1px solid #6a5a8a;border-radius:4px;font:11px monospace;padding:6px;resize:none;word-break:break-all"></textarea>'+
    '<div id="savemsg" style="min-height:18px;font-size:13px;color:#ffd23a;margin:6px 0"></div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
    '<button data-a="copy">Скопировать</button><button data-a="load">Загрузить код</button><button data-a="close">Закрыть</button></div></div>';
  document.body.appendChild(box);
  for(const b of box.querySelectorAll('button'))b.style.cssText='flex:1;min-width:120px;padding:10px;font:bold 14px "Trebuchet MS",Verdana,sans-serif;border:0;border-radius:4px;cursor:pointer;background:'+(b.dataset.a==='load'?'#3ef0b0':b.dataset.a==='copy'?'#ffd23a':'#4a3a64')+';color:'+(b.dataset.a==='close'?'#fff':'#120a1c');
  const ta=box.querySelector('#savecode'),msg=box.querySelector('#savemsg');ta.value=makeCode();
  box.addEventListener('click',async e=>{const a=e.target&&e.target.dataset&&e.target.dataset.a;if(!a)return;
    if(a==='close'){closeBox();return}
    if(a==='copy'){const c=makeCode();ta.value=c;let ok=false;try{await navigator.clipboard.writeText(c);ok=true}catch(err){}
      if(!ok){try{ta.focus();ta.select();ok=document.execCommand('copy')}catch(err){}}
      msg.style.color=ok?'#5ae87a':'#ffd23a';msg.textContent=ok?'Скопировано! Сохрани код в заметках.':'Не получилось скопировать само: выдели текст в поле и скопируй вручную.';return}
    if(a==='load'){let d;try{d=readCode(ta.value)}catch(err){msg.style.color='#ff7a7a';msg.textContent='Это не похоже на код сохранения. Проверь, что он вставлен целиком.';return}
      applyData(d);stamp();msg.style.color='#5ae87a';msg.textContent='Загружено! Перезапускаю игру…';
      const go=()=>{try{location.hash=''}catch(err){}(window.__leaving=1,location.reload())};if(ref){busy=false;again=false;cloudPush();setTimeout(go,900)}else setTimeout(go,400)}
  });
}
function closeBox(){if(box){box.remove();box=null}}
// ---------- новая игра: сброс всех сохранений ----------
function resetAll(){
  // 06.11: настройки (звук, экран, клавиши) при сбросе прогресса не трогаем
  const KEEP=['snd_off','pp_vol','pp_set','pp_keys'];
  try{const ks=[];for(let i=0;i<localStorage.length;i++)ks.push(localStorage.key(i));for(const k of ks)if(!KEEP.includes(k))localStorage.removeItem(k)}catch(e){}
  SAVE=null;
  // до перезагрузки старые данные из памяти не должны записаться обратно
  try{const si=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(KEEP.includes(k))return si.call(this,k,v)}}catch(e){}
  // облако (если подключено) тоже обнуляем, чтобы старый прогресс не вернулся
  if(ref){busy=false;again=false;try{ref.set({code:makeCode(),t:Date.now()})}catch(e){}}
}
function openNew(){
  if(box)return;
  box=document.createElement('div');box.id='savebox';
  box.style.cssText='position:fixed;inset:0;z-index:99;background:rgba(8,5,16,.92);display:flex;align-items:center;justify-content:center;font:15px "Trebuchet MS",Verdana,sans-serif;color:#fff';
  box.innerHTML='<div style="width:min(92vw,520px);background:#1a1228;border:2px solid #ff5a7a;border-radius:8px;padding:16px;box-sizing:border-box">'+
    '<div style="font-weight:bold;font-size:18px;color:#ff7a9a;margin-bottom:8px">⚠ Новая игра</div>'+
    '<div style="color:#e4dcf4;font-size:14px;line-height:1.45;margin-bottom:8px">Весь прогресс будет удалён без возврата:</div>'+
    '<ul style="color:#bdb4d4;font-size:13px;line-height:1.5;margin:0 0 10px 18px;padding:0">'+
    '<li>сохранение и кнопка «Продолжить»</li><li>оружейная, оружие, патроны, броня и аптечка</li><li>рубли, покупки у Михалыча, скины у зеркала</li><li>коллекция, фотокарточки, оценки за участки</li></ul>'+
    '<div style="color:#bdb4d4;font-size:13px;margin-bottom:10px">Если захочешь потом вернуться к этому прохождению, сначала нажми «Скопировать код» и сохрани его в заметках.</div>'+
    '<div id="newmsg" style="min-height:18px;font-size:13px;color:#ffd23a;margin:4px 0 8px"></div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
    '<button data-a="code">Скопировать код</button><button data-a="reset">Начать заново</button><button data-a="close">Отмена</button></div></div>';
  document.body.appendChild(box);
  const st={code:['#ffd23a','#120a1c'],reset:['#ff5a7a','#120a1c'],close:['#4a3a64','#fff']};
  for(const b of box.querySelectorAll('button')){const c=st[b.dataset.a];b.style.cssText='flex:1;min-width:130px;padding:10px;font:bold 14px "Trebuchet MS",Verdana,sans-serif;border:0;border-radius:4px;cursor:pointer;background:'+c[0]+';color:'+c[1]}
  const msg=box.querySelector('#newmsg');let armed=false;
  box.addEventListener('click',async e=>{const a=e.target&&e.target.dataset&&e.target.dataset.a;if(!a)return;
    if(a==='close'){closeBox();return}
    if(a==='code'){const c=makeCode();let ok=false;try{await navigator.clipboard.writeText(c);ok=true}catch(err){}
      msg.style.color=ok?'#5ae87a':'#ffd23a';msg.textContent=ok?'Код скопирован. Сохрани его в заметках.':'Не получилось скопировать: открой «Код сохранения» на титуле и скопируй вручную.';return}
    if(a==='reset'){
      if(!armed){armed=true;e.target.textContent='Да, удалить всё';e.target.style.background='#e8202a';e.target.style.color='#fff';msg.style.color='#ff9aaa';msg.textContent='Нажми ещё раз, чтобы подтвердить.';return}
      resetAll();msg.style.color='#5ae87a';msg.textContent='Прогресс сброшен. Перезапускаю игру…';
      setTimeout(()=>{try{location.hash=''}catch(err){}(window.__leaving=1,location.reload())},600)}
  });
}
SV_.openNew=openNew;
SV_.openBox=openBox;
// ввод: пока открыто окно кода — игра не получает событий, а поле ввода работает
(window.__pre=window.__pre||[]).unshift(function(e){
  if(!box&&e.type==='keydown'&&e.code==='F5'&&state==='play'){if(!e.repeat)quick();return true}
  if(box){if(e.type==='keydown'&&e.code==='Escape'){closeBox();return true}return 'own'}
  if(state!=='title'||others())return false;
  if(e.type==='keydown'&&!e.repeat){if(e.code==='KeyC'&&SAVE){started=true;resume();return true}if(e.code==='KeyN'){openNew();return true}return false}
  if(e.type==='mousedown'||e.type==='touchstart'){const t=e.changedTouches?e.changedTouches[0]:e;if(!t)return false;const p={x:(t.clientX-OX)/SC,y:(t.clientY-OY)/SC};
    if(SAVE&&inB(p,CB)){if(e.changedTouches){touch.on=true;mouse.on=false}started=true;resume();return true}
    if(inB(p,KB)){if(e.changedTouches){touch.on=true;mouse.on=false}openBox();return true}
    if(inB(p,NB)){if(e.changedTouches){touch.on=true;mouse.on=false}openNew();return true}}
  return false;
});
const inB=(p,b)=>p.x>=b.x-2&&p.x<=b.x+b.w+2&&p.y>=b.y-2&&p.y<=b.y+b.h+2;
const CB={x:4,y:4,w:76,h:13},NB={x:4,y:20,w:70,h:10},KB={x:4,y:33,w:70,h:10};
function others(){return C1.menu||C1.gal||[window.C2,window.C3,window.C4,window.C5,window.C6,window.C7,window.C8].some(o=>o&&o.menu)}

// ---------- 04.11: ячейки сохранений (до 10): после каждой главы + быстрое сохранение F5 / из паузы ----------
const SLK='pp_slots',MAXS=10;
function slots(){try{return JSON.parse(LS.get(SLK)||'[]')||[]}catch(e){return []}}
function putSlots(a){while(a.length){try{localStorage.setItem(SLK,JSON.stringify(a));return true}catch(e){a.pop()}}try{localStorage.removeItem(SLK)}catch(e){}return false}
function snapData(){try{if(window.UP&&UP.store)UP.store()}catch(e){}const o={};for(const k of KEYS){const v=LS.get(k);if(v!=null)o[k]=v}return o}
function addSlot(kind,lb){if(!SAVE)return false;const a=slots();
  if(kind==='chapter'&&a.some(x=>x.kind==='chapter'&&x.lb===lb&&Date.now()-x.t<60000))return false;
  a.unshift({t:Date.now(),kind,lb:lb||label(),d:snapData()});if(a.length>MAXS)a.length=MAXS;return putSlots(a)}
function quick(){if(state!=='play'||(window.MIS&&MIS.on)){try{note('Здесь сохранить нельзя')}catch(e){}return}
  if(!SAVE){try{note('Сохранять пока нечего: начни участок')}catch(e){}return}
  const ok=addSlot('quick',label());try{X.sfx('coin')}catch(e){}try{note(ok?'Сохранено в ячейку: '+label():'Не хватило места для сохранения')}catch(e){}}
SV_.quick=quick;SV_.slots=slots;SV_.addSlot=addSlot;
// первая загрузка с новой версией: текущее сохранение кладём в ячейку, чтобы было куда откатиться
if(SAVE&&!slots().length)try{addSlot('auto','Сохранение до обновления · '+label())}catch(e){}
// загрузка ячейки: подменяем данные, перезапуск, затем сразу «Продолжить»
function loadSlot(i){const s=slots()[i];if(!s)return;applyData(s.d);stamp();try{sessionStorage.setItem('pp_resume','1')}catch(e){}
  const go=()=>{try{location.hash=''}catch(err){}(window.__leaving=1,location.reload())};if(ref){busy=false;again=false;cloudPush();setTimeout(go,900)}else setTimeout(go,300)}
try{if(sessionStorage.getItem('pp_resume')==='1'){sessionStorage.removeItem('pp_resume');let n=0;const iv=setInterval(()=>{n++;
  if(n>80){clearInterval(iv);return}if(typeof state!=='undefined'&&state==='title'&&SAVE){clearInterval(iv);started=true;try{resume()}catch(e){console.warn(e)}}},150)}}catch(e){}
const KIND={chapter:['ГЛАВА','#3ef0b0'],quick:['РУЧНОЕ','#ffd23a'],auto:['АВТО','#9ab4ff']};
function fmtT(t){const d=new Date(t),z=n=>String(n).padStart(2,'0');return z(d.getDate())+'.'+z(d.getMonth()+1)+' '+z(d.getHours())+':'+z(d.getMinutes())}
function openSlots(){
  if(box)return;
  box=document.createElement('div');box.id='savebox';
  box.style.cssText='position:fixed;inset:0;z-index:99;background:rgba(8,5,16,.92);display:flex;align-items:center;justify-content:center;font:15px "Trebuchet MS",Verdana,sans-serif;color:#fff';
  const draw=()=>{const a=slots(),canSave=state==='play'&&!!SAVE&&!(window.MIS&&MIS.on);
    let rows='';a.forEach((s,i)=>{const k=KIND[s.kind]||KIND.auto;rows+='<div style="display:flex;align-items:center;gap:8px;padding:8px;border-bottom:1px solid #3a2e52">'+
      '<div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:bold;color:'+k[1]+'">'+k[0]+' · '+fmtT(s.t)+'</div><div style="font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+String(s.lb).replace(/</g,'&lt;')+'</div></div>'+
      '<button data-a="load" data-i="'+i+'">Загрузить</button><button data-a="del" data-i="'+i+'">✕</button></div>'});
    if(!a.length)rows='<div style="color:#bdb4d4;padding:14px 4px">Пока пусто. Сохранения появляются после каждой пройденной главы, а ещё можно сохраниться вручную: F5 или кнопка ниже.</div>';
    box.innerHTML='<div style="width:min(94vw,600px);max-height:92vh;display:flex;flex-direction:column;background:#1a1228;border:2px solid #3ef0b0;border-radius:8px;padding:14px;box-sizing:border-box">'+
      '<div style="font-weight:bold;font-size:18px;color:#3ef0b0;margin-bottom:4px">Сохранения</div>'+
      '<div style="color:#bdb4d4;font-size:12px;margin-bottom:8px">До 10 ячеек: после каждой главы и ручные (F5). Загрузка начинает с начала сохранённого участка. Самые старые ячейки уходят, когда места нет.</div>'+
      '<div style="overflow:auto;flex:1;border:1px solid #3a2e52;border-radius:4px">'+rows+'</div>'+
      '<div id="slmsg" style="min-height:18px;font-size:13px;color:#ffd23a;margin:6px 0"></div>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap">'+(canSave?'<button data-a="save">Сохранить сейчас</button>':'')+'<button data-a="close">Закрыть</button></div></div>';
    for(const b of box.querySelectorAll('button')){const a2=b.dataset.a;b.style.cssText='padding:9px 12px;font:bold 13px "Trebuchet MS",Verdana,sans-serif;border:0;border-radius:4px;cursor:pointer;'+
      (a2==='load'?'background:#3ef0b0;color:#120a1c':a2==='del'?'background:#4a3a64;color:#fff;padding:9px 10px':a2==='save'?'flex:1;background:#ffd23a;color:#120a1c':'flex:1;background:#4a3a64;color:#fff')}};
  document.body.appendChild(box);draw();let armed=-1;
  box.addEventListener('click',e=>{const t=e.target,a=t&&t.dataset&&t.dataset.a;if(!a)return;const i=+t.dataset.i,msg=box.querySelector('#slmsg');
    if(a==='close'){closeBox();return}
    if(a==='save'){const ok=addSlot('quick',label());draw();box.querySelector('#slmsg').textContent=ok?'Сохранено!':'Не хватило места';return}
    if(a==='del'){const s=slots();s.splice(i,1);putSlots(s);armed=-1;draw();return}
    if(a==='load'){if(armed!==i&&state==='play'){armed=i;t.textContent='Точно?';t.style.background='#ff5a7a';msg.textContent='Текущий непройденный участок пропадёт. Нажми ещё раз.';return}
      msg.style.color='#5ae87a';msg.textContent='Загружаю…';loadSlot(i)}});
}
SV_.openSlots=openSlots;
// случайный выход: браузер переспросит, а прогресс досохранится
addEventListener('beforeunload',e=>{try{if(window.UP&&UP.store)UP.store()}catch(err){}stamp();if(!window.__leaving&&state==='play'&&C1.on&&!box&&!(window.MIS&&MIS.on)){e.preventDefault();e.returnValue='';return ''}});
// ---------- титул ----------
const _rt=renderTitle;
renderTitle=function(){_rt();if(others()||box)return;
  if(SAVE){const b=CB;u.fillStyle='rgba(62,240,176,'+(.8+.2*Math.sin(tm*3))+')';u.fillRect(b.x,b.y,b.w,b.h);u.fillStyle='#120a1c';uiFont(5,true);u.textAlign='center';u.fillText('▶ ПРОДОЛЖИТЬ'+(touch.on?'':' (C)'),b.x+b.w/2,b.y+8.8);
    uiFont(4,false);u.textAlign='left';u.fillStyle='#bdf5e0';u.fillText(label(),b.x+1,KB.y+KB.h+6)}
  {const n=NB;u.fillStyle='rgba(255,90,122,.75)';u.fillRect(n.x,n.y,n.w,n.h);u.fillStyle='#fff';uiFont(4.4,true);u.textAlign='center';u.fillText('НОВАЯ ИГРА'+(touch.on?'':' (N)'),n.x+n.w/2,n.y+6.8);u.textAlign='left'}
  const k=KB;u.fillStyle='rgba(255,255,255,.14)';u.fillRect(k.x,k.y,k.w,k.h);u.fillStyle='#fff';uiFont(4.4,true);u.textAlign='center';u.fillText('КОД СОХРАНЕНИЯ',k.x+k.w/2,k.y+6.8);u.textAlign='left'};
// ---------- цикл ----------
const _up=update;update=function(dt){_up(dt);if(state==='play'){started=true;checkDone(dt)}};
})();
