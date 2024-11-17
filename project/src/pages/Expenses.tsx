import React, { useState, useEffect } from 'react';
import { Receipt, Search, Plus, Calendar } from 'lucide-react';
import { Transaction } from '../types';
import { getTransactions, createTransaction } from '../services/transactions';
import ExpenseForm from '../components/expenses/ExpenseForm';

function Expenses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('month');
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState<Transaction[]>([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    try {
      const transactions = await getTransactions();
      const expenseTransactions = transactions.filter(t => t.type === 'expense');
      setExpenses(expenseTransactions);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  }

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + Math.abs(expense.amount), 0);

  async function handleExpenseSubmit(data: any) {
    try {
      await createTransaction({
        type: 'expense',
        amount: -Math.abs(data.amount), // Ensure negative amount for expenses
        date: new Date(data.date),
        description: data.description,
        category: data.category,
      });
      
      setShowForm(false);
      await loadExpenses();
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <Receipt className="ml-2" />
          إدارة المصروفات
        </h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 ml-2" />
          إضافة مصروف جديد
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">إضافة مصروف جديد</h2>
          <ExpenseForm
            onSubmit={handleExpenseSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <>
          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">إجمالي المصروفات</h3>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {totalExpenses.toLocaleString()} ر.س
                </p>
              </div>
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
          </div>

          {/* Expenses List */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute right-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في المصروفات..."
                  className="w-full pr-10 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      الفئة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      الوصف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      المبلغ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(expense.date).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {Math.abs(expense.amount).toLocaleString()} ر.س
                      </td>
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

export default Expenses;