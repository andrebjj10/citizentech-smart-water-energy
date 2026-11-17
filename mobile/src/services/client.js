export class ApiError extends Error {
  constructor(message, kind, status) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

export function createApiClient({baseUrl, fetchImpl = (...args) => fetch(...args), timeoutMs = 5000}) {
  async function request(path, options = {}) {
    if (!baseUrl || !/^https?:\/\//.test(baseUrl)) {
      throw new ApiError('Configure EXPO_PUBLIC_API_URL no arquivo .env e reinicie o Expo.', 'configuration');
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(`${baseUrl.replace(/\/+$/, '')}${path}`, {
        ...options,
        headers: {'Content-Type': 'application/json', ...options.headers},
        signal: controller.signal,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new ApiError(body.detail || `A estação retornou um erro (HTTP ${response.status}).`, 'http', response.status);
      }
      try {
        return await response.json();
      } catch {
        throw new ApiError('A estação enviou uma resposta inválida. Tente atualizar.', 'response');
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (controller.signal.aborted) {
        throw new ApiError('A estação demorou para responder. Verifique a conexão e tente novamente.', 'timeout');
      }
      throw new ApiError('Não foi possível acessar a estação. Confira o Wi-Fi e se o backend está ligado.', 'connection');
    } finally {
      clearTimeout(timer);
    }
  }
  return {
    health: () => request('/health'),
    latest: () => request('/readings/latest'),
    readings: () => request('/readings'),
    actuators: () => request('/actuators'),
    faults: () => request('/faults'),
    saveReading: reading => request('/readings', {method: 'POST', body: JSON.stringify(reading)}),
    toggleActuator: (id, enabled) => request(`/actuators/${id}`, {method: 'PUT', body: JSON.stringify({enabled})}),
    addFault: (message, severity) => request('/faults', {method: 'POST', body: JSON.stringify({message, severity})}),
  };
}
