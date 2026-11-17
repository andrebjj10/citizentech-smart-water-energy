# CitizenTech — Smart Water & Energy Station

**FIAP — Engenharia Mecatrônica, 2EMR | Global Solution 2026.2**

**Aluno:** André Henrique Mendes da Cunha  
**RM:** 564602

Projeto integrado de duas disciplinas:
- **Advanced Programming and Mobile Development:** aplicativo React Native/Expo com painel, níveis de reservatório, vazão, consumo elétrico, alertas de falha e controle de atuadores.
- **Técnicas Avançadas de Programação:** API REST em Java/Spring Boot com persistência em **H2 modo arquivo**.

## Estrutura

- `backend/`: API REST e banco de dados persistente.
- `mobile/`: aplicativo Android/iOS com três telas.
- `ENTREGA_FIAP.txt`: modelo de entrega (preencher o link depois de criar o repositório).

## Executar o backend

Pré-requisitos: **Java 21 e Maven 3.9+**.

```bash
cd backend
mvn spring-boot:run
```

API em `http://localhost:8080/api/health`. O banco é gravado em `backend/data/estacao.mv.db` ao executar de dentro da pasta `backend`, conforme `jdbc:h2:file:./data/estacao`.

## Testes automatizados do backend

```bash
cd backend
mvn test
```

O projeto inclui testes de saúde da API, registro de leitura e validação de nível inválido.

## Executar o aplicativo

Pré-requisitos: Node.js, npm e aplicativo **Expo Go** no celular (na mesma rede Wi-Fi que o computador).

1. Descubra o IPv4 do computador: no Windows, `ipconfig`.
2. Abra `mobile/src/services/api.js` e troque `192.168.1.100` pelo IPv4 do computador.
3. Em outro terminal:

```bash
cd mobile
npm install
npx expo install --fix
npx expo start
```

4. Abra o Expo Go e leia o QR code no terminal. **Não use `localhost`** na URL do app em celular físico. Caso dê erro de rede, confirme que a porta **8080** está liberada no firewall do Windows, que ambos estão no mesmo Wi-Fi e que o backend continua executando.

## Endpoints REST

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/health` | Estado do servidor |
| GET | `/api/readings` | Últimas 30 leituras |
| GET | `/api/readings/latest` | Leitura mais recente |
| POST | `/api/readings` | Registra uma leitura |
| GET | `/api/actuators` | Lista atuadores |
| PUT | `/api/actuators/{id}` | Liga/desliga atuador |
| GET | `/api/faults` | Últimos 30 eventos |
| POST | `/api/faults` | Registra uma falha |

### Exemplos de chamadas

**POST** `/api/readings`:

```json
{"waterLevel":65.5,"flowRate":18.2,"powerWatts":980,"energyKwh":13.4}
```

Validação: nível de água 0–100%; demais valores não negativos. Leituras abaixo de 15%, vazão acima de 35 L/min ou potência acima de 1800 W geram alertas automáticos.

**PUT** `/api/actuators/1`:

```json
{"enabled":false}
```

**POST** `/api/faults`:

```json
{"message":"Teste de sensor desconectado","severity":"WARNING"}
```

Severidades aceitas: `INFO`, `WARNING`, `CRITICAL`.

## Demonstrar persistência H2

1. Rode o backend e abra `http://localhost:8080/api/readings`.
2. Registre uma leitura pelo botão **Gerar nova leitura simulada** no app ou pela API.
3. Confirme que a leitura aparece no endpoint.
4. Pare o backend com `Ctrl+C` — o aplicativo deverá exibir **API fora do ar** e manter a última leitura em tela.
5. Reinicie o backend com `mvn spring-boot:run`, atualize a tela e confirme que a leitura anterior ainda existe.
6. Para verificar no H2 Console: `http://localhost:8080/h2-console`, JDBC URL `jdbc:h2:file:./data/estacao`, usuário `sa`, senha em branco (desde que executado a partir de `backend`).

> Os dados são simulados para uma demonstração acadêmica. Sem integração com dispositivos hidráulicos ou elétricos físicos.

## Evolução do projeto e Git

Registre commits durante o desenvolvimento real. Sugestões de etapas: estrutura inicial, implementação backend, persistência, mobile, integração, tratamento de indisponibilidade e documentação. O arquivo `GUIA_GIT.md` explica os comandos.

## Observações

- A API foi configurada para **demonstração em rede local** com CORS permissivo e console H2; **não publique em produção sem autenticação, autorização e revisão de segurança**.
- A conexão móvel depende do IP local configurado e de rede acessível.
- Todos os controles de atuadores neste projeto são simulados.
