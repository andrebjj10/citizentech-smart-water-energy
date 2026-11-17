import test from 'node:test';
import assert from 'node:assert/strict';
import {simulateReading, scenarios} from '../src/services/simulation.js';

for (const {id} of scenarios) {
  test(`cenário ${id}: limites e energia acumulada coerentes`, () => {
    for (const random of [() => 0, () => 0.5, () => 0.999999]) {
      const previous = {energyKwh: 12.8};
      const reading = simulateReading(previous, id, random);
      assert.ok(reading.waterLevel >= 0 && reading.waterLevel <= 100);
      assert.ok(reading.energyKwh > previous.energyKwh);
      assert.ok(Math.abs(reading.energyKwh - previous.energyKwh - reading.powerWatts * 10 / 3600000) <= 0.000051);
      assert.equal(reading.waterLevel < 15, id === 'low-water');
      assert.equal(reading.flowRate > 35, id === 'high-flow');
      assert.equal(reading.powerWatts > 1800, id === 'high-power');
    }
  });
}
