export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  categories: string[];
  description: string;
  salary?: string;
  logoColor: string;
  pdfUrl?: string;
  createdAt: string;
  status: "active" | "expired" | "draft";
}

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Email Marketing",
    company: "Revolut",
    location: "Madrid, Spain",
    type: "Full Time",
    categories: ["Marketing", "Design"],
    description:
      "Revolut is looking for an Email Marketing Specialist to help the team manage campaigns, newsletters, and customer communications. You will be responsible for creating engaging email content, analyzing campaign performance, and optimizing strategies.",
    salary: "$45K - $65K",
    logoColor: "#000000",
    createdAt: "2026-03-01",
    status: "active",
  },
  {
    id: "2",
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Francisco, US",
    type: "Full Time",
    categories: ["Design", "Business"],
    description:
      "Dropbox is seeking a talented Brand Designer to shape our visual identity across all touch points. You'll work closely with marketing and product teams to create cohesive, impactful designs.",
    salary: "$80K - $110K",
    logoColor: "#0061FF",
    createdAt: "2026-02-28",
    status: "active",
  },
  {
    id: "3",
    title: "Visual Designer",
    company: "Blinklist",
    location: "Granada, Spain",
    type: "Full Time",
    categories: ["Design"],
    description:
      "Blinklist is looking for a Visual Designer to help the team design beautiful user interfaces and visual assets for web and mobile platforms.",
    salary: "$50K - $70K",
    logoColor: "#20C997",
    createdAt: "2026-02-27",
    status: "active",
  },
  {
    id: "4",
    title: "Product Designer",
    company: "ClassPass",
    location: "Manchester, UK",
    type: "Full Time",
    categories: ["Marketing", "Design"],
    description:
      "ClassPass is looking for a Product Designer to help us create amazing user experiences for our fitness platform.",
    salary: "$70K - $95K",
    logoColor: "#0046FF",
    createdAt: "2026-02-26",
    status: "active",
  },
  {
    id: "5",
    title: "Data Analyst",
    company: "Twitter",
    location: "San Diego, US",
    type: "Full Time",
    categories: ["Technology"],
    description:
      "Twitter is looking for a Data Analyst to help the team design data pipelines and analyze user engagement metrics.",
    salary: "$90K - $120K",
    logoColor: "#1DA1F2",
    createdAt: "2026-02-25",
    status: "expired",
  },
  {
    id: "6",
    title: "HR Manager",
    company: "Webflow",
    location: "Lucern, Switzerland",
    type: "Full Time",
    categories: ["Marketing", "Design"],
    description:
      "Webflow is looking for an HR Manager to lead our people operations team and build a world-class company culture.",
    salary: "$75K - $100K",
    logoColor: "#4353FF",
    createdAt: "2026-02-24",
    status: "active",
  },
  {
    id: "7",
    title: "Interactive Developer",
    company: "Terraform",
    location: "Hamburg, Germany",
    type: "Full Time",
    categories: ["Technology", "Design"],
    description:
      "Terraform is looking for an Interactive Developer to create cutting-edge web experiences with WebGL and Three.js.",
    salary: "$85K - $115K",
    logoColor: "#5C4EE5",
    pdfUrl: "/sample.pdf",
    createdAt: "2026-02-23",
    status: "draft",
  },
  {
    id: "8",
    title: "Social Media Assistant",
    company: "Nomad",
    location: "Paris, France",
    type: "Full Time",
    categories: ["Marketing"],
    description:
      "Nomad is looking for a Social Media Assistant to manage our social media presence and grow our online community.",
    salary: "$35K - $50K",
    logoColor: "#1AB394",
    createdAt: "2026-02-22",
    status: "active",
  },
];

export const chartData = {
  jobsByCategory: [
    { name: "Design", count: 12 },
    { name: "Marketing", count: 9 },
    { name: "Technology", count: 7 },
    { name: "Business", count: 5 },
    { name: "Finance", count: 3 },
    { name: "HR", count: 2 },
  ],
  jobsOverTime: [
    { month: "Sep", jobs: 8 },
    { month: "Oct", jobs: 12 },
    { month: "Nov", jobs: 15 },
    { month: "Dec", jobs: 10 },
    { month: "Jan", jobs: 18 },
    { month: "Feb", jobs: 22 },
    { month: "Mar", jobs: 25 },
  ],
};
