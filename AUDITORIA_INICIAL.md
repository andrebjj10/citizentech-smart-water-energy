# Auditoria inicial — CitizenTech

Data: 16/11/2026 (horário de São Paulo).

Documento histórico do início da sessão. Correções e evidências posteriores estão no [relatório de testes](RELATORIO_TESTES.md).

Escopo: arquivos da pasta `citizentech-programacao`, comparados com os requisitos transcritos pelo André na conversa. O enunciado original da FIAP não foi localizado nesta pasta; critérios adicionais do documento original precisam ser conferidos quando estiver disponível.

## Situação por requisito

| Requisito | Evidência no código | Situação |
| --- | --- | --- |
| Backend Java/Spring Boot | `backend/pom.xml`, controller, DTOs, entidades e repositórios | Implementado; compilação e execução pendentes |
| API de leituras, atuadores e falhas | Oito rotas em `StationController` | Implementadas; testes de execução pendentes |
| H2 em arquivo com URL obrigatória | `spring.datasource.url=jdbc:h2:file:./data/estacao` | Configuração correta; persistência após reinício não testada |
| Mobile React Native | Expo, React Navigation e três telas | Código presente; instalação e execução pendentes |
| Nível, vazão, potência e energia | Quatro cartões no painel | Implementados; inspeção visual pendente |
| Alertas | Histórico no app e regras automáticas no backend | Implementados; simulação do app não dispara as regras |
| Controle de atuadores | Switches com chamada PUT | Implementado; integração pendente |
| API indisponível | Timeout de 5 s, captura de erros, banner e manutenção dos dados em memória | Parcial; validação com API parada pendente |
| Documentação | README com rotas, exemplos, execução e roteiro manual | Presente; precisa refletir ambiente validado e resultados reais |
| Testes principais | Três testes MockMvc | Cobertura inicial limitada; nenhum executado com sucesso nesta auditoria |
| Histórico Git | Não há `.git` nesta pasta | Não iniciado |

## Problemas encontrados por inspeção

1. **Ambiente Java:** o POM usa Java 21 e Spring Boot 3.4.4, mas o Java/Javac disponível no PATH é 25.0.4. Usar um JDK 21 evita depender de uma combinação fora da faixa documentada para a linha Spring Boot 3.4. Não é necessário migrar a arquitetura para resolver isso.
2. **Maven:** `mvn` não está no PATH e não há Maven Wrapper no projeto. Foi encontrada uma distribuição Maven 3.9.12 no cache de outro projeto. Falta uma forma reproduzível de executar o build.
3. **Instalação mobile:** não há `node_modules` nem `package-lock.json`. Node 25.8.0 e npm 11.11.0 estão disponíveis; compatibilidade efetiva das dependências ainda precisa ser verificada. A combinação Expo SDK 54/React Native 0.81/React 19.1 corresponde à matriz oficial, mas isso não comprova o build.
4. **Endereço da API:** o app está fixado em `192.168.1.100`. A conexão com o computador do André não está configurada nem testada.
5. **Simulação de alertas:** o app sorteia nível entre 45 e 95%, vazão entre 8 e 33 L/min e potência entre 500 e 1400 W. As regras exigem nível abaixo de 15%, vazão acima de 35 ou potência acima de 1800. O botão atual nunca demonstra esses alertas.
6. **Energia acumulada:** o app sorteia um total entre 10 e 20 kWh a cada leitura; esse total pode cair. A simulação precisa manter coerência com um medidor acumulado.
7. **Estados de conexão:** o painel mostra “API conectada” antes da primeira resposta. O banner classifica qualquer erro como API fora do ar, inclusive respostas HTTP de validação. O texto também promete dados anteriores quando nenhuma leitura foi carregada.
8. **Recuperação dos atuadores:** a tela busca dados apenas ao montar ou ao atualizar manualmente. Após um erro, os comandos permanecem desabilitados até uma atualização bem-sucedida. Convém tornar a recuperação explícita e atualizar ao voltar à tela.
9. **Atomicidade:** a leitura e seus alertas são salvos por chamadas separadas a repositórios, sem uma transação comum. Uma falha intermediária pode deixar o registro sem todos os alertas esperados.
10. **Validação das falhas:** `message` e `severity` não têm limite de tamanho nos DTOs, embora as colunas String usem o limite padrão do JPA. Entradas longas precisam retornar erro de validação em vez de erro de persistência.
11. **Testes:** faltam testes de atuadores, severidades, campos obrigatórios, limites dos alertas, persistência após reinício e cliente HTTP offline/timeout.
12. **Git:** o guia sugere vários commits separando arquivos já fornecidos no ZIP. O registro mais claro será um commit da base recebida e novos commits de alterações reais, sem sugerir uma evolução que não ocorreu.

