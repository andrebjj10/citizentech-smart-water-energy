// Executar com backend ativo. Usa o mesmo cliente HTTP e simulador do aplicativo.
import assert from 'node:assert/strict';
import {createApiClient} from '../src/services/client.js';
import {simulateReading, scenarios} from '../src/services/simulation.js';

const client = createApiClient({baseUrl: process.env.CITIZENTECH_TEST_URL || 'http://127.0.0.1:8080/api'});
assert.equal((await client.health()).status, 'online');
let latest = await client.latest();
for (const {id} of scenarios) {
  const reading = simulateReading(latest, id, () => 0.5);
  const saved = await client.saveReading(reading);
  assert.equal(saved.waterLevel, reading.waterLevel);
  assert.equal(saved.energyKwh, reading.energyKwh);
  assert.equal((await client.latest()).id, saved.id);
  assert.equal((await client.readings())[0].id, saved.id);
  if (id !== 'normal') {
    const faults = await client.faults();
    const message = id === 'low-water' ? 'Nível de água crítico' : id === 'high-flow' ? 'Vazão acima do limite' : 'Consumo elétrico elevado';
    assert.ok(faults.some(fault => fault.message.startsWith(message)));
  }
  latest = saved;
}
const actuator = (await client.actuators())[0];
try {
  const changed = await client.toggleActuator(actuator.id, !actuator.enabled);
  assert.equal(changed.enabled, !actuator.enabled);
  assert.equal((await client.actuators()).find(item => item.id === actuator.id).enabled, !actuator.enabled);
} finally { await client.toggleActuator(actuator.id, actuator.enabled); }
assert.equal((await client.addFault('Teste de integração do cliente mobile', 'INFO')).severity, 'INFO');
await assert.rejects(client.saveReading({...latest, waterLevel: 150}), error => error.status === 400 && error.kind === 'http');
console.log('PASS: oito endpoints, quatro cenários, atuador, evento manual e validação HTTP usando o cliente do mobile.');
