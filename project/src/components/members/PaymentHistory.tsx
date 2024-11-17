import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Transaction } from '../../types';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface PaymentHistoryProps {
  transactions: Transaction[];
}

function PaymentHistory({ transactions }: PaymentHistoryProps) {
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">إجمالي المدفوعات</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {totalAmount.toLocaleString()} ر.س
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-full">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">سجل المعاملات</h3>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {format(new Date(transaction.date), 'dd MMMM yyyy', {
                      locale: ar,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'subscription'
                          ? 'bg-green-100 text-green-800'
                          : transaction.type === 'expense'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      {transaction.type === 'expense' ? (
                        <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                      )}
                      <span
                        className={
                          transaction.type === 'expense'
                            ? 'text-red-600'
                            : 'text-green-600'
                        }
                      >
                        {transaction.amount.toLocaleString()} ر.س
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaymentHistory;