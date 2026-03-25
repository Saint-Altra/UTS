/* ── Staggered entrance animations ── */
function showAll(cls, delay) {
  setTimeout(() => {
    document.querySelectorAll(cls).forEach(el => el.classList.add('show'));
  }, delay);
}

showAll('.sub-row',    800);
showAll('.main-title', 1500);
showAll('.orn-div',    2500);
showAll('.start-wrap', 3200);

setTimeout(() => {
  ['.co-tl','.co-tr','.co-bl','.co-br'].forEach((cls, i) => {
    setTimeout(() => {
      document.querySelectorAll(cls).forEach(el => el.classList.add('show'));
    }, i * 180);
  });
}, 2900);

/* ── Curtain open sequence ── */
function openCurtain() {
  const cL   = document.getElementById('curtain-l');
  const cR   = document.getElementById('curtain-r');
  const fade = document.getElementById('fade-overlay');
  const journal = document.getElementById('journal-page');

  document.querySelectorAll('.start-btn').forEach(b => b.disabled = true);

  /* 1. Slide curtain halves apart */
  cL.classList.add('open');
  cR.classList.add('open');

  /* 2. Fade to black at ~60% through slide */
  setTimeout(() => fade.classList.add('fade-in'), 1100);

  /* 3. While black: hide curtains, reveal journal */
  setTimeout(() => {
    cL.style.display = 'none';
    cR.style.display = 'none';
    journal.style.display = 'block';
    journal.getBoundingClientRect();
    journal.classList.add('visible');
    /* Draw the wood-grain table now that canvas is in DOM */
    drawTable();
  }, 1800);

  /* 4. Fade back in revealing the journal */
  setTimeout(() => fade.classList.remove('fade-in'), 1900);
}

document.getElementById('start-btn').addEventListener('click', openCurtain);

