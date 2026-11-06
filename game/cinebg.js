// cinebg.js — фоны кинокатсцен, часть 1: небо, Петербург, улица, двор, набережная, огонь и дым (640×360)
(function(){
'use strict';
const C=window.CINE,M=window.MART;if(!C||!M)return;
const {AW,AH,R,P,dith,skyBands,glow,cone,txt,txtW,neonTxt,hash,mix,lit,drk,layer}=C;const TAU=Math.PI*2;
const G=()=>C.g;
// ---------- небо ----------
const SKY={
  eve:[[0,'#160a36'],[50,'#2e1058'],[100,'#6a1a76'],[145,'#c2337a'],[180,'#ff6a5a'],[205,'#ffa860'],[230,'#ffd090']],
  night:[[0,'#04020c'],[70,'#0e0828'],[140,'#22104a'],[200,'#3a1658'],[240,'#5a1a62']],
  fire:[[0,'#0a0206'],[60,'#22060e'],[120,'#4a0c14'],[170,'#8a1e16'],[210,'#d24a18'],[240,'#ff8a2a']],
  dawn:[[0,'#24206a'],[60,'#5a3a92'],[120,'#c86a9a'],[170,'#ffa888'],[210,'#ffe0a8'],[240,'#fff6d8']],
  day:[[0,'#1a4ab8'],[90,'#3a8ae8'],[170,'#7ac4ff'],[230,'#c8ecff'],[260,'#eafaff']],
  italy:[[0,'#2a6ad8'],[90,'#4aa0f0'],[170,'#9ad8ff'],[220,'#ffe8c0'],[260,'#fff4d8']],
  storm:[[0,'#0a0a14'],[100,'#1a1a2e'],[200,'#2a2440'],[260,'#3a2a4a']],
  ural:[[0,'#1a2a6a'],[90,'#4a6ac8'],[170,'#a8b8f0'],[230,'#ffd8b0'],[260,'#ffe8c8']]};
function sky(kind,t,o){o=o||{};const k=kind||'eve';C.g.drawImage(layer('sky:'+k,AW,AH,()=>{const st=SKY[k];skyBands(st.concat([[AH,st[st.length-1][1]]]));
    if(k==='night'||k==='storm'){for(let i=0;i<160;i++){const x=hash(i,5)*AW,y=hash(5,i)*200;P(x,y,hash(i,7)<.3?'#ffb8e8':'#c8c0ff')}}}),0,0);
  if(k==='night'&&o.moon!==false){const mx=o.mx||520,my=o.my||62;glow(mx,my,60,'#ff8ad8',.25);M.use(C.g,()=>M.E(mx,my,13,13,'#ffe8f8'));M.use(C.g,()=>M.E(mx+5,my-3,11,11,'#e8c8f0'));}
  if(k==='night'||k==='storm')for(let i=0;i<20;i++){const x=hash(i,11)*AW,y=hash(11,i)*180,tw=Math.sin(t*3+i*2);if(tw>.6)P(x,y,'#ffffff')}
  if(k==='eve'||k==='dawn'){const sx=o.sx||470,sy=o.sy||(k==='eve'?218:200);glow(sx,sy,110,k==='eve'?'#ff7a4a':'#ffd88a',.45);
    if(o.sun!==false)for(let j=-18;j<=0;j++){const w=Math.sqrt(18*18-j*j);R(sx-w,sy+j,w*2,1,j>-5?'#fff4c8':'#ffd88a')}}
  if(o.clouds!==false&&k!=='night'){const cc=k==='eve'?['#5a1a6a','#ff6a7a']:k==='dawn'?['#8a5aa8','#ffc0a8']:k==='fire'?['#2a0a10','#6a1a1a']:['#ffffff','#e0f0ff'];
    for(let i=0;i<7;i++){const x=((hash(i,4)*AW*1.4+t*(2+i*.4))%(AW+160))-120,y=40+hash(4,i)*130,w=60+hash(i,9)*90,c=y<110?cc[0]:cc[1];R(x,y,w,2,c);R(x+6,y-1,w-14,1,c);R(x+w*.3,y+2,w*.5,1,drk(c,.2))}}
  if(k==='day'||k==='italy'||k==='ural')for(let i=0;i<6;i++){const x=((hash(i,14)*AW*1.3+t*(3+i))%(AW+200))-100,y=30+hash(14,i)*90;puff(x,y,40+hash(i,2)*50)}}
function puff(x,y,w){const c='#ffffff',s='#d8e8f8';for(let i=0;i<w;i+=8){const h=6+Math.sin(i*.2+x)*4+hash(i,x|0)*5;M.use(C.g,()=>M.E(x+i,y-h*.4,7,h*.6,c))}R(x-4,y,w+8,5,s);R(x,y-2,w,3,c)}
// ---------- дальний город (силуэты: Исаакий, Адмиралтейство, Лахта) ----------
function farCity(base,col,o){o=o||{};const key='far:'+base+col+(o.fire?1:0)+(o.isaak!==false?1:0);
  C.g.drawImage(layer(key,AW,AH,()=>{M.use(C.g,()=>M.skyline(base,o.seed||3,col,24,70,o.fire?0:.06,0));
    if(o.isaak!==false){const ix=o.ix||170;R(ix-40,base-60,80,60,col);R(ix-30,base-76,60,16,col);M.use(C.g,()=>M.E(ix,base-84,22,22,col));R(ix-2,base-118,4,14,col);R(ix-5,base-106,10,3,col);
      for(const dx of [-36,36]){R(ix+dx-5,base-74,10,14,col);M.use(C.g,()=>M.E(ix+dx,base-76,5,6,col))}
      if(!o.fire)R(ix-20,base-90,40,1,lit(col,.25))}
    if(o.adm){const ax=o.adm;R(ax-14,base-44,28,44,col);R(ax-6,base-60,12,16,col);for(let y=base-60;y>base-110;y--)R(ax-((base-60-y)<30?1:0),y,(base-60-y)<30?3:1,1,o.fire?col:'#c89a3a')}
    if(o.lakhta)M.use(C.g,()=>M.lakhta(o.lakhta,base,base-150,0))}),0,0)}
// ---------- петербургские фасады ----------
const FAC=['#e8c870','#7ac8b0','#e89aa8','#8ab0d8','#d8a878','#b8b0c8','#c8d880','#f0b880'];
const SIGNS=['ШАВЕРМА','АПТЕКА','ПЫШКИ','КОФЕ','ПРОДУКТЫ','ЦВЕТЫ','БАР','24','КНИГИ','ПИВО','ОПТИКА','РОЛЛЫ'];
const SCOL=['#ff4fd8','#3affd8','#ffe23a','#ff6a3a','#7a8aff','#5aff7a'];
// одна полоса домов шириной LW, кешируется; o: night, ruin, seed, h0..h1, base (низ)
function facadeStrip(o){const key='fac:'+JSON.stringify(o);const LW=o.lw||1280,base=o.base||290;
  return layer(key,LW,AH,()=>{let x=0,i=0;while(x<LW){const s=o.seed*31+i,w=Math.round(86+hash(s,1)*70),h=Math.round((o.h0||120)+hash(1,s)*((o.h1||175)-(o.h0||120)));
    const top=base-h;let col=FAC[Math.floor(hash(s,2)*FAC.length)];if(o.night)col=mix(col,'#2a1a4a',.55);if(o.ruin)col=mix(col,'#2a1418',.6);
    const dk=drk(col,.25),lt=lit(col,.2);R(x,top,w,h,col);dith(x,top,w,h,dk,.1);
    // крыша
    R(x-2,top-4,w+4,4,drk(col,.45));R(x-2,top-4,w+4,1,lit(col,.1));const rf=o.ruin?'#1a1014':'#4a5060';
    if(!o.ruin||hash(s,8)<.5){R(x,top-14,w,10,rf);for(let k=0;k<w;k+=6)R(x+k,top-14,1,10,drk(rf,.3));R(x,top-14,w,1,lit(rf,.25))}
    else{for(let k=0;k<w;k+=4){const hh=Math.round(hash(k,s)*16);R(x+k,top-hh,4,hh,'#140a0c')}}
    if(hash(s,3)<.6){R(x+w*.2,top-24,6,12,drk(col,.4));R(x+w*.2-1,top-25,8,2,'#2a2028')}
    if(hash(s,4)<.5){const ax=x+w*.7;R(ax,top-34,1,22,'#2a2a34');R(ax-6,top-30,12,1,'#2a2a34');R(ax-4,top-26,8,1,'#2a2a34')}
    // этажи
    const fl=Math.max(3,Math.floor((h-30)/26)),ww=9,wh=14,cols=Math.max(2,Math.floor((w-16)/18));
    for(let f=0;f<fl;f++){const fy=top+8+f*26;R(x,fy+wh+5,w,2,lt);R(x,fy+wh+7,w,1,dk);
      for(let c=0;c<cols;c++){const wx=x+10+c*((w-20)/cols)+((w-20)/cols-ww)/2;const v=hash(s*7+c,f+3);
        let wc=o.night?(v<.45?'#ffd27a':v<.55?'#ff9ad8':v<.62?'#7ae8ff':'#141028'):(v<.25?'#ffe8b0':'#2a3a5a');
        if(o.ruin)wc=v<.18?'#ff7a20':v<.3?'#3a1010':'#0e0a0c';
        R(wx-1,fy-1,ww+2,wh+2,lit(col,.35));R(wx,fy,ww,wh,wc);if(!o.ruin&&wc!=='#141028'&&wc!=='#2a3a5a'){R(wx,fy,ww,2,lit(wc,.3));R(wx+ww/2,fy,1,wh,drk(wc,.3))}
        else{R(wx+ww/2,fy,1,wh,drk(col,.3));R(wx,fy+5,ww,1,drk(col,.3))}
        R(wx-2,fy+wh+1,ww+4,2,lt);
        if(f===1&&hash(s,c+5)<.35)R(wx-1,fy-6,ww+2,4,lt),R(wx+2,fy-8,ww-4,2,lt);// сандрик
        if(o.ruin&&v<.3){dith(Math.round(wx-2),Math.round(fy-14),ww+4,14,'#0a0606',.5);dith(Math.round(wx),Math.round(fy-22),ww,8,'#0a0606',.25)}// копоть
      }
      if(f===1&&hash(s,6)<.45){const bx=x+w/2-18;R(bx,fy+wh+2,36,3,drk(col,.3));for(let k=0;k<36;k+=3)R(bx+k,fy+wh-6,1,8,'#2a2a34');R(bx,fy+wh-7,36,1,'#2a2a34')}// балкон
    }
    // первый этаж: витрина и вывеска
    const gy=base-30;R(x,gy,w,30,drk(col,.2));R(x,gy,w,2,lt);
    if(hash(s,9)<.75){const sw=w-20;R(x+10,gy+8,sw,20,o.ruin?'#0e0a0c':o.night?'#ffe0a0':'#2a3040');if(!o.ruin){R(x+10,gy+8,sw,2,'#ffffff');for(let k=0;k<sw;k+=sw/3)R(x+10+k,gy+8,1,20,drk(col,.4))}
      const sg=SIGNS[Math.floor(hash(s,10)*SIGNS.length)],sc=SCOL[Math.floor(hash(s,11)*SCOL.length)];if(!o.ruin){R(x+8,gy+1,w-16,7,'#141020');txt(sg,x+w/2-txtW(sg,1)/2,gy+2,o.night?sc:lit(sc,.2),1)}}
    else{R(x+w/2-8,gy+6,16,24,'#3a2a2a');R(x+w/2-7,gy+7,14,22,'#5a3a2a');R(x+w/2,gy+7,1,22,'#2a1a1a')}
    R(x+w-1,top,1,h,drk(col,.5));x+=w;i++}})}
// рисует полосу фасадов со сдвигом off (по кругу)
function facades(off,o){const s=facadeStrip(o),LW=s.width;let x=-(((off%LW)+LW)%LW);while(x<AW){C.g.drawImage(s,Math.round(x),0);x+=LW}}
// мерцание горящих окон поверх руин
function ruinFlicker(off,t,o){const LW=o.lw||1280;for(let i=0;i<26;i++){const x=((hash(i,o.seed)*LW-off)%LW+LW)%LW,y=(o.base||290)-50-hash(o.seed,i)*100;if(x>AW)continue;const f=Math.sin(t*12+i*3)>0;if(f){glow(x,y,18,'#ff7a20',.25)}}}
// ---------- огонь и дым ----------
function fire(x,y,w,h,t,seed){seed=seed||1;for(let i=0;i<w;i+=2){const k=Math.sin((i/w)*Math.PI),hh=h*k*(.6+.4*Math.sin(t*9+i*.7+seed)),yy=y-hh;
    R(x+i,yy,2,hh,'#ff3a10');R(x+i,yy+hh*.25,2,hh*.75,'#ff8a1a');R(x+i,yy+hh*.55,2,hh*.45,'#ffd84a');if(hash(i,Math.floor(t*12)+seed)<.08)P(x+i,yy-4-hash(i,seed)*8,'#ffb84a')}
  glow(x+w/2,y-h*.4,Math.max(30,w*1.2),'#ff6a1a',.35)}
function smoke(x,y,t,seed,n,col){const g=C.g;for(let i=0;i<(n||8);i++){const k=((t*.18+i/(n||8)+hash(i,seed)*.3)%1),r=6+k*26,a=.45*(1-k);g.fillStyle=col?col.replace('A',a):'rgba(30,22,30,'+a+')';
    const px=x+Math.sin(t*.7+i)*8+k*40*(hash(seed,i)-.3),py=y-k*170;M.use(g,()=>M.E(px,py,r,r*.8,g.fillStyle))}}
function embers(t,x0,y0,w,h,n){for(let i=0;i<n;i++){const k=((t*.3+hash(i,3))%1),x=x0+hash(i,8)*w+Math.sin(t*2+i)*10,y=y0+h-k*h;P(x,y,k<.5?'#ffd84a':'#ff6a1a')}}
// ---------- улица ----------
function street(y0,t,o){o=o||{};// тротуар y0..y0+18, бордюр, дорога до низа
  C.g.drawImage(layer('street:'+y0+(o.night?1:0)+(o.ruin?1:0),AW,AH,()=>{const sw=o.ruin?'#3a3038':o.night?'#4a4258':'#6a6478';R(0,y0,AW,18,sw);for(let x=0;x<AW;x+=22)R(x,y0,1,18,drk(sw,.25));R(0,y0+9,AW,1,drk(sw,.15));
    R(0,y0+18,AW,3,'#9a94a8');R(0,y0+21,AW,1,'#2a2430');C.asphalt(y0+22,AH,o.ruin?'#1e1a22':'#25212e',11);
    if(o.ruin)for(let i=0;i<40;i++){const x=hash(i,31)*AW,y=y0+24+hash(31,i)*(AH-y0-24);R(x,y,2+hash(i,2)*5,2,'#141016')}}),0,0);
  const d=o.dash==null?0:o.dash;for(let x=-((d%48)+48)%48;x<AW;x+=48)R(x,y0+52,24,2,o.ruin?'#6a6050':'#d8d0a8')}
function lamp(x,base,h,on,col){col=col||'#ffe8a8';R(x-1,base-h,3,h,'#1a1a24');R(x-3,base-4,7,4,'#1a1a24');R(x-1,base-h,14,2,'#1a1a24');R(x+10,base-h+2,6,4,'#2a2a34');
  if(on){R(x+11,base-h+6,4,2,'#fff6d8');cone(x+13,base-h+8,6,70,h-8,col,.16);glow(x+13,base-h+7,26,col,.35)}}
function lampSpb(x,base,on){R(x-1,base-70,3,70,'#141420');R(x-4,base-6,9,6,'#141420');R(x-3,base-44,7,2,'#141420');for(const dx of [-10,10]){R(x+dx-3,base-70,7,10,'#141420');R(x+dx-2,base-68,5,7,on?'#ffe8a8':'#3a3a4a')}
  R(x-10,base-72,21,2,'#141420');if(on){glow(x-10,base-64,24,'#ffd88a',.35);glow(x+10,base-64,24,'#ffd88a',.35);cone(x,base-60,14,90,60,'#ffe0a0',.1)}}
// ---------- красный кирпичный дом (10 этажей) ----------
function brickTower(x,base,w,h,t,o){o=o||{};const key='tow:'+[x,base,w,h,o.night?1:0,o.dawn?1:0].join(',');
  C.g.drawImage(layer(key,AW,AH,()=>{const B=o.night?'#6a2a2a':'#a83a2e',Bd=drk(B,.3),Bl=lit(B,.15);R(x,base-h,w,h,B);
    for(let y=base-h;y<base;y+=3){R(x,y,w,1,drk(B,.12));for(let k=(y/3)%2?0:5;k<w;k+=10)R(x+k,y,1,3,drk(B,.18))}
    R(x-3,base-h-4,w+6,4,'#3a2a2a');for(let k=0;k<w;k+=40)R(x+k+10,base-h-12,12,8,'#4a3a3a');
    const fl=10,fh=(h-24)/fl,cols=Math.floor(w/22);
    for(let f=0;f<fl;f++)for(let c=0;c<cols;c++){const wx=x+8+c*((w-16)/cols),wy=base-h+8+f*fh,v=hash(c*13+f,x);
      const wc=o.night?(v<.4?'#ffd27a':v<.48?'#ff9ad8':v<.55?'#7ae8ff':'#1a1020'):o.dawn?(v<.2?'#ffe0a0':'#3a4a7a'):(v<.3?'#ffe8a0':'#2a3a5a');
      R(wx,wy,12,fh-6,'#e8d8c8');R(wx+1,wy+1,10,fh-8,wc);R(wx+6,wy+1,1,fh-8,'#e8d8c8');if(c%3===1&&f>0)R(wx-2,wy+fh-6,16,4,'#5a4a4a')}
    R(x+w/2-14,base-26,28,26,'#3a2a2a');R(x+w/2-12,base-24,24,24,'#5a6a7a');R(x+w/2-16,base-30,32,4,'#4a3a3a');R(x+w/2-6,base-36,12,5,'#e8e8e8');txt('3',x+w/2-1,base-35,'#2a4ae8',1)}),0,0);
  if(o.night)for(let i=0;i<6;i++){const v=hash(i,x);glow(x+20+v*(w-40),base-h+30+hash(x,i)*(h-60),20,'#ffd27a',.12)}}
// двор: деревья, будка, забор/крепость
function yardTree(x,base,h,t,col){col=col||'#2a6a3a';R(x-2,base-h*.45,5,h*.45,'#3a2a24');for(let i=0;i<14;i++){const a=hash(i,x)*TAU,r=h*.28*hash(x,i),cx=x+Math.cos(a)*r,cy=base-h*.62+Math.sin(a)*r*.7+Math.sin(t+i)*.6;M.use(C.g,()=>M.E(cx,cy,h*.16,h*.13,i%3?col:lit(col,.2)))}}
function booth(x,base,on){R(x,base-46,40,46,'#c8c4b8');R(x,base-46,40,3,'#3a3a44');R(x-3,base-50,46,5,'#2a3a5a');R(x+6,base-38,28,16,on?'#ffe8a0':'#2a3a4a');R(x+20,base-38,1,16,'#8a8a8a');R(x+28,base-20,8,20,'#5a5a64');if(on)glow(x+20,base-30,40,'#ffe0a0',.25)}
function fortWall(y,t,o){o=o||{};const H=o.h||70,W0='#7a7a84';
  C.g.drawImage(layer('fort:'+y+H+(o.gate?1:0),AW,AH,()=>{R(0,y-H,AW,H,W0);for(let x=0;x<AW;x+=40){R(x,y-H,2,H,'#4a4a54');R(x+2,y-H,1,H,'#9a9aa4');for(let k=0;k<6;k++)R(x+6+hash(x,k)*30,y-H+6+hash(k,x)*(H-12),2+hash(k,k)*4,1,'#5a5a64')}
    dith(0,y-H,AW,H,'#5a5a64',.18);R(0,y-H,AW,3,'#a8a8b0');R(0,y-6,AW,6,'#4a4a54');
    for(let x=0;x<AW;x+=9){for(let k=0;k<9;k++){const a=k/9*TAU;P(x+4+Math.cos(a)*4,y-H-6+Math.sin(a)*4,k<4?'#c8c8d0':'#6a6a74')}}R(0,y-H-1,AW,1,'#3a3a44');
    if(o.gate){const gx=o.gate;R(gx-36,y-H+6,72,H-6,'#3a3e34');for(let k=0;k<72;k+=8)R(gx-36+k,y-H+6,2,H-6,'#2a2e24');R(gx-1,y-H+6,2,H-6,'#1a1a14');R(gx-38,y-H+2,76,4,'#c8a020');for(let k=0;k<76;k+=12)R(gx-38+k,y-H+2,6,4,'#1a1a1a')}}),0,0);
  for(const tx of (o.tur||[90,330,560])){const ty=y-H;R(tx-14,ty-20,28,20,'#3a3e44');R(tx-14,ty-20,28,3,'#6a6e76');R(tx-16,ty-2,32,4,'#2a2e34');const a=Math.sin(t*.8+tx)*.25;C.g.save();C.g.translate(tx+4,ty-12);C.g.rotate(a);C.g.fillStyle='#1e1e24';C.g.fillRect(0,-2,30,4);C.g.fillRect(26,-3,6,6);C.g.restore();
    R(tx-8,ty-16,8,6,'#1a2a3a');if(Math.sin(t*4+tx)>.6){P(tx-6,ty-14,'#ff3a3a');glow(tx-6,ty-14,6,'#ff3a3a',.5)}}
  if(o.lights)for(const lx of [40,250,470]){const ly=y-H-40;R(lx,ly,3,40,'#2a2a30');R(lx-5,ly-5,13,6,'#3a3a40');const a=Math.sin(t*.7+lx)*.5;C.g.save();C.g.globalCompositeOperation='lighter';C.g.fillStyle='rgba(255,250,210,.08)';C.g.beginPath();C.g.moveTo(lx+1,ly-2);C.g.lineTo(lx+1+Math.cos(a-1.3)*360-50,ly-2+Math.sin(a-1.3)*360);C.g.lineTo(lx+1+Math.cos(a-1.3)*360+50,ly-2+Math.sin(a-1.3)*360);C.g.fill();C.g.restore();glow(lx+1,ly-2,16,'#fffad0',.6)}}
// весь двор у дома (дом Микроба). o: night, fort, runway, dawn, gate
function homeYard(t,o){o=o||{};const sk=o.night?'night':o.dawn?'dawn':'eve';sky(sk,t,{sx:120,sy:220});
  farCity(232,o.night?'#1a1030':'#3a1e4a',{isaak:false,seed:7,lakhta:o.night?560:null});
  C.grass(236,262,o.night?'#14281e':'#2a5a2a',o.night?'#1e3a2a':'#4a8a3a',5);
  brickTower(170,262,300,232,t,o);
  for(const [x,h] of [[60,90],[130,70],[520,96],[600,74]])yardTree(x,262,h,t,o.night?'#1a3a2a':'#2a6a3a');
  C.g.drawImage(layer('yardg:'+(o.night?1:0),AW,AH,()=>{const sw=o.night?'#3a3448':'#5a5468';R(0,262,AW,14,sw);for(let x=0;x<AW;x+=20)R(x,262,1,14,drk(sw,.25));R(0,276,AW,3,'#8a849a');C.asphalt(279,AH,o.night?'#1e1a26':'#2a2634',21);
    for(let x=30;x<AW;x+=70){R(x,290,2,30,'#c8c4b8')}R(0,320,AW,1,'#c8c4b8');for(let i=0;i<10;i++){const x=hash(i,40)*AW;R(x,282+hash(40,i)*60,12,3,drk('#2a2634',.4))}}),0,0);
  if(o.runway){R(0,290,AW,44,'#2a2a30');for(let x=-((t*0)%60);x<AW;x+=60)R(x,310,30,3,'#f0f0e8');R(0,290,AW,2,'#f0f0e8');R(0,332,AW,2,'#f0f0e8');for(let x=10;x<AW;x+=80){R(x,286,4,4,Math.sin(t*6+x)>0?'#ff3a3a':'#5a1a1a')}}
  booth(o.boothX||470,268,o.night);
  if(o.fort)fortWall(o.fortY||276,t,{lights:o.night,tur:o.tur,gate:o.gate,h:o.wallH});}
// ---------- Нева и Петропавловка ----------
function neva(t,o){o=o||{};sky(o.sky||'eve',t,{sx:o.sx||520,sy:o.sy||170,sun:o.sun});
  const by=o.by||200;
  // крепость на том берегу
  C.g.drawImage(layer('petro:'+by+(o.broken?1:0)+(o.sky||'eve'),AW,AH,()=>{const col=o.sky==='dawn'?'#4a3a6a':'#2a1e3a';R(0,by-8,AW,8,col);
    const cx=o.px||300;R(cx-200,by-22,400,14,col);for(let x=cx-200;x<cx+200;x+=10)R(x,by-26,6,4,col);for(const bx of [cx-200,cx-110,cx+60,cx+170])R(bx,by-34,24,26,lit(col,.05));
    R(cx-40,by-62,90,40,mix(col,'#ffd8a0',.15));R(cx-40,by-62,90,2,'#8a7080');for(let i=0;i<7;i++)R(cx-34+i*12,by-54,4,12,'#ffd27a');
    R(cx-10,by-88,22,26,'#6a5868');R(cx-6,by-106,14,18,'#6a5868');R(cx-3,by-118,8,12,'#8a7a58');
    if(!o.broken){for(let y=by-118;y>by-250;y--){const k=(by-118-y)/132,w=k<.6?4:k<.85?3:2;R(cx+1-w/2,y,w,1,k>.95?'#fff0a0':'#e0ac2e');if(y%9===0)R(cx+1-w/2,y,1,1,'#fff6c8')}
      R(cx,by-262,1,12,'#ffd23a');R(cx-4,by-258,9,1,'#ffd23a');R(cx-1,by-266,3,4,'#fff0a0')}
    else{R(cx-2,by-130,6,12,'#3a2a2a');for(let i=0;i<8;i++)R(cx-3+hash(i,4)*8,by-130-hash(4,i)*8,2,2,'#2a1a1a')}
    M.use(C.g,()=>M.skyline(by-8,13,col,6,22,.05,0))}),0,0);
  if(!o.broken){const gl=Math.sin(t*2)*.05;glow(o.px||300,by-180,60,'#ffd27a',.18+gl)}
  // вода
  const wy=by;R(0,wy,AW,AH-wy,o.sky==='dawn'?'#3a3a7a':'#0e0a2a');
  for(let y=wy+2;y<AH;y+=3)for(let x=0;x<AW;x+=12){const s=Math.sin(x*.05+t*1.6+y*.3);if(s>.55)R(x+((y*7)%6),y,5+(s>.9?4:0),1,o.sky==='dawn'?'#6a6aaa':'#2a2068')}
  for(let y=wy+2;y<AH;y+=2){const s=Math.sin(y*1.7+t*4);if(s>-.3){R((o.px||300)-2+Math.sin(t*3+y)*2,y,5,1,'#e0ac2e');}if(hash(y,3)<.5)R((o.sx||520)-8+Math.sin(t*2+y)*4,y,16-(y-wy)*.05,1,o.sky==='dawn'?'#ffe0a0':'#ff8a5a')}
  for(let i=0;i<9;i++){const rx=40+i*70;for(let y=wy+3;y<wy+60;y+=3)if(Math.sin(y+t*3+i)>.2)R(rx+Math.sin(t*2+y)*2,y,3,1,i%2?'#ffd27a':'#ff9ad8')}
  // гранитный парапет на переднем плане
  if(o.parapet!==false){const py=o.py||300;R(0,py,AW,AH-py,'#4a3a4a');R(0,py,AW,6,'#7a6a7a');R(0,py+6,AW,2,'#2a1e2a');for(let x=0;x<AW;x+=64){R(x,py,2,AH-py,'#3a2a3a')}dith(0,py+8,AW,AH-py-8,'#5a4a5a',.2)}}
// ---------- мост ----------
function bridge(t,o){o=o||{};// разведённый Литейный/Троицкий: крылья подняты
  const by=o.by||250;if(o.open){const a=o.ang==null?.9:o.ang;
    for(const sd of [-1,1]){const cx=sd<0?248:392;C.g.save();C.g.translate(cx,by);C.g.rotate(sd<0?-a:a);C.g.fillStyle='#4a4458';C.g.fillRect(sd<0?0:-150,-10,150,10);C.g.fillStyle='#6a6478';C.g.fillRect(sd<0?0:-150,-10,150,2);
      C.g.fillStyle='#2a2430';for(let k=0;k<150;k+=12)C.g.fillRect(sd<0?k:-k-2,-22,2,12);C.g.fillRect(sd<0?0:-150,-22,150,2);C.g.restore()}}
  const L=o.open?248:AW;R(0,by,o.open?248:AW,10,'#4a4458');R(0,by,o.open?248:AW,2,'#6a6478');if(o.open)R(392,by,AW-392,10,'#4a4458'),R(392,by,AW-392,2,'#6a6478');
  for(let x=0;x<AW;x+=12){if(o.open&&x>236&&x<392)continue;R(x,by-12,2,12,'#2a2430')}R(0,by-12,L,2,'#2a2430');if(o.open)R(392,by-12,AW-392,2,'#2a2430');
  for(const px of o.open?[236,392]:[150,470]){R(px-8,by,16,AH-by,'#3a3448');R(px-12,by-30,24,30,'#3a3448');R(px-12,by-30,24,2,'#5a5468');lampSpb(px,by-30,true)}}
Object.assign(C,{SKY,sky,puff,farCity,facadeStrip,facades,ruinFlicker,fire,smoke,embers,street,lamp,lampSpb,brickTower,yardTree,booth,fortWall,homeYard,neva,bridge,FAC});
})();
