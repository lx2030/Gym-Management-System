import { getDB } from '../lib/db';
import { Subscription } from '../types';
import { createTransaction } from './transactions';

export async function createSubscription(data: Omit<Subscription, 'id'> & { deliveryProductId?: string }) {
  const db = await getDB();
  const id = crypto.randomUUID();
  const subscription = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  try {
    // Start a transaction to ensure both operations succeed or fail together
    const tx = db.transaction(['subscriptions', 'transactions'], 'readwrite');
    
    // Add the subscription
    await tx.objectStore('subscriptions').add(subscription);

    // Get package details for the transaction description
    const pkg = await db.get('packages', data.packageId);
    const user = await db.get('users', data.userId);

    // Create a financial transaction for the subscription if paid
    if (pkg && data.paymentStatus === 'paid') {
      await createTransaction({
        userId: data.userId,
        type: 'subscription',
        amount: pkg.price,
        date: new Date(data.startDate).toISOString(),
        description: `اشتراك ${pkg.name} - ${user?.name || 'متدرب'}`,
        category: pkg.category,
      });
    }

    // If delivery service is selected and payment is paid
    if (data.deliveryProductId && data.paymentStatus === 'paid') {
      const deliveryProduct = await db.get('products', data.deliveryProductId);
      if (deliveryProduct) {
        await createTransaction({
          userId: data.userId,
          type: 'delivery',
          amount: deliveryProduct.price,
          date: new Date(data.startDate).toISOString(),
          description: `خدمة توصيل - ${user?.name || 'متدرب'}`,
          category: 'توصيل',
        });
      }
    }

    await tx.done;
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function updateSubscription(id: string, data: Partial<Subscription>) {
  const db = await getDB();
  const subscription = await db.get('subscriptions', id);
  if (!subscription) throw new Error('الاشتراك غير موجود');

  const updatedSubscription = {
    ...subscription,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // إذا تم تحديث حالة الدفع من معلق إلى مدفوع
  if (subscription.paymentStatus === 'pending' && data.paymentStatus === 'paid') {
    const pkg = await db.get('packages', subscription.packageId);
    const user = await db.get('users', subscription.userId);
    
    if (pkg) {
      await createTransaction({
        userId: subscription.userId,
        type: 'subscription',
        amount: pkg.price,
        date: new Date().toISOString(),
        description: `دفع اشتراك ${pkg.name} - ${user?.name || 'متدرب'}`,
        category: pkg.category,
      });
    }
  }

  await db.put('subscriptions', updatedSubscription);
  return updatedSubscription;
}

export async function cancelSubscription(id: string) {
  const db = await getDB();
  const subscription = await db.get('subscriptions', id);
  if (!subscription) throw new Error('الاشتراك غير موجود');

  const updatedSubscription = {
    ...subscription,
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  };

  await db.put('subscriptions', updatedSubscription);
  return updatedSubscription;
}

export async function getSubscriptionsByUser(userId: string) {
  const db = await getDB();
  return db.getAllFromIndex('subscriptions', 'by-user', userId);
}

export async function getAllSubscriptions() {
  const db = await getDB();
  return db.getAll('subscriptions');
}

export async function checkActiveSubscription(userId: string): Promise<boolean> {
  const db = await getDB();
  const userSubscriptions = await db.getAllFromIndex('subscriptions', 'by-user', userId);
  const now = new Date();
  
  return userSubscriptions.some(sub => 
    sub.status === 'active' && 
    new Date(sub.endDate) > now
  );
}