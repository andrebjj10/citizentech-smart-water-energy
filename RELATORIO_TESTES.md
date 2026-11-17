# Verificações realizadas

Data: 16/11/2026, horário de São Paulo. Este documento descreve evidências desta sessão, não uma certificação de produção.

| Verificação | Resultado observado |
| --- | --- |
| Backend original com Java 21 | 3 testes passaram |
| Backend após correções | 20 testes passaram; nenhum erro ou falha |
| Empacotamento Spring Boot | `verify` gerou o JAR executável |
| Comando via Maven Wrapper | `scripts/Backend.ps1 -Action Test`: 20 testes passaram |
| Persistência H2 em arquivo | Leitura 65, evento 65 e estado do atuador 1 preservados entre os processos 18876 e 26112 |
| Testes do cliente HTTP e simulador | 12 passaram: rede, timeout, erros HTTP, resposta inválida, recuperação, configuração e quatro cenários |
| Integração cliente mobile/API real | Oito endpoints exercitados; quatro cenários, estado de atuador, evento manual e erro HTTP 400 conferidos |
| Exportação iOS com SDK 58 | Bundle gerado com sucesso; isso não equivale a executar no iPhone |
| Exportação web com SDK 58 | Bundle gerado com sucesso |
| Interface web | André confirmou no navegador: painel abriu e carregou dados da API |
| Alerta crítico pela interface | André confirmou: gerou leitura no cenário Nível crítico e o evento apareceu na aba Alertas |
| Atuadores pela interface | André confirmou: alterou um switch, saiu da aba e voltou; o estado escolhido foi mantido |
| Indisponibilidade na interface | André confirmou com a API desligada: mensagem de conexão exibida, últimos dados mantidos e navegação sem travar |
| Recuperação na interface | André confirmou que, após religar a API, o painel recuperou a conexão e os controles normalmente |
| Acesso do iPhone à API | Não concluído: Safari ficou carregando sem abrir a página de saúde |
| Publicação GitHub | Ainda não realizada |

## Cobertura do backend

Saúde da API, criação e ordenação de leituras, leitura ausente, limites exatos de alertas, campos obrigatórios, nível inválido, vazão negativa, consulta e mudança de atuadores, atuador inexistente, severidade inválida, normalização da severidade, texto longo, JSON malformado e rollback da leitura quando há falha ao salvar seu alerta.

Os testes unitários/de integração Spring usam H2 em memória isolado. A prova de persistência usa o JAR real, a URL `jdbc:h2:file:./data/estacao`, o arquivo em `backend/data/` e dois processos separados. São verificações complementares.

## Problemas encontrados durante a execução

- Expo original: plugin `react-native-screens` inválido, preset Babel ausente e versão de React Native desalinhada. Corrigidos; o bundle iOS do SDK 54 passou antes da atualização.
- O iPhone do André tem Expo Go SDK 58. Projeto atualizado para Expo 58, React 19.3 e React Native 0.88.1, conforme as versões indicadas pelo CLI instalado.
- Node 25 não pertence à faixa suportada pelo SDK 58. Os testes posteriores usaram Node 24.22.3 LTS local; backend usou JDK 21.0.13 local. Os arquivos de ferramentas não são versionados.
- O primeiro script de persistência tinha um erro de tratamento de arrays do PowerShell e foi corrigido. Depois, o teste de encerramento forçado encontrou perda do estado recém-alterado do atuador. Com `SET WRITE_DELAY 0` aplicado na inicialização das conexões, o teste passou. Isso não constitui garantia contra perda por falhas de hardware/energia.
- Maven Wrapper gerado acessava `.Target[0]` sem verificar se `Target` existia. Ajustado para tratar pasta normal no PowerShell; o comando final de teste foi executado com sucesso.
- A ferramenta de controle visual do computador ficou indisponível por falha na conexão com seu processo nativo. Não foi feita inspeção visual automatizada; a confirmação de abertura da interface veio do André.

## Dependências e pendências

`npm audit` reportou 3 avisos moderados relacionados à dependência transitiva `minimatch`, propagados por `@expo/fingerprint` e `expo`; nenhum aviso alto ou crítico nessa consulta. O npm sugeriu um downgrade para Expo 52, incompatível com o SDK 58 do iPhone. Não foi aplicado `npm audit fix --force`. A correção compatível dessa cadeia continua pendente de avaliação/atualização das dependências.

Os testes manuais de painel, alerta crítico, atuadores, indisponibilidade e recuperação da interface web foram confirmados pelo André. Ainda faltam execução em dispositivo nativo, conferência do enunciado original e publicação do repositório/URL no TXT de entrega.

## Como repetir

Na raiz `citizentech-programacao`, com Java 21 e Node 24 LTS:

```powershell
.\scripts\Backend.ps1 -Action Build
.\scripts\Mobile.ps1 -Action Test
```

Com a porta 8080 livre:

```powershell
.\scripts\Test-Persistence.ps1
```

Com o backend ativo em outro terminal:

```powershell
.\scripts\Mobile.ps1 -Action Integration
.\scripts\Mobile.ps1 -Action Export
```

O script de persistência adiciona dados de teste e restaura o atuador ao estado anterior após confirmar a persistência. Ele não apaga o banco. Recibo JSON, logs e binários são locais em `.cache/`, `backend/target/` e `mobile/dist/`, ignorados pelo Git.

Referências: [H2 — WRITE_DELAY](https://h2database.github.io/html/commands.html#set_write_delay), [upgrade do Expo](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/).
