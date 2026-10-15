'use strict';
(()=>{
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),$=s=>document.querySelector(s);
const W=1200,H=680,GROUND=510,R=25;
let END=4200,stage=1,portalFall=false,arrival=0,camY=0,checkpointY=485,endingTime=0,ending=false,toothTaken=false,upperReached=false;
let vw=W,cam=0,last=0,t=0,state='loading',sound=false,audio,keys=new Set(),jump=false,angle=0,inv=0,toast=0,checkpoint=100;
const galleryFiles=["piece-00.jpg", "piece-01.jpg", "piece-02.jpg", "piece-03.jpg", "piece-04.jpg", "piece-05.jpg", "piece-06.jpg", "piece-07.jpg", "piece-08.jpg", "piece-09.jpg", "piece-10.jpg", "piece-11.jpg", "piece-12.jpg", "piece-13.png", "piece-14.jpg"];
const img={}; const tablePlatforms=[{x:310,y:454,w:115,h:56},{x:465,y:385,w:280,h:125},{x:1100,y:432,w:150,h:78},{x:1740,y:300,w:230,h:210},{x:2190,y:446,w:130,h:64},{x:2360,y:373,w:170,h:137},{x:2550,y:440,w:70,h:70},{x:2620,y:380,w:50,h:130},{x:2670,y:325,w:310,h:185,dark:true},{x:3320,y:435,w:130,h:75},{x:3450,y:400,w:50,h:110},{x:3500,y:363,w:170,h:147},{x:3710,y:440,w:80,h:70},{x:3790,y:380,w:40,h:130},{x:3830,y:330,w:105,h:180},{x:4085,y:330,w:110,h:180}];
let platforms=tablePlatforms,barriers=[];
function setBarriers(){barriers=(stage===1?[{x:3090,y:430,w:60,h:80,kind:'plaster'}]:stage===2?[{x:1360,y:420,w:60,h:90,kind:'plaster'},{x:2300,y:420,w:60,h:90,kind:'plaster'},{x:2450,y:430,w:60,h:80,kind:'plaster'}]:[{x:1700,y:430,w:60,h:80,kind:'plaster'},{x:1100,y:-275,w:65,h:85,kind:'compass'}]).map(b=>({...b,broken:false}));}
const shelfPlatforms=[{x:400,y:450,w:280,h:24,kind:'ruler'},{x:810,y:390,w:280,h:30,kind:'file'},{x:1210,y:445,w:280,h:24,kind:'ruler'},{x:1950,y:420,w:240,h:30,kind:'file'},
{x:0,y:-190,w:780,h:45,kind:'shelf'},{x:860,y:-190,w:460,h:25,kind:'ruler'},{x:1390,y:-220,w:340,h:30,kind:'file'},{x:1800,y:-190,w:420,h:45,kind:'shelf'}];
const shelfGemSeeds=[[520,410],[950,345],[1350,405],[2090,375],[2050,-235],[1560,-265],[1020,-235],[650,-235]];
function enterShelf(){stage=3;END=2800;platforms=shelfPlatforms;CHAIN={x:2450,y:-570,length:1010,amplitude:.32,frequency:.72};p={x:120,y:485,vx:0,vy:0,ground:true,airJump:true,chainGrip:null,chainCooldown:1};gems=shelfGemSeeds.map(([x,y])=>({x,y,got:false}));drops=[];warnings=[];birds=[];particles=[];setBarriers();checkpoint=120;checkpointY=485;cam=0;camY=0;nextDrop=2;nextBird=0;arrival=1;inv=2;keys.clear();jump=false;$('#chapter').textContent='03 / HORNÍ POLIČKY';hint('Doprava po poličce. Na konci vyšplhej a zhoupni se zpátky DOLEVA.',7);updateHUD()}

const floorPlatforms=[{x:420,y:468,w:76,h:42,kind:'stone'},{x:680,y:420,w:90,h:90,kind:'ring'},{x:910,y:455,w:86,h:55,kind:'stone'},{x:1060,y:432,w:78,h:78,kind:'ring'},{x:1620,y:480,w:66,h:30,kind:'stone'},{x:1990,y:478,w:65,h:32,kind:'stone'},{x:2700,y:420,w:90,h:90,kind:'ring'},{x:2880,y:460,w:80,h:50,kind:'stone'},{x:3210,y:-330,w:230,h:35,kind:'shelf'}];
const floorGemSeeds=[[320,463],[735,375],[1130,458],[1780,465],[2240,462],[2780,372]];
function enterFloor(){stage=2;END=3500;CHAIN={x:3080,y:-430,length:820,amplitude:.22,frequency:.8};checkpointY=485;camY=0;setBarriers();platforms=floorPlatforms;portalFall=false;arrival=1;p={x:140,y:70,vx:0,vy:100,ground:false,airJump:true,chainGrip:null,chainCooldown:1};gems=floorGemSeeds.map(([x,y])=>({x,y,got:false}));drops=[];warnings=[];birds=[];particles=[];checkpoint=140;barrier=true;nextDrop=3;cam=0;inv=2;keys.clear();jump=false;$('#chapter').textContent='02 / POD STOLEM';hint('Pod stolem! Přeskoč kamínky a prsteny. Sádru rozbij kutálením.',6);updateHUD()}
const gemSeeds=[[230,465],[600,335],[1040,472],[1520,317],[1850,250],[2440,325],[2800,275],[3630,315]];
let p,gems,drops,particles,barrier,hearts,collected,warnings,nextDrop,birds,nextBird,birdWave,dropCount;
function reset(){stage=1;END=4200;CHAIN={...TABLE_CHAIN};setBarriers();checkpointY=485;camY=0;endingTime=0;ending=false;toothTaken=false;upperReached=false;document.body.classList.remove('end-screen');document.body.classList.remove('finale');platforms=tablePlatforms;portalFall=false;arrival=0;$('#chapter').textContent='01 / NOČNÍ DÍLNA';p={x:100,y:GROUND-R,vx:0,vy:0,ground:true,airJump:true,chainGrip:null,chainCooldown:0};gems=gemSeeds.map(([x,y])=>({x,y,got:false}));drops=[];birds=[];nextBird=0;birdWave=0;dropCount=0;particles=[];warnings=[];barrier=true;hearts=3;collected=0;nextDrop=3;checkpoint=100;cam=0;angle=0;inv=0;t=0;updateHUD()}
function updateHUD(){$('#score').textContent=`◆ ${collected} / 22`;$('#lives').textContent='♥ '.repeat(hearts)}
function hint(s,d=3){$('#hint').textContent=s;toast=d}
function tone(f=700,d=.12){if(!sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();let o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(f,audio.currentTime);o.frequency.exponentialRampToValueAtTime(f*.65,audio.currentTime+d);g.gain.setValueAtTime(.07,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+d)}catch{}}
function spark(x,y,color='#e9cb83',n=14){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*240,vy:-Math.random()*230,life:.7,color})}
const TABLE_CHAIN={x:1500,y:65,length:355,amplitude:.76,frequency:1.05};
let CHAIN={...TABLE_CHAIN};
function nearLongChain(x){return stage>1&&Math.abs(x-CHAIN.x)<Math.sin(CHAIN.amplitude)*CHAIN.length+140}
function chainPose(time=t,length=CHAIN.length){const a=CHAIN.amplitude*Math.sin(time*CHAIN.frequency-Math.PI/2),av=CHAIN.amplitude*CHAIN.frequency*Math.cos(time*CHAIN.frequency-Math.PI/2);return{x:CHAIN.x+Math.sin(a)*length,y:CHAIN.y+Math.cos(a)*length,vx:Math.cos(a)*length*av,vy:-Math.sin(a)*length*av,a}}
function catchChain(){if(p.ground||p.chainCooldown>0||p.chainGrip!==null)return;const c=chainPose(),dx=p.x-CHAIN.x,dy=p.y-25-CHAIN.y,length=Math.max(80,Math.min(CHAIN.length,dx*Math.sin(c.a)+dy*Math.cos(c.a))),point=chainPose(t,length);if(Math.hypot(p.x-point.x,p.y-25-point.y)<33){p.chainGrip=length;p.airJump=true;p.ground=false;rideChain();hint('Řetěz: ↑ šplhej, ↓ slez, mezerník odskoč. Směr zvol ← →.',4)}}
function rideChain(){const c=chainPose(t,p.chainGrip);p.x=c.x;p.y=c.y+25;p.vx=c.vx;p.vy=c.vy;p.ground=false;angle=-c.a*.3}
function hit(){if(inv>0)return;hearts--;updateHUD();tone(160,.3);spark(p.x,p.y,'#c87471');inv=2.2;if(!hearts){show('lost');return}p.chainGrip=null;p.chainCooldown=.7;p.x=checkpoint;p.y=checkpointY;p.vx=0;p.vy=0;p.ground=true;p.airJump=true;hint('Korunku narovnat… a znovu dál!',2)}
function show(mode){state=mode;if(mode==='won')document.body.classList.add('end-screen');keys.clear();jump=false;$('#overlay').style.display='grid';$('#heading').innerHTML=mode==='won'?'Zlatý zub nalezen.<br><em>Konec hry.</em>':mode==='lost'?'Korunka potřebuje<br><em>ještě jeden pokus.</em>':'Malá přestávka';$('#intro').textContent=mode==='won'?`Svíčka zhasla. Cestou jsi posbíral ${collected} ze 22 bonusových granátů.`:mode==='lost'?'Pozor na padající obličeje i kameny. Shift tě rychle odkutálí do bezpečí.':'Stůl nikam neuteče. Pokračuj, až budeš připravený.';$('#start').textContent=mode==='paused'?'Pokračovat':'Hrát znovu';$('#pause').textContent='▶'}
function start(){if(state!=='paused')reset();state='playing';$('#overlay').style.display='none';$('#pause').textContent='Ⅱ';last=performance.now();canvas.focus();hint('Šipky: pohyb · Mezerník: skok, znovu dvojskok · Shift: rychlé kutálení',5)}
function pause(){if(state==='playing')show('paused');else if(state==='paused')start()}
$('#start').onclick=start;$('#pause').onclick=pause;$('#restart').onclick=()=>{reset();state='playing';$('#overlay').style.display='none';hint('Nová cesta začíná.',2)};$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent=sound?'Zvuk: zap.':'Zvuk: vyp.';tone()};$('#full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($('#game').requestFullscreen)await $('#game').requestFullscreen();else hint('Na tomto telefonu otevři hru na šířku.')}catch{hint('Celou obrazovku prohlížeč nepovolil.')}};
const used=['ArrowLeft','ArrowRight','ArrowUp','KeyA','KeyD','KeyW','ArrowDown','KeyS','Space','ShiftLeft','ShiftRight'];
window.addEventListener('keydown',e=>{if(used.includes(e.code)){e.preventDefault();keys.add(e.code);if(!e.repeat&&(e.code==='Space'||(p?.chainGrip===null&&['ArrowUp','KeyW'].includes(e.code))))jump=true}if(e.code==='Escape')pause()});window.addEventListener('keyup',e=>keys.delete(e.code));
function clear(){keys.clear();jump=false;document.querySelectorAll('[data-key]').forEach(b=>b.classList.remove('active'))}window.addEventListener('blur',()=>{clear();if(state==='playing')show('paused')});document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing')show('paused')});
for(const b of document.querySelectorAll('[data-key]')){b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);b.classList.add('active');if(b.dataset.key==='Space')jump=true});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>{keys.delete(b.dataset.key);b.classList.remove('active')})}
function resize(){let d=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;canvas.width=w*d;canvas.height=h*d;vw=Math.max(480,H*w/h);ctx.setTransform(canvas.width/vw,0,0,canvas.height/H,0,0)}window.addEventListener('resize',resize);resize();
function update(dt){t+=dt;
if(ending){endingTime+=dt;cam+=(Math.max(0,190-vw*.35)-cam)*Math.min(1,dt*3);camY+=(-605-camY)*Math.min(1,dt*3);if(endingTime>8)show('won');return;}
arrival=Math.max(0,arrival-dt);if(portalFall){p.vy+=700*dt;p.y+=p.vy*dt;angle+=dt*2;if(p.y>H+70)enterFloor();return;}inv=Math.max(0,inv-dt);if(toast>0&&(toast-=dt)<=0)$('#hint').textContent='';let dir=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0),roll=keys.has('ShiftLeft')||keys.has('ShiftRight'),speed=roll?470:225;
p.chainCooldown=Math.max(0,p.chainCooldown-dt);
if(p.chainGrip!==null){let climb=(keys.has('ArrowUp')||keys.has('KeyW')?1:0)-(keys.has('ArrowDown')||keys.has('KeyS')?1:0);p.chainGrip=Math.max(80,Math.min(CHAIN.length,p.chainGrip-climb*165*dt));rideChain();if(jump){p.chainGrip=null;p.chainCooldown=.65;p.vx+=dir*180;p.vy=Math.min(0,p.vy)-650;p.airJump=true;jump=false;tone(650,.1)}}
if(p.chainGrip===null){
p.vx+=(dir*speed-p.vx)*Math.min(1,dt*(p.ground?12:5));if(jump&&(p.ground||p.airJump)){if(!p.ground){p.airJump=false;spark(p.x,p.y,'#e9cb83',8)}p.vy=-650;p.ground=false;tone(500,.1)}jump=false;
let ox=p.x,oy=p.y,wasGround=p.ground;p.vy+=1450*dt;p.x=Math.max(R,Math.min(END-R,p.x+p.vx*dt));
for(const b of platforms){if(oy+R>b.y+5&&oy-R<b.y+b.h){if(ox+R<=b.x&&p.x+R>b.x){p.x=b.x-R;p.vx=0}if(ox-R>=b.x+b.w&&p.x-R<b.x+b.w){p.x=b.x+b.w+R;p.vx=0}}}
for(const b of barriers){if(b.broken||p.x+R<=b.x||p.x-R>=b.x+b.w||p.y+R<=b.y||p.y-R>=b.y+b.h)continue;if(roll&&Math.abs(p.vx)>230){b.broken=true;spark(b.x+b.w/2,b.y+b.h/2,b.kind==='compass'?'#c6ced0':'#eee3cb',36);tone(230,.2);hint(b.kind==='compass'?'Kružítko se rozpadlo v kloubu!':'Sádra je rozbitá!',2)}else{p.x=ox<b.x+b.w/2?b.x-R:b.x+b.w+R;p.vx=0;hint('Podrž Shift a rozjeď se proti překážce.',1)}}

p.y+=p.vy*dt;p.ground=false;let floor=GROUND;if(stage===1&&p.x>3935+R*.5&&p.x<4085-R*.5)floor=Infinity;
for(const b of platforms){if(p.x+R*.65>b.x&&p.x-R*.65<b.x+b.w&&oy+R<=b.y+5&&p.y+R>=b.y&&p.vy>=0)floor=Math.min(floor,b.y);if(p.x+R>b.x&&p.x-R<b.x+b.w&&oy-R>=b.y+b.h&&p.y-R<b.y+b.h&&p.vy<0){p.y=b.y+b.h+R;p.vy=0}}

if(p.y+R>=floor&&p.vy>=0){p.y=floor-R;p.vy=0;p.ground=true;p.airJump=true;if(!wasGround)tone(340,.055)}
if(stage===1&&p.ground&&p.x>845&&p.x<925&&floor===GROUND){p.vy=-810;p.ground=false;p.airJump=true;spark(p.x,GROUND);tone(960,.23);hint('Pružina! Ve vzduchu drž směr.',2)}
if(stage===2&&p.x+R>1400&&p.x-R<2300&&p.y-R<330){p.y=330+R;p.vy=Math.max(0,p.vy);}
if(stage===1&&p.x>3950&&p.x<4070&&p.y>315&&p.vy>=0){portalFall=true;p.x=4010;p.vx=0;p.chainGrip=null;hint('Dolů ze stolu…',2);}
catchChain();
}

