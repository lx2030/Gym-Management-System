import { getDB } from '../lib/db';
import { User } from '../types';

export async function createTrainee(data: Omit<User, 'id' | 'role'>) {
  const db = await getDB();
  const id = crypto.randomUUID();
  const trainee = {
    ...data,
    id,
    role: 'user',
    isSystemUser: false, // علامة لتمييز المتدربين
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await db.add('users', trainee);
  return trainee;
}

export async function updateTrainee(id: string, data: Partial<User>) {
  const db = await getDB();
  const trainee = await db.get('users', id);
  if (!trainee) throw new Error('المتدرب غير موجود');

  // التحقق من أن المستخدم هو متدرب
  if (trainee.isSystemUser) {
    throw new Error('لا يمكن تعديل بيانات مستخدمي النظام من هنا');
  }

  const updatedTrainee = {
    ...trainee,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await db.put('users', updatedTrainee);
  return updatedTrainee;
}

export async function deleteTrainee(id: string) {
  const db = await getDB();
  const trainee = await db.get('users', id);
  
  if (!trainee) throw new Error('المتدرب غير موجود');
  
  // التحقق من أن المستخدم هو متدرب
  if (trainee.isSystemUser) {
    throw new Error('لا يمكن حذف مستخدمي النظام من هنا');
  }

  // التحقق من وجود اشتراكات نشطة
  const subscriptions = await db.getAll('subscriptions');
  const hasActiveSubscriptions = subscriptions.some(
    sub => sub.userId === id && sub.status === 'active'
  );

  if (hasActiveSubscriptions) {
    throw new Error('لا يمكن حذف المتدرب لوجود اشتراكات نشطة');
  }

  await db.delete('users', id);
}

export async function getTrainee(id: string) {
  const db = await getDB();
  const trainee = await db.get('users', id);
  if (!trainee || trainee.isSystemUser) {
    throw new Error('المتدرب غير موجود');
  }
  return trainee;
}

export async function getAllTrainees() {
  const db = await getDB();
  const users = await db.getAll('users');
  // إرجاع المتدربين فقط (غير مستخدمي النظام)
  return users.filter(user => !user.isSystemUser);
}