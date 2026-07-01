require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const doctors = [
  {
    name: "Dr. Ahmed Al Mansouri",
    slug: "dr-ahmed-al-mansouri",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 124,
    city: "Dubai",
    email: "dr.ahmed@docmate.example.com",
    languages: "Arabic, English",
    fee: 450,
    affiliation: "Mediclinic City Hospital, Dubai",
    bio: "Dr. Ahmed Al Mansouri is a board-certified cardiologist with over 15 years of experience treating complex cardiovascular conditions in the GCC.",
    photoUrl: "https://ui-avatars.com/api/?name=Ahmed+Al+Mansouri&background=2200CC&color=fff",
    status: "Active"
  },
  {
    name: "Dr. Sara Johnson",
    slug: "dr-sara-johnson",
    specialty: "Dermatologist",
    rating: 4.8,
    reviews: 89,
    city: "Abu Dhabi",
    email: "dr.sara@docmate.example.com",
    languages: "English, French",
    fee: 300,
    affiliation: "King Faisal Specialist Hospital",
    bio: "Dr. Sara Johnson is a highly skilled dermatologist specializing in cosmetic and medical dermatology with a passion for skincare health.",
    photoUrl: "https://ui-avatars.com/api/?name=Sara+Johnson&background=059669&color=fff",
    status: "Active"
  },
  {
    name: "Dr. Khalid Omar",
    slug: "dr-khalid-omar",
    specialty: "Orthopedics",
    rating: 4.7,
    reviews: 210,
    city: "Sharjah",
    email: "dr.khalid@docmate.example.com",
    languages: "Arabic, English",
    fee: 40,
    affiliation: "Al-Amiri Hospital",
    bio: "Dr. Khalid Omar specializes in joint replacement surgery and sports medicine, helping patients recover mobility and lead active lives.",
    photoUrl: "https://ui-avatars.com/api/?name=Khalid+Omar&background=F59E0B&color=fff",
    status: "Active"
  },
  {
    name: "Dr. Maria Garcia",
    slug: "dr-maria-garcia",
    specialty: "Pediatrician",
    rating: 5.0,
    reviews: 342,
    city: "Ajman",
    email: "dr.maria@docmate.example.com",
    languages: "English, Spanish, Arabic",
    fee: 350,
    affiliation: "Sidra Medicine",
    bio: "Dr. Maria Garcia provides compassionate and comprehensive pediatric care to children of all ages, from infants to adolescents.",
    photoUrl: "https://ui-avatars.com/api/?name=Maria+Garcia&background=EEF0FF&color=2200CC",
    status: "Active"
  }
];

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
