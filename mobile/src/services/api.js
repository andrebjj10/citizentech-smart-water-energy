import {createApiClient} from './client';

// No iPhone, use o IPv4 do computador na mesma rede Wi-Fi.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';
export const api = createApiClient({baseUrl: API_BASE_URL});
