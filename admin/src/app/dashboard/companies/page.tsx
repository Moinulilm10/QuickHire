"use client";

import {
  CompaniesDataContent,
  CompaniesLoadingSkeleton,
} from "@/components/companies/CompaniesDataContent";
import CompanyForm from "@/components/companies/CompanyForm";
import SearchInput from "@/components/ui/SearchInput";
import { useDebounce } from "@/hooks/useDebounce";
import {
  companiesReducer,
  initialCompaniesState,
} from "@/reducers/companies.reducer";
import { companyService } from "@/services/company.service";
import { alertService } from "@/utils/alertService";
import { Loader2, Plus } from "lucide-react";
import {
  Suspense,
  useEffect,
  useReducer,
  useState,
  useTransition,
} from "react";

export default function CompaniesPage() {
  const [state, dispatch] = useReducer(companiesReducer, initialCompaniesState);
  const [isPending, startTransition] = useTransition();
  const [dataPromise, setDataPromise] = useState<Promise<any> | null>(null);

  const debouncedSearch = useDebounce(state.search, 400);

  const refetch = (page?: number, search?: string) => {
    const p = page ?? state.currentPage;
    const s = search ?? debouncedSearch;
    startTransition(() => {
      setDataPromise(companyService.getCompanies(p, 10, s));
    });
  };

  useEffect(() => {
    refetch(1, debouncedSearch);
  }, [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    dispatch({ type: "SET_SEARCH", payload: value });
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
        alertService.success(
          "Success!",
          `Company ${state.currentCompany ? "updated" : "added"} successfully.`,
        );
        dispatch({ type: "CLOSE_MODAL" });
        refetch();
      }
    } catch (error: any) {
      alertService.error(
        "Save Failed",
        error.message || "Failed to save company",
      );
    }
  };

  const handleDelete = async (id: number) => {
    alertService
      .confirm(
        "Are you sure?",
        "Deleting this company will remove all associated data.",
        "Yes, delete it",
        true,
      )
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await companyService.deleteCompany(id);
            if (res.success) {
              alertService.success("Deleted!", "Company has been deleted.");
              refetch();
            }
          } catch (error: any) {
            alertService.error(
              "Delete Failed",
              error.message || "Failed to delete company",
            );
          }
        }
      });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
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
          <Plus size={18} /> Add Company
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

      {/* Data */}
      {!dataPromise ? (
        <CompaniesLoadingSkeleton />
      ) : (
        <Suspense fallback={<CompaniesLoadingSkeleton />}>
          <CompaniesDataContent
            dataPromise={dataPromise}
            isPending={isPending}
            state={state}
            dispatch={dispatch}
            onDelete={handleDelete}
          />
        </Suspense>
      )}

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
              <CompanyForm
                formData={state.formData}
                onChange={(field, value) =>
                  dispatch({ type: "SET_FORM_FIELD", field, value })
                }
                onSubmit={handleSave}
              />
            </div>

            <div className="p-6 border-t border-surface-border flex justify-end gap-3 bg-surface-muted/30">
              <button
                type="button"
                onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-border rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                form="company-form"
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
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
