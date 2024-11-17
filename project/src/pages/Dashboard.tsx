import React, { useEffect, useState } from 'react';
import { User, Subscription, Transaction, Package as PackageType, Product } from '../types';
import { getAllTrainees } from '../services/trainees';
import { getAllSubscriptions, createSubscription, cancelSubscription } from '../services/subscriptions';
import { getAllPackages } from '../services/packages';
import { getAllProducts } from '../services/products';
import { getAllTransactions } from '../services/transactions';
import { getDashboardStats, getDailyRevenue } from '../services/dashboard';
import DashboardStats from '../components/dashboard/DashboardStats';
import RevenueChart from '../components/dashboard/RevenueChart';
import SubscriptionStats from '../components/dashboard/SubscriptionStats';
import ImportantAlerts from '../components/dashboard/ImportantAlerts';
import ActiveSubscriptions from '../components/dashboard/ActiveSubscriptions';

function Dashboard() {
  const [stats, setStats] = useState({
    totalTrainees: 0,
    activeMembers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    subscriptionRevenue: 0,
    productRevenue: 0,
    expensesByCategory: {},
    expiringSubscriptions: 0,
  });

  const [packages, setPackages] = useState<PackageType[]>([]);
  const [trainees, setTrainees] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [revenueData, setRevenueData] = useState<Array<{ date: string; amount: number }>>([]);
  const [deliveryProducts, setDeliveryProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [
        dashboardStats,
        loadedTrainees,
        loadedPackages,
        loadedSubscriptions,
        dailyRevenue,
        products
      ] = await Promise.all([
        getDashboardStats(),
        getAllTrainees(),
        getAllPackages(),
        getAllSubscriptions(),
        getDailyRevenue(),
        getAllProducts()
      ]);

      setStats(dashboardStats);
      setTrainees(loadedTrainees);
      setPackages(loadedPackages);
      setSubscriptions(loadedSubscriptions);
      setRevenueData(dailyRevenue);
      setDeliveryProducts(products.filter(p => p.category === 'توصيل'));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  async function handleCancelSubscription(subscriptionId: string) {
    if (confirm('هل أنت متأكد من إلغاء هذا الاشتراك؟')) {
      try {
        await cancelSubscription(subscriptionId);
        await loadDashboardData();
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        alert('حدث خطأ أثناء إلغاء الاشتراك');
      }
    }
  }

  async function handleAddSubscription(data: any) {
    try {
      await createSubscription(data);
      await loadDashboardData();
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('حدث خطأ أثناء إنشاء الاشتراك');
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">لوحة التحكم</h1>
      
      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6" style={{ height: '300px' }}>
            <h2 className="text-lg font-semibold mb-4">الإيرادات والمصروفات</h2>
            <RevenueChart data={revenueData} />
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow p-6" style={{ height: '300px' }}>
            <h2 className="text-lg font-semibold mb-4">حالة الاشتراكات</h2>
            <SubscriptionStats
              activeCount={stats.activeMembers}
              expiredCount={stats.activeSubscriptions}
              expiringCount={stats.expiringSubscriptions}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveSubscriptions
            subscriptions={subscriptions}
            trainees={trainees}
            packages={packages}
            deliveryProducts={deliveryProducts}
            onCancelSubscription={handleCancelSubscription}
            onAddSubscription={handleAddSubscription}
          />
        </div>
        <div>
          <ImportantAlerts
            expiringSubscriptions={subscriptions
              .filter(sub => {
                const endDate = new Date(sub.endDate);
                const daysRemaining = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return sub.status === 'active' && daysRemaining <= 7 && daysRemaining > 0;
              })
              .map(sub => ({
                traineeName: trainees.find(t => t.id === sub.userId)?.name || 'غير معروف',
                daysRemaining: Math.ceil((new Date(sub.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
              }))}
            inactiveTrainees={[]}
            lowAttendance={[]}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;