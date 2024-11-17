import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus } from 'lucide-react';
import { User, Package, Subscription, Product } from '../types';
import { createTrainee, updateTrainee, deleteTrainee, getAllTrainees } from '../services/trainees';
import { createSubscription, getSubscriptionsByUser } from '../services/subscriptions';
import { getAllPackages } from '../services/packages';
import { getAllProducts } from '../services/products';
import TraineeForm from '../components/trainees/TraineeForm';
import TraineeDetails from '../components/trainees/TraineeDetails';
import SubscriptionDialog from '../components/trainees/SubscriptionDialog';

function Trainees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [showForm, setShowForm] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState<User | null>(null);
  const [trainees, setTrainees] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [deliveryProducts, setDeliveryProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadTrainees();
    loadPackages();
    loadDeliveryProducts();
  }, []);

  async function loadTrainees() {
    try {
      const loadedTrainees = await getAllTrainees();
      setTrainees(loadedTrainees);
    } catch (error) {
      console.error('Error loading trainees:', error);
    }
  }

  async function loadPackages() {
    try {
      const loadedPackages = await getAllPackages();
      setPackages(loadedPackages);
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  }

  async function loadDeliveryProducts() {
    try {
      const products = await getAllProducts();
      const deliveryServices = products.filter(p => p.category === 'توصيل');
      setDeliveryProducts(deliveryServices);
    } catch (error) {
      console.error('Error loading delivery products:', error);
    }
  }

  async function handleTraineeSubmit(data: Omit<User, 'id' | 'role'>) {
    try {
      if (selectedTrainee) {
        await updateTrainee(selectedTrainee.id, data);
      } else {
        await createTrainee(data);
      }
      await loadTrainees();
      setShowForm(false);
      setSelectedTrainee(null);
    } catch (error) {
      console.error('Error saving trainee:', error);
    }
  }

  async function handleTraineeDelete(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المتدرب؟')) {
      try {
        await deleteTrainee(id);
        await loadTrainees();
        setSelectedTrainee(null);
      } catch (error) {
        console.error('Error deleting trainee:', error);
      }
    }
  }

  async function handleSubscriptionSubmit(data: any) {
    try {
      const selectedPackage = packages.find(p => p.id === data.packageId);
      if (!selectedPackage) return;

      const startDate = new Date(data.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + selectedPackage.duration);

      await createSubscription({
        userId: selectedTrainee!.id,
        packageId: data.packageId,
        startDate,
        endDate,
        status: 'active',
        paymentStatus: data.paymentStatus,
        deliveryProductId: data.deliveryProductId,
      });

      const userSubscriptions = await getSubscriptionsByUser(selectedTrainee!.id);
      setSubscriptions(userSubscriptions);
      setShowSubscriptionDialog(false);
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  }

  async function handleTraineeSelect(trainee: User) {
    try {
      const userSubscriptions = await getSubscriptionsByUser(trainee.id);
      setSubscriptions(userSubscriptions);
      setSelectedTrainee(trainee);
    } catch (error) {
      console.error('Error loading trainee subscriptions:', error);
    }
  }

  const filteredTrainees = trainees.filter(trainee => {
    const matchesSearch = trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainee.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = selectedGender === 'all' || trainee.gender === selectedGender;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="ml-2" />
          إدارة المتدربين
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 ml-2" />
          إضافة متدرب جديد
        </button>
      </div>

      {/* Form/Details/List */}
      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">
            {selectedTrainee ? 'تعديل متدرب' : 'إضافة متدرب جديد'}
          </h2>
          <TraineeForm
            trainee={selectedTrainee || undefined}
            onSubmit={handleTraineeSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedTrainee(null);
            }}
          />
        </div>
      ) : selectedTrainee ? (
        <>
          <TraineeDetails
            trainee={selectedTrainee}
            subscriptions={subscriptions}
            onEdit={() => setShowForm(true)}
            onDelete={() => handleTraineeDelete(selectedTrainee.id)}
            onAddSubscription={() => setShowSubscriptionDialog(true)}
          />
          {showSubscriptionDialog && (
            <SubscriptionDialog
              packages={packages}
              trainees={trainees}
              subscriptions={subscriptions}
              deliveryProducts={deliveryProducts}
              selectedTraineeId={selectedTrainee.id}
              onSubmit={handleSubscriptionSubmit}
              onClose={() => setShowSubscriptionDialog(false)}
            />
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن متدرب..."
                className="w-full pr-10 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center">
                <Filter className="w-5 h-5 ml-2 text-gray-400" />
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value as 'all' | 'male' | 'female')}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="all">جميع المتدربين</option>
                  <option value="male">رجال</option>
                  <option value="female">نساء</option>
                </select>
              </div>
            </div>
          </div>

          {/* Trainees Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    رقم الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الجنس
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrainees.map((trainee) => (
                  <tr key={trainee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{trainee.name}</div>
                      {trainee.email && (
                        <div className="text-sm text-gray-500">{trainee.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trainee.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        trainee.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {trainee.gender === 'male' ? 'ذكر' : 'أنثى'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3 space-x-reverse">
                        <button
                          onClick={() => handleTraineeSelect(trainee)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          عرض
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTrainee(trainee);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleTraineeDelete(trainee.id)}
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

export default Trainees;