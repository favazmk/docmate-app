require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fs = require("fs");
const path = require("path");

// Load parsed doctors from scratch/doctors.json
const doctorsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../scratch/doctors.json"), "utf8")
);

async function main() {
  console.log("Cleaning database...");
  await prisma.doctor.deleteMany({});
  await prisma.clinic.deleteMany({});
  await prisma.hospitalGroup.deleteMany({});
  await prisma.specialty.deleteMany({});
  console.log("Database cleared.");

  // 1. Seed Specialties
  console.log("Seeding Specialties...");
  const specialtySpecs = [
    { name: "Gynecology", iconName: "Activity" },
    { name: "Cardiology", iconName: "Heart" },
    { name: "Ophthalmology", iconName: "Eye" },
    { name: "Orthopedics", iconName: "Bone" },
    { name: "Pediatrics", iconName: "Baby" },
    { name: "Neurology", iconName: "Brain" },
    { name: "Pulmonology", iconName: "Stethoscope" },
    { name: "Gastroenterology", iconName: "Activity" },
    { name: "Endocrinology", iconName: "Zap" },
    { name: "Dermatology", iconName: "Sparkles" },
  ];

  const specialtiesMap = {};
  for (const spec of specialtySpecs) {
    const created = await prisma.specialty.create({
      data: { name: spec.name, iconName: spec.iconName }
    });
    specialtiesMap[spec.name.toLowerCase()] = created;
  }

  // 2. Seed Hospital Groups (Networks)
  console.log("Seeding Hospital Groups...");
  const groups = [
    { name: "King's College Hospital London", photoUrl: "https://kingscollegehospitaldubai.com/wp-content/uploads/2021/03/DR_NEW_KCH_BG_LQ-1.jpg" },
    { name: "Mediclinic Middle East", photoUrl: "https://ui-avatars.com/api/?name=Mediclinic&background=0A0A2E&color=fff&size=500" },
    { name: "Aster DM Healthcare", photoUrl: "https://ui-avatars.com/api/?name=Aster&background=2200CC&color=fff&size=500" },
    { name: "Saudi German Health", photoUrl: "https://ui-avatars.com/api/?name=SGH&background=059669&color=fff&size=500" }
  ];

  const groupsMap = {};
  for (const g of groups) {
    const created = await prisma.hospitalGroup.create({
      data: g
    });
    groupsMap[g.name] = created;
  }

  // 3. Seed Clinic Branches across Dubai, Sharjah, Ajman
  console.log("Seeding Clinic Branches...");
  const branches = [
    // King's College branches
    {
      group: "King's College Hospital London",
      name: "Dubai Hills Hospital",
      city: "Dubai",
      email: "info.dubaihills@kingscollegehospital.ae",
      phone: "+971 4 247 7777",
      photoUrl: "https://kingscollegehospitaldubai.com/wp-content/uploads/2019/04/WhatsApp-Image-2021-02-21-at-2.42.55-PM-e1614002311282-1.jpeg"
    },
    {
      group: "King's College Hospital London",
      name: "Dubai Marina Clinic",
      city: "Dubai",
      email: "info.marina@kingscollegehospital.ae",
      phone: "+971 4 247 8888",
      photoUrl: "https://kingscollegehospitaldubai.com/wp-content/uploads/2023/03/Dr-Harry.jpg"
    },
    {
      group: "King's College Hospital London",
      name: "Ajman Medical Center",
      city: "Ajman",
      email: "info.ajman@kingscollegehospital.ae",
      phone: "+971 2 247 7777",
      photoUrl: "https://kingscollegehospitaldubai.com/wp-content/uploads/2021/08/DR_F_KCH_BG_LQ-e1663830273931-1.jpg"
    },

    // Mediclinic branches
    {
      group: "Mediclinic Middle East",
      name: "Mediclinic City Hospital",
      city: "Dubai",
      email: "cityhospital@mediclinic.ae",
      phone: "+971 4 435 9999",
      photoUrl: ""
    },
    {
      group: "Mediclinic Middle East",
      name: "Mediclinic Al Noor Hospital",
      city: "Ajman",
      email: "alnoor@mediclinic.ae",
      phone: "+971 2 626 5265",
      photoUrl: ""
    },
    {
      group: "Mediclinic Middle East",
      name: "Mediclinic Al Mahatta",
      city: "Sharjah",
      email: "almahatta@mediclinic.ae",
      phone: "+971 6 563 7777",
      photoUrl: ""
    },

    // Aster branches
    {
      group: "Aster DM Healthcare",
      name: "Aster Clinic, Jumeirah",
      city: "Dubai",
      email: "jumeirah@asterclinics.com",
      phone: "+971 4 344 0000",
      photoUrl: ""
    },
    {
      group: "Aster DM Healthcare",
      name: "Aster Clinic, Sharjah",
      city: "Sharjah",
      email: "sharjah@asterclinics.com",
      phone: "+971 6 561 0200",
      photoUrl: ""
    },
    {
      group: "Aster DM Healthcare",
      name: "Aster Clinic, Ajman",
      city: "Ajman",
      email: "ajman@asterclinics.com",
      phone: "+971 2 626 1500",
      photoUrl: ""
    },

    // Saudi German branches
    {
      group: "Saudi German Health",
      name: "Saudi German Hospital Dubai",
      city: "Dubai",
      email: "info.dxb@sghgroup.ae",
      phone: "+971 4 389 0000",
      photoUrl: ""
    },
    {
      group: "Saudi German Health",
      name: "Saudi German Hospital Sharjah",
      city: "Sharjah",
      email: "info.shj@sghgroup.ae",
      phone: "+971 6 512 1111",
      photoUrl: ""
    }
  ];

  const clinicsList = [];
  for (const b of branches) {
    const parentGroup = groupsMap[b.group];
    const created = await prisma.clinic.create({
      data: {
        hospitalGroupId: parentGroup.id,
        name: b.name,
        city: b.city,
        email: b.email,
        phone: b.phone,
        photoUrl: b.photoUrl || null
      }
    });
    clinicsList.push(created);
  }

  // 4. Seeding Doctors
  console.log("Seeding Doctors...");
  for (let i = 0; i < doctorsData.length; i++) {
    const doc = doctorsData[i];

    // Determine target city distribution: Dubai (50%), Ajman (25%), Sharjah (25%)
    let targetCity = "Dubai";
    if (i % 4 === 1) targetCity = "Ajman";
    else if (i % 4 === 2) targetCity = "Sharjah";

    // Filter clinics by this target city
    const possibleClinics = clinicsList.filter(c => c.city === targetCity);
    // Grab a clinic branch sequentially
    const selectedClinic = possibleClinics[i % possibleClinics.length];
    const parentGroup = Object.values(groupsMap).find(g => g.id === selectedClinic.hospitalGroupId);

    // Resolve specialty id
    const specLower = doc.specialty.toLowerCase();
    const matchedSpecialty = specialtiesMap[specLower] || specialtiesMap["gynecology"];

    await prisma.doctor.create({
      data: {
        name: doc.name,
        slug: doc.slug,
        specialty: matchedSpecialty.name,
        specialtyId: matchedSpecialty.id,
        rating: doc.rating || 5.0,
        reviews: doc.reviews || 0,
        city: targetCity, // Dubai, Sharjah, Ajman
        email: `dr.${doc.slug}@kingscollegehospital.ae`,
        clinicId: selectedClinic.id,
        clinicEmail: selectedClinic.email,
        clinicPhone: selectedClinic.phone,
        languages: doc.languages,
        gender: doc.gender,
        fee: doc.fee || 250,
        affiliation: `${parentGroup.name} - ${selectedClinic.name}`,
        bio: doc.bio,
        photoUrl: doc.photoUrl,
        qualifications: doc.qualifications,
        status: "Active"
      }
    });
    console.log(`Created doctor: ${doc.name} linked to branch ${selectedClinic.name} in ${targetCity}`);
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
