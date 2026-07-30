const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const appointments = await prisma.appointment.findMany({
    include: { doctor: { include: { clinics: true } } }
  });
  let updated = 0;
  for (const apt of appointments) {
    if (!apt.clinicId && apt.doctor.clinics.length > 0) {
      await prisma.appointment.update({
        where: { id: apt.id },
        data: { clinicId: apt.doctor.clinics[0].id }
      });
      updated++;
    }
  }
  console.log(`Updated ${updated} appointments.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
