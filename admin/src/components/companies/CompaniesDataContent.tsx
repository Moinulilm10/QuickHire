"use client";

import Pagination from "@/components/ui/Pagination";
import type {
  CompaniesAction,
  CompaniesResponse,
  CompaniesState,
} from "@/reducers/companies.reducer";
import { Edit2, Trash2 } from "lucide-react";
import { use } from "react";

export function CompaniesDataContent({
  dataPromise,
  isPending,
  state,
  dispatch,
  onDelete,
}: {
  dataPromise: Promise<CompaniesResponse>;
  isPending: boolean;
  state: CompaniesState;
  dispatch: React.Dispatch<CompaniesAction>;
  onDelete: (id: number) => void;
}) {
  const data = use(dataPromise);
  const companies = data.data || [];
  const totalPages = data.pagination?.totalPages || 1;
  const totalCompanies = data.pagination?.total || 0;

  return (
    <>
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
                      <p className="font-semibold text-foreground">
                        {company.name}
                      </p>
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

export function CompaniesLoadingSkeleton() {
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
