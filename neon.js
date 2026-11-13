// ================= NEON: новая графика квартиры (пилот 04.11) =================
// Кислотный фон за стенами, контрастные полы и мебель с контуром, свет и градиенты.
// G — переключить «до/после». Старые функции сохранены в NEON.old.
(function(){
'use strict';
const T=1/3,OL='#120a1a';
const NEON=window.NEON={on:true,old:{buildMap,floorCell,drawLiving,drawHall,drawBath,drawToilet,drawBed,drawKitchen,drawSklad,box,drawWindowH,render}};
const O=NEON.old;
try{const v=localStorage.getItem('pp_neon');if(v==='0'&&window.PILOT)NEON.on=false}catch(e){}

// ---------- цветовые помощники ----------
function hx(c){const n=parseInt(c.slice(1),16);return[n>>16,(n>>8)&255,n&255]}
function th(r,g,b){return'#'+((1<<24)|(clamp(r|0,0,255)<<16)|(clamp(g|0,0,255)<<8)|clamp(b|0,0,255)).toString(16).slice(1)}
function mix(a,b,k){const A=hx(a),B=hx(b);return th(A[0]+(B[0]-A[0])*k,A[1]+(B[1]-A[1])*k,A[2]+(B[2]-A[2])*k)}
const lite=(c,k)=>mix(c,'#ffffff',k||.3),dark=(c,k)=>mix(c,'#0a0414',k||.35);
function lg(x0,y0,x1,y1,st){const g=m.createLinearGradient(x0,y0,x1,y1);st.forEach((c,i)=>g.addColorStop(i/(st.length-1),c));return g}
function rg(x,y,r,st){const g=m.createRadialGradient(x,y,0,x,y,r);st.forEach((c,i)=>g.addColorStop(i/(st.length-1),c));return g}
function GR(x,y,w,h,g){m.fillStyle=g;m.fillRect(x,y,w,h)}
function circ(x,y,r,c){ell(m,x,y,r,r,c)}
function ov(x,y,rx,ry,c){ell(m,x,y,rx,ry,c)}
// объект: тень, контур, верх, передняя грань, блик
function ob(x,y,w,h,top,sd,o){o=o||{};sd=sd==null?1.33:sd;
  if(!o.noSh)R(x+1,y+1.33,w,h,'rgba(10,0,24,.45)');
  R(x-T*2,y-T*2,w+T*4,h+T*4,o.ol||OL);
  R(x,y,w,h,top);
  if(sd>0)R(x,y+h-sd,w,sd,o.side||dark(top,.38));
  if(!o.noHi){R(x,y,w,T,lite(top,.45));R(x,y,T,h-sd,lite(top,.25));R(x+w-T,y+T,T,h-sd-T,dark(top,.15))}
}
function line(x0,y0,x1,y1,c,w){m.strokeStyle=c;m.lineWidth=w||T;m.beginPath();m.moveTo(x0,y0);m.lineTo(x1,y1);m.stroke()}

// ---------- стены (как в HM: светлые рельсы со столбиками) ----------
const isW=(x,y)=>x<0||y<0||x>=GW||y>=GH||grid[y][x]===null;
const isRoom=(x,y)=>x>=0&&y>=0&&x<GW&&y<GH&&grid[y][x]!==null&&grid[y][x]!=='entrance';
function walls(){
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){if(grid[y][x]!==null)continue;const px=x*C,py=y*C;
    R(px,py,C,C,'#e6dcef');
    for(let r=0;r<3;r++){const yy=py+r*2.67;R(px,yy,C,T,'#d2c4e0');const off=((y*3+r)%2)*2.67;R(px+off+1.33,yy,T,2.67,'#d2c4e0');R(px+off+5.33,yy,T,2.67,'#d2c4e0')}
    if(hash(x,y)<.3)R(px+2+hash(y,x)*4,py+1+hash(x+1,y)*5,1.33,T,'#f6f0fb');
  }
  // рельсы
  const RAIL='#ffffff',RS='#a892c0';
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){if(grid[y][x]!==null)continue;const px=x*C,py=y*C;
    if(isRoom(x,y+1)){R(px,py+C-2,C,1.33,RS);R(px,py+C-.67,C,.67,OL)}
    if(isRoom(x,y-1)){R(px,py,C,.67,OL);R(px,py+.67,C,T,RAIL)}
    if(isRoom(x+1,y)){R(px+C-1.67,py,1,C,RS);R(px+C-.67,py,.67,C,OL)}
    if(isRoom(x-1,y)){R(px,py,.67,C,OL);R(px+.67,py,T,C,RAIL)}
  }
  // столбики на концах рельсов и через каждые 2 клетки
  const post=(cx,cy)=>{};
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){if(grid[y][x]!==null)continue;const px=x*C,py=y*C;
    if(isRoom(x,y+1)){const cy=py+C-1.17;if(!isW(x-1,y)||!isRoom(x-1,y+1))post(px+1.2,cy);if(!isW(x+1,y)||!isRoom(x+1,y+1))post(px+C-1.2,cy);}
    if(isRoom(x,y-1)){const cy=py+1.17;if(!isW(x-1,y)||!isRoom(x-1,y-1))post(px+1.2,cy);if(!isW(x+1,y)||!isRoom(x+1,y-1))post(px+C-1.2,cy);}
    if(isRoom(x+1,y)){const cx=px+C-1.17;if(!isW(x,y-1)||!isRoom(x+1,y-1))post(cx,py+1.2);if(!isW(x,y+1)||!isRoom(x+1,y+1))post(cx,py+C-1.2);}
    if(isRoom(x-1,y)){const cx=px+1.17;if(!isW(x,y-1)||!isRoom(x-1,y-1))post(cx,py+1.2);if(!isW(x,y+1)||!isRoom(x-1,y+1))post(cx,py+C-1.2);}
  }
  // внешний контур дома
  R(0,0,GW*C,T*2,OL);R(0,GH*C-T*2,GW*C,T*2,OL);R(0,0,T*2,GH*C,OL);R(GW*C-T*2,0,T*2,GH*C,OL);
}

// ---------- полы ----------
function planks(px,py,x,y,base,alt,seam,grain){ // широкая доска 32×4, вразбежку
  for(let r=0;r<2;r++){const yy=py+r*4,row=y*2+r,off=(row*11%4)*8;
    const ix=Math.floor((x*C+off)/32),c=hash(ix*13+row,row*3)<.5?base:alt;R(px,yy,C,4,c);R(px,yy+3.67,C,T,seam);R(px,yy,C,T,lite(c,.1));
    const jx=32-((x*C+off)%32);if(jx<C){R(px+jx-T,yy,T*2,4,seam)}
    const gx=px+hash(x+r,y*5)*4;R(gx,yy+1.33,2+hash(r,x)*4,T,grain);if(hash(r,x+y)<.5)R(px+hash(y,x+r)*5,yy+2.67,1.5+hash(x,r)*3,T,dark(c,.18));
    if(hash(x*9+r,y)<.05){circ(px+hash(y,r+x)*6+1,yy+2,.67,dark(base,.45))}}
}
function tiles(px,py,s,c1,c2,gr,hi,chk,x,y){ // плитка s×s с затиркой и бликом
  for(let j=0;j<C;j+=s)for(let i=0;i<C;i+=s){const tx=Math.floor((x*C+i)/s),ty=Math.floor((y*C+j)/s);
    const c=chk?((tx+ty)%2?c1:c2):(hash(tx,ty)<.5?c1:c2);
    R(px+i,py+j,s,s,gr);R(px+i+T,py+j+T,s-T,s-T,c);R(px+i+T,py+j+T,s-T*2,T,hi);R(px+i+T,py+j+T,T,s-T*2,hi);R(px+i+s-T,py+j+T*2,T,s-T*2,dark(c,.2))}
}
function floorN(r,x,y){const px=x*C,py=y*C,h=hash(x,y);
  switch(r){
    case 'living':planks(px,py,x,y,'#5a3040','#4e2a3a','#2a1020','#6a3a4c');break;
    case 'bed':planks(px,py,x,y,'#8a5a3c','#93623f','#5a3424','#a87452');break;
    case 'hall':case 'skladdoor':case 'entrance':{ // крупный светлый керамогранит 16×16 с прожилками
      const tx=Math.floor(x/2),ty=Math.floor(y/2),c=hash(tx,ty)<.5?'#d8d3e3':'#cfc9dc';R(px,py,C,C,c);
      if(x%2===0)R(px,py,T*2,C,'#8d7fa3');if(y%2===0)R(px,py,C,T*2,'#8d7fa3');
      if(x%2===0)R(px+T*2,py,T,C,'#f2eef8');if(y%2===0)R(px,py+T*2,C,T,'#f2eef8');
      for(let i=0;i<3;i++){const a=hash(x*7+i,y*3);if(a<.35)R(px+hash(i,x+y)*6,py+hash(y,i)*7,2+a*4,T,'rgba(120,100,150,.35)')}
      break}
    case 'bath':tiles(px,py,4,'#2d3350','#283048','#151a2c','rgba(140,220,255,.22)',false,x,y);break;
    case 'toilet':tiles(px,py,4,'#ff6fb0','#ff86bf','#a8336d','rgba(255,255,255,.35)',true,x,y);break;
    case 'kitchen':tiles(px,py,4,'#24d2e6','#f1f7ff','#ff3d9a','rgba(255,255,255,.45)',true,x,y);break;
    case 'sklad':{R(px,py,C,C,'#3a3842');for(let i=0;i<6;i++){const a=hash(x*5+i,y*11);R(px+hash(i,x)*7.6,py+hash(y,i)*7.6,T,T,a<.5?'#2c2a33':'#4a4852')}
      if(h<.08){line(px+1,py+2,px+4,py+3,'#25232b',T);line(px+4,py+3,px+6,py+6,'#25232b',T)}
      if(x%4===0)R(px,py,T,C,'#2c2a33');if(y%4===0)R(px,py,C,T,'#2c2a33');break}
  }
  // мягкая тень у стен
  const wu=y>0&&grid[y-1][x]===null,wl=x>0&&grid[y][x-1]===null;
  if(wu){R(px,py,C,1,'rgba(10,0,24,.35)');R(px,py+1,C,1,'rgba(10,0,24,.15)')}
  if(wl){R(px,py,1,C,'rgba(10,0,24,.30)');R(px+1,py,.67,C,'rgba(10,0,24,.12)')}
}

