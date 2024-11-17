import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface GymDBSchema extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      name: string;
      username?: string;
      password?: string;
      role: 'admin' | 'user';
      gender: 'male' | 'female';
      phone: string;
      emergencyContact: string;
      address: string;
      isSystemUser: boolean;
      createdAt: string;
      updatedAt: string;
    };
    indexes: { 'by-username': string };
  };
  packages: {
    key: string;
    value: {
      id: string;
      name: string;
      description: string;
      price: number;
      duration: number;
      category: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  subscriptions: {
    key: string;
    value: {
      id: string;
      userId: string;
      packageId: string;
      startDate: string;
      endDate: string;
      status: 'active' | 'expired' | 'pending' | 'cancelled';
      paymentStatus: 'paid' | 'pending' | 'failed';
      createdAt: string;
      updatedAt: string;
    };
    indexes: { 'by-user': string; 'by-status': string };
  };
  transactions: {
    key: string;
    value: {
      id: string;
      userId: string | null;
      type: 'subscription' | 'product' | 'delivery' | 'expense';
      amount: number;
      date: string;
      description: string;
      category?: string;
      createdAt: string;
      updatedAt: string;
    };
    indexes: { 'by-date': string };
  };
  products: {
    key: string;
    value: {
      id: string;
      name: string;
      price: number;
      stock: number;
      category: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

let db: IDBPDatabase<GymDBSchema>;

export async function initDB() {
  db = await openDB<GymDBSchema>('gym-db', 7, {
    upgrade(db, oldVersion, newVersion) {
      // Delete old stores if they exist
      if (oldVersion < 7) {
        const stores = ['users', 'packages', 'subscriptions', 'transactions', 'products'];
        stores.forEach(store => {
          if (db.objectStoreNames.contains(store)) {
            db.deleteObjectStore(store);
          }
        });
      }

      // Users store
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-username', 'username', { unique: true });
      }

      // Packages store
      if (!db.objectStoreNames.contains('packages')) {
        db.createObjectStore('packages', { keyPath: 'id' });
      }

      // Subscriptions store
      if (!db.objectStoreNames.contains('subscriptions')) {
        const subscriptionStore = db.createObjectStore('subscriptions', { keyPath: 'id' });
        subscriptionStore.createIndex('by-user', 'userId');
        subscriptionStore.createIndex('by-status', 'status');
      }

      // Transactions store
      if (!db.objectStoreNames.contains('transactions')) {
        const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
        transactionStore.createIndex('by-date', 'date');
      }

      // Products store
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' });
      }

      // Add sample data
      try {
        // Add admin user
        const adminData = {
          id: '1',
          name: 'مدير النظام',
          username: 'admin',
          password: '$2a$10$dMt5qM.1FMYqvXgHtHp1CO7kWlJRSPn8H4q.LXYVpST0AQIXq3Xt2', // admin123
          role: 'admin',
          gender: 'male',
          phone: '0501234567',
          emergencyContact: '0501234568',
          address: 'الرياض',
          isSystemUser: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.add('users', adminData);

        // Add sample package
        const samplePackage = {
          id: crypto.randomUUID(),
          name: 'الباقة الشهرية',
          description: 'تدريب لمدة شهر كامل',
          price: 300,
          duration: 30,
          category: 'شهري',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.add('packages', samplePackage);

        // Add sample delivery product
        const deliveryProduct = {
          id: crypto.randomUUID(),
          name: 'خدمة التوصيل',
          price: 50,
          stock: 999999,
          category: 'توصيل',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.add('products', deliveryProduct);
      } catch (error) {
        console.error('Error adding sample data:', error);
      }
    },
  });

  return db;
}

export async function getDB() {
  if (!db) {
    await initDB();
  }
  return db;
}