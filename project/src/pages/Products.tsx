import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Plus, Package, TrendingUp, Archive } from 'lucide-react';
import { Product } from '../types';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/products';
import { getAllTransactions } from '../services/transactions';
import ProductForm from '../components/products/ProductForm';
import SaleDialog from '../components/products/SaleDialog';

const PRODUCT_CATEGORIES = [
  'معدات',
  'ملابس',
  'مكملات غذائية',
  'توصيل',
  'أخرى',
];

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showSaleDialog, setShowSaleDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesStats, setSalesStats] = useState<Record<string, number>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [loadedProducts, transactions] = await Promise.all([
        getAllProducts(),
        getAllTransactions()
      ]);
      
      // حساب إحصائيات المبيعات
      const stats: Record<string, number> = {};
      transactions.forEach(transaction => {
        if (transaction.type === 'product') {
          const productName = transaction.description.split(' ')[1]; // استخراج الكمية من الوصف
          const quantity = parseInt(productName) || 0;
          const productId = loadedProducts.find(p => 
            transaction.description.includes(p.name)
          )?.id;
          
          if (productId) {
            stats[productId] = (stats[productId] || 0) + quantity;
          }
        }
      });

      setProducts(loadedProducts);
      setSalesStats(stats);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  const filteredProducts = products.filter(product =>
    (categoryFilter === 'all' || product.category === categoryFilter) &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  async function handleProductSubmit(data: any) {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, data);
      } else {
        await createProduct(data);
      }
      setShowForm(false);
      setSelectedProduct(null);
      await loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('حدث خطأ أثناء حفظ المنتج');
    }
  }

  async function handleProductDelete(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await deleteProduct(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('حدث خطأ أثناء حذف المنتج');
      }
    }
  }

  function handleSaleClick(product: Product) {
    setSelectedProduct(product);
    setShowSaleDialog(true);
  }

  // حساب إجمالي المخزون والمبيعات
  const totalStock = filteredProducts.reduce((sum, product) => sum + product.stock, 0);
  const totalSales = Object.values(salesStats).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <ShoppingBag className="ml-2" />
          إدارة المنتجات
        </h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 ml-2" />
          إضافة منتج جديد
        </button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المخزون</p>
              <p className="text-2xl font-bold text-blue-600">{totalStock}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Archive className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-green-600">{totalSales}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">عدد المنتجات</p>
              <p className="text-2xl font-bold text-purple-600">{products.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">
            {selectedProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
          </h2>
          <ProductForm
            product={selectedProduct || undefined}
            categories={PRODUCT_CATEGORIES}
            onSubmit={handleProductSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedProduct(null);
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن منتج..."
                className="w-full pr-10 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">جميع الفئات</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المنتج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الفئة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    السعر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المخزون
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المبيعات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price.toLocaleString()} ر.س
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 10
                            ? 'متوفر'
                            : product.stock > 0
                            ? 'منخفض'
                            : 'نفذ المخزون'}
                        </span>
                        <span className="mr-2 text-sm text-gray-600">
                          ({product.stock})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-medium text-gray-900">
                        {salesStats[product.id] || 0}
                      </span>
                      <span className="text-gray-500"> وحدة</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3 space-x-reverse">
                        {product.stock > 0 && product.category !== 'توصيل' && (
                          <button
                            onClick={() => handleSaleClick(product)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            بيع
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleProductDelete(product.id)}
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

      {showSaleDialog && selectedProduct && (
        <SaleDialog
          product={selectedProduct}
          onClose={() => {
            setShowSaleDialog(false);
            setSelectedProduct(null);
          }}
          onComplete={async () => {
            await loadData();
            setShowSaleDialog(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}

export default Products;