// ---------- ГОСТИНАЯ ----------
const ACID=['#ff2e97','#ffe23a','#22e5d4','#9b4dff','#ff8a2a','#36d7ff','#7dff3a','#ff3df2'];
function living(){
  // ковёр — по фото: мятные панели, решётка, ацтекские ромбы, гепард, монстеры
  const rx=144,ry=64,RW=56,RH=88;
  R(rx+1,ry+1.33,RW,RH,'rgba(10,0,24,.4)');R(rx-T,ry-T,RW+T*2,RH+T*2,OL);
  m.save();m.beginPath();m.rect(rx,ry,RW,RH);m.clip();
  const MINT='#8fdcc4',MINT2='#a9e8d4',TEAL='#3ab4a2',DK='#13241d',PINK='#e2508c',PALE='#efc0cc',BLUE='#2f80c8',CREAM='#f3ecd8',LEAF='#4fa24c',LEAF2='#2f6e3a';
  R(rx,ry,RW,RH,DK);
  // верх: шевроны (слева) и зигзаг + бледно-розовая панель (справа)
  R(rx+1,ry+1,27,11,MINT);for(let r=0;r<2;r++)for(let i=0;i<4;i++){m.fillStyle=BLUE;m.beginPath();const x0=rx+2+i*6.5,y0=ry+2.5+r*4.5;m.moveTo(x0,y0);m.lineTo(x0+6,y0);m.lineTo(x0+3,y0+3.5);m.closePath();m.fill()}
  R(rx+29,ry+1,18,11,MINT2);for(let i=0;i<9;i++){m.fillStyle=i%2?PINK:BLUE;m.beginPath();const x0=rx+29+i*2;m.moveTo(x0,ry+6);m.lineTo(x0+1,ry+4);m.lineTo(x0+2,ry+6);m.lineTo(x0+1,ry+8);m.closePath();m.fill()}
  R(rx+48,ry+1,7,24,PALE);R(rx+54,ry+1,1,24,'#f08a3a');for(let j=0;j<8;j++)line(rx+48.5,ry+3+j*3,rx+53.5,ry+4.5+j*3,'#c87a8c',T);
  R(rx,ry+12.5,RW,.67,CREAM);
  // решётка с банановыми листьями (слева)
  R(rx+1,ry+14,18,26,CREAM);for(let j=0;j<7;j++)for(let i=0;i<5;i++){const cx=rx+2.6+i*3.6+(j%2)*1.8,cy=ry+15.6+j*3.6;m.fillStyle=BLUE;m.beginPath();m.moveTo(cx,cy-1.6);m.lineTo(cx+1.6,cy);m.lineTo(cx,cy+1.6);m.lineTo(cx-1.6,cy);m.closePath();m.fill()}
  R(rx+1,ry+14,18,.67,DK);R(rx+1,ry+39.33,18,.67,DK);
  const bleaf=(x,y,a,L,w,c)=>{m.save();m.translate(x,y);m.rotate(a);m.fillStyle=c;m.beginPath();m.moveTo(0,0);m.quadraticCurveTo(w,-L*.5,0,-L);m.quadraticCurveTo(-w,-L*.5,0,0);m.fill();m.strokeStyle=dark(c,.4);m.lineWidth=T;m.beginPath();m.moveTo(0,0);m.lineTo(0,-L);for(let k=1;k<6;k++){const yy=-L*k/6;m.moveTo(0,yy);m.lineTo(w*.7,yy-2);m.moveTo(0,yy);m.lineTo(-w*.7,yy-2)}m.stroke();m.restore()};
  bleaf(rx+8,ry+42,-.35,24,4,LEAF);bleaf(rx+12,ry+42,.25,20,3.5,'#68b85a');
  // центральная колонна: ромбы
  R(rx+21,ry+14,14,30,MINT);R(rx+21,ry+14,.67,30,DK);R(rx+34.33,ry+14,.67,30,DK);
  const dia=(cx,cy,w,h,c,in2)=>{m.fillStyle=c;m.beginPath();m.moveTo(cx,cy-h);m.lineTo(cx+w,cy);m.lineTo(cx,cy+h);m.lineTo(cx-w,cy);m.closePath();m.fill();if(in2){m.fillStyle=in2;m.beginPath();m.moveTo(cx,cy-h*.5);m.lineTo(cx+w*.5,cy);m.lineTo(cx,cy+h*.5);m.lineTo(cx-w*.5,cy);m.closePath();m.fill()}};
  dia(rx+28,ry+20,4,5,PINK,'#ff8ab4');dia(rx+28,ry+29,3,3.5,BLUE,'#8ad0ff');dia(rx+28,ry+38,4,5,PINK,'#ff8ab4');
  for(let j=0;j<10;j++){R(rx+22,ry+15+j*3,1,1,DK);R(rx+33,ry+15+j*3,1,1,DK)}
  // справа: бледно-розовая панель с зигзагом и тёмная монстера
  R(rx+37,ry+27,17,14,PALE);for(let j=0;j<4;j++){m.strokeStyle='#d07890';m.lineWidth=T;m.beginPath();for(let i=0;i<=8;i++)m.lineTo(rx+37+i*2.1,ry+29+j*3.2+(i%2));m.stroke()}
  const mon=(x,y,a,s,c,cut)=>{m.save();m.translate(x,y);m.rotate(a);m.scale(s,s);m.fillStyle=c;m.beginPath();m.ellipse(0,0,6,5,0,0,7);m.fill();m.fillStyle=cut||DK;for(let k=0;k<5;k++){m.save();m.rotate(-1.2+k*.6);m.fillRect(1.6,-.6,4.8,1.2);m.restore()}circ(0,0,.0,DK);m.fillStyle=dark(c,.3);m.fillRect(-6,-.2,6,.4);m.restore()};
  mon(rx+47,ry+20,.4,1.3,'#2e5a3c');mon(rx+50,ry+48,-.6,1.4,'#24483a');
  // середина: гепард на тёмном фоне, бирюзовое пятно
  ov(rx+16,ry+58,12,7,TEAL);ov(rx+14,ry+58,8,4,'#4ac8b4');
  const cx=rx+30,cy=ry+55;
  m.save();m.lineCap='round';
  const legL=(x0,y0,x1,y1,x2,y2)=>{m.strokeStyle=OL;m.lineWidth=1.8;m.beginPath();m.moveTo(x0,y0);m.lineTo(x1,y1);m.lineTo(x2,y2);m.stroke();m.strokeStyle='#e8b45a';m.lineWidth=1.1;m.stroke()};
  legL(cx-8,cy+2,cx-10,cy+7,cx-12,cy+10.5);legL(cx-6,cy+2,cx-4,cy+7,cx-5,cy+10.5);legL(cx+7,cy+2,cx+9,cy+6.5,cx+11,cy+10.5);legL(cx+9,cy+2,cx+7,cy+7,cx+7.5,cy+10.5);
  m.strokeStyle=OL;m.lineWidth=1.8;m.beginPath();m.moveTo(cx-11,cy);m.quadraticCurveTo(cx-17,cy+2,cx-19,cy+8);m.stroke();m.strokeStyle='#e8b45a';m.lineWidth=1.1;m.stroke();
  m.restore();
  m.fillStyle=OL;m.beginPath();m.ellipse(cx,cy,12.5,3.6,0,0,7);m.fill();m.fillStyle='#e8b45a';m.beginPath();m.ellipse(cx,cy,12,3.1,0,0,7);m.fill();
  m.fillStyle='#fbe8c0';m.beginPath();m.ellipse(cx+1,cy+1.6,9,1.3,0,0,7);m.fill();
  m.fillStyle=OL;m.beginPath();m.ellipse(cx+13,cy-2.2,3.6,2.8,.2,0,7);m.fill();m.fillStyle='#e8b45a';m.beginPath();m.ellipse(cx+13,cy-2.2,3.1,2.3,.2,0,7);m.fill();
  m.fillStyle='#fbe8c0';m.beginPath();m.ellipse(cx+15,cy-1.4,1.4,1,0,0,7);m.fill();
  R(cx+12.4,cy-2.9,.67,.67,'#1a1008');R(cx+14.6,cy-2.4,T,1.6,'#1a1008');R(cx+11,cy-4.6,1,1,OL);
  for(let i=0;i<34;i++){const sx=cx-11+hash(i,7)*23,sy=cy-2.6+hash(7,i)*5;if(((sx-cx)/12)**2+((sy-cy)/3.1)**2>.85)continue;R(sx,sy,.67,.67,'#2a1408')}
  for(let i=0;i<8;i++)R(cx-18+i*.9,cy+2+i*.9,.5,.5,'#2a1408');
  // низ: мятное поле с сеткой, монстеры и папоротник
  R(rx,ry+66,RW,22,MINT);for(let i=0;i<RW;i+=3.5)R(rx+i,ry+66,T,22,'rgba(243,236,216,.6)');for(let j=0;j<22;j+=3.5)R(rx,ry+66+j,RW,T,'rgba(243,236,216,.6)');
  mon(rx+10,ry+74,-.3,1.6,'#0e1a14',MINT);mon(rx+44,ry+80,2.6,1.5,'#14261e',MINT);mon(rx+50,ry+66,1.2,1.1,'#1e3a2c',MINT);
  const fern=(x,y,a,L)=>{m.save();m.translate(x,y);m.rotate(a);m.strokeStyle='#0e1a14';m.lineWidth=.5;m.beginPath();m.moveTo(0,0);m.lineTo(0,-L);m.stroke();m.fillStyle='#14261e';for(let k=1;k<9;k++){const yy=-L*k/9,w=(1-k/10)*3.5;m.beginPath();m.ellipse(w*.6,yy,w*.7,.5,-.5,0,7);m.ellipse(-w*.6,yy,w*.7,.5,.5,0,7);m.fill()}m.restore()};
  fern(rx+27,ry+88,0,16);fern(rx+21,ry+88,-.4,12);fern(rx+33,ry+88,.4,12);
  m.restore();
  R(rx,ry,RW,.67,'rgba(255,255,255,.25)');
  // диван (графит, с кислотными подушками)
  const sx=112,sy=64;
  ob(sx,sy,24,80,'#3b3e52',0);
  R(sx,sy,6,80,'#2c2e40');R(sx+5.67,sy,T,80,OL); // спинка
  R(sx,sy,24,6,'#30324a');R(sx,sy+74,24,6,'#30324a');R(sx,sy+5.67,24,T,OL);R(sx,sy+74,24,T,OL);R(sx,sy,24,T,'#5a5e78');R(sx,sy+79.67,24,T,'#1a1b28');
  for(const yy of [sy+6,sy+29,sy+52]){R(sx+6,yy,18,22.67,'#454a62');R(sx+6,yy,18,T,'#5d6280');R(sx+6,yy+22.33,18,T,'#262838');R(sx+23.67,yy,T,23,'#262838');
    for(let i=0;i<30;i++)R(sx+6.5+hash(i,yy)*17,yy+.5+hash(yy,i)*21.5,T,T,hash(i,i+yy)<.5?'#4e536c':'#3d4158')}
  // плед
  R(sx+8,sy+48,16,10,OL);R(sx+8.33,sy+48.33,15.33,9.33,'#9b4dff');for(let i=0;i<5;i++)R(sx+8.33,sy+49.5+i*1.9,15.33,.67,'#c08aff');R(sx+8.33,sy+57,15.33,.67,'#6a2ad0');
  // подушки
  const pil=(x,y,w,h,c,p)=>{R(x-T,y-T,w+T*2,h+T*2,OL);R(x,y,w,h,c);R(x,y,w,T,lite(c,.4));R(x,y+h-.67,w,.67,dark(c,.3));R(x+w/2-T/2,y+1,T,h-2,dark(c,.15));
    if(p==='dot')for(let i=0;i<3;i++)for(let j=0;j<4;j++)R(x+1+i*1.6,y+1.2+j*2.4,.67,.67,lite(c,.6));if(p==='str')for(let j=1;j<h;j+=1.67)R(x,y+j,w,T,dark(c,.25))};
  pil(sx+6.67,sy+8,5.67,11,'#ff2e97','dot');pil(sx+6.67,sy+31,5.67,11,'#ffe23a','str');pil(sx+6.67,sy+60,5.67,10,'#22e5d4','dot');pil(sx+7.33,sy+20,5,7,'#f6f0ff');
  // стол у окна
  ob(112,8,112,22,'#f4f3fa',1.67);R(112,8,112,1,'#ffffff');
  // коврики-мышепады
  R(124,19,30,10,OL);GR(124.33,19.33,29.33,9.33,lg(124,0,154,0,['#ff7ad0','#9b6dff']));for(let i=0;i<6;i++)R(126+i*4.6,20+((i*3)%6),.67,.67,'#ffe6fb');
  R(172,19,30,10,OL);R(172.33,19.33,29.33,9.33,'#17141f');R(172.33,28,29.33,1,'#ff2a3a');
  // клавиатуры
  const kb=(x,y,base,key,acc)=>{R(x-T,y-T,15+T*2,4+T*2,OL);R(x,y,15,4,base);for(let i=0;i<14;i++)for(let j=0;j<3;j++)R(x+.5+i*1.03,y+.5+j*1.1,.67,.67,(i+j*3)%7===0?acc:key);R(x+3,y+3.4,8,.5,key)};
  kb(127,22.67,'#f4eefc','#d6cbe8','#ff6fc8');kb(176,22.67,'#1c1a24','#3a3646','#ff2a3a');
  // мыши
  ov(147.5,24.5,1.6,2.2,OL);ov(147.5,24.5,1.2,1.8,'#ffffff');R(147.3,23.2,T,1,'#ff6fc8');
  ov(196.5,24.5,1.6,2.2,OL);ov(196.5,24.5,1.2,1.8,'#26232e');R(196.3,23.2,T,1,'#ff2a3a');
  // мониторы (вид сверху: тонкая панель + подставка), экран светит вниз
  R(129.33,9.33,19.33,3.67,OL);GR(129.67,9.67,18.67,3,lg(0,9,0,13,['#3a3448','#1a1724']));R(129.67,12.33,18.67,.67,'#ff7ad0');R(136.5,13,4.5,3,OL);R(136.83,13,3.83,2.67,'#e6e0f0');
  R(169.33,9.33,25.33,3.67,OL);GR(169.67,9.67,24.67,3,lg(0,9,0,13,['#2c2a34','#121018']));R(169.67,12.33,24.67,.67,'#5ab8ff');R(180.5,13,4.5,3,OL);R(180.83,13,3.83,2.67,'#2a2830');
  // ПК Шмакодявки: белый корпус, стеклянная стенка с розово-фиолетовым RGB
  ob(114,9,12,12,'#f6f4fb',1.33);R(115.33,10.33,9.33,8,OL);GR(115.67,10.67,8.67,7.33,lg(115,10,124,18,['#ff4fd8','#7a3aff']));
  for(const [fx,fy] of [[118,13],[122,13],[120,16.5]]){circ(fx,fy,1.67,'#2a0a3a');circ(fx,fy,1.33,'#ffb6f0');circ(fx,fy,.67,'#ff4fd8');R(fx-T/2,fy-T/2,T,T,'#ffffff')}
  // ПК Микроба: чёрный, красные вентиляторы
  ob(206,9,13,12,'#1c1b22',1.33);R(207.33,10.33,10.33,8,OL);R(207.67,10.67,9.67,7.33,'#0a0a0e');
  for(const [fx,fy] of [[210,13],[214.5,13],[212.3,16.6]]){circ(fx,fy,1.67,'#3a0508');circ(fx,fy,1.33,'#ff2a3a');circ(fx,fy,.67,'#7a0d12');R(fx-T/2,fy-T/2,T,T,'#ffb0b0')}
  // цветок в горшке и планшет
  circ(159,15,4,OL);circ(159,15,3.67,'#c8572e');circ(159,15,3,'#3a2414');for(let k=0;k<7;k++){const a=k*.9;m.save();m.translate(159,15);m.rotate(a);ov(2.4,0,2.4,1,'#2a7a3a');ov(2.4,0,2,.67,'#4ad06a');m.restore()}
  for(const [fx,fy] of [[157.5,13],[161,15.5],[158.6,17.2]]){circ(fx,fy,1.2,'#ff2e60');circ(fx,fy,.5,'#ffe23a')}
  R(160,21.67,9,6.67,OL);R(160.33,22,8.33,6,'#16131e');GR(161,22.67,7,4.67,lg(161,22,168,27,['#36d7ff','#9b4dff']));
  // кружка и стикеры
  circ(164,12.5,1.67,OL);circ(164,12.5,1.33,'#ffe23a');circ(164,12.5,.8,'#4a2a14');
  for(let i=0;i<4;i++)R(199+i*1.5,11+(i%2),1.2,1.2,ACID[i]);
  // кресло Шмакодявки (белое с розовым) — спинкой к нам
  const ch=(x,y,c,acc,mesh)=>{ob(x+1,y,14,13,c,0);R(x+1,y+10,14,T,dark(c,.3));
    R(x-1,y+1,2.33,10,OL);R(x-.67,y+1.33,1.67,9.33,dark(c,.15));R(x+14.67,y+1,2.33,10,OL);R(x+15,y+1.33,1.67,9.33,dark(c,.15)); // подлокотники
    R(x+2,y+1.5,12,8,mesh?'#4a4f58':lite(c,.3));if(mesh){for(let i=0;i<12;i+=1.33)R(x+2+i,y+1.5,T,8,'#3a3f48')}else{R(x+5,y+1.5,6,8,acc);R(x+5,y+1.5,6,T,lite(acc,.4))}
    R(x+1,y+12,14,4,OL);R(x+1.33,y+12.33,13.33,3.33,mesh?'#6a7078':c);R(x+1.33,y+12.33,13.33,T,'#ffffff');if(!mesh){R(x+3,y+13,10,1.33,acc)}else for(let i=0;i<13;i+=1.33)R(x+1.5+i,y+12.5,T,3,'#555b63')};
  ch(128,34,'#f2eff8','#ff4fb0',false);ch(176,34,'#5d636c','#ff2a3a',true);
  // когтеточка-лежанка
  ob(208,32,16,22,'#d8c7a6',1.33);for(let j=0;j<20;j+=1.33)R(208.33,32.33+j,15.33,T,'#c2ae88');
  circ(216,41,7.33,OL);circ(216,41,7,'#9b7ad8');circ(216,41,5.33,'#c8b0ff');circ(216,41,4.33,'#e8dcff');for(let i=0;i<14;i++){const a=i*.449;R(216+Math.cos(a)*6.2-T/2,41+Math.sin(a)*6.2-T/2,.67,.67,'#f2e8ff')}
  circ(212.5,50.5,2.33,OL);circ(212.5,50.5,2,'#cbb48a');for(let i=0;i<4;i++)R(210.8,49+i*.9,3.4,T,'#a8925f');
  R(220,49.5,2.6,.67,OL);circ(221,52,1.2,'#ff2e97'); // игрушка-мышь
  // мольберт с холстом
  R(113,47.67,9,9,OL);R(113.33,48,1,8.33,'#7a4a2a');R(120.67,48,1,8.33,'#7a4a2a');R(113.33,50.33,8.33,1,'#7a4a2a');
  R(114,51,7,4,'#fbf4e6');R(114.5,51.5,2.5,1.5,'#ff2e97');R(117,52.5,2.5,1.67,'#22e5d4');R(118.5,51.3,1.5,1.2,'#ffe23a');R(115,53.3,2,.67,'#9b4dff');
  // стойка с гантелями
  ob(208,80,16,48,'#f2f0f8',1.33);
  const db=(y,c)=>{R(209,y,13,3,OL);R(210.67,y+1,9.67,1,'#8a8a96');for(const hx of [208.67,219]){R(hx,y-.67,3.33,4.33,OL);R(hx+T,y-.33,2.67,3.67,c);R(hx+T,y-.33,2.67,T,lite(c,.4))}};
  db(83.67,'#1c1b22');db(92.67,'#1c1b22');db(100.67,'#ff2e97');
  circ(216,110,3.67,OL);circ(216,110,3.33,'#7a3aff');circ(215,109,1.2,'#b48aff');R(214.5,105.5,3,1.67,OL);R(214.83,105.83,2.33,1,'#7a3aff'); // гиря
  R(211,116,11,8,OL);R(211.33,116.33,10.33,7.33,'#2a1a2e');R(211.33,116.33,10.33,T,'#4a3a50');NEON.lampPts=[];for(let i=0;i<=12;i++){const t=i/12;NEON.lampPts.push([212.5+t*7.5,121.5+Math.sin(t*9.4)*1.6-t*1.5])}
  // шкафы
  const ward=(x,y,w,h,dv)=>{ob(x,y,w,h,'#f4f2fa',1.33);if(dv)R(x+w/2-T/2,y+1,T,h-2.5,'#bcb6cc');R(x+w/2-1.6,y+h/2-2,.67,4,'#3a3446');R(x+w/2+1,y+h/2-2,.67,4,'#3a3446');
    for(let j=4;j<h-3;j+=7)R(x+1,y+j,w-2,T,'rgba(150,140,180,.25)')};
  ward(208,128,16,56,true);ward(112,145,16,39,true);
  // на шкафах: коробка, кактус, колонка
  R(210,131,5,4,OL);R(210.33,131.33,4.33,3.33,'#ff8a2a');R(212.3,131.33,.67,3.33,'#ffd08a');
  circ(219,133,2.33,OL);circ(219,133,2,'#c8572e');circ(219,133,1.4,'#3ad86a');R(218.8,131.6,T,T,'#ffffff');
  R(114,174,5,6,OL);R(114.33,174.33,4.33,5.33,'#1c1b22');circ(116.5,177,1.4,'#3a3a46');circ(116.5,177,.6,'#22e5d4');
  // картины на стенах — яркими рамками
  for(let i=0;i<8;i++){const c=ACID[i],y=67+i*9.5;R(109.33,y-T,3.33,7.67,OL);R(109.67,y,2.67,7,c);R(109.67,y,2.67,T,lite(c,.5));R(110.5,y+2,1,3,dark(c,.4))}
  for(let i=0;i<8;i++){const c=ACID[(i+3)%8],y=59+i*10.5;R(222.67,y-T,3.33,8.67,OL);R(223,y,2.67,8,c);R(223,y,2.67,T,lite(c,.5));R(223.67,y+2.5,1,3,dark(c,.4))}
}

// ---------- ПРИХОЖАЯ ----------
function hall(){
  // коврик у двери — кислотно-зелёный
  R(211.67,195.67,10.67,12.67,OL);R(212,196,10,12,'#7dff3a');for(let j=0;j<12;j+=2)R(212,196+j,10,.67,'#3ab82a');R(212,196,10,T,'#d0ff9a');
  // шкаф-купе в нише стены
  R(144,264,48,16,'#1a1024');ob(144,264.5,48,14.5,'#c98a3a',1.33,{noSh:true});
  const mir=(x)=>{R(x-T,265.67,22.67,11.67,OL);GR(x,266,22,11,lg(x,266,x+22,277,['#b8d8ff','#e6c8ff','#8ad8e8','#c0a8ff']));for(let i=0;i<4;i++){R(x+3+i*4.8,267,1,9,'rgba(255,255,255,.55)')}};
  mir(146);mir(169.33);R(167.67,265,1.67,13,'#8a5a20');R(147,277.67,44,.67,'#7a4a18');
  // обувница у стены и обувь
  ob(194,209,15,6,'#f4f2fa',1);
  const shoe=(x,c,s)=>{R(x-T,209.67,3.67,4.67,OL);R(x,210,3,4,c);R(x,210,3,T,lite(c,.4));R(x+.67,213,1.67,.67,s)};
  shoe(195.3,'#9a9ca8','#ffffff');shoe(198.9,'#ff6fb0','#1a1020');shoe(202.5,'#1c1b22','#555');shoe(206.1,'#ffe23a','#1c1b22');
  // корзина для белья
  ob(81,249,7,9,'#24222c',1);for(let j=0;j<8;j+=1.33)R(81.33,249.5+j,6.33,T,'#3a3646');R(82,249.67,5,1.67,'#e6e2f0');R(82.5,250,2,1,'#ff6fb0');
  // картины
  R(117.67,188.67,9.67,3.67,OL);GR(118,189,9,3,lg(118,0,127,0,['#ff8a2a','#ff2e97']));R(122,189.5,2,1,'#ffe23a');
  R(185.67,188.67,9.67,3.67,OL);GR(186,189,9,3,lg(186,0,195,0,['#22e5d4','#2a6aff']));R(188,190,1.5,1.5,'#ffffff');
  // входная дверь (медовое дерево)
  R(223.67,191.67,8.67,24.67,OL);R(224,192,8,24,'#d39a42');R(224,192,8,T,'#f0c070');
  R(225,193.5,6,9.5,'#b47a2a');R(225,205,6,9.5,'#b47a2a');for(let i=0;i<5;i++){R(225.5+i*1.2,194,T,8.5,'#c88a36');R(225.5+i*1.2,205.5,T,8.5,'#c88a36')}
  R(225,203.4,2.33,2.33,OL);R(225.33,203.67,1.67,1.67,'#ffe08a');R(229,197,1.33,1.33,'#1c1b22');
  for(let i=0;i<3;i++){R(204+i*4,190.5,1.33,1.67,OL);R(204.33+i*4,190.83,.67,1,'#d8d0e6')}
}

// ---------- ВАННАЯ: слева душ во всю стену, сверху раковина и унитаз, стиралка у левой стены ----------
function bath(){
  // душ во всю ширину (низ комнаты)
  R(8,240,64,24,'#141826');for(let j=0;j<24;j+=4)for(let i=0;i<64;i+=4){R(8+i+T,240+j+T,4-T,4-T,(i+j)/4%2?'#1f2538':'#232a40');R(8+i+T,240+j+T,4-T*2,T,'rgba(120,230,255,.18)')}
  circ(40,254,1.8,OL);circ(40,254,1.4,'#8a92a8');for(let i=0;i<4;i++)R(39+i*.6,253.5,T,1.2,'#2a2f40'); // трап
  circ(13,258,3.67,OL);circ(13,258,3.33,'#c8ccd8');for(let i=0;i<9;i++)R(11.5+(i%3)*1.2,256.6+Math.floor(i/3)*1.2,.4,.4,'#5a6070'); // лейка
  R(64,255,6.33,2.33,OL);R(64.33,255.33,5.67,1.67,'#3ad8a8');R(65,255.33,1.2,1.67,'#ff6fb0');R(67,255.33,1.2,1.67,'#ffe23a'); // полка с гелями
  R(8,238.67,64,2,OL);R(8,239,64,1.33,'#7ae8ff');R(8,239,64,T,'#ffffff');R(38,239,1,1.33,'#c8ccd8');
  GR(8,240.5,64,23.5,lg(8,240,72,264,['rgba(160,240,255,.12)','rgba(160,240,255,0)','rgba(160,240,255,.10)']));
  // полотенцесушитель с зелёными полотенцами (левый верхний угол)
  R(8.67,193.67,3.67,10.67,OL);R(9,194,3,10,'#c8ccd8');for(let i=0;i<5;i++)R(9,194.5+i*2,3,T,'#ffffff');
  R(8.5,195,4,4,OL);R(8.83,195.33,3.33,3.33,'#3ad86a');R(8.83,195.33,3.33,T,'#9affb0');R(8.5,199.5,4,3.5,OL);R(8.83,199.83,3.33,2.83,'#22b85a');
  // стиралка у левой стены
  ob(9,208,14,14,'#1c1b22',1.33);R(9.67,208.67,12.67,2,'#2e2c38');R(10.5,209.2,2,1,'#3ad8a8');R(13.5,209.2,1,1,'#ff2e97');
  circ(16,216,4.67,'#8a8a96');circ(16,216,4.2,OL);GR(12,212,8,8,rg(16,216,4,['#5ab8ff','#2a4aa8','#141832']));
  m.strokeStyle='rgba(255,255,255,.5)';m.lineWidth=T;m.beginPath();m.arc(16,216,2.6,3.5,5);m.stroke();
  // раковина с чёрным рифлёным ящиком
  ob(26,192,20,14,'#f6f6fb',2.67,{side:'#1c1b22'});for(let i=0;i<20;i+=1.33)R(26+i,203.33,T,2.67,'#2e2c38');
  ov(36,197.5,5.67,3.67,OL);ov(36,197.5,5.33,3.33,'#dfe6f0');ov(36,198,4,2.33,'#c6d2e0');circ(36,198.5,.67,'#5a6070');
  R(35,192.67,2,2,OL);R(35.33,193,1.33,1.67,'#c8ccd8');R(35.6,194.5,.8,1,'#a0a8b8');
  R(27.5,194,3,4,OL);R(27.83,194.33,2.33,3.33,'#ffffff');R(27.83,194.33,2.33,1,'#ff6fb0'); // ватные диски
  R(42,194,2.33,4.67,OL);R(42.33,194.33,1.67,4,'#3ad8a8');R(42.33,194.33,1.67,.67,'#ffffff'); // умывалка
  // унитаз за раковиной
  R(53.67,192.67,12.67,4.67,OL);R(54,193,12,4,'#f4f4fa');R(54,193,12,T,'#ffffff');R(59,193.6,2,1,'#c8ccd8');
  ov(60,201.5,4.33,4.67,OL);ov(60,201.5,4,4.33,'#f6f6fb');ov(60,202,2.8,3,'#d6e0ec');ov(60,202.4,1.8,2,'#a8c8e8');
  // коврик
  R(29.67,219.67,14.67,8.67,OL);R(30,220,14,8,'#2a2438');for(let i=0;i<7;i++)for(let j=0;j<4;j++)R(30.6+i*1.9,220.6+j*1.9,1,1,'#3a3450');
}

// ---------- ТУАЛЕТ: напротив двери унитаз, дальше раковина, в конце лоток ----------
function toilet(){
  // веник и швабра
  R(200.67,225.67,2.67,10.67,OL);R(201,226,2,10,'#c8954a');R(199.67,234.67,4.67,3.67,OL);R(200,235,4,3,'#ffe23a');for(let i=0;i<4;i++)R(200.3+i,235.3,T,2.6,'#c8a020');
  // унитаз (бачок у правой стены, напротив двери)
  R(218.67,233.67,5.67,12.67,OL);R(219,234,5,12,'#f6f6fb');R(219,234,T,12,'#ffffff');R(220.5,238.5,2,2,'#c8ccd8');
  ov(215.5,240,4.67,4,OL);ov(215.5,240,4.33,3.67,'#f6f6fb');ov(215,240,3,2.6,'#d6e0ec');ov(214.7,240,2,1.7,'#a8c8e8');
  // маленькая раковина
  R(218.67,249.67,5.67,8.67,OL);R(219,250,5,8,'#f6f6fb');R(219,250,5,T,'#ffffff');ov(220.6,254,1.6,2.6,'#c6d2e0');R(222.6,253.6,1,.8,'#a0a8b8');
  R(223.4,249,.6,10,'#e8fbff'); // зеркальце
  // домик-лоток Черсика — в самом конце
  ob(203,265,14,13,'#f0e6d4',1.33);R(205,267,10,7,'#e2d4ba');R(205,267,10,T,'#fff6e6');
  R(206.33,271,7.33,5.67,OL);R(206.67,271.33,6.67,5.33,'#2a1a2e');R(207,275,6,1.67,'#8a7a5a');for(let i=0;i<5;i++)R(207.3+i*1.2,275.4,.5,.5,'#b8a880');
  R(208,267.6,4,1.2,'#ff6fb0');R(208.5,267.9,.8,.6,'#ffffff');R(210.5,267.9,.8,.6,'#ffffff');
}

// ---------- СПАЛЬНЯ ----------
function bed(){
  // шкаф в верхнем левом углу
  ob(8,272,24,16,'#5a5e72',1.33);R(16,273,T,13.5,'#3e4256');R(24,273,T,13.5,'#3e4256');for(const xx of [14.6,17,22.6,25])R(xx,278,.67,4,'#c8ccd8');
  // столик Шмакодявки с зеркалом и пуфом
  ob(34,272,30,9,'#f4f2fa',1.33);R(41,272,16,1.67,OL);GR(41.33,272,15.33,1.33,lg(41,0,57,0,['#ffd6f0','#c8e8ff']));
  for(let i=0;i<6;i++){const c=['#ff2e97','#ffe23a','#9b4dff','#22e5d4','#ff8a2a','#ffffff'][i];R(36+i*1.6,274.5+(i%2),1,2.2,OL);R(36.2+i*1.6,274.7+(i%2),.6,1.8,c)}
  circ(59,276.5,2,OL);circ(59,276.5,1.67,'#ffb8dc');R(51,275,4,3,OL);R(51.33,275.33,3.33,2.33,'#26232e');
  circ(49,287,3.67,OL);circ(49,287,3.33,'#ff8a2a');circ(49,287,2.2,'#ffa858');
  // кровать (поменьше и ниже)
  ob(8,312,48,40,'#1e2a4e',0);
  R(8,312,5.33,40,'#1a2240');for(let i=0;i<4;i++)for(let j=0;j<2;j++){R(9+j*2,315+i*9,1,1,'#0e1428');R(9+j*2,315+i*9,1,T,'#3a4a78')}
  R(13,312,43,40,'#2a3a6a');R(13.33,313.5,10.67,37,'#e8ecf8');
  const pl2=(y)=>{R(14,y-T,9,12.67,OL);R(14.33,y,8.33,12,'#c8f0e0');R(14.33,y,8.33,T,'#ffffff');R(18.3,y+1,T,10,'#a8d8c4')};
  pl2(315);pl2(330);R(15,343.5,7,6,OL);R(15.33,343.83,6.33,5.33,'#ff6fb0');R(15.33,343.83,6.33,T,'#ffb8dc');
  R(23.67,312.67,32.33,38.67,OL);GR(24,313,32,38,lg(24,313,56,351,['#4a3ab8','#2a2a8a','#3a2a9a']));
  R(24,313,1.67,38,'#e8ecf8');R(25.67,313,T,38,'#b8bcd8');
  for(let i=0;i<18;i++){const sx=27+hash(i,41)*27,sy=316+hash(41,i)*33;R(sx,sy,.67,.67,i%3?'#ffe6a0':'#9affff');if(i%4===0)R(sx-.67,sy+T,2,T,'#ffe6a0')}
  for(let j=0;j<38;j+=6)R(24,313+j,32,T,'rgba(10,0,40,.35)');
  // тумбочка с лампой у изголовья
  ob(8,353,13,12,'#2e2c3a',1.33);circ(14,358.5,3.33,OL);circ(14,358.5,3,'#ffc87a');circ(14,358.5,1.8,'#fff0c8');R(17.4,362,2.4,1.33,OL);R(17.67,362.2,1.8,.9,'#36d7ff');
  // радиатор под окном
  R(25.67,364.67,36.67,3.67,OL);for(let i=0;i<36;i+=2){R(26+i,365,1.67,3,'#d8dce6');R(26+i,365,T,3,'#ffffff')}
  // телевизор на стене и тумба со свечами под ним
  ob(86,304,10,32,'#2a2632',1.33);
  for(const [cx2,cy2] of [[89,307],[91.5,309.5],[89,331],[91.5,333],[90,328]]){circ(cx2,cy2,1.2,OL);circ(cx2,cy2,.9,'#fff4e0');R(cx2-T/2,cy2-T/2,T,T,'#ffb030')}
  R(88,315,6,8,OL);R(88.33,315.33,5.33,7.33,'#3a2a4a');R(89,316,4,6,'#7a5aa8'); // книги/колонка
  R(95.33,301.67,3,34.67,OL);R(95.67,302,2.33,34,'#0e0c14');GR(95.67,302,.9,34,lg(0,302,0,336,['#ff4fd8','#36d7ff']));
  // круглый коврик у кровати
  ov(70,346,13,8,OL);ov(70,346,12.67,7.67,'#9b4dff');ov(70,346,10.5,6,'#b47aff');ov(70,346,7.5,4,'#9b4dff');ov(70,346,4,2.2,'#ff6fd8');
  R(66,357,4,2.33,OL);R(66.33,357.33,3.33,1.67,'#9a9ca8');
}

