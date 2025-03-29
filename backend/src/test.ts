import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDB() {
    try {
        console.log("🔄 Connecting to MongoDB...");
    await prisma.$connect();
    console.log("✅ MongoDB connected successfully!");

    console.log("🔄 Creating test user...");

    const newUser = await prisma.user.create({
        data: {
            email: "test@example.com",
            password: "testpassword123", // We will hash this later
          },
    })

    console.log("✅ Test user created:", newUser);

    console.log("🔄 Fetching all users...");

    const users = await prisma.user.findMany();
    console.log("✅ Users in database:", users);


    } catch (error) {
        console.error("❌ Database error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testDB();