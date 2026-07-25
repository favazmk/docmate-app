const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  const doctorsData = JSON.parse(fs.readFileSync('./scripts/scraped_doctors.json', 'utf8'));

  const hospitalGroup = await prisma.hospitalGroup.findFirst({
    where: { name: "King's College Hospital London" }
  });

  if (!hospitalGroup) {
    console.error("King's College Hospital London not found!");
    return;
  }

  // 1. Ensure Clinics exist
  const uniqueLocations = new Set();
  doctorsData.forEach(doc => {
    // Some doctors have multiple locations separated by commas
    const locs = doc.location.split(',').map(l => l.trim());
    locs.forEach(l => uniqueLocations.add(l));
  });

  const clinicMap = {};
  for (const loc of uniqueLocations) {
    let clinic = await prisma.clinic.findFirst({
      where: { name: loc, hospitalGroupId: hospitalGroup.id }
    });
    
    if (!clinic) {
      console.log(`Creating missing clinic: ${loc}`);
      clinic = await prisma.clinic.create({
        data: {
          name: loc,
          hospitalGroupId: hospitalGroup.id,
          city: "Dubai", // Default city
          email: "info@kingscollegehospitaldubai.com",
          phone: "+971 800 7777"
        }
      });
    }
    clinicMap[loc] = clinic.id;
  }

  // Helper for gender
  function guessGender(name) {
    const femaleNames = ["millicent", "lucy", "shabeeha", "farha", "suruchi", "marjan", "lama", "ida", "somaya", "sophie", "tetyana"];
    const nameLower = name.toLowerCase();
    for (let f of femaleNames) {
      if (nameLower.includes(f)) return "Female";
    }
    return "Male";
  }

  // 2. Process Doctors
  for (const doc of doctorsData) {
    // 2a. Ensure Specialty exists (taking first one)
    const primarySpecialtyStr = doc.specialty.split(',')[0].trim();
    let specialty = await prisma.specialty.findUnique({
      where: { name: primarySpecialtyStr }
    });
    
    if (!specialty) {
      console.log(`Creating specialty: ${primarySpecialtyStr}`);
      specialty = await prisma.specialty.create({
        data: { name: primarySpecialtyStr }
      });
    }

    // Determine primary clinic ID (taking first one if multiple)
    const primaryLocStr = doc.location.split(',')[0].trim();
    const clinicId = clinicMap[primaryLocStr];

    const slug = doc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const docInput = {
      name: doc.name,
      slug: slug,
      specialtyId: specialty.id,
      specialty: primarySpecialtyStr, // Fallback field
      photoUrl: doc.img,
      city: "Dubai",
      email: `${slug}@kingscollegehospitaldubai.com`,
      clinicId: clinicId,
      languages: doc.languages || "English",
      gender: guessGender(doc.name),
      fee: 0,
      affiliation: "King's College Hospital London",
      bio: "",
      status: "Active"
    };

    const existingDoc = await prisma.doctor.findUnique({
      where: { slug: slug }
    });

    if (existingDoc) {
      console.log(`Updating doctor: ${doc.name}`);
      await prisma.doctor.update({
        where: { slug: slug },
        data: docInput
      });
    } else {
      console.log(`Creating doctor: ${doc.name}`);
      await prisma.doctor.create({
        data: docInput
      });
    }
  }

  console.log("Import complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
