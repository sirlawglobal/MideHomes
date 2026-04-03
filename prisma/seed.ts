import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@midehomes.com' },
    update: {},
    create: {
      name: 'Mide Admin',
      email: 'admin@midehomes.com',
      password: 'password123',
      role: 'superadmin',
      status: 'Active',
    },
  });
  console.log('✅ Super Admin created');

  // 2. Create Categories
  const categories = [
    { name: 'Residential', description: 'Homes, apartments, and condos' },
    { name: 'Commercial', description: 'Office spaces, retail, and warehouses' },
    { name: 'Land', description: 'Empty plots and agricultural land' },
    { name: 'Short Let', description: 'Vacation homes and short-term rentals' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: {
        name: cat.name,
        description: cat.description,
        status: 'Active',
      },
    });
  }
  console.log('✅ Categories created');

  // 3. Create Locations
  const locations = [
    { city: 'Ikoyi', state: 'Lagos' },
    { city: 'Lekki', state: 'Lagos' },
    { city: 'Victoria Island', state: 'Lagos' },
    { city: 'Ikeja', state: 'Lagos' },
    { city: 'Ajah', state: 'Lagos' },
  ];

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { 
        city_state: {
          city: loc.city,
          state: loc.state
        }
      },
      update: {},
      create: {
        city: loc.city,
        state: loc.state,
        status: 'Active',
      },
    });
  }
  console.log('✅ Locations created');

  console.log('✨ Seeding finished successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