// ---------- КУХНЯ ----------
function kitchen(){
  R(104,285.67,120,2.33,OL);GR(104,286,120,1.67,lg(104,0,224,0,['#ff2e97','#ff8a2a','#ffe23a']));
  ob(152,288,72,14,'#2a2632',1.67);for(let i=0;i<60;i++)R(152.5+hash(i,5)*71,288.5+hash(5,i)*11.5,T,T,hash(i,1)<.5?'#423c4e':'#ff2e97');
  R(152,288,72,T,'#5a5468');
  R(165.67,289.67,11.67,8.67,OL);R(166,290,11,8,'#c8ccd8');R(167,291,9,6,'#9aa0b0');R(167,291,9,T,'#6a7080');circ(171.5,294,.67,'#3a3e4a');R(171,289,1.33,2.33,OL);R(171.33,289.33,.67,2,'#e8ecf4');
  circ(194,293.5,2.67,OL);circ(194,293.5,2.33,'#ff2e97');circ(193.4,292.9,.8,'#ffb0d8');R(196.2,293,1.4,1,'#ff2e97');
  R(199.67,289.67,8.67,8.67,OL);R(200,290,8,8,'#f4f2fa');R(201,291,5,5,'#1c1b22');R(201,291,5,T,'#36d7ff');R(206.6,291.5,.67,.67,'#7dff3a');
  R(209.67,289.67,2.67,6.67,OL);R(210,290,2,6,'#ffe23a');R(210,290,2,1,'#3a8a2a');
  ob(208,304,16,40,'#2a2632',1.33);R(210,312,12,12,OL);R(210.33,312.33,11.33,11.33,'#0e0c14');
  for(const [bx,by] of [[213,315],[219,315],[213,321],[219,321]]){circ(bx,by,2,'#2a2632');circ(bx,by,1.67,'#3a3646');circ(bx,by,1,'#1a1820');R(bx-T/2,by-1.67,T,.67,'#ff6a2a')}
  R(211,307,10,2.33,OL);R(211.33,307.33,9.33,1.67,'#4a4458');for(let i=0;i<4;i++)circ(212.5+i*2.4,308.2,.6,'#c8ccd8');
  R(210,328,12,13,OL);R(210.33,328.33,11.33,12.33,'#1c1b22');R(211,329,10,1,'#ff6a2a');
  ob(208,344,16,22,'#f4f2fa',1.67);R(208.33,355,15.33,T,'#bcb6cc');R(222,347,.67,6,'#9a94a8');R(222,357,.67,6,'#9a94a8');
  for(let i=0;i<6;i++)R(210+hash(i,7)*10,346+hash(7,i)*16,1.33,1.33,ACID[i]);R(212,348,4,3,'#ffffff');R(212.4,348.6,3,.4,'#9a94a8');R(212.4,349.6,2.4,.4,'#9a94a8');
  // стулья: два сверху, один справа
  const sc=(x,y,w,h)=>{R(x+1,y+1.33,w,h,'rgba(10,0,24,.35)');R(x-T,y-T,w+T*2,h+T*2,OL);R(x,y,w,h,'#ffffff');R(x+.67,y+.67,w-1.33,h-1.33,'#e6e0f2');for(let i=1;i<h-1;i+=1.67)R(x+1,y+i,w-2,T,'#c8c0dc')};
  sc(112,334,10,9);sc(134,334,10,9);sc(154,349,9,11);
  // вытянутый стол в углу: белый мрамор, ваза с фруктами
  ob(104,344,48,24,'#f4f2fa',1.67);for(let i=0;i<8;i++){const x0=106+hash(i,8)*42,y0=346+hash(8,i)*18;line(x0,y0,x0+3+hash(i,2)*5,y0+1+hash(2,i)*3,'rgba(150,140,190,.45)',T)}
  circ(140,357,5,OL);circ(140,357,4.67,'#22e5d4');circ(140,357,3.67,'#a8fff4');
  for(const [fx,fy,c] of [[138.5,355.5,'#ff8a2a'],[141.8,356,'#ffe23a'],[139.5,358.6,'#7dff3a'],[142,358.8,'#ff2e60']]){circ(fx,fy,1.5,OL);circ(fx,fy,1.2,c);R(fx-.5,fy-.7,.5,.5,'#ffffff')}
  R(110,348,7,5,OL);R(110.33,348.33,6.33,4.33,'#ff2e97');R(110.33,348.33,6.33,T,'#ffb0d8');
  R(119,358,5,5,OL);R(119.33,358.33,4.33,4.33,'#22e5d4');R(119.33,358.33,4.33,T,'#a8fff4');
  const bowl=(x,c)=>{circ(x,363,3.33,OL);circ(x,363,3,'#ff6fb0');circ(x,363,2,c);R(x-1,362,.67,.67,'rgba(255,255,255,.6)')};
  bowl(172.5,S.bowls?'#8a4a2a':'#e6e0f0');bowl(181.5,'#5ac8ff');
  if(S.bowls)for(let i=0;i<6;i++)R(171.2+hash(i,4)*2.4,361.8+hash(4,i)*2.2,.67,.67,'#c87a3a');
  R(102.67,309.67,2.67,12.67,OL);R(103,310,2,12,'#36d7ff');R(103,315.5,2,1,'#ffffff');
}

// ---------- СКЛАД ----------
function sklad(){
  // жёлто-чёрная разметка
  for(let i=0;i<12;i++){R(8+i*8,176,8,8,i%2?'#ffd23a':'#1a1820')}R(8,175.67,96,T,OL);
  for(const j of JUNK){const x=j[0]*C,y=j[1]*C,w=j[2]*C,h=j[3]*C,t=j[4];
    if(t==='W'||t==='M'||t==='D'){ob(x,y,w,h,'#7a3a2a',1.33);if(t==='W'){R(x+w/2-T/2,y+1,T,h-3,'#4a2018');R(x+w/2-2,y+h/2,.67,2,'#ffd23a');R(x+w/2+1.33,y+h/2,.67,2,'#ffd23a')}
      if(t==='M'){for(const mx of [x+12,x+26]){R(mx-T,y+1.67,10.67,h-3.67,OL);GR(mx,y+2,10,h-4.33,lg(mx,0,mx+10,0,['#9ab8d8','#d8c8ff','#8ab0c8']))}}
      if(t==='D'){R(x+2,y+2,w-4,h-4,'#1c1b22');for(let i=0;i<6;i++){circ(x+4.5+(i%2)*7,y+5+Math.floor(i/2)*6,2.2,OL);circ(x+4.5+(i%2)*7,y+5+Math.floor(i/2)*6,1.9,ACID[i]);circ(x+4.5+(i%2)*7,y+5+Math.floor(i/2)*6,.6,'#1c1b22')}}}
    else if(t==='B'||t==='X'){ob(x,y,w,h,t==='B'?'#b8844a':'#a07040',1.33);R(x+w/2-.67,y,1.33,h-1.33,'#e8d098');R(x+w/2-.67,y,1.33,T,'#fff0c0');
      if(t==='X'){R(x+1.5,y+1.5,w-3,.67,'#7a5028');R(x+1.5,y+h-3,w-3,.67,'#7a5028');R(x+1.5,y+1.5,.67,h-4,'#7a5028');R(x+w-2.2,y+1.5,.67,h-4,'#7a5028')}
      if(hash(x,y)<.4){R(x+2,y+2,3,2,'#ffffff');R(x+2.4,y+2.6,2,.4,'#ff2e60')}}
    else if(t==='c'){ob(x,y,w,h,'#5a2a3a',1);R(x+4,y+3,2,1,'#ffd23a');R(x+10,y+3,2,1,'#ffd23a')}
    else if(t==='T'){ob(x,y,w,h,'#d82a2a',1.33);R(x+3,y+2,10,1.33,OL);R(x+3.33,y+2.33,9.33,.67,'#3a3a46');R(x+1,y+h-3,w-2,T,'#8a1010')}
    else if(t==='R'){R(x-T,y+.67,w+T*2,6.67,OL);GR(x,y+1,w,6,lg(0,y+1,0,y+7,['#ff6fb0','#c82a6a','#7a1a4a']));for(let i=0;i<w;i+=4)R(x+i,y+1,T,6,'#ffd0e8')}
    else if(t==='C'){ob(x,y,w,h,'#7a5a3a',1.33);for(let k=2;k<h-2;k+=3)R(x+1,y+k,w-2,T,'#5a3a20');R(x+1,y+1,w-2,.67,'#a8805a')}
  }
  for(const k in S.opened){const b=BOXES[k];R(b.bx,b.by,b.bw,b.bh,'#1a1018');R(b.bx,b.by,b.bw,1.33,'#e8d098');R(b.bx+1,b.by+2,b.bw-2,b.bh-3,'#2a1a22')}
  m.strokeStyle='rgba(220,220,240,.4)';m.lineWidth=T;m.beginPath();m.moveTo(8,170);m.lineTo(18,180);m.moveTo(8,176);m.lineTo(14,180);m.moveTo(11,173);m.lineTo(8,179);m.moveTo(95,170);m.lineTo(103,162);m.moveTo(99,166);m.lineTo(103,170);m.stroke();
  if(S.skladLocked){R(79.67,183.67,24.67,8.67,OL);R(80,184,24,8,'#f4f2fa');R(80,184,24,T,'#ffffff');R(91.5,185,T,6,'#bcb6cc');R(95.5,186.6,2.33,2.33,OL);R(95.83,186.93,1.67,1.67,'#ffd23a')}
}

// ---------- окна ----------
function windowN(x,y,w,open){const c=ctx;
  c.fillStyle=OL;c.fillRect(x-.67,y+1,w+1.33,6);c.fillStyle='#f1e6f7';c.fillRect(x,y+1.67,w,4.67);
  const g=c.createLinearGradient(0,y+2.5,0,y+5.5);
  if(S.alarm){const p=Math.sin(tm*6)>0;g.addColorStop(0,p?'#ff2a4a':'#8a0a2a');g.addColorStop(1,'#2a0012')}else{g.addColorStop(0,'#2a1a6a');g.addColorStop(1,'#ff4fa8')}
  c.fillStyle=g;c.fillRect(x+1,y+2.67,w-2,2.67);
  if(!S.alarm)for(let i=0;i<w-2;i+=2.3){if(hash(i*7+x,y)>.55){c.fillStyle=hash(x,i)<.5?'#ffe8a0':'#9affff';c.fillRect(x+1+i,y+3+(hash(i,x)<.5?0:1),.67,.67)}}
  c.fillStyle='rgba(255,255,255,.55)';c.fillRect(x+2,y+2.67,1,2.67);c.fillRect(x+w/2,y+1.67,T,4.67);
  if(open){c.fillStyle='#120a1a';c.fillRect(x+w/2+T,y+2.67,w/2-1.33,2.67);c.fillStyle='#f1e6f7';c.fillRect(x+w/2,y-1.33,1,4)}
}

// ---------- сборка карты ----------
function buildN(){
  m.clearRect(0,0,mapCv.width,mapCv.height);
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const r=grid[y][x];if(r!==null)floorN(r,x,y)}
  drawLiving();drawHall();drawBath();drawToilet();drawBed();drawKitchen();drawSklad();
  walls();
  mapDirty=false;LMd=true;
}
buildMap=function(){if(!NEON.on)return O.buildMap();buildN()};
drawLiving=function(){NEON.on?living():O.drawLiving()};
drawHall=function(){NEON.on?hall():O.drawHall()};
drawBath=function(){NEON.on?bath():O.drawBath()};
drawToilet=function(){NEON.on?toilet():O.drawToilet()};
drawBed=function(){NEON.on?bed():O.drawBed()};
drawKitchen=function(){NEON.on?kitchen():O.drawKitchen()};
drawSklad=function(){NEON.on?sklad():O.drawSklad()};
box=function(x,y,w,h,b,hi,lo){if(!NEON.on)return O.box(x,y,w,h,b,hi,lo);ob(x,y,w,h,b,1.33)};
drawWindowH=function(x,y,w,open){NEON.on?windowN(x,y,w,open):O.drawWindowH(x,y,w,open)};

// ---------- свет: карта освещения (multiply) ----------
const LM=document.createElement('canvas');LM.width=GW*C;LM.height=GH*C;const lm=LM.getContext('2d');let LMd=true,LMkey='';
const AMB={living:[140,108,175],hall:[118,108,150],bath:[120,140,170],toilet:[160,118,150],bed:[110,98,160],kitchen:[150,128,150],sklad:[120,108,118],skladdoor:[118,108,150],entrance:[118,108,150]};
function L(x,y,r,col,a){const g=lm.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(.45,`rgba(${col},${a*.45})`);g.addColorStop(1,`rgba(${col},0)`);lm.fillStyle=g;lm.fillRect(x-r,y-r,r*2,r*2)}
function cone(x,y,w,len,col,a){const g=lm.createLinearGradient(0,y,0,y+len*(len>0?1:1));g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);lm.fillStyle=g;lm.beginPath();lm.moveTo(x,y);lm.lineTo(x+w,y);lm.lineTo(x+w+w*.5,y+len);lm.lineTo(x-w*.5,y+len);lm.closePath();lm.fill()}
function bakeLM(){
  lm.globalCompositeOperation='source-over';lm.fillStyle='#000';lm.fillRect(0,0,LM.width,LM.height);
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const r=grid[y][x];if(r===null)continue;const a=AMB[r]||[140,130,160];lm.fillStyle=`rgb(${a[0]},${a[1]},${a[2]})`;lm.fillRect(x*C-1,y*C-1,C+2,C+2)}
  lm.globalCompositeOperation='lighter';
  const al=S.alarm;
  // гостиная: неон home, лента, мониторы, лампа, луна из окон
  L(162,10,60,'255,60,200',.55);L(120,15,26,'200,90,255',.55);L(212,15,22,'255,40,60',.5);
  L(139,22,30,'150,190,255',.45);L(182,22,30,'120,190,255',.45);
  L(216,120,44,'255,130,40',.6);
  for(let y=16;y<184;y+=24){L(114,y,22,'40,255,150',.22);L(222,y,22,'40,255,150',.22)}
  cone(122,8,26,70,'130,140,255',.18);cone(170,8,34,80,'130,140,255',.18);
  L(172,110,40,'255,200,120',.12);
  // прихожая: три точечных светильника
  for(const [x,y] of [[120,226],[168,226],[208,222]])L(x,y,44,'255,214,170',.75);
  L(122,276,26,'255,226,190',.35);
  // ванная: LED-зеркало, душ
  L(36,196,38,'170,240,255',.7);L(40,252,30,'60,220,255',.35);L(16,216,16,'60,140,255',.35);
  // туалет
  L(212,250,30,'255,190,230',.55);
  // спальня: ночник и луна
  L(14,358,40,'255,180,90',.65);L(92,318,30,'120,120,255',.35);L(90,308,14,'255,190,90',.4);L(90,331,14,'255,190,90',.4);L(59,277,18,'255,200,240',.35);cone(26,368,36,-60,'110,120,255',.25);
  // кухня: подсветка столешницы, лампа над столом, холодильник, луна
  for(let x=158;x<224;x+=12)L(x,302,18,'255,210,150',.35);
  L(128,356,40,'255,214,140',.6);L(216,356,22,'200,240,255',.25);cone(124,368,36,-60,'110,120,255',.22);
  // склад
  L(56,40,50,'255,220,140',.35);
  if(al){L(140,8,90,'255,20,50',.35);L(140,370,70,'255,20,50',.35);L(44,370,50,'255,20,50',.35)}
  // стены — без затемнения
  lm.globalCompositeOperation='source-over';
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(grid[y][x]===null){lm.fillStyle='#e8e0f4';lm.fillRect(x*C,y*C,C,C)}
  LMd=false;
}

// ---------- новая планировка (правки 04.11) ----------
const NEWCELLS=[
  [14,1,14,3],[16,4,2,2],[26,4,2,3],[14,8,3,10],[14,6,1,2],[26,10,2,6],[26,16,2,7],[14,18,2,5], // гостиная
  [18,33,6,2],[10,31,1,1],                                   // прихожая: шкаф в нише
  [1,30,8,3],[1,26,2,2],[3,24,3,2],[7,24,1,2],               // ванная: душ, стиралка, раковина, унитаз
  [25,33,2,2],[27,29,1,2],[27,31,1,1],                       // туалет
  [1,34,3,2],[4,34,4,1],[1,39,6,5],[1,44,2,2],[11,38,1,4],   // спальня
  [19,36,9,2],[26,38,2,5],[26,43,2,3],[13,43,6,3],           // кухня
];
const itOf=re=>IT.find(i=>{try{return re.test(i.label())}catch(e){return false}});
const IT_SINK=itOf(/ящик под раковиной/),IT_MIR=itOf(/зеркало/);
function layout(on){
  for(let y=33;y<=34;y++)for(let x=18;x<=23;x++)grid[y][x]=on?'hall':null;
  for(let i=solids.length-1;i>=0;i--){const s=solids[i];if(!(s.x<104&&s.y<184))solids.splice(i,1)}
  for(const r of (on?NEWCELLS:SOLID_CELLS))solids.push({x:r[0]*C,y:r[1]*C,w:r[2]*C,h:r[3]*C});
  solids.push(on?{x:194,y:209,w:15,h:6}:{x:200,y:193,w:20,h:6});
  if(IT_SINK){IT_SINK.x=on?36:44;IT_SINK.y=on?213:214}
  if(IT_MIR){IT_MIR.y=on?256:244}
  mapDirty=true;
}
NEON.layout=layout;

