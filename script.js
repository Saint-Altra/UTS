const students = [
  { name:"Amara Osei", roman:"Act I", num:"1", color:"#c87820", essays:[
    { title:"The Weight of Inherited Silence", excerpt:"My grandmother never spoke about the crossing. For years I mistook her quiet for forgiveness — silence can itself be a kind of archive, dense, pressurized, full of things that refuse to become language." },
    { title:"On Learning to Read in Two Directions", excerpt:"Arabic moves right to left, English left to right. Growing up bilingual meant my eyes were always negotiating, always deciding which direction truth traveled in." }
  ]},
  { name:"Theo Nascimento", roman:"Act II", num:"2", color:"#4a7ab8", essays:[
    { title:"The Algorithm of Grief", excerpt:"When my father died, I searched for a formula. Grief, I was convinced, must follow a pattern if you look closely enough — like a river that always knows how to reach the sea." }
  ]},
  { name:"Sofia Marchetti", roman:"Act III", num:"3", color:"#8a5a9a", essays:[
    { title:"Borders as Architecture", excerpt:"A wall is not just a wall. It is a theory of who belongs, drawn in concrete and wire, a geometry of exclusion that pretends to be neutral." },
    { title:"What Pasta Taught Me About Time", excerpt:"My nonna makes ragù for six hours every Sunday. No timers. No recipe. She says the sauce tells you when it's ready. I spent two years trying to understand what that meant." }
  ]},
  { name:"Darius Kwon", roman:"Act IV", num:"4", color:"#3a8a5a", essays:[
    { title:"A Short History of My Father's Hands", excerpt:"He has a scar above his left thumb from a factory accident in 1998. He never talks about it, but sometimes I catch him looking at it like it's a sentence he forgot how to finish." }
  ]},
  { name:"Lena Björk", roman:"Act V", num:"5", color:"#c85a30", essays:[
    { title:"Notes on Darkness (December, 66°N)", excerpt:"By November the sun rises at ten and sets at two. Locals call it mörketid — the dark time. But darkness here is not absence. It has texture. It breathes." },
    { title:"Why I Don't Trust Maps", excerpt:"Every map is an argument. The choice of projection, of what to name and what to leave unnamed — none of this is neutral." }
  ]},
  { name:"Priya Menon", roman:"Act VI", num:"6", color:"#b87030", essays:[
    { title:"The Tyranny of the Arranged Room", excerpt:"My mother rearranged furniture when she was anxious. I grew up learning to read rooms — a shifted couch meant Tuesday's phone call had gone badly. Space is emotional." }
  ]},
  { name:"Elliot Svensson", roman:"Act VII", num:"7", color:"#2a8a7a", essays:[
    { title:"Coding and the Poetics of Failure", excerpt:"A bug is a kind of poem. It says: here is what you assumed without knowing you assumed it. Every error message is a small reckoning with the gap between intention and execution." },
    { title:"On Being Tall in a Country of Tall People", excerpt:"In Sweden I was average. In Spain I was a spectacle. Identity is partly just a matter of which country you're standing in." }
  ]},
  { name:"Yuki Tanaka", roman:"Act VIII", num:"8", color:"#c84870", essays:[
    { title:"On Forgetting Japanese", excerpt:"I used to dream in Japanese. Now I dream in English and sometimes, half-waking, I reach for a word I once knew and find only the shape of the absence where it used to be." }
  ]}
];

/* ── Build acts list ── */
(function buildActs() {
  const container = document.getElementById('acts-container');
  students.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'act' + (i % 2 === 1 ? ' even' : '');
    div.innerHTML = `
      <div class="act-left">
        <div class="act-ghost">${s.num}</div>
        <div class="act-roman">${s.roman}</div>
        <div class="act-name">${s.name}</div>
        <div class="act-bar" style="background:${s.color}"></div>
      </div>
      <div class="act-right">
        ${s.essays.map(e => `
          <div class="essay">
            <div class="essay-title">${e.title}</div>
            <div class="essay-excerpt">${e.excerpt}</div>
            <span class="essay-read">Read essay &rarr;</span>
          </div>`).join('')}
      </div>`;
    container.appendChild(div);
  });
})();

/* ── Staggered entrance animations ──
   Both curtain halves contain the same elements;
   we select all instances of each class so both halves animate in sync.
*/
function showAll(cls, delay) {
  setTimeout(() => {
    document.querySelectorAll(cls).forEach(el => el.classList.add('show'));
  }, delay);
}

showAll('.sub-row',    800);
showAll('.main-title', 1500);
showAll('.orn-div',    2500);
showAll('.start-wrap', 3200);

/* Corner ornaments staggered */
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
  const acts = document.getElementById('acts-page');

  /* Disable click immediately */
  document.querySelectorAll('.start-btn').forEach(b => b.disabled = true);

  /* 1. Slide the curtain halves apart */
  cL.classList.add('open');
  cR.classList.add('open');

  /* 2. ~60% through the slide, fade to black */
  setTimeout(() => {
    fade.classList.add('fade-in');
  }, 1100);

  /* 3. While black: hide curtains, show acts page */
  setTimeout(() => {
    cL.style.display = 'none';
    cR.style.display = 'none';
    acts.style.display = 'block';
    acts.getBoundingClientRect(); /* force reflow */
    acts.classList.add('visible');
  }, 1800);

  /* 4. Fade back in from black — acts page is now revealed */
  setTimeout(() => {
    fade.classList.remove('fade-in');
  }, 1900);
}

document.getElementById('start-btn').addEventListener('click', openCurtain);
