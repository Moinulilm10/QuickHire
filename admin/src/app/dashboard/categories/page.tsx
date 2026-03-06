"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import { categoryService } from "@/services/category.service";
import { alertService } from "@/utils/alertService";
import { Edit, List, Loader2, Plus, Trash2, X } from "lucide-react";
import { Suspense, use, useReducer, useState, useTransition } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface CategoriesResponse {
  success: boolean;
  data: any[];
  pagination: { total: number; totalPages: number };
  message?: string;
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
interface CategoriesState {
  currentPage: number;
  showModal: boolean;
  editingCategory: any | null;
  categoryName: string;
  isSubmitting: boolean;
  errorText: string;
}

type CategoriesAction =
  | { type: "SET_PAGE"; payload: number }
  | { type: "OPEN_MODAL"; payload?: any }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_CATEGORY_NAME"; payload: string }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string };

const initialCategoriesState: CategoriesState = {
  currentPage: 1,
  showModal: false,
  editingCategory: null,
  categoryName: "",
  isSubmitting: false,
  errorText: "",
};

function categoriesReducer(
  state: CategoriesState,
  action: CategoriesAction,
): CategoriesState {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "OPEN_MODAL":
      return {
        ...state,
        showModal: true,
        editingCategory: action.payload || null,
        categoryName: action.payload?.name || "",
        errorText: "",
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        showModal: false,
        editingCategory: null,
        categoryName: "",
        errorText: "",
      };
    case "SET_CATEGORY_NAME":
      return { ...state, categoryName: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_ERROR":
      return { ...state, errorText: action.payload };
    default:
      return state;
  }
}

// ─── Data Content (uses use()) ───────────────────────────────────────────────
function CategoriesDataContent({
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

      {/* Content */}
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
                            className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(category)}
                            className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
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

          {/* Pagination */}
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

// ─── Loading Skeleton ────────────────────────────────────────────────────────
function CategoriesLoadingSkeleton() {
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

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const [state, dispatch] = useReducer(
    categoriesReducer,
    initialCategoriesState,
  );
  const [isPending, startTransition] = useTransition();
  const [dataPromise, setDataPromise] = useState(() =>
    categoryService.getCategories(1),
  );

  const refetch = (page?: number) => {
    const p = page ?? state.currentPage;
    startTransition(() => {
      setDataPromise(categoryService.getCategories(p));
    });
  };

  // Sync page changes
  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
    refetch(page);
  };

  const handleDelete = async (category: any) => {
    const isLinked = category._count?.jobs > 0;
    const warningText = isLinked
      ? `This category is linked to ${category._count.jobs} job(s). Deleting it will remove the tag from those jobs. `
      : "";

    const confirmed = await alertService.confirm(
      "Are you sure?",
      `${warningText}Confirm deleting the category "${category.name}".`,
      "Delete",
      true,
    );

    if (confirmed.isConfirmed) {
      try {
        const data = await categoryService.deleteCategory(category.id);
        if (data.success) {
          alertService.success("Deleted!", "Category has been removed.");
          refetch();
        } else {
          alertService.error(
            "Error",
            data.message || "Failed to delete category",
          );
        }
      } catch (err) {
        alertService.error("Error", "Connection error");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.categoryName.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Category name is required" });
      return;
    }

    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: "" });

    try {
      const data = state.editingCategory
        ? await categoryService.updateCategory(
            state.editingCategory.id,
            state.categoryName.trim(),
          )
        : await categoryService.createCategory(state.categoryName.trim());

      if (data.success) {
        alertService.success(
          state.editingCategory ? "Updated!" : "Success!",
          state.editingCategory
            ? "Category has been updated."
            : "New category has been created.",
        );
        dispatch({ type: "CLOSE_MODAL" });
        refetch(state.editingCategory ? undefined : 1);
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: data.message || "Failed to save category",
        });
      }
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: "Connection error. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Suspense fallback={<CategoriesLoadingSkeleton />}>
        <CategoriesDataContent
          dataPromise={dataPromise}
          isPending={isPending}
          state={state}
          dispatch={dispatch}
          onDelete={handleDelete}
        />
      </Suspense>

      {/* Add / Edit Modal */}
      {state.showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 cursor-pointer"
            onClick={() => dispatch({ type: "CLOSE_MODAL" })}
          />
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-surface-border overflow-hidden animate-fade-in-up scale-100 opacity-100 transition-transform origin-center">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
              <h2 className="text-lg font-bold text-foreground">
                {state.editingCategory ? "Update Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                className="text-text-muted hover:text-foreground transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6">
              <div className="space-y-4">
                <Input
                  label="Category Name"
                  placeholder="e.g. Software Engineering"
                  value={state.categoryName}
                  onChange={(e) => {
                    dispatch({
                      type: "SET_CATEGORY_NAME",
                      payload: e.target.value,
                    });
                    if (state.errorText)
                      dispatch({ type: "SET_ERROR", payload: "" });
                  }}
                  error={state.errorText}
                  disabled={state.isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-surface-border">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                  disabled={state.isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={state.isSubmitting}>
                  {state.isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : state.editingCategory ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
