const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const groups = await prisma.hospitalGroup.findMany();
  
  for (const group of groups) {
    let about = "We are a leading healthcare provider in the region, committed to delivering exceptional patient care and advanced medical services. Our state-of-the-art facilities and dedicated team of specialists ensure the highest standards of clinical excellence.";
    
    if (group.name.includes("Saudi German")) {
      about = "Saudi German Health is one of the leading healthcare groups in the MENA region, providing world-class medical services across multiple specialties. We combine advanced medical technology with compassionate care.";
    } else if (group.name.includes("Mediclinic")) {
      about = "Mediclinic Middle East operates multiple hospitals and clinics across the UAE, offering international standard healthcare services. We are dedicated to providing ethical and evidence-based medicine.";
    } else if (group.name.includes("King's College")) {
      about = "King's College Hospital London brings the best of British healthcare to the UAE. Our world-renowned experts provide specialized care, advanced treatments, and a patient-centric approach to healing.";
    } else if (group.name.includes("Aster")) {
      about = "Aster DM Healthcare is a comprehensive healthcare network committed to making quality medical care accessible to everyone. Our experienced doctors and modern facilities ensure comprehensive care for you and your family.";
    }

    await prisma.hospitalGroup.update({
      where: { id: group.id },
      data: { aboutUs: about }
    });
    console.log(`Updated aboutUs for ${group.name}`);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
