export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  categories: string[];
  salary?: string;
  logoColor?: string;
  logoUrl?: string;
  description?: string;
}

export const featuredJobs: Job[] = [
  {
    id: "f1",
    title: "Email Marketing",
    company: "Revolut",
    location: "Madrid, Spain",
    type: "Full Time",
    categories: ["Marketing", "Design"],
    logoColor: "#000000",
    description: "Revolut is looking for Email Marketing to help team ma ...",
  },
  {
    id: "f2",
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Fransisco, US",
    type: "Full Time",
    categories: ["Design", "Business"],
    logoColor: "#0061FF",
    description: "Dropbox is looking for Brand Designer to help the team t ...",
  },
  {
    id: "f3",
    title: "Email Marketing",
    company: "Pitch",
    location: "Berlin, Germany",
    type: "Full Time",
    categories: ["Marketing"],
    logoColor: "#000000",
    description:
      "Pitch is looking for Customer Manager to join marketing t ...",
  },
  {
    id: "f4",
    title: "Visual Designer",
    company: "Blinklist",
    location: "Granada, Spain",
    type: "Full Time",
    categories: ["Design"],
    logoColor: "#20C997",
    description:
      "Blinklist is looking for Visual Designer to help team desi ...",
  },
  {
    id: "f5",
    title: "Product Designer",
    company: "ClassPass",
    location: "Manchester, UK",
    type: "Full Time",
    categories: ["Marketing", "Design"],
    logoColor: "#0046FF",
    description: "ClassPass is looking for Product Designer to help us...",
  },
  {
    id: "f6",
    title: "Lead Designer",
    company: "Canva",
    location: "Ontario, Canada",
    type: "Full Time",
    categories: ["Design", "Business"],
    logoColor: "#00C4CC",
    description: "Canva is looking for Lead Engineer to help develop n ...",
  },
  {
    id: "f7",
    title: "Brand Strategist",
    company: "GoDaddy",
    location: "Marseille, France",
    type: "Full Time",
    categories: ["Marketing"],
    logoColor: "#000000",
    description: "GoDaddy is looking for Brand Strategist to join the team...",
  },
  {
    id: "f8",
    title: "Data Analyst",
    company: "Twitter",
    location: "San Diego, US",
    type: "Full Time",
    categories: ["Technology"],
    logoColor: "#1DA1F2",
    description: "Twitter is looking for Data Analyst to help team desi ...",
  },
];

export const latestJobs: Job[] = [
  {
    id: "l1",
    title: "Social Media Assistant",
    company: "Nomad",
    location: "Paris, France",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logoColor: "#1AB394",
  },
  {
    id: "l2",
    title: "Social Media Assistant",
    company: "Netlify",
    location: "Paris, France",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logoColor: "#00ADBB",
  },
  {
    id: "l3",
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Fransisco, USA",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logoColor: "#0061FF",
  },
  {
    id: "l4",
    title: "Brand Designer",
    company: "Maze",
    location: "San Fransisco, USA",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logoColor: "#1877F2",
  },
  {
    id: "l5",
    title: "Interactive Developer",
    company: "Terraform",
    location: "Hamburg, Germany",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logoColor: "#5C4EE5",
  },
  {
    id: "l6",
    title: "Interactive Developer",
    company: "Udacity",
    location: "Hamburg, Germany",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logoColor: "#01B3E3",
  },
  {
    id: "l7",
    title: "HR Manager",
    company: "Packer",
    location: "Lucern, Switzerland",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logoColor: "#F44D27",
  },
  {
    id: "l8",
    title: "HR Manager",
    company: "Webflow",
    location: "Lucern, Switzerland",
    type: "Full-Time",
    categories: ["Marketing", "Design"],
    logoColor: "#4353FF",
  },
];

export const jobsData: Job[] = [
  ...featuredJobs,
  ...latestJobs,
  {
    id: "3",
    title: "Technical Lead",
    company: "Intel",
    location: "Santa Clara, USA",
    type: "Full Time",
    categories: ["Engineering", "Leadership"],
    logoColor: "#0071C5",
  },
];
