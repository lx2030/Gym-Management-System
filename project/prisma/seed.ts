import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'مدير النظام',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      gender: 'male',
      phone: '0501234567',
      emergencyContact: '0501234568',
      address: 'الرياض',
    },
  });

  // Create sample packages
  await prisma.package.createMany({
    data: [
      {
        name: 'الباقة الشهرية',
        description: 'تدريب لمدة شهر كامل',
        price: 300,
        duration: 30,
        category: 'شهري',
      },
      {
        name: 'الباقة الفصلية',
        description: 'تدريب لمدة ثلاثة أشهر',
        price: 800,
        duration: 90,
        category: 'فصلي',
      },
    ],
  });

  // Create sample products
  await prisma.product.createMany({
    data: [
      {
        name: 'قفازات ملاكمة',
        price: 200,
        stock: 15,
        category: 'معدات',
      },
      {
        name: 'حزام تدريب',
        price: 80,
        stock: 25,
        category: 'اكسسوارات',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });