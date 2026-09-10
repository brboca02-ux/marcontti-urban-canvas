# Parcelamento apenas para Moto Chefe, SUDU e Triciclos

## Objetivo

O destaque de "parcela prevista no financiamento" nos cards passa a valer somente para:

- Scooters elétricas Moto Chefe (marca Klug)
- Scooters elétricas SUDU
- Triciclos elétricos

Nas **Motos Yamaha 0km** e nas **Motos Semi Novas**, os cards voltam a mostrar apenas o valor, no mesmo formato para as duas categorias:

```text
A PARTIR DE
R$ 23.990,00
```

Sem linha de parcela, sem "à vista" e sem texto de financiamento.

## O que muda na tela

- Catálogo (/modelos): cards Moto Chefe / SUDU / Triciclo continuam com a parcela em destaque laranja + preço à vista abaixo. Cards Yamaha 0km e Semi Novas exibem só "A partir de" + preço.
- Home: os blocos Destaques, Mais Vendidos e o card do vídeo seguem a mesma regra.
- Página do produto e formulários de financiamento não mudam — quem quiser simular continua clicando em "Simular Financiamento".

## Detalhes técnicos

1. `src/lib/models.ts`: expor helpers reutilizáveis já existentes hoje só dentro do catálogo — `isSemiNova(m)`, `isTriciclo(m)`, `brandOf(m)` — e adicionar `supportsInstallment(m)`, que retorna `true` quando o modelo é triciclo, marca Klug (Moto Chefe) ou SUDU, e `false` para Yamaha 0km e qualquer modelo com `condition === "semi_nova"` (ou slug/tag de semi nova).
2. `src/routes/modelos.index.tsx`: passar a usar os helpers importados (removendo as cópias locais) e condicionar o bloco de parcela a `supportsInstallment(m)`; o `else` já existente ("A partir de" + preço) atende Yamaha e Semi Novas.
3. `src/routes/index.tsx`: em `RefProductCard` e no card de destaque do `YoutubeShowcase`, calcular a parcela apenas quando `supportsInstallment(m)`; caso contrário renderizar o bloco "A partir de" + preço.
4. `src/routes/_authenticated/admin.tsx`: manter os campos de parcela, mas exibi-los somente quando o modelo em edição for elegível (marca klug/sudu ou triciclo e condição 0km), com um aviso curto de que Yamaha 0km e Semi Novas mostram apenas o valor no card. Nenhuma alteração de banco é necessária — as colunas `installment_*` continuam salvas e simplesmente não são exibidas nessas categorias.
