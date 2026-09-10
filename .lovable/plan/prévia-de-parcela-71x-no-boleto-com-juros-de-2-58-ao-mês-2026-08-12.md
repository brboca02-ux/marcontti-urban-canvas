# Prévia de parcela: 71x no boleto com juros de 2,58% ao mês

## Objetivo

Nos cards dos modelos elegíveis (Scooters Moto Chefe, SUDU e Triciclos elétricos), a parcela em destaque passa a ser uma prévia de **71x no boleto**, calculada com juros compostos de **2,58% ao mês** (tabela Price), substituindo a prévia atual de 36x.

Yamaha 0km e Motos Semi Novas continuam exibindo apenas "A partir de R$ ...".

## Como fica no card

```text
71x R$ 1.234,56
prévia de parcela no boleto (juros 2,58% a.m.)
À vista R$ 23.990,00
```

## Regras de cálculo

- Parcela = PV × i / (1 − (1+i)^−n), com i = 0,0258 e n = 71.
- Se o admin cadastrar um valor fixo de parcela para o modelo, esse valor prevalece.
- Se o admin cadastrar um número de parcelas diferente, esse número é usado no mesmo cálculo com juros.
- Sem preço cadastrado, nenhuma linha de parcela é exibida (comportamento atual mantido).

## Detalhes técnicos

1. `src/lib/installment.ts`: trocar `INSTALLMENT_MONTHS` para 71, adicionar `INSTALLMENT_RATE = 0.0258` e `INSTALLMENT_NOTE = "prévia de parcela no boleto (juros 2,58% a.m.)"`. Criar `pmt(pv, i, n)` (Price) e usá-la em `installmentLabel` e `modelInstallment`, substituindo a divisão simples `priceNumber / months`.
2. Nenhuma mudança em `src/routes/modelos.index.tsx` e `src/routes/index.tsx` — ambos já usam `modelInstallment` + `supportsInstallment`, então herdam o novo cálculo e a nova nota.
3. `src/routes/_authenticated/admin.tsx`: o preview de parcela já usa `modelInstallment`; atualizar apenas o texto de ajuda/placeholder para indicar o padrão 71x no boleto com juros de 2,58% a.m.
4. Sem alteração de banco: as colunas `installment_months`, `installment_value` e `installment_note` continuam como override opcional.
