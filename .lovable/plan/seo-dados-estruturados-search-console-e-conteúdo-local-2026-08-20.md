# SEO: dados estruturados, Search Console e conteúdo local

## Problema crítico encontrado

Todo o SEO do site aponta para o domínio errado: `https://althaciamoveis.shop` (de outro projeto) aparece em canonical, og:url, JSON-LD, sitemap.xml e robots.txt, em 13 arquivos. Isso faz o Google atribuir as páginas da Klug a um domínio de terceiros — corrigir isso é o passo com maior impacto no ranqueamento e vem primeiro.

## O que será feito

### 1. Domínio correto em todo o SEO
- Trocar o `BASE_URL` das 11 rotas, do `__root.tsx` e do `sitemap.xml` para `https://klugmotors.com.br`.
- Atualizar a diretiva `Sitemap:` no `robots.txt`.

### 2. Dados estruturados (Organization + FAQ)
- Adicionar JSON-LD de **Organization** no `__root.tsx` (nome, logo, URL, telefone (47) 93429-3200, endereço de Joinville, redes sociais, CNPJ) com `@id` reutilizável.
- Vincular o `LocalBusiness` já existente na home e no /contato à Organization (`parentOrganization`), evitando duplicidade.
- Manter e ampliar o **FAQPage** do /faq; adicionar um bloco de perguntas frequentes locais na home (financiamento, CNH, garantia, oficina, entrega em Joinville/SC) com FAQPage próprio.
- Adicionar **BreadcrumbList** nas páginas de modelos e categorias.

### 3. Título, descrição, H1 e conteúdo local
- Home: reescrever title e meta description com foco local ("scooter elétrica Joinville", "moto elétrica SC") e adicionar um **H1 real** (hoje a home só tem H2), mantendo o layout do hero — H1 semântico com o mesmo peso visual atual.
- Revisar title/description das rotas /modelos, /financiamento, /garantia, /sobre, /contato, /faq, cada uma única e abaixo de 60/160 caracteres.
- Reforçar conteúdo local na home e no /contato: bairro/cidade, região atendida (Joinville, Araquari, São Francisco do Sul, Jaraguá do Sul), horário, formas de pagamento e oficina especializada — texto real, sem invenções de números.

### 4. Google Search Console
- Conectar a conexão existente do workspace ("PACK's Google Search Console") ao projeto.
- Verificar a propriedade `https://klugmotors.com.br/` pelo método META (meta tag no `<head>` da raiz), adicionar o site à lista de propriedades e submeter `https://klugmotors.com.br/sitemap.xml`.
- Observação: se a meta tag ainda não estiver publicada no domínio, será necessário publicar uma vez antes da verificação.

### 5. Marcar as pendências de SEO
- Após as correções, marcar como corrigidos os achados de SEO relacionados (heading genérico, Search Console) — os achados atuais são de um scan antigo e citam outro projeto.

## Sobre "chegar ao top 1"

Os itens acima resolvem a base técnica (domínio, indexação, dados estruturados, relevância local). Ranqueamento em 1º lugar depende também de conteúdo contínuo e autoridade; posso propor em seguida uma trilha de páginas/artigos locais (ex.: "scooter elétrica sem CNH: o que a lei permite", "melhor scooter elétrica para Joinville") com validação de volume de busca. Não incluí a criação desses artigos neste plano.

## Detalhes técnicos

- `head()` por rota (padrão TanStack já usado): title/description/og em `meta`, canonical apenas nas folhas, JSON-LD via `scripts`.
- Organization e WebSite ficam no `__root.tsx`; FAQPage/BreadcrumbList/LocalBusiness nas folhas.
- Sitemap continua sendo o server route `src/routes/sitemap[.]xml.ts`, sem `lastmod` inventado.
- Nenhuma mudança de layout visual além do H1 semântico na home.
