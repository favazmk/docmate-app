const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const groups = await prisma.hospitalGroup.findMany();
  
  // Delete medi
  const medi = groups.find(h => h.name.toLowerCase().includes('medi') && h.name.length < 10);
  if (medi) {
    await prisma.clinic.deleteMany({ where: { hospitalGroupId: medi.id } });
    await prisma.hospitalGroup.delete({ where: { id: medi.id } });
    console.log('Deleted:', medi.name);
  }

  // Update Saudi German Health with the photoUrl that medi used
  const sgh = groups.find(h => h.name.toLowerCase().includes('saudi german'));
  if (sgh) {
    await prisma.hospitalGroup.update({
      where: { id: sgh.id },
      data: { photoUrl: '/mockups/hospital_mockup_3_1784552128133.png' }
    });
    console.log('Updated Saudi German Health photoUrl');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
