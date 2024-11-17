import { getDB } from '../lib/db';
import { User } from '../types';
import bcrypt from 'bcryptjs';

export async function createUser(data: Omit<User, 'id'>) {
  const db = await getDB();
  const id = crypto.randomUUID();

  // التحقق من وجود اسم المستخدم
  const existingUser = await db.getFromIndex('users', 'by-username', data.username);
  if (existingUser) {
    throw new Error('اسم المستخدم مستخدم بالفعل');
  }

  // التأكد من أن المستخدم هو مستخدم نظام
  const user = {
    ...data,
    id,
    isSystemUser: true, // علامة لتمييز مستخدمي النظام
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // تشفير كلمة المرور إذا تم توفيرها
  if ('password' in data) {
    user.password = await bcrypt.hash(data.password, 10);
  }
  
  await db.add('users', user);
  return user;
}

export async function updateUser(id: string, data: Partial<User>) {
  const db = await getDB();
  const user = await db.get('users', id);
  if (!user) throw new Error('المستخدم غير موجود');

  // التحقق من أن المستخدم هو مستخدم نظام
  if (!user.isSystemUser) {
    throw new Error('لا يمكن تعديل بيانات المتدربين من هنا');
  }

  // التحقق من تغيير اسم المستخدم
  if (data.username && data.username !== user.username) {
    const existingUser = await db.getFromIndex('users', 'by-username', data.username);
    if (existingUser) {
      throw new Error('اسم المستخدم مستخدم بالفعل');
    }
  }

  // تشفير كلمة المرور إذا تم تحديثها
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = {
    ...user,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await db.put('users', updatedUser);
  return updatedUser;
}

export async function deleteUser(id: string) {
  const db = await getDB();
  const user = await db.get('users', id);
  
  if (!user) throw new Error('المستخدم غير موجود');
  
  // التحقق من أن المستخدم هو مستخدم نظام
  if (!user.isSystemUser) {
    throw new Error('لا يمكن حذف المتدربين من هنا');
  }

  await db.delete('users', id);
}

export async function getUser(id: string) {
  const db = await getDB();
  const user = await db.get('users', id);
  if (!user || !user.isSystemUser) {
    throw new Error('المستخدم غير موجود');
  }
  return user;
}

export async function getAllUsers() {
  const db = await getDB();
  const users = await db.getAll('users');
  // إرجاع مستخدمي النظام فقط (الموظفين)
  return users.filter(user => user.isSystemUser);
}

export async function findUserByUsername(username: string) {
  const db = await getDB();
  const user = await db.getFromIndex('users', 'by-username', username);
  if (!user || !user.isSystemUser) {
    throw new Error('المستخدم غير موجود');
  }
  return user;
}