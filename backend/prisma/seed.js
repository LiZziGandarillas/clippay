import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    await prisma.conversion.deleteMany();
    await prisma.influencer.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const business = await prisma.user.create({
        data: {
            email: "business@test.com",
            password_hash: hashedPassword,
            type: "BUSINESS",
            stellar_address: "GBZGZJIH6DFKULNO2NXJAHLYKSP43BHXK2MQCFRPUB6Z4CIZDX5IFDI6",
        },
    });

    const influencer1 = await prisma.user.create({
        data: {
            email: "influencer1@test.com",
            password_hash: hashedPassword,
            type: "INFLUENCER",
            stellar_address: "GCJV2WUYLOGAHWFXWB772FDXVC4Y63AUNNWMCQR3IHL3Z2YM4DGWIXZM",
        },
    });

    const influencer2 = await prisma.user.create({
        data: {
            email: "influencer2@test.com",
            password_hash: hashedPassword,
            type: "INFLUENCER",
            stellar_address: "GASEF7VZY6QJVGQ5H4A4ZUE7PW6UIVJ5E3AQDIANFCXTFZUCEYMDMXH5",
        },
    });

    console.log("✅ Created test users:");
    console.log(`   Business: ${business.email}`);
    console.log(`   Influencer 1: ${influencer1.email}`);
    console.log(`   Influencer 2: ${influencer2.email}`);

    console.log("\n🎉 Seeding completed successfully!");
    console.log("\n📝 Test credentials:");
    console.log("   Email: business@test.com");
    console.log("   Email: influencer1@test.com");
    console.log("   Email: influencer2@test.com");
    console.log("   Password: password123");
}

main()
    .catch((e) => {
        console.error("❌ Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
