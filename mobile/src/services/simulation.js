export const scenarios = [
  {id: 'normal', label: 'Normal'},
  {id: 'low-water', label: 'Nível crítico'},
  {id: 'high-flow', label: 'Vazão alta'},
  {id: 'high-power', label: 'Potência alta'},
];

// Cada acionamento representa dez segundos simulados de consumo.
export function simulateReading(previous, scenario = 'normal', random = Math.random) {
  const powerWatts = Math.round(scenario === 'high-power' ? 1900 + random() * 200 : 500 + random() * 900);
  return {
    waterLevel: +(scenario === 'low-water' ? 10 + random() * 4 : 45 + random() * 50).toFixed(1),
    flowRate: +(scenario === 'high-flow' ? 38 + random() * 6 : 8 + random() * 25).toFixed(1),
    powerWatts,
    energyKwh: +((previous?.energyKwh || 0) + powerWatts * 10 / 3600000).toFixed(4),
  };
}
