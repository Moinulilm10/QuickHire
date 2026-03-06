"use client";

import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import { CompanyPayload, companyService } from "@/services/company.service";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { Suspense, use, useReducer, useState, useTransition } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Company {
  id: number;
  uuid: string;
  name: string;
  location: string;
  logo: string | null;
  jobs: any[];
}

interface CompaniesResponse {
  success: boolean;
  data: Company[];
  pagination?: { total: number; totalPages: number };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
interface CompaniesState {
  search: string;
  currentPage: number;
  isModalOpen: boolean;
  currentCompany: Partial<Company> | null;
  formData: CompanyPayload;
}

type CompaniesAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "OPEN_MODAL"; payload?: Company }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_FORM_FIELD"; field: keyof CompanyPayload; value: string };

const initialFormData: CompanyPayload = { name: "", location: "", logo: "" };

const initialState: CompaniesState = {
  search: "",
  currentPage: 1,
  isModalOpen: false,
  currentCompany: null,
  formData: initialFormData,
};

function companiesReducer(
  state: CompaniesState,
  action: CompaniesAction,
): CompaniesState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, currentPage: 1 };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "OPEN_MODAL":
      return {
        ...state,
        isModalOpen: true,
        currentCompany: action.payload || null,
        formData: action.payload
          ? {
              name: action.payload.name,
              location: action.payload.location,
              logo: action.payload.logo || "",
            }
          : initialFormData,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        isModalOpen: false,
        currentCompany: null,
        formData: initialFormData,
      };
    case "SET_FORM_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };
    default:
      return state;
  }
}

// ─── Data Content (uses use() to read promise) ──────────────────────────────
function CompaniesDataContent({
  dataPromise,
  isPending,
  state,
  dispatch,
  onSave,
  onDelete,
  onRefetch,
}: {
  dataPromise: Promise<CompaniesResponse>;
  isPending: boolean;
  state: CompaniesState;
  dispatch: React.Dispatch<CompaniesAction>;
  onSave: (e: React.FormEvent) => void;
  onDelete: (id: number) => void;
  onRefetch: () => void;
}) {
  const data = use(dataPromise);
  const companies = data.data || [];
  const totalPages = data.pagination?.totalPages || 1;
  const totalCompanies = data.pagination?.total || 0;

  return (
    <>
      {/* Table grid */}
      <div
        className="bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden transition-opacity duration-200"
        style={{ opacity: isPending ? 0.6 : 1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 font-medium text-foreground">
                  Company
                </th>
                <th className="px-6 py-4 font-medium text-foreground">
                  Location
                </th>
                <th className="px-6 py-4 font-medium text-foreground">
                  Active Jobs
                </th>
                <th className="px-6 py-4 font-medium text-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className="hover:bg-surface-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {company.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {company.location}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {company.jobs?.length || 0} jobs
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          dispatch({ type: "OPEN_MODAL", payload: company })
                        }
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(company.id)}
                        className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={state.currentPage}
            totalPages={totalPages}
            onPageChange={(page) =>
              dispatch({ type: "SET_PAGE", payload: page })
            }
          />
        </div>
      )}

      {/* Total count badge */}
      <p className="text-xs text-muted-foreground text-center mt-2">
        Showing{" "}
        {companies.length > 0
          ? `${(state.currentPage - 1) * 10 + 1}–${(state.currentPage - 1) * 10 + companies.length}`
          : "0"}{" "}
        of {totalCompanies} companies
      </p>
    </>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────
function CompaniesLoadingSkeleton() {
  return (
    <div className="bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted border-b border-surface-border">
            <tr>
              <th className="px-6 py-4 font-medium text-foreground">Company</th>
              <th className="px-6 py-4 font-medium text-foreground">
                Location
              </th>
              <th className="px-6 py-4 font-medium text-foreground">
                Active Jobs
              </th>
              <th className="px-6 py-4 font-medium text-foreground text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-border animate-pulse" />
                    <div className="h-4 w-32 bg-surface-border animate-pulse rounded" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-24 bg-surface-border animate-pulse rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-16 bg-surface-border animate-pulse rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 w-20 bg-surface-border animate-pulse rounded float-right" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function CompaniesPage() {
  const [state, dispatch] = useReducer(companiesReducer, initialState);
  const [isPending, startTransition] = useTransition();

  // Promise-in-state pattern: initial fetch created in useState initializer
  const [dataPromise, setDataPromise] = useState(() =>
    companyService.getCompanies(1, 10),
  );

  // Debounced search: store timeout ref
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const refetch = (page?: number, search?: string) => {
    const p = page ?? state.currentPage;
    const s = search ?? state.search;
    startTransition(() => {
      setDataPromise(companyService.getCompanies(p, 10, s));
    });
  };

  const handleSearchChange = (value: string) => {
    dispatch({ type: "SET_SEARCH", payload: value });

    // Debounce — clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      startTransition(() => {
        setDataPromise(companyService.getCompanies(1, 10, value));
      });
    }, 400);
    setSearchTimeout(timeout);
  };

  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
    refetch(page);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = state.currentCompany
        ? await companyService.updateCompany(
            state.currentCompany.id!,
            state.formData,
          )
        : await companyService.createCompany(state.formData);

      if (res.success) {
        dispatch({ type: "CLOSE_MODAL" });
        refetch();
      }
    } catch (error) {
      console.error("Failed to save company", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      const res = await companyService.deleteCompany(id);
      if (res.success) {
        refetch();
      }
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-24 font-bold text-foreground">Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage company profiles and details.
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: "OPEN_MODAL" })}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Add Company
        </button>
      </div>

      {/* Search */}
      <div className="bg-surface border border-surface-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <SearchInput
          placeholder="Search companies..."
          value={state.search}
          onChange={handleSearchChange}
          className="w-full sm:w-96"
        />
        {isPending && (
          <Loader2 size={18} className="animate-spin text-primary shrink-0" />
        )}
      </div>

      {/* Data — Suspense wraps the use() consumer */}
      <Suspense fallback={<CompaniesLoadingSkeleton />}>
        <CompaniesDataContent
          dataPromise={dataPromise}
          isPending={isPending}
          state={state}
          dispatch={dispatch}
          onSave={handleSave}
          onDelete={handleDelete}
          onRefetch={() => refetch()}
        />
      </Suspense>

      {/* Modal */}
      {state.isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-surface-border">
              <h2 className="text-xl font-bold text-foreground">
                {state.currentCompany ? "Edit Company" : "Add Company"}
              </h2>
            </div>

            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={state.formData.name}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FORM_FIELD",
                        field: "name",
                        value: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={state.formData.location}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FORM_FIELD",
                        field: "location",
                        value: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={state.formData.logo}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FORM_FIELD",
                        field: "logo",
                        value: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-surface-border flex justify-end gap-3 bg-surface-muted/30">
              <button
                type="button"
                onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-border rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {state.currentCompany ? "Save Changes" : "Add Company"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
