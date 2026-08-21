const GAMEPIX_FEED_URL='https://feeds.gamepix.com/v2/json?sid=410E0&pagination=12&page=1';

const fallbackGames = [
  {title:'Velocity Rift', category:'Corrida', desc:'Circuitos rápidos e precisão em alta velocidade.', cover:'https://images.pexels.com/photos/9545739/pexels-photo-9545739.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center 52%'},
  {title:'Lumen Run', category:'Plataforma', desc:'Salte entre obstáculos e domine percursos urbanos.', cover:'https://images.pexels.com/photos/16945055/pexels-photo-16945055.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center 48%'},
  {title:'Prism Vault', category:'Puzzle', desc:'Combine padrões, cores e lógica em desafios curtos.', cover:'https://images.pexels.com/photos/5142463/pexels-photo-5142463.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center'},
  {title:'Zero Signal', category:'Ação', desc:'Ação compacta, reflexos rápidos e ritmo intenso.', cover:'https://images.pexels.com/photos/3912366/pexels-photo-3912366.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center'},
  {title:'Orbit Breaker', category:'Arcade', desc:'Pontuação, luzes e partidas feitas para começar rápido.', cover:'https://images.pexels.com/photos/25798276/pexels-photo-25798276.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center 42%'},
  {title:'Crown Kick', category:'Esportes', desc:'Disputas rápidas com foco em habilidade e timing.', cover:'https://images.pexels.com/photos/18029808/pexels-photo-18029808.jpeg?auto=compress&cs=tinysrgb&w=1200', pos:'center'}
];

let games=[...fallbackGames];
let feedLoaded=false;

function siteRoot(){
  const icon=document.querySelector('link[rel="icon"]');
  if(!icon) return new URL('./',window.location.href);
  const favicon=new URL(icon.getAttribute('href'),window.location.href);
  return new URL('./',favicon);
}

function escapeHTML(value=''){
  return String(value).replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
}

function shortText(value='',limit=105){
  const text=String(value).replace(/\s+/g,' ').trim();
  return text.length>limit?`${text.slice(0,limit-1).trim()}…`:text;
}

function categoryLabel(value=''){
  const raw=String(value).trim();
  const key=raw.toLowerCase().replace(/[_-]+/g,' ');
  const aliases={
    'racing':'Corrida','race':'Corrida','driving':'Corrida',
    'platform':'Plataforma','platformer':'Plataforma',
    'action':'Ação','adventure':'Aventura','arcade':'Arcade',
    'puzzle':'Puzzle','sports':'Esportes','sport':'Esportes',
    'strategy':'Estratégia','simulation':'Simulação','simulator':'Simulação',
    'casual':'Casual','kids':'Infantil','educational':'Educativo',
    'cards':'Cartas','card':'Cartas','board':'Tabuleiro',
    'shooting':'Tiro','shooter':'Tiro','fighting':'Luta',
    'match 3':'Match 3','match3':'Match 3'
  };
  return aliases[key]||raw||'Outros';
}

function normaliseGame(item){
  return {
    id:String(item.id||item.namespace||''),
    namespace:String(item.namespace||''),
    title:String(item.title||'Jogo'),
    category:categoryLabel(item.category),
    rawCategory:String(item.category||''),
    desc:String(item.description||'Jogue instantaneamente no navegador.'),
    cover:String(item.banner_image||item.image||''),
    icon:String(item.image||item.banner_image||''),
    url:String(item.url||''),
    orientation:String(item.orientation||''),
    width:Number(item.width)||0,
    height:Number(item.height)||0,
    quality:Number(item.quality_score)||0,
    pos:'center'
  };
}

async function loadGamePixFeed(){
  try{
    const response=await fetch(GAMEPIX_FEED_URL,{cache:'no-store',mode:'cors'});
    if(!response.ok) throw new Error(`GamePix feed HTTP ${response.status}`);
    const data=await response.json();
    if(!Array.isArray(data.items)||!data.items.length) throw new Error('GamePix feed sem jogos');
    const mapped=data.items.map(normaliseGame).filter(game=>game.title&&game.cover&&game.url);
    if(!mapped.length) throw new Error('GamePix feed sem itens utilizáveis');
    games=mapped;
    feedLoaded=true;
    return true;
  }catch(error){
    console.warn('MID GAMES: não foi possível carregar o feed GamePix; usando catálogo visual de contingência.',error);
    return false;
  }
}

