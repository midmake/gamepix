const games = [
  {title:'Velocity Rift', category:'Corrida', art:'art-race', desc:'Circuitos rápidos e precisão em alta velocidade.'},
  {title:'Lumen Run', category:'Plataforma', art:'art-platform', desc:'Salte entre ruínas luminosas e caminhos suspensos.'},
  {title:'Prism Vault', category:'Puzzle', art:'art-puzzle', desc:'Combine padrões, luz e lógica em desafios curtos.'},
  {title:'Zero Signal', category:'Ação', art:'art-action', desc:'Ação compacta em arenas digitais de ritmo intenso.'},
  {title:'Orbit Breaker', category:'Arcade', art:'art-arcade', desc:'Pontuação, reflexos rápidos e partidas instantâneas.'},
  {title:'Crown Kick', category:'Esportes', art:'art-sport', desc:'Partidas rápidas com foco em habilidade e timing.'},
  {title:'Nightline GP', category:'Corrida', art:'art-race', desc:'Corridas noturnas em pistas urbanas estilizadas.'},
  {title:'Skybound Relay', category:'Plataforma', art:'art-platform', desc:'Um percurso vertical feito para sessões rápidas.'},
  {title:'Facet Shift', category:'Puzzle', art:'art-puzzle', desc:'Reposicione formas e abra novas rotas.'},
  {title:'Ash Protocol', category:'Ação', art:'art-action', desc:'Desafios de reação em cenários de ficção original.'},
  {title:'Pulse Grid', category:'Arcade', art:'art-arcade', desc:'Mantenha o ritmo e sobreviva ao campo de energia.'},
  {title:'Street Arc', category:'Esportes', art:'art-sport', desc:'Disputas curtas inspiradas em esportes urbanos.'}
];

function siteRoot(){
  const icon=document.querySelector('link[rel="icon"]');
  if(!icon) return new URL('./',window.location.href);
  const favicon=new URL(icon.getAttribute('href'),window.location.href);
  return new URL('./',favicon);
}

function gameCard(game){
  const gameUrl=new URL('jogar/template/',siteRoot()).href;
  return `<article class="game-card" data-category="${game.category.toLowerCase()}" data-title="${game.title.toLowerCase()}">
    <a href="${gameUrl}" aria-label="Abrir ${game.title}">
      <div class="game-art ${game.art}" role="img" aria-label="Arte original fictícia de ${game.title}"></div>
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

document.addEventListener('DOMContentLoaded',()=>{initNav();renderFeatured();renderCatalog();setYear()});
