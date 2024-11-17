import { getDB } from '../lib/db';
import { Package } from '../types';

export async function createPackage(data: Omit<Package, 'id'>) {
  const db = await getDB();
  const id = crypto.randomUUID();
  const pkg = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await db.add('packages', pkg);
  return pkg;
}

export async function updatePackage(id: string, data: Partial<Package>) {
  const db = await getDB();
  const pkg = await db.get('packages', id);
  if (!pkg) throw new Error('الباقة غير موجودة');

  const updatedPackage = {
    ...pkg,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await db.put('packages', updatedPackage);
  return updatedPackage;
}

export async function deletePackage(id: string) {
  const db = await getDB();
  
  // Check if package exists
  const pkg = await db.get('packages', id);
  if (!pkg) throw new Error('الباقة غير موجودة');

  // Check if package has active subscriptions
  const subscriptions = await db.getAll('subscriptions');
  const hasActiveSubscriptions = subscriptions.some(
    sub => sub.packageId === id && sub.status === 'active'
  );

  if (hasActiveSubscriptions) {
    throw new Error('لا يمكن حذف الباقة لوجود اشتراكات نشطة مرتبطة بها');
  }

  await db.delete('packages', id);
}

export async function getPackage(id: string) {
  const db = await getDB();
  const pkg = await db.get('packages', id);
  if (!pkg) throw new Error('الباقة غير موجودة');
  return pkg;
}

export async function getAllPackages() {
  const db = await getDB();
  return db.getAll('packages');
}