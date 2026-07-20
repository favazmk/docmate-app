const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const groups = await prisma.hospitalGroup.findMany({
    include: { clinics: true }
  });

  const mims = groups.find(h => h.name.toLowerCase().includes('mims'));
  if (mims) {
    await prisma.clinic.deleteMany({ where: { hospitalGroupId: mims.id } });
    await prisma.hospitalGroup.delete({ where: { id: mims.id } });
    console.log('Deleted Mims Hospital:', mims.name);
  }

  const remainingGroups = await prisma.hospitalGroup.findMany({
    include: { clinics: true }
  });

  console.log('Remaining Hospital Groups:');
  for (const h of remainingGroups) {
    console.log(`- ${h.name} (ID: ${h.id}, photoUrl: ${h.photoUrl})`);
    for (const c of h.clinics) {
      console.log(`  - Clinic: ${c.name} (ID: ${c.id}, photoUrls: ${c.photoUrls})`);
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
