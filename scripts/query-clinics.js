const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const clinics = await prisma.clinic.findMany({select: {id: true, name: true}});
  console.log(clinics);
}

main().finally(() => prisma.$disconnect());