## Verificações realmente realizadas

- Inventário dos arquivos e leitura do backend, mobile, configurações e documentação.
- Verificação de ferramentas: Java/Javac 25.0.4, Node 25.8.0, npm 11.11.0 e Git 2.53.0 disponíveis.
- `git status --short --branch` e `git log -5 --oneline`: não executaram a inspeção de histórico porque a pasta não é um repositório.
- `mvn -version`: comando não encontrado no PATH.
- Execução do Maven encontrado no cache, com `--offline test`: interrompida na resolução do POM pai `spring-boot-starter-parent:3.4.4`, ausente no cache. O processo não chegou à compilação nem aos testes.
- Consulta ao cache npm: acesso negado pelo ambiente; não comprova defeito nas dependências do app.
- Conferência das matrizes oficiais de Spring Boot e Expo.

**Não realizados:** instalação de dependências, testes de backend concluídos, inicialização da API, reinício com H2, build do app, teste em celular, integração, inspeção visual ou publicação. Nenhum desses itens deve ser apresentado como aprovado.

## Plano para finalizar

1. **Preservar a base:** explicar e iniciar Git; revisar `.gitignore` e registrar um único commit da versão recebida. Não modificar identidade global nem publicar sem explicar a ação.
2. **Reproduzir o backend:** usar JDK 21, disponibilizar Maven Wrapper, baixar dependências e executar os três testes existentes antes das correções.
3. **Corrigir backend:** organizar a lógica em serviço transacional, padronizar erros e completar validações; adicionar testes dos comportamentos principais e executar o build.
4. **Provar H2:** iniciar API na pasta `backend`, criar leitura/falha e alterar atuador; guardar IDs e valores, parar o processo, reiniciar e consultar os mesmos dados. Registrar os resultados reais.
5. **Preparar mobile:** instalar dependências compatíveis, gerar lockfile, verificar configuração Expo e externalizar o endereço da API. Corrigir simulação, estados de conexão, recuperação e áreas seguras da interface.
6. **Validar integração:** testar cliente HTTP e bundle; executar no dispositivo ou emulador, conferir as três telas, comandos, cenários de alerta e recuperação após desligar/religar a API. Build ou teste HTTP isolado não substitui essa demonstração.
7. **Fechar entrega:** atualizar README, guia Git, documentação de erros/endpoints, roteiro de demonstração e relatório de testes; criar repositório GitHub, revisar arquivos e publicar após explicar a operação. Preencher a URL real em `ENTREGA_FIAP.txt`.

Meta: concluir implementação e validação em 17–18/11, reservando 19/11 para revisão e envio antes das 23h55. Isso é um plano, não garantia de aprovação nem de execução automática nessas datas.

## Referências de compatibilidade

- Spring Boot 3.4: https://docs.spring.io/spring-boot/3.4/system-requirements.html
- Expo SDK: https://docs.expo.dev/versions/latest/

As referências da linha/framework podem mudar. A versão exata instalada deve ser verificada durante a execução.