if(p.chainGrip!==null)angle=-chainPose().a*.3;else if(roll&&Math.abs(p.vx)>40)angle+=p.vx*dt/R;else{angle=angle%(Math.PI*2);if(angle>Math.PI)angle-=Math.PI*2;if(angle< -Math.PI)angle+=Math.PI*2;angle+=(Math.sin(t*12)*.13*(Math.abs(p.vx)/225)-angle)*Math.min(1,dt*12)}
for(const g of gems)if(!g.got&&Math.hypot(p.x-g.x,p.y-g.y)<45){g.got=true;collected++;spark(g.x,g.y,'#f594a1');tone(750+collected*80);updateHUD();if(collected===22)hint('Všechny bonusové granáty jsou tvoje!',4)}
if(stage===1&&p.x>1990&&checkpoint<1900){checkpoint=2020;hint('Záchytný bod. Dál pozor na padající obličeje. Ptáci neublíží, kameny ano.',4)}
if(stage===2&&p.x>1320&&checkpoint<1300){checkpoint=1340;hint('Pod skříní: pozor na padající obličeje.',4)}
// Birds belong to the table and lower shelf, never the floor, ascent, or final gallery.
const birdsVisible=stage===1||(stage===3&&!upperReached&&p.y>180&&p.chainGrip===null&&camY>-90);
if(!birdsVisible){birds=[];nextBird=0;}
if(birdsVisible){
if((nextBird-=dt)<=0){let wave=birdWave++,direction=wave%2? -1:1;birds.push({x:direction>0?-70:vw+70,y:0,baseY:[145,205,175,235][wave%4],vx:direction*(65+(wave%3)*20),phase:wave});nextBird=2.4}
for(const b of birds){b.x+=b.vx*dt;b.y=b.baseY+Math.sin(t*1.7+b.phase)*10}birds=birds.filter(b=>b.x> -120&&b.x<vw+120);
}
const dropZone=stage===1?p.x>800&&p.x<3750:stage===2?p.x>1450&&p.x<2960:p.x>550&&p.x<2180;
if(dropZone&&!nearLongChain(p.x)&&p.chainGrip===null&&(nextDrop-=dt)<=0){let x=Math.max(80,Math.min(END-150,p.x+p.vx*.55)),kind=dropCount++%3===2?'stone':'mask',floor=GROUND,under=stage===2&&x>1400&&x<2300,from=under?330:p.y-470;
for(const b of platforms)if(x>=b.x&&x<=b.x+b.w&&b.y>from+60)floor=Math.min(floor,b.y);
if(!nearLongChain(x))warnings.push({x,kind,floor,from,time:1.25});nextDrop=stage===1?3.6:2.2}

