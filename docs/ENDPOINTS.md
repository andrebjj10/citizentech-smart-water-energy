# API REST

Base local: `http://localhost:8080/api`. Em celular físico, substitua `localhost` pelo IPv4 do computador. Corpos de requisição e resposta usam JSON; envie `Content-Type: application/json` em POST/PUT.

| Método | Rota | Sucesso | Comportamento |
| --- | --- | --- | --- |
| GET | `/health` | 200 | `status: online` e nome da estação |
| GET | `/readings` | 200 | Até 30 leituras, mais recentes primeiro |
| GET | `/readings/latest` | 200 | Última leitura; 404 se não houver registros |
| POST | `/readings` | 201 | Salva leitura e gera alertas na mesma transação |
| GET | `/actuators` | 200 | Lista equipamentos e estado booleano `enabled` |
| PUT | `/actuators/{id}` | 200 | Atualiza estado; 404 para ID inexistente |
| GET | `/faults` | 200 | Até 30 eventos, mais recentes primeiro |
| POST | `/faults` | 201 | Registra evento manual |

Listas podem estar vazias. Não há paginação além do limite de 30. Na primeira inicialização, o backend cria uma leitura, três atuadores e um evento informativo. Não recria dados existentes a cada reinício.

## Leituras

```json
{"waterLevel":65.5,"flowRate":18.2,"powerWatts":980,"energyKwh":13.4}
```

Campos obrigatórios, numéricos e finitos. `waterLevel`: 0 a 100 (%); `flowRate`: não negativo (L/min); `powerWatts`: não negativo (W); `energyKwh`: não negativo (kWh). Resposta contém os quatro campos, `id` e `recordedAt`.

Alertas automáticos: nível **abaixo de 15%** gera `CRITICAL`; vazão **acima de 35 L/min** gera `WARNING`; potência **acima de 1800 W** gera `WARNING`. Uma leitura pode gerar os três eventos. Os valores exatos 15, 35 e 1800 não geram os respectivos alertas. Eventos formam um histórico e não são resolvidos automaticamente.

O simulador do app mantém o total de energia crescente e oferece quatro cenários didáticos. A API permite importar leituras arbitrárias válidas; ela não impõe monotonicidade ao campo `energyKwh` de chamadas externas.

## Atuadores

Consulte primeiro GET `/actuators` e use o ID retornado. Não dependa de IDs fixos.

```json
{"enabled":false}
```

`enabled` é booleano obrigatório. Resposta: `id`, `name` e `enabled`. O comando é simulado e persiste; não aciona dispositivos físicos e não implementa um modelo hidráulico dos sensores.

## Falhas/eventos

```json
{"message":"Sensor desconectado","severity":"WARNING"}
```

`message`: texto não vazio, até 255 caracteres. `severity`: `INFO`, `WARNING` ou `CRITICAL`; letras minúsculas são normalizadas para maiúsculas. Resposta: `id`, `message`, `severity`, `recordedAt`.

## Erros

Dados inválidos ou JSON malformado retornam 400. Recurso não encontrado retorna 404. Exemplo de validação (os detalhes dos campos podem estar em inglês):

```json
{"type":"about:blank","title":"Dados inválidos","status":400,"detail":"Confira os campos enviados.","errors":{"waterLevel":"must be less than or equal to 100"}}
```

O cliente distingue resposta HTTP de falha de conexão e timeout de 5 segundos. Quando não consegue atualizar, mantém os dados já carregados em memória, sinaliza que estão desatualizados e oferece nova tentativa. Não há cache persistente no aparelho após fechar o app.

`recordedAt` usa data/hora local do servidor no formato ISO, sem offset. Para a demonstração, mantenha computador e aparelho no mesmo fuso.

## Persistência e escopo

A aplicação deve iniciar dentro de `backend`, pois a URL exigida é exatamente `jdbc:h2:file:./data/estacao`. H2 Console: `http://localhost:8080/h2-console`, usuário `sa`, senha vazia, mesma JDBC URL. `SET WRITE_DELAY 0` é aplicado pela configuração de inicialização das conexões, sem alterar a URL.

Esta API acadêmica de rede local não implementa autenticação. CORS é permissivo e o console H2 está habilitado. O repositório pode ser publicado; o backend não deve ser exposto diretamente à internet com essa configuração.
