# Corrigir imagens e criar acesso administrativo

## Imagens dos produtos
- Padronizar todas as vitrines da página inicial, catálogo, páginas locais, comparação e visualização rápida para usar a foto principal da galeria quando não houver imagem por cor.
- Evitar elementos de imagem com endereço vazio e mostrar um estado de indisponibilidade somente quando o produto realmente não tiver foto.
- Priorizar o carregamento das primeiras fotos visíveis e manter carregamento progressivo apenas nas fotos abaixo da tela.
- Corrigir o atributo de prioridade das imagens e eliminar avisos que possam prejudicar a renderização.
- Validar que os sete produtos exibem suas fotos no início, catálogo e páginas individuais, em computador e celular.

## Usuário administrativo
- Habilitar o acesso por e-mail e senha, se ainda não estiver ativo.
- Criar a conta `adm@mtmobilidade.com` com a senha definida `MTadm2026` por um fluxo administrativo seguro e de uso único.
- Atribuir a função `admin` na tabela separada de permissões; nenhum perfil adicional será criado.
- Confirmar o login e o acesso ao painel, além de corrigir a falha de carregamento detectada na tela de entrada caso ainda ocorra.

## Validação final
- Confirmar visualmente o carregamento das fotos sem campos vazios.
- Entrar com a nova conta, abrir o painel e confirmar que usuários sem permissão continuam bloqueados.
- Verificar que nenhum segredo ou senha ficou salvo no código ou exposto ao navegador.

## Detalhes técnicos
- As fotos cadastradas têm aproximadamente 285–540 KB e respondem corretamente; o problema restante está nos pontos que ainda consultam somente `colors[0].image`, enquanto os novos produtos guardam a foto em `gallery`.
- A base possui a estrutura de funções administrativas, mas atualmente não há nenhuma atribuição em `user_roles`; a nova conta receberá explicitamente a função `admin`.