warnings=warnings.filter(w=>!nearLongChain(w.x));drops=drops.filter(d=>!nearLongChain(d.x));
for(const w of warnings)w.time-=dt;for(const w of warnings.filter(w=>w.time<=0))drops.push({x:w.x,kind:w.kind,floor:w.floor,y:w.from,vy:15,a:0});warnings=warnings.filter(w=>w.time>0);
for(const d of drops){let r=d.kind==='stone'?23:28;d.vy=Math.min(stage===1?145:65,d.vy+55*dt);d.y+=d.vy*dt;d.a=d.kind==='mask'?Math.sin(t*1.6+d.x)*.13:d.a+dt*.45;if(d.y+r>=d.floor){spark(d.x,d.floor,d.kind==='stone'?'#b65470':'#abb5b8',10);d.y=900;continue}if(Math.hypot(d.x-p.x,d.y-p.y)<R+r-6)hit()}drops=drops.filter(d=>d.y<800);
if(stage===2&&p.x>3380&&p.y<-345){enterShelf();return;}
if(stage===3&&!upperReached&&p.x<2220&&p.y<-195&&p.ground){upperReached=true;checkpoint=2030;checkpointY=-215;hint('Teď DOLEVA. Za nástroji čeká zlatý zub.',5)}
if(stage===3&&p.y<-195&&Math.hypot(p.x-410,p.y+235)<55){toothTaken=true;ending=true;document.body.classList.add('finale');endingTime=0;drops=[];warnings=[];keys.clear();jump=false;hint('Zlatý zub…',2);tone(1100,.5);p.vx=0;p.vy=0;}


