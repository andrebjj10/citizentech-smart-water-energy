import test from 'node:test';
import assert from 'node:assert/strict';
import {createApiClient, ApiError} from '../src/services/client.js';

const baseUrl = 'http://station.test/api';
const response = (data, status = 200) => ({ok: status < 400, status, json: async () => data});

test('consulta a última leitura e monta a URL sem barra duplicada', async () => {
  const client = createApiClient({baseUrl: baseUrl + '/', fetchImpl: async (url, options) => {
    assert.equal(url, baseUrl + '/readings/latest');
    assert.equal(options.headers['Content-Type'], 'application/json');
    return response({waterLevel: 72});
  }});
  assert.equal((await client.latest()).waterLevel, 72);
});

test('envia PUT com estado booleano do atuador', async () => {
  const client = createApiClient({baseUrl, fetchImpl: async (url, options) => {
    assert.equal(url, baseUrl + '/actuators/2');
    assert.equal(options.method, 'PUT');
    assert.deepEqual(JSON.parse(options.body), {enabled: false});
    return response({id: 2, enabled: false});
  }});
  assert.equal((await client.toggleActuator(2, false)).enabled, false);
});

test('converte falha de rede em mensagem amigável', async () => {
  const client = createApiClient({baseUrl, fetchImpl: async () => { throw new TypeError('Network request failed'); }});
  await assert.rejects(client.latest(), error => error instanceof ApiError && error.kind === 'connection' && error.message.includes('Wi-Fi'));
});

test('aborta requisição que excede o timeout', async () => {
  const client = createApiClient({baseUrl, timeoutMs: 10, fetchImpl: (_, {signal}) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), {once: true});
  })});
  await assert.rejects(client.latest(), error => error.kind === 'timeout');
});

test('mantém erro HTTP distinto de indisponibilidade da rede', async () => {
  const client = createApiClient({baseUrl, fetchImpl: async () => response({detail: 'Confira os campos enviados.'}, 400)});
  await assert.rejects(client.saveReading({}), error => error.kind === 'http' && error.status === 400 && error.message.includes('campos'));
});

test('sinaliza resposta inválida sem dizer que a API está offline', async () => {
  const client = createApiClient({baseUrl, fetchImpl: async () => ({ok: true, json: async () => { throw new SyntaxError(); }})});
  await assert.rejects(client.latest(), error => error.kind === 'response');
});

test('permite nova tentativa após falha de conexão', async () => {
  let attempts = 0;
  const client = createApiClient({baseUrl, fetchImpl: async () => {
    if (++attempts === 1) throw new TypeError('Offline');
    return response({status: 'online'});
  }});
  await assert.rejects(client.health());
  assert.equal((await client.health()).status, 'online');
});

test('configuração ausente gera mensagem de orientação', async () => {
  const client = createApiClient({baseUrl: ''});
  await assert.rejects(client.latest(), error => error.kind === 'configuration');
});