// ---------- фоны локаций: свои цвета и 5 узоров ----------
// pat: 0 полосы, 1 шахматка, 2 точки-полутон, 3 зигзаг, 4 круги-волны
const BGP=NEON.BGP={
  living:{c:['#ff2e97','#7a1fff','#ff3df2'],pat:0},
  hall:{c:['#00c2b8','#1f4dff','#7dff3a'],pat:1},
  bath:{c:['#22e5d4','#1a2a9a','#9affff'],pat:2},
  toilet:{c:['#ff5fb0','#ff8a2a','#ffe23a'],pat:3},
  bed:{c:['#5a1fd0','#1a0a5a','#ff4fd8'],pat:4},
  kitchen:{c:['#7dff3a','#00a896','#ffe23a'],pat:1},
  sklad:{c:['#ff3a2a','#5a0a3a','#ff8a2a'],pat:0},
};
let bgCur='living',bgPrev=null,bgT=1;
NEON.setBg=k=>{if(k&&BGP[k]&&k!==bgCur){bgPrev=bgCur;bgCur=k;bgT=0}};
function bgPattern(c,p,t,col){c.fillStyle=col;
  if(p===0){const off=(t*7)%12;for(let i=-H;i<W+H;i+=12){c.beginPath();c.moveTo(i+off,0);c.lineTo(i+off+5,0);c.lineTo(i+off+5-H,H);c.lineTo(i+off-H,H);c.closePath();c.fill()}}
  else if(p===1){const s=14,o=(t*5)%(s*2);c.save();c.translate(W/2,H/2);c.rotate(.42);for(let y=-260;y<260;y+=s)for(let x=-260;x<260;x+=s)if(((x+y)/s)%2===0)c.fillRect(x+o,y,s,s);c.restore()}
  else if(p===2){const s=10;for(let y=-s;y<H+s;y+=s)for(let x=-s;x<W+s;x+=s){const xx=x+((y/s)%2)*s/2,r=1.2+1.3*(.5+.5*Math.sin(t*2-(xx+y)*.03));c.beginPath();c.arc(xx,y+((t*4)%s),r,0,7);c.fill()}}
  else if(p===3){const s=12,o=(t*8)%(s*2);c.lineWidth=3.5;c.strokeStyle=col;for(let y=-s*2;y<H+s*2;y+=s*2){c.beginPath();for(let x=-s;x<=W+s;x+=s)c.lineTo(x,y+o+((x/s)%2?s*.6:0));c.stroke()}}
  else if(p===4){const cx=W*.5+Math.sin(t*.3)*60,cy=H*.5+Math.cos(t*.25)*30;c.lineWidth=4;c.strokeStyle=col;const o=(t*10)%16;for(let r=o;r<420;r+=16){c.beginPath();c.arc(cx,cy,r,0,7);c.stroke()}}
}
function bgOne(k,a){const P=BGP[k]||BGP.living,t=tm,c=ctx,[c1,c2,c3]=P.c,s=.5+.5*Math.sin(t*.35);
  c.save();c.globalAlpha=a;
  const ang=t*.08,dx=Math.cos(ang)*W*.6,dy=Math.sin(ang)*H*.6;
  const g=c.createLinearGradient(W/2-dx,H/2-dy,W/2+dx,H/2+dy);g.addColorStop(0,mix(c1,c2,s*.6));g.addColorStop(1,mix(c2,c1,s*.35));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.globalAlpha=a*.2;bgPattern(c,P.pat,t,'#000');
  c.globalAlpha=a*.12;c.save();c.translate(2,2);bgPattern(c,P.pat,t,'#ffffff');c.restore();
  c.globalAlpha=a;c.globalCompositeOperation='lighter';const rx=W*(.5+.4*Math.sin(t*.4)),ry=H*(.5+.3*Math.cos(t*.3));const r=c.createRadialGradient(rx,ry,0,rx,ry,170);const h=hx(c3);r.addColorStop(0,`rgba(${h[0]},${h[1]},${h[2]},.35)`);r.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=r;c.fillRect(0,0,W,H);
  c.restore()}
function bg(){const rm=roomAt(pl.x,pl.y);if(rm&&BGP[rm])NEON.setBg(rm);
  bgT=Math.min(1,bgT+.02);if(bgPrev&&bgT<1)bgOne(bgPrev,1);bgOne(bgCur,bgPrev&&bgT<1?bgT:1)}

// ---------- окно диалога: пиксельный градиент вместо полосок ----------
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const _rdl=renderDlg;
renderDlg=function(){
  if(!NEON.on||!dlg)return _rdl.apply(this,arguments);
  const L0=dlg.lines[dlg.i],who=L0.w,[bd,bl]=BG[who]||['#222','#aaa'];
  u.fillStyle='rgba(6,3,12,.9)';u.fillRect(0,H-50,W,50);u.fillStyle=bl;u.fillRect(0,H-50,W,1);
  const bob=Math.sin(tm*4)*1.2,X0=6,Y0=H-74,S2=2;
  const cols=[dark(bd,.35),bd,mix(bd,bl,.3),mix(bd,bl,.55),mix(bl,'#ffffff',.15)];
  const ph=Math.sin(tm*.9)*.25;
  for(let j=0;j<35;j++)for(let i=0;i<35;i++){
    const dx=(i-17)/17,dy=(j-14)/19,rad=Math.sqrt(dx*dx+dy*dy);
    let v=(1-rad)*2.6+(j/35)*.9+ph; v=clamp(v,0,cols.length-1.001);
    const k=Math.floor(v+(BAY[(j%4)*4+(i%4)]/16-.5)*.9);u.fillStyle=cols[clamp(k,0,cols.length-1)];u.fillRect(X0+i*S2,Y0+j*S2,S2,S2)}
  u.fillStyle=OL;u.fillRect(X0-1,Y0-1,72,1);u.fillRect(X0-1,Y0+70,72,1);u.fillRect(X0-1,Y0,1,70);u.fillRect(X0+70,Y0,1,70);
  u.strokeStyle=bl;u.lineWidth=.8;u.strokeRect(X0,Y0,70,70);
  window.__dlgRim=bl;drawPortrait(who,9,H-71+bob,dlg.shown<L0.t.length);
  uiFont(6.2,true);u.fillStyle=NCOL[who];u.fillText(NAME[who],84,H-39);
  uiFont(6.2,false);u.fillStyle='#f2eefa';
  const lines=wrap(L0.t.slice(0,Math.floor(dlg.shown)),W-96);lines.forEach((l,i)=>u.fillText(l,84,H-29+i*8));
  if(dlg.shown>=L0.t.length&&Math.floor(tm*2)%2===0){u.fillStyle=bl;u.fillText('▼',W-12,H-6)}
};

// свечение (additive) каждый кадр
function glow(c,x,y,r,col,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
function neonText(){const c=ctx;
  // «home» розовым неоном на стене между окнами
  const fl=S.alarm?(.6+.4*Math.sin(tm*20)):1;
  c.save();c.globalAlpha=fl;c.font='bold 6px "Brush Script MT","Segoe Script",cursive';c.textAlign='center';c.textBaseline='middle';
  c.shadowColor='#ff3dc8';c.shadowBlur=6;c.strokeStyle='#ff3dc8';c.lineWidth=1.2;c.strokeText('home',162,4.3);c.fillStyle='#ffe0f6';c.fillText('home',162,4.3);c.shadowBlur=0;c.restore();
  // оранжевая волна
  const P=NEON.lampPts;if(P){c.save();c.lineCap='round';c.lineJoin='round';c.shadowColor='#ff8a2a';c.shadowBlur=5;c.strokeStyle='#ff7a1a';c.lineWidth=1.4;c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.shadowBlur=0;c.strokeStyle='#fff0c0';c.lineWidth=.5;c.stroke();c.restore()}
  // LED-лента гостиной
  c.save();c.globalAlpha=.8+.1*Math.sin(tm*2.3);c.fillStyle='#5affb0';c.fillRect(112,10.4,112,T);c.fillRect(112,181.6,112,T);c.fillRect(110.3,8,T,176);c.fillRect(225.4,8,T,176);c.restore();
  // зеркало ванной: LED-полоса
  c.fillStyle='#e8fbff';c.fillRect(27,190.3,18,.67);
  // лампа над кухонным столом (абажур сверху)
  c.fillStyle='rgba(10,0,24,.35)';c.beginPath();c.ellipse(129.5,358.5,4.6,4.6,0,0,7);c.fill();
  c.fillStyle=OL;c.beginPath();c.arc(128,356,4.33,0,7);c.fill();c.fillStyle='#ffe23a';c.beginPath();c.arc(128,356,4,0,7);c.fill();c.fillStyle='#fff6c8';c.beginPath();c.arc(128,356,1.6,0,7);c.fill();
  // точечные светильники прихожей
  
  // лампочка на складе
  if(!S.skladLocked){c.fillStyle='#3a3446';c.fillRect(55.6,30,.67,8);c.fillStyle='#fff0a0';c.beginPath();c.arc(56,40,1.4,0,7);c.fill()}
}
function glows(){const c=ctx,fl=.88+Math.sin(tm*2.3)*.06+(Math.random()<.02?-.2:0);
  c.save();c.globalCompositeOperation='lighter';
  glow(c,162,5,30,'255,60,200',.45*fl);glow(c,216,120,22,'255,120,30',.5*fl);
  glow(c,120,15,12,'210,90,255',.45);glow(c,212,15,10,'255,40,60',.45);
  glow(c,139,13,16,'255,120,220',.18+.05*Math.sin(tm*3));glow(c,182,13,16,'90,180,255',.18+.05*Math.sin(tm*2.1));
  glow(c,36,193,14,'200,250,255',.4);glow(c,128,356,18,'255,220,120',.35);glow(c,14,358,12,'255,190,100',.4);for(const [x,y] of [[89,307],[91.5,309.5],[89,331],[91.5,333],[90,328]])glow(c,x,y,3+Math.random()*.6,'255,170,60',.5);glow(c,96,319,12,'200,120,255',.25+.08*Math.sin(tm*3));
  for(const [x,y] of [[120,226],[168,226],[208,222]])glow(c,x,y,10,'255,236,210',.35);
    if(!S.skladLocked)glow(c,56,40,22,'255,230,150',.35);
  if(S.alarm){const p=.5+.5*Math.sin(tm*5);glow(c,140,0,70,'255,20,40',.3*p);glow(c,140,372,60,'255,20,40',.3*p);glow(c,44,372,40,'255,20,40',.3*p)}
  if(pl.sit)glow(c,184,26,30,'255,40,40',.3+.2*Math.sin(tm*14));
  c.restore();
}

// ---------- новый кадр квартиры ----------
function renderN(){
  ctx.setTransform(Q,0,0,Q,0,0);
  if(mapDirty)buildMap();
  const key=S.alarm+'|'+S.skladLocked;if(LMd||key!==LMkey){LMkey=key;bakeLM()}
  ctx.imageSmoothingEnabled=false;
  bg();
  let sx=0,sy=0;if(S.shake>0){sx=rnd(-3,3)*S.shake;sy=rnd(-3,3)*S.shake}
  ctx.save();ctx.translate(Math.round(-camX+sx),Math.round(-camY+sy));
  // тень дома на фоне
  ctx.fillStyle='rgba(20,0,40,.45)';ctx.fillRect(4,5,GW*C,GH*C);
  ctx.drawImage(mapCv,0,0,GW*C,GH*C);
  drawWindowH(120,0,32,false);drawWindowH(168,0,40,false);drawWindowH(72,0,24,false);
  drawWindowH(120,368,40,false);drawWindowH(24,368,40,S.windowOpen);
  if(S.windowOpen){const f=Math.sin(tm*3)*2;ctx.fillStyle='#ff6fb0';ctx.fillRect(22,360+f*.5,3,8);ctx.fillRect(64,360-f*.5,3,8)}
  else{ctx.fillStyle='#ff6fb0';ctx.fillRect(20,361,4,6);ctx.fillRect(64,361,4,6)}
  if(!S.bat&&!S.skladLocked){ctx.fillStyle=OL;ctx.fillRect(48.67,97.67,14.67,2.67);ctx.fillStyle='#c8843a';ctx.fillRect(49,98,14,2);ctx.fillStyle='#1c1b22';ctx.fillRect(49,98,4,2)}
  if(cat.mode!=='walk'&&cat.mode!=='sleep'&&cat.mode!=='eat')cat.ph=0;
  drawCat(sprC.getContext('2d'),cat.mode==='walk'?'walk':cat.mode==='sleep'?'sleep':'idle',tm,cat.ph);
  if(cat.mode!=='sleep')shadowBlob(cat.x,cat.y,5);
  spr(sprC,cat.x,cat.y,cat.mode==='sleep'?0:cat.a+(cat.mode==='eat'?Math.sin(tm*10)*.06:0));
  drawShmak(sprS.getContext('2d'),tm);
  if(shmak.mode==='sit')spr(sprS,shmak.x,shmak.y,S.step>=7&&S.step<10?-Math.PI/2+Math.sin(tm*.7)*.6:-Math.PI/2);
  else{const mv=shmak.mode==='walk';legs(legS.getContext('2d'),shmak.ph,mv,'#f2cab2','#111116');
    const h=shmak.hug,jump=h>1.1?Math.sin((1.6-h)/.5*Math.PI)*5:0;
    shadowBlob(shmak.x,shmak.y,5);
    ctx.save();ctx.translate(Math.round(shmak.x+(h>0?Math.min(4,(1.6-h)*10):0)),Math.round(shmak.y-jump));const sc=1+jump*.04;ctx.scale(sc,sc);
    ctx.save();ctx.rotate(shmak.a);ctx.drawImage(legS,-12,-12,24,24);ctx.restore();ctx.rotate(shmak.a);ctx.drawImage(sprS,-12,-12,24,24);ctx.restore()}
  if(!pl.sit){legs(legCv.getContext('2d'),pl.ph,pl.mv,'#1c1c22','#9a9ca2');shadowBlob(pl.x,pl.y,6);spr(legCv,pl.x,pl.y,pl.mv?pl.ma:pl.a)}
  drawMikrob(sprM.getContext('2d'),S.pistol?'pistol':S.bat?'bat':null);
  spr(sprM,pl.x,pl.y,pl.a);
  for(const p of parts){if(p.c==='heart'){ctx.fillStyle=`rgba(255,80,160,${Math.min(1,p.life)})`;const x=Math.round(p.x),y=Math.round(p.y);ctx.fillRect(x,y,1,1);ctx.fillRect(x+2,y,1,1);ctx.fillRect(x,y+1,3,1);ctx.fillRect(x+1,y+2,1,1);continue}
    if(p.c==='stink'){ctx.fillStyle=`rgba(140,255,60,${Math.min(.7,p.life*.35)})`;ctx.fillRect(Math.round(p.x),Math.round(p.y),2,2)}
    else{ctx.fillStyle=`rgba(230,220,255,${Math.min(.5,p.life*.2)})`;ctx.fillRect(Math.round(p.x),Math.round(p.y),1,1)}}
  // освещение: умножение на карту света
  ctx.save();ctx.imageSmoothingEnabled=true;ctx.globalCompositeOperation='multiply';ctx.drawImage(LM,0,0,GW*C,GH*C);ctx.restore();ctx.imageSmoothingEnabled=false;
  neonText();
  ctx.restore();
  // тьма склада
  sh.globalCompositeOperation='source-over';sh.clearRect(0,0,W,H);
  const ox=-camX+sx,oy=-camY+sy;
  sh.fillStyle=S.skladLocked?'rgba(8,2,16,1)':(window.UP&&UP.armOn&&UP.armOn())?'rgba(0,0,0,0)':'rgba(4,0,10,.8)';sh.fillRect(ox+8,oy+8,96,176);
  sh.globalCompositeOperation='destination-out';
  if(!S.skladLocked){radial(sh,ox+56,oy+40,46,'rgba(255,255,255,A)',.65);
    if(roomAt(pl.x,pl.y)==='sklad')radial(sh,pl.x+ox+Math.cos(pl.a)*12,pl.y+oy+Math.sin(pl.a)*12,52,'rgba(255,255,255,A)',.95)}
  ctx.drawImage(shadow,0,0,W,H);
  ctx.save();ctx.translate(ox,oy);glows();ctx.restore();
  // виньетка
  const v=ctx.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,H*1.05);v.addColorStop(0,'rgba(10,0,30,0)');v.addColorStop(1,'rgba(10,0,30,.45)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
  if(S.alarm){ctx.fillStyle=`rgba(255,0,30,${.05+.04*Math.sin(tm*5)})`;ctx.fillRect(0,0,W,H)}
  if(S.fade>0){ctx.fillStyle=`rgba(0,0,0,${Math.min(1,S.fade)})`;ctx.fillRect(0,0,W,H)}
  trFade();renderUI();
}
render=function(){
  if(!NEON.on||(state==='play'&&(cut||scene==='yard'))||scene!=='flat')return O.render.apply(this,arguments);
  renderN();
};

// ================= ВСЯ ИГРА: уровни глав =================
// Палитры фона за стенами: у каждой локации своя (3 цвета) и свой узор
const LPAL=[['#ff2e97','#7a1fff','#ff3df2'],['#00c2b8','#1f4dff','#7dff3a'],['#22e5d4','#1a2a9a','#9affff'],['#ff5fb0','#ff8a2a','#ffe23a'],
  ['#5a1fd0','#1a0a5a','#ff4fd8'],['#7dff3a','#00a896','#ffe23a'],['#ff3a2a','#5a0a3a','#ff8a2a'],['#ff3df2','#1fd0ff','#ffffff'],
  ['#b4ff2a','#ff2e97','#2a0a4a'],['#ff7a1a','#c8007a','#ffd23a'],['#36d7ff','#ff4fd8','#5a1fd0'],['#00ffb0','#00406a','#c8ff4a'],
  ['#ff2e60','#2a1fff','#22e5d4'],['#e8ff3a','#00b39a','#ff3df2']];
const LV={}; // ручные назначения: LV[id]={c:[..],pat:n}
NEON.LV=LV;
// ручные правки локаций (04.11)
LV.anis10={c:['#ff2e97','#5a0a3a','#ffe23a'],pat:4,floors:[[210,160,'#ff2e97']],forceAcid:1};
LV.top7={c:['#7a1fff','#1a0a5a','#22e5d4'],pat:2,floors:[[280,200,'~#22e5d4']]};
LV.main7={c:['#ff3a2a','#2a0a1a','#ff8a2a'],pat:3};
LV.so_dns={c:['#ff7a1a','#2a0a1a','#ffe23a'],pat:0};
LV.so_lenta={c:['#1f4dff','#ffe23a','#22e5d4'],pat:1};
function hstr(s){let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
function lvPal(L){if(LV[L.id])return LV[L.id];const h=hstr(String(L.id||'x'));return{c:LPAL[h%LPAL.length],pat:(h>>4)%5}}
NEON.outside=function(L,sx,sy){const P=lvPal(L);const k='lv_'+L.id;if(!BGP[k])BGP[k]=P;
  bgOne(k,1);if(L.dark>0){ctx.fillStyle=`rgba(4,2,12,${Math.min(.55,L.dark*.6)})`;ctx.fillRect(0,0,W,H)}};

// Однократная стилизация фона уровня: светлые стены HM с контуром, контраст и насыщенность, тени от мебели
NEON.stylize=function(L){const cv=L.bg,w=cv.width,h=cv.height;if(w*h>1.25e7)return;const q=cv._q||Q,TQ=TS*q,gw=L.gw,gh=L.gh,G=L.g;
  const g=cv.getContext('2d');let id;try{id=g.getImageData(0,0,w,h)}catch(e){return}const d=id.data,o=new Uint8ClampedArray(d);
  const cell=(px,py)=>{const cx=(px/TQ)|0,cy=(py/TQ)|0;if(cx<0||cy<0||cx>=gw||cy>=gh)return 1;return G[cy*gw+cx]};
  // какие клетки стен — «простые» (однотонные тёмные): их делаем светлыми стенами HM
  const plain=new Uint8Array(gw*gh);
  const nearOpen=(cx,cy)=>{for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const x=cx+i,y=cy+j;if(x>=0&&y>=0&&x<gw&&y<gh&&G[y*gw+x]!==1)return true}return false};
  const VC=L._voidC,vr=VC>>16&255,vg=VC>>8&255,vb=VC&255,massC=new Uint8Array(gw*gh);
  for(let cy=0;cy<gh;cy++)for(let cx=0;cx<gw;cx++){if(G[cy*gw+cx]!==1)continue;const p0=((cy*TQ+(TQ>>1))*w+cx*TQ+(TQ>>1))*4;if(p0>=o.length||o[p0+3]<200)continue;
    const lum=(o[p0]+o[p0+1]+o[p0+2])/3;if(lum>78)continue;
    const mass=VC!=null&&Math.abs(o[p0]-vr)+Math.abs(o[p0+1]-vg)+Math.abs(o[p0+2]-vb)<=24;if(!mass&&!nearOpen(cx,cy))continue;if(mass)massC[cy*gw+cx]=1;let ok=0,n=0;
    for(let j=0;j<TQ;j+=2)for(let i=0;i<TQ;i+=2){const px=cx*TQ+i,py=cy*TQ+j;if(px>=w||py>=h)continue;n++;const p=(py*w+px)*4;if(o[p+3]>=200&&Math.abs(o[p]-o[p0])+Math.abs(o[p+1]-o[p0+1])+Math.abs(o[p+2]-o[p0+2])<=48)ok++}
    if(n&&ok/n>=.6)plain[cy*gw+cx]=1}
  const sh=Math.round(1.33*q),ol=Math.max(1,Math.round(q*.67));
  // стены как в HM: полоса фиксированной толщины от края пола, глубже — прозрачно (виден фон)
  const WT=Math.round((NEON.WALL||6)*q),INF=65000,dist=new Uint16Array(w*h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const cx=(x/TQ)|0,cy=(y/TQ)|0;const k=cy*gw+cx;dist[y*w+x]=(cx<gw&&cy<gh&&G[k]!==1)?0:INF}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;let v=dist[i];if(!v)continue;if(x>0&&dist[i-1]+1<v)v=dist[i-1]+1;if(y>0){if(dist[i-w]+1<v)v=dist[i-w]+1;if(x>0&&dist[i-w-1]+1<v)v=dist[i-w-1]+1;if(x<w-1&&dist[i-w+1]+1<v)v=dist[i-w+1]+1}dist[i]=v}
  for(let y=h-1;y>=0;y--)for(let x=w-1;x>=0;x--){const i=y*w+x;let v=dist[i];if(!v)continue;if(x<w-1&&dist[i+1]+1<v)v=dist[i+1]+1;if(y<h-1){if(dist[i+w]+1<v)v=dist[i+w]+1;if(x<w-1&&dist[i+w+1]+1<v)v=dist[i+w+1]+1;if(x>0&&dist[i+w-1]+1<v)v=dist[i+w-1]+1}dist[i]=v}
  const isPlainC=(px,py)=>{const cx=(px/TQ)|0,cy=(py/TQ)|0;return cx>=0&&cy>=0&&cx<gw&&cy<gh&&plain[cy*gw+cx]};
  const isPlain=(px,py)=>isPlainC(px,py)&&dist[py*w+px]<=WT;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(dist[y*w+x]>WT&&isPlainC(x,y)&&massC[((y/TQ)|0)*gw+((x/TQ)|0)])d[(y*w+x)*4+3]=0}
  // мелкие «островки» (вентиляция на крыше и т.п.) посреди пустоты — тоже в пустоту; крупные объекты (лестницы) не трогаем
  {const tr=new Uint8Array(gw*gh);for(let cy=0;cy<gh;cy++)for(let cx=0;cx<gw;cx++){const px=cx*TQ+(TQ>>1),py=cy*TQ+(TQ>>1);if(px<w&&py<h&&(d[(py*w+px)*4+3]===0||o[(py*w+px)*4+3]<10))tr[cy*gw+cx]=1}
   const cand=new Uint8Array(gw*gh);for(let cy=0;cy<gh;cy++)for(let cx=0;cx<gw;cx++){const k=cy*gw+cx;if(tr[k]||G[k]!==1)continue;let far=true;for(let j=0;j<TQ&&far;j+=2)for(let i=0;i<TQ;i+=2){const px=cx*TQ+i,py=cy*TQ+j;if(px<w&&py<h&&dist[py*w+px]<=WT+ol){far=false;break}}if(far)cand[k]=1}
   const seen=new Uint8Array(gw*gh),DX=L.dx;
   for(let s0=0;s0<gw*gh;s0++){if(!cand[s0]||seen[s0])continue;const st=[s0],cells=[];seen[s0]=1;let touchOpen=false;
     while(st.length){const k=st.pop();cells.push(k);const x=k%gw,y=(k/gw)|0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){if(!i&&!j)continue;const X=x+i,Y=y+j;if(X<0||Y<0||X>=gw||Y>=gh)continue;const jj=Y*gw+X;if(cand[jj]&&!seen[jj]){seen[jj]=1;st.push(jj)}else if(!cand[jj]&&!tr[jj])touchOpen=true}}
     if(touchOpen||cells.length>12)continue;
     for(const k of cells){const cx=k%gw,cy=(k/gw)|0;for(let j=0;j<TQ;j++)for(let i=0;i<TQ;i++){const px=cx*TQ+i,py=cy*TQ+j;if(px<w&&py<h)d[(py*w+px)*4+3]=0}if(DX)DX.clearRect(cx*TS,cy*TS,TS,TS)}}}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=(y*w+x)*4;if(o[p+3]<10||d[p+3]===0)continue;
    const cx=(x/TQ)|0,cy=(y/TQ)|0,c=(cx<gw&&cy<gh)?G[cy*gw+cx]:1;
    if(c===1&&plain[cy*gw+cx]){ // светлая стена с тёмным контуром по краям
      let edge=false;for(let k=1;k<=ol&&!edge;k++){for(const [dx,dy] of [[k,0],[-k,0],[0,k],[0,-k]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=w||yy>=h)continue;const pp=(yy*w+xx)*4;if(o[pp+3]<10||!isPlain(xx,yy)){edge=true;break}}}
      if(edge){d[p]=18;d[p+1]=10;d[p+2]=26}else{const n=hash(x>>1,y>>1);const v=n<.2?218:n>.9?240:230;d[p]=v;d[p+1]=v-10;d[p+2]=v+12;
        // нижняя грань стены чуть темнее (объём)
        const below=cell(x,y+ol*3);if(below!==1){d[p]=d[p]*.78;d[p+1]=d[p+1]*.74;d[p+2]=d[p+2]*.86}}
      continue}
    // контраст и насыщенность
    let r=o[p],gg=o[p+1],b=o[p+2];const l=r*.3+gg*.59+b*.11;
    r=l+(r-l)*1.32;gg=l+(gg-l)*1.32;b=l+(b-l)*1.32;r=(r-128)*1.1+128;gg=(gg-128)*1.1+128;b=(b-128)*1.1+128;
    // тень от мебели и стен на пол
    if(c===0){const c2=cell(x-sh,y-sh);if(c2===2||(c2===1&&isPlain(x-sh,y-sh))){r*=.62;gg*=.6;b*=.7}}
    d[p]=r;d[p+1]=gg;d[p+2]=b}
  // комнаты: связные области пола. Часть комнат — кислотный пол (дуотон по яркости текстуры), остальные — сдвиг цвета к палитре
  try{const P=lvPal(L),ov=(LV[L.id]&&LV[L.id].floors)||[],acidP=(LV[L.id]&&LV[L.id].acid!=null)?LV[L.id].acid:.45;
  const comp=new Int32Array(gw*gh).fill(-1),rooms=[];
  // эрозия на 2 клетки разрезает дверные проёмы, потом области растут обратно
  const cd=new Uint16Array(gw*gh);for(let k=0;k<gw*gh;k++)cd[k]=G[k]===1?0:999;
  for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){const k=y*gw+x;if(!cd[k])continue;let v=Math.min(cd[k],x+1,y+1);if(x>0)v=Math.min(v,cd[k-1]+1);if(y>0){v=Math.min(v,cd[k-gw]+1);if(x>0)v=Math.min(v,cd[k-gw-1]+1);if(x<gw-1)v=Math.min(v,cd[k-gw+1]+1)}cd[k]=v}
  for(let y=gh-1;y>=0;y--)for(let x=gw-1;x>=0;x--){const k=y*gw+x;if(!cd[k])continue;let v=Math.min(cd[k],gw-x,gh-y);if(x<gw-1)v=Math.min(v,cd[k+1]+1);if(y<gh-1){v=Math.min(v,cd[k+gw]+1);if(x<gw-1)v=Math.min(v,cd[k+gw+1]+1);if(x>0)v=Math.min(v,cd[k+gw-1]+1)}cd[k]=v}
  const cntR=(er)=>{const seen=new Uint8Array(gw*gh);let n=0;for(let s0=0;s0<gw*gh;s0++){if(cd[s0]<=er||seen[s0])continue;const st=[s0];seen[s0]=1;let m=0;while(st.length){const k=st.pop();m++;const x=k%gw,y=(k/gw)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=gw||Y>=gh)continue;const jj=Y*gw+X;if(cd[jj]>er&&!seen[jj]){seen[jj]=1;st.push(jj)}}}if(m>=6)n++}return n};
  let ER=LV[L.id]&&LV[L.id].er;if(!ER){let bn=-1;for(let e=1;e<=7;e++){const n=cntR(e);if(n>bn){bn=n;ER=e}}}
  const core=new Uint8Array(gw*gh);for(let k=0;k<gw*gh;k++)core[k]=cd[k]>ER?1:0;
  for(let s0=0;s0<gw*gh;s0++){if(!core[s0]||comp[s0]>=0)continue;const id_=rooms.length,st=[s0];comp[s0]=id_;
    while(st.length){const k=st.pop();const x=k%gw,y=(k/gw)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=gw||Y>=gh)continue;const j=Y*gw+X;if(core[j]&&comp[j]<0){comp[j]=id_;st.push(j)}}}
    rooms.push({n:0,c:null})}
  {let fr=[];for(let k=0;k<gw*gh;k++)if(comp[k]>=0)fr.push(k);while(fr.length){const nf=[];for(const k of fr){const x=k%gw,y=(k/gw)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=gw||Y>=gh)continue;const j=Y*gw+X;if(G[j]!==1&&comp[j]<0){comp[j]=comp[k];nf.push(j)}}}fr=nf}}
  for(let k=0;k<gw*gh;k++)if(comp[k]>=0){const r=rooms[comp[k]];r.n++;const x=k%gw,y=(k/gw)|0;if(x<=1||y<=1||x>=gw-2||y>=gh-2)r.edge=1}
  const AC=['#ff2e97','#22e5d4','#7dff3a','#b04aff','#ff3df2','#ffe23a','#ff7a1a','#36d7ff'].concat(P.c.filter(c=>{const v=hx(c);return v[0]*.3+v[1]*.59+v[2]*.11>90}));
  let TOT=0;for(const r of rooms)TOT+=r.n;
  rooms.forEach((r,i)=>{const hh=hstr(L.id+':'+i);if(r.n<24)return;
    if(r.n<TOT*.34&&!r.edge&&(hh%1000)/1000<acidP)r.c=hx(AC[hh%AC.length]);else r.c={sh:hx(P.c[(hh>>3)%3])}});
  if(!(LV[L.id]&&LV[L.id].acid===0)&&!rooms.some(r=>r.c&&!r.c.sh)){const cand=rooms.map((r,i)=>[r,i]).filter(([r])=>r.n>=60&&r.n<TOT*.34&&!r.edge).sort((a,b)=>a[0].n-b[0].n);for(const [r,i] of cand.slice(0,Math.max(1,cand.length>>2)))r.c=hx(AC[hstr(L.id+'#'+i)%AC.length])}
  // средняя яркость пола комнаты — дуотон считается относительно неё (тёмный пол не уходит в чёрный)
  {const sa=new Float64Array(rooms.length),sm=new Float64Array(rooms.length),sq=new Float64Array(rooms.length),cn=new Float64Array(rooms.length);
   for(let y=0;y<h;y+=3)for(let x=0;x<w;x+=3){const k=((y/TQ)|0)*gw+((x/TQ)|0);if(G[k]!==0||comp[k]<0)continue;const p=(y*w+x)*4;const l=(d[p]*.3+d[p+1]*.59+d[p+2]*.11)/255;sm[comp[k]]+=l;sq[comp[k]]+=l*l;cn[comp[k]]++;const mx=Math.max(d[p],d[p+1],d[p+2]);sa[comp[k]]+=mx?(mx-Math.min(d[p],d[p+1],d[p+2]))/mx:0}
   rooms.forEach((r,i)=>{const m=cn[i]?sm[i]/cn[i]:.5;r.sat=cn[i]?sa[i]/cn[i]:0;if(r.sat>.42&&r.c&&!r.c.sh&&!(LV[L.id]&&LV[L.id].forceAcid))r.c={sh:r.c,keep:1};r.m=m;r.sd=cn[i]?Math.max(.03,Math.sqrt(Math.max(0,sq[i]/cn[i]-m*m))):.1})}
  for(const [px,py,c] of ov){const k=((py/TS)|0)*gw+((px/TS)|0);const r=rooms[comp[k]];if(r)r.c=c==null?null:(c[0]==='~'?{sh:hx(c.slice(1))}:hx(c))}
  const dk=L.dark>0?1-Math.min(.5,L.dark*.55):1;
  // улица/природа (комнаты у края карты): кислотная перекраска — оттенки тянутся к неоновым, насыщенность выше
  const ANCH=[330,185,95,275,20,52],outK=(LV[L.id]&&LV[L.id].outK!=null)?LV[L.id].outK:.38;
  if(outK>0)for(let y=0;y<h;y++)for(let x=0;x<w;x++){const cx=(x/TQ)|0,cy=(y/TQ)|0;if(cx>=gw||cy>=gh)continue;const k=cy*gw+cx;if(G[k]===1)continue;const r=rooms[comp[k]];if(!r||!r.edge)continue;
    const p=(y*w+x)*4;if(d[p+3]<10)continue;let R_=d[p]/255,G_=d[p+1]/255,B_=d[p+2]/255;const mx=Math.max(R_,G_,B_),mn=Math.min(R_,G_,B_),L_=(mx+mn)/2;let H_=0,S_=0;
    if(mx!==mn){const dd=mx-mn;S_=L_>.5?dd/(2-mx-mn):dd/(mx+mn);H_=mx===R_?((G_-B_)/dd+(G_<B_?6:0)):mx===G_?(B_-R_)/dd+2:(R_-G_)/dd+4;H_*=60}
    if(S_<.08)continue;let best=ANCH[0],bd=999;for(const a of ANCH){let dh=Math.abs(a-H_);dh=Math.min(dh,360-dh);if(dh<bd){bd=dh;best=a}}
    let dh=best-H_;if(dh>180)dh-=360;if(dh<-180)dh+=360;H_=(H_+dh*outK*1.2+360)%360;S_=Math.min(1,S_*(1+outK*1.3));
    const q2=L_<.5?L_*(1+S_):L_+S_-L_*S_,p2=2*L_-q2;const hf=t=>{t=(t+1)%1;return t<1/6?p2+(q2-p2)*6*t:t<.5?q2:t<2/3?p2+(q2-p2)*(2/3-t)*6:p2};
    const hh_=H_/360;d[p]=hf(hh_+1/3)*255;d[p+1]=hf(hh_)*255;d[p+2]=hf(hh_-1/3)*255}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const cx=(x/TQ)|0,cy=(y/TQ)|0;if(cx>=gw||cy>=gh)continue;const k=cy*gw+cx;if(G[k]!==0)continue;const r=rooms[comp[k]];if(!r||!r.c||r.c.keep)continue;
    const p=(y*w+x)*4;if(d[p+3]<10)continue;const l=(d[p]*.3+d[p+1]*.59+d[p+2]*.11)/255;
    if(r.c.sh){const c=r.c.sh,mx=Math.max(d[p],d[p+1],d[p+2]),mn=Math.min(d[p],d[p+1],d[p+2]),sat=mx?(mx-mn)/mx:0,a=.3*(1-Math.min(1,sat*1.6));d[p]=d[p]*(1-a)+c[0]*l*a*1.15;d[p+1]=d[p+1]*(1-a)+c[1]*l*a*1.15;d[p+2]=d[p+2]*(1-a)+c[2]*l*a*1.15}
    else{const c=r.c,t=Math.min(1,Math.max(0,.55+(l-r.m)/(r.sd*4.5)));const lo=.34,hi=1.08;const f=(lo+(hi-lo)*t)*dk;d[p]=c[0]*f+40*t*t;d[p+1]=c[1]*f+40*t*t;d[p+2]=c[2]*f+40*t*t}}
  L._rooms=rooms;L._comp=comp}catch(e){console.warn(e)}
  // контур предметов (мебель, ящики, машины): пиксели клеток g==2, заметно отличные от пола рядом
  const obj=new Uint8Array(w*h),ref=new Int32Array(gw*gh).fill(-1);
  for(let cy=0;cy<gh;cy++)for(let cx=0;cx<gw;cx++){if(G[cy*gw+cx]!==2)continue;
    for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0],[0,2],[0,-2],[2,0],[-2,0]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=gw||ny>=gh||G[ny*gw+nx]!==0)continue;const px=nx*TQ+(TQ>>1),py=ny*TQ+(TQ>>1);if(px<w&&py<h){ref[cy*gw+cx]=(py*w+px)*4;break}}}
  for(let cy=0;cy<gh;cy++)for(let cx=0;cx<gw;cx++){const k=cy*gw+cx;if(G[k]!==2)continue;const rp=ref[k];
    for(let j=0;j<TQ;j++)for(let i=0;i<TQ;i++){const px=cx*TQ+i,py=cy*TQ+j;if(px>=w||py>=h)continue;const p=(py*w+px)*4;
      if(rp<0||Math.abs(d[p]-d[rp])+Math.abs(d[p+1]-d[rp+1])+Math.abs(d[p+2]-d[rp+2])>54)obj[py*w+px]=1}}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(obj[i])continue;const c=G[((y/TQ)|0)*gw+((x/TQ)|0)];if(c===1)continue;
    let near=false;for(let k=1;k<=ol&&!near;k++)near=(x+k<w&&obj[i+k])||(x-k>=0&&obj[i-k])||(y+k<h&&obj[i+k*w])||(y-k>=0&&obj[i-k*w]);
    if(near){const p=i*4;d[p]=18;d[p+1]=10;d[p+2]=26}}
  g.putImageData(id,0,0);try{NEON.decor&&NEON.decor(L)}catch(e){console.warn(e)}};

