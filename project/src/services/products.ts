import { getDB } from '../lib/db';
import { Product } from '../types';

export async function createProduct(data: Omit<Product, 'id'>) {
  const db = await getDB();
  const id = crypto.randomUUID();
  const product = {
    ...data,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await db.add('products', product);
  return product;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const db = await getDB();
  const product = await db.get('products', id);
  if (!product) throw new Error('المنتج غير موجود');

  const updatedProduct = {
    ...product,
    ...data,
    updatedAt: new Date(),
  };

  await db.put('products', updatedProduct);
  return updatedProduct;
}

export async function deleteProduct(id: string) {
  const db = await getDB();
  await db.delete('products', id);
}

export async function getProduct(id: string) {
  const db = await getDB();
  return db.get('products', id);
}

export async function getAllProducts() {
  const db = await getDB();
  return db.getAll('products');
}