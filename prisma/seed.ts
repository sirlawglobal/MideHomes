import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Users for all roles
  const users = [
    { name: 'Mide Super Admin', email: 'superadmin@midehomes.com', role: 'superadmin' },
    { name: 'Mide Admin', email: 'admin@midehomes.com', role: 'admin' },
    { name: 'John Dev', email: 'developer@midehomes.com', role: 'developer' },
    { name: 'Sarah Agent', email: 'agent@midehomes.com', role: 'agent' },
    { name: 'Regular User', email: 'user@midehomes.com', role: 'user' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role as any }, // Ensure role updates if already existing
      create: {
        name: u.name,
        email: u.email,
        password: 'password123',
        role: u.role as any,
        status: 'Active',
      },
    });
  }
  console.log('✅ Users created for all roles');

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
