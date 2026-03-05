const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

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

async function main() {
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log("✅ Categories seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
