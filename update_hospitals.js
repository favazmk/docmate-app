const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const groups = await prisma.hospitalGroup.findMany({
    orderBy: { name: 'asc' },
    take: 4
  })

  const images = [
    '/mockups/hospital_mockup_1_1784552106575.png',
    '/mockups/hospital_mockup_2_1784552117601.png',
    '/mockups/hospital_mockup_3_1784552128133.png',
    '/mockups/hospital_mockup_4_1784552140611.png'
  ]

  for (let i = 0; i < groups.length; i++) {
    await prisma.hospitalGroup.update({
      where: { id: groups[i].id },
      data: { photoUrl: images[i] }
    })
    console.log(`Updated ${groups[i].name} with image ${images[i]}`)
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
