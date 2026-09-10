# Otimização de carregamento do site (desktop e mobile)

## Diagnóstico medido agora

- **Imagens dos modelos**: PNG de 1,8 MB a 5,4 MB cada (medido: Factor 150 ED = 5,4 MB, R15 = 2,5 MB, SUDU A13T = 1,8 MB). O catálogo tem ~60 modelos, então abrir `/modelos` baixa dezenas de MB.
- **Vídeos** (mantidos como estão, conforme sua escolha): `klug-hero-telao.mp4` = 56,6 MB e `conheca-klug-motors.mp4` = 36,2 MB. Hoje o vídeo grande aparece **duas vezes** na home ao mesmo tempo, sendo uma delas com `preload="auto"` (baixa o arquivo inteiro antes de o usuário rolar até ele).
- **Meta Pixel** roda em script no topo do HTML, antes do conteúdo.
- **Fontes**: 3 famílias do Google Fonts (Urbanist com 5 pesos, Epilogue com 4, Bebas) em CSS bloqueante.
- **Cache**: catálogo e páginas de produto usam `staleTime: 0`, então cada navegação refaz a consulta ao banco mesmo já tendo os dados.
- Detalhes menores: `console.log` em cada imagem carregada, barra de progresso de scroll que atualiza estado do React a cada pixel de rolagem.

## O que vou fazer

### 1. Imagens do catálogo (maior ganho)

- Converter as ~60 imagens já cadastradas para **WebP otimizado** (largura máxima 1600 px, qualidade alta), mantendo a transparência e o enquadramento atual. Esperado: de 2–5 MB para ~120–250 KB por imagem.
- As páginas passam a apontar para as novas versões; as originais continuam no armazenamento (nada é apagado).
- No painel admin, todo upload novo (capa e galeria) passa a gerar WebP otimizado automaticamente, mantendo a remoção de fundo e o enquadramento 4:3 que já existem.
- Cards e páginas ganham `sizes`/`srcset` corretos, para o celular baixar uma versão menor que o desktop.

### 2. Vídeos — sem recompressão, só carregar na hora certa

- Manter os arquivos e a qualidade atuais.
- Remover a duplicação: o mesmo vídeo de 56 MB deixa de ser baixado duas vezes na home.
- Trocar `preload="auto"` por carregamento sob demanda: o vídeo só começa a baixar quando entra na tela; antes disso aparece o poster (imagem) que já existe.
- Em conexões lentas / economia de dados (quando o navegador informa), exibir o poster com botão de play em vez de baixar o vídeo automaticamente.

### 3. Rastreamento e terceiros

- Meta Pixel passa a carregar depois que a página aparece (eventos e PageView continuam sendo registrados).
- Embed/feed do Instagram e o mapa do Google só carregam quando entram na tela.

### 4. Fontes

- Reduzir os pesos carregados apenas aos realmente usados e manter `display=swap`, com preconnect. Texto aparece imediatamente, sem espera pela fonte.

### 5. Navegação e cache

- `staleTime` de 60s no catálogo e nas páginas de produto (o tempo real já invalida o cache quando o admin salva algo, então nada fica desatualizado).
- Pré-carregamento das rotas ao passar o mouse / tocar em um card, para a página de produto abrir instantaneamente.
- Catálogo renderiza as primeiras ~12 fichas imediatamente e as demais conforme a rolagem.

### 6. Ajustes finos

- Remover o `console.log` de cada imagem.
- Barra de progresso do scroll passa a usar animação nativa (sem re-render a cada pixel).
- Revisar as páginas mais pesadas (home e página de produto) para carregar blocos abaixo da dobra de forma tardia.

## Validação

- Medir antes/depois o peso total e o tempo de exibição da home, do catálogo e de uma página de produto em 1210 px (desktop) e 390 px (celular).
- Conferir visualmente que nada mudou de aparência: mesmas fotos, mesmo enquadramento, mesmos vídeos.

## Detalhes técnicos

- Conversão em lote via script no sandbox (Pillow) com re-upload no bucket `model-images` e atualização das colunas `colors`/`gallery` por migração; sem tocar nos registros de preço/parcelas.
- `uploadFile` no admin passa a exportar `image/webp` no canvas de `normalizeHeroImage`, com limite de largura.
- Vídeos: `preload="none"` + `IntersectionObserver` (reaproveitando `LazyVideo`), leitura de `navigator.connection.saveData/effectiveType` para o fallback com poster.
- Pixel: injeção via `requestIdleCallback` após hidratação, em vez de script no `head`.
- Cache: `staleTime` nas `queryOptions` de `useDbModels`, `defaultPreload: "intent"` no router.
