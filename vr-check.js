/* DEX51Q – VR mód (telefon a VR-szemüvegben): fekvő, kétszemes nézet; a hátsó kamera élő képe mindkét szemnek, rajta a DEX feje,
   az állapota, a beszélgetés szövege és kérésre a WORK. Hangvezérlés: „VR mód” / „VR vége”. Csak szobában, helyben állva vagy ülve! */
(function(){'use strict';
 var Dx=window.DEX40;if(!Dx||typeof Dx.handle!=='function'||Dx.__vr)return;
 var $=function(i){return document.getElementById(i)};
 function fold(s){return Array.from(String(s||'')).map(function(c){var b=c.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();return b.length?b.charAt(0):c}).join('')}
 var ENTER=/\b(vr|v r|v-r|vi ?-?ar|vi er|ve er|we are|virtualis (valosag|mod|szemuveg)|vr szemuveg)\b/,EXIT=/\b(vr|v r|vi ?-?ar|virtualis)\b.*\b(vege|ki|kikapcs\w*|leall\w*|bezar\w*|kilep\w*)\b|\b(kilep\w*|lepj ki|lepek ki|zard be|vissza)\b.*\b(vr|v r|vi ?-?ar|virtualis)\b|^(kilepek|vege)$/;
 var WORKV=/\bwork\w*\b.*\b(vr|itt|ide|mutasd|nyisd|jelenj\w*|vasarlo\w*|vevo\w*|rendel\w*|uzlet\w*|shop\w*)\b|\b(mutasd|nyisd|hozd|tedd|rakd|nyisd meg)\b.*\b(work\w*|vasarlo\w*|vevo\w*|rendel\w*|uzlet\w*|shop\w*)\b/;
 var st=null,root=null,eyes=[],poll=null,timers=[],startedMic=false,workOn=false,warned=0;
 var SS=document.createElement('style');SS.textContent=
  '#dyVR{position:fixed;z-index:2147483200;background:transparent;display:none;overflow:hidden;top:0;left:0;width:100vw;height:100vh}#dyVR.on{display:flex}'+
  '#dyVR.rot{width:100vh;height:100vw;transform-origin:0 0;transform:translateX(100vw) rotate(90deg)}'+
  '#dyVR .eye{position:relative;flex:1 1 50%;width:50%;height:100%;overflow:hidden;background:transparent}'+
  '#dyVR.nocam .eye{background:radial-gradient(120% 90% at 50% 10%,#1b2a85 0%,#0d1440 45%,#050b22 100%)}#dyVR.nocam video{display:none}#dyVR video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}'+
  '#dyVR .hud{position:absolute;inset:0;pointer-events:none;transform:translateX(var(--ipd,0px))}'+
  '#dyVR .hd,#dyVR .stt,#dyVR .vm,#dyVR .foot{display:none!important}'+
  '#dyVR .hd{position:absolute;left:50%;bottom:6%;width:min(24vh,26%);aspect-ratio:830/990;transform:translateX(-50%);background:var(--vrhead,none) center/contain no-repeat;filter:drop-shadow(0 0 14px #4f9bffcc);animation:vrfl 4s ease-in-out infinite}'+
  '@keyframes vrfl{50%{transform:translateX(-50%) translateY(-1.6vh)}}'+
  '#dyVR .stt{position:absolute;left:50%;bottom:calc(6% + min(24vh,26%)*1.19 + 4px);transform:translateX(-50%);font:600 3.4vh system-ui,sans-serif;color:#bfeaff;text-shadow:0 0 8px #000,0 1px 3px #000;letter-spacing:.06em;white-space:nowrap}'+
  '#dyVR .vm{position:absolute;left:8%;right:8%;top:7%;font:500 4.2vh/1.3 system-ui,sans-serif;color:#fff;text-align:center;text-shadow:0 0 10px #000,0 1px 4px #000;white-space:pre-wrap}'+
  '#dyVR .vm .me{color:#9fe1ff;font-size:3.4vh}'+
  '#dyVR .warn{position:absolute;left:6%;right:6%;top:42%;transform:translateY(-50%);padding:1.6vh 2vh;border-radius:2vh;background:#000000b0;border:1px solid #ffd27a88;color:#ffe7b3;font:600 3.6vh/1.3 system-ui,sans-serif;text-align:center}'+
  '#dyVR .foot{position:absolute;left:0;right:0;bottom:1.2%;text-align:center;white-space:nowrap;overflow:hidden;font:600 2vh system-ui,sans-serif;color:#ffd27acc;text-shadow:0 1px 3px #000}'+
  '#dyVR .wk{position:absolute;right:5%;top:13%;width:42%;height:74%;border:1px solid #8ce7ff77;border-radius:2vh;overflow:hidden;background:#07162a38;box-shadow:0 0 22px #3d7bff55;backdrop-filter:blur(2px)}#dyVR .wk iframe{width:300%;height:300%;border:0;transform:scale(.3334);transform-origin:0 0;pointer-events:none;background:transparent;opacity:.97}'+
  '#dyVR .sk{position:absolute;left:5%;top:16%;display:none;gap:2.4vh;align-items:flex-start;padding:1.2vh 1.5vh;border-radius:1.5vh;background:#04123d62;border:1px solid #5fe3ff55;box-shadow:0 0 14px #3d7bff40;backdrop-filter:blur(1.5px);transform-origin:0 0;transform:scale(var(--skz,1))}#dyVR .sk.on{display:flex}'+
  '#dyVR .sk table{border-collapse:separate;border-spacing:.5vh}#dyVR .sk td{width:4.7vh;height:4.7vh;text-align:center;font:700 3.5vh/4.7vh system-ui,sans-serif;color:#eaf6ff;text-shadow:0 1px 5px #000,0 0 8px #001;border-radius:.7vh;background:#06162b35}#dyVR .sk td.f{background:#2fd5ff66;color:#fff;box-shadow:0 0 10px #2fd5ff;text-decoration:line-through;text-decoration-thickness:.5vh}#dyVR .sk td.h{outline:.5vh solid #ffd27a;animation:skh 1s infinite}@keyframes skh{50%{outline-color:transparent}}'+
  '#dyVR .sk .wl{font:600 2.9vh/1.3 system-ui,sans-serif;color:#cfeaff;text-shadow:0 0 6px #000;min-width:14vh}#dyVR .sk .wl b{display:block;color:#ffd27a;font-size:2.6vh;letter-spacing:.08em;margin-bottom:.6vh}#dyVR .sk .wl i{display:block;font-style:normal}#dyVR .sk .wl i.d{color:#7fe8ff;text-decoration:line-through}#dyVR .sk .tm{margin-top:1vh;color:#9bb7d8;font-size:2.4vh}#dyVR .sk.p{opacity:.5}'+
  '#dyVR.g .vm{font-size:2.5vh;top:2.5%;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}#dyVR.g .vm .me{font-size:2.2vh}#dyVR.g .hd{width:min(11vh,12%)}#dyVR.g .stt{bottom:calc(6% + 14vh);font-size:2.6vh}#dyVR.g .warn{display:none}'+
  '#dyVR .gaze{position:absolute;left:50%;top:50%;width:1.2vh;height:1.2vh;margin:-.6vh;border-radius:50%;background:#5fe3ffaa}';
 document.head.appendChild(SS);
 function setHead(){try{var im=document.querySelector('img.robot');if(im&&im.src)document.documentElement.style.setProperty('--vrhead','url("'+im.src+'")')}catch(e){}}
 function mk(){
  root=document.createElement('div');root.id='dyVR';root.setAttribute('role','dialog');root.setAttribute('aria-label','VR mód');
  eyes=[0,1].map(function(i){var e=document.createElement('div');e.className='eye';
   e.innerHTML='<video autoplay playsinline muted></video><div class="hud"><div class="vm"></div><div class="stt"></div><div class="hd"></div><div class="wk" hidden></div><div class="sk"></div><div class="warn" hidden></div><div class="foot">Csak zárt térben! · Kilépés: „VR vége” vagy 3 koppintás</div></div>';
   root.appendChild(e);return e});
  document.body.appendChild(root);
  var taps=[];root.addEventListener('click',function(){var n=Date.now();taps=taps.filter(function(t){return n-t<1200});taps.push(n);if(taps.length>=3){taps=[];leave()}});
 }
 function layout(){if(!root)return;var por=window.innerHeight>window.innerWidth&&!(screen.orientation&&/landscape/.test(screen.orientation.type||'')&&window.innerWidth>window.innerHeight);root.classList.toggle('rot',por)}
 function hud(fn){eyes.forEach(function(e,i){fn(e.querySelector('.hud'),i)})}
 function ipd(){var v=+(localStorage.getItem('dex51_vr_ipd')||0)||0;eyes.forEach(function(e,i){e.querySelector('.hud').style.setProperty('--ipd',((i?-1:1)*(5+v))+'px')})}
 var fc=0;
 function feed(){if(G&&!G.paused&&!G.done&&(++fc%3===0))skRender()}
 function setWork(on){workOn=!!on;hud(function(x){var w=x.querySelector('.wk');w.hidden=!workOn;if(workOn&&!w.firstChild){var f=document.createElement('iframe');f.src=new URL('./work/index.html',location.href).href;f.setAttribute('loading','eager');f.onload=function(){try{var d=f.contentDocument;if(d){var st=d.createElement('style');st.textContent='html,body{background:transparent!important}.app,.app-shell{background:transparent!important}';d.head.appendChild(st)}}catch(e){}};w.appendChild(f)}else if(!workOn){w.innerHTML=''}})}
 function warn(t,ms){hud(function(x){var w=x.querySelector('.warn');w.textContent=t;w.hidden=false});timers.push(setTimeout(function(){hud(function(x){x.querySelector('.warn').hidden=true})},ms||6000))}
 async function enter(gesture){
  if(root&&root.classList.contains('on'))return 'A VR mód már be van kapcsolva.';
  var stream=null,nocam='';
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)nocam='A kamera csak biztonságos (https) címen vagy telepített alkalmazásként érhető el, ezért kamerakép nélkül indítottam.';
  else{try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false})}
   catch(e){nocam='A kamerát nem tudom megnyitni ('+(e&&e.name==='NotAllowedError'?'nincs engedélyezve a böngészőben':e&&e.message||'hiba')+'), ezért kamerakép nélkül indítottam.'}}
  st=stream;if(!root)mk();setHead();root.classList.toggle('nocam',!stream);
  eyes.forEach(function(e){var v=e.querySelector('video');if(stream){v.srcObject=stream;v.play&&v.play().catch(function(){})}});
  root.classList.add('on');layout();ipd();feed();poll=setInterval(feed,400);window.addEventListener('resize',layout);
  try{if(gesture&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen()}catch(e){}
  try{if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape')}catch(e){}
  layout();
  if(window.DEX_LISTEN&&!window.DEX_LISTEN.on()){try{window.DEX_LISTEN.start();startedMic=true}catch(e){}}
  // No visual status or transcript is shown in headset mode.
  if(nocam){try{console.warn('DEX VR camera:',nocam)}catch(e){}}
  return 'VR mód bekapcsolva. A kamera képét látod mindkét szemmel, én itt vagyok előtted, és folyamatosan hallgatlak. Csak szobában, helyben állva vagy ülve használd, sétálni nem szabad. Kilépés: mondd, hogy VR vége.'}
 function leave(){
  if(!root||!root.classList.contains('on'))return 'A VR mód nincs bekapcsolva.';
  G=null;skRender();root.classList.remove('on');clearInterval(poll);poll=null;timers.forEach(clearTimeout);timers=[];window.removeEventListener('resize',layout);
  try{if(st)st.getTracks().forEach(function(t){t.stop()})}catch(e){}st=null;eyes.forEach(function(e){var v=e.querySelector('video');v.srcObject=null});setWork(false);
  try{if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen()}catch(e){}try{screen.orientation&&screen.orientation.unlock&&screen.orientation.unlock()}catch(e){}
  if(startedMic&&window.DEX_LISTEN&&window.DEX_LISTEN.on())window.DEX_LISTEN.stop();startedMic=false;
  return 'Kiléptem a VR módból.'}

 /* ---- SZÓKERESŐ: betűrács a kameraképen, hangvezérléssel ---- */
 var WORDS='HOLD NAP CSILLAG VIZ FELHO ERDO TENGER HEGY VIRAG SZEL NYAR TAVASZ ROBOT AUTO VONAT HAJO REPULO KONYV ASZTAL AJTO ABLAK VAROS UTCA KUTYA MACSKA MADAR KENYER SAJT ALMA KORTE SZILVA KAVE CUKOR ZENE FILM JATEK BARAT CSALAD ISKOLA MUNKA SZIV FEJ SZEM ORR PARK LAMPA TEJ'.split(' ');
 var LET='AAAEEEOIKLMNRSTZGBDHUVYPCJFXW'.split(''),N=8,DIRS=[[0,1],[1,0],[1,1],[-1,1]];
 var G=null;
 function rnd(n){return Math.floor(Math.random()*n)}
 function newGame(){
  var pool=WORDS.filter(function(w){return w.length<=N}).sort(function(){return Math.random()-.5}),words=[],grid=[],i,j,tries=0;
  for(i=0;i<N;i++){grid.push([]);for(j=0;j<N;j++)grid[i].push('')}
  var cells={};
  for(var k=0;k<pool.length&&words.length<6;k++){var w=pool[k],ok=false;
   for(var t=0;t<80&&!ok;t++){var d=DIRS[rnd(DIRS.length)],r=rnd(N),c=rnd(N),er=r+d[0]*(w.length-1),ec=c+d[1]*(w.length-1);if(er<0||er>=N||ec<0||ec>=N)continue;
    var fit=true;for(var q=0;q<w.length;q++){var cur=grid[r+d[0]*q][c+d[1]*q];if(cur&&cur!==w[q]){fit=false;break}}
    if(!fit)continue;var cl=[];for(q=0;q<w.length;q++){grid[r+d[0]*q][c+d[1]*q]=w[q];cl.push([r+d[0]*q,c+d[1]*q])}cells[w]=cl;ok=true}
   if(ok)words.push(w)}
  for(i=0;i<N;i++)for(j=0;j<N;j++)if(!grid[i][j])grid[i][j]=LET[rnd(LET.length)];
  G={grid:grid,words:words,cells:cells,found:{},hint:null,paused:false,t0:Date.now(),zoom:1,tp:0,done:false};
  return G}
 function skHTML(){
  if(!G)return '';var f={};Object.keys(G.found).forEach(function(w){G.cells[w].forEach(function(c){f[c[0]+','+c[1]]=1})});
  var h=G.hint?G.hint.join(','):'',rows=G.grid.map(function(row,i){return '<tr>'+row.map(function(ch,j){var k=i+','+j;return '<td class="'+(f[k]?'f':'')+(h===k?' h':'')+'">'+ch+'</td>'}).join('')+'</tr>'}).join('');
  var sec=Math.floor(((G.done?G.tEnd:Date.now())-G.t0-G.tp)/1000),tm=Math.floor(sec/60)+':'+('0'+sec%60).slice(-2);
  return '<table>'+rows+'</table><div class="wl"><b>KERESD</b>'+G.words.map(function(w){return '<i class="'+(G.found[w]?'d':'')+'">'+w+'</i>'}).join('')+'<div class="tm">'+Object.keys(G.found).length+'/'+G.words.length+' · '+tm+(G.paused?' · szünet':'')+'</div></div>'}
 function skRender(){if(!root)return;root.classList.toggle('g',!!G);hud(function(x){var e=x.querySelector('.sk');if(!e)return;e.classList.toggle('on',!!G);e.classList.toggle('p',!!(G&&G.paused));e.style.setProperty('--skz',G?G.zoom:1);e.innerHTML=skHTML()})}
 function startGame(){newGame();skRender();return 'Szókereső. Keresd meg a rácsban a jobb oldali szavakat (vízszintesen, függőlegesen vagy átlósan, előre olvasva). Ha megvan, mondd: „megvan, HOLD”. Segítség: „tipp”, szünet: „szünet”, nagyítás: „nagyítsd”, új játék: „következő játék”, vége: „szókereső vége”.'}
function lev(a,b){var d=[],i,j;for(i=0;i<=a.length;i++)d[i]=[i];for(j=0;j<=b.length;j++)d[0][j]=j;for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
 function scan(f){var tk=f.split(' ').map(function(t){return t.replace(/[^a-z]/g,'')}).filter(Boolean),un=G.words.filter(function(w){return !G.found[w]}),c=[];
  tk.forEach(function(t,i){c.push(t);if(i+1<tk.length)c.push(t+tk[i+1])});
  for(var i=0;i<c.length;i++)for(var j=0;j<un.length;j++){var w=fz(un[j]),t=c[i];if(t===w||(w.length>=5&&t.length>=4&&lev(t,w)<=1)||(w.length>=4&&t.length>w.length&&t.indexOf(w)===0))return un[j]}
  return null}
 function fz(w){return fold(w).replace(/[^a-z]/g,'')}
 function tryWord(raw){var w=fz(raw);if(!w)return null;var hit=G.words.filter(function(x){return fz(x)===w})[0];
  if(!hit){var near=G.words.filter(function(x){return !G.found[x]&&(fz(x).indexOf(w)===0||w.indexOf(fz(x))===0)&&Math.abs(fz(x).length-w.length)<=1})[0];if(near)hit=near}
  if(!hit)return null;if(G.found[hit])return 'A(z) '+hit+' már megvan.';G.found[hit]=1;G.hint=null;
  if(Object.keys(G.found).length===G.words.length){G.done=true;G.tEnd=Date.now();skRender();var s=Math.floor((G.tEnd-G.t0-G.tp)/1000);return 'Megvan: '+hit+'. Mind megtaláltad '+Math.floor(s/60)+' perc '+s%60+' másodperc alatt! Ügyes vagy. Mondd: következő játék.'}
  skRender();var left=G.words.length-Object.keys(G.found).length;return 'Megvan: '+hit+'! Még '+left+' szó van hátra.'}
 function gameCmd(f,raw){
  if(!G)return null;
  if(/\bszokereso\b.*\b(vege|ki|leall\w*|bezar\w*)\b|\b(vege|kilep\w*|hagyjuk)\b.*\b(szokereso|jatek\w*)\b/.test(f)){G=null;skRender();return 'Kiléptem a szókeresőből.'}
  if(/\b(kovetkezo|uj|masik)\b.*\b(jatek|szokereso)\b|\bujra\b.*\bjatek\b/.test(f)){return startGame()}
  if(/\b(szunet|megallj|pihenj)\b/.test(f)){if(!G.paused){G.paused=true;G.pa=Date.now();skRender()}return 'Szünet. Ha folytatjuk, mondd: folytasd.'}
  if(/\b(folytasd|folytassuk|mehet|tovabb)\b/.test(f)&&G.paused){G.paused=false;G.tp+=Date.now()-G.pa;skRender();return 'Folytatjuk.'}
  if(G.paused)return null;
  if(/\b(nagyits\w*|nagyobb\w*)\b/.test(f)){G.zoom=Math.min(1.7,Math.round((G.zoom+.2)*10)/10);skRender();return 'Nagyítottam.'}
  if(/\b(kicsinyit\w*|kisebb\w*)\b/.test(f)){G.zoom=Math.max(.6,Math.round((G.zoom-.2)*10)/10);skRender();return 'Kicsinyítettem.'}
  if(/\b(tipp\w*|segits\w*|segitsegre|nem talalom)\b/.test(f)){var un=G.words.filter(function(w){return !G.found[w]});if(!un.length)return null;var w=un[rnd(un.length)],c=G.cells[w][0];G.hint=c;skRender();setTimeout(function(){if(G&&G.hint&&G.hint[0]===c[0]&&G.hint[1]===c[1]){G.hint=null;skRender()}},6000);return 'Tipp: a(z) '+w+' kezdőbetűje be van jelölve a rácsban.'}
  var m=/^(?:megvan|megtalaltam|ez az|itt van|talaltam)\W+(.+)$/.exec(f)||/^(?:megvan|megtalaltam)\s+(.+)$/.exec(f);
  var cand=m?m[1]:(f.split(' ').length<=2?f:null);
  if(cand){var r=tryWord(cand);if(r)return r;if(m){var sw=scan(cand);if(sw){var r2=tryWord(sw);if(r2)return r2}return 'Ilyen szót nem találok a listában: '+cand.toUpperCase()+'. Nézd meg a jobb oldali szavakat.'}}
  var sw2=scan(f);if(sw2){var r3=tryWord(sw2);if(r3)return r3}
  return null}
 var h0=Dx.handle;
 Dx.handle=function(raw){
  var f=fold(raw),self=this,args=arguments,vr=!!(root&&root.classList.contains('on'));
  if(f.length<90){
   if(vr&&G){var gc=gameCmd(f,raw);if(gc!==null)return gc}
   if(vr&&/\b(szokereso|szo kereso|betu racs)\w*\b/.test(f)&&!/\b(vege|ki)\b/.test(f))return startGame();
   if(!vr&&/\b(szokereso|szo kereso)\w*\b/.test(f)&&!/\b(vege|ki)\b/.test(f)){enter(false).then(function(t){var g=startGame();if(window.DEX_UI)window.DEX_UI.reply(g)});return 'Megnyitom a VR módot, és indítom a szókeresőt…'}
   if(vr&&EXIT.test(f))return leave();
   if(vr&&WORKV.test(f)){if(navigator.onLine===false||location.protocol==='file:')return 'Offline módban vagy kapcsolat nélkül a WORK nem érhető el.';setWork(true);return 'Kitettem a WORK felületet a látómeződ jobb oldalára. Ha el akarod tüntetni, mondd: WORK el.'}
   if(vr&&/\bwork\w*\b.*\b(el|le|zar\w*|tuntesd|rejtsd)\b/.test(f)){setWork(false);return 'Elrejtettem a WORK felületet.'}
   if(!vr&&ENTER.test(f)&&!EXIT.test(f)){enter(false).then(function(t){if(window.DEX_UI)window.DEX_UI.reply(t)});return 'Megnyitom a kamerát a VR módhoz…'}}
  return h0.apply(self,args)};
 /* offline jelzés */
 var of=document.createElement('div');of.id='dyOff';of.textContent='OFFLINE · helyi mód';of.style.cssText='position:fixed;top:8px;left:10px;z-index:30;display:none;padding:4px 10px;border-radius:999px;border:1px solid #ffd27a88;background:#2a1a06cc;color:#ffe7b3;font:600 11px system-ui,sans-serif;letter-spacing:.05em';document.body.appendChild(of);
 function netChip(){var off=navigator.onLine===false;of.style.display=off?'block':'none';return off}
 window.addEventListener('offline',function(){netChip();try{if(window.DEX_UI)window.DEX_UI.reply('Offline módban vagyok. A helyi parancsok, a jegyzetek, a VR és a szókereső működnek; az okos mód és a WORK a számítógépre vár.')}catch(e){}});
 window.addEventListener('online',function(){netChip()});netChip();
 Dx.__vr=1;window.DEX_VR={game:function(){return G},startGame:startGame,enter:function(g){return enter(!!g).then(function(t){if(window.DEX_UI)window.DEX_UI.reply(t);return t})},leave:leave,active:function(){return !!(root&&root.classList.contains('on'))},work:setWork};
})();

