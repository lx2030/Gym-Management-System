import { atom } from 'jotai';
import { AuthState } from '../types/auth';

// Try to get initial state from localStorage
const getInitialState = (): AuthState => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  return {
    token,
    user: userStr ? JSON.parse(userStr) : null,
  };
};

export const authAtom = atom<AuthState>(getInitialState());