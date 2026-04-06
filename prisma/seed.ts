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
  
  // 4. Create 50 unique Listings
  console.log('🏘️ Seeding 50 unique listings...');
  
  const agent = await prisma.user.findFirst({
    where: { role: 'agent' }
  });
  
  if (!agent) {
    throw new Error('Agent user not found. Please ensure agent user is created.');
  }

  const allCategories = await prisma.category.findMany();
  const allLocations = await prisma.location.findMany();

  const propertyAdjectives = ['Modern', 'Luxury', 'Cozy', 'Elegant', 'Spacious', 'Stunning', 'Compact', 'Breathtaking'];
  const propertyTypes = ['Apartment', 'Villa', 'Penthouse', 'Duplex', 'Studio', 'Townhouse', 'Mansion'];
  
  const propertyImages = [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600585154340-be6191da95b8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607687940-4e524cb35097?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600585154542-633066c245ef?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
  ];

  for (let i = 1; i <= 50; i++) {
    const adj = propertyAdjectives[Math.floor(Math.random() * propertyAdjectives.length)];
    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const cat = allCategories[Math.floor(Math.random() * allCategories.length)];
    const loc = allLocations[Math.floor(Math.random() * allLocations.length)];
    
    // Weighted random for type
    const listingType = Math.random() > 0.4 ? (Math.random() > 0.5 ? 'Buy' : 'Rent') : 'Short_Let';
    
    const price = listingType === 'Rent' 
      ? Math.floor(Math.random() * 5000) + 500 
      : Math.floor(Math.random() * 2000000) + 50000;

    await prisma.listing.create({
      data: {
        title: `${adj} ${type} in ${loc.city}`,
        description: `Experience the pinnacle of ${adj.toLowerCase()} living in this beautiful ${type.toLowerCase()}. Located in the heart of ${loc.city}, this property offers exceptional value and modern amenities perfect for any lifestyle.`,
        price: price,
        location: `${loc.city}, ${loc.state}`,
        category: cat.name,
        type: listingType as any,
        bedrooms: cat.name === 'Land' ? null : Math.floor(Math.random() * 6) + 1,
        bathrooms: cat.name === 'Land' ? null : Math.floor(Math.random() * 4) + 1,
        sqft: Math.floor(Math.random() * 5000) + 500,
        status: 'Active',
        images: [
          propertyImages[Math.floor(Math.random() * propertyImages.length)],
          propertyImages[Math.floor(Math.random() * propertyImages.length)]
        ],
        agentId: agent.id,
      }
    });

    if (i % 10 === 0) console.log(`...created ${i} listings`);
  }

  console.log('✅ 50 Listings created');
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
