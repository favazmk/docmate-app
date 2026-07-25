const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hospitals = await prisma.hospital.findMany({select: {id: true, name: true}});
  console.log(hospitals);
}

main().finally(() => prisma.$disconnect());
