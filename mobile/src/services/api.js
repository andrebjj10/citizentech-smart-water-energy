// Troque pelo IP local do computador (mesmo Wi-Fi do celular). Nunca use localhost em dispositivo físico.
export const API_BASE_URL = 'http://192.168.1.100:8080/api';
async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type':'application/json', ...(options.headers || {}) },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
    return await response.json();
  } finally { clearTimeout(timer); }
}
export const api = {
  latest: () => request('/readings/latest'),
  readings: () => request('/readings'),
  actuators: () => request('/actuators'),
  faults: () => request('/faults'),
  saveReading: (reading) => request('/readings', {method:'POST', body:JSON.stringify(reading)}),
  toggleActuator: (id, enabled) => request(`/actuators/${id}`, {method:'PUT',body:JSON.stringify({enabled})}),
  addFault: (message, severity) => request('/faults', {method:'POST',body:JSON.stringify({message,severity})}),
};
