const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const clinics = await prisma.clinic.findMany();
  
  const images = [
    '/mockups/clinic_mockup_1_1784553132603.png',
    '/mockups/clinic_mockup_2_1784553144875.png',
    '/mockups/clinic_mockup_3_1784553156444.png'
  ];

  for (let i = 0; i < clinics.length; i++) {
    const img = images[i % images.length];
    await prisma.clinic.update({
      where: { id: clinics[i].id },
      data: { photoUrl: img }
    });
    console.log(`Updated clinic ${clinics[i].name} with image ${img}`);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
