import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Trash2, Plus } from 'lucide-react';
import { Transaction } from '../types';
import { getAllTransactions, deleteTransaction } from '../services/transactions';
import { useAtom } from 'jotai';
import { authAtom } from '../atoms/auth';
import TransactionForm from '../components/finance/TransactionForm';

function Finance() {
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('month');
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [auth] = useAtom(authAtom);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const loadedTransactions = await getAllTransactions();
      setTransactions(loadedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // حساب الإيرادات حسب النوع
  const subscriptionRevenue = filteredTransactions
    .filter(t => t.type === 'subscription' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const productRevenue = filteredTransactions
    .filter(t => t.type === 'product' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalRevenue = subscriptionRevenue + productRevenue;
  const netProfit = totalRevenue - totalExpenses;

  async function handleDeleteTransaction(id: string) {
    if (!auth.user?.role === 'admin') {
      alert('عذراً، لا تملك صلاحية حذف المعاملات');
      return;
    }

    if (confirm('هل أنت متأكد من حذف هذه المعاملة؟')) {
      try {
        await deleteTransaction(id);
        await loadTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('حدث خطأ أثناء حذف المعاملة');
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <DollarSign className="ml-2" />
          التقارير المالية
        </h1>
        {auth.user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة معاملة
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">إضافة معاملة جديدة</h2>
          <TransactionForm
            onSubmit={async () => {
              await loadTransactions();
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">إيرادات الاشتراكات</p>
                  <p className="text-2xl font-bold text-green-600">
                    {subscriptionRevenue.toLocaleString()} ر.س
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">إيرادات المبيعات</p>
                  <p className="text-2xl font-bold text-green-600">
                    {productRevenue.toLocaleString()} ر.س
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">المصروفات</p>
                  <p className="text-2xl font-bold text-red-600">
                    {totalExpenses.toLocaleString()} ر.س
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">صافي الربح</p>
                  <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netProfit.toLocaleString()} ر.س
                  </p>
                </div>
                <div className={`p-3 rounded-full ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {netProfit >= 0 ? (
                    <TrendingUp className={`w-6 h-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  ) : (
                    <TrendingDown className={`w-6 h-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">المعاملات المالية</h2>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as 'day' | 'week' | 'month')}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="day">اليوم</option>
                    <option value="week">الأسبوع</option>
                    <option value="month">الشهر</option>
                  </select>
                </div>
              </div>
              <input
                type="text"
                placeholder="البحث في المعاملات..."
                className="w-full px-4 py-2 border rounded-lg mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      الوصف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      المبلغ
                    </th>
                    {auth.user?.role === 'admin' && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        الإجراءات
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(transaction.date).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'subscription'
                            ? 'bg-green-100 text-green-800'
                            : transaction.type === 'expense'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type === 'subscription'
                            ? 'اشتراك'
                            : transaction.type === 'expense'
                            ? 'مصروفات'
                            : 'مبيعات'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-medium ${
                          transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.abs(transaction.amount).toLocaleString()} ر.س
                        </span>
                      </td>
                      {auth.user?.role === 'admin' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-900"
                            title="حذف المعاملة"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Finance;