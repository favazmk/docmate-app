const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@docmate.com" }
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          name: "Docmate Admin",
          email: "admin@docmate.com",
          password: hashedPassword,
          role: "ADMIN",
        }
      });
      console.log("Admin user created successfully.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
