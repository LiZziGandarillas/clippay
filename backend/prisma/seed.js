import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const prisma = new PrismaClient();
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createTestUser(email, type, stellar_address) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: "password123",
        email_confirm: true,
        user_metadata: { type, stellar_address },
    });

    if (error && !error.message.includes("already registered")) {
        throw error;
    }

    const userId = data?.user?.id ?? (
        await supabaseAdmin.auth.admin.listUsers()
    ).data.users.find(u => u.email === email)?.id;

    return await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            id: userId,
            email,
            type,
            stellar_address,
        },
    });
}

async function main() {
    console.log("🌱 Seeding database...");

    await prisma.conversion.deleteMany();
    await prisma.influencer.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.user.deleteMany();

    const business = await createTestUser(
        "business@test.com",
        "BUSINESS",
        "GBZGZJIH6DFKULNO2NXJAHLYKSP43BHXK2MQCFRPUB6Z4CIZDX5IFDI6"
    );

    const influencer1 = await createTestUser(
        "influencer1@test.com",
        "INFLUENCER",
        "GCJV2WUYLOGAHWFXWB772FDXVC4Y63AUNNWMCQR3IHL3Z2YM4DGWIXZM"
    );

    const influencer2 = await createTestUser(
        "influencer2@test.com",
        "INFLUENCER",
        "GASEF7VZY6QJVGQ5H4A4ZUE7PW6UIVJ5E3AQDIANFCXTFZUCEYMDMXH5"
    );

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
