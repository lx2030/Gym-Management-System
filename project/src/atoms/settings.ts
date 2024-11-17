import { atom } from 'jotai';

interface GymSettings {
  gymName: string;
  phone: string;
  email: string;
  address: string;
  enableNotifications: boolean;
  enableAutoRenewal: boolean;
  logo?: string; // Base64 encoded logo image
}

// محاولة استرجاع الإعدادات من localStorage
const savedSettings = localStorage.getItem('gymSettings');
const defaultSettings: GymSettings = {
  gymName: 'نادي الملاكمة',
  phone: '0501234567',
  email: 'info@boxingclub.com',
  address: 'الرياض، المملكة العربية السعودية',
  enableNotifications: true,
  enableAutoRenewal: true,
};

export const settingsAtom = atom<GymSettings>(
  savedSettings ? JSON.parse(savedSettings) : defaultSettings
);