function coverStyle(game){
  const safeUrl=String(game.cover||'').replace(/'/g,'%27');
  return `background-image:linear-gradient(180deg,rgba(8,9,11,.02) 35%,rgba(8,9,11,.78) 100%),url('${safeUrl}');background-size:cover;background-position:${game.pos||'center'};`;
}

function gameHref(game){
  if(!game.url) return new URL('jogar/template/',siteRoot()).href;
  const target=new URL('jogar/template/',siteRoot());
  const params=new URLSearchParams({
    id:game.id||game.namespace||'',
    title:game.title||'Jogo',
    category:game.category||'',
    description:game.desc||'',
    image:game.cover||'',
    game_url:game.url||'',
    orientation:game.orientation||'',
    width:String(game.width||''),
    height:String(game.height||'')
  });
  target.search=params.toString();
  return target.href;
}

function gameCard(game){
  const gameUrl=gameHref(game);
  const title=escapeHTML(game.title);
  const category=escapeHTML(game.category);
  const desc=escapeHTML(shortText(game.desc));
  return `<article class="game-card" data-category="${category.toLowerCase()}" data-title="${title.toLowerCase()}">
    <a href="${escapeHTML(gameUrl)}" aria-label="Abrir ${title}">
      <div class="game-art" style="${coverStyle(game)}" role="img" aria-label="Capa de ${title}"></div>
      <div class="game-info"><h3>${title}</h3><p>${desc}</p><span class="tag">${category}</span></div>
    </a>
  </article>`;
}

function renderFeatured(){
  const el=document.querySelector('[data-featured-games]');
  if(el) el.innerHTML=games.slice(0,8).map(gameCard).join('');
}

function syncCategoryFilter(){
  const filter=document.querySelector('#game-filter');
  if(!filter) return;
  const current=filter.value;
  const categories=[...new Set(games.map(game=>game.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
  filter.innerHTML=`<option value="todos">Todas as categorias</option>${categories.map(category=>`<option value="${escapeHTML(category.toLowerCase())}">${escapeHTML(category)}</option>`).join('')}`;
  const initialCategory=new URLSearchParams(window.location.search).get('categoria');
  const desired=initialCategory||current;
  if(desired){
    const match=[...filter.options].find(option=>option.value.toLowerCase()===desired.toLowerCase());
    if(match) filter.value=match.value;
  }
}

function renderCatalog(){
  const el=document.querySelector('[data-catalog-games]');
  if(!el) return;
  const search=document.querySelector('#game-search');
  const filter=document.querySelector('#game-filter');
  const empty=document.querySelector('.catalog-empty');
  syncCategoryFilter();

  function update(){
    const q=(search?.value||'').trim().toLowerCase();
    const f=(filter?.value||'todos').toLowerCase();
    const filtered=games.filter(game=>{
      const haystack=`${game.title} ${game.category} ${game.rawCategory||''} ${game.desc}`.toLowerCase();
      const matchesText=!q||haystack.includes(q);
      const matchesFilter=f==='todos'||game.category.toLowerCase()===f;
      return matchesText&&matchesFilter;
    });
    el.innerHTML=filtered.map(gameCard).join('');
    if(empty) empty.style.display=filtered.length?'none':'block';
  }

  if(!el.dataset.bound){
    search?.addEventListener('input',update);
    filter?.addEventListener('change',update);
    el.dataset.bound='1';
  }
  update();
}

function paintStaticVisuals(){
  const setBg=(el,game)=>{
    if(!el||!game||!game.cover) return;
    el.style.backgroundImage=`linear-gradient(180deg,rgba(8,9,11,.03) 32%,rgba(8,9,11,.82) 100%),url('${game.cover.replace(/'/g,'%27')}')`;
    el.style.backgroundSize='cover';
    el.style.backgroundPosition=game.pos||'center';
  };

  document.querySelectorAll('.mini-card').forEach((el,i)=>setBg(el,games[i%Math.max(games.length,1)]));
  setBg(document.querySelector('.float-card.one .float-art'),games[0]);
  setBg(document.querySelector('.float-card.two .float-art'),games[2]||games[1]);

  const categoryMap={
    '.category-race':games.find(g=>g.category==='Corrida')||games[0],
    '.category-platform':games.find(g=>g.category==='Plataforma')||games[1]||games[0],
    '.category-arcade':games.find(g=>g.category==='Arcade')||games[2]||games[0],
    '.category-action':games.find(g=>g.category==='Ação')||games[3]||games[0],
    '.category-puzzle':games.find(g=>g.category==='Puzzle')||games[4]||games[0],
    '.category-sport':games.find(g=>g.category==='Esportes')||games[5]||games[0]
  };
  Object.entries(categoryMap).forEach(([selector,game])=>setBg(document.querySelector(selector),game));

  const packageArt=document.querySelector('.package-art');
  setBg(packageArt,games[1]||games[0]);
}

function isAllowedGamePixUrl(value){
  try{
    const url=new URL(value);
    return url.protocol==='https:'&&(url.hostname==='gamepix.com'||url.hostname.endsWith('.gamepix.com'));
  }catch{
    return false;
  }
}

function initGamePage(){
  const stage=document.querySelector('#game-stage');
  const titleEl=document.querySelector('#game-title');
  if(!stage||!titleEl) return;

  const params=new URLSearchParams(window.location.search);
  const title=params.get('title')||'Jogo MID GAMES';
  const description=params.get('description')||'Jogo disponibilizado através do catálogo GamePix.';
  const category=params.get('category')||'Jogo';
  const orientation=params.get('orientation')||'';
  const gameUrl=params.get('game_url')||'';

  titleEl.textContent=title;
  document.querySelector('#game-description')?.replaceChildren(document.createTextNode(description));
  document.querySelector('#game-category')?.replaceChildren(document.createTextNode(category));
  document.querySelector('#game-device')?.replaceChildren(document.createTextNode(orientation?`${orientation} · Web / Mobile`:'Web / Mobile'));
  document.querySelector('#game-status')?.replaceChildren(document.createTextNode(gameUrl?'Disponível':'Indisponível'));
  document.title=`${title} — MID GAMES`;

  if(gameUrl&&isAllowedGamePixUrl(gameUrl)){
    stage.innerHTML='';
    const iframe=document.createElement('iframe');
    iframe.src=gameUrl;
    iframe.title=title;
    iframe.allow='autoplay; fullscreen; gamepad; clipboard-read; clipboard-write';
    iframe.allowFullscreen=true;
    iframe.loading='eager';
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    iframe.style.cssText='display:block;width:100%;height:100%;min-height:570px;border:0;background:#050608;';
    stage.appendChild(iframe);
  }else{
    const message=stage.querySelector('.embed-ready p');
    if(message) message.textContent='Não foi possível carregar o jogo. Volte ao catálogo e tente novamente.';
  }

  document.querySelector('#fullscreen-btn')?.addEventListener('click',()=>{
    stage.requestFullscreen?.();
  });
}

function refineLaunchCopy(){
  document.querySelectorAll('.hero-meta span').forEach(el=>{
    if(el.textContent.includes('Catálogo em preparação')) el.innerHTML='<i></i>Catálogo GamePix';
  });
  const featuredEyebrow=[...document.querySelectorAll('.eyebrow')].find(el=>el.textContent.trim()==='Catálogo em preparação');
  if(featuredEyebrow) featuredEyebrow.textContent='Jogos em destaque';
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

function setYear(){
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
}

async function boot(){
  initNav();
  setYear();
  initGamePage();

  renderFeatured();
  renderCatalog();
  paintStaticVisuals();
  refineLaunchCopy();

  const loaded=await loadGamePixFeed();
  if(loaded){
    renderFeatured();
    renderCatalog();
    paintStaticVisuals();
    document.documentElement.dataset.gamepix='ready';
  }
}

document.addEventListener('DOMContentLoaded',boot);
