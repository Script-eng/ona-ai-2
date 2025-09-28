import { API_BASE_URL } from '../config';

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) throw new Error('API error');
  return response.json();
}