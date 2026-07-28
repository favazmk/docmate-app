const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Migrating doctor clinics...");
  const doctors = await prisma.doctor.findMany({
    where: {
      clinicId: { not: null },
    },
  });

  console.log(`Found ${doctors.length} doctors to migrate.`);

  for (const doc of doctors) {
    if (doc.clinicId) {
      try {
        await prisma.doctor.update({
          where: { id: doc.id },
          data: {
            clinics: {
              connect: [{ id: doc.clinicId }]
            }
          }
        });
        console.log(`Migrated doctor: ${doc.name}`);
      } catch (error) {
        console.error(`Failed to migrate doctor ${doc.name}: ${error.message}`);
      }
    }
  }

  console.log("Done migrating doctor clinics!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
