const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const hospitals = await prisma.hospitalGroup.findMany();
  
  for (const hospital of hospitals) {
    const aboutUs = `Welcome to ${hospital.name}, a premier healthcare institution dedicated to providing world-class medical services. Our state-of-the-art facilities are equipped with the latest technology, and our team of highly skilled doctors, nurses, and support staff are committed to delivering compassionate, patient-centered care. From advanced diagnostics and specialized treatments to comprehensive wellness programs, we strive to exceed the highest standards in healthcare. Whether you are visiting us for a routine check-up or complex medical care, your health and well-being are always our top priority.`;
    
    await prisma.hospitalGroup.update({
      where: { id: hospital.id },
      data: { aboutUs: aboutUs }
    });
    console.log(`Updated aboutUs for ${hospital.name}`);
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
