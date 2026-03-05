const prisma = require("../src/config/prisma");

async function main() {
  const companies = await prisma.company.findMany();
  const categories = await prisma.category.findMany();

  if (!companies.length)
    throw new Error("No companies found. Seed companies first.");
  if (!categories.length)
    throw new Error("No categories found. Seed categories first.");

  const jobs = [];

  const jobTitles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "React Developer",
    "Node.js Developer",
    "Software Engineer",
    "Mobile App Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Engineer",
    "Database Administrator",
    "Cybersecurity Analyst",
    "UI Designer",
    "UX Designer",
    "Product Manager",
    "Project Manager",
    "QA Engineer",
    "Automation Tester",
    "Technical Support Engineer",
    "IT Support Specialist",
    "SEO Specialist",
    "Digital Marketing Manager",
    "Content Writer",
    "Social Media Manager",
    "Sales Executive",
    "Business Development Manager",
    "HR Manager",
    "Recruiter",
    "Accountant",
    "Financial Analyst",
    "Legal Advisor",
    "Operations Manager",
    "Supply Chain Manager",
    "Logistics Coordinator",
    "Mechanical Engineer",
    "Electrical Engineer",
    "Civil Engineer",
    "Architect",
    "Construction Manager",
    "Teacher",
    "Research Assistant",
    "Event Manager",
    "Travel Consultant",
    "Hotel Manager",
    "Chef",
    "Customer Success Manager",
    "Technical Writer",
    "System Administrator",
  ];

  const locations = [
    "Dhaka",
    "Chattogram",
    "Remote",
    "Sylhet",
    "Khulna",
    "Rajshahi",
  ];
  const types = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
  const experiences = ["Entry Level", "1-2 Years", "3-5 Years", "5+ Years"];
  const salaries = ["$500 - $800", "$800 - $1200", "$1200 - $2000", "$2000+"];

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomCategories(categories) {
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  for (let i = 0; i < 100; i++) {
    const company = randomItem(companies);
    const selectedCategories = randomCategories(categories);

    jobs.push(
      prisma.job.create({
        data: {
          title: randomItem(jobTitles),
          companyId: company.id,
          location: randomItem(locations),
          type: randomItem(types),
          experience: randomItem(experiences),
          salary: randomItem(salaries),
          description:
            "We are looking for talented professionals to join our growing team.",
          logoColor: "#4F46E5",
          logo: null,
          categories: {
            connect: selectedCategories.map((c) => ({ id: c.id })),
          },
        },
      }),
    );
  }

  await Promise.all(jobs);
  console.log("✅ 100 Jobs seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
