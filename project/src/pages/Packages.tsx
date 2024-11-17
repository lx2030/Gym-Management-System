import React, { useState, useEffect } from 'react';
import { Package as PackageIcon, Plus, Search } from 'lucide-react';
import { Package } from '../types';
import { getAllPackages, createPackage, updatePackage, deletePackage } from '../services/packages';
import PackageForm from '../components/packages/PackageForm';

function Packages() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    try {
      const loadedPackages = await getAllPackages();
      setPackages(loadedPackages);
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  }

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handlePackageSubmit(data: Omit<Package, 'id'>) {
    try {
      if (selectedPackage) {
        await updatePackage(selectedPackage.id, data);
      } else {
        await createPackage(data);
      }
      await loadPackages();
      setShowForm(false);
      setSelectedPackage(null);
    } catch (error) {
      console.error('Error saving package:', error);
      alert('حدث خطأ أثناء حفظ الباقة');
    }
  }

  async function handlePackageDelete(id: string) {
    if (confirm('هل أنت متأكد من حذف هذه الباقة؟')) {
      try {
        await deletePackage(id);
        await loadPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('حدث خطأ أثناء حذف الباقة');
      }
    }
  }

  function handleEditPackage(pkg: Package) {
    setSelectedPackage(pkg);
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <PackageIcon className="ml-2" />
          إدارة الباقات
        </h1>
        <button
          onClick={() => {
            setSelectedPackage(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 ml-2" />
          إضافة باقة جديدة
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">
            {selectedPackage ? 'تعديل باقة' : 'إضافة باقة جديدة'}
          </h2>
          <PackageForm
            package={selectedPackage || undefined}
            onSubmit={handlePackageSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedPackage(null);
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن باقة..."
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
                    اسم الباقة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الوصف
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
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pkg.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {pkg.description}
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
                          onClick={() => handleEditPackage(pkg)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handlePackageDelete(pkg.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Packages;