// Свет уровня: карта (multiply) — тёплые/цветные пятна вокруг ламп, стены не темнеют
// контур спрайтов (герои, зомби, машины): тёмная обводка как в HM
const SIL=document.createElement('canvas'),SG=SIL.getContext('2d');
function sprPatch(){if(NEON._sprP||typeof spr!=='function')return;NEON._sprP=1;const os=spr;
  window.spr=function(c,x,y,a){if(!NEON.on||!c||!c.width){return os(c,x,y,a)}
    if(SIL.width!==c.width||SIL.height!==c.height){SIL.width=c.width;SIL.height=c.height}
    SG.globalCompositeOperation='source-over';SG.clearRect(0,0,SIL.width,SIL.height);SG.drawImage(c,0,0);SG.globalCompositeOperation='source-in';SG.fillStyle='#120a1a';SG.fillRect(0,0,SIL.width,SIL.height);
    const o=.67;ctx.save();ctx.translate(Math.round(x*Q)/Q,Math.round(y*Q)/Q);ctx.rotate(a);
    ctx.drawImage(SIL,-12-o,-12,24,24);ctx.drawImage(SIL,-12+o,-12,24,24);ctx.drawImage(SIL,-12,-12-o,24,24);ctx.drawImage(SIL,-12,-12+o,24,24);ctx.restore();
    os(c,x,y,a)}}
NEON.light=function(L){sprPatch();if(!L._lm||L._lmN!==L.lights.length){L._lmN=L.lights.length;const s=4,w=Math.ceil(L.w/s),h=Math.ceil(L.h/s);if(w*h>4e6)return;
    const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');const P=lvPal(L),c1=hx(P.c[0]),c2=hx(P.c[1]),c3=hx(P.c[2]);
    const dk=L.dark>0;const amb=dk?[240,236,248]:[Math.round(176+c2[0]*.12),Math.round(170+c2[1]*.12),Math.round(186+c2[2]*.12)];
    g.fillStyle=`rgb(${amb})`;g.fillRect(0,0,w,h);g.globalCompositeOperation='lighter';
    const pool=(x,y,r,col,a)=>{const gr=g.createRadialGradient(x/s,y/s,0,x/s,y/s,r/s);gr.addColorStop(0,`rgba(${col},${a})`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.fillRect((x-r)/s,(y-r)/s,r*2/s,r*2/s)};
    if(!dk){for(let y=60;y<L.h;y+=130)for(let x=60+((y/130)%2)*65;x<L.w;x+=130){if(gAt0(L,x,y)!==0)continue;const k=hash(x,y);pool(x,y,70,k<.4?'255,214,170':k<.7?c1.join(','):c3.join(','),.22)}}
    for(const l of L.lights){const k=hash(l[0]|0,l[1]|0);pool(l[0],l[1],l[2]*1.3,k<.5?'255,210,150':c1.join(','),dk?.25:.35)}
    g.globalCompositeOperation='source-over';
    for(let cy=0;cy<L.gh;cy++)for(let cx=0;cx<L.gw;cx++)if(L.g[cy*L.gw+cx]===1){g.fillStyle='rgba(255,255,255,.85)';g.fillRect(cx*TS/s,cy*TS/s,TS/s,TS/s)}
    L._lm=c}
  ctx.save();ctx.imageSmoothingEnabled=true;ctx.globalCompositeOperation='multiply';ctx.drawImage(L._lm,0,0,L.w,L.h);ctx.restore();ctx.imageSmoothingEnabled=false;
  try{NEON.decorGlow(L)}catch(e){}
  // светящиеся глаза зомби
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const z of L.zs){if(z.dead||z.st==='hidden')continue;const big=z.type==='brute'||z.type==='boss',r=big?6:4,a=z.a||0,ex=z.x+Math.cos(a)*(big?7:5),ey=z.y+Math.sin(a)*(big?7:5);
    if(ex<camX-10||ex>camX+W+10||ey<camY-10||ey>camY+H+10)continue;const g=ctx.createRadialGradient(ex,ey,0,ex,ey,r);g.addColorStop(0,z.st==='chase'?'rgba(255,40,60,.55)':'rgba(140,255,60,.4)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(ex-r,ey-r,r*2,r*2)}
  ctx.restore()};
function gAt0(L,x,y){const cx=Math.floor(x/TS),cy=Math.floor(y/TS);if(cx<0||cy<0||cx>=L.gw||cy>=L.gh)return 1;return L.g[cy*L.gw+cx]}
const TS=4;

// Кат-сцены: цветокоррекция в кислотной гамме и виньетка

// ---- катсцены: кислотный закат, неоновые окна и вывески, отражения на асфальте ----
function cutPatch(){NEON._cutP=1;
  if(typeof SKY_EVE!=='undefined')SKY_EVE.splice(0,SKY_EVE.length,'#14082e','#1e0a40','#2c0c56','#40106c','#5a1480','#7a188e','#a01c96','#cc2496','#ff3a8a','#ff7a6a');
  if(typeof SKY_RED!=='undefined')SKY_RED.splice(0,SKY_RED.length,'#0a0210','#14041c','#220626','#34082e','#4a0a30','#640e2e','#82142a','#a01e26','#c02a20','#e0441a');
  if(typeof PAL!=='undefined')PAL.splice(0,PAL.length,'#c86a9a','#7a6ad8','#4ab8b0','#d88a5a','#9a5ac8','#d85a7a','#5a8ad8','#c8a04a');
  const NS=['#ff2e97','#22e5d4','#7dff3a','#ff3df2','#36d7ff','#ffe23a'];
  if(typeof building==='function'){const ob=building;window.building=function(x,b,base,chaos,t){ob(x,b,base,chaos,t);const top=base-b.h;
    F(x-1,top-3,1,b.h+3,'#0a0612');F(x+b.w,top-3,1,b.h+3,'#0a0612');
    const hh=hash(b.k,11);if(!chaos&&hh<.55){const c=NS[(b.k*7)%NS.length],sy=top+8+Math.floor(hash(b.k,3)*(b.h-30)),sw=Math.min(b.w-10,14+Math.floor(hash(b.k,4)*16));
      const on=Math.sin((t||0)*3+b.k)>-0.85;F(x+5,sy,sw,5,'#0a0612');if(on){F(x+6,sy+1,sw-2,3,c);ctx.save();ctx.globalCompositeOperation='lighter';radial(ctx,x+5+sw/2,sy+2,sw*.9,'rgba('+hx(c).join(',')+',A)',.35);ctx.restore()}}
    if(!chaos&&hh>.8){const c=NS[(b.k*3)%NS.length];F(x,top,b.w,1,c)}
    // детали фасада: карниз, балконы, кондиционеры, антенны на крыше
    F(x,top+3,b.w,1,'rgba(10,6,18,.45)');
    for(let fy=top+15,r=0;fy<base-18;fy+=20,r++){if(hash(b.k,r+40)<.5){const bx=x+4+Math.floor(hash(b.k,r+41)*(b.w-20));F(bx-1,fy,14,1,'#0a0612');F(bx-1,fy+1,1,3,'#0a0612');F(bx+12,fy+1,1,3,'#0a0612');F(bx,fy+3,12,1,'#0a0612')}
      if(hash(b.k,r+60)<.35){const ax=x+3+Math.floor(hash(b.k,r+61)*(b.w-10));F(ax,fy+6,5,4,'#0a0612');F(ax+.5,fy+6.5,4,3,'#c8c4d8');F(ax+1,fy+7.5,3,1,'#8a86a0')}}
    if(hash(b.k,77)<.45){const ax=x+6+Math.floor(hash(b.k,78)*(b.w-14));F(ax,top-12,1,9,'#0a0612');F(ax-3,top-10,7,1,'#0a0612');F(ax-2,top-7,5,1,'#0a0612');if(Math.sin((t||0)*4+b.k)>0)F(ax,top-13,1,1,'#ff2e60')}}}
  if(typeof street==='function'){const os=street;window.street=function(off,y,chaos){os(off,y,chaos);if(chaos)return;ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=-1;i<W/36+2;i++){const x=i*36-((off*1.0)%36+36)%36;const c=NS[((i+Math.floor(off/36))%NS.length+NS.length)%NS.length];ctx.fillStyle='rgba('+hx(c).join(',')+',.10)';ctx.fillRect(x,y+8,3,24);ctx.fillRect(x+1,y+8,1,28)}
    ctx.restore()}}
  // контур фигур в катсценах
  const outl=(fn,skip)=>function(){const a=arguments;if(skip&&skip(a))return fn.apply(this,a);const oF=window.F;window.F=(x,y,w,h)=>{ctx.fillStyle='#0a0612';ctx.fillRect(Math.round(x),Math.round(y),w,h)};
    try{for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){ctx.save();ctx.translate(dx,dy);fn.apply(this,a);ctx.restore()}}finally{window.F=oF}return fn.apply(this,a)};
  if(typeof sidePed==='function')window.sidePed=outl(sidePed);
  if(typeof sideMikrob==='function')window.sideMikrob=outl(sideMikrob);
  if(typeof sideCar==='function')window.sideCar=outl(sideCar,a=>a[4]);
  if(typeof drawFar==='function'){const od=drawFar;window.drawFar=function(off,base,chaos){od(off,base,chaos);if(chaos)return;let x=-((off%FAR.L)+FAR.L)%FAR.L,i=0;
    while(x<W){const b=FAR.a[i%FAR.a.length],h=Math.round(b.h*.7);for(let k=0;k<6;k++){if(hash(b.k,k+20)>.55)F(x+3+k*8,base-h+6+((k*5)%14),2,1,NS[(b.k+k)%NS.length])}x+=b.w+2;i++}}}
}
const _rc=renderCut;
renderCut=function(){if(NEON.on&&!NEON._cutP)try{cutPatch()}catch(e){console.warn(e)}_rc.apply(this,arguments);if(window.CINE&&CINE.fr){CINE.fr=0;return}if(!NEON.on)return;const c=ctx;c.save();c.setTransform(Q,0,0,Q,0,0);
  c.globalCompositeOperation='soft-light';const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'rgba(255,46,151,.55)');g.addColorStop(.5,'rgba(122,31,255,.25)');g.addColorStop(1,'rgba(34,229,212,.5)');c.fillStyle=g;c.fillRect(0,0,W,H);
  c.globalCompositeOperation='source-over';const v=c.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,H);v.addColorStop(0,'rgba(10,0,30,0)');v.addColorStop(1,'rgba(10,0,30,.5)');c.fillStyle=v;c.fillRect(0,0,W,H);c.restore()};

