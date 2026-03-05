const prisma = require("./src/config/prisma");

async function main() {
  const company = await prisma.company.create({
    data: { name: "Test Corp", location: "Remote" },
  });

  // Job 1-4: Created Now (Within 72h)
  for (let i = 1; i <= 4; i++) {
    await prisma.job.create({
      data: {
        title: `Recent Job ${i}`,
        type: "Full Time",
        location: "Remote",
        companyId: company.id,
        createdAt: new Date(),
      },
    });
  }

  // Job 5-7: Created 80h ago (Between 72h and 96h)
  const hours80Ago = new Date(Date.now() - 80 * 60 * 60 * 1000);
  for (let i = 5; i <= 7; i++) {
    await prisma.job.create({
      data: {
        title: `Older Job ${i}`,
        type: "Part Time",
        location: "Remote",
        companyId: company.id,
        createdAt: hours80Ago,
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
