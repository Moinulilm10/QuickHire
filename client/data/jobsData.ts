export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Remote" | "Contract" | "Internship";
  categories: string[];
  salary?: string;
  logoColor: string;
}

export const jobsData: Job[] = [
  {
    id: "1",
    title: "Junior UI Designer",
    company: "Talkit",
    location: "Paris, France",
    type: "Full-time",
    categories: ["Design", "UI/UX"],
    logoColor: "#4640DE",
  },
  {
    id: "2",
    title: "Senior Product Designer",
    company: "Dropbox",
    location: "San Francisco, USA",
    type: "Full-time",
    categories: ["Design", "Product"],
    logoColor: "#0061FF",
  },
  {
    id: "3",
    title: "Technical Lead",
    company: "Intel",
    location: "Santa Clara, USA",
    type: "Full-time",
    categories: ["Engineering", "Leadership"],
    logoColor: "#0071C5",
  },
  {
    id: "4",
    title: "Sales Manager",
    company: "Tesla",
    location: "Berlin, Germany",
    type: "Full-time",
    categories: ["Sales", "Management"],
    logoColor: "#E82127",
  },
  {
    id: "5",
    title: "Marketing Associate",
    company: "AMD",
    location: "Austin, USA",
    type: "Full-time",
    categories: ["Marketing", "Growth"],
    logoColor: "#ED1C24",
  },
  {
    id: "6",
    title: "Software Engineer",
    company: "Google",
    location: "Mountain View, USA",
    type: "Full-time",
    categories: ["Technology", "Engineering"],
    logoColor: "#4285F4",
  },
  {
    id: "7",
    title: "HR Specialist",
    company: "Facebook",
    location: "Menlo Park, USA",
    type: "Full-time",
    categories: ["Human Resource", "Operations"],
    logoColor: "#1877F2",
  },
  {
    id: "8",
    title: "Financial Analyst",
    company: "Goldman Sachs",
    location: "New York, USA",
    type: "Full-time",
    categories: ["Finance", "Analyst"],
    logoColor: "#72B9DA",
  },
  {
    id: "9",
    title: "Backend Developer",
    company: "Amazon",
    location: "Seattle, USA",
    type: "Full-time",
    categories: ["Technology", "Backend"],
    logoColor: "#FF9900",
  },
  {
    id: "10",
    title: "Content Strategist",
    company: "Netflix",
    location: "Los Gatos, USA",
    type: "Remote",
    categories: ["Marketing", "Content"],
    logoColor: "#E50914",
  },
  {
    id: "11",
    title: "Project Manager",
    company: "Microsoft",
    location: "Redmond, USA",
    type: "Full-time",
    categories: ["Business", "Management"],
    logoColor: "#00A4EF",
  },
  {
    id: "12",
    title: "Data Scientist",
    company: "Airbnb",
    location: "San Francisco, USA",
    type: "Remote",
    categories: ["Engineering", "Data"],
    logoColor: "#FF5A5F",
  },
];
