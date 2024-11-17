import { getDB } from '../lib/db';
import { differenceInDays, subDays, format, startOfMonth, endOfMonth } from 'date-fns';
import { getFinancialSummary } from './transactions';

interface Activity {
  id: string;
  type: 'subscription' | 'transaction';
  description: string;
  time: string;
}

export async function getDashboardStats() {
  const db = await getDB();
  
  try {
    // Get all subscriptions
    const allSubscriptions = await db.getAll('subscriptions');
    
    // Get active subscriptions (not expired or cancelled)
    const activeSubscriptions = allSubscriptions.filter(sub => {
      const endDate = new Date(sub.endDate);
      const now = new Date();
      return sub.status === 'active' && endDate > now;
    });

    // Get expired subscriptions
    const expiredSubscriptions = allSubscriptions.filter(sub => {
      const endDate = new Date(sub.endDate);
      const now = new Date();
      return endDate <= now || sub.status === 'expired';
    });
    
    // Get active trainee IDs (users with active subscriptions)
    const activeTraineeIds = new Set(activeSubscriptions.map(sub => sub.userId));
    
    // Get all trainees (users with role 'user')
    const allUsers = await db.getAll('users');
    const allTrainees = allUsers.filter(user => user.role === 'user');
    const activeTrainees = allTrainees.filter(user => activeTraineeIds.has(user.id));
    
    // Get current month's financial summary
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const financialSummary = await getFinancialSummary(monthStart, monthEnd);
    
    // Calculate expiring subscriptions (within next 7 days)
    const expiringSubscriptions = activeSubscriptions.filter(sub => {
      const endDate = new Date(sub.endDate);
      const daysRemaining = differenceInDays(endDate, now);
      return daysRemaining >= 0 && daysRemaining <= 7;
    });

    return {
      totalTrainees: allTrainees.length,
      activeMembers: activeTrainees.length,
      activeSubscriptions: expiredSubscriptions.length,
      monthlyRevenue: financialSummary.totalRevenue,
      monthlyExpenses: financialSummary.totalExpenses,
      subscriptionRevenue: financialSummary.subscriptionRevenue,
      productRevenue: financialSummary.productRevenue,
      expensesByCategory: financialSummary.expensesByCategory,
      expiringSubscriptions: expiringSubscriptions.length,
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {
      totalTrainees: 0,
      activeMembers: 0,
      activeSubscriptions: 0,
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      subscriptionRevenue: 0,
      productRevenue: 0,
      expensesByCategory: {},
      expiringSubscriptions: 0,
    };
  }
}

export async function getDailyRevenue() {
  const db = await getDB();
  
  try {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    const financialSummary = await getFinancialSummary(thirtyDaysAgo, today);

    // Create an array of the last 30 days
    const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      return {
        date,
        amount: financialSummary.revenueByDay[date] || 0,
      };
    }).reverse();

    return dailyRevenue;
  } catch (error) {
    console.error('Error getting daily revenue:', error);
    return [];
  }
}

export async function getRecentActivities(): Promise<Activity[]> {
  const db = await getDB();
  
  try {
    const [subscriptions, transactions, users] = await Promise.all([
      db.getAll('subscriptions'),
      db.getAll('transactions'),
      db.getAll('users'),
    ]);

    const usersMap = new Map(users.map(user => [user.id, user]));

    const subscriptionActivities: Activity[] = subscriptions.map(sub => ({
      id: sub.id,
      type: 'subscription',
      description: `تم تسجيل اشتراك جديد لـ ${usersMap.get(sub.userId)?.name || 'متدرب'}`,
      time: sub.createdAt,
    }));

    const transactionActivities: Activity[] = transactions.map(trans => ({
      id: trans.id,
      type: 'transaction',
      description: trans.description,
      time: trans.createdAt,
    }));

    // Combine and sort activities
    return [...subscriptionActivities, ...transactionActivities]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return [];
  }
}