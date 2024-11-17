import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Package } from '../../types';

interface PackagesListProps {
  packages: Package[];
  onEdit: (pkg: Package) => void;
  onDelete: (id: string) => void;
}

function PackagesList({ packages, onEdit, onDelete }: PackagesListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              اسم الباقة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              الفئة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              السعر
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              المدة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {packages.map((pkg) => (
            <tr key={pkg.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {pkg.name}
                  </div>
                  <div className="text-sm text-gray-500">{pkg.description}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {pkg.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {pkg.price.toLocaleString()} ر.س
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {pkg.duration} يوم
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-3 space-x-reverse">
                  <button
                    onClick={() => onEdit(pkg)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(pkg.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PackagesList;