/* Local voice-to-WORK command router. */
(function(){'use strict';var NAME='wdea-dex-work-v1',bc=null,pending={},seq=0;
 try{bc=new BroadcastChannel(NAME);bc.onmessage=function(e){var d=e.data||{};if(d.type==='result'&&pending[d.requestId]){var p=pending[d.requestId];delete pending[d.requestId];clearTimeout(p.timer);p.resolve(d.text)}}}catch(e){}
 function folded(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
 function send(text){var id='cmd-'+Date.now()+'-'+(++seq);return new Promise(function(resolve){var iframe=document.querySelector('#dyVR .wk iframe');if(iframe&&iframe.contentWindow){pending[id]={resolve:resolve,timer:setTimeout(function(){delete pending[id];resolve('A WORK nem válaszolt. Nyisd meg egyszer külön fülön is, hogy betöltődjön.')},5000)};iframe.contentWindow.postMessage({channel:NAME,type:'command',requestId:id,text:text},location.origin);return}
  if(bc){pending[id]={resolve:resolve,timer:setTimeout(function(){delete pending[id];resolve('Nem találok megnyitott WORK-fület. Nyisd meg Chrome-ban a WORK oldalt, majd próbáld újra.')},5000)};bc.postMessage({type:'command',requestId:id,text:text});return}resolve('Ezen a böngészőn a helyi WORK-kapcsolat nem érhető el.')})}
 var Dx=window.DEX40;if(!Dx||typeof Dx.handle!=='function'||Dx.__workbridge)return;var old=Dx.handle;
 Dx.handle=function(raw){var s=String(raw||'').trim(),f=folded(s),vr=!!(window.DEX_VR&&window.DEX_VR.active());
  var isShow=/(mutasd|tedd|rakd|hozd|nyisd|jelenjen|tegye).{0,35}\b(work|vork|word)\b|\b(work|vork|word)\b.{0,35}\b(el[eé]|vr|mutasd|nyisd)\b/.test(f);
  var isHide=/\b(work|vork|word)\b.{0,20}\b(el|le|zar|rejtsd|tuntesd)\b/.test(f);
  var isWorkCmd=/^(keresd meg|keresd|kutass|talald meg|nyisd meg|nyisd ki|valaszd ki|ird at|nevezd at|csereld le|szinezd at|szinezd|valtoztasd meg|visszavonas|vond vissza a modositasokat|helyi modositasok torlese)\b/.test(f);
  if(isShow&&window.DEX_VR){if(navigator.onLine===false||location.protocol==='file:'){window.DEX_VR.work(true);return 'Kitettem a WORK-öt a VR-nézetbe. Az offline példány csak a már letöltött fájlokkal indul.'}window.DEX_VR.work(true);return 'Kitettem a WORK-öt a VR-nézetbe.'}
  if(isHide&&window.DEX_VR){window.DEX_VR.work(false);return 'Elrejtettem a WORK-öt.'}
  if(isWorkCmd){if(vr){var w=document.querySelector('#dyVR .wk');if(w&&w.hidden)window.DEX_VR.work(true)}send(s).then(function(t){if(window.DEX_UI)window.DEX_UI.reply(t)});return 'Megpróbálom végrehajtani a WORK-ben.'}
  return old.apply(this,arguments)};Dx.__workbridge=1;
})();
