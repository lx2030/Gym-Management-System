export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  gender: 'male' | 'female';
  phone: string;
  birthDate?: string;
  emergencyContact: string;
  address: string;
  notes?: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  category: string;
}

export interface Subscription {
  id: string;
  userId: string;
  packageId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'failed';
}

export interface Transaction {
  id: string;
  type: 'subscription' | 'product' | 'delivery' | 'expense';
  amount: number;
  date: Date;
  description: string;
  category?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}