/* ── Wood-grain table canvas ── */
function drawTable() {
  const container = document.querySelector('.scene-container');
  const canvas    = document.getElementById('tableCanvas');
  if (!container || !canvas) return;
  const W = container.offsetWidth;
  const H = container.offsetHeight;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  function sr(n) { return Math.abs((Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1); }

  const plankH = [112,96,122,104,90,128,100,114,88,110,118,96,108,124,86,102,116,94];
  const baseColors = [
    [108,52,14],[92,42,10],[118,58,16],[98,46,11],
    [86,38,9],[122,62,18],[94,44,10],[112,54,15],
    [88,40,9],[104,50,13],[116,56,16],[90,42,10],
    [100,48,12],[120,60,17],[84,36,8],[96,46,11],
    [114,55,15],[93,43,10]
  ];

  const vertJoints = [];
  for (let v = 0; v < 22; v++) {
    vertJoints.push({ x: 80 + sr(v*7.3)*(W-160), plankRow: Math.floor(sr(v*3.1)*plankH.length) });
  }

  let py = 0;
  for (let i = 0; i < plankH.length; i++) {
    const ph = plankH[i];
    if (py > H) break;
    const [br,bg,bb] = baseColors[i % baseColors.length];
    ctx.fillStyle = `rgb(${br},${bg},${bb})`;
    ctx.fillRect(0, py, W, ph);
    const nLines = 60 + Math.floor(sr(i*2.1)*40);
    for (let li = 0; li < nLines; li++) {
      const s = i*500+li;
      const lx = sr(s*1.3)*W*1.2-W*0.1;
      const ly = py+1+sr(s*2.7)*(ph-2);
      const len = 40+sr(s*3.9)*(W*0.7);
      const angle = (sr(s*4.1)-0.5)*0.05;
      const a = 0.04+sr(s*5.3)*0.14;
      ctx.strokeStyle = `rgba(0,0,0,${a})`;
      ctx.lineWidth = 0.3+sr(s*6.7)*0.7;
      ctx.beginPath(); ctx.moveTo(lx,ly);
      ctx.lineTo(lx+Math.cos(angle)*len, ly+Math.sin(angle)*len);
      ctx.stroke();
    }
    const nWear = 2+Math.floor(sr(i*8.1)*4);
    for (let w=0; w<nWear; w++) {
      const s=i*100+w*17;
      const wx=sr(s*1.7)*W, wy=py+sr(s*2.3)*ph, wr=20+sr(s*3.1)*80, wa=0.04+sr(s*4.7)*0.1;
      const wg=ctx.createRadialGradient(wx,wy,0,wx,wy,wr);
      wg.addColorStop(0,`rgba(0,0,0,${wa})`); wg.addColorStop(0.6,`rgba(0,0,0,${wa*0.4})`); wg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=wg; ctx.beginPath(); ctx.ellipse(wx,wy,wr*2,wr*0.5,0,0,Math.PI*2); ctx.fill();
    }
    ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,py+ph-1,W,2);
    ctx.fillStyle='rgba(200,140,60,0.1)'; ctx.fillRect(0,py,W,1);
    py += ph;
  }

  for (let v=0; v<vertJoints.length; v++) {
    const {x,plankRow} = vertJoints[v];
    let vy=0;
    for (let r=0; r<plankRow && r<plankH.length; r++) vy+=plankH[r];
    const vh = plankH[plankRow%plankH.length];
    ctx.strokeStyle='rgba(0,0,0,0.6)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x,vy); ctx.lineTo(x,vy+vh-1); ctx.stroke();
    ctx.strokeStyle='rgba(0,0,0,0.18)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(x+2,vy); ctx.lineTo(x+2,vy+vh-1); ctx.stroke();
    ctx.strokeStyle='rgba(255,180,80,0.12)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x-1,vy); ctx.lineTo(x-1,vy+vh-1); ctx.stroke();
  }

  for (let s=0; s<38; s++) {
    const sx=sr(s*3.7)*W, sy=sr(s*6.1)*H, slen=30+sr(s*2.3)*260;
    const sang=(sr(s*4.9)-0.5)*0.18, sa=0.12+sr(s*8.1)*0.28, sw2=0.3+sr(s*11.3)*1.2;
    ctx.strokeStyle=`rgba(0,0,0,${sa})`; ctx.lineWidth=sw2;
    const mx=sx+Math.cos(sang)*slen*0.5+(sr(s*7.1)-0.5)*6;
    const my=sy+Math.sin(sang)*slen*0.5+(sr(s*9.3)-0.5)*4;
    ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(mx,my,sx+Math.cos(sang)*slen,sy+Math.sin(sang)*slen); ctx.stroke();
    if (sr(s*5.5)>0.4) {
      ctx.strokeStyle='rgba(220,160,60,0.08)'; ctx.lineWidth=sw2*0.5;
      ctx.beginPath(); ctx.moveTo(sx-0.5,sy-0.5); ctx.quadraticCurveTo(mx-0.5,my-0.5,sx+Math.cos(sang)*slen-0.5,sy+Math.sin(sang)*slen-0.5); ctx.stroke();
    }
  }

  for (let d=0; d<18; d++) {
    const dx=sr(d*11.1)*W, dy=sr(d*7.7)*H, dr=4+sr(d*3.3)*14, da=0.18+sr(d*6.1)*0.22;
    const dg=ctx.createRadialGradient(dx,dy,0,dx,dy,dr);
    dg.addColorStop(0,`rgba(0,0,0,${da})`); dg.addColorStop(0.5,`rgba(0,0,0,${da*0.5})`); dg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=dg; ctx.beginPath(); ctx.ellipse(dx,dy,dr*1.8,dr*0.7,(sr(d*2.1)-0.5)*0.3,0,Math.PI*2); ctx.fill();
  }

  for (let w=0; w<6; w++) {
    const wx=sr(w*17.3)*W, wy=sr(w*13.1)*H, wr2=18+sr(w*5.7)*45, wa=0.06+sr(w*8.3)*0.1;
    ctx.strokeStyle=`rgba(0,0,0,${wa})`; ctx.lineWidth=0.8+sr(w*3.1)*1.5;
    ctx.beginPath(); ctx.ellipse(wx,wy,wr2,wr2*0.85,sr(w*2.3)*Math.PI,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle=`rgba(0,0,0,${wa*0.5})`; ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.ellipse(wx,wy,wr2*0.7,wr2*0.6,sr(w*2.3)*Math.PI,0,Math.PI*2); ctx.stroke();
  }

  for (let c=0; c<25; c++) {
    const cx=sr(c*9.9)*W;
    let cpy2=0;
    const crow=Math.floor(sr(c*4.3)*plankH.length);
    for (let r=0; r<=crow; r++) cpy2+=plankH[r%plankH.length];
    const cw2=2+sr(c*6.7)*8, ch2=1+sr(c*3.3)*3;
    ctx.fillStyle=`rgba(0,0,0,${0.25+sr(c*8.1)*0.25})`;
    ctx.beginPath(); ctx.ellipse(cx,cpy2-1,cw2,ch2,0,0,Math.PI*2); ctx.fill();
  }

  for (let p=0; p<8; p++) {
    const px2=sr(p*13.7)*W, py2=sr(p*7.3)*H, pr=80+sr(p*5.1)*200, pa=0.04+sr(p*9.3)*0.09;
    const pg=ctx.createRadialGradient(px2,py2,0,px2,py2,pr);
    pg.addColorStop(0,`rgba(0,0,0,${pa})`); pg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=pg; ctx.fillRect(0,0,W,H);
  }
}

window.addEventListener('resize', () => {
  if (document.getElementById('journal-page').classList.contains('visible')) drawTable();
});
