function openPDF(src,title){
  playEssay();
  var modal=document.getElementById('pdf-modal');
  document.getElementById('pdf-frame').src=src;
  document.getElementById('pdf-title').textContent=title||'Essay';
  modal.classList.add('open');
  requestAnimationFrame(function(){requestAnimationFrame(function(){modal.classList.add('visible');});});
}
function closePDF(){
  var modal=document.getElementById('pdf-modal');
  modal.classList.remove('visible');
  setTimeout(function(){modal.classList.remove('open');document.getElementById('pdf-frame').src='';},300);
}
document.getElementById('pdf-close').addEventListener('click',closePDF);
document.getElementById('pdf-modal').addEventListener('click',function(e){if(e.target===this)closePDF();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closePDF();});

function scaleJournal(){
  var sw=document.querySelector('.scale-wrapper');
  if(!sw)return;
  var scale=window.innerWidth/1900;
  sw.style.transform='scale('+scale+')';
  sw.style.transformOrigin='top center';
  document.querySelector('.journal-body').style.height=(sw.offsetHeight*scale)+'px';
}
window.addEventListener('resize',scaleJournal);

setTimeout(function(){document.querySelectorAll('.sub-row').forEach(function(el){el.classList.add('show');});},700);
setTimeout(function(){
  var el=document.getElementById('main-title-el');
  var text='THEATER';
  el.textContent='';
  el.classList.add('typing');
  var i=0;
  function tick(){
    if(i<text.length){el.textContent+=text[i++];setTimeout(tick,110);}
    else{
      el.classList.remove('typing');el.classList.add('done');
      setTimeout(function(){document.querySelectorAll('.orn-div').forEach(function(e){e.classList.add('show');});},300);
      setTimeout(function(){
        document.querySelectorAll('.start-wrap').forEach(function(e){e.classList.add('show');});
        ['.co-tl','.co-tr','.co-bl','.co-br'].forEach(function(cls,i2){
          setTimeout(function(){document.querySelectorAll(cls).forEach(function(e){e.classList.add('show');});},i2*180);
        });
      },700);
    }
  }
  tick();
},900);

/* ── Audio helpers ── */
var bgMusic=document.getElementById('audio-bg');
var tabSound=document.getElementById('audio-tab');
var essaySound=document.getElementById('audio-essay');

function playBg(){
  bgMusic.volume=0.35;
  bgMusic.currentTime=0;
  bgMusic.play().catch(function(){});
}
function playTab(){
  tabSound.volume=0.6;
  tabSound.currentTime=0;
  tabSound.play().catch(function(){});
}
function playEssay(){
  essaySound.volume=0.6;
  essaySound.currentTime=0;
  essaySound.play().catch(function(){});
}

function openCurtain(){
  var cL=document.getElementById('curtain-l'),cR=document.getElementById('curtain-r');
  var fade=document.getElementById('fade-overlay'),overlay=document.getElementById('landing-overlay');
  var journal=document.getElementById('journal-page');
  document.getElementById('start-btn').disabled=true;
  cL.classList.add('open');cR.classList.add('open');
  setTimeout(function(){fade.classList.add('fade-in');},1100);
  setTimeout(function(){
    cL.style.display='none';cR.style.display='none';overlay.style.display='none';
    journal.style.display='block';journal.getBoundingClientRect();
    journal.classList.add('visible');scaleJournal();drawTable();
    playBg();
    document.getElementById('edge-deco').classList.add('show');
    // Show theater prologue overlay on top of journal
    setTimeout(showTheaterPrologue, 600);
  },1800);
  setTimeout(function(){fade.classList.remove('fade-in');},1900);
}
document.getElementById('start-btn').addEventListener('click',openCurtain);

var currentTab=0,isAnimating=false;
document.querySelectorAll('.tab-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    var target=parseInt(btn.dataset.tab);
    if(target===currentTab||isAnimating)return;
    playTab();
    isAnimating=true;
    var cur=document.getElementById('tab-'+currentTab),nxt=document.getElementById('tab-'+target);
    document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    cur.classList.add('fading-out');cur.classList.remove('active');
    setTimeout(function(){
      cur.classList.remove('fading-out');cur.style.display='none';
      nxt.style.display='flex';nxt.classList.remove('active');nxt.getBoundingClientRect();nxt.classList.add('active');
      currentTab=target;isAnimating=false;
    },450);
  });
});

