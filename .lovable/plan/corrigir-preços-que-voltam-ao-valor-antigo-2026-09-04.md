# Corrigir preços que "voltam" ao valor antigo

## O que está acontecendo

Encontrei duas causas concretas.

### 1. Lista de preços antiga embutida no site (causa principal)

Existe uma cópia antiga do catálogo dentro do código do site, usada como "enquanto carrega".
Enquanto o site busca os dados reais do painel, ele mostra essa cópia — e os valores dela
estão desatualizados. Comparando o painel com essa cópia:

| Modelo | Painel (correto) | Cópia antiga no site |
| --- | --- | --- |
| SUDU A12 | R$ 10.990 | R$ 10.590 |
| SUDU A3 Plus | R$ 10.990 | R$ 10.590 |
| SUDU A4 | R$ 10.990 | R$ 10.590 |
| Giga | R$ 10.990 | R$ 10.490,40 |
| Jet | R$ 10.990 | R$ 10.490,40 |
| Yamaha (todas) | preço real | zerado / "Consultar" |

Resultado: ao abrir uma página, aparece por um instante (ou fica, se a busca falhar) o
preço velho — e a parcela prevista também sai errada, porque é calculada em cima dele.
O mesmo valor antigo é usado no texto que o Google lê.

### 2. Preço em dois campos separados no painel

No cadastro existem "Preço (texto)" e "Preço (número)". O texto é o que aparece no card;
o número é o que gera a prévia da parcela. Alterando só um dos dois, o outro fica velho.
Hoje já há cadastros nesse estado: alguns mostram "22990"/"13990" sem formatação e um
modelo está com texto "Consultar disponibilidade" e número 0.

## O que vou fazer

1. Parar de usar a cópia antiga como preço provisório: enquanto o catálogo carrega, os
   cards mostram um espaço reservado (esqueleto), sem nenhum valor. Assim nunca aparece
   preço errado, nem na página do modelo, nem no texto lido pelo Google.
2. Unificar o preço no painel: um único campo de valor. O texto formatado
   (R$ 10.990,00) passa a ser gerado a partir dele, e a parcela também — impossível
   ficarem diferentes.
3. Acertar os cadastros que já estão inconsistentes (valores sem formatação e o que está
   com preço zerado), deixando todos no mesmo padrão.

## Detalhes técnicos

- `src/hooks/useDbModels.ts`: remover o fallback `staticModels` em `usePublicModels`,
  `usePublicModelsLight`; expor estado de carregamento para os consumidores.
- `src/routes/modelos.$slug.tsx`: `loader` deixa de usar `getModel()` estático como
  placeholder; `head()` só emite descrição com preço quando vem do banco.
- `src/routes/index.tsx` e `src/routes/modelos.index.tsx`: cards em skeleton enquanto
  `isLoading`, sem preço provisório.
- `src/routes/_authenticated/admin.tsx`: campo único de preço; `price` derivado de
  `price_number` via `fmtBRL` no `payload` do `handleSave`.
- Migração de dados: normalizar `price` a partir de `price_number` nas linhas divergentes.
- `src/lib/models.ts` permanece apenas como fonte de conteúdo estrutural (specs, textos,
  imagens locais); os campos de preço deixam de ser exibidos.
