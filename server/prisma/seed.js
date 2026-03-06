const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Software Development" },
  { name: "Frontend Development" },
  { name: "Backend Development" },
  { name: "Full Stack Development" },
  { name: "Mobile App Development" },
  { name: "Game Development" },
  { name: "DevOps Engineering" },
  { name: "Cloud Engineering" },
  { name: "Data Science" },
  { name: "Machine Learning" },
  { name: "Artificial Intelligence" },
  { name: "Data Engineering" },
  { name: "Cybersecurity" },
  { name: "Blockchain Development" },
  { name: "Embedded Systems" },
  { name: "IoT Development" },
  { name: "Site Reliability Engineering" },
  { name: "Database Administration" },
  { name: "Network Engineering" },
  { name: "System Administration" },
  { name: "UI Design" },
  { name: "UX Design" },
  { name: "Graphic Design" },
  { name: "Product Design" },
  { name: "Motion Graphics" },
  { name: "Video Editing" },
  { name: "Animation" },
  { name: "Game Art & Design" },
  { name: "Quality Assurance" },
  { name: "Software Testing" },
  { name: "Automation Testing" },
  { name: "Manual Testing" },
  { name: "Product Management" },
  { name: "Project Management" },
  { name: "Technical Project Management" },
  { name: "Agile Coaching" },
  { name: "Scrum Master" },
  { name: "Business Analysis" },
  { name: "IT Consulting" },
  { name: "Digital Transformation" },
  { name: "Digital Marketing" },
  { name: "SEO Specialist" },
  { name: "Content Writing" },
  { name: "Copywriting" },
  { name: "Social Media Management" },
  { name: "Email Marketing" },
  { name: "Affiliate Marketing" },
  { name: "Performance Marketing" },
  { name: "Marketing Strategy" },
  { name: "Sales" },
  { name: "Business Development" },
  { name: "Account Management" },
  { name: "Customer Success" },
  { name: "Customer Support" },
  { name: "Technical Support" },
  { name: "Human Resources" },
  { name: "Talent Acquisition" },
  { name: "Recruitment" },
  { name: "People Operations" },
  { name: "Finance" },
  { name: "Accounting" },
  { name: "Financial Analysis" },
  { name: "Investment Banking" },
  { name: "Auditing" },
  { name: "Legal" },
  { name: "Compliance" },
  { name: "Corporate Law" },
  { name: "Operations Management" },
  { name: "Supply Chain Management" },
  { name: "Logistics" },
  { name: "Procurement" },
  { name: "Warehouse Management" },
  { name: "Mechanical Engineering" },
  { name: "Electrical Engineering" },
  { name: "Civil Engineering" },
  { name: "Chemical Engineering" },
  { name: "Industrial Engineering" },
  { name: "Architecture" },
  { name: "Construction Management" },
  { name: "Healthcare" },
  { name: "Medical Assistance" },
  { name: "Nursing" },
  { name: "Pharmacy" },
  { name: "Education" },
  { name: "Teaching" },
  { name: "Research" },
  { name: "Training & Development" },
  { name: "Hospitality" },
  { name: "Travel & Tourism" },
  { name: "Event Management" },
  { name: "Food & Beverage Services" },
  { name: "Real Estate" },
  { name: "Property Management" },
  { name: "Media & Journalism" },
  { name: "Public Relations" },
  { name: "Security Services" },
  { name: "Government Services" },
  { name: "Nonprofit & NGO" },
];

