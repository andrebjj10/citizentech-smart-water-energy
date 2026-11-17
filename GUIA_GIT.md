# Guia prático de Git e GitHub — André (RM 564602)

## Criar o repositório no GitHub

1. Abra https://github.com/new e crie um repositório chamado `citizentech-smart-water-energy`.
2. Deixe desmarcada a criação automática de README e `.gitignore`, porque esses arquivos já estão no projeto.
3. Abra a pasta **citizentech-programacao** no VS Code (`Arquivo > Abrir Pasta`).
4. Abra `Terminal > Novo Terminal` e execute:

```powershell
git init
git branch -M main
git config user.name "André Henrique Mendes da Cunha"
git config user.email "SEU_EMAIL_DO_GITHUB"
git add .gitignore README.md GUIA_GIT.md
git commit -m "docs: documentação inicial e plano do projeto"
git add backend
git commit -m "feat: API Spring Boot e persistência de dados H2"
git add mobile
git commit -m "feat: painel mobile React Native integrado à API"
git add ENTREGA_FIAP.txt
git commit -m "docs: preparar arquivo de entrega FIAP"
git remote add origin https://github.com/SEU_USUARIO/citizentech-smart-water-energy.git
git push -u origin main
```

> Atenção: substitua `SEU_EMAIL_DO_GITHUB` e `SEU_USUARIO` pelos seus dados. Configure autenticação do GitHub no VS Code ou via navegador. Esses commits refletem a organização dos arquivos fornecidos; **não são evidência de desenvolvimento em datas diferentes nem devem ser apresentados como tal**. Faça novos commits quando modificar, testar e corrigir o projeto de verdade.

## Commits adicionais após testar

Após o app funcionar, crie alterações reais (exemplo: configuração do endereço local, correções, novas telas ou testes). Então execute:

```powershell
git status
git add .
git commit -m "test: validar integração e tratamento de API offline"
git push
```

Na aba **Controle do Código-Fonte** do VS Code é possível selecionar arquivos para stage clicando no `+`, escrever a mensagem do commit e clicar em **Commit**, depois **Sincronizar Alterações**.

## O que NÃO publicar

A pasta `backend/data/` contém banco local e é ignorada. `node_modules`, `target` e `.expo` também são ignorados. Confira `git status` antes de fazer push.

## Arquivo de entrega

Abra `ENTREGA_FIAP.txt`, substitua `COLE_AQUI_URL_DO_REPOSITORIO` pela URL do repositório e envie **esse TXT** no portal FIAP. O repositório é o entregável técnico.
