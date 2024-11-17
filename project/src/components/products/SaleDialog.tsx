import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '../../types';
import { updateProduct } from '../../services/products';
import { createTransaction } from '../../services/transactions';
import { Receipt, Printer } from 'lucide-react';

const saleSchema = z.object({
  quantity: z.number()
    .min(1, 'الكمية يجب أن تكون 1 على الأقل')
    .max(1000, 'الكمية يجب أن تكون 1000 أو أقل'),
  customerName: z.string().optional(),
  customerPhone: z.string()
    .regex(/^[0-9]+$/, 'رقم الهاتف يجب أن يحتوي على أرقام فقط')
    .length(10, 'رقم الهاتف يجب أن يكون 10 أرقام')
    .optional()
    .or(z.literal('')),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SaleDialogProps {
  product: Product;
  onClose: () => void;
  onComplete: () => void;
}

// Generate invoice number based on timestamp and random number
function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `#${timestamp}${random}`;
}

function SaleDialog({ product, onClose, onComplete }: SaleDialogProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [saleData, setSaleData] = useState<SaleFormData | null>(null);
  const [invoiceNumber] = useState(generateInvoiceNumber());

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      quantity: 1,
      customerName: '',
      customerPhone: '',
    },
  });

  const quantity = watch('quantity', 1);
  const totalAmount = quantity * product.price;

  async function handleSaleSubmit(data: SaleFormData) {
    try {
      // تحديث المخزون
      const newStock = product.stock - data.quantity;
      await updateProduct(product.id, { stock: newStock });

      // إنشاء معاملة مالية
      await createTransaction({
        type: 'product',
        amount: totalAmount,
        date: new Date().toISOString(),
        description: `بيع ${data.quantity} ${product.name}${data.customerName ? ` - ${data.customerName}` : ''}`,
        category: product.category,
        userId: null,
      });

      setSaleData(data);
      setShowReceipt(true);
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('حدث خطأ أثناء معالجة عملية البيع');
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {showReceipt ? (
          <div className="space-y-6 print:p-0">
            <div className="text-center">
              <Receipt className="w-12 h-12 mx-auto text-green-600 mb-2 print:text-black" />
              <h2 className="text-2xl font-bold">فاتورة مبيعات</h2>
              <p className="text-gray-500 mt-1">{invoiceNumber}</p>
            </div>

            <div className="border-t border-b py-4 space-y-2">
              {saleData?.customerName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">اسم العميل:</span>
                  <span className="font-medium">{saleData.customerName}</span>
                </div>
              )}
              {saleData?.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم الهاتف:</span>
                  <span className="font-medium">{saleData.customerPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">المنتج:</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الكمية:</span>
                <span className="font-medium">{saleData?.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">سعر الوحدة:</span>
                <span className="font-medium">{product.price} ر.س</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-bold">
              <span>الإجمالي:</span>
              <span>{totalAmount.toLocaleString()} ر.س</span>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>تاريخ البيع: {new Date().toLocaleDateString('ar-SA')}</p>
              <p>وقت البيع: {new Date().toLocaleTimeString('ar-SA')}</p>
            </div>

            <div className="flex space-x-4 space-x-reverse print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <Printer className="w-5 h-5 ml-2" />
                طباعة الفاتورة
              </button>
              <button
                onClick={onComplete}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-6">بيع {product.name}</h2>
            
            <form onSubmit={handleSubmit(handleSaleSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الكمية المتوفرة: {product.stock}
                </label>
                <input
                  type="number"
                  {...register('quantity', { valueAsNumber: true })}
                  max={product.stock}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم العميل (اختياري)
                </label>
                <input
                  type="text"
                  {...register('customerName')}
                  className="w-full p-2 border rounded-lg"
                  placeholder="أدخل اسم العميل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف (اختياري)
                </label>
                <input
                  type="tel"
                  {...register('customerPhone')}
                  className="w-full p-2 border rounded-lg"
                  placeholder="05xxxxxxxx"
                  maxLength={10}
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>الإجمالي:</span>
                  <span>{totalAmount.toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="flex justify-end space-x-4 space-x-reverse">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  تأكيد البيع
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default SaleDialog;