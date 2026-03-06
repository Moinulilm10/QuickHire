"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import type {
  CategoriesAction,
  CategoriesResponse,
  CategoriesState,
} from "@/reducers/categories.reducer";
import { Edit, List, Loader2, Plus, Trash2 } from "lucide-react";
import { use } from "react";

export function CategoriesDataContent({
  dataPromise,
  isPending,
  state,
  dispatch,
  onDelete,
}: {
  dataPromise: Promise<CategoriesResponse>;
  isPending: boolean;
  state: CategoriesState;
  dispatch: React.Dispatch<CategoriesAction>;
  onDelete: (category: any) => void;
}) {
  const data = use(dataPromise);
  const categories = data.data || [];
  const totalPages = data.pagination?.totalPages || 1;
  const totalCategories = data.pagination?.total || 0;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <List className="text-primary" /> Category Management
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {totalCategories} total categories
            {isPending && (
              <Loader2
                size={14}
                className="inline animate-spin text-primary ml-2"
              />
            )}
          </p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => dispatch({ type: "OPEN_MODAL" })}
        >
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div
        className="transition-opacity duration-200"
        style={{ opacity: isPending ? 0.6 : 1 }}
      >
        <Card className="animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-border text-sm font-semibold text-text-muted">
                  <th className="pb-3 pl-4">Name</th>
                  <th className="pb-3">Jobs Linked</th>
                  <th className="pb-3">Created Date</th>
                  <th className="pb-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <p className="text-text-muted text-sm">
                        No categories found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-surface-border/50 hover:bg-black/5 transition-colors duration-200 group"
                    >
                      <td className="py-4 pl-4 font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                            {category.name.substring(0, 2)}
                          </div>
                          {category.name}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-border text-foreground">
                          {category._count?.jobs || 0}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-text-muted">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() =>
                              dispatch({
                                type: "OPEN_MODAL",
                                payload: category,
                              })
                            }
                            className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(category)}
                            className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 pt-6 border-t border-surface-border">
              <Pagination
                currentPage={state.currentPage}
                totalPages={totalPages}
                onPageChange={(page) =>
                  dispatch({ type: "SET_PAGE", payload: page })
                }
              />
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

export function CategoriesLoadingSkeleton() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <List className="text-primary" /> Category Management
          </h1>
          <p className="text-text-muted text-sm mt-1">Loading...</p>
        </div>
      </div>
      <Card>
        <div className="text-center py-12">
          <Loader2 className="animate-spin text-primary w-8 h-8 mx-auto" />
          <p className="text-text-muted text-sm mt-2">Loading categories...</p>
        </div>
      </Card>
    </>
  );
}
