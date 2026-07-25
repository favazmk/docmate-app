const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function update() {
  await prisma.doctor.update({
    where: { slug: 'dr-murtaza-najmi' },
    data: { photoUrl: 'https://kingscollegehospitaldubai.com/wp-content/uploads/2017/08/Doctor-Image-Web_Size.jpg' }
  });
  console.log('Fixed Murtaza');
}

update().catch(console.error).finally(() => process.exit(0));
