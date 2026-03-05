"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import { alertService } from "@/utils/alertService";
import { Edit, List, Loader2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const fetchCategories = async (page: number) => {
    setLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/categories?page=${page}&limit=10`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalCategories(data.pagination.total);
        setCurrentPage(page);
      } else {
        alertService.error(
          "Error",
          data.message || "Failed to fetch categories",
        );
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      alertService.error(
        "Error",
        "An error occurred while fetching categories",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(1);
  }, []);

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
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${apiUrl}/categories/${category.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          alertService.success("Deleted!", "Category has been removed.");
          // If deleting the last item on a page, fetch previous page
          const newPage =
            categories.length === 1 && currentPage > 1
              ? currentPage - 1
              : currentPage;
          fetchCategories(newPage);
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

  const openModal = (category: any = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : "");
    setErrorText("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setCategoryName("");
    setErrorText("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setErrorText("Category name is required");
      return;
    }

    setIsSubmitting(true);
    setErrorText("");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = localStorage.getItem("adminToken");
      const url = editingCategory
        ? `${apiUrl}/categories/${editingCategory.id}`
        : `${apiUrl}/categories`;
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        alertService.success(
          editingCategory ? "Updated!" : "Success!",
          editingCategory
            ? "Category has been updated."
            : "New category has been created.",
        );
        closeModal();
        fetchCategories(editingCategory ? currentPage : 1);
      } else {
        setErrorText(data.message || "Failed to save category");
      }
    } catch (err) {
      setErrorText("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <List className="text-primary" /> Category Management
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {totalCategories} total categories
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => openModal()}>
          Add Category
        </Button>
      </div>

      {/* Content */}
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <Loader2 className="animate-spin text-primary w-8 h-8 mx-auto" />
                    <p className="text-text-muted text-sm mt-2">
                      Loading categories...
                    </p>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
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
                          onClick={() => openModal(category)}
                          className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
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
        {!loading && totalPages > 1 && (
          <div className="mt-6 pt-6 border-t border-surface-border">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchCategories(page)}
            />
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 cursor-pointer"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-surface-border overflow-hidden animate-fade-in-up scale-100 opacity-100 transition-transform origin-center">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
              <h2 className="text-lg font-bold text-foreground">
                {editingCategory ? "Update Category" : "Add New Category"}
              </h2>
              <button
                onClick={closeModal}
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
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    if (errorText) setErrorText("");
                  }}
                  error={errorText}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-surface-border">
                <Button
                  variant="outline"
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : editingCategory ? (
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
