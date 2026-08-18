const games = [
  {title:'Velocity Rift', category:'Corrida', desc:'Circuitos rápidos e precisão em alta velocidade.', cover:'https://images.pexels.com/photos/9545739/pexels-photo-9545739.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center 52%'},
  {title:'Lumen Run', category:'Plataforma', desc:'Salte entre obstáculos e domine percursos urbanos.', cover:'https://images.pexels.com/photos/16945055/pexels-photo-16945055.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center 48%'},
  {title:'Prism Vault', category:'Puzzle', desc:'Combine padrões, cores e lógica em desafios curtos.', cover:'https://images.pexels.com/photos/5142463/pexels-photo-5142463.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center'},
  {title:'Zero Signal', category:'Ação', desc:'Ação compacta, reflexos rápidos e ritmo intenso.', cover:'https://images.pexels.com/photos/3912366/pexels-photo-3912366.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center'},
  {title:'Orbit Breaker', category:'Arcade', desc:'Pontuação, luzes e partidas feitas para começar rápido.', cover:'https://images.pexels.com/photos/25798276/pexels-photo-25798276.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center 42%'},
  {title:'Crown Kick', category:'Esportes', desc:'Disputas rápidas com foco em habilidade e timing.', cover:'https://images.pexels.com/photos/18029808/pexels-photo-18029808.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center'},
  {title:'Nightline GP', category:'Corrida', desc:'Corridas noturnas e velocidade em clima de evento.', cover:'https://images.pexels.com/photos/12951065/pexels-photo-12951065.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center'},
  {title:'Skybound Relay', category:'Plataforma', desc:'Um percurso vertical feito para sessões rápidas.', cover:'https://images.pexels.com/photos/733535/pexels-photo-733535.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center'},
  {title:'Facet Shift', category:'Puzzle', desc:'Reposicione formas e encontre novas combinações.', cover:'https://images.pexels.com/photos/5142458/pexels-photo-5142458.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center'},
  {title:'Ash Protocol', category:'Ação', desc:'Desafios de reação com energia de combate.', cover:'https://images.pexels.com/photos/8469884/pexels-photo-8469884.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center 35%'},
  {title:'Pulse Grid', category:'Arcade', desc:'Mantenha o ritmo em uma atmosfera de arcade contemporâneo.', cover:'https://images.pexels.com/photos/16660873/pexels-photo-16660873.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center'},
  {title:'Street Arc', category:'Esportes', desc:'Disputas curtas inspiradas em esportes urbanos.', cover:'https://images.pexels.com/photos/12201300/pexels-photo-12201300.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center'}
];

function siteRoot(){
  const icon=document.querySelector('link[rel="icon"]');
  if(!icon) return new URL('./',window.location.href);
  const favicon=new URL(icon.getAttribute('href'),window.location.href);
  return new URL('./',favicon);
}

function coverStyle(game){
  const safeUrl=game.cover.replace(/'/g,'%27');
  return `background-image:linear-gradient(180deg,rgba(8,9,11,.02) 35%,rgba(8,9,11,.78) 100%),url('${safeUrl}');background-size:cover;background-position:${game.pos||'center'};`;
}

function gameCard(game){
  const gameUrl=new URL('jogar/template/',siteRoot()).href;
  return `<article class="game-card" data-category="${game.category.toLowerCase()}" data-title="${game.title.toLowerCase()}">
    <a href="${gameUrl}" aria-label="Abrir ${game.title}">
      <div class="game-art" style="${coverStyle(game)}" role="img" aria-label="Imagem ilustrativa de ${game.title}"></div>
      <div class="game-info"><h3>${game.title}</h3><p>${game.desc}</p><span class="tag">${game.category}</span></div>
    </a>
  </article>`;
}

function renderFeatured(){
  const el=document.querySelector('[data-featured-games]');
  if(el) el.innerHTML=games.slice(0,8).map(gameCard).join('');
}

function renderCatalog(){
  const el=document.querySelector('[data-catalog-games]');
  if(!el) return;
  const search=document.querySelector('#game-search');
  const filter=document.querySelector('#game-filter');
  const empty=document.querySelector('.catalog-empty');
  const initialCategory=new URLSearchParams(window.location.search).get('categoria');
  if(filter && initialCategory){
    const match=[...filter.options].find(o=>o.value.toLowerCase()===initialCategory.toLowerCase());
    if(match) filter.value=match.value;
  }
  function update(){
    const q=(search?.value||'').trim().toLowerCase();
    const f=(filter?.value||'todos').toLowerCase();
    const filtered=games.filter(g=>{
      const matchesText=!q || `${g.title} ${g.category} ${g.desc}`.toLowerCase().includes(q);
      const matchesFilter=f==='todos' || g.category.toLowerCase()===f;
      return matchesText && matchesFilter;
    });
    el.innerHTML=filtered.map(gameCard).join('');
    if(empty) empty.style.display=filtered.length?'none':'block';
  }
  search?.addEventListener('input',update);
  filter?.addEventListener('change',update);
  update();
}

function paintStaticVisuals(){
  const setBg=(el,game)=>{
    if(!el||!game) return;
    el.style.backgroundImage=`linear-gradient(180deg,rgba(8,9,11,.03) 32%,rgba(8,9,11,.82) 100%),url('${game.cover}')`;
    el.style.backgroundSize='cover';
    el.style.backgroundPosition=game.pos||'center';
  };

  document.querySelectorAll('.mini-card').forEach((el,i)=>setBg(el,games[i%6]));
  setBg(document.querySelector('.float-card.one .float-art'),games[0]);
  setBg(document.querySelector('.float-card.two .float-art'),games[2]);

  const categoryMap={
    '.category-race':games[0],
    '.category-platform':games[1],
    '.category-arcade':games[4],
    '.category-action':games[3],
    '.category-puzzle':games[2],
    '.category-sport':games[5]
  };
  Object.entries(categoryMap).forEach(([selector,game])=>{
    const el=document.querySelector(selector);
    if(!el) return;
    el.style.backgroundImage=`linear-gradient(180deg,rgba(8,9,11,.18),rgba(8,9,11,.84)),url('${game.cover}')`;
    el.style.backgroundSize='cover';
    el.style.backgroundPosition=game.pos||'center';
  });

  const packageArt=document.querySelector('.package-art');
  if(packageArt){
    packageArt.style.backgroundImage=`linear-gradient(180deg,rgba(8,9,11,.08),rgba(8,9,11,.7)),url('${games[1].cover}')`;
    packageArt.style.backgroundSize='cover';
    packageArt.style.backgroundPosition='center';
  }
}

function refineLaunchCopy(){
  document.querySelectorAll('.hero-meta span').forEach(el=>{
    if(el.textContent.includes('Catálogo em preparação')) el.innerHTML='<i></i>Experiências para navegador';
  });
  const featuredEyebrow=[...document.querySelectorAll('.eyebrow')].find(el=>el.textContent.trim()==='Catálogo em preparação');
  if(featuredEyebrow) featuredEyebrow.textContent='Seleção MIDAS';
}

function initNav(){
  const header=document.querySelector('.site-header');
  const btn=document.querySelector('.menu-btn');
  const links=document.querySelector('.nav-links');
  window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',window.scrollY>8),{passive:true});
  btn?.addEventListener('click',()=>{
    const open=links?.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(Boolean(open)));
  });
  links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
}

function setYear(){document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear())}

document.addEventListener('DOMContentLoaded',()=>{initNav();renderFeatured();renderCatalog();paintStaticVisuals();refineLaunchCopy();setYear()});
