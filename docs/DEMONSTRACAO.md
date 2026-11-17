# Roteiro de demonstração

1. Apresente nome, RM, tema e integração entre as duas disciplinas. Explique que sensores e atuadores são simulados.
2. Inicie a API e abra `/api/health`. Mostre o endereço H2 no arquivo de configuração.
3. Abra o aplicativo: mostre nível em %, vazão em L/min, potência em W e energia acumulada em kWh. Explique a diferença entre W e kWh.
4. Gere uma leitura normal. O painel usa POST para registrar e GET para atualizar. A energia aumenta proporcionalmente a um passo simulado de dez segundos; o polling de dez segundos somente consulta dados.
5. Selecione “Nível crítico”, gere a leitura e abra Alertas. Repita com “Vazão alta” e “Potência alta” se houver tempo. Explique os limites e as severidades.
6. Em Atuadores, mude um switch. Mostre que o estado retorna da API e continua igual após voltar à aba.
7. Pare a API com Ctrl+C. Aguarde uma atualização ou tente atualizar: a tela deve manter dados anteriores e exibir mensagem amigável. Reinicie a API e use “Tentar novamente”; a tela deve recuperar sem precisar fechar o app.
8. Mostre que a última leitura e o atuador continuam após reiniciar. Para uma prova automatizada separada, pare a API e execute `scripts/Test-Persistence.ps1`.
9. Mostre as camadas controller → service → repository → H2, os testes e o histórico real de commits.

A prévia web é útil para testar no computador; não substitui a demonstração de execução nativa quando exigida pela disciplina de Mobile. Confira todos os critérios com o enunciado original antes da entrega.
