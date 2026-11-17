# Git e GitHub no VS Code

Git mantém versões locais. GitHub hospeda o repositório remoto. Um commit não envia arquivos à internet; `push` faz esse envio.

## O que já foi registrado

O repositório local está na pasta `citizentech-programacao`, na branch `main`. Não execute `git init` novamente nesta cópia.

Primeiros commits reais desta sessão:

- `603e2fb`: base recebida e auditoria inicial.
- `47dd0c8`: Maven Wrapper e correções de configuração/dependências do Expo 54.
- `a2007a6`: serviço transacional, validações, testes e persistência H2.

Commits seguintes registram a atualização para o SDK 58, o cliente mobile, a simulação, os testes e a documentação conforme forem concluídos. A base veio pronta de um ZIP; não foi apresentada como implementação feita nesta sessão.

No terminal integrado do VS Code:

```powershell
git status
git log --oneline --decorate -10
git diff
```

- `status`: arquivos alterados e quais já foram selecionados.
- `log`: histórico.
- `diff`: mudanças ainda não selecionadas.

A identidade já configurada foi usada nos commits. Para conferir: `git config user.name` e `git config user.email`. Se precisar corrigir a identidade dos próximos commits, use configuração **local** neste repositório, sem `--global`. Não reescreva commits anteriores sem entender o efeito.

## Registrar uma próxima alteração real

Implemente, execute as verificações relevantes e revise a diferença. Selecione apenas os arquivos dessa alteração:

```powershell
git add CAMINHO_DO_ARQUIVO
git diff --cached
git commit -m "fix: descreva a correcao realizada"
git status
```

`add` prepara o conteúdo para o próximo commit; `commit` salva essa seleção no histórico. Não copie a mensagem de exemplo literalmente: descreva o que foi feito. Não afirme que um teste passou sem executá-lo.

No VS Code, a aba **Controle do Código-Fonte** permite ver as diferenças, selecionar arquivos com **+**, escrever a mensagem e criar o commit. Evite “Commit de tudo” sem revisar a lista.

## Criar o repositório GitHub

Esta etapa ainda não foi executada.

1. Acesse https://github.com/new com sua conta.
2. Sugestão de nome: `citizentech-smart-water-energy`.
3. Escolha a visibilidade conforme as regras da FIAP. Se privado, o professor precisa ter acesso.
4. Não inicialize README, licença ou .gitignore no GitHub: já existe um histórico local.
5. Crie o repositório vazio e copie sua URL HTTPS.

Antes do envio, revise:

```powershell
git status
git ls-files
git remote -v
```

Não devem aparecer banco H2, `node_modules`, ferramentas, caches, logs, `.env` ou binários. `.env.example`, `package-lock.json` e Maven Wrapper devem ser versionados.

## Conectar e enviar

Depois de criar o repositório vazio, substitua a URL de exemplo pela URL copiada:

```powershell
git remote add origin https://github.com/SEU_USUARIO/citizentech-smart-water-energy.git
git push -u origin main
```

`remote add` salva o endereço remoto localmente. `push` publica os commits e os arquivos rastreados. Se `origin` já existir, confira `git remote -v` antes de alterar qualquer coisa; não repita o comando automaticamente.

Faça o login solicitado pelo Git Credential Manager/navegador diretamente. Não use senha ou token na URL, no código ou no chat.

Depois, confira no GitHub README, pastas, histórico e acesso do professor. Atualize `ENTREGA_FIAP.txt` com a URL real, crie um commit dessa alteração e envie:

```powershell
git add ENTREGA_FIAP.txt
git commit -m "docs: registrar repositorio de entrega"
git push
```

## Cuidados com o histórico

Não use datas falsas, `--amend`, rebase, `reset --hard` ou `push --force` para fabricar uma evolução. Faça commits novos para correções novas. Vários commits no mesmo dia são válidos quando refletem etapas realmente realizadas.

O envio ao GitHub e a entrega no portal continuam pendentes até serem efetivamente feitos e conferidos.
