import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { getDB } from '../lib/db';
import { LoginCredentials, AuthResponse } from '../types/auth';

const JWT_SECRET = new TextEncoder().encode('your-secret-key'); // In production, use environment variable

export async function initializeAdmin() {
  const db = await getDB();
  const adminUsername = 'admin';
  
  // Check if admin exists
  const existingAdmin = await db.getFromIndex('users', 'by-username', adminUsername);
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.add('users', {
      id: '1',
      name: 'مدير النظام',
      username: adminUsername,
      password: hashedPassword,
      role: 'admin',
      gender: 'male',
      phone: '0501234567',
      emergencyContact: '0501234568',
      address: 'الرياض',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const db = await getDB();
  const user = await db.getFromIndex('users', 'by-username', credentials.username);

  if (!user) {
    throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  }

  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) {
    throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  }

  const token = await new jose.SignJWT({ 
    id: user.id, 
    username: user.username, 
    role: user.role 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    },
    token,
  };
}

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('rememberedUsername');
};