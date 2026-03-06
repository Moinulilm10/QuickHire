"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Pagination from "@/components/ui/Pagination";
import {
  companiesInitialState,
  companiesReducer,
  Company,
} from "@/reducers/companiesReducer";
import { companyService } from "@/services/company.service";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Suspense,
  use,
  useEffect,
  useReducer,
  useRef,
  useTransition,
} from "react";

const companiesPerPage = 8;

// ─── Data Fetcher ────────────────────────────────────────
function fetchCompanies(
  page: number,
  search: string,
): Promise<{
  companies: Company[];
  totalPages: number;
  totalCompanies: number;
}> {
  return companyService
    .getAllCompanies(page, companiesPerPage, search)
    .then((res) => ({
      companies: res.data,
      totalPages: res.pagination?.totalPages || 1,
      totalCompanies: res.pagination?.total || 0,
    }))
    .catch((error) => {
      console.error("Failed to fetch companies:", error);
      return { companies: [], totalPages: 1, totalCompanies: 0 };
    });
}

// ─── Inner Content ───────────────────────────────────────
function CompaniesContent({
  dataPromise,
  currentPage,
  onPageChange,
}: {
  dataPromise: Promise<{
    companies: Company[];
    totalPages: number;
    totalCompanies: number;
  }>;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const data = use(dataPromise);
  const { companies, totalPages, totalCompanies } = data;

  return (
    <>
      <div className="mb-8 flex justify-between items-center text-text-dark font-medium">
        <h2 className="text-xl">
          All Companies{" "}
          <span className="text-text-muted text-sm ml-2">
            ({totalCompanies})
          </span>
        </h2>
      </div>

      {companies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {companies.map((company, index) => (
              <Link
                key={company.id}
                href={`/companies/${company.uuid}`}
                className="block group"
              >
                <div
                  className="bg-white border border-surface-border rounded-xl p-6 hover:shadow-card hover:border-brand-primary transition-all duration-300 animate-fade-in-up h-full flex flex-col items-center text-center"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-20 h-20 rounded-2xl bg-surface-light border border-surface-border flex items-center justify-center overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                    {company.logo ? (
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-brand-primary font-bold text-2xl">
                        {company.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-text-dark mb-1 group-hover:text-brand-primary transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-4">
                    {company.location}
                  </p>
                  <div className="mt-auto flex flex-col sm:flex-row gap-2 w-full justify-center">
                    <span className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-semibold">
                      {company.jobs?.length || 0} Jobs Available
                    </span>
                    <span className="px-4 py-1.5 bg-surface-muted border border-surface-border text-text-body rounded-full text-xs font-semibold">
                      {company._count?.applications || 0} Applications
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 pt-8 border-t border-surface-border flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-surface rounded-xl border border-surface-border">
          <Search size={48} className="mx-auto text-text-light mb-4" />
          <h3 className="text-xl font-bold text-text-dark mb-2">
            No Companies Found
          </h3>
          <p className="text-text-muted">
            We could not find any companies matching your search. Try different
            keywords.
          </p>
        </div>
      )}
    </>
  );
}

// ─── Skeleton ────────────────────────────────────────────
function CompaniesSkeleton() {
  return (
    <>
      <div className="mb-8 h-7 w-48 bg-surface-muted animate-pulse rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[280px] bg-white/50 animate-pulse rounded-xl border border-surface-border shadow-sm"
          />
        ))}
      </div>
    </>
  );
}

// ─── Page Component ──────────────────────────────────────
export default function CompaniesPage() {
  const [state, dispatch] = useReducer(companiesReducer, companiesInitialState);
  const [isPending, startTransition] = useTransition();
  const promiseRef = useRef(fetchCompanies(1, ""));

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "SET_DEBOUNCED_SEARCH", payload: state.searchTerm });
    }, 400);

    return () => clearTimeout(timer);
  }, [state.searchTerm]);

  // Re-fetch when page or debounced search changes
  useEffect(() => {
    startTransition(() => {
      promiseRef.current = fetchCompanies(
        state.currentPage,
        state.debouncedSearch,
      );
    });
  }, [state.currentPage, state.debouncedSearch]);

  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
  };

  return (
    <div className="min-h-screen flex flex-col pt-[72px] bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-surface border-b border-surface-border py-12 lg:py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-bold text-text-dark mb-4 tracking-tight">
              Discover <span className="text-brand-primary">Companies</span>
            </h1>
            <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8">
              Find the perfect workplace. Browse through top companies and
              discover where your next career move could be.
            </p>

            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search
                  className="text-text-muted group-focus-within:text-brand-primary transition-colors"
                  size={20}
                />
              </div>
              <input
                type="text"
                placeholder="Search by company name..."
                value={state.searchTerm}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH", payload: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-surface-border bg-white text-text-dark focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
              />
            </div>
          </div>
        </section>

        {/* Companies Grid */}
        <section className="py-12 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className={isPending ? "opacity-60 transition-opacity" : ""}>
              <Suspense fallback={<CompaniesSkeleton />}>
                <CompaniesContent
                  dataPromise={promiseRef.current}
                  currentPage={state.currentPage}
                  onPageChange={handlePageChange}
                />
              </Suspense>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