// переключатель «до/после»
NEON.toggle=function(){NEON.on=!NEON.on;layout(NEON.on);try{localStorage.setItem('pp_neon',NEON.on?'1':'0')}catch(e){}mapDirty=true;LMd=true;if(typeof note==='function')note(NEON.on?'Новая графика':'Старая графика')};
layout(NEON.on);
addEventListener('keydown',e=>{if(window.PILOT&&e.code==='KeyG'&&!e.repeat&&!e.ctrlKey&&!e.metaKey){NEON.toggle()}});

// ================= Библиотека декора (04.11): мелкие предметы по углам комнат, неоновые вывески на стенах =================
// Рисуются один раз в фон уровня (L.bg) после стилизации. Проходимые (не меняют сетку), ставятся в углы и у стен.
(function(){
const OL='#120a1a',T=1/3;
const box=(g,x,y,w,h,c)=>{g.fillStyle=OL;g.fillRect(x-T,y-T,w+2*T,h+2*T);g.fillStyle=c;g.fillRect(x,y,w,h);g.fillStyle=lite(c,.35);g.fillRect(x,y,w,T);g.fillStyle=dark(c,.3);g.fillRect(x,y+h-T,w,T)};
const disc=(g,x,y,r,c)=>{g.fillStyle=OL;g.beginPath();g.arc(x,y,r+T,0,7);g.fill();g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.fillStyle=lite(c,.4);g.beginPath();g.arc(x-r*.35,y-r*.35,r*.35,0,7);g.fill()};
const shd=(g,x,y,w,h)=>{g.fillStyle='rgba(10,0,20,.35)';g.fillRect(x+1,y+1,w,h)};
const NC=['#ff2e97','#22e5d4','#7dff3a','#b04aff','#ff3df2','#ffe23a','#36d7ff','#ff7a1a'];
// каждый предмет: (g,x,y,rnd,col) — x,y левый верхний угол клетки 8×8
const LIB={
 plant(g,x,y,r){shd(g,x+1.5,y+4.5,5,3.5);box(g,x+1.5,y+4.5,5,3.5,['#c8643a','#e8e0f0','#2a2a34','#ff4fd8'][r(4)]);const lc=['#2ec46a','#5ae04a','#1fa88a'][r(3)];
   for(let i=0;i<6;i++){const a=-Math.PI/2+(i-2.5)*.55;g.fillStyle=OL;g.beginPath();g.ellipse(x+4+Math.cos(a)*2.4,y+3.6+Math.sin(a)*2.4,2.1,1,a,0,7);g.fill();g.fillStyle=i%2?lc:lite(lc,.25);g.beginPath();g.ellipse(x+4+Math.cos(a)*2.4,y+3.6+Math.sin(a)*2.4,1.7,.7,a,0,7);g.fill()}},
 bin(g,x,y,r){shd(g,x+2,y+2,4.5,5);box(g,x+2,y+2,4.5,5,['#3a3a48','#2a6a4a','#5a2a8a'][r(3)]);g.fillStyle='#14121c';g.fillRect(x+2.6,y+2.6,3.3,1.2);if(r(2)){g.fillStyle='#e8e0f0';g.fillRect(x+3,y+1.6,1.6,1)}},
 boxes(g,x,y,r){shd(g,x+.6,y+2,7,5.4);box(g,x+.6,y+2.6,4.2,4.6,'#b8844a');box(g,x+3.4,y+.8,4,4,'#d09a58');g.fillStyle='#e8d0a0';g.fillRect(x+5,y+.8,.7,4);g.fillRect(x+2.4,y+2.6,.7,4.6)},
 lamp(g,x,y,r,c){disc(g,x+4,y+4,2.6,'#2a2834');disc(g,x+4,y+4,1.6,c);},
 cooler(g,x,y,r){shd(g,x+2,y+1,4.5,6.4);box(g,x+2,y+3,4.5,4.4,'#e8e8f0');disc(g,x+4.25,y+2.4,1.9,'#5ac8ff');g.fillStyle='#ff4a5a';g.fillRect(x+3,y+5,.7,.7);g.fillStyle='#4a8aff';g.fillRect(x+5,y+5,.7,.7)},
 speaker(g,x,y,r){shd(g,x+1.4,y+1,5.4,6.6);box(g,x+1.4,y+1,5.4,6.6,'#1c1a24');disc(g,x+4.1,y+5.2,1.6,'#3a3848');disc(g,x+4.1,y+2.6,.9,'#3a3848')},
 papers(g,x,y,r){for(let i=0;i<4;i++){const px=x+1+r(5),py=y+1+r(5);g.save();g.translate(px+1.2,py+1.5);g.rotate((r(9)-4)*.2);g.fillStyle=OL;g.fillRect(-1.5,-1.9,3,3.8);g.fillStyle='#f0ecf8';g.fillRect(-1.2,-1.6,2.4,3.2);g.fillStyle='#9a96b0';g.fillRect(-.9,-1,1.8,.3);g.fillRect(-.9,-.3,1.4,.3);g.restore()}},
 rugdot(g,x,y,r,c){g.fillStyle=OL;g.beginPath();g.ellipse(x+4,y+4,3.8,3,0,0,7);g.fill();g.fillStyle=c;g.beginPath();g.ellipse(x+4,y+4,3.4,2.6,0,0,7);g.fill();g.fillStyle=lite(c,.45);g.beginPath();g.ellipse(x+4,y+4,2,1.4,0,0,7);g.fill()},
 bag(g,x,y,r,c){shd(g,x+1,y+2,6,5);g.fillStyle=OL;g.beginPath();g.ellipse(x+4,y+4.6,3.4,2.8,0,0,7);g.fill();g.fillStyle=c;g.beginPath();g.ellipse(x+4,y+4.6,3,2.4,0,0,7);g.fill();g.fillStyle=lite(c,.35);g.beginPath();g.ellipse(x+3,y+3.8,1.3,.9,0,0,7);g.fill()},
 guitar(g,x,y,r,c){g.save();g.translate(x+4,y+4);g.rotate(-.6);g.fillStyle=OL;g.fillRect(-.6,-4,1.2,4);g.beginPath();g.ellipse(0,1.6,2.2,1.9,0,0,7);g.fill();g.fillStyle=c;g.beginPath();g.ellipse(0,1.6,1.8,1.5,0,0,7);g.fill();g.fillStyle='#2a1a10';g.fillRect(-.3,-3.8,.6,4);g.fillStyle='#14121c';g.beginPath();g.arc(0,1.2,.5,0,7);g.fill();g.restore()},
 cone(g,x,y,r){shd(g,x+2,y+5,4,2);g.fillStyle=OL;g.beginPath();g.moveTo(x+4,y+1);g.lineTo(x+6.4,y+6.4);g.lineTo(x+1.6,y+6.4);g.fill();g.fillStyle='#ff7a1a';g.beginPath();g.moveTo(x+4,y+1.6);g.lineTo(x+5.9,y+6);g.lineTo(x+2.1,y+6);g.fill();g.fillStyle='#fff';g.fillRect(x+3,y+3.6,2,.7)},
 puddle(g,x,y,r,c){g.fillStyle='rgba(20,10,40,.5)';g.beginPath();g.ellipse(x+4,y+4.5,3.6,2,0,0,7);g.fill();g.fillStyle=c;g.globalAlpha=.55;g.beginPath();g.ellipse(x+3.4,y+4.2,1.6,.6,0,0,7);g.fill();g.globalAlpha=1},
 bottles(g,x,y,r){for(let i=0;i<3;i++){const bx=x+1.4+i*2,by=y+2+r(3);g.fillStyle=OL;g.fillRect(bx-.3,by-.3,1.6,3.6);g.fillStyle=['#3aa04a','#8a4a1a','#c8e8f0'][r(3)];g.fillRect(bx,by,1,3);g.fillStyle='#fff';g.fillRect(bx,by+.4,.4,1)}},
 tires(g,x,y,r){disc(g,x+4,y+4,3.2,'#1a1a20');disc(g,x+4,y+4,1.6,'#3a3a44');g.fillStyle='#0a0a10';g.beginPath();g.arc(x+4,y+4,.9,0,7);g.fill()},
 arcade(g,x,y,r,c){shd(g,x+1,y+.6,6.4,7);box(g,x+1,y+.6,6.4,7,'#1a1430');g.fillStyle=c;g.fillRect(x+1.8,y+1.4,4.8,2.6);g.fillStyle=lite(c,.5);g.fillRect(x+2.2,y+1.8,1.6,.6);g.fillStyle='#ff3a5a';g.fillRect(x+2.4,y+5,1,1);g.fillStyle='#ffe23a';g.fillRect(x+4.6,y+5,1,1)},
 skate(g,x,y,r,c){g.save();g.translate(x+4,y+4);g.rotate(.7);g.fillStyle=OL;g.fillRect(-3.6,-1.3,7.2,2.6);g.fillStyle=c;g.fillRect(-3.3,-1,6.6,2);g.fillStyle='#e8e0f0';g.fillRect(-2.6,-1.3,.8,.4);g.fillRect(1.8,-1.3,.8,.4);g.fillRect(-2.6,.9,.8,.4);g.fillRect(1.8,.9,.8,.4);g.restore()},
};
const IN=['plant','plant','bin','boxes','lamp','cooler','speaker','papers','rugdot','bag','guitar','bottles','arcade','skate','lamp','plant'];
const OUT_=['bin','cone','puddle','tires','boxes','bottles','papers','cone','puddle'];
NEON.DECOR=LIB;
NEON.decor=function(L){if(L.noDecor||(LV[L.id]&&LV[L.id].noDecor))return;const g=L.bx,G=L.g,gw=L.gw,gh=L.gh,rooms=L._rooms,comp=L._comp;if(!g||!rooms)return;
  let seed=hstr('d'+L.id);const r=n=>{seed=(seed*1103515245+12345)&0x7fffffff;return (seed>>>12)%n};
  const at=(x,y)=>(x<0||y<0||x>=gw||y>=gh)?1:G[y*gw+x];
  const free=(x,y)=>{for(let j=0;j<2;j++)for(let i=0;i<2;i++)if(at(x+i,y+j)!==0)return false;
    const px=x*TS+4,py=y*TS+4;for(const it of (L.its||[]))if(Math.abs(it.x-px)<14&&Math.abs(it.y-py)<14)return false;
    if(Math.abs((L.startX||-99)-px)<14&&Math.abs((L.startY||-99)-py)<14)return false;return true};
  const used=L._fused||new Uint8Array(gw*gh);const lights=[];
  const corners=[];for(let y=1;y<gh-2;y++)for(let x=1;x<gw-2;x++){if(!free(x,y))continue;
    const wl=at(x-1,y)===1&&at(x-1,y+1)===1,wr=at(x+2,y)===1&&at(x+2,y+1)===1,wt=at(x,y-1)===1&&at(x+1,y-1)===1,wb=at(x,y+2)===1&&at(x+1,y+2)===1;
    if((wl||wr)&&(wt||wb))corners.push([x,y]);else if((wl||wr||wt||wb)&&r(9)===0)corners.push([x,y,1])}
  const perRoom={};
  for(const [x,y,side] of corners){const k=y*gw+x;const ri=comp[k];if(ri<0)continue;const R=rooms[ri];const lim=Math.min(3,1+Math.floor(R.n/500));perRoom[ri]=perRoom[ri]||0;if(perRoom[ri]>=lim)continue;
    let ok=true;for(let j=-2;j<=3&&ok;j++)for(let i=-2;i<=3;i++){const xx=x+i,yy=y+j;if(xx>=0&&yy>=0&&xx<gw&&yy<gh&&used[yy*gw+xx]){ok=false;break}}if(!ok)continue;
    if((side&&r(2))||r(3)===0)continue;
    perRoom[ri]++;for(let j=0;j<2;j++)for(let i=0;i<2;i++)used[(y+j)*gw+x+i]=1;
    const list=R.edge?OUT_:IN,name=list[r(list.length)],col=NC[r(NC.length)];
    try{LIB[name](g,x*TS,y*TS,r,col)}catch(e){}
    if(name==='lamp'||name==='arcade')lights.push([x*TS+4,y*TS+4,30,col])}
  // неоновые вывески/трубки на длинных стенах над полом
  const signs=[];let ns=0;const maxS=Math.max(1,Math.min(8,Math.round(rooms.length*.8)));
  for(let y=2;y<gh-1&&ns<maxS;y++)for(let x=2;x<gw-10&&ns<maxS;x++){if(r(37)!==0)continue;let ok=true;
    for(let i=0;i<8;i++){if(at(x+i,y)!==1||at(x+i,y+1)!==0||at(x+i,y+2)!==0){ok=false;break}}if(!ok)continue;
    const ri=comp[(y+1)*gw+x];if(ri<0||(rooms[ri].edge&&r(2)))continue;if(signs.some(s=>Math.abs(s[0]-x)<16&&Math.abs(s[1]-y)<10))continue;
    const col=NC[r(NC.length)],px=x*TS+2,py=y*TS+TS-2.4,len=8*TS-4;
    g.fillStyle=OL;g.fillRect(px-T,py-T,len+2*T,1.4+2*T);g.fillStyle=col;g.fillRect(px,py,len,1.4);g.fillStyle='#fff';g.globalAlpha=.7;g.fillRect(px+1,py+.4,len-2,.5);g.globalAlpha=1;
    signs.push([x,y]);lights.push([px+len/2,py+1,len*.7,col,1]);ns++}
  L._glow=(L._glow||[]).concat(lights.map(l=>({x:l[0],y:l[1],r:l[2],c:l[3],tube:l[4]})))};
// свечение декора поверх (в NEON.light)
NEON.decorGlow=function(L){if(!L._glow||!L._glow.length)return;ctx.save();ctx.globalCompositeOperation='lighter';const t=(typeof tm==='number'?tm:0);
  for(const o of L._glow){if(o.x<camX-o.r||o.x>camX+W+o.r||o.y<camY-o.r||o.y>camY+H+o.r)continue;const fl=.85+.15*Math.sin(t*3+o.x);const v=hx(o.c);
    const gr=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);gr.addColorStop(0,`rgba(${v},${(o.tube?.32:.42)*fl})`);gr.addColorStop(1,`rgba(${v},0)`);ctx.fillStyle=gr;
    if(o.tube){ctx.save();ctx.translate(o.x,o.y);ctx.scale(1,.45);ctx.translate(-o.x,-o.y);ctx.fillRect(o.x-o.r,o.y-o.r,o.r*2,o.r*2);ctx.restore()}else ctx.fillRect(o.x-o.r,o.y-o.r,o.r*2,o.r*2)}
  ctx.restore()};
})();

})();
