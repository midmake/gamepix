# GamePix — notas verificadas para MIDAS Jogos

Pesquisa realizada em 18/08/2026 usando somente páginas oficiais da GamePix.

## Publisher

A página oficial para Publishers informa três caminhos principais de integração:

1. direct embedding;
2. JSON API;
3. white-label portal.

A mesma página informa que o Publisher Affiliate Program oferece catálogo HTML5, suporte multiplataforma, atualização contínua de conteúdo, dashboard e modelo de revenue share. A MIDAS Jogos não afirma participação nesse programa antes de aprovação.

Fonte oficial: https://partners.gamepix.com/publishers

## Solicitação de entrada na rede

O formulário institucional da GamePix orienta Publishers interessados em entrar na rede a enviar o link do próprio website.

Fonte oficial: https://company.gamepix.com/contact-us/

## API pública de integração

A documentação pública de integração mostra endpoints para listar jogos e obter um jogo individual. O objeto de jogo inclui, entre outros campos: id, title, description, category/categories, thumbnail URLs, game URL, width, height, orientation, responsive, touch, featured, creation, lastUpdate e versões mínimas de plataformas.

A documentação também afirma que distribuição e uso de jogos dependem de consentimento da GamePix e que serviços pagos ao usuário final exigem aprovação escrita.

Fonte oficial: https://games.gamepix.com/gameinfo/

## Decisões adotadas no projeto

- Não publicar jogos reais antes de autorização.
- Manter o catálogo público demonstrativo com nomes e artes fictícias.
- Preparar o template de jogo para iframe/embed e metadados de responsividade/orientação.
- Priorizar mobile porque a proposta de acesso físico via NFC termina no navegador do smartphone.
- Não usar logo GamePix nem afirmar parceria.
- Não criar prova social falsa, métricas inventadas ou anúncios simulados.
- Manter o mockup de parceria fora do diretório publicado pelo GitHub Pages.