for(const a of particles){a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=500*dt;a.life-=dt}particles=particles.filter(a=>a.life>0);cam+=(Math.max(0,Math.min(END-vw,p.x-vw*.35))-cam)*Math.min(1,dt*5);let targetY=stage===1?0:Math.min(0,p.y-H*.57);camY+=(targetY-camY)*Math.min(1,dt*5)}
function metal(b){
if(b.kind==='shelf'){ctx.drawImage(img.cabinet,30,535,2090,50,b.x,b.y,b.w,b.h);return}
if(b.kind==='ruler'||b.kind==='file'){drawTool(b);return}
if(b.kind){let a=img[b.kind];if(b.kind==='ring')ctx.drawImage(a,54,46,1147,1171,b.x-3,b.y-2,b.w+6,b.h+4);else ctx.drawImage(a,b.x-3,b.y-2,b.w+6,b.h+4);return}

// Photographic block artwork replaces the old flat rectangles; collision tops stay unchanged.
let asset=b.dark?img.solder:img.steel;
ctx.fillStyle='#0004';ctx.beginPath();ctx.ellipse(b.x+b.w/2,GROUND+3,b.w*.53,8,0,0,Math.PI*2);ctx.fill();
let source=b.dark?[8,142,1886,609]:[24,150,1856,527];
ctx.drawImage(asset,...source,b.x-3,b.y-2,b.w+6,b.h+4);
}
function jewel(x,y,size=14){ctx.save();ctx.translate(x,y);ctx.shadowColor='#fb416d';ctx.shadowBlur=16;ctx.fillStyle='#730e30';ctx.beginPath();for(let i=0;i<7;i++){let a=i*Math.PI*2/7;ctx.lineTo(Math.cos(a)*size,Math.sin(a)*size)}ctx.closePath();ctx.fill();ctx.shadowBlur=0;for(let i=0;i<7;i++){let a=i*Math.PI*2/7,b=(i+1)*Math.PI*2/7;ctx.fillStyle=['#f99daa','#b92d54','#5c0525','#930c36','#3d0a23','#e65a76','#ffd0c4'][i];ctx.beginPath();ctx.moveTo(-3,-3);ctx.lineTo(Math.cos(a)*size,Math.sin(a)*size);ctx.lineTo(Math.cos(b)*size,Math.sin(b)*size);ctx.closePath();ctx.fill()}ctx.restore()}
function princess(x,y,a=0,scale=1){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.drawImage(img.princess,-36*scale,-61*scale,72*scale,89*scale);ctx.restore()}
function drawTool(b){let a=img[b.kind],r=toolBounds[b.kind];ctx.drawImage(a,...r,b.x,b.y,b.w,b.h);}
// A single front incisor: broad crown, straight cutting edge, no molar roots.
function drawIncisor(x,y,w,h,a=0){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.scale(w/40,h/48);let gold=ctx.createLinearGradient(-20,0,20,0);gold.addColorStop(0,'#82500f');gold.addColorStop(.25,'#ffe4a0');gold.addColorStop(.55,'#e8b849');gold.addColorStop(.8,'#fff1b7');gold.addColorStop(1,'#a96b18');ctx.fillStyle=gold;ctx.strokeStyle='#70470d';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-14,-23);ctx.quadraticCurveTo(0,-28,14,-23);ctx.quadraticCurveTo(20,-18,18,-7);ctx.lineTo(16,20);ctx.quadraticCurveTo(0,24,-16,20);ctx.lineTo(-18,-7);ctx.quadraticCurveTo(-20,-18,-14,-23);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#fff2ba';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-11,-16);ctx.quadraticCurveTo(-14,0,-11,15);ctx.stroke();ctx.restore()}
const exhibits=[
[1,580,385,0],[1,1850,300,3],[1,2810,325,7],[1,3590,363,8],
[2,430,510,1],[2,850,510,5],[2,2620,510,9],
[3,650,-190,2],[3,940,-190,4],[3,1240,-190,6],[3,1450,-220,10],[3,1660,-220,11],[3,1850,-190,12],[3,2020,-190,13],[3,2180,-190,14]];
function drawGallery(){for(const [level,x,base,id] of exhibits){if(stage!==level||x<cam-180||x>cam+vw+180)continue;const a=img['gallery'+id];if(!a)continue;let height=level===3?100:72,top=base-height,w=level===3?132:112,photoH=100;ctx.save();ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(x,base+4,w*.6,8,0,0,7);ctx.fill();let velvet=ctx.createLinearGradient(x-w/2,0,x+w/2,0);velvet.addColorStop(0,'#111d23');velvet.addColorStop(.5,'#33464b');velvet.addColorStop(1,'#101a20');ctx.fillStyle=velvet;ctx.fillRect(x-w/2,top,w,height);ctx.fillStyle='#ba9b60';ctx.fillRect(x-w/2-4,top,w+8,4);ctx.fillStyle='#eeeae2';ctx.fillRect(x-w/2-2,top-photoH-5,w+4,photoH+4);ctx.fillStyle='#fff';ctx.fillRect(x-w/2,top-photoH-3,w,photoH);const ratio=Math.min((w-8)/a.width,(photoH-8)/a.height),iw=a.width*ratio,ih=a.height*ratio;ctx.drawImage(a,x-iw/2,top-photoH/2-3-ih/2,iw,ih);ctx.fillStyle='#dec58d';ctx.textAlign='center';ctx.font='10px Georgia';ctx.fillText('ELA ZOLO',x,top+23);ctx.restore()}
if(stage===3){ctx.save();ctx.fillStyle='#dec58d';ctx.textAlign='center';ctx.font='23px Georgia';ctx.fillText('ELA ZOLO · GALERIE',1510,-470);ctx.font='12px Georgia';ctx.fillText('Autorské šperky z Olomouce',1510,-447);ctx.restore()}}
const toolBounds={"tooth": [160, 57, 904, 1181], "candle": [56, 93, 1051, 1232], "ruler": [18, 265, 2137, 186], "file": [27, 216, 2117, 244]};
function drawCompass(b){ctx.save();ctx.translate(b.x+b.w/2,b.y+12);ctx.lineCap='round';for(const sign of [-1,1]){ctx.beginPath();ctx.moveTo(sign*4,0);ctx.lineTo(sign*29,b.h-12);ctx.strokeStyle='#30383a';ctx.lineWidth=9;ctx.stroke();ctx.strokeStyle='#d1d1c6';ctx.lineWidth=4;ctx.stroke()}ctx.fillStyle='#a2aaab';ctx.beginPath();ctx.arc(0,0,11,0,7);ctx.fill();ctx.fillStyle='#263438';ctx.fillRect(-6,-1,12,2);ctx.restore()}
function mist(x,y,r,alpha,color){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${color},${alpha})`);g.addColorStop(1,`rgba(${color},0)`);ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r)}
function drawFinale(){const base=-190,grow=ending?Math.min(1,endingTime/3):0,scale=1.4+grow*2.05,queenX=220,queenY=base-28*scale;
princess(queenX,queenY,endingTime>3&&endingTime<5?-.16:0,scale);
const cx=90,cy=base-135;ctx.drawImage(img.candle,...toolBounds.candle,cx-40,cy,80,135);
// Warm flowing wax and a breathing flame; after the breath only smoke remains.
ctx.fillStyle='#e7d8b0';for(let i=0;i<3;i++){let y=cy+40+((t*13+i*29)%75);ctx.beginPath();ctx.ellipse(cx-22+i*18,y,3,7,0,0,7);ctx.fill()}
const flameOn=!ending||endingTime<5;
if(flameOn){ctx.save();ctx.translate(cx,cy+5);const gust=endingTime>3?Math.min(1,(endingTime-3)/1.5):0;ctx.rotate(gust?-gust*1.25:Math.sin(t*7)*.08);ctx.scale(1+gust*.5,1-gust*.45);let glow=ctx.createRadialGradient(0,-14,2,0,-14,100);glow.addColorStop(0,'#ffc86066');glow.addColorStop(1,'#ffbe4400');ctx.fillStyle=glow;ctx.fillRect(-100,-114,200,200);ctx.fillStyle='#ffb947';ctx.beginPath();ctx.ellipse(0,-18,9,23+Math.sin(t*10)*3,0,0,7);ctx.fill();ctx.fillStyle='#fff3c0';ctx.beginPath();ctx.ellipse(0,-12,4,12,0,0,7);ctx.fill();ctx.restore()}
else if(endingTime<7){for(let i=0;i<18;i++){let life=((endingTime-5)*.8+i/18)%1,x=cx-life*125+Math.sin(i*3+life*9)*8,y=cy-life*75;mist(x,y,4+life*17,(1-life)*.10,'190,203,211')}}
if(!toothTaken){ctx.save();ctx.shadowColor='#ffcd50';ctx.shadowBlur=25;drawIncisor(410,base-52,48,58);ctx.restore()}
else{let u=Math.min(1,endingTime/1.7),x=410+(queenX-410)*u,y=base-45+(queenY+12*scale-(base-45))*u;let turn=endingTime>3&&endingTime<5?-.16:0;if(u===1){x=queenX-Math.sin(turn)*12*scale;y=queenY+Math.cos(turn)*12*scale}drawIncisor(x,y,18+u*(10*scale-18),22+u*(13*scale-22),turn*u)}
if(endingTime>3&&endingTime<5.3){const strength=Math.sin(Math.min(1,(endingTime-3)/2.3)*Math.PI),mx=queenX-28,my=queenY+13*scale;ctx.save();ctx.globalCompositeOperation='screen';
for(let i=0;i<42;i++){let u=((endingTime-3)*1.15+i*.618)%1,swirl=Math.sin(u*10+i*2.4),spread=5+u*24,x=mx-(mx-cx+65)*u,y=my+(cy-my-10)*u+swirl*spread;mist(x,y,6+u*18,strength*(1-u)*.075,'193,220,228');if(i%3===0){ctx.fillStyle=`rgba(234,238,225,${strength*(1-u)*.6})`;ctx.beginPath();ctx.ellipse(x,y,1.6,1,0,0,7);ctx.fill()}}
ctx.restore();}
}
function draw(){ctx.clearRect(0,0,vw,H);if(!img.bench)return;let bg=stage===1?img.bench:img.floor;ctx.fillStyle='#0d1c20';ctx.fillRect(0,0,vw,H);if(stage!==3)ctx.drawImage(bg,0,0,bg.width,bg.height,0,stage===1?0:-camY,vw,H);ctx.save();ctx.globalAlpha=.78;for(const b of birds){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.sin(t*1.7+b.phase)*.06);ctx.scale(b.vx>0?1:-1,.9+Math.sin(t*9+b.phase)*.1);ctx.drawImage(img.bird,-38,-26,76,52);ctx.restore()}ctx.restore();ctx.save();ctx.translate(-cam,-camY);
if(stage===2){ctx.fillStyle='#070b0cd9';ctx.fillRect(1400,320,900,190);ctx.drawImage(img.cabinet,20,137,2132,451,1400,25,900,305);ctx.fillStyle='#392b20';ctx.fillRect(1400,320,18,190);ctx.fillRect(2282,320,18,190);}
if(stage===3){ctx.drawImage(img.cabinet,30,535,2090,50,0,GROUND,END,65);}
drawGallery();
for(const b of platforms)metal(b);
{
// Interlocked silver links rotate together around the fixed hanging point.
ctx.save();ctx.translate(CHAIN.x,CHAIN.y);ctx.rotate(-chainPose().a);
for(let d=8,i=0;d<=CHAIN.length;d+=12,i++){let rx=i%2?3:7;ctx.beginPath();ctx.ellipse(1,d+1,rx,10,0,0,Math.PI*2);ctx.strokeStyle='#101b20';ctx.lineWidth=5;ctx.stroke();ctx.beginPath();ctx.ellipse(0,d,rx,10,0,0,Math.PI*2);ctx.strokeStyle=i%2?'#8c989c':'#d1d5d0';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.ellipse(-1,d-1,rx,10,0,Math.PI,Math.PI*1.8);ctx.strokeStyle='#f4ebd5';ctx.lineWidth=1;ctx.stroke()}
ctx.restore();ctx.beginPath();ctx.arc(CHAIN.x,CHAIN.y,10,0,Math.PI*2);ctx.fillStyle='#8e999b';ctx.fill();ctx.strokeStyle='#d5d8cf';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.moveTo(CHAIN.x-5,CHAIN.y+4);ctx.lineTo(CHAIN.x+5,CHAIN.y-4);ctx.strokeStyle='#283638';ctx.stroke();
if(stage===1){ctx.save();ctx.translate(885,GROUND);ctx.strokeStyle='#a6b1b4';ctx.lineWidth=4;for(let i=0;i<8;i++){ctx.beginPath();ctx.ellipse(-29+i*8,-13,6,16,-.12,0,Math.PI*2);ctx.stroke()}ctx.restore();}
}
for(const b of barriers)if(!b.broken){if(b.kind==='compass')drawCompass(b);else ctx.drawImage(img.plaster,99,70,1064,1122,b.x-4,b.y-4,b.w+8,b.h+8);}

if(stage===1){ctx.fillStyle='#080b0e';ctx.fillRect(3935,330,150,H-330);ctx.strokeStyle='#8b7150';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(3935,330);ctx.lineTo(3935,H);ctx.moveTo(4085,330);ctx.lineTo(4085,H);ctx.stroke();ctx.fillStyle='#e6c991';ctx.font='26px Georgia';ctx.textAlign='center';ctx.fillText('↓',4010,307);ctx.textAlign='start';}

for(const g of gems)if(!g.got)jewel(g.x,g.y+Math.sin(t*3+g.x)*4);
for(const w of warnings){ctx.fillStyle=`rgba(210,63,70,${.25+.18*Math.sin(t*20)})`;ctx.beginPath();ctx.ellipse(w.x,w.floor,45,8,0,0,7);ctx.fill();ctx.fillStyle='#ffcbb6';ctx.font='bold 24px Georgia';ctx.fillText('!',w.x-4,w.floor-22)}
for(const d of drops){ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.a);if(d.kind==='stone')ctx.drawImage(img.stone,-32,-24,64,48);else ctx.drawImage(img.mask,-39,-49,78,98);ctx.restore()}

ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(p.x,GROUND+4,28,6,0,0,7);ctx.fill();if(inv<=0||Math.floor(t*12)%2)princess(p.x,p.y,angle);if(stage===3)drawFinale();
for(const a of particles){ctx.globalAlpha=Math.max(0,a.life/.7);ctx.fillStyle=a.color;ctx.fillRect(a.x,a.y,3,3)}ctx.globalAlpha=1;
ctx.font='12px Georgia';ctx.fillStyle='#e4d4b3';ctx.textAlign='center';for(const [x,y,s] of (stage===1?[[885,556,'PRUŽINA'],[1500,505,'CHYTNI SE · MEZERNÍK = ODSKOK'],[3120,555,'SÁDRA · SHIFT →'],[4010,585,'DOLŮ ZE STOLU']]:stage===2?[[730,560,'ZTRACENÉ PRSTENY'],[1810,560,'POD SKŘÍNÍ'],[2480,560,'SÁDRA · SHIFT →'],[3060,560,'↑ VYŠPLHEJ K POLIČCE'],[3320,-365,'DOPRAVA →']]:[[800,565,'PO POLIČCE DOPRAVA →'],[2390,565,'↑ ŠPLHEJ A ZHOUPNI SE DOLEVA'],[2020,-145,'← ZA ZLATÝM ZUBEM'],[1140,-145,'SHIFT + ←'],[420,-145,'ZLATÝ ZUB']]))ctx.fillText(s,x,y);ctx.restore();
if(arrival>0){ctx.fillStyle=`rgba(5,12,15,${arrival})`;ctx.fillRect(0,0,vw,H)}
let progress=p?Math.min(1,stage===3?(2+(upperReached?1-p.x/END:.5*p.x/END))/3:((stage-1)+p.x/END)/3):0;ctx.fillStyle='#d8bb7555';ctx.fillRect(0,H-3,vw,3);ctx.fillStyle='#e8cb87';ctx.fillRect(0,H-3,vw*progress,3);if(endingTime>5){ctx.fillStyle=`rgba(0,0,0,${Math.min(1,(endingTime-5)/2)})`;ctx.fillRect(0,0,vw,H)}}
function frame(now){let dt=Math.min((now-last)/1000,.035);last=now;if(state==='playing'){let n=Math.ceil(dt/.008);for(let i=0;i<n;i++)if(state==='playing')update(dt/n)}if(p)draw();requestAnimationFrame(frame)}
Promise.all(['bench','princess','bird','mask','stone','steel','solder','floor','ring','plaster','cabinet','candle','ruler','file',...galleryFiles.map((_,i)=>'gallery'+i)].map(k=>new Promise((resolve,reject)=>{let a=new Image();a.onload=()=>{img[k]=a;resolve()};a.onerror=reject;a.src=k.startsWith('gallery')?'gallery/'+galleryFiles[Number(k.slice(7))]:`assets/${k}.png?v=1.6`}))).then(()=>{reset();state='ready';$('#start').disabled=false;$('#start').textContent='Začít dobrodružství';requestAnimationFrame(frame)}).catch(()=>{$('#heading').textContent='Obrázky se nenačetly';$('#intro').textContent='Zkontroluj, že vedle index.html zůstala složka assets s obrázky, a obnov stránku.'});
window.__gameTest={tablePlatforms,floorPlatforms,shelfPlatforms,gemSeeds,floorGemSeeds,chainPose,reset,draw,getState:()=>({p,state,collected,hearts,birds,drops,warnings,inv,t,stage,portalFall,barrier:barriers.some(b=>!b.broken),barriers,platforms,checkpoint,checkpointY,ending,endingTime,toothTaken,upperReached,camY,CHAIN}),step:update};
})();
