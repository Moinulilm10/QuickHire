"use client";

import {
  CategoriesDataContent,
  CategoriesLoadingSkeleton,
} from "@/components/categories/CategoriesDataContent";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  categoriesReducer,
  initialCategoriesState,
} from "@/reducers/categories.reducer";
import { categoryService } from "@/services/category.service";
import { alertService } from "@/utils/alertService";
import { Loader2, X } from "lucide-react";
import { Suspense, useReducer, useState, useTransition } from "react";

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
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-surface-border overflow-hidden animate-fade-in-up">
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
