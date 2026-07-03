require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fs = require("fs");
const path = require("path");

// Load parsed doctors from scratch/doctors.json
const doctorsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../scratch/doctors.json"), "utf8")
);

const doctors = doctorsData.map((doc) => ({
  name: doc.name,
  slug: doc.slug,
  specialty: doc.specialty,
  rating: doc.rating,
  reviews: doc.reviews,
  city: doc.city,
  email: `dr.${doc.slug}@kingscollegehospital.ae`,
  clinicEmail: "info@kingscollegehospital.ae",
  languages: doc.languages,
  gender: doc.gender,
  fee: doc.fee,
  affiliation: doc.affiliation,
  bio: doc.bio,
  photoUrl: doc.photoUrl,
  status: "Active"
}));

async function main() {
  console.log("Seeding database...");
  
  // Clean existing doctors
  await prisma.doctor.deleteMany({});
  console.log("Cleared existing doctor records.");

  // Insert mock doctors
  for (const doc of doctors) {
    const createdDoc = await prisma.doctor.create({
      data: doc,
    });
    console.log(`Created doctor: ${createdDoc.name} (${createdDoc.id})`);
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
