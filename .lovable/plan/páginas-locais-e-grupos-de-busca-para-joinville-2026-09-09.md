# Páginas locais e grupos de busca para Joinville

## Etapa 1 — Cinco páginas dedicadas (agora)

| Endereço | Título da aba | Título da página |
| --- | --- | --- |
| /scooters-eletricas-joinville | Scooter Elétrica em Joinville \| Concessionária Klug Motors | Scooters Elétricas em Joinville: Modelos SUDU e MotoChefe |
| /motos-eletricas-joinville | Motos Elétricas em Joinville \| Venda e Assistência Klug | Motos Elétricas em Joinville: Economia e Alta Performance |
| /motos-yamaha-joinville | Motos Yamaha em Joinville (0km e Seminovas) \| Klug Motors | Motos Yamaha e Seminovas Revisadas no Boa Vista - Joinville |
| /motinha-eletrica-sem-cnh | Motinha Elétrica sem CNH em Joinville \| Modelos e Preços | Motinhas Elétricas que Não Precisam de CNH em Joinville |
| /triciclos-eletricos-joinville | Triciclos Elétricos em Joinville (Carga e Conforto) \| Klug | Triciclos Elétricos Utilitários e para Melhor Idade em Joinville |

Cada página traz:
- Título principal exatamente como na tabela e abertura citando Joinville, o Boa Vista e a oficina própria.
- Grade com os modelos reais do catálogo daquele tipo (preço e prévia de parcela já existentes) e link para cada ficha.
- Bloco de motivos para comprar na Klug: loja física, oficina especializada, garantia, financiamento em até 71x, região atendida (Joinville, Araquari, São Francisco do Sul, Jaraguá do Sul).
- 3 a 5 perguntas frequentes do tema (na página sem CNH, a regra CONTRAN 996/23 que já consta nas fichas).
- Botões de WhatsApp e "Como chegar" e link para o catálogo filtrado.
- Nada de número, promessa ou depoimento inventado.

## Grupos de busca: cada palavra na página certa

Sem criar página por variação (isso gera conteúdo repetido). A distribuição fica assim, e nesta etapa já cobrimos os grupos 2, 3, 4 e parte do 6 com páginas que existem:

- **Dúvidas e comparativos** (legislação, quantos km faz, qual a melhor, tipos) → FAQ agora; artigos do blog na etapa 3.
- **Pagamento e compra** (financiada, parcelada no boleto, barata em Joinville) → /financiamento, reforçando o texto com esses termos e a prévia de parcelas.
- **Modelos, potência e estilo** (3000W, 1000W, 800W, X12, chopper, 2 lugares) → fichas de cada veículo: incluir a potência e o estilo no título e no texto de cada modelo, sem criar novas URLs.
- **Usados e Yamaha** (scooter usada, moto elétrica usada, Yamaha scooter usada) → /motos-yamaha-joinville (nova) e uma página /motos-seminovas-joinville, também nova nesta etapa.
- **Peças, oficina e manutenção** (bateria de lítio, pneu, oficina moto elétrica, conserto de triciclo) → nova página /oficina-especializada nesta etapa; loja de peças fica para depois, se vocês quiserem vender peças online.
- **Buscas locais e bairros** (Boa Vista, Centro, Aventureiro, Costa e Silva, Araquari, Jaraguá do Sul) → bairros e cidades citados dentro das páginas de Joinville nesta etapa; páginas por bairro só se as buscas justificarem, para não criar páginas quase iguais.

Total desta etapa: 7 páginas novas (5 da tabela + seminovas + oficina).

## Etapa 2 — Ligações internas e indexação

- Links para as páginas novas no rodapé (bloco "Joinville e região") e nos pontos naturais da home e do catálogo.
- Inclusão de todas no sitemap.
- Endereço único (canonical) e dados do Google (Organização, perguntas frequentes, trilha de navegação) em cada página.

## Etapa 3 — Blog (depois)

Os três artigos (CNH, custo de recarga por mês, o que checar numa seminova) e a seção de blog entram numa etapa seguinte, com os termos do grupo 1. Preciso saber se o blog será administrado pelo painel ou se os textos podem ficar fixos no site.

## Fora do site

Nome, categorias, produtos e avaliações no perfil do Google são feitos por vocês na ficha da empresa. Posso entregar um documento com o passo a passo pronto para copiar.

## Detalhes técnicos

- Uma rota por página em `src/routes/`, reaproveitando `PageLayout`/`SectionCard`, `usePublicModelsLight` e `ProductCard`.
- `head()` por rota: title, description, og:*, canonical próprio, JSON-LD `FAQPage` + `BreadcrumbList` ligado à Organization do `__root.tsx`.
- Novas entradas em `src/routes/sitemap[.]xml.ts` com prioridade 0.9.
- Filtros derivados de categoria/marca/condição e da tag "Sem CNH" já presentes em `src/lib/models.ts`; nenhuma mudança de banco.
- Ajustes de texto em `/financiamento` e nas descrições de modelos ficam no conteúdo, sem alterar regras de preço ou parcelamento.