function drawTable(){
  var container=document.querySelector('.scene-container'),canvas=document.getElementById('tableCanvas');
  if(!container||!canvas)return;
  var W=container.offsetWidth,H=container.offsetHeight;
  canvas.width=W;canvas.height=H;
  var ctx=canvas.getContext('2d');
  function sr(n){return Math.abs((Math.sin(n*127.1+311.7)*43758.5453)%1);}
  var plankH=[112,96,122,104,90,128,100,114,88,110,118,96,108,124,86,102,116,94];
  var baseColors=[[108,52,14],[92,42,10],[118,58,16],[98,46,11],[86,38,9],[122,62,18],[94,44,10],[112,54,15],[88,40,9],[104,50,13],[116,56,16],[90,42,10],[100,48,12],[120,60,17],[84,36,8],[96,46,11],[114,55,15],[93,43,10]];
  var py=0;
  for(var i=0;i<plankH.length;i++){
    var ph=plankH[i];if(py>H)break;
    var bc=baseColors[i%baseColors.length];
    ctx.fillStyle='rgb('+bc[0]+','+bc[1]+','+bc[2]+')';ctx.fillRect(0,py,W,ph);
    for(var li=0;li<60+Math.floor(sr(i*2.1)*40);li++){
      var s=i*500+li,lx=sr(s*1.3)*W*1.2-W*0.1,ly=py+1+sr(s*2.7)*(ph-2);
      var len=40+sr(s*3.9)*(W*0.7),angle=(sr(s*4.1)-0.5)*0.05,a=0.04+sr(s*5.3)*0.14;
      ctx.strokeStyle='rgba(0,0,0,'+a+')';ctx.lineWidth=0.3+sr(s*6.7)*0.7;
      ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+Math.cos(angle)*len,ly+Math.sin(angle)*len);ctx.stroke();
    }
    ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(0,py+ph-1,W,2);
    ctx.fillStyle='rgba(200,140,60,0.1)';ctx.fillRect(0,py,W,1);
    py+=ph;
  }
  for(var s2=0;s2<38;s2++){
    var sx=sr(s2*3.7)*W,sy=sr(s2*6.1)*H,slen=30+sr(s2*2.3)*260;
    var sang=(sr(s2*4.9)-0.5)*0.18,sa=0.12+sr(s2*8.1)*0.28,sw2=0.3+sr(s2*11.3)*1.2;
    ctx.strokeStyle='rgba(0,0,0,'+sa+')';ctx.lineWidth=sw2;
    var mx=sx+Math.cos(sang)*slen*0.5+(sr(s2*7.1)-0.5)*6,my=sy+Math.sin(sang)*slen*0.5+(sr(s2*9.3)-0.5)*4;
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo(mx,my,sx+Math.cos(sang)*slen,sy+Math.sin(sang)*slen);ctx.stroke();
  }
  for(var p=0;p<8;p++){
    var px2=sr(p*13.7)*W,py2=sr(p*7.3)*H,pr=80+sr(p*5.1)*200,pa=0.04+sr(p*9.3)*0.09;
    var pg=ctx.createRadialGradient(px2,py2,0,px2,py2,pr);
    pg.addColorStop(0,'rgba(0,0,0,'+pa+')');pg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=pg;ctx.fillRect(0,0,W,H);
  }
}
window.addEventListener('resize',function(){
  if(document.getElementById('journal-page').classList.contains('visible')){scaleJournal();drawTable();}
});

/* -- Theater Prologue on Journal -- */
var theaterLines=[
  'These are the compiled reflections of eight voices, \u2014',
  'eight perspectives expressed through writing.',
  'What you hold before you are not mere essays,',
  'but personal thoughts and reflections on different topics.',
  'Each piece shares a moment of understanding and perspective.'
];

function showTheaterPrologue(){
  var overlay=document.getElementById('theater-prologue');
  var textEl=document.getElementById('tp-text');
  var cursor=document.getElementById('tp-cursor');
  var dismiss=document.getElementById('tp-dismiss');
  var spreadDeco=document.getElementById('spread-deco');
  spreadDeco.classList.add('show');
  overlay.classList.add('show');
  textEl.innerHTML='';
  cursor.style.display='inline';
  dismiss.classList.remove('show');
  var lines=theaterLines.slice();
  var lineIdx=0;
  var allText='';
  function typeLine(){
    if(lineIdx>=lines.length){
      cursor.style.display='none';
      setTimeout(function(){dismiss.classList.add('show');},400);
      return;
    }
    var line=lines[lineIdx++];
    var charIdx=0;
    if(allText.length>0){allText+='<br>';}
    function typeChar(){
      if(charIdx<line.length){
        var ch=line[charIdx++];
        allText+=ch;
        textEl.innerHTML=allText;
        var delay=(ch==='.' )?380:(ch===','?200:36);
        setTimeout(typeChar,delay);
      } else {
        setTimeout(typeLine,200);
      }
    }
    typeChar();
  }
  setTimeout(typeLine,300);
  var box=document.getElementById('tp-box');
  function dismissOverlay(){
    overlay.classList.remove('show');
    overlay.classList.add('hide');
    box.removeEventListener('click',dismissOverlay);
    overlay.removeEventListener('click',dismissOverlay);
  }
  setTimeout(function(){
    box.addEventListener('click',dismissOverlay);
    overlay.addEventListener('click',dismissOverlay);
  },1000);
}
