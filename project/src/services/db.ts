import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { User, Package, Subscription, Transaction, Product } from '@prisma/client';

// Users
export const createUser = async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return prisma.user.create({ data });
};

export const getUsers = () => {
  return prisma.user.findMany();
};

export const getUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      subscriptions: {
        include: {
          package: true,
        },
      },
    },
  });
};

// Packages
export const createPackage = (data: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.package.create({ data });
};

export const getPackages = () => {
  return prisma.package.findMany();
};

// Subscriptions
export const createSubscription = (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.subscription.create({ data });
};

export const getSubscriptions = () => {
  return prisma.subscription.findMany({
    include: {
      user: true,
      package: true,
    },
  });
};

// Transactions
export const createTransaction = (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.transaction.create({ data });
};

export const getTransactions = () => {
  return prisma.transaction.findMany({
    include: {
      user: true,
    },
  });
};

// Products
export const createProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.product.create({ data });
};

export const getProducts = () => {
  return prisma.product.findMany();
};

// Authentication
export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const validatePassword = async (user: User, password: string) => {
  if (!user.password) return false;
  return bcrypt.compare(password, user.password);
};