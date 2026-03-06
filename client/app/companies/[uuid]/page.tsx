"use client";

import JobCard from "@/components/jobs/JobCard";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Pagination from "@/components/ui/Pagination";
import { companyService } from "@/services/company.service";
import { ArrowLeft, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CompanyDetailsPage() {
  const { uuid } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search and Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8;

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!uuid) return;
      try {
        setLoading(true);
        const data = await companyService.getCompanyDetails(uuid as string);
        setCompany(data);
      } catch (error) {
        console.error("Failed to fetch company details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetails();
  }, [uuid]);

  // Reset page to 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col pt-[72px] bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-dark mb-4">
            Company Not Found
          </h1>
          <p className="text-text-muted mb-8 max-w-md">
            The company you are looking for might have been removed or the link
            is broken.
          </p>
          <Link
            href="/companies"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-brand-primary-hover transition-colors"
          >
            Back to Companies
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter jobs explicitly by job title and status
  const filteredJobs = (company.jobs || []).filter((job: any) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate pagination indices
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="min-h-screen flex flex-col pt-[72px] bg-background">
      <Navbar />

      <main className="flex-1 bg-surface-light">
        {/* Breadcrumb & Navigation */}
        <div className="bg-white border-b border-surface-border">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Back to Companies
            </Link>
          </div>
        </div>

        {/* Company Header */}
        <section className="bg-white border-b border-surface-border py-12">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-surface-light border border-surface-border flex shrink-0 items-center justify-center overflow-hidden">
                {company.logo ? (
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-brand-primary font-bold text-4xl">
                    {company.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-text-dark mb-2">
                  {company.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-text-muted font-medium mb-4">
                  <MapPin size={18} />
                  <span>{company.location}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="px-3 py-1 bg-surface-muted border border-surface-border rounded-lg text-sm font-semibold text-text-body">
                    {company.jobs?.length || 0} Active Opportunities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Jobs */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h2 className="text-2xl font-bold text-text-dark mb-2">
                  Open Positions at {company.name}
                </h2>
                <p className="text-text-muted">
                  Explore {filteredJobs.length} open position
                  {filteredJobs.length !== 1 ? "s" : ""} down below.
                </p>
              </div>

              {/* Dynamic Job Search */}
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-text-muted" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search job titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-border bg-white text-text-dark focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            {currentJobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 tracking-tight">
                  {currentJobs.map((job: any, index: number) => {
                    // Format job object to match Job component expectations
                    const formattedJob = {
                      ...job,
                      id: job.id.toString(),
                      uuid: job.uuid,
                      company: company.name,
                      logoColor: company.logoColor || "#0061FF",
                      logoUrl: company.logo,
                      categories: job.categories?.map((c: any) => c.name) || [],
                    };
                    return (
                      <JobCard key={job.id} job={formattedJob} index={index} />
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12 pt-8 border-t border-surface-border flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white border border-surface-border rounded-xl">
                <Search size={48} className="mx-auto text-text-light mb-4" />
                <p className="text-lg font-medium text-text-dark mb-1">
                  {searchTerm
                    ? "No matching jobs found."
                    : "No open positions right now."}
                </p>
                <p className="text-text-muted">
                  {searchTerm
                    ? "Try adjusting your search criteria."
                    : `Check back later to see if new positions open up at ${company.name}.`}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
