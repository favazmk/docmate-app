const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Updating Doctor photo URLs...");
  const doctors = await prisma.doctor.findMany({
    where: {
      photoUrl: { contains: '/uploads/' },
    },
  });

  for (const doc of doctors) {
    if (doc.photoUrl && doc.photoUrl.includes('/uploads/') && !doc.photoUrl.includes('/api/uploads/')) {
      const newUrl = doc.photoUrl.replace(/\/uploads\//g, '/api/uploads/');
      await prisma.doctor.update({
        where: { id: doc.id },
        data: { photoUrl: newUrl },
      });
      console.log(`Updated doctor: ${doc.name}`);
    }
  }

  console.log("Updating Clinic photo URLs...");
  const clinics = await prisma.clinic.findMany({
    where: {
      photoUrl: { contains: '/uploads/' },
    },
  });

  for (const clinic of clinics) {
    if (clinic.photoUrl && clinic.photoUrl.includes('/uploads/') && !clinic.photoUrl.includes('/api/uploads/')) {
      const newUrl = clinic.photoUrl.replace(/\/uploads\//g, '/api/uploads/');
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { photoUrl: newUrl },
      });
      console.log(`Updated clinic: ${clinic.name}`);
    }
  }

  console.log("Updating HospitalGroup photo URLs...");
  const hospitals = await prisma.hospitalGroup.findMany({
    where: {
      photoUrl: { contains: '/uploads/' },
    },
  });

  for (const hospital of hospitals) {
    if (hospital.photoUrl && hospital.photoUrl.includes('/uploads/') && !hospital.photoUrl.includes('/api/uploads/')) {
      const newUrl = hospital.photoUrl.replace(/\/uploads\//g, '/api/uploads/');
      await prisma.hospitalGroup.update({
        where: { id: hospital.id },
        data: { photoUrl: newUrl },
      });
      console.log(`Updated hospital: ${hospital.name}`);
    }
  }

  console.log("Done updating upload URLs!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
