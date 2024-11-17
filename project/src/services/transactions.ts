import { getDB } from '../lib/db';
import { Transaction } from '../types';

export async function createTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDB();
  const id = crypto.randomUUID();
  const transaction = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await db.add('transactions', transaction);
  return transaction;
}

export async function deleteTransaction(id: string) {
  const db = await getDB();
  await db.delete('transactions', id);
}

// Renamed to match the usage in components
export async function getTransactions() {
  const db = await getDB();
  const transactions = await db.getAll('transactions');
  return transactions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Alias for backward compatibility
export const getAllTransactions = getTransactions;

export async function getTransactionsByDateRange(startDate: Date, endDate: Date) {
  const db = await getDB();
  const transactions = await db.getAll('transactions');
  return transactions.filter(
    t => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    }
  );
}

export async function getMonthlyTransactions(year: number, month: number) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return getTransactionsByDateRange(startDate, endDate);
}

export async function getFinancialSummary(startDate: Date, endDate: Date) {
  const transactions = await getTransactionsByDateRange(startDate, endDate);
  
  const summary = {
    totalRevenue: 0,
    totalExpenses: 0,
    subscriptionRevenue: 0,
    productRevenue: 0,
    expensesByCategory: {} as Record<string, number>,
    revenueByDay: {} as Record<string, number>,
  };

  transactions.forEach(transaction => {
    const amount = Math.abs(transaction.amount);
    const dateKey = new Date(transaction.date).toISOString().split('T')[0];

    if (transaction.amount > 0) {
      // Revenue
      summary.totalRevenue += amount;
      if (transaction.type === 'subscription') {
        summary.subscriptionRevenue += amount;
      } else if (transaction.type === 'product') {
        summary.productRevenue += amount;
      }

      summary.revenueByDay[dateKey] = (summary.revenueByDay[dateKey] || 0) + amount;
    } else {
      // Expenses
      summary.totalExpenses += amount;
      if (transaction.category) {
        summary.expensesByCategory[transaction.category] = 
          (summary.expensesByCategory[transaction.category] || 0) + amount;
      }
    }
  });

  return summary;
}