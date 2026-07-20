const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const clinics = await prisma.clinic.findMany({
    include: { hospitalGroup: true }
  });
  
  const clinicImagesPool = [
    '/mockups/clinic_mockup_1_1784553132603.png',
    '/mockups/clinic_mockup_2_1784553144875.png',
    '/mockups/clinic_mockup_3_1784553156444.png'
  ];
  const interiorImg = '/mockups/clinic_interior_1_1784553693795.png';
  const roomImg = '/mockups/clinic_room_1_1784553705560.png';

  for (let i = 0; i < clinics.length; i++) {
    const c = clinics[i];
    const mainImg = clinicImagesPool[i % clinicImagesPool.length];
    
    // Combine images
    const photoUrl = [mainImg, interiorImg, roomImg].join(',');

    const aboutUs = `Welcome to the ${c.name}, proudly part of the ${c.hospitalGroup.name} network.\n\nLocated in the heart of ${c.city}, our branch is dedicated to providing world-class, patient-centered healthcare in a modern and comfortable environment. We offer a comprehensive range of medical services tailored to your family's needs, delivered by highly specialized doctors and compassionate support staff.\n\nOur state-of-the-art facility is equipped with the latest diagnostic and therapeutic technologies, ensuring accurate diagnoses and effective treatments. We believe in proactive wellness and taking the time to listen to our patients. Whether you're here for a routine checkup or specialized care, we strive to make every visit as seamless and reassuring as possible.`;

    await prisma.clinic.update({
      where: { id: c.id },
      data: { 
        photoUrl: photoUrl,
        aboutUs: aboutUs
      }
    });
    console.log(`Updated clinic ${c.name}`);
  }

  const hospitals = await prisma.hospitalGroup.findMany();
  const hospitalLobby = '/mockups/hospital_lobby_1_1784553717673.png';
  const hospitalImagesPool = [
    '/mockups/hospital_mockup_1_1784552106575.png',
    '/mockups/hospital_mockup_2_1784552117601.png',
    '/mockups/hospital_mockup_3_1784552128133.png',
    '/mockups/hospital_mockup_4_1784552140611.png'
  ];

  for (let i = 0; i < hospitals.length; i++) {
    const h = hospitals[i];
    const mainImg = hospitalImagesPool[i % hospitalImagesPool.length];
    
    // Combine images
    const photoUrl = [mainImg, hospitalLobby].join(',');
    
    let aboutUs = h.aboutUs;
    if (!aboutUs || aboutUs.length < 50) {
      aboutUs = `${h.name} is a premier healthcare network dedicated to transforming lives through clinical excellence and compassionate care.\n\nWith multiple advanced branches across the UAE, we bring world-class medical expertise closer to your community. Our multidisciplinary team of globally trained physicians, surgeons, and healthcare professionals work collaboratively to deliver personalized treatment plans for every patient.\n\nWe continuously invest in groundbreaking medical technology, innovative research, and modern infrastructure to maintain our position at the forefront of the region's healthcare sector. Our mission is to ensure that every patient who walks through our doors receives the highest standard of care, safety, and comfort.`;
    }

    await prisma.hospitalGroup.update({
      where: { id: h.id },
      data: { 
        photoUrl: photoUrl,
        aboutUs: aboutUs
      }
    });
    console.log(`Updated hospital ${h.name}`);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
