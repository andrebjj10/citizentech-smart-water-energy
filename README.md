# CitizenTech — Smart Water & Energy Station

FIAP · Engenharia Mecatrônica · 2EMR · Global Solution 2026.2

**Aluno:** André Henrique Mendes da Cunha · **RM:** 564602
**Entrega:** 19/11/2026 às 23h55 · Desenvolvimento individual

Aplicativo React Native/Expo integrado a uma API Java/Spring Boot. Monitora água e energia simuladas, registra eventos e permite alterar o estado de atuadores simulados.

## Estado da validação

Backend: **20 testes aprovados**, JAR gerado e persistência em arquivo comprovada entre dois processos. Cliente mobile/simulador: **12 testes aprovados**. Integração HTTP real e bundles iOS/web aprovados. André confirmou que a interface web carrega dados da API.

**Execução nativa no iPhone e publicação no GitHub ainda pendentes.** Consulte [o relatório de testes](RELATORIO_TESTES.md) para evidências, limitações e avisos de dependências. A [auditoria inicial](AUDITORIA_INICIAL.md) registra a situação anterior às correções.

## Organização

- `backend/`: Spring Boot 3.4.4, Java 21, validação, serviço transacional, JPA e H2.
- `mobile/`: Expo SDK 58, React 19.3, React Native 0.88.1, navegação por abas.
- `scripts/`: comandos PowerShell para executar e testar no Windows/VS Code.
- `docs/`: [endpoints](docs/ENDPOINTS.md) e [roteiro da demonstração](docs/DEMONSTRACAO.md).
- `GUIA_GIT.md`: versionamento e publicação.
- `ENTREGA_FIAP.txt`: identificação e campo para a URL real do repositório.

O enunciado original da FIAP ainda precisa ser conferido. O escopo foi comparado com os requisitos transcritos na conversa.

## Preparar o ambiente

Use **JDK 21**, **Node 24 LTS** e Git. Maven é fornecido pelo Wrapper. Na primeira execução, é necessário acesso à internet para baixar dependências.

Nesta máquina foram baixados JDK 21 e Node 24 para `.tools/`, ignorada pelo Git. Os scripts selecionam essas ferramentas quando presentes; em um clone novo, instale os pré-requisitos ou configure `JAVA_HOME` e `PATH`. Eles alteram apenas o ambiente do processo/terminal, sem substituir as instalações do Windows.

Abra a pasta **citizentech-programacao** no VS Code e use **Terminal > Novo Terminal**. Os comandos a seguir partem dessa pasta.

## Backend

Compile e execute os testes:

```powershell
.\scripts\Backend.ps1 -Action Build
```

Inicie o JAR:

```powershell
.\scripts\Backend.ps1 -Action Run
```

API: http://localhost:8080/api/health. Deixe esse terminal aberto; Ctrl+C encerra a API. O script inicia dentro de `backend`, preservando o caminho relativo do banco.

Alternativa com JDK 21 já selecionado, na pasta `backend`: `.\mvnw.cmd verify` e `.\mvnw.cmd spring-boot:run`.

## Aplicativo e prévia no computador

Em um **segundo terminal**, prepare as dependências. Ao usar as ferramentas locais desta máquina:

```powershell
. .\scripts\Use-LocalTools.ps1
cd mobile
npm ci
```

Em um clone novo, copie `.env.example` para `.env` e defina:

```dotenv
EXPO_PUBLIC_API_URL=http://SEU_IPV4:8080/api
```

Use o IPv4 mostrado por `ipconfig` para testar em celular físico. Para prévia somente no computador, também é possível usar `http://localhost:8080/api`. O endereço não é uma credencial; variáveis `EXPO_PUBLIC_*` ficam incorporadas ao aplicativo. Nunca coloque senhas nelas.

Volte à raiz se estiver em `mobile` e abra a prévia:

```powershell
cd ..
.\scripts\Mobile.ps1 -Action Web
```

A URL padrão é http://localhost:8081. Se a porta estiver ocupada por outro Expo, encerre esse processo no terminal correspondente antes de iniciar novamente. Alterações no código atualizam a prévia; depois de alterar `.env`, reinicie o Expo.

## iPhone

O projeto usa **SDK 58**, conforme o Expo Go instalado no iPhone do André. Com computador e aparelho no mesmo Wi-Fi:

```powershell
.\scripts\Mobile.ps1 -Action Start
```

Abra o Expo Go pelo QR code do terminal. Se houver solicitação de login, faça-a diretamente no Expo CLI/app usando a mesma conta, conforme a orientação exibida. Não compartilhe senhas no código ou no chat.

Antes de investigar o app, confira se o Safari abre `http://IP_DO_COMPUTADOR:8080/api/health`. Se não abrir, verifique rede, VPN, isolamento de clientes do roteador e regras do firewall para o Java usado. O Expo também precisa de acesso à porta 8081. Não desative o firewall inteiro.

O teste de acesso pelo iPhone desta sessão ficou pendente: o Safari não concluiu a abertura da API. A prévia web não comprova execução nativa.

## Testes

```powershell
.\scripts\Backend.ps1 -Action Test
.\scripts\Mobile.ps1 -Action Test
```

Com a API ativa:

```powershell
.\scripts\Mobile.ps1 -Action Integration
.\scripts\Mobile.ps1 -Action Export
```

O teste de integração usa o cliente HTTP e o simulador do próprio aplicativo, adiciona leituras/eventos e restaura o atuador ao estado anterior. A exportação gera bundle iOS; não gera um aplicativo iOS assinado nem substitui teste em dispositivo.

Com a API **parada** e porta 8080 livre:

```powershell
.\scripts\Test-Persistence.ps1
```

Esse teste inicia dois processos reais, grava dados, encerra e reinicia a API e compara leituras, eventos e atuadores. Não apaga o banco. Logs e recibo JSON ficam em `.cache/`, sem versionamento.

## H2 e regras da estação

URL obrigatória, preservada exatamente: `jdbc:h2:file:./data/estacao`. O arquivo fica em `backend/data/estacao.mv.db` ao iniciar pela pasta correta. `ddl-auto=update` preserva tabelas entre execuções. `SET WRITE_DELAY 0` é aplicado nas conexões para eliminar o atraso padrão de escrita do H2.

H2 Console: http://localhost:8080/h2-console · usuário `sa` · senha vazia · mesma JDBC URL. O arquivo do banco não deve entrar no Git.

Alertas: nível abaixo de 15%, vazão acima de 35 L/min e potência acima de 1800 W. O painel oferece cenários para demonstrá-los. Cada leitura simulada acrescenta dez segundos de consumo à energia acumulada; atualizar a tela apenas consulta a API.

Os atuadores têm estados persistentes e são simulados. Não há sensores físicos, automação hidráulica real, autenticação ou cache persistente no telefone. A configuração com CORS permissivo e H2 Console é destinada a demonstração local.

## Entrega

Siga o [guia Git](GUIA_GIT.md), publique o repositório depois da revisão e preencha a URL real em `ENTREGA_FIAP.txt`. Confira formato e critérios no enunciado/portal. Preserve os commits das etapas reais e registre apenas testes efetivamente executados.
