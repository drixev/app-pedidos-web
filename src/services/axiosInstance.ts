import { AuthSession } from '@/types';
import axios from 'axios';
import { SESSION_KEY } from './constants/keyStorage.contants';

export const apiClient = () => {
  const API_BASE_URL = import.meta.env.VITE_BASE_API || '';
  
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
  const session: AuthSession = JSON.parse(raw);

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`
    },
  });
}