const companyNames = [
  "TechNova",
  "PixelForge",
  "CloudNexus",
  "DataFlow",
  "CyberShield",
  "DevStream",
  "CodeCrafters",
  "AppSynergy",
  "WebWorks",
  "LogicPulse",
  "NextGen Solutions",
  "InnoTech",
  "SmartSystems",
  "GlobalSoft",
  "FutureTech",
  "AlphaCore",
  "BetaBytes",
  "GammaGroup",
  "DeltaData",
  "EpsilonEdge",
  "ZetaZephyr",
  "EtaEnterprise",
  "ThetaTech",
  "IotaInnovations",
  "KappaKode",
  "LambdaLabs",
  "MuMatrix",
  "NuNetworks",
  "XiXenon",
  "OmicronOps",
  "PiPixel",
  "RhoRobotics",
  "SigmaSystems",
  "TauTechnologies",
  "UpsilonUnix",
  "PhiPhotonics",
  "ChiCyber",
  "PsiPsionics",
  "OmegaOrbit",
  "InfinityInc",
  "QuantumQuest",
  "StellarSoft",
  "NebulaNetworks",
  "GalaxyGroup",
  "CosmosCorp",
  "AeroApps",
  "BioBytes",
  "ChemCode",
  "EcoEdge",
  "GeoGraphix",
  "AstroAlgorith",
  "HydroHub",
  "PyroPixel",
  "TerraTech",
  "AquaApps",
  "AetherAnalytics",
  "SolarSystems",
  "LunarLogic",
  "MarsMatrix",
  "VenusVector",
  "JupiterJava",
  "SaturnScripts",
  "UranusUI",
  "NeptuneNodes",
  "PlutoPython",
  "MercuryMobile",
  "EarthEnterprise",
  "CometCode",
  "MeteorMedia",
  "AsteroidApps",
  "ZenithZone",
  "ApexAnalytics",
  "SummitSystems",
  "PeakPixel",
  "CrestCore",
  "PinnaclePulse",
  "CrownCloud",
  "TiaraTech",
  "CoronetCode",
  "DiademData",
  "VertexVentures",
  "AcmeApps",
  "ZenithZephyr",
  "NadirNetworks",
  "MeridianMatrix",
  "EquatorEdge",
  "TropicTech",
  "PolarPixel",
  "ArcticAnalytics",
  "AntarcticApps",
  "OceanicOps",
  "PacificPython",
  "AtlanticAlgorithms",
  "IndianInc",
  "ArcticAI",
  "EverestEnterprise",
  "K2Kode",
  "FujiFunctions",
  "AlpsApps",
  "AndesAnalytics",
];

const locations = [
  "Dhaka",
  "Chattogram",
  "Remote",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "New York",
  "London",
  "Berlin",
  "San Francisco",
];

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

const types = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
const experiences = ["Entry Level", "1-2 Years", "3-5 Years", "5+ Years"];
const salaries = [
  "$500 - $800",
  "$800 - $1200",
  "$1200 - $2000",
  "$2000+",
  "Competitive",
  "Negotiable",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomCategories(cats) {
  const shuffled = [...cats].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
}

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Seed Categories
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });
  console.log("✅ Categories seeded");

  // 2. Seed 100 Companies
  const companyData = [];
  for (let i = 0; i < 100; i++) {
    // Ensuring some names might overlap if we run out but we have exactly 100 in the array
    const name = companyNames[i] || `Company ${i}`;
    companyData.push({
      name,
      location: randomItem(locations),
    });
  }

  await prisma.company.createMany({
    data: companyData,
    skipDuplicates: true,
  });
  console.log("✅ 100 Companies seeded");

  // Retrieve available records for foreign keys
  const dbCompanies = await prisma.company.findMany();
  const dbCategories = await prisma.category.findMany();

  if (!dbCompanies.length || !dbCategories.length) {
    throw new Error("Missing companies or categories for job seeding");
  }

  // 3. Seed 100 Jobs
  const jobs = [];
  for (let i = 0; i < 100; i++) {
    const comp = randomItem(dbCompanies);
    const selectedCategories = randomCategories(dbCategories);

    jobs.push(
      prisma.job.create({
        data: {
          title: randomItem(jobTitles),
          companyId: comp.id,
          location: randomItem(locations),
          type: randomItem(types),
          experience: randomItem(experiences),
          salary: randomItem(salaries),
          description:
            "We are looking for talented professionals to join our growing team. This is a great opportunity to work on exciting projects with a dynamic group of individuals.